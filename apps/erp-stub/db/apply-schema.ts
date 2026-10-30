import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'node:fs'
const url = process.env.ERP_DATABASE_URL
if (!url) throw new Error('ERP_DATABASE_URL is required')
const sql = neon(url)
const statements = readFileSync(new URL('./schema.sql', import.meta.url), 'utf8').split(/;\s*\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith('--'))
for (const s of statements) await sql.query(s)
console.info(`applied ${statements.length} statements`)
