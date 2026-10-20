"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { AuthorizationError, requireAdmin } from "@/server/authz";
import { APPROVED_REVIEWS_TAG, ReviewNotAllowedError, setReviewApproval } from "@/server/reviews";

export async function setReviewApprovalAction(id: string, approved: boolean) {
  try {
    const actor = await requireAdmin();
    await setReviewApproval(z.uuid().parse(id), z.boolean().parse(approved), actor.id);
    updateTag(APPROVED_REVIEWS_TAG);
    return { ok: true as const };
  } catch (error) {
    if (error instanceof AuthorizationError) return { ok: false as const, error: "Bu işlem için yetkin yok." };
    if (error instanceof ReviewNotAllowedError)
      return { ok: false as const, error: "Yazarı sitede gösterilmesine izin vermediği için onaylanamaz." };
    console.error(error);
    return { ok: false as const, error: "Beklenmeyen bir hata oluştu." };
  }
}
