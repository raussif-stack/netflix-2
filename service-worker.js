/* NETFLIX 2% — Service Worker | 1.28.1 BETA */
const CACHE_PREFIX = "netflix2-shell-";
const CACHE_VERSION = "1.28.1";
const CACHE_NAME = `${CACHE_PREFIX}${CACHE_VERSION}`;
const HOME_URL = "/index.html";
const OFFLINE_URL = "/offline.html";

// Arquivos essenciais. Cada recurso é armazenado individualmente para que
// uma imagem ou rota indisponível não invalide todo o cache do aplicativo.
const APP_SHELL = [
  HOME_URL,
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
  "/js/pwa.js",
  "/manifest.json",
  OFFLINE_URL,
  "/assets/icons/icon-192.png",
  "/assets/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);

    // A página inicial é o único recurso obrigatório para concluir a
    // instalação do cache. Sem ela, não há fallback funcional para o app.
    const homeResponse = await fetch(HOME_URL, { cache: "reload" });
    if (!homeResponse.ok) {
      throw new Error(`Não foi possível armazenar ${HOME_URL}: HTTP ${homeResponse.status}`);
    }
    await cache.put(HOME_URL, homeResponse.clone());

    // Recursos secundários são tentados individualmente. Uma falha isolada
    // não impede o aplicativo de abrir nem de manter a página inicial em cache.
    await Promise.allSettled(APP_SHELL.filter((url) => url !== HOME_URL).map(async (url) => {
      const response = await fetch(url, { cache: "reload" });
      if (response.ok) await cache.put(url, response.clone());
    }));

    // Ativa esta versão sem deixar uma atualização aguardando indefinidamente.
    await self.skipWaiting();
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

  // Não armazenar vídeos ou arquivos de mídia grandes.
  if (/\.(mp4|webm|mov|mp3|m4a|wav)$/i.test(url.pathname)) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const contentType = response.headers.get("content-type") || "";
          if (contentType.includes("text/html")) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, response.clone());
          }
          return response;
        }
      } catch (error) {
        // Sem conexão: tenta a rota solicitada e depois a página inicial.
      }

      const cachedPage = await caches.match(request, { ignoreSearch: true });
      if (cachedPage) return cachedPage;

      const cachedHome = await caches.match(HOME_URL);
      if (cachedHome) return cachedHome;

      const offlinePage = await caches.match(OFFLINE_URL);
      if (offlinePage) return offlinePage;

      return new Response("<h1>NETFLIX 2%</h1><p>Conecte-se à internet para abrir o aplicativo pela primeira vez.</p>", {
        status: 503,
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    })());
    return;
  }

  // Recursos locais: cache primeiro e rede como alternativa.
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response && response.ok && response.type === "basic") {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
      }
      return response;
    } catch {
      return Response.error();
    }
  })());
});
