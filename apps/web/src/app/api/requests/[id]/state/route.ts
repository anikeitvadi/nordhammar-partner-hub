import { NextResponse } from 'next/server'
import { getPrincipal } from '@/features/auth/principal.server'
import { getRequest } from '@/features/requests/store.server'

// The status page's 2-second poll. Same principal, same scoped reader as the page itself: a requester gets their own
// request, a global reviewer any, anyone else a 404 that does not say whether the id exists. Never cached.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const principal = await getPrincipal()
  if (!principal) return NextResponse.json({ error: 'unauthenticated' }, { status: 401, headers: { 'cache-control': 'no-store' } })
  const { id } = await params
  const r = await getRequest(principal, id)
  if (!r) return NextResponse.json({ error: 'not found' }, { status: 404, headers: { 'cache-control': 'no-store' } })
  return NextResponse.json({ state: r.state, revision: r.revision, updatedAt: r.updatedAt, events: r.events }, { headers: { 'cache-control': 'no-store' } })
}
