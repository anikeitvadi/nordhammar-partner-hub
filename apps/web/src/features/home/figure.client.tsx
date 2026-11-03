'use client'
import Link from 'next/link'
import { lens, type Lens } from './lens.client'

// One of Home's figures: a row that opens the list behind it, and, when it has a lens, points the globe at what it
// counts while the pointer or the keyboard is on it.
export function Figure({ n, label, href, show }: { n: number; label: string; href?: string; show?: Lens }) {
  const body = <><span className="fig-n">{n}</span><span className="fig-label">{label}</span></>
  const on = show ? { onMouseEnter: () => lens.set(show), onMouseLeave: () => lens.set(null), onFocus: () => lens.set(show), onBlur: () => lens.set(null), 'data-lens': show } : {}
  return href ? <Link href={href} className="fig fig-link" {...on}>{body}<span className="fig-go" aria-hidden="true">→</span></Link> : <div className="fig" tabIndex={show ? 0 : undefined} {...on}>{body}</div>
}
