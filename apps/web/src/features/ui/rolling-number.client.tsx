'use client'
import { useEffect, useState } from 'react'

// The payoff number. It rolls once into place, last digit first, unchanged digits still, then holds. If it mounts
// with `roll` false (a fresh page load) it is simply the number; under reduced motion it settles on the first frame.
export function RollingNumber({ value, roll }: { value: string; roll: boolean }) {
  const [shown, setShown] = useState(roll ? value.replace(/\d/g, '0') : value)
  useEffect(() => {
    if (!roll) return
    const digits = [...value]
    const positions = digits.map((c, i) => (/\d/.test(c) ? i : -1)).filter((i) => i >= 0).reverse()
    const total = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 600
    let start = 0
    let raf = 0
    const tick = (now: number) => {
      if (!start) start = now
      const t = total === 0 ? 1 : Math.min(1, (now - start) / total)
      const out = [...digits]
      positions.forEach((pos, k) => {
        const settleAt = (k + 1) / positions.length
        if (t < settleAt) out[pos] = String(Math.floor((now / 40 + k * 3) % 10))
      })
      setShown(t >= 1 ? value : out.join(''))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, roll])
  return <span className="roll" style={{ fontVariantNumeric: 'tabular-nums' }}>{shown}</span>
}
