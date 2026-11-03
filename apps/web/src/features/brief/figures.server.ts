import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import { sql } from '@/lib/db'
import type { BriefFigures } from './types'

// The brief's live figures: counts across the whole demo hub, the same definitions Home uses (globe.server.ts), with no
// person in scope because the brief is public. Counts only, never names or amounts. Cached for minutes.
export type { BriefFigures }

export async function readBriefFigures(): Promise<BriefFigures | null> {
  'use cache'
  cacheTag('brief')
  cacheLife('minutes')
  try {
    const db = sql()
    const [parties, month] = await Promise.all([
      db`select count(*)::int as n, count(distinct region)::int as regions, count(distinct erp_system)::int as erps from parties`,
      db`select
          (select count(*)::int from requests r where exists (select 1 from request_events e where e.request_id = r.request_id and e.kind = 'submitted' and e.at > date_trunc('month', now()))) as requests_in,
          (select count(*)::int from requests r where r.state_kind = 'created' and (r.state->>'createdAt')::timestamptz > date_trunc('month', now())) as numbers_out,
          (select count(*)::int from (select distinct requester_email, domain, tax_canonical from hub_checks where route in ('exact_visible', 'exact_foreign') and at > date_trunc('month', now())) s) as stopped,
          (select count(*)::int from requests r where r.state_kind = 'created' and (r.state->>'createdAt')::timestamptz > date_trunc('month', now()) and r.state->'approval'->>'reviewerId' like 'auto:%') as automatic,
          (select count(*)::int from requests r where r.state_kind = 'created' and (r.state->>'createdAt')::timestamptz > date_trunc('month', now()) and r.state->'approval'->>'reviewerId' not like 'auto:%') as via_central`,
    ])
    const m = month[0]
    return { partners: parties[0].n, regions: parties[0].regions, erps: parties[0].erps, requestsIn: m.requests_in, numbersOut: m.numbers_out, stopped: m.stopped, automatic: m.automatic, viaCentral: m.via_central }
  } catch {
    // A build without a database, or the database down: the brief still reads, without the live line.
    return null
  }
}
