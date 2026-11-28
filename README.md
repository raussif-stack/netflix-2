# NETFLIX 2% — v1.33.0

## Novidades desta versão
- Controle circular para alternar a ordem dos episódios entre crescente e decrescente na página de cada série.
- A seta correspondente à ordem ativa recebe destaque visual; a ordem crescente é o padrão.
- A ordenação altera apenas a apresentação da lista: numeração, catálogo original, favoritos e links dos episódios permanecem intactos.
- A ordem selecionada vale durante a navegação pela página; ao abrir novamente, a lista começa em ordem crescente.
- Cache do PWA atualizado para a versão 1.33.0.

---

# NETFLIX 2% — v1.32.0

## Novidades desta versão
- Favoritar episódios individualmente com estrela: contorno quando não favoritado e dourada preenchida quando favoritado.
- Favoritos de episódios armazenados separadamente dos favoritos de séries no navegador (`localStorage`).
- Os favoritos permanecem neste dispositivo e navegador; não há sincronização entre aparelhos ou contas.
- Cache do PWA atualizado para a versão 1.32.0.

---

# NETFLIX 2% — Versão 1.30.0 BETA

## Consolidação e auditoria do projeto
- Revisão estrutural da versão 1.29.0, preservando o catálogo, as páginas, o player, os favoritos de séries, o histórico, o progresso e a instalação PWA.
- O Service Worker agora tenta armazenar cada recurso do núcleo separadamente. Se um arquivo isolado falhar, isso não cancela o cache dos demais recursos nem a instalação do novo Service Worker.
- A versão do cache PWA foi atualizada para `v1.30.0`, para que instalações existentes reconheçam a nova versão.
- Adicionado `scripts/validar-projeto.js`, uma auditoria estática sem dependências externas para conferir catálogo, numeração, IDs de vídeo, imagens, manifesto e recursos do cache.
- Nenhuma das três novas funcionalidades planejadas (voltar ao topo, favoritar episódios e inverter a ordem dos episódios) foi antecipada nesta versão.

## Estado do catálogo nesta versão
- 4 séries e 258 episódios cadastrados.
- 257 episódios possuem ID do YouTube; 1 episódio permanece sem ID.
- Os IDs de vídeo cadastrados são únicos na verificação estática.

## Como executar a auditoria
Na pasta raiz do projeto, com Node.js instalado, execute:

```bash
node scripts/validar-projeto.js
```

A auditoria verifica a estrutura e os dados locais. Ela não substitui testes reais no navegador, no Android, na Vercel ou na reprodução do YouTube.

---

## Correções PWA — versão 1.28.1 BETA
- O cache inicial agora tenta armazenar cada recurso individualmente; a falha de um arquivo isolado não cancela toda a instalação do Service Worker.
- O aviso de atualização apresenta estado de processamento e permite tentar novamente se a ativação não for concluída dentro do tempo esperado.
- O manifesto mantém um único nome (`manifest.webmanifest`) e inicia o aplicativo pela raiz (`./`).
- A reprodução de vídeos continua fora do cache do Service Worker.
- A instalação no Android ainda precisa ser confirmada em dispositivo real após a publicação.

## PWA instalável — versão 1.28.1 BETA

- Manifesto `manifest.webmanifest` com nome, cores, modo standalone e ícones do aplicativo.
- Ícones PNG em 192×192 e 512×512.
- Registro do Service Worker nas páginas inicial, série e player.
- Cache do núcleo local do aplicativo e cache de recursos locais acessados.
- Estratégia de rede primeiro para navegação, com fallback para páginas armazenadas.
- Atualizações detectadas pelo Service Worker com aviso para o usuário aplicar a nova versão.
- Arquivos de vídeo e conteúdo de terceiros (incluindo YouTube) não são armazenados pelo cache do aplicativo.
- O catálogo, as páginas e os recursos locais já armazenados podem abrir offline; reprodução de vídeos do YouTube exige internet.
- Instalação exige HTTPS ou ambiente local (`localhost`). A hospedagem na Vercel atende ao requisito HTTPS.

# NETFLIX 2% — Versão 1.28.1 BETA

> Atualização 1.18.0: sistema de favoritos locais para séries, com controles na página inicial e na página individual, seção de favoritas e filtro dedicado.

## Favoritos locais — versão 1.18.0
- Adicionar e remover séries dos favoritos diretamente nos cards da página inicial.
- Adicionar e remover séries na página individual.
- Seção dedicada às séries favoritas, com acesso direto à página de cada série.
- Filtro “Favoritas” integrado aos filtros de categoria.
- Persistência no `localStorage`, usando a chave `netflix2-favorite-series-v1`.
- Os favoritos são locais ao navegador/dispositivo e não sincronizam entre aparelhos.
- A funcionalidade “Minha Lista” permanece separada e pausada até o planejamento de cadastro, autenticação e usuários.

# NETFLIX 2% — Versão 1.13.0 BETA

> Versão de refinamento: **1.12.5 BETA** (microinterações, estados de carregamento, disponibilidade visual e responsividade).


> Atualização 1.13.0: evolução da página inicial, panorama dinâmico do catálogo, filtros por categoria e refinamento do carrossel.

## Página inicial — versão 1.13.0

- Novo panorama do catálogo com quantidade dinâmica de séries, episódios e IDs de vídeo cadastrados.
- Filtros de categoria gerados automaticamente a partir dos valores existentes no catálogo; a opção “Todas as séries” restaura a visualização completa.
- Os filtros são ocultados durante uma pesquisa para não misturar os dois modos de navegação. Ao limpar a pesquisa, a categoria selecionada volta a ser aplicada.
- O destaque principal agora informa a quantidade de episódios e vídeos cadastrados na série em destaque.
- Os cards de séries mostram a quantidade de episódios e vídeos cadastrados em cada produção.
- Setas do carrossel indicam quando não há mais conteúdo para navegar naquela direção; o gesto horizontal no celular continua disponível.
- Os números são calculados diretamente a partir de `js/catalogo.js`; não foram inventadas datas de lançamento ou de inclusão.

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


## Melhorias de navegação e histórico

- **Carrossel de séries:** a página inicial apresenta as capas em uma faixa horizontal; use as setas no computador ou deslize no celular. Durante uma pesquisa, os resultados continuam em grade.
- **Ir para episódio:** na página de cada série, selecione a temporada, informe o número do episódio e pressione Enter ou clique em IR.
- **Continue explorando:** os últimos oito episódios abertos aparecem na página inicial. O histórico fica salvo no `localStorage` do navegador e pode ser apagado pelo botão "Limpar histórico". Ele não sincroniza entre dispositivos nem exige conta.

## YouTube IFrame Player API (1.13.1 BETA)

A página `pages/assistir.html` carrega a IFrame Player API oficial do YouTube. O player inclui `enablejsapi=1` e o parâmetro `origin` para permitir a comunicação entre a página e o iframe. Não é necessária chave de API nem configuração de faturamento para essa API.

A integração atualiza o estado do carregamento quando o player fica pronto, identifica o encerramento do episódio e trata os códigos de erro mais comuns (ID inválido, vídeo indisponível, incorporação bloqueada e falha de identificação da origem). Se o script da API estiver indisponível, o iframe ainda pode ser exibido normalmente pelo carregamento direto do YouTube.

## Versão 1.14.0 BETA — evolução do player

- Ao detectar o encerramento pelo evento `YT.PlayerState.ENDED`, o player exibe uma tela própria sobre o vídeo.
- Quando existe um episódio seguinte na ordem do catálogo, a tela oferece a opção de avançar manualmente e inicia uma contagem regressiva de 10 segundos.
- O avanço automático pode ser cancelado; o link para o próximo episódio continua disponível para navegação manual.
- A navegação automática envia `autoplay=1` para tentar iniciar o próximo vídeo. A reprodução automática com som pode ser bloqueada pelas políticas do navegador ou do dispositivo; nesse caso, o usuário pode iniciar o vídeo pelo próprio YouTube.
- No último episódio cadastrado, a tela informa que não há próximo episódio e oferece a opção de rever.
- O botão de rever retorna ao início do vídeo usando a IFrame Player API.
- Os estados de reprodução, pausa, carregamento e encerramento atualizam a mensagem de status da página.
- Erros recuperáveis de reprodução e identificação da origem oferecem um botão para tentar carregar novamente.
- O histórico local e os dados do catálogo permanecem com a estrutura anterior.

### Testes recomendados

1. Reproduzir um episódio e aguardar o encerramento.
2. Conferir a contagem regressiva e o avanço para o episódio seguinte.
3. Repetir o teste e cancelar o avanço automático.
4. Usar o botão de rever.
5. Abrir o último episódio de uma série e confirmar que não aparece um próximo episódio inexistente.
6. Testar em celular e computador. O comportamento de autoplay pode variar conforme navegador e dispositivo.


## 1.15.0 BETA — Navegação aprimorada do player

- Navegação entre episódios na mesma página, atualizando o player sem recarregar o documento.
- Painel expansível com episódios da temporada atual, título adicional e duração cadastrada.
- Atalhos: ←/→ para episódios anterior/próximo, Espaço para pausar/reproduzir e Esc para fechar o painel ou voltar à série.
- Metadados do episódio atual e atualização do endereço com histórico do navegador.
- Mantidos o encerramento, a contagem regressiva, o cancelamento do avanço automático e o tratamento de erros da IFrame Player API.


## 1.16.0 BETA — Retomada e progresso dos episódios

- Salva localmente o ponto de reprodução enquanto o episódio está tocando.
- Oferece continuar de onde parou ou recomeçar quando existe progresso salvo.
- Marca automaticamente episódios concluídos ao receber o evento de término do YouTube.
- Mostra na lista os estados não assistido, em andamento e assistido, com indicador visual de progresso.
- Os dados ficam no `localStorage` do navegador/dispositivo; não há sincronização entre aparelhos nem sistema de contas.


## 1.17.0 BETA — Descoberta e retomada na página inicial

- Seção Continue assistindo com progresso e retomada direta.
- Histórico de episódios reproduzidos recentemente.
- Filtro do catálogo por disponibilidade de vídeos, combinado com as categorias existentes.
- Progresso consultado a partir das chaves locais criadas pelo player 1.16.0.
- Dados mantidos no localStorage do navegador/dispositivo.


## 1.18.0 BETA — Favoritos locais
- Favoritar e desfavoritar séries pela capa da página inicial ou pela página individual da série.
- Seção de séries favoritas e filtro dedicado no catálogo.
- Persistência local pela chave `netflix2-favorite-series-v1`; sem contas ou sincronização entre dispositivos.
- A funcionalidade `Minha Lista` permanece separada e não foi implementada nesta versão.


## 1.19.0 BETA — Central de atividades

- Histórico de reprodução ampliado para até 100 episódios recentes, sem duplicatas.
- Remoção individual de registros do histórico.
- Remoção individual do progresso de episódios em andamento.
- Limpeza do histórico com confirmação, preservando o progresso salvo para retomada.
- Controles de gerenciamento responsivos e acessíveis.
- Dados continuam locais no navegador e dispositivo; não há sincronização entre aparelhos.


## 1.20.0 BETA — Pesquisa avançada

- Filtro para exibir séries e episódios juntos ou separadamente.
- Filtro por categoria do catálogo.
- Filtro de episódios e séries com ou sem vídeos cadastrados.
- Ordenação por relevância, ordem alfabética ou quantidade de episódios.
- Botão para limpar os filtros e retornar aos padrões.
- Painel responsivo, exibido quando há um termo de pesquisa.
- Preserva a busca tolerante a pequenos erros, os títulos personalizados, as miniaturas e o catálogo existente.


## 1.21.0 BETA — recomendações personalizadas

- Adiciona a seção “Recomendado para você” na página inicial.
- Organiza até três sugestões com base nas categorias das séries favoritas, no histórico recente e nos episódios em andamento.
- Exibe o motivo de cada sugestão e um atalho para abrir a página da série.
- Quando não há atividade registrada, apresenta sugestões iniciais com base no catálogo e na disponibilidade de vídeos.
- Atualiza as recomendações quando favoritos, histórico ou progresso são alterados.
- As informações usadas para personalizar ficam no `localStorage` do navegador; não há conta, sincronização entre dispositivos nem envio desses dados para um servidor.
- Mantém intactos o catálogo, a pesquisa avançada, os favoritos, o histórico e o progresso existentes.


## 1.22.0 BETA — suporte aprimorado a múltiplas temporadas

- Adiciona seletor de temporada dentro do painel de episódios do player, permitindo explorar outra temporada sem sair da reprodução atual.
- Exibe o total de episódios concluídos e em andamento na temporada selecionada no player.
- A lista do player destaca o episódio atual somente quando a temporada exibida corresponde à temporada em reprodução.
- A página da série apresenta progresso de conclusão por temporada, usando o progresso local já salvo.
- O seletor de temporadas mostra a quantidade de episódios concluídos em cada temporada.
- Links de retorno do player preservam a temporada e o episódio de origem; a página da série abre na temporada correta e localiza o episódio solicitado.
- A identificação de progresso continua separada por série, temporada e episódio, sem migração ou perda dos dados já salvos.
- Mantém o catálogo atual (4 séries e 258 episódios), sem criar temporadas ou episódios fictícios.


# NETFLIX 2% — Versão 1.23.0 BETA

## Identidade visual dos episódios e miniaturas
- As miniaturas da página de série agora tentam carregar a melhor resolução disponível do YouTube: `maxresdefault`, `sddefault`, `hqdefault`, `mqdefault` e `default`.
- Se uma resolução não existir ou retornar uma imagem-placeholder pequena, o carregamento tenta automaticamente a próxima opção.
- Os cards exibem o número do episódio, um título curto sobre a miniatura e um indicador visual de reprodução.
- Episódios sem vídeo cadastrado recebem uma arte de disponibilidade “EM BREVE”, mantendo o padrão visual da lista.
- A miniatura usa carregamento tardio (`loading="lazy"`) e decodificação assíncrona para reduzir trabalho inicial da página.
- Os IDs de vídeo, títulos, durações, descrições e estrutura do catálogo foram preservados.
- As miniaturas continuam sendo fornecidas pelo YouTube; nenhuma imagem externa foi copiada para o projeto.


# NETFLIX 2% — Versão 1.24.0 BETA

## Categorias e coleções
- Nova área de descoberta na página inicial, com categorias calculadas diretamente a partir dos valores de `categoria` em `js/catalogo.js`.
- Cada categoria mostra quantas séries estão cadastradas e permite filtrar o catálogo com um único comando.
- Coleções temáticas agrupam categorias já existentes, sem duplicar ou alterar os registros das séries.
- Os cards das coleções usam os pôsteres já cadastrados, com carregamento tardio e fallback de imagem quando disponível.
- O botão de cada coleção aplica o filtro correspondente na seção de séries.
- Layout responsivo para desktop, tablet e celular; controles com foco visível e suporte a preferência por movimento reduzido.
- Não foram adicionadas séries, episódios, categorias fictícias ou dados de usuário. Favoritos, histórico, progresso, recomendações e pesquisa permanecem independentes.


## 1.25.0 BETA — Controles avançados do player

- Barra de progresso interativa com tempo atual e duração.
- Busca na reprodução e saltos de 10 segundos para trás/à frente.
- Controles de reproduzir/pausar, volume e silenciar.
- Seletor de velocidade (0,5× a 2×), conforme suporte do vídeo pelo YouTube.
- Acesso à tela cheia.
- Atalhos K (reproduzir/pausar), J/L (buscar 10 segundos) e M (silenciar).
- Controles ativados quando a YouTube IFrame Player API fica pronta e desativados sem player válido.
- Interface responsiva e compatível com os temas existentes.

Os comandos operam por meio da YouTube IFrame Player API. A disponibilidade de algumas velocidades pode variar conforme o vídeo e o próprio YouTube.


## 1.26.0 BETA — Reprodução contínua

- Preferência de reprodução automática do próximo episódio, ativada por padrão para preservar o comportamento anterior.
- Preferência salva localmente no navegador (`netflix2-auto-next-v1`).
- Com reprodução automática ativada, o player exibe contagem regressiva de 10 segundos ao terminar um episódio.
- Com a opção desativada, a tela de encerramento permanece disponível sem iniciar o próximo episódio sozinha.
- O usuário pode avançar imediatamente pelo comando de próximo episódio ou cancelar a contagem regressiva.
- A navegação usa a ordem global do catálogo: ao terminar uma temporada, segue para a próxima temporada cadastrada; no último episódio da série, encerra sem tentar avançar.
- Histórico e progresso continuam sendo registrados pelas chaves existentes.
- A preferência é local ao navegador/dispositivo e não é sincronizada entre dispositivos.


## 1.27.0 BETA — Player responsivo e adaptativo

- Refinamento do player para celulares pequenos, celulares maiores e tablets, com ajustes de largura, espaçamento, tipografia e organização dos controles.
- Em telas sensíveis ao toque, controles e ações recebem áreas de interação maiores para facilitar o uso com os dedos.
- Barra de progresso com área de toque ampliada e controles reorganizados em grade no celular.
- Em celulares na orientação horizontal, o cabeçalho e as informações do episódio ficam mais compactos e o vídeo aproveita melhor a altura disponível.
- Ajustes para telas muito estreitas e para aparelhos com pouca altura útil, além de suporte a áreas seguras da tela (`viewport-fit=cover`).
- Estados de foco visíveis para navegação por teclado e respeito à preferência do sistema por movimento reduzido.
- Mantém a YouTube IFrame Player API, os controles avançados, o histórico, o progresso, a retomada e a reprodução automática da versão 1.26.0.
- Não altera IDs de vídeos, catálogo, títulos, durações ou dados salvos no navegador.

A adaptação visual depende das dimensões e dos recursos oferecidos pelo navegador e pelo dispositivo. A rotação da tela não é forçada pelo site; o layout responde à orientação escolhida pelo usuário.


## v1.28.2 — PWA simplificado

- Removido o aviso/botão manual de atualização.
- Registro do Service Worker simplificado e com escopo explícito na raiz (`/`).
- Manifesto único com URLs absolutas para início, escopo e ícones.
- `vercel.json` define o MIME type correto do manifesto e evita cache prolongado dos arquivos de controle do PWA.
- O Service Worker ativa a nova versão automaticamente, sem interface de atualização.

A instalação no Chrome Android ainda precisa ser confirmada depois do deploy, com os arquivos publicados na raiz do projeto.


## v1.31.0 BETA — botão voltar ao topo

- Adicionado botão flutuante circular no canto inferior direito da página inicial.
- O botão aparece depois que a pessoa percorre 350 pixels da página e desaparece novamente próximo ao topo.
- Um clique retorna ao início com rolagem suave.
- Respeita a preferência do dispositivo por movimento reduzido.
- Inclui rótulo acessível, foco visível, adaptação para telas pequenas e áreas seguras do dispositivo.
- Versão do cache do PWA atualizada para `v1.31.0`.
