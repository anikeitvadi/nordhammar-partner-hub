// The hub's loading frame: header, search bar, then the two columns of the split view.
export default function Loading() {
  return (
    <section className="hub" aria-busy="true" aria-label="Loading">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-line" style={{ height: 40, marginTop: 14 }} />
      <div className="split" style={{ marginTop: 18 }}>
        <div><div className="skeleton skeleton-row" /><div className="skeleton skeleton-row" /><div className="skeleton skeleton-row" /></div>
        <div className="skeleton skeleton-block" style={{ height: 320 }} />
      </div>
    </section>
  )
}
