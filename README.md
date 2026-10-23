# Protótipo Base 2D Top-Down (Debug / Developer Mode)

Protótipo jogável em **Modo Debug (Developer Mode)** inspirado na fluidez de controles, câmera e estética de interface de *Stardew Valley*. Desenvolvido com **HTML5 Canvas, CSS3 e JavaScript Modular** autocontido (sem dependências externas).

## Como Executar
Basta abrir o arquivo [`index.html`](index.html) diretamente no navegador (ou utilizar a extensão *Live Server* no VS Code).

## Estrutura Modular do Projeto
- [`index.html`](index.html): Estrutura de camadas de UI (HUD In-Game, Menu Principal, Modal de Configurações Placeholder e Menu de Pausa/Inventário) e Canvas 2D.
- [`css/style.css`](css/style.css): Estilização inspirada em *Stardew Valley* combinada com painéis táticos de telemetria de Debug.
- [`js/config.js`](js/config.js): Constantes de física, câmera, inventários de placeholder e configuração da Máquina de Estados de Fases.
- [`js/maps.js`](js/maps.js): Definição dos **3 Mapas Grandes (`2500x2500px`)** e da **Safe Room (`A Van`)**, incluindo paletas de cores distintas, trilhas de referência, obstáculos de colisão e Zonas de Extração.
- [`js/input.js`](js/input.js): Gerenciamento de teclado e scroll do mouse (com `e.preventDefault()` na tecla `Tab`, `Espaço` e `Setas`).
- [`js/entities.js`](js/entities.js): Classe `Player` com movimentação fluida em 8 direções (velocidade diagonal normalizada), colisão AABB com deslize em paredes e indicadores visuais de debug.
- [`js/camera.js`](js/camera.js): Câmera 2D com interpolação suave (`Lerp`), foco no personagem ativo (Singleplayer) ou ponto médio entre P1 e P2 (Multiplayer Local), respeitando os limites (*boundaries*) do mapa.
- [`js/ui.js`](js/ui.js): Sincronização da HUD (Barras de HP, Timer `03:00`, Hotbar estilo *Stardew Valley* e Menus).
- [`js/main.js`](js/main.js): Loop principal (`requestAnimationFrame`), máquina de estados e renderização de debug (grid, coordenadas, hitboxes, bússola de extração e minimapa).

## Controles e Atalhos de Desenvolvedor (Debug Keys)
| Tecla / Ação | Função |
| :--- | :--- |
| `W, A, S, D` | Movimenta o personagem ativo (Singleplayer) ou o **Jogador 1** (Multiplayer Local) |
| `Setas Direcionais` | Movimenta o **Jogador 2** (no modo Multiplayer Local) |
| `Tab` | Alterna instantaneamente o controle entre **Personagem 1** e **Personagem 2** (Singleplayer) |
| `1` a `6` / `Scroll` | Alterna o slot selecionado na Hotbar inferior |
| `E` ou `Espaço` | Interage com a **Zona de Extração** ou **Porta da Van** para avançar de fase |
| `Esc` ou `P` | Abre/fecha o **Menu de Pausa e Inventário** |
| `H` *(Debug)* | Causa **-10 HP** de dano no personagem em foco |
| `J` *(Debug)* | Restaura **+20 HP** no personagem em foco |
| `N` *(Debug)* | Força o avanço imediato para o próximo estado (`Mapa 1 -> Van -> Mapa 2 -> Van -> Mapa 3`) |

