import { reportExposure } from '@/features/customers/reports.server'
import type { Principal } from '@/features/auth/scope'

// The one finance number the old Reports page held that nothing else showed (review log §12): credit exposure to a
// corporate group, which today is several records in several systems. Over the regions the person may see amounts
// for, never more; a person with no amount entitlement does not get this tile at all.
export async function ExposureTile({ principal }: { principal: Principal }) {
  const rows = (await reportExposure(principal)).slice(0, 3)
  const fmt = (n: number, c: string) => `${c} ${Math.round(n).toLocaleString('en-US')}`
  return (
    <div className="tile well span2">
      <p className="runin"><strong>Exposure by group.</strong> Credit limits summed per currency by ultimate parent, across every region you may see amounts for ({principal.moneyRegions.join(', ')}). Ask for any group.</p>
      {rows.length === 0 ? <p className="muted small tile-body">No credit limits in your regions.</p> : (
        <ul className="rows tile-body">
          {rows.map((r) => <li key={r.parent} className="nolead"><span><span className="t">{r.parent}</span><span className="s">{r.companies} {r.companies === 1 ? 'company' : 'companies'} · {r.regions.join(', ')}</span></span><span className="m">{r.limits.map((l) => fmt(l.total, l.currency)).join(' · ')}</span></li>)}
        </ul>
      )}
    </div>
  )
}
