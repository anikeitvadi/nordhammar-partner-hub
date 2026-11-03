import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { requirePrincipal } from '@/features/auth/principal.server'
import { hasAnyRegion, visibleRegions } from '@/features/auth/scope'
import { listMyRequests, listQueue } from '@/features/requests/store.server'
import { isOperator, listAttention } from '@/features/execution/operator.server'
import { STATE_LABEL } from '@/features/requests/status'
import { LocalTime } from '@/features/ui/time.client'
import { HomeHero, HomeHeroLoading } from '@/features/home/home-hero'
import { ExposureList } from '@/features/home/exposure-list'

export const metadata: Metadata = { title: 'Home' }

// Home reads like a page, not a dashboard: one claim with the globe that shows it, a search line, then what is
// waiting for this person as ruled rows. Ink on paper; serif for statements, mono for figures. Every number is live.
export default async function HomePage() {
  const principal = await requirePrincipal()
  if (!hasAnyRegion(principal)) return <section className="narrow"><h1>Your account has no region yet</h1><p>Ask IT to add you to a region group. Nothing else loads until then.</p></section>
  const regions = visibleRegions(principal)
  const region = regions[0]
  const central = principal.globalIdentity
  const [mine, queue, attention] = await Promise.all([listMyRequests(principal), central ? listQueue(principal) : Promise.resolve([]), isOperator(principal) ? listAttention(principal) : Promise.resolve([])])
  const rows = (central ? queue : mine).slice(0, 6)
  const first = principal.displayName.split(' ')[0]
  return (
    <section className="home">
      <Suspense fallback={<HomeHeroLoading />}>
        <HomeHero principal={principal} greeting={`${greeting()}, ${first}`} />
      </Suspense>

      <form method="get" action="/customers" className="home-search" role="search">
        <input type="hidden" name="region" value={region} />
        <input name="q" placeholder="Find a partner by name, tax ID, DUNS, city or ERP number" aria-label="Find a partner" />
        <button type="submit" className="text-button">Customers</button>
        <button type="submit" formAction="/suppliers" className="text-button">Suppliers</button>
      </form>
      <p className="home-actions">Not there? Request a new <Link href={`/intake/new?domain=customer&region=${region}`}>customer</Link> or <Link href={`/intake/new?domain=supplier&region=${region}`}>supplier</Link>. The hub is checked as you type; finance approves in the service desk.</p>

      <section className="home-section">
        <header>
          <h2 className="section-title">{central ? 'Waiting for the central team' : 'Your requests'}</h2>
          <p className="section-note">{central ? <>{queue.length} waiting{attention.length ? <>, {attention.length} stopped</> : null} · <Link href="/reviews">Exceptions</Link></> : <><Link href="/requests">All requests</Link></>}</p>
        </header>
        {rows.length === 0 ? <p className="ruled-empty">{central ? 'Nothing waiting. Requests that pass every check are created without you.' : 'None yet. Your first request shows up here, with where it is.'}</p> : (
          <ol className="ruled">{rows.map((r) => (
            <li key={r.requestId}>
              <Link className="r-main" href={central ? `/reviews/${r.requestId}` : `/requests/${r.requestId}`}>{r.legalName}</Link>
              <span className="r-meta">{r.domain === 'customer' ? 'Customer' : 'Supplier'} · {r.region} · <LocalTime iso={r.updatedAt} relative /></span>
              <span className={`r-figure badge badge-${r.state.kind}`}>{STATE_LABEL[r.state.kind]}</span>
            </li>
          ))}</ol>
        )}
      </section>

      {principal.moneyRegions.length ? <Suspense fallback={null}><ExposureList principal={principal} /></Suspense> : null}
    </section>
  )
}

function greeting(): string {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}
