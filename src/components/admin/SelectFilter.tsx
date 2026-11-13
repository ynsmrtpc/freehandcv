"use client";

import { useRouter } from "next/navigation";
import { useId } from "react";

/** A dropdown filter that lives in the URL: changing it navigates to `hrefFor(value)`. */
export function SelectFilter({
  label,
  value,
  options,
  hrefs,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  /** Target URL per option value (computed on the server). */
  hrefs: Record<string, string>;
}) {
  const router = useRouter();
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-[15px] font-semibold text-foreground">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => router.push(hrefs[e.target.value])}
        className="h-11 rounded-lg border border-border-strong bg-surface px-3 text-base text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 pointer-fine:h-10 pointer-fine:text-[15px]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
