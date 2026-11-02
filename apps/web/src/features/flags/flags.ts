import { flag } from 'flags/next'

// Demo switches as flags, so they can be flipped from the Vercel Toolbar during a walkthrough instead of redeploying an env
// var. Every flag is read on the server, in a request (a page or a Server Action), never inside the workflow, and
// none of them changes who may do what: authorization is the entitlements table, always. The env vars stay as the
// defaults, so a deployment with no toolbar behaves exactly as before.
const onOff = [{ value: false, label: 'Off' }, { value: true, label: 'On' }]

export const demoControls = flag<boolean>({
  key: 'demo-controls',
  description: 'Show the demo controls on Operations and allow arming the ERP fault. Default: DEMO_CONTROLS_ENABLED.',
  defaultValue: false,
  options: onOff,
  decide: () => process.env.DEMO_CONTROLS_ENABLED === 'true',
})

export const erpLostResponse = flag<boolean>({
  key: 'erp-lost-response',
  description: 'When on, an approval first arms the ERP stand-in to drop its next response once: attempt 1 commits and times out, attempt 2 replays the same number. Needs demo-controls.',
  defaultValue: false,
  options: onOff,
  decide: () => false,
})

export const aiSuggestion = flag<boolean>({
  key: 'ai-suggestion',
  description: 'The AI reading of a name match in the request form. Off shows the candidates with no suggestion. Default: AI_ENABLED.',
  defaultValue: true,
  options: onOff,
  decide: () => process.env.AI_ENABLED !== 'false',
})
