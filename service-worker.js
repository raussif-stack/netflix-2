const CACHE_PREFIX = "netflix2-pwa-";
const CACHE_VERSION = "v1.34.0";
const SHELL_CACHE = `${CACHE_PREFIX}shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `${CACHE_PREFIX}runtime-${CACHE_VERSION}`;

const APP_SHELL = [
  "/",
  "/index.html",
  "/pages/serie.html",
  "/pages/assistir.html",
  "/manifest.webmanifest",
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
  "/assets/icons/icon-192.png",
  "/assets/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    const resultados = await Promise.allSettled(
      APP_SHELL.map((arquivo) => cache.add(arquivo))
    );
    const falhas = resultados
      .map((resultado, indice) => ({ resultado, arquivo: APP_SHELL[indice] }))
      .filter(({ resultado }) => resultado.status === "rejected");

    if (falhas.length) {
      console.warn(
        "[NETFLIX 2%] Alguns recursos não entraram no cache inicial:",
        falhas.map(({ arquivo }) => arquivo)
      );
    }

    // Migração única da v1.33.0: ativa esta versão sem exigir ação manual.
    // Nas próximas versões, remova este skipWaiting para permitir o aviso
    // de atualização controlado pelo js/pwa.js.
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter((key) => key.startsWith(CACHE_PREFIX) && ![SHELL_CACHE, RUNTIME_CACHE].includes(key))
      .map((key) => caches.delete(key)));

    await self.clients.claim();

    // A versão anterior não possuía interface de atualização. Recarrega as
    // páginas abertas uma vez para que recebam o novo js/pwa.js.
    const clientes = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    await Promise.all(clientes.map(async (cliente) => {
      try {
        const url = new URL(cliente.url);
        if (url.origin === self.location.origin) await cliente.navigate(cliente.url);
      } catch (erro) {
        console.warn("[NETFLIX 2%] Não foi possível atualizar uma página aberta:", erro);
      }
    }));
  })());
});

// Usado pelas versões futuras, que aguardam a confirmação do usuário.
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "NETFLIX2_SKIP_WAITING") {
    self.skipWaiting();
  }
});

function isVideoRequest(request, url) {
  return request.destination === "video" ||
    /\.(mp4|webm|mov|m4v|m3u8|ts)(\?|$)/i.test(url.pathname + url.search);
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (isVideoRequest(request, url)) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(RUNTIME_CACHE);
          await cache.put(request, response.clone());
        }
        return response;
      } catch (error) {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (url.pathname.endsWith("/serie.html")) {
          const page = await caches.match("/pages/serie.html");
          if (page) return page;
        }
        if (url.pathname.endsWith("/assistir.html")) {
          const page = await caches.match("/pages/assistir.html");
          if (page) return page;
        }
        return (await caches.match("/index.html")) || new Response(
          "Você está offline e esta página ainda não foi armazenada.",
          { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } }
        );
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response && response.ok && response.type === "basic") {
        const cache = await caches.open(RUNTIME_CACHE);
        await cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      return new Response("", { status: 504, statusText: "Offline" });
    }
  })());
});
