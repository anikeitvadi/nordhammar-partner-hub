import { notFound } from 'next/navigation'
import { requirePrincipal } from '@/features/auth/principal.server'
import { getRequest } from '@/features/requests/store.server'
import { decideAction, openReviewAction } from '@/features/reviews/actions'
import { StatusBadge } from '@/features/requests/status'

const KIND: Record<string, string> = { bill_to: 'Bill-to', ship_to: 'Ship-to', remit_to: 'Remit-to' }

// WF-06: the form as submitted, the dup-check outcome and the requester's reason, side by side. One decision.
export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const principal = await requirePrincipal()
  if (!(principal.globalIdentity && principal.role === 'reviewer')) return <section><h1>Review</h1><p>Your role cannot decide requests.</p></section>
  const r = await getRequest(principal, id)
  if (!r) notFound()
  const s = r.state
  const p = r.payload
  const decidable = s.kind === 'under_review'
  return (
    <section className="narrow-wide">
      <h1>{r.requestId} · {r.legalName}</h1>
      <p><StatusBadge state={s} /> <span className="badge">{r.domain}</span> · revision {r.revision} · {r.region} · {r.requesterEmail}</p>
      <h2>Identity</h2>
      <dl className="facts">
        <dt>Legal name</dt><dd>{p.legalName}{p.localName ? <span className="muted"> · {p.localName}</span> : null}</dd>
        <dt>{p.identity.scheme}</dt><dd>{p.identity.canonical} <span className="muted">· {p.identity.country}</span></dd>
        {p.identifiers.map((i) => <><dt key={i.scheme}>{i.scheme}</dt><dd>{i.value}</dd></>)}
        <dt>DUNS</dt><dd>{p.duns ?? <span className="muted">not given</span>}</dd>
        <dt>Destination</dt><dd>{p.destination.erp} · {r.region} · {r.domain === 'customer' ? 'customer master' : 'vendor master'}</dd>
      </dl>
      <h2>Duplicate check</h2>
      <p className="panel">{r.dupChoice === 'new' ? 'No match found in the hub at submission.' : r.dupChoice === 'new_in_group' ? <>Requester chose <strong>new company in the same group</strong> as {r.linkedGoldenId}.</> : <>Requester chose <strong>not related</strong> to {r.linkedGoldenId}. Reason: “{r.dupReason}”</>}</p>
      <h2>Details</h2>
      <dl className="facts">
        <dt>Type</dt><dd>{p.typeCode?.replace('_', ' ') ?? <span className="muted">—</span>}</dd>
        <dt>Industry</dt><dd>{p.industry ?? <span className="muted">—</span>}</dd>
        <dt>Payment terms</dt><dd>{p.paymentTerms ?? <span className="muted">finance decides</span>}</dd>
        {p.addresses.map((a, i) => <><dt key={i}>{KIND[a.kind]}</dt><dd>{[a.street, a.number].filter(Boolean).join(' ')}{a.complement ? `, ${a.complement}` : ''}{a.district ? `, ${a.district}` : ''}, {a.city}{a.regionCode ? ` ${a.regionCode}` : ''}{a.postalCode ? ` ${a.postalCode}` : ''} · {a.country}</dd></>)}
        <dt>Contact</dt><dd>{p.contact ? `${p.contact.name} ${p.contact.email}`.trim() : <span className="muted">—</span>}</dd>
        <dt>Reason</dt><dd>{p.reason.text}{p.reason.reference ? <span className="muted"> · {p.reason.reference}</span> : null}</dd>
        <dt>Binds to</dt><dd><code>{r.payloadHash.slice(0, 16)}…</code> (revision {r.revision}). An edit after approval voids it; the ERP refuses the changed payload.</dd>
      </dl>
      {s.kind === 'submitted' ? (
        <form action={openReviewAction}><input type="hidden" name="requestId" value={r.requestId} /><input type="hidden" name="revision" value={r.revision} /><button type="submit">Open for review</button></form>
      ) : null}
      {decidable ? (
        <div className="decide">
          <p className="muted">Check: tax ID valid, right region, the dup-check outcome reasonable, the reason makes sense. Not credit; finance sets that in the ERP.</p>
          <form action={decideAction} className="inline"><input type="hidden" name="requestId" value={r.requestId} /><input type="hidden" name="revision" value={r.revision} /><input type="hidden" name="payloadHash" value={r.payloadHash} /><input type="hidden" name="decision" value="approve" /><button type="submit">Approve and create in {p.destination.erp}</button></form>
          <form action={decideAction} className="stack"><input type="hidden" name="requestId" value={r.requestId} /><input type="hidden" name="revision" value={r.revision} /><input type="hidden" name="payloadHash" value={r.payloadHash} />
            <label>Reason (required to decline or send back) <input name="reason" /></label>
            <div className="row"><button type="submit" name="decision" value="send_back" className="secondary">Send back</button><button type="submit" name="decision" value="decline" className="danger">Decline</button></div>
          </form>
        </div>
      ) : <p>Nothing to decide at this state.</p>}
    </section>
  )
}
