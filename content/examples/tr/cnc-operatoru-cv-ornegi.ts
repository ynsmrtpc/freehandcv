import { defineExample } from "../define";

export default defineExample({
  slug: "cnc-operatoru-cv-ornegi",
  title: "CNC Operatörü CV Örneği",
  occupation: "CNC Operatörü",
  category: "operations",
  experienceLevel: "mid",
  metaTitle: "CNC Operatörü CV Örneği ve Yazım Rehberi",
  metaDescription:
    "Tezgâh tipi, kontrol ünitesi, G-kod ve ölçü aletleriyle yazılmış tek sayfalık CNC operatörü CV örneği. Ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "Bir atölye şefi CNC operatörü CV'sinde önce hangi tezgâhta çalıştığını, hangi kontrol ünitesini bildiğini ve programa ne kadar müdahale edebildiğini arar. Yalnızca parça bağlayıp çalıştıran biri ile ayarı ve ölçümü kendi yapan biri arasındaki fark, maaşı da belirler. Bu örnek, 6 yıllık CNC torna ve dik işlem deneyimi olan bir operatörün bunu tek sayfada nasıl anlattığını gösteriyor.",
    sections: [
      {
        heading: "Tezgâh ve kontrol ünitesini adıyla yaz",
        body: "Özetin ilk cümlesinde CNC torna mı, dik işlem merkezi mi, yoksa ikisini birden mi kullandığını belirt. Ardından kontrol ünitelerini yaz: Fanuc, Siemens ya da Heidenhain. Atölyeler genellikle belirli bir kontrol ünitesiyle çalışır; aynı üniteyi bilen bir operatör çok daha kısa sürede üretime başlar.\n\nÇalıştığın malzemeleri de ekle: çelik, paslanmaz, alüminyum, döküm. Hassas tolerans gerektiren otomotiv ya da savunma sanayi parçaları üzerinde çalıştıysan bunu sektör adıyla belirt.",
      },
      {
        heading: "Programa hâkimiyet seviyesini dürüst anlat",
        body: "\"G-kod bilirim\" ifadesi çok farklı anlamlara gelebilir. Tezgâhta program çağırıp çalıştırıyor musun, takım ofsetlerini ve sıfır noktasını kendin mi alıyorsun, programda ilerleme ve devir düzeltmesi yapabiliyor musun, yoksa basit parçaların programını sıfırdan yazabiliyor musun? Hangisini yapıyorsan onu açıkça yaz. CAM yazılımı biliyorsan adını ekle; bilmiyorsan eklemek mülakatta hemen ortaya çıkar.\n\nBirçok atölye, işe alımdan önce adaya tezgâh başında kısa bir deneme yaptırır: bir teknik resim verilir, adaydan parçayı bağlaması, sıfırı alması ve ilk parçayı ölçmesi istenir. CV'de yazdığın seviye bu denemeyle karşılaştırılır. Bu yüzden programa müdahale seviyeni olduğu gibi yazmak, hem güven verir hem de doğru pozisyona yerleştirilmeni sağlar. Seri üretimde mi yoksa tek parça ve küçük partilerde mi çalıştığını da belirt; ikisi farklı bir çalışma temposu ister.",
      },
      {
        heading: "Maddelerde kalite, süre ve fire",
        body: "Talaşlı imalatta sonuç ölçülebilir: ıskarta oranı, ayar süresi, parça başı çevrim süresi, ilk parça onayından geçme oranı. İyileştirdiğin bir şey varsa rakamla yaz.\n\n- Zayıf: \"CNC tornada parça işledim.\"\n- Güçlü: \"Takım ömrü takibini başlatıp kesme parametrelerini düzelterek flanş parçalarında ıskarta oranını **%3,5'ten %1,2'ye** indirdim.\"\n\nBirden fazla tezgâha aynı anda baktıysan bunu da belirt; vardiyada kaç tezgâh kullandığın verimliliğin doğrudan göstergesidir.",
      },
      {
        heading: "Ölçü aletleri ve teknik resim",
        body: "Operatörün kendi parçasını ölçebilmesi beklenir. Kullandığın ölçü aletlerini tek tek yaz: kumpas, mikrometre, komparatör, iç çap ölçer, mastar, yükseklik mihengiri. Teknik resim okuyabildiğini, toleransları ve yüzey pürüzlülüğü işaretlerini yorumlayabildiğini belirt. Ölçüm raporu ya da ilk parça kontrol formu doldurduysan bunu da ekle.",
      },
      {
        heading: "Eğitim ve belgeler",
        body: "Meslek lisesinin makine alanı ya da bir meslek yüksekokulunun makine programı bu iş için güçlü bir temeldir; alanı ve dalı yaz. Mesleki yeterlilik belgen ya da ustalık belgen varsa sertifikalar bölümüne kurumuyla birlikte ekle. İş güvenliği eğitimini de unutma. Kurs ya da firma içi eğitimle yeni bir kontrol ünitesi öğrendiysen bunu da kısaca belirt; atölyeler öğrenmeye açık operatörü tercih eder.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Tezgâh tipini ve kontrol ünitesini yazmamak.\n- Program bilgisini abartmak: tezgâh başında birkaç dakikada anlaşılır.\n- Ölçü aletlerini ve teknik resim bilgisini atlamak.\n- Iskarta ve ayar süresi gibi sonuçlar yerine yalnızca görev saymak.\n- Vardiya uygunluğunu ve askerlik durumunu belirtmemek.",
      },
    ],
  },
  content: {
    settings: {
      template: "technical",
      color: "#334155",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Emre Kılınç",
      title: "CNC Operatörü",
      email: "emre.kilinc@ornek.com",
      phone: "0500 000 00 00",
      location: "Nilüfer, Bursa",
      extras: [
        { label: "Askerlik", value: "Tamamlandı" },
        { label: "Vardiya", value: "Vardiyalı çalışmaya uygun" },
      ],
    },
    summary:
      "Otomotiv yan sanayisinde 6 yıllık deneyime sahip CNC operatörüyüm. Fanuc kontrollü CNC torna ve Siemens kontrollü dik işlem merkezinde çalışıyor; takım ofsetlerini ve sıfır noktasını kendim alıyor, programda ilerleme ve devir düzeltmeleri yapabiliyorum. Teknik resim okuyup parçalarımı kumpas, mikrometre ve komparatörle ölçüyorum.",
    experience: [
      {
        position: "CNC Operatörü",
        company: "Nilüfer Hassas Talaşlı İmalat A.Ş.",
        location: "Bursa",
        start: "Şub 2022",
        current: true,
        bullets: [
          "Fanuc kontrollü 2 CNC tornada otomotiv flanş ve mil parçalarını ±0,02 mm toleransla işledim; vardiyada **2 tezgâha** aynı anda baktım.",
          "Takım ömrü takibini başlatıp kesme parametrelerini düzelterek ıskarta oranını **%3,5'ten %1,2'ye** indirdim.",
          "Hazır bağlama aparatlarıyla ayar adımlarını standartlaştırıp model değişim süresini **45 dakikadan 30 dakikaya** düşürdüm.",
          "İlk parça kontrol formlarını doldurup ölçüm sonuçlarını kalite birimine raporladım.",
        ].join("\n"),
      },
      {
        position: "CNC Operatörü",
        company: "Osmangazi Makine Parça Ltd. Şti.",
        location: "Bursa",
        start: "Eyl 2020",
        end: "Oca 2022",
        bullets: [
          "Siemens kontrollü dik işlem merkezinde alüminyum ve çelik gövde parçalarının frezeleme ve delme işlerini yaptım.",
          "Ustabaşı gözetiminde basit parçaların G-kod programlarını tezgâhta yazıp ilk parça onayından geçirdim.",
          "Vardiya sonu tezgâh temizliği ve periyodik bakım kontrollerini yürüterek **arıza kaynaklı duruşları** azalttım.",
        ].join("\n"),
      },
    ],
    skills: [
      { category: "Tezgâhlar", items: "CNC torna, dik işlem merkezi, konvansiyonel torna (temel)" },
      { category: "Kontrol ve program", items: "Fanuc, Siemens; G-kod ve M-kod, takım ofseti, sıfır noktası alma, program düzeltme" },
      { category: "Ölçüm", items: "Kumpas, mikrometre, komparatör, iç çap ölçer, mastar, teknik resim okuma, tolerans ve yüzey pürüzlülüğü" },
    ],
    education: [
      {
        school: "Mesleki ve Teknik Anadolu Lisesi",
        field: "Makine ve Tasarım Teknolojisi Alanı",
        degree: "Lise",
        location: "Bursa",
        start: "2014",
        end: "2018",
      },
    ],
    certifications: [
      { name: "Mesleki Yeterlilik Belgesi – CNC operatörlüğü", issuer: "MYK yetkili belgelendirme kuruluşu", date: "2022" },
      { name: "Temel İş Sağlığı ve Güvenliği Eğitimi", issuer: "Kurum içi eğitim", date: "2025" },
    ],
    references: [],
  },
});
