(() => {
  "use strict";

  // O PWA só pode registrar o Service Worker em HTTPS (ou localhost).
  if (!("serviceWorker" in navigator)) {
    console.warn("[NETFLIX 2%] Este navegador não oferece suporte ao Service Worker.");
    return;
  }

  const isLocalhost = ["localhost", "127.0.0.1"].includes(location.hostname);
  if (location.protocol !== "https:" && !isLocalhost) return;

  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/service-worker.js", {
        scope: "/",
        updateViaCache: "none"
      });
      console.info("[NETFLIX 2%] PWA/Service Worker registrado. Escopo:", registration.scope);
    } catch (error) {
      console.error("[NETFLIX 2%] Falha ao registrar o Service Worker:", error);
    }
  }, { once: true });
})();
