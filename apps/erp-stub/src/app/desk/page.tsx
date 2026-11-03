import Link from 'next/link'
import { connection } from 'next/server'
import { listTickets } from '@/features/desk/store'

const STATUS: Record<string, string> = { open: 'Open', finance_approved: 'Finance approved', finance_rejected: 'Finance rejected', done: 'Done' }

export default async function DeskQueue() {
  // Read per request: the queue is live data, and with no sign-in nothing else marks this page dynamic.
  await connection()
  const tickets = await listTickets()
  return (
    <>
      <h1>New partner tickets</h1>
      <div className="scroll"><table><thead><tr><th>Ticket</th><th>Partner</th><th>Tax ID</th><th>Region</th><th>From</th><th>Status</th></tr></thead>
        <tbody>{tickets.map((t) => <tr key={t.id}><td><Link href={`/desk/tickets/${t.id}`}>{t.id}</Link></td><td>{t.summary.legalName}<div className="muted">{t.domain} · {t.requesterEmail}</div></td><td>{t.summary.taxId}</td><td>{t.region}</td><td>{t.source === 'hub' ? 'Partner Hub' : 'Desk'}</td><td><span className="tag">{STATUS[t.status]}</span></td></tr>)}</tbody>
      </table></div>
      {tickets.length === 0 ? <p className="muted">No tickets yet.</p> : null}
    </>
  )
}
