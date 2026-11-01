import { ProposalSchema, type Proposal } from '@intake/contracts'
import type { Candidate } from './match'
import { normalizeName } from './normalize'

// The post-validator. Schema validity is necessary, not sufficient: the model must only talk about candidates and
// fields it was given. A reason citing a candidate that was not in the input, or a `same` verdict without a real
// golden_id, fails the whole proposal, and the request proceeds to the steward with ai: unavailable.
export type ValidationResult = { ok: true; proposal: Proposal } | { ok: false; reason: string }

export function validateProposal(raw: unknown, candidates: Candidate[], input?: { legalName: string }): ValidationResult {
  const parsed = ProposalSchema.safeParse(raw)
  if (!parsed.success) return { ok: false, reason: `schema: ${parsed.error.issues.map((i) => i.path.join('.') + ' ' + i.message).join('; ')}` }
  let p = parsed.data
  // The one deterministic bound on the verdict: 'same' against a candidate that carries no tax ID is only allowed when
  // code can confirm an exact name or alias match. A model talked into 'same' by text inside a name (eval E11) is
  // downgraded to 'unsure' with the reason stated, not trusted and not thrown away.
  if (p.verdict === 'same' && p.golden_id && input) {
    const c = candidates.find((x) => x.goldenId === p.golden_id)
    if (c && !c.taxId) {
      const want = normalizeName(input.legalName)
      const confirmed = want.length > 0 && [c.legalName, ...c.aliases].some((n) => normalizeName(n) === want)
      if (!confirmed) p = { ...p, verdict: 'unsure', reasons: [...p.reasons, { candidateId: c.goldenId, field: 'name' as const, observation: 'similar' as const, explanation: 'Code could not confirm an exact name or alias match for a record without a tax ID; downgraded from same.' }].slice(0, 8) }
    }
  }
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
