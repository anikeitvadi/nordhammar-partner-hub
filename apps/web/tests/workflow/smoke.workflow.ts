import { createHook } from 'workflow'

// The smallest durable wait: proves the plugin, the hook, the conflict guard and the resume on this machine.
export async function smokeWorkflow(token: string) {
  'use workflow'
  const hook = createHook<{ decision: string }>({ token })
  const conflict = await hook.getConflict()
  if (conflict) return { outcome: 'duplicate_run' as const }
  const wake = await hook
  const stamped = await stampStep(wake.decision)
  return { outcome: 'resumed' as const, stamped }
}

async function stampStep(decision: string) {
  'use step'
  return `${decision}@step`
}
