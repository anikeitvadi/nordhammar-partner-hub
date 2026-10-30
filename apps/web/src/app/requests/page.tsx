import Link from 'next/link'
import { requirePrincipal } from '@/features/auth/principal.server'
import { listMyRequests } from '@/features/requests/store.server'
import { StatusBadge } from '@/features/requests/status'

export default async function MyRequestsPage() {
  const principal = await requirePrincipal()
  const rows = await listMyRequests(principal)
  return (
    <section>
      <h1>My requests</h1>
      {rows.length === 0 ? <p>None yet. <Link href="/intake/new">Request a new customer</Link>.</p> : (
        <table className="results"><thead><tr><th>Request</th><th>Customer</th><th>Region</th><th>Status</th><th>Updated</th></tr></thead>
          <tbody>{rows.map((r) => <tr key={r.requestId}><td><Link href={`/requests/${r.requestId}`}>{r.requestId}</Link></td><td>{r.legalName}</td><td>{r.region}</td><td><StatusBadge state={r.state} /></td><td>{new Date(r.updatedAt).toLocaleString()}</td></tr>)}</tbody></table>
      )}
    </section>
  )
}
