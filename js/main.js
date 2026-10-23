/**
 * js/main.js
 * Motor Principal do Protótipo 2D Top-Down (Debug / Developer Mode).
 * Coordena o Game Loop, Máquina de Estados de Fases, Renderização de Debug no Canvas,
 * Sistema de Câmera, Alternância de Personagens e Atalhos de Desenvolvedor.
 */

class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');

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
    this.zoneHoldDuration = 1.15; // Segundos encostando para ativar automaticamente

    // Instancia os 2 Personagens em cena
    this.p1 = new window.Player({
      id: 1,
      name: 'Personagem 1',
      role: 'Batedor',
      primaryColor: '#38bdf8',
      secondaryColor: '#0284c7',
      inventory: window.GameConfig.createDefaultInventoryP1()
    });

    this.p2 = new window.Player({
      id: 2,
      name: 'Personagem 2',
      role: 'Suporte',
      primaryColor: '#fb923c',
      secondaryColor: '#ea580c',
      inventory: window.GameConfig.createDefaultInventoryP2()
    });

    this.players = [this.p1, this.p2];
    this.activePlayerIndex = 0; // Usado no Singleplayer (0 = P1, 1 = P2)

    // Lista de textos flutuantes de debug (ex: "-10 HP")
    this.floatingTexts = [];

    // Câmera 2D
    this.camera = new window.Camera2D(window.innerWidth, window.innerHeight);

    // Input Manager
    this.input = new window.InputManager({
      onSwitchPlayer: () => this.handleSwitchPlayer(),
      onTogglePause: () => this.handlePauseShortcut(),
      onInteract: () => this.handleInteractShortcut(),
      onDebugDamage: () => this.handleDebugDamage(),
      onDebugHeal: () => this.handleDebugHeal(),
      onDebugNextStage: () => this.handleDebugNextStage(),
      onSelectSlot: (slotIndex) => this.selectHotbarSlot(slotIndex),
      onCycleSlot: (direction) => this.cycleHotbarSlot(direction)
    });

    // UI Manager
    this.ui = new window.UIManager(this);

    // Ajuste de Redimensionamento de Tela
    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);
    this._onResize();

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
   * Inicia uma nova partida a partir do Menu Principal carregando o Mapa 1
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
    this.ui.showToast(
      `Partida iniciada em modo ${this.gameMode === 'singleplayer' ? 'Singleplayer (Tab alterna)' : 'Multiplayer Local'}!`
    );
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

    // Reseta o Timer da Fase (180s = 03:00) ao entrar em um mapa grande
    if (!stageMeta.isSafeRoom) {
      this.stageTimeRemaining = window.GameConfig.STAGE_DURATION_SECONDS;
    }

    this.zoneHoldTimer = 0;
    this.input.clearAll();

    // Posiciona a câmera imediatamente no foco inicial
    const camTarget = this._getCameraTargetPoint();
    this.camera.snapToTarget(camTarget.x, camTarget.y, this.currentMap);

    this.ui.updateHUD();
  }

  /**
   * Reinicia a fase atual (via Menu de Pausa ou quando o timer zera)
   */
  restartCurrentStage() {
    this.p1.hp = this.p1.maxHp;
    this.p2.hp = this.p2.maxHp;
    this.loadStageByFlowIndex(this.stageFlowIndex);
    this.togglePause(false);
    this.ui.showToast('Fase atual reiniciada! Posições e Timer restaurados.');
  }

  /**
   * Retorna ao Menu Principal encerrando a partida atual
   */
  returnToMainMenu() {
    this.appState = 'MAIN_MENU';
    this.input.clearAll();
    this.ui.showMainMenu();
  }

  /**
   * Alterna entre Personagem 1 e Personagem 2 com a tecla Tab (no Singleplayer)
   */
  handleSwitchPlayer() {
    if (this.appState !== 'PLAYING') return;

    if (this.gameMode !== 'singleplayer') {
      this.ui.showToast('Modo Multiplayer Local ativo: ambos os personagens já estão liberados!');
      return;
    }

    this.activePlayerIndex = this.activePlayerIndex === 0 ? 1 : 0;
    const active = this.players[this.activePlayerIndex];

    this.floatingTexts.push(
      new window.FloatingText(active.x, active.y - 42, `▼ CONTROLE ATIVO`, '#ffca3a')
    );

    this.ui.renderHotbar();
    this.ui.updateHUD();
    this.ui.showToast(`Controle alternado para ${active.name} [Tab]`, 1400);
  }

  /**
   * Pausa / Despausa a partida (Atalho: Esc ou P)
   */
  handlePauseShortcut() {
    if (this.appState === 'MAIN_MENU') {
      // Se o modal de configurações estiver aberto, fecha-o com Esc
      this.ui.settingsModalOverlay.classList.add('hidden');
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
   * Interação com Zona de Extração ou Porta da Van (Teclas E ou Espaço)
   */
  handleInteractShortcut() {
    if (this.appState !== 'PLAYING') return;

    if (this.isAnyPlayerInTransitionZone()) {
      this.advanceToNextStage('Interação na Zona de Saída');
    } else {
      const zoneName = this.getCurrentStageMeta().isSafeRoom
        ? 'a Porta da Van'
        : 'a Zona de Extração';
      this.ui.showToast(`Aproxime-se d${zoneName} para avançar de mapa!`, 1600);
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
    this.ui.showToast(`[DEBUG Tecla H] -10 HP em ${target.name} (${target.hp}/${target.maxHp} HP)`, 1600);
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
    this.ui.showToast(`[DEBUG Tecla J] +20 HP em ${target.name} (${target.hp}/${target.maxHp} HP)`, 1600);
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
      this.ui.showToast(`Ciclo de 3 Mapas concluído! Reiniciando no ${meta.label}`);
    } else {
      this.ui.showToast(`Avançou (${reason}) → ${meta.label}`);
    }
  }

  /**
   * Seleção de Slot da Hotbar (Teclas 1-6 ou Clique)
   */
  selectHotbarSlot(slotIndex) {
    if (this.appState !== 'PLAYING') return;
    const player = this.getHudFocusPlayer();
    if (slotIndex < 0 || slotIndex >= player.inventory.length) return;

    player.selectedSlot = slotIndex;
    this.ui.renderHotbar();
  }

  /**
   * Alternância de Slot da Hotbar via Scroll do Mouse
   */
  cycleHotbarSlot(direction) {
    if (this.appState !== 'PLAYING') return;
    const player = this.getHudFocusPlayer();
    const len = player.inventory.length;
    player.selectedSlot = (player.selectedSlot + direction + len) % len;
    this.ui.renderHotbar();
  }

  /**
   * Verifica se pelo menos um personagem está dentro da Zona de Extração / Porta da Van
   */
  isAnyPlayerInTransitionZone() {
    const zone = this.currentMap.transitionZone;
    if (!zone) return false;
    return this.p1.isTouchingZone(zone) || this.p2.isTouchingZone(zone);
  }

  /**
   * Calcula o ponto-alvo da câmera conforme o modo de jogo:
   * - Singleplayer: segue o personagem ativo
   * - Multiplayer Local: ponto médio entre P1 e P2
   */
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
   * Loop Principal do Jogo
   */
  _gameLoop(timestamp) {
    const dt = Math.min(0.05, (timestamp - this.lastTimestamp) / 1000);
    this.lastTimestamp = timestamp;
    this.elapsedTime += dt;

    if (this.appState === 'PLAYING') {
      this._updateGameplay(dt);
    }

    this._renderScene();

    requestAnimationFrame((ts) => this._gameLoop(ts));
  }

  _updateGameplay(dt) {
    // 1. Movimentação dos Personagens conforme o Modo Selecionado
    if (this.gameMode === 'singleplayer') {
      const wasd = this.input.getWASDVector();
      const activePlayer = this.players[this.activePlayerIndex];
      const inactivePlayer = this.players[this.activePlayerIndex === 0 ? 1 : 0];

      activePlayer.update(dt, wasd, this.currentMap);
      inactivePlayer.update(dt, { dx: 0, dy: 0 }, this.currentMap);
    } else {
      // Multiplayer Local: Jogador 1 em WASD, Jogador 2 nas Setas Direcionais
      const wasd = this.input.getWASDVector();
      const arrows = this.input.getArrowsVector();

      this.p1.update(dt, wasd, this.currentMap);
      this.p2.update(dt, arrows, this.currentMap);
    }

    // 2. Atualização Suave da Câmera respeitando os Boundaries do Mapa
    const camTarget = this._getCameraTargetPoint();
    this.camera.update(dt, camTarget.x, camTarget.y, this.currentMap);

    // 3. Cronômetro da Fase (Apenas nos 3 Mapas Grandes; pausado na Safe Room Van)
    const stageMeta = this.getCurrentStageMeta();
    if (!stageMeta.isSafeRoom) {
      this.stageTimeRemaining = Math.max(0, this.stageTimeRemaining - dt);
      if (this.stageTimeRemaining <= 0) {
        this.restartCurrentStage();
        this.ui.showToast('Tempo esgotado! Fase reiniciada automaticamente.');
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

  /**
   * Renderiza todo o Mundo 2D Top-Down (Grid, Zonas, Obstáculos, Personagens, Bússola e Minimapa Debug)
   */
  _renderScene() {
    const ctx = this.ctx;
    const map = this.currentMap;
    const { width: viewW, height: viewH } = this.canvas;

    // Limpa o fundo da tela (caso o mapa seja menor que o viewport, como na Van)
    ctx.fillStyle = '#090d14';
    ctx.fillRect(0, 0, viewW, viewH);

    ctx.save();
    const { offsetX, offsetY } = this.camera.getRenderOffset();
    ctx.translate(offsetX, offsetY);

    // 1. Piso Base do Mapa
    ctx.fillStyle = map.palette.bg;
    ctx.fillRect(0, 0, map.width, map.height);

    // 2. Grid de Referência no Chão (Percepção de Velocidade e Escala)
    this._drawDebugGrid(ctx, map);

    // 3. Zonas de Referência / Trilhas no Chão
    this._drawFloorZones(ctx, map);

    // 4. Marcadores de Spawn P1 e P2
    this._drawSpawnMarkers(ctx, map);

    // 5. Zona de Extração / Porta da Van
    this._drawTransitionZone(ctx, map);

    // 6. Caixas de Colisão Visíveis para Paredes e Obstáculos
    this._drawObstacles(ctx, map);

    // 7. Linha de Ponto Médio da Câmera (no modo Multiplayer Local)
    if (this.gameMode === 'multiplayer') {
      this._drawMultiplayerMidpointDebug(ctx);
    }

    // 8. Personagens 1 e 2 (Ordenados por Y para profundidade Top-Down estilo Stardew Valley)
    const sortedPlayers = [...this.players].sort((a, b) => a.y - b.y);
    for (const player of sortedPlayers) {
      const isControlled =
        this.gameMode === 'multiplayer' ||
        this.players[this.activePlayerIndex].id === player.id;
      player.draw(ctx, isControlled, this.gameMode, this.elapsedTime);
    }

    // 9. Textos Flutuantes de Debug (-10 HP, etc.)
    for (const ft of this.floatingTexts) {
      ft.draw(ctx);
    }

    ctx.restore();

    // 10. Indicadores de Tela Fixa no Canvas (Bússola de Extração + Minimapa Debug)
    if (this.appState === 'PLAYING' || this.appState === 'PAUSED') {
      this._drawExtractionCompass(ctx);
      this._drawDebugMinimap(ctx);
    }
  }

  _drawDebugGrid(ctx, map) {
    const tile = window.GameConfig.TILE_SIZE;
    const major = window.GameConfig.MAJOR_GRID_STEP;

    // Otimização de Culling: desenha apenas as linhas visíveis na câmera
    const startX = Math.max(0, Math.floor(this.camera.x / tile) * tile);
    const endX = Math.min(map.width, Math.ceil((this.camera.x + this.canvas.width) / tile) * tile);
    const startY = Math.max(0, Math.floor(this.camera.y / tile) * tile);
    const endY = Math.min(map.height, Math.ceil((this.camera.y + this.canvas.height) / tile) * tile);

    // Grid secundário (64x64px)
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

    // Grid principal (320x320px) + Coordenadas de Escala
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

    // Labels de Coordenadas nas interseções principais
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
    // Preenchimento da Zona de Transição
    ctx.fillStyle = z.fillColor;
    ctx.fillRect(z.x, z.y, z.w, z.h);

    // Borda Externa + Borda Interna Pulsante
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

    // Textos da Zona de Extração / Porta da Van
    const centerX = z.x + z.w / 2;
    const centerY = z.y + z.h / 2;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(z.label, centerX, centerY - 12);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '11px Consolas, monospace';
    ctx.fillText(z.subLabel, centerX, centerY + 8);

    // Barra de progresso se o jogador estiver pisando na zona
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
      // Preenchimento do obstáculo
      ctx.fillStyle = map.palette.wallFill;
      ctx.fillRect(obs.x, obs.y, obs.w, obs.h);

      // Caixa de Colisão Visível (Debug Wireframe)
      ctx.strokeStyle = map.palette.wallStroke;
      ctx.lineWidth = 2;
      ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);

      // Linhas diagonais internas para evidenciar área bloqueada de colisão
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.moveTo(obs.x, obs.y);
      ctx.lineTo(obs.x + obs.w, obs.y + obs.h);
      ctx.moveTo(obs.x + obs.w, obs.y);
      ctx.lineTo(obs.x, obs.y + obs.h);
      ctx.stroke();

      // Nome e dimensões do obstáculo (apenas para obstáculos internos maiores)
      if (obs.w >= 120 && obs.h >= 70) {
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 11px Consolas, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(obs.label || 'COLISÃO', obs.x + obs.w / 2, obs.y + obs.h / 2 - 4);

        ctx.fillStyle = 'rgba(226, 232, 240, 0.65)';
        ctx.font = '10px Consolas, monospace';
        ctx.fillText(`[${obs.w}x${obs.h}px]`, obs.x + obs.w / 2, obs.y + obs.h / 2 + 12);
      }
    }
    ctx.restore();
  }

  _drawMultiplayerMidpointDebug(ctx) {
    const midX = (this.p1.x + this.p2.x) / 2;
    const midY = (this.p1.y + this.p2.y) / 2;

    ctx.save();
    // Linha tracejada ligando P1 e P2
    ctx.beginPath();
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = 'rgba(255, 202, 58, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Mira do Ponto Médio da Câmera
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

  /**
   * Desenha uma bússola direcional discreta apontando para a Zona de Extração
   * quando ela estiver fora ou distante do centro da câmera
   */
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
    const compassCenterY = 148;

    ctx.save();
    ctx.translate(compassCenterX, compassCenterY);

    // Caixa da Bússola de Objetivo
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = zone.strokeColor || '#4ade80';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-135, -16, 270, 32, 16);
    ctx.fill();
    ctx.stroke();

    // Seta rotacionada apontando para a saída
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

    // Texto de Distância até a Saída / Porta da Van
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 11px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const labelPrefix = this.getCurrentStageMeta().isSafeRoom ? 'PORTA DA VAN' : 'ZONA DE EXTRAÇÃO';
    ctx.fillText(`${labelPrefix}: ${Math.round(dist)}px`, 12, 0);

    ctx.restore();
  }

  /**
   * Renderiza um Minimapa de Debug no canto inferior direito para visão global do mapa 2500x2500
   */
  _drawDebugMinimap(ctx) {
    const map = this.currentMap;
    const maxMiniSize = 156;
    const scale = Math.min(maxMiniSize / map.width, maxMiniSize / map.height);
    const miniW = map.width * scale;
    const miniH = map.height * scale;

    const margin = 20;
    const originX = this.canvas.width - miniW - margin;
    const originY = this.canvas.height - miniH - margin;

    ctx.save();
    // Moldura do Minimapa
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

    // Fundo do mapa reduzido
    ctx.fillStyle = map.palette.bg;
    ctx.fillRect(0, 0, miniW, miniH);

    // Obstáculos no minimapa
    ctx.fillStyle = map.palette.wallStroke;
    ctx.globalAlpha = 0.45;
    for (const obs of map.obstacles) {
      ctx.fillRect(obs.x * scale, obs.y * scale, obs.w * scale, obs.h * scale);
    }
    ctx.globalAlpha = 1;

    // Zona de Extração no minimapa
    if (map.transitionZone) {
      const tz = map.transitionZone;
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(tz.x * scale, tz.y * scale, Math.max(6, tz.w * scale), Math.max(6, tz.h * scale));
    }

    // Posição de P1 e P2 no minimapa
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(this.p1.x * scale, this.p1.y * scale, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fb923c';
    ctx.beginPath();
    ctx.arc(this.p2.x * scale, this.p2.y * scale, 4, 0, Math.PI * 2);
    ctx.fill();

    // Retângulo do Viewport da Câmera
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

// Inicializa o Jogo quando o DOM estiver pronto
window.addEventListener('DOMContentLoaded', () => {
  window.gameInstance = new Game();
});

