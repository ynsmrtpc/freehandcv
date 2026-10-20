// Initial content of the is-it-free, support and privacy pages. Used by the seed script.
// The privacy text is a legal text: it is added as a draft and must not be published before the
// bracketed fields are filled in and it has passed legal review.
import { DEFAULT_BLOCK_SETTINGS, type Block } from "../src/lib/blocks";

const settings = (extra: Partial<Block["settings"]> = {}) => ({ ...DEFAULT_BLOCK_SETTINGS, ...extra });
const richText = (id: string, title: string, body: string, extra: Partial<Block["settings"]> = {}): Block => ({
  id,
  type: "rich_text",
  settings: settings(extra),
  content: { title, text: body },
});

type SeedPage = {
  slug: string;
  kind: "static" | "legal";
  publish: boolean;
  title: string;
  metaTitle: string;
  metaDescription: string;
  blocks: Block[];
};

export function seedPages(locale: "tr" | "en"): SeedPage[] {
  const tr = locale === "tr";
  const createResume = tr ? "/cv-olustur" : "/en/create-resume";
  return [
    {
      slug: "is-it-free",
      kind: "static",
      publish: true,
      title: tr ? "Gerçekten ücretsiz mi?" : "Is it really free?",
      metaTitle: tr ? "Gerçekten ücretsiz mi? Masraflar nasıl karşılanıyor" : "Is it really free? How costs are covered",
      metaDescription: tr
        ? "PDF indirme dahil hiçbir özellik ücretli değil, kredi kartı istenmez. Masrafların nasıl karşılandığını açıkça anlatıyoruz."
        : "No feature is paid, PDF download included, and no credit card is ever asked. Here is exactly how our costs are covered.",
      blocks: [
        { id: "title", type: "page_title", settings: settings(), content: { eyebrow: tr ? "Ücretsizlik vaadi" : "Our free promise", title: tr ? "Gerçekten ücretsiz mi?" : "Is it really free?", description: tr ? "Kısa cevap: evet. Uzun cevabı ve masrafların nasıl karşılandığını aşağıda açıkça anlatıyoruz." : "Short answer: yes. Here is the long answer, and exactly how our costs are covered." } },
        richText(
          "yes",
          tr ? "Evet. Hiçbir özellik ücretli değil." : "Yes. No feature is paid.",
          tr
            ? "CV oluşturmak, **PDF olarak indirmek**, istediğin kadar CV saklamak, şablonlar ve IK kontrolü — hepsi ücretsiz. Deneme süresi, filigran ya da \"premium\" sürüm yok.\n\nKredi kartı bilgini **hiçbir zaman** istemiyoruz. Bir site senden kart istiyorsa, o site biz değiliz."
            : "Building a resume, **downloading it as a PDF**, keeping as many resumes as you like, every template and the recruiter check — all free. No trial, no watermark, no \"premium\" tier.\n\nWe **never** ask for your credit card. If a site asks you for one, it isn't us.",
        ),
        richText(
          "costs",
          tr ? "Masraflar nasıl karşılanıyor?" : "How are the costs covered?",
          tr
            ? "Sunucu, alan adı ve e-posta gibi masrafları şimdilik **bağışlarla** karşılıyoruz.\n\nİleride gerekirse yalnızca bilgi sayfalarında (rehberler, örnek CV sayfaları) rahatsız etmeyen birkaç reklam alanı açabiliriz. Editörde, CV'nde ve indirdiğin PDF'te **asla** reklam olmayacak. Bir özelliği ücretli yapmak ise seçeneklerimiz arasında değil."
            : "For now, **donations** cover servers, the domain and email.\n\nIf ever needed, we may add a few unobtrusive ad slots on information pages only (guides, example pages). There will **never** be ads in the editor, on your resume or in the PDF you download. Making a feature paid is not on the table.",
        ),
        richText(
          "data",
          tr ? "Verilerim satılıyor mu?" : "Is my data being sold?",
          tr
            ? "Hayır. Hesap açmadan kullandığında CV'n yalnızca **senin tarayıcında** durur; bize gelmez. Hesap açarsan CV'n sunucumuzda yalnız senin hesabına bağlı olarak saklanır; içeriği yönetim panelimizde bile görünmez. CV'n yalnızca sen **açıkça onay verirsen** işe alım yapan firmalarla paylaşılabilir; bu onayı istediğin an geri alırsın. Ziyaret istatistikleri çerez kullanmayan bir araçla, kişiyi tanımlamadan tutulur."
            : "No. Without an account your resume stays **in your browser** only; it never reaches us. With an account it is stored on our server, tied only to your account — its content isn’t shown even in our admin panel. Your resume is shared with hiring companies only if you **explicitly consent**, and you can withdraw that consent at any time. Visit statistics are collected with a cookie-free tool that doesn’t identify you.",
          { background: "subtle" },
        ),
        {
          id: "donation",
          type: "donation",
          settings: settings(),
          content: {
            title: tr ? "Beğendiysen destek olabilirsin" : "If it helped, you can chip in",
            text: tr
              ? "Bağış tamamen isteğe bağlı. Hiçbir özellik bağışa bağlı değil; bağış yapmasan da her şey aynı kalır."
              : "Donations are entirely optional. Nothing is unlocked by donating; everything stays the same either way.",
            buttonLabel: tr ? "Bağış yap" : "Donate",
          },
        },
        {
          id: "cta",
          type: "cta",
          settings: settings(),
          content: {
            title: tr ? "Hemen dene, kayıt bile gerekmiyor" : "Try it now — no sign-up needed",
            text: tr ? "Birkaç dakikada CV'ni hazırla, PDF olarak indir." : "Build your resume in minutes and download it as a PDF.",
            button: { label: tr ? "CV'mi oluştur" : "Create my resume", href: createResume },
          },
        },
      ],
    },
    {
      slug: "support",
      kind: "static",
      publish: true,
      title: tr ? "Destek ol" : "Support us",
      metaTitle: tr ? "Destek ol" : "Support us",
      metaDescription: tr
        ? "FreehandCV bağışlarla ayakta duruyor. Destek olmak tamamen isteğe bağlı; hiçbir özellik bağışa bağlı değil."
        : "FreehandCV runs on donations. Supporting us is entirely optional; no feature depends on it.",
      blocks: [
        { id: "title", type: "page_title", settings: settings(), content: { eyebrow: tr ? "Destek" : "Support", title: tr ? "FreehandCV'ye destek ol" : "Support FreehandCV", description: tr ? "Destek olmak tamamen isteğe bağlı; hiçbir özellik bağışa bağlı değil." : "Supporting us is entirely optional; no feature depends on it." } },
        richText(
          "why",
          tr ? "FreehandCV bağışlarla ayakta duruyor" : "FreehandCV runs on donations",
          tr
            ? "Herkesin para ödemeden düzgün bir CV hazırlayabilmesini istiyoruz. Sunucu ve alan adı gibi masrafları karşılamak için bağışlara güveniyoruz.\n\nBağış yapmak **tamamen isteğe bağlı**: hiçbir özellik bağışa bağlı değil ve bağış yapmasan da hiçbir şey değişmez."
            : "We want everyone to be able to build a good resume without paying. We rely on donations to cover costs like servers and the domain.\n\nDonating is **entirely optional**: nothing is unlocked by it, and nothing changes if you don’t.",
        ),
        {
          id: "donation",
          type: "donation",
          settings: settings(),
          content: {
            title: tr ? "Bir kahve ısmarla" : "Buy us a coffee",
            text: tr ? "Küçük bir katkı bile sitenin ücretsiz kalmasına yardım ediyor." : "Even a small contribution helps keep the site free.",
            buttonLabel: tr ? "Bağış yap" : "Donate",
          },
        },
        richText(
          "other-ways",
          tr ? "Bağış dışında nasıl yardım edebilirim?" : "Other ways to help",
          tr
            ? "Siteyi işine yarayacak birine önermen bizim için en büyük destek. Bir hata görürsen ya da önerin varsa bize yaz."
            : "Recommending the site to someone who needs it is the biggest help. If you spot a bug or have an idea, write to us.",
          { background: "subtle" },
        ),
      ],
    },
    {
      slug: "privacy",
      kind: "legal",
      publish: false,
      title: tr ? "Gizlilik ve KVKK (taslak — hukuki inceleme bekliyor)" : "Privacy (draft — awaiting legal review)",
      metaTitle: tr ? "Gizlilik ve KVKK aydınlatma metni" : "Privacy notice",
      metaDescription: tr
        ? "FreehandCV'nin hangi kişisel verileri, hangi amaçla işlediği ve KVKK kapsamındaki haklarınız."
        : "Which personal data FreehandCV processes, why, and your rights.",
      blocks: [
        { id: "title", type: "page_title", settings: settings(), content: { eyebrow: tr ? "Yasal" : "Legal", title: tr ? "Gizlilik ve KVKK aydınlatma metni" : "Privacy notice", description: tr ? "Hangi kişisel verileri, hangi amaçla işlediğimizi ve haklarını sade bir dille anlatıyoruz." : "Which personal data we process, why, and your rights — in plain language." } },
        richText(
          "controller",
          tr ? "Veri sorumlusu" : "Data controller",
          tr
            ? "Bu metin 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında hazırlanmıştır. Veri sorumlusu: **[Unvan / ad soyad]**, [adres]. İletişim: [e-posta]."
            : "Data controller: **[Legal name]**, [address]. Contact: [email].",
        ),
        richText(
          "data",
          tr ? "Hangi verileri işliyoruz?" : "What data we process",
          tr
            ? "**Hesapsız kullanım:** CV içeriğin yalnız tarayıcının yerel deposunda (localStorage) saklanır. PDF indirdiğinde içerik, yalnızca PDF dosyasını oluşturmak için sunucumuza gönderilir; işlem bitince saklanmaz ve kayda geçirilmez.\n\n**Hesap açarsan:** e-posta adresin, isteğe bağlı ad soyad ve kullanıcı adın, şifrenin geri döndürülemez özeti (Google ile girişte Google'ın paylaştığı ad, e-posta ve profil bilgisi), oturum kayıtları (IP adresi ve tarayıcı bilgisi), CV içeriklerin (yüklediğin fotoğraf dahil) ve CV'lerinin eski sürümleri.\n\n**Puan ve yorum verirsen:** puanın, yorum metnin, isteğe bağlı mesleğin ve yorumunun sitede gösterilmesine izin verip vermediğin; hesabın varsa yorum hesabınla ilişkilendirilir.\n\n**Kötüye kullanımı önlemek için:** PDF ve yorum isteklerinde IP adresin kısa süreli olarak (en fazla 24 saat) yalnızca sunucu belleğinde sayılır, kaydedilmez.\n\n**Ziyaret istatistikleri:** çerez kullanmayan ve kişiyi tanımlamayan bir analitik aracıyla toplu olarak tutulur."
            : "**Without an account:** your resume content is stored in your browser’s local storage only. When you download a PDF, the content is sent to our server just to create the file; it is not kept or logged afterwards.\n\n**With an account:** your email, optional name and username, an irreversible hash of your password (with Google sign-in, the name, email and profile details Google shares), session records (IP address and browser details), your resumes (including any photo you upload) and their earlier versions.\n\n**If you rate us:** your rating, review text, optional occupation and whether you allowed it to be shown on the site; with an account, the review is linked to it.\n\n**To prevent abuse:** for PDF and review requests your IP address is counted briefly (up to 24 hours) in server memory only, not stored.\n\n**Visit statistics:** collected in aggregate with a cookie-free analytics tool that doesn’t identify you.",
        ),
        richText(
          "purpose",
          tr ? "Neden işliyoruz?" : "Why we process it",
          tr
            ? "Hesabını oluşturmak ve güvenliğini sağlamak, CV'lerini senin için saklamak, şifre sıfırlama gibi işlemleri yapmak ve hizmeti iyileştirmek için. Hukuki sebep: [KVKK m.5 kapsamındaki dayanak — hukukçu tarafından belirlenecek].\n\n**İşverenlerle paylaşım (isteğe bağlı):** Açık rızan varsa, seçtiğin CV'n işe alım yapan firmalarla paylaşılabilir; böylece iş fırsatlarına daha kolay ulaşırsın. Bu işlemenin dayanağı yalnızca **açık rızandır** (KVKK m.5/1, m.8). Rıza vermemen hiçbir özelliği kısıtlamaz; rızanı hesabındaki panelden istediğin an geri alabilirsin. Ne zaman ve hangi metne onay verdiğin kayıt altında tutulur."
            : "To create and secure your account, store your resumes for you, handle things like password resets, and improve the service. Legal basis: [to be determined by legal counsel].\n\n**Sharing with employers (optional):** With your explicit consent, the resume you choose may be shared with hiring companies so job opportunities reach you more easily. The only basis for this is your **explicit consent**. Declining limits no feature, and you can withdraw consent from your dashboard at any time. We record when and to which text you consented.",
        ),
        richText(
          "sharing",
          tr ? "Kimlerle paylaşıyoruz?" : "Who we share it with",
          tr
            ? "Verilerini satmayız. Açık rızan varsa CV'n işe alım yapan firmalarla paylaşılır (yukarıda). Bunun dışında yalnızca hizmeti sunmak için altyapı sağlayıcılarımızla (sunucu barındırma [sağlayıcı ve ülke], e-posta gönderimi [sağlayıcı], dosya depolama [sağlayıcı]) gerekli ölçüde paylaşılır. Yurt dışına aktarım: [varsa açıklama]."
            : "We never sell your data. With your explicit consent your resume is shared with hiring companies (see above). Otherwise it is shared only as needed with infrastructure providers (hosting [provider, country], email delivery [provider], file storage [provider]). International transfers: [details].",
        ),
        richText(
          "retention",
          tr ? "Ne kadar saklıyoruz?" : "How long we keep it",
          tr
            ? "Hesabın açık olduğu sürece. CV'lerinin otomatik sürümlerinden en yeni 50 tanesi tutulur; elle kaydettiğin ve PDF indirirken oluşan sürümler CV'yle birlikte saklanır. Hesabını kapattığında kişisel bilgilerin anonimleştirilir; CV içeriklerin, sürümleri ve fotoğrafların silinir. Silinen CV'ler 30 gün çöp kutusunda kalır ve bu sürede geri alınabilir; sonra kalıcı olarak silinir.\n\n**Yorumlar:** sen ya da biz kaldırana kadar saklanır; hesabını kapatırsan yorumun hesabından ayrılır ve isimsiz kalır."
            : "For as long as your account is open. The newest 50 automatic versions of each resume are kept; versions you save yourself and those made when downloading a PDF are kept with the resume. When you close your account, your personal details are anonymised and your resumes, their versions and photos are deleted. Deleted resumes stay in the trash for 30 days and can be restored; then they are permanently removed.\n\n**Reviews:** kept until you or we remove them; if you close your account the review is detached from it and stays anonymous.",
        ),
        richText(
          "rights",
          tr ? "Hakların" : "Your rights",
          tr
            ? "KVKK'nın 11. maddesi uyarınca verilerinin işlenip işlenmediğini öğrenme, bilgi isteme, düzeltilmesini ya da silinmesini isteme, itiraz etme ve zararın giderilmesini talep etme hakların vardır. **Hesabım** sayfasından verilerinin tamamını JSON olarak indirebilir ve hesabını kapatabilirsin. Başvurular için: [e-posta / başvuru yöntemi]."
            : "You can ask whether your data is processed, request access, correction or deletion, object, and seek redress. On the **My account** page you can download all your data as JSON and close your account. Requests: [email / method].",
        ),
        richText(
          "cookies",
          tr ? "Çerezler" : "Cookies",
          tr
            ? "Yalnızca oturumunu açık tutmak için zorunlu bir çerez kullanırız. Reklam ya da izleme çerezi kullanmıyoruz. Bu durum değişirse önce açık onayını isteyeceğiz."
            : "We use only a strictly necessary cookie to keep you signed in. No advertising or tracking cookies. If that changes, we’ll ask for your explicit consent first.",
        ),
      ],
    },
  ];
}
