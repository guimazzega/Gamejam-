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
<<<<<<< Updated upstream
    name: 'MAPA 1: ARREDORES FLORESTAIS [SETOR ALPHA]',
    subtitle: 'Dimensões: 2500x2500px • 16 Lixos Fixos Persistentes • Siga até a Zona de Extração',
    width: 2500,
    height: 2500,
=======
    name: 'MAPA 1: CIDADE PÓS-APOCALÍPTICA [FASE 01]',
    subtitle: 'Dimensões: 2048x2048px • Navegue pelas ruínas, atravesse a ponte sobre o rio e embarque na Van',
    imageSrc: 'assets/maps/fase1/fase_01.jpeg',
    imageFallbackSrc: 'assets/maps/fase1/mapa_01.jpg',
    width: 2048,
    height: 2048,
>>>>>>> Stashed changes
    isSafeRoom: false,
    cameraZoom: 1.7, // Câmera próxima acompanhando o jogador
    palette: {
      bg: '#181b22',
      gridMinor: 'rgba(148, 163, 184, 0.08)',
      gridMajor: 'rgba(148, 163, 184, 0.20)',
      coordText: 'rgba(148, 163, 184, 0.45)',
      wallFill: 'rgba(239, 68, 68, 0.22)',
      wallStroke: '#f87171',
      pathFill: 'rgba(56, 189, 248, 0.10)',
      pathStroke: 'rgba(56, 189, 248, 0.30)'
    },
<<<<<<< Updated upstream
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
=======
    // Spawns iniciais dos jogadores na rua asfaltada ao norte (próximo às cabanas)
    spawnP1: { x: 500, y: 320 },
    spawnP2: { x: 580, y: 320 },
    // 16 Lixos / Sucatas em posições fixas distribuídas pelas ruas, ruínas, margens do rio e van
    trashSpawns: [
      { id: 'map1_trash_01', x: 350, y: 260, typeIndex: 0, rotation: 0.15 },  // Acampamento destruído ao norte
      { id: 'map1_trash_02', x: 260, y: 520, typeIndex: 1, rotation: -0.22 }, // Pátio da casa em ruínas #01
      { id: 'map1_trash_03', x: 740, y: 320, typeIndex: 2, rotation: 0.08 },  // Curva da rua norte
      { id: 'map1_trash_04', x: 1050, y: 320, typeIndex: 3, rotation: -0.18 },// Beco entre ruínas e Loja Moon
      { id: 'map1_trash_05', x: 1320, y: 340, typeIndex: 4, rotation: 0.25 }, // Entrada da fábrica norte
      { id: 'map1_trash_06', x: 1520, y: 580, typeIndex: 0, rotation: -0.12 },// Próximo à subestação elétrica
      { id: 'map1_trash_07', x: 1380, y: 680, typeIndex: 1, rotation: 0.20 }, // Fogueira da oficina/garagem
      { id: 'map1_trash_08', x: 720, y: 880, typeIndex: 2, rotation: -0.25 }, // Margem norte do rio perto dos carros
      { id: 'map1_trash_09', x: 1100, y: 940, typeIndex: 3, rotation: 0.14 }, // Acesso à ponte de madeira
      { id: 'map1_trash_10', x: 1300, y: 1150, typeIndex: 4, rotation: -0.10 },// Diretamente na travessia da ponte do rio!
      { id: 'map1_trash_11', x: 1100, y: 1340, typeIndex: 0, rotation: 0.18 },// Margem sul do rio
      { id: 'map1_trash_12', x: 740, y: 1520, typeIndex: 1, rotation: -0.20 },// Beco residencial sul
      { id: 'map1_trash_13', x: 300, y: 1720, typeIndex: 2, rotation: 0.12 }, // Ruínas do pátio sudoeste
      { id: 'map1_trash_14', x: 780, y: 1820, typeIndex: 3, rotation: -0.16 },// Rua sul do barracão
      { id: 'map1_trash_15', x: 1600, y: 1560, typeIndex: 4, rotation: 0.22 },// Pátio leste entre casas e armazém
      { id: 'map1_trash_16', x: 1160, y: 1660, typeIndex: 0, rotation: -0.14 } // Portão do pátio da Van de Extração
    ],
    // Áreas de referência / vias principais no mapa
>>>>>>> Stashed changes
    floorZones: [
      { x: 320, y: 240, w: 420, h: 140, label: 'AVENIDA NORTE [SPAWN]' },
      { x: 680, y: 380, w: 140, h: 540, label: 'CORREDOR CENTRAL' },
      { x: 740, y: 860, w: 560, h: 140, label: 'AVENIDA DO RIO [NORTE]' },
      { x: 1240, y: 1000, w: 120, h: 300, label: 'PONTE DE TRAVESSIA' },
      { x: 680, y: 1260, w: 600, h: 140, label: 'AVENIDA DO RIO [SUL]' },
      { x: 680, y: 1380, w: 140, h: 480, label: 'ACESSO SUL' }
    ],
<<<<<<< Updated upstream
=======
    // Zona de Extração / Saída para a Safe Room da Van (no pátio cercado onde a Van está estacionada!)
>>>>>>> Stashed changes
    transitionZone: {
      x: 1210,
      y: 1540,
      w: 220,
      h: 220,
      label: 'ZONA DE EXTRAÇÃO → EMBARCAR NA VAN',
      subLabel: 'Aproxime-se da Van e pressione [E] ou permaneça na zona',
      strokeColor: '#38bdf8',
      fillColor: 'rgba(56, 189, 248, 0.28)'
    },
<<<<<<< Updated upstream
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
=======
    // Obstáculos de Colisão: Casas, Prédios, Rio, Tubulação, Cercas e Carros (com ponte aberta para travessia)
    obstacles: [
      // -------------------------------------------------------------
      // 1. LIMITES DO MAPA (Boundaries 2048 x 2048 px)
      // -------------------------------------------------------------
      { x: 0, y: 0, w: 2048, h: 32, label: 'LIMITE NORTE', category: 'boundary' },
      { x: 0, y: 2016, w: 2048, h: 32, label: 'LIMITE SUL', category: 'boundary' },
      { x: 0, y: 32, w: 32, h: 1984, label: 'LIMITE OESTE', category: 'boundary' },
      { x: 2016, y: 32, w: 32, h: 1984, label: 'LIMITE LESTE', category: 'boundary' },

      // -------------------------------------------------------------
      // 2. O RIO & ÁGUAS PROFUNDAS (Com passagem aberta na ponte em x: 1240-1360)
      // -------------------------------------------------------------
      // Mar / Costa oeste profunda
      {
        x: 0,
        y: 460,
        w: 120,
        h: 1180,
        label: 'ÁGUAS PROFUNDAS [COSTA OESTE]',
        category: 'water',
        customFill: 'rgba(14, 116, 144, 0.35)',
        customStroke: '#38bdf8'
      },
      // Tubulação industrial gigante de esgoto/drenagem
      {
        x: 0,
        y: 880,
        w: 320,
        h: 360,
        label: 'TUBULAÇÃO DE ESGOTO INDUSTRIAL',
        category: 'water',
        customFill: 'rgba(30, 41, 59, 0.85)',
        customStroke: '#06b6d4'
      },
      // Bacia do remoinho de saída d’água da tubulação
      {
        x: 280,
        y: 960,
        w: 360,
        h: 360,
        label: 'REMOINHO & CORRENTEZA DO RIO',
        category: 'water',
        customFill: 'rgba(14, 116, 144, 0.38)',
        customStroke: '#38bdf8'
      },
      // Rio Contaminado - Trecho Oeste (Do remoinho até a ponte de madeira)
      {
        x: 640,
        y: 1020,
        w: 600,
        h: 260,
        label: 'RIO CONTAMINADO [TRECHO OESTE]',
        category: 'water',
        customFill: 'rgba(14, 116, 144, 0.35)',
        customStroke: '#38bdf8'
      },
      // NOTA: Em x: 1240 até 1360 (y: 1020-1280) fica a PONTE DE MADEIRA ABERTA para os jogadores atravessarem!
      // Rio Contaminado - Trecho Leste (Da ponte de madeira até o limite direito do mapa)
      {
        x: 1360,
        y: 1020,
        w: 688,
        h: 260,
        label: 'RIO CONTAMINADO [TRECHO LESTE]',
        category: 'water',
        customFill: 'rgba(14, 116, 144, 0.35)',
        customStroke: '#38bdf8'
      },

      // -------------------------------------------------------------
      // 3. CASAS E PRÉDIOS DO SETOR NORTE (Acima do Rio)
      // -------------------------------------------------------------
      // Cabana e acampamento no canto noroeste
      {
        x: 40,
        y: 32,
        w: 280,
        h: 190,
        label: 'CABANA EM RUÍNAS [NOROESTE]',
        category: 'building',
        customFill: 'rgba(185, 28, 28, 0.28)',
        customStroke: '#f87171'
      },
      {
        x: 40,
        y: 220,
        w: 260,
        h: 120,
        label: 'ACAMPAMENTO DESTRUÍDO / ROCHAS',
        category: 'building',
        customFill: 'rgba(120, 53, 15, 0.28)',
        customStroke: '#fbbf24'
      },
      // Galpão de madeira ao norte
      {
        x: 380,
        y: 32,
        w: 410,
        h: 210,
        label: 'GALPÃO ABANDONADO [NORTE]',
        category: 'building',
        customFill: 'rgba(185, 28, 28, 0.28)',
        customStroke: '#f87171'
      },
      // Residência destruída com teto arruinado (lado oeste)
      {
        x: 120,
        y: 370,
        w: 360,
        h: 230,
        label: 'CASA EM RUÍNAS #01',
        category: 'building',
        customFill: 'rgba(185, 28, 28, 0.28)',
        customStroke: '#f87171'
      },
      // Sobrado adjacente
      {
        x: 480,
        y: 370,
        w: 200,
        h: 310,
        label: 'SOBRADO ABANDONADO',
        category: 'building',
        customFill: 'rgba(185, 28, 28, 0.28)',
        customStroke: '#f87171'
      },
      // Casa de tijolos voltada para o rio
      {
        x: 340,
        y: 740,
        w: 300,
        h: 210,
        label: 'CASA DE TIJOLOS EM RUÍNAS',
        category: 'building',
        customFill: 'rgba(185, 28, 28, 0.28)',
        customStroke: '#f87171'
      },
      // Edifício de tijolos central
      {
        x: 820,
        y: 200,
        w: 300,
        h: 240,
        label: 'CASA CENTRAL DESTRUÍDA',
        category: 'building',
        customFill: 'rgba(185, 28, 28, 0.28)',
        customStroke: '#f87171'
      },
      // Prédio comercial "MOON" com letreiro neon
      {
        x: 830,
        y: 480,
        w: 230,
        h: 300,
        label: 'COMÉRCIO "MOON" [EDIFÍCIO]',
        category: 'building',
        customFill: 'rgba(88, 28, 135, 0.32)',
        customStroke: '#c084fc'
      },
      // Oficina mecânica / Galpão com buraco no telhado
      {
        x: 1140,
        y: 420,
        w: 380,
        h: 240,
        label: 'OFICINA / GARAGEM INDUSTRIAL',
        category: 'building',
        customFill: 'rgba(185, 28, 28, 0.28)',
        customStroke: '#f87171'
      },
      // Fábrica com dutos de ar (nordeste)
      {
        x: 1140,
        y: 32,
        w: 400,
        h: 330,
        label: 'FÁBRICA DE PROCESSAMENTO [NORTE]',
        category: 'building',
        customFill: 'rgba(71, 85, 105, 0.40)',
        customStroke: '#94a3b8'
      },
      // Subestação elétrica com postes e transformadores
      {
        x: 1560,
        y: 80,
        w: 400,
        h: 580,
        label: 'SUBESTAÇÃO ELÉTRICA / TRANSFORMADORES',
        category: 'building',
        customFill: 'rgba(120, 53, 15, 0.35)',
        customStroke: '#f59e0b'
      },
      // Depósito comercial leste
      {
        x: 1420,
        y: 770,
        w: 310,
        h: 240,
        label: 'DEPÓSITO INDUSTRIAL LESTE',
        category: 'building',
        customFill: 'rgba(185, 28, 28, 0.28)',
        customStroke: '#f87171'
      },
      // Galpão de carga leste
      {
        x: 1780,
        y: 770,
        w: 236,
        h: 240,
        label: 'GALPÃO DE CARGA #03',
        category: 'building',
        customFill: 'rgba(71, 85, 105, 0.40)',
        customStroke: '#94a3b8'
      },

      // -------------------------------------------------------------
      // 4. CASAS E ESTRUTURAS DO SETOR SUL (Abaixo do Rio)
      // -------------------------------------------------------------
      // Residência em ruínas voltada para o rio (lado sul)
      {
        x: 360,
        y: 1320,
        w: 280,
        h: 220,
        label: 'RESIDÊNCIA SUL EM RUÍNAS',
        category: 'building',
        customFill: 'rgba(185, 28, 28, 0.28)',
        customStroke: '#f87171'
      },
      // Casa sudoeste #01 (teto azul)
      {
        x: 60,
        y: 1640,
        w: 310,
        h: 320,
        label: 'CASA SUL-OESTE #01',
        category: 'building',
        customFill: 'rgba(30, 58, 138, 0.32)',
        customStroke: '#60a5fa'
      },
      // Casa sudoeste #02 (teto marrom)
      {
        x: 400,
        y: 1640,
        w: 260,
        h: 360,
        label: 'CASA SUL-OESTE #02',
        category: 'building',
        customFill: 'rgba(185, 28, 28, 0.28)',
        customStroke: '#f87171'
      },
      // Edifício central sul (com duto na laje)
      {
        x: 890,
        y: 1490,
        w: 260,
        h: 280,
        label: 'EDIFÍCIO CENTRAL SUL',
        category: 'building',
        customFill: 'rgba(71, 85, 105, 0.40)',
        customStroke: '#94a3b8'
      },
      // Barracão destruído no rodapé central
      {
        x: 890,
        y: 1830,
        w: 280,
        h: 180,
        label: 'BARRACÃO DESTRUÍDO',
        category: 'building',
        customFill: 'rgba(120, 53, 15, 0.32)',
        customStroke: '#fbbf24'
      },
      // Casa de madeira sudeste
      {
        x: 1440,
        y: 1200,
        w: 240,
        h: 330,
        label: 'CASA DE MADEIRA [SETOR LESTE]',
        category: 'building',
        customFill: 'rgba(185, 28, 28, 0.28)',
        customStroke: '#f87171'
      },
      // Armazém de suprimentos sudeste
      {
        x: 1710,
        y: 1230,
        w: 290,
        h: 300,
        label: 'ARMAZÉM DE SUPRIMENTOS LESTE',
        category: 'building',
        customFill: 'rgba(71, 85, 105, 0.40)',
        customStroke: '#94a3b8'
      },
      // Complexo industrial no canto sudeste
      {
        x: 1280,
        y: 1810,
        w: 736,
        h: 206,
        label: 'COMPLEXO INDUSTRIAL SUL',
        category: 'building',
        customFill: 'rgba(51, 65, 85, 0.45)',
        customStroke: '#94a3b8'
      },

      // -------------------------------------------------------------
      // 5. VEÍCULOS DESTRUÍDOS E BLOQUEIOS TÁTICOS NA PISTA
      // -------------------------------------------------------------
      // Carros abandonados na rua norte do rio
      {
        x: 840,
        y: 920,
        w: 120,
        h: 90,
        label: 'VEÍCULO CAPOTADO',
        category: 'vehicle',
        customFill: 'rgba(217, 119, 6, 0.30)',
        customStroke: '#f59e0b'
      },
      {
        x: 980,
        y: 920,
        w: 100,
        h: 80,
        label: 'CARRO AZUL ABANDONADO',
        category: 'vehicle',
        customFill: 'rgba(37, 99, 235, 0.30)',
        customStroke: '#60a5fa'
      },
      // Cratera / Barreira na avenida sul
      {
        x: 970,
        y: 1390,
        w: 130,
        h: 80,
        label: 'CRATERA & BARREIRAS',
        category: 'vehicle',
        customFill: 'rgba(234, 88, 12, 0.30)',
        customStroke: '#fb923c'
      },
      // Carros quebrados no noroeste
      {
        x: 60,
        y: 280,
        w: 140,
        h: 80,
        label: 'VEÍCULO DESTROÇADO',
        category: 'vehicle',
        customFill: 'rgba(100, 116, 139, 0.35)',
        customStroke: '#94a3b8'
      },
      // Fogueira e entulhos ao lado da oficina
      {
        x: 1260,
        y: 660,
        w: 140,
        h: 100,
        label: 'FOGUEIRA & ENTULHOS',
        category: 'vehicle',
        customFill: 'rgba(220, 38, 38, 0.30)',
        customStroke: '#ef4444'
      }
>>>>>>> Stashed changes
    ]
  },

  // =========================================================================
<<<<<<< Updated upstream
  // SAFE ROOM EXPANDIDA: A VAN (1440 x 920 px)
=======
  // SAFE ROOM: A VAN DE OPERAÇÕES (1254 x 1254 px)
>>>>>>> Stashed changes
  // =========================================================================
  van: {
    id: 'van',
    name: 'SAFE ROOM: A VAN DE OPERAÇÕES',
    subtitle: 'Base Móvel Blindada • Cronômetro Pausado • Loja, Crafting, Rádio e Descanso',
    imageSrc: 'assets/maps/fase1/dentro_da_van.png',
    width: 1254,
    height: 1254,
    isSafeRoom: true,
<<<<<<< Updated upstream
    fixedTrashSpawns: [],
=======
    cameraZoom: 1.5, // Foco acolhedor valorizando o pixel art do interior da Van
>>>>>>> Stashed changes
    palette: {
      bg: '#0c0f17',
      gridMinor: 'rgba(251, 191, 36, 0.08)',
      gridMajor: 'rgba(251, 191, 36, 0.22)',
      coordText: 'rgba(251, 191, 36, 0.45)',
      wallFill: 'rgba(30, 41, 59, 0.75)',
      wallStroke: '#f59e0b',
      pathFill: 'rgba(56, 189, 248, 0.12)',
      pathStroke: 'rgba(56, 189, 248, 0.40)'
    },
<<<<<<< Updated upstream
    spawnP1: { x: 260, y: 460 },
    spawnP2: { x: 340, y: 460 },
=======
    // Spawn inicial dos dois personagens no piso metálico central da van
    spawnP1: { x: 570, y: 620 },
    spawnP2: { x: 670, y: 620 },
    trashSpawns: [],
>>>>>>> Stashed changes
    floorZones: [
      { x: 140, y: 140, w: 980, h: 980, label: 'INTERIOR DA VAN' }
    ],
<<<<<<< Updated upstream
=======
    // Estações Interativas (Lojinha, Mesa de Craft e Rádio de Telemetria)
>>>>>>> Stashed changes
    interactiveStations: [
      {
        id: 'shop',
        name: 'Lojinha (Shop)',
        icon: '🛒',
        x: 260,
        y: 350,
        w: 420,
        h: 110,
        zoneLabel: 'ÁREA D/ INTERAÇÃO: LOJINHA (SHOP)',
<<<<<<< Updated upstream
        promptText: 'Pressione [E] ou [Espaço] para abrir a Lojinha (Compra & Venda)',
=======
        promptText: 'Pressione [E] para Acessar a Loja',
>>>>>>> Stashed changes
        strokeColor: '#facc15',
        fillColor: 'rgba(250, 204, 21, 0.18)'
      },
      {
        id: 'crafting',
        name: 'Mesa de Craft (Crafting)',
        icon: '🔨',
<<<<<<< Updated upstream
        x: 450,
        y: 570,
        w: 280,
        h: 195,
        zoneLabel: 'ÁREA D/ INTERAÇÃO: MESA DE CRAFT (MALETA 8x4)',
        promptText: 'Pressione [E] ou [Espaço] para abrir a Mesa de Craft (Maleta 8x4)',
=======
        x: 210,
        y: 805,
        w: 400,
        h: 115,
        zoneLabel: 'ÁREA D/ INTERAÇÃO: MESA DE CRAFT (CRAFTING)',
        promptText: 'Pressione [E] para Mesa de Crafting',
>>>>>>> Stashed changes
        strokeColor: '#c084fc',
        fillColor: 'rgba(192, 132, 252, 0.18)'
      },
      {
        id: 'radio',
        name: 'Rádio & Telemetria',
        icon: '📡',
        x: 700,
        y: 345,
        w: 430,
        h: 100,
        zoneLabel: 'ÁREA D/ INTERAÇÃO: RÁDIO & TELEMETRIA',
        promptText: 'Pressione [E] para Transmissão de Rádio',
        strokeColor: '#38bdf8',
        fillColor: 'rgba(56, 189, 248, 0.18)'
      }
    ],
<<<<<<< Updated upstream
=======
    // Porta da Van / Saída para Desembarque na Fase
>>>>>>> Stashed changes
    transitionZone: {
      x: 930,
      y: 470,
      w: 160,
      h: 260,
      label: 'SAÍDA DA VAN → INICIAR EXPEDIÇÃO',
      subLabel: 'Aproxime-se da porta ou pressione [E] / [Espaço] para desembarcar',
      strokeColor: '#38bdf8',
      fillColor: 'rgba(56, 189, 248, 0.22)'
    },
    // Obstáculos / Caixas de Colisão acompanhando o chassi e a mobília da imagem (1254x1254)
    obstacles: [
<<<<<<< Updated upstream
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
=======
      // 1. Blindagem Externa / Chassi da Van
      { x: 0, y: 0, w: 1254, h: 110, label: 'BLINDAGEM NORTE DA VAN' },
      { x: 0, y: 1140, w: 1254, h: 114, label: 'BLINDAGEM SUL DA VAN' },
      { x: 0, y: 0, w: 110, h: 1254, label: 'BLINDAGEM OESTE DA VAN' },
      { x: 1145, y: 0, w: 110, h: 370, label: 'BLINDAGEM LESTE [SUPERIOR]' },
      { x: 1145, y: 770, w: 110, h: 484, label: 'BLINDAGEM LESTE [INFERIOR]' },

      // 2. Prateleiras, Armários e Plantas da Parede Esquerda
      {
        x: 105,
        y: 110,
        w: 75,
        h: 1030,
        label: 'ARMÁRIOS & SUPRIMENTOS DA PAREDE',
        customFill: 'rgba(30, 41, 59, 0.85)',
        customStroke: '#64748b'
      },

      // 3. Balcão e Prateleiras da Lojinha (Shop)
      {
        x: 260,
        y: 110,
        w: 420,
        h: 245,
        label: '🛒 BALCÃO & ESTOQUE DA LOJINHA',
        subTag: '[ESTAÇÃO INTERATIVA: LOJINHA]',
        customFill: 'rgba(161, 98, 7, 0.85)',
        customStroke: '#facc15'
      },

      // 4. Bancada de Computadores e Servidores (Rádio & Telemetria)
      {
        x: 700,
        y: 110,
        w: 430,
        h: 235,
        label: '📡 PAINEL DE CONTROLE & MONITORES',
        subTag: '[ESTAÇÃO INTERATIVA: RÁDIO]',
        customFill: 'rgba(14, 116, 144, 0.85)',
        customStroke: '#38bdf8'
      },

      // 5. Cama e Mobília da Área de Descanso
      {
        x: 175,
        y: 335,
        w: 145,
        h: 275,
        label: 'CAMA TÁTICA / BELICHE',
        customFill: 'rgba(71, 85, 105, 0.85)',
        customStroke: '#94a3b8'
      },
      {
        x: 260,
        y: 560,
        w: 100,
        h: 155,
        label: 'MESA DE CABECEIRA & CADEIRA',
        customFill: 'rgba(71, 85, 105, 0.85)',
        customStroke: '#94a3b8'
      },

      // 6. Bancada de Trabalho com Ferramentas (Mesa de Craft)
      {
        x: 210,
        y: 915,
        w: 400,
        h: 230,
        label: '🔨 MESA DE TRABALHO & FERRAMENTAS',
        subTag: '[ESTAÇÃO INTERATIVA: CRAFTING]',
        customFill: 'rgba(88, 28, 135, 0.85)',
        customStroke: '#c084fc'
      },

      // 7. Gerador Auxiliar a Diesel e Baterias
      {
        x: 680,
        y: 920,
        w: 320,
        h: 225,
        label: '⚡ GERADOR INDUSTRIAL DE ENERGIA',
        customFill: 'rgba(180, 83, 9, 0.85)',
        customStroke: '#f59e0b'
      },
      {
        x: 1000,
        y: 990,
        w: 145,
        h: 155,
        label: 'CAIXAS DE PEÇAS & BATERIAS',
        customFill: 'rgba(51, 65, 85, 0.85)',
        customStroke: '#94a3b8'
      }
>>>>>>> Stashed changes
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
