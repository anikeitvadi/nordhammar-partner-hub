import Link from 'next/link'

// The one answer for anyone outside the central team, on the Exceptions list and on a review page.
export function NotYours() {
  return <section className="narrow"><h1>Exceptions</h1><p>Exceptions are decided by the central master-data team. Your own requests are under <Link href="/requests">Requests</Link>.</p></section>
}
