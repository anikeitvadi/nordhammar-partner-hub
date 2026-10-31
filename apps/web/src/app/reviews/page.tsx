import Link from 'next/link'
import { requirePrincipal } from '@/features/auth/principal.server'
import { listQueue } from '@/features/requests/store.server'
import { StatusBadge } from '@/features/requests/status'

// One queue, all regions, oldest first. The two shifts are coverage, not ownership.
export default async function ReviewQueuePage() {
  const principal = await requirePrincipal()
  if (!(principal.globalIdentity && (principal.role === 'reviewer' || principal.role === 'operator'))) return <section><h1>Reviews</h1><p>Your role does not include the review queue.</p></section>
  const rows = await listQueue(principal)
  return (
    <section>
      <h1>Reviews · {rows.length} waiting</h1>
      {rows.length === 0 ? <p>Queue is empty.</p> : (
        <table className="results"><thead><tr><th>Request</th><th>Name</th><th>Domain</th><th>Region</th><th>Requester</th><th>Status</th><th>Waiting since</th></tr></thead>
          <tbody>{rows.map((r) => <tr key={r.requestId}><td><Link href={`/reviews/${r.requestId}`}>{r.requestId}</Link></td><td>{r.legalName}</td><td>{r.domain}</td><td>{r.region}</td><td>{r.requesterEmail}</td><td><StatusBadge state={r.state} /></td><td>{new Date(r.createdAt).toLocaleString()}</td></tr>)}</tbody></table>
      )}
    </section>
  )
}
