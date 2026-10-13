import { createAuthClient } from "better-auth/react";
import { oneTapClient, twoFactorClient } from "better-auth/client/plugins";

/** Google girişi ve One Tap yalnız istemci kimliği tanımlıysa görünür. */
export const GOOGLE_ISTEMCI_KIMLIGI = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

export const authIstemci = createAuthClient({
  plugins: [
    // İki adım yönlendirmesi giriş formlarında ele alınır.
    twoFactorClient(),
    ...(GOOGLE_ISTEMCI_KIMLIGI
      ? [
          oneTapClient({
            clientId: GOOGLE_ISTEMCI_KIMLIGI,
            autoSelect: false,
            cancelOnTapOutside: true,
            context: "signin",
            promptOptions: { maxAttempts: 1 },
          }),
        ]
      : []),
  ],
});
