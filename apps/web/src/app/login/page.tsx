import type { Metadata } from 'next'
import { Suspense } from 'react'
import { signIn } from '@/features/auth/actions'
import { SubmitButton } from '@/features/ui/submit-button.client'
import { CopyButton } from '@/features/ui/copy-button.client'
import { AsciiLedger } from '@/features/ui/ascii-ledger.client'
import { recentLedger } from '@/features/requests/ledger.server'

export const metadata: Metadata = { title: 'Sign in' }

// Error codes map to fixed copy. Query text is never rendered, so nobody can make the page show their own words
// inside an official-looking alert.
const ERRORS: Record<string, string> = {
  failed: 'Email or password is incorrect. Check them and try again, or ask IT to reset your access.',
  expired: 'Your session ended. Sign in again.',
}

// The front door: the statement and the ledger mark on the left, the sign-in form on the right, then the three demo
// people and three things to try, as plain ruled lists. Passwords travel in the submission email, never here.
const ROLES = [
  { who: 'Ana Silva', role: 'Regional user · Brazil', email: 'ana.requester@example.com', can: 'searches and requests in Brazil, sees Brazil amounts, cannot approve' },
  { who: 'Jonas Weber', role: 'Regional user · Europe', email: 'jonas.requester@example.com', can: 'the same, in Europe' },
  { who: 'Priya Nair', role: 'Central master data team · all regions', email: 'priya.reviewer@example.com', can: 'decides requests, fixes stopped ERP calls, runs the hub load, sees every amount' },
]
const TRY = [
  { text: <>Search <code>aurora</code> as Ana: one group, three establishments, two ERPs.</>, copy: 'aurora' },
  { text: <>Request a customer with CNPJ <code>61.000.101/0001-57</code>: the hub stops you, it already exists.</>, copy: '61.000.101/0001-57' },
  { text: <>Request <code>Aurora Industrial Nordeste</code> with CNPJ <code>12.345.678/0001-95</code>: no match, submit, approve it as finance in the service desk, and watch the hub create it on its own.</>, copy: '12.345.678/0001-95' },
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

async function Ledger() {
  const lines = await recentLedger()
  return <AsciiLedger lines={lines} />
}

export default function LoginPage({ searchParams }: { searchParams: Params }) {
  return (
    <section className="door">
      <div>
        <h1 className="door-title">One record for every partner, in every region.</h1>
        <p className="door-lede">Search before you request. Every customer and supplier we already have, in five regions and three ERPs, behind one search box. Finance approves, the ERP assigns the number, and the hub shows it.</p>
        <Suspense fallback={<div className="ledger" aria-hidden="true" />}>
          <Ledger />
        </Suspense>
      </div>
      <div className="door-side">
        <h2>Sign in</h2>
        <p className="muted small">Access is by region.</p>
        <Suspense fallback={<form className="door-form" aria-busy="true"><label>Email<input type="email" disabled /></label><label>Password<input type="password" disabled /></label><button type="button" disabled>Sign In</button></form>}>
          <SignInForm searchParams={searchParams} />
        </Suspense>
        <p className="muted small">No account? Ask IT to add you to a region group. Demo passwords are in the email that sent you here.</p>
      </div>
      <div className="door-more">
        <div>
          <h2>Three people, two roles</h2>
          <ul className="people">
            {ROLES.map((r) => <li key={r.email}><span><span className="who">{r.who}</span> <span className="muted">· {r.role}</span><span className="what">{r.email}: {r.can}</span></span><CopyButton text={r.email} /></li>)}
          </ul>
        </div>
        <div>
          <h2>Three things to try</h2>
          <ol className="try">
            {TRY.map((t, i) => <li key={i}><span>{t.text}</span><CopyButton text={t.copy} /></li>)}
          </ol>
        </div>
      </div>
      <p className="door-foot">Built on Next.js Cache Components, a durable workflow for the ERP write, OIDC to the ERP boundary, and one AI suggestion behind a validator. Every decision and its reason is in DECISIONS.md. <a href="/how-it-works">How it works</a></p>
    </section>
  )
}
