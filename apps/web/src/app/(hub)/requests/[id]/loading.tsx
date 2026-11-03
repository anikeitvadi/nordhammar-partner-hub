export default function Loading() {
  return (
    <section aria-busy="true" aria-label="Loading request">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-row" /><div className="skeleton skeleton-row" /><div className="skeleton skeleton-row" />
    </section>
  )
}
