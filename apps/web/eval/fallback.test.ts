// pnpm eval:live also runs this: force the primary to fail (a model id that does not exist) and prove the Gateway
// served the fallback, as reported by the Gateway's own attempt log, not by us guessing.
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { normalizeTaxId } from '@/features/intake/normalize'
import { preflight, type Candidate } from '@/features/intake/match'
import { proposeMatch } from '@/features/intake/agent.server'

const key = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN
const file = JSON.parse(readFileSync(path.resolve(__dirname, '../../../eval/fixtures/cases.json'), 'utf8')) as { cases: { id: string; input: { country: string; taxRaw: string; legalName: string; city: string; street: string | null }; candidates: string[]; expect: Record<string, unknown> }[]; candidates: Record<string, Candidate> }

describe.skipIf(!key)('provider failover', () => {
  it('a dead primary model is served by the fallback, and the served model is the fallback slug', async () => {
    const fallback = process.env.AI_FALLBACK_MODEL ?? 'openai/gpt-4.1-mini'
    process.env.AI_PRIMARY_MODEL = 'anthropic/claude-does-not-exist-0'
    process.env.AI_FALLBACK_MODEL = fallback
    const c = file.cases.find((x) => x.id === 'E03')!
    const n = normalizeTaxId(c.input.country, c.input.taxRaw); if (!n.ok) throw new Error('fixture')
    const route = preflight({ taxId: n.taxId }, null, c.candidates.map((id) => file.candidates[id]))
    if (route.route !== 'compare') throw new Error('route')
    const out = await proposeMatch({ legalName: c.input.legalName, taxId: n.taxId, city: c.input.city, street: c.input.street }, route.candidates)
    expect(out.ai, out.ai === 'unavailable' ? out.reason : '').toBe('available')
    if (out.ai === 'available') expect(out.model).toBe(fallback)
  }, 60_000)
  it('with no fallback, a dead primary is an unavailable proposal, not an exception', async () => {
    process.env.AI_PRIMARY_MODEL = 'anthropic/claude-does-not-exist-0'
    process.env.AI_FALLBACK_MODEL = ''
    const c = file.cases.find((x) => x.id === 'E03')!
    const n = normalizeTaxId(c.input.country, c.input.taxRaw); if (!n.ok) throw new Error('fixture')
    const route = preflight({ taxId: n.taxId }, null, c.candidates.map((id) => file.candidates[id]))
    if (route.route !== 'compare') throw new Error('route')
    const out = await proposeMatch({ legalName: c.input.legalName, taxId: n.taxId, city: c.input.city, street: c.input.street }, route.candidates)
    expect(out.ai).toBe('unavailable')
  }, 60_000)
})
