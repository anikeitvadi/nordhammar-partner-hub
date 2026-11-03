import { describe, expect, it } from 'vitest'
import { ERPS } from '@intake/contracts'
import { apply, MemoryStore, SERIES_START } from './ledger'

const cmd = (over: Partial<Parameters<typeof apply>[1]> = {}) => ({ erp: 'ERP-1' as const, domain: 'customer' as const, operationKey: 'intake:customer:R1:revision:1', payloadHash: 'h1', legalName: 'Foz Instrumentos', ...over })

describe('ledger replay rules, for every ERP', () => {
  for (const erp of ERPS) {
    it(`${erp}: first call creates (201), replay with the same key and hash returns the same number (200)`, async () => {
      const s = new MemoryStore()
      const a = await apply(s, cmd({ erp }))
      const b = await apply(s, cmd({ erp }))
      expect(a).toEqual({ status: 201, erp, number: String(SERIES_START[erp].customer) })
      expect(b).toEqual({ status: 200, erp, number: String(SERIES_START[erp].customer) })
    })
  }
  it('each ERP and domain draws from its own series', async () => {
    const s = new MemoryStore()
    const r = await Promise.all([apply(s, cmd({ operationKey: 'a', erp: 'ERP-2', domain: 'supplier' })), apply(s, cmd({ operationKey: 'b', erp: 'ERP-3' }))])
    expect(r.map((x) => ('number' in x ? x.number : null))).toEqual(['250201', '310201'])
  })
  it('same key with a different hash is a conflict and does not mutate', async () => {
    const s = new MemoryStore()
    await apply(s, cmd({ operationKey: 'k' }))
    const c = await apply(s, cmd({ operationKey: 'k', payloadHash: 'h2', legalName: 'A Company Changed' }))
    expect(c.status).toBe(409)
    expect((await s.get('k'))?.payloadHash).toBe('h1')
  })
  it('a business rejection is definitive: stored, replayed as the same 422, consumes no number', async () => {
    const s = new MemoryStore()
    const a = await apply(s, cmd({ operationKey: 'k', legalName: 'Bad Co [REJECT]' }))
    const b = await apply(s, cmd({ operationKey: 'k', legalName: 'Bad Co [REJECT]' }))
    expect(a).toMatchObject({ status: 422 }); expect(b).toEqual(a)
    expect(s.n['ERP-1:customer']).toBe(SERIES_START['ERP-1'].customer)
  })
  it('concurrent same-key calls converge on one number', async () => {
    const s = new MemoryStore()
    const [a, b, c] = await Promise.all([apply(s, cmd({ operationKey: 'k' })), apply(s, cmd({ operationKey: 'k' })), apply(s, cmd({ operationKey: 'k' }))])
    expect(new Set([a, b, c].map((r) => ('number' in r ? r.number : 'none'))).size).toBe(1)
  })
})
