import { defineExample } from "../define";

export default defineExample({
  slug: "paramedik-cv-ornegi",
  title: "Paramedik CV Örneği",
  occupation: "Paramedik",
  category: "healthcare",
  experienceLevel: "mid",
  metaTitle: "Paramedik CV Örneği ve Yazım Rehberi",
  metaDescription:
    "112 istasyonu ve özel ambulans deneyimiyle yazılmış paramedik CV örneği. Vaka yükü, müdahale becerisi ve eğitim ipuçları; ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "Ambulans hizmeti veren kurumlar ve özel sağlık şirketleri bir paramedik CV'sinde önce sahada ne kadar çalıştığını, ne tür vakalara müdahale ettiğini ve ekip içinde hangi rolü üstlendiğini arar. Bu örnek, özel ambulanstan 112 istasyonuna geçmiş 8 yıllık bir paramediğin bu deneyimi tek sayfada nasıl anlattığını gösteriyor.",
    sections: [
      {
        heading: "Özet: saha deneyimini ve vaka türlerini yaz",
        body: "Paramedik özetinde toplam saha deneyimini, çalıştığın hizmet türünü (112 istasyonu, özel ambulans, hastaneler arası nakil, etkinlik sağlık hizmeti) ve bölgenin yapısını belirt. Kentsel bir istasyonla kırsal bir istasyonun iş yükü ve vaka profili farklıdır; işveren bunu bilmek ister.\n\nÖrneğin: \"Son 5,5 yıldır kentsel bir 112 istasyonunda 24 saatlik vardiyalarda çalışıyorum; kardiyak arrest, travma ve solunum sıkıntısı vakalarında ekip içi müdahaleyi yürütüyorum.\" Bu iki bilgi, okuyanın seni hangi ekibe yerleştirebileceğini netleştirir.",
      },
      {
        heading: "Deneyim maddelerini vaka yükü ve ekip rolüyle yaz",
        body: "\"Acil vakalara müdahale ettim\" maddesi her paramedik için doğrudur. Fark; vardiya başına ortalama vaka sayısı, karşılaştığın vaka türleri, ekip içindeki görevin ve istasyonun işleyişine katkındır. Vaka kayıtlarının eksiksizliği, malzeme ve ilaç takibi, cihaz kontrolü gibi işler de ölçülebilir sonuç üretir.\n\n- Zayıf: \"Vaka formlarını doldurdum.\"\n- Güçlü: \"Vardiya devrinde vaka formlarını kontrol eden bir liste önerdim; aylık denetimde eksik formlu vaka oranı **%12'den %3'e** indi.\"\n\nSonuçları istasyon kayıtlarından ve denetim raporlarından al; hasta sağkalımı gibi tek başına etkileyemeyeceğin sonuçları kendine mal etme.",
      },
      {
        heading: "Müdahale becerileri ve anahtar kelimeler",
        body: "Becerilerini \"Acil müdahale\", \"Değerlendirme ve izlem\", \"Olay yeri yönetimi\" gibi gruplarda topla. KPR, manuel ve otomatik defibrilasyon, hava yolu yönetimi, damar yolu açma, travma hastasında immobilizasyon, 12 derivasyonlu EKG, START triajı ve kitlesel olay yönetimi sık aranan ifadelerdir.\n\nYalnızca görev ve yetki tanımın içinde kalan uygulamaları beceri olarak yaz. Hekim talimatıyla ya da hekimle birlikte yaptığın işlemleri bu şekilde belirtmek hem doğru hem de mülakatta güven verir.",
      },
      {
        heading: "Eğitimler, belgeler ve sürücü belgesi",
        body: "İleri yaşam desteği, travma ve pediatrik acil eğitimlerini veren kurum ve yılıyla yaz; süresi geçmiş eğitimleri yenilediğin tarihle güncelle. Ambulans sürüş eğitimi aldıysan ve sürücü belgen varsa sınıfıyla birlikte kişisel bilgilerde göster; özel ambulans şirketleri bu bilgiyi ilk elemede arar. Afet ve kitlesel olay tatbikatlarına katıldıysan yılını ve rolünü ekle.",
      },
      {
        heading: "112 ve özel sektör başvuruları",
        body: "Kamuda 112 kadrolarına alım genellikle KPSS ile yapıldığından CV'n daha çok özel ambulans şirketleri, hastanelerin acil ve nakil birimleri, büyük sanayi tesisleri ve etkinlik sağlık hizmeti veren firmalarda belirleyicidir. Bu işverenler hasta nakli deneyimine, taşıma ventilatörü ve infüzyon pompası kullanımına ve uzun vardiyalara uyuma önem verir. Başvurduğun işin vardiya düzenine uygun olduğunu açıkça yaz.\n\nSanayi tesisleri ve etkinlik firmaları, saha dışındaki katkını da önemser. Çalışanlara ilk yardım bilgilendirmesi yaptıysan, ambulans ve malzeme kontrol düzenini kurduysan ya da tatbikat planlamasında görev aldıysan bunları ayrı maddelerle yaz. Bu işler, tek başına ya da küçük bir sağlık ekibiyle çalışacağın yerlerde seni öne çıkarır.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Vaka ayrıntısı anlatırken hastayı tanınabilir kılacak bilgi vermek.\n- Yetki dışında kalan uygulamaları beceri listesine eklemek.\n- Eğitimleri tarihsiz yazmak: hangi belgenin güncel olduğu anlaşılmaz.\n- Sürücü belgesini ve sınıfını belirtmemek.\n- Erkek adaylarda askerlik durumunu atlamak: özel sektör ilanlarında sıkça sorulur.",
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
      name: "Yasin Toprakçı",
      title: "Paramedik",
      email: "yasin.toprakci@ornek.com",
      phone: "0500 000 00 00",
      location: "Kayseri",
      linkedin: "linkedin.com/in/yasintoprakci-ornek",
      extras: [
        { label: "Askerlik", value: "Tamamlandı" },
        { label: "Sürücü belgesi", value: "B sınıfı" },
      ],
    },
    summary:
      "8 yıllık saha deneyimine sahip paramediğim. İlk 2,5 yılımı özel ambulans hizmetinde hastaneler arası nakil ve etkinlik sağlık ekiplerinde, son 5,5 yılımı kentsel bir 112 istasyonunda 24 saatlik vardiyalarda geçirdim. Kardiyak arrest, travma ve solunum sıkıntısı vakalarında ekip içi müdahale, olay yeri triajı ve hasta nakli sırasında monitörizasyon konularında deneyimliyim.",
    experience: [
      {
        position: "Paramedik",
        company: "Akçalı 112 Acil Sağlık Hizmetleri İstasyonu",
        location: "Kayseri",
        start: "Mar 2021",
        current: true,
        bullets: [
          "Kentsel bölgedeki istasyonda 24 saatlik vardiyalarda vardiya başına ortalama 8–12 vakaya ambulans ekibiyle müdahale ediyorum.",
          "Kardiyak arrest vakalarında KPR, manuel defibrilasyon ve hava yolu yönetimini uyguluyor; 12 derivasyonlu EKG bulgularını komuta kontrol merkezindeki hekimle konsülte ediyorum.",
          "Vardiya devrinde vaka formlarını kontrol eden bir liste önerdim; aylık denetimde eksik formlu vaka oranı **%12'den %3'e** indi.",
          "Ambulans ilaç ve sarf malzemelerinin son kullanma tarihlerini aylık takip tablosuna bağladım; son 2 yılda denetimlerde **miadı geçmiş malzeme tespit edilmedi**.",
          "Yılda 2 kez yapılan afet ve kitlesel olay tatbikatlarında START triajı ve olay yeri yönetimi görevlerini üstlendim.",
        ].join("\n"),
      },
      {
        position: "Paramedik",
        company: "Kuzeyışık Özel Ambulans ve Sağlık Hizmetleri Ltd. Şti.",
        location: "Kayseri",
        start: "Haz 2018",
        end: "Şub 2021",
        bullets: [
          "Hastaneler arası sevk ve evden hastaneye nakillerde ayda ortalama 70 hastanın nakil sırasındaki bakımını ve monitörizasyonunu yürüttüm.",
          "Ventilatör bağımlı ve yoğun bakım hastalarının sevkinde taşıma ventilatörü ve infüzyon pompası takibini yaptım.",
          "Maç, konser ve fuar gibi etkinliklerde sağlık ekibinde görev aldım; tek etkinlikte **40'a kadar** ilk yardım başvurusunu karşıladık.",
          "Ambulans tıbbi cihazlarının vardiya başı kontrol formunu yeniden düzenledim; cihaz arızası nedeniyle iptal edilen nakil sayısı **yılda 9'dan 2'ye** indi.",
        ].join("\n"),
      },
    ],
    skills: [
      {
        category: "Acil müdahale",
        items: "KPR, manuel ve otomatik defibrilasyon, hava yolu yönetimi, damar yolu açma, travma hastasında immobilizasyon, kanama kontrolü",
      },
      {
        category: "Değerlendirme ve izlem",
        items: "Birincil ve ikincil değerlendirme, 12 derivasyonlu EKG, pulse oksimetri, glukometre, taşıma ventilatörü ve infüzyon pompası",
      },
      {
        category: "Olay yeri yönetimi",
        items: "Olay yeri güvenliği, START triajı, kitlesel olay yönetimi, komuta kontrol merkeziyle telsiz iletişimi",
      },
      { category: "Kayıt", items: "Vaka kayıt formu, sevk ve teslim evrakı, malzeme ve ilaç takip kayıtları" },
    ],
    education: [
      {
        school: "Erciyes Üniversitesi",
        field: "İlk ve Acil Yardım",
        degree: "Önlisans",
        start: "2016",
        end: "2018",
      },
    ],
    certifications: [
      { name: "İleri Yaşam Desteği Eğitimi", issuer: "Hizmet içi eğitim programı", date: "2025" },
      { name: "Travma Hastasına Hastane Öncesi Yaklaşım Eğitimi", issuer: "Hizmet içi eğitim programı", date: "2024" },
      { name: "Ambulans Sürüş Teknikleri Eğitimi", issuer: "Hizmet içi eğitim programı", date: "2022" },
    ],
    languages: [{ language: "İngilizce", level: "A2 – Temel" }],
    references: [],
    interests: "Dağ yürüyüşü, arama kurtarma gönüllülüğü, futbol",
  },
});
