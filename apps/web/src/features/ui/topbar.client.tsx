'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import type { Region } from '@intake/contracts'

// The content header: where you are, the search (⌘K focuses it from anywhere), and the one primary action for the
// section. The hub pages keep their own search with the region; this one is the shortcut into it.
const CRUMBS: [RegExp, string][] = [[/^\/$/, 'Home'], [/^\/customers/, 'Customers'], [/^\/suppliers/, 'Suppliers'], [/^\/requests/, 'Requests'], [/^\/ask/, 'Ask the hub'], [/^\/reviews/, 'Exceptions'], [/^\/intake/, 'New request'], [/^\/how-it-works/, 'How it works']]

export function TopBar({ region }: { region: Region }) {
  const path = usePathname()
  const input = useRef<HTMLInputElement>(null)
  const section = CRUMBS.find(([re]) => re.test(path))?.[1] ?? 'Partner Hub'
  const tail = path.match(/^\/(requests|reviews)\/(R-[A-Z0-9]+)/)?.[2]
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); input.current?.focus(); input.current?.select() } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  // One "New request" with both kinds; on the Suppliers page the supplier comes first (review log §7).
  const kinds = [{ domain: 'customer', label: 'Customer' }, { domain: 'supplier', label: 'Supplier' }]
  const menu = path.startsWith('/intake') || path.startsWith('/how-it-works') ? null : path.startsWith('/suppliers') ? [...kinds].reverse() : kinds
  return (
    <header className="topbar">
      <p className="crumb"><strong>{section}</strong>{tail ? <> <span className="muted">/</span> <code>{tail}</code></> : null}</p>
      <form method="get" action={path.startsWith('/suppliers') ? '/suppliers' : '/customers'} role="search" className="topbar-search">
        <input type="hidden" name="region" value={region} />
        <Search size={15} strokeWidth={1.75} aria-hidden="true" className="topbar-search-icon" />
        <input ref={input} name="q" placeholder="Search partners" aria-label="Search partners" />
        <kbd className="kbd" aria-hidden="true">⌘K</kbd>
      </form>
      {menu ? (
        <details className="new-menu">
          <summary className="button small">New request</summary>
          <div className="menu" role="menu">{menu.map((k) => <Link key={k.domain} role="menuitem" href={`/intake/new?domain=${k.domain}&region=${region}`}>{k.label}</Link>)}</div>
        </details>
      ) : null}
    </header>
  )
}
