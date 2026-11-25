# NETFLIX 2% — Versão 1.10

## Miniaturas dos episódios nos resultados da pesquisa

- Os resultados de episódios agora exibem a miniatura do vídeo correspondente no YouTube, usando o ID já cadastrado em `js/catalogo.js`.
- A miniatura é carregada diretamente de `img.youtube.com`; não é necessário salvar imagens manualmente no projeto.
- Os textos dos resultados permanecem sobre a imagem, com uma camada escura em gradiente para manter a leitura.
- Se um episódio não tiver ID do YouTube, o card mantém o fundo padrão.
- Se a miniatura não carregar, ela é ocultada e o fundo padrão continua disponível.
- O link de cada resultado continua abrindo o episódio correto no player.


## Pesquisa de séries e episódios

- A pesquisa da página inicial agora encontra séries pelo nome, categoria e descrição.
- Também percorre os episódios das três séries e encontra a numeração (por exemplo, `Episódio 001`).
- O campo `descricao` de cada episódio foi mantido como o espaço para você cadastrar o título real do episódio. Quando esse texto provisório for substituído, a pesquisa também encontrará o episódio pelo título informado.
- Cada resultado de episódio contém um link direto para sua página no player.
- A numeração original dos episódios e os IDs do YouTube foram preservados.
- Não foi criado um campo de descrição separado nesta versão.

## Sobre a tentativa anterior de imagem de fundo

O ZIP recebido para esta versão não contém o arquivo `assets/imagemfundoprincipal.png` nem referências a esse nome nos arquivos da página inicial. Por isso, a versão 1.7 mantém o destaque original, que utiliza o banner da série em destaque. Nenhuma imagem de fundo adicional foi adicionada.

---

# NETFLIX 2% — Etapa 4: imagens e catálogo atualizado

## O que foi atualizado

- O catálogo agora considera 3 séries, cada uma com 1 temporada.
- A VIDA 2%: 245 episódios.
- AS 48 LEIS DA RETENÇÃO SEMINAL: 6 episódios.
- A VOZ DOS 2%: 3 episódios.
- Total atual: 254 episódios.
- Os cards da página inicial agora usam proporção vertical 2:3, adequada às capas de streaming.
- Corrigido o carregamento das capas: agora são exibidas por elemento `<img>`, com fallback automático para as capas SVG incluídas no projeto.
- As imagens provisórias foram substituídas por caminhos reservados para suas imagens PNG.

## Onde colocar as imagens

Coloque os arquivos com estes nomes exatos:

### Capas verticais — `assets/posters/`
- `avidadoisporcentocapa.png`
- `48leisretencaoseminalcapa.png`
- `avozdos2porcentocapa.png`

### Banners horizontais — `assets/banners/`
- `avidadoisporcentobanner.png`
- `48leisretencaoseminalbanner.png`
- `avozdos2porcentobanner.png`

Os nomes precisam coincidir com os caminhos definidos em `js/catalogo.js`. Se preferir outros nomes, altere os caminhos nesse arquivo.

**Correção de carregamento das capas:** os cards agora usam uma imagem HTML (`<img>`) em vez de depender somente de uma imagem de fundo CSS. Se a capa PNG não for encontrada (por exemplo, por diferença no nome ou ausência do arquivo), o site carrega automaticamente uma capa SVG provisória que já acompanha o projeto. Assim, os cards não ficam sem imagem. Quando a PNG correta estiver no local esperado, ela será exibida no lugar da provisória.

## Como os episódios são gerados

No arquivo `js/catalogo.js`, a função `criarEpisodios(quantidade)` cria os registros numerados automaticamente. Cada série informa sua quantidade na chamada da função:

- `criarEpisodios(245)`
- `criarEpisodios(6)`
- `criarEpisodios(3)`

Por enquanto, os títulos são genéricos (Episódio 001, Episódio 002 etc.), as descrições são provisórias e os campos `youtubeId` estão vazios. Isso significa que os episódios aparecem no catálogo, mas ainda não reproduzem vídeos. Não foram inventados links ou IDs do YouTube.

Quando for cadastrar um vídeo, substitua o `youtubeId: ""` daquele episódio pelo ID do vídeo do YouTube. Também poderá editar o título, a descrição e a duração.

**Importante:** a função gera os episódios na memória do navegador; ela não cria 254 blocos manualmente no HTML.

## Como executar

1. Extraia a pasta do ZIP.
2. Abra a pasta `netflix-2` no VS Code.
3. Inicie o Live Server pelo arquivo `index.html`.
4. Clique em **VER SÉRIE** para consultar a lista de episódios.

## O que ainda não está implementado

- Reprodução dos vídeos do YouTube (próxima etapa).
- Login, cadastro e permissões reais.
- Histórico, continuar assistindo e Minha lista persistentes.
- Painel administrativo e banco de dados.

Essas funções não devem ser consideradas ativas apenas porque aparecem como opções na interface.

# Etapa 5 — Player de vídeos do YouTube

## O que foi implementado

- Nova página `pages/assistir.html` com player responsivo em proporção 16:9.
- Incorporação de vídeos do YouTube usando o endereço de privacidade aprimorada (`youtube-nocookie.com`).
- A lista de episódios agora permite abrir a página de reprodução correspondente.
- Navegação para episódio anterior e próximo, inclusive entre temporadas, caso novas temporadas sejam adicionadas ao catálogo.
- Se o episódio não tiver ID cadastrado, a página mostra uma tela de “em breve”.
- Se a série ou o episódio não existir, uma mensagem apropriada é exibida.

## Onde colocar o ID de cada vídeo

Abra `js/catalogo.js`. Dentro de cada série existe um objeto de IDs, com um campo vazio para cada episódio. Por exemplo:

```js
episodios: criarEpisodios(245, {
  1: "", // Episódio 001
  2: "", // Episódio 002
  3: "", // Episódio 003
})
```

Cole somente o ID entre as aspas do episódio correspondente. Exemplo ilustrativo:

```js
1: "a1B2c3D4e5F", // Episódio 001
```

O ID é a parte que vem depois de `v=` em um endereço como `https://www.youtube.com/watch?v=a1B2c3D4e5F`. O código também reconhece links comuns do YouTube, mas recomendamos colar somente o ID.

Cada série tem seu próprio objeto de IDs:

- **A VIDA 2%:** 245 campos, numerados de 1 a 245.
- **AS 48 LEIS DA RETENÇÃO SEMINAL:** 6 campos, numerados de 1 a 6.
- **A VOZ DOS 2%:** 3 campos, numerados de 1 a 3.

Não altere a quantidade em `criarEpisodios()` para cadastrar um vídeo. Basta preencher o campo do episódio. Títulos, descrições e duração continuam editáveis na função `criarEpisodios()` em uma etapa futura de personalização do catálogo.

## Limitações importantes

- O projeto ainda não tem banco de dados nem painel administrativo; os IDs são cadastrados manualmente no arquivo JavaScript.
- O vídeo precisa permitir incorporação nas configurações do YouTube. Vídeos privados, removidos, restritos ou com incorporação desativada podem não reproduzir.
- A página não consegue detectar todos os motivos externos de falha do YouTube; nesses casos, o próprio player pode exibir a mensagem de indisponibilidade.
- Login, histórico, continuar assistindo, Minha lista e permissões reais ainda não estão implementados.

## Como testar

1. Extraia o ZIP e abra a pasta `netflix-2` no VS Code.
2. Inicie o Live Server pelo `index.html`.
3. Abra uma série e clique em qualquer episódio.
4. Sem ID cadastrado, será exibida a tela “em breve”.
5. Para testar a reprodução, cole o ID de um vídeo seu ou de um vídeo público que permita incorporação no campo do episódio correspondente em `js/catalogo.js`, salve e atualize a página.

# Etapa 5 — Miniaturas automáticas dos episódios

- Na página de cada série, os episódios que possuem `youtubeId` cadastrado agora exibem automaticamente a miniatura correspondente do YouTube.
- A miniatura é carregada de `i.ytimg.com` usando o ID do vídeo; não é necessário baixar, salvar ou renomear imagens manualmente.
- Episódios sem ID continuam exibindo a arte provisória com o número do episódio.
- Se a miniatura não estiver disponível, o card retorna automaticamente à arte provisória.
- O player incorporado do YouTube também apresenta a prévia do próprio vídeo antes da reprodução.

Para trocar a miniatura, basta alterar o ID do YouTube no episódio em `js/catalogo.js`. Os dois IDs que você já compartilhou foram mantidos nos episódios 001 e 002 de **A VIDA 2%**.

## Etapa 6 — Adaptação para dispositivos móveis

Esta etapa acrescenta ajustes responsivos para a página inicial, página da série e player de episódios.

### O que foi ajustado
- Cabeçalho e navegação da página inicial em telas estreitas.
- Campo de busca, botões e textos com dimensões adequadas para toque.
- Área de destaque, catálogo e cards reorganizados para celulares.
- Banners, descrição e seletor de temporada na página da série.
- Lista de episódios com miniaturas, informações e botão de acesso reorganizados.
- Player do YouTube dimensionado proporcionalmente à largura disponível.
- Controles de episódio e rodapé reorganizados em telas pequenas.
- Estados de foco visíveis e respeito à preferência por movimento reduzido.

### Larguras consideradas
Os estilos incluem ajustes para telas de até 850 px, 650 px, 620 px, 600 px, 480 px, 380 px, 360 px e 340 px. O layout também mantém as regras existentes para telas maiores.

### Observação sobre imagens personalizadas
Os caminhos das capas e banners cadastrados em `js/catalogo.js` foram mantidos. Se as imagens personalizadas já estiverem na sua pasta local `assets/posters/` e `assets/banners/`, preserve esses arquivos ao atualizar o projeto. Esta atualização não precisa substituir imagens nem alterar os IDs dos vídeos.

### Como atualizar sem perder seus arquivos
1. Faça uma cópia de segurança da pasta atual `netflix-2`.
2. Extraia este ZIP.
3. Copie os arquivos da pasta extraída para dentro da sua pasta atual `netflix-2`, permitindo substituir os arquivos de mesmo nome.
4. Não apague as pastas `assets/posters/` e `assets/banners/`; mantenha nelas suas imagens personalizadas.
5. Abra novamente o `index.html` pelo Live Server e teste as páginas em diferentes larguras.

A responsividade foi implementada em CSS. Ainda é importante conferir o resultado em aparelhos físicos, pois navegadores, proporções de tela e comportamento do YouTube podem variar.

22222

## Versão 1.8 — títulos individuais dos episódios

- Os 254 episódios possuem um espaço individual para cadastrar seu título no objeto `titulosEpisodios` em `js/catalogo.js`.
- A numeração `Episódio 001`, `Episódio 002` etc. continua separada e automática.
- O campo `descricao` do episódio recebe o texto de `titulosEpisodios`, e a pesquisa da versão 1.7 já procura esse conteúdo.
- Nenhum título foi inventado; os campos começam vazios.
- Os IDs do YouTube foram preservados.


## Melhorias visuais desta versão

- Alternância entre tema escuro e claro, com preferência salva localmente no dispositivo.
- Controle de tema disponível na página inicial, na página da série e no player.
- Animações discretas de entrada durante a rolagem e microinterações em cards e botões.
- Respeito à preferência do sistema por movimento reduzido.
- Ajustes de contraste, superfícies, bordas, sombras e profundidade nos dois temas.
