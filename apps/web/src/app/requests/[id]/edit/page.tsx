import { notFound } from 'next/navigation'
import { requirePrincipal } from '@/features/auth/principal.server'
import { getRequest } from '@/features/requests/store.server'
import { valuesFromPayload } from '@/features/requests/payload'
import { IntakeForm } from '@/features/intake/intake-form.client'

// Only the requester, only a draft (parked, or sent back). The reason it came back is on screen; the fix is a new
// revision, never an edit in place.
export default async function EditRequestPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params; const { error } = await searchParams
  const principal = await requirePrincipal()
  const r = await getRequest(principal, id)
  if (!r || r.requesterEmail !== principal.email || r.state.kind !== 'draft') notFound()
  return (
    <section className="narrow-wide">
      <h1>{r.revision === 0 ? `Submit draft ${r.requestId}` : `Fix and resubmit ${r.requestId}`}</h1>
      {r.state.returnedReason ? <p className="panel"><strong>Sent back:</strong> {r.state.returnedReason}</p> : null}
      <IntakeForm domain={r.domain} regions={[r.region]} initialRegion={r.region} initial={valuesFromPayload(r.payload)} mode="resubmit" requestId={r.requestId} error={error} />
    </section>
  )
}
