import { describe, expect, it } from "vitest";
import { migrateLegacyResume } from "./legacy";
import { sampleResume } from "./sample";
import { normalizeResume } from "./schema";

// The Turkish example resume as the old static app exported it (Turkish keys and values).
const legacyTr = {
  ayarlar: { sablon: "modern", renk: "#1f3a5f", foto: false, dil: "tr", gizli: ["referanslar"] },
  kisisel: {
    ad: "Deniz Aksoy",
    unvan: "Kıdemli Frontend Geliştirici",
    eposta: "deniz.aksoy@ornek.com",
    telefon: "0500 000 00 00",
    konum: "Kadıköy, İstanbul",
    linkedin: "linkedin.com/in/denizaksoy",
    github: "github.com/denizaksoy",
    ekler: [{ etiket: "Askerlik", deger: "Muaf" }],
  },
  ozet:
    "6 yıllık deneyime sahip frontend geliştiriciyim. E-ticaret ve finans alanlarında milyonlarca kullanıcıya ulaşan React ve Next.js uygulamaları geliştirdim. Performans, erişilebilirlik ve tasarım sistemleri konusunda ekip içinde sorumluluk alıyor; ürün ve tasarım ekipleriyle yakın çalışarak ölçülebilir sonuç üreten arayüzler geliştirmeyi hedefliyorum.",
  deneyim: [
    {
      id: "o1",
      pozisyon: "Kıdemli Frontend Geliştirici",
      kurum: "Örnek Teknoloji A.Ş.",
      konum: "İstanbul",
      baslangic: "Mar 2023",
      devam: true,
      maddeler: [
        "Ödeme akışını yeniden tasarlayarak sepet terk oranını **%18** düşürdüm.",
        "Ortak tasarım sistemini (60+ bileşen) kurdum; yeni ekran geliştirme süresi yaklaşık **%40** kısaldı.",
        "Core Web Vitals iyileştirmeleriyle LCP değerini 3,8 sn'den **1,9 sn**'ye indirdim.",
        "3 kişilik ekibe teknik mentorluk ve kod incelemesi yaptım.",
      ].join("\n"),
    },
    {
      id: "o2",
      pozisyon: "Frontend Geliştirici",
      kurum: "Deneme Yazılım Ltd.",
      konum: "İstanbul",
      baslangic: "Tem 2020",
      bitis: "Şub 2023",
      maddeler: [
        "Bankacılık müşteri paneli için React ve TypeScript ile 25+ ekran geliştirdim.",
        "Birim test kapsamını %20'den %75'e çıkardım (Jest, Testing Library).",
      ].join("\n"),
    },
  ],
  projeler: [
    {
      id: "o3",
      ad: "Açık Kaynak Takvim Bileşeni",
      rol: "Geliştirici",
      baslangic: "2022",
      bitis: "2023",
      teknolojiler: "React, TypeScript, Storybook",
      baglanti: "github.com/denizaksoy/takvim",
      aciklama: "Erişilebilir, klavyeyle kullanılabilen tarih seçici; haftalık 4 bin indirme.",
    },
  ],
  yetenekler: [
    { id: "o4", kategori: "Diller", liste: "TypeScript, JavaScript, HTML, CSS" },
    { id: "o5", kategori: "Kütüphaneler", liste: "React, Next.js, Redux Toolkit, TanStack Query, Tailwind CSS" },
    { id: "o6", kategori: "Test ve Araçlar", liste: "Jest, Playwright, Storybook, Git, Figma" },
  ],
  egitim: [
    {
      id: "o7",
      okul: "Örnek Üniversitesi",
      bolum: "Bilgisayar Mühendisliği",
      derece: "Lisans",
      baslangic: "2016",
      bitis: "2020",
      not: "3,10 / 4,00",
    },
  ],
  sertifikalar: [{ id: "o8", ad: "Professional Scrum Master I", kurum: "Scrum.org", tarih: "2024" }],
  diller: [
    { id: "o9", dil: "İngilizce", seviye: "C1 – İleri" },
    { id: "o10", dil: "Almanca", seviye: "A2 – Başlangıç" },
  ],
  referanslar: [{ id: "o11", ad: "Referanslar talep üzerine iletilecektir." }],
  ilgi: "Fotoğrafçılık, koşu, açık kaynak katkısı",
};

describe("migrateLegacyResume", () => {
  it("converts the old Turkish sample to the English sample", () => {
    expect(normalizeResume(legacyTr)).toEqual(sampleResume("tr"));
  });

  it("is idempotent: English input passes through unchanged", () => {
    const english = sampleResume("tr");
    expect(migrateLegacyResume(english)).toEqual(english);
    const once = migrateLegacyResume(legacyTr);
    expect(migrateLegacyResume(once)).toEqual(once);
  });

  it("translates settings values and section ids by meaning", () => {
    const v = normalizeResume({
      ayarlar: {
        sablon: "ferah",
        boyut: "buyuk",
        aralik: "ferah",
        bolumSirasi: ["deneyim", "ozet"],
        gizli: ["ilgi"],
        basliklar: { ozet: "Hakkımda" },
      },
    });
    expect(v.settings.template).toBe("airy");
    expect(v.settings.size).toBe("large");
    expect(v.settings.spacing).toBe("relaxed");
    expect(v.settings.sectionOrder.slice(0, 2)).toEqual(["experience", "summary"]);
    expect(v.settings.hiddenSections).toEqual(["interests"]);
    expect(v.settings.sectionTitles).toEqual({ summary: "Hakkımda" });
  });

  it("maps the legacy 'yonetici' template and partial shapes", () => {
    expect(normalizeResume({ ayarlar: { sablon: "yonetici" } }).settings.template).toBe("elegant");
    const v = normalizeResume({ kisisel: { foto: "data:x", ekler: [{ etiket: "Ehliyet", deger: "B" }] } });
    expect(v.personal.photo).toBe("data:x");
    expect(v.personal.extras).toEqual([{ label: "Ehliyet", value: "B" }]);
  });

  it("leaves non-objects alone", () => {
    expect(migrateLegacyResume(null)).toBeNull();
    expect(migrateLegacyResume("x")).toBe("x");
  });
});
