import { defineExample } from "../define";

export default defineExample({
  slug: "endustri-muhendisi-cv-ornegi",
  title: "Endüstri Mühendisi CV Örneği",
  occupation: "Endüstri Mühendisi",
  category: "engineering",
  experienceLevel: "mid",
  metaTitle: "Endüstri Mühendisi CV Örneği ve Yazım Rehberi",
  metaDescription:
    "Planlama, verimlilik ve yalın projeleri rakamlarla anlatan endüstri mühendisi CV örneği. SAP, veri analizi ve sertifika ipuçları; ücretsiz düzenle.",
  guide: {
    intro:
      "Fabrika müdürleri, tedarik zinciri yöneticileri ve iş geliştirme ekipleri bir endüstri mühendisi CV'sinde önce hangi süreci iyileştirdiğine, bunu hangi yöntemle yaptığına ve sonucun maliyete ya da verimliliğe nasıl yansıdığına bakar. Bu örnek, beyaz eşya ve ambalaj sektörlerinde üretim planlama ve yalın dönüşüm projeleri yürütmüş, 7 yıllık deneyime sahip bir endüstri mühendisinin bu bilgileri nasıl sunduğunu gösteriyor.",
    sections: [
      {
        heading: "Özet: süreç, sektör ve etki",
        body: "Endüstri mühendisleri üretim planlama, yalın üretim ve sürekli iyileştirme, tedarik zinciri ve lojistik, kalite, iş etüdü, veri analitiği ve hatta finans gibi çok farklı rollerde çalışır. Özetin ilk cümlesinde hangi süreçte uzmanlaştığını ve hangi sektörde çalıştığını söyle. Ardından en güçlü sonucunu ekle: düşürdüğün bir stok seviyesi, artırdığın bir hat verimi ya da kurduğun bir planlama sistemi.\n\nEndüstri mühendisliği geniş bir alan olduğu için özet, işe alım yapan kişinin seni doğru rolle eşleştirmesini sağlayan en önemli bölümdür.",
      },
      {
        heading: "İyileştirmeyi önce ve sonra değerleriyle yaz",
        body: "Endüstri mühendisinin CV'sinde en güçlü madde, bir süreç göstergesinin önceki ve sonraki değerini veren maddedir. Hat dengeleme, OEE, stok devir hızı, teslimat performansı, çevrim süresi, iş gücü verimliliği ve planlama doğruluğu bu iş için kullanılabilecek göstergelerdir.\n\n- Zayıf: \"Montaj hattında verimlilik çalışmaları yaptım.\"\n- Güçlü: \"Bulaşık makinesi montaj hattını zaman etüdü ve hat dengeleme ile yeniden düzenleyerek istasyon sayısını 22'den 19'a indirdim; saatlik üretim **%11** arttı.\"\n\nProjeyi tek başına mı yoksa bir ekiple mi yürüttüğünü dürüstçe belirt; \"liderlik ettim\" ile \"görev aldım\" mülakatta farklı sorulara yol açar.",
      },
      {
        heading: "Yöntemler, yazılım ve veri becerileri",
        body: "Yetkinlikleri yöntemler, ERP ve planlama, analiz ve modelleme olarak grupla. Yöntem tarafında değer akışı haritalama, hat dengeleme, zaman etüdü, 5S, kaizen, SMED, kanban ve DMAIC; planlama tarafında MRP, S&OP, kapasite planlama ve talep tahmini sık aranır. SAP PP, MM ya da SD modüllerinde çalıştıysan modülüyle yaz.\n\nVeri tarafında Excel'in ötesine geçen becerilerin varsa açıkça belirt: SQL, Python, Power BI, Minitab, doğrusal programlama ya da simülasyon yazılımları (Arena, FlexSim gibi). Bu beceriler, endüstri mühendisini analitik ve dijital dönüşüm rollerine taşır.",
      },
      {
        heading: "Sertifikalar ve standartlar",
        body: "Yalın Altı Sigma kuşak eğitimleri (yeşil, kara kuşak) bu alanda en çok aranan belgelerdendir; eğitimi aldığın kurumu ve sertifika için tamamladığın projeyi yazmak, belgenin değerini artırır. ISO 9001, ISO 14001 ya da ISO 45001 süreçlerinde iç denetçi olarak görev aldıysan bunu sertifikalar bölümünde göster. Proje yönetimi tarafında PMP ya da benzeri bir belgen varsa ekle.\n\nYalnızca katılım belgesi olan kısa eğitimleri sıralamak yerine işte uyguladığın bir yöntemle bağlantılı olanları seç.",
      },
      {
        heading: "Projeler, staj ve eğitim",
        body: "Lisans bitirme projen bir firmayla yapılmışsa ve hâlâ ilgili bir alana başvuruyorsan kısa bir satırla ekleyebilirsin; birkaç yıllık deneyimden sonra ise iş projeleri bunun yerini almalıdır. Yüksek lisansın yöneylem araştırması, tedarik zinciri ya da veri bilimi gibi bir alandaysa tez konusunu yaz. İngilizce raporlama ve uluslararası ekiplerle çalışma, özellikle çok uluslu üretim şirketlerinde beklenen bir beceridir.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Yöntem adlarını sıralayıp nerede ve hangi sonuçla uyguladığını göstermemek.\n- İyileştirmeleri yüzde olarak verip başlangıç değerini hiç yazmamak.\n- Ekip projelerini tek başına yapılmış gibi anlatmak.\n- Hangi ERP modülünde ne yaptığını belirtmeden yalnızca \"SAP bilgisi\" yazmak.\n- Sektör ve ürün bilgisini atlamak: planlama ve yalın uygulamalar sektöre göre değişir.",
      },
    ],
  },
  content: {
    settings: {
      template: "timeline",
      color: "#6d28d9",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Ece Yalçınkaya",
      title: "Endüstri Mühendisi (Üretim Planlama ve Sürekli İyileştirme)",
      email: "ece.yalcinkaya@ornek.com",
      phone: "0500 000 00 00",
      location: "Manisa",
      linkedin: "linkedin.com/in/eceyalcinkaya-ornek",
    },
    summary:
      "Beyaz eşya ve ambalaj sektörlerinde 7 yıllık deneyime sahip endüstri mühendisiyim. Üretim planlama, hat dengeleme ve yalın dönüşüm projeleri yürütüyorum; SAP PP, Python ve Power BI ile planlama ve performans takibini veriye dayalı hale getiriyorum. Son rolümde 4 montaj hattının haftalık planlamasından ve sürekli iyileştirme programından sorumluyum; Yalın Altı Sigma Kara Kuşak eğitimimi tamamladım.",
    experience: [
      {
        position: "Kıdemli Üretim Planlama ve Sürekli İyileştirme Mühendisi",
        company: "Gediz Beyaz Eşya Sanayi A.Ş.",
        location: "Manisa",
        start: "Oca 2023",
        current: true,
        bullets: [
          "Bulaşık makinesi montaj hattını zaman etüdü ve hat dengeleme ile yeniden düzenleyerek istasyon sayısını 22'den 19'a indirdim; saatlik üretim **%11** arttı.",
          "4 montaj hattının haftalık üretim planını SAP PP üzerinde hazırlıyorum; plana uyum oranını **%82'den %94'e** çıkardım.",
          "Yarı mamul stoklarını kanban sistemine geçirerek hat yanı stok seviyesini **yaklaşık %35** azalttım.",
          "Python ile talep tahmin modeli geliştirip S&OP toplantılarına bağladım; aylık tahmin hatası (MAPE) **%21'den %13'e** düştü.",
          "Fabrika genelinde kaizen programını yönetiyorum; 2025 yılında 140 öneri uygulandı ve yıllık **yaklaşık 9 milyon TL** tasarruf raporlandı.",
        ].join("\n"),
      },
      {
        position: "Endüstri Mühendisi",
        company: "Akdeniz Ambalaj San. ve Tic. A.Ş.",
        location: "İzmir",
        start: "Ağu 2019",
        end: "Ara 2022",
        bullets: [
          "Oluklu mukavva hattında SMED çalışmasıyla ürün geçiş süresini **55 dakikadan 22 dakikaya** indirdim.",
          "Değer akışı haritalamasıyla siparişten sevkiyata geçen süreyi 9 günden **6 güne** düşürdüm.",
          "Power BI ile OEE ve fire takip panosu kurdum; vardiya amirleri günlük performansı ilk kez aynı ekrandan izlemeye başladı.",
          "ISO 9001 ve ISO 14001 iç denetimlerinde denetçi olarak görev aldım.",
        ].join("\n"),
      },
    ],
    skills: [
      { category: "Yalın ve iyileştirme", items: "Değer akışı haritalama, hat dengeleme, zaman etüdü, SMED, kanban, 5S, kaizen, DMAIC" },
      { category: "Planlama", items: "Üretim planlama, MRP, S&OP, kapasite planlama, talep tahmini" },
      { category: "Yazılım ve veri", items: "SAP PP ve MM, Python (pandas), SQL, Power BI, Minitab, Microsoft Excel" },
      { category: "Standartlar", items: "ISO 9001, ISO 14001 iç denetim" },
    ],
    education: [
      {
        school: "Dokuz Eylül Üniversitesi",
        field: "Endüstri Mühendisliği",
        degree: "Lisans",
        start: "2015",
        end: "2019",
        description: "Bitirme projesi: Bir ambalaj fabrikasında karma tamsayılı programlama ile vardiya çizelgeleme",
      },
    ],
    certifications: [
      { name: "Yalın Altı Sigma Kara Kuşak", issuer: "Bağımsız eğitim kuruluşu", date: "2024" },
      { name: "ISO 9001 ve ISO 14001 İç Denetçi Eğitimi", issuer: "Bağımsız belgelendirme kuruluşu", date: "2021" },
    ],
    languages: [{ language: "İngilizce", level: "C1 – İleri" }],
    references: [],
    interests: "Veri görselleştirme, kutu oyunları, koşu",
  },
});
