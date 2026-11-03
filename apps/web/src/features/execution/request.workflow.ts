import { createHook, getWorkflowMetadata } from 'workflow'
import { erpWriteStep, finishStep, hookToken, markWakeDeliveredStep, startCreatingStep, type WakePayload } from './steps'
import { checksStep, financeDecisionStep, financeToken, openTicketStep, outcomeTextStep, ticketCommentStep, type FinancePayload } from './desk.steps'

// One run per request revision, with the service desk in front (docs/SERVICE-DESK-CONTRACT.md §4). It waits, possibly
// for days, on finance in the desk; then the hub's checks run again. Clean: approved automatically and created. Not
// clean: an exception that waits on the central team, exactly as reviews always did. Either way the one keyed write,
// its retries and its replay are the same steps as before. A ticket raised in the desk first arrives with finance's
// decision already made, so the run starts past the wait.
export async function requestWorkflow(requestId: string, revision: number, decided?: FinancePayload) {
  'use workflow'
  const { workflowRunId } = getWorkflowMetadata()
  const finance = createHook<FinancePayload>({ token: financeToken(requestId, revision) })
  if (await finance.getConflict()) return { outcome: 'duplicate_run' as const }
  const ticketId = await openTicketStep(requestId, revision, workflowRunId)
  const f = decided ?? (await finance)
  const moved = await financeDecisionStep(requestId, revision, f)
  if (moved === 'rejected') return { outcome: 'finance_rejected' as const }
  if (moved === 'not_waiting') return { outcome: 'not_waiting' as const }

  const checked = await checksStep(requestId, revision)
  if (!checked.clean) {
    await ticketCommentStep(ticketId, `exception:${requestId}:${revision}`, `Finance approval received. Waiting for the central master-data team: ${checked.reasons.join('; ')}.`)
    const review = createHook<WakePayload>({ token: hookToken(requestId, revision) })
    const wake = await review
    await markWakeDeliveredStep(requestId, revision, workflowRunId)
    if (wake.decision !== 'approve') {
      await ticketCommentStep(ticketId, `outcome:${requestId}:${revision}`, await outcomeTextStep(requestId))
      return { outcome: wake.decision }
    }
  }
  const command = await startCreatingStep(requestId, revision, workflowRunId)
  if (!command) return { outcome: 'not_approved' as const }
  const result = await erpWriteStep(command)
  await finishStep(requestId, revision, result)
  await ticketCommentStep(ticketId, `outcome:${requestId}:${revision}`, await outcomeTextStep(requestId))
  return { outcome: result.outcome, automatic: checked.clean }
}
