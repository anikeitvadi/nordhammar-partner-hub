// Runs only when TEST_DATABASE_URL points at a seeded hub. Asserts the policy against real SQL, not a mock.
import { describe, expect, it } from 'vitest'

const url = process.env.TEST_DATABASE_URL
describe.skipIf(!url)('hub reads against a seeded database', () => {
  it('a foreign exact tax-ID match returns the region and nothing else', async () => {
    process.env.DATABASE_URL = url
    const { exactTaxIdLookup } = await import('@/features/customers/hub.server')
    const ana = { email: 'ana@example.com', displayName: 'Ana', role: 'requester' as const, regions: ['BR' as const], globalIdentity: false, moneyRegions: ['BR' as const] }
    const hit = await exactTaxIdLookup(ana, '61000107000124')
    expect(hit).toEqual({ foreignRegion: 'EU' })
  })
  it('a customer in another region reads as not found', async () => {
    process.env.DATABASE_URL = url
    const { getCustomer } = await import('@/features/customers/hub.server')
    const ana = { email: 'ana@example.com', displayName: 'Ana', role: 'requester' as const, regions: ['BR' as const], globalIdentity: false, moneyRegions: ['BR' as const] }
    expect(await getCustomer(ana, 'G-ORLA-EU')).toBeNull()
  })
  it('a global reviewer sees the record but not the money', async () => {
    process.env.DATABASE_URL = url
    const { getCustomer } = await import('@/features/customers/hub.server')
    const priya = { email: 'priya@example.com', displayName: 'Priya', role: 'reviewer' as const, regions: ['BR', 'EU', 'US', 'IN', 'CN'] as const, globalIdentity: true, moneyRegions: [] }
    const c = await getCustomer({ ...priya, regions: [...priya.regions] }, 'G-ORLA-EU')
    expect(c?.legalName).toBe('Orla Europa GmbH')
    expect(c?.credit).toBe('not_entitled')
  })
})
