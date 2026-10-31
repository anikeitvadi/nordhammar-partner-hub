import 'server-only'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseEnv } from './env'

export async function supabaseServer() {
  const cookieStore = await cookies()
  const { url, publishableKey } = supabaseEnv()
  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() { return cookieStore.getAll() },
      setAll(toSet) {
        try { for (const { name, value, options } of toSet) cookieStore.set(name, value, options) } catch { /* called from a Server Component: the proxy refreshes the session instead */ }
      },
    },
  })
}
