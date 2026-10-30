import { notFound } from 'next/navigation'
import { requirePrincipal } from '@/features/auth/principal.server'
import { getRequest } from '@/features/requests/store.server'
import { decideAction, openReviewAction } from '@/features/reviews/actions'
import { StatusBadge } from '@/features/requests/status'

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const principal = await requirePrincipal()
  if (!(principal.globalIdentity && principal.role === 'reviewer')) return <section><h1>Review</h1><p>Your role cannot decide requests.</p></section>
  const r = await getRequest(principal, id)
  if (!r) notFound()
  const s = r.state
  const decidable = s.kind === 'under_review'
  return (
    <section>
      <h1>{r.requestId} · {r.legalName}</h1>
      <p><StatusBadge state={s} /> · revision {r.revision} · {r.region} · {r.requesterEmail}</p>
      <dl className="facts">
        <dt>Tax ID</dt><dd>{r.payload.identity.scheme} {r.payload.identity.canonical}</dd>
        <dt>Bill-to</dt><dd>{r.payload.addresses[0]?.street} {r.payload.addresses[0]?.number ?? ''}, {r.payload.addresses[0]?.city}, {r.payload.addresses[0]?.country}</dd>
        <dt>Destination</dt><dd>{r.payload.destination.erp} ({r.region})</dd>
        <dt>Duplicate check</dt><dd>{r.dupChoice === 'new' ? 'no match found' : r.dupChoice === 'new_in_group' ? `requester chose: new company in the same group as ${r.linkedGoldenId}` : `requester chose: not related to ${r.linkedGoldenId}. Reason: "${r.dupReason}"`}</dd>
        <dt>Binds to</dt><dd><code>{r.payloadHash.slice(0, 16)}…</code> (revision {r.revision})</dd>
      </dl>
      {s.kind === 'submitted' ? (
        <form action={openReviewAction}><input type="hidden" name="requestId" value={r.requestId} /><input type="hidden" name="revision" value={r.revision} /><button type="submit">Open for review</button></form>
      ) : null}
      {decidable ? (
        <div className="decide">
          <form action={decideAction} className="inline"><input type="hidden" name="requestId" value={r.requestId} /><input type="hidden" name="revision" value={r.revision} /><input type="hidden" name="payloadHash" value={r.payloadHash} /><input type="hidden" name="decision" value="approve" /><button type="submit">Approve</button></form>
          <form action={decideAction} className="stack"><input type="hidden" name="requestId" value={r.requestId} /><input type="hidden" name="revision" value={r.revision} /><input type="hidden" name="payloadHash" value={r.payloadHash} />
            <label>Reason (required to decline or send back) <input name="reason" /></label>
            <div className="row"><button type="submit" name="decision" value="send_back">Send back</button><button type="submit" name="decision" value="decline" className="danger">Decline</button></div>
          </form>
        </div>
      ) : <p>Nothing to decide at this state.</p>}
    </section>
  )
}
