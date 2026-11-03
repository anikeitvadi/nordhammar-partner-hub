import type { Metadata } from 'next'
import Link from 'next/link'
import { requirePrincipal } from '@/features/auth/principal.server'
import { isCentral } from '@/features/auth/scope'
import { listQueue } from '@/features/requests/store.server'
import { StatusBadge } from '@/features/requests/status'
import { LocalTime } from '@/features/ui/time.client'

export const metadata: Metadata = { title: 'Reviews' }

// One queue, all regions, oldest first. The two shifts are coverage, not ownership.
export default async function ReviewQueuePage() {
  const principal = await requirePrincipal()
  if (!isCentral(principal)) return <section className="narrow card" style={{ marginTop: 48 }}><h1>Reviews</h1><p>The review queue belongs to the central master data team.</p></section>
  const rows = await listQueue(principal)
  return (
    <section>
      <h1>Reviews</h1>
      <p className="muted count" role="status">{rows.length === 0 ? 'Nothing waiting.' : `${rows.length} waiting, oldest first.`}</p>
      {rows.length === 0 ? null : (
        <table className="results"><thead><tr><th>Request</th><th>Name</th><th className="col-secondary">Type</th><th className="col-secondary">Region</th><th className="col-secondary">Requester</th><th>Status</th><th className="col-secondary">Waiting since</th></tr></thead>
          <tbody>{rows.map((r) => <tr key={r.requestId}><td><Link href={`/reviews/${r.requestId}`}><code>{r.requestId}</code></Link></td><td>{r.legalName}</td><td className="col-secondary">{r.domain === 'customer' ? 'Customer' : 'Supplier'}</td><td className="col-secondary">{r.region}</td><td className="col-secondary">{r.requesterEmail}</td><td><StatusBadge state={r.state} /></td><td className="col-secondary"><LocalTime iso={r.createdAt} relative /></td></tr>)}</tbody></table>
      )}
    </section>
  )
}
