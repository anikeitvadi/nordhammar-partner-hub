'use server'
import { armLostResponseIfFlagged } from '@/features/execution/demo.server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { requirePrincipal } from '@/features/auth/principal.server'
import { decide, openReview, type Decision } from './decide.server'
import { deliverPending } from '@/features/execution/deliver.server'

export async function openReviewAction(formData: FormData): Promise<void> {
  const principal = await requirePrincipal()
  await openReview(principal, String(formData.get('requestId')), Number(formData.get('revision')))
  revalidatePath(`/reviews/${String(formData.get('requestId'))}`)
}

export async function decideAction(formData: FormData): Promise<void> {
  const principal = await requirePrincipal()
  const requestId = String(formData.get('requestId'))
  const result = await decide(principal, { requestId, revision: Number(formData.get('revision')), payloadHash: String(formData.get('payloadHash')), decision: String(formData.get('decision')) as Decision, reason: String(formData.get('reason') ?? '') })
  if (!result.ok) redirect(`/reviews/${requestId}?error=${result.reason}`)
  // Demo: with the erp-lost-response flag on (and demo controls on), the ERP stand-in drops its next response once,
  // so a viewer sees attempt 1 time out and attempt 2 replay the same number. A flag, so it is flipped from the toolbar.
  if (result.next.kind === 'approved') await armLostResponseIfFlagged()
  // The decision is committed. Waking the workflow is best-effort here and retried from the deliveries table otherwise.
  await deliverPending(requestId).catch(() => undefined)
  revalidatePath(`/reviews/${requestId}`); revalidatePath(`/requests/${requestId}`); revalidatePath('/reviews')
  redirect(`/reviews/${requestId}`)
}
