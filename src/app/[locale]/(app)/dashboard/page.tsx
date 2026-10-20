import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getPathname, redirect } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { listResumes, listTrash } from "@/server/resumes";
import { getSharingStatus } from "@/server/consents";
import { getSession } from "@/server/authz";
import { DashboardView } from "./DashboardView";

export async function generateMetadata({ params }: PageProps<"/[locale]/dashboard">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "Dashboard" });
  return { title: t("meta") };
}

export default async function DashboardPage({ params }: PageProps<"/[locale]/dashboard">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return (
    <Suspense fallback={null}>
      <ResumeList locale={locale} />
    </Suspense>
  );
}

// The session is read at request time (Cache Components), hence inside Suspense.
async function ResumeList({ locale }: { locale: Locale }) {
  const session = await getSession();
  if (!session) redirect({ href: { pathname: "/sign-in", query: { next: getPathname({ href: "/dashboard", locale }) } }, locale });
  const [resumes, sharing, trash] = await Promise.all([
    listResumes(session!.user.id),
    getSharingStatus(session!.user.id),
    listTrash(session!.user.id),
  ]);
  return (
    <DashboardView
      sharing={sharing}
      trash={trash.map((r) => ({ id: r.id, title: r.title, deletedAt: r.deletedAt!.toISOString() }))}
      resumes={resumes.map((r) => ({ id: r.id, title: r.title, content: r.content, updatedAt: r.updatedAt.toISOString() }))}
    />
  );
}
