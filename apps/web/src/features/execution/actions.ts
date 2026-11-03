'use server'
import { demoControls } from '@/features/flags/flags'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { requirePrincipal } from '@/features/auth/principal.server'
import { deliverPending } from './deliver.server'
import { isOperator, reconcile, recoverToDraft } from './operator.server'
import { loadStatus } from '@/features/customers/load.server'
import { start } from 'workflow/api'
import { hubLoadWorkflow } from './load.workflow'
import { armLostResponseFault } from '@/features/erp/erp.server'

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

// Run now: the central team starts the same Workflow the nightly Cron starts. It returns at once; the page shows the
// run as in progress and the result when it finishes. A second click while a load runs is refused by the load's lock.
export async function runLoadNowAction(): Promise<void> {
  const principal = await requirePrincipal()
  if (!isOperator(principal)) back('not_operator')
  const status = await loadStatus()
  if (status.runningSince) back('load_running')
  await start(hubLoadWorkflow, ['manual'])
  revalidatePath('/operations')
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
