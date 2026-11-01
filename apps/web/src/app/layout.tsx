import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { GeistSerif } from 'geist/font/serif'
import { Suspense } from 'react'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { VercelToolbar } from '@vercel/toolbar/next'
import './globals.css'
import { Shell } from '@/features/ui/shell.server'

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
        <Suspense fallback={<><header className="shell-header"><span className="shell-brand">Nordhammar <span>Partner Hub</span></span></header><main className="shell-main"><section aria-busy="true" aria-label="Loading"><div className="skeleton skeleton-title" /><div className="skeleton skeleton-line" /><div className="skeleton skeleton-block" /></section></main></>}>
          <Shell>
            <Suspense fallback={<section aria-busy="true" aria-label="Loading"><div className="skeleton skeleton-title" /><div className="skeleton skeleton-line" /><div className="skeleton skeleton-block" /></section>}>{children}</Suspense>
          </Shell>
        </Suspense>
        {/* Real Core Web Vitals and page views for DECISIONS §6: measured, not claimed. Both are first-party scripts; no cookies. */}
        <SpeedInsights />
        <Analytics />
        {/* The toolbar is where the demo flags are flipped in the room. It renders only for Vercel team members. */}
        {process.env.TOOLBAR_ENABLED === 'true' ? <VercelToolbar /> : null}
      </body>
    </html>
  )
}
