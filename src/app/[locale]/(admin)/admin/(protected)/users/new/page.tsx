import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { AdminBody, AdminPageHeader } from "@/components/admin/kit";
import { Link } from "@/i18n/navigation";
import { NewUserForm } from "../UserPanels";
import { UserCreationOptions } from "@/extensions/generated-client";

export default async function NewUser() {
  const t_ = await getTranslations("Admin.users");
  return (
    <>
      <AdminPageHeader title={t_("newUser")} description={t_("createsAnEmailPasswordAccountWithIts")}>
        <Link href="/admin/users" className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-primary-text hover:underline">
          <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
          {t_("users")}</Link>
      </AdminPageHeader>
      <AdminBody>
        <UserCreationOptions><NewUserForm /></UserCreationOptions>
      </AdminBody>
    </>
  );
}
