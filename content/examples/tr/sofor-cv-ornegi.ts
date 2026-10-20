import { defineExample } from "../define";

export default defineExample({
  slug: "sofor-cv-ornegi",
  title: "Şoför CV Örneği",
  occupation: "Şoför",
  category: "operations",
  experienceLevel: "mid",
  metaTitle: "Şoför CV Örneği ve Yazım Rehberi",
  metaDescription:
    "Ehliyet sınıfı, SRC belgesi, psikoteknik ve kazasız sürüş geçmişiyle yazılmış şoför CV örneği. Tek sayfada belge ipuçları; ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "Bir filo ya da lojistik firması şoför alırken CV'ye birkaç saniye bakar ve önce belgeleri arar: ehliyet sınıfı, SRC belgesi, psikoteknik raporu, takograf kartı. Ardından kaç yıldır hangi araçla, hangi güzergâhta çalıştığına ve kaza geçmişine bakar. Bu örnek, 9 yıllık kamyon ve tır deneyimi olan bir şoförün bunları kısa ve düzenli bir sayfada nasıl verdiğini gösteriyor.",
    sections: [
      {
        heading: "Belgeler en üstte olmalı",
        body: "Şoför CV'sinde belgeler deneyimden önce okunur. Ehliyet sınıfını (B, C, CE, D gibi) ve ehliyeti hangi yıldan beri taşıdığını kişisel bilgilere yaz. Ticari taşımacılık yapıyorsan SRC belgesinin türünü mutlaka belirt: yurt içi yük taşımacılığı için SRC4, uluslararası yük taşımacılığı için SRC3 istenir; yolcu taşımacılığında SRC1 ve SRC2 aranır. Tehlikeli madde taşıdıysan bunun belgesini de ekle.\n\nPsikoteknik değerlendirme belgesinin ve dijital takograf sürücü kartının geçerli olduğunu, gerekiyorsa geçerlilik tarihiyle birlikte yaz. Süresi dolmak üzere olan bir belge varsa yenileme tarihini belirtmek işverenin işini kolaylaştırır.",
      },
      {
        heading: "Özet: araç, güzergâh ve yük tipi",
        body: "Özet iki cümleyi geçmesin. Hangi araçları kullandığını (kamyonet, kamyon, çekici, otobüs), hangi güzergâhlarda çalıştığını (şehir içi dağıtım, şehirler arası, uluslararası) ve ne taşıdığını (paletli yük, soğuk zincir, inşaat malzemesi, yolcu) yaz. Bu üç bilgi, işverenin seni hangi araca ve hatta verebileceğini hemen gösterir.\n\nSoğuk zincirde frigorifik araç kullandıysan, şehir içi dağıtımda günde kaç noktaya uğradığını ya da şantiye teslimatlarında vinçli araçla çalıştıysan bunları ayrıca belirt. Aynı ehliyet sınıfına sahip adaylar arasında işvereni karar verdiren çoğu zaman bu tür özel deneyimlerdir.",
      },
      {
        heading: "Deneyimi kilometre ve kazasız sürüşle anlat",
        body: "Şoförlükte en güçlü kanıt, uzun süre sorunsuz çalışmış olmaktır. Yıllık ortalama kilometreni, günlük teslimat noktası sayını, kazasız geçen yıllarını ve zamanında teslim oranını yaz.\n\n- Zayıf: \"Şirket aracıyla yük taşıdım.\"\n- Güçlü: \"Çekiciyle Marmara ve İç Anadolu hattında yılda ortalama **110.000 km** yol yaptım; 6 yılda **kazasız ve hasarsız** çalıştım.\"\n\nAraç bakımına gösterdiğin özeni, yakıt tüketimini düşürdüğün bir dönemi ya da yükleme ve boşaltmada irsaliye kontrolünü de kısa maddelerle ekle.",
      },
      {
        heading: "Takograf ve sürüş süreleri",
        body: "Ticari taşımacılıkta sürüş ve dinlenme sürelerine uymak, hem güvenlik hem de denetim açısından işverenin önem verdiği bir konudur. Takograf kayıtlarında ihlal olmadan çalıştığını, araç takip sistemiyle verilen rotalara uyduğunu belirtmek seni güvenilir gösterir. Uluslararası sefer yaptıysan hangi ülkelere gittiğini ve gümrük kapılarındaki belge işlemlerini kendin yürütüp yürütmediğini yaz.",
      },
      {
        heading: "Kısa ve pratik tut",
        body: "Şoför CV'si tek sayfa olmalı. Uzun bir özgeçmiş yerine belgeler, son iki üç iş ve birkaç pratik beceri yeterlidir: temel araç bakımı, zincir takma, yük sabitleme, el terminaliyle teslimat onayı. Askerlik durumunu ve oturduğun yeri yaz; servisli ya da gece çıkışlı işlerde işveren bunu sorar. Bildiğin yabancı dil uluslararası seferlerde avantajdır, temel düzeyde bile olsa ekle.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Ehliyet sınıfını ya da SRC türünü yazmamak: ilk elemede en çok bakılan bilgidir.\n- Süresi dolmuş psikoteknik belgesini geçerliymiş gibi göstermek.\n- Kullandığın araç tipini ve güzergâhı belirtmemek.\n- Kaza ya da ceza geçmişi konusunda tutarsız bilgi vermek: işveren kayıtları kontrol edebilir.\n- CV'yi gereksiz kişisel bilgilerle uzatmak: belgeler ve deneyim yeterli.",
      },
    ],
  },
  content: {
    settings: {
      template: "ats",
      color: "#334155",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Hüseyin Aktaş",
      title: "Tır ve Kamyon Şoförü",
      email: "huseyin.aktas@ornek.com",
      phone: "0500 000 00 00",
      location: "Esenyurt, İstanbul",
      extras: [
        { label: "Ehliyet", value: "CE sınıfı (2016'dan beri), B sınıfı (2010'dan beri)" },
        { label: "Belgeler", value: "SRC4, psikoteknik belgesi geçerli, dijital takograf sürücü kartı" },
        { label: "Askerlik", value: "Tamamlandı" },
      ],
    },
    summary:
      "Kamyon ve çekiciyle 9 yıllık şehirler arası yük taşımacılığı deneyimine sahip şoförüm. Paletli gıda ve yapı malzemesi taşıdım; son 6 yılda kazasız ve hasarsız çalıştım, takograf kayıtlarında sürüş süresi ihlalim yok.",
    experience: [
      {
        position: "Tır Şoförü",
        company: "Yeşilhat Nakliyat ve Lojistik Ltd. Şti.",
        location: "İstanbul",
        start: "May 2019",
        current: true,
        bullets: [
          "Çekiciyle İstanbul'dan Marmara ve İç Anadolu'daki depolara paletli gıda sevkiyatı yaptım; yılda ortalama **110.000 km** yol kat ettim.",
          "6 yıl boyunca **kazasız ve hasarsız** çalıştım; takograf denetimlerinde sürüş ve dinlenme süresi ihlali almadım.",
          "Ekonomik sürüş eğitimini uygulayarak aracımın yakıt tüketimini 100 km'de ortalama **2,5 litre** düşürdüm.",
          "Yükleme ve teslimatta irsaliye, mühür ve palet sayısı kontrolünü yaptım; teslimatları el terminaliyle onayladım.",
        ].join("\n"),
      },
      {
        position: "Kamyon Şoförü",
        company: "Atakent Yapı Malzemeleri Tic. Ltd. Şti.",
        location: "İstanbul",
        start: "Mar 2016",
        end: "Nis 2019",
        bullets: [
          "Kamyonla şantiyelere ve bayilere günde ortalama 6 noktaya inşaat malzemesi teslim ettim.",
          "Yük sabitleme ve dağıtım sırasını kendim planlayarak teslimatların **%95'inden fazlasını** verilen saat aralığında tamamladım.",
          "Aracın günlük kontrollerini ve periyodik bakım takibini yaptım.",
        ].join("\n"),
      },
    ],
    skills: [
      { category: "Sürüş", items: "Çekici ve kamyon kullanımı, şehirler arası ve şehir içi dağıtım, ekonomik sürüş, kış şartlarında sürüş" },
      { category: "Operasyon", items: "Yük sabitleme, irsaliye ve teslimat kontrolü, araç takip sistemi, el terminali" },
      { category: "Araç bakımı", items: "Günlük araç kontrolü, lastik ve yağ kontrolü, zincir takma" },
    ],
    education: [
      {
        school: "Mesleki ve Teknik Anadolu Lisesi",
        field: "Motorlu Araçlar Teknolojisi Alanı",
        degree: "Lise",
        location: "İstanbul",
        start: "2006",
        end: "2010",
      },
    ],
    certifications: [
      { name: "SRC4 Belgesi (Yurt İçi Eşya Taşımacılığı)", issuer: "MEB onaylı sürücü kursu ve sınavı", date: "2016" },
      { name: "Psikoteknik Değerlendirme Belgesi", issuer: "Yetkili psikoteknik merkezi", date: "2023" },
      { name: "Dijital Takograf Sürücü Kartı", issuer: "TOBB", date: "2024" },
    ],
    references: [],
  },
});
