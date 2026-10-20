import { defineExample } from "../define";

export default defineExample({
  slug: "barista-cv-ornegi",
  title: "Barista CV Örneği",
  occupation: "Barista",
  category: "hospitality",
  experienceLevel: "entry",
  metaTitle: "Barista CV Örneği ve Yazım Rehberi",
  metaDescription:
    "Demleme yöntemleri, latte art ve yoğun saat temposuyla yazılmış tek sayfalık barista CV örneği. Yeni başlayanlara ipuçları; ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "Bir kahve dükkânı sahibi barista CV'sinde uzun bir geçmiş beklemez; espresso makinesinde ne kadar rahat olduğunu, hangi demleme yöntemlerini bildiğini ve yoğun saatte tezgâhı nasıl idare ettiğini görmek ister. Bu örnek, bir buçuk yıllık deneyimi olan genç bir baristanın bunları tek sayfada nasıl anlattığını gösteriyor.",
    sections: [
      {
        heading: "Özet: ne kadar süredir ve nerede",
        body: "Barista özetinde iki cümle yeterli. İlkinde kaç aydır ya da kaç yıldır bar arkasında çalıştığını ve ortamı yaz: üçüncü dalga kahve dükkânı, zincir kafe, otel lobisi ya da pastane. İkincisinde en güçlü olduğun beceriyi söyle: espresso kalibrasyonu, süt köpürtme ve latte art, filtre kahve yöntemleri ya da hızlı servis.\n\nHenüz deneyimin yoksa bir barista eğitimini ve kafede yaptığın yarı zamanlı işleri öne çıkar; kahveye olan ilgini \"kahve tutkunuyum\" diye değil, öğrendiklerinle göster.",
      },
      {
        heading: "Demleme yöntemlerini adıyla yaz",
        body: "İşveren, baristanın hangi ekipmanla çalışabildiğini bilmek ister. Bildiğin yöntemleri tek tek yaz: espresso bazlı içecekler, V60, Chemex, French press, AeroPress, soğuk demleme, Türk kahvesi. Değirmen ayarı yapıp espressoyu gün içinde kalibre edebiliyorsan bunu ayrıca belirt; bu, çoğu yeni baristanın atladığı ama ustaların ilk sorduğu konudur.\n\nLatte art seviyeni de gerçekçi yaz. Kalp ve tulip deseni yapabiliyorsan bunları adıyla belirt; daha karmaşık desenleri henüz öğreniyorsan \"geliştiriyorum\" demek yeterlidir. Çalıştığın espresso makinesinin kaç gruplu olduğunu ve değirmen tipini biliyorsan eklemek, tezgâha hızla uyum sağlayacağını gösterir. Deneme vardiyasında ilk bakılan şey süt dokusu ve espresso tadıdır; CV'de yazdıklarınla tezgâhta gösterdiklerin örtüşmelidir.",
      },
      {
        heading: "Maddelerde tempo ve kalite",
        body: "Barista işinde de ölçülebilir şeyler vardır: yoğun saatte hazırlanan fincan sayısı, sabah açılış ve akşam kapanış sorumluluğu, fire takibi, yeni çalışana verilen eğitim.\n\n- Zayıf: \"Kahve hazırladım ve müşterilere servis yaptım.\"\n- Güçlü: \"Sabah yoğunluğunda saatte 45 fincana kadar espresso bazlı içecek hazırladım; sipariş bekleme süresini **5 dakikanın altında** tuttum.\"\n\nKasa, sipariş alma ve vitrin düzeni gibi bar dışındaki görevleri de kısa birer madde olarak ekleyebilirsin.",
      },
      {
        heading: "Eğitim, belge ve hijyen",
        body: "Gıda ile çalışan her işletme hijyen eğitimi belgesi ister; varsa sertifikalar bölümüne mutlaka yaz. Bir barista eğitimine katıldıysan programın adını ve kurumunu ekle. Uluslararası bir kahve eğitimi aldıysan modülün adını tam yaz; yalnızca \"barista sertifikası\" demek okuyana yeterli bilgi vermez.\n\nBelgen yoksa endişelenme; birçok kahve dükkânı baristasını kendisi yetiştirir. Bu durumda kahve tadım etkinliklerine katıldığını, evde farklı demleme yöntemlerini denediğini ya da bir kavurma atölyesini ziyaret ettiğini kısa bir cümleyle ilgi alanlarına ekleyebilirsin. Turizm ya da yiyecek içecek alanında okuyorsan bölümünü ve beklenen mezuniyet yılını eğitim bölümüne yaz.",
      },
      {
        heading: "Çalışma saatleri ve uygunluk",
        body: "Kafeler erken açılır ve hafta sonu en yoğun günlerdir. Açılış ve kapanış vardiyalarına, hafta sonuna ve tam ya da yarı zamanlı çalışmaya uygunluğunu kişisel bilgilere ekle. Öğrenciysen ders programına uygun saatleri belirt; işverenin vardiya planı yapmasını kolaylaştırırsın.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- \"Kahveyi çok severim\" gibi cümlelerle özeti doldurmak.\n- Demleme yöntemlerini ve ekipmanı yazmamak.\n- Latte art seviyesini abartmak: deneme vardiyasında hemen görülür.\n- Hijyen belgesini eklemeyi unutmak.\n- Tek sayfalık bir CV'yi gereksiz bilgilerle iki sayfaya uzatmak.",
      },
    ],
  },
  content: {
    settings: {
      template: "boutique",
      color: "#7c2d12",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Ece Yalçın",
      title: "Barista",
      email: "ece.yalcin@ornek.com",
      phone: "0500 000 00 00",
      location: "Kadıköy, İstanbul",
      extras: [{ label: "Çalışma tercihi", value: "Tam zamanlı; açılış ve hafta sonu vardiyasına uygun" }],
    },
    summary:
      "Üçüncü dalga bir kahve dükkânında bir buçuk yıldır çalışan baristayım. Espresso kalibrasyonu, süt köpürtme ve temel latte art yapıyor, V60 ve Chemex ile filtre kahve hazırlıyorum; yoğun saatlerde bar ve kasayı birlikte idare edebiliyorum.",
    experience: [
      {
        position: "Barista",
        company: "Çınaraltı Kahve Kavurma",
        location: "Kadıköy, İstanbul",
        start: "May 2025",
        current: true,
        bullets: [
          "Sabah yoğunluğunda saatte 45 fincana kadar espresso bazlı içecek hazırladım; sipariş bekleme süresini **5 dakikanın altında** tuttum.",
          "Her açılışta değirmen ayarını yapıp espressoyu tadım ve süreyle kalibre ettim.",
          "V60, Chemex ve soğuk demleme ile filtre kahve menüsünü hazırladım; müşterilere çekirdek ve demleme önerisi verdim.",
          "Haftalık süt ve çekirdek fire takibini tuttum; açık süt israfını **yaklaşık %30** azalttım.",
        ].join("\n"),
      },
      {
        position: "Kafe Elemanı (Yarı Zamanlı)",
        company: "Söğütlü Pastane ve Kafe",
        location: "Kadıköy, İstanbul",
        start: "Eyl 2024",
        end: "Nis 2025",
        bullets: [
          "Hafta sonu vardiyalarında sipariş alma, kasa ve vitrin düzeni işlerini yürüttüm.",
          "Türk kahvesi ve çay servisini üstlendim; yoğun saatlerde bara destek vererek espresso makinesini kullanmayı öğrendim.",
        ].join("\n"),
      },
    ],
    skills: [
      { category: "Kahve", items: "Espresso kalibrasyonu, süt köpürtme, latte art (kalp, tulip), V60, Chemex, AeroPress, soğuk demleme, Türk kahvesi" },
      { category: "Servis", items: "Sipariş alma, POS ve kasa, vitrin düzeni, açılış ve kapanış" },
      { category: "Diğer", items: "Hijyen kuralları, ekipman temizliği ve bakımı, müşteri iletişimi" },
    ],
    education: [
      {
        school: "Anadolu Üniversitesi Açıköğretim Fakültesi",
        field: "Turizm ve Otel İşletmeciliği",
        degree: "Önlisans (devam ediyor)",
        start: "2024",
        end: "2026",
      },
      {
        school: "Anadolu Lisesi",
        degree: "Lise",
        location: "İstanbul",
        start: "2020",
        end: "2024",
      },
    ],
    certifications: [
      { name: "SCA Barista Skills – Foundation", issuer: "Specialty Coffee Association (yetkili eğitmen)", date: "2025" },
      { name: "Hijyen Eğitimi Belgesi", issuer: "Halk Eğitim Merkezi", date: "2024" },
    ],
    languages: [{ language: "İngilizce", level: "B1 – Orta" }],
    references: [],
  },
});
