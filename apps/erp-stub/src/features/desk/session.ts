import { cookies } from 'next/headers'

// The desk's own sign-in, separate from the hub's: one demo finance user, password from DESK_UI_PASSWORD. The cookie
// holds a hash of the password, so changing the password signs everyone out. No password configured: no one gets in.
export const FINANCE_USER = 'Marta Lindqvist, Finance'
const COOKIE = 'desk_session'

async function token(password: string): Promise<string> {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`desk-session:${password}`))
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, '0')).join('')
}
export async function signedIn(): Promise<boolean> {
  const pw = process.env.DESK_UI_PASSWORD
  if (!pw) return false
  return (await cookies()).get(COOKIE)?.value === (await token(pw))
}
export async function signIn(password: string): Promise<boolean> {
  const pw = process.env.DESK_UI_PASSWORD
  if (!pw || password !== pw) return false
  ;(await cookies()).set(COOKIE, await token(pw), { httpOnly: true, secure: true, sameSite: 'lax', path: '/desk', maxAge: 60 * 60 * 12 })
  return true
}
export async function signOut(): Promise<void> { (await cookies()).delete(COOKIE) }
