# Service desk, finance approval and auto-approve (step 6, for Ani's OK before anything is built)

What changes: finance approves a new partner where it already does, in the customer's service desk. The hub stops asking a person to approve clean requests. A webhook from the desk tells the hub finance said yes. The hub then re-runs its checks, and either creates the partner on its own or puts it in front of the central master-data team as an exception. Decided in review log §5: no Finance role in the app; both ways in, one pipeline.

The service desk stand-in lives in `apps/erp-stub`, next to the integration platform (log §17b: the stage set holds the customer's world). It is the customer's system, so it looks like theirs, not like the hub.

## 1. The two ways in, one pipeline

```
Direct, in the hub                         Ticket first, in the desk
regional user fills the hub form           regional user opens a desk ticket
  (live duplicate check as they type)        (no duplicate check: the desk cannot see the hub)
hub opens a desk ticket for finance  ─┐    finance approves in the desk
finance approves in the desk          │      │
        │                             │      │
        └──────── signed webhook: ticket.finance_approved ───────┐
                                                                 ▼
                    hub re-runs its checks on the request (deterministic, no model)
                    ├─ clean: approved automatically → one keyed create → ERP number
                    │          → number written back to the ticket
                    └─ not clean: exception, waits for the central team (reason shown)
                               → central team approves / sends back / declines
                               → outcome written back to the ticket
finance rejects in the desk → webhook ticket.finance_rejected → request declined, reason from finance
```

For a ticket-first request, the webhook carries the partner's fields, and the hub creates the request from them before checking it.

## 2. What "clean" means

Clean means every one of these holds at the moment finance's approval arrives. The check runs again then, not only when the requester typed, because the hub may have changed since.
1. The tax ID passes its format and check digits.
2. No golden record and no open request holds the same tax ID, in any region.
3. No golden record shares the company key (another establishment of the same company).
4. No golden record without a tax ID matches the name. A name match is the case only the model can read, and the model never decides alone.
5. The requester did not override a match ("new company in this group", "not related"). An override is a person's judgement, so another person looks at it.
6. Every field the ERP needs is present. This matters for ticket-first requests, which can arrive incomplete. (Step 10: `missingFields` in contracts, the same list the form asks for; until then this check could not fail.)

Anything else is an exception, and its reason is stored: "possible duplicate: same tax ID as …", "same company as …", "name match, AI reading unsure", "requester said not related", "missing: bill-to address". The model never makes a request clean or unclean; it only adds its reading to an exception.

**Kill switch.** A flag, `auto-approve`, is on by default. When it is off, every finance-approved request becomes an exception, so the central team can stop all automatic creates in one click from the Vercel Toolbar without a deploy. A flag here only routes work to a person; it never grants anyone a permission.

## 3. New request states

| State | Meaning | Who moves it on |
|---|---|---|
| `awaiting_finance` | The ticket is open in the desk; nothing happens until finance decides | The webhook |
| `checking` | Finance approved; the hub's checks are running (seconds) | The Workflow |
| `exception` | Not clean; the reason is stored; waits for the central team | The central team (approve, send back, decline) |
| `approved` | Unchanged. The approval now records who or what approved: `central:<email>` or `auto:checks` with the list of checks that passed | The Workflow |
| `declined` | Unchanged. Gains `by: finance` with the desk's reason | The webhook |

`submitted` and `under_review` stay for requests raised before this step (their Workflows are pinned to the old code and finish on it). New requests go `awaiting_finance → checking → approved` or `→ exception`.

## 4. The Workflow

One run per request revision, as today. The wait moves.

1. Wait on hook `finance:<request>:<revision>`, which the webhook resumes. It can take hours or days; a paused run costs nothing.
2. Rejected: decline with finance's reason, write it back to the ticket, done.
3. Approved: run the checks (a step, deterministic).
4. Clean and the flag on: record the automatic approval, then the existing keyed create (retries, replay, stop with unknown effect, all unchanged).
5. Not clean: mark the exception, then wait on hook `review:<request>:<revision>`, the same hook the central team's decision resumes today.
6. After a number is assigned, or a decline or a stop, write a comment back to the ticket. This is best-effort and retried; the hub's own state is the truth.

The deep-dive story survives: a durable human wait (now finance's, and the central team's for exceptions), then one keyed write that survives retries and redeploys.

## 5. The webhook, desk to hub

`POST https://nordhammar-partner-hub.vercel.app/api/webhooks/service-desk`

| Header | Why |
|---|---|
| `x-desk-timestamp: <unix seconds>` | A signed message older than 5 minutes is refused, so a captured one cannot be replayed later |
| `x-desk-signature: v1=<hex HMAC-SHA256 of "<timestamp>.<raw body>">` | Proves the body came from the desk and was not changed. A shared secret is how real service desks sign webhooks, which is why this is not OIDC: the desk is not a Vercel deployment in the customer's world |
| `x-desk-event-id: <uuid>` | The same event delivered twice is accepted once: the hub stores event ids and answers 200 to a repeat without acting |

Body:

| Field | Why |
|---|---|
| `type` | `ticket.finance_approved` or `ticket.finance_rejected` |
| `ticket.id` | `SD-10421`: shown on the request timeline and in the desk |
| `ticket.hubRequestId` | Set when the hub opened the ticket (direct path); null for ticket-first |
| `ticket.requesterEmail` | Who the request belongs to; for ticket-first it must be a person the hub knows, with that region, or the event is refused |
| `ticket.region`, `ticket.domain` | Routing and scope, checked against the requester's entitlements |
| `ticket.partner` | Ticket-first only: legal name, local name, country, tax ID, type, main address, reason. The same fields the hub form collects, so the hub builds the same canonical payload |
| `decision.by` | The finance person's name, for the timeline |
| `decision.reason` | Required on a rejection |
| `occurredAt` | When finance decided, for the timeline |

Answers: 200 accepted, or a repeat; 401 bad signature or stale timestamp; 400 malformed or unknown requester; 409 the request is not waiting for finance (for example, already decided).

## 6. Hub to desk

The hub calls the desk the way it calls the integration platform: with its own Vercel OIDC token, verified by the stand-in's existing verifier.
- `POST /desk/v1/tickets` opens a ticket for a direct request: the request id, requester, region, domain and a partner summary (name, tax ID, country; since step 10 also the reason and the contact, which finance reads before approving). Answers `{ id: "SD-10421" }`.
- `POST /desk/v1/tickets/{id}/comments` writes the outcome back: "Created in ERP-1, number 110203", "Waiting for the central master-data team: possible duplicate", "Declined by the central team: …".

## 7. The stand-in's tables

**`desk_tickets`**

| Field | Why |
|---|---|
| `ticket_id` | `SD-` and five digits, from a sequence; the id people quote |
| `source` | `hub` or `desk`: which way in |
| `hub_request_id` | Links the two systems; set at once on the direct path, set by the hub's answer on ticket-first |
| `requester_email`, `region`, `domain` | Who asked, where, customer or supplier |
| `summary` | Name, tax ID and country, for the finance list |
| `partner` | Ticket-first only: the full fields from §5 |
| `status` | `open`, `finance_approved`, `finance_rejected`, `done` |
| `decided_by`, `decision_reason`, `decided_at` | Finance's decision |
| `created_at` | List order |

**`desk_comments`**: `ticket_id`, `at`, `author` (`hub` or a person), `body`. This is the conversation on the ticket.

**`desk_outbox`**: `event_id`, `ticket_id`, `type`, `body`, `attempts`, `last_error`, `delivered_at`. A finance decision writes the ticket and the outbox row in one transaction, then sends. A failed send is retried from the screen ("Resend") and on the next decision. That is how a real desk guarantees "at least once", and the hub's event-id store makes it "once".

## 8. The desk's screens

Plain on purpose, so the boundary is visible on stage:
- **Queue:** open tickets, oldest first.
- **A ticket:** its fields, its comments, **Approve as finance** and **Reject** with a required reason.
- **New ticket:** the ticket-first path.

The screens have no sign-in (changed 2026-11-03): whoever opens a ticket from the demo acts as the one finance user. The hub never trusted the screen, only the signed webhook the desk sends. The real desk signs finance in.

## 9. What the hub screens change

- **Submit copy:** "Goes to finance in the service desk (ticket opens). If every check passes, the ERP number is assigned automatically."
- **Request timeline:** the ticket number with a link to it in the desk; "finance approved by …"; "checks passed: approved automatically" with the list of checks; or "exception: …".
- **Reviews:** the queue lists exceptions with their reason, oldest first. Step 9 merges it with Operations into one central-team page. (Done in step 9: the Exceptions page, with Exceptions and Stopped tabs.)
- **Sign-in page:** "Three things to try" gains the finance step.

## 10. Tests that prove it

- **Unit: the check.** One case per item in §2, plus the flag off.
- **Unit: the webhook.** Good signature; wrong secret; changed body; timestamp 6 minutes old; repeated event id (200, no action); unknown requester; requester outside the region.
- **Workflow (in-process):**
  - finance approves and the checks are clean: an automatic approval, then the create
  - finance approves and the checks fail: an exception, then the central team's approve, then the create
  - finance rejects: declined
  - a duplicate start: exits
- **Deployed click-through:**
  - direct clean: the number lands and the comment appears on the ticket
  - direct with a related match: an exception, the central team approves
  - ticket-first clean
  - finance rejects
  - a forged webhook gets 401
  - a replayed webhook is acted on once
  - with the lost-response fault armed, an auto-approved create still replays one number

## What I need from Ani

1. **OK on the design**, especially §2 (what "clean" means) and the kill switch default (on).
2. **Two secrets, set in Vercel by you,** since environment variables are yours to change. I'll generate the values and give them to you in a file outside the repository, not in chat. Until they exist, the webhook refuses everything and the desk screens stay locked, which is fail-closed again.
   - `DESK_WEBHOOK_SECRET`, the same value on both projects (hub and stand-in), Production.
   - `DESK_UI_PASSWORD` on the stand-in, Production: the desk's demo finance sign-in.
3. **The six requests waiting today** were raised before this step and finish on the old path, a central-team approval. Keep them, or re-seed so the demo starts on the new pipeline (the request seed would add tickets).
