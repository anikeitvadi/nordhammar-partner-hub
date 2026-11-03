import 'server-only'
import { payloadHash, transition, type CanonicalPayload, type Domain, type Region, type RequestState } from '@intake/contracts'
import { sql } from '@/lib/db'
import { canSeeIdentity, isCentral, type Principal } from '@/features/auth/scope'
import { linkLatestCheck } from '@/features/intake/checks.server'

// Owns every write to the request tables except the review decision (decide.server.ts) and the execution steps.
// Reads are scoped: a requester sees their own requests; a global reviewer or operator sees all.

export type DupChoice = 'new' | 'new_in_group' | 'not_related'
export type RequestSummary = { requestId: string; domain: Domain; region: Region; requesterEmail: string; revision: number; state: RequestState; createdAt: string; updatedAt: string; legalName: string }
export type RequestDetail = RequestSummary & {
  payload: CanonicalPayload; payloadHash: string; dupChoice: DupChoice | null; dupReason: string | null; linkedGoldenId: string | null; workflowRunId: string | null; ticketId: string | null
  events: { at: string; kind: string; actor: string | null; detail: unknown }[]
}

function newId(prefix: string) { return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase() }

export class ConflictError extends Error { constructor(m: string) { super(m); this.name = 'ConflictError' } }

// Submission: request + immutable revision + identity reservation + event + pending 'start' delivery, atomically.
// The reservation's primary key is the wall against two parallel requests for the same tax ID. Every submit now goes to
// finance first (awaiting_finance); the start delivery says so, and the request Workflow opens the desk ticket.
export async function submitRequest(principal: Principal, input: { domain: Domain; region: Region; payload: CanonicalPayload; dupChoice: DupChoice; dupReason: string | null; linkedGoldenId: string | null }): Promise<{ requestId: string }> {
  if (!canSeeIdentity(principal, input.region)) throw new ConflictError('not entitled to this region')
  const requestId = newId('R')
  const submittedAt = new Date().toISOString()
  const t = transition({ kind: 'draft', revision: 0 }, { type: 'submit_to_finance', submittedAt })
  if (!t.ok) throw new Error(t.reason)
  const state = t.next
  const hash = await payloadHash(input.payload)
  const db = sql()
  try {
    await db.transaction([
      db`insert into requests (request_id, domain, region, requester_email, current_revision, state_kind, state, dup_choice, dup_reason, linked_golden_id) values (${requestId}, ${input.domain}, ${input.region}, ${principal.email}, ${state.revision}, ${state.kind}, ${JSON.stringify(state)}::jsonb, ${input.dupChoice}, ${input.dupReason}, ${input.linkedGoldenId})`,
      db`insert into request_revisions (request_id, revision, payload, payload_hash) values (${requestId}, ${state.revision}, ${JSON.stringify(input.payload)}::jsonb, ${hash})`,
      db`insert into identity_reservations (domain, tax_canonical, request_id) values (${input.domain}, ${input.payload.identity.canonical}, ${requestId})`,
      db`insert into request_events (request_id, kind, actor, detail) values (${requestId}, 'submitted', ${principal.email}, ${JSON.stringify({ revision: state.revision, dupChoice: input.dupChoice })}::jsonb)`,
      db`insert into request_events (request_id, kind, actor, detail) values (${requestId}, 'email_queued', 'system', ${JSON.stringify({ to: principal.email, template: 'submitted' })}::jsonb)`,
      db`insert into deliveries (request_id, revision, kind, payload) values (${requestId}, ${state.revision}, 'start', ${JSON.stringify({ requestId, flow: 'finance' })}::jsonb)`,
    ])
  } catch (e) {
    if (e instanceof Error && /identity_reservations/.test(e.message)) throw new ConflictError(`An open ${input.domain} request already exists for this tax ID.`)
    throw e
  }
  await linkLatestCheck(principal, input.domain, input.payload.identity.canonical, requestId)
  return { requestId }
}

// A draft the requester parks: the request exists at revision 0 with its payload, holds no reservation and starts no run.
// Only the requester sees it (visible() below); submitting it later is resubmitRequest, which reserves the identity then.
export async function saveDraft(principal: Principal, input: { domain: Domain; region: Region; payload: CanonicalPayload }): Promise<{ requestId: string }> {
  if (!canSeeIdentity(principal, input.region)) throw new ConflictError('not entitled to this region')
  const requestId = newId('R')
  const state: RequestState = { kind: 'draft', revision: 0 }
  const hash = await payloadHash(input.payload)
  const db = sql()
  await db.transaction([
    db`insert into requests (request_id, domain, region, requester_email, current_revision, state_kind, state) values (${requestId}, ${input.domain}, ${input.region}, ${principal.email}, 0, 'draft', ${JSON.stringify(state)}::jsonb)`,
    db`insert into request_revisions (request_id, revision, payload, payload_hash) values (${requestId}, 0, ${JSON.stringify(input.payload)}::jsonb, ${hash})`,
    db`insert into request_events (request_id, kind, actor) values (${requestId}, 'draft_saved', ${principal.email})`,
  ])
  return { requestId }
}

// Resubmission of a draft that was sent back, or submission of a parked draft: a new immutable revision, same request, same reservation.
export async function resubmitRequest(principal: Principal, requestId: string, payload: CanonicalPayload): Promise<void> {
  const current = await loadState(requestId)
  if (!current || current.requesterEmail !== principal.email) throw new ConflictError('not your request')
  const t = transition(current.state, { type: 'submit_to_finance', submittedAt: new Date().toISOString() })
  if (!t.ok) throw new ConflictError(t.reason)
  const hash = await payloadHash(payload)
  const db = sql()
  const firstSubmission = current.state.revision === 0
  try {
    await db.transaction([
      db`update requests set current_revision = ${t.next.revision}, state_kind = ${t.next.kind}, state = ${JSON.stringify(t.next)}::jsonb, updated_at = now() where request_id = ${requestId} and current_revision = ${current.state.revision}`,
      db`insert into request_revisions (request_id, revision, payload, payload_hash) values (${requestId}, ${t.next.revision}, ${JSON.stringify(payload)}::jsonb, ${hash})`,
      ...(firstSubmission ? [db`insert into identity_reservations (domain, tax_canonical, request_id) values (${current.domain}, ${payload.identity.canonical}, ${requestId})`] : []),
      db`insert into request_events (request_id, kind, actor, detail) values (${requestId}, ${firstSubmission ? 'submitted' : 'resubmitted'}, ${principal.email}, ${JSON.stringify({ revision: t.next.revision })}::jsonb)`,
      db`insert into request_events (request_id, kind, actor, detail) values (${requestId}, 'email_queued', 'system', ${JSON.stringify({ to: principal.email, template: 'submitted' })}::jsonb)`,
      db`insert into deliveries (request_id, revision, kind, payload) values (${requestId}, ${t.next.revision}, 'start', ${JSON.stringify({ requestId, flow: 'finance' })}::jsonb)`,
    ])
  } catch (e) {
    if (e instanceof Error && /identity_reservations/.test(e.message)) throw new ConflictError(`An open ${current.domain} request already exists for this tax ID.`)
    throw e
  }
  if (firstSubmission) await linkLatestCheck(principal, current.domain, payload.identity.canonical, requestId)
}

async function loadState(requestId: string): Promise<{ state: RequestState; requesterEmail: string; region: Region; domain: Domain } | null> {
  const rows = await sql()`select state, requester_email, region, domain from requests where request_id = ${requestId}`
  const r = rows[0]
  return r ? { state: r.state as RequestState, requesterEmail: r.requester_email as string, region: r.region as Region, domain: r.domain as Domain } : null
}

function visible(principal: Principal, requesterEmail: string, region: Region): boolean {
  if (principal.globalIdentity) return true
  return requesterEmail === principal.email && canSeeIdentity(principal, region)
}

export async function getRequest(principal: Principal, requestId: string): Promise<RequestDetail | null> {
  const rows = await sql()`select r.*, v.payload, v.payload_hash from requests r join request_revisions v on v.request_id = r.request_id and v.revision = r.current_revision where r.request_id = ${requestId}`
  const r = rows[0]
  if (!r) return null
  if (!visible(principal, r.requester_email as string, r.region as Region)) return null
  const events = await sql()`select at, kind, actor, detail from request_events where request_id = ${requestId} order by id`
  const payload = r.payload as CanonicalPayload
  return {
    requestId, domain: r.domain as Domain, region: r.region as Region, requesterEmail: r.requester_email as string, revision: r.current_revision as number, state: r.state as RequestState,
    createdAt: new Date(r.created_at as string).toISOString(), updatedAt: new Date(r.updated_at as string).toISOString(), legalName: payload.legalName,
    payload, payloadHash: r.payload_hash as string, dupChoice: (r.dup_choice as DupChoice | null) ?? null, dupReason: (r.dup_reason as string | null) ?? null,
    linkedGoldenId: (r.linked_golden_id as string | null) ?? null, workflowRunId: (r.workflow_run_id as string | null) ?? null, ticketId: (r.ticket_id as string | null) ?? null,
    events: events.map((e) => ({ at: new Date(e.at as string).toISOString(), kind: e.kind as string, actor: (e.actor as string | null) ?? null, detail: e.detail })),
  }
}

export async function listMyRequests(principal: Principal): Promise<RequestSummary[]> {
  const rows = await sql()`select r.*, v.payload from requests r join request_revisions v on v.request_id = r.request_id and v.revision = r.current_revision where r.requester_email = ${principal.email} order by r.updated_at desc limit 50`
  return rows.map(toSummary)
}

// The Requests page (review log §7): a regional user's own requests; the central team's, every request. Each row says
// which way it came in (the hub form, or a ticket raised in the service desk first) and its ERP number once assigned.
export type RequestListRow = RequestSummary & { ticketId: string | null; source: 'hub' | 'desk'; erpNumber: string | null }
export async function listRequests(principal: Principal): Promise<RequestListRow[]> {
  const all = isCentral(principal)
  const rows = await sql()`select r.*, v.payload,
      exists (select 1 from request_events e where e.request_id = r.request_id and e.kind = 'submitted' and e.detail->>'via' = 'service desk') as from_desk
    from requests r join request_revisions v on v.request_id = r.request_id and v.revision = r.current_revision
    where (${all} or r.requester_email = ${principal.email}) order by r.updated_at desc limit 100`
  return rows.map((r) => ({ ...toSummary(r), ticketId: (r.ticket_id as string | null) ?? null, source: r.from_desk ? 'desk' : 'hub', erpNumber: ((r.state as { erpNumber?: string }).erpNumber) ?? null }))
}

// The central team's queue: requests from before the finance step, and exceptions, oldest first.
export async function listQueue(principal: Principal): Promise<RequestSummary[]> {
  if (!isCentral(principal)) return []
  const rows = await sql()`select r.*, v.payload from requests r join request_revisions v on v.request_id = r.request_id and v.revision = r.current_revision where r.state_kind in ('submitted','under_review','exception') order by r.created_at asc limit 50`
  return rows.map(toSummary)
}

function toSummary(r: Record<string, unknown>): RequestSummary {
  const payload = r.payload as CanonicalPayload
  return { requestId: r.request_id as string, domain: r.domain as Domain, region: r.region as Region, requesterEmail: r.requester_email as string, revision: r.current_revision as number, state: r.state as RequestState, createdAt: new Date(r.created_at as string).toISOString(), updatedAt: new Date(r.updated_at as string).toISOString(), legalName: payload.legalName }
}

// Ticket first: a request raised in the service desk becomes a hub request when finance approves it. The requester must
// be a person the hub knows, entitled to that region; the payload is built by the same builder as the form, so it is
// the same canonical payload either way in. The reservation is taken if free; if another open request already holds
// the tax ID, the clean check will say so and a person decides.
export async function createFromTicket(input: { requesterEmail: string; domain: Domain; region: Region; payload: CanonicalPayload; ticketId: string; submittedAt: string }): Promise<{ requestId: string; revision: number }> {
  const requestId = newId('R')
  const t = transition({ kind: 'draft', revision: 0 }, { type: 'submit_to_finance', submittedAt: input.submittedAt })
  if (!t.ok) throw new Error(t.reason)
  const opened = transition(t.next, { type: 'ticket_opened', ticketId: input.ticketId })
  if (!opened.ok) throw new Error(opened.reason)
  const state = opened.next
  const hash = await payloadHash(input.payload)
  const db = sql()
  await db.transaction([
    db`insert into requests (request_id, domain, region, requester_email, current_revision, state_kind, state, dup_choice, ticket_id) values (${requestId}, ${input.domain}, ${input.region}, ${input.requesterEmail}, ${state.revision}, ${state.kind}, ${JSON.stringify(state)}::jsonb, ${'new'}, ${input.ticketId})`,
    db`insert into request_revisions (request_id, revision, payload, payload_hash) values (${requestId}, ${state.revision}, ${JSON.stringify(input.payload)}::jsonb, ${hash})`,
    db`insert into identity_reservations (domain, tax_canonical, request_id) values (${input.domain}, ${input.payload.identity.canonical}, ${requestId}) on conflict do nothing`,
    db`insert into request_events (request_id, kind, actor, detail) values (${requestId}, 'submitted', ${input.requesterEmail}, ${JSON.stringify({ revision: state.revision, via: 'service desk', ticketId: input.ticketId })}::jsonb)`,
  ])
  return { requestId, revision: state.revision }
}

// Who the hub knows, for a ticket raised in the desk: a person with an entitlement covering the region.
export async function requesterFor(email: string, region: Region): Promise<boolean> {
  const r = await sql()`select regions, global_identity from entitlements where email = ${email}`
  return !!r[0] && ((r[0].global_identity as boolean) || (r[0].regions as string[]).includes(region))
}
