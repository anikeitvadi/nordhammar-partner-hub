import type { Metadata } from 'next'
import { Suspense } from 'react'
import { signIn } from '@/features/auth/actions'
import { SubmitButton } from '@/features/ui/submit-button.client'
import { CopyButton } from '@/features/ui/copy-button.client'
import { FreshExample } from '@/features/ui/fresh-example.client'

export const metadata: Metadata = { title: 'Sign in' }

// Error codes map to fixed copy. Query text is never rendered, so nobody can make the page show their own words
// inside an official-looking alert.
const ERRORS: Record<string, string> = {
  failed: 'Email or password is incorrect. Check them and try again, or ask IT to reset your access.',
  expired: 'Your session ended. Sign in again.',
}

// The front door: the statement and the ledger mark on the left, the sign-in form on the right, then the three demo
// people and three things to try, as plain ruled lists. Passwords travel in the submission email, never here.
// Priya first: the central team sees the whole hub, so that is where a grader starts. Ana and Jonas are there to show
// what a regional user can and cannot see.
const ROLES = [
  { who: 'Priya Nair', role: 'Central master data team · all regions', email: 'priya.reviewer@example.com', can: 'Start here: every region, every amount, the final check on duplicates and group credit' },
  { who: 'Ana Silva', role: 'Sales operations · Brazil', email: 'ana.requester@example.com', can: 'Sets up the customers Brazil sells to: searches every region first, requests in Brazil, sees Brazil amounts only, cannot approve' },
  { who: 'Jonas Weber', role: 'Procurement · Europe', email: 'jonas.requester@example.com', can: 'Sets up the suppliers Europe buys from, the same way' },
]
const TRY: { text: React.ReactNode; copy?: string }[] = [
  { text: <>As Priya, search <code>aurora</code>: one group, three companies in two regions on two ERPs; open one to see its credit.</>, copy: 'aurora' },
  { text: <>Request a customer with CNPJ <code>61.000.101/0001-57</code>: the hub stops you, it already exists.</>, copy: '61.000.101/0001-57' },
  { text: <FreshExample /> },
  { text: <>Open Exceptions and a request that adds a company to the Aurora group: before approving, Priya sees what the group already holds in every region.</> },
  { text: <>Sign in as Ana and search <code>aurora</code> again: she sees every company, but not Europe&rsquo;s terms or credit. Ask &ldquo;What is the credit limit of Aurora Nordic AB?&rdquo; and no figure comes back.</> },
]

type Params = Promise<{ error?: string; next?: string }>

// The form is the only part that reads the URL (the error code, the next path), so it is the only dynamic hole.
// Everything else on the door is prerendered: the first paint is the whole page, not a skeleton.
async function SignInForm({ searchParams }: { searchParams: Params }) {
  const { error, next } = await searchParams
  const message = error ? (ERRORS[error] ?? ERRORS.failed) : null
  const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : ''
  return (
    <form action={signIn} className="door-form">
      {safeNext ? <input type="hidden" name="next" value={safeNext} /> : null}
      <label htmlFor="email">Email<input id="email" name="email" type="email" autoComplete="username" required autoFocus /></label>
      <label htmlFor="password">Password<input id="password" name="password" type="password" autoComplete="current-password" required /></label>
      {message ? <p role="alert" className="error small">{message}</p> : null}
      <SubmitButton pendingLabel="Signing in…">Sign In</SubmitButton>
    </form>
  )
}

// One grid, two columns that answer two questions. Left: what this is and what to do in it. Right: who you can be,
// and the door. Both columns share one top and one left edge with the wordmark and the foot, at every width.
export default function LoginPage({ searchParams }: { searchParams: Params }) {
  return (
    <section className="door">
      <div className="door-intro">
        <h1 className="door-title">One record for every partner, in every region.</h1>
        <p className="door-lede">Search before you request. Every customer and supplier, in five regions and three ERPs, behind one search box. Finance approves in its service desk, the ERP assigns the number, and the hub shows it.</p>
        <p className="door-brief"><a href="/brief">Read the brief</a>: the problem, the architecture, the Vercel choices and the rollout, on one page.</p>
      </div>
      <div className="door-try">
        <h2>Five things to try</h2>
        <ol className="try">
          {TRY.map((t, i) => <li key={i}><span>{t.text}</span>{t.copy ? <CopyButton text={t.copy} /> : <span />}</li>)}
        </ol>
      </div>
      <aside className="door-side">
        <h2>Sign in</h2>
        <Suspense fallback={<form className="door-form" aria-busy="true"><label>Email<input type="email" disabled /></label><label>Password<input type="password" disabled /></label><button type="button" disabled>Sign In</button></form>}>
          <SignInForm searchParams={searchParams} />
        </Suspense>
        <p className="muted small">Demo passwords are in the email that sent you here. No account? Ask IT to add you to a region group.</p>
        <h2>Three people, two roles</h2>
        <ul className="people">
          {ROLES.map((r) => <li key={r.email}><span><span className="who">{r.who}</span><span className="role">{r.role}</span><span className="what">{r.can}</span><code className="email">{r.email}</code></span><CopyButton text={r.email} /></li>)}
        </ul>
      </aside>
      <p className="door-foot">Built on Next.js Cache Components, Vercel Workflows for the wait on finance and the one ERP write, OIDC to the integration platform, and AI Gateway behind every model call. <a href="/how-it-works">How it works</a></p>
    </section>
  )
}
