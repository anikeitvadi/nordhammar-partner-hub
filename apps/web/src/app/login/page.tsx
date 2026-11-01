import type { Metadata } from 'next'
import { signIn } from '@/features/auth/actions'
import { SubmitButton } from '@/features/ui/submit-button.client'

export const metadata: Metadata = { title: 'Sign in' }

// Error codes map to fixed copy. Query text is never rendered, so nobody can make the page show their own words
// inside an official-looking alert.
const ERRORS: Record<string, string> = {
  failed: 'Email or password is incorrect. Check them and try again, or ask IT to reset your access.',
  expired: 'Your session ended. Sign in again.',
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const { error, next } = await searchParams
  const message = error ? (ERRORS[error] ?? ERRORS.failed) : null
  const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : ''
  return (
    <section className="narrow card" style={{ marginTop: 48 }}>
      <h1>Sign in</h1>
      <p>Find customers and suppliers across every region, or request a new one.</p>
      <form action={signIn} className="stack">
        {safeNext ? <input type="hidden" name="next" value={safeNext} /> : null}
        <label htmlFor="email">Email<input id="email" name="email" type="email" autoComplete="username" required autoFocus /></label>
        <label htmlFor="password">Password<input id="password" name="password" type="password" autoComplete="current-password" required /></label>
        {message ? <p role="alert" className="error">{message}</p> : null}
        <SubmitButton pendingLabel="Signing in…">Sign In</SubmitButton>
        <p className="muted small">Access is by region. No account? Ask IT to add you to a region group.</p>
      </form>
    </section>
  )
}
