import 'server-only'
import { sql } from '@/lib/db'
import { visibleRegions, type Principal } from '@/features/auth/scope'
import { listMyRequests } from '@/features/requests/store.server'

// The chips under Ask's box, built from what this person can see (docs/QUERY-SPEC-CONTRACT.md §4): a question is
// offered only when the data has an answer for them. Read at page load; cheap counts only.
export async function suggestQuestions(principal: Principal): Promise<string[]> {
  const regions = visibleRegions(principal)
  const db = sql()
  const [group, hold, stops, mine] = await Promise.all([
    db`select g.name, count(*)::int n from parties p join groups g on g.group_id = p.group_id where p.region = any(${regions}) group by g.name order by n desc limit 1`,
    db`select region, count(*)::int n from parties where status = 'hold' and region = any(${regions}) group by region order by n desc limit 1`,
    db`select count(*)::int n from hub_checks where region = any(${regions}) and route in ('exact_visible','exact_foreign') and at > date_trunc('month', now())`,
    listMyRequests(principal),
  ])
  const out: string[] = []
  if (group[0]) out.push(`Do we already work with ${group[0].name} anywhere?`)
  if (mine[0]) out.push(`Where is request ${mine[0].requestId} right now?`)
  if (hold[0]) out.push(regions.length > 1 ? 'How many partners are on hold, by region?' : `How many partners are on hold in ${hold[0].region}?`)
  out.push('How many requests were created each month this year?')
  if (principal.moneyRegions.length && group[0]) out.push(`What is our credit exposure to ${group[0].name}?`)
  if (stops[0]?.n) out.push('How many duplicates were stopped at entry this month?')
  out.push('How fast do requests get an ERP number, hub form versus service desk?')
  return out.slice(0, 6)
}
