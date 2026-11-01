import type { Metadata } from 'next'
import { requirePrincipal } from '@/features/auth/principal.server'
import { hasAnyRegion } from '@/features/auth/scope'
import { listMyRequests } from '@/features/requests/store.server'
import { AskForm } from '@/features/ask/ask-form.client'

export const metadata: Metadata = { title: 'Ask the hub' }

// The three questions a requester asks at the moment of intake, answered over the data they are allowed to see.
// Not a chat over the database and not the analytics layer: three typed lookups, one sentence, the card is the truth.
export default async function AskPage() {
  const principal = await requirePrincipal()
  if (!hasAnyRegion(principal)) return <section className="narrow card" style={{ marginTop: 48 }}><h1>Your account has no region yet</h1><p>Ask IT to add you to a region group.</p></section>
  const mine = await listMyRequests(principal)
  return (
    <section className="narrow-wide">
      <p className="eyebrow">Ask the hub</p>
      <h1>Three questions, answered over what you may see.</h1>
      <p className="runin"><strong>Do we already work with them? Where is my request? Why was it flagged?</strong> The answer is a lookup you can click into; the sentence under it is the model&apos;s reading of that lookup, and nothing else.</p>
      <AskForm exampleId={mine[0]?.requestId} />
      <p className="muted small" style={{ marginTop: 20 }}>Anything outside those three gets “I can&apos;t answer that here.” No tool writes; a wrong answer is a wrong card, never a wrong record.</p>
    </section>
  )
}
