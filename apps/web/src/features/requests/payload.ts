import { missingFields, type Address, type CanonicalPayload, type Domain, type Region, type TaxId } from '@intake/contracts'

// Pure. Builds the canonical payload from the request form's fields. Every Server Action that accepts a form
// (submit, save draft, resubmit) goes through here, so the shape the reviewer approves is one function with tests.
// Nothing here trusts the form for region or identity: both arrive already verified by the caller.

// Which ERP a region's partners are born in. The table is the integration platform's; the hub keeps the same one so the
// command it sends says where it expects the partner to land, and the platform refuses a disagreement.
import { ERP_BY_REGION } from '@intake/contracts'
export { ERP_BY_REGION }

// Which secondary registrations each country asks for on the form. The primary tax ID is validated separately.
export const SECONDARY_IDS: Record<string, { scheme: string; label: string; required: boolean }[]> = {
  BR: [{ scheme: 'IE', label: 'Inscrição Estadual', required: false }],
  IN: [{ scheme: 'PAN', label: 'PAN', required: true }],
  US: [{ scheme: 'STATE_TAX_ID', label: 'State tax ID', required: false }],
  CN: [],
  EU: [{ scheme: 'COMPANY_NO', label: 'Company registration number', required: false }],
}

export const CUSTOMER_TYPES = [['oem', 'OEM'], ['distributor', 'Distributor'], ['end_user', 'End user'], ['contractor', 'Contractor']] as const
export const SUPPLIER_TYPES = [['raw_material', 'Raw material'], ['components', 'Components'], ['services', 'Services'], ['logistics', 'Logistics']] as const
export const INDUSTRIES = ['Food & beverage processing', 'Chemicals', 'Oil & gas', 'Marine equipment', 'HVAC & refrigeration', 'Power generation', 'Pulp & paper', 'Metals', 'Machinery', 'Engineering services', 'Industrial distribution', 'Biofuels', 'Steel', 'Castings & forgings', 'Fasteners', 'Sealing & gaskets', 'Logistics'] as const
export const PAYMENT_TERMS = ['N30', 'N45', 'N60', 'N90', 'prepaid'] as const

export type FormValues = Record<string, string>

export function formValues(formData: FormData): FormValues {
  const out: FormValues = {}
  for (const [k, v] of formData.entries()) if (typeof v === 'string') out[k] = v
  return out
}

const t = (v: string | undefined) => (v ?? '').trim()
const n = (v: string | undefined) => t(v) || null

export type PayloadProblem = { field: string; message: string }

// The form input each missing field belongs under, so the error shows where it is typed.
const FIELD_OF: Record<string, string> = { 'legal name': 'legalName', 'legal name in Chinese': 'localName', 'customer type': 'typeCode', 'supplier category': 'typeCode', 'bill-to street': 'main.street', 'remit-to street': 'main.street', 'bill-to city': 'main.city', 'remit-to city': 'main.city', UF: 'main.regionCode', state: 'main.regionCode', bairro: 'main.district', CEP: 'main.postalCode', ZIP: 'main.postalCode', PIN: 'main.postalCode', 'postal code': 'main.postalCode', reason: 'reasonText' }

// `complete: true` (the hub form) refuses a request with any field from missingFields absent. `complete: false` (a
// ticket raised in the service desk) builds what it can, and the clean check names the gaps as an exception, because
// finance has already approved it and the central team should see it rather than the desk getting an error.
// Fields with no reader (docs/FORM-FIELD-INVENTORY.md §2) are never taken from the form: DUNS, secondary IDs, industry,
// payment terms, ship-to and the PO reference are null or empty in every new payload. The shape stays version 2.
export function buildPayload(domain: Domain, region: Region, taxId: TaxId, f: FormValues, opts: { complete?: boolean } = {}): { ok: true; payload: CanonicalPayload } | { ok: false; problems: PayloadProblem[] } {
  const problems: PayloadProblem[] = []
  const email = t(f.contactEmail)
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) problems.push({ field: 'contactEmail', message: 'Contact email does not look like an email.' })
  const mainKind = domain === 'customer' ? 'bill_to' : 'remit_to'
  const payload: CanonicalPayload = {
    schemaVersion: 2,
    domain,
    destination: { erp: ERP_BY_REGION[region], region },
    identity: { country: taxId.country, scheme: taxId.scheme, canonical: taxId.canonical },
    identifiers: [],
    duns: null,
    legalName: t(f.legalName),
    localName: n(f.localName),
    typeCode: n(f.typeCode),
    industry: null,
    paymentTerms: null,
    addresses: [address(mainKind, 'main', f, region)],
    contact: t(f.contactName) || email ? { name: t(f.contactName), email } : null,
    reason: { text: t(f.reasonText), reference: null },
  }
  if (opts.complete !== false) for (const m of missingFields(payload)) problems.push({ field: FIELD_OF[m] ?? m, message: `${m.charAt(0).toUpperCase()}${m.slice(1)} is required.` })
  if (problems.length) return { ok: false, problems }
  return { ok: true, payload }
}

function address(kind: Address['kind'], prefix: string, f: FormValues, region: Region): Address {
  return {
    kind,
    street: t(f[`${prefix}.street`]),
    number: n(f[`${prefix}.number`]),
    complement: n(f[`${prefix}.complement`]),
    district: n(f[`${prefix}.district`]),
    city: t(f[`${prefix}.city`]),
    regionCode: n(f[`${prefix}.regionCode`])?.toUpperCase() ?? null,
    postalCode: n(f[`${prefix}.postalCode`]),
    country: t(f[`${prefix}.country`]) || t(f.country) || region,
  }
}

// The form fields a stored payload maps back to, for editing a draft or a sent-back request.
export function valuesFromPayload(p: CanonicalPayload): FormValues {
  const out: FormValues = { legalName: p.legalName, localName: p.localName ?? '', duns: p.duns ?? '', typeCode: p.typeCode ?? '', industry: p.industry ?? '', paymentTerms: p.paymentTerms ?? '', contactName: p.contact?.name ?? '', contactEmail: p.contact?.email ?? '', reasonText: p.reason.text, reasonReference: p.reason.reference ?? '', taxId: p.identity.canonical, country: p.identity.country }
  for (const i of p.identifiers) out[`id_${i.scheme}`] = i.value
  const mainKind = p.domain === 'customer' ? 'bill_to' : 'remit_to'
  const put = (prefix: string, a: Address | undefined) => { if (!a) return; out[`${prefix}.street`] = a.street; out[`${prefix}.number`] = a.number ?? ''; out[`${prefix}.complement`] = a.complement ?? ''; out[`${prefix}.district`] = a.district ?? ''; out[`${prefix}.city`] = a.city; out[`${prefix}.regionCode`] = a.regionCode ?? ''; out[`${prefix}.postalCode`] = a.postalCode ?? ''; out[`${prefix}.country`] = a.country }
  put('main', p.addresses.find((a) => a.kind === mainKind) ?? p.addresses[0])
  put('ship', p.addresses.find((a) => a.kind === 'ship_to'))
  return out
}

// The label for a type code, for badges and detail rows. Codes never show raw.
export function typeLabel(code: string | null | undefined): string | null {
  if (!code) return null
  const hit = [...CUSTOMER_TYPES, ...SUPPLIER_TYPES].find(([v]) => v === code)
  return hit ? hit[1] : code.replace(/_/g, ' ')
}
