import type { Metadata } from 'next'
import Link from 'next/link'
import { Blueprint } from '@/features/ui/blueprint'

export const metadata: Metadata = { title: 'How it works' }

// A static page: the blueprint and one line per box, in the names the code uses. Nothing here reads the database.
export default function HowItWorksPage() {
  return (
    <section>
      <h1>How a request becomes a number.</h1>
      <p className="runin"><strong>Six boxes, one write.</strong> The names are the names in the code; the request page highlights the box a live request is in.</p>
      <Blueprint />
      <dl className="facts narrow-wide" style={{ marginTop: 20 }}>
        <dt>IntakeForm</dt><dd><code>checkMatches</code> runs the hub check on the tax ID and the name before the rest of the form opens; <code>submitRequestAction</code> writes the request, its payload hash and the first revision, and starts the workflow run.</dd>
        <dt>reviewWorkflow</dt><dd>One durable run per request and revision. <code>createHook</code> with the token <code>review:&lt;id&gt;:&lt;rev&gt;</code> waits for the reviewer; a second start finds the conflict and exits. The wait costs nothing and survives a redeploy and a rolling release.</dd>
        <dt>decideAction</dt><dd>The reviewer approves, declines or sends back against the exact payload hash. <code>deliverPending</code> resumes the hook; if that delivery fails it is retried from the deliveries table by an operator.</dd>
        <dt>erpWriteStep</dt><dd><code>createParty</code> sends one idempotent command keyed <code>intake:&lt;domain&gt;:&lt;id&gt;:revision:&lt;n&gt;</code>, authenticated to the ERP boundary with the deployment&apos;s own OIDC token. A transient answer throws <code>RetryableError</code> with backoff; the same key goes again, so nothing is created twice.</dd>
        <dt>ERP stand-in</dt><dd><code>authenticate</code> verifies the token against Vercel&apos;s JWKS and the allowed subjects; <code>receive</code> commits the row and keeps one ledger entry per key, so a lost response is replayed, not repeated.</dd>
        <dt>finishStep</dt><dd>Records the number, or a stop with its reason and whether the effect is known. <code>dailyLoadAction</code> loads created partners into the hub and clears the search cache for their regions.</dd>
      </dl>
      <p className="muted small" style={{ marginTop: 16 }}>Every choice and its trade-off is in <code>DECISIONS.md</code> in the repository. <Link href="/">Back to the hub</Link>.</p>
    </section>
  )
}
