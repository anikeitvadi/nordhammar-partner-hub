import Link from 'next/link'
import { hoursLabel } from '@/features/home/outcomes'
import type { QueryResult, QueryRow } from './query'

// The answer to a typed query, drawn from its shape (docs/QUERY-SPEC-CONTRACT.md §3): one number, a line of months,
// horizontal bars, or a table. Plain HTML and CSS in the app's tokens. Amounts keep their currency; they are never added
// across currencies, and bars are scaled per currency. Under it, the query in words (written by code) and the records.
const LABELS: Record<string, string> = { exact_visible: 'exact match here', exact_foreign: 'exact match elsewhere', related: 'same company', compare: 'name match', clear: 'clear', awaiting_finance: 'with finance', under_review: 'in review', hold: 'on hold' }
const label = (s: string) => LABELS[s] ?? s.replace(/_/g, ' ')

function fmt(r: QueryRow, unit: string): string {
  if (r.currency) return new Intl.NumberFormat('en', { style: 'currency', currency: r.currency, maximumFractionDigits: 0 }).format(r.value)
  if (unit === 'hours') return hoursLabel(r.value)
  return Math.round(r.value).toLocaleString('en-US')
}

export function QueryAnswer({ result }: { result: QueryResult }) {
  if (!result.ok) return <p className="panel">{result.refusal}</p>
  const { rows, unit, kind } = result
  const max = (r: QueryRow) => Math.max(...rows.filter((x) => x.currency === r.currency).map((x) => x.value), 0)
  return (
    <div className="panel query-answer">
      {rows.length === 0 ? <strong>{result.note ?? 'Nothing matches.'}</strong>
        : kind === 'number' ? <div className="query-number">{rows.map((r, i) => <div key={i} className="stat">{fmt(r, unit)}</div>)}{unit !== 'amount' && unit !== 'hours' ? <span className="stat-label">{unit}</span> : null}</div>
        : kind === 'line' ? <MonthLine rows={rows} unit={unit} />
        : kind === 'bars' ? (
          <ul className="query-bars">{rows.map((r, i) => (
            <li key={i}><span className="q-label">{label(r.label)}{r.currency && rows.some((x) => x.currency !== r.currency) ? <span className="muted"> · {r.currency}</span> : null}</span>
              <span className="q-bar" aria-hidden="true"><span style={{ width: `${max(r) ? Math.max(2, (r.value / max(r)) * 100) : 0}%` }} /></span>
              <span className="q-value">{fmt(r, unit)}</span></li>
          ))}</ul>
        ) : (
          <table className="results"><tbody>{rows.map((r, i) => <tr key={i}><td>{label(r.label)}</td><td className="num">{fmt(r, unit)}</td></tr>)}</tbody></table>
        )}
      {rows.length && result.note ? <p className="muted small">{result.note}</p> : null}
      <p className="muted small query-words">{result.words}{result.link ? <> <Link href={result.link}>See them →</Link></> : null}</p>
    </div>
  )
}

// A few months as a line with a dot and value per month; months are already in order.
function MonthLine({ rows, unit }: { rows: QueryRow[]; unit: string }) {
  const w = 300, h = 90, pad = 18
  const top = Math.max(...rows.map((r) => r.value), 1)
  const x = (i: number) => (rows.length === 1 ? w / 2 : pad + (i * (w - 2 * pad)) / (rows.length - 1))
  const y = (v: number) => h - pad - (v / top) * (h - 2 * pad)
  return (
    <svg className="query-line" viewBox={`0 0 ${w} ${h + 14}`} role="img" aria-label={rows.map((r) => `${r.label}: ${fmt(r, unit)}`).join(', ')}>
      <polyline points={rows.map((r, i) => `${x(i)},${y(r.value)}`).join(' ')} />
      {rows.map((r, i) => <g key={r.label}><circle cx={x(i)} cy={y(r.value)} r={3} /><text x={x(i)} y={y(r.value) - 7} textAnchor="middle">{fmt(r, unit)}</text><text x={x(i)} y={h + 10} textAnchor="middle" className="axis">{r.label}</text></g>)}
    </svg>
  )
}
