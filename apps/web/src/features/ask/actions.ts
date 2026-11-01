'use server'
import { requirePrincipal } from '@/features/auth/principal.server'
import { aiSuggestion } from '@/features/flags/flags'
import { askHub, type AskOutcome } from './agent.server'

export type AskState = { question: string; outcome: AskOutcome | null }

// The question goes to the server with the signed-in person's permissions; the model never sees who they are, only
// what the scoped tools return. The ai-suggestion flag switches the whole feature off with a plain note.
export async function askAction(_prev: AskState, formData: FormData): Promise<AskState> {
  const principal = await requirePrincipal()
  const question = String(formData.get('question') ?? '').trim().slice(0, 300)
  if (!question) return { question: '', outcome: null }
  if (!(await aiSuggestion())) return { question, outcome: { ai: 'unavailable', reason: 'disabled' } }
  return { question, outcome: await askHub(principal, question) }
}
