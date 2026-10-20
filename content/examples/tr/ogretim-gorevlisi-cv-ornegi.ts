import { defineExample } from "../define";

export default defineExample({
  slug: "ogretim-gorevlisi-cv-ornegi",
  title: "Öğretim Görevlisi CV Örneği",
  occupation: "Öğretim Görevlisi",
  category: "education",
  experienceLevel: "senior",
  metaTitle: "Öğretim Görevlisi CV Örneği ve Akademik CV Rehberi",
  metaDescription:
    "Yayın, proje ve verilen derslerle yazılmış kıdemli öğretim görevlisi CV örneği. Akademik özgeçmiş düzeni ve yayın listesi ipuçları; ücretsiz düzenle.",
  guide: {
    intro:
      "Bir üniversitenin öğretim elemanı alımında jüri ve bölüm başkanları özgeçmişte önce akademik derecelere, ardından yayınlara, yürütülen projelere ve verilen derslere bakar. Bu örnek, meslek yüksekokulunda 14 yıldır ders veren doktoralı bir öğretim görevlisinin akademik özgeçmişini iki sayfada nasıl düzenlediğini gösteriyor.",
    sections: [
      {
        heading: "Özet: alan, unvan ve akademik odak",
        body: "Akademik özgeçmişlerde özet kısa tutulur ama işlevi büyüktür. İlk cümlede unvanını, alanını ve kurum türünü yaz (meslek yüksekokulu, fakülte, yabancı diller yüksekokulu). İkinci cümlede araştırma ilgi alanlarını iki üç anahtar kavramla belirt; üçüncü cümlede öğretim ve idari sorumluluklarını özetle.\n\nÖrneğin: \"Çocuk gelişimi alanında doktoralı öğretim görevlisiyim; erken çocuklukta oyun, öz düzenleme ve ebeveyn eğitimi üzerine çalışıyorum.\" Bu cümle, ilanın alan koşulunu karşılayıp karşılamadığını jüriye ilk satırda gösterir.",
      },
      {
        heading: "Yayın listesini kaynakça düzeninde yaz",
        body: "Akademik özgeçmişin en çok incelenen bölümü yayınlardır. Her yayını tutarlı bir biçimde yaz: yazarlar, yıl, başlık, dergi veya kongre adı, cilt ve sayfa. Yayınları türüne göre ayır: uluslararası ve ulusal hakemli makaleler, kitap bölümleri, bildiriler, tezden üretilen çalışmalar. Kaçıncı yazar olduğunu açıkça göster; jüriler buna dikkat eder.\n\n- Zayıf: \"Çeşitli dergilerde makalelerim yayımlandı.\"\n- Güçlü: \"Birinci yazarlı 4, ikinci yazarlı 3 ulusal hakemli makale; 1 kitap bölümü; 6 bildiri.\"\n\nDergilerin dizin bilgisini yalnızca emin olduğun durumda yaz. Kurumların başvuruda belirli bir özgeçmiş biçimi ya da ayrı bir yayın listesi isteyebileceğini unutma; ilan metnini dikkatle oku.",
      },
      {
        heading: "Verilen dersleri ve öğretim katkısını göster",
        body: "Öğretim görevlisinin asıl yükü derstir; bu yüzden verdiğin dersleri ders adı, düzeyi (ön lisans, lisans) ve dönemiyle listele. Bir dersin içeriğini yeniden yazdıysan, uzaktan eğitim materyali hazırladıysan ya da mesleki uygulama ve staj süreçlerini koordine ettiysen bunu sayılarla anlat: kaç öğrenci, kaç kurum, kaç dönem.\n\nDers değerlendirme anketi sonuçlarını, kurum içinde paylaşılan bir ortalamaysa ekleyebilirsin; tek bir dönemin en iyi sonucunu seçip yazmak yanıltıcı olur.",
      },
      {
        heading: "Projeler, idari görevler ve hizmet",
        body: "Bilimsel araştırma projelerinde yürütücü ya da araştırmacı olarak yer aldıysan proje adını, destekleyen birimi, yılları ve rolünü yaz. Bölüm başkan yardımcılığı, program koordinatörlüğü, Erasmus ya da Bologna koordinatörlüğü, akreditasyon ve kalite komisyonu üyeliği gibi görevler de ayrı bir başlıkta yer almalı; kıdemli adaylarda jüriler bu katkıyı önemser.\n\nHakemlik yaptığın dergileri, düzenleme kurulunda yer aldığın kongreleri ve topluma katkı faaliyetlerini (eğitim seminerleri, kurum iş birlikleri) kısa bir listeyle ekle.",
      },
      {
        heading: "Sınav puanları, ORCID ve anahtar kelimeler",
        body: "Akademik başvurularda ALES ve yabancı dil puanları sıkça istenir; puanı, sınav türünü ve yılını yaz. ORCID numaranı ve YÖK Akademik profil bağlantını iletişim bilgilerinin yanına ekle; jüri yayınlarını oradan doğrulayabilir.\n\nAnahtar kelime olarak alanının terimlerini kullan: erken çocukluk, gelişimsel değerlendirme, oyun temelli öğrenme, ebeveyn eğitimi, nitel araştırma, karma yöntem, SPSS, MAXQDA. Bu terimler hem ilan metnindeki alan koşuluyla eşleşir hem de araştırma yönünü netleştirir.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Yayınları farklı biçimlerde, karışık sırayla yazmak: bir kaynakça stili seç ve tutarlı uygula.\n- Yazar sırasını belirtmemek ya da kendi adını vurgulamamak.\n- Henüz kabul almamış çalışmaları yayımlanmış gibi göstermek: \"değerlendirmede\" diye ayrıca belirt.\n- Katılınan her semineri listeleyip özgeçmişi gereksiz uzatmak.\n- Verilen dersleri yazmayıp yalnızca yayınlara odaklanmak: öğretim görevlisi alımında ders deneyimi belirleyicidir.",
      },
    ],
  },
  content: {
    settings: {
      template: "academic",
      color: "#7c2d12",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
      sectionTitles: { projects: "Yayınlar ve Projeler" },
    },
    personal: {
      name: "Dr. Aslı Karadeniz",
      title: "Öğretim Görevlisi Dr. – Çocuk Gelişimi",
      email: "asli.karadeniz@ornek.com",
      phone: "0500 000 00 00",
      location: "Konya",
      linkedin: "linkedin.com/in/aslikaradeniz-ornek",
      extras: [{ label: "ORCID", value: "0000-0000-0000-0000" }],
    },
    summary:
      "Çocuk gelişimi alanında doktoralı öğretim görevlisiyim; 14 yıldır meslek yüksekokullarında ön lisans düzeyinde ders veriyorum. Erken çocuklukta oyun, öz düzenleme becerileri ve ebeveyn eğitimi üzerine çalışıyor; nitel ve karma yöntemli araştırmalar yürütüyorum. Ulusal hakemli dergilerde 7 makalem, 1 kitap bölümüm ve 6 bildirim bulunuyor; son 5 yıldır program koordinatörlüğü ve mesleki uygulama koordinasyonunu yürütüyorum.",
    experience: [
      {
        position: "Öğretim Görevlisi Dr. / Program Koordinatörü",
        company: "Akçaova Üniversitesi, Sağlık Hizmetleri Meslek Yüksekokulu – Çocuk Gelişimi Programı",
        location: "Konya",
        start: "Eyl 2017",
        current: true,
        description:
          "Verilen dersler (ön lisans): Çocuk Gelişimi I–II, Erken Çocukluk Döneminde Oyun, Özel Eğitim, Çocuk ve Aile, Araştırma Yöntem ve Teknikleri, Mesleki Uygulama.",
        bullets: [
          "Dönem başına 18–22 saatlik ders yükünü yürütüyor, yılda ortalama 160 ön lisans öğrencisine ders veriyorum.",
          "Program koordinatörü olarak mesleki uygulama sürecini yeniden düzenledim; iş birliği yapılan okul öncesi kurum sayısı **9'dan 24'e** çıktı.",
          "Üniversite bilimsel araştırma projeleri biriminin desteklediği ebeveyn eğitimi projesini yürütücü olarak tamamladım; 3 köy okulunda **86 ebeveyn** programa katıldı.",
          "Programın öz değerlendirme raporunu kalite komisyonuyla birlikte hazırladım; ders öğrenme çıktılarını program yeterlilikleriyle eşleştiren matrisi güncelledim.",
          "Uzaktan eğitim sistemine 3 ders için video ve etkileşimli materyal hazırladım; materyaller sonraki dönemlerde programın ortak ders havuzuna alındı.",
        ].join("\n"),
      },
      {
        position: "Öğretim Görevlisi",
        company: "Doruk Meslek Yüksekokulu (Vakıf) – Çocuk Gelişimi Programı",
        location: "Ankara",
        start: "Şub 2012",
        end: "Ağu 2017",
        description: "Verilen dersler (ön lisans): Çocuk Gelişimi, Çocuk Edebiyatı, Drama, Anne Çocuk Beslenmesi, Staj.",
        bullets: [
          "Haftada 20 saate kadar ders verdim; programın staj dosyası ve değerlendirme formlarını yeniden hazırladım.",
          "Öğrenci topluluğu danışmanı olarak 4 yıl boyunca anaokullarında okuma ve oyun etkinlikleri düzenledim; her dönem **30–40 öğrenci** gönüllü olarak katıldı.",
          "Doktora ders aşamasını ve yeterlik sınavını bu görevle birlikte tamamladım; ilk iki ulusal hakemli makalemi bu dönemde yayımladım.",
        ].join("\n"),
      },
      {
        position: "Çocuk Gelişimci",
        company: "Özel Kozacık Anaokulu",
        location: "Ankara",
        start: "Eyl 2009",
        end: "Oca 2012",
        bullets: [
          "36–72 ay grubundaki 60 çocuğun dönemlik gelişim gözlemlerini ve raporlarını hazırladım.",
          "Öğretmenlerle birlikte oyun temelli etkinlik planlarını hazırladım; ebeveynlerle dönemde iki kez bireysel gelişim görüşmesi yaptım.",
          "Gelişimsel tarama sonuçlarına göre desteğe ihtiyacı olabilecek çocukları ailelerle görüşerek uzman değerlendirmesine yönlendirdim.",
        ].join("\n"),
      },
    ],
    projects: [
      {
        name: "Kırsal bölgelerde oyun temelli ebeveyn eğitimi programının çocukların öz düzenleme becerilerine etkisi",
        role: "Yürütücü – Bilimsel araştırma projesi (BAP)",
        start: "2022",
        end: "2024",
        description: "3 köy okulu, 86 ebeveyn ve 92 çocukla yürütülen karma yöntemli çalışma; sonuçları bir makale ve bir bildiriyle yayımlandı.",
      },
      {
        name: "Karadeniz, A., Öztürk, S. (2024). Okul öncesi dönemde ebeveyn katılımlı oyun etkinliklerinin öz düzenleme becerilerine etkisi.",
        role: "Makale – ulusal hakemli dergi, birinci yazar",
        start: "2024",
      },
      {
        name: "Yalçın, M., Karadeniz, A. (2023). Okul öncesi çocuklarda ekran süresi ile öz düzenleme becerileri arasındaki ilişki.",
        role: "Makale – ulusal hakemli dergi, ikinci yazar",
        start: "2023",
      },
      {
        name: "Karadeniz, A. (2021). Çocuk gelişimi programı öğrencilerinin mesleki uygulama deneyimleri: nitel bir çalışma.",
        role: "Makale – ulusal hakemli dergi, tek yazar",
        start: "2021",
      },
      {
        name: "Karadeniz, A. (2020). Erken çocuklukta oyun ve öz düzenleme. Çocuk gelişimi alanında derleme kitap, ulusal yayınevi.",
        role: "Kitap bölümü",
        start: "2020",
      },
      {
        name: "Diğer yayınlar: 4 ulusal hakemli makale, 6 bildiri (3'ü uluslararası kongrelerde sözlü sunum)",
        role: "Tam liste YÖK Akademik ve ORCID profilinde",
        start: "2014–2025",
      },
    ],
    skills: [
      { category: "Araştırma alanları", items: "Erken çocuklukta oyun, öz düzenleme, ebeveyn eğitimi, öğretmen adaylarının mesleki uygulaması" },
      { category: "Yöntem ve analiz", items: "Nitel araştırma, karma yöntem, ölçek uyarlama, SPSS, MAXQDA" },
      { category: "Öğretim", items: "Ön lisans ders tasarımı, öğrenme çıktıları ve program yeterlilikleri, uzaktan eğitim materyali hazırlama" },
      { category: "İdari görevler ve hizmet", items: "Program koordinatörlüğü, mesleki uygulama koordinasyonu, kalite komisyonu üyeliği, ulusal dergilerde hakemlik" },
    ],
    education: [
      {
        school: "Hacettepe Üniversitesi, Sağlık Bilimleri Enstitüsü",
        field: "Çocuk Gelişimi",
        degree: "Doktora",
        start: "2013",
        end: "2019",
        description: "Tez: Okul öncesi dönemde oyun davranışları ile öz düzenleme becerileri arasındaki ilişkinin incelenmesi",
      },
      {
        school: "Hacettepe Üniversitesi, Sağlık Bilimleri Enstitüsü",
        field: "Çocuk Gelişimi",
        degree: "Yüksek Lisans (Tezli)",
        start: "2009",
        end: "2012",
      },
      {
        school: "Hacettepe Üniversitesi",
        field: "Çocuk Gelişimi",
        degree: "Lisans",
        start: "2005",
        end: "2009",
      },
    ],
    certifications: [
      { name: "ALES Eşit Ağırlık: 84,5", issuer: "ÖSYM", date: "2016" },
      { name: "Uzaktan Eğitimde Ders Materyali Tasarımı Eğitimi", issuer: "Üniversite uzaktan eğitim merkezi", date: "2020" },
      { name: "Nitel Veri Analizi Eğitimi (MAXQDA)", issuer: "Bağımsız eğitim kuruluşu", date: "2018" },
    ],
    languages: [{ language: "İngilizce", level: "YÖKDİL 76,25 (2018) – B2" }],
    references: [],
    interests: "Çocuk edebiyatı, seramik, doğa yürüyüşü",
  },
});
