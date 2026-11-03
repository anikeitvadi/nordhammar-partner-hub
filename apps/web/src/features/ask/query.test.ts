import { describe, expect, it } from 'vitest'
import { chartKind, describeSpec, QuerySpecSchema, recordsLink, timeStart, validateSpec } from './query'

const spec = (s: unknown) => QuerySpecSchema.parse(s)

describe('the query spec: what is allowed', () => {
  it('every sensible combination passes', () => {
    for (const s of [
      { subject: 'partners', measure: 'count', filters: { status: 'hold' }, groupBy: 'region' },
      { subject: 'partners', measure: 'credit_limit', filters: { group: 'aurora' }, groupBy: 'ultimate_parent' },
      { subject: 'partners', measure: 'spend_ytd', groupBy: 'currency' },
      { subject: 'requests', measure: 'median_hours_to_number', filters: { approval: 'automatic' }, groupBy: 'month', time: 'this_year' },
      { subject: 'checks', measure: 'stopped_at_entry', time: 'this_month' },
    ]) expect(validateSpec(spec(s))).toEqual({ ok: true })
  })
  it('anything else is refused with the sentence for its subject, never approximated', () => {
    expect(validateSpec(spec({ subject: 'partners', measure: 'median_hours_to_number' }))).toMatchObject({ ok: false, refusal: expect.stringContaining('I can count partners') })
    expect(validateSpec(spec({ subject: 'partners', measure: 'count', groupBy: 'month' })).ok).toBe(false)
    expect(validateSpec(spec({ subject: 'requests', measure: 'count', filters: { group: 'aurora' } })).ok).toBe(false)
    expect(validateSpec(spec({ subject: 'partners', measure: 'credit_limit', filters: { domain: 'supplier' } })).ok).toBe(false)
    expect(validateSpec(spec({ subject: 'partners', measure: 'count', groupBy: 'currency' })).ok).toBe(false)
    expect(validateSpec(spec({ subject: 'checks', measure: 'count', filters: { status: 'hold' } })).ok).toBe(false)
  })
  it('a group-by outside the list (a tax ID, say) cannot even be expressed', () => {
    expect(QuerySpecSchema.safeParse({ subject: 'partners', measure: 'count', groupBy: 'tax_id' }).success).toBe(false)
  })
})

describe('the query in words, written by code', () => {
  it('says what was counted, where, and for whom', () => {
    expect(describeSpec(spec({ subject: 'partners', measure: 'count', filters: { status: 'hold' }, groupBy: 'region' }), { regions: ['BR', 'EU'] }))
      .toBe('Count of partners, on hold, by region, in BR, EU (your regions).')
    expect(describeSpec(spec({ subject: 'partners', measure: 'count', time: 'this_month' }), { regions: [] })).toBe('Count of partners, that joined this month, in none of your regions.')
    expect(describeSpec(spec({ subject: 'checks', measure: 'stopped_at_entry', time: 'this_month' }), { regions: ['BR'] })).toBe('Duplicates stopped at entry, this month, in BR (your regions).')
    expect(describeSpec(spec({ subject: 'partners', measure: 'credit_limit', filters: { group: 'aurora' } }), { regions: ['BR'], moneyRegions: ['BR'], groups: ['Aurora Industrial Group'] }))
      .toBe('Credit limits of customers, in Aurora Industrial Group, amounts in BR (your amount regions).')
    expect(describeSpec(spec({ subject: 'requests', measure: 'count', filters: { source: 'desk' }, time: 'this_month' }), { regions: ['BR'] }))
      .toBe('Count of requests, raised in the service desk, this month, in BR (your regions).')
  })
})

describe('the picture and the link', () => {
  it('the shape picks the chart', () => {
    expect(chartKind(spec({ subject: 'partners', measure: 'count' }), 1)).toBe('number')
    expect(chartKind(spec({ subject: 'requests', measure: 'count', groupBy: 'month' }), 3)).toBe('line')
    expect(chartKind(spec({ subject: 'partners', measure: 'count', groupBy: 'region' }), 5)).toBe('bars')
    expect(chartKind(spec({ subject: 'partners', measure: 'credit_limit', groupBy: 'ultimate_parent' }), 12)).toBe('table')
  })
  it('links to the records only when one page shows exactly them', () => {
    expect(recordsLink(spec({ subject: 'partners', measure: 'count', filters: { domain: 'customer', status: 'hold', region: ['BR'] } }))).toBe('/customers?in=BR&status=hold')
    expect(recordsLink(spec({ subject: 'partners', measure: 'count', filters: { status: 'hold' } }))).toBeNull()
    expect(recordsLink(spec({ subject: 'partners', measure: 'count', filters: { domain: 'supplier' }, groupBy: 'region' }))).toBeNull()
  })
  it('time windows', () => {
    const now = new Date('2026-11-03T04:00:00Z')
    expect(timeStart('this_month', now)?.toISOString()).toBe('2026-11-01T00:00:00.000Z')
    expect(timeStart('this_year', now)?.toISOString()).toBe('2026-01-01T00:00:00.000Z')
    expect(timeStart('all_time', now)).toBeNull()
  })
})
