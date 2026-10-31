import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePrincipal } from '@/features/auth/principal.server'
import { getRequest } from '@/features/requests/store.server'
import { LiveStatus } from '@/features/requests/live-status.client'

// "Where is my request and who has it" is pain number two. This page is the answer: current state, the exact stop
// reason if any, and the timeline. Dynamic on purpose; it is the one page that must never be stale.
export default async function RequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const principal = await requirePrincipal()
  const r = await getRequest(principal, id)
  if (!r) notFound()
  const s = r.state
  return (
    <section>
      <h1>{r.requestId} · {r.legalName}</h1>
      <p className="muted"><span className="badge">{r.domain}</span> {r.region} · requested by {r.requesterEmail}</p>
      <LiveStatus requestId={r.requestId} initial={{ state: s, revision: r.revision, updatedAt: r.updatedAt, events: r.events }} />
      {s.kind === 'created' ? <p className="panel ok"><strong>{r.payload.destination.erp} {r.domain} number {s.erpNumber}</strong>. {s.goldenId ? <Link href={`${r.domain === 'customer' ? '/customers' : '/suppliers'}?id=${s.goldenId}`}>Hub record {s.goldenId}</Link> : 'Pending the next hub load; search shows it from the next day. Until then this page is the record.'}</p> : null}
      {s.kind === 'stopped' ? <p className="panel error"><strong>Stopped ({s.category}, effect {s.effect === 'no_effect' ? 'none' : 'unknown'}):</strong> {s.reason}</p> : null}
      {s.kind === 'draft' ? <p className="panel">{s.returnedReason ? <><strong>Sent back:</strong> {s.returnedReason} </> : <><strong>Draft.</strong> Not visible to approvers. </>}{r.requesterEmail === principal.email ? <Link href={`/requests/${r.requestId}/edit`}>{s.returnedReason ? 'Fix and resubmit' : 'Open and submit'}</Link> : null}</p> : null}
      <h2>Submitted</h2>
      <dl className="facts">
        <dt>{r.payload.identity.scheme}</dt><dd>{r.payload.identity.canonical}</dd>
        <dt>{r.domain === 'customer' ? 'Bill-to' : 'Remit-to'}</dt><dd>{r.payload.addresses[0]?.street} {r.payload.addresses[0]?.number ?? ''}, {r.payload.addresses[0]?.city}</dd>
        <dt>Reason</dt><dd>{r.payload.reason.text}{r.payload.reason.reference ? ` · ${r.payload.reason.reference}` : ''}</dd>
        <dt>Duplicate check</dt><dd>{r.dupChoice === 'new' ? 'no match found' : r.dupChoice === 'new_in_group' ? `new company in the same group as ${r.linkedGoldenId}` : `not related to ${r.linkedGoldenId}: "${r.dupReason}"`}</dd>
        <dt>Payload hash</dt><dd><code>{r.payloadHash.slice(0, 16)}…</code></dd>
      </dl>
    </section>
  )
}
