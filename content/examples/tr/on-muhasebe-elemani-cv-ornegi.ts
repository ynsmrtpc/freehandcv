import { defineExample } from "../define";

export default defineExample({
  slug: "on-muhasebe-elemani-cv-ornegi",
  title: "Ön Muhasebe Elemanı CV Örneği",
  occupation: "Ön Muhasebe Elemanı",
  category: "finance",
  experienceLevel: "entry",
  metaTitle: "Ön Muhasebe Elemanı CV Örneği ve Yazım Rehberi",
  metaDescription:
    "Fatura, cari hesap ve banka işlemlerini somut anlatan ön muhasebe elemanı CV örneği. Program, staj ve e-belge ipuçları; ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "Ön muhasebe ilanlarına başvuranları değerlendiren muhasebe sorumluları ve şirket sahipleri, CV'de önce hangi muhasebe programını kullandığına, günlük hangi işleri tek başına yürüttüğüne ve e-belge süreçlerini bilip bilmediğine bakar. Bu örnek, mali müşavirlik bürosunda staj yapmış ve bir yıldır bir toptan ticaret firmasında çalışan yeni bir ön muhasebe elemanının bu bilgileri tek sayfada nasıl sunduğunu gösteriyor.",
    sections: [
      {
        heading: "Özet: program, işlem türü ve hacim",
        body: "Ön muhasebe ilanları genellikle aynı soruların cevabını arar: hangi programı kullanıyorsun, fatura ve cari hesap işlemlerini tek başına yapabiliyor musun, banka ve kasa takibine aşina mısın? Özetinde bu üç sorunun cevabını ver. Ardından çalıştığın işletmenin türünü (toptan ticaret, üretim, hizmet) ve iş hacmini ekle, örneğin ayda kaç fatura işlediğini ya da kaç cari hesabı takip ettiğini.\n\nÖnlisans ya da lisans bölümünü ve varsa staj yerini özette tek ifadeyle geçirebilirsin; yeni mezunlar için bu, deneyimin kaynağını gösterir.",
      },
      {
        heading: "Günlük işleri sonuçla yaz",
        body: "Ön muhasebede işlerin çoğu tekrar eden işlerdir; CV'de bunları sıradan bir liste gibi değil, sorumluluk ve doğruluk göstergesi olarak anlat. Kaç işlem yaptığını, hangi hatayı önlediğini ya da hangi süreci hızlandırdığını yaz.\n\n- Zayıf: \"Cari hesapları takip ettim.\"\n- Güçlü: \"180 müşteri ve 45 tedarikçi carisini takip ederek aylık mutabakatları düzenli hale getirdim; vadesi geçen alacaklar **%30** azaldı.\"\n\nBanka mutabakatı, kasa sayımı, çek ve senet takibi, irsaliye–fatura eşleştirmesi gibi işleri ayrı maddelerde gösterirsen işe alım yapan kişi seni hangi masaya oturtacağını kolayca görür.",
      },
      {
        heading: "Programlar ve e-belge bilgisi",
        body: "Ön muhasebe ilanlarının neredeyse tamamında bir muhasebe programı adı geçer. Kullandığın programı (Logo, Mikro, Netsis, Luca gibi) ve hangi modüllerinde çalıştığını yaz: fatura, cari, stok, banka, kasa, çek-senet. İlanda geçen programı aynı yazımla kullanmak ATS eşleşmesini kolaylaştırır.\n\ne-Fatura, e-Arşiv ve e-İrsaliye süreçleri artık ön muhasebenin günlük işidir; düzenleme, gelen faturayı kontrol etme ve iptal ya da iade işlemlerini yapabiliyorsan açıkça belirt. Excel'de düşeyara, pivot tablo ve filtreleme gibi işlemleri kullanabiliyorsan bunları da ekle; \"Excel bilgisi\" demek yeterli değildir.",
      },
      {
        heading: "Staj, eğitim ve belgeler",
        body: "Deneyimin bir iki yılla sınırlıysa staj, CV'nin önemli bir parçasıdır. Mali müşavirlik bürosunda staj yaptıysan kaç mükellefin evrakına destek verdiğini ve hangi beyanname hazırlıklarında çalıştığını yaz. Muhasebe ve Vergi Uygulamaları, Muhasebe ya da İşletme gibi bölümler bu alan için doğrudan karşılık bulur.\n\nBilgisayarlı muhasebe kursu ya da program eğitimi aldıysan kısa bir sertifika satırı yeterli. Uzun vadede SMMM olmayı hedefliyorsan bunu özette tek cümleyle belirtebilirsin; birçok mali müşavir ve finans müdürü bunu olumlu karşılar.",
      },
      {
        heading: "Kişisel bilgiler",
        body: "Ön muhasebe ilanlarında askerlik durumu ve ikamet edilen semt sık sorulur; erkek adaylar askerlik durumunu açıkça yazmalıdır. Bankaya, vergi dairesine ya da kargoya gidip gelmek işin bir parçasıysa B sınıfı ehliyetini ekle. Fotoğraf, medeni hal ve T.C. kimlik numarası gibi bilgiler ilan özellikle istemedikçe gerekmez.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Kullandığın muhasebe programını ve modülünü yazmamak.\n- \"Muhasebe işlerine yardımcı oldum\" gibi ne yaptığını anlatmayan maddeler yazmak.\n- e-Fatura ve e-Arşiv deneyimini atlamak: en çok aranan becerilerden biridir.\n- İşletmenin iç bilgilerini, müşteri adlarını veya tutarları açıkça paylaşmak.\n- Bir sayfayı aşmak: yeni başlayan bir ön muhasebe elemanı için tek sayfa yeterlidir.",
      },
    ],
  },
  content: {
    settings: {
      template: "compact",
      color: "#1e40af",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Yusuf Ertürk",
      title: "Ön Muhasebe Elemanı",
      email: "yusuf.erturk@ornek.com",
      phone: "0500 000 00 00",
      location: "Bursa (Osmangazi)",
      linkedin: "linkedin.com/in/yusuferturk-ornek",
      extras: [
        { label: "Askerlik", value: "Tamamlandı" },
        { label: "Ehliyet", value: "B sınıfı" },
      ],
    },
    summary:
      "Muhasebe ve Vergi Uygulamaları önlisans mezunuyum; bir yıldır toptan hırdavat ticareti yapan bir firmada ön muhasebe elemanı olarak çalışıyorum. Logo Tiger ile ayda yaklaşık 600 satış ve alış faturasını, 225 cari hesabı ve 4 bankanın hareketlerini takip ediyorum. e-Fatura, e-Arşiv ve e-İrsaliye süreçlerini tek başıma yürütüyor, mali müşavirlik bürosundaki stajımdan gelen beyanname ön hazırlığı deneyimimle muhasebe sorumlusuna destek veriyorum.",
    experience: [
      {
        position: "Ön Muhasebe Elemanı",
        company: "Demirkök Hırdavat Toptan Tic. Ltd. Şti.",
        location: "Bursa",
        start: "Eyl 2025",
        current: true,
        bullets: [
          "Logo Tiger'da ayda yaklaşık **600 alış ve satış faturasını** işliyor, e-Fatura ve e-Arşiv düzenleme ile iade süreçlerini yürütüyorum.",
          "180 müşteri ve 45 tedarikçi carisini takip ederek aylık mutabakatları düzenli hale getirdim; vadesi geçen alacaklar **%30** azaldı.",
          "4 bankanın günlük hareketlerini sisteme işleyip haftalık banka mutabakatını hazırlıyorum; ay sonu kapanışta açık kalem sayısı **ortalama 25'ten 5'in altına** indi.",
          "Çek ve senet portföyünü vade takip tablosuyla izleyerek tahsilat planını satış ekibiyle haftalık paylaşıyorum.",
          "İrsaliye–fatura eşleştirmesini Excel'de pivot tabloyla kontrol ederek faturalanmamış sevkiyatları ay sonu beklemeden tespit ediyorum.",
        ].join("\n"),
      },
      {
        position: "Stajyer (Yaz Stajı)",
        company: "Akasya Mali Müşavirlik Bürosu",
        location: "Bursa",
        start: "Tem 2022",
        end: "Eyl 2022",
        bullets: [
          "Büroya bağlı 30 mükellefin alış ve satış faturalarını Luca'ya işledim; belgeleri dönem sonuna kadar arşivledim.",
          "KDV ve muhtasar beyannamelerinin ön hazırlığında mali müşavire veri kontrolüyle destek verdim.",
          "SGK işe giriş ve işten çıkış bildirgelerinin hazırlığını gözlemleyip evrak takibini yaptım.",
        ].join("\n"),
      },
    ],
    skills: [
      { category: "Ön muhasebe", items: "Fatura işlemleri, cari hesap takibi ve mutabakat, banka ve kasa işlemleri, çek-senet takibi, irsaliye–fatura eşleştirmesi" },
      { category: "e-Belge", items: "e-Fatura, e-Arşiv, e-İrsaliye" },
      { category: "Programlar", items: "Logo Tiger (fatura, cari, banka, stok), Luca, Microsoft Excel (düşeyara, pivot tablo)" },
    ],
    education: [
      {
        school: "Bursa Uludağ Üniversitesi",
        field: "Muhasebe ve Vergi Uygulamaları",
        degree: "Önlisans",
        start: "2021",
        end: "2023",
        gpa: "3,05 / 4,00",
      },
    ],
    certifications: [{ name: "Bilgisayarlı Muhasebe Kursu (120 saat)", issuer: "Halk Eğitim Merkezi", date: "2025" }],
    languages: [{ language: "İngilizce", level: "A2 – Temel" }],
    references: [],
  },
});
