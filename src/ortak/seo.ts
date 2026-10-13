import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type Dil } from "@/i18n/routing";
import { SITE_URL } from "./site";

type Href = Parameters<typeof getPathname>[0]["href"];

/** Bir yolun belirtilen dildeki tam adresi. */
export function tamAdres(href: Href, dil: Dil): string {
  const yol = getPathname({ href, locale: dil });
  return SITE_URL + (yol === "/" ? "" : yol);
}

/**
 * canonical + hreflang karşılıkları (plan 8.3). x-default Türkçe sürümdür.
 * `diller` verilirse yalnız o dillerde var olan sayfa için karşılık üretilir.
 */
export function alternatifler(
  href: Href,
  dil: Dil,
  diller: readonly Dil[] = routing.locales,
): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const d of diller) languages[d] = tamAdres(href, d);
  languages["x-default"] = tamAdres(href, routing.defaultLocale);
  return { canonical: tamAdres(href, dil), languages };
}
