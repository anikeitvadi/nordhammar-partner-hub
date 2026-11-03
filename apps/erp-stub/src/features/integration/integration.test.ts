import { describe, expect, it } from 'vitest'
import type { ErpCreateCommand } from '@intake/contracts'
import { checkCommand } from './command'
import { decodeCursor, encodeCursor, page } from './cursor'

const cmd = (region: 'BR' | 'EU' | 'CN', erp: 'ERP-1' | 'ERP-2' | 'ERP-3'): ErpCreateCommand => ({ operationKey: 'intake:customer:R-1:revision:1', payloadHash: 'h'.repeat(64), payload: { destination: { erp, region } } } as unknown as ErpCreateCommand)

describe('the door refuses inconsistent commands before writing anything', () => {
  it('routes by region to the ERP the integration platform owns', () => {
    expect(checkCommand(cmd('BR', 'ERP-1').operationKey, cmd('BR', 'ERP-1'), 'h'.repeat(64))).toEqual({ ok: true, erp: 'ERP-1' })
    expect(checkCommand(cmd('CN', 'ERP-3').operationKey, cmd('CN', 'ERP-3'), 'h'.repeat(64))).toEqual({ ok: true, erp: 'ERP-3' })
  })
  it('refuses a missing or different Idempotency-Key, a stale hash, and a destination the region does not route to', () => {
    expect(checkCommand(null, cmd('BR', 'ERP-1'), 'h'.repeat(64))).toMatchObject({ ok: false })
    expect(checkCommand('intake:customer:R-2:revision:1', cmd('BR', 'ERP-1'), 'h'.repeat(64))).toMatchObject({ ok: false, reason: 'Idempotency-Key does not match the operation key' })
    expect(checkCommand(cmd('BR', 'ERP-1').operationKey, cmd('BR', 'ERP-1'), 'x'.repeat(64))).toMatchObject({ ok: false, reason: 'payload hash does not match payload' })
    expect(checkCommand(cmd('CN', 'ERP-1').operationKey, cmd('CN', 'ERP-1'), 'h'.repeat(64))).toMatchObject({ ok: false, reason: 'region CN routes to ERP-3, not ERP-1' })
  })
})

describe('the golden-record feed pages by cursor', () => {
  const rows = [3, 1, 2, 2].map((n, i) => ({ goldenId: `G-${i}`, updatedAt: `2026-11-0${n}T00:00:00.000Z` }))
  it('walks every record once, in order, across pages, including ties on the timestamp', () => {
    const seen: string[] = []; let next: string | null = null
    for (;;) { const p: ReturnType<typeof page<(typeof rows)[number]>> = page(rows, decodeCursor(next), 2); if (!p.records.length) break; seen.push(...p.records.map((r) => r.goldenId)); next = p.next }
    expect(seen).toEqual(['G-1', 'G-2', 'G-3', 'G-0'])
  })
  it('a re-run from the last cursor returns nothing new, and a bad cursor reads as the start', () => {
    const last = encodeCursor({ at: rows[0].updatedAt, id: 'G-0' })
    expect(page(rows, decodeCursor(last), 10)).toEqual({ records: [], next: null })
    expect(decodeCursor('not-a-cursor')).toBeNull()
  })
})
