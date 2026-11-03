import type { Metadata } from 'next'
import { Fragment } from 'react'
import Link from 'next/link'
import { typeLabel } from '@/features/requests/payload'
import { notFound } from 'next/navigation'
import { requirePrincipal } from '@/features/auth/principal.server'
import { isCentral } from '@/features/auth/scope'
import { getRequest } from '@/features/requests/store.server'
import { decideAction, openReviewAction } from '@/features/reviews/actions'
import { StatusBadge } from '@/features/requests/status'
import { SubmitButton } from '@/features/ui/submit-button.client'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  return { title: `Review ${id}` }
}

const KIND: Record<string, string> = { bill_to: 'Bill-to', ship_to: 'Ship-to', remit_to: 'Remit-to' }

// WF-06: the form as submitted, the duplicate-check outcome and the requester's reason, side by side. One decision.
// Approve is not optimistic and has no undo: it unlocks an ERP write that cannot be undone, so it asks once, in
// words that say what will be written, and then the status timeline takes over.
export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const principal = await requirePrincipal()
  if (!isCentral(principal)) return <section className="narrow card" style={{ marginTop: 48 }}><h1>Exceptions</h1><p>Exceptions are decided by the central master-data team.</p></section>
  const r = await getRequest(principal, id)
  if (!r) notFound()
  const s = r.state
  const p = r.payload
  const decidable = s.kind === 'under_review' || s.kind === 'exception'
  const thing = r.domain === 'customer' ? 'customer' : 'supplier'
  const approveText = `Approve ${p.legalName} as a new ${thing} in ${p.destination.erp} (${r.region})?\n\nThe ERP will create the record and assign its number. This cannot be undone.`
  return (
    <section className="narrow-wide">
      <h1>{r.legalName}</h1>
      <p className="muted"><code>{r.requestId}</code> · <StatusBadge state={s} /> <span className="badge">{r.domain === 'customer' ? 'Customer' : 'Supplier'}</span> · {r.region} · requested by {r.requesterEmail}{r.revision > 1 ? ` · version ${r.revision}` : ''}</p>
      <h2>Identity</h2>
      <dl className="facts">
        <dt>Legal name</dt><dd>{p.legalName}{p.localName ? <span className="muted"> · {p.localName}</span> : null}</dd>
        <dt>{p.identity.scheme}</dt><dd>{p.identity.canonical} <span className="muted">· {p.identity.country}</span></dd>
        {p.identifiers.map((i) => <Fragment key={i.scheme}><dt>{i.scheme}</dt><dd>{i.value}</dd></Fragment>)}
        <dt>DUNS</dt><dd>{p.duns ?? <span className="muted">not given</span>}</dd>
        <dt>Will be created in</dt><dd>{p.destination.erp} · {r.region} · {r.domain === 'customer' ? 'customer master' : 'vendor master'}</dd>
      </dl>
      {s.kind === 'exception' ? <p className="panel hint"><strong>Why this was not approved automatically.</strong> {s.reasons.join('; ')}. Finance approved it in the service desk{s.ticketId ? ` (ticket ${s.ticketId})` : ''}.</p> : null}
      <h2>Duplicate check</h2>
      <p className="panel">{r.dupChoice === 'new' ? 'No match found in the hub at submission.' : r.dupChoice === 'new_in_group' ? <>Requester chose <strong>new company in the same group</strong> as {r.linkedGoldenId}.</> : <>Requester chose <strong>not related</strong> to {r.linkedGoldenId}. Reason: “{r.dupReason}”</>}</p>
      <h2>Details</h2>
      <dl className="facts">
        <dt>Type</dt><dd>{typeLabel(p.typeCode) ?? <span className="muted">—</span>}</dd>
        <dt>Industry</dt><dd>{p.industry ?? <span className="muted">—</span>}</dd>
        <dt>Payment terms</dt><dd>{p.paymentTerms ?? <span className="muted">finance decides</span>}</dd>
        {p.addresses.map((a, i) => <Fragment key={i}><dt>{KIND[a.kind]}</dt><dd>{[a.street, a.number].filter(Boolean).join(' ')}{a.complement ? `, ${a.complement}` : ''}{a.district ? `, ${a.district}` : ''}, {a.city}{a.regionCode ? ` ${a.regionCode}` : ''}{a.postalCode ? ` ${a.postalCode}` : ''} · {a.country}</dd></Fragment>)}
        <dt>Contact</dt><dd>{p.contact ? `${p.contact.name} ${p.contact.email}`.trim() : <span className="muted">—</span>}</dd>
        <dt>Reason</dt><dd>{p.reason.text}{p.reason.reference ? <span className="muted"> · {p.reason.reference}</span> : null}</dd>
        <dt>Version</dt><dd>{r.revision > 1 ? `Version ${r.revision}. ` : ''}Approving locks this exact version; if anything is edited afterwards, the approval no longer applies.</dd>
      </dl>
      <details className="tech">
        <summary>Technical details</summary>
        <dl><dt>Payload hash</dt><dd>{r.payloadHash}</dd><dt>Revision</dt><dd>{r.revision}</dd>{r.workflowRunId ? <><dt>Workflow run</dt><dd>{r.workflowRunId}</dd></> : null}</dl>
      </details>
      {s.kind === 'submitted' ? (
        <form action={openReviewAction} className="row"><input type="hidden" name="requestId" value={r.requestId} /><input type="hidden" name="revision" value={r.revision} /><SubmitButton pendingLabel="Opening…">Open for review</SubmitButton><span className="muted">Claim it so other reviewers know you have it.</span></form>
      ) : null}
      {decidable ? (
        <div className="decide">
          <p className="muted">Check: the tax ID looks right, the region is right, the duplicate-check outcome makes sense, the reason makes sense. Credit and terms are not yours; finance sets them in the ERP.</p>
          <form action={decideAction} className="inline"><input type="hidden" name="requestId" value={r.requestId} /><input type="hidden" name="revision" value={r.revision} /><input type="hidden" name="payloadHash" value={r.payloadHash} /><input type="hidden" name="decision" value="approve" /><SubmitButton pendingLabel="Approving…" confirm={approveText}>Approve and create in {p.destination.erp}</SubmitButton></form>
          <form action={decideAction} className="stack"><input type="hidden" name="requestId" value={r.requestId} /><input type="hidden" name="revision" value={r.revision} /><input type="hidden" name="payloadHash" value={r.payloadHash} />
            <label htmlFor="reason">Reason <span className="muted">required to send back or decline; the requester reads it</span><input id="reason" name="reason" required minLength={3} /></label>
            <div className="row"><SubmitButton pendingLabel="Sending back…" name="decision" value="send_back" className="secondary">Send back</SubmitButton><SubmitButton pendingLabel="Declining…" name="decision" value="decline" className="danger" confirm={`Decline ${p.legalName}?\n\nThe request closes with your reason. The requester would start a new request.`}>Decline</SubmitButton></div>
          </form>
        </div>
      ) : <p className="muted">This request is {s.kind.replace('_', ' ')}; no decision is needed here. <Link href={`/requests/${r.requestId}`}>Follow it on the request page</Link>.</p>}
    </section>
  )
}
