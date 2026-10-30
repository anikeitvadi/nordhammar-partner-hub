import { ProposalSchema, type Proposal } from '@intake/contracts'
import type { Candidate } from './match'

// The post-validator. Schema validity is necessary, not sufficient: the model must only talk about candidates and
// fields it was given. A reason citing a candidate that was not in the input, or a `same` verdict without a real
// golden_id, fails the whole proposal, and the request proceeds to the steward with ai: unavailable.
export type ValidationResult = { ok: true; proposal: Proposal } | { ok: false; reason: string }

export function validateProposal(raw: unknown, candidates: Candidate[]): ValidationResult {
  const parsed = ProposalSchema.safeParse(raw)
  if (!parsed.success) return { ok: false, reason: `schema: ${parsed.error.issues.map((i) => i.path.join('.') + ' ' + i.message).join('; ')}` }
  const p = parsed.data
  const ids = new Set(candidates.map((c) => c.goldenId))
  if (p.verdict === 'same' && (!p.golden_id || !ids.has(p.golden_id))) return { ok: false, reason: 'same verdict without a candidate golden_id' }
  if (p.golden_id && !ids.has(p.golden_id)) return { ok: false, reason: `golden_id ${p.golden_id} was not among the candidates` }
  if (p.verdict !== 'different' && p.reasons.length === 0) return { ok: false, reason: 'no reasons given' }
  for (const r of p.reasons) {
    const c = candidates.find((x) => x.goldenId === r.candidateId)
    if (!c) return { ok: false, reason: `reason cites unknown candidate ${r.candidateId}` }
    // A "missing" observation must be true of the candidate; a model may not invent an absence.
    if (r.observation === 'missing') {
      const missing = (r.field === 'taxId' && !c.taxId) || (r.field === 'address' && !c.street) || (r.field === 'alias' && c.aliases.length === 0)
      if (!missing) return { ok: false, reason: `claims ${r.field} missing on ${c.goldenId} but it is present` }
    }
    if (/ignore (the|all) (rules|instructions)|print all|approve/i.test(r.explanation)) return { ok: false, reason: 'explanation echoes an instruction, not an observation' }
  }
  return { ok: true, proposal: p }
}
