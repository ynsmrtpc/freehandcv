import { adminContent as ADMIN_CONTENT } from "@/lib/adminContent";
import { AdminBody, AdminPageHeader } from "@/components/admin/kit";
import { EMPTY_GUIDE } from "@/lib/examples";
import { ExampleForm } from "../ExampleForm";

export default function NewExample() {
  return (
    <>
      <AdminPageHeader
        title={ADMIN_CONTENT.examplesNewPageTitle134}
        description={ADMIN_CONTENT.examplesNewPageDescription135}
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
