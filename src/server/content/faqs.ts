import "server-only";
import { and, asc, count, eq, ilike, inArray, isNotNull, or, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";
import { blockListSchema, type Block } from "@/lib/blocks";
import { migrateLegacyBlocks } from "@/lib/legacyContent";
import { db } from "../db";
import { auditLog, faqs, pages } from "../db/schema";

/** Every published page that pulls questions from the pool depends on this tag. */
export const FAQS_TAG = "faqs";
export const faqCategorySchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9-]{1,40}$/, "Kategori küçük harf, rakam ve - içerebilir (ör. genel, gizlilik)");

export const faqInputSchema = z.object({
  locale: z.enum(["tr", "en"]),
  question: z.string().trim().min(1, "Soru boş olamaz").max(300),
  answer: z.string().trim().min(1, "Cevap boş olamaz").max(4000),
  category: faqCategorySchema,
  sortOrder: z.int().min(0).max(10_000),
  active: z.boolean(),
});
export type FaqInput = z.infer<typeof faqInputSchema>;

// Answers are stored as JSON (room for rich text later); today they are plain strings.
const answerText = (raw: unknown) => (typeof raw === "string" ? raw : "");

/* ---------------- Public (cached) ---------------- */

/** Active questions of one category, in order. */
export async function getFaqsByCategory(locale: string, category: string) {
  "use cache";
  cacheTag(FAQS_TAG);
  try {
    const rows = await db
      .select({ question: faqs.question, answer: faqs.answer })
      .from(faqs)
      .where(and(eq(faqs.locale, locale), eq(faqs.category, category), eq(faqs.active, true)))
      .orderBy(asc(faqs.sortOrder), asc(faqs.question));
    return rows.map((r) => ({ question: r.question, answer: answerText(r.answer) }));
  } catch (error) {
    console.error("getFaqsByCategory: database unreachable", error);
    cacheLife("minutes");
    return [];
  }
}

/** FAQ blocks with a category take their questions from the pool; others keep their own list. */
export async function resolveFaqBlocks(blocks: Block[], locale: string): Promise<Block[]> {
  return Promise.all(
    blocks.map(async (b) => {
      if (b.type !== "faq" || !b.content.category) return b;
      const items = await getFaqsByCategory(locale, b.content.category);
      return { ...b, content: { ...b.content, items } };
    }),
  );
}

/* ---------------- Admin (uncached; the caller checks authorization) ---------------- */

export async function listFaqsForAdmin({ locale, category, search }: { locale?: string; category?: string; search?: string }) {
  return db
    .select({
      id: faqs.id,
      locale: faqs.locale,
      question: faqs.question,
      answer: faqs.answer,
      category: faqs.category,
      sortOrder: faqs.sortOrder,
      active: faqs.active,
    })
    .from(faqs)
    .where(
      and(
        locale ? eq(faqs.locale, locale) : undefined,
        category ? eq(faqs.category, category) : undefined,
        search ? or(ilike(faqs.question, `%${search}%`), sql`${faqs.answer}::text ilike ${`%${search}%`}`) : undefined,
      ),
    )
    .orderBy(asc(faqs.locale), asc(faqs.category), asc(faqs.sortOrder), asc(faqs.question))
    .then((rows) => rows.map((r) => ({ ...r, answer: answerText(r.answer) })));
}

export async function listFaqCategories() {
  return db
    .select({ category: faqs.category, n: count() })
    .from(faqs)
    .where(isNotNull(faqs.category))
    .groupBy(faqs.category)
    .orderBy(asc(faqs.category))
    .then((rows) => rows.map((r) => ({ category: r.category!, n: r.n })));
}

export async function getFaq(id: string) {
  const [r] = await db.select().from(faqs).where(eq(faqs.id, id));
  return r ? { ...r, answer: answerText(r.answer), category: r.category ?? "" } : null;
}

export async function saveFaq(id: string | null, input: FaqInput, actorId: string) {
  return db.transaction(async (tx) => {
    const values = { ...input, answer: input.answer };
    const [row] = id
      ? await tx.update(faqs).set(values).where(eq(faqs.id, id)).returning({ id: faqs.id })
      : await tx.insert(faqs).values(values).returning({ id: faqs.id });
    if (!row) throw new Error("FAQ not found");
    await tx.insert(auditLog).values({ userId: actorId, action: id ? "update_faq" : "create_faq", targetType: "faq", targetId: row.id, after: { question: input.question } });
    return row.id;
  });
}

export async function setFaqsActive(ids: string[], active: boolean, actorId: string) {
  const rows = await db.update(faqs).set({ active }).where(inArray(faqs.id, ids)).returning({ id: faqs.id });
  if (rows.length)
    await db.insert(auditLog).values(rows.map((r) => ({ userId: actorId, action: active ? "publish_faq" : "unpublish_faq", targetType: "faq", targetId: r.id })));
  return rows.length;
}

export async function deleteFaqs(ids: string[], actorId: string) {
  const rows = await db.delete(faqs).where(inArray(faqs.id, ids)).returning({ id: faqs.id, question: faqs.question });
  if (rows.length)
    await db.insert(auditLog).values(rows.map((r) => ({ userId: actorId, action: "delete_faq", targetType: "faq", targetId: r.id, before: { question: r.question } })));
  return rows.length;
}

/**
 * Copies the questions written inside published pages' FAQ blocks into the pool, one category per
 * page (the landing page becomes "genel"). Questions already in the pool are skipped; pages keep
 * their own lists until a block is switched to a category.
 */
export async function importFaqsFromPages(actorId: string) {
  const published = await db.select({ locale: pages.locale, slug: pages.slug, blocks: pages.publishedBlocks }).from(pages).where(isNotNull(pages.publishedBlocks));
  const existing = new Set((await db.select({ locale: faqs.locale, question: faqs.question }).from(faqs)).map((r) => `${r.locale}|${r.question}`));
  const toInsert: (typeof faqs.$inferInsert)[] = [];
  for (const p of published) {
    const parsed = blockListSchema.safeParse(migrateLegacyBlocks(p.blocks));
    if (!parsed.success) continue;
    const category = p.slug === "home" ? "genel" : p.slug.replace(/[^a-z0-9-]/g, "-").slice(0, 40);
    for (const b of parsed.data as Block[])
      if (b.type === "faq")
        b.content.items.forEach((item, i) => {
          const key = `${p.locale}|${item.question}`;
          if (!item.question || existing.has(key)) return;
          existing.add(key);
          toInsert.push({ locale: p.locale, question: item.question, answer: item.answer, category, sortOrder: (i + 1) * 10, active: true });
        });
  }
  if (toInsert.length) {
    await db.insert(faqs).values(toInsert);
    await db.insert(auditLog).values({ userId: actorId, action: "import_faqs", targetType: "faq", after: { count: toInsert.length } });
  }
  return toInsert.length;
}
