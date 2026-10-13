import type { routing } from "./routing";
import type messages from "../../messages/tr";

// next-intl type safety: keys come from the Turkish messages, locales from the routing config.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
