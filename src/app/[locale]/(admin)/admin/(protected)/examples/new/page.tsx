import { AdminPageHeader } from "@/components/admin/kit";
import { EMPTY_GUIDE } from "@/lib/examples";
import { ExampleForm } from "../ExampleForm";

export default function NewExample() {
  return (
    <>
      <AdminPageHeader
        title="Yeni örnek CV"
        description="Önce sayfa bilgilerini gir; oluşturduktan sonra CV içeriğini editörde düzenlersin. Yeni örnek taslak olarak başlar."
      />
      <div className="max-w-4xl p-5 sm:p-8">
        <ExampleForm
          slugLocked={false}
          initial={{
            slug: "",
            title: "",
            occupation: "",
            category: "technology",
            locale: "tr",
            experienceLevel: "mid",
            metaTitle: "",
            metaDescription: "",
            guide: EMPTY_GUIDE,
            sortOrder: 100,
          }}
        />
      </div>
    </>
  );
}
