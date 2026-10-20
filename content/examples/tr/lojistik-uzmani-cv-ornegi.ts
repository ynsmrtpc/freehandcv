import { defineExample } from "../define";

export default defineExample({
  slug: "lojistik-uzmani-cv-ornegi",
  title: "Lojistik Uzmanı CV Örneği",
  occupation: "Lojistik Uzmanı",
  category: "operations",
  experienceLevel: "mid",
  metaTitle: "Lojistik Uzmanı CV Örneği ve Yazım Rehberi",
  metaDescription:
    "İthalat, ihracat, gümrük ve navlun maliyeti rakamlarıyla yazılmış lojistik uzmanı CV örneği. Incoterms ve madde ipuçları; ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "Lojistik uzmanı ilanları birbirine benzese de işin içeriği şirkete göre çok değişir: kimi ilan ithalat ve gümrük operasyonu, kimi yurt içi dağıtım planlaması, kimi de forwarder tarafında fiyatlandırma ister. İşveren CV'de önce hangi taşıma türlerinde ve hangi yönde çalıştığını arar. Bu örnek, üretim şirketinde 6 yıllık dış ticaret lojistiği deneyimi olan bir uzmanın bunu nasıl anlattığını gösteriyor.",
    sections: [
      {
        heading: "Özet: yön, taşıma türü ve hacim",
        body: "Özetin ilk cümlesinde ithalat mı, ihracat mı, yoksa ikisini birden mi yürüttüğünü ve hangi taşıma türlerinde çalıştığını (karayolu, denizyolu, havayolu, intermodal) yaz. İkinci cümlede hacmi ver: aylık sevkiyat ya da konteyner sayısı, çalıştığın ülke veya bölge, koordine ettiğin forwarder ve gümrük müşaviri sayısı.\n\nYük sahibi şirkette mi, yoksa bir lojistik firmasında mı çalıştığını da netleştir. Forwarder tarafındaki deneyim satış ve fiyatlandırmaya, yük sahibi taraftaki deneyim maliyet ve tedarik planlamasına daha yakındır; işveren hangisine ihtiyaç duyduğunu buradan anlar.",
      },
      {
        heading: "Maddelerde maliyet, süre ve hata oranı",
        body: "Lojistikte sonuç neredeyse her zaman üç şeyden biridir: maliyet, süre ya da hata. Navlun ihalesiyle düşürdüğün birim maliyet, gümrükte bekleme süresinin kısalması, zamanında teslim oranı, demuraj ve ardiye giderlerinin azalması güçlü madde konularıdır.\n\n- Zayıf: \"İhracat sevkiyatlarını takip ettim.\"\n- Güçlü: \"Avrupa'ya yapılan parsiyel ve komple karayolu sevkiyatları için 5 forwarder arasında yıllık ihale yaparak tır başı navlun maliyetini **%14** düşürdüm.\"\n\nRakamların dönemini ve tabanını ver. \"Aylık 90 konteyner\" ya da \"haftada 25 tır\" gibi hacim bilgisi, yüzdelerin ne kadar büyük bir işin üzerinde elde edildiğini gösterir.",
      },
      {
        heading: "Dış ticaret terimleri ve ATS anahtar kelimeleri",
        body: "Bu alandaki ilanlar teknik terimlerle doludur ve aday takip sistemleri bunları arar. Bildiğin ve kullandığın terimleri yetkinliklerde açıkça yaz: Incoterms 2020 (EXW, FCA, FOB, CIF, DAP gibi), gümrük beyannamesi, GTİP, menşe ispat belgeleri (EUR.1, A.TR), transit rejimi, dahilde işleme rejimi, navlun ve sigorta, konteyner ve parsiyel taşıma.\n\nKullandığın ERP modülünü (örneğin SAP'nin satış ya da malzeme modülü), taşıma takip sistemlerini ve Excel seviyeni de ekle. Lojistik raporlaması çoğunlukla Excel üzerinden yürüdüğü için pivot tablo ve düşeyara gibi becerileri adıyla belirtmek işe yarar.",
      },
      {
        heading: "Belgeler ve eğitimler",
        body: "Lojistik uzmanlığı için zorunlu tek bir belge yoktur; ancak dış ticaret, gümrük mevzuatı ve tehlikeli madde taşımacılığı üzerine aldığın eğitimler ilanla ilgiliyse sertifikalar bölümüne eklenebilir. Üniversitede uluslararası ticaret, lojistik ya da gümrük işletmeciliği okuduysan bunu eğitim bölümünde görünür kıl. Yabancı dil bu meslekte belirleyicidir: yurt dışındaki acente ve alıcılarla yazışma yaptığın dili seviyesiyle birlikte yaz.",
      },
      {
        heading: "Kriz anlarını madde yap",
        body: "Lojistikte rutin iş görünmez, sorunlar ise akılda kalır. Limanda yaşanan gecikme, yanlış düzenlenmiş bir belge yüzünden gümrükte bekleyen bir yük ya da üretimi durdurma riski taşıyan geç bir ithalat hammaddesi için ne yaptığını anlat. \"Alternatif güzergâh bularak üretim duruşunu önledim\" gibi bir madde, işverene baskı altında nasıl karar verdiğini gösterir.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Taşıma türünü ve yönünü belirtmemek: ithalat operasyonu ile yurt içi dağıtım farklı işlerdir.\n- Görev listesi yazıp maliyet ve süre etkisini atlamak.\n- Incoterms ve gümrük terimlerini yanlış ya da gelişigüzel kullanmak: mülakatta ilk sorulan konulardandır.\n- Yabancı dil seviyesini abartmak: yazışmalar gerçek seviyeni hızla gösterir.\n- Çalıştığın lojistik firmasının müşteri adlarını CV'de paylaşmak.",
      },
    ],
  },
  content: {
    settings: {
      template: "modern",
      color: "#0e7490",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Onur Demirkol",
      title: "Lojistik Uzmanı (İthalat ve İhracat)",
      email: "onur.demirkol@ornek.com",
      phone: "0500 000 00 00",
      location: "Bursa",
      linkedin: "linkedin.com/in/onurdemirkol-ornek",
      extras: [
        { label: "Askerlik", value: "Tamamlandı" },
        { label: "Ehliyet", value: "B sınıfı" },
      ],
    },
    summary:
      "Otomotiv yan sanayinde 6 yıllık dış ticaret lojistiği deneyimine sahip lojistik uzmanıyım. Avrupa'ya karayolu ihracatını ve Uzak Doğu'dan denizyolu hammadde ithalatını yürütüyor; ayda ortalama 110 tır ve 35 konteynerlik sevkiyatı forwarder ve gümrük müşavirleriyle koordine ediyorum. Navlun ihaleleriyle yıllık taşıma maliyetini %14 düşürdüm.",
    experience: [
      {
        position: "Lojistik Uzmanı",
        company: "Nilüfer Metal Otomotiv Parçaları A.Ş.",
        location: "Bursa",
        start: "Nis 2021",
        current: true,
        bullets: [
          "Avrupa'daki 9 müşteriye yapılan komple ve parsiyel karayolu ihracatını planlayıp ayda ortalama **110 tırlık** sevkiyatı yönettim.",
          "5 forwarder ile yıllık navlun ihalesi yaparak tır başı taşıma maliyetini **%14** düşürdüm.",
          "Uzak Doğu'dan gelen hammadde konteynerlerinde liman çıkışını gümrük müşaviriyle önceden planlayarak demuraj ve ardiye giderlerini **%40** azalttım.",
          "İhracat faturası, EUR.1 ve A.TR belgelerinin kontrolünü standart bir listeye bağladım; belge kaynaklı gümrük beklemeleri yılda **12'den 2'ye** indi.",
          "Limandaki bir gecikmede hammaddeyi hava kargo ve parsiyel karayolu kombinasyonuyla getirerek üretim hattının durmasını önledim.",
        ].join("\n"),
      },
      {
        position: "Dış Ticaret Operasyon Uzman Yardımcısı",
        company: "Marmara Köprü Uluslararası Taşımacılık Ltd. Şti.",
        location: "İstanbul",
        start: "Eyl 2019",
        end: "Mar 2021",
        bullets: [
          "Denizyolu ithalat dosyalarında konşimento, varış ihbarı ve teslim sürecini takip ederek ayda ortalama 60 dosyayı kapattım.",
          "Müşterilere yük durumu hakkında günlük bilgi verdim; yükleme ve varış tarihlerini taşıma takip sisteminde güncel tuttum.",
          "Navlun ve yerel masraf tekliflerinin hazırlığında satış ekibine destek oldum.",
        ].join("\n"),
      },
    ],
    skills: [
      { category: "Dış ticaret", items: "Incoterms 2020, gümrük beyannamesi süreçleri, GTİP, EUR.1 ve A.TR, transit rejimi, dahilde işleme rejimi" },
      { category: "Operasyon", items: "Karayolu (FTL/LTL), denizyolu konteyner, hava kargo, navlun ihalesi, forwarder ve gümrük müşaviri koordinasyonu" },
      { category: "Araçlar", items: "SAP (satış ve malzeme modülleri), taşıma takip sistemleri, Microsoft Excel (pivot tablo, düşeyara)" },
    ],
    education: [
      {
        school: "Bursa Uludağ Üniversitesi",
        field: "İşletme",
        degree: "Lisans",
        start: "2015",
        end: "2019",
      },
    ],
    certifications: [{ name: "Dış Ticaret ve Gümrük Uygulamaları Eğitimi", issuer: "Bölge ticaret odası eğitim programı", date: "2022" }],
    languages: [
      { language: "İngilizce", level: "B2 – İyi (yazışma ve telefon)" },
      { language: "Almanca", level: "A2 – Temel" },
    ],
    references: [],
  },
});
