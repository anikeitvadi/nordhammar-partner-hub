'use server'
import { redirect } from 'next/navigation'
import type { CanonicalPayload, Region } from '@intake/contracts'
import { requirePrincipal } from '@/features/auth/principal.server'
import { visibleRegions } from '@/features/auth/scope'
import { normalizeTaxId } from '@/features/intake/normalize'
import { ConflictError, resubmitRequest, submitRequest, type DupChoice } from './store.server'
import { deliverPending } from '@/features/execution/deliver.server'

const ERP_BY_REGION: Record<Region, 'MAPICS' | 'IFS'> = { BR: 'MAPICS', US: 'MAPICS', IN: 'MAPICS', CN: 'MAPICS', EU: 'IFS' }

// Server Action: re-derives the principal and re-validates the identity; the form's echo is input, never trusted state.
export async function submitRequestAction(formData: FormData): Promise<void> {
  const principal = await requirePrincipal()
  const region = String(formData.get('region') ?? '') as Region
  if (!visibleRegions(principal).includes(region)) redirect('/intake/new?error=region')
  const country = String(formData.get('country') ?? '').toUpperCase()
  const n = normalizeTaxId(country, String(formData.get('taxId') ?? ''))
  if (!n.ok) redirect('/intake/new?error=taxid')
  const dupChoice = String(formData.get('dupChoice') ?? 'new') as DupChoice
  const dupReason = String(formData.get('dupReason') ?? '').trim() || null
  if (dupChoice === 'not_related' && !dupReason) redirect('/intake/new?error=reason')
  const linkedGoldenId = String(formData.get('linkedGoldenId') ?? '').trim() || null
  const street = String(formData.get('street') ?? '').trim()
  const [streetName, ...rest] = street.split(',')
  const payload: CanonicalPayload = {
    schemaVersion: 1,
    destination: { erp: ERP_BY_REGION[region], region },
    identity: { country: n.taxId.country, scheme: n.taxId.scheme, canonical: n.taxId.canonical },
    legalName: String(formData.get('legalName') ?? '').trim(),
    addresses: [{ kind: 'bill_to', street: streetName?.trim() || '', number: rest.join(',').trim() || null, city: String(formData.get('city') ?? '').trim(), regionCode: null, postalCode: null, country }],
    contact: null,
  }
  let requestId: string
  try {
    ({ requestId } = await submitRequest(principal, { region, payload, dupChoice, dupReason, linkedGoldenId }))
  } catch (e) {
    if (e instanceof ConflictError) redirect(`/intake/new?error=${encodeURIComponent(e.message)}`)
    throw e
  }
  // Submission is committed; starting the run is best-effort here and retried from the deliveries table otherwise.
  await deliverPending(requestId).catch(() => undefined)
  redirect(`/requests/${requestId}`)
}

// Resubmit a draft that was sent back: same request, new immutable revision, new hash, new key when approved.
export async function resubmitRequestAction(formData: FormData): Promise<void> {
  const principal = await requirePrincipal()
  const requestId = String(formData.get('requestId'))
  const region = String(formData.get('region') ?? '') as Region
  if (!visibleRegions(principal).includes(region)) redirect(`/requests/${requestId}?error=region`)
  const country = String(formData.get('country') ?? '').toUpperCase()
  const n = normalizeTaxId(country, String(formData.get('taxId') ?? ''))
  if (!n.ok) redirect(`/requests/${requestId}/edit?error=taxid`)
  const street = String(formData.get('street') ?? '').trim()
  const [streetName, ...rest] = street.split(',')
  const payload: CanonicalPayload = {
    schemaVersion: 1, destination: { erp: ERP_BY_REGION[region], region }, identity: { country: n.taxId.country, scheme: n.taxId.scheme, canonical: n.taxId.canonical },
    legalName: String(formData.get('legalName') ?? '').trim(),
    addresses: [{ kind: 'bill_to', street: streetName?.trim() || '', number: rest.join(',').trim() || null, city: String(formData.get('city') ?? '').trim(), regionCode: null, postalCode: null, country }],
    contact: null,
  }
  try { await resubmitRequest(principal, requestId, payload) } catch (e) { if (e instanceof ConflictError) redirect(`/requests/${requestId}/edit?error=${encodeURIComponent(e.message)}`); throw e }
  await deliverPending(requestId).catch(() => undefined)
  redirect(`/requests/${requestId}`)
}
