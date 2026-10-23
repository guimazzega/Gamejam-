# Registro de Alterações — Editor de Mapas & Sprites (`CHANGE.md`)

Este documento descreve o funcionamento completo do **Editor de Mapas e Sprites (`js/editor.js`)**, o sistema de renderização de sprites customizados integrado ao motor do jogo e o passo a passo para exportar os mapas e remover o editor na versão final.

---

## 1. Visão Geral

Foi implementado um **Editor Visual In-Game de Mapas e Sprites** voltado exclusivamente para o desenvolvimento (**Dev-Only**). Ele permite:
- **Posicionar, mover, redimensionar, duplicar e excluir** qualquer elemento dos 4 cenários (`Mapa 1`, `Safe Room / A Van`, `Mapa 2` e `Mapa 3`).
- **Arrastar e soltar (Drag & Drop) arquivos de imagem externos** (`.png`, `.webp`, `.jpg`, `.gif`, `.svg`) diretamente do computador sobre qualquer entidade do jogo para trocar seu sprite em tempo real.
- **Exportar o arquivo `js/maps.js` pronto** com todas as coordenadas, novos objetos e sprites configurados.
- **Desacoplamento total da versão final**: toda a lógica e interface do editor vivem isoladas em [`js/editor.js`](js/editor.js). Para publicar a versão final do jogo sem o editor, basta remover uma única linha `<script>` do [`index.html`](index.html).

---

## 2. Como Abrir e Navegar no Editor

1. **Abrir / Fechar o Editor**:
   - Pressione a tecla **`F2`** a qualquer momento (inclusive a partir do Menu Principal) ou clique no botão flutuante **`🛠️ Map & Sprite Editor [F2]`** no canto inferior esquerdo da tela.
   - Enquanto o editor estiver aberto, o **cronômetro regressivo da fase** e o **avanço automático da Zona de Extração** ficam pausados automaticamente para você editar sem interrupções.
2. **Movimentação Livre da Câmera (Pan)**:
   - Segure o **Botão Direito do Mouse** (ou **Botão do Meio**, ou **`Espaço` + Clique Esquerdo**) e arraste para mover a câmera livremente por todo o mapa (`2500x2500px`).
3. **Troca Rápida de Mapa**:
   - Na barra superior do editor, use o seletor de mapas para alternar instantaneamente entre:
     - `Mapa 1: Floresta (2500x2500)`
     - `Safe Room: A Van (1440x920)`
     - `Mapa 2: Industrial (2500x2500)`
     - `Mapa 3: Subterrâneo (2500x2500)`
4. **Grid Snap (Alinhamento em Grade)**:
   - No menu **`Snap`** da barra superior, escolha entre `Livre (1px)`, `8px`, `16px`, `32px` ou `64px (Tile)` para alinhar objetos com precisão ao mover ou redimensionar.
5. **Modo Preview Limpo (`👁️ Preview Limpo`)**:
   - Clique no botão **`👁️ Preview Limpo`** na barra superior para ativar/desativar `window.hideDebugOverlays`.
   - Quando **ON**, todas as linhas de grade de debug, hitboxes pontilhadas, rótulos técnicos e coordenadas são ocultados, mostrando exatamente o visual limpo da versão final.

---

## 3. Ferramentas de Posicionamento e Criação no Mapa

Na barra superior do editor, você pode escolher entre as seguintes ferramentas:

| Ferramenta | Como Usar |
| :--- | :--- |
| **↖ Selecionar / Mover (`V`)** | Clique em qualquer objeto do mapa (Obstáculo, Prop, Jogador 1/2, Spawn P1/P2, Lixo, Estação ou Zona) para inspecioná-lo. Arraste o objeto para movê-lo ou puxe um dos **8 pontos brancos (handles)** nas bordas para redimensioná-lo. |
| **🧱 + Obstáculo** | Clique e arraste no mapa para desenhar uma nova parede ou estrutura sólida com **colisão ativa**. |
| **🌲 + Prop/Asset** | Clique e arraste no mapa para criar um objeto decorativo **sem colisão** (`noCollision: true`), permitindo que os jogadores passem por cima ou por trás dele. |
| **🟫 + Piso** | Clique e arraste para criar uma nova zona demarcada de piso/trilha (`floorZones`). |
| **🛒 + Estação** | Clique e arraste para criar uma nova estação interativa acionável com a tecla `E` (`interactiveStations`). |
| **♻️ + Lixo Fixo** | Clique em qualquer ponto do mapa para posicionar um item coletável de Lixo/Sucata em coordenadas fixas (`customTrash`). |

### Edição Fina no Painel Lateral (Inspector)
Ao selecionar qualquer elemento, o painel lateral direito exibe suas propriedades exatas:
- **Posição (`X`, `Y`)** e **Dimensões (`W`, `H`, `Tamanho`, `Rotação`)**.
- **Nome / Rótulo** e **Texto Flutuante de Interação (`[E]`)**.
- **Checkbox `"Apenas Decorativo / Sem Colisão"`**: permite converter qualquer obstáculo em prop atravessável (e vice-versa) a qualquer momento.
- **Botões `✨ Duplicar (Ctrl+D)` e `🗑️ Excluir (Del)`**.

---

## 4. Como Trocar Sprites via Drag & Drop (Arrastar e Soltar)

Você pode arrastar imagens (`.png`, `.webp`, `.jpg`, `.gif`, `.svg`) diretamente do Explorador de Arquivos do seu computador para dentro do navegador de **4 maneiras diferentes**:

### A. Soltar Diretamente Sobre uma Entidade no Canvas
- Arraste uma imagem do seu PC e passe o mouse por cima do objeto desejado no mapa (um contorno verde brilhante indicará o alvo).
- Solte o arquivo sobre:
  - **Jogador 1 ou Jogador 2**: substitui imediatamente o sprite daquele personagem.
  - **Obstáculo, Prop, Zona de Piso, Estação da Van ou Zona de Extração**: aplica o sprite diretamente naquela estrutura.
  - **Item de Lixo no Chão**: aplica o sprite ao item e ao tipo de lixo correspondente.
  - **Marcador de Spawn P1 / P2**: adiciona um sprite ao ponto de spawn.

### B. Soltar em um Espaço Vazio do Mapa (Criação Instantânea de Asset)
- Se você arrastar uma ou mais imagens do seu PC e soltá-las em uma **área vazia do chão**, o editor cria automaticamente um **novo objeto posicionado naquelas coordenadas** já com o sprite aplicado e mantendo a proporção da imagem.
- **Dica para Background do Mapa**: segure a tecla **`Shift`** enquanto solta uma imagem em um espaço vazio do mapa para defini-la como o **Fundo (Background) completo do mapa atual** (podendo escolher entre modo *Esticar / Stretch* ou *Repetir / Tile Pattern* no painel lateral).

### C. Customizar Sprites das Armas/Itens da Hotbar (5 Slots) e Tipos de Lixo
- **Itens da Hotbar (Slots 1 a 5)**: no painel lateral direito, clique nos botões rápidos **`🧑 Jogador 1`** ou **`🧑 Jogador 2`**. Na seção **"🎒 Sprites dos Itens da Hotbar"**, arraste imagens sobre qualquer um dos 5 slots para atualizar o ícone na Hotbar, no Menu de Pausa e na mão do personagem.
- **Tipos Globais de Lixo**: na seção **"Sprites Globais por Tipo de Lixo"** do painel lateral, arraste uma imagem sobre `Sucata Metálica`, `Lata Amassada`, `Plástico Descartado`, `Bateria Velha` ou `Placa Quebrada` para atualizar todos os itens daquele tipo em todos os mapas.

### D. Biblioteca de Sprites e Modo de Armazenamento (`Base64` vs. `assets/`)
- Toda imagem arrastada fica registrada na **Biblioteca de Sprites** no canto inferior direito do editor: basta selecionar outro objeto no mapa e clicar na miniatura da biblioteca para reutilizar o mesmo sprite.
- No seletor acima da biblioteca, você pode escolher como o editor grava os sprites:
  1. **`Base64 Embutido` (Padrão)**: converte a imagem em uma Data URL (`data:image/...`) embutida dentro do próprio `js/maps.js`. Funciona instantaneamente em qualquer lugar sem precisar copiar arquivos de imagem.
  2. **`Pasta assets/nome.png`**: referencia o caminho relativo `assets/<nome_do_arquivo>` (ou qualquer caminho que você digitar manualmente no campo de texto do Inspector).

---

## 5. Salvamento Automático e Exportação para a Versão Final

### Salvamento Automático (`localStorage`)
- Enquanto você edita, todas as alterações de posição, tamanho e sprites são salvas automaticamente no `localStorage` do navegador (`expedicao2d_editor_state_v1`). Se você recarregar a página (`F5`), seu trabalho continua intacto.
- Caso queira descartar o cache local e voltar ao estado original do código, clique no botão **`↺ Resetar`** na barra superior do editor.

### Passo a Passo para Gerar a Versão Final (Sem o Editor)

1. Com suas edições prontas no editor, clique no botão amarelo **`💾 Salvar maps.js`** na barra superior do editor:
   - Em navegadores baseados em Chromium (Chrome/Edge), escolha salvar diretamente sobre o arquivo [`js/maps.js`](js/maps.js) do projeto (ou substitua o arquivo `js/maps.js` pelo arquivo baixado).
   - Alternativamente, clique em **`📋 Copiar`** e cole o conteúdo dentro de [`js/maps.js`](js/maps.js).
2. Abra o arquivo [`index.html`](index.html) e **remova apenas a linha do script do editor** no final do `<body>`:
   ```html
   <!-- Remova a linha abaixo na versão final: -->
   <script src="js/editor.js"></script>
   ```
3. Pronto! O motor principal do jogo ([`js/config.js`](js/config.js), [`js/entities.js`](js/entities.js), [`js/main.js`](js/main.js) e [`js/ui.js`](js/ui.js)) possui suporte nativo à leitura dos dados e ao `window.SpriteCache`, renderizando todos os seus mapas, posições e sprites customizados sem nenhum código ou interface do editor presente.

---

## 6. Resumo de Atalhos do Editor

| Atalho / Ação | Função |
| :--- | :--- |
| `F2` | Abre ou fecha o **Editor de Mapas & Sprites** |
| `Clique Esquerdo` | Seleciona entidade no mapa, arrasta para mover ou puxa os 8 handles para redimensionar |
| `Botão Direito + Arrastar` | Move a câmera livremente pelo mapa (*Pan*) |
| `Espaço + Clique Esquerdo` | Alternativa para mover a câmera livremente pelo mapa (*Pan*) |
| `V` | Volta rapidamente para a ferramenta **Selecionar / Mover** |
| `Ctrl + D` | Duplica a entidade selecionada (`Obstáculo`, `Prop`, `Piso`, `Estação` ou `Lixo`) |
| `Delete` ou `Backspace` | Exclui a entidade selecionada do mapa |
| `Shift + Soltar Imagem no Vazio` | Define a imagem arrastada como **Background do Mapa** atual |
