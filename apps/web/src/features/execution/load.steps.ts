import type { GoldenFeed } from '@intake/contracts'
import { readGoldenRecords } from '@/features/erp/erp.server'
import { acquireLoad, applyGoldenRecords, releaseLoad } from '@/features/customers/load.server'

// The load's steps. Each is a unit the Workflow SDK records and retries on its own: a feed page that fails to read is
// read again; a page that fails to write is written again (the writes are upserts and guarded links, safe twice). The
// cursor only moves after a page is written, so nothing is skipped.

export async function acquireLoadStep(runId: string): Promise<{ cursor: string | null } | null> {
  'use step'
  return acquireLoad(runId)
}

export async function readPageStep(since: string | null): Promise<GoldenFeed> {
  'use step'
  return readGoldenRecords(since)
}

export async function applyPageStep(feed: GoldenFeed): Promise<{ loaded: number; linked: number; regions: string[] }> {
  'use step'
  return applyGoldenRecords(feed.records, feed.next)
}

// Search results are cached per region (hub.server.ts). This runs outside a Server Action, so updateTag is not
// available; revalidateTag with expire 0 is the documented equivalent: the next read is a miss and sees the new rows.
// next/cache is imported here, not at the top: the in-process Workflow test bundles every step file into plain Node,
// where next/cache does not resolve, and this step only ever runs inside the Next app.
export async function finishLoadStep(runId: string, trigger: string, totals: { loaded: number; linked: number; regions: string[] }): Promise<void> {
  'use step'
  const { revalidateTag } = await import('next/cache')
  for (const region of totals.regions) revalidateTag(`hub:${region}`, { expire: 0 })
  await releaseLoad(runId, trigger, totals)
}
