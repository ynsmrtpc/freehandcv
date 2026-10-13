# FreehandCV

A 100% free resume editor. Plan and decisions: [docs/WEB-UYGULAMA-PLANI.md](docs/WEB-UYGULAMA-PLANI.md).
Naming rules (Turkish → English) for code and data: [docs/GLOSSARY.md](docs/GLOSSARY.md).

## Running locally

Requirements: Node 24, pnpm 10, Docker.

```bash
pnpm install
cp .env.example .env            # fill BETTER_AUTH_SECRET: openssl rand -base64 32
pnpm db:up                      # Postgres 17, localhost:5433
pnpm db:migrate
pnpm content:seed               # starter landing content (tr, en) and site settings
pnpm admin:create <email> <password> "Full Name"
pnpm dev
```

- Site: http://localhost:3000 (Turkish), http://localhost:3000/en
- Admin: http://localhost:3000/admin — two-factor authentication (TOTP) is set up on first sign-in.

## Commands

| Command | Purpose |
|---|---|
| `pnpm dev` / `pnpm build` | Dev server / production build |
| `pnpm typecheck`, `pnpm lint` | Type and lint checks |
| `pnpm db:generate` | Generates a SQL migration from schema changes (`drizzle/`) |
| `pnpm db:migrate` | Applies migrations |
| `pnpm db:studio` | Drizzle Studio |
| `pnpm admin:create` | Creates an admin account or promotes an existing one |
| `pnpm content:seed` | Writes starter content (leaves existing rows untouched) |
| `pnpm data:convert-legacy` | One-off: converts Turkish-keyed JSON (pages, site settings, resumes) to the English shape |
| `pnpm test` | Vitest unit tests |

## Directories

```
src/app/[locale]/(site)       public site (static, indexed)
src/app/[locale]/(app)        editor and dashboard (noindex)
src/app/[locale]/(admin)      admin panel (role + TOTP protected)
src/server/                   business logic, database, auth — server only
src/server/db/schema/         Drizzle schema (all tables from plan section 5)
src/actions/                  Server Actions called from the client
src/client/                   browser-side helpers (auth client, editor store)
src/lib/                      pure code shared by both sides (resume engine, blocks, SEO)
src/components/               React components (resume, editor, site, account, admin)
src/blocks/                   CMS block components
src/i18n/                     next-intl: locales, localized paths
messages/<locale>/            UI translations, one file per namespace
```

## Deployment

The `Dockerfile` is for Coolify: a standalone Next.js image that applies database migrations on startup.
Environment variables match `.env.example`; `BETTER_AUTH_URL` and `NEXT_PUBLIC_SITE_URL` must be
the live address (`https://freehandcv.com`).

## Tests and databases

End-to-end runs **never** use the development database; they use a separate `freehandcv_test`
database (same Postgres). To point the server at it:

```bash
DATABASE_URL=postgres://freehandcv:freehandcv@localhost:5433/freehandcv_test pnpm start
```

## Google sign-in and One Tap

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → **Create credentials → OAuth client ID → Web application**.
2. **Authorized JavaScript origins:** `http://localhost:3000`, `https://freehandcv.com`
3. **Authorized redirect URIs:** `http://localhost:3000/api/auth/callback/google`,
   `https://freehandcv.com/api/auth/callback/google`
4. Put `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` and the same ID as `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   in `.env`; restart the server. Google buttons are hidden while these are empty.
