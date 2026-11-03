// Pure. Home's two pictures of this month (the intake flow and the time-to-number strip): which route each request
// took, and where every node, ribbon and dot goes. Tested without a database; the SVG components only draw this.

// One color meaning across both pictures: who decided. Blue is the checks (nobody touched it), orange is a person
// (finance rejecting, or the central team deciding), gray is not decided yet. Validated as a pair on the white surface.
export type Who = 'checks' | 'person' | 'pending'
export const WHO_LABEL: Record<Who, string> = { checks: 'Decided by the checks', person: 'Decided by a person', pending: 'Not decided yet' }

export type RouteFacts = { fromDesk: boolean; ticket: boolean; events: string[]; state: string }
export type Route = { steps: string[]; who: Who }

// The columns, in reading order, and the order of nodes inside each, top to bottom.
export const COLUMNS = [
  ['Hub form', 'Service desk'],
  ['Finance approved', 'With finance', 'Finance rejected', 'Central review'],
  ['Checks passed', 'Exception'],
  ['ERP number', 'Waiting', 'Declined', 'Stopped'],
] as const

export function routeOf(f: RouteFacts): Route {
  const has = (k: string) => f.events.includes(k)
  const steps: string[] = [f.fromDesk ? 'Service desk' : 'Hub form']
  // A request raised before the service desk existed has no ticket and goes straight to the central team.
  steps.push(!f.ticket && !f.fromDesk ? 'Central review' : has('finance_rejected') ? 'Finance rejected' : has('finance_approved') ? 'Finance approved' : 'With finance')
  if (has('checks_clean')) steps.push('Checks passed')
  else if (has('exception')) steps.push('Exception')
  steps.push(f.state === 'created' ? 'ERP number' : f.state === 'declined' ? 'Declined' : f.state === 'stopped' ? 'Stopped' : 'Waiting')
  const person = has('finance_rejected') || has('approve') || has('decline') || has('send_back')
  const who: Who = has('checks_clean') ? 'checks' : person ? 'person' : 'pending'
  return { steps, who }
}

export type FlowNode = { id: string; col: number; x: number; y: number; h: number; n: number }
export type FlowLink = { from: string; to: string; who: Who; n: number; path: string }
export type Flow = { nodes: FlowNode[]; links: FlowLink[]; width: number; height: number; total: number }

// Layout: four columns; each node is as tall as the requests through it; ribbons leave and arrive in a fixed order
// (by target, then by who) so they never cross inside a node. A ribbon is a filled band between two cubic curves.
export function layoutFlow(routes: Route[], opts: { width?: number; height?: number; nodeW?: number; gap?: number } = {}): Flow {
  const width = opts.width ?? 720, height = opts.height ?? 240, nodeW = opts.nodeW ?? 10, gap = opts.gap ?? 14
  const count = new Map<string, number>()
  const linkN = new Map<string, number>()
  for (const r of routes) {
    for (const s of r.steps) count.set(s, (count.get(s) ?? 0) + 1)
    for (let i = 0; i < r.steps.length - 1; i++) { const k = `${r.steps[i]}→${r.steps[i + 1]}→${r.who}`; linkN.set(k, (linkN.get(k) ?? 0) + 1) }
  }
  const total = routes.length
  const maxColN = Math.max(1, ...COLUMNS.map((col) => col.filter((id) => count.has(id)).length))
  const unit = total ? (height - gap * (maxColN - 1)) / total : 0
  const colX = (c: number) => (c * (width - nodeW)) / (COLUMNS.length - 1)
  const nodes: FlowNode[] = []
  COLUMNS.forEach((col, c) => {
    const present = col.filter((id) => count.has(id))
    const used = present.reduce((s, id) => s + count.get(id)! * unit, 0) + gap * (present.length - 1)
    let y = (height - used) / 2
    for (const id of present) { const n = count.get(id)!; nodes.push({ id, col: c, x: colX(c), y, h: n * unit, n }); y += n * unit + gap }
  })
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const order = (id: string) => { const nd = byId.get(id)!; return nd.col * 100 + (COLUMNS[nd.col] as readonly string[]).indexOf(id) }
  const whoOrder: Who[] = ['checks', 'person', 'pending']
  const raw = [...linkN].map(([k, n]) => { const [from, to, who] = k.split('→'); return { from, to, who: who as Who, n } })
  // Offsets inside each node, out side and in side, filled in a stable order.
  const outY = new Map(nodes.map((n) => [n.id, n.y]))
  const inY = new Map(nodes.map((n) => [n.id, n.y]))
  // Inside a node, ribbons are stacked by where their other end sits (its center height), so bands do not cross
  // needlessly; ties keep the who order, so the blue path stays together.
  const mid = (id: string) => { const nd = byId.get(id)!; return nd.y + nd.h / 2 }
  const outSorted = [...raw].sort((a, b) => order(a.from) - order(b.from) || mid(a.to) - mid(b.to) || whoOrder.indexOf(a.who) - whoOrder.indexOf(b.who))
  const geo = new Map<(typeof raw)[number], { y0: number; y1: number }>()
  for (const l of outSorted) { const y = outY.get(l.from)!; geo.set(l, { y0: y, y1: 0 }); outY.set(l.from, y + l.n * unit) }
  const inSorted = [...raw].sort((a, b) => order(a.to) - order(b.to) || mid(a.from) - mid(b.from) || whoOrder.indexOf(a.who) - whoOrder.indexOf(b.who))
  for (const l of inSorted) { const y = inY.get(l.to)!; geo.get(l)!.y1 = y; inY.set(l.to, y + l.n * unit) }
  const links: FlowLink[] = raw.map((l) => {
    const a = byId.get(l.from)!, b = byId.get(l.to)!, g = geo.get(l)!, t = l.n * unit
    const x0 = a.x + nodeW, x1 = b.x, mx = (x0 + x1) / 2
    const path = `M${x0},${g.y0} C${mx},${g.y0} ${mx},${g.y1} ${x1},${g.y1} L${x1},${g.y1 + t} C${mx},${g.y1 + t} ${mx},${g.y0 + t} ${x0},${g.y0 + t} Z`
    return { ...l, path }
  })
  return { nodes, links, width, height, total }
}

// The time strip: a log scale from one second to one working week, in weekday hours, with dots stacked where they
// would overlap so every request stays visible.
export const STRIP_MIN_H = 1 / 3600, STRIP_MAX_H = 120
export const stripX = (hours: number, width: number) => {
  const h = Math.min(Math.max(hours, STRIP_MIN_H), STRIP_MAX_H)
  return (Math.log10(h / STRIP_MIN_H) / Math.log10(STRIP_MAX_H / STRIP_MIN_H)) * width
}
export function stackDots<T extends { x: number }>(dots: T[], r: number): (T & { row: number })[] {
  const placed: (T & { row: number })[] = []
  for (const d of [...dots].sort((a, b) => a.x - b.x)) {
    let row = 0
    while (placed.some((p) => p.row === row && Math.abs(p.x - d.x) < r * 2 + 1)) row++
    placed.push({ ...d, row })
  }
  return placed
}
