'use client'
import { useEffect, useRef, useState } from 'react'
import { geoDistance, geoInterpolate, geoOrthographic, geoPath } from 'd3-geo'
import type { GlobeData, GlobePoint } from './globe.server'

// Home's globe, in ink on paper: land as a dot matrix that fades toward the limb (the only shading), partners as solid
// points at their cities, a corporate group's establishments joined by hairline great-circle arcs, and this month's
// events as single rings: an ERP number assigned expands from its city; a duplicate stopped at entry closes on the
// record it collided with. Turns once a minute; drag to turn it; hover a point to name it. Reduced motion: still.
const INK = '17,17,19'

export function Globe({ data }: { data: GlobeData }) {
  const box = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const state = useRef({ lambda: 8, phi: -26, drag: null as null | { x: number; y: number; l: number; p: number }, resumeAt: 0 })
  const visible = useRef<{ p: GlobePoint; x: number; y: number }[]>([])
  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(null)

  useEffect(() => {
    const el = canvas.current, wrap = box.current
    if (!el || !wrap) return
    const ctx = el.getContext('2d')!
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let S = 0, raf = 0, last = performance.now()
    const t0 = performance.now()
    const proj = geoOrthographic().clipAngle(90).precision(0.3)
    const path = geoPath(proj, ctx)
    const arcs = data.arcs.map(([a, b]) => { const f = geoInterpolate(a, b); return Array.from({ length: 49 }, (_, i) => f(i / 48)) })

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      S = wrap.clientWidth
      el.width = S * dpr; el.height = S * dpr; el.style.width = `${S}px`; el.style.height = `${S}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      proj.scale(S / 2 - 6).translate([S / 2, S / 2])
    }

    const frame = (now: number) => {
      const st = state.current
      const dt = Math.min(now - last, 64); last = now
      if (!still && !st.drag && now > st.resumeAt) st.lambda += dt * 0.006 // one turn a minute
      proj.rotate([st.lambda, st.phi])
      const center: [number, number] = [-st.lambda, -st.phi]
      const t = (now - t0) / 1000
      ctx.clearRect(0, 0, S, S)
      // the limb, one hairline
      ctx.strokeStyle = `rgba(${INK},.18)`; ctx.lineWidth = 1; ctx.beginPath(); path({ type: 'Sphere' }); ctx.stroke()
      // land: dots fade toward the edge, which is all the depth the sphere needs
      for (const d of data.land) {
        const dist = geoDistance(d, center)
        if (dist > Math.PI / 2) continue
        const xy = proj(d); if (!xy) continue
        ctx.fillStyle = `rgba(${INK},${(0.08 + 0.42 * Math.cos(dist)).toFixed(3)})`
        ctx.fillRect(xy[0] - 0.75, xy[1] - 0.75, 1.5, 1.5)
      }
      // a group's establishments, joined; each arc draws itself once, then a single ink dot travels it
      const grow = still ? 1 : Math.min(1, t / 2.4)
      arcs.forEach((line, i) => {
        const upto = Math.max(2, Math.round(line.length * grow))
        ctx.strokeStyle = `rgba(${INK},.62)`; ctx.lineWidth = 1; ctx.beginPath(); path({ type: 'LineString', coordinates: line.slice(0, upto) }); ctx.stroke()
        if (grow === 1 && !still) {
          const k = ((t * 0.12 + i * 0.31) % 1) * (line.length - 1), q = line[Math.floor(k)]
          if (geoDistance(q, center) < Math.PI / 2) { const xy = proj(q)!; ctx.fillStyle = `rgb(${INK})`; ctx.beginPath(); ctx.arc(xy[0], xy[1], 1.8, 0, Math.PI * 2); ctx.fill() }
        }
      })
      // partners
      const vis: { p: GlobePoint; x: number; y: number }[] = []
      for (const p of data.points) {
        if (geoDistance(p.at, center) > Math.PI / 2 - 0.02) continue
        const xy = proj(p.at)!; vis.push({ p, x: xy[0], y: xy[1] })
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(xy[0], xy[1], 4.2, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = `rgb(${INK})`; ctx.beginPath(); ctx.arc(xy[0], xy[1], 2.7, 0, Math.PI * 2); ctx.fill()
      }
      visible.current = vis
      // this month: one ring per event, staggered over a nine-second cycle
      data.events.forEach((e, i) => {
        if (geoDistance(e.at, center) > Math.PI / 2 - 0.02) return
        const xy = proj(e.at)!
        const k = still ? 0.5 : (((t + i * (9 / Math.max(1, data.events.length))) % 9) / 1.6)
        if (k > 1) return
        const ease = 1 - Math.pow(1 - k, 3)
        if (e.kind === 'created') { ctx.strokeStyle = `rgba(${INK},${(1 - ease).toFixed(3)})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(xy[0], xy[1], 4 + ease * 20, 0, Math.PI * 2); ctx.stroke() }
        else { ctx.setLineDash([2, 3]); ctx.strokeStyle = `rgba(${INK},${(1 - ease * 0.7).toFixed(3)})`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(xy[0], xy[1], 24 - ease * 18, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]) }
      })
      if (!still) raf = requestAnimationFrame(frame)
    }

    size(); raf = requestAnimationFrame(frame)
    const ro = new ResizeObserver(() => { size(); if (still) requestAnimationFrame(frame) })
    ro.observe(wrap)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [data])

  const onDown = (e: React.PointerEvent) => { const st = state.current; st.drag = { x: e.clientX, y: e.clientY, l: st.lambda, p: st.phi }; (e.target as Element).setPointerCapture(e.pointerId) }
  const onUp = () => { state.current.drag = null; state.current.resumeAt = performance.now() + 1500 }
  const onMove = (e: React.PointerEvent) => {
    const st = state.current
    if (st.drag) { st.lambda = st.drag.l + (e.clientX - st.drag.x) * 0.35; st.phi = Math.max(-60, Math.min(60, st.drag.p - (e.clientY - st.drag.y) * 0.35)); setTip(null); return }
    const r = box.current!.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top
    let best: (typeof visible.current)[number] | null = null, d = 10
    for (const v of visible.current) { const dd = Math.hypot(v.x - x, v.y - y); if (dd < d) { d = dd; best = v } }
    setTip(best ? { x: best.x, y: best.y, text: `${best.p.name}, ${best.p.city}${best.p.erp ? ` · ${best.p.erp}${best.p.erpNumber ? ` ${best.p.erpNumber}` : ''}` : ''}${best.p.group ? ` · ${best.p.group}` : ''}` } : null)
  }

  return (
    <div className="globe" ref={box} onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={onUp} onPointerMove={onMove} onPointerLeave={() => setTip(null)}>
      <canvas ref={canvas} role="img" aria-label={`A globe with ${data.points.length} partners at their cities and ${data.arcs.length} arcs joining corporate groups across regions`} />
      {tip ? <div className="globe-tip" style={{ left: tip.x, top: tip.y }}>{tip.text}</div> : null}
    </div>
  )
}
