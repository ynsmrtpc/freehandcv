import { describe, expect, it } from "vitest";
import { BLOK_SEMALARI, BLOK_TURLERI, blokListesiSemasi, yeniBlok } from "./bloklar";
import { varsayilanLandingBloklari } from "./varsayilanIcerik";
import { tohumSayfalari } from "../../scripts/tohum-sayfalari";

describe("bloklar", () => {
  it("varsayılan landing blokları şemaya uyar", () => {
    for (const dil of ["tr", "en"] as const) {
      const sonuc = blokListesiSemasi.safeParse(varsayilanLandingBloklari(dil));
      expect(sonuc.error?.issues ?? []).toEqual([]);
    }
  });

  it("tohum sayfaları şemaya uyar", () => {
    for (const dil of ["tr", "en"] as const)
      for (const s of tohumSayfalari(dil)) {
        const sonuc = blokListesiSemasi.safeParse(s.bloklar);
        expect([s.slug, sonuc.error?.issues ?? []]).toEqual([s.slug, []]);
      }
  });

  it("her türden yeni blok şemaya uyar", () => {
    for (const tur of BLOK_TURLERI) {
      const b = yeniBlok(tur);
      expect(BLOK_SEMALARI[tur].safeParse(b.icerik).success).toBe(true);
    }
  });

  it("güvensiz bağlantıyı reddeder", () => {
    const b = varsayilanLandingBloklari("tr");
    const hero = structuredClone(b[0]) as Extract<(typeof b)[number], { tur: "hero" }>;
    hero.icerik.anaButon.baglanti = "javascript:alert(1)";
    expect(blokListesiSemasi.safeParse([hero]).success).toBe(false);
  });
});
