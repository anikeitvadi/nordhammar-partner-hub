// Hub seed: the people and what they may see. Golden records are not typed in here any more: the nightly load reads
// them from the customer's integration platform (apps/erp-stub/db/golden-data.ts, published with db:golden there).
// Run with: DATABASE_URL=... pnpm --filter web db:seed
import { neon } from '@neondatabase/serverless'

const url = process.env.DATABASE_URL
if (!url) throw new Error('DATABASE_URL is required')
const sql = neon(url)

// Test users. Created in the identity provider with the same emails; passwords are handed over privately.
// Two roles: regional users (requester) and the central master data team (steward), who sees amounts everywhere.
const entitlements = [
  { email: 'ana.requester@example.com', name: 'Ana Silva', role: 'requester', regions: ['BR'], global: false, money: ['BR'] },
  { email: 'jonas.requester@example.com', name: 'Jonas Weber', role: 'requester', regions: ['EU'], global: false, money: ['EU'] },
  { email: 'priya.reviewer@example.com', name: 'Priya Nair', role: 'steward', regions: ['BR', 'EU', 'US', 'IN', 'CN'], global: true, money: ['BR', 'EU', 'US', 'IN', 'CN'] },
  { email: 'noregion@example.com', name: 'No Region Yet', role: 'requester', regions: [], global: false, money: [] },
]

async function main() {
  for (const e of entitlements) await sql`insert into entitlements (email, display_name, role, regions, global_identity, money_regions) values (${e.email}, ${e.name}, ${e.role}, ${e.regions}, ${e.global}, ${e.money}) on conflict (email) do update set display_name = excluded.display_name, role = excluded.role, regions = excluded.regions, global_identity = excluded.global_identity, money_regions = excluded.money_regions`
  console.info(`seeded ${entitlements.length} entitlements`)
}
main().catch((e) => { console.error(e); process.exit(1) })
