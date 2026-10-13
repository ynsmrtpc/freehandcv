<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project rules

- Plan and decisions: `docs/WEB-UYGULAMA-PLANI.md`. URL structure and data model do not deviate from it.
- Code is written in English: files, folders, identifiers, comments, database objects, JSON keys,
  translation keys and CSS tokens. Vocabulary and the Turkish → English map: `docs/GLOSSARY.md`.
  User-facing text lives in `messages/<locale>/<Namespace>.json`; public Turkish URLs are mapped in
  `src/i18n/routing.ts` `pathnames` and never change after launch.
- No database queries in components; business logic is plain functions under `src/server/`.
- Admin Server Actions check authorization themselves with `requireAdmin()`; never rely on the layout.
- Components that read the session must sit inside `<Suspense>` (Cache Components).
- On schema changes: `pnpm db:generate` → review the generated SQL → `pnpm db:migrate`.
- End-to-end tests run against the `freehandcv_test` database, never the development database.

## Design rules

- Colors only via the semantic tokens in `globals.css` (`bg-surface`, `text-muted`, `text-primary-text`…);
  every token has a light and a dark value. No raw hex in components (except the resume preview paper).
- Font: Plus Jakarta Sans (`next/font`). Icons: `lucide-react`. No emoji as icons.
- Buttons via `buttonClass()` (`src/components/ui/Button.tsx`); one primary CTA per page.
- Reveal animations live in CSS (`.reveal-on-load`, `.reveal-on-scroll`; `Reveal`/`StaggerItem` components) —
  no JS, content is never hidden waiting for JS. The LCP element (h1) renders without animation.
- Motion (`motion/react`, `LazyMotion` + `m`) only for interactive parts: menus, preview transitions.
  No `layout`/`layoutId` (needs the domMax bundle). `prefers-reduced-motion` is respected everywhere.
- Landing sections are components under `src/blocks/` that take content as props; CMS blocks feed
  the same components.
