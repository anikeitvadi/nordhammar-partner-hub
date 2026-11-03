'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, ClipboardCheck, FileText, Home, MessageSquareText, Truck, Users } from 'lucide-react'

// The rail's sections. One icon set, one size, one stroke; aria-current is the one source of truth for the highlight.
const ICONS = { home: Home, customers: Users, suppliers: Truck, requests: FileText, ask: MessageSquareText, reviews: ClipboardCheck, how: BookOpen } as const
export type NavItem = { href: string; label: string; icon: keyof typeof ICONS }

export function ShellNav({ items }: { items: NavItem[] }) {
  const path = usePathname()
  return (
    <nav className="rail-nav" aria-label="Sections">
      {items.map((i) => { const Icon = ICONS[i.icon]; const current = i.href === '/' ? path === '/' : path === i.href || path.startsWith(`${i.href}/`); return <Link key={i.href} href={i.href} aria-current={current ? 'page' : undefined}><Icon size={16} strokeWidth={1.75} aria-hidden="true" />{i.label}</Link> })}
    </nav>
  )
}
