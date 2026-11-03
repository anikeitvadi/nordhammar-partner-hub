import Link from 'next/link'

// A missing record or a wrong URL. Not visible reads as not found on purpose (a record in a region you cannot see
// must not be distinguishable from one that does not exist), so the copy says both.
export default function NotFound() {
  return (
    <section className="narrow">
      <h1>Not found</h1>
      <p>There is nothing at this address, or it is in a region your account cannot see.</p>
      <p><Link href="/customers" className="button">Back to Search</Link></p>
    </section>
  )
}
