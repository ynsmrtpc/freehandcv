"use client";

import { useEffect } from "react";
import { authClient, GOOGLE_CLIENT_ID } from "@/client/auth";

/**
 * Google One Tap: without a session, a "Continue as Full Name" prompt appears top right. If the user
 * dismisses it, Google will not show it again for a while (Google's own cooldown). Does nothing when
 * no client id is set. `returnTo`: path to go to after sign-in.
 */
export function GoogleOneTap({ returnTo }: { returnTo: string }) {
  const { data, isPending } = authClient.useSession();

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || isPending || data) return;
    const timer = setTimeout(() => {
      void authClient.oneTap({
        fetchOptions: { onSuccess: () => window.location.assign(returnTo) },
      });
    }, 1200); // after the first paint; must not delay the main content
    return () => clearTimeout(timer);
  }, [data, isPending, returnTo]);

  return null;
}
