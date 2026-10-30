import { describe, expect, it } from 'vitest'
import { start, resumeHook } from 'workflow/api'
import { waitForHook } from '@workflow/vitest'
import { smokeWorkflow } from './smoke.workflow'

describe('workflow runtime on this machine', () => {
  it('waits on a hook, resumes, runs a step, and a duplicate start exits as duplicate_run', async () => {
    const token = `smoke:${Date.now()}`
    const run = await start(smokeWorkflow, [token])
    await waitForHook(run, { token })
    const dup = await start(smokeWorkflow, [token])
    await resumeHook(token, { decision: 'approve' })
    expect(await run.returnValue).toEqual({ outcome: 'resumed', stamped: 'approve@step' })
    expect(await dup.returnValue).toEqual({ outcome: 'duplicate_run' })
  })
})
