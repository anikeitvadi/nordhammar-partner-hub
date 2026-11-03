import { describe, expect, it } from 'vitest'
import { start } from 'workflow/api'
import { retryWorkflow } from './retry.workflow'

describe('a step that never succeeds', () => {
  it('retries maxRetries times, then hands its failure back to the run instead of failing it', async () => {
    const run = await start(retryWorkflow, [])
    expect(await run.returnValue).toEqual({ outcome: 'transient', attempts: 3 })
  }, 30000)
})
