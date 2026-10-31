'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { RequestState } from '@intake/contracts'
import { StatusBadge, describeEvent, describeState, isLive, type TimelineEvent } from './status'

type Snapshot = { state: RequestState; revision: number; updatedAt: string; events: TimelineEvent[] }

// Polls the request's own state route every 2 seconds while the state can still change, then stops. When the state
// kind changes, the server-rendered panels (number, stop reason) are refreshed too. Nothing here is trusted: it is
// the same scoped read the page did, repeated.
export function LiveStatus({ requestId, initial }: { requestId: string; initial: Snapshot }) {
  const router = useRouter()
  const [snap, setSnap] = useState<Snapshot>(initial)
  const [checkedAt, setCheckedAt] = useState<Date | null>(null)
  const live = isLive(snap.state)

  useEffect(() => {
    if (!live) return
    let stopped = false
    let timer: ReturnType<typeof setTimeout> | undefined
    const tick = async () => {
      if (stopped) return
      if (document.visibilityState === 'visible') {
        try {
          const res = await fetch(`/api/requests/${encodeURIComponent(requestId)}/state`, { cache: 'no-store' })
          if (res.ok) {
            const next = (await res.json()) as Snapshot
            setCheckedAt(new Date())
            setSnap((prev) => {
              if (prev.state.kind !== next.state.kind) router.refresh()
              return next
            })
          }
        } catch { /* next tick */ }
      }
      timer = setTimeout(tick, 2000)
    }
    timer = setTimeout(tick, 2000)
    return () => { stopped = true; if (timer) clearTimeout(timer) }
  }, [live, requestId, router])

  return (
    <>
      <p><StatusBadge state={snap.state} /> · revision {snap.revision}{live ? <span className="muted"> · live{checkedAt ? `, checked ${checkedAt.toLocaleTimeString()}` : ''}</span> : null}</p>
      <p>{describeState(snap.state)}</p>
      <h2>Timeline</h2>
      <ol className="timeline" aria-live="polite">
        {snap.events.map((e, i) => <li key={i}><time dateTime={e.at}>{new Date(e.at).toLocaleTimeString()}</time>{describeEvent(e)}{e.actor && e.actor !== 'workflow' ? <span className="muted"> · {e.actor}</span> : null}</li>)}
      </ol>
    </>
  )
}
