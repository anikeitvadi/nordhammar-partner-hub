import { describe, expect, it } from 'vitest'
import { cnpjChecksum, normalizeTaxId, relation } from './normalize'

describe('N1 to N3: normalisation and format', () => {
  it('BR formatted CNPJ normalises to the fixture full ID with the 8-digit root', () => {
    const r = normalizeTaxId('BR', '61.000.101/0001-57')
    expect(r).toEqual({ ok: true, taxId: { country: 'BR', scheme: 'CNPJ', canonical: '61000101000157', companyKey: '61000101' } })
  })
  it('BR branch shares the root but not the canonical', () => {
    const a = normalizeTaxId('BR', '61000101000157'); const b = normalizeTaxId('BR', '61000101000238')
    expect(a.ok && b.ok && relation(a.taxId, b.taxId)).toBe('related')
  })
  it('E08: a CNPJ with a wrong check digit is rejected before any lookup', () => {
    expect(normalizeTaxId('BR', '61000103000147')).toEqual({ ok: false, reason: 'invalid_checksum' })
    expect(cnpjChecksum('61000103000146')).toBe(true)
  })
  it('BR blank and US letters reject', () => {
    expect(normalizeTaxId('BR', '   ')).toEqual({ ok: false, reason: 'missing' })
    expect(normalizeTaxId('US', '61-ABC1101')).toEqual({ ok: false, reason: 'invalid_format' })
  })
  it('US EIN strips the dash', () => {
    expect(normalizeTaxId('US', '61-0001101')).toMatchObject({ ok: true, taxId: { canonical: '610001101', companyKey: '610001101' } })
  })
  it('EU VAT drops a matching country prefix and keeps the country in the canonical', () => {
    expect(normalizeTaxId('DE', ' de 123456789 ')).toMatchObject({ ok: true, taxId: { canonical: 'DE123456789' } })
    expect(normalizeTaxId('FR', 'fr ab 123456789')).toMatchObject({ ok: true, taxId: { canonical: 'FRAB123456789' } })
  })
  it('IN GSTIN: same PAN in a new state is related, not exact', () => {
    const a = normalizeTaxId('IN', '29AABCV1234F1ZK'); const b = normalizeTaxId('IN', '27AABCV1234F1ZO')
    expect(a).toMatchObject({ ok: true, taxId: { companyKey: 'AABCV1234F' } })
    expect(a.ok && b.ok && relation(a.taxId, b.taxId)).toBe('related')
  })
  it('CN USCC uppercase passes unchanged', () => {
    expect(normalizeTaxId('CN', '91110108MA01ABCD12')).toMatchObject({ ok: true, taxId: { canonical: '91110108MA01ABCD12' } })
  })
  it('different jurisdictions never relate, even with equal digits', () => {
    const a = normalizeTaxId('BR', '61000101000157'); const b = { country: 'PT', scheme: 'VAT', canonical: '61000101000157', companyKey: '61000101000157' }
    expect(a.ok && relation(a.taxId, b)).toBe('none')
  })
})
