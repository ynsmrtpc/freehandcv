import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { beginAuthorization, CanvaError } from "@/server/canva";
import { routing } from "@/i18n/routing";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const rawLocale = url.searchParams.get("locale");
  const locale = routing.locales.includes(rawLocale as (typeof routing.locales)[number])
    ? (rawLocale as (typeof routing.locales)[number])
    : routing.defaultLocale;
  const importPath = locale === "en" ? "/en/resume-import" : "/cv-aktar";
  const signInPath = locale === "en" ? "/en/sign-in" : "/giris";

  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    const target = new URL(signInPath, url.origin);
    target.searchParams.set("next", `${importPath}?source=canva`);
    return NextResponse.redirect(target);
  }

  try {
    const authorizeUrl = await beginAuthorization(session.user.id, locale);
    return NextResponse.redirect(authorizeUrl);
  } catch (error) {
    const code = error instanceof CanvaError ? error.code : "failed";
    const back = new URL(importPath, url.origin);
    back.searchParams.set("source", "canva");
    back.searchParams.set("canva_error", code);
    return NextResponse.redirect(back);
  }
}
