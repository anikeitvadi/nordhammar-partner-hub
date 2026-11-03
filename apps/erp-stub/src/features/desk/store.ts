import { neon } from '@neondatabase/serverless'
import type { DeskPartner, Domain, Region } from '@intake/contracts'

// The desk's own data. Plain SQL over the stand-in's database; nothing here knows about the hub's tables.
export type Ticket = {
  id: string; source: 'hub' | 'desk'; hubRequestId: string | null; hubRevision: number | null; requesterEmail: string; region: Region; domain: Domain
  summary: { legalName: string; taxId: string; country: string }; partner: DeskPartner | null
  status: 'open' | 'finance_approved' | 'finance_rejected' | 'done'; decidedBy: string | null; decisionReason: string | null; decidedAt: string | null; createdAt: string
}
export type Comment = { at: string; author: string; body: string }
export type OutboxRow = { eventId: string; type: string; attempts: number; lastError: string | null; deliveredAt: string | null; createdAt: string }

export function db() {
  const url = process.env.ERP_DATABASE_URL
  if (!url) throw new Error('integration database not configured')
  return neon(url)
}
const iso = (v: unknown) => (v ? new Date(v as string).toISOString() : null)
function toTicket(r: Record<string, unknown>): Ticket {
  return { id: r.ticket_id as string, source: r.source as Ticket['source'], hubRequestId: (r.hub_request_id as string | null) ?? null, hubRevision: (r.hub_revision as number | null) ?? null, requesterEmail: r.requester_email as string, region: r.region as Region, domain: r.domain as Domain, summary: r.summary as Ticket['summary'], partner: (r.partner as DeskPartner | null) ?? null, status: r.status as Ticket['status'], decidedBy: (r.decided_by as string | null) ?? null, decisionReason: (r.decision_reason as string | null) ?? null, decidedAt: iso(r.decided_at), createdAt: iso(r.created_at)! }
}

export async function openTicket(t: { source: 'hub' | 'desk'; hubRequestId: string | null; hubRevision: number | null; requesterEmail: string; region: Region; domain: Domain; summary: Ticket['summary']; partner: DeskPartner | null }): Promise<string> {
  const sql = db()
  // The hub retries its "open a ticket" step; the same request revision always gets the same ticket.
  if (t.hubRequestId) {
    const cur = await sql`select ticket_id from desk_tickets where hub_request_id = ${t.hubRequestId} and hub_revision = ${t.hubRevision}`
    if (cur[0]) return cur[0].ticket_id as string
  }
  const n = await sql`select nextval('desk_ticket_numbers') as n`
  const id = `SD-${String(n[0].n).padStart(5, '0')}`
  await sql`insert into desk_tickets (ticket_id, source, hub_request_id, hub_revision, requester_email, region, domain, summary, partner)
    values (${id}, ${t.source}, ${t.hubRequestId}, ${t.hubRevision}, ${t.requesterEmail}, ${t.region}, ${t.domain}, ${JSON.stringify(t.summary)}::jsonb, ${t.partner ? JSON.stringify(t.partner) : null}::jsonb)
    on conflict do nothing`
  const again = t.hubRequestId ? await sql`select ticket_id from desk_tickets where hub_request_id = ${t.hubRequestId} and hub_revision = ${t.hubRevision}` : [{ ticket_id: id }]
  return again[0].ticket_id as string
}

export async function addComment(ticketId: string, author: string, body: string, dedupeKey: string | null): Promise<boolean> {
  const r = await db()`insert into desk_comments (ticket_id, author, body, dedupe_key) values (${ticketId}, ${author}, ${body}, ${dedupeKey}) on conflict (dedupe_key) do nothing returning id`
  return r.length > 0
}

export async function listTickets(): Promise<Ticket[]> {
  return (await db()`select * from desk_tickets order by (status = 'open') desc, created_at desc limit 200`).map(toTicket)
}
export async function getTicket(id: string): Promise<{ ticket: Ticket; comments: Comment[]; outbox: OutboxRow[] } | null> {
  const sql = db()
  const t = await sql`select * from desk_tickets where ticket_id = ${id}`
  if (!t[0]) return null
  const [c, o] = await Promise.all([sql`select at, author, body from desk_comments where ticket_id = ${id} order by at`, sql`select event_id, type, attempts, last_error, delivered_at, created_at from desk_outbox where ticket_id = ${id} order by created_at`])
  return { ticket: toTicket(t[0]), comments: c.map((r) => ({ at: iso(r.at)!, author: r.author as string, body: r.body as string })), outbox: o.map((r) => ({ eventId: r.event_id as string, type: r.type as string, attempts: r.attempts as number, lastError: (r.last_error as string | null) ?? null, deliveredAt: iso(r.delivered_at), createdAt: iso(r.created_at)! })) }
}

// Finance's decision and its webhook event commit together, so a decision can never exist without the event that
// tells the hub. Only an open ticket can be decided: a second click finds nothing to update.
export async function decide(id: string, decision: 'approve' | 'reject', by: string, reason: string | null, eventId: string, buildBody: (t: Ticket) => string): Promise<boolean> {
  const sql = db()
  const cur = await sql`select * from desk_tickets where ticket_id = ${id} and status = 'open'`
  if (!cur[0]) return false
  const t = toTicket(cur[0])
  const status = decision === 'approve' ? 'finance_approved' : 'finance_rejected'
  const body = buildBody({ ...t, status, decidedBy: by, decisionReason: reason })
  const out = await sql.transaction([
    sql`update desk_tickets set status = ${status}, decided_by = ${by}, decision_reason = ${reason}, decided_at = now() where ticket_id = ${id} and status = 'open' returning ticket_id`,
    sql`insert into desk_outbox (event_id, ticket_id, type, body) values (${eventId}, ${id}, ${decision === 'approve' ? 'ticket.finance_approved' : 'ticket.finance_rejected'}, ${body})`,
    sql`insert into desk_comments (ticket_id, author, body) values (${id}, ${by}, ${decision === 'approve' ? 'Approved by finance.' : `Rejected by finance: ${reason}`})`,
  ])
  return (out[0] as unknown[]).length > 0
}

export async function pendingEvents(ticketId?: string): Promise<{ eventId: string; ticketId: string; body: string }[]> {
  const sql = db()
  const rows = ticketId ? await sql`select event_id, ticket_id, body from desk_outbox where delivered_at is null and ticket_id = ${ticketId} order by created_at` : await sql`select event_id, ticket_id, body from desk_outbox where delivered_at is null order by created_at limit 20`
  return rows.map((r) => ({ eventId: r.event_id as string, ticketId: r.ticket_id as string, body: r.body as string }))
}
export async function markDelivered(eventId: string, hubRequestId: string | null): Promise<void> {
  const sql = db()
  await sql`update desk_outbox set delivered_at = now(), attempts = attempts + 1, last_error = null where event_id = ${eventId}`
  if (hubRequestId) await sql`update desk_tickets set hub_request_id = coalesce(hub_request_id, ${hubRequestId}) from desk_outbox o where o.event_id = ${eventId} and desk_tickets.ticket_id = o.ticket_id`
}
export async function markFailed(eventId: string, error: string): Promise<void> {
  await db()`update desk_outbox set attempts = attempts + 1, last_error = ${error.slice(0, 300)} where event_id = ${eventId}`
}
