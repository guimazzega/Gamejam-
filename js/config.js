/**
 * js/config.js
 * Configurações globais, constantes de física/câmera, inventário de placeholder
 * e definição da Máquina de Estados de Fases.
 */

window.GameConfig = {
  // Configurações de Grid e Escala
  TILE_SIZE: 64,
  MAJOR_GRID_STEP: 320, // A cada 5 tiles (320px), linha de referência forte com coordenadas

  // Tempo padrão de cada fase (em segundos) -> 03:00
  STAGE_DURATION_SECONDS: 180,

  // Configurações dos Jogadores
  PLAYER_SPEED: 290, // pixels por segundo (fluido estilo Stardew Valley)
  PLAYER_SIZE: 40,   // hitbox quadrada 40x40px
  PLAYER_MAX_HP: 100,

  // Suavização da câmera (Lerp factor)
  CAMERA_LERP: 7.5,

  // Sequência oficial da Máquina de Estados do Mundo:
  // Mapa 1 -> Safe Room (Van) -> Mapa 2 -> Safe Room (Van) -> Mapa 3
  STAGE_FLOW: [
    {
      stateId: 'MAP_1',
      mapKey: 'map1',
      stepIndex: 0,
      label: 'Mapa 1: Arredores Florestais [Setor Alpha]',
      isSafeRoom: false
    },
    {
      stateId: 'VAN_1',
      mapKey: 'van',
      stepIndex: 1,
      label: 'Safe Room: Interior / Arredores da Van (Transição 1→2)',
      isSafeRoom: true
    },
    {
      stateId: 'MAP_2',
      mapKey: 'map2',
      stepIndex: 2,
      label: 'Mapa 2: Distrito Industrial [Setor Beta]',
      isSafeRoom: false
    },
    {
      stateId: 'VAN_2',
      mapKey: 'van',
      stepIndex: 3,
      label: 'Safe Room: Interior / Arredores da Van (Transição 2→3)',
      isSafeRoom: true
    },
    {
      stateId: 'MAP_3',
      mapKey: 'map3',
      stepIndex: 4,
      label: 'Mapa 3: Complexo Subterrâneo [Setor Gamma]',
      isSafeRoom: false
    }
  ],

  // Inventário de Armas / Itens de Placeholder (6 Slots na Hotbar)
  createDefaultInventoryP1() {
    return [
      {
        slot: 1,
        id: 'pistol_debug',
        name: 'Pistola [Debug]',
        shortName: 'Pistola',
        icon: '🔫',
        type: 'Arma [Placeholder]',
        color: '#38bdf8'
      },
      {
        slot: 2,
        id: 'flashlight_debug',
        name: 'Lanterna [Debug]',
        shortName: 'Lanterna',
        icon: '🔦',
        type: 'Utilitário [Placeholder]',
        color: '#facc15'
      },
      {
        slot: 3,
        id: 'shotgun_debug',
        name: 'Escopeta [Debug]',
        shortName: 'Escopeta',
        icon: '💥',
        type: 'Arma [Placeholder]',
        color: '#fb923c'
      },
      {
        slot: 4,
        id: 'medkit_debug',
        name: 'Kit Médico [Debug]',
        shortName: 'Kit Médico',
        icon: '➕',
        type: 'Suprimento [Placeholder]',
        color: '#4ade80'
      },
      {
        slot: 5,
        id: 'empty_5',
        name: 'Vazio',
        shortName: 'Vazio',
        icon: '·',
        type: 'Slot Livre',
        isEmpty: true,
        color: '#64748b'
      },
      {
        slot: 6,
        id: 'empty_6',
        name: 'Vazio',
        shortName: 'Vazio',
        icon: '·',
        type: 'Slot Livre',
        isEmpty: true,
        color: '#64748b'
      }
    ];
  },

  createDefaultInventoryP2() {
    return [
      {
        slot: 1,
        id: 'smg_debug',
        name: 'Submetralhadora [Debug]',
        shortName: 'SMG',
        icon: '🔫',
        type: 'Arma [Placeholder]',
        color: '#fb923c'
      },
      {
        slot: 2,
        id: 'flashlight_p2',
        name: 'Lanterna Tática [Debug]',
        shortName: 'Lanterna',
        icon: '🔦',
        type: 'Utilitário [Placeholder]',
        color: '#facc15'
      },
      {
        slot: 3,
        id: 'radar_debug',
        name: 'Scanner de Pulso [Debug]',
        shortName: 'Scanner',
        icon: '📡',
        type: 'Utilitário [Placeholder]',
        color: '#22d3ee'
      },
      {
        slot: 4,
        id: 'medkit_p2',
        name: 'Bandagem [Debug]',
        shortName: 'Bandagem',
        icon: '🩹',
        type: 'Suprimento [Placeholder]',
        color: '#4ade80'
      },
      {
        slot: 5,
        id: 'empty_p2_5',
        name: 'Vazio',
        shortName: 'Vazio',
        icon: '·',
        type: 'Slot Livre',
        isEmpty: true,
        color: '#64748b'
      },
      {
        slot: 6,
        id: 'empty_p2_6',
        name: 'Vazio',
        shortName: 'Vazio',
        icon: '·',
        type: 'Slot Livre',
        isEmpty: true,
        color: '#64748b'
      }
    ];
  }
};

