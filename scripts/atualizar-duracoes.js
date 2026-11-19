/**
 * NETFLIX 2% — Atualizador automático de durações
 * Requer Node.js 18+ e uma chave da YouTube Data API em .env.
 *
 * Execute na raiz do projeto: node scripts/atualizar-duracoes.js
 * Para conferir sem consultar o YouTube: node scripts/atualizar-duracoes.js --listar
 */

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const raiz = path.resolve(__dirname, "..");
const arquivoCatalogo = path.join(raiz, "js", "catalogo.js");
const arquivoEnv = path.join(raiz, ".env");

function carregarChaveApi() {
  if (fs.existsSync(arquivoEnv)) {
    const conteudo = fs.readFileSync(arquivoEnv, "utf8");
    const linha = conteudo
      .split(/\r?\n/)
      .find((l) => /^\s*YOUTUBE_API_KEY\s*=/.test(l));

    if (linha) {
      const valor = linha.replace(/^\s*YOUTUBE_API_KEY\s*=\s*/, "").trim();
      process.env.YOUTUBE_API_KEY = valor.replace(/^["']|["']$/g, "");
    }
  }

  return process.env.YOUTUBE_API_KEY;
}

function carregarCatalogo(codigo) {
  const contexto = {};
  vm.runInNewContext(`${codigo}\nglobalThis.__catalogo = catalogo;`, contexto);
  return contexto.__catalogo;
}

function localizarChamadas(codigo) {
  const chamadas = [];
  const regex = /episodios:\s*criarEpisodios\s*\(/g;
  let match;

  while ((match = regex.exec(codigo))) {
    const inicioArgs = regex.lastIndex;
    let profundidade = 1;
    let aspas = null;
    let escape = false;
    let fim = inicioArgs;

    for (; fim < codigo.length; fim++) {
      const caractere = codigo[fim];

      if (aspas) {
        if (escape) escape = false;
        else if (caractere === "\\") escape = true;
        else if (caractere === aspas) aspas = null;
        continue;
      }

      if (caractere === '"' || caractere === "'" || caractere === "`") {
        aspas = caractere;
      } else if (caractere === "(") {
        profundidade++;
      } else if (caractere === ")") {
        profundidade--;
        if (profundidade === 0) break;
      }
    }

    if (fim >= codigo.length) {
      throw new Error("Não foi possível localizar o fechamento de criarEpisodios().");
    }

    chamadas.push({
      inicio: inicioArgs,
      fim,
      argumentos: codigo.slice(inicioArgs, fim)
    });

    regex.lastIndex = fim + 1;
  }

  return chamadas;
}

function separarArgumentos(texto) {
  const partes = [];
  let inicio = 0;
  const pilha = [];
  let aspas = null;
  let escape = false;
  let comentarioLinha = false;
  let comentarioBloco = false;
  const fecha = { ")": "(", "]": "[", "}": "{" };

  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    const proximo = texto[i + 1];

    if (comentarioLinha) {
      if (c === "\n") comentarioLinha = false;
      continue;
    }

    if (comentarioBloco) {
      if (c === "*" && proximo === "/") {
        comentarioBloco = false;
        i++;
      }
      continue;
    }

    if (aspas) {
      if (escape) escape = false;
      else if (c === "\\") escape = true;
      else if (c === aspas) aspas = null;
      continue;
    }

    if (c === "/" && proximo === "/") {
      comentarioLinha = true;
      i++;
    } else if (c === "/" && proximo === "*") {
      comentarioBloco = true;
      i++;
    } else if (c === '"' || c === "'" || c === "`") {
      aspas = c;
    } else if ("([{".includes(c)) {
      pilha.push(c);
    } else if (")]}" .includes(c)) {
      if (pilha[pilha.length - 1] === fecha[c]) pilha.pop();
    } else if (c === "," && pilha.length === 0) {
      partes.push(texto.slice(inicio, i).trim());
      inicio = i + 1;
    }
  }

  const final = texto.slice(inicio).trim();
  if (final) partes.push(final);
  return partes;
}

function formatarDuracao(iso) {
  const partes = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!partes) return null;

  const horas = Number(partes[1] || 0);
  const minutos = Number(partes[2] || 0);
  const segundos = Number(partes[3] || 0);
  const totalMinutos = Math.round((horas * 3600 + minutos * 60 + segundos) / 60);

  if (totalMinutos < 60) return `${totalMinutos} min`;

  const h = Math.floor(totalMinutos / 60);
  const m = totalMinutos % 60;
  return m ? `${h}h ${m}min` : `${h}h`;
}

async function consultarYouTube(ids, chave) {
  const resultados = new Map();

  for (let i = 0; i < ids.length; i += 50) {
    const lote = ids.slice(i, i + 50);
    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.searchParams.set("part", "contentDetails");
    url.searchParams.set("id", lote.join(","));
    url.searchParams.set("key", chave);

    const resposta = await fetch(url);
    const dados = await resposta.json();

    if (!resposta.ok) {
      const mensagem = dados?.error?.message || resposta.statusText;
      throw new Error(`A API do YouTube respondeu com erro: ${mensagem}`);
    }

    for (const video of dados.items || []) {
      const duracao = formatarDuracao(video.contentDetails?.duration || "");
      if (duracao) resultados.set(video.id, duracao);
    }
  }

  return resultados;
}

function habilitarCampoDuracao(codigo) {
  let atualizado = codigo;

  const assinaturaAntiga =
    "function criarEpisodios(quantidade, idsVideos = {}, titulosEpisodios = {}) {";
  const assinaturaNova =
    "function criarEpisodios(quantidade, idsVideos = {}, titulosEpisodios = {}, duracoesEpisodios = {}) {";

  if (atualizado.includes(assinaturaAntiga)) {
    atualizado = atualizado.replace(assinaturaAntiga, assinaturaNova);
  } else if (!atualizado.includes(assinaturaNova)) {
    throw new Error("Não encontrei a assinatura esperada de criarEpisodios() no catálogo.");
  }

  const duracaoAntiga = 'duracao: "A definir",';
  const duracaoNova = 'duracao: duracoesEpisodios[numero] || "A definir",';

  if (atualizado.includes(duracaoAntiga)) {
    atualizado = atualizado.replace(duracaoAntiga, duracaoNova);
  } else if (!atualizado.includes(duracaoNova)) {
    throw new Error('Não encontrei a linha esperada de duracao: "A definir" no catálogo.');
  }

  return atualizado;
}

async function executar() {
  if (!fs.existsSync(arquivoCatalogo)) {
    throw new Error("Não encontrei js/catalogo.js. Execute o script na pasta principal do projeto.");
  }

  const codigoOriginal = fs.readFileSync(arquivoCatalogo, "utf8");
  const catalogo = carregarCatalogo(codigoOriginal);
  const pendentes = [];

  for (const serie of catalogo) {
    for (const temporada of serie.temporadas || []) {
      for (const episodio of temporada.episodios || []) {
        if (episodio.youtubeId && episodio.duracao === "A definir") {
          pendentes.push({
            serie: serie.titulo,
            temporada: temporada.numero,
            episodio: episodio.numero,
            id: episodio.youtubeId
          });
        }
      }
    }
  }

  console.log("\nNETFLIX 2% — Atualizador de durações");
  console.log(`Episódios aguardando duração: ${pendentes.length}`);

  if (process.argv.includes("--listar")) {
    pendentes.forEach((item) =>
      console.log(`• ${item.serie} | T${item.temporada} E${item.episodio} | ${item.id}`)
    );
    console.log("\nModo de conferência: nenhuma alteração foi feita.");
    return;
  }

  if (!pendentes.length) {
    console.log("Não há episódios pendentes. Nada a atualizar.");
    return;
  }

  const chave = carregarChaveApi();
  if (!chave) {
    throw new Error("Chave não encontrada. Crie o arquivo .env e configure YOUTUBE_API_KEY.");
  }

  const idsUnicos = [...new Set(pendentes.map((item) => item.id))];
  console.log(`Consultando ${idsUnicos.length} vídeos no YouTube...`);
  const duracoes = await consultarYouTube(idsUnicos, chave);

  const chamadas = localizarChamadas(codigoOriginal);
  let indiceChamada = 0;
  const substituicoes = [];
  let atualizados = 0;
  let naoEncontrados = 0;

  for (const serie of catalogo) {
    for (const temporada of serie.temporadas || []) {
      const chamada = chamadas[indiceChamada++];
      if (!chamada) {
        throw new Error("Não consegui associar uma temporada à chamada criarEpisodios().");
      }

      const args = separarArgumentos(chamada.argumentos);
      if (args.length < 3) {
        throw new Error("A chamada criarEpisodios() não contém os três argumentos esperados.");
      }

      const mapaAtual = args[3]
        ? vm.runInNewContext(`(${args[3]})`)
        : {};

      const novoMapa = { ...mapaAtual };

      for (const episodio of temporada.episodios || []) {
        if (!episodio.youtubeId || episodio.duracao !== "A definir") continue;

        const duracao = duracoes.get(episodio.youtubeId);
        if (duracao) {
          novoMapa[episodio.numero] = duracao;
          atualizados++;
          console.log(
            `✓ ${serie.titulo} — Episódio ${String(episodio.numero).padStart(3, "0")}: ${duracao}`
          );
        } else {
          naoEncontrados++;
          console.log(
            `! Não foi possível obter a duração: ${serie.titulo} — Episódio ${episodio.numero}`
          );
        }
      }

      const objetoFormatado = JSON.stringify(novoMapa, null, 8).replace(/\n/g, "\n        ");
      const novoArgumento = objetoFormatado;
      const novoInner = args.slice(0, 3).join(", ") + ", " + novoArgumento;

      substituicoes.push({
        inicio: chamada.inicio,
        fim: chamada.fim,
        texto: novoInner
      });
    }
  }

  if (atualizados > 0) {
    // Primeiro aplica os offsets calculados sobre o código original.
    // Só depois altera a assinatura/função, para não deslocar os índices.
    let codigoFinal = codigoOriginal;

    for (const item of substituicoes.sort((a, b) => b.inicio - a.inicio)) {
      codigoFinal =
        codigoFinal.slice(0, item.inicio) +
        item.texto +
        codigoFinal.slice(item.fim);
    }

    codigoFinal = habilitarCampoDuracao(codigoFinal);

    // Confere se o catálogo resultante continua executável antes de gravar.
    carregarCatalogo(codigoFinal);

    const backup = `${arquivoCatalogo}.backup`;
    if (!fs.existsSync(backup)) fs.copyFileSync(arquivoCatalogo, backup);
    fs.writeFileSync(arquivoCatalogo, codigoFinal, "utf8");

    console.log("\nCatálogo atualizado. Backup criado em: js/catalogo.js.backup");
  }

  console.log(
    `\nResumo: ${atualizados} duração(ões) preenchida(s); ${naoEncontrados} vídeo(s) não localizado(s).`
  );
  console.log('Vídeos sem duração permanecem como "A definir".');
}

executar().catch((erro) => {
  console.error(`\nERRO: ${erro.message}`);
  process.exitCode = 1;
});
