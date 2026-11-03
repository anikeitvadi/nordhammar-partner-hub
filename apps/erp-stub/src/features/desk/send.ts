import { signDeskWebhook } from '@intake/contracts'
import { markDelivered, markFailed, pendingEvents } from './store'

// Delivers the desk's undelivered events to the hub, signed. At least once: an event stays in the outbox until the hub
// answers 2xx, and the hub's event-id store turns a repeat into a no-op. Called right after a decision and from Resend.
const HUB_WEBHOOK_URL = process.env.DESK_WEBHOOK_URL ?? 'https://nordhammar-partner-hub.vercel.app/api/webhooks/service-desk'
// Where the hub lives, so a ticket can link back to its request.
export const HUB_ORIGIN = new URL(HUB_WEBHOOK_URL).origin

export async function deliverPending(ticketId?: string): Promise<{ delivered: number; failed: number }> {
  const secret = process.env.DESK_WEBHOOK_SECRET
  let delivered = 0, failed = 0
  for (const e of await pendingEvents(ticketId)) {
    if (!secret) { await markFailed(e.eventId, 'DESK_WEBHOOK_SECRET is not configured on the desk'); failed++; continue }
    const ts = String(Math.floor(Date.now() / 1000))
    try {
      const res = await fetch(HUB_WEBHOOK_URL, { method: 'POST', headers: { 'content-type': 'application/json', 'x-desk-timestamp': ts, 'x-desk-signature': await signDeskWebhook(secret, ts, e.body), 'x-desk-event-id': e.eventId }, body: e.body, cache: 'no-store', signal: AbortSignal.timeout(10_000) })
      const out = (await res.json().catch(() => ({}))) as { requestId?: string; reason?: string }
      if (res.ok) { await markDelivered(e.eventId, out.requestId ?? null); delivered++ }
      else { await markFailed(e.eventId, `hub answered ${res.status}${out.reason ? `: ${out.reason}` : ''}`); failed++ }
    } catch (err) {
      await markFailed(e.eventId, err instanceof Error ? err.message : 'unreachable'); failed++
    }
  }
  return { delivered, failed }
}
