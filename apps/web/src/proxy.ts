import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { supabaseEnv } from '@/features/auth/env'

// Runs on every matched request. Refreshes the Supabase session cookie, verifies the token's claims locally (no
// round trip to the auth server; the server modules do the verified getUser), and sends anonymous users to /login.
// It does NOT decide what a user may see; that is the server modules' job with fresh entitlements.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })
  const { url: supabaseUrl, publishableKey } = supabaseEnv()
  const supabase = createServerClient(supabaseUrl, publishableKey, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll(toSet) {
        for (const { name, value } of toSet) request.cookies.set(name, value)
        response = NextResponse.next({ request })
        for (const { name, value, options } of toSet) response.cookies.set(name, value, options)
      },
    },
  })
  const { data } = await supabase.auth.getClaims()
  const isLogin = request.nextUrl.pathname.startsWith('/login')
  if (!data?.claims && !isLogin) {
    // Keep the deep link: after sign-in the user lands where they were going (same-origin path only).
    const url = request.nextUrl.clone(); const wanted = request.nextUrl.pathname + request.nextUrl.search
    url.pathname = '/login'; url.search = wanted && wanted !== '/' && !wanted.startsWith('/api/') ? `?next=${encodeURIComponent(wanted)}` : ''
    return NextResponse.redirect(url)
  }
  return response
}

// .well-known/workflow is the SDK's own queue/webhook surface; the proxy must not touch it (local runs fail otherwise).
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|\\.well-known/workflow).*)'] }
