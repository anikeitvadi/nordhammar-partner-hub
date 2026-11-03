'use client'
import { useEffect, useRef, useState } from 'react'
import type { Region } from '@intake/contracts'
import type { SceneData, ScenePoint } from './scene.server'

// The hub, to scale: one point per partner, clustered by region and colored by the ERP it lives in; threads join a
// corporate group's establishments across regions; this month's requests come in through the door and settle where
// they were born. The data is the picture, not a chart about it. Canvas 2D, about 60 points and a few hundred stars,
// so it runs on anything; reduced motion draws the settled state once.
const ERP_COLOR: Record<string, string> = { 'ERP-1': '#6b9bff', 'ERP-2': '#43e0a0', 'ERP-3': '#ffb85c' }
const REGION_NAME: Record<Region, string> = { BR: 'Brazil', EU: 'Europe', US: 'United States', IN: 'India', CN: 'China' }
// Where each region sits, as fractions of the scene to the right of the door: roughly where it is on a map.
const ANCHOR: Record<Region, [number, number]> = { US: [0.16, 0.36], BR: [0.34, 0.72], EU: [0.58, 0.30], IN: [0.78, 0.64], CN: [0.9, 0.3] }
const TAU = Math.PI * 2, GOLDEN = 2.39996

type Placed = ScenePoint & { x: number; y: number; r: number }
type Mover = { name: string; outcome: string; region: Region; from: [number, number]; to: [number, number]; start: number }

function rand(seed: number) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647 }

export function HubScene({ data, title }: { data: SceneData; title: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const placedRef = useRef<Placed[]>([])
  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(null)

  useEffect(() => {
    const el = canvas.current, box = wrap.current
    if (!el || !box) return
    const ctx = el.getContext('2d')!
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // A canvas cannot resolve a CSS variable in ctx.font; read the mono family the page actually loaded.
    const mono = getComputedStyle(document.documentElement).getPropertyValue('--font-geist-mono').trim() || 'ui-monospace, monospace'
    let W = 0, H = 0, door = 0, raf = 0
    let placed: Placed[] = []
    let stars: { x: number; y: number; a: number; p: number }[] = []
    let movers: Mover[] = []
    const centers = new Map<Region, [number, number, number]>()

    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = box.clientWidth; H = box.clientHeight
      el.width = W * dpr; el.height = H * dpr; el.style.width = `${W}px`; el.style.height = `${H}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const narrow = W < 720
      door = narrow ? 18 : W * 0.34
      const fieldX = door + 30, fieldW = W - fieldX - 30
      const r = rand(7)
      stars = Array.from({ length: Math.round((W * H) / 2600) }, () => ({ x: r() * W, y: r() * H, a: 0.08 + r() * 0.35, p: r() * TAU }))
      centers.clear(); placed = []
      const regions = data.regions.length === 1 ? data.regions : (Object.keys(ANCHOR) as Region[]).filter((g) => data.regions.includes(g))
      for (const g of regions) {
        const pts = data.points.filter((p) => p.region === g)
        const [ax, ay] = regions.length === 1 ? [0.5, 0.52] : ANCHOR[g]
        const cx = fieldX + ax * fieldW, cy = 40 + ay * (H - 80)
        const spacing = regions.length === 1 ? 19 : 13
        pts.forEach((p, i) => { const rr = spacing * Math.sqrt(i + 0.6), a = i * GOLDEN; placed.push({ ...p, x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr, r: 3.2 }) })
        centers.set(g, [cx, cy, spacing * Math.sqrt(pts.length + 1) + 6])
      }
      placedRef.current = placed
      // This month's requests: each leaves the door at its own moment and flies to the rim of its region.
      const rr = rand(11)
      movers = data.requests.map((q, i) => {
        const c = centers.get(q.region) ?? [W / 2, H / 2, 20]
        const a = rr() * TAU
        return { name: q.name, outcome: q.outcome, region: q.region, from: [door, 60 + rr() * (H - 120)], to: [c[0] + Math.cos(a) * (c[2] + 10), c[1] + Math.sin(a) * (c[2] + 10)], start: 0.4 + (i / Math.max(1, data.requests.length)) * 5 }
      })
      for (let i = 0; i < data.stoppedAtEntry; i++) movers.push({ name: 'A duplicate, stopped at the door', outcome: 'bounced', region: data.regions[0], from: [door - 120, H * (0.3 + 0.4 * rr())], to: [door, H * 0.5], start: 1.5 + i })
    }

    const groups = () => {
      const by = new Map<string, Placed[]>()
      for (const p of placed) if (p.group) by.set(p.group, [...(by.get(p.group) ?? []), p])
      return [...by.values()].filter((g) => g.length > 1)
    }

    const draw = (tMs: number) => {
      const t = still ? 99 : tMs / 1000
      const loop = still ? 12 : t % 14
      ctx.clearRect(0, 0, W, H)
      // stars
      for (const s of stars) { ctx.globalAlpha = s.a * (still ? 1 : 0.7 + 0.3 * Math.sin(t * 0.8 + s.p)); ctx.fillStyle = '#cfd8ff'; ctx.fillRect(s.x, s.y, 1, 1) }
      ctx.globalAlpha = 1
      // nebula behind each region, in its ERP's color
      for (const [g, [cx, cy, r]] of centers) {
        const erp = placed.find((p) => p.region === g)?.erp ?? 'ERP-1'
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.6)
        grad.addColorStop(0, `${ERP_COLOR[erp]}2e`); grad.addColorStop(1, `${ERP_COLOR[erp]}00`)
        ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(cx, cy, r * 2.6, 0, TAU); ctx.fill()
      }
      // the door
      if (W >= 720) {
        const dg = ctx.createLinearGradient(0, 0, 0, H); dg.addColorStop(0, 'rgba(255,255,255,0)'); dg.addColorStop(0.5, 'rgba(255,255,255,.16)'); dg.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.strokeStyle = dg; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(door, 24); ctx.lineTo(door, H - 24); ctx.stroke()
      }
      // threads between one group's establishments, with a light running along each
      for (const g of groups()) {
        for (let i = 0; i < g.length - 1; i++) {
          const a = g[i], b = g[i + 1], mx = (a.x + b.x) / 2, my = Math.min(a.y, b.y) - Math.abs(a.x - b.x) * 0.35 - 20
          ctx.strokeStyle = 'rgba(220,230,255,.22)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.quadraticCurveTo(mx, my, b.x, b.y); ctx.stroke()
          const u = still ? 0.5 : (t * 0.18 + i * 0.37) % 1, v = 1 - u
          const px = v * v * a.x + 2 * v * u * mx + u * u * b.x, py = v * v * a.y + 2 * v * u * my + u * u * b.y
          ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.beginPath(); ctx.arc(px, py, 1.4, 0, TAU); ctx.fill()
        }
      }
      // partners
      for (const p of placed) {
        const c = ERP_COLOR[p.erp ?? 'ERP-1']
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 13); glow.addColorStop(0, `${c}70`); glow.addColorStop(1, `${c}00`)
        ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(p.x, p.y, 13, 0, TAU); ctx.fill()
        if (p.hold) { ctx.strokeStyle = c; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(p.x, p.y, p.r + 0.6, 0, TAU); ctx.stroke() }
        else { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.fill() }
      }
      // region labels
      ctx.font = `500 10px ${mono}`; ctx.textAlign = 'center'
      for (const [g, [cx, cy, r]] of centers) { ctx.fillStyle = 'rgba(230,236,255,.5)'; ctx.fillText(`${REGION_NAME[g].toUpperCase()} · ${placed.filter((p) => p.region === g).length}`, cx, cy + r + 22) }
      // this month's requests coming in
      for (const m of movers) {
        const k = Math.min(1, Math.max(0, (loop - m.start) / 2.2)), e = 1 - Math.pow(1 - k, 3)
        if (k <= 0) continue
        if (m.outcome === 'bounced') {
          const out = k < 0.5 ? k * 2 : 2 - k * 2
          const x = m.from[0] + (m.to[0] - m.from[0]) * out, y = m.from[1] + (m.to[1] - m.from[1]) * out * 0.2
          ctx.fillStyle = `rgba(255,110,110,${1 - k * 0.8})`; ctx.beginPath(); ctx.arc(x, y, 2.4, 0, TAU); ctx.fill()
          if (k > 0.45 && k < 0.6) { ctx.strokeStyle = 'rgba(255,110,110,.6)'; ctx.beginPath(); ctx.arc(m.to[0], y, 8 * (k - 0.4) * 10, 0, TAU); ctx.stroke() }
          continue
        }
        const x = m.from[0] + (m.to[0] - m.from[0]) * e, y = m.from[1] + (m.to[1] - m.from[1]) * e - Math.sin(e * Math.PI) * 30
        const col = m.outcome === 'created' ? '#ffffff' : m.outcome === 'waiting' ? '#aab3c9' : '#ff8f8f'
        const alpha = m.outcome === 'declined' ? 1 - k * 0.85 : 1
        ctx.globalAlpha = alpha
        if (k < 1) { ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.beginPath(); ctx.moveTo(x - (m.to[0] - m.from[0]) * 0.03, y); ctx.lineTo(x, y); ctx.stroke() }
        const pulse = m.outcome === 'waiting' && !still ? 0.6 + 0.4 * Math.sin(t * 3 + m.start) : 1
        ctx.fillStyle = col; ctx.globalAlpha = alpha * pulse; ctx.beginPath(); ctx.arc(x, y, m.outcome === 'created' && k >= 1 ? 2.8 : 2.2, 0, TAU); ctx.fill()
        if (m.outcome === 'created' && k >= 1 && loop - m.start - 2.2 < 0.8) { const f = (loop - m.start - 2.2) / 0.8; ctx.strokeStyle = `rgba(255,255,255,${0.7 * (1 - f)})`; ctx.beginPath(); ctx.arc(x, y, 3 + f * 12, 0, TAU); ctx.stroke() }
        ctx.globalAlpha = 1
      }
      if (!still) raf = requestAnimationFrame(draw)
    }

    layout(); raf = requestAnimationFrame(draw)
    const ro = new ResizeObserver(() => { layout(); if (still) draw(0) })
    ro.observe(box)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [data])

  const onMove = (e: React.PointerEvent) => {
    const r = wrap.current!.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top
    let best: Placed | null = null, d = 12
    for (const p of placedRef.current) { const dd = Math.hypot(p.x - x, p.y - y); if (dd < d) { d = dd; best = p } }
    setTip(best ? { x, y, text: `${best.name} · ${REGION_NAME[best.region]} · ${best.erp ?? 'no ERP yet'}${best.erpNumber ? ` ${best.erpNumber}` : ''}${best.group ? ` · ${best.group}` : ''}${best.hold ? ' · on hold' : ''}` } : null)
  }

  return (
    <div className="scene" ref={wrap} onPointerMove={onMove} onPointerLeave={() => setTip(null)}>
      <canvas ref={canvas} role="img" aria-label={`${data.points.length} partners as points, by region and ERP, with corporate groups joined by threads`} />
      <div className="scene-panel">{title}</div>
      {tip ? <div className="scene-tip" style={{ left: tip.x, top: tip.y }}>{tip.text}</div> : null}
    </div>
  )
}
