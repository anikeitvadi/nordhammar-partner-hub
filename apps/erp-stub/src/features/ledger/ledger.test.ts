import { describe, expect, it } from 'vitest'
import { apply, MemoryStore } from './ledger'

describe('ledger replay rules', () => {
  it('first call creates (201), replay with the same key and hash returns the same number (200)', async () => {
    const s = new MemoryStore()
    const a = await apply(s, { operationKey: 'intake:R1:revision:1', payloadHash: 'h1', legalName: 'Foz Instrumentos' })
    const b = await apply(s, { operationKey: 'intake:R1:revision:1', payloadHash: 'h1', legalName: 'Foz Instrumentos' })
    expect(a).toEqual({ status: 201, customerNumber: '26000' })
    expect(b).toEqual({ status: 200, customerNumber: '26000' })
  })
  it('same key with a different hash is a conflict and does not mutate', async () => {
    const s = new MemoryStore()
    await apply(s, { operationKey: 'k', payloadHash: 'h1', legalName: 'A Company' })
    const c = await apply(s, { operationKey: 'k', payloadHash: 'h2', legalName: 'A Company Changed' })
    expect(c.status).toBe(409)
    expect((await s.get('k'))?.payloadHash).toBe('h1')
  })
  it('a business rejection is definitive: stored, replayed as the same 422, consumes no number', async () => {
    const s = new MemoryStore()
    const a = await apply(s, { operationKey: 'k', payloadHash: 'h', legalName: 'Bad Co [REJECT]' })
    const b = await apply(s, { operationKey: 'k', payloadHash: 'h', legalName: 'Bad Co [REJECT]' })
    expect(a).toMatchObject({ status: 422 }); expect(b).toEqual(a)
    expect(s.n).toBe(26000)
  })
  it('concurrent same-key calls converge on one number', async () => {
    const s = new MemoryStore()
    const cmd = { operationKey: 'k', payloadHash: 'h', legalName: 'Race Co' }
    const [a, b, c] = await Promise.all([apply(s, cmd), apply(s, cmd), apply(s, cmd)])
    const numbers = new Set([a, b, c].map((r) => ('customerNumber' in r ? r.customerNumber : 'none')))
    expect(numbers.size).toBe(1)
  })
})
