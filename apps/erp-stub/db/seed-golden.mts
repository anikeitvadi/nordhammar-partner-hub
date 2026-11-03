import { neon } from '@neondatabase/serverless'
import { GoldenRecordSchema } from '@intake/contracts'
import { goldenRecords } from './golden-data'

// Publishes the customer's golden records into the stage set's feed. Re-runnable: a record whose content changed gets
// a new updated_at (so the hub's next load picks it up); an unchanged one keeps its place. Run with:
//   ERP_DATABASE_URL=... pnpm --filter erp-stub db:golden
const url = process.env.ERP_DATABASE_URL
if (!url) throw new Error('ERP_DATABASE_URL is required')
const sql = neon(url)
const records = goldenRecords()
for (const r of records) GoldenRecordSchema.parse(r)
let changed = 0
for (const r of records) {
  const out = await sql`insert into golden_records (golden_id, doc, updated_at) values (${r.goldenId}, ${JSON.stringify(r)}::jsonb, date_trunc('milliseconds', now()))
    on conflict (golden_id) do update set doc = excluded.doc, updated_at = excluded.updated_at where golden_records.doc is distinct from excluded.doc returning golden_id`
  changed += out.length
}
const byErp = records.reduce<Record<string, number>>((m, r) => ({ ...m, [`${r.erp} ${r.domain}`]: (m[`${r.erp} ${r.domain}`] ?? 0) + 1 }), {})
console.info(`golden records: ${records.length} valid, ${changed} new or changed`, byErp)
