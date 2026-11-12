"use client";

import { Eye, PencilLine } from "lucide-react";
import { cn } from "@/lib/cn";

/** Shared phone navigation for both editors; stays clear of the device's home indicator. */
export function WorkspaceViewSwitch({
  value,
  onChange,
  labels,
}: {
  value: "edit" | "preview";
  onChange: (value: "edit" | "preview") => void;
  labels: { edit: string; preview: string };
}) {
  return (
    <div className="editor-chrome flex shrink-0 gap-2 border-t border-border bg-surface p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden">
      {(["edit", "preview"] as const).map((view) => (
        <button
          key={view}
          type="button"
          aria-pressed={value === view}
          onClick={() => onChange(view)}
          className={cn(
            "flex h-11 flex-1 items-center justify-center gap-2 rounded-lg text-base font-semibold transition-colors",
            value === view ? "bg-primary-soft text-primary-text" : "text-muted hover:bg-surface-2 hover:text-foreground",
          )}
        >
          {view === "edit" ? <PencilLine className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
          {labels[view]}
        </button>
      ))}
    </div>
  );
}
