import { transition, type CanonicalPayload, type RequestState } from '@intake/contracts'
import { sql } from '@/lib/db'
import { commentOnTicket, openDeskTicket } from '@/features/erp/erp.server'
import { runCleanCheck } from '@/features/intake/clean.server'

// The service-desk half of the request Workflow (docs/SERVICE-DESK-CONTRACT.md §4). Every state change goes through
// transition() and a conditional UPDATE on the current state, so a retried step never moves a request twice.

export type FinancePayload = { decision: 'approve' | 'reject'; by: string; reason: string | null; ticketId: string }
export function financeToken(requestId: string, revision: number) { return `finance:${requestId}:${revision}` }

async function load(requestId: string, revision: number) {
  const rows = await sql()`select r.state, r.domain, r.region, r.requester_email, r.ticket_id, v.payload, v.payload_hash from requests r join request_revisions v on v.request_id = r.request_id and v.revision = ${revision} where r.request_id = ${requestId} and r.current_revision = ${revision}`
  return rows[0] ? { state: rows[0].state as RequestState, domain: rows[0].domain as string, region: rows[0].region as string, requester: rows[0].requester_email as string, ticketId: (rows[0].ticket_id as string | null) ?? null, payload: rows[0].payload as CanonicalPayload, hash: rows[0].payload_hash as string } : null
}

async function move(requestId: string, revision: number, from: RequestState['kind'], next: RequestState, event: { kind: string; actor: string; detail: unknown }, extra: ReturnType<ReturnType<typeof sql>>[] = []) {
  const db = sql()
  await db.transaction([
    db`update requests set state_kind = ${next.kind}, state = ${JSON.stringify(next)}::jsonb, updated_at = now() where request_id = ${requestId} and current_revision = ${revision} and state_kind = ${from}`,
    db`insert into request_events (request_id, kind, actor, detail) values (${requestId}, ${event.kind}, ${event.actor}, ${JSON.stringify(event.detail)}::jsonb)`,
    ...extra,
  ])
}

// Opens the finance ticket for a request raised in the hub (the desk answers the same ticket for the same revision,
// so a retry is safe). A ticket-first request already has one.
export async function openTicketStep(requestId: string, revision: number, workflowRunId: string): Promise<string | null> {
  'use step'
  const r = await load(requestId, revision)
  if (!r) return null
  await sql()`update requests set workflow_run_id = ${workflowRunId} where request_id = ${requestId}`
  if (r.ticketId) return r.ticketId
  if (r.state.kind !== 'awaiting_finance') return null
  // Finance reads the reason and the contact before approving (docs/FORM-FIELD-INVENTORY.md, finding 1).
  const id = await openDeskTicket({ hubRequestId: requestId, hubRevision: revision, requesterEmail: r.requester, region: r.region, domain: r.domain, summary: { legalName: r.payload.legalName, taxId: r.payload.identity.canonical, country: r.payload.identity.country, reason: r.payload.reason.text, contactName: r.payload.contact?.name || null, contactEmail: r.payload.contact?.email || null } })
  const t = transition(r.state, { type: 'ticket_opened', ticketId: id })
  if (!t.ok) return id
  const db = sql()
  await move(requestId, revision, 'awaiting_finance', t.next, { kind: 'ticket_opened', actor: 'service desk', detail: { ticketId: id } }, [db`update requests set ticket_id = ${id} where request_id = ${requestId}`])
  return id
}

export async function financeDecisionStep(requestId: string, revision: number, f: FinancePayload): Promise<'approved' | 'rejected' | 'not_waiting'> {
  'use step'
  const r = await load(requestId, revision)
  if (!r || r.state.kind !== 'awaiting_finance') return r?.state.kind === 'checking' ? 'approved' : 'not_waiting'
  if (f.decision === 'reject') {
    const decisionId = `F-${requestId}-${revision}`
    const t = transition(r.state, { type: 'finance_rejected', by: f.by, decisionId, reason: f.reason ?? 'rejected by finance' })
    if (!t.ok) return 'not_waiting'
    const db = sql()
    await move(requestId, revision, 'awaiting_finance', t.next, { kind: 'finance_rejected', actor: f.by, detail: { ticketId: f.ticketId, reason: f.reason } }, [db`delete from identity_reservations where request_id = ${requestId}`])
    return 'rejected'
  }
  const t = transition(r.state, { type: 'finance_approved', by: f.by })
  if (!t.ok) return 'not_waiting'
  await move(requestId, revision, 'awaiting_finance', t.next, { kind: 'finance_approved', actor: f.by, detail: { ticketId: f.ticketId } })
  return 'approved'
}

// The checks, again, now that finance has said yes. Clean: an automatic approval bound to the exact payload, recorded as
// a decision like a person's (first decision wins still holds). Not clean: an exception with its reasons.
export async function checksStep(requestId: string, revision: number): Promise<{ clean: boolean; reasons: string[] }> {
  'use step'
  const r = await load(requestId, revision)
  if (!r) return { clean: false, reasons: ['request not found'] }
  if (r.state.kind === 'approved') return { clean: true, reasons: [] }
  if (r.state.kind === 'exception') return { clean: false, reasons: r.state.reasons }
  if (r.state.kind !== 'checking') return { clean: false, reasons: [`not being checked (${r.state.kind})`] }
  const result = await runCleanCheck(requestId)
  if (!result) return { clean: false, reasons: ['request not found'] }
  const db = sql()
  if (result.clean) {
    const decisionId = `A-${requestId}-${revision}`
    const approval = { decisionId, reviewerId: 'auto:checks', reviewedAt: new Date().toISOString(), payloadHash: r.hash, checks: result.passed }
    const t = transition(r.state, { type: 'checks_clean', approval })
    if (!t.ok) return { clean: false, reasons: [t.reason] }
    await move(requestId, revision, 'checking', t.next, { kind: 'checks_clean', actor: 'checks', detail: { checks: result.passed } }, [
      db`insert into review_decisions (decision_id, request_id, revision, reviewer_email, decision, reason, payload_hash) values (${decisionId}, ${requestId}, ${revision}, ${'auto:checks'}, ${'approve'}, ${null}, ${r.hash}) on conflict do nothing`,
    ])
    return { clean: true, reasons: [] }
  }
  const t = transition(r.state, { type: 'checks_exception', reasons: result.reasons })
  if (!t.ok) return { clean: false, reasons: result.reasons }
  await move(requestId, revision, 'checking', t.next, { kind: 'exception', actor: 'checks', detail: { reasons: result.reasons, passed: result.passed } })
  return { clean: false, reasons: result.reasons }
}

// Writes the outcome back to the ticket. Best-effort with the SDK's retries; the hub's own state is the truth.
export async function ticketCommentStep(ticketId: string | null, key: string, body: string): Promise<void> {
  'use step'
  if (!ticketId) return
  await commentOnTicket(ticketId, key, body)
}

// The sentence the ticket gets once the request has an outcome.
export async function outcomeTextStep(requestId: string): Promise<string> {
  'use step'
  const r = await sql()`select state, v.payload from requests rq join request_revisions v on v.request_id = rq.request_id and v.revision = rq.current_revision where rq.request_id = ${requestId}`
  const s = r[0]?.state as RequestState | undefined
  const p = r[0]?.payload as CanonicalPayload | undefined
  if (!s) return 'The request could not be found in the Partner Hub.'
  switch (s.kind) {
    case 'created': return `Created in ${p?.destination.erp ?? 'the ERP'}, number ${s.erpNumber}. It is searchable in the Partner Hub after the next load.`
    case 'declined': return `Declined by the central master-data team: ${s.reason}`
    case 'draft': return `Sent back to the requester by the central master-data team${s.returnedReason ? `: ${s.returnedReason}` : ''}.`
    case 'stopped': return s.effect === 'unknown' ? 'The ERP did not answer. The central master-data team is checking whether it was created.' : `The ERP refused it: ${s.reason}`
    default: return `Status in the Partner Hub: ${s.kind.replace(/_/g, ' ')}.`
  }
}
