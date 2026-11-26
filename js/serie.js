const parametros = new URLSearchParams(window.location.search);
const serieId = parametros.get("id");
const serie = catalogo.find((item) => item.id === serieId);

function caminhoDaImagem(caminho) {
  return `../${caminho}`;
}

function obterIdYoutubeParaMiniatura(valor) {
  if (!valor || typeof valor !== "string") return "";
  const texto = valor.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(texto)) return texto;
  try {
    const url = new URL(texto);
    let id = "";
    if (url.hostname === "youtu.be" || url.hostname.endsWith(".youtu.be")) {
      id = url.pathname.split("/").filter(Boolean)[0] || "";
    } else if (url.hostname.includes("youtube.com")) {
      if (url.pathname === "/watch") id = url.searchParams.get("v") || "";
      else if (url.pathname.startsWith("/embed/") || url.pathname.startsWith("/shorts/")) {
        id = url.pathname.split("/")[2] || "";
      }
    }
    return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : "";
  } catch {
    return "";
  }
}

function mostrarErro() {
  document.querySelector("#seriesTitle").textContent = "Série não encontrada";
  document.querySelector("#seriesDescription").textContent = "Não encontramos essa série no catálogo.";
  document.querySelector("#seriesCategory").textContent = "ERRO 404";
  document.querySelector("#seasonSelect").hidden = true;
  document.querySelector("#episodeEmpty").hidden = false;
  document.querySelector("#episodeEmpty").textContent = "Volte ao início e escolha uma série disponível.";
  document.title = "NETFLIX 2% | Série não encontrada";
}

function renderizarEpisodios(temporada) {
  const lista = document.querySelector("#episodeList");
  const vazio = document.querySelector("#episodeEmpty");
  lista.innerHTML = "";

  const episodios = temporada?.episodios || [];
  vazio.hidden = episodios.length > 0;

  episodios.forEach((episodio) => {
    const card = document.createElement("article");
    card.className = episodio.youtubeId ? "episode-card is-available" : "episode-card is-upcoming";
    const numero = String(episodio.numero).padStart(3, "0");
    const status = episodio.youtubeId ? "VÍDEO CADASTRADO" : "EM BREVE";

    const arte = document.createElement("div");
    arte.className = "episode-art";
    arte.setAttribute("role", "img");
    arte.setAttribute("aria-label", `Arte do ${episodio.titulo}${episodio.descricao ? `: ${episodio.descricao}` : ""}`);

    const numeroArte = document.createElement("span");
    numeroArte.className = "episode-art-number";
    numeroArte.textContent = numero;
    arte.appendChild(numeroArte);

    const selo = document.createElement("span");
    selo.className = "episode-art-label";
    selo.textContent = episodio.descricao?.trim() || `EPISÓDIO ${numero}`;
    arte.appendChild(selo);

    if (episodio.youtubeId) {
      const play = document.createElement("span");
      play.className = "episode-art-play";
      play.setAttribute("aria-hidden", "true");
      play.textContent = "▶";
      arte.appendChild(play);
    } else {
      const indisponivel = document.createElement("span");
      indisponivel.className = "episode-art-upcoming";
      indisponivel.textContent = "EM BREVE";
      arte.appendChild(indisponivel);
    }

    const info = document.createElement("div");
    info.className = "episode-info";
    const titulo = document.createElement("h3");
    titulo.textContent = episodio.titulo;
    const descricao = document.createElement("p");
    descricao.textContent = episodio.descricao || "";
    const duracao = document.createElement("span");
    duracao.className = "episode-duration";
    duracao.textContent = episodio.duracao || "Duração a definir";
    const statusEl = document.createElement("span");
    statusEl.className = "episode-status";
    statusEl.textContent = status;
    info.append(titulo, descricao, duracao, statusEl);

    const link = document.createElement("a");
    link.className = "episode-watch";
    link.href = `assistir.html?id=${encodeURIComponent(serie.id)}&temporada=${temporada.numero}&episodio=${episodio.numero}`;
    link.textContent = episodio.youtubeId ? "ASSISTIR ↗" : "VER DETALHES ↗";
    link.setAttribute("aria-label", `${status}: ${episodio.titulo}`);

    card.append(arte, info, link);

    // Tenta a melhor miniatura disponível e recua automaticamente quando o YouTube
    // não oferece a resolução solicitada para aquele vídeo.
    if (episodio.youtubeId) {
      const videoId = obterIdYoutubeParaMiniatura(episodio.youtubeId);
      if (videoId) {
        const imagem = document.createElement("img");
        imagem.className = "episode-thumbnail is-loading";
        imagem.alt = "";
        imagem.setAttribute("aria-hidden", "true");
        imagem.loading = "lazy";
        imagem.decoding = "async";
        const tamanhos = ["maxresdefault", "sddefault", "hqdefault", "mqdefault", "default"];
        let tentativa = 0;
        const carregarProxima = () => {
          if (tentativa >= tamanhos.length) {
            imagem.remove();
            arte.classList.add("thumbnail-unavailable");
            return;
          }
          imagem.src = `https://i.ytimg.com/vi/${videoId}/${tamanhos[tentativa++]}.jpg`;
        };
        imagem.addEventListener("load", () => {
          // Algumas URLs maxres retornam uma imagem-placeholder pequena (120x90).
          if (imagem.naturalWidth < 300 && tentativa < tamanhos.length) {
            carregarProxima();
            return;
          }
          imagem.classList.remove("is-loading");
          arte.classList.add("has-thumbnail");
        });
        imagem.addEventListener("error", carregarProxima);
        arte.prepend(imagem);
        carregarProxima();
        card.classList.add("has-thumbnail");
      }
    }

    lista.appendChild(card);
  });
}

if (!serie) {
  mostrarErro();
} else {
  document.title = `NETFLIX 2% | ${serie.titulo}`;
  document.querySelector("#seriesHero").style.setProperty("--series-banner", `url("${caminhoDaImagem(serie.banner)}")`);
  document.querySelector("#seriesCategory").textContent = serie.categoria;
  document.querySelector("#seriesTitle").textContent = serie.titulo;
  document.querySelector("#seriesDescription").textContent = serie.descricao;
  const totalTemporadas = serie.temporadas.length;
  const totalEpisodios = serie.temporadas.reduce((total, temporada) => total + temporada.episodios.length, 0);
  document.querySelector("#seriesMeta").textContent =
    `${totalTemporadas} ${totalTemporadas === 1 ? "temporada" : "temporadas"}  •  ${totalEpisodios} ${totalEpisodios === 1 ? "episódio" : "episódios"}`;

  const CHAVE_FAVORITOS = "netflix2-favorite-series-v1";
  const botaoFavorito = document.querySelector("#seriesFavoriteToggle");
  function obterFavoritos() {
    try { const dados = JSON.parse(localStorage.getItem(CHAVE_FAVORITOS) || "[]"); return Array.isArray(dados) ? dados : []; }
    catch { return []; }
  }
  function atualizarBotaoFavorito() {
    const ativo = obterFavoritos().includes(serie.id);
    botaoFavorito.classList.toggle("is-favorite", ativo);
    botaoFavorito.setAttribute("aria-pressed", String(ativo));
    botaoFavorito.textContent = ativo ? "♥ Remover dos favoritos" : "♡ Adicionar aos favoritos";
  }
  botaoFavorito.addEventListener("click", () => {
    const favoritos = obterFavoritos();
    const atualizados = favoritos.includes(serie.id) ? favoritos.filter((id) => id !== serie.id) : [...favoritos, serie.id];
    localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify([...new Set(atualizados)]));
    atualizarBotaoFavorito();
  });
  atualizarBotaoFavorito();

  const seletor = document.querySelector("#seasonSelect");
  const CHAVE_PROGRESSO = "netflix2-episode-progress-v1";
  function lerProgressoLocal() {
    try {
      const dados = JSON.parse(localStorage.getItem(CHAVE_PROGRESSO) || "{}");
      return dados && typeof dados === "object" && !Array.isArray(dados) ? dados : {};
    } catch { return {}; }
  }
  function obterResumoTemporada(temporada) {
    const mapa = lerProgressoLocal();
    const total = temporada.episodios.length;
    const assistidos = temporada.episodios.filter((ep) => mapa[`${serie.id}:${temporada.numero}:${ep.numero}`]?.status === "completed").length;
    const emAndamento = temporada.episodios.filter((ep) => mapa[`${serie.id}:${temporada.numero}:${ep.numero}`]?.status === "in-progress").length;
    return { total, assistidos, emAndamento, percent: total ? Math.round(assistidos / total * 100) : 0 };
  }
  function atualizarResumoTemporada(temporada) {
    const resumo = obterResumoTemporada(temporada);
    const label = document.querySelector("#seasonProgressLabel");
    const count = document.querySelector("#seasonProgressCount");
    const bar = document.querySelector("#seasonProgressBar");
    const fill = document.querySelector("#seasonProgressFill");
    if (!label || !count || !bar || !fill) return;
    label.textContent = `Progresso — ${temporada.titulo}`;
    count.textContent = `${resumo.assistidos} de ${resumo.total} episódios assistidos${resumo.emAndamento ? ` · ${resumo.emAndamento} em andamento` : ""}`;
    fill.style.width = `${resumo.percent}%`;
    bar.setAttribute("aria-valuenow", String(resumo.percent));
  }
  serie.temporadas.forEach((temporada) => {
    const opcao = document.createElement("option");
    const resumo = obterResumoTemporada(temporada);
    opcao.value = temporada.numero;
    opcao.textContent = `${temporada.titulo} · ${resumo.assistidos}/${resumo.total} assistidos`;
    seletor.appendChild(opcao);
  });

  function selecionarTemporada(numero, rolar = false) {
    const selecionada = serie.temporadas.find((temporada) => String(temporada.numero) === String(numero));
    if (!selecionada) return false;
    seletor.value = String(selecionada.numero);
    renderizarEpisodios(selecionada);
    atualizarResumoTemporada(selecionada);
    if (rolar) document.querySelector(".episodes-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return true;
  }
  seletor.addEventListener("change", () => selecionarTemporada(seletor.value));

  const temporadaInicial = parametros.get("temporada") || serie.temporadas[0]?.numero;
  if (serie.temporadas.length) selecionarTemporada(temporadaInicial);
  else document.querySelector("#episodeEmpty").hidden = false;

  const campoEpisodio = document.querySelector("#episodeJumpInput");
  const botaoIr = document.querySelector("#episodeJumpButton");
  const feedbackIr = document.querySelector("#episodeJumpFeedback");

  function irParaEpisodio() {
    const numero = Number(campoEpisodio.value);
    const temporadaAtual = serie.temporadas.find((item) => String(item.numero) === seletor.value);
    const episodioEncontrado = temporadaAtual?.episodios.find((item) => Number(item.numero) === numero);

    if (!campoEpisodio.value || !Number.isInteger(numero) || numero < 1) {
      feedbackIr.textContent = "Digite um número de episódio válido.";
      campoEpisodio.focus();
      return;
    }
    if (!episodioEncontrado) {
      feedbackIr.textContent = `O episódio ${String(numero).padStart(3, "0")} não existe em ${temporadaAtual?.titulo || "esta temporada"}.`;
      campoEpisodio.focus();
      return;
    }

    const cartoes = [...document.querySelectorAll(".episode-card")];
    const cartao = cartoes.find((item) =>
      item.querySelector(".episode-art-number")?.textContent === String(numero).padStart(3, "0")
    );
    if (!cartao) {
      feedbackIr.textContent = "Não foi possível localizar esse episódio na lista.";
      return;
    }
    feedbackIr.textContent = `Episódio ${String(numero).padStart(3, "0")} localizado.`;
    cartao.scrollIntoView({ behavior: "smooth", block: "center" });
    cartao.classList.remove("episode-highlight");
    void cartao.offsetWidth;
    cartao.classList.add("episode-highlight");
    window.setTimeout(() => cartao.classList.remove("episode-highlight"), 2200);
  }

  botaoIr.addEventListener("click", irParaEpisodio);
  campoEpisodio.addEventListener("keydown", (event) => {
    if (event.key === "Enter") irParaEpisodio();
  });
  campoEpisodio.addEventListener("input", () => { feedbackIr.textContent = ""; });
  seletor.addEventListener("change", () => { feedbackIr.textContent = ""; });
  const episodioInicial = parametros.get("episodio");
  if (episodioInicial) {
    campoEpisodio.value = episodioInicial;
    irParaEpisodio();
  }
}
