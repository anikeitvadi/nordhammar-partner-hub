'use client'
import { useLens, type Lens } from './lens.client'

// The line under the globe. Normally how to read it; while a figure points the globe at something, what is lit.
const LIT: Record<Lens, string> = {
  partners: 'Lit: the partners this figure counts.',
  groups: 'Lit: the groups with companies in more than one region.',
  abroad: 'Lit: your partners whose group reaches another region.',
  hold: 'Lit: partners on hold.',
  created: 'Lit: where an ERP number was assigned this month.',
  stopped: 'Lit: where a duplicate was stopped at entry this month.',
}
export function GlobeCaption({ central }: { central: boolean }) {
  const l = useLens()
  return (
    <figcaption aria-live="polite">
      {l ? LIT[l] : central ? <>Each line joins one group&rsquo;s companies in two places. Point at a figure to light it here; drag to turn.</> : <>Your region in ink, the rest of the company behind it. Point at a figure to light it here; drag to turn.</>}
    </figcaption>
  )
}
