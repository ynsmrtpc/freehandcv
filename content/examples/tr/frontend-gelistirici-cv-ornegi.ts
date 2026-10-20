import { defineExample } from "../define";

export default defineExample({
  slug: "frontend-gelistirici-cv-ornegi",
  title: "Frontend Geliştirici CV Örneği",
  occupation: "Frontend Geliştirici",
  category: "technology",
  experienceLevel: "mid",
  metaTitle: "Frontend Geliştirici CV Örneği ve Yazım Rehberi",
  metaDescription:
    "React ve TypeScript deneyimiyle yazılmış frontend geliştirici CV örneği. Performans, erişilebilirlik ve portfolyo ipuçları; ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "Frontend ilanlarını değerlendiren mühendislik yöneticileri bir CV'de önce hangi çatıyla, ne büyüklükte bir arayüzde ve kullanıcıya hissedilir hangi iyileştirmeyle çalıştığını arar. Bu örnek, 4 yıllık deneyimi olan React ve TypeScript ağırlıklı bir frontend geliştiricinin bunları tek sayfada nasıl gösterdiğini anlatıyor.",
    sections: [
      {
        heading: "Özet: ürünü ve teknoloji yığınını birlikte söyle",
        body: "Frontend geliştirici özetinde yalnızca \"React biliyorum\" demek yetmez; hangi tür üründe çalıştığını da yaz: e-ticaret vitrini, B2B yönetim paneli, SaaS ürünü ya da içerik sitesi. Bunlar farklı uzmanlık ister. Özete deneyim süreni, ana yığınını (React, TypeScript, Next.js) ve tek bir somut sonuç ekle.\n\nÖrneğin: \"Aylık 1,5 milyon ziyaretçili bir SaaS ürününün arayüzünü geliştiriyorum; son bir yılda mobil LCP süresini yarıya indirdim.\" Bu cümle hem ölçeği hem de performansa ne kadar önem verdiğini gösterir.",
      },
      {
        heading: "Deneyim maddelerinde kullanıcıya etkiyi göster",
        body: "Frontend işinin sonucu çoğu zaman ölçülebilir: sayfa yüklenme süresi, Core Web Vitals değerleri, paket boyutu, dönüşüm oranı, hata oranı ya da destek talebi sayısı. Maddelerine bu ölçütlerden birini ekle ve değişimi nasıl sağladığını kısaca anlat.\n\n- Zayıf: \"Sitenin performansını iyileştirdim.\"\n- Güçlü: \"Görselleri next/image'a taşıyıp üçüncü taraf betikleri erteleyerek mobil LCP süresini **4,1 sn'den 2,2 sn'ye** indirdim.\"\n\nTasarımcılarla ortak çalışma, tasarım sistemi kurma, kod incelemesi ve test yazma da frontend rolünün parçasıdır; bunları da en az bir maddede göster.",
      },
      {
        heading: "Yetkinlikler ve ATS anahtar kelimeleri",
        body: "Yetkinlikleri \"Diller\", \"Çatılar\", \"Stil ve tasarım sistemi\", \"Test ve araçlar\" gibi gruplara ayır. İlanlarda en çok aranan ifadeler şunlardır: React, TypeScript, Next.js, Redux veya Zustand, React Query, Tailwind CSS, Jest, React Testing Library, Playwright, Storybook, REST ve GraphQL, Core Web Vitals, erişilebilirlik (WCAG).\n\nİlanda Vue veya Angular isteniyorsa ve bu çatıyla gerçekten iş çıkardıysan onu da yaz. Yalnızca bir eğitim videosu izlediğin bir çatıyı eklemek, teknik mülakatta açık verir.",
      },
      {
        heading: "Portfolyo ve GitHub bağlantısı",
        body: "Frontend adaylarında işe alım yapanlar bağlantıya tıklayıp sonucu kendi gözüyle görmek ister. CV'nin başına GitHub ve varsa kişisel siteni ekle. Şirket projelerini gösteremiyorsan yayındaki ürünün adını ve senin sorumlu olduğun ekranları yaz; kodu paylaşılabilen küçük bir yan projeyi de \"Projeler\" bölümüne koy.\n\nBağlantı verdiğin sitenin mobilde düzgün açıldığından ve konsolda hata olmadığından emin ol. Frontend geliştiricinin kendi sitesindeki yavaşlık, CV'deki performans iddialarını zayıflatır.",
      },
      {
        heading: "Erişilebilirlik ve kalite çalışmaları",
        body: "Erişilebilirlik birçok şirkette artık ayrı bir gereksinim olarak ilanlara giriyor. Klavye ile gezinme, ekran okuyucu uyumu, renk kontrastı veya axe ile otomatik denetim yaptıysan bunu bir maddede somut olarak yaz. Aynı şekilde birim testleri, uçtan uca testler ve görsel regresyon testleri kurduysan kapsam oranını ya da yakalanan hata sayısını belirt.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- HTML, CSS ve JavaScript'i ayrı bir \"uzmanlık\" gibi öne çıkarmak: orta seviye bir rolde bunlar zaten varsayılır.\n- Her teknolojinin yanına yıldız veya yüzde çubuğu koymak: ATS bu görselleri okumaz, okuyan kişi de neye göre puanladığını bilemez.\n- Yalnızca kullandığın araçları sıralayıp ne yaptığını anlatmamak.\n- Kırık ya da bakımsız demo bağlantıları vermek.\n- Ekran görüntüleriyle dolu, iki sayfayı aşan bir CV hazırlamak: görselleri portfolyoya bırak.",
      },
    ],
  },
  content: {
    settings: {
      template: "startup",
      color: "#4f46e5",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Deniz Erkan",
      title: "Frontend Geliştirici",
      email: "deniz.erkan@ornek.com",
      phone: "0500 000 00 00",
      location: "İstanbul",
      linkedin: "linkedin.com/in/denizerkan-ornek",
      github: "github.com/denizerkan-ornek",
      web: "denizerkan-ornek.dev",
    },
    summary:
      "4 yıllık deneyime sahip, React ve TypeScript ağırlıklı frontend geliştiriciyim. Aylık 1,5 milyon ziyaretçiye ulaşan bir SaaS ürününün Next.js ile yazılmış arayüzünü geliştiriyor, tasarım sistemini sahipleniyorum. Performans ve erişilebilirlik konularında ekip içinde öncülük ediyorum; son bir yılda mobil LCP süresini yarıya indirdim.",
    experience: [
      {
        position: "Frontend Geliştirici",
        company: "Pusula Bulut Yazılım A.Ş.",
        location: "İstanbul (hibrit)",
        start: "Mar 2023",
        current: true,
        bullets: [
          "Pazarlama sayfalarını ve kayıt akışını Next.js App Router'a taşıdım; mobil LCP süresi **4,1 sn'den 2,2 sn'ye** indi, kayıt formunu tamamlama oranı **%14** arttı.",
          "Storybook üzerinde 40'tan fazla bileşenden oluşan tasarım sistemini kurdum; yeni ekranların geliştirme süresi ortalama **3 günden 1,5 güne** düştü.",
          "React Query'ye geçerek gereksiz API isteklerini kaldırdım; panel ekranlarında istek sayısı **%35** azaldı.",
          "axe ve klavye testleriyle erişilebilirlik denetimi yaptım; WCAG 2.1 AA kapsamında bulunan 60'ı aşkın sorunun **%90'ını** iki sürüm içinde kapattım.",
          "Playwright ile kritik 12 kullanıcı akışı için uçtan uca testler yazdım ve bunları her birleştirme isteğinde çalışacak şekilde CI'a ekledim.",
        ].join("\n"),
      },
      {
        position: "Frontend Geliştirici",
        company: "Rota Dijital Ajans Ltd.",
        location: "İstanbul",
        start: "Ağu 2021",
        end: "Şub 2023",
        bullets: [
          "Perakende ve turizm müşterileri için React ve TypeScript ile 9 kampanya sitesi ve 2 yönetim paneli geliştirdim.",
          "Webpack yapılandırmasını sadeleştirip kod bölmeyi uyguladım; ana paket boyutu **820 KB'tan 310 KB'a** düştü.",
          "Figma tasarımlarını tasarımcılarla birlikte duyarlı (responsive) bileşenlere dönüştürdüm ve teslim öncesi tarayıcı test listesini hazırladım; müşteri teslimlerindeki arayüz hata bildirimleri **yarı yarıya** azaldı.",
        ].join("\n"),
      },
      {
        position: "Frontend Geliştirici Stajyeri",
        company: "Rota Dijital Ajans Ltd.",
        location: "İstanbul",
        start: "Tem 2020",
        end: "Eyl 2020",
        bullets: [
          "Kurumsal web sitelerinin HTML/CSS dönüşümlerinde ve iletişim formlarının JavaScript doğrulamalarında görev aldım.",
        ].join("\n"),
      },
    ],
    projects: [
      {
        name: "tr-tarih-secici",
        role: "Geliştirici",
        start: "2024",
        technologies: "React, TypeScript, Vitest",
        link: "github.com/denizerkan-ornek/tr-tarih-secici",
        description:
          "Türkçe yerelleştirmeli, klavye ve ekran okuyucu uyumlu tarih seçici bileşeni; npm üzerinde haftalık yaklaşık 800 indirme.",
      },
    ],
    skills: [
      { category: "Diller", items: "TypeScript, JavaScript (ES2022), HTML, CSS" },
      { category: "Çatılar", items: "React, Next.js, React Query, Zustand, React Hook Form" },
      { category: "Stil ve tasarım sistemi", items: "Tailwind CSS, CSS Modules, Storybook, Figma" },
      { category: "Test ve araçlar", items: "Jest, React Testing Library, Playwright, Vite, GitHub Actions, Lighthouse" },
    ],
    education: [
      {
        school: "Yıldız Teknik Üniversitesi",
        field: "Bilgisayar Mühendisliği",
        degree: "Lisans",
        start: "2017",
        end: "2021",
      },
    ],
    certifications: [],
    languages: [{ language: "İngilizce", level: "B2 – Orta üstü" }],
    references: [],
    interests: "Web erişilebilirliği topluluk buluşmaları, tipografi, koşu",
  },
});
