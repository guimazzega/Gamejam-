/**
 * js/config.js
 * Configurações globais, constantes de física/câmera, variáveis globais de configurações,
 * Dicionário Global de Inputs (Config.Controls), estado global de persistência de lixos,
 * inventário de placeholder (5 slots) e definição da Máquina de Estados de Fases.
 */

// Variáveis globais de Configuração e Progresso (Sprints 2 & 3)
window.isMuted = false;
window.friendlyFireEnabled = false;
window.scrapCollected = 0;

// Estado Global de Persistência de Lixos Coletados (Sprint 3)
// Armazena os IDs únicos dos lixos já coletados para que nunca reapareçam caso o jogador saia e volte para a fase
window.collectedTrashIds = new Set();

window.GlobalState = {
  collectedTrashIds: window.collectedTrashIds,
  isTrashCollected(trashId) {
    return window.collectedTrashIds.has(trashId);
  },
  markTrashCollected(trashId) {
    if (!window.collectedTrashIds.has(trashId)) {
      window.collectedTrashIds.add(trashId);
      window.scrapCollected = window.collectedTrashIds.size;
      return true;
    }
    return false;
  },
  resetAllTrash() {
    window.collectedTrashIds.clear();
    window.scrapCollected = 0;
  }
};

// Dicionário Padrão de Controles (para restauração rápida se necessário)
const DEFAULT_CONTROLS = {
  // Jogador 1 (e Jogador Ativo no Singleplayer)
  P1_Up: 'KeyW',
  P1_Down: 'KeyS',
  P1_Left: 'KeyA',
  P1_Right: 'KeyD',
  P1_Attack: 'KeyR',
  P1_Attack_Mouse: 'MouseRight',
  P1_Inventory: 'KeyQ',
  P1_Slot1: 'Digit1',
  P1_Slot2: 'Digit2',
  P1_Slot3: 'Digit3',
  P1_Slot4: 'Digit4',
  P1_Slot5: 'Digit5',

  // Jogador 2 (Multiplayer Local)
  P2_Up: 'ArrowUp',
  P2_Down: 'ArrowDown',
  P2_Left: 'ArrowLeft',
  P2_Right: 'ArrowRight',
  P2_Attack: 'Digit0',
  P2_Attack_Alt: 'Numpad0',
  P2_Inventory: 'KeyO',

  // Ações de Sistema / Interação / Debug
  SwitchPlayer: 'Tab',
  Interact: 'KeyE',
  InteractAlt: 'Space',
  Pause: 'Escape',
  PauseAlt: 'KeyP',
  DebugDamage: 'KeyH',
  DebugHeal: 'KeyJ',
  DebugNextStage: 'KeyN'
};

window.GameConfig = {
  // Dicionário Global de Inputs (Sprint 3: ex. Config.Controls.P1_Up)
  Controls: { ...DEFAULT_CONTROLS },

  resetDefaultControls() {
    Object.assign(this.Controls, DEFAULT_CONTROLS);
  },

  // Utilitário para exibir nomes amigáveis das teclas na UI e HUD
  formatKeyCode(code) {
    if (!code) return '---';
    const map = {
      ArrowUp: 'Seta ↑',
      ArrowDown: 'Seta ↓',
      ArrowLeft: 'Seta ←',
      ArrowRight: 'Seta →',
      Space: 'Espaço',
      Tab: 'Tab',
      Escape: 'Esc',
      ShiftLeft: 'Shift Esq',
      ShiftRight: 'Shift Dir',
      ControlLeft: 'Ctrl Esq',
      ControlRight: 'Ctrl Dir',
      AltLeft: 'Alt Esq',
      AltRight: 'Alt Dir',
      Enter: 'Enter',
      Backspace: 'Backspace',
      MouseRight: 'Botão Dir. Mouse',
      MouseLeft: 'Botão Esq. Mouse',
      MouseMiddle: 'Botão Meio Mouse'
    };
    if (map[code]) return map[code];
    if (code.startsWith('Key')) return code.replace('Key', '');
    if (code.startsWith('Digit')) return code.replace('Digit', '');
    if (code.startsWith('Numpad')) return 'Num ' + code.replace('Numpad', '');
    return code;
  },

  // Configurações de Grid e Escala
  TILE_SIZE: 64,
  MAJOR_GRID_STEP: 320, // A cada 5 tiles (320px), linha de referência forte com coordenadas

  // Tempo padrão de cada fase (em segundos) -> 03:00
  STAGE_DURATION_SECONDS: 180,

  // Configurações dos Jogadores
  PLAYER_SPEED: 290, // pixels por segundo (fluido estilo Stardew Valley)
  PLAYER_SIZE: 40,   // hitbox quadrada 40x40px
  PLAYER_MAX_HP: 100,

  // Configurações de Ataque Placeholder (Sprint 3)
  ATTACK_DURATION: 0.28,            // segundos que o arco/cone fica visível
  ATTACK_COOLDOWN: 0.16,            // tempo mínimo entre ataques
  ATTACK_RANGE: 76,                 // raio do cone de colisão em pixels
  ATTACK_ARC_ANGLE: Math.PI * 0.52, // abertura angular do cone (~93 graus)

  // Configurações de Gamepad (Sprint 3)
  GAMEPAD_DEADZONE: 0.22,

  // Suavização da câmera (Lerp factor)
  CAMERA_LERP: 7.5,

  // Configurações de Coleta de Lixo / Sucata (Sprints 2 & 3)
  TRASH_SIZE: 26,
  TRASH_TYPES: [
    { id: 'scrap_metal', name: 'Sucata Metálica', shortLabel: 'LIXO: SUCATA', color: '#94a3b8', stroke: '#e2e8f0', shape: 'gear' },
    { id: 'tin_can', name: 'Lata Amassada', shortLabel: 'LIXO: LATA', color: '#fb923c', stroke: '#fed7aa', shape: 'can' },
    { id: 'plastic_bottle', name: 'Plástico Descartado', shortLabel: 'LIXO: PLÁSTICO', color: '#38bdf8', stroke: '#bae6fd', shape: 'bottle' },
    { id: 'old_battery', name: 'Bateria Velha', shortLabel: 'LIXO: BATERIA', color: '#a3e635', stroke: '#ecfccb', shape: 'battery' },
    { id: 'broken_circuit', name: 'Placa Quebrada', shortLabel: 'LIXO: ELETRÔNICO', color: '#facc15', stroke: '#fef08a', shape: 'chip' }
  ],

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

  // Inventário de Armas / Itens de Placeholder (5 Slots na Hotbar: 1 a 5)
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
      }
    ];
  }
};

// Alias global Config -> GameConfig para acesso direto via Config.Controls.P1_Up
window.Config = window.GameConfig;
