import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import type { AddressKind, Domain, Region } from '@intake/contracts'
import { sql } from '@/lib/db'
import { canSeeIdentity, canSeeMoney, ScopeError, type Principal } from '@/features/auth/scope'
import type { Candidate } from '@/features/intake/match'

// Boundary 1 of 3. Owns every authorized read of the partner hub (customers and suppliers).
// Scope is checked HERE, before any SQL, with the principal's fresh entitlements. Cached functions below take only
// (domain, region, query): auth is read outside the cache, and the cache key is the region, so a cached entry can
// never serve a region the caller was not checked against.

export type PartySummary = { goldenId: string; domain: Domain; legalName: string; city: string; region: Region; erpNumber: string | null; typeCode: string | null; status: string; industry: string | null }
export type GroupMember = { goldenId: string; legalName: string; region: Region; domain: Domain }
export type PartyAddress = { kind: AddressKind; street: string; number: string | null; complement: string | null; district: string | null; city: string; regionCode: string | null; postalCode: string | null; country: string; isDefault: boolean }
export type PartySource = { system: string; sourceId: string; loadedAt: string }
export type PartyDetail = PartySummary & {
  localName: string | null
  country: string
  taxScheme: string | null
  taxCanonical: string | null
  identifiers: { scheme: string; value: string }[]
  duns: string | null
  dunsRating: string | null
  erpSystem: string | null
  erpSegment: string | null
  userRef: string | null
  paymentTerms: string | null
  currency: string | null
  riskRating: string | null
  inceptionAt: string | null
  lastActivityAt: string | null
  updatedBy: string | null
  aliases: string[]
  loadedAt: string
  group: { name: string; members: GroupMember[] } | null
  parent: { goldenId: string; legalName: string } | null
  ultimateParent: { goldenId: string; legalName: string } | null
  addresses: PartyAddress[]
  sources: PartySource[]
  // Money is regional and separately entitled. Customers carry a credit line, suppliers spend to date.
  money:
    | { kind: 'credit'; limit: number; currency: string; terms: string }
    | { kind: 'spend'; ytd: number; openInvoices: number; currency: string }
    | null
    | 'not_entitled'
}

export type SearchOutcome = { results: PartySummary[]; foreignRegion: Region | null }

// Search by legal name, alias, normalised tax ID, DUNS, city or ERP number, inside one region of one domain.
// The foreign hint: the query is a tax ID that exists in a region the caller cannot see. One line, no details.
export async function searchParties(principal: Principal, domain: Domain, region: Region, query: string): Promise<SearchOutcome> {
  if (!canSeeIdentity(principal, region)) throw new ScopeError(`no identity access to ${region}`)
  const q = query.trim()
  if (!q) return { results: [], foreignRegion: null }
  const [results, foreign] = await Promise.all([cachedSearch(domain, region, q.toLowerCase()), foreignTaxIdRegion(principal, domain, q)])
  return { results, foreignRegion: foreign }
}

// Same read without the cache, for tests and for callers that must see this second's hub (none in the UI today).
export async function searchPartiesUncached(principal: Principal, domain: Domain, region: Region, query: string): Promise<SearchOutcome> {
  if (!canSeeIdentity(principal, region)) throw new ScopeError(`no identity access to ${region}`)
  const q = query.trim()
  if (!q) return { results: [], foreignRegion: null }
  const [results, foreign] = await Promise.all([querySearch(domain, region, q.toLowerCase()), foreignTaxIdRegion(principal, domain, q)])
  return { results, foreignRegion: foreign }
}

async function cachedSearch(domain: Domain, region: Region, q: string): Promise<PartySummary[]> {
  'use cache'
  cacheTag(`hub:${region}`)
  cacheLife('minutes')
  return querySearch(domain, region, q)
}

async function querySearch(domain: Domain, region: Region, q: string): Promise<PartySummary[]> {
  const canon = q.toUpperCase().replace(/[^0-9A-Z]/g, '')
  const like = '%' + q + '%'
  const rows = await sql()`select golden_id, domain, legal_name, city, region, erp_number, type_code, status, industry from parties
    where domain = ${domain} and region = ${region} and (
      lower(legal_name) like ${like} or lower(coalesce(local_name, '')) like ${like}
      or exists (select 1 from unnest(aliases) a where lower(a) like ${like})
      or lower(city) like ${like}
      or (${canon} <> '' and (tax_canonical = ${canon} or tax_canonical like ${'%' + canon} or duns = ${canon} or upper(erp_number) = ${canon} or upper(coalesce(user_ref, '')) = ${canon}))
    )
    order by legal_name limit 25`
  return rows.map(toSummary)
}

async function foreignTaxIdRegion(principal: Principal, domain: Domain, q: string): Promise<Region | null> {
  const canon = q.toUpperCase().replace(/[^0-9A-Z]/g, '')
  if (canon.length < 8) return null
  const rows = await sql()`select region from parties where domain = ${domain} and (tax_canonical = ${canon} or tax_canonical like ${'%' + canon}) limit 3`
  const hidden = rows.map((r) => r.region as Region).find((r) => !canSeeIdentity(principal, r))
  return hidden ?? null
}

function toSummary(r: Record<string, unknown>): PartySummary {
  return { goldenId: r.golden_id as string, domain: r.domain as Domain, legalName: r.legal_name as string, city: r.city as string, region: r.region as Region, erpNumber: (r.erp_number as string | null) ?? null, typeCode: (r.type_code as string | null) ?? null, status: r.status as string, industry: (r.industry as string | null) ?? null }
}

export async function getParty(principal: Principal, goldenId: string): Promise<PartyDetail | null> {
  const db = sql()
  const rows = await db`select p.*, g.name as group_name, pp.legal_name as parent_name, up.legal_name as ultimate_name
    from parties p left join groups g on g.group_id = p.group_id
    left join parties pp on pp.golden_id = p.parent_golden_id left join parties up on up.golden_id = p.ultimate_parent_golden_id
    where p.golden_id = ${goldenId}`
  const r = rows[0]
  if (!r) return null
  const region = r.region as Region
  // Not visible reads as not found, so existence in another region never leaks through a URL.
  if (!canSeeIdentity(principal, region)) return null
  const domain = r.domain as Domain
  const [members, addresses, sources] = await Promise.all([
    r.group_id ? db`select golden_id, legal_name, region, domain from parties where group_id = ${r.group_id} and golden_id <> ${goldenId} order by region, legal_name` : Promise.resolve([]),
    db`select * from party_addresses where golden_id = ${goldenId} order by is_default desc, kind, city`,
    db`select source_system, source_id, loaded_at from party_sources where golden_id = ${goldenId} order by loaded_at desc`,
  ])
  let money: PartyDetail['money'] = 'not_entitled'
  if (canSeeMoney(principal, region)) {
    if (domain === 'customer') {
      const cr = await db`select credit_limit, currency, terms from regional_credit where golden_id = ${goldenId} and region = ${region}`
      money = cr[0] ? { kind: 'credit', limit: Number(cr[0].credit_limit), currency: cr[0].currency as string, terms: cr[0].terms as string } : null
    } else {
      const sp = await db`select spend_ytd, open_invoices, currency from regional_spend where golden_id = ${goldenId} and region = ${region}`
      money = sp[0] ? { kind: 'spend', ytd: Number(sp[0].spend_ytd), openInvoices: Number(sp[0].open_invoices), currency: sp[0].currency as string } : null
    }
  }
  const d = (v: unknown) => (v ? new Date(v as string).toISOString().slice(0, 10) : null)
  return {
    ...toSummary(r),
    localName: (r.local_name as string | null) ?? null, country: r.country as string,
    taxScheme: (r.tax_scheme as string | null) ?? null, taxCanonical: (r.tax_canonical as string | null) ?? null,
    identifiers: (r.identifiers as { scheme: string; value: string }[]) ?? [],
    duns: (r.duns as string | null) ?? null, dunsRating: (r.duns_rating as string | null) ?? null,
    erpSystem: (r.erp_system as string | null) ?? null, erpSegment: (r.erp_segment as string | null) ?? null, userRef: (r.user_ref as string | null) ?? null,
    paymentTerms: (r.payment_terms as string | null) ?? null, currency: (r.currency as string | null) ?? null, riskRating: (r.risk_rating as string | null) ?? null,
    inceptionAt: d(r.inception_at), lastActivityAt: d(r.last_activity_at), updatedBy: (r.updated_by as string | null) ?? null,
    aliases: (r.aliases as string[]) ?? [], loadedAt: new Date(r.loaded_at as string).toISOString(),
    group: r.group_id ? { name: r.group_name as string, members: members.map((m) => ({ goldenId: m.golden_id as string, legalName: m.legal_name as string, region: m.region as Region, domain: m.domain as Domain })) } : null,
    parent: r.parent_golden_id ? { goldenId: r.parent_golden_id as string, legalName: r.parent_name as string } : null,
    ultimateParent: r.ultimate_parent_golden_id ? { goldenId: r.ultimate_parent_golden_id as string, legalName: r.ultimate_name as string } : null,
    addresses: addresses.map((a) => ({ kind: a.kind as AddressKind, street: a.street as string, number: (a.street_number as string | null) ?? null, complement: (a.complement as string | null) ?? null, district: (a.district as string | null) ?? null, city: a.city as string, regionCode: (a.region_code as string | null) ?? null, postalCode: (a.postal_code as string | null) ?? null, country: a.country as string, isDefault: a.is_default as boolean })),
    sources: sources.map((s) => ({ system: s.source_system as string, sourceId: s.source_id as string, loadedAt: new Date(s.loaded_at as string).toISOString() })),
    money,
  }
}

// Live, never cached: the dup-check must see today's hub. Returns the full candidate only when the match is inside
// the caller's visibility; otherwise the region alone, so "exists in EU, contact the EU team" never carries a name or an ID.
export async function exactTaxIdLookup(principal: Principal, domain: Domain, taxCanonical: string): Promise<{ visible: Candidate } | { foreignRegion: Region } | null> {
  const rows = await sql()`select p.golden_id, p.legal_name, p.aliases, p.city, p.street, p.region, p.country, p.tax_scheme, p.tax_canonical, p.tax_company_key, g.name as group_name
    from parties p left join groups g on g.group_id = p.group_id where p.domain = ${domain} and p.tax_canonical = ${taxCanonical} limit 1`
  const r = rows[0]
  if (!r) return null
  const region = r.region as Region
  if (!canSeeIdentity(principal, region)) return { foreignRegion: region }
  return { visible: toCandidate(r) }
}

// Live, never cached, region-scoped: the name/alias candidates the preflight compares against. Returns the DTO the
// model may see. Nothing from another region is ever in this list; the foreign case is handled by exactTaxIdLookup.
export async function findNameCandidates(principal: Principal, domain: Domain, region: Region, name: string): Promise<Candidate[]> {
  if (!canSeeIdentity(principal, region)) throw new ScopeError(`no identity access to ${region}`)
  const words = name.toLowerCase().split(/\s+/).filter((w) => w.length >= 3).slice(0, 3)
  if (words.length === 0) return []
  const like = `%${words[0]}%`
  const rows = await sql()`select p.golden_id, p.legal_name, p.aliases, p.city, p.street, p.country, p.tax_scheme, p.tax_canonical, p.tax_company_key, g.name as group_name
    from parties p left join groups g on g.group_id = p.group_id
    where p.domain = ${domain} and p.region = ${region} and (lower(p.legal_name) like ${like} or exists (select 1 from unnest(p.aliases) a where lower(a) like ${like}))
    order by p.legal_name limit 10`
  return rows.map(toCandidate)
}

function toCandidate(r: Record<string, unknown>): Candidate {
  return {
    goldenId: r.golden_id as string, legalName: r.legal_name as string, aliases: (r.aliases as string[]) ?? [], city: r.city as string, street: (r.street as string | null) ?? null,
    taxId: r.tax_canonical ? { country: r.country as string, scheme: r.tax_scheme as string, canonical: r.tax_canonical as string, companyKey: (r.tax_company_key as string | null) ?? undefined } : null,
    groupName: (r.group_name as string | null) ?? null,
  }
}
