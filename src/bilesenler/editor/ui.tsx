"use client";

import { Check } from "lucide-react";
import { useId } from "react";
import { cn } from "@/ortak/cn";

const girdiSinifi =
  "block w-full rounded-lg border border-cizgi-guclu bg-yuzey px-3 text-[15px] text-metin placeholder:text-soluk/60 transition-[border-color,box-shadow] outline-none focus:border-ana focus:ring-4 focus:ring-ana/15 disabled:bg-yuzey-2 disabled:text-soluk";

export function Alan({
  etiket,
  ipucu,
  ek,
  yarim,
  children,
}: {
  etiket: string;
  ipucu?: React.ReactNode;
  ek?: React.ReactNode;
  yarim?: boolean;
  children: (id: string) => React.ReactNode;
}) {
  const id = useId();
  return (
    <div className={cn("min-w-0", yarim ? "col-span-1" : "col-span-2")}>
      <label htmlFor={id} className="mb-1.5 flex items-center justify-between gap-2 text-[13px] font-semibold text-metin">
        {etiket}
        {ek}
      </label>
      {children(id)}
      {ipucu && <p className="mt-1.5 text-xs leading-relaxed text-soluk">{ipucu}</p>}
    </div>
  );
}

export function Girdi(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input autoComplete="off" {...props} className={cn(girdiSinifi, "h-10", props.className)} />;
}

export function MetinAlani(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(girdiSinifi, "resize-y py-2 leading-relaxed", props.className)} />;
}

export function Onay({
  etiket,
  checked,
  onChange,
  disabled,
}: {
  etiket: string;
  checked: boolean;
  onChange: (d: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className={cn("flex min-h-10 cursor-pointer items-center gap-2.5 text-sm text-metin", disabled && "cursor-not-allowed opacity-50")}>
      <span className="relative grid size-5 place-items-center">
        <input
          type="checkbox"
          className="peer size-5 cursor-pointer appearance-none rounded-md border border-cizgi-guclu bg-yuzey transition-colors checked:border-ana checked:bg-ana disabled:cursor-not-allowed"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <Check className="pointer-events-none absolute size-3.5 text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} />
      </span>
      {etiket}
    </label>
  );
}

export function Segment<T extends string>({
  etiket,
  deger,
  secenekler,
  onChange,
}: {
  etiket: string;
  deger: T;
  secenekler: { deger: T; ad: string }[];
  onChange: (d: T) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-[13px] font-semibold text-metin">{etiket}</p>
      <div role="group" aria-label={etiket} className="inline-flex rounded-lg border border-cizgi-guclu bg-yuzey-2 p-0.5">
        {secenekler.map((s) => (
          <button
            key={s.deger}
            type="button"
            aria-pressed={deger === s.deger}
            onClick={() => onChange(s.deger)}
            className={cn(
              "h-8 rounded-md px-3 text-[13px] font-semibold transition-colors",
              deger === s.deger ? "bg-yuzey text-metin shadow-kart" : "text-soluk hover:text-metin",
            )}
          >
            {s.ad}
          </button>
        ))}
      </div>
    </div>
  );
}

export function IkonButon({
  etiket,
  children,
  tehlike,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { etiket: string; tehlike?: boolean }) {
  return (
    <button
      type="button"
      aria-label={etiket}
      title={etiket}
      {...props}
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-md text-soluk transition-colors hover:bg-yuzey-2 hover:text-metin disabled:pointer-events-none disabled:opacity-30",
        tehlike && "hover:bg-hata-acik hover:text-hata",
        className,
      )}
    >
      {children}
    </button>
  );
}
