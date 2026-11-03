import { createHook } from 'workflow'

// The shape of requestWorkflow without the database: wait on finance (unless the decision came with the start), then
// wait on a person only when the checks fail. Proves two sequential hooks in one run and the pre-decided start.
type Finance = { decision: 'approve' | 'reject' }
export async function twoWaitWorkflow(id: string, clean: boolean, decided?: Finance) {
  'use workflow'
  const finance = createHook<Finance>({ token: `finance:${id}` })
  if (await finance.getConflict()) return { outcome: 'duplicate_run' as const }
  const f = decided ?? (await finance)
  if (f.decision === 'reject') return { outcome: 'finance_rejected' as const }
  const checked = await checkStep(clean)
  if (!checked) {
    const review = createHook<{ decision: string }>({ token: `review:${id}` })
    const wake = await review
    if (wake.decision !== 'approve') return { outcome: wake.decision }
    return { outcome: 'created_after_review' as const }
  }
  return { outcome: 'created_automatically' as const }
}

async function checkStep(clean: boolean) {
  'use step'
  return clean
}
