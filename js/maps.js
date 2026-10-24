/**
 * js/maps.js
 * Definições dos 3 Mapas Grandes (2500x2500px) e da Safe Room Expandida (A Van).
 * Inclui arrays fixos (hardcoded) de posicionamento de Lixo (fixedTrashSpawns) sem geração aleatória,
 * paleta de cores de debug, obstáculos com caixas de colisão visíveis,
 * estações interativas (Lojinha e Mesa de Craft), pontos de Spawn para P1/P2 e Zonas de Extração.
 */

window.GameMaps = {
  // =========================================================================
  // MAPA 1: ARREDORES FLORESTAIS (2500 x 2500 px)
  // =========================================================================
  map1: {
    id: 'map1',
    name: 'MAPA 1: ARREDORES FLORESTAIS [SETOR ALPHA]',
    subtitle: 'Dimensões: 2500x2500px • 16 Lixos Fixos Persistentes • Siga até a Zona de Extração',
    width: 2500,
    height: 2500,
    isSafeRoom: false,
    palette: {
      bg: '#16261c',
      gridMinor: 'rgba(134, 239, 172, 0.10)',
      gridMajor: 'rgba(134, 239, 172, 0.28)',
      coordText: 'rgba(134, 239, 172, 0.55)',
      wallFill: 'rgba(38, 70, 50, 0.85)',
      wallStroke: '#4ade80',
      pathFill: 'rgba(161, 98, 7, 0.22)',
      pathStroke: 'rgba(250, 204, 21, 0.30)'
    },
    spawnP1: { x: 240, y: 260 },
    spawnP2: { x: 310, y: 260 },
    // Array fixo (hardcoded) com coordenadas exatas (X, Y) para os lixos do Mapa 1
    fixedTrashSpawns: [
      { id: 'm1_trash_01', x: 430, y: 360, typeIndex: 0 },
      { id: 'm1_trash_02', x: 600, y: 360, typeIndex: 1 },
      { id: 'm1_trash_03', x: 780, y: 360, typeIndex: 2 },
      { id: 'm1_trash_04', x: 900, y: 450, typeIndex: 3 },
      { id: 'm1_trash_05', x: 900, y: 680, typeIndex: 4 },
      { id: 'm1_trash_06', x: 900, y: 920, typeIndex: 0 },
      { id: 'm1_trash_07', x: 560, y: 850, typeIndex: 1 },
      { id: 'm1_trash_08', x: 260, y: 740, typeIndex: 2 },
      { id: 'm1_trash_09', x: 1120, y: 1080, typeIndex: 3 },
      { id: 'm1_trash_10', x: 1380, y: 1080, typeIndex: 4 },
      { id: 'm1_trash_11', x: 1640, y: 1140, typeIndex: 0 },
      { id: 'm1_trash_12', x: 1640, y: 1420, typeIndex: 1 },
      { id: 'm1_trash_13', x: 1640, y: 1700, typeIndex: 2 },
      { id: 'm1_trash_14', x: 860, y: 1520, typeIndex: 3 },
      { id: 'm1_trash_15', x: 1500, y: 820, typeIndex: 4 },
      { id: 'm1_trash_16', x: 2150, y: 1320, typeIndex: 0 }
    ],
    floorZones: [
      { x: 180, y: 200, w: 240, h: 180, label: 'ZONA DE SPAWN [ALPHA]' },
      { x: 300, y: 310, w: 650, h: 110, label: 'TRILHA OESTE' },
      { x: 840, y: 310, w: 120, h: 820, label: 'CORREDOR CENTRAL' },
      { x: 840, y: 1020, w: 860, h: 120, label: 'ESTRADA DE TERRA' },
      { x: 1580, y: 1020, w: 120, h: 980, label: 'ACESSO SUL' }
    ],
    transitionZone: {
      x: 1520,
      y: 1940,
      w: 260,
      h: 220,
      label: 'ZONA DE EXTRAÇÃO → EMBARCAR NA VAN',
      subLabel: 'Encoste e pressione [E] ou [Espaço] (ou permaneça na zona)',
      strokeColor: '#4ade80',
      fillColor: 'rgba(34, 197, 94, 0.24)'
    },
    obstacles: [
      { x: 0, y: 0, w: 2500, h: 40, label: 'LIMITE NORTE' },
      { x: 0, y: 2460, w: 2500, h: 40, label: 'LIMITE SUL' },
      { x: 0, y: 40, w: 40, h: 2420, label: 'LIMITE OESTE' },
      { x: 2460, y: 40, w: 40, h: 2420, label: 'LIMITE LESTE' },

      { x: 480, y: 120, w: 220, h: 140, label: 'CABANA ABANDONADA [COLISÃO]' },
      { x: 160, y: 480, w: 380, h: 90, label: 'CERCA DE MADEIRA' },
      { x: 640, y: 480, w: 140, h: 320, label: 'FORMAÇÃO ROCHOSA A1' },

      { x: 1040, y: 240, w: 320, h: 220, label: 'BOSQUE DENSO [BLOQUEIO]' },
      { x: 1040, y: 600, w: 260, h: 280, label: 'TORRE DE VIGIA' },
      { x: 420, y: 920, w: 340, h: 240, label: 'LAGO SECO / ROCHAS' },
      { x: 1440, y: 520, w: 420, h: 180, label: 'BARREIRA DE TRONCOS' },

      { x: 620, y: 1240, w: 480, h: 160, label: 'MURO DE CONTENÇÃO' },
      { x: 1240, y: 1240, w: 260, h: 420, label: 'DEPÓSITO FLORESTAL' },
      { x: 1780, y: 960, w: 360, h: 260, label: 'PENHASCO LESTE' },
      { x: 1820, y: 1420, w: 240, h: 380, label: 'ROCHEDO SUL' },
      { x: 1120, y: 1860, w: 300, h: 260, label: 'POSTO AVANÇADO' },
      { x: 1920, y: 1920, w: 340, h: 240, label: 'GUARITA DE EXTRAÇÃO' }
    ]
  },

  // =========================================================================
  // SAFE ROOM EXPANDIDA: A VAN (1440 x 920 px)
  // =========================================================================
  van: {
    id: 'van',
    name: 'SAFE ROOM: A VAN DE OPERAÇÕES (EXPANDIDA)',
    subtitle: 'Zona Segura • Cronômetro Pausado • Visite a Lojinha ou a Mesa de Craft',
    width: 1440,
    height: 920,
    isSafeRoom: true,
    fixedTrashSpawns: [],
    palette: {
      bg: '#1c1917',
      gridMinor: 'rgba(251, 191, 36, 0.10)',
      gridMajor: 'rgba(251, 191, 36, 0.28)',
      coordText: 'rgba(251, 191, 36, 0.55)',
      wallFill: 'rgba(68, 64, 60, 0.92)',
      wallStroke: '#f59e0b',
      pathFill: 'rgba(56, 189, 248, 0.12)',
      pathStroke: 'rgba(56, 189, 248, 0.40)'
    },
    spawnP1: { x: 260, y: 460 },
    spawnP2: { x: 340, y: 460 },
    floorZones: [
      { x: 160, y: 140, w: 1120, h: 640, label: 'INTERIOR & PÁTIO TÁTICO DA VAN' },
      { x: 200, y: 370, w: 210, h: 180, label: 'ÁREA DE DESCANSO DA EQUIPE' }
    ],
    interactiveStations: [
      {
        id: 'shop',
        name: 'Lojinha (Shop)',
        icon: '🛒',
        x: 450,
        y: 155,
        w: 280,
        h: 195,
        zoneLabel: 'ÁREA D/ INTERAÇÃO: LOJINHA (SHOP)',
        promptText: 'Pressione [E] ou [Espaço] para abrir a Lojinha (Compra & Venda)',
        strokeColor: '#facc15',
        fillColor: 'rgba(250, 204, 21, 0.16)'
      },
      {
        id: 'crafting',
        name: 'Mesa de Craft (Crafting)',
        icon: '🔨',
        x: 450,
        y: 570,
        w: 280,
        h: 195,
        zoneLabel: 'ÁREA D/ INTERAÇÃO: MESA DE CRAFT (MALETA 8x4)',
        promptText: 'Pressione [E] ou [Espaço] para abrir a Mesa de Craft (Maleta 8x4)',
        strokeColor: '#c084fc',
        fillColor: 'rgba(192, 132, 252, 0.16)'
      }
    ],
    transitionZone: {
      x: 1020,
      y: 360,
      w: 200,
      h: 200,
      label: 'PORTA DA VAN / SEGUIR VIAGEM',
      subLabel: 'Encoste ou pressione [E] / [Espaço] para carregar o próximo mapa',
      strokeColor: '#38bdf8',
      fillColor: 'rgba(56, 189, 248, 0.25)'
    },
    obstacles: [
      { x: 120, y: 100, w: 1200, h: 40, label: 'CHASSI NORTE DA VAN' },
      { x: 120, y: 780, w: 1200, h: 40, label: 'CHASSI SUL DA VAN' },
      { x: 120, y: 140, w: 40, h: 640, label: 'CABINE DO MOTORISTA [COLISÃO]' },
      { x: 1280, y: 140, w: 40, h: 640, label: 'PARACHOQUE TRASEIRO / PORTA' },

      {
        x: 480,
        y: 170,
        w: 220,
        h: 95,
        label: '🛒 LOJINHA (SHOP)',
        subTag: '[INTERAJA NA ÁREA]',
        customFill: 'rgba(161, 98, 7, 0.88)',
        customStroke: '#facc15'
      },

      {
        x: 480,
        y: 655,
        w: 220,
        h: 95,
        label: '🔨 MESA DE CRAFT (CRAFTING)',
        subTag: '[INTERAJA NA ÁREA]',
        customFill: 'rgba(88, 28, 135, 0.88)',
        customStroke: '#c084fc'
      },

      { x: 800, y: 170, w: 180, h: 80, label: 'RÁDIO & TELEMETRIA [DEBUG]' },
      { x: 800, y: 670, w: 180, h: 80, label: 'GERADOR AUXILIAR [DEBUG]' }
    ]
  },

  // =========================================================================
  // MAPA 2: DISTRITO INDUSTRIAL (2500 x 2500 px)
  // =========================================================================
  map2: {
    id: 'map2',
    name: 'MAPA 2: DISTRITO INDUSTRIAL [SETOR BETA]',
    subtitle: 'Dimensões: 2500x2500px • 16 Lixos Fixos Persistentes • Atravesse o pátio até a Extração',
    width: 2500,
    height: 2500,
    isSafeRoom: false,
    palette: {
      bg: '#131c2e',
      gridMinor: 'rgba(56, 189, 248, 0.10)',
      gridMajor: 'rgba(56, 189, 248, 0.28)',
      coordText: 'rgba(56, 189, 248, 0.55)',
      wallFill: 'rgba(30, 58, 95, 0.88)',
      wallStroke: '#38bdf8',
      pathFill: 'rgba(148, 163, 184, 0.18)',
      pathStroke: 'rgba(56, 189, 248, 0.35)'
    },
    spawnP1: { x: 260, y: 2200 },
    spawnP2: { x: 340, y: 2200 },
    // Array fixo (hardcoded) com coordenadas exatas (X, Y) para os lixos do Mapa 2
    fixedTrashSpawns: [
      { id: 'm2_trash_01', x: 520, y: 2190, typeIndex: 0 },
      { id: 'm2_trash_02', x: 760, y: 2190, typeIndex: 1 },
      { id: 'm2_trash_03', x: 1020, y: 2190, typeIndex: 2 },
      { id: 'm2_trash_04', x: 1120, y: 1960, typeIndex: 3 },
      { id: 'm2_trash_05', x: 1120, y: 1700, typeIndex: 4 },
      { id: 'm2_trash_06', x: 1120, y: 1440, typeIndex: 0 },
      { id: 'm2_trash_07', x: 740, y: 1500, typeIndex: 1 },
      { id: 'm2_trash_08', x: 420, y: 1480, typeIndex: 2 },
      { id: 'm2_trash_09', x: 1180, y: 1240, typeIndex: 3 },
      { id: 'm2_trash_10', x: 1480, y: 1240, typeIndex: 4 },
      { id: 'm2_trash_11', x: 1780, y: 1240, typeIndex: 0 },
      { id: 'm2_trash_12', x: 1920, y: 1020, typeIndex: 1 },
      { id: 'm2_trash_13', x: 1920, y: 780, typeIndex: 2 },
      { id: 'm2_trash_14', x: 1920, y: 540, typeIndex: 3 },
      { id: 'm2_trash_15', x: 1020, y: 760, typeIndex: 4 },
      { id: 'm2_trash_16', x: 1680, y: 500, typeIndex: 0 }
    ],
    floorZones: [
      { x: 180, y: 2080, w: 280, h: 220, label: 'DOCA DE DESEMBARQUE [BETA]' },
      { x: 460, y: 2130, w: 720, h: 120, label: 'AVENIDA INDUSTRIAL SUL' },
      { x: 1060, y: 1180, w: 120, h: 950, label: 'CORREDOR DE CARGA' },
      { x: 1060, y: 1180, w: 920, h: 120, label: 'PASSARELA LESTE' },
      { x: 1860, y: 420, w: 120, h: 760, label: 'ACESSO NORTE' }
    ],
    transitionZone: {
      x: 1800,
      y: 220,
      w: 260,
      h: 220,
      label: 'ZONA DE EXTRAÇÃO → EMBARCAR NA VAN',
      subLabel: 'Encoste e pressione [E] ou [Espaço] (ou permaneça na zona)',
      strokeColor: '#38bdf8',
      fillColor: 'rgba(56, 189, 248, 0.25)'
    },
    obstacles: [
      { x: 0, y: 0, w: 2500, h: 40, label: 'LIMITE NORTE' },
      { x: 0, y: 2460, w: 2500, h: 40, label: 'LIMITE SUL' },
      { x: 0, y: 40, w: 40, h: 2420, label: 'LIMITE OESTE' },
      { x: 2460, y: 40, w: 40, h: 2420, label: 'LIMITE LESTE' },

      { x: 240, y: 1620, w: 480, h: 280, label: 'GALPÃO LOGÍSTICO 01' },
      { x: 820, y: 1620, w: 180, h: 420, label: 'CONTAINER AZUL #14' },
      { x: 1260, y: 1500, w: 460, h: 320, label: 'USINA DE FORÇA' },
      { x: 560, y: 1040, w: 420, h: 340, label: 'SILO QUÍMICO [COLISÃO]' },
      { x: 1260, y: 820, w: 500, h: 260, label: 'CONTAINER DUPLO #22' },
      { x: 340, y: 440, w: 560, h: 360, label: 'FÁBRICA NORTE' },
      { x: 1120, y: 320, w: 480, h: 320, label: 'SUBESTAÇÃO ELÉTRICA' },
      { x: 2060, y: 660, w: 260, h: 640, label: 'MURO DE SEGURANÇA LESTE' }
    ]
  },

  // =========================================================================
  // MAPA 3: COMPLEXO SUBTERRÂNEO (2500 x 2500 px)
  // =========================================================================
  map3: {
    id: 'map3',
    name: 'MAPA 3: COMPLEXO SUBTERRÂNEO [SETOR GAMMA]',
    subtitle: 'Dimensões: 2500x2500px • 16 Lixos Fixos Persistentes • Alcance o Ponto de Extração Final',
    width: 2500,
    height: 2500,
    isSafeRoom: false,
    palette: {
      bg: '#23121b',
      gridMinor: 'rgba(244, 114, 182, 0.10)',
      gridMajor: 'rgba(251, 113, 133, 0.28)',
      coordText: 'rgba(251, 113, 133, 0.55)',
      wallFill: 'rgba(88, 28, 55, 0.88)',
      wallStroke: '#fb7185',
      pathFill: 'rgba(244, 63, 94, 0.16)',
      pathStroke: 'rgba(251, 113, 133, 0.35)'
    },
    spawnP1: { x: 1210, y: 280 },
    spawnP2: { x: 1290, y: 280 },
    // Array fixo (hardcoded) com coordenadas exatas (X, Y) para os lixos do Mapa 3
    fixedTrashSpawns: [
      { id: 'm3_trash_01', x: 1250, y: 460, typeIndex: 0 },
      { id: 'm3_trash_02', x: 1250, y: 660, typeIndex: 1 },
      { id: 'm3_trash_03', x: 1250, y: 860, typeIndex: 2 },
      { id: 'm3_trash_04', x: 1020, y: 1080, typeIndex: 3 },
      { id: 'm3_trash_05', x: 760, y: 1080, typeIndex: 4 },
      { id: 'm3_trash_06', x: 1480, y: 1080, typeIndex: 0 },
      { id: 'm3_trash_07', x: 1740, y: 1080, typeIndex: 1 },
      { id: 'm3_trash_08', x: 540, y: 640, typeIndex: 2 },
      { id: 'm3_trash_09', x: 1960, y: 640, typeIndex: 3 },
      { id: 'm3_trash_10', x: 1250, y: 1280, typeIndex: 4 },
      { id: 'm3_trash_11', x: 1250, y: 1520, typeIndex: 0 },
      { id: 'm3_trash_12', x: 1250, y: 1760, typeIndex: 1 },
      { id: 'm3_trash_13', x: 640, y: 1520, typeIndex: 2 },
      { id: 'm3_trash_14', x: 1860, y: 1520, typeIndex: 3 },
      { id: 'm3_trash_15', x: 1060, y: 1940, typeIndex: 4 },
      { id: 'm3_trash_16', x: 1440, y: 1940, typeIndex: 0 }
    ],
    floorZones: [
      { x: 1100, y: 180, w: 300, h: 220, label: 'ELEVADOR DE CARGA [GAMMA]' },
      { x: 1190, y: 400, w: 120, h: 740, label: 'TÚNEL CENTRAL NORTE' },
      { x: 640, y: 1020, w: 1220, h: 120, label: 'ANEL DO REATOR' },
      { x: 1190, y: 1140, w: 120, h: 900, label: 'EIXO DE EXTRAÇÃO SUL' }
    ],
    transitionZone: {
      x: 1120,
      y: 2040,
      w: 260,
      h: 220,
      label: 'EXTRAÇÃO FINAL DO PROTÓTIPO [CONCLUIR CICLO]',
      subLabel: 'Encoste ou pressione [E] / [Espaço] para finalizar / reiniciar ciclo',
      strokeColor: '#fb7185',
      fillColor: 'rgba(244, 63, 94, 0.26)'
    },
    obstacles: [
      { x: 0, y: 0, w: 2500, h: 40, label: 'LIMITE NORTE' },
      { x: 0, y: 2460, w: 2500, h: 40, label: 'LIMITE SUL' },
      { x: 0, y: 40, w: 40, h: 2420, label: 'LIMITE OESTE' },
      { x: 2460, y: 40, w: 40, h: 2420, label: 'LIMITE LESTE' },

      { x: 680, y: 420, w: 380, h: 440, label: 'CÂMARA DE CRIOGENIA OESTE' },
      { x: 1440, y: 420, w: 380, h: 440, label: 'CÂMARA DE CRIOGENIA LESTE' },
      { x: 320, y: 960, w: 260, h: 520, label: 'GERADOR AUXILIAR A' },
      { x: 1920, y: 960, w: 260, h: 520, label: 'GERADOR AUXILIAR B' },
      { x: 740, y: 1280, w: 340, h: 460, label: 'PILAR DE CONTENÇÃO 01' },
      { x: 1420, y: 1280, w: 340, h: 460, label: 'PILAR DE CONTENÇÃO 02' },
      { x: 520, y: 1920, w: 460, h: 240, label: 'BLOCO DE SEGURANÇA OESTE' },
      { x: 1520, y: 1920, w: 460, h: 240, label: 'BLOCO DE SEGURANÇA LESTE' }
    ]
  }
};
