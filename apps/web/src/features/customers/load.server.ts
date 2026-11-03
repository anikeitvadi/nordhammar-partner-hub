import 'server-only'
import { transition, type GoldenRecord, type Region, type RequestState } from '@intake/contracts'
import { sql } from '@/lib/db'
import { isCentral, type Principal } from '@/features/auth/scope'

// The nightly hub load, writing side. The records come from the customer's integration platform (read through
// erp.server, the one network path); this module only writes them into the hub. Golden records arrive already cleansed
// (log §16b): the load upserts, it does not match. A request the ERP created becomes searchable when its golden record
// arrives: matched by ERP and number, it gains its golden id and its identity reservation is released. Until then search
// cannot see the partner and the request page says so.

export async function loadCursor(): Promise<string | null> {
  const r = await sql()`select cursor from hub_load_state where id = 1`
  return (r[0]?.cursor as string | null) ?? null
}

export async function applyGoldenRecords(principal: Principal, records: GoldenRecord[], next: string | null): Promise<{ loaded: number; linked: number; regions: Region[] }> {
  if (!isCentral(principal) || records.length === 0) return { loaded: 0, linked: 0, regions: [] }
  const db = sql()
  const regions = new Set<Region>()
  // Pass 1: the records themselves, their addresses, lineage and money. Parents wait for pass 2: a parent can arrive
  // later in the same load.
  for (const g of records) {
    await db.transaction([
      ...(g.group ? [db`insert into groups (group_id, name) values (${g.group.id}, ${g.group.name}) on conflict (group_id) do update set name = excluded.name`] : []),
      db`insert into parties (golden_id, domain, legal_name, local_name, aliases, tax_scheme, tax_canonical, tax_company_key, identifiers, duns, duns_rating, region, country, erp_system, erp_number, erp_segment, user_ref, type_code, industry, status, payment_terms, currency, risk_rating, inception_at, last_activity_at, updated_by, group_id, city, street, street_number, loaded_at)
        values (${g.goldenId}, ${g.domain}, ${g.legalName}, ${g.localName}, ${g.aliases}, ${g.taxScheme}, ${g.taxCanonical}, ${g.taxCompanyKey}, ${JSON.stringify(g.identifiers)}::jsonb, ${g.duns}, ${g.dunsRating}, ${g.region}, ${g.country}, ${g.erp}, ${g.erpNumber}, ${g.erpSegment}, ${g.userRef}, ${g.typeCode}, ${g.industry}, ${g.status}, ${g.paymentTerms}, ${g.currency}, ${g.riskRating}, ${g.inceptionAt}, ${g.lastActivityAt}, ${'hub load'}, ${g.group?.id ?? null}, ${g.city}, ${g.street}, ${g.streetNumber}, now())
        on conflict (golden_id) do update set domain = excluded.domain, legal_name = excluded.legal_name, local_name = excluded.local_name, aliases = excluded.aliases, tax_scheme = excluded.tax_scheme, tax_canonical = excluded.tax_canonical, tax_company_key = excluded.tax_company_key, identifiers = excluded.identifiers, duns = excluded.duns, duns_rating = excluded.duns_rating, region = excluded.region, country = excluded.country, erp_system = excluded.erp_system, erp_number = excluded.erp_number, erp_segment = excluded.erp_segment, user_ref = excluded.user_ref, type_code = excluded.type_code, industry = excluded.industry, status = excluded.status, payment_terms = excluded.payment_terms, currency = excluded.currency, risk_rating = excluded.risk_rating, inception_at = excluded.inception_at, last_activity_at = excluded.last_activity_at, updated_by = excluded.updated_by, group_id = excluded.group_id, city = excluded.city, street = excluded.street, street_number = excluded.street_number, loaded_at = excluded.loaded_at`,
      db`delete from party_addresses where golden_id = ${g.goldenId}`,
      ...g.addresses.map((a) => db`insert into party_addresses (golden_id, source_address_id, kind, street, street_number, complement, district, city, region_code, postal_code, country, is_default)
        values (${g.goldenId}, ${a.sourceAddressId}, ${a.kind}, ${a.street}, ${a.number}, ${a.complement}, ${a.district}, ${a.city}, ${a.regionCode}, ${a.postalCode}, ${a.country}, ${a.isDefault})`),
      db`delete from party_sources where golden_id = ${g.goldenId}`,
      ...g.sources.map((s) => db`insert into party_sources (golden_id, source_system, source_id, loaded_at) values (${g.goldenId}, ${s.system}, ${s.id}, ${s.loadedAt})`),
      db`delete from regional_credit where golden_id = ${g.goldenId}`,
      ...g.credit.map((c) => db`insert into regional_credit (golden_id, region, credit_limit, currency, terms) values (${g.goldenId}, ${c.region}, ${c.limit}, ${c.currency}, ${c.terms})`),
      db`delete from regional_spend where golden_id = ${g.goldenId}`,
      ...g.spend.map((s) => db`insert into regional_spend (golden_id, region, spend_ytd, currency, open_invoices) values (${g.goldenId}, ${s.region}, ${s.ytd}, ${s.currency}, ${s.openInvoices})`),
    ])
    regions.add(g.region)
  }
  // Pass 2: hierarchy, now that every record in this load exists. A parent the hub has never seen is left unset.
  for (const g of records) {
    if (!g.parentGoldenId && !g.ultimateParentGoldenId) continue
    await db`update parties set parent_golden_id = (select golden_id from parties where golden_id = ${g.parentGoldenId}), ultimate_parent_golden_id = (select golden_id from parties where golden_id = ${g.ultimateParentGoldenId}) where golden_id = ${g.goldenId}`
  }
  // Pass 3: every created request still waiting for its golden record, matched by ERP and number against the whole
  // hub, not only this load: a partner the ERP committed during a stop can arrive before the stop is reconciled, and
  // the request is linked on the first load after it becomes created.
  let linked = 0
  {
    const waiting = await db`select r.request_id, r.state, p.golden_id from requests r
      join request_revisions v on v.request_id = r.request_id and v.revision = r.current_revision
      join parties p on p.domain = r.domain and p.erp_number = r.state->>'erpNumber' and p.erp_system = v.payload->'destination'->>'erp'
      where r.state_kind = 'created' and (r.state->>'goldenId') is null`
    for (const r of waiting) {
      const state = r.state as RequestState
      const t = transition(state, { type: 'golden_loaded', goldenId: r.golden_id as string })
      if (!t.ok) continue
      await db.transaction([
        db`update requests set state = ${JSON.stringify(t.next)}::jsonb where request_id = ${r.request_id as string} and state_kind = 'created'`,
        db`delete from identity_reservations where request_id = ${r.request_id as string}`,
        db`insert into request_events (request_id, kind, actor, detail) values (${r.request_id as string}, 'hub_loaded', 'hub load', ${JSON.stringify({ goldenId: r.golden_id })}::jsonb)`,
      ])
      linked++
    }
  }
  await db`insert into hub_load_state (id, cursor, last_run_at, last_count) values (1, ${next}, now(), ${records.length})
    on conflict (id) do update set cursor = coalesce(excluded.cursor, hub_load_state.cursor), last_run_at = excluded.last_run_at, last_count = excluded.last_count`
  return { loaded: records.length, linked, regions: [...regions] }
}
