import { defineExample } from "../define";

export default defineExample({
  slug: "elektrik-elektronik-muhendisi-cv-ornegi",
  title: "Elektrik-Elektronik Mühendisi CV Örneği",
  occupation: "Elektrik-Elektronik Mühendisi",
  category: "engineering",
  experienceLevel: "entry",
  metaTitle: "Elektrik-Elektronik Mühendisi CV Örneği",
  metaDescription:
    "Staj, bitirme projesi ve teknik becerileri öne çıkaran yeni mezun elektrik-elektronik mühendisi CV örneği. Proje ve yazılım ipuçları; ücretsiz düzenle.",
  guide: {
    intro:
      "Ar-Ge yöneticileri ve enerji firmalarının teknik ekipleri yeni mezun bir elektrik-elektronik mühendisinin CV'sinde önce hangi alana yöneldiğine, stajlarda ve projelerde gerçekten ne yaptığına ve hangi araçları kullanabildiğine bakar. Bu örnek, gömülü sistemler ve güç elektroniği üzerine iki staj ve bir bitirme projesi yapmış bir yeni mezunun bu bilgileri tek sayfada nasıl sunduğunu gösteriyor.",
    sections: [
      {
        heading: "Özet: hangi alana yöneldiğini söyle",
        body: "Elektrik-elektronik mühendisliği güç sistemleri ve enerji, elektrik tesisatı ve taahhüt, otomasyon, gömülü sistemler, haberleşme, RF ve donanım tasarımı gibi çok farklı alanlara ayrılır. Yeni mezun olarak her şeye açık görünmek yerine özetin ilk cümlesinde ilgi alanını belirt ve bunu bir staj ya da projeyle destekle.\n\nFarklı alanlara başvuruyorsan her başvuruda özeti ve yetkinliklerin sırasını ilana göre düzenle; aynı CV'yi hem gömülü yazılım hem trafo merkezi ilanına göndermek iki tarafta da zayıf kalır.",
      },
      {
        heading: "Stajları ve projeleri iş deneyimi gibi yaz",
        body: "Yeni mezun bir mühendisin CV'sinde stajlar ve bitirme projesi deneyim bölümünün yerini tutar. Her staj için hangi birimde çalıştığını, hangi işi üstlendiğini ve somut bir çıktıyı yaz: tasarladığın bir devre kartı, yazdığın bir test yazılımı, hazırladığın bir rapor.\n\n- Zayıf: \"Stajımda Ar-Ge biriminde projelere destek oldum.\"\n- Güçlü: \"STM32 tabanlı sensör kartı için UART ve I2C sürücülerini C ile yazıp test düzeneğini kurdum; kart **ilk prototipte** çalıştı.\"\n\nTÜBİTAK destekli bir öğrenci projesinde, öğrenci kulübünde ya da bir yarışma takımında (elektrikli araç, roket, robot) görev aldıysan sorumluluğunu ve takımın aldığı sonucu ekle.",
      },
      {
        heading: "Teknik yetkinlikleri seviyeyle ver",
        body: "Yetkinlikleri yazılım ve diller, tasarım ve simülasyon, donanım ve laboratuvar olarak grupla. Sık aranan araçlar şunlardır: MATLAB ve Simulink, LTspice veya PSpice, Altium Designer ya da KiCad, C ve gömülü C, Python, PLC programlama (Siemens TIA Portal gibi), AutoCAD ile elektrik projesi çizimi ve DIALux ile aydınlatma hesabı.\n\nOsiloskop, spektrum analizörü ve lehimleme gibi laboratuvar becerilerini de ekle; donanım ekipleri bunu sahada iş yapabilen biri olarak okur. Yalnızca bir derste kullandığın aracı \"temel\" diye işaretle.",
      },
      {
        heading: "Bitirme projesi ve not ortalaması",
        body: "Bitirme projen başvurduğun alanla ilgiliyse ayrı bir projeler bölümünde ayrıntılı anlat: amacı, kullandığın yöntem ve araçlar, ölçtüğün sonuç. Verimlilik, hata oranı, maliyet ya da tepki süresi gibi bir ölçüt projenin ciddiyetini gösterir. Proje kodu ya da şeması açık bir depoda duruyorsa bağlantısını ver.\n\nNot ortalaman 3,00 ve üzerindeyse yaz; bölüm derecen ya da onur öğrencisi belgen varsa ekle. Yabancı dil için Avrupa Ortak Çerçevesi seviyesini veya YDS puanını kullan.",
      },
      {
        heading: "Belgeler, oda ve askerlik",
        body: "Yeni mezun için en değerli belgeler, işe doğrudan katkı sağlayanlardır: PLC ve otomasyon eğitimleri, İSG eğitimi, yüksek gerilim çalışmalarında güvenlik eğitimleri. EMO üyeliği tesisat ve proje alanında çalışacaklar için önemlidir; üye olduysan ya da öğrenciyken oda etkinliklerine katıldıysan belirt.\n\nErkek adaylar askerlik durumunu açıkça yazmalıdır; tecilliysen tecil bitiş tarihini ekle. Saha işlerine başvuruyorsan B sınıfı ehliyet ve şehir dışında çalışabilme bilgisi çoğu ilanda sorulur.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Her alana uygun görünmeye çalışıp hiçbir alanda derinlik göstermemek.\n- Stajları yalnızca kurum adı ve tarihle yazmak, yapılan işi anlatmamak.\n- Derste bir kez açtığın yazılımları uzman seviyesinde göstermek.\n- Bitirme projesini sonuç ölçütü olmadan bir cümleyle geçmek.\n- Askerlik durumunu yazmamak: birçok firma ilk elemede bu bilgiye bakar.",
      },
    ],
  },
  content: {
    settings: {
      template: "graduate",
      color: "#0e7490",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Barış Kocaman",
      title: "Elektrik-Elektronik Mühendisi (Yeni Mezun)",
      email: "baris.kocaman@ornek.com",
      phone: "0500 000 00 00",
      location: "Trabzon (İstanbul ve Ankara'ya taşınabilir)",
      linkedin: "linkedin.com/in/bariskocaman-ornek",
      github: "github.com/bariskocaman-ornek",
      extras: [
        { label: "Askerlik", value: "Tecilli (2028'e kadar)" },
        { label: "Ehliyet", value: "B sınıfı" },
      ],
    },
    summary:
      "2026 yılında Karadeniz Teknik Üniversitesi Elektrik-Elektronik Mühendisliği bölümünden 3,18 ortalamayla mezun oldum. Gömülü sistemler ve güç elektroniği alanında çalışmak istiyorum; Ar-Ge stajımda STM32 tabanlı bir sensör kartının yazılımını geliştirdim, bitirme projemde güneş paneli için MPPT'li bir şarj kontrolcüsü tasarladım. C, MATLAB/Simulink ve KiCad ile çalışıyorum.",
    experience: [
      {
        position: "Ar-Ge Stajyeri (Gömülü Sistemler)",
        company: "Doğu Karadeniz Elektronik San. A.Ş.",
        location: "Trabzon",
        start: "Tem 2025",
        end: "Eyl 2025",
        bullets: [
          "STM32 tabanlı sıcaklık ve nem sensör kartı için UART ve I2C sürücülerini C ile yazıp test düzeneğini kurdum; kart **ilk prototipte** çalıştı.",
          "Üretim hattı için Python ile seri port üzerinden çalışan bir fonksiyon test yazılımı geliştirdim; kart başına test süresi **4 dakikadan 50 saniyeye** indi.",
          "KiCad'de iki katmanlı bir güç kartının şematik ve yerleşim revizyonuna destek verdim.",
        ].join("\n"),
      },
      {
        position: "Saha Stajyeri (Elektrik Tesisatı)",
        company: "Altınkum Enerji Taahhüt Ltd. Şti.",
        location: "Trabzon",
        start: "Tem 2024",
        end: "Ağu 2024",
        bullets: [
          "Bir hastane ek binasının alçak gerilim tesisatında pano montajı, kablo güzergâhı ve topraklama ölçümlerinin takibine katıldım.",
          "AutoCAD'de aydınlatma ve priz projelerinin revizyon çizimlerini hazırladım; DIALux ile 3 mahalin aydınlatma hesabını yaptım.",
        ].join("\n"),
      },
    ],
    projects: [
      {
        name: "MPPT'li güneş paneli şarj kontrolcüsü (bitirme projesi)",
        role: "Proje ekibi (3 kişi), donanım ve yazılım sorumlusu",
        start: "Eyl 2025",
        end: "Haz 2026",
        technologies: "MATLAB/Simulink, LTspice, KiCad, STM32, C",
        description:
          "200 W panel için senkron buck dönüştürücülü şarj kontrolcüsü tasarlayıp prototipini ürettik; değiştir-gözle algoritmasıyla laboratuvar testlerinde **%94 dönüştürücü verimi** ölçtük. Proje TÜBİTAK 2209-A kapsamında desteklendi.",
      },
      {
        name: "Elektrikli araç takımı – batarya yönetim sistemi",
        role: "Takım üyesi",
        start: "2023",
        end: "2025",
        technologies: "C, CAN, Altium Designer",
        description:
          "Üniversite elektrikli araç takımında hücre gerilimi ve sıcaklık izleme kartının test ve CAN haberleşmesi yazılımında görev aldım.",
      },
    ],
    skills: [
      { category: "Yazılım ve diller", items: "C (gömülü), Python, MATLAB" },
      { category: "Tasarım ve simülasyon", items: "Simulink, LTspice, KiCad, Altium Designer (temel), AutoCAD, DIALux" },
      { category: "Donanım", items: "STM32, UART/I2C/SPI/CAN, osiloskop, lehimleme, güç elektroniği devreleri" },
      { category: "Otomasyon", items: "Siemens TIA Portal ile PLC programlama (temel)" },
    ],
    education: [
      {
        school: "Karadeniz Teknik Üniversitesi",
        field: "Elektrik-Elektronik Mühendisliği",
        degree: "Lisans",
        start: "2021",
        end: "2026",
        gpa: "3,18 / 4,00",
        description: "İngilizce hazırlık sınıfı dahil",
      },
    ],
    certifications: [
      { name: "PLC Programlama ve Endüstriyel Otomasyon Eğitimi (40 saat)", issuer: "Üniversite sürekli eğitim merkezi", date: "2025" },
      { name: "Temel İş Sağlığı ve Güvenliği Eğitimi", issuer: "Yetkili İSG eğitim kurumu", date: "2024" },
    ],
    languages: [{ language: "İngilizce", level: "B2 – İyi (YDS 70 – 2025)" }],
    references: [],
    interests: "Elektronik hobi projeleri, amatör telsizcilik, dağ yürüyüşü",
  },
});
