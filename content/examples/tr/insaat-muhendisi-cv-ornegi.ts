import { defineExample } from "../define";

export default defineExample({
  slug: "insaat-muhendisi-cv-ornegi",
  title: "İnşaat Mühendisi CV Örneği",
  occupation: "İnşaat Mühendisi",
  category: "engineering",
  experienceLevel: "mid",
  metaTitle: "İnşaat Mühendisi CV Örneği ve Yazım Rehberi",
  metaDescription:
    "Şantiye, hakediş ve metraj deneyimini rakamlarla anlatan inşaat mühendisi CV örneği. Yazılım, İSG ve proje ipuçları; ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "Bir inşaat firmasının proje müdürü mühendis CV'sinde önce hangi tür yapıda, hangi ölçekte ve hangi sorumlulukla çalıştığına bakar. Bu örnek, konut ve ticari yapı şantiyelerinde 6 yıl çalışmış, şantiye şefliğine geçmiş bir inşaat mühendisinin bu bilgileri nasıl sunduğunu gösteriyor.",
    sections: [
      {
        heading: "Özet: yapı türü, ölçek ve rol",
        body: "İnşaat mühendisliği çok geniş bir alan: şantiye, ofis (teknik ofis, planlama, hakediş), statik proje, yapı denetim, altyapı ve ulaştırma birbirinden farklı işlerdir. Özetin ilk cümlesinde hangisinde uzmanlaştığını söyle. Ardından çalıştığın yapıların türünü (konut, AVM, sanayi yapısı, köprü, altyapı) ve ölçeğini (inşaat alanı, blok ya da daire sayısı, sözleşme bedeli aralığı) yaz.\n\nŞantiye şefliği, ekip yönetimi ya da kamu işlerinde çalışmış olmak gibi seni ayıran bir sorumluluğu da özette belirt.",
      },
      {
        heading: "Projeleri ölçü ve sonuçla anlat",
        body: "İşe alım yapanlar her pozisyonun altında hangi projede çalıştığını ve o projenin büyüklüğünü görmek ister. Maddelerde imalat kalemlerini, yönettiğin taşeron sayısını, hakediş dönemlerini ve iş programına uyumu rakamla göster. Takvimi öne çeken ya da maliyeti düşüren bir karar aldıysan mutlaka yaz.\n\n- Zayıf: \"Şantiyede kaba inşaat işlerini takip ettim.\"\n- Güçlü: \"4 blok, 320 dairelik konut projesinin kaba inşaatını 7 taşeron ekiple yürüterek iş programının **3 hafta önünde** tamamladım.\"\n\nGizlilik gerektiren bilgileri, örneğin sözleşme bedelini ya da işvereni, yuvarlanmış aralıklarla veya \"kamu\", \"özel sektör\" gibi genel ifadelerle verebilirsin.",
      },
      {
        heading: "Hakediş, metraj ve planlama becerileri",
        body: "Teknik ofis tarafı, şantiye mühendislerinin en çok aranan ama CV'de en az anlatılan becerisidir. Metraj çıkarma, birim fiyat ve keşif hazırlama, alt yüklenici ve işveren hakedişleri, revize iş programı gibi işleri ayrı maddelerde yaz. Kamu işlerinde çalıştıysan bunu belirtmek, kamu ihale ve hakediş düzenine aşina olduğunu gösterir.\n\nYazılımları seviyesiyle ve gruplanmış olarak ver: çizim (AutoCAD, Revit), planlama (Primavera P6, MS Project), analiz (SAP2000, ETABS gibi), ofis (Excel). İlanda geçen yazılım adını aynı yazımla kullanmak ATS eşleşmesini kolaylaştırır.",
      },
      {
        heading: "İSG, oda üyeliği ve belgeler",
        body: "Türkiye'de inşaat sektörü iş sağlığı ve güvenliğine çok önem verir; iş güvenliği uzmanlığı belgen varsa sınıfıyla birlikte yaz, yoksa aldığın İSG eğitimlerini ve şantiyende kaza oranına yaptığın katkıyı maddelere ekle. İMO üyeliğini kişisel bilgilere ya da sertifikalar bölümüne tek satırla koy.\n\nB sınıfı ehliyet, şantiyeler arası gidip gelen mühendisler için çoğu ilanda istenir. Erkek adaylar askerlik durumunu belirtmelidir; şehir dışı veya yurt dışı şantiyelerde çalışabiliyorsan bunu da ekle, çünkü birçok firma bunu ilk elemede sorar.",
      },
      {
        heading: "Eğitim ve yabancı dil",
        body: "Lisans bilgisini üniversite, bölüm ve mezuniyet yılıyla ver. Yüksek lisansın yapı, geoteknik ya da yapım yönetimi gibi ilanla ilgili bir alandaysa tez konusunu da ekle. Yurt dışı projeler yürüten firmalara başvuruyorsan İngilizce seviyeni Avrupa Ortak Çerçevesi ya da YDS puanıyla belirt; yabancı dilde teknik şartname okuyup yazışma yaptıysan bunu deneyimde göster.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Proje adı ve yapı türünü yazmadan yalnızca \"şantiye mühendisi\" demek: ölçeği bilinmeyen deneyim değerlendirilemez.\n- Teknik ofis işlerini atlamak: hakediş ve metraj deneyimi, sahadaki deneyim kadar aranır.\n- Kullanmadığın yazılımları listelemek: Revit ya da Primavera mülakatta sık sık pratik olarak sorulur.\n- İSG'yi hiç anmamak: güvenlik kültürü inşaat firmalarının önce baktığı konulardan biridir.\n- Her şantiyedeki aynı görevleri tekrar etmek: sorumluluğunun nasıl büyüdüğünü göster.",
      },
    ],
  },
  content: {
    settings: {
      template: "corporate",
      color: "#1e3a5f",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Onur Yazıcıoğlu",
      title: "İnşaat Mühendisi / Şantiye Şefi",
      email: "onur.yazicioglu@ornek.com",
      phone: "0500 000 00 00",
      location: "İstanbul",
      linkedin: "linkedin.com/in/onuryazicioglu-ornek",
      extras: [
        { label: "Askerlik", value: "Tamamlandı" },
        { label: "Ehliyet", value: "B sınıfı" },
        { label: "Meslek odası", value: "İMO İstanbul Şubesi üyesi" },
      ],
    },
    summary:
      "Konut ve ticari yapı projelerinde 6 yıllık şantiye ve teknik ofis deneyimine sahip inşaat mühendisiyim. Betonarme kaba ve ince işlerin saha yönetimi, metraj, alt yüklenici hakedişleri ve iş programı takibinde uzmanlaştım. Son iki yıldır 42.000 m² inşaat alanlı bir konut projesinde şantiye şefi olarak 7 taşeron ekibi ve 3 kişilik mühendis ekibini yönetiyorum.",
    experience: [
      {
        position: "Şantiye Şefi",
        company: "Kuzeyyapı İnşaat A.Ş.",
        location: "İstanbul",
        start: "Nis 2023",
        current: true,
        bullets: [
          "4 blok, 320 dairelik ve 42.000 m² inşaat alanlı konut projesinin kaba inşaatını 7 taşeron ekiple yürüterek iş programının **3 hafta önünde** tamamladım.",
          "Aylık alt yüklenici hakedişlerini metraj ve tutanaklarla kontrol ederek hazırladım; mükerrer ve hatalı kalemleri ayıklayarak projede **yaklaşık %2** maliyet tasarrufu sağladım.",
          "Primavera P6'da revize iş programı hazırlayıp haftalık ilerleme raporlarını işveren temsilcisine sundum.",
          "İSG uzmanıyla birlikte günlük saha denetimleri ve haftalık eğitimler düzenledim; proje boyunca **iş günü kaybına yol açan kaza yaşanmadı**.",
          "3 saha mühendisinin iş dağılımını ve beton döküm planlamasını koordine ettim.",
        ].join("\n"),
      },
      {
        position: "Şantiye Mühendisi",
        company: "Marmara Yapı Taahhüt Ltd. Şti.",
        location: "Kocaeli",
        start: "Ağu 2019",
        end: "Mar 2023",
        bullets: [
          "Bir sanayi tesisi ve iki ticari yapının betonarme ve çelik imalatlarını sahada takip ettim; donatı ve kalıp kontrollerini projeye göre yaptım.",
          "AutoCAD üzerinden kaba ve ince işlerin metrajını çıkardım; malzeme siparişlerini metraja bağlayarak **fire oranını %6'dan %3,5'e** indirdim.",
          "Kamu işvereni için hazırlanan aylık hakediş dosyalarında ataşman ve yeşil defter hazırlığını yürüttüm.",
          "Taşeron sözleşmelerinin birim fiyat karşılaştırmasını yapıp satın alma birimine teknik görüş verdim.",
        ].join("\n"),
      },
    ],
    skills: [
      { category: "Saha ve teknik ofis", items: "Şantiye yönetimi, metraj, hakediş, keşif ve birim fiyat analizi, taşeron yönetimi, kalite kontrol" },
      { category: "Planlama", items: "Primavera P6, Microsoft Project, iş programı ve ilerleme raporlama" },
      { category: "Yazılım", items: "AutoCAD, Revit, SAP2000 (temel), Microsoft Excel" },
      { category: "İSG", items: "Risk değerlendirmesi, saha güvenlik denetimi, iş izni süreçleri" },
    ],
    education: [
      {
        school: "Yıldız Teknik Üniversitesi",
        field: "İnşaat Mühendisliği",
        degree: "Lisans",
        start: "2014",
        end: "2019",
      },
    ],
    certifications: [
      { name: "İş Güvenliği Uzmanlığı (C Sınıfı)", issuer: "Çalışma ve Sosyal Güvenlik Bakanlığı", date: "2022" },
    ],
    languages: [{ language: "İngilizce", level: "B2 – İyi" }],
    references: [],
    interests: "Yürüyüş, mimari fotoğrafçılık",
  },
});
