import { defineExample } from "../define";

export default defineExample({
  slug: "yazilim-test-uzmani-cv-ornegi",
  title: "Yazılım Test Uzmanı CV Örneği",
  occupation: "Yazılım Test Uzmanı",
  category: "technology",
  experienceLevel: "mid",
  metaTitle: "Yazılım Test Uzmanı CV Örneği ve Yazım Rehberi",
  metaDescription:
    "Manuel ve otomasyon testi deneyimiyle yazılmış yazılım test uzmanı CV örneği. Hata, kapsam ve test otomasyonu maddeleri için ipuçları; ücretsiz düzenle.",
  guide: {
    intro:
      "Test ve kalite güvence ekiplerinin yöneticileri bir CV'de önce manuel testten otomasyona ne kadar ilerlediğine, hangi araçlarla çalıştığına ve ürünün kalitesine somut olarak ne kattığına bakar. Bu örnek, mobil bankacılık ve sigorta projelerinde 6 yıl çalışmış bir test uzmanının bu soruları tek sayfada nasıl cevapladığını gösteriyor.",
    sections: [
      {
        heading: "Özet: test türleri, alan ve otomasyon dengesi",
        body: "Test uzmanı özetinde \"detaycı ve dikkatli\" demek yerine hangi test türlerinde çalıştığını yaz: fonksiyonel, regresyon, API, performans, mobil ya da kabul testleri. Çalıştığın alanı (bankacılık, e-ticaret, sigorta, telekom) ve manuel test ile otomasyon arasındaki dengeyi de belirt; ilanların çoğu bu oranı merak eder.\n\nÖrneğin: \"6 yıldır bankacılık ve sigorta uygulamalarını test ediyorum; son 3 yılda zamanımın çoğunu Playwright ve REST Assured ile otomasyon testlerine ayırıyorum.\"",
      },
      {
        heading: "Maddelerde kaliteyi ölçülebilir göster",
        body: "Test işinin sonuçları sayılarla anlatılabilir: canlıya kaçan hata sayısı, regresyon süresi, otomasyon kapsamı, kararsız (flaky) test oranı, hata bulma aşaması. \"Testleri yaptım\" ifadesi iş tanımıdır; madde ise bu işin neyi değiştirdiğini anlatır.\n\n- Zayıf: \"Regresyon testlerini yürüttüm.\"\n- Güçlü: \"Elle yürütülen 420 regresyon senaryosunun 310'unu Playwright ile otomatikleştirdim; sürüm öncesi regresyon süresi **3 günden 5 saate** indi.\"\n\nBulduğun hata sayısını tek başına yazmak yerine önem derecesini ve etkisini anlat: canlı ortamda ödeme akışını bozacak kritik bir hatayı yakalamak, yüz küçük arayüz hatasından daha anlamlıdır.",
      },
      {
        heading: "Yetkinlikler ve ATS anahtar kelimeleri",
        body: "Yetkinlikleri test yöntemleri, otomasyon araçları, API ve performans testi, test yönetimi ve programlama olarak grupla. İlanlarda sık geçen ifadeler şunlardır: test senaryosu yazımı, test planı, regresyon testi, smoke test, UAT, Selenium, Playwright, Cypress, Appium, Postman, REST Assured, JMeter, k6, Cucumber, BDD, Jira, Xray, TestRail, SQL, Java, JavaScript veya TypeScript, CI/CD.\n\nOtomasyon yazdığın dili açıkça belirt. \"Selenium biliyorum\" ifadesi, Java ile mi yoksa Python ile mi çalıştığını söylemediği için eksik kalır.",
      },
      {
        heading: "ISTQB ve diğer sertifikalar",
        body: "Test alanında en tanınan sertifika ISTQB Foundation Level'dır (CTFL); birçok ilanda doğrudan istenir ya da artı olarak belirtilir. İleri seviye ISTQB modülleri veya çevik test sertifikaları, kıdemli rollere geçerken ayırt edici olabilir. Sertifikanın tam adını ve alındığı yılı yaz.\n\nSertifika bir başlangıçtır; asıl kanıt, test otomasyon çatısını nasıl kurduğunu ya da bir test sürecini nasıl iyileştirdiğini anlatan maddelerdir.",
      },
      {
        heading: "Otomasyon çatısı ve süreç katkısı",
        body: "Orta seviyede bir test uzmanından yalnızca test yazması değil, test altyapısına katkı sağlaması beklenir. Page Object yapısı, test verisi yönetimi, paralel koşum, raporlama ve CI hattına entegrasyon gibi konularda ne yaptığını yaz. Kararsız testleri azalttıysan bu, ekiplerin otomasyona güvenini artıran önemli bir sonuçtur.\n\nGeliştiricilerle birlikte kabul kriteri yazma, sprint planlamasında test tahmini verme ve hata kök neden toplantılarına katılma gibi süreç katkılarını da bir maddede göster.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Yalnızca \"test ettim\" demek: hangi akışı, hangi yöntemle ve hangi sonuçla test ettiğini yaz.\n- Otomasyon araçlarını dil belirtmeden listelemek.\n- Bulunan hata sayısını önem derecesi vermeden övünç kaynağı yapmak.\n- Müşteri adı, gerçek hesap bilgisi ya da test ortamı adresi paylaşmak.\n- Manuel test deneyimini küçümsemek: keşif testi ve alan bilgisi, otomasyon kadar değerlidir.",
      },
    ],
  },
  content: {
    settings: {
      template: "light-sidebar",
      color: "#15803d",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Gizem Akbulut",
      title: "Yazılım Test Uzmanı (QA Otomasyon)",
      email: "gizem.akbulut@ornek.com",
      phone: "0500 000 00 00",
      location: "Ankara",
      linkedin: "linkedin.com/in/gizemakbulut-ornek",
      github: "github.com/gizemakbulut-ornek",
    },
    summary:
      "6 yıldır bankacılık, sigorta ve kamu projelerinde fonksiyonel, API ve regresyon testleri yürüten yazılım test uzmanıyım. Son 3 yılda zamanımın büyük bölümünü Playwright, REST Assured ve Appium ile test otomasyonuna ayırıyorum. Otomasyon çatısı kurma, test verisi yönetimi ve testleri CI hattına bağlama konularında ekip içinde sorumluluk alıyorum.",
    experience: [
      {
        position: "Yazılım Test Uzmanı",
        company: "Başkent Finansal Teknolojiler A.Ş.",
        location: "Ankara",
        start: "Nis 2023",
        current: true,
        bullets: [
          "Bankacılık uygulamasının web ve mobil kanallarında elle yürütülen 420 regresyon senaryosunun 310'unu Playwright ve Appium ile otomatikleştirdim; sürüm öncesi regresyon süresi **3 günden 5 saate** indi.",
          "REST Assured ile 180 API testi yazıp GitLab CI hattına bağladım; API kaynaklı hatalar artık birleştirme isteği aşamasında yakalanıyor.",
          "Kararsız testleri bekleme stratejisi ve test verisi izolasyonuyla düzelttim; flaky test oranı **%14'ten %2'nin altına** düştü.",
          "Sprint planlamasında geliştiricilerle kabul kriterlerini birlikte yazıyorum; canlıya kaçan kritik hata sayısı bir yılda **9'dan 2'ye** indi.",
        ].join("\n"),
      },
      {
        position: "Test Uzmanı",
        company: "Kalkan Sigorta Yazılım Hizmetleri Ltd.",
        location: "Ankara",
        start: "Eyl 2021",
        end: "Mar 2023",
        bullets: [
          "Poliçe, hasar ve tahsilat modüllerinde test planlarını ve 600'ü aşkın test senaryosunu hazırladım.",
          "Selenium ve Java ile ilk UI otomasyon çatısını Page Object yapısında kurdum; 120 senaryo gece koşumlarına alındı.",
          "JMeter ile teklif hesaplama servisinin yük testini yaptım; kampanya öncesi tespit edilen bağlantı havuzu sorunu canlıya çıkmadan giderildi.",
        ].join("\n"),
      },
      {
        position: "Manuel Test Uzmanı",
        company: "Sarpkaya Danışmanlık ve Yazılım Ltd.",
        location: "Ankara",
        start: "Haz 2020",
        end: "Ağu 2021",
        bullets: [
          "Kamu kurumlarına yönelik başvuru ve belge yönetimi uygulamalarında fonksiyonel ve kabul testlerini yürüttüm.",
          "Jira'da hata kayıt şablonu hazırlayarak yeniden açılan hata oranını **%30'dan %12'ye** düşürdüm.",
          "Kullanıcı kabul testlerinde kurum temsilcilerine test senaryolarını anlattım ve geri bildirimleri geliştirme ekibine önceliklendirerek aktardım.",
        ].join("\n"),
      },
    ],
    skills: [
      { category: "Test yöntemleri", items: "Fonksiyonel test, regresyon, smoke test, keşif testi, UAT, API testi, temel performans testi" },
      { category: "Otomasyon", items: "Playwright (TypeScript), Selenium (Java), Appium, REST Assured, Cucumber" },
      { category: "Performans ve API", items: "Postman, JMeter, k6" },
      { category: "Test yönetimi ve CI", items: "Jira, Xray, TestRail, GitLab CI, Allure raporlama" },
      { category: "Programlama ve veri", items: "Java, TypeScript, SQL" },
    ],
    education: [
      {
        school: "Gazi Üniversitesi",
        field: "Bilgisayar Mühendisliği",
        degree: "Lisans",
        start: "2015",
        end: "2020",
      },
    ],
    certifications: [
      { name: "ISTQB Certified Tester Foundation Level (CTFL)", issuer: "ISTQB", date: "2021" },
    ],
    languages: [{ language: "İngilizce", level: "B2 – İyi" }],
    references: [],
    interests: "Bulmaca ve kaçış oyunları, fotoğrafçılık, yoga",
  },
});
