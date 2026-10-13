<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Proje kuralları

- Plan ve verilen kararlar: `docs/WEB-UYGULAMA-PLANI.md`. URL yapısı ve veri modeli oradan sapmaz.
- Kod Türkçe adlandırılır (dosya, değişken, fonksiyon, tablo); Better Auth'un kendi alanları hariç.
- Veritabanı sorgusu bileşene yazılmaz; iş mantığı `src/sunucu/` altında düz fonksiyonlardır.
- Yönetim Server Action'ları `yonetimDurumu()` ile ayrıca yetki denetler; layout'a güvenilmez.
- Oturum okuyan bileşenler `<Suspense>` içinde olmalı (Cache Components).
- Şema değişince: `pnpm db:generate` → oluşan SQL'i gözden geçir → `pnpm db:migrate`.

## Tasarım kuralları

- Renkler yalnız `globals.css`'teki anlamsal token'larla (`bg-yuzey`, `text-soluk`, `text-ana-metin`…);
  her token'ın açık ve koyu değeri vardır. Bileşende ham hex yazılmaz (CV önizleme kâğıdı hariç).
- Font: Plus Jakarta Sans (`next/font`). İkonlar: `lucide-react`. Emoji ikon olarak kullanılmaz.
- Butonlar `butonSinifi()` ile (`src/bilesenler/ui/Buton.tsx`); sayfa başına tek ana CTA.
- Belirme animasyonları CSS'tedir (`.belir-yukle`, `.belir-kaydir`; `Belir`/`KademeliOge` bileşenleri) —
  JS'siz, içerik hiçbir zaman JS'e bağlı olarak gizli kalmaz. LCP öğesi (h1) animasyonsuz basılır.
- Motion (`motion/react`, `LazyMotion` + `m`) yalnız etkileşimli parçalarda: menü, önizleme geçişi.
  `layout`/`layoutId` kullanılmaz (domMax paketi gerekir). `prefers-reduced-motion` her yerde geçerli.
- Landing bölümleri `src/bloklar/` altında, içeriği prop olarak alan bileşenlerdir; Faz 1'de CMS
  blokları aynı bileşenleri besler.
