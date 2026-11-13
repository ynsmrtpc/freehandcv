import { ArrowLeft } from "lucide-react";
import { AdminBody, AdminPageHeader } from "@/components/admin/kit";
import { Link } from "@/i18n/navigation";
import { NewUserForm } from "../UserPanels";

export default function NewUser() {
  return (
    <>
      <AdminPageHeader title="Yeni kullanıcı" description="E-posta ve şifreyle giriş yapan bir hesap açar. Adres doğrulanmış sayılır.">
        <Link href="/admin/users" className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-primary-text hover:underline">
          <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
          Kullanıcılar
        </Link>
      </AdminPageHeader>
      <AdminBody>
        <NewUserForm />
      </AdminBody>
    </>
  );
}
