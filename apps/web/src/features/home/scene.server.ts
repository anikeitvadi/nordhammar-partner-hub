import 'server-only'
import type { Region } from '@intake/contracts'
import { sql } from '@/lib/db'
import { visibleRegions, type Principal } from '@/features/auth/scope'
import { reportStoppedAtEntry } from '@/features/customers/reports.server'

// What Home's scene draws: every partner the person may see as one point, the corporate groups that join them, and
// this month's requests in their regions. Scoped like every list: points and threads only inside visible regions.
export type ScenePoint = { id: string; name: string; region: Region; erp: string | null; erpNumber: string | null; group: string | null; hold: boolean; domain: 'customer' | 'supplier' }
export type SceneRequest = { id: string; name: string; region: Region; outcome: 'created' | 'waiting' | 'declined' | 'stopped' }
export type SceneData = { regions: Region[]; points: ScenePoint[]; requests: SceneRequest[]; stoppedAtEntry: number }

export async function readScene(principal: Principal): Promise<SceneData> {
  const regions = visibleRegions(principal)
  const db = sql()
  const [parties, requests, stopped] = await Promise.all([
    db`select p.golden_id, p.legal_name, p.region, p.erp_system, p.erp_number, p.status, p.domain, coalesce(g.name, up.legal_name) as grp
      from parties p left join groups g on g.group_id = p.group_id left join parties up on up.golden_id = p.ultimate_parent_golden_id
      where p.region = any(${regions}) order by p.region, p.legal_name`,
    db`select r.request_id, r.region, r.state_kind, v.payload->>'legalName' as name from requests r
      join request_revisions v on v.request_id = r.request_id and v.revision = r.current_revision
      where r.region = any(${regions}) and exists (select 1 from request_events e where e.request_id = r.request_id and e.kind = 'submitted' and e.at > date_trunc('month', now()))`,
    reportStoppedAtEntry(principal),
  ])
  return {
    regions,
    points: parties.map((p) => ({ id: p.golden_id as string, name: p.legal_name as string, region: p.region as Region, erp: (p.erp_system as string | null) ?? null, erpNumber: (p.erp_number as string | null) ?? null, group: (p.grp as string | null) ?? null, hold: p.status === 'hold', domain: p.domain as 'customer' | 'supplier' })),
    requests: requests.map((r) => ({ id: r.request_id as string, name: r.name as string, region: r.region as Region, outcome: r.state_kind === 'created' ? 'created' : r.state_kind === 'declined' ? 'declined' : r.state_kind === 'stopped' ? 'stopped' : 'waiting' })),
    stoppedAtEntry: stopped.stopped,
  }
}
