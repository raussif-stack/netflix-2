const parametros = new URLSearchParams(window.location.search);
const serieId = parametros.get("id");
const temporadaNumero = Number(parametros.get("temporada") || 1);
const episodioNumero = Number(parametros.get("episodio") || 1);
const serie = catalogo.find((item) => item.id === serieId);
const titulo = document.querySelector("#watchEpisodeTitle");
const descricao = document.querySelector("#watchEpisodeDescription");
const placeholder = document.querySelector("#videoPlaceholder");
const frame = document.querySelector("#videoFrame");
const linkVoltar = document.querySelector("#backToSeries");

function urlDoEpisodio(temporada, episodio) {
  return `assistir.html?id=${encodeURIComponent(serie.id)}&temporada=${temporada.numero}&episodio=${episodio.numero}`;
}

// Aceita tanto o ID puro quanto um link comum do YouTube, mas o recomendado é colar só o ID.
function obterIdYoutube(valor) {
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

function mostrarIndisponivel(mensagem) {
  placeholder.hidden = false;
  placeholder.querySelector("h2").textContent = mensagem;
  frame.classList.add("is-unavailable");
}

function configurarNavegacao(episodiosOrdenados, indiceAtual) {
  const anterior = document.querySelector("#previousEpisode");
  const proximo = document.querySelector("#nextEpisode");
  const atual = episodiosOrdenados[indiceAtual];

  if (indiceAtual > 0) {
    const item = episodiosOrdenados[indiceAtual - 1];
    anterior.href = urlDoEpisodio(item.temporada, item.episodio);
    anterior.hidden = false;
  }
  if (indiceAtual < episodiosOrdenados.length - 1) {
    const item = episodiosOrdenados[indiceAtual + 1];
    proximo.href = urlDoEpisodio(item.temporada, item.episodio);
    proximo.hidden = false;
  }

  document.querySelector("#episodeCounter").textContent =
    `${atual.temporada.titulo} • Episódio ${String(atual.episodio.numero).padStart(3, "0")} de ${episodiosOrdenados.length}`;
}

if (!serie) {
  document.title = "NETFLIX 2% | Série não encontrada";
  document.querySelector("#watchSeriesTitle").textContent = "SÉRIE NÃO ENCONTRADA";
  titulo.textContent = "Não foi possível localizar esta série.";
  descricao.textContent = "Volte ao início e escolha uma série do catálogo.";
  mostrarIndisponivel("SÉRIE NÃO ENCONTRADA");
  linkVoltar.href = "../index.html";
} else {
  const temporada = serie.temporadas.find((item) => item.numero === temporadaNumero);
  const episodio = temporada?.episodios.find((item) => item.numero === episodioNumero);
  linkVoltar.href = `serie.html?id=${encodeURIComponent(serie.id)}`;
  document.querySelector("#watchSeriesTitle").textContent = serie.titulo;

  if (!temporada || !episodio) {
    document.title = `NETFLIX 2% | ${serie.titulo}`;
    titulo.textContent = "Episódio não encontrado";
    descricao.textContent = "Este episódio não existe no catálogo informado.";
    mostrarIndisponivel("EPISÓDIO NÃO ENCONTRADO");
  } else {
    document.title = `NETFLIX 2% | ${episodio.titulo}`;
    titulo.textContent = episodio.titulo;
    descricao.textContent = episodio.descricao;

    const todosEpisodios = serie.temporadas.flatMap((temp) =>
      temp.episodios.map((ep) => ({ temporada: temp, episodio: ep }))
    );
    const indiceAtual = todosEpisodios.findIndex((item) =>
      item.temporada.numero === temporada.numero && item.episodio.numero === episodio.numero
    );
    configurarNavegacao(todosEpisodios, indiceAtual);

    // Registra o episódio aberto no histórico local deste navegador.
    try {
      const chaveHistorico = "netflix2-watch-history";
      let historicoAtual = [];
      try {
        historicoAtual = JSON.parse(localStorage.getItem(chaveHistorico) || "[]");
      } catch {
        historicoAtual = [];
      }
      const historicoSeguro = Array.isArray(historicoAtual)
        ? historicoAtual.filter((item) => item && typeof item === "object")
        : [];
      const novoRegistro = {
        serieId: serie.id,
        temporada: temporada.numero,
        episodio: episodio.numero,
        acessadoEm: Date.now()
      };
      const semDuplicata = historicoSeguro.filter((item) =>
        !(item.serieId === novoRegistro.serieId &&
          Number(item.temporada) === Number(novoRegistro.temporada) &&
          Number(item.episodio) === Number(novoRegistro.episodio))
      );
      localStorage.setItem(chaveHistorico, JSON.stringify([novoRegistro, ...semDuplicata].slice(0, 8)));
    } catch (erro) {
      // O player continua funcionando mesmo se o navegador bloquear o armazenamento local.
      console.warn("Não foi possível salvar o histórico local.", erro);
    }

    const videoId = obterIdYoutube(episodio.youtubeId);
    if (videoId) {
      placeholder.hidden = true;
      frame.classList.remove("is-unavailable");
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}`;
      iframe.title = `${serie.titulo} — ${episodio.titulo}`;
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.allowFullscreen = true;
      frame.appendChild(iframe);
      document.querySelector("#youtubeNote").hidden = false;
    } else {
      mostrarIndisponivel("ESTE EPISÓDIO ESTARÁ DISPONÍVEL EM BREVE");
    }
  }
}
