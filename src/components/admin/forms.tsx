"use client";

// Form pieces shared by the admin screens: labelled fields, inline notices and an action runner.
import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { cn } from "@/lib/cn";

export const adminInputClass =
  "block h-11 w-full rounded-lg border border-border-strong bg-surface px-3 text-base text-foreground outline-none placeholder:text-muted/80 focus:border-primary focus:ring-4 focus:ring-primary/15 disabled:opacity-60";

export function TextField({
  label,
  hint,
  className,
  ...input
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-[15px] font-semibold text-foreground">
        {label}
      </label>
      <input id={id} aria-describedby={hint ? `${id}-hint` : undefined} {...input} className={cn(adminInputClass, "mt-1.5")} />
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

export type Notice = { kind: "success" | "error"; text: string } | null;

export function InlineNotice({ notice }: { notice: Notice }) {
  if (!notice) return null;
  return (
    <p
      role={notice.kind === "error" ? "alert" : "status"}
      className={cn(
        "rounded-lg px-3 py-2 text-[15px] font-medium",
        notice.kind === "error" ? "bg-danger-soft text-danger" : "bg-accent-soft text-accent",
      )}
    >
      {notice.text}
    </p>
  );
}

type Result = { ok: true; message?: string } | { ok: false; error: string };

/** Runs a Server Action, shows its message and refreshes the server-rendered page on success. */
export function useAction() {
  const router = useRouter();
  const [notice, setNotice] = useState<Notice>(null);
  const [pending, startTransition] = useTransition();
  const run = (fn: () => Promise<Result>, onOk?: (r: Result) => void) =>
    startTransition(async () => {
      const r = await fn();
      setNotice(r.ok ? { kind: "success", text: r.message ?? "Kaydedildi." } : { kind: "error", text: r.error });
      if (r.ok) {
        onOk?.(r);
        router.refresh();
      }
    });
  return { notice, setNotice, pending, run };
}

