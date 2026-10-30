/**
 * js/main.js
 * Motor Principal do Protótipo 2D Top-Down ("ScienceEco Girls"):
 * - Máquina de Estados e Fluxo: Van Inicial -> Mapa 1 -> Van -> Mapa 2 -> Van -> Mapa 3 -> Van Final
 * - Escolha na Van: Avançar para a próxima fase vs Voltar para a fase anterior (Replay/Farm)
 * - Tela de Estatísticas na Van (Lixos X/Y, Inimigos [oculto no M1], Rank S+/S/A/B baseado no tempo)
 * - Zonas de Interação da Van (Hub): Loja de Armas Melee e Mural de Avisos
 * - Sistema de Inputs de Ataque:
 *   • Singleplayer: Botão Esquerdo do Mouse mirando na direção do cursor / Tecla R
 *   • Multiplayer Local: Jogador 1 ataca com 'R' e Jogador 2 ataca com '0'
 * - HUD Exclusivo: Apenas Vida (Health) e Tempo (Time)
 * - Persistência das 16 posições fixas de lixos por mapa
 * - Drenagem automática da água na Fase 1 ao coletar metade dos lixos (8 lixos)
 * - Tela de Vitória Definitiva ao derrotar o Chefão Final: "Obrigado por jogar!"
 * - Remoção total de ferramentas de desenvolvimento, inventário e crafting
 */

class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');

    // Bloqueio do menu de contexto padrão do navegador
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // Estado da Aplicação: 'MAIN_MENU' | 'PLAYING' | 'PAUSED' | 'GAMEOVER'
    this.appState = 'MAIN_MENU';
    this.gameState = 'MENU';
    this.isEditorMode = false;
    this.afkTimer = 0;

    // Modo de Jogo: 'singleplayer' | 'multiplayer'
    this.gameMode = 'singleplayer';

    // Máquina de Estados de Fases:
    // 0: Van Inicial -> 1: Mapa 1 -> 2: Van -> 3: Mapa 2 -> 4: Van -> 5: Mapa 3 -> 6: Van Final
    this.stageFlowIndex = 0;
    this.currentMap = window.GameMaps ? window.GameMaps.van : null;

    // Cronômetros e Telemetria de Fase
    this.stageDuration = (window.GameConfig && window.GameConfig.STAGE_DURATION_SECONDS) || 180;
    this.stageTimeRemaining = this.stageDuration;
    this.stageElapsedTime = 0;
    this.stageTrashCollectedInRun = 0;
    this.stageEnemiesDefeated = 0;

    // Histórico para Replay/Farm e Estatísticas
    this.lastCompletedStageIndex = 1;
    this.lastCompletedStageStats = null;
    this.isShowingStageStats = false;
    this.isVictorySequence = false;
    this.victoryConfetti = [];

    // Cache de imagens de mapas / cenários
    this.mapImages = new Map();
    this._preloadMapImages();

    // Tempo de permanência na Zona de Transição dos Mapas para extração
    this.zoneHoldTimer = 0;
    this.zoneHoldDuration = 1.0;

    // Sistema de Transição de Tela Suave (Sprint 16 / Pedidos da Van)
    this.screenTransition = {
      active: false,
      phase: 'none',
      timer: 0,
      fadeDuration: 0.28,
      holdDuration: 0.08,
      progress: 0,
      targetFlowIndex: 0,
      comingFromMap: false,
      message: ''
    };
    this._vanTransitionTriggered = false;

    // Instancia os 2 Personagens (sem inventário)
    this.p1 = new window.Player({
      id: 1,
      name: 'Jogador 1',
      role: 'Batedor',
      primaryColor: '#38bdf8',
      secondaryColor: '#0284c7'
    });

    this.p2 = new window.Player({
      id: 2,
      name: 'Jogador 2',
      role: 'Suporte',
      primaryColor: '#fb923c',
      secondaryColor: '#ea580c'
    });

    this.players = [this.p1, this.p2];
    this.activePlayerIndex = 0; // 0 = P1, 1 = P2

    // Entidades de Lixo fixas restantes no mapa atual
    this.trashItems = [];

    // Textos flutuantes de feedback visual
    this.floatingTexts = [];

    // Câmera 2D
    this.camera = new window.Camera2D(window.innerWidth, window.innerHeight);

    // Gerenciador de Inputs (sem atalhos de dev)
    this.input = new window.InputManager({
      onAnyInput: () => this.resetAfkTimer(),
      onSwitchPlayer: () => this.handleSwitchPlayer(),
      onTogglePause: () => this.handlePauseShortcut(),
      onInteract: () => this.handleInteractShortcut(),
      onToggleEditor: () => this.handleToggleEditor(),
      onToggleUIEditor: () => this.handleToggleUIEditor(),
      onMouseLeftAttack: (clientX, clientY) => this.handleMouseLeftAttack(clientX, clientY),
      onPlayerAttack: (playerId, source) => this.handleKeyboardAttack(playerId, source),
      onGamepadAttack: (targetSlot, source) => this.handleGamepadAttack(targetSlot, source),
      onGamepadInteractOrAttack: (targetSlot, source) => this.handleGamepadInteractOrAttack(targetSlot, source),
      onGamepadStatusChange: (gp, connected, profile) => this.handleGamepadStatusChange(gp, connected, profile)
    });

    // Sistema de Inimigos (3 Tipos de Ratos a partir da Fase 2)
    this.enemyManager = new window.EnemyManager(this);

    // Sistema de Água Subindo (Filtro e Mecânica de Inundação na Primeira Fase)
    this.waterSystem = new window.WaterSystem(this);
    this.isGameOver = false;

    // Gerenciador de Interface de Usuário
    this.ui = new window.UIManager(this);

    // Editor de Mapas Integrado (F6)
    this.editor = new window.MapEditor(this);

    // Editor de Menus e Interface UI (Sprint 10 - F7)
    this.uiEditor = new window.UIEditor(this);

    // Ajuste de Redimensionamento
    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);
    this._onResize();

    // Carrega a Van Inicial como cenário de partida
    this.loadStageByFlowIndex(0, false);

    // Controle de Tempo do Loop
    this.lastTimestamp = performance.now();
    this.elapsedTime = 0;

    requestAnimationFrame((ts) => this._gameLoop(ts));
  }

  _onResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    if (this.camera) {
      this.camera.resize(this.canvas.width, this.canvas.height);
    }
  }

  getCurrentStageMeta() {
    const list = window.GameConfig ? window.GameConfig.STAGE_FLOW : [];
    return list[this.stageFlowIndex] || list[0];
  }

  getHudFocusPlayer() {
    if (this.gameMode === 'singleplayer') {
      return this.players[this.activePlayerIndex];
    }
    return this.p1;
  }

  /**
   * 1. Inicia o jogo na VAN INICIAL:
   * Fluxo: Van Inicial -> Mapa 1 -> Van -> Mapa 2 -> Van -> Mapa 3 -> Van Final
   */
  resetAfkTimer() {
    this.afkTimer = 0;
    if (this.players) {
      for (const p of this.players) {
        p.isAfk = false;
        p.animState = null;
      }
    }
  }

  initGame() {
    this.resetGame();
  }

  resetGame() {
    this.afkTimer = 0;
    this.isEditorMode = false;
    if (this.editor) {
      this.editor.active = false;
      if (typeof this.editor.close === 'function') this.editor.close();
    }
    if (this.uiEditor) {
      this.uiEditor.active = false;
      if (typeof this.uiEditor.close === 'function') this.uiEditor.close();
    }
    if (this.players) {
      for (const p of this.players) {
        p.isAfk = false;
        p.animState = null;
      }
    }
    this.isGameOver = false;
    this.p1.hp = this.p1.maxHp;
    this.p2.hp = this.p2.maxHp;
    this.p1.isDrowning = false;
    this.p2.isDrowning = false;
    this.p1.drowningProgress = 0;
    this.p2.drowningProgress = 0;
    this.p1.damageAnimTimer = 0;
    this.p2.damageAnimTimer = 0;
    this.activePlayerIndex = 0;
    this.floatingTexts = [];
    this.stageElapsedTime = 0;
    this.stageTrashCollectedInRun = 0;
    this.stageEnemiesDefeated = 0;
    this.isShowingStageStats = false;
    this.isVictorySequence = false;
    this.victoryConfetti = [];

    if (this.ui) {
      this.ui.hideVictoryModal();
      this.ui.hideGameOver();
    }
    if (this.waterSystem) this.waterSystem.reset();
    if (this.enemyManager) this.enemyManager.reset();
  }

  async loadMapData(filePathOrKey = 'caminho_do_arquivo.json') {
    try {
      let data = null;
      const targetStr = typeof filePathOrKey === 'string' ? filePathOrKey.trim() : 'van';
      if (typeof fetch === 'function' && (targetStr.endsWith('.json') || targetStr.includes('/') || targetStr.includes('\\'))) {
        try {
          const resp = await fetch(targetStr);
          if (resp.ok) {
            data = await resp.json();
          }
        } catch (fetchErr) {
          console.warn('[loadMapData] Fetch falhou:', fetchErr);
        }
      }
      return data;
    } catch (err) {
      console.error('[loadMapData] Erro:', err);
      return null;
    }
  }

  startNewGame() {
    this.initGame();
    this.gameState = 'VAN';
    this.isGameOver = false;
    this.p1.hp = this.p1.maxHp;
    this.p2.hp = this.p2.maxHp;
    this.p1.isDrowning = false;
    this.p2.isDrowning = false;
    this.p1.drowningProgress = 0;
    this.p2.drowningProgress = 0;
    this.p1.damageAnimTimer = 0;
    this.p2.damageAnimTimer = 0;
    this.activePlayerIndex = 0;
    this.floatingTexts = [];
    this.stageElapsedTime = 0;
    this.stageTrashCollectedInRun = 0;
    this.stageEnemiesDefeated = 0;
    this.isShowingStageStats = false;
    this.isVictorySequence = false;
    this.victoryConfetti = [];

    if (this.ui) {
      this.ui.hideVictoryModal();
      this.ui.hideGameOver();
    }
    if (this.waterSystem) this.waterSystem.reset();
    if (this.enemyManager) this.enemyManager.reset();

    // Carrega a Van Inicial (Index 0)
    this.loadStageByFlowIndex(0, false);
    this.appState = 'PLAYING';
    this.ui.showGameplayHUD();

    const C = window.GameConfig.Controls;
    const fmt = (k) => window.GameConfig.formatKeyCode(k);
    const modeDesc =
      this.gameMode === 'singleplayer'
        ? `Singleplayer (Mira e Ataque: Botão Esquerdo do Mouse / [${fmt(C.P1_Attack)}])`
        : `Multiplayer Local (P1: [${fmt(C.P1_Attack)}] • P2: [${fmt(C.P2_Attack)}])`;

    this.ui.showToast(`Expedição iniciada na Van! ${modeDesc}`, 2600);
  }

  /**
   * Carrega um estado específico na máquina de estados de fases.
   * comingFromMap indica se os jogadores acabaram de chegar na Van vindos de uma fase concluída.
   */
  loadStageByFlowIndex(flowIndex, comingFromMap = false) {
    const flowList = window.GameConfig.STAGE_FLOW;
    this.stageFlowIndex = ((flowIndex % flowList.length) + flowList.length) % flowList.length;

    const stageMeta = this.getCurrentStageMeta();
    this.currentMap = window.GameMaps[stageMeta.mapKey];

    // Posiciona os jogadores nos pontos de spawn do mapa
    this.p1.setPosition(this.currentMap.spawnP1.x, this.currentMap.spawnP1.y);
    this.p2.setPosition(this.currentMap.spawnP2.x, this.currentMap.spawnP2.y);
    this.p1.isDrowning = false;
    this.p2.isDrowning = false;
    this.p1.drowningProgress = 0;
    this.p2.drowningProgress = 0;
    this.p1.damageAnimTimer = 0;
    this.p2.damageAnimTimer = 0;

    this.zoneHoldTimer = 0;
    this._vanTransitionTriggered = false;
    this.input.clearAll();
    this.isGameOver = false;
    this.isVictorySequence = false;
    this.victoryConfetti = [];
    if (this.ui) {
      this.ui.hideVictoryModal();
      this.ui.hideGameOver();
    }

    // Gerencia o sistema de água subindo exclusivamente na primeira fase (MAP_1)
    const hasWater = (stageMeta.stateId === 'MAP_1' && !stageMeta.isSafeRoom);
    if (hasWater) {
      if (this.waterSystem) this.waterSystem.activate();
    } else {
      if (this.waterSystem) this.waterSystem.deactivate();
    }

    // Regras da Safe Room (Estado da Van) - Sprint 16
    // Na Van: escala retorna ao tamanho original (100% / scale = 1.0).
    // Nos mapas abertos de expedição: escala reduz (75% / scale = 0.75).
    const isSafeRoom = Boolean(stageMeta.isSafeRoom || (stageMeta.stateId && stageMeta.stateId.startsWith('VAN')));
    const targetScale = isSafeRoom ? 1.0 : 0.75;
    for (const player of this.players) {
      player.scale = targetScale;
      player.inSafeRoom = isSafeRoom;
      player.width = player.size;
      player.height = player.size;
    }

    // Configura os papéis no modo Singleplayer (P1/P2 ativo vs companheira IA)
    if (this.gameMode === 'singleplayer') {
      const activePlayer = this.players[this.activePlayerIndex];
      const companion = this.players[this.activePlayerIndex === 0 ? 1 : 0];
      activePlayer.isCompanion = false;
      companion.isCompanion = true;
      companion._isFollowing = false;
      companion._stuckTimer = 0;
      companion._lastPos = { x: companion.x, y: companion.y };
    } else {
      this.p1.isCompanion = false;
      this.p2.isCompanion = false;
    }

    // Se for um Mapa de Expedição (não é Safe Room):
    if (!stageMeta.isSafeRoom) {
      this.stageTimeRemaining = window.GameConfig.STAGE_DURATION_SECONDS;
      this.stageElapsedTime = 0;
      this.stageTrashCollectedInRun = 0;
      this.stageEnemiesDefeated = 0;

      // Gerencia o estado da água no Mapa 1 (Drena após 5 lixos)
      if (this.currentMap && this.currentMap.id === 'map1') {
        const fixedSpawns = window.GlobalState.getFixedTrashSpawns(this.currentMap);
        const alreadyCollected = fixedSpawns.filter(t => window.GlobalState.isTrashCollected(t.id)).length;
        if (alreadyCollected >= 5) {
          this._drainMap1Water(false);
        } else {
          this._restoreMap1Water();
        }
      }

      this._spawnFixedTrashForMap(this.currentMap);
      if (this.enemyManager) this.enemyManager.spawnEnemiesForMap(this.currentMap);
    } else {
      this.trashItems = [];
      if (this.enemyManager) this.enemyManager.reset();
    }

    // Posiciona a câmera instantaneamente
    const camTarget = this._getCameraTargetPoint();
    this.camera.snapToTarget(camTarget.x, camTarget.y, this.currentMap);

    this.ui.updateHUD();

    // Se entrou na Van vindo de um Mapa: pausa o jogo e exibe Tela de Estatísticas!
    if (stageMeta.isSafeRoom && comingFromMap && this.lastCompletedStageStats) {
      this.isShowingStageStats = true;
      this.appState = 'PAUSED';
      this.input.clearAll();
      this.ui.showStageStats(this.lastCompletedStageStats);
    }
  }

  /**
   * Fecha a Tela de Estatísticas e despausa a partida para liberar movimento na Van
   */
  dismissStageStatsAndResume() {
    this.isShowingStageStats = false;
    this.appState = 'PLAYING';
    this.input.clearAll();
    this.ui.showToast('Você está na Van! Visite a Loja de Armas ou leia o Mural de Avisos.', 2400);
  }

  /**
   * Instancia os 16 itens de Lixo nas posições fixas do mapa (respeitando GlobalState de persistência)
   */
  _spawnFixedTrashForMap(map) {
    this.trashItems = [];
    if (!map || map.isSafeRoom) return;

    const fixedSpawns = window.GlobalState.getFixedTrashSpawns(map);
    const types = window.GameConfig.TRASH_TYPES;

    fixedSpawns.forEach((spawnDef, idx) => {
      if (window.GlobalState.isTrashCollected(spawnDef.id)) {
        return;
      }

      const typeInfo = types[(spawnDef.typeIndex ?? idx) % types.length];
      this.trashItems.push(
        new window.TrashItem({
          id: spawnDef.id,
          x: spawnDef.x,
          y: spawnDef.y,
          typeInfo,
          rotation: spawnDef.rotation ?? 0,
          bobPhase: idx * 0.9
        })
      );
    });
  }

  /**
   * Mecânica da Fase 1: Drena a água do canal quando 50% dos lixos (8 lixos) são coletados
   */
  _drainMap1Water(notify = true) {
    const map = window.GameMaps ? window.GameMaps.map1 : null;
    if (!map) return;
    map.isWaterDrained = true;

    // Alterna para Cena 2 (onde a colisão água foi desativada)
    if (Array.isArray(map.scenes) && map.scenes.length > 1) {
      map.currentScene = 1;
      map.layers = map.scenes[1].layers;
      if (typeof window.buildMapCollisionBounds === 'function') {
        window.buildMapCollisionBounds(map);
      }
    } else if (Array.isArray(map.baseObstacles)) {
      map.obstacles = map.baseObstacles.slice();
      if (typeof window.buildMapCollisionBounds === 'function') {
        window.buildMapCollisionBounds(map);
      }
    }

    if (notify) {
      if (this.waterSystem && this.waterSystem.audio) {
        this.waterSystem.audio.playSurgeSound();
      }
      if (this.camera) {
        this.camera.triggerShake(0.8, 5);
      }
      const activePlayer = this.getHudFocusPlayer();
      this.floatingTexts.push(
        new window.FloatingText(
          activePlayer.x,
          activePlayer.y - 45,
          '🌊 O NÍVEL DA ÁGUA BAIXOU! CAMINHO LIVRE!',
          '#38bdf8',
          2.6
        )
      );
      if (this.ui) {
        this.ui.showToast('🌊 O nível da água baixou! O canal secou e agora você pode atravessar.');
      }
      console.log('🌊 [FASE 1] 5 lixos coletados! Água drenada e fundo trocado para versão seca.');
    }
  }

  /**
   * Restaura os obstáculos de água do Mapa 1 caso seja reiniciado (Cena 1 - Com Água)
   */
  _restoreMap1Water() {
    const map = window.GameMaps ? window.GameMaps.map1 : null;
    if (!map) return;
    map.isWaterDrained = false;
    if (Array.isArray(map.scenes) && map.scenes.length > 0) {
      map.currentScene = 0;
      map.layers = map.scenes[0].layers;
      if (typeof window.buildMapCollisionBounds === 'function') {
        window.buildMapCollisionBounds(map);
      }
    } else if (Array.isArray(map.baseObstacles) && Array.isArray(map.waterObstacles)) {
      map.obstacles = map.baseObstacles.concat(map.waterObstacles);
      if (typeof window.buildMapCollisionBounds === 'function') {
        window.buildMapCollisionBounds(map);
      }
    }
  }

  /**
   * Conclusão de uma fase nos Mapas (chamado ao atingir a Zona de Extração):
   * Salva estatísticas, define lastCompletedStageIndex e viaja para a Van!
   */
  completeCurrentMapAndEnterVan() {
    const stageMeta = this.getCurrentStageMeta();
    if (stageMeta.isSafeRoom) return;

    // Se for a Fase 3 com o chefe vivo e não for chamada pós-vitória, bloqueia a extração prematura
    if (stageMeta.stateId === 'MAP_3' && this.enemyManager && this.enemyManager.boss && !this.enemyManager.boss.isDefeated && !this.isVictorySequence) {
      if (this.ui) this.ui.showToast('⚠️ A Extração está bloqueada! Derrote o Rei Rato Radioativo em todos os 3 estágios!', 2500);
      this.zoneHoldTimer = 0;
      return;
    }

    const timeSpent = Math.max(1, Math.round(this.stageElapsedTime));
    const rank = window.computePerformanceRank(timeSpent);
    const trashTotal = (this.currentMap && this.currentMap.trashSpawns) ? this.currentMap.trashSpawns.length : 16;
    const isMap1 = (stageMeta.stateId === 'MAP_1');

    this.lastCompletedStageIndex = this.stageFlowIndex;
    this.lastCompletedStageStats = {
      stageName: this.currentMap.name,
      trashCollected: this.stageTrashCollectedInRun,
      trashTotal,
      enemiesDefeated: this.stageEnemiesDefeated,
      timeSpent,
      rank,
      isMap1
    };

    // Avança para o próximo estado que é a Safe Room da Van correspondente com transição suave
    const nextFlowIndex = (this.stageFlowIndex + 1) % window.GameConfig.STAGE_FLOW.length;
    this.triggerStageTeleport(nextFlowIndex, 'Missão concluída! Entrando na Van de Apoio...', true);
  }

  /**
   * Sequência de Vitória da Fase 3 (Derrota definitiva do Rei Rato Radioativo após os 3 estágios)
   * Exibe em destaque na tela a mensagem: "Obrigado por jogar!"
   */
  handleBossDefeated() {
    if (this.isVictorySequence) return;
    this.isVictorySequence = true;

    // 1. Interrompe ataques do chefe e limpa lacaios/projéteis restantes
    if (this.enemyManager) {
      this.enemyManager.clearAllMinionsAndProjectiles();
    }

    // 2. Torna os operadores invulneráveis para não receberem dano durante a celebração
    this.p1.invulnerableTimer = 9999;
    this.p2.invulnerableTimer = 9999;

    // 3. Efeito de tremor e impacto vitorioso na câmera
    if (this.camera) {
      this.camera.triggerShake(0.55, 12);
    }

    // 4. Dispara partículas festivas (confetes no Canvas)
    this._spawnVictoryConfetti();

    // 5. Exibe a tela de vitória destacando "Obrigado por jogar!"
    const timeSpent = Math.max(1, Math.round(this.stageElapsedTime));
    if (this.ui) {
      this.ui.showVictoryModal({
        timeSpent,
        trashCollected: this.stageTrashCollectedInRun
      });
    }

    console.log('🏆 [VITÓRIA FASE 3] Chefão final derrotado! Mensagem "Obrigado por jogar!" exibida com sucesso.');
  }

  /**
   * Avança para a última van do jogo após a mensagem de vitória
   */
  advanceToFinalVanAfterVictory() {
    this.isVictorySequence = false;
    this.p1.invulnerableTimer = 0;
    this.p2.invulnerableTimer = 0;
    this.completeCurrentMapAndEnterVan();
  }

  _spawnVictoryConfetti() {
    this.victoryConfetti = [];
    const colors = ['#facc15', '#4ade80', '#38bdf8', '#f472b6', '#a855f7', '#fb923c'];
    for (let i = 0; i < 65; i++) {
      this.victoryConfetti.push({
        x: Math.random() * this.canvas.width,
        y: -10 - Math.random() * 50,
        vx: (Math.random() - 0.5) * 110,
        vy: 130 + Math.random() * 180,
        size: 7 + Math.random() * 9,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 6
      });
    }
  }

  _renderVictoryConfetti(ctx) {
    if (!this.victoryConfetti || this.victoryConfetti.length === 0) return;
    ctx.save();
    for (const c of this.victoryConfetti) {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rotation);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.6);
      ctx.restore();

      c.y += c.vy * 0.016;
      c.x += c.vx * 0.016;
      c.rotation += c.rotationSpeed * 0.016;
      if (c.y > this.canvas.height + 20) {
        c.y = -10;
        c.x = Math.random() * this.canvas.width;
      }
    }
    ctx.restore();
  }

  /**
   * Lógica de Escolha na Van:
   * Opção 1: Avançar para a próxima fase
   */
  confirmVanAdvanceToNext() {
    const stageMeta = this.getCurrentStageMeta();
    const nextMapIndex = stageMeta.nextMapIndex ?? (this.stageFlowIndex + 1);
    const targetMeta = window.GameConfig.STAGE_FLOW[nextMapIndex];
    const targetMap = targetMeta ? window.GameMaps[targetMeta.mapKey] : null;
    const destName = targetMap ? targetMap.name : 'Próxima Fase';
    this.triggerStageTeleport(nextMapIndex, `Expedição partindo para ${destName}!`, false);
  }

  /**
   * Lógica de Escolha na Van:
   * Opção 2: Voltar para a fase anterior (Replay/Farm) com transição suave
   */
  confirmVanReplayPrevious() {
    const replayIndex = this.lastCompletedStageIndex || 1;
    const targetMeta = window.GameConfig.STAGE_FLOW[replayIndex];
    const targetMap = targetMeta ? window.GameMaps[targetMeta.mapKey] : null;
    const destName = targetMap ? targetMap.name : 'Fase Anterior';
    this.triggerStageTeleport(replayIndex, `Retornando para Replay/Farm em ${destName}!`, false);
  }

  /**
   * Porta da Direita da Van: Avança direto para a próxima fase ("na de ir vai direto")
   */
  advanceFromVanDirectly() {
    const stageMeta = this.getCurrentStageMeta();
    if (stageMeta.vanType === 'start' || this.stageFlowIndex === 0) {
      this.triggerStageTeleport(1, 'Partindo da Van Inicial para o Mapa 1!', false);
    } else {
      this.confirmVanAdvanceToNext();
    }
  }

  /**
   * Porta da Esquerda da Van: Exibe confirmação para reiniciar a fase anterior ("tem certeza que deseja reiniciar?")
   */
  promptVanRestartConfirmation() {
    const stageMeta = this.getCurrentStageMeta();
    if (stageMeta.vanType === 'start' || this.stageFlowIndex === 0) {
      if (this.ui) {
        this.ui.showToast('Você está na Van inicial da expedição! Avance pela porta da direita.', 2500);
      }
      return;
    }

    const replayIndex = this.lastCompletedStageIndex || 1;
    const targetMeta = window.GameConfig.STAGE_FLOW[replayIndex];
    const targetMap = targetMeta ? window.GameMaps[targetMeta.mapKey] : null;
    const destName = targetMap ? targetMap.name : 'Fase Anterior';

    if (this.ui) {
      this.ui.showVanRestartModal(`Você retornará para ${destName} para explorar novamente ou coletar mais recursos.`);
    }
  }

  /**
   * Fecha o modal de reinício e afasta suavemente o operador da porta esquerda
   */
  dismissVanRestartAndStepBack() {
    this._vanRestartTriggered = false;
    for (const p of this.players) {
      if (p.x < 160) {
        p.x = 165;
        p.vx = 0;
      }
    }
  }

  /**
   * Verifica se qualquer operador está na área da porta traseira (esquerda) da Van
   */
  isAnyPlayerInRestartZone() {
    const zone = this.currentMap ? (this.currentMap.restartZone || (this.currentMap.triggerZones && this.currentMap.triggerZones.find(t => t.id === 'trigger_sglp'))) : null;
    if (!zone) return false;
    if (this.gameMode === 'singleplayer') {
      const active = this.players[this.activePlayerIndex];
      return active ? active.isTouchingZone(zone) : false;
    }
    return this.p1.isTouchingZone(zone) || this.p2.isTouchingZone(zone);
  }

  /**
   * Inicia uma transição suave entre fases com fade out, troca de cenário no pico e fade in
   */
  triggerStageTeleport(targetFlowIndex, message = '', comingFromMap = false) {
    if (this.screenTransition && this.screenTransition.active) return;

    this.screenTransition = {
      active: true,
      phase: 'fade_out',
      timer: 0,
      fadeDuration: 0.28,
      holdDuration: 0.08,
      progress: 0,
      targetFlowIndex,
      comingFromMap,
      message
    };

    for (const player of this.players) {
      player.vx = 0;
      player.vy = 0;
    }

    // Efeito sonoro suave na transição de telas
    if (this.waterSystem && this.waterSystem.audio && typeof this.waterSystem.audio.playSurgeSound === 'function') {
      this.waterSystem.audio.playSurgeSound();
    }
  }

  /**
   * Atualiza a animação de fade e transição entre fases
   */
  _updateScreenTransition(dt) {
    if (!this.screenTransition || !this.screenTransition.active) return;

    const trans = this.screenTransition;
    trans.timer += dt;

    if (trans.phase === 'fade_out') {
      trans.progress = Math.min(1, trans.timer / trans.fadeDuration);
      if (trans.timer >= trans.fadeDuration) {
        trans.phase = 'hold';
        trans.timer = 0;
        trans.progress = 1;
        // Ponto de troca invisível sob a cortina suave
        this.loadStageByFlowIndex(trans.targetFlowIndex, trans.comingFromMap);
        if (trans.message && (!trans.comingFromMap || !this.lastCompletedStageStats)) {
          this.ui.showToast(trans.message, 2400);
        }
      }
    } else if (trans.phase === 'hold') {
      trans.progress = 1;
      if (trans.timer >= trans.holdDuration) {
        const leftover = trans.timer - trans.holdDuration;
        trans.phase = 'fade_in';
        trans.timer = leftover;
      }
    }
    if (trans.phase === 'fade_in') {
      trans.progress = Math.max(0, 1 - (trans.timer / trans.fadeDuration));
      if (trans.timer >= trans.fadeDuration) {
        trans.active = false;
        trans.progress = 0;
        trans.phase = 'none';
      }
    }
  }

  /**
   * Reinicia a fase atual
   */
  restartCurrentStage() {
    this.isGameOver = false;
    this.isVictorySequence = false;
    this.victoryConfetti = [];
    this.appState = 'PLAYING';
    if (this.waterSystem) this.waterSystem.reset();
    if (this.ui) {
      this.ui.hideGameOver();
      this.ui.hideVictoryModal();
    }
    this.p1.hp = this.p1.maxHp;
    this.p2.hp = this.p2.maxHp;
    this.loadStageByFlowIndex(this.stageFlowIndex, false);
    this.togglePause(false);
    this.ui.showToast('Fase reiniciada!');
  }

  returnToMainMenu() {
    this.isGameOver = false;
    this.isVictorySequence = false;
    this.victoryConfetti = [];
    this.appState = 'MAIN_MENU';
    this.gameState = 'MENU';
    this.isEditorMode = false;
    this.afkTimer = 0;
    if (this.waterSystem) this.waterSystem.reset();
    if (this.ui) {
      this.ui.hideGameOver();
      this.ui.hideVictoryModal();
    }
    this.input.clearAll();
    this.ui.showMainMenu();
  }

  /**
   * Dispara a tela de Game Over quando a expedição falha (inundação, tempo ou vida)
   */
  handleGameOver(reason = 'WATER_FLOOD') {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.appState = 'GAMEOVER';
    this.input.clearAll();

    const timeSpent = Math.max(1, Math.round(this.stageElapsedTime));
    const stats = {
      reason,
      timeSpent,
      trashCollected: this.stageTrashCollectedInRun,
      trashTotal: (this.currentMap && this.currentMap.trashSpawns) ? this.currentMap.trashSpawns.length : 16
    };

    if (this.ui) {
      this.ui.showGameOver(stats);
    }
  }

  /**
   * Alterna a ferramenta de Editor de Mapas (F6)
   */
  handleToggleEditor() {
    if (this.editor) {
      this.editor.toggle();
    }
  }

  /**
   * Alterna a ferramenta de Editor de Menus & UI (Sprint 10 - F7)
   */
  handleToggleUIEditor() {
    if (this.uiEditor) {
      this.uiEditor.toggle();
    }
  }

  /**
   * Ataque Singleplayer via Botão Esquerdo do Mouse direcionado para a mira
   */
  handleMouseLeftAttack(clientX, clientY) {
    if (this.editor && this.editor.active) return;
    if (this.uiEditor && this.uiEditor.active) return;
    if (this.appState !== 'PLAYING') return;
    if (this.gameMode !== 'singleplayer') return;
    if (this.waterSystem && this.waterSystem.isSurging) return;

    // Zona Pacífica: Ataque estritamente desabilitado dentro da Van / Safe Room (Sprint 16 - Requisito 1)
    const stageMeta = this.getCurrentStageMeta();
    if (stageMeta && (stageMeta.isSafeRoom || (stageMeta.stateId && stageMeta.stateId.startsWith('VAN')))) return;

    const rect = this.canvas.getBoundingClientRect();
    const screenX = clientX - rect.left;
    const screenY = clientY - rect.top;

    const { offsetX, offsetY } = this.camera.getRenderOffset();
    const worldMouseX = screenX - offsetX;
    const worldMouseY = screenY - offsetY;

    const activePlayer = this.players[this.activePlayerIndex];
    const dx = worldMouseX - activePlayer.x;
    const dy = worldMouseY - activePlayer.y;
    const attackAngle = Math.atan2(dy, dx);

    this._executePlayerAttack(activePlayer, 'MouseLeft', attackAngle);
  }

  /**
   * Ataque via Teclado:
   * - Singleplayer: P1_Attack ('R') executa ataque na direção em que estiver virado
   * - Multiplayer Local: P1 ('R') e P2 ('0')
   */
  handleKeyboardAttack(playerId, sourceLabel) {
    if (this.editor && this.editor.active) return;
    if (this.uiEditor && this.uiEditor.active) return;
    if (this.appState !== 'PLAYING') return;
    if (this.waterSystem && this.waterSystem.isSurging) return;

    // Zona Pacífica: Ataque estritamente desabilitado dentro da Van / Safe Room (Sprint 16 - Requisito 1)
    const stageMeta = this.getCurrentStageMeta();
    if (stageMeta && (stageMeta.isSafeRoom || (stageMeta.stateId && stageMeta.stateId.startsWith('VAN')))) return;

    if (this.gameMode === 'singleplayer') {
      if (playerId === 1) {
        const activePlayer = this.players[this.activePlayerIndex];
        this._executePlayerAttack(activePlayer, sourceLabel, null);
      }
    } else {
      const attacker = playerId === 2 ? this.p2 : this.p1;
      this._executePlayerAttack(attacker, sourceLabel, null);
    }
  }

  handleGamepadAttack(targetSlot, sourceLabel) {
    if (this.appState !== 'PLAYING') return;

    // Zona Pacífica: Ataque estritamente desabilitado dentro da Van / Safe Room (Sprint 16 - Requisito 1)
    const stageMeta = this.getCurrentStageMeta();
    if (stageMeta && (stageMeta.isSafeRoom || (stageMeta.stateId && stageMeta.stateId.startsWith('VAN')))) return;

    const attacker =
      this.gameMode === 'singleplayer'
        ? this.players[this.activePlayerIndex]
        : targetSlot === 2
          ? this.p2
          : this.p1;

    this._executePlayerAttack(attacker, sourceLabel, null);
  }

  handleGamepadInteractOrAttack(targetSlot, sourceLabel) {
    if (this.appState !== 'PLAYING') return;

    if (this.getTouchedSafeRoomStation() || this.isAnyPlayerInTransitionZone()) {
      this.handleInteractShortcut();
    } else {
      this.handleGamepadAttack(targetSlot, sourceLabel);
    }
  }

  /**
   * Executa o Ataque Melee com a arma equipada
   */
  _executePlayerAttack(attacker, sourceLabel, customAngle = null) {
    if (!attacker) return;

    // Zona Pacífica: Proteção estrita contra ataque na Van / Safe Room
    const stageMeta = this.getCurrentStageMeta();
    if (stageMeta && (stageMeta.isSafeRoom || (stageMeta.stateId && stageMeta.stateId.startsWith('VAN')))) return;
    if (attacker.inSafeRoom) return;

    const triggered = attacker.triggerAttack(sourceLabel, this.gameMode, customAngle);
    if (!triggered) return;

    const tipX = attacker.x + attacker.facingX * 36;
    const tipY = attacker.y + attacker.facingY * 36 - 18;
    const color = attacker.id === 1 ? '#38bdf8' : '#fb923c';

    this.floatingTexts.push(
      new window.FloatingText(tipX, tipY, `⚔️ ATK P${attacker.id}`, color, 0.55)
    );

    // Ataque contra Inimigos (3 Tipos de Ratos a partir da Fase 2)
    if (this.enemyManager) {
      const hitEnemy = this.enemyManager.handlePlayerAttack(attacker);
      if (hitEnemy) {
        this.camera.triggerShake(0.12, 3);
        this.ui.updateHUD();
      }
    }

    // Verificação de Fogo Amigo (se ativo nas configurações)
    if (window.friendlyFireEnabled) {
      const partner = attacker.id === 1 ? this.p2 : this.p1;
      if (attacker.isPointInAttackCone(partner.x, partner.y, partner.size / 2)) {
        partner.takeDamage(10, attacker.x, attacker.y, this.currentMap);
        this.camera.triggerShake(0.14, 4);
        this.floatingTexts.push(
          new window.FloatingText(partner.x, partner.y - 36, '-10 HP [FOGO AMIGO]', '#ef4444', 0.9)
        );
        this.ui.updateHUD();
      }
    }
  }

  handleGamepadStatusChange(gp, connected, profile) {
    if (connected) {
      this.ui.showToast(`🕹️ Controle conectado: ${profile.label}`, 2400);
    } else {
      this.ui.showToast(`🕹️ Controle #${gp.index + 1} desconectado.`, 1800);
    }
    this.ui.updateGamepadStatusBanner();
  }

  handleSwitchPlayer() {
    if (this.appState !== 'PLAYING') return;

    if (this.gameMode !== 'multiplayer') {
      this.activePlayerIndex = this.activePlayerIndex === 0 ? 1 : 0;
      const active = this.players[this.activePlayerIndex];
      const companion = this.players[this.activePlayerIndex === 0 ? 1 : 0];

      active.isCompanion = false;
      companion.isCompanion = true;
      companion._isFollowing = false;
      companion._stuckTimer = 0;
      companion._lastPos = { x: companion.x, y: companion.y };
      companion._avoidAngle = 0;

      this.floatingTexts.push(
        new window.FloatingText(active.x, active.y - 42, `▼ CONTROLE ATIVO`, '#ffca3a')
      );

      this.ui.updateHUD();
      this.ui.showToast(`Controle alternado para ${active.name}`, 1400);
    }
  }

  handlePauseShortcut() {
    if (this.ui.isSettingsModalOpen()) {
      this.ui.closeSettingsModal();
      return;
    }

    if (this.isShowingStageStats) {
      this.ui.hideStageStats();
      this.dismissStageStatsAndResume();
      return;
    }

    // Fecha modais do Hub se abertos
    this.ui.hideShopModal();
    this.ui.hideNoticeBoardModal();
    this.ui.hideVanTransitionChoice();

    if (this.appState === 'MAIN_MENU') return;

    if (this.appState === 'PLAYING') {
      this.togglePause(true);
    } else if (this.appState === 'PAUSED') {
      this.togglePause(false);
    }
  }

  togglePause(shouldPause) {
    if (shouldPause) {
      this.appState = 'PAUSED';
      this.input.clearAll();
      this.ui.showPauseMenu(true);
    } else {
      this.appState = 'PLAYING';
      this.input.clearAll();
      this.ui.showPauseMenu(false);
    }
  }

  /**
   * Interações com Zonas da Van (Hub: Loja e Mural) e Porta de Transição
   */
  handleInteractShortcut() {
    if (this.appState !== 'PLAYING') return;

    const stageMeta = this.getCurrentStageMeta();

    // 1. Interações com as Estações da Van (Hub)
    if (stageMeta.isSafeRoom) {
      const touchedStation = this.getTouchedSafeRoomStation();
      if (touchedStation) {
        if (touchedStation.id === 'shop') {
          this.ui.showShopModal();
          return;
        } else if (touchedStation.id === 'notice_board') {
          this.ui.showNoticeBoardModal();
          return;
        }
      }

      // 2. Interação com a Porta da Direita da Van (Avançar Direto)
      if (this.isAnyPlayerInTransitionZone()) {
        this.advanceFromVanDirectly();
        return;
      }

      // 3. Interação com a Porta da Esquerda da Van (Retornar / Reiniciar)
      if (this.isAnyPlayerInRestartZone()) {
        this.promptVanRestartConfirmation();
        return;
      }
    } else {
      // Nos Mapas Normais: interação na Zona de Extração conclui a fase e entra na Van
      if (this.isAnyPlayerInTransitionZone()) {
        this.completeCurrentMapAndEnterVan();
        return;
      }

      // InteraÃ§Ã£o com Trigger Zones (Sprint 21 - Prompts permanentemente ocultados)
      if (this.currentMap && Array.isArray(this.currentMap.triggerZones)) {
        for (const trigger of this.currentMap.triggerZones) {
          if (this.players.some(p => p.isTouchingZone(trigger))) {
            const now = this.elapsedTime || 0;
            trigger._lastFired = now;
            if (typeof trigger.onTrigger === 'function') {
              trigger.onTrigger(this.players.find(p => p.isTouchingZone(trigger)), this);
            }
            return;
          }
        }
      }
    }

    const zoneName = stageMeta.isSafeRoom ? 'uma estação (Loja, Mural) ou a Porta da Van' : 'a Zona de Extração';
    this.ui.showToast(`Aproxime-se de ${zoneName} para interagir!`, 1600);
  }

  isAnyPlayerInTransitionZone() {
    const zone = this.currentMap ? this.currentMap.transitionZone : null;
    if (!zone) return false;
    if (this.gameMode === 'singleplayer') {
      const active = this.players[this.activePlayerIndex];
      return active ? active.isTouchingZone(zone) : false;
    }
    return this.p1.isTouchingZone(zone) || this.p2.isTouchingZone(zone);
  }

  _isPlayerNearStation(player, st, pad = 36) {
    if (!player || !st) return false;
    if (typeof player.isTouchingZone === 'function' && player.isTouchingZone(st)) return true;
    const px = player.x;
    const py = player.y;
    return px >= (st.x - pad) && px <= (st.x + st.w + pad) &&
           py >= (st.y - pad) && py <= (st.y + st.h + pad);
  }

  getTouchedSafeRoomStation() {
    const stations = this.currentMap ? this.currentMap.interactiveStations : null;
    if (!stations || !stations.length) return null;

    if (this.gameMode === 'singleplayer') {
      const active = this.players[this.activePlayerIndex];
      if (active) {
        for (const st of stations) {
          if (this._isPlayerNearStation(active, st, 36)) return st;
        }
      }
      return null;
    }

    for (const st of stations) {
      if (this._isPlayerNearStation(this.p1, st, 36) || this._isPlayerNearStation(this.p2, st, 36)) {
        return st;
      }
    }
    return null;
  }

  _getCameraTargetPoint() {
    if (this.gameMode === 'singleplayer') {
      const active = this.players[this.activePlayerIndex];
      return { x: active.x, y: active.y };
    }
    return {
      x: (this.p1.x + this.p2.x) / 2,
      y: (this.p1.y + this.p2.y) / 2
    };
  }

  _gameLoop(timestamp) {
    try {
      const dt = Math.min(0.05, (timestamp - this.lastTimestamp) / 1000);
      this.lastTimestamp = timestamp;
      this.elapsedTime += dt;

      // Leitura de Joysticks
      if (this.input && typeof this.input.pollGamepads === 'function') {
        this.input.pollGamepads(this.gameMode);
      }

      if (this.uiEditor && this.uiEditor.active) {
        this.uiEditor.update(dt);
      } else if (this.editor && this.editor.active) {
        this.editor.update(dt);
      } else {
        this._updateScreenTransition(dt);
        if (this.appState === 'PLAYING') {
          this._updateGameplay(dt);
        } else if (this.ui && typeof this.ui.isSettingsModalOpen === 'function' && this.ui.isSettingsModalOpen() && this.ui.activeSettingsTab === 'controls') {
          this.ui.updateGamepadStatusBanner();
        }
      }

      this._renderScene();
    } catch (err) {
      console.error('⚠️ [ERRO NO LOOP DO JOGO]', err);
    } finally {
      requestAnimationFrame((ts) => this._gameLoop(ts));
    }
  }

  _updateGameplay(dt) {
    // Se houver transição de tela ativa, suspende movimento dos operadores
    if (this.screenTransition && this.screenTransition.active) {
      for (const player of this.players) {
        player.vx = 0;
        player.vy = 0;
      }
      return;
    }

    const isWaterSurging = Boolean(this.waterSystem && this.waterSystem.isSurging);

    if (this.gameMode === 'singleplayer') {
      const moveVec = isWaterSurging ? { dx: 0, dy: 0 } : this.input.getP1Vector();
      const activePlayer = this.players[this.activePlayerIndex];
      const companion = this.players[this.activePlayerIndex === 0 ? 1 : 0];

      activePlayer.isCompanion = false;
      companion.isCompanion = true;

      activePlayer.update(dt, moveVec, this.currentMap, null);
      this._updateCompanionAI(dt, companion, activePlayer, this.currentMap);

      const camTarget = this._getCameraTargetPoint();
      this.camera.update(dt, camTarget.x, camTarget.y, this.currentMap, null);
    } else {
      this.p1.isCompanion = false;
      this.p2.isCompanion = false;
      const p1Vec = isWaterSurging ? { dx: 0, dy: 0 } : this.input.getP1Vector();
      const p2Vec = isWaterSurging ? { dx: 0, dy: 0 } : this.input.getP2Vector();
      this._updateMultiplayerWithViewportClamp(dt, p1Vec, p2Vec);
    }

    // Verificação de segurança: Não permitir que o jogador toque na água enquanto ela estiver lá
    if (this.currentMap && this.currentMap.id === 'map1' && !this.currentMap.isWaterDrained) {
      const waterItems = [];
      if (Array.isArray(this.currentMap.waterObstacles)) {
        waterItems.push(...this.currentMap.waterObstacles);
      }
      if (Array.isArray(this.currentMap.layers) && this.currentMap.layers[2]) {
        const agua = this.currentMap.layers[2].items.find(it => it.label === 'Colisão água' || it.id === 'poly_obs_mvtmuz3u_ibe');
        if (agua && !waterItems.includes(agua)) waterItems.push(agua);
      }
      for (const player of this.players) {
        for (const wObs of waterItems) {
          if (player.isTouchingZone(wObs)) {
            player.resolveMapCollisions(this.currentMap);

            if (this.waterSystem && this.waterSystem.audio) {
              this.waterSystem.audio.playBubbleSound();
            }
            if (!player.lastWaterWarningTime || (this.elapsedTime - player.lastWaterWarningTime > 2.0)) {
              player.lastWaterWarningTime = this.elapsedTime;
              this.floatingTexts.push(
                new window.FloatingText(
                  player.x,
                  player.y - 25,
                  '⚠️ Água profunda! Não toque na água!',
                  '#38bdf8',
                  1.2
                )
              );
            }
            break;
          }
        }
      }
    }

    // Inatividade (AFK apÃ³s 5 segundos) - Sprint 21 Requisito 2
    let isMovingOrAttacking = false;
    if (this.gameMode === 'singleplayer') {
      const activePlayer = this.players[this.activePlayerIndex];
      isMovingOrAttacking = Boolean(activePlayer && (activePlayer.vx !== 0 || activePlayer.vy !== 0 || activePlayer.attackTimer > 0));
    } else {
      isMovingOrAttacking = this.players.some(p => p.vx !== 0 || p.vy !== 0 || p.attackTimer > 0);
    }

    if (isMovingOrAttacking) {
      this.afkTimer = 0;
      for (const p of this.players) {
        p.isAfk = false;
        p.animState = null;
      }
    } else {
      this.afkTimer = (this.afkTimer || 0) + dt;
      if (this.afkTimer >= 5.0) {
        for (const p of this.players) {
          p.isAfk = true;
          const isBlonde = p.characterKey === 'p1' || p.id === 1;
          p.animState = isBlonde ? 'postura combate' : 'idle_m\u00E3o levantadas';
        }
      } else {
        for (const p of this.players) {
          p.isAfk = false;
          p.animState = null;
        }
      }
    }

    // VerificaÃ§Ã£o de Trigger Zones ativas no mapa - OperaÃ§Ã£o 100% invisÃ­vel (Sprint 21 - Requisito 3)
    if (this.currentMap && Array.isArray(this.currentMap.triggerZones)) {
      for (const trigger of this.currentMap.triggerZones) {
        for (const player of this.players) {
          if (player.isTouchingZone(trigger)) {
            const now = this.elapsedTime || 0;
            if (!trigger._lastFired || now - trigger._lastFired > 3.0) {
              trigger._lastFired = now;
              if (typeof trigger.onTrigger === 'function') {
                trigger.onTrigger(player, this);
              }
            }
            break;
          }
        }
      }
    }
    // 2. Coleta de Lixo
    if (!isWaterSurging) {
      this._checkTrashCollection();
    }

    // 3. Cronômetro da Fase (Apenas nos Mapas Grandes) e Mecânica de Água Subindo (Exclusiva Fase 1)
    const stageMeta = this.getCurrentStageMeta();
    const hasWater = (stageMeta.stateId === 'MAP_1' && !stageMeta.isSafeRoom);

    if (this.waterSystem) {
      this.waterSystem.update(
        dt,
        this.stageTimeRemaining,
        window.GameConfig.STAGE_DURATION_SECONDS,
        hasWater
      );
    }

    if (!stageMeta.isSafeRoom) {
      this.stageElapsedTime += dt;

      // Se a água estiver no processo de subida total ao zerar, timer congela em 0
      if (this.waterSystem && this.waterSystem.isSurging) {
        this.stageTimeRemaining = 0;
        if (hasWater) {
          const drownProgress = Math.min(1.0, this.waterSystem.surgeTimer / this.waterSystem.surgeDuration);
          this.p1.isDrowning = true;
          this.p2.isDrowning = true;
          this.p1.drowningProgress = drownProgress;
          this.p2.drowningProgress = drownProgress;
        }
      } else {
        this.stageTimeRemaining = Math.max(0, this.stageTimeRemaining - dt);
      }

      if (this.stageTimeRemaining <= 0) {
        if (hasWater && this.waterSystem && !this.waterSystem.isSurging && !this.isGameOver) {
          this.p1.isDrowning = true;
          this.p2.isDrowning = true;
          this.p1.drowningProgress = 0;
          this.p2.drowningProgress = 0;
          this.waterSystem.triggerSurge(() => {
            this.handleGameOver('WATER_FLOOD');
          });
        } else if (!hasWater && !this.isGameOver) {
          this.handleGameOver('TIME_UP');
          return;
        }
      }

      // Auto-extração ao permanecer na zona de extração nos Mapas
      const isBossAliveInMap3 = (stageMeta.stateId === 'MAP_3' && this.enemyManager && this.enemyManager.boss && !this.enemyManager.boss.isDefeated);
      if (!isWaterSurging && this.isAnyPlayerInTransitionZone()) {
        if (isBossAliveInMap3) {
          this.zoneHoldTimer = 0;
        } else {
          this.zoneHoldTimer += dt;
          if (this.zoneHoldTimer >= this.zoneHoldDuration) {
            this.completeCurrentMapAndEnterVan();
            return;
          }
        }
      } else {
        this.zoneHoldTimer = Math.max(0, this.zoneHoldTimer - dt * 2);
      }

      // 3.5. Atualização de Inimigos e Projéteis (a partir da Fase 2)
      if (this.enemyManager) {
        this.enemyManager.update(dt, this.players, this.currentMap);

        // Verificação de derrota dos operadores por perda de vida (HP)
        if (!this.isGameOver) {
          if (this.gameMode === 'singleplayer') {
            const activePlayer = this.players[this.activePlayerIndex];
            if (activePlayer.hp <= 0) {
              this.handleGameOver('DEFEATED');
              return;
            }
          } else {
            if (this.p1.hp <= 0 && this.p2.hp <= 0) {
              this.handleGameOver('DEFEATED');
              return;
            }
          }
        }
      }
    } else {
      // Safe Room (A Van): Auto-detecção ao tocar nas Portas da Van
      // Porta da Direita: Avança direto para a próxima fase ("na de ir vai direto")
      const inAdvanceDoor = this.isAnyPlayerInTransitionZone();
      if (inAdvanceDoor) {
        if (!this._vanTransitionTriggered && (!this.screenTransition || !this.screenTransition.active)) {
          this._vanTransitionTriggered = true;
          this.advanceFromVanDirectly();
          return;
        }
      } else {
        this._vanTransitionTriggered = false;
      }

      // Porta da Esquerda: Confirmação de reinício ("na porta de voltar aparece 'tem certeza que deseja reiniciar?'")
      const inRestartDoor = this.isAnyPlayerInRestartZone();
      if (inRestartDoor) {
        if (!this._vanRestartTriggered && (!this.screenTransition || !this.screenTransition.active)) {
          this._vanRestartTriggered = true;
          this.promptVanRestartConfirmation();
          return;
        }
      } else {
        this._vanRestartTriggered = false;
      }
    }

    // 4. Atualiza Textos Flutuantes
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      this.floatingTexts[i].update(dt);
      if (this.floatingTexts[i].life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }

    // 5. Atualiza a HUD (Exclusivamente Vida e Tempo)
    this.ui.updateHUD();
  }

  /**
   * Atualização de IA da Personagem Secundária no Modo Singleplayer:
   * Segue o personagem principal mantendo distância natural, sem sobreposição,
   * contorna obstáculos e possui recuperação segura se ficar presa ou distante.
   */
  _updateCompanionAI(dt, companion, activePlayer, map) {
    if (!companion || !activePlayer || !map) return;

    const dx = activePlayer.x - companion.x;
    const dy = activePlayer.y - companion.y;
    const dist = Math.hypot(dx, dy);

    if (companion._isFollowing === undefined) companion._isFollowing = false;
    if (companion._stuckTimer === undefined) companion._stuckTimer = 0;
    if (companion._lastPos === undefined) companion._lastPos = { x: companion.x, y: companion.y };
    if (companion._avoidAngle === undefined) companion._avoidAngle = 0;

    const STOP_DIST = 52;
    const START_DIST = 75;
    const TELEPORT_DIST = 480;

    // Recuperação segura se a companheira ficar presa ou muito distante
    if (dist > TELEPORT_DIST || (companion._stuckTimer > 2.2 && dist > 110)) {
      this._teleportCompanionNearPlayer(companion, activePlayer, map);
      companion._stuckTimer = 0;
      companion._avoidAngle = 0;
      companion._isFollowing = false;
      companion._lastPos = { x: companion.x, y: companion.y };
      return;
    }

    // Histerese de parada para evitar trepidações
    if (companion._isFollowing) {
      if (dist <= STOP_DIST) {
        companion._isFollowing = false;
      }
    } else {
      if (dist >= START_DIST) {
        companion._isFollowing = true;
      }
    }

    if (!companion._isFollowing) {
      companion.update(dt, { dx: 0, dy: 0 }, map, null);
      if (dist > 15) {
        companion.facingX = dx / dist;
        companion.facingY = dy / dist;
        if (Math.abs(companion.facingX) > 0.35 && companion.facingY > 0.35) {
          companion.facingDirection = companion.facingX > 0 ? 'down-right' : 'down-left';
        } else if (Math.abs(companion.facingY) >= Math.abs(companion.facingX)) {
          companion.facingDirection = companion.facingY > 0 ? 'down' : 'up';
        } else {
          companion.facingDirection = companion.facingX > 0 ? 'right' : 'left';
        }
      }
      companion._stuckTimer = 0;
      companion._avoidAngle = 0;
      companion._lastPos = { x: companion.x, y: companion.y };
      return;
    }

    let currentSpeed = activePlayer.speed;
    if (dist > 280) {
      currentSpeed = activePlayer.speed * 1.35;
    } else if (dist > 150) {
      currentSpeed = activePlayer.speed * 1.15;
    }
    companion.speed = currentSpeed;

    let moveAngle = Math.atan2(dy, dx);

    const moved = Math.hypot(companion.x - companion._lastPos.x, companion.y - companion._lastPos.y);
    const expectedMove = (companion.speed * dt) * 0.25;

    if (moved < expectedMove && dist > STOP_DIST) {
      companion._stuckTimer += dt;
    } else {
      companion._stuckTimer = Math.max(0, companion._stuckTimer - dt * 1.5);
    }
    companion._lastPos = { x: companion.x, y: companion.y };

    if (companion._stuckTimer > 0.2) {
      if (companion._avoidAngle === 0) {
        companion._avoidAngle = (Math.sin(companion.x * 0.1 + companion.y * 0.1) >= 0 ? 1 : -1) * (Math.PI * 0.42);
      }
      moveAngle += companion._avoidAngle;
    } else {
      companion._avoidAngle = 0;
    }

    const moveVec = {
      dx: Math.cos(moveAngle),
      dy: Math.sin(moveAngle)
    };

    companion.update(dt, moveVec, map, null);
  }

  _teleportCompanionNearPlayer(companion, activePlayer, map) {
    const half = companion.size / 2;
    const offsets = [
      { x: -activePlayer.facingX * 55, y: -activePlayer.facingY * 55 },
      { x: -activePlayer.facingY * 55, y: activePlayer.facingX * 55 },
      { x: activePlayer.facingY * 55, y: -activePlayer.facingX * 55 },
      { x: 0, y: 0 }
    ];

    let chosenPos = { x: activePlayer.x, y: activePlayer.y };

    for (const off of offsets) {
      const px = Math.max(half, Math.min(map.width - half, activePlayer.x + off.x));
      const py = Math.max(half, Math.min(map.height - half, activePlayer.y + off.y));
      const testBox = companion.getBoundingBox(px, py);

      let collided = false;
      for (const obs of map.obstacles) {
        if (companion._aabbOverlap(testBox, obs)) {
          collided = true;
          break;
        }
      }

      if (!collided) {
        chosenPos = { x: px, y: py };
        break;
      }
    }

    companion.setPosition(chosenPos.x, chosenPos.y);
    companion.vx = 0;
    companion.vy = 0;
  }

  _updateMultiplayerWithViewportClamp(dt, p1Vec, p2Vec) {
    const map = this.currentMap;
    const pad = this.p1.size / 2 + 4;

    const maxSpanX = Math.max(80, Math.min(map.width, this.camera.viewportWidth) - pad * 2);
    const maxSpanY = Math.max(80, Math.min(map.height, this.camera.viewportHeight) - pad * 2);

    const p1InwardX = (this.p1.x < this.p2.x && p1Vec.dx > 0) || (this.p1.x > this.p2.x && p1Vec.dx < 0);
    const p2InwardX = (this.p2.x < this.p1.x && p2Vec.dx > 0) || (this.p2.x > this.p1.x && p2Vec.dx < 0);

    const buildClampFor = (otherPlayer) => {
      const viewBounds = this.camera.getViewportBounds(map);
      return {
        minX: Math.max(
          otherPlayer.x - maxSpanX,
          map.width > this.camera.viewportWidth ? viewBounds.minX + pad - 12 : pad
        ),
        maxX: Math.min(
          otherPlayer.x + maxSpanX,
          map.width > this.camera.viewportWidth ? viewBounds.maxX - pad + 12 : map.width - pad
        ),
        minY: Math.max(
          otherPlayer.y - maxSpanY,
          map.height > this.camera.viewportHeight ? viewBounds.minY + pad - 12 : pad
        ),
        maxY: Math.min(
          otherPlayer.y + maxSpanY,
          map.height > this.camera.viewportHeight ? viewBounds.maxY - pad + 12 : map.height - pad
        )
      };
    };

    if (p2InwardX && !p1InwardX) {
      this.p2.update(dt, p2Vec, map, buildClampFor(this.p1));
      this.p1.update(dt, p1Vec, map, buildClampFor(this.p2));
    } else {
      this.p1.update(dt, p1Vec, map, buildClampFor(this.p2));
      this.p2.update(dt, p2Vec, map, buildClampFor(this.p1));
    }

    const camTarget = this._getCameraTargetPoint();
    this.camera.update(dt, camTarget.x, camTarget.y, map, this.players);

    const finalBounds = this.camera.getViewportBounds(map);
    for (const player of this.players) {
      if (player.x < finalBounds.minX + pad) {
        player.x = finalBounds.minX + pad;
        player.clampedByViewport = true;
      } else if (player.x > finalBounds.maxX - pad) {
        player.x = finalBounds.maxX - pad;
        player.clampedByViewport = true;
      }

      if (player.y < finalBounds.minY + pad) {
        player.y = finalBounds.minY + pad;
        player.clampedByViewport = true;
      } else if (player.y > finalBounds.maxY - pad) {
        player.y = finalBounds.maxY - pad;
        player.clampedByViewport = true;
      }

      player.resolveMapCollisions(map, finalBounds);
    }
  }

  _checkTrashCollection() {
    if (!this.trashItems || this.trashItems.length === 0) return;

    for (let i = this.trashItems.length - 1; i >= 0; i--) {
      const trash = this.trashItems[i];
      const trashBox = trash.getBoundingBox();

      const collectedByP1 = this.p1.isTouchingZone(trashBox);
      const collectedByP2 = !collectedByP1 && this.p2.isTouchingZone(trashBox);

      if (collectedByP1 || collectedByP2) {
        const collector = collectedByP1 ? this.p1 : this.p2;
        if (collector && typeof collector.triggerPickup === 'function') {
          collector.triggerPickup();
        }

        this.trashItems.splice(i, 1);
        this.stageTrashCollectedInRun++;
        window.GlobalState.markTrashCollected(trash.id);

        // Verificação de Drenagem da Água da Fase 1 (ao atingir 5 lixos coletados)
        if (this.currentMap && this.currentMap.id === 'map1' && !this.currentMap.isWaterDrained) {
          const fixedSpawns = window.GlobalState.getFixedTrashSpawns(this.currentMap);
          const collectedTotal = fixedSpawns.filter(t => window.GlobalState.isTrashCollected(t.id)).length;
          if (collectedTotal >= 5) {
            this._drainMap1Water(true);
          }
        }

        this.floatingTexts.push(
          new window.FloatingText(
            trash.x,
            trash.y - 18,
            `+1 ${trash.typeInfo.name}`,
            '#bef264',
            1.15
          )
        );
      }
    }
  }

  /**
   * Loop principal de renderização draw() (Sprint 17: Z-Sorting e Overhead)
   */
  draw() {
    return this._renderScene();
  }

  _renderScene() {
    const ctx = this.ctx;
    const map = this.currentMap;
    const { width: viewW, height: viewH } = this.canvas;

    ctx.fillStyle = '#090d14';
    ctx.fillRect(0, 0, viewW, viewH);

    if (!map) return;

    // Inicializa estrutura de camadas do mapa se ainda não existir
    if (this.editor && typeof this.editor.ensureMapLayers === 'function') {
      this.editor.ensureMapLayers(map);
    }

    ctx.save();
    if (this.editor && this.editor.active) {
      ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      ctx.scale(this.editor.zoom, this.editor.zoom);
      ctx.translate(-this.editor.camFocusX, -this.editor.camFocusY);
    } else {
      const { offsetX, offsetY } = this.camera.getRenderOffset();
      ctx.translate(offsetX, offsetY);
    }

    // =========================================================================
    // 1. BACKGROUND: Desenhe o chão e tapetes
    // =========================================================================
    let mapImg = null;
    if (map.id === 'map1' && map.isWaterDrained && this.mapImages.has('map1_dry')) {
      mapImg = this.mapImages.get('map1_dry');
    } else if (map.imageAsset && this.mapImages.has(map.id)) {
      mapImg = this.mapImages.get(map.id);
    }

    if (mapImg && mapImg.complete && mapImg.naturalWidth > 0) {
      ctx.drawImage(mapImg, 0, 0, map.width, map.height);
    } else {
      ctx.fillStyle = (map.palette && map.palette.bg) || '#14171f';
      ctx.fillRect(0, 0, map.width, map.height);
    }

    // Camada 0: Chão (Ground / Ladrilhos / Terreno)
    if (map.layers && map.layers[0] && map.layers[0].visible) {
      for (const item of map.layers[0].items) {
        if (item.type === 'sprite' || item.src) {
          this._drawRotatedSpriteItem(ctx, item);
        }
      }
    }

    // Camada 1: Tapetes, Decalques e Trilhas
    if (!map.imageAsset) {
      this._drawFloorZones(ctx, map);
    }

    if (map.layers && map.layers[1] && map.layers[1].visible) {
      for (const item of map.layers[1].items) {
        if (item.type === 'sprite' || item.src) {
          this._drawRotatedSpriteItem(ctx, item);
        }
      }
    }

    // Zonas de Estações da Van (Hub) e Extração (renderizadas no nível do solo)
    this._drawSafeRoomStationsZones(ctx, map);
    this._drawTransitionZone(ctx, map);

    // =========================================================================
    // 2. MIDGROUND (Y-SORT): Desenhe as paredes, móveis normais, o jogador e os inimigos.
    // (Esses devem ser ordenados entre si com base na posição Y inferior para o efeito 2.5D padrão)
    // =========================================================================
    const midgroundQueue = [];

    // 2.1 Paredes e Móveis Normais do Cenário (Camada 2 - ignorando estritamente Overhead)
    if (map.layers && map.layers[2] && map.layers[2].visible) {
      for (const item of map.layers[2].items) {
        // Elementos marcados com "isOverhead: true" ou "overhead" renderizam apenas no Foreground
        if (item.isOverhead === true || item.collisionType === 'overhead') continue;

        if (item.type === 'sprite' || item.src) {
          const bottomY = (item.y || 0) + (item.h || 0);
          midgroundQueue.push({
            bottomY,
            draw: () => this._drawRotatedSpriteItem(ctx, item)
          });
        }
      }
    }

    // Se o mapa não possuir layers estruturadas mas possuir visualSprites planos:
    if (!map.layers && Array.isArray(map.visualSprites)) {
      for (const item of map.visualSprites) {
        if (item.isOverhead === true || item.collisionType === 'overhead' || item.layer === 3) continue;
        if (item.type === 'sprite' || item.src) {
          const bottomY = (item.y || 0) + (item.h || 0);
          midgroundQueue.push({
            bottomY,
            draw: () => this._drawRotatedSpriteItem(ctx, item)
          });
        }
      }
    }

    // Obstáculos conceituais desenhados apenas em mapas sem imagem de fundo
    if (!map.imageAsset) {
      const obsList = map.collisionBounds || map.obstacles || [];
      for (const obs of obsList) {
        if (obs.isTrigger || obs.isOverhead || obs.collisionType === 'trigger' || obs.collisionType === 'overhead' || obs.layer === 3) {
          continue;
        }
        const bottomY = (obs.y || 0) + (obs.h || 0);
        midgroundQueue.push({
          bottomY,
          draw: () => this._drawSingleObstacle(ctx, obs, map)
        });
      }
    }

    // 2.2 Entidades de Lixo / Sucata (Midground)
    for (const trash of this.trashItems) {
      const bottomY = (trash.y || 0) + ((trash.size || 46) * 0.35);
      midgroundQueue.push({
        bottomY,
        draw: () => trash.draw(ctx, this.elapsedTime)
      });
    }

    // 2.3 Jogador (Personagens P1 e P2)
    for (const player of this.players) {
      const bottomY = (player.y || 0) + ((player.height || player.size || 48) / 2);
      const isControlled =
        this.gameMode === 'multiplayer' ||
        (this.players[this.activePlayerIndex] && this.players[this.activePlayerIndex].id === player.id);
      midgroundQueue.push({
        bottomY,
        draw: () => player.draw(ctx, isControlled, this.gameMode, this.elapsedTime)
      });
    }

    // 2.4 Inimigos (Baseados na posição Y inferior dos pés)
    if (this.enemyManager && Array.isArray(this.enemyManager.enemies)) {
      for (const enemy of this.enemyManager.enemies) {
        if (enemy.isDead && enemy.deathTimer >= enemy.deathDuration) continue;
        const bottomY = (enemy.y || 0) + (enemy.radius || ((enemy.size || 40) / 2) || 20);
        midgroundQueue.push({
          bottomY,
          draw: () => enemy.draw(ctx, this.elapsedTime)
        });
      }
    }

    // Executa a ordenação Z-Sorting (Painters Algorithm) por bottomY
    midgroundQueue.sort((a, b) => a.bottomY - b.bottomY);
    for (const item of midgroundQueue) {
      item.draw();
    }

    // Partículas e Projéteis dos Inimigos (Renderizados no plano de combate das entidades)
    if (this.enemyManager) {
      if (typeof this.enemyManager.drawProjectiles === 'function') {
        this.enemyManager.drawProjectiles(ctx);
      } else if (Array.isArray(this.enemyManager.projectiles)) {
        for (const p of this.enemyManager.projectiles) {
          p.draw(ctx);
        }
      }
    }

    // =========================================================================
    // 3. FOREGROUND (OVERHEAD): Após desenhar absolutamente todas as entidades,
    // faça um novo loop nos objetos do mapa e desenhe exclusivamente aqueles que
    // possuem isOverhead === true (ou pertencerem à camada destinada ao "teto").
    // Esta ordem garante que canos, batentes de porta altos e copas de árvores cubram
    // perfeitamente o sprite do jogador quando ele passar por baixo.
    // =========================================================================
    const drawnOverheadKeys = new Set();

    if (map.layers && Array.isArray(map.layers)) {
      for (let l = 0; l < map.layers.length; l++) {
        const layer = map.layers[l];
        if (!layer || layer.visible === false || !Array.isArray(layer.items)) continue;
        const isCeilingLayer =
          l === 3 ||
          layer.id === 3 ||
          layer.name === 'Teto/Overlay' ||
          (layer.name && /teto|overhead/i.test(layer.name));

        for (const item of layer.items) {
          const isItemOverhead =
            item.isOverhead === true ||
            item.collisionType === 'overhead' ||
            isCeilingLayer;

          if (isItemOverhead) {
            const key = item.id || (item.x + '_' + item.y);
            drawnOverheadKeys.add(key);
            this._drawOverheadItem(ctx, item, map);
          }
        }
      }
    } else if (Array.isArray(map.visualSprites)) {
      for (const item of map.visualSprites) {
        if (item.isOverhead === true || item.collisionType === 'overhead' || item.layer === 3) {
          const key = item.id || (item.x + '_' + item.y);
          drawnOverheadKeys.add(key);
          this._drawOverheadItem(ctx, item, map);
        }
      }
    }

    if (Array.isArray(map.overheadZones)) {
      for (const zone of map.overheadZones) {
        const key = zone.id || (zone.x + '_' + zone.y);
        if (!drawnOverheadKeys.has(key)) {
          drawnOverheadKeys.add(key);
          this._drawOverheadItem(ctx, zone, map);
        }
      }
    }


    // Passarelas e Pontes Elevadas com Parallax
    this._drawElevatedParallaxStructures(ctx, map);

    // Marcadores de Animação e Indicadores Flutuantes do Cenário (ex: Ponto de Exclamação no Mural da Van)
    this._drawMapAnimationMarkers(ctx, map);

    // Balão Flutuante e Textos
    this._drawSafeRoomStationFloatingNotice(ctx, map);
    for (const ft of this.floatingTexts) {
      ft.draw(ctx);
    }

    // Visualização e Alças do Editor de Mapas (Sprint 7)
    if (this.editor && this.editor.active) {
      this.editor.renderCanvas(ctx);
    }

    ctx.restore();

    // Filtros de tela (exclusivos de gameplay)
    if (this.waterSystem && (!this.editor || !this.editor.active) && (!this.uiEditor || !this.uiEditor.active)) {
      this.waterSystem.render(ctx, viewW, viewH);
    }

    if ((this.appState === 'PLAYING' || this.appState === 'PAUSED') && (!this.editor || !this.editor.active) && (!this.uiEditor || !this.uiEditor.active)) {
      this._drawExtractionCompass(ctx);
      this._drawTrashHUD(ctx, viewW, viewH);
    }

    // Renderização do Editor de Menus & Interface UI (Sprint 10) em Espaço de Tela
    if (this.uiEditor && this.uiEditor.active) {
      this.uiEditor.renderCanvas(ctx);
    }

    if (this.isVictorySequence) {
      this._renderVictoryConfetti(ctx);
    }

    // Transição de tela suave entre fases (Fade e pulso futurista)
    if (this.screenTransition && this.screenTransition.active) {
      this._renderScreenTransition(ctx, viewW, viewH);
    }
  }

  /**
   * Renderiza um sprite com rotação centralizada e opacidade
   * [Requisito 3]: translate(cx, cy) -> rotate(rad) -> drawImage(-w/2, -h/2)
   */
  /**
   * Renderiza Zonas "Por Cima" (Overhead) via Clipping Mask real da imagem do cenario
   * (Sprint 18 / Sprint 22): recorta a arte fiel do mapa sobre o jogador sem preenchimento solido.
   */
  _drawOverheadItem(ctx, item, map) {
    if (!item) return;

    if (item.type === 'sprite' || item.src) {
      this._drawRotatedSpriteItem(ctx, item);
      return;
    }

    if (this.isEditorMode) {
      this._drawSingleObstacle(ctx, item, map);
      return;
    }

    const mapImg = (map.id === 'map1' && map.isWaterDrained && this.mapImages.has('map1_dry'))
      ? this.mapImages.get('map1_dry')
      : this.mapImages.get(map.id);

    if (mapImg && mapImg.complete && mapImg.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      if (item.polygon && Array.isArray(item.polygon) && item.polygon.length >= 3) {
        ctx.moveTo(item.polygon[0].x, item.polygon[0].y);
        for (let i = 1; i < item.polygon.length; i++) {
          ctx.lineTo(item.polygon[i].x, item.polygon[i].y);
        }
        ctx.closePath();
      } else if (item.w && item.h) {
        ctx.rect(item.x, item.y, item.w, item.h);
      }
      ctx.clip();
      ctx.drawImage(mapImg, 0, 0, map.width || mapImg.naturalWidth, map.height || mapImg.naturalHeight);
      ctx.restore();
    }
  }

  _drawRotatedSpriteItem(ctx, item) {
    if (!item || !item.src) return;
    if (!item._img) {
      item._img = new Image();
      item._img.src = item.src;
    }
    if (!item._img.complete || item._img.naturalWidth <= 0) return;

    const cx = item.x + item.w / 2;
    const cy = item.y + item.h / 2;
    const rad = ((item.rotation || 0) * Math.PI) / 180;

    ctx.save();
    ctx.translate(cx, cy);
    if (rad !== 0) ctx.rotate(rad);
    if (item.opacity !== undefined) ctx.globalAlpha = item.opacity;
    ctx.drawImage(item._img, -item.w / 2, -item.h / 2, item.w, item.h);
    ctx.restore();
  }

  _preloadMapImages() {
    if (typeof Image === 'undefined') return;
    if (window.GameMaps) {
      for (const mapKey of Object.keys(window.GameMaps)) {
        const m = window.GameMaps[mapKey];
        if (m && m.imageAsset) {
          const img = new Image();
          img.src = m.imageAsset;
          this.mapImages.set(m.id, img);
        }
        if (m && m.imageAssetDry) {
          const imgDry = new Image();
          imgDry.src = m.imageAssetDry;
          this.mapImages.set(m.id + '_dry', imgDry);
        }
      }
    }
  }

  _drawElevatedParallaxStructures(ctx, map) {
    if (!map.elevatedStructures || map.elevatedStructures.length === 0) return;
    const mapImg = this.mapImages.get(map.id);
    if (!mapImg || !mapImg.complete || mapImg.naturalWidth <= 0) return;

    const camX = this.camera ? this.camera.x : 0;
    const camY = this.camera ? this.camera.y : 0;
    const viewCenterX = camX + this.canvas.width / 2;
    const viewCenterY = camY + this.canvas.height / 2;

    ctx.save();
    for (const struct of map.elevatedStructures) {
      const structCenterX = struct.x + struct.w / 2;
      const structCenterY = struct.y + struct.h / 2;

      const depth = struct.depth || 0.05;
      const parallaxOffsetX = (structCenterX - viewCenterX) * depth;
      const parallaxOffsetY = (structCenterY - viewCenterY) * depth;

      // Sombra suave no chão projetada pela ponte elevada
      ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
      ctx.fillRect(struct.x + 8, struct.y + 16, struct.w, struct.h);

      // Desenha a estrutura elevada recortada da imagem do cenário
      ctx.drawImage(
        mapImg,
        struct.srcX,
        struct.srcY,
        struct.srcW,
        struct.srcH,
        struct.x + parallaxOffsetX,
        struct.y + parallaxOffsetY,
        struct.w,
        struct.h
      );
    }
    ctx.restore();
  }

  _drawFloorZones(ctx, map) {
    if (!map.floorZones) return;
    ctx.save();
    for (const z of map.floorZones) {
      ctx.fillStyle = (map.palette && map.palette.pathFill) || 'rgba(56, 189, 248, 0.10)';
      ctx.strokeStyle = (map.palette && map.palette.pathStroke) || 'rgba(56, 189, 248, 0.32)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 6]);
      ctx.fillRect(z.x, z.y, z.w, z.h);
      ctx.strokeRect(z.x, z.y, z.w, z.h);
      ctx.setLineDash([]);

      if (z.label) {
        ctx.fillStyle = 'rgba(241, 245, 249, 0.7)';
        ctx.font = 'bold 11px Consolas, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(z.label, z.x + z.w / 2, z.y + z.h / 2 + 4);
      }
    }
    ctx.restore();
  }

  _drawSafeRoomStationsZones(ctx, map) {
    if (!map.interactiveStations) return;
    // Oculta a área demarcada no chão quando hideFloorZone for true ou no cenário da Van (limpeza visual do piso)
    if (map.id === 'van' || map.isSafeRoom) return;

    ctx.save();
    for (const st of map.interactiveStations) {
      if (st.hideFloorZone) continue;
      const isTouched = this.p1.isTouchingZone(st) || this.p2.isTouchingZone(st);

      ctx.fillStyle = st.fillColor;
      ctx.fillRect(st.x, st.y, st.w, st.h);

      ctx.strokeStyle = st.strokeColor;
      ctx.lineWidth = isTouched ? 3 : 2;
      ctx.setLineDash([8, 5]);
      ctx.strokeRect(st.x, st.y, st.w, st.h);
      ctx.setLineDash([]);

      const labelY = st.y + st.h - 14;
      ctx.fillStyle = st.strokeColor;
      ctx.font = 'bold 11px Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(st.zoneLabel, st.x + st.w / 2, labelY);
    }
    ctx.restore();
  }

  _drawSafeRoomStationFloatingNotice(ctx, map) {
    if (!map.interactiveStations) return;

    const floatOffset = Math.sin(this.elapsedTime * 5.5) * 4;

    ctx.save();
    for (const st of map.interactiveStations) {
      const isTouched = (this.gameMode === 'singleplayer')
        ? this._isPlayerNearStation(this.players[this.activePlayerIndex], st, 36)
        : (this._isPlayerNearStation(this.p1, st, 36) || this._isPlayerNearStation(this.p2, st, 36));
      if (!isTouched) continue;

      const rawText = st.promptText || 'Pressione [E] para Interagir';
      const displayText = st.icon ? `${st.icon}  ${rawText}` : rawText;

      ctx.font = 'bold 13px Consolas, monospace';
      const padX = 16;
      const boxW = ctx.measureText(displayText).width + padX * 2;
      const boxH = 34;
      const centerX = st.x + st.w / 2;
      const centerY = (st.y + st.h > (map.height || 857) - 180)
        ? st.y - 24 + floatOffset
        : st.y + st.h + 24 + floatOffset;

      // Glow suave com a cor de destaque da estação
      ctx.shadowColor = st.strokeColor || '#38bdf8';
      ctx.shadowBlur = 10;

      // Fundo tático escuro translúcido com borda arredondada
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.strokeStyle = st.strokeColor || '#38bdf8';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.roundRect(centerX - boxW / 2, centerY - boxH / 2, boxW, boxH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fef08a';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(displayText, centerX, centerY);
    }
    ctx.restore();
  }

  /**
   * Renderiza Marcadores de Animação e Indicadores Flutuantes do Cenário
   * (ex: Ponto de Exclamação flutuando sobre o Mural de Avisos da Van)
   */
  _drawMapAnimationMarkers(ctx, map) {
    if (!map) return;
    const markers = [];
    if (Array.isArray(map.animationMarkers)) {
      markers.push(...map.animationMarkers);
    }
    if (map.layers) {
      for (const layer of map.layers) {
        if (layer && Array.isArray(layer.items)) {
          for (const item of layer.items) {
            if ((item.type === 'animation_marker' || item.isAnimationMarker) && !markers.some((m) => m.id === item.id)) {
              markers.push(item);
            }
          }
        }
      }
    }

    if (markers.length === 0) return;

    ctx.save();
    for (const marker of markers) {
      const bobOffset = Math.sin(this.elapsedTime * 4.5) * 5;
      const pulse = 1 + Math.sin(this.elapsedTime * 6) * 0.08;
      const drawX = marker.x;
      const drawY = marker.y + bobOffset;

      ctx.save();
      ctx.translate(drawX, drawY);
      ctx.scale(pulse, pulse);

      // 1. Halo / Glow suave pulsante dourado
      const aura = ctx.createRadialGradient(0, 0, 2, 0, 0, 26);
      aura.addColorStop(0, 'rgba(250, 204, 21, 0.55)');
      aura.addColorStop(0.65, 'rgba(250, 204, 21, 0.18)');
      aura.addColorStop(1, 'rgba(250, 204, 21, 0)');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(0, 0, 26, 0, Math.PI * 2);
      ctx.fill();

      // 2. Base em Badge circular tático escuro com anel ouro reluzente
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
      ctx.fill();
      ctx.lineWidth = 2.4;
      ctx.strokeStyle = '#facc15';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 10;
      ctx.stroke();

      // 3. Ponto de Exclamação Flutuante '!' nítido e vibrante
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fde047';
      ctx.font = '900 17px "Segoe UI", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('!', 0, 0.5);

      ctx.restore();
    }
    ctx.restore();
  }

  _drawTrashItems(ctx) {
    if (!this.trashItems || this.trashItems.length === 0) return;
    for (const trash of this.trashItems) {
      trash.draw(ctx, this.elapsedTime);
    }
  }

  _drawTransitionZone(ctx, map) {
    const z = map.transitionZone;
    if (!z) return;

    const pulse = 0.5 + 0.5 * Math.sin(this.elapsedTime * 4);
    const centerX = z.x + z.w / 2;
    const centerY = z.y + z.h / 2;
    const stageMeta = this.getCurrentStageMeta();
    const isBossAliveInMap3 = (stageMeta.stateId === 'MAP_3' && this.enemyManager && this.enemyManager.boss && !this.enemyManager.boss.isDefeated);

    ctx.save();

    // =========================================================================
    // CASO 1: SAFE ROOM / VAN (Porta de saída com feixe de luz e chevrons - Sem caixas!)
    // =========================================================================
    if (map.isSafeRoom || stageMeta.isSafeRoom || z.hideBox) {
      // 1. Feixe de luz ambiente suave derramando da porta para dentro da Van
      const lightGrad = ctx.createLinearGradient(z.x + z.w, centerY, z.x - 36, centerY);
      lightGrad.addColorStop(0, `rgba(56, 189, 248, ${0.32 + pulse * 0.16})`);
      lightGrad.addColorStop(0.55, `rgba(56, 189, 248, ${0.12 + pulse * 0.08})`);
      lightGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

      ctx.fillStyle = lightGrad;
      ctx.beginPath();
      ctx.ellipse(z.x + 12, centerY, 58 + pulse * 10, z.h * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Chevrons luminosos animados indicando a passagem (› › ›)
      const chevronCycle = (this.elapsedTime * 42) % 32;
      ctx.strokeStyle = `rgba(186, 230, 253, ${0.45 + pulse * 0.35})`;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      for (let i = 0; i < 3; i++) {
        const cx = z.x + 10 + i * 22 + (chevronCycle % 22);
        if (cx > z.x + z.w - 14) continue;
        ctx.beginPath();
        ctx.moveTo(cx - 5, centerY - 11);
        ctx.lineTo(cx + 4, centerY);
        ctx.lineTo(cx - 5, centerY + 11);
        ctx.stroke();
      }

      // 3. Placa/Badge flutuante moderna e elegante sobre a porta
      const bobY = Math.sin(this.elapsedTime * 3) * 3;
      const isStartVan = (stageMeta.vanType === 'start' || this.stageFlowIndex === 0);
      const badgeW = 168;
      const badgeH = 36;
      const badgeX = centerX - badgeW / 2;
      const badgeY = z.y - 42 + bobY;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('🚪 SAÍDA DA VAN →', centerX, badgeY + 15);

      ctx.fillStyle = '#bae6fd';
      ctx.font = '10px Consolas, monospace';
      ctx.fillText(isStartVan ? 'Toque para Iniciar Fase 1' : 'Toque para Avançar Direto', centerX, badgeY + 28);

      // Porta Traseira da Esquerda (Retornar / Reiniciar)
      if (map.restartZone) {
        const rz = map.restartZone;
        const rCenterX = rz.x + rz.w / 2;
        const rCenterY = rz.y + rz.h / 2;

        // Feixe de luz âmbar derramando da porta traseira
        const lightGradLeft = ctx.createLinearGradient(rz.x, rCenterY, rz.x + rz.w + 40, rCenterY);
        lightGradLeft.addColorStop(0, `rgba(245, 158, 11, ${0.30 + pulse * 0.16})`);
        lightGradLeft.addColorStop(0.55, `rgba(245, 158, 11, ${0.10 + pulse * 0.07})`);
        lightGradLeft.addColorStop(1, 'rgba(245, 158, 11, 0)');

        ctx.fillStyle = lightGradLeft;
        ctx.beginPath();
        ctx.ellipse(rz.x + rz.w - 10, rCenterY, 52 + pulse * 8, rz.h * 0.52, 0, 0, Math.PI * 2);
        ctx.fill();

        // Chevrons animados indicando retorno (‹ ‹ ‹)
        const chevronCycleLeft = (this.elapsedTime * 42) % 32;
        ctx.strokeStyle = `rgba(254, 215, 170, ${0.45 + pulse * 0.35})`;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (let i = 0; i < 3; i++) {
          const cx = rz.x + rz.w - 10 - i * 20 - (chevronCycleLeft % 20);
          if (cx < rz.x + 8) continue;
          ctx.beginPath();
          ctx.moveTo(cx + 4, rCenterY - 10);
          ctx.lineTo(cx - 4, rCenterY);
          ctx.lineTo(cx + 4, rCenterY + 10);
          ctx.stroke();
        }

        // Badge flutuante sobre a porta esquerda
        const rBadgeW = 168;
        const rBadgeH = 36;
        const rBadgeX = rCenterX - rBadgeW / 2;
        const rBadgeY = rz.y - 42 + bobY;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(rBadgeX, rBadgeY, rBadgeW, rBadgeH, 10);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 12px Consolas, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('🚪 ← RETORNAR', rCenterX, rBadgeY + 15);

        ctx.fillStyle = '#fed7aa';
        ctx.font = '10px Consolas, monospace';
        ctx.fillText('Toque para Reiniciar', rCenterX, rBadgeY + 28);
      }
    }
    // =========================================================================
    // CASO 2: MAPAS DE EXPEDIÇÃO (Holograma circular de extração - Sem quadrados!)
    // =========================================================================
    else {
      const baseRgb = isBossAliveInMap3 ? '239, 68, 68' : '74, 222, 128';
      const baseHex = isBossAliveInMap3 ? '#ef4444' : '#4ade80';
      const radiusX = z.w * 0.46;
      const radiusY = z.h * 0.38;

      // 1. Aura radial suave no solo
      const auraGrad = ctx.createRadialGradient(centerX, centerY, 6, centerX, centerY, Math.max(radiusX, radiusY));
      auraGrad.addColorStop(0, `rgba(${baseRgb}, ${0.22 + pulse * 0.12})`);
      auraGrad.addColorStop(0.65, `rgba(${baseRgb}, ${0.08 + pulse * 0.05})`);
      auraGrad.addColorStop(1, `rgba(${baseRgb}, 0)`);

      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Onda holográfica expansiva suave
      const wavePhase = (this.elapsedTime * 0.75) % 1.0;
      const waveRx = radiusX * (0.25 + 0.75 * wavePhase);
      const waveRy = radiusY * (0.25 + 0.75 * wavePhase);
      ctx.strokeStyle = `rgba(${baseRgb}, ${(1 - wavePhase) * 0.55})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, waveRx, waveRy, 0, 0, Math.PI * 2);
      ctx.stroke();

      // 3. Anel de contenção holográfico suave no perímetro
      ctx.strokeStyle = `rgba(${baseRgb}, ${0.5 + pulse * 0.3})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
      ctx.stroke();

      // 4. Badge flutuante centralizado
      const bobY = Math.sin(this.elapsedTime * 3) * 3;
      const badgeW = isBossAliveInMap3 ? 190 : 180;
      const badgeH = 38;
      const badgeX = centerX - badgeW / 2;
      const badgeY = centerY - 32 + bobY;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = baseHex;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isBossAliveInMap3 ? '#ef4444' : '#4ade80';
      ctx.font = 'bold 12px Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(isBossAliveInMap3 ? '🔒 EXTRAÇÃO BLOQUEADA' : '🚁 ZONA DE EXTRAÇÃO', centerX, badgeY + 16);

      ctx.fillStyle = isBossAliveInMap3 ? '#fca5a5' : '#cbd5e1';
      ctx.font = '10px Consolas, monospace';
      ctx.fillText(isBossAliveInMap3 ? 'Derrote o Chefe para Liberar' : 'Aguarde na área para concluir', centerX, badgeY + 30);

      // 5. Barra de progresso pill estilizada ao aguardar na zona
      if (this.zoneHoldTimer > 0) {
        const pct = Math.min(1, this.zoneHoldTimer / this.zoneHoldDuration);
        const barW = 120;
        const barH = 7;
        const barX = centerX - barW / 2;
        const barY = badgeY + badgeH + 6;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath();
        ctx.roundRect(barX, barY, barW, barH, 4);
        ctx.fill();

        ctx.fillStyle = '#4ade80';
        ctx.beginPath();
        ctx.roundRect(barX, barY, barW * pct, barH, 4);
        ctx.fill();

        ctx.strokeStyle = '#86efac';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(barX, barY, barW, barH, 4);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  /**
   * Renderiza a transição suave de tela (Fade In / Fade Out & Vinheta Cinematográfica)
   */
  _renderScreenTransition(ctx, width, height) {
    if (!this.screenTransition || !this.screenTransition.active) return;

    const trans = this.screenTransition;
    const progress = Math.max(0, Math.min(1, trans.progress));

    ctx.save();
    // Curva de suavização cúbica (smoothstep)
    const eased = progress * progress * (3 - 2 * progress);

    // Escurecimento elegante do viewport
    ctx.fillStyle = `rgba(10, 15, 26, ${Math.min(0.96, eased * 1.02)})`;
    ctx.fillRect(0, 0, width, height);

    if (eased > 0.12) {
      const centerX = width / 2;
      const centerY = height / 2;

      // Brilho radial futurista sutil no centro
      const glowGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) * 0.42);
      glowGrad.addColorStop(0, `rgba(56, 189, 248, ${0.16 * eased})`);
      glowGrad.addColorStop(0.65, `rgba(30, 58, 138, ${0.08 * eased})`);
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // Card/Banner central de transição
      if (trans.message) {
        ctx.globalAlpha = Math.min(1, (eased - 0.12) / 0.88);

        const cardW = Math.min(440, width * 0.82);
        const cardH = 54;
        const cardX = centerX - cardW / 2;
        const cardY = centerY - cardH / 2;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, 12);
        ctx.fill();
        ctx.stroke();

        // Linha de pulso inferior
        const lineLen = cardW * 0.7 * eased;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX - lineLen / 2, cardY + cardH - 3);
        ctx.lineTo(centerX + lineLen / 2, cardY + cardH - 3);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px Consolas, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(trans.message, centerX, centerY);
      }
    }

    ctx.restore();
  }

  _drawSingleObstacle(ctx, obs, map) {
    if (!obs) return;
    if (obs.polygon && Array.isArray(obs.polygon) && obs.polygon.length >= 3) {
      ctx.fillStyle = obs.customFill || ((map.palette && map.palette.wallFill) || 'rgba(30, 41, 59, 0.94)');
      ctx.strokeStyle = obs.customStroke || ((map.palette && map.palette.wallStroke) || '#38bdf8');
      ctx.lineWidth = obs.customStroke ? 2.5 : 2;

      ctx.beginPath();
      ctx.moveTo(obs.polygon[0].x, obs.polygon[0].y);
      for (let i = 1; i < obs.polygon.length; i++) {
        ctx.lineTo(obs.polygon[i].x, obs.polygon[i].y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      if (this.isEditorMode && this.editor && this.editor.active && obs.label && obs.w >= 60 && obs.h >= 40) {
        let cx = 0, cy = 0;
        for (const p of obs.polygon) { cx += p.x; cy += p.y; }
        cx /= obs.polygon.length;
        cy /= obs.polygon.length;
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 11px Consolas, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(obs.label, cx, cy);
      }
      return;
    }

    ctx.fillStyle = obs.customFill || ((map.palette && map.palette.wallFill) || 'rgba(30, 41, 59, 0.94)');
    ctx.fillRect(obs.x, obs.y, obs.w, obs.h);

    ctx.strokeStyle = obs.customStroke || ((map.palette && map.palette.wallStroke) || '#38bdf8');
    ctx.lineWidth = obs.customStroke ? 2.5 : 2;
    ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);

    if (this.isEditorMode && this.editor && this.editor.active && obs.label && obs.w >= 120 && obs.h >= 65) {
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(obs.label || 'ESTRUTURA', obs.x + obs.w / 2, obs.y + obs.h / 2 - 4);

      if (obs.subTag) {
        ctx.fillStyle = obs.customStroke || 'rgba(226, 232, 240, 0.65)';
        ctx.font = '10px Consolas, monospace';
        ctx.fillText(obs.subTag, obs.x + obs.w / 2, obs.y + obs.h / 2 + 12);
      }
    }
  }

  _drawObstacles(ctx, map) {
    ctx.save();
    for (const obs of map.obstacles) {
      if (obs.isTrigger || obs.isOverhead || obs.collisionType === 'trigger' || obs.collisionType === 'overhead') {
        continue;
      }

      if (obs.polygon && Array.isArray(obs.polygon) && obs.polygon.length >= 3) {
        ctx.fillStyle = obs.customFill || ((map.palette && map.palette.wallFill) || 'rgba(30, 41, 59, 0.94)');
        ctx.strokeStyle = obs.customStroke || ((map.palette && map.palette.wallStroke) || '#38bdf8');
        ctx.lineWidth = obs.customStroke ? 2.5 : 2;

        ctx.beginPath();
        ctx.moveTo(obs.polygon[0].x, obs.polygon[0].y);
        for (let i = 1; i < obs.polygon.length; i++) {
          ctx.lineTo(obs.polygon[i].x, obs.polygon[i].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        let cx = 0, cy = 0;
        for (const p of obs.polygon) { cx += p.x; cy += p.y; }
        cx /= obs.polygon.length;
        cy /= obs.polygon.length;

        if (this.isEditorMode && this.editor && this.editor.active && obs.label && obs.w >= 60 && obs.h >= 40) {
          ctx.fillStyle = '#f8fafc';
          ctx.font = 'bold 11px Consolas, monospace';
          ctx.textAlign = 'center';
          ctx.fillText(obs.label, cx, cy);
        }
        continue;
      }

      ctx.fillStyle = obs.customFill || ((map.palette && map.palette.wallFill) || 'rgba(30, 41, 59, 0.94)');
      ctx.fillRect(obs.x, obs.y, obs.w, obs.h);

      ctx.strokeStyle = obs.customStroke || ((map.palette && map.palette.wallStroke) || '#38bdf8');
      ctx.lineWidth = obs.customStroke ? 2.5 : 2;
      ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);

      if (this.isEditorMode && this.editor && this.editor.active && obs.w >= 120 && obs.h >= 65) {
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 11px Consolas, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(obs.label || 'ESTRUTURA', obs.x + obs.w / 2, obs.y + obs.h / 2 - 4);

        if (obs.subTag) {
          ctx.fillStyle = obs.customStroke || 'rgba(226, 232, 240, 0.65)';
          ctx.font = '10px Consolas, monospace';
          ctx.fillText(obs.subTag, obs.x + obs.w / 2, obs.y + obs.h / 2 + 12);
        }
      }
    }
    ctx.restore();
  }

  _drawExtractionCompass(ctx) {
    const zone = this.currentMap ? this.currentMap.transitionZone : null;
    if (!zone) return;

    const focus = this._getCameraTargetPoint();
    const targetX = zone.x + zone.w / 2;
    const targetY = zone.y + zone.h / 2;

    const dx = targetX - focus.x;
    const dy = targetY - focus.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 180) return;

    const angle = Math.atan2(dy, dx);
    const compassCenterX = this.canvas.width / 2;
    const compassCenterY = 152;

    ctx.save();
    ctx.translate(compassCenterX, compassCenterY);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = zone.strokeColor || '#4ade80';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-135, -16, 270, 32, 16);
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.translate(-108, 0);
    ctx.rotate(angle);
    ctx.fillStyle = zone.strokeColor || '#4ade80';
    ctx.beginPath();
    ctx.moveTo(9, 0);
    ctx.lineTo(-6, -6);
    ctx.lineTo(-3, 0);
    ctx.lineTo(-6, 6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 11px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const labelPrefix = this.getCurrentStageMeta().isSafeRoom ? 'PORTA DA VAN' : 'ZONA DE EXTRAÇÃO';
    ctx.fillText(`${labelPrefix}: ${Math.round(dist)}px`, 12, 0);

    ctx.restore();
  }

  /**
   * Carrega um layout de interface em formato JSON e aplica no ecossistema de UI (Sprint 10)
   */
  loadUILayout(layoutData) {
    if (this.ui && typeof this.ui.loadUILayout === 'function') {
      this.ui.loadUILayout(layoutData);
    }
  }
  /**
   * HUD Oficial de Lixos (Sprint 21 - Requisito 4)
   * DeclaraÃ§Ã£o explÃ­cita de fonte e trava de seguranÃ§a contra dados indefinidos.
   */
  _drawTrashHUD(ctx, viewW, viewH) {
    if (this.appState !== 'PLAYING' && this.appState !== 'PAUSED') return;
    const stageMeta = this.getCurrentStageMeta();
    if (!stageMeta || stageMeta.isSafeRoom) return;

    const fixedSpawns = window.GlobalState ? window.GlobalState.getFixedTrashSpawns(this.currentMap) : null;
    const total = fixedSpawns ? fixedSpawns.length : (window.GameConfig.TOTAL_TRASH_PER_MAP || 16);
    const collected = fixedSpawns
      ? fixedSpawns.filter(t => window.GlobalState.isTrashCollected(t.id)).length
      : (this.stageTrashCollectedInRun || 0);

    const texto = "Lixos: " + collected + " / " + total;
    if (texto === undefined || texto === null) return;

    ctx.save();
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const badgeX = viewW / 2;
    const badgeY = 72;
    const textW = ctx.measureText(texto).width;
    const padX = 14;

    ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
    ctx.strokeStyle = "rgba(74, 222, 128, 0.75)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(badgeX - textW / 2 - padX, badgeY - 14, textW + padX * 2, 28, 14);
    ctx.fill();
    ctx.stroke();

    ctx.font = "16px sans-serif";
    ctx.fillStyle = "white";
    ctx.fillText(texto, badgeX, badgeY);
    ctx.restore();
  }
}

window.Game = Game;

window.addEventListener('DOMContentLoaded', () => {
  window.gameInstance = new Game();
  window.game = window.gameInstance;
});

// Atalhos Globais de Compatibilidade (Sprint 20)
window.initGame = () => {
  if (window.game) return window.game.initGame();
};
window.resetGame = () => {
  if (window.game) return window.game.resetGame();
};
window.loadMapData = async (path) => {
  if (window.game) return await window.game.loadMapData(path);
};
