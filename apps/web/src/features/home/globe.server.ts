import 'server-only'
import type { Region } from '@intake/contracts'
import { sql } from '@/lib/db'
import { identityRegions, isCentral, workRegions, type Principal } from '@/features/auth/scope'
import { where } from './geo'
import { landDots } from './land.server'
import type { GlobeArc, GlobeData, GlobeEvent, GlobePoint, HomeFigures } from './types'

export type { GlobeArc, GlobeData, GlobeEvent, GlobePoint, HomeFigures }

// Everything Home's globe draws, scoped like every list: partners wherever the person may read identity, at their
// cities, the corporate groups among them as arcs, and this month's events in the regions they work in. Events: an ERP
// number assigned (a ring at the new partner's city) and a duplicate stopped at entry (a ring at the record it collided with).
export async function readGlobe(principal: Principal): Promise<{ globe: GlobeData; figures: HomeFigures }> {
  const regions = workRegions(principal)
  const db = sql()
  const [parties, created, stopped, requestsIn, mine] = await Promise.all([
    db`select p.golden_id, p.legal_name, p.city, p.country, p.region, p.status, p.erp_system, p.erp_number, coalesce(g.name, up.legal_name) as grp
      from parties p left join groups g on g.group_id = p.group_id left join parties up on up.golden_id = p.ultimate_parent_golden_id
      where p.region = any(${identityRegions(principal)})`,
    db`select v.payload->>'legalName' as name, v.payload->'identity'->>'country' as country, v.payload->'addresses'->0->>'city' as city
      from requests r join request_revisions v on v.request_id = r.request_id and v.revision = r.current_revision
      where r.region = any(${regions}) and r.state_kind = 'created' and (r.state->>'createdAt')::timestamptz > date_trunc('month', now())`,
    db`select distinct on (h.requester_email, h.domain, h.tax_canonical) p.legal_name, p.city, p.country
      from hub_checks h join parties p on p.golden_id = h.matched_golden_id
      where h.region = any(${regions}) and h.route = 'exact_visible' and h.at > date_trunc('month', now())`,
    db`select count(*)::int as n from requests r where r.region = any(${regions})
      and exists (select 1 from request_events e where e.request_id = r.request_id and e.kind = 'submitted' and e.at > date_trunc('month', now()))`,
    db`select
        count(*) filter (where exists (select 1 from request_events e where e.request_id = r.request_id and e.kind = 'submitted' and e.at > date_trunc('month', now())))::int as month_in,
        count(*) filter (where r.state_kind in ('awaiting_finance', 'checking', 'exception', 'submitted', 'under_review', 'approved', 'creating'))::int as waiting,
        count(*) filter (where r.state_kind = 'created' and (r.state->>'createdAt')::timestamptz > date_trunc('month', now()))::int as created
      from requests r where r.requester_email = ${principal.email}`,
  ])
  const points: GlobePoint[] = parties.map((p) => ({ id: p.golden_id as string, name: p.legal_name as string, city: p.city as string, region: p.region as Region, erp: (p.erp_system as string | null) ?? null, erpNumber: (p.erp_number as string | null) ?? null, group: (p.grp as string | null) ?? null, at: where(p.country as string, p.city as string).lonLat, mine: regions.includes(p.region as Region) }))
  // A group's establishments, joined in a chain; only groups that span more than one city make an arc worth drawing.
  const byGroup = new Map<string, GlobePoint[]>()
  for (const p of points) if (p.group) byGroup.set(p.group, [...(byGroup.get(p.group) ?? []), p])
  // One arc per pair of different cities in a group, drawn once even when several establishments share the pair.
  const arcs: GlobeArc[] = []
  const seen = new Set<string>()
  for (const [group, g] of byGroup) for (let i = 0; i < g.length - 1; i++) {
    const a = g[i], b = g[i + 1]
    if (a.at[0] === b.at[0] && a.at[1] === b.at[1]) continue
    const key = [a.at.join(','), b.at.join(',')].sort().join('|')
    if (seen.has(key)) continue
    seen.add(key)
    arcs.push({ group, from: a.at, to: b.at, fromCity: a.city, toCity: b.city, mine: g.some((p) => p.mine) })
  }
  const crossBorderGroups = [...byGroup.values()].filter((g) => new Set(g.map((p) => p.region)).size > 1).length
  const events: GlobeEvent[] = [
    ...created.map((r) => ({ kind: 'created' as const, name: r.name as string, city: (r.city as string) ?? '', at: where(r.country as string, r.city as string).lonLat })),
    ...stopped.map((r) => ({ kind: 'stopped' as const, name: r.legal_name as string, city: r.city as string, at: where(r.country as string, r.city as string).lonLat })),
  ]
  const globe = { land: landDots(), points, arcs, events }
  if (isCentral(principal)) {
    return { globe, figures: { kind: 'central', partners: points.length, regions: new Set(points.map((p) => p.region)).size, erps: new Set(points.map((p) => p.erp).filter(Boolean)).size, crossBorderGroups, requestsIn: requestsIn[0]?.n ?? 0, numbersOut: created.length, stopped: stopped.length } }
  }
  // A regional user: their own region's partners, the ones that belong to a group reaching other regions (the
  // relationship nobody in one region could see before), and their own requests.
  const own = points.filter((p) => p.mine)
  const abroad = new Set([...byGroup.values()].filter((g) => g.some((p) => p.mine) && g.some((p) => !p.mine)).flatMap((g) => g.filter((p) => p.mine).map((p) => p.id)))
  const onHold = parties.filter((p) => regions.includes(p.region as Region) && p.status === 'hold').length
  const m = mine[0] ?? {}
  return { globe, figures: { kind: 'regional', where: regions.join(', '), partners: own.length, onHold, groupsAbroad: abroad.size, mineIn: Number(m.month_in ?? 0), mineWaiting: Number(m.waiting ?? 0), mineCreated: Number(m.created ?? 0) } }
}
