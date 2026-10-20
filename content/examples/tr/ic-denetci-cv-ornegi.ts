import { defineExample } from "../define";

export default defineExample({
  slug: "ic-denetci-cv-ornegi",
  title: "İç Denetçi CV Örneği",
  occupation: "İç Denetçi",
  category: "finance",
  experienceLevel: "mid",
  metaTitle: "İç Denetçi CV Örneği ve Yazım Rehberi",
  metaDescription:
    "Bağımsız denetimden holding iç denetimine geçmiş, CIA sertifikalı iç denetçi CV örneği. Bulgu, veri analitiği ve ATS ipuçları; ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "İç denetim başkanları bir iç denetçi CV'sinde önce hangi süreçleri denetlediğine, bulgularının ne tür sonuç doğurduğuna ve veri analitiğini ne ölçüde kullandığına bakar. Bu örnek, bağımsız denetimden bir holdingin iç denetim birimine geçmiş 10 yıllık bir denetçinin bu deneyimi tek sayfada nasıl topladığını gösteriyor.",
    sections: [
      {
        heading: "Özet: denetim alanını ve sektörleri belirt",
        body: "İç denetim tek bir iş değildir; finansal süreç denetimi, operasyonel denetim, bilgi sistemleri denetimi ve suistimal incelemesi farklı beceriler ister. Özetinde toplam deneyimini, bağımsız denetim ve iç denetim yıllarını ayrı ayrı, denetlediğin sektörleri ve ana süreçleri yaz. Sertifikan varsa özette de an; ilk elemede en çok bakılan bilgilerden biridir.\n\nÖrneğin: \"4,5 yıl bağımsız denetimin ardından son 5,5 yıldır perakende, üretim ve lojistik şirketlerinden oluşan bir grubun iç denetim biriminde risk bazlı süreç denetimleri yürütüyorum.\"",
      },
      {
        heading: "Deneyim maddelerini bulgu ve etkiyle yaz",
        body: "\"Satın alma süreci denetimi yaptım\" maddesi ne bulduğunu ve neyi değiştirdiğini söylemez. Güçlü bir iç denetim maddesinde denetlenen süreç, kullanılan yöntem ve bulgunun yarattığı sonuç bir arada olur. Sonucu tutar yerine oran, kayıt sayısı ya da kapanan aksiyon sayısıyla ver; şirkete ait gizli rakamları CV'ye taşıma.\n\n- Zayıf: \"Tedarikçi süreçlerini denetledim.\"\n- Güçlü: \"Tedarikçi ana verisini tam popülasyon analiziyle inceledim; mükerrer ödeme riski taşıyan **47 kaydın** kapatılmasını ve yetki ayrılığı kontrolünün kurulmasını sağladım.\"\n\nAksiyon takibindeki katkını da ölç: vadesinde kapanan aksiyon oranı, tekrar eden bulgu sayısı gibi.",
      },
      {
        heading: "Veri analitiği ve araçlar",
        body: "Örnekleme yerine tam popülasyon testi yapabilen denetçiler bugün öne çıkıyor. SQL, Excel Power Query, Power BI ya da denetim analitiği yazılımlarıyla ne yaptığını somut yaz: hangi veriyi, hangi riski görmek için analiz ettin, sürekli denetim için bir pano kurdun mu? ERP deneyimini de belirt; SAP veya Logo gibi sistemlerde yetki ve iş akışı yapısını bilmek, süreç denetimlerinde doğrudan işe yarar.\n\nAnalitik becerini bir sonuçla bağla. \"Power BI kullanıyorum\" yerine \"depo bazlı sayım farklarını izleyen bir pano kurdum ve yüksek riskli depoları üç ayda bir raporladım\" demek, aracı bildiğini değil, denetime nasıl uyguladığını gösterir. Örneklem testinden tam popülasyon testine geçişte test süresinin nasıl değiştiğini de yazabilirsin.",
      },
      {
        heading: "Sertifikalar ve mesleki gelişim",
        body: "CIA (Certified Internal Auditor) iç denetimde en çok bilinen sertifikadır; bilgi sistemleri denetimine yöneliyorsan CISA, suistimal incelemesine yöneliyorsan CFE ilanlarda sıkça geçer. Sertifikayı aldığın yılla yaz; sınav aşamasındaysan kaç bölümü tamamladığını belirt. Türkiye İç Denetim Enstitüsü (TİDE) üyeliği ve katıldığın eğitimler de mesleki gelişimini gösterir.",
      },
      {
        heading: "ATS ve anahtar kelimeler",
        body: "Holdingler ve bankalar iç denetim başvurularını çoğu zaman aday takip sistemiyle tarar. Risk bazlı denetim planı, iç kontrol, COSO, IIA standartları, süreç denetimi, suistimal incelemesi, denetim komitesi raporlaması, aksiyon takibi, TFRS ve veri analitiği gibi ifadeleri beceriler bölümünde gruplandır. Bağımsız denetimden geliyorsan iç kontrol testleri ve maddi doğrulama deneyimini ayrı ayrı yaz; ikisi aynı beceri değildir.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Denetlenen şirketlerin gizli finansal verilerini ya da bulgu ayrıntılarını paylaşmak.\n- Her denetimi \"süreç denetimi yaptım\" diye özetleyip bulguyu ve sonucu yazmamak.\n- Bağımsız denetim ve iç denetim deneyimini birbirine karıştırmak.\n- Ekip liderliği ve denetim komitesi raporlaması gibi kıdem göstergelerini atlamak.\n- Sertifika sınav aşamasını tamamlanmış gibi yazmak.",
      },
    ],
  },
  content: {
    settings: {
      template: "formal",
      color: "#334155",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Gamze Altıntaş",
      title: "Kıdemli İç Denetçi, CIA",
      email: "gamze.altintas@ornek.com",
      phone: "0500 000 00 00",
      location: "İstanbul",
      linkedin: "linkedin.com/in/gamzealtintas-ornek",
    },
    summary:
      "10 yıllık deneyime sahip, CIA sertifikalı iç denetçiyim. 4,5 yıl bağımsız denetim firmasında finansal tablo denetimlerinde, son 5,5 yıldır perakende, üretim ve lojistik şirketlerinden oluşan bir grubun iç denetim biriminde risk bazlı süreç denetimlerinde çalışıyorum. Satın alma, stok ve hasılat süreçlerinde tam popülasyon veri analiziyle denetim yapıyor, bulguların aksiyon takibini ve denetim komitesi raporlamasını yürütüyorum.",
    experience: [
      {
        position: "Kıdemli İç Denetçi",
        company: "Sedirhan Holding A.Ş. – İç Denetim Başkanlığı",
        location: "İstanbul",
        start: "Mar 2021",
        current: true,
        bullets: [
          "6 grup şirketinde risk bazlı yıllık denetim planı kapsamında yılda 8–10 denetim görevini yürütüyor, 2 kişilik ekibe saha liderliği yapıyorum.",
          "Tedarikçi ana verisini tam popülasyon analiziyle inceledim; mükerrer ödeme riski taşıyan **47 kaydın** kapatılmasını ve yetki ayrılığı kontrolünün kurulmasını sağladım.",
          "Depo bazlı stok sayım farklarını izleyen sürekli denetim panosunu Power BI ile kurdum; yönetimin aksiyonlarıyla gruptaki sayım farkı oranı **%1,4'ten %0,6'ya** indi.",
          "Bulgu aksiyonlarını aylık takip toplantısına bağladım; vadesinde kapanan aksiyon oranı **%61'den %88'e** yükseldi.",
          "Denetim komitesine sunulan üç aylık faaliyet raporlarını ve yıllık risk değerlendirmesini hazırlayan ekipte yer alıyorum.",
        ].join("\n"),
      },
      {
        position: "Bağımsız Denetim Uzmanı",
        company: "Atlaskent Bağımsız Denetim A.Ş.",
        location: "İstanbul",
        start: "Eyl 2016",
        end: "Şub 2021",
        bullets: [
          "Üretim, perakende ve enerji sektörlerinden 15'ten fazla şirketin TFRS'ye göre hazırlanan finansal tablolarının bağımsız denetiminde görev aldım.",
          "Hasılat, stok ve ticari alacak döngülerinde iç kontrol testlerini ve maddi doğrulama prosedürlerini uyguladım; yıl sonu stok sayım gözlemlerine katıldım.",
          "Son 2 yılda 3–4 kişilik saha ekiplerinin iş planını ve çalışma kâğıtlarının ilk incelemesini yaptım.",
          "Yevmiye kaydı testlerini Excel makrolarından SQL sorgularına taşıdım; büyük müşterilerde test süresi **yaklaşık 2 günden yarım güne** indi.",
        ].join("\n"),
      },
    ],
    skills: [
      {
        category: "Denetim",
        items: "Risk bazlı denetim planlama, süreç ve kontrol denetimi, COSO iç kontrol çerçevesi, IIA standartları, suistimal incelemesi",
      },
      { category: "Veri analitiği", items: "SQL, Excel (Power Query, pivot tablo), Power BI, tam popülasyon testleri, sürekli denetim" },
      { category: "Finans ve raporlama", items: "TFRS, finansal tablo analizi, denetim komitesi raporlaması, bulgu ve aksiyon takibi" },
      { category: "Sistemler", items: "SAP (satın alma ve stok modülleri), Logo Tiger" },
    ],
    education: [
      {
        school: "Yıldız Teknik Üniversitesi",
        field: "İktisat",
        degree: "Lisans",
        start: "2012",
        end: "2016",
      },
    ],
    certifications: [
      { name: "Certified Internal Auditor (CIA)", issuer: "The Institute of Internal Auditors (IIA)", date: "2023" },
      { name: "Suistimal İncelemesi ve Adli Muhasebe Eğitimi", issuer: "Mesleki eğitim programı", date: "2022" },
    ],
    languages: [{ language: "İngilizce", level: "C1 – İleri" }],
    references: [],
    interests: "Satranç, uzun mesafe koşu, polisiye romanlar",
  },
});
