import { defineExample } from "../define";

export default defineExample({
  slug: "veri-giris-elemani-cv-ornegi",
  title: "Veri Giriş Elemanı CV Örneği",
  occupation: "Veri Giriş Elemanı",
  category: "administration",
  experienceLevel: "entry",
  metaTitle: "Veri Giriş Elemanı CV Örneği ve Yazım Rehberi",
  metaDescription:
    "Klavye hızı, doğruluk oranı ve program bilgisiyle yazılmış veri giriş elemanı CV örneği. Az deneyimle tek sayfa CV; ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "Veri giriş elemanı arayan bir işveren CV'de üç şeye bakar: ne kadar hızlı ve doğru yazdığına, hangi programlarla çalıştığına ve gizli bilgiye nasıl yaklaştığına. Bu örnek, bir yıldan az iş deneyimi ve bir stajı olan bir adayın bu bilgileri tek sayfada açık ve dürüst biçimde nasıl sunduğunu gösteriyor.",
    sections: [
      {
        heading: "Özet: hız, doğruluk ve programlar",
        body: "Veri giriş özetinin üç cümlede işini yapması yeterlidir. İlk cümlede eğitim durumunu ve varsa deneyim süreni, ikincisinde klavye hızını ve kullandığın programları, üçüncüsünde çalışma düzenine dair bilgiyi (tam zamanlı, vardiyalı, hemen başlayabilir) yaz.\n\nKlavye hızını dakikada kelime olarak ve hangi klavyeyle (F ya da Q) ölçüldüğünü belirterek ver. Bu tek rakam, \"hızlı ve dikkatli çalışırım\" cümlesinden çok daha inandırıcıdır.",
      },
      {
        heading: "Deneyimi sayı ve kalite ölçüsüyle anlat",
        body: "Veri giriş işi tekrarlı göründüğü için adaylar maddeleri genellikle \"veri girişi yaptım\" diye geçer. Oysa bu işin de ölçülebilir sonuçları vardır: günde kaç kayıt ya da belge girdiğin, hata oranın, gecikmiş işi ne kadar sürede bitirdiğin, kayıtlarda bulduğun tutarsızlıklar.\n\n- Zayıf: \"Sisteme irsaliye girişi yaptım.\"\n- Güçlü: \"Günde ortalama 350 irsaliye ve sipariş kaydını ERP'ye girdim; aylık kontrollerde hata oranım **%0,5'in altında** kaldı.\"\n\nRakamı bilmiyorsan uydurma; yöneticine sor ya da yaklaşık bir değeri \"ortalama\" diye belirt. Mülakatta bu sayılar sorulabilir.",
      },
      {
        heading: "Programlar ve ATS anahtar kelimeleri",
        body: "Veri giriş ilanlarında Microsoft Excel neredeyse her zaman istenir. Kullandığın özellikleri açık yaz: veri doğrulama, sıralama ve filtreleme, düşeyara, pivot tablo. Çalıştığın ERP, muhasebe ya da kargo programını adıyla ekle; bilmediğin bir programı listeye koyma.\n\nATS için şu kelimeleri ilandaki yazımıyla kullan: veri girişi, kayıt kontrolü, belge tarama, arşivleme, dijital arşiv, Excel, ERP, on parmak klavye, raporlama, gizlilik. Yetkinlikleri \"Veri girişi\", \"Programlar\" ve \"Kişisel beceriler\" gibi kısa gruplara ayır.",
      },
      {
        heading: "Gizlilik ve kişisel verilere dikkat",
        body: "Veri giriş elemanları müşteri, hasta, çalışan ya da finans kayıtlarıyla çalışır; bu yüzden işveren gizliliğe önem veren adayı arar. Kişisel verilerin korunması (KVKK) üzerine bir eğitim aldıysan sertifikalar bölümüne ekle. Daha önce gizli kayıtlarla çalıştıysan bunu maddelerde belirt, ama hangi müşterinin ya da kişinin verisi olduğunu asla yazma.\n\nYetki sınırlarına uymak da bu işin parçasıdır: yalnızca sana açılan ekranlarda çalışmak, belgeleri masada bırakmamak ve hatalı bir kaydı kendi başına silmek yerine sorumluya bildirmek. Bu alışkanlıkları bir maddede göstermek, işverene güvenilir bir aday olduğunu anlatır.",
      },
      {
        heading: "Az deneyimle güçlü bir tek sayfa",
        body: "Deneyimin azsa staj, yarı zamanlı iş ve gönüllü çalışmaları da deneyim bölümüne koyabilirsin; her birinde ne yaptığını iki üç maddeyle anlat. Bilgisayar kursları ve klavye hız belgeleri, bu meslekte diplomalar kadar dikkat çeker. CV'yi tek sayfada tut, düzenli ve yazım hatasız olmasına özen göster: veri giriş elemanı adayında bir yazım hatası, doğrudan dikkat eksikliği gibi okunur.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Klavye hızını ve doğruluk oranını yazmamak.\n- \"Bilgisayar kullanmayı bilirim\" gibi belirsiz ifadeler kullanmak: program ve özellik adı ver.\n- Gizli kayıtlarla ilgili ayrıntı ya da isim paylaşmak.\n- CV'de yazım ve biçim hatası bırakmak.\n- Çalışma saatleri, vardiya ve başlama tarihi bilgisini atlamak.",
      },
    ],
  },
  content: {
    settings: {
      template: "minimal",
      color: "#475569",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Büşra Kandemir",
      title: "Veri Giriş Elemanı",
      email: "busra.kandemir@ornek.com",
      phone: "0500 000 00 00",
      location: "İstanbul (Esenyurt)",
      extras: [
        { label: "Klavye hızı", value: "Dakikada 62 kelime (F klavye)" },
        { label: "Çalışma düzeni", value: "Tam zamanlı, vardiyalı çalışmaya uygun" },
      ],
    },
    summary:
      "Büro Yönetimi ve Yönetici Asistanlığı önlisans mezunuyum ve 10 aylık veri giriş deneyimim var. Lojistik firmasında günde ortalama 350 irsaliye ve sipariş kaydını ERP'ye girdim; on parmak klavyeyle dakikada 62 kelime yazıyor, Excel'de veri doğrulama ve düşeyara kullanıyorum. Hemen başlayabilirim.",
    experience: [
      {
        position: "Veri Giriş Elemanı (Sözleşmeli)",
        company: "Marmara Lojistik ve Taşımacılık Ltd. Şti.",
        location: "İstanbul",
        start: "Ara 2025",
        end: "Eyl 2026",
        bullets: [
          "Günde ortalama 350 irsaliye ve sipariş kaydını ERP'ye girdim; aylık kontrollerde hata oranım **%0,5'in altında** kaldı.",
          "Depodan gelen teslim belgelerini sistemdeki kayıtlarla karşılaştırarak haftada ortalama 20 tutarsızlığı **muhasebe birimine** bildirdim.",
          "Yıl sonu yoğunluğunda biriken 2.800 belgelik girişi ek mesaiyle **4 iş gününde** tamamladım.",
          "Müşteri ve sürücü kayıtlarında gizlilik kurallarına uyarak yalnızca yetkili olduğum ekranlarda çalıştım.",
        ].join("\n"),
      },
      {
        position: "Ofis Stajyeri",
        company: "Yıldız Mali Müşavirlik Bürosu",
        location: "İstanbul",
        start: "Şub 2025",
        end: "May 2025",
        bullets: [
          "Müşteri firmalara ait alış ve satış faturalarını muhasebe programına girmeden önce tarayıp dijital arşive dosyaladım.",
          "Yaklaşık 4.000 sayfalık eski kayıtları tarayarak dosya adı standardına göre arşivledim; aranan belgeye ulaşma süresi **dakikalardan saniyelere** indi.",
          "Excel'de aylık belge takip tablosu hazırlayıp eksik belgeleri işaretledim.",
        ].join("\n"),
      },
    ],
    skills: [
      { category: "Veri girişi", items: "On parmak klavye (F ve Q), kayıt kontrolü, belge tarama, dijital arşivleme" },
      { category: "Programlar", items: "Microsoft Excel (veri doğrulama, filtreleme, düşeyara, temel pivot tablo), Word, ERP veri girişi, muhasebe programı (temel)" },
      { category: "Kişisel beceriler", items: "Dikkat ve düzen, gizlilik bilinci, yoğun tempoda çalışma" },
    ],
    education: [
      {
        school: "Anadolu Üniversitesi Açıköğretim Fakültesi",
        field: "Büro Yönetimi ve Yönetici Asistanlığı",
        degree: "Önlisans",
        start: "2023",
        end: "2025",
      },
      {
        school: "Mesleki ve Teknik Anadolu Lisesi",
        field: "Muhasebe ve Finansman Alanı",
        degree: "Lise",
        start: "2019",
        end: "2023",
      },
    ],
    certifications: [
      { name: "Bilgisayar İşletmenliği Kursu", issuer: "Halk Eğitim Merkezi", date: "2023" },
      { name: "Kişisel Verilerin Korunması Temel Eğitimi (çevrim içi)", issuer: "Kurum içi eğitim", date: "2026" },
    ],
    languages: [{ language: "İngilizce", level: "A2 – Başlangıç" }],
    references: [],
    interests: "Gönüllü kütüphane çalışmaları, el işi",
  },
});
