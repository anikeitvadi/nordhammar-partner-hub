import 'server-only'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function supabaseServer() {
  const cookieStore = await cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll() { return cookieStore.getAll() },
      setAll(toSet) {
        try { for (const { name, value, options } of toSet) cookieStore.set(name, value, options) } catch { /* called from a Server Component: the proxy refreshes the session instead */ }
      },
    },
  })
}
