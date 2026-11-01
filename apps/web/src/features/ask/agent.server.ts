import { generateText, stepCountIs, tool } from 'ai'
import { z } from 'zod'
import type { Principal } from '@/features/auth/scope'
import { readGroupPresence, readRequestStatus, readWhyFlagged } from './tools.server'
import { citesOnlyKnown } from './view'

// "Ask the hub": one question, one generateText call, three typed read-only tools, two steps at most (one to look,
// one to speak). The card the page renders is the tool result, which is the truth; the sentence is the model's
// reading of that card and is dropped if it cites anything the card does not contain. Same virtual model, failover
// and zero data retention as the proposal agent. No tool writes; a wrong answer is a wrong card, never a wrong write.

export const ASK_INSTRUCTIONS = `You answer three kinds of question about a company's partner hub, and nothing else:
1. Whether the company already does business with a named group or partner anywhere (use groupPresence).
2. Where a request is right now (use requestStatus; request ids look like R-MVY4OEBEBJ7W).
3. Why a request was flagged in the duplicate check (use whyFlagged).
Call exactly one tool, then answer in one plain sentence that only states what the tool returned. Never invent an id, a number or a region. If the tool found nothing, say so. If whyFlagged returns outcome no_match, say the request was not flagged and went straight to review. If the question is not one of the three kinds, do not call a tool; reply exactly: I can't answer that here. Try the search box or the request page.`

export type ToolName = 'groupPresence' | 'requestStatus' | 'whyFlagged'
// The readers are injectable so the eval can run the real model over fixture data without a database.
export type Readers = { presence: (p: Principal, name: string) => Promise<unknown>; status: (p: Principal, id: string) => Promise<unknown>; whyFlagged: (p: Principal, id: string) => Promise<unknown> }
export const dbReaders: Readers = { presence: readGroupPresence, status: readRequestStatus, whyFlagged: readWhyFlagged }

export type AskOutcome =
  | { ai: 'available'; answer: string | null; tool: ToolName | null; input: unknown; result: unknown; model: string; cost: number | null; usage: { inputTokens: number; outputTokens: number } | null; note: string | null }
  | { ai: 'unavailable'; reason: string }

export async function askHub(principal: Principal, question: string, readers: Readers = dbReaders): Promise<AskOutcome> {
  const q = question.trim().slice(0, 300)
  if (!q) return { ai: 'unavailable', reason: 'empty' }
  const primary = process.env.AI_PRIMARY_MODEL ?? 'anthropic/claude-haiku-4.5'
  const fallback = process.env.AI_FALLBACK_MODEL
  const virtual = primary.startsWith('vmc/')
  const tools = {
    groupPresence: tool({
      description: 'Whether the company already has customers or suppliers matching a group or partner name, in any region. Use for "do we already work with", "do we have", "is X a customer anywhere". Returns names and regions; ids and cities only for regions the person may see.',
      inputSchema: z.object({ name: z.string().min(2).describe('the group or partner name as the person wrote it') }),
      execute: ({ name }) => readers.presence(principal, name),
    }),
    requestStatus: tool({
      description: 'Where a partner request is right now: its state, the sentence shown on its page, the ERP number if assigned. Use when the question names a request id (R-...) and asks where it is, what happened, or whether it is done.',
      inputSchema: z.object({ requestId: z.string().regex(/^R-[A-Z0-9]{6,}$/i).describe('the request id, like R-MVY4OEBEBJ7W') }),
      execute: ({ requestId }) => readers.status(principal, requestId),
    }),
    whyFlagged: tool({
      description: 'Why a request was flagged by the duplicate check: the outcome, the record it was compared to, the requester\'s reason. Use when the question asks why a request was flagged, matched, blocked or marked as a duplicate.',
      inputSchema: z.object({ requestId: z.string().regex(/^R-[A-Z0-9]{6,}$/i) }),
      execute: ({ requestId }) => readers.whyFlagged(principal, requestId),
    }),
  }
  try {
    const result = await generateText({
      model: primary,
      instructions: ASK_INSTRUCTIONS,
      prompt: q,
      tools,
      stopWhen: stepCountIs(2),
      maxRetries: 0,
      timeout: { totalMs: 15_000 },
      providerOptions: { gateway: { ...(virtual ? {} : { models: fallback ? [fallback] : [], tags: ['ask'] }), zeroDataRetention: process.env.AI_ZERO_DATA_RETENTION !== 'false' } },
    })
    const call = result.steps.flatMap((s) => s.toolResults)[0]
    const gw = (result.providerMetadata as Record<string, Record<string, unknown>> | undefined)?.gateway
    const routing = gw?.routing as Record<string, unknown> | undefined
    const model = typeof routing?.canonicalSlug === 'string' ? routing.canonicalSlug : primary
    const text = result.text.trim()
    const toolName = (call?.toolName as ToolName | undefined) ?? null
    const toolResult = call ? call.output : null
    const ok = call ? citesOnlyKnown(text, toolResult) : true
    return {
      ai: 'available', answer: text && ok ? text : null, tool: toolName, input: call?.input ?? null, result: toolResult, model,
      cost: typeof gw?.cost === 'string' || typeof gw?.cost === 'number' ? Number(gw.cost) : null,
      usage: result.usage ? { inputTokens: Number(result.usage.inputTokens ?? 0), outputTokens: Number(result.usage.outputTokens ?? 0) } : null,
      note: !ok ? 'The model\'s sentence cited something the lookup did not return, so only the lookup is shown.' : null,
    }
  } catch (e) {
    return { ai: 'unavailable', reason: e instanceof Error ? e.message : 'model error' }
  }
}
