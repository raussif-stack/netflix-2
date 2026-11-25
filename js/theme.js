(() => {
  const root = document.documentElement;
  const storageKey = "netflix2-theme";
  const savedTheme = (() => {
    try { return localStorage.getItem(storageKey); } catch { return null; }
  })();

  function aplicarTema(theme) {
    const tema = theme === "light" ? "light" : "dark";
    root.dataset.theme = tema;
    root.style.colorScheme = tema;
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      const icon = button.querySelector(".theme-toggle-icon");
      const label = tema === "dark" ? "Ativar modo claro" : "Ativar modo escuro";
      if (icon) icon.textContent = tema === "dark" ? "☾" : "☀";
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
      button.setAttribute("aria-pressed", String(tema === "light"));
    });
  }

  aplicarTema(savedTheme || "dark");

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const next = root.dataset.theme === "dark" ? "light" : "dark";
        aplicarTema(next);
        try { localStorage.setItem(storageKey, next); } catch { /* armazenamento indisponível */ }
      });
    });

    // Revela os elementos durante a rolagem, sem bloquear o conteúdo caso a API não exista.
    const motionOff = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (motionOff || !("IntersectionObserver" in window)) return;

    const selectors = ".hero-content, .section-heading, .series-card, .quote-strip, .series-hero-content, .episodes-heading, .episode-card, .watch-heading, .video-shell, .watch-controls";
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -35px 0px" });

    function observarElementos(scope = document) {
      scope.querySelectorAll(selectors).forEach((element) => {
        if (element.dataset.motionObserved) return;
        element.dataset.motionObserved = "true";
        element.classList.add("motion-reveal");
        observer.observe(element);
      });
    }

    observarElementos();
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          if (node.matches?.(selectors)) observarElementos(node.parentElement || document);
          else observarElementos(node);
        }
      }));
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });
  });
})();
