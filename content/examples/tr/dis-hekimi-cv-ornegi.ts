import { defineExample } from "../define";

export default defineExample({
  slug: "dis-hekimi-cv-ornegi",
  title: "Diş Hekimi CV Örneği",
  occupation: "Diş Hekimi",
  category: "healthcare",
  experienceLevel: "mid",
  metaTitle: "Diş Hekimi CV Örneği ve Yazım Rehberi",
  metaDescription:
    "Özel poliklinik ve ADSM deneyimiyle yazılmış diş hekimi CV örneği. Tedavi yelpazesi, implant ve kurs bilgisi için ipuçları; ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "Özel poliklinik sahipleri ve klinik yöneticileri bir diş hekimi CV'sinde önce hangi tedavileri bağımsız yaptığına, ayda kaç hastaya baktığına ve dijital iş akışlarına ne kadar hakim olduğuna bakar. Bu örnek, ağız ve diş sağlığı merkezinden özel polikliniğe geçmiş 8 yıllık bir diş hekiminin deneyimini tek sayfada nasıl topladığını gösteriyor.",
    sections: [
      {
        heading: "Özet: tedavi yelpazeni ve çalıştığın yeri yaz",
        body: "Diş hekimliğinde aynı unvan çok farklı pratikleri kapsar: kimi hekim ağırlıkla restoratif tedavi ve kanal tedavisi yapar, kimi implant ve protezde yoğunlaşır. Özetinde mezuniyet yılını, kamu ve özel deneyimini ve en sık yaptığın tedavileri yaz. Uzmanlığın yoksa bunu saklamana gerek yok; genel diş hekimi olarak hangi alanlarda derinleştiğini göstermen yeterli.\n\nÖrneğin: \"8 yıllık deneyimimin son 4 yılı özel poliklinikte geçti; yılda yaklaşık 120 implant cerrahisi ve protetik üst yapısını tamamlıyorum.\"",
      },
      {
        heading: "Deneyim maddelerini işlem ve hasta sayısıyla yaz",
        body: "\"Hastalara dolgu ve kanal tedavisi yaptım\" maddesi her diş hekimi için doğrudur ve seni ayırmaz. Ayda kaç hastaya baktığını, hangi tedavilerin ağırlıkta olduğunu, kliniğe hangi iş akışını getirdiğini yaz. Ölçülebilir sonuçlar genellikle tekrar eden işlemlerde, tedavi planı kabulünde ve randevu düzeninde ortaya çıkar.\n\n- Zayıf: \"Dijital ölçü almaya başladım.\"\n- Güçlü: \"Ağız içi tarayıcıyla dijital ölçü iş akışını kurdum; kron-köprü vakalarında uyumsuzluk nedeniyle yenilenen protez oranı **%15'ten %5'e** indi.\"\n\nRakamları klinik yönetim yazılımının raporlarından al ve hasta bilgisi içeren hiçbir ayrıntı verme.",
      },
      {
        heading: "Klinik yetkinlikler ve anahtar kelimeler",
        body: "Zincir polikliniklerin insan kaynakları birimleri başvuruları ilandaki kelimelere göre tarar. Yetkinliklerini \"Tedaviler\", \"Dijital diş hekimliği\", \"Hasta iletişimi\" gibi başlıklarda topla. Restoratif tedavi, kanal tedavisi (döner alet sistemleri), sabit ve hareketli protez, gömülü diş cerrahisi, implant cerrahisi, periodontal tedavi, ağız içi tarayıcı ve dental volümetrik tomografi değerlendirme sık aranan ifadelerdir.\n\nÇocuk hastayla çalışma deneyimin varsa ayrı yaz; pedodonti uzmanı olmayan polikliniklerde bu beceri sorulur.",
      },
      {
        heading: "Kurslar, sertifikalar ve uzmanlık",
        body: "İmplantoloji, endodonti ve estetik diş hekimliği kursları özel klinik başvurularında belirleyicidir. Her kursu düzenleyen kurum, yıl ve mümkünse uygulamalı olup olmadığıyla yaz; yalnızca teorik bir seminerle uygulamalı bir kurs aynı ağırlıkta değildir. DUS'a hazırlanıyorsan ya da bir uzmanlık programındaysan bunu açıkça belirt; işveren uzun vadeli planını bilmek ister.\n\nKurs listesini uzatmak yerine her kursun pratiğine ne kattığını göster. İmplant kursu aldıysan sonrasında yılda kaç implant uyguladığını, endodonti kursundan sonra hangi vakaları kliniğinde çözebildiğini deneyim maddelerinde yaz. Eğitim ile uygulama arasındaki bu bağ, klinik sahibinin aradığı asıl kanıttır.",
      },
      {
        heading: "Hasta iletişimi ve yabancı hasta deneyimi",
        body: "Özel polikliniklerde hekimin klinik başarısı kadar tedavi planını hastaya anlatabilmesi de önemlidir. Tedavi planı sunumunda fotoğraf veya dijital gülüş tasarımı kullanıyorsan, kabul oranında bir değişiklik gördüysen bunu madde olarak yaz. Yabancı hastalarla çalışan kliniklere başvuruyorsan dil seviyeni Avrupa Ortak Çerçevesi ile belirt ve bu hastalarla tedavi planı görüşmesi yaptığını ekle.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Öncesi-sonrası hasta fotoğraflarını izin ve anonimleştirme olmadan CV'ye ya da portfolyoya koymak.\n- Katıldığın her semineri sertifika gibi listelemek: uygulamalı kursları öne al.\n- Hekimle birlikte yaptığın cerrahileri bağımsız uygulama gibi yazmak.\n- Kamu deneyimini tek satırda geçmek: okul taraması ve acil poliklinik görevleri iş yükünü gösterir.\n- Erkek adaylarda askerlik durumunu atlamak.",
      },
    ],
  },
  content: {
    settings: {
      template: "timeline",
      color: "#0e7490",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Dt. Alper Koçyiğit",
      title: "Diş Hekimi",
      email: "alper.kocyigit@ornek.com",
      phone: "0500 000 00 00",
      location: "İzmir",
      linkedin: "linkedin.com/in/alperkocyigit-ornek",
      extras: [{ label: "Askerlik", value: "Tamamlandı" }],
    },
    summary:
      "2018 yılında diş hekimliği fakültesinden mezun oldum; 3,5 yıl bir ağız ve diş sağlığı merkezinde, son 4,5 yıldır özel bir poliklinikte çalışıyorum. Restoratif tedavi, kanal tedavisi, sabit protez ve gömülü diş cerrahisinin yanında yılda yaklaşık 120 implant cerrahisi yapıyorum. Ağız içi tarayıcıyla dijital ölçü ve tomografi destekli implant planlamasında deneyimliyim; yabancı hastalarla İngilizce tedavi planı görüşmesi yürütüyorum.",
    experience: [
      {
        position: "Diş Hekimi",
        company: "Özel Mercanadası Ağız ve Diş Sağlığı Polikliniği",
        location: "İzmir",
        start: "Oca 2022",
        current: true,
        bullets: [
          "4 üniteli poliklinikte ayda ortalama 160 hastaya muayene, kompozit dolgu, kanal tedavisi, çekim ve sabit protez tedavisi uyguluyorum.",
          "Ağız içi tarayıcıyla dijital ölçü iş akışını kurdum; kron-köprü vakalarında uyumsuzluk nedeniyle yenilenen protez oranı **%15'ten %5'e** indi.",
          "Dental volümetrik tomografiyle planladığım yılda yaklaşık **120 implant cerrahisini** uyguluyor, protetik üst yapılarını tamamlıyorum.",
          "Tedavi planlarını fotoğraf ve dijital gülüş tasarımıyla sunmaya başladım; önerilen kapsamlı planların kabul oranı **%48'den %63'e** yükseldi.",
          "Klinik asistanları için sterilizasyon ve alet izlenebilirliği kontrol listesi hazırladım; 3 asistanın eğitimini yürüttüm.",
        ].join("\n"),
      },
      {
        position: "Diş Hekimi",
        company: "Çamlıbel Ağız ve Diş Sağlığı Merkezi",
        location: "Manisa",
        start: "Eyl 2018",
        end: "Ara 2021",
        bullets: [
          "Günde ortalama 35–40 hastaya muayene, dolgu, çekim ve kanal tedavisi uyguladım; haftada 2 gün acil diş polikliniğinde görev aldım.",
          "Okul taramalarında yılda yaklaşık 1.500 öğrencinin ağız-diş muayenesini yaptım ve flor vernik uygulamalarına katıldım.",
          "Ayda ortalama 25 gömülü ve yarı gömülü diş çekimini lokal anestezi altında tamamladım.",
          "Hareketli protez hastalarında ölçü, prova ve teslim randevularını tek takvimde topladım; protez teslim süresi **ortalama 6 haftadan 4 haftaya** indi.",
        ].join("\n"),
      },
    ],
    skills: [
      {
        category: "Tedaviler",
        items:
          "Restoratif tedavi, kanal tedavisi (döner alet sistemleri), sabit ve hareketli protez, gömülü diş cerrahisi, implant cerrahisi, periodontal tedavi",
      },
      {
        category: "Dijital diş hekimliği",
        items: "Ağız içi tarayıcı, dental volümetrik tomografi değerlendirme, dijital gülüş tasarımı, klinik yönetim yazılımı",
      },
      { category: "Hasta iletişimi", items: "Tedavi planı sunumu, yabancı hasta görüşmeleri, çocuk hastada davranış yönetimi" },
      { category: "Enfeksiyon kontrolü", items: "Sterilizasyon ve alet izlenebilirliği, ünite su hattı bakımı, tıbbi atık yönetimi" },
    ],
    education: [
      {
        school: "Ege Üniversitesi",
        field: "Diş Hekimliği",
        degree: "Lisans",
        start: "2013",
        end: "2018",
      },
    ],
    certifications: [
      { name: "Uygulamalı İmplantoloji Eğitim Programı", issuer: "Üniversite sürekli eğitim merkezi", date: "2021" },
      { name: "Döner Alet Sistemleriyle Kanal Tedavisi Kursu", issuer: "Meslek örgütü eğitim programı", date: "2019" },
      { name: "Temel Yaşam Desteği", issuer: "Mercanadası Polikliniği Eğitim Birimi", date: "2025" },
    ],
    languages: [{ language: "İngilizce", level: "B2 – İyi" }],
    references: [],
    interests: "Yelken, analog fotoğrafçılık, Ege mutfağı",
  },
});
