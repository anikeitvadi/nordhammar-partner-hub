# Nordhammar Partner Hub

## Start here

Nordhammar Partner Hub is the front door to a master data hub for a fictional manufacturer with five regions and three ERPs. You search every region before you request, the hub checks the tax ID as you type it, regional finance approves in its own service desk, the central master-data team is the final check on duplicates and group credit, and a durable workflow writes the new partner to the right ERP once.

- **The brief:** https://nordhammar-partner-hub.vercel.app/brief, the customer-facing summary on one page (problem, architecture, Vercel choices, demo, rollout, measures, risks, tooling).
- **Live app:** https://nordhammar-partner-hub.vercel.app (start at sign-in, as Priya).
- **Demo logins:** in the submission email. The sign-in page lists the three people and what each can see, and five things to try; the clean example there is made fresh for each visitor.
- **Reading order:**
  1. The brief.
  2. The app, starting with the five things to try on the sign-in page.
  3. `DECISIONS.md`, the technical companion: each decision, what was rejected, the trade-off and the evidence, by deep-dive area.
  4. `/how-it-works` in the app, the request path with the names used in the code.
  4. The three boundary files listed under Layout below.

A small, defensible partner-intake application for a fictional European manufacturer whose customers and suppliers are scattered across three regional ERPs and five regions.

Search the golden records → request a new customer or supplier, checked against the hub the moment the tax ID is typed → the central master-data team approves → a durable Workflow sends one keyed create through the customer's integration platform to the right ERP, effectively once → the request shows the ERP number live → the nightly load (Vercel Cron starting a Workflow) makes it searchable.

The app holds a copy of the customer's golden records for search at the moment of entry, loaded nightly from their integration platform, which stays the only way in: it owns the ERP connectors, the mapping into each ERP's fields and the matching that produces golden records. The three ERPs stay (the partner number is born there), the lake stays, the identity provider stays. That boundary is the point, and `DECISIONS.md` is the customer-facing artifact that explains it.

## Try it in two minutes

App: https://nordhammar-partner-hub.vercel.app · integration platform stand-in: https://customer-intake-erp-stub.vercel.app · test users and canned inputs: `DECISIONS.md` §4 (passwords arrive by email, never here).

The short version: sign in as `ana.requester@example.com`, search `aurora`, open a record, then "New Request" → Customer with `Vela Processos do Brasil` and CNPJ `61.000.103/0002-27` to see the one case the rules cannot decide and the model's proposal. Approve its ticket as finance in the service desk (`/desk` on the stand-in; the finance password is in the submission email); a name match is never approved automatically, so it lands on the Exceptions page for `priya.reviewer@example.com` (the central team), who approves it and watches the status page go to created. On the Exceptions page, "Demo controls" sets up the lost-response replay, and "Run the Hub Load Now" makes a new partner searchable. "Ask" in the sidebar looks up a group or a request, and answers counts and totals (on hold by region, requests per month, exposure to a group, duplicates stopped) as a number or a chart, from a typed query the model fills and the code checks, over what the signed-in person may see. `/how-it-works` is the diagram, public.

## Layout

```
apps/web                  the app (Next.js 16.4, Cache Components on, Workflow SDK 5.2, AI SDK 7)
  src/features/*          feature-first; each feature owns its SQL and its server module
  src/features/customers/hub.server.ts    boundary 1: every authorized read of the hub
  src/features/reviews/decide.server.ts   boundary 2: the only writer of a review decision
  src/features/erp/erp.server.ts          boundary 3: the only network path to the ERP
  src/features/execution/                 the Workflows: wait, wake, one keyed write, recovery of stopped creates; the nightly load and its cron route
  src/boundaries.test.ts                  the import-graph test that enforces the walls above
apps/erp-stub             a separate deployment standing in for the customer's integration platform: /integration/v1 in front of three ERP masters, the ledger, the golden-record feed, the OIDC verifier, the demo fault switch
packages/contracts        pure domain types and schemas; imports nothing from the apps
eval/                     fixtures E01 to E12 and recorded results for the proposal model
docs/evidence/            screenshots and inspect output from the live runs (security, lost response, deploy survival, rolling release)
docs/PUBLISH.md           the prepared, not yet run, history cleanup and first push
scripts/check-slop.sh     the pre-submit grep list
```

## Toolchain

- Node 24 (`.node-version`). CI and Vercel use 24. Vitest is pinned to 3.2.7: Vitest 5's native binding did not load on this machine's Node 20 at the start of the build and the pin was kept once Node 24 was in place, because nothing here needs 5.
- pnpm 12.16.1 via `packageManager`. If pnpm is not on your PATH: `npx pnpm@12.16.1 <command>`.
- Versions are pinned exactly in each `package.json`. Postinstall scripts are allow-listed in `pnpm-workspace.yaml`; the release-age gate is off because the pins were chosen deliberately.

## Commands

```
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm check:boundaries
pnpm build
pnpm check:slop
pnpm --filter web eval:mock        # offline: routing, privacy, validator, E01 to E12
pnpm --filter web eval:live        # AI_GATEWAY_API_KEY or a pulled VERCEL_OIDC_TOKEN: 3 reps per compare case, both models, plus forced failover; writes eval/results/
pnpm --filter web db:schema && pnpm --filter web db:seed       # DATABASE_URL: hub schema + the people and their entitlements (add --reset to db:schema to drop first)
pnpm --filter web db:seed-requests [--reset] [--apply history|recent]   # demo request history; dry run without --apply; see the file header for the order
pnpm --filter erp-stub db:schema && pnpm --filter erp-stub db:golden   # ERP_DATABASE_URL: the stand-in's ledger, ERP masters and fault switch; publish the golden records
TEST_DATABASE_URL=... pnpm --filter web test                   # also runs the database-gated integration tests
pnpm --filter web test:workflow                                # the in-process Workflow proof
```

## The path, end to end

1. Sign in. Region and role come from the entitlements table, not the session.
2. Search the hub by name, alias, tax ID, DUNS, city, group or ERP number, across every region you may see. Each region's list is cached; the auth check runs before the cache. A tax ID that exists in a region you cannot see gets one line and nothing else.
3. Request a new customer or supplier. As soon as the legal name and the tax ID are there the hub is checked: exact match stops; exact match elsewhere shows the region only; same company key pre-selects the group; a name match against a record with no tax ID goes to the model, which may only propose. Then the region's address fields, contact and reason.
4. Submit. Request, immutable revision, identity reservation (per domain and tax ID), queued-email rows and the start delivery commit together; the Workflow starts and opens a ticket for finance in the customer's service desk. A ticket raised in the desk first becomes a request the moment finance approves it.
5. Finance, then the checks. Finance approves or rejects in the desk; a signed webhook wakes the run. The hub checks the request again: clean is approved automatically; anything else is an exception for the central team, with its reason, on their Exceptions page. Their decision binds to the revision and payload hash they saw; the first decision wins.
6. Create. The Workflow moves approved → creating under an owner guard and sends one command to the integration platform with the deployment's own OIDC identity and the operation key (domain, request, approved revision) as the Idempotency-Key, plus the payload hash and canonical payload; the platform routes by region to ERP-1, ERP-2 or ERP-3. Transient failures retry with the same key; the platform replays the same number; a changed payload is a conflict; a business rejection is definitive.
7. Status. The request shows the ERP number at once and the attempt story on a timeline that polls every two seconds, then "pending next hub load" until the load (nightly by Vercel Cron, or Run now) brings the golden record from the integration platform's feed, links the request, releases the reservation and clears that region's search cache.
8. The central team's page and Home. Exceptions and Stopped are two tabs: decide an exception; retry a pending delivery, reconcile an unknown-effect stop against the ERP's ledger, or return a no-effect stop to the requester. The hub load and the automatic-approval switch are in its header; the demo fault is a drawer behind a flag. Home shows the outcomes measured live (duplicates stopped at entry, request to ERP number against one business day, approvals that needed no person) and exposure by ultimate parent for anyone entitled to amounts. Every request page shows how its run spent its time and what it cost.

## Environment

Variable names are in `.env.example`. Values live in Vercel project settings, scoped per environment, and in a local `.env.local` that is ignored. Production carries no shared ERP secret; the deployment's OIDC token is the credential.

## Decisions

Decisions and their reasons live in commit messages and in `DECISIONS.md`. Comments in code explain why a wall exists, never what the next line does.
