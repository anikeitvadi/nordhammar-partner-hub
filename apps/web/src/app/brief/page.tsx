import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Brief } from '@/features/brief/brief.client'
import { readBriefFigures } from '@/features/brief/figures.server'

export const metadata: Metadata = { title: 'The brief', description: 'Why a partner hub on Vercel, for a manufacturer with five regions and three ERPs: the problem, the architecture, the Vercel choices, the demo, the rollout, the measures and the risks.' }

// Public, like How it works: the customer-facing brief. The page is prerendered; only the live figures come from the
// database, cached for minutes, and the brief reads without them.
export default function BriefPage() {
  return (
    <Suspense fallback={<Brief figures={null} />}>
      <WithFigures />
    </Suspense>
  )
}

async function WithFigures() {
  return <Brief figures={await readBriefFigures()} />
}
