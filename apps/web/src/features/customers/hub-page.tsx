import Link from 'next/link'
import type { Domain, Region } from '@intake/contracts'
import { requirePrincipal } from '@/features/auth/principal.server'
import { hasAnyRegion, visibleRegions } from '@/features/auth/scope'
import { getParty, searchParties } from './hub.server'
import { PartyDetail } from './party-detail'

export type HubSearchParams = { q?: string; region?: string; id?: string }

const WORDS: Record<Domain, { one: string; many: string; path: string }> = { customer: { one: 'customer', many: 'Customers', path: '/customers' }, supplier: { one: 'supplier', many: 'Suppliers', path: '/suppliers' } }

// WF-02 + WF-03 in one screen: search the golden records live, results on the left, the selected record on the right.
// The search box takes a name, alias, tax ID, DUNS, city or ERP number. The region is the caller's, locked unless they
// hold several. Not found leads straight to a request with the text carried over. A tax ID that exists in a region
// the caller cannot see gets one line and nothing else.
export async function HubPage({ domain, searchParams }: { domain: Domain; searchParams: HubSearchParams }) {
  const principal = await requirePrincipal()
  if (!hasAnyRegion(principal)) {
    return <section><h1>Your account has no region yet</h1><p>Ask IT to add you to a region group. Nothing else loads until then.</p></section>
  }
  const w = WORDS[domain]
  const regions = visibleRegions(principal)
  const { q = '', region: requested, id } = searchParams
  const region: Region = regions.includes(requested as Region) ? (requested as Region) : regions[0]
  const outcome = q ? await searchParties(principal, domain, region, q) : { results: [], foreignRegion: null }
  const selected = id ? await getParty(principal, id) : null
  const requestHref = `/intake/new?domain=${domain}&region=${region}${q ? `&name=${encodeURIComponent(q)}` : ''}`
  return (
    <section className="hub">
      <header className="hub-head">
        <div>
          <h1>{w.many}</h1>
          <p>Golden records across every region, read live from the hub. Search first; request only what is not there.</p>
        </div>
        <Link href={requestHref} className="button">Request a new {w.one}</Link>
      </header>
      <form method="get" className="hub-search" role="search">
        {regions.length > 1 ? (
          <select name="region" defaultValue={region} aria-label="Region">{regions.map((r) => <option key={r} value={r}>{r}</option>)}</select>
        ) : <><input type="hidden" name="region" value={region} /><span className="badge badge-region" title="Your region is fixed by your entitlement">{region} 🔒</span></>}
        <input name="q" defaultValue={q} placeholder="Name, tax ID, DUNS, city or ERP number" aria-label="Search" autoFocus />
        {id ? <input type="hidden" name="id" value={id} /> : null}
        <button type="submit">Search</button>
      </form>
      <div className="split">
        <div className="split-list">
          {q ? <p className="muted count">{outcome.results.length} {outcome.results.length === 1 ? 'result' : 'results'} in {region}</p> : <p className="muted count">Type to search {region}.</p>}
          {outcome.foreignRegion ? <p className="panel hint">A {w.one} with this tax ID exists in {outcome.foreignRegion}. Contact the {outcome.foreignRegion} team. One legal entity is not created twice.</p> : null}
          {q && outcome.results.length === 0 && !outcome.foreignRegion ? (
            <p className="panel">No {w.one} matches in {region}. <Link href={requestHref}>Request a new {w.one}</Link> with this text carried over.</p>
          ) : null}
          <ul className="result-list">
            {outcome.results.map((r) => (
              <li key={r.goldenId} className={r.goldenId === selected?.goldenId ? 'selected' : undefined}>
                <Link href={`${w.path}?${new URLSearchParams({ q, region, id: r.goldenId }).toString()}`}>
                  <span className="rl-name">{r.legalName}</span>
                  <span className="rl-meta">{r.city} · {r.region} · {r.erpNumber ? `${r.region === 'EU' ? 'IFS' : 'MAPICS'} ${r.erpNumber}` : 'no ERP number'}</span>
                  <span className="rl-tags">{r.typeCode ? <span className="badge">{r.typeCode.replace('_', ' ')}</span> : null}{r.status !== 'active' ? <span className="badge badge-stopped">{r.status}</span> : null}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="split-detail">
          {selected ? <PartyDetail party={selected} compact /> : (
            <div className="empty">
              <p><strong>Select a record</strong></p>
              <p className="muted">Identifiers, group, addresses, sources and the ERP number, as the hub holds them today.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
