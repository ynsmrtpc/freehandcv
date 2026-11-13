import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminBody, AdminPageHeader } from "@/components/admin/kit";
import { Link } from "@/i18n/navigation";
import { getFaq, listFaqCategories } from "@/server/content/faqs";
import { FaqForm } from "../FaqForm";

export default async function EditFaq({ params }: PageProps<"/[locale]/admin/faqs/[id]">) {
  const { id } = await params;
  const [faq, categories] = await Promise.all([/^[0-9a-f-]{36}$/.test(id) ? getFaq(id) : null, listFaqCategories()]);
  if (!faq) notFound();
  return (
    <>
      <AdminPageHeader title="Soruyu düzenle" description={faq.question}>
        <Link href="/admin/faqs" className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-primary-text hover:underline">
          <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
          SSS
        </Link>
      </AdminPageHeader>
      <AdminBody>
        <FaqForm
          id={faq.id}
          categories={categories.map((c) => c.category)}
          initial={{
            locale: faq.locale === "en" ? "en" : "tr",
            question: faq.question,
            answer: faq.answer,
            category: faq.category,
            sortOrder: faq.sortOrder,
            active: faq.active,
          }}
        />
      </AdminBody>
    </>
  );
}
