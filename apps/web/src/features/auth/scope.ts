import type { Region, Role } from '@intake/contracts'

// Pure. The one place that answers "may this principal see that". Tested without a database.
export type Principal = {
  email: string
  displayName: string
  role: Role
  regions: Region[]
  globalIdentity: boolean
  moneyRegions: Region[]
}

export function canSeeIdentity(p: Principal, region: Region): boolean {
  return p.globalIdentity || p.regions.includes(region)
}

// Two roles. A regional user works inside their regions and cannot approve. The central master data team sits above
// the regions: it reviews, owns the ERP write, handles stopped runs and runs the hub load. In the data the central
// team is 'steward'; 'reviewer' and 'operator' are the earlier split of the same job and are read the same way.
export function isCentral(p: Principal): boolean {
  return p.globalIdentity && (p.role === 'steward' || p.role === 'reviewer' || p.role === 'operator')
}

export function canSeeMoney(p: Principal, region: Region): boolean {
  // Money never follows global identity or role: it is the money_regions entitlement, granted per person.
  return p.moneyRegions.includes(region)
}

const ALL: Region[] = ['BR', 'EU', 'US', 'IN', 'CN']

// Two scopes, kept apart on purpose. Identity (a company's name, tax ID, city, group, which ERPs hold it) is what a
// golden record is for, so with global identity everyone reads it in every region; that one flag in the entitlements
// table is what turns it off for a region that may not see another. Work (where you request, whose requests and
// duplicate checks you see) stays in your own regions; the central team works in all of them. Amounts are a third,
// separate grant (canSeeMoney).
export function identityRegions(p: Principal): Region[] {
  return ALL.filter((r) => canSeeIdentity(p, r))
}

export function workRegions(p: Principal): Region[] {
  return isCentral(p) ? ALL : p.regions
}

export function canWorkIn(p: Principal, region: Region): boolean {
  return workRegions(p).includes(region)
}

export function hasAnyRegion(p: Principal): boolean {
  return workRegions(p).length > 0
}

export class ScopeError extends Error {
  constructor(message: string) { super(message); this.name = 'ScopeError' }
}
