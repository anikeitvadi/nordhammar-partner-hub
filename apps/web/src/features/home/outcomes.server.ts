import 'server-only'
import { sql } from '@/lib/db'
import { visibleRegions, type Principal } from '@/features/auth/scope'
import { reportStoppedAtEntry } from '@/features/customers/reports.server'
import { cycle, type Cycle, type CycleRow } from './outcomes'

// The three numbers DECISIONS §1 promises the customer, this month, over the regions the person can see. Read live on
// every Home load; nothing is cached, because these are the numbers the design is judged against.
export type Outcomes = { stopped: { stopped: number; otherRegion: number; checks: number }; cycle: Cycle; automatic: number; exceptions: number }

export async function readOutcomes(principal: Principal): Promise<Outcomes> {
  const regions = visibleRegions(principal)
  const db = sql()
  const [stopped, created, routed] = await Promise.all([
    reportStoppedAtEntry(principal),
    // Submitted is the first 'submitted' event (the request row can be a draft long before); created is the ERP's answer.
    db`select coalesce((select min(e.at) from request_events e where e.request_id = r.request_id and e.kind = 'submitted'), r.created_at) as submitted_at, r.state->>'createdAt' as created_at
      from requests r where r.state_kind = 'created' and r.region = any(${regions}) and (r.state->>'createdAt')::timestamptz > date_trunc('month', now())`,
    // Since the service desk: each finance-approved request is either approved by the checks or an exception for a person.
    db`select count(distinct e.request_id) filter (where e.kind = 'checks_clean') as automatic, count(distinct e.request_id) filter (where e.kind = 'exception') as exceptions
      from request_events e join requests r on r.request_id = e.request_id where r.region = any(${regions}) and e.at > date_trunc('month', now())`,
  ])
  const rows: CycleRow[] = created.map((r) => ({ submittedAt: new Date(r.submitted_at as string).toISOString(), createdAt: new Date(r.created_at as string).toISOString() }))
  return { stopped: { stopped: stopped.stopped, otherRegion: stopped.otherRegion, checks: stopped.checks }, cycle: cycle(rows), automatic: Number(routed[0]?.automatic ?? 0), exceptions: Number(routed[0]?.exceptions ?? 0) }
}
