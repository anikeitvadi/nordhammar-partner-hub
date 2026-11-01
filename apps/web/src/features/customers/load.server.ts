import 'server-only'
import { transition, type CanonicalPayload, type Domain, type Region, type RequestState } from '@intake/contracts'
import { sql } from '@/lib/db'
import type { Principal } from '@/features/auth/scope'

// Stands in for the nightly hub load: every request the ERP created since the last load becomes a golden record
// (matched to the request by tax ID, as the real load does), the request gains its golden id, and the identity
// reservation is released because the hub now holds the identity. Until this runs, search cannot see the partner
// and the request page says so. That limit is real and stated, not hidden behind a cache trick.
export async function runDailyLoad(principal: Principal): Promise<{ loaded: number; regions: Region[] }> {
  if (!(principal.globalIdentity && (principal.role === 'operator' || principal.role === 'reviewer'))) return { loaded: 0, regions: [] }
  const db = sql()
  const rows = await db`select r.request_id, r.domain, r.region, r.state, v.payload from requests r join request_revisions v on v.request_id = r.request_id and v.revision = r.current_revision where r.state_kind = 'created' and (r.state->>'goldenId') is null`
  const regions = new Set<Region>()
  let loaded = 0
  for (const r of rows) {
    const state = r.state as RequestState
    if (state.kind !== 'created') continue
    const p = r.payload as CanonicalPayload
    const domain = r.domain as Domain
    const region = r.region as Region
    const goldenId = `${domain === 'customer' ? 'G' : 'S'}-${state.erpNumber}`
    const t = transition(state, { type: 'golden_loaded', goldenId })
    if (!t.ok) continue
    const main = p.addresses.find((a) => a.kind === (domain === 'customer' ? 'bill_to' : 'remit_to')) ?? p.addresses[0]
    const source = region === 'CN' ? 'LAKE_CN' : region === 'EU' ? 'ERP2_EU' : `ERP1_${region}`
    const statements = [
      db`insert into parties (golden_id, domain, legal_name, local_name, city, street, street_number, region, country, tax_scheme, tax_canonical, tax_company_key, identifiers, duns, erp_system, erp_number, erp_segment, type_code, industry, payment_terms, updated_by)
        values (${goldenId}, ${domain}, ${p.legalName}, ${p.localName}, ${main.city}, ${main.street}, ${main.number}, ${region}, ${p.identity.country}, ${p.identity.scheme}, ${p.identity.canonical}, ${companyKey(p.identity)}, ${JSON.stringify(p.identifiers)}::jsonb, ${p.duns}, ${p.destination.erp}, ${state.erpNumber}, ${'NH-' + region}, ${p.typeCode}, ${p.industry}, ${p.paymentTerms}, ${'hub load'})
        on conflict (golden_id) do nothing`,
      ...p.addresses.map((a, i) => db`insert into party_addresses (golden_id, source_address_id, kind, street, street_number, complement, district, city, region_code, postal_code, country, is_default)
        values (${goldenId}, ${`${state.erpNumber}-${i + 1}`}, ${a.kind}, ${a.street}, ${a.number}, ${a.complement}, ${a.district}, ${a.city}, ${a.regionCode}, ${a.postalCode}, ${a.country}, ${i === 0}) on conflict do nothing`),
      db`insert into party_sources (golden_id, source_system, source_id) values (${goldenId}, ${source}, ${state.erpNumber}) on conflict do nothing`,
      db`update requests set state = ${JSON.stringify(t.next)}::jsonb, updated_at = now() where request_id = ${r.request_id as string} and state_kind = 'created'`,
      db`delete from identity_reservations where domain = ${domain} and tax_canonical = ${p.identity.canonical} and request_id = ${r.request_id as string}`,
      db`insert into request_events (request_id, kind, actor, detail) values (${r.request_id as string}, 'hub_loaded', 'hub load', ${JSON.stringify({ goldenId })}::jsonb)`,
    ]
    await db.transaction(statements)
    regions.add(region); loaded++
  }
  return { loaded, regions: [...regions] }
}

function companyKey(id: CanonicalPayload['identity']): string {
  if (id.scheme === 'CNPJ') return id.canonical.slice(0, 8)
  if (id.scheme === 'GSTIN') return id.canonical.slice(2, 12)
  return id.canonical
}
