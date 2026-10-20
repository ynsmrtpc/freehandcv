import { defineExample } from "../define";

export default defineExample({
  slug: "muhasebeci-cv-ornegi",
  title: "Muhasebeci CV Örneği",
  occupation: "Muhasebeci",
  category: "finance",
  experienceLevel: "mid",
  metaTitle: "Muhasebeci CV Örneği ve Yazım Rehberi",
  metaDescription:
    "SMMM ruhsatlı, 7 yıllık deneyimle yazılmış muhasebeci CV örneği. Beyanname, ay sonu kapanış ve ATS için ipuçları; ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "Finans müdürleri ve mali müşavirler bir muhasebeci CV'sinde önce ruhsat durumuna, hangi beyannameleri hazırladığına ve hangi muhasebe programlarını kullandığına bakar. Bu örnek, mali müşavirlik bürosundan şirket içi muhasebeye geçmiş 7 yıllık bir muhasebecinin bu bilgileri nasıl sunduğunu gösteriyor.",
    sections: [
      {
        heading: "Özet: ruhsat durumu ve uzmanlık alanı",
        body: "Muhasebede ilk sorulan soru ruhsat durumudur. SMMM ruhsatın varsa yılıyla birlikte yaz; stajdaysan ya da yeterlilik sınavlarına hazırlanıyorsan bunu da açıkça belirt. Belirsiz bırakılan ruhsat bilgisi, işe alım yapan kişinin seni telefonda aramadan elemesine neden olabilir.\n\nArdından deneyim süreni, hangi tür işletmelerle çalıştığını (üretim, ticaret, hizmet; şahıs, limited, anonim) ve en çok hakim olduğun konuları yaz: ay sonu kapanış, KDV iadesi, enflasyon düzeltmesi gibi. Bu üç bilgi, CV'nin bir finans müdürü tarafından okunmaya devam edilip edilmeyeceğini belirler.",
      },
      {
        heading: "Deneyim maddelerini süre ve doğrulukla ölç",
        body: "Muhasebede başarı genellikle hız, doğruluk ve zamanında beyandır. Maddelerini bu ölçütlerle yaz: ay sonu kapanış kaç iş gününde bitiyor, ayda kaç fatura işleniyor, kaç mükellefin defterini tutuyordun, beyanname dönemlerinde gecikme ya da ceza oldu mu?\n\n- Zayıf: \"Ay sonu kapanış işlemlerini yaptım.\"\n- Güçlü: \"Banka ve cari mutabakatlarını haftalık takvime bağlayarak ay sonu kapanışını **8. iş gününden 4. iş gününe** çektim.\"\n\nŞirket içi rollerde bağımsız denetim, YMM ve vergi incelemesi süreçlerine nasıl destek verdiğini de ekle. Bu deneyim, kıdemli muhasebe ve muhasebe şefi pozisyonlarında doğrudan sorulur.",
      },
      {
        heading: "Vergi ve e-dönüşüm bilgisini net yaz",
        body: "Hazırladığın beyannameleri adıyla listele: KDV, muhtasar ve prim hizmet beyannamesi, geçici vergi, kurumlar vergisi, gelir vergisi. Yalnızca hazırlığına katkı verdiğin beyannameleri \"hazırladım\" diye yazma; \"hazırlanmasına destek verdim\" demek hem dürüst hem de mülakatta seni korur.\n\ne-Fatura, e-Arşiv, e-İrsaliye ve e-Defter süreçleri artık neredeyse her ilanda geçer. e-Defter berat yükleme, entegratör kullanımı ve GİB portalı deneyimini belirt.",
      },
      {
        heading: "Programlar ve ATS anahtar kelimeleri",
        body: "Büyük şirketlerin çoğu muhasebe başvurularını aday takip sistemiyle (ATS) tarar. Kullandığın programları ilandaki yazımıyla yaz: Logo Tiger, Logo Go, Mikro, Netsis, SAP FI gibi. Excel bilgisini \"ileri düzey\" diye geçmek yerine kullandığın özellikleri say: pivot tablo, DÜŞEYARA/XLOOKUP, Power Query.\n\nTekdüzen Hesap Planı, VUK, mutabakat, sabit kıymet ve amortisman, kur değerlemesi, maliyet muhasebesi gibi terimleri yetkinlikler bölümünde gruplandır. ATS uyumlu sade bir şablon, tabloların ve çok sütunlu düzenin yanlış okunmasını önler.",
      },
      {
        heading: "Eğitim ve sertifikalar",
        body: "İşletme, iktisat ya da muhasebe ve finans eğitimini üniversite adıyla yaz. SMMM ruhsatını sertifikalar bölümünde de göster; TESMER veya meslek odası eğitimleri, enflasyon muhasebesi ve TFRS gibi kurslar ilanla ilgiliyse kısa bir listede yer alsın. Uluslararası şirketlere başvuruyorsan İngilizce seviyeni Avrupa Ortak Çerçevesi ya da YDS puanıyla belirt.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Ruhsat durumunu yazmamak ya da staj süresini belirsiz bırakmak.\n- Müşteri veya şirket finansal verisi paylaşmak: ciro, kâr ve müşteri adı yerine oran ve adet kullan.\n- Her işte \"genel muhasebe işlemleri\" yazıp geçmek: hangi işlemi, hangi hacimde yaptığını belirt.\n- Programları seviye belirtmeden uzun bir liste halinde yazmak: günlük kullandıklarını başa al.\n- Erkek adaylarda askerlik durumunu atlamak: şirket içi muhasebe ilanlarında sıkça sorulur.",
      },
    ],
  },
  content: {
    settings: {
      template: "ats",
      color: "#1e3a5f",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Burak Yalçınkaya",
      title: "Muhasebe Uzmanı (SMMM)",
      email: "burak.yalcinkaya@ornek.com",
      phone: "0500 000 00 00",
      location: "Kocaeli",
      linkedin: "linkedin.com/in/burakyalcinkaya-ornek",
      extras: [{ label: "Askerlik", value: "Tamamlandı" }],
    },
    summary:
      "7 yıllık deneyime sahip, SMMM ruhsatlı muhasebeciyim. 3 yıl mali müşavirlik bürosunda farklı sektörlerden mükelleflerle, son 4 yıldır ihracat yapan bir üretim şirketinde şirket içi muhasebede çalışıyorum. Ay sonu kapanış, KDV ve kurumlar vergisi beyannameleri, e-Defter ve ihracat kaynaklı KDV iadesi süreçlerinde deneyimliyim; Logo Tiger ve Excel ile günlük işleri otomatikleştiriyorum.",
    experience: [
      {
        position: "Muhasebe Uzmanı",
        company: "Körfez Endüstriyel Ambalaj San. ve Tic. A.Ş.",
        location: "Kocaeli",
        start: "Eyl 2022",
        current: true,
        bullets: [
          "Ayda ortalama 1.200 alış ve satış faturasının e-Fatura ve e-Arşiv kayıtlarını Logo Tiger'da işliyor, cari ve banka mutabakatlarını yürütüyorum.",
          "Mutabakatları haftalık takvime bağlayıp kapanış kontrol listesi hazırlayarak ay sonu kapanışını **8. iş gününden 4. iş gününe** çektim.",
          "KDV, muhtasar ve prim hizmet ile geçici vergi beyannamelerini hazırladım; 4 yılda **hiçbir beyanname süresi geçmedi**, gecikme cezası oluşmadı.",
          "İhracat istisnası kapsamındaki KDV iade dosyalarını YMM ile birlikte hazırladım; 2024 yılında 9 dönemlik iade talebi sonuçlandı.",
          "Excel'de Power Query ile banka ekstrelerini muhasebe kayıtlarıyla eşleştiren şablon kurdum; günlük banka kontrolü **yaklaşık 2 saatten 30 dakikaya** indi.",
          "2023 yıl sonu bilançosunun VUK kapsamındaki enflasyon düzeltmesini bağımsız denetim ekibiyle birlikte tamamladım.",
        ].join("\n"),
      },
      {
        position: "Muhasebe Elemanı (SMMM Stajyeri)",
        company: "Defne Mali Müşavirlik",
        location: "Kocaeli",
        start: "Tem 2019",
        end: "Ağu 2022",
        bullets: [
          "Ticaret ve hizmet sektöründen 35 şahıs ve limited şirket mükellefin defter kayıtlarını Mikro'da tuttum.",
          "Mükelleflerin aylık KDV ve muhtasar beyannamelerini hazırlayarak SMMM onayına sundum; yıllık gelir ve kurumlar vergisi beyannamelerinin hazırlanmasına destek verdim.",
          "SGK işe giriş ve çıkış bildirgelerini ve aylık bordroları hazırladım; ayda ortalama 120 çalışanın bordrosunu yönettim.",
          "Mükelleflerin e-Defter geçişinde hesap planı düzenlemesi ve berat yükleme süreçlerini yürüttüm.",
        ].join("\n"),
      },
    ],
    skills: [
      {
        category: "Muhasebe",
        items: "Tekdüzen Hesap Planı, genel muhasebe, ay sonu kapanış, mutabakat, sabit kıymet ve amortisman, kur değerlemesi, enflasyon düzeltmesi",
      },
      {
        category: "Vergi",
        items: "KDV, muhtasar ve prim hizmet beyannamesi, geçici vergi, kurumlar vergisi, ihracat KDV iadesi",
      },
      { category: "E-dönüşüm", items: "e-Fatura, e-Arşiv, e-İrsaliye, e-Defter, GİB portalları" },
      { category: "Programlar", items: "Logo Tiger, Mikro, Excel (pivot tablo, DÜŞEYARA, Power Query)" },
    ],
    education: [
      {
        school: "Marmara Üniversitesi",
        field: "İşletme",
        degree: "Lisans",
        start: "2015",
        end: "2019",
      },
    ],
    certifications: [
      { name: "Serbest Muhasebeci Mali Müşavir (SMMM) Ruhsatı", issuer: "TÜRMOB", date: "2023" },
      { name: "Enflasyon Muhasebesi Eğitimi", issuer: "Meslek odası eğitim programı", date: "2023" },
    ],
    languages: [{ language: "İngilizce", level: "B1 – Orta" }],
    references: [],
    interests: "Koşu, kişisel finans okumaları, masa tenisi",
  },
});
