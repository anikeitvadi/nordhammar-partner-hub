import { describe, expect, it } from 'vitest'
import { buildTrace, duration, WORKFLOW_EVENT_USD, type RunEvent } from './trace'
// Both fixtures are real runs on staging, 2026-11-03, read with `workflow inspect events --backend vercel`, trimmed to
// the fields the panel uses.
import exception from './fixtures/run-exception.json'
import lost from './fixtures/run-lost-response.json'

describe('the Run panel, from the platform\'s event log', () => {
  it('an exception: two waits, on finance then the central team, and the steps between them', () => {
    const tr = buildTrace(exception as RunEvent[])
    expect(tr.status).toBe('completed')
    const waits = tr.rows.filter((r) => r.kind === 'wait')
    expect(waits.map((w) => w.label)).toEqual(['Waiting on finance in the service desk', 'Waiting on the central master-data team'])
    expect(waits.map((w) => duration(w.ms))).toEqual(['1 min 38 s', '3 min 13 s'])
    expect(tr.rows.filter((r) => r.kind === 'step').map((r) => r.label)).toContain('Checked the request again')
    expect(tr.totals.waitingMs).toBeGreaterThan(tr.totals.workingMs * 50)
    expect(tr.events).toBe(37)
    expect(tr.workflowCostUsd).toBeCloseTo(37 * WORKFLOW_EVENT_USD, 10)
  })
  it('a lost response: the ERP step took two attempts, with the backoff it asked for', () => {
    const tr = buildTrace(lost as RunEvent[])
    const erp = tr.rows.find((r) => r.kind === 'step' && r.label === 'Sent to the ERP')
    expect(erp).toMatchObject({ attempts: 2, status: 'completed' })
    expect(erp && erp.kind === 'step' && erp.retryWaitMs).toBe(1428)
  })
  it('a ticket raised in the desk: the finance hook was never waited on, so it is not a wait', () => {
    const tr = buildTrace(lost as RunEvent[])
    expect(tr.rows.some((r) => r.kind === 'wait')).toBe(false)
  })
  it('a run still waiting shows the wait as open, measured to now', () => {
    const open = (exception as RunEvent[]).slice(0, 6)
    const tr = buildTrace(open, Date.parse('2026-11-03T04:51:55.597Z'))
    expect(tr.status).toBe('running')
    expect(tr.rows.find((r) => r.kind === 'wait')).toMatchObject({ open: true, ms: 2 * 3600_000 })
  })
  it('durations read as a person would say them', () => {
    expect([duration(84), duration(1428), duration(193_000), duration(7_380_000), duration(165_600_000), duration(null)]).toEqual(['84 ms', '1.4 s', '3 min 13 s', '2 h 3 min', '1 d 22 h', 'n/a'])
  })
})
