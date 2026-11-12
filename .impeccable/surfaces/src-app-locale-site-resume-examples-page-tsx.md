---
version: 1
slug: "src-app-locale-site-resume-examples-page-tsx"
primary_target: "src/app/[locale]/(site)/resume-examples/page.tsx"
related_targets: ["src/components/examples/ExampleBrowser.tsx", "src/app/[locale]/(site)/resume-examples/[slug]/CategoryPage.tsx", "src/app/[locale]/(site)/resume-examples/[slug]/ExamplePage.tsx"]
---

# Resume examples

Inherit the established paper/ballpoint world. The directory is Operate: find the right profession
quickly, then inspect the real example. The detail page combines Read with an artifact-led preview.

Directory: compact aligned introduction, visible job search, real counts, desktop category sidebar,
native phone category selector, flat two-column example links. Search accepts Turkish letters and
their ASCII equivalents, combines with category filtering, and offers a clear reset/empty state.
Initial HTML includes every published example and category URL; no client-side fetch is needed.

Category pages reuse the browser within their own category and keep links to other category URLs.
Detail: plain title, profession context, one primary start action, and a real resume on its desk in
a second column. On phones the content stacks. Writing advice has a short jump link and one readable
left-aligned measure; the repeated start action is secondary. Resume data and public URLs stay intact.

No decorative assets or fabricated resume thumbnails are shipped. Browser verification uses the
90 repository drafts activated only in freehandcv_test, including the actual guest import flow.

Finish review: search (including uppercase/ASCII Turkish), combined category filters, reset and empty
states, category pages, real paper rendering, writing-advice anchors, dark theme, and guest import
passed at 320, 390, 768, 1024, and 1440px. All 90 example links remain present with JavaScript disabled.
Rendered desktop and phone views were reviewed against the established system. Verdict: ready for review.
