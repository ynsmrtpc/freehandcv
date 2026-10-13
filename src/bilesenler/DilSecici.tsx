"use client";

import { ChevronDown, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/ortak/cn";

const dilAdlari = { tr: "Türkçe", en: "English" } as const;

// Yerel <select>: klavye, ekran okuyucu ve mobil seçici kendiliğinden çalışır.
export function DilSecici({ className }: { className?: string }) {
  const t = useTranslations("Site");
  const dil = useLocale();
  const router = useRouter();
  const yol = usePathname();
  const params = useParams();
  const [bekliyor, gecis] = useTransition();

  return (
    <label
      className={cn(
        "relative flex h-10 items-center gap-1.5 rounded-xl ps-2.5 pe-2 text-sm font-medium text-soluk transition-colors focus-within:text-metin hover:bg-yuzey-2 hover:text-metin",
        className,
      )}
    >
      <Globe className="size-[18px]" aria-hidden />
      <span className="uppercase">{dil}</span>
      <ChevronDown className="size-3.5" aria-hidden />
      <select
        aria-label={t("dil")}
        className="absolute inset-0 cursor-pointer appearance-none opacity-0"
        value={dil}
        disabled={bekliyor}
        onChange={(e) => {
          const yeni = e.target.value as (typeof routing.locales)[number];
          gecis(() => {
            // @ts-expect-error -- params, geçerli yolun parametreleriyle her zaman eşleşir.
            router.replace({ pathname: yol, params }, { locale: yeni });
          });
        }}
      >
        {routing.locales.map((d) => (
          <option key={d} value={d}>
            {dilAdlari[d]}
          </option>
        ))}
      </select>
    </label>
  );
}
