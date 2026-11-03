import type { Metadata } from 'next'
import Link from 'next/link'
import { requirePrincipal } from '@/features/auth/principal.server'
import { isCentral } from '@/features/auth/scope'
import { listQueue } from '@/features/requests/store.server'
import { listAttention } from '@/features/execution/operator.server'
import { armLostResponseAction, reconcileAction, recoverAction, retryDeliveryAction, runLoadNowAction, setAutoApproveAction } from '@/features/execution/actions'
import { message, STOP } from '@/features/execution/messages'
import { autoApproveSetting } from '@/features/settings/settings.server'
import { loadStatus } from '@/features/customers/load.server'
import { demoControls, erpLostResponse } from '@/features/flags/flags'
import { StatusBadge } from '@/features/requests/status'
import { LocalTime } from '@/features/ui/time.client'
import { SubmitButton } from '@/features/ui/submit-button.client'

export const metadata: Metadata = { title: 'Exceptions' }

// The central master-data team's one page (review log §10, §11): what needs a person. Exceptions are requests the
// checks could not settle after finance approved (and the few raised before the service desk). Stopped are creates
// the ERP did not finish, each with its next step. The hub load and the automatic-approval switch sit in the header,
// because they are the team's controls, not pages of their own; the demo fault is a drawer, shown only with the flag.
export default async function CentralTeamPage({ searchParams }: { searchParams: Promise<{ tab?: string; msg?: string }> }) {
  const principal = await requirePrincipal()
  if (!isCentral(principal)) return <section className="narrow"><h1>Exceptions</h1><p>This page belongs to the central master-data team.</p></section>
  const { tab, msg } = await searchParams
  const stoppedTab = tab === 'stopped'
  const [queue, attention, load, auto, demo, lost] = await Promise.all([listQueue(principal), listAttention(principal), loadStatus(), autoApproveSetting(), demoControls(), erpLostResponse()])
  const text = message(msg)
  return (
    <section>
      <h1>Exceptions</h1>
      {text ? <p className="panel rise" role="status">{text}</p> : null}
      <div className="central-controls">
        <form action={runLoadNowAction} className="row">
          <SubmitButton pendingLabel="Starting…" disabled={!!load.runningSince} className="secondary small">Run the Hub Load Now</SubmitButton>
          <span className="muted small">
            {load.runningSince ? <>Running since <LocalTime iso={load.runningSince} />. </> : null}
            Nightly at 08:00 UTC (Vercel Cron).
            {load.lastRunAt ? <> Last load <LocalTime iso={load.lastRunAt} />{load.lastTrigger === 'cron' ? ' (nightly)' : load.lastTrigger === 'manual' ? ' (run now)' : ''}: {load.lastCount ?? 0} {load.lastCount === 1 ? 'record' : 'records'}, {load.lastLinked ?? 0} linked.</> : ' No load has run yet.'}
          </span>
        </form>
        <form action={setAutoApproveAction} className="row">
          <input type="hidden" name="on" value={auto.on ? 'false' : 'true'} />
          <SubmitButton pendingLabel="Saving…" className="secondary small">{auto.on ? 'Turn Automatic Approval Off' : 'Turn Automatic Approval On'}</SubmitButton>
          <span className="muted small">Automatic approval is <strong>{auto.on ? 'on' : 'off'}</strong>{auto.updatedBy ? <> (changed by {auto.updatedBy}{auto.updatedAt ? <>, <LocalTime iso={auto.updatedAt} /></> : null})</> : null}. Off: every request finance approves comes here.</span>
        </form>
      </div>
      <nav className="tabs" aria-label="Exceptions and stopped">
        <Link href="/reviews" aria-current={!stoppedTab ? 'page' : undefined}>Exceptions <span className="count">{queue.length}</span></Link>
        <Link href="/reviews?tab=stopped" aria-current={stoppedTab ? 'page' : undefined}>Stopped <span className="count">{attention.length}</span></Link>
      </nav>
      {!stoppedTab ? (
        <>
          <p className="muted count" role="status">{queue.length === 0 ? 'Nothing waiting. Finance-approved requests that pass every check are created without you.' : `${queue.length} waiting, oldest first, every region. Each says why it was not approved automatically.`}</p>
          {queue.length === 0 ? null : (
            <table className="results"><thead><tr><th className="col-secondary">Request</th><th>Name</th><th className="col-secondary">Type</th><th className="col-secondary">Region</th><th>Why it is here</th><th className="col-secondary">Waiting since</th></tr></thead>
              <tbody>{queue.map((r) => <tr key={r.requestId}><td className="col-secondary"><Link href={`/reviews/${r.requestId}`}><code>{r.requestId}</code></Link></td><td><Link href={`/reviews/${r.requestId}`}>{r.legalName}</Link></td><td className="col-secondary">{r.domain === 'customer' ? 'Customer' : 'Supplier'}</td><td className="col-secondary">{r.region}</td><td>{r.state.kind === 'exception' ? <span className="small">{r.state.reasons.join('; ')}</span> : <><StatusBadge state={r.state} /><div className="muted small">raised before the service desk; reviewed as before</div></>}</td><td className="col-secondary"><LocalTime iso={r.createdAt} relative /></td></tr>)}</tbody></table>
          )}
        </>
      ) : (
        <>
          <p className="muted count" role="status">{attention.length === 0 ? 'Nothing stopped, nothing pending.' : `${attention.length} ${attention.length === 1 ? 'request needs' : 'requests need'} a look. No action here creates a partner: each is a read or a replay with the same key.`}</p>
          {attention.length === 0 ? null : (
            <table className="results"><thead><tr><th className="col-secondary">Request</th><th>Name</th><th className="col-secondary">Type</th><th className="col-secondary">Region</th><th>State</th><th className="col-secondary">Pending deliveries</th><th>Next step</th></tr></thead>
              <tbody>{attention.map((r) => (
                <tr key={r.requestId}>
                  <td className="col-secondary"><Link href={`/requests/${r.requestId}`}><code>{r.requestId}</code></Link></td><td><Link href={`/requests/${r.requestId}`}>{r.legalName}</Link></td><td className="col-secondary">{r.domain === 'customer' ? 'Customer' : 'Supplier'}</td><td className="col-secondary">{r.region}</td>
                  <td><StatusBadge state={r.state} />{r.state.kind === 'stopped' ? <div className="muted small">{STOP[r.state.category] ?? r.state.category}; {r.state.effect === 'unknown' ? 'not yet known whether it was created' : 'nothing was created'}</div> : null}</td>
                  <td className="col-secondary">{r.pendingDeliveries.length ? r.pendingDeliveries.map((d, i) => <div key={i}>{d.kind} · {d.attempts} attempt(s){d.lastError ? ` · ${d.lastError}` : ''}</div>) : 'none'}</td>
                  <td className="actions">
                    {r.pendingDeliveries.length ? <form action={retryDeliveryAction} className="inline"><input type="hidden" name="requestId" value={r.requestId} /><SubmitButton pendingLabel="Retrying…">Retry Delivery</SubmitButton></form> : null}
                    {r.state.kind === 'stopped' && r.state.effect === 'unknown' ? <form action={reconcileAction} className="inline"><input type="hidden" name="requestId" value={r.requestId} /><SubmitButton pendingLabel="Checking…">Check With the ERP</SubmitButton></form> : null}
                    {r.state.kind === 'stopped' && r.state.effect === 'no_effect' ? <form action={recoverAction} className="inline"><input type="hidden" name="requestId" value={r.requestId} /><SubmitButton pendingLabel="Returning…" confirm={`Return ${r.legalName} to the requester as a draft?`}>Return to Requester</SubmitButton></form> : null}
                  </td>
                </tr>
              ))}</tbody></table>
          )}
        </>
      )}
      {demo ? (
        <details className="tech demo-drawer">
          <summary>Demo controls</summary>
          <form action={armLostResponseAction} className="row"><SubmitButton pendingLabel="Arming…" className="secondary small">Drop the Next ERP Response</SubmitButton><span className="muted small">The ERP commits the create and we never hear back, once. The retry replays the same number.{lost ? ' The erp-lost-response flag is on: every approval arms this by itself.' : ''}</span></form>
        </details>
      ) : null}
    </section>
  )
}
