'use server'
import { demoControls } from '@/features/flags/flags'
import { redirect } from 'next/navigation'
import { revalidatePath, updateTag } from 'next/cache'
import { requirePrincipal } from '@/features/auth/principal.server'
import { deliverPending } from './deliver.server'
import { isOperator, reconcile, recoverToDraft } from './operator.server'
import { applyGoldenRecords, loadCursor } from '@/features/customers/load.server'
import { armLostResponseFault, readGoldenRecords } from '@/features/erp/erp.server'

function back(msg: string): never { redirect(`/operations?msg=${encodeURIComponent(msg)}`) }

export async function retryDeliveryAction(formData: FormData): Promise<void> {
  const principal = await requirePrincipal()
  if (!isOperator(principal)) back('not_operator')
  const requestId = String(formData.get('requestId'))
  const r = await deliverPending(requestId)
  revalidatePath('/operations'); revalidatePath(`/requests/${requestId}`)
  back(`delivered:${r.delivered}:${r.failed}`)
}

export async function reconcileAction(formData: FormData): Promise<void> {
  const principal = await requirePrincipal()
  const requestId = String(formData.get('requestId'))
  const r = await reconcile(principal, requestId)
  revalidatePath('/operations'); revalidatePath(`/requests/${requestId}`)
  back(r.ok ? `reconciled:${r.outcome}` : 'noop')
}

export async function recoverAction(formData: FormData): Promise<void> {
  const principal = await requirePrincipal()
  const requestId = String(formData.get('requestId'))
  const r = await recoverToDraft(principal, requestId)
  revalidatePath('/operations'); revalidatePath(`/requests/${requestId}`)
  back(r.ok ? 'recovered' : 'noop')
}

// The nightly hub load: read the integration platform's golden-record feed from where the last load stopped, page by
// page, and write it into the hub. It is the only thing that makes a created partner searchable, and the only thing that
// invalidates the per-region search cache. updateTag is the Server-Action form of invalidation: immediate expiry, the
// next read misses the cache and sees the new golden record.
export async function dailyLoadAction(): Promise<void> {
  const principal = await requirePrincipal()
  if (!isOperator(principal)) back('not_operator')
  let since = await loadCursor()
  const totals = { loaded: 0, linked: 0, regions: new Set<string>() }
  for (let pages = 0; pages < 50; pages++) {
    const feed = await readGoldenRecords(since)
    if (feed.records.length === 0) break
    const r = await applyGoldenRecords(principal, feed.records, feed.next)
    totals.loaded += r.loaded; totals.linked += r.linked; r.regions.forEach((x) => totals.regions.add(x))
    since = feed.next
  }
  for (const region of totals.regions) updateTag(`hub:${region}`)
  revalidatePath('/operations')
  back(`loaded:${totals.loaded}:${[...totals.regions].join(',')}`)
}

// Demo control: the next successful ERP create loses its response, once. What a viewer sees: attempt 1 commits
// and times out from our side, attempt 2 sends the same key, the ERP replays the number, one record.
export async function armLostResponseAction(): Promise<void> {
  const principal = await requirePrincipal()
  if (!isOperator(principal)) back('not_operator')
  if (!(await demoControls())) back('demo_off')
  const r = await armLostResponseFault()
  back(r.ok ? 'armed' : 'arm_failed')
}
