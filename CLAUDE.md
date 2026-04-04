# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TypeScript monorepo using Turbo with pnpm workspaces. Main app is a Next.js 16 dashboard with tRPC API, Prisma/PostgreSQL database, and Seibert OIDC authentication.

## Commands

```bash
# Development
pnpm dev              # Start all apps (runs on port 3001)
pnpm build            # Build all packages/apps

# Code Quality
pnpm lint             # ESLint (0 warnings required)
pnpm lint:fix         # Auto-fix lint issues
pnpm format           # Check Prettier formatting
pnpm format:fix       # Auto-format
pnpm fix              # Run both lint:fix and format:fix
pnpm check            # CI verification (lint + format)

# Database
pnpm db:migrate:dev   # Create/apply migrations during development
pnpm db:migrate:deploy # Deploy migrations to production
pnpm db:studio        # Open Prisma Studio GUI

# Type checking
pnpm types            # TypeScript check (or run in apps/page)
```

## Architecture

### Monorepo Structure

```
apps/page/           # Next.js application
packages/
  database/          # Prisma client + schema (@repo/database)
  eslint-config/     # Shared ESLint rules (@repo/eslint-config)
  prettier-config/   # Shared Prettier config (@repo/prettier-config)
  typescript-config/ # Shared tsconfig (@repo/typescript-config)
```

### App Structure (apps/page/src/)

- `app/` - Next.js App Router pages and API routes
- `server/api/` - tRPC routers and procedures
- `server/auth.ts` - NextAuth configuration
- `components/ui/` - shadcn/ui components (ESLint-ignored)
- `trpc/` - Client-side tRPC setup with React Query
- `env.js` - Environment validation with t3-env/Zod

### Key Patterns

**Path aliases**: Use `~/` for imports from `src/` (e.g., `import { db } from "~/server/db"`)

**tRPC procedures**:
- `publicProcedure` - Unauthenticated endpoints
- `protectedProcedure` - Requires session, throws UNAUTHORIZED if not logged in

**Adding a new tRPC router**:
1. Create router in `server/api/routers/`
2. Export from `server/api/root.ts`

**Environment variables**: Validated at build time via `src/env.js`. Add new variables to both the schema and `runtimeEnv`.

### Tech Stack

- **Framework**: Next.js 16, React 19
- **API**: tRPC 11 with React Query
- **Database**: PostgreSQL + Prisma 7
- **Auth**: NextAuth.js with Seibert OIDC, domain-restricted (@seibert.group)
- **Styling**: TailwindCSS 4, shadcn/ui components
- **Monorepo**: Turbo, pnpm workspaces

### Requirements

- Node.js >= 22.18.0
- pnpm 10.15.1

## Deployment & CI/CD

- **Hosting**: Coolify (self-hosted PaaS) unter `https://coolify-dev.seibert.tools`
- **CI**: GitHub Actions (`ci.yml`) — Lint, Build, Dedupe Check
- **CD**: GitHub Actions (`deploy.yml`) → triggert Coolify API → Docker Build auf Coolify
- **Shared Workflows**: `seibert-external/vibe-ci` — reusable Coolify Deploy Workflow
- **Preview Deployments**: Pro PR wird ein Preview-Container mit eigener DB deployed

### Neues Projekt aufsetzen

Wenn ein Nutzer ein neues Projekt basierend auf diesem Starter anlegen will, folge der Anleitung in **[docs/setup-new-project.md](docs/setup-new-project.md)**. Der Nutzer muss vorher:

1. Einen **Coolify-Account + API Token** haben
2. Ein **Repo in `seibert-external`** erstellt haben (kopiert von diesem Starter)
3. Mit dem **Seibert-VPN** verbunden sein
