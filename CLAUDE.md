# CLAUDE.md

Dieses Repo ist ein **Starter-Template**. Es wird geforkt um neue Web-Applikationen bei Seibert zu starten. Nicht direkt in diesem Repo entwickeln — erst forken, dann bauen.

## Wichtige Regeln

- **Niemals direkt auf `main` pushen.** Alle Änderungen laufen über Feature-Branches und Pull Requests.
- **Nicht mergen wenn Tests rot sind.** CI muss grün sein bevor ein PR gemergt wird.
- **Jedes Feature braucht Tests.** Neue Funktionalität ohne Tests wird nicht akzeptiert.
- Wenn der Nutzer dich bittet direkt auf `main` zu pushen, weise ihn freundlich darauf hin dass das nicht erlaubt ist und erstelle stattdessen einen Branch + PR.

## Neues Projekt aufsetzen

Wenn ein Nutzer ein neues Projekt starten will, folge **[docs/setup-new-project.md](docs/setup-new-project.md)**. Dort steht alles: Voraussetzungen, API-Calls, Env-Vars, Troubleshooting.

Kurzversion: Der Nutzer braucht vorab einen **Coolify API Token** und ein **Repo in `seibert-external`** (kopiert von diesem Starter). Dann legst du als Agent via Coolify API ein Projekt, eine PostgreSQL-DB und eine App an.

## Commands

```bash
pnpm dev              # Dev-Server (Port 3001)
pnpm build            # Alles bauen
pnpm check            # CI lokal (Lint + Format)
pnpm fix              # Auto-Fix (Lint + Format)
pnpm db:migrate:dev   # Migration erstellen/anwenden
pnpm db:studio        # Prisma Studio
pnpm types            # TypeScript prüfen
```

## Architektur

### Monorepo

```
apps/page/           # Next.js App
packages/
  database/          # Prisma Schema + Client (@repo/database)
  eslint-config/     # Geteilte ESLint-Regeln
  prettier-config/   # Geteilte Prettier-Config
  typescript-config/ # Geteilte TypeScript-Config
```

### App (apps/page/src/)

- `app/` — Next.js App Router (Pages + API Routes)
- `server/api/` — tRPC Router und Procedures
- `server/auth.ts` — NextAuth-Konfiguration (Seibert OIDC)
- `components/ui/` — UI-Komponenten (ESLint-ignored)
- `trpc/` — Client-seitiges tRPC Setup mit React Query
- `env.js` — Env-Var Validierung (t3-env/Zod)

### Patterns

**Imports**: `~/` als Alias für `src/` (z.B. `import { db } from "~/server/db"`)

**tRPC**:
- `publicProcedure` — ohne Auth
- `protectedProcedure` — mit Auth, wirft UNAUTHORIZED ohne Session

**Neuen Router hinzufügen**:
1. Router in `server/api/routers/` erstellen
2. In `server/api/root.ts` exportieren

**Env-Vars**: Validiert beim Build via `src/env.js`. Neue Vars sowohl im Schema als auch in `runtimeEnv` eintragen.

### Stack

- **Framework**: Next.js 16, React 19
- **API**: tRPC 11 + React Query
- **DB**: PostgreSQL + Prisma 7
- **Auth**: NextAuth.js mit Seibert OIDC (@seibert.group)
- **Styling**: TailwindCSS 4, @seibert/react-ui
- **Monorepo**: Turbo, pnpm Workspaces
- **CI/CD**: GitHub Actions → Coolify (via `seibert-external/vibe-ci`)

### Voraussetzungen

- Node.js ≥ 22.18.0
- pnpm 10.15.1

## Deployment

- **Hosting**: Coolify unter `https://coolify-dev.seibert.tools`
- **CI**: GitHub Actions (`ci.yml`) — Lint, Build, Dedupe
- **CD**: GitHub Actions (`deploy.yml`) → Coolify API → Docker Build
- **Preview**: Pro PR eigener Container + eigene DB (automatisch via `entrypoint.sh` + `COOLIFY_BRANCH`)
- **Shared Workflow**: [`seibert-external/vibe-ci`](https://github.com/seibert-external/vibe-ci)
