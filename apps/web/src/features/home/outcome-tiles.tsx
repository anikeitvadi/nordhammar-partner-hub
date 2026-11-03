import { readOutcomes } from './outcomes.server'
import { hoursLabel } from './outcomes'
import type { Principal } from '@/features/auth/scope'

// Three tiles, each a number against the target it answers to (DECISIONS §1). Streamed into Home behind Suspense: the
// shell and the search paint first, the measured numbers arrive when the database answers.
export async function OutcomeTiles({ principal }: { principal: Principal }) {
  const o = await readOutcomes(principal)
  const routed = o.automatic + o.exceptions
  return (
    <>
      <div className="tile">
        <p className="runin"><strong>Duplicates stopped at entry.</strong></p>
        <div className="tile-body">
          <div className="stat">{o.stopped.stopped}</div>
          <p className="stat-label">exact tax-ID matches the form would not continue past this month{o.stopped.otherRegion ? `, ${o.stopped.otherRegion} of them in another region` : ''}, out of {o.stopped.checks} checks. Target: none created.</p>
        </div>
      </div>
      <div className="tile">
        <p className="runin"><strong>Request to ERP number.</strong></p>
        <div className="tile-body">
          <div className="stat">{o.cycle.created ? `${o.cycle.insideOneDay}/${o.cycle.created}` : '0'}</div>
          <p className="stat-label">{o.cycle.created ? `numbers this month inside one business day; median ${hoursLabel(o.cycle.medianHours)} from submit to number.` : 'numbers assigned this month.'} Target: inside one business day.</p>
        </div>
      </div>
      <div className="tile">
        <p className="runin"><strong>Approved without a person.</strong></p>
        <div className="tile-body">
          <div className="stat">{routed ? `${o.automatic}/${routed}` : '0'}</div>
          <p className="stat-label">{routed ? `finance-approved requests passed every check this month; ${o.exceptions} went to the central team as exceptions.` : 'finance-approved requests this month.'} No target set yet: this is the share people still look at.</p>
        </div>
      </div>
    </>
  )
}

export function OutcomeTilesLoading() {
  return ['Duplicates stopped at entry.', 'Request to ERP number.', 'Approved without a person.'].map((t) => (
    <div key={t} className="tile"><p className="runin"><strong>{t}</strong></p><div className="tile-body"><div className="stat muted">…</div><p className="stat-label">Measuring this month.</p></div></div>
  ))
}
