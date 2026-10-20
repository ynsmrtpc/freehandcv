import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";
import { REVIEW_BODY_MAX, REVIEW_OCCUPATION_MAX } from "@/lib/reviews";
import { db } from "./db";
import { auditLog, siteReviews, user } from "./db/schema";
import { createRateLimiter } from "./rateLimit";

// Site reviews (plan 5, 6.3): asked after the second PDF download; shown on the landing only when
// the author allowed it AND an admin approved it. Fake or invented reviews are never added.

export const APPROVED_REVIEWS_TAG = "reviews:approved";
const APPROVED_LIMIT = 24;

export const reviewInputSchema = z.object({
  rating: z.int().min(1).max(5),
  body: z.string().trim().max(REVIEW_BODY_MAX),
  occupation: z.string().trim().max(REVIEW_OCCUPATION_MAX),
  displayAllowed: z.boolean(),
});
export type ReviewInput = z.infer<typeof reviewInputSchema>;

/** Five reviews per client per day is plenty for a real person. */
export const allowReviewRequest = createRateLimiter(24 * 60 * 60 * 1000, 5);

export async function submitReview(input: ReviewInput, userId: string | null) {
  const r = reviewInputSchema.parse(input);
  await db.insert(siteReviews).values({
    userId,
    rating: r.rating,
    body: r.body,
    occupation: r.occupation || null,
    displayAllowed: r.displayAllowed,
  });
}

/** "Deniz Aksoy" → "Deniz A."; the full name and e-mail are never shown publicly. */
export function publicName(name: string | null) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return null;
  return parts.length === 1 ? parts[0] : `${parts[0]} ${parts[parts.length - 1][0].toLocaleUpperCase("tr")}.`;
}

export type PublicReview = { id: string; rating: number; body: string; occupation: string | null; name: string | null };

/** Allowed + approved reviews with text, newest first (cached; approving refreshes the tag). */
export async function getApprovedReviews(): Promise<PublicReview[]> {
  "use cache";
  cacheTag(APPROVED_REVIEWS_TAG);
  try {
    const rows = await db
      .select({
        id: siteReviews.id,
        rating: siteReviews.rating,
        body: siteReviews.body,
        occupation: siteReviews.occupation,
        name: user.name,
      })
      .from(siteReviews)
      .leftJoin(user, eq(user.id, siteReviews.userId))
      .where(and(eq(siteReviews.displayAllowed, true), eq(siteReviews.approved, true)))
      .orderBy(desc(siteReviews.createdAt))
      .limit(APPROVED_LIMIT);
    return rows.filter((r) => r.body).map((r) => ({ ...r, name: publicName(r.name) }));
  } catch (error) {
    console.error("getApprovedReviews: database unreachable", error);
    cacheLife("seconds");
    return [];
  }
}

/* ---------------- Admin (uncached; the caller checks authorization) ---------------- */

export async function listReviewsForAdmin() {
  return db
    .select({
      id: siteReviews.id,
      rating: siteReviews.rating,
      body: siteReviews.body,
      occupation: siteReviews.occupation,
      displayAllowed: siteReviews.displayAllowed,
      approved: siteReviews.approved,
      createdAt: siteReviews.createdAt,
      userName: user.name,
      userEmail: user.email,
    })
    .from(siteReviews)
    .leftJoin(user, eq(user.id, siteReviews.userId))
    .orderBy(desc(siteReviews.createdAt))
    .limit(500);
}

export class ReviewNotAllowedError extends Error {}

/** Approving needs the author's permission to display; hiding is always possible. */
export async function setReviewApproval(id: string, approved: boolean, actorId: string) {
  await db.transaction(async (tx) => {
    const [before] = await tx
      .select({ approved: siteReviews.approved, displayAllowed: siteReviews.displayAllowed })
      .from(siteReviews)
      .where(eq(siteReviews.id, id))
      .for("update");
    if (!before) throw new Error("Review not found");
    if (approved && !before.displayAllowed) throw new ReviewNotAllowedError();
    if (before.approved === approved) return;
    await tx.update(siteReviews).set({ approved }).where(eq(siteReviews.id, id));
    await tx.insert(auditLog).values({
      userId: actorId,
      action: approved ? "approve_review" : "hide_review",
      targetType: "site_review",
      targetId: id,
      before: { approved: before.approved },
      after: { approved },
    });
  });
}
