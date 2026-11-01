import Link from 'next/link'
import { requirePrincipal } from '@/features/auth/principal.server'
import { isOperator, listAttention } from '@/features/execution/operator.server'
import { armLostResponseAction, dailyLoadAction, reconcileAction, recoverAction, retryDeliveryAction } from '@/features/execution/actions'
import { StatusBadge } from '@/features/requests/status'

// Everything here is a read or a replay-safe operation. No path on this page creates a customer.
export default async function OperationsPage({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  const principal = await requirePrincipal()
  if (!isOperator(principal)) return <section><h1>Operations</h1><p>Your role does not include operations.</p></section>
  const { msg } = await searchParams
  const rows = await listAttention(principal)
  return (
    <section>
      <h1>Operations</h1>
      {msg ? <p className="panel">{msg}</p> : null}
      <form action={dailyLoadAction} className="row"><button type="submit">Run the daily hub load</button><span className="muted">Loads ERP-created partners into the hub and clears the search cache for their regions.</span></form>
      {process.env.DEMO_CONTROLS_ENABLED === 'true' ? <form action={armLostResponseAction} className="row"><button type="submit" className="secondary">Demo: drop the next ERP response</button><span className="muted">The ERP commits the create and we never hear back, once. Watch the retry replay the same number.</span></form> : null}
      <h2>Needs attention · {rows.length}</h2>
      {rows.length === 0 ? <p>Nothing stopped, nothing pending.</p> : (
        <table className="results"><thead><tr><th>Request</th><th>Name</th><th>Domain</th><th>Region</th><th>State</th><th>Pending deliveries</th><th>Actions</th></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.requestId}>
              <td><Link href={`/requests/${r.requestId}`}>{r.requestId}</Link></td><td>{r.legalName}</td><td>{r.domain}</td><td>{r.region}</td>
              <td><StatusBadge state={r.state} />{r.state.kind === 'stopped' ? <div className="muted">{r.state.category}, effect {r.state.effect === 'unknown' ? 'unknown' : 'none'}: {r.state.reason}</div> : null}</td>
              <td>{r.pendingDeliveries.length ? r.pendingDeliveries.map((d, i) => <div key={i}>{d.kind} · {d.attempts} attempt(s){d.lastError ? ` · ${d.lastError}` : ''}</div>) : '—'}</td>
              <td className="actions">
                {r.pendingDeliveries.length ? <form action={retryDeliveryAction} className="inline"><input type="hidden" name="requestId" value={r.requestId} /><button type="submit">Retry delivery</button></form> : null}
                {r.state.kind === 'stopped' && r.state.effect === 'unknown' ? <form action={reconcileAction} className="inline"><input type="hidden" name="requestId" value={r.requestId} /><button type="submit">Reconcile with ERP</button></form> : null}
                {r.state.kind === 'stopped' && r.state.effect === 'no_effect' ? <form action={recoverAction} className="inline"><input type="hidden" name="requestId" value={r.requestId} /><button type="submit">Return to requester</button></form> : null}
              </td>
            </tr>
          ))}</tbody></table>
      )}
    </section>
  )
}
