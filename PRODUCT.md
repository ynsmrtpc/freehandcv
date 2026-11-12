# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Anyone looking for a job, across the whole labour market: cashiers, security guards, call-centre
agents, office staff, engineers, lawyers. Most of them write a resume once a year or less, under
time pressure, with mixed comfort with technology. Turkish speakers first, English second
(more languages come in waves, plan section 8).

Device use is split roughly half and half between phone and computer. Neither is secondary:
the editor must be fully usable on a phone, and the desktop must not feel like a stretched phone.

Secondary audiences (confirmed in the plan, not interviewed):
- Template authors who design and share templates in the gallery.
- The admin/editor team that runs the public site through the block CMS.

## Product Purpose

Help a person produce a good-looking, ATS-readable resume and download it as a PDF, for free,
without being tricked into a paywall. Success: the visitor leaves with a PDF they are proud of,
and comes back to update it instead of starting over elsewhere.

## Positioning

- **100% free, PDF included.** No paid plan, no trial, no card, no watermark. Income is donations
  only; ad slots exist in the code but are off by default. Competitors typically reveal a paywall
  at the download step; FreehandCV never does.
- **No account needed** to write and download. An account adds cloud save, multiple resumes,
  version history, templates and sharing; a guest resume is imported on sign-up.
- **One rendering engine, data-only templates.** Templates are a validated JSON design definition,
  never user HTML/CSS, so every template produces the same semantic, ATS-readable HTML and
  selectable PDF text.
- **Community templates:** private / link / public templates, gallery with Bayesian ratings,
  copy-and-edit, owner shown by @username.

## Operating Context

- Public site (indexed): landing, resume examples (90 Turkish, target 200+), guides, template
  gallery and pages, user profiles, "is it free", support, privacy. Content is edited in the
  admin block CMS; URLs are fixed for SEO and never change after launch.
- App (noindex): guest editor (`/cv-olustur`, localStorage), dashboard (my resumes, trash,
  sharing card), resume editor with autosave and version history, visual template editor,
  "My templates", account (data export, account closure).
- Admin: pages, examples, reviews, users, settings, audit log; TOTP protected.
- PDF: browser print (phase 1) and server-side Playwright PDF (phase 2).
- Planned: import from Canva (exported PDF/PPTX → resume fields), `/ats-cv-kontrolu` tool,
  cover letters, AI tailoring to a job posting (idea stage).

## Capabilities and Constraints

- Next.js 16 (Cache Components), next-intl, Drizzle + PostgreSQL, Better Auth. Logic lives in
  `src/server/`; components never query the database.
- All user-facing text lives in `messages/<locale>/*.json`; code and keys are English
  (`docs/GLOSSARY.md`). RTL must keep working (the engine uses logical properties).
- Colours only through semantic tokens in `globals.css`, each with a light and a dark value;
  raw hex only inside the resume paper. Buttons via `buttonClass()`.
- Content is never hidden waiting for JavaScript; the LCP heading renders without animation.
  Motion (`motion/react`, `LazyMotion` + `m`) only for interactive parts; no `layout`/`layoutId`.
- The resume paper itself (`src/components/resume/`) is output, not UI: its look comes from the
  template definition and must stay print- and ATS-safe.
- Limits: 100 resumes per account; trash keeps deleted resumes 30 days.

## Brand Commitments

- Name **FreehandCV** (domain freehandcv.com, one `.com` with language prefixes). Former working
  name: Özgeçmiş Stüdyo.
- Voice: plain, friendly Turkish using "sen"; honest about being free.
- The visual system (font, palette, components) is not a binding commitment and may be replaced
  in the redesign; the rules in `AGENTS.md` describe the current implementation.

## Evidence on Hand

- Real content: 90 Turkish example resumes (`content/examples/tr`), 10 guides
  (`content/guides/tr`), site reviews collected in the app (`siteReviews`).
- No testimonials, user counts, press, or benchmarks exist yet; the site is not live.
  Do not invent them.

## Product Principles

1. **Never make the user pay or wait for what was promised free.** No dark patterns, no fake
   urgency, no gated download.
2. **Work for the once-a-year user.** Every screen must be obvious to someone who has never
   built a resume and will not read instructions.
3. **Phone and desktop are equals.** A feature is not done until it works on both.
4. **The resume stays ATS-safe.** Visual freedom lives in the template definition, never in
   free-form markup.
5. **Guests first, accounts as a bonus.** Signing up adds value; it is never required to finish.

## Accessibility & Inclusion

- Mixed tech literacy and many first-time users: clear labels, visible states, forgiving undo
  (trash, version history), no reliance on hover alone.
- Touch targets sized for phones; reduced motion respected everywhere; light and dark themes.
- Multilingual including future RTL languages.
