import type { ProposalOutcome, Region } from '@intake/contracts'

// What the form island is allowed to know. No rows, no foreign identities, no amounts.
export type Echo = { region: Region; country: string; legalName: string; city: string; street: string | null; taxCanonical: string }
export type CheckResult =
  | { kind: 'error'; message: string }
  | { kind: 'invalid'; reason: 'missing' | 'invalid_format' | 'invalid_checksum' | 'unsupported_country' }
  | { kind: 'exact_visible'; candidate: { goldenId: string; legalName: string; city: string }; echo: Echo }
  | { kind: 'exact_foreign'; region: string; echo: Echo }
  | { kind: 'related'; candidate: { goldenId: string; legalName: string; city: string; groupName: string | null }; echo: Echo }
  | { kind: 'clear'; echo: Echo }
  | { kind: 'compare'; candidates: { goldenId: string; legalName: string; city: string; hasTaxId: boolean; groupName: string | null }[]; outcome: ProposalOutcome; echo: Echo }
