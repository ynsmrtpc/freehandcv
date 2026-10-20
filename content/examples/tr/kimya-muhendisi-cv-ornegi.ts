import { defineExample } from "../define";

export default defineExample({
  slug: "kimya-muhendisi-cv-ornegi",
  title: "Kimya Mühendisi CV Örneği",
  occupation: "Kimya Mühendisi",
  category: "engineering",
  experienceLevel: "mid",
  metaTitle: "Kimya Mühendisi CV Örneği ve Yazım Rehberi",
  metaDescription:
    "Proses iyileştirme, verim ve enerji rakamlarıyla yazılmış kimya mühendisi CV örneği. Simülasyon, kalite ve İSG ipuçları; ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "Üretim ve teknik müdürler bir kimya mühendisi CV'sinde hangi proseslerle çalıştığına, hangi ölçekteki tesiste sorumluluk aldığına ve verim, kalite ya da enerji tarafında neyi iyileştirdiğine bakar. Bu örnek, reçine üretiminde 6 yıllık proses ve üretim deneyimi olan bir kimya mühendisinin bu bilgileri nasıl sunduğunu gösteriyor.",
    sections: [
      {
        heading: "Özet: proses, ürün ve tesis ölçeği",
        body: "Kimya mühendisleri boya, polimer, deterjan, ilaç, petrokimya, gıda ve su arıtma gibi çok farklı sektörlerde çalışır; üstelik aynı sektörde bile üretim, proses geliştirme, kalite ve Ar-Ge birbirinden ayrı işlerdir. Özetin ilk cümlesinde sektörünü ve rolünü söyle. Ardından çalıştığın prosesleri (kesikli reaktör, damıtma, kurutma, karıştırma), ürün gruplarını ve tesis ölçeğini (yıllık kapasite, reaktör hacmi, hat sayısı) yaz.\n\nSon cümlede öne çıkan bir sonucu ver: verim artışı, çevrim süresi kısalması, spesifikasyon dışı üretimde düşüş ya da laboratuvardan üretime taşıdığın bir ürün.",
      },
      {
        heading: "Maddelerde mühendislik kararını ve ölçüyü göster",
        body: "Kimya mühendisliği maddeleri, yapılan teknik değişikliği ve onun ölçülen sonucunu birlikte anlatmalıdır. Verim, ton başına enerji ya da hammadde tüketimi, şarj süresi, spesifikasyon dışı oran ve atık miktarı bu meslekte en anlamlı göstergelerdir.\n\n- Zayıf: \"Reaktörlerde üretim süreçlerini takip ettim.\"\n- Güçlü: \"Alkid reçine üretiminde ısıtma profilini ve su ayırma adımını yeniden düzenleyerek şarj süresini **14 saatten 11,5 saate** indirdim.\"\n\nGizli reçete ya da formül bilgisini asla paylaşma. Ürünü genel adıyla (\"su bazlı akrilik emülsiyon\") ve sonucu oranla vermek yeterlidir.",
      },
      {
        heading: "Yazılım, analiz ve ATS anahtar kelimeleri",
        body: "Proses simülasyonu (Aspen Plus, Aspen HYSYS, ChemCAD), istatistiksel analiz ve deney tasarımı (Minitab), çizim (AutoCAD) ve kurumsal sistemler (SAP) ilanlarda sık geçer. Kullandığın yazılımları seviyesiyle yaz; yalnızca derste gördüğün bir programı \"ileri\" olarak gösterme.\n\nATS için şu kavramları ilandaki yazımıyla kullan: proses optimizasyonu, ölçek büyütme, kütle ve enerji denkliği, kalite kontrol, spesifikasyon, kök neden analizi, HAZOP, yalın üretim, kapasite artışı. Laboratuvar tarafında çalıştıysan GC, FTIR, viskozite ve titrasyon gibi analiz yöntemlerini ayrı bir grupta ver.",
      },
      {
        heading: "Kalite, çevre ve İSG yönetim sistemleri",
        body: "Kimya tesislerinde ISO 9001, ISO 14001 ve ISO 45001 yönetim sistemleri neredeyse her zaman vardır; iç denetçi olarak görev aldıysan bunu sertifikalarla birlikte yaz. Tehlikeli kimyasallarla çalışmak, güvenlik bilgi formu (GBF) yönetimi, KKDİK kapsamındaki kayıt süreçlerine katkı ve proses güvenliği çalışmaları da işverenin baktığı konulardır. HAZOP ya da risk değerlendirme ekibinde yer aldıysan rolünü belirt.\n\nKimya Mühendisleri Odası üyeliğini tek satırla ekleyebilirsin. Vardiyalı çalışan tesislerde vardiya düzenine uygunluğun da ilk elemede sorulur.",
      },
      {
        heading: "Ölçek büyütme ve Ar-Ge iş birliği",
        body: "Laboratuvarda geliştirilen bir ürünü pilot ölçeğe ve oradan tam üretime taşımak, bir kimya mühendisinin en değerli deneyimlerinden biridir. Böyle bir projede yer aldıysan ürün tipini, ölçek adımlarını (litre, metreküp) ve karşılaştığın sorunu nasıl çözdüğünü anlat. Ar-Ge, kalite ve satın alma ekipleriyle ortak çalışmanı göstermek, tek başına çalışan bir teknisyenden fazlası olduğunu kanıtlar.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Yalnızca \"üretim takibi\" yazıp proses ve ölçeği belirtmemek.\n- Gizli reçete, hammadde tedarikçisi ya da müşteri bilgisi paylaşmak.\n- İSG ve çevre konularını hiç anmamak: kimya tesislerinde öncelikli konulardır.\n- Kullanmadığın simülasyon yazılımlarını listelemek.\n- Laboratuvar ve üretim deneyimini birbirine karıştırmak: hangisinde ne kadar çalıştığın net olmalı.",
      },
    ],
  },
  content: {
    settings: {
      template: "technical",
      color: "#0f766e",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Kaan Özdilek",
      title: "Kimya Mühendisi – Proses ve Üretim",
      email: "kaan.ozdilek@ornek.com",
      phone: "0500 000 00 00",
      location: "Kocaeli",
      linkedin: "linkedin.com/in/kaanozdilek-ornek",
      extras: [
        { label: "Askerlik", value: "Tamamlandı" },
        { label: "Ehliyet", value: "B sınıfı" },
        { label: "Meslek odası", value: "Kimya Mühendisleri Odası üyesi" },
      ],
    },
    summary:
      "Kaplama ve boya sektörüne yönelik reçine üretiminde 6 yıllık proses ve üretim deneyimine sahip kimya mühendisiyim. Yıllık 18.000 ton kapasiteli tesiste 6 kesikli reaktörün proses sorumluluğunu taşıyor; şarj süresi, verim ve spesifikasyon dışı üretim üzerine iyileştirme projeleri yürütüyorum. İki yeni ürünü laboratuvardan 10 m³ reaktör ölçeğine taşıdım.",
    experience: [
      {
        position: "Proses Mühendisi",
        company: "Gebze Reçine Kimya San. A.Ş.",
        location: "Kocaeli",
        start: "Haz 2022",
        current: true,
        bullets: [
          "Alkid reçine üretiminde ısıtma profilini ve su ayırma adımını yeniden düzenleyerek şarj süresini **14 saatten 11,5 saate** indirdim; hattın yıllık kapasitesi yaklaşık %20 arttı.",
          "Minitab ile 2 yıllık parti verisini analiz edip viskozite sapmasının kök nedenini hammadde nem içeriğinde buldum; spesifikasyon dışı parti oranı **%6,8'den %2,1'e** düştü.",
          "Ar-Ge'nin geliştirdiği iki su bazlı akrilik emülsiyonu 20 litreden pilot ölçeğe ve 10 m³ reaktöre taşıyan ölçek büyütme çalışmalarını yönettim; ürünler **planlanan çeyrekte** satışa çıktı.",
          "Termal yağ kazanı ve reaktör ceketlerindeki ısı kayıplarını ölçüp izolasyon ve kondensat geri dönüşü önerileri hazırladım; ton başına doğal gaz tüketimi **%9** azaldı.",
          "Yeni bir reaktör hattı için yapılan HAZOP çalışmasında proses temsilcisi olarak yer aldım; çıkan 23 aksiyonun takibini üstlendim.",
        ].join("\n"),
      },
      {
        position: "Üretim Mühendisi",
        company: "Marmara Boya ve Kaplama Ltd. Şti.",
        location: "Kocaeli",
        start: "Eyl 2020",
        end: "May 2022",
        bullets: [
          "3 vardiyada çalışan 4 dispersiyon ve dolum hattının günlük üretim planını ve 22 kişilik operatör ekibinin iş dağılımını yürüttüm.",
          "Hat geçişlerinde temizlik ve ayar adımlarını standartlaştırarak renk değişim süresini **ortalama 70 dakikadan 45 dakikaya** indirdim.",
          "Tehlikeli kimyasal depolama alanında GBF ve etiketleme kontrollerini İSG birimiyle birlikte düzenli hale getirdim.",
          "ISO 9001 ve ISO 14001 iç denetimlerinde üretim alanı sorumlusu olarak görev aldım.",
        ].join("\n"),
      },
    ],
    skills: [
      { category: "Proses", items: "Kesikli reaktör prosesleri, ölçek büyütme, kütle ve enerji denkliği, proses optimizasyonu, kök neden analizi, HAZOP" },
      { category: "Yazılım", items: "Aspen Plus (orta), Minitab, AutoCAD, SAP PP-QM (kullanıcı), Microsoft Excel" },
      { category: "Laboratuvar", items: "Viskozite, katı madde ve asit sayısı tayini, FTIR (yorumlama), titrasyon" },
      { category: "Yönetim sistemleri", items: "ISO 9001, ISO 14001, ISO 45001, güvenlik bilgi formu yönetimi" },
    ],
    education: [
      {
        school: "Kocaeli Üniversitesi",
        field: "Kimya Mühendisliği",
        degree: "Lisans",
        start: "2015",
        end: "2020",
      },
    ],
    certifications: [
      { name: "ISO 9001:2015 İç Denetçi Eğitimi", issuer: "Akredite eğitim kuruluşu", date: "2021" },
      { name: "Proses Güvenliği ve HAZOP Eğitimi (16 saat)", issuer: "Yetkili İSG eğitim kurumu", date: "2023" },
    ],
    languages: [{ language: "İngilizce", level: "B2 – İyi (YDS 72 – 2020)" }],
    references: [],
    interests: "Satranç, kampçılık",
  },
});
