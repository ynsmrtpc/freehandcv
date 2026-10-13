import { Suspense } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { PreviewFrame } from "./PreviewFrame";

// The page editor's iframe. Content arrives via postMessage, so unsaved drafts are shown too.
export default function PreviewPage() {
  return (
    <Suspense fallback={null}>
      <AdminGuard>
        <PreviewFrame />
      </AdminGuard>
    </Suspense>
  );
}
