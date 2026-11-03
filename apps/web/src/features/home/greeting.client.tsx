'use client'
import { useSyncExternalStore } from 'react'

// "Good morning, Priya." in the viewer's own time of day, with today's date under it. The server does not know the
// viewer's zone (it runs in UTC), so its snapshot is a plain hello and the browser's replaces it before anyone reads it.
const noop = () => () => {}

export function Greeting({ name, scope }: { name: string; scope: string }) {
  const text = useSyncExternalStore(noop, () => {
    const now = new Date(), h = now.getHours()
    const hello = h < 5 ? 'Good evening' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
    return `${hello}|${new Intl.DateTimeFormat(undefined, { weekday: 'long', day: 'numeric', month: 'long' }).format(now)}`
  }, () => 'Hello|')
  const [hello, date] = text.split('|')
  return (
    <>
      <h1 className="display">{hello}, {name}.</h1>
      <p className="kicker">{date ? `${date} · ` : ''}{scope}</p>
    </>
  )
}
