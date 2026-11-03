import type { Region } from '@intake/contracts'

// Pure. The shapes Home's globe draws, shared by the server that reads them and the client that draws them.
// Comments on what each holds are in globe.server.ts.
// `mine`: in a region the person works in. The globe draws the rest lighter, so a regional user sees their own partners
// first and the rest of the company behind them.
export type GlobePoint = { id: string; name: string; city: string; region: Region; erp: string | null; erpNumber: string | null; group: string | null; at: [number, number]; mine: boolean }
export type GlobeEvent = { kind: 'created' | 'stopped'; name: string; city: string; at: [number, number] }
export type GlobeArc = { group: string; from: [number, number]; to: [number, number]; fromCity: string; toCity: string; mine: boolean }
export type GlobeData = { land: [number, number][]; points: GlobePoint[]; arcs: GlobeArc[]; events: GlobeEvent[] }
// The central team sees the hub and this month across every region; a regional user sees their region and their own
// requests, because "5 regions on 3 ERPs" means nothing to someone who works in one of them.
export type HomeFigures =
  | { kind: 'central'; partners: number; regions: number; erps: number; crossBorderGroups: number; requestsIn: number; numbersOut: number; stopped: number }
  | { kind: 'regional'; where: string; partners: number; onHold: number; groupsAbroad: number; mineIn: number; mineWaiting: number; mineCreated: number }

