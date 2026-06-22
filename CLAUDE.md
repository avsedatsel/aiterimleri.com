# Sanal Drone v2

Türkiye'deki emlakçılar için TKGM kadastro verisiyle parsel tanıtım videosu üreten web uygulaması. Video tamamen **tarayıcıda** (Canvas + MediaRecorder) üretilir, sunucuya yüklenmez.

## Teknik Stack
- Next.js 15 (App Router, TypeScript)
- Tailwind CSS v4 (sınıf tabanlı dark mode: `<html class="dark">`)
- MapBox GL JS (uydu + 3D terrain) — _Faz 1'de henüz eklenmedi_
- TKGM API: `cbsapi.tkgm.gov.tr` — _Faz 1'de henüz bağlanmadı_
- PWA (manifest.json + service worker)
- Neon PostgreSQL + Prisma — _Faz 1'de henüz kurulmadı_

## Kesin Kurallar
- Abacus AI KULLANMA. AWS S3 KULLANMA. Sunucuda FFmpeg KULLANMA.
- Video tarayıcıda üretilir. Kullanıcı girişi yoktur.
- Her adımı bitir, test et, sonra devam et.

## Proje Yapısı
- `src/app/layout.tsx` — kök layout, tema FOUC scripti, PWA metadata
- `src/app/page.tsx` — ana parsel ekranı
- `src/components/` — Header, ParcelForm, ThemeToggle, InstallButton, ServiceWorkerRegister
- `src/lib/provinces.ts` — 81 il listesi
- `public/manifest.json`, `public/sw.js`, `public/icons/`
- `scripts/gen-icons.mjs` — PWA ikonlarını SVG'den üreten script (`node scripts/gen-icons.mjs`)

## Komutlar
- `npm run dev` — geliştirme
- `npm run build` — üretim derlemesi
- `npm run start` — üretim sunucusu

## Durum
**Faz 1 / Adım 1 tamamlandı:** Ana sayfa, dark/light mod, PWA, mobil uyumlu tasarım, parsel formu (Sorgula → "Sorgulanıyor...").

## Form Açılış Davranışı
- İlk açılışta tüm alanlar **boş** gelir (sabit test parseli kaldırıldı).
- İl/ilçe akıllı hatırlama: `localStorage` `sd_search_history` (son 20 arama, `{il, ilce, timestamp}`).
  En sık il/ilçe kombinasyonu %70+ ise o, değilse en son kullanılan otomatik doldurulur.
- Köy/mahalle, ada, parsel her zaman boş gelir.
- Mantık: `src/lib/searchHistory.ts`.

## Test Parseli
Çanakkale / Gökçeada / Çınarlı / Ada 193 / Parsel 61 (artık elle girilir).
