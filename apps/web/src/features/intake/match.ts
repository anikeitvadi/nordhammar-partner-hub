import type { TaxId } from '@intake/contracts'
import { relation } from './normalize'

// Pure. What the code decides before any model is involved.
export type Candidate = {
  goldenId: string
  legalName: string
  aliases: string[]
  city: string
  street: string | null
  taxId: TaxId | null          // legacy records can have none; that is exactly the case the model exists for
  groupName: string | null
}

export type Preflight =
  | { route: 'invalid'; reason: 'missing' | 'invalid_format' | 'invalid_checksum' | 'unsupported_country' }
  | { route: 'exact_visible'; candidate: Candidate }                 // hard stop: open the existing customer
  | { route: 'exact_foreign'; region: string }                       // hard stop: region hint only
  | { route: 'related'; candidate: Candidate }                       // same company key, different establishment: deterministic hint, pre-select "new company in this group"
  | { route: 'no_candidates' }                                       // nothing to compare; proceeds, model not called
  | { route: 'compare'; candidates: Candidate[] }                    // name/alias matches with no decisive ID: the one case for the model

export function preflight(input: { taxId: TaxId }, exactHit: { visible: Candidate } | { foreignRegion: string } | null, nameCandidates: Candidate[]): Preflight {
  if (exactHit && 'visible' in exactHit) return { route: 'exact_visible', candidate: exactHit.visible }
  if (exactHit && 'foreignRegion' in exactHit) return { route: 'exact_foreign', region: exactHit.foreignRegion }
  const related = nameCandidates.find((c) => c.taxId && relation(input.taxId, c.taxId) === 'related')
  if (related) return { route: 'related', candidate: related }
  // Candidates that carry a usable ID of the same jurisdiction and still did not match are different companies; drop them.
  const undecided = nameCandidates.filter((c) => !c.taxId || c.taxId.country !== input.taxId.country)
  if (undecided.length === 0) return { route: 'no_candidates' }
  return { route: 'compare', candidates: undecided.slice(0, 5) }
}
