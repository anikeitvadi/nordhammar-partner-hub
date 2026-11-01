'use client'
import { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Domain, RequestState } from '@intake/contracts'
import { StatusBadge, describeEvent, describeState, isLive, technicalEvent, type TimelineEvent } from './status'
import { LocalTime } from '@/features/ui/time.client'

type Snapshot = { state: RequestState; revision: number; updatedAt: string; events: TimelineEvent[] }

// Polls the request's own state route every 2 seconds while the state can still change, then stops. When the state
// kind changes, the server-rendered panels (number, stop reason) are refreshed too. Nothing here is trusted: it is
// the same scoped read the page did, repeated. Only the status sentence is a live region; the timeline is not, so a
// screen reader hears one sentence per change, not the whole list every 2 s.
export function LiveStatus({ requestId, domain, initial }: { requestId: string; domain: Domain; initial: Snapshot }) {
  const router = useRouter()
  const [snap, setSnap] = useState<Snapshot>(initial)
  const [failures, setFailures] = useState(0)
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
          if (!res.ok) throw new Error(String(res.status))
          const next = (await res.json()) as Snapshot
          setFailures(0)
          setSnap((prev) => { if (prev.state.kind !== next.state.kind) router.refresh(); return next })
        } catch { setFailures((n) => n + 1) }
      }
      timer = setTimeout(tick, 2000)
    }
    timer = setTimeout(tick, 2000)
    return () => { stopped = true; if (timer) clearTimeout(timer) }
  }, [live, requestId, router])

  const technical = snap.events.map((e) => ({ e, t: technicalEvent(e) })).filter((x) => x.t)
  const emails = snap.events.some((e) => e.kind === 'email_queued')
  return (
    <>
      <p><StatusBadge state={snap.state} />{snap.revision > 1 ? <span className="muted"> · version {snap.revision}</span> : null}{live ? <span className="muted small"> · {failures >= 3 ? 'Lost connection, retrying…' : 'Updates automatically'}</span> : null}</p>
      <p aria-live="polite" role="status">{describeState(snap.state, domain)}</p>
      <h2>Timeline</h2>
      <ol className="timeline">
        {snap.events.filter((e) => e.kind !== 'email_queued').map((e, i) => <li key={i}><LocalTime iso={e.at} />{describeEvent(e)}</li>)}
      </ol>
      {emails ? <p className="muted small">Emails to the requester and the approver team are queued at each step; sending is not part of this build.</p> : null}
      {technical.length ? (
        <details className="tech">
          <summary>Technical details</summary>
          <dl>{technical.map(({ e, t }, i) => <Fragment key={i}><dt>{e.kind.replace(/_/g, ' ')}</dt><dd>{t}</dd></Fragment>)}</dl>
        </details>
      ) : null}
    </>
  )
}
