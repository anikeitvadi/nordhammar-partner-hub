'use server'
import { redirect } from 'next/navigation'
import { DeskPartnerSchema, REGIONS, type DeskWebhook, type Domain, type Region } from '@intake/contracts'
import { decide, openTicket } from './store'
import { deliverPending } from './send'
import { FINANCE_USER, signIn, signOut } from './session'

// The stand-in desk has no sign-in, on purpose: whoever opens a ticket from the demo acts as finance. The real desk
// signs finance in; the hub never trusted this screen anyway, only the signed webhook it sends.
async function guard() {}
const str = (f: FormData, k: string) => String(f.get(k) ?? '').trim()

// A ticket link from the hub lands on sign-in first; signing in goes on to that ticket, never off the desk.
export async function loginAction(formData: FormData): Promise<void> {
  const next = str(formData, 'next')
  const back = /^\/desk(\/[\w-]+)*$/.test(next) ? next : '/desk'
  if (!(await signIn(str(formData, 'password')))) redirect(`/desk/login?error=1${back !== '/desk' ? `&next=${encodeURIComponent(back)}` : ''}`)
  redirect(back)
}
export async function logoutAction(): Promise<void> { await signOut(); redirect('/desk/login') }

// Finance decides. The decision, its comment and the webhook event are one transaction (store.decide); delivery to the
// hub happens after, and a failed delivery stays in the outbox for Resend.
export async function decideAction(formData: FormData): Promise<void> {
  await guard()
  const id = str(formData, 'ticketId')
  const decision = str(formData, 'decision') === 'reject' ? 'reject' : 'approve'
  const reason = str(formData, 'reason') || null
  if (decision === 'reject' && !reason) redirect(`/desk/tickets/${id}?error=reason`)
  const eventId = crypto.randomUUID()
  const ok = await decide(id, decision, FINANCE_USER, reason, eventId, (t) => JSON.stringify({
    type: decision === 'approve' ? 'ticket.finance_approved' : 'ticket.finance_rejected',
    occurredAt: new Date().toISOString(),
    ticket: { id: t.id, hubRequestId: t.hubRequestId, requesterEmail: t.requesterEmail, region: t.region, domain: t.domain, partner: t.source === 'desk' ? t.partner : null },
    decision: { by: FINANCE_USER, reason },
  } satisfies DeskWebhook))
  if (ok) await deliverPending(id)
  redirect(`/desk/tickets/${id}`)
}

export async function resendAction(formData: FormData): Promise<void> {
  await guard()
  const id = str(formData, 'ticketId')
  await deliverPending(id)
  redirect(`/desk/tickets/${id}`)
}

// Ticket first: someone raises the request here, in the desk, without the hub's duplicate check. The fields are the
// ones the hub form collects, so the hub can build the same request when finance approves.
export async function newTicketAction(formData: FormData): Promise<void> {
  await guard()
  const region = str(formData, 'region') as Region
  const domain = (str(formData, 'domain') === 'supplier' ? 'supplier' : 'customer') as Domain
  const n = (k: string) => str(formData, k) || null
  const partner = DeskPartnerSchema.safeParse({
    legalName: str(formData, 'legalName'), localName: n('localName'), country: str(formData, 'country').toUpperCase(), taxId: str(formData, 'taxId'),
    typeCode: n('typeCode'), industry: n('industry'), reason: str(formData, 'reason'),
    main: { street: str(formData, 'street'), number: n('number'), district: n('district'), city: str(formData, 'city'), regionCode: n('regionCode'), postalCode: n('postalCode') },
  })
  const requesterEmail = str(formData, 'requesterEmail')
  if (!partner.success || !REGIONS.includes(region) || !requesterEmail || !partner.data.main.street || !partner.data.main.city) redirect('/desk/new?error=1')
  const id = await openTicket({ source: 'desk', hubRequestId: null, hubRevision: null, requesterEmail, region, domain, summary: { legalName: partner.data.legalName, taxId: partner.data.taxId, country: partner.data.country }, partner: partner.data })
  redirect(`/desk/tickets/${id}`)
}
