'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'
import type { Region } from '@intake/contracts'

// The content bar: the search on the left (⌘K focuses it from anywhere) and the one primary action on the right. It
// never names the page; the page's own title does that, once. The hub pages keep their own search with the region;
// this one is the shortcut into it.

export function TopBar({ region }: { region: Region }) {
  const path = usePathname()
  const input = useRef<HTMLInputElement>(null)
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
      <form method="get" action={path.startsWith('/suppliers') ? '/suppliers' : '/customers'} role="search" className="topbar-search">
        <input type="hidden" name="region" value={region} />
        <MagnifyingGlass size={16} aria-hidden="true" className="topbar-search-icon" />
        <input ref={input} name="q" placeholder="Search partners" aria-label="Search partners" />
        <kbd className="kbd" aria-hidden="true">⌘K</kbd>
      </form>
      {menu ? (
        <details className="new-menu">
          <summary className="button">New Request</summary>
          <div className="menu" role="menu">{menu.map((k) => <Link key={k.domain} role="menuitem" href={`/intake/new?domain=${k.domain}&region=${region}`}>{k.label}</Link>)}</div>
        </details>
      ) : null}
    </header>
  )
}
