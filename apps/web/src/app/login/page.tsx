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

// The front door is a grid of five tiles: one hero (the product line and a real result row), the sign-in card,
// one big number, the three demo roles, and three things to try. Passwords travel in the submission email, never here.
const ROLES = [
  { who: 'Ana Silva', role: 'Regional user · Brazil', email: 'ana.requester@example.com', tone: 'a', can: 'searches and requests in Brazil, sees Brazil amounts, cannot approve' },
  { who: 'Jonas Weber', role: 'Regional user · Europe', email: 'jonas.requester@example.com', tone: 'b', can: 'the same, in Europe' },
  { who: 'Priya Nair', role: 'Central master data team · all regions', email: 'priya.reviewer@example.com', tone: 'c', can: 'decides requests, fixes stopped ERP calls, runs the hub load, sees every amount' },
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
    <form action={signIn} className="door-form tile-body">
      {safeNext ? <input type="hidden" name="next" value={safeNext} /> : null}
      <label htmlFor="email">Email<input id="email" name="email" type="email" autoComplete="username" required autoFocus /></label>
      <label htmlFor="password">Password<input id="password" name="password" type="password" autoComplete="current-password" required /></label>
      {message ? <p role="alert" className="error small">{message}</p> : null}
      <SubmitButton pendingLabel="Signing in…">Sign in</SubmitButton>
    </form>
  )
}

async function Ledger() {
  const lines = await recentLedger()
  return <AsciiLedger lines={lines} />
}

export default function LoginPage({ searchParams }: { searchParams: Params }) {
  return (
    <section className="door grain">
      <div className="door-head">
        <p className="eyebrow">Nordhammar Industries · master data</p>
        <h1 className="door-title">One record for every partner, in every region.</h1>
        <p className="runin"><strong>Search before you request.</strong> A reviewer approves, the ERP assigns the number, and the hub shows it the next morning.</p>
      </div>
      <div className="bento">
        <div className="tile span2">
          <p className="runin"><strong>Every customer and supplier we already have.</strong> Five regions, three ERPs, one search box.</p>
          <div className="tile-body fragment" aria-hidden="true">
            <ul className="rows">
              <li className="nolead"><span><span className="t">Aurora Industrial Ltda</span><span className="s">Cidade Exemplo · BR · ERP-1 110001</span></span><span className="badge badge-created">Active</span></li>
              <li className="nolead"><span><span className="t">Aurora Nordic AB</span><span className="s">Göteborg · EU · ERP-2 210006</span></span><span className="badge badge-created">Active</span></li>
              <li className="nolead"><span><span className="t">Vela Processos</span><span className="s">Cidade Exemplo · BR · ERP-1 110002</span></span><span className="badge badge-stopped">On hold</span></li>
            </ul>
          </div>
        </div>
        <div className="tile signin">
          <p className="runin"><strong>Sign in.</strong> Access is by region.</p>
          <Suspense fallback={<form className="door-form tile-body" aria-busy="true"><label>Email<input type="email" disabled /></label><label>Password<input type="password" disabled /></label><button type="button" disabled>Sign in</button></form>}>
            <SignInForm searchParams={searchParams} />
          </Suspense>
          <p className="muted small door-foot" style={{ margin: 0 }}>No account? Ask IT to add you to a region group. Demo passwords are in the email that sent you here.</p>
        </div>
        <div className="tile dark">
          <p className="runin"><strong>One search</strong> across the whole company.</p>
          <div className="tile-body"><div className="stat">5<small>regions</small></div><p className="stat-label">Brazil, the US, India, China and Europe; three ERPs; one record per legal entity, checked on the tax ID before a request can continue.</p></div>
        </div>
        <div className="tile">
          <p className="runin"><strong>Three people, two roles.</strong> Sign in as any of them.</p>
          <ul className="rows tile-body">
            {ROLES.map((r) => <li key={r.email}><span className={`avatar ${r.tone}`}>{r.who.split(' ').map((w) => w[0]).join('')}</span><span><span className="t">{r.who}</span><span className="s">{r.role}</span><span className="s">{r.email}</span></span><CopyButton text={r.email} /></li>)}
          </ul>
        </div>
        <div className="tile">
          <p className="runin"><strong>Three things to try.</strong> Each takes under a minute.</p>
          <ol className="try tile-body">
            {TRY.map((t, i) => <li key={i}><span>{t.text}</span><CopyButton text={t.copy} /></li>)}
          </ol>
        </div>
        <div className="tile span3 ledger-tile">
          <p className="runin"><strong>The mark, in ledger text.</strong> Request ids, partner names and status words from the demo hub, reflowing slowly. Measured with Pretext, drawn in Geist Mono.</p>
          <Suspense fallback={<div className="ledger" aria-hidden="true" />}>
            <Ledger />
          </Suspense>
        </div>
        <div className="tile well span3">
          <p className="runin"><strong>What it runs on.</strong> Next.js Cache Components, a durable workflow for the ERP write, OIDC to the ERP boundary, one AI suggestion behind a validator.</p>
          <p className="muted small tile-body" style={{ margin: 0 }}>Every decision and its reason is in DECISIONS.md in the repository. <a href="/how-it-works">How it works →</a></p>
        </div>
      </div>
    </section>
  )
}
