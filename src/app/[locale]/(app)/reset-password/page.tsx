import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/account/ResetPasswordForm";
import { routing } from "@/i18n/routing";
import { RESET_TOKEN_EXPIRES_IN_SECONDS } from "@/server/passwordReset";

// Not indexed: the (app) layout sets robots noindex for every page in this group.
export async function generateMetadata({ params }: PageProps<"/[locale]/reset-password">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "Auth" });
  return { title: t("resetMeta") };
}

// Inside Suspense because the token (?token=) and error (?error=) are read from the search params.
export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm linkHours={RESET_TOKEN_EXPIRES_IN_SECONDS / 3600} />
    </Suspense>
  );
}
