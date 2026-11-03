import type { ModelAttempt } from '@/features/ai/models'

// Shared by the server (agent.server.ts) and the page (ask-form.client.tsx); types only, so the client never imports a
// server module.
export type ToolName = 'groupPresence' | 'requestStatus' | 'whyFlagged' | 'partnersOnHold' | 'intakeThisMonth' | 'exposureByGroup'
export type AskOutcome =
  | { ai: 'available'; answer: string | null; tool: ToolName | null; input: unknown; result: unknown; model: string; cost: number | null; usage: { inputTokens: number; outputTokens: number } | null; note: string | null; attempts: ModelAttempt[]; ms: number }
  | { ai: 'unavailable'; reason: string }
// What the page receives, in order: the card as soon as the lookup returns, the checked sentence as it grows, then the
// totals. One path for the page and the eval: askHub (agent.server.ts) collects these same events.
export type AskEvent =
  | { type: 'card'; tool: ToolName; input: unknown; result: unknown }
  | { type: 'text'; text: string }
  | { type: 'done'; outcome: AskOutcome }
