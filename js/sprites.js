/**
 * js/sprites.js
 * Gerenciador de Sprites e Animações para as Personagens (ScienceEco Girls):
 * - Personagem 1 (P1): Cientista Loira com Jaleco e Camisa Laranja
 * - Personagem 2 (P2): Cientista Negra com Cabelos Cacheados, Jaleco e Camisa Verde
 *
 * Características e Correções Implementadas:
 * 1. Preload Centralizado e Imediato de Imagens: Previne qualquer efeito de sprite piscando (flickering).
 * 2. Correção de Sprites Incompletos:
 *    - Caminhada para a Direita: As pastas originais tinham frames incompletos (4 frames em P1 e 6 em P2).
 *      Corrigido utilizando os 8 frames completos da Esquerda com espelhamento horizontal (flipX: true),
 *      garantindo uma caminhada com 8 frames super suave e ritmada em ambas as personagens.
 *    - Diagonais: Criadas por espelhamento horizontal da diagonal inferior direita.
 * 3. Correção do Ataque (Soco):
 *    - Os sprites originais de soco atacam para a direita. Ao socar virado para a esquerda (cos(angle) < 0),
 *      o sprite é espelhado horizontalmente (flipX: true).
 *    - O frame 4 (que era a personagem em pé de frente, o que causava "piscada" no meio do soco)
 *      foi descartado do ciclo ativo de golpe, tocando os 3 frames de ataque de impacto contínuo.
 * 4. Alinhamento de Pivô pelos Pés:
 *    - Pivô alinhado na base do calçado, eliminando trepidação (jitter) vertical e horizontal ao girar/andar.
 */

(function () {
  'use strict';

  class SpriteManager {
    constructor() {
      this.imageCache = new Map();
      this.isLoaded = false;
      this.loadedCount = 0;
      this.totalCount = 0;
      this.onLoadCallbacks = [];

      // Definições de Dimensões e Pivô nos Pés (baseado em análise bbox dos sprites)
      this.characterConfigs = {
        p1: {
          id: 'p1',
          name: 'Personagem 1',
          frameWidth: 96,
          frameHeight: 112,
          anchorX: 48,    // Centro horizontal (96 / 2)
          anchorY: 110,   // Base dos pés (2px da borda inferior)
          defaultScale: 0.75,
          fallbackPath: 'assets/p1/01_baixo_frente/baixo_01.png',
          animations: {
            idle_down: {
              frames: ['assets/p1/01_baixo_frente/baixo_01.png'],
              fps: 1,
              flipX: false
            },
            idle_up: {
              frames: ['assets/p1/02_cima_costas/cima_01.png'],
              fps: 1,
              flipX: false
            },
            idle_left: {
              frames: ['assets/p1/03_esquerda/esquerda_01.png'],
              fps: 1,
              flipX: false
            },
            idle_right: {
              frames: ['assets/p1/03_esquerda/esquerda_01.png'],
              fps: 1,
              flipX: true // Espelha esquerda para ter idle direita perfeito
            },
            idle_down_right: {
              frames: ['assets/p1/05_diagonal_baixo_direita/diag_baixo_direita_01.png'],
              fps: 1,
              flipX: false
            },
            idle_down_left: {
              frames: ['assets/p1/05_diagonal_baixo_direita/diag_baixo_direita_01.png'],
              fps: 1,
              flipX: true // Espelha diagonal direita para a esquerda
            },
            walk_down: {
              frames: [
                'assets/p1/01_baixo_frente/baixo_01.png',
                'assets/p1/01_baixo_frente/baixo_02.png',
                'assets/p1/01_baixo_frente/baixo_03.png',
                'assets/p1/01_baixo_frente/baixo_04.png',
                'assets/p1/01_baixo_frente/baixo_05.png',
                'assets/p1/01_baixo_frente/baixo_06.png',
                'assets/p1/01_baixo_frente/baixo_07.png',
                'assets/p1/01_baixo_frente/baixo_08.png'
              ],
              fps: 10,
              flipX: false
            },
            walk_up: {
              frames: [
                'assets/p1/02_cima_costas/cima_01.png',
                'assets/p1/02_cima_costas/cima_02.png',
                'assets/p1/02_cima_costas/cima_03.png',
                'assets/p1/02_cima_costas/cima_04.png',
                'assets/p1/02_cima_costas/cima_05.png',
                'assets/p1/02_cima_costas/cima_06.png',
                'assets/p1/02_cima_costas/cima_07.png',
                'assets/p1/02_cima_costas/cima_08.png'
              ],
              fps: 10,
              flipX: false
            },
            walk_left: {
              frames: [
                'assets/p1/03_esquerda/esquerda_01.png',
                'assets/p1/03_esquerda/esquerda_02.png',
                'assets/p1/03_esquerda/esquerda_03.png',
                'assets/p1/03_esquerda/esquerda_04.png',
                'assets/p1/03_esquerda/esquerda_05.png',
                'assets/p1/03_esquerda/esquerda_06.png',
                'assets/p1/03_esquerda/esquerda_07.png',
                'assets/p1/03_esquerda/esquerda_08.png'
              ],
              fps: 10,
              flipX: false
            },
            // Correção da Direita: Em vez dos 4 frames incompletos da pasta 04,
            // espelhamos os 8 frames completos da esquerda para obter animação fluida sem trancos.
            walk_right: {
              frames: [
                'assets/p1/03_esquerda/esquerda_01.png',
                'assets/p1/03_esquerda/esquerda_02.png',
                'assets/p1/03_esquerda/esquerda_03.png',
                'assets/p1/03_esquerda/esquerda_04.png',
                'assets/p1/03_esquerda/esquerda_05.png',
                'assets/p1/03_esquerda/esquerda_06.png',
                'assets/p1/03_esquerda/esquerda_07.png',
                'assets/p1/03_esquerda/esquerda_08.png'
              ],
              fps: 10,
              flipX: true
            },
            walk_down_right: {
              frames: [
                'assets/p1/05_diagonal_baixo_direita/diag_baixo_direita_01.png',
                'assets/p1/05_diagonal_baixo_direita/diag_baixo_direita_02.png',
                'assets/p1/05_diagonal_baixo_direita/diag_baixo_direita_03.png',
                'assets/p1/05_diagonal_baixo_direita/diag_baixo_direita_04.png'
              ],
              fps: 8,
              flipX: false
            },
            // Diagonal baixo-esquerda: Espelhamento da diagonal baixo-direita
            walk_down_left: {
              frames: [
                'assets/p1/05_diagonal_baixo_direita/diag_baixo_direita_01.png',
                'assets/p1/05_diagonal_baixo_direita/diag_baixo_direita_02.png',
                'assets/p1/05_diagonal_baixo_direita/diag_baixo_direita_03.png',
                'assets/p1/05_diagonal_baixo_direita/diag_baixo_direita_04.png'
              ],
              fps: 8,
              flipX: true
            },
            // Soco / Ataque: 3 frames de golpe contínuo (o 4º frame é neutro frontal e foi removido para evitar piscar)
            attack: {
              frames: [
                'assets/p1/08_soco/soco_01.png',
                'assets/p1/08_soco/soco_02.png',
                'assets/p1/08_soco/soco_03.png'
              ],
              fps: 12,
              flipX: false
            },
            combat: {
              frames: [
                'assets/p1/07_postura_combate/combate_01.png',
                'assets/p1/07_postura_combate/combate_02.png',
                'assets/p1/07_postura_combate/combate_03.png',
                'assets/p1/07_postura_combate/combate_04.png'
              ],
              fps: 6,
              flipX: false
            },
            'postura combate': {
              frames: [
                'assets/p1/07_postura_combate/combate_01.png',
                'assets/p1/07_postura_combate/combate_02.png',
                'assets/p1/07_postura_combate/combate_03.png',
                'assets/p1/07_postura_combate/combate_04.png'
              ],
              fps: 6,
              flipX: false
            },
            'postura_combate': {
              frames: [
                'assets/p1/07_postura_combate/combate_01.png',
                'assets/p1/07_postura_combate/combate_02.png',
                'assets/p1/07_postura_combate/combate_03.png',
                'assets/p1/07_postura_combate/combate_04.png'
              ],
              fps: 6,
              flipX: false
            },
            pickup: {
              frames: [
                'assets/p1/06_pegando_item_chao/pegando_item_01.png',
                'assets/p1/06_pegando_item_chao/pegando_item_02.png',
                'assets/p1/06_pegando_item_chao/pegando_item_03.png',
                'assets/p1/06_pegando_item_chao/pegando_item_04.png'
              ],
              fps: 9,
              flipX: false
            },
            // Dano: 4 frames acionados quando sofre qualquer tipo de ataque
            dano: {
              frames: [
                'assets/p1/dano/dano_loira_01.png',
                'assets/p1/dano/dano_loira_02.png',
                'assets/p1/dano/dano_loira_03.png',
                'assets/p1/dano/dano_loira_04.png'
              ],
              fps: 10,
              flipX: false,
              frameWidth: 128,
              frameHeight: 185,
              anchorX: 64,
              anchorY: 184,
              customScale: 0.417
            },
            // Afogamento: 6 frames exclusivos da primeira fase (Time Over)
            afogamento: {
              frames: [
                'assets/p1/afogamento/afogamento_loira_01.png',
                'assets/p1/afogamento/afogamento_loira_02.png',
                'assets/p1/afogamento/afogamento_loira_03.png',
                'assets/p1/afogamento/afogamento_loira_04.png',
                'assets/p1/afogamento/afogamento_loira_05.png',
                'assets/p1/afogamento/afogamento_loira_06.png'
              ],
              fps: 3,
              flipX: false,
              frameWidth: 133,
              frameHeight: 197,
              anchorX: 66,
              anchorY: 196,
              customScale: 0.392
            }
          }
        },

        p2: {
          id: 'p2',
          name: 'Personagem 2',
          frameWidth: 81,
          frameHeight: 115,
          anchorX: 40.5,  // Centro horizontal (81 / 2)
          anchorY: 111,   // Base dos pés (4px da borda inferior)
          defaultScale: 0.75,
          fallbackPath: 'assets/p2/bottom/bottom_01.png',
          animations: {
            idle_down: {
              frames: ['assets/p2/bottom/bottom_01.png'],
              fps: 1,
              flipX: false
            },
            idle_up: {
              frames: ['assets/p2/top/top_01.png'],
              fps: 1,
              flipX: false
            },
            idle_left: {
              frames: ['assets/p2/left/left_01.png'],
              fps: 1,
              flipX: false
            },
            idle_right: {
              frames: ['assets/p2/left/left_01.png'],
              fps: 1,
              flipX: true
            },
            idle_down_right: {
              frames: ['assets/p2/bottom-right/bottom-right_01.png'],
              fps: 1,
              flipX: false
            },
            idle_down_left: {
              frames: ['assets/p2/bottom-right/bottom-right_01.png'],
              fps: 1,
              flipX: true
            },
            walk_down: {
              frames: [
                'assets/p2/bottom/bottom_01.png',
                'assets/p2/bottom/bottom_02.png',
                'assets/p2/bottom/bottom_03.png',
                'assets/p2/bottom/bottom_04.png',
                'assets/p2/bottom/bottom_05.png',
                'assets/p2/bottom/bottom_06.png',
                'assets/p2/bottom/bottom_07.png',
                'assets/p2/bottom/bottom_08.png'
              ],
              fps: 10,
              flipX: false
            },
            // Caminhada de costas com 8 frames rítmicos sincronizados
            walk_up: {
              frames: [
                'assets/p2/top/top_01.png',
                'assets/p2/top/top_02.png',
                'assets/p2/top/top_03.png',
                'assets/p2/top/top_04.png',
                'assets/p2/top/top_05.png',
                'assets/p2/top/top_06.png',
                'assets/p2/top/top_07.png',
                'assets/p2/top/top_08.png'
              ],
              fps: 10,
              flipX: false
            },
            walk_left: {
              frames: [
                'assets/p2/left/left_01.png',
                'assets/p2/left/left_02.png',
                'assets/p2/left/left_03.png',
                'assets/p2/left/left_04.png',
                'assets/p2/left/left_05.png',
                'assets/p2/left/left_06.png',
                'assets/p2/left/left_07.png',
                'assets/p2/left/left_08.png'
              ],
              fps: 10,
              flipX: false
            },
            // Correção da Direita: Espelhamento da esquerda com 8 frames completos
            walk_right: {
              frames: [
                'assets/p2/left/left_01.png',
                'assets/p2/left/left_02.png',
                'assets/p2/left/left_03.png',
                'assets/p2/left/left_04.png',
                'assets/p2/left/left_05.png',
                'assets/p2/left/left_06.png',
                'assets/p2/left/left_07.png',
                'assets/p2/left/left_08.png'
              ],
              fps: 10,
              flipX: true
            },
            walk_down_right: {
              frames: [
                'assets/p2/bottom-right/bottom-right_01.png',
                'assets/p2/bottom-right/bottom-right_02.png',
                'assets/p2/bottom-right/bottom-right_03.png',
                'assets/p2/bottom-right/bottom-right_04.png'
              ],
              fps: 8,
              flipX: false
            },
            walk_down_left: {
              frames: [
                'assets/p2/bottom-right/bottom-right_01.png',
                'assets/p2/bottom-right/bottom-right_02.png',
                'assets/p2/bottom-right/bottom-right_03.png',
                'assets/p2/bottom-right/bottom-right_04.png'
              ],
              fps: 8,
              flipX: true
            },
            attack: {
              frames: [
                'assets/p2/ataque_soco/ataque_soco_01.png',
                'assets/p2/ataque_soco/ataque_soco_02.png',
                'assets/p2/ataque_soco/ataque_soco_03.png'
              ],
              fps: 12,
              flipX: false
            },
            // Novo estado independente no dicionario para a Personagem Negra (Sprint 21)
            ['idle_m\\u00E3o levantadas']: {
              frames: [
                'assets/p2/idle_maos_levantadas/idle_maos_levantadas_01.png',
                'assets/p2/idle_maos_levantadas/idle_maos_levantadas_02.png',
                'assets/p2/idle_maos_levantadas/idle_maos_levantadas_03.png',
                'assets/p2/idle_maos_levantadas/idle_maos_levantadas_04.png'
              ],
              fps: 6,
              flipX: false
            },
            ['idle_m\\u00E3os levantadas']: {
              frames: [
                'assets/p2/idle_maos_levantadas/idle_maos_levantadas_01.png',
                'assets/p2/idle_maos_levantadas/idle_maos_levantadas_02.png',
                'assets/p2/idle_maos_levantadas/idle_maos_levantadas_03.png',
                'assets/p2/idle_maos_levantadas/idle_maos_levantadas_04.png'
              ],
              fps: 6,
              flipX: false
            },
            ['idle_m\\u00E3o levantadas']: {
              frames: [
                'assets/p2/idle_maos_levantadas/idle_maos_levantadas_01.png',
                'assets/p2/idle_maos_levantadas/idle_maos_levantadas_02.png',
                'assets/p2/idle_maos_levantadas/idle_maos_levantadas_03.png',
                'assets/p2/idle_maos_levantadas/idle_maos_levantadas_04.png'
              ],
              fps: 6,
              flipX: false
            },
            idle_maos_levantadas: {
              frames: [
                'assets/p2/idle_maos_levantadas/idle_maos_levantadas_01.png',
                'assets/p2/idle_maos_levantadas/idle_maos_levantadas_02.png',
                'assets/p2/idle_maos_levantadas/idle_maos_levantadas_03.png',
                'assets/p2/idle_maos_levantadas/idle_maos_levantadas_04.png'
              ],
              fps: 6,
              flipX: false
            },
            pickup: {
              frames: [
                'assets/p2/pegando_item_chao/pegando_item_chao_01.png',
                'assets/p2/pegando_item_chao/pegando_item_chao_02.png',
                'assets/p2/pegando_item_chao/pegando_item_chao_03.png',
                'assets/p2/pegando_item_chao/pegando_item_chao_04.png'
              ],
              fps: 9,
              flipX: false
            },
            // Dano: 4 frames acionados quando sofre qualquer tipo de ataque
            dano: {
              frames: [
                'assets/p2/dano/dano_morena_01.png',
                'assets/p2/dano/dano_morena_02.png',
                'assets/p2/dano/dano_morena_03.png',
                'assets/p2/dano/dano_morena_04.png'
              ],
              fps: 10,
              flipX: false,
              frameWidth: 120,
              frameHeight: 188,
              anchorX: 60,
              anchorY: 187,
              customScale: 0.415
            },
            // Afogamento: 6 frames exclusivos da primeira fase (Time Over)
            afogamento: {
              frames: [
                'assets/p2/afogamento/afogamento_morena_01.png',
                'assets/p2/afogamento/afogamento_morena_02.png',
                'assets/p2/afogamento/afogamento_morena_03.png',
                'assets/p2/afogamento/afogamento_morena_04.png',
                'assets/p2/afogamento/afogamento_morena_05.png',
                'assets/p2/afogamento/afogamento_morena_06.png'
              ],
              fps: 3,
              flipX: false,
              frameWidth: 133,
              frameHeight: 213,
              anchorX: 66,
              anchorY: 212,
              customScale: 0.366
            }
          }
        },

        // ===================================================================
        // INIMIGOS (RATOS) - Escala visual menor que as personagens principais (~55px vs ~78px)
        // ===================================================================

        // Sprite Rato 1: Inimigo que ataca a atirar/lançar queijo
        rato1: {
          id: 'rato1',
          name: 'Rato Arremessador de Queijo',
          frameWidth: 242,
          frameHeight: 250,
          anchorX: 120,
          anchorY: 236,
          defaultScale: 0.23, // Escala menor que as personagens principais (~54px)
          fallbackPath: 'assets/enemies/rato1/01_Idle_Sentado/idle_sentado_01.png',
          animations: {
            idle: {
              frames: [
                'assets/enemies/rato1/01_Idle_Sentado/idle_sentado_01.png',
                'assets/enemies/rato1/01_Idle_Sentado/idle_sentado_02.png',
                'assets/enemies/rato1/01_Idle_Sentado/idle_sentado_03.png',
                'assets/enemies/rato1/01_Idle_Sentado/idle_sentado_04.png',
                'assets/enemies/rato1/01_Idle_Sentado/idle_sentado_05.png',
                'assets/enemies/rato1/01_Idle_Sentado/idle_sentado_06.png'
              ],
              fps: 7,
              flipX: false
            },
            walk: {
              frames: [
                'assets/enemies/rato1/02_Andar/andar_01.png',
                'assets/enemies/rato1/02_Andar/andar_02.png',
                'assets/enemies/rato1/02_Andar/andar_03.png',
                'assets/enemies/rato1/02_Andar/andar_04.png',
                'assets/enemies/rato1/02_Andar/andar_05.png',
                'assets/enemies/rato1/02_Andar/andar_06.png',
                'assets/enemies/rato1/02_Andar/andar_07.png',
                'assets/enemies/rato1/02_Andar/andar_08.png'
              ],
              fps: 10,
              flipX: false
            },
            run: {
              frames: [
                'assets/enemies/rato1/03_Correr/correr_01.png',
                'assets/enemies/rato1/03_Correr/correr_02.png',
                'assets/enemies/rato1/03_Correr/correr_03.png',
                'assets/enemies/rato1/03_Correr/correr_04.png',
                'assets/enemies/rato1/03_Correr/correr_05.png',
                'assets/enemies/rato1/03_Correr/correr_06.png',
                'assets/enemies/rato1/03_Correr/correr_07.png',
                'assets/enemies/rato1/03_Correr/correr_08.png'
              ],
              fps: 12,
              flipX: false
            },
            prepare: {
              frames: [
                'assets/enemies/rato1/04_Segurar_Queijo/segurar_queijo_01.png',
                'assets/enemies/rato1/04_Segurar_Queijo/segurar_queijo_02.png',
                'assets/enemies/rato1/04_Segurar_Queijo/segurar_queijo_03.png',
                'assets/enemies/rato1/04_Segurar_Queijo/segurar_queijo_04.png'
              ],
              fps: 8,
              flipX: false
            },
            attack: {
              frames: [
                'assets/enemies/rato1/05_Arremessar_Queijo/arremessar_queijo_01.png',
                'assets/enemies/rato1/05_Arremessar_Queijo/arremessar_queijo_02.png',
                'assets/enemies/rato1/05_Arremessar_Queijo/arremessar_queijo_03.png',
                'assets/enemies/rato1/05_Arremessar_Queijo/arremessar_queijo_04.png'
              ],
              fps: 10,
              flipX: false
            },
            hurt: {
              frames: [
                'assets/enemies/rato1/06_Susto_Dano/susto_dano_01.png',
                'assets/enemies/rato1/06_Susto_Dano/susto_dano_02.png',
                'assets/enemies/rato1/06_Susto_Dano/susto_dano_03.png',
                'assets/enemies/rato1/06_Susto_Dano/susto_dano_04.png'
              ],
              fps: 10,
              flipX: false
            },
            death: {
              frames: [
                'assets/enemies/rato1/07_Morte/morte_01.png',
                'assets/enemies/rato1/07_Morte/morte_02.png',
                'assets/enemies/rato1/07_Morte/morte_03.png',
                'assets/enemies/rato1/07_Morte/morte_04.png',
                'assets/enemies/rato1/07_Morte/morte_05.png',
                'assets/enemies/rato1/07_Morte/morte_06.png',
                'assets/enemies/rato1/07_Morte/morte_07.png',
                'assets/enemies/rato1/07_Morte/morte_08.png'
              ],
              fps: 9,
              flipX: false
            },
            celebrate: {
              frames: [
                'assets/enemies/rato1/08_Comemorar/comemorar_01.png',
                'assets/enemies/rato1/08_Comemorar/comemorar_02.png',
                'assets/enemies/rato1/08_Comemorar/comemorar_03.png',
                'assets/enemies/rato1/08_Comemorar/comemorar_04.png',
                'assets/enemies/rato1/08_Comemorar/comemorar_05.png',
                'assets/enemies/rato1/08_Comemorar/comemorar_06.png',
                'assets/enemies/rato1/08_Comemorar/comemorar_07.png',
                'assets/enemies/rato1/08_Comemorar/comemorar_08.png'
              ],
              fps: 8,
              flipX: false
            }
          }
        },

        // Sprite Rato 2: Inimigo que ataca a cuspir
        rato2: {
          id: 'rato2',
          name: 'Rato Cuspidor',
          frameWidth: 240,
          frameHeight: 250,
          anchorX: 120,
          anchorY: 240,
          defaultScale: 0.23, // Escala menor que as personagens principais (~55px)
          fallbackPath: 'assets/enemies/rato2/01_Idle_Sentado/idle_sentado_01.png',
          animations: {
            idle: {
              frames: [
                'assets/enemies/rato2/01_Idle_Sentado/idle_sentado_01.png',
                'assets/enemies/rato2/01_Idle_Sentado/idle_sentado_02.png',
                'assets/enemies/rato2/01_Idle_Sentado/idle_sentado_03.png',
                'assets/enemies/rato2/01_Idle_Sentado/idle_sentado_04.png',
                'assets/enemies/rato2/01_Idle_Sentado/idle_sentado_05.png',
                'assets/enemies/rato2/01_Idle_Sentado/idle_sentado_06.png'
              ],
              fps: 7,
              flipX: false
            },
            walk: {
              frames: [
                'assets/enemies/rato2/02_Andar/andar_01.png',
                'assets/enemies/rato2/02_Andar/andar_02.png',
                'assets/enemies/rato2/02_Andar/andar_03.png',
                'assets/enemies/rato2/02_Andar/andar_04.png',
                'assets/enemies/rato2/02_Andar/andar_05.png',
                'assets/enemies/rato2/02_Andar/andar_06.png',
                'assets/enemies/rato2/02_Andar/andar_07.png',
                'assets/enemies/rato2/02_Andar/andar_08.png'
              ],
              fps: 10,
              flipX: false
            },
            run: {
              frames: [
                'assets/enemies/rato2/03_Correr/correr_01.png',
                'assets/enemies/rato2/03_Correr/correr_02.png',
                'assets/enemies/rato2/03_Correr/correr_03.png',
                'assets/enemies/rato2/03_Correr/correr_04.png',
                'assets/enemies/rato2/03_Correr/correr_05.png',
                'assets/enemies/rato2/03_Correr/correr_06.png',
                'assets/enemies/rato2/03_Correr/correr_07.png',
                'assets/enemies/rato2/03_Correr/correr_08.png'
              ],
              fps: 12,
              flipX: false
            },
            attack: {
              frames: [
                'assets/enemies/rato2/04_Ataque_Cuspe/ataque_cuspe_01.png',
                'assets/enemies/rato2/04_Ataque_Cuspe/ataque_cuspe_02.png',
                'assets/enemies/rato2/04_Ataque_Cuspe/ataque_cuspe_03.png',
                'assets/enemies/rato2/04_Ataque_Cuspe/ataque_cuspe_04.png',
                'assets/enemies/rato2/04_Ataque_Cuspe/ataque_cuspe_05.png'
              ],
              fps: 9,
              flipX: false
            },
            hurt: {
              frames: [
                'assets/enemies/rato2/06_Dano/dano_01.png',
                'assets/enemies/rato2/06_Dano/dano_02.png',
                'assets/enemies/rato2/06_Dano/dano_03.png',
                'assets/enemies/rato2/06_Dano/dano_04.png'
              ],
              fps: 10,
              flipX: false
            },
            death: {
              frames: [
                'assets/enemies/rato2/07_Morte/morte_01.png',
                'assets/enemies/rato2/07_Morte/morte_02.png',
                'assets/enemies/rato2/07_Morte/morte_03.png',
                'assets/enemies/rato2/07_Morte/morte_04.png',
                'assets/enemies/rato2/07_Morte/morte_05.png',
                'assets/enemies/rato2/07_Morte/morte_06.png',
                'assets/enemies/rato2/07_Morte/morte_07.png'
              ],
              fps: 9,
              flipX: false
            },
            celebrate: {
              frames: [
                'assets/enemies/rato2/08_Comemorar/comemorar_01.png',
                'assets/enemies/rato2/08_Comemorar/comemorar_02.png',
                'assets/enemies/rato2/08_Comemorar/comemorar_03.png',
                'assets/enemies/rato2/08_Comemorar/comemorar_04.png',
                'assets/enemies/rato2/08_Comemorar/comemorar_05.png',
                'assets/enemies/rato2/08_Comemorar/comemorar_06.png',
                'assets/enemies/rato2/08_Comemorar/comemorar_07.png',
                'assets/enemies/rato2/08_Comemorar/comemorar_08.png'
              ],
              fps: 8,
              flipX: false
            }
          }
        },

        // Sprite Rato 3: Inimigo de curto alcance que ataca a arranhar
        rato3: {
          id: 'rato3',
          name: 'Rato Arranhador',
          frameWidth: 240,
          frameHeight: 250,
          anchorX: 120,
          anchorY: 240,
          defaultScale: 0.23, // Escala menor que as personagens principais (~55px)
          fallbackPath: 'assets/enemies/rato3/01_Idle_Sentado/idle_sentado_01.png',
          animations: {
            idle: {
              frames: [
                'assets/enemies/rato3/01_Idle_Sentado/idle_sentado_01.png',
                'assets/enemies/rato3/01_Idle_Sentado/idle_sentado_02.png',
                'assets/enemies/rato3/01_Idle_Sentado/idle_sentado_03.png',
                'assets/enemies/rato3/01_Idle_Sentado/idle_sentado_04.png',
                'assets/enemies/rato3/01_Idle_Sentado/idle_sentado_05.png',
                'assets/enemies/rato3/01_Idle_Sentado/idle_sentado_06.png'
              ],
              fps: 7,
              flipX: false
            },
            walk: {
              frames: [
                'assets/enemies/rato3/02_Andar/andar_01.png',
                'assets/enemies/rato3/02_Andar/andar_02.png',
                'assets/enemies/rato3/02_Andar/andar_03.png',
                'assets/enemies/rato3/02_Andar/andar_04.png',
                'assets/enemies/rato3/02_Andar/andar_05.png',
                'assets/enemies/rato3/02_Andar/andar_06.png',
                'assets/enemies/rato3/02_Andar/andar_07.png',
                'assets/enemies/rato3/02_Andar/andar_08.png'
              ],
              fps: 10,
              flipX: false
            },
            run: {
              frames: [
                'assets/enemies/rato3/03_Correr/correr_01.png',
                'assets/enemies/rato3/03_Correr/correr_02.png',
                'assets/enemies/rato3/03_Correr/correr_03.png',
                'assets/enemies/rato3/03_Correr/correr_04.png',
                'assets/enemies/rato3/03_Correr/correr_05.png',
                'assets/enemies/rato3/03_Correr/correr_06.png',
                'assets/enemies/rato3/03_Correr/correr_07.png',
                'assets/enemies/rato3/03_Correr/correr_08.png'
              ],
              fps: 13,
              flipX: false
            },
            attack: {
              frames: [
                'assets/enemies/rato3/04_Ataque_Garras/ataque_garras_01.png',
                'assets/enemies/rato3/04_Ataque_Garras/ataque_garras_02.png',
                'assets/enemies/rato3/04_Ataque_Garras/ataque_garras_03.png',
                'assets/enemies/rato3/04_Ataque_Garras/ataque_garras_04.png',
                'assets/enemies/rato3/04_Ataque_Garras/ataque_garras_05.png',
                'assets/enemies/rato3/04_Ataque_Garras/ataque_garras_06.png',
                'assets/enemies/rato3/04_Ataque_Garras/ataque_garras_07.png',
                'assets/enemies/rato3/04_Ataque_Garras/ataque_garras_08.png'
              ],
              fps: 14,
              flipX: false
            },
            hurt: {
              frames: [
                'assets/enemies/rato3/05_Dano/dano_01.png',
                'assets/enemies/rato3/05_Dano/dano_02.png',
                'assets/enemies/rato3/05_Dano/dano_03.png',
                'assets/enemies/rato3/05_Dano/dano_04.png'
              ],
              fps: 10,
              flipX: false
            },
            death: {
              frames: [
                'assets/enemies/rato3/06_Morte/morte_01.png',
                'assets/enemies/rato3/06_Morte/morte_02.png',
                'assets/enemies/rato3/06_Morte/morte_03.png',
                'assets/enemies/rato3/06_Morte/morte_04.png',
                'assets/enemies/rato3/06_Morte/morte_05.png',
                'assets/enemies/rato3/06_Morte/morte_06.png',
                'assets/enemies/rato3/06_Morte/morte_07.png'
              ],
              fps: 9,
              flipX: false
            },
            celebrate: {
              frames: [
                'assets/enemies/rato3/07_Comemorar/comemorar_01.png',
                'assets/enemies/rato3/07_Comemorar/comemorar_02.png',
                'assets/enemies/rato3/07_Comemorar/comemorar_03.png',
                'assets/enemies/rato3/07_Comemorar/comemorar_04.png',
                'assets/enemies/rato3/07_Comemorar/comemorar_05.png',
                'assets/enemies/rato3/07_Comemorar/comemorar_06.png',
                'assets/enemies/rato3/07_Comemorar/comemorar_07.png',
                'assets/enemies/rato3/07_Comemorar/comemorar_08.png'
              ],
              fps: 8,
              flipX: false
            }
          }
        },

        // ===================================================================
        // CHEFÃO FINAL (BOSS) - Utilizado apenas na última fase, escala visual MAIOR (~114px)
        // ===================================================================
        boss: {
          id: 'boss',
          name: 'Chefão Final (Rei Rato Radioativo)',
          frameWidth: 189,
          frameHeight: 190,
          anchorX: 95,
          anchorY: 186,
          defaultScale: 0.58, // Escala MAIOR que as personagens principais (~110px vs ~78px)
          fallbackPath: 'assets/enemies/boss/01_Idle/idle_01.png',
          animations: {
            idle: {
              frames: [
                'assets/enemies/boss/01_Idle/idle_01.png',
                'assets/enemies/boss/01_Idle/idle_02.png',
                'assets/enemies/boss/01_Idle/idle_03.png',
                'assets/enemies/boss/01_Idle/idle_04.png',
                'assets/enemies/boss/01_Idle/idle_05.png',
                'assets/enemies/boss/01_Idle/idle_06.png',
                'assets/enemies/boss/01_Idle/idle_07.png',
                'assets/enemies/boss/01_Idle/idle_08.png',
                'assets/enemies/boss/01_Idle/idle_09.png',
                'assets/enemies/boss/01_Idle/idle_10.png'
              ],
              fps: 8,
              flipX: false
            },
            walk: {
              frames: [
                'assets/enemies/boss/02_Andar/andar_01.png',
                'assets/enemies/boss/02_Andar/andar_02.png',
                'assets/enemies/boss/02_Andar/andar_03.png',
                'assets/enemies/boss/02_Andar/andar_04.png',
                'assets/enemies/boss/02_Andar/andar_05.png',
                'assets/enemies/boss/02_Andar/andar_06.png',
                'assets/enemies/boss/02_Andar/andar_07.png',
                'assets/enemies/boss/02_Andar/andar_08.png',
                'assets/enemies/boss/02_Andar/andar_09.png',
                'assets/enemies/boss/02_Andar/andar_10.png'
              ],
              fps: 9,
              flipX: false
            },
            walk_up: {
              frames: [
                'assets/enemies/boss/05_Andar_Costas/andar_costas_01.png',
                'assets/enemies/boss/05_Andar_Costas/andar_costas_02.png',
                'assets/enemies/boss/05_Andar_Costas/andar_costas_03.png',
                'assets/enemies/boss/05_Andar_Costas/andar_costas_04.png',
                'assets/enemies/boss/05_Andar_Costas/andar_costas_05.png',
                'assets/enemies/boss/05_Andar_Costas/andar_costas_06.png',
                'assets/enemies/boss/05_Andar_Costas/andar_costas_07.png'
              ],
              fps: 8,
              flipX: false
            },
            run: {
              frames: [
                'assets/enemies/boss/03_Correr/correr_01.png',
                'assets/enemies/boss/03_Correr/correr_02.png',
                'assets/enemies/boss/03_Correr/correr_03.png',
                'assets/enemies/boss/03_Correr/correr_04.png',
                'assets/enemies/boss/03_Correr/correr_05.png',
                'assets/enemies/boss/03_Correr/correr_06.png',
                'assets/enemies/boss/03_Correr/correr_07.png',
                'assets/enemies/boss/03_Correr/correr_08.png',
                'assets/enemies/boss/03_Correr/correr_09.png',
                'assets/enemies/boss/03_Correr/correr_10.png'
              ],
              fps: 11,
              flipX: false
            },
            ready_stance: {
              frames: [
                'assets/enemies/boss/04_Pose_Martelo/pose_martelo_01.png',
                'assets/enemies/boss/04_Pose_Martelo/pose_martelo_02.png',
                'assets/enemies/boss/04_Pose_Martelo/pose_martelo_03.png',
                'assets/enemies/boss/04_Pose_Martelo/pose_martelo_04.png'
              ],
              fps: 6,
              flipX: false
            },
            throw: {
              frames: [
                'assets/enemies/boss/06_Arremessar_Item/arremessar_item_01.png',
                'assets/enemies/boss/06_Arremessar_Item/arremessar_item_02.png',
                'assets/enemies/boss/06_Arremessar_Item/arremessar_item_03.png',
                'assets/enemies/boss/06_Arremessar_Item/arremessar_item_04.png',
                'assets/enemies/boss/06_Arremessar_Item/arremessar_item_05.png',
                'assets/enemies/boss/06_Arremessar_Item/arremessar_item_06.png',
                'assets/enemies/boss/06_Arremessar_Item/arremessar_item_07.png',
                'assets/enemies/boss/06_Arremessar_Item/arremessar_item_08.png',
                'assets/enemies/boss/06_Arremessar_Item/arremessar_item_09.png',
                'assets/enemies/boss/06_Arremessar_Item/arremessar_item_10.png'
              ],
              fps: 12,
              flipX: false
            },
            attack: {
              frames: [
                'assets/enemies/boss/07_Ataque_Martelo/ataque_martelo_01.png',
                'assets/enemies/boss/07_Ataque_Martelo/ataque_martelo_02.png',
                'assets/enemies/boss/07_Ataque_Martelo/ataque_martelo_03.png',
                'assets/enemies/boss/07_Ataque_Martelo/ataque_martelo_04.png',
                'assets/enemies/boss/07_Ataque_Martelo/ataque_martelo_05.png',
                'assets/enemies/boss/07_Ataque_Martelo/ataque_martelo_06.png',
                'assets/enemies/boss/07_Ataque_Martelo/ataque_martelo_07.png',
                'assets/enemies/boss/07_Ataque_Martelo/ataque_martelo_08.png',
                'assets/enemies/boss/07_Ataque_Martelo/ataque_martelo_09.png'
              ],
              fps: 11,
              flipX: false
            },
            flex: {
              frames: [
                'assets/enemies/boss/08_Flexionar/flexionar_01.png',
                'assets/enemies/boss/08_Flexionar/flexionar_02.png',
                'assets/enemies/boss/08_Flexionar/flexionar_03.png',
                'assets/enemies/boss/08_Flexionar/flexionar_04.png',
                'assets/enemies/boss/08_Flexionar/flexionar_05.png',
                'assets/enemies/boss/08_Flexionar/flexionar_06.png',
                'assets/enemies/boss/08_Flexionar/flexionar_07.png',
                'assets/enemies/boss/08_Flexionar/flexionar_08.png'
              ],
              fps: 8,
              flipX: false
            },
            celebrate: {
              frames: [
                'assets/enemies/boss/09_Comemorar/comemorar_01.png',
                'assets/enemies/boss/09_Comemorar/comemorar_02.png',
                'assets/enemies/boss/09_Comemorar/comemorar_03.png',
                'assets/enemies/boss/09_Comemorar/comemorar_04.png'
              ],
              fps: 6,
              flipX: false
            },
            death: {
              frames: [
                'assets/enemies/boss/10_Morte/morte_01.png',
                'assets/enemies/boss/10_Morte/morte_02.png',
                'assets/enemies/boss/10_Morte/morte_03.png',
                'assets/enemies/boss/10_Morte/morte_04.png',
                'assets/enemies/boss/10_Morte/morte_05.png',
                'assets/enemies/boss/10_Morte/morte_06.png',
                'assets/enemies/boss/10_Morte/morte_07.png',
                'assets/enemies/boss/10_Morte/morte_08.png',
                'assets/enemies/boss/10_Morte/morte_09.png'
              ],
              fps: 7,
              flipX: false
            }
          }
        }
      };

      // Inicializa o pré-carregamento imediato de todas as imagens
      this._preloadAllImages();
    }

    /**
     * Coleta todas as URLs únicas e pré-carrega na memória.
     */
    _preloadAllImages() {
      const urlsToLoad = new Set();

      for (const charKey in this.characterConfigs) {
        const char = this.characterConfigs[charKey];
        if (char.fallbackPath) urlsToLoad.add(char.fallbackPath);

        for (const animKey in char.animations) {
          const anim = char.animations[animKey];
          if (Array.isArray(anim.frames)) {
            anim.frames.forEach((url) => urlsToLoad.add(url));
          }
        }
      }

      // Pré-carrega projéteis de inimigos
      [
        'assets/enemies/rato2/05_Projetil_Gosma/projetil_gosma_01.png',
        'assets/enemies/rato2/05_Projetil_Gosma/projetil_gosma_02.png',
        'assets/enemies/rato2/05_Projetil_Gosma/projetil_gosma_03.png'
      ].forEach((url) => urlsToLoad.add(url));

      this.totalCount = urlsToLoad.size;
      this.loadedCount = 0;

      urlsToLoad.forEach((url) => {
        const img = new Image();
        img.onload = () => {
          this.loadedCount++;
          if (this.loadedCount >= this.totalCount) {
            this.isLoaded = true;
            this._flushLoadCallbacks();
          }
        };
        img.onerror = () => {
          console.warn(`[SpriteManager] Falha ao carregar sprite: ${url}`);
          this.loadedCount++;
          if (this.loadedCount >= this.totalCount) {
            this.isLoaded = true;
            this._flushLoadCallbacks();
          }
        };
        img.src = url;
        this.imageCache.set(url, img);
      });
    }

    _flushLoadCallbacks() {
      while (this.onLoadCallbacks.length > 0) {
        const cb = this.onLoadCallbacks.shift();
        try {
          cb();
        } catch (e) {
          console.error(e);
        }
      }
    }

    onReady(callback) {
      if (this.isLoaded) {
        callback();
      } else {
        this.onLoadCallbacks.push(callback);
      }
    }

    /**
     * Recupera a imagem em cache com garantia de fallback seguro contra telas brancas/piscamento
     */
    getImage(url, charKey = 'p1') {
      const img = this.imageCache.get(url);
      if (img && img.complete && img.naturalWidth > 0) {
        return img;
      }

      // Fallback para o frame inicial seguro já em memória
      const fallbackUrl = this.characterConfigs[charKey]?.fallbackPath;
      if (fallbackUrl && fallbackUrl !== url) {
        const fallbackImg = this.imageCache.get(fallbackUrl);
        if (fallbackImg && fallbackImg.complete && fallbackImg.naturalWidth > 0) {
          return fallbackImg;
        }
      }

      return null;
    }

    /**
     * Desenha a animação do personagem de forma limpa, com escala, espelhamento e ancoragem pelos pés.
     *
     * @param {CanvasRenderingContext2D} ctx
     * @param {string} charKey 'p1' ou 'p2'
     * @param {string} animName Nome da animação (ex: 'walk_down', 'idle_right', 'attack')
     * @param {number} frameIndex Índice do frame atual (será sanitizado com módulo)
     * @param {number} worldX Posição horizontal do centro do jogador
     * @param {number} footY Posição vertical do chão/pés do jogador (ex: player.y + halfSize)
     * @param {object} options Opções: overrideFlipX, scale, hitFlash, alpha
     */
    draw(ctx, charKey, animName, frameIndex, worldX, footY, options = {}) {
      const config = this.characterConfigs[charKey] || this.characterConfigs.p1;
      const keyStr = String(animName || '').trim();
      const normalizedKey = keyStr
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '_');
      const anim = (config.animations && (
                     config.animations[animName] ||
                     config.animations[keyStr] ||
                     config.animations[keyStr.toLowerCase()] ||
                     config.animations[normalizedKey] ||
                     config.animations[normalizedKey.replace(/_/g, ' ')]
                   )) ||
                   (config.animations && config.animations.idle) ||
                   (config.animations && config.animations.idle_down);
      if (!anim) return;
      const frames = anim.frames;

      if (!frames || frames.length === 0) return;

      // Sanitização estrita do índice de frame para nunca dar NaN ou fora de limites
      const safeIndex = Math.floor(Math.abs(frameIndex || 0)) % frames.length;
      const frameUrl = frames[safeIndex];

      const img = this.getImage(frameUrl, charKey);
      if (!img) return; // Fallback extremo se nenhuma imagem ainda estiver pronta

      const animAnchorX = anim.anchorX !== undefined ? anim.anchorX : config.anchorX;
      const animAnchorY = anim.anchorY !== undefined ? anim.anchorY : config.anchorY;
      const animFrameW = anim.frameWidth !== undefined ? anim.frameWidth : (img.naturalWidth || config.frameWidth);
      const animFrameH = anim.frameHeight !== undefined ? anim.frameHeight : (img.naturalHeight || config.frameHeight);

      const baseScale = anim.customScale !== undefined ? anim.customScale : config.defaultScale;
      let scale;
      if (options.scale !== undefined) {
        if (anim.customScale !== undefined && config.defaultScale) {
          // Mantém a proporção e dimensões exatas de animações especiais (ex: dano, afogamento)
          scale = anim.customScale * (options.scale / config.defaultScale);
        } else {
          scale = options.scale;
        }
      } else {
        scale = baseScale;
      }
      const flipX = options.overrideFlipX !== undefined ? options.overrideFlipX : (anim.flipX || false);

      const drawW = animFrameW * scale;
      const drawH = animFrameH * scale;
      const drawAnchorX = animAnchorX * scale;
      const drawAnchorY = animAnchorY * scale;

      ctx.save();

      // Desativa suavização bilinear para manter a pixel art límpida e sem cintilação
      ctx.imageSmoothingEnabled = false;

      // Posiciona na base dos pés com coordenadas arredondadas para evitar sub-pixel flickering
      ctx.translate(Math.round(worldX), Math.round(footY));

      if (flipX) {
        ctx.scale(-1, 1);
      }

      if (options.alpha !== undefined && options.alpha !== 1) {
        ctx.globalAlpha *= options.alpha;
      }

      // Desenha o sprite com o pivô exatamente sobre os pés do personagem
      ctx.drawImage(img, -drawAnchorX, -drawAnchorY, drawW, drawH);

      // Efeito de Hit Flash quando levar dano: silhueta vermelha limpa sobreposta exclusivamente nos pixels
      // Efeito de Hit Flash quando levar dano (Sprint 19 - Requisito 4):
      // Offscreen canvas com 'source-in' para colorir com precisÃ£o cirÃºrgica exclusivamente os pixels do sprite
      if (options.hitFlash) {
        if (!this._hitFlashCanvas) {
          this._hitFlashCanvas = document.createElement('canvas');
        }
        const offCanvas = this._hitFlashCanvas;
        offCanvas.width = animFrameW;
        offCanvas.height = animFrameH;
        const offCtx = offCanvas.getContext('2d');
        offCtx.clearRect(0, 0, animFrameW, animFrameH);
        offCtx.drawImage(img, 0, 0, animFrameW, animFrameH);
        offCtx.globalCompositeOperation = 'source-in';
        offCtx.fillStyle = 'rgba(239, 68, 68, 0.72)';
        offCtx.fillRect(0, 0, animFrameW, animFrameH);
        ctx.drawImage(offCanvas, -drawAnchorX, -drawAnchorY, drawW, drawH);
      }







      ctx.restore();
    }
  }

  // Instância singleton global acessível por todo o projeto
  window.SpriteManager = new SpriteManager();
})();
