import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import type { Region } from '@intake/contracts'
import { sql } from '@/lib/db'
import { canSeeIdentity, canSeeMoney, ScopeError, type Principal } from '@/features/auth/scope'
import type { Candidate } from '@/features/intake/match'

// Boundary 1 of 3. Owns every authorized read of the customer hub.
// Scope is checked HERE, before any SQL, with the principal's fresh entitlements. Cached functions below take only
// (region, query): auth is read outside the cache, and the cache key is the region, so a cached entry can never
// serve a region the caller was not checked against.

export type CustomerSummary = { goldenId: string; legalName: string; city: string; region: Region; erpNumber: string | null }
export type GroupMember = { legalName: string; region: Region }
export type CustomerDetail = CustomerSummary & {
  country: string
  taxScheme: string | null
  taxCanonical: string | null
  erpSystem: string | null
  street: string | null
  streetNumber: string | null
  aliases: string[]
  loadedAt: string
  group: { name: string; members: GroupMember[] } | null
  credit: { limit: number; currency: string; terms: string } | null | 'not_entitled'
}

export async function searchCustomers(principal: Principal, region: Region, query: string): Promise<CustomerSummary[]> {
  if (!canSeeIdentity(principal, region)) throw new ScopeError(`no identity access to ${region}`)
  const q = query.trim()
  if (!q) return []
  return cachedSearch(region, q.toLowerCase())
}

async function cachedSearch(region: Region, q: string): Promise<CustomerSummary[]> {
  'use cache'
  cacheTag(`hub:${region}`)
  cacheLife('minutes')
  const rows = await sql()`select golden_id, legal_name, city, region, erp_number from customers
    where region = ${region} and (lower(legal_name) like ${'%' + q + '%'} or exists (select 1 from unnest(aliases) a where lower(a) like ${'%' + q + '%'}) or tax_canonical = ${q.toUpperCase().replace(/[^0-9A-Z]/g, '')})
    order by legal_name limit 25`
  return rows.map((r) => ({ goldenId: r.golden_id as string, legalName: r.legal_name as string, city: r.city as string, region: r.region as Region, erpNumber: (r.erp_number as string | null) ?? null }))
}

export async function getCustomer(principal: Principal, goldenId: string): Promise<CustomerDetail | null> {
  const rows = await sql()`select c.*, g.name as group_name from customers c left join groups g on g.group_id = c.group_id where c.golden_id = ${goldenId}`
  const r = rows[0]
  if (!r) return null
  const region = r.region as Region
  // Not visible reads as not found, so existence in another region never leaks through a URL.
  if (!canSeeIdentity(principal, region)) return null
  const members: GroupMember[] = r.group_id
    ? (await sql()`select legal_name, region from customers where group_id = ${r.group_id} and golden_id <> ${goldenId} order by region, legal_name`).map((m) => ({ legalName: m.legal_name as string, region: m.region as Region }))
    : []
  let credit: CustomerDetail['credit'] = 'not_entitled'
  if (canSeeMoney(principal, region)) {
    const cr = await sql()`select credit_limit, currency, terms from regional_credit where golden_id = ${goldenId} and region = ${region}`
    credit = cr[0] ? { limit: Number(cr[0].credit_limit), currency: cr[0].currency as string, terms: cr[0].terms as string } : null
  }
  return {
    goldenId, legalName: r.legal_name as string, city: r.city as string, region, erpNumber: (r.erp_number as string | null) ?? null,
    country: r.country as string, taxScheme: (r.tax_scheme as string | null) ?? null, taxCanonical: (r.tax_canonical as string | null) ?? null,
    erpSystem: (r.erp_system as string | null) ?? null, street: (r.street as string | null) ?? null, streetNumber: (r.street_number as string | null) ?? null,
    aliases: (r.aliases as string[]) ?? [], loadedAt: new Date(r.loaded_at as string).toISOString(),
    group: r.group_id ? { name: r.group_name as string, members } : null,
    credit,
  }
}

// Live, never cached: the dup-check must see today's hub. Returns the full candidate only when the match is inside
// the caller's visibility; otherwise the region alone, so "exists in EU, contact the EU team" never carries a name or an ID.
export async function exactTaxIdLookup(principal: Principal, taxCanonical: string): Promise<{ visible: Candidate } | { foreignRegion: Region } | null> {
  const rows = await sql()`select c.golden_id, c.legal_name, c.aliases, c.city, c.street, c.region, c.country, c.tax_scheme, c.tax_canonical, c.tax_company_key, g.name as group_name
    from customers c left join groups g on g.group_id = c.group_id where c.tax_canonical = ${taxCanonical} limit 1`
  const r = rows[0]
  if (!r) return null
  const region = r.region as Region
  if (!canSeeIdentity(principal, region)) return { foreignRegion: region }
  return { visible: {
    goldenId: r.golden_id as string, legalName: r.legal_name as string, aliases: (r.aliases as string[]) ?? [], city: r.city as string, street: (r.street as string | null) ?? null,
    taxId: { country: r.country as string, scheme: r.tax_scheme as string, canonical: r.tax_canonical as string, companyKey: (r.tax_company_key as string | null) ?? undefined },
    groupName: (r.group_name as string | null) ?? null,
  } }
}

// Live, never cached, region-scoped: the name/alias candidates the preflight compares against. Returns the DTO the
// model may see. Nothing from another region is ever in this list; the foreign case is handled by exactTaxIdLookup.
export async function findNameCandidates(principal: Principal, region: Region, name: string): Promise<Candidate[]> {
  if (!canSeeIdentity(principal, region)) throw new ScopeError(`no identity access to ${region}`)
  const words = name.toLowerCase().split(/\s+/).filter((w) => w.length >= 3).slice(0, 3)
  if (words.length === 0) return []
  const like = `%${words[0]}%`
  const rows = await sql()`select c.golden_id, c.legal_name, c.aliases, c.city, c.street, c.country, c.tax_scheme, c.tax_canonical, c.tax_company_key, g.name as group_name
    from customers c left join groups g on g.group_id = c.group_id
    where c.region = ${region} and (lower(c.legal_name) like ${like} or exists (select 1 from unnest(c.aliases) a where lower(a) like ${like}))
    order by c.legal_name limit 10`
  return rows.map((r) => ({
    goldenId: r.golden_id as string, legalName: r.legal_name as string, aliases: (r.aliases as string[]) ?? [], city: r.city as string, street: (r.street as string | null) ?? null,
    taxId: r.tax_canonical ? { country: r.country as string, scheme: r.tax_scheme as string, canonical: r.tax_canonical as string, companyKey: (r.tax_company_key as string | null) ?? undefined } : null,
    groupName: (r.group_name as string | null) ?? null,
  }))
}
