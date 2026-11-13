"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { X } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import { useConfirm } from "@/components/ui/ConfirmProvider";
import { cn } from "@/lib/cn";

export type BulkResult = { ok: true; message?: string } | { ok: false; error: string };

export type BulkAction = {
  label: string;
  /** A Server Action that receives the selected ids. */
  run: (ids: string[]) => Promise<BulkResult>;
  danger?: boolean;
  /** Asked before running; `{n}` is replaced by the selection size. */
  confirm?: string;
};

type Ctx = {
  ids: string[];
  selected: Set<string>;
  toggle: (id: string) => void;
  toggleAll: () => void;
};
const SelectionContext = createContext<Ctx | null>(null);

/**
 * Wraps a server-rendered list: rows render <RowCheckbox>, the header renders <SelectAll>, and a
 * bar with the bulk actions appears at the bottom of the screen while something is selected.
 */
export function BulkSelection({
  ids,
  actions,
  noun,
  children,
}: {
  ids: string[];
  actions: BulkAction[];
  /** "sayfa", "örnek", "kullanıcı"… */
  noun: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const confirm = useConfirm();
  const [picked, setSelected] = useState<Set<string>>(new Set());
  const [notice, setNotice] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  // A new page of rows (filter, search, pagination) ignores ids that are no longer listed.
  const selected = useMemo(() => new Set([...picked].filter((id) => ids.includes(id))), [picked, ids]);

  const ctx = useMemo<Ctx>(
    () => ({
      ids,
      selected,
      toggle: (id) =>
        setSelected((s) => {
          const next = new Set(s);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        }),
      toggleAll: () => setSelected((s) => (s.size === ids.length ? new Set() : new Set(ids))),
    }),
    [ids, selected],
  );

  const run = async (action: BulkAction) => {
    const list = [...selected];
    if (action.confirm && !(await confirm(action.confirm.replace("{n}", String(list.length)), { danger: action.danger, confirmLabel: action.label })))
      return;
    startTransition(async () => {
      const r = await action.run(list);
      if (r.ok) {
        setSelected(new Set());
        setNotice({ kind: "success", text: r.message ?? "Tamamlandı." });
        router.refresh();
      } else setNotice({ kind: "error", text: r.error });
    });
  };

  return (
    <SelectionContext value={ctx}>
      {notice && (
        <p
          role={notice.kind === "error" ? "alert" : "status"}
          className={cn(
            "mb-4 flex items-center justify-between gap-3 rounded-lg px-4 py-3 text-[15px] font-medium",
            notice.kind === "error" ? "bg-danger-soft text-danger" : "bg-accent-soft text-accent",
          )}
        >
          {notice.text}
          <button type="button" onClick={() => setNotice(null)} aria-label="Bildirimi kapat" className="grid size-8 place-items-center rounded-md hover:bg-surface/60">
            <X className="size-4" aria-hidden />
          </button>
        </p>
      )}
      {children}
      {selected.size > 0 && (
        <div className="sticky bottom-0 z-30 -mx-4 mt-4 border-t border-border-strong bg-surface px-4 py-3 sm:-mx-8 sm:px-8" role="region" aria-label="Toplu işlemler">
          <div className="flex flex-wrap items-center gap-2">
            <p className="me-auto text-[15px] font-semibold text-foreground" aria-live="polite">
              {selected.size} {noun} seçildi
            </p>
            {actions.map((a) => (
              <button
                key={a.label}
                type="button"
                disabled={pending}
                onClick={() => void run(a)}
                className={buttonClass("secondary", "sm", a.danger ? "text-danger hover:border-danger/50" : undefined)}
              >
                {a.label}
              </button>
            ))}
            <button type="button" disabled={pending} onClick={() => setSelected(new Set())} className={buttonClass("ghost", "sm")}>
              Seçimi kaldır
            </button>
          </div>
        </div>
      )}
    </SelectionContext>
  );
}

function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error("Inside <BulkSelection> only");
  return ctx;
}

const boxClass = "size-[18px] cursor-pointer accent-[var(--primary)]";

export function RowCheckbox({ id, label }: { id: string; label: string }) {
  const { selected, toggle } = useSelection();
  return (
    // The label widens the hit area to 44px around the box.
    <label className="-m-3 inline-grid size-11 cursor-pointer place-items-center">
      <input type="checkbox" className={boxClass} checked={selected.has(id)} onChange={() => toggle(id)} aria-label={`Seç: ${label}`} />
    </label>
  );
}

export function SelectAll() {
  const { ids, selected, toggleAll } = useSelection();
  const ref = useRef<HTMLInputElement>(null);
  const all = ids.length > 0 && selected.size === ids.length;
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = selected.size > 0 && !all;
  }, [selected.size, all]);
  return (
    <label className="-m-3 inline-grid size-11 cursor-pointer place-items-center">
      <input ref={ref} type="checkbox" className={boxClass} checked={all} onChange={toggleAll} disabled={!ids.length} aria-label="Bu sayfadakilerin hepsini seç" />
    </label>
  );
}
