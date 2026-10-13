// Başlangıç içeriğini veritabanına yazar: landing (tr, en) ve site ayarları satırı.
// Var olan kayda dokunmaz; tekrar çalıştırmak güvenlidir. Kullanım: pnpm icerik:tohumla
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { db } from "../src/sunucu/db";
import { sayfalar, siteAyarlari } from "../src/sunucu/db/sema";
import { ANA_SAYFA } from "../src/sunucu/icerik/sayfalar";
import { varsayilanLandingBloklari } from "../src/ortak/varsayilanIcerik";
import { tohumSayfalari } from "./tohum-sayfalari";
import en from "../messages/en.json";
import tr from "../messages/tr.json";

async function main() {
  const grup = randomUUID();
  for (const dil of ["tr", "en"] as const) {
    const var_ = await db
      .select({ id: sayfalar.id })
      .from(sayfalar)
      .where(and(eq(sayfalar.dil, dil), eq(sayfalar.slug, ANA_SAYFA)))
      .limit(1);
    if (var_.length) {
      console.log(`ana sayfa (${dil}) zaten var, atlandı`);
      continue;
    }
    const meta = (dil === "tr" ? tr : en).Meta;
    const bloklar = varsayilanLandingBloklari(dil);
    await db.insert(sayfalar).values({
      slug: ANA_SAYFA,
      tur: "sabit",
      dil,
      ceviriGrubu: grup,
      baslik: meta.varsayilanBaslik,
      metaBaslik: meta.varsayilanBaslik,
      metaAciklama: meta.varsayilanAciklama,
      durum: "yayinda",
      bloklar,
      yayindakiBloklar: bloklar,
    });
    console.log(`ana sayfa (${dil}) eklendi`);
  }
  // Diğer sabit sayfalar: her slug için diller aynı çeviri grubunda.
  const gruplar = new Map<string, string>();
  for (const dil of ["tr", "en"] as const) {
    for (const s of tohumSayfalari(dil)) {
      const var_ = await db
        .select({ id: sayfalar.id })
        .from(sayfalar)
        .where(and(eq(sayfalar.dil, dil), eq(sayfalar.slug, s.slug)))
        .limit(1);
      if (var_.length) {
        console.log(`${s.slug} (${dil}) zaten var, atlandı`);
        continue;
      }
      if (!gruplar.has(s.slug)) gruplar.set(s.slug, randomUUID());
      await db.insert(sayfalar).values({
        slug: s.slug,
        tur: s.tur,
        dil,
        ceviriGrubu: gruplar.get(s.slug),
        baslik: s.baslik,
        metaBaslik: s.metaBaslik,
        metaAciklama: s.metaAciklama,
        durum: s.yayinla ? "yayinda" : "taslak",
        indeks: s.yayinla,
        bloklar: s.bloklar,
        yayindakiBloklar: s.yayinla ? s.bloklar : null,
      });
      console.log(`${s.slug} (${dil}) eklendi${s.yayinla ? "" : " — TASLAK, yayınlanmadı"}`);
    }
  }
  await db.insert(siteAyarlari).values({ id: 1 }).onConflictDoNothing();
  console.log("site ayarları satırı hazır");
}

main().then(
  () => process.exit(0),
  (hata) => {
    console.error(hata);
    process.exit(1);
  },
);
