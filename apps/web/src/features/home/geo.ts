// Pure. Where the demo's partners are on the planet, for Home's globe. A fixed table for the cities the seed and this
// month's requests use (no geocoding service at runtime); anything else falls back to its country's centre.
// Coordinates are [longitude, latitude], the order d3-geo expects.
const CITY: Record<string, [number, number]> = {
  'BR|Belo Horizonte': [-43.94, -19.92], 'BR|Betim': [-44.2, -19.97], 'BR|Campinas': [-47.06, -22.91], 'BR|Cubatão': [-46.43, -23.9],
  'BR|Curitiba': [-49.27, -25.43], 'BR|Duque de Caxias': [-43.31, -22.79], 'BR|Itajaí': [-48.66, -26.91], 'BR|Itaúna': [-44.58, -20.08],
  'BR|Joinville': [-48.85, -26.3], 'BR|Manaus': [-60.02, -3.12], 'BR|Porto Alegre': [-51.23, -30.03], 'BR|Rio Claro': [-47.56, -22.41],
  'BR|Rio de Janeiro': [-43.17, -22.91], 'BR|Salvador': [-38.5, -12.97], 'BR|Santos': [-46.33, -23.96], 'BR|São Paulo': [-46.63, -23.55],
  'BR|Londrina': [-51.16, -23.31], 'BR|Maringá': [-51.94, -23.42], 'BR|Cascavel': [-53.46, -24.96], 'BR|Ponta Grossa': [-50.16, -25.09],
  'BR|Sorocaba': [-47.46, -23.5], 'BR|Recife': [-34.88, -8.05], 'BR|Fortaleza': [-38.52, -3.73],
  'CN|Ningbo': [121.55, 29.87], 'CN|Shenzhen': [114.06, 22.54], 'CN|Suzhou': [120.62, 31.3], 'CN|Shanghai': [121.47, 31.23],
  'DE|Bremen': [8.8, 53.08], 'DE|Duisburg': [6.76, 51.43], 'DE|Hamburg': [9.99, 53.55], 'ES|Bilbao': [-2.93, 43.26], 'FI|Tampere': [23.76, 61.5],
  'FR|Lyon': [4.84, 45.76], 'IT|Milano': [9.19, 45.46], 'NL|Eindhoven': [5.47, 51.44], 'NL|Rotterdam': [4.48, 51.92], 'NO|Bergen': [5.32, 60.39],
  'PT|Lisboa': [-9.14, 38.72], 'SE|Göteborg': [11.97, 57.71], 'SE|Karlstad': [13.5, 59.38],
  'IN|Khed': [73.39, 17.72], 'IN|Kochi': [76.27, 9.93], 'IN|Ludhiana': [75.86, 30.9], 'IN|Mumbai': [72.88, 19.08], 'IN|Pune': [73.86, 18.52],
  'US|Cleveland': [-81.69, 41.5], 'US|Houston': [-95.37, 29.76], 'US|Madison': [-89.4, 43.07], 'US|Omaha': [-95.94, 41.26], 'US|Sioux Falls': [-96.73, 43.54],
}
const COUNTRY: Record<string, [number, number]> = {
  BR: [-47.9, -15.8], CN: [116.4, 34], DE: [10.4, 51.1], ES: [-3.7, 40.4], FI: [25, 62], FR: [2.4, 46.6], IT: [12.5, 42.8], NL: [5.3, 52.1],
  NO: [8.5, 61], PT: [-8.2, 39.6], SE: [15, 60], IN: [78.9, 21], US: [-96, 39.5], AT: [14.5, 47.5], BE: [4.5, 50.5], DK: [9.5, 56], PL: [19.1, 52], IE: [-8, 53.4],
}

export function where(country: string, city: string | null | undefined): { lonLat: [number, number]; exact: boolean } {
  const c = city ? CITY[`${country}|${city}`] : undefined
  if (c) return { lonLat: c, exact: true }
  // Seeded "Cidade Exemplo" and unknown towns: the country's centre, with a small deterministic offset so several do
  // not stack on one pixel.
  const base = COUNTRY[country] ?? [0, 0]
  let h = 0
  for (const ch of `${country}${city ?? ''}`) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return { lonLat: [base[0] + ((h % 100) / 100 - 0.5) * 3, base[1] + (((h >> 8) % 100) / 100 - 0.5) * 3], exact: false }
}
