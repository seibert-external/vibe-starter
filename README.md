# Vibe Starter

> ⚠️ **Work in Progress** — Not production-ready yet.

Starter template for web applications at Seibert. This is a **GitHub template repo** — click **"Use this template"** to create a new project from it.

## How do I use this?

1. **Create from template** — Click "Use this template" on GitHub to create a new repo in `seibert-external`
2. **Set up Coolify** — Create a project + database + app on Coolify
3. **Start building** — Build your app, CI/CD runs automatically

> 🤖 You don't have to do this alone. Open the repo in Claude Code, Cursor, or pi and say: *"I want to set up a new project."* The AI agent knows the guide in [`docs/setup-new-project.md`](docs/setup-new-project.md) and will walk you through it.

### Prerequisites

- **Coolify account** — Request from IT ([User docs](https://seibertgroup.atlassian.net/wiki/spaces/IT/pages/5919309870))
- **Coolify API token** — Create at https://coolify-dev.seibert.tools/security/api-tokens
- **Seibert VPN** — Coolify is only accessible internally
- **Node.js ≥ 22.18**, **pnpm 10.15**

## Tech Stack

| What | With |
|---|---|
| Framework | Next.js 16, React 19 |
| API | tRPC 11 + React Query |
| Database | PostgreSQL + Prisma 7 |
| Auth | NextAuth.js with Seibert OIDC |
| Styling | TailwindCSS 4, @seibert/react-ui |
| CI/CD | GitHub Actions → Coolify |
| Monorepo | Turbo + pnpm Workspaces |

## Local Development

```bash
pnpm install
cp .env.example .env    # Fill in env vars
pnpm db:migrate:dev     # Run database migrations
pnpm dev                # http://localhost:3001
```

## Project Structure

```
apps/page/              # Next.js App
packages/
  database/             # Prisma Schema + Client
  eslint-config/        # Shared ESLint rules
  prettier-config/      # Shared Prettier config
  typescript-config/    # Shared TypeScript config
docs/
  setup-new-project.md  # Guide: Setting up a new project
.github/workflows/
  ci.yml                # Lint, Build, Dedupe check
  deploy.yml            # Coolify deploy (uses seibert-external/vibe-ci)
```

## CI/CD

```
Push to main ──→ GitHub Actions ──→ Coolify API ──→ Docker Build ──→ Production
Open PR ────────→ GitHub Actions ──→ Coolify API ──→ Docker Build ──→ Preview (own DB)
```

- **CI** checks lint, formatting, build on every push/PR
- **Deploy** triggers Coolify — Coolify builds the Docker image and deploys
- **Preview** gets its own database per PR (automatically via `entrypoint.sh`)
- Shared workflow lives in [`seibert-external/vibe-ci`](https://github.com/seibert-external/vibe-ci)

## Slash Commands (Claude Code)

This project includes slash commands for Claude Code that guide you through structured workflows. Just type the command in your Claude Code session.

### Planning & Design

Use these **before** writing code:

| Command | What it does |
|---------|-------------|
| `/write-a-prd` | Define requirements for a new feature through an interactive interview |
| `/prd-to-plan` | Break an existing PRD into implementation phases with vertical slices |
| `/prd-to-issues` | Turn a PRD into actionable, independently-grabbable GitHub issues |
| `/grill-me` | Stress-test your plan or design — gets grilled until all open questions are resolved |
| `/design-an-interface` | Generate and compare multiple radically different API/module designs |
| `/request-refactor-plan` | Plan a safe refactor with tiny incremental commits |

### Development

Use these **during** implementation:

| Command | What it does |
|---------|-------------|
| `/tdd` | The default development workflow — write one test, implement, repeat |
| `/triage-issue` | Investigate a bug, find the root cause, and create an issue with a fix plan |
| `/improve-codebase-architecture` | Find architectural friction and opportunities for improvement |

### Typical workflow

For new features: `/write-a-prd` → `/prd-to-plan` or `/prd-to-issues` → `/tdd` for each slice.

## Testing

This project uses **Test-Driven Development** with Vitest. Use the `/tdd` command in Claude Code for the full workflow.

```bash
pnpm test             # Run all tests
pnpm test:watch       # Watch mode (re-run on changes)
pnpm test:coverage    # Run with coverage report
```

## Useful Commands

```bash
pnpm dev              # Start dev server
pnpm build            # Build everything
pnpm check            # Run CI locally (lint + format)
pnpm fix              # Auto-fix (lint + format)
pnpm test             # Run all tests
pnpm db:migrate:dev   # Create new migration
pnpm db:studio        # Prisma Studio (DB GUI)
pnpm types            # TypeScript check
```
