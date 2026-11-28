(() => {
  "use strict";

  if (!("serviceWorker" in navigator)) {
    console.warn("[NETFLIX 2%] Este navegador não oferece suporte ao Service Worker.");
    return;
  }

  const isLocalhost = ["localhost", "127.0.0.1"].includes(location.hostname);
  if (location.protocol !== "https:" && !isLocalhost) return;

  let recarregamentoSolicitado = false;
  let avisoCriado = false;

  function criarAvisoAtualizacao(registro) {
    if (avisoCriado || !registro.waiting) return;
    avisoCriado = true;

    const estilo = document.createElement("style");
    estilo.textContent = `
      .netflix2-update-notice {
        position: fixed; z-index: 10000; left: 50%; bottom: max(18px, env(safe-area-inset-bottom));
        transform: translateX(-50%); width: min(560px, calc(100% - 28px));
        display: flex; align-items: center; gap: 14px; padding: 16px;
        color: #fff; background: #191919; border: 1px solid rgba(255,255,255,.16);
        border-radius: 14px; box-shadow: 0 14px 42px rgba(0,0,0,.42);
        font: 500 14px/1.45 Arial, sans-serif;
      }
      .netflix2-update-notice__copy { flex: 1; min-width: 0; }
      .netflix2-update-notice__title { display: block; margin-bottom: 3px; font-weight: 700; font-size: 15px; }
      .netflix2-update-notice__actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
      .netflix2-update-notice button { min-height: 38px; padding: 8px 12px; border: 0; border-radius: 8px; font: 700 13px Arial, sans-serif; cursor: pointer; }
      .netflix2-update-notice__apply { color: #fff; background: #e50914; }
      .netflix2-update-notice__later { color: #ddd; background: #333; }
      .netflix2-update-notice button:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
      @media (max-width: 480px) {
        .netflix2-update-notice { align-items: flex-start; flex-wrap: wrap; }
        .netflix2-update-notice__copy { flex-basis: 100%; }
        .netflix2-update-notice__actions { width: 100%; justify-content: flex-end; }
      }
    `;

    const aviso = document.createElement("section");
    aviso.className = "netflix2-update-notice";
    aviso.setAttribute("role", "status");
    aviso.setAttribute("aria-live", "polite");

    const texto = document.createElement("div");
    texto.className = "netflix2-update-notice__copy";
    texto.innerHTML = '<strong class="netflix2-update-notice__title">Atualização disponível</strong><span>Uma nova versão da NETFLIX 2% está pronta. Atualize para receber as melhorias.</span>';

    const acoes = document.createElement("div");
    acoes.className = "netflix2-update-notice__actions";

    const depois = document.createElement("button");
    depois.type = "button";
    depois.className = "netflix2-update-notice__later";
    depois.textContent = "Depois";
    depois.addEventListener("click", () => aviso.remove());

    const atualizar = document.createElement("button");
    atualizar.type = "button";
    atualizar.className = "netflix2-update-notice__apply";
    atualizar.textContent = "Atualizar agora";
    atualizar.addEventListener("click", () => {
      atualizar.disabled = true;
      atualizar.textContent = "Atualizando…";
      if (registro.waiting) {
        registro.waiting.postMessage({ type: "NETFLIX2_SKIP_WAITING" });
      } else {
        registro.update().catch((erro) => {
          console.warn("[NETFLIX 2%] Não foi possível verificar a atualização:", erro);
          atualizar.disabled = false;
          atualizar.textContent = "Tentar novamente";
        });
      }
    });

    acoes.append(depois, atualizar);
    aviso.append(texto, acoes);
    document.head.appendChild(estilo);
    document.body.appendChild(aviso);
  }

  function observarInstalacao(registro) {
    if (!registro.installing) return;
    const novoWorker = registro.installing;
    novoWorker.addEventListener("statechange", () => {
      if (novoWorker.state === "installed" && navigator.serviceWorker.controller) {
        criarAvisoAtualizacao(registro);
      }
    });
  }

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (recarregamentoSolicitado) return;
    recarregamentoSolicitado = true;
    window.location.reload();
  });

  window.addEventListener("load", async () => {
    try {
      const registro = await navigator.serviceWorker.register("/service-worker.js", {
        scope: "/",
        updateViaCache: "none"
      });

      console.info("[NETFLIX 2%] PWA/Service Worker registrado. Escopo:", registro.scope);

      if (registro.waiting && navigator.serviceWorker.controller) {
        criarAvisoAtualizacao(registro);
      }

      registro.addEventListener("updatefound", () => observarInstalacao(registro));

      // Verifica no carregamento e quando o usuário retorna ao aplicativo.
      await registro.update();
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          registro.update().catch((erro) => console.warn("[NETFLIX 2%] Verificação de atualização adiada:", erro));
          if (registro.waiting) criarAvisoAtualizacao(registro);
        }
      });

      // Verificação periódica enquanto a página permanece aberta.
      window.setInterval(() => {
        if (document.visibilityState === "visible") {
          registro.update().catch((erro) => console.warn("[NETFLIX 2%] Verificação periódica falhou:", erro));
        }
      }, 60 * 60 * 1000);
    } catch (error) {
      console.error("[NETFLIX 2%] Falha ao registrar/verificar o Service Worker:", error);
    }
  }, { once: true });
})();
