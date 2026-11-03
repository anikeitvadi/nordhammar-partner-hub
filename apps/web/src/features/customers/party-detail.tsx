import Link from 'next/link'
import { typeLabel } from '@/features/requests/payload'
import { LocalTime } from '@/features/ui/time.client'
import type { PartyDetail as Party } from './hub.server'

const KIND: Record<string, string> = { bill_to: 'Bill-to', ship_to: 'Ship-to', remit_to: 'Remit-to' }
const fmt = (n: number, c: string) => new Intl.NumberFormat('en', { style: 'currency', currency: c, maximumFractionDigits: 0 }).format(n)

// WF-03: one golden record. What the ERPs hold, where each piece came from, and how the company sits in its group.
// The two actions the spec names (request a change, set parent) are not built; they are labelled as coming, not drawn as buttons.
export function PartyDetail({ party: p, compact = false }: { party: Party; compact?: boolean }) {
  const path = p.domain === 'customer' ? '/customers' : '/suppliers'
  return (
    <article className={compact ? 'party compact' : 'party'}>
      <header className="party-head">
        <div>
          {compact ? <h2 className="party-name">{p.legalName}</h2> : <h1>{p.legalName}</h1>}
          {p.localName ? <p className="party-local">{p.localName}</p> : null}
          <p className="party-sub"><span><code>{p.goldenId}</code> · {p.region} · {p.country}{p.typeCode ? ` · ${typeLabel(p.typeCode)}` : ''}</span><span className={`badge ${p.status === 'active' ? 'badge-active' : 'badge-hold'}`}>{p.status === 'hold' ? 'On hold' : p.status}</span></p>
        </div>
        {!compact ? <Link href={`${path}?${new URLSearchParams({ q: p.legalName, id: p.goldenId }).toString()}`} className="muted">Back to search</Link> : null}
      </header>

      <h2>Identifiers</h2>
      <dl className="facts">
        <dt>{p.taxScheme ?? 'Tax ID'}</dt><dd>{p.taxCanonical ?? <span className="muted">missing in source</span>}</dd>
        {p.identifiers.map((i) => <Row key={i.scheme} k={i.scheme} v={i.value} />)}
        <dt>DUNS</dt><dd>{p.duns ? <>{p.duns}{p.dunsRating ? <span className="muted"> · rating {p.dunsRating}</span> : null}</> : <span className="muted">not provided</span>}</dd>
        <dt>{p.erpSystem ?? 'ERP'} number</dt><dd>{p.erpNumber ? <><strong>{p.erpNumber}</strong>{p.erpSegment ? <span className="muted"> · segment {p.erpSegment}</span> : null}{p.userRef ? <span className="muted"> · ref {p.userRef}</span> : null}</> : <span className="muted">pending the ERP</span>}</dd>
        {p.aliases.length ? <Row k="Also known as" v={p.aliases.join(', ')} /> : null}
      </dl>

      <h2>Group</h2>
      <dl className="facts">
        <dt>Group</dt><dd>{p.group ? p.group.name : <span className="muted">none</span>}</dd>
        <dt>Parent</dt><dd>{p.parent ? <Link href={`${path}?id=${p.parent.goldenId}`}>{p.parent.legalName}</Link> : <span className="muted">none (top of its group)</span>}</dd>
        <dt>Ultimate parent</dt><dd>{p.ultimateParent ? <Link href={`${path}?id=${p.ultimateParent.goldenId}`}>{p.ultimateParent.legalName}</Link> : <span className="muted">itself</span>}</dd>
        {p.group?.members.length ? <><dt>Companies in group</dt><dd>{p.group.members.map((m) => <span key={m.goldenId} className="member">{m.legalName} <span className="muted">{m.region}{m.domain !== p.domain ? ` · ${m.domain}` : ''}</span></span>)}</dd></> : null}
      </dl>

      <h2>Addresses</h2>
      <ul className="addr-list">
        {p.addresses.map((a, i) => (
          <li key={i}><span className="addr-kind">{KIND[a.kind]}{a.isDefault ? <span className="muted"> (default)</span> : null}</span> {[a.street, a.number].filter(Boolean).join(' ')}{a.complement ? `, ${a.complement}` : ''}{a.district ? `, ${a.district}` : ''}, {a.city}{a.regionCode ? ` ${a.regionCode}` : ''}{a.postalCode ? ` ${a.postalCode}` : ''} · {a.country}</li>
        ))}
      </ul>

      <h2>Commercial</h2>
      <dl className="facts">
        {p.industry ? <><dt>Industry</dt><dd>{p.industry}</dd></> : null}
        <dt>Payment terms</dt><dd>{p.paymentTerms ?? <span className="muted">not set</span>}{p.currency ? <span className="muted"> · {p.currency}</span> : null}</dd>
        <dt>Risk rating</dt><dd>{p.riskRating ?? <span className="muted">not rated</span>}</dd>
        <dt>Since</dt><dd>{p.inceptionAt ?? <span className="muted">unknown</span>}{p.lastActivityAt ? <span className="muted"> · last activity {p.lastActivityAt}</span> : null}</dd>
        <dt>{p.domain === 'customer' ? `Credit (${p.region})` : `Spend (${p.region})`}</dt>
        <dd>{p.money === 'not_entitled' ? <span className="muted">not shown for your role</span> : p.money === null ? <span className="muted">none on file</span> : p.money.kind === 'credit' ? `${fmt(p.money.limit, p.money.currency)} limit · terms ${p.money.terms}` : `${fmt(p.money.ytd, p.money.currency)} year to date · ${fmt(p.money.openInvoices, p.money.currency)} open`}</dd>
      </dl>

      <h2>Sources</h2>
      <p className="muted small">Which system each piece came from, and when the hub last loaded it.</p>
      <ul className="source-list">
        {p.sources.map((s) => <li key={s.system}><code>{s.system}</code> {s.sourceId} <span className="muted">· loaded <LocalTime iso={s.loadedAt} mode="datetime" /></span></li>)}
      </ul>

      <p className="coming"><strong>Coming next, not in this release:</strong> request a change to this record, and set its parent (stewards). <Link href="/roadmap#change">What they will do</Link>.</p>
    </article>
  )
}

function Row({ k, v }: { k: string; v: string }) { return <><dt>{k}</dt><dd>{v}</dd></> }
