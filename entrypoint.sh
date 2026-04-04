#!/bin/sh
set -e

# --- Preview deployment: create a branch-specific database ---
# Detected via COOLIFY_BRANCH which Coolify sets only for preview deployments.
# Uses the same POSTGRES_URL for CREATE DATABASE (Coolify's default postgres user has superuser rights).
if [ -n "$COOLIFY_BRANCH" ] && [ "$COOLIFY_BRANCH" != "main" ]; then
  # Sanitize branch name for use as a Postgres DB name
  DB_NAME="preview_$(echo "$COOLIFY_BRANCH" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/_/g' | sed 's/__*/_/g' | sed 's/^_//;s/_$//')"

  echo "==> Preview deployment detected (branch: $COOLIFY_BRANCH)"
  echo "==> Ensuring database exists: $DB_NAME"

  psql "$POSTGRES_URL" -tc \
    "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" \
    | grep -q 1 \
    || psql "$POSTGRES_URL" -c "CREATE DATABASE \"$DB_NAME\""

  # Rewrite POSTGRES_URL to point at the branch database
  BASE_URL="${POSTGRES_URL%/*}"
  export POSTGRES_URL="${BASE_URL}/${DB_NAME}"
  echo "==> POSTGRES_URL set to branch database"

  # --- Clean up orphaned preview databases ---
  # Drop preview_* databases that have no active connections (container gone)
  # Safety: only targets preview_* prefix, skips the current DB, skips DBs with connections
  echo "==> Checking for orphaned preview databases..."
  STALE_DBS=$(psql "$POSTGRES_URL" -Atc "
    SELECT datname FROM pg_database
    WHERE datname LIKE 'preview_%'
      AND datname != '$DB_NAME'
      AND datname NOT IN (
        SELECT DISTINCT datname FROM pg_stat_activity
        WHERE datname LIKE 'preview_%'
      )
  ")

  for db in $STALE_DBS; do
    echo "==> Dropping orphaned database: $db"
    psql "$POSTGRES_URL" -c "DROP DATABASE \"$db\""
  done

  if [ -z "$STALE_DBS" ]; then
    echo "==> No orphaned databases found"
  fi
fi

# --- Auto-set NEXTAUTH_URL from Coolify if not explicitly provided ---
if [ -z "$NEXTAUTH_URL" ] && [ -n "$COOLIFY_URL" ]; then
  export NEXTAUTH_URL="$COOLIFY_URL"
  echo "==> NEXTAUTH_URL auto-set from COOLIFY_URL: $NEXTAUTH_URL"
fi

# --- Run migrations & start ---
cd packages/database && npx prisma migrate deploy
cd /app
exec node apps/page/server.js
