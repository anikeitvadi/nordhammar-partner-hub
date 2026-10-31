import { describe, expect, it } from 'vitest'
import { describeEvent, isLive } from './status'

describe('timeline copy', () => {
  it('tells the retry-and-replay story in order', () => {
    const lines = [
      { kind: 'erp_attempt', detail: { attempt: 1, phase: 'sent' } },
      { kind: 'erp_attempt', detail: { attempt: 1, phase: 'transient', reason: 'ERP timed out', retryAfterMs: 1000 } },
      { kind: 'erp_attempt', detail: { attempt: 2, phase: 'sent' } },
      { kind: 'erp_attempt', detail: { attempt: 2, phase: 'replayed', erpNumber: '26001' } },
      { kind: 'created', detail: { outcome: 'replayed', erpNumber: '26001' } },
    ].map((e) => describeEvent({ at: '2026-10-31T00:00:00Z', actor: 'workflow', ...e }))
    expect(lines).toEqual([
      'Attempt 1: sent to the ERP',
      'Attempt 1: ERP timed out; retrying in 1s with the same key',
      'Attempt 2: sent to the ERP',
      'Attempt 2: ERP replayed 26001, it had already committed',
      'ERP assigned number 26001 (replayed: the ERP already had it)',
    ])
  })
  it('says when retries are exhausted and what happens next', () => {
    expect(describeEvent({ at: 't', actor: 'workflow', kind: 'erp_attempt', detail: { attempt: 4, phase: 'transient', reason: 'ERP timed out', retryAfterMs: null } })).toBe('Attempt 4: ERP timed out; retries exhausted')
    expect(describeEvent({ at: 't', actor: 'workflow', kind: 'stopped', detail: { outcome: 'transient', reason: 'ERP timed out' } })).toMatch(/Effect unknown; an operator reconciles by key/)
  })
  it('polls only while the state can still move', () => {
    expect(isLive({ kind: 'creating', revision: 1, operationKey: 'k' } as never)).toBe(true)
    expect(isLive({ kind: 'created', revision: 1 } as never)).toBe(false)
    expect(isLive({ kind: 'draft', revision: 0 } as never)).toBe(false)
  })
})
