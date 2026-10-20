"use client";

import { useEffect, useSyncExternalStore } from "react";
import { ResumeDocument } from "@/components/resume/ResumeDocument";
import { PDF_DATA_KEY, PDF_READY_ATTRIBUTE } from "@/lib/pdf";
import { systemDefinition } from "@/lib/resume/design";
import { normalizeResume, type ResumeData } from "@/lib/resume/schema";

// The injected resume never changes while the page is open: read once, nothing to subscribe to.
let injected: ResumeData | null | undefined;
const readInjected = () => {
  if (injected === undefined) {
    const raw = (window as unknown as Record<string, unknown>)[PDF_DATA_KEY];
    injected = raw ? normalizeResume(raw) : null;
  }
  return injected;
};
const subscribe = () => () => {};

export function PrintView() {
  const data = useSyncExternalStore(subscribe, readInjected, () => null);

  useEffect(() => {
    if (!data) return;
    let cancelled = false;
    // Two frames so the resume is laid out and its font faces are requested before waiting on them.
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        document.fonts.ready.then(() => !cancelled && document.body.setAttribute(PDF_READY_ATTRIBUTE, "")),
      ),
    );
    return () => {
      cancelled = true;
    };
  }, [data]);

  if (!data) return null;
  return (
    <>
      {/* Same page setup as printing from the editor: the paper size from the resume, no margins. */}
      <style>{`
        @page { size: ${data.settings.paper === "Letter" ? "letter" : "A4"}; margin: 0; }
        html, body, body > * { background: #fff !important; min-height: 0 !important; }
      `}</style>
      <ResumeDocument data={data} definition={systemDefinition(data.settings.template)} />
    </>
  );
}
