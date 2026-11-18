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
    card.className = "episode-card";
    const numero = String(episodio.numero).padStart(3, "0");
    const status = episodio.youtubeId ? "VÍDEO CADASTRADO" : "EM BREVE";
    card.innerHTML = `
      <div class="episode-art" aria-label="Miniatura do ${episodio.titulo}">
        <span class="episode-art-number">${numero}</span>
      </div>
      <div class="episode-info">
        <h3></h3>
        <p></p>
        <span class="episode-duration"></span>
      </div>
      <a class="episode-watch" href="assistir.html?id=${encodeURIComponent(serie.id)}&temporada=${temporada.numero}&episodio=${episodio.numero}">
        ${episodio.youtubeId ? "ASSISTIR ↗" : "VER DETALHES ↗"}
      </a>
    `;

    // Quando existe um ID, carrega automaticamente a miniatura correspondente do YouTube.
    if (episodio.youtubeId) {
      const videoId = obterIdYoutubeParaMiniatura(episodio.youtubeId);
      if (videoId) {
        const imagem = document.createElement("img");
        imagem.className = "episode-thumbnail";
        imagem.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
        imagem.alt = `Miniatura de ${episodio.titulo}`;
        imagem.loading = "lazy";
        imagem.onerror = () => {
          imagem.remove();
          card.querySelector(".episode-art").classList.add("thumbnail-unavailable");
        };
        card.querySelector(".episode-art").prepend(imagem);
        card.classList.add("has-thumbnail");
      }
    }

    card.querySelector("h3").textContent = episodio.titulo;
    card.querySelector("p").textContent = episodio.descricao;
    card.querySelector(".episode-duration").textContent = episodio.duracao || "Duração a definir";
    card.querySelector(".episode-watch").setAttribute("aria-label", `${status}: ${episodio.titulo}`);
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

  const seletor = document.querySelector("#seasonSelect");
  serie.temporadas.forEach((temporada) => {
    const opcao = document.createElement("option");
    opcao.value = temporada.numero;
    opcao.textContent = temporada.titulo;
    seletor.appendChild(opcao);
  });

  seletor.addEventListener("change", () => {
    const selecionada = serie.temporadas.find((temporada) => String(temporada.numero) === seletor.value);
    renderizarEpisodios(selecionada);
  });

  if (serie.temporadas.length) renderizarEpisodios(serie.temporadas[0]);
  else document.querySelector("#episodeEmpty").hidden = false;
}
