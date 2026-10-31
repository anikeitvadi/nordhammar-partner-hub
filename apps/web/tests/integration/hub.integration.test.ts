// Runs only when TEST_DATABASE_URL points at a seeded hub. Asserts the policy against real SQL, not a mock.
import { describe, expect, it } from 'vitest'

const url = process.env.TEST_DATABASE_URL
describe.skipIf(!url)('hub reads against a seeded database', () => {
  it('a foreign exact tax-ID match returns the region and nothing else', async () => {
    process.env.DATABASE_URL = url
    const { exactTaxIdLookup } = await import('@/features/customers/hub.server')
    const ana = { email: 'ana@example.com', displayName: 'Ana', role: 'requester' as const, regions: ['BR' as const], globalIdentity: false, moneyRegions: ['BR' as const] }
    const hit = await exactTaxIdLookup(ana, 'customer', '61000107000124')
    expect(hit).toEqual({ foreignRegion: 'EU' })
  })
  it('a customer in another region reads as not found; the search hint names the region and nothing else', async () => {
    process.env.DATABASE_URL = url
    const { getParty, searchPartiesUncached: searchParties } = await import('@/features/customers/hub.server')
    const ana = { email: 'ana@example.com', displayName: 'Ana', role: 'requester' as const, regions: ['BR' as const], globalIdentity: false, moneyRegions: ['BR' as const] }
    expect(await getParty(ana, 'G-ORLA-EU')).toBeNull()
    const out = await searchParties(ana, 'customer', 'BR', 'DE123456789')
    expect(out).toEqual({ results: [], foreignRegion: 'EU' })
  })
  it('search finds by DUNS, city and ERP number inside the region', async () => {
    process.env.DATABASE_URL = url
    const { searchPartiesUncached: searchParties } = await import('@/features/customers/hub.server')
    const ana = { email: 'ana@example.com', displayName: 'Ana', role: 'requester' as const, regions: ['BR' as const], globalIdentity: false, moneyRegions: ['BR' as const] }
    expect((await searchParties(ana, 'customer', 'BR', '884983974')).results.map((r) => r.goldenId)).toEqual(['G-BR'])
    expect((await searchParties(ana, 'customer', 'BR', 'curitiba')).results.map((r) => r.goldenId)).toEqual(['G-BR-03'])
    expect((await searchParties(ana, 'customer', 'BR', '25043')).results.map((r) => r.goldenId)).toEqual(['G-BR-04'])
    expect((await searchParties(ana, 'supplier', 'BR', 'araguaia')).results.map((r) => r.goldenId)).toEqual(['S-BR-01'])
  })
  it('a global reviewer sees the record but not the money', async () => {
    process.env.DATABASE_URL = url
    const { getParty } = await import('@/features/customers/hub.server')
    const priya = { email: 'priya@example.com', displayName: 'Priya', role: 'reviewer' as const, regions: ['BR', 'EU', 'US', 'IN', 'CN'] as const, globalIdentity: true, moneyRegions: [] }
    const c = await getParty({ ...priya, regions: [...priya.regions] }, 'G-ORLA-EU')
    expect(c?.legalName).toBe('Orla Europa GmbH')
    expect(c?.money).toBe('not_entitled')
    expect(c?.addresses.map((a) => a.kind)).toEqual(['bill_to', 'ship_to'])
    // The same legal entity exists as a supplier: a different golden record, in the group, visible to a global role.
    expect(c?.group?.members.some((m) => m.goldenId === 'S-EU-ORLA' && m.domain === 'supplier')).toBe(true)
  })
})
