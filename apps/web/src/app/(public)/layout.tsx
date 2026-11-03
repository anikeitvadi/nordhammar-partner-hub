import Link from 'next/link'

// The public pages (the sign-in door, How it works): a static bar and the page, with nothing about the visitor, so
// the whole page is in the first HTML. Only the sign-in form's error line reads the URL, inside its own Suspense.
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const version = process.env.APP_VERSION_LABEL ? <em className="version">{process.env.APP_VERSION_LABEL}</em> : null
  return (
    <>
      <header className="shell-header"><Link href="/" className="shell-brand"><b>Nordhammar</b><span>Partner Hub</span>{version}</Link></header>
      <main className="shell-main">{children}</main>
    </>
  )
}
