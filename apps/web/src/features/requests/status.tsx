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
