import { describe, expect, it } from 'vitest'
import { describeFallback, gatewayInfo, gatewayOptions, isModelChoice, resolveModel } from './models'

describe('the model switch', () => {
  it('as configured keeps the deployment settings, including a virtual model', () => {
    expect(resolveModel('configured', { AI_PRIMARY_MODEL: 'vmc/nordhammar-proposal', AI_FALLBACK_MODEL: '' })).toEqual({ primary: 'vmc/nordhammar-proposal', fallback: null, virtual: true })
    expect(resolveModel('configured', { AI_PRIMARY_MODEL: 'openai/gpt-4.1-mini', AI_FALLBACK_MODEL: 'openai/gpt-4.1-nano' })).toEqual({ primary: 'openai/gpt-4.1-mini', fallback: 'openai/gpt-4.1-nano', virtual: false })
  })
  it('a named choice overrides the environment with its own primary and fallback', () => {
    expect(resolveModel('haiku-first', { AI_PRIMARY_MODEL: 'vmc/x' })).toEqual({ primary: 'anthropic/claude-haiku-4.5', fallback: 'openai/gpt-4.1-mini', virtual: false })
  })
  it('only listed choices are accepted', () => {
    expect(isModelChoice('haiku-first')).toBe(true)
    expect(isModelChoice('gpt-5-mini')).toBe(false)
    expect(isModelChoice('toString')).toBe(false)
    expect(isModelChoice('openai/gpt-4o')).toBe(false)
  })
  it('a virtual model leaves the chain to the Gateway; zero data retention is always asked for', () => {
    expect(gatewayOptions({ primary: 'vmc/x', fallback: 'a/b', virtual: true }, 'ask', true)).toEqual({ gateway: { zeroDataRetention: true } })
    expect(gatewayOptions({ primary: 'a/b', fallback: 'c/d', virtual: false }, 'ask', true)).toEqual({ gateway: { models: ['c/d'], tags: ['ask'], zeroDataRetention: true } })
  })
})

describe('what the Gateway says happened', () => {
  // Trimmed from a live response on 2026-11-03 with Haiku first on the free tier.
  const meta = { gateway: { cost: '0.0000088', generationId: 'gen_1', routing: { canonicalSlug: 'openai/gpt-4.1-mini', modelAttempts: [{ canonicalSlug: 'anthropic/claude-haiku-4.5', success: false, providerAttempts: [] }, { canonicalSlug: 'openai/gpt-4.1-mini', success: true }] } } }
  it('reads the served model, every model tried, and the cost', () => {
    expect(gatewayInfo(meta)).toEqual({ served: 'openai/gpt-4.1-mini', attempts: [{ model: 'anthropic/claude-haiku-4.5', ok: false }, { model: 'openai/gpt-4.1-mini', ok: true }], cost: 0.0000088, generationId: 'gen_1' })
    expect(describeFallback(gatewayInfo(meta).attempts)).toBe('anthropic/claude-haiku-4.5 did not answer; served by openai/gpt-4.1-mini')
  })
  it('a first-try answer is not a fallback; missing metadata reads as nothing known', () => {
    expect(describeFallback([{ model: 'openai/gpt-4.1-mini', ok: true }])).toBeNull()
    expect(gatewayInfo(undefined)).toEqual({ served: null, attempts: [], cost: null, generationId: null })
  })
})
