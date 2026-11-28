const seriesGrid = document.querySelector("#seriesGrid");
const searchInput = document.querySelector("#searchInput");
const searchForm = document.querySelector("#searchForm");
const emptyMessage = document.querySelector("#emptyMessage");
const catalogCount = document.querySelector("#catalogCount");
const dialog = document.querySelector("#seriesDialog");
const categoryFilters = document.querySelector("#categoryFilters");
const availabilityFilter = document.querySelector("#availabilityFilter");
const advancedSearch = document.querySelector("#advancedSearch");
const searchTypeFilter = document.querySelector("#searchTypeFilter");
const searchCategoryFilter = document.querySelector("#searchCategoryFilter");
const searchAvailabilityFilter = document.querySelector("#searchAvailabilityFilter");
const searchSortFilter = document.querySelector("#searchSortFilter");
let categoriaAtiva = "TODAS";
let categoriasColecaoAtiva = null;
const CHAVE_FAVORITOS = "netflix2-favorite-series-v1";
let mostrarSomenteFavoritas = false;
function lerFavoritos() {
  try {
    const valor = JSON.parse(localStorage.getItem(CHAVE_FAVORITOS) || "[]");
    return Array.isArray(valor) ? valor.filter((id) => typeof id === "string") : [];
  } catch { return []; }
}
function salvarFavoritos(ids) {
  localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify([...new Set(ids)]));
}
function alternarFavorito(serieId) {
  const favoritos = lerFavoritos();
  salvarFavoritos(favoritos.includes(serieId) ? favoritos.filter((id) => id !== serieId) : [...favoritos, serieId]);
  atualizarInterfaceFavoritos();
}
function atualizarInterfaceFavoritos() {
  document.querySelectorAll("[data-favorite-id]").forEach((botao) => {
    const ativo = lerFavoritos().includes(botao.dataset.favoriteId);
    botao.classList.toggle("is-favorite", ativo);
    botao.setAttribute("aria-pressed", String(ativo));
    botao.setAttribute("aria-label", ativo ? "Remover dos favoritos" : "Adicionar aos favoritos");
    botao.title = ativo ? "Remover dos favoritos" : "Adicionar aos favoritos";
    botao.textContent = ativo ? "♥" : "♡";
  });
  renderizarFavoritos();
  renderizarRecomendacoes();
}

function obterEpisodiosDaSerie(serie) {
  return (serie.temporadas || []).flatMap((temporada) => temporada.episodios || []);
}

function atualizarPanorama() {
  const episodios = catalogo.flatMap(obterEpisodiosDaSerie);
  const videos = episodios.filter((episodio) => String(episodio.youtubeId || "").trim()).length;
  document.querySelector("#overviewSeries").textContent = String(catalogo.length).padStart(2, "0");
  document.querySelector("#overviewEpisodes").textContent = String(episodios.length).padStart(2, "0");
  document.querySelector("#overviewAvailable").textContent = String(videos).padStart(2, "0");
}

function renderizarFiltrosCategorias() {
  const categorias = [...new Set(catalogo.map((serie) => serie.categoria).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "pt-BR"));
  const opcoes = ["TODAS", ...categorias, "__FAVORITAS__"];
  categoryFilters.innerHTML = "";
  if (searchCategoryFilter) {
    const valorAtual = searchCategoryFilter.value || "all";
    searchCategoryFilter.innerHTML = '<option value="all">Todas as categorias</option>';
    categorias.forEach((categoria) => {
      const opcao = document.createElement("option");
      opcao.value = categoria;
      opcao.textContent = categoria;
      searchCategoryFilter.appendChild(opcao);
    });
    searchCategoryFilter.value = categorias.includes(valorAtual) ? valorAtual : "all";
  }
  opcoes.forEach((categoria) => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "category-chip";
    botao.textContent = categoria === "TODAS" ? "Todas as séries" : categoria === "__FAVORITAS__" ? "♥ Favoritas" : categoria;
    botao.dataset.category = categoria;
    botao.setAttribute("aria-pressed", String(categoria === categoriaAtiva));
    botao.addEventListener("click", () => {
      categoriaAtiva = categoria;
      categoriasColecaoAtiva = null;
      mostrarSomenteFavoritas = categoria === "__FAVORITAS__";
      searchInput.value = "";
      renderizarFiltrosCategorias();
      renderizarSeries(categoria === "TODAS" || categoria === "__FAVORITAS__"
        ? catalogo
        : catalogo.filter((serie) => serie.categoria === categoria));
    });
    categoryFilters.appendChild(botao);
  });
}

// 1.24.0 — coleções são agrupamentos de categorias existentes no catálogo.
// Os cards e as contagens são montados dinamicamente; nenhuma série é duplicada.
const definicoesColecoes = [
  {
    id: "desenvolvimento-autoconhecimento",
    titulo: "Desenvolvimento e autoconhecimento",
    descricao: "Conteúdos sobre escolhas, hábitos, disciplina e transformação pessoal.",
    categorias: ["DESENVOLVIMENTO PESSOAL", "AUTOCONHECIMENTO"]
  },
  {
    id: "reflexoes-conhecimento",
    titulo: "Reflexões e conhecimento",
    descricao: "Ideias, conversas e perspectivas para ampliar o olhar sobre diferentes assuntos.",
    categorias: ["REFLEXÕES E CONHECIMENTO"]
  },
  {
    id: "lives-transmissoes",
    titulo: "Lives e transmissões",
    descricao: "Encontros, conversas e transmissões reunidos em um só lugar.",
    categorias: ["LIVES E TRANSMISSÕES"]
  }
];

function aplicarFiltroCategorias(categorias, rotulo) {
  searchInput.value = "";
  mostrarSomenteFavoritas = false;
  categoriasColecaoAtiva = [...categorias];
  categoriaAtiva = rotulo || "__COLECAO__";
  renderizarFiltrosCategorias();
  const permitidas = new Set(categorias);
  renderizarSeries(catalogo.filter((serie) => permitidas.has(serie.categoria)));
  document.querySelector("#series").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderizarDescoberta() {
  const gradeCategorias = document.querySelector("#discoveryCategories");
  const gradeColecoes = document.querySelector("#collectionsGrid");
  const contador = document.querySelector("#discoveryCount");
  if (!gradeCategorias || !gradeColecoes || !contador) return;

  const categorias = [...new Set(catalogo.map((serie) => serie.categoria).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "pt-BR"));
  gradeCategorias.innerHTML = "";
  categorias.forEach((categoria) => {
    const seriesDaCategoria = catalogo.filter((serie) => serie.categoria === categoria);
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "discovery-category";
    botao.setAttribute("aria-label", `Ver ${seriesDaCategoria.length} série(s) da categoria ${categoria}`);
    const nome = document.createElement("strong");
    nome.textContent = categoria;
    const quantidade = document.createElement("span");
    quantidade.textContent = `${String(seriesDaCategoria.length).padStart(2, "0")} ${seriesDaCategoria.length === 1 ? "SÉRIE" : "SÉRIES"}`;
    const acao = document.createElement("small");
    acao.textContent = "EXPLORAR ↗";
    botao.append(nome, quantidade, acao);
    botao.addEventListener("click", () => aplicarFiltroCategorias([categoria], categoria));
    gradeCategorias.appendChild(botao);
  });

  gradeColecoes.innerHTML = "";
  let totalColecoesExibidas = 0;
  definicoesColecoes.forEach((colecao) => {
    const seriesDaColecao = catalogo.filter((serie) => colecao.categorias.includes(serie.categoria));
    if (!seriesDaColecao.length) return;
    totalColecoesExibidas++;
    const card = document.createElement("article");
    card.className = "collection-card";
    const mosaico = document.createElement("div");
    mosaico.className = "collection-artwork";
    mosaico.setAttribute("aria-hidden", "true");
    seriesDaColecao.slice(0, 3).forEach((serie) => {
      const imagem = document.createElement("img");
      imagem.src = serie.capa;
      imagem.alt = "";
      imagem.loading = "lazy";
      imagem.addEventListener("error", () => {
        if (serie.capaFallback && imagem.dataset.fallback !== "used") {
          imagem.dataset.fallback = "used";
          imagem.src = serie.capaFallback;
        }
      }, { once: true });
      mosaico.appendChild(imagem);
    });
    const conteudo = document.createElement("div");
    conteudo.className = "collection-content";
    const etiqueta = document.createElement("span");
    etiqueta.className = "collection-kicker";
    etiqueta.textContent = "COLEÇÃO";
    const titulo = document.createElement("h3");
    titulo.textContent = colecao.titulo;
    const descricao = document.createElement("p");
    descricao.textContent = colecao.descricao;
    const categoriasTexto = document.createElement("small");
    categoriasTexto.textContent = [...new Set(seriesDaColecao.map((serie) => serie.categoria))].join(" · ");
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "collection-action";
    botao.textContent = `VER ${seriesDaColecao.length} ${seriesDaColecao.length === 1 ? "SÉRIE" : "SÉRIES"} ↗`;
    botao.addEventListener("click", () => aplicarFiltroCategorias(colecao.categorias, colecao.id));
    conteudo.append(etiqueta, titulo, descricao, categoriasTexto, botao);
    card.append(mosaico, conteudo);
    gradeColecoes.appendChild(card);
  });
  contador.textContent = `${categorias.length} CATEGORIAS · ${totalColecoesExibidas} COLEÇÕES`;
}

function abrirInformacoes(serie) {
  document.querySelector("#dialogTitle").textContent = serie.titulo;
  document.querySelector("#dialogDescription").textContent = serie.descricao;
  dialog.showModal();
}

function abrirPaginaSerie(serie) {
  window.location.href = `pages/serie.html?id=${encodeURIComponent(serie.id)}`;
}

function renderizarSeries(lista) {
  seriesGrid.innerHTML = "";
  const disponibilidade = normalizarTexto(searchInput.value) ? "all" : (availabilityFilter?.value || "all");
  const favoritosAtuais = lerFavoritos();
  const listaFiltrada = lista.filter((serie) => {
    if (mostrarSomenteFavoritas && !favoritosAtuais.includes(serie.id)) return false;
    const totalVideos = obterEpisodiosDaSerie(serie).filter((ep) => String(ep.youtubeId || "").trim()).length;
    if (disponibilidade === "available") return totalVideos > 0;
    if (disponibilidade === "unavailable") return totalVideos === 0;
    return true;
  });

  listaFiltrada.forEach((serie) => {
    const posicaoNoCatalogo = catalogo.indexOf(serie) + 1;
    const numeroExibido = String(posicaoNoCatalogo).padStart(2, "0");
    const totalSeries = String(catalogo.length).padStart(2, "0");
    const card = document.createElement("article");
    card.className = "series-card";
    card.innerHTML = `
      <img class="card-poster is-loading" src="${serie.capa}" alt="" loading="lazy">
      <span class="card-number">${numeroExibido} / ${totalSeries}</span>
      <button class="favorite-toggle" type="button" data-favorite-id="${serie.id}" aria-pressed="${favoritosAtuais.includes(serie.id)}" aria-label="${favoritosAtuais.includes(serie.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}" title="${favoritosAtuais.includes(serie.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}">${favoritosAtuais.includes(serie.id) ? "♥" : "♡"}</button>
      <div class="card-content">
        <p class="card-category">${serie.categoria}</p>
        <h3>${serie.titulo}</h3>
        <p>${serie.descricao}</p>
        <p class="card-catalog-meta">${obterEpisodiosDaSerie(serie).length} episódios · ${obterEpisodiosDaSerie(serie).filter((ep) => String(ep.youtubeId || "").trim()).length} vídeos cadastrados</p>
        <button class="card-action" type="button">VER SÉRIE&nbsp; ↗</button>
      </div>
    `;
    const poster = card.querySelector(".card-poster");
    poster.addEventListener("load", () => poster.classList.remove("is-loading"));
    poster.addEventListener("error", () => {
      poster.classList.remove("is-loading");
      if (poster.dataset.fallbackUsed !== "true" && serie.capaFallback) {
        poster.dataset.fallbackUsed = "true";
        poster.classList.add("is-loading");
        poster.src = serie.capaFallback;
      }
    });
    card.querySelector(".card-action").addEventListener("click", () => abrirPaginaSerie(serie));
    card.querySelector(".favorite-toggle").addEventListener("click", (event) => { event.stopPropagation(); alternarFavorito(serie.id); });
    seriesGrid.appendChild(card);
  });

  const emPesquisa = Boolean(normalizarTexto(searchInput.value));
  categoryFilters.hidden = emPesquisa;
  seriesGrid.classList.toggle("is-carousel", !emPesquisa);
  document.querySelector(".series-carousel").classList.toggle("search-mode", emPesquisa);
  const filtroDisponibilidade = document.querySelector(".availability-filter");
  if (filtroDisponibilidade) filtroDisponibilidade.hidden = emPesquisa;
  document.querySelector("#seriesPrevious").hidden = emPesquisa || listaFiltrada.length < 2;
  document.querySelector("#seriesNext").hidden = emPesquisa || listaFiltrada.length < 2;
  seriesGrid.scrollLeft = 0;
  requestAnimationFrame(atualizarEstadoSetasCarrossel);
  emptyMessage.textContent = mostrarSomenteFavoritas ? "Você ainda não adicionou séries aos favoritos." : "Nenhuma série encontrada. Tente outro termo.";
  emptyMessage.hidden = listaFiltrada.length !== 0;
  catalogCount.textContent = `${String(listaFiltrada.length).padStart(2, "0")} TÍTULOS`;
  atualizarInterfaceBotoesFavoritos();
}

function atualizarInterfaceBotoesFavoritos() {
  const ids = lerFavoritos();
  document.querySelectorAll(".favorite-toggle").forEach((botao) => {
    const ativo = ids.includes(botao.dataset.favoriteId);
    botao.classList.toggle("is-favorite", ativo);
    botao.setAttribute("aria-pressed", String(ativo));
    botao.setAttribute("aria-label", ativo ? "Remover dos favoritos" : "Adicionar aos favoritos");
    botao.title = ativo ? "Remover dos favoritos" : "Adicionar aos favoritos";
    botao.textContent = ativo ? "♥" : "♡";
  });
}
function renderizarFavoritos() {
  const secao = document.querySelector("#favoritos");
  const grade = document.querySelector("#favoritesGrid");
  const vazio = document.querySelector("#favoritesEmpty");
  const ids = lerFavoritos();
  const favoritas = catalogo.filter((serie) => ids.includes(serie.id));
  grade.innerHTML = "";
  favoritas.forEach((serie) => {
    const card = document.createElement("article");
    card.className = "favorite-series-card";
    const imagem = document.createElement("img");
    imagem.src = serie.capa; imagem.alt = `Capa de ${serie.titulo}`; imagem.loading = "lazy";
    const info = document.createElement("div"); info.className = "favorite-series-info";
    const titulo = document.createElement("strong"); titulo.textContent = serie.titulo;
    const categoria = document.createElement("span"); categoria.textContent = serie.categoria;
    const abrir = document.createElement("a"); abrir.href = `pages/serie.html?id=${encodeURIComponent(serie.id)}`; abrir.textContent = "VER SÉRIE ↗";
    const remover = document.createElement("button"); remover.type = "button"; remover.className = "favorite-remove"; remover.textContent = "♥ Remover";
    remover.addEventListener("click", () => alternarFavorito(serie.id));
    info.append(titulo, categoria, abrir, remover); card.append(imagem, info); grade.appendChild(card);
  });
  secao.hidden = favoritas.length === 0;
  vazio.hidden = favoritas.length !== 0;
  document.querySelector("#favoritesCount").textContent = `${String(favoritas.length).padStart(2, "0")} SÉRIE${favoritas.length === 1 ? "" : "S"}`;
}

const serieDestaque = catalogo.find((serie) => serie.destaque) || catalogo[0];
const hero = document.querySelector(".hero");
const heroBanner = document.querySelector("#heroBanner");
if (heroBanner) heroBanner.src = serieDestaque.banner;
document.querySelector("#heroCategory").textContent = serieDestaque.categoria;
document.querySelector("#heroTitle").textContent = serieDestaque.titulo;
document.querySelector("#heroDescription").textContent = serieDestaque.descricao;
const episodiosDestaque = obterEpisodiosDaSerie(serieDestaque);
const videosDestaque = episodiosDestaque.filter((episodio) => String(episodio.youtubeId || "").trim()).length;
document.querySelector("#heroMeta").textContent = `${episodiosDestaque.length} episódios  ·  ${videosDestaque} vídeos cadastrados`;
document.querySelector("#heroDetailsButton").addEventListener("click", () => abrirPaginaSerie(serieDestaque));
document.querySelector("#heroInfoButton").addEventListener("click", () => abrirInformacoes(serieDestaque));

function obterTituloPersonalizado(episodio) {
  const texto = (episodio.descricao || "").trim();
  if (!texto || texto === "Descrição do episódio será adicionada.") return "";
  return texto;
}

// Padroniza acentos, caixa, espaços e pontuação antes de comparar os textos.
function normalizarTexto(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

// Distância de Levenshtein: quantidade mínima de inserções, remoções ou trocas
// necessárias para transformar uma palavra em outra.
function distanciaEdicao(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  if (Math.abs(a.length - b.length) > 2) return 3;

  let anterior = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const atual = [i];
    for (let j = 1; j <= b.length; j++) {
      atual[j] = Math.min(
        atual[j - 1] + 1,
        anterior[j] + 1,
        anterior[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    anterior = atual;
  }
  return anterior[b.length];
}

function pontuarPalavra(consulta, palavra) {
  if (!consulta || !palavra) return 0;
  if (palavra === consulta) return 12;
  if (palavra.startsWith(consulta) || consulta.startsWith(palavra)) return 8;
  if (consulta.length >= 4 && palavra.includes(consulta)) return 7;
  if (consulta.length < 4) return 0;

  const distancia = distanciaEdicao(consulta, palavra);
  const limite = consulta.length <= 6 ? 1 : 2;
  if (distancia <= limite) return distancia === 1 ? 6 : 4;
  return 0;
}

function pontuarTexto(consulta, texto) {
  const alvo = normalizarTexto(texto);
  if (!consulta || !alvo) return 0;
  if (alvo.includes(consulta)) return 100 + consulta.length;

  const palavrasConsulta = normalizarTexto(consulta).split(" ").filter(Boolean);
  const palavrasAlvo = alvo.split(" ");
  if (!palavrasConsulta.length) return 0;

  let pontos = 0;
  let palavrasEncontradas = 0;

  palavrasConsulta.forEach((palavra) => {
    // Palavras muito curtas só são aceitas quando aparecem exatamente.
    const melhor = palavrasAlvo.reduce((maior, candidata) =>
      Math.max(maior, pontuarPalavra(palavra, candidata)), 0
    );
    if (melhor > 0) {
      pontos += melhor;
      palavrasEncontradas++;
    }
  });

  if (!palavrasEncontradas) return 0;

  // Em pesquisas com várias palavras, valoriza encontrar mais de uma delas.
  const proporcao = palavrasEncontradas / palavrasConsulta.length;
  if (palavrasConsulta.length > 1 && proporcao < 0.5) return 0;
  return pontos * proporcao;
}

function obterSeriesDaCategoriaAtiva() {
  if (categoriasColecaoAtiva) {
    const permitidas = new Set(categoriasColecaoAtiva);
    return catalogo.filter((serie) => permitidas.has(serie.categoria));
  }
  if (categoriaAtiva === "TODAS" || categoriaAtiva === "__FAVORITAS__") return catalogo;
  return catalogo.filter((serie) => serie.categoria === categoriaAtiva);
}

function renderizarPesquisa(termo) {
  const consulta = normalizarTexto(termo);
  const emPesquisa = Boolean(consulta);
  if (advancedSearch) advancedSearch.hidden = !emPesquisa;

  if (!emPesquisa) {
    emptyMessage.textContent = "Nenhuma série encontrada. Tente outro termo.";
    renderizarSeries(obterSeriesDaCategoriaAtiva());
    return;
  }

  const tipo = searchTypeFilter?.value || "all";
  const categoria = searchCategoryFilter?.value || "all";
  const disponibilidade = searchAvailabilityFilter?.value || "all";
  const ordenacao = searchSortFilter?.value || "relevance";
  const seriesEncontradas = catalogo
    .map((serie) => ({
      serie,
      pontuacao: pontuarTexto(consulta,
        `${serie.titulo} ${serie.categoria} ${serie.descricao}`)
    }))
    .filter((item) => item.pontuacao > 0)
    .filter(({ serie }) => categoria === "all" || serie.categoria === categoria)
    .filter(({ serie }) => {
      const totalVideos = obterEpisodiosDaSerie(serie).filter((ep) => String(ep.youtubeId || "").trim()).length;
      return disponibilidade === "all" || (disponibilidade === "available" ? totalVideos > 0 : totalVideos === 0);
    });

  const episodiosEncontrados = [];
  catalogo.forEach((serie) => {
    if (categoria !== "all" && serie.categoria !== categoria) return;
    serie.temporadas.forEach((temporada) => {
      temporada.episodios.forEach((episodio) => {
        const temVideo = Boolean(String(episodio.youtubeId || "").trim());
        if (disponibilidade === "available" && !temVideo) return;
        if (disponibilidade === "unavailable" && temVideo) return;
        const tituloPersonalizado = obterTituloPersonalizado(episodio);
        const identificacao = episodio.titulo || `Episódio ${String(episodio.numero).padStart(3, "0")}`;
        const numeroFormatado = String(episodio.numero).padStart(3, "0");
        const pontuacaoTitulo = pontuarTexto(consulta, tituloPersonalizado);
        const pontuacaoIdentificacao = pontuarTexto(consulta, `${identificacao} ${numeroFormatado}`);
        const pontuacaoSerie = pontuarTexto(consulta, serie.titulo);
        const pontuacao = Math.max(pontuacaoTitulo, pontuacaoIdentificacao) +
          (pontuacaoTitulo > 0 ? 5 : 0) + (pontuacaoSerie > 0 ? 2 : 0);
        if (pontuacao > 0) episodiosEncontrados.push({ serie, temporada, episodio, tituloPersonalizado, pontuacao });
      });
    });
  });

  if (ordenacao === "alphabetical") {
    seriesEncontradas.sort((a, b) => a.serie.titulo.localeCompare(b.serie.titulo, "pt-BR"));
    episodiosEncontrados.sort((a, b) =>
      a.serie.titulo.localeCompare(b.serie.titulo, "pt-BR") ||
      (a.tituloPersonalizado || a.episodio.titulo || "").localeCompare(b.tituloPersonalizado || b.episodio.titulo || "", "pt-BR") ||
      a.episodio.numero - b.episodio.numero
    );
  } else if (ordenacao === "episodes") {
    seriesEncontradas.sort((a, b) => obterEpisodiosDaSerie(b.serie).length - obterEpisodiosDaSerie(a.serie).length || b.pontuacao - a.pontuacao);
    episodiosEncontrados.sort((a, b) =>
      obterEpisodiosDaSerie(b.serie).length - obterEpisodiosDaSerie(a.serie).length ||
      a.serie.titulo.localeCompare(b.serie.titulo, "pt-BR") || a.episodio.numero - b.episodio.numero
    );
  } else {
    seriesEncontradas.sort((a, b) => b.pontuacao - a.pontuacao);
    episodiosEncontrados.sort((a, b) => b.pontuacao - a.pontuacao);
  }

  const exibirSeries = tipo !== "episodes" ? seriesEncontradas : [];
  const exibirEpisodios = tipo !== "series" ? episodiosEncontrados : [];
  renderizarSeries(exibirSeries.map((item) => item.serie));

  exibirEpisodios.forEach(({ serie, temporada, episodio, tituloPersonalizado }) => {
    const numero = String(episodio.numero).padStart(3, "0");
    const card = document.createElement("article");
    card.className = "search-episode-card";
    if (episodio.youtubeId) {
      const miniatura = document.createElement("img");
      miniatura.className = "search-episode-thumbnail is-loading";
      miniatura.addEventListener("load", () => miniatura.classList.remove("is-loading"), { once: true });
      miniatura.src = `https://img.youtube.com/vi/${encodeURIComponent(episodio.youtubeId)}/hqdefault.jpg`;
      miniatura.alt = "";
      miniatura.loading = "lazy";
      miniatura.addEventListener("error", () => { miniatura.hidden = true; }, { once: true });
      card.appendChild(miniatura);
    }
    const identificacao = document.createElement("span");
    identificacao.className = "search-episode-number";
    identificacao.textContent = `EPISÓDIO ${numero} · ${temporada.titulo.toUpperCase()}`;
    const nomeSerie = document.createElement("p");
    nomeSerie.className = "search-episode-series";
    nomeSerie.textContent = serie.titulo;
    const titulo = document.createElement("h3");
    titulo.textContent = tituloPersonalizado || `EPISÓDIO ${numero}`;
    const assistir = document.createElement("a");
    assistir.className = "search-episode-link";
    assistir.href = `pages/assistir.html?id=${encodeURIComponent(serie.id)}&temporada=${temporada.numero}&episodio=${episodio.numero}`;
    assistir.textContent = episodio.youtubeId ? "ASSISTIR EPISÓDIO ↗" : "VER EPISÓDIO ↗";
    card.append(nomeSerie, identificacao, titulo, assistir);
    seriesGrid.appendChild(card);
  });

  const totalResultados = exibirSeries.length + exibirEpisodios.length;
  emptyMessage.hidden = totalResultados !== 0;
  emptyMessage.textContent = "Nenhum resultado corresponde aos filtros selecionados. Tente ajustar os filtros.";
  catalogCount.textContent = `${String(totalResultados).padStart(2, "0")} RESULTADOS`;
}

[searchTypeFilter, searchCategoryFilter, searchAvailabilityFilter, searchSortFilter].forEach((controle) => {
  controle?.addEventListener("change", () => renderizarPesquisa(searchInput.value));
});

document.querySelector("#resetSearchFilters")?.addEventListener("click", () => {
  if (searchTypeFilter) searchTypeFilter.value = "all";
  if (searchCategoryFilter) searchCategoryFilter.value = "all";
  if (searchAvailabilityFilter) searchAvailabilityFilter.value = "all";
  if (searchSortFilter) searchSortFilter.value = "relevance";
  renderizarPesquisa(searchInput.value);
});

searchInput.addEventListener("input", (event) => {
  if (normalizarTexto(event.target.value)) {
    categoriaAtiva = "TODAS";
    categoriasColecaoAtiva = null;
    mostrarSomenteFavoritas = false;
    renderizarFiltrosCategorias();
  }
  renderizarPesquisa(event.target.value);
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  renderizarPesquisa(searchInput.value);
  document.querySelector("#series").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelector("#dialogClose").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

document.querySelector("#loginLink").addEventListener("click", (event) => {
  event.preventDefault();
  alert("A tela de login será desenvolvida na etapa de autenticação.");
});

document.querySelector("a[href='#favoritos']")?.addEventListener("click", () => {
  const secao = document.querySelector("#favoritos");
  if (!lerFavoritos().length) { secao.hidden = false; document.querySelector("#favoritesEmpty").hidden = false; }
});

document.querySelector("#navMinhaLista").addEventListener("click", (event) => {
  event.preventDefault();
  alert("A funcionalidade Minha lista será conectada ao perfil do usuário nas próximas etapas.");
});

atualizarPanorama();
renderizarFiltrosCategorias();
renderizarDescoberta();
renderizarSeries(catalogo);

// CARROSSEL: setas no desktop; o mesmo trilho aceita gesto de deslizar no celular.
const seriesPrevious = document.querySelector("#seriesPrevious");
const seriesNext = document.querySelector("#seriesNext");
function atualizarEstadoSetasCarrossel() {
  const limite = Math.max(0, seriesGrid.scrollWidth - seriesGrid.clientWidth);
  const emPesquisa = Boolean(normalizarTexto(searchInput.value));
  seriesPrevious.disabled = emPesquisa || seriesGrid.scrollLeft <= 2;
  seriesNext.disabled = emPesquisa || seriesGrid.scrollLeft >= limite - 2;
}
function deslocarCarrossel(direcao) {
  const card = seriesGrid.querySelector(".series-card");
  if (!card) return;
  const distancia = card.getBoundingClientRect().width + 20;
  seriesGrid.scrollBy({ left: direcao * distancia, behavior: "smooth" });
}
seriesPrevious.addEventListener("click", () => deslocarCarrossel(-1));
seriesNext.addEventListener("click", () => deslocarCarrossel(1));
seriesGrid.addEventListener("scroll", atualizarEstadoSetasCarrossel, { passive: true });
window.addEventListener("resize", atualizarEstadoSetasCarrossel);

// PROGRESSO E HISTÓRICO LOCAL: dados permanecem neste navegador/dispositivo.
const CHAVE_HISTORICO = "netflix2-watch-history";
const CHAVE_PROGRESSO = "netflix2-episode-progress-v1";
function lerHistorico() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE_HISTORICO) || "[]");
    return Array.isArray(dados) ? dados : [];
  } catch { return []; }
}
function lerMapaProgresso() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE_PROGRESSO) || "{}");
    return dados && typeof dados === "object" && !Array.isArray(dados) ? dados : {};
  } catch { return {}; }
}
function localizarEpisodio(registro) {
  const serie = catalogo.find((item) => item.id === registro.serieId);
  const temporada = serie?.temporadas.find((item) => Number(item.numero) === Number(registro.temporada));
  const episodio = temporada?.episodios.find((item) => Number(item.numero) === Number(registro.episodio));
  return serie && temporada && episodio ? { serie, temporada, episodio } : null;
}
function chaveProgresso(registro) {
  return `${registro.serieId}:${registro.temporada}:${registro.episodio}`;
}

// Recomendações locais: usa favoritos, histórico e progresso deste navegador.
// Não envia dados para servidores e não depende de cadastro/conta.
function renderizarRecomendacoes() {
  const secao = document.querySelector("#recommendations");
  const grade = document.querySelector("#recommendationsGrid");
  const contador = document.querySelector("#recommendationsCount");
  const introducao = document.querySelector("#recommendationsIntro");
  if (!secao || !grade || !contador || !introducao) return;

  const favoritos = lerFavoritos();
  const historico = lerHistorico();
  const progresso = lerMapaProgresso();
  const afinidade = new Map();
  const motivos = new Map();
  const adicionarAfinidade = (serieId, peso, motivo) => {
    const serie = catalogo.find((item) => item.id === serieId);
    if (!serie?.categoria) return;
    afinidade.set(serie.categoria, (afinidade.get(serie.categoria) || 0) + peso);
    if (!motivos.has(serie.categoria) || peso > motivos.get(serie.categoria).peso) {
      motivos.set(serie.categoria, { peso, texto: motivo });
    }
  };

  favoritos.forEach((id) => adicionarAfinidade(id, 5, "Pelo tema das suas séries favoritas"));
  historico.slice(0, 12).forEach((registro, indice) => {
    adicionarAfinidade(registro.serieId, Math.max(1, 3 - indice * 0.15), "Com base no que você assistiu recentemente");
  });
  Object.entries(progresso).forEach(([chave, dados]) => {
    if (!dados || dados.status !== "in-progress") return;
    adicionarAfinidade(chave.split(":")[0], 4, "Relacionado a um episódio que você está assistindo");
  });

  const temAtividade = afinidade.size > 0;
  const favoritasSet = new Set(favoritos);
  let candidatas = catalogo
    .filter((serie) => !favoritasSet.has(serie.id))
    .map((serie) => {
      const pontuacao = afinidade.get(serie.categoria) || 0;
      const totalVideos = obterEpisodiosDaSerie(serie).filter((ep) => String(ep.youtubeId || "").trim()).length;
      const motivo = motivos.get(serie.categoria)?.texto || (temAtividade ? "Uma opção diferente para ampliar suas descobertas" : "Destaque do catálogo para começar a explorar");
      return { serie, pontuacao, totalVideos, motivo };
    });

  // Se todas as séries já estiverem favoritedas, ainda exibe sugestões em vez de esconder a seção.
  if (!candidatas.length) {
    candidatas = catalogo.map((serie) => ({
      serie,
      pontuacao: afinidade.get(serie.categoria) || 0,
      totalVideos: obterEpisodiosDaSerie(serie).filter((ep) => String(ep.youtubeId || "").trim()).length,
      motivo: "Você já adicionou esta série aos seus favoritos"
    }));
  }

  candidatas.sort((a, b) => b.pontuacao - a.pontuacao || b.totalVideos - a.totalVideos || a.serie.titulo.localeCompare(b.serie.titulo, "pt-BR"));
  const recomendadas = candidatas.slice(0, Math.min(3, candidatas.length));
  grade.innerHTML = "";

  recomendadas.forEach(({ serie, totalVideos, motivo }) => {
    const card = document.createElement("article");
    card.className = "recommendation-card";
    const imagem = document.createElement("img");
    imagem.className = "recommendation-poster";
    imagem.src = serie.capa;
    imagem.alt = `Pôster de ${serie.titulo}`;
    imagem.loading = "lazy";
    imagem.addEventListener("error", () => {
      if (serie.capaFallback && imagem.dataset.fallback !== "used") {
        imagem.dataset.fallback = "used";
        imagem.src = serie.capaFallback;
      }
    }, { once: true });

    const conteudo = document.createElement("div");
    conteudo.className = "recommendation-content";
    const categoria = document.createElement("span");
    categoria.className = "recommendation-category";
    categoria.textContent = serie.categoria || "SÉRIE";
    const titulo = document.createElement("h3");
    titulo.textContent = serie.titulo;
    const justificativa = document.createElement("p");
    justificativa.className = "recommendation-reason";
    justificativa.textContent = motivo;
    const metadados = document.createElement("small");
    metadados.textContent = `${obterEpisodiosDaSerie(serie).length} episódios · ${totalVideos} vídeos cadastrados`;
    const abrir = document.createElement("a");
    abrir.className = "recommendation-action";
    abrir.href = `pages/serie.html?id=${encodeURIComponent(serie.id)}`;
    abrir.textContent = "EXPLORAR SÉRIE ↗";
    conteudo.append(categoria, titulo, justificativa, metadados, abrir);
    card.append(imagem, conteudo);
    grade.appendChild(card);
  });

  secao.hidden = recomendadas.length === 0;
  contador.textContent = `${String(recomendadas.length).padStart(2, "0")} SUGESTÕES`;
  introducao.textContent = temAtividade
    ? "As sugestões consideram suas séries favoritas, episódios reproduzidos e conteúdos em andamento."
    : "Comece a explorar: as sugestões iniciais destacam conteúdos disponíveis no catálogo. Elas ficam mais relevantes conforme você usa a plataforma.";
}
function formatarTempoHome(segundos) {
  const total = Math.max(0, Math.floor(Number(segundos) || 0));
  const h = Math.floor(total / 3600), m = Math.floor((total % 3600) / 60), s = total % 60;
  return h ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
}
function criarCartaoHistorico(registro, progresso, modo = "recent") {
  const item = localizarEpisodio(registro);
  if (!item) return null;
  const { serie, temporada, episodio } = item;
  const card = document.createElement("article");
  card.className = `history-entry${modo === "continue" ? " history-entry-continue" : ""}`;

  const link = document.createElement("a");
  link.className = `history-card${modo === "continue" ? " history-card-continue" : ""}`;
  const continuarDireto = modo === "continue" && progresso?.status !== "completed";
  link.href = `pages/assistir.html?id=${encodeURIComponent(serie.id)}&temporada=${temporada.numero}&episodio=${episodio.numero}${continuarDireto ? "&autoplay=1" : ""}`;

  const idVideo = String(episodio.youtubeId || "").trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(idVideo)) {
    const imagem = document.createElement("img");
    imagem.src = `https://img.youtube.com/vi/${idVideo}/hqdefault.jpg`;
    imagem.alt = ""; imagem.loading = "lazy"; imagem.classList.add("is-loading");
    imagem.addEventListener("load", () => imagem.classList.remove("is-loading"), { once: true });
    imagem.onerror = () => imagem.remove();
    link.appendChild(imagem);
  }

  const info = document.createElement("span"); info.className = "history-card-info";
  const serieNome = document.createElement("strong"); serieNome.textContent = serie.titulo;
  const epNome = document.createElement("span"); epNome.textContent = `${(episodio.descricao || "").trim() || episodio.titulo} · ${temporada.titulo}`;
  const detalhe = document.createElement("small");
  if (modo === "continue") {
    const duracao = Number(progresso?.duration) || 0;
    const atual = Number(progresso?.currentTime) || 0;
    const percentual = duracao > 0 ? Math.min(100, Math.max(0, atual / duracao * 100)) : 0;
    detalhe.textContent = `EM ANDAMENTO · ${formatarTempoHome(atual)}${duracao ? ` / ${formatarTempoHome(duracao)}` : ""}`;
    const trilho = document.createElement("span"); trilho.className = "home-progress-track";
    const preenchimento = document.createElement("span"); preenchimento.className = "home-progress-fill";
    preenchimento.style.width = `${percentual}%`; trilho.appendChild(preenchimento);
    info.append(serieNome, epNome, detalhe, trilho);
  } else {
    detalhe.textContent = progresso?.status === "completed" ? "EPISÓDIO CONCLUÍDO" : progresso?.status === "in-progress" ? "EM ANDAMENTO" : "REPRODUZIDO RECENTEMENTE";
    info.append(serieNome, epNome, detalhe);
  }
  link.appendChild(info);

  const remover = document.createElement("button");
  remover.type = "button";
  remover.className = "history-remove";
  remover.textContent = modo === "continue" ? "Remover progresso" : "Remover registro";
  remover.setAttribute("aria-label", `${remover.textContent}: ${serie.titulo}, ${episodio.titulo}`);
  remover.addEventListener("click", () => {
    const chave = chaveProgresso(registro);
    if (modo === "continue") {
      const mapa = lerMapaProgresso();
      delete mapa[chave];
      localStorage.setItem(CHAVE_PROGRESSO, JSON.stringify(mapa));
      const historicoAtual = lerHistorico().filter((x) => chaveProgresso(x) !== chave);
      localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(historicoAtual));
    } else {
      const historicoAtual = lerHistorico().filter((x) => chaveProgresso(x) !== chave);
      localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(historicoAtual));
    }
    renderizarHistorico();
  });
  card.append(link, remover);
  return card;
}
function renderizarHistorico() {
  const mapa = lerMapaProgresso();
  const historico = lerHistorico();
  const continueSection = document.querySelector("#continueWatching");
  const continueList = document.querySelector("#continueWatchingList");
  const continueCount = document.querySelector("#continueWatchingCount");
  const recentSection = document.querySelector("#continueExplorando");
  const recentList = document.querySelector("#historyList");
  continueList.innerHTML = ""; recentList.innerHTML = "";

  const emAndamento = Object.entries(mapa)
    .filter(([, dados]) => dados && dados.status === "in-progress")
    .map(([chave, dados]) => {
      const partes = chave.split(":");
      return { serieId: partes[0], temporada: Number(partes[1]), episodio: Number(partes[2]), ...dados };
    })
    .sort((a, b) => Number(b.atualizadoEm || 0) - Number(a.atualizadoEm || 0));
  const vistos = new Set();
  emAndamento.forEach((registro) => {
    const chave = chaveProgresso(registro); vistos.add(chave);
    const card = criarCartaoHistorico(registro, registro, "continue");
    if (card) continueList.appendChild(card);
  });
  continueSection.hidden = continueList.children.length === 0;
  continueCount.textContent = continueList.children.length ? `${continueList.children.length} EPISÓDIO${continueList.children.length === 1 ? "" : "S"}` : "";

  historico.forEach((registro) => {
    const chave = chaveProgresso(registro);
    const progresso = mapa[chave] || null;
    const card = criarCartaoHistorico(registro, progresso, "recent");
    if (card) recentList.appendChild(card);
  });
  recentSection.hidden = recentList.children.length === 0;
  renderizarRecomendacoes();
}
document.querySelector("#clearHistory").addEventListener("click", () => {
  if (!lerHistorico().length) return;
  const confirmar = window.confirm("Deseja apagar todo o histórico de episódios reproduzidos? O progresso salvo para retomar episódios será mantido.");
  if (!confirmar) return;
  localStorage.removeItem(CHAVE_HISTORICO);
  renderizarHistorico();
});
availabilityFilter?.addEventListener("change", () => {
  if (normalizarTexto(searchInput.value)) renderizarPesquisa(searchInput.value);
  else renderizarSeries(obterSeriesDaCategoriaAtiva());
});
window.addEventListener("pageshow", renderizarHistorico);
window.addEventListener("storage", (event) => {
  if ([CHAVE_HISTORICO, CHAVE_PROGRESSO].includes(event.key)) renderizarHistorico();
  if (event.key === CHAVE_FAVORITOS) { renderizarFavoritos(); atualizarInterfaceBotoesFavoritos(); renderizarRecomendacoes(); }
});
renderizarHistorico();
renderizarFavoritos();



// 1.31.0 BETA — botão flutuante para retornar ao início da página.
(() => {
  const botaoTopo = document.querySelector("#backToTop");
  if (!botaoTopo) return;

  const atualizarVisibilidadeBotaoTopo = () => {
    botaoTopo.hidden = window.scrollY < 350;
  };

  botaoTopo.addEventListener("click", () => {
    const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: movimentoReduzido ? "auto" : "smooth" });
  });

  window.addEventListener("scroll", atualizarVisibilidadeBotaoTopo, { passive: true });
  window.addEventListener("pageshow", atualizarVisibilidadeBotaoTopo);
  atualizarVisibilidadeBotaoTopo();
})();
