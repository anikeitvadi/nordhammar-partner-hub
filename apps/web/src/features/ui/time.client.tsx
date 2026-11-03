'use client'
import { useSyncExternalStore } from 'react'

// Times render in the viewer's zone with the zone named, because the approver team is follow-the-sun and a bare
// "9:32 PM" is wrong for half of them. The server snapshot is a stable ISO form (no hydration mismatch); the client
// snapshot is the local form. Lists show a relative phrase, with the exact time on hover.
// Component options, not dateStyle/timeStyle: those cannot be combined with timeZoneName and throw at runtime.
const absolute = (d: Date, withDate: boolean) => new Intl.DateTimeFormat(undefined, { ...(withDate ? { year: 'numeric' as const, month: 'short' as const, day: 'numeric' as const } : {}), hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }).format(d)
function relative(d: Date, now: Date): string {
  const s = Math.round((now.getTime() - d.getTime()) / 1000)
  const a = Math.abs(s)
  if (a < 45) return 'just now'
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
  if (a < 3600) return rtf.format(-Math.round(s / 60), 'minute')
  if (a < 86400) return rtf.format(-Math.round(s / 3600), 'hour')
  if (a < 604800) return rtf.format(-Math.round(s / 86400), 'day')
  if (a < 2629800) return rtf.format(-Math.round(s / 604800), 'week')
  return rtf.format(-Math.round(s / 2629800), 'month')
}
const noop = () => () => {}

export function LocalTime({ iso, mode = 'auto', relative: rel = false }: { iso: string; mode?: 'auto' | 'time' | 'datetime'; relative?: boolean }) {
  const text = useSyncExternalStore(noop, () => {
    const d = new Date(iso); const now = new Date()
    const withDate = mode === 'datetime' || (mode === 'auto' && d.toDateString() !== now.toDateString())
    return rel ? `${relative(d, now)}\n${absolute(d, true)}` : absolute(d, withDate)
  }, () => iso.slice(0, 16).replace('T', ' ') + ' UTC')
  const [shown, exact] = text.split('\n')
  return <time dateTime={iso} title={exact ?? iso}>{shown}</time>
}
