/**
 * js/config.js
 * Configurações globais, constantes de física/câmera, Dicionário Global de Inputs (Config.Controls),
 * persistência de posições fixas dos lixos (máx. 16 por mapa), sistema de armas melee da Loja
 * e definição da Máquina de Estados de Fases.
 */

window.isMuted = false;
window.friendlyFireEnabled = false;
window.colorblindMode = false;
window.scrapCollected = 0;

// Conjunto de IDs de lixos coletados na sessão/corrida atual
window.collectedTrashIds = new Set();

const TRASH_POSITIONS_STORAGE_KEY = 'scienceeco_fixed_trash_positions_v2';

window.GlobalState = {
  collectedTrashIds: window.collectedTrashIds,
  unlockedWeapons: new Set(['baton']),
  equippedWeaponId: 'baton',
  savedTrashLayouts: {},

  _loadSavedLayouts() {
    if (Object.keys(this.savedTrashLayouts).length > 0) return;
    try {
      const raw = localStorage.getItem(TRASH_POSITIONS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          this.savedTrashLayouts = parsed;
        }
      }
    } catch (e) {
      this.savedTrashLayouts = {};
    }
  },

  _persistSavedLayouts() {
    try {
      localStorage.setItem(TRASH_POSITIONS_STORAGE_KEY, JSON.stringify(this.savedTrashLayouts));
    } catch (e) {}
  },

  /**
   * Retorna as 16 posições fixas de lixo do mapa, garantindo que uma vez definidas na primeira jogada,
   * permaneçam rigorosamente as mesmas em todas as jogadas subsequentes.
   */
  getFixedTrashSpawns(map) {
    if (!map || map.isSafeRoom || !Array.isArray(map.trashSpawns)) return [];
    this._loadSavedLayouts();

    if (Array.isArray(this.savedTrashLayouts[map.id]) && this.savedTrashLayouts[map.id].length === map.trashSpawns.length) {
      return this.savedTrashLayouts[map.id];
    }

    // Congela e formata as coordenadas de todos os lixos cadastrados no mapa
    const fixedList = map.trashSpawns.map((item, idx) => ({
      id: item.id || `${map.id}_trash_${String(idx + 1).padStart(2, '0')}`,
      x: Math.round(item.x),
      y: Math.round(item.y),
      typeIndex: item.typeIndex !== undefined ? item.typeIndex : idx % 5,
      rotation: item.rotation !== undefined ? item.rotation : 0
    }));

    this.savedTrashLayouts[map.id] = fixedList;
    this._persistSavedLayouts();
    return fixedList;
  },

  isTrashCollected(trashId) {
    return window.collectedTrashIds.has(trashId);
  },

  markTrashCollected(trashId) {
    if (!window.collectedTrashIds.has(trashId)) {
      window.collectedTrashIds.add(trashId);
      window.scrapCollected = (window.scrapCollected || 0) + 1;
      return true;
    }
    return false;
  },

  resetMapTrash(map) {
    if (!map || !Array.isArray(map.trashSpawns)) return;
    const layout = this.getFixedTrashSpawns(map);
    for (const item of layout) {
      window.collectedTrashIds.delete(item.id);
    }
  },

  resetAllTrash() {
    window.collectedTrashIds.clear();
    window.scrapCollected = 0;
    this.unlockedWeapons = new Set(['baton']);
    this.equippedWeaponId = 'baton';
  },

  getEquippedWeapon() {
    const weapons = window.GameConfig ? window.GameConfig.WEAPONS : null;
    if (!weapons) return { id: 'baton', name: 'Bastão', damage: 30, range: 84, color: '#38bdf8' };
    return weapons[this.equippedWeaponId] || weapons.baton;
  },

  isWeaponUnlocked(weaponId) {
    return this.unlockedWeapons.has(weaponId);
  },

  buyOrEquipWeapon(weaponId) {
    const weapons = window.GameConfig ? window.GameConfig.WEAPONS : null;
    if (!weapons || !weapons[weaponId]) return { success: false, reason: 'INVALID' };
    const weapon = weapons[weaponId];

    if (this.unlockedWeapons.has(weaponId)) {
      this.equippedWeaponId = weaponId;
      return { success: true, action: 'EQUIPPED', weapon };
    }

    const currentScrap = window.scrapCollected || 0;
    if (currentScrap < weapon.price) {
      return { success: false, reason: 'INSUFFICIENT_SCRAP', weapon };
    }

    window.scrapCollected = currentScrap - weapon.price;
    this.unlockedWeapons.add(weaponId);
    this.equippedWeaponId = weaponId;
    return { success: true, action: 'PURCHASED', weapon };
  }
};

/**
 * Retorna o Rank de desempenho baseado no tempo gasto (em segundos)
 */
window.computePerformanceRank = function(timeSeconds) {
  if (timeSeconds <= 45) return 'S+';
  if (timeSeconds <= 90) return 'S';
  if (timeSeconds <= 140) return 'A';
  return 'B';
};

// Dicionário Padrão de Controles (Sem atalhos de debug e sem teclas de inventário)
const DEFAULT_CONTROLS = {
  // Jogador 1 (e Jogador Ativo no Singleplayer)
  P1_Up: 'KeyW',
  P1_Down: 'KeyS',
  P1_Left: 'KeyA',
  P1_Right: 'KeyD',
  P1_Attack: 'KeyR',
  P1_Attack_Mouse: 'MouseLeft',

  // Jogador 2 (Multiplayer Local)
  P2_Up: 'ArrowUp',
  P2_Down: 'ArrowDown',
  P2_Left: 'ArrowLeft',
  P2_Right: 'ArrowRight',
  P2_Attack: 'Digit0',
  P2_Attack_Alt: 'Numpad0',

  // Ações de Sistema / Interação
  SwitchPlayer: 'Tab',
  Interact: 'KeyE',
  InteractAlt: 'Space',
  Pause: 'Escape',
  PauseAlt: 'KeyP'
};

window.GameConfig = {
  Controls: { ...DEFAULT_CONTROLS },

  createDefaultInventoryP1() { return []; },
  createDefaultInventoryP2() { return []; },

  resetDefaultControls() {
    Object.assign(this.Controls, DEFAULT_CONTROLS);
  },

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
      MouseLeft: 'Botão Esq. Mouse',
      MouseRight: 'Botão Dir. Mouse',
      MouseMiddle: 'Botão Meio Mouse'
    };
    if (map[code]) return map[code];
    if (code.startsWith('Key')) return code.replace('Key', '');
    if (code.startsWith('Digit')) return code.replace('Digit', '');
    if (code.startsWith('Numpad')) return 'Num ' + code.replace('Numpad', '');
    return code;
  },

  // Configurações de Escala e Tempo
  TILE_SIZE: 64,
  STAGE_DURATION_SECONDS: 180,

  // Configurações dos Jogadores
  PLAYER_SPEED: 290,
  PLAYER_SIZE: 38,
  PLAYER_MAX_HP: 100,

  // Configurações de Ataque Corpo a Corpo (Melee)
  ATTACK_DURATION: 0.28,
  ATTACK_COOLDOWN: 0.16,
  ATTACK_RANGE: 84,
  ATTACK_ARC_ANGLE: Math.PI * 0.58,

  // Armas de Curta Distância (Melee) da Loja:
  // 1. Bastão: Dano Base = 30
  // 2. Barra de Ferro: +10% sobre o Bastão = 33
  // 3. Katana: +10% sobre a Barra de Ferro = 36.3
  WEAPONS: {
    baton: {
      id: 'baton',
      name: 'Bastão',
      shortName: 'Bastão',
      icon: '🏏',
      damage: 30,
      price: 0,
      range: 84,
      color: '#38bdf8',
      stroke: '#e0f2fe',
      desc: 'Arma básica de curta distância.',
      bonusLabel: 'Arma Básica • Dano Base (30)'
    },
    iron_bar: {
      id: 'iron_bar',
      name: 'Barra de Ferro',
      shortName: 'Barra de Ferro',
      icon: '🔩',
      damage: 30 * 1.10, // 33 (+10% sobre o Bastão)
      price: 8,
      range: 88,
      color: '#cbd5e1',
      stroke: '#f8fafc',
      desc: 'Causa 10% a mais de dano que o Bastão.',
      bonusLabel: '+10% de Dano sobre o Bastão (33)'
    },
    katana: {
      id: 'katana',
      name: 'Katana',
      shortName: 'Katana',
      icon: '⚔️',
      damage: +(30 * 1.10 * 1.10).toFixed(2), // 36.3 (+10% sobre a Barra de Ferro)
      price: 15,
      range: 94,
      color: '#facc15',
      stroke: '#fef08a',
      desc: 'Causa 10% a mais de dano que a Barra de Ferro.',
      bonusLabel: '+10% de Dano sobre a Barra de Ferro (36.3)'
    }
  },

  GAMEPAD_DEADZONE: 0.22,
  CAMERA_LERP: 7.5,

  // Lixos visivelmente maiores (46px) e mais fáceis de identificar no cenário
  TRASH_SIZE: 46,
  TRASH_TYPES: [
    { id: 'scrap_metal', name: 'Sucata Metálica', shortLabel: 'SUCATA', color: '#94a3b8', stroke: '#f1f5f9', glow: 'rgba(148, 163, 184, 0.45)', shape: 'gear' },
    { id: 'tin_can', name: 'Lata Amassada', shortLabel: 'LATA', color: '#fb923c', stroke: '#ffedd5', glow: 'rgba(251, 146, 60, 0.45)', shape: 'can' },
    { id: 'plastic_bottle', name: 'Plástico Descartado', shortLabel: 'PLÁSTICO', color: '#38bdf8', stroke: '#e0f2fe', glow: 'rgba(56, 189, 248, 0.45)', shape: 'bottle' },
    { id: 'old_battery', name: 'Bateria Velha', shortLabel: 'BATERIA', color: '#a3e635', stroke: '#ecfccb', glow: 'rgba(163, 230, 53, 0.45)', shape: 'battery' },
    { id: 'broken_circuit', name: 'Placa Quebrada', shortLabel: 'CIRCUITO', color: '#facc15', stroke: '#fef9c3', glow: 'rgba(250, 204, 21, 0.45)', shape: 'chip' }
  ],

  // Fluxo de Fases:
  // Van Inicial -> Mapa 1 -> Van -> Mapa 2 -> Van -> Mapa 3 -> Van Final
  STAGE_FLOW: [
    {
      stateId: 'VAN_START',
      mapKey: 'van',
      stepIndex: 0,
      label: 'Safe Room: Van de Operações [Início da Expedição]',
      isSafeRoom: true,
      vanType: 'start',
      nextStageIndex: 1
    },
    {
      stateId: 'MAP_1',
      mapKey: 'map1',
      stepIndex: 1,
      label: 'Mapa 1: Vila Inundada [Setor Alpha]',
      isSafeRoom: false,
      hasRisingWater: true,
      stageNumber: 1,
      nextStageIndex: 2
    },
    {
      stateId: 'VAN_1',
      mapKey: 'van',
      stepIndex: 2,
      label: 'Safe Room: A Van (Pós-Mapa 1)',
      isSafeRoom: true,
      vanType: 'mid',
      previousMapIndex: 1,
      nextMapIndex: 3
    },
    {
      stateId: 'MAP_2',
      mapKey: 'map2',
      stepIndex: 3,
      label: 'Mapa 2: Esgoto Subterrâneo [Setor Beta]',
      isSafeRoom: false,
      stageNumber: 2,
      nextStageIndex: 4
    },
    {
      stateId: 'VAN_2',
      mapKey: 'van',
      stepIndex: 4,
      label: 'Safe Room: A Van (Pós-Mapa 2)',
      isSafeRoom: true,
      vanType: 'mid',
      previousMapIndex: 3,
      nextMapIndex: 5
    },
    {
      stateId: 'MAP_3',
      mapKey: 'map3',
      stepIndex: 5,
      label: 'Mapa 3: Complexo Subterrâneo [Setor Gamma]',
      isSafeRoom: false,
      stageNumber: 3,
      nextStageIndex: 6
    },
    {
      stateId: 'VAN_FINAL',
      mapKey: 'van_final',
      stepIndex: 6,
      label: 'Safe Room: A Van [Expedição Concluída - Vitória]',
      isSafeRoom: true,
      vanType: 'final',
      previousMapIndex: 5,
      nextMapIndex: 1
    }
  ]
};

window.Config = window.GameConfig;
