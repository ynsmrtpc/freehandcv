import { notFound } from "next/navigation";
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
      {!e.active && (
        <p className="bg-warning/15 px-4 py-2 text-center text-sm font-medium text-warning">
          Taslak önizlemesi — bu sayfa ziyaretçilere görünmez.
        </p>
      )}
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
