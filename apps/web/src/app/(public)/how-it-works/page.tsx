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
        <dt>IntakeForm</dt><dd><code>checkMatches</code> runs the hub check on the tax ID and the name before the rest of the form opens; <code>submitRequestAction</code> writes the request, its payload hash and the first revision, and starts the run.</dd>
        <dt>requestWorkflow</dt><dd>One durable run per request and revision. It registers the hook <code>finance:&lt;id&gt;:&lt;rev&gt;</code> (a second start finds the conflict and exits), then <code>openTicketStep</code> opens the ticket in the service desk, and the run waits for finance. The wait costs nothing and survives a redeploy and a rolling release. Finance decides in the desk; its signed webhook (<code>/api/webhooks/service-desk</code>) resumes the hook. A ticket raised in the desk first starts the run with finance&apos;s decision already in hand.</dd>
        <dt>checksStep</dt><dd>The checks run again after finance, because things change while a request waits. Every check holds: approved automatically. Anything else is an exception: the run waits on <code>review:&lt;id&gt;:&lt;rev&gt;</code> until the central team&apos;s <code>decideAction</code> approves, sends back or declines against the exact payload hash.</dd>
        <dt>erpWriteStep</dt><dd><code>createParty</code> sends one idempotent command keyed <code>intake:&lt;domain&gt;:&lt;id&gt;:revision:&lt;n&gt;</code>, authenticated with the deployment&apos;s own OIDC token. A transient answer throws <code>RetryableError</code> with backoff and the same key goes again; the last attempt hands its answer to <code>finishStep</code> instead, so nothing is created twice and nothing is left hanging.</dd>
        <dt>integration API</dt><dd>The customer&apos;s platform (here a stand-in) verifies the token against Vercel&apos;s published keys and the allowed subjects, routes to the right ERP, and keeps one ledger entry per key, so a lost response is replayed, not repeated.</dd>
        <dt>finishStep</dt><dd>Records the number, or a stop with its reason and whether the effect is known, and writes the outcome on the finance ticket. <code>hubLoadWorkflow</code>, nightly by Vercel Cron or on demand, loads new golden records into the hub and clears the search cache for the regions it touched.</dd>
      </dl>
      <p className="muted small" style={{ marginTop: 16 }}>Every choice and its trade-off is in <code>DECISIONS.md</code> in the repository. <Link href="/">Back to the hub</Link>.</p>
    </section>
  )
}
