'use client'
import { useEffect, useRef, useState } from 'react'
import { prepare, measureNaturalWidth } from '@chenglou/pretext'

// The Nordhammar mark drawn in ledger text: an N whose characters are real request ids, partner names and status
// words. Pretext measures the mono glyph width without touching the DOM, so the grid is sized to whole pixels before
// anything is painted. The text reflows slowly through the mark (one column every 1.8 s); under reduced motion it is
// a still. Only on the sign-in page; never on a working screen.
const FONT = '11px GeistMono'
const LINE = 12
const ROWS = 16

// A 5×7 bitmap for the letters of the wordmark. Wide tiles draw NORDHAMMAR; narrow ones draw the N alone, doubled.
const GLYPHS: Record<string, string[]> = {
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
}
const WORD = 'NORDHAMMAR'

function mask(cols: number): boolean[][] {
  // cells are about 6.6×12px, so a glyph doubled horizontally is close to square and reads as a dot-matrix letter
  const wide = cols >= WORD.length * 12 + 2
  const word = wide || cols >= WORD.length * 6 + 2 ? WORD : 'N'
  const hx = wide || word === 'N' ? 2 : 1 // horizontal scale
  const vy = 2 // vertical scale: a glyph row is two text rows, so a stroke is a 2×2 block and reads as a stroke
  const glyphW = 5 * hx, gap = hx
  const markW = word.length * glyphW + (word.length - 1) * gap
  const left = Math.max(0, Math.floor((cols - markW) / 2))
  const top = Math.floor((ROWS - 7 * vy) / 2)
  const rows: boolean[][] = []
  for (let r = 0; r < ROWS; r++) {
    const row = new Array<boolean>(cols).fill(false)
    const gr = Math.floor((r - top) / vy)
    if (r >= top && gr >= 0 && gr < 7) {
      for (let i = 0; i < word.length; i++) {
        const bits = GLYPHS[word[i]][gr]
        for (let b = 0; b < 5; b++) if (bits[b] === '1') for (let k = 0; k < hx; k++) { const c = left + i * (glyphW + gap) + b * hx + k; if (c < cols) row[c] = true }
      }
    }
    rows.push(row)
  }
  return rows
}

export function AsciiLedger({ lines }: { lines: string[] }) {
  const host = useRef<HTMLDivElement>(null)
  const [cols, setCols] = useState(0)
  const [offset, setOffset] = useState(0)
  // every mark cell carries a glyph: the words run together without spaces, so the letters read as solid shapes
  const text = (lines.join('·') + '·').replace(/\s+/g, '')

  useEffect(() => {
    const el = host.current
    if (!el) return
    const prepared = prepare('0'.repeat(50), FONT)
    const glyph = measureNaturalWidth(prepared) / 50
    const fit = () => setCols(Math.max(16, Math.floor(el.clientWidth / glyph)))
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setOffset((o) => o + 1), 1800)
    return () => clearInterval(id)
  }, [])

  const m = cols ? mask(cols) : []
  return (
    <div ref={host} className="ledger" aria-hidden="true" style={{ font: FONT, lineHeight: `${LINE}px` }}>
      {m.map((row, r) => {
        let out = ''
        for (let c = 0; c < cols; c++) {
          const ch = text[(r * 37 + c + offset) % text.length]
          out += row[c] ? ch : (c % 8 === 0 && r % 4 === 1 ? '·' : ' ')
        }
        return <div key={r} className="ledger-row">{out}</div>
      })}
    </div>
  )
}
