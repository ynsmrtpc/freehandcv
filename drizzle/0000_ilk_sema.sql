CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "two_factor" (
	"id" text PRIMARY KEY NOT NULL,
	"secret" text NOT NULL,
	"backup_codes" text NOT NULL,
	"user_id" text NOT NULL,
	"verified" boolean DEFAULT true,
	"failed_verification_count" integer DEFAULT 0,
	"locked_until" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"two_factor_enabled" boolean DEFAULT false,
	"kullanici_adi" text,
	"arayuz_dili" text,
	"pazar" text,
	"rol" text DEFAULT 'kullanici' NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_kullaniciAdi_unique" UNIQUE("kullanici_adi")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cv_surumleri" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cv_id" uuid NOT NULL,
	"icerik" jsonb NOT NULL,
	"tur" text NOT NULL,
	"etiket" text,
	"olusturma" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cvler" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kullanici_id" text NOT NULL,
	"baslik" text NOT NULL,
	"icerik" jsonb NOT NULL,
	"dil" text NOT NULL,
	"pazar" text NOT NULL,
	"durum" text DEFAULT 'taslak' NOT NULL,
	"kaynak_ornek_id" uuid,
	"surum" integer DEFAULT 1 NOT NULL,
	"olusturma" timestamp with time zone DEFAULT now() NOT NULL,
	"guncelleme" timestamp with time zone DEFAULT now() NOT NULL,
	"silinme" timestamp with time zone,
	"sablon_id" uuid,
	"sablon_tanim" jsonb
);
--> statement-breakpoint
CREATE TABLE "dosyalar" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kullanici_id" text NOT NULL,
	"anahtar" text NOT NULL,
	"tur" text NOT NULL,
	"boyut" integer NOT NULL,
	"olusturma" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "dosyalar_anahtar_unique" UNIQUE("anahtar")
);
--> statement-breakpoint
CREATE TABLE "ornek_cvler" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"baslik" text NOT NULL,
	"meslek" text NOT NULL,
	"kategori" text NOT NULL,
	"dil" text NOT NULL,
	"pazar" text NOT NULL,
	"ceviri_grubu" uuid,
	"deneyim_seviyesi" text,
	"icerik" jsonb NOT NULL,
	"sablon_id" uuid,
	"meta_baslik" text,
	"meta_aciklama" text,
	"rehber" jsonb,
	"kullanim_sayisi" integer DEFAULT 0 NOT NULL,
	"sira" integer DEFAULT 0 NOT NULL,
	"aktif" boolean DEFAULT false NOT NULL,
	"guncelleme" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sablon_favorileri" (
	"sablon_id" uuid NOT NULL,
	"kullanici_id" text NOT NULL,
	"olusturma" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sablon_favorileri_sablon_id_kullanici_id_pk" PRIMARY KEY("sablon_id","kullanici_id")
);
--> statement-breakpoint
CREATE TABLE "sablon_puanlari" (
	"sablon_id" uuid NOT NULL,
	"kullanici_id" text NOT NULL,
	"puan" smallint NOT NULL,
	"yorum" text,
	"gizlendi" boolean DEFAULT false NOT NULL,
	"olusturma" timestamp with time zone DEFAULT now() NOT NULL,
	"guncelleme" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sablon_puanlari_sablon_id_kullanici_id_pk" PRIMARY KEY("sablon_id","kullanici_id")
);
--> statement-breakpoint
CREATE TABLE "sablon_sikayetleri" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sablon_id" uuid NOT NULL,
	"kullanici_id" text,
	"neden" text NOT NULL,
	"aciklama" text,
	"durum" text DEFAULT 'acik' NOT NULL,
	"olusturma" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sablonlar" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sahip_id" text,
	"ad" text NOT NULL,
	"aciklama" text,
	"tanim" jsonb NOT NULL,
	"surum" integer DEFAULT 1 NOT NULL,
	"gorunurluk" text DEFAULT 'ozel' NOT NULL,
	"durum" text DEFAULT 'aktif' NOT NULL,
	"resmi" boolean DEFAULT false NOT NULL,
	"kaynak_sablon_id" uuid,
	"ats_puani" smallint,
	"onizleme_anahtari" text,
	"kullanim_sayisi" integer DEFAULT 0 NOT NULL,
	"puan_toplam" integer DEFAULT 0 NOT NULL,
	"puan_sayisi" integer DEFAULT 0 NOT NULL,
	"olusturma" timestamp with time zone DEFAULT now() NOT NULL,
	"guncelleme" timestamp with time zone DEFAULT now() NOT NULL,
	"yayinlanma" timestamp with time zone,
	"silinme" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "site_yorumlari" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kullanici_id" text,
	"puan" smallint NOT NULL,
	"metin" text NOT NULL,
	"meslek" text,
	"izin_verildi" boolean DEFAULT false NOT NULL,
	"onaylandi" boolean DEFAULT false NOT NULL,
	"olusturma" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medya" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"anahtar" text NOT NULL,
	"alt_metin" text,
	"genislik" integer,
	"yukseklik" integer,
	"boyut" integer NOT NULL,
	"yukleyen_id" text,
	"olusturma" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "medya_anahtar_unique" UNIQUE("anahtar")
);
--> statement-breakpoint
CREATE TABLE "reklam_alanlari" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kod" text NOT NULL,
	"saglayici" text DEFAULT 'kapali' NOT NULL,
	"icerik" jsonb,
	"boyut" text,
	"aktif" boolean DEFAULT false NOT NULL,
	"guncelleme" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reklam_alanlari_kod_unique" UNIQUE("kod")
);
--> statement-breakpoint
CREATE TABLE "sayfa_surumleri" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sayfa_id" uuid NOT NULL,
	"bloklar" jsonb NOT NULL,
	"meta" jsonb,
	"yayinlayan_id" text,
	"olusturma" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sayfalar" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"tur" text NOT NULL,
	"dil" text NOT NULL,
	"ceviri_grubu" uuid,
	"ceviri_durumu" text DEFAULT 'gozden_gecirildi' NOT NULL,
	"baslik" text NOT NULL,
	"meta_baslik" text,
	"meta_aciklama" text,
	"og_gorsel_id" uuid,
	"canonical" text,
	"indeks" boolean DEFAULT true NOT NULL,
	"durum" text DEFAULT 'taslak' NOT NULL,
	"yayin_tarihi" timestamp with time zone,
	"bloklar" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"yayindaki_bloklar" jsonb,
	"surum" integer DEFAULT 1 NOT NULL,
	"guncelleyen_id" text,
	"olusturma" timestamp with time zone DEFAULT now() NOT NULL,
	"guncelleme" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_ayarlari" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"ayarlar" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"ceviriler" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"surum" integer DEFAULT 1 NOT NULL,
	"guncelleyen_id" text,
	"guncelleme" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "site_ayarlari_tek_satir" CHECK ("site_ayarlari"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE "sss" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dil" text NOT NULL,
	"ceviri_grubu" uuid,
	"soru" text NOT NULL,
	"cevap" jsonb NOT NULL,
	"kategori" text,
	"sira" integer DEFAULT 0 NOT NULL,
	"aktif" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "yonetim_gunlugu" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kullanici_id" text,
	"islem" text NOT NULL,
	"hedef_tur" text NOT NULL,
	"hedef_id" text,
	"once" jsonb,
	"sonra" jsonb,
	"olusturma" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "yonlendirmeler" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kaynak" text NOT NULL,
	"hedef" text NOT NULL,
	"kod" integer DEFAULT 301 NOT NULL,
	"olusturma" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "yonlendirmeler_kaynak_unique" UNIQUE("kaynak")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "two_factor" ADD CONSTRAINT "two_factor_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cv_surumleri" ADD CONSTRAINT "cv_surumleri_cv_id_cvler_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."cvler"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cvler" ADD CONSTRAINT "cvler_kullanici_id_user_id_fk" FOREIGN KEY ("kullanici_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cvler" ADD CONSTRAINT "cvler_kaynak_ornek_id_ornek_cvler_id_fk" FOREIGN KEY ("kaynak_ornek_id") REFERENCES "public"."ornek_cvler"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cvler" ADD CONSTRAINT "cvler_sablon_id_sablonlar_id_fk" FOREIGN KEY ("sablon_id") REFERENCES "public"."sablonlar"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dosyalar" ADD CONSTRAINT "dosyalar_kullanici_id_user_id_fk" FOREIGN KEY ("kullanici_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ornek_cvler" ADD CONSTRAINT "ornek_cvler_sablon_id_sablonlar_id_fk" FOREIGN KEY ("sablon_id") REFERENCES "public"."sablonlar"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sablon_favorileri" ADD CONSTRAINT "sablon_favorileri_sablon_id_sablonlar_id_fk" FOREIGN KEY ("sablon_id") REFERENCES "public"."sablonlar"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sablon_favorileri" ADD CONSTRAINT "sablon_favorileri_kullanici_id_user_id_fk" FOREIGN KEY ("kullanici_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sablon_puanlari" ADD CONSTRAINT "sablon_puanlari_sablon_id_sablonlar_id_fk" FOREIGN KEY ("sablon_id") REFERENCES "public"."sablonlar"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sablon_puanlari" ADD CONSTRAINT "sablon_puanlari_kullanici_id_user_id_fk" FOREIGN KEY ("kullanici_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sablon_sikayetleri" ADD CONSTRAINT "sablon_sikayetleri_sablon_id_sablonlar_id_fk" FOREIGN KEY ("sablon_id") REFERENCES "public"."sablonlar"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sablon_sikayetleri" ADD CONSTRAINT "sablon_sikayetleri_kullanici_id_user_id_fk" FOREIGN KEY ("kullanici_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sablonlar" ADD CONSTRAINT "sablonlar_sahip_id_user_id_fk" FOREIGN KEY ("sahip_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sablonlar" ADD CONSTRAINT "sablonlar_kaynak_sablon_id_sablonlar_id_fk" FOREIGN KEY ("kaynak_sablon_id") REFERENCES "public"."sablonlar"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_yorumlari" ADD CONSTRAINT "site_yorumlari_kullanici_id_user_id_fk" FOREIGN KEY ("kullanici_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medya" ADD CONSTRAINT "medya_yukleyen_id_user_id_fk" FOREIGN KEY ("yukleyen_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sayfa_surumleri" ADD CONSTRAINT "sayfa_surumleri_sayfa_id_sayfalar_id_fk" FOREIGN KEY ("sayfa_id") REFERENCES "public"."sayfalar"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sayfa_surumleri" ADD CONSTRAINT "sayfa_surumleri_yayinlayan_id_user_id_fk" FOREIGN KEY ("yayinlayan_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sayfalar" ADD CONSTRAINT "sayfalar_og_gorsel_id_medya_id_fk" FOREIGN KEY ("og_gorsel_id") REFERENCES "public"."medya"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sayfalar" ADD CONSTRAINT "sayfalar_guncelleyen_id_user_id_fk" FOREIGN KEY ("guncelleyen_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_ayarlari" ADD CONSTRAINT "site_ayarlari_guncelleyen_id_user_id_fk" FOREIGN KEY ("guncelleyen_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "yonetim_gunlugu" ADD CONSTRAINT "yonetim_gunlugu_kullanici_id_user_id_fk" FOREIGN KEY ("kullanici_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_index" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_user_id_index" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "two_factor_secret_index" ON "two_factor" USING btree ("secret");--> statement-breakpoint
CREATE INDEX "two_factor_user_id_index" ON "two_factor" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_index" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "cv_surumleri_cv_id_olusturma_index" ON "cv_surumleri" USING btree ("cv_id","olusturma");--> statement-breakpoint
CREATE INDEX "cvler_kullanici_id_index" ON "cvler" USING btree ("kullanici_id");--> statement-breakpoint
CREATE INDEX "dosyalar_kullanici_id_index" ON "dosyalar" USING btree ("kullanici_id");--> statement-breakpoint
CREATE UNIQUE INDEX "ornek_cvler_dil_slug_index" ON "ornek_cvler" USING btree ("dil","slug");--> statement-breakpoint
CREATE INDEX "ornek_cvler_kategori_index" ON "ornek_cvler" USING btree ("kategori");--> statement-breakpoint
CREATE INDEX "ornek_cvler_ceviri_grubu_index" ON "ornek_cvler" USING btree ("ceviri_grubu");--> statement-breakpoint
CREATE INDEX "sablon_sikayetleri_sablon_id_durum_index" ON "sablon_sikayetleri" USING btree ("sablon_id","durum");--> statement-breakpoint
CREATE INDEX "sablonlar_sahip_id_index" ON "sablonlar" USING btree ("sahip_id");--> statement-breakpoint
CREATE INDEX "sablonlar_gorunurluk_durum_index" ON "sablonlar" USING btree ("gorunurluk","durum");--> statement-breakpoint
CREATE INDEX "sayfa_surumleri_sayfa_id_olusturma_index" ON "sayfa_surumleri" USING btree ("sayfa_id","olusturma");--> statement-breakpoint
CREATE UNIQUE INDEX "sayfalar_dil_slug_index" ON "sayfalar" USING btree ("dil","slug");--> statement-breakpoint
CREATE INDEX "sayfalar_ceviri_grubu_index" ON "sayfalar" USING btree ("ceviri_grubu");--> statement-breakpoint
CREATE INDEX "sss_dil_kategori_index" ON "sss" USING btree ("dil","kategori");--> statement-breakpoint
CREATE INDEX "yonetim_gunlugu_olusturma_index" ON "yonetim_gunlugu" USING btree ("olusturma");--> statement-breakpoint
CREATE INDEX "yonetim_gunlugu_hedef_tur_hedef_id_index" ON "yonetim_gunlugu" USING btree ("hedef_tur","hedef_id");