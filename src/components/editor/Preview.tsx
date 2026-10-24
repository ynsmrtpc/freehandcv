"use client";

import { Maximize2, Minus, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ResumeDocument } from "@/components/resume/ResumeDocument";
import { useEditor } from "@/client/editor/store";
import { cn } from "@/lib/cn";
import { PAPER_SIZES, resumeDefinition } from "@/lib/resume/design";
import { IconButton } from "./ui";

type Block = { el: Element; top: Element };

/**
 * Blocks that don't split when printing: short entries, bullets, list items and "heading + first block".
 * A block that crosses a page boundary counts as pushed to the next page, as in print.
 */
function unbreakableBlocks(root: Element): Block[] {
  const l: Block[] = [];
  root.querySelectorAll(".resume-section").forEach((section) => {
    const parts: Element[] = [];
    Array.from(section.children).forEach((c) => {
      if (c.tagName === "H2") return;
      if (c.classList.contains("resume-entry") && !c.classList.contains("short")) {
        parts.push(c.querySelector(".resume-entry-head") ?? c);
        c.querySelectorAll(":scope > p, :scope > ul > li").forEach((x) => parts.push(x));
      } else if (c.matches(".resume-list, .resume-references, .resume-skills-grid, .resume-skills-flow, .resume-paragraphs")) {
        Array.from(c.children).forEach((x) => parts.push(x));
      } else if (c.matches(".resume-skills")) {
        c.querySelectorAll("dd").forEach((x) => parts.push(x));
      } else parts.push(c);
    });
    const h2 = section.querySelector(":scope > h2");
    parts.forEach((p, i) => l.push({ el: p, top: i === 0 && h2 ? h2 : p }));
    if (!parts.length && h2) l.push({ el: h2, top: h2 });
  });
  return l;
}

export function Preview() {
  const t = useTranslations("Editor");
  const locale = useLocale();
  const data = useEditor((s) => s.data)!;
  const definition = resumeDefinition(data);
  const paper = PAPER_SIZES[data.settings.paper];

  const canvasRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [zoomState, setZoomState] = useState<{ mode: "fit" | "manual"; value: number }>({ mode: "fit", value: 1 });
  const [breaks, setBreaks] = useState<number[]>([]);
  const pageCount = useEditor((s) => s.pageCount);

  // Fit to screen: paper width (mm → px at 96 dpi) relative to the canvas width.
  const fit = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const paperPx = (paper.width * 96) / 25.4;
    const value = Math.max(0.3, Math.min(1.25, (canvas.clientWidth - 48) / paperPx));
    setZoomState((z) => (z.mode === "fit" ? { mode: "fit", value } : z));
  }, [paper.width]);

  useEffect(() => {
    fit();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(fit);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [fit]);

  const measure = useCallback(() => {
    const page = pageRef.current;
    const resume = page?.querySelector<HTMLElement>(".resume");
    const content = page?.querySelector(".resume-content");
    if (!page || !resume || !content) return;
    resume.style.minHeight = "";
    const pxPerMm = page.getBoundingClientRect().width / paper.width;
    if (!pxPerMm) return;
    const contentHeight = paper.height - definition.margins.top - definition.margins.bottom;
    const origin = content.getBoundingClientRect().top;
    const mm = (y: number) => (y - origin) / pxPerMm;
    const next: number[] = [];
    let shift = 0;
    let limit = contentHeight;
    const main = content.querySelector(".resume-main") ?? content;
    for (const b of unbreakableBlocks(main)) {
      const top = mm(b.top.getBoundingClientRect().top);
      const bottom = mm(b.el.getBoundingClientRect().bottom);
      while (bottom + shift > limit + 0.3) {
        if (top + shift < limit && bottom - top < contentHeight) {
          next.push(top);
          shift += limit - (top + shift);
        } else next.push(limit - shift);
        limit += contentHeight;
      }
    }
    const total = mm(content.getBoundingClientRect().bottom) + shift;
    const count = Math.max(1, next.length + 1, Math.ceil((total - 0.5) / contentHeight));
    // The page grows by the gap pushed blocks leave behind; the last page shows in full on screen.
    resume.style.minHeight = `${count * paper.height}mm`;
    setBreaks(next);
    if (useEditor.getState().pageCount !== count) useEditor.setState({ pageCount: count });
  }, [paper, definition]);

  useLayoutEffect(() => {
    measure();
  }, [data, zoomState.value, measure]);

  useEffect(() => {
    document.fonts?.ready.then(measure);
  }, [measure]);

  const zoom = (delta: number) =>
    setZoomState((z) => ({ mode: "manual", value: Math.max(0.3, Math.min(2, +(z.value + delta).toFixed(2))) }));

  return (
    <div className="preview-root flex h-full min-h-0 flex-col">
      <div className="preview-bar flex h-12 shrink-0 items-center justify-between gap-2 border-b border-border bg-surface px-3">
        <p className={cn("text-[13px] font-medium", pageCount > 2 ? "text-warning" : "text-muted")} aria-live="polite">
          {t("page.info", { paper: data.settings.paper, n: pageCount })}
          {pageCount > 2 && <span className="hidden sm:inline"> — {t("page.tooLong")}</span>}
        </p>
        <div className="flex items-center gap-0.5">
          <IconButton label={t("toolbar.zoomOut")} onClick={() => zoom(-0.1)}>
            <Minus className="size-4" />
          </IconButton>
          <span className="w-12 text-center text-[13px] font-medium text-muted tabular-nums">
            {new Intl.NumberFormat(locale, { style: "percent" }).format(zoomState.value)}
          </span>
          <IconButton label={t("toolbar.zoomIn")} onClick={() => zoom(0.1)}>
            <Plus className="size-4" />
          </IconButton>
          <IconButton
            label={t("toolbar.fit")}
            aria-pressed={zoomState.mode === "fit"}
            onClick={() => {
              setZoomState({ mode: "fit", value: zoomState.value });
              requestAnimationFrame(fit);
            }}
          >
            <Maximize2 className="size-4" />
          </IconButton>
        </div>
      </div>

      <div ref={canvasRef} className="preview-canvas min-h-0 flex-1 overflow-auto bg-[#dfe3ea] dark:bg-[#0a0f1a]">
        <div className="print-area mx-auto w-fit p-6" style={{ zoom: zoomState.value }}>
          <div ref={pageRef} className="relative bg-white shadow-paper">
            <ResumeDocument data={data} definition={definition} />
            <div className="page-guides pointer-events-none absolute inset-0" aria-hidden>
              {breaks.map((y, i) => (
                <div
                  key={i}
                  className="absolute inset-x-0 border-t-2 border-dashed border-primary/60"
                  style={{ top: `${(definition.margins.top + y).toFixed(1)}mm` }}
                >
                  <span className="absolute end-1 -top-[1.6em] rounded bg-primary px-1.5 py-0.5 font-sans text-[11px] font-semibold text-white">
                    {t("page.next", { n: i + 2 })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
