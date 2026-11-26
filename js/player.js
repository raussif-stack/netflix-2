const parametros = new URLSearchParams(window.location.search);
const serieId = parametros.get("id");
const temporadaNumeroInicial = Number(parametros.get("temporada") || 1);
const episodioNumeroInicial = Number(parametros.get("episodio") || 1);
const serie = catalogo.find((item) => item.id === serieId);
const titulo = document.querySelector("#watchEpisodeTitle");
const descricao = document.querySelector("#watchEpisodeDescription");
const metaEpisodio = document.querySelector("#watchEpisodeMeta");
const placeholder = document.querySelector("#videoPlaceholder");
const frame = document.querySelector("#videoFrame");
const linkVoltar = document.querySelector("#backToSeries");
const statusPlayer = document.querySelector("#playerStatus");
const listaEpisodios = document.querySelector("#episodeListItems");
const painelEpisodios = document.querySelector("#episodeListPanel");
const botaoLista = document.querySelector("#toggleEpisodeList");
const tituloLista = document.querySelector("#episodeListTitle");
const seletorTemporadaPlayer = document.querySelector("#playerSeasonSelect");
const resumoTemporadaPlayer = document.querySelector("#playerSeasonSummary");
const painelRetomada = document.querySelector("#resumePanel");
const descricaoRetomada = document.querySelector("#resumeDescription");
const botaoRetomar = document.querySelector("#resumePlayback");
const botaoRecomecar = document.querySelector("#restartPlayback");
const CHAVE_PROGRESSO = "netflix2-episode-progress-v1";
let timerSalvarProgresso = null;
let segundosParaRetomar = 0;
let itemRetomadaPendente = null;

let iframeDoEpisodio = null;
let youtubePlayer = null;
let timerProximoEpisodio = null;
let segundosRestantes = 10;
let urlProximoEpisodio = "";
let avancoAutomaticoCancelado = false;
let episodiosOrdenados = [];
let indiceAtual = -1;
let episodioAtualRef = null;
let temporadaAtualRef = null;
let temporadaListaRef = null;

const telaEncerramento = document.querySelector("#episodeEnded");
const mensagemEncerramento = document.querySelector("#episodeEndedMessage");
const contagemRegressiva = document.querySelector("#episodeCountdown");
const botaoRever = document.querySelector("#replayEpisode");
const linkProximoEncerramento = document.querySelector("#continueNextEpisode");
const botaoCancelarAvanco = document.querySelector("#cancelAutoNext");
const botaoTentarNovamente = document.querySelector("#retryVideo");
const controlesAvancados = document.querySelector("#advancedPlayerControls");
const seekPlayer = document.querySelector("#playerSeek");
const tempoAtualPlayer = document.querySelector("#playerCurrentTime");
const duracaoPlayer = document.querySelector("#playerDuration");
const botaoPlayPause = document.querySelector("#playerPlayPause");
const botaoVoltar10 = document.querySelector("#playerBack10");
const botaoAvancar10 = document.querySelector("#playerForward10");
const botaoMute = document.querySelector("#playerMute");
const volumePlayer = document.querySelector("#playerVolume");
const velocidadePlayer = document.querySelector("#playerSpeed");
const botaoFullscreen = document.querySelector("#playerFullscreen");
const autoNextToggle = document.querySelector("#autoNextToggle");
const autoNextState = document.querySelector("#autoNextState");
const CHAVE_REPRODUCAO_AUTOMATICA = "netflix2-auto-next-v1";
let timerInterfacePlayer = null;
let arrastandoSeek = false;

function urlDoEpisodio(item, iniciarAutomaticamente = false) {
  const url = `assistir.html?id=${encodeURIComponent(serie.id)}&temporada=${item.temporada.numero}&episodio=${item.episodio.numero}`;
  return iniciarAutomaticamente ? `${url}&autoplay=1` : url;
}

function obterIdYoutube(valor) {
  if (!valor || typeof valor !== "string") return "";
  const texto = valor.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(texto)) return texto;
  try {
    const url = new URL(texto);
    let id = "";
    if (url.hostname === "youtu.be" || url.hostname.endsWith(".youtu.be")) id = url.pathname.split("/").filter(Boolean)[0] || "";
    else if (url.hostname.includes("youtube.com")) {
      if (url.pathname === "/watch") id = url.searchParams.get("v") || "";
      else if (url.pathname.startsWith("/embed/") || url.pathname.startsWith("/shorts/")) id = url.pathname.split("/")[2] || "";
    }
    return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : "";
  } catch { return ""; }
}

function atualizarStatus(mensagem) {
  if (!statusPlayer) return;
  statusPlayer.textContent = mensagem;
  statusPlayer.hidden = !mensagem;
}
function ocultarCarregamento() {
  placeholder.hidden = true;
  placeholder.classList.remove("is-loading");
}
function mostrarIndisponivel(mensagem, detalhe = "Verifique se o vídeo existe e se o proprietário permite a incorporação pelo YouTube.", permitirNovaTentativa = false) {
  placeholder.hidden = false;
  placeholder.classList.remove("is-loading");
  placeholder.querySelector("h2").textContent = mensagem;
  placeholder.querySelector("p").textContent = detalhe;
  if (botaoTentarNovamente) botaoTentarNovamente.hidden = !permitirNovaTentativa;
  frame.classList.add("is-unavailable");
  atualizarStatus("");
}
function tratarErroYoutube(codigo) {
  definirControlesAtivos(false);
  pararInterfacePlayer();
  const erros = {
    2: ["ID DE VÍDEO INVÁLIDO", "O YouTube não reconheceu o identificador deste vídeo. Confira o ID cadastrado no catálogo."],
    5: ["ERRO NA REPRODUÇÃO", "O player HTML5 do YouTube encontrou um problema. Você pode tentar carregar o episódio novamente."],
    100: ["VÍDEO NÃO ENCONTRADO", "Este vídeo pode ter sido removido, definido como privado ou não estar disponível."],
    101: ["INCORPORAÇÃO NÃO PERMITIDA", "O proprietário do vídeo não autorizou a reprodução em sites externos."],
    150: ["INCORPORAÇÃO NÃO PERMITIDA", "O proprietário do vídeo não autorizou a reprodução em sites externos."],
    153: ["NÃO FOI POSSÍVEL IDENTIFICAR A ORIGEM", "O YouTube não recebeu as informações de identificação necessárias. Confira a conexão e tente novamente em uma página HTTPS."]
  };
  const [mensagem, detalhe] = erros[codigo] || ["NÃO FOI POSSÍVEL REPRODUZIR O VÍDEO", `O YouTube retornou o erro ${codigo}. Tente novamente mais tarde.`];
  mostrarIndisponivel(mensagem, detalhe, codigo === 5 || codigo === 153);
}
function limparContagemRegressiva() {
  if (timerProximoEpisodio) window.clearInterval(timerProximoEpisodio);
  timerProximoEpisodio = null;
}
function ocultarTelaEncerramento() {
  limparContagemRegressiva();
  if (telaEncerramento) telaEncerramento.hidden = true;
  avancoAutomaticoCancelado = false;
}
function reproducaoAutomaticaAtiva() {
  try {
    const salvo = localStorage.getItem(CHAVE_REPRODUCAO_AUTOMATICA);
    return salvo === null ? true : salvo === "true";
  } catch { return autoNextToggle ? autoNextToggle.checked : true; }
}
function atualizarPreferenciaReproducaoAutomatica() {
  const ativa = reproducaoAutomaticaAtiva();
  if (autoNextToggle) autoNextToggle.checked = ativa;
  if (autoNextState) autoNextState.textContent = ativa ? "ATIVADA" : "DESATIVADA";
}
function iniciarContagemRegressiva() {
  limparContagemRegressiva();
  if (!reproducaoAutomaticaAtiva() || !urlProximoEpisodio) {
    if (contagemRegressiva) contagemRegressiva.hidden = true;
    if (botaoCancelarAvanco) botaoCancelarAvanco.hidden = true;
    return;
  }
  segundosRestantes = 10;
  avancoAutomaticoCancelado = false;
  if (!urlProximoEpisodio) return;
  contagemRegressiva.hidden = false;
  botaoCancelarAvanco.hidden = false;
  const atualizarTexto = () => { contagemRegressiva.textContent = `Próximo episódio em ${segundosRestantes} segundo${segundosRestantes === 1 ? "" : "s"}…`; };
  atualizarTexto();
  timerProximoEpisodio = window.setInterval(() => {
    segundosRestantes -= 1;
    if (segundosRestantes <= 0) {
      limparContagemRegressiva();
      if (!avancoAutomaticoCancelado) avancarParaIndice(indiceAtual + 1, true);
      return;
    }
    atualizarTexto();
  }, 1000);
}
function mostrarTelaEncerramento() {
  if (!telaEncerramento) return;
  telaEncerramento.hidden = false;
  atualizarStatus("");
  if (urlProximoEpisodio) {
    mensagemEncerramento.textContent = reproducaoAutomaticaAtiva()
      ? "Este episódio terminou. O próximo começará automaticamente, ou você pode avançar agora."
      : "Este episódio terminou. A reprodução automática está desativada; escolha quando continuar.";
    linkProximoEncerramento.href = urlProximoEpisodio;
    linkProximoEncerramento.textContent = "REPRODUZIR PRÓXIMO AGORA";
    linkProximoEncerramento.hidden = false;
    botaoCancelarAvanco.hidden = !reproducaoAutomaticaAtiva();
    iniciarContagemRegressiva();
  } else {
    mensagemEncerramento.textContent = "Você chegou ao último episódio disponível desta série.";
    linkProximoEncerramento.hidden = true;
    contagemRegressiva.hidden = true;
    botaoCancelarAvanco.hidden = true;
  }
}
function definirControlesAtivos(ativo) {
  [seekPlayer, botaoPlayPause, botaoVoltar10, botaoAvancar10, botaoMute, volumePlayer, velocidadePlayer, botaoFullscreen].forEach((el) => { if (el) el.disabled = !ativo; });
}
function atualizarInterfacePlayer() {
  if (!youtubePlayer || typeof youtubePlayer.getCurrentTime !== "function") return;
  try {
    const atual = Math.max(0, Number(youtubePlayer.getCurrentTime()) || 0);
    const duracao = Math.max(0, Number(youtubePlayer.getDuration()) || 0);
    if (tempoAtualPlayer) tempoAtualPlayer.textContent = formatarTempo(atual);
    if (duracaoPlayer) duracaoPlayer.textContent = formatarTempo(duracao);
    if (seekPlayer && !arrastandoSeek) {
      seekPlayer.max = String(Math.max(1, Math.floor(duracao)));
      seekPlayer.value = String(Math.min(Math.floor(atual), Math.max(1, Math.floor(duracao))));
      seekPlayer.style.setProperty("--seek-progress", `${duracao > 0 ? atual / duracao * 100 : 0}%`);
    }
    if (botaoMute && typeof youtubePlayer.isMuted === "function") {
      const mudo = youtubePlayer.isMuted();
      botaoMute.textContent = mudo ? "ATIVAR SOM" : "SOM";
      botaoMute.setAttribute("aria-label", mudo ? "Ativar som" : "Silenciar");
    }
    if (botaoPlayPause && typeof youtubePlayer.getPlayerState === "function") {
      const tocando = youtubePlayer.getPlayerState() === 1;
      botaoPlayPause.textContent = tocando ? "Ⅱ PAUSAR" : "▶ REPRODUZIR";
      botaoPlayPause.setAttribute("aria-label", tocando ? "Pausar" : "Reproduzir");
    }
  } catch (erro) { console.warn("Não foi possível atualizar os controles do player.", erro); }
}
function iniciarInterfacePlayer() {
  definirControlesAtivos(true);
  atualizarInterfacePlayer();
  if (timerInterfacePlayer) window.clearInterval(timerInterfacePlayer);
  timerInterfacePlayer = window.setInterval(atualizarInterfacePlayer, 500);
}
function pararInterfacePlayer() {
  if (timerInterfacePlayer) window.clearInterval(timerInterfacePlayer);
  timerInterfacePlayer = null;
}
function buscarNoVideo(delta) {
  if (!youtubePlayer || typeof youtubePlayer.getCurrentTime !== "function") return;
  const atual = Number(youtubePlayer.getCurrentTime()) || 0;
  const duracao = Number(youtubePlayer.getDuration()) || 0;
  youtubePlayer.seekTo(Math.max(0, Math.min(duracao || Infinity, atual + delta)), true);
  atualizarInterfacePlayer();
}
function aoPlayerFicarPronto() {
  ocultarCarregamento();
  frame.classList.remove("is-unavailable");
  atualizarStatus("");
  iniciarInterfacePlayer();
  prepararRetomadaInicial();
}
function aoMudarEstado(evento) {
  if (!window.YT || !window.YT.PlayerState) return;
  frame.dataset.playerState = String(evento.data);
  switch (evento.data) {
    case window.YT.PlayerState.ENDED:
      atualizarInterfacePlayer();
      marcarEpisodioConcluido();
      esconderPainelRetomada();
      mostrarTelaEncerramento();
      break;
    case window.YT.PlayerState.PLAYING:
      atualizarInterfacePlayer();
      esconderPainelRetomada();
      ocultarTelaEncerramento();
      atualizarStatus("");
      iniciarMonitoramentoProgresso();
      break;
    case window.YT.PlayerState.PAUSED:
      atualizarInterfacePlayer();
      salvarProgressoAtual();
      pararMonitoramentoProgresso();
      atualizarStatus("REPRODUÇÃO PAUSADA");
      break;
    case window.YT.PlayerState.BUFFERING: atualizarStatus("CARREGANDO VÍDEO…"); break;
    case window.YT.PlayerState.CUED: atualizarStatus("VÍDEO PRONTO PARA REPRODUÇÃO"); break;
    default: atualizarStatus("");
  }
}
function conectarIFramePlayerAPI() {
  if (!iframeDoEpisodio || !window.YT || typeof window.YT.Player !== "function" || youtubePlayer) return;
  youtubePlayer = new window.YT.Player(iframeDoEpisodio, {
    events: { onReady: aoPlayerFicarPronto, onStateChange: aoMudarEstado, onError: (evento) => tratarErroYoutube(evento.data) }
  });
}
window.onYouTubeIframeAPIReady = conectarIFramePlayerAPI;

function chaveDoEpisodio(item) {
  return `${serie.id}:${item.temporada.numero}:${item.episodio.numero}`;
}
function lerMapaProgresso() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE_PROGRESSO) || "{}");
    return dados && typeof dados === "object" && !Array.isArray(dados) ? dados : {};
  } catch { return {}; }
}
function obterProgresso(item) {
  return lerMapaProgresso()[chaveDoEpisodio(item)] || null;
}
function gravarProgresso(item, dados) {
  try {
    const mapa = lerMapaProgresso();
    mapa[chaveDoEpisodio(item)] = { ...dados, atualizadoEm: Date.now() };
    localStorage.setItem(CHAVE_PROGRESSO, JSON.stringify(mapa));
  } catch (erro) { console.warn("Não foi possível salvar o progresso local.", erro); }
}
function formatarTempo(segundos) {
  const total = Math.max(0, Math.floor(Number(segundos) || 0));
  const horas = Math.floor(total / 3600);
  const minutos = Math.floor((total % 3600) / 60);
  const resto = total % 60;
  return horas ? `${horas}:${String(minutos).padStart(2, "0")}:${String(resto).padStart(2, "0")}` : `${minutos}:${String(resto).padStart(2, "0")}`;
}
function progressoDoItem(item, mapa = lerMapaProgresso()) {
  const dados = mapa[chaveDoEpisodio(item)] || null;
  if (!dados || dados.status === "completed") return { status: dados?.status === "completed" ? "completed" : "not-started", percent: 0 };
  const atual = Math.max(0, Number(dados.currentTime) || 0);
  const duracao = Math.max(0, Number(dados.duration) || 0);
  return { status: dados.status === "in-progress" || atual > 5 ? "in-progress" : "not-started", percent: duracao > 0 ? Math.min(100, Math.max(0, atual / duracao * 100)) : 0 };
}
function salvarProgressoAtual() {
  if (!episodioAtualRef || !temporadaAtualRef || !youtubePlayer || typeof youtubePlayer.getCurrentTime !== "function") return;
  try {
    const atual = Number(youtubePlayer.getCurrentTime());
    const duracao = typeof youtubePlayer.getDuration === "function" ? Number(youtubePlayer.getDuration()) : 0;
    if (!Number.isFinite(atual) || atual < 0) return;
    const anterior = obterProgresso({ temporada: temporadaAtualRef, episodio: episodioAtualRef });
    if (anterior?.status === "completed") return;
    if (atual < 2 && !(anterior?.currentTime > 2)) return;
    gravarProgresso({ temporada: temporadaAtualRef, episodio: episodioAtualRef }, {
      currentTime: atual,
      duration: Number.isFinite(duracao) && duracao > 0 ? duracao : Number(anterior?.duration) || 0,
      status: "in-progress"
    });
    atualizarListaComProgresso();
  } catch (erro) { console.warn("Não foi possível ler o tempo atual do vídeo.", erro); }
}
function marcarEpisodioConcluido() {
  if (!episodioAtualRef || !temporadaAtualRef) return;
  let duracao = 0;
  try { duracao = Number(youtubePlayer?.getDuration?.()) || 0; } catch { duracao = 0; }
  gravarProgresso({ temporada: temporadaAtualRef, episodio: episodioAtualRef }, {
    currentTime: duracao,
    duration: duracao,
    status: "completed"
  });
  pararMonitoramentoProgresso();
  atualizarListaComProgresso();
}
function iniciarMonitoramentoProgresso() {
  pararMonitoramentoProgresso();
  timerSalvarProgresso = window.setInterval(salvarProgressoAtual, 5000);
}
function pararMonitoramentoProgresso() {
  if (timerSalvarProgresso) window.clearInterval(timerSalvarProgresso);
  timerSalvarProgresso = null;
}
function atualizarListaComProgresso() {
  if (!listaEpisodios || !episodioAtualRef || !temporadaAtualRef) return;
  const chave = chaveDoEpisodio({ temporada: temporadaAtualRef, episodio: episodioAtualRef });
  const cartao = Array.from(listaEpisodios.querySelectorAll(".episode-list-item")).find((item) => item.dataset.episodeKey === chave);
  if (!cartao) return;
  const progresso = progressoDoItem({ temporada: temporadaAtualRef, episodio: episodioAtualRef });
  const status = cartao.querySelector(".episode-list-status");
  const preenchimento = cartao.querySelector(".episode-progress-fill");
  if (status) {
    status.className = `episode-list-status is-${progresso.status}`;
    status.textContent = progresso.status === "completed" ? "ASSISTIDO" : progresso.status === "in-progress" ? "EM ANDAMENTO" : "NÃO ASSISTIDO";
  }
  if (preenchimento) preenchimento.style.width = progresso.status === "completed" ? "100%" : `${progresso.percent}%`;
}
function esconderPainelRetomada() {
  if (painelRetomada) painelRetomada.hidden = true;
  itemRetomadaPendente = null;
  segundosParaRetomar = 0;
}
function oferecerRetomada(segundos, autoplay = false) {
  segundosParaRetomar = Math.max(0, Math.floor(segundos));
  if (segundosParaRetomar < 10 || !painelRetomada) return false;
  if (autoplay) {
    youtubePlayer?.seekTo?.(segundosParaRetomar, true);
    youtubePlayer?.playVideo?.();
    esconderPainelRetomada();
    return true;
  }
  itemRetomadaPendente = { segundos: segundosParaRetomar };
  descricaoRetomada.textContent = `Você parou em ${formatarTempo(segundosParaRetomar)}. Deseja continuar de onde parou ou recomeçar?`;
  painelRetomada.hidden = false;
  youtubePlayer?.pauseVideo?.();
  return true;
}
function prepararRetomadaInicial() {
  const progresso = obterProgresso({ temporada: temporadaAtualRef, episodio: episodioAtualRef });
  if (!progresso || progresso.status === "completed") {
    if (parametros.get("autoplay") === "1") youtubePlayer?.playVideo?.();
    return;
  }
  oferecerRetomada(Number(progresso.currentTime) || 0, parametros.get("autoplay") === "1");
}
function salvarHistorico(item) {
  try {
    const chave = "netflix2-watch-history";
    let atual = [];
    try { atual = JSON.parse(localStorage.getItem(chave) || "[]"); } catch { atual = []; }
    const seguro = Array.isArray(atual) ? atual.filter((x) => x && typeof x === "object") : [];
    const novo = { serieId: serie.id, temporada: item.temporada.numero, episodio: item.episodio.numero, acessadoEm: Date.now() };
    const semDuplicata = seguro.filter((x) => !(x.serieId === novo.serieId && Number(x.temporada) === novo.temporada && Number(x.episodio) === novo.episodio));
    localStorage.setItem(chave, JSON.stringify([novo, ...semDuplicata].slice(0, 100)));
  } catch (erro) { console.warn("Não foi possível salvar o histórico local.", erro); }
}
function atualizarEndereco(item, autoplay = false) {
  const url = new URL(urlDoEpisodio(item, autoplay), window.location.href);
  window.history.pushState({ temporada: item.temporada.numero, episodio: item.episodio.numero }, "", url);
}
function atualizarControles() {
  const anterior = document.querySelector("#previousEpisode");
  const proximo = document.querySelector("#nextEpisode");
  const atual = episodiosOrdenados[indiceAtual];
  anterior.hidden = indiceAtual <= 0;
  proximo.hidden = indiceAtual >= episodiosOrdenados.length - 1;
  anterior.href = indiceAtual > 0 ? urlDoEpisodio(episodiosOrdenados[indiceAtual - 1]) : "#";
  proximo.href = indiceAtual < episodiosOrdenados.length - 1 ? urlDoEpisodio(episodiosOrdenados[indiceAtual + 1]) : "#";
  urlProximoEpisodio = indiceAtual < episodiosOrdenados.length - 1 ? urlDoEpisodio(episodiosOrdenados[indiceAtual + 1]) : "";
  linkProximoEncerramento.href = urlProximoEpisodio || "#";
  document.querySelector("#episodeCounter").textContent = `${atual.temporada.titulo} • Episódio ${String(atual.episodio.numero).padStart(3, "0")} • ${indiceAtual + 1} de ${episodiosOrdenados.length}`;
}
function renderizarListaEpisodios(temporada = temporadaAtualRef) {
  if (!temporada) return;
  temporadaListaRef = temporada;
  const itens = temporada.episodios;
  const mapaProgresso = lerMapaProgresso();
  const concluidos = itens.filter((ep) => mapaProgresso[chaveDoEpisodio({ temporada, episodio: ep })]?.status === "completed").length;
  const emAndamento = itens.filter((ep) => mapaProgresso[chaveDoEpisodio({ temporada, episodio: ep })]?.status === "in-progress").length;
  tituloLista.textContent = `${temporada.titulo} — ${itens.length} episódios`;
  if (resumoTemporadaPlayer) resumoTemporadaPlayer.textContent = `${concluidos}/${itens.length} assistidos${emAndamento ? ` · ${emAndamento} em andamento` : ""}`;
  if (seletorTemporadaPlayer && seletorTemporadaPlayer.value !== String(temporada.numero)) seletorTemporadaPlayer.value = String(temporada.numero);
  listaEpisodios.replaceChildren();
  itens.forEach((ep) => {
    const indiceGlobal = episodiosOrdenados.findIndex((x) => x.temporada.numero === temporada.numero && x.episodio.numero === ep.numero);
    const ativo = temporada.numero === temporadaAtualRef?.numero && indiceGlobal === indiceAtual;
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = `episode-list-item${ativo ? " is-current" : ""}`;
    botao.dataset.episodeKey = chaveDoEpisodio({ temporada, episodio: ep });
    botao.setAttribute("aria-current", ativo ? "true" : "false");
    const numero = document.createElement("span");
    numero.className = "episode-list-number";
    numero.textContent = String(ep.numero).padStart(3, "0");
    const textos = document.createElement("span");
    textos.className = "episode-list-text";
    const nome = document.createElement("strong");
    nome.textContent = ep.titulo || `Episódio ${String(ep.numero).padStart(3, "0")}`;
    const sub = document.createElement("small");
    sub.textContent = ep.descricao || "Sem título adicional";
    textos.append(nome, sub);
    const progresso = progressoDoItem({ temporada, episodio: ep }, mapaProgresso);
    const status = document.createElement("span");
    status.className = `episode-list-status is-${progresso.status}`;
    status.textContent = progresso.status === "completed" ? "ASSISTIDO" : progresso.status === "in-progress" ? "EM ANDAMENTO" : "NÃO ASSISTIDO";
    const detalhes = document.createElement("span");
    detalhes.className = "episode-list-details";
    const duracao = document.createElement("span");
    duracao.className = "episode-list-duration";
    duracao.textContent = ep.duracao && ep.duracao !== "A definir" ? ep.duracao : "—";
    detalhes.append(status, duracao);
    const trilho = document.createElement("span");
    trilho.className = "episode-progress-track";
    const preenchimento = document.createElement("span");
    preenchimento.className = "episode-progress-fill";
    preenchimento.style.width = progresso.status === "completed" ? "100%" : `${progresso.percent}%`;
    trilho.appendChild(preenchimento);
    textos.appendChild(trilho);
    botao.append(numero, textos, detalhes);
    botao.addEventListener("click", () => avancarParaIndice(indiceGlobal, true));
    listaEpisodios.appendChild(botao);
  });
}
function configurarSeletorTemporadasPlayer() {
  if (!seletorTemporadaPlayer || !serie) return;
  seletorTemporadaPlayer.replaceChildren();
  serie.temporadas.forEach((temporada) => {
    const opcao = document.createElement("option");
    opcao.value = String(temporada.numero);
    opcao.textContent = temporada.titulo;
    seletorTemporadaPlayer.appendChild(opcao);
  });
  seletorTemporadaPlayer.addEventListener("change", () => {
    const selecionada = serie.temporadas.find((temp) => String(temp.numero) === seletorTemporadaPlayer.value);
    if (selecionada) renderizarListaEpisodios(selecionada);
  });
}
function atualizarMetadados() {
  const ep = episodioAtualRef;
  const partes = [`${temporadaAtualRef.titulo}`, `EPISÓDIO ${String(ep.numero).padStart(3, "0")}`];
  if (ep.duracao && ep.duracao !== "A definir") partes.push(ep.duracao);
  metaEpisodio.textContent = partes.join("  •  ");
  descricao.textContent = ep.descricao || "";
}
function prepararIframe(videoId, autoplay = false) {
  placeholder.hidden = false;
  placeholder.classList.add("is-loading");
  placeholder.querySelector("h2").textContent = "CARREGANDO VÍDEO...";
  placeholder.querySelector("p").textContent = "Aguarde enquanto o YouTube prepara a reprodução.";
  if (botaoTentarNovamente) botaoTentarNovamente.hidden = true;
  frame.classList.remove("is-unavailable");
  iframeDoEpisodio = document.createElement("iframe");
  iframeDoEpisodio.id = "youtubePlayer";
  const params = new URLSearchParams({ enablejsapi: "1", origin: window.location.origin });
  if (autoplay) params.set("autoplay", "1");
  iframeDoEpisodio.src = `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
  iframeDoEpisodio.title = `${serie.titulo} — ${episodioAtualRef.titulo}`;
  iframeDoEpisodio.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframeDoEpisodio.referrerPolicy = "strict-origin-when-cross-origin";
  iframeDoEpisodio.allowFullscreen = true;
  iframeDoEpisodio.addEventListener("load", () => { if (!window.YT || typeof window.YT.Player !== "function") ocultarCarregamento(); }, { once: true });
  iframeDoEpisodio.addEventListener("error", () => mostrarIndisponivel("NÃO FOI POSSÍVEL CARREGAR ESTE VÍDEO", "Confira sua conexão e tente novamente.", true), { once: true });
  frame.appendChild(iframeDoEpisodio);
  document.querySelector("#youtubeNote").hidden = false;
  conectarIFramePlayerAPI();
}
function carregarMidiaDoEpisodio(autoplay = true) {
  const videoId = obterIdYoutube(episodioAtualRef.youtubeId);
  if (!videoId) {
    if (youtubePlayer && typeof youtubePlayer.destroy === "function") youtubePlayer.destroy();
    youtubePlayer = null; iframeDoEpisodio = null;
    definirControlesAtivos(false); pararInterfacePlayer();
    frame.querySelectorAll("iframe").forEach((el) => el.remove());
    mostrarIndisponivel("ESTE EPISÓDIO ESTARÁ DISPONÍVEL EM BREVE", "O vídeo ainda não foi cadastrado. Quando o ID do YouTube for adicionado ao catálogo, ele aparecerá aqui.");
    return;
  }
  if (youtubePlayer && typeof youtubePlayer.loadVideoById === "function") {
    ocultarTelaEncerramento();
    placeholder.hidden = false; placeholder.classList.add("is-loading");
    placeholder.querySelector("h2").textContent = "CARREGANDO VÍDEO...";
    placeholder.querySelector("p").textContent = "Aguarde enquanto o YouTube prepara a reprodução.";
    iframeDoEpisodio.title = `${serie.titulo} — ${episodioAtualRef.titulo}`;
    const progressoSalvo = obterProgresso({ temporada: temporadaAtualRef, episodio: episodioAtualRef });
    const retomarEm = progressoSalvo && progressoSalvo.status !== "completed" ? Math.max(0, Number(progressoSalvo.currentTime) || 0) : 0;
    youtubePlayer.loadVideoById({ videoId, startSeconds: retomarEm >= 10 ? retomarEm : 0, suggestedQuality: "large" });
    if (autoplay) youtubePlayer.playVideo();
  } else {
    if (youtubePlayer && typeof youtubePlayer.destroy === "function") youtubePlayer.destroy();
    youtubePlayer = null;
    frame.querySelectorAll("iframe").forEach((el) => el.remove());
    prepararIframe(videoId, autoplay);
  }
}
function atualizarEpisodioNaPagina(item, autoplay = true, atualizarUrl = true) {
  episodioAtualRef = item.episodio;
  temporadaAtualRef = item.temporada;
  indiceAtual = episodiosOrdenados.findIndex((x) => x.temporada.numero === item.temporada.numero && x.episodio.numero === item.episodio.numero);
  document.title = `NETFLIX 2% | ${episodioAtualRef.titulo}`;
  linkVoltar.href = `serie.html?id=${encodeURIComponent(serie.id)}&temporada=${temporadaAtualRef.numero}&episodio=${episodioAtualRef.numero}`;
  titulo.textContent = episodioAtualRef.titulo;
  atualizarMetadados();
  atualizarControles();
  renderizarListaEpisodios();
  ocultarTelaEncerramento();
  esconderPainelRetomada();
  pararMonitoramentoProgresso();
  salvarHistorico(item);
  if (atualizarUrl) atualizarEndereco(item, autoplay);
  carregarMidiaDoEpisodio(autoplay);
}
function avancarParaIndice(indice, autoplay = true) {
  if (indice < 0 || indice >= episodiosOrdenados.length) return;
  atualizarEpisodioNaPagina(episodiosOrdenados[indice], autoplay, true);
}

atualizarPreferenciaReproducaoAutomatica();
if (autoNextToggle) autoNextToggle.addEventListener("change", () => {
  try { localStorage.setItem(CHAVE_REPRODUCAO_AUTOMATICA, String(autoNextToggle.checked)); } catch (erro) { console.warn("Não foi possível salvar a preferência de reprodução automática.", erro); }
  atualizarPreferenciaReproducaoAutomatica();
  if (telaEncerramento && !telaEncerramento.hidden && urlProximoEpisodio) {
    if (autoNextToggle.checked) {
      mensagemEncerramento.textContent = "Este episódio terminou. O próximo começará automaticamente, ou você pode avançar agora.";
      iniciarContagemRegressiva();
      botaoCancelarAvanco.hidden = false;
    } else {
      limparContagemRegressiva();
      contagemRegressiva.hidden = true;
      botaoCancelarAvanco.hidden = true;
      mensagemEncerramento.textContent = "Este episódio terminou. A reprodução automática está desativada; escolha quando continuar.";
    }
  }
});
if (botaoPlayPause) botaoPlayPause.addEventListener("click", () => {
  if (!youtubePlayer || typeof youtubePlayer.getPlayerState !== "function") return;
  if (youtubePlayer.getPlayerState() === 1) youtubePlayer.pauseVideo(); else youtubePlayer.playVideo();
  atualizarInterfacePlayer();
});
if (botaoVoltar10) botaoVoltar10.addEventListener("click", () => buscarNoVideo(-10));
if (botaoAvancar10) botaoAvancar10.addEventListener("click", () => buscarNoVideo(10));
if (botaoMute) botaoMute.addEventListener("click", () => {
  if (!youtubePlayer) return;
  if (youtubePlayer.isMuted?.()) youtubePlayer.unMute(); else youtubePlayer.mute();
  atualizarInterfacePlayer();
});
if (volumePlayer) volumePlayer.addEventListener("input", () => {
  if (!youtubePlayer || typeof youtubePlayer.setVolume !== "function") return;
  youtubePlayer.setVolume(Number(volumePlayer.value));
  if (Number(volumePlayer.value) > 0 && youtubePlayer.isMuted?.()) youtubePlayer.unMute();
  atualizarInterfacePlayer();
});
if (velocidadePlayer) velocidadePlayer.addEventListener("change", () => {
  if (!youtubePlayer || typeof youtubePlayer.setPlaybackRate !== "function") return;
  youtubePlayer.setPlaybackRate(Number(velocidadePlayer.value));
});
if (seekPlayer) {
  seekPlayer.addEventListener("pointerdown", () => { arrastandoSeek = true; });
  seekPlayer.addEventListener("input", () => {
    const maximo = Number(seekPlayer.max) || 1;
    if (tempoAtualPlayer) tempoAtualPlayer.textContent = formatarTempo(Number(seekPlayer.value));
    seekPlayer.style.setProperty("--seek-progress", `${Number(seekPlayer.value) / maximo * 100}%`);
  });
  const concluirBusca = () => {
    if (!arrastandoSeek) return;
    arrastandoSeek = false;
    if (youtubePlayer && typeof youtubePlayer.seekTo === "function") youtubePlayer.seekTo(Number(seekPlayer.value), true);
    atualizarInterfacePlayer();
  };
  seekPlayer.addEventListener("change", concluirBusca);
  seekPlayer.addEventListener("pointerup", concluirBusca);
  seekPlayer.addEventListener("pointercancel", concluirBusca);
}
if (botaoFullscreen) botaoFullscreen.addEventListener("click", async () => {
  const alvo = frame;
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (alvo.requestFullscreen) await alvo.requestFullscreen();
    else if (iframeDoEpisodio?.requestFullscreen) await iframeDoEpisodio.requestFullscreen();
  } catch (erro) { atualizarStatus("O navegador não permitiu abrir a tela cheia."); }
});
if (botaoRetomar) botaoRetomar.addEventListener("click", () => {
  if (!itemRetomadaPendente || !youtubePlayer) return;
  youtubePlayer.seekTo(itemRetomadaPendente.segundos, true);
  esconderPainelRetomada();
  youtubePlayer.playVideo();
});
if (botaoRecomecar) botaoRecomecar.addEventListener("click", () => {
  esconderPainelRetomada();
  const anterior = obterProgresso({ temporada: temporadaAtualRef, episodio: episodioAtualRef });
  gravarProgresso({ temporada: temporadaAtualRef, episodio: episodioAtualRef }, { currentTime: 0, duration: Number(anterior?.duration) || 0, status: "in-progress" });
  atualizarListaComProgresso();
  if (youtubePlayer) { youtubePlayer.seekTo(0, true); youtubePlayer.playVideo(); }
});
if (botaoRever) botaoRever.addEventListener("click", () => {
  ocultarTelaEncerramento();
  const anterior = obterProgresso({ temporada: temporadaAtualRef, episodio: episodioAtualRef });
  gravarProgresso({ temporada: temporadaAtualRef, episodio: episodioAtualRef }, { currentTime: 0, duration: Number(anterior?.duration) || 0, status: "in-progress" });
  atualizarListaComProgresso();
  if (youtubePlayer && typeof youtubePlayer.seekTo === "function") { youtubePlayer.seekTo(0, true); youtubePlayer.playVideo(); }
  else carregarMidiaDoEpisodio(true);
});
if (botaoCancelarAvanco) botaoCancelarAvanco.addEventListener("click", () => {
  avancoAutomaticoCancelado = true; limparContagemRegressiva();
  contagemRegressiva.hidden = false; contagemRegressiva.textContent = "Avanço automático cancelado. Você pode continuar manualmente quando quiser.";
  botaoCancelarAvanco.hidden = true;
});
if (botaoTentarNovamente) botaoTentarNovamente.addEventListener("click", () => carregarMidiaDoEpisodio(true));
if (botaoLista) botaoLista.addEventListener("click", () => {
  const abrir = painelEpisodios.hidden;
  painelEpisodios.hidden = !abrir;
  botaoLista.setAttribute("aria-expanded", String(abrir));
  botaoLista.innerHTML = abrir ? 'OCULTAR EPISÓDIOS <span aria-hidden="true">⌃</span>' : 'VER EPISÓDIOS <span aria-hidden="true">⌄</span>';
});
document.querySelector("#previousEpisode").addEventListener("click", (e) => { e.preventDefault(); avancarParaIndice(indiceAtual - 1, true); });
document.querySelector("#nextEpisode").addEventListener("click", (e) => { e.preventDefault(); avancarParaIndice(indiceAtual + 1, true); });
linkProximoEncerramento.addEventListener("click", (e) => { if (indiceAtual < episodiosOrdenados.length - 1) { e.preventDefault(); limparContagemRegressiva(); avancarParaIndice(indiceAtual + 1, true); } });
window.addEventListener("pagehide", () => {
  salvarProgressoAtual();
  pararMonitoramentoProgresso();
  pararInterfacePlayer();
});
window.addEventListener("popstate", () => {
  const p = new URLSearchParams(window.location.search);
  const tempN = Number(p.get("temporada") || 1), epN = Number(p.get("episodio") || 1);
  const idx = episodiosOrdenados.findIndex((x) => x.temporada.numero === tempN && x.episodio.numero === epN);
  if (idx >= 0) atualizarEpisodioNaPagina(episodiosOrdenados[idx], false, false);
});
window.addEventListener("keydown", (e) => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  const alvo = e.target;
  if (alvo && (alvo.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(alvo.tagName))) return;
  if (e.key === "ArrowLeft") { if (indiceAtual > 0) { e.preventDefault(); avancarParaIndice(indiceAtual - 1, true); } }
  else if (e.key === "ArrowRight") { if (indiceAtual < episodiosOrdenados.length - 1) { e.preventDefault(); avancarParaIndice(indiceAtual + 1, true); } }
  else if ((e.key.toLowerCase() === "k") && !e.repeat) {
    if (youtubePlayer && typeof youtubePlayer.getPlayerState === "function") {
      e.preventDefault();
      if (youtubePlayer.getPlayerState() === 1) youtubePlayer.pauseVideo(); else youtubePlayer.playVideo();
      atualizarInterfacePlayer();
    }
  } else if (e.key.toLowerCase() === "j") { e.preventDefault(); buscarNoVideo(-10); }
  else if (e.key.toLowerCase() === "l") { e.preventDefault(); buscarNoVideo(10); }
  else if (e.key.toLowerCase() === "m") {
    if (youtubePlayer) { e.preventDefault(); if (youtubePlayer.isMuted?.()) youtubePlayer.unMute(); else youtubePlayer.mute(); atualizarInterfacePlayer(); }
  } else if (e.code === "Space" && !e.repeat) {
    if (youtubePlayer && typeof youtubePlayer.getPlayerState === "function") {
      e.preventDefault();
      const state = youtubePlayer.getPlayerState();
      if (state === 1) youtubePlayer.pauseVideo(); else youtubePlayer.playVideo();
    }
  } else if (e.key === "Escape") {
    if (!painelEpisodios.hidden) { painelEpisodios.hidden = true; botaoLista.setAttribute("aria-expanded", "false"); botaoLista.innerHTML = 'VER EPISÓDIOS <span aria-hidden="true">⌄</span>'; }
    else if (linkVoltar.href) window.location.href = linkVoltar.href;
  }
});

if (!serie) {
  document.title = "NETFLIX 2% | Série não encontrada";
  document.querySelector("#watchSeriesTitle").textContent = "SÉRIE NÃO ENCONTRADA";
  titulo.textContent = "Não foi possível localizar esta série.";
  descricao.textContent = "Volte ao início e escolha uma série do catálogo.";
  mostrarIndisponivel("SÉRIE NÃO ENCONTRADA");
  linkVoltar.href = "../index.html";
  document.querySelector(".episode-list-section").hidden = true;
} else {
  linkVoltar.href = `serie.html?id=${encodeURIComponent(serie.id)}&temporada=${temporadaNumeroInicial}&episodio=${episodioNumeroInicial}`;
  document.querySelector("#watchSeriesTitle").textContent = serie.titulo;
  episodiosOrdenados = serie.temporadas.flatMap((temp) => temp.episodios.map((ep) => ({ temporada: temp, episodio: ep })));
  configurarSeletorTemporadasPlayer();
  const indiceInicial = episodiosOrdenados.findIndex((x) => x.temporada.numero === temporadaNumeroInicial && x.episodio.numero === episodioNumeroInicial);
  if (indiceInicial < 0) {
    document.title = `NETFLIX 2% | ${serie.titulo}`;
    titulo.textContent = "Episódio não encontrado";
    descricao.textContent = "Este episódio não existe no catálogo informado.";
    mostrarIndisponivel("EPISÓDIO NÃO ENCONTRADO");
    document.querySelector(".episode-list-section").hidden = true;
  } else {
    indiceAtual = indiceInicial;
    const inicial = episodiosOrdenados[indiceAtual];
    episodioAtualRef = inicial.episodio;
    temporadaAtualRef = inicial.temporada;
    atualizarEpisodioNaPagina(inicial, parametros.get("autoplay") === "1", false);
    // Inicia o player para o primeiro episódio carregado.
  }
}
