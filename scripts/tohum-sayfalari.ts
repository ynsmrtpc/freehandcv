// /ucretsiz-mi, /destek ve gizlilik sayfalarının başlangıç içeriği. Tohumlama betiği kullanır.
// Gizlilik metni hukuki metindir: taslak olarak eklenir, köşeli parantezli alanlar doldurulup
// hukuki incelemeden geçmeden yayınlanmamalıdır.
import { VARSAYILAN_AYARLAR, type Blok } from "../src/ortak/bloklar";

const ayar = (ek: Partial<Blok["ayarlar"]> = {}) => ({ ...VARSAYILAN_AYARLAR, ...ek });
const metin = (id: string, baslik: string, govde: string, ek: Partial<Blok["ayarlar"]> = {}): Blok => ({
  id,
  tur: "zengin_metin",
  ayarlar: ayar(ek),
  icerik: { baslik, metin: govde },
});

type TohumSayfa = { slug: string; tur: "sabit" | "yasal"; yayinla: boolean; baslik: string; metaBaslik: string; metaAciklama: string; bloklar: Blok[] };

export function tohumSayfalari(dil: "tr" | "en"): TohumSayfa[] {
  const tr = dil === "tr";
  const cvOlustur = tr ? "/cv-olustur" : "/en/create-resume";
  return [
    {
      slug: "ucretsiz-mi",
      tur: "sabit",
      yayinla: true,
      baslik: tr ? "Gerçekten ücretsiz mi?" : "Is it really free?",
      metaBaslik: tr ? "Gerçekten ücretsiz mi? Masraflar nasıl karşılanıyor" : "Is it really free? How costs are covered",
      metaAciklama: tr
        ? "PDF indirme dahil hiçbir özellik ücretli değil, kredi kartı istenmez. Masrafların nasıl karşılandığını açıkça anlatıyoruz."
        : "No feature is paid, PDF download included, and no credit card is ever asked. Here is exactly how our costs are covered.",
      bloklar: [
        { id: "baslik", tur: "sayfa_basligi", ayarlar: ayar(), icerik: { ust: tr ? "Ücretsizlik vaadi" : "Our free promise", baslik: tr ? "Gerçekten ücretsiz mi?" : "Is it really free?", aciklama: tr ? "Kısa cevap: evet. Uzun cevabı ve masrafların nasıl karşılandığını aşağıda açıkça anlatıyoruz." : "Short answer: yes. Here is the long answer, and exactly how our costs are covered." } },
        metin(
          "evet",
          tr ? "Evet. Hiçbir özellik ücretli değil." : "Yes. No feature is paid.",
          tr
            ? "CV oluşturmak, **PDF olarak indirmek**, istediğin kadar CV saklamak, şablonlar ve IK kontrolü — hepsi ücretsiz. Deneme süresi, filigran ya da \"premium\" sürüm yok.\n\nKredi kartı bilgini **hiçbir zaman** istemiyoruz. Bir site senden kart istiyorsa, o site biz değiliz."
            : "Building a resume, **downloading it as a PDF**, keeping as many resumes as you like, every template and the recruiter check — all free. No trial, no watermark, no \"premium\" tier.\n\nWe **never** ask for your credit card. If a site asks you for one, it isn't us.",
        ),
        metin(
          "masraflar",
          tr ? "Masraflar nasıl karşılanıyor?" : "How are the costs covered?",
          tr
            ? "Sunucu, alan adı ve e-posta gibi masrafları şimdilik **bağışlarla** karşılıyoruz.\n\nİleride gerekirse yalnızca bilgi sayfalarında (rehberler, örnek CV sayfaları) rahatsız etmeyen birkaç reklam alanı açabiliriz. Editörde, CV'nde ve indirdiğin PDF'te **asla** reklam olmayacak. Bir özelliği ücretli yapmak ise seçeneklerimiz arasında değil."
            : "For now, **donations** cover servers, the domain and email.\n\nIf ever needed, we may add a few unobtrusive ad slots on information pages only (guides, example pages). There will **never** be ads in the editor, on your resume or in the PDF you download. Making a feature paid is not on the table.",
        ),
        metin(
          "veri",
          tr ? "Verilerim satılıyor mu?" : "Is my data being sold?",
          tr
            ? "Hayır. Hesap açmadan kullandığında CV'n yalnızca **senin tarayıcında** durur; bize gelmez. Hesap açarsan CV'n sunucumuzda yalnız senin hesabına bağlı olarak saklanır; içeriği yönetim panelimizde bile görünmez. CV'n yalnızca sen **açıkça onay verirsen** işe alım yapan firmalarla paylaşılabilir; bu onayı istediğin an geri alırsın. Ziyaret istatistikleri çerez kullanmayan bir araçla, kişiyi tanımlamadan tutulur."
            : "No. Without an account your resume stays **in your browser** only; it never reaches us. With an account it is stored on our server, tied only to your account — its content isn’t shown even in our admin panel. Your resume is shared with hiring companies only if you **explicitly consent**, and you can withdraw that consent at any time. Visit statistics are collected with a cookie-free tool that doesn’t identify you.",
          { arkaPlan: "hafif" },
        ),
        {
          id: "bagis",
          tur: "bagis",
          ayarlar: ayar(),
          icerik: {
            baslik: tr ? "Beğendiysen destek olabilirsin" : "If it helped, you can chip in",
            metin: tr
              ? "Bağış tamamen isteğe bağlı. Hiçbir özellik bağışa bağlı değil; bağış yapmasan da her şey aynı kalır."
              : "Donations are entirely optional. Nothing is unlocked by donating; everything stays the same either way.",
            buton: tr ? "Bağış yap" : "Donate",
          },
        },
        {
          id: "cta",
          tur: "cta",
          ayarlar: ayar(),
          icerik: {
            baslik: tr ? "Hemen dene, kayıt bile gerekmiyor" : "Try it now — no sign-up needed",
            metin: tr ? "Birkaç dakikada CV'ni hazırla, PDF olarak indir." : "Build your resume in minutes and download it as a PDF.",
            buton: { metin: tr ? "CV'mi oluştur" : "Create my resume", baglanti: cvOlustur },
          },
        },
      ],
    },
    {
      slug: "destek",
      tur: "sabit",
      yayinla: true,
      baslik: tr ? "Destek ol" : "Support us",
      metaBaslik: tr ? "Destek ol" : "Support us",
      metaAciklama: tr
        ? "FreehandCV bağışlarla ayakta duruyor. Destek olmak tamamen isteğe bağlı; hiçbir özellik bağışa bağlı değil."
        : "FreehandCV runs on donations. Supporting us is entirely optional; no feature depends on it.",
      bloklar: [
        { id: "baslik", tur: "sayfa_basligi", ayarlar: ayar(), icerik: { ust: tr ? "Destek" : "Support", baslik: tr ? "FreehandCV'ye destek ol" : "Support FreehandCV", aciklama: tr ? "Destek olmak tamamen isteğe bağlı; hiçbir özellik bağışa bağlı değil." : "Supporting us is entirely optional; no feature depends on it." } },
        metin(
          "neden",
          tr ? "FreehandCV bağışlarla ayakta duruyor" : "FreehandCV runs on donations",
          tr
            ? "Herkesin para ödemeden düzgün bir CV hazırlayabilmesini istiyoruz. Sunucu ve alan adı gibi masrafları karşılamak için bağışlara güveniyoruz.\n\nBağış yapmak **tamamen isteğe bağlı**: hiçbir özellik bağışa bağlı değil ve bağış yapmasan da hiçbir şey değişmez."
            : "We want everyone to be able to build a good resume without paying. We rely on donations to cover costs like servers and the domain.\n\nDonating is **entirely optional**: nothing is unlocked by it, and nothing changes if you don’t.",
        ),
        {
          id: "bagis",
          tur: "bagis",
          ayarlar: ayar(),
          icerik: {
            baslik: tr ? "Bir kahve ısmarla" : "Buy us a coffee",
            metin: tr ? "Küçük bir katkı bile sitenin ücretsiz kalmasına yardım ediyor." : "Even a small contribution helps keep the site free.",
            buton: tr ? "Bağış yap" : "Donate",
          },
        },
        metin(
          "baska",
          tr ? "Bağış dışında nasıl yardım edebilirim?" : "Other ways to help",
          tr
            ? "Siteyi işine yarayacak birine önermen bizim için en büyük destek. Bir hata görürsen ya da önerin varsa bize yaz."
            : "Recommending the site to someone who needs it is the biggest help. If you spot a bug or have an idea, write to us.",
          { arkaPlan: "hafif" },
        ),
      ],
    },
    {
      slug: "gizlilik",
      tur: "yasal",
      yayinla: false,
      baslik: tr ? "Gizlilik ve KVKK (taslak — hukuki inceleme bekliyor)" : "Privacy (draft — awaiting legal review)",
      metaBaslik: tr ? "Gizlilik ve KVKK aydınlatma metni" : "Privacy notice",
      metaAciklama: tr
        ? "FreehandCV'nin hangi kişisel verileri, hangi amaçla işlediği ve KVKK kapsamındaki haklarınız."
        : "Which personal data FreehandCV processes, why, and your rights.",
      bloklar: [
        { id: "baslik", tur: "sayfa_basligi", ayarlar: ayar(), icerik: { ust: tr ? "Yasal" : "Legal", baslik: tr ? "Gizlilik ve KVKK aydınlatma metni" : "Privacy notice", aciklama: tr ? "Hangi kişisel verileri, hangi amaçla işlediğimizi ve haklarını sade bir dille anlatıyoruz." : "Which personal data we process, why, and your rights — in plain language." } },
        metin(
          "sorumlu",
          tr ? "Veri sorumlusu" : "Data controller",
          tr
            ? "Bu metin 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında hazırlanmıştır. Veri sorumlusu: **[Unvan / ad soyad]**, [adres]. İletişim: [e-posta]."
            : "Data controller: **[Legal name]**, [address]. Contact: [email].",
        ),
        metin(
          "veriler",
          tr ? "Hangi verileri işliyoruz?" : "What data we process",
          tr
            ? "**Hesapsız kullanım:** CV içeriğin yalnız tarayıcının yerel deposunda (localStorage) tutulur; sunucumuza gönderilmez.\n\n**Hesap açarsan:** e-posta adresin, isteğe bağlı ad soyad ve kullanıcı adın, şifrenin geri döndürülemez özeti, oturum kayıtları (IP adresi ve tarayıcı bilgisi) ve CV içeriklerin (yüklediğin fotoğraf dahil).\n\n**Ziyaret istatistikleri:** çerez kullanmayan ve kişiyi tanımlamayan bir analitik aracıyla toplu olarak tutulur."
            : "**Without an account:** your resume content stays in your browser’s local storage only; it is not sent to our server.\n\n**With an account:** your email, optional name and username, an irreversible hash of your password, session records (IP address and browser details) and your resumes (including any photo you upload).\n\n**Visit statistics:** collected in aggregate with a cookie-free analytics tool that doesn’t identify you.",
        ),
        metin(
          "amac",
          tr ? "Neden işliyoruz?" : "Why we process it",
          tr
            ? "Hesabını oluşturmak ve güvenliğini sağlamak, CV'lerini senin için saklamak, şifre sıfırlama gibi işlemleri yapmak ve hizmeti iyileştirmek için. Hukuki sebep: [KVKK m.5 kapsamındaki dayanak — hukukçu tarafından belirlenecek].\n\n**İşverenlerle paylaşım (isteğe bağlı):** Açık rızan varsa, seçtiğin CV'n işe alım yapan firmalarla paylaşılabilir; böylece iş fırsatlarına daha kolay ulaşırsın. Bu işlemenin dayanağı yalnızca **açık rızandır** (KVKK m.5/1, m.8). Rıza vermemen hiçbir özelliği kısıtlamaz; rızanı hesabındaki panelden istediğin an geri alabilirsin. Ne zaman ve hangi metne onay verdiğin kayıt altında tutulur."
            : "To create and secure your account, store your resumes for you, handle things like password resets, and improve the service. Legal basis: [to be determined by legal counsel].\n\n**Sharing with employers (optional):** With your explicit consent, the resume you choose may be shared with hiring companies so job opportunities reach you more easily. The only basis for this is your **explicit consent**. Declining limits no feature, and you can withdraw consent from your dashboard at any time. We record when and to which text you consented.",
        ),
        metin(
          "aktarim",
          tr ? "Kimlerle paylaşıyoruz?" : "Who we share it with",
          tr
            ? "Verilerini satmayız. Açık rızan varsa CV'n işe alım yapan firmalarla paylaşılır (yukarıda). Bunun dışında yalnızca hizmeti sunmak için altyapı sağlayıcılarımızla (sunucu barındırma [sağlayıcı ve ülke], e-posta gönderimi [sağlayıcı], dosya depolama [sağlayıcı]) gerekli ölçüde paylaşılır. Yurt dışına aktarım: [varsa açıklama]."
            : "We never sell your data. With your explicit consent your resume is shared with hiring companies (see above). Otherwise it is shared only as needed with infrastructure providers (hosting [provider, country], email delivery [provider], file storage [provider]). International transfers: [details].",
        ),
        metin(
          "saklama",
          tr ? "Ne kadar saklıyoruz?" : "How long we keep it",
          tr
            ? "Hesabın açık olduğu sürece. Hesabını kapattığında kişisel bilgilerin anonimleştirilir, CV içeriklerin ve fotoğrafların silinir. Silinen CV'ler 30 gün çöp kutusunda kalır, sonra kalıcı olarak silinir."
            : "For as long as your account is open. When you close it, your personal details are anonymised and your resumes and photos are deleted. Deleted resumes stay in the trash for 30 days, then are permanently removed.",
        ),
        metin(
          "haklar",
          tr ? "Hakların" : "Your rights",
          tr
            ? "KVKK'nın 11. maddesi uyarınca verilerinin işlenip işlenmediğini öğrenme, bilgi isteme, düzeltilmesini ya da silinmesini isteme, itiraz etme ve zararın giderilmesini talep etme hakların vardır. Hesap ayarlarından verilerini JSON olarak indirebilir ve hesabını kapatabilirsin. Başvurular için: [e-posta / başvuru yöntemi]."
            : "You can ask whether your data is processed, request access, correction or deletion, object, and seek redress. You can download your data as JSON and close your account from account settings. Requests: [email / method].",
        ),
        metin(
          "cerez",
          tr ? "Çerezler" : "Cookies",
          tr
            ? "Yalnızca oturumunu açık tutmak için zorunlu bir çerez kullanırız. Reklam ya da izleme çerezi kullanmıyoruz. Bu durum değişirse önce açık onayını isteyeceğiz."
            : "We use only a strictly necessary cookie to keep you signed in. No advertising or tracking cookies. If that changes, we’ll ask for your explicit consent first.",
        ),
      ],
    },
  ];
}
