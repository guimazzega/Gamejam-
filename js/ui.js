/**
 * js/ui.js
 * Gerenciador de Interfaces:
 * - HUD Exclusivo: Apenas Vida (Health) e Tempo (Time) no gameplay
 * - Loja da Van: Arsenal com 3 Armas Melee (Bastão, Barra de Ferro, Katana)
 * - Telas de Transição, Estatísticas, Menu Principal, Pausa e Vitória ("Obrigado por jogar!")
 * - Remoção completa de hotbars, inventário e ferramentas de dev
 */

window.UIManager = class UIManager {
  constructor(game) {
    this.game = game;
    this.toastTimeout = null;
    this.activeSettingsTab = 'general';

    // Lista estruturada de ações exibidas na Aba "Controles"
    this.rebindableActions = [
      { key: 'P1_Up', label: 'Mover Cima (P1)', group: 'Jogador 1 / Principal', desc: 'Move o personagem para Cima' },
      { key: 'P1_Down', label: 'Mover Baixo (P1)', group: 'Jogador 1 / Principal', desc: 'Move o personagem para Baixo' },
      { key: 'P1_Left', label: 'Mover Esquerda (P1)', group: 'Jogador 1 / Principal', desc: 'Move o personagem para a Esquerda' },
      { key: 'P1_Right', label: 'Mover Direita (P1)', group: 'Jogador 1 / Principal', desc: 'Move o personagem para a Direita' },
      { key: 'P1_Attack', label: 'Atacar (P1)', group: 'Jogador 1 / Principal', desc: 'No Singleplayer o Botão Esquerdo do Mouse mira e ataca' },
      { key: 'P2_Up', label: 'Mover Cima (P2)', group: 'Jogador 2 (Multiplayer Local)', desc: 'Move o Jogador 2 para Cima' },
      { key: 'P2_Down', label: 'Mover Baixo (P2)', group: 'Jogador 2 (Multiplayer Local)', desc: 'Move o Jogador 2 para Baixo' },
      { key: 'P2_Left', label: 'Mover Esquerda (P2)', group: 'Jogador 2 (Multiplayer Local)', desc: 'Move o Jogador 2 para a Esquerda' },
      { key: 'P2_Right', label: 'Mover Direita (P2)', group: 'Jogador 2 (Multiplayer Local)', desc: 'Move o Jogador 2 para a Direita' },
      { key: 'P2_Attack', label: 'Atacar (P2)', group: 'Jogador 2 (Multiplayer Local)', desc: 'Executa o ataque do Jogador 2' },
      { key: 'Interact', label: 'Interagir (Saída / Hub)', group: 'Ações Gerais', desc: 'Interage com Porta da Van, Loja e Zonas de Extração' },
      { key: 'SwitchPlayer', label: 'Alternar Personagem (Single)', group: 'Ações Gerais', desc: 'Troca imediatamente entre P1 e P2 no Singleplayer' }
    ];

    // Referências de Camadas / Overlays
    this.hudLayer = document.getElementById('hud-layer');
    this.mainMenuOverlay = document.getElementById('main-menu-overlay');
    this.settingsModalOverlay = document.getElementById('settings-modal-overlay');
    this.pauseMenuOverlay = document.getElementById('pause-menu-overlay');
    this.gameToast = document.getElementById('game-toast') || document.getElementById('debug-toast');

    // Tela de Estatísticas da Fase
    this.stageStatsModal = document.getElementById('stage-stats-modal-overlay');
    this.statsStageTitle = document.getElementById('stats-stage-title');
    this.statsStageSubtitle = document.getElementById('stats-stage-subtitle');
    this.statsTrashValue = document.getElementById('stats-trash-value');
    this.statsEnemiesCard = document.getElementById('stats-enemies-card');
    this.statsEnemiesValue = document.getElementById('stats-enemies-value');
    this.statsTimeValue = document.getElementById('stats-time-value');
    this.statsRankBadge = document.getElementById('stats-rank-badge');
    this.statsRankDesc = document.getElementById('stats-rank-desc');
    this.btnCloseStats = document.getElementById('btn-close-stats');

    // Modal de Transição / Escolha da Van
    this.vanTransitionModal = document.getElementById('van-transition-modal-overlay');
    this.btnVanNextStage = document.getElementById('btn-van-next-stage');
    this.btnVanReplayStage = document.getElementById('btn-van-replay-stage');
    this.btnVanStay = document.getElementById('btn-van-stay');
    this.vanNextStageDesc = document.getElementById('van-next-stage-desc');
    this.vanReplayStageDesc = document.getElementById('van-replay-stage-desc');

    // Loja (Shop) de Armas Melee
    this.shopModal = document.getElementById('shop-modal-overlay');
    this.shopScrapBalance = document.getElementById('shop-scrap-balance');
    this.shopWeaponsGrid = document.getElementById('shop-weapons-grid');
    this.btnCloseShop = document.getElementById('btn-close-shop');

    // Mural de Avisos
    this.noticeBoardModal = document.getElementById('notice-board-modal-overlay');
    this.btnCloseNoticeBoard = document.getElementById('btn-close-notice-board');

    // Modal de Game Over
    this.gameoverModal = document.getElementById('gameover-modal-overlay');
    this.gameoverDesc = document.getElementById('gameover-desc');
    this.gameoverTimeValue = document.getElementById('gameover-time-value');
    this.gameoverTrashValue = document.getElementById('gameover-trash-value');
    this.btnGameoverRestart = document.getElementById('btn-gameover-restart');
    this.btnGameoverMenu = document.getElementById('btn-gameover-menu');

    // Referências Barra do Chefe da Fase 3
    this.bossContainer = document.getElementById('hud-boss-container');
    this.bossNameEl = document.getElementById('hud-boss-name');
    this.bossStageBadgeEl = document.getElementById('hud-boss-stage-badge');
    this.bossHpTextEl = document.getElementById('hud-boss-hp-text');
    this.bossHpBarEl = document.getElementById('hud-boss-hp-bar');

    // Modal de Vitória Definitiva
    this.victoryModal = document.getElementById('victory-modal-overlay');
    this.victoryTimeValue = document.getElementById('victory-time-value');
    this.victoryTrashValue = document.getElementById('victory-trash-value');
    this.btnVictoryAdvance = document.getElementById('btn-victory-advance');

    // Referências HUD - HP Cards (Vida)
    this.p1Card = document.getElementById('hud-p1-card');
    this.p1Badge = document.getElementById('hud-p1-badge');
    this.p1HpText = document.getElementById('hud-p1-hp-text');
    this.p1HpBar = document.getElementById('hud-p1-hp-bar');

    this.p2Card = document.getElementById('hud-p2-card');
    this.p2Badge = document.getElementById('hud-p2-badge');
    this.p2HpText = document.getElementById('hud-p2-hp-text');
    this.p2HpBar = document.getElementById('hud-p2-hp-bar');

    // Referências HUD - Tempo (Time)
    this.timerBox = document.getElementById('hud-timer-box');
    this.timerValue = document.getElementById('hud-timer-value');

    // Referências Menu Principal
    this.btnModeSingle = document.getElementById('btn-mode-single');
    this.btnModeMulti = document.getElementById('btn-mode-multi');
    this.btnStartGame = document.getElementById('btn-start-game');
    this.btnOpenSettings = document.getElementById('btn-open-settings');

    // Referências Modal de Configurações
    this.btnCloseSettings = document.getElementById('btn-close-settings');
    this.tabBtnGeneral = document.getElementById('tab-btn-general');
    this.tabBtnControls = document.getElementById('tab-btn-controls');
    this.tabPaneGeneral = document.getElementById('settings-tab-general');
    this.tabPaneControls = document.getElementById('settings-tab-controls');
    this.keybindingListEl = document.getElementById('keybinding-list');
    this.btnResetControls = document.getElementById('btn-reset-controls');
    this.settingsGamepadStatus = document.getElementById('settings-gamepad-status');

    this.toggleColorblind = document.getElementById('toggle-colorblind');
    this.badgeColorblindState = document.getElementById('badge-colorblind-state');
    this.toggleFullscreen = document.getElementById('toggle-fullscreen');
    this.badgeFullscreenState = document.getElementById('badge-fullscreen-state');
    this.toggleMute = document.getElementById('toggle-mute');
    this.badgeMuteState = document.getElementById('badge-mute-state');
    this.toggleFriendlyFire = document.getElementById('toggle-friendly-fire');
    this.badgeFriendlyFireState = document.getElementById('badge-friendly-fire-state');
    this.btnOpenUiEditor = document.getElementById('btn-open-ui-editor');

    // Referências Menu de Pausa
    this.pauseMapName = document.getElementById('pause-map-name');
    this.pauseTimerStatus = document.getElementById('pause-timer-status');
    this.pauseP1HpLabel = document.getElementById('pause-p1-hp-label');
    this.pauseP1HpFill = document.getElementById('pause-p1-hp-fill');
    this.pauseP2HpLabel = document.getElementById('pause-p2-hp-label');
    this.pauseP2HpFill = document.getElementById('pause-p2-hp-fill');

    this.btnResumeGame = document.getElementById('btn-resume-game');
    this.btnPauseSettings = document.getElementById('btn-pause-settings');
    this.btnRestartStage = document.getElementById('btn-restart-stage');
    this.btnQuitToMenu = document.getElementById('btn-quit-to-menu');

    this._bindEvents();
    this.syncSettingsUI();
    this.renderKeybindingList();
  }

  _bindEvents() {
    this.btnModeSingle.addEventListener('click', () => {
      this.selectMenuMode('singleplayer');
    });

    this.btnModeMulti.addEventListener('click', () => {
      this.selectMenuMode('multiplayer');
    });

    this.btnStartGame.addEventListener('click', () => {
      this.game.startNewGame();
    });

    this.btnOpenSettings.addEventListener('click', () => {
      this.openSettingsModal();
    });

    if (this.btnPauseSettings) {
      this.btnPauseSettings.addEventListener('click', () => {
        this.openSettingsModal();
      });
    }

    this.btnCloseSettings.addEventListener('click', () => {
      this.closeSettingsModal();
    });

    if (this.btnOpenUiEditor) {
      this.btnOpenUiEditor.addEventListener('click', () => {
        this.closeSettingsModal();
        if (this.game.uiEditor) {
          this.game.uiEditor.open();
        }
      });
    }

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

    if (this.btnResetControls) {
      this.btnResetControls.addEventListener('click', () => {
        this.game.input.cancelKeyRebind();
        if (window.GameConfig) window.GameConfig.resetDefaultControls();
        this.renderKeybindingList();
        this.updateHUD();
        this.showToast('Controles restaurados para os padrões!', 1800);
      });
    }

    if (this.toggleColorblind) {
      this.toggleColorblind.addEventListener('change', () => {
        this.setColorblindMode(Boolean(this.toggleColorblind.checked));
      });
    }

    if (this.toggleFullscreen) {
      this.toggleFullscreen.addEventListener('change', () => {
        this.handleFullscreenToggle(this.toggleFullscreen.checked);
      });
    }

    document.addEventListener('fullscreenchange', () => {
      this.syncSettingsUI();
    });

    if (this.toggleMute) {
      this.toggleMute.addEventListener('change', () => {
        window.isMuted = Boolean(this.toggleMute.checked);
        this.syncSettingsUI();
        this.showToast(`Áudio ${window.isMuted ? 'MUTADO' : 'ATIVADO'}`, 1600);
      });
    }

    if (this.toggleFriendlyFire) {
      this.toggleFriendlyFire.addEventListener('change', () => {
        window.friendlyFireEnabled = Boolean(this.toggleFriendlyFire.checked);
        this.syncSettingsUI();
        this.showToast(`Fogo Amigo: ${window.friendlyFireEnabled ? 'ON' : 'OFF'}`, 1600);
      });
    }

    this.btnResumeGame.addEventListener('click', () => {
      this.game.togglePause(false);
    });

    this.btnRestartStage.addEventListener('click', () => {
      this.game.restartCurrentStage();
    });

    this.btnQuitToMenu.addEventListener('click', () => {
      this.game.returnToMainMenu();
    });

    if (this.btnCloseStats) {
      this.btnCloseStats.addEventListener('click', () => {
        this.hideStageStats();
        this.game.dismissStageStatsAndResume();
      });
    }

    if (this.btnVanNextStage) {
      this.btnVanNextStage.addEventListener('click', () => {
        this.hideVanTransitionChoice();
        this.game.confirmVanAdvanceToNext();
      });
    }

    if (this.btnVanReplayStage) {
      this.btnVanReplayStage.addEventListener('click', () => {
        this.hideVanTransitionChoice();
        this.game.confirmVanReplayPrevious();
      });
    }

    if (this.btnVanStay) {
      this.btnVanStay.addEventListener('click', () => {
        this.hideVanTransitionChoice();
      });
    }

    if (this.btnCloseShop) {
      this.btnCloseShop.addEventListener('click', () => {
        this.hideShopModal();
      });
    }

    if (this.btnCloseNoticeBoard) {
      this.btnCloseNoticeBoard.addEventListener('click', () => {
        this.hideNoticeBoardModal();
      });
    }

    if (this.btnGameoverRestart) {
      this.btnGameoverRestart.addEventListener('click', () => {
        this.hideGameOver();
        this.game.restartCurrentStage();
      });
    }

    if (this.btnGameoverMenu) {
      this.btnGameoverMenu.addEventListener('click', () => {
        this.hideGameOver();
        this.game.returnToMainMenu();
      });
    }

    if (this.btnVictoryAdvance) {
      this.btnVictoryAdvance.addEventListener('click', () => {
        this.hideVictoryModal();
        if (typeof this.game.advanceToFinalVanAfterVictory === 'function') {
          this.game.advanceToFinalVanAfterVictory();
        }
      });
    }
  }

  setColorblindMode(enabled) {
    window.colorblindMode = enabled;
    const canvas = document.getElementById('game-canvas');
    if (canvas) {
      canvas.classList.toggle('colorblind-mode', enabled);
    }
    this.syncSettingsUI();
    this.showToast(`Modo Daltônico: ${enabled ? 'ATIVADO' : 'DESATIVADO'}`, 1800);
  }

  showStageStats(stats) {
    if (!this.stageStatsModal) return;

    this.statsStageTitle.textContent = `Estatísticas: ${stats.stageName || 'Fase Concluída'}`;
    this.statsStageSubtitle.textContent = `Relatório da equipe após extração para a Van de Operações:`;

    this.statsTrashValue.textContent = `${stats.trashCollected} / ${stats.trashTotal}`;

    if (stats.isMap1) {
      this.statsEnemiesCard.classList.add('hidden');
    } else {
      this.statsEnemiesCard.classList.remove('hidden');
      this.statsEnemiesValue.textContent = `${stats.enemiesDefeated} Abates`;
    }

    this.statsTimeValue.textContent = this.formatTime(stats.timeSpent);

    const rank = stats.rank || 'S';
    this.statsRankBadge.textContent = rank;
    this.statsRankBadge.className = 'rank-badge';

    if (rank === 'S+') {
      this.statsRankBadge.classList.add('rank-s-plus');
      this.statsRankDesc.textContent = 'Velocidade Lendária!';
    } else if (rank === 'S') {
      this.statsRankBadge.classList.add('rank-s');
      this.statsRankDesc.textContent = 'Excelente ritmo!';
    } else if (rank === 'A') {
      this.statsRankBadge.classList.add('rank-a');
      this.statsRankDesc.textContent = 'Bom desempenho tático!';
    } else {
      this.statsRankBadge.classList.add('rank-b');
      this.statsRankDesc.textContent = 'Ritmo cauteloso.';
    }

    this.stageStatsModal.classList.remove('hidden');
  }

  hideStageStats() {
    if (this.stageStatsModal) {
      this.stageStatsModal.classList.add('hidden');
    }
  }

  showGameOver(stats = {}) {
    if (!this.gameoverModal) return;

    if (this.gameoverTimeValue) {
      const minutes = Math.floor((stats.timeSpent || 0) / 60);
      const seconds = Math.floor((stats.timeSpent || 0) % 60);
      this.gameoverTimeValue.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    if (this.gameoverTrashValue) {
      this.gameoverTrashValue.textContent = `${stats.trashCollected || 0} / ${stats.trashTotal || 0}`;
    }

    if (this.gameoverDesc) {
      if (stats.reason === 'WATER_FLOOD') {
        this.gameoverDesc.textContent =
          'O cronômetro esgotou e a água subiu completamente, submergindo a expedição!';
      } else if (stats.reason === 'DEFEATED') {
        this.gameoverDesc.textContent =
          'Os operadores foram derrotados pelas ameaças do setor! A expedição falhou.';
      } else {
        this.gameoverDesc.textContent =
          'A expedição falhou e o tempo da missão foi esgotado!';
      }
    }

    this.hidePauseMenu();
    this.hideSettingsModal();
    this.hideStageStats();
    this.hideVanTransitionChoice();

    this.gameoverModal.classList.remove('hidden');
  }

  hideGameOver() {
    if (this.gameoverModal) {
      this.gameoverModal.classList.add('hidden');
    }
  }

  showVictoryModal(stats = {}) {
    if (!this.victoryModal) return;

    if (this.victoryTimeValue) {
      this.victoryTimeValue.textContent = this.formatTime(stats.timeSpent || 0);
    }
    if (this.victoryTrashValue) {
      this.victoryTrashValue.textContent = String(window.scrapCollected || 0);
    }

    this.hideGameOver();
    this.hideStageStats();
    this.hideVanTransitionChoice();
    this.hideShopModal();
    this.hideNoticeBoardModal();

    this.victoryModal.classList.remove('hidden');
  }

  hideVictoryModal() {
    if (this.victoryModal) {
      this.victoryModal.classList.add('hidden');
    }
  }

  showVanTransitionChoice(nextMeta, replayMeta) {
    if (!this.vanTransitionModal) return;

    if (nextMeta && this.vanNextStageDesc) {
      this.vanNextStageDesc.textContent = `Avança para ${nextMeta.label}.`;
    }
    if (replayMeta && this.vanReplayStageDesc) {
      this.vanReplayStageDesc.textContent = `Reinicia ${replayMeta.label}.`;
    }

    this.vanTransitionModal.classList.remove('hidden');
  }

  hideVanTransitionChoice() {
    if (this.vanTransitionModal) {
      this.vanTransitionModal.classList.add('hidden');
    }
  }

  /**
   * Renderiza e exibe a Loja da Expedição com as 3 armas de curta distância:
   * 1. Bastão (básica)
   * 2. Barra de Ferro (+10% de dano sobre o Bastão)
   * 3. Katana (+10% de dano sobre a Barra de Ferro)
   */
  showShopModal() {
    if (!this.shopModal) return;
    this.renderShop();
    this.shopModal.classList.remove('hidden');
  }

  hideShopModal() {
    if (this.shopModal) {
      this.shopModal.classList.add('hidden');
    }
  }

  renderShop() {
    if (this.shopScrapBalance) {
      this.shopScrapBalance.textContent = String(window.scrapCollected || 0);
    }

    if (!this.shopWeaponsGrid) return;
    this.shopWeaponsGrid.innerHTML = '';

    const weapons = window.GameConfig ? window.GameConfig.WEAPONS : {};
    const weaponKeys = ['baton', 'iron_bar', 'katana'];
    const currentScrap = window.scrapCollected || 0;
    const equippedId = window.GlobalState.equippedWeaponId;

    weaponKeys.forEach((key) => {
      const w = weapons[key];
      if (!w) return;

      const isEquipped = equippedId === w.id;
      const isUnlocked = window.GlobalState.isWeaponUnlocked(w.id);
      const canAfford = currentScrap >= w.price;

      const itemCard = document.createElement('div');
      itemCard.className = `shop-weapon-card ${isEquipped ? 'weapon-equipped' : ''}`;

      const dmgLabel = Number.isInteger(w.damage) ? `${w.damage}` : w.damage.toFixed(1);

      let actionButtonHtml = '';
      if (isEquipped) {
        actionButtonHtml = `<button type="button" class="stardew-btn btn-sm btn-equipped" disabled>✓ Equipado</button>`;
      } else if (isUnlocked) {
        actionButtonHtml = `<button type="button" class="stardew-btn btn-sm btn-primary btn-equip-action" data-weapon-id="${w.id}">Equipar</button>`;
      } else {
        actionButtonHtml = `<button type="button" class="stardew-btn btn-sm ${canAfford ? 'btn-warning' : 'btn-disabled'} btn-buy-action" data-weapon-id="${w.id}" ${canAfford ? '' : 'disabled'}>Comprar (${w.price} ♻)</button>`;
      }

      itemCard.innerHTML = `
        <div class="shop-weapon-icon" style="border-color: ${w.color};">${w.icon}</div>
        <div class="shop-weapon-details">
          <div class="shop-weapon-title-row">
            <strong class="shop-weapon-name">${w.name}</strong>
            <span class="shop-weapon-damage-tag" style="background: ${w.color}22; color: ${w.color}; border: 1px solid ${w.color}66;">Dano: ${dmgLabel}</span>
          </div>
          <p class="shop-weapon-desc">${w.desc}</p>
          <small class="shop-weapon-bonus">${w.bonusLabel}</small>
        </div>
        <div class="shop-weapon-action">
          ${actionButtonHtml}
        </div>
      `;

      // Event listener do botão de ação
      const btn = itemCard.querySelector('.btn-equip-action, .btn-buy-action');
      if (btn && !btn.disabled) {
        btn.addEventListener('click', () => {
          const res = window.GlobalState.buyOrEquipWeapon(w.id);
          if (res.success) {
            if (res.action === 'PURCHASED') {
              this.showToast(`Adquiriu e equipou ${w.name}!`, 2000);
            } else {
              this.showToast(`Equipou ${w.name}!`, 1800);
            }
            this.renderShop();
            this.updateHUD();
          } else {
            if (res.reason === 'INSUFFICIENT_SCRAP') {
              this.showToast(`Lixo insuficiente! Precisa de ${w.price} ♻.`, 2200);
            }
          }
        });
      }

      this.shopWeaponsGrid.appendChild(itemCard);
    });
  }

  showNoticeBoardModal() {
    if (this.noticeBoardModal) {
      this.noticeBoardModal.classList.remove('hidden');
    }
  }

  hideNoticeBoardModal() {
    if (this.noticeBoardModal) {
      this.noticeBoardModal.classList.add('hidden');
    }
  }

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

  renderKeybindingList() {
    if (!this.keybindingListEl) return;
    this.keybindingListEl.innerHTML = '';

    const C = (window.GameConfig && window.GameConfig.Controls) || {};
    const listeningKey = this.game.input.rebindingAction;

    this.rebindableActions.forEach((item) => {
      const currentCode = C[item.key];
      const formattedKey = window.GameConfig ? window.GameConfig.formatKeyCode(currentCode) : currentCode;
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
          <div class="keybind-action-desc">${item.desc}</div>
        </div>
        <div class="keybind-badge-wrapper">
          <span class="keybind-key-badge ${isListening ? 'badge-listening' : ''}">
            ${isListening ? '⌨ Pressione uma tecla...' : formattedKey}
          </span>
          <small class="keybind-raw-code">${isListening ? 'Aguardando' : currentCode}</small>
        </div>
      `;

      row.addEventListener('click', () => {
        if (this.game.input.rebindingAction === item.key) {
          this.game.input.cancelKeyRebind();
          this.renderKeybindingList();
          return;
        }

        this.game.input.startKeyRebind(item.key, (actionKey, newCode) => {
          this.renderKeybindingList();
          this.updateHUD();
          const keyName = window.GameConfig ? window.GameConfig.formatKeyCode(newCode) : newCode;
          this.showToast(`[${item.label}] remapeado para "${keyName}"!`, 2000);
        });

        this.renderKeybindingList();
      });

      this.keybindingListEl.appendChild(row);
    });
  }

  updateGamepadStatusBanner() {
    const pads = this.game.input.connectedGamepadsInfo || [];
    if (this.settingsGamepadStatus) {
      if (pads.length === 0) {
        this.settingsGamepadStatus.textContent = 'Nenhum controle ativo';
        this.settingsGamepadStatus.className = 'gamepad-status-pill status-idle';
      } else {
        const summary = pads.map((p) => `#${p.index + 1}: ${p.profileLabel}`).join(' | ');
        this.settingsGamepadStatus.textContent = `${pads.length} Conectado(s) — ${summary}`;
        this.settingsGamepadStatus.className = 'gamepad-status-pill status-connected';
      }
    }
  }

  openSettingsModal() {
    this.syncSettingsUI();
    this.renderKeybindingList();
    this.updateGamepadStatusBanner();
    this.settingsModalOverlay.classList.remove('hidden');
  }

  closeSettingsModal() {
    this.game.input.cancelKeyRebind();
    this.settingsModalOverlay.classList.add('hidden');
  }

  isSettingsModalOpen() {
    return !this.settingsModalOverlay.classList.contains('hidden');
  }

  handleFullscreenToggle(shouldEnterFullscreen) {
    if (shouldEnterFullscreen && !document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement
          .requestFullscreen()
          .then(() => {
            this.syncSettingsUI();
            this.showToast('Tela Cheia: ON', 1500);
          })
          .catch(() => {
            this.syncSettingsUI();
          });
      }
    } else if (!shouldEnterFullscreen && document.fullscreenElement) {
      if (document.exitFullscreen) {
        document
          .exitFullscreen()
          .then(() => {
            this.syncSettingsUI();
            this.showToast('Tela Cheia: OFF', 1500);
          })
          .catch(() => {
            this.syncSettingsUI();
          });
      }
    }
  }

  syncSettingsUI() {
    const isColorblind = Boolean(window.colorblindMode);
    if (this.toggleColorblind) {
      this.toggleColorblind.checked = isColorblind;
    }
    this._updateBadge(this.badgeColorblindState, isColorblind);

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
    this.hideStageStats();
    this.hideVanTransitionChoice();
    this.hideShopModal();
    this.hideNoticeBoardModal();
    this.hideVictoryModal();
    this.hudLayer.classList.add('hidden');
  }

  showGameplayHUD() {
    this.mainMenuOverlay.classList.add('hidden');
    this.settingsModalOverlay.classList.add('hidden');
    this.pauseMenuOverlay.classList.add('hidden');
    this.hudLayer.classList.remove('hidden');

    const isMulti = this.game.gameMode === 'multiplayer';
    this.hudLayer.classList.toggle('multiplayer-hud', isMulti);

    this.updateHUD();
  }

  showPauseMenu(isPaused) {
    if (isPaused) {
      this.updatePausePanel();
      this.pauseMenuOverlay.classList.remove('hidden');
    } else {
      this.game.input.cancelKeyRebind();
      this.pauseMenuOverlay.classList.add('hidden');
      this.settingsModalOverlay.classList.add('hidden');
    }
  }

  hidePauseMenu() {
    this.showPauseMenu(false);
  }

  hideSettingsModal() {
    this.closeSettingsModal();
  }

  /**
   * Atualiza a HUD in-game: Exclusivamente Vida e Tempo
   */
  updateHUD() {
    const { p1, p2, gameMode, activePlayerIndex, stageTimeRemaining } = this.game;
    const currentStageMeta = this.game.getCurrentStageMeta();

    this.hudLayer.classList.toggle('multiplayer-hud', gameMode === 'multiplayer');

    // 1. Barras de Vida (HP)
    if (this.p1HpText && this.p1HpBar) {
      this._updatePlayerCard(this.p1HpText, this.p1HpBar, p1);
    }
    if (this.p2HpText && this.p2HpBar) {
      this._updatePlayerCard(this.p2HpText, this.p2HpBar, p2);
    }

    // Destaque P1/P2
    if (gameMode === 'singleplayer') {
      const p1Active = activePlayerIndex === 0;
      if (this.p1Card) this.p1Card.classList.toggle('active-player-card', p1Active);
      if (this.p2Card) this.p2Card.classList.toggle('active-player-card', !p1Active);

      if (this.p1Badge) this.p1Badge.textContent = p1Active ? 'ATIVO' : 'COMPANHEIRA';
      if (this.p2Badge) this.p2Badge.textContent = !p1Active ? 'ATIVO' : 'COMPANHEIRA';
    } else {
      if (this.p1Card) this.p1Card.classList.add('active-player-card');
      if (this.p2Card) this.p2Card.classList.add('active-player-card');
      if (this.p1Badge) this.p1Badge.textContent = 'JOGADOR 1';
      if (this.p2Badge) this.p2Badge.textContent = 'JOGADOR 2';
    }

    // 2. Cronômetro de Tempo (Time)
    if (this.timerBox && this.timerValue) {
      if (currentStageMeta && currentStageMeta.isSafeRoom) {
        this.timerBox.classList.add('hidden');
      } else {
        this.timerBox.classList.remove('hidden');
        this.timerValue.textContent = this.formatTime(stageTimeRemaining);
        this.timerValue.classList.toggle('timer-warning', stageTimeRemaining <= 30);
      }
    }

    // 3. Barra do Chefe da Fase 3
    const boss = this.game.enemyManager ? this.game.enemyManager.boss : null;
    if (this.bossContainer) {
      if (boss && !boss.isDefeated && currentStageMeta && currentStageMeta.stateId === 'MAP_3') {
        this.bossContainer.classList.remove('hidden');
        if (this.bossNameEl) this.bossNameEl.textContent = boss.name;
        if (this.bossHpTextEl) this.bossHpTextEl.textContent = `${boss.hp} / ${boss.maxHp} HP`;
        if (this.bossHpBarEl) {
          const bossPct = Math.max(0, Math.min(100, (boss.hp / boss.maxHp) * 100));
          this.bossHpBarEl.style.width = `${bossPct}%`;
          this.bossHpBarEl.className = `boss-hp-bar-inner stage-${boss.stage}-bar`;
        }
        if (this.bossStageBadgeEl) {
          this.bossStageBadgeEl.textContent = `ESTÁGIO ${boss.stage}`;
        }
      } else {
        this.bossContainer.classList.add('hidden');
      }
    }
  }

  _updatePlayerCard(textEl, barEl, player) {
    if (!textEl || !barEl || !player) return;
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

  updatePausePanel() {
    const { p1, p2, stageTimeRemaining } = this.game;
    const currentStageMeta = this.game.getCurrentStageMeta();

    if (this.pauseMapName && currentStageMeta) {
      this.pauseMapName.textContent = currentStageMeta.label;
    }
    if (this.pauseTimerStatus && currentStageMeta) {
      this.pauseTimerStatus.textContent = currentStageMeta.isSafeRoom
        ? 'Safe Room (Van): Cronômetro Pausado'
        : `Tempo Restante: ${this.formatTime(stageTimeRemaining)}`;
    }

    this._updatePlayerCard(this.pauseP1HpLabel, this.pauseP1HpFill, p1);
    this._updatePlayerCard(this.pauseP2HpLabel, this.pauseP2HpFill, p2);
  }

  formatTime(seconds) {
    const clamped = Math.max(0, Math.ceil(seconds));
    const mins = Math.floor(clamped / 60);
    const secs = clamped % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  showToast(message, durationMs = 2200) {
    if (!this.gameToast) {
      this.gameToast = document.getElementById('game-toast') || document.getElementById('debug-toast');
    }
    if (!this.gameToast) return;

    this.gameToast.textContent = message;
    this.gameToast.classList.remove('hidden');
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      if (this.gameToast) this.gameToast.classList.add('hidden');
    }, durationMs);
  }

  /**
   * Carrega e aplica um layout de interface em formato JSON (Sprint 10),
   * permitindo que a State Machine monte a tela de Título ou da Van automaticamente.
   */
  loadUILayout(layoutData) {
    if (!layoutData) return;
    if (typeof layoutData === 'string') {
      try {
        layoutData = JSON.parse(layoutData);
      } catch (e) {
        console.error('Erro ao interpretar layout JSON:', e);
        return;
      }
    }
    if (this.game.uiEditor) {
      this.game.uiEditor.elements = (layoutData.elements || []).map((item, idx) => ({
        id: item.id || `node_${idx + 1}`,
        type: item.type || 'Panel',
        x: item.x || 0,
        y: item.y || 0,
        w: item.w || 120,
        h: item.h || 40,
        ...item
      }));
      this.showToast(`Layout carregado: ${layoutData.screenName || 'Interface'}!`);
    }
  }
};
