// Runs only with TEST_DATABASE_URL pointing at a database with both schemas applied and the seed loaded.
// These assert the policies that matter against real SQL: the reservation blocks a parallel request, the first
// decision wins, and a requester cannot read another region's request.
import { describe, expect, it } from 'vitest'

const url = process.env.TEST_DATABASE_URL
const ana = { email: 'ana.requester@example.com', displayName: 'Ana', role: 'requester' as const, regions: ['BR' as const], globalIdentity: false, moneyRegions: ['BR' as const] }
const jonas = { email: 'jonas.requester@example.com', displayName: 'Jonas', role: 'requester' as const, regions: ['EU' as const], globalIdentity: false, moneyRegions: ['EU' as const] }
const priya = { email: 'priya.reviewer@example.com', displayName: 'Priya', role: 'reviewer' as const, regions: ['BR', 'EU', 'US', 'IN', 'CN'] as ('BR' | 'EU' | 'US' | 'IN' | 'CN')[], globalIdentity: true, moneyRegions: [] as ('BR' | 'EU' | 'US' | 'IN' | 'CN')[] }
const payload = (tax: string, name: string) => ({ schemaVersion: 2 as const, domain: 'customer' as const, destination: { erp: 'ERP-1' as const, region: 'BR' as const }, identity: { country: 'BR', scheme: 'CNPJ', canonical: tax }, identifiers: [], duns: null, legalName: name, localName: null, typeCode: null, industry: null, paymentTerms: null, addresses: [{ kind: 'bill_to' as const, street: 'Rua Demo', number: '1', complement: null, district: 'Centro', city: 'Cidade Exemplo', regionCode: 'SP', postalCode: null, country: 'BR' }], contact: null, reason: { text: 'integration', reference: null } })

describe.skipIf(!url)('request path against a real database', () => {
  it('a second open request for the same tax ID is refused by the reservation', async () => {
    process.env.DATABASE_URL = url
    const { submitRequest, ConflictError } = await import('@/features/requests/store.server')
    const tax = `6100019900${String(Date.now()).slice(-4)}` // unique per run; checksum is not validated at this layer
    await submitRequest(ana, { domain: 'customer', region: 'BR', payload: payload(tax, 'Integration One'), dupChoice: 'new', dupReason: null, linkedGoldenId: null })
    await expect(submitRequest(ana, { domain: 'customer', region: 'BR', payload: payload(tax, 'Integration Two'), dupChoice: 'new', dupReason: null, linkedGoldenId: null })).rejects.toBeInstanceOf(ConflictError)
    // The same legal entity as a supplier is a different identity: allowed.
    await expect(submitRequest(ana, { domain: 'supplier', region: 'BR', payload: { ...payload(tax, 'Integration Supplier'), domain: 'supplier', addresses: [{ ...payload(tax, 'x').addresses[0], kind: 'remit_to' }] }, dupChoice: 'new', dupReason: null, linkedGoldenId: null })).resolves.toMatchObject({ requestId: expect.any(String) })
  })
  it('the first decision wins and a requester in another region cannot read the request', async () => {
    process.env.DATABASE_URL = url
    const { submitRequest, getRequest } = await import('@/features/requests/store.server')
    const { decide, openReview } = await import('@/features/reviews/decide.server')
    const tax = `6100019800${String(Date.now()).slice(-4)}`
    const { requestId } = await submitRequest(ana, { domain: 'customer', region: 'BR', payload: payload(tax, 'Integration Decide'), dupChoice: 'new', dupReason: null, linkedGoldenId: null })
    expect(await getRequest(jonas, requestId)).toBeNull()
    const r = await getRequest(priya, requestId); if (!r) throw new Error('reviewer cannot see request')
    await openReview(priya, requestId, r.revision)
    const first = await decide(priya, { requestId, revision: r.revision, payloadHash: r.payloadHash, decision: 'decline', reason: 'integration test' })
    const second = await decide(priya, { requestId, revision: r.revision, payloadHash: r.payloadHash, decision: 'approve' })
    expect(first.ok).toBe(true)
    expect(second).toMatchObject({ ok: false })
  })
})
