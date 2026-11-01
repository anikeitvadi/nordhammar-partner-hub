import type { Region } from '@intake/contracts'
import { canSeeIdentity, type Principal } from '@/features/auth/scope'

// Pure shaping of what the tools return, tested without a database. The rule that matters: outside the regions a
// person may see, a group's presence is names and regions only, never an id, a city or an address. The model gets
// exactly what the page would show, so there is nothing for a prompt to talk it into revealing.
export type PresenceRow = { goldenId: string; legalName: string; region: Region; domain: 'customer' | 'supplier'; city: string; groupName: string | null }
export type PresenceMatch = { legalName: string; region: Region; domain: 'customer' | 'supplier'; group: string | null; goldenId?: string; city?: string }

export function presenceView(principal: Principal, query: string, rows: PresenceRow[]): { query: string; matches: PresenceMatch[]; regions: Region[]; note: string } {
  const matches = rows.map((r) => canSeeIdentity(principal, r.region)
    ? { legalName: r.legalName, region: r.region, domain: r.domain, group: r.groupName, goldenId: r.goldenId, city: r.city }
    : { legalName: r.legalName, region: r.region, domain: r.domain, group: r.groupName })
  const regions = [...new Set(rows.map((r) => r.region))]
  const hidden = regions.filter((rg) => !canSeeIdentity(principal, rg))
  return { query, matches, regions, note: hidden.length ? `Records in ${hidden.join(', ')} show name and region only; contact that region's team for details.` : 'All matches are in regions you can see.' }
}

// The sentence may only cite identifiers that appear in the tool result. Any request id, hub id or ERP-looking
// number in the answer that the result does not contain means the model made it up, and the card stands alone.
export function citesOnlyKnown(answer: string, result: unknown): boolean {
  const known = JSON.stringify(result ?? '')
  const tokens = answer.match(/\bR-[A-Z0-9]{6,}\b|\bG-[A-Z0-9-]{2,}\b|\bV-\d{3,}\b|\b\d{5,}\b/g) ?? []
  return tokens.every((t) => known.includes(t))
}
