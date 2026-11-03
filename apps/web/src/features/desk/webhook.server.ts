import 'server-only'
import { start, resumeHook } from 'workflow/api'
import { DeskWebhookSchema, verifyDeskWebhook, type Region } from '@intake/contracts'
import { sql } from '@/lib/db'
import { normalizeTaxId } from '@/features/intake/normalize'
import { buildPayload } from '@/features/requests/payload'
import { createFromTicket, requesterFor } from '@/features/requests/store.server'
import { requestWorkflow } from '@/features/execution/request.workflow'
import { financeToken, type FinancePayload } from '@/features/execution/desk.steps'

// The service-desk webhook, handled: finance decided in the customer's service desk (docs/SERVICE-DESK-CONTRACT.md
// §5). The route only reads the raw body and calls this.
// Order matters: the signature over the raw body and the timestamp window first (no secret configured refuses all),
// then the body, then the repeat check (answered 200 and not acted on). The event id is recorded only after
// the hub acted, so a delivery that failed halfway is retried by the desk and acted on then.
export async function handleDeskWebhook(raw: string, headers: Headers): Promise<Response> {
  const v = await verifyDeskWebhook(process.env.DESK_WEBHOOK_SECRET, headers.get('x-desk-timestamp'), headers.get('x-desk-signature'), raw, Math.floor(Date.now() / 1000))
  if (!v.ok) return Response.json({ reason: v.reason }, { status: 401 })
  const eventId = headers.get('x-desk-event-id')
  if (!eventId || eventId.length > 100) return Response.json({ reason: 'missing event id' }, { status: 400 })
  const parsed = DeskWebhookSchema.safeParse(JSON.parse(raw || 'null'))
  if (!parsed.success) return Response.json({ reason: 'malformed event' }, { status: 400 })
  const e = parsed.data
  // A repeat is the same event id, or any event for a ticket already acted on: finance decides a ticket once, so the
  // ticket (inside the signed body) is the key. The id header is not signed; a replay under a fresh id is still a repeat.
  const db = sql()
  const seen = await db`select request_id from desk_events where event_id = ${eventId} or ticket_id = ${e.ticket.id} limit 1`
  if (seen[0]) return Response.json({ duplicate: true, requestId: seen[0].request_id ?? null })
  const f: FinancePayload = { decision: e.type === 'ticket.finance_approved' ? 'approve' : 'reject', by: e.decision.by, reason: e.decision.reason, ticketId: e.ticket.id }
  let requestId: string | null = null

  if (e.ticket.hubRequestId) {
    // Raised in the hub: wake the request's Workflow, which is waiting on finance for this exact revision.
    const r = (await db`select current_revision, state_kind, requester_email, region, domain, ticket_id from requests where request_id = ${e.ticket.hubRequestId}`)[0]
    if (!r || r.requester_email !== e.ticket.requesterEmail || r.region !== e.ticket.region || r.domain !== e.ticket.domain) return Response.json({ reason: 'ticket does not match the request' }, { status: 400 })
    if (r.state_kind !== 'awaiting_finance') return Response.json({ reason: `the request is not waiting for finance (${r.state_kind})` }, { status: 409 })
    try {
      await resumeHook<FinancePayload>(financeToken(e.ticket.hubRequestId, r.current_revision as number), f)
    } catch {
      return Response.json({ reason: 'the request is not ready for finance yet; retry' }, { status: 503 })
    }
    requestId = e.ticket.hubRequestId
  } else if (f.decision === 'approve') {
    // Raised in the desk: the hub learns of it now. Same requester rules and same payload builder as the hub form.
    const p = e.ticket.partner
    if (!p) return Response.json({ reason: 'a ticket raised in the desk must carry the partner' }, { status: 400 })
    if (!(await requesterFor(e.ticket.requesterEmail, e.ticket.region as Region))) return Response.json({ reason: 'the requester is not entitled to that region in the hub' }, { status: 400 })
    const n = normalizeTaxId(p.country, p.taxId)
    if (!n.ok) return Response.json({ reason: `tax ID ${n.reason.replace('_', ' ')}` }, { status: 400 })
    const values: Record<string, string> = { legalName: p.legalName, localName: p.localName ?? '', country: p.country, typeCode: p.typeCode ?? '', industry: p.industry ?? '', reasonText: p.reason, reasonReference: e.ticket.id,
      'main.street': p.main.street, 'main.number': p.main.number ?? '', 'main.district': p.main.district ?? '', 'main.city': p.main.city, 'main.regionCode': p.main.regionCode ?? '', 'main.postalCode': p.main.postalCode ?? '', 'main.country': p.country }
    // Built leniently: a gap is the clean check's to name, as an exception for the central team (missingFields).
    const built = buildPayload(e.ticket.domain, e.ticket.region as Region, n.taxId, values, { complete: false })
    if (!built.ok) return Response.json({ reason: `incomplete: ${built.problems.map((x) => x.message).join(' ')}` }, { status: 400 })
    // Two deliveries racing past the check above: the ticket already has its request, so the second is a repeat.
    const existing = await db`select request_id from requests where ticket_id = ${e.ticket.id} limit 1`
    if (existing[0]) return Response.json({ duplicate: true, requestId: existing[0].request_id })
    const created = await createFromTicket({ requesterEmail: e.ticket.requesterEmail, domain: e.ticket.domain, region: e.ticket.region as Region, payload: built.payload, ticketId: e.ticket.id, submittedAt: e.occurredAt })
    const run = await start(requestWorkflow, [created.requestId, created.revision, f])
    await db`update requests set workflow_run_id = ${run.runId} where request_id = ${created.requestId}`
    requestId = created.requestId
  }
  // A ticket raised in the desk and rejected there never becomes a hub request; the event is still recorded once.
  await db`insert into desk_events (event_id, type, ticket_id, request_id) values (${eventId}, ${e.type}, ${e.ticket.id}, ${requestId}) on conflict do nothing`
  return Response.json({ requestId })
}
