/* NETFLIX 2% — Service Worker | 1.28.0 BETA */
const CACHE_PREFIX = "netflix2-shell-";
const CACHE_VERSION = "1.28.0";
const CACHE_NAME = `${CACHE_PREFIX}${CACHE_VERSION}`;
const OFFLINE_URL = "/offline.html";
const APP_SHELL = [
  "/",
  "/index.html",
  "/pages/serie.html",
  "/pages/assistir.html",
  "/css/global.css",
  "/css/home.css",
  "/css/serie.css",
  "/css/player.css",
  "/js/theme.js",
  "/js/catalogo.js",
  "/js/main.js",
  "/js/serie.js",
  "/js/player.js",
  "/manifest.json",
  "/offline.html",
  "/assets/icons/icon-192.png",
  "/assets/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names
      .filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
      .map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Nunca guardar vídeos ou arquivos de mídia grandes no cache do aplicativo.
  if (/\.(mp4|webm|mov|mp3|m4a|wav)$/i.test(url.pathname)) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, response.clone());
        }
        return response;
      } catch {
        return (await caches.match(request)) ||
          (await caches.match("/index.html")) ||
          (await caches.match(OFFLINE_URL));
      }
    })());
    return;
  }

  // Arquivos locais: cache primeiro para abertura rápida; atualizações entram
  // pela troca de versão do Service Worker e pela limpeza do cache anterior.
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response && response.ok && response.type === "basic") {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
      }
      return response;
    } catch {
      return Response.error();
    }
  })());
});
