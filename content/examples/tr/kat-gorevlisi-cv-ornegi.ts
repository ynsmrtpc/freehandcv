import { defineExample } from "../define";

export default defineExample({
  slug: "kat-gorevlisi-cv-ornegi",
  title: "Kat Görevlisi CV Örneği",
  occupation: "Kat Görevlisi",
  category: "hospitality",
  experienceLevel: "entry",
  metaTitle: "Kat Görevlisi CV Örneği ve Yazım Rehberi",
  metaDescription:
    "Günlük oda sayısı, oda standardı ve sezon deneyimiyle yazılmış tek sayfalık kat görevlisi CV örneği. Housekeeping ipuçları; ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "Bir otelin kat hizmetleri şefi kat görevlisi adayında önce şunlara bakar: daha önce otelde çalıştın mı, günde kaç oda temizleyebiliyorsun, oda standardını biliyor musun ve sezon boyunca kalabilir misin? Bu örnek, bir sezon otel deneyimi olan bir kat görevlisinin bu bilgileri tek sayfada nasıl verdiğini gösteriyor.",
    sections: [
      {
        heading: "Özet: otel tipi ve deneyim süresi",
        body: "Kısa bir özet yeterli. İlk cümlede kaç sezon ya da kaç aydır kat hizmetlerinde çalıştığını ve otel tipini yaz: şehir oteli, her şey dahil tatil köyü, butik otel. İkinci cümlede günlük oda sayını ve uygunluğunu belirt: sezonluk mu, kadrolu mu, lojmanda kalabilir misin?\n\nHiç otel deneyimin yoksa ev ya da ofis temizliği, yurt veya hastane gibi düzenli temizlik işlerini anlat; titizliğini ve hızını bu işlerle göster.\n\nOtelin büyüklüğünü yazmak da işe yarar. 40 odalı bir butik otelde kat görevlisi çoğu zaman çamaşırhane ve ortak alan temizliğine de yardım eder; 400 odalı bir tatil köyünde ise iş daha bölünmüştür ve hız ön plandadır. Çalıştığın otelin oda sayısını ve hangi bölümlerde görev aldığını belirtmek, kat şefinin seni kendi ekibine nasıl yerleştireceğini anlamasını kolaylaştırır.",
      },
      {
        heading: "Oda standardını ve iş akışını anlat",
        body: "Kat hizmetlerinde (housekeeping) her otelin bir oda standardı vardır: yatak yapımı, banyo temizliği, buklet ve havlu yerleşimi, minibar kontrolü. Bunları bildiğini göstermek için maddelerde iş akışını kullan: çıkış odası (check-out) ile konaklayan misafir odası (stay-over) arasındaki farkı, çarşaf değişimini, kayıp eşya prosedürünü ve oda durumunu şefe bildirmeyi yaz.\n\n- Zayıf: \"Otel odalarını temizledim.\"\n- Güçlü: \"Günde ortalama 14 oda temizleyip kat şefi kontrolünden **ilk seferde** geçtim.\"",
      },
      {
        heading: "Hız, kalite ve güven",
        body: "Kat görevlisinden hem hız hem de güven beklenir. Günlük oda sayını, oda kontrolünden geçme oranını ve misafir yorumlarında adının geçtiği durumları yazabilirsin. Misafir odasında bulunan değerli eşyaları kayıp eşya kaydıyla teslim ettiğini belirtmek, dürüstlüğünü somut bir örnekle gösterir. Rahatsız etmeyin kartına ve misafir mahremiyetine dikkat ettiğini, odada bulduğun arızaları teknik servise iletilmek üzere kat ofisine bildirdiğini de yazabilirsin. Temizlik kimyasallarını doğru kullanmayı ve renk kodlu bez sistemini biliyorsan yetkinliklere ekle.",
      },
      {
        heading: "Belgeler ve dil",
        body: "Hijyen eğitimi belgesi otellerde çoğu zaman istenir; varsa sertifikalar bölümüne yaz. Turistik bölgelerde misafirle kısa iletişim kurabilecek kadar yabancı dil de avantajdır. Seviyeni dürüst yaz: \"İngilizce A2 – selamlaşma ve temel istekler\" gibi bir ifade, abartılı bir seviyeden daha güven verir.",
      },
      {
        heading: "Uygunluk bilgisi",
        body: "Sezon öncesi alımlarda başlama tarihi ve sezon sonuna kadar kalabilme belirleyicidir. Kişisel bilgilere çalışma tercihini, lojmanda kalıp kalamayacağını ve hafta sonu çalışmaya uygunluğunu ekle. Telefonunun her zaman ulaşılabilir olduğundan emin ol; kat hizmetleri alımları çoğunlukla hızlı yapılır. Daha önce çalıştığın otelden bir kat şefinin referans olabileceğini biliyorsan bunu görüşmede söylemen yeterlidir; CV'de ayrı bir referans bölümü açmana gerek yok.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Günlük oda sayısını yazmamak: kat şefinin ilk sorusudur.\n- Oda standardı ve minibar kontrolü gibi işleri atlamak.\n- Dil seviyesini abartmak.\n- Başlama tarihi ve sezon uygunluğunu belirtmemek.\n- Birkaç aylık deneyimi iki sayfaya yaymak: tek sayfa yeterli.",
      },
    ],
  },
  content: {
    settings: {
      template: "minimal",
      color: "#0e7490",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Aysel Doğan",
      title: "Kat Görevlisi",
      email: "aysel.dogan@ornek.com",
      phone: "0500 000 00 00",
      location: "Bodrum, Muğla",
      extras: [{ label: "Çalışma tercihi", value: "Sezonluk veya kadrolu; lojmanda kalabilirim" }],
    },
    summary:
      "Her şey dahil bir tatil köyünde bir sezon kat görevlisi olarak çalıştım. Günde ortalama 14 oda temizliyor, oda standardına göre yatak yapımı, banyo temizliği ve minibar kontrolünü yapıyorum. Sezon boyunca kalabilir ve hafta sonu çalışabilirim.",
    experience: [
      {
        position: "Kat Görevlisi (Sezonluk)",
        company: "Gümüşkoy Tatil Köyü İşletmeleri",
        location: "Bodrum, Muğla",
        start: "Nis 2026",
        end: "Eki 2026",
        bullets: [
          "350 odalı tatil köyünde günde ortalama 14 çıkış ve konaklayan misafir odasını oda standardına göre temizledim.",
          "Kat şefi oda kontrollerinden sezon boyunca **%95'in üzerinde ilk seferde** geçtim.",
          "Minibar tüketimini kaydedip önbüroya bildirdim; buklet ve havlu eksiklerini kat ofisine raporladım.",
          "Odada unutulan eşyaları kayıp eşya prosedürüne göre kayıt altına alıp teslim ettim.",
        ].join("\n"),
      },
      {
        position: "Temizlik Elemanı (Yarı Zamanlı)",
        company: "Yalıkavak Apart Pansiyon",
        location: "Bodrum, Muğla",
        start: "Haz 2025",
        end: "Eyl 2025",
        bullets: [
          "12 apart dairenin misafir değişimlerinde temizlik, çarşaf ve havlu değişimini yaptım.",
          "Yoğun günlerde aynı gün giriş yapılacak daireleri **öğlene kadar** hazır hale getirdim.",
        ].join("\n"),
      },
    ],
    skills: [
      { category: "Kat hizmetleri", items: "Oda standardı, yatak yapımı, banyo temizliği, minibar kontrolü, buklet yerleşimi, çarşaf değişimi" },
      { category: "Hijyen", items: "Temizlik kimyasallarının doğru kullanımı, renk kodlu bez sistemi, kayıp eşya prosedürü" },
    ],
    education: [
      {
        school: "Anadolu Lisesi",
        degree: "Lise",
        location: "Muğla",
        start: "2020",
        end: "2024",
      },
    ],
    certifications: [{ name: "Hijyen Eğitimi Belgesi", issuer: "Halk Eğitim Merkezi", date: "2025" }],
    languages: [{ language: "İngilizce", level: "A2 – Temel" }],
    references: [],
  },
});
