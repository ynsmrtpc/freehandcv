import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { ImageResponse } from "next/og";
import { routing } from "@/i18n/routing";

// Default social share image. Pages generate their own images in phase 1 (plan 6.4).
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "FreehandCV";

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({
    locale: hasLocale(routing.locales, locale) ? locale : routing.defaultLocale,
    namespace: "Landing",
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#eef1f6",
          color: "#18202e",
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 700, display: "flex" }}>
          Freehand<span style={{ color: "#2f5bd3" }}>CV</span>
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, marginTop: 40, lineHeight: 1.15 }}>
          {t("ogTitle")}
        </div>
        <div style={{ fontSize: 34, marginTop: 24, color: "#5a6578" }}>{t("hero.subtitle")}</div>
      </div>
    ),
    size,
  );
}
