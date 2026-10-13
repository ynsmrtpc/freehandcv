# Coolify'da derlenen üretim imajı (plan bölüm 4: output "standalone").
FROM node:24-alpine AS temel
RUN corepack enable
WORKDIR /app

FROM temel AS bagimliliklar
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM temel AS derleme
COPY --from=bagimliliklar /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build && pnpm build:goc

FROM node:24-alpine AS calisma
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs
COPY --from=derleme --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=derleme --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=derleme --chown=nextjs:nodejs /app/public ./public
# Göçler açılışta uygulanır; drizzle-kit yerine tek dosyaya paketlenmiş göç betiği (scripts/goc.mjs) kullanılır.
COPY --from=derleme --chown=nextjs:nodejs /app/drizzle ./drizzle
COPY --from=derleme --chown=nextjs:nodejs /app/.next/goc.mjs ./goc.mjs
USER nextjs
EXPOSE 3000
CMD ["sh", "-c", "node goc.mjs && node server.js"]
