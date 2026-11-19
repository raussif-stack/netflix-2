# Automatização das durações — NETFLIX 2%

## Requisitos
- Node.js 18 ou superior.
- Uma chave da YouTube Data API v3.

## Configuração inicial
1. No Google Cloud Console, crie ou selecione um projeto.
2. Ative **YouTube Data API v3** e crie uma chave de API.
3. Na pasta principal do NETFLIX 2%, faça uma cópia de `.env.example` chamada `.env`.
4. Abra `.env` e substitua `SUA_CHAVE_DA_API_AQUI` pela sua chave.

O arquivo `.env` está no `.gitignore`: a chave não será enviada ao GitHub junto com o projeto. Não compartilhe essa chave publicamente.

## Como executar
Abra o terminal do VS Code na pasta principal do projeto e execute:

```bash
node scripts/atualizar-duracoes.js
```

O script procura automaticamente todas as séries, temporadas e episódios. Consulta somente episódios que tenham `youtubeId` preenchido e duração igual a `A definir`. Quando você adicionar novos IDs no futuro, basta executar o mesmo comando novamente.

Para apenas listar os episódios pendentes, sem consultar a API nem modificar arquivos:

```bash
node scripts/atualizar-duracoes.js --listar
```

## Como as durações são exibidas
A duração é arredondada para o minuto mais próximo:
- 08:35 → `9 min`
- 42:10 → `42 min`
- 01:25:40 → `1h 26min`

Vídeos privados, removidos, inválidos ou indisponíveis para a API permanecem como `A definir`.

## Segurança e preservação
- A chave fica no arquivo local `.env`, ignorado pelo Git.
- Antes de alterar `js/catalogo.js`, o script cria `js/catalogo.js.backup`.
- Títulos, IDs e durações já preenchidas são preservados.
- O script não roda no navegador nem é executado pelos visitantes do site.

