import { notFound } from "next/navigation";
import { Suspense } from "react";
import { z } from "zod";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { Editor } from "@/components/editor/Editor";
import { resumeFontClasses } from "@/components/resume/resumeFonts";
import { getExampleForAdmin } from "@/server/content/examples";

// The CV editor for an example resume (plan 7.3: "the same editor"). Full screen, so it sits outside
// the admin shell; the guard runs here, and every save checks authorization again on the server.
export default function ExampleEditorPage({ params }: PageProps<"/[locale]/admin/example-editor/[id]">) {
  return (
    <Suspense fallback={null}>
      <AdminGuard>
        <Loader params={params} />
      </AdminGuard>
    </Suspense>
  );
}

async function Loader({ params }: { params: PageProps<"/[locale]/admin/example-editor/[id]">["params"] }) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const e = await getExampleForAdmin(id);
  if (!e) notFound();
  return (
    <div className={resumeFontClasses}>
      <Editor example={{ id: e.id, data: e.content }} />
    </div>
  );
}
