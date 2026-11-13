import "server-only";
import { and, count, eq, isNull, sql } from "drizzle-orm";
import { db } from "../db";
import { exampleResumes, pages, resumes, siteReviews, user } from "../db/schema";

/** Totals and the work waiting for the team, for the admin overview. */
export async function getAdminOverview() {
  const [[users], [savedResumes], [unpublishedPages], [draftExamples], [publishedExamples], [pendingReviews]] =
    await Promise.all([
      db.select({ n: count() }).from(user),
      db.select({ n: count() }).from(resumes).where(isNull(resumes.deletedAt)),
      db.select({ n: count() }).from(pages).where(sql`${pages.draftBlocks} is distinct from ${pages.publishedBlocks}`),
      db.select({ n: count() }).from(exampleResumes).where(eq(exampleResumes.active, false)),
      db.select({ n: count() }).from(exampleResumes).where(eq(exampleResumes.active, true)),
      db.select({ n: count() }).from(siteReviews).where(and(eq(siteReviews.approved, false))),
    ]);
  return {
    users: users.n,
    resumes: savedResumes.n,
    unpublishedPages: unpublishedPages.n,
    draftExamples: draftExamples.n,
    publishedExamples: publishedExamples.n,
    pendingReviews: pendingReviews.n,
  };
}
