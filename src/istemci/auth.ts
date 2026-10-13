import { createAuthClient } from "better-auth/react";
import { twoFactorClient } from "better-auth/client/plugins";

export const authIstemci = createAuthClient({
  // İki adım yönlendirmesi giriş formunda ele alınır.
  plugins: [twoFactorClient()],
});
