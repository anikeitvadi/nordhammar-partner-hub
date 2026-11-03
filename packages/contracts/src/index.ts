// Pure domain contracts. This package imports nothing from the apps, no auth, no AI, no SDK runtime.
// Every other module parses external data into these types at its boundary and trusts them afterwards.
import { z } from 'zod'

export type Region = 'BR' | 'EU' | 'US' | 'IN' | 'CN'
export const REGIONS = ['BR', 'EU', 'US', 'IN', 'CN'] as const satisfies readonly Region[]

// The hub holds business partners. Customers and suppliers share identity, dedup, request, approval and the one
// ERP write; they differ in the payload's commercial block and in which ERP master the write lands in.
export type Domain = 'customer' | 'supplier'
export const DOMAINS = ['customer', 'supplier'] as const satisfies readonly Domain[]

export type Role = 'requester' | 'reviewer' | 'steward' | 'operator'

export type TaxId = {
  country: string
  scheme: string
  canonical: string
  // Company-level key per jurisdiction (CNPJ root, PAN inside a GSTIN). Absent when the scheme has none.
  companyKey?: string
}

export type Approval = {
  decisionId: string
  reviewerId: string
  reviewedAt: string
  payloadHash: string
}

export type StopCategory = 'business' | 'transport' | 'auth' | 'conflict' | 'dependency'

// One union. An approved request always carries its approval; a created one always carries its ERP number.
// Illegal combinations do not compile.
export type RequestState =
  | { kind: 'draft'; revision: number; returnedReason?: string }
  | { kind: 'submitted'; revision: number; submittedAt: string }
  | { kind: 'under_review'; revision: number; submittedAt: string }
  | { kind: 'approved'; revision: number; approval: Approval }
  | { kind: 'creating'; revision: number; approval: Approval; operationKey: string }
  | {
      kind: 'created'
      revision: number
      approval: Approval
      operationKey: string
      erpNumber: string
      createdAt: string
      goldenId: string | null
    }
  | { kind: 'declined'; revision: number; decisionId: string; reason: string }
  | {
      kind: 'stopped'
      revision: number
      approval: Approval
      operationKey: string
      category: StopCategory
      effect: 'no_effect' | 'unknown'
      reason: string
    }

export type RequestKind = RequestState['kind']

// The ERP operation key binds a request to the exact revision that was approved, in its domain.
export function operationKey(domain: Domain, requestId: string, approvedRevision: number): string {
  return `intake:${domain}:${requestId}:revision:${approvedRevision}`
}

// The inverse, for anything that only holds the key (the ERP step, the ledger). Null for a key this app did not mint.
export function parseOperationKey(key: string): { domain: Domain; requestId: string; revision: number } | null {
  const m = /^intake:(customer|supplier):([^:]+):revision:(\d+)$/.exec(key)
  return m ? { domain: m[1] as Domain, requestId: m[2], revision: Number(m[3]) } : null
}

// What the model is allowed to say. Code validates every field against the candidates it was given.
export const ProposalSchema = z.object({
  verdict: z.enum(['same', 'different', 'unsure']),
  golden_id: z.string().nullable(),
  groupRelation: z.enum(['unknown', 'suggested']),
  reasons: z
    .array(
      z.object({
        candidateId: z.string(),
        field: z.enum(['name', 'taxId', 'address', 'alias']),
        observation: z.enum(['matches', 'differs', 'missing', 'similar']),
        explanation: z.string().max(240),
      }),
    )
    .max(8),
})
export type Proposal = z.infer<typeof ProposalSchema>

export type ProposalOutcome =
  | { ai: 'available'; proposal: Proposal; model: string; usage?: { inputTokens: number; outputTokens: number } | null; cost?: number | null; generationId?: string | null }
  | { ai: 'unavailable'; reason: string }

// Three ERP instances behind the customer's integration platform. The region decides which one a partner is born in.
export const ERPS = ['ERP-1', 'ERP-2', 'ERP-3'] as const
export type Erp = (typeof ERPS)[number]
export const ERP_BY_REGION: Record<Region, Erp> = { US: 'ERP-1', BR: 'ERP-1', IN: 'ERP-1', EU: 'ERP-2', CN: 'ERP-3' }

// The lineage label a golden record carries for the ERP record it came from (ERP1_BR, ERP2_EU, ERP3_CN).
export function sourceSystem(erp: Erp, region: Region): string {
  return `${erp.replace('-', '')}_${region}`
}

export const ADDRESS_KINDS = ['bill_to', 'ship_to', 'remit_to'] as const
export type AddressKind = (typeof ADDRESS_KINDS)[number]

const AddressSchema = z.object({
  kind: z.enum(ADDRESS_KINDS),
  street: z.string(),
  number: z.string().nullable(),
  complement: z.string().nullable(),
  district: z.string().nullable(),
  city: z.string(),
  regionCode: z.string().nullable(),
  postalCode: z.string().nullable(),
  country: z.string(),
})
export type Address = z.infer<typeof AddressSchema>

// The command shape the ERP stub accepts. Same key + same hash replays the stored result; same key + different hash is a conflict.
// The payload is what a human approved: identity, the commercial facts the requester knows, and why. Credit limits,
// bank details and tax documents are not in it; finance completes those in the ERP, as today.
export const ErpCreateCommandSchema = z.object({
  operationKey: z.string().min(1),
  payloadHash: z.string().length(64),
  payload: z.object({
    schemaVersion: z.literal(2),
    domain: z.enum(DOMAINS),
    destination: z.object({ erp: z.enum(ERPS), region: z.enum(REGIONS) }),
    identity: z.object({ country: z.string(), scheme: z.string(), canonical: z.string() }),
    // Secondary registrations the region requires (state tax ID, PAN alongside a GSTIN, VAT alongside a company number).
    identifiers: z.array(z.object({ scheme: z.string(), value: z.string() })),
    duns: z.string().nullable(),
    legalName: z.string().min(1),
    localName: z.string().nullable(),
    // Customer type (OEM, distributor, end user, contractor) or supplier category (raw material, components, services).
    typeCode: z.string().nullable(),
    industry: z.string().nullable(),
    paymentTerms: z.string().nullable(),
    addresses: z.array(AddressSchema).min(1),
    contact: z.object({ name: z.string(), email: z.string() }).nullable(),
    reason: z.object({ text: z.string().min(1), reference: z.string().nullable() }),
  }),
})
export type ErpCreateCommand = z.infer<typeof ErpCreateCommandSchema>

// Canonical payload: fixed field order, explicit nulls, no timestamps, no AI text, no proposed parent, no credentials.
// The hash over it is what an approval binds to and what the ERP stub compares on replay.
export type CanonicalPayload = ErpCreateCommand['payload']

const s = (v: string | null | undefined) => (v == null ? null : v.trim() || null)

export function canonicalize(payload: CanonicalPayload): string {
  const addresses = [...payload.addresses]
    .map((a) => ({ kind: a.kind, street: a.street.trim(), number: s(a.number), complement: s(a.complement), district: s(a.district), city: a.city.trim(), regionCode: s(a.regionCode), postalCode: s(a.postalCode), country: a.country }))
    .sort((a, b) => a.kind.localeCompare(b.kind) || a.city.localeCompare(b.city) || a.street.localeCompare(b.street))
  const identifiers = [...payload.identifiers]
    .map((i) => ({ scheme: i.scheme, value: i.value.replace(/[^0-9A-Za-z]/g, '').toUpperCase() }))
    .sort((a, b) => a.scheme.localeCompare(b.scheme) || a.value.localeCompare(b.value))
  const ordered = {
    schemaVersion: 2 as const,
    domain: payload.domain,
    destination: { erp: payload.destination.erp, region: payload.destination.region },
    identity: { country: payload.identity.country, scheme: payload.identity.scheme, canonical: payload.identity.canonical },
    identifiers,
    duns: s(payload.duns),
    legalName: payload.legalName.trim(),
    localName: s(payload.localName),
    typeCode: s(payload.typeCode),
    industry: s(payload.industry),
    paymentTerms: s(payload.paymentTerms),
    addresses,
    contact: payload.contact ? { name: payload.contact.name.trim(), email: payload.contact.email.trim().toLowerCase() } : null,
    reason: { text: payload.reason.text.trim(), reference: s(payload.reason.reference) },
  }
  return JSON.stringify(ordered)
}

export async function payloadHash(payload: CanonicalPayload): Promise<string> {
  const bytes = new TextEncoder().encode(canonicalize(payload))
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

// Legal transitions. Everything that changes a request's state goes through here, so the legal flow is one function
// with tests, not a convention spread across actions.
export type RequestEvent =
  | { type: 'submit'; submittedAt: string }
  | { type: 'open_review' }
  | { type: 'approve'; approval: Approval }
  | { type: 'decline'; decisionId: string; reason: string }
  | { type: 'send_back'; reason: string }
  | { type: 'start_creating'; operationKey: string }
  | { type: 'created'; erpNumber: string; createdAt: string }
  | { type: 'stop'; category: StopCategory; effect: 'no_effect' | 'unknown'; reason: string }
  | { type: 'recover_to_draft' }
  | { type: 'golden_loaded'; goldenId: string }
  // Operator reconciliation of a stop with unknown effect, from the ERP's own ledger: it did commit, or it provably did not.
  | { type: 'reconciled_created'; erpNumber: string; createdAt: string }
  | { type: 'reconciled_no_effect'; reason: string }

export type Transition = { ok: true; next: RequestState } | { ok: false; reason: string }

export function transition(st: RequestState, e: RequestEvent): Transition {
  const bad = (why: string): Transition => ({ ok: false, reason: `${e.type} not allowed from ${st.kind}: ${why}` })
  switch (e.type) {
    case 'submit':
      return st.kind === 'draft' ? { ok: true, next: { kind: 'submitted', revision: st.revision + 1, submittedAt: e.submittedAt } } : bad('only a draft can be submitted')
    case 'open_review':
      return st.kind === 'submitted' ? { ok: true, next: { kind: 'under_review', revision: st.revision, submittedAt: st.submittedAt } } : bad('only a submitted request opens for review')
    case 'approve':
      return st.kind === 'under_review' ? { ok: true, next: { kind: 'approved', revision: st.revision, approval: e.approval } } : bad('only a request under review can be approved')
    case 'decline':
      return st.kind === 'under_review' ? { ok: true, next: { kind: 'declined', revision: st.revision, decisionId: e.decisionId, reason: e.reason } } : bad('only a request under review can be declined')
    case 'send_back':
      return st.kind === 'under_review' ? { ok: true, next: { kind: 'draft', revision: st.revision, returnedReason: e.reason } } : bad('only a request under review can be sent back')
    case 'start_creating':
      return st.kind === 'approved' ? { ok: true, next: { kind: 'creating', revision: st.revision, approval: st.approval, operationKey: e.operationKey } } : bad('only an approved request starts creating')
    case 'created':
      return st.kind === 'creating' ? { ok: true, next: { kind: 'created', revision: st.revision, approval: st.approval, operationKey: st.operationKey, erpNumber: e.erpNumber, createdAt: e.createdAt, goldenId: null } } : bad('only a creating request becomes created')
    case 'stop':
      return st.kind === 'creating' ? { ok: true, next: { kind: 'stopped', revision: st.revision, approval: st.approval, operationKey: st.operationKey, category: e.category, effect: e.effect, reason: e.reason } } : bad('only a creating request can stop')
    case 'recover_to_draft':
      // Only a definitive no-effect stop may go back to a draft. An unknown effect keeps its key until reconciled.
      return st.kind === 'stopped' && st.effect === 'no_effect' ? { ok: true, next: { kind: 'draft', revision: st.revision, returnedReason: `stopped: ${st.reason}` } } : bad('only a stop with no effect returns to draft')
    case 'golden_loaded':
      return st.kind === 'created' ? { ok: true, next: { ...st, goldenId: e.goldenId } } : bad('only a created request gains a golden id')
    case 'reconciled_created':
      return st.kind === 'stopped' && st.effect === 'unknown' ? { ok: true, next: { kind: 'created', revision: st.revision, approval: st.approval, operationKey: st.operationKey, erpNumber: e.erpNumber, createdAt: e.createdAt, goldenId: null } } : bad('only a stop with unknown effect can be reconciled as created')
    case 'reconciled_no_effect':
      return st.kind === 'stopped' && st.effect === 'unknown' ? { ok: true, next: { ...st, effect: 'no_effect', reason: e.reason } } : bad('only a stop with unknown effect can be reconciled as no effect')
  }
}

// A golden record as the customer's integration platform publishes it: already cleansed on their side, one per legal
// entity and domain. The hub's nightly load reads these and nothing else; every column of the hub's partner table
// comes from here. Money is per region and stays per region.
const GoldenAddressSchema = z.object({
  sourceAddressId: z.string(), kind: z.enum(ADDRESS_KINDS), street: z.string(), number: z.string().nullable(), complement: z.string().nullable(),
  district: z.string().nullable(), city: z.string(), regionCode: z.string().nullable(), postalCode: z.string().nullable(), country: z.string(), isDefault: z.boolean(),
})
export const GoldenRecordSchema = z.object({
  goldenId: z.string(),
  domain: z.enum(DOMAINS),
  legalName: z.string(),
  localName: z.string().nullable(),
  aliases: z.array(z.string()),
  taxScheme: z.string().nullable(),
  taxCanonical: z.string().nullable(),
  taxCompanyKey: z.string().nullable(),
  identifiers: z.array(z.object({ scheme: z.string(), value: z.string() })),
  duns: z.string().nullable(),
  dunsRating: z.string().nullable(),
  region: z.enum(REGIONS),
  country: z.string(),
  erp: z.enum(ERPS),
  erpNumber: z.string(),
  erpSegment: z.string().nullable(),
  userRef: z.string().nullable(),
  typeCode: z.string().nullable(),
  industry: z.string().nullable(),
  status: z.enum(['active', 'hold', 'inactive']),
  paymentTerms: z.string().nullable(),
  currency: z.string().nullable(),
  riskRating: z.string().nullable(),
  inceptionAt: z.string().nullable(),
  lastActivityAt: z.string().nullable(),
  group: z.object({ id: z.string(), name: z.string() }).nullable(),
  parentGoldenId: z.string().nullable(),
  ultimateParentGoldenId: z.string().nullable(),
  city: z.string(),
  street: z.string().nullable(),
  streetNumber: z.string().nullable(),
  addresses: z.array(GoldenAddressSchema),
  sources: z.array(z.object({ system: z.string(), id: z.string(), loadedAt: z.string() })),
  credit: z.array(z.object({ region: z.enum(REGIONS), limit: z.number(), currency: z.string(), terms: z.string() })),
  spend: z.array(z.object({ region: z.enum(REGIONS), ytd: z.number(), currency: z.string(), openInvoices: z.number() })),
})
export type GoldenRecord = z.infer<typeof GoldenRecordSchema>
export const GoldenFeedSchema = z.object({ records: z.array(GoldenRecordSchema), next: z.string().nullable() })
export type GoldenFeed = z.infer<typeof GoldenFeedSchema>

const CURRENCY_BY_COUNTRY: Record<string, string> = { BR: 'BRL', US: 'USD', IN: 'INR', CN: 'CNY', SE: 'SEK', NO: 'NOK', DK: 'DKK', PL: 'PLN' }

// What the customer's pipeline publishes for a partner it just created from an approved payload. Pure: the stand-in
// calls it when the ERP assigns a number, and the demo seed calls it for the history it writes. The golden id is the
// integration platform's, derived from the number; finance completes credit, terms and risk later, in the ERP.
export function goldenFromPayload(p: CanonicalPayload, erpNumber: string, at: string): GoldenRecord {
  const main = p.addresses.find((a) => a.kind === (p.domain === 'customer' ? 'bill_to' : 'remit_to')) ?? p.addresses[0]
  const key = p.identity.scheme === 'CNPJ' ? p.identity.canonical.slice(0, 8) : p.identity.scheme === 'GSTIN' ? p.identity.canonical.slice(2, 12) : p.identity.canonical
  return {
    goldenId: `${p.domain === 'customer' ? 'G' : 'S'}-${erpNumber}`,
    domain: p.domain, legalName: p.legalName, localName: p.localName, aliases: [],
    taxScheme: p.identity.scheme, taxCanonical: p.identity.canonical, taxCompanyKey: key, identifiers: p.identifiers, duns: p.duns, dunsRating: null,
    region: p.destination.region, country: p.identity.country, erp: p.destination.erp, erpNumber, erpSegment: `NH-${p.destination.region}`, userRef: null,
    typeCode: p.typeCode, industry: p.industry, status: 'active', paymentTerms: p.paymentTerms, currency: CURRENCY_BY_COUNTRY[p.identity.country] ?? 'EUR', riskRating: null,
    inceptionAt: at.slice(0, 10), lastActivityAt: null, group: null, parentGoldenId: null, ultimateParentGoldenId: null,
    city: main.city, street: main.street, streetNumber: main.number,
    addresses: p.addresses.map((a, i) => ({ sourceAddressId: `${erpNumber}-${i + 1}`, kind: a.kind, street: a.street, number: a.number, complement: a.complement, district: a.district, city: a.city, regionCode: a.regionCode, postalCode: a.postalCode, country: a.country, isDefault: i === 0 })),
    sources: [{ system: sourceSystem(p.destination.erp, p.destination.region), id: erpNumber, loadedAt: at }],
    credit: [], spend: [],
  }
}
