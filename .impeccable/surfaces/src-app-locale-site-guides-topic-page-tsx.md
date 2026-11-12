---
version: 1
slug: "src-app-locale-site-guides-topic-page-tsx"
primary_target: "src/app/[locale]/(site)/guides/[topic]/page.tsx"
related_targets: ["src/components/site/GuideReader.tsx", "src/blocks/Article.tsx", "src/app/[locale]/(site)/guides/page.tsx"]
---

# Guide reading surface

Mode: Read. Inherit the established paper-and-ballpoint world from DESIGN.md.

Task: understand practical CV advice and find the relevant section quickly, on phones and desktops.
The user's screenshot showed a marketing-size title, excess vertical space, and mismatched title/body
alignment. Keep CMS content, fixed URLs, structured data, and existing translations intact.

Implementation: one paper reading column, consistently aligned 30–36px title and 24px section headings,
17px prose, compact vertical rhythm, reading estimate and update date. A quiet desktop outline stays
beside the article; phones use a native disclosure. Heading anchors are shared with the outline and
remain unique across repeated headings and multiple article blocks. No entrance animations in reading
content. FAQ and closing action use the same measure. Related guides form a ruled list.

CMS preview renders the same GuideReader and passes the page kind through its existing message channel.
Other CMS page types retain their existing presentation. The guide index uses a compact introduction
and two readable columns on wider screens, with a single column on phones.

No raster assets are shipped on this surface. Verification uses real guide content in freehandcv_test.

Finish review: heading and prose alignment, unique outline targets, FAQ interactions, guide index,
light/dark themes, reduced motion, and overflow passed at 320, 390, 768, 1024, and 1440px. The review
also caught and fixed a 320px shared-header overflow once the signed-out account link loaded. Verdict:
ready for review, with the original content and SEO URLs retained.
