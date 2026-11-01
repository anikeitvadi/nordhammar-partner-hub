'use client'
import { useState } from 'react'

// Copies one line and confirms on itself, in a fixed-width slot so nothing beside it moves. Falls back to
// selecting nothing and saying "Copy" again if the clipboard is unavailable (an http page, a locked-down browser).
export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [done, setDone] = useState(false)
  return (
    <button type="button" className="copy" data-done={done} aria-live="polite"
      onClick={async () => { try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1600) } catch { setDone(false) } }}>
      {done ? 'Copied' : label}
    </button>
  )
}
