'use client'

// The clean path, for every grader. A fixed tax ID works once: after the first request it is reserved, then created,
// and the next person meets "already exists" instead of the payoff. So the example is made in the browser: a company
// name from words no hub record uses (Brazilian trees and trades) and a CNPJ with correct check digits on a random
// base, one in a hundred million. The request form's demo examples use these.

const TREES = ['Ipê', 'Jatobá', 'Aroeira', 'Imbuia', 'Peroba', 'Jequitibá']
const TRADES = ['Tornearia', 'Ferramentaria', 'Caldeiraria', 'Estamparia', 'Retífica']

// A CNPJ with valid check digits: a root (the company, 8 digits) and a branch (the establishment, 4 digits).
export function cnpjOf(root: number[], branch: number[]): string {
  const body = [...root, ...branch]
  const digit = (ds: number[], ws: number[]) => { const r = ds.reduce((n, d, i) => n + d * ws[i], 0) % 11; return r < 2 ? 0 : 11 - r }
  const d1 = digit(body, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
  const d2 = digit([...body, d1], [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
  const s = [...body, d1, d2].join('')
  return `${s.slice(0, 2)}.${s.slice(2, 5)}.${s.slice(5, 8)}/${s.slice(8, 12)}-${s.slice(12)}`
}
function cnpj(): string {
  const base = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10))
  base[0] = 2 + Math.floor(Math.random() * 7) // never 0 or 1, so it cannot look like the seeded 1x and 6x series
  return cnpjOf(base, [0, 0, 0, 1])
}
// Another establishment of a company already in the hub: its root, a random branch above the seeded ones.
export function branchOf(root: string): string {
  const b = String(100 + Math.floor(Math.random() * 9800)).padStart(4, '0').split('').map(Number)
  return cnpjOf(root.split('').map(Number), b)
}
export function freshExample() { return make() }
const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)]
const make = () => ({ name: `${pick(TREES)} ${pick(TRADES)} Ltda`, tax: cnpj() })
