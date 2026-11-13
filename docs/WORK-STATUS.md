# Work status — 12 November 2026

## Where work stopped

The latest committed feature work covers accounts, resume history, PDF generation, user templates,
the template gallery, public profiles, and password reset. The product plan's phase headings lag
behind that implementation. The repository contains 90 Turkish example drafts and 10 guide drafts;
having files does not mean that they have been reviewed or published in a live CMS.

The most recent design direction is recorded in
`.impeccable/surfaces/src-app-locale-site-page-tsx.md`: plain public-service structure and paper
identity. The palette, Atkinson font, ink marks, and landing components were already implemented.
The missing handoff was application usability, responsive review, and durable design documentation.

## This continuation

- Dashboard and template lists: larger, flat preview cards, readable metadata, explicit edit links,
  and keyboard-accessible secondary action menus. Actions no longer depend on hovering.
- Empty resume dashboard: a single primary start action, with duplicate submission disabled.
- CV editor: readable phone toolbar with a separate action row; the file menu stays inside narrow
  viewports. PDF download remains the primary action.
- Both editors: shared edit/preview navigation with a bottom safe area, larger fields and controls.
- Template editor: ruled groups and readable headings, a named document heading, blank-name save
  disabled, and a browser leave warning for changes to new templates as well as existing ones.
- `DESIGN.md` records the implemented design system; `AGENTS.md` now names the font actually used.
- Impeccable guidance was read from the upstream repository in a temporary directory. No global
  skill installation, plugin connection, or hook configuration was changed.
- Browser confirmations were replaced with a shared translated alert dialog for deletions and
  content-replacing actions throughout the app and admin panel. Cancel, Escape, focus containment,
  focus return, deletion, and undo were verified in the guest editor at all three tested widths.
- `admin:create` no longer imports the web auth configuration (which pulled client-side intl code
  into the React server runtime). It uses Better Auth's password hash directly, creates user and
  credentials in one transaction, normalizes email, and preserves existing-account passwords.
- Guide pages now use a dedicated reading layout: aligned compact headings, a narrower paper
  column, reading estimate/update date, desktop outline and phone disclosure navigation, compact
  FAQ and related-guide list. The index and CMS guide preview use the same presentation rules.
  Browser checks passed at 320, 390, 768, 1024, and 1440px in light/dark themes. A shared-header
  overflow on narrow phones was corrected. Existing CMS content does not need to be seeded again.
- Example directory and category pages now have compact introductions and searchable profession
  lists. Categories use a desktop sidebar and native phone selector, with real counts, reset, and
  empty-result feedback. Example details place the primary start action beside the real resume
  preview on desktop and above it on phones; writing advice is directly linked and left-aligned.
  All five viewport checks passed, including Turkish/ASCII search, dark theme, real guest import,
  and server-rendered example links with JavaScript disabled. Existing published content is reused.
- Public/account subpages were reviewed as a system, starting with privacy. Shared `ReadingLayout`
  now serves guides and CMS documents; catalogues, template details, profiles, auth/account surfaces,
  and recovery states follow consistent sizing and gutters. All 90 route/viewport checks passed.
  Detailed coverage and limits: `docs/SUBPAGE-UI-AUDIT.md`.

## Release work that needs external setup

These are open tasks, not features that this UI pass has completed:

- Set up the aaPanel server and PostgreSQL (docs/DEPLOY-AAPANEL.md); supply production secrets, OAuth configuration, email
  credentials, and domain/DNS settings. Never use real user data in test runs.
- Build and run the Docker image against `freehandcv_test`; exercise server PDF generation with
  Alpine Chromium, selectable text, A4/Letter, and long multi-page content.
- On deployment, verify Turkish rewrites as well as English routes behind the real reverse proxy.
  A development server bound to `127.0.0.1` reproduced a host/rewrite redirect loop; the existing
  server bound to `localhost` serves the Turkish editor correctly. No URL mapping was changed.
- Configure Umami and Search Console; publish reviewed examples and guides through the CMS.
- Complete the privacy draft's organization/contact placeholders with the actual operator details
  and arrange the review already requested in the product plan.
- Choose the donation channel; do not invent bank details or payment links.

## Planned work, not unfinished implementation

The ATS checker route, expansion from 90 to 200+ examples, and language waves beyond Turkish/English
remain roadmap items. Choose new example topics using search data once available. Canva import is
still a feasibility request; see `CANVA-IMPORT.md`. AI tailoring and cover letters remain ideas.

## Verification scope

TypeScript and lint passed; all 152 unit tests passed. Browser checks passed at 320px, 390px, and
1440px, covering undo/redo, guest persistence after reload, content-tab keyboard navigation,
edit/preview switching, file-menu bounds, secondary-menu keyboard focus, and horizontal overflow.
English dark mode and reduced-motion settings were included. A visual review of the screenshots
confirmed the existing paper identity and readable control hierarchy. Verdict: the application UI
changes are ready for review; production release still needs the external checks above.
Browser reviews of authenticated list components use temporary synthetic fixtures with the real
components; they do not establish database, authorization, or account-mutation coverage. The fixture
routes are removed after review. This pass does not claim a production deployment or Docker PDF test.
