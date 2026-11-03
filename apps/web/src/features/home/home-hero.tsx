import type { Principal } from '@/features/auth/scope'
import { Globe } from './globe.client'
import { readGlobe } from './globe.server'

// Home's opening statement: one claim in the serif, the figures behind it under hairlines, and the globe that
// shows it. Every number is read live for the person's regions (globe.server.ts).
export async function HomeHero({ principal, greeting }: { principal: Principal; greeting: string }) {
  const { globe, figures: f } = await readGlobe(principal)
  return (
    <div className="home-hero">
      <div className="hero-copy">
        <p className="kicker">{greeting} · {principal.globalIdentity ? 'All regions' : `Region ${principal.regions.join(', ')}`}</p>
        <h1 className="display">{f.partners} partners.<br />One record each.</h1>
        <p className="lede">Every customer and supplier, in every region and every ERP, held once. Each line on the globe is one company with establishments in more than one place: the duplicate this hub exists to stop.</p>
        <dl className="figures">
          <div><dt>Regions</dt><dd>{f.regions}</dd></div>
          <div><dt>ERPs</dt><dd>{f.erps}</dd></div>
          <div><dt>Groups across borders</dt><dd>{f.crossBorderGroups}</dd></div>
        </dl>
        <dl className="figures">
          <div><dt>Requests this month</dt><dd>{f.requestsIn}</dd></div>
          <div><dt>ERP numbers out</dt><dd>{f.numbersOut}</dd></div>
          <div><dt>Duplicates stopped</dt><dd>{f.stopped}</dd></div>
        </dl>
      </div>
      <Globe data={globe} />
    </div>
  )
}

export function HomeHeroLoading() {
  return <div className="home-hero"><div className="hero-copy"><p className="kicker">Partner Hub</p><h1 className="display">Reading the hub…</h1></div><div className="globe" /></div>
}
