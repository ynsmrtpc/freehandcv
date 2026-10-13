"use client";

import { Check } from "lucide-react";
import { useId } from "react";
import { cn } from "@/lib/cn";

const inputClass =
  "block w-full rounded-lg border border-border-strong bg-surface px-3 text-[15px] text-foreground placeholder:text-muted/60 transition-[border-color,box-shadow] outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 disabled:bg-surface-2 disabled:text-muted";

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
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string; danger?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...props}
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-foreground disabled:pointer-events-none disabled:opacity-30",
        danger && "hover:bg-danger-soft hover:text-danger",
        className,
      )}
    >
      {children}
    </button>
  );
}
