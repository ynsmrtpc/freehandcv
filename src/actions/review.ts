"use server";

// Site review from the editor (guests too). The user id comes from the session, never from the client.
import { getSession } from "@/server/authz";
import { requestIp } from "@/server/rateLimit";
import { allowReviewRequest, reviewInputSchema, submitReview } from "@/server/reviews";

export async function submitReviewAction(input: unknown): Promise<{ ok: boolean }> {
  const parsed = reviewInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false };
  if (!allowReviewRequest(await requestIp())) return { ok: false };
  try {
    const session = await getSession();
    await submitReview(parsed.data, session?.user.id ?? null);
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false };
  }
}
