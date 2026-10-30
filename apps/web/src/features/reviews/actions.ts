'use server'
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
  // The decision is committed. Waking the workflow is best-effort here and retried from the deliveries table otherwise.
  await deliverPending(requestId).catch(() => undefined)
  revalidatePath(`/reviews/${requestId}`); revalidatePath(`/requests/${requestId}`); revalidatePath('/reviews')
  redirect(`/reviews/${requestId}`)
}
