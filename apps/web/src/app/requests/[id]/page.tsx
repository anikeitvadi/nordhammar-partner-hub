import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePrincipal } from '@/features/auth/principal.server'
import { getRequest } from '@/features/requests/store.server'
import { LiveStatus } from '@/features/requests/live-status.client'
import { Fragment, Suspense } from 'react'
import { RunPanel } from '@/features/execution/run-panel'
import { isCentral } from '@/features/auth/scope'
import { technicalEvent } from '@/features/requests/status'
import { Blueprint, stageFor } from '@/features/ui/blueprint'

// The service desk is the customer's system; the ticket link opens it in their tool, where finance works.
const DESK_URL = (process.env.ERP_BASE_URL ?? 'https://customer-intake-erp-stub.vercel.app').replace(/\/$/, '')

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  return { title: `Request ${id}` }
}

// "Where is my request and who has it" is pain number two. This page is the answer, in two layers: first the state,
// the number or the exact stop reason, the timeline and what was submitted; then "How this ran", the pipeline, the
// run's timings and cost and every technical fact, open for the central team who own it and folded for a requester.
// Dynamic on purpose; it is the one page that must never be stale.
export default async function RequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const principal = await requirePrincipal()
  const r = await getRequest(principal, id)
  if (!r) notFound()
  const s = r.state
  const main = r.payload.addresses[0]
  const central = isCentral(principal)
  const technical = r.events.map((e) => ({ e, t: technicalEvent(e) })).filter((x) => x.t)
  const emails = r.events.some((e) => e.kind === 'email_queued')
  return (
    <section>
      <h1>{r.legalName}</h1>
      <p className="muted"><code>{r.requestId}</code> · {r.domain === 'customer' ? 'Customer' : 'Supplier'} · {r.region} · requested by {r.requesterEmail}{r.ticketId ? <> · finance ticket <a href={`${DESK_URL}/desk/tickets/${r.ticketId}`} target="_blank" rel="noreferrer">{r.ticketId}</a></> : null}</p>
      <LiveStatus requestId={r.requestId} domain={r.domain} erp={r.payload.destination.erp} initial={{ state: s, revision: r.revision, updatedAt: r.updatedAt, events: r.events }} />
      {s.kind === 'stopped' ? <p className="panel error"><strong>Stopped.</strong> {s.effect === 'unknown' ? 'The ERP did not answer, so we do not yet know whether it was created. An operator checks with the ERP before anything is retried; no duplicate can be made.' : `${s.reason}. An operator will return this to you to fix.`}</p> : null}
      {s.kind === 'draft' ? <p className="panel">{s.returnedReason ? <><strong>Sent back:</strong> {s.returnedReason} </> : <><strong>Draft.</strong> Only you can see it. </>}{r.requesterEmail === principal.email ? <Link href={`/requests/${r.requestId}/edit`}>{s.returnedReason ? 'Fix and Submit Again' : 'Open and Submit'}</Link> : null}</p> : null}
      <h2>What was submitted</h2>
      <dl className="facts">
        <dt>{r.payload.identity.scheme}</dt><dd>{r.payload.identity.canonical}</dd>
        <dt>{r.domain === 'customer' ? 'Bill-to' : 'Remit-to'}</dt><dd>{[main?.street, main?.number].filter(Boolean).join(' ')}, {main?.city}{main?.regionCode ? ` ${main.regionCode}` : ''}</dd>
        <dt>Reason</dt><dd>{r.payload.reason.text}{r.payload.reason.reference ? ` · ${r.payload.reason.reference}` : ''}</dd>
        <dt>Duplicate check</dt><dd>{r.dupChoice === 'new' ? 'No match found in the hub' : r.dupChoice === 'new_in_group' ? `New company in the same group as ${r.linkedGoldenId}` : `Marked not related to ${r.linkedGoldenId}: "${r.dupReason}"`}</dd>
      </dl>
      <details className="how" open={central}>
        <summary><h2>How this ran</h2><span className="muted small">where it is in the pipeline, where the time went, what it cost</span></summary>
        <Blueprint active={stageFor(s.kind)} />
        {/* Streams in after the page: it reads the platform's run record, which must never hold the status up. */}
        <Suspense fallback={<p className="muted">Reading the run record…</p>}>
          <RunPanel requestId={r.requestId} workflowRunId={r.workflowRunId} />
        </Suspense>
        {emails ? <p className="muted small">Emails to the requester and the approver team are queued at each step; sending is not part of this build.</p> : null}
        <details className="tech">
          <summary>Technical details</summary>
          <dl>
            <dt>Request</dt><dd>{r.requestId}, revision {r.revision}</dd>
            <dt>Payload hash</dt><dd>{r.payloadHash}</dd>
            <dt>Destination</dt><dd>{r.payload.destination.erp} ({r.region}), {r.domain} master</dd>
            {r.workflowRunId ? <><dt>Workflow run</dt><dd>{r.workflowRunId}</dd></> : null}
            {s.kind === 'created' || s.kind === 'creating' || s.kind === 'stopped' ? <><dt>Operation key</dt><dd>{s.operationKey}</dd></> : null}
            {technical.map(({ e, t }, i) => <Fragment key={i}><dt>{e.kind.replace(/_/g, ' ')}</dt><dd>{t}</dd></Fragment>)}
          </dl>
        </details>
      </details>
    </section>
  )
}
