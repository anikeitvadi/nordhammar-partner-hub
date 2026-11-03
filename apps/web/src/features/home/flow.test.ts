import { describe, expect, it } from 'vitest'
import { layoutFlow, routeOf, stackDots, stripX, STRIP_MAX_H } from './flow'

describe('which route a request took', () => {
  it('clean through finance: decided by the checks', () => {
    expect(routeOf({ fromDesk: false, ticket: true, events: ['finance_approved', 'checks_clean', 'created'], state: 'created' })).toEqual({ steps: ['Hub form', 'Finance approved', 'Checks passed', 'ERP number'], who: 'checks' })
  })
  it('an exception the central team approved: decided by a person', () => {
    expect(routeOf({ fromDesk: false, ticket: true, events: ['finance_approved', 'exception', 'approve', 'created'], state: 'created' })).toEqual({ steps: ['Hub form', 'Finance approved', 'Exception', 'ERP number'], who: 'person' })
  })
  it('an open exception from the desk is not decided yet', () => {
    expect(routeOf({ fromDesk: true, ticket: false, events: ['finance_approved', 'exception'], state: 'exception' })).toEqual({ steps: ['Service desk', 'Finance approved', 'Exception', 'Waiting'], who: 'pending' })
  })
  it('finance rejects: a person, and no checks ran', () => {
    expect(routeOf({ fromDesk: false, ticket: true, events: ['finance_rejected'], state: 'declined' })).toEqual({ steps: ['Hub form', 'Finance rejected', 'Declined'], who: 'person' })
  })
  it('raised before the service desk: the central team reviewed it', () => {
    expect(routeOf({ fromDesk: false, ticket: false, events: ['approve', 'stopped'], state: 'stopped' })).toEqual({ steps: ['Hub form', 'Central review', 'Stopped'], who: 'person' })
  })
})

describe('the flow layout', () => {
  const routes = [
    ...Array(5).fill(routeOf({ fromDesk: false, ticket: true, events: ['finance_approved', 'checks_clean'], state: 'created' })),
    ...Array(2).fill(routeOf({ fromDesk: false, ticket: true, events: ['finance_approved', 'exception', 'approve'], state: 'created' })),
    routeOf({ fromDesk: false, ticket: true, events: ['finance_rejected'], state: 'declined' }),
    ...Array(6).fill(routeOf({ fromDesk: false, ticket: false, events: [], state: 'submitted' })),
  ]
  const f = layoutFlow(routes, { width: 700, height: 200 })
  it('every column carries every request it should, and nodes stay inside the box', () => {
    const col = (c: number) => f.nodes.filter((n) => n.col === c).reduce((s, n) => s + n.n, 0)
    expect([col(0), col(1), col(3)]).toEqual([14, 14, 14])
    expect(col(2)).toBe(7)
    for (const n of f.nodes) { expect(n.y).toBeGreaterThanOrEqual(-0.001); expect(n.y + n.h).toBeLessThanOrEqual(200.001) }
  })
  it('ribbons by who, and their counts add up per node', () => {
    const out = (id: string) => f.links.filter((l) => l.from === id).reduce((s, l) => s + l.n, 0)
    expect(out('Hub form')).toBe(14)
    expect(f.links.find((l) => l.from === 'Checks passed')).toMatchObject({ to: 'ERP number', who: 'checks', n: 5 })
    expect(f.links.find((l) => l.from === 'Finance rejected')).toMatchObject({ to: 'Declined', who: 'person', n: 1 })
  })
  it('no requests, no shapes', () => {
    expect(layoutFlow([])).toMatchObject({ nodes: [], links: [], total: 0 })
  })
})

describe('the time strip', () => {
  it('a log scale from a second to a working week', () => {
    expect(stripX(1 / 3600, 600)).toBe(0)
    expect(stripX(STRIP_MAX_H, 600)).toBe(600)
    expect(stripX(0.0001, 600)).toBe(0)
    expect(Math.round(stripX(24, 600))).toBe(Math.round((Math.log10(24 * 3600) / Math.log10(120 * 3600)) * 600))
  })
  it('dots that would overlap stack into rows', () => {
    expect(stackDots([{ x: 10 }, { x: 12 }, { x: 40 }], 5).map((d) => d.row)).toEqual([0, 1, 0])
  })
})
