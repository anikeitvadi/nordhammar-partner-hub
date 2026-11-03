import type { Principal } from '@/features/auth/scope'
import { HubScene } from './hub-scene.client'
import { readScene } from './scene.server'

// Home's hero: the hub drawn to scale (hub-scene.client.tsx), with the reading of it on the left, Parity-style: what one
// point is, the counts in mono, and this month's traffic through the door. Server-rendered text over a client canvas.
const ERPS: [string, string, string][] = [['ERP-1', 'Brazil, United States, India', 'erp1'], ['ERP-2', 'Europe', 'erp2'], ['ERP-3', 'China', 'erp3']]

export async function HubSceneTile({ principal }: { principal: Principal }) {
  const data = await readScene(principal)
  const n = (erp: string) => data.points.filter((p) => p.erp === erp).length
  const groups = new Set(data.points.filter((p) => p.group).map((p) => p.group)).size
  const q = (o: string) => data.requests.filter((r) => r.outcome === o).length
  const title = (
    <>
      <p className="scene-eyebrow">The hub, to scale</p>
      <h2 className="scene-title">1 point = 1 partner.</h2>
      <p className="scene-lede">{data.points.length} records across {data.regions.length === 1 ? 'your region' : `${data.regions.length} regions`}, one per company and site, each in the ERP that numbered it. Threads join one group&apos;s establishments: the duplicates this hub exists to stop.</p>
      <ul className="scene-legend">
        {ERPS.filter(([e]) => n(e) > 0).map(([e, where, cls]) => <li key={e}><span className={`dot ${cls}`} />{e} <span className="where">{where}</span><b>{n(e)}</b></li>)}
        <li><span className="thread" />Corporate groups<b>{groups}</b></li>
      </ul>
      <p className="scene-eyebrow">This month, through the door</p>
      <ul className="scene-legend">
        <li><span className="dot req" />Requests in<b>{data.requests.length}</b></li>
        <li><span className="dot req" />ERP numbers out<b>{q('created')}</b></li>
        <li><span className="dot wait" />Still waiting<b>{q('waiting')}</b></li>
        <li><span className="dot stop" />Duplicates stopped at the door<b>{data.stoppedAtEntry}</b></li>
      </ul>
      <p className="scene-foot">points are 1:1 · hover one</p>
    </>
  )
  return <div className="tile span3 scene-tile"><HubScene data={data} title={title} /></div>
}

export function HubSceneLoading() {
  return <div className="tile span3 scene-tile"><div className="scene" /></div>
}
