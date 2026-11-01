import { NextResponse } from 'next/server'
import { ErpCreateCommandSchema, payloadHash } from '@intake/contracts'
import { callerFromRequest } from '@/features/auth/caller'
import { apply, type Domain } from '@/features/ledger/ledger'
import { NeonStore } from '@/features/ledger/neon-store'

// One receiver for both ERP masters. The route decides the domain; a command whose payload names the other domain is
// refused, so a customer command can never be filed as a supplier by hitting the wrong URL.
// Bearer auth (OIDC or the flagged shared secret). The receiver recomputes the payload hash and refuses a mismatch,
// so a caller cannot pair an old key with a new payload and a stale hash.
// Fault controls (DEMO_CONTROLS_ENABLED=true only), driven by markers in the legal name so the demo can show each failure:
//   [TIMEOUT]       hold the response for 20 s (caller times out; the operation is NOT committed)
//   [LOSTRESPONSE]  commit, then answer 503 (caller retries; replay returns the same number)
//   or the one-shot switch armed from the operator page (POST /api/demo/faults): same effect, clean legal name.
//   [REJECT]        business rejection 422 (definitive)
export async function receive(req: Request, domain: Domain): Promise<Response> {
  const caller = await callerFromRequest(req)
  if (!caller) return NextResponse.json({ reason: 'unauthorized' }, { status: 401 })
  const parsed = ErpCreateCommandSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ reason: 'malformed command' }, { status: 400 })
  const cmd = parsed.data
  if (cmd.payload.domain !== domain) return NextResponse.json({ reason: `this endpoint creates ${domain}s; the command is for a ${cmd.payload.domain}` }, { status: 400 })
  const recomputed = await payloadHash(cmd.payload)
  if (recomputed !== cmd.payloadHash) return NextResponse.json({ reason: 'payload hash does not match payload' }, { status: 400 })
  const faults = process.env.DEMO_CONTROLS_ENABLED === 'true'
  if (faults && /\[TIMEOUT\]/i.test(cmd.payload.legalName)) await new Promise((r) => setTimeout(r, 20_000))
  const url = process.env.ERP_DATABASE_URL
  if (!url) return NextResponse.json({ reason: 'stub database not configured' }, { status: 503 })
  const store = new NeonStore(url)
  const result = await apply(store, { operationKey: cmd.operationKey, domain, payloadHash: cmd.payloadHash, legalName: cmd.payload.legalName })
  // The create is committed above. Dropping the response now is exactly the failure that creates duplicates in the
  // real world: the caller never learns the number and retries. The replay rule is what makes the retry safe.
  if (faults && result.status === 201 && (/\[LOSTRESPONSE\]/i.test(cmd.payload.legalName) || (await store.consumeLostResponse()))) {
    return NextResponse.json({ reason: 'response lost after commit (demo fault)' }, { status: 503 })
  }
  return NextResponse.json(result.status === 201 || result.status === 200 ? { number: result.customerNumber, customerNumber: result.customerNumber } : { reason: result.reason }, { status: result.status })
}
