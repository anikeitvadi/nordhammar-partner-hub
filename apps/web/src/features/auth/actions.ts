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

export async function signOut() {
  const supabase = await supabaseServer()
  await supabase.auth.signOut()
  redirect('/login')
}
