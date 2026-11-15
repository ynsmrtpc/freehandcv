import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { CanvaError, completeAuthorization } from "@/server/canva";
import { routing } from "@/i18n/routing";

function importUrl(origin: string, locale: string) {
  const path = locale === "en" ? "/en/resume-import" : "/cv-aktar";
  const target = new URL(path, origin);
  target.searchParams.set("source", "canva");
  return target;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.redirect(new URL("/giris", url.origin));

  try {
    const locale = await completeAuthorization(session.user.id, url.searchParams);
    return NextResponse.redirect(importUrl(url.origin, locale));
  } catch (error) {
    const rawLocale = (error as { locale?: string } | undefined)?.locale;
    const locale = routing.locales.includes(rawLocale as (typeof routing.locales)[number])
      ? rawLocale!
      : routing.defaultLocale;
    const target = importUrl(url.origin, locale);
    target.searchParams.set("canva_error", error instanceof CanvaError ? error.code : "failed");
    return NextResponse.redirect(target);
  }
}
