'use client'
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { BriefFigures } from './types'

// The brief, as one screen: the premise and the eight parts on the left, the selected part on the stage at the right.
// A part arrives whole when chosen (rise and fade, the arrival curve); inside it, things that are long open in place.
// Arrow keys move between parts; the hash keeps the place, so a link can open a part. Under 960 px the stage folds
// under its own row. Print shows every part in order.

const DEMO = 'https://nordhammar-partner-hub.vercel.app/login'
const REPO = 'https://github.com/anikeitvadi/nordhammar-partner-hub'
const DESK = 'https://customer-intake-erp-stub.vercel.app/desk'

type Part = { id: string; title: string; line: string; Body: (p: { f: BriefFigures | null }) => React.ReactNode }

const PARTS: Part[] = [
  { id: 'problem', title: 'The problem', line: 'Duplicates are created at 9 a.m. and found at 2 a.m.', Body: Problem },
  { id: 'architecture', title: 'Architecture', line: 'Role: Connect. The hub uses your platform, desk and identity provider; it replaces a manual process, not a system.', Body: Architecture },
  { id: 'vercel', title: 'Vercel choices', line: 'Five primitives, each doing one job, each with its trade-off.', Body: Choices },
  { id: 'demo', title: 'The demo', line: 'Live and public, with Nordhammar’s systems played by a stand-in.', Body: Demo },
  { id: 'rollout', title: 'Rollout', line: 'From this demo to live: connect, try it in Brazil, pilot, then region by region.', Body: Rollout },
  { id: 'measures', title: 'Success measures', line: 'Fewer merges at 2 a.m.; a number a day after finance says yes; each with an owner.', Body: Measures },
  { id: 'risks', title: 'Limits and risks', line: 'What you should know before kickoff, plainly.', Body: Risks },
  { id: 'tooling', title: 'How it was built', line: 'Claude Code builds, a Factory agent reviews, evals gate the AI.', Body: Tooling },
]

function onHash(cb: () => void) {
  window.addEventListener('hashchange', cb); window.addEventListener('brief-hash', cb)
  return () => { window.removeEventListener('hashchange', cb); window.removeEventListener('brief-hash', cb) }
}

export function Brief({ figures }: { figures: BriefFigures | null }) {
  // The hash is the one place the chosen part lives, so a link opens it and the server renders the first part.
  const hash = useSyncExternalStore(onHash, () => window.location.hash, () => '')
  const at = Math.max(0, PARTS.findIndex((p) => `#${p.id}` === hash))
  const list = useRef<HTMLOListElement>(null)
  const go = useCallback((i: number, focus = false) => {
    const n = (i + PARTS.length) % PARTS.length
    history.replaceState(null, '', `#${PARTS[n].id}`)
    window.dispatchEvent(new Event('brief-hash'))
    if (focus) list.current?.querySelectorAll<HTMLButtonElement>('button')[n]?.focus()
  }, [])
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); go(at + 1, true) }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); go(at - 1, true) }
  }
  // On a wide screen the two columns scroll on their own. The left one usually fits, so a wheel over it would do
  // nothing; it is passed to the stage instead, which is what a reader scrolling to continue expects.
  const onSideWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const side = e.currentTarget
    if (side.scrollHeight > side.clientHeight + 1) return
    document.getElementById('brief-stage')?.scrollBy({ top: e.deltaY })
  }
  const P = PARTS[at]
  return (
    <div className="brief">
      <div className="brief-side" onWheel={onSideWheel}>
        <header className="brief-mast">
          <span className="brief-mark">Nordhammar</span>
          <nav><a href={DEMO}>Open the demo</a><a href={REPO}>Repository</a></nav>
        </header>
        <Premise />
        <ol className="brief-index" ref={list} onKeyDown={onKey} aria-label="The eight parts">
          {PARTS.map((p, i) => (
            <li key={p.id} className={i === at ? 'on' : undefined}>
              <button type="button" aria-current={i === at ? 'true' : undefined} aria-controls="brief-stage" onClick={() => go(i)}>
                <span className="t">{p.title}</span><span className="l">{p.line}</span>
              </button>
              {i === at ? <div className="brief-fold"><p.Body f={figures} /></div> : null}
            </li>
          ))}
        </ol>
      </div>
      <section className="brief-stage" id="brief-stage" aria-live="polite">
        <div className="brief-part" key={P.id}>
          <h2>{P.title}</h2>
          <P.Body f={figures} />
        </div>
      </section>
      <div className="brief-print" aria-hidden="true">
        {PARTS.map((p) => <section key={p.id}><h2>{p.title}</h2><p.Body f={figures} /></section>)}
      </div>
    </div>
  )
}

function Premise() {
  return (
    <div className="brief-premise">
      <p className="for">For Nordhammar Industries &middot; master data, finance and platform teams</p>
      <p className="lead">One record for every partner, in every region.</p>
      <p>Your integration platform already publishes one golden record (one cleansed record) per legal entity; its first load took North American customers from about 70,000 records to 34,000. But duplicates are still created every morning, at intake, in five regions that cannot see each other. This proposal moves the check to the moment of entry: a partner hub that searches every region before a request is made, keeps finance approving in your service desk, and creates each partner once, in the right ERP.</p>
      <p>Because it holds the cleansed records, the hub also lets anyone search and ask across every region, and gives your central team, the final check after regional finance, a group&rsquo;s credit exposure across regions before it approves another company into it.</p>
      <p><strong>Why Vercel, and why not the desk.</strong> The desk could carry the form and the platform the retries, but intake in the desk makes every change a service-desk release, and in the platform it joins the integration team&rsquo;s backlog. What is left is an application: a request that waits days for finance and then writes to an ERP once, even when a response is lost, advice that never decides, and search across five regions. Vercel runs those parts as managed pieces. Your desk, platform and ERPs stay where they are.</p>
    </div>
  )
}

// One company, four records in one region's books: the four spellings slide into the one golden record they always were.
const SPELLINGS = [
  { name: 'Aurora Industrial Ltda', tax: '61.000.101/0001-57', where: 'Brazil, sales' },
  { name: 'AURORA INDL LTDA', tax: '61000101000157', where: 'Brazil, accounts payable' },
  { name: 'Aurora Industrial Ltda.', tax: '61 000 101 0001 57', where: 'Brazil, migrated 2019' },
  { name: 'Aurora Ind.', tax: '61000101/0001-57', where: 'Brazil, keyed from a quote' },
]
function Problem() {
  const [merged, setMerged] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMerged(true), 1800); return () => clearTimeout(t) }, [])
  return (
    <>
      <dl className="brief-facts">
        <div><dt>Customer</dt><dd>Nordhammar Industries, a manufacturer in five regions (Brazil, Europe, the United States, India, China) on three ERP instances: ERP-1 for North America, Brazil and India, ERP-2 for Europe, ERP-3 for China.</dd></div>
        <div><dt>Current stack</dt><dd>Each region raises a service-desk ticket, finance signs it off, and someone retypes it into the ERP. The integration platform owns the ERP connectors and a nightly pipeline that matches on tax ID and DUNS and publishes one golden record per legal entity.</dd></div>
        <div><dt>Pain</dt><dd>Duplicates are created at 9 a.m. and found at 2 a.m., by which time they have an ERP number. Tax IDs arrive in four formats, so the same company does not look like itself. Finance cannot see its exposure to a corporate group spread over three ERPs.</dd></div>
        <div><dt>Why it matters</dt><dd>A new customer waits days for a number, so its first order waits too. A duplicate customer gets its own credit line, so the group&rsquo;s exposure is understated until the 2 a.m. merge, and a duplicate supplier can be paid twice. Your stewards, the central team that merges duplicates, spend their month on what should never have been created. Week one measures each baseline: request volume, ticket age at close, merges per region per month and the hours spent on them.</dd></div>
      </dl>
      <div className={`merge${merged ? ' done' : ''}`} aria-label="Four records of one company become one">
        {SPELLINGS.map((s, i) => (
          <div key={s.tax} className="merge-row" style={{ ['--i' as string]: i }}>
            <span className="n">{s.name}</span><code>{s.tax}</code><span className="w">{s.where}</span>
          </div>
        ))}
        <div className="merge-gold"><span className="n">Aurora Industrial Ltda</span><code>61000101000157</code><span className="w">one record, ERP-1 110001</span></div>
      </div>
      <button type="button" className="text-button" onClick={() => setMerged((m) => !m)}>{merged ? 'Show the four records again' : 'Merge them'}</button>
      <p className="note">One company as four people entered it, and the one record it is. Its accounts in other regions stay; they link to this record.</p>
    </>
  )
}

function Architecture() {
  const [target, setTarget] = useState(true)
  return (
    <>
      <div className="seg" role="group" aria-label="Which picture">
        <button type="button" aria-pressed={!target} onClick={() => setTarget(false)}>Today</button>
        <button type="button" aria-pressed={target} onClick={() => setTarget(true)}>With the hub</button>
      </div>
      {target ? <TargetFlow key="t" /> : <TodayFlow key="d" />}
      {/* One request told both ways: the switch above changes the picture and the story together. */}
      <p className="story" key={target ? 'st' : 'sd'}>{target
        ? <>Monday in São Paulo, with the hub: Ana searches every region first; the buyer is not there. The duplicate check runs as she types. She submits, finance gets the same ticket it always gets, now with her reason on it, and approves it in its desk. Seconds later the customer has its ERP-1 number, on her request and on the ticket. Nobody retyped anything. Had it been a new branch of a group you already sell to, it would have stopped at the central team, with the group&rsquo;s credit in every region in front of them.</>
        : <>Monday in São Paulo, today: Ana in sales operations has a new buyer ready to order and needs a customer number. She raises a ticket; finance approves it days later; someone retypes it into ERP-1. If the US team already had the buyer under a slightly different name, nobody knows until the 2 a.m. cleanup, after the duplicate has its own number, credit line and invoices.</>}</p>
      <h3>Who does what</h3>
      <dl className="brief-facts">
        <div><dt>Ana, sales operations</dt><dd>Knows the customer. Searches every region, requests in the hub, follows it to its number. Jonas does the same for suppliers, in procurement.</dd></div>
        <div><dt>Regional finance</dt><dd>Owns the risk. Approves in its own service desk, as today; sets credit limits and terms in the ERP.</dd></div>
        <div><dt>The central master-data team</dt><dd>Owns the record. Sees only what the checks cannot decide, with the group&rsquo;s exposure across regions.</dd></div>
        <div><dt>The hub</dt><dd>Does the typing and the checking in between: the search, the check at entry, the ticket, the check after approval, the one create.</dd></div>
      </dl>
      <h3>What stays outside Vercel, and why</h3>
      <dl className="brief-facts">
        <div><dt>Three ERPs</dt><dd>The partner number is born there. Nothing about creating it changes.</dd></div>
        <div><dt>Integration platform</dt><dd>It owns the ERP connectors, the field mappings and the golden-record pipeline. The hub calls one API and never talks to an ERP.</dd></div>
        <div><dt>Service desk</dt><dd>Finance already approves there, and it keeps every request that is not a new partner. The hub goes to finance; finance does not come to the hub.</dd></div>
        <div><dt>Identity provider</dt><dd>The hub asks only who someone is. Regions and amount rights live in the hub.</dd></div>
        <div><dt>Lakehouse and BI</dt><dd>Analytics over everything. The hub answers operational questions, not the whole lake.</dd></div>
      </dl>
    </>
  )
}

// An arrowhead at (x, y) pointing right, left, down or up, arriving once its wire has drawn.
function Head({ x, y, to, d }: { x: number; y: number; to: 'r' | 'l' | 'd' | 'u'; d: string }) {
  const p = { r: `M${x} ${y} l-6 -3.5 v7z`, l: `M${x} ${y} l6 -3.5 v7z`, d: `M${x} ${y} l-3.5 -6 h7z`, u: `M${x} ${y} l-3.5 6 h7z` }[to]
  return <path className="head" d={p} style={{ ['--d' as string]: d }} />
}

function TodayFlow() {
  // Each label placed by its own width (about 6.6 px a character at 12 px), with a 34 px arrow between labels.
  const steps = ['Regional user', 'Service-desk ticket', 'Finance signs off', 'Retyped into an ERP', 'ERP-1, 2 or 3']
  const xs = steps.reduce<number[]>((acc, _, i) => (i === 0 ? [0] : [...acc, acc[i - 1] + steps[i - 1].length * 6.6 + 44]), [])
  return (
    <div className="draw-wrap"><svg className="draw" viewBox="0 0 720 96" role="img" aria-label="Today: user, ticket, finance, retyped into an ERP; the nightly pipeline finds the duplicate the next morning">
      {steps.map((s, i) => <g key={s}><text x={xs[i]} y="34">{s}</text>{i < steps.length - 1 ? <><path pathLength={1} className="w" d={`M${xs[i] + s.length * 6.6 + 6} 30 H${xs[i + 1] - 10}`} style={{ ['--d' as string]: `${i * 120}ms` }} /><Head x={xs[i + 1] - 5} y={30} to="r" d={`${i * 120}ms`} /></> : null}</g>)}
      <text x={716} y="72" textAnchor="end" className="bad">The nightly pipeline finds the duplicate the next morning.</text>
    </svg></div>
  )
}

function TargetFlow() {
  return (
    <div className="draw-wrap"><svg className="draw" viewBox="0 0 640 250" role="img" aria-label="With the hub: users and the central team use the Partner Hub on Vercel; it opens a ticket in the service desk where finance approves, hears back by signed webhook, and makes one keyed create through the integration platform, which routes to the right ERP; golden records flow back nightly">
      <rect pathLength={1} className="w box" x="210" y="20" width="220" height="150" style={{ ['--d' as string]: '0ms' }} />
      <text x="222" y="40" className="m">On Vercel</text>
      <text x="222" y="66" className="s">Partner Hub</text>
      {['Search and the check at entry', 'One durable run per request', 'Nightly load: Cron and a Workflow', 'AI advice through the Gateway', 'Ask: a typed query, never SQL'].map((t, i) => <text key={t} x="222" y={90 + i * 16} className="m2">{t}</text>)}
      <text x="0" y="58">Regional users</text><text x="0" y="112">Central team</text>
      <path pathLength={1} className="w" d="M90 54 H204" style={{ ['--d' as string]: '200ms' }} /><Head x={209} y={54} to="r" d="200ms" />
      <path pathLength={1} className="w" d="M78 108 H204" style={{ ['--d' as string]: '260ms' }} /><Head x={209} y={108} to="r" d="260ms" />
      <text x="492" y="46">Integration platform</text><text x="492" y="61" className="m">one keyed create, OIDC</text>
      <text x="492" y="124">ERP-1, ERP-2, ERP-3</text><text x="492" y="139" className="m">the number is born here</text>
      <path pathLength={1} className="w" d="M430 42 H484" style={{ ['--d' as string]: '420ms' }} /><Head x={489} y={42} to="r" d="420ms" />
      <path pathLength={1} className="w" d="M612 70 V104" style={{ ['--d' as string]: '520ms' }} /><Head x={612} y={109} to="d" d="520ms" />
      <path className="w dash" d="M486 86 H440" style={{ ['--d' as string]: '640ms' }} /><Head x={435} y={86} to="l" d="640ms" /><text x="444" y="101" className="m">golden records, nightly</text>
      <text x="252" y="226">Service desk</text><text x="252" y="241" className="m">finance approves where it does today</text>
      <path pathLength={1} className="w" d="M286 170 V206" style={{ ['--d' as string]: '760ms' }} /><Head x={286} y={211} to="d" d="760ms" />
      <path pathLength={1} className="w" d="M352 210 V175" style={{ ['--d' as string]: '820ms' }} /><Head x={352} y={170} to="u" d="820ms" />
      <text x="292" y="194" className="m">ticket</text><text x="358" y="194" className="m">signed webhook</text>
    </svg></div>
  )
}

const CHOICES = [
  { name: 'Next.js with Cache Components', what: 'The hub itself: per-region search at the moment of entry, and a preview URL for every change.', why: 'Partner data changes once a night, so lists are cached and cleared by the load.', trade: 'The default cache is per instance, so the hit rate is modest. Search stays under a second at this volume either way.' },
  { name: 'Workflows', what: 'One durable run per request: it waits days for finance, checks again, makes one keyed create with bounded retries, and writes the outcome back. A second workflow runs the nightly load page by page, started by a Cron Job at 08:00 UTC or by the central team, so the schedule is visible in the project.', why: 'A request that waits on people for days needs durable state and safe retries. A status table plus scripts is the problem today.', trade: 'Run history is kept for a limited time, so the business record lives in the hub database.' },
  { name: 'AI SDK and AI Gateway', what: 'Suggests a match for an unclear name, and answers questions through a typed query the code checks.', why: 'The model advises; code decides, keeps region limits and blocks any uncited figure. The Gateway gives failover, zero data retention and the cost of every call.', trade: 'A model without zero data retention is refused, by design.' },
  { name: 'OIDC federation', what: 'The hub proves who it is to the integration platform with a short-lived token Vercel issues per deployment.', why: 'No long-lived API key to leak or rotate.', trade: 'The platform has to verify Vercel’s published keys; a one-time setup on their side.' },
  { name: 'Rolling Releases and Instant Rollback', what: 'Every release goes to 10%, then 50%, then 100%, and comes back in one step.', why: 'Releases to people who create partners for a living should be boring.', trade: 'Needs Pro. A rollback cannot take back a number already born in an ERP, which is why the create is keyed and gated.' },
]
function Choices() {
  const [open, setOpen] = useState(0)
  return (
    <>
      <ul className="brief-rows">
        {CHOICES.map((c, i) => (
          <li key={c.name} className={i === open ? 'open' : undefined}>
            <button type="button" aria-expanded={i === open} onClick={() => setOpen(i === open ? -1 : i)}><span className="t">{c.name}</span><span className="sign" aria-hidden="true" /></button>
            <div className="grow" inert={i !== open}><div>
              <p>{c.what}</p>
              <p><strong>Why.</strong> {c.why}</p>
              <p><strong>Trade-off.</strong> {c.trade}</p>
            </div></div>
          </li>
        ))}
      </ul>
      <p className="note"><strong>The network path.</strong> We assume your platform exposes an HTTPS API reachable behind an IP allowlist, as its cloud console is today: then Static IPs (Pro, $100 a project a month plus transfer) are the path and OIDC is the credential. If it is reachable only inside your network, the path is Secure Compute (Enterprise) with peering or a VPN, and that moves the plan. The hub and its database run in one region, named at kickoff. <strong>Where Vercel is not the answer:</strong> one region and one ERP, where a ticket is good enough, or a team with no web developers, better served by a low-code form.</p>
      <p className="note"><strong>What it costs to run.</strong> Usage is priced per request and is small: about 35 Workflow events at $0.02 a thousand, a model proposal on the few requests that need one at $0.0004, an Ask answer at about a tenth of a cent. On top: Pro seats for the web team, Static IPs if the platform is allowlisted, and the hub database. The spend is people, a small web team and the integration team&rsquo;s one API, and the value is per duplicate prevented, not per request processed.</p>
    </>
  )
}

function Demo({ f }: { f: BriefFigures | null }) {
  return (
    <>
      <div className="brief-links">
        <a href={DEMO}><span>The hub (start at sign-in)</span><b>nordhammar-partner-hub.vercel.app</b></a>
        <a href={REPO}><span>Repository</span><b>github.com/anikeitvadi/nordhammar-partner-hub</b></a>
        <a href={DESK}><span>Nordhammar&rsquo;s systems, played by a stand-in</span><b>customer-intake-erp-stub.vercel.app</b></a>
      </div>
      <p>Three people: Ana requests (sales operations, Brazil), finance approves in the service desk, which opens straight from the request, and Priya (central master-data team) takes what the checks cannot decide. Jonas does the same as Ana for suppliers in Europe. The request form has one-click examples for each case; the hub&rsquo;s passwords are in the email that sent you here.</p>
      <ol className="brief-steps">
        <li><b>Search first</b><span>As Ana, search <code>aurora</code>: one group, three companies in two regions on two ERPs. She sees the Swedish company exists, not its terms or credit.</span></li>
        <li><b>Stopped at entry</b><span>As Ana, New Request, then the form&rsquo;s <em>Already exists</em> example: the hub stops the duplicate before anything is sent.</span></li>
        <li><b>A clean one</b><span>The <em>New customer</em> example: submit, press Open Ticket, approve it as finance (no sign-in), come back. Seconds later the ERP number is on the request and on the ticket.</span></li>
        <li><b>The credit check</b><span>The <em>New branch of a group</em> example, approved the same way, waits for Priya. As Priya, open Exceptions: what the Aurora group already holds, per currency, in every region, before she says yes.</span></li>
        <li><b>Who sees what</b><span>As Priya, Ask &ldquo;What is the credit limit of Aurora Nordic AB?&rdquo; and get the figure. As Ana, ask the same: no figure, it belongs to the EU team.</span></li>
      </ol>
      {f ? <p className="note">Live in the demo now: {f.partners} partners in {f.regions} regions on {f.erps} ERPs.</p> : null}
    </>
  )
}

// From this demo to live at Nordhammar, in the five steps the plan is judged on. Plain on purpose: what happens, who
// does it, and how anyone can step back. The release mechanics (10, 50, 100) are one line inside, not the plan.
const ROLLOUT = [
  { t: 'Preview', w: 'Weeks 1 to 2', d: 'Connect it to your systems, in a copy nobody uses yet. The stand-ins in this demo are swapped for the real thing: your integration team opens its API to the hub and trusts the hub\u2019s sign-in, your desk sends finance\u2019s decisions to it, and your identity provider signs people in, with each person\u2019s regions coming from the groups they are already in. The first load brings in your golden records. From here, every change gets its own preview link for stewards and finance to click.' },
  { t: 'Validation', w: 'Weeks 3 to 4', d: 'Brazil uses it read-only for a week: people search your real records and try the form, and nothing is created. We measure the starting point: requests a month, days to a number, merges a month and the hours they take. Finance signs off the ticket it will see, and the central team signs off the checks.' },
  { t: 'Canary', w: 'Pilot, Brazil', d: 'Brazil goes live for a few requesters first, then all of them, with automatic approval off: the central team approves every request, and we count where it agrees with the checks. When it agrees on 95 of 100, automatic approval goes on. Every software release reaches 10% of people, then 50%, then everyone.' },
  { t: 'Cutover', w: 'Region by region', d: 'Brazil, then Europe, then the United States, India and China. When a region\u2019s requests run clean, its old ticket form for new partners is switched off, and its finance team keeps approving exactly where it does today.' },
  { t: 'Rollback', w: 'At any point', d: 'Any region can go back to tickets the same day. Automatic approval has an off switch that sends every request to a person. A bad release is undone in one step, because the previous version is still running.' },
]
// The customer's side of going live: who, what, by when. Each is small; together they are the critical path.
const ASKS = [
  { who: 'Integration team', when: 'Weeks 1 to 2', what: 'Open the platform\u2019s API to the hub and trust its sign-in (one OIDC setting, no keys to manage).' },
  { who: 'Service-desk administrator', when: 'Weeks 1 to 2', what: 'Send finance\u2019s decisions on new-partner tickets to the hub (one signed webhook).' },
  { who: 'IT', when: 'Weeks 1 to 2', what: 'Sign people in through your identity provider, with a group per region and one for the central team.' },
  { who: 'Finance and master-data leads', when: 'Week 4', what: 'Sign off the ticket finance will see and the checks the central team will rely on.' },
  { who: 'Brazil sales operations', when: 'Week 5', what: 'Name a few requesters to go first in the pilot.' },
]
function Rollout() {
  // starts at the beginning, so the steps read in order; Next walks them
  const [at, setAt] = useState(0)
  return (
    <>
      <ol className="track" style={{ ['--at' as string]: at }}>
        {ROLLOUT.map((r, i) => <li key={r.t} className={i <= at ? 'past' : undefined}><button type="button" aria-pressed={i === at} onClick={() => setAt(i)}><span className="track-n">{i + 1}</span>{r.t}</button></li>)}
      </ol>
      <p className="track-d" key={at}><span className="track-w">{ROLLOUT[at].w}.</span> {ROLLOUT[at].d}</p>
      {at < ROLLOUT.length - 1 ? <button type="button" className="text-button track-next" onClick={() => setAt(at + 1)}>Next: {ROLLOUT[at + 1].t} &rarr;</button> : <button type="button" className="text-button track-next" onClick={() => setAt(0)}>Back to the start</button>}
      <h3>It already happened once</h3>
      <p>On 3 November the first canary of a release answered one company&rsquo;s credit limit with its group&rsquo;s total. It was held at 10%, aborted back to the previous version in one step, fixed, checked again, and released. A request started on one version and approved from the next also finished on the first and kept its ERP number after an abort.</p>
      <h3>What we need from you</h3>
      <dl className="brief-facts actions">
        {ASKS.map((a) => <div key={a.who}><dt>{a.who}<span>{a.when}</span></dt><dd>{a.what}</dd></div>)}
      </dl>
    </>
  )
}

function Measures({ f }: { f: BriefFigures | null }) {
  return (
    <>
      {f ? (
        <div className="brief-live">
          <p className="note">This month in the demo, live</p>
          <div className="nums">
            <div><b>{f.stopped}</b><span>{f.stopped === 1 ? 'duplicate' : 'duplicates'} stopped at entry</span></div>
            <div><b>{f.numbersOut}</b><span>ERP numbers out</span></div>
            <div><b>{f.automatic}</b><span>created with no person in the hub</span></div>
          </div>
        </div>
      ) : null}
      <dl className="brief-facts">
        <div><dt>Duplicates created at entry</dt><dd>Measured by your pipeline, not the hub: the merges the 2 a.m. run makes per region per month, before and after. Near zero in Brazil within a quarter of go-live; stops at entry are the leading indicator</dd></div>
        <div><dt>Request to ERP number</dt><dd>Two clocks. The hub&rsquo;s, submit to ticket and approval to number, in seconds on every request. Finance&rsquo;s, ticket open to approved, which the hub shows but does not own. Target: a number within one business day of finance saying yes</dd></div>
        <div><dt>Steward hours on duplicates</dt><dd>Half within two quarters</dd></div>
        <div><dt>Questions answered without a report</dt><dd>Counted from week one: group exposure, partners on hold, time to a number, asked in the hub instead of requested from BI</dd></div>
        <div><dt>Group credit checked before a new company joins</dt><dd>Every time; the central team sees the group&rsquo;s exposure in every region on the request</dd></div>
        <div><dt>Duplicate ERP records from retries</dt><dd>Zero: every create is keyed, and a lost response was replayed with the same number</dd></div>
        <div><dt>Search and the duplicate check</dt><dd>Under one second (measured once, on the demo)</dd></div>
        <div><dt>AI behaviour</dt><dd>Every evaluation case passes on all three of three runs before a model or prompt change ships; every call&rsquo;s cost is recorded ($0.00038 a suggestion)</dd></div>
        <div><dt>Release safety</dt><dd>Every release staged; rollback in one step, to a deployment that is still running</dd></div>
      </dl>
      <p className="note">Who owns each: duplicates and steward hours, the central master-data lead; time to a number, regional finance operations; automatic approval and the pilot switch, the central team; questions answered in the hub, the BI lead. Reviewed monthly against the week-one baseline.</p>
    </>
  )
}

const RISKS = [
  { t: 'The demo uses stand-ins', d: 'The integration platform’s real API, rate limits and per-ERP behaviour are first-week discovery.' },
  { t: 'Search is as fresh as the last load', d: 'A partner created today is searchable after the next load, or after the central team runs it. Until then a reservation on the tax ID stops a second request.' },
  { t: 'Automatic approval trusts the checks', d: 'They are deterministic and listed on each approval, and the AI never makes a request clean. It can be switched off, and nobody decides an exception they raised themselves. Automatic approval is a data-quality check after finance has approved in the desk: the commercial approval and its evidence stay on the ticket.' },
  { t: 'Data residency', d: 'The hub holds the identity fields your lake already exports from every region, in one region named at kickoff. EU-only processing is possible: an EU function region, an EU database, EU model inference. China is the open question: if its partner identities may not leave China under PIPL, China keeps the ticket path and the hub counts its records without holding them until legal says otherwise. Under LGPD a contact\u2019s name and email are personal data; they stay on the ticket. Some workflow metadata is stored in the US by default; your DPO reviews that before kickoff.' },
  { t: 'The front door', d: 'Production sits behind your identity provider over OIDC and, if you want it, a Vercel Firewall rule that admits only your network ranges. The demo uses email and password with sign-up off, because it is public for review.' },
  { t: 'Who sees what', d: 'Everyone reads every region\u2019s partners (names, tax IDs, groups); work and amounts stay in each person\u2019s own regions. If a region may not see another, one flag per person turns cross-region reading off, with no release.' },
  { t: 'Credit limits', d: 'Finance approves the partner; credit limits and terms are set in the ERP by regional finance, as today. Bringing the limit into the approval is a phase-two option.' },
  { t: 'Plan', d: 'The design needs Pro. Directory sync for SSO, audit-log streaming and Secure Compute need Enterprise; governance decides which.' },
  { t: 'Not built', d: 'Email notifications (logged, not sent), attachments such as tax certificates, and the real identity provider. Each is a scoped follow-up.' },
]
function Risks() {
  const [open, setOpen] = useState(0)
  return (
    <ul className="brief-rows">
      {RISKS.map((r, i) => (
        <li key={r.t} className={i === open ? 'open' : undefined}>
          <button type="button" aria-expanded={i === open} onClick={() => setOpen(i === open ? -1 : i)}><span className="t">{r.t}</span><span className="sign" aria-hidden="true" /></button>
          <div className="grow" inert={i !== open}><div><p>{r.d}</p></div></div>
        </li>
      ))}
    </ul>
  )
}

function Tooling() {
  return (
    <>
      <p>A note for the Vercel reviewers, as the exercise asks. Claude Code, in the Claude desktop app, wrote the code under my direction. A separate agent on Factory, set up only to review, checked every change against the brief and the running app before I accepted it. Its findings went into a review log and I decided each one. Three of them shaped the build. Two changed it: the golden records had been seeded into the app instead of arriving through the load, and nothing showed a run&rsquo;s cost and where the time went, which became the Run panel. The third held it: every change was measured against the core story, so the durable workflow still owns the one keyed ERP write. A final review before submission found two workflow bugs (a request left waiting after the ERP never answered, and a resubmission waiting on a decided ticket); both were fixed and tested.</p>
      <div className="brief-live">
        <div className="nums">
          <div><b>12</b><span>offline cases on every change</span></div>
          <div><b>4 &times; 3</b><span>hard cases against the live model, every run passing</span></div>
          <div><b>20 / 21</b><span>Ask questions passing all three runs, in the last full run</span></div>
        </div>
      </div>
      <p>The Ask set grades the query the model filled, the figure that came back, and that nothing leaks outside a person&rsquo;s regions. Its last bug was found on the canary, not by the set: one company&rsquo;s credit limit answered with its subsidiaries&rsquo; total. Now the set grades the figure. No step moved on until the tests passed, a production build was clicked through, the canary was clicked through as each role, and the logs were read. In the last full run one question, partners on hold by ERP, left out the on-hold filter once in three; it passed five of five on a re-run. The card shows the query in words, so a missing filter is visible to the person asking.</p>
      <p className="note">Every decision, its alternatives and its measured evidence: <a href={`${REPO}/blob/main/DECISIONS.md`}>DECISIONS.md</a>.</p>
    </>
  )
}
