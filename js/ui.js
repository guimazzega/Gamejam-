/**
 * js/ui.js
 * Gerenciador de Interfaces (HUD In-Game, Hotbar estilo Stardew Valley,
 * Menu Principal, Modal de Configurações Placeholder e Menu de Pausa/Inventário).
 */

window.UIManager = class UIManager {
  constructor(game) {
    this.game = game;
    this.toastTimeout = null;

    // Referências de Camadas / Overlays
    this.hudLayer = document.getElementById('hud-layer');
    this.mainMenuOverlay = document.getElementById('main-menu-overlay');
    this.settingsModalOverlay = document.getElementById('settings-modal-overlay');
    this.pauseMenuOverlay = document.getElementById('pause-menu-overlay');
    this.debugToast = document.getElementById('debug-toast');

    // Referências HUD - HP Cards
    this.p1Card = document.getElementById('hud-p1-card');
    this.p1Badge = document.getElementById('hud-p1-badge');
    this.p1HpText = document.getElementById('hud-p1-hp-text');
    this.p1HpBar = document.getElementById('hud-p1-hp-bar');
    this.p1KeysHint = document.getElementById('hud-p1-keys');

    this.p2Card = document.getElementById('hud-p2-card');
    this.p2Badge = document.getElementById('hud-p2-badge');
    this.p2HpText = document.getElementById('hud-p2-hp-text');
    this.p2HpBar = document.getElementById('hud-p2-hp-bar');
    this.p2KeysHint = document.getElementById('hud-p2-keys');

    // Referências HUD - Topo Central (Timer e Fase)
    this.stageStepper = document.getElementById('hud-stage-stepper');
    this.mapTitle = document.getElementById('hud-map-title');
    this.timerBox = document.getElementById('hud-timer-box');
    this.timerValue = document.getElementById('hud-timer-value');
    this.saferoomBadge = document.getElementById('hud-saferoom-badge');
    this.interactionPrompt = document.getElementById('hud-interaction-prompt');

    // Referências HUD - Hotbar
    this.hotbarContainer = document.getElementById('hud-hotbar');
    this.selectedItemLabel = document.getElementById('hud-selected-item-label');

    // Referências HUD - Telemetria Debug
    this.dbgMode = document.getElementById('dbg-mode');
    this.dbgState = document.getElementById('dbg-state');
    this.dbgP1Pos = document.getElementById('dbg-p1-pos');
    this.dbgP2Pos = document.getElementById('dbg-p2-pos');
    this.dbgCamPos = document.getElementById('dbg-cam-pos');

    // Referências Menu Principal
    this.btnModeSingle = document.getElementById('btn-mode-single');
    this.btnModeMulti = document.getElementById('btn-mode-multi');
    this.btnStartGame = document.getElementById('btn-start-game');
    this.btnOpenSettings = document.getElementById('btn-open-settings');
    this.btnCloseSettings = document.getElementById('btn-close-settings');

    // Referências Menu de Pausa
    this.pauseMapName = document.getElementById('pause-map-name');
    this.pauseTimerStatus = document.getElementById('pause-timer-status');
    this.pauseP1HpLabel = document.getElementById('pause-p1-hp-label');
    this.pauseP1HpFill = document.getElementById('pause-p1-hp-fill');
    this.pauseP1ItemsGrid = document.getElementById('pause-p1-items-grid');
    this.pauseP2HpLabel = document.getElementById('pause-p2-hp-label');
    this.pauseP2HpFill = document.getElementById('pause-p2-hp-fill');
    this.pauseP2ItemsGrid = document.getElementById('pause-p2-items-grid');

    this.btnResumeGame = document.getElementById('btn-resume-game');
    this.btnRestartStage = document.getElementById('btn-restart-stage');
    this.btnQuitToMenu = document.getElementById('btn-quit-to-menu');

    this._bindEvents();
  }

  _bindEvents() {
    // Seletor de Modo no Menu Principal
    this.btnModeSingle.addEventListener('click', () => {
      this.selectMenuMode('singleplayer');
    });

    this.btnModeMulti.addEventListener('click', () => {
      this.selectMenuMode('multiplayer');
    });

    // Iniciar Jogo
    this.btnStartGame.addEventListener('click', () => {
      this.game.startNewGame();
    });

    // Abrir / Fechar Configurações (Placeholder)
    this.btnOpenSettings.addEventListener('click', () => {
      this.settingsModalOverlay.classList.remove('hidden');
    });

    this.btnCloseSettings.addEventListener('click', () => {
      this.settingsModalOverlay.classList.add('hidden');
    });

    // Botões do Menu de Pausa
    this.btnResumeGame.addEventListener('click', () => {
      this.game.togglePause(false);
    });

    this.btnRestartStage.addEventListener('click', () => {
      this.game.restartCurrentStage();
    });

    this.btnQuitToMenu.addEventListener('click', () => {
      this.game.returnToMainMenu();
    });
  }

  selectMenuMode(mode) {
    this.game.gameMode = mode;
    if (mode === 'singleplayer') {
      this.btnModeSingle.classList.add('selected');
      this.btnModeMulti.classList.remove('selected');
    } else {
      this.btnModeMulti.classList.add('selected');
      this.btnModeSingle.classList.remove('selected');
    }
  }

  showMainMenu() {
    this.mainMenuOverlay.classList.remove('hidden');
    this.settingsModalOverlay.classList.add('hidden');
    this.pauseMenuOverlay.classList.add('hidden');
    this.hudLayer.classList.add('hidden');
  }

  showGameplayHUD() {
    this.mainMenuOverlay.classList.add('hidden');
    this.settingsModalOverlay.classList.add('hidden');
    this.pauseMenuOverlay.classList.add('hidden');
    this.hudLayer.classList.remove('hidden');
    this.renderHotbar();
    this.updateHUD();
  }

  showPauseMenu(isPaused) {
    if (isPaused) {
      this.updatePauseInventoryPanel();
      this.pauseMenuOverlay.classList.remove('hidden');
    } else {
      this.pauseMenuOverlay.classList.add('hidden');
    }
  }

  /**
   * Renderiza a Hotbar inferior estilo Stardew Valley do personagem em foco
   */
  renderHotbar() {
    const activePlayer = this.game.getHudFocusPlayer();
    const inventory = activePlayer.inventory;
    const selectedSlot = activePlayer.selectedSlot;

    this.hotbarContainer.innerHTML = '';

    inventory.forEach((item, index) => {
      const slotEl = document.createElement('div');
      slotEl.className = 'hotbar-slot';
      if (index === selectedSlot) slotEl.classList.add('active-slot');
      if (item.isEmpty) slotEl.classList.add('empty-slot');

      slotEl.innerHTML = `
        <span class="slot-key-num">${index + 1}</span>
        <span class="slot-icon">${item.icon}</span>
        <span class="slot-short-name">${item.shortName}</span>
      `;

      slotEl.addEventListener('click', () => {
        this.game.selectHotbarSlot(index);
      });

      this.hotbarContainer.appendChild(slotEl);
    });

    const currentItem = inventory[selectedSlot];
    const ownerPrefix = this.game.gameMode === 'singleplayer'
      ? `[P${activePlayer.id}] `
      : `[P1] `;
    if (currentItem) {
      this.selectedItemLabel.textContent = `${ownerPrefix}Slot ${selectedSlot + 1}: ${currentItem.name}`;
    }
  }

  /**
   * Atualiza todos os elementos dinâmicos da HUD durante o gameplay
   */
  updateHUD() {
    const { p1, p2, gameMode, activePlayerIndex, stageTimeRemaining } = this.game;
    const currentStageMeta = this.game.getCurrentStageMeta();
    const currentMap = this.game.currentMap;

    // 1. Atualiza Barras de Vida (HP)
    this._updatePlayerCard(this.p1HpText, this.p1HpBar, p1);
    this._updatePlayerCard(this.p2HpText, this.p2HpBar, p2);

    // 2. Destaque de Controle Singleplayer vs Multiplayer Local
    if (gameMode === 'singleplayer') {
      const p1Active = activePlayerIndex === 0;
      this.p1Card.classList.toggle('active-player-card', p1Active);
      this.p2Card.classList.toggle('active-player-card', !p1Active);

      this.p1Badge.textContent = p1Active ? 'ATIVO' : 'ESPERA';
      this.p2Badge.textContent = !p1Active ? 'ATIVO' : 'ESPERA';

      this.p1KeysHint.textContent = p1Active ? 'Controle: W, A, S, D' : 'Pressione [Tab] p/ assumir';
      this.p2KeysHint.textContent = !p1Active ? 'Controle: W, A, S, D' : 'Pressione [Tab] p/ assumir';
    } else {
      this.p1Card.classList.add('active-player-card');
      this.p2Card.classList.add('active-player-card');

      this.p1Badge.textContent = 'JOGADOR 1';
      this.p2Badge.textContent = 'JOGADOR 2';

      this.p1KeysHint.textContent = 'Controle: W, A, S, D';
      this.p2KeysHint.textContent = 'Controle: Setas Direcionais';
    }

    // 3. Stepper da Máquina de Estados (M1 -> VAN -> M2 -> VAN -> M3)
    const dots = this.stageStepper.querySelectorAll('.step-dot');
    dots.forEach((dot) => {
      const step = parseInt(dot.getAttribute('data-step'), 10);
      dot.classList.remove('active', 'completed');
      if (step < currentStageMeta.stepIndex) {
        dot.classList.add('completed');
      } else if (step === currentStageMeta.stepIndex) {
        dot.classList.add('active');
      }
    });

    // 4. Título do Mapa e Cronômetro da Fase (Pausado/Oculto na Safe Room Van)
    this.mapTitle.textContent = currentMap.name;
    if (currentStageMeta.isSafeRoom) {
      this.timerBox.classList.add('hidden');
      this.saferoomBadge.classList.remove('hidden');
    } else {
      this.timerBox.classList.remove('hidden');
      this.saferoomBadge.classList.add('hidden');
      this.timerValue.textContent = this.formatTime(stageTimeRemaining);
      this.timerValue.classList.toggle('timer-warning', stageTimeRemaining <= 30);
    }

    // 5. Prompt de Interação na Zona de Extração / Porta da Van
    if (this.game.isAnyPlayerInTransitionZone()) {
      this.interactionPrompt.classList.remove('hidden');
      this.interactionPrompt.innerHTML = currentStageMeta.isSafeRoom
        ? 'Na Porta da Van! Pressione <kbd>E</kbd> ou <kbd>Espaço</kbd> para Seguir Viagem →'
        : 'Na Zona de Extração! Pressione <kbd>E</kbd> ou <kbd>Espaço</kbd> para entrar na Van →';
    } else {
      this.interactionPrompt.classList.add('hidden');
    }

    // 6. Telemetria do Painel de Debug
    this.dbgMode.textContent = gameMode === 'singleplayer' ? 'Singleplayer (Tab)' : 'Multiplayer Local';
    this.dbgState.textContent = `${currentStageMeta.stateId} (${currentStageMeta.stepIndex + 1}/5)`;
    this.dbgP1Pos.textContent = `${Math.round(p1.x)}, ${Math.round(p1.y)}`;
    this.dbgP2Pos.textContent = `${Math.round(p2.x)}, ${Math.round(p2.y)}`;
    this.dbgCamPos.textContent = `${Math.round(this.game.camera.x)}, ${Math.round(this.game.camera.y)}`;
  }

  _updatePlayerCard(textEl, barEl, player) {
    const pct = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
    textEl.textContent = `${player.hp} / ${player.maxHp} HP`;
    barEl.style.width = `${pct}%`;

    barEl.classList.remove('hp-medium', 'hp-low');
    if (pct <= 30) {
      barEl.classList.add('hp-low');
    } else if (pct <= 60) {
      barEl.classList.add('hp-medium');
    }
  }

  /**
   * Atualiza o Painel Estilo Inventário no Menu de Pausa (Esc ou P)
   */
  updatePauseInventoryPanel() {
    const { p1, p2, stageTimeRemaining } = this.game;
    const currentStageMeta = this.game.getCurrentStageMeta();

    this.pauseMapName.textContent = currentStageMeta.label;
    this.pauseTimerStatus.textContent = currentStageMeta.isSafeRoom
      ? 'Safe Room (Van): Cronômetro Pausado'
      : `Tempo Restante na Fase: ${this.formatTime(stageTimeRemaining)}`;

    // Personagem 1
    this._updatePlayerCard(this.pauseP1HpLabel, this.pauseP1HpFill, p1);
    this._renderPauseCharacterGrid(this.pauseP1ItemsGrid, p1);

    // Personagem 2
    this._updatePlayerCard(this.pauseP2HpLabel, this.pauseP2HpFill, p2);
    this._renderPauseCharacterGrid(this.pauseP2ItemsGrid, p2);
  }

  _renderPauseCharacterGrid(container, player) {
    container.innerHTML = '';
    player.inventory.forEach((item, idx) => {
      const div = document.createElement('div');
      div.className = 'pause-item-slot';
      if (idx === player.selectedSlot) div.classList.add('equipped');
      if (item.isEmpty) div.classList.add('empty');

      div.innerHTML = `
        <div class="pause-slot-icon">${item.icon}</div>
        <div class="pause-slot-name">Slot ${idx + 1}: ${item.name}</div>
        <div class="pause-slot-tag">${idx === player.selectedSlot ? '★ EQUIPADO' : item.type}</div>
      `;
      container.appendChild(div);
    });
  }

  formatTime(seconds) {
    const clamped = Math.max(0, Math.ceil(seconds));
    const mins = Math.floor(clamped / 60);
    const secs = clamped % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  showToast(message, durationMs = 2200) {
    if (!this.debugToast) return;
    this.debugToast.textContent = message;
    this.debugToast.classList.remove('hidden');
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.debugToast.classList.add('hidden');
    }, durationMs);
  }
};

