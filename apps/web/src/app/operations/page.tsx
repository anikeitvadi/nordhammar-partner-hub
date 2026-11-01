import type { Metadata } from 'next'
import Link from 'next/link'
import { requirePrincipal } from '@/features/auth/principal.server'
import { isOperator, listAttention } from '@/features/execution/operator.server'
import { armLostResponseAction, dailyLoadAction, reconcileAction, recoverAction, retryDeliveryAction } from '@/features/execution/actions'
import { StatusBadge } from '@/features/requests/status'
import { SubmitButton } from '@/features/ui/submit-button.client'
import { demoControls, erpLostResponse } from '@/features/flags/flags'

export const metadata: Metadata = { title: 'Operations' }

// Result messages are codes mapped to fixed copy, so the URL cannot put arbitrary text in the status line.
function message(msg: string | undefined): string | null {
  if (!msg) return null
  const [code, a, b] = msg.split(':')
  const n = (v: string | undefined) => (v && /^\d+$/.test(v) ? Number(v) : 0)
  switch (code) {
    case 'loaded': return n(a) === 0 ? 'Hub load ran: nothing new to load.' : `Hub load ran: ${n(a)} ${n(a) === 1 ? 'record' : 'records'} loaded into the hub; search cache cleared for ${b ? b.replace(/[^A-Z,]/g, '').split(',').filter(Boolean).join(', ') || 'the affected regions' : 'the affected regions'}.`
    case 'delivered': return `Delivery retried: ${n(a)} delivered, ${n(b)} failed.`
    case 'reconciled': return a === 'created' ? 'Checked with the ERP: it had been created. The request is now Created.' : a === 'no_effect' ? 'Checked with the ERP: nothing was created. The request can be returned to the requester.' : 'Nothing to reconcile for that request.'
    case 'recovered': return 'Returned to the requester as a draft.'
    case 'armed': return 'Demo fault armed: the next ERP create will lose its response once. Approve a request and watch the retry.'
    case 'arm_failed': return 'Could not arm the demo fault; the ERP stand-in refused.'
    case 'not_operator': return 'Your role cannot do that.'
    case 'demo_off': return 'Demo controls are off in this environment.'
    case 'noop': return 'Nothing to do for that request.'
    default: return 'Done.'
  }
}

const STOP: Record<string, string> = { transport: 'the ERP did not answer', business: 'the ERP refused it', auth: 'the ERP refused our credential', conflict: 'the ERP already had a different version', dependency: 'a dependency was unavailable' }

// Everything here is a read or a replay-safe operation. No path on this page creates a partner.
export default async function OperationsPage({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  const principal = await requirePrincipal()
  if (!isOperator(principal)) return <section className="narrow card" style={{ marginTop: 48 }}><h1>Operations</h1><p>Your role does not include operations.</p></section>
  const { msg } = await searchParams
  const [rows, demo, lost] = await Promise.all([listAttention(principal), demoControls(), erpLostResponse()])
  const text = message(msg)
  return (
    <section>
      <h1>Operations</h1>
      {text ? <p className="panel rise" role="status">{text}</p> : null}
      <form action={dailyLoadAction} className="row"><SubmitButton pendingLabel="Loading…">Run the daily hub load</SubmitButton><span className="muted">Loads ERP-created partners into the hub and clears the search cache for their regions.</span></form>
      {demo ? <form action={armLostResponseAction} className="row"><SubmitButton pendingLabel="Arming…" className="secondary">Demo: drop the next ERP response</SubmitButton><span className="muted">The ERP commits the create and we never hear back, once. Watch the retry replay the same number.{lost ? ' The erp-lost-response flag is on: every approval arms this by itself.' : ''}</span></form> : null}
      <h2>Needs attention</h2>
      <p className="muted count" role="status">{rows.length === 0 ? 'Nothing stopped, nothing pending.' : `${rows.length} ${rows.length === 1 ? 'request needs' : 'requests need'} a look.`}</p>
      {rows.length === 0 ? null : (
        <table className="results"><thead><tr><th>Request</th><th>Name</th><th className="col-secondary">Type</th><th className="col-secondary">Region</th><th>State</th><th className="col-secondary">Pending deliveries</th><th>Actions</th></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.requestId}>
              <td><Link href={`/requests/${r.requestId}`}><code>{r.requestId}</code></Link></td><td>{r.legalName}</td><td className="col-secondary">{r.domain === 'customer' ? 'Customer' : 'Supplier'}</td><td className="col-secondary">{r.region}</td>
              <td><StatusBadge state={r.state} />{r.state.kind === 'stopped' ? <div className="muted small">{STOP[r.state.category] ?? r.state.category}; {r.state.effect === 'unknown' ? 'not yet known whether it was created' : 'nothing was created'}</div> : null}</td>
              <td className="col-secondary">{r.pendingDeliveries.length ? r.pendingDeliveries.map((d, i) => <div key={i}>{d.kind} · {d.attempts} attempt(s){d.lastError ? ` · ${d.lastError}` : ''}</div>) : '—'}</td>
              <td className="actions">
                {r.pendingDeliveries.length ? <form action={retryDeliveryAction} className="inline"><input type="hidden" name="requestId" value={r.requestId} /><SubmitButton pendingLabel="Retrying…">Retry delivery</SubmitButton></form> : null}
                {r.state.kind === 'stopped' && r.state.effect === 'unknown' ? <form action={reconcileAction} className="inline"><input type="hidden" name="requestId" value={r.requestId} /><SubmitButton pendingLabel="Checking…">Check with the ERP</SubmitButton></form> : null}
                {r.state.kind === 'stopped' && r.state.effect === 'no_effect' ? <form action={recoverAction} className="inline"><input type="hidden" name="requestId" value={r.requestId} /><SubmitButton pendingLabel="Returning…" confirm={`Return ${r.legalName} to the requester as a draft?`}>Return to requester</SubmitButton></form> : null}
              </td>
            </tr>
          ))}</tbody></table>
      )}
    </section>
  )
}
