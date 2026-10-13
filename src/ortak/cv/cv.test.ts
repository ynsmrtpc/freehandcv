import { describe, expect, it } from "vitest";
import { atsPuani, kontroller, kontrolPuani } from "./kontroller";
import { ornekCv } from "./ornek";
import en from "../../../messages/en.json";
import tr from "../../../messages/tr.json";
import { BOLUMLER, SABLON_KIMLIKLERI, bosKalem, cvNormalize } from "./sema";
import {
  ONE_CIKAN_SABLONLAR,
  SISTEM_SABLON_LISTESI,
  SISTEM_SABLONLARI,
  bantTuru,
  kenarliMi,
  sistemTanimi,
  tasarimCoz,
  tasarimSemasi,
  vurgudaBeyazYaziVar,
} from "./tasarim";
import { beyazKontrast, dosyaAdi, guvenliAdres, satirlar, tarihAraligi, zenginParcalar } from "./yardimci";

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

describe("sistem şablonları", () => {
  const mesajlar = { tr, en } as Record<string, typeof tr>;

  it("en az 20 şablon var; kimlik listesi ve tanımlar birebir eşleşir", () => {
    expect(SABLON_KIMLIKLERI.length).toBeGreaterThanOrEqual(20);
    expect(Object.keys(SISTEM_SABLONLARI).sort()).toEqual([...SABLON_KIMLIKLERI].sort());
    expect(SISTEM_SABLON_LISTESI.map((s) => s.kimlik)).toEqual([...SABLON_KIMLIKLERI]);
  });

  it.each(SABLON_KIMLIKLERI)("%s şemaya uyar ve kimliği tutarlıdır", (k) => {
    const s = SISTEM_SABLONLARI[k];
    expect(s.kimlik).toBe(k);
    expect(tasarimSemasi.parse(s.tanim)).toEqual(s.tanim);
  });

  it.each(SABLON_KIMLIKLERI)("%s geçerli bir ATS puanı taşır", (k) => {
    const { ats, tanim } = SISTEM_SABLONLARI[k];
    expect(Number.isInteger(ats)).toBe(true);
    expect(ats).toBeGreaterThanOrEqual(1);
    expect(ats).toBeLessThanOrEqual(5);
    // Kenar çubuklu ya da renkli bantlı şablonlar 5 alamaz (dürüst puan).
    if (kenarliMi(tanim) || bantTuru(tanim) === "vurgu" || bantTuru(tanim) === "koyu") expect(ats).toBeLessThan(5);
  });

  it.each(SABLON_KIMLIKLERI)("%s için tr ve en ad/açıklama var", (k) => {
    for (const dil of ["tr", "en"]) {
      const m = mesajlar[dil];
      expect((m.Landing.sablonlar.adlar as Record<string, string>)[k]?.trim()).toBeTruthy();
      expect((m.Editor.tasarim.aciklamalar as Record<string, string>)[k]?.trim()).toBeTruthy();
    }
  });

  it("vurgu rengi üstünde beyaz yazı olan şablonların varsayılan rengi okunaklıdır (≥ 4,5:1)", () => {
    for (const s of SISTEM_SABLON_LISTESI) {
      if (vurgudaBeyazYaziVar(s.tanim)) expect(beyazKontrast(s.tanim.renkler.vurgu)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("şablonlar birbirinin kopyası değildir", () => {
    const imzalar = SISTEM_SABLON_LISTESI.map(({ tanim }) => JSON.stringify({ ...tanim, renkler: undefined }));
    expect(new Set(imzalar).size).toBe(imzalar.length);
  });

  it("öne çıkan şablonlar landing için 4–8 arasıdır", () => {
    expect(ONE_CIKAN_SABLONLAR.length).toBeGreaterThanOrEqual(4);
    expect(ONE_CIKAN_SABLONLAR.length).toBeLessThanOrEqual(8);
  });
});

describe("tasarım", () => {
  it("yeni seçenekler isteğe bağlıdır: ilk sürüm tanımı hâlâ geçerlidir", () => {
    const eski = {
      surum: 1,
      yerlesim: "tek-sutun",
      ustBilgi: {
        hizalama: "sol",
        foto: "yok",
        ayrac: "ince",
        unvan: "vurgu",
        adRengi: "koyu",
      },
      renkler: {
        vurgu: "#1f3a5f",
        metin: "#1f2937",
        soluk: "#4b5563",
        cizgi: "#d6dbe3",
      },
      tekRenk: false,
      yazi: { font: "inter", boyut: 10, satir: 1.4 },
      bolumBasligi: "alt-cizgi",
      maddeler: "nokta",
      yetenekler: "liste",
      iletisim: "ikonlu",
      ayracKarakteri: "·",
      kurum: "kalin",
      kenarBosluk: { ust: 12, alt: 12, yatay: 16 },
    };
    expect(() => tasarimSemasi.parse(eski)).not.toThrow();
  });

  it("kullanıcı yazı tipi seçince başlık yazı tipi de ona geçer", () => {
    const v = cvNormalize({ ayarlar: { sablon: "kurumsal", font: "lato" } });
    const t = tasarimCoz(sistemTanimi("kurumsal"), v.ayarlar);
    expect(t.yazi.font).toBe("lato");
    expect(t.yazi.baslikFont).toBeUndefined();
    const varsayilan = tasarimCoz(sistemTanimi("kurumsal"), cvNormalize({}).ayarlar);
    expect(varsayilan.yazi.baslikFont).toBe("playfair");
  });

  it("bant: ust-bant varsayılanı vurgu; kenar çubuğunda tam üst bilgi yoksa bant yok", () => {
    expect(bantTuru(sistemTanimi("teknik"))).toBe("vurgu");
    expect(bantTuru(sistemTanimi("ferah"))).toBe("acik");
    expect(bantTuru(sistemTanimi("modern"))).toBe("yok");
    expect(bantTuru({ ...sistemTanimi("kenar"), bant: "vurgu" })).toBe("yok");
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
