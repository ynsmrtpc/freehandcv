"use client";

import { TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { buttonClass } from "./Button";

type Options = { danger?: boolean; title?: string; confirmLabel?: string };
type Confirm = (message: string, options?: Options) => Promise<boolean>;
type Request = { message: string; options: Options; resolve: (confirmed: boolean) => void; trigger: HTMLElement | null };
const ConfirmContext = createContext<Confirm | null>(null);

/** App-owned confirmations; the browser dialog primitive supplies focus trapping and background inertness. */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const t = useTranslations("Confirmation");
  const [request, setRequest] = useState<Request | null>(null);
  const active = useRef<Request | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const id = useId();

  const confirm = useCallback<Confirm>((message, options = {}) => {
    // A repeated activation must not replace an unanswered request or run a destructive action twice.
    if (active.current) return Promise.resolve(false);
    return new Promise((resolve) => {
      const focused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      // Menus close before their action runs. Return focus to the surviving menu trigger.
      const trigger = focused?.closest('[role="menu"]')?.parentElement?.querySelector<HTMLElement>('button[aria-haspopup="menu"]')
        ?? focused?.closest("details")?.querySelector<HTMLElement>("summary")
        ?? focused;
      const next = { message, options, resolve, trigger };
      active.current = next;
      setRequest(next);
    });
  }, []);

  const finish = useCallback((confirmed: boolean) => {
    const current = active.current;
    if (!current) return;
    active.current = null;
    dialog.current?.close();
    setRequest(null);
    current.trigger?.focus();
    current.resolve(confirmed);
  }, []);

  useEffect(() => {
    if (!request) return;
    dialog.current?.showModal();
    cancelButton.current?.focus();
  }, [request]);

  useEffect(() => () => {
    active.current?.resolve(false);
    active.current = null;
  }, []);

  return (
    <ConfirmContext value={confirm}>
      {children}
      {request && (
        <dialog
          ref={dialog}
          role="alertdialog"
          aria-labelledby={`${id}-title`}
          aria-describedby={`${id}-message`}
          onCancel={(event) => { event.preventDefault(); finish(false); }}
          onClose={() => finish(false)}
          onKeyDown={(event) => {
            if (event.key !== "Tab") return;
            const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)");
            const first = buttons[0];
            const last = buttons[buttons.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first?.focus();
            }
          }}
          className="m-auto w-[min(440px,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-xl border border-border-strong bg-surface p-5 text-foreground shadow-elevated backdrop:bg-foreground/40 sm:p-6"
        >
          <div className="flex items-center gap-3">
            {request.options.danger && <TriangleAlert className="size-5 shrink-0 text-danger" aria-hidden />}
            <h2 id={`${id}-title`} className="text-xl font-bold">{request.options.title ?? t(request.options.danger ? "deleteTitle" : "title")}</h2>
          </div>
          <p id={`${id}-message`} className="mt-3 break-words text-base leading-relaxed text-muted">{request.message}</p>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <button ref={cancelButton} type="button" onClick={() => finish(false)} className={buttonClass("secondary")}>
              {t("cancel")}
            </button>
            <button type="button" onClick={() => finish(true)} className={buttonClass("primary", "md", request.options.danger ? "bg-danger text-surface hover:bg-danger/90" : undefined)}>
              {request.options.confirmLabel ?? t(request.options.danger ? "delete" : "continue")}
            </button>
          </div>
        </dialog>
      )}
    </ConfirmContext>
  );
}

export function useConfirm() {
  const confirm = useContext(ConfirmContext);
  if (!confirm) throw new Error("useConfirm requires ConfirmProvider");
  return confirm;
}
