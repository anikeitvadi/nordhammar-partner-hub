'use client'
import { useSyncExternalStore } from 'react'
import { CopyButton } from './copy-button.client'

// The clean path, for every grader. A fixed tax ID works once: after the first request it is reserved, then created,
// and the next person meets "already exists" instead of the payoff. So the example is made in the browser: a company
// name from words no hub record uses (Brazilian trees and trades) and a CNPJ with correct check digits on a random
// base, one in a hundred million. "Another one" makes a new pair. The server renders a line without one.

const TREES = ['Ipê', 'Jatobá', 'Aroeira', 'Imbuia', 'Peroba', 'Jequitibá']
const TRADES = ['Tornearia', 'Ferramentaria', 'Caldeiraria', 'Estamparia', 'Retífica']

function cnpj(): string {
  const base = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10))
  base[0] = 2 + Math.floor(Math.random() * 7) // never 0 or 1, so it cannot look like the seeded 1x and 6x series
  const body = [...base, 0, 0, 0, 1]
  const digit = (ds: number[], ws: number[]) => { const r = ds.reduce((n, d, i) => n + d * ws[i], 0) % 11; return r < 2 ? 0 : 11 - r }
  const d1 = digit(body, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
  const d2 = digit([...body, d1], [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
  const s = [...body, d1, d2].join('')
  return `${s.slice(0, 2)}.${s.slice(2, 5)}.${s.slice(5, 8)}/${s.slice(8, 12)}-${s.slice(12)}`
}
const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)]
const make = () => ({ name: `${pick(TREES)} ${pick(TRADES)} Ltda`, tax: cnpj() })

// one example per page, shared by everything that shows it; replaced on request
let current: { name: string; tax: string } | null = null
const listeners = new Set<() => void>()
const store = {
  subscribe: (l: () => void) => { listeners.add(l); return () => listeners.delete(l) },
  get: () => (current ??= make()),
  next: () => { current = make(); listeners.forEach((l) => l()) },
}

export function FreshExample() {
  const ex = useSyncExternalStore(store.subscribe, store.get, () => null)
  if (!ex) return <span>Request a new customer with a fresh name and CNPJ (made when the page loads).</span>
  return (
    <span className="fresh">
      Request <code>{ex.name}</code> with CNPJ <code>{ex.tax}</code>: no match, so the form opens. Add a type, a bill-to (any São Paulo address with a CEP) and a reason, submit, open its ticket, approve as finance, and watch the ERP number arrive.
      <span className="fresh-actions"><CopyButton text={ex.name} label="Copy name" /><CopyButton text={ex.tax} label="Copy CNPJ" /><button type="button" className="text-button" onClick={store.next}>Another one</button></span>
    </span>
  )
}
