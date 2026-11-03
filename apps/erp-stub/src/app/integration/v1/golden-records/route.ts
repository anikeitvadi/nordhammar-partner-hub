import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import type { GoldenRecord } from '@intake/contracts'
import { callerFromRequest } from '@/features/auth/caller'
import { decodeCursor, encodeCursor } from '@/features/integration/cursor'

// GET /integration/v1/golden-records?since=<cursor>&limit=<n>. The customer's published golden records, changed after
// the cursor, in (updated_at, golden_id) order. `next` is where the following call starts and is null only on an
// empty page (same rule as cursor.ts `page`, which the tests exercise). Timestamps are written at millisecond
// precision so the cursor round-trips exactly through JavaScript.
export async function GET(req: Request) {
  if (!(await callerFromRequest(req))) return NextResponse.json({ reason: 'unauthorized' }, { status: 401 })
  const url = process.env.ERP_DATABASE_URL
  if (!url) return NextResponse.json({ reason: 'integration database not configured' }, { status: 503 })
  const params = new URL(req.url).searchParams
  const after = decodeCursor(params.get('since'))
  const limit = Math.min(Math.max(Number(params.get('limit') ?? 100) || 100, 1), 500)
  const sql = neon(url)
  const rows = after
    ? await sql`select golden_id, doc, updated_at from golden_records where (updated_at, golden_id) > (${after.at}::timestamptz, ${after.id}) order by updated_at, golden_id limit ${limit}`
    : await sql`select golden_id, doc, updated_at from golden_records order by updated_at, golden_id limit ${limit}`
  const last = rows.at(-1)
  return NextResponse.json({ records: rows.map((r) => r.doc as GoldenRecord), next: last ? encodeCursor({ at: new Date(last.updated_at as string).toISOString(), id: last.golden_id as string }) : null })
}
