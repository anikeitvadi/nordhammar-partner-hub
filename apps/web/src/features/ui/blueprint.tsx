import type { RequestState } from '@intake/contracts'

// The path a request takes, as a blueprint: fine grid, thin strokes, mono labels, one accent. Every label is a name
// in the code (review.workflow.ts, steps.ts, erp.server.ts, the stub's verify.ts and receive.ts) so the diagram and
// the deep dive say the same words. `active` is derived from the real request state, never from a timer.
export type Stage = 'request' | 'paused' | 'decide' | 'write' | 'erp' | 'finish'

export function stageFor(kind: RequestState['kind']): Stage {
  switch (kind) {
    case 'draft': return 'request'
    case 'submitted': case 'under_review': return 'paused'
    case 'approved': return 'decide'
    case 'creating': return 'write'
    case 'created': case 'declined': case 'stopped': return 'finish'
  }
}

const BOXES: { id: Stage; title: string; lines: string[]; note: string }[] = [
  { id: 'request', title: 'IntakeForm', lines: ['checkMatches', 'submitRequestAction'], note: 'hub checked first' },
  { id: 'paused', title: 'reviewWorkflow', lines: ['createHook(', '  review:<id>:<rev>)'], note: 'paused, costs nothing' },
  { id: 'decide', title: 'decideAction', lines: ['deliverPending', 'resumeHook'], note: 'one approval' },
  { id: 'write', title: 'erpWriteStep', lines: ['createParty', 'getVercelOidcToken'], note: 'same key on retry' },
  { id: 'erp', title: 'ERP stand-in', lines: ['authenticate (JWKS)', 'receive → ledger'], note: 'one row per key' },
  { id: 'finish', title: 'finishStep', lines: ['created | stopped', 'dailyLoadAction'], note: 'number, then the hub' },
]

const W = 150, H = 86, GAP = 26, PAD = 16, TOP = 28
const width = PAD * 2 + BOXES.length * W + (BOXES.length - 1) * GAP
const height = TOP + H + 44

export function Blueprint({ active, title = 'How a request becomes a number' }: { active?: Stage; title?: string }) {
  return (
    <figure className="blueprint" data-active={active ?? ''}>
      {/* aria-label, not an SVG <title>: React 19 hoists <title> elements, which breaks hydration inside an SVG */}
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${title}${active ? `, now at ${BOXES.find((b) => b.id === active)?.title}` : ''}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="bp-grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" fill="none" className="bp-gridline" /></pattern>
        </defs>
        <rect width={width} height={height} fill="url(#bp-grid)" className="bp-ground" />
        {BOXES.map((b, i) => {
          const x = PAD + i * (W + GAP), y = TOP
          const isActive = b.id === active
          return (
            <g key={b.id} className={`bp-box${isActive ? ' active' : ''}`} transform={`translate(${x} ${y})`}>
              <rect width={W} height={H} rx="6" />
              <text x="10" y="20" className="bp-title">{b.title}</text>
              {b.lines.map((l, k) => <text key={k} x="10" y={38 + k * 14} className="bp-line">{l}</text>)}
              <text x="10" y={H + 18} className="bp-note">{b.note}</text>
              {i < BOXES.length - 1 ? (
                <g className="bp-wire" style={{ animationDelay: `${i * 120}ms` }}>
                  <path d={`M${W} ${H / 2} H${W + GAP - 4}`} pathLength={1} />
                  <circle cx={W + GAP - 4} cy={H / 2} r="2.5" />
                </g>
              ) : null}
            </g>
          )
        })}
        {/* the retry loop: erpWriteStep back to itself with the same key */}
        <g className="bp-wire loop" style={{ animationDelay: '720ms' }}>
          <path d={`M${PAD + 3 * (W + GAP) + W - 30} ${TOP} v-12 h-60 v12`} pathLength={1} />
          <circle cx={PAD + 3 * (W + GAP) + W - 90} cy={TOP} r="2.5" />
          <text x={PAD + 3 * (W + GAP) + W - 90 + 6} y={TOP - 15} className="bp-note">RetryableError · maxRetries 3</text>
        </g>
      </svg>
    </figure>
  )
}
