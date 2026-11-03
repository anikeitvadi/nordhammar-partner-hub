import { notFound } from 'next/navigation'
import { connection } from 'next/server'
import { getTicket } from '@/features/desk/store'
import { decideAction, resendAction } from '@/features/desk/actions'
import { HUB_ORIGIN } from '@/features/desk/send'

const EVENT: Record<string, string> = { 'ticket.finance_approved': 'Finance approved', 'ticket.finance_rejected': 'Finance rejected' }
// The page is dynamic (connection() above), so reading the clock per request is the intent.
const decidedWithin = (iso: string | null, ms: number) => (iso ? Date.now() - new Date(iso).getTime() < ms : false)
const fmt = (iso: string) => new Date(iso).toLocaleString('en-GB', { timeZone: 'UTC', dateStyle: 'medium', timeStyle: 'short' }) + ' UTC'

export default async function DeskTicket({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  await connection() // live data on every view, now that no sign-in makes the page dynamic
  const [{ id }, { error }] = await Promise.all([params, searchParams])
  const t = await getTicket(id)
  if (!t) notFound()
  const { ticket, comments, outbox } = t
  const undelivered = outbox.filter((o) => !o.deliveredAt)
  // After finance decides, the ticket leads with where the request went and links back to it. Until the hub's outcome
  // comment arrives (a second or two), the page refreshes itself, so the number shows up without anyone reloading.
  const hubSays = [...comments].reverse().find((c) => c.author === 'Nordhammar Partner Hub' && /Created|stopped|declined|central/i.test(c.body))
  // Only an approval gets an outcome back (a rejection is final here), and never for more than two minutes.
  const recent = decidedWithin(ticket.decidedAt, 120_000)
  const waitingOnHub = ticket.status === 'finance_approved' && ticket.hubRequestId && !hubSays && recent
  return (
    <>
      {waitingOnHub ? <meta httpEquiv="refresh" content="2" /> : null}
      <h1>{ticket.id}: {ticket.summary.legalName}</h1>
      {ticket.status !== 'open' && ticket.hubRequestId ? (
        <div className="box next">
          <strong>{ticket.status === 'finance_approved' ? 'Approved. The Partner Hub has it now.' : 'Rejected. The Partner Hub has been told.'}</strong>{' '}
          {hubSays ? hubSays.body : ticket.status === 'finance_approved' ? 'It is checking the request again; the outcome appears here in a moment.' : null}
          <p style={{ margin: '8px 0 0' }}><a href={`${HUB_ORIGIN}/requests/${ticket.hubRequestId}`}>Back to request {ticket.hubRequestId} in the Partner Hub →</a></p>
        </div>
      ) : null}
      <div className="box">
        <div className="grid">
          <div><label>Status</label>{ticket.status.replace('_', ' ')}</div>
          <div><label>Raised from</label>{ticket.source === 'hub' ? 'Partner Hub, request ' : `Desk${ticket.hubRequestId ? ', now hub request ' : ''}`}{ticket.hubRequestId ? <a href={`${HUB_ORIGIN}/requests/${ticket.hubRequestId}`}>{ticket.hubRequestId}</a> : null}</div>
          <div><label>Requester</label>{ticket.requesterEmail}</div>
          <div><label>Region, type</label>{ticket.region} · {ticket.domain}</div>
          <div><label>Tax ID</label>{ticket.summary.taxId} ({ticket.summary.country})</div>
          {ticket.partner ? <div><label>Address</label>{ticket.partner.main.street} {ticket.partner.main.number ?? ''}, {ticket.partner.main.city}</div> : null}
          <div><label>Why it is needed</label>{ticket.summary.reason ?? ticket.partner?.reason ?? <span className="muted">not given</span>}</div>
          <div><label>Contact at the partner</label>{ticket.summary.contactName || ticket.summary.contactEmail ? [ticket.summary.contactName, ticket.summary.contactEmail].filter(Boolean).join(', ') : <span className="muted">not given</span>}</div>
          {ticket.decidedBy ? <div><label>Decided</label>{ticket.decidedBy}{ticket.decidedAt ? `, ${fmt(ticket.decidedAt)}` : ''}{ticket.decisionReason ? `: ${ticket.decisionReason}` : ''}</div> : null}
        </div>
      </div>
      {ticket.status === 'open' ? (
        <div className="box">
          <form action={decideAction}>
            <input type="hidden" name="ticketId" value={ticket.id} />
            <label htmlFor="reason">Reason (required to reject)</label>
            <input id="reason" name="reason" placeholder="Credit check, payment terms, anything finance needs to say" />
            {error === 'reason' ? <p className="err">A rejection needs a reason.</p> : null}
            <p style={{ display: 'flex', gap: 8 }}><button type="submit" name="decision" value="approve">Approve as finance</button><button type="submit" name="decision" value="reject" className="reject">Reject</button></p>
          </form>
        </div>
      ) : null}
      <div className="box">
        <strong>Activity</strong>
        {comments.length === 0 ? <p className="muted">Nothing yet.</p> : <table style={{ marginTop: 8 }}><tbody>{comments.map((c, i) => <tr key={i}><td style={{ width: 180 }} className="muted">{fmt(c.at)}</td><td style={{ width: 200 }}>{c.author}</td><td>{c.body}</td></tr>)}</tbody></table>}
      </div>
      {outbox.length ? (
        <div className="box">
          <strong>Sent to the Partner Hub</strong>
          <table style={{ marginTop: 8 }}><tbody>{outbox.map((o) => <tr key={o.eventId}><td>{EVENT[o.type] ?? o.type}</td><td>{o.deliveredAt ? `delivered ${fmt(o.deliveredAt)}` : <span className="err">not delivered{o.lastError ? `: ${o.lastError}` : ''}</span>}</td><td className="muted">{o.attempts} {o.attempts === 1 ? 'attempt' : 'attempts'}</td></tr>)}</tbody></table>
          {undelivered.length ? <form action={resendAction} style={{ marginTop: 8 }}><input type="hidden" name="ticketId" value={ticket.id} /><button type="submit">Resend</button></form> : null}
        </div>
      ) : null}
    </>
  )
}
