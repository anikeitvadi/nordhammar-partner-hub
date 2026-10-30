import 'server-only'
import { start, resumeHook } from 'workflow/api'
import { sql } from '@/lib/db'
import { reviewWorkflow } from './review.workflow'
import { hookToken, type WakePayload } from './steps'

// Delivery to the workflow, from the durable deliveries table. Start and wake are both "at least once" from here;
// the workflow's hook token and the database's owner guards make the business effect "at most once".
// Called best-effort right after a commit, and again by the operator's retry action for anything left pending.
export async function deliverPending(requestId: string): Promise<{ delivered: number; failed: number }> {
  const db = sql()
  const rows = await db`select revision, kind, payload, attempts from deliveries where request_id = ${requestId} and status = 'pending' order by created_at`
  let delivered = 0, failed = 0
  for (const d of rows) {
    const revision = d.revision as number; const kind = d.kind as 'start' | 'wake'
    try {
      if (kind === 'start') {
        const run = await start(reviewWorkflow, [requestId, revision])
        await db`update requests set workflow_run_id = ${run.runId} where request_id = ${requestId}`
        await db`update deliveries set status = 'delivered', attempts = attempts + 1, updated_at = now() where request_id = ${requestId} and revision = ${revision} and kind = 'start'`
      } else {
        const payload = d.payload as WakePayload
        await resumeHook<WakePayload>(hookToken(requestId, revision), payload)
        // The workflow's own step marks the wake delivered; this mirrors it in case the step runs later than this read.
        await db`update deliveries set attempts = attempts + 1, updated_at = now() where request_id = ${requestId} and revision = ${revision} and kind = 'wake'`
      }
      delivered++
    } catch (e) {
      failed++
      await db`update deliveries set attempts = attempts + 1, last_error = ${e instanceof Error ? e.message : 'error'}, updated_at = now() where request_id = ${requestId} and revision = ${revision} and kind = ${kind}`
    }
  }
  return { delivered, failed }
}
