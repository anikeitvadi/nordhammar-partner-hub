import { gatewayInfo, type ModelAttempt } from '@/features/ai/models'
import { citesOnlyKnown } from './view'

// Pure. What the streamed answer may show, and what the whole answer cost. Tested without a model.

// The sentence streams, but nothing reaches the screen before the citation rule has checked it. Text is released up
// to the last word boundary only, so an id or a number is checked whole, never half-typed. The first uncited token
// stops the sentence: what was shown was all checked, and the card then stands alone with the note.
// `validate` is false when no lookup ran (the "I can't answer that here" reply), as in the non-streamed answer.
export function releaseChecked(text: string, result: unknown, validate: boolean, final: boolean): { shown: string; ok: boolean } {
  const cut = final ? text.length : Math.max(text.search(/\s+\S*$/), 0)
  const shown = text.slice(0, cut).trimEnd()
  if (validate && !citesOnlyKnown(shown, result)) return { shown: '', ok: false }
  return { shown, ok: true }
}

// An answer is up to two model calls (pick the lookup, then say what it found). The Gateway reports each step's
// cost and routing separately; the answer's cost is their sum, and the models tried are every step's, in order,
// without repeats. The result's top-level providerMetadata is the last step only, which undercounted before step 8.
export function sumSteps(metas: unknown[]): { served: string | null; attempts: ModelAttempt[]; cost: number | null } {
  const infos = metas.map(gatewayInfo)
  const costs = infos.map((i) => i.cost).filter((c): c is number => c != null)
  const attempts: ModelAttempt[] = []
  for (const a of infos.flatMap((i) => i.attempts)) if (!attempts.some((x) => x.model === a.model && x.ok === a.ok)) attempts.push(a)
  return { served: [...infos].reverse().find((i) => i.served)?.served ?? null, attempts, cost: costs.length ? costs.reduce((a, b) => a + b, 0) : null }
}
