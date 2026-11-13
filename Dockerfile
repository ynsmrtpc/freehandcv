# Optional container build (plan section 4: output "standalone"). The main deployment is aaPanel
# without Docker: docs/DEPLOY-AAPANEL.md. Mount a volume at MEDIA_DIR so uploads survive redeploys.
FROM node:24-alpine AS base
# Bun installs and builds; Node runs the standalone server.
COPY --from=oven/bun:1.4.4-alpine /usr/local/bin/bun /usr/local/bin/bun
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build && bun run build:migrate

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
# Server PDF (src/server/pdf.ts): Playwright's own Chromium doesn't run on Alpine (musl), so the system one is used.
RUN apk add --no-cache chromium
ENV CHROMIUM_PATH=/usr/bin/chromium-browser
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public
# Migrations run on startup, using a single bundled script (scripts/migrate.mjs) instead of drizzle-kit.
COPY --from=build --chown=nextjs:nodejs /app/drizzle ./drizzle
COPY --from=build --chown=nextjs:nodejs /app/.next/migrate.mjs ./migrate.mjs
USER nextjs
EXPOSE 3000
CMD ["sh", "-c", "node migrate.mjs && node server.js"]
