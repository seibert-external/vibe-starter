FROM mcr.microsoft.com/playwright:v1.59.1-noble

# ── System deps ──────────────────────────────────────────
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# ── pnpm ─────────────────────────────────────────────────
RUN corepack enable && corepack prepare pnpm@10.15.1 --activate

# ── App source ───────────────────────────────────────────
WORKDIR /app
COPY . .

# ── Install deps & generate Prisma client ────────────────
ARG NPM_TOKEN
ENV NPM_TOKEN=${NPM_TOKEN}
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @repo/database build

ENTRYPOINT ["tests/e2e/entrypoint.sh"]
