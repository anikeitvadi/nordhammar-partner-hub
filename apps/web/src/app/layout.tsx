import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { GeistSerif } from 'geist/font/serif'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { VercelToolbar } from '@vercel/toolbar/next'
import './globals.css'

export const metadata: Metadata = {
  title: { template: '%s · Nordhammar Partner Hub', default: 'Nordhammar Partner Hub' },
  description: 'Find customers and suppliers across every region, request new ones, and watch the ERP assign the number.',
}

// The bare document: fonts, styles, Speed Insights. Each route group brings its own frame: (public) a static bar for
// the sign-in door and How it works, (hub) the signed-in rail that reads the person per request, and /brief none at
// all. Keeping the person out of this layout is what lets the public pages prerender whole.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${GeistSerif.variable}`}>
      <body>
        {children}
        {/* Real Core Web Vitals for DECISIONS §6: measured, not claimed. First-party script; no cookies. */}
        <SpeedInsights />
        {/* The toolbar is where the demo flags are flipped during a walkthrough. It renders only for Vercel team members. */}
        {process.env.TOOLBAR_ENABLED === 'true' ? <VercelToolbar /> : null}
      </body>
    </html>
  )
}
