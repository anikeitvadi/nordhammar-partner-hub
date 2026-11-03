import { describe, expect, it } from 'vitest'
import { canSeeIdentity, canSeeMoney, hasAnyRegion, isCentral, visibleRegions, type Principal } from './scope'

const requesterBR: Principal = { email: 'ana@example.com', displayName: 'Ana', role: 'requester', regions: ['BR'], globalIdentity: false, moneyRegions: ['BR'] }
const reviewer: Principal = { email: 'priya@example.com', displayName: 'Priya', role: 'reviewer', regions: ['BR', 'EU', 'US', 'IN', 'CN'], globalIdentity: true, moneyRegions: [] }
const noRegion: Principal = { email: 'new@example.com', displayName: 'New', role: 'requester', regions: [], globalIdentity: false, moneyRegions: [] }

describe('scope', () => {
  it('a regional requester sees identity only in their region', () => {
    expect(canSeeIdentity(requesterBR, 'BR')).toBe(true)
    expect(canSeeIdentity(requesterBR, 'EU')).toBe(false)
  })
  it('a global reviewer sees identity everywhere and money nowhere unless entitled', () => {
    expect(canSeeIdentity(reviewer, 'EU')).toBe(true)
    expect(canSeeMoney(reviewer, 'EU')).toBe(false)
    expect(canSeeMoney(reviewer, 'BR')).toBe(false)
  })
  it('money never crosses regions even for the owner of a region', () => {
    expect(canSeeMoney(requesterBR, 'BR')).toBe(true)
    expect(canSeeMoney(requesterBR, 'EU')).toBe(false)
  })
  it('no region means nothing is visible', () => {
    expect(hasAnyRegion(noRegion)).toBe(false)
    expect(visibleRegions(noRegion)).toEqual([])
    expect(canSeeIdentity(noRegion, 'BR')).toBe(false)
  })
})

describe('the two roles', () => {
  const central = (role: Principal['role']): Principal => ({ email: 'c@example.com', displayName: 'C', role, regions: ['BR', 'EU', 'US', 'IN', 'CN'], globalIdentity: true, moneyRegions: ['BR', 'EU', 'US', 'IN', 'CN'] })
  it('the central team is steward, and the earlier reviewer and operator values read the same', () => {
    expect(isCentral(central('steward'))).toBe(true)
    expect(isCentral(central('reviewer'))).toBe(true)
    expect(isCentral(central('operator'))).toBe(true)
  })
  it('a regional user is never central, and a central role without global identity is not either', () => {
    expect(isCentral(requesterBR)).toBe(false)
    expect(isCentral({ ...central('steward'), globalIdentity: false })).toBe(false)
  })
})
