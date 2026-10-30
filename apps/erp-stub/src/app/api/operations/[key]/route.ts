import { NextResponse } from 'next/server'
import { NeonStore } from '@/features/ledger/neon-store'

// GET /api/operations/:key. Reconciliation for the operator: did this operation commit? 404 means not yet, not never.
export async function GET(req: Request, { params }: { params: Promise<{ key: string }> }) {
  const auth = req.headers.get('authorization') ?? ''
  if (auth !== `Bearer ${process.env.ERP_SERVICE_TOKEN}`) return NextResponse.json({ reason: 'unauthorized' }, { status: 401 })
  const url = process.env.ERP_DATABASE_URL
  if (!url) return NextResponse.json({ reason: 'stub database not configured' }, { status: 503 })
  const { key } = await params
  const row = await new NeonStore(url).get(decodeURIComponent(key))
  if (!row) return NextResponse.json({ reason: 'not found' }, { status: 404 })
  return NextResponse.json({ operationKey: row.operationKey, status: row.status, customerNumber: row.customerNumber, reason: row.reason })
}
