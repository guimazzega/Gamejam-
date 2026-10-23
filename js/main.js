/**
 * js/main.js
 * Motor Principal do Protótipo 2D Top-Down (Sprint 3):
 * - Persistência Global de Lixos em Coordenadas Fixas (Hardcoded) nos 3 Mapas (sem geração procedural)
 * - Sistema de Ataque/Bater Placeholder (Arco/Cone de colisão colorido + Log no Console)
 *   • Singleplayer: Botão Direito do Mouse (com bloqueio de contextmenu) ou Tecla de Ataque remapeada
 *   • Multiplayer Local: Jogador 1 na tecla R e Jogador 2 na tecla 0 (ou teclas remapeadas em Config.Controls)
 * - Suporte Nativo a Gamepad API (navigator.getGamepads()) dentro do requestAnimationFrame
 * - Consumo integral do Dicionário Global de Inputs (window.Config.Controls)
 */

class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');

    // Garante bloqueio do menu de contexto padrão do navegador também diretamente no Canvas
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // Estado de Alto Nível: 'MAIN_MENU' | 'PLAYING' | 'PAUSED'
    this.appState = 'MAIN_MENU';

    // Modo de Operação: 'singleplayer' | 'multiplayer'
    this.gameMode = 'singleplayer';

    // Índice na Máquina de Estados de Fases (0: Mapa 1 -> 1: Van -> 2: Mapa 2 -> 3: Van -> 4: Mapa 3)
    this.stageFlowIndex = 0;
    this.currentMap = window.GameMaps.map1;

    // Timer regressivo da fase (em segundos)
    this.stageTimeRemaining = window.GameConfig.STAGE_DURATION_SECONDS;

    // Tempo de permanência na Zona de Transição (para auto-avançar ao encostar, além de E/Espaço)
    this.zoneHoldTimer = 0;
    this.zoneHoldDuration = 1.15;

    // Instancia os 2 Personagens em cena (5 slots de inventário cada)
    this.p1 = new window.Player({
      id: 1,
      name: 'Jogador 1',
      role: 'Batedor',
      primaryColor: '#38bdf8',
      secondaryColor: '#0284c7',
      inventory: window.GameConfig.createDefaultInventoryP1()
    });

    this.p2 = new window.Player({
      id: 2,
      name: 'Jogador 2',
      role: 'Suporte',
      primaryColor: '#fb923c',
      secondaryColor: '#ea580c',
      inventory: window.GameConfig.createDefaultInventoryP2()
    });

    this.players = [this.p1, this.p2];
    this.activePlayerIndex = 0; // Usado no Singleplayer (0 = P1, 1 = P2)

    // Entidades de Lixo / Sucata fixas restantes no mapa atual (Sprint 3)
    this.trashItems = [];

    // Lista de textos flutuantes de debug (ex: "-10 HP", "+1 Lixo", "⚔️ ATAQUE", avisos de estação)
    this.floatingTexts = [];

    // Câmera 2D
    this.camera = new window.Camera2D(window.innerWidth, window.innerHeight);

    // Input Manager (Teclado via Config.Controls + Mouse Right Click + Gamepad API)
    this.input = new window.InputManager({
      onSwitchPlayer: () => this.handleSwitchPlayer(),
      onTogglePause: () => this.handlePauseShortcut(),
      onInteract: () => this.handleInteractShortcut(),
      onMouseRightAttack: (source) => this.handleMouseRightAttack(source),
      onPlayerAttack: (playerId, source) => this.handleKeyboardAttack(playerId, source),
      onGamepadAttack: (targetSlot, source) => this.handleGamepadAttack(targetSlot, source),
      onGamepadInteractOrAttack: (targetSlot, source) => this.handleGamepadInteractOrAttack(targetSlot, source),
      onGamepadCycleSlot: (targetSlot, dir, source) => this.handleGamepadCycleSlot(targetSlot, dir, source),
      onGamepadStatusChange: (gp, connected, profile) => this.handleGamepadStatusChange(gp, connected, profile),
      onCyclePlayerSlot: (playerId, dir) => this.cyclePlayerHotbarSlot(playerId, dir),
      onDebugDamage: () => this.handleDebugDamage(),
      onDebugHeal: () => this.handleDebugHeal(),
      onDebugNextStage: () => this.handleDebugNextStage(),
      onSelectSlot: (slotIndex) => this.selectHotbarSlot(slotIndex, null),
      onCycleSlot: (direction) => this.cycleHotbarSlot(direction)
    });

    // UI Manager
    this.ui = new window.UIManager(this);

    // Ajuste de Redimensionamento de Tela
    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);
    this._onResize();

    // Inicializa os itens de lixo nas posições fixas (hardcoded) do Mapa 1 para preview
    this._spawnFixedTrashForMap(this.currentMap);

    // Controle de Tempo do Loop
    this.lastTimestamp = performance.now();
    this.elapsedTime = 0;

    requestAnimationFrame((ts) => this._gameLoop(ts));
  }

  _onResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.camera.resize(this.canvas.width, this.canvas.height);
  }

  getCurrentStageMeta() {
    return window.GameConfig.STAGE_FLOW[this.stageFlowIndex];
  }

  getHudFocusPlayer() {
    if (this.gameMode === 'singleplayer') {
      return this.players[this.activePlayerIndex];
    }
    return this.p1;
  }

  /**
   * Inicia / Retorna à partida a partir do Menu Principal carregando o Mapa 1.
   * Mantém o registro global de lixos coletados (window.collectedTrashIds) para garantir
   * persistência caso o jogador saia e volte para a fase.
   */
  startNewGame() {
    this.p1.hp = this.p1.maxHp;
    this.p2.hp = this.p2.maxHp;
    this.p1.selectedSlot = 0;
    this.p2.selectedSlot = 0;
    this.activePlayerIndex = 0;
    this.floatingTexts = [];

    this.loadStageByFlowIndex(0);
    this.appState = 'PLAYING';
    this.ui.showGameplayHUD();

    const C = window.Config.Controls;
    const fmt = (k) => window.Config.formatKeyCode(k);
    const modeDesc =
      this.gameMode === 'singleplayer'
        ? `Singleplayer (Ataque: Botão Direito do Mouse / [${fmt(C.P1_Attack)}])`
        : `Multiplayer Local (Ataque P1: [${fmt(C.P1_Attack)}] • Ataque P2: [${fmt(C.P2_Attack)}])`;

    this.ui.showToast(`Partida em andamento: ${modeDesc}`);
  }

  /**
   * Carrega um estado específico da máquina de estados de fases:
   * 0: Mapa 1 -> 1: Van -> 2: Mapa 2 -> 3: Van -> 4: Mapa 3
   */
  loadStageByFlowIndex(flowIndex) {
    const flowList = window.GameConfig.STAGE_FLOW;
    this.stageFlowIndex = ((flowIndex % flowList.length) + flowList.length) % flowList.length;

    const stageMeta = this.getCurrentStageMeta();
    this.currentMap = window.GameMaps[stageMeta.mapKey];

    // Posiciona ambos os personagens nos pontos de spawn do mapa atual
    this.p1.setPosition(this.currentMap.spawnP1.x, this.currentMap.spawnP1.y);
    this.p2.setPosition(this.currentMap.spawnP2.x, this.currentMap.spawnP2.y);

    // Reseta o Timer da Fase (180s = 03:00) e carrega os Lixos Fixos ainda NÃO coletados
    if (!stageMeta.isSafeRoom) {
      this.stageTimeRemaining = window.GameConfig.STAGE_DURATION_SECONDS;
      this._spawnFixedTrashForMap(this.currentMap);
    } else {
      this.trashItems = [];
    }

    this.zoneHoldTimer = 0;
    this.input.clearAll();

    // Posiciona a câmera imediatamente no foco inicial
    const camTarget = this._getCameraTargetPoint();
    this.camera.snapToTarget(camTarget.x, camTarget.y, this.currentMap);

    this.ui.updateHUD();
  }

  /**
   * Instancia os itens de Lixo/Sucata exclusivamente nas coordenadas fixas (hardcoded) do mapa,
   * consultando o Estado Global (window.collectedTrashIds) para nunca respawnar itens já coletados.
   */
  _spawnFixedTrashForMap(map) {
    this.trashItems = [];
    if (!map || map.isSafeRoom || !Array.isArray(map.trashSpawns)) return;

    const types = window.GameConfig.TRASH_TYPES;

    map.trashSpawns.forEach((spawnDef, idx) => {
      // Verifica no estado global se este lixo já foi coletado anteriormente
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
   * Reinicia a fase atual mantendo a persistência global dos lixos já coletados
   */
  restartCurrentStage() {
    this.p1.hp = this.p1.maxHp;
    this.p2.hp = this.p2.maxHp;
    this.loadStageByFlowIndex(this.stageFlowIndex);
    this.togglePause(false);
    this.ui.showToast('Fase reiniciada! (Lixos já coletados permanecem salvos no Estado Global).');
  }

  /**
   * Retorna ao Menu Principal
   */
  returnToMainMenu() {
    this.appState = 'MAIN_MENU';
    this.input.clearAll();
    this.ui.showMainMenu();
  }

  /**
   * Ataque via Botão Direito do Mouse (Exclusivo do Modo Singleplayer)
   */
  handleMouseRightAttack(sourceLabel) {
    if (this.appState !== 'PLAYING') return;
    if (this.gameMode !== 'singleplayer') return;

    const activePlayer = this.players[this.activePlayerIndex];
    this._executePlayerAttack(activePlayer, sourceLabel);
  }

  /**
   * Ataque via Teclado (Config.Controls.P1_Attack = 'KeyR' e Config.Controls.P2_Attack = 'Digit0')
   */
  handleKeyboardAttack(playerId, sourceLabel) {
    if (this.appState !== 'PLAYING') return;

    if (this.gameMode === 'singleplayer') {
      // No Singleplayer, se o jogador pressionar a tecla de ataque remapeada de P1, o personagem ativo também ataca
      if (playerId === 1) {
        const activePlayer = this.players[this.activePlayerIndex];
        this._executePlayerAttack(activePlayer, sourceLabel);
      }
    } else {
      // No Multiplayer Local: P1 ataca com P1_Attack (R) e P2 ataca com P2_Attack (0)
      const attacker = playerId === 2 ? this.p2 : this.p1;
      this._executePlayerAttack(attacker, sourceLabel);
    }
  }

  /**
   * Ataque via Botões de Face do Gamepad (X / Y)
   */
  handleGamepadAttack(targetSlot, sourceLabel) {
    if (this.appState !== 'PLAYING') return;

    const attacker =
      this.gameMode === 'singleplayer'
        ? this.players[this.activePlayerIndex]
        : targetSlot === 2
          ? this.p2
          : this.p1;

    this._executePlayerAttack(attacker, sourceLabel);
  }

  /**
   * Botões de Face Secundários do Gamepad (A / B): Interage se estiver em uma zona/estação, caso contrário ataca
   */
  handleGamepadInteractOrAttack(targetSlot, sourceLabel) {
    if (this.appState !== 'PLAYING') return;

    if (this.getTouchedSafeRoomStation() || this.isAnyPlayerInTransitionZone()) {
      this.handleInteractShortcut();
    } else {
      this.handleGamepadAttack(targetSlot, sourceLabel);
    }
  }

  /**
   * Executa o evento de Atacar/Bater: ativa o arco/cone de colisão, gera log no console e verifica Fogo Amigo
   */
  _executePlayerAttack(attacker, sourceLabel) {
    if (!attacker) return;
    const triggered = attacker.triggerAttack(sourceLabel, this.gameMode);
    if (!triggered) return;

    const tipX = attacker.x + attacker.facingX * 36;
    const tipY = attacker.y + attacker.facingY * 36 - 18;
    const color = attacker.id === 1 ? '#38bdf8' : '#fb923c';

    this.floatingTexts.push(
      new window.FloatingText(tipX, tipY, `⚔️ ATAQUE P${attacker.id}`, color, 0.55)
    );

    // Se Fogo Amigo (friendlyFireEnabled) estiver ativo nas configurações, verifica colisão do cone com o parceiro
    if (window.friendlyFireEnabled) {
      const partner = attacker.id === 1 ? this.p2 : this.p1;
      if (attacker.isPointInAttackCone(partner.x, partner.y, partner.size / 2)) {
        partner.takeDamage(10);
        this.camera.triggerShake(0.14, 4);
        this.floatingTexts.push(
          new window.FloatingText(partner.x, partner.y - 36, '-10 HP [FOGO AMIGO]', '#ef4444', 0.9)
        );
        console.log(
          `🔥 [FOGO AMIGO] ${attacker.name} atingiu ${partner.name} no cone de ataque! (-10 HP)`
        );
        this.ui.updateHUD();
      }
    }
  }

  /**
   * Bumpers L1 / R1 do Gamepad giram os itens do inventário
   */
  handleGamepadCycleSlot(targetSlot, direction, sourceLabel) {
    if (this.appState !== 'PLAYING') return;

    const player =
      this.gameMode === 'singleplayer'
        ? this.players[this.activePlayerIndex]
        : targetSlot === 2
          ? this.p2
          : this.p1;

    const len = player.inventory.length;
    player.selectedSlot = (player.selectedSlot + direction + len) % len;
    this.ui.renderHotbar();

    const equipped = player.getEquippedItem();
    console.log(
      `🎒 [INVENTÁRIO GAMEPAD] ${player.name} girou para Slot ${player.selectedSlot + 1} (${equipped ? equipped.shortName : 'Vazio'}) via ${sourceLabel}`
    );
  }

  handleGamepadStatusChange(gp, connected, profile) {
    if (connected) {
      this.ui.showToast(`🕹️ Controle conectado: ${profile.label}`, 2400);
    } else {
      this.ui.showToast(`🕹️ Controle #${gp.index + 1} desconectado.`, 1800);
    }
    this.ui.updateGamepadStatusBanner();
  }

  /**
   * Alterna entre Personagem 1 e Personagem 2 (no Singleplayer)
   */
  handleSwitchPlayer() {
    if (this.appState !== 'PLAYING') return;

    if (this.gameMode !== 'singleplayer') {
      this.ui.showToast('Modo Multiplayer Local ativo: ambos os jogadores já estão em controle simultâneo!');
      return;
    }

    this.activePlayerIndex = this.activePlayerIndex === 0 ? 1 : 0;
    const active = this.players[this.activePlayerIndex];

    this.floatingTexts.push(
      new window.FloatingText(active.x, active.y - 42, `▼ CONTROLE ATIVO`, '#ffca3a')
    );

    this.ui.renderHotbar();
    this.ui.updateHUD();
    this.ui.showToast(`Controle alternado para ${active.name}`, 1400);
  }

  /**
   * Pausa / Despausa a partida
   */
  handlePauseShortcut() {
    if (this.ui.isSettingsModalOpen()) {
      this.ui.closeSettingsModal();
      return;
    }

    if (this.appState === 'MAIN_MENU') {
      return;
    }

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
   * Interação com Estações da Safe Room (Lojinha / Crafting) ou Zona de Extração / Porta da Van
   */
  handleInteractShortcut() {
    if (this.appState !== 'PLAYING') return;

    const touchedStation = this.getTouchedSafeRoomStation();
    if (touchedStation) {
      const centerX = touchedStation.x + touchedStation.w / 2;
      const centerY = touchedStation.y + 10;
      this.floatingTexts.push(
        new window.FloatingText(centerX, centerY, touchedStation.promptText, touchedStation.strokeColor, 1.4)
      );
      this.ui.showToast(`${touchedStation.icon} ${touchedStation.promptText}`, 2000);
      return;
    }

    if (this.isAnyPlayerInTransitionZone()) {
      this.advanceToNextStage('Interação na Zona de Saída');
    } else {
      const zoneName = this.getCurrentStageMeta().isSafeRoom
        ? 'a Porta da Van (ou das estações de Loja/Craft)'
        : 'a Zona de Extração';
      this.ui.showToast(`Aproxime-se d${zoneName} para interagir!`, 1600);
    }
  }

  /**
   * Atalho de Debug [H]: Causa -10 de dano no personagem ativo
   */
  handleDebugDamage() {
    if (this.appState !== 'PLAYING' && this.appState !== 'PAUSED') return;

    const target = this.getHudFocusPlayer();
    target.takeDamage(10);
    this.camera.triggerShake(0.16, 5);

    this.floatingTexts.push(
      new window.FloatingText(target.x, target.y - 36, '-10 HP [DEBUG]', '#ff4d4d')
    );

    this.ui.updateHUD();
    if (this.appState === 'PAUSED') {
      this.ui.updatePauseInventoryPanel();
    }
    this.ui.showToast(`[DEBUG] -10 HP em ${target.name} (${target.hp}/${target.maxHp} HP)`, 1600);
  }

  /**
   * Atalho Extra de Debug [J]: Cura +20 HP no personagem ativo
   */
  handleDebugHeal() {
    if (this.appState !== 'PLAYING' && this.appState !== 'PAUSED') return;

    const target = this.getHudFocusPlayer();
    target.heal(20);

    this.floatingTexts.push(
      new window.FloatingText(target.x, target.y - 36, '+20 HP [DEBUG]', '#4ade80')
    );

    this.ui.updateHUD();
    if (this.appState === 'PAUSED') {
      this.ui.updatePauseInventoryPanel();
    }
    this.ui.showToast(`[DEBUG] +20 HP em ${target.name} (${target.hp}/${target.maxHp} HP)`, 1600);
  }

  /**
   * Atalho de Debug [N]: Força avanço imediato para o próximo estado de mapa
   */
  handleDebugNextStage() {
    if (this.appState !== 'PLAYING') return;
    this.advanceToNextStage('Atalho de Debug [N]');
  }

  /**
   * Avança para o próximo estado na máquina de estados:
   * Mapa 1 -> Safe Room (Van) -> Mapa 2 -> Safe Room (Van) -> Mapa 3
   */
  advanceToNextStage(reason = '') {
    const totalStages = window.GameConfig.STAGE_FLOW.length;
    const nextIndex = (this.stageFlowIndex + 1) % totalStages;
    const wrappedCycle = this.stageFlowIndex === totalStages - 1;

    this.loadStageByFlowIndex(nextIndex);
    const meta = this.getCurrentStageMeta();

    if (wrappedCycle) {
      this.ui.showToast(`Ciclo concluído! Retornando ao ${meta.label} (Lixos coletados permanecem salvos)`);
    } else {
      this.ui.showToast(`Avançou (${reason}) → ${meta.label}`);
    }
  }

  /**
   * Seleção direta de Slot da Hotbar (1 a 5 ou clique)
   */
  selectHotbarSlot(slotIndex, targetPlayerId = null) {
    if (this.appState !== 'PLAYING') return;

    let player;
    if (this.gameMode === 'multiplayer') {
      player = targetPlayerId === 2 ? this.p2 : this.p1;
    } else {
      player = this.getHudFocusPlayer();
    }

    if (slotIndex < 0 || slotIndex >= player.inventory.length) return;

    player.selectedSlot = slotIndex;
    this.ui.renderHotbar();
  }

  /**
   * Gira o slot de inventário de um jogador específico via tecla remapeável de Inventário (Config.Controls.P1_Inventory / P2_Inventory)
   */
  cyclePlayerHotbarSlot(playerId, direction = 1) {
    if (this.appState !== 'PLAYING') return;

    const player =
      this.gameMode === 'singleplayer'
        ? this.getHudFocusPlayer()
        : playerId === 2
          ? this.p2
          : this.p1;

    const len = player.inventory.length;
    player.selectedSlot = (player.selectedSlot + direction + len) % len;
    this.ui.renderHotbar();
  }

  /**
   * Alternância de Slot da Hotbar via Scroll do Mouse
   */
  cycleHotbarSlot(direction) {
    if (this.appState !== 'PLAYING') return;

    const player = this.gameMode === 'multiplayer'
      ? this.p2
      : this.getHudFocusPlayer();

    const len = player.inventory.length;
    player.selectedSlot = (player.selectedSlot + direction + len) % len;
    this.ui.renderHotbar();
  }

  isAnyPlayerInTransitionZone() {
    const zone = this.currentMap.transitionZone;
    if (!zone) return false;
    return this.p1.isTouchingZone(zone) || this.p2.isTouchingZone(zone);
  }

  getTouchedSafeRoomStation() {
    const stations = this.currentMap.interactiveStations;
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

  /**
   * Loop Principal do Jogo (requestAnimationFrame)
   */
  _gameLoop(timestamp) {
    const dt = Math.min(0.05, (timestamp - this.lastTimestamp) / 1000);
    this.lastTimestamp = timestamp;
    this.elapsedTime += dt;

    // 1. Leitura nativa de Joysticks via navigator.getGamepads() dentro do requestAnimationFrame (Sprint 3)
    this.input.pollGamepads(this.gameMode);

    if (this.appState === 'PLAYING') {
      this._updateGameplay(dt);
    } else if (this.ui.isSettingsModalOpen() && this.ui.activeSettingsTab === 'controls') {
      this.ui.updateGamepadStatusBanner();
    }

    this._renderScene();

    requestAnimationFrame((ts) => this._gameLoop(ts));
  }

  _updateGameplay(dt) {
    // 1. Movimentação dos Personagens consumindo o Dicionário Global (Config.Controls) + Gamepad API
    if (this.gameMode === 'singleplayer') {
      const moveVec = this.input.getP1Vector();
      const activePlayer = this.players[this.activePlayerIndex];
      const inactivePlayer = this.players[this.activePlayerIndex === 0 ? 1 : 0];

      activePlayer.update(dt, moveVec, this.currentMap, null);
      inactivePlayer.update(dt, { dx: 0, dy: 0 }, this.currentMap, null);

      const camTarget = this._getCameraTargetPoint();
      this.camera.update(dt, camTarget.x, camTarget.y, this.currentMap, null);
    } else {
      const p1Vec = this.input.getP1Vector();
      const p2Vec = this.input.getP2Vector();

      this._updateMultiplayerWithViewportClamp(dt, p1Vec, p2Vec);
    }

    // 2. Coleta e Persistência Global de Lixo / Sucata nas Coordenadas Fixas (Sprint 3)
    this._checkTrashCollection();

    // 3. Cronômetro da Fase (Apenas nos 3 Mapas Grandes; pausado na Safe Room Van)
    const stageMeta = this.getCurrentStageMeta();
    if (!stageMeta.isSafeRoom) {
      this.stageTimeRemaining = Math.max(0, this.stageTimeRemaining - dt);
      if (this.stageTimeRemaining <= 0) {
        this.restartCurrentStage();
        this.ui.showToast('Tempo esgotado! Fase reiniciada (Lixos coletados permanecem salvos).');
        return;
      }
    }

    // 4. Verificação da Zona de Extração / Porta da Van (Auto-embarque ao permanecer na zona)
    if (this.isAnyPlayerInTransitionZone()) {
      this.zoneHoldTimer += dt;
      if (this.zoneHoldTimer >= this.zoneHoldDuration) {
        this.advanceToNextStage('Zona de Transição concluída');
        return;
      }
    } else {
      this.zoneHoldTimer = Math.max(0, this.zoneHoldTimer - dt * 2);
    }

    // 5. Atualiza Textos Flutuantes de Debug
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      this.floatingTexts[i].update(dt);
      if (this.floatingTexts[i].life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }

    // 6. Atualiza a HUD
    this.ui.updateHUD();
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

  /**
   * Verifica se algum jogador encostou em um objeto "Lixo",
   * registrando seu ID único no Estado Global (window.collectedTrashIds) para que nunca reapareça.
   */
  _checkTrashCollection() {
    if (!this.trashItems || this.trashItems.length === 0) return;

    for (let i = this.trashItems.length - 1; i >= 0; i--) {
      const trash = this.trashItems[i];
      const trashBox = trash.getBoundingBox();

      const collectedByP1 = this.p1.isTouchingZone(trashBox);
      const collectedByP2 = !collectedByP1 && this.p2.isTouchingZone(trashBox);

      if (collectedByP1 || collectedByP2) {
        this.trashItems.splice(i, 1);
        window.GlobalState.markTrashCollected(trash.id);

        console.log(
          `♻️ [PERSISTÊNCIA DE LIXO] Item "${trash.id}" (${trash.typeInfo.name}) coletado em (${trash.x}, ${trash.y}). Total Global Salvo: ${window.scrapCollected}`
        );

        this.floatingTexts.push(
          new window.FloatingText(
            trash.x,
            trash.y - 18,
            `+1 ${trash.typeInfo.name} [Salvo: ${window.scrapCollected}]`,
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

    ctx.save();
    const { offsetX, offsetY } = this.camera.getRenderOffset();
    ctx.translate(offsetX, offsetY);

    // 1. Piso Base do Mapa
    ctx.fillStyle = map.palette.bg;
    ctx.fillRect(0, 0, map.width, map.height);

    // 2. Grid de Referência no Chão
    this._drawDebugGrid(ctx, map);

    // 3. Zonas de Referência / Trilhas no Chão
    this._drawFloorZones(ctx, map);

    // 4. Áreas Demarcadas das Estações da Safe Room (Lojinha e Mesa de Craft)
    this._drawSafeRoomStationsZones(ctx, map);

    // 5. Marcadores de Spawn P1 e P2
    this._drawSpawnMarkers(ctx, map);

    // 6. Zona de Extração / Porta da Van
    this._drawTransitionZone(ctx, map);

    // 7. Entidades Coletáveis de "Lixo / Sucata" nas Posições Fixas
    this._drawTrashItems(ctx);

    // 8. Caixas de Colisão Visíveis para Paredes, Estruturas e Estações da Van
    this._drawObstacles(ctx, map);

    // 9. Linha de Ponto Médio no Multiplayer Local
    if (this.gameMode === 'multiplayer') {
      this._drawMultiplayerMidpointDebug(ctx);
    }

    // 10. Personagens 1 e 2 (Ordenados por Y + Cone de Colisão de Ataque)
    const sortedPlayers = [...this.players].sort((a, b) => a.y - b.y);
    for (const player of sortedPlayers) {
      const isControlled =
        this.gameMode === 'multiplayer' ||
        this.players[this.activePlayerIndex].id === player.id;
      player.draw(ctx, isControlled, this.gameMode, this.elapsedTime);
    }

    // 11. Balão/Texto Flutuante de Interação nas Estações da Safe Room
    this._drawSafeRoomStationFloatingNotice(ctx, map);

    // 12. Textos Flutuantes de Debug
    for (const ft of this.floatingTexts) {
      ft.draw(ctx);
    }

    ctx.restore();

    // 13. Indicadores de Tela Fixa no Canvas (Bússola de Extração + Minimapa Debug)
    if (this.appState === 'PLAYING' || this.appState === 'PAUSED') {
      this._drawExtractionCompass(ctx);
      this._drawDebugMinimap(ctx);
    }
  }

  _drawDebugGrid(ctx, map) {
    const tile = window.GameConfig.TILE_SIZE;
    const major = window.GameConfig.MAJOR_GRID_STEP;

    const startX = Math.max(0, Math.floor(this.camera.x / tile) * tile);
    const endX = Math.min(map.width, Math.ceil((this.camera.x + this.canvas.width) / tile) * tile);
    const startY = Math.max(0, Math.floor(this.camera.y / tile) * tile);
    const endY = Math.min(map.height, Math.ceil((this.camera.y + this.canvas.height) / tile) * tile);

    ctx.beginPath();
    ctx.strokeStyle = map.palette.gridMinor;
    ctx.lineWidth = 1;
    for (let x = startX; x <= endX; x += tile) {
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
    }
    for (let y = startY; y <= endY; y += tile) {
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
    }
    ctx.stroke();

    const majorStartX = Math.max(0, Math.floor(this.camera.x / major) * major);
    const majorStartY = Math.max(0, Math.floor(this.camera.y / major) * major);

    ctx.beginPath();
    ctx.strokeStyle = map.palette.gridMajor;
    ctx.lineWidth = 1.5;
    for (let x = majorStartX; x <= endX; x += major) {
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
    }
    for (let y = majorStartY; y <= endY; y += major) {
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
    }
    ctx.stroke();

    ctx.fillStyle = map.palette.coordText;
    ctx.font = '10px Consolas, monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    for (let x = majorStartX; x < endX; x += major) {
      for (let y = majorStartY; y < endY; y += major) {
        if (x > 0 && y > 0) {
          ctx.fillText(`${x},${y}`, x + 4, y + 4);
        }
      }
    }
  }

  _drawFloorZones(ctx, map) {
    if (!map.floorZones) return;
    ctx.save();
    for (const z of map.floorZones) {
      ctx.fillStyle = map.palette.pathFill;
      ctx.strokeStyle = map.palette.pathStroke;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 6]);
      ctx.fillRect(z.x, z.y, z.w, z.h);
      ctx.strokeRect(z.x, z.y, z.w, z.h);
      ctx.setLineDash([]);

      if (z.label) {
        ctx.fillStyle = map.palette.coordText;
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

      const labelY = st.id === 'shop' ? st.y + st.h - 14 : st.y + 20;
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
      const centerY = (st.id === 'shop' ? st.y + st.h + 26 : st.y - 26) + floatOffset;

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

  _drawSpawnMarkers(ctx, map) {
    const spawns = [
      { pos: map.spawnP1, label: 'SPAWN P1', color: '#38bdf8' },
      { pos: map.spawnP2, label: 'SPAWN P2', color: '#fb923c' }
    ];

    ctx.save();
    for (const sp of spawns) {
      ctx.strokeStyle = sp.color;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(sp.pos.x, sp.pos.y, 26, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = sp.color;
      ctx.font = 'bold 10px Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(sp.label, sp.pos.x, sp.pos.y + 38);
    }
    ctx.restore();
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

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(z.label, centerX, centerY - 12);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '11px Consolas, monospace';
    ctx.fillText(z.subLabel, centerX, centerY + 8);

    if (this.zoneHoldTimer > 0) {
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
      ctx.fillStyle = obs.customFill || map.palette.wallFill;
      ctx.fillRect(obs.x, obs.y, obs.w, obs.h);

      ctx.strokeStyle = obs.customStroke || map.palette.wallStroke;
      ctx.lineWidth = obs.customStroke ? 2.5 : 2;
      ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.moveTo(obs.x, obs.y);
      ctx.lineTo(obs.x + obs.w, obs.y + obs.h);
      ctx.moveTo(obs.x + obs.w, obs.y);
      ctx.lineTo(obs.x, obs.y + obs.h);
      ctx.stroke();

      if (obs.w >= 120 && obs.h >= 70) {
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 11px Consolas, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(obs.label || 'COLISÃO', obs.x + obs.w / 2, obs.y + obs.h / 2 - 4);

        ctx.fillStyle = obs.customStroke || 'rgba(226, 232, 240, 0.65)';
        ctx.font = '10px Consolas, monospace';
        ctx.fillText(
          obs.subTag || `[${obs.w}x${obs.h}px]`,
          obs.x + obs.w / 2,
          obs.y + obs.h / 2 + 12
        );
      }
    }
    ctx.restore();
  }

  _drawMultiplayerMidpointDebug(ctx) {
    const midX = (this.p1.x + this.p2.x) / 2;
    const midY = (this.p1.y + this.p2.y) / 2;

    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = 'rgba(255, 202, 58, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = '#ffca3a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(midX, midY, 8, 0, Math.PI * 2);
    ctx.moveTo(midX - 13, midY);
    ctx.lineTo(midX + 13, midY);
    ctx.moveTo(midX, midY - 13);
    ctx.lineTo(midX, midY + 13);
    ctx.stroke();

    ctx.fillStyle = '#ffca3a';
    ctx.font = '10px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CAM MIDPOINT', midX, midY - 14);
    ctx.restore();
  }

  _drawExtractionCompass(ctx) {
    const zone = this.currentMap.transitionZone;
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

  _drawDebugMinimap(ctx) {
    const map = this.currentMap;
    const maxMiniSize = 150;
    const scale = Math.min(maxMiniSize / map.width, maxMiniSize / map.height);
    const miniW = map.width * scale;
    const miniH = map.height * scale;

    const margin = 20;
    const originX = this.canvas.width - miniW - margin;
    const originY = this.canvas.height - miniH - margin;

    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.fillRect(originX - 6, originY - 22, miniW + 12, miniH + 28);
    ctx.strokeRect(originX - 6, originY - 22, miniW + 12, miniH + 28);

    ctx.fillStyle = '#22d3ee';
    ctx.font = 'bold 10px Consolas, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`MINIMAPA [${map.width}x${map.height}]`, originX - 2, originY - 9);

    ctx.translate(originX, originY);

    ctx.fillStyle = map.palette.bg;
    ctx.fillRect(0, 0, miniW, miniH);

    ctx.fillStyle = map.palette.wallStroke;
    ctx.globalAlpha = 0.45;
    for (const obs of map.obstacles) {
      ctx.fillRect(obs.x * scale, obs.y * scale, obs.w * scale, obs.h * scale);
    }
    ctx.globalAlpha = 1;

    if (this.trashItems && this.trashItems.length > 0) {
      ctx.fillStyle = '#bef264';
      for (const trash of this.trashItems) {
        ctx.fillRect(trash.x * scale - 1.5, trash.y * scale - 1.5, 3, 3);
      }
    }

    if (map.transitionZone) {
      const tz = map.transitionZone;
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(tz.x * scale, tz.y * scale, Math.max(6, tz.w * scale), Math.max(6, tz.h * scale));
    }

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(this.p1.x * scale, this.p1.y * scale, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fb923c';
    ctx.beginPath();
    ctx.arc(this.p2.x * scale, this.p2.y * scale, 4, 0, Math.PI * 2);
    ctx.fill();

    const camX = Math.max(0, this.camera.x * scale);
    const camY = Math.max(0, this.camera.y * scale);
    const camW = Math.min(miniW - camX, this.canvas.width * scale);
    const camH = Math.min(miniH - camY, this.canvas.height * scale);
    ctx.strokeStyle = '#ffca3a';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(camX, camY, camW, camH);

    ctx.restore();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.gameInstance = new Game();
});
