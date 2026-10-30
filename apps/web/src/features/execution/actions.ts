'use server'
import { redirect } from 'next/navigation'
import { revalidatePath, updateTag } from 'next/cache'
import { requirePrincipal } from '@/features/auth/principal.server'
import { deliverPending } from './deliver.server'
import { isOperator, reconcile, recoverToDraft } from './operator.server'
import { runDailyLoad } from '@/features/customers/load.server'

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
