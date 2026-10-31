import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'node:fs'

// Applies schema.sql then requests.sql, one statement at a time (Neon's HTTP driver runs single statements).
// Comment lines are stripped per statement so a trailing comment never glues two statements together.
const url = process.env.DATABASE_URL
if (!url) throw new Error('DATABASE_URL is required')
const sql = neon(url)

function statementsOf(file: string): string[] {
  const text = readFileSync(new URL(file, import.meta.url), 'utf8')
  // Strip comment lines first: a semicolon inside a comment must never split a statement.
  const noComments = text.split('\n').filter((line) => !line.trim().startsWith('--')).join('\n')
  return noComments.split(';').map((chunk) => chunk.trim()).filter(Boolean)
}

for (const file of ['./schema.sql', './requests.sql']) {
  const statements = statementsOf(file)
  for (const s of statements) await sql.query(s)
  console.info(`${file}: applied ${statements.length} statements`)
}
