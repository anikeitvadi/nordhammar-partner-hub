# Nordhammar Partner Hub

A small, defensible partner-intake application for a fictional European manufacturer whose customers and suppliers are scattered across two regional ERPs and five regions.

Search the golden records → request a new customer or supplier, checked against the hub the moment the tax ID is typed → one global reviewer approves → a durable Workflow writes one keyed command through an authenticated ERP boundary, effectively once → the request shows the ERP number live → the nightly hub load makes it searchable.

This app's database is the master data hub: golden records, groups, hierarchy, sources, the nightly load. The ERPs stay (the partner number is born there), the analytics lake stays and consumes the hub's clean feed, the identity provider stays. That boundary is the point, and `DECISIONS.md` is the customer-facing artifact that explains it.

## Try it in two minutes

App: https://staging-nordhammar.vercel.app · ERP stand-in: https://customer-intake-erp-stub.vercel.app · test users and canned inputs: `DECISIONS.md` §4 (passwords arrive by email, never here).

The short version: sign in as `ana.requester@example.com`, search `aurora`, open a record, then "Request a customer" with `Vela Processos Industriais` and CNPJ `61.000.103/0001-46` to see the one case the rules cannot decide and the model's proposal. Sign in as `priya.reviewer@example.com` to approve, and watch the status page go to created. On Operations, "Demo: drop the next ERP response" sets up the lost-response replay. "Ask the hub" in the sidebar answers six typed questions (a group, a request, why it was flagged, who is on hold, intake this month, exposure to a group) over what the signed-in person may see. `/how-it-works` is the diagram, public.

## Layout

```
apps/web                  the app (Next.js 16.4, Cache Components on, Workflow SDK 5.2, AI SDK 7)
  src/features/*          feature-first; each feature owns its SQL and its server module
  src/features/customers/hub.server.ts    boundary 1: every authorized read of the hub
  src/features/reviews/decide.server.ts   boundary 2: the only writer of a review decision
  src/features/erp/erp.server.ts          boundary 3: the only network path to the ERP
  src/features/execution/                 the Workflow: wait, wake, one keyed write, operator recovery
  src/boundaries.test.ts                  the import-graph test that enforces the walls above
apps/erp-stub             a separate deployment standing in for the ERP listeners (customer + vendor masters, ledger, OIDC verifier, demo fault switch)
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
pnpm --filter web db:schema && pnpm --filter web db:seed       # DATABASE_URL: hub schema + synthetic seed (add --reset to db:schema to drop first)
pnpm --filter erp-stub db:schema                               # ERP_DATABASE_URL: the stub's ledger and fault switch
TEST_DATABASE_URL=... pnpm --filter web test                   # also runs the database-gated integration tests
pnpm --filter web test:workflow                                # the in-process Workflow proof
```

## The path, end to end

1. Sign in. Region and role come from the entitlements table, not the session.
2. Search the hub by name, alias, tax ID, DUNS, city or ERP number, inside your region. Results are cached per region; the auth check runs before the cache. A tax ID that exists in a region you cannot see gets one line and nothing else.
3. Request a new customer or supplier. As soon as the legal name and the tax ID are there the hub is checked: exact match stops; exact match elsewhere shows the region only; same company key pre-selects the group; a name match against a record with no tax ID goes to the model, which may only propose. Then the region's address fields, contact and reason.
4. Submit. Request, immutable revision, identity reservation (per domain and tax ID), queued-email rows and the start delivery commit together; the Workflow starts.
5. Review. One global queue, oldest first. The decision binds to the revision and payload hash the reviewer saw; the first decision wins; the accepted decision and the wake delivery commit together.
6. Create. The Workflow moves approved → creating under an owner guard and sends one command to the ERP boundary with the deployment's own OIDC identity: operation key (domain, request, approved revision), payload hash, canonical payload. Transient failures retry with the same key; the ERP replays the same number; a changed payload is a conflict; a business rejection is definitive.
7. Status. The request shows the ERP number at once and the attempt story on a timeline that polls every two seconds, then "pending next hub load" until the operator runs the load, which creates the golden record, releases the reservation and invalidates that region's search cache.
8. Operations and reports. Retry a pending delivery, reconcile an unknown-effect stop against the ERP's ledger, return a no-effect stop to the requester, arm the demo fault. Reports: on hold by region, intake by state with median cycle time, exposure by ultimate parent (money rows only for entitled regions).

## Environment

Variable names are in `.env.example`. Values live in Vercel project settings, scoped per environment, and in a local `.env.local` that is ignored. Production carries no shared ERP secret; the deployment's OIDC token is the credential.

## Decisions

Decisions and their reasons live in commit messages and in `DECISIONS.md`. Comments in code explain why a wall exists, never what the next line does.
