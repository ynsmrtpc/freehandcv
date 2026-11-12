# Subpage UI review — 12 November 2026

## Scope and resulting system

The public subpages and account screens were reviewed together after the guide and example-page
passes. The main recurring defect was landing-page composition on reading surfaces: large headings,
inconsistent measures, and repeated section gutters. Privacy, support, and the free-product
explanation now share `ReadingLayout` with guides. Text remains in the CMS, and the legal copy,
placeholders, publishing rules, metadata, and URLs were preserved.

The reading layout provides one paper column, aligned compact headings, semantic prose, desktop
section navigation, and a native mobile disclosure. Donation and closing-action blocks have compact
reading variants. The guide wrapper supplies its own reading estimate and related-guide links;
legal documents have neither guide-specific metadata nor guide navigation. CMS preview uses the
same layout based on the page kind and slug.

Public catalogues use the same title scale and gutters. Template previews are larger and flat,
filter controls meet touch sizing, and long names cannot widen a grid track. Profiles wrap long
usernames. Auth forms and account sections use resting paper surfaces. Account navigation now
includes the account page; section accessible names use stable IDs rather than translated titles.

The logged-in mobile CV toolbar was also corrected: the account menu sits in the first row and
the PDF label can shrink within the action row. Error and missing-content pages have localized
recovery controls and semantic colors. The error boundary follows this installed Next.js version's
`retry()` API.

## Browser coverage

All browser work used `freehandcv_test`. A temporary user, credential, resume, and three templates
were created to test private screens and long content. Privacy drafts were exposed only on that
local test database for the review; no development/production content was published.

| Surface | Paths / states checked |
| --- | --- |
| Privacy | Turkish and English, all section anchors, light and dark |
| Support and free-product explanation | Turkish and English CMS content |
| Template gallery | Official/community entries, long names, filter controls, real previews |
| Template detail | Turkish/English official template pages |
| Public profile | Turkish/English profile with long username and public templates |
| Guides | Index and published article, preserving the preceding redesign |
| Examples | Index, category, and profession detail, preserving the preceding redesign |
| Authentication | Sign-in, sign-up, password-reset request, invalid reset link |
| Account | Signed-in Turkish/English forms, navigation, accessible section names |
| Dashboard | Signed-in resumes and own-template lists, English dashboard |
| Editors | Existing resume, new template, and existing private template |
| Missing content | Localized missing-template state in Turkish and English |

The full route matrix ran at 320px and 1440px. Privacy, support, the free-product explanation,
template gallery/detail, and account also ran at 390px, 768px, and 1024px. In total, 90 route/viewport
combinations passed: rendered headings, single public-page h1, maximum heading size, horizontal
overflow, section targets, and client errors. Dark theme and reduced-motion settings were included.
Screenshots of the key desktop/mobile surfaces were inspected. The tests revealed and resolved
mobile gallery overflow from long names and a logged-in editor toolbar overflow.

## Limits and handoff

- TypeScript, lint, and all 152 unit tests passed.
- Account forms were rendered with a real test session; destructive account operations were not
  invoked during this visual pass.
- CMS preview and the generic error fallback were checked in source/type validation. The public
  missing-content fallback was exercised in the browser.
- Admin moderation screens, production deployment, and PDF output are separate from this subpage
  visual review. Their authorization and rendering logic were not changed.
- Verdict: public/account subpage presentation is ready for review. The existing privacy draft
  still contains its original operator placeholders; this pass changes presentation only.

Temporary account/template fixtures were removed after verification, and test privacy pages were
returned to draft. No new asset files or raster illustrations ship with this change.
