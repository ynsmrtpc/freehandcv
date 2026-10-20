import { defineExample } from "../define";

export default defineExample({
  slug: "yazilim-muhendisi-cv-ornegi",
  title: "Yazılım Mühendisi CV Örneği",
  occupation: "Yazılım Mühendisi",
  category: "technology",
  experienceLevel: "mid",
  metaTitle: "Yazılım Mühendisi CV Örneği ve Yazım Rehberi",
  metaDescription:
    "Ölçülebilir sonuçlarla yazılmış yazılım mühendisi CV örneği. Teknik yetkinlikler, proje ve deneyim maddeleri için ipuçları; ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "İşe alım yapan teknik yöneticiler bir yazılım mühendisi CV'sinde önce hangi teknolojilerle, ne ölçekte ve hangi sonuçla çalıştığına bakar. Bu örnek, 5 yıllık deneyime sahip bir backend ağırlıklı yazılım mühendisinin bu üç soruyu ilk sayfada nasıl cevapladığını gösteriyor.",
    sections: [
      {
        heading: "Özet: kim olduğunu üç cümlede söyle",
        body: "Özet bölümü, CV'yi tarayan kişinin ilk okuduğu yerdir. Kaç yıllık deneyimin olduğunu, hangi alanda uzmanlaştığını (backend, mobil, veri, gömülü sistemler) ve en güçlü iki üç teknolojiyi açıkça yaz. Ardından seni diğer adaylardan ayıran bir sonucu ekle: ölçeklendirdiğin bir sistem, düşürdüğün bir maliyet ya da sahiplendiğin bir ürün.\n\n\"Takım çalışmasına yatkın, öğrenmeye açık\" gibi herkesin yazdığı ifadeler yer kaplar ama bilgi vermez. Bunların yerine somut bir cümle kur: \"Günde 2 milyon isteği karşılayan ödeme servislerini Go ile geliştiriyorum.\"",
      },
      {
        heading: "Deneyim maddelerini sonuçla yaz",
        body: "Her pozisyon için 3–5 madde yeterlidir. Her madde bir fiille başlasın ve mümkünse bir sayı içersin. Sayı uydurma; ama gerçekte ölçtüğün şeyi yazmaktan da çekinme. İyi bir madde şu sırayı izler: ne yaptın, hangi araçla yaptın, sonucunda ne değişti.\n\n- Zayıf: \"Mikroservis mimarisi üzerinde çalıştım.\"\n- Güçlü: \"Monolit sipariş modülünü 4 servise ayırarak dağıtım süresini **45 dakikadan 8 dakikaya** indirdim.\"\n\nKod incelemesi, mentorluk, nöbet (on-call) ve dokümantasyon gibi sorumlulukları da ekle; kıdemli rollere geçişte bunlar en az teknik iş kadar önemlidir.",
      },
      {
        heading: "Teknik yetkinlikleri gruplandır",
        body: "Uzun ve sırasız bir teknoloji listesi, aday takip sistemlerinde (ATS) anahtar kelime eşleşmesini sağlasa da okuyan kişiyi yorar. Yetkinlikleri \"Diller\", \"Çatılar ve kütüphaneler\", \"Veritabanları\", \"Bulut ve DevOps\" gibi başlıklar altında topla. Her grupta en iyi bildiğin teknolojiyi başa yaz.\n\nİş ilanındaki teknolojileri ilandaki yazımıyla kullan: ilan \"PostgreSQL\" diyorsa \"Postgres\" yerine onu yaz. Yalnızca bir eğitimde gördüğün araçları listeye ekleme; mülakatta bu araçlar hakkında soru gelmesi çok olasıdır.",
      },
      {
        heading: "Projeler ve açık kaynak katkıları",
        body: "Deneyimin 3 yılın altındaysa ya da iş dışında anlamlı bir proje geliştirdiysen ayrı bir \"Projeler\" bölümü aç. Projenin ne işe yaradığını, kullandığın teknolojileri ve varsa kullanıcı sayısı, yıldız ya da indirme gibi bir ölçütü yaz. GitHub bağlantısı veriyorsan deponun README dosyasının düzgün olduğundan emin ol; işe alım yapanlar bağlantıya gerçekten tıklar.",
      },
      {
        heading: "Eğitim, sertifika ve dil",
        body: "Mezuniyetinin üzerinden birkaç yıl geçtiyse eğitimi deneyimin altına al. Not ortalaman yüksekse ya da ilan istiyorsa yaz, değilse zorunlu değil. AWS, Kubernetes (CKA) veya Scrum gibi sertifikalar, ilanla ilgiliyse kısa bir bölümde yer alsın.\n\nYabancı dil seviyesini \"iyi\" yerine Avrupa Ortak Çerçevesi (B2, C1) ya da YDS puanıyla belirt. Yurt dışı ekiplerle çalıştığın deneyimler varsa deneyim maddelerinde de geçir.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- CV'yi iki sayfayı aşacak kadar uzatmak: 10 yılın altındaki deneyim için bir, en fazla iki sayfa yeterli.\n- Her işte aynı teknolojileri tekrar tekrar listelemek: teknolojileri yetkinlikler bölümünde topla, maddelerde sonuca odaklan.\n- Gizli şirket bilgisi paylaşmak: müşteri adı ya da iç metrik yerine oranlar ve yuvarlanmış sayılar kullan.\n- Fotoğrafı ve kişisel bilgileri (T.C. kimlik no, medeni hal, açık adres) eklemek: teknik başvurularda gerekmez.",
      },
    ],
  },
  content: {
    settings: {
      template: "technical",
      color: "#0f4c81",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Emre Kılınç",
      title: "Yazılım Mühendisi (Backend)",
      email: "emre.kilinc@ornek.com",
      phone: "0500 000 00 00",
      location: "Ankara",
      linkedin: "linkedin.com/in/emrekilinc-ornek",
      github: "github.com/emrekilinc-ornek",
      extras: [{ label: "Askerlik", value: "Tamamlandı" }],
    },
    summary:
      "5 yıllık deneyime sahip, backend ağırlıklı yazılım mühendisiyim. Go ve Java ile yüksek trafikli ödeme ve sipariş servisleri geliştiriyor; PostgreSQL, Kafka ve Kubernetes üzerinde çalışan dağıtık sistemlerin tasarımından canlı ortam işletimine kadar sorumluluk alıyorum. Son rolümde günde 2 milyondan fazla isteği karşılayan ödeme altyapısının teknik sahipliğini üstlendim.",
    experience: [
      {
        position: "Yazılım Mühendisi",
        company: "Atlas Ödeme Sistemleri A.Ş.",
        location: "Ankara",
        start: "Şub 2022",
        current: true,
        bullets: [
          "Ödeme yetkilendirme servisini Java'dan Go'ya taşıyarak ortalama yanıt süresini **240 ms'den 90 ms'ye** düşürdüm.",
          "Kafka tabanlı olay akışı tasarlayarak sipariş ve ödeme servisleri arasındaki senkron bağımlılığı kaldırdım; kesinti kaynaklı başarısız işlemler **%60** azaldı.",
          "Kubernetes üzerinde otomatik ölçekleme ve canary dağıtım kurgusunu hazırladım; kampanya dönemlerinde sıfır kesintiyle **5 kat** trafik karşılandı.",
          "4 kişilik ekipte kod incelemelerini ve haftalık nöbet düzenini yürüttüm; 2 yeni mühendisin işe uyumunda mentorluk yaptım.",
        ].join("\n"),
      },
      {
        position: "Yazılım Geliştirici",
        company: "Bozkır Yazılım Ltd.",
        location: "Ankara",
        start: "Tem 2019",
        end: "Oca 2022",
        bullets: [
          "Lojistik firmaları için Spring Boot ile REST API'leri geliştirdim; sistem 40'tan fazla kurumsal müşteriye hizmet verdi.",
          "Yavaş PostgreSQL sorgularını indeks ve sorgu düzenlemeleriyle iyileştirerek rapor ekranlarının yüklenme süresini **%70** kısalttım.",
          "Birim ve entegrasyon testlerini CI hattına ekleyerek test kapsamını %35'ten **%80'e** çıkardım.",
        ].join("\n"),
      },
    ],
    projects: [
      {
        name: "kuyruk-izleyici",
        role: "Geliştirici",
        start: "2023",
        technologies: "Go, Prometheus, Grafana",
        link: "github.com/emrekilinc-ornek/kuyruk-izleyici",
        description: "Kafka tüketici gecikmesini izleyip eşik aşıldığında uyarı üreten açık kaynak araç; 300'ün üzerinde GitHub yıldızı.",
      },
    ],
    skills: [
      { category: "Diller", items: "Go, Java, SQL, Python" },
      { category: "Çatılar", items: "Spring Boot, gRPC, Gin" },
      { category: "Veri", items: "PostgreSQL, Redis, Kafka, Elasticsearch" },
      { category: "Bulut ve DevOps", items: "Kubernetes, Docker, AWS, Terraform, GitHub Actions" },
    ],
    education: [
      {
        school: "Orta Doğu Teknik Üniversitesi",
        field: "Bilgisayar Mühendisliği",
        degree: "Lisans",
        start: "2015",
        end: "2019",
      },
    ],
    certifications: [
      { name: "Certified Kubernetes Application Developer (CKAD)", issuer: "The Linux Foundation", date: "2023" },
      { name: "AWS Certified Developer – Associate", issuer: "Amazon Web Services", date: "2022" },
    ],
    languages: [{ language: "İngilizce", level: "C1 – İleri" }],
    references: [],
    interests: "Açık kaynak katkısı, dağ bisikleti, satranç",
  },
});
