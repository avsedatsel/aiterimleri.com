# Sanal Drone v2

Türkiye'deki emlakçılar için TKGM kadastro verisiyle **parsel tanıtım videosu** üreten web uygulaması. Video tamamen tarayıcıda (Canvas + MediaRecorder) üretilir; sunucuya yüklenmez.

## Teknik Stack
- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS v4** — sınıf tabanlı karanlık mod (`<html class="dark">`)
- **PWA** — `manifest.json` + service worker, "Uygulamayı İndir" butonu
- MapBox GL JS, TKGM API, Neon + Prisma — _sonraki fazlarda_

## Geliştirme

```bash
npm install
npm run dev      # http://localhost:3000
```

> `predev`/`prebuild` adımı PWA ikonlarını `scripts/gen-icons.mjs` ile otomatik üretir
> (`public/icons/` git'e dahil değildir, build sırasında oluşturulur).

## Komutlar
- `npm run dev` — geliştirme sunucusu
- `npm run build` — üretim derlemesi (önce ikonları üretir)
- `npm run start` — üretim sunucusu
- `npm run gen:icons` — PWA ikonlarını elle üret

## Durum — Faz 1 / Adım 1 ✅
Ana sayfa açılışta doğrudan parsel ekranına gelir. Karanlık/aydınlık mod, mobil uyumlu premium tasarım, PWA desteği ve parsel sorgulama formu (İl, İlçe, Köy/Mahalle, Ada, Parsel) hazır. "Sorgula" butonu şimdilik "Sorgulanıyor..." durumunu gösterir.

**Test parseli:** Çanakkale / Gökçeada / Çınarlı / Ada 193 / Parsel 61
