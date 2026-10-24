/**
 * js/config.js
 * Configurações globais, constantes de física/câmera/combate, Dicionário Global de Inputs (Config.Controls),
 * persistência global de lixos coletados, receitas da Mesa de Crafting (Maleta 8x4),
 * catálogo da Lojinha (Shop) na Van, inventário de placeholder (5 slots) e Máquina de Estados de Fases.
 */

// Variáveis globais de Configuração e Progresso
window.isMuted = false;
window.friendlyFireEnabled = false;
window.scrapCollected = 0;
window.hideDebugOverlays = false; // Quando true, oculta wireframes/grids de debug

// Estado global de persistência de IDs de lixos já coletados nos mapas (nunca reaparecem ao reiniciar/re-acessar a fase)
window.collectedTrashIds = new Set();

// Alias de moeda global sincronizado com window.scrapCollected para a Lojinha (Shop)
if (!Object.getOwnPropertyDescriptor(window, 'playerCoins')) {
  Object.defineProperty(window, 'playerCoins', {
    get() {
      return window.scrapCollected;
    },
    set(val) {
      window.scrapCollected = Math.max(0, Math.floor(Number(val) || 0));
    },
    configurable: true
  });
}

/**
 * Cache global de Imagens/Sprites (suporta Base64 Data URLs e caminhos relativos ex: 'assets/sprite.png')
 */
window.SpriteCache = {
  _cache: new Map(),

  get(src) {
    if (!src || typeof src !== 'string') return null;
    let entry = this._cache.get(src);
    if (!entry) {
      const img = new Image();
      entry = { img, loaded: false, error: false, src };
      img.onload = () => {
        entry.loaded = true;
      };
      img.onerror = () => {
        entry.error = true;
      };
      img.src = src;
      this._cache.set(src, entry);
    }
    return entry.loaded && !entry.error ? entry.img : null;
  },

  /**
   * Desenha um sprite em (x, y, w, h) respeitando o modo ('stretch' | 'contain' | 'tile')
   */
  draw(ctx, src, x, y, w, h, fit = 'stretch', alpha = 1) {
    const img = this.get(src);
    if (!img) return false;

    ctx.save();
    if (alpha < 1) ctx.globalAlpha *= alpha;

    if (fit === 'contain') {
      const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      const dx = x + (w - dw) / 2;
      const dy = y + (h - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    } else if (fit === 'tile') {
      const pattern = ctx.createPattern(img, 'repeat');
      if (pattern) {
        ctx.translate(x, y);
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.drawImage(img, x, y, w, h);
      }
    } else {
      ctx.drawImage(img, x, y, w, h);
    }

    ctx.restore();
    return true;
  }
};

const DEFAULT_CONTROLS = {
  // Jogador 1 (ou Personagem Ativo no Singleplayer)
  moveUp: 'KeyW',
  moveDown: 'KeyS',
  moveLeft: 'KeyA',
  moveRight: 'KeyD',
  attackP1: 'KeyR',
  inventoryCycle: 'KeyQ',

  // Jogador 2 (Multiplayer Local)
  p2MoveUp: 'ArrowUp',
  p2MoveDown: 'ArrowDown',
  p2MoveLeft: 'ArrowLeft',
  p2MoveRight: 'ArrowRight',
  attackP2: 'Digit0',

  // Ações Gerais e Slots da Hotbar
  interact: 'KeyE',
  switchCharacter: 'Tab',
  slot1: 'Digit1',
  slot2: 'Digit2',
  slot3: 'Digit3',
  slot4: 'Digit4',
  slot5: 'Digit5'
};

window.GameConfig = {
  // Configurações de Grid e Escala
  TILE_SIZE: 64,
  MAJOR_GRID_STEP: 320,

  // Tempo padrão de cada fase (em segundos) -> 03:00
  STAGE_DURATION_SECONDS: 180,

  // Configurações dos Jogadores e Combate / Dano
  PLAYER_SPEED: 290,
  PLAYER_SIZE: 40,
  PLAYER_MAX_HP: 100,
  PLAYER_ATTACK_DAMAGE: 20,
  PLAYER_ATTACK_DURATION: 0.24,
  PLAYER_ATTACK_COOLDOWN: 0.26,
  PLAYER_ATTACK_RANGE: 48,
  PLAYER_ATTACK_SIZE: 48,
  ATTACK_ARC_ANGLE: Math.PI * 0.55,

  // Suavização da câmera (Lerp factor)
  CAMERA_LERP: 7.5,

  // Dicionário Global de Inputs (Remapeável em tempo real no menu Configurações > Controles)
  DEFAULT_CONTROLS: { ...DEFAULT_CONTROLS },
  Controls: { ...DEFAULT_CONTROLS },

  // Metadados das ações exibidas na aba "Controles" do Menu de Configurações
  CONTROL_ACTIONS_META: [
    {
      action: 'moveUp',
      label: 'Mover Cima (P1 / Single)',
      desc: 'Move o personagem para o norte (cima).'
    },
    {
      action: 'moveDown',
      label: 'Mover Baixo (P1 / Single)',
      desc: 'Move o personagem para o sul (baixo).'
    },
    {
      action: 'moveLeft',
      label: 'Mover Esquerda (P1 / Single)',
      desc: 'Move o personagem para o oeste (esquerda).'
    },
    {
      action: 'moveRight',
      label: 'Mover Direita (P1 / Single)',
      desc: 'Move o personagem para o leste (direita).'
    },
    {
      action: 'attackP1',
      label: 'Atacar / Bater (P1 Multi)',
      desc: 'No Multiplayer Local P1 ataca com esta tecla (No Singleplayer: Botão Direito do Mouse).'
    },
    {
      action: 'inventoryCycle',
      label: 'Inventário (Alternar Slot)',
      desc: 'Avança para o próximo slot equipado da Hotbar.'
    },
    {
      action: 'interact',
      label: 'Interagir (Extração / Van)',
      desc: 'Interage com zonas de extração, Lojinha e Mesa de Craft.'
    },
    {
      action: 'switchCharacter',
      label: 'Alternar Personagem (Single)',
      desc: 'Troca instantaneamente entre P1 e P2 no modo Singleplayer.'
    },
    {
      action: 'p2MoveUp',
      label: 'P2 Mover Cima (Multi)',
      desc: 'Move o Jogador 2 para cima no modo Multiplayer Local.'
    },
    {
      action: 'p2MoveDown',
      label: 'P2 Mover Baixo (Multi)',
      desc: 'Move o Jogador 2 para baixo no modo Multiplayer Local.'
    },
    {
      action: 'p2MoveLeft',
      label: 'P2 Mover Esquerda (Multi)',
      desc: 'Move o Jogador 2 para a esquerda no modo Multiplayer Local.'
    },
    {
      action: 'p2MoveRight',
      label: 'P2 Mover Direita (Multi)',
      desc: 'Move o Jogador 2 para a direita no modo Multiplayer Local.'
    },
    {
      action: 'attackP2',
      label: 'P2 Atacar / Bater (Multi)',
      desc: 'No Multiplayer Local o Jogador 2 ataca usando esta tecla (Padrão: 0).'
    }
  ],

  resetControlsToDefault() {
    Object.assign(this.Controls, this.DEFAULT_CONTROLS);
  },

  resetDefaultControls() {
    this.resetControlsToDefault();
  },

  /**
   * Converte um KeyboardEvent.code (ex: 'KeyW', 'Digit0', 'ArrowUp') em rótulo legível na UI
   */
  formatKeyCode(code) {
    if (!code) return '---';
    if (code.startsWith('Key')) return code.slice(3).toUpperCase();
    if (code.startsWith('Digit')) return code.slice(5);
    if (code.startsWith('Numpad')) return `Num ${code.slice(6)}`;
    const map = {
      ArrowUp: '↑ Cima',
      ArrowDown: '↓ Baixo',
      ArrowLeft: '← Esq',
      ArrowRight: '→ Dir',
      Space: 'Espaço',
      Tab: 'Tab',
      ShiftLeft: 'Shift Esq',
      ShiftRight: 'Shift Dir',
      ControlLeft: 'Ctrl Esq',
      ControlRight: 'Ctrl Dir',
      AltLeft: 'Alt Esq',
      AltRight: 'Alt Dir',
      Enter: 'Enter',
      Backspace: 'Backspace'
    };
    return map[code] || code;
  },

<<<<<<< Updated upstream
  // Configurações de Coleta de Lixo / Sucata
  TRASH_COUNT_PER_MAP: 16,
=======
  // Configurações de Grid e Escala
  TILE_SIZE: 64,
  MAJOR_GRID_STEP: 320, // A cada 5 tiles (320px), linha de referência forte com coordenadas

  // Tempo padrão de cada fase (em segundos) -> 03:00
  STAGE_DURATION_SECONDS: 180,

  // Configurações dos Jogadores
  PLAYER_SPEED: 290, // pixels por segundo (fluido estilo Stardew Valley)
  PLAYER_SIZE: 40,   // hitbox quadrada 40x40px
  PLAYER_SPRITE_SCALE: 0.82, // Escala balanceada dos sprites em relação aos mapas, casas e van
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
>>>>>>> Stashed changes
  TRASH_SIZE: 26,
  TRASH_TYPES: [
    { id: 'scrap_metal', name: 'Sucata Metálica', shortLabel: 'LIXO: SUCATA', icon: '🔩', color: '#94a3b8', stroke: '#e2e8f0', shape: 'gear' },
    { id: 'tin_can', name: 'Lata Amassada', shortLabel: 'LIXO: LATA', icon: '🥫', color: '#fb923c', stroke: '#fed7aa', shape: 'can' },
    { id: 'plastic_bottle', name: 'Plástico Descartado', shortLabel: 'LIXO: PLÁSTICO', icon: '🧴', color: '#38bdf8', stroke: '#bae6fd', shape: 'bottle' },
    { id: 'old_battery', name: 'Bateria Velha', shortLabel: 'LIXO: BATERIA', icon: '🪫', color: '#a3e635', stroke: '#ecfccb', shape: 'battery' },
    { id: 'broken_circuit', name: 'Placa Quebrada', shortLabel: 'LIXO: ELETRÔNICO', icon: '📟', color: '#facc15', stroke: '#fef08a', shape: 'chip' }
  ],

  // Configurações da Mesa de Crafting na Van - Maleta 8x4 estilo RE4
  CRAFTING_GRID_COLS: 8,
  CRAFTING_GRID_ROWS: 4,
  CRAFTING_RECIPES: [
    {
      id: 'recipe_processed_scrap',
      name: 'Sucata Processada [Placeholder]',
      shortName: 'Suc. Processada',
      icon: '⚙️',
      type: 'Material Refinado [Placeholder]',
      category: 'processed_scrap',
      color: '#c084fc',
      sellValue: 4,
      requires: ['raw_trash', 'raw_trash'],
      description: 'Combina 2 unidades de Lixo para gerar 1 Sucata Processada [Placeholder].'
    },
    {
      id: 'recipe_tactical_plate',
      name: 'Placa Blindada [Placeholder]',
      shortName: 'Placa Blindada',
      icon: '🛡️',
      type: 'Componente Tático [Placeholder]',
      category: 'crafted_gear',
      color: '#38bdf8',
      sellValue: 9,
      requires: ['processed_scrap', 'processed_scrap'],
      description: 'Combina 2 Sucatas Processadas para gerar 1 Placa Blindada [Placeholder].'
    },
    {
      id: 'recipe_improvised_charge',
      name: 'Carga Explosiva [Placeholder]',
      shortName: 'Carga Explosiva',
      icon: '🧨',
      type: 'Munição Especial [Placeholder]',
      category: 'crafted_ammo',
      color: '#fb923c',
      sellValue: 6,
      requires: ['raw_trash', 'processed_scrap'],
      description: 'Combina 1 Lixo + 1 Sucata Processada para gerar 1 Carga Explosiva [Placeholder].'
    }
  ],

  // Catálogo de Itens Placeholder da Lojinha na Van (Sprint 4)
  SHOP_ITEMS: [
    {
      id: 'shop_medkit_debug',
      name: 'Kit Médico [Debug]',
      shortName: 'Kit Médico',
      icon: '➕',
      type: 'Suprimento [Placeholder]',
      cost: 5,
      sellValue: 3,
      healAmount: 40,
      color: '#4ade80',
      description: 'Custa 5 Lixos • Restaura +40 HP e adiciona ao inventário pessoal.'
    },
    {
      id: 'shop_weapon_upgrade_debug',
      name: 'Melhoria de Arma [Debug]',
      shortName: 'Mod. Arma',
      icon: '🔧',
      type: 'Upgrade [Placeholder]',
      cost: 10,
      sellValue: 6,
      bonusDamage: 10,
      color: '#facc15',
      description: 'Custa 10 Lixos • Aumenta o dano de ataque em +10 HP e adiciona ao slot.'
    },
    {
      id: 'shop_ammo_pack_debug',
      name: 'Munição Tática [Debug]',
      shortName: 'Munição',
      icon: '📦',
      type: 'Munição [Placeholder]',
      cost: 4,
      sellValue: 2,
      color: '#fb923c',
      description: 'Custa 4 Lixos • Caixa de munição reserva para armas da expedição.'
    },
    {
      id: 'shop_kevlar_vest_debug',
      name: 'Colete Tático [Debug]',
      shortName: 'Colete Tático',
      icon: '🦺',
      type: 'Equipamento [Placeholder]',
      cost: 8,
      sellValue: 5,
      color: '#38bdf8',
      description: 'Custa 8 Lixos • Proteção balística leve para operadores em campo.'
    },
    {
      id: 'shop_battery_cell_debug',
      name: 'Bateria de Alta Carga [Debug]',
      shortName: 'Bateria Carga',
      icon: '🔋',
      type: 'Utilitário [Placeholder]',
      cost: 6,
      sellValue: 3,
      color: '#a3e635',
      description: 'Custa 6 Lixos • Célula energética para lanternas e scanners.'
    }
  ],

  // Sequência oficial da Máquina de Estados do Mundo:
  // Van (Base Inicial) -> Mapa 1 -> Van -> Mapa 2 -> Van -> Mapa 3
  STAGE_FLOW: [
    {
      stateId: 'VAN_START',
      mapKey: 'van',
      stepIndex: 0,
      label: 'Safe Room: Interior da Van [Base de Operações]',
      isSafeRoom: true
    },
    {
      stateId: 'MAP_1',
      mapKey: 'map1',
      stepIndex: 1,
      label: 'Mapa 1: Cidade Pós-Apocalíptica [Fase 01]',
      isSafeRoom: false
    },
    {
      stateId: 'VAN_1',
      mapKey: 'van',
      stepIndex: 2,
      label: 'Safe Room: Interior da Van (Retorno da Missão 1)',
      isSafeRoom: true
    },
    {
      stateId: 'MAP_2',
      mapKey: 'map2',
      stepIndex: 3,
      label: 'Mapa 2: Distrito Industrial [Setor Beta]',
      isSafeRoom: false
    },
    {
      stateId: 'VAN_2',
      mapKey: 'van',
      stepIndex: 4,
      label: 'Safe Room: Interior da Van (Retorno da Missão 2)',
      isSafeRoom: true
    },
    {
      stateId: 'MAP_3',
      mapKey: 'map3',
      stepIndex: 5,
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
        sellValue: 5,
        color: '#38bdf8'
      },
      {
        slot: 2,
        id: 'flashlight_debug',
        name: 'Lanterna [Debug]',
        shortName: 'Lanterna',
        icon: '🔦',
        type: 'Utilitário [Placeholder]',
        sellValue: 3,
        color: '#facc15'
      },
      {
        slot: 3,
        id: 'shotgun_debug',
        name: 'Escopeta [Debug]',
        shortName: 'Escopeta',
        icon: '💥',
        type: 'Arma [Placeholder]',
        sellValue: 6,
        color: '#fb923c'
      },
      {
        slot: 4,
        id: 'medkit_debug',
        name: 'Kit Médico [Debug]',
        shortName: 'Kit Médico',
        icon: '➕',
        type: 'Suprimento [Placeholder]',
        sellValue: 3,
        color: '#4ade80'
      },
      {
        slot: 5,
        id: 'empty_5',
        name: 'Vazio',
        shortName: 'Vazio',
        icon: '·',
        type: 'Slot Livre',
        sellValue: 0,
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
        sellValue: 5,
        color: '#fb923c'
      },
      {
        slot: 2,
        id: 'flashlight_p2',
        name: 'Lanterna Tática [Debug]',
        shortName: 'Lanterna',
        icon: '🔦',
        type: 'Utilitário [Placeholder]',
        sellValue: 3,
        color: '#facc15'
      },
      {
        slot: 3,
        id: 'radar_debug',
        name: 'Scanner de Pulso [Debug]',
        shortName: 'Scanner',
        icon: '📡',
        type: 'Utilitário [Placeholder]',
        sellValue: 4,
        color: '#22d3ee'
      },
      {
        slot: 4,
        id: 'medkit_p2',
        name: 'Bandagem [Debug]',
        shortName: 'Bandagem',
        icon: '🩹',
        type: 'Suprimento [Placeholder]',
        sellValue: 3,
        color: '#4ade80'
      },
      {
        slot: 5,
        id: 'empty_p2_5',
        name: 'Vazio',
        shortName: 'Vazio',
        icon: '·',
        type: 'Slot Livre',
        sellValue: 0,
        isEmpty: true,
        color: '#64748b'
      }
    ];
  }
};

// Alias global Config -> GameConfig para acesso via window.Config.Controls
window.Config = window.GameConfig;
