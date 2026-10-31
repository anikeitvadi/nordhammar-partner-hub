import { describe, expect, it } from 'vitest'
import { canonicalize, operationKey, parseOperationKey, payloadHash, transition, type Approval, type CanonicalPayload, type RequestState } from './index'

const payload: CanonicalPayload = {
  schemaVersion: 2, domain: 'customer', destination: { erp: 'MAPICS', region: 'BR' }, identity: { country: 'BR', scheme: 'CNPJ', canonical: '61000102000100' },
  identifiers: [{ scheme: 'IE', value: '123.456.789.012' }], duns: null, legalName: 'Foz Instrumentos', localName: null, typeCode: 'end_user', industry: 'Food processing', paymentTerms: null,
  addresses: [{ kind: 'bill_to', street: 'Rua Demo', number: '20', complement: null, district: 'Centro', city: 'Cidade Exemplo', regionCode: 'SP', postalCode: '01000-000', country: 'BR' }], contact: null,
  reason: { text: 'New quote', reference: 'Q-2291' },
}
const approval: Approval = { decisionId: 'd1', reviewerId: 'priya', reviewedAt: '2026-10-31T10:00:00Z', payloadHash: 'h' }

describe('canonical payload and hash', () => {
  it('formatting differences do not change the hash', async () => {
    const a = await payloadHash(payload)
    const b = await payloadHash({ ...payload, legalName: '  Foz Instrumentos ', identifiers: [{ scheme: 'IE', value: '123456789012' }], addresses: [{ ...payload.addresses[0], complement: '' }] })
    expect(a).toBe(b)
    expect(a).toHaveLength(64)
  })
  it('a changed amount-bearing field changes the hash', async () => {
    expect(await payloadHash(payload)).not.toBe(await payloadHash({ ...payload, legalName: 'Foz Instrumentos SA' }))
  })
  it('canonical form has a fixed key order', () => {
    expect(canonicalize(payload).startsWith('{"schemaVersion":2,"domain":"customer","destination":{"erp":"MAPICS","region":"BR"},"identity"')).toBe(true)
  })
  it('the same legal entity may be a customer and a supplier: the domain is part of the hash and the key', async () => {
    expect(await payloadHash(payload)).not.toBe(await payloadHash({ ...payload, domain: 'supplier' }))
    expect(operationKey('customer', 'R-1', 1)).not.toBe(operationKey('supplier', 'R-1', 1))
  })
  it('operation key binds the approved revision', () => {
    expect(operationKey('customer', 'R-1', 2)).toBe('intake:customer:R-1:revision:2')
    expect(parseOperationKey('intake:supplier:R-1:revision:2')).toEqual({ domain: 'supplier', requestId: 'R-1', revision: 2 })
    expect(parseOperationKey('intake:R-1:revision:2')).toBeNull()
    expect(parseOperationKey('other:R-1')).toBeNull()
  })
})

describe('transitions', () => {
  const draft: RequestState = { kind: 'draft', revision: 0 }
  it('the happy path', () => {
    let s: RequestState = draft
    for (const e of [
      { type: 'submit', submittedAt: 't' }, { type: 'open_review' }, { type: 'approve', approval }, { type: 'start_creating', operationKey: 'k' }, { type: 'created', erpNumber: '25099', createdAt: 't' }, { type: 'golden_loaded', goldenId: 'G-NEW' },
    ] as const) { const t = transition(s, e); if (!t.ok) throw new Error(t.reason); s = t.next }
    expect(s).toMatchObject({ kind: 'created', revision: 1, erpNumber: '25099', goldenId: 'G-NEW' })
  })
  it('a submitted request cannot be approved before it is opened, and a draft cannot be approved at all', () => {
    expect(transition({ kind: 'submitted', revision: 1, submittedAt: 't' }, { type: 'approve', approval }).ok).toBe(false)
    expect(transition(draft, { type: 'approve', approval }).ok).toBe(false)
  })
  it('send back returns to draft with the reason; resubmission increments the revision', () => {
    const t = transition({ kind: 'under_review', revision: 1, submittedAt: 't' }, { type: 'send_back', reason: 'need the bill-to' })
    expect(t).toMatchObject({ ok: true, next: { kind: 'draft', revision: 1, returnedReason: 'need the bill-to' } })
    const r = transition((t as { next: RequestState }).next, { type: 'submit', submittedAt: 't2' })
    expect(r).toMatchObject({ ok: true, next: { kind: 'submitted', revision: 2 } })
  })
  it('only a no-effect stop can return to draft; an unknown effect cannot', () => {
    const base = { kind: 'stopped' as const, revision: 1, approval, operationKey: 'k', category: 'transport' as const, reason: 'timeout' }
    expect(transition({ ...base, effect: 'unknown' }, { type: 'recover_to_draft' }).ok).toBe(false)
    expect(transition({ ...base, effect: 'no_effect' }, { type: 'recover_to_draft' }).ok).toBe(true)
  })
  it('created never loses its ERP number', () => {
    const created: RequestState = { kind: 'created', revision: 1, approval, operationKey: 'k', erpNumber: '25099', createdAt: 't', goldenId: null }
    expect(transition(created, { type: 'stop', category: 'business', effect: 'no_effect', reason: 'x' }).ok).toBe(false)
    expect(transition(created, { type: 'send_back', reason: 'x' }).ok).toBe(false)
  })
  it('an unknown-effect stop reconciles to created (the ERP had committed) or to no effect, never from a no-effect stop', () => {
    const unknown = { kind: 'stopped' as const, revision: 1, approval, operationKey: 'k', category: 'transport' as const, effect: 'unknown' as const, reason: 'timeout' }
    expect(transition(unknown, { type: 'reconciled_created', erpNumber: '26001', createdAt: 't' })).toMatchObject({ ok: true, next: { kind: 'created', erpNumber: '26001', operationKey: 'k' } })
    expect(transition(unknown, { type: 'reconciled_no_effect', reason: 'ledger has no row' })).toMatchObject({ ok: true, next: { kind: 'stopped', effect: 'no_effect' } })
    expect(transition({ ...unknown, effect: 'no_effect' }, { type: 'reconciled_created', erpNumber: '1', createdAt: 't' }).ok).toBe(false)
  })
})
