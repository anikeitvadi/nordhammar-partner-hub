# Customer intake on Vercel: the decisions

Customer-facing. Eight sections, one honest story. Every number is labeled measured, estimated, target or assumption. Sections marked DRAFT still need evidence from the live runs.

## 1. The problem

A global industrial manufacturer runs two ERPs across five regions. Each region creates its own customers by hand: a ticket, two approvals, someone retypes it into the ERP. The same legal entity exists several times across regions, tax IDs arrive in four formats, and finance cannot see exposure by group. A master data hub now exists and matched the North American records from 70,000 down to 34,000 (measured, from the engagement). What is left is the point of entry: intake is still ticket plus email plus retyping, and the most painful uncertainty for the person raising it is "does this company already exist somewhere, and am I about to create the fourth copy."

Baselines not measured today: duplicates created per month, days from request to ERP number, hours spent on quarantine. The first thing this system makes measurable is all three.

Targets: duplicate creation at the point of entry near zero; request to ERP number inside one business day; every request's position visible to the person who raised it.

## 2. Current versus target boundary

What stays, and why: the master data hub (system of record for the deduplicated customer; re-platforming it is a different project), the two ERPs (the customer number is born there), the analytics layer (exposure by group, nightly), identity and the existing service desk. Proposed, not confirmed in the engagement: the ERP listener APIs and the identity provider as the production paths.

What moves to Vercel: the application and the agent. Vercel's role is Connect: the app reads golden records, proposes, waits for a human, and writes one command to the ERP through an authenticated boundary.

The boundary is crossed in two places: a read of golden records for search and duplicate checks, and a write of an approved request to the ERP, which returns the customer number. In the demo both are real network hops to separate deployments with their own credentials; in production the write goes through private networking with static IPs on the customer's allowlist.

## 3. Primitives built, and what was rejected

- **Workflows.** One durable run per request revision waits on the reviewer's decision, which can take a day, then owns the single ERP write with retries, an idempotency key and a conflicting-run check. Rejected: a status table plus cron, which is what exists today and what loses the wait and retry semantics. Honest limit: a run continues on the deployment that started it; a redeploy does not move it.
- **AI SDK.** One structured generation, through the Gateway, on exactly one route: a name match against a hub record that carries no tax ID. The code decides the other four routes. The model may only propose; a validator rejects any claim about a candidate or field it was not given. Rejected: a form with rules-only checks (the ticket process already is that) and a chat box over the database.
- **AI Gateway.** One key, a primary and a fallback model, the model that actually served recorded per request, cost attributable per run. Rejected: a direct provider SDK, which is what the author's own other apps do today and what he would change there too.
- **Cache Components.** Static shell, dynamic holes behind Suspense; the search projection cached per region with the auth check outside the cache; invalidated by the hub load, not by a trick. Rejected: fully dynamic pages for data that changes once a day.
- Named, not built, with the reason: Vercel CI (does not support public repositories; GitHub Actions gates instead), Rolling Releases and Secure Compute (not available on the plan used for the demo; the production path is described).

## 4. Demo, repository, credentials

DRAFT. Deployed URL, public repository with full history, canned inputs (the twelve eval fixtures double as demo inputs), and how evaluator credentials are handed over privately.

## 5. Rollout and rollback

Preview per pull request with its own database branch and stub. Promote to production in stages. A run is pinned to the deployment that started it, so in-flight waits finish on their version. Rollback of the app is instant and complete; rollback of a customer number born in the ERP does not exist, which is why the write is gated by a human and keyed, and why reconciliation reads the ERP's own ledger.

What happens when something fails, per hop: hub unreachable means search degrades and creation blocks, nothing in flight is lost; model unavailable means the request proceeds to review with the deterministic result and a flag; ERP timeout retries with the same key then stops with effect unknown; ERP business rejection stops with the reason and no retry; a response lost after the ERP committed replays to the same number; an edit after approval voids the approval.

## 6. Measured

DRAFT. Test and eval observations from the live runs: unit and boundary tests, the database-gated integration tests, the mock eval (routing, privacy, validator) and the live eval (pass^3 per case on two models, cost and latency per run).

## 7. Known limitations

Synthetic data. One review step where the real process has two. Legacy records without tax IDs are the one case the rules cannot decide, and the model only proposes on them. No live integration to the real hub or ERPs. Data residency is not demonstrated. The hub load is simulated by an operator action.

## 8. Tooling and validation

Built with coding agents (Claude Code; a second agent audited the design before any code). Every decision is in a commit message. The author rejected agent output where it was wrong: eight filler seed identifiers failed their own checksums and were corrected; the planning agent's text-to-SQL suggestion for natural-language queries was rejected in favor of three typed, authorized tools. DRAFT: candid product feedback from the build, including the documented-versus-published Workflow SDK option skew found by reading the installed package.
