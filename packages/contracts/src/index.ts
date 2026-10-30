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
