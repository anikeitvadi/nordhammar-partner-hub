import type { Domain, RequestState } from '@intake/contracts'
import { describeCheck } from '@/features/intake/check-record'

export const STATE_LABEL: Record<RequestState['kind'], string> = { draft: 'Draft', awaiting_finance: 'With finance', checking: 'Checking', exception: 'Exception', submitted: 'Submitted', under_review: 'Under review', approved: 'Approved', creating: 'Creating in ERP', created: 'Created', declined: 'Declined', stopped: 'Stopped' }

export function StatusBadge({ state }: { state: RequestState }) {
  return <span className={`badge badge-${state.kind}`}>{STATE_LABEL[state.kind]}</span>
}

// The checks' reasons as sentences: each starts with a capital, quotes are typographic. Older requests stored them
// lower-case with straight quotes, so this is done on display, not only at the source.
export function reasonText(reasons: string[]): string {
  return reasons.map((r) => r.charAt(0).toUpperCase() + r.slice(1).replace(/"([^"]*)"/g, '\u201c$1\u201d')).join('. ') + '.'
}

// The one sentence that says where the request is and what happens next, for the person who raised it.
export function describeState(s: RequestState, domain: Domain = 'customer'): string {
  const thing = domain === 'customer' ? 'customer' : 'supplier'
  switch (s.kind) {
    case 'draft': return s.returnedReason ? 'Returned to you with a note. Fix it and submit again; it goes back to finance.' : 'Saved as a draft. Only you can see it until you submit.'
    case 'awaiting_finance': return `With finance in the service desk${s.ticketId ? ` (ticket ${s.ticketId})` : ''}. When finance approves, the hub checks it again; if every check passes, the ERP number is assigned automatically.`
    case 'checking': return `Finance approved. The hub is checking it again now.`
    case 'exception': return `Waiting for the central master-data team. ${reasonText(s.reasons)}`
    case 'submitted': return 'In the central team\'s queue.'
    case 'under_review': return 'The central team has it open.'
    case 'approved': return `Approved. Creating the ${thing} in the ERP now.`
    case 'creating': return `Creating the ${thing} in the ERP. If the ERP is slow we try again with the same request, so it can never be created twice.`
    case 'created': return `Done. The ERP assigned the ${thing} number.`
    case 'declined': return s.by === 'finance' ? `Declined by finance: ${s.reason}` : `Declined: ${s.reason}`
    case 'stopped': return s.effect === 'unknown' ? 'Stopped: the ERP did not answer. An operator will check with the ERP whether it was created before anything is retried.' : `Stopped: ${s.reason}. An operator will return it to you to fix.`
  }
}

// States that can still change on their own. The status page polls only while one of these is current.
export function isLive(s: RequestState): boolean {
  return s.kind === 'awaiting_finance' || s.kind === 'checking' || s.kind === 'exception' || s.kind === 'submitted' || s.kind === 'under_review' || s.kind === 'approved' || s.kind === 'creating'
}

export type TimelineEvent = { at: string; kind: string; actor: string | null; detail: unknown }

type AttemptDetail = { attempt?: number; phase?: string; reason?: string | null; retryAfterMs?: number | null; erpNumber?: string | null; credential?: string }

// Actors are emails; show them as they are. A guessed display name would be wrong more often than it is pretty.
const who = (actor: string | null) => (actor && actor !== 'workflow' && actor !== 'system' && actor !== 'hub load' ? actor : null)

// One sentence per event, in the words a business user would use. The technical facts (hash, key, credential)
// live in the "Technical details" block on the page, not here. The retry-and-replay story is told here.
export function describeEvent(e: TimelineEvent): string {
  const d = (e.detail ?? {}) as Record<string, unknown>
  const by = who(e.actor)
  switch (e.kind) {
    case 'draft_saved': return 'Saved as a draft'
    case 'email_queued': return `Email queued to ${d.to === 'approvers' ? 'the approver team' : 'the requester'}: ${String(d.template ?? '').replace(/_/g, ' ')}`
    case 'ticket_opened': return `Ticket ${String(d.ticketId ?? '')} opened in the service desk for finance`
    case 'finance_approved': return `Approved by finance${by ? ` (${by})` : ''} in the service desk`
    case 'finance_rejected': return `Rejected by finance${by ? ` (${by})` : ''}${d.reason ? `: ${String(d.reason)}` : ''}`
    case 'checks_clean': return `Every check passed after finance approved, so it was approved automatically: ${(d.checks as string[] | undefined)?.join(', ') ?? ''}`
    case 'exception': return `Not approved automatically. For the central team: ${reasonText((d.reasons as string[] | undefined) ?? [])}`
    case 'submitted': return d.via === 'service desk' ? `Raised in the service desk (ticket ${String(d.ticketId ?? '')}) by ${by ?? 'the requester'}` : `Submitted${by ? ` by ${by}` : ''}${d.dupChoice === 'not_related' ? ', marked not related to the suggested match' : d.dupChoice === 'new_in_group' ? ', as a new company in an existing group' : ''}`
    case 'resubmitted': return `Submitted again${by ? ` by ${by}` : ''} (version ${String(d.revision ?? '')})`
    case 'opened_for_review': return `Opened for review${by ? ` by ${by}` : ''}`
    case 'approve': return `Approved${by ? ` by ${by}` : ''}. This exact version is what the ERP receives`
    case 'decline': return `Declined${by ? ` by ${by}` : ''}${d.reason ? `: ${String(d.reason)}` : ''}`
    case 'send_back': return `Sent back${by ? ` by ${by}` : ''}${d.reason ? `: ${String(d.reason)}` : ''}`
    case 'creating': return 'Sending to the ERP'
    case 'erp_attempt': return describeAttempt(d as AttemptDetail)
    case 'created': return `The ERP assigned number ${String(d.erpNumber ?? '')}${d.outcome === 'replayed' ? '. One record, even though the first answer was lost' : ''}`
    case 'stopped': return d.outcome === 'transient' ? 'Stopped: the ERP did not answer after several tries. An operator will check whether it was created before anything is retried' : `Stopped: ${String(d.reason ?? '')}`
    case 'reconciled': return d.outcome === 'created' ? 'Checked with the ERP: it had been created. Marked as created' : 'Checked with the ERP: nothing was created'
    case 'returned_to_requester': return 'Returned to the requester as a draft'
    case 'hub_checked': return describeCheck(d as Parameters<typeof describeCheck>[0])
    case 'hub_loaded': return `Picked up by the hub load as ${String(d.goldenId ?? '')}. Search finds it from now`
    default: return e.kind.replace(/_/g, ' ')
  }
}

function describeAttempt(d: AttemptDetail): string {
  const n = d.attempt ?? 1
  switch (d.phase) {
    case 'sent': return `Attempt ${n}: sent to the ERP`
    case 'transient': return `Attempt ${n}: ${plainReason(d.reason)}${d.retryAfterMs != null ? `. Trying again in ${Math.round(d.retryAfterMs / 1000)}s with the same request, so it cannot be created twice` : '. No more retries'}`
    case 'created': return `Attempt ${n}: the ERP created it, number ${d.erpNumber ?? ''}`
    case 'replayed': return `Attempt ${n}: the ERP had already created it; we got the same number back, ${d.erpNumber ?? ''}`
    case 'rejected': return `Attempt ${n}: the ERP refused${d.reason ? `: ${d.reason}` : ''}`
    default: return `Attempt ${n}`
  }
}

function plainReason(reason: string | null | undefined): string {
  if (!reason) return 'no answer from the ERP'
  if (/timed out/i.test(reason)) return 'the ERP did not answer in time'
  if (/responded 5\d\d/i.test(reason)) return 'the ERP answered with an error'
  if (/unreachable/i.test(reason)) return 'the ERP could not be reached'
  return reason
}

// The events the timeline shows: what happened to the request, not how the pipe carried it. The send and a clean
// first attempt read as one fact, "the ERP assigned number …"; a retry, a replay or a refusal is the story, so it stays.
export function businessEvent(e: TimelineEvent): boolean {
  if (e.kind === 'email_queued' || e.kind === 'creating') return false
  if (e.kind === 'erp_attempt') { const phase = (e.detail as AttemptDetail | null)?.phase; return phase !== 'sent' && phase !== 'created' }
  return true
}

// Technical facts for the collapsed block: which credential, which attempt, the raw reason, the key.
export function technicalEvent(e: TimelineEvent): string | null {
  const d = (e.detail ?? {}) as Record<string, unknown>
  if (e.kind === 'erp_attempt') return [d.phase ? `phase ${String(d.phase)}` : null, d.credential ? `credential ${String(d.credential)}` : null, d.reason ? `reason "${String(d.reason)}"` : null, d.operationKey ? `key ${String(d.operationKey)}` : null].filter(Boolean).join(', ')
  if (e.kind === 'creating') return d.operationKey ? `operation key ${String(d.operationKey)}; run ${String(d.workflowRunId ?? '')}` : null
  if (e.kind === 'hub_checked') {
    const ai = d.ai as { model?: string | null; inputTokens?: number | null; outputTokens?: number | null; cost?: number | null; unavailable?: string | null } | null | undefined
    if (!ai) return d.route ? `route ${String(d.route)}` : null
    return [`route ${String(d.route)}`, ai.model ? `served by ${ai.model}` : null, ai.inputTokens != null ? `${ai.inputTokens} in / ${ai.outputTokens ?? 0} out tokens` : null, ai.cost != null ? `$${ai.cost.toFixed(5)}` : null, ai.unavailable ? `unavailable: ${ai.unavailable}` : null].filter(Boolean).join(', ')
  }
  if (e.kind === 'approve') return d.decisionId ? `decision ${String(d.decisionId)}, revision ${String(d.revision ?? '')}` : null
  return null
}
