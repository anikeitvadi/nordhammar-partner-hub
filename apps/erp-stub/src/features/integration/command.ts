import { ERP_BY_REGION, type ErpCreateCommand, type Erp } from '@intake/contracts'

// Pure. The checks the door makes before anything is written, in order. Each refusal is a 400: the caller sent
// something inconsistent, and no retry with the same input can succeed.
//  - the Idempotency-Key header must be present and equal the body's operation key (one key, stated twice, agreed);
//  - the payload hash must be the hash of this payload (an old key can never be paired with a new payload);
//  - the destination ERP the hub computed must be the one this region routes to here (the routing table is the
//    integration platform's; a disagreement means one side is out of date, and guessing would file a partner in the
//    wrong ERP).
export function checkCommand(headerKey: string | null, cmd: ErpCreateCommand, recomputedHash: string): { ok: true; erp: Erp } | { ok: false; reason: string } {
  if (!headerKey) return { ok: false, reason: 'Idempotency-Key header is required' }
  if (headerKey !== cmd.operationKey) return { ok: false, reason: 'Idempotency-Key does not match the operation key' }
  if (recomputedHash !== cmd.payloadHash) return { ok: false, reason: 'payload hash does not match payload' }
  const erp = ERP_BY_REGION[cmd.payload.destination.region]
  if (cmd.payload.destination.erp !== erp) return { ok: false, reason: `region ${cmd.payload.destination.region} routes to ${erp}, not ${cmd.payload.destination.erp}` }
  return { ok: true, erp }
}
