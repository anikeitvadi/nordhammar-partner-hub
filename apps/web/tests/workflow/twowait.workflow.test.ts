import { describe, expect, it } from 'vitest'
import { start, resumeHook } from 'workflow/api'
import { waitForHook } from '@workflow/vitest'
import { twoWaitWorkflow } from './twowait.workflow'

describe('the request Workflow shape: finance, checks, a person only for exceptions', () => {
  it('clean after finance approves: created without a second wait', async () => {
    const id = `clean-${Date.now()}`
    const run = await start(twoWaitWorkflow, [id, true])
    await waitForHook(run, { token: `finance:${id}` })
    await resumeHook(`finance:${id}`, { decision: 'approve' })
    expect(await run.returnValue).toEqual({ outcome: 'created_automatically' })
  })
  it('not clean: waits again, on the central team, in the same run', async () => {
    const id = `exc-${Date.now()}`
    const run = await start(twoWaitWorkflow, [id, false])
    await waitForHook(run, { token: `finance:${id}` })
    await resumeHook(`finance:${id}`, { decision: 'approve' })
    await waitForHook(run, { token: `review:${id}` })
    await resumeHook(`review:${id}`, { decision: 'approve' })
    expect(await run.returnValue).toEqual({ outcome: 'created_after_review' })
  })
  it('finance rejects: ends without checks', async () => {
    const id = `rej-${Date.now()}`
    const run = await start(twoWaitWorkflow, [id, true])
    await waitForHook(run, { token: `finance:${id}` })
    await resumeHook(`finance:${id}`, { decision: 'reject' })
    expect(await run.returnValue).toEqual({ outcome: 'finance_rejected' })
  })
  it('a ticket raised in the desk starts with the decision attached and never waits on finance', async () => {
    const run = await start(twoWaitWorkflow, [`desk-${Date.now()}`, true, { decision: 'approve' }])
    expect(await run.returnValue).toEqual({ outcome: 'created_automatically' })
  })
})
