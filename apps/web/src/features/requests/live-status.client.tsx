'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Domain, RequestState } from '@intake/contracts'
import { StatusBadge, businessEvent, describeEvent, describeState, isLive, type TimelineEvent } from './status'
import { LocalTime } from '@/features/ui/time.client'
import { RollingNumber } from '@/features/ui/rolling-number.client'

type Snapshot = { state: RequestState; revision: number; updatedAt: string; events: TimelineEvent[] }

// The answer first: the status, one sentence (for a created request, the number), then the timeline as the business
// sees it. ERP mechanics (the send, a clean first attempt) stay in "How this ran" below; a retry, a replay or a refusal
// is part of the story and stays here. Polls the request's own state route every 2 seconds while the state can still
// change, then stops. When the state kind changes, the server-rendered parts (How this ran, the stop reason) refresh. Nothing here is trusted: it is
// the same scoped read the page did, repeated. Only the status sentence is a live region; the timeline is not, so a
// screen reader hears one sentence per change, not the whole list every 2 s.
export function LiveStatus({ requestId, domain, erp, initial }: { requestId: string; domain: Domain; erp: string; initial: Snapshot }) {
  const router = useRouter()
  const [snap, setSnap] = useState<Snapshot>(initial)
  const [failures, setFailures] = useState(0)
  const live = isLive(snap.state)
  // what was already on the page when it loaded never animates; only what arrives while watching does
  // counted on the rows the list shows (queued emails are not rows), so a row that arrives later is the first 'new' one
  const [initialEvents] = useState(initial.events.filter(businessEvent).length)
  const [landed] = useState(initial.state.kind === 'created')
  const creating = snap.state.kind === 'approved' || snap.state.kind === 'creating'

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

  const done = snap.state.kind === 'created' ? snap.state : null
  return (
    <>
      <p className="status-line"><span key={snap.state.kind} className="arrive-fast"><StatusBadge state={snap.state} /></span>{snap.revision > 1 ? <span className="muted"> · version {snap.revision}</span> : null}{live ? <span className="muted small"> · {failures >= 3 ? 'Lost connection, retrying…' : 'Updates automatically'}</span> : null}</p>
      {done ? (
        <div className="answer">
          <p className="answer-line">{erp} number <RollingNumber value={done.erpNumber} roll={!landed} />.</p>
          <p className="muted">{done.goldenId ? <Link href={`${domain === 'customer' ? '/customers' : '/suppliers'}?id=${done.goldenId}`}>Open its hub record, {done.goldenId}</Link> : 'It appears in search after the next hub load, usually overnight. Until then this page is the record.'}</p>
        </div>
      ) : (
        <p aria-live="polite" role="status" className="status-sentence answer-line">{creating ? <span className="arc" aria-hidden="true" /> : null}<span key={snap.state.kind} className="arrive-fast">{describeState(snap.state, domain)}</span></p>
      )}
      <h2>Timeline</h2>
      <ol className="timeline">
        {snap.events.filter(businessEvent).map((e, i) => <li key={i} className={i >= initialEvents ? 'new' : undefined}><LocalTime iso={e.at} /><span>{describeEvent(e)}</span></li>)}
      </ol>
    </>
  )
}
