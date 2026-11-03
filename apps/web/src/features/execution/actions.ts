'use server'
import { demoControls } from '@/features/flags/flags'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { requirePrincipal } from '@/features/auth/principal.server'
import { deliverPending } from './deliver.server'
import { isOperator, reconcile, recoverToDraft } from './operator.server'
import { loadStatus } from '@/features/customers/load.server'
import { setAutoApprove } from '@/features/settings/settings.server'
import { start } from 'workflow/api'
import { hubLoadWorkflow } from './load.workflow'
import { armLostResponseFault } from '@/features/erp/erp.server'

// Back to the central team's page with a result code. Fixes to one request (retry, reconcile, return) land on the
// Stopped tab where that request is listed; switches in the page header land on the default tab.
const STOPPED_TAB = /^(delivered|reconciled|recovered|noop)/
function back(msg: string): never { redirect(`/reviews?${STOPPED_TAB.test(msg) ? 'tab=stopped&' : ''}msg=${encodeURIComponent(msg)}`) }

export async function retryDeliveryAction(formData: FormData): Promise<void> {
  const principal = await requirePrincipal()
  if (!isOperator(principal)) back('not_operator')
  const requestId = String(formData.get('requestId'))
  const r = await deliverPending(requestId)
  revalidatePath('/reviews'); revalidatePath(`/requests/${requestId}`)
  back(`delivered:${r.delivered}:${r.failed}`)
}

export async function reconcileAction(formData: FormData): Promise<void> {
  const principal = await requirePrincipal()
  const requestId = String(formData.get('requestId'))
  const r = await reconcile(principal, requestId)
  revalidatePath('/reviews'); revalidatePath(`/requests/${requestId}`)
  back(r.ok ? `reconciled:${r.outcome}` : 'noop')
}

export async function recoverAction(formData: FormData): Promise<void> {
  const principal = await requirePrincipal()
  const requestId = String(formData.get('requestId'))
  const r = await recoverToDraft(principal, requestId)
  revalidatePath('/reviews'); revalidatePath(`/requests/${requestId}`)
  back(r.ok ? 'recovered' : 'noop')
}

// Run now: the central team starts the same Workflow the nightly Cron starts. It returns at once; the page shows the
// run as in progress and the result when it finishes. A second click while a load runs is refused by the load's lock.
export async function runLoadNowAction(): Promise<void> {
  const principal = await requirePrincipal()
  if (!isOperator(principal)) back('not_operator')
  const status = await loadStatus()
  if (status.runningSince) back('load_running')
  await start(hubLoadWorkflow, ['manual'])
  revalidatePath('/reviews')
  back('load_started')
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

// The central team turns automatic approval on or off. Takes effect for the next finance approval that arrives.
export async function setAutoApproveAction(formData: FormData): Promise<void> {
  const principal = await requirePrincipal()
  const on = String(formData.get('on')) === 'true'
  if (!(await setAutoApprove(principal, on))) back('not_operator')
  revalidatePath('/reviews')
  back(on ? 'auto_on' : 'auto_off')
}
