import { Suspense } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminStatus } from "@/server/authz";

// The session is read at request time, so the check runs inside Suspense (Cache Components).
// The guard renders its children only once authorized, so these pages are never prerendered.
export default function ProtectedLayout({ children }: LayoutProps<"/[locale]/admin">) {
  return (
    <Suspense fallback={null}>
      <AdminGuard>
        <Shell>{children}</Shell>
      </AdminGuard>
    </Suspense>
  );
}

async function Shell({ children }: { children: React.ReactNode }) {
  const s = await adminStatus();
  if (s.status !== "ok") return null;
  return <AdminShell user={{ name: s.user.name, email: s.user.email, role: s.user.role }}>{children}</AdminShell>;
}
