'use server'
import { redirect } from 'next/navigation'
import { supabaseServer } from './supabase.server'

export async function signIn(formData: FormData) {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  // The post-sign-in destination is a same-origin path from the form; anything else is ignored.
  const next = String(formData.get('next') ?? '')
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/'
  const supabase = await supabaseServer()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) redirect(`/login?error=failed${safeNext !== '/' ? `&next=${encodeURIComponent(safeNext)}` : ''}`)
  redirect(safeNext)
}

// This browser only. Supabase's default ends every session of the person, and the demo's people are shared by
// everyone trying it, so one sign-out would sign out every other viewer.
export async function signOut() {
  const supabase = await supabaseServer()
  await supabase.auth.signOut({ scope: 'local' })
  redirect('/login')
}
