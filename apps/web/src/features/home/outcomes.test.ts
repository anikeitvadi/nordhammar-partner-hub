import { describe, expect, it } from 'vitest'
import { businessHoursBetween, cycle, hoursLabel } from './outcomes'

describe('request to ERP number, against one business day', () => {
  it('counts weekday hours only', () => {
    expect(businessHoursBetween('2026-11-02T10:00:00Z', '2026-11-02T13:30:00Z')).toBe(3.5) // Monday
    expect(businessHoursBetween('2026-10-30T20:00:00Z', '2026-11-02T08:00:00Z')).toBe(12) // Friday 20:00 to Monday 08:00
    expect(businessHoursBetween('2026-11-02T10:00:00Z', '2026-11-02T09:00:00Z')).toBe(0)
  })
  it('a median and the share inside one business day', () => {
    const c = cycle([
      { submittedAt: '2026-11-02T10:00:00Z', createdAt: '2026-11-02T10:00:03Z' },
      { submittedAt: '2026-11-02T10:00:00Z', createdAt: '2026-11-03T12:00:00Z' },
      { submittedAt: '2026-10-30T20:00:00Z', createdAt: '2026-11-02T08:00:00Z' },
    ])
    expect(c).toEqual({ created: 3, insideOneDay: 2, medianHours: 12 })
    expect(cycle([]).medianHours).toBeNull()
    // A two-minute median must read as two minutes, not round to zero.
    expect(hoursLabel(cycle([{ submittedAt: '2026-11-03T02:51:54Z', createdAt: '2026-11-03T02:53:54Z' }]).medianHours)).toBe('2 min')
  })
  it('reads at a glance', () => {
    expect([hoursLabel(12), hoursLabel(0.43), hoursLabel(0.0008), hoursLabel(null)]).toEqual(['12.0 h', '26 min', '3 s', 'n/a'])
  })
})
