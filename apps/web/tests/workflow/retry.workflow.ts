import { RetryableError, getStepMetadata } from 'workflow'

// The retry boundary erpWriteStep relies on: attempts count from 1, and with maxRetries = N the last attempt is N + 1.
// That attempt returns its failure instead of throwing, so the run goes on to record it rather than failing.
export async function retryWorkflow() {
  'use workflow'
  const r = await alwaysTransientStep()
  return { outcome: r.outcome, attempts: r.attempt }
}

async function alwaysTransientStep() {
  'use step'
  const { attempt } = getStepMetadata()
  if (attempt > alwaysTransientStep.maxRetries) return { outcome: 'transient' as const, attempt }
  throw new RetryableError('down', { retryAfter: 10 })
}
alwaysTransientStep.maxRetries = 2
