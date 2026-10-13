"use client";

import { useEffect, useState } from "react";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { BlockRenderer } from "@/blocks/BlockRenderer";
import type { Block } from "@/lib/blocks";

export function PreviewFrame() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.type !== "freehandcv-preview") return;
      // Show half-filled blocks even when validation fails; only the shape is checked.
      if (Array.isArray(e.data.blocks)) setBlocks(e.data.blocks as Block[]);
      setSelected(typeof e.data.selected === "string" ? e.data.selected : null);
    };
    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: "freehandcv-preview-ready" }, window.location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (!selected) return;
    document.querySelector(`[data-block="${CSS.escape(selected)}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selected]);

  // Never used as persistent data; only filters out malformed messages.
  const valid = Array.isArray(blocks) && blocks.every((b) => b && typeof b === "object" && "type" in b);

  return (
    <MotionProvider>
      {selected && (
        <style>{`[data-block="${selected.replace(/[^a-z0-9]/gi, "")}"]{outline:3px solid var(--primary);outline-offset:-3px}`}</style>
      )}
      <main
        className="min-h-dvh bg-background [&_[data-block]]:cursor-pointer"
        onClickCapture={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest("a")) e.preventDefault();
          const block = target.closest<HTMLElement>("[data-block]");
          if (block?.dataset.block)
            window.parent.postMessage({ type: "freehandcv-preview-select", id: block.dataset.block }, window.location.origin);
        }}
      >
        {valid && <BlockRenderer blocks={blocks} preview context={{ donationUrl: "#" }} />}
      </main>
    </MotionProvider>
  );
}
