#!/usr/bin/env node
"use strict";

// Auditoria estática do NETFLIX 2%. Execute na raiz do projeto:
// node scripts/validar-projeto.js

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const raiz = process.cwd();
const erros = [];
const avisos = [];
const verificar = (condicao, mensagem) => {
  if (!condicao) erros.push(mensagem);
};
const existe = (caminho) => fs.existsSync(path.resolve(raiz, caminho));

for (const arquivo of [
  "index.html", "manifest.webmanifest", "service-worker.js",
  "js/catalogo.js", "js/main.js", "js/serie.js", "js/player.js",
  "js/theme.js", "js/pwa.js"
]) {
  verificar(existe(arquivo), `Arquivo obrigatório ausente: ${arquivo}`);
}

let catalogo = [];
try {
  const codigo = fs.readFileSync(path.join(raiz, "js/catalogo.js"), "utf8");
  const contexto = {};
  vm.createContext(contexto);
  vm.runInContext(`${codigo}\n;globalThis.__catalogoAuditado = catalogo;`, contexto, {
    filename: "js/catalogo.js",
    timeout: 3000
  });
  catalogo = contexto.__catalogoAuditado;
  verificar(Array.isArray(catalogo), "O catálogo não é um array válido.");
} catch (erro) {
  erros.push(`Não foi possível carregar js/catalogo.js: ${erro.message}`);
}

let totalEpisodios = 0;
let totalVideos = 0;
const idsSeries = new Set();
const idsVideos = new Set();

for (const serie of catalogo || []) {
  verificar(Boolean(serie.id && serie.titulo), "Há uma série sem ID ou título.");
  verificar(!idsSeries.has(serie.id), `ID de série duplicado: ${serie.id}`);
  idsSeries.add(serie.id);
  verificar(Array.isArray(serie.temporadas) && serie.temporadas.length > 0,
    `A série ${serie.id} não possui temporadas válidas.`);

  for (const campo of ["banner", "capa", "capaFallback"]) {
    if (serie[campo]) verificar(existe(serie[campo]), `Imagem ausente (${serie.id} / ${campo}): ${serie[campo]}`);
  }

  for (const temporada of serie.temporadas || []) {
    verificar(Array.isArray(temporada.episodios),
      `Temporada inválida em ${serie.id}.`);
    const episodios = temporada.episodios || [];
    const numeros = new Set();
    for (const episodio of episodios) {
      totalEpisodios++;
      verificar(Number.isInteger(episodio.numero) && episodio.numero > 0,
        `Número de episódio inválido em ${serie.id}.`);
      verificar(!numeros.has(episodio.numero),
        `Episódio duplicado ${episodio.numero} em ${serie.id}.`);
      numeros.add(episodio.numero);
      verificar(Boolean(episodio.titulo),
        `Episódio sem título em ${serie.id} (#${episodio.numero}).`);

      if (episodio.youtubeId) {
        totalVideos++;
        verificar(/^[A-Za-z0-9_-]{11}$/.test(episodio.youtubeId),
          `ID do YouTube com formato inesperado em ${serie.id} (#${episodio.numero}).`);
        verificar(!idsVideos.has(episodio.youtubeId),
          `ID do YouTube repetido: ${episodio.youtubeId}`);
        idsVideos.add(episodio.youtubeId);
      }
    }
    const ordenados = [...numeros].sort((a, b) => a - b);
    verificar(ordenados.every((numero, indice) => numero === indice + 1),
      `A numeração dos episódios não é sequencial em ${serie.id}.`);
  }
}

let manifesto;
try {
  manifesto = JSON.parse(fs.readFileSync(path.join(raiz, "manifest.webmanifest"), "utf8"));
  verificar(manifesto.name === "NETFLIX 2%", "Nome inesperado no manifesto PWA.");
  verificar(Boolean(manifesto.start_url && manifesto.scope), "start_url ou scope ausente no manifesto.");
  for (const icone of manifesto.icons || []) {
    verificar(existe(icone.src.replace(/^\//, "")), `Ícone do manifesto ausente: ${icone.src}`);
  }
} catch (erro) {
  erros.push(`Manifesto inválido: ${erro.message}`);
}

try {
  const sw = fs.readFileSync(path.join(raiz, "service-worker.js"), "utf8");
  const versao = sw.match(/const CACHE_VERSION = ["']([^"']+)["']/);
  verificar(Boolean(versao), "Não foi possível identificar a versão do cache PWA.");
  const bloco = sw.match(/const APP_SHELL = \[([\s\S]*?)\];/);
  verificar(Boolean(bloco), "Lista APP_SHELL não encontrada no Service Worker.");
  if (bloco) {
    for (const recurso of bloco[1].matchAll(/["'](\/[^"']+)["']/g)) {
      const caminho = recurso[1] === "/" ? "index.html" : recurso[1].replace(/^\//, "");
      verificar(existe(caminho), `Recurso do APP_SHELL ausente: ${recurso[1]}`);
    }
  }
} catch (erro) {
  erros.push(`Falha ao auditar Service Worker: ${erro.message}`);
}

console.log("\nNETFLIX 2% — Auditoria estática");
console.log(`Séries: ${catalogo.length}`);
console.log(`Episódios: ${totalEpisodios}`);
console.log(`Episódios com ID do YouTube: ${totalVideos}`);
console.log(`IDs de vídeo únicos: ${idsVideos.size}`);
if (avisos.length) {
  console.log("\nAvisos:");
  avisos.forEach((aviso) => console.log(`- ${aviso}`));
}
if (erros.length) {
  console.error(`\n${erros.length} problema(s) encontrado(s):`);
  erros.forEach((erro) => console.error(`- ${erro}`));
  process.exitCode = 1;
} else {
  console.log("\nAuditoria concluída: nenhuma inconsistência estrutural encontrada.");
}
