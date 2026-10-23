# Protótipo Base 2D Top-Down (Sprint 2 • Debug / Developer Mode)

Protótipo jogável em **Modo Debug (Developer Mode)** inspirado na fluidez de controles, câmera e estética de interface de *Stardew Valley*. Desenvolvido com **HTML5 Canvas, CSS3 e JavaScript Modular** autocontido (sem dependências externas).

## Como Executar
Basta abrir o arquivo [`index.html`](index.html) diretamente no navegador (ou utilizar a extensão *Live Server* no VS Code).

## Funcionalidades da Sprint 2
1. **Menu de Configurações Funcional**:
   - Acessível tanto pelo **Menu Principal** quanto pelo **Menu de Pausa**.
   - **Tela Cheia (Fullscreen)**: Alterna o modo tela cheia usando `document.documentElement.requestFullscreen()`.
   - **Muta/Desmuta Áudio**: Controla a variável global booleana `window.isMuted`.
   - **Fogo Amigo (Friendly Fire)**: Controla a variável global booleana `window.friendlyFireEnabled` exibindo status `ON` / `OFF`.
2. **Ajustes Específicos do Modo Multiplayer Local**:
   - **Trava de Câmera/Movimentação (Clamp)**: Os jogadores não podem sair dos limites visíveis da câmera (*Viewport*). Tentativas de se afastar além das bordas da tela são bloqueadas naquela direção.
   - **Nova HUD Separada para Multiplayer**:
     - **Vida (HP)**: Barra de Vida do **Jogador 1** no *canto superior esquerdo* e Barra de Vida do **Jogador 2** no *canto superior direito*.
     - **Inventários (Hotbars)**: Inventário de 5 slots do **Jogador 1** alinhado verticalmente no *centro-esquerdo* (encostado na borda) e do **Jogador 2** alinhado verticalmente no *centro-direito*.
     - **Controles de Inventário**: **Jogador 1** alterna seus slots com as teclas numéricas (`1` a `5`); **Jogador 2** alterna seus slots com a rodinha do mouse (`Mouse Scroll`).
3. **Mecânica de Coleta (Lixo pelo Mapa)**:
   - Geração aleatória de entidades visuais identificadas como `"LIXO"` pelo chão dos 3 mapas grandes (`2500x2500px`).
   - Ao passar por cima ou encostar no lixo, o item desaparece e incrementa o contador global `window.scrapCollected` (**Sucata/Lixo Coletado**), exibido discretamente na HUD superior e no Menu de Pausa.
4. **Atualização da Safe Room (Van)**:
   - Layout expandido (`1440x920px`) com duas novas estações demarcadas visualmente e com caixas de colisão:
     - **Lojinha (Shop)**: Exibe o aviso flutuante `"Pressione [E] para Loja (Em desenvolvimento)"` ao encostar.
     - **Mesa de Craft (Crafting)**: Exibe o aviso flutuante `"Pressione [E] para Crafting (Em desenvolvimento)"` ao encostar.

## Estrutura Modular do Projeto
- [`index.html`](index.html): Camadas de UI (HUD Singleplayer/Multiplayer, Menu Principal, Modal de Configurações Funcional e Menu de Pausa/Inventário) e Canvas 2D.
- [`css/style.css`](css/style.css): Estilização inspirada em *Stardew Valley*, hotbars verticais nas bordas laterais, toggles de configuração e telemetria de Debug.
- [`js/config.js`](js/config.js): Variáveis globais (`window.isMuted`, `window.friendlyFireEnabled`, `window.scrapCollected`), constantes de física/câmera, tipos de lixo e inventários de 5 slots.
- [`js/maps.js`](js/maps.js): Definição dos **3 Mapas Grandes (`2500x2500px`)** e da **Safe Room Expandida (`A Van`)** com as estações de **Lojinha (Shop)** e **Mesa de Craft (Crafting)**.
- [`js/input.js`](js/input.js): Gerenciamento de teclado (`1` a `5`, `WASD`, `Setas`, `Tab`, `E`, `Esc`) e scroll do mouse.
- [`js/entities.js`](js/entities.js): Classes `Player` (com colisão AABB e Clamp de Viewport no Multiplayer), `TrashItem` (objetos coletáveis de Lixo) e `FloatingText`.
- [`js/camera.js`](js/camera.js): Câmera 2D com interpolação suave (`Lerp`), foco no personagem ativo (Singleplayer) ou ponto médio enquadrado (Multiplayer Local).
- [`js/ui.js`](js/ui.js): Sincronização da HUD, alternância automática entre HUD Singleplayer e HUD Separada Multiplayer, contador de sucata e configurações.
- [`js/main.js`](js/main.js): Loop principal (`requestAnimationFrame`), geração/coleta de lixo, interações da Safe Room e renderização de debug.

## Controles e Atalhos de Desenvolvedor (Debug Keys)
| Tecla / Ação | Função |
| :--- | :--- |
| `W, A, S, D` | Movimenta o personagem ativo (Singleplayer) ou o **Jogador 1** (Multiplayer Local) |
| `Setas Direcionais` | Movimenta o **Jogador 2** (no modo Multiplayer Local) |
| `Tab` | Alterna instantaneamente o controle entre **Jogador 1** e **Jogador 2** (Singleplayer) |
| `1` a `5` | Seleciona o slot da Hotbar do **Jogador 1** (Multiplayer) ou do personagem ativo (Singleplayer) |
| `Scroll do Mouse` | Alterna o slot da Hotbar do **Jogador 2** (Multiplayer) ou do personagem ativo (Singleplayer) |
| `E` ou `Espaço` | Interage com a **Zona de Extração**, **Porta da Van**, **Lojinha** ou **Mesa de Craft** |
| `Esc` ou `P` | Abre/fecha o **Menu de Pausa e Inventário** (ou fecha o Modal de Configurações) |
| `H` *(Debug)* | Causa **-10 HP** de dano no personagem em foco |
| `J` *(Debug)* | Restaura **+20 HP** no personagem em foco |
| `N` *(Debug)* | Força o avanço imediato para o próximo estado (`Mapa 1 -> Van -> Mapa 2 -> Van -> Mapa 3`) |
