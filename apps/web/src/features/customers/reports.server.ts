import 'server-only'
import type { Region } from '@intake/contracts'
import { sql } from '@/lib/db'
import { visibleRegions, type Principal } from '@/features/auth/scope'

// Fixed questions, authorized the same way the screens are: identity rows over the regions the caller can see,
// money rows over the regions the caller is entitled to. Nothing here accepts free text.

export async function reportOnHold(principal: Principal): Promise<{ region: Region; customers: number; suppliers: number; oldestActivity: string | null }[]> {
  const regions = visibleRegions(principal)
  const rows = await sql()`select region, count(*) filter (where domain = 'customer') as customers, count(*) filter (where domain = 'supplier') as suppliers, min(last_activity_at) as oldest
    from parties where status = 'hold' and region = any(${regions}) group by region order by region`
  return rows.map((r) => ({ region: r.region as Region, customers: Number(r.customers), suppliers: Number(r.suppliers), oldestActivity: r.oldest ? new Date(r.oldest as string).toISOString().slice(0, 10) : null }))
}

export async function reportIntake(principal: Principal): Promise<{ state: string; customers: number; suppliers: number; medianHours: number | null }[]> {
  const regions = visibleRegions(principal)
  const rows = await sql()`select r.state_kind as state, count(*) filter (where r.domain = 'customer') as customers, count(*) filter (where r.domain = 'supplier') as suppliers,
      percentile_cont(0.5) within group (order by extract(epoch from ((r.state->>'createdAt')::timestamptz - r.created_at)) / 3600) filter (where r.state_kind = 'created') as median_hours
    from requests r where r.region = any(${regions}) and r.created_at > date_trunc('month', now()) group by r.state_kind order by r.state_kind`
  return rows.map((r) => ({ state: r.state as string, customers: Number(r.customers), suppliers: Number(r.suppliers), medianHours: r.median_hours == null ? null : Math.round(Number(r.median_hours) * 10) / 10 }))
}

export async function reportExposure(principal: Principal): Promise<{ parent: string; companies: number; regions: Region[]; limits: { currency: string; total: number }[] }[]> {
  const money = principal.moneyRegions
  if (money.length === 0) return []
  const rows = await sql()`select coalesce(up.legal_name, p.legal_name) as parent, count(distinct p.golden_id) as companies, array_agg(distinct p.region) as regions, c.currency, sum(c.credit_limit) as total
    from parties p join regional_credit c on c.golden_id = p.golden_id and c.region = any(${money})
    left join parties up on up.golden_id = p.ultimate_parent_golden_id
    where p.domain = 'customer' group by 1, c.currency order by total desc`
  const byParent = new Map<string, { parent: string; companies: number; regions: Set<Region>; limits: { currency: string; total: number }[] }>()
  for (const r of rows) {
    const key = r.parent as string
    const cur = byParent.get(key) ?? { parent: key, companies: 0, regions: new Set<Region>(), limits: [] }
    cur.companies = Math.max(cur.companies, Number(r.companies)); for (const g of r.regions as Region[]) cur.regions.add(g)
    cur.limits.push({ currency: r.currency as string, total: Number(r.total) })
    byParent.set(key, cur)
  }
  return [...byParent.values()].map((v) => ({ parent: v.parent, companies: v.companies, regions: [...v.regions], limits: v.limits }))
}

// "Duplicates stopped at entry", the first target in DECISIONS §1: exact tax-ID matches the form would not continue
// past, this month, in the regions the caller can see. Counted once per person, domain and tax ID, so pressing the
// check button twice is one stop. Exact matches elsewhere (shown as a region only) count too: that is the cross-region
// duplicate the old process let through.
export async function reportStoppedAtEntry(principal: Principal): Promise<{ stopped: number; sameRegion: number; otherRegion: number; checks: number }> {
  const regions = visibleRegions(principal)
  const rows = await sql()`select
      count(distinct (requester_email, domain, tax_canonical)) filter (where route in ('exact_visible','exact_foreign')) as stopped,
      count(distinct (requester_email, domain, tax_canonical)) filter (where route = 'exact_visible') as same_region,
      count(distinct (requester_email, domain, tax_canonical)) filter (where route = 'exact_foreign') as other_region,
      count(*) as checks
    from hub_checks where region = any(${regions}) and at > date_trunc('month', now())`
  const r = rows[0] ?? {}
  return { stopped: Number(r.stopped ?? 0), sameRegion: Number(r.same_region ?? 0), otherRegion: Number(r.other_region ?? 0), checks: Number(r.checks ?? 0) }
}
