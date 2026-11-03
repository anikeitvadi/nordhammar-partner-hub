import type { Metadata } from 'next'
import Link from 'next/link'
import { requirePrincipal } from '@/features/auth/principal.server'
import { hasAnyRegion, visibleRegions } from '@/features/auth/scope'
import { listMyRequests, listQueue } from '@/features/requests/store.server'
import { isOperator, listAttention } from '@/features/execution/operator.server'
import { StatusBadge, isLive } from '@/features/requests/status'
import { LocalTime } from '@/features/ui/time.client'
import { Suspense } from 'react'
import { HubSceneLoading, HubSceneTile } from '@/features/home/hub-scene'
import { ExposureTile } from '@/features/home/exposure-tile'

export const metadata: Metadata = { title: 'Home' }

// The home screen is a grid of tiles: the search (hero), the two requests, one live number, the person's own
// requests as rows, and one tile for what their role does next. On top, the hub drawn to scale (streamed in). Every number is read live; nothing here is copy.
export default async function HomePage() {
  const principal = await requirePrincipal()
  if (!hasAnyRegion(principal)) return <section className="narrow card" style={{ marginTop: 48 }}><h1>Your account has no region yet</h1><p>Ask IT to add you to a region group. Nothing else loads until then.</p></section>
  const regions = visibleRegions(principal)
  const region = regions[0]
  const global = principal.globalIdentity
  const [mine, queue, attention] = await Promise.all([listMyRequests(principal), global ? listQueue(principal) : Promise.resolve([]), isOperator(principal) ? listAttention(principal) : Promise.resolve([])])
  const inFlight = mine.filter((r) => isLive(r.state)).length
  const created = mine.filter((r) => r.state.kind === 'created').length
  const first = principal.displayName.split(' ')[0]
  return (
    <section>
      <div className="door-head" style={{ margin: '0 0 20px' }}>
        <p className="eyebrow">{global ? 'All regions' : `Region ${regions.join(', ')}`} · {principal.role}</p>
        <h1>{greeting()}, {first}.</h1>
      </div>
      <div className="bento">
        <Suspense fallback={<HubSceneLoading />}>
          <HubSceneTile principal={principal} />
        </Suspense>
        <div className="tile span2">
          <p className="runin"><strong>Find a partner.</strong> Name, tax ID, DUNS, city or ERP number, in every region you can see. Or <Link href="/ask">ask a question</Link>.</p>
          <form method="get" action="/customers" className="tile-body" role="search">
            <input type="hidden" name="region" value={region} />
            <div className="row" style={{ margin: 0 }}>
              <input name="q" placeholder="Aurora, 61.000.101/0001-57, Joinville, 110001…" aria-label="Search" style={{ flex: 1, minWidth: 200 }} />
              <button type="submit">Search customers</button>
              <button type="submit" formAction="/suppliers" className="secondary">Suppliers</button>
            </div>
          </form>
        </div>
        <div className="tile">
          <p className="runin"><strong>Request what is not there.</strong> The hub is checked first; finance approves in the service desk; a clean request gets its ERP number with no one in the hub touching it.</p>
          <div className="tile-body row" style={{ margin: 0 }}>
            <Link href={`/intake/new?domain=customer&region=${region}`} className="button">Request a customer</Link>
            <Link href={`/intake/new?domain=supplier&region=${region}`} className="button secondary">Supplier</Link>
          </div>
        </div>
        <div className="tile dark">
          <p className="runin"><strong>{global ? 'Waiting for the central team.' : 'In flight.'}</strong></p>
          <div className="tile-body">
            <div className="stat">{global ? queue.length : inFlight}</div>
            <p className="stat-label">{global ? `exception${queue.length === 1 ? '' : 's'} and older reviews, oldest first, every region` : `of your ${mine.length} request${mine.length === 1 ? '' : 's'} with finance, the central team or the ERP · ${created} created`}</p>
          </div>
        </div>
        <div className="tile span2">
          <p className="runin"><strong>{global ? 'The queue.' : 'Your requests.'}</strong> {global ? 'Oldest first.' : 'Where each one is, live.'} <Link href={global ? '/reviews' : '/requests'} className="small">{global ? 'Exceptions →' : 'All →'}</Link></p>
          {(global ? queue : mine).length === 0 ? <p className="muted small tile-body">{global ? 'Nothing waiting.' : 'None yet. Your first request shows up here with its status.'}</p> : (
            <ul className="rows tile-body">
              {(global ? queue : mine).slice(0, 4).map((r) => <li key={r.requestId} className="nolead"><Link href={global ? `/reviews/${r.requestId}` : `/requests/${r.requestId}`}><span><span className="t">{r.legalName}</span><span className="s">{r.domain === 'customer' ? 'Customer' : 'Supplier'} · {r.region} · <LocalTime iso={r.updatedAt} relative /></span></span><span className="m"><StatusBadge state={r.state} /></span></Link></li>)}
            </ul>
          )}
        </div>
        {isOperator(principal) ? (
          <>
            <div className="tile">
              <p className="runin"><strong>Needs attention.</strong></p>
              <div className="tile-body"><div className="stat">{attention.length}</div><p className="stat-label">{attention.length === 0 ? 'Nothing stopped, nothing pending.' : 'stopped or pending, each with its next step.'} <Link href="/reviews?tab=stopped">Stopped →</Link></p></div>
            </div>
            {principal.moneyRegions.length ? <Suspense fallback={null}><ExposureTile principal={principal} /></Suspense> : null}
          </>
        ) : (
          <>
            <div className="tile well">
              <p className="runin"><strong>Three steps.</strong> Check the hub, submit, finance approves in the service desk. A clean request gets its number on its own; anything the checks cannot settle goes to the central team.</p>
              <p className="muted small tile-body" style={{ margin: 0 }}>Your region is {regions.join(', ')}; the request form uses its tax ID and address fields. <Link href="/how-it-works">How it works →</Link></p>
            </div>
            {principal.moneyRegions.length ? <Suspense fallback={null}><ExposureTile principal={principal} /></Suspense> : null}
            <div className="tile span2">
              <p className="runin"><strong>Found a match?</strong> Open the record instead of requesting. If the record is wrong, the change path is the next release; until then, tell the hub team.</p>
              <p className="muted small tile-body" style={{ margin: 0 }}>A tax ID that exists in a region you cannot see shows as one line: which region, and who to contact. Never the record.</p>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function greeting(): string {
  const h = new Date().getUTCHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}
