import 'server-only'
import type { Region } from '@intake/contracts'
import { sql } from '@/lib/db'
import { visibleRegions, type Principal } from '@/features/auth/scope'
import { where } from './geo'
import { landDots } from './land.server'

// Everything Home's globe draws, scoped like every list: partners in the person's regions at their cities, the
// corporate groups among them as arcs, and this month's events in those regions. Events: an ERP number assigned (a ring
// at the new partner's city) and a duplicate stopped at entry (a ring at the record it collided with).
export type GlobePoint = { id: string; name: string; city: string; region: Region; erp: string | null; erpNumber: string | null; group: string | null; at: [number, number] }
export type GlobeEvent = { kind: 'created' | 'stopped'; name: string; city: string; at: [number, number] }
export type GlobeData = { land: [number, number][]; points: GlobePoint[]; arcs: [[number, number], [number, number]][]; events: GlobeEvent[] }
export type HomeFigures = { partners: number; regions: number; erps: number; crossBorderGroups: number; requestsIn: number; numbersOut: number; stopped: number }

export async function readGlobe(principal: Principal): Promise<{ globe: GlobeData; figures: HomeFigures }> {
  const regions = visibleRegions(principal)
  const db = sql()
  const [parties, created, stopped, requestsIn] = await Promise.all([
    db`select p.golden_id, p.legal_name, p.city, p.country, p.region, p.erp_system, p.erp_number, coalesce(g.name, up.legal_name) as grp
      from parties p left join groups g on g.group_id = p.group_id left join parties up on up.golden_id = p.ultimate_parent_golden_id
      where p.region = any(${regions})`,
    db`select v.payload->>'legalName' as name, v.payload->'identity'->>'country' as country, v.payload->'addresses'->0->>'city' as city
      from requests r join request_revisions v on v.request_id = r.request_id and v.revision = r.current_revision
      where r.region = any(${regions}) and r.state_kind = 'created' and (r.state->>'createdAt')::timestamptz > date_trunc('month', now())`,
    db`select distinct on (h.requester_email, h.domain, h.tax_canonical) p.legal_name, p.city, p.country
      from hub_checks h join parties p on p.golden_id = h.matched_golden_id
      where h.region = any(${regions}) and h.route = 'exact_visible' and h.at > date_trunc('month', now())`,
    db`select count(*)::int as n from requests r where r.region = any(${regions})
      and exists (select 1 from request_events e where e.request_id = r.request_id and e.kind = 'submitted' and e.at > date_trunc('month', now()))`,
  ])
  const points: GlobePoint[] = parties.map((p) => ({ id: p.golden_id as string, name: p.legal_name as string, city: p.city as string, region: p.region as Region, erp: (p.erp_system as string | null) ?? null, erpNumber: (p.erp_number as string | null) ?? null, group: (p.grp as string | null) ?? null, at: where(p.country as string, p.city as string).lonLat }))
  // A group's establishments, joined in a chain; only groups that span more than one city make an arc worth drawing.
  const byGroup = new Map<string, GlobePoint[]>()
  for (const p of points) if (p.group) byGroup.set(p.group, [...(byGroup.get(p.group) ?? []), p])
  const arcs: GlobeData['arcs'] = []
  for (const g of byGroup.values()) for (let i = 0; i < g.length - 1; i++) if (g[i].at[0] !== g[i + 1].at[0] || g[i].at[1] !== g[i + 1].at[1]) arcs.push([g[i].at, g[i + 1].at])
  const crossBorderGroups = [...byGroup.values()].filter((g) => new Set(g.map((p) => p.region)).size > 1).length
  const events: GlobeEvent[] = [
    ...created.map((r) => ({ kind: 'created' as const, name: r.name as string, city: (r.city as string) ?? '', at: where(r.country as string, r.city as string).lonLat })),
    ...stopped.map((r) => ({ kind: 'stopped' as const, name: r.legal_name as string, city: r.city as string, at: where(r.country as string, r.city as string).lonLat })),
  ]
  return {
    globe: { land: landDots(), points, arcs, events },
    figures: { partners: points.length, regions: new Set(points.map((p) => p.region)).size, erps: new Set(points.map((p) => p.erp).filter(Boolean)).size, crossBorderGroups, requestsIn: requestsIn[0]?.n ?? 0, numbersOut: created.length, stopped: stopped.length },
  }
}
