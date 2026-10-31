import { requirePrincipal } from '@/features/auth/principal.server'
import { reportExposure, reportIntake, reportOnHold } from '@/features/customers/reports.server'

// The fixed questions a finance or master-data lead asks of this data, answered from the same authorized readers
// the screens use. This is the reporting argument: the fields exist so these questions have answers. No free text.
export default async function ReportsPage() {
  const principal = await requirePrincipal()
  if (!principal.globalIdentity) return <section><h1>Reports</h1><p>Reports are for global roles.</p></section>
  const [hold, intake, exposure] = await Promise.all([reportOnHold(principal), reportIntake(principal), reportExposure(principal)])
  return (
    <section>
      <h1>Reports</h1>
      <p>Three questions the ticket process could not answer. Money rows appear only for regions your role is entitled to.</p>
      <h2>Partners on hold, by region</h2>
      <table className="results"><thead><tr><th>Region</th><th>Customers on hold</th><th>Suppliers on hold</th><th>Oldest last activity</th></tr></thead>
        <tbody>{hold.map((r) => <tr key={r.region}><td>{r.region}</td><td>{r.customers}</td><td>{r.suppliers}</td><td>{r.oldestActivity ?? '—'}</td></tr>)}</tbody></table>
      <h2>Intake this month</h2>
      <table className="results"><thead><tr><th>State</th><th>Customers</th><th>Suppliers</th><th>Median hours submitted → created</th></tr></thead>
        <tbody>{intake.map((r) => <tr key={r.state}><td>{r.state.replace('_', ' ')}</td><td>{r.customers}</td><td>{r.suppliers}</td><td>{r.medianHours ?? '—'}</td></tr>)}</tbody></table>
      <h2>Credit exposure by ultimate parent</h2>
      {exposure.length === 0 ? <p className="muted">No money regions on your entitlement. Finance roles see this; reviewers do not, by design.</p> : (
        <table className="results"><thead><tr><th>Ultimate parent</th><th>Companies</th><th>Regions</th><th>Credit limits (per currency)</th></tr></thead>
          <tbody>{exposure.map((r) => <tr key={r.parent}><td>{r.parent}</td><td>{r.companies}</td><td>{r.regions.join(', ')}</td><td>{r.limits.map((l) => `${l.currency} ${l.total.toLocaleString()}`).join(' · ')}</td></tr>)}</tbody></table>
      )}
    </section>
  )
}
