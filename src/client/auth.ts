import { createAuthClient } from "better-auth/react";
import { oneTapClient, twoFactorClient } from "better-auth/client/plugins";

/** Google sign-in and One Tap are shown only when a client id is set. */
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

export const authClient = createAuthClient({
  plugins: [
    // The two-factor redirect is handled in the sign-in forms.
    twoFactorClient(),
    ...(GOOGLE_CLIENT_ID
      ? [
          oneTapClient({
            clientId: GOOGLE_CLIENT_ID,
            autoSelect: false,
            cancelOnTapOutside: true,
            context: "signin",
            promptOptions: { maxAttempts: 1 },
          }),
        ]
      : []),
  ],
});
