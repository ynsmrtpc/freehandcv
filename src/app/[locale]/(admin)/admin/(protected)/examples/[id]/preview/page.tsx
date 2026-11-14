import { adminContent as ADMIN_CONTENT } from "@/lib/adminContent";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { z } from "zod";
import { ExamplePage } from "@/app/[locale]/(site)/resume-examples/[slug]/ExamplePage";
import type { Locale } from "@/i18n/routing";
import { getExampleForAdmin } from "@/server/content/examples";

// The public page as it will look, drafts included (only admins reach this route).
export default async function PreviewExample({ params }: PageProps<"/[locale]/admin/examples/[id]/preview">) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const e = await getExampleForAdmin(id);
  if (!e) notFound();
  const locale = (e.locale === "en" ? "en" : "tr") as Locale;

  return (
    <div className="bg-background">
      <div className="sticky top-14 z-30 flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-border bg-surface px-4 py-2 lg:top-0">
        <Link
          href={{ pathname: "/admin/examples/[id]", params: { id } }}
          className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-primary-text hover:underline pointer-fine:min-h-9"
        >
          <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
          {ADMIN_CONTENT.examplesIdPreviewPageContent101}</Link>
        <p className={e.active ? "text-[15px] text-muted" : "text-[15px] font-semibold text-warning"}>
          {e.active ? ADMIN_CONTENT.examplesIdPreviewPageLabel102 : ADMIN_CONTENT.examplesIdPreviewPageLabel103}
        </p>
      </div>
      <ExamplePage
        locale={locale}
        example={{
          slug: e.slug,
          title: e.title,
          occupation: e.occupation,
          category: e.category,
          experienceLevel: e.experienceLevel,
          updatedAt: e.updatedAt.toISOString(),
          content: e.content,
          metaTitle: e.metaTitle,
          metaDescription: e.metaDescription,
          guide: e.guide,
        }}
      />
    </div>
  );
}
