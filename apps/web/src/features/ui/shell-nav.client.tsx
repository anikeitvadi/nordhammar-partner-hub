'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// The nav marks the section you are in. aria-current is the one source of truth for the highlight.
export function ShellNav({ items }: { items: { href: string; label: string }[] }) {
  const path = usePathname()
  return (
    <nav className="shell-nav">
      {items.map((i) => <Link key={i.href} href={i.href} aria-current={path === i.href || path.startsWith(`${i.href}/`) ? 'page' : undefined}>{i.label}</Link>)}
    </nav>
  )
}
