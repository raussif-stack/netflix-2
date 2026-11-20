const seriesGrid = document.querySelector("#seriesGrid");
const searchInput = document.querySelector("#searchInput");
const searchForm = document.querySelector("#searchForm");
const emptyMessage = document.querySelector("#emptyMessage");
const catalogCount = document.querySelector("#catalogCount");
const dialog = document.querySelector("#seriesDialog");

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

  lista.forEach((serie) => {
    const posicaoNoCatalogo = catalogo.indexOf(serie) + 1;
    const numeroExibido = String(posicaoNoCatalogo).padStart(2, "0");
    const totalSeries = String(catalogo.length).padStart(2, "0");
    const card = document.createElement("article");
    card.className = "series-card";
    card.innerHTML = `
      <img class="card-poster" src="${serie.capa}" alt="" loading="lazy">
      <span class="card-number">${numeroExibido} / ${totalSeries}</span>
      <div class="card-content">
        <p class="card-category">${serie.categoria}</p>
        <h3>${serie.titulo}</h3>
        <p>${serie.descricao}</p>
        <button class="card-action" type="button">VER SÉRIE&nbsp; ↗</button>
      </div>
    `;
    const poster = card.querySelector(".card-poster");
    poster.addEventListener("error", () => {
      if (poster.dataset.fallbackUsed !== "true" && serie.capaFallback) {
        poster.dataset.fallbackUsed = "true";
        poster.src = serie.capaFallback;
      }
    });
    card.querySelector("button").addEventListener("click", () => abrirPaginaSerie(serie));
    seriesGrid.appendChild(card);
  });

  emptyMessage.hidden = lista.length !== 0;
  catalogCount.textContent = `${String(lista.length).padStart(2, "0")} TÍTULOS`;
}

const serieDestaque = catalogo.find((serie) => serie.destaque) || catalogo[0];
const hero = document.querySelector(".hero");
hero.style.setProperty("--hero-image", `url("${serieDestaque.banner}")`);
const heroVideo = document.querySelector("#heroVideo");
if (heroVideo) heroVideo.poster = serieDestaque.banner;
document.querySelector("#heroCategory").textContent = serieDestaque.categoria;
document.querySelector("#heroTitle").textContent = serieDestaque.titulo;
document.querySelector("#heroDescription").textContent = serieDestaque.descricao;
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

function renderizarPesquisa(termo) {
  const consulta = normalizarTexto(termo);

  if (!consulta) {
    emptyMessage.textContent = "Nenhuma série encontrada. Tente outro termo.";
    renderizarSeries(catalogo);
    return;
  }

  const seriesEncontradas = catalogo
    .map((serie) => ({
      serie,
      pontuacao: pontuarTexto(consulta,
        `${serie.titulo} ${serie.categoria} ${serie.descricao}`)
    }))
    .filter((item) => item.pontuacao > 0)
    .sort((a, b) => b.pontuacao - a.pontuacao)
    .map((item) => item.serie);

  const episodiosEncontrados = [];
  catalogo.forEach((serie) => {
    serie.temporadas.forEach((temporada) => {
      temporada.episodios.forEach((episodio) => {
        const tituloPersonalizado = obterTituloPersonalizado(episodio);
        const identificacao = episodio.titulo || `Episódio ${String(episodio.numero).padStart(3, "0")}`;
        const numeroFormatado = String(episodio.numero).padStart(3, "0");
        const pontuacaoTitulo = pontuarTexto(consulta, tituloPersonalizado);
        const pontuacaoIdentificacao = pontuarTexto(consulta, `${identificacao} ${numeroFormatado}`);
        const pontuacaoSerie = pontuarTexto(consulta, serie.titulo);
        const pontuacao = Math.max(pontuacaoTitulo, pontuacaoIdentificacao) +
          (pontuacaoTitulo > 0 ? 5 : 0) + (pontuacaoSerie > 0 ? 2 : 0);

        if (pontuacao > 0) {
          episodiosEncontrados.push({
            serie, temporada, episodio, tituloPersonalizado, pontuacao
          });
        }
      });
    });
  });

  episodiosEncontrados.sort((a, b) => b.pontuacao - a.pontuacao);
  renderizarSeries(seriesEncontradas);

  episodiosEncontrados.forEach(({ serie, temporada, episodio, tituloPersonalizado }) => {
    const numero = String(episodio.numero).padStart(3, "0");
    const card = document.createElement("article");
    card.className = "search-episode-card";

    // Usa a miniatura oficial do YouTube correspondente ao ID do episódio.
    if (episodio.youtubeId) {
      const miniatura = document.createElement("img");
      miniatura.className = "search-episode-thumbnail";
      miniatura.src = `https://img.youtube.com/vi/${encodeURIComponent(episodio.youtubeId)}/hqdefault.jpg`;
      miniatura.alt = "";
      miniatura.loading = "lazy";
      miniatura.addEventListener("error", () => {
        miniatura.hidden = true;
      }, { once: true });
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

  const totalResultados = seriesEncontradas.length + episodiosEncontrados.length;
  emptyMessage.hidden = totalResultados !== 0;
  emptyMessage.textContent = "Nenhuma série ou episódio encontrado. Tente outro termo.";
  catalogCount.textContent = `${String(totalResultados).padStart(2, "0")} RESULTADOS`;
}

searchInput.addEventListener("input", (event) => {
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

document.querySelector("#navMinhaLista").addEventListener("click", (event) => {
  event.preventDefault();
  alert("A funcionalidade Minha lista será conectada ao perfil do usuário nas próximas etapas.");
});

renderizarSeries(catalogo);
