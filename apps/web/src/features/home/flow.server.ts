import 'server-only'
import { sql } from '@/lib/db'
import { visibleRegions, type Principal } from '@/features/auth/scope'
import { reportStoppedAtEntry } from '@/features/customers/reports.server'
import { businessHoursBetween } from './outcomes'
import { routeOf, type Route, type Who } from './flow'

// This month's requests in the person's regions, as routes for the flow and timings for the strip. One read of the
// requests and their events; scoped like every list.
export type StripDot = { requestId: string; name: string; hours: number; who: Who }
export type ThisMonth = { routes: Route[]; dots: StripDot[]; stoppedAtEntry: number; checks: number }

export async function readThisMonth(principal: Principal): Promise<ThisMonth> {
  const regions = visibleRegions(principal)
  const [rows, stopped] = await Promise.all([
    sql()`select r.request_id, r.state_kind, r.ticket_id, r.state->>'createdAt' as created_at, v.payload->>'legalName' as name,
        (select min(e.at) from request_events e where e.request_id = r.request_id and e.kind = 'submitted') as submitted_at,
        (select max(e.detail->>'via') from request_events e where e.request_id = r.request_id and e.kind = 'submitted') as via,
        (select array_agg(distinct e.kind) from request_events e where e.request_id = r.request_id) as kinds
      from requests r join request_revisions v on v.request_id = r.request_id and v.revision = r.current_revision
      where r.region = any(${regions})
        and exists (select 1 from request_events e where e.request_id = r.request_id and e.kind = 'submitted' and e.at > date_trunc('month', now()))`,
    reportStoppedAtEntry(principal),
  ])
  const routes: Route[] = []
  const dots: StripDot[] = []
  for (const r of rows) {
    const route = routeOf({ fromDesk: r.via === 'service desk', ticket: !!r.ticket_id, events: (r.kinds as string[]) ?? [], state: r.state_kind as string })
    routes.push(route)
    if (r.state_kind === 'created' && r.created_at && r.submitted_at) dots.push({ requestId: r.request_id as string, name: r.name as string, hours: businessHoursBetween(new Date(r.submitted_at as string).toISOString(), new Date(r.created_at as string).toISOString()), who: route.who })
  }
  return { routes, dots, stoppedAtEntry: stopped.stopped, checks: stopped.checks }
}
