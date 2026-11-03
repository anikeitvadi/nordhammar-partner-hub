'use client'
import { useRef, useState } from 'react'

// One hover layer for Home's charts: any mark with data-tip shows its text in a tooltip that follows the pointer, and a
// focused mark (keyboard) shows it too. The marks themselves stay server-rendered SVG.
export function ChartTips({ children, className }: { children: React.ReactNode; className?: string }) {
  const box = useRef<HTMLDivElement>(null)
  const [tip, setTip] = useState<{ text: string; x: number; y: number } | null>(null)
  const show = (e: React.PointerEvent | React.FocusEvent, el: Element | null) => {
    const t = (el as HTMLElement | null)?.closest('[data-tip]')
    const r = box.current?.getBoundingClientRect()
    if (!t || !r) return setTip(null)
    const p = 'clientX' in e ? { x: e.clientX, y: e.clientY } : (() => { const b = t.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top } })()
    setTip({ text: t.getAttribute('data-tip') ?? '', x: p.x - r.left, y: p.y - r.top })
  }
  return (
    <div ref={box} className={`chart-tips ${className ?? ''}`} onPointerMove={(e) => show(e, e.target as Element)} onPointerLeave={() => setTip(null)} onFocus={(e) => show(e, e.target)} onBlur={() => setTip(null)}>
      {children}
      {tip ? <div className="chart-tip" role="status" style={{ left: tip.x, top: tip.y }}>{tip.text}</div> : null}
    </div>
  )
}
