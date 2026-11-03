import Link from 'next/link'
import { redirect } from 'next/navigation'
import { listTickets } from '@/features/desk/store'
import { signedIn } from '@/features/desk/session'
import { logoutAction } from '@/features/desk/actions'

const STATUS: Record<string, string> = { open: 'Open', finance_approved: 'Finance approved', finance_rejected: 'Finance rejected', done: 'Done' }

export default async function DeskQueue() {
  if (!(await signedIn())) redirect('/desk/login')
  const tickets = await listTickets()
  return (
    <>
      <h1>New partner tickets</h1>
      <table><thead><tr><th>Ticket</th><th>Partner</th><th>Tax ID</th><th>Region</th><th>From</th><th>Status</th></tr></thead>
        <tbody>{tickets.map((t) => <tr key={t.id}><td><Link href={`/desk/tickets/${t.id}`}>{t.id}</Link></td><td>{t.summary.legalName}<div className="muted">{t.domain} · {t.requesterEmail}</div></td><td>{t.summary.taxId}</td><td>{t.region}</td><td>{t.source === 'hub' ? 'Partner Hub' : 'Desk'}</td><td><span className="tag">{STATUS[t.status]}</span></td></tr>)}</tbody>
      </table>
      {tickets.length === 0 ? <p className="muted">No tickets yet.</p> : null}
      <form action={logoutAction} style={{ marginTop: 16 }}><button type="submit" className="reject">Sign out</button></form>
    </>
  )
}
