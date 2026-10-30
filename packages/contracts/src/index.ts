// Pure domain contracts. This package imports nothing from the apps, no auth, no AI, no SDK runtime.
// Every other module parses external data into these types at its boundary and trusts them afterwards.
import { z } from 'zod'

export type Region = 'BR' | 'EU' | 'US' | 'IN' | 'CN'
export const REGIONS = ['BR', 'EU', 'US', 'IN', 'CN'] as const satisfies readonly Region[]

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
      erpCustomerNumber: string
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

// The ERP operation key binds a request to the exact revision that was approved.
export function operationKey(requestId: string, approvedRevision: number): string {
  return `intake:${requestId}:revision:${approvedRevision}`
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
  | { ai: 'available'; proposal: Proposal; model: string }
  | { ai: 'unavailable'; reason: string }

// The command shape the ERP stub accepts. Same key + same hash replays the stored result; same key + different hash is a conflict.
export const ErpCreateCommandSchema = z.object({
  operationKey: z.string().min(1),
  payloadHash: z.string().length(64),
  payload: z.object({
    schemaVersion: z.literal(1),
    destination: z.object({ erp: z.enum(['MAPICS', 'IFS']), region: z.enum(REGIONS) }),
    identity: z.object({ country: z.string(), scheme: z.string(), canonical: z.string() }),
    legalName: z.string().min(1),
    addresses: z.array(
      z.object({
        kind: z.enum(['bill_to', 'ship_to']),
        street: z.string(),
        number: z.string().nullable(),
        city: z.string(),
        regionCode: z.string().nullable(),
        postalCode: z.string().nullable(),
        country: z.string(),
      }),
    ),
    contact: z.object({ name: z.string(), email: z.string() }).nullable(),
  }),
})
export type ErpCreateCommand = z.infer<typeof ErpCreateCommandSchema>

// Canonical payload: fixed field order, explicit nulls, no timestamps, no AI text, no proposed parent, no credentials.
// The hash over it is what an approval binds to and what the ERP stub compares on replay.
export type CanonicalPayload = ErpCreateCommand['payload']

export function canonicalize(payload: CanonicalPayload): string {
  const addresses = [...payload.addresses]
    .sort((a, b) => a.kind.localeCompare(b.kind))
    .map((a) => ({ kind: a.kind, street: a.street, number: a.number ?? null, city: a.city, regionCode: a.regionCode ?? null, postalCode: a.postalCode ?? null, country: a.country }))
  const ordered = {
    schemaVersion: 1 as const,
    destination: { erp: payload.destination.erp, region: payload.destination.region },
    identity: { country: payload.identity.country, scheme: payload.identity.scheme, canonical: payload.identity.canonical },
    legalName: payload.legalName.trim(),
    addresses,
    contact: payload.contact ? { name: payload.contact.name, email: payload.contact.email } : null,
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
  | { type: 'created'; erpCustomerNumber: string; createdAt: string }
  | { type: 'stop'; category: StopCategory; effect: 'no_effect' | 'unknown'; reason: string }
  | { type: 'recover_to_draft' }
  | { type: 'golden_loaded'; goldenId: string }

export type Transition = { ok: true; next: RequestState } | { ok: false; reason: string }

export function transition(s: RequestState, e: RequestEvent): Transition {
  const bad = (why: string): Transition => ({ ok: false, reason: `${e.type} not allowed from ${s.kind}: ${why}` })
  switch (e.type) {
    case 'submit':
      return s.kind === 'draft' ? { ok: true, next: { kind: 'submitted', revision: s.revision + 1, submittedAt: e.submittedAt } } : bad('only a draft can be submitted')
    case 'open_review':
      return s.kind === 'submitted' ? { ok: true, next: { kind: 'under_review', revision: s.revision, submittedAt: s.submittedAt } } : bad('only a submitted request opens for review')
    case 'approve':
      return s.kind === 'under_review' ? { ok: true, next: { kind: 'approved', revision: s.revision, approval: e.approval } } : bad('only a request under review can be approved')
    case 'decline':
      return s.kind === 'under_review' ? { ok: true, next: { kind: 'declined', revision: s.revision, decisionId: e.decisionId, reason: e.reason } } : bad('only a request under review can be declined')
    case 'send_back':
      return s.kind === 'under_review' ? { ok: true, next: { kind: 'draft', revision: s.revision, returnedReason: e.reason } } : bad('only a request under review can be sent back')
    case 'start_creating':
      return s.kind === 'approved' ? { ok: true, next: { kind: 'creating', revision: s.revision, approval: s.approval, operationKey: e.operationKey } } : bad('only an approved request starts creating')
    case 'created':
      return s.kind === 'creating' ? { ok: true, next: { kind: 'created', revision: s.revision, approval: s.approval, operationKey: s.operationKey, erpCustomerNumber: e.erpCustomerNumber, createdAt: e.createdAt, goldenId: null } } : bad('only a creating request becomes created')
    case 'stop':
      return s.kind === 'creating' ? { ok: true, next: { kind: 'stopped', revision: s.revision, approval: s.approval, operationKey: s.operationKey, category: e.category, effect: e.effect, reason: e.reason } } : bad('only a creating request can stop')
    case 'recover_to_draft':
      // Only a definitive no-effect stop may go back to a draft. An unknown effect keeps its key until reconciled.
      return s.kind === 'stopped' && s.effect === 'no_effect' ? { ok: true, next: { kind: 'draft', revision: s.revision, returnedReason: `stopped: ${s.reason}` } } : bad('only a stop with no effect returns to draft')
    case 'golden_loaded':
      return s.kind === 'created' ? { ok: true, next: { ...s, goldenId: e.goldenId } } : bad('only a created request gains a golden id')
  }
}
