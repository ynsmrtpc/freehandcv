import type { Metadata } from "next";
import { cvFontSiniflari } from "@/bilesenler/cv/cvFontlari";

// Uygulama sayfaları indekslenmez (plan 6.1).
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function UygulamaLayout({ children }: LayoutProps<"/[locale]">) {
  return <div className={`min-h-dvh bg-zemin ${cvFontSiniflari}`}>{children}</div>;
}
