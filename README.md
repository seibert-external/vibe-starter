# Next.js on Coolify — Starter Template

An opinionated starter template based on [Create T3 App](https://create.t3.gg/), configured for self-hosted deployment on [Coolify](https://coolify.io/) with per-PR preview environments and isolated databases.

## What's Included

- **Coolify deployment** with Dockerfile build pack
- **Per-PR preview databases** — each pull request gets its own PostgreSQL database, auto-created on deploy, auto-cleaned on the next deploy after PR close
- **GitHub Actions CI/CD** — triggers Coolify deploys, polls for status, comments preview URLs on PRs
- **Prisma 7** with the new `pg` adapter
- **React Query 5** (TanStack Query, new queryOptions API)
- **Seibert OIDC** pre-configured with domain restriction
- **shadcn/ui** components with Base UI/Radix primitives
- **TailwindCSS 4** with PostCSS
- **Turbo monorepo** structure with shared configs

## Stack

- Next.js 16 + React 19
- tRPC 11
- PostgreSQL + Prisma
- NextAuth.js
- TypeScript 5.9
- Coolify (self-hosted PaaS)

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Fill in POSTGRES_URL, SEIBERT_CLIENT_ID, SEIBERT_CLIENT_SECRET, etc.

# Run database migrations
pnpm db:migrate:dev

# Start development server
pnpm dev
```

The app runs at [http://localhost:3001](http://localhost:3001).

## Project Structure

```
apps/page/           # Next.js application
packages/
  database/          # Prisma schema and client
  eslint-config/     # Shared ESLint config
  prettier-config/   # Shared Prettier config
  typescript-config/ # Shared TypeScript config
.github/workflows/   # CI/CD pipelines
entrypoint.sh        # Docker entrypoint (preview DB creation, migrations, cleanup)
```

## Coolify Setup

### 1. Create Resources

In your Coolify project, create:

- **Application** — Dockerfile build pack, pointing at your GitHub repo, branch `main`
- **PostgreSQL database** — used by both production and preview deployments

Both must be on the same Coolify network (default: `coolify`) so the app can reach the database via internal hostname.

### 2. Configure the Application

| Setting | Value |
|---|---|
| Build Pack | Dockerfile |
| Auto Deploy | Off (GitHub Actions handles this) |
| Preview Deployments | On |
| Preview URL Template | `{{pr_id}}.{{domain}}` (default) |

### 3. Set Environment Variables

**Production variables** (Preview = off):

| Key | Value |
|---|---|
| `POSTGRES_URL` | `postgresql://user:pass@<db-internal-hostname>:5432/postgres` | <!-- pragma: allowlist-secret placeholder, not a real password -->
| `NEXTAUTH_URL` | Your production URL |
| `NEXTAUTH_SECRET` | Random secret |
| `SEIBERT_CLIENT_ID` | Seibert OIDC client ID |
| `SEIBERT_CLIENT_SECRET` | Seibert OIDC client secret |
| `SSR_ENCRYPTION_KEY` | Next.js encryption key |

**Preview variables** (Preview = on):

| Key | Value |
|---|---|
| `POSTGRES_ADMIN_URL` | `postgresql://user:pass@<db-internal-hostname>:5432/postgres` (same host, `postgres` DB) | <!-- pragma: allowlist-secret placeholder, not a real password -->
| `NEXTAUTH_SECRET` | Same as production |
| `SEIBERT_CLIENT_ID` | Same as production |
| `SEIBERT_CLIENT_SECRET` | Same as production |
| `SSR_ENCRYPTION_KEY` | Same as production |

Do **not** set `POSTGRES_URL` or `NEXTAUTH_URL` for preview — the entrypoint derives them automatically:
- `POSTGRES_URL` is constructed from `POSTGRES_ADMIN_URL` with a per-branch database name
- `NEXTAUTH_URL` is auto-set from Coolify's `COOLIFY_URL`

### 4. GitHub Secrets

Go to your repo **Settings > Secrets and variables > Actions** and add:

| Secret | Description |
|---|---|
| `COOLIFY_API_TOKEN` | Coolify API token (Settings > API Tokens) |
| `COOLIFY_APP_UUID` | Your application's UUID (visible in the Coolify URL) |

### 5. GitHub App Integration

Coolify's GitHub App must be connected to your repo for preview deployments to work. The GitHub App webhook registers new PRs with Coolify. Without it, the `deploy?pr=N` API call will fail with "Pull request not found."

## CI/CD

### Deploy Flow

```
Push to main ──────→ GitHub Action triggers Coolify ──→ Build + migrate ──→ Production live
Open PR ───────────→ Coolify webhook registers PR
                     GitHub Action triggers deploy ───→ Build + create preview DB + migrate ──→ Preview live
                     PR comment: ⏳ Deploying → ✅ Live (with URL)
Close PR ──────────→ Coolify stops preview container
                     Next preview deploy cleans up orphaned databases
```

### How Preview Databases Work

The `entrypoint.sh` script runs before the app starts:

1. If `POSTGRES_ADMIN_URL` is set (preview mode):
   - Derives a database name from `COOLIFY_BRANCH` (e.g., `preview_pull_5_head_pr_5_coolify`)
   - Creates the database if it doesn't exist
   - Overrides `POSTGRES_URL` to point at the new database
   - Drops any `preview_*` databases with no active connections (orphans from closed PRs)
2. Runs `prisma migrate deploy`
3. Starts the Next.js server

Production deployments skip all preview logic (no `POSTGRES_ADMIN_URL` set).

### Workflows

| Workflow | Trigger | What it does |
|---|---|---|
| **CI** (`ci.yml`) | Push to `main`, PRs | Lint, format, build, lockfile check |
| **Deploy** (`deploy.yml`) | Push to `main`, PRs | Trigger Coolify deploy, poll status, comment on PR |
| **Claude Code** (`claude.yml`) | `@claude` mentions | AI-assisted PR review |
| **Renovate Approve** | Renovate PRs | Auto-approves dependency updates |
| **Close Stale Issues/PRs** | Hourly | Closes inactive issues/PRs after 7 days |

## Build from Here

This is an empty starting point. The infrastructure is ready — add your features.
