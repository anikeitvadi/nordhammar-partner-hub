import Link from 'next/link'

// An address that matches no page. It sits outside every route group, so it brings its own bar. Not visible reads as
// not found on purpose (a record in a region you cannot see must not be distinguishable from one that does not exist).
export default function NotFound() {
  return (
    <>
    <header className="shell-header"><Link href="/" className="shell-brand"><b>Nordhammar</b><span>Partner Hub</span></Link></header>
    <main className="shell-main"><section className="narrow">
      <h1>Not found</h1>
      <p>There is nothing at this address, or it is in a region your account cannot see.</p>
      <p><Link href="/customers" className="button">Back to Search</Link></p>
    </section></main>
    </>
  )
}
