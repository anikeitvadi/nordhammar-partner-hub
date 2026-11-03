import type { Metadata } from 'next'
import Link from 'next/link'
import { requirePrincipal } from '@/features/auth/principal.server'
import { isCentral, workRegions } from '@/features/auth/scope'
import { listRequests } from '@/features/requests/store.server'
import { StatusBadge } from '@/features/requests/status'
import { LocalTime } from '@/features/ui/time.client'

export const metadata: Metadata = { title: 'Requests' }

// Requests, not "my requests" (review log §7): a regional user sees their own; the central team sees every one, most
// recently moved first. The row says where it came from and, once the ERP answered, its number.
export default async function RequestsPage() {
  const principal = await requirePrincipal()
  const all = isCentral(principal)
  const rows = await listRequests(principal)
  const region = workRegions(principal)[0] ?? 'BR'
  return (
    <section>
      <h1>Requests</h1>
      <p className="muted count" role="status">{all ? `Every request, every region: the latest ${rows.length}, most recently moved first.` : rows.length ? `Your ${rows.length} request${rows.length === 1 ? '' : 's'}, most recently moved first.` : ''}</p>
      {rows.length === 0 ? (
        <p className="panel">None yet. A request is a new customer or supplier the hub does not have: you check the hub, fill one form, finance approves it in the service desk, and the ERP number comes back here. <Link href={`/intake/new?domain=customer&region=${region}`}>Request a customer</Link> or <Link href={`/intake/new?domain=supplier&region=${region}`}>a supplier</Link>.</p>
      ) : (
        <table className="results"><thead><tr><th scope="col" className="col-secondary">Request</th><th scope="col">Name</th><th scope="col" className="col-secondary">Type</th><th scope="col" className="col-secondary">Region</th><th scope="col" className="col-secondary">Came in</th><th scope="col">Status</th><th scope="col" className="col-secondary">ERP number</th>{all ? <th scope="col" className="col-secondary">Requester</th> : null}<th scope="col" className="col-secondary">Moved</th></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.requestId}>
              {/* On a phone the id column is hidden (it alone overflowed 390 px), so the name carries the link. */}
              <td className="col-secondary"><Link href={`/requests/${r.requestId}`}><code>{r.requestId}</code></Link></td><td><Link href={`/requests/${r.requestId}`}>{r.legalName}</Link></td>
              <td className="col-secondary">{r.domain === 'customer' ? 'Customer' : 'Supplier'}</td><td className="col-secondary">{r.region}</td>
              <td className="col-secondary">{r.source === 'desk' ? `Service desk, ${r.ticketId}` : r.ticketId ? `Hub form, ${r.ticketId}` : 'Hub form'}</td>
              <td><StatusBadge state={r.state} /></td>
              <td className="col-secondary">{r.erpNumber ? <code>{r.erpNumber}</code> : null}</td>
              {all ? <td className="col-secondary">{r.requesterEmail}</td> : null}
              <td className="col-secondary"><LocalTime iso={r.updatedAt} relative /></td>
            </tr>
          ))}</tbody></table>
      )}
    </section>
  )
}
