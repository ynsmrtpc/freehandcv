import { defineExample } from "../define";

export default defineExample({
  slug: "mobil-uygulama-gelistirici-cv-ornegi",
  title: "Mobil Uygulama Geliştirici CV Örneği",
  occupation: "Mobil Uygulama Geliştirici",
  category: "technology",
  experienceLevel: "mid",
  metaTitle: "Mobil Uygulama Geliştirici CV Örneği ve Rehber",
  metaDescription:
    "Android, iOS ve Flutter deneyimiyle mobil uygulama geliştirici CV örneği. Mağaza puanı, çökme oranı ve yetkinlik ipuçları; ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "Mobil ekip liderleri bir CV'de önce hangi platformlarda geliştirme yaptığını, uygulamanın kaç kullanıcıya ulaştığını ve kararlılığı nasıl iyileştirdiğini arar. Bu örnek, 5 yıllık deneyimi olan Kotlin ve Flutter ağırlıklı bir mobil geliştiricinin bu bilgileri iki sütunlu bir düzende nasıl sunduğunu gösteriyor.",
    sections: [
      {
        heading: "Özet: platformunu ve yaklaşımını netleştir",
        body: "Mobil geliştirme ilanları üç gruba ayrılır: yerel Android (Kotlin), yerel iOS (Swift) ve çapraz platform (Flutter, React Native). Özetinde hangisinde uzman olduğunu ve diğerlerinde ne düzeyde çalışabildiğini açıkça yaz. \"Mobil uygulama geliştiriyorum\" demek, işe alım yapanın seni hangi pozisyona yerleştireceğini belirsiz bırakır.\n\nUygulamanın ölçeğini de ekle: indirme sayısı, aylık aktif kullanıcı ya da mağaza puanı. Yayındaki bir uygulamada çalışmış olmak, mobilde en çok aranan deneyimdir.",
      },
      {
        heading: "Deneyim maddelerinde kararlılık ve performansı ölç",
        body: "Mobil geliştiricinin sonuçları genellikle Firebase Crashlytics, Play Console ve App Store Connect gibi araçlarda görünür: çökmesiz oturum oranı, açılış süresi, uygulama boyutu, mağaza puanı ve sürüm sıklığı. Bu ölçütleri maddelerine taşı.\n\n- Zayıf: \"Uygulamadaki hataları düzelttim.\"\n- Güçlü: \"Crashlytics raporlarına göre en sık 10 çökme nedenini giderdim; çökmesiz oturum oranı **%97,8'den %99,6'ya** yükseldi.\"\n\nYayın sürecini (CI/CD, Fastlane, aşamalı dağıtım), mağaza incelemelerinde karşılaşılan red nedenlerini ve çözümlerini de bir maddede anlatabilirsin.",
      },
      {
        heading: "Yetkinlikler ve ATS anahtar kelimeleri",
        body: "Yetkinlikleri platforma göre grupla: \"Android\" altında Kotlin, Jetpack Compose, Coroutines, Room, Hilt; \"iOS\" altında Swift, SwiftUI, Combine; \"Çapraz platform\" altında Flutter, Dart, Bloc veya Riverpod. Ortak başlıkta REST ve GraphQL, Firebase, push bildirimleri, uygulama içi satın alma, birim ve arayüz testleri yer alabilir.\n\nMimari desenleri (MVVM, Clean Architecture) yazmak faydalıdır; ama bunları bir proje içinde neden ve nasıl uyguladığını gösteremiyorsan sadece kelime olarak kalır.",
      },
      {
        heading: "Mağaza bağlantıları ve yan projeler",
        body: "Mobil adaylar için Google Play veya App Store bağlantısı, GitHub deposundan bile güçlü bir kanıttır. Yayındaki uygulamalarda senin sorumlu olduğun özellikleri yaz; ekipte çalıştığın bir uygulamanın tamamını sahiplenmiş gibi gösterme. Kendi yayınladığın küçük bir uygulama varsa indirme sayısı ve puanıyla \"Projeler\" bölümüne ekle.\n\nYan projede de sonuç odaklı yaz: uygulamanın hangi sorunu çözdüğünü, hangi teknolojiyle yazıldığını ve kullanıcı yorumlarına göre ne değiştirdiğini bir iki cümlede anlat. Kod deposunu herkese açık paylaşıyorsan API anahtarlarının ve imzalama dosyalarının depoda olmadığından emin ol; mobil ekipler bu ayrıntıya özellikle bakar.",
      },
      {
        heading: "Erişilebilirlik, yerelleştirme ve cihaz çeşitliliği",
        body: "Türkiye'de kullanıcıların önemli bir kısmı orta ve giriş segmenti Android cihaz kullanır. Düşük bellekli cihazlarda performans, çevrim dışı çalışma ve uygulama boyutu üzerinde çalıştıysan bunu mutlaka yaz. TalkBack ve VoiceOver uyumu, karanlık mod ve çok dilli destek de ilanlarda giderek daha sık geçen konulardır.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Hem Android, hem iOS, hem Flutter, hem React Native'de \"uzman\" görünmek: güçlü olduğun platformu öne çıkar.\n- Mağaza bağlantısı vermemek ya da yayından kaldırılmış uygulamalara bağlantı vermek.\n- Kütüphane adlarını sonuç anlatmadan sıralamak.\n- Kullanıcı sayısı ve gelir gibi gizli şirket verilerini kesin rakamlarla paylaşmak: yuvarlanmış değerler ve oranlar kullan.\n- Ekran görüntüleriyle CV'yi doldurmak: görseller mağaza sayfasında zaten var.",
      },
    ],
  },
  content: {
    settings: {
      template: "two-column",
      color: "#047857",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Burak Tunçel",
      title: "Mobil Uygulama Geliştirici (Android / Flutter)",
      email: "burak.tuncel@ornek.com",
      phone: "0500 000 00 00",
      location: "İzmir",
      linkedin: "linkedin.com/in/buraktuncel-ornek",
      github: "github.com/buraktuncel-ornek",
      extras: [{ label: "Askerlik", value: "Tamamlandı" }],
    },
    summary:
      "5 yıllık deneyime sahip mobil uygulama geliştiriciyim. Kotlin ve Jetpack Compose ile yerel Android, Flutter ile çapraz platform uygulamalar geliştiriyorum. Son rolümde 1 milyonun üzerinde indirilen bir perakende uygulamasının Android ve Flutter ekibinde çalışıyor, uygulama kararlılığı ve yayın sürecinden sorumluyum. Temel düzeyde Swift ve SwiftUI ile iOS tarafına da destek veriyorum.",
    experience: [
      {
        position: "Mobil Uygulama Geliştirici",
        company: "Çarşıkent Perakende Teknolojileri A.Ş.",
        location: "İzmir",
        start: "Oca 2023",
        current: true,
        bullets: [
          "1 milyonun üzerinde indirilen alışveriş uygulamasının sepet ve ödeme akışlarını Jetpack Compose ile yeniden yazdım; ödeme adımında terk oranı **%9** azaldı.",
          "Crashlytics raporlarına göre en sık 10 çökme nedenini giderdim; çökmesiz oturum oranı **%97,8'den %99,6'ya** yükseldi.",
          "Görsel önbellekleme ve gecikmeli yüklemeyle giriş segmenti cihazlarda soğuk açılış süresini **3,4 sn'den 1,9 sn'ye** indirdim.",
          "Fastlane ve GitHub Actions ile Android ve iOS derleme ve mağaza yükleme sürecini otomatikleştirdim; sürüm sıklığı ayda bir sürümden **iki haftada bir** sürüme çıktı.",
          "Sadakat programı modülünü Flutter ile geliştirip mevcut yerel uygulamalara modül olarak ekledik; aynı kod iki platformda kullanıldı.",
        ].join("\n"),
      },
      {
        position: "Android Geliştirici",
        company: "Liman Mobil Yazılım Ltd.",
        location: "İzmir",
        start: "Haz 2021",
        end: "Ara 2022",
        bullets: [
          "Ajans müşterileri için 6 Android uygulaması geliştirdim; bunlardan 4'ü Google Play'de **4,5 ve üzeri** puan aldı.",
          "Eski Java kod tabanının yaklaşık %70'ini Kotlin ve MVVM yapısına taşıdım; yeni özellik geliştirme süresi kısaldı ve birim test yazmak mümkün hâle geldi.",
          "Çevrim dışı çalışabilen saha satış uygulaması için Room ve WorkManager ile senkronizasyon altyapısını kurdum.",
        ].join("\n"),
      },
      {
        position: "Android Geliştirici (Yarı Zamanlı)",
        company: "Liman Mobil Yazılım Ltd.",
        location: "İzmir",
        start: "Eyl 2020",
        end: "May 2021",
        bullets: [
          "Son sınıftayken haftada 3 gün çalışarak mevcut uygulamalarda arayüz düzeltmeleri ve push bildirim entegrasyonları yaptım.",
        ].join("\n"),
      },
    ],
    projects: [
      {
        name: "Nöbetçi Eczane Bul",
        role: "Bireysel proje",
        start: "2022",
        technologies: "Flutter, Dart, Google Maps SDK",
        link: "github.com/buraktuncel-ornek/nobetci-eczane",
        description:
          "Konuma göre en yakın nöbetçi eczaneyi gösteren uygulama; Google Play'de 50 binin üzerinde indirme ve 4,6 puan.",
      },
    ],
    skills: [
      { category: "Android", items: "Kotlin, Jetpack Compose, Coroutines, Flow, Room, Hilt, WorkManager" },
      { category: "Çapraz platform", items: "Flutter, Dart, Bloc" },
      { category: "iOS (temel)", items: "Swift, SwiftUI" },
      { category: "Altyapı ve araçlar", items: "Firebase (Crashlytics, FCM, Remote Config), REST, GraphQL, Fastlane, GitHub Actions" },
      { category: "Mimari ve test", items: "MVVM, Clean Architecture, JUnit, Espresso" },
    ],
    education: [
      {
        school: "Dokuz Eylül Üniversitesi",
        field: "Bilgisayar Mühendisliği",
        degree: "Lisans",
        start: "2017",
        end: "2021",
      },
    ],
    certifications: [],
    languages: [{ language: "İngilizce", level: "B2 – Orta üstü" }],
    references: [],
    interests: "Açık kaynak Flutter paketleri, bisiklet, fotoğrafçılık",
  },
});
