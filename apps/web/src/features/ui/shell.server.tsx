import Link from 'next/link'
import { getPrincipal } from '@/features/auth/principal.server'
import { visibleRegions } from '@/features/auth/scope'
import { signOut } from '@/features/auth/actions'
import { ShellNav, type NavItem } from './shell-nav.client'
import { TopBar } from './topbar.client'

// Signed in: a rail with the sections and the person, a content column with its header. Signed out: a bar with
// the brand and the page (the door, how it works). The principal is read fresh per request; the rest is static.
export async function Shell({ children }: { children: React.ReactNode }) {
  const principal = await getPrincipal()
  const version = process.env.APP_VERSION_LABEL ? <em className="version">{process.env.APP_VERSION_LABEL}</em> : null
  if (!principal) {
    return (
      <>
        <header className="shell-header"><Link href="/" className="shell-brand">Nordhammar <span>Partner Hub</span>{version}</Link></header>
        <main className="shell-main">{children}</main>
      </>
    )
  }
  const regions = visibleRegions(principal)
  const region = regions[0] ?? 'BR'
  const items: NavItem[] = [
    { href: '/', label: 'Home', icon: 'home' }, { href: '/customers', label: 'Customers', icon: 'customers' }, { href: '/suppliers', label: 'Suppliers', icon: 'suppliers' }, { href: '/requests', label: 'My requests', icon: 'requests' }, { href: '/ask', label: 'Ask the hub', icon: 'ask' },
    ...(principal.globalIdentity ? [{ href: '/reviews', label: 'Reviews', icon: 'reviews' } as NavItem, { href: '/operations', label: 'Operations', icon: 'operations' } as NavItem, { href: '/reports', label: 'Reports', icon: 'reports' } as NavItem] : []),
  ]
  return (
    <div className="app">
      <aside className="rail">
        <Link href="/" className="shell-brand rail-brand">Nordhammar <span>Partner Hub</span>{version}</Link>
        <ShellNav items={items} />
        <div className="rail-foot">
          <ShellNav items={[{ href: '/how-it-works', label: 'How it works', icon: 'how' }]} />
          <div className="rail-who">
            <span className="badge badge-region">{principal.globalIdentity ? 'All regions' : regions.join(', ') || 'No region'}</span>
            <span className="rail-name">{principal.displayName}<span className="muted"> · {principal.role}</span></span>
            <form action={signOut} className="inline"><button type="submit" className="link small">Sign out</button></form>
          </div>
        </div>
      </aside>
      <div className="content">
        <TopBar region={region} />
        <main className="shell-main">{children}</main>
      </div>
    </div>
  )
}
