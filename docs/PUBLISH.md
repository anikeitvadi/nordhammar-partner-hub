# Publishing the repository: history cleanup, then the first push

Status: PREPARED, NOT RUN. The owner authorizes each step. Nothing below has been executed.

## Why

Commit `d442afc` added `apps/web/.workflow-data/` and `apps/web/.workflow-vitest/` (Workflow local-world run state
from the in-process test, five small files) and `apps/erp-stub/tsconfig.tsbuildinfo`. Commit `1c2bf0c` removed them from
the index and ignored them, but they remain in history. A public repository should not carry run state, and the prompt
asks for the full history to be preserved otherwise, so the cleanup removes only those paths and keeps every commit.

There is no remote yet, so history can be rewritten freely. `git-filter-repo` is not installed on this machine (checked).

## 1. Backup first

```bash
cd /Users/anikeit/customer-intake-demo
git status --porcelain            # must be empty: commit or stash first
git bundle create ../customer-intake-demo-before-cleanup.bundle --all
git log --oneline | wc -l         # note the count; expect the same count after
```

## 2. Rewrite (option A, recommended: git filter-repo)

```bash
python3 -m pip install --user git-filter-repo     # or: brew install git-filter-repo
git filter-repo --path apps/web/.workflow-data --path apps/web/.workflow-vitest --path apps/erp-stub/tsconfig.tsbuildinfo --invert-paths --force
```

Option B, built-in (slower, prints a deprecation warning):

```bash
git filter-branch --force --index-filter \
  'git rm -r --cached --ignore-unmatch apps/web/.workflow-data apps/web/.workflow-vitest apps/erp-stub/tsconfig.tsbuildinfo' \
  --prune-empty -- --all
rm -rf .git/refs/original && git reflog expire --expire=now --all && git gc --prune=now --aggressive
```

## 3. Verify

```bash
git log --oneline | wc -l                                   # same count as before (filter-repo keeps every commit; hashes change)
git log --all --oneline -- apps/web/.workflow-data | cat     # expect empty
git ls-files | grep -cE "workflow-data|workflow-vitest|tsbuildinfo"   # expect 0
git ls-files | grep -E "\.env"                               # expect only .env.example
bash scripts/check-slop.sh                                   # the secrets-in-history grep at the end must print nothing
git log -p --all | grep -nE "sb_secret|AI_GATEWAY_API_KEY=.+|postgres(ql)?://[^ ]*:[^ ]*@|eyJ[A-Za-z0-9_-]{30,}" | head   # expect nothing
```

## 4. First push

```bash
git remote add origin git@github.com:anikeitvadi/customer-intake-demo.git   # name decided by the owner
git push -u origin main
```

Then in GitHub: repository public, default branch `main`, Actions enabled (`.github/workflows/ci.yml` runs lint,
typecheck, tests and both builds on Node 24). Vercel projects stay deployed from the CLI; connecting the Git repo to the
projects is optional and would switch production to Git-triggered deploys.

## What never goes in

`apps/web/.env.local`, `apps/*/.env.vercel.dev`, `apps/*/.vercel/`, anything under the author's private planning folder.
Test-user passwords travel in the submission email, not the repository.
