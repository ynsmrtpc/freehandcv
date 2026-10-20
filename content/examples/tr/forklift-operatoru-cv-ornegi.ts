import { defineExample } from "../define";

export default defineExample({
  slug: "forklift-operatoru-cv-ornegi",
  title: "Forklift Operatörü CV Örneği",
  occupation: "Forklift Operatörü",
  category: "operations",
  experienceLevel: "mid",
  metaTitle: "Forklift Operatörü CV Örneği ve Yazım Rehberi",
  metaDescription:
    "Belge, makine tipi, vardiya ve kazasız çalışma süresiyle yazılmış tek sayfalık forklift operatörü CV örneği. Ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "Forklift operatörü alımında işveren uzun cümleler okumaz; birkaç şeyi hızla kontrol eder: belgen var mı, hangi makineleri kullandın, kaç yıldır ve kazasız mı çalıştın, vardiyaya uygun musun? Bu örnek, depo ve fabrika ortamında 7 yıllık deneyimi olan bir operatörün bu bilgileri tek sayfada nasıl verdiğini gösteriyor.",
    sections: [
      {
        heading: "Belgeni en üste yaz",
        body: "Forklift kullanmak için operatörlük belgesi istenir ve ilanlardaki ilk eleme budur. Belgeni sertifikalar bölümüne aldığın yılla ve eğitimi veren kurumla birlikte yaz; özette de \"belgeli forklift operatörü\" ifadesini kullan. Bazı işverenler mesleki yeterlilik belgesi de ister; sende varsa ayrıca belirt.\n\nİş sağlığı ve güvenliği eğitimini, ilk yardım ve yangın eğitimlerini de ekle. Bu eğitimlerin tarihini yazmak, belgelerinin güncel olduğunu gösterir.",
      },
      {
        heading: "Makine tipi ve kapasite",
        body: "\"Forklift kullanırım\" demek yeterli değildir; dizel, elektrikli ve LPG'li forkliftler, reach truck, istif makinesi ve akülü transpalet farklı beceriler ister. Kullandığın makineleri, kaldırdığın yük kapasitesini (örneğin 3 ton) ve çalıştığın raf yüksekliğini yaz. Dar koridor ya da yüksek raf deneyimi, birçok depoda aranan bir özelliktir.\n\nÇalıştığın ortamı da kısaca anlat: dağıtım deposu, üretim tesisi, liman sahası, soğuk hava deposu ya da inşaat malzemesi deposu. Her ortamın yükü ve riski farklıdır. Fabrikada rulo, bobin ya da uzun malzeme taşıdıysan, soğuk depoda düşük sıcaklıkta çalıştıysan ya da açık sahada konteyner boşalttıysan bunları ayrı bir madde olarak yaz. İşveren, kendi sahasına en yakın deneyime sahip operatörü daha kısa eğitimle işe başlatabileceğini bilir.",
      },
      {
        heading: "Maddelerde hacim ve güvenlik",
        body: "Operatörlükte de rakam vardır: vardiyada indirilen ya da yüklenen araç sayısı, palet sayısı, kazasız geçen süre, hasarlı ürün oranı. Kısa ve net maddeler yaz.\n\n- Zayıf: \"Forkliftle yükleme yaptım.\"\n- Güçlü: \"Vardiyada ortalama 8 tırın yükleme ve boşaltmasını yaptım; 4 yıl boyunca **kazasız ve hasarsız** çalıştım.\"\n\nGünlük makine kontrolü (lastik, fren, hidrolik, akü) yaptığını ve arızaları bildirdiğini yazmak, işverenin güvenlik konusunda içini rahatlatır. Yaya yolu ve hız kurallarına uyduğunu, yükü görmediğin durumlarda geri geri ya da yönlendiriciyle ilerlediğini anlatmak da güvenli çalışmanın somut bir göstergesidir.",
      },
      {
        heading: "Vardiya, askerlik ve ikamet",
        body: "Kişisel bilgilere vardiyalı çalışmaya uygunluğunu, askerlik durumunu ve oturduğun ilçeyi yaz. Fabrika ve depolar çoğunlukla servisle çalışır; ikamet bilgisi servis güzergâhı için sorulur. B sınıfı ehliyetin varsa ekle; forklift için gerekmese de bazı işlerde araç kullanımı istenebilir.",
      },
      {
        heading: "Ek beceriler",
        body: "El terminaliyle okutma, barkodlu sayım, irsaliye kontrolü ve FIFO kuralına göre yerleştirme yapabiliyorsan bunları yetkinliklere ekle. Bu beceriler seni yalnızca makine kullanan biri değil, depo işini bilen bir operatör olarak gösterir ve ileride vardiya sorumluluğuna geçişi kolaylaştırır. Sayım dönemlerinde, kampanya yoğunluğunda ya da yeni personelin eğitiminde görev aldıysan bunları da birer madde olarak eklemekten çekinme.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Belgeyi yazmamak ya da yalnızca \"forklift kullanırım\" demek.\n- Makine tipini ve yük kapasitesini belirtmemek.\n- Kaza ve hasar geçmişini hiç anlatmamak: kazasız süre en güçlü kanıttır.\n- CV'yi gereksiz uzun tutmak: bu pozisyonda tek sayfa yeterli.\n- Vardiya uygunluğunu ve ikamet ilçesini atlamak.",
      },
    ],
  },
  content: {
    settings: {
      template: "compact",
      color: "#c2410c",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Hakan Demirel",
      title: "Forklift Operatörü",
      email: "hakan.demirel@ornek.com",
      phone: "0500 000 00 00",
      location: "Esenyurt, İstanbul",
      extras: [
        { label: "Askerlik", value: "Tamamlandı" },
        { label: "Ehliyet", value: "B sınıfı" },
        { label: "Vardiya", value: "3 vardiyaya uygun" },
      ],
    },
    summary:
      "Depo ve fabrika ortamında 7 yıllık deneyimi olan belgeli forklift operatörüyüm. Dizel ve elektrikli forklift, reach truck ve istif makinesi kullanıyorum; son 4 yıldır yüksek raflı bir dağıtım deposunda kazasız çalışıyorum.",
    experience: [
      {
        position: "Forklift Operatörü",
        company: "Hadımköy Lojistik Depolama A.Ş.",
        location: "Arnavutköy, İstanbul",
        start: "Haz 2022",
        current: true,
        bullets: [
          "Vardiyada ortalama 8 tırın yükleme ve boşaltmasını yaptım; 4 yıl boyunca **kazasız ve hasarsız** çalıştım.",
          "Reach truck ile 10 metreye kadar yüksek raflarda palet yerleştirme ve indirme işlerini el terminaliyle adresleyerek yaptım.",
          "Vardiya başında makine kontrol formunu doldurup fren, hidrolik ve akü sorunlarını bakım ekibine bildirdim.",
          "Yeni başlayan 5 operatöre depo kuralları ve güvenli istifleme konusunda saha eğitimi verdim.",
        ].join("\n"),
      },
      {
        position: "Depo Elemanı / Forklift Operatörü",
        company: "Beylikdüzü Ambalaj San. Ltd. Şti.",
        location: "Beylikdüzü, İstanbul",
        start: "Nis 2019",
        end: "May 2022",
        bullets: [
          "Üretimden gelen mamul paletlerini dizel forkliftle depoya taşıyıp FIFO kuralına göre istifledim.",
          "Sevkiyat öncesi irsaliye ve palet kontrolü yaparak yanlış yükleme hatalarını **sıfıra** indirdim.",
          "Yıl sonu sayımlarında barkodlu sayım ekibinde görev aldım.",
        ].join("\n"),
      },
    ],
    skills: [
      { category: "Makineler", items: "Dizel ve elektrikli forklift (3 tona kadar), reach truck, istif makinesi, akülü transpalet" },
      { category: "Depo işleri", items: "Yükleme ve boşaltma, yüksek raf istifleme, FIFO, palet adresleme, barkodlu sayım" },
      { category: "Güvenlik", items: "Günlük makine kontrolü, yük dengesi ve istif güvenliği, iş güvenliği kuralları" },
    ],
    education: [
      {
        school: "Mesleki ve Teknik Anadolu Lisesi",
        field: "Motorlu Araçlar Teknolojisi Alanı",
        degree: "Lise",
        location: "İstanbul",
        start: "2012",
        end: "2016",
      },
    ],
    certifications: [
      { name: "Forklift Operatörlüğü Belgesi", issuer: "MEB onaylı mesleki eğitim kursu", date: "2019" },
      { name: "Temel İş Sağlığı ve Güvenliği Eğitimi", issuer: "Kurum içi eğitim", date: "2025" },
      { name: "Yangın Söndürme Eğitimi", issuer: "Kurum içi eğitim", date: "2024" },
    ],
    references: [],
  },
});
