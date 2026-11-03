import type { CanonicalPayload, Erp } from '@intake/contracts'

// The integration layer's job, and the reason three shapes exist: the hub sends one canonical payload, each ERP keeps
// partners its own way. Field lists and their reasons are in docs/STAGE-SET-CONTRACT.md §2. Pure.
export type Erp1Record = { CUST_NO?: string; VEND_NO?: string; NAME: string; TAX_NO: string; CTRY: string; STATE: string | null; CITY: string; DISTRICT: string | null; STREET: string; POSTAL: string | null; ACCT_GROUP: string | null; CREATED_ON: string }
export type Erp2Record = { partnerId: string; kind: 'customer' | 'vendor'; legalName: string; vat: string; address: { street: string; houseNumber: string | null; postalCode: string | null; city: string; country: string }; category: string | null; createdAt: string }
export type Erp3Record = { code: string; nameLocal: string | null; nameLatin: string; uscc: string; city: string; street: string; type: string | null; createdAt: string }
export type NativeRecord = Erp1Record | Erp2Record | Erp3Record

export function toNative(erp: Erp, p: CanonicalPayload, number: string, at: string): NativeRecord {
  const main = p.addresses.find((a) => a.kind === (p.domain === 'customer' ? 'bill_to' : 'remit_to')) ?? p.addresses[0]
  const street = [main.street, main.number].filter(Boolean).join(' ')
  switch (erp) {
    case 'ERP-1': return {
      ...(p.domain === 'customer' ? { CUST_NO: number } : { VEND_NO: number }),
      // ERP-1 stores names in capitals, 40 characters at most.
      NAME: p.legalName.toUpperCase().slice(0, 40),
      TAX_NO: p.identity.canonical.replace(/[^0-9A-Z]/gi, ''),
      // An invoice in Brazil, the US or India needs the postal code and (in Brazil) the bairro, so ERP-1 keeps both; the
      // complement (sala, suite) rides on the street line, as the ERP prints it (docs/FORM-FIELD-INVENTORY.md, finding 4).
      CTRY: p.identity.country, STATE: main.regionCode, CITY: main.city.toUpperCase(), DISTRICT: main.district?.toUpperCase() ?? null,
      STREET: [street, main.complement].filter(Boolean).join(', ').toUpperCase(), POSTAL: main.postalCode?.replace(/[^0-9A-Z]/gi, '') ?? null,
      ACCT_GROUP: p.typeCode, CREATED_ON: at.slice(0, 10),
    }
    case 'ERP-2': return {
      partnerId: number, kind: p.domain === 'customer' ? 'customer' : 'vendor', legalName: p.legalName,
      // The canonical EU tax ID already carries the country prefix (DE512345671); ERP-2 keeps it that way.
      vat: p.identity.canonical,
      address: { street: main.street, houseNumber: main.number, postalCode: main.postalCode, city: main.city, country: main.country },
      category: p.typeCode, createdAt: at,
    }
    case 'ERP-3': return { code: number, nameLocal: p.localName, nameLatin: p.legalName, uscc: p.identity.canonical, city: main.city, street, type: p.typeCode, createdAt: at }
  }
}
