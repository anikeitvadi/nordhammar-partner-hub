import { describe, expect, it } from 'vitest'
import { cleanCheck, missingFields, signDeskWebhook, transition, verifyDeskWebhook, DeskWebhookSchema, ERP_BY_REGION, type CanonicalPayload, type CleanFacts, type RequestState } from './index'

const clean: CleanFacts = { taxValid: true, exactMatches: [], openRequestsSameTax: [], relatedMatches: [], nameMatches: [], aiReading: null, dupChoice: 'new', missingFields: [], autoApproveOn: true }

describe('the finance path through the state machine', () => {
  const draft: RequestState = { kind: 'draft', revision: 0 }
  it('submit goes to finance, a ticket is attached, finance approval starts the checks', () => {
    const a = transition(draft, { type: 'submit_to_finance', submittedAt: 't' })
    expect(a).toMatchObject({ ok: true, next: { kind: 'awaiting_finance', revision: 1, ticketId: null } })
    const b = transition((a as { next: RequestState }).next, { type: 'ticket_opened', ticketId: 'SD-10421' })
    const c = transition((b as { next: RequestState }).next, { type: 'finance_approved', by: 'Marta Finance' })
    expect(c).toMatchObject({ ok: true, next: { kind: 'checking', ticketId: 'SD-10421', financeBy: 'Marta Finance' } })
  })
  it('clean checks approve; failed checks make an exception the central team can approve, send back or decline', () => {
    const checking: RequestState = { kind: 'checking', revision: 1, submittedAt: 't', ticketId: 'SD-1', financeBy: 'x' }
    const approval = { decisionId: 'D', reviewerId: 'auto:checks', reviewedAt: 't', payloadHash: 'h', checks: ['tax ID valid'] }
    expect(transition(checking, { type: 'checks_clean', approval })).toMatchObject({ ok: true, next: { kind: 'approved', approval: { reviewerId: 'auto:checks' } } })
    const ex = transition(checking, { type: 'checks_exception', reasons: ['r'] })
    expect(ex).toMatchObject({ ok: true, next: { kind: 'exception', reasons: ['r'] } })
    const e = (ex as { next: RequestState }).next
    expect(transition(e, { type: 'approve', approval: { ...approval, reviewerId: 'priya@x' } }).ok).toBe(true)
    expect(transition(e, { type: 'send_back', reason: 'fix' })).toMatchObject({ ok: true, next: { kind: 'draft' } })
    expect(transition(e, { type: 'decline', decisionId: 'D2', reason: 'no' })).toMatchObject({ ok: true, next: { kind: 'declined', by: 'central' } })
  })
  it('finance rejection declines with finance named; nothing skips finance', () => {
    const waiting: RequestState = { kind: 'awaiting_finance', revision: 1, submittedAt: 't', ticketId: 'SD-1' }
    expect(transition(waiting, { type: 'finance_rejected', by: 'Marta', decisionId: 'F1', reason: 'credit' })).toMatchObject({ ok: true, next: { kind: 'declined', by: 'finance', reason: 'credit' } })
    expect(transition(waiting, { type: 'checks_clean', approval: { decisionId: 'D', reviewerId: 'auto:checks', reviewedAt: 't', payloadHash: 'h' } }).ok).toBe(false)
    expect(transition(waiting, { type: 'approve', approval: { decisionId: 'D', reviewerId: 'p', reviewedAt: 't', payloadHash: 'h' } }).ok).toBe(false)
  })
})

describe('what clean means', () => {
  it('every check holding is clean, and lists what passed', () => {
    expect(cleanCheck(clean)).toEqual({ clean: true, passed: ['tax ID valid', 'no record or open request with this tax ID', 'no other establishment of the same company', 'no name match on a record without a tax ID', 'no override by the requester', 'every field the ERP needs'] })
  })
  const cases: [string, Partial<CleanFacts>, RegExp][] = [
    ['invalid tax ID', { taxValid: false }, /check digits/],
    ['exact match anywhere', { exactMatches: [{ goldenId: 'G-EU-05', legalName: 'Aurora Nordic AB', region: 'EU' }] }, /possible duplicate: Aurora Nordic AB \(EU\)/],
    ['another open request', { openRequestsSameTax: ['R-2'] }, /another open request/],
    ['same company key', { relatedMatches: [{ goldenId: 'G-BR-09', legalName: 'Aurora Industrial Filial Sul', region: 'BR' }] }, /same company as/],
    ['name match, even when the model says different', { nameMatches: [{ goldenId: 'G-LEGACY', legalName: 'Vela Processos' }], aiReading: 'different' }, /name match with Vela Processos.*"different"/],
    ['requester override, group', { dupChoice: 'new_in_group' }, /new company in this group/],
    ['requester override, not related', { dupChoice: 'not_related' }, /not related/],
    ['missing fields', { missingFields: ['bill-to address'] }, /missing: bill-to address/],
    ['kill switch off', { autoApproveOn: false }, /switched off/],
  ]
  for (const [name, f, re] of cases) it(`${name} is an exception with its reason`, () => {
    const r = cleanCheck({ ...clean, ...f })
    expect(r.clean).toBe(false)
    expect(r.clean ? '' : r.reasons.join(' | ')).toMatch(re)
  })
})

describe('the signed webhook', () => {
  const body = JSON.stringify({ hello: 'finance' })
  const now = 1_800_000_000
  it('accepts its own signature inside the window', async () => {
    const sig = await signDeskWebhook('s3cret', String(now), body)
    expect(await verifyDeskWebhook('s3cret', String(now), sig, body, now + 10)).toEqual({ ok: true })
  })
  it('refuses a wrong secret, a changed body, a stale or future timestamp, and no secret at all', async () => {
    const sig = await signDeskWebhook('s3cret', String(now), body)
    expect((await verifyDeskWebhook('other', String(now), sig, body, now)).ok).toBe(false)
    expect((await verifyDeskWebhook('s3cret', String(now), sig, body.replace('finance', 'fin4nce'), now)).ok).toBe(false)
    expect(await verifyDeskWebhook('s3cret', String(now), sig, body, now + 361)).toEqual({ ok: false, reason: 'timestamp outside the window' })
    expect(await verifyDeskWebhook('s3cret', String(now), sig, body, now - 361)).toEqual({ ok: false, reason: 'timestamp outside the window' })
    expect(await verifyDeskWebhook(undefined, String(now), sig, body, now)).toEqual({ ok: false, reason: 'webhook secret not configured' })
  })
  it('a rejection without a reason is not a valid event', () => {
    const e = { type: 'ticket.finance_rejected', occurredAt: 't', ticket: { id: 'SD-10421', hubRequestId: 'R-1', requesterEmail: 'a@x', region: 'BR', domain: 'customer', partner: null }, decision: { by: 'Marta', reason: null } }
    expect(DeskWebhookSchema.safeParse(e).success).toBe(false)
    expect(DeskWebhookSchema.safeParse({ ...e, decision: { by: 'Marta', reason: 'credit check failed' } }).success).toBe(true)
  })
})

describe('what a request must carry before an ERP may create it', () => {
  const p = (region: 'BR' | 'US' | 'IN' | 'EU' | 'CN', over: Partial<CanonicalPayload> = {}, addr: Partial<CanonicalPayload['addresses'][number]> = {}): CanonicalPayload => ({
    schemaVersion: 2, domain: 'customer', destination: { erp: ERP_BY_REGION[region], region }, identity: { country: region === 'EU' ? 'DE' : region, scheme: 'X', canonical: '1' }, identifiers: [], duns: null,
    legalName: 'Acme', localName: region === 'CN' ? '阿克米' : null, typeCode: 'oem', industry: null, paymentTerms: null,
    addresses: [{ kind: 'bill_to', street: 'Rua A', number: '1', complement: null, district: 'Centro', city: 'Curitiba', regionCode: 'PR', postalCode: '80020-310', country: 'BR', ...addr }],
    contact: null, reason: { text: 'why', reference: null }, ...over,
  })
  it('a complete request in each region has nothing missing', () => {
    for (const r of ['BR', 'US', 'IN', 'EU', 'CN'] as const) expect(missingFields(p(r))).toEqual([])
  })
  it('names each gap the way the form labels it', () => {
    expect(missingFields(p('BR', { typeCode: null }, { postalCode: null, district: null }))).toEqual(['customer type', 'bairro', 'CEP'])
    expect(missingFields(p('US', {}, { postalCode: '', regionCode: null }))).toEqual(['state', 'ZIP'])
    expect(missingFields(p('EU', {}, { postalCode: null }))).toEqual(['postal code'])
    expect(missingFields(p('CN', { localName: null }, { postalCode: null, regionCode: null }))).toEqual(['legal name in Chinese'])
  })
  it('a supplier is filed under a category, at its remit-to address', () => {
    expect(missingFields(p('BR', { domain: 'supplier', typeCode: null, addresses: [{ kind: 'remit_to', street: '', number: null, complement: null, district: 'X', city: 'Y', regionCode: 'SP', postalCode: '1', country: 'BR' }] }))).toEqual(['supplier category', 'remit-to street'])
  })
})
