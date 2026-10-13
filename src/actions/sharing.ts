"use server";

import { z } from "zod";
import { consentSources, NotResumeOwnerError, setSharing, type ConsentSource } from "@/server/consents";
import { getSession } from "@/server/authz";

/** Grants/withdraws the employer sharing consent. The user id is read from the session. */
export async function setSharingAction(
  enabled: boolean,
  resumeId: string | null,
  source: ConsentSource,
): Promise<{ ok: boolean }> {
  const session = await getSession();
  if (!session) return { ok: false };
  try {
    await setSharing(
      session.user.id,
      z.boolean().parse(enabled),
      resumeId === null ? null : z.uuid().parse(resumeId),
      z.enum(consentSources).parse(source),
    );
    return { ok: true };
  } catch (e) {
    if (!(e instanceof NotResumeOwnerError) && !(e instanceof z.ZodError)) console.error(e);
    return { ok: false };
  }
}
