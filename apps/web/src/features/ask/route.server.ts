import 'server-only'
import { getPrincipal } from '@/features/auth/principal.server'
import { aiModel, aiSuggestion } from '@/features/flags/flags'
import { resolveModel } from '@/features/ai/models'
import { askEvents, type AskEvent } from './agent.server'

// POST /api/ask, streamed. The question goes to the server with the signed-in person's permissions; the model never
// sees who they are, only what the scoped tools return. One JSON line per event (card, text, done), so the card shows
// the moment the lookup returns and the sentence grows behind the citation check. The ai-suggestion flag switches the
// whole feature off with a plain note; ai-model picks the model, the same switch as the duplicate check.
export async function handleAsk(request: Request): Promise<Response> {
  const principal = await getPrincipal()
  if (!principal) return Response.json({ error: 'unauthenticated' }, { status: 401 })
  const body = (await request.json().catch(() => null)) as { question?: unknown } | null
  const question = typeof body?.question === 'string' ? body.question.trim().slice(0, 300) : ''
  if (!question) return Response.json({ error: 'empty question' }, { status: 400 })
  const events: AsyncIterable<AskEvent> = (await aiSuggestion())
    ? askEvents(principal, question, undefined, resolveModel(await aiModel(), process.env))
    : (async function* () { yield { type: 'done', outcome: { ai: 'unavailable', reason: 'disabled' } } as AskEvent })()
  const enc = new TextEncoder()
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      for await (const e of events) controller.enqueue(enc.encode(JSON.stringify(e) + '\n'))
      controller.close()
    },
  })
  return new Response(stream, { headers: { 'content-type': 'application/x-ndjson; charset=utf-8', 'cache-control': 'no-store' } })
}
