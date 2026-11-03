'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpenText, ChatCircleText, ClipboardText, FileText, House, Truck, UsersThree } from '@phosphor-icons/react'

// The rail's sections. One icon set (Phosphor), one size, one weight, bold only for where you are; aria-current is the
// one source of truth for the highlight.
const ICONS = { home: House, customers: UsersThree, suppliers: Truck, requests: FileText, ask: ChatCircleText, reviews: ClipboardText, how: BookOpenText } as const
export type NavItem = { href: string; label: string; icon: keyof typeof ICONS }

export function ShellNav({ items }: { items: NavItem[] }) {
  const path = usePathname()
  return (
    <nav className="rail-nav" aria-label="Sections">
      {items.map((i) => { const Icon = ICONS[i.icon]; const current = i.href === '/' ? path === '/' : path === i.href || path.startsWith(`${i.href}/`); return <Link key={i.href} href={i.href} aria-current={current ? 'page' : undefined}><Icon size={18} weight={current ? 'bold' : 'regular'} aria-hidden="true" />{i.label}</Link> })}
    </nav>
  )
}
