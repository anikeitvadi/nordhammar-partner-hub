import Link from 'next/link'
import { isCentral, type Principal } from '@/features/auth/scope'
import { Globe } from './globe.client'
import { Greeting } from './greeting.client'
import { readGlobe } from './globe.server'

// Home's opening: the greeting, then six figures, each a row that opens the list behind it, and the globe that draws
// the same partners. The central team sees the hub across every region; a regional user sees their region and their own
// requests (globe.server.ts). Every number is read live.
const NAME: Record<string, string> = { BR: 'Brazil', EU: 'Europe', US: 'United States', IN: 'India', CN: 'China' }
export async function HomeHero({ principal, name }: { principal: Principal; name: string }) {
  const { globe, figures: f } = await readGlobe(principal)
  const scope = isCentral(principal) ? 'Central team, all regions' : `Regional user, ${principal.regions.map((r) => NAME[r] ?? r).join(', ')}`
  const plural = (n: number, one: string, many: string) => (n === 1 ? one : many)
  return (
    <div className="home-hero">
      <div className="hero-copy">
        <Greeting name={name} scope={scope} />
        {f.kind === 'central' ? (
          <div className="figures">
            <section aria-label="The hub">
              <h2>The hub</h2>
              <Figure n={f.partners} label={plural(f.partners, 'partner', 'partners')} href="/customers" />
              <Figure n={f.regions} label={`${plural(f.regions, 'region', 'regions')} on ${f.erps} ${plural(f.erps, 'ERP', 'ERPs')}`} />
              <Figure n={f.crossBorderGroups} label={plural(f.crossBorderGroups, 'cross-border group', 'cross-border groups')} href="/customers?status=grouped" />
            </section>
            <section aria-label="This month">
              <h2>This month</h2>
              <Figure n={f.requestsIn} label={plural(f.requestsIn, 'request in', 'requests in')} href="/requests" />
              <Figure n={f.numbersOut} label={plural(f.numbersOut, 'ERP number out', 'ERP numbers out')} href="/requests" />
              <Figure n={f.stopped} label={plural(f.stopped, 'duplicate stopped', 'duplicates stopped')} />
            </section>
          </div>
        ) : (
          <div className="figures">
            <section aria-label={NAME[f.where] ?? f.where}>
              <h2>{NAME[f.where] ?? f.where}</h2>
              <Figure n={f.partners} label={plural(f.partners, 'partner', 'partners')} href={`/customers?in=${f.where}`} />
              <Figure n={f.onHold} label="on hold" href={`/customers?in=${f.where}&status=hold`} />
              <Figure n={f.groupsAbroad} label="in groups abroad" />
            </section>
            <section aria-label="Your requests">
              <h2>Your requests</h2>
              <Figure n={f.mineIn} label="this month" href="/requests" />
              <Figure n={f.mineWaiting} label={plural(f.mineWaiting, 'waiting on someone', 'waiting on someone')} href="/requests" />
              <Figure n={f.mineCreated} label="created this month" href="/requests" />
            </section>
          </div>
        )}
      </div>
      <figure className="globe-figure">
        <Globe data={globe} />
        <figcaption>{f.kind === 'central' ? <>Each line joins one group&rsquo;s companies in two places. Drag to turn it.</> : <>Your region in ink, the rest of the company behind it. Each line joins one group&rsquo;s companies. Drag to turn it.</>}</figcaption>
      </figure>
    </div>
  )
}

function Figure({ n, label, href }: { n: number; label: string; href?: string }) {
  const body = <><span className="fig-n">{n}</span><span className="fig-label">{label}</span></>
  return href ? <Link href={href} className="fig fig-link">{body}<span className="fig-go" aria-hidden="true">→</span></Link> : <div className="fig">{body}</div>
}

export function HomeHeroLoading() {
  return <div className="home-hero"><div className="hero-copy"><h1 className="display">Hello.</h1><p className="kicker">Reading the hub…</p></div><div className="globe" /></div>
}
