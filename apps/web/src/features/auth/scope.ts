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

export function canSeeMoney(p: Principal, region: Region): boolean {
  // Money never follows global identity. A reviewer sees every record and no amounts unless explicitly entitled.
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
