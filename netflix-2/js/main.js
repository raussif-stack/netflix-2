const seriesGrid = document.querySelector("#seriesGrid");
const searchInput = document.querySelector("#searchInput");
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
    const card = document.createElement("article");
    card.className = "series-card";
    card.innerHTML = `
      <img class="card-poster" src="${serie.capa}" alt="" loading="lazy">
      <span class="card-number">${serie.numero} / 03</span>
      <div class="card-content">
        <p class="card-category">${serie.categoria}</p>
        <h3>${serie.titulo}</h3>
        <p>${serie.descricao}</p>
        <button class="card-action" type="button">VER SÉRIE&nbsp; ↗</button>
      </div>
    `;
    const poster = card.querySelector(".card-poster");
    poster.addEventListener("error", () => {
      // Se a capa PNG não existir ou estiver com nome incorreto, usa a capa SVG incluída no projeto.
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
document.querySelector("#heroCategory").textContent = serieDestaque.categoria;
document.querySelector("#heroTitle").textContent = serieDestaque.titulo;
document.querySelector("#heroDescription").textContent = serieDestaque.descricao;
document.querySelector("#heroDetailsButton").addEventListener("click", () => abrirPaginaSerie(serieDestaque));
document.querySelector("#heroInfoButton").addEventListener("click", () => abrirInformacoes(serieDestaque));

searchInput.addEventListener("input", (event) => {
  const termo = event.target.value.trim().toLocaleLowerCase("pt-BR");
  const filtradas = catalogo.filter((serie) =>
    `${serie.titulo} ${serie.categoria} ${serie.descricao}`.toLocaleLowerCase("pt-BR").includes(termo)
  );
  renderizarSeries(filtradas);
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
