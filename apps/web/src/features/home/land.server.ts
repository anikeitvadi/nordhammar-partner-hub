import 'server-only'
import { geoContains } from 'd3-geo'
import { feature } from 'topojson-client'
import type { Topology, GeometryCollection } from 'topojson-specification'
import land110 from 'world-atlas/land-110m.json'

// The globe's land, as a dot matrix: an even grid over the sphere (longitude step widened by 1/cos(latitude) so dots
// stay evenly spaced toward the poles), kept where it falls on land. Computed once per server instance from Natural
// Earth's 110m land via world-atlas, and sent as numbers, so the browser never loads the map itself.
let cached: [number, number][] | null = null

export function landDots(step = 2.4): [number, number][] {
  if (cached) return cached
  const topo = land110 as unknown as Topology<{ land: GeometryCollection }>
  const land = feature(topo, topo.objects.land)
  const out: [number, number][] = []
  for (let lat = -58; lat <= 82; lat += step) {
    const lonStep = step / Math.max(Math.cos((lat * Math.PI) / 180), 0.2)
    for (let lon = -180; lon < 180; lon += lonStep) if (geoContains(land, [lon, lat])) out.push([Math.round(lon * 10) / 10, Math.round(lat * 10) / 10])
  }
  cached = out
  return out
}
