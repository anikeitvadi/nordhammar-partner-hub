// Builds src/features/home/land-dots.json: the globe's land as an even dot grid, from Natural Earth 50m land
// (world-atlas). Run once when the grid or the source changes: node scripts/land-dots.mjs. The longitude step widens
// by 1/cos(latitude) so dots stay evenly spaced on the sphere.
import { readFileSync, writeFileSync } from 'node:fs'
import { geoContains } from 'd3-geo'
import { feature } from 'topojson-client'
const topo = JSON.parse(readFileSync(new URL('../node_modules/world-atlas/land-50m.json', import.meta.url)))
const land = feature(topo, topo.objects.land)
const STEP = 1.45
const out = []
for (let lat = -56; lat <= 80; lat += STEP) {
  const lonStep = STEP / Math.max(Math.cos((lat * Math.PI) / 180), 0.18)
  for (let lon = -180; lon < 180; lon += lonStep) if (geoContains(land, [lon, lat])) out.push([Math.round(lon * 100) / 100, Math.round(lat * 100) / 100])
}
writeFileSync(new URL('../src/features/home/land-dots.json', import.meta.url), JSON.stringify(out))
console.log(`${out.length} land dots, step ${STEP}°`)
