import { defineExample } from "../define";

export default defineExample({
  slug: "bilgi-islem-destek-uzmani-cv-ornegi",
  title: "Bilgi İşlem Destek Uzmanı CV Örneği",
  occupation: "Bilgi İşlem Destek Uzmanı",
  category: "technology",
  experienceLevel: "entry",
  metaTitle: "Bilgi İşlem Destek Uzmanı CV Örneği ve Rehber",
  metaDescription:
    "Staj ve ilk iş deneyimiyle yazılmış bilgi işlem destek uzmanı CV örneği. Yardım masası, donanım ve ağ yetkinlikleri için ipuçları; ücretsiz düzenle.",
  guide: {
    intro:
      "Bilgi işlem destek pozisyonlarında işe alım yapanlar bir CV'de önce hangi sorunları kendi başına çözebildiğini, hangi sistemleri tanıdığını ve kullanıcılarla nasıl iletişim kurduğunu arar. Bu örnek, önlisans mezunu ve bir yıllık deneyime sahip bir destek uzmanının bunu tek sayfada nasıl anlattığını gösteriyor.",
    sections: [
      {
        heading: "Özet: destek verdiğin ortamı tarif et",
        body: "Destek uzmanı özetinde kaç kullanıcıya, hangi ortamda (ofis, fabrika, okul, mağaza zinciri) ve hangi kanallardan (telefon, talep sistemi, yerinde) destek verdiğini yaz. Bunun yanında en çok güvendiğin iki üç teknik konuyu ekle: Windows kurulum ve sorun giderme, Active Directory kullanıcı işlemleri, yazıcı ve ağ sorunları gibi.\n\n\"Bilgisayara ilgili, çözüm odaklı\" gibi genel ifadeler yerine şöyle bir cümle kur: \"200 kullanıcılı bir üretim tesisinde talep sistemi üzerinden birinci ve ikinci seviye destek veriyorum.\"",
      },
      {
        heading: "Deneyim maddelerini taleplerle ölç",
        body: "Yardım masası işinin en kolay ölçülen tarafı taleplerdir: günlük veya aylık çözülen talep sayısı, ilk temasta çözüm oranı, ortalama çözüm süresi ve kullanıcı memnuniyeti. Talep sisteminden bu sayıları alabiliyorsan maddelerinde kullan; tahminle sayı uydurma.\n\n- Zayıf: \"Kullanıcılara teknik destek verdim.\"\n- Güçlü: \"GLPI üzerinden ayda ortalama 180 talebi çözdüm; ilk temasta çözüm oranım **%72** oldu.\"\n\nTekrarlayan bir sorunu kalıcı olarak çözdüysen, bir kılavuz yazdıysan ya da kurulum işini hızlandırdıysan bunu ayrı bir madde olarak yaz; bu tür maddeler seni yalnızca talep kapatan adaylardan ayırır.",
      },
      {
        heading: "Yetkinlikler ve ATS anahtar kelimeleri",
        body: "İlanlarda en sık geçen kelimeler şunlardır: Windows 10/11 kurulum ve sorun giderme, Active Directory, Microsoft 365 (Outlook, Teams, OneDrive), donanım arıza tespiti, yazıcı ve tarayıcı kurulumu, TCP/IP, DNS, DHCP, VPN, uzaktan masaüstü araçları, talep yönetim sistemi ve ITIL. Bunları \"İşletim sistemi ve yazılım\", \"Donanım\", \"Ağ\" ve \"Araçlar\" başlıklarında grupla.\n\nİmaj alma (disk görüntüsü ile toplu kurulum), envanter takibi ve yedekleme gibi işler yaptıysan bunları da ekle; ilanlarda çoğu zaman ayrı bir madde olarak geçer.",
      },
      {
        heading: "Eğitim, sertifika ve staj",
        body: "Bu pozisyonlara genellikle bilgisayar programcılığı, bilgisayar teknolojisi veya bilgisayar mühendisliği mezunları başvurur. Önlisans mezunuysan zorunlu stajını işyeri adıyla ve yaptığın işlerle yaz; çoğu zaman ilk deneyimin olarak değerlendirilir.\n\nCompTIA A+, Cisco Networking Academy kursları veya ITIL 4 Foundation gibi eğitimler giriş seviyesinde fark yaratır. Sertifikan yoksa üniversite sürekli eğitim merkezlerinde aldığın ağ veya sistem kurslarını da tarihiyle yazabilirsin.",
      },
      {
        heading: "Kullanıcı iletişimi ve askerlik bilgisi",
        body: "Destek uzmanı her gün teknik bilgisi az olan kullanıcılarla konuşur. Kullanıcı eğitimi verdiysen, kısa kılavuzlar hazırladıysan ya da yönetici bilgisayarlarına destek verdiysen bunu belirt. Erkek adaylar için askerlik durumu bu pozisyonlarda sıkça sorulur; \"Tamamlandı\" veya tecil tarihini kişisel bilgiler bölümüne ekle. Ehliyetin varsa ve şubeler arası saha desteği isteniyorsa onu da yaz.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Ofis programlarını \"ileri düzey Word, Excel\" diye tek yetkinlik olarak öne çıkarmak: destek ilanlarında teknik sorun giderme aranır.\n- Kullandığın talep sisteminin adını yazmamak.\n- Lise veya kurs bilgilerini üniversite eğitiminin üstünde uzun uzun anlatmak.\n- Kullanıcı şifreleri, iç sunucu adları gibi bilgileri örnek vermek için paylaşmak.\n- CV'yi iki sayfaya uzatmak: giriş seviyesinde bir sayfa yeterli.",
      },
    ],
  },
  content: {
    settings: {
      template: "compact",
      color: "#2563eb",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Oğuzhan Kara",
      title: "Bilgi İşlem Destek Uzmanı",
      email: "oguzhan.kara@ornek.com",
      phone: "0500 000 00 00",
      location: "Kocaeli",
      linkedin: "linkedin.com/in/oguzhankara-ornek",
      extras: [
        { label: "Askerlik", value: "Tamamlandı" },
        { label: "Ehliyet", value: "B sınıfı" },
      ],
    },
    summary:
      "Bilgisayar programcılığı mezunuyum; bir yıldır 200 kullanıcılı bir üretim tesisinde birinci ve ikinci seviye bilgi işlem desteği veriyorum. Windows kurulum ve sorun giderme, Active Directory kullanıcı işlemleri, Microsoft 365, yazıcı ve temel ağ sorunlarında deneyimliyim. Talepleri kayıt altına alıp düzenli takip ediyor, tekrar eden sorunlar için kullanıcı kılavuzları hazırlıyorum.",
    experience: [
      {
        position: "Bilgi İşlem Destek Uzmanı",
        company: "Körfez Ambalaj San. ve Tic. A.Ş.",
        location: "Kocaeli",
        start: "Eki 2025",
        current: true,
        bullets: [
          "Fabrika ve ofisteki 200 kullanıcıya GLPI talep sistemi, telefon ve yerinde destekle hizmet veriyorum; ayda ortalama 180 talebi çözüyorum ve ilk temasta çözüm oranım **%72**.",
          "Active Directory'de hesap açma, kapatma, parola sıfırlama ve grup yetkisi işlemlerini yürütüyorum.",
          "Yeni bilgisayar kurulumları için hazır disk görüntüsü ve kontrol listesi oluşturdum; bir bilgisayarın teslime hazırlanma süresi **yarım günden 1,5 saate** indi.",
          "Outlook ve Teams için 5 kısa kullanıcı kılavuzu hazırladım; bu konulardaki tekrar eden talepler üç ayda **%30** azaldı.",
          "Donanım envanterini Excel listesinden GLPI'ye taşıyarak 260 cihazın zimmet ve garanti bilgisini tek yerde topladım.",
        ].join("\n"),
      },
      {
        position: "Bilgi İşlem Stajyeri",
        company: "Yalıboyu Bilişim Teknik Servis Ltd.",
        location: "Kocaeli",
        start: "Tem 2023",
        end: "Ağu 2023",
        bullets: [
          "Zorunlu staj kapsamında kurumsal müşterilerin bilgisayar ve yazıcı arızalarında teknisyenlere eşlik ettim; 40'tan fazla bilgisayarda işletim sistemi kurulumu yaptım.",
          "Kablolama ve ağ prizi testlerinde görev alarak 3 müşteri ofisinin ağ bağlantı sorunlarının giderilmesine yardımcı oldum.",
        ].join("\n"),
      },
    ],
    skills: [
      { category: "İşletim sistemi ve yazılım", items: "Windows 10/11 kurulum ve sorun giderme, Microsoft 365 (Outlook, Teams, OneDrive), temel Linux komutları" },
      { category: "Sunucu ve kimlik", items: "Active Directory kullanıcı ve grup işlemleri, Group Policy temelleri" },
      { category: "Donanım ve ağ", items: "Donanım arıza tespiti, yazıcı ve tarayıcı kurulumu, TCP/IP, DNS, DHCP, kablolama" },
      { category: "Araçlar", items: "GLPI, AnyDesk, uzak masaüstü, disk görüntüsü ile toplu kurulum" },
    ],
    education: [
      {
        school: "Kocaeli Üniversitesi",
        field: "Bilgisayar Programcılığı",
        degree: "Önlisans",
        start: "2022",
        end: "2024",
      },
    ],
    certifications: [
      { name: "CCNA: Introduction to Networks", issuer: "Cisco Networking Academy", date: "2024" },
      { name: "Windows Server Sistem Yönetimi Kursu", issuer: "Üniversite sürekli eğitim merkezi", date: "2025" },
    ],
    languages: [{ language: "İngilizce", level: "A2 – Temel" }],
    references: [],
    interests: "Bilgisayar toplama, ev ağı kurulumları, futbol",
  },
});
