import 'server-only'
import type { Region } from '@intake/contracts'
import { sql } from '@/lib/db'
import { canSeeMoney, workRegions, type Principal } from '@/features/auth/scope'

// Fixed questions for Home, authorized the same way the screens are (Ask's counts and totals are features/ask/query.server.ts): identity rows over the regions the caller can see,
// money rows over the regions the caller is entitled to. Nothing here accepts free text.

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

export type GroupExposure = {
  group: string
  members: { goldenId: string; legalName: string; region: Region; credit: { limit: number; currency: string } | null | 'not_entitled' }[]
  totals: { currency: string; total: number }[]
  hidden: Region[]
}

// The group a request would join, and what Nordhammar has already extended to it: every company with the same group
// or the same ultimate parent as the linked record, each with its credit limit in its own region where the person may
// see amounts there. This is the credit check the central team makes before approving another company into a group.
export async function readGroupExposure(principal: Principal, goldenId: string): Promise<GroupExposure | null> {
  const db = sql()
  const linked = await db`select p.golden_id, p.group_id, coalesce(p.ultimate_parent_golden_id, p.golden_id) as root, coalesce(g.name, up.legal_name, p.legal_name) as name
    from parties p left join groups g on g.group_id = p.group_id left join parties up on up.golden_id = p.ultimate_parent_golden_id where p.golden_id = ${goldenId}`
  const l = linked[0]
  if (!l) return null
  const rows = await db`select p.golden_id, p.legal_name, p.region, c.credit_limit, c.currency
    from parties p left join regional_credit c on c.golden_id = p.golden_id and c.region = p.region
    where p.domain = 'customer' and (coalesce(p.ultimate_parent_golden_id, p.golden_id) = ${l.root} or (${l.group_id}::text is not null and p.group_id = ${l.group_id}))
    order by p.region, p.legal_name`
  const members = rows.map((r) => {
    const region = r.region as Region
    const credit = !canSeeMoney(principal, region) ? 'not_entitled' as const : r.credit_limit == null ? null : { limit: Number(r.credit_limit), currency: r.currency as string }
    return { goldenId: r.golden_id as string, legalName: r.legal_name as string, region, credit }
  })
  const totals = new Map<string, number>()
  for (const m of members) if (m.credit && m.credit !== 'not_entitled') totals.set(m.credit.currency, (totals.get(m.credit.currency) ?? 0) + m.credit.limit)
  const hidden = [...new Set(members.filter((m) => m.credit === 'not_entitled').map((m) => m.region))]
  return { group: l.name as string, members, totals: [...totals].map(([currency, total]) => ({ currency, total })), hidden }
}

// "Duplicates stopped at entry", the first target in DECISIONS §1: exact tax-ID matches the form would not continue
// past, this month, in the regions the caller can see. Counted once per person, domain and tax ID, so pressing the
// check button twice is one stop. Exact matches elsewhere (shown as a region only) count too: that is the cross-region
// duplicate the old process let through.
export async function reportStoppedAtEntry(principal: Principal): Promise<{ stopped: number; sameRegion: number; otherRegion: number; checks: number }> {
  const regions = workRegions(principal)
  const rows = await sql()`select
      count(distinct (requester_email, domain, tax_canonical)) filter (where route in ('exact_visible','exact_foreign')) as stopped,
      count(distinct (requester_email, domain, tax_canonical)) filter (where route = 'exact_visible') as same_region,
      count(distinct (requester_email, domain, tax_canonical)) filter (where route = 'exact_foreign') as other_region,
      count(*) as checks
    from hub_checks where region = any(${regions}) and at > date_trunc('month', now())`
  const r = rows[0] ?? {}
  return { stopped: Number(r.stopped ?? 0), sameRegion: Number(r.same_region ?? 0), otherRegion: Number(r.other_region ?? 0), checks: Number(r.checks ?? 0) }
}
