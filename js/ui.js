/**
 * js/ui.js
 * Gerenciador de Interfaces (Sprints 2 & 3):
 * - HUD In-Game Dinâmica (Singleplayer vs Multiplayer Local Separado)
 * - Dicas de Teclas sincronizadas em tempo real com o Dicionário Global (Config.Controls)
 * - Contador Global Persistente de Lixo Coletado + Lixos Restantes no Mapa
 * - Modal de Configurações com Aba "Geral & Áudio" e Nova Aba "Controles" (Keybinding + Status Gamepad)
 */

window.UIManager = class UIManager {
  constructor(game) {
    this.game = game;
    this.toastTimeout = null;
    this.activeSettingsTab = 'general';

    // Lista estruturada de ações exibidas na Aba "Controles" (Sprint 3)
    this.rebindableActions = [
      { key: 'P1_Up', label: 'Mover Cima (P1)', group: 'Jogador 1 / Principal', desc: 'Move o personagem para o Norte (Cima)' },
      { key: 'P1_Down', label: 'Mover Baixo (P1)', group: 'Jogador 1 / Principal', desc: 'Move o personagem para o Sul (Baixo)' },
      { key: 'P1_Left', label: 'Mover Esquerda (P1)', group: 'Jogador 1 / Principal', desc: 'Move o personagem para o Oeste (Esquerda)' },
      { key: 'P1_Right', label: 'Mover Direita (P1)', group: 'Jogador 1 / Principal', desc: 'Move o personagem para o Leste (Direita)' },
      { key: 'P1_Attack', label: 'Atacar (P1)', group: 'Jogador 1 / Principal', desc: 'Executa o ataque (No Singleplayer o Botão Direito do Mouse também ataca)' },
      { key: 'P1_Inventory', label: 'Inventário (Girar Slot P1)', group: 'Jogador 1 / Principal', desc: 'Alterna o item equipado na Hotbar do Jogador 1 (além de 1-5)' },
      { key: 'P2_Up', label: 'Mover Cima (P2)', group: 'Jogador 2 (Multiplayer Local)', desc: 'Move o Jogador 2 para Cima' },
      { key: 'P2_Down', label: 'Mover Baixo (P2)', group: 'Jogador 2 (Multiplayer Local)', desc: 'Move o Jogador 2 para Baixo' },
      { key: 'P2_Left', label: 'Mover Esquerda (P2)', group: 'Jogador 2 (Multiplayer Local)', desc: 'Move o Jogador 2 para a Esquerda' },
      { key: 'P2_Right', label: 'Mover Direita (P2)', group: 'Jogador 2 (Multiplayer Local)', desc: 'Move o Jogador 2 para a Direita' },
      { key: 'P2_Attack', label: 'Atacar (P2)', group: 'Jogador 2 (Multiplayer Local)', desc: 'Executa o ataque do Jogador 2 no Multiplayer Local' },
      { key: 'P2_Inventory', label: 'Inventário (Girar Slot P2)', group: 'Jogador 2 (Multiplayer Local)', desc: 'Alterna o item equipado do Jogador 2 (além do Scroll do Mouse)' },
      { key: 'Interact', label: 'Interagir (Saída / Estações)', group: 'Ações Gerais', desc: 'Interage com Zona de Extração, Porta da Van, Lojinha e Craft' },
      { key: 'SwitchPlayer', label: 'Alternar Personagem (Single)', group: 'Ações Gerais', desc: 'Troca imediatamente entre P1 e P2 no modo Singleplayer' }
    ];

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

    // Referências HUD - Topo Central (Timer, Fase e Contador de Sucata/Lixo)
    this.stageStepper = document.getElementById('hud-stage-stepper');
    this.mapTitle = document.getElementById('hud-map-title');
    this.timerBox = document.getElementById('hud-timer-box');
    this.timerValue = document.getElementById('hud-timer-value');
    this.saferoomBadge = document.getElementById('hud-saferoom-badge');
    this.scrapCountEl = document.getElementById('hud-scrap-count');
    this.mapTrashRemainingEl = document.getElementById('hud-map-trash-remaining');
    this.interactionPrompt = document.getElementById('hud-interaction-prompt');

    // Referências HUD - Hotbar Singleplayer (Base Central)
    this.singleHotbarWrapper = document.getElementById('hud-single-hotbar-wrapper');
    this.hotbarContainer = document.getElementById('hud-hotbar');
    this.selectedItemLabel = document.getElementById('hud-selected-item-label');
    this.hudHintInvKey = document.getElementById('hud-hint-inv-key');

    // Referências HUD - Hotbars Verticais Multiplayer (Centro-Esquerdo e Centro-Direito)
    this.multiHotbarP1Panel = document.getElementById('hud-multi-hotbar-p1');
    this.multiHotbarP1Slots = document.getElementById('hud-hotbar-p1-slots');
    this.multiP1SelectedLabel = document.getElementById('hud-p1-selected-label');
    this.multiP1HotbarTag = document.getElementById('hud-multi-p1-hotbar-tag');

    this.multiHotbarP2Panel = document.getElementById('hud-multi-hotbar-p2');
    this.multiHotbarP2Slots = document.getElementById('hud-hotbar-p2-slots');
    this.multiP2SelectedLabel = document.getElementById('hud-p2-selected-label');
    this.multiP2HotbarTag = document.getElementById('hud-multi-p2-hotbar-tag');

    // Referências HUD - Telemetria Debug
    this.dbgMode = document.getElementById('dbg-mode');
    this.dbgState = document.getElementById('dbg-state');
    this.dbgP1Pos = document.getElementById('dbg-p1-pos');
    this.dbgP2Pos = document.getElementById('dbg-p2-pos');
    this.dbgScrapCount = document.getElementById('dbg-scrap-count');
    this.dbgGamepadState = document.getElementById('dbg-gamepad-state');
    this.dbgKeyP1Atk = document.getElementById('dbg-key-p1-atk');
    this.dbgKeyP2Atk = document.getElementById('dbg-key-p2-atk');
    this.dbgKeySwitch = document.getElementById('dbg-key-switch');
    this.dbgKeyInteract = document.getElementById('dbg-key-interact');

    // Referências Menu Principal
    this.btnModeSingle = document.getElementById('btn-mode-single');
    this.btnModeMulti = document.getElementById('btn-mode-multi');
    this.btnStartGame = document.getElementById('btn-start-game');
    this.btnOpenSettings = document.getElementById('btn-open-settings');

    // Referências Modal de Configurações & Abas (Sprint 3)
    this.btnCloseSettings = document.getElementById('btn-close-settings');
    this.tabBtnGeneral = document.getElementById('tab-btn-general');
    this.tabBtnControls = document.getElementById('tab-btn-controls');
    this.tabPaneGeneral = document.getElementById('settings-tab-general');
    this.tabPaneControls = document.getElementById('settings-tab-controls');
    this.keybindingListEl = document.getElementById('keybinding-list');
    this.btnResetControls = document.getElementById('btn-reset-controls');
    this.settingsGamepadStatus = document.getElementById('settings-gamepad-status');

    this.toggleFullscreen = document.getElementById('toggle-fullscreen');
    this.badgeFullscreenState = document.getElementById('badge-fullscreen-state');
    this.toggleMute = document.getElementById('toggle-mute');
    this.badgeMuteState = document.getElementById('badge-mute-state');
    this.toggleFriendlyFire = document.getElementById('toggle-friendly-fire');
    this.badgeFriendlyFireState = document.getElementById('badge-friendly-fire-state');

    // Referências Menu de Pausa
    this.pauseMapName = document.getElementById('pause-map-name');
    this.pauseTimerStatus = document.getElementById('pause-timer-status');
    this.pauseScrapStatus = document.getElementById('pause-scrap-status');
    this.pauseP1HpLabel = document.getElementById('pause-p1-hp-label');
    this.pauseP1HpFill = document.getElementById('pause-p1-hp-fill');
    this.pauseP1ItemsGrid = document.getElementById('pause-p1-items-grid');
    this.pauseP2HpLabel = document.getElementById('pause-p2-hp-label');
    this.pauseP2HpFill = document.getElementById('pause-p2-hp-fill');
    this.pauseP2ItemsGrid = document.getElementById('pause-p2-items-grid');

    this.btnResumeGame = document.getElementById('btn-resume-game');
    this.btnPauseSettings = document.getElementById('btn-pause-settings');
    this.btnRestartStage = document.getElementById('btn-restart-stage');
    this.btnQuitToMenu = document.getElementById('btn-quit-to-menu');

    this._bindEvents();
    this.syncSettingsUI();
    this.renderKeybindingList();
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

    // Abrir Configurações (a partir do Menu Principal ou do Menu de Pausa)
    this.btnOpenSettings.addEventListener('click', () => {
      this.openSettingsModal();
    });

    if (this.btnPauseSettings) {
      this.btnPauseSettings.addEventListener('click', () => {
        this.openSettingsModal();
      });
    }

    // Fechar Configurações
    this.btnCloseSettings.addEventListener('click', () => {
      this.closeSettingsModal();
    });

    // Alternância de Abas no Menu de Configurações (Geral vs Controles)
    if (this.tabBtnGeneral) {
      this.tabBtnGeneral.addEventListener('click', () => {
        this.switchSettingsTab('general');
      });
    }
    if (this.tabBtnControls) {
      this.tabBtnControls.addEventListener('click', () => {
        this.switchSettingsTab('controls');
      });
    }

    // Botão Restaurar Teclas Padrão
    if (this.btnResetControls) {
      this.btnResetControls.addEventListener('click', () => {
        this.game.input.cancelKeyRebind();
        window.Config.resetDefaultControls();
        this.renderKeybindingList();
        this.updateHUD();
        this.showToast('Controles restaurados para os valores padrão (Config.Controls)!', 1800);
      });
    }

    // 1. Toggle Tela Cheia (Fullscreen API)
    if (this.toggleFullscreen) {
      this.toggleFullscreen.addEventListener('change', () => {
        this.handleFullscreenToggle(this.toggleFullscreen.checked);
      });
    }

    document.addEventListener('fullscreenchange', () => {
      this.syncSettingsUI();
    });

    // 2. Toggle Muta/Desmuta Áudio (window.isMuted)
    if (this.toggleMute) {
      this.toggleMute.addEventListener('change', () => {
        window.isMuted = Boolean(this.toggleMute.checked);
        this.syncSettingsUI();
        this.showToast(
          `Áudio ${window.isMuted ? 'MUTADO (isMuted = true)' : 'ATIVADO (isMuted = false)'}`,
          1600
        );
      });
    }

    // 3. Toggle Fogo Amigo (window.friendlyFireEnabled)
    if (this.toggleFriendlyFire) {
      this.toggleFriendlyFire.addEventListener('change', () => {
        window.friendlyFireEnabled = Boolean(this.toggleFriendlyFire.checked);
        this.syncSettingsUI();
        this.showToast(
          `Fogo Amigo: ${window.friendlyFireEnabled ? 'ON (friendlyFireEnabled = true)' : 'OFF (friendlyFireEnabled = false)'}`,
          1600
        );
      });
    }

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

  /**
   * Alterna entre as abas "Geral & Áudio" e "Controles" no Menu de Configurações
   */
  switchSettingsTab(tabName) {
    this.activeSettingsTab = tabName;
    this.game.input.cancelKeyRebind();

    const isControls = tabName === 'controls';
    if (this.tabBtnGeneral) this.tabBtnGeneral.classList.toggle('active', !isControls);
    if (this.tabBtnControls) this.tabBtnControls.classList.toggle('active', isControls);

    if (this.tabPaneGeneral) this.tabPaneGeneral.classList.toggle('hidden', isControls);
    if (this.tabPaneControls) this.tabPaneControls.classList.toggle('hidden', !isControls);

    if (isControls) {
      this.renderKeybindingList();
      this.updateGamepadStatusBanner();
    }
  }

  /**
   * Renderiza a lista interativa de ações na aba "Controles" para remapeamento (Keybinding)
   */
  renderKeybindingList() {
    if (!this.keybindingListEl) return;
    this.keybindingListEl.innerHTML = '';

    const C = window.Config.Controls;
    const listeningKey = this.game.input.rebindingAction;

    this.rebindableActions.forEach((item) => {
      const currentCode = C[item.key];
      const formattedKey = window.Config.formatKeyCode(currentCode);
      const isListening = listeningKey === item.key;

      const row = document.createElement('button');
      row.type = 'button';
      row.className = `keybind-row ${isListening ? 'listening' : ''}`;
      row.setAttribute('data-action-key', item.key);

      row.innerHTML = `
        <div class="keybind-info">
          <div class="keybind-action-header">
            <span class="keybind-action-name">${item.label}</span>
            <span class="keybind-group-tag">${item.group}</span>
          </div>
          <div class="keybind-action-desc">${item.desc} <code>Config.Controls.${item.key}</code></div>
        </div>
        <div class="keybind-badge-wrapper">
          <span class="keybind-key-badge ${isListening ? 'badge-listening' : ''}">
            ${isListening ? '⌨ Pressione uma tecla...' : formattedKey}
          </span>
          <small class="keybind-raw-code">${isListening ? 'Aguardando keydown' : currentCode}</small>
        </div>
      `;

      row.addEventListener('click', () => {
        if (this.game.input.rebindingAction === item.key) {
          // Clicar novamente na mesma ação cancela a escuta
          this.game.input.cancelKeyRebind();
          this.renderKeybindingList();
          return;
        }

        // Inicia a escuta da próxima tecla pressionada (evento keydown)
        this.game.input.startKeyRebind(item.key, (actionKey, newCode) => {
          this.renderKeybindingList();
          this.updateHUD();
          this.showToast(
            `✓ [${item.label}] remapeado para "${window.Config.formatKeyCode(newCode)}" (${newCode})!`,
            2000
          );
        });

        this.renderKeybindingList();
      });

      this.keybindingListEl.appendChild(row);
    });
  }

  /**
   * Atualiza o status dos Gamepads conectados na aba Controles e na HUD
   */
  updateGamepadStatusBanner() {
    const pads = this.game.input.connectedGamepadsInfo || [];
    if (this.settingsGamepadStatus) {
      if (pads.length === 0) {
        this.settingsGamepadStatus.textContent = 'Nenhum controle ativo (Pressione um botão no Joystick)';
        this.settingsGamepadStatus.className = 'gamepad-status-pill status-idle';
      } else {
        const summary = pads
          .map((p) => `#${p.index + 1}: ${p.profileLabel}`)
          .join(' | ');
        this.settingsGamepadStatus.textContent = `${pads.length} Conectado(s) — ${summary}`;
        this.settingsGamepadStatus.className = 'gamepad-status-pill status-connected';
      }
    }

    if (this.dbgGamepadState) {
      if (pads.length === 0) {
        this.dbgGamepadState.textContent = '0 Conectado(s)';
      } else {
        const types = pads.map((p) => p.profileType.toUpperCase()).join(', ');
        this.dbgGamepadState.textContent = `${pads.length} (${types})`;
      }
    }
  }

  /**
   * Abre o Modal de Configurações sincronizando o estado atual dos toggles e controles
   */
  openSettingsModal() {
    this.syncSettingsUI();
    this.renderKeybindingList();
    this.updateGamepadStatusBanner();
    this.settingsModalOverlay.classList.remove('hidden');
  }

  /**
   * Fecha o Modal de Configurações cancelando qualquer remapeamento pendente
   */
  closeSettingsModal() {
    this.game.input.cancelKeyRebind();
    this.settingsModalOverlay.classList.add('hidden');
  }

  isSettingsModalOpen() {
    return !this.settingsModalOverlay.classList.contains('hidden');
  }

  /**
   * Alterna Fullscreen usando document.documentElement.requestFullscreen()
   */
  handleFullscreenToggle(shouldEnterFullscreen) {
    if (shouldEnterFullscreen && !document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement
          .requestFullscreen()
          .then(() => {
            this.syncSettingsUI();
            this.showToast('Modo Tela Cheia (Fullscreen): ON', 1500);
          })
          .catch(() => {
            this.syncSettingsUI();
            this.showToast('Não foi possível ativar Tela Cheia neste contexto do navegador.', 2000);
          });
      }
    } else if (!shouldEnterFullscreen && document.fullscreenElement) {
      if (document.exitFullscreen) {
        document
          .exitFullscreen()
          .then(() => {
            this.syncSettingsUI();
            this.showToast('Modo Tela Cheia (Fullscreen): OFF', 1500);
          })
          .catch(() => {
            this.syncSettingsUI();
          });
      }
    }
  }

  /**
   * Atualiza os checkboxes e badges ON/OFF do painel de configurações
   */
  syncSettingsUI() {
    const isFull = Boolean(document.fullscreenElement);
    if (this.toggleFullscreen) {
      this.toggleFullscreen.checked = isFull;
    }
    this._updateBadge(this.badgeFullscreenState, isFull);

    const muted = Boolean(window.isMuted);
    if (this.toggleMute) {
      this.toggleMute.checked = muted;
    }
    this._updateBadge(this.badgeMuteState, muted);

    const ff = Boolean(window.friendlyFireEnabled);
    if (this.toggleFriendlyFire) {
      this.toggleFriendlyFire.checked = ff;
    }
    this._updateBadge(this.badgeFriendlyFireState, ff);
  }

  _updateBadge(badgeEl, isOn) {
    if (!badgeEl) return;
    badgeEl.textContent = isOn ? 'ON' : 'OFF';
    badgeEl.classList.toggle('state-on', isOn);
    badgeEl.classList.toggle('state-off', !isOn);
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
    this.game.input.cancelKeyRebind();
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

    const isMulti = this.game.gameMode === 'multiplayer';
    this.hudLayer.classList.toggle('multiplayer-hud', isMulti);

    this.renderHotbar();
    this.updateHUD();
  }

  showPauseMenu(isPaused) {
    if (isPaused) {
      this.updatePauseInventoryPanel();
      this.pauseMenuOverlay.classList.remove('hidden');
    } else {
      this.game.input.cancelKeyRebind();
      this.pauseMenuOverlay.classList.add('hidden');
      this.settingsModalOverlay.classList.add('hidden');
    }
  }

  /**
   * Renderiza a Hotbar:
   * - Singleplayer: Hotbar horizontal inferior centralizada (5 slots)
   * - Multiplayer Local: Duas Hotbars verticais nas bordas esquerda (P1) e direita (P2)
   */
  renderHotbar() {
    const isMulti = this.game.gameMode === 'multiplayer';

    if (!isMulti) {
      this.singleHotbarWrapper.classList.remove('hidden');
      this.multiHotbarP1Panel.classList.add('hidden');
      this.multiHotbarP2Panel.classList.add('hidden');

      const activePlayer = this.game.getHudFocusPlayer();
      this._populateHotbarSlots(
        this.hotbarContainer,
        activePlayer,
        (idx) => this.game.selectHotbarSlot(idx, activePlayer.id),
        true
      );

      const currentItem = activePlayer.inventory[activePlayer.selectedSlot];
      if (currentItem) {
        this.selectedItemLabel.textContent = `[P${activePlayer.id}] Slot ${activePlayer.selectedSlot + 1}: ${currentItem.name}`;
      }
    } else {
      this.singleHotbarWrapper.classList.add('hidden');
      this.multiHotbarP1Panel.classList.remove('hidden');
      this.multiHotbarP2Panel.classList.remove('hidden');

      this._populateHotbarSlots(
        this.multiHotbarP1Slots,
        this.game.p1,
        (idx) => this.game.selectHotbarSlot(idx, 1),
        true
      );
      const itemP1 = this.game.p1.getEquippedItem();
      if (itemP1 && this.multiP1SelectedLabel) {
        this.multiP1SelectedLabel.textContent = `Slot ${this.game.p1.selectedSlot + 1}: ${itemP1.shortName}`;
      }

      this._populateHotbarSlots(
        this.multiHotbarP2Slots,
        this.game.p2,
        (idx) => this.game.selectHotbarSlot(idx, 2),
        false
      );
      const itemP2 = this.game.p2.getEquippedItem();
      if (itemP2 && this.multiP2SelectedLabel) {
        this.multiP2SelectedLabel.textContent = `Slot ${this.game.p2.selectedSlot + 1}: ${itemP2.shortName}`;
      }
    }
  }

  _populateHotbarSlots(container, player, onClickSlot, showKeyNumbers = true) {
    if (!container) return;
    container.innerHTML = '';

    player.inventory.forEach((item, index) => {
      const slotEl = document.createElement('div');
      slotEl.className = 'hotbar-slot';
      if (index === player.selectedSlot) slotEl.classList.add('active-slot');
      if (item.isEmpty) slotEl.classList.add('empty-slot');

      const badgeLabel = showKeyNumbers ? `${index + 1}` : `S${index + 1}`;
      slotEl.innerHTML = `
        <span class="slot-key-num">${badgeLabel}</span>
        <span class="slot-icon">${item.icon}</span>
        <span class="slot-short-name">${item.shortName}</span>
      `;

      slotEl.addEventListener('click', () => {
        onClickSlot(index);
      });

      container.appendChild(slotEl);
    });
  }

  /**
   * Atualiza todos os elementos dinâmicos da HUD durante o gameplay, consumindo Config.Controls
   */
  updateHUD() {
    const { p1, p2, gameMode, activePlayerIndex, stageTimeRemaining } = this.game;
    const currentStageMeta = this.game.getCurrentStageMeta();
    const currentMap = this.game.currentMap;
    const C = window.Config.Controls;
    const fmt = (k) => window.Config.formatKeyCode(k);

    this.hudLayer.classList.toggle('multiplayer-hud', gameMode === 'multiplayer');

    // 1. Atualiza Barras de Vida (HP)
    this._updatePlayerCard(this.p1HpText, this.p1HpBar, p1);
    this._updatePlayerCard(this.p2HpText, this.p2HpBar, p2);

    const p1MoveStr = `${fmt(C.P1_Up)},${fmt(C.P1_Left)},${fmt(C.P1_Down)},${fmt(C.P1_Right)}`;
    const p2MoveStr = `${fmt(C.P2_Up)},${fmt(C.P2_Left)},${fmt(C.P2_Down)},${fmt(C.P2_Right)}`;

    // 2. Destaque de Controle Singleplayer vs Multiplayer Local
    if (gameMode === 'singleplayer') {
      const p1Active = activePlayerIndex === 0;
      this.p1Card.classList.toggle('active-player-card', p1Active);
      this.p2Card.classList.toggle('active-player-card', !p1Active);

      this.p1Badge.textContent = p1Active ? 'ATIVO' : 'ESPERA';
      this.p2Badge.textContent = !p1Active ? 'ATIVO' : 'ESPERA';

      const activeHint = `Mover: ${p1MoveStr} • Atacar: Botão Dir. Mouse / ${fmt(C.P1_Attack)}`;
      const waitHint = `Pressione [${fmt(C.SwitchPlayer)}] para assumir`;

      this.p1KeysHint.textContent = p1Active ? activeHint : waitHint;
      this.p2KeysHint.textContent = !p1Active ? activeHint : waitHint;
    } else {
      this.p1Card.classList.add('active-player-card');
      this.p2Card.classList.add('active-player-card');

      this.p1Badge.textContent = 'JOGADOR 1';
      this.p2Badge.textContent = 'JOGADOR 2';

      this.p1KeysHint.textContent = `Mover: ${p1MoveStr} • Atacar: [${fmt(C.P1_Attack)}] • Inv: [${fmt(C.P1_Inventory)}]`;
      this.p2KeysHint.textContent = `Mover: ${p2MoveStr} • Atacar: [${fmt(C.P2_Attack)}] • Inv: Scroll/[${fmt(C.P2_Inventory)}]`;
    }

    // Atualiza tags de atalho nas Hotbars e Painel Debug
    if (this.hudHintInvKey) this.hudHintInvKey.textContent = fmt(C.P1_Inventory);
    if (this.multiP1HotbarTag) {
      this.multiP1HotbarTag.innerHTML = `Slots <kbd>1</kbd>-<kbd>5</kbd> / <kbd>${fmt(C.P1_Inventory)}</kbd>`;
    }
    if (this.multiP2HotbarTag) {
      this.multiP2HotbarTag.innerHTML = `<kbd>Scroll</kbd> / <kbd>${fmt(C.P2_Inventory)}</kbd>`;
    }
    if (this.dbgKeyP1Atk) this.dbgKeyP1Atk.textContent = fmt(C.P1_Attack);
    if (this.dbgKeyP2Atk) this.dbgKeyP2Atk.textContent = fmt(C.P2_Attack);
    if (this.dbgKeySwitch) this.dbgKeySwitch.textContent = fmt(C.SwitchPlayer);
    if (this.dbgKeyInteract) this.dbgKeyInteract.textContent = fmt(C.Interact);

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

    // 5. Contador Global Persistente de Sucata / Lixo Coletado
    const scrapTotal = window.scrapCollected || 0;
    if (this.scrapCountEl) {
      this.scrapCountEl.textContent = String(scrapTotal);
    }
    if (this.dbgScrapCount) {
      this.dbgScrapCount.textContent = String(scrapTotal);
    }
    if (this.mapTrashRemainingEl) {
      if (currentStageMeta.isSafeRoom) {
        this.mapTrashRemainingEl.textContent = '(Safe Room)';
      } else {
        const remainingInMap = this.game.trashItems ? this.game.trashItems.length : 0;
        const totalInMap = currentMap.trashSpawns ? currentMap.trashSpawns.length : 0;
        this.mapTrashRemainingEl.textContent = `(Mapa: ${remainingInMap}/${totalInMap} restantes)`;
      }
    }

    // 6. Prompt de Interação na Zona de Extração, Porta da Van ou Estações da Safe Room (Loja / Craft)
    const activeStation = this.game.getTouchedSafeRoomStation();
    if (activeStation) {
      this.interactionPrompt.classList.remove('hidden');
      this.interactionPrompt.classList.add('station-prompt');
      this.interactionPrompt.textContent = activeStation.promptText;
    } else if (this.game.isAnyPlayerInTransitionZone()) {
      this.interactionPrompt.classList.remove('hidden');
      this.interactionPrompt.classList.remove('station-prompt');
      this.interactionPrompt.innerHTML = currentStageMeta.isSafeRoom
        ? `Na Porta da Van! Pressione <kbd>${fmt(C.Interact)}</kbd> ou <kbd>${fmt(C.InteractAlt)}</kbd> para Seguir Viagem →`
        : `Na Zona de Extração! Pressione <kbd>${fmt(C.Interact)}</kbd> ou <kbd>${fmt(C.InteractAlt)}</kbd> para entrar na Van →`;
    } else {
      this.interactionPrompt.classList.add('hidden');
      this.interactionPrompt.classList.remove('station-prompt');
    }

    // 7. Telemetria do Painel de Debug e Status do Gamepad
    this.dbgMode.textContent = gameMode === 'singleplayer' ? `Singleplayer (${fmt(C.SwitchPlayer)})` : 'Multiplayer Local';
    this.dbgState.textContent = `${currentStageMeta.stateId} (${currentStageMeta.stepIndex + 1}/5)`;
    this.dbgP1Pos.textContent = `${Math.round(p1.x)}, ${Math.round(p1.y)}`;
    this.dbgP2Pos.textContent = `${Math.round(p2.x)}, ${Math.round(p2.y)}`;
    this.updateGamepadStatusBanner();
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

    if (this.pauseScrapStatus) {
      this.pauseScrapStatus.textContent = `♻ Lixo Coletado (Persistência Global): ${window.scrapCollected || 0}`;
    }

    this._updatePlayerCard(this.pauseP1HpLabel, this.pauseP1HpFill, p1);
    this._renderPauseCharacterGrid(this.pauseP1ItemsGrid, p1);

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
