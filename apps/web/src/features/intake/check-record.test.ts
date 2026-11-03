import { describe, expect, it } from 'vitest'
import { checkRecord, describeCheck } from './check-record'
import type { Echo } from './types'

const echo: Echo = { domain: 'customer', region: 'BR', country: 'BR', legalName: 'Vela Processos Industriais', city: '', street: null, taxCanonical: '61000103000146' }

describe('what a check leaves behind', () => {
  it('a foreign exact match keeps the region and never the record', () => {
    expect(checkRecord({ kind: 'exact_foreign', region: 'EU', echo })).toEqual({ route: 'exact_foreign', taxCanonical: echo.taxCanonical, matchedGoldenId: null, matchedName: null, matchedRegion: 'EU', ai: null })
  })
  it('form errors and invalid tax IDs are not checks and leave nothing', () => {
    expect(checkRecord({ kind: 'error', message: 'x' })).toBeNull()
    expect(checkRecord({ kind: 'invalid', reason: 'invalid_checksum' })).toBeNull()
  })
  it('the compare route carries the verdict, the served model, tokens and cost', () => {
    const r = checkRecord({ kind: 'compare', echo, candidates: [{ goldenId: 'G-LEGACY', legalName: 'Vela Processos', city: 'Cidade Exemplo', hasTaxId: false, groupName: 'Vela Holdings' }],
      outcome: { ai: 'available', proposal: { verdict: 'unsure', golden_id: 'G-LEGACY', groupRelation: 'suggested', reasons: [] }, model: 'openai/gpt-4.1-mini', usage: { inputTokens: 430, outputTokens: 130 }, cost: 0.00038, generationId: 'gen_1' } } as never)
    expect(r?.ai).toEqual({ verdict: 'unsure', goldenId: 'G-LEGACY', model: 'openai/gpt-4.1-mini', inputTokens: 430, outputTokens: 130, cost: 0.00038, generationId: 'gen_1', unavailable: null })
    expect(r?.matchedName).toBe('Vela Processos')
  })
  it('a model that was unavailable is recorded as such, not as a verdict', () => {
    const r = checkRecord({ kind: 'compare', echo, candidates: [{ goldenId: 'G-LEGACY', legalName: 'Vela Processos', city: 'Cidade Exemplo', hasTaxId: false, groupName: null }], outcome: { ai: 'unavailable', reason: 'timeout' } } as never)
    expect(r?.ai?.verdict).toBeNull()
    expect(r?.ai?.unavailable).toBe('timeout')
  })
  it('the timeline line names the reading and its cost, and says who decides', () => {
    expect(describeCheck({ route: 'compare', matchedName: 'Vela Processos', ai: { verdict: 'unsure', goldenId: null, model: 'openai/gpt-4.1-mini', inputTokens: 1, outputTokens: 1, cost: 0.00038, generationId: null, unavailable: null } }))
      .toBe('Checked against the hub: a possible match by name, Vela Processos, with no tax ID on file. The AI reading was "unsure" (openai/gpt-4.1-mini, $0.0004); the reviewer decides.')
    expect(describeCheck({ route: 'clear' })).toBe('Checked against the hub before the form opened: no match')
  })
})
