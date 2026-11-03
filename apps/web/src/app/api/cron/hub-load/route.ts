import { start } from 'workflow/api'
import { hubLoadWorkflow } from '@/features/execution/load.workflow'
import { cronAuthorized } from '@/features/execution/cron-auth'

// The nightly hub load, as Vercel Cron calls it (schedule in vercel.json). Vercel sends the project's CRON_SECRET as a
// bearer token; anything else is refused. With no CRON_SECRET configured the route refuses every call: it fails closed
// rather than letting anyone on the internet start a load. The route only starts the Workflow and returns.
export async function GET(req: Request) {
  if (!cronAuthorized(req.headers.get('authorization'), process.env.CRON_SECRET)) return Response.json({ reason: 'unauthorized' }, { status: 401 })
  const run = await start(hubLoadWorkflow, ['cron'])
  return Response.json({ started: run.runId })
}
