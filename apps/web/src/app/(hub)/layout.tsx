import { Suspense } from 'react'
import { Shell } from '@/features/ui/shell.server'

// The signed-in hub: the frame is prerendered as static HTML; who is signed in, and the page itself, stream in behind
// Suspense. The person is read per request, never cached.
export default function HubLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<><header className="shell-header"><span className="shell-brand"><b>Nordhammar</b><span>Partner Hub</span></span></header><div className="shell-main"><section aria-busy="true" aria-label="Loading"><div className="skeleton skeleton-title" /><div className="skeleton skeleton-line" /><div className="skeleton skeleton-block" /></section></div></>}>
      <Shell>
        <Suspense fallback={<section aria-busy="true" aria-label="Loading"><div className="skeleton skeleton-title" /><div className="skeleton skeleton-line" /><div className="skeleton skeleton-block" /></section>}>{children}</Suspense>
      </Shell>
    </Suspense>
  )
}
