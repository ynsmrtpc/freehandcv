// Updates only development settings and unpublished privacy drafts. Never publishes content.
import "dotenv/config";
import { eq, and, sql } from "drizzle-orm";
import { db } from "../src/server/db";
import { auditLog, pages, siteSettings } from "../src/server/db/schema";
import { blockListSchema } from "../src/lib/blocks";
import { migrateLegacyBlocks, migrateLegacySiteSettings } from "../src/lib/legacyContent";
import { resolveGlobalSettings } from "../src/lib/siteSettings";
import { seedPages } from "./seed-pages";

const updateText = (text: string) => text.replaceAll("[Unvan / ad soyad]", "FreehandCV").replaceAll("[Legal name]", "FreehandCV")
  .replaceAll(", [adres]", "").replaceAll(", [address]", "")
  .replace(/\[(e-posta(?: \/ başvuru yöntemi)?|email(?: \/ method)?)\]/g, "support@freehandcv.com")
  .replace("seçtiğin CV'n işe alım yapan firmalarla paylaşılabilir; böylece iş fırsatlarına daha kolay ulaşırsın.", "seçtiğin CV’nin mesleki ve iletişim bilgileri ölçütlerine uyan firma hesaplarınca panel ve API üzerinden görüntülenebilir ve işe alım sistemlerine aktarılabilir. Gizli bölümler, fotoğraflar ve referanslar paylaşılmaz. Rızanı geri çekmek sonraki erişimleri durdurur; daha önce aktarılmış kopyalar otomatik olarak geri alınamaz.")
  .replace("the resume you choose may be shared with hiring companies so job opportunities reach you more easily.", "professional and contact details from your selected resume can be viewed by matching companies through the dashboard and API and imported into recruiting systems. Hidden sections, photos and references are excluded. Withdrawal stops future access; previously imported copies cannot be automatically recalled.");

async function main() {
  let changed = 0;
  await db.transaction(async (tx) => {
    const drafts = await tx.select().from(pages).where(and(eq(pages.slug, "privacy"), eq(pages.status, "draft"))).for("update");
    for (const draft of drafts) {
      const parsed = blockListSchema.safeParse(migrateLegacyBlocks(draft.draftBlocks));
      if (!parsed.success || !["tr", "en"].includes(draft.locale)) continue;
      const blocks = parsed.data;
      for (const block of blocks) {
        if (block.type !== "rich_text" || typeof block.content !== "object" || block.content === null) continue;
        if ("text" in block.content && typeof block.content.text === "string") block.content.text = updateText(block.content.text);
      }
      const optional = seedPages(draft.locale as "tr" | "en").find((page) => page.slug === "privacy")!.blocks.find((block) => block.id === "optional-import-and-ai")!;
      if (!blocks.some((block) => block.id === optional.id)) blocks.push(optional);
      if (JSON.stringify(blocks) === JSON.stringify(draft.draftBlocks)) continue;
      await tx.update(pages).set({ draftBlocks: blocks, version: sql`${pages.version} + 1` }).where(eq(pages.id, draft.id));
      await tx.insert(auditLog).values({ action: "prepare_release_draft", targetType: "page", targetId: draft.id, after: { locale: draft.locale, published: false } });
      changed++;
    }
    const [settings] = await tx.select().from(siteSettings).where(eq(siteSettings.id, 1)).for("update");
    const global = resolveGlobalSettings(settings ? migrateLegacySiteSettings(settings).settings : undefined);
    if (!global.contactEmail) global.contactEmail = "support@freehandcv.com";
    global.donation = { ...global.donation, enabled: false };
    if (!settings || JSON.stringify(settings.settings) !== JSON.stringify(global)) {
      await tx.insert(siteSettings).values({ id: 1, settings: global }).onConflictDoUpdate({ target: siteSettings.id, set: { settings: global, version: sql`${siteSettings.version} + 1` } });
      await tx.insert(auditLog).values({ action: "prepare_release_settings", targetType: "site_settings", after: { donationEnabled: false, contactEmail: global.contactEmail } });
    }
  });
  console.log(`Prepared ${changed} unpublished privacy draft(s); donation disabled. No content was published.`);
}
main().then(() => process.exit(0), (error) => { console.error(error instanceof Error ? error.name : "Preparation failed"); process.exit(1); });
