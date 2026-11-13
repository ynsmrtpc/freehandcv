import type { Role } from "@/server/db/schema";

export const ROLE_NAMES: Record<Role, string> = { user: "Kullanıcı", editor: "Editör", admin: "Yönetici" };
export const ROLE_HINTS: Record<Role, string> = {
  user: "CV ve şablon oluşturur; yönetim paneline giremez.",
  editor: "Sayfaları, örnekleri ve yorumları düzenler; kullanıcıları ve site ayarlarını değiştiremez.",
  admin: "Her şeye erişir: kullanıcılar, roller ve site ayarları dahil.",
};
