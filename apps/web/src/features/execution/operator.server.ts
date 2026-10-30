import 'server-only'
import { transition, type CanonicalPayload, type Region, type RequestState } from '@intake/contracts'
import { sql } from '@/lib/db'
import type { Principal } from '@/features/auth/scope'
import { lookupOperation } from '@/features/erp/erp.server'

// The operator's view: what needs a human, and the two things a human may do about an execution that stopped.
// Neither path calls the ERP create. Recovery re-delivers; reconciliation reads the ERP's own ledger by key.
export function isOperator(p: Principal) { return p.globalIdentity && (p.role === 'operator' || p.role === 'reviewer') }

export type AttentionRow = { requestId: string; region: Region; legalName: string; revision: number; state: RequestState; pendingDeliveries: { kind: string; attempts: number; lastError: string | null }[] }

export async function listAttention(principal: Principal): Promise<AttentionRow[]> {
  if (!isOperator(principal)) return []
  const rows = await sql()`select r.request_id, r.region, r.current_revision, r.state, v.payload,
      coalesce(json_agg(json_build_object('kind', d.kind, 'attempts', d.attempts, 'lastError', d.last_error)) filter (where d.status = 'pending'), '[]') as pending
    from requests r join request_revisions v on v.request_id = r.request_id and v.revision = r.current_revision
    left join deliveries d on d.request_id = r.request_id and d.revision = r.current_revision and d.status = 'pending'
    where r.state_kind in ('stopped','approved','creating') or d.status = 'pending'
    group by r.request_id, r.region, r.current_revision, r.state, v.payload order by r.updated_at desc limit 50`
  return rows.map((r) => ({ requestId: r.request_id as string, region: r.region as Region, legalName: (r.payload as CanonicalPayload).legalName, revision: r.current_revision as number, state: r.state as RequestState, pendingDeliveries: r.pending as AttentionRow['pendingDeliveries'] }))
}

// Reconcile a stop with unknown effect against the ERP's ledger. Found with a number → created. Not found → the stub
// says it never committed; we record no effect, and the requester may fix and resubmit. 404 is "not yet", so the
// operator only does this once the ERP is reachable again; the UI says so.
export async function reconcile(principal: Principal, requestId: string): Promise<{ ok: true; outcome: 'created' | 'no_effect' } | { ok: false; reason: string }> {
  if (!isOperator(principal)) return { ok: false, reason: 'not an operator' }
  const rows = await sql()`select state, current_revision from requests where request_id = ${requestId}`
  const state = rows[0]?.state as RequestState | undefined
  if (!state || state.kind !== 'stopped' || state.effect !== 'unknown') return { ok: false, reason: 'nothing to reconcile: the request is not stopped with unknown effect' }
  const found = await lookupOperation(state.operationKey)
  const t = found.found && found.customerNumber
    ? transition(state, { type: 'reconciled_created', erpCustomerNumber: found.customerNumber, createdAt: new Date().toISOString() })
    : transition(state, { type: 'reconciled_no_effect', reason: found.found ? `ERP ledger: ${found.status}` : 'ERP ledger has no row for this key' })
  if (!t.ok) return { ok: false, reason: t.reason }
  const db = sql()
  await db.transaction([
    db`update requests set state_kind = ${t.next.kind}, state = ${JSON.stringify(t.next)}::jsonb, updated_at = now() where request_id = ${requestId} and state_kind = 'stopped'`,
    db`insert into request_events (request_id, kind, actor, detail) values (${requestId}, 'reconciled', ${principal.email}, ${JSON.stringify({ outcome: t.next.kind === 'created' ? 'created' : 'no_effect', ledger: found })}::jsonb)`,
  ])
  return { ok: true, outcome: t.next.kind === 'created' ? 'created' : 'no_effect' }
}

// A definitive no-effect stop goes back to the requester as a draft with the reason; they fix and resubmit (new revision, new key).
export async function recoverToDraft(principal: Principal, requestId: string): Promise<{ ok: boolean; reason?: string }> {
  if (!isOperator(principal)) return { ok: false, reason: 'not an operator' }
  const rows = await sql()`select state from requests where request_id = ${requestId}`
  const state = rows[0]?.state as RequestState | undefined
  if (!state) return { ok: false, reason: 'not found' }
  const t = transition(state, { type: 'recover_to_draft' })
  if (!t.ok) return { ok: false, reason: t.reason }
  const db = sql()
  await db.transaction([
    db`update requests set state_kind = ${t.next.kind}, state = ${JSON.stringify(t.next)}::jsonb, updated_at = now() where request_id = ${requestId} and state_kind = 'stopped'`,
    db`insert into request_events (request_id, kind, actor) values (${requestId}, 'returned_to_requester', ${principal.email})`,
  ])
  return { ok: true }
}
