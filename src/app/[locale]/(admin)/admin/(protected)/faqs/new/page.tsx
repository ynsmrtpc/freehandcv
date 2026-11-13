import { ArrowLeft } from "lucide-react";
import { AdminBody, AdminPageHeader } from "@/components/admin/kit";
import { Link } from "@/i18n/navigation";
import { listFaqCategories } from "@/server/content/faqs";
import { FaqForm } from "../FaqForm";

export default async function NewFaq() {
  const categories = await listFaqCategories();
  return (
    <>
      <AdminPageHeader title="Yeni soru">
        <Link href="/admin/faqs" className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-primary-text hover:underline">
          <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
          SSS
        </Link>
      </AdminPageHeader>
      <AdminBody>
        <FaqForm
          id={null}
          categories={categories.map((c) => c.category)}
          initial={{ locale: "tr", question: "", answer: "", category: categories[0]?.category ?? "genel", sortOrder: 100, active: true }}
        />
      </AdminBody>
    </>
  );
}
