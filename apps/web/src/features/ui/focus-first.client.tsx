'use client'
import { useEffect } from 'react'

// autoFocus only takes on the first parse; a field that streams in behind a Suspense boundary arrives after it. This
// focuses the field once it is there, unless the person has already put focus somewhere else.
export function FocusFirst({ id }: { id: string }) {
  useEffect(() => {
    if (document.activeElement === document.body || document.activeElement === null) document.getElementById(id)?.focus()
  }, [id])
  return null
}
