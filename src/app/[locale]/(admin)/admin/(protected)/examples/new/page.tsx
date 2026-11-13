import { AdminBody, AdminPageHeader } from "@/components/admin/kit";
import { EMPTY_GUIDE } from "@/lib/examples";
import { ExampleForm } from "../ExampleForm";

export default function NewExample() {
  return (
    <>
      <AdminPageHeader
        title="Yeni örnek CV"
        description="Önce sayfa bilgilerini gir; oluşturduktan sonra CV içeriğini editörde düzenlersin. Yeni örnek taslak olarak başlar."
      />
      <AdminBody>
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
      </AdminBody>
    </>
  );
}
