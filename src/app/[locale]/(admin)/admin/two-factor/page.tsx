import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { redirect } from "@/i18n/navigation";
import { adminStatus } from "@/server/authz";
import { TwoFactorSetup } from "./TwoFactorSetup";

export default function TwoFactorPage() {
  return (
    <Suspense fallback={null}>
      <Guard />
    </Suspense>
  );
}

async function Guard() {
  const [s, locale] = await Promise.all([adminStatus(), getLocale()]);
  if (s.status === "signed-out") redirect({ href: "/admin/sign-in", locale });
  if (s.status === "forbidden") notFound();
  if (s.status === "ok") redirect({ href: "/admin", locale });
  return <TwoFactorSetup />;
}
