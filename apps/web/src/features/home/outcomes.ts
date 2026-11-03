// Pure. The three outcomes on Home, measured against the targets in DECISIONS §1. Tested without a database.

// Hours between two instants, not counting Saturdays and Sundays (UTC). "Inside one business day" is at most 24 of
// these: a request submitted on Friday afternoon and created on Monday morning is inside it, as a person would say.
export function businessHoursBetween(fromIso: string, toIso: string): number {
  const from = Date.parse(fromIso), to = Date.parse(toIso)
  if (!(to > from)) return 0
  const HOUR = 3_600_000
  let ms = 0
  for (let t = from; t < to; ) {
    const d = new Date(t)
    const nextDay = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1)
    const end = Math.min(nextDay, to)
    const dow = d.getUTCDay()
    if (dow !== 0 && dow !== 6) ms += end - t
    t = end
  }
  return ms / HOUR
}

export type CycleRow = { submittedAt: string; createdAt: string }
// Unrounded: most creates take minutes, and rounding to a tenth of an hour would show them as zero. hoursLabel rounds.
export type Cycle = { created: number; insideOneDay: number; medianHours: number | null }

export function cycle(rows: CycleRow[]): Cycle {
  const hours = rows.map((r) => businessHoursBetween(r.submittedAt, r.createdAt)).sort((a, b) => a - b)
  const mid = hours.length / 2
  const median = hours.length === 0 ? null : hours.length % 2 ? hours[Math.floor(mid)] : (hours[mid - 1] + hours[mid]) / 2
  return { created: hours.length, insideOneDay: hours.filter((h) => h <= 24).length, medianHours: median }
}

// "1.4 h", "26 min", "12 s": a cycle time read at a glance.
export function hoursLabel(h: number | null): string {
  if (h == null) return 'n/a'
  if (h >= 1) return `${h.toFixed(1)} h`
  const min = h * 60
  return min >= 1 ? `${Math.round(min)} min` : `${Math.round(min * 60)} s`
}
