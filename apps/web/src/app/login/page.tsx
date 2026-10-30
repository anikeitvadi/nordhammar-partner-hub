import { signIn } from '@/features/auth/actions'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams
  return (
    <section className="narrow">
      <h1>Sign in</h1>
      <p>Test accounts only. Credentials are handed over privately.</p>
      <form action={signIn} className="stack">
        <label>Email <input name="email" type="email" autoComplete="username" required /></label>
        <label>Password <input name="password" type="password" autoComplete="current-password" required /></label>
        {error ? <p role="alert" className="error">{error}</p> : null}
        <button type="submit">Sign in</button>
      </form>
    </section>
  )
}
