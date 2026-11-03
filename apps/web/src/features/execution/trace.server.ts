import 'server-only'
import { getWorld } from 'workflow/runtime'
import { sql } from '@/lib/db'
import { buildTrace, type RunEvent, type Trace } from './trace'

// The Run panel's reads (docs/RUN-TRACE-CONTRACT.md §1). The caller has already checked the person may see the request.
// Two sources, each labelled on the panel: the platform's event log for the run (what Vercel Workflow recorded), and
// the hub's own record of the duplicate check, the only model call on a request, which happens before the run starts.

export type CheckCost = { route: string; model: string | null; attempts: { model: string; ok: boolean }[] | null; inputTokens: number | null; outputTokens: number | null; costUsd: number | null; ms: number | null; unavailable: string | null }
export type ErpAttempt = { attempt: number; phase: string; reason: string | null }
export type RunPanel = { trace: Trace | null; traceUnavailable: string | null; check: CheckCost | null; erpAttempts: ErpAttempt[] }

export async function readRunPanel(requestId: string, workflowRunId: string | null): Promise<RunPanel> {
  const [trace, check, erpAttempts] = await Promise.all([readTrace(workflowRunId), readCheck(requestId), readErpAttempts(requestId)])
  return { trace: trace.ok ? trace.trace : null, traceUnavailable: trace.ok ? null : trace.reason, check, erpAttempts }
}

// Metadata only (resolveData 'none'): no step inputs or outputs leave the World, and metadata is kept longer than
// payloads. A failure here never breaks the request page; the panel says the record is not available.
async function readTrace(runId: string | null): Promise<{ ok: true; trace: Trace } | { ok: false; reason: string }> {
  if (!runId) return { ok: false, reason: 'no run' }
  try {
    const world = await getWorld()
    const events: RunEvent[] = []
    let cursor: string | undefined
    for (let page = 0; page < 20; page++) {
      const res = await world.events.list({ runId, resolveData: 'none', pagination: { sortOrder: 'asc', cursor } })
      for (const e of res.data) {
        const data = (e as { eventData?: { stepName?: string } }).eventData
        events.push({ eventType: e.eventType, correlationId: e.correlationId ?? null, createdAt: e.createdAt, stepName: data?.stepName ?? null, workflowName: (e as { workflowName?: string }).workflowName ?? null })
      }
      if (!res.hasMore || !res.cursor) break
      cursor = res.cursor
    }
    if (events.length === 0) return { ok: false, reason: 'no events' }
    // The workflow's name is on the run, not on every event; the builder needs it to name the waits.
    if (!events.some((e) => e.workflowName)) {
      const run = await world.runs.get(runId, { resolveData: 'none' })
      events[0] = { ...events[0], workflowName: run.workflowName }
    }
    return { ok: true, trace: buildTrace(events) }
  } catch (e) {
    console.error('run trace not read', { runId, error: e instanceof Error ? `${e.name}: ${e.message}` : String(e) })
    return { ok: false, reason: 'read failed' }
  }
}

async function readCheck(requestId: string): Promise<CheckCost | null> {
  const r = (await sql()`select route, ai_model, ai_attempts, ai_input_tokens, ai_output_tokens, ai_cost, ai_ms, ai_unavailable from hub_checks where request_id = ${requestId} order by at desc limit 1`)[0]
  if (!r) return null
  return { route: r.route as string, model: (r.ai_model as string | null) ?? null, attempts: (r.ai_attempts as CheckCost['attempts']) ?? null, inputTokens: (r.ai_input_tokens as number | null) ?? null, outputTokens: (r.ai_output_tokens as number | null) ?? null, costUsd: r.ai_cost == null ? null : Number(r.ai_cost), ms: (r.ai_ms as number | null) ?? null, unavailable: (r.ai_unavailable as string | null) ?? null }
}

// The hub's log of each send to the integration platform, for the reason behind a retry (503, timeout, replayed).
async function readErpAttempts(requestId: string): Promise<ErpAttempt[]> {
  const rows = await sql()`select detail from request_events where request_id = ${requestId} and kind = 'erp_attempt' order by id`
  return rows.map((r) => r.detail as { attempt: number; phase: string; reason?: string | null; erpNumber?: string }).filter((d) => d.phase !== 'sent').map((d) => ({ attempt: d.attempt, phase: d.phase, reason: d.reason ?? (d.erpNumber ? `number ${d.erpNumber}` : null) }))
}
