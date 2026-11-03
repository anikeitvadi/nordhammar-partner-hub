import type { CheckResult } from './types'

// Pure. What one on-entry check leaves behind: the route it took, the record it matched (never a foreign record's
// id, only its region), and on the compare route what the model proposed and what that cost. Null for results that
// are not a check of an identity (a form error, an invalid tax ID).
export type CheckRecord = {
  route: 'exact_visible' | 'exact_foreign' | 'related' | 'compare' | 'clear'
  taxCanonical: string
  matchedGoldenId: string | null
  matchedName: string | null
  matchedRegion: string | null
  ai: { verdict: string | null; goldenId: string | null; model: string | null; inputTokens: number | null; outputTokens: number | null; cost: number | null; generationId: string | null; unavailable: string | null } | null
}

export function checkRecord(r: CheckResult): CheckRecord | null {
  switch (r.kind) {
    case 'error': case 'invalid': return null
    case 'exact_visible': return { route: r.kind, taxCanonical: r.echo.taxCanonical, matchedGoldenId: r.candidate.goldenId, matchedName: r.candidate.legalName, matchedRegion: r.echo.region, ai: null }
    case 'exact_foreign': return { route: r.kind, taxCanonical: r.echo.taxCanonical, matchedGoldenId: null, matchedName: null, matchedRegion: r.region, ai: null }
    case 'related': return { route: r.kind, taxCanonical: r.echo.taxCanonical, matchedGoldenId: r.candidate.goldenId, matchedName: r.candidate.legalName, matchedRegion: r.echo.region, ai: null }
    case 'clear': return { route: r.kind, taxCanonical: r.echo.taxCanonical, matchedGoldenId: null, matchedName: null, matchedRegion: null, ai: null }
    case 'compare': {
      const o = r.outcome
      const about = o.ai === 'available' ? r.candidates.find((c) => c.goldenId === o.proposal.golden_id) ?? r.candidates[0] : r.candidates[0]
      return {
        route: 'compare', taxCanonical: r.echo.taxCanonical, matchedGoldenId: about?.goldenId ?? null, matchedName: about?.legalName ?? null, matchedRegion: r.echo.region,
        ai: o.ai === 'available'
          ? { verdict: o.proposal.verdict, goldenId: o.proposal.golden_id, model: o.model, inputTokens: o.usage?.inputTokens ?? null, outputTokens: o.usage?.outputTokens ?? null, cost: o.cost ?? null, generationId: o.generationId ?? null, unavailable: null }
          : { verdict: null, goldenId: null, model: null, inputTokens: null, outputTokens: null, cost: null, generationId: null, unavailable: o.reason },
      }
    }
  }
}

// The timeline line a linked check becomes on the request it led to.
export function describeCheck(d: { route?: string; matchedName?: string | null; matchedRegion?: string | null; ai?: CheckRecord['ai'] }): string {
  const ai = d.ai
  const reading = ai ? (ai.verdict ? ` The AI reading was "${ai.verdict}"${ai.model ? ` (${ai.model}${ai.cost != null ? `, $${ai.cost.toFixed(4)}` : ''})` : ''}; the reviewer decides.` : ' No AI reading was available; the reviewer compares by hand.') : ''
  switch (d.route) {
    case 'clear': return 'Checked against the hub before the form opened: no match'
    case 'related': return `Checked against the hub: same company as ${d.matchedName ?? 'an existing record'}, a different establishment`
    case 'compare': return `Checked against the hub: a possible match by name, ${d.matchedName ?? 'an existing record'}, with no tax ID on file.${reading}`
    default: return 'Checked against the hub'
  }
}
