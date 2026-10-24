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
      onSwitchPlayer: () => this.handleSwitchPlayer(),
      onTogglePause: () => this.handlePauseShortcut(),
      onInteract: () => this.handleInteractShortcut(),
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
  startNewGame() {
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

      // Gerencia o estado da água no Mapa 1
      if (this.currentMap && this.currentMap.id === 'map1') {
        const fixedSpawns = window.GlobalState.getFixedTrashSpawns(this.currentMap);
        const total = fixedSpawns.length || 16;
        const alreadyCollected = fixedSpawns.filter(t => window.GlobalState.isTrashCollected(t.id)).length;
        if (alreadyCollected >= Math.ceil(total / 2)) {
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

    // Atualiza a lista de obstáculos ativos removendo os blocos de colisão da água
    if (Array.isArray(map.baseObstacles)) {
      map.obstacles = map.baseObstacles.slice();
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
      console.log('🌊 [FASE 1] Metade do lixo coletada! Água drenada e fundo trocado para versão seca.');
    }
  }

  /**
   * Restaura os obstáculos de água do Mapa 1 caso seja reiniciado
   */
  _restoreMap1Water() {
    const map = window.GameMaps ? window.GameMaps.map1 : null;
    if (!map) return;
    map.isWaterDrained = false;
    if (Array.isArray(map.baseObstacles) && Array.isArray(map.waterObstacles)) {
      map.obstacles = map.baseObstacles.concat(map.waterObstacles);
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
    const trashTotal = (this.currentMap && this.currentMap.trashSpawns) ? Math.min(16, this.currentMap.trashSpawns.length) : 16;
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

    // Avança para o próximo estado que é a Safe Room da Van correspondente
    const nextFlowIndex = (this.stageFlowIndex + 1) % window.GameConfig.STAGE_FLOW.length;
    this.loadStageByFlowIndex(nextFlowIndex, true);
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
    this.loadStageByFlowIndex(nextMapIndex, false);
    this.ui.showToast(`Expedição partindo para ${this.currentMap.name}!`);
  }

  /**
   * Lógica de Escolha na Van:
   * Opção 2: Voltar para a fase anterior (Replay/Farm)
   */
  confirmVanReplayPrevious() {
    const replayIndex = this.lastCompletedStageIndex || 1;
    this.loadStageByFlowIndex(replayIndex, false);
    this.ui.showToast(`Retornando para Replay/Farm em ${this.currentMap.name}!`, 2400);
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
      trashTotal: 16
    };

    if (this.ui) {
      this.ui.showGameOver(stats);
    }
  }

  /**
   * Ataque Singleplayer via Botão Esquerdo do Mouse direcionado para a mira
   */
  handleMouseLeftAttack(clientX, clientY) {
    if (this.appState !== 'PLAYING') return;
    if (this.gameMode !== 'singleplayer') return;
    if (this.waterSystem && this.waterSystem.isSurging) return;

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
    if (this.appState !== 'PLAYING') return;
    if (this.waterSystem && this.waterSystem.isSurging) return;

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
        partner.takeDamage(10);
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

      // 2. Interação com a Porta da Van
      if (this.isAnyPlayerInTransitionZone()) {
        if (stageMeta.vanType === 'start') {
          // Van Inicial: avança direto para o Mapa 1
          this.loadStageByFlowIndex(1, false);
          this.ui.showToast('Partindo da Van Inicial para o Mapa 1!');
        } else {
          // Van Intermediária ou Final: exibe as 2 opções na tela!
          const nextMeta = window.GameConfig.STAGE_FLOW[stageMeta.nextMapIndex ?? (this.stageFlowIndex + 1)];
          const replayMeta = window.GameConfig.STAGE_FLOW[this.lastCompletedStageIndex || 1];
          this.ui.showVanTransitionChoice(nextMeta, replayMeta);
        }
        return;
      }
    } else {
      // Nos Mapas Normais: interação na Zona de Extração conclui a fase e entra na Van
      if (this.isAnyPlayerInTransitionZone()) {
        this.completeCurrentMapAndEnterVan();
        return;
      }
    }

    const zoneName = stageMeta.isSafeRoom ? 'uma estação (Loja, Mural) ou a Porta da Van' : 'a Zona de Extração';
    this.ui.showToast(`Aproxime-se de ${zoneName} para interagir!`, 1600);
  }

  isAnyPlayerInTransitionZone() {
    const zone = this.currentMap ? this.currentMap.transitionZone : null;
    if (!zone) return false;
    return this.p1.isTouchingZone(zone) || this.p2.isTouchingZone(zone);
  }

  getTouchedSafeRoomStation() {
    const stations = this.currentMap ? this.currentMap.interactiveStations : null;
    if (!stations || !stations.length) return null;

    for (const st of stations) {
      if (this.p1.isTouchingZone(st) || this.p2.isTouchingZone(st)) {
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

      if (this.appState === 'PLAYING') {
        this._updateGameplay(dt);
      } else if (this.ui && typeof this.ui.isSettingsModalOpen === 'function' && this.ui.isSettingsModalOpen() && this.ui.activeSettingsTab === 'controls') {
        this.ui.updateGamepadStatusBanner();
      }

      this._renderScene();
    } catch (err) {
      console.error('⚠️ [ERRO NO LOOP DO JOGO]', err);
    } finally {
      requestAnimationFrame((ts) => this._gameLoop(ts));
    }
  }

  _updateGameplay(dt) {
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
    if (this.currentMap && this.currentMap.id === 'map1' && !this.currentMap.isWaterDrained && Array.isArray(this.currentMap.waterObstacles)) {
      for (const player of this.players) {
        const pBox = player.getBoundingBox();
        for (const wObs of this.currentMap.waterObstacles) {
          if (player._aabbOverlap(pBox, wObs)) {
            const pCenterX = player.x;
            const pCenterY = player.y;
            const wCenterX = wObs.x + wObs.w / 2;
            const wCenterY = wObs.y + wObs.h / 2;
            const dx = pCenterX - wCenterX;
            const dy = pCenterY - wCenterY;
            const dist = Math.hypot(dx, dy) || 1;
            player.x += (dx / dist) * 14;
            player.y += (dy / dist) * 14;

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

        // Verificação de Drenagem da Água da Fase 1 (ao atingir 50% dos lixos = 8 lixos)
        if (this.currentMap && this.currentMap.id === 'map1' && !this.currentMap.isWaterDrained) {
          const fixedSpawns = window.GlobalState.getFixedTrashSpawns(this.currentMap);
          const totalSpawns = fixedSpawns.length || 16;
          const collectedTotal = fixedSpawns.filter(t => window.GlobalState.isTrashCollected(t.id)).length;
          const halfTrash = Math.ceil(totalSpawns / 2);
          if (collectedTotal >= halfTrash) {
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

  _renderScene() {
    const ctx = this.ctx;
    const map = this.currentMap;
    const { width: viewW, height: viewH } = this.canvas;

    ctx.fillStyle = '#090d14';
    ctx.fillRect(0, 0, viewW, viewH);

    if (!map) return;

    ctx.save();
    const { offsetX, offsetY } = this.camera.getRenderOffset();
    ctx.translate(offsetX, offsetY);

    // 1. Piso Base do Mapa (Imagem do cenário ou cor padrão de fundo)
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

    // 2. Trilhas / Zonas no Chão (apenas em mapas conceituais sem imagem)
    if (!map.imageAsset) {
      this._drawFloorZones(ctx, map);
    }

    // 3. Áreas Demarcadas das Estações da Van (Loja de Armas, Mural de Avisos)
    this._drawSafeRoomStationsZones(ctx, map);

    // 4. Zona de Extração / Porta da Van
    this._drawTransitionZone(ctx, map);

    // 5. Entidades de Lixo / Sucata
    this._drawTrashItems(ctx);

    // 6. Obstáculos (apenas em mapas conceituais sem imagem)
    if (!map.imageAsset) {
      this._drawObstacles(ctx, map);
    }

    // 7. Personagens P1 e P2
    const sortedPlayers = [...this.players].sort((a, b) => a.y - b.y);
    for (const player of sortedPlayers) {
      const isControlled =
        this.gameMode === 'multiplayer' ||
        this.players[this.activePlayerIndex].id === player.id;
      player.draw(ctx, isControlled, this.gameMode, this.elapsedTime);
    }

    // 8. Inimigos e Projéteis (3 Tipos de Ratos a partir da Fase 2)
    if (this.enemyManager) {
      this.enemyManager.render(ctx, this.elapsedTime);
    }

    // 9. Camada Superior / Parallax de Estruturas Elevadas (Passarelas sobre o Personagem)
    this._drawElevatedParallaxStructures(ctx, map);

    // 10. Balão Flutuante de Interação nas Estações da Van
    this._drawSafeRoomStationFloatingNotice(ctx, map);

    // 11. Textos Flutuantes
    for (const ft of this.floatingTexts) {
      ft.draw(ctx);
    }

    ctx.restore();

    // 12. Filtro e Efeito de Água Subindo (Sobreposto à cena do jogo na tela)
    if (this.waterSystem) {
      this.waterSystem.render(ctx, viewW, viewH);
    }

    // 13. Bússola Orientadora para a Saída
    if (this.appState === 'PLAYING' || this.appState === 'PAUSED') {
      this._drawExtractionCompass(ctx);
    }

    // 14. Confetes e Efeito Festivo de Vitória
    if (this.isVictorySequence) {
      this._renderVictoryConfetti(ctx);
    }
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

    ctx.save();
    for (const st of map.interactiveStations) {
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

    const floatOffset = Math.sin(this.elapsedTime * 6) * 4;

    ctx.save();
    for (const st of map.interactiveStations) {
      const isTouched = this.p1.isTouchingZone(st) || this.p2.isTouchingZone(st);
      if (!isTouched) continue;

      const text = st.promptText;
      ctx.font = 'bold 13px Consolas, monospace';
      const padX = 14;
      const boxW = ctx.measureText(text).width + padX * 2;
      const boxH = 30;
      const centerX = st.x + st.w / 2;
      const centerY = st.y + st.h + 24 + floatOffset;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
      ctx.strokeStyle = st.strokeColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(centerX - boxW / 2, centerY - boxH / 2, boxW, boxH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, centerX, centerY);
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

    const pulse = 0.5 + 0.5 * Math.sin(this.elapsedTime * 5);

    ctx.save();
    ctx.fillStyle = z.fillColor;
    ctx.fillRect(z.x, z.y, z.w, z.h);

    ctx.strokeStyle = z.strokeColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(z.x, z.y, z.w, z.h);

    ctx.strokeStyle = '#ffffff';
    ctx.globalAlpha = 0.35 + pulse * 0.45;
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 6]);
    ctx.strokeRect(z.x + 8, z.y + 8, z.w - 16, z.h - 16);
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    const centerX = z.x + z.w / 2;
    const centerY = z.y + z.h / 2;

    const isBossAliveInMap3 = (this.getCurrentStageMeta().stateId === 'MAP_3' && this.enemyManager && this.enemyManager.boss && !this.enemyManager.boss.isDefeated);

    ctx.fillStyle = isBossAliveInMap3 ? '#ef4444' : '#ffffff';
    ctx.font = 'bold 13px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(isBossAliveInMap3 ? '🔒 EXTRAÇÃO BLOQUEADA' : z.label, centerX, centerY - 12);

    ctx.fillStyle = isBossAliveInMap3 ? '#fca5a5' : '#e2e8f0';
    ctx.font = '11px Consolas, monospace';
    ctx.fillText(isBossAliveInMap3 ? 'Derrote o Chefe para Liberar' : z.subLabel, centerX, centerY + 8);

    // Barra de progresso ao permanecer na zona (apenas nos mapas normais)
    if (!this.getCurrentStageMeta().isSafeRoom && this.zoneHoldTimer > 0) {
      const pct = Math.min(1, this.zoneHoldTimer / this.zoneHoldDuration);
      const barW = z.w - 40;
      const barH = 10;
      const barX = centerX - barW / 2;
      const barY = centerY + 24;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(barX, barY, barW, barH);
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(barX, barY, barW * pct, barH);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(barX, barY, barW, barH);
    }

    ctx.restore();
  }

  _drawObstacles(ctx, map) {
    ctx.save();
    for (const obs of map.obstacles) {
      ctx.fillStyle = obs.customFill || ((map.palette && map.palette.wallFill) || 'rgba(30, 41, 59, 0.94)');
      ctx.fillRect(obs.x, obs.y, obs.w, obs.h);

      ctx.strokeStyle = obs.customStroke || ((map.palette && map.palette.wallStroke) || '#38bdf8');
      ctx.lineWidth = obs.customStroke ? 2.5 : 2;
      ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);

      if (obs.w >= 120 && obs.h >= 65) {
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
}

window.addEventListener('DOMContentLoaded', () => {
  window.gameInstance = new Game();
});
