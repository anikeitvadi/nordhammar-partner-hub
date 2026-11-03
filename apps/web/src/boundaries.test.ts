import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

// A wall is a test that fails, not a comment that asks nicely.
// This builds the import graph of src/ and asserts three policies that path-pattern lint cannot:
// 1. no client module ("use client") transitively reaches the DB client, server-only, or any *.server.ts
// 2. erp.server createCustomer is reachable only from features/execution
// 3. packages/contracts imports nothing from the app
const SRC = path.resolve(__dirname)
const ROOT = path.resolve(__dirname, '..', '..', '..')

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(ts|tsx)$/.test(name) && !name.endsWith('.test.ts')) out.push(p)
  }
  return out
}

function importsOf(file: string): string[] {
  const text = readFileSync(file, 'utf8')
  const specs = [...text.matchAll(/(?:from|import)\s*['"]([^'"]+)['"]/g)].map((m) => m[1])
  return specs
}

function resolveLocal(from: string, spec: string): string | null {
  let base: string
  if (spec.startsWith('@/')) base = path.join(SRC, spec.slice(2))
  else if (spec.startsWith('.')) base = path.resolve(path.dirname(from), spec)
  else return null
  for (const ext of ['', '.ts', '.tsx', '/index.ts', '/index.tsx']) {
    const candidate = base + ext
    if (!/\.tsx?$/.test(candidate)) continue // JSON and other data files are not modules with imports of their own
    try { if (statSync(candidate).isFile()) return candidate } catch { /* keep looking */ }
  }
  return null
}

const files = walk(SRC)
const graph = new Map<string, { external: string[]; local: string[]; client: boolean; action: boolean }>()
for (const f of files) {
  const specs = importsOf(f)
  const local = specs.map((s) => resolveLocal(f, s)).filter((x): x is string => x !== null)
  const external = specs.filter((s) => !s.startsWith('.') && !s.startsWith('@/'))
  const text = readFileSync(f, 'utf8')
  const client = /^\s*['"]use client['"]/m.test(text)
  // A 'use server' file is a Server Action module: the compiler replaces it with a reference in client bundles,
  // so it is the one legal bridge from a client island to server code. Traversal stops at it.
  const action = /^\s*['"]use server['"]/m.test(text)
  graph.set(f, { external, local, client, action })
}

function reach(start: string, seen = new Set<string>()): Set<string> {
  for (const dep of graph.get(start)?.local ?? []) if (!seen.has(dep)) { seen.add(dep); if (!graph.get(dep)?.action) reach(dep, seen) }
  return seen
}

describe('import walls', () => {
  it('no client module reaches the DB client, server-only, or a *.server.ts module', () => {
    const offenders: string[] = []
    for (const [f, node] of graph) {
      if (!node.client) continue
      const reached = [f, ...reach(f)]
      for (const r of reached) {
        const n = graph.get(r)!
        if (n.action) continue
        const bad = n.external.some((e) => e === '@neondatabase/serverless' || e === 'server-only') || /\.server\.tsx?$/.test(r)
        if (bad) offenders.push(`${path.relative(SRC, f)} -> ${path.relative(SRC, r)}`)
      }
    }
    expect(offenders).toEqual([])
  })

  it('erp.server is reachable only from features/execution', () => {
    const erp = path.join(SRC, 'features', 'erp', 'erp.server.ts')
    const offenders: string[] = []
    for (const [f, node] of graph) {
      if (f === erp) continue
      if (node.local.includes(erp) && !f.includes(`${path.sep}features${path.sep}execution${path.sep}`)) offenders.push(path.relative(SRC, f))
    }
    expect(offenders).toEqual([])
  })

  it('packages/contracts imports nothing from the app', () => {
    const contracts = path.join(ROOT, 'packages', 'contracts', 'src')
    for (const f of walk(contracts)) {
      const bad = importsOf(f).filter((s) => s.startsWith('@/') || s.startsWith('../') || s.includes('apps/'))
      expect(bad, path.relative(ROOT, f)).toEqual([])
    }
  })
})
