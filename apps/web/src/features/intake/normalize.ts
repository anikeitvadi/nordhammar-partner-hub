import type { TaxId } from '@intake/contracts'

// Pure. The deterministic half of duplicate prevention. If the same input must always give the same answer, it lives here, not in a model.
// N1: strip punctuation and spaces, uppercase, drop a leading country prefix that matches the country.
// N2: company-level key per jurisdiction (CNPJ root = first 8 digits; PAN = characters 3 to 12 of a GSTIN; EU VAT and US/CN = full).
// N3: format check per country. Invalid → typed rejection, never an empty key that could match nothing or everything.

export type NormalizeResult = { ok: true; taxId: TaxId } | { ok: false; reason: 'missing' | 'invalid_format' | 'invalid_checksum' | 'unsupported_country' }

const SCHEME: Record<string, string> = { BR: 'CNPJ', IN: 'GSTIN', US: 'EIN', CN: 'USCC', DE: 'VAT', FR: 'VAT', NL: 'VAT', SE: 'VAT', IT: 'VAT', ES: 'VAT', NO: 'VAT', PT: 'VAT', AT: 'VAT', BE: 'VAT', DK: 'VAT', FI: 'VAT', PL: 'VAT', IE: 'VAT' }

export function normalizeTaxId(country: string, raw: string): NormalizeResult {
  const c = country.trim().toUpperCase()
  const scheme = SCHEME[c]
  if (!scheme) return { ok: false, reason: 'unsupported_country' }
  let v = (raw ?? '').toUpperCase().replace(/[^0-9A-Z]/g, '')
  if (!v) return { ok: false, reason: 'missing' }
  if (scheme === 'VAT' && v.startsWith(c)) v = v.slice(2)

  switch (scheme) {
    case 'CNPJ': {
      if (!/^\d{14}$/.test(v)) return { ok: false, reason: 'invalid_format' }
      if (!cnpjChecksum(v)) return { ok: false, reason: 'invalid_checksum' }
      return { ok: true, taxId: { country: c, scheme, canonical: v, companyKey: v.slice(0, 8) } }
    }
    case 'GSTIN': {
      if (!/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(v)) return { ok: false, reason: 'invalid_format' }
      return { ok: true, taxId: { country: c, scheme, canonical: v, companyKey: v.slice(2, 12) } }
    }
    case 'EIN': {
      if (!/^\d{9}$/.test(v)) return { ok: false, reason: 'invalid_format' }
      return { ok: true, taxId: { country: c, scheme, canonical: v, companyKey: v } }
    }
    case 'USCC': {
      if (!/^[0-9A-HJ-NP-RT-UW-Y]{18}$/.test(v)) return { ok: false, reason: 'invalid_format' }
      return { ok: true, taxId: { country: c, scheme, canonical: v, companyKey: v } }
    }
    case 'VAT': {
      // Syntax only, per country pattern where we know it; this is not a registry check.
      const patterns: Record<string, RegExp> = { DE: /^\d{9}$/, FR: /^[0-9A-Z]{2}\d{9}$/, NL: /^\d{9}B\d{2}$/, SE: /^\d{12}$/, IT: /^\d{11}$/, ES: /^[0-9A-Z]\d{7}[0-9A-Z]$/, NO: /^\d{9}(MVA)?$/, PT: /^\d{9}$/ }
      const pat = patterns[c] ?? /^[0-9A-Z]{8,12}$/
      if (!pat.test(v)) return { ok: false, reason: 'invalid_format' }
      const canonical = `${c}${v}`
      return { ok: true, taxId: { country: c, scheme, canonical, companyKey: canonical } }
    }
    default:
      return { ok: false, reason: 'unsupported_country' }
  }
}

// Standard CNPJ check digits (mod 11 over weights 5..2,9..2 then 6..2,9..2).
export function cnpjChecksum(digits: string): boolean {
  const d = digits.split('').map(Number)
  const calc = (len: number) => {
    const weights = len === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    const sum = weights.reduce((acc, w, i) => acc + d[i] * w, 0)
    const r = sum % 11
    return r < 2 ? 0 : 11 - r
  }
  return calc(12) === d[12] && calc(13) === d[13]
}

// Company-level relation between two normalised IDs of the same jurisdiction. Deterministic; this is what the hub's
// M1 rule does. "related" means same company key, different establishment (a Brazilian branch, an Indian state registration).
export function relation(a: TaxId, b: TaxId): 'exact' | 'related' | 'none' {
  if (a.country !== b.country) return 'none'
  if (a.canonical === b.canonical) return 'exact'
  if (a.companyKey && b.companyKey && a.companyKey === b.companyKey) return 'related'
  return 'none'
}
