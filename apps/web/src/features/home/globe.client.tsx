'use client'
import { useEffect, useRef, useState } from 'react'
import { geoDistance, geoInterpolate, geoOrthographic, geoPath } from 'd3-geo'
import type { GlobeArc, GlobeData, GlobeEvent, GlobePoint } from './types'
import { lens, type Lens } from './lens.client'

// Home's globe, in ink on paper. Land is a dot matrix that fades toward the limb (the only shading). Partners sit at
// their cities, and the globe starts facing them. A corporate group's establishments are joined by arcs bowed off their
// chord, so arcs between nearby cities fan apart instead of stacking; each carries a white halo so it reads over the
// land. One ink dot travels each arc at a constant speed. This month's events ring once at their city. Turns once
// a minute; drag to turn it; hover a point or an arc to name it. Reduced motion: still.
// A figure beside the globe can point it at what it counts (lens.client.ts): the matching partners, arcs or events go
// full ink, the rest fall back, the events ring together, and the globe turns to face them.
const INK = '17,17,19'
const SAMPLES = 72

type Screen = { x: number; y: number; vis: boolean }

const lit = {
  point: (l: Lens, p: GlobePoint, cross: Set<string>) => l === 'partners' ? p.mine : l === 'hold' ? p.hold && p.mine : l === 'groups' ? !!p.group && cross.has(p.group) : l === 'abroad' ? p.mine && !!p.group && cross.has(p.group) : false,
  arc: (l: Lens, a: GlobeArc) => l === 'groups' ? a.cross : l === 'abroad' ? a.cross && a.mine : false,
  event: (l: Lens, e: GlobeEvent) => (l === 'created' && e.kind === 'created') || (l === 'stopped' && e.kind === 'stopped'),
}
// the middle of what a lens lights, for the globe to turn toward (a plain mean is fine for the regions the hub has)
function middle(at: [number, number][]): [number, number] | null {
  return at.length ? [at.reduce((n, a) => n + a[0], 0) / at.length, at.reduce((n, a) => n + a[1], 0) / at.length] : null
}
// the shortest turn from one longitude to another
const turn = (from: number, to: number) => ((((to - from) % 360) + 540) % 360) - 180

export function Globe({ data }: { data: GlobeData }) {
  const box = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  // face the middle of this person's partners (a plain mean of longitudes is fine for the regions the hub has)
  const focus = data.points.some((p) => p.mine) ? data.points.filter((p) => p.mine) : data.points
  const [lon0, lat0] = focus.length ? [focus.reduce((n, p) => n + p.at[0], 0) / focus.length, focus.reduce((n, p) => n + p.at[1], 0) / focus.length] : [-8, 26]
  const state = useRef({ lambda: -lon0, phi: Math.max(-40, Math.min(40, -lat0 + 12)), drag: null as null | { x: number; y: number; l: number; p: number }, resumeAt: 0 })
  const hit = useRef<{ points: { p: GlobePoint; x: number; y: number }[]; arcs: { a: GlobeArc; pts: Screen[] }[] }>({ points: [], arcs: [] })
  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(null)

  useEffect(() => {
    const el = canvas.current, wrap = box.current
    if (!el || !wrap) return
    const ctx = el.getContext('2d')!
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let S = 0, raf = 0, last = performance.now()
    const t0 = performance.now()
    const cross = new Set(data.arcs.filter((a) => a.cross).map((a) => a.group))
    // the lens fades in and out over a quarter second; `shown` keeps the last one lit while it fades out
    let amt = 0, shown: Lens | null = null
    const proj = geoOrthographic().clipAngle(90).precision(0.2)
    const path = geoPath(proj, ctx)
    // Each arc's great-circle samples.
    const arcs = data.arcs.map((a, i) => {
        const f = geoInterpolate(a.from, a.to)
      const len = geoDistance(a.from, a.to)
      return { a, i, len, geo: Array.from({ length: SAMPLES + 1 }, (_, k) => f(k / SAMPLES)) }
    })

    // Room around the disc for arcs that lift off it near the limb, and for the event rings.
    const pad = () => Math.max(8, Math.round(S * 0.07))
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 3)
      S = wrap.clientWidth
      el.width = Math.round(S * dpr); el.height = Math.round(S * dpr); el.style.width = `${S}px`; el.style.height = `${S}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      proj.scale(S / 2 - pad()).translate([S / 2, S / 2])
    }
    // An arc on screen: its great-circle samples, bowed sideways off the chord by a share of the chord's length, so a
    // short arc in the middle of the disc parts from its neighbours as clearly as a long one at the limb. Arcs alternate
    // sides. A sample shows when its city side faces us.
    const bowed = (arc: (typeof arcs)[number], upto: number, center: [number, number]): Screen[] => {
      const a = proj(arc.a.from)!, b = proj(arc.a.to)!
      const dx = b[0] - a[0], dy = b[1] - a[1], chord = Math.hypot(dx, dy) || 1
      const nx = -dy / chord, ny = dx / chord
      // Arcs alternate sides, so neighbours part. Near the limb a bow can carry an arc off the disc: it may lift into
      // the margin around the globe, never past the canvas edge. The side that stays closer wins; if neither fits, the
      // bow shrinks until it does.
      const R = S / 2 - pad(), limit = S / 2 - 6
      // Every sample of the whole arc, not just its middle: near the limb the great circle itself runs close to the edge.
      const base = arc.geo.map((g) => proj(g)!)
      const reach = (bow: number) => Math.max(...base.map((xy, k) => { const o = Math.sin(Math.PI * (k / SAMPLES)) * bow; return Math.hypot(xy[0] + nx * o - S / 2, xy[1] + ny * o - S / 2) }))
      const preferred = arc.i % 2 ? 1 : -1
      let mag = (0.22 + (arc.i % 3) * 0.05) * chord
      const side = reach(mag * preferred) <= R ? preferred : reach(mag * -preferred) < reach(mag * preferred) ? -preferred : preferred
      for (let n = 0; n < 12 && reach(mag * side) > limit; n++) mag *= 0.8
      const bow = mag * side
      return arc.geo.slice(0, upto).map((g, k) => {
        const xy = base[k], s = Math.sin(Math.PI * (k / SAMPLES)) * bow
        return { x: xy[0] + nx * s, y: xy[1] + ny * s, vis: geoDistance(g, center) < Math.PI / 2 }
      })
    }
    // the travelling dot sits on the same bowed line, between samples
    const along = (pts: Screen[], k: number): Screen => {
      const f = k * SAMPLES, j = Math.min(SAMPLES - 1, Math.floor(f)), r = f - j, p = pts[j], q = pts[j + 1]
      return { x: p.x + (q.x - p.x) * r, y: p.y + (q.y - p.y) * r, vis: p.vis && q.vis }
    }

    const frame = (now: number) => {
      const st = state.current
      const dt = Math.min(now - last, 64); last = now
      const want = lens.get()
      if (want) shown = want
      amt = still ? (want ? 1 : 0) : Math.max(0, Math.min(1, amt + (want ? 1 : -1) * dt / 250))
      if (!want && amt === 0) shown = null
      const L = amt > 0 ? shown : null
      // while a figure points at something, the globe turns to face it instead of spinning
      const aim = want && !st.drag ? middle([...data.points.filter((p) => lit.point(want, p, cross)).map((p) => p.at), ...data.arcs.filter((a) => lit.arc(want, a)).flatMap((a) => [a.from, a.to]), ...data.events.filter((e) => lit.event(want, e)).map((e) => e.at)]) : null
      if (aim) {
        const k = still ? 1 : Math.min(1, dt / 220)
        st.lambda += turn(st.lambda, -aim[0]) * k
        st.phi += (Math.max(-40, Math.min(40, -aim[1] + 12)) - st.phi) * k
        st.resumeAt = now + 1200
      } else if (!still && !st.drag && now > st.resumeAt) st.lambda += dt * 0.006 // one turn a minute
      const dim = (on: boolean) => (L && !on ? 1 - 0.78 * amt : 1)
      proj.rotate([st.lambda, st.phi])
      const center: [number, number] = [-st.lambda, -st.phi]
      const t = (now - t0) / 1000
      ctx.clearRect(0, 0, S, S)

      // land: crisp round dots in five depth bands, one path per band
      const bands: number[][] = [[], [], [], [], []]
      for (const d of data.land) {
        const dist = geoDistance(d, center)
        if (dist > Math.PI / 2) continue
        const xy = proj(d); if (!xy) continue
        bands[Math.min(4, Math.floor(Math.cos(dist) * 5))].push(xy[0], xy[1])
      }
      bands.forEach((pts, b) => {
        ctx.fillStyle = `rgba(${INK},${((0.1 + b * 0.09) * (L ? 1 - 0.35 * amt : 1)).toFixed(3)})`
        ctx.beginPath()
        for (let i = 0; i < pts.length; i += 2) { ctx.moveTo(pts[i] + 0.9, pts[i + 1]); ctx.arc(pts[i], pts[i + 1], 0.9, 0, Math.PI * 2) }
        ctx.fill()
      })
      ctx.strokeStyle = `rgba(${INK},.16)`; ctx.lineWidth = 1; ctx.beginPath(); path({ type: 'Sphere' }); ctx.stroke()

      // arcs draw on over two seconds, then hold: a white halo under an ink line
      const grow = still ? 1 : Math.min(1, t / 2)
      const ease = 1 - Math.pow(1 - grow, 3)
      const arcHits: { a: GlobeArc; pts: Screen[] }[] = []
      arcs.forEach((arc, i) => {
        const upto = Math.max(2, Math.round(SAMPLES * ease) + 1)
        const pts = bowed(arc, upto, center)
        arcHits.push({ a: arc.a, pts })
        // an arc that touches the person's own region in full ink; the rest of the company's arcs behind it
        const on = L ? lit.arc(L, arc.a) : false
        const ink = on ? 0.88 + 0.12 * amt : (arc.a.mine ? 0.88 : 0.28) * dim(false)
        for (const [width, colour] of [[on ? 4 + 1.5 * amt : 4, '#fff'], [on ? 1.3 + 0.9 * amt : 1.3, `rgba(${INK},${ink.toFixed(3)})`]] as const) {
          ctx.strokeStyle = colour; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath()
          let pen = false
          for (const p of pts) { if (!p.vis) { pen = false; continue } if (pen) ctx.lineTo(p.x, p.y); else { ctx.moveTo(p.x, p.y); pen = true } }
          ctx.stroke()
        }
        // one dot travels the arc at a constant speed, fading in and out at its ends, then rests before the next pass
        if (grow === 1 && !still && (L ? on : arc.a.mine)) {
          const dur = 2.2 + arc.len * 2.4, cycle = dur + 1.6
          const k = ((t + i * 0.9) % cycle) / dur
          if (k < 1) {
            const p = along(pts, k)
            if (p.vis) {
              ctx.globalAlpha = Math.min(1, k / 0.12, (1 - k) / 0.12)
              ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p.x, p.y, 3.4, 0, Math.PI * 2); ctx.fill()
              ctx.fillStyle = `rgb(${INK})`; ctx.beginPath(); ctx.arc(p.x, p.y, 2.1, 0, Math.PI * 2); ctx.fill()
              ctx.globalAlpha = 1
            }
          }
        }
      })

      // partners: a white keyline and an ink disc; outside the person's own regions, a smaller grey one
      const pointHits: { p: GlobePoint; x: number; y: number }[] = []
      // lit partners in a second pass, on top: another partner in the same city must not cover one that is lit
      const ordered = L ? [...data.points.filter((p) => !lit.point(L, p, cross)), ...data.points.filter((p) => lit.point(L, p, cross))] : data.points
      for (const p of ordered) {
        if (geoDistance(p.at, center) > Math.PI / 2 - 0.02) continue
        const xy = proj(p.at)!
        pointHits.push({ p, x: xy[0], y: xy[1] })
        const on = L ? lit.point(L, p, cross) : false
        const big = on ? 1 + 0.35 * amt : 1, a = on ? 1 : (p.mine ? 1 : 0.32) * dim(false)
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(xy[0], xy[1], (p.mine || on ? 4 : 3) * big, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = `rgba(${INK},${a.toFixed(3)})`; ctx.beginPath(); ctx.arc(xy[0], xy[1], (p.mine || on ? 2.6 : 2) * big, 0, Math.PI * 2); ctx.fill()
      }
      hit.current = { points: pointHits, arcs: arcHits }

      // this month: one ring per event, staggered over a nine-second cycle
      data.events.forEach((e, i) => {
        if (geoDistance(e.at, center) > Math.PI / 2 - 0.02) return
        const xy = proj(e.at)!
        const on = L ? lit.event(L, e) : false
        if (L && !on) return
        if (on) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(xy[0], xy[1], 4.4, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = `rgba(${INK},${amt.toFixed(3)})`; ctx.beginPath(); ctx.arc(xy[0], xy[1], 3, 0, Math.PI * 2); ctx.fill() }
        const k = still ? 0.5 : on ? ((t % 1.8) / 1.6) : (((t + i * (9 / Math.max(1, data.events.length))) % 9) / 1.6)
        if (k > 1) return
        const ez = 1 - Math.pow(1 - k, 3)
        if (e.kind === 'created') { ctx.strokeStyle = `rgba(${INK},${(1 - ez).toFixed(3)})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(xy[0], xy[1], 4 + ez * 18, 0, Math.PI * 2); ctx.stroke() }
        else { ctx.setLineDash([2, 3]); ctx.strokeStyle = `rgba(${INK},${(1 - ez * 0.7).toFixed(3)})`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(xy[0], xy[1], 22 - ez * 16, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]) }
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
    let best: { d: number; x: number; y: number; text: string } | null = null
    for (const v of hit.current.points) {
      const d = Math.hypot(v.x - x, v.y - y)
      if (d < 9 && (!best || d < best.d)) best = { d, x: v.x, y: v.y, text: `${v.p.name}, ${v.p.city}${v.p.erp ? ` · ${v.p.erp}${v.p.erpNumber ? ` ${v.p.erpNumber}` : ''}` : ''}${v.p.group ? ` · ${v.p.group}` : ''}` }
    }
    // a point wins over the arcs that end at it
    if (!best) for (const h of hit.current.arcs) for (const p of h.pts) {
      if (!p.vis) continue
      const d = Math.hypot(p.x - x, p.y - y)
      if (d < 6 && (!best || d < best.d)) best = { d, x, y, text: `${h.a.group} · ${h.a.fromCity} and ${h.a.toCity}` }
    }
    setTip(best ? { x: best.x, y: best.y, text: best.text } : null)
  }

  return (
    <div className="globe" ref={box} onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={onUp} onPointerMove={onMove} onPointerLeave={() => setTip(null)}>
      <canvas ref={canvas} role="img" aria-label={`A globe with ${data.points.length} partners at their cities and ${data.arcs.length} arcs joining corporate groups across regions`} />
      {tip ? <div className="globe-tip" style={{ left: tip.x, top: tip.y }}>{tip.text}</div> : null}
    </div>
  )
}
