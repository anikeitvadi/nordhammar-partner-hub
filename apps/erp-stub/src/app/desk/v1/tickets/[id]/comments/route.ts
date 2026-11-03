import { NextResponse } from 'next/server'
import { z } from 'zod'
import { callerFromRequest } from '@/features/auth/caller'
import { addComment } from '@/features/desk/store'

// POST /desk/v1/tickets/:id/comments: the hub writes the outcome back to the ticket. The key makes a retried write
// land once ("created:R-…:1" can only be posted one time).
const Body = z.object({ body: z.string().min(1).max(2000), key: z.string().min(1) })
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await callerFromRequest(req))) return NextResponse.json({ reason: 'unauthorized' }, { status: 401 })
  const b = Body.safeParse(await req.json().catch(() => null))
  if (!b.success) return NextResponse.json({ reason: 'malformed' }, { status: 400 })
  const { id } = await params
  try {
    const added = await addComment(id, 'Nordhammar Partner Hub', b.data.body, b.data.key)
    return NextResponse.json({ added }, { status: added ? 201 : 200 })
  } catch {
    return NextResponse.json({ reason: 'no such ticket' }, { status: 404 })
  }
}
