// Pure. Which model the hub asks, and what the Gateway says happened. Shared by the duplicate check and Ask, so the
// demo's model switch and the record of a fallback mean the same thing in both places.

// The choices behind the `ai-model` flag (docs/RUN-TRACE-CONTRACT.md §2). Each one passed the live eval before it was
// listed here. Tried on 2026-11-03 and left out (DECISIONS §6): gpt-5-mini, Gemini 2.5 Flash Lite, gpt-4.1-nano and gpt-4.1. 'configured' keeps the deployment's settings (on staging, a Gateway virtual model whose fallback chain
// and retention are pinned on the Gateway side). The others name a plain primary and a fallback in the request.
// 'haiku-first' is a real failover, not a staged one: the team's free Gateway credits refuse Haiku 4.5, so every call
// is served by the fallback, and the Gateway's routing block says so.
export const MODEL_CHOICES = {
  configured: { label: 'As configured', primary: null, fallback: null },
  'haiku-first': { label: 'Haiku 4.5 first, falls back to gpt-4.1-mini', primary: 'anthropic/claude-haiku-4.5', fallback: 'openai/gpt-4.1-mini' },
} as const satisfies Record<string, { label: string; primary: string | null; fallback: string | null }>
export type ModelChoice = keyof typeof MODEL_CHOICES
export const isModelChoice = (v: unknown): v is ModelChoice => typeof v === 'string' && Object.hasOwn(MODEL_CHOICES, v)

export type ModelRoute = { primary: string; fallback: string | null; virtual: boolean }

export function resolveModel(choice: ModelChoice, env: Record<string, string | undefined>): ModelRoute {
  const c = MODEL_CHOICES[choice]
  const primary = c.primary ?? env.AI_PRIMARY_MODEL ?? 'openai/gpt-4.1-mini'
  const fallback = c.primary ? c.fallback : env.AI_FALLBACK_MODEL || null
  return { primary, fallback, virtual: primary.startsWith('vmc/') }
}

// The Gateway options for one call. With a virtual model the chain, retention and tags live on the Gateway and win;
// zero data retention is asked for either way, because the prompt carries a counterparty's identity.
export function gatewayOptions(route: ModelRoute, tag: string, zdr: boolean) {
  return { gateway: { ...(route.virtual ? {} : { models: route.fallback ? [route.fallback] : [], tags: [tag] }), zeroDataRetention: zdr } }
}

export type ModelAttempt = { model: string; ok: boolean }
export type GatewayInfo = { served: string | null; attempts: ModelAttempt[]; cost: number | null; generationId: string | null }

// providerMetadata.gateway: routing.canonicalSlug is the model that answered; routing.modelAttempts lists every model
// tried, in order, with success. Shape verified against live responses on 2026-11-01 and 2026-11-03.
export function gatewayInfo(meta: unknown): GatewayInfo {
  const gw = obj(obj(meta)?.gateway)
  const routing = obj(gw?.routing)
  const attempts = Array.isArray(routing?.modelAttempts)
    ? routing.modelAttempts.map(obj).filter((a): a is Record<string, unknown> => !!a && typeof a.canonicalSlug === 'string').map((a) => ({ model: a.canonicalSlug as string, ok: a.success === true }))
    : []
  const served = typeof routing?.canonicalSlug === 'string' ? routing.canonicalSlug : attempts.find((a) => a.ok)?.model ?? null
  const cost = typeof gw?.cost === 'string' || typeof gw?.cost === 'number' ? Number(gw.cost) : null
  return { served, attempts, cost: Number.isFinite(cost) ? cost : null, generationId: typeof gw?.generationId === 'string' ? gw.generationId : null }
}

// "Haiku 4.5 refused, served by gpt-4.1-mini" style line; null when the first model answered.
export function describeFallback(attempts: ModelAttempt[] | null | undefined): string | null {
  if (!attempts || attempts.length < 2) return null
  const failed = attempts.filter((a) => !a.ok).map((a) => a.model)
  const ok = attempts.find((a) => a.ok)
  return failed.length ? `${failed.join(', ')} did not answer; served by ${ok?.model ?? 'no model'}` : null
}

function obj(v: unknown): Record<string, unknown> | null { return v && typeof v === 'object' ? (v as Record<string, unknown>) : null }
