import { Eye, FilePen } from "lucide-react";
import { notFound } from "next/navigation";
import { z } from "zod";
import { AdminPageHeader } from "@/components/admin/kit";
import { buttonClass } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { getExampleForAdmin } from "@/server/content/examples";
import { ExampleForm } from "../ExampleForm";
import { PublishToggle } from "../PublishToggle";

export default async function EditExample({ params }: PageProps<"/[locale]/admin/examples/[id]">) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const e = await getExampleForAdmin(id);
  if (!e) notFound();

  return (
    <>
      <AdminPageHeader
        title={e.title}
        description={`${e.active ? "Yayında" : "Taslak"} · /${e.slug} · ${e.usageCount} kez kullanıldı`}
      >
        <div className="flex flex-wrap items-start gap-2">
          <Link href={{ pathname: "/admin/examples/[id]/preview", params: { id } }} className={buttonClass("ghost", "sm")}>
            <Eye className="size-4" />
            Önizle
          </Link>
          <Link href={{ pathname: "/admin/example-editor/[id]", params: { id } }} className={buttonClass("secondary", "sm")}>
            <FilePen className="size-4" />
            CV içeriğini düzenle
          </Link>
          <PublishToggle id={id} active={e.active} />
        </div>
      </AdminPageHeader>
      <div className="max-w-4xl p-5 sm:p-8">
        <ExampleForm
          // Rebuilt from server data after saving or publishing (slug lock may change).
          key={`${e.updatedAt.toISOString()}-${e.active}`}
          id={id}
          slugLocked={e.active}
          initial={{
            slug: e.slug,
            title: e.title,
            occupation: e.occupation,
            category: e.category,
            locale: e.locale === "en" ? "en" : "tr",
            experienceLevel: e.experienceLevel ?? "mid",
            metaTitle: e.metaTitle ?? "",
            metaDescription: e.metaDescription ?? "",
            guide: e.guide,
            sortOrder: e.sortOrder,
          }}
        />
      </div>
    </>
  );
}
