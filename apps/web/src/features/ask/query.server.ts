import 'server-only'
import { sql } from '@/lib/db'
import { visibleRegions, type Principal } from '@/features/auth/scope'
import { cycle } from '@/features/home/outcomes'
import { chartKind, describeSpec, isMoney, recordsLink, timeStart, validateSpec, type QueryResult, type QueryRow, type QuerySpec } from './query'

// Runs a validated query spec (docs/QUERY-SPEC-CONTRACT.md §2). The SQL is assembled only from the fixed fragments below;
// the one string that came from the model, a group name, is a bound parameter. Regions are always the intersection of
// what the spec asks and what the person may see; amounts, of what they ask and their money regions.


// No grouping means no GROUP BY at all: one row (or one per currency, for an amount).
const groupBy = (cols: string[]) => (cols.length ? `group by ${cols.join(', ')}` : '')

// Column for each group-by, per subject. Only these strings ever join the SQL text.
const GROUP_COL: Record<string, Partial<Record<string, string>>> = {
  partners: { region: 'p.region', erp: "coalesce(p.erp_system, 'no ERP yet')", status: 'p.status', type: "coalesce(p.type_code, 'not set')", domain: 'p.domain', ultimate_parent: 'coalesce(up.legal_name, p.legal_name)', currency: 'm.currency' },
  requests: { region: 'r.region', state: 'r.state_kind', domain: 'r.domain', source: "case when sub.via = 'service desk' then 'service desk' else 'hub form' end", approval: "case when r.state->'approval'->>'reviewerId' like 'auto:%' then 'automatic' when r.state->'approval'->>'reviewerId' is not null then 'central team' else 'not approved yet' end", month: "to_char(sub.at, 'YYYY-MM')" },
  checks: { region: 'h.region', route: 'h.route', month: "to_char(h.at, 'YYYY-MM')" },
}

export async function runQuery(principal: Principal, spec: QuerySpec, now = new Date()): Promise<QueryResult> {
  const v = validateSpec(spec)
  if (!v.ok) return v
  const visible = visibleRegions(principal)
  const regions = spec.filters.region?.length ? spec.filters.region.filter((r) => visible.includes(r)) : visible
  const moneyRegions = isMoney(spec.measure) ? principal.moneyRegions.filter((r) => regions.includes(r)) : []
  const base = { spec, link: recordsLink(spec) }
  if (isMoney(spec.measure) && moneyRegions.length === 0) return { ok: true, ...base, words: describeSpec(spec, { regions, moneyRegions }), kind: 'number', unit: '', rows: [], note: 'You are not entitled to amounts in any of these regions; amounts are granted per person and region.' }
  if (regions.length === 0) return { ok: true, ...base, words: describeSpec(spec, { regions }), kind: 'number', unit: '', rows: [], note: 'None of the regions asked for are regions you can see.' }

  const params: unknown[] = []
  const p = (v: unknown) => { params.push(v); return `$${params.length}` }
  const where: string[] = []
  const from = timeStart(spec.time, now)
  const f = spec.filters
  let text: string
  let groups: string[] | undefined

  if (spec.subject === 'partners') {
    let join = 'from parties p left join parties up on up.golden_id = p.ultimate_parent_golden_id left join groups g on g.group_id = p.group_id'
    where.push(`p.region = any(${p(regions)})`)
    if (f.domain) where.push(`p.domain = ${p(f.domain)}`)
    if (spec.measure === 'credit_limit') where.push(`p.domain = 'customer'`)
    if (spec.measure === 'spend_ytd') where.push(`p.domain = 'supplier'`)
    if (f.status) where.push(`p.status = ${p(f.status)}`)
    if (f.erp) where.push(`p.erp_system = ${p(f.erp)}`)
    if (f.type) where.push(`p.type_code = ${p(f.type)}`)
    if (f.risk) where.push(`p.risk_rating = ${p(f.risk)}`)
    if (f.group) {
      const like = p(`%${f.group.trim()}%`)
      where.push(`(g.name ilike ${like} or up.legal_name ilike ${like})`)
      const matched = await sql().query(`select distinct coalesce(g.name, up.legal_name) as name from parties p left join parties up on up.golden_id = p.ultimate_parent_golden_id left join groups g on g.group_id = p.group_id where p.region = any($1) and (g.name ilike $2 or up.legal_name ilike $2) order by 1 limit 5`, [regions, `%${f.group.trim()}%`])
      groups = matched.map((r) => r.name as string).filter(Boolean)
    }
    if (from) where.push(`p.inception_at >= ${p(from.toISOString().slice(0, 10))}`)
    let value = 'count(*)'
    if (isMoney(spec.measure)) {
      const table = spec.measure === 'credit_limit' ? 'regional_credit' : 'regional_spend'
      join += ` join ${table} m on m.golden_id = p.golden_id and m.region = any(${p(moneyRegions)})`
      value = spec.measure === 'credit_limit' ? 'sum(m.credit_limit)' : 'sum(m.spend_ytd)'
    }
    // Amounts are never added across currencies: for an amount, the currency is always part of the grouping.
    const money = isMoney(spec.measure)
    const key = spec.groupBy ? GROUP_COL.partners[spec.groupBy]! : `'all'`
    const groupCols = [spec.groupBy ? key : null, money && spec.groupBy !== 'currency' ? 'm.currency' : null].filter(Boolean) as string[]
    text = `select ${key} as label, ${money ? 'm.currency' : 'null::text'} as currency, ${value} as value ${join} where ${where.join(' and ')} ${groupBy(groupCols)} order by value desc limit ${p(spec.limit)}`
  } else if (spec.subject === 'requests') {
    // "Submitted" is the first submitted event; the row's own timestamp is the draft's.
    const join = `from requests r join lateral (select min(e.at) as at, max(e.detail->>'via') as via from request_events e where e.request_id = r.request_id and e.kind = 'submitted') sub on true`
    where.push(`r.region = any(${p(regions)})`, 'sub.at is not null')
    if (f.domain) where.push(`r.domain = ${p(f.domain)}`)
    if (f.state?.length) where.push(`r.state_kind = any(${p(f.state)})`)
    if (f.source) where.push(f.source === 'desk' ? `sub.via = 'service desk'` : `sub.via is distinct from 'service desk'`)
    if (f.approval) where.push(f.approval === 'automatic' ? `r.state->'approval'->>'reviewerId' like 'auto:%'` : `r.state->'approval'->>'reviewerId' not like 'auto:%'`)
    if (from) where.push(`sub.at >= ${p(from.toISOString())}`)
    const key = spec.groupBy ? GROUP_COL.requests[spec.groupBy]! : `'all'`
    if (spec.measure === 'median_hours_to_number') {
      // Per row, then the median in weekday hours by the same rule Home uses (features/home/outcomes.ts).
      const rows = await sql().query(`select ${key} as label, sub.at as submitted_at, r.state->>'createdAt' as created_at ${join} where ${[...where, `r.state_kind = 'created'`].join(' and ')}`, params)
      const byLabel = new Map<string, { submittedAt: string; createdAt: string }[]>()
      for (const r of rows) { const k = String(r.label); byLabel.set(k, [...(byLabel.get(k) ?? []), { submittedAt: new Date(r.submitted_at as string).toISOString(), createdAt: new Date(r.created_at as string).toISOString() }]) }
      const out: QueryRow[] = [...byLabel].map(([label, list]) => ({ label, value: cycle(list).medianHours ?? 0 }))
      out.sort((a, b) => (spec.groupBy === 'month' ? a.label.localeCompare(b.label) : b.value - a.value))
      return finish(out.slice(0, spec.limit), 'hours')
    }
    text = `select ${key} as label, null::text as currency, count(*) as value ${join} where ${where.join(' and ')} ${groupBy(spec.groupBy ? [key] : [])} order by ${spec.groupBy === 'month' ? 'label asc' : 'value desc'} limit ${p(spec.limit)}`
  } else {
    where.push(`h.region = any(${p(regions)})`)
    if (f.route) where.push(`h.route = ${p(f.route)}`)
    if (from) where.push(`h.at >= ${p(from.toISOString())}`)
    const key = spec.groupBy ? GROUP_COL.checks[spec.groupBy]! : `'all'`
    // A stop is counted once per person, domain and tax ID, as on Home: pressing the check twice is one stop.
    const value = spec.measure === 'stopped_at_entry' ? `count(distinct (h.requester_email, h.domain, h.tax_canonical)) filter (where h.route in ('exact_visible','exact_foreign'))` : 'count(*)'
    text = `select ${key} as label, null::text as currency, ${value} as value from hub_checks h where ${where.join(' and ')} ${groupBy(spec.groupBy ? [key] : [])} order by ${spec.groupBy === 'month' ? 'label asc' : 'value desc'} limit ${p(spec.limit)}`
  }

  const rows = await sql().query(text, params)
  const out: QueryRow[] = rows.map((r) => ({ label: String(r.label), value: Number(r.value), ...(r.currency ? { currency: r.currency as string } : {}) }))
  return finish(out, isMoney(spec.measure) ? 'amount' : spec.measure === 'median_hours_to_number' ? 'hours' : spec.subject)

  function finish(out: QueryRow[], unit: string): QueryResult {
    return { ok: true, ...base, words: describeSpec(spec, { regions, moneyRegions, groups }), kind: chartKind(spec, out.length), unit, rows: out, note: out.length === 0 ? 'Nothing matches.' : null }
  }
}

