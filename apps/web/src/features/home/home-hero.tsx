import { isCentral, type Principal } from '@/features/auth/scope'
import { Globe } from './globe.client'
import { Greeting } from './greeting.client'
import { readGlobe } from './globe.server'
import { Figure } from './figure.client'
import { GlobeCaption } from './globe-caption.client'

// Home's opening: the greeting, then six figures, each a row that opens the list behind it, and the globe that draws
// the same partners. Hovering or focusing a figure points the globe at what it counts (lens.client.ts). The central team sees the hub across every region; a regional user sees their region and their own
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
              <Figure n={f.partners} label={plural(f.partners, 'partner', 'partners')} href="/customers" show="partners" />
              <Figure n={f.regions} label={`${plural(f.regions, 'region', 'regions')} on ${f.erps} ${plural(f.erps, 'ERP', 'ERPs')}`} />
              <Figure n={f.crossBorderGroups} label={plural(f.crossBorderGroups, 'cross-border group', 'cross-border groups')} href="/customers?status=grouped" show="groups" />
            </section>
            <section aria-label="This month">
              <h2>This month</h2>
              <Figure n={f.requestsIn} label={plural(f.requestsIn, 'request in', 'requests in')} href="/requests" />
              <Figure n={f.numbersOut} label={plural(f.numbersOut, 'ERP number out', 'ERP numbers out')} href="/requests" show="created" />
              <Figure n={f.stopped} label={plural(f.stopped, 'duplicate stopped', 'duplicates stopped')} show="stopped" />
            </section>
          </div>
        ) : (
          <div className="figures">
            <section aria-label={NAME[f.where] ?? f.where}>
              <h2>{NAME[f.where] ?? f.where}</h2>
              <Figure n={f.partners} label={plural(f.partners, 'partner', 'partners')} href={`/customers?in=${f.where}`} show="partners" />
              <Figure n={f.onHold} label="on hold" href={`/customers?in=${f.where}&status=hold`} show="hold" />
              <Figure n={f.groupsAbroad} label="in groups abroad" show="abroad" />
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
        <GlobeCaption central={f.kind === 'central'} />
      </figure>
    </div>
  )
}

export function HomeHeroLoading() {
  return <div className="home-hero"><div className="hero-copy"><h1 className="display">Hello.</h1><p className="kicker">Reading the hub…</p></div><div className="globe" /></div>
}
