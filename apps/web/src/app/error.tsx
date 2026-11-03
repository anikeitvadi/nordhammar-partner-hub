'use client'
import Link from 'next/link'

// The boundary for anything unexpected. Nothing in flight is lost: requests, decisions and ERP writes are committed
// server-side before the page that showed them could fail. The digest is the handle for the logs.
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="narrow">
      <h1>Something went wrong</h1>
      <p>The page could not be shown. Anything you had already submitted or approved is safe; this only affects the screen.</p>
      <div className="row">
        <button type="button" onClick={() => reset()}>Try Again</button>
        <Link href="/customers" className="muted">Back to search</Link>
      </div>
      {error.digest ? <p className="muted small">Reference <code>{error.digest}</code></p> : null}
    </section>
  )
}
