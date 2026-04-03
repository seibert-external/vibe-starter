# Seateao

An opinionated starter template based on [Create T3 App](https://create.t3.gg/), with updated deps.

## What's Different

- **Prisma 7** with the new `pg` adapter
- **React Query 5** (TanStack Query, new queryOptions API)
- **Google OAuth** pre-configured with domain restriction
- **shadcn/ui** components with Base UI/Radix primitives
- **TailwindCSS 4** with PostCSS
- **Turbo monorepo** structure with shared configs
- **CI/CD pipelines** — GitHub Actions for CI, Coolify for deployments with preview environments

## Stack

- Next.js 16 + React 19
- tRPC 11
- PostgreSQL + Prisma
- NextAuth.js
- TypeScript 5.9

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Fill in POSTGRES_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, etc.

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
```

## CI/CD

Deployments are built and deployed via [Coolify](https://coolify.io/) (self-hosted). The GitHub Actions pipeline triggers Coolify's API — Coolify handles Docker builds, container orchestration, and routing. Preview environments get isolated databases per branch.

### Workflows

| Workflow | Trigger | What it does |
|---|---|---|
| **CI** (`ci.yml`) | Push to `main`, PRs | Lint/format validation, build check, lockfile dedupe check |
| **Deploy** (`deploy.yml`) | Push to `main`, PRs | Triggers Coolify deployment, polls status, comments preview URL |
| **Claude Code** (`claude.yml`) | `@claude` mentions, PR open | AI-assisted PR review and issue responses |
| **Renovate Approve** (`renovate-approve.yml`) | PRs from Renovate | Auto-approves dependency update PRs |
| **Close Stale Issues** (`close-stale-issues.yml`) | Hourly schedule | Closes issues labeled `awaiting-response` after 7 days |
| **Close Stale PRs** (`close-stale-prs.yml`) | Hourly schedule | Closes inactive non-Renovate PRs after 7 days |
| **Awaiting Response** (`awaiting-response.yml`) | Issue label/comment | Nudges on label add, clears label when author replies |

### Deploy Flow

```
Push to main ──→ Trigger Coolify deploy ──→ Docker build ──→ Prisma migrate ──→ Production
Open PR ────────→ Trigger Coolify preview ──→ Docker build ──→ Create branch DB ──→ Prisma migrate ──→ Preview
Close PR ───────→ Cleanup preview database (TODO)
```

PRs get a bot comment with the preview URL (dynamically resolved from the Coolify API), updated on each push. The preview URL follows the pattern configured in Coolify's `preview_url_template`.

The Docker entrypoint (`entrypoint.sh`) handles preview database isolation: when `POSTGRES_ADMIN_URL` is set, it creates a branch-specific database (`starter_<branch_slug>`) and runs migrations against it.

### Setup

#### 1. Coolify

Create an application in Coolify pointing to your GitHub repo. Coolify handles Docker builds using the repo's `Dockerfile`. Make sure:

- **Build pack** is set to `dockerfile`
- **Preview deployments** are enabled with desired URL template (default: `{{pr_id}}.{{domain}}`)
- The app has `POSTGRES_ADMIN_URL` set as an environment variable (for preview DB creation)

#### 2. GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add these secrets:

| Secret | Description |
|---|---|
| `COOLIFY_API_URL` | Coolify API base URL (e.g. `https://coolify-dev.seibert.tools/api/v1`) |
| `COOLIFY_API_TOKEN` | Coolify API token (create under Settings → API Tokens) |
| `COOLIFY_APP_UUID` | UUID of the Coolify application (visible in app URL or API) |
| `CLAUDE_CODE_OAUTH_TOKEN` | Anthropic Claude Code OAuth token (for AI workflows) |

The pipeline is **fully portable** — no hardcoded URLs. The preview URL is dynamically resolved from the Coolify API at deploy time using the app's `fqdn` and `preview_url_template`.
