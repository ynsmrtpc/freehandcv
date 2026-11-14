import "server-only";
import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "./db";
import { consents, resumes, user } from "./db/schema";

/**
 * Text version of the employer sharing consent. Bump it when the consent text shown on screen
 * (messages: Consent.*) changes; earlier grants count as given to the earlier text.
 * The value is stored in consent rows as evidence, so existing values never change.
 */
export const EMPLOYER_CONSENT_VERSION = "employer-sharing-2026-11-v2";

export const consentSources = ["sign_up", "dashboard", "download"] as const;
export type ConsentSource = (typeof consentSources)[number];

export type SharingStatus = { enabled: boolean; resumeId: string | null };

export async function getSharingStatus(userId: string): Promise<SharingStatus> {
  const [u] = await db
    .select({ enabled: user.employerSharing, resumeId: user.sharedResumeId })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
  const [consent] = await db.select({ granted: consents.granted, textVersion: consents.textVersion }).from(consents)
    .where(and(eq(consents.userId, userId), eq(consents.kind, "employer_sharing"))).orderBy(desc(consents.createdAt), desc(consents.id)).limit(1);
  return { enabled: !!u?.enabled && !!consent?.granted && consent.textVersion === EMPLOYER_CONSENT_VERSION, resumeId: u?.resumeId ?? null };
}

export class NotResumeOwnerError extends Error {}

/**
 * Grants or withdraws consent. When the state changes, a permanent row is written to consents.
 * `resumeId` null = "my most recently updated resume".
 */
export async function setSharing(
  userId: string,
  enabled: boolean,
  resumeId: string | null,
  source: ConsentSource,
) {
  await db.transaction(async (tx) => {
    if (resumeId) {
      const [resume] = await tx
        .select({ id: resumes.id })
        .from(resumes)
        .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId), isNull(resumes.deletedAt)))
        .limit(1);
      if (!resume) throw new NotResumeOwnerError();
    }
    const [before] = await tx
      .select({ enabled: user.employerSharing })
      .from(user)
      .where(eq(user.id, userId))
      .for("update");
    await tx
      .update(user)
      .set({ employerSharing: enabled, sharedResumeId: enabled ? resumeId : null })
      .where(eq(user.id, userId));
    // Explicit grants also renew the consent version and record a changed resume selection.
    if (enabled || before?.enabled !== enabled)
      await tx.insert(consents).values({
        userId,
        kind: "employer_sharing",
        granted: enabled,
        textVersion: EMPLOYER_CONSENT_VERSION,
        source,
      });
  });
}
