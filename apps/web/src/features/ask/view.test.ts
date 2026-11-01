import { describe, expect, it } from 'vitest'
import { citesOnlyKnown, presenceView } from './view'
import type { Principal } from '@/features/auth/scope'

const ana: Principal = { email: 'ana@x', displayName: 'Ana', role: 'requester', regions: ['BR'], globalIdentity: false, moneyRegions: ['BR'] }
const priya: Principal = { email: 'p@x', displayName: 'Priya', role: 'reviewer', regions: ['BR', 'EU', 'US', 'IN', 'CN'], globalIdentity: true, moneyRegions: [] }
const rows = [
  { goldenId: 'G-BR', legalName: 'Aurora Industrial Ltda', region: 'BR' as const, domain: 'customer' as const, city: 'Cidade Exemplo', groupName: 'Aurora Industrial Group' },
  { goldenId: 'G-EU-05', legalName: 'Aurora Nordic AB', region: 'EU' as const, domain: 'customer' as const, city: 'Göteborg', groupName: 'Aurora Industrial Group' },
]

describe('presence view', () => {
  it('a BR requester asking about a group gets names and regions only outside BR', () => {
    const v = presenceView(ana, 'aurora', rows)
    expect(v.matches[0]).toMatchObject({ goldenId: 'G-BR', city: 'Cidade Exemplo' })
    expect(v.matches[1]).toEqual({ legalName: 'Aurora Nordic AB', region: 'EU', domain: 'customer', group: 'Aurora Industrial Group' })
    expect(JSON.stringify(v)).not.toContain('G-EU-05')
    expect(v.note).toContain('EU')
  })
  it('a global reviewer sees the ids and cities everywhere', () => {
    const v = presenceView(priya, 'aurora', rows)
    expect(v.matches.every((m) => 'goldenId' in m)).toBe(true)
    expect(v.note).toBe('All matches are in regions you can see.')
  })
})

describe('the sentence may only cite what the tool returned', () => {
  const result = { found: true, requestId: 'R-MVY4OEBEBJ7W', erpNumber: 'V-70101' }
  it('accepts a sentence that cites the result', () => { expect(citesOnlyKnown('R-MVY4OEBEBJ7W is created with number V-70101.', result)).toBe(true) })
  it('rejects an invented request id or number', () => {
    expect(citesOnlyKnown('R-ZZZZZZZZZZZZ is created.', result)).toBe(false)
    expect(citesOnlyKnown('The number is 26009.', result)).toBe(false)
  })
})
