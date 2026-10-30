// pnpm eval:live. Needs AI_GATEWAY_API_KEY. Runs the compare cases (E03, E09, E10, E11) through the real adapter,
// three repetitions each, on the primary model and then on the fallback as primary, and reports pass^3 per case
// and per category. Writes eval/results/live-<timestamp>.json and .md. Skipped without a key.
import { describe, expect, it } from 'vitest'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { normalizeTaxId } from '@/features/intake/normalize'
import { preflight, type Candidate } from '@/features/intake/match'
import { proposeMatch } from '@/features/intake/agent.server'

const key = process.env.AI_GATEWAY_API_KEY
const file = JSON.parse(readFileSync(path.resolve(__dirname, '../../../eval/fixtures/cases.json'), 'utf8')) as { cases: { id: string; input: { country: string; taxRaw: string; legalName: string; city: string; street: string | null }; exactHit: unknown; candidates: string[]; expect: Record<string, unknown>; model?: { down?: boolean } }[]; candidates: Record<string, Candidate> }
const compareCases = file.cases.filter((c) => c.expect.route === 'compare' && !c.model?.down)
const REPS = 3
const models = [process.env.AI_PRIMARY_MODEL ?? 'anthropic/claude-haiku-4.5', process.env.AI_FALLBACK_MODEL ?? 'openai/gpt-4.1-mini']

type Attempt = { case: string; model: string; rep: number; ai: string; verdict?: string; golden_id?: string | null; pass: boolean; reason?: string; ms: number }

describe.skipIf(!key)('live eval', () => {
  it(`pass^${REPS} per case on each model`, async () => {
    const attempts: Attempt[] = []
    for (const model of models) {
      process.env.AI_PRIMARY_MODEL = model; process.env.AI_FALLBACK_MODEL = ''
      for (const c of compareCases) {
        const n = normalizeTaxId(c.input.country, c.input.taxRaw); if (!n.ok) throw new Error(c.id)
        const route = preflight({ taxId: n.taxId }, null, c.candidates.map((id) => file.candidates[id]))
        if (route.route !== 'compare') throw new Error(`${c.id} did not route to compare`)
        for (let rep = 1; rep <= REPS; rep++) {
          const t0 = Date.now()
          const out = await proposeMatch({ legalName: c.input.legalName, taxId: n.taxId, city: c.input.city, street: c.input.street }, route.candidates)
          const ms = Date.now() - t0
          if (out.ai === 'available') {
            const pass = out.proposal.verdict === c.expect.verdict && out.proposal.golden_id === c.expect.golden_id && out.proposal.groupRelation === c.expect.groupRelation
            attempts.push({ case: c.id, model, rep, ai: 'available', verdict: out.proposal.verdict, golden_id: out.proposal.golden_id, pass, ms })
          } else attempts.push({ case: c.id, model, rep, ai: 'unavailable', pass: false, reason: out.reason, ms })
        }
      }
    }
    const byCase: Record<string, { passes: number; total: number; passK: boolean }> = {}
    for (const a of attempts) { const k = `${a.model} ${a.case}`; byCase[k] ??= { passes: 0, total: 0, passK: false }; byCase[k].total++; if (a.pass) byCase[k].passes++ }
    for (const k of Object.keys(byCase)) byCase[k].passK = byCase[k].passes === byCase[k].total
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    const dir = path.resolve(__dirname, '../../../eval/results'); mkdirSync(dir, { recursive: true })
    const meta = { ranAt: new Date().toISOString(), reps: REPS, models, git: process.env.GIT_SHA ?? 'local', fixtures: 'eval/fixtures/cases.json' }
    writeFileSync(path.join(dir, `live-${stamp}.json`), JSON.stringify({ meta, byCase, attempts }, null, 2))
    const md = [`# Live eval ${meta.ranAt}`, '', `reps ${REPS}, models ${models.join(', ')}`, '', '| model | case | passes | pass^k | mean ms |', '|---|---|---:|:--:|---:|',
      ...Object.entries(byCase).map(([k, v]) => { const [model, cs] = k.split(' '); const ms = Math.round(attempts.filter((a) => a.model === model && a.case === cs).reduce((s, a) => s + a.ms, 0) / v.total); return `| ${model} | ${cs} | ${v.passes}/${v.total} | ${v.passK ? 'yes' : 'no'} | ${ms} |` }),
      '', 'Human grading of the reasons is separate and recorded in the artifact, not here.'].join('\n')
    writeFileSync(path.join(dir, `live-${stamp}.md`), md)
    // The gate: every case must pass^k on the primary model. A failure here is information, not a build break, until the artifact says otherwise.
    const primaryFails = Object.entries(byCase).filter(([k, v]) => k.startsWith(models[0]) && !v.passK).map(([k]) => k)
    expect(primaryFails, 'cases failing pass^k on the primary model').toEqual([])
  }, 10 * 60 * 1000)
})
