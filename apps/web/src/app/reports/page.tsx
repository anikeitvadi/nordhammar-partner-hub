import type { Metadata } from 'next'
import type { RequestState } from '@intake/contracts'
import { requirePrincipal } from '@/features/auth/principal.server'
import { reportExposure, reportIntake, reportOnHold } from '@/features/customers/reports.server'
import { STATE_LABEL } from '@/features/requests/status'

export const metadata: Metadata = { title: 'Reports' }

const money = (currency: string, n: number) => new Intl.NumberFormat('en', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n)

// The fixed questions a finance or master-data lead asks of this data, answered from the same authorized readers
// the screens use. The fields exist so these questions have answers. No free text.
export default async function ReportsPage() {
  const principal = await requirePrincipal()
  if (!principal.globalIdentity) return <section><h1>Reports</h1><p>Reports are for global roles.</p></section>
  const [hold, intake, exposure] = await Promise.all([reportOnHold(principal), reportIntake(principal), reportExposure(principal)])
  return (
    <section>
      <h1>Reports</h1>
      <p>What finance and master data ask of this data, answered from the same readers the screens use. Money rows appear only for regions your role is entitled to.</p>
      <h2>Partners on hold, by region</h2>
      {hold.length === 0 ? <p className="muted">No partners on hold in the regions you can see.</p> : (
        <table className="results"><thead><tr><th>Region</th><th className="num">Customers on hold</th><th className="num">Suppliers on hold</th><th>Oldest last activity</th></tr></thead>
          <tbody>{hold.map((r) => <tr key={r.region}><td>{r.region}</td><td className="num">{r.customers}</td><td className="num">{r.suppliers}</td><td>{r.oldestActivity ?? '—'}</td></tr>)}</tbody></table>
      )}
      <h2>Intake this month</h2>
      {intake.length === 0 ? <p className="muted">No requests this month yet.</p> : (
        <table className="results"><thead><tr><th>State</th><th className="num">Customers</th><th className="num">Suppliers</th><th className="num">Median hours, submitted to created</th></tr></thead>
          <tbody>{intake.map((r) => <tr key={r.state}><td>{STATE_LABEL[r.state as RequestState['kind']] ?? r.state.replace(/_/g, ' ')}</td><td className="num">{r.customers}</td><td className="num">{r.suppliers}</td><td className="num">{r.medianHours ?? '—'}</td></tr>)}</tbody></table>
      )}
      <h2>Credit exposure by ultimate parent</h2>
      {exposure.length === 0 ? <p className="muted">You are not entitled to amounts in any region. Amounts are granted per person and region.</p> : (
        <table className="results"><thead><tr><th>Ultimate parent</th><th className="num">Companies</th><th>Regions</th><th className="num">Credit limits (per currency)</th></tr></thead>
          <tbody>{exposure.map((r) => <tr key={r.parent}><td>{r.parent}</td><td className="num">{r.companies}</td><td>{r.regions.join(', ')}</td><td className="num">{r.limits.map((l) => money(l.currency, l.total)).join(' · ')}</td></tr>)}</tbody></table>
      )}
    </section>
  )
}
