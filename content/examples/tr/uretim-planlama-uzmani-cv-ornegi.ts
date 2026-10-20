import { defineExample } from "../define";

export default defineExample({
  slug: "uretim-planlama-uzmani-cv-ornegi",
  title: "Üretim Planlama Uzmanı CV Örneği",
  occupation: "Üretim Planlama Uzmanı",
  category: "operations",
  experienceLevel: "mid",
  metaTitle: "Üretim Planlama Uzmanı CV Örneği ve Rehberi",
  metaDescription:
    "Termine uyum, kapasite kullanımı ve stok seviyesiyle yazılmış üretim planlama uzmanı CV örneği. MRP, SAP PP ve ATS ipuçları; ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "Üretim planlama uzmanı arayan bir fabrika müdürü CV'de önce şunu merak eder: hangi üretim tipinde plan yaptın, kaç hat ve kaç ürünle çalıştın, planın sahada ne kadar tuttu? Bu örnek, beyaz eşya yan sanayisinde 6 yıllık deneyimi olan bir uzmanın planlama sonuçlarını termin, kapasite ve stok üzerinden nasıl anlattığını gösteriyor.",
    sections: [
      {
        heading: "Özet: üretim tipi, ölçek ve planlama ufku",
        body: "Özetin ilk cümlesinde hangi üretim ortamında çalıştığını adlandır: seri üretim, sipariş tipi üretim, parti üretimi ya da proje bazlı imalat. Ardından ölçeği ver: hat ya da tezgâh sayısı, aktif ürün kodu, aylık üretim adedi. Haftalık çizelgeleme mi yaptığın, yoksa aylık ve üç aylık ana üretim planından mı sorumlu olduğun da önemlidir; ikisi farklı beceriler ister.\n\nÖrnek: \"Sipariş tipi üretim yapan 3 hatlı bir tesiste 450 ürün kodunun haftalık çizelgesini ve aylık malzeme ihtiyaç planını hazırlıyorum.\"",
      },
      {
        heading: "Maddelerde termin, kapasite ve stok",
        body: "Planlamanın başarısı üç göstergeyle ölçülür: siparişlerin zamanında sevk oranı, hat ve tezgâh kapasitesinin ne kadar verimli kullanıldığı ve bu sırada ne kadar stok tutulduğu. Bu göstergelerden birini iyileştirdiysen öncesini ve sonrasını yaz. Stoğu düşürürken termini bozmadığını göstermek, işverenin en çok güvendiği kanıttır.\n\n- Zayıf: \"Haftalık üretim planlarını hazırladım.\"\n- Güçlü: \"Darboğaz preslerin vardiya planını yeniden kurarak zamanında sevk oranını **%84'ten %95'e** çıkardım.\"\n\nAcil sipariş ve plan değişikliklerini nasıl yönettiğini de bir maddeye dönüştür; sahayla kurduğun iletişim bu işin görünmeyen yarısıdır.",
      },
      {
        heading: "Sistemler ve ATS anahtar kelimeleri",
        body: "Planlama ilanlarında ERP deneyimi neredeyse her zaman istenir. Kullandığın sistemi ve modülü adıyla yaz: SAP PP, Logo, Netsis, Microsoft Dynamics ya da şirkete özel bir sistem. Excel'i ayrıca belirt; planlamacıların çoğu çizelgeyi hâlâ Excel'de son haline getirir, bu yüzden pivot tablo, makro ya da Power Query bilgisi fark yaratır.\n\nAday takip sistemleri şu kavramları arar: ana üretim planı (MPS), malzeme ihtiyaç planlaması (MRP), kapasite planlama, iş emri, ürün ağacı (BOM), OEE, emniyet stoğu, talep tahmini, satış ve operasyon planlaması (S&OP).",
      },
      {
        heading: "Satış, satın alma ve sahayla köprü",
        body: "Üretim planlama uzmanı, satışın verdiği sözle fabrikanın gerçek kapasitesi arasında denge kurar. Haftalık plan toplantılarını yönettiysen, satışa termin teyidi verdiysen ya da satın almayla kritik malzeme takibini birlikte yürüttüysen bunu yaz. Tedarik gecikmesi yüzünden hattın durma riskini nasıl önlediğin, mülakatta mutlaka sorulacak bir örnektir; CV'de kısaca yer alması konuşmayı kolaylaştırır.",
      },
      {
        heading: "Eğitim ve gelişim",
        body: "Bu pozisyon için çoğunlukla endüstri mühendisliği, makine mühendisliği ya da işletme mezuniyeti aranır. Yalın üretim, kaizen ya da altı sigma eğitimleri aldıysan sertifikalar bölümüne ekle; ancak yalnızca gerçekten tamamladığın programları, kurumuyla birlikte yaz. Bitirme projen bir planlama ya da çizelgeleme problemiyse eğitim bölümünde bir cümleyle anlatabilirsin.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Üretim tipini ve ölçeğini yazmamak: seri üretim ile proje bazlı imalatın planlaması farklıdır.\n- \"Planlama yaptım\" deyip termin ve stok sonucunu atlamak.\n- ERP adını yazıp hangi modülde ne yaptığını belirtmemek.\n- Satış ve satın almayla koordinasyonu hiç anlatmamak.\n- Kullanmadığın yöntemleri (örneğin APS yazılımları) yalnızca anahtar kelime olsun diye eklemek.",
      },
    ],
  },
  content: {
    settings: {
      template: "swiss",
      color: "#1d4ed8",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Burak Ertekin",
      title: "Üretim Planlama Uzmanı",
      email: "burak.ertekin@ornek.com",
      phone: "0500 000 00 00",
      location: "Manisa",
      linkedin: "linkedin.com/in/burakertekin-ornek",
      extras: [
        { label: "Askerlik", value: "Tamamlandı" },
        { label: "Ehliyet", value: "B sınıfı" },
      ],
    },
    summary:
      "Beyaz eşya yan sanayisinde 6 yıllık deneyime sahip üretim planlama uzmanıyım. Sipariş tipi üretim yapan 3 hatlı bir tesiste 450 ürün kodunun haftalık çizelgesini, aylık malzeme ihtiyaç planını ve kapasite analizini SAP PP üzerinden yürütüyorum. Termine uyumu artırırken stok seviyesini düşürmeye odaklanıyorum.",
    experience: [
      {
        position: "Üretim Planlama Uzmanı",
        company: "Gediz Metal Parça San. A.Ş.",
        location: "Manisa",
        start: "Mar 2022",
        current: true,
        bullets: [
          "3 pres ve montaj hattında 450 ürün kodunun haftalık üretim çizelgesini ve iş emirlerini SAP PP üzerinden hazırladım.",
          "Darboğaz preslerin vardiya ve kalıp değişim sırasını yeniden planlayarak zamanında sevk oranını **%84'ten %95'e** çıkardım.",
          "Emniyet stoklarını tüketim verisine göre yeniden hesaplayıp yarı mamul stoğunu **%22** azalttım; termin performansı düşmedi.",
          "Satış, satın alma ve üretimle haftalık plan toplantısını yöneterek acil sipariş değişikliklerini tek takvimde topladım.",
          "Excel ve Power Query ile günlük plan-gerçekleşen raporu kurdum; hat bazlı OEE takibini **günlük** hale getirdim.",
        ].join("\n"),
      },
      {
        position: "Üretim Planlama Mühendisi",
        company: "Akhisar Plastik Enjeksiyon Ltd. Şti.",
        location: "Manisa",
        start: "Tem 2020",
        end: "Şub 2022",
        bullets: [
          "28 enjeksiyon makinesinin kalıp ve hammadde planlamasını yaptım; renk geçişlerini gruplayarak ayar süresini **%15** kısalttım.",
          "Ürün ağaçlarını (BOM) ERP'de güncelleyip malzeme ihtiyaç planındaki eksik kalem uyarılarını yarıya indirdim.",
          "Kritik hammaddelerde satın almayla haftalık tedarik takibi yürüterek **malzeme kaynaklı hat duruşunu** önledim.",
        ].join("\n"),
      },
    ],
    skills: [
      { category: "Planlama", items: "Ana üretim planı (MPS), MRP, kapasite planlama, iş emri yönetimi, emniyet stoğu, talep tahmini, S&OP" },
      { category: "Sistemler", items: "SAP PP ve MM (temel), Microsoft Excel (pivot tablo, Power Query), Power BI (temel)" },
      { category: "Yöntemler", items: "Yalın üretim, SMED, OEE takibi, darboğaz analizi" },
    ],
    education: [
      {
        school: "Dokuz Eylül Üniversitesi",
        field: "Endüstri Mühendisliği",
        degree: "Lisans",
        location: "İzmir",
        start: "2015",
        end: "2020",
      },
    ],
    certifications: [
      { name: "Yalın Üretim Eğitimi", issuer: "Sanayi odası eğitim programı", date: "2023" },
      { name: "Altı Sigma Yeşil Kuşak Eğitimi", issuer: "Özel eğitim kurumu", date: "2021" },
    ],
    languages: [{ language: "İngilizce", level: "B2 – Orta üstü" }],
    references: [],
  },
});
