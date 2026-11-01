// What the customer's own workflow catalogue names and this build does not do, each with the reason. No fake buttons
// anywhere in the app point here instead.
export default function RoadmapPage() {
  return (
    <section className="narrow-wide">
      <h1>Not built, on purpose</h1>
      <p>Everything on this page is in the target workflow catalogue. Each line says what it is and why it is not in this cut.</p>
      <dl className="facts">
        <dt id="change">Change an existing record</dt><dd>A change is a second payload shape with the same request, approval and write path. Not built so the one path shown is the one that creates a number, which is the irreversible one.</dd>
        <dt id="parent">Set a parent (steward)</dt><dd>Hierarchy links come from the D&amp;B family tree or a steward list keyed on DUNS, loaded with the hub. Editing them is steward work in the hub, not in this app.</dd>
        <dt>Steward review of probable duplicates</dt><dd>Name-similarity pairs are a post-load review queue in the hub. The app prevents duplicates at the point of entry; it does not clean the past.</dd>
        <dt>Emails</dt><dd>Every event that would send an email writes a queued row to the timeline (you can see them on any request). The sender is one integration away and adds nothing to the decisions this build is about.</dd>
        <dt>Attachments (tax registration, W-9)</dt><dd>Stored with the request, never sent to the ERP. A blob store and a private link; not in this cut.</dd>
        <dt>China creation path</dt><dd>Open in the target architecture: write a structured row into MAPICS and let the Fabric cleanse carry it, or make Fabric the system of entry. The form exists; the submit says this instead of guessing.</dd>
      </dl>
    </section>
  )
}
