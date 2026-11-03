import { NextResponse } from 'next/server'
import { z } from 'zod'
import { DOMAINS, REGIONS } from '@intake/contracts'
import { callerFromRequest } from '@/features/auth/caller'
import { openTicket } from '@/features/desk/store'

// POST /desk/v1/tickets: the hub opens a ticket for finance when a request is submitted in the hub. Same identity
// check as the integration API (the hub's Vercel OIDC token). Repeatable: one ticket per request revision. The reason
// and the contact are what finance reads before approving (docs/FORM-FIELD-INVENTORY.md, finding 1); optional, so a hub
// that does not send them yet still opens a ticket.
const Body = z.object({ hubRequestId: z.string(), hubRevision: z.number().int(), requesterEmail: z.string(), region: z.enum(REGIONS), domain: z.enum(DOMAINS), summary: z.object({ legalName: z.string(), taxId: z.string(), country: z.string(), reason: z.string().nullish(), contactName: z.string().nullish(), contactEmail: z.string().nullish() }) })
export async function POST(req: Request) {
  if (!(await callerFromRequest(req))) return NextResponse.json({ reason: 'unauthorized' }, { status: 401 })
  const b = Body.safeParse(await req.json().catch(() => null))
  if (!b.success) return NextResponse.json({ reason: 'malformed' }, { status: 400 })
  const id = await openTicket({ source: 'hub', hubRequestId: b.data.hubRequestId, hubRevision: b.data.hubRevision, requesterEmail: b.data.requesterEmail, region: b.data.region, domain: b.data.domain, summary: b.data.summary, partner: null })
  return NextResponse.json({ id }, { status: 201 })
}
