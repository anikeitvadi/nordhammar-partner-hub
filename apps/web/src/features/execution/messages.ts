// Pure. The central team's page reports what an action did through a code in the URL; these are the fixed sentences.
// Result messages are codes mapped to fixed copy, so the URL cannot put arbitrary text in the status line.
export function message(msg: string | undefined): string | null {
  if (!msg) return null
  const [code, a, b] = msg.split(':')
  const n = (v: string | undefined) => (v && /^\d+$/.test(v) ? Number(v) : 0)
  switch (code) {
    case 'load_started': return 'Hub load started. It reads the golden-record feed from where the last load stopped; the line below shows the result when it finishes, usually within a minute.'
    case 'load_running': return 'A hub load is already running. It will finish on its own.'
    case 'auto_on': return 'Automatic approval is on: a finance-approved request that passes every check is created without a person.'
    case 'auto_off': return 'Automatic approval is off: every finance-approved request now waits for the central team.'
    case 'delivered': return `Delivery retried: ${n(a)} delivered, ${n(b)} failed.`
    case 'reconciled': return a === 'created' ? 'Checked with the ERP: it had been created. The request is now Created.' : a === 'no_effect' ? 'Checked with the ERP: nothing was created. The request can be returned to the requester.' : 'Nothing to reconcile for that request.'
    case 'recovered': return 'Returned to the requester as a draft.'
    case 'armed': return 'Demo fault armed: the next ERP create will lose its response once. Push a clean request through finance and watch the retry.'
    case 'arm_failed': return 'Could not arm the demo fault; the ERP stand-in refused.'
    case 'not_operator': return 'Your role cannot do that.'
    case 'demo_off': return 'Demo controls are off in this environment.'
    case 'noop': return 'Nothing to do for that request.'
    default: return 'Done.'
  }
}

export const STOP: Record<string, string> = { transport: 'the ERP did not answer', business: 'the ERP refused it', auth: 'the ERP refused our credential', conflict: 'the ERP already had a different version', dependency: 'a dependency was unavailable' }
