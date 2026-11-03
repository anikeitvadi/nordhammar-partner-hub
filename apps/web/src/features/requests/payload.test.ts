import { describe, expect, it } from 'vitest'
import { buildPayload, valuesFromPayload } from './payload'

const tax = { country: 'BR', scheme: 'CNPJ', canonical: '61000102000100', companyKey: '61000102' }
// The old form's extra fields are still sent here on purpose: none of them may reach the payload (docs/FORM-FIELD-INVENTORY.md).
const base = { legalName: 'Foz Instrumentos', 'main.street': 'Rua Demo', 'main.number': '20', 'main.complement': 'sala 3', 'main.district': 'Centro', 'main.city': 'Cidade Exemplo', 'main.regionCode': 'sp', 'main.postalCode': '01000-000', reasonText: 'New quote', reasonReference: 'Q-2291', id_IE: '110.042.490.114', duns: '884-983-974', typeCode: 'end_user', industry: 'Chemicals', paymentTerms: 'N30', contactName: 'Ana', contactEmail: 'ana@example.com', 'ship.street': 'Rodovia Demo', 'ship.city': 'Joinville' }

describe('request payload from the form', () => {
  it('builds a customer payload from the fields someone reads, and only those', () => {
    const r = buildPayload('customer', 'BR', tax, base)
    if (!r.ok) throw new Error(JSON.stringify(r.problems))
    expect(r.payload).toMatchObject({ schemaVersion: 2, domain: 'customer', destination: { erp: 'ERP-1', region: 'BR' }, typeCode: 'end_user', contact: { name: 'Ana', email: 'ana@example.com' }, reason: { text: 'New quote', reference: null } })
    expect({ duns: r.payload.duns, identifiers: r.payload.identifiers, industry: r.payload.industry, paymentTerms: r.payload.paymentTerms }).toEqual({ duns: null, identifiers: [], industry: null, paymentTerms: null })
    expect(r.payload.addresses).toEqual([{ kind: 'bill_to', street: 'Rua Demo', number: '20', complement: 'sala 3', district: 'Centro', city: 'Cidade Exemplo', regionCode: 'SP', postalCode: '01000-000', country: 'BR' }])
  })
  it('a supplier gets a remit-to; no ship-to is ever added', () => {
    const s = buildPayload('supplier', 'BR', tax, base)
    expect(s.ok && s.payload.addresses.map((a) => a.kind)).toEqual(['remit_to'])
  })
  it('names every missing field, under the input it is typed in', () => {
    const r = buildPayload('customer', 'BR', tax, { legalName: '', 'main.street': '', 'main.city': '', reasonText: '' })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.problems.map((p) => p.field).sort()).toEqual(['legalName', 'main.city', 'main.district', 'main.postalCode', 'main.regionCode', 'main.street', 'reasonText', 'typeCode'])
  })
  it('India no longer asks for the PAN; China still requires the local name', () => {
    const inTax = { country: 'IN', scheme: 'GSTIN', canonical: '27AABCV1234F1ZO', companyKey: 'AABCV1234F' }
    expect(buildPayload('customer', 'IN', inTax, { ...base, 'main.regionCode': 'MH', 'main.district': '' }).ok).toBe(true)
    const cn = buildPayload('customer', 'CN', { country: 'CN', scheme: 'USCC', canonical: '91440300MA5DC1234X' }, { ...base, 'main.regionCode': '', 'main.district': '' })
    expect(!cn.ok && cn.problems.some((p) => p.field === 'localName')).toBe(true)
  })
  it('a ticket raised in the desk is built with its gaps, for the clean check to name', () => {
    const r = buildPayload('customer', 'BR', tax, { ...base, 'main.postalCode': '', typeCode: '' }, { complete: false })
    expect(r.ok && [r.payload.typeCode, r.payload.addresses[0].postalCode]).toEqual([null, null])
  })
  it('a stored payload maps back to the same form values', () => {
    const r = buildPayload('customer', 'BR', tax, base)
    if (!r.ok) throw new Error('build failed')
    const again = buildPayload('customer', 'BR', tax, valuesFromPayload(r.payload))
    expect(again.ok && again.payload).toEqual(r.payload)
  })
})
