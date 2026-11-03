import type { Metadata } from 'next'
import { requirePrincipal } from '@/features/auth/principal.server'
import { hasAnyRegion } from '@/features/auth/scope'
import { AskForm } from '@/features/ask/ask-form.client'
import { suggestQuestions } from '@/features/ask/suggest.server'

export const metadata: Metadata = { title: 'Ask' }

// Questions about the hub, answered over the data the person is allowed to see. Three lookups of one record, and one
// typed query for any count or total (docs/QUERY-SPEC-CONTRACT.md): the model fills a spec, code checks and runs it,
// the answer is a number or a chart with the query written out under it. Not a chat over the database.
export default async function AskPage() {
  const principal = await requirePrincipal()
  if (!hasAnyRegion(principal)) return <section className="narrow"><h1>Your account has no region yet</h1><p>Ask IT to add you to a region group.</p></section>
  const suggested = await suggestQuestions(principal)
  return (
    <section className="narrow-wide">
      <h1>Ask about partners, requests and checks.</h1>
      <p className="runin"><strong>Do we already work with them? Where is my request? How many are on hold, by region? How fast do numbers come back?</strong> Counts and totals come back as a number or a chart, with the query written out under it; amounts only for the regions you may see them in.</p>
      <AskForm suggested={suggested} />
    </section>
  )
}
