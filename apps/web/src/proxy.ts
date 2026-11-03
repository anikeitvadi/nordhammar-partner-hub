import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { supabaseEnv } from '@/features/auth/env'

// Runs on every matched request. Refreshes the Supabase session cookie, verifies the token's claims locally (no
// round trip to the auth server; the server modules do the verified getUser), and sends anonymous users to /login.
// It does NOT decide what a user may see; that is the server modules' job with fresh entitlements.
export async function proxy(request: NextRequest) {
  // Where the person was going, for requirePrincipal's redirect when the server's verified check fails (a revoked
  // session can still carry claims that pass the local check below). Always overwritten, never taken from the client.
  request.headers.set('x-hub-path', request.nextUrl.pathname + request.nextUrl.search)
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
  // Public: the sign-in door, How it works, the brief, the link-preview image and the icon. Everything else needs a session.
  const path = request.nextUrl.pathname
  // The cron route and the service-desk webhook have no session; each checks its own secret and refuses everything else.
  const isPublic = path.startsWith('/login') || path === '/api/cron/hub-load' || path === '/api/webhooks/service-desk' || path === '/how-it-works' || path === '/brief' || path === '/opengraph-image' || path === '/icon.svg'
  if (!data?.claims && !isPublic) {
    // Keep the deep link: after sign-in the user lands where they were going (same-origin path only).
    const url = request.nextUrl.clone(); const wanted = request.nextUrl.pathname + request.nextUrl.search
    url.pathname = '/login'; url.search = wanted && wanted !== '/' && !wanted.startsWith('/api/') ? `?next=${encodeURIComponent(wanted)}` : ''
    return NextResponse.redirect(url)
  }
  return response
}

// .well-known/workflow is the SDK's own queue/webhook surface; the proxy must not touch it (local runs fail otherwise).
// _vercel is the platform's own (Speed Insights); a sign-in redirect there would hand the browser HTML as a script.
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|\\.well-known/workflow|\\.well-known/vercel|_vercel).*)'] }
