#!/usr/bin/env bash
set -euo pipefail

export DATABASE_URL="postgresql://e2e:e2e@${POSTGRES_HOST:-postgres}:5432/e2e"
export POSTGRES_URL="$DATABASE_URL"
export NEXTAUTH_URL="http://localhost:3001"
export NEXTAUTH_SECRET="e2e-test-secret-not-for-production"
export SSR_ENCRYPTION_KEY="e2e-test-key-00000000000000000000"
export SKIP_ENV_VALIDATION=true

echo "▶ Waiting for Postgres..."
for i in $(seq 1 30); do
  if pg_isready -h "${POSTGRES_HOST:-postgres}" -p 5432 -U e2e -q 2>/dev/null; then
    break
  fi
  sleep 1
done

# ── Database ─────────────────────────────────────────────
echo "▶ Running migrations..."
cd /app
pnpm --filter @repo/database migrate:deploy 2>&1

# ── Start dev server ─────────────────────────────────────
echo "▶ Starting Next.js dev server..."
pnpm --filter page dev &
DEV_PID=$!

# ── Health check ─────────────────────────────────────────
echo "▶ Waiting for app (port 3001)..."
for i in $(seq 1 120); do
  if curl -so /dev/null --max-time 5 "http://localhost:3001/login" 2>/dev/null; then
    echo "  ✓ App ready"
    break
  fi
  if [ "$i" -eq 120 ]; then
    echo "  ✗ App failed to start within 120s"
    kill $DEV_PID 2>/dev/null || true
    exit 1
  fi
  sleep 1
done

# ── Run Playwright ───────────────────────────────────────
echo ""
echo "════════════════════════════════════════════════════"
echo "  Running Playwright E2E tests"
echo "════════════════════════════════════════════════════"
echo ""

cd /app/tests/e2e
pnpm exec playwright test "$@"
TEST_EXIT=$?

# ── Cleanup ──────────────────────────────────────────────
kill $DEV_PID 2>/dev/null || true
exit $TEST_EXIT
