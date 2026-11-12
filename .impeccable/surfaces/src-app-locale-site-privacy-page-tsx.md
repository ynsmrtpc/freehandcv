---
version: 1
slug: "src-app-locale-site-privacy-page-tsx"
primary_target: "src/app/[locale]/(site)/privacy/page.tsx"
related_targets: ["src/components/site/ReadingLayout.tsx", "src/components/site/CmsPage.tsx", "src/app/[locale]/(site)/support/page.tsx", "src/app/[locale]/(site)/is-it-free/page.tsx"]
---

# CMS documents and subpage consistency

Mode: Read. Preserve the established cool-paper/ballpoint world, all factual copy, public URLs,
and CMS publishing boundaries. Privacy is a document rather than a sequence of marketing sections.

Shared implementation: ReadingLayout provides a single 30–36px title, 24px section headings, 17px
prose, one aligned paper column, desktop outline and native mobile disclosure. Document pages do
not borrow guide-specific labels or metadata. Rich text, lists, and links remain semantic and visible
without entrance animations. Support/donation blocks use the same width and compact spacing.

The wider subpage pass harmonized catalogue headings/gutters, template cards, profile wrapping,
auth/account surfaces, and touch controls. Existing guide/example layouts retain their behavior.

Finish: 90 route/viewport checks passed with real isolated test fixtures, Turkish/English routes,
private sessions, light/dark themes, and reduced motion. Desktop/mobile screenshots were inspected.
Source and validation scope are recorded in docs/SUBPAGE-UI-AUDIT.md. Verdict: ready for review.
No raster assets ship on these surfaces.
