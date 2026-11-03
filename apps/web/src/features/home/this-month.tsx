import type { Principal } from '@/features/auth/scope'
import { ChartTips } from './chart-tips.client'
import { layoutFlow, stackDots, stripX, STRIP_MAX_H, WHO_LABEL, type Who } from './flow'
import { readThisMonth } from './flow.server'
import { hoursLabel } from './outcomes'

// Home's centrepiece: this month, drawn from the data instead of counted in cards. The flow shows every request's route
// from how it came in to how it ended, ribbons colored by who decided; the strip puts every ERP number on a time line
// against the one-business-day target (DECISIONS §1). Server-rendered SVG; ChartTips adds the hover layer.
const WHO: Who[] = ['checks', 'person', 'pending']
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`

export async function ThisMonth({ principal }: { principal: Principal }) {
  const { routes, dots, stoppedAtEntry, checks } = await readThisMonth(principal)
  const by = (w: Who) => routes.filter((r) => r.who === w).length
  const flow = layoutFlow(routes, { width: 600, height: 230 })
  const sorted = dots.map((d) => d.hours).sort((a, b) => a - b)
  const median = sorted.length ? (sorted.length % 2 ? sorted[(sorted.length - 1) / 2] : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2) : null
  return (
    <>
      <div className="tile span3 viz">
        <p className="runin"><strong>This month, end to end.</strong> {routes.length === 0 ? 'No requests yet this month.' : <>{plural(routes.length, 'request')}: {by('checks')} decided by the checks alone, {by('person')} by a person, {by('pending')} not decided yet. Before any of them, the check at entry stopped {plural(stoppedAtEntry, 'duplicate')} in {plural(checks, 'check')}.</>}</p>
        {routes.length ? (
          <ChartTips className="tile-body">
            <Legend />
            <div className="viz-scroll"><svg className="flow" viewBox={`-2 -6 ${flow.width + 150} ${flow.height + 12}`} role="img" aria-label={`This month's ${routes.length} requests, from how they came in to how they ended; table below`}>
              {flow.links.map((l, i) => <path key={i} d={l.path} className={`ribbon who-${l.who}`} tabIndex={0} data-tip={`${plural(l.n, 'request')}: ${l.from} → ${l.to}. ${WHO_LABEL[l.who]}.`} />)}
              {flow.nodes.map((n) => (
                <g key={n.id} className="node" data-tip={`${n.id}: ${plural(n.n, 'request')}`}>
                  <rect x={n.x} y={n.y} width={10} height={Math.max(n.h, 2)} rx={3} />
                  <text x={n.x + 16} y={n.y + n.h / 2} dominantBaseline="middle">{n.id} <tspan className="n">{n.n}</tspan></text>
                </g>
              ))}
            </svg></div>
            <details className="viz-table"><summary>As a table</summary>
              <table className="results"><thead><tr><th>From</th><th>To</th><th>Who decided</th><th className="num">Requests</th></tr></thead>
                <tbody>{flow.links.map((l, i) => <tr key={i}><td>{l.from}</td><td>{l.to}</td><td>{WHO_LABEL[l.who]}</td><td className="num">{l.n}</td></tr>)}</tbody></table>
            </details>
          </ChartTips>
        ) : null}
      </div>
      <div className="tile span3 viz">
        <p className="runin"><strong>Time to ERP number.</strong> {dots.length === 0 ? 'No numbers assigned yet this month.' : <>{dots.filter((d) => d.hours <= 24).length} of {plural(dots.length, 'number')} this month came inside one business day; median {hoursLabel(median)}. The ones nobody touched are seconds; anything a person decided waits for them.</>}</p>
        {dots.length ? <ChartTips className="tile-body"><Legend only={['checks', 'person']} /><div className="viz-scroll"><TimeStrip dots={dots} /></div></ChartTips> : null}
      </div>
    </>
  )
}

function Legend({ only = WHO }: { only?: Who[] }) {
  return <ul className="viz-legend">{only.map((w) => <li key={w}><span className={`sw who-${w}`} aria-hidden="true" />{WHO_LABEL[w]}</li>)}</ul>
}

// One second to a working week, log scale, one dot per ERP number; the dashed line is the target. Each dot opens its request.
function TimeStrip({ dots }: { dots: Awaited<ReturnType<typeof readThisMonth>>['dots'] }) {
  const W = 680, r = 6, base = 66
  const placed = stackDots(dots.map((d) => ({ ...d, x: stripX(d.hours, W) })), r)
  const rows = Math.max(1, ...placed.map((d) => d.row + 1))
  const top = Math.max(0, rows * (r * 2 + 2) - base + 14)
  const ticks: [number, string][] = [[1 / 3600, '1 s'], [1 / 60, '1 min'], [1, '1 h'], [8, '8 h'], [STRIP_MAX_H, '1 week']]
  return (
    <svg className="strip" viewBox={`-10 ${-top} ${W + 20} ${base + 28 + top}`} role="img" aria-label={`${dots.length} ERP numbers by time from submitted to number, against one business day`}>
      <line x1={0} x2={W} y1={base} y2={base} className="axis" />
      {ticks.map(([h, label]) => <g key={label}><line x1={stripX(h, W)} x2={stripX(h, W)} y1={base} y2={base + 4} className="axis" /><text x={stripX(h, W)} y={base + 18} textAnchor="middle" className="tick">{label}</text></g>)}
      <line x1={stripX(24, W)} x2={stripX(24, W)} y1={-top} y2={base} className="target" />
      <text x={stripX(24, W) + 6} y={-top + 10} className="target-label">one business day</text>
      {placed.map((d) => (
        <a key={d.requestId} href={`/requests/${d.requestId}`} data-tip={`${d.name}: ${hoursLabel(d.hours)} to its number. ${WHO_LABEL[d.who]}.`}>
          <circle cx={d.x} cy={base - r - 2 - d.row * (r * 2 + 2)} r={r} className={`dot who-${d.who}`} />
        </a>
      ))}
    </svg>
  )
}

export function ThisMonthLoading() {
  return <div className="tile span3 viz"><p className="runin"><strong>This month, end to end.</strong> Drawing this month&apos;s requests…</p><div className="viz-skeleton" /></div>
}

