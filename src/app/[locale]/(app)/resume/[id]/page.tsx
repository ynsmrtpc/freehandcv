import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { z } from "zod";
import { Editor } from "@/components/editor/Editor";
import { getPathname, redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getResume, ResumeNotFoundError } from "@/server/resumes";
import { getSession } from "@/server/authz";

export const metadata: Metadata = { title: "CV" };

// The resume id and the session are known at request time (Cache Components): both are read inside Suspense.
export default function EditResumePage({ params }: PageProps<"/[locale]/resume/[id]">) {
  return (
    <Suspense fallback={null}>
      <ResumeLoader params={params} />
    </Suspense>
  );
}

async function ResumeLoader({ params }: { params: PageProps<"/[locale]/resume/[id]">["params"] }) {
  const { locale, id } = await params;
  if (!hasLocale(routing.locales, locale) || !z.uuid().safeParse(id).success) notFound();
  const session = await getSession();
  if (!session)
    redirect({
      href: {
        pathname: "/sign-in",
        query: { next: getPathname({ href: { pathname: "/resume/[id]", params: { id } }, locale }) },
      },
      locale,
    });
  const resume = await getResume(id, session!.user.id).catch((e) => {
    // Someone else's resume also looks "not found"; its existence is not revealed.
    if (e instanceof ResumeNotFoundError) notFound();
    throw e;
  });
  return <Editor account={{ id: resume.id, data: resume.content, version: resume.version }} />;
}
