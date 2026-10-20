import { defineExample } from "../define";

export default defineExample({
  slug: "harita-muhendisi-cv-ornegi",
  title: "Harita Mühendisi CV Örneği",
  occupation: "Harita Mühendisi",
  category: "engineering",
  experienceLevel: "mid",
  metaTitle: "Harita Mühendisi CV Örneği ve Yazım Rehberi",
  metaDescription:
    "Aplikasyon, kadastro, halihazır harita ve CBS deneyimiyle yazılmış harita mühendisi CV örneği. Yazılım ve saha ipuçları; ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "Harita firmalarının ve kurumların teknik sorumluları bir harita mühendisi CV'sinde hangi ölçme işlerini yaptığına, hangi ölçekte proje yürüttüğüne ve hangi yazılım ve donanımla çalıştığına bakar. Bu örnek, kadastro, aplikasyon ve İHA ile halihazır harita üretiminde 6 yıllık deneyimi olan bir harita mühendisinin saha ve büro işlerini nasıl anlattığını gösteriyor.",
    sections: [
      {
        heading: "Özet: uzmanlık alanı ve proje türü",
        body: "Harita mühendisliği tek bir iş değildir: kadastro ve tapu işlemleri, imar uygulamaları, halihazır harita üretimi, mühendislik ölçmeleri (yol, baraj, maden, inşaat aplikasyonu), fotogrametri ve uzaktan algılama, coğrafi bilgi sistemleri birbirinden farklı beceriler ister. Özetin ilk cümlesinde ağırlıklı çalıştığın alanları söyle.\n\nArdından ölçeği ver: yılda yaptığın aplikasyon ya da kadastro işlemi sayısı, ürettiğin haritanın hektar veya km² cinsinden büyüklüğü, yürüttüğün kamu ihaleli projeler. Son cümlede öne çıkan bir sonucu ya da sorumluluğu yaz; örneğin teknik sorumlu olarak imzaladığın işler.",
      },
      {
        heading: "Saha ve büro işlerini rakamla anlat",
        body: "Bu meslekte işin hacmi ve doğruluğu en güçlü göstergedir. Kaç parselde aplikasyon yaptığını, kaç hektarlık alanın halihazır haritasını ürettiğini, kaç ifraz, tevhid ya da cins değişikliği dosyası hazırladığını ve dosyaların ilk başvuruda onaylanma oranını yaz. Saha süresini ya da düzeltme gereken dosya oranını düşürdüysen bunu da ekle.\n\n- Zayıf: \"Halihazır harita yapımında görev aldım.\"\n- Güçlü: \"İHA ile 1.250 hektarlık alanın fotogrametrik halihazır haritasını üreterek klasik yönteme göre saha süresini **yaklaşık %60** kısalttım.\"\n\nKamu kurumları için yaptığın işlerde kurum adı yerine iş türünü ve ölçeği yazman yeterlidir.",
      },
      {
        heading: "Yazılım, donanım ve ATS anahtar kelimeleri",
        body: "Harita ilanlarında yazılım ve donanım bilgisi neredeyse her zaman istenir. NetCAD, AutoCAD ve Civil 3D gibi çizim ve hesap yazılımlarını; ArcGIS ve QGIS gibi CBS yazılımlarını; fotogrametri yazılımlarını ve kullandığın GNSS alıcısı ile total station türünü yaz. Kullandığın yazılımın modülünü de belirtebilirsin.\n\nATS için şu kavramları ilandaki yazımıyla kullan: aplikasyon, kadastro, ifraz, tevhid, halihazır harita, imar uygulaması, RTK GNSS, poligon ve nivelman, koordinat dönüşümü, CBS, mekânsal veri analizi, fotogrametri, nokta bulutu, ortofoto. Yetkinlikleri \"Ölçme\", \"Kadastro ve imar\", \"CBS ve fotogrametri\" gibi gruplara ayır.",
      },
      {
        heading: "Oda üyeliği, belgeler ve ehliyet",
        body: "Harita ve Kadastro Mühendisleri Odası üyeliğini kişisel bilgilere ya da sertifikalar bölümüne tek satırla ekle. Belirli işler için teknik sorumluluk ya da lisanslı büro deneyimin varsa bunu deneyim maddelerinde açıkça anlat; belge adını ise yalnızca elindeki belgede yazdığı şekilde kullan.\n\nSaha ağırlıklı bir meslek olduğu için B sınıfı ehliyet çoğu ilanda zorunludur ve arazi aracı kullanabilmek avantajdır. İHA ile çalışıyorsan pilot belgeni ve sınıfını ekle. Erkek adaylar için askerlik durumu tek satırla belirtilmelidir.",
      },
      {
        heading: "Doğruluk ve kalite kontrolü göster",
        body: "Bir ölçme hatası tapuda ya da şantiyede pahalıya patlar; bu yüzden işverenler doğruluğa önem veren mühendisi arar. Kontrol ölçmelerini, nokta doğruluğu kriterlerini, kadastro dosyalarındaki iade oranını ve uyguladığın kalite kontrol adımlarını maddelerinde göster. Ekip yönettiysen kaç ölçme ekibini koordine ettiğini ve yeni teknisyenlere verdiğin eğitimleri de yaz.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Yalnızca \"ölçüm yaptım\" yazıp iş türünü ve ölçeği vermemek.\n- Yazılım listesini seviyesiz ve gruplandırmadan bırakmak.\n- Kadastro ve imar işlerinde dosya sayısı ve onay oranı gibi rakamları atlamak.\n- Ehliyet ve saha koşullarına uygunluğu belirtmemek.\n- Malik adı ya da ada-parsel numarası gibi kişisel ve tanımlayıcı bilgileri paylaşmak.",
      },
    ],
  },
  content: {
    settings: {
      template: "timeline",
      color: "#1d4ed8",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Emre Kalaycı",
      title: "Harita Mühendisi – Kadastro, Aplikasyon ve Fotogrametri",
      email: "emre.kalayci@ornek.com",
      phone: "0500 000 00 00",
      location: "Konya",
      linkedin: "linkedin.com/in/emrekalayci-ornek",
      extras: [
        { label: "Askerlik", value: "Tamamlandı" },
        { label: "Ehliyet", value: "B sınıfı, arazi aracı deneyimi" },
        { label: "Meslek odası", value: "Harita ve Kadastro Mühendisleri Odası üyesi" },
      ],
    },
    summary:
      "Kadastro, aplikasyon ve halihazır harita üretiminde 6 yıllık saha ve büro deneyimine sahip harita mühendisiyim. Yılda ortalama 60 ifraz, tevhid ve cins değişikliği dosyası hazırlıyor, aplikasyon işlerinin teknik kontrolünü yapıyorum. Son üç yıldır İHA ile fotogrametrik harita üretimi ve CBS veri tabanı projeleri yürütüyor, 2 ölçme ekibini koordine ediyorum.",
    experience: [
      {
        position: "Harita Mühendisi",
        company: "Selçuklu Harita Mühendislik Ltd. Şti.",
        location: "Konya",
        start: "Mar 2022",
        current: true,
        bullets: [
          "İHA ile 1.250 hektarlık alanın fotogrametrik halihazır haritasını ve ortofotosunu üreterek klasik yönteme göre saha süresini **yaklaşık %60** kısalttım.",
          "Yılda ortalama 60 ifraz, tevhid ve cins değişikliği dosyasını hazırladım; kontrol ölçmesi ve dosya ön kontrol listesi uygulayarak düzeltme için iade edilen dosya oranını **%14'ten %4'e** indirdim.",
          "Bir belediyenin imar uygulaması projesinde 420 parsellik alanın ölçme, hesap ve dağıtım çizimlerini NetCAD ile hazırlayan ekipte yer aldım.",
          "ArcGIS ile 18.000 kayıtlı bir altyapı envanteri veri tabanı kurdum; saha ekiplerinin mobil veri toplama formlarını hazırlayarak veri girişini **günlük güncellemeye** taşıdım.",
          "2 ölçme ekibinin günlük iş planını ve RTK GNSS ile total station cihazlarının kalibrasyon takvimini yönettim.",
        ].join("\n"),
      },
      {
        position: "Harita Mühendisi (Saha)",
        company: "Anadolu Ölçme Mühendislik Bürosu",
        location: "Konya",
        start: "Eyl 2020",
        end: "Şub 2022",
        bullets: [
          "Konut ve sanayi parsellerinde yılda ortalama 300 aplikasyon ve röperli kroki işini yürüttüm.",
          "Bir organize sanayi bölgesi yol projesinde poligon, nivelman ve en kesit ölçmelerini yaparak inşaat ekibine **haftalık aplikasyon** desteği verdim.",
          "TUSAGA-Aktif ile RTK ölçmelerinde kontrol noktası protokolü oluşturdum; tekrar ölçme gerektiren işler **yarı yarıya** azaldı.",
        ].join("\n"),
      },
    ],
    skills: [
      { category: "Ölçme", items: "Aplikasyon, RTK GNSS, total station, poligon ve nivelman, kontrol ölçmesi, koordinat dönüşümü" },
      { category: "Kadastro ve imar", items: "İfraz, tevhid, cins değişikliği, röperli kroki, imar uygulaması hesap ve çizimleri" },
      { category: "CBS ve fotogrametri", items: "ArcGIS, QGIS, İHA ile fotogrametri, ortofoto, nokta bulutu, Agisoft Metashape" },
      { category: "Çizim", items: "NetCAD, AutoCAD, Civil 3D (temel)" },
    ],
    education: [
      {
        school: "Selçuk Üniversitesi",
        field: "Harita Mühendisliği",
        degree: "Lisans",
        start: "2016",
        end: "2020",
      },
    ],
    certifications: [
      { name: "İHA pilotluk belgesi", issuer: "Sivil Havacılık Genel Müdürlüğü", date: "2022" },
      { name: "ArcGIS ile Mekânsal Analiz Eğitimi (30 saat)", issuer: "Üniversite sürekli eğitim merkezi", date: "2023" },
    ],
    languages: [{ language: "İngilizce", level: "B1 – Orta" }],
    references: [],
    interests: "Doğa yürüyüşü, astronomi",
  },
});
