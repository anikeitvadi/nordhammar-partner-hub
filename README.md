# Customer Intake

A small, defensible customer-intake application for a fictional industrial manufacturer with customers scattered across regional ERPs.

Search the hub → compare uncertain identity evidence → submit an immutable request → one global reviewer approves → a durable Workflow writes through an authenticated ERP stub, exactly once → the request shows the ERP number → a later hub load makes it searchable.

The hub, the ERPs and the analytics layer stay where they are. This app is the front door and the agent. That boundary is the point.

## Layout

```
apps/web                  the intake app (Next.js 16, Cache Components on)
  src/features/*          feature-first; each feature owns its SQL and its server module
  src/features/customers/hub.server.ts   boundary 1: every authorized read of the hub
  src/features/reviews/decide.server.ts  boundary 2: the only writer of a review decision
  src/features/erp/erp.server.ts         boundary 3: the only network path to the ERP
  src/boundaries.test.ts  the import graph test that enforces the walls above
apps/erp-stub             a separate deployment standing in for the customer's ERP listener
packages/contracts        pure domain types and schemas; imports nothing from the apps
eval/                     fixtures and recorded results for the proposal model
scripts/check-slop.sh     the pre-submit grep list
```

## Toolchain

- Node 24 (`.node-version`). Vitest 5 needs Node 22 or newer; on an older local Node, run tests as `npx node@24 node_modules/vitest/vitest.mjs run` from `apps/web`, or install Node 24 with nvm. CI and Vercel use 24.
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
pnpm --filter web eval:live        # needs AI_GATEWAY_API_KEY: 3 reps per compare case, both models, writes eval/results/
pnpm --filter web db:schema && pnpm --filter web db:seed       # DATABASE_URL: hub schema + synthetic seed
pnpm --filter erp-stub db:schema                               # ERP_DATABASE_URL: the stub's ledger
TEST_DATABASE_URL=... pnpm --filter web test                   # also runs the database-gated integration tests
```

## The path, end to end

1. Sign in. Region and role come from the database, not the session.
2. Search the hub. Results are cached per region; the auth check runs before the cache.
3. Request a new customer. The tax ID is normalised and checked in code: exact match stops, exact match elsewhere shows the region only, same company key pre-selects the group. Only a name match against a record with no tax ID reaches the model, which may only propose.
4. Submit. Request, immutable revision, identity reservation and the start delivery commit together; the Workflow starts.
5. Review. One global queue, oldest first. The decision binds to the revision and payload hash the reviewer saw; the first decision wins; the accepted decision and the wake delivery commit together.
6. Create. The Workflow moves approved to creating under an owner guard and sends one command to the ERP stub: operation key (request plus approved revision), payload hash, canonical payload. Transient failures retry with the same key; the stub replays the same number; a changed payload is a conflict; a business rejection is definitive.
7. Status. The request shows the ERP number at once and "pending next hub load" until the operator runs the load, which creates the golden record, releases the reservation and invalidates that region's search cache.
8. Operations. Retry a pending delivery, reconcile an unknown-effect stop against the ERP's ledger, or return a no-effect stop to the requester. Nothing here creates a customer.

## Environment

Variable names are in `.env.example`. Values live in Vercel project settings, scoped per environment, and in a local `.env.local` that is ignored. Nothing prefixed `NEXT_PUBLIC_` holds a database URL, a service token or a Gateway key.

## Decisions

Decisions and their reasons live in commit messages and in `DECISIONS.md` (the customer-facing artifact). Comments in code explain why a wall exists, never what the next line does.
