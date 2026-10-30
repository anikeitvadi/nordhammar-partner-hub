import Link from 'next/link'
import { requirePrincipal } from '@/features/auth/principal.server'
import { hasAnyRegion, visibleRegions } from '@/features/auth/scope'
import { searchCustomers } from '@/features/customers/hub.server'
import type { Region } from '@intake/contracts'

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string; region?: string }> }) {
  const principal = await requirePrincipal()
  if (!hasAnyRegion(principal)) {
    return <section><h1>Your account has no region yet</h1><p>Ask IT to add you to a region group. Nothing else loads until then.</p></section>
  }
  const regions = visibleRegions(principal)
  const { q = '', region: requested } = await searchParams
  // The region comes from the URL only if the principal is entitled to it; otherwise the first visible region wins.
  const region: Region = regions.includes(requested as Region) ? (requested as Region) : regions[0]
  const results = q ? await searchCustomers(principal, region, q) : []
  return (
    <section>
      <h1>Search the customer hub</h1>
      <form method="get" className="row">
        {regions.length > 1 ? (
          <select name="region" defaultValue={region} aria-label="Region">{regions.map((r) => <option key={r} value={r}>{r}</option>)}</select>
        ) : <input type="hidden" name="region" value={region} />}
        <input name="q" defaultValue={q} placeholder="Legal name, alias, or tax ID" aria-label="Search" />
        <button type="submit">Search</button>
      </form>
      {q ? (
        results.length ? (
          <table className="results">
            <thead><tr><th>Name</th><th>City</th><th>Region</th><th>ERP number</th></tr></thead>
            <tbody>{results.map((c) => (
              <tr key={c.goldenId}><td><Link href={`/customers/${c.goldenId}`}>{c.legalName}</Link></td><td>{c.city}</td><td>{c.region}</td><td>{c.erpNumber ?? '—'}</td></tr>
            ))}</tbody>
          </table>
        ) : <p>No customer matches in {region}. <Link href={`/intake/new?region=${region}&name=${encodeURIComponent(q)}`}>Request a new customer</Link>.</p>
      ) : null}
    </section>
  )
}
