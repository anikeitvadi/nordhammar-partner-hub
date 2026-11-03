import { z } from 'zod'
import { ERPS, REGIONS, type Region } from '@intake/contracts'
import { CUSTOMER_TYPES, SUPPLIER_TYPES } from '@/features/requests/payload'

// Pure. The typed query spec Ask's model fills instead of writing SQL (docs/QUERY-SPEC-CONTRACT.md). Every part is from a
// closed list except a group name, which code matches. This module decides what is allowed, says the query in words and
// picks the chart; query.server.ts runs it. Tested without a database or a model.

export const SUBJECTS = ['partners', 'requests', 'checks'] as const
export const MEASURES = ['count', 'credit_limit', 'spend_ytd', 'median_hours_to_number', 'stopped_at_entry'] as const
export const TIMES = ['this_month', 'last_30_days', 'last_90_days', 'this_year', 'all_time'] as const
export const GROUP_BYS = ['region', 'erp', 'status', 'type', 'domain', 'ultimate_parent', 'currency', 'state', 'source', 'approval', 'month', 'route'] as const
export const STATES = ['draft', 'awaiting_finance', 'checking', 'exception', 'submitted', 'under_review', 'approved', 'creating', 'created', 'declined', 'stopped'] as const
export const ROUTES = ['exact_visible', 'exact_foreign', 'related', 'compare', 'clear'] as const
const TYPE_CODES = [...CUSTOMER_TYPES, ...SUPPLIER_TYPES].map(([v]) => v) as [string, ...string[]]

export const QuerySpecSchema = z.object({
  subject: z.enum(SUBJECTS).describe('partners = the golden records (customers and suppliers); requests = requests for new partners; checks = the duplicate checks run when a request is typed'),
  measure: z.enum(MEASURES).describe('count; credit_limit (customers, an amount); spend_ytd (suppliers, an amount); median_hours_to_number (requests, from submitted to ERP number); stopped_at_entry (checks that stopped a duplicate)'),
  filters: z.object({
    region: z.array(z.enum(REGIONS)).optional(),
    domain: z.enum(['customer', 'supplier']).optional(),
    status: z.enum(['active', 'hold', 'inactive']).optional().describe('partners only; hold = on hold'),
    erp: z.enum(ERPS).optional().describe('partners only'),
    type: z.enum(TYPE_CODES).optional().describe('partners only: customer type or supplier category'),
    risk: z.enum(['A', 'B', 'C', 'D']).optional().describe('partners only: finance risk grade'),
    state: z.array(z.enum(STATES)).optional().describe('requests only'),
    source: z.enum(['hub', 'desk']).optional().describe('requests only: raised in the hub form or in the service desk'),
    approval: z.enum(['automatic', 'central_team']).optional().describe('requests only: approved by the checks or by the central team'),
    route: z.enum(ROUTES).optional().describe('checks only'),
    group: z.string().min(2).max(60).optional().describe('partners only: part of a corporate group or ultimate parent name, as the person wrote it'),
  }).default({}),
  time: z.enum(TIMES).default('all_time').describe('partners by when they joined, requests by when they were submitted, checks by when they ran'),
  groupBy: z.enum(GROUP_BYS).optional().describe('at most one dimension'),
  limit: z.number().int().min(1).max(20).default(10),
})
export type QuerySpec = z.infer<typeof QuerySpecSchema>
export type Subject = (typeof SUBJECTS)[number]
type FilterKey = keyof QuerySpec['filters']

// What makes sense, per subject. Anything else is refused with the sentence, never approximated.
const ALLOWED: Record<Subject, { measures: readonly string[]; filters: readonly FilterKey[]; groupBy: readonly string[]; refusal: string }> = {
  partners: { measures: ['count', 'credit_limit', 'spend_ytd'], filters: ['region', 'domain', 'status', 'erp', 'type', 'risk', 'group'], groupBy: ['region', 'erp', 'status', 'type', 'domain', 'ultimate_parent', 'currency'], refusal: 'I can count partners, or sum credit limits (customers) and spend (suppliers), by region, ERP, status, type, domain or ultimate parent.' },
  requests: { measures: ['count', 'median_hours_to_number'], filters: ['region', 'domain', 'state', 'source', 'approval'], groupBy: ['region', 'state', 'domain', 'source', 'approval', 'month'], refusal: 'I can count requests, or give the median hours from submitted to ERP number, by region, state, domain, source, approval or month.' },
  checks: { measures: ['count', 'stopped_at_entry'], filters: ['region', 'route'], groupBy: ['region', 'route', 'month'], refusal: 'I can count duplicate checks, or the ones that stopped a duplicate, by region, route or month.' },
}

export const isMoney = (m: QuerySpec['measure']) => m === 'credit_limit' || m === 'spend_ytd'

export function validateSpec(spec: QuerySpec): { ok: true } | { ok: false; refusal: string } {
  const a = ALLOWED[spec.subject]
  const set = (Object.keys(spec.filters) as FilterKey[]).filter((k) => spec.filters[k] !== undefined && !(Array.isArray(spec.filters[k]) && (spec.filters[k] as unknown[]).length === 0))
  const bad = !a.measures.includes(spec.measure) || set.some((k) => !a.filters.includes(k)) || (spec.groupBy !== undefined && !a.groupBy.includes(spec.groupBy))
    || (spec.measure === 'credit_limit' && spec.filters.domain === 'supplier') || (spec.measure === 'spend_ytd' && spec.filters.domain === 'customer')
    || (spec.groupBy === 'currency' && !isMoney(spec.measure)) || (spec.groupBy === 'domain' && isMoney(spec.measure))
  return bad ? { ok: false, refusal: a.refusal } : { ok: true }
}

const TIME_WORDS: Record<QuerySpec['time'], string> = { this_month: 'this month', last_30_days: 'in the last 30 days', last_90_days: 'in the last 90 days', this_year: 'this year', all_time: 'all time' }
const MEASURE_WORDS: Record<QuerySpec['measure'], string> = { count: 'Count of', credit_limit: 'Credit limits of', spend_ytd: 'Spend this year with', median_hours_to_number: 'Median hours from submitted to ERP number for', stopped_at_entry: 'Duplicates stopped at entry' }
const SUBJECT_WORDS: Record<Subject, string> = { partners: 'partners', requests: 'requests', checks: 'duplicate checks' }
const GROUP_WORDS: Record<string, string> = { ultimate_parent: 'ultimate parent', erp: 'ERP' }

// The query in words, written by code from the spec and the scope that applied, shown under every answer: if the model
// misread the question, this line says what was actually counted.
export function describeSpec(spec: QuerySpec, scope: { regions: Region[]; moneyRegions?: Region[]; groups?: string[] }): string {
  const f = spec.filters
  const parts = [spec.measure === 'stopped_at_entry' ? MEASURE_WORDS.stopped_at_entry : `${MEASURE_WORDS[spec.measure]} ${spec.measure === 'credit_limit' ? 'customers' : spec.measure === 'spend_ytd' ? 'suppliers' : SUBJECT_WORDS[spec.subject]}`]
  if (f.domain && !isMoney(spec.measure)) parts.push(`${f.domain}s only`)
  if (f.status) parts.push(f.status === 'hold' ? 'on hold' : f.status)
  if (f.erp) parts.push(`in ${f.erp}`)
  if (f.type) parts.push(`type ${f.type.replace(/_/g, ' ')}`)
  if (f.risk) parts.push(`risk ${f.risk}`)
  if (f.state?.length) parts.push(`in state ${f.state.join(' or ').replace(/_/g, ' ')}`)
  if (f.source) parts.push(f.source === 'desk' ? 'raised in the service desk' : 'raised in the hub form')
  if (f.approval) parts.push(f.approval === 'automatic' ? 'approved automatically' : 'approved by the central team')
  if (f.route) parts.push(`route ${f.route.replace(/_/g, ' ')}`)
  if (f.group) parts.push(scope.groups?.length ? `in ${scope.groups.join(', ')}` : `in groups matching "${f.group}" (none found)`)
  if (spec.groupBy) parts.push(`by ${GROUP_WORDS[spec.groupBy] ?? spec.groupBy}`)
  // For partners the window is when they joined, and "all time" goes without saying; spend is this year's by definition.
  if (spec.subject !== 'partners') parts.push(TIME_WORDS[spec.time])
  else if (spec.time !== 'all_time') parts.push(`that joined ${TIME_WORDS[spec.time]}`)
  const where = isMoney(spec.measure)
    ? (scope.moneyRegions?.length ? `amounts in ${scope.moneyRegions.join(', ')} (your amount regions)` : 'in none of your amount regions')
    : (scope.regions.length ? `in ${scope.regions.join(', ')} (your regions)` : 'in none of your regions')
  return `${parts.join(', ')}, ${where}.`
}

export type ChartKind = 'number' | 'line' | 'bars' | 'table'

// What the query tool returns, and what the answer card draws. Rows carry their currency when the measure is an amount.
export type QueryRow = { label: string; value: number; currency?: string }
export type QueryResult =
  | { ok: true; words: string; kind: ChartKind; unit: string; rows: QueryRow[]; link: string | null; note: string | null; spec: QuerySpec }
  | { ok: false; refusal: string }
// The shape decides the picture, in code: no grouping is one number; months are a line; up to 8 groups are bars.
export function chartKind(spec: QuerySpec, rows: number): ChartKind {
  if (!spec.groupBy) return 'number'
  if (spec.groupBy === 'month') return 'line'
  return rows <= 8 ? 'bars' : 'table'
}

// Where the records behind a partner count live, when a page can show exactly them.
export function recordsLink(spec: QuerySpec): string | null {
  // Customers and suppliers are two pages, so a count over both has no one page to link to.
  if (spec.subject !== 'partners' || spec.measure !== 'count' || !spec.filters.domain || spec.groupBy || spec.filters.group || spec.filters.type || spec.filters.risk || spec.filters.status === 'inactive') return null
  const q = new URLSearchParams()
  // `in`, not `region`: the top bar's search already sends `region` (its home region) with every search.
  if (spec.filters.region?.length === 1) q.set('in', spec.filters.region[0])
  if (spec.filters.status === 'hold') q.set('status', 'hold')
  if (spec.filters.erp) q.set('erp', spec.filters.erp)
  return `/${spec.filters.domain === 'supplier' ? 'suppliers' : 'customers'}${q.size ? `?${q}` : ''}`
}

// The window each time value covers, as a SQL interval start; null is all time.
export function timeStart(t: QuerySpec['time'], now: Date): Date | null {
  const d = new Date(now)
  switch (t) {
    case 'this_month': return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))
    case 'last_30_days': return new Date(d.getTime() - 30 * 86_400_000)
    case 'last_90_days': return new Date(d.getTime() - 90 * 86_400_000)
    case 'this_year': return new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    case 'all_time': return null
  }
}
