import type { Metadata } from 'next'
import Link from 'next/link'
import { requirePrincipal } from '@/features/auth/principal.server'
import { listMyRequests } from '@/features/requests/store.server'
import { StatusBadge } from '@/features/requests/status'
import { LocalTime } from '@/features/ui/time.client'

export const metadata: Metadata = { title: 'My requests' }

export default async function MyRequestsPage() {
  const principal = await requirePrincipal()
  const rows = await listMyRequests(principal)
  return (
    <section>
      <h1>My requests</h1>
      {rows.length === 0 ? <p>None yet. <Link href="/intake/new?domain=customer">Request a customer</Link> or <Link href="/intake/new?domain=supplier">a supplier</Link>.</p> : (
        <table className="results"><thead><tr><th>Request</th><th>Name</th><th className="col-secondary">Type</th><th className="col-secondary">Region</th><th>Status</th><th className="col-secondary">Updated</th></tr></thead>
          <tbody>{rows.map((r) => <tr key={r.requestId}><td><Link href={`/requests/${r.requestId}`}><code>{r.requestId}</code></Link></td><td>{r.legalName}</td><td className="col-secondary">{r.domain === 'customer' ? 'Customer' : 'Supplier'}</td><td className="col-secondary">{r.region}</td><td><StatusBadge state={r.state} /></td><td className="col-secondary"><LocalTime iso={r.updatedAt} relative /></td></tr>)}</tbody></table>
      )}
    </section>
  )
}
