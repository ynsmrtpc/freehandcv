import { defineExample } from "../define";

export default defineExample({
  slug: "veteriner-hekim-cv-ornegi",
  title: "Veteriner Hekim CV Örneği",
  occupation: "Veteriner Hekim",
  category: "healthcare",
  experienceLevel: "mid",
  metaTitle: "Veteriner Hekim CV Örneği ve Yazım Rehberi",
  metaDescription:
    "Küçük hayvan kliniği ve süt sığırcılığı deneyimiyle veteriner hekim CV örneği. Cerrahi, sürü sağlığı ve beceri ipuçları; ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "Veteriner klinikleri, hayvan hastaneleri ve hayvancılık işletmeleri bir veteriner hekim CV'sinde önce hangi türlerle çalıştığını, hangi işlemleri bağımsız yaptığını ve iş yükünü arar. Bu örnek, süt sığırcılığı işletmesinden küçük hayvan kliniğine geçmiş 9 yıllık bir veteriner hekimin iki farklı pratiği tek sayfada nasıl anlattığını gösteriyor.",
    sections: [
      {
        heading: "Özet: türleri ve pratik alanını netleştir",
        body: "Veteriner hekimlikte ilk soru hangi türlerle çalıştığındır. Küçük hayvan kliniği, büyükbaş ya da küçükbaş işletmesi, kanatlı sektörü, gıda denetimi veya laboratuvar çok farklı beceriler ister. Özetinde mezuniyet yılını, bu alanlarda kaç yıl çalıştığını ve en güçlü olduğun işlemleri yaz.\n\nÖrneğin: \"4 yıl yaklaşık 900 baş sağmal ineğin bulunduğu bir işletmede sürü sağlığından sorumlu oldum; son 5 yıldır küçük hayvan kliniğinde muayene, aşılama ve yumuşak doku cerrahisi yapıyorum.\" Başvurduğun ilan hangi alanı arıyorsa o deneyimi ilk cümleye al.",
      },
      {
        heading: "Deneyim maddelerini vaka ve sürü göstergeleriyle yaz",
        body: "Klinik pratikte günlük muayene sayısı, haftalık operasyon sayısı ve aşı yenileme oranı; çiftlik pratiğinde gebelik oranı, tank sütü somatik hücre sayısı ve buzağı kayıpları güçlü göstergelerdir. Bu göstergeler hem iş yükünü hem de katkını gösterir.\n\n- Zayıf: \"Suni tohumlama ve gebelik kontrolleri yaptım.\"\n- Güçlü: \"Kızgınlık takibini aktivite verileriyle eşleştirip tohumlama zamanlamasını düzenledim; ilk tohumlamada gebelik oranı **%38'den %46'ya** yükseldi.\"\n\nRakamları işletme kayıtlarından ya da klinik yazılımından al. Sonuç bir ekip çalışmasıysa bunu cümlede belirt.",
      },
      {
        heading: "Klinik yetkinlikler ve anahtar kelimeler",
        body: "Becerilerini türe ve işleme göre grupla: \"Küçük hayvan\", \"Büyük hayvan\", \"Görüntüleme ve laboratuvar\". Klinik muayene, aşılama programı, kısırlaştırma, yumuşak doku cerrahisi, inhalasyon anestezisi, abdominal ultrasonografi, dijital röntgen, hemogram ve biyokimya değerlendirmesi, suni tohumlama, gebelik muayenesi, mastitis kontrolü ve sürü sağlığı ilanlarda sık geçen ifadelerdir.\n\nOrtopedik cerrahi gibi henüz bağımsız yapmadığın işlemleri \"asiste ettim\" diye yaz; klinik sahipleri bu ayrımı mülakatta sorar.",
      },
      {
        heading: "Kurslar ve mesleki gelişim",
        body: "Ultrasonografi, cerrahi, anestezi, diş tedavisi veya egzotik hayvan hekimliği gibi kursları düzenleyen kurum ve yılıyla listele. Uygulamalı kursları teorik seminerlerden ayır; uygulamalı eğitim, klinik sahibine o işlemi kısa sürede bağımsız yapabileceğini gösterir. Lisansüstü eğitim yapıyorsan alanını ve tez konusunu kısaca yaz.",
      },
      {
        heading: "Hasta sahibi iletişimi ve klinik işleyişi",
        body: "Küçük hayvan kliniklerinde hekimden yalnızca tedavi değil, hasta sahibini bilgilendirmesi ve kliniğin düzenine katkısı da beklenir. Aşı hatırlatma sistemi kurduysan, tedavi sonrası takip aramalarını düzenlediysen ya da stok ve ilaç takibini üstlendiysen bunları madde olarak yaz. Nöbet ve acil vaka düzenine katılıyorsan bunu da belirt; 24 saat hizmet veren hayvan hastaneleri bunu ilk sorar.\n\nÇiftlik pratiğinde ise iletişim, işletme sahibi ve çalışanlarla kurulur. Sağım personeline hijyen eğitimi verdiysen, tohumlama ve aşı takvimini işletme ekibiyle birlikte planladıysan bunu yaz. Sürü yönetim yazılımı kullandıysan hangi verileri izlediğini belirt; büyük işletmeler kayıt düzenine önem verir.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Küçük hayvan ve çiftlik deneyimini aynı maddelerle anlatmak.\n- Hasta sahibine ait bilgileri ya da tanınabilir vaka fotoğraflarını paylaşmak.\n- Asiste ettiğin operasyonları bağımsız yaptığın işlemler gibi yazmak.\n- Kursları tarihsiz ve kurumsuz listelemek.\n- Erkek adaylarda askerlik durumunu atlamak.",
      },
    ],
  },
  content: {
    settings: {
      template: "two-column",
      color: "#4d7c0f",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Vet. Hek. Ozan Karabulut",
      title: "Veteriner Hekim",
      email: "ozan.karabulut@ornek.com",
      phone: "0500 000 00 00",
      location: "Eskişehir",
      linkedin: "linkedin.com/in/ozankarabulut-ornek",
      extras: [{ label: "Askerlik", value: "Tamamlandı" }],
    },
    summary:
      "2017 yılında veteriner fakültesinden mezun oldum; 9 yıllık deneyimimin ilk 3,5 yılı bir süt sığırcılığı işletmesinde sürü sağlığı, son 5,5 yılı küçük hayvan kliniğinde geçti. Kedi ve köpeklerde muayene, aşılama, kısırlaştırma ve yumuşak doku cerrahisi yapıyor; abdominal ultrasonografi ve dijital röntgen değerlendirmesini klinik içinde yürütüyorum. Hasta sahibiyle açık iletişim ve düzenli takip konusunda dikkatliyim.",
    experience: [
      {
        position: "Veteriner Hekim",
        company: "Özel Ihlamur Veteriner Kliniği",
        location: "Eskişehir",
        start: "Şub 2021",
        current: true,
        bullets: [
          "Günde ortalama 20–25 kedi ve köpeğe muayene, aşılama ve parazit uygulaması yapıyor; aşı takvimlerini klinik yazılımında takip ediyorum.",
          "Haftada ortalama 8 kısırlaştırma operasyonunun yanında tümör eksizyonu ve yabancı cisim gibi yumuşak doku operasyonlarını uyguluyorum.",
          "Operasyon öncesi kan tahlili ve anestezi risk değerlendirmesini standart protokole bağladım; operasyon günü ertelenen vaka sayısı **ayda 6'dan 2'ye** indi.",
          "Aşı hatırlatmalarını klinik yazılımından otomatik mesajla gönderen düzeni kurdum; yıllık aşı yenileme oranı **%55'ten %74'e** yükseldi.",
          "Mikroçip uygulamasını ve evcil hayvan kayıt işlemlerini yürütüyor, kliniğe katılan 2 yeni hekime aşı ve kayıt süreçlerini öğrettim.",
        ].join("\n"),
      },
      {
        position: "Veteriner Hekim (Sürü Sağlığı)",
        company: "Yaylaçayır Tarım ve Hayvancılık A.Ş.",
        location: "Afyonkarahisar",
        start: "Ağu 2017",
        end: "Oca 2021",
        bullets: [
          "Yaklaşık 900 baş sağmal ineğin bulunduğu işletmede sürü sağlığı, koruyucu aşılama ve tedavi programlarını yürüttüm.",
          "Kızgınlık takibini aktivite verileriyle eşleştirip tohumlama zamanlamasını düzenledim; ilk tohumlamada gebelik oranı **%38'den %46'ya** yükseldi.",
          "Sağım hijyeni eğitimleri ve mastitis kontrol programıyla tank sütü somatik hücre sayısını **ml'de yaklaşık 380.000'den 220.000'e** indirdim.",
          "Buzağı bakım protokolünü ağız sütü verme ve kulübe hijyeni üzerinden yeniden düzenledim; ilk 60 günde buzağı kayıpları **%8'den %4'e** indi.",
        ].join("\n"),
      },
    ],
    skills: [
      {
        category: "Küçük hayvan",
        items: "Klinik muayene, aşılama programı, kısırlaştırma, yumuşak doku cerrahisi, inhalasyon anestezisi, diş taşı temizliği",
      },
      {
        category: "Görüntüleme ve laboratuvar",
        items: "Abdominal ultrasonografi, dijital röntgen, hemogram ve biyokimya değerlendirmesi, sitoloji",
      },
      {
        category: "Büyük hayvan",
        items: "Suni tohumlama, rektal gebelik muayenesi, mastitis kontrolü, sürü sağlığı, buzağı sağlığı",
      },
      { category: "Sistemler", items: "Klinik yönetim yazılımı, mikroçip ve evcil hayvan kayıt işlemleri, sürü yönetim yazılımı" },
    ],
    education: [
      {
        school: "Ankara Üniversitesi",
        field: "Veteriner Fakültesi",
        degree: "Lisans",
        start: "2012",
        end: "2017",
      },
    ],
    certifications: [
      { name: "Küçük Hayvan Ultrasonografisi Uygulamalı Kursu", issuer: "Veteriner fakültesi sürekli eğitim programı", date: "2022" },
      { name: "Yumuşak Doku Cerrahisi Uygulamalı Eğitimi", issuer: "Meslek örgütü eğitim programı", date: "2023" },
    ],
    languages: [{ language: "İngilizce", level: "B1 – Orta" }],
    references: [],
    interests: "Bisiklet, doğa fotoğrafçılığı, sokak hayvanları için gönüllü kısırlaştırma kampanyaları",
  },
});
