// Inline syntax of long-form text (src/components/site/Prose.tsx): **bold** and [text](/path).
// Pure, so it is unit-tested; the component only maps the parts to elements.
import { richTextParts } from "./resume/utils";

export type InlinePart = { kind: "text"; text: string } | { kind: "bold"; text: string } | { kind: "link"; text: string; href: string };

const LINK = /(\[[^\]\n]+\]\([^)\s]+\))/g;

/** Only links inside the site ("/…", not protocol-relative "//…") or to https:// addresses. */
export const isSafeHref = (href: string) => (href.startsWith("/") && !href.startsWith("//")) || href.startsWith("https://");

export function inlineParts(text: string): InlinePart[] {
  return String(text || "")
    .split(LINK)
    .filter(Boolean)
    .flatMap((part): InlinePart[] => {
      const m = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
      if (!m) return richTextParts(part).map((p) => ({ kind: p.bold ? "bold" : "text", text: p.text }));
      const [, label, href] = m;
      // An unsafe target (javascript:, http:, //host) keeps its label as plain text.
      return [isSafeHref(href) ? { kind: "link", text: label, href } : { kind: "text", text: label }];
    });
}
