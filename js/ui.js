/**
 * js/ui.js
 * Gerenciador de Interfaces (Sprints 2, 3 e 4):
 * - HUD In-Game Dinâmica (Singleplayer vs Multiplayer Local com HUD separada)
 * - Hotbar Horizontal (Singleplayer) e Hotbars Verticais nas Bordas Laterais (Multiplayer)
 * - Contador de Sucata / Lixo Coletado e Lixos Restantes no Mapa
 * - Menu Principal, Menu de Pausa e Modal de Configurações com Abas (Geral + Remapeamento de Controles)
 * - Tela de Game Over ("Você Morreu" / "Tempo Esgotado" + botão único "Reiniciar Fase")
 * - Mesa de Crafting na Van (Maleta Espacial 8x4 estilo RE4 isolada na Van + Combinar Itens)
 * - Lojinha (Shop) na Van (Painel de Compra e Venda com Lixo/Moedas globais)
 */

window.UIManager = class UIManager {
  constructor(game) {
    this.game = game;
    this.toastTimeout = null;
    this.activeSettingsTab = 'general';

    // Estado interno da Mesa de Crafting (Maleta 8x4 na Van)
    this.selectedCraftingSlots = [];

    // Estado interno da Lojinha (Shop na Van)
    this.shopTargetPlayerId = 1;
    this.selectedShopCatalogId = null;
    this.selectedSellSlotIndex = null;

    // Referências de Camadas / Overlays
    this.hudLayer = document.getElementById('hud-layer');
    this.mainMenuOverlay = document.getElementById('main-menu-overlay');
    this.settingsModalOverlay = document.getElementById('settings-modal-overlay');
    this.pauseMenuOverlay = document.getElementById('pause-menu-overlay');
    this.gameOverOverlay = document.getElementById('gameover-overlay');
    this.craftingModalOverlay = document.getElementById('crafting-modal-overlay');
    this.shopModalOverlay = document.getElementById('shop-modal-overlay');
    this.debugToast = document.getElementById('debug-toast');

    // Referências Tela de Game Over (Sprint 4)
    this.gameOverTitle = document.getElementById('gameover-title');
    this.gameOverSubtitle = document.getElementById('gameover-subtitle');
    this.btnGameOverRestart = document.getElementById('btn-gameover-restart');

    // Referências Mesa de Crafting na Van - Maleta 8x4 (Sprint 4)
    this.craftingScrapTotal = document.getElementById('crafting-scrap-total');
    this.craftingSlotsUsed = document.getElementById('crafting-slots-used');
    this.craftingAttacheGrid = document.getElementById('crafting-attache-grid');
    this.craftSelSlot1 = document.getElementById('craft-sel-slot-1');
    this.craftSelSlot2 = document.getElementById('craft-sel-slot-2');
    this.craftResultPreview = document.getElementById('craft-result-preview');
    this.btnCraftCombine = document.getElementById('btn-craft-combine');
    this.btnCraftQuickCombine = document.getElementById('btn-craft-quick-combine');
    this.btnCraftAddDebugTrash = document.getElementById('btn-craft-add-debug-trash');
    this.btnCraftSortCase = document.getElementById('btn-craft-sort-case');
    this.craftingFeedbackLog = document.getElementById('crafting-feedback-log');
    this.btnCloseCrafting = document.getElementById('btn-close-crafting');

    // Referências Lojinha na Van (Sprint 4)
    this.shopScrapBalance = document.getElementById('shop-scrap-balance');
    this.btnShopAddDebugCoins = document.getElementById('btn-shop-add-debug-coins');
    this.btnShopTargetP1 = document.getElementById('btn-shop-target-p1');
    this.btnShopTargetP2 = document.getElementById('btn-shop-target-p2');
    this.shopCatalogList = document.getElementById('shop-catalog-list');
    this.shopBuySelectedInfo = document.getElementById('shop-buy-selected-info');
    this.btnShopBuy = document.getElementById('btn-shop-buy');
    this.shopSellInventoryList = document.getElementById('shop-sell-inventory-list');
    this.shopSellSelectedInfo = document.getElementById('shop-sell-selected-info');
    this.btnShopSell = document.getElementById('btn-shop-sell');
    this.shopConsoleLog = document.getElementById('shop-console-log');
    this.btnCloseShop = document.getElementById('btn-close-shop');

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

    // Referências HUD - Topo Central
    this.stageStepper = document.getElementById('hud-stage-stepper');
    this.mapTitle = document.getElementById('hud-map-title');
    this.timerBox = document.getElementById('hud-timer-box');
    this.timerValue = document.getElementById('hud-timer-value');
    this.saferoomBadge = document.getElementById('hud-saferoom-badge');
    this.scrapCountEl = document.getElementById('hud-scrap-count');
    this.mapTrashRemainingEl = document.getElementById('hud-map-trash-remaining');
    this.interactionPrompt = document.getElementById('hud-interaction-prompt');

    // Referências HUD - Hotbar Singleplayer
    this.singleHotbarWrapper = document.getElementById('hud-single-hotbar-wrapper');
    this.hotbarContainer = document.getElementById('hud-hotbar');
    this.selectedItemLabel = document.getElementById('hud-selected-item-label');
    this.hudHintInvKey = document.getElementById('hud-hint-inv-key');

    // Referências HUD - Hotbars Verticais Multiplayer
    this.multiHotbarP1Panel = document.getElementById('hud-multi-hotbar-p1');
    this.multiHotbarP1Slots = document.getElementById('hud-hotbar-p1-slots');
    this.multiP1SelectedLabel = document.getElementById('hud-p1-selected-label');

    this.multiHotbarP2Panel = document.getElementById('hud-multi-hotbar-p2');
    this.multiHotbarP2Slots = document.getElementById('hud-hotbar-p2-slots');
    this.multiP2SelectedLabel = document.getElementById('hud-p2-selected-label');

    // Referências HUD - Telemetria Debug
    this.dbgMode = document.getElementById('dbg-mode');
    this.dbgState = document.getElementById('dbg-state');
    this.dbgP1Pos = document.getElementById('dbg-p1-pos');
    this.dbgP2Pos = document.getElementById('dbg-p2-pos');
    this.dbgCamPos = document.getElementById('dbg-cam-pos');
    this.dbgScrapCount = document.getElementById('dbg-scrap-count');
    this.dbgGamepads = document.getElementById('dbg-gamepads');
    this.dbgKeyP1Atk = document.getElementById('dbg-key-p1-atk');
    this.dbgKeyP2Atk = document.getElementById('dbg-key-p2-atk');
    this.dbgKeySwitch = document.getElementById('dbg-key-switch');
    this.dbgKeyInteract = document.getElementById('dbg-key-interact');

    // Referências Menu Principal
    this.btnModeSingle = document.getElementById('btn-mode-single');
    this.btnModeMulti = document.getElementById('btn-mode-multi');
    this.btnStartGame = document.getElementById('btn-start-game');
    this.btnOpenSettings = document.getElementById('btn-open-settings');

    // Referências Modal de Configurações (Geral + Aba Controles / Keybinding)
    this.btnCloseSettings = document.getElementById('btn-close-settings');
    this.tabBtnGeneral = document.getElementById('tab-btn-general');
    this.tabBtnControls = document.getElementById('tab-btn-controls');
    this.settingsTabGeneral = document.getElementById('settings-tab-general');
    this.settingsTabControls = document.getElementById('settings-tab-controls');
    this.keybindActionsList = document.getElementById('keybind-actions-list');
    this.btnResetKeybinds = document.getElementById('btn-reset-keybinds');
    this.gamepadStatusBanner = document.getElementById('gamepad-status-banner');

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
    this.renderKeybindList();
  }

  _bindEvents() {
    // Seletor de Modo no Menu Principal
    if (this.btnModeSingle) {
      this.btnModeSingle.addEventListener('click', () => {
        this.selectMenuMode('singleplayer');
      });
    }
    if (this.btnModeMulti) {
      this.btnModeMulti.addEventListener('click', () => {
        this.selectMenuMode('multiplayer');
      });
    }

    // Iniciar Jogo
    if (this.btnStartGame) {
      this.btnStartGame.addEventListener('click', () => {
        this.game.startNewGame();
      });
    }

    // Abrir Configurações
    if (this.btnOpenSettings) {
      this.btnOpenSettings.addEventListener('click', () => {
        this.openSettingsModal();
      });
    }
    if (this.btnPauseSettings) {
      this.btnPauseSettings.addEventListener('click', () => {
        this.openSettingsModal();
      });
    }

    // Alternar Abas das Configurações (Geral vs Controles)
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

    // Restaurar Keybinds Padrão
    if (this.btnResetKeybinds) {
      this.btnResetKeybinds.addEventListener('click', () => {
        this.game.input.cancelKeyRebind();
        window.Config.resetControlsToDefault();
        this.renderKeybindList();
        this.renderHotbar();
        this.updateHUD();
        console.log('[Keybinding] Todos os controles foram restaurados para o padrão:', window.Config.Controls);
        this.showToast('Controles restaurados para o padrão!', 1800);
      });
    }

    // Fechar Configurações
    if (this.btnCloseSettings) {
      this.btnCloseSettings.addEventListener('click', () => {
        this.closeSettingsModal();
      });
    }

    // 1. Toggle Tela Cheia
    if (this.toggleFullscreen) {
      this.toggleFullscreen.addEventListener('change', () => {
        this.handleFullscreenToggle(this.toggleFullscreen.checked);
      });
    }

    document.addEventListener('fullscreenchange', () => {
      this.syncSettingsUI();
    });

    // 2. Toggle Muta/Desmuta Áudio
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

    // 3. Toggle Fogo Amigo
    if (this.toggleFriendlyFire) {
      this.toggleFriendlyFire.addEventListener('change', () => {
        window.friendlyFireEnabled = Boolean(this.toggleFriendlyFire.checked);
        this.syncSettingsUI();
        this.updateHUD();
        this.showToast(
          `Fogo Amigo: ${window.friendlyFireEnabled ? 'ON (friendlyFireEnabled = true)' : 'OFF (friendlyFireEnabled = false)'}`,
          1600
        );
      });
    }

    // Botões do Menu de Pausa
    if (this.btnResumeGame) {
      this.btnResumeGame.addEventListener('click', () => {
        this.game.togglePause(false);
      });
    }
    if (this.btnRestartStage) {
      this.btnRestartStage.addEventListener('click', () => {
        this.game.restartCurrentStage();
      });
    }
    if (this.btnQuitToMenu) {
      this.btnQuitToMenu.addEventListener('click', () => {
        this.game.returnToMainMenu();
      });
    }

    // Botão único da Tela de Game Over -> Reiniciar Fase
    if (this.btnGameOverRestart) {
      this.btnGameOverRestart.addEventListener('click', () => {
        this.game.restartCurrentStage();
      });
    }

    // Eventos da Mesa de Crafting na Van (Maleta 8x4)
    if (this.btnCloseCrafting) {
      this.btnCloseCrafting.addEventListener('click', () => {
        this.closeCraftingModal();
      });
    }
    if (this.btnCraftCombine) {
      this.btnCraftCombine.addEventListener('click', () => {
        this._handleCombineSelectedSlots();
      });
    }
    if (this.btnCraftQuickCombine) {
      this.btnCraftQuickCombine.addEventListener('click', () => {
        this._handleQuickCombineTrash();
      });
    }
    if (this.btnCraftAddDebugTrash) {
      this.btnCraftAddDebugTrash.addEventListener('click', () => {
        window.scrapCollected = (window.scrapCollected || 0) + 2;
        this._syncScrapIntoCraftingCase();
        this.renderCraftingModal();
        this.updateHUD();
        this._setCraftingLog('🔧 [Debug] +2 unidades de Lixo adicionadas à Maleta 8x4!');
      });
    }
    if (this.btnCraftSortCase) {
      this.btnCraftSortCase.addEventListener('click', () => {
        this._sortCraftingCase();
        this.renderCraftingModal();
        this._setCraftingLog('📦 Maleta 8x4 organizada automaticamente.');
      });
    }

    // Eventos da Lojinha (Shop) na Van
    if (this.btnCloseShop) {
      this.btnCloseShop.addEventListener('click', () => {
        this.closeShopModal();
      });
    }
    if (this.btnShopAddDebugCoins) {
      this.btnShopAddDebugCoins.addEventListener('click', () => {
        window.scrapCollected = (window.scrapCollected || 0) + 10;
        this.renderShopModal();
        this.updateHUD();
        this._setShopLog('[Shop Debug] +10 Lixos/Moedas adicionados ao saldo global.');
      });
    }
    if (this.btnShopTargetP1) {
      this.btnShopTargetP1.addEventListener('click', () => {
        this.shopTargetPlayerId = 1;
        this.selectedSellSlotIndex = null;
        this.renderShopModal();
      });
    }
    if (this.btnShopTargetP2) {
      this.btnShopTargetP2.addEventListener('click', () => {
        this.shopTargetPlayerId = 2;
        this.selectedSellSlotIndex = null;
        this.renderShopModal();
      });
    }
    if (this.btnShopBuy) {
      this.btnShopBuy.addEventListener('click', () => {
        this._handleBuySelectedItem();
      });
    }
    if (this.btnShopSell) {
      this.btnShopSell.addEventListener('click', () => {
        this._handleSellSelectedItem();
      });
    }
  }

  // =========================================================================
  // TELA DE GAME OVER (SPRINT 4)
  // =========================================================================
  showGameOver(titleText = 'Você Morreu', subtitleText = '') {
    if (!this.gameOverOverlay) return;
    if (this.gameOverTitle) {
      this.gameOverTitle.textContent = titleText;
    }
    if (this.gameOverSubtitle) {
      this.gameOverSubtitle.textContent =
        subtitleText || 'A expedição falhou. Pressione "Reiniciar Fase" para restaurar HP, Timer e retornar ao Spawn.';
    }
    this.pauseMenuOverlay.classList.add('hidden');
    this.settingsModalOverlay.classList.add('hidden');
    this.closeCraftingModal();
    this.closeShopModal();
    this.gameOverOverlay.classList.remove('hidden');
  }

  hideGameOver() {
    if (!this.gameOverOverlay) return;
    this.gameOverOverlay.classList.add('hidden');
  }

  // =========================================================================
  // MESA DE CRAFTING NA VAN - MALETA 8x4 ESTILO RE4 (SPRINT 4)
  // =========================================================================
  openCraftingModal() {
    if (!this.craftingModalOverlay) return;
    this.closeShopModal();
    this.selectedCraftingSlots = [];
    this._syncScrapIntoCraftingCase();
    this.renderCraftingModal();
    this.craftingModalOverlay.classList.remove('hidden');
    this.game.input.clearAll();
  }

  closeCraftingModal() {
    if (!this.craftingModalOverlay) return;
    this.craftingModalOverlay.classList.add('hidden');
    this.selectedCraftingSlots = [];
  }

  isCraftingModalOpen() {
    return Boolean(this.craftingModalOverlay && !this.craftingModalOverlay.classList.contains('hidden'));
  }

  /**
   * Sincroniza a quantidade de "Lixo" bruto na Maleta 8x4 com `window.scrapCollected`
   */
  _syncScrapIntoCraftingCase() {
    const grid = this.game.vanCraftingGrid;
    if (!Array.isArray(grid)) return;

    const targetRawCount = Math.max(0, Math.floor(window.scrapCollected || 0));
    let currentRawCount = 0;
    for (let i = 0; i < grid.length; i++) {
      if (grid[i] && grid[i].category === 'raw_trash') {
        currentRawCount++;
      }
    }

    // Se há mais Lixo global do que slots raw_trash na maleta, adiciona nos slots livres
    if (currentRawCount < targetRawCount) {
      const types = window.GameConfig.TRASH_TYPES;
      let toAdd = targetRawCount - currentRawCount;
      for (let i = 0; i < grid.length && toAdd > 0; i++) {
        if (!grid[i]) {
          const t = types[i % types.length];
          grid[i] = {
            id: `case_trash_${Date.now()}_${i}`,
            name: `Lixo (${t.name})`,
            shortName: 'Lixo',
            icon: t.icon || '♻',
            category: 'raw_trash',
            color: t.color || '#a3e635'
          };
          toAdd--;
        }
      }
    } else if (currentRawCount > targetRawCount) {
      // Se o jogador gastou Lixo na Lojinha, remove o excedente da maleta
      let toRemove = currentRawCount - targetRawCount;
      for (let i = grid.length - 1; i >= 0 && toRemove > 0; i--) {
        if (grid[i] && grid[i].category === 'raw_trash') {
          grid[i] = null;
          toRemove--;
        }
      }
    }
  }

  _sortCraftingCase() {
    const grid = this.game.vanCraftingGrid;
    const items = grid.filter(Boolean);
    for (let i = 0; i < grid.length; i++) {
      grid[i] = items[i] || null;
    }
    this.selectedCraftingSlots = [];
  }

  renderCraftingModal() {
    if (!this.craftingAttacheGrid) return;
    const grid = this.game.vanCraftingGrid;
    const totalSlots = grid.length;
    const usedSlots = grid.filter(Boolean).length;

    if (this.craftingScrapTotal) {
      this.craftingScrapTotal.textContent = String(window.scrapCollected || 0);
    }
    if (this.craftingSlotsUsed) {
      this.craftingSlotsUsed.textContent = `${usedSlots} / ${totalSlots}`;
    }

    this.craftingAttacheGrid.innerHTML = '';
    grid.forEach((cellItem, idx) => {
      const slotEl = document.createElement('button');
      slotEl.type = 'button';
      slotEl.className = 'attache-slot';
      if (cellItem) {
        slotEl.classList.add('occupied');
        if (cellItem.category !== 'raw_trash') {
          slotEl.classList.add('crafted-item');
        }
      }
      if (this.selectedCraftingSlots.includes(idx)) {
        slotEl.classList.add('selected-for-craft');
      }

      const row = Math.floor(idx / 8) + 1;
      const col = (idx % 8) + 1;
      const coordLabel = `${String.fromCharCode(64 + row)}${col}`;

      if (cellItem) {
        slotEl.innerHTML = `
          <span class="attache-coord">${coordLabel}</span>
          <span class="attache-icon">${cellItem.icon}</span>
          <span class="attache-name">${cellItem.shortName}</span>
        `;
      } else {
        slotEl.innerHTML = `
          <span class="attache-coord">${coordLabel}</span>
          <span class="attache-empty-dot">·</span>
        `;
      }

      slotEl.addEventListener('click', () => {
        this._toggleCraftingSlotSelection(idx);
      });

      this.craftingAttacheGrid.appendChild(slotEl);
    });

    this._updateCraftingWorkbenchPreview();
  }

  _toggleCraftingSlotSelection(slotIdx) {
    const grid = this.game.vanCraftingGrid;
    const item = grid[slotIdx];
    if (!item) {
      this._setCraftingLog('Slot vazio. Clique em um slot ocupado na Maleta 8x4 para selecioná-lo.');
      return;
    }

    const existingPos = this.selectedCraftingSlots.indexOf(slotIdx);
    if (existingPos >= 0) {
      this.selectedCraftingSlots.splice(existingPos, 1);
    } else {
      if (this.selectedCraftingSlots.length >= 2) {
        this.selectedCraftingSlots.shift();
      }
      this.selectedCraftingSlots.push(slotIdx);
    }

    this.renderCraftingModal();
  }

  _findMatchingRecipe(itemA, itemB) {
    if (!itemA || !itemB) return null;
    const recipes = window.GameConfig.CRAFTING_RECIPES || [];
    for (const r of recipes) {
      const [req1, req2] = r.requires;
      if (
        (itemA.category === req1 && itemB.category === req2) ||
        (itemA.category === req2 && itemB.category === req1)
      ) {
        return r;
      }
    }
    return null;
  }

  _updateCraftingWorkbenchPreview() {
    const grid = this.game.vanCraftingGrid;
    const idx1 = this.selectedCraftingSlots[0];
    const idx2 = this.selectedCraftingSlots[1];
    const item1 = idx1 !== undefined ? grid[idx1] : null;
    const item2 = idx2 !== undefined ? grid[idx2] : null;

    if (this.craftSelSlot1) {
      this.craftSelSlot1.textContent = item1 ? `${item1.icon} ${item1.name}` : '1º Slot: (Clique na grade)';
      this.craftSelSlot1.classList.toggle('filled', Boolean(item1));
    }
    if (this.craftSelSlot2) {
      this.craftSelSlot2.textContent = item2 ? `${item2.icon} ${item2.name}` : '2º Slot: (Clique na grade)';
      this.craftSelSlot2.classList.toggle('filled', Boolean(item2));
    }

    const recipe = this._findMatchingRecipe(item1, item2);
    if (this.craftResultPreview) {
      this.craftResultPreview.textContent = recipe
        ? `Resultado: ${recipe.icon} ${recipe.name}`
        : item1 && item2
          ? 'Combinação inválida'
          : 'Resultado: ---';
    }
    if (this.btnCraftCombine) {
      this.btnCraftCombine.disabled = !recipe;
    }
  }

  _handleCombineSelectedSlots() {
    if (this.selectedCraftingSlots.length < 2) {
      this._setCraftingLog('Selecione 2 itens na Maleta 8x4 para combinar.');
      return;
    }

    const grid = this.game.vanCraftingGrid;
    const [idx1, idx2] = this.selectedCraftingSlots;
    const item1 = grid[idx1];
    const item2 = grid[idx2];
    const recipe = this._findMatchingRecipe(item1, item2);

    if (!recipe) {
      this._setCraftingLog('Estes 2 itens não possuem receita compatível.');
      return;
    }

    // Desconta do contador global de Lixo cada ingrediente raw_trash consumido
    let rawConsumed = 0;
    if (item1.category === 'raw_trash') rawConsumed++;
    if (item2.category === 'raw_trash') rawConsumed++;
    if (rawConsumed > 0) {
      window.scrapCollected = Math.max(0, (window.scrapCollected || 0) - rawConsumed);
    }

    // Remove os 2 itens e coloca o item gerado no primeiro slot selecionado
    grid[idx2] = null;
    grid[idx1] = {
      id: `${recipe.id}_${Date.now()}`,
      name: recipe.name,
      shortName: recipe.shortName,
      icon: recipe.icon,
      type: recipe.type,
      category: recipe.category,
      color: recipe.color,
      sellValue: recipe.sellValue || 4
    };

    this.selectedCraftingSlots = [idx1];
    const msg = `✅ [Crafting Van] Combinou "${item1.shortName}" + "${item2.shortName}" → Gerou "${recipe.name}" no slot #${idx1 + 1}!`;
    console.log(msg);
    this._setCraftingLog(msg);
    this.renderCraftingModal();
    this.updateHUD();
    this.showToast(`Criado: ${recipe.name}!`, 1800);
  }

  _handleQuickCombineTrash() {
    const grid = this.game.vanCraftingGrid;
    const rawIndices = [];
    for (let i = 0; i < grid.length; i++) {
      if (grid[i] && grid[i].category === 'raw_trash') {
        rawIndices.push(i);
        if (rawIndices.length === 2) break;
      }
    }

    if (rawIndices.length < 2) {
      this._setCraftingLog('⚠️ São necessárias pelo menos 2 unidades de "Lixo" na Maleta 8x4 para combinar!');
      this.showToast('Coletar pelo menos 2 Lixos (ou clique em "+2 Lixos [Debug]")!', 2000);
      return;
    }

    this.selectedCraftingSlots = rawIndices;
    this._handleCombineSelectedSlots();
  }

  _setCraftingLog(text) {
    if (this.craftingFeedbackLog) {
      this.craftingFeedbackLog.textContent = text;
    }
  }

  // =========================================================================
  // LOJINHA (SHOP) NA VAN - COMPRA & VENDA (SPRINT 4)
  // =========================================================================
  openShopModal() {
    if (!this.shopModalOverlay) return;
    this.closeCraftingModal();
    this.shopTargetPlayerId = this.game.gameMode === 'singleplayer'
      ? this.game.players[this.game.activePlayerIndex].id
      : 1;
    const catalog = window.GameConfig.SHOP_ITEMS || [];
    if (!this.selectedShopCatalogId && catalog.length > 0) {
      this.selectedShopCatalogId = catalog[0].id;
    }
    this.selectedSellSlotIndex = null;
    this.renderShopModal();
    this.shopModalOverlay.classList.remove('hidden');
    this.game.input.clearAll();
  }

  closeShopModal() {
    if (!this.shopModalOverlay) return;
    this.shopModalOverlay.classList.add('hidden');
  }

  isShopModalOpen() {
    return Boolean(this.shopModalOverlay && !this.shopModalOverlay.classList.contains('hidden'));
  }

  _getShopTargetPlayer() {
    return this.shopTargetPlayerId === 2 ? this.game.p2 : this.game.p1;
  }

  renderShopModal() {
    if (!this.shopModalOverlay) return;
    const balance = window.scrapCollected || 0;
    if (this.shopScrapBalance) {
      this.shopScrapBalance.textContent = `${balance} Lixos`;
    }

    if (this.btnShopTargetP1 && this.btnShopTargetP2) {
      this.btnShopTargetP1.classList.toggle('active-tab', this.shopTargetPlayerId === 1);
      this.btnShopTargetP2.classList.toggle('active-tab', this.shopTargetPlayerId === 2);
    }

    // 1. Renderiza catálogo de Compra
    const catalog = window.GameConfig.SHOP_ITEMS || [];
    if (this.shopCatalogList) {
      this.shopCatalogList.innerHTML = '';
      catalog.forEach((shopItem) => {
        const row = document.createElement('button');
        row.type = 'button';
        row.className = 'shop-item-row';
        if (this.selectedShopCatalogId === shopItem.id) {
          row.classList.add('selected');
        }
        const canAfford = balance >= shopItem.cost;
        if (!canAfford) {
          row.classList.add('unaffordable');
        }

        row.innerHTML = `
          <div class="shop-item-left">
            <span class="shop-item-icon">${shopItem.icon}</span>
            <div>
              <div class="shop-item-title">${shopItem.name} - Custa ${shopItem.cost} Lixos</div>
              <div class="shop-item-desc">${shopItem.description}</div>
            </div>
          </div>
          <span class="shop-cost-pill">${shopItem.cost} ♻</span>
        `;

        row.addEventListener('click', () => {
          this.selectedShopCatalogId = shopItem.id;
          this.renderShopModal();
        });

        this.shopCatalogList.appendChild(row);
      });
    }

    const selectedCatalogItem = catalog.find((it) => it.id === this.selectedShopCatalogId) || null;
    if (this.shopBuySelectedInfo) {
      this.shopBuySelectedInfo.textContent = selectedCatalogItem
        ? `Selecionado: ${selectedCatalogItem.name} (Custo: ${selectedCatalogItem.cost} Lixos)`
        : 'Selecione um item da loja para comprar.';
    }
    if (this.btnShopBuy) {
      this.btnShopBuy.disabled = !selectedCatalogItem || balance < selectedCatalogItem.cost;
    }

    // 2. Renderiza inventário pessoal do jogador alvo para Venda
    const targetPlayer = this._getShopTargetPlayer();
    if (this.shopSellInventoryList) {
      this.shopSellInventoryList.innerHTML = '';
      targetPlayer.inventory.forEach((invItem, idx) => {
        const row = document.createElement('button');
        row.type = 'button';
        row.className = 'shop-item-row';
        if (this.selectedSellSlotIndex === idx) {
          row.classList.add('selected');
        }
        if (invItem.isEmpty) {
          row.classList.add('empty-row');
        }

        const sellPrice = invItem.isEmpty ? 0 : (invItem.sellValue || 3);
        row.innerHTML = `
          <div class="shop-item-left">
            <span class="shop-item-icon">${invItem.icon}</span>
            <div>
              <div class="shop-item-title">Slot ${idx + 1}: ${invItem.name}</div>
              <div class="shop-item-desc">${invItem.isEmpty ? 'Slot Livre (Nada para vender)' : `Valor de venda: +${sellPrice} Lixos`}</div>
            </div>
          </div>
          <span class="shop-sell-pill">${invItem.isEmpty ? '---' : `+${sellPrice} ♻`}</span>
        `;

        row.addEventListener('click', () => {
          this.selectedSellSlotIndex = idx;
          this.renderShopModal();
        });

        this.shopSellInventoryList.appendChild(row);
      });
    }

    const selectedInvItem =
      this.selectedSellSlotIndex !== null ? targetPlayer.inventory[this.selectedSellSlotIndex] : null;
    const canSell = Boolean(selectedInvItem && !selectedInvItem.isEmpty);
    if (this.shopSellSelectedInfo) {
      this.shopSellSelectedInfo.textContent = canSell
        ? `Vender: ${selectedInvItem.name} por +${selectedInvItem.sellValue || 3} Lixos`
        : 'Selecione um item ocupado do inventário para vender.';
    }
    if (this.btnShopSell) {
      this.btnShopSell.disabled = !canSell;
    }
  }

  _handleBuySelectedItem() {
    const catalog = window.GameConfig.SHOP_ITEMS || [];
    const shopItem = catalog.find((it) => it.id === this.selectedShopCatalogId);
    if (!shopItem) return;

    const balance = window.scrapCollected || 0;
    if (balance < shopItem.cost) {
      const warnMsg = `[Shop] Saldo insuficiente para comprar "${shopItem.name}" (Custa ${shopItem.cost} Lixos, possui ${balance}).`;
      console.log(warnMsg);
      this._setShopLog(warnMsg);
      return;
    }

    const targetPlayer = this._getShopTargetPlayer();

    // Desconta o valor global
    window.scrapCollected = balance - shopItem.cost;

    // Aplica efeito imediato (cura ou bônus de dano) e adiciona ao slot livre (ou substitui o slot selecionado se cheio)
    if (shopItem.healAmount) {
      targetPlayer.heal(shopItem.healAmount);
    }
    if (shopItem.bonusDamage) {
      targetPlayer.bonusDamage = (targetPlayer.bonusDamage || 0) + shopItem.bonusDamage;
    }

    const freeIdx = targetPlayer.inventory.findIndex((slot) => slot.isEmpty);
    const targetIdx = freeIdx >= 0 ? freeIdx : targetPlayer.selectedSlot;

    targetPlayer.inventory[targetIdx] = {
      slot: targetIdx + 1,
      id: `${shopItem.id}_${Date.now()}`,
      name: shopItem.name,
      shortName: shopItem.shortName,
      icon: shopItem.icon,
      type: shopItem.type,
      sellValue: shopItem.sellValue || Math.max(1, Math.floor(shopItem.cost / 2)),
      color: shopItem.color || '#facc15',
      isEmpty: false
    };

    const logMsg = `🛒 [SHOP COMPRA] ${targetPlayer.name} comprou "${shopItem.name}" por ${shopItem.cost} Lixos | Saldo restante: ${window.scrapCollected} Lixos | Equipado no Slot ${targetIdx + 1}`;
    console.log(logMsg);
    this._setShopLog(logMsg);

    this._syncScrapIntoCraftingCase();
    this.renderShopModal();
    this.renderHotbar();
    this.updateHUD();
    this.showToast(`Comprou: ${shopItem.name} (-${shopItem.cost} Lixos)`, 1800);
  }

  _handleSellSelectedItem() {
    const targetPlayer = this._getShopTargetPlayer();
    if (this.selectedSellSlotIndex === null) return;

    const slotIdx = this.selectedSellSlotIndex;
    const invItem = targetPlayer.inventory[slotIdx];
    if (!invItem || invItem.isEmpty) {
      this._setShopLog('[Shop] Este slot está vazio e não pode ser vendido.');
      return;
    }

    const sellValue = invItem.sellValue || 3;
    const soldName = invItem.name;

    window.scrapCollected = (window.scrapCollected || 0) + sellValue;

    targetPlayer.inventory[slotIdx] = {
      slot: slotIdx + 1,
      id: `empty_${targetPlayer.id}_${slotIdx + 1}`,
      name: 'Vazio',
      shortName: 'Vazio',
      icon: '·',
      type: 'Slot Livre',
      sellValue: 0,
      isEmpty: true,
      color: '#64748b'
    };

    const logMsg = `💰 [SHOP VENDA] ${targetPlayer.name} vendeu "${soldName}" (Slot ${slotIdx + 1}) por +${sellValue} Lixos | Novo saldo global: ${window.scrapCollected} Lixos`;
    console.log(logMsg);
    this._setShopLog(logMsg);

    this._syncScrapIntoCraftingCase();
    this.renderShopModal();
    this.renderHotbar();
    this.updateHUD();
    this.showToast(`Vendeu: ${soldName} (+${sellValue} Lixos)`, 1800);
  }

  _setShopLog(text) {
    if (this.shopConsoleLog) {
      this.shopConsoleLog.textContent = text;
    }
  }

  // =========================================================================
  // CONFIGURAÇÕES E REMAPEAMENTO DE CONTROLES (SPRINT 3)
  // =========================================================================
  switchSettingsTab(tabName) {
    this.game.input.cancelKeyRebind();
    this.activeSettingsTab = tabName === 'controls' ? 'controls' : 'general';

    if (this.tabBtnGeneral && this.tabBtnControls) {
      this.tabBtnGeneral.classList.toggle('active-tab', this.activeSettingsTab === 'general');
      this.tabBtnControls.classList.toggle('active-tab', this.activeSettingsTab === 'controls');
    }
    if (this.settingsTabGeneral && this.settingsTabControls) {
      this.settingsTabGeneral.classList.toggle('hidden', this.activeSettingsTab !== 'general');
      this.settingsTabControls.classList.toggle('hidden', this.activeSettingsTab !== 'controls');
    }

    if (this.activeSettingsTab === 'controls') {
      this.renderKeybindList();
      this.updateGamepadStatusBanner();
    }
  }

  renderKeybindList() {
    if (!this.keybindActionsList) return;
    this.keybindActionsList.innerHTML = '';

    const actionsMeta = window.GameConfig.CONTROL_ACTIONS_META || [];
    const controls = window.Config.Controls;
    const waitingAction = this.game.input.rebindTargetAction;

    actionsMeta.forEach((meta) => {
      const row = document.createElement('div');
      row.className = 'keybind-row';
      const isWaiting = waitingAction === meta.action;
      if (isWaiting) row.classList.add('waiting-key');

      const keyLabel = isWaiting
        ? 'Pressione uma tecla... [Esc cancela]'
        : window.Config.formatKeyCode(controls[meta.action]);

      row.innerHTML = `
        <div class="keybind-info">
          <div class="keybind-label">${meta.label}</div>
          <div class="keybind-desc">${meta.desc}</div>
        </div>
        <button type="button" class="keybind-btn ${isWaiting ? 'listening' : ''}" data-action="${meta.action}">
          ${keyLabel}
        </button>
      `;

      const btn = row.querySelector('.keybind-btn');
      btn.addEventListener('click', () => {
        this._startRebindingAction(meta.action, meta.label);
      });

      this.keybindActionsList.appendChild(row);
    });
  }

  _startRebindingAction(actionKey, actionLabel) {
    this.game.input.startKeyRebind(actionKey, (action, newCode, cancelled) => {
      this.renderKeybindList();
      this.renderHotbar();
      this.updateHUD();
      if (cancelled) {
        this.showToast(`Remapeamento de "${actionLabel}" cancelado.`, 1400);
      } else {
        this.showToast(
          `"${actionLabel}" remapeado para [${window.Config.formatKeyCode(newCode)}]!`,
          1800
        );
      }
    });
    this.renderKeybindList();
  }

  updateGamepadStatusBanner() {
    const pads = (this.game.input && this.game.input.connectedGamepadsSummary) || [];
    if (this.gamepadStatusBanner) {
      if (pads.length > 0) {
        this.gamepadStatusBanner.textContent = `🎮 Controle(s) Conectado(s): ${pads.join(' | ')}`;
        this.gamepadStatusBanner.classList.add('connected');
      } else {
        this.gamepadStatusBanner.textContent =
          '🎮 Gamepad API ativa: Pressione qualquer botão no seu controle USB/Bluetooth (Xbox, PlayStation, Switch ou Genérico).';
        this.gamepadStatusBanner.classList.remove('connected');
      }
    }
    if (this.dbgGamepads) {
      this.dbgGamepads.textContent = pads.length > 0 ? `${pads.length} Ativo(s)` : '0 (Aguardando)';
    }
  }

  openSettingsModal() {
    this.syncSettingsUI();
    this.renderKeybindList();
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
    this.hideGameOver();
    this.closeCraftingModal();
    this.closeShopModal();
    this.hudLayer.classList.add('hidden');
  }

  showGameplayHUD() {
    this.mainMenuOverlay.classList.add('hidden');
    this.settingsModalOverlay.classList.add('hidden');
    this.pauseMenuOverlay.classList.add('hidden');
    this.hideGameOver();
    this.closeCraftingModal();
    this.closeShopModal();
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
   * - Multiplayer Local: Duas Hotbars verticais nas bordas esquerda (P1: 1-5) e direita (P2: Scroll)
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

    const controls = (window.Config && window.Config.Controls) || {};
    const slotKeys = [
      window.Config.formatKeyCode(controls.slot1),
      window.Config.formatKeyCode(controls.slot2),
      window.Config.formatKeyCode(controls.slot3),
      window.Config.formatKeyCode(controls.slot4),
      window.Config.formatKeyCode(controls.slot5)
    ];

    player.inventory.forEach((item, index) => {
      const slotEl = document.createElement('div');
      slotEl.className = 'hotbar-slot';
      if (index === player.selectedSlot) slotEl.classList.add('active-slot');
      if (item.isEmpty) slotEl.classList.add('empty-slot');

      const badgeLabel = showKeyNumbers ? (slotKeys[index] || `${index + 1}`) : `S${index + 1}`;
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
    const C = (window.Config && window.Config.Controls) || {};
    const fmt = (k) => (window.Config && window.Config.formatKeyCode ? window.Config.formatKeyCode(k) : (k || ''));

    const kUp = fmt(C.moveUp);
    const kLeft = fmt(C.moveLeft);
    const kDown = fmt(C.moveDown);
    const kRight = fmt(C.moveRight);
    const kSwitch = fmt(C.switchCharacter);
    const kAtk1 = fmt(C.attackP1);
    const kAtk2 = fmt(C.attackP2);
    const kInteract = fmt(C.interact);
    const kInv = fmt(C.inventoryCycle);

    this.hudLayer.classList.toggle('multiplayer-hud', gameMode === 'multiplayer');

    // 1. Atualiza Barras de Vida (HP)
    this._updatePlayerCard(this.p1HpText, this.p1HpBar, p1);
    this._updatePlayerCard(this.p2HpText, this.p2HpBar, p2);

    // 2. Destaque de Controle Singleplayer vs Multiplayer Local Separado
    if (gameMode === 'singleplayer') {
      const p1Active = activePlayerIndex === 0;
      this.p1Card.classList.toggle('active-player-card', p1Active);
      this.p2Card.classList.toggle('active-player-card', !p1Active);

      this.p1Badge.textContent = p1Active ? 'ATIVO' : 'ESPERA';
      this.p2Badge.textContent = !p1Active ? 'ATIVO' : 'ESPERA';

      this.p1KeysHint.textContent = p1Active
        ? `Mov: ${kUp},${kLeft},${kDown},${kRight} • Ataque: Botão Direito Mouse`
        : `Pressione [${kSwitch}] p/ assumir`;
      this.p2KeysHint.textContent = !p1Active
        ? `Mov: ${kUp},${kLeft},${kDown},${kRight} • Ataque: Botão Direito Mouse`
        : `Pressione [${kSwitch}] p/ assumir`;
    } else {
      this.p1Card.classList.add('active-player-card');
      this.p2Card.classList.add('active-player-card');

      this.p1Badge.textContent = 'JOGADOR 1';
      this.p2Badge.textContent = 'JOGADOR 2';

      this.p1KeysHint.textContent = `Mov: ${kUp},${kLeft},${kDown},${kRight} • Ataque: [${kAtk1}]`;
      this.p2KeysHint.textContent = `Mov: Setas • Ataque: [${kAtk2}]`;
    }

    if (this.hudHintInvKey) this.hudHintInvKey.textContent = kInv;
    if (this.dbgKeyP1Atk) this.dbgKeyP1Atk.textContent = kAtk1;
    if (this.dbgKeyP2Atk) this.dbgKeyP2Atk.textContent = kAtk2;
    if (this.dbgKeySwitch) this.dbgKeySwitch.textContent = kSwitch;
    if (this.dbgKeyInteract) this.dbgKeyInteract.textContent = kInteract;

    // 3. Stepper da Máquina de Estados
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

    // 4. Título do Mapa e Cronômetro da Fase
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

    // 5. Contador Global Persistente de Sucata / Lixo Coletado e Lixos Restantes no Mapa
    const scrapTotal = window.scrapCollected || 0;
    if (this.scrapCountEl) {
      this.scrapCountEl.textContent = String(scrapTotal);
    }
    if (this.dbgScrapCount) {
      this.dbgScrapCount.textContent = String(scrapTotal);
    }
    if (this.mapTrashRemainingEl) {
      if (currentStageMeta.isSafeRoom) {
        this.mapTrashRemainingEl.textContent = '(Zona Segura)';
      } else {
        const remaining = Array.isArray(this.game.trashItems) ? this.game.trashItems.length : 0;
        this.mapTrashRemainingEl.textContent = `(Restam: ${remaining})`;
      }
    }

    // 6. Prompt de Interação na Zona de Extração, Porta da Van ou Estações da Safe Room (Loja / Craft)
    const activeStation = this.game.getTouchedSafeRoomStation();
    if (activeStation) {
      this.interactionPrompt.classList.remove('hidden');
      this.interactionPrompt.classList.add('station-prompt');
      this.interactionPrompt.innerHTML = `${activeStation.icon} Pressione <kbd>${kInteract}</kbd> ou <kbd>Espaço</kbd> para abrir: <strong>${activeStation.name}</strong>`;
    } else if (this.game.isAnyPlayerInTransitionZone()) {
      this.interactionPrompt.classList.remove('hidden');
      this.interactionPrompt.classList.remove('station-prompt');
      this.interactionPrompt.innerHTML = currentStageMeta.isSafeRoom
        ? `Na Porta da Van! Pressione <kbd>${kInteract}</kbd> ou <kbd>Espaço</kbd> para Seguir Viagem →`
        : `Na Zona de Extração! Pressione <kbd>${kInteract}</kbd> ou <kbd>Espaço</kbd> para entrar na Van →`;
    } else {
      this.interactionPrompt.classList.add('hidden');
      this.interactionPrompt.classList.remove('station-prompt');
    }

    // 7. Telemetria do Painel de Debug
    this.dbgMode.textContent = gameMode === 'singleplayer' ? `Singleplayer (${kSwitch})` : 'Multiplayer Local';
    this.dbgState.textContent = `${currentStageMeta.stateId} (${currentStageMeta.stepIndex + 1}/5)`;
    this.dbgP1Pos.textContent = `${Math.round(p1.x)}, ${Math.round(p1.y)}`;
    this.dbgP2Pos.textContent = `${Math.round(p2.x)}, ${Math.round(p2.y)}`;
    if (this.dbgCamPos) {
      this.dbgCamPos.textContent = `${Math.round(this.game.camera.x)}, ${Math.round(this.game.camera.y)}`;
    }
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

  updatePauseInventoryPanel() {
    const { p1, p2, stageTimeRemaining } = this.game;
    const currentStageMeta = this.game.getCurrentStageMeta();

    this.pauseMapName.textContent = currentStageMeta.label;
    this.pauseTimerStatus.textContent = currentStageMeta.isSafeRoom
      ? 'Safe Room (Van): Cronômetro Pausado'
      : `Tempo Restante na Fase: ${this.formatTime(stageTimeRemaining)}`;

    if (this.pauseScrapStatus) {
      this.pauseScrapStatus.textContent = `♻ Lixo Coletado (Global): ${window.scrapCollected || 0}`;
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
