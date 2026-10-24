/**
 * js/maps.js
 * Definições dos 3 Mapas (Fase 1, Fase 2, Fase 3) e da Safe Room (A Van).
 * - Todas as caixas de colisão revisadas com precisão máxima e amplo espaço de circulação.
 * - Cada mapa possui exatamente 16 lixos posicionados em locais 100% acessíveis logo na primeira andada.
 * - Sistema de Crafting completamente removido da Van.
 */

window.GameMaps = {
  // =========================================================================
  // MAPA 1: VILA INUNDADA [SETOR ALPHA] (2048 x 2048 px)
  // =========================================================================
  map1: {
    id: 'map1',
    name: 'MAPA 1: VILA INUNDADA [SETOR ALPHA]',
    subtitle: 'Colete metade dos lixos para drenar a água do canal e liberar a passagem até a Van',
    width: 2048,
    height: 2048,
    isSafeRoom: false,
    stageNumber: 1,
    imageAsset: 'assets/map1_water.jpg',
    imageAssetDry: 'assets/map1_dry.jpg',
    isWaterDrained: false,
    palette: {
      bg: '#16261c',
      wallFill: 'rgba(38, 70, 50, 0.88)',
      wallStroke: '#4ade80',
      pathFill: 'rgba(161, 98, 7, 0.22)',
      pathStroke: 'rgba(250, 204, 21, 0.30)'
    },
    spawnP1: { x: 430, y: 390 },
    spawnP2: { x: 495, y: 390 },
    // Exatamente 16 lixos em locais abertos e 100% acessíveis logo na primeira andada
    trashSpawns: [
      // --- 8 Lixos na Margem Oeste / Sudoeste (Acessíveis imediatamente antes da água secar) ---
      { id: 'map1_trash_01', x: 205, y: 185, typeIndex: 0, rotation: 0.12 },  // Centro do Mirante Noroeste
      { id: 'map1_trash_02', x: 265, y: 345, typeIndex: 1, rotation: -0.18 }, // Trilha de saída do Mirante
      { id: 'map1_trash_03', x: 560, y: 470, typeIndex: 2, rotation: 0.10 },  // Curva Norte da Estrada de Asfalto
      { id: 'map1_trash_04', x: 560, y: 720, typeIndex: 3, rotation: -0.15 }, // Reta Central da Estrada Oeste
      { id: 'map1_trash_05', x: 540, y: 980, typeIndex: 4, rotation: 0.20 },  // Reta Sul da Estrada Oeste
      { id: 'map1_trash_06', x: 385, y: 1125, typeIndex: 0, rotation: -0.12 }, // Calçada ao lado do Carro Prata
      { id: 'map1_trash_07', x: 530, y: 1265, typeIndex: 1, rotation: 0.16 }, // Curva Sul da Estrada de Asfalto
      { id: 'map1_trash_08', x: 395, y: 1500, typeIndex: 2, rotation: -0.22 }, // Calçadão Sudoeste entre as casas

      // --- 8 Lixos no Canal / Setor Leste / Norte (Acessíveis assim que a água baixa) ---
      { id: 'map1_trash_09', x: 880, y: 1520, typeIndex: 3, rotation: 0.14 },  // Cruzamento Sul da Trilha de Terra
      { id: 'map1_trash_10', x: 960, y: 1820, typeIndex: 4, rotation: -0.10 }, // Estrada de Terra Sul sob os postes
      { id: 'map1_trash_11', x: 1030, y: 1040, typeIndex: 0, rotation: 0.18 }, // Leito central do canal drenado
      { id: 'map1_trash_12', x: 1250, y: 920, typeIndex: 1, rotation: -0.16 }, // Passagem superior do canal seco
      { id: 'map1_trash_13', x: 1580, y: 920, typeIndex: 2, rotation: 0.11 },  // Centro da Praça Circular de Pedra
      { id: 'map1_trash_14', x: 1540, y: 1280, typeIndex: 3, rotation: -0.19 }, // Trilha Sudeste
      { id: 'map1_trash_15', x: 1560, y: 540, typeIndex: 4, rotation: 0.21 },  // Acesso ao Estacionamento Norte
      { id: 'map1_trash_16', x: 1500, y: 270, typeIndex: 0, rotation: -0.14 }  // Pátio do Estacionamento (perto da Van)
    ],
    enemySpawns: [],
    floorZones: [],
    transitionZone: {
      x: 1640,
      y: 220,
      w: 240,
      h: 200,
      label: 'ZONA DE EXTRAÇÃO → EMBARCAR NA VAN',
      subLabel: 'Pressione [E] ou [Espaço] para concluir a fase',
      strokeColor: '#4ade80',
      fillColor: 'rgba(34, 197, 94, 0.26)'
    },
    baseObstacles: [
      // 1. Limites externos do mapa (2048x2048)
      { x: 0, y: 0, w: 2048, h: 36, label: 'LIMITE NORTE' },
      { x: 0, y: 2012, w: 2048, h: 36, label: 'LIMITE SUL' },
      { x: 0, y: 0, w: 36, h: 2048, label: 'LIMITE OESTE' },
      { x: 2012, y: 0, w: 36, h: 2048, label: 'LIMITE LESTE' },

      // 2. Muros do Mirante Noroeste (com saída ampla de 190px para a estrada)
      { x: 24, y: 64, w: 52, h: 240, label: 'MURO OESTE DO MIRANTE' },
      { x: 76, y: 36, w: 240, h: 48, label: 'MURO NORTE DO MIRANTE' },
      { x: 336, y: 76, w: 48, h: 190, label: 'MURO LESTE DO MIRANTE' },

      // 3. Casas e Construções ajustadas com precisão às paredes físicas
      { x: 556, y: 120, w: 300, h: 210, label: 'CASA 1 [NORTE CABANA]' },
      { x: 1050, y: 36, w: 280, h: 240, label: 'CASA 2 [NORTE 2 ANDARES]' },
      { x: 230, y: 630, w: 200, h: 200, label: 'CABANA OESTE' },
      { x: 36, y: 780, w: 100, h: 340, label: 'CASA OESTE EXTERNA' },
      { x: 64, y: 1340, w: 230, h: 380, label: 'CASA SUDOESTE 1' },
      { x: 480, y: 1610, w: 260, h: 280, label: 'CASA SUDOESTE 2' },
      { x: 868, y: 400, w: 240, h: 290, label: 'CASA CENTRO-NORTE' },
      { x: 1160, y: 400, w: 240, h: 250, label: 'CASA CENTRO' },
      { x: 1120, y: 1150, w: 260, h: 290, label: 'CASA CENTRAL GRANDE' },
      { x: 1090, y: 1680, w: 260, h: 250, label: 'CASA SUL' },
      { x: 1880, y: 1490, w: 132, h: 360, label: 'EDIFÍCIO SUDESTE' },

      // 4. Veículos Estacionados
      { x: 230, y: 1060, w: 92, h: 130, label: 'CARRO PRATA' },
      { x: 730, y: 936, w: 150, h: 74, label: 'CARRO AZUL' },
      { x: 1368, y: 630, w: 136, h: 110, label: 'PICAPE VERDE CENTRO' },
      { x: 1716, y: 1270, w: 124, h: 144, label: 'PICAPE VERDE SUDESTE' },

      // 5. Abismo Estrelado Noroeste (fora da calçada)
      { x: 0, y: 340, w: 140, h: 220, label: 'ABISMO NOROESTE' }
    ],
    // Obstáculos de Água (Ativos enquanto a água estiver presente; removidos ao coletar 8 lixos)
    waterObstacles: [
      { x: 750, y: 1090, w: 190, h: 250, label: 'CANAL INUNDADO [PONTE]', isWater: true },
      { x: 900, y: 970, w: 230, h: 190, label: 'ÁGUA DO CANAL [MEIO]', isWater: true },
      { x: 1090, y: 840, w: 280, h: 180, label: 'ÁGUA DO CANAL [LESTE]', isWater: true },
      { x: 1350, y: 750, w: 160, h: 150, label: 'ÁGUA DA ENTRADA DA PRAÇA', isWater: true },
      { x: 1690, y: 680, w: 270, h: 240, label: 'LAGO LESTE [NORTE]', isWater: true },
      { x: 1740, y: 920, w: 220, h: 210, label: 'LAGO LESTE [SUL]', isWater: true }
    ],
    obstacles: []
  },

  // =========================================================================
  // SAFE ROOM: A VAN DE OPERAÇÕES (1440 x 920 px) - Hub Central (Sem Crafting)
  // =========================================================================
  van: {
    id: 'van',
    name: 'SAFE ROOM: A VAN DE OPERAÇÕES (HUB)',
    subtitle: 'Zona Segura • Visite a Loja de Armas, leia o Mural de Avisos ou siga viagem na Porta',
    width: 1440,
    height: 920,
    isSafeRoom: true,
    palette: {
      bg: '#14171f',
      wallFill: 'rgba(30, 41, 59, 0.94)',
      wallStroke: '#f59e0b',
      pathFill: 'rgba(56, 189, 248, 0.10)',
      pathStroke: 'rgba(56, 189, 248, 0.32)'
    },
    spawnP1: { x: 280, y: 460 },
    spawnP2: { x: 360, y: 460 },
    trashSpawns: [],
    enemySpawns: [],
    floorZones: [
      { x: 160, y: 140, w: 1120, h: 640, label: 'PÁTIO TÁTICO DA VAN' }
    ],
    // Zonas de Interação da Van (Apenas Mural de Avisos e Loja de Armas)
    interactiveStations: [
      {
        id: 'notice_board',
        name: 'Mural de Avisos',
        icon: '📋',
        x: 220,
        y: 160,
        w: 230,
        h: 190,
        zoneLabel: 'MURAL DE AVISOS',
        promptText: 'Pressione [E] para Ler o Mural de Avisos',
        strokeColor: '#38bdf8',
        fillColor: 'rgba(56, 189, 248, 0.16)'
      },
      {
        id: 'shop',
        name: 'Loja de Armas',
        icon: '⚔️',
        x: 540,
        y: 160,
        w: 260,
        h: 190,
        zoneLabel: 'LOJA DE ARMAS (MELEE)',
        promptText: 'Pressione [E] para Abrir a Loja de Armas',
        strokeColor: '#facc15',
        fillColor: 'rgba(250, 204, 21, 0.16)'
      }
    ],
    transitionZone: {
      x: 1020,
      y: 360,
      w: 200,
      h: 200,
      label: 'PORTA DA VAN → SEGUIR VIAGEM',
      subLabel: 'Pressione [E] ou [Espaço] para avançar',
      strokeColor: '#38bdf8',
      fillColor: 'rgba(56, 189, 248, 0.24)'
    },
    obstacles: [
      // Paredes do Compartimento da Van
      { x: 120, y: 100, w: 1200, h: 40, label: 'PAREDE NORTE DA VAN' },
      { x: 120, y: 780, w: 1200, h: 40, label: 'PAREDE SUL DA VAN' },
      { x: 120, y: 140, w: 40, h: 640, label: 'CABINE DO MOTORISTA' },
      { x: 1280, y: 140, w: 40, h: 640, label: 'PORTA TRASEIRA' },

      // 1. Estação: Mural de Avisos
      {
        x: 245,
        y: 170,
        w: 180,
        h: 80,
        label: '📋 MURAL DE AVISOS',
        subTag: 'DICAS DA EQUIPE',
        customFill: 'rgba(15, 23, 42, 0.95)',
        customStroke: '#38bdf8'
      },

      // 2. Estação: Loja de Armas
      {
        x: 565,
        y: 170,
        w: 210,
        h: 90,
        label: '⚔️ LOJA DE ARMAS',
        subTag: 'BASTÃO • FERRO • KATANA',
        customFill: 'rgba(120, 53, 15, 0.92)',
        customStroke: '#facc15'
      },

      // Equipamentos Decorativos Sólidos
      { x: 860, y: 170, w: 180, h: 80, label: 'RÁDIO & TELEMETRIA' },
      { x: 565, y: 670, w: 210, h: 80, label: 'BANCADA DE SUPORTE' },
      { x: 860, y: 670, w: 180, h: 80, label: 'GERADOR AUXILIAR' }
    ]
  },

  // =========================================================================
  // MAPA 2: ESGOTO SUBTERRÂNEO [SETOR BETA] (2048 x 2048 px)
  // =========================================================================
  map2: {
    id: 'map2',
    name: 'MAPA 2: ESGOTO SUBTERRÂNEO [SETOR BETA]',
    subtitle: 'Navegue pelas galerias de esgoto, elimine os ratos e colete os 16 lixos até a saída norte',
    width: 2048,
    height: 2048,
    isSafeRoom: false,
    stageNumber: 2,
    imageAsset: 'assets/map2_sewer.jpg',
    palette: {
      bg: '#141416',
      wallFill: 'rgba(30, 41, 59, 0.85)',
      wallStroke: 'rgba(74, 222, 128, 0.5)',
      pathFill: 'rgba(100, 116, 139, 0.15)',
      pathStroke: 'rgba(56, 189, 248, 0.25)'
    },
    spawnP1: { x: 1540, y: 1900 },
    spawnP2: { x: 1615, y: 1900 },
    // Exatamente 16 lixos em corredores amplos e 100% livres de obstáculos
    trashSpawns: [
      { id: 'map2_trash_01', x: 260, y: 310, typeIndex: 1, rotation: 0.12 },
      { id: 'map2_trash_02', x: 450, y: 350, typeIndex: 2, rotation: -0.18 },
      { id: 'map2_trash_03', x: 240, y: 720, typeIndex: 0, rotation: 0.24 },
      { id: 'map2_trash_04', x: 390, y: 1120, typeIndex: 3, rotation: -0.15 },
      { id: 'map2_trash_05', x: 360, y: 1360, typeIndex: 4, rotation: 0.10 },
      { id: 'map2_trash_06', x: 360, y: 1840, typeIndex: 0, rotation: -0.22 },
      { id: 'map2_trash_07', x: 820, y: 490, typeIndex: 1, rotation: 0.16 },
      { id: 'map2_trash_08', x: 1190, y: 640, typeIndex: 2, rotation: -0.12 },
      { id: 'map2_trash_09', x: 860, y: 1330, typeIndex: 3, rotation: 0.19 },
      { id: 'map2_trash_10', x: 1180, y: 1390, typeIndex: 4, rotation: -0.25 },
      { id: 'map2_trash_11', x: 840, y: 1720, typeIndex: 0, rotation: 0.14 },
      { id: 'map2_trash_12', x: 1520, y: 300, typeIndex: 1, rotation: -0.18 },
      { id: 'map2_trash_13', x: 1620, y: 560, typeIndex: 2, rotation: 0.21 },
      { id: 'map2_trash_14', x: 1560, y: 1100, typeIndex: 3, rotation: -0.11 },
      { id: 'map2_trash_15', x: 1660, y: 1390, typeIndex: 4, rotation: 0.17 },
      { id: 'map2_trash_16', x: 1024, y: 260, typeIndex: 0, rotation: -0.20 }
    ],
    enemySpawns: [
      { id: 'map2_rat_01', type: 'scratcher', x: 360, y: 340 },
      { id: 'map2_rat_02', type: 'cheese_thrower', x: 260, y: 680 },
      { id: 'map2_rat_03', type: 'spitter', x: 320, y: 1160 },
      { id: 'map2_rat_04', type: 'scratcher', x: 360, y: 1560 },
      { id: 'map2_rat_05', type: 'cheese_thrower', x: 260, y: 1860 },
      { id: 'map2_rat_06', type: 'spitter', x: 460, y: 1800 },
      { id: 'map2_rat_07', type: 'scratcher', x: 920, y: 560 },
      { id: 'map2_rat_08', type: 'spitter', x: 1180, y: 580 },
      { id: 'map2_rat_09', type: 'cheese_thrower', x: 820, y: 1040 },
      { id: 'map2_rat_10', type: 'scratcher', x: 1200, y: 1060 },
      { id: 'map2_rat_11', type: 'spitter', x: 860, y: 1440 },
      { id: 'map2_rat_12', type: 'cheese_thrower', x: 1180, y: 1480 },
      { id: 'map2_rat_13', type: 'scratcher', x: 840, y: 1800 },
      { id: 'map2_rat_14', type: 'cheese_thrower', x: 1520, y: 340 },
      { id: 'map2_rat_15', type: 'spitter', x: 1680, y: 520 },
      { id: 'map2_rat_16', type: 'scratcher', x: 1560, y: 1080 },
      { id: 'map2_rat_17', type: 'spitter', x: 1660, y: 1360 }
    ],
    floorZones: [],
    transitionZone: {
      x: 930,
      y: 70,
      w: 190,
      h: 160,
      label: 'ZONA DE EXTRAÇÃO → TÚNEL DO REATOR',
      subLabel: 'Pressione [E] ou [Espaço] para concluir a fase',
      strokeColor: '#4ade80',
      fillColor: 'rgba(74, 222, 128, 0.28)'
    },
    elevatedStructures: [
      {
        id: 'bridge_central_upper',
        name: 'Passarela Metálica Superior',
        x: 748,
        y: 816,
        w: 576,
        h: 128,
        srcX: 374,
        srcY: 408,
        srcW: 288,
        srcH: 64,
        depth: 0.06
      },
      {
        id: 'bridge_central_lower',
        name: 'Passarela Metálica Inferior',
        x: 948,
        y: 1832,
        w: 376,
        h: 128,
        srcX: 474,
        srcY: 916,
        srcW: 188,
        srcH: 64,
        depth: 0.05
      },
      {
        id: 'ramp_platform_upper',
        name: 'Plataforma Elevada Noroeste',
        x: 948,
        y: 486,
        w: 144,
        h: 80,
        srcX: 474,
        srcY: 243,
        srcW: 72,
        srcH: 40,
        depth: 0.04
      },
      {
        id: 'ramp_platform_lower',
        name: 'Plataforma Elevada Sudoeste',
        x: 948,
        y: 1320,
        w: 144,
        h: 80,
        srcX: 474,
        srcY: 660,
        srcW: 72,
        srcH: 40,
        depth: 0.04
      }
    ],
    obstacles: [
      // 1. Limites externos (2048x2048)
      { x: 0, y: 0, w: 2048, h: 60, label: 'LIMITE NORTE' },
      { x: 0, y: 1988, w: 2048, h: 60, label: 'LIMITE SUL' },
      { x: 0, y: 60, w: 60, h: 1928, label: 'LIMITE OESTE' },
      { x: 1988, y: 60, w: 60, h: 1928, label: 'LIMITE LESTE' },

      // 2. Paredes da Garagem da Van (Com portas amplas ao norte e a oeste)
      { x: 1540, y: 1540, w: 448, h: 48, label: 'PAREDE NORTE DA GARAGEM' },
      { x: 1340, y: 1540, w: 48, h: 90, label: 'PAREDE OESTE GARAGEM ALTA' },
      { x: 1340, y: 1770, w: 48, h: 218, label: 'PAREDE OESTE GARAGEM BAIXA' },
      { x: 1550, y: 1685, w: 290, h: 150, label: 'VAN DE OPERAÇÕES', customStroke: '#f59e0b', customFill: 'rgba(245, 158, 11, 0.2)' },

      // 3. Divisórias Centro-Leste (aberturas amplas em Y: 440..660 e Y: 1200..1540)
      { x: 1340, y: 60, w: 48, h: 380, label: 'PILAR LESTE NORTE' },
      { x: 1340, y: 660, w: 48, h: 540, label: 'PILAR LESTE CENTRO' },

      // 4. Divisórias Oeste-Centro (aberturas amplas em Y: 440..680 e Y: 1240..1480)
      { x: 660, y: 60, w: 48, h: 380, label: 'PILAR OESTE NORTE' },
      { x: 660, y: 680, w: 48, h: 560, label: 'PILAR OESTE CENTRO' },
      { x: 660, y: 1480, w: 48, h: 440, label: 'PILAR OESTE SUL' },

      // 5. Maquinários Industriais Laterais
      { x: 1840, y: 260, w: 148, h: 220, label: 'GERADOR NORDESTE' },
      { x: 1840, y: 1060, w: 148, h: 220, label: 'CALDEIRA LESTE' },
      { x: 60, y: 1460, w: 150, h: 240, label: 'MAQUINÁRIO SUDOESTE' }
    ]
  },

  // =========================================================================
  // MAPA 3: COMPLEXO SUBTERRÂNEO [SETOR GAMMA] (2500 x 2500 px)
  // =========================================================================
  map3: {
    id: 'map3',
    name: 'MAPA 3: COMPLEXO SUBTERRÂNEO [SETOR GAMMA]',
    subtitle: 'Fase Final • Colete os 16 lixos e derrote o Rei Rato Radioativo!',
    width: 2500,
    height: 2500,
    isSafeRoom: false,
    stageNumber: 3,
    palette: {
      bg: '#1c1018',
      wallFill: 'rgba(76, 29, 49, 0.92)',
      wallStroke: '#fb7185',
      pathFill: 'rgba(244, 63, 94, 0.14)',
      pathStroke: 'rgba(251, 113, 133, 0.30)'
    },
    spawnP1: { x: 1210, y: 320 },
    spawnP2: { x: 1290, y: 320 },
    // Exatamente 16 lixos perfeitamente acessíveis nos corredores e na arena
    trashSpawns: [
      { id: 'map3_trash_01', x: 1250, y: 460, typeIndex: 4, rotation: 0.15 },
      { id: 'map3_trash_02', x: 1250, y: 640, typeIndex: 3, rotation: -0.20 },
      { id: 'map3_trash_03', x: 1250, y: 800, typeIndex: 0, rotation: 0.10 },
      { id: 'map3_trash_04', x: 1120, y: 980, typeIndex: 1, rotation: -0.14 },
      { id: 'map3_trash_05', x: 1020, y: 1080, typeIndex: 2, rotation: 0.22 },
      { id: 'map3_trash_06', x: 820, y: 1080, typeIndex: 3, rotation: -0.18 },
      { id: 'map3_trash_07', x: 660, y: 1080, typeIndex: 4, rotation: 0.12 },
      { id: 'map3_trash_08', x: 1380, y: 980, typeIndex: 0, rotation: -0.24 },
      { id: 'map3_trash_09', x: 1480, y: 1080, typeIndex: 1, rotation: 0.16 },
      { id: 'map3_trash_10', x: 1680, y: 1080, typeIndex: 2, rotation: -0.11 },
      { id: 'map3_trash_11', x: 1840, y: 1080, typeIndex: 3, rotation: 0.19 },
      { id: 'map3_trash_12', x: 1250, y: 1260, typeIndex: 4, rotation: -0.15 },
      { id: 'map3_trash_13', x: 1250, y: 1460, typeIndex: 0, rotation: 0.21 },
      { id: 'map3_trash_14', x: 1250, y: 1660, typeIndex: 1, rotation: -0.17 },
      { id: 'map3_trash_15', x: 1020, y: 1820, typeIndex: 2, rotation: 0.14 },
      { id: 'map3_trash_16', x: 1480, y: 1820, typeIndex: 3, rotation: -0.22 }
    ],
    enemySpawns: [
      { id: 'boss_alpha', type: 'boss_alpha', x: 1250, y: 1080 }
    ],
    floorZones: [
      { x: 1100, y: 180, w: 300, h: 220, label: 'ELEVADOR DE CARGA [GAMMA]' },
      { x: 1160, y: 400, w: 180, h: 620, label: 'CORREDOR NORTE' },
      { x: 620, y: 960, w: 1260, h: 240, label: 'ARENA CENTRAL DO REATOR' },
      { x: 1160, y: 1200, w: 180, h: 840, label: 'EIXO DE EXTRAÇÃO SUL' }
    ],
    transitionZone: {
      x: 1120,
      y: 2040,
      w: 260,
      h: 220,
      label: 'EXTRAÇÃO FINAL DA EXPEDIÇÃO',
      subLabel: 'Pressione [E] ou [Espaço] para concluir',
      strokeColor: '#fb7185',
      fillColor: 'rgba(244, 63, 94, 0.26)'
    },
    obstacles: [
      { x: 0, y: 0, w: 2500, h: 40, label: 'LIMITE NORTE' },
      { x: 0, y: 2460, w: 2500, h: 40, label: 'LIMITE SUL' },
      { x: 0, y: 40, w: 40, h: 2420, label: 'LIMITE OESTE' },
      { x: 2460, y: 40, w: 40, h: 2420, label: 'LIMITE LESTE' },

      // Estruturas Simétricas do Laboratório Subterrâneo (com corredores amplos)
      { x: 680, y: 420, w: 360, h: 420, label: 'CÂMARA DE CRIOGENIA OESTE' },
      { x: 1460, y: 420, w: 360, h: 420, label: 'CÂMARA DE CRIOGENIA LESTE' },
      { x: 320, y: 960, w: 260, h: 520, label: 'GERADOR AUXILIAR A' },
      { x: 1920, y: 960, w: 260, h: 520, label: 'GERADOR AUXILIAR B' },
      { x: 740, y: 1300, w: 320, h: 440, label: 'PILAR DE CONTENÇÃO 01' },
      { x: 1440, y: 1300, w: 320, h: 440, label: 'PILAR DE CONTENÇÃO 02' },
      { x: 520, y: 1940, w: 460, h: 240, label: 'BLOCO DE SEGURANÇA OESTE' },
      { x: 1520, y: 1940, w: 460, h: 240, label: 'BLOCO DE SEGURANÇA LESTE' }
    ]
  }
};

// Inicialização dinâmica dos obstáculos do Mapa 1 (Base + Água)
if (window.GameMaps && window.GameMaps.map1) {
  window.GameMaps.map1.obstacles = window.GameMaps.map1.baseObstacles.concat(window.GameMaps.map1.waterObstacles);
}
