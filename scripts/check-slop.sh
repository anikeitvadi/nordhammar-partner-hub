#!/usr/bin/env bash
# craft.md section 7: the pre-submit grep list. Findings need a reviewer's eye, not a blanket ban.
set -u
cd "$(dirname "$0")/.."
status=0
check() { local label="$1"; shift; local hits; hits=$(grep -rnE "$@" apps packages --include='*.ts' --include='*.tsx' --exclude-dir=node_modules --exclude-dir=.next 2>/dev/null || true); if [ -n "$hits" ]; then echo "== $label"; echo "$hits"; status=1; fi; }
for f in $(grep -rlE "useEffect" apps --include="*.tsx" --exclude-dir=node_modules --exclude-dir=.next 2>/dev/null); do grep -q "useState" "$f" && { echo "== useState + useEffect in one file (check for server-state mirroring): $f"; status=1; }; done
check "maxSteps (use stopWhen)" "maxSteps"
find apps -name middleware.ts -not -path "*/node_modules/*" | grep -q . && { echo "== middleware.ts found (Next 16 uses proxy.ts)"; status=1; }
check "unstable_cache" "unstable_cache"
check "zod required_error (removed in zod 4)" "required_error"
check "edge runtime" "runtime\s*=\s*['\"]edge['\"]"
check "console.log left in" "console\.log\("
check "TODO" "\bTODO\b"
echo "secrets in history:"; git log -p --all 2>/dev/null | grep -nE "(sk-[A-Za-z0-9]{20,}|AI_GATEWAY_API_KEY=[A-Za-z0-9_-]{20,}|sb_secret_[A-Za-z0-9_-]{10,}|postgres(ql)?://[^ ]*:[^ ]*@[a-z0-9.-]+\.neon\.tech|eyJ[A-Za-z0-9_-]{40,}\.[A-Za-z0-9_-]{40,})" | head -5 || true
exit $status
