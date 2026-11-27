(() => {
  "use strict";

  if (!("serviceWorker" in navigator)) return;

  const script = document.currentScript;
  const scriptUrl = script && script.src
    ? new URL(script.src)
    : new URL("./js/pwa.js", location.href);
  const workerUrl = new URL("../service-worker.js", scriptUrl);
  const workerScope = new URL("../", workerUrl);
  const isLocalhost = ["localhost", "127.0.0.1"].includes(location.hostname);
  const isSecure = location.protocol === "https:" || isLocalhost;

  if (!isSecure) return;

  function showUpdateNotice(registration) {
    if (!registration.waiting || !navigator.serviceWorker.controller) return;
    if (document.getElementById("pwa-update-notice")) return;

    const notice = document.createElement("aside");
    notice.id = "pwa-update-notice";
    notice.setAttribute("role", "status");
    notice.innerHTML = `
      <span>Uma atualização da NETFLIX 2% está pronta.</span>
      <button type="button" id="pwa-update-button">ATUALIZAR</button>
      <button type="button" id="pwa-update-dismiss" aria-label="Fechar aviso">×</button>
    `;

    const style = document.createElement("style");
    style.textContent = `
      #pwa-update-notice {
        position: fixed; z-index: 99999; left: 16px; right: 16px; bottom: 16px;
        display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
        padding: 14px 16px; border: 1px solid rgba(229,9,20,.55);
        border-radius: 12px; background: #202020; color: #fff;
        box-shadow: 0 8px 30px rgba(0,0,0,.4);
        font: 14px/1.4 system-ui, sans-serif;
      }
      #pwa-update-notice span { flex: 1 1 180px; }
      #pwa-update-notice button {
        border: 0; border-radius: 7px; padding: 9px 12px;
        cursor: pointer; font-weight: 700;
      }
      #pwa-update-button { background: #e50914; color: #fff; }
      #pwa-update-dismiss { background: transparent; color: #fff; font-size: 20px; }
    `;
    document.head.appendChild(style);
    document.body.appendChild(notice);

    notice.querySelector("#pwa-update-button").addEventListener("click", () => {
      registration.waiting?.postMessage({ type: "SKIP_WAITING" });
    });
    notice.querySelector("#pwa-update-dismiss").addEventListener("click", () => notice.remove());
  }

  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    location.reload();
  });

  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register(workerUrl.href, {
        scope: workerScope.pathname,
        updateViaCache: "none"
      });

      showUpdateNotice(registration);

      registration.addEventListener("updatefound", () => {
        const installing = registration.installing;
        if (!installing) return;
        installing.addEventListener("statechange", () => {
          if (installing.state === "installed") showUpdateNotice(registration);
        });
      });

      // Check for a newer deployment when the app is opened.
      registration.update().catch(() => {});
    } catch (error) {
      console.warn("[NETFLIX 2%] Não foi possível registrar o modo offline:", error);
    }
  });
})();
