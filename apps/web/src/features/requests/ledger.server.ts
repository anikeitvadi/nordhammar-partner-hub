import { cacheLife, cacheTag } from 'next/cache'
import { sql } from '@/lib/db'

// The words the sign-in page's ASCII mark is drawn with: recent request ids, partner names and status words, from
// the demo database only (seeded and demo requests; no customer data exists here). Cached for minutes and tagged,
// so the door never waits on the database and never shows anything newer than a minute or two.
export async function recentLedger(): Promise<string[]> {
  'use cache'
  cacheTag('ledger')
  cacheLife('minutes')
  let requests: Record<string, unknown>[] = []
  let parties: Record<string, unknown>[] = []
  try {
    // inside the try: CI builds with no database at all, and sql() refuses without DATABASE_URL
    const db = sql()
    // the legal name lives in the revision payload; the build prerenders this page, so a database that is not reachable
    // at build time must not fail the build: the mark is then drawn from the product name alone
    requests = await db`select r.request_id, v.payload->>'legalName' as legal_name, r.state_kind from requests r join request_revisions v on v.request_id = r.request_id and v.revision = r.current_revision order by r.updated_at desc limit 24`
    parties = await db`select legal_name, region, erp_number from parties order by random() limit 24`
  } catch { return ['Nordhammar Partner Hub', 'one record per legal entity', 'search before you request'] }
  const lines = [
    ...requests.map((r: Record<string, unknown>) => `${String(r.request_id)} ${String(r.legal_name)} ${String(r.state_kind).replace('_', ' ')}`),
    ...parties.map((p: Record<string, unknown>) => `${String(p.legal_name)} ${String(p.region)}${p.erp_number ? ` ${String(p.erp_number)}` : ''}`),
  ]
  return lines.length ? lines : ['Nordhammar Partner Hub']
}
