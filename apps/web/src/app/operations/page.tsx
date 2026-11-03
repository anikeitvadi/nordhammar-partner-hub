import type { Metadata } from 'next'
import Link from 'next/link'
import { requirePrincipal } from '@/features/auth/principal.server'
import { isOperator, listAttention } from '@/features/execution/operator.server'
import { armLostResponseAction, reconcileAction, recoverAction, retryDeliveryAction, runLoadNowAction, setAutoApproveAction } from '@/features/execution/actions'
import { autoApproveSetting } from '@/features/settings/settings.server'
import { loadStatus } from '@/features/customers/load.server'
import { LocalTime } from '@/features/ui/time.client'
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
    case 'load_started': return 'Hub load started. It reads the golden-record feed from where the last load stopped; the line below shows the result when it finishes, usually within a minute.'
    case 'load_running': return 'A hub load is already running. It will finish on its own.'
    case 'auto_on': return 'Automatic approval is on: a finance-approved request that passes every check is created without a person.'
    case 'auto_off': return 'Automatic approval is off: every finance-approved request now waits for the central team.'
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
  const [rows, demo, lost, load, auto] = await Promise.all([listAttention(principal), demoControls(), erpLostResponse(), loadStatus(), autoApproveSetting()])
  const text = message(msg)
  return (
    <section>
      <h1>Operations</h1>
      {text ? <p className="panel rise" role="status">{text}</p> : null}
      <form action={runLoadNowAction} className="row">
        <SubmitButton pendingLabel="Starting…" disabled={!!load.runningSince}>Run the hub load now</SubmitButton>
        <span className="muted">
          {load.runningSince ? <>Running since <LocalTime iso={load.runningSince} />. </> : null}
          Nightly at 08:00 UTC (Vercel Cron), or now. Reads the integration platform&apos;s golden records since the last load and makes new partners searchable.
          {load.lastRunAt ? <> Last load <LocalTime iso={load.lastRunAt} />{load.lastTrigger === 'cron' ? ' (nightly)' : load.lastTrigger === 'manual' ? ' (run now)' : ''}: {load.lastCount ?? 0} {load.lastCount === 1 ? 'record' : 'records'}, {load.lastLinked ?? 0} {load.lastLinked === 1 ? 'request' : 'requests'} linked.</> : ' No load has run yet.'}
        </span>
      </form>
      <form action={setAutoApproveAction} className="row">
        <input type="hidden" name="on" value={auto.on ? 'false' : 'true'} />
        <SubmitButton pendingLabel="Saving…" className="secondary">{auto.on ? 'Turn automatic approval off' : 'Turn automatic approval on'}</SubmitButton>
        <span className="muted">Automatic approval is <strong>{auto.on ? 'on' : 'off'}</strong>{auto.updatedBy ? <> (changed by {auto.updatedBy}{auto.updatedAt ? <>, <LocalTime iso={auto.updatedAt} /></> : null})</> : null}. On: a request finance approved that passes every check is created without a person. Off: every one comes to you.</span>
      </form>
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
