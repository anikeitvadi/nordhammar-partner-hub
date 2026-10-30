import { notFound } from 'next/navigation'
import { requirePrincipal } from '@/features/auth/principal.server'
import { getRequest } from '@/features/requests/store.server'
import { resubmitRequestAction } from '@/features/requests/actions'

// Only the requester, only a draft. The reason it came back is on screen; the fix is a new revision, never an edit in place.
export default async function EditRequestPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params; const { error } = await searchParams
  const principal = await requirePrincipal()
  const r = await getRequest(principal, id)
  if (!r || r.requesterEmail !== principal.email || r.state.kind !== 'draft') notFound()
  const bill = r.payload.addresses[0]
  return (
    <section className="narrow">
      <h1>Fix and resubmit {r.requestId}</h1>
      {r.state.returnedReason ? <p className="panel"><strong>Sent back:</strong> {r.state.returnedReason}</p> : null}
      {error ? <p role="alert" className="error">{error}</p> : null}
      <form action={resubmitRequestAction} className="stack">
        <input type="hidden" name="requestId" value={r.requestId} /><input type="hidden" name="region" value={r.region} /><input type="hidden" name="country" value={bill?.country ?? r.payload.identity.country} />
        <label>Legal name <input name="legalName" defaultValue={r.payload.legalName} required /></label>
        <label>Tax ID <input name="taxId" defaultValue={r.payload.identity.canonical} required /></label>
        <label>Bill-to street <input name="street" defaultValue={[bill?.street, bill?.number].filter(Boolean).join(', ')} /></label>
        <label>City <input name="city" defaultValue={bill?.city ?? ''} required /></label>
        <button type="submit">Resubmit (revision {r.revision + 1})</button>
      </form>
    </section>
  )
}
