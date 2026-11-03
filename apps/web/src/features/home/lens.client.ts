'use client'
import { useSyncExternalStore } from 'react'

// What Home's figures point the globe at. A figure sets it on hover or keyboard focus and clears it on leave; the
// globe reads it every frame. One value per page, shared through a tiny store, no context needed.
export type Lens = 'partners' | 'groups' | 'abroad' | 'hold' | 'created' | 'stopped'
let current: Lens | null = null
const listeners = new Set<() => void>()
export const lens = {
  get: () => current,
  set: (l: Lens | null) => { if (l === current) return; current = l; listeners.forEach((f) => f()) },
  subscribe: (f: () => void) => { listeners.add(f); return () => listeners.delete(f) },
}
export const useLens = () => useSyncExternalStore(lens.subscribe, lens.get, () => null)
