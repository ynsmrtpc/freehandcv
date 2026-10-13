import { describe, expect, it } from "vitest";
import { atsPuani, kontroller, kontrolPuani } from "./kontroller";
import { ornekCv } from "./ornek";
import { BOLUMLER, bosKalem, cvNormalize } from "./sema";
import { SISTEM_SABLONLARI, sistemTanimi, tasarimCoz, tasarimSemasi } from "./tasarim";
import { dosyaAdi, guvenliAdres, satirlar, tarihAraligi, zenginParcalar } from "./yardimci";

describe("cvNormalize", () => {
  it("boş girdiden geçerli CV üretir", () => {
    const v = cvNormalize(null);
    expect(v.ayarlar.sablon).toBe("modern");
    expect(v.ayarlar.bolumSirasi).toEqual([...BOLUMLER]);
    expect(v.deneyim).toEqual([]);
  });

  it("eski sürümün 'yonetici' şablonunu 'zarif'e çevirir", () => {
    expect(cvNormalize({ ayarlar: { sablon: "yonetici" } }).ayarlar.sablon).toBe("zarif");
  });

  it("bozuk alanları varsayılana düşürür, eksik bölümleri sıraya ekler", () => {
    const v = cvNormalize({
      ayarlar: { renk: "kırmızı", boyut: "dev", bolumSirasi: ["deneyim", "yok", "deneyim"] },
      deneyim: "liste değil",
      kisisel: { ad: 42 },
    });
    expect(v.ayarlar.renk).toBe("#1f3a5f");
    expect(v.ayarlar.boyut).toBe("orta");
    expect(v.ayarlar.bolumSirasi[0]).toBe("deneyim");
    expect(v.ayarlar.bolumSirasi).toHaveLength(BOLUMLER.length);
    expect(v.deneyim).toEqual([]);
    expect(v.kisisel.ad).toBe("");
  });

  it("kimliği olmayan kaleme kimlik verir", () => {
    const v = cvNormalize({ deneyim: [{ pozisyon: "X" }] });
    expect(v.deneyim[0].id).toMatch(/\w+/);
  });

  it("bosKalem şemadaki tüm alanlarla gelir", () => {
    const k = bosKalem("deneyim");
    expect(k).toMatchObject({ pozisyon: "", devam: false, maddeler: "" });
  });
});

describe("tasarım", () => {
  it("5 sistem şablonu şemaya uyar", () => {
    for (const s of Object.values(SISTEM_SABLONLARI)) expect(() => tasarimSemasi.parse(s.tanim)).not.toThrow();
  });

  it("tek renkli şablonda kullanıcı rengi uygulanmaz", () => {
    const v = cvNormalize({ ayarlar: { sablon: "ats", renk: "#8b1e3f" } });
    expect(tasarimCoz(sistemTanimi("ats"), v.ayarlar).renkler.vurgu).toBe("#111111");
    expect(tasarimCoz(sistemTanimi("modern"), v.ayarlar).renkler.vurgu).toBe("#8b1e3f");
  });

  it("ATS puanı sistem şablonlarında elle verilen değerdir", () => {
    expect(atsPuani(sistemTanimi("modern"))).toBe(5);
    expect(atsPuani(sistemTanimi("kenar"))).toBe(4);
  });
});

describe("yardımcılar", () => {
  it("güvensiz bağlantı şemalarını reddeder", () => {
    expect(guvenliAdres("javascript:alert(1)")).toBe("");
    expect(guvenliAdres("data:text/html,x")).toBe("");
    expect(guvenliAdres("github.com/x")).toBe("https://github.com/x");
    expect(guvenliAdres("mailto:a@b.c")).toBe("mailto:a@b.c");
  });

  it("maddeleri ayıklar, kalın işaretini parçalar", () => {
    expect(satirlar("- bir\n• iki\n\n  üç ")).toEqual(["bir", "iki", "üç"]);
    expect(zenginParcalar("a **b** c")).toEqual([
      { metin: "a ", kalin: false },
      { metin: "b", kalin: true },
      { metin: " c", kalin: false },
    ]);
  });

  it("tarih aralığı ve dosya adı", () => {
    expect(tarihAraligi("Mar 2023", "", true, "Günümüz")).toBe("Mar 2023 – Günümüz");
    expect(dosyaAdi("Şükrü Çağlar Öz")).toBe("Sukru_Caglar_Oz_CV");
  });
});

describe("IK kontrolü", () => {
  it("örnek CV yüksek puan alır", () => {
    const v = ornekCv("tr");
    const { puan } = kontrolPuani(kontroller(v, sistemTanimi("modern"), 1));
    expect(puan).toBeGreaterThanOrEqual(80);
  });

  it("T.C. kimlik numarasını yakalar", () => {
    const v = cvNormalize({ ozet: "TC: 12345678901" });
    const kvkk = kontroller(v, sistemTanimi("modern"), 1).find((k) => k.kimlik === "kvkk");
    expect(kvkk?.durum).toBe("uyari");
  });

  it("renkli şablonda düşük kontrastı uyarır", () => {
    const v = cvNormalize({ ayarlar: { sablon: "kenar", renk: "#ffe600" } });
    const k = kontroller(v, sistemTanimi("kenar"), 1).find((x) => x.kimlik === "kontrast");
    expect(k?.durum).toBe("uyari");
  });
});
