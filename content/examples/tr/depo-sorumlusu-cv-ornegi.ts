import { defineExample } from "../define";

export default defineExample({
  slug: "depo-sorumlusu-cv-ornegi",
  title: "Depo Sorumlusu CV Örneği",
  occupation: "Depo Sorumlusu",
  category: "operations",
  experienceLevel: "mid",
  metaTitle: "Depo Sorumlusu CV Örneği ve Yazım Rehberi",
  metaDescription:
    "Sayım farkı, sevkiyat hızı ve ekip büyüklüğüyle yazılmış depo sorumlusu CV örneği. WMS, forklift ve FIFO ipuçları; ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "Depo sorumlusu arayan bir operasyon müdürü CV'de önce şunlara bakar: depo kaç metrekare, ne tür ürün, kaç kişilik ekip, hangi sistemle çalışılıyor ve sayımlar ne kadar tutuyor. Bu örnek, 8 yıllık depo deneyimi olan ve son 3 yılı sorumlu olarak geçen bir adayın bu bilgileri tek sayfada nasıl verdiğini gösteriyor.",
    sections: [
      {
        heading: "Özet: depo tipi ve ölçek",
        body: "Özette ilk olarak hangi tür depoda çalıştığını yaz: hızlı tüketim dağıtım deposu, e-ticaret sipariş deposu, üretim hammadde deposu, soğuk zincir ya da yedek parça. Ardından ölçeği ver: depo alanı, ürün çeşidi (SKU sayısı), günlük sevkiyat adedi ve yönettiğin ekip. İki üç cümle yeterli; özetin amacı, okuyanın seni hangi depoya koyabileceğini hemen anlamasıdır.\n\nÜrün tipi de önemlidir. Gıda deposunda son kullanma tarihi ve sıcaklık takibi, e-ticaret deposunda tekli sipariş hızı ve iade yoğunluğu, yedek parça deposunda ise doğru adresleme ve parça kodu bilgisi öne çıkar. Hangi zorlukla uğraştığını tek cümleyle belirtmek, işverenin seni kendi deposuyla karşılaştırmasını kolaylaştırır.",
      },
      {
        heading: "Maddelerde sayım, hız ve hata",
        body: "Depo işinin sonuçları ölçülebilir: sayım farkı, sipariş toplama hatası, günlük sevkiyat kapasitesi, araç yükleme süresi, iş kazası sayısı. Bunlardan hangisini iyileştirdiysen rakamla yaz.\n\n- Zayıf: \"Depo sayımlarını yaptım.\"\n- Güçlü: \"Aylık devir sayımı düzenine geçip raf adreslerini yeniden düzenleyerek yıl sonu sayım farkını **%0,9'dan %0,2'ye** indirdim.\"\n\nMal kabul, yerleştirme, toplama, paketleme, sevkiyat ve iade süreçlerinin hangilerinden sorumlu olduğunu ayrı maddelerde göster. Ekip yönetiyorsan vardiya planlamasını ve yeni personel eğitimini de ekle.",
      },
      {
        heading: "Sistemler ve anahtar kelimeler",
        body: "İlanların çoğu depo yönetim sistemi (WMS) ve ERP deneyimi ister. Kullandığın sistemin adını biliyorsan yaz (SAP, Logo, Netsis ya da şirkete özel bir WMS); el terminali ve barkod okuyucuyla çalıştığını belirt. Aday takip sistemlerinin aradığı kavramları da yetkinliklerde kullan: stok yönetimi, mal kabul, adresleme, FIFO, FEFO, sipariş toplama, sevkiyat planlama, envanter sayımı, iade yönetimi, irsaliye kontrolü.",
      },
      {
        heading: "Forklift ve iş güvenliği belgeleri",
        body: "Depo ilanlarında forklift kullanabilmek çoğu zaman şarttır. Forklift operatörlüğü belgen varsa sertifikalar bölümüne aldığın yılla birlikte yaz; reach truck ya da istif makinesi kullanabiliyorsan bunu da belirt. İş sağlığı ve güvenliği eğitimlerini, ilk yardım ve yangın eğitimlerini de ekle. Sorumlu pozisyonunda ekibin güvenli çalışmasından sen sorumlu olacağın için iş kazası olmadan geçen dönemleri ya da yaptığın güvenlik düzenlemelerini maddelerde göstermek fark yaratır.",
      },
      {
        heading: "Ekip ve vardiya yönetimi",
        body: "Depo sorumlusu ile depo personeli arasındaki fark, işi planlayan ve ekibi yöneten kişi olmaktır. Kaç kişilik ekibi, kaç vardiyada yönettiğini, yoğun dönemlerde (kampanya, sezon, yıl sonu) geçici personeli nasıl organize ettiğini yaz. Kampanya döneminde günlük sevkiyatın kaça çıktığı ve bunun ek mesai olmadan ya da gecikmesiz kapandığı gibi bilgiler, yöneticinin en çok güvendiği kanıtlardır.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Depo tipini ve ölçeğini yazmamak: 500 m² yedek parça deposu ile 15.000 m² dağıtım merkezi farklı deneyimlerdir.\n- Görevleri sayıp sayım ve hata oranı gibi sonuçları atlamak.\n- Forklift belgesini ve kullandığın sistemi belirtmemek.\n- CV'yi iki sayfaya uzatmak: depo pozisyonlarında tek sayfa yeterli.\n- Vardiya düzenine uygunluk ve ikamet bilgisini unutmak: servis güzergâhı için sorulur.",
      },
    ],
  },
  content: {
    settings: {
      template: "compact",
      color: "#b45309",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Serkan Uçar",
      title: "Depo Sorumlusu",
      email: "serkan.ucar@ornek.com",
      phone: "0500 000 00 00",
      location: "Gebze, Kocaeli",
      extras: [
        { label: "Askerlik", value: "Tamamlandı" },
        { label: "Ehliyet", value: "B sınıfı" },
        { label: "Vardiya", value: "Vardiyalı çalışmaya uygun" },
      ],
    },
    summary:
      "Hızlı tüketim dağıtım depolarında 8 yıllık deneyime sahip, son 3 yıldır 12.000 m²'lik bir deponun sorumlusuyum. 2 vardiyada 24 kişilik ekiple günde ortalama 1.800 koli sevkiyat yapıyor; mal kabulden sayıma kadar tüm süreci WMS üzerinden yönetiyorum.",
    experience: [
      {
        position: "Depo Sorumlusu",
        company: "Çayırova Dağıtım ve Depolama A.Ş.",
        location: "Gebze, Kocaeli",
        start: "Şub 2022",
        current: true,
        bullets: [
          "12.000 m² depoda 2 vardiya ve 24 kişilik ekibin iş planını, izinlerini ve görev dağılımını yönettim.",
          "Aylık devir sayımına geçip raf adreslerini yeniden düzenleyerek yıl sonu sayım farkını **%0,9'dan %0,2'ye** indirdim.",
          "Hızlı dönen ürünleri sevkiyat kapısına yakın adreslere taşıyarak sipariş toplama süresini **%20** kısalttım.",
          "Gıda ürünlerinde FEFO kuralını WMS'te zorunlu hale getirdim; son kullanma tarihi geçen ürün imhası **yarıya** düştü.",
          "Kampanya dönemlerinde günlük sevkiyatı 3.000 koliye çıkarırken araç yüklemelerini gecikmesiz tamamladık.",
        ].join("\n"),
      },
      {
        position: "Depo Personeli / Forklift Operatörü",
        company: "Dilova Gıda Lojistik Ltd. Şti.",
        location: "Dilovası, Kocaeli",
        start: "Mar 2017",
        end: "Oca 2022",
        bullets: [
          "Mal kabulde irsaliye ve ürün kontrolü yapıp paletleri el terminaliyle adreslere yerleştirdim.",
          "Forklift ve reach truck ile yükleme, boşaltma ve yüksek raf istifleme işlerini yaptım; 5 yıl boyunca **kazasız** çalıştım.",
          "2020'de vardiya şefi yardımcılığına getirildim; yeni başlayan personele sistem ve güvenlik eğitimi verdim.",
        ].join("\n"),
      },
    ],
    skills: [
      { category: "Depo operasyonu", items: "Mal kabul, adresleme, sipariş toplama, sevkiyat planlama, iade yönetimi, envanter sayımı, FIFO ve FEFO" },
      { category: "Sistemler", items: "WMS, SAP (stok hareketleri), el terminali ve barkod okuyucu, Microsoft Excel" },
      { category: "Ekipman", items: "Forklift, reach truck, transpalet, istif makinesi" },
    ],
    education: [
      {
        school: "Anadolu Lisesi",
        degree: "Lise",
        location: "Kocaeli",
        start: "2010",
        end: "2014",
      },
    ],
    certifications: [
      { name: "Forklift Operatörlüğü Belgesi", issuer: "MEB onaylı mesleki eğitim kursu", date: "2017" },
      { name: "Temel İş Sağlığı ve Güvenliği Eğitimi", issuer: "Kurum içi eğitim", date: "2024" },
      { name: "İlk Yardım Sertifikası", issuer: "Sağlık Bakanlığı onaylı eğitim merkezi", date: "2023" },
    ],
    references: [],
  },
});
