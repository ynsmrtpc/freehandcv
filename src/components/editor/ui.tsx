"use client";

import { Check, MoreHorizontal } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const inputClass =
  "block w-full rounded-lg border border-border-strong bg-surface px-3 text-base text-foreground placeholder:text-muted/80 transition-[border-color,box-shadow] outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 disabled:bg-surface-2 disabled:text-muted";

export function Field({
  label,
  hint,
  extra,
  half,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  extra?: React.ReactNode;
  half?: boolean;
  children: (id: string) => React.ReactNode;
}) {
  const id = useId();
  return (
    <div className={cn("min-w-0", half ? "col-span-1" : "col-span-2")}>
      <label htmlFor={id} className="mb-1.5 flex items-center justify-between gap-2 text-[13px] font-semibold text-foreground">
        {label}
        {extra}
      </label>
      {children(id)}
      {hint && <p className="mt-1.5 text-xs leading-relaxed text-muted">{hint}</p>}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input autoComplete="off" {...props} className={cn(inputClass, "h-10", props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(inputClass, "resize-y py-2 leading-relaxed", props.className)} />;
}

export function Checkbox({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className={cn("flex min-h-10 cursor-pointer items-center gap-2.5 text-sm text-foreground", disabled && "cursor-not-allowed opacity-50")}>
      <span className="relative grid size-5 place-items-center">
        <input
          type="checkbox"
          className="peer size-5 cursor-pointer appearance-none rounded-md border border-border-strong bg-surface transition-colors checked:border-primary checked:bg-primary disabled:cursor-not-allowed"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <Check className="pointer-events-none absolute size-3.5 text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} />
      </span>
      {label}
    </label>
  );
}

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-[13px] font-semibold text-foreground">{label}</p>
      <div role="group" aria-label={label} className="inline-flex rounded-lg border border-border-strong bg-surface-2 p-0.5">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "h-8 rounded-md px-3 text-[13px] font-semibold transition-colors",
              value === o.value ? "bg-surface text-foreground shadow-card" : "text-muted hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function IconButton({
  label,
  children,
  danger,
  className,
  ...props
}: React.ComponentProps<"button"> & { label: string; danger?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...props}
      className={cn(
        // 44px on touch screens, compact where a mouse is the pointer.
        "grid size-11 shrink-0 place-items-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-foreground disabled:pointer-events-none disabled:opacity-30 pointer-fine:size-9",
        danger && "hover:bg-danger-soft hover:text-danger",
        className,
      )}
    >
      {children}
    </button>
  );
}

export type RowMenuItem = {
  label: string;
  icon: React.ReactNode;
  onSelect: () => void;
  disabled?: boolean;
  danger?: boolean;
};

/**
 * "More actions" for a row: one labelled menu instead of a cluster of small icon buttons, so a
 * thumb cannot move or delete an entry by accident. Keyboard: arrows move, Escape closes.
 */
export function RowMenu({ label, items }: { label: string; items: RowMenuItem[] }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    rootRef.current?.querySelector<HTMLButtonElement>("[role=menuitem]:not(:disabled)")?.focus();
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  };

  const onMenuKey = (e: React.KeyboardEvent) => {
    const enabled = [...(rootRef.current?.querySelectorAll<HTMLButtonElement>("[role=menuitem]:not(:disabled)") ?? [])];
    const i = enabled.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = (i + (e.key === "ArrowDown" ? 1 : -1) + enabled.length) % enabled.length;
      enabled[next]?.focus();
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <IconButton
        ref={buttonRef}
        label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        <MoreHorizontal className="size-[18px]" />
      </IconButton>
      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKey}
          className="absolute end-0 top-full z-30 mt-1 w-56 rounded-lg border border-border-strong bg-surface p-1 shadow-elevated"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              onClick={() => {
                close(false);
                item.onSelect();
              }}
              className={cn(
                "flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-start text-[15px] font-medium text-foreground hover:bg-surface-2 focus-visible:bg-surface-2 disabled:opacity-35 pointer-fine:min-h-9",
                item.danger && "text-danger hover:bg-danger-soft focus-visible:bg-danger-soft",
              )}
            >
              <span className="text-muted [&>svg]:size-4" aria-hidden>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
