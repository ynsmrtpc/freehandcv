import { Fragment } from "react";
import { richTextParts } from "@/lib/resume/utils";

// Long-form text (example guides, plan 6.4): a blank line starts a paragraph, lines starting with
// "- " form a list, **bold**. No HTML is accepted, so admin-entered text cannot inject markup.

function Inline({ text }: { text: string }) {
  return (
    <>
      {richTextParts(text).map((p, i) =>
        p.bold ? (
          <strong key={i} className="font-semibold text-foreground">
            {p.text}
          </strong>
        ) : (
          <Fragment key={i}>{p.text}</Fragment>
        ),
      )}
    </>
  );
}

export function Prose({ text }: { text: string }) {
  return (
    <div className="space-y-4 text-[17px] leading-relaxed text-muted">
      {text.split(/\r?\n\s*\r?\n/).map((block, i) => {
        const lines = block
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean);
        if (!lines.length) return null;
        if (lines.every((l) => l.startsWith("- ")))
          return (
            <ul key={i} className="list-disc space-y-1.5 ps-6 marker:text-primary-text">
              {lines.map((l, j) => (
                <li key={j}>
                  <Inline text={l.slice(2)} />
                </li>
              ))}
            </ul>
          );
        return (
          <p key={i}>
            <Inline text={lines.join(" ")} />
          </p>
        );
      })}
    </div>
  );
}
