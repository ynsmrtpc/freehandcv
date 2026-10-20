import { defineExample } from "../define";

export default defineExample({
  slug: "makine-muhendisi-cv-ornegi",
  title: "Makine Mühendisi CV Örneği",
  occupation: "Makine Mühendisi",
  category: "engineering",
  experienceLevel: "mid",
  metaTitle: "Makine Mühendisi CV Örneği ve Yazım Rehberi",
  metaDescription:
    "Tasarım, üretim ve iyileştirme projelerini rakamlarla anlatan makine mühendisi CV örneği. CAD, yalın üretim ve ISO ipuçları; ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "Üretim müdürleri ve Ar-Ge yöneticileri bir makine mühendisi CV'sinde önce hangi sektörde, tasarım mı üretim mi tarafında çalıştığına ve sorumluluğundaki projelerin hangi sonucu verdiğine bakar. Bu örnek, otomotiv yan sanayinde ürün geliştirme ve üretim mühendisliği yapmış, 6 yıllık deneyime sahip bir makine mühendisinin bu bilgileri nasıl sunduğunu gösteriyor.",
    sections: [
      {
        heading: "Özet: sektör, alan ve ürün",
        body: "Makine mühendisliği; tasarım ve Ar-Ge, üretim ve proses, bakım, kalite, satış mühendisliği ve tesisat gibi birbirinden farklı yollara açılır. Özetin ilk cümlesinde hangisinde uzmanlaştığını ve hangi sektörde (otomotiv, beyaz eşya, savunma, makine imalatı, enerji, HVAC) çalıştığını söyle. Ardından ürün türünü ve ölçeği ver: tasarladığın parça ailesi, sorumlu olduğun hat sayısı ya da yıllık üretim adedi.\n\nYalnızca \"makine mühendisi\" yazmak, işe alım yapan kişiyi CV'nin tamamını okuyarak senin hangi masaya uygun olduğunu tahmin etmeye zorlar.",
      },
      {
        heading: "Projeleri teknik sonuçla anlat",
        body: "Her pozisyonun altında yürüttüğün projeleri problem, yöntem ve sonuç sırasıyla yaz. Makine mühendisliğinde ölçülebilir sonuçlar çoktur: ağırlık azaltma, çevrim süresi, fire ve hurda oranı, OEE, enerji tüketimi, parça maliyeti, müşteri şikâyeti sayısı.\n\n- Zayıf: \"Kalıp tasarımlarında görev aldım.\"\n- Güçlü: \"Sac şekillendirme kalıbının ara istasyonunu yeniden tasarlayıp ANSYS ile doğrulayarak parça hurda oranını **%4,2'den %1,1'e** indirdim.\"\n\nMüşteri ya da proje adı gizliyse \"Avrupalı bir otomobil üreticisi için\" gibi genel bir ifade kullan; ürün türü ve ölçek gizlilik ihlali olmadan da anlaşılır.",
      },
      {
        heading: "Yazılım ve teknik yetkinlikler",
        body: "Yetkinlikleri tasarım, analiz, üretim ve sistem olarak grupla. Tasarım tarafında SolidWorks, CATIA, Siemens NX ya da Creo; analizde ANSYS veya Abaqus; üretim tarafında CAM ve CNC programlama bilgisi sık aranır. GD&T (geometrik boyutlandırma ve toleranslandırma) ile teknik resim okuma neredeyse her ilanda geçer.\n\nYalın üretim araçlarını (5S, kaizen, SMED, değer akışı haritalama, poka-yoke) ve kalite yöntemlerini (FMEA, 8D, kontrol planı) ayrı bir grupta topla. SAP PP, MM veya PM modüllerinde çalıştıysan modülüyle yaz; ERP deneyimi üretim ilanlarında ayırt edicidir.",
      },
      {
        heading: "Standartlar, oda üyeliği ve belgeler",
        body: "Çalıştığın kalite ve yönetim sistemi standartlarını CV'de belirt: otomotivde IATF 16949 ve APQP–PPAP süreçleri, genel imalatta ISO 9001, çevre ve İSG tarafında ISO 14001 ile ISO 45001. Bir denetime hazırlık yaptıysan ya da iç denetçilik yaptıysan bunu deneyim maddesi olarak yaz.\n\nMMO üyeliğini kişisel bilgilere tek satırla ekle. Kaynak, hidrolik, pnömatik ya da enerji yöneticiliği gibi alanlarda belgen varsa sertifikalar bölümüne koy; yalnızca bir günlük tanıtım eğitimlerini ekleme.",
      },
      {
        heading: "Eğitim, dil ve kişisel bilgiler",
        body: "Lisans bilgisini üniversite, bölüm ve mezuniyet yılıyla ver; bitirme projen ya da yüksek lisans tezin başvurduğun alanla ilgiliyse tek satırla konusunu ekle. Yabancı müşterilerle çalışan firmalarda İngilizce teknik yazışma ve toplantı deneyimi beklenir; seviyeni Avrupa Ortak Çerçevesi ile belirt.\n\nErkek adaylar askerlik durumunu yazmalıdır. Vardiyalı çalışmaya, şehir dışı ya da yurt dışı devreye alma işlerine uygunsan bunu da kişisel bilgilerde belirt.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Tasarım mı üretim mi yaptığını belirtmemek: iki alan farklı yetkinlik ister.\n- Kullanmadığın CAD ve analiz yazılımlarını listelemek: teknik mülakatta pratik olarak sorulur.\n- Projeleri sonuçsuz anlatmak: hurda, çevrim süresi ya da maliyet gibi bir ölçüt ekle.\n- Gizli müşteri adlarını, çizim numaralarını ya da teklif fiyatlarını paylaşmak.\n- Yalın üretim ve kalite araçlarını yalnızca kısaltma olarak sıralamak, nerede uyguladığını göstermemek.",
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
      name: "Serkan Bulut",
      title: "Makine Mühendisi (Ürün ve Proses Geliştirme)",
      email: "serkan.bulut@ornek.com",
      phone: "0500 000 00 00",
      location: "Bursa",
      linkedin: "linkedin.com/in/serkanbulut-ornek",
      extras: [
        { label: "Askerlik", value: "Tamamlandı" },
        { label: "Ehliyet", value: "B sınıfı" },
        { label: "Meslek odası", value: "MMO Bursa Şubesi üyesi" },
      ],
    },
    summary:
      "Otomotiv yan sanayinde 6 yıllık deneyime sahip makine mühendisiyim. Sac şekillendirme ve kaynaklı gövde parçalarında ürün geliştirme, kalıp ve fikstür tasarımı ile seri üretime geçiş (APQP–PPAP) süreçlerinde çalışıyorum. Son rolümde 3 pres hattının proses mühendisliğinden sorumluyum; SolidWorks, CATIA ve ANSYS ile tasarım yapıyor, yalın üretim projeleriyle hurda ve çevrim sürelerini düşürüyorum.",
    experience: [
      {
        position: "Proses Mühendisi",
        company: "Gökdere Otomotiv Parçaları San. A.Ş.",
        location: "Bursa",
        start: "Haz 2022",
        current: true,
        bullets: [
          "3 pres hattında yıllık **yaklaşık 2,5 milyon parça** üreten sac şekillendirme proseslerinin sorumluluğunu yürütüyorum.",
          "Kalıbın ara istasyonunu yeniden tasarlayıp ANSYS ile doğrulayarak parça hurda oranını **%4,2'den %1,1'e** indirdim; yıllık malzeme tasarrufu yaklaşık 3 milyon TL oldu.",
          "SMED çalışmasıyla kalıp değiştirme süresini **48 dakikadan 19 dakikaya** düşürdüm; hattın OEE değeri %68'den %77'ye çıktı.",
          "Avrupalı bir otomobil üreticisi için 7 yeni parçanın APQP–PPAP sürecini yürüttüm; tüm parçalar **ilk sunumda onay** aldı.",
          "IATF 16949 denetimi öncesinde proses FMEA ve kontrol planlarını güncelleyip denetimi majör bulgusuz tamamladık.",
        ].join("\n"),
      },
      {
        position: "Ürün Geliştirme Mühendisi",
        company: "Marmara Metal Şekillendirme Ltd. Şti.",
        location: "Bursa",
        start: "Eyl 2020",
        end: "May 2022",
        bullets: [
          "Ticari araç şasi bağlantı parçaları için SolidWorks ve CATIA ile 20'den fazla parça ve fikstür tasarımı yaptım.",
          "Topoloji optimizasyonuyla bir montaj braketinin ağırlığını dayanım şartlarını koruyarak **%18** azalttım.",
          "Kaynak fikstürlerini yeniden tasarlayarak montaj hattında ölçü dışı parça şikâyetlerini **yarı yarıya** azalttım.",
        ].join("\n"),
      },
      {
        position: "Bakım Mühendisi",
        company: "Marmara Metal Şekillendirme Ltd. Şti.",
        location: "Bursa",
        start: "Tem 2019",
        end: "Ağu 2020",
        bullets: [
          "Pres ve kaynak robotlarının planlı bakım programını SAP PM üzerinde yürüttüm; plansız duruş süresi **%25** azaldı.",
          "Hidrolik pres arızalarının kök neden analizlerini 8D yöntemiyle raporladım.",
        ].join("\n"),
      },
    ],
    skills: [
      { category: "Tasarım ve analiz", items: "SolidWorks, CATIA V5, ANSYS Mechanical, GD&T, teknik resim, kalıp ve fikstür tasarımı" },
      { category: "Üretim ve yalın", items: "Sac şekillendirme, kaynak prosesleri, SMED, 5S, kaizen, değer akışı haritalama, OEE takibi" },
      { category: "Kalite", items: "APQP, PPAP, PFMEA, kontrol planı, 8D, IATF 16949, ISO 9001" },
      { category: "Sistemler", items: "SAP PP ve PM, Microsoft Excel, Minitab (temel)" },
    ],
    education: [
      {
        school: "Bursa Uludağ Üniversitesi",
        field: "Makine Mühendisliği",
        degree: "Lisans",
        start: "2014",
        end: "2019",
        description: "Bitirme projesi: Sac şekillendirmede geri yaylanmanın sonlu elemanlar yöntemiyle incelenmesi",
      },
    ],
    certifications: [
      { name: "IATF 16949 İç Denetçi Eğitimi", issuer: "Bağımsız eğitim ve belgelendirme kuruluşu", date: "2023" },
      { name: "Yalın Altı Sigma Yeşil Kuşak", issuer: "Bağımsız eğitim kuruluşu", date: "2021" },
    ],
    languages: [{ language: "İngilizce", level: "B2 – İyi" }],
    references: [],
    interests: "Motor sporları, 3B yazıcıyla prototip üretimi, yüzme",
  },
});
