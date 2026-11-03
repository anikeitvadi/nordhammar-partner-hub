import 'server-only'
import dots from './land-dots.json'

// The globe's land as a dot matrix, precomputed by scripts/land-dots.mjs from Natural Earth 50m land (about a minute of
// point-in-polygon work, so it never runs on a request). 5,158 points, evenly spaced on the sphere.
export function landDots(): [number, number][] {
  return dots as [number, number][]
}
