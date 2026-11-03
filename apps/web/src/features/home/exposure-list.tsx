import { reportExposure } from '@/features/customers/reports.server'
import type { Principal } from '@/features/auth/scope'

// Credit exposure by ultimate parent, as a ruled list: the one finance number the old Reports page held. Over the
// regions the person may see amounts for, never more; a person with no amount entitlement does not get this section.
export async function ExposureList({ principal }: { principal: Principal }) {
  const rows = (await reportExposure(principal)).slice(0, 5)
  const fmt = (n: number, c: string) => `${c} ${Math.round(n).toLocaleString('en-US')}`
  return (
    <section className="home-section">
      <header><h2 className="section-title">Exposure by group</h2><p className="section-note">Credit limits by ultimate parent, per currency, in {principal.moneyRegions.join(', ')}</p></header>
      {rows.length === 0 ? <p className="ruled-empty">No credit limits in your regions.</p> : (
        <ol className="ruled">{rows.map((r) => <li key={r.parent}><span className="r-main">{r.parent}</span><span className="r-meta">{r.companies} {r.companies === 1 ? 'company' : 'companies'} · {r.regions.join(', ')}</span><span className="r-figure">{r.limits.map((l) => fmt(l.total, l.currency)).join('  ')}</span></li>)}</ol>
      )}
    </section>
  )
}
