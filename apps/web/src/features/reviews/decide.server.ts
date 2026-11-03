import 'server-only'
import { transition, type Approval, type RequestState } from '@intake/contracts'
import { sql } from '@/lib/db'
import { isCentral, type Principal } from '@/features/auth/scope'

// Boundary 2 of 3. The only writer of a review decision.
// Fresh authorization at execution time (the caller passes the principal it just loaded, not one from a form).
// The decision binds to the revision and the payload hash the reviewer saw; first decision wins by a conditional
// UPDATE on (request_id, current_revision, state_kind) plus the unique (request_id, revision) on review_decisions.
// The accepted decision and the pending 'wake' delivery commit together; waking the workflow happens after, from the
// delivery row, so a failed wake never loses an accepted decision.

export type Decision = 'approve' | 'decline' | 'send_back'
export type DecideInput = { requestId: string; revision: number; payloadHash: string; decision: Decision; reason?: string }
export type DecideResult = { ok: true; next: RequestState; decisionId: string } | { ok: false; reason: 'not_reviewer' | 'not_found' | 'stale' | 'already_decided' | 'reason_required' | 'invalid_transition' }

export async function decide(principal: Principal, input: DecideInput): Promise<DecideResult> {
  if (!isCentral(principal)) return { ok: false, reason: 'not_reviewer' }
  if ((input.decision === 'decline' || input.decision === 'send_back') && !input.reason?.trim()) return { ok: false, reason: 'reason_required' }
  const db = sql()
  const rows = await db`select r.state, r.current_revision, v.payload_hash from requests r join request_revisions v on v.request_id = r.request_id and v.revision = r.current_revision where r.request_id = ${input.requestId}`
  const r = rows[0]
  if (!r) return { ok: false, reason: 'not_found' }
  if ((r.current_revision as number) !== input.revision || (r.payload_hash as string) !== input.payloadHash) return { ok: false, reason: 'stale' }
  const state = r.state as RequestState
  const decisionId = `D-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase()
  const approval: Approval = { decisionId, reviewerId: principal.email, reviewedAt: new Date().toISOString(), payloadHash: input.payloadHash }
  const t = transition(state, input.decision === 'approve' ? { type: 'approve', approval } : input.decision === 'decline' ? { type: 'decline', decisionId, reason: input.reason!.trim() } : { type: 'send_back', reason: input.reason!.trim() })
  if (!t.ok) return { ok: false, reason: 'invalid_transition' }
  try {
    const result = await db.transaction([
      db`update requests set state_kind = ${t.next.kind}, state = ${JSON.stringify(t.next)}::jsonb, updated_at = now() where request_id = ${input.requestId} and current_revision = ${input.revision} and state_kind = ${state.kind}`,
      db`insert into review_decisions (decision_id, request_id, revision, reviewer_email, decision, reason, payload_hash) values (${decisionId}, ${input.requestId}, ${input.revision}, ${principal.email}, ${input.decision}, ${input.reason?.trim() ?? null}, ${input.payloadHash})`,
      db`insert into request_events (request_id, kind, actor, detail) values (${input.requestId}, ${input.decision}, ${principal.email}, ${JSON.stringify({ revision: input.revision, decisionId, reason: input.reason?.trim() ?? null })}::jsonb)`,
      db`insert into deliveries (request_id, revision, kind, payload) values (${input.requestId}, ${input.revision}, 'wake', ${JSON.stringify({ decisionId, decision: input.decision })}::jsonb) on conflict (request_id, revision, kind) do nothing`,
    ])
    // The update is conditional on the state the decision was made on (under review, or an exception since the service
    // desk); zero rows means someone else decided first, and the unique insert would also have thrown.
    const updated = Array.isArray(result) && Array.isArray(result[0]) ? result[0].length : -1
    void updated
  } catch (e) {
    if (e instanceof Error && /review_decisions/.test(e.message)) return { ok: false, reason: 'already_decided' }
    throw e
  }
  return { ok: true, next: t.next, decisionId }
}

// submitted → under_review when a reviewer opens it. Idempotent: opening twice is a no-op.
export async function openReview(principal: Principal, requestId: string, revision: number): Promise<void> {
  if (!isCentral(principal)) return
  const rows = await sql()`select state from requests where request_id = ${requestId} and current_revision = ${revision}`
  const state = rows[0]?.state as RequestState | undefined
  if (!state || state.kind !== 'submitted') return
  const t = transition(state, { type: 'open_review' })
  if (!t.ok) return
  const db = sql()
  await db.transaction([
    db`update requests set state_kind = ${t.next.kind}, state = ${JSON.stringify(t.next)}::jsonb, updated_at = now() where request_id = ${requestId} and current_revision = ${revision} and state_kind = 'submitted'`,
    db`insert into request_events (request_id, kind, actor) values (${requestId}, 'opened_for_review', ${principal.email})`,
  ])
}
