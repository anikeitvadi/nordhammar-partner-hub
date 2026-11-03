import { describeFallback } from '@/features/ai/models'
import { duration } from './trace'
import { readRunPanel, type ErpAttempt } from './trace.server'

// "Where was the time spent, and what did it cost" for one request (docs/RUN-TRACE-CONTRACT.md §1). Server-rendered and
// streamed behind Suspense by the request page, so the read from the Workflow World never holds the page up. Every
// number says where it came from: measured by the Gateway, recorded by Workflow, or computed at a list price.
const usd = (n: number) => `$${n < 0.01 ? n.toFixed(6) : n.toFixed(4)}`

export async function RunPanel({ requestId, workflowRunId }: { requestId: string; workflowRunId: string | null }) {
  const { trace, traceUnavailable, check, erpAttempts } = await readRunPanel(requestId, workflowRunId)
  const modelCost = check?.costUsd ?? 0
  const t0 = trace?.startedAt ? Date.parse(trace.startedAt) : 0
  return (
    <>
      <h2>How this ran</h2>
      {trace ? (
        <p className="runin">
          {trace.status === 'running' ? <>Running for {duration(trace.totals.wallMs)}: </> : <>The run took {duration(trace.totals.wallMs)}: </>}
          <strong>{duration(trace.totals.waitingMs)} waiting on people</strong>, {duration(trace.totals.workingMs)} in steps; the rest is the platform moving between steps. A paused run costs nothing while it waits.
        </p>
      ) : (
        <p className="muted">{traceUnavailable === 'no run' ? 'This request has no Workflow run (it was seeded, or not submitted yet).' : 'The platform\'s run record is not available for this request. The timeline above is the record.'}</p>
      )}
      {trace ? (
        <table className="results run-trace">
          <thead><tr><th className="num">At</th><th>What happened</th><th className="num">Took</th><th className="col-secondary">Notes</th></tr></thead>
          <tbody>
            {trace.rows.map((r) => (
              <tr key={r.key}>
                <td className="num muted">+{duration(Date.parse(r.startedAt) - t0)}</td>
                <td>{r.label}</td>
                <td className="num">{r.kind === 'wait' && r.open ? <>{duration(r.ms)} so far</> : duration(r.ms)}</td>
                <td className="col-secondary muted">{r.kind === 'wait' ? (r.open ? 'waiting now; paused, costs nothing' : 'paused, costs nothing') : stepNote(r.label, r.attempts, r.retryWaitMs, erpAttempts)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
      <dl className="facts run-cost">
        <dt>Duplicate check, before submit</dt>
        <dd>{!check ? 'No check recorded for this request.' : check.route !== 'compare' ? `No model call: the check ended at "${check.route}" by code alone.` : check.model ? <>{check.model}{check.ms != null ? `, ${duration(check.ms)}` : ''}{check.inputTokens != null ? `, ${check.inputTokens} in / ${check.outputTokens} out tokens` : ''}{describeFallback(check.attempts) ? <><br /><span className="muted small">{describeFallback(check.attempts)}</span></> : null}</> : `No AI reading: ${check.unavailable ?? 'not available'}.`}</dd>
        <dt>Model cost</dt>
        <dd>{check?.costUsd != null ? <>{usd(check.costUsd)} <span className="muted small">measured, from the Gateway</span></> : <>$0 <span className="muted small">no model call was billed</span></>}</dd>
        {trace ? <><dt>Workflow</dt><dd>{trace.events} events × $0.02 per 1,000 = {usd(trace.workflowCostUsd)} <span className="muted small">computed at the on-demand list price</span></dd></> : null}
        <dt>This request</dt>
        <dd><strong>{usd(modelCost + (trace?.workflowCostUsd ?? 0))}</strong> <span className="muted small">plus function compute (Active CPU, billed per project, not per run) and Workflow storage (per run in the Vercel dashboard)</span></dd>
      </dl>
      {trace && workflowRunId ? <p className="muted small">From Vercel Workflow&apos;s event log for run <code>{workflowRunId}</code>, read without payloads, and the hub&apos;s record of the check. Price per event: vercel.com/docs/workflows/pricing.</p> : null}
    </>
  )
}

function stepNote(label: string, attempts: number, retryWaitMs: number, erp: ErpAttempt[]): string {
  if (label === 'Sent to the ERP' && erp.length) {
    const tries = erp.map((a) => `attempt ${a.attempt}: ${a.phase}${a.reason ? ` (${a.reason})` : ''}`).join('; ')
    return attempts > 1 ? `${tries}; waited ${duration(retryWaitMs)} before retrying with the same key` : tries
  }
  return attempts > 1 ? `${attempts} attempts, ${duration(retryWaitMs)} of backoff` : ''
}
