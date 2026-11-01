import type { Metadata } from 'next'
import { requirePrincipal } from '@/features/auth/principal.server'
import { hasAnyRegion } from '@/features/auth/scope'
import { listMyRequests } from '@/features/requests/store.server'
import { AskForm } from '@/features/ask/ask-form.client'

export const metadata: Metadata = { title: 'Ask the hub' }

// Six questions over the master data hub, answered over the data the person is allowed to see: three a requester asks
// at the moment of intake, three a lead asks of the hub as a reporting layer. Not a chat over the database and not
// the analytics lake: six typed lookups, one sentence, the card is the truth, amounts gated by the money-regions rule.
export default async function AskPage() {
  const principal = await requirePrincipal()
  if (!hasAnyRegion(principal)) return <section className="narrow card" style={{ marginTop: 48 }}><h1>Your account has no region yet</h1><p>Ask IT to add you to a region group.</p></section>
  const mine = await listMyRequests(principal)
  return (
    <section className="narrow-wide">
      <p className="eyebrow">Ask the hub</p>
      <h1>Six questions, answered over what you may see.</h1>
      <p className="runin"><strong>Do we already work with them? Where is my request? Why was it flagged? Who is on hold? How fast is intake this month? What is our exposure to a group?</strong> The answer is a lookup you can click into; the sentence under it is the model&apos;s reading of that lookup, and nothing else. Amounts appear only for regions your role may see them in.</p>
      <AskForm exampleId={mine[0]?.requestId} />
      <p className="muted small" style={{ marginTop: 20 }}>Anything outside those six gets “I can&apos;t answer that here.” No tool writes; a wrong answer is a wrong card, never a wrong record.</p>
    </section>
  )
}
