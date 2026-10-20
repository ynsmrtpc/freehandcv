import { defineExample } from "../define";

export default defineExample({
  slug: "kasiyer-cv-ornegi",
  title: "Kasiyer CV Örneği",
  occupation: "Kasiyer",
  category: "hospitality",
  experienceLevel: "entry",
  metaTitle: "Kasiyer CV Örneği ve Yazım Rehberi",
  metaDescription:
    "İlk iş deneyimini POS, kasa kapanışı ve iade işlemleriyle anlatan kasiyer CV örneği. Tek sayfada vardiya ve beceri ipuçları; ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "Market ve mağaza yöneticileri kasiyer alırken uzun bir geçmiş beklemez; adayın para ve ödeme işlemlerinde dikkatli olduğunu, yoğun saatlerde sakin kaldığını ve vardiyalara uyabildiğini görmek ister. Bu örnek, bir yıllık yarı zamanlı market deneyimi olan genç bir kasiyerin bunu tek sayfada nasıl anlattığını gösteriyor.",
    sections: [
      {
        heading: "Özet: deneyim, mağaza türü ve uygunluk",
        body: "Kasiyer CV'sinde özet iki cümle olsun. İlki ne kadar süredir ve hangi tür işletmede kasada çalıştığını söylesin: süpermarket, giyim mağazası, kafe, akaryakıt istasyonu market. İkincisi işverenin en çok sorduğu bilgiyi versin: tam ya da yarı zamanlı çalışma tercihin, hafta sonu ve akşam vardiyasına uygunluğun.\n\nHiç deneyimin yoksa dürüstçe yaz ve bunun yerine okulda, gönüllü işlerde ya da aile işletmesinde para ve müşteriyle ilgili yaptığın işleri öne çıkar.",
      },
      {
        heading: "Kasa işlemlerini adıyla yaz",
        body: "Kasiyerlik basit görünse de işveren hangi işlemleri bildiğini merak eder, çünkü bunlar eğitim süresini kısaltır. POS cihazıyla kartlı ve temassız ödeme, nakit ve para üstü, yemek kartı, iade ve değişim, iptal işlemleri, kampanya ve indirim kodları, sadakat kartı tanımlama, gün sonu kasa kapanışı ve kasa sayımı bunların başında gelir.\n\n- Zayıf: \"Markette kasada çalıştım.\"\n- Güçlü: \"Günde ortalama **250 müşterinin** ödemesini aldım; 12 ay boyunca gün sonu kasa kapanışında **fark vermedim**.\"\n\nKasa farkı vermemek bu meslekte en güçlü kanıttır. Gerçekten öyleyse mutlaka yaz.\n\nKasa açılışında teslim aldığın bozuk parayı saymak, gün içinde kasada biriken fazla nakdi sorumluya teslim etmek ve gün sonunda POS raporunu kasa sayımıyla karşılaştırmak gibi adımları biliyorsan bunları da kısaca belirt. Bu ayrıntılar, işverene para güvenliği kurallarına alışkın olduğunu gösterir.",
      },
      {
        heading: "Müşteri iletişimi ve yoğun saatler",
        body: "Kasiyer çoğu zaman müşterinin mağazadan çıkmadan önce gördüğü son kişidir. İade isteyen ya da fiyat etiketine itiraz eden bir müşteriyle nasıl ilgilendiğini, kuyruk uzadığında ne yaptığını kısa maddelerle anlat. Raf düzeni, etiket kontrolü ya da mal kabul gibi kasa dışı işlere de destek verdiysen bunları ekle; küçük mağazalarda bu çok yönlülük tercih sebebidir.",
      },
      {
        heading: "Beceriler ve anahtar kelimeler",
        body: "Kasiyer ilanlarında sık geçen ifadeleri yetkinliklerde kullan: kasa işlemleri, POS, nakit yönetimi, kasa kapanışı, iade ve değişim, barkod sistemi, müşteri hizmetleri, raf düzeni, etiket kontrolü. Temel bilgisayar kullanımı ve hızlı, doğru hesap yapabilmek de eklenebilir. Bildiğin bir yabancı dil, turistik bölgelerde ve büyük şehir merkezlerinde avantajdır; seviyesini dürüstçe belirt.",
      },
      {
        heading: "Öğrenciysen ya da ilk işinse",
        body: "Kasiyerlik birçok kişi için ilk iştir ve bu bir dezavantaj değildir. Hâlâ okuyorsan okulunu, beklenen mezuniyet yılını ve ders programına uygun çalışma saatlerini yaz. Staj, kermes, okul kantini, aile işletmesinde tezgâh başında geçen zaman gibi deneyimleri de kısa birer satırla ekleyebilirsin. Önemli olan, para ve müşteriyle ilgili sorumluluk aldığını göstermektir.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- CV'yi gereksiz bilgilerle iki sayfaya uzatmak: tek sayfa yeterli.\n- Bildiğin kasa işlemlerini yazmamak: iade, iptal ve kasa kapanışı ilk sorulan konulardır.\n- Çalışabileceğin gün ve saatleri belirtmemek.\n- \"Güler yüzlüyüm, dürüstüm\" gibi kanıtsız sıfatlar kullanmak: kasa farkı vermediğini yazmak daha güçlüdür.\n- Telefon numarasını ya da e-postayı yanlış yazmak: kontrol etmeden gönderme.",
      },
    ],
  },
  content: {
    settings: {
      template: "light-sidebar",
      color: "#0369a1",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Elif Sarıgül",
      title: "Kasiyer",
      email: "elif.sarigul@ornek.com",
      phone: "0500 000 00 00",
      location: "Selçuklu, Konya",
      extras: [{ label: "Çalışma tercihi", value: "Tam veya yarı zamanlı; hafta sonu ve akşam vardiyasına uygun" }],
    },
    summary:
      "Süpermarkette bir yıllık yarı zamanlı kasiyerlik deneyimim var. POS ile kartlı ve nakit ödeme, iade ve gün sonu kasa kapanışı işlemlerini yapıyorum; 12 ay boyunca kasa farkı vermedim.",
    experience: [
      {
        position: "Kasiyer (Yarı Zamanlı)",
        company: "Sille Gıda Marketleri",
        location: "Konya",
        start: "Eyl 2024",
        current: true,
        bullets: [
          "Hafta sonu ve akşam vardiyalarında günde ortalama **250 müşterinin** ödemesini POS ve nakit olarak aldım.",
          "12 ay boyunca gün sonu kasa kapanışı ve sayımında **kasa farkı vermedim**.",
          "İade, değişim ve iptal işlemlerini mağaza kurallarına göre yaptım; çözemediğim durumları vardiya sorumlusuna ilettim.",
          "Yoğun olmayan saatlerde raf düzeni ve fiyat etiketi kontrolüne destek verdim.",
        ].join("\n"),
      },
      {
        position: "Satış Danışmanı (Sezonluk)",
        company: "Kuleyolu Giyim Mağazası",
        location: "Konya",
        start: "Haz 2024",
        end: "Ağu 2024",
        bullets: [
          "Yaz indirim döneminde mağaza içinde müşterilere beden ve ürün konusunda yardımcı oldum.",
          "Yoğun günlerde kasaya geçerek ödeme ve poşetleme işlerine destek verdim.",
        ].join("\n"),
      },
    ],
    skills: [
      { category: "Kasa işlemleri", items: "POS ile kartlı ve temassız ödeme, nakit ve para üstü, yemek kartı, iade ve değişim, kasa kapanışı ve sayımı" },
      { category: "Mağaza", items: "Barkod sistemi, raf düzeni, fiyat etiketi kontrolü, kampanya ve indirim uygulamaları" },
      { category: "Diğer", items: "Müşteri iletişimi, temel bilgisayar kullanımı" },
    ],
    education: [
      {
        school: "Anadolu Lisesi",
        degree: "Lise",
        location: "Konya",
        start: "2020",
        end: "2024",
      },
    ],
    languages: [{ language: "İngilizce", level: "A2 – Temel" }],
    references: [],
  },
});
