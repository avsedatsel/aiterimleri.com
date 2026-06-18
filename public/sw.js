// Sanal Drone — Service Worker (Faz 1: temel önbellek / çevrimdışı kabuk)
const CACHE = "sanal-drone-v1";
const APP_SHELL = ["/", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Sadece GET isteklerini ele al
  if (req.method !== "GET") return;

  // Aynı kaynaktan gelmeyen istekleri (ör. harita/dış API) doğrudan ağa bırak
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Sayfa gezintileri: önce ağ, başarısız olursa önbellek (network-first)
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match("/")))
    );
    return;
  }

  // Statik varlıklar: önce önbellek, yoksa ağ (cache-first)
  event.respondWith(
    caches.match(req).then(
      (cached) =>
        cached ||
        fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
    )
  );
});
