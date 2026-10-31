import type { RequestState } from '@intake/contracts'

export function StatusBadge({ state }: { state: RequestState }) {
  return <span className={`badge badge-${state.kind}`}>{state.kind.replace('_', ' ')}</span>
}

export function describeState(s: RequestState): string {
  switch (s.kind) {
    case 'draft': return s.returnedReason ? 'Returned to you. Fix and resubmit; it goes back into the queue.' : 'Draft.'
    case 'submitted': return 'In the review queue. A reviewer on the NA or India shift will pick it up; target is the same business day.'
    case 'under_review': return 'A reviewer has it open.'
    case 'approved': return 'Approved. Creating the customer in the ERP.'
    case 'creating': return 'Writing to the ERP. This retries on its own if the ERP is slow.'
    case 'created': return 'Done. The ERP assigned the customer number.'
    case 'declined': return `Declined: ${s.reason}`
    case 'stopped': return 'Stopped. An operator will reconcile; nothing is retried blindly.'
  }
}

// States that can still change on their own. The status page polls only while one of these is current.
export function isLive(s: RequestState): boolean {
  return s.kind === 'submitted' || s.kind === 'under_review' || s.kind === 'approved' || s.kind === 'creating'
}

export type TimelineEvent = { at: string; kind: string; actor: string | null; detail: unknown }

type AttemptDetail = { attempt?: number; phase?: string; reason?: string | null; retryAfterMs?: number | null; erpCustomerNumber?: string | null }

// One sentence per event, in the words the requester would use. The retry-and-replay story is told here.
export function describeEvent(e: TimelineEvent): string {
  const d = (e.detail ?? {}) as Record<string, unknown>
  switch (e.kind) {
    case 'submitted': return `Submitted${d.dupChoice === 'not_related' ? ', marked not related to the suggested match' : d.dupChoice === 'new_in_group' ? ', as a new company in an existing group' : ''}`
    case 'resubmitted': return `Resubmitted as revision ${String(d.revision ?? '')}`
    case 'opened_for_review': return 'Opened for review'
    case 'approve': return 'Approved; the approval is bound to the payload hash'
    case 'decline': return `Declined${d.reason ? `: ${String(d.reason)}` : ''}`
    case 'send_back': return `Sent back${d.reason ? `: ${String(d.reason)}` : ''}`
    case 'creating': return 'Workflow claimed the write; one operation key issued'
    case 'erp_attempt': return describeAttempt(d as AttemptDetail)
    case 'created': return `ERP assigned customer number ${String(d.erpCustomerNumber ?? '')}${d.outcome === 'replayed' ? ' (replayed: the ERP already had it)' : ''}`
    case 'stopped': return `Stopped: ${String(d.reason ?? '')}${d.outcome === 'transient' ? '. Effect unknown; an operator reconciles by key' : ''}`
    case 'reconciled': return d.outcome === 'created' ? 'Reconciled from the ERP ledger: it had committed' : 'Reconciled from the ERP ledger: no effect'
    case 'returned_to_requester': return 'Returned to the requester as a draft'
    case 'hub_loaded': return `Hub load picked it up as ${String(d.goldenId ?? '')}`
    default: return e.kind.replace(/_/g, ' ')
  }
}

function describeAttempt(d: AttemptDetail): string {
  const n = d.attempt ?? 1
  switch (d.phase) {
    case 'sent': return `Attempt ${n}: sent to the ERP`
    case 'transient': return `Attempt ${n}: ${d.reason ?? 'no answer'}${d.retryAfterMs != null ? `; retrying in ${Math.round(d.retryAfterMs / 1000)}s with the same key` : '; retries exhausted'}`
    case 'created': return `Attempt ${n}: ERP created ${d.erpCustomerNumber ?? ''}`
    case 'replayed': return `Attempt ${n}: ERP replayed ${d.erpCustomerNumber ?? ''}, it had already committed`
    case 'rejected': return `Attempt ${n}: ERP refused${d.reason ? `: ${d.reason}` : ''}`
    default: return `Attempt ${n}`
  }
}
