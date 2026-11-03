import type { Region } from '@intake/contracts'
import { sql } from '@/lib/db'
import type { Principal } from '@/features/auth/scope'
import { getRequest } from '@/features/requests/store.server'
import { getParty } from '@/features/customers/hub.server'
import { describeState } from '@/features/requests/status'
import { presenceView, type PresenceRow } from './view'

// The three record lookups the model may ask for (counts and totals are queryHub, query.server.ts). Each takes the principal and calls the same scoped readers the pages call,
// so the model can never see a row a page would not show. None of them writes. Region and identity are never
// arguments: the code already knows them.

export async function readGroupPresence(principal: Principal, name: string) {
  const q = name.trim().toLowerCase()
  if (q.length < 2) return presenceView(principal, name, [])
  const like = `%${q}%`
  const rows = await sql()`select p.golden_id, p.legal_name, p.region, p.domain, p.city, g.name as group_name
    from parties p left join groups g on g.group_id = p.group_id
    where lower(p.legal_name) like ${like} or lower(coalesce(g.name, '')) like ${like} or exists (select 1 from unnest(p.aliases) a where lower(a) like ${like})
    order by p.region, p.legal_name limit 12`
  return presenceView(principal, name, rows.map((r): PresenceRow => ({ goldenId: r.golden_id as string, legalName: r.legal_name as string, region: r.region as Region, domain: r.domain as 'customer' | 'supplier', city: r.city as string, groupName: (r.group_name as string | null) ?? null })))
}

export async function readRequestStatus(principal: Principal, requestId: string) {
  const r = await getRequest(principal, requestId.trim().toUpperCase())
  if (!r) return { found: false as const, requestId, note: 'No request with that id is visible to you. Ids look like R-MVY4OEBEBJ7W; requesters see their own, reviewers see every region.' }
  return {
    found: true as const, requestId: r.requestId, legalName: r.legalName, domain: r.domain, region: r.region, state: r.state.kind,
    where: describeState(r.state, r.domain), updatedAt: r.updatedAt, revision: r.revision,
    erpNumber: r.state.kind === 'created' ? r.state.erpNumber : null,
    stop: r.state.kind === 'stopped' ? { reason: r.state.reason, effect: r.state.effect } : null,
  }
}

export async function readWhyFlagged(principal: Principal, requestId: string) {
  const r = await getRequest(principal, requestId.trim().toUpperCase())
  if (!r) return { found: false as const, requestId, note: 'No request with that id is visible to you.' }
  const linked = r.linkedGoldenId ? await getParty(principal, r.linkedGoldenId) : null
  const outcome = r.dupChoice === 'new' || r.dupChoice === null ? 'no_match' : r.dupChoice
  const explanation = outcome === 'no_match'
    ? 'The hub found no record with this tax ID and no similar name in the region, so the request went straight to review.'
    : outcome === 'new_in_group'
      ? 'The hub found a record that shares the company-level tax ID or the name, and the requester chose to add this as a new establishment in the same group.'
      : 'The hub found a similar name and the requester said it is not related; the reviewer sees the requester\'s reason next to the match.'
  return {
    found: true as const, requestId: r.requestId, legalName: r.legalName, region: r.region, outcome, reason: r.dupReason,
    linkedTo: linked ? { goldenId: linked.goldenId, legalName: linked.legalName, city: linked.city, region: linked.region } : r.linkedGoldenId ? { goldenId: r.linkedGoldenId } : null,
    explanation,
  }
}
