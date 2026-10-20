import { defineExample } from "../define";

export default defineExample({
  slug: "backend-gelistirici-cv-ornegi",
  title: "Backend Geliştirici CV Örneği",
  occupation: "Backend Geliştirici",
  category: "technology",
  experienceLevel: "mid",
  metaTitle: "Backend Geliştirici CV Örneği ve Yazım Rehberi",
  metaDescription:
    "C# ve .NET ile yazılmış backend geliştirici CV örneği. API, veritabanı ve performans maddeleri, ATS anahtar kelimeleri için ipuçları; ücretsiz düzenle.",
  guide: {
    intro:
      "Backend ilanlarını değerlendiren ekip liderleri CV'de önce hangi dil ve çatıyla çalıştığına, servislerin ne kadar yük taşıdığına ve veriyle ne kadar yakından ilgilendiğine bakar. Bu örnek, C# ve .NET ile e-ticaret ve sigorta alanlarında 5 yıl çalışmış bir backend geliştiricinin bu bilgileri tek sayfada nasıl topladığını gösteriyor.",
    sections: [
      {
        heading: "Özet: yığın, alan ve sorumluluk",
        body: "Backend geliştirici özetinin ilk cümlesi ana dilini ve çatını söylemeli: C# ve .NET, Java ve Spring, Node.js, Python ve Django gibi. İkinci cümlede hangi alanda çalıştığını yaz; sipariş ve stok, ödeme, sigorta poliçesi ya da içerik yönetimi farklı problemler demektir. Son cümlede sahiplendiğin bir sistemi veya çözdüğün bir darboğazı an.\n\n\"Temiz kod yazmaya önem veren\" gibi ifadeler her CV'de vardır. Onun yerine \"Saatte 20 bin siparişi işleyen sipariş servisinin geliştirilmesinden ve canlı ortam takibinden sorumluyum\" yaz; okuyan kişi ölçeği hemen anlar.",
      },
      {
        heading: "Maddelerde yükü, süreyi ve hatayı ölç",
        body: "Backend işinin sonuçları genellikle sayıyla ifade edilebilir: yanıt süresi (p95), hata oranı, sorgu süresi, kuyruktaki bekleme, sunucu maliyeti ya da elle yapılan işten kazanılan zaman. Bir madde, ne değiştirdiğini ve bunun hangi ölçütü etkilediğini birlikte söylemelidir.\n\n- Zayıf: \"Veritabanı sorgularını optimize ettim.\"\n- Güçlü: \"Poliçe arama sorgusunu indeks ve sayfalama düzenlemeleriyle yeniden yazdım; p95 yanıt süresi **2,4 saniyeden 380 ms'ye** indi.\"\n\nÖlçmediğin bir değeri yazma. Metrik yoksa kapsamı anlat: kaç servis, kaç entegrasyon, kaç ekip tarafından kullanılan bir API.",
      },
      {
        heading: "Yetkinlikler ve ATS anahtar kelimeleri",
        body: "Yetkinlikleri dil, çatı, veri, mesajlaşma ve altyapı başlıkları altında topla. .NET ilanlarında sık geçen ifadeler şunlardır: C#, ASP.NET Core, Web API, Entity Framework Core, LINQ, MSSQL, PostgreSQL, Redis, RabbitMQ, mikroservis, REST, gRPC, Docker, CI/CD, birim testi (xUnit, NUnit), clean architecture, CQRS.\n\nİlandaki yazımı kullan ve yalnızca mülakatta anlatabileceğin teknolojileri listele. Mimari kavramları (DDD, CQRS, event-driven) yazdıysan deneyim maddelerinden birinde bunları nerede ve neden uyguladığını göster; yalnızca listede kalan bir kavram mülakatta ilk sorulan şey olur.",
      },
      {
        heading: "API tasarımı ve entegrasyonları görünür kıl",
        body: "Backend geliştiricilerin işinin büyük kısmı başka sistemlerle konuşmaktır: ödeme kuruluşları, kargo firmaları, e-fatura entegratörleri, kurum içi ERP. Hangi entegrasyonları kurduğunu ve bunları nasıl dayanıklı hâle getirdiğini (yeniden deneme, idempotency, zaman aşımı, kuyruk) bir maddede anlat.\n\nAPI dokümantasyonu (OpenAPI, Swagger), sürümleme ve geriye dönük uyumluluk konusunda deneyimin varsa bunu da yaz. Başka ekiplerin kullandığı bir API sahibi olmak, orta seviyeden kıdemliye geçişte güçlü bir kanıttır.",
      },
      {
        heading: "GitHub, projeler ve sertifikalar",
        body: "Şirket kodunu paylaşamıyorsan küçük ama bitmiş bir yan proje göster: bir kütüphane, bir CLI aracı ya da iyi belgelenmiş bir örnek servis. README dosyasında projenin ne yaptığını, nasıl çalıştırıldığını ve testlerin nasıl koşulduğunu yaz.\n\nBulut sertifikaları (Azure veya AWS geliştirici sertifikaları) ilan bir bulut ortamı istiyorsa işe yarar; tek başına deneyimin yerini tutmaz. Sertifikayı veren kurumu ve yılıyla yaz.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Her rolde aynı teknoloji listesini tekrarlamak: maddelerde sonuca, yetkinlikler bölümünde araçlara odaklan.\n- Canlı ortam olaylarını gizlemek: bir kesintiyi nasıl çözdüğünü ve sonra neyi değiştirdiğini anlatmak güven verir.\n- Müşteri adı, iç sunucu adı ya da gerçek ciro paylaşmak: oran ve yuvarlanmış sayı kullan.\n- \"Full stack\" yazıp yalnızca backend maddeleri sıralamak: başlığı gerçekte yaptığın işe göre seç.\n- Teknolojilerin yanına yüzde veya yıldız koymak: ATS bunu okumaz, okuyan kişiye de bilgi vermez.",
      },
    ],
  },
  content: {
    settings: {
      template: "technical",
      color: "#1d4ed8",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Tolga Sevindik",
      title: "Backend Geliştirici (.NET)",
      email: "tolga.sevindik@ornek.com",
      phone: "0500 000 00 00",
      location: "İstanbul",
      linkedin: "linkedin.com/in/tolgasevindik-ornek",
      github: "github.com/tolgasevindik-ornek",
      extras: [{ label: "Askerlik", value: "Tamamlandı" }],
    },
    summary:
      "C# ve .NET ile 5 yıldır backend geliştiriyorum; e-ticaret sipariş yönetimi ve sigorta poliçe sistemlerinde çalıştım. ASP.NET Core ile REST API'ler, RabbitMQ ile olay tabanlı entegrasyonlar ve MSSQL ile PostgreSQL üzerinde performans iyileştirmeleri yapıyorum. Şu an saatte 20 bine kadar siparişi işleyen sipariş servisinin geliştirilmesinden ve canlı ortam takibinden sorumluyum.",
    experience: [
      {
        position: "Backend Geliştirici",
        company: "Sepetyolu E-Ticaret A.Ş.",
        location: "İstanbul",
        start: "Mar 2023",
        current: true,
        bullets: [
          "Monolit içindeki sipariş modülünü ASP.NET Core ile ayrı bir servise taşıdım; kampanya günlerinde sipariş oluşturma hatası **%2,1'den %0,3'e** düştü.",
          "Kargo ve stok güncellemelerini RabbitMQ kuyruklarına aldım; yeniden deneme ve idempotency kurgusuyla elle düzeltilen kayıt sayısı ayda **yaklaşık 400'den 30'un altına** indi.",
          "Ürün ve fiyat okumalarına Redis önbelleği ekleyerek veritabanı okuma yükünü **%55** azalttım.",
          "OpenAPI ile belgelenmiş iç API'leri 3 farklı ekibin kullanımına açtım; sürümleme kurallarını ekip içi rehbere yazdım.",
          "Haftalık nöbet düzenine katılıyor, olay sonrası değerlendirme raporlarını hazırlıyorum.",
        ].join("\n"),
      },
      {
        position: "Yazılım Geliştirici",
        company: "Teminat Sigorta Teknolojileri Ltd.",
        location: "İstanbul",
        start: "Ağu 2021",
        end: "Şub 2023",
        bullets: [
          "Poliçe arama sorgusunu indeks ve sayfalama düzenlemeleriyle yeniden yazdım; p95 yanıt süresi **2,4 saniyeden 380 ms'ye** indi.",
          "Acente portalı için Entity Framework Core ile teklif ve yenileme ekranlarının API'lerini geliştirdim.",
          "xUnit ile birim ve entegrasyon testlerini CI hattına bağladım; kritik modüllerde test kapsamı **%30'dan %72'ye** çıktı.",
        ].join("\n"),
      },
      {
        position: "Stajyer / Yarı Zamanlı Geliştirici",
        company: "Mavera Yazılım Ltd.",
        location: "İstanbul",
        start: "Tem 2020",
        end: "Tem 2021",
        bullets: [
          "Kurum içi izin ve masraf takip uygulamasının .NET Web API katmanında hata düzeltmeleri ve yeni uç noktalar geliştirdim.",
          "Elle hazırlanan aylık raporları SQL saklı yordamları ve zamanlanmış görevlerle otomatikleştirdim; raporlama günde **1 saatten 5 dakikaya** indi.",
          "Kıdemli geliştiricilerin kod incelemelerinden aldığım geri bildirimlerle katmanlı mimari ve birim testi alışkanlığı kazandım; yazdığım uç noktaların tamamı testli olarak birleştirildi.",
        ].join("\n"),
      },
    ],
    projects: [
      {
        name: "outbox-ornek",
        role: "Geliştirici",
        start: "2024",
        technologies: ".NET 8, PostgreSQL, RabbitMQ",
        link: "github.com/tolgasevindik-ornek/outbox-ornek",
        description:
          "Transactional outbox desenini adım adım gösteren, testleri ve Docker Compose kurulumu olan örnek servis; yazıya dönüştürülmüş anlatımıyla birlikte paylaşıldı.",
      },
    ],
    skills: [
      { category: "Diller", items: "C#, SQL, TypeScript" },
      { category: "Çatılar", items: "ASP.NET Core, Web API, Entity Framework Core, MediatR, xUnit" },
      { category: "Veri ve mesajlaşma", items: "MSSQL, PostgreSQL, Redis, RabbitMQ, Elasticsearch" },
      { category: "Altyapı", items: "Docker, Azure DevOps, GitHub Actions, Grafana, Seq" },
      { category: "Yaklaşımlar", items: "REST, mikroservis, clean architecture, CQRS, OpenAPI" },
    ],
    education: [
      {
        school: "Yıldız Teknik Üniversitesi",
        field: "Matematik Mühendisliği",
        degree: "Lisans",
        start: "2016",
        end: "2021",
      },
    ],
    certifications: [
      { name: "Microsoft Certified: Azure Developer Associate", issuer: "Microsoft", date: "2024" },
    ],
    languages: [{ language: "İngilizce", level: "B2 – İyi" }],
    references: [],
    interests: "Teknik blog yazarlığı, masa tenisi, bisiklet",
  },
});
