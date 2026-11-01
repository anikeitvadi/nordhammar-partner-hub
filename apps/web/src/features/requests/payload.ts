import type { Address, CanonicalPayload, Domain, Region, TaxId } from '@intake/contracts'

// Pure. Builds the canonical payload from the request form's fields. Every Server Action that accepts a form
// (submit, save draft, resubmit) goes through here, so the shape the reviewer approves is one function with tests.
// Nothing here trusts the form for region or identity: both arrive already verified by the caller.

export const ERP_BY_REGION: Record<Region, 'ERP-1' | 'ERP-2'> = { BR: 'ERP-1', US: 'ERP-1', IN: 'ERP-1', CN: 'ERP-1', EU: 'ERP-2' }

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

export function buildPayload(domain: Domain, region: Region, taxId: TaxId, f: FormValues): { ok: true; payload: CanonicalPayload } | { ok: false; problems: PayloadProblem[] } {
  const problems: PayloadProblem[] = []
  const legalName = t(f.legalName)
  if (!legalName) problems.push({ field: 'legalName', message: 'Legal name is required.' })
  if (region === 'CN' && !t(f.localName)) problems.push({ field: 'localName', message: 'The legal name in Chinese is required for China.' })
  const mainKind = domain === 'customer' ? 'bill_to' : 'remit_to'
  const main = address(mainKind, 'main', f, region)
  if (!main.street) problems.push({ field: 'main.street', message: `${domain === 'customer' ? 'Bill-to' : 'Remit-to'} street is required.` })
  if (!main.city) problems.push({ field: 'main.city', message: 'City is required.' })
  if ((region === 'BR' || region === 'US' || region === 'IN') && !main.regionCode) problems.push({ field: 'main.regionCode', message: region === 'BR' ? 'UF is required.' : 'State is required.' })
  if (region === 'BR' && !main.district) problems.push({ field: 'main.district', message: 'Bairro is required.' })
  const reasonText = t(f.reasonText)
  if (!reasonText) problems.push({ field: 'reasonText', message: `Say why this ${domain} is needed.` })
  for (const sec of SECONDARY_IDS[region] ?? []) if (sec.required && !t(f[`id_${sec.scheme}`])) problems.push({ field: `id_${sec.scheme}`, message: `${sec.label} is required.` })
  const duns = t(f.duns).replace(/\D/g, '')
  if (t(f.duns) && duns.length !== 9) problems.push({ field: 'duns', message: 'DUNS is 9 digits.' })
  const email = t(f.contactEmail)
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) problems.push({ field: 'contactEmail', message: 'Contact email does not look like an email.' })
  if (problems.length) return { ok: false, problems }

  const addresses: Address[] = [main]
  const ship = address('ship_to', 'ship', f, region)
  if (ship.street && ship.city) addresses.push(ship)
  const identifiers = (SECONDARY_IDS[region] ?? []).map((sec) => ({ scheme: sec.scheme, value: t(f[`id_${sec.scheme}`]) })).filter((i) => i.value)
  const payload: CanonicalPayload = {
    schemaVersion: 2,
    domain,
    destination: { erp: ERP_BY_REGION[region], region },
    identity: { country: taxId.country, scheme: taxId.scheme, canonical: taxId.canonical },
    identifiers,
    duns: duns || null,
    legalName,
    localName: n(f.localName),
    typeCode: n(f.typeCode),
    industry: n(f.industry),
    paymentTerms: n(f.paymentTerms),
    addresses,
    contact: t(f.contactName) || email ? { name: t(f.contactName), email } : null,
    reason: { text: reasonText, reference: n(f.reasonReference) },
  }
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
