import { getWorkflowMetadata } from 'workflow'
import { acquireLoadStep, applyPageStep, finishLoadStep, readPageStep } from './load.steps'

// The nightly hub load as a durable run. Started by the Vercel Cron Job (api/cron/hub-load) or by the central team's
// "Run now"; both start this same function, so there is one load. It takes the lock, reads the golden-record feed page
// by page from where the last load stopped, writes each page, then clears the search cache for the regions it touched.
// A failure on one page retries that page; a redeploy mid-load does not lose it.
export async function hubLoadWorkflow(trigger: 'cron' | 'manual') {
  'use workflow'
  const { workflowRunId } = getWorkflowMetadata()
  const lock = await acquireLoadStep(workflowRunId)
  if (!lock) return { outcome: 'already_running' as const }
  let since = lock.cursor
  const totals = { loaded: 0, linked: 0, regions: [] as string[] }
  for (let page = 0; page < 50; page++) {
    const feed = await readPageStep(since)
    if (feed.records.length === 0) break
    const r = await applyPageStep(feed)
    totals.loaded += r.loaded; totals.linked += r.linked
    for (const region of r.regions) if (!totals.regions.includes(region)) totals.regions.push(region)
    since = feed.next
  }
  await finishLoadStep(workflowRunId, trigger, totals)
  return { outcome: 'loaded' as const, ...totals }
}
