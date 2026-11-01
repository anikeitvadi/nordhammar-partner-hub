import { NextResponse } from 'next/server'
import { callerFromRequest } from '@/features/auth/caller'
import { NeonStore } from '@/features/ledger/neon-store'

// Demo-only fault switch, same auth as the ERP routes, and only when DEMO_CONTROLS_ENABLED=true.
// POST { lostResponse: true } arms "drop the next successful create's response, once". GET reads the state.
function enabled() { return process.env.DEMO_CONTROLS_ENABLED === 'true' && Boolean(process.env.ERP_DATABASE_URL) }

export async function GET(req: Request) {
  if (!enabled()) return NextResponse.json({ reason: 'demo controls disabled' }, { status: 404 })
  if (!(await callerFromRequest(req))) return NextResponse.json({ reason: 'unauthorized' }, { status: 401 })
  return NextResponse.json(await new NeonStore(process.env.ERP_DATABASE_URL!).faultState())
}

export async function POST(req: Request) {
  if (!enabled()) return NextResponse.json({ reason: 'demo controls disabled' }, { status: 404 })
  if (!(await callerFromRequest(req))) return NextResponse.json({ reason: 'unauthorized' }, { status: 401 })
  const body = (await req.json().catch(() => ({}))) as { lostResponse?: boolean }
  if (body.lostResponse !== true) return NextResponse.json({ reason: 'nothing to arm' }, { status: 400 })
  const store = new NeonStore(process.env.ERP_DATABASE_URL!)
  await store.armLostResponse()
  return NextResponse.json(await store.faultState())
}
