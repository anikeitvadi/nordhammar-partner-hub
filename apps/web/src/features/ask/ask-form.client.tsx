'use client'
import { useActionState } from 'react'
import Link from 'next/link'
import { askAction, type AskState } from './actions'
import { SubmitButton } from '@/features/ui/submit-button.client'

// One box, three suggested questions, and the answer as a card (the lookup, which is the truth) with the model's
// sentence under it. The card is rendered from the tool result by type, never from the sentence.
const SUGGESTED = ['Do we already work with Aurora anywhere?', 'Where is request R-MVY4OEBEBJ7W right now?', 'Why was R-MVY3T3KCUS28 flagged?', 'How many partners are on hold in BR?', 'What is our credit exposure to the Aurora group?', 'How many requests were created this month?']

export function AskForm({ exampleId }: { exampleId?: string }) {
  const [state, action] = useActionState(askAction, { question: '', outcome: null } as AskState)
  // the two request-id questions use the person's own latest request; with none yet, they are left out
  const suggested = exampleId ? SUGGESTED.map((s) => s.replace(/R-[A-Z0-9]+/, exampleId)) : SUGGESTED.filter((s) => !/R-[A-Z0-9]+/.test(s))
  return (
    <div className="ask">
      <form action={action} className="ask-form">
        <input name="question" defaultValue={state.question} placeholder="Ask about a group, a request, or why something was flagged" aria-label="Your question" maxLength={300} required autoFocus />
        <SubmitButton pendingLabel="Looking…">Ask</SubmitButton>
      </form>
      <form action={action} className="chips" aria-label="Suggested questions">
        {suggested.map((q) => <button key={q} type="submit" name="question" value={q} className="chip">{q}</button>)}
      </form>
      {state.outcome ? <Answer state={state} /> : null}
    </div>
  )
}

function Answer({ state }: { state: AskState }) {
  const o = state.outcome!
  if (o.ai === 'unavailable') return <p className="panel">{o.reason === 'disabled' ? 'Asking is switched off here.' : 'The hub could not be asked right now.'} The <Link href="/customers">search</Link> and the request pages answer the same questions by hand.</p>
  return (
    <div className="ask-answer arrive">
      <p className="muted small" style={{ margin: '0 0 6px' }}>You asked: “{state.question}”</p>
      {o.tool === null ? <p className="panel">{o.answer ?? "I can't answer that here. Try the search box or the request page."}</p> : <Card tool={o.tool} result={o.result} />}
      {o.tool !== null && o.answer ? <p className="ask-sentence"><span className="ai-label">AI · a reading of the card</span>{o.answer}</p> : null}
      {o.note ? <p className="muted small">{o.note}</p> : null}
      <details className="tech"><summary>Technical details</summary><dl><dt>Tool</dt><dd>{o.tool ?? 'none'}</dd><dt>Input</dt><dd>{JSON.stringify(o.input)}</dd><dt>Model</dt><dd>{o.model}</dd><dt>Models tried</dt><dd>{o.attempts.length ? o.attempts.map((a) => `${a.model} ${a.ok ? 'answered' : 'did not answer'}`).join(' · ') : 'not reported'}</dd><dt>Time</dt><dd>{(o.ms / 1000).toFixed(1)} s</dd><dt>Cost</dt><dd>{o.cost == null ? 'n/a' : `$${o.cost.toFixed(6)}`}</dd><dt>Tokens</dt><dd>{o.usage ? `${o.usage.inputTokens} in · ${o.usage.outputTokens} out` : 'n/a'}</dd></dl></details>
    </div>
  )
}

type Presence = { query: string; matches: { legalName: string; region: string; domain: string; group: string | null; goldenId?: string; city?: string }[]; note: string }
type Status = { found: boolean; requestId: string; legalName?: string; domain?: string; region?: string; state?: string; where?: string; erpNumber?: string | null; note?: string }
type OnHold = { region: string; rows: { region: string; customers: number; suppliers: number; oldestActivity: string | null }[]; totalCustomers: number; totalSuppliers: number }
type Intake = { month: string; rows: { state: string; customers: number; suppliers: number; medianHours: number | null }[]; note: string }
type Exposure = { group: string; rows: { parent: string; companies: number; regions: string[]; limits: { currency: string; total: number }[] }[]; note: string }
type Why = { found: boolean; requestId: string; legalName?: string; outcome?: string; reason?: string | null; linkedTo?: { goldenId: string; legalName?: string; city?: string; region?: string } | null; explanation?: string; note?: string }

function Card({ tool, result }: { tool: string; result: unknown }) {
  if (tool === 'groupPresence') {
    const r = result as Presence
    return (
      <div className="panel">
        <strong>{r.matches.length === 0 ? `No partner matching “${r.query}” in any region.` : `${r.matches.length} partner${r.matches.length === 1 ? '' : 's'} matching “${r.query}”.`}</strong>
        {r.matches.length ? <ul className="rows" style={{ marginTop: 8 }}>{r.matches.map((m, i) => <li key={i} className="nolead"><span><span className="t">{m.goldenId ? <Link href={`/${m.domain}s?id=${m.goldenId}`}>{m.legalName}</Link> : m.legalName}</span><span className="s">{m.region} · {m.domain}{m.group ? ` · ${m.group}` : ''}{m.city ? ` · ${m.city}` : ''}</span></span></li>)}</ul> : null}
        <p className="muted small" style={{ margin: '8px 0 0' }}>{r.note}</p>
      </div>
    )
  }
  if (tool === 'requestStatus') {
    const r = result as Status
    if (!r.found) return <p className="panel">{r.note}</p>
    return <div className="panel"><strong><Link href={`/requests/${r.requestId}`}>{r.requestId}</Link> · {r.legalName}</strong><p style={{ margin: '6px 0 0' }}>{r.where}{r.erpNumber ? ` Number ${r.erpNumber}.` : ''}</p></div>
  }
  if (tool === 'partnersOnHold') {
    const r = result as OnHold
    return <div className="panel"><strong>{r.totalCustomers + r.totalSuppliers === 0 ? `No partners on hold in ${r.region}.` : `${r.totalCustomers} customer${r.totalCustomers === 1 ? '' : 's'} and ${r.totalSuppliers} supplier${r.totalSuppliers === 1 ? '' : 's'} on hold in ${r.region}.`}</strong>{r.rows.length ? <table className="results" style={{ marginTop: 10 }}><thead><tr><th>Region</th><th className="num">Customers</th><th className="num">Suppliers</th><th>Oldest activity</th></tr></thead><tbody>{r.rows.map((x) => <tr key={x.region}><td>{x.region}</td><td className="num">{x.customers}</td><td className="num">{x.suppliers}</td><td>{x.oldestActivity ?? '—'}</td></tr>)}</tbody></table> : null}</div>
  }
  if (tool === 'intakeThisMonth') {
    const r = result as Intake
    return <div className="panel"><strong>Requests this month ({r.month}).</strong>{r.rows.length ? <table className="results" style={{ marginTop: 10 }}><thead><tr><th>State</th><th className="num">Customers</th><th className="num">Suppliers</th><th className="num">Median hours to created</th></tr></thead><tbody>{r.rows.map((x) => <tr key={x.state}><td>{x.state.replace(/_/g, ' ')}</td><td className="num">{x.customers}</td><td className="num">{x.suppliers}</td><td className="num">{x.medianHours ?? '—'}</td></tr>)}</tbody></table> : <p style={{ margin: '6px 0 0' }}>None yet this month.</p>}<p className="muted small" style={{ margin: '8px 0 0' }}>{r.note}</p></div>
  }
  if (tool === 'exposureByGroup') {
    const r = result as Exposure
    const money = (c: string, n: number) => new Intl.NumberFormat('en', { style: 'currency', currency: c, maximumFractionDigits: 0 }).format(n)
    return <div className="panel"><strong>{r.rows.length === 0 ? `No exposure to show for ${r.group}.` : `Credit exposure, ${r.group === 'all' ? 'all groups' : `groups matching “${r.group}”`}.`}</strong>{r.rows.length ? <table className="results" style={{ marginTop: 10 }}><thead><tr><th>Ultimate parent</th><th className="num">Companies</th><th>Regions</th><th className="num">Credit limits</th></tr></thead><tbody>{r.rows.map((x) => <tr key={x.parent}><td>{x.parent}</td><td className="num">{x.companies}</td><td>{x.regions.join(', ')}</td><td className="num">{x.limits.map((l) => money(l.currency, l.total)).join(' · ')}</td></tr>)}</tbody></table> : null}<p className="muted small" style={{ margin: '8px 0 0' }}>{r.note}</p></div>
  }
  const r = result as Why
  if (!r.found) return <p className="panel">{r.note}</p>
  return <div className="panel"><strong><Link href={`/requests/${r.requestId}`}>{r.requestId}</Link> · {r.legalName}</strong><p style={{ margin: '6px 0 0' }}>{r.explanation}{r.linkedTo?.legalName ? <> Compared with <Link href={`/customers?id=${r.linkedTo.goldenId}`}>{r.linkedTo.legalName}</Link>{r.linkedTo.city ? `, ${r.linkedTo.city}` : ''}.</> : null}{r.reason ? <> The requester wrote: “{r.reason}”.</> : null}</p></div>
}
