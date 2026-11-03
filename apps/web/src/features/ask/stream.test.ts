import { describe, expect, it } from 'vitest'
import { releaseChecked, sumSteps } from './stream'

const card = { requestId: 'R-MW03DIK8A40A', erpNumber: '110204' }

describe('the streamed sentence', () => {
  it('shows only whole words, and only after they are checked', () => {
    expect(releaseChecked('Request R-MW03DIK8A40A was created as 1102', card, true, false)).toEqual({ shown: 'Request R-MW03DIK8A40A was created as', ok: true })
    expect(releaseChecked('Request R-MW03DIK8A40A was created as 110204.', card, true, true)).toEqual({ shown: 'Request R-MW03DIK8A40A was created as 110204.', ok: true })
  })
  it('a number the card does not hold stops the sentence before it is shown', () => {
    expect(releaseChecked('It was created as 110999 yesterday', card, true, false)).toEqual({ shown: '', ok: false })
  })
  it('a half-typed id is held back, not judged', () => {
    expect(releaseChecked('Request R-MW03', card, true, false)).toEqual({ shown: 'Request', ok: true })
  })
  it('with no lookup there is nothing to cite against, as before', () => {
    expect(releaseChecked("I can't answer that here. Try the search box.", null, false, true).ok).toBe(true)
  })
})

describe('what an answer cost', () => {
  const step = (cost: string, attempts: [string, boolean][]) => ({ gateway: { cost, routing: { canonicalSlug: attempts.find(([, ok]) => ok)?.[0], modelAttempts: attempts.map(([canonicalSlug, success]) => ({ canonicalSlug, success })) } } })
  it('adds both steps, and lists each model tried once', () => {
    const s = sumSteps([step('0.00030', [['anthropic/claude-haiku-4.5', false], ['openai/gpt-4.1-mini', true]]), step('0.00012', [['anthropic/claude-haiku-4.5', false], ['openai/gpt-4.1-mini', true]])])
    expect(s.cost).toBeCloseTo(0.00042, 10)
    expect(s.attempts).toEqual([{ model: 'anthropic/claude-haiku-4.5', ok: false }, { model: 'openai/gpt-4.1-mini', ok: true }])
    expect(s.served).toBe('openai/gpt-4.1-mini')
  })
  it('no cost reported is unknown, not zero', () => {
    expect(sumSteps([undefined, {}]).cost).toBeNull()
  })
})
