import type { Region } from '@intake/contracts'

// Pure. The shapes Home's globe draws, shared by the server that reads them and the client that draws them.
// Comments on what each holds are in globe.server.ts.
export type GlobePoint = { id: string; name: string; city: string; region: Region; erp: string | null; erpNumber: string | null; group: string | null; at: [number, number] }
export type GlobeEvent = { kind: 'created' | 'stopped'; name: string; city: string; at: [number, number] }
export type GlobeArc = { group: string; from: [number, number]; to: [number, number]; fromCity: string; toCity: string }
export type GlobeData = { land: [number, number][]; points: GlobePoint[]; arcs: GlobeArc[]; events: GlobeEvent[] }
export type HomeFigures = { partners: number; regions: number; erps: number; crossBorderGroups: number; requestsIn: number; numbersOut: number; stopped: number }

