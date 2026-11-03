import { loginAction } from '@/features/desk/actions'

export default async function DeskLogin({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const { error, next } = await searchParams
  return (
    <div className="box" style={{ maxWidth: 360, margin: '40px auto' }}>
      <h1>Sign in</h1>
      <p className="muted">Finance, demo user. The password is in the email that sent you here.</p>
      {error ? <p className="err">That password is not right.</p> : null}
      <form action={loginAction}>{next ? <input type="hidden" name="next" value={next} /> : null}<label htmlFor="pw">Password</label><input id="pw" name="password" type="password" autoComplete="current-password" required /><p><button type="submit">Sign in</button></p></form>
    </div>
  )
}
