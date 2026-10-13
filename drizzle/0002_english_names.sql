-- Renames every Turkish table, column, index and constraint to English and translates stored enum values.
-- Data is preserved (rename only). JSON documents are converted by scripts/convert-legacy-data.ts.
ALTER TABLE "cvler" RENAME TO "resumes";--> statement-breakpoint
ALTER TABLE "cv_surumleri" RENAME TO "resume_versions";--> statement-breakpoint
ALTER TABLE "ornek_cvler" RENAME TO "example_resumes";--> statement-breakpoint
ALTER TABLE "site_yorumlari" RENAME TO "site_reviews";--> statement-breakpoint
ALTER TABLE "dosyalar" RENAME TO "files";--> statement-breakpoint
ALTER TABLE "sablonlar" RENAME TO "templates";--> statement-breakpoint
ALTER TABLE "sablon_puanlari" RENAME TO "template_ratings";--> statement-breakpoint
ALTER TABLE "sablon_favorileri" RENAME TO "template_favorites";--> statement-breakpoint
ALTER TABLE "sablon_sikayetleri" RENAME TO "template_reports";--> statement-breakpoint
ALTER TABLE "rizalar" RENAME TO "consents";--> statement-breakpoint
ALTER TABLE "site_ayarlari" RENAME TO "site_settings";--> statement-breakpoint
ALTER TABLE "medya" RENAME TO "media";--> statement-breakpoint
ALTER TABLE "sayfalar" RENAME TO "pages";--> statement-breakpoint
ALTER TABLE "sayfa_surumleri" RENAME TO "page_versions";--> statement-breakpoint
ALTER TABLE "sss" RENAME TO "faqs";--> statement-breakpoint
ALTER TABLE "reklam_alanlari" RENAME TO "ad_slots";--> statement-breakpoint
ALTER TABLE "yonlendirmeler" RENAME TO "redirects";--> statement-breakpoint
ALTER TABLE "yonetim_gunlugu" RENAME TO "audit_log";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "kullanici_adi" TO "username";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "arayuz_dili" TO "ui_locale";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "pazar" TO "market";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "rol" TO "role";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "isveren_paylasimi" TO "employer_sharing";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "paylasilan_cv_id" TO "shared_resume_id";--> statement-breakpoint
ALTER TABLE "resumes" RENAME COLUMN "kullanici_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "resumes" RENAME COLUMN "baslik" TO "title";--> statement-breakpoint
ALTER TABLE "resumes" RENAME COLUMN "icerik" TO "content";--> statement-breakpoint
ALTER TABLE "resumes" RENAME COLUMN "dil" TO "locale";--> statement-breakpoint
ALTER TABLE "resumes" RENAME COLUMN "pazar" TO "market";--> statement-breakpoint
ALTER TABLE "resumes" RENAME COLUMN "durum" TO "status";--> statement-breakpoint
ALTER TABLE "resumes" RENAME COLUMN "kaynak_ornek_id" TO "source_example_id";--> statement-breakpoint
ALTER TABLE "resumes" RENAME COLUMN "surum" TO "version";--> statement-breakpoint
ALTER TABLE "resumes" RENAME COLUMN "olusturma" TO "created_at";--> statement-breakpoint
ALTER TABLE "resumes" RENAME COLUMN "guncelleme" TO "updated_at";--> statement-breakpoint
ALTER TABLE "resumes" RENAME COLUMN "silinme" TO "deleted_at";--> statement-breakpoint
ALTER TABLE "resumes" RENAME COLUMN "sablon_id" TO "template_id";--> statement-breakpoint
ALTER TABLE "resumes" RENAME COLUMN "sablon_tanim" TO "template_definition";--> statement-breakpoint
ALTER TABLE "resume_versions" RENAME COLUMN "cv_id" TO "resume_id";--> statement-breakpoint
ALTER TABLE "resume_versions" RENAME COLUMN "icerik" TO "content";--> statement-breakpoint
ALTER TABLE "resume_versions" RENAME COLUMN "tur" TO "kind";--> statement-breakpoint
ALTER TABLE "resume_versions" RENAME COLUMN "etiket" TO "label";--> statement-breakpoint
ALTER TABLE "resume_versions" RENAME COLUMN "olusturma" TO "created_at";--> statement-breakpoint
ALTER TABLE "example_resumes" RENAME COLUMN "baslik" TO "title";--> statement-breakpoint
ALTER TABLE "example_resumes" RENAME COLUMN "meslek" TO "occupation";--> statement-breakpoint
ALTER TABLE "example_resumes" RENAME COLUMN "kategori" TO "category";--> statement-breakpoint
ALTER TABLE "example_resumes" RENAME COLUMN "dil" TO "locale";--> statement-breakpoint
ALTER TABLE "example_resumes" RENAME COLUMN "pazar" TO "market";--> statement-breakpoint
ALTER TABLE "example_resumes" RENAME COLUMN "ceviri_grubu" TO "translation_group";--> statement-breakpoint
ALTER TABLE "example_resumes" RENAME COLUMN "deneyim_seviyesi" TO "experience_level";--> statement-breakpoint
ALTER TABLE "example_resumes" RENAME COLUMN "icerik" TO "content";--> statement-breakpoint
ALTER TABLE "example_resumes" RENAME COLUMN "sablon_id" TO "template_id";--> statement-breakpoint
ALTER TABLE "example_resumes" RENAME COLUMN "meta_baslik" TO "meta_title";--> statement-breakpoint
ALTER TABLE "example_resumes" RENAME COLUMN "meta_aciklama" TO "meta_description";--> statement-breakpoint
ALTER TABLE "example_resumes" RENAME COLUMN "rehber" TO "guide";--> statement-breakpoint
ALTER TABLE "example_resumes" RENAME COLUMN "kullanim_sayisi" TO "usage_count";--> statement-breakpoint
ALTER TABLE "example_resumes" RENAME COLUMN "sira" TO "sort_order";--> statement-breakpoint
ALTER TABLE "example_resumes" RENAME COLUMN "aktif" TO "active";--> statement-breakpoint
ALTER TABLE "example_resumes" RENAME COLUMN "guncelleme" TO "updated_at";--> statement-breakpoint
ALTER TABLE "site_reviews" RENAME COLUMN "kullanici_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "site_reviews" RENAME COLUMN "puan" TO "rating";--> statement-breakpoint
ALTER TABLE "site_reviews" RENAME COLUMN "metin" TO "body";--> statement-breakpoint
ALTER TABLE "site_reviews" RENAME COLUMN "meslek" TO "occupation";--> statement-breakpoint
ALTER TABLE "site_reviews" RENAME COLUMN "izin_verildi" TO "display_allowed";--> statement-breakpoint
ALTER TABLE "site_reviews" RENAME COLUMN "onaylandi" TO "approved";--> statement-breakpoint
ALTER TABLE "site_reviews" RENAME COLUMN "olusturma" TO "created_at";--> statement-breakpoint
ALTER TABLE "files" RENAME COLUMN "kullanici_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "files" RENAME COLUMN "anahtar" TO "key";--> statement-breakpoint
ALTER TABLE "files" RENAME COLUMN "tur" TO "kind";--> statement-breakpoint
ALTER TABLE "files" RENAME COLUMN "boyut" TO "size";--> statement-breakpoint
ALTER TABLE "files" RENAME COLUMN "olusturma" TO "created_at";--> statement-breakpoint
ALTER TABLE "templates" RENAME COLUMN "sahip_id" TO "owner_id";--> statement-breakpoint
ALTER TABLE "templates" RENAME COLUMN "ad" TO "name";--> statement-breakpoint
ALTER TABLE "templates" RENAME COLUMN "aciklama" TO "description";--> statement-breakpoint
ALTER TABLE "templates" RENAME COLUMN "tanim" TO "definition";--> statement-breakpoint
ALTER TABLE "templates" RENAME COLUMN "surum" TO "version";--> statement-breakpoint
ALTER TABLE "templates" RENAME COLUMN "gorunurluk" TO "visibility";--> statement-breakpoint
ALTER TABLE "templates" RENAME COLUMN "durum" TO "status";--> statement-breakpoint
ALTER TABLE "templates" RENAME COLUMN "resmi" TO "official";--> statement-breakpoint
ALTER TABLE "templates" RENAME COLUMN "kaynak_sablon_id" TO "source_template_id";--> statement-breakpoint
ALTER TABLE "templates" RENAME COLUMN "ats_puani" TO "ats_score";--> statement-breakpoint
ALTER TABLE "templates" RENAME COLUMN "onizleme_anahtari" TO "preview_key";--> statement-breakpoint
ALTER TABLE "templates" RENAME COLUMN "kullanim_sayisi" TO "usage_count";--> statement-breakpoint
ALTER TABLE "templates" RENAME COLUMN "puan_toplam" TO "rating_sum";--> statement-breakpoint
ALTER TABLE "templates" RENAME COLUMN "puan_sayisi" TO "rating_count";--> statement-breakpoint
ALTER TABLE "templates" RENAME COLUMN "olusturma" TO "created_at";--> statement-breakpoint
ALTER TABLE "templates" RENAME COLUMN "guncelleme" TO "updated_at";--> statement-breakpoint
ALTER TABLE "templates" RENAME COLUMN "yayinlanma" TO "published_at";--> statement-breakpoint
ALTER TABLE "templates" RENAME COLUMN "silinme" TO "deleted_at";--> statement-breakpoint
ALTER TABLE "template_ratings" RENAME COLUMN "sablon_id" TO "template_id";--> statement-breakpoint
ALTER TABLE "template_ratings" RENAME COLUMN "kullanici_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "template_ratings" RENAME COLUMN "puan" TO "rating";--> statement-breakpoint
ALTER TABLE "template_ratings" RENAME COLUMN "yorum" TO "comment";--> statement-breakpoint
ALTER TABLE "template_ratings" RENAME COLUMN "gizlendi" TO "hidden";--> statement-breakpoint
ALTER TABLE "template_ratings" RENAME COLUMN "olusturma" TO "created_at";--> statement-breakpoint
ALTER TABLE "template_ratings" RENAME COLUMN "guncelleme" TO "updated_at";--> statement-breakpoint
ALTER TABLE "template_favorites" RENAME COLUMN "sablon_id" TO "template_id";--> statement-breakpoint
ALTER TABLE "template_favorites" RENAME COLUMN "kullanici_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "template_favorites" RENAME COLUMN "olusturma" TO "created_at";--> statement-breakpoint
ALTER TABLE "template_reports" RENAME COLUMN "sablon_id" TO "template_id";--> statement-breakpoint
ALTER TABLE "template_reports" RENAME COLUMN "kullanici_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "template_reports" RENAME COLUMN "neden" TO "reason";--> statement-breakpoint
ALTER TABLE "template_reports" RENAME COLUMN "aciklama" TO "details";--> statement-breakpoint
ALTER TABLE "template_reports" RENAME COLUMN "durum" TO "status";--> statement-breakpoint
ALTER TABLE "template_reports" RENAME COLUMN "olusturma" TO "created_at";--> statement-breakpoint
ALTER TABLE "consents" RENAME COLUMN "kullanici_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "consents" RENAME COLUMN "tur" TO "kind";--> statement-breakpoint
ALTER TABLE "consents" RENAME COLUMN "verildi" TO "granted";--> statement-breakpoint
ALTER TABLE "consents" RENAME COLUMN "metin_surumu" TO "text_version";--> statement-breakpoint
ALTER TABLE "consents" RENAME COLUMN "kaynak" TO "source";--> statement-breakpoint
ALTER TABLE "consents" RENAME COLUMN "olusturma" TO "created_at";--> statement-breakpoint
ALTER TABLE "site_settings" RENAME COLUMN "ayarlar" TO "settings";--> statement-breakpoint
ALTER TABLE "site_settings" RENAME COLUMN "ceviriler" TO "translations";--> statement-breakpoint
ALTER TABLE "site_settings" RENAME COLUMN "surum" TO "version";--> statement-breakpoint
ALTER TABLE "site_settings" RENAME COLUMN "guncelleyen_id" TO "updated_by_id";--> statement-breakpoint
ALTER TABLE "site_settings" RENAME COLUMN "guncelleme" TO "updated_at";--> statement-breakpoint
ALTER TABLE "media" RENAME COLUMN "anahtar" TO "key";--> statement-breakpoint
ALTER TABLE "media" RENAME COLUMN "alt_metin" TO "alt_text";--> statement-breakpoint
ALTER TABLE "media" RENAME COLUMN "genislik" TO "width";--> statement-breakpoint
ALTER TABLE "media" RENAME COLUMN "yukseklik" TO "height";--> statement-breakpoint
ALTER TABLE "media" RENAME COLUMN "boyut" TO "size";--> statement-breakpoint
ALTER TABLE "media" RENAME COLUMN "yukleyen_id" TO "uploaded_by_id";--> statement-breakpoint
ALTER TABLE "media" RENAME COLUMN "olusturma" TO "created_at";--> statement-breakpoint
ALTER TABLE "pages" RENAME COLUMN "tur" TO "kind";--> statement-breakpoint
ALTER TABLE "pages" RENAME COLUMN "dil" TO "locale";--> statement-breakpoint
ALTER TABLE "pages" RENAME COLUMN "ceviri_grubu" TO "translation_group";--> statement-breakpoint
ALTER TABLE "pages" RENAME COLUMN "ceviri_durumu" TO "translation_status";--> statement-breakpoint
ALTER TABLE "pages" RENAME COLUMN "baslik" TO "title";--> statement-breakpoint
ALTER TABLE "pages" RENAME COLUMN "meta_baslik" TO "meta_title";--> statement-breakpoint
ALTER TABLE "pages" RENAME COLUMN "meta_aciklama" TO "meta_description";--> statement-breakpoint
ALTER TABLE "pages" RENAME COLUMN "og_gorsel_id" TO "og_image_id";--> statement-breakpoint
ALTER TABLE "pages" RENAME COLUMN "indeks" TO "indexable";--> statement-breakpoint
ALTER TABLE "pages" RENAME COLUMN "durum" TO "status";--> statement-breakpoint
ALTER TABLE "pages" RENAME COLUMN "yayin_tarihi" TO "publish_at";--> statement-breakpoint
ALTER TABLE "pages" RENAME COLUMN "bloklar" TO "draft_blocks";--> statement-breakpoint
ALTER TABLE "pages" RENAME COLUMN "yayindaki_bloklar" TO "published_blocks";--> statement-breakpoint
ALTER TABLE "pages" RENAME COLUMN "surum" TO "version";--> statement-breakpoint
ALTER TABLE "pages" RENAME COLUMN "guncelleyen_id" TO "updated_by_id";--> statement-breakpoint
ALTER TABLE "pages" RENAME COLUMN "olusturma" TO "created_at";--> statement-breakpoint
ALTER TABLE "pages" RENAME COLUMN "guncelleme" TO "updated_at";--> statement-breakpoint
ALTER TABLE "page_versions" RENAME COLUMN "sayfa_id" TO "page_id";--> statement-breakpoint
ALTER TABLE "page_versions" RENAME COLUMN "bloklar" TO "blocks";--> statement-breakpoint
ALTER TABLE "page_versions" RENAME COLUMN "yayinlayan_id" TO "published_by_id";--> statement-breakpoint
ALTER TABLE "page_versions" RENAME COLUMN "olusturma" TO "created_at";--> statement-breakpoint
ALTER TABLE "faqs" RENAME COLUMN "dil" TO "locale";--> statement-breakpoint
ALTER TABLE "faqs" RENAME COLUMN "ceviri_grubu" TO "translation_group";--> statement-breakpoint
ALTER TABLE "faqs" RENAME COLUMN "soru" TO "question";--> statement-breakpoint
ALTER TABLE "faqs" RENAME COLUMN "cevap" TO "answer";--> statement-breakpoint
ALTER TABLE "faqs" RENAME COLUMN "kategori" TO "category";--> statement-breakpoint
ALTER TABLE "faqs" RENAME COLUMN "sira" TO "sort_order";--> statement-breakpoint
ALTER TABLE "faqs" RENAME COLUMN "aktif" TO "active";--> statement-breakpoint
ALTER TABLE "ad_slots" RENAME COLUMN "kod" TO "code";--> statement-breakpoint
ALTER TABLE "ad_slots" RENAME COLUMN "saglayici" TO "provider";--> statement-breakpoint
ALTER TABLE "ad_slots" RENAME COLUMN "icerik" TO "content";--> statement-breakpoint
ALTER TABLE "ad_slots" RENAME COLUMN "boyut" TO "size";--> statement-breakpoint
ALTER TABLE "ad_slots" RENAME COLUMN "aktif" TO "active";--> statement-breakpoint
ALTER TABLE "ad_slots" RENAME COLUMN "guncelleme" TO "updated_at";--> statement-breakpoint
ALTER TABLE "redirects" RENAME COLUMN "kaynak" TO "source";--> statement-breakpoint
ALTER TABLE "redirects" RENAME COLUMN "hedef" TO "destination";--> statement-breakpoint
ALTER TABLE "redirects" RENAME COLUMN "kod" TO "status_code";--> statement-breakpoint
ALTER TABLE "redirects" RENAME COLUMN "olusturma" TO "created_at";--> statement-breakpoint
ALTER TABLE "audit_log" RENAME COLUMN "kullanici_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "audit_log" RENAME COLUMN "islem" TO "action";--> statement-breakpoint
ALTER TABLE "audit_log" RENAME COLUMN "hedef_tur" TO "target_type";--> statement-breakpoint
ALTER TABLE "audit_log" RENAME COLUMN "hedef_id" TO "target_id";--> statement-breakpoint
ALTER TABLE "audit_log" RENAME COLUMN "once" TO "before";--> statement-breakpoint
ALTER TABLE "audit_log" RENAME COLUMN "sonra" TO "after";--> statement-breakpoint
ALTER TABLE "audit_log" RENAME COLUMN "olusturma" TO "created_at";--> statement-breakpoint
ALTER TABLE "resumes" RENAME CONSTRAINT "cvler_pkey" TO "resumes_pkey";--> statement-breakpoint
ALTER TABLE "resume_versions" RENAME CONSTRAINT "cv_surumleri_pkey" TO "resume_versions_pkey";--> statement-breakpoint
ALTER TABLE "example_resumes" RENAME CONSTRAINT "ornek_cvler_pkey" TO "example_resumes_pkey";--> statement-breakpoint
ALTER TABLE "site_reviews" RENAME CONSTRAINT "site_yorumlari_pkey" TO "site_reviews_pkey";--> statement-breakpoint
ALTER TABLE "files" RENAME CONSTRAINT "dosyalar_pkey" TO "files_pkey";--> statement-breakpoint
ALTER TABLE "templates" RENAME CONSTRAINT "sablonlar_pkey" TO "templates_pkey";--> statement-breakpoint
ALTER TABLE "template_reports" RENAME CONSTRAINT "sablon_sikayetleri_pkey" TO "template_reports_pkey";--> statement-breakpoint
ALTER TABLE "consents" RENAME CONSTRAINT "rizalar_pkey" TO "consents_pkey";--> statement-breakpoint
ALTER TABLE "site_settings" RENAME CONSTRAINT "site_ayarlari_pkey" TO "site_settings_pkey";--> statement-breakpoint
ALTER TABLE "media" RENAME CONSTRAINT "medya_pkey" TO "media_pkey";--> statement-breakpoint
ALTER TABLE "pages" RENAME CONSTRAINT "sayfalar_pkey" TO "pages_pkey";--> statement-breakpoint
ALTER TABLE "page_versions" RENAME CONSTRAINT "sayfa_surumleri_pkey" TO "page_versions_pkey";--> statement-breakpoint
ALTER TABLE "faqs" RENAME CONSTRAINT "sss_pkey" TO "faqs_pkey";--> statement-breakpoint
ALTER TABLE "ad_slots" RENAME CONSTRAINT "reklam_alanlari_pkey" TO "ad_slots_pkey";--> statement-breakpoint
ALTER TABLE "redirects" RENAME CONSTRAINT "yonlendirmeler_pkey" TO "redirects_pkey";--> statement-breakpoint
ALTER TABLE "audit_log" RENAME CONSTRAINT "yonetim_gunlugu_pkey" TO "audit_log_pkey";--> statement-breakpoint
ALTER TABLE "resume_versions" RENAME CONSTRAINT "cv_surumleri_cv_id_cvler_id_fk" TO "resume_versions_resume_id_resumes_id_fk";--> statement-breakpoint
ALTER TABLE "resumes" RENAME CONSTRAINT "cvler_kullanici_id_user_id_fk" TO "resumes_user_id_user_id_fk";--> statement-breakpoint
ALTER TABLE "resumes" RENAME CONSTRAINT "cvler_kaynak_ornek_id_ornek_cvler_id_fk" TO "resumes_source_example_id_example_resumes_id_fk";--> statement-breakpoint
ALTER TABLE "resumes" RENAME CONSTRAINT "cvler_sablon_id_sablonlar_id_fk" TO "resumes_template_id_templates_id_fk";--> statement-breakpoint
ALTER TABLE "files" RENAME CONSTRAINT "dosyalar_kullanici_id_user_id_fk" TO "files_user_id_user_id_fk";--> statement-breakpoint
ALTER TABLE "example_resumes" RENAME CONSTRAINT "ornek_cvler_sablon_id_sablonlar_id_fk" TO "example_resumes_template_id_templates_id_fk";--> statement-breakpoint
ALTER TABLE "template_favorites" RENAME CONSTRAINT "sablon_favorileri_sablon_id_sablonlar_id_fk" TO "template_favorites_template_id_templates_id_fk";--> statement-breakpoint
ALTER TABLE "template_favorites" RENAME CONSTRAINT "sablon_favorileri_kullanici_id_user_id_fk" TO "template_favorites_user_id_user_id_fk";--> statement-breakpoint
ALTER TABLE "template_ratings" RENAME CONSTRAINT "sablon_puanlari_sablon_id_sablonlar_id_fk" TO "template_ratings_template_id_templates_id_fk";--> statement-breakpoint
ALTER TABLE "template_ratings" RENAME CONSTRAINT "sablon_puanlari_kullanici_id_user_id_fk" TO "template_ratings_user_id_user_id_fk";--> statement-breakpoint
ALTER TABLE "template_reports" RENAME CONSTRAINT "sablon_sikayetleri_sablon_id_sablonlar_id_fk" TO "template_reports_template_id_templates_id_fk";--> statement-breakpoint
ALTER TABLE "template_reports" RENAME CONSTRAINT "sablon_sikayetleri_kullanici_id_user_id_fk" TO "template_reports_user_id_user_id_fk";--> statement-breakpoint
ALTER TABLE "templates" RENAME CONSTRAINT "sablonlar_sahip_id_user_id_fk" TO "templates_owner_id_user_id_fk";--> statement-breakpoint
ALTER TABLE "templates" RENAME CONSTRAINT "sablonlar_kaynak_sablon_id_sablonlar_id_fk" TO "templates_source_template_id_templates_id_fk";--> statement-breakpoint
ALTER TABLE "site_reviews" RENAME CONSTRAINT "site_yorumlari_kullanici_id_user_id_fk" TO "site_reviews_user_id_user_id_fk";--> statement-breakpoint
ALTER TABLE "media" RENAME CONSTRAINT "medya_yukleyen_id_user_id_fk" TO "media_uploaded_by_id_user_id_fk";--> statement-breakpoint
ALTER TABLE "page_versions" RENAME CONSTRAINT "sayfa_surumleri_sayfa_id_sayfalar_id_fk" TO "page_versions_page_id_pages_id_fk";--> statement-breakpoint
ALTER TABLE "page_versions" RENAME CONSTRAINT "sayfa_surumleri_yayinlayan_id_user_id_fk" TO "page_versions_published_by_id_user_id_fk";--> statement-breakpoint
ALTER TABLE "pages" RENAME CONSTRAINT "sayfalar_og_gorsel_id_medya_id_fk" TO "pages_og_image_id_media_id_fk";--> statement-breakpoint
ALTER TABLE "pages" RENAME CONSTRAINT "sayfalar_guncelleyen_id_user_id_fk" TO "pages_updated_by_id_user_id_fk";--> statement-breakpoint
ALTER TABLE "site_settings" RENAME CONSTRAINT "site_ayarlari_guncelleyen_id_user_id_fk" TO "site_settings_updated_by_id_user_id_fk";--> statement-breakpoint
ALTER TABLE "audit_log" RENAME CONSTRAINT "yonetim_gunlugu_kullanici_id_user_id_fk" TO "audit_log_user_id_user_id_fk";--> statement-breakpoint
ALTER TABLE "consents" RENAME CONSTRAINT "rizalar_kullanici_id_user_id_fk" TO "consents_user_id_user_id_fk";--> statement-breakpoint
ALTER INDEX "cv_surumleri_cv_id_olusturma_index" RENAME TO "resume_versions_resume_id_created_at_index";--> statement-breakpoint
ALTER INDEX "cvler_kullanici_id_index" RENAME TO "resumes_user_id_index";--> statement-breakpoint
ALTER INDEX "dosyalar_kullanici_id_index" RENAME TO "files_user_id_index";--> statement-breakpoint
ALTER INDEX "ornek_cvler_dil_slug_index" RENAME TO "example_resumes_locale_slug_index";--> statement-breakpoint
ALTER INDEX "ornek_cvler_kategori_index" RENAME TO "example_resumes_category_index";--> statement-breakpoint
ALTER INDEX "ornek_cvler_ceviri_grubu_index" RENAME TO "example_resumes_translation_group_index";--> statement-breakpoint
ALTER INDEX "sablon_sikayetleri_sablon_id_durum_index" RENAME TO "template_reports_template_id_status_index";--> statement-breakpoint
ALTER INDEX "sablonlar_sahip_id_index" RENAME TO "templates_owner_id_index";--> statement-breakpoint
ALTER INDEX "sablonlar_gorunurluk_durum_index" RENAME TO "templates_visibility_status_index";--> statement-breakpoint
ALTER INDEX "sayfa_surumleri_sayfa_id_olusturma_index" RENAME TO "page_versions_page_id_created_at_index";--> statement-breakpoint
ALTER INDEX "sayfalar_dil_slug_index" RENAME TO "pages_locale_slug_index";--> statement-breakpoint
ALTER INDEX "sayfalar_ceviri_grubu_index" RENAME TO "pages_translation_group_index";--> statement-breakpoint
ALTER INDEX "sss_dil_kategori_index" RENAME TO "faqs_locale_category_index";--> statement-breakpoint
ALTER INDEX "yonetim_gunlugu_olusturma_index" RENAME TO "audit_log_created_at_index";--> statement-breakpoint
ALTER INDEX "yonetim_gunlugu_hedef_tur_hedef_id_index" RENAME TO "audit_log_target_type_target_id_index";--> statement-breakpoint
ALTER INDEX "rizalar_kullanici_id_tur_olusturma_index" RENAME TO "consents_user_id_kind_created_at_index";--> statement-breakpoint
ALTER TABLE "user" RENAME CONSTRAINT "user_kullaniciAdi_unique" TO "user_username_unique";--> statement-breakpoint
ALTER TABLE "files" RENAME CONSTRAINT "dosyalar_anahtar_unique" TO "files_key_unique";--> statement-breakpoint
ALTER TABLE "media" RENAME CONSTRAINT "medya_anahtar_unique" TO "media_key_unique";--> statement-breakpoint
ALTER TABLE "ad_slots" RENAME CONSTRAINT "reklam_alanlari_kod_unique" TO "ad_slots_code_unique";--> statement-breakpoint
ALTER TABLE "redirects" RENAME CONSTRAINT "yonlendirmeler_kaynak_unique" TO "redirects_source_unique";--> statement-breakpoint
ALTER TABLE "template_favorites" RENAME CONSTRAINT "sablon_favorileri_sablon_id_kullanici_id_pk" TO "template_favorites_template_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "template_ratings" RENAME CONSTRAINT "sablon_puanlari_sablon_id_kullanici_id_pk" TO "template_ratings_template_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "site_settings" RENAME CONSTRAINT "site_ayarlari_tek_satir" TO "site_settings_single_row";--> statement-breakpoint
UPDATE "user" SET "role" = CASE "role" WHEN 'kullanici' THEN 'user' WHEN 'yonetici' THEN 'admin' END WHERE "role" IN ('kullanici', 'yonetici');--> statement-breakpoint
UPDATE "resumes" SET "status" = CASE "status" WHEN 'taslak' THEN 'draft' WHEN 'aktif' THEN 'active' WHEN 'arsiv' THEN 'archived' END WHERE "status" IN ('taslak', 'aktif', 'arsiv');--> statement-breakpoint
UPDATE "resume_versions" SET "kind" = CASE "kind" WHEN 'otomatik' THEN 'auto' WHEN 'elle' THEN 'manual' END WHERE "kind" IN ('otomatik', 'elle');--> statement-breakpoint
UPDATE "example_resumes" SET "experience_level" = CASE "experience_level" WHEN 'yeni-mezun' THEN 'entry' WHEN 'orta' THEN 'mid' WHEN 'kidemli' THEN 'senior' END WHERE "experience_level" IN ('yeni-mezun', 'orta', 'kidemli');--> statement-breakpoint
UPDATE "templates" SET "visibility" = CASE "visibility" WHEN 'ozel' THEN 'private' WHEN 'baglanti' THEN 'unlisted' WHEN 'herkese_acik' THEN 'public' END WHERE "visibility" IN ('ozel', 'baglanti', 'herkese_acik');--> statement-breakpoint
UPDATE "templates" SET "status" = CASE "status" WHEN 'aktif' THEN 'active' WHEN 'incelemede' THEN 'under_review' WHEN 'gizlendi' THEN 'hidden' END WHERE "status" IN ('aktif', 'incelemede', 'gizlendi');--> statement-breakpoint
UPDATE "template_reports" SET "status" = CASE "status" WHEN 'acik' THEN 'open' WHEN 'kapandi' THEN 'closed' END WHERE "status" IN ('acik', 'kapandi');--> statement-breakpoint
UPDATE "consents" SET "kind" = CASE "kind" WHEN 'isveren_paylasimi' THEN 'employer_sharing' END WHERE "kind" IN ('isveren_paylasimi');--> statement-breakpoint
UPDATE "consents" SET "source" = CASE "source" WHEN 'kayit' THEN 'sign_up' WHEN 'panel' THEN 'dashboard' WHEN 'indirme' THEN 'download' END WHERE "source" IN ('kayit', 'panel', 'indirme');--> statement-breakpoint
UPDATE "pages" SET "kind" = CASE "kind" WHEN 'sabit' THEN 'static' WHEN 'rehber' THEN 'guide' WHEN 'yasal' THEN 'legal' END WHERE "kind" IN ('sabit', 'rehber', 'yasal');--> statement-breakpoint
UPDATE "pages" SET "translation_status" = CASE "translation_status" WHEN 'makine' THEN 'machine' WHEN 'gozden_gecirildi' THEN 'reviewed' END WHERE "translation_status" IN ('makine', 'gozden_gecirildi');--> statement-breakpoint
UPDATE "pages" SET "status" = CASE "status" WHEN 'taslak' THEN 'draft' WHEN 'yayinda' THEN 'published' WHEN 'zamanlanmis' THEN 'scheduled' WHEN 'arsiv' THEN 'archived' END WHERE "status" IN ('taslak', 'yayinda', 'zamanlanmis', 'arsiv');--> statement-breakpoint
UPDATE "pages" SET "slug" = CASE "slug" WHEN 'ana-sayfa' THEN 'home' WHEN 'ucretsiz-mi' THEN 'is-it-free' WHEN 'destek' THEN 'support' WHEN 'gizlilik' THEN 'privacy' END WHERE "slug" IN ('ana-sayfa', 'ucretsiz-mi', 'destek', 'gizlilik');--> statement-breakpoint
UPDATE "ad_slots" SET "provider" = CASE "provider" WHEN 'ozel' THEN 'custom' WHEN 'kapali' THEN 'off' END WHERE "provider" IN ('ozel', 'kapali');--> statement-breakpoint
UPDATE "audit_log" SET "action" = CASE "action" WHEN 'taslak_kaydet' THEN 'save_draft' WHEN 'yayinla' THEN 'publish' WHEN 'surume_don' THEN 'restore_version' WHEN 'site_ayarlari' THEN 'update_site_settings' WHEN 'rol_degistir' THEN 'change_role' END WHERE "action" IN ('taslak_kaydet', 'yayinla', 'surume_don', 'site_ayarlari', 'rol_degistir');--> statement-breakpoint
UPDATE "audit_log" SET "target_type" = CASE "target_type" WHEN 'sayfa' THEN 'page' WHEN 'site_ayarlari' THEN 'site_settings' WHEN 'kullanici' THEN 'user' END WHERE "target_type" IN ('sayfa', 'site_ayarlari', 'kullanici');--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "resumes" ALTER COLUMN "status" SET DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE "templates" ALTER COLUMN "visibility" SET DEFAULT 'private';--> statement-breakpoint
ALTER TABLE "templates" ALTER COLUMN "status" SET DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "template_reports" ALTER COLUMN "status" SET DEFAULT 'open';--> statement-breakpoint
ALTER TABLE "pages" ALTER COLUMN "translation_status" SET DEFAULT 'reviewed';--> statement-breakpoint
ALTER TABLE "pages" ALTER COLUMN "status" SET DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE "ad_slots" ALTER COLUMN "provider" SET DEFAULT 'off';