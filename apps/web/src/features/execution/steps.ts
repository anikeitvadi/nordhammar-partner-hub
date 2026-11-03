import { RetryableError, getStepMetadata } from 'workflow'
import { operationKey, parseOperationKey, transition, type CanonicalPayload, type Domain, type ErpCreateCommand, type RequestState, payloadHash } from '@intake/contracts'
import { sql } from '@/lib/db'
import { createParty, erpCredentialMode, type ErpResult } from '@/features/erp/erp.server'

export type WakePayload = { decisionId: string; decision: 'approve' | 'decline' | 'send_back' }

export function hookToken(requestId: string, revision: number) { return `review:${requestId}:${revision}` }

export async function markWakeDeliveredStep(requestId: string, revision: number, workflowRunId: string) {
  'use step'
  const db = sql()
  await db.transaction([
    db`update deliveries set status = 'delivered', updated_at = now() where request_id = ${requestId} and revision = ${revision} and kind = 'wake'`,
    db`update requests set workflow_run_id = ${workflowRunId} where request_id = ${requestId}`,
  ])
}

// approved → creating, atomically, and only once per revision: the conditional UPDATE is the permanent owner guard.
// Returns the exact command (key + hash + canonical payload) the ERP step will send, or null if this revision is not approved.
export async function startCreatingStep(requestId: string, revision: number, workflowRunId: string): Promise<ErpCreateCommand | null> {
  'use step'
  const db = sql()
  const rows = await db`select r.state, r.domain, v.payload, v.payload_hash from requests r join request_revisions v on v.request_id = r.request_id and v.revision = ${revision} where r.request_id = ${requestId} and r.current_revision = ${revision}`
  const r = rows[0]
  if (!r) return null
  const state = r.state as RequestState
  const payload = r.payload as CanonicalPayload
  const key = operationKey(r.domain as Domain, requestId, revision)
  if (state.kind === 'creating' && state.operationKey === key) return { operationKey: key, payloadHash: r.payload_hash as string, payload } // resumed after a crash: same command
  const t = transition(state, { type: 'start_creating', operationKey: key })
  if (!t.ok) return null
  if (state.kind !== 'approved' || state.approval.payloadHash !== (r.payload_hash as string)) return null
  const hash = await payloadHash(payload)
  if (hash !== (r.payload_hash as string)) return null // the stored hash must match the stored payload; if not, nothing is sent
  await db.transaction([
    db`update requests set state_kind = ${t.next.kind}, state = ${JSON.stringify(t.next)}::jsonb, workflow_run_id = ${workflowRunId}, updated_at = now() where request_id = ${requestId} and current_revision = ${revision} and state_kind = 'approved'`,
    db`insert into request_events (request_id, kind, actor, detail) values (${requestId}, 'creating', 'workflow', ${JSON.stringify({ operationKey: key, workflowRunId })}::jsonb)`,
  ])
  return { operationKey: key, payloadHash: hash, payload }
}

// The only caller of createParty. Transient outcomes throw RetryableError so the SDK retries this step with the
// SAME key and hash; everything else returns and the workflow moves on. Bounded: the last attempt returns the
// transient result instead of throwing (a thrown error there would fail the whole run and leave the request in
// "creating"), so finishStep records it as stopped with effect unknown, which the operator reconciles by key.
export async function erpWriteStep(command: ErpCreateCommand): Promise<ErpResult> {
  'use step'
  const { attempt } = getStepMetadata()
  await recordAttempt(command.operationKey, { attempt, phase: 'sent', credential: await erpCredentialMode() })
  const result = await createParty(command, { timeoutMs: 8000 })
  if (result.outcome === 'transient') {
    // The SDK retries immediately by default and has no built-in backoff; attempt-based delays: 1s, 2s, 4s.
    const retryAfterMs = 1000 * 2 ** Math.max(0, attempt - 1)
    const last = attempt > erpWriteStep.maxRetries
    await recordAttempt(command.operationKey, { attempt, phase: 'transient', reason: result.reason, retryAfterMs: last ? null : retryAfterMs })
    if (last) return result
    throw new RetryableError(result.reason, { retryAfter: retryAfterMs })
  }
  await recordAttempt(command.operationKey, { attempt, phase: result.outcome, erpNumber: 'erpNumber' in result ? result.erpNumber : null, reason: 'reason' in result ? result.reason : null })
  return result
}

// Progress for the status page's timeline: one row per attempt, written best-effort so a database hiccup can never
// fail the ERP write it describes. The timeline is a view; the state row and the ledger stay the truth.
async function recordAttempt(key: string, detail: Record<string, unknown>) {
  const parsed = parseOperationKey(key)
  if (!parsed) return
  try {
    await sql()`insert into request_events (request_id, kind, actor, detail) values (${parsed.requestId}, 'erp_attempt', 'workflow', ${JSON.stringify({ ...detail, operationKey: key })}::jsonb)`
  } catch { /* progress only */ }
}
// Bound the retries: the initial call plus three retries; the fourth attempt hands its transient result to finishStep.
erpWriteStep.maxRetries = 3

export async function finishStep(requestId: string, revision: number, result: ErpResult) {
  'use step'
  const db = sql()
  const rows = await db`select state from requests where request_id = ${requestId} and current_revision = ${revision}`
  const state = rows[0]?.state as RequestState | undefined
  if (!state || state.kind !== 'creating') return
  const now = new Date().toISOString()
  let t: ReturnType<typeof transition>
  switch (result.outcome) {
    case 'created':
    case 'replayed':
      t = transition(state, { type: 'created', erpNumber: result.erpNumber, createdAt: now }); break
    case 'rejected':
      t = transition(state, { type: 'stop', category: result.category, effect: 'no_effect', reason: result.reason }); break
    case 'transient':
      // Retries exhausted: the ERP may have committed. Effect unknown; the operator reconciles by key before anything else happens.
      t = transition(state, { type: 'stop', category: 'transport', effect: 'unknown', reason: result.reason }); break
  }
  if (!t.ok) return
  await db.transaction([
    db`update requests set state_kind = ${t.next.kind}, state = ${JSON.stringify(t.next)}::jsonb, updated_at = now() where request_id = ${requestId} and current_revision = ${revision} and state_kind = 'creating'`,
    db`insert into request_events (request_id, kind, actor, detail) values (${requestId}, ${t.next.kind}, 'workflow', ${JSON.stringify(result)}::jsonb)`,
  ])
}
