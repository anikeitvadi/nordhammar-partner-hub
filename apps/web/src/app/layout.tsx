import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { GeistSerif } from 'geist/font/serif'
import Link from 'next/link'
import { Suspense } from 'react'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { VercelToolbar } from '@vercel/toolbar/next'
import './globals.css'
import { getPrincipal } from '@/features/auth/principal.server'
import { visibleRegions } from '@/features/auth/scope'
import { signOut } from '@/features/auth/actions'
import { ShellNav } from '@/features/ui/shell-nav.client'

export const metadata: Metadata = {
  title: { template: '%s · Nordhammar Partner Hub', default: 'Nordhammar Partner Hub' },
  description: 'Find customers and suppliers across every region, request new ones, and watch the ERP assign the number.',
}

// Cache Components: the shell (header frame, main frame) is prerendered as static HTML. The two holes that depend on
// the request, who is signed in and the page itself, stream in behind Suspense. That is the whole rendering model.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${GeistSerif.variable}`}>
      <body>
        <header className="shell-header">
          <Link href="/" className="shell-brand">Nordhammar <span>Partner Hub</span>{process.env.APP_VERSION_LABEL ? <em className="version">{process.env.APP_VERSION_LABEL}</em> : null}</Link>
          <Suspense fallback={<span className="shell-who" style={{ minWidth: 220 }}>&nbsp;</span>}>
            <Identity />
          </Suspense>
        </header>
        <main className="shell-main">
          <Suspense fallback={<section aria-busy="true" aria-label="Loading"><div className="skeleton skeleton-title" /><div className="skeleton skeleton-line" /><div className="skeleton skeleton-block" /></section>}>{children}</Suspense>
        </main>
        {/* Real Core Web Vitals and page views for DECISIONS §6: measured, not claimed. Both are first-party scripts; no cookies. */}
        <SpeedInsights />
        <Analytics />
        {/* The toolbar is where the demo flags are flipped in the room. It renders only for Vercel team members. */}
        {process.env.TOOLBAR_ENABLED === 'true' ? <VercelToolbar /> : null}
      </body>
    </html>
  )
}

async function Identity() {
  const principal = await getPrincipal()
  if (!principal) return null
  return (
    <span className="shell-region">
      <ShellNav items={[{ href: '/customers', label: 'Customers' }, { href: '/suppliers', label: 'Suppliers' }, { href: '/requests', label: 'My requests' }, ...(principal.globalIdentity ? [{ href: '/reviews', label: 'Reviews' }, { href: '/operations', label: 'Operations' }, { href: '/reports', label: 'Reports' }] : [])]} />
      <span className="shell-who"><span className="badge badge-region">{principal.globalIdentity ? 'All regions' : visibleRegions(principal).join(', ') || 'No region'}</span> {principal.displayName} · {principal.role}</span>
      <form action={signOut} className="inline"><button type="submit" className="link">Sign out</button></form>
    </span>
  )
}
