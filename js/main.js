/**
 * js/main.js
 * Motor Principal do Protótipo 2D Top-Down (Sprints 2, 3 e 4).
 * Coordena o Game Loop, Máquina de Estados de Fases, Trava de Câmera/Viewport no Multiplayer,
 * Persistência de Posição Fixa dos Lixos (fixedTrashSpawns + window.collectedTrashIds),
 * Sistema de Ataque (Mouse Direito no Singleplayer; R e 0 no Multiplayer; Gamepad API),
 * Sistema de Dano (takeDamage + Fogo Amigo) e Condições de Derrota (Game Over por HP ou Time Out),
 * e Interfaces Interativas da Safe Room na Van (Mesa de Crafting 8x4 e Lojinha Shop).
 */

class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');

    // Garante bloqueio do menu de contexto padrão do navegador também diretamente no Canvas
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // Estado de Alto Nível: 'MAIN_MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER'
    this.appState = 'MAIN_MENU';
    this.gameOverCause = null;

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

    // Hooks opcionais para o Map Editor
    this.editorFreezeGameplay = false;
    this.editorFreeCamera = false;
    this.onRenderWorldOverlay = null;
    this.onRenderScreenOverlay = null;

    // Maleta Espacial 8x4 (32 slots) exclusiva da Mesa de Crafting na Van (Sprint 4)
    const gridTotal = (window.GameConfig.CRAFTING_GRID_COLS || 8) * (window.GameConfig.CRAFTING_GRID_ROWS || 4);
    this.vanCraftingGrid = new Array(gridTotal).fill(null);

    // Instancia os 2 Personagens em cena
    this.p1 = new window.Player({
      id: 1,
      name: 'Jogador 1',
      role: 'Batedor',
      primaryColor: '#38bdf8',
      secondaryColor: '#0284c7',
      x: this.currentMap.spawnP1.x,
      y: this.currentMap.spawnP1.y,
      inventory: window.GameConfig.createDefaultInventoryP1(),
      onZeroHp: (deadPlayer) => this._handlePlayerZeroHp(deadPlayer)
    });

    this.p2 = new window.Player({
      id: 2,
      name: 'Jogador 2',
      role: 'Suporte',
      primaryColor: '#fb923c',
      secondaryColor: '#ea580c',
      x: this.currentMap.spawnP2.x,
      y: this.currentMap.spawnP2.y,
      inventory: window.GameConfig.createDefaultInventoryP2(),
      onZeroHp: (deadPlayer) => this._handlePlayerZeroHp(deadPlayer)
    });

    this.players = [this.p1, this.p2];
    this.activePlayerIndex = 0; // Usado no Singleplayer (0 = P1, 1 = P2)

    // Entidades de Lixo / Sucata posicionadas em coordenadas fixas no mapa atual
    this.trashItems = [];

    // Lista de textos flutuantes de debug (ex: "-10 HP", "+1 Lixo", avisos de ataque)
    this.floatingTexts = [];

    // Câmera 2D
    this.camera = new window.Camera2D(window.innerWidth, window.innerHeight);

    // Input Manager (Teclado Remapeável + Mouse Direito + Gamepad API)
    this.input = new window.InputManager({
      onSwitchPlayer: () => this.handleSwitchPlayer(),
      onTogglePause: () => this.handlePauseShortcut(),
      onInteract: () => this.handleInteractShortcut(),
      onDebugDamage: (e) => this.handleDebugDamage(e),
      onDebugHeal: (e) => this.handleDebugHeal(e),
      onDebugNextStage: () => this.handleDebugNextStage(),
      onSelectSlot: (slotIndex) => this.selectHotbarSlot(slotIndex, null),
      onCycleSlot: (direction) => this.cycleHotbarSlot(direction),
      onCycleInventoryKey: (direction) => this.cycleHotbarSlot(direction),
      onSingleplayerRightClickAttack: (mousePos) => this.handleSingleplayerRightClickAttack(mousePos),
      onAttackP1Key: (keyCode) => this.handleMultiplayerKeyAttack(1, keyCode),
      onAttackP2Key: (keyCode) => this.handleMultiplayerKeyAttack(2, keyCode),
      onGamepadAttack: (padSlot, padName) => this.handleGamepadAttack(padSlot, padName),
      onGamepadCycleSlot: (padSlot, direction) => this.handleGamepadCycleSlot(padSlot, direction)
    });

    // UI Manager
    this.ui = new window.UIManager(this);

    // Ajuste de Redimensionamento de Tela
    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);
    this._onResize();

    // Inicializa entidades de lixo com posição fixa e câmera no mapa inicial
    this._spawnFixedTrashForMap(this.currentMap);
    const initialTarget = this._getCameraTargetPoint();
    this.camera.snapToTarget(initialTarget.x, initialTarget.y, this.currentMap);

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

  getControlledPlayers() {
    if (this.gameMode === 'singleplayer') {
      return [this.players[this.activePlayerIndex]];
    }
    return this.players;
  }

  isStationModalOpen() {
    if (!this.ui) return false;
    return (
      this.ui.isCraftingModalOpen() ||
      this.ui.isShopModalOpen() ||
      this.ui.isSettingsModalOpen()
    );
  }

  /**
   * Inicia uma nova partida a partir do Menu Principal carregando o Mapa 1
   */
  startNewGame() {
    this.p1.hp = this.p1.maxHp;
    this.p2.hp = this.p2.maxHp;
    this.p1.bonusDamage = 0;
    this.p2.bonusDamage = 0;
    this.p1.inventory = window.GameConfig.createDefaultInventoryP1();
    this.p2.inventory = window.GameConfig.createDefaultInventoryP2();
    this.p1.selectedSlot = 0;
    this.p2.selectedSlot = 0;
    this.activePlayerIndex = 0;
    this.floatingTexts = [];

    this.loadStageByFlowIndex(0);
    this.appState = 'PLAYING';
    this.gameOverCause = null;
    this.ui.showGameplayHUD();
    this.ui.showToast(
      `Partida iniciada em modo ${this.gameMode === 'singleplayer' ? 'Singleplayer (Botão Direito Ataca)' : 'Multiplayer Local (P1: R | P2: 0)'}!`
    );
  }

  /**
   * Carrega um estado específico da máquina de estados de fases:
   * 0: Mapa 1 -> 1: Van -> 2: Mapa 2 -> 3: Van -> 4: Mapa 3
   * Respeita o estado global window.collectedTrashIds para nunca respawnar lixos já coletados.
   */
  loadStageByFlowIndex(flowIndex) {
    const flowList = window.GameConfig.STAGE_FLOW;
    this.stageFlowIndex = ((flowIndex % flowList.length) + flowList.length) % flowList.length;

    const stageMeta = this.getCurrentStageMeta();
    this.currentMap = window.GameMaps[stageMeta.mapKey];

    // Posiciona ambos os personagens nos pontos de spawn do mapa atual
    this.p1.setPosition(this.currentMap.spawnP1.x, this.currentMap.spawnP1.y);
    this.p2.setPosition(this.currentMap.spawnP2.x, this.currentMap.spawnP2.y);

    // Reseta o Timer da Fase (180s = 03:00) e carrega Lixo de coordenadas fixas nos 3 mapas grandes
    if (!stageMeta.isSafeRoom) {
      this.stageTimeRemaining = window.GameConfig.STAGE_DURATION_SECONDS;
      this._spawnFixedTrashForMap(this.currentMap);
    } else {
      this.trashItems = [];
      if (Array.isArray(this.currentMap.customTrash) && this.currentMap.customTrash.length > 0) {
        this._spawnCustomTrashForMap(this.currentMap);
      }
    }

    this.zoneHoldTimer = 0;
    this.input.clearAll();

    if (this.ui) {
      this.ui.closeCraftingModal();
      this.ui.closeShopModal();
    }

    const camTarget = this._getCameraTargetPoint();
    this.camera.snapToTarget(camTarget.x, camTarget.y, this.currentMap);

    this.ui.updateHUD();
  }

  /**
   * Spawna os itens de Lixo nas coordenadas fixas (hardcoded) definidas em `map.fixedTrashSpawns`,
   * filtrando quaisquer IDs já registrados em `window.collectedTrashIds` para que nunca reapareçam.
   */
  _spawnFixedTrashForMap(map) {
    this.trashItems = [];
    if (!map) return;

    const collectedSet = window.collectedTrashIds || (window.collectedTrashIds = new Set());
    const types = window.GameConfig.TRASH_TYPES;

    // 1. Coordenadas fixas predefinidas em cada um dos 3 mapas grandes
    if (Array.isArray(map.fixedTrashSpawns)) {
      map.fixedTrashSpawns.forEach((spawnDef, idx) => {
        const trashId = spawnDef.id || `fixed_${map.id}_${idx}`;
        if (collectedSet.has(trashId)) {
          return; // Já foi coletado anteriormente: não reaparece!
        }

        const typeIdx = typeof spawnDef.typeIndex === 'number' ? spawnDef.typeIndex : idx;
        const typeInfo = types[typeIdx % types.length];

        this.trashItems.push(
          new window.TrashItem({
            id: trashId,
            x: spawnDef.x,
            y: spawnDef.y,
            typeInfo,
            rotation: ((idx % 5) - 2) * 0.14,
            bobPhase: idx * 0.65
          })
        );
      });
    }

    // 2. Suporte adicional caso o usuário tenha adicionado itens pelo Map Editor
    this._spawnCustomTrashForMap(map);
  }

  _spawnCustomTrashForMap(map) {
    if (!Array.isArray(map.customTrash)) return;
    const collectedSet = window.collectedTrashIds || (window.collectedTrashIds = new Set());
    const types = window.GameConfig.TRASH_TYPES;

    map.customTrash.forEach((ct, idx) => {
      const trashId = ct.id || `custom_trash_${map.id}_${idx}`;
      if (collectedSet.has(trashId)) return;

      const typeInfo = types.find((t) => t.id === ct.typeId) || types[idx % types.length];
      this.trashItems.push(
        new window.TrashItem({
          id: trashId,
          x: ct.x,
          y: ct.y,
          size: ct.size || window.GameConfig.TRASH_SIZE || 26,
          typeInfo,
          sprite: ct.sprite || null,
          rotation: ct.rotation || 0,
          bobPhase: ct.bobPhase || 0,
          isCustomPlaced: true
        })
      );
    });
  }

  _boxesOverlap(a, b) {
    return (
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y
    );
  }

  // =========================================================================
  // SISTEMA DE DANO, MORTE POR HP E MORTE POR TEMPO (GAME OVER - SPRINT 4)
  // =========================================================================
  _handlePlayerZeroHp(deadPlayer) {
    if (this.appState === 'GAME_OVER') return;
    const causeMsg = 'Você Morreu';
    const detailMsg = `${deadPlayer.name} chegou a 0 HP! A partida foi encerrada imediatamente.`;
    this.triggerGameOver(causeMsg, detailMsg);
  }

  triggerGameOver(titleText = 'Você Morreu', subtitleText = '') {
    if (this.appState === 'GAME_OVER') return;
    this.appState = 'GAME_OVER';
    this.gameOverCause = titleText;
    this.input.clearAll();
    console.log(`💀 [GAME OVER] ${titleText} — ${subtitleText}`);
    this.ui.updateHUD();
    this.ui.showGameOver(titleText, subtitleText);
  }

  /**
   * Reinicia a fase atual (via botão "Reiniciar Fase" do Game Over ou do Menu de Pausa):
   * Restaura o timer, enche o HP de ambos e os coloca de volta no spawn do mapa atual,
   * mantendo os lixos já coletados registrados em window.collectedTrashIds.
   */
  restartCurrentStage() {
    this.p1.hp = this.p1.maxHp;
    this.p2.hp = this.p2.maxHp;
    this.floatingTexts = [];
    this.appState = 'PLAYING';
    this.gameOverCause = null;

    this.loadStageByFlowIndex(this.stageFlowIndex);
    this.ui.hideGameOver();
    this.ui.showPauseMenu(false);
    this.ui.updateHUD();
    this.ui.showToast('Fase reiniciada! HP restaurado (100/100), Timer resetado e lixos coletados preservados.');
  }

  returnToMainMenu() {
    this.appState = 'MAIN_MENU';
    this.gameOverCause = null;
    this.input.clearAll();
    this.ui.showMainMenu();
  }

  // =========================================================================
  // SISTEMA DE ATAQUE E FOGO AMIGO (SPRINTS 3 & 4)
  // =========================================================================
  /**
   * Modo Singleplayer: O ataque é acionado exclusivamente pelo Botão Direito do Mouse,
   * direcionado para a posição atual do cursor na tela.
   */
  handleSingleplayerRightClickAttack(mousePos) {
    if (this.appState !== 'PLAYING' || this.isStationModalOpen()) return;
    if (this.gameMode !== 'singleplayer') return;

    const attacker = this.players[this.activePlayerIndex];
    const targetPlayer = this.players[this.activePlayerIndex === 0 ? 1 : 0];

    const rect = this.canvas.getBoundingClientRect();
    const screenX = (mousePos ? mousePos.clientX : this.input.mouseX) - rect.left;
    const screenY = (mousePos ? mousePos.clientY : this.input.mouseY) - rect.top;

    // Converte coordenada da tela para coordenada do mundo
    const worldX = screenX + this.camera.x;
    const worldY = screenY + this.camera.y;

    const aimVector = {
      dx: worldX - attacker.x,
      dy: worldY - attacker.y
    };

    this._executePlayerAttack(attacker, targetPlayer, aimVector, 'Botão Direito do Mouse (Singleplayer)');
  }

  /**
   * Modo Multiplayer Local:
   * - Jogador 1 ataca usando a tecla configurada em `Config.Controls.attackP1` (padrão `KeyR`)
   * - Jogador 2 ataca usando a tecla configurada em `Config.Controls.attackP2` (padrão `Digit0`)
   */
  handleMultiplayerKeyAttack(playerId, keyCode) {
    if (this.appState !== 'PLAYING' || this.isStationModalOpen()) return;

    if (this.gameMode !== 'multiplayer') {
      this.ui.showToast('No modo Singleplayer, ataque com o Botão Direito do Mouse na direção do cursor!', 1600);
      return;
    }

    const attacker = playerId === 1 ? this.p1 : this.p2;
    const targetPlayer = playerId === 1 ? this.p2 : this.p1;
    const label = `Tecla [${window.Config.formatKeyCode(keyCode)}] (Multiplayer P${playerId})`;

    this._executePlayerAttack(attacker, targetPlayer, null, label);
  }

  /**
   * Ataque acionado via Gamepad API (Botões de Face X / Quadrado)
   */
  handleGamepadAttack(padSlot, padName) {
    if (this.appState !== 'PLAYING' || this.isStationModalOpen()) return;

    let attacker;
    let targetPlayer;
    if (this.gameMode === 'singleplayer') {
      attacker = this.players[this.activePlayerIndex];
      targetPlayer = this.players[this.activePlayerIndex === 0 ? 1 : 0];
    } else {
      attacker = padSlot === 2 ? this.p2 : this.p1;
      targetPlayer = padSlot === 2 ? this.p1 : this.p2;
    }

    this._executePlayerAttack(attacker, targetPlayer, null, `Gamepad (${padName})`);
  }

  /**
   * Navegação de inventário via Gatilhos Superiores do Gamepad (Bumpers L1 / R1)
   */
  handleGamepadCycleSlot(padSlot, direction) {
    if (this.appState !== 'PLAYING' || this.isStationModalOpen()) return;

    const player = this.gameMode === 'multiplayer'
      ? (padSlot === 2 ? this.p2 : this.p1)
      : this.getHudFocusPlayer();

    const len = player.inventory.length;
    player.selectedSlot = (player.selectedSlot + direction + len) % len;
    this.ui.renderHotbar();
  }

  /**
   * Executa o ataque de `attacker`, gera o log no console, exibe feedback visual e
   * aplica Fogo Amigo (`takeDamage`) caso `window.friendlyFireEnabled` esteja ativo e acerte a hitbox do outro jogador.
   */
  _executePlayerAttack(attacker, otherPlayer, aimVector, sourceLabel) {
    const hitbox = attacker.triggerAttack(aimVector, sourceLabel);
    if (!hitbox) return;

    const item = attacker.getEquippedItem();
    const itemName = item && !item.isEmpty ? item.name : 'Golpe Corpo-a-Corpo';
    const dmg = attacker.getAttackDamage();

    console.log(
      `⚔️ [ATAQUE] ${attacker.name} (P${attacker.id}) atacou! | Fonte: ${sourceLabel} | Arma/Item: ${itemName} | Dano Base: ${dmg} | Direção: ${hitbox.angleDeg}° | Hitbox: (${Math.round(hitbox.x)}, ${Math.round(hitbox.y)}, ${hitbox.w}x${hitbox.h})`
    );

    this.floatingTexts.push(
      new window.FloatingText(
        hitbox.centerX,
        hitbox.y - 6,
        `⚔️ ATK P${attacker.id}`,
        attacker.primaryColor,
        0.55
      )
    );

    // Verifica colisão da hitbox de ataque com a hitbox do outro personagem
    if (otherPlayer && this._boxesOverlap(hitbox, otherPlayer.getBoundingBox())) {
      if (window.friendlyFireEnabled) {
        this.camera.triggerShake(0.18, 6);
        this.floatingTexts.push(
          new window.FloatingText(
            otherPlayer.x,
            otherPlayer.y - 36,
            `-${dmg} HP [FOGO AMIGO]`,
            '#ff4d4d',
            1.1
          )
        );
        console.log(
          `🔥 [FOGO AMIGO] ${attacker.name} acertou ${otherPlayer.name} causando -${dmg} HP!`
        );
        otherPlayer.takeDamage(dmg);
        this.ui.updateHUD();
      } else {
        this.floatingTexts.push(
          new window.FloatingText(
            otherPlayer.x,
            otherPlayer.y - 34,
            `Fogo Amigo: OFF`,
            '#94a3b8',
            0.75
          )
        );
        console.log(
          `🛡️ [ATAQUE] Hitbox atingiu ${otherPlayer.name}, mas friendlyFireEnabled está OFF.`
        );
      }
    }
  }

  /**
   * Alterna entre Personagem 1 e Personagem 2 com a tecla configurada (padrão Tab) no Singleplayer
   */
  handleSwitchPlayer() {
    if (this.appState !== 'PLAYING' || this.isStationModalOpen()) return;

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
   * Pausa / Despausa a partida (Atalho: Esc ou P)
   */
  handlePauseShortcut() {
    if (this.appState === 'GAME_OVER') return;

    // Se algum modal de Configurações, Crafting ou Loja estiver aberto, fecha-o primeiro
    if (this.ui.isSettingsModalOpen()) {
      this.ui.closeSettingsModal();
      return;
    }
    if (this.ui.isCraftingModalOpen()) {
      this.ui.closeCraftingModal();
      return;
    }
    if (this.ui.isShopModalOpen()) {
      this.ui.closeShopModal();
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
    if (this.appState === 'GAME_OVER') return;
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
   * Interação com Estações da Safe Room (Lojinha / Crafting) ou Zona de Extração / Porta da Van (Teclas E ou Espaço)
   */
  handleInteractShortcut() {
    if (this.appState !== 'PLAYING') return;
    if (this.isStationModalOpen()) return;

    // 1. Verifica primeiro se um jogador controlado está na Zona de Extração / Porta da Van
    if (this.isAnyPlayerInTransitionZone()) {
      this.advanceToNextStage('Interação na Zona de Saída');
      return;
    }

    // 2. Verifica se algum jogador está encostando na Lojinha ou na Mesa de Craft da Safe Room
    const touchedStation = this.getTouchedSafeRoomStation();
    if (touchedStation) {
      if (touchedStation.id === 'crafting') {
        this.ui.openCraftingModal();
        return;
      }
      if (touchedStation.id === 'shop') {
        this.ui.openShopModal();
        return;
      }
    }

    const zoneName = this.getCurrentStageMeta().isSafeRoom
      ? 'a Porta da Van (ou das estações de Loja/Craft)'
      : 'a Zona de Extração';
    this.ui.showToast(`Aproxime-se d${zoneName} para interagir!`, 1600);
  }

  /**
   * Atalho de Debug [H]: Causa -10 de dano no personagem em foco (Shift+H no Multiplayer afeta P2)
   */
  handleDebugDamage(e) {
    if (this.appState !== 'PLAYING' && this.appState !== 'PAUSED') return;
    if (this.ui && this.ui.isSettingsModalOpen()) return;

    const target = (this.gameMode === 'multiplayer' && e && e.shiftKey)
      ? this.p2
      : this.getHudFocusPlayer();

    this.camera.triggerShake(0.16, 5);
    this.floatingTexts.push(
      new window.FloatingText(target.x, target.y - 36, '-10 HP [DEBUG]', '#ff4d4d')
    );

    target.takeDamage(10);

    this.ui.updateHUD();
    if (this.appState === 'PAUSED') {
      this.ui.updatePauseInventoryPanel();
    }
    if (this.appState !== 'GAME_OVER') {
      this.ui.showToast(`[DEBUG Tecla H] -10 HP em ${target.name} (${target.hp}/${target.maxHp} HP)`, 1600);
    }
  }

  /**
   * Atalho Extra de Debug [J]: Cura +20 HP no personagem em foco (Shift+J no Multiplayer afeta P2)
   */
  handleDebugHeal(e) {
    if (this.appState !== 'PLAYING' && this.appState !== 'PAUSED') return;
    if (this.ui && this.ui.isSettingsModalOpen()) return;

    const target = (this.gameMode === 'multiplayer' && e && e.shiftKey)
      ? this.p2
      : this.getHudFocusPlayer();

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

  handleDebugNextStage() {
    if (this.appState !== 'PLAYING' || this.isStationModalOpen()) return;
    this.advanceToNextStage('Atalho de Debug [N]');
  }

  advanceToNextStage(reason = '') {
    const totalStages = window.GameConfig.STAGE_FLOW.length;
    const nextIndex = (this.stageFlowIndex + 1) % totalStages;
    const wrappedCycle = this.stageFlowIndex === totalStages - 1;

    this.loadStageByFlowIndex(nextIndex);
    const meta = this.getCurrentStageMeta();

    if (wrappedCycle) {
      this.ui.showToast(`Ciclo de 3 Mapas concluído! Reiniciando no ${meta.label}`);
    } else {
      this.ui.showToast(`Avançou (${reason}) → ${meta.label}`);
    }
  }

  selectHotbarSlot(slotIndex, targetPlayerId = null) {
    if (this.appState !== 'PLAYING' || this.isStationModalOpen()) return;

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

  cycleHotbarSlot(direction) {
    if (this.appState !== 'PLAYING' || this.isStationModalOpen()) return;

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
   * Loop Principal do Jogo (`requestAnimationFrame`)
   */
  _gameLoop(timestamp) {
    const dt = Math.min(0.05, (timestamp - this.lastTimestamp) / 1000);
    this.lastTimestamp = timestamp;

    // 0. Polling nativo de Joysticks via Gamepad API dentro do requestAnimationFrame
    this.input.pollGamepads();

    if (this.appState === 'PLAYING') {
      this.elapsedTime += dt;
      this._updateGameplay(dt);
    } else if (this.ui.isSettingsModalOpen() && this.ui.activeSettingsTab === 'controls') {
      this.ui.updateGamepadStatusBanner();
    }

    this._renderScene();

    requestAnimationFrame((ts) => this._gameLoop(ts));
  }

  _updateGameplay(dt) {
    if (this.appState !== 'PLAYING') return;

    // Se a Mesa de Crafting, Lojinha ou Configurações estiverem abertas, congela movimentação e timer
    if (this.isStationModalOpen()) {
      this.ui.updateHUD();
      return;
    }

    // 1. Movimentação dos Personagens conforme o Modo Selecionado
    if (!this.editorFreeCamera) {
      if (this.gameMode === 'singleplayer') {
        const p1Vec = this.input.getP1Vector();
        const activePlayer = this.players[this.activePlayerIndex];
        const inactivePlayer = this.players[this.activePlayerIndex === 0 ? 1 : 0];

        activePlayer.update(dt, p1Vec, this.currentMap, null);
        inactivePlayer.update(dt, { dx: 0, dy: 0 }, this.currentMap, null);

        const camTarget = this._getCameraTargetPoint();
        this.camera.update(dt, camTarget.x, camTarget.y, this.currentMap, null);
      } else {
        const p1Vec = this.input.getP1Vector();
        const p2Vec = this.input.getP2Vector();

        this._updateMultiplayerWithViewportClamp(dt, p1Vec, p2Vec);
      }
    }

    // 2. Coleta de Lixo / Sucata pelo chão dos 3 Mapas Grandes (com registro em window.collectedTrashIds)
    if (!this.editorFreezeGameplay) {
      this._checkTrashCollection();
    }

    // 3. Cronômetro da Fase (Morte por Tempo / Time Out se chegar a 00:00 -> Game Over imediato)
    const stageMeta = this.getCurrentStageMeta();
    if (!stageMeta.isSafeRoom && !this.editorFreezeGameplay) {
      this.stageTimeRemaining = Math.max(0, this.stageTimeRemaining - dt);
      if (this.stageTimeRemaining <= 0) {
        // Ambos os personagens morrem instantaneamente quando o cronômetro chega a 00:00
        this.p1.hp = 0;
        this.p2.hp = 0;
        this.triggerGameOver(
          'Tempo Esgotado',
          'O cronômetro da fase chegou a 00:00 e ambos os operadores morreram instantaneamente.'
        );
        return;
      }
    }

    // 4. Verificação da Zona de Extração / Porta da Van (Auto-embarque ao permanecer na zona)
    if (!this.editorFreezeGameplay && this.isAnyPlayerInTransitionZone()) {
      this.zoneHoldTimer += dt;
      if (this.zoneHoldTimer >= this.zoneHoldDuration) {
        this.advanceToNextStage('Zona de Transição concluída');
        return;
      }
    } else {
      this.zoneHoldTimer = Math.max(0, this.zoneHoldTimer - dt * 2);
    }

    // 5. Atualiza Textos Flutuantes
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      this.floatingTexts[i].update(dt);
      if (this.floatingTexts[i].life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }

    // 6. Atualiza a HUD
    this.ui.updateHUD();
  }

  /**
   * Atualiza a movimentação de P1 e P2 no Multiplayer Local aplicando o Clamp de Viewport:
   * Se um personagem tentar se afastar além dos limites visíveis da câmera (Viewport),
   * sua movimentação naquela direção é bloqueada para que nenhum jogador saia da tela.
   */
  _updateMultiplayerWithViewportClamp(dt, p1Vec, p2Vec) {
    const map = this.currentMap;
    const pad = this.p1.size / 2 + 4;

    const maxSpanX = Math.max(80, Math.min(map.width, this.camera.viewportWidth) - pad * 2);
    const maxSpanY = Math.max(80, Math.min(map.height, this.camera.viewportHeight) - pad * 2);

    const p1InwardX = (this.p1.x < this.p2.x && p1Vec.dx > 0) || (this.p1.x > this.p2.x && p1Vec.dx < 0);
    const p2InwardX = (this.p2.x < this.p1.x && p2Vec.dx > 0) || (this.p2.x > this.p1.x && p2Vec.dx < 0);
    const p1InwardY = (this.p1.y < this.p2.y && p1Vec.dy > 0) || (this.p1.y > this.p2.y && p1Vec.dy < 0);
    const p2InwardY = (this.p2.y < this.p1.y && p2Vec.dy > 0) || (this.p2.y > this.p1.y && p2Vec.dy < 0);

    const p1Inward = p1InwardX || p1InwardY;
    const p2Inward = p2InwardX || p2InwardY;

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

    if (p2Inward && !p1Inward) {
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
      let clampedX = player.x;
      let clampedY = player.y;

      if (player.x < finalBounds.minX + pad) {
        clampedX = finalBounds.minX + pad;
        player.clampedByViewport = true;
      } else if (player.x > finalBounds.maxX - pad) {
        clampedX = finalBounds.maxX - pad;
        player.clampedByViewport = true;
      }

      if (player.y < finalBounds.minY + pad) {
        clampedY = finalBounds.minY + pad;
        player.clampedByViewport = true;
      } else if (player.y > finalBounds.maxY - pad) {
        clampedY = finalBounds.maxY - pad;
        player.clampedByViewport = true;
      }

      // Só aplica o deslocamento pós-câmera se não empurrar o jogador para dentro de uma parede sólida
      if (clampedX !== player.x) {
        const testBoxX = player.getBoundingBox(clampedX, player.y);
        const hitsWallX = map.obstacles.some((obs) => !obs.noCollision && this._boxesOverlap(testBoxX, obs));
        if (!hitsWallX) player.x = clampedX;
      }
      if (clampedY !== player.y) {
        const testBoxY = player.getBoundingBox(player.x, clampedY);
        const hitsWallY = map.obstacles.some((obs) => !obs.noCollision && this._boxesOverlap(testBoxY, obs));
        if (!hitsWallY) player.y = clampedY;
      }
    }
  }

  /**
   * Verifica se algum jogador passou por cima ou encostou em um objeto "Lixo",
   * removendo-o do mapa, registrando seu ID em `window.collectedTrashIds` para persistência
   * e incrementando o contador global `window.scrapCollected`.
   */
  _checkTrashCollection() {
    if (!this.trashItems || this.trashItems.length === 0) return;

    const collectedSet = window.collectedTrashIds || (window.collectedTrashIds = new Set());

    for (let i = this.trashItems.length - 1; i >= 0; i--) {
      const trash = this.trashItems[i];
      const trashBox = trash.getBoundingBox();

      const collectedByP1 = this.p1.isTouchingZone(trashBox);
      const collectedByP2 = !collectedByP1 && this.p2.isTouchingZone(trashBox);

      if (collectedByP1 || collectedByP2) {
        this.trashItems.splice(i, 1);
        if (trash.id) {
          collectedSet.add(trash.id);
        }
        window.scrapCollected = (window.scrapCollected || 0) + 1;

        console.log(
          `♻ [Lixo Coletado] ID="${trash.id}" (${trash.typeInfo.name}) em (${trash.x}, ${trash.y}) | Total Global: ${window.scrapCollected}`
        );

        this.floatingTexts.push(
          new window.FloatingText(
            trash.x,
            trash.y - 18,
            `+1 ${trash.typeInfo.name} [Sucata: ${window.scrapCollected}]`,
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
    const hideDebug = Boolean(window.hideDebugOverlays);

    ctx.fillStyle = '#090d14';
    ctx.fillRect(0, 0, viewW, viewH);

    ctx.save();
    const { offsetX, offsetY } = this.camera.getRenderOffset();
    ctx.translate(offsetX, offsetY);

    // 1. Piso Base do Mapa
    ctx.fillStyle = map.palette.bg;
    ctx.fillRect(0, 0, map.width, map.height);

    // 2. Grid de Referência no Chão
    if (!hideDebug) {
      this._drawDebugGrid(ctx, map);
    }

    // 3. Trilhas / Zonas de Piso
    this._drawFloorZones(ctx, map);

    // 4. Áreas Demarcadas das Estações da Safe Room (Lojinha e Mesa de Craft)
    this._drawSafeRoomStationsZones(ctx, map);

    // 5. Marcadores de Spawn P1/P2
    if (!hideDebug) {
      this._drawSpawnMarkers(ctx, map);
    }

    // 6. Zona de Extração / Transição
    this._drawTransitionZone(ctx, map, hideDebug);

    // 7. Entidades Coletáveis de "Lixo / Sucata" no Chão
    this._drawTrashItems(ctx);

    // 8. Caixas de Colisão / Sprites para Paredes, Estruturas, Props e Estações da Van
    this._drawObstacles(ctx, map, hideDebug);

    // 9. Linha de Ponto Médio e Moldura de Limite da Câmera (no modo Multiplayer Local)
    if (!hideDebug && this.gameMode === 'multiplayer') {
      this._drawMultiplayerMidpointDebug(ctx);
    }

    // 10. Personagens 1 e 2 (Ordenados por Y para profundidade Top-Down)
    const sortedPlayers = [...this.players].sort((a, b) => a.y - b.y);
    for (const player of sortedPlayers) {
      const isControlled =
        this.gameMode === 'multiplayer' ||
        this.players[this.activePlayerIndex].id === player.id;
      player.draw(ctx, isControlled, this.gameMode, this.elapsedTime);
    }

    // 11. Balão/Texto Flutuante de Interação nas Estações da Safe Room (Loja / Craft)
    this._drawSafeRoomStationFloatingNotice(ctx, map);

    // 12. Textos Flutuantes de Debug (-10 HP, +1 Lixo, etc.)
    for (const ft of this.floatingTexts) {
      ft.draw(ctx);
    }

    // Hook de Overlay no Espaço do Mundo para o Map Editor
    if (typeof this.onRenderWorldOverlay === 'function') {
      this.onRenderWorldOverlay(ctx, map);
    }

    ctx.restore();

    if (this.appState === 'PLAYING' || this.appState === 'PAUSED' || this.appState === 'GAME_OVER') {
      this._drawExtractionCompass(ctx);
      if (!hideDebug) {
        this._drawDebugMinimap(ctx);
      }
    }

    // Hook de Overlay no Espaço de Tela para o Map Editor
    if (typeof this.onRenderScreenOverlay === 'function') {
      this.onRenderScreenOverlay(ctx, map);
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

  _drawTransitionZone(ctx, map, hideDebug = false) {
    const z = map.transitionZone;
    if (!z) return;

    const pulse = 0.5 + 0.5 * Math.sin(this.elapsedTime * 5);

    ctx.save();
    const drewSprite = z.sprite && window.SpriteCache
      ? window.SpriteCache.draw(ctx, z.sprite, z.x, z.y, z.w, z.h, z.spriteFit || 'stretch')
      : false;

    if (!drewSprite) {
      ctx.fillStyle = z.fillColor;
      ctx.fillRect(z.x, z.y, z.w, z.h);
    }

    if (!hideDebug || !drewSprite) {
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
    }

    if (this.zoneHoldTimer > 0) {
      const centerX = z.x + z.w / 2;
      const centerY = z.y + z.h / 2;
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

  _drawObstacles(ctx, map, hideDebug = false) {
    ctx.save();
    for (const obs of map.obstacles) {
      const drewSprite = obs.sprite && window.SpriteCache
        ? window.SpriteCache.draw(ctx, obs.sprite, obs.x, obs.y, obs.w, obs.h, obs.spriteFit || 'stretch')
        : false;

      if (!drewSprite) {
        ctx.fillStyle = obs.customFill || map.palette.wallFill;
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
      }

      if (!hideDebug) {
        ctx.strokeStyle = obs.noCollision
          ? 'rgba(148, 163, 184, 0.55)'
          : (obs.customStroke || map.palette.wallStroke);
        ctx.lineWidth = obs.customStroke ? 2.5 : 2;
        if (obs.noCollision) ctx.setLineDash([4, 4]);
        ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
        if (obs.noCollision) ctx.setLineDash([]);

        if (!drewSprite && !obs.noCollision) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = 1;
          ctx.moveTo(obs.x, obs.y);
          ctx.lineTo(obs.x + obs.w, obs.y + obs.h);
          ctx.moveTo(obs.x + obs.w, obs.y);
          ctx.lineTo(obs.x, obs.y + obs.h);
          ctx.stroke();
        }

        if (obs.w >= 90 && obs.h >= 50) {
          ctx.fillStyle = '#f8fafc';
          ctx.font = 'bold 11px Consolas, monospace';
          ctx.textAlign = 'center';
          ctx.fillText(obs.label || (obs.noCollision ? 'PROP' : 'COLISÃO'), obs.x + obs.w / 2, obs.y + obs.h / 2 - 4);

          ctx.fillStyle = obs.customStroke || 'rgba(226, 232, 240, 0.65)';
          ctx.font = '10px Consolas, monospace';
          ctx.fillText(
            obs.subTag || `[${obs.w}x${obs.h}px]`,
            obs.x + obs.w / 2,
            obs.y + obs.h / 2 + 12
          );
        }
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

window.Game = Game;

window.addEventListener('DOMContentLoaded', () => {
  window.gameInstance = new Game();
});
