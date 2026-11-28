(() => {
  "use strict";

  if (!("serviceWorker" in navigator)) {
    console.warn("[NETFLIX 2%] Este navegador não oferece suporte ao Service Worker.");
    return;
  }

  const isLocalhost = ["localhost", "127.0.0.1"].includes(location.hostname);
  if (location.protocol !== "https:" && !isLocalhost) return;

  let registroAtual = null;
  let avisoAtual = null;
  let recarregarAposAtivacao = false;
  let recargaIniciada = false;

  function injetarEstilos() {
    if (document.querySelector("#netflix2-update-style")) return;
    const estilo = document.createElement("style");
    estilo.id = "netflix2-update-style";
    estilo.textContent = `
      .netflix2-update-notice {
        position: fixed; z-index: 10000; left: 50%; bottom: max(18px, env(safe-area-inset-bottom));
        transform: translateX(-50%); width: min(560px, calc(100% - 28px));
        display: flex; align-items: center; gap: 14px; padding: 16px;
        color: #fff; background: #191919; border: 1px solid rgba(255,255,255,.16);
        border-radius: 14px; box-shadow: 0 14px 42px rgba(0,0,0,.42);
        font: 500 14px/1.45 Arial, sans-serif; box-sizing: border-box;
      }
      .netflix2-update-notice * { box-sizing: border-box; }
      .netflix2-update-notice__copy { flex: 1 1 220px; min-width: 0; }
      .netflix2-update-notice__title { display: block; margin-bottom: 3px; font-weight: 700; font-size: 15px; }
      .netflix2-update-notice__actions { display: flex; align-items: center; justify-content: flex-end; gap: 8px; flex: 0 0 auto; }
      .netflix2-update-notice button { min-height: 40px; padding: 9px 12px; border: 0; border-radius: 8px; font: 700 13px Arial, sans-serif; cursor: pointer; white-space: nowrap; }
      .netflix2-update-notice__apply { color: #fff; background: #e50914; }
      .netflix2-update-notice__later { color: #ddd; background: #333; }
      .netflix2-update-notice button:disabled { opacity: .65; cursor: wait; }
      .netflix2-update-notice button:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
      @media (max-width: 520px) {
        .netflix2-update-notice { align-items: stretch; flex-direction: column; gap: 12px; }
        .netflix2-update-notice__actions { width: 100%; }
        .netflix2-update-notice__actions button { flex: 1 1 0; }
      }
    `;
    document.head.appendChild(estilo);
  }

  function removerAviso() {
    avisoAtual?.remove();
    avisoAtual = null;
  }

  function mostrarAviso() {
    if (!registroAtual?.waiting || avisoAtual || !document.body) return;
    injetarEstilos();

    const aviso = document.createElement("section");
    aviso.className = "netflix2-update-notice";
    aviso.setAttribute("role", "region");
    aviso.setAttribute("aria-label", "Atualização disponível");

    const texto = document.createElement("div");
    texto.className = "netflix2-update-notice__copy";
    const titulo = document.createElement("strong");
    titulo.className = "netflix2-update-notice__title";
    titulo.textContent = "Atualização disponível";
    const descricao = document.createElement("span");
    descricao.textContent = "Uma nova versão da NETFLIX 2% está pronta. Atualize para receber as melhorias.";
    texto.append(titulo, descricao);

    const acoes = document.createElement("div");
    acoes.className = "netflix2-update-notice__actions";
    const depois = document.createElement("button");
    depois.type = "button";
    depois.className = "netflix2-update-notice__later";
    depois.textContent = "Depois";
    depois.addEventListener("click", removerAviso);

    const atualizar = document.createElement("button");
    atualizar.type = "button";
    atualizar.className = "netflix2-update-notice__apply";
    atualizar.textContent = "Atualizar agora";
    atualizar.addEventListener("click", () => {
      const worker = registroAtual?.waiting;
      if (!worker) {
        atualizar.disabled = true;
        atualizar.textContent = "Verificando…";
        registroAtual?.update().then(() => {
          if (registroAtual?.waiting) {
            atualizar.disabled = false;
            atualizar.textContent = "Atualizar agora";
          } else {
            atualizar.disabled = false;
            atualizar.textContent = "Tentar novamente";
          }
        }).catch((erro) => {
          console.warn("[NETFLIX 2%] Não foi possível verificar a atualização:", erro);
          atualizar.disabled = false;
          atualizar.textContent = "Tentar novamente";
        });
        return;
      }

      recarregarAposAtivacao = true;
      atualizar.disabled = true;
      depois.disabled = true;
      atualizar.textContent = "Atualizando…";

      let finalizado = false;
      const concluir = () => {
        if (finalizado) return;
        finalizado = true;
        window.clearTimeout(temporizador);
        recargaIniciada = true;
        window.location.reload();
      };
      const falhar = (motivo) => {
        if (finalizado) return;
        finalizado = true;
        window.clearTimeout(temporizador);
        recarregarAposAtivacao = false;
        console.warn("[NETFLIX 2%] A ativação do Service Worker não foi confirmada:", motivo);
        atualizar.disabled = false;
        depois.disabled = false;
        atualizar.textContent = "Tentar novamente";
      };

      // Observa o próprio worker aguardando. Assim não dependemos apenas de
      // controllerchange, que pode não chegar em alguns cenários de controle.
      const observarEstado = () => {
        if (worker.state === "activated") concluir();
        else if (worker.state === "redundant") falhar("o worker foi substituído ou descartado");
      };
      worker.addEventListener("statechange", observarEstado);

      const temporizador = window.setTimeout(() => {
        falhar(`tempo limite; estado atual: ${worker.state}`);
      }, 15000);

      if (worker.state === "activated") {
        concluir();
        return;
      }

      try {
        worker.postMessage({ type: "NETFLIX2_SKIP_WAITING" });
      } catch (erro) {
        falhar(erro);
      }
    });

    acoes.append(depois, atualizar);
    aviso.append(texto, acoes);
    document.body.appendChild(aviso);
    avisoAtual = aviso;
  }

  function observarInstalacao(registro) {
    if (!registro.installing) return;
    const novoWorker = registro.installing;
    novoWorker.addEventListener("statechange", () => {
      if (novoWorker.state === "installed" && navigator.serviceWorker.controller && registro.waiting) {
        mostrarAviso();
      }
    });
  }

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    // Não recarrega automaticamente ao detectar um worker novo. A recarga só
    // acontece depois que o usuário escolhe “Atualizar agora”.
    if (!recarregarAposAtivacao || recargaIniciada) return;
    recargaIniciada = true;
    window.location.reload();
  });

  async function verificarAtualizacao() {
    if (!registroAtual) return;
    try {
      await registroAtual.update();
      if (registroAtual.waiting) mostrarAviso();
    } catch (erro) {
      console.warn("[NETFLIX 2%] Verificação de atualização adiada:", erro);
    }
  }

  window.addEventListener("load", async () => {
    try {
      registroAtual = await navigator.serviceWorker.register("/service-worker.js", {
        scope: "/",
        updateViaCache: "none"
      });

      console.info("[NETFLIX 2%] PWA/Service Worker registrado. Escopo:", registroAtual.scope);
      registroAtual.addEventListener("updatefound", () => observarInstalacao(registroAtual));
      // Cobre também um worker que já esteja instalando quando register() resolver.
      observarInstalacao(registroAtual);

      if (registroAtual.waiting && navigator.serviceWorker.controller) mostrarAviso();
      await verificarAtualizacao();

      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") verificarAtualizacao();
      });
      window.addEventListener("pageshow", () => {
        if (document.visibilityState === "visible") verificarAtualizacao();
      });
      window.setInterval(() => {
        if (document.visibilityState === "visible") verificarAtualizacao();
      }, 60 * 60 * 1000);
    } catch (erro) {
      console.error("[NETFLIX 2%] Falha ao registrar/verificar o Service Worker:", erro);
    }
  }, { once: true });
})();
