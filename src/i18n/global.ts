import type { routing } from "./routing";
import type tr from "../../messages/tr.json";

// next-intl tip güvenliği: anahtarlar Türkçe dosyadan, diller routing'den gelir.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof tr;
  }
}
