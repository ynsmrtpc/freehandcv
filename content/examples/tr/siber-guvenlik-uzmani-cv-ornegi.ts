import { defineExample } from "../define";

export default defineExample({
  slug: "siber-guvenlik-uzmani-cv-ornegi",
  title: "Siber Güvenlik Uzmanı CV Örneği",
  occupation: "Siber Güvenlik Uzmanı",
  category: "technology",
  experienceLevel: "mid",
  metaTitle: "Siber Güvenlik Uzmanı CV Örneği ve Yazım Rehberi",
  metaDescription:
    "SOC, olay müdahalesi ve sızma testi deneyimiyle siber güvenlik uzmanı CV örneği. Sertifika ve deneyim maddesi ipuçları; ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "Güvenlik ekiplerinin yöneticileri bir siber güvenlik CV'sinde önce hangi alanda çalıştığını (savunma, saldırı, yönetişim), hangi araçlarla ve hangi ölçekte olaylarla uğraştığını arar. Bu örnek, SOC analistliğinden olay müdahalesi ve sızma testine geçmiş 5 yıllık bir uzmanın bu bilgileri nasıl düzenlediğini gösteriyor.",
    sections: [
      {
        heading: "Özet: savunma mı, saldırı mı, yönetişim mi?",
        body: "Siber güvenlik çok geniş bir alan ve ilanlar genellikle belirli bir role yöneliktir: SOC analisti, olay müdahale uzmanı, sızma testi uzmanı, bulut güvenliği ya da bilgi güvenliği yönetişimi (GRC). Özetinde hangi rolde derinleştiğini, kaç yıldır çalıştığını ve en güçlü araçlarını yaz.\n\nÖrneğin: \"5 yıllık deneyimimin 3 yılı SOC'de, 2 yılı olay müdahalesi ve iç sızma testlerinde geçti; SIEM kural geliştirme ve EDR üzerinden tehdit avcılığında deneyimliyim.\" Bu cümle, CV'yi doğru ekip yöneticisine yönlendirir.",
      },
      {
        heading: "Deneyim maddelerinde süre ve kapsam kullan",
        body: "Güvenlikte en anlamlı ölçütler tespit ve müdahale süreleri (MTTD, MTTR), yanlış pozitif oranı, kapsanan varlık sayısı, kapatılan açık sayısı ve oltalama simülasyonu sonuçlarıdır. Bunları maddelerine taşı; ama hiçbir zaman müşteri adı, açığın teknik ayrıntısı ya da iç sistem bilgisi verme.\n\n- Zayıf: \"SIEM alarmlarını takip ettim.\"\n- Güçlü: \"Gürültü üreten 40 korelasyon kuralını yeniden yazdım; günlük alarm sayısı **1.200'den 350'ye** inerken kritik olay kaçırma yaşanmadı.\"\n\nSızma testi yapıyorsan test türünü (web, iç ağ, Active Directory), raporladığın bulgu sayısını ve bunların ne kadarının kapatıldığını yaz.",
      },
      {
        heading: "Yetkinlikler ve ATS anahtar kelimeleri",
        body: "Araçları alanlara göre grupla: \"SIEM ve izleme\" (Splunk, QRadar, Elastic), \"Uç nokta\" (EDR, Sysmon), \"Saldırı testleri\" (Burp Suite, Nmap, Metasploit, BloodHound), \"Bulut\" (AWS, Azure güvenliği), \"Çerçeveler\" (MITRE ATT&CK, OWASP Top 10, ISO 27001). Betik dili olarak Python veya PowerShell biliyorsan ayrıca belirt; otomasyon güvenlik ekiplerinde giderek daha çok aranıyor.\n\nKVKK süreçleri, ISO 27001 denetimleri veya sektörel düzenlemelere uyum çalışmalarında görev aldıysan bunu da yaz; özellikle finans ve sağlık sektöründe işverenler bu deneyimi arar.",
      },
      {
        heading: "Sertifikalar: rolle uyumlu olanı seç",
        body: "Siber güvenlikte sertifikalar işe alımda belirgin bir ağırlık taşır. Giriş ve orta seviyede CompTIA Security+ ve CySA+, savunma tarafında GIAC sertifikaları, saldırı tarafında uygulamalı sınavı olan OSCP sık aranır. Kıdemli ve yönetişim rollerinde CISSP ve CISM öne çıkar. Sertifika adını, veren kurumu ve yılını yaz; hazırlandığın bir sınavı \"devam ediyor\" diye belirtebilirsin ama tamamlanmış gibi göstermemelisin.",
      },
      {
        heading: "Laboratuvar, CTF ve topluluk katkıları",
        body: "İş dışında kendi laboratuvarını kurduysan, CTF yarışmalarına katıldıysan ya da bir hata ödül (bug bounty) programında sorumlu bildirim yaptıysan bunlar güçlü kanıtlardır. Platform sıralaman veya derecen varsa yaz; yazdığın teknik blog yazılarına bağlantı ver. Ancak yetkisiz yapılmış testleri ya da açıklanmamış zafiyetleri CV'de anlatma; bu, güvenlik ekiplerinde doğrudan eleme sebebidir.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Onlarca aracı deneyim düzeyi belirtmeden listelemek: yalnızca gerçekten kullandıklarını yaz.\n- Eski işverenin altyapısı veya yaşanan olaylar hakkında tanınabilir ayrıntı vermek.\n- \"Hacker\" gibi belirsiz unvanlar kullanmak: rolünü sektördeki karşılığıyla yaz.\n- Sertifikaları tarihsiz yazmak ya da süresi dolanları güncel gibi göstermek.\n- İletişim ve raporlama becerisini atlamak: bulguları yönetime anlatabilmek bu meslekte teknik beceri kadar önemlidir.",
      },
    ],
  },
  content: {
    settings: {
      template: "contrast",
      color: "#b91c1c",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Kaan Yıldırımer",
      title: "Siber Güvenlik Uzmanı",
      email: "kaan.yildirimer@ornek.com",
      phone: "0500 000 00 00",
      location: "Ankara",
      linkedin: "linkedin.com/in/kaanyildirimer-ornek",
      github: "github.com/kaanyildirimer-ornek",
      extras: [{ label: "Askerlik", value: "Tamamlandı" }],
    },
    summary:
      "5 yıllık deneyime sahip siber güvenlik uzmanıyım; ilk 3 yılım SOC analisti olarak, son 2 yılım olay müdahalesi ve iç sızma testlerinde geçti. Splunk üzerinde korelasyon kuralı geliştirme, EDR ile tehdit avcılığı ve Active Directory güvenlik değerlendirmelerinde deneyimliyim. Bulguları teknik ekipler ve yönetim için anlaşılır raporlara dönüştürüyor, Python ile tekrar eden analiz işlerini otomatikleştiriyorum.",
    experience: [
      {
        position: "Siber Güvenlik Uzmanı (Olay Müdahalesi ve Sızma Testi)",
        company: "Pervane Finansal Teknoloji A.Ş.",
        location: "Ankara",
        start: "Eki 2024",
        current: true,
        bullets: [
          "Yaklaşık 2.500 uç noktalı ortamda olay müdahale sürecini yönetiyorum; kritik olaylarda ortalama müdahale süresi (MTTR) **9 saatten 3 saate** indi.",
          "Active Directory ortamında BloodHound ile yetki yükseltme yollarını analiz ettim; tespit edilen 23 riskli yetki zincirinin **21'i** iki ay içinde kapatıldı.",
          "Yıllık iç sızma testi planı kapsamında 14 web uygulamasını OWASP Top 10'a göre test ettim; kritik ve yüksek bulguların **%90'ı** üç ay içinde giderildi.",
          "Çeyreklik oltalama simülasyonlarını tasarladım; bağlantıya tıklama oranı bir yılda **%18'den %6'ya** düştü.",
        ].join("\n"),
      },
      {
        position: "SOC Analisti (Kademe 2)",
        company: "Gözcütepe Siber Güvenlik Hizmetleri Ltd.",
        location: "Ankara",
        start: "Eyl 2022",
        end: "Eyl 2024",
        bullets: [
          "Yönetilen güvenlik hizmeti verilen 12 kurumsal müşterinin Splunk ve EDR alarmlarını analiz edip olayları sınıflandırdım ve müdahale önerileri hazırladım.",
          "Gürültü üreten 40 korelasyon kuralını MITRE ATT&CK tekniklerine göre yeniden yazdım; günlük alarm sayısı **1.200'den 350'ye** inerken kritik olay kaçırma yaşanmadı.",
          "Python ile IOC zenginleştirme betiği geliştirdim; alarm başına ilk inceleme süresi ortalama **15 dakikadan 6 dakikaya** düştü.",
          "Kademe 1'e yeni katılan 5 analistin eğitimini ve vardiya devri kontrol listesini hazırladım.",
        ].join("\n"),
      },
      {
        position: "SOC Analisti (Kademe 1)",
        company: "Gözcütepe Siber Güvenlik Hizmetleri Ltd.",
        location: "Ankara",
        start: "Tem 2021",
        end: "Ağu 2022",
        bullets: [
          "7/24 vardiya düzeninde SIEM alarmlarının ilk değerlendirmesini yaptım ve olayları belgelenmiş süreçlere göre üst kademeye aktardım.",
          "Oltalama ihbar kutusuna gelen e-postaları analiz edip zararlı alan adlarını engelleme listesine ekledim.",
        ].join("\n"),
      },
    ],
    skills: [
      { category: "SIEM ve izleme", items: "Splunk (SPL, korelasyon kuralları), IBM QRadar, Elastic, Sysmon" },
      { category: "Uç nokta ve olay müdahalesi", items: "EDR, tehdit avcılığı, adli bilişim temelleri, Velociraptor" },
      { category: "Sızma testi", items: "Burp Suite, Nmap, Metasploit, BloodHound, web uygulama ve Active Directory testleri" },
      { category: "Çerçeveler", items: "MITRE ATT&CK, OWASP Top 10, ISO 27001, KVKK süreçleri" },
      { category: "Betik", items: "Python, PowerShell, Bash" },
    ],
    education: [
      {
        school: "Gazi Üniversitesi",
        field: "Bilgisayar Mühendisliği",
        degree: "Lisans",
        start: "2016",
        end: "2021",
      },
    ],
    certifications: [
      { name: "OffSec Certified Professional (OSCP)", issuer: "OffSec", date: "2024" },
      { name: "CompTIA Security+", issuer: "CompTIA", date: "2022" },
    ],
    languages: [{ language: "İngilizce", level: "C1 – İleri" }],
    references: [],
    interests: "CTF yarışmaları, ev laboratuvarı, teknik blog yazarlığı",
  },
});
