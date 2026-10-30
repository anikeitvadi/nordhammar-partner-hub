import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { GeistSerif } from 'geist/font/serif'
import Link from 'next/link'
import { Suspense } from 'react'
import './globals.css'
import { getPrincipal } from '@/features/auth/principal.server'
import { visibleRegions } from '@/features/auth/scope'
import { signOut } from '@/features/auth/actions'

export const metadata: Metadata = { title: 'Customer Intake', description: 'Search the hub. Request a customer. One review. The ERP owns the number.' }

// Cache Components: the shell (header frame, main frame) is prerendered as static HTML. The two holes that depend on
// the request, who is signed in and the page itself, stream in behind Suspense. That is the whole rendering model.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${GeistSerif.variable}`}>
      <body>
        <header className="shell-header">
          <Link href="/" className="shell-brand">Customer Intake</Link>
          <Suspense fallback={<span className="shell-region">…</span>}>
            <Identity />
          </Suspense>
        </header>
        <main className="shell-main">
          <Suspense fallback={<p>Loading…</p>}>{children}</Suspense>
        </main>
      </body>
    </html>
  )
}

async function Identity() {
  const principal = await getPrincipal()
  if (!principal) return null
  return (
    <span className="shell-region">
      <Link href="/requests">My requests</Link>{principal.globalIdentity ? <> · <Link href="/reviews">Reviews</Link> · <Link href="/operations">Operations</Link></> : null} · {visibleRegions(principal).join(', ') || 'no region'} · {principal.displayName} · {principal.role}
      <form action={signOut} className="inline"><button type="submit" className="link">Sign out</button></form>
    </span>
  )
}
