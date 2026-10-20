// Initial landing blocks (plan 6.3 order). Used when seeding the database and as a fallback in a
// build environment without database access. In production the content changes from the admin panel.
// Anchors (`#templates`, `#faq` …) are English in every locale, so in-page links read the same everywhere.
import en from "../../messages/en";
import tr from "../../messages/tr";
import { DEFAULT_BLOCK_SETTINGS, type Block } from "./blocks";

const settings = (extra: Partial<Block["settings"]> = {}) => ({ ...DEFAULT_BLOCK_SETTINGS, ...extra });

export function defaultLandingBlocks(locale: "tr" | "en"): Block[] {
  const L = (locale === "tr" ? tr : en).Landing;
  const createResume = locale === "tr" ? "/cv-olustur" : "/en/create-resume";
  const root = locale === "tr" ? "/" : "/en";
  return [
    {
      id: "hero",
      type: "hero",
      settings: settings(),
      content: {
        badge: L.hero.badge,
        title: L.hero.title.replace(/<highlight>(.*?)<\/highlight>/g, "**$1**"),
        subtitle: L.hero.subtitle,
        primaryButton: { label: L.hero.primaryButton, href: createResume },
        secondaryButton: { label: L.hero.secondaryButton, href: `${root === "/" ? "" : root}#templates` },
        bullets: L.hero.bullets,
      },
    },
    // Order (UX + SEO): how it works right after the promise; examples (internal links to every
    // example page) above templates; the "why free" comparison once the product has been seen; social
    // proof and FAQ (FAQPage data) just before the final call. Backgrounds alternate for rhythm.
    { id: "steps", type: "steps", settings: settings({ anchor: "how-it-works" }), content: L.steps },
    {
      id: "examples",
      type: "example_showcase",
      settings: settings({ anchor: "resume-examples", background: "subtle" }),
      content: { eyebrow: L.examples.eyebrow, title: L.examples.title, description: L.examples.description, count: "6" },
    },
    {
      id: "templates",
      type: "template_showcase",
      settings: settings({ anchor: "templates" }),
      content: {
        eyebrow: L.templates.eyebrow,
        title: L.templates.title,
        description: L.templates.description,
        cardButton: L.templates.cardButton,
      },
    },
    { id: "comparison", type: "comparison", settings: settings({ anchor: "comparison", background: "subtle" }), content: L.comparison },
    { id: "features", type: "features", settings: settings(), content: L.features },
    {
      id: "reviews",
      type: "reviews",
      settings: settings({ anchor: "reviews", background: "subtle" }),
      content: { eyebrow: L.testimonials.eyebrow, title: L.testimonials.title, count: "6" },
    },
    { id: "faq", type: "faq", settings: settings({ anchor: "faq" }), content: L.faq },
    {
      id: "cta",
      type: "cta",
      settings: settings(),
      content: { title: L.cta.title, text: L.cta.text, button: { label: L.cta.button, href: createResume } },
    },
  ];
}
