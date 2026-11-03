import { stepCountIs, streamText, tool } from 'ai'
import { z } from 'zod'
import type { Principal } from '@/features/auth/scope'
import { readExposure, readGroupPresence, readIntakeThisMonth, readOnHold, readRequestStatus, readWhyFlagged } from './tools.server'
import { releaseChecked, sumSteps } from './stream'
import { gatewayOptions, resolveModel, type ModelRoute } from '@/features/ai/models'
import type { AskEvent, AskOutcome, ToolName } from './types'

export type { AskEvent, AskOutcome, ToolName } from './types'

// "Ask the hub": one question, one streamed model call, six typed read-only tools, two steps at most (one to look,
// one to speak). The card the page renders is the tool result, which is the truth; the sentence is the model's
// reading of that card and is dropped if it cites anything the card does not contain. Same virtual model, failover
// and zero data retention as the proposal agent. No tool writes; a wrong answer is a wrong card, never a wrong write.

export const ASK_INSTRUCTIONS = `You answer six kinds of question about a company's partner hub, and nothing else:
1. Whether the company already does business with a named group or partner anywhere (groupPresence).
2. Where a request is right now (requestStatus; request ids look like R-MVY4OEBEBJ7W).
3. Why a request was flagged in the duplicate check (whyFlagged).
4. How many partners are on hold, overall or in one region (partnersOnHold; regions are BR, EU, US, IN, CN).
5. How many requests were raised or created this month and how fast (intakeThisMonth).
6. The company's credit exposure to a corporate group, or overall (exposureByGroup).
Call exactly one tool, then answer in one plain sentence that only states what the tool returned. Never invent an id, a number, an amount or a region. If the tool found nothing, say so. If whyFlagged returns outcome no_match, say the request was not flagged and went straight to review. If a tool's note says the person is not entitled to amounts, say that instead of a number. If the question is not one of the six kinds, do not call a tool; reply exactly: I can't answer that here. Try the search box or the request page.`

// The readers are injectable so the eval can run the real model over fixture data without a database.
export type Readers = { presence: (p: Principal, name: string) => Promise<unknown>; status: (p: Principal, id: string) => Promise<unknown>; whyFlagged: (p: Principal, id: string) => Promise<unknown>; onHold: (p: Principal, region?: string) => Promise<unknown>; intake: (p: Principal) => Promise<unknown>; exposure: (p: Principal, group?: string) => Promise<unknown> }
export const dbReaders: Readers = { presence: readGroupPresence, status: readRequestStatus, whyFlagged: readWhyFlagged, onHold: readOnHold, intake: readIntakeThisMonth, exposure: readExposure }


// The six lookups, each calling the same scoped reader the pages call, with the person closed over in code.
function askTools(principal: Principal, readers: Readers) {
  return {
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
    partnersOnHold: tool({
      description: 'How many customers and suppliers are on hold, by region, with the oldest last activity. Use for "on hold", "blocked partners", "inactive". Optional region code BR, EU, US, IN or CN.',
      inputSchema: z.object({ region: z.enum(['BR', 'EU', 'US', 'IN', 'CN']).optional() }),
      execute: ({ region }) => readers.onHold(principal, region),
    }),
    intakeThisMonth: tool({
      description: 'Requests raised this month by state (submitted, under review, created, stopped...) with the median hours from submitted to created. Use for "how many requests", "how fast", "this month", "cycle time".',
      inputSchema: z.object({}),
      execute: () => readers.intake(principal),
    }),
    exposureByGroup: tool({
      description: 'Credit exposure: credit limits summed per currency by ultimate parent group, over the regions the person may see amounts for. Use for "exposure", "credit limit", "how much credit", "how big is our risk with". Optional group name filter.',
      inputSchema: z.object({ group: z.string().min(2).optional().describe('part of the group or parent name, if the question names one') }),
      execute: ({ group }) => readers.exposure(principal, group),
    }),
  }
}


const NOTE_UNCITED = 'The model\'s sentence cited something the lookup did not return, so only the lookup is shown.'

export async function* askEvents(principal: Principal, question: string, readers: Readers = dbReaders, route: ModelRoute = resolveModel('configured', process.env)): AsyncGenerator<AskEvent> {
  const q = question.trim().slice(0, 300)
  if (!q) { yield { type: 'done', outcome: { ai: 'unavailable', reason: 'empty' } }; return }
  const t0 = Date.now()
  let call: { tool: ToolName; input: unknown; result: unknown } | null = null
  let text = '', shown = '', ok = true
  const metas: unknown[] = []
  let usage: { inputTokens: number; outputTokens: number } | null = null
  try {
    const result = streamText({
      model: route.primary,
      instructions: ASK_INSTRUCTIONS,
      prompt: q,
      tools: askTools(principal, readers),
      stopWhen: stepCountIs(2),
      maxRetries: 0,
      timeout: { totalMs: 15_000 },
      providerOptions: gatewayOptions(route, 'ask', process.env.AI_ZERO_DATA_RETENTION !== 'false'),
    })
    for await (const part of result.stream) {
      if (part.type === 'tool-result' && !call) {
        call = { tool: part.toolName as ToolName, input: part.input, result: part.output }
        yield { type: 'card', ...call }
      } else if (part.type === 'text-delta' && ok) {
        text += part.text
        const r = releaseChecked(text, call?.result ?? null, call !== null, false)
        if (!r.ok) ok = false
        else if (r.shown !== shown) { shown = r.shown; yield { type: 'text', text: shown } }
      } else if (part.type === 'finish-step') {
        metas.push(part.providerMetadata)
      } else if (part.type === 'finish') {
        usage = { inputTokens: Number(part.totalUsage.inputTokens ?? 0), outputTokens: Number(part.totalUsage.outputTokens ?? 0) }
      } else if (part.type === 'error') {
        throw part.error
      }
    }
  } catch (e) {
    // The page shows a plain note; the cause goes to the runtime log so a failure on a deployment can be diagnosed.
    console.error('ask: model call failed', { model: route.primary, error: e instanceof Error ? `${e.name}: ${e.message}` : String(e) })
    yield { type: 'done', outcome: { ai: 'unavailable', reason: e instanceof Error ? e.message : 'model error' } }
    return
  }
  const final = ok ? releaseChecked(text.trim(), call?.result ?? null, call !== null, true) : { shown: '', ok: false }
  const gw = sumSteps(metas)
  yield { type: 'done', outcome: {
    ai: 'available', answer: final.ok && final.shown ? final.shown : null, tool: call?.tool ?? null, input: call?.input ?? null, result: call?.result ?? null,
    model: gw.served ?? route.primary, cost: gw.cost, attempts: gw.attempts, ms: Date.now() - t0, usage,
    note: final.ok ? null : NOTE_UNCITED,
  } }
}

// The whole answer at once, from the same events: what the eval grades.
export async function askHub(principal: Principal, question: string, readers: Readers = dbReaders, route: ModelRoute = resolveModel('configured', process.env)): Promise<AskOutcome> {
  let outcome: AskOutcome = { ai: 'unavailable', reason: 'no answer' }
  for await (const e of askEvents(principal, question, readers, route)) if (e.type === 'done') outcome = e.outcome
  return outcome
}
