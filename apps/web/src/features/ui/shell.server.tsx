import Link from 'next/link'
import { headers } from 'next/headers'
import { getPrincipal } from '@/features/auth/principal.server'
import { isCentral, workRegions } from '@/features/auth/scope'
import { signOut } from '@/features/auth/actions'
import { ShellNav, type NavItem } from './shell-nav.client'
import { TopBar } from './topbar.client'

// Signed in: a rail with the sections and the person, a content column with its header. Signed out: a bar with
// the brand and the page (the door, how it works). The principal is read fresh per request; the rest is static.
export async function Shell({ children }: { children: React.ReactNode }) {
  // The brief is a document for the customer, not a screen of the hub: no rail, no bar, signed in or not.
  if (((await headers()).get('x-hub-path') ?? '').startsWith('/brief')) return <>{children}</>
  const principal = await getPrincipal()
  const version = process.env.APP_VERSION_LABEL ? <em className="version">{process.env.APP_VERSION_LABEL}</em> : null
  if (!principal) {
    return (
      <>
        <header className="shell-header"><Link href="/" className="shell-brand"><b>Nordhammar</b><span>Partner Hub</span>{version}</Link></header>
        <main className="shell-main">{children}</main>
      </>
    )
  }
  const regions = workRegions(principal)
  const region = regions[0] ?? 'BR'
  const items: NavItem[] = [
    { href: '/', label: 'Home', icon: 'home' }, { href: '/customers', label: 'Customers', icon: 'customers' }, { href: '/suppliers', label: 'Suppliers', icon: 'suppliers' }, { href: '/requests', label: 'Requests', icon: 'requests' }, { href: '/ask', label: 'Ask', icon: 'ask' },
    // The central team's one page: exceptions and stopped creates (Operations and Reports are gone, review log §11, §12).
    ...(isCentral(principal) ? [{ href: '/reviews', label: 'Exceptions', icon: 'reviews' } as NavItem] : []),
  ]
  return (
    <div className="app">
      <aside className="rail">
        <Link href="/" className="shell-brand"><b>Nordhammar</b><span>Partner Hub</span>{version}</Link>
        <ShellNav items={items} />
        <div className="rail-foot">
          <ShellNav items={[{ href: '/how-it-works', label: 'How it works', icon: 'how' }]} />
          <div className="rail-who">
            <span className="rail-name">{principal.displayName}</span>
            <span className="rail-role">{isCentral(principal) ? 'Central team' : 'Regional user'} · {isCentral(principal) ? 'all regions' : regions.join(', ') || 'no region yet'}</span>
            <form action={signOut} className="inline"><button type="submit" className="link small">Sign Out</button></form>
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
