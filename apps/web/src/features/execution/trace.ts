// Pure. Turns a Workflow run's event log into the Run panel (docs/RUN-TRACE-CONTRACT.md §1): what each step did and
// how long it took, how long the run waited on people, and what the run's events cost. The events are the platform's
// own record (world.events.list), read without payloads, so the panel shows what Vercel recorded, not a reconstruction.

// On-demand list price for Workflow Events, $0.02 per 1,000. Source: https://vercel.com/docs/workflows/pricing (read
// 2026-11-03). Compute and data written are billed separately and are not attributable to one run from the app.
export const WORKFLOW_EVENT_USD = 0.02 / 1000

// Metadata-only events as the World returns them. The CLI flattens stepName onto the event; the API nests it in
// eventData; both are accepted.
export type RunEvent = { eventType: string; correlationId?: string | null; createdAt: string | Date; stepName?: string | null; eventData?: { stepName?: string | null } | null; workflowName?: string | null }

export type TraceRow =
  | { kind: 'step'; key: string; label: string; startedAt: string; ms: number | null; attempts: number; retryWaitMs: number; status: 'completed' | 'failed' | 'running' }
  | { kind: 'wait'; key: string; label: string; startedAt: string; ms: number | null; open: boolean }

export type Trace = {
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  startedAt: string | null
  endedAt: string | null
  rows: TraceRow[]
  totals: { wallMs: number | null; waitingMs: number; workingMs: number }
  events: number
  workflowCostUsd: number
}

// Plain words for each step, by the function's name. A step not listed shows its own name.
const STEP_LABELS: Record<string, string> = {
  openTicketStep: 'Opened the finance ticket in the service desk',
  financeDecisionStep: "Recorded finance's decision",
  checksStep: 'Checked the request again',
  ticketCommentStep: 'Wrote to the ticket',
  outcomeTextStep: 'Worded the outcome for the ticket',
  markWakeDeliveredStep: "Recorded the central team's decision",
  startCreatingStep: 'Locked the approved version for the ERP',
  erpWriteStep: 'Sent to the ERP',
  finishStep: 'Recorded the ERP number',
}

// Which person each hook waits on, in the order the workflow creates them. Hook tokens are not in a metadata-only
// read, so order is the key: requestWorkflow creates finance's hook, then the central team's; reviewWorkflow (requests
// raised before the service desk) creates only the central team's.
const WAITS: Record<string, string[]> = {
  requestWorkflow: ['Waiting on finance in the service desk', 'Waiting on the central master-data team'],
  reviewWorkflow: ['Waiting on the central master-data team'],
}

const shortName = (name: string | null | undefined) => (name ?? '').split('//').pop() || 'step'
const t = (d: string | Date) => new Date(d).getTime()
const iso = (n: number) => new Date(n).toISOString()

export function buildTrace(events: RunEvent[], now: number = Date.now()): Trace {
  const sorted = [...events].sort((a, b) => t(a.createdAt) - t(b.createdAt))
  const workflow = shortName(sorted.find((e) => e.workflowName)?.workflowName)
  const waitLabels = WAITS[workflow] ?? []
  const rows: TraceRow[] = []
  const steps = new Map<string, Extract<TraceRow, { kind: 'step' }> & { lastStart: number; firstStart: number }>()
  const hooks = new Map<string, Extract<TraceRow, { kind: 'wait' }> & { at: number }>()
  let hookIndex = 0, startedAt: number | null = null, endedAt: number | null = null
  let status: Trace['status'] = 'running'

  for (const e of sorted) {
    const at = t(e.createdAt); const id = e.correlationId ?? ''
    switch (e.eventType) {
      case 'run_created': startedAt ??= at; break
      case 'run_completed': endedAt = at; status = 'completed'; break
      case 'run_failed': endedAt = at; status = 'failed'; break
      case 'run_cancelled': endedAt = at; status = 'cancelled'; break
      case 'step_created': {
        const label = STEP_LABELS[shortName(e.stepName ?? e.eventData?.stepName)] ?? shortName(e.stepName ?? e.eventData?.stepName)
        const row = { kind: 'step' as const, key: id, label, startedAt: iso(at), ms: null, attempts: 0, retryWaitMs: 0, status: 'running' as const, lastStart: at, firstStart: at }
        steps.set(id, row); rows.push(row); break
      }
      case 'step_started': { const s = steps.get(id); if (s) { if (s.attempts > 0) s.retryWaitMs += at - s.lastStart; s.attempts += 1; s.lastStart = at } break }
      // The gap from a retry to the next start is the backoff the step asked for (retryAfter).
      case 'step_retrying': { const s = steps.get(id); if (s) s.lastStart = at; break }
      case 'step_completed': case 'step_failed': { const s = steps.get(id); if (s) { s.ms = at - s.firstStart; s.status = e.eventType === 'step_completed' ? 'completed' : 'failed' } break }
      case 'hook_created': {
        const label = waitLabels[hookIndex++] ?? 'Waiting on an outside event'
        const row = { kind: 'wait' as const, key: id, label, startedAt: iso(at), ms: null, open: true, at }
        hooks.set(id, row); rows.push(row); break
      }
      case 'hook_received': { const h = hooks.get(id); if (h && h.open) { h.ms = at - h.at; h.open = false } break }
    }
  }
  // A hook the run never waited on (a ticket raised in the desk arrives with finance's decision) is not a wait.
  const finished = status !== 'running'
  const shown = rows.filter((r) => !(r.kind === 'wait' && r.open && finished)).map((r) => {
    if (r.kind === 'wait') { const { at, ...rest } = r as typeof r & { at: number }; return { ...rest, ms: rest.open ? now - at : rest.ms } }
    const { lastStart: _l, firstStart: _f, ...rest } = r as typeof r & { lastStart: number; firstStart: number }
    void _l; void _f
    return rest
  })
  const waitingMs = shown.reduce((n, r) => n + (r.kind === 'wait' && r.ms ? r.ms : 0), 0)
  const workingMs = shown.reduce((n, r) => n + (r.kind === 'step' && r.ms ? r.ms : 0), 0)
  const wallMs = startedAt == null ? null : (endedAt ?? now) - startedAt
  return { status, startedAt: startedAt == null ? null : iso(startedAt), endedAt: endedAt == null ? null : iso(endedAt), rows: shown, totals: { wallMs, waitingMs, workingMs }, events: events.length, workflowCostUsd: events.length * WORKFLOW_EVENT_USD }
}

// "1 d 22 h", "3 min 13 s", "1.4 s", "84 ms": the largest two units that matter.
export function duration(ms: number | null): string {
  if (ms == null) return 'n/a'
  if (ms < 1000) return `${Math.round(ms)} ms`
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)} s`
  const s = Math.round(ms / 1000), d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
  if (d) return `${d} d ${h} h`
  if (h) return `${h} h ${m} min`
  return `${m} min ${sec} s`
}
