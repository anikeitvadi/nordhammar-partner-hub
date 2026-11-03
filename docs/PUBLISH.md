# Publishing the repository: checks, then the first push

Status: DONE, 2026-11-03. Published at https://github.com/anikeitvadi/nordhammar-partner-hub (`main` only). Before the push every commit was searched for the real values of each secret the project holds (none found), and the CI sequence was run on a fresh clone with no `.env` files (lint, typecheck, tests and both builds pass).

## History stays as it is

The prompt asks for the full commit history to be preserved, so nothing here rewrites it. Commit `d442afc` added
Workflow local-world run state from the in-process test (`apps/web/.workflow-data/`, `apps/web/.workflow-vitest/`)
and `apps/erp-stub/tsconfig.tsbuildinfo`; commit `1c2bf0c` removed them from the index and ignored them. They remain
in history. They were read before this decision: test run events and a hook token of the form `smoke:<timestamp>`,
no credentials, no customer data. A reader who finds them sees a mistake and its fix, which is what the history is for.

## 1. Checks

```bash
cd customer-intake-demo
git status --porcelain                                       # must be empty
git ls-files | grep -cE "workflow-data|workflow-vitest|tsbuildinfo"   # expect 0
git ls-files | grep -E "\.env"                               # expect only .env.example
bash scripts/check-slop.sh                                   # the secrets-in-history grep at the end must print nothing
git log -p --all | grep -nE "sb_secret|AI_GATEWAY_API_KEY=.+|postgres(ql)?://[^ ]*:[^ ]*@|eyJ[A-Za-z0-9_-]{30,}" | head   # expect nothing
```

## 2. First push

```bash
git remote add origin https://github.com/anikeitvadi/nordhammar-partner-hub.git
git push -u origin main
```

Then in GitHub: repository public, default branch `main`, Actions enabled (`.github/workflows/ci.yml` runs lint,
typecheck, tests and both builds on Node 24). Vercel projects stay deployed from the CLI; connecting the Git repo to the
projects is optional and would switch production to Git-triggered deploys.

## What never goes in

`apps/web/.env.local`, `apps/*/.env.vercel.dev`, `apps/*/.vercel/`, anything under the author's private planning folder.
Test-user passwords travel in the submission email, not the repository. `apps/web/AGENTS.md` is written by `next dev`
on every start and is ignored.
