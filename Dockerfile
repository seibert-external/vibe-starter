# syntax=docker/dockerfile:1

# --- Base ---
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.15.1 --activate
WORKDIR /app

# --- Dependencies ---
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/page/package.json ./apps/page/package.json
COPY packages/database/package.json ./packages/database/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
COPY packages/prettier-config/package.json ./packages/prettier-config/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json
# Skip postinstall scripts (prisma generate needs the schema which isn't copied yet)
RUN pnpm install --frozen-lockfile --ignore-scripts

# --- Build ---
FROM base AS builder
COPY --from=deps /app/ ./
COPY . .

# Prisma generate (needed before Next.js build)
RUN pnpm --filter @repo/database build

# Build Next.js with env validation skipped (env vars provided at runtime)
ENV SKIP_ENV_VALIDATION=1
RUN pnpm --filter page build

# --- Runner ---
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN apk add --no-cache postgresql16-client && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone server
COPY --from=builder /app/apps/page/.next/standalone ./

# Copy static assets and public files (served by Next.js server)
COPY --from=builder /app/apps/page/.next/static ./apps/page/.next/static
COPY --from=builder /app/apps/page/public ./apps/page/public

# Copy Prisma schema, migrations, and config for migrate deploy
COPY --from=builder /app/packages/database/prisma ./packages/database/prisma
COPY --from=builder /app/packages/database/prisma.config.ts ./packages/database/prisma.config.ts

# Install Prisma CLI + dotenv (needed by prisma.config.ts)
# NOTE: keep prisma version in sync with packages/database/package.json
RUN cd packages/database && npm init -y && npm install prisma@7.4.2 dotenv@17.3.1

# Copy entrypoint script
COPY entrypoint.sh ./entrypoint.sh

USER nextjs
EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
