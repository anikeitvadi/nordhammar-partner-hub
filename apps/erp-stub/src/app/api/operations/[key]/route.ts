import { NextResponse } from 'next/server'
import { callerFromRequest } from '@/features/auth/caller'
import { NeonStore } from '@/features/ledger/neon-store'

// Old route, kept for the one deploy in which the hub still calls it. Removed once the hub calls /integration/v1/operations.
export async function GET(req: Request, { params }: { params: Promise<{ key: string }> }) {
  const caller = await callerFromRequest(req)
  if (!caller) return NextResponse.json({ reason: 'unauthorized' }, { status: 401 })
  const url = process.env.ERP_DATABASE_URL
  if (!url) return NextResponse.json({ reason: 'stub database not configured' }, { status: 503 })
  const { key } = await params
  const row = await new NeonStore(url).get(decodeURIComponent(key))
  if (!row) return NextResponse.json({ reason: 'not found' }, { status: 404 })
  return NextResponse.json({ operationKey: row.operationKey, erp: row.erp, status: row.status, number: row.number, customerNumber: row.number, reason: row.reason })
}
