// The desk's own not-found, in the desk's plain style, instead of the framework default.
export default function NotFound() {
  return (
    <>
      <h1>No such ticket</h1>
      <div className="box"><p>That ticket number is not in the queue. <a href="/desk">Back to the queue</a>.</p></div>
    </>
  )
}
