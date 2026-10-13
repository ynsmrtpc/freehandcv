"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

/** A4 width in CSS pixels (96 dpi). */
const PAPER_PX = (210 * 96) / 25.4;

/**
 * Fits a full-size paper to its container's width with `zoom`. Server HTML arrives with
 * `initialScale` (visible without JS); in the browser the container is measured and the scale fixed.
 * The scale is written straight to the DOM: resizing triggers no React re-render.
 */
export function ScaledPaper({ children, initialScale }: { children: ReactNode; initialScale: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const box = el?.parentElement;
    if (!el || !box) return;
    const measure = () => {
      const w = box.clientWidth;
      if (w) el.style.zoom = String(w / PAPER_PX);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ zoom: initialScale, width: "210mm" }}>
      {children}
    </div>
  );
}
