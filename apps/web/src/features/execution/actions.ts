'use server'
import { redirect } from 'next/navigation'
import { revalidatePath, updateTag } from 'next/cache'
import { requirePrincipal } from '@/features/auth/principal.server'
import { deliverPending } from './deliver.server'
import { isOperator, reconcile, recoverToDraft } from './operator.server'
import { runDailyLoad } from '@/features/customers/load.server'
import { armLostResponseFault } from '@/features/erp/erp.server'

function back(msg: string): never { redirect(`/operations?msg=${encodeURIComponent(msg)}`) }

export async function retryDeliveryAction(formData: FormData): Promise<void> {
  const principal = await requirePrincipal()
  if (!isOperator(principal)) back('not an operator')
  const requestId = String(formData.get('requestId'))
  const r = await deliverPending(requestId)
  revalidatePath('/operations'); revalidatePath(`/requests/${requestId}`)
  back(`${requestId}: delivered ${r.delivered}, failed ${r.failed}`)
}

export async function reconcileAction(formData: FormData): Promise<void> {
  const principal = await requirePrincipal()
  const requestId = String(formData.get('requestId'))
  const r = await reconcile(principal, requestId)
  revalidatePath('/operations'); revalidatePath(`/requests/${requestId}`)
  back(r.ok ? `${requestId}: reconciled as ${r.outcome}` : `${requestId}: ${r.reason}`)
}

export async function recoverAction(formData: FormData): Promise<void> {
  const principal = await requirePrincipal()
  const requestId = String(formData.get('requestId'))
  const r = await recoverToDraft(principal, requestId)
  revalidatePath('/operations'); revalidatePath(`/requests/${requestId}`)
  back(r.ok ? `${requestId}: returned to the requester as a draft` : `${requestId}: ${r.reason}`)
}

// The simulated nightly hub load. In the engagement this is the Boomi/MDH load; here it is the only thing that makes
// a created customer searchable, and the only thing that invalidates the per-region search cache. updateTag is the
// Server-Action form of invalidation: immediate expiry, the next read misses the cache and sees the new golden record.
export async function dailyLoadAction(): Promise<void> {
  const principal = await requirePrincipal()
  if (!isOperator(principal)) back('not an operator')
  const r = await runDailyLoad(principal)
  for (const region of r.regions) updateTag(`hub:${region}`)
  revalidatePath('/operations')
  back(`hub load: ${r.loaded} customer(s) loaded${r.regions.length ? `, cache cleared for ${r.regions.join(', ')}` : ''}`)
}

// Demo control: the next successful ERP create loses its response, once. What the room watches: attempt 1 commits
// and times out from our side, attempt 2 sends the same key, the ERP replays the number, one record.
export async function armLostResponseAction(): Promise<void> {
  const principal = await requirePrincipal()
  if (!isOperator(principal)) back('not an operator')
  if (process.env.DEMO_CONTROLS_ENABLED !== 'true') back('demo controls are off')
  const r = await armLostResponseFault()
  back(r.ok ? `ERP fault armed: the next create drops its response once (armed ${r.armedAt ? new Date(r.armedAt).toLocaleTimeString() : 'now'})` : `could not arm the fault: ${r.reason}`)
}
