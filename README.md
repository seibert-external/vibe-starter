# Vibe Starter

> ⚠️ **Work in Progress** — Noch nicht produktionsreif.

Starter-Template für Web-Applikationen bei Seibert. Forke dieses Repo als Ausgangspunkt für neue Projekte.

## Wie nutze ich das?

1. **Repo forken** — Erstelle eine Kopie in `seibert-external` für dein Projekt
2. **Coolify einrichten** — Projekt + Datenbank + App auf Coolify anlegen
3. **Loslegen** — Baue deine App, CI/CD läuft automatisch

> 🤖 Du brauchst das nicht alleine machen. Öffne das Repo in Claude Code, Cursor oder pi und sag: *"Ich will ein neues Projekt aufsetzen."* Der AI-Agent kennt die Anleitung in [`docs/setup-new-project.md`](docs/setup-new-project.md) und führt dich durch.

### Voraussetzungen

- **Coolify-Account** — Bei der IT anfragen ([Anwenderdoku](https://seibertgroup.atlassian.net/wiki/spaces/IT/pages/5919309870))
- **Coolify API Token** — Unter https://coolify-dev.seibert.tools/security/api-tokens erstellen
- **Seibert-VPN** — Coolify ist nur intern erreichbar
- **Node.js ≥ 22.18**, **pnpm 10.15**

## Tech Stack

| Was | Womit |
|---|---|
| Framework | Next.js 16, React 19 |
| API | tRPC 11 + React Query |
| Datenbank | PostgreSQL + Prisma 7 |
| Auth | NextAuth.js mit Seibert OIDC |
| Styling | TailwindCSS 4, @seibert/react-ui |
| CI/CD | GitHub Actions → Coolify |
| Monorepo | Turbo + pnpm Workspaces |

## Lokale Entwicklung

```bash
pnpm install
cp .env.example .env    # Env-Vars ausfüllen
pnpm db:migrate:dev     # Datenbank-Migrationen
pnpm dev                # http://localhost:3001
```

## Projektstruktur

```
apps/page/              # Next.js App
packages/
  database/             # Prisma Schema + Client
  eslint-config/        # Geteilte ESLint-Regeln
  prettier-config/      # Geteilte Prettier-Config
  typescript-config/    # Geteilte TypeScript-Config
docs/
  setup-new-project.md  # Anleitung: Neues Projekt aufsetzen
.github/workflows/
  ci.yml                # Lint, Build, Dedupe-Check
  deploy.yml            # Coolify Deploy (nutzt seibert-external/vibe-ci)
```

## CI/CD

```
Push auf main ──→ GitHub Actions ──→ Coolify API ──→ Docker Build ──→ Production
PR öffnen ──────→ GitHub Actions ──→ Coolify API ──→ Docker Build ──→ Preview (eigene DB)
```

- **CI** prüft Lint, Formatting, Build bei jedem Push/PR
- **Deploy** triggert Coolify — Coolify baut das Docker Image und deployed
- **Preview** bekommt pro PR eine eigene Datenbank (automatisch via `entrypoint.sh`)
- Shared Workflow liegt in [`seibert-external/vibe-ci`](https://github.com/seibert-external/vibe-ci)

## Nützliche Befehle

```bash
pnpm dev              # Dev-Server starten
pnpm build            # Alles bauen
pnpm check            # CI lokal prüfen (Lint + Format)
pnpm fix              # Auto-Fix (Lint + Format)
pnpm db:migrate:dev   # Neue Migration erstellen
pnpm db:studio        # Prisma Studio (DB-GUI)
pnpm types            # TypeScript prüfen
```
