import { NextResponse } from 'next/server'
import { callerFromRequest } from '@/features/auth/caller'
import { NeonStore } from '@/features/ledger/neon-store'

// GET /integration/v1/operations/:key. Reconciliation: did this operation commit, in which ERP, with which number?
// 404 means not yet, not never: a call that timed out may still be in flight.
export async function GET(req: Request, { params }: { params: Promise<{ key: string }> }) {
  if (!(await callerFromRequest(req))) return NextResponse.json({ reason: 'unauthorized' }, { status: 401 })
  const url = process.env.ERP_DATABASE_URL
  if (!url) return NextResponse.json({ reason: 'integration database not configured' }, { status: 503 })
  const { key } = await params
  const row = await new NeonStore(url).get(decodeURIComponent(key))
  if (!row) return NextResponse.json({ reason: 'not found' }, { status: 404 })
  return NextResponse.json({ operationKey: row.operationKey, erp: row.erp, status: row.status, number: row.number, reason: row.reason })
}
