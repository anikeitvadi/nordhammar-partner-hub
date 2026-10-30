import { createHook, getWorkflowMetadata } from 'workflow'
import { erpWriteStep, finishStep, hookToken, markWakeDeliveredStep, startCreatingStep, type WakePayload } from './steps'

// The durable review → ERP write. One run per (request, revision). It waits, possibly for days, on the reviewer's
// decision, then owns the one write to the ERP. Business truth lives in the database (the steps write it); this
// function owns execution, waiting and retry only. A redeploy does not lose the wait: the run continues on the
// deployment that started it.
export async function reviewWorkflow(requestId: string, revision: number) {
  'use workflow'
  const { workflowRunId } = getWorkflowMetadata()
  const hook = createHook<WakePayload>({ token: hookToken(requestId, revision) })
  // Two 'start' deliveries for one revision would create two runs; the token is unique, so the second finds a conflict and exits before any side effect.
  const conflict = await hook.getConflict()
  if (conflict) return { outcome: 'duplicate_run' as const }
  const wake = await hook
  await markWakeDeliveredStep(requestId, revision, workflowRunId)
  if (wake.decision !== 'approve') return { outcome: wake.decision as 'decline' | 'send_back' }
  const command = await startCreatingStep(requestId, revision, workflowRunId)
  if (!command) return { outcome: 'not_approved' as const }
  const result = await erpWriteStep(command)
  await finishStep(requestId, revision, result)
  return { outcome: result.outcome }
}
