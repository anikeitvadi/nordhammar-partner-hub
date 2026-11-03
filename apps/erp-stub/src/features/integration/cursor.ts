// The golden-record feed's position: the last (updated_at, golden_id) the caller has seen, opaque to the caller.
// Ordering by both columns makes it stable when many records share a timestamp.
export type Cursor = { at: string; id: string }
export function encodeCursor(c: Cursor): string { return Buffer.from(`${c.at}|${c.id}`).toString('base64url') }
export function decodeCursor(s: string | null): Cursor | null {
  if (!s) return null
  const raw = Buffer.from(s, 'base64url').toString('utf8'); const i = raw.indexOf('|')
  if (i < 1 || Number.isNaN(Date.parse(raw.slice(0, i)))) return null
  return { at: raw.slice(0, i), id: raw.slice(i + 1) }
}
// One page: rows strictly after the cursor, in cursor order. `next` is where the following call starts; it is null
// only when this page is empty, so a caller stores `next` after every non-empty page and stops on an empty one.
export function page<T extends { updatedAt: string; goldenId: string }>(rows: T[], after: Cursor | null, limit: number): { records: T[]; next: string | null } {
  const sorted = [...rows].sort((a, b) => (a.updatedAt === b.updatedAt ? a.goldenId.localeCompare(b.goldenId) : a.updatedAt.localeCompare(b.updatedAt)))
  const out = sorted.filter((r) => !after || r.updatedAt > after.at || (r.updatedAt === after.at && r.goldenId > after.id)).slice(0, limit)
  const last = out.at(-1)
  return { records: out, next: last ? encodeCursor({ at: last.updatedAt, id: last.goldenId }) : null }
}
