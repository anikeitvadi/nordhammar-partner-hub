import { describe, expect, it } from 'vitest'
import { buildPayload, valuesFromPayload } from './payload'

const tax = { country: 'BR', scheme: 'CNPJ', canonical: '61000102000100', companyKey: '61000102' }
const base = { legalName: 'Foz Instrumentos', 'main.street': 'Rua Demo', 'main.number': '20', 'main.district': 'Centro', 'main.city': 'Cidade Exemplo', 'main.regionCode': 'sp', 'main.postalCode': '01000-000', reasonText: 'New quote', reasonReference: 'Q-2291', id_IE: '110.042.490.114', duns: '884-983-974', typeCode: 'end_user', industry: 'Chemicals', contactName: 'Ana', contactEmail: 'ana@example.com' }

describe('request payload from the form', () => {
  it('builds a customer payload with the bill-to, the secondary registration and the reason', () => {
    const r = buildPayload('customer', 'BR', tax, base)
    if (!r.ok) throw new Error(JSON.stringify(r.problems))
    expect(r.payload).toMatchObject({ schemaVersion: 2, domain: 'customer', destination: { erp: 'MAPICS', region: 'BR' }, duns: '884983974', identifiers: [{ scheme: 'IE', value: '110.042.490.114' }], reason: { text: 'New quote', reference: 'Q-2291' } })
    expect(r.payload.addresses).toEqual([{ kind: 'bill_to', street: 'Rua Demo', number: '20', complement: null, district: 'Centro', city: 'Cidade Exemplo', regionCode: 'SP', postalCode: '01000-000', country: 'BR' }])
  })
  it('a supplier gets a remit-to, and an optional ship-to rides along for a customer', () => {
    const s = buildPayload('supplier', 'BR', tax, base)
    expect(s.ok && s.payload.addresses[0].kind).toBe('remit_to')
    const c = buildPayload('customer', 'BR', tax, { ...base, 'ship.street': 'Rodovia Demo', 'ship.city': 'Joinville' })
    expect(c.ok && c.payload.addresses.map((a) => a.kind)).toEqual(['bill_to', 'ship_to'])
  })
  it('names every missing field instead of the first one', () => {
    const r = buildPayload('customer', 'BR', tax, { legalName: '', 'main.street': '', 'main.city': '', reasonText: '', duns: '12' })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.problems.map((p) => p.field).sort()).toEqual(['duns', 'legalName', 'main.city', 'main.district', 'main.regionCode', 'main.street', 'reasonText'])
  })
  it('India requires the PAN; China requires the local name', () => {
    const inTax = { country: 'IN', scheme: 'GSTIN', canonical: '27AABCV1234F1ZO', companyKey: 'AABCV1234F' }
    const r = buildPayload('customer', 'IN', inTax, { ...base, 'main.regionCode': 'MH', 'main.district': '' })
    expect(!r.ok && r.problems.some((p) => p.field === 'id_PAN')).toBe(true)
    const cn = buildPayload('customer', 'CN', { country: 'CN', scheme: 'USCC', canonical: '91440300MA5DC1234X' }, { ...base, 'main.regionCode': '', 'main.district': '' })
    expect(!cn.ok && cn.problems.some((p) => p.field === 'localName')).toBe(true)
  })
  it('a stored payload maps back to the same form values', () => {
    const r = buildPayload('customer', 'BR', tax, base)
    if (!r.ok) throw new Error('build failed')
    const v = valuesFromPayload(r.payload)
    const again = buildPayload('customer', 'BR', tax, v)
    expect(again.ok && again.payload).toEqual(r.payload)
  })
})
