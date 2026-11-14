import { adminContent as ADMIN_CONTENT, formatAdminContent } from "@/lib/adminContent";
import { Eye, FilePen } from "lucide-react";
import { notFound } from "next/navigation";
import { z } from "zod";
import { AdminBody, AdminPageHeader } from "@/components/admin/kit";
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
        description={formatAdminContent(ADMIN_CONTENT.examplesIdPageMessage98, {value0: e.active ? ADMIN_CONTENT.examplesIdPageLabel97 : "Taslak",value1: e.slug,value2: e.usageCount})}
      >
        <div className="flex flex-wrap items-start gap-2">
          <Link href={{ pathname: "/admin/examples/[id]/preview", params: { id } }} className={buttonClass("ghost", "sm")}>
            <Eye className="size-4" />
            {ADMIN_CONTENT.examplesIdPageContent99}</Link>
          <Link href={{ pathname: "/admin/example-editor/[id]", params: { id } }} className={buttonClass("secondary", "sm")}>
            <FilePen className="size-4" />
            {ADMIN_CONTENT.examplesIdPageContent100}</Link>
          <PublishToggle id={id} active={e.active} />
        </div>
      </AdminPageHeader>
      <AdminBody>
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
      </AdminBody>
    </>
  );
}
