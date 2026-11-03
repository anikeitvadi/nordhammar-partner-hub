import { notFound, redirect } from 'next/navigation'
import { getTicket } from '@/features/desk/store'
import { signedIn } from '@/features/desk/session'
import { decideAction, resendAction } from '@/features/desk/actions'
import { HUB_ORIGIN } from '@/features/desk/send'

const fmt = (iso: string) => new Date(iso).toLocaleString('en-GB', { timeZone: 'UTC', dateStyle: 'medium', timeStyle: 'short' }) + ' UTC'

export default async function DeskTicket({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const [{ id }, { error }] = await Promise.all([params, searchParams])
  if (!(await signedIn())) redirect(`/desk/login?next=${encodeURIComponent(`/desk/tickets/${id}`)}`)
  const t = await getTicket(id)
  if (!t) notFound()
  const { ticket, comments, outbox } = t
  const undelivered = outbox.filter((o) => !o.deliveredAt)
  return (
    <>
      <h1>{ticket.id}: {ticket.summary.legalName}</h1>
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
          <table style={{ marginTop: 8 }}><tbody>{outbox.map((o) => <tr key={o.eventId}><td>{o.type}</td><td>{o.deliveredAt ? `delivered ${fmt(o.deliveredAt)}` : <span className="err">not delivered{o.lastError ? `: ${o.lastError}` : ''}</span>}</td><td className="muted">{o.attempts} {o.attempts === 1 ? 'attempt' : 'attempts'}</td></tr>)}</tbody></table>
          {undelivered.length ? <form action={resendAction} style={{ marginTop: 8 }}><input type="hidden" name="ticketId" value={ticket.id} /><button type="submit">Resend</button></form> : null}
        </div>
      ) : null}
    </>
  )
}
