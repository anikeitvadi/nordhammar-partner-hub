import { demoControls, erpLostResponse } from '@/features/flags/flags'
import { armLostResponseFault } from '@/features/erp/erp.server'

// Demo only. With both flags on, an approval first arms the ERP stand-in to drop its next response once, so the
// room sees attempt 1 commit and time out, and attempt 2 replay the same number. Lives in the execution feature
// because nothing else may import the ERP path; read in a request (flags need one), never inside the workflow.
export async function armLostResponseIfFlagged(): Promise<void> {
  if (!(await demoControls()) || !(await erpLostResponse())) return
  await armLostResponseFault().catch(() => undefined)
}
