import { describe, expect, it } from 'vitest'
import type { CanonicalPayload } from '@intake/contracts'
import { toNative } from './mapping'

const base = (over: Partial<CanonicalPayload>): CanonicalPayload => ({
  schemaVersion: 2, domain: 'customer', destination: { erp: 'ERP-1', region: 'BR' }, identity: { country: 'BR', scheme: 'CNPJ', canonical: '62110970000105' },
  identifiers: [], duns: null, legalName: 'Fundição Sorocaba Ltda', localName: null, typeCode: 'oem', industry: null, paymentTerms: null,
  addresses: [{ kind: 'bill_to', street: 'Rua Aparecida', number: '640', complement: null, district: 'Centro', city: 'Sorocaba', regionCode: 'SP', postalCode: null, country: 'BR' }],
  contact: null, reason: { text: 'r', reference: null }, ...over,
})
const at = '2026-11-03T01:00:00.000Z'

describe('one payload, three native shapes', () => {
  it('ERP-1: capitals, cut to 40, digits-only tax number, customer number field', () => {
    const r = toNative('ERP-1', base({ legalName: 'Fundição Sorocaba Indústria e Comércio de Peças Ltda' }), '110201', at)
    expect(r).toMatchObject({ CUST_NO: '110201', NAME: 'FUNDIÇÃO SOROCABA INDÚSTRIA E COMÉRCIO D', TAX_NO: '62110970000105', STATE: 'SP', CITY: 'SOROCABA', CREATED_ON: '2026-11-03' })
    expect((r as { NAME: string }).NAME.length).toBe(40)
  })
  it('ERP-1: keeps the postal code and the bairro; the complement rides on the street line', () => {
    const p = base({ addresses: [{ kind: 'bill_to', street: 'Rua Aparecida', number: '640', complement: 'sala 3', district: 'Centro', city: 'Sorocaba', regionCode: 'SP', postalCode: '18095-000', country: 'BR' }] })
    expect(toNative('ERP-1', p, '110201', at)).toMatchObject({ STREET: 'RUA APARECIDA 640, SALA 3', DISTRICT: 'CENTRO', POSTAL: '18095000' })
  })
  it('ERP-1: a supplier gets a vendor number field instead', () => {
    expect(toNative('ERP-1', base({ domain: 'supplier' }), '150201', at)).toMatchObject({ VEND_NO: '150201' })
  })
  it('ERP-2: case and accents kept, VAT keeps its prefix, nested address, vendor kind', () => {
    const p = base({ domain: 'supplier', destination: { erp: 'ERP-2', region: 'EU' }, identity: { country: 'FR', scheme: 'VAT', canonical: 'FR53823456785' }, legalName: 'Atlantique Inox SAS',
      addresses: [{ kind: 'remit_to', street: 'Quai de la Fosse', number: '42', complement: null, district: null, city: 'Nantes', regionCode: null, postalCode: '44000', country: 'FR' }] })
    expect(toNative('ERP-2', p, '250201', at)).toEqual({ partnerId: '250201', kind: 'vendor', legalName: 'Atlantique Inox SAS', vat: 'FR53823456785', address: { street: 'Quai de la Fosse', houseNumber: '42', postalCode: '44000', city: 'Nantes', country: 'FR' }, category: 'oem', createdAt: at })
  })
  it('ERP-3: both names and the unified code', () => {
    const p = base({ destination: { erp: 'ERP-3', region: 'CN' }, identity: { country: 'CN', scheme: 'USCC', canonical: '91320594MA1PQ4R72K' }, legalName: 'Suzhou Hengtai Valve Co., Ltd.', localName: '苏州恒泰阀门有限公司',
      addresses: [{ kind: 'bill_to', street: 'Xinghu Street', number: '218', complement: null, district: null, city: 'Suzhou', regionCode: null, postalCode: '215123', country: 'CN' }] })
    expect(toNative('ERP-3', p, '310201', at)).toEqual({ code: '310201', nameLocal: '苏州恒泰阀门有限公司', nameLatin: 'Suzhou Hengtai Valve Co., Ltd.', uscc: '91320594MA1PQ4R72K', city: 'Suzhou', street: 'Xinghu Street 218', type: 'oem', createdAt: at })
  })
})
