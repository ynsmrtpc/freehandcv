import { defineExample } from "../define";

export default defineExample({
  slug: "eczaci-cv-ornegi",
  title: "Eczacı CV Örneği",
  occupation: "Eczacı",
  category: "healthcare",
  experienceLevel: "mid",
  metaTitle: "Eczacı CV Örneği ve Yazım Rehberi",
  metaDescription:
    "Serbest eczane ve hastane eczacılığı deneyimiyle eczacı CV örneği. Reçete sistemleri, stok yönetimi ve sertifika ipuçları; ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "Eczane sahipleri ve hastanelerin eczane sorumluları bir eczacı CV'sinde önce hangi ortamda çalıştığını, reçete ve stok sistemlerine ne kadar hâkim olduğunu ve hastaya ilaç danışmanlığını nasıl yaptığını arar. Bu örnek, serbest eczanede ikinci eczacılıktan hastane eczacılığına geçmiş 7 yıllık bir eczacının deneyimini tek sayfada nasıl topladığını gösteriyor.",
    sections: [
      {
        heading: "Özet: serbest eczane mi, hastane mi?",
        body: "Serbest eczane, hastane eczacılığı, ecza deposu ve ilaç endüstrisi birbirinden farklı beceriler ister. Özetinde hangi ortamlarda kaç yıl çalıştığını ve başvurduğun ortama uyan en güçlü yanını yaz. Serbest eczane için reçete işlemleri, SGK provizyon süreçleri ve hasta danışmanlığını; hastane için birim doz dağıtım, klinik eczacılık ve ilaç güvenliği çalışmalarını öne çıkar.\n\n\"Mesleğine bağlı, güler yüzlü eczacı\" gibi cümleler yerine şunu yaz: \"3,5 yıl serbest eczanede ikinci eczacı, son 3,5 yıldır 150 yataklı bir hastanede hastane eczacısı olarak çalışıyorum.\"",
      },
      {
        heading: "Deneyim maddelerinde iş yükü ve stok sonuçları",
        body: "Eczacılık maddelerinde günlük reçete sayısı, iade edilen veya kesintiye uğrayan reçete oranı, miadı geçen ürün kaybı, stok devir hızı ve ilaç hatası bildirimleri gibi ölçütler kullan. Bu sayılar eczane otomasyon programı ve hastane bilgi sistemi raporlarından alınabilir.\n\n- Zayıf: \"Stok takibi yaptım.\"\n- Güçlü: \"Aylık miat raporu ve kritik stok seviyeleri belirleyerek miadı dolan ilaç kaybını bir yılda **yaklaşık %60** azalttım.\"\n\nHastane eczacılığında akılcı ilaç kullanımı, ilaç etkileşimi kontrolü, yüksek riskli ilaçların etiketlenmesi ve klinik vizitlere katılım gibi görevleri de ayrı maddelerde yaz.",
      },
      {
        heading: "Yetkinlikler ve anahtar kelimeler",
        body: "Yetkinlikleri \"Reçete ve sistemler\", \"Stok ve satın alma\", \"Klinik eczacılık\", \"Danışmanlık\" başlıkları altında topla. İlanlarda sık geçen ifadeler: MEDULA eczane, e-Reçete, İlaç Takip Sistemi (İTS), SGK provizyon ve fatura işlemleri, kırmızı ve yeşil reçeteli ilaçlar, eczane otomasyon programı, depo siparişi, miat takibi, birim doz dağıtım, total parenteral nütrisyon hazırlığı, farmakovijilans ve Sağlıkta Kalite Standartları (SKS).\n\nSerbest eczane başvurularında dermokozmetik, takviye edici gıda ve medikal ürün danışmanlığı da aranır; bu alanda eğitim aldıysan belirt.",
      },
      {
        heading: "Eğitim, uzmanlık ve sertifikalar",
        body: "Eczacılık fakültesini ve mezuniyet yılını eğitim bölümüne yaz; fakültedeki eczane ve hastane stajlarını, deneyimin az ise kısa bir açıklamayla ekle. Klinik eczacılık veya hastane eczacılığı alanında yüksek lisans, EUS ile uzmanlık eğitimi ya da üniversitelerin sürekli eğitim merkezlerinde aldığın programlar varsa veren kurum ve yılıyla listele.\n\nİlaç firmalarının verdiği kısa ürün eğitimlerini uzun uzun sıralama; başvurduğun işle doğrudan ilgili olan bir iki eğitimi seçmek yeterli.",
      },
      {
        heading: "Hasta danışmanlığı ve iletişim",
        body: "Eczacının en görünür işi hastaya ilacın nasıl ve ne zaman kullanılacağını anlatmaktır. Kronik hastalara ilaç kullanım eğitimi, inhaler veya insülin kalemi kullanımını gösterme, etkileşim nedeniyle hekimle iletişime geçme gibi deneyimlerini somut örnekle yaz. Turistik bölgelerde veya hastanelerin uluslararası hasta birimlerinde yabancı dil bilgisi öne çıkar; seviyeni Avrupa Ortak Çerçevesi (B1, B2) ile belirt.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Serbest eczane ve hastane deneyimini aynı maddelerle anlatmak: iki ortamın sorumlulukları farklıdır.\n- Kullandığın otomasyon programını ve reçete sistemlerini yazmamak.\n- Eczanenin cirosu veya kâr marjı gibi işverenine ait bilgileri paylaşmak.\n- Hasta adı ya da kimliği belli edecek reçete örnekleri vermek.\n- Kişisel bilgilerde T.C. kimlik no ve diploma tescil numarası gibi bilgileri ilk başvuruda paylaşmak.",
      },
    ],
  },
  content: {
    settings: {
      template: "classic",
      color: "#166534",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Ecz. Selim Ertaş",
      title: "Hastane Eczacısı",
      email: "selim.ertas@ornek.com",
      phone: "0500 000 00 00",
      location: "Bursa",
      linkedin: "linkedin.com/in/selimertas-ornek",
      extras: [{ label: "Askerlik", value: "Tamamlandı" }],
    },
    summary:
      "7 yıllık deneyime sahip eczacıyım; 3,5 yıl serbest eczanede ikinci eczacı olarak, son 3,5 yıldır 150 yataklı bir özel hastanede hastane eczacısı olarak çalışıyorum. Birim doz ilaç dağıtımı, ilaç etkileşimi kontrolü, yüksek riskli ilaç yönetimi ve hastane stok planlamasında deneyimliyim. Serbest eczane döneminden MEDULA, e-Reçete, İTS ve SGK provizyon süreçlerine hâkimim.",
    experience: [
      {
        position: "Hastane Eczacısı",
        company: "Özel Sedirkent Hastanesi",
        location: "Bursa",
        start: "Mar 2023",
        current: true,
        bullets: [
          "150 yataklı hastanede servis ve yoğun bakımlara birim doz ilaç dağıtımını yürütüyorum; günde ortalama 600 hasta order'ını etkileşim, doz ve alerji yönünden kontrol ediyorum.",
          "Aylık miat raporu ve ilaç bazında kritik stok seviyeleri belirleyerek miadı dolan ilaç kaybını bir yılda **yaklaşık %60** azalttım.",
          "Yüksek riskli ilaçlar ile benzer isimli ve benzer ambalajlı (LASA) ilaçlar için etiketleme ve ayrı raf düzenini kurdum; bu ilaçlarla ilgili hata bildirimleri **9'dan 2'ye** indi.",
          "Enfeksiyon hastalıkları uzmanıyla birlikte geniş spektrumlu antibiyotik kullanımını haftalık olarak izledim; karbapenem tüketimi bir yılda **%18** azaldı.",
          "SKS değerlendirmesi öncesinde ilaç yönetimi talimatlarını güncelleyen ve servis ilaç dolaplarını denetleyen ekipte görev aldım.",
        ].join("\n"),
      },
      {
        position: "İkinci Eczacı",
        company: "Kestanelik Eczanesi",
        location: "Bursa",
        start: "Eyl 2019",
        end: "Şub 2023",
        bullets: [
          "Günde ortalama 180–220 reçetenin MEDULA ve e-Reçete üzerinden karşılanmasını, kırmızı ve yeşil reçeteli ilaçların kayıtlarını ve İTS bildirimlerini yürüttüm.",
          "SGK fatura öncesi reçete kontrolünü sistematik hale getirdim; kesinti yapılan reçete sayısı ayda **12–15'ten 3–4'e** indi.",
          "Depo siparişlerini satış geçmişine göre haftalık planlayarak eczanede bekleyen stok miktarını **%20** azalttım.",
          "Kronik hastalara inhaler ve insülin kalemi kullanımını gösterdim; olası etkileşim gördüğüm reçetelerde hekimle iletişime geçtim.",
        ].join("\n"),
      },
    ],
    skills: [
      { category: "Reçete ve sistemler", items: "MEDULA eczane, e-Reçete, İlaç Takip Sistemi (İTS), SGK provizyon ve fatura işlemleri, HBYS, eczane otomasyon programı" },
      { category: "Stok ve satın alma", items: "Depo siparişi, miat takibi, kritik stok planlaması, sayım ve envanter kontrolü" },
      { category: "Klinik eczacılık", items: "Birim doz dağıtım, ilaç etkileşimi ve doz kontrolü, akılcı antibiyotik kullanımı, farmakovijilans bildirimleri" },
      { category: "Danışmanlık", items: "Kronik hasta ilaç eğitimi, inhaler ve insülin kalemi kullanımı, dermokozmetik ürün danışmanlığı" },
    ],
    education: [
      {
        school: "Anadolu Üniversitesi",
        field: "Eczacılık Fakültesi",
        degree: "Lisans",
        start: "2014",
        end: "2019",
      },
    ],
    certifications: [
      { name: "Klinik Eczacılık Uygulamaları Eğitim Programı", issuer: "Üniversite sürekli eğitim merkezi", date: "2024" },
      { name: "Hastane İlaç Yönetimi ve İlaç Güvenliği Eğitimi", issuer: "Özel Sedirkent Hastanesi Eğitim Birimi", date: "2023" },
    ],
    languages: [{ language: "İngilizce", level: "B2 – Orta üstü" }],
    references: [],
    interests: "Fitoterapi okumaları, masa tenisi, gönüllü sağlık taramaları",
  },
});
