import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getPathname, redirect } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getSession } from "@/server/authz";
import { getSignInMethods } from "@/server/account";
import { googleEnabled } from "@/server/auth";
import { AccountView } from "./AccountView";

export async function generateMetadata({ params }: PageProps<"/[locale]/account">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "Account" });
  return { title: t("meta") };
}

// Profile, email, password and sign-in methods, sessions, data download and account closure (plan 9 /hesap).
export default async function AccountPage({ params }: PageProps<"/[locale]/account">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return (
    <Suspense fallback={null}>
      <Loader locale={locale} />
    </Suspense>
  );
}

// The session is read at request time (Cache Components), hence inside Suspense.
async function Loader({ locale }: { locale: Locale }) {
  const session = await getSession();
  if (!session) redirect({ href: { pathname: "/sign-in", query: { next: getPathname({ href: "/account", locale }) } }, locale });
  const methods = await getSignInMethods(session!.user.id);
  return (
    <AccountView
      user={{
        name: session!.user.name,
        email: session!.user.email,
        image: session!.user.image ?? null,
        username: session!.user.username ?? null,
        emailVerified: session!.user.emailVerified,
        createdAt: new Date(session!.user.createdAt).toISOString(),
        isAdmin: session!.user.role !== "user",
      }}
      currentSessionId={session!.session.id}
      hasPassword={methods.includes("credential")}
      hasGoogle={methods.includes("google")}
      googleEnabled={googleEnabled}
    />
  );
}
