# CLAUDE.md

This repo is a **GitHub template repository**. Use the green **"Use this template"** button on GitHub to create a new repo from it — this gives you a clean history with no fork link. Don't develop directly in this repo.

## Important Rules

- **Never push directly to `main`.** All changes go through feature branches and pull requests.
- **Don't merge when tests are red.** CI must be green before a PR gets merged.
- **Every feature needs tests.** New functionality without tests will not be accepted.
- If the user asks you to push directly to `main`, kindly point out that this is not allowed and create a branch + PR instead.

## Setting Up a New Project

If a user wants to start a new project, follow **[docs/setup-new-project.md](docs/setup-new-project.md)**. Everything is documented there: prerequisites, API calls, env vars, troubleshooting.

Short version: The user needs a **Coolify API Token** and a **repo in `seibert-external`** (created from this template via "Use this template") beforehand. Then you as an agent create a project, a PostgreSQL DB, and an app via the Coolify API.

## Commands

```bash
pnpm dev              # Dev server (port 3001)
pnpm build            # Build everything
pnpm check            # Run CI locally (lint + format)
pnpm fix              # Auto-fix (lint + format)
pnpm db:migrate:dev   # Create/apply migration
pnpm db:studio        # Prisma Studio
pnpm types            # TypeScript check
```

## Architecture

### Monorepo

```
apps/page/           # Next.js App
packages/
  database/          # Prisma Schema + Client (@repo/database)
  eslint-config/     # Shared ESLint rules
  prettier-config/   # Shared Prettier config
  typescript-config/ # Shared TypeScript config
```

### App (apps/page/src/)

- `app/` — Next.js App Router (Pages + API Routes)
- `server/api/` — tRPC Router and Procedures
- `server/auth.ts` — NextAuth configuration (Seibert OIDC)
- `components/ui/` — UI components (ESLint-ignored)
- `trpc/` — Client-side tRPC setup with React Query
- `env.js` — Env var validation (t3-env/Zod)

### Patterns

**Imports**: `~/` as alias for `src/` (e.g. `import { db } from "~/server/db"`)

**tRPC**:
- `publicProcedure` — no auth required
- `protectedProcedure` — requires auth, throws UNAUTHORIZED without session

**Adding a new router**:
1. Create router in `server/api/routers/`
2. Export in `server/api/root.ts`

**Env vars**: Validated at build time via `src/env.js`. New vars must be added to both the schema and `runtimeEnv`.

### Testing (TDD)

**Always use Test-Driven Development when building features.** This applies to every new tRPC procedure, service function, or business logic — no exceptions.

- Use the `/tdd` command for the full TDD workflow
- **Framework**: Vitest (`pnpm test`, `pnpm test:watch`, `pnpm test:coverage`)
- **Pattern**: Vertical slices — ONE test, ONE implementation, repeat (never write all tests first)
- **Location**: Place tests next to the code they test as `*.test.ts`
- Tests must verify behavior through public interfaces, not implementation details

### Stack

- **Framework**: Next.js 16, React 19
- **API**: tRPC 11 + React Query
- **DB**: PostgreSQL + Prisma 7
- **Auth**: NextAuth.js with Seibert OIDC (@seibert.group)
- **Styling**: TailwindCSS 4, @seibert/react-ui
- **Monorepo**: Turbo, pnpm Workspaces
- **CI/CD**: GitHub Actions → Coolify (via `seibert-external/vibe-ci`)

### Prerequisites

- Node.js ≥ 22.18.0
- pnpm 10.15.1

## Deployment

- **Hosting**: Coolify at `https://coolify-dev.seibert.tools`
- **CI**: GitHub Actions (`ci.yml`) — Lint, Build, Dedupe
- **CD (production)**: Coolify GitHub App webhook → Docker Build; GitHub Actions (`deploy.yml`) polls status
- **CD (preview)**: Coolify GitHub App handles everything automatically (deploy, PR comment, cleanup)
- **Preview**: Each PR gets its own container + own DB (automatically via `entrypoint.sh` + `COOLIFY_BRANCH`)
- **Shared Workflow**: [`seibert-external/vibe-ci`](https://github.com/seibert-external/vibe-ci)
