/* NETFLIX 2% — registro PWA e aviso de atualização */
(() => {
  if (!("serviceWorker" in navigator)) return;

  let recarregarAposAtualizacao = false;

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (recarregarAposAtualizacao) return;
    recarregarAposAtualizacao = true;
    window.location.reload();
  });

  function mostrarAtualizacao(registration) {
    if (document.querySelector("#pwaUpdateNotice")) return;
    const notice = document.createElement("aside");
    notice.id = "pwaUpdateNotice";
    notice.setAttribute("role", "status");
    notice.style.cssText = "position:fixed;z-index:99999;left:16px;right:16px;bottom:16px;max-width:520px;margin:auto;padding:14px 16px;background:#202020;color:#fff;border:1px solid #555;border-radius:10px;box-shadow:0 8px 30px #0008;display:flex;gap:12px;align-items:center;justify-content:space-between;font:14px system-ui";
    const message = document.createElement("span");
    message.textContent = "Uma nova versão da NETFLIX 2% está disponível.";
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "ATUALIZAR";
    button.style.cssText = "border:0;border-radius:6px;padding:10px 12px;background:#e50914;color:#fff;font-weight:700;cursor:pointer";
    button.addEventListener("click", () => {
      button.disabled = true;
      button.textContent = "ATUALIZANDO…";
      if (registration.waiting) registration.waiting.postMessage("SKIP_WAITING");
    });
    notice.append(message, button);
    document.body.appendChild(notice);
  }

  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/service-worker.js", { scope: "/" });
      if (registration.waiting && navigator.serviceWorker.controller) {
        mostrarAtualizacao(registration);
      }
      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            mostrarAtualizacao(registration);
          }
        });
      });
      // Verifica atualizações ao abrir o site, sem bloquear sua utilização.
      registration.update().catch(() => {});
    } catch (error) {
      console.warn("NETFLIX 2%: não foi possível registrar o modo offline.", error);
    }
  });
})();
