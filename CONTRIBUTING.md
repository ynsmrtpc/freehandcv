# Contributing to FreehandCV

Thanks for helping. FreehandCV is a free resume editor: no paywall, no account required to
download a PDF. Changes that put any of that behind a payment or a sign-up are not accepted.

## Before you start

- Read [AGENTS.md](AGENTS.md): project and design rules (English code, translation files,
  semantic colour tokens, no database queries in components).
- The plan and its decisions live in [docs/WEB-UYGULAMA-PLANI.md](docs/WEB-UYGULAMA-PLANI.md);
  public URLs and the data model follow it. [docs/GLOSSARY.md](docs/GLOSSARY.md) maps Turkish
  product terms to the English names used in code.
- For anything bigger than a small fix, open an issue first so we can agree on the approach.

## Setup

See [README.md](README.md#running-locally). Node 24, pnpm 10 and Docker are required.

## Making a change

1. Branch from `main`.
2. User-facing text goes in `messages/<locale>/<Namespace>.json` for every locale, never
   hard-coded in components.
3. Schema change: `pnpm db:generate`, review the generated SQL, commit it with the change.
4. Check before you push:
   ```bash
   pnpm typecheck && pnpm lint && pnpm test
   ```
5. Check the UI on a phone-width screen and a desktop, in light and dark theme. Phone and desktop
   are equally important here.
6. Open a pull request describing what changed and why; screenshots for UI changes.

## Translations

Adding a language: copy `messages/en/` to `messages/<locale>/`, translate the values (not the
keys), and register the locale in `src/i18n/`. Public URL slugs for a locale are fixed once
they go live, so propose them in the pull request.

## Resume templates

Templates are JSON design definitions validated by the engine; they never contain HTML or CSS.
This keeps every resume ATS-readable. Template contributions follow the same rule.
