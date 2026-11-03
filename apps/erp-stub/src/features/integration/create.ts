import { NextResponse } from 'next/server'
import { ErpCreateCommandSchema, goldenFromPayload, payloadHash, type ErpCreateCommand } from '@intake/contracts'
import { callerFromRequest } from '@/features/auth/caller'
import { apply } from '@/features/ledger/ledger'
import { NeonStore } from '@/features/ledger/neon-store'
import { checkCommand } from './command'
import { toNative } from './mapping'

// POST /integration/v1/partners: the one way a partner is created in any of the three ERPs.
// Auth (OIDC, or the flagged shared secret in development), then the pure checks in command.ts, then the ledger.
// On a create the layer also writes the partner into that ERP's own master in its own shape, and publishes the golden
// record the customer's pipeline would publish, so the hub's next load finds it. Both writes are keyed and repeatable,
// so a replay that reaches here again leaves the same rows.
// Fault controls (DEMO_CONTROLS_ENABLED=true only), driven by markers in the legal name:
//   [TIMEOUT]       hold the response for 20 s (caller times out; the operation is NOT committed)
//   [LOSTRESPONSE]  commit, then answer 503 (caller retries; replay returns the same number)
//   or the one-shot switch armed from the operations page (POST /api/demo/faults): same effect, clean legal name.
//   [REJECT]        business rejection 422 (definitive)
export async function createPartner(req: Request): Promise<Response> {
  const caller = await callerFromRequest(req)
  if (!caller) return NextResponse.json({ reason: 'unauthorized' }, { status: 401 })
  const parsed = ErpCreateCommandSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ reason: 'malformed command' }, { status: 400 })
  const cmd: ErpCreateCommand = parsed.data
  const check = checkCommand(req.headers.get('idempotency-key'), cmd, await payloadHash(cmd.payload))
  if (!check.ok) return NextResponse.json({ reason: check.reason }, { status: 400 })
  const faults = process.env.DEMO_CONTROLS_ENABLED === 'true'
  if (faults && /\[TIMEOUT\]/i.test(cmd.payload.legalName)) await new Promise((r) => setTimeout(r, 20_000))
  const url = process.env.ERP_DATABASE_URL
  if (!url) return NextResponse.json({ reason: 'integration database not configured' }, { status: 503 })
  const store = new NeonStore(url)
  const result = await apply(store, { operationKey: cmd.operationKey, erp: check.erp, domain: cmd.payload.domain, payloadHash: cmd.payloadHash, legalName: cmd.payload.legalName })
  if (result.status === 201 || result.status === 200) {
    const at = new Date().toISOString()
    const native = toNative(result.erp, cmd.payload, result.number, at)
    const golden = goldenFromPayload(cmd.payload, result.number, at)
    await store.sql.transaction([
      store.sql`insert into erp_records (erp, domain, number, native, operation_key) values (${result.erp}, ${cmd.payload.domain}, ${result.number}, ${JSON.stringify(native)}::jsonb, ${cmd.operationKey}) on conflict do nothing`,
      store.sql`insert into golden_records (golden_id, doc, updated_at) values (${golden.goldenId}, ${JSON.stringify(golden)}::jsonb, date_trunc('milliseconds', now())) on conflict (golden_id) do nothing`,
    ])
  }
  // The create is committed above. Dropping the response now is exactly the failure that creates duplicates in the
  // real world: the caller never learns the number and retries. The replay rule is what makes the retry safe.
  if (faults && result.status === 201 && (/\[LOSTRESPONSE\]/i.test(cmd.payload.legalName) || (await store.consumeLostResponse()))) {
    return NextResponse.json({ reason: 'response lost after commit (demo fault)' }, { status: 503 })
  }
  if (result.status === 409 || result.status === 422) return NextResponse.json({ reason: result.reason }, { status: result.status })
  return NextResponse.json({ erp: result.erp, number: result.number }, { status: result.status })
}
