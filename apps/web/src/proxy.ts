import { NextResponse, type NextRequest } from 'next/server'

// Next 16 names this proxy.ts. Session refresh and the no-region gate arrive in Increment B.
export function proxy(_request: NextRequest) {
  return NextResponse.next()
}
