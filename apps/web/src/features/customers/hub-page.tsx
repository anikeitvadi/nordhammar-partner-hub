import type { Domain } from '@intake/contracts'
import { requirePrincipal } from '@/features/auth/principal.server'
import { hasAnyRegion, visibleRegions } from '@/features/auth/scope'
import { browseParties, getParty } from './hub.server'
import { HubTable } from './hub-table.client'
import { PartyDetail } from './party-detail'

// `in`, `status` and `erp` start the table filtered, for links from an answer in Ask (`region` is the top bar's own).
const STRIP_FILTERS = ['hold', 'no_erp', 'grouped'] as const

export type HubSearchParams = { q?: string; id?: string; in?: string; status?: string; erp?: string }

const WORDS: Record<Domain, { one: string; many: string; path: string }> = { customer: { one: 'customer', many: 'Customers', path: '/customers' }, supplier: { one: 'supplier', many: 'Suppliers', path: '/suppliers' } }

// Search before you request. Every record the person may see, in all their regions at once, narrowing as they type,
// with a strip that counts what is there and filters by it. The selected record opens on the right. A tax ID that
// exists only in a region the person cannot see gets one line and nothing else.
export async function HubPage({ domain, searchParams }: { domain: Domain; searchParams: HubSearchParams }) {
  const principal = await requirePrincipal()
  if (!hasAnyRegion(principal)) {
    return <section><h1>Your account has no region yet</h1><p>Ask IT to add you to a region group. Nothing else loads until then.</p></section>
  }
  const w = WORDS[domain]
  const regions = visibleRegions(principal)
  const { q = '', id } = searchParams
  const initialFilter = { region: regions.find((r) => r === searchParams.in) ?? null, status: STRIP_FILTERS.find((x) => x === searchParams.status) ?? null, erp: searchParams.erp && /^ERP-[123]$/.test(searchParams.erp) ? searchParams.erp : null }
  const [rows, selected] = await Promise.all([browseParties(principal, domain, regions), id ? getParty(principal, id) : Promise.resolve(null)])
  return (
    <section className="hub">
      <header className="hub-head">
        <div>
          <h1>{w.many}</h1>
          <p>Every {w.one} we already have{regions.length > 1 ? ', in every region you can see' : ` in ${regions[0]}`}. Search before you request a new one.</p>
        </div>
      </header>
      <div className={selected ? 'split split-table' : undefined}>
        <HubTable rows={rows} regions={regions} domain={domain} path={w.path} selectedId={selected?.goldenId ?? null} initialQuery={q} initialFilter={initialFilter} />
        {selected ? <div className="split-detail" id="detail"><div className="party-body" key={selected.goldenId}><PartyDetail party={selected} compact /></div></div> : null}
      </div>
    </section>
  )
}
