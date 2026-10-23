/**
 * js/config.js
 * Configurações globais, constantes de física/câmera, variáveis globais de configurações,
 * inventário de placeholder (5 slots) e definição da Máquina de Estados de Fases.
 */

// Variáveis globais de Configuração e Progresso (Sprint 2)
window.isMuted = false;
window.friendlyFireEnabled = false;
window.scrapCollected = 0;
window.hideDebugOverlays = false; // Quando true, oculta wireframes/grids de debug (útil para versão final/preview)

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

window.GameConfig = {
  // Configurações de Grid e Escala
  PLAYER_SPRITES: {
    p1: null,
    p2: null
  },
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

  // Configurações de Coleta de Lixo / Sucata (Sprint 2)
  TRASH_COUNT_PER_MAP: 28,
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
