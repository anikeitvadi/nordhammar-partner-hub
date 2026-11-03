'use client'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import type { Domain, Region } from '@intake/contracts'
import { typeLabel } from '@/features/requests/payload'
import type { BrowseRow } from './browse'
import { foreignHintAction } from './actions'

type Filter = { region: Region | null; status: 'hold' | 'no_erp' | 'grouped' | null; erp: string | null }

const canon = (s: string) => s.toUpperCase().replace(/[^0-9A-Z]/g, '')

function matches(r: BrowseRow, q: string): boolean {
  if (!q) return true
  const low = q.toLowerCase()
  const c = canon(q)
  return (
    r.legalName.toLowerCase().includes(low) ||
    (r.localName ?? '').toLowerCase().includes(low) ||
    r.city.toLowerCase().includes(low) ||
    r.aliases.some((a) => a.toLowerCase().includes(low)) ||
    (r.groupName ?? '').toLowerCase().includes(low) ||
    (c.length >= 3 && ((r.taxCanonical ?? '').includes(c) || r.duns === c || (r.erpNumber ?? '').toUpperCase() === c))
  )
}

// The records one person may see, narrowed as they type. The strip on top counts what is there and each tile sets
// the matching filter; the table is the same rows. Selecting a row opens it on the right without losing the filter.
export function HubTable({ rows, regions, domain, path, selectedId, initialQuery }: { rows: BrowseRow[]; regions: Region[]; domain: Domain; path: string; selectedId: string | null; initialQuery: string }) {
  const [q, setQ] = useState(initialQuery)
  const [f, setF] = useState<Filter>({ region: null, status: null, erp: null })
  const [foreign, setForeign] = useState<{ q: string; region: Region | null } | null>(null)
  const one = domain === 'customer' ? 'customer' : 'supplier'

  const shown = useMemo(() => rows.filter((r) =>
    matches(r, q.trim()) &&
    (!f.region || r.region === f.region) &&
    (!f.erp || r.erpSystem === f.erp) &&
    (f.status !== 'hold' || r.status === 'hold') &&
    (f.status !== 'no_erp' || !r.erpNumber) &&
    (f.status !== 'grouped' || !!r.groupName)), [rows, q, f])

  // Nothing here and it looks like a tax ID: ask the hub whether it exists in a region this person cannot see.
  const query = q.trim()
  const looksLikeTaxId = canon(query).length >= 8
  useEffect(() => {
    if (shown.length > 0 || !looksLikeTaxId) return
    let live = true
    const t = setTimeout(() => { foreignHintAction(domain, query).then((region) => { if (live) setForeign({ q: query, region }) }) }, 300)
    return () => { live = false; clearTimeout(t) }
  }, [shown.length, looksLikeTaxId, domain, query])
  const answered = foreign?.q === query
  const foreignRegion = answered && shown.length === 0 ? foreign.region : null
  const checking = shown.length === 0 && looksLikeTaxId && !answered

  const byRegion = regions.map((r) => ({ r, n: rows.filter((x) => x.region === r).length }))
  const tiles: { key: Filter['status']; label: string; n: number }[] = [
    { key: 'hold', label: 'On hold', n: rows.filter((r) => r.status === 'hold').length },
    { key: 'no_erp', label: 'No ERP number yet', n: rows.filter((r) => !r.erpNumber).length },
    { key: 'grouped', label: 'In a corporate group', n: rows.filter((r) => !!r.groupName).length },
  ]
  const erps = [...new Set(rows.map((r) => r.erpSystem).filter((e): e is string => !!e))].sort()
  const filtered = !!(f.region || f.status || f.erp)
  const href = (id: string) => `${path}?${new URLSearchParams({ ...(query ? { q: query } : {}), id }).toString()}#detail`
  const requestHref = `/intake/new?domain=${domain}&region=${f.region ?? regions[0]}${query ? `&name=${encodeURIComponent(query)}` : ''}`

  return (
    <div className="hub-browse">
      <div className="strip" role="group" aria-label="Filter by">
        {regions.length > 1 ? <div className="strip-tile strip-regions">
          <span className="strip-label">By region</span>
          <div className="strip-regions-row">
            {byRegion.map(({ r, n }) => (
              <button key={r} type="button" className="strip-region" aria-pressed={f.region === r} onClick={() => setF((x) => ({ ...x, region: x.region === r ? null : r }))}>
                <span className="strip-n">{n}</span><span className="strip-code">{r}</span>
              </button>
            ))}
          </div>
        </div> : null}
        {tiles.map((t) => (
          <button key={t.key} type="button" className="strip-tile" aria-pressed={f.status === t.key} onClick={() => setF((x) => ({ ...x, status: x.status === t.key ? null : t.key }))}>
            <span className="strip-n">{t.n}</span><span className="strip-label">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="hub-search" role="search">
        <input name="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, tax ID, DUNS, city, group or ERP number" aria-label="Search" autoFocus={!selectedId} />
        {erps.length > 1 ? (
          <div className="chips chips-inline" role="group" aria-label="ERP">
            {erps.map((e) => <button key={e} type="button" className="chip" aria-pressed={f.erp === e} onClick={() => setF((x) => ({ ...x, erp: x.erp === e ? null : e }))}>{e}</button>)}
          </div>
        ) : null}
        {filtered ? <button type="button" className="chip" onClick={() => setF({ region: null, status: null, erp: null })}>Clear filters</button> : null}
      </div>

      <p className="muted count" role="status" aria-live="polite">
        {shown.length} of {rows.length} {rows.length === 1 ? one : `${one}s`}{regions.length > 1 ? ` across ${regions.join(', ')}` : ` in ${regions[0]}`}
      </p>

      {shown.length === 0 ? (
        <div className="panel">
          {checking ? <p className="muted">Checking the other regions for this tax ID.</p> : foreignRegion ? <p>A {one} with this tax ID exists in {foreignRegion}. Contact the {foreignRegion} team. One legal entity is not created twice.</p> : (
            <p>No {one} matches {query ? <>“{query}”</> : 'these filters'} in the regions you can see.{query ? <> <Link href={requestHref}>Request a new {one}</Link> with this text carried over.</> : null}</p>
          )}
        </div>
      ) : (
        <table className="results hub-table">
          <thead><tr><th>Name</th><th>Region</th><th>ERP</th><th className="col-secondary">Type</th><th className="col-secondary">Group</th><th>Status</th></tr></thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.goldenId} className={r.goldenId === selectedId ? 'selected' : undefined}>
                <td><Link href={href(r.goldenId)} className="row-link">{r.legalName}</Link><div className="muted">{r.city}</div></td>
                <td>{r.region}</td>
                <td className="mono">{r.erpNumber ? `${r.erpSystem ?? ''} ${r.erpNumber}` : <span className="muted">not yet</span>}</td>
                <td className="col-secondary">{r.typeCode ? typeLabel(r.typeCode) : <span className="muted">none</span>}</td>
                <td className="col-secondary">{r.groupName ?? <span className="muted">none</span>}</td>
                <td>{r.status === 'active' ? <span className="badge">active</span> : <span className="badge badge-stopped">{r.status}</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
