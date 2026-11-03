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

export function visibleRegions(p: Principal): Region[] {
  return p.globalIdentity ? (['BR', 'EU', 'US', 'IN', 'CN'] as Region[]) : p.regions
}

export function hasAnyRegion(p: Principal): boolean {
  return visibleRegions(p).length > 0
}

export class ScopeError extends Error {
  constructor(message: string) { super(message); this.name = 'ScopeError' }
}
