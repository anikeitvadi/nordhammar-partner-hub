// The instant loading state for any route segment: the same frame the page will fill, so nothing jumps.
export default function Loading() {
  return (
    <section aria-busy="true" aria-label="Loading">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-block" />
    </section>
  )
}
