'use server'
import { redirect } from 'next/navigation'
import type { Domain, Region } from '@intake/contracts'
import { requirePrincipal } from '@/features/auth/principal.server'
import { workRegions } from '@/features/auth/scope'
import { normalizeTaxId } from '@/features/intake/normalize'
import { ConflictError, resubmitRequest, saveDraft, submitRequest, type DupChoice } from './store.server'
import { buildPayload, formValues } from './payload'
import { deliverPending } from '@/features/execution/deliver.server'

// Server Actions: re-derive the principal and re-validate the identity; the form's echo is input, never trusted state.
// Three entry points, one payload builder, so the shape a reviewer approves is the same whichever way it arrived.

function asDomain(v: unknown): Domain { return v === 'supplier' ? 'supplier' : 'customer' }

type Verified = { domain: Domain; region: Region; country: string; back: string }

async function verify(formData: FormData): Promise<Verified | { redirectTo: string }> {
  const principal = await requirePrincipal()
  const domain = asDomain(formData.get('domain'))
  const region = String(formData.get('region') ?? '') as Region
  const back = `/intake/new?domain=${domain}&region=${region}`
  if (!workRegions(principal).includes(region)) return { redirectTo: `${back}&error=${encodeURIComponent('You are not entitled to request in that region.')}` }
  const country = String(formData.get('country') ?? '').toUpperCase()
  return { domain, region, country, back }
}

export async function submitRequestAction(formData: FormData): Promise<void> {
  const principal = await requirePrincipal()
  const v = await verify(formData)
  if ('redirectTo' in v) redirect(v.redirectTo)
  const n = normalizeTaxId(v.country, String(formData.get('taxId') ?? ''))
  if (!n.ok) redirect(`${v.back}&error=taxid`)
  const built = buildPayload(v.domain, v.region, n.taxId, formValues(formData))
  if (!built.ok) redirect(`${v.back}&error=${encodeURIComponent(built.problems.map((p) => p.message).join(' '))}`)
  const dupChoice = String(formData.get('dupChoice') ?? 'new') as DupChoice
  const dupReason = String(formData.get('dupReason') ?? '').trim() || null
  if (dupChoice === 'not_related' && !dupReason) redirect(`${v.back}&error=reason`)
  const linkedGoldenId = String(formData.get('linkedGoldenId') ?? '').trim() || null
  let requestId: string
  try {
    ({ requestId } = await submitRequest(principal, { domain: v.domain, region: v.region, payload: built.payload, dupChoice, dupReason, linkedGoldenId }))
  } catch (e) {
    if (e instanceof ConflictError) redirect(`${v.back}&error=${encodeURIComponent(e.message)}`)
    throw e
  }
  // Submission is committed; starting the run is best-effort here and retried from the deliveries table otherwise.
  await deliverPending(requestId).catch(() => undefined)
  redirect(`/requests/${requestId}`)
}

// Park the form as a draft: the request exists for the requester only, holds no reservation and starts nothing.
export async function saveDraftAction(formData: FormData): Promise<void> {
  const principal = await requirePrincipal()
  const v = await verify(formData)
  if ('redirectTo' in v) redirect(v.redirectTo)
  const n = normalizeTaxId(v.country, String(formData.get('taxId') ?? ''))
  if (!n.ok) redirect(`${v.back}&error=taxid`)
  const built = buildPayload(v.domain, v.region, n.taxId, formValues(formData))
  if (!built.ok) redirect(`${v.back}&error=${encodeURIComponent(built.problems.map((p) => p.message).join(' '))}`)
  const { requestId } = await saveDraft(principal, { domain: v.domain, region: v.region, payload: built.payload })
  redirect(`/requests/${requestId}`)
}

// Submit a parked draft, or resubmit one that was sent back: same request, new immutable revision, new hash, new key when approved.
export async function resubmitRequestAction(formData: FormData): Promise<void> {
  const principal = await requirePrincipal()
  const requestId = String(formData.get('requestId'))
  const v = await verify(formData)
  if ('redirectTo' in v) redirect(`/requests/${requestId}/edit?error=${encodeURIComponent(v.redirectTo.split('error=')[1] ?? 'region')}`)
  const n = normalizeTaxId(v.country, String(formData.get('taxId') ?? ''))
  if (!n.ok) redirect(`/requests/${requestId}/edit?error=taxid`)
  const built = buildPayload(v.domain, v.region, n.taxId, formValues(formData))
  if (!built.ok) redirect(`/requests/${requestId}/edit?error=${encodeURIComponent(built.problems.map((p) => p.message).join(' '))}`)
  try { await resubmitRequest(principal, requestId, built.payload) } catch (e) { if (e instanceof ConflictError) redirect(`/requests/${requestId}/edit?error=${encodeURIComponent(e.message)}`); throw e }
  await deliverPending(requestId).catch(() => undefined)
  redirect(`/requests/${requestId}`)
}
