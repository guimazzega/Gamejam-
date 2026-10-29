/**
 * js/ui_editor.js
 * Editor Visual de Menus e Interface UI ("ScienceEco Girls" - Sprint 10)
 * 
 * Diretrizes Implementadas:
 * 1. Nós de Interface (UI Elements):
 *    - TextLabel: Texto puro com tipografia, alinhamento e cores personalizáveis.
 *    - Button: Retângulo interativo com hover, hitbox e vinculação de ação (onClickAction).
 *    - Panel: Janela/fundo com cor sólida ou imagem, borda e opacidade.
 *    - Image: Sprites de UI estáticos (logos, ícones, cursores) com rotação e escala.
 * 
 * 2. Herança do Editor de Mapas (Posicionamento e Z-Index):
 *    - Snap to Grid padrão (8px, 16px, 32px) com ajuste fino via mouse.
 *    - Segurar ALT (ou Shift) suspende o snap para movimentação pixel-perfect (1px).
 *    - Camadas de Profundidade (Z-Index): Teclas '[' (trás) e ']' (frente) para reordenar nós.
 * 
 * 3. Propriedades e Edição de Conteúdo:
 *    - Tecla 'E': Abre caixa de diálogo para alterar conteúdo, tamanho de fonte, cores e dimensões.
 *    - Visualização de Hitbox (Debug): Tecla 'C' desenha bordas vermelhas e hitboxes de botões.
 * 
 * 4. Vinculação de Eventos (Action Triggers):
 *    - Tecla 'I': Abre modal interativo para associar ações de jogo ao botão:
 *      (ex: START_GAME, OPEN_SETTINGS, TOGGLE_COLORBLIND, CLOSE_MENU, TOGGLE_MUTE, etc.).
 *    - Modo Teste/Preview (Tecla 'P'): Permite interagir e clicar nos botões diretamente na tela.
 * 
 * 5. Estrutura de Salvamento (JSON) e Presets:
 *    - Exporta e importa layouts de UI em JSON estruturado para telas de Título, Van e HUDs.
 */

window.UIEditor = class UIEditor {
  constructor(game) {
    this.game = game;
    this.active = false;
    this.previewMode = false; // Modo de teste interativo (dispara cliques reais)

    // Elementos da Interface (Lista ordenada por Z-Index: 0 = fundo, N = topo)
    this.elements = [];

    // Item Selecionado e Hover
    this.selectedElement = null;
    this.hoveredElement = null;

    // Configurações de Grade e Alinhamento
    this.snapEnabled = true;
    this.snapGrid = 16;
    this.isAltHeld = false;

    // Debug de Colisões / Hitbox (Tecla C)
    this.debugHitboxes = false;

    // Estados de Interação com o Mouse
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };

    this.isResizing = false;
    this.resizeHandle = null; // 'nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'
    this.resizeStartBox = { x: 0, y: 0, w: 0, h: 0 };
    this.resizeStartMouse = { x: 0, y: 0 };

    // Posição do Mouse (Coordenadas de tela do canvas)
    this.mouse = { x: 0, y: 0 };

    // Identificação do Layout Atual
    this.currentScreenId = 'title_screen';
    this.currentScreenName = 'Tela de Título (Menu Principal)';

    // Sistema de Histórico e Desfazer (Ctrl + Z) - Sprint 11
    const HistoryCls = window.HistoryManager || (typeof HistoryManager !== 'undefined' ? HistoryManager : null);
    this.history = HistoryCls ? new HistoryCls({
      name: 'UIEditor',
      maxSteps: 40,
      getState: () => this.getLayoutStateSnapshot(),
      onRestore: (snapshot, actionName) => this.applyHistoryState(snapshot, actionName)
    }) : null;
    this.preDragSnapshot = null;
    this._dockEditPreSnapshot = null;

    // Elementos DOM da Interface do Editor
    this.domContainer = null;
    this._initDOM();
    this._bindEvents();

    // Carrega layout inicial padrão (Tela de Título)
    this.loadPreset('title_screen');
  }

  /**
   * Captura uma cópia profunda serializável de todo o estado atual da UI (Sprint 11 - Requisito 1)
   */
  getLayoutStateSnapshot() {
    return {
      screenId: this.currentScreenId,
      screenName: this.currentScreenName,
      selectedElementId: this.selectedElement ? (this.selectedElement.id || null) : null,
      elements: this.elements.map((node) => {
        const copy = { ...node };
        delete copy._img;
        delete copy.isHovered;
        return copy;
      })
    };
  }

  /**
   * Restaura o estado anterior da UI a partir de um snapshot do histórico (Sprint 11 - Requisito 4)
   */
  applyHistoryState(snapshot, actionName = '') {
    if (!snapshot || !Array.isArray(snapshot.elements)) return;

    if (snapshot.screenId) this.currentScreenId = snapshot.screenId;
    if (snapshot.screenName) this.currentScreenName = snapshot.screenName;

    // 1. Substitui os elementos da interface
    this.elements = snapshot.elements.map((node) => {
      const restored = { ...node, isHovered: false };
      if (restored.src) {
        const img = new Image();
        img.src = restored.src;
        restored._img = img;
      }
      return restored;
    });

    // 2. Restaura seleção do elemento se ele ainda existir
    if (snapshot.selectedElementId) {
      const found = this.elements.find((el) => el.id === snapshot.selectedElementId);
      if (found) {
        this.selectItem(found);
      } else {
        this.deselectItem();
      }
    } else {
      this.deselectItem();
    }

    this._renderPropertiesDock();
    this._updateSelectedChipDisplay();
    this.game.ui.showToast(`↩️ Desfeito na UI: ${actionName || 'Ação anterior'} [Ctrl+Z]`, 1800);
  }

  /**
   * Desfaz a ação mais recente na UI (Sprint 11 - Requisito 4)
   */
  desfazer() {
    if (!this.history || !this.history.canUndo()) {
      this.game.ui.showToast('ℹ️ Nenhuma ação anterior para desfazer no layout de UI.');
      return false;
    }
    const restored = this.history.undo();
    if (restored) {
      this.forceRender();
    }
    return restored;
  }

  /**
   * Alias de desfazer
   */
  undo() {
    return this.desfazer();
  }

  /**
   * Força a renderização imediata do canvas após o desfazer (Sprint 11 - Requisito 4)
   */
  forceRender() {
    if (this.game && this.game.canvas) {
      const ctx = this.game.canvas.getContext('2d');
      if (ctx) {
        if (typeof this.game.render === 'function') {
          this.game.render();
        }
        if (typeof this.renderCanvas === 'function') {
          this.renderCanvas(ctx);
        }
      }
    }
  }

  /* =========================================================================
   * 1. INICIALIZAÇÃO DA INTERFACE DOM (HTML / OVERLAYS / MODAIS)
   * ========================================================================= */

  _initDOM() {
    let container = document.getElementById('ui-editor-overlay');
    if (!container) {
      container = document.createElement('div');
      container.id = 'ui-editor-overlay';
      container.className = 'ui-editor-overlay hidden';
      document.body.appendChild(container);
    }
    this.domContainer = container;

    this.domContainer.innerHTML = `
      <!-- BARRA SUPERIOR DO EDITOR DE UI -->
      <header class="ui-editor-header-bar">
        <div class="ui-editor-bar-section">
          <span class="ui-editor-badge">🎨 EDITOR DE MENUS & UI</span>
          
          <!-- Seletor de Presets de Telas -->
          <select id="ui-editor-preset-select" class="ui-editor-dropdown" title="Carregar Preset de Tela">
            <option value="title_screen">🖥️ Tela de Título (Title Screen)</option>
            <option value="van_screen">🚐 Tela da Van (Hub de Operações)</option>
            <option value="hud_screen">❤️ HUD In-Game (Vida & Tempo)</option>
            <option value="pause_screen">⏸️ Menu de Pausa</option>
            <option value="blank">📄 Layout em Branco</option>
          </select>

          <!-- Chip de Info do Elemento Selecionado -->
          <div id="ui-selected-element-chip" class="ui-editor-tag-pill">
            Nenhum elemento selecionado
          </div>
        </div>

        <div class="ui-editor-bar-section">
          <!-- Snap à Grade e Ajuste Fino -->
          <button type="button" id="btn-ui-toggle-snap" class="ui-editor-action-btn snap-active" title="Alternar Snap (Segure ALT para mover livremente em 1px)">
            🧲 Snap: 16px
          </button>
          <select id="ui-editor-snap-select" class="ui-editor-dropdown" title="Tamanho da Grade">
            <option value="4">4 px</option>
            <option value="8">8 px</option>
            <option value="16" selected>16 px</option>
            <option value="32">32 px</option>
            <option value="64">64 px</option>
          </select>

          <!-- Debug de Hitbox (Tecla C) -->
          <button type="button" id="btn-ui-toggle-hitboxes" class="ui-editor-action-btn" title="Exibir Hitboxes / Colisões de Botões [Tecla C]">
            🚨 Hitboxes [C]
          </button>

          <!-- Modo Teste / Preview (Tecla P) -->
          <button type="button" id="btn-ui-toggle-preview" class="ui-editor-action-btn btn-preview-mode" title="Modo Teste Interativo [Tecla P]">
            🎮 Modo Teste [P]
          </button>

          <!-- Desfazer / Undo (Ctrl + Z) (Sprint 11) -->
          <button type="button" id="btn-ui-undo" class="ui-editor-action-btn" title="Desfazer Última Ação [Ctrl+Z]">
            ↩️ Desfazer [Ctrl+Z]
          </button>

          <!-- Exportação / Importação JSON -->
          <button type="button" id="btn-ui-export-json" class="ui-editor-action-btn btn-export-highlight" title="Exportar Layout JSON (.JSON)">
            💾 Exportar (.JSON)
          </button>

          <button type="button" id="btn-ui-import-json" class="ui-editor-action-btn" title="Importar Layout JSON">
            📂 Importar (.JSON)
          </button>

          <!-- Fechar Editor -->
          <button type="button" id="btn-ui-close-editor" class="ui-editor-action-btn btn-close-editor" title="Retomar / Fechar Editor [F7 / Esc]">
            ✖ Fechar [F7]
          </button>
        </div>
      </header>

      <!-- BARRA CONTEXTUAL DE PALETA DE NÓS (4 TIPOS BASE) -->
      <div class="ui-editor-context-bar">
        <div class="context-group">
          <span class="context-label">Instanciar Nós de UI:</span>
          <button type="button" id="btn-add-textlabel" class="ui-context-pill-btn" title="Adicionar Texto Puro">
            🔤 + TextLabel
          </button>
          <button type="button" id="btn-add-button" class="ui-context-pill-btn" title="Adicionar Botão Interativo com Ação">
            🔘 + Button
          </button>
          <button type="button" id="btn-add-panel" class="ui-context-pill-btn" title="Adicionar Painel / Fundo de Janela">
            📦 + Panel
          </button>
          <button type="button" id="btn-add-image" class="ui-context-pill-btn" title="Adicionar Imagem / Sprite de UI">
            🖼️ + Image
          </button>
        </div>

        <div class="context-group">
          <button type="button" id="btn-quick-edit" class="ui-context-pill-btn btn-action-accent" title="Editar Propriedades do Elemento Selecionado [Tecla E]">
            ✏️ Editar [E]
          </button>
          <button type="button" id="btn-quick-action" class="ui-context-pill-btn btn-action-lightning" title="Vincular Ação ao Botão [Tecla I]">
            ⚡ Ação [I]
          </button>
          <button type="button" id="btn-quick-z-back" class="ui-context-pill-btn" title="Enviar para Trás [Tecla [ ]">
            ⬇️ Trás [ [ ]
          </button>
          <button type="button" id="btn-quick-z-fwd" class="ui-context-pill-btn" title="Trazer para Frente [Tecla ] ]">
            ⬆️ Frente [ ] ]
          </button>
        </div>

        <div class="context-help">
          💡 <b>Atalhos:</b> [E] Editar • [I] Ação/Trigger • [C] Hitboxes • [ [ / ] ] Z-Index • [ALT] Livre 1px • [P] Testar • [Del] Excluir
        </div>
      </div>

      <!-- BANNER DE MODO PREVIEW / TESTE -->
      <div id="ui-preview-banner" class="ui-preview-banner hidden">
        🎮 <strong>MODO TESTE / PREVIEW INTERATIVO ATIVADO:</strong> Clique nos botões para testar as ações reais da State Machine! Pressione <code>[P]</code> para voltar ao modo de edição.
      </div>

      <!-- PAINEL FLUTUANTE DE PROPRIEDADES (INSPECTOR DE UI) -->
      <aside id="ui-editor-properties-dock" class="ui-editor-properties-dock hidden">
        <div class="properties-dock-header">
          <strong id="ui-prop-title">PROPRIEDADES DO ELEMENTO</strong>
          <button type="button" id="btn-ui-prop-close" class="prop-btn-icon" title="Desmarcar (Esc)">✕</button>
        </div>
        <div class="properties-dock-body" id="ui-prop-fields">
          <!-- Injetado dinamicamente -->
        </div>

        <!-- Z-INDEX E AÇÕES RÁPIDAS -->
        <div class="properties-dock-z-rotate">
          <div class="prop-action-subrow">
            <span class="prop-subrow-label">Z-Index:</span>
            <button type="button" id="btn-ui-z-backward" class="stardew-btn btn-secondary btn-xs" title="Enviar para Trás [Tecla [ ]">
              ⬇️ Trás [ [ ]
            </button>
            <button type="button" id="btn-ui-z-forward" class="stardew-btn btn-secondary btn-xs" title="Trazer para Frente [Tecla ] ]">
              ⬆️ Frente [ ] ]
            </button>
            <span id="ui-prop-zindex-text" class="prop-zindex-text">Z: 1/1</span>
          </div>

          <div class="prop-action-subrow" id="ui-prop-action-subrow">
            <span class="prop-subrow-label">Ação:</span>
            <span id="ui-prop-action-badge" class="ui-action-badge">NENHUMA</span>
            <button type="button" id="btn-ui-open-action-modal" class="stardew-btn btn-primary btn-xs" title="Alterar Ação [Tecla I]">
              ⚡ Ação [I]
            </button>
          </div>
        </div>

        <div class="properties-dock-footer">
          <button type="button" id="btn-ui-prop-duplicate" class="stardew-btn btn-secondary btn-sm">📋 Duplicar</button>
          <button type="button" id="btn-ui-prop-edit-dialog" class="stardew-btn btn-primary btn-sm">✏️ Editar Completo [E]</button>
          <button type="button" id="btn-ui-prop-delete" class="stardew-btn btn-danger btn-sm">🗑️ Excluir</button>
        </div>
      </aside>

      <!-- ===================================================================== -->
      <!-- MODAL 1: EDIÇÃO DE PROPRIEDADES E CONTEÚDO (TECLA E) -->
      <!-- ===================================================================== -->
      <div id="ui-editor-edit-modal" class="editor-export-modal-backdrop hidden">
        <div class="stardew-panel editor-export-panel ui-modal-card">
          <div class="dev-ribbon ribbon-victory">EDIÇÃO DE PROPRIEDADES (TECLA E)</div>
          <h2 class="export-modal-title" id="ui-modal-edit-title">Editar Propriedades do Elemento</h2>
          <p class="export-modal-desc">
            Altere o conteúdo textual, dimensões da hitbox, cores e estilização do elemento selecionado:
          </p>

          <form id="ui-modal-edit-form" class="ui-modal-form-grid">
            <!-- Campos gerados dinamicamente via JS de acordo com o tipo -->
            <div id="ui-modal-edit-fields" class="ui-form-fields-container"></div>

            <div class="export-modal-actions" style="margin-top: 18px;">
              <button type="button" id="btn-ui-save-edit-modal" class="stardew-btn btn-primary btn-copy-glow">
                ✓ Salvar Alterações
              </button>
              <button type="button" id="btn-ui-close-edit-modal" class="stardew-btn btn-secondary">
                Cancelar [Esc]
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- ===================================================================== -->
      <!-- MODAL 2: VINCULAÇÃO DE EVENTOS / ACTION TRIGGERS (TECLA I) -->
      <!-- ===================================================================== -->
      <div id="ui-editor-action-modal" class="editor-export-modal-backdrop hidden">
        <div class="stardew-panel editor-export-panel ui-modal-card">
          <div class="dev-ribbon ribbon-victory">VINCULAÇÃO DE EVENTOS (ACTION TRIGGERS - TECLA I)</div>
          <h2 class="export-modal-title">Configurar Ação de Clique (onClickAction)</h2>
          <p class="export-modal-desc">
            Defina qual comando ou transição da State Machine este botão dispara ao ser clicado pelo jogador:
          </p>

          <div class="ui-action-target-info">
            <span class="ui-target-label">Botão Selecionado:</span>
            <strong id="ui-action-target-name">Botão</strong>
            <span class="ui-target-curr">Ação Atual: <code id="ui-action-current-value">NENHUMA</code></span>
          </div>

          <label class="ui-input-label" for="ui-action-custom-input">Ação Selecionada ou Customizada:</label>
          <div class="ui-action-input-row">
            <input type="text" id="ui-action-custom-input" class="ui-text-input" placeholder="ex: START_GAME" spellcheck="false" />
            <button type="button" id="btn-ui-test-action-now" class="stardew-btn btn-warning btn-sm" title="Dispara a ação imediatamente para testar">
              ▶ Testar Agora
            </button>
          </div>

          <div class="ui-action-presets-block">
            <span class="ui-input-label">Ações Padrão do Jogo (Clique para Selecionar):</span>
            <div class="ui-action-chips-grid">
              <button type="button" class="ui-action-chip" data-action="START_GAME">
                <strong>START_GAME</strong>
                <small>Inicia / Retoma a Partida</small>
              </button>
              <button type="button" class="ui-action-chip" data-action="OPEN_SETTINGS">
                <strong>OPEN_SETTINGS</strong>
                <small>Abre Painel de Configurações</small>
              </button>
              <button type="button" class="ui-action-chip" data-action="TOGGLE_COLORBLIND">
                <strong>TOGGLE_COLORBLIND</strong>
                <small>Alterna Modo Daltônico</small>
              </button>
              <button type="button" class="ui-action-chip" data-action="CLOSE_MENU">
                <strong>CLOSE_MENU</strong>
                <small>Fecha o Menu / Diálogo</small>
              </button>
              <button type="button" class="ui-action-chip" data-action="RESUME_GAME">
                <strong>RESUME_GAME</strong>
                <small>Despausa o Jogo</small>
              </button>
              <button type="button" class="ui-action-chip" data-action="RESTART_STAGE">
                <strong>RESTART_STAGE</strong>
                <small>Reinicia a Fase Atual</small>
              </button>
              <button type="button" class="ui-action-chip" data-action="QUIT_TO_MENU">
                <strong>QUIT_TO_MENU</strong>
                <small>Retorna ao Menu Principal</small>
              </button>
              <button type="button" class="ui-action-chip" data-action="TOGGLE_MUTE">
                <strong>TOGGLE_MUTE</strong>
                <small>Muta / Desmuta Áudio</small>
              </button>
              <button type="button" class="ui-action-chip" data-action="OPEN_SHOP">
                <strong>OPEN_SHOP</strong>
                <small>Abre a Loja de Armas da Van</small>
              </button>
              <button type="button" class="ui-action-chip" data-action="OPEN_NOTICE_BOARD">
                <strong>OPEN_NOTICE_BOARD</strong>
                <small>Abre o Mural de Avisos da Van</small>
              </button>
            </div>
          </div>

          <div class="export-modal-actions" style="margin-top: 18px;">
            <button type="button" id="btn-ui-save-action-modal" class="stardew-btn btn-primary btn-copy-glow">
              ✓ Confirmar Ação
            </button>
            <button type="button" id="btn-ui-close-action-modal" class="stardew-btn btn-secondary">
              Cancelar [Esc]
            </button>
          </div>
        </div>
      </div>

      <!-- ===================================================================== -->
      <!-- MODAL 3: EXPORTAÇÃO (.JSON) -->
      <!-- ===================================================================== -->
      <div id="ui-editor-export-modal" class="editor-export-modal-backdrop hidden">
        <div class="stardew-panel editor-export-panel">
          <div class="dev-ribbon ribbon-victory">GERADOR DE ESTRUTURA UI (.JSON - SPRINT 10)</div>
          <h2 class="export-modal-title">Exportação de Layout de Interface (.JSON)</h2>
          <p class="export-modal-desc">
            Estrutura convertida para array de objetos com nós de HUD/Menu, dimensões, Z-Index e Action Triggers:
          </p>

          <div class="export-stats-row">
            <span id="ui-export-stat-labels" class="export-stat-chip">🔤 0 TextLabels</span>
            <span id="ui-export-stat-buttons" class="export-stat-chip">🔘 0 Buttons</span>
            <span id="ui-export-stat-panels" class="export-stat-chip">📦 0 Panels</span>
            <span id="ui-export-stat-images" class="export-stat-chip">🖼️ 0 Images</span>
          </div>

          <div class="export-code-box">
            <textarea id="ui-editor-export-textarea" readonly spellcheck="false"></textarea>
          </div>

          <div class="export-modal-actions">
            <button type="button" id="btn-ui-copy-export-json" class="stardew-btn btn-primary btn-copy-glow">
              📋 Copiar Conteúdo (.JSON)
            </button>
            <button type="button" id="btn-ui-download-again-json" class="stardew-btn btn-warning">
              ⬇️ Baixar Arquivo JSON
            </button>
            <button type="button" id="btn-ui-close-export-modal" class="stardew-btn btn-secondary">
              Fechar [Esc]
            </button>
          </div>
        </div>
      </div>

      <!-- ===================================================================== -->
      <!-- MODAL 4: IMPORTAÇÃO (.JSON) -->
      <!-- ===================================================================== -->
      <div id="ui-editor-import-modal" class="editor-export-modal-backdrop hidden">
        <div class="stardew-panel editor-export-panel">
          <div class="dev-ribbon ribbon-victory">IMPORTAÇÃO DE LAYOUT (.JSON)</div>
          <h2 class="export-modal-title">Carregar Layout de Interface (.JSON)</h2>
          <p class="export-modal-desc">
            Cole abaixo o código JSON de um layout de tela ou selecione um arquivo do computador:
          </p>

          <div class="export-code-box">
            <textarea id="ui-editor-import-textarea" placeholder="Cole o JSON aqui..." spellcheck="false"></textarea>
          </div>

          <div class="export-modal-actions">
            <input type="file" id="ui-editor-json-file-input" accept=".json,application/json" style="display: none;" />
            <button type="button" id="btn-ui-browse-json-file" class="stardew-btn btn-secondary">
              📁 Selecionar Arquivo do PC
            </button>
            <button type="button" id="btn-ui-apply-imported-json" class="stardew-btn btn-primary btn-copy-glow">
              ✓ Carregar Layout
            </button>
            <button type="button" id="btn-ui-close-import-modal" class="stardew-btn btn-secondary">
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <!-- Input de upload de imagem para Image/Panel -->
      <input type="file" id="ui-image-file-input" accept="image/*" style="display: none;" />
    `;
  }

  /* =========================================================================
   * 2. BINDINGS DE EVENTOS (TECLADO, MOUSE, CLIQUES)
   * ========================================================================= */

  _bindEvents() {
    const overlay = this.domContainer;

    // Presets
    const presetSel = overlay.querySelector('#ui-editor-preset-select');
    if (presetSel) {
      presetSel.addEventListener('change', () => {
        this.loadPreset(presetSel.value);
      });
    }

    // Snap Toggle
    const btnToggleSnap = overlay.querySelector('#btn-ui-toggle-snap');
    if (btnToggleSnap) {
      btnToggleSnap.addEventListener('click', () => this.toggleSnap());
    }

    const snapSelect = overlay.querySelector('#ui-editor-snap-select');
    if (snapSelect) {
      snapSelect.addEventListener('change', () => {
        this.snapGrid = parseInt(snapSelect.value, 10) || 16;
        this.snapEnabled = true;
        this._updateSnapButtonDisplay();
      });
    }

    // Debug de Hitboxes (Tecla C)
    const btnToggleHitboxes = overlay.querySelector('#btn-ui-toggle-hitboxes');
    if (btnToggleHitboxes) {
      btnToggleHitboxes.addEventListener('click', () => this.toggleDebugHitboxes());
    }

    // Modo Teste / Preview (Tecla P)
    const btnTogglePreview = overlay.querySelector('#btn-ui-toggle-preview');
    if (btnTogglePreview) {
      btnTogglePreview.addEventListener('click', () => this.togglePreviewMode());
    }

    // Botão Desfazer (Ctrl + Z) (Sprint 11)
    const btnUndo = overlay.querySelector('#btn-ui-undo');
    if (btnUndo) {
      btnUndo.addEventListener('click', () => this.desfazer());
    }

    // Exportar / Importar JSON
    const btnExport = overlay.querySelector('#btn-ui-export-json');
    if (btnExport) {
      btnExport.addEventListener('click', () => this.exportLayoutJSON());
    }

    const btnImport = overlay.querySelector('#btn-ui-import-json');
    if (btnImport) {
      btnImport.addEventListener('click', () => this.openImportModal());
    }

    // Fechar Editor
    const btnClose = overlay.querySelector('#btn-ui-close-editor');
    if (btnClose) {
      btnClose.addEventListener('click', () => this.close());
    }

    // Adição de Nós (4 tipos base)
    const btnAddText = overlay.querySelector('#btn-add-textlabel');
    if (btnAddText) {
      btnAddText.addEventListener('click', () => this.addTextLabel());
    }

    const btnAddBtn = overlay.querySelector('#btn-add-button');
    if (btnAddBtn) {
      btnAddBtn.addEventListener('click', () => this.addButton());
    }

    const btnAddPanel = overlay.querySelector('#btn-add-panel');
    if (btnAddPanel) {
      btnAddPanel.addEventListener('click', () => this.addPanel());
    }

    const btnAddImage = overlay.querySelector('#btn-add-image');
    if (btnAddImage) {
      btnAddImage.addEventListener('click', () => this.addImage());
    }

    // Botões de Ação Rápida na Barra
    const btnQuickEdit = overlay.querySelector('#btn-quick-edit');
    if (btnQuickEdit) {
      btnQuickEdit.addEventListener('click', () => this.openEditModal());
    }

    const btnQuickAction = overlay.querySelector('#btn-quick-action');
    if (btnQuickAction) {
      btnQuickAction.addEventListener('click', () => this.openActionModal());
    }

    const btnQuickZBack = overlay.querySelector('#btn-quick-z-back');
    if (btnQuickZBack) {
      btnQuickZBack.addEventListener('click', () => this.moveSelectedItemZIndex(-1));
    }

    const btnQuickZFwd = overlay.querySelector('#btn-quick-z-fwd');
    if (btnQuickZFwd) {
      btnQuickZFwd.addEventListener('click', () => this.moveSelectedItemZIndex(1));
    }

    // Z-Index na Doca de Propriedades
    const btnZBack = overlay.querySelector('#btn-ui-z-backward');
    if (btnZBack) {
      btnZBack.addEventListener('click', () => this.moveSelectedItemZIndex(-1));
    }

    const btnZFwd = overlay.querySelector('#btn-ui-z-forward');
    if (btnZFwd) {
      btnZFwd.addEventListener('click', () => this.moveSelectedItemZIndex(1));
    }

    const btnOpenAction = overlay.querySelector('#btn-ui-open-action-modal');
    if (btnOpenAction) {
      btnOpenAction.addEventListener('click', () => this.openActionModal());
    }

    // Doca: Fechar / Duplicar / Excluir / Editar
    const btnPropClose = overlay.querySelector('#btn-ui-prop-close');
    if (btnPropClose) {
      btnPropClose.addEventListener('click', () => this.deselectItem());
    }

    const btnPropDel = overlay.querySelector('#btn-ui-prop-delete');
    if (btnPropDel) {
      btnPropDel.addEventListener('click', () => this.deleteSelectedItem());
    }

    const btnPropDup = overlay.querySelector('#btn-ui-prop-duplicate');
    if (btnPropDup) {
      btnPropDup.addEventListener('click', () => this.duplicateSelectedItem());
    }

    const btnPropEditDialog = overlay.querySelector('#btn-ui-prop-edit-dialog');
    if (btnPropEditDialog) {
      btnPropEditDialog.addEventListener('click', () => this.openEditModal());
    }

    // Modal de Edição (Tecla E)
    const btnCloseEdit = overlay.querySelector('#btn-ui-close-edit-modal');
    if (btnCloseEdit) {
      btnCloseEdit.addEventListener('click', () => this.closeEditModal());
    }

    const btnSaveEdit = overlay.querySelector('#btn-ui-save-edit-modal');
    if (btnSaveEdit) {
      btnSaveEdit.addEventListener('click', () => this.saveEditModal());
    }

    // Modal de Ação (Tecla I)
    const btnCloseAction = overlay.querySelector('#btn-ui-close-action-modal');
    if (btnCloseAction) {
      btnCloseAction.addEventListener('click', () => this.closeActionModal());
    }

    const btnSaveAction = overlay.querySelector('#btn-ui-save-action-modal');
    if (btnSaveAction) {
      btnSaveAction.addEventListener('click', () => this.saveActionModal());
    }

    const btnTestAction = overlay.querySelector('#btn-ui-test-action-now');
    if (btnTestAction) {
      btnTestAction.addEventListener('click', () => {
        const inp = overlay.querySelector('#ui-action-custom-input');
        if (inp && inp.value) {
          this.executeGameAction(inp.value.trim());
        }
      });
    }

    overlay.querySelectorAll('.ui-action-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const action = chip.getAttribute('data-action');
        const inp = overlay.querySelector('#ui-action-custom-input');
        if (inp) inp.value = action;
        overlay.querySelectorAll('.ui-action-chip').forEach((c) => c.classList.remove('selected'));
        chip.classList.add('selected');
      });
    });

    // Modal de Exportação
    const btnCloseExport = overlay.querySelector('#btn-ui-close-export-modal');
    if (btnCloseExport) {
      btnCloseExport.addEventListener('click', () => {
        overlay.querySelector('#ui-editor-export-modal').classList.add('hidden');
      });
    }

    const btnCopyExport = overlay.querySelector('#btn-ui-copy-export-json');
    if (btnCopyExport) {
      btnCopyExport.addEventListener('click', () => this.copyExportJSONToClipboard());
    }

    const btnDownloadExport = overlay.querySelector('#btn-ui-download-again-json');
    if (btnDownloadExport) {
      btnDownloadExport.addEventListener('click', () => this.triggerFileDownload());
    }

    // Modal de Importação
    const btnCloseImport = overlay.querySelector('#btn-ui-close-import-modal');
    if (btnCloseImport) {
      btnCloseImport.addEventListener('click', () => {
        overlay.querySelector('#ui-editor-import-modal').classList.add('hidden');
      });
    }

    const btnBrowseJson = overlay.querySelector('#btn-ui-browse-json-file');
    const jsonFileInput = overlay.querySelector('#ui-editor-json-file-input');
    if (btnBrowseJson && jsonFileInput) {
      btnBrowseJson.addEventListener('click', () => jsonFileInput.click());
      jsonFileInput.addEventListener('change', (e) => this._handleJsonFileUpload(e));
    }

    const btnApplyImport = overlay.querySelector('#btn-ui-apply-imported-json');
    if (btnApplyImport) {
      btnApplyImport.addEventListener('click', () => this.applyImportedJSON());
    }

    // Upload de Imagem de Sprite
    const imgInput = overlay.querySelector('#ui-image-file-input');
    if (imgInput) {
      imgInput.addEventListener('change', (e) => this._handleImageUpload(e));
    }

    // Eventos de Mouse no Canvas
    const canvas = this.game.canvas;
    canvas.addEventListener('mousedown', (e) => this._onCanvasMouseDown(e));
    window.addEventListener('mousemove', (e) => this._onCanvasMouseMove(e));
    window.addEventListener('mouseup', (e) => this._onCanvasMouseUp(e));

    // Eventos de Teclado (Atalhos Oficiais)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Alt' || e.key === 'Shift') {
        this.isAltHeld = true;
        this._updateSnapButtonDisplay();
      }

      // Atalho F7 para alternar o Editor de UI
      if (e.code === 'F7') {
        e.preventDefault();
        e.stopPropagation();
        this.toggle();
        return;
      }

      if (!this.active) return;

      // Não intercepta se estiver digitando em campo de input / textarea
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT')) {
        if (e.code === 'Escape') {
          this.closeEditModal();
          this.closeActionModal();
        }
        return;
      }

      // Atalho 'E': Abrir Dialog de Edição de Propriedades (Requisito 3)
      if (e.code === 'KeyE') {
        e.preventDefault();
        if (this.selectedElement) {
          this.openEditModal();
        } else {
          this.game.ui.showToast('ℹ️ Selecione um elemento de UI primeiro para editar [E]!');
        }
      }

      // Atalho 'I': Vinculação de Ação/Interatividade (Requisito 4)
      else if (e.code === 'KeyI') {
        e.preventDefault();
        if (this.selectedElement && this.selectedElement.type === 'Button') {
          this.openActionModal();
        } else if (this.selectedElement) {
          this.game.ui.showToast('ℹ️ O atalho [I] configura botões interativos (Button)!');
        } else {
          this.game.ui.showToast('ℹ️ Selecione um Botão para configurar a ação de clique [I]!');
        }
      }

      // Atalho 'C': Visualização de Hitbox / Debug (Requisito 3)
      else if (e.code === 'KeyC') {
        e.preventDefault();
        this.toggleDebugHitboxes();
      }

      // Atalhos de Z-Index: '[' e ']' (Requisito 2)
      else if (e.code === 'BracketLeft' || e.key === '[' || e.code === 'PageDown') {
        e.preventDefault();
        this.moveSelectedItemZIndex(-1);
      } else if (e.code === 'BracketRight' || e.key === ']' || e.code === 'PageUp') {
        e.preventDefault();
        this.moveSelectedItemZIndex(1);
      }

      // Atalho 'P': Modo Teste / Preview Interativo
      else if (e.code === 'KeyP') {
        e.preventDefault();
        this.togglePreviewMode();
      }

      // Atalho Ctrl + Z: Desfazer (Undo) (Sprint 11 - Requisito 3)
      else if (e.ctrlKey && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        this.desfazer();
      }

      // Atalhos comuns: Delete, Ctrl+S, Ctrl+D, Esc
      else if (e.code === 'Delete' || e.code === 'Backspace') {
        e.preventDefault();
        this.deleteSelectedItem();
      } else if (e.ctrlKey && e.code === 'KeyS') {
        e.preventDefault();
        this.exportLayoutJSON();
      } else if (e.ctrlKey && e.code === 'KeyD') {
        e.preventDefault();
        this.duplicateSelectedItem();
      } else if (e.code === 'Escape') {
        if (this.isEditModalOpen()) this.closeEditModal();
        else if (this.isActionModalOpen()) this.closeActionModal();
        else this.deselectItem();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'Alt' || e.key === 'Shift') {
        this.isAltHeld = false;
        this._updateSnapButtonDisplay();
      }
    });
  }

  /* =========================================================================
   * 3. CICLO DE VIDA (OPEN / CLOSE / TOGGLE)
   * ========================================================================= */

  toggle() {
    if (this.active) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.active = true;
    this.previewMode = false;

    // Fecha o modal de configurações se estiver aberto
    if (this.game.ui && typeof this.game.ui.closeSettingsModal === 'function') {
      this.game.ui.closeSettingsModal();
    }

    // Pausa o jogo em background para editar tranquilamente
    if (this.game.appState === 'PLAYING') {
      this.game.togglePause(true);
    }

    this.domContainer.classList.remove('hidden');
    const banner = this.domContainer.querySelector('#ui-preview-banner');
    if (banner) banner.classList.add('hidden');

    this._updateSnapButtonDisplay();
    this._updateHitboxButtonDisplay();
    this._updatePreviewButtonDisplay();
    this._updateSelectedChipDisplay();

    this.game.ui.showToast('🎨 Editor de Menus & UI ATIVADO (F7 para fechar • E para editar • I para ações)', 2600);
  }

  close() {
    this.active = false;
    this.previewMode = false;
    this.deselectItem();
    this.isDragging = false;
    this.isResizing = false;
    this.isAltHeld = false;

    this.domContainer.classList.add('hidden');
    this.closeEditModal();
    this.closeActionModal();

    const exportModal = this.domContainer.querySelector('#ui-editor-export-modal');
    if (exportModal) exportModal.classList.add('hidden');
    const importModal = this.domContainer.querySelector('#ui-editor-import-modal');
    if (importModal) importModal.classList.add('hidden');

    this.game.ui.showToast('▶️ Editor de UI fechado.', 1800);
  }

  /* =========================================================================
   * 4. SNAP À GRADE E AJUSTE FINO (HOLD ALT TO FREE 1PX)
   * ========================================================================= */

  snap(val, isAltForced = false) {
    const isFree = isAltForced || this.isAltHeld || !this.snapEnabled || !this.snapGrid || this.snapGrid <= 1;
    if (isFree) {
      return Math.round(val);
    }
    return Math.round(val / this.snapGrid) * this.snapGrid;
  }

  toggleSnap() {
    this.snapEnabled = !this.snapEnabled;
    this._updateSnapButtonDisplay();
    this.game.ui.showToast(`🧲 Snap: ${this.snapEnabled ? `${this.snapGrid}px (Ativado)` : 'DESATIVADO (Livre 1px)'}`, 1400);
  }

  _updateSnapButtonDisplay() {
    const btn = this.domContainer.querySelector('#btn-ui-toggle-snap');
    const isFree = this.isAltHeld || !this.snapEnabled;
    if (btn) {
      btn.classList.toggle('snap-active', this.snapEnabled && !this.isAltHeld);
      btn.classList.toggle('snap-free', isFree);
      btn.innerHTML = isFree ? '🔓 LIVRE [1px]' : `🧲 Snap: ${this.snapGrid}px`;
    }
  }

  /* =========================================================================
   * 5. DEBUG DE HITBOX / COLISÕES (TECLA C)
   * ========================================================================= */

  toggleDebugHitboxes() {
    this.debugHitboxes = !this.debugHitboxes;
    this._updateHitboxButtonDisplay();
    this.game.ui.showToast(`🚨 Visualização de Hitboxes: ${this.debugHitboxes ? 'ATIVADA' : 'DESATIVADA'} [Tecla C]`, 1800);
  }

  _updateHitboxButtonDisplay() {
    const btn = this.domContainer.querySelector('#btn-ui-toggle-hitboxes');
    if (btn) {
      btn.classList.toggle('btn-hitbox-active', this.debugHitboxes);
      btn.innerHTML = this.debugHitboxes ? '🚨 Hitboxes [ON]' : '🚨 Hitboxes [C]';
    }
  }

  /* =========================================================================
   * 6. MODO TESTE / PREVIEW INTERATIVO (TECLA P)
   * ========================================================================= */

  togglePreviewMode() {
    this.previewMode = !this.previewMode;
    if (this.previewMode) {
      this.deselectItem();
    }
    this._updatePreviewButtonDisplay();
    const banner = this.domContainer.querySelector('#ui-preview-banner');
    if (banner) {
      banner.classList.toggle('hidden', !this.previewMode);
    }
    this.game.ui.showToast(`🎮 Modo Teste: ${this.previewMode ? 'ATIVADO (Clique nos botões!)' : 'DESATIVADO (Modo Edição)'}`, 2000);
  }

  _updatePreviewButtonDisplay() {
    const btn = this.domContainer.querySelector('#btn-ui-toggle-preview');
    if (btn) {
      btn.classList.toggle('active', this.previewMode);
      btn.innerHTML = this.previewMode ? '🎮 Sair Teste [P]' : '🎮 Modo Teste [P]';
    }
  }

  /* =========================================================================
   * 7. INSTANCIAÇÃO DE NÓS DE INTERFACE (4 TIPOS BASE)
   * ========================================================================= */

  /**
   * 1. TextLabel: Apenas texto puro.
   */
  addTextLabel(x = null, y = null, text = 'Novo Texto') {
    if (this.history) this.history.commit(null, 'Adicionar TextLabel');

    const canvas = this.game.canvas;
    const posX = x !== null ? this.snap(x) : this.snap(canvas.width / 2 - 100);
    const posY = y !== null ? this.snap(y) : this.snap(canvas.height / 2 - 20);

    const node = {
      id: `label_${Date.now().toString(36).slice(-4)}`,
      type: 'TextLabel',
      x: posX,
      y: posY,
      w: 200,
      h: 32,
      text,
      fontSize: 20,
      color: '#ffffff',
      fontFamily: "'Press Start 2P', monospace, sans-serif",
      align: 'left',
      baseline: 'top',
      shadow: true,
      shadowColor: 'rgba(0, 0, 0, 0.7)'
    };

    this.elements.push(node);
    this.selectItem(node);
    this.game.ui.showToast('🔤 TextLabel adicionado!');
    return node;
  }

  /**
   * 2. Button: Retângulo interativo que reage a cliques/hover e dispara ação.
   */
  addButton(x = null, y = null, label = 'BOTAO', onClickAction = 'START_GAME') {
    if (this.history) this.history.commit(null, 'Adicionar Button');

    const canvas = this.game.canvas;
    const posX = x !== null ? this.snap(x) : this.snap(canvas.width / 2 - 110);
    const posY = y !== null ? this.snap(y) : this.snap(canvas.height / 2 - 24);

    const node = {
      id: `btn_${Date.now().toString(36).slice(-4)}`,
      type: 'Button',
      x: posX,
      y: posY,
      w: 220,
      h: 48,
      label,
      fontSize: 16,
      color: '#ffffff',
      bgColor: '#0284c7',
      hoverColor: '#38bdf8',
      borderColor: '#38bdf8',
      borderWidth: 2,
      borderRadius: 8,
      onClickAction,
      isHovered: false
    };

    this.elements.push(node);
    this.selectItem(node);
    this.game.ui.showToast(`🔘 Button adicionado [Ação: ${onClickAction}]!`);
    return node;
  }

  /**
   * 3. Panel: Imagem ou cor sólida de fundo (janelas/inventários/cards).
   */
  addPanel(x = null, y = null, w = 480, h = 360, label = 'JANELA DE INTERFACE') {
    if (this.history) this.history.commit(null, 'Adicionar Panel');

    const canvas = this.game.canvas;
    const posX = x !== null ? this.snap(x) : this.snap(canvas.width / 2 - w / 2);
    const posY = y !== null ? this.snap(y) : this.snap(canvas.height / 2 - h / 2);

    const node = {
      id: `panel_${Date.now().toString(36).slice(-4)}`,
      type: 'Panel',
      x: posX,
      y: posY,
      w: Math.max(64, Math.round(w)),
      h: Math.max(48, Math.round(h)),
      bgColor: 'rgba(15, 23, 42, 0.94)',
      borderColor: '#38bdf8',
      borderWidth: 2.5,
      borderRadius: 12,
      opacity: 0.96,
      label,
      src: '',
      _img: null
    };

    // Insere no início (fundo) ou na posição atual
    this.elements.push(node);
    this.selectItem(node);
    this.game.ui.showToast('📦 Panel (Fundo/Janela) adicionado!');
    return node;
  }

  /**
   * 4. Image: Sprites estáticos de UI (ícones, logos, cursores).
   */
  addImage(x = null, y = null, src = '', label = 'Ícone UI', w = 96, h = 96) {
    if (this.history) this.history.commit(null, 'Adicionar Imagem');

    const canvas = this.game.canvas;
    const posX = x !== null ? this.snap(x) : this.snap(canvas.width / 2 - w / 2);
    const posY = y !== null ? this.snap(y) : this.snap(canvas.height / 2 - h / 2);

    const node = {
      id: `img_${Date.now().toString(36).slice(-4)}`,
      type: 'Image',
      x: posX,
      y: posY,
      w: Math.max(16, Math.round(w)),
      h: Math.max(16, Math.round(h)),
      src: src || '',
      label,
      opacity: 1.0,
      rotation: 0,
      _img: null
    };

    if (src) {
      const img = new Image();
      img.src = src;
      node._img = img;
    }

    this.elements.push(node);
    this.selectItem(node);
    this.game.ui.showToast('🖼️ Imagem de UI adicionada!');
    return node;
  }

  /* =========================================================================
   * 8. GERENCIAMENTO DE SELEÇÃO E PROPRIEDADES (INSPECTOR)
   * ========================================================================= */

  selectItem(element) {
    if (this.previewMode) return;
    this.selectedElement = element;
    this._renderPropertiesDock();
    this._updateSelectedChipDisplay();
  }

  deselectItem() {
    this.selectedElement = null;
    const dock = this.domContainer.querySelector('#ui-editor-properties-dock');
    if (dock) dock.classList.add('hidden');
    this._updateSelectedChipDisplay();
  }

  deleteSelectedItem() {
    if (!this.selectedElement) return;

    if (this.history) this.history.commit(null, 'Excluir Elemento UI');

    const idx = this.elements.indexOf(this.selectedElement);
    if (idx !== -1) {
      const removed = this.elements.splice(idx, 1)[0];
      this.game.ui.showToast(`🗑️ [${removed.label || removed.text || removed.id}] removido.`);
    }
    this.deselectItem();
  }

  duplicateSelectedItem() {
    if (!this.selectedElement) return;

    if (this.history) this.history.commit(null, 'Duplicar Elemento UI');

    const offset = this.snapGrid > 0 ? this.snapGrid : 16;
    const original = this.selectedElement;

    const clone = {
      ...original,
      id: `${original.type.toLowerCase().slice(0, 3)}_${Date.now().toString(36).slice(-4)}`,
      x: original.x + offset,
      y: original.y + offset
    };

    if (clone.label) clone.label = `${original.label} (Cópia)`;
    if (clone.text) clone.text = `${original.text} (Cópia)`;
    if (original._img) clone._img = original._img;

    this.elements.push(clone);
    this.selectItem(clone);
    this.game.ui.showToast('📋 Elemento duplicado!');
  }

  _updateSelectedChipDisplay() {
    const chip = this.domContainer.querySelector('#ui-selected-element-chip');
    if (!chip) return;
    if (!this.selectedElement) {
      chip.innerHTML = 'Nenhum elemento selecionado';
      chip.className = 'ui-editor-tag-pill';
      return;
    }

    const el = this.selectedElement;
    const idx = this.elements.indexOf(el);
    const label = el.label || el.text || el.id;
    chip.innerHTML = `<strong>${el.type}:</strong> ${label} <small>[Z:${idx + 1}/${this.elements.length}]</small>`;
    chip.className = 'ui-editor-tag-pill active';
  }

  _renderPropertiesDock() {
    const dock = this.domContainer.querySelector('#ui-editor-properties-dock');
    const title = this.domContainer.querySelector('#ui-prop-title');
    const fields = this.domContainer.querySelector('#ui-prop-fields');
    const zIndText = this.domContainer.querySelector('#ui-prop-zindex-text');
    const actionBadge = this.domContainer.querySelector('#ui-prop-action-badge');
    const actionSubrow = this.domContainer.querySelector('#ui-prop-action-subrow');
    if (!dock || !this.selectedElement) return;

    dock.classList.remove('hidden');
    const el = this.selectedElement;
    const idx = this.elements.indexOf(el);

    if (zIndText) zIndText.textContent = `Z: ${idx + 1}/${this.elements.length}`;
    if (title) title.textContent = `${el.type.toUpperCase()}: ${el.label || el.text || el.id}`;

    // Sublinha de ação de clique para Botões
    if (actionSubrow) {
      actionSubrow.style.display = el.type === 'Button' ? 'flex' : 'none';
      if (actionBadge) {
        actionBadge.textContent = el.onClickAction || 'NENHUMA';
      }
    }

    // Campos do formulário dinâmico
    let contentFieldHtml = '';
    if (el.type === 'TextLabel') {
      contentFieldHtml = `
        <div class="prop-field-row">
          <label>Texto Puro:</label>
          <input type="text" id="prop-ui-text" value="${el.text || ''}" />
        </div>
        <div class="prop-field-grid">
          <div class="prop-field-col">
            <label>Fonte (px):</label>
            <input type="number" id="prop-ui-fontsize" value="${el.fontSize || 18}" min="8" max="72" />
          </div>
          <div class="prop-field-col">
            <label>Cor do Texto:</label>
            <input type="text" id="prop-ui-color" value="${el.color || '#ffffff'}" />
          </div>
        </div>
      `;
    } else if (el.type === 'Button') {
      contentFieldHtml = `
        <div class="prop-field-row">
          <label>Rótulo do Botão:</label>
          <input type="text" id="prop-ui-label" value="${el.label || ''}" />
        </div>
        <div class="prop-field-grid">
          <div class="prop-field-col">
            <label>Cor de Fundo:</label>
            <input type="text" id="prop-ui-bgcolor" value="${el.bgColor || '#0284c7'}" />
          </div>
          <div class="prop-field-col">
            <label>Cor de Hover:</label>
            <input type="text" id="prop-ui-hovercolor" value="${el.hoverColor || '#38bdf8'}" />
          </div>
        </div>
      `;
    } else if (el.type === 'Panel') {
      contentFieldHtml = `
        <div class="prop-field-row">
          <label>Título / Cabeçalho:</label>
          <input type="text" id="prop-ui-label" value="${el.label || ''}" />
        </div>
        <div class="prop-field-grid">
          <div class="prop-field-col">
            <label>Cor de Fundo:</label>
            <input type="text" id="prop-ui-bgcolor" value="${el.bgColor || 'rgba(15, 23, 42, 0.94)'}" />
          </div>
          <div class="prop-field-col">
            <label>Cor da Borda:</label>
            <input type="text" id="prop-ui-bordercolor" value="${el.borderColor || '#38bdf8'}" />
          </div>
        </div>
      `;
    } else if (el.type === 'Image') {
      contentFieldHtml = `
        <div class="prop-field-row">
          <label>Identificador / Nome:</label>
          <input type="text" id="prop-ui-label" value="${el.label || ''}" />
        </div>
        <div class="prop-field-row">
          <label>Fonte da Imagem (URL / Path):</label>
          <div style="display:flex; gap:6px;">
            <input type="text" id="prop-ui-src" value="${el.src || ''}" style="flex:1;" />
            <button type="button" id="btn-prop-upload-img" class="stardew-btn btn-secondary btn-xs">📁</button>
          </div>
        </div>
      `;
    }

    fields.innerHTML = `
      ${contentFieldHtml}

      <div class="prop-field-grid" style="margin-top: 4px;">
        <div class="prop-field-col">
          <label>X (px):</label>
          <input type="number" id="prop-ui-x" value="${Math.round(el.x)}" step="${this.snapGrid || 1}" />
        </div>
        <div class="prop-field-col">
          <label>Y (px):</label>
          <input type="number" id="prop-ui-y" value="${Math.round(el.y)}" step="${this.snapGrid || 1}" />
        </div>
      </div>

      <div class="prop-field-grid">
        <div class="prop-field-col">
          <label>Largura (W):</label>
          <input type="number" id="prop-ui-w" value="${Math.round(el.w)}" min="8" step="${this.snapGrid || 1}" />
        </div>
        <div class="prop-field-col">
          <label>Altura (H):</label>
          <input type="number" id="prop-ui-h" value="${Math.round(el.h)}" min="8" step="${this.snapGrid || 1}" />
        </div>
      </div>
    `;

    // Eventos de alteração imediata
    const bindInp = (selector, callback) => {
      const inp = fields.querySelector(selector);
      if (inp) inp.addEventListener('input', callback);
    };

    bindInp('#prop-ui-text', (e) => {
      el.text = e.target.value;
      this._measureElementDimensions(el);
      this._updateSelectedChipDisplay();
    });

    bindInp('#prop-ui-label', (e) => {
      el.label = e.target.value;
      this._updateSelectedChipDisplay();
    });

    bindInp('#prop-ui-fontsize', (e) => {
      el.fontSize = parseInt(e.target.value, 10) || 16;
      this._measureElementDimensions(el);
    });

    bindInp('#prop-ui-color', (e) => {
      el.color = e.target.value;
    });

    bindInp('#prop-ui-bgcolor', (e) => {
      el.bgColor = e.target.value;
    });

    bindInp('#prop-ui-hovercolor', (e) => {
      el.hoverColor = e.target.value;
    });

    bindInp('#prop-ui-bordercolor', (e) => {
      el.borderColor = e.target.value;
    });

    bindInp('#prop-ui-src', (e) => {
      el.src = e.target.value;
      if (el.src) {
        const img = new Image();
        img.src = el.src;
        el._img = img;
      } else {
        el._img = null;
      }
    });

    bindInp('#prop-ui-x', (e) => {
      el.x = parseInt(e.target.value, 10) || 0;
    });

    bindInp('#prop-ui-y', (e) => {
      el.y = parseInt(e.target.value, 10) || 0;
    });

    bindInp('#prop-ui-w', (e) => {
      el.w = Math.max(12, parseInt(e.target.value, 10) || 12);
    });

    bindInp('#prop-ui-h', (e) => {
      el.h = Math.max(12, parseInt(e.target.value, 10) || 12);
    });

    const btnUpload = fields.querySelector('#btn-prop-upload-img');
    if (btnUpload) {
      btnUpload.addEventListener('click', () => {
        const fileInput = this.domContainer.querySelector('#ui-image-file-input');
        if (fileInput) fileInput.click();
      });
    }

    // Registra snapshot ao focar campos e grava no histórico se houver alteração ao mudar/perder foco (Sprint 11 - Requisito 2)
    fields.addEventListener('focusin', () => {
      this._dockEditPreSnapshot = this.getLayoutStateSnapshot();
    });
    fields.addEventListener('change', () => {
      if (this._dockEditPreSnapshot && this.history) {
        this.history.commit(this._dockEditPreSnapshot, 'Editar Propriedade UI');
      }
      this._dockEditPreSnapshot = this.getLayoutStateSnapshot();
    });
  }

  /* =========================================================================
   * 9. REORDENAÇÃO DE Z-INDEX (TECLAS '[' E ']')
   * ========================================================================= */

  moveSelectedItemZIndex(direction) {
    if (!this.selectedElement) return;
    const currentIndex = this.elements.indexOf(this.selectedElement);
    if (currentIndex === -1) return;

    if (direction < 0) {
      // Mover para trás ('[' ou PageDown)
      if (currentIndex > 0) {
        if (this.history) this.history.commit(null, 'Mover UI para Trás');
        const targetIndex = currentIndex - 1;
        const [removed] = this.elements.splice(currentIndex, 1);
        this.elements.splice(targetIndex, 0, removed);
        this._renderPropertiesDock();
        this._updateSelectedChipDisplay();
        this.game.ui.showToast(`⬇️ [${this.selectedElement.label || this.selectedElement.text || 'Item'}] movido para trás (Z-Index: ${targetIndex + 1}/${this.elements.length})`, 1300);
      } else {
        this.game.ui.showToast('⚠️ O item já está no fundo absoluto da interface!', 1200);
      }
    } else if (direction > 0) {
      // Mover para a frente (']' ou PageUp)
      if (currentIndex < this.elements.length - 1) {
        if (this.history) this.history.commit(null, 'Mover UI para Frente');
        const targetIndex = currentIndex + 1;
        const [removed] = this.elements.splice(currentIndex, 1);
        this.elements.splice(targetIndex, 0, removed);
        this._renderPropertiesDock();
        this._updateSelectedChipDisplay();
        this.game.ui.showToast(`⬆️ [${this.selectedElement.label || this.selectedElement.text || 'Item'}] movido para a frente (Z-Index: ${targetIndex + 1}/${this.elements.length})`, 1300);
      } else {
        this.game.ui.showToast('⚠️ O item já está no topo absoluto da interface!', 1200);
      }
    }
  }

  /* =========================================================================
   * 10. MODAL DE EDIÇÃO DE PROPRIEDADES E CONTEÚDO (TECLA E)
   * ========================================================================= */

  isEditModalOpen() {
    const modal = this.domContainer.querySelector('#ui-editor-edit-modal');
    return modal && !modal.classList.contains('hidden');
  }

  openEditModal() {
    if (!this.selectedElement) {
      this.game.ui.showToast('Selecione um elemento de UI primeiro para editar [E]!');
      return;
    }

    const modal = this.domContainer.querySelector('#ui-editor-edit-modal');
    const title = this.domContainer.querySelector('#ui-modal-edit-title');
    const fieldsContainer = this.domContainer.querySelector('#ui-modal-edit-fields');
    if (!modal || !fieldsContainer) return;

    const el = this.selectedElement;
    title.textContent = `Editar ${el.type}: ${el.label || el.text || el.id}`;

    let html = `
      <div class="ui-field-row">
        <label>Identificador Único (ID):</label>
        <input type="text" id="modal-edit-id" value="${el.id}" class="ui-text-input" />
      </div>
    `;

    // Campos de Texto / Conteúdo (Requisito 3)
    if (el.type === 'TextLabel') {
      html += `
        <div class="ui-field-row">
          <label>Conteúdo Escrito (Texto):</label>
          <textarea id="modal-edit-text" class="ui-textarea" rows="2">${el.text || ''}</textarea>
        </div>
        <div class="ui-field-grid-3">
          <div class="ui-field-col">
            <label>Tamanho da Fonte (px):</label>
            <input type="number" id="modal-edit-fontsize" value="${el.fontSize || 18}" min="8" max="96" class="ui-text-input" />
          </div>
          <div class="ui-field-col">
            <label>Cor da Fonte:</label>
            <div style="display:flex; gap:6px;">
              <input type="color" id="modal-edit-color-picker" value="${this._formatColorForPicker(el.color)}" class="ui-color-picker" />
              <input type="text" id="modal-edit-color" value="${el.color || '#ffffff'}" class="ui-text-input" />
            </div>
          </div>
          <div class="ui-field-col">
            <label>Alinhamento:</label>
            <select id="modal-edit-align" class="ui-dropdown">
              <option value="left" ${el.align === 'left' ? 'selected' : ''}>Esquerda</option>
              <option value="center" ${el.align === 'center' ? 'selected' : ''}>Centro</option>
              <option value="right" ${el.align === 'right' ? 'selected' : ''}>Direita</option>
            </select>
          </div>
        </div>
      `;
    } else if (el.type === 'Button') {
      html += `
        <div class="ui-field-row">
          <label>Texto do Botão:</label>
          <input type="text" id="modal-edit-label" value="${el.label || ''}" class="ui-text-input" />
        </div>
        <div class="ui-field-grid-3">
          <div class="ui-field-col">
            <label>Tamanho da Fonte (px):</label>
            <input type="number" id="modal-edit-fontsize" value="${el.fontSize || 16}" min="8" max="64" class="ui-text-input" />
          </div>
          <div class="ui-field-col">
            <label>Cor do Texto:</label>
            <div style="display:flex; gap:6px;">
              <input type="color" id="modal-edit-color-picker" value="${this._formatColorForPicker(el.color)}" class="ui-color-picker" />
              <input type="text" id="modal-edit-color" value="${el.color || '#ffffff'}" class="ui-text-input" />
            </div>
          </div>
          <div class="ui-field-col">
            <label>Cor de Fundo:</label>
            <div style="display:flex; gap:6px;">
              <input type="color" id="modal-edit-bgcolor-picker" value="${this._formatColorForPicker(el.bgColor)}" class="ui-color-picker" />
              <input type="text" id="modal-edit-bgcolor" value="${el.bgColor || '#0284c7'}" class="ui-text-input" />
            </div>
          </div>
        </div>
        <div class="ui-field-grid-2">
          <div class="ui-field-col">
            <label>Cor de Hover (Realce do Cursor):</label>
            <div style="display:flex; gap:6px;">
              <input type="color" id="modal-edit-hovercolor-picker" value="${this._formatColorForPicker(el.hoverColor)}" class="ui-color-picker" />
              <input type="text" id="modal-edit-hovercolor" value="${el.hoverColor || '#38bdf8'}" class="ui-text-input" />
            </div>
          </div>
          <div class="ui-field-col">
            <label>Ação de Clique (onClickAction):</label>
            <input type="text" id="modal-edit-action" value="${el.onClickAction || 'START_GAME'}" class="ui-text-input" />
          </div>
        </div>
      `;
    } else if (el.type === 'Panel') {
      html += `
        <div class="ui-field-row">
          <label>Título da Janela / Painel:</label>
          <input type="text" id="modal-edit-label" value="${el.label || ''}" class="ui-text-input" />
        </div>
        <div class="ui-field-grid-2">
          <div class="ui-field-col">
            <label>Cor de Fundo (CSS/RGBA):</label>
            <input type="text" id="modal-edit-bgcolor" value="${el.bgColor || 'rgba(15, 23, 42, 0.94)'}" class="ui-text-input" />
          </div>
          <div class="ui-field-col">
            <label>Cor da Borda:</label>
            <div style="display:flex; gap:6px;">
              <input type="color" id="modal-edit-bordercolor-picker" value="${this._formatColorForPicker(el.borderColor)}" class="ui-color-picker" />
              <input type="text" id="modal-edit-bordercolor" value="${el.borderColor || '#38bdf8'}" class="ui-text-input" />
            </div>
          </div>
        </div>
      `;
    } else if (el.type === 'Image') {
      html += `
        <div class="ui-field-row">
          <label>Rótulo / Descrição:</label>
          <input type="text" id="modal-edit-label" value="${el.label || ''}" class="ui-text-input" />
        </div>
        <div class="ui-field-row">
          <label>Fonte da Imagem (URL ou Arquivo Base64):</label>
          <input type="text" id="modal-edit-src" value="${el.src || ''}" class="ui-text-input" />
        </div>
      `;
    }

    // Campos de Dimensões (Hitbox / Largura e Altura) (Requisito 3)
    html += `
      <div class="ui-field-grid-4" style="margin-top: 8px;">
        <div class="ui-field-col">
          <label>Posição X (px):</label>
          <input type="number" id="modal-edit-x" value="${Math.round(el.x)}" class="ui-text-input" />
        </div>
        <div class="ui-field-col">
          <label>Posição Y (px):</label>
          <input type="number" id="modal-edit-y" value="${Math.round(el.y)}" class="ui-text-input" />
        </div>
        <div class="ui-field-col">
          <label>Largura Hitbox (W px):</label>
          <input type="number" id="modal-edit-w" value="${Math.round(el.w)}" min="8" class="ui-text-input" />
        </div>
        <div class="ui-field-col">
          <label>Altura Hitbox (H px):</label>
          <input type="number" id="modal-edit-h" value="${Math.round(el.h)}" min="8" class="ui-text-input" />
        </div>
      </div>
    `;

    fieldsContainer.innerHTML = html;

    // Sincroniza Color Pickers com inputs de texto
    const syncPicker = (pickerId, textId) => {
      const p = fieldsContainer.querySelector(pickerId);
      const t = fieldsContainer.querySelector(textId);
      if (p && t) {
        p.addEventListener('input', () => { t.value = p.value; });
        t.addEventListener('input', () => { p.value = this._formatColorForPicker(t.value); });
      }
    };

    syncPicker('#modal-edit-color-picker', '#modal-edit-color');
    syncPicker('#modal-edit-bgcolor-picker', '#modal-edit-bgcolor');
    syncPicker('#modal-edit-hovercolor-picker', '#modal-edit-hovercolor');
    syncPicker('#modal-edit-bordercolor-picker', '#modal-edit-bordercolor');

    modal.classList.remove('hidden');
  }

  saveEditModal() {
    if (!this.selectedElement) return;

    // Commit no histórico antes de salvar edições (Sprint 11 - Requisito 2)
    if (this.history) this.history.commit(null, 'Editar Propriedades UI [E]');

    const modal = this.domContainer.querySelector('#ui-editor-edit-modal');
    const el = this.selectedElement;

    const val = (id) => {
      const inp = modal.querySelector(id);
      return inp ? inp.value : null;
    };

    const num = (id) => {
      const v = val(id);
      return v !== null ? parseInt(v, 10) : null;
    };

    if (val('#modal-edit-id')) el.id = val('#modal-edit-id');
    if (val('#modal-edit-text') !== null) el.text = val('#modal-edit-text');
    if (val('#modal-edit-label') !== null) el.label = val('#modal-edit-label');
    if (num('#modal-edit-fontsize') !== null) el.fontSize = num('#modal-edit-fontsize');
    if (val('#modal-edit-color') !== null) el.color = val('#modal-edit-color');
    if (val('#modal-edit-align') !== null) el.align = val('#modal-edit-align');
    if (val('#modal-edit-bgcolor') !== null) el.bgColor = val('#modal-edit-bgcolor');
    if (val('#modal-edit-hovercolor') !== null) el.hoverColor = val('#modal-edit-hovercolor');
    if (val('#modal-edit-bordercolor') !== null) el.borderColor = val('#modal-edit-bordercolor');
    if (val('#modal-edit-action') !== null) el.onClickAction = val('#modal-edit-action').trim();

    if (val('#modal-edit-src') !== null) {
      el.src = val('#modal-edit-src');
      if (el.src) {
        const img = new Image();
        img.src = el.src;
        el._img = img;
      } else {
        el._img = null;
      }
    }

    if (num('#modal-edit-x') !== null) el.x = num('#modal-edit-x');
    if (num('#modal-edit-y') !== null) el.y = num('#modal-edit-y');
    if (num('#modal-edit-w') !== null) el.w = Math.max(8, num('#modal-edit-w'));
    if (num('#modal-edit-h') !== null) el.h = Math.max(8, num('#modal-edit-h'));

    this._measureElementDimensions(el);
    this._renderPropertiesDock();
    this._updateSelectedChipDisplay();
    this.closeEditModal();
    this.game.ui.showToast('✓ Propriedades salvas com sucesso!');
  }

  closeEditModal() {
    const modal = this.domContainer.querySelector('#ui-editor-edit-modal');
    if (modal) modal.classList.add('hidden');
  }

  _formatColorForPicker(colorStr) {
    if (!colorStr) return '#000000';
    if (colorStr.startsWith('#') && colorStr.length === 7) return colorStr;
    if (colorStr.startsWith('#') && colorStr.length === 4) {
      return `#${colorStr[1]}${colorStr[1]}${colorStr[2]}${colorStr[2]}${colorStr[3]}${colorStr[3]}`;
    }
    return '#38bdf8';
  }

  /* =========================================================================
   * 11. VINCULAÇÃO DE EVENTOS / ACTION TRIGGERS (TECLA I)
   * ========================================================================= */

  isActionModalOpen() {
    const modal = this.domContainer.querySelector('#ui-editor-action-modal');
    return modal && !modal.classList.contains('hidden');
  }

  openActionModal() {
    if (!this.selectedElement) {
      this.game.ui.showToast('Selecione um Botão de UI primeiro para configurar a ação [I]!');
      return;
    }

    if (this.selectedElement.type !== 'Button') {
      this.game.ui.showToast('ℹ️ Ações de clique pertencem a nós do tipo Button!');
      return;
    }

    const modal = this.domContainer.querySelector('#ui-editor-action-modal');
    const targetName = this.domContainer.querySelector('#ui-action-target-name');
    const currVal = this.domContainer.querySelector('#ui-action-current-value');
    const customInp = this.domContainer.querySelector('#ui-action-custom-input');
    if (!modal) return;

    const el = this.selectedElement;
    if (targetName) targetName.textContent = el.label || el.id;
    if (currVal) currVal.textContent = el.onClickAction || 'NENHUMA';
    if (customInp) customInp.value = el.onClickAction || '';

    // Destaque nos chips pré-definidos
    modal.querySelectorAll('.ui-action-chip').forEach((chip) => {
      const act = chip.getAttribute('data-action');
      chip.classList.toggle('selected', act === el.onClickAction);
    });

    modal.classList.remove('hidden');
  }

  saveActionModal() {
    if (!this.selectedElement) return;

    // Commit no histórico antes de alterar ação (Sprint 11 - Requisito 2)
    if (this.history) this.history.commit(null, 'Definir Ação de Clique [I]');

    const modal = this.domContainer.querySelector('#ui-editor-action-modal');
    const inp = modal.querySelector('#ui-action-custom-input');
    if (inp) {
      this.selectedElement.onClickAction = inp.value.trim().toUpperCase() || 'NONE';
      this._renderPropertiesDock();
      this.game.ui.showToast(`⚡ Ação do botão definida para: [${this.selectedElement.onClickAction}]!`, 2000);
    }
    this.closeActionModal();
  }

  closeActionModal() {
    const modal = this.domContainer.querySelector('#ui-editor-action-modal');
    if (modal) modal.classList.add('hidden');
  }

  /**
   * Executa a ação do jogo associada ao botão
   */
  executeGameAction(actionKey) {
    if (!actionKey || actionKey === 'NONE') return;
    const game = this.game;

    switch (actionKey.trim().toUpperCase()) {
      case 'START_GAME':
        console.log("Transi\u00e7\u00e3o para o jogo iniciada...");
        this.close();
        game.startNewGame();
        game.ui.showToast('🚀 Ação Disparada: START_GAME (Iniciando Partida)', 2200);
        break;

      case 'OPEN_SETTINGS':
        this.close();
        game.ui.openSettingsModal();
        game.ui.showToast('⚙️ Ação Disparada: OPEN_SETTINGS (Painel Aberto)', 1800);
        break;

      case 'TOGGLE_COLORBLIND':
        game.ui.setColorblindMode(!window.colorblindMode);
        game.ui.showToast(`👁️ Ação Disparada: Modo Daltônico ${window.colorblindMode ? 'ATIVADO' : 'DESATIVADO'}`, 2000);
        break;

      case 'CLOSE_MENU':
        game.ui.hidePauseMenu();
        game.ui.closeSettingsModal();
        game.ui.showToast('✖ Ação Disparada: CLOSE_MENU', 1600);
        break;

      case 'RESUME_GAME':
        this.close();
        game.togglePause(false);
        game.ui.showToast('▶️ Ação Disparada: RESUME_GAME (Jogo Retomado)', 1800);
        break;

      case 'RESTART_STAGE':
        this.close();
        game.restartCurrentStage();
        game.ui.showToast('🔄 Ação Disparada: RESTART_STAGE (Fase Reiniciada)', 2000);
        break;

      case 'QUIT_TO_MENU':
        this.close();
        game.returnToMainMenu();
        game.ui.showToast('🏠 Ação Disparada: QUIT_TO_MENU (Menu Principal)', 2000);
        break;

      case 'TOGGLE_MUTE':
        window.isMuted = !window.isMuted;
        game.ui.syncSettingsUI();
        game.ui.showToast(`🔇 Ação Disparada: Áudio ${window.isMuted ? 'MUTADO' : 'ATIVO'}`, 1800);
        break;

      case 'OPEN_SHOP':
        this.close();
        game.ui.showShopModal();
        game.ui.showToast('🛒 Ação Disparada: OPEN_SHOP (Loja da Van)', 2000);
        break;

      case 'OPEN_NOTICE_BOARD':
        this.close();
        game.ui.showNoticeBoardModal();
        game.ui.showToast('📋 Ação Disparada: OPEN_NOTICE_BOARD (Mural)', 2000);
        break;

      default:
        game.ui.showToast(`⚡ Ação Personalizada Disparada: ${actionKey}`, 2200);
        break;
    }
  }

  /* =========================================================================
   * 12. MEDIÇÃO AUTOMÁTICA E HITBOX
   * ========================================================================= */

  _measureElementDimensions(el) {
    if (el.type === 'TextLabel') {
      const ctx = this.game.ctx;
      ctx.save();
      ctx.font = `${el.fontSize || 18}px ${el.fontFamily || 'monospace'}`;
      const metrics = ctx.measureText(el.text || '');
      el.w = Math.max(20, Math.ceil(metrics.width + 12));
      el.h = Math.max(16, Math.ceil((el.fontSize || 18) * 1.35));
      ctx.restore();
    }
  }

  /* =========================================================================
   * 13. PRESETS DE INTERFACE (TITLE, VAN, HUD, PAUSE)
   * ========================================================================= */

  loadPreset(presetKey) {
    const canvas = this.game.canvas;
    const cw = canvas.width || 1280;
    const ch = canvas.height || 720;
    const cx = cw / 2;
    const cy = ch / 2;

    this.elements = [];

    if (presetKey === 'title_screen') {
      this.currentScreenId = 'title_screen';
      this.currentScreenName = 'Tela de Título (Title Screen)';

      // 1. Painel Fundo
      this.elements.push({
        id: 'panel_title_bg',
        type: 'Panel',
        x: Math.round(cx - 320),
        y: Math.round(cy - 240),
        w: 640,
        h: 480,
        bgColor: 'rgba(15, 23, 42, 0.94)',
        borderColor: '#38bdf8',
        borderWidth: 3,
        borderRadius: 12,
        opacity: 0.96,
        label: 'SISTEMA DE MENU PRINCIPAL'
      });

      // 2. Título Principal
      this.elements.push({
        id: 'label_title_main',
        type: 'TextLabel',
        x: Math.round(cx),
        y: Math.round(cy - 180),
        w: 480,
        h: 36,
        text: 'ScienceEco Girls',
        fontSize: 32,
        color: '#38bdf8',
        fontFamily: "'Press Start 2P', monospace, sans-serif",
        align: 'center',
        baseline: 'top',
        shadow: true
      });

      // 3. Subtítulo
      this.elements.push({
        id: 'label_title_sub',
        type: 'TextLabel',
        x: Math.round(cx),
        y: Math.round(cy - 130),
        w: 400,
        h: 24,
        text: 'Operação Saneamento Urbano',
        fontSize: 14,
        color: '#94a3b8',
        fontFamily: "'Press Start 2P', monospace, sans-serif",
        align: 'center',
        baseline: 'top',
        shadow: true
      });

      // 4. Botão Iniciar Partida
      this.elements.push({
        id: 'btn_title_start',
        type: 'Button',
        x: Math.round(cx - 150),
        y: Math.round(cy - 70),
        w: 300,
        h: 48,
        label: '🚀 INICIAR PARTIDA',
        fontSize: 15,
        color: '#ffffff',
        bgColor: '#0284c7',
        hoverColor: '#38bdf8',
        borderColor: '#38bdf8',
        borderWidth: 2,
        borderRadius: 8,
        onClickAction: 'START_GAME'
      });

      // 5. Botão Configurações
      this.elements.push({
        id: 'btn_title_settings',
        type: 'Button',
        x: Math.round(cx - 150),
        y: Math.round(cy - 8),
        w: 300,
        h: 48,
        label: '⚙️ CONFIGURAÇÕES',
        fontSize: 15,
        color: '#ffffff',
        bgColor: '#1e293b',
        hoverColor: '#334155',
        borderColor: '#64748b',
        borderWidth: 2,
        borderRadius: 8,
        onClickAction: 'OPEN_SETTINGS'
      });

      // 6. Botão Modo Daltônico
      this.elements.push({
        id: 'btn_title_colorblind',
        type: 'Button',
        x: Math.round(cx - 150),
        y: Math.round(cy + 54),
        w: 300,
        h: 48,
        label: '👁️ MODO DALTÔNICO',
        fontSize: 15,
        color: '#ffffff',
        bgColor: '#1e293b',
        hoverColor: '#334155',
        borderColor: '#64748b',
        borderWidth: 2,
        borderRadius: 8,
        onClickAction: 'TOGGLE_COLORBLIND'
      });

      // 7. Botão Mutar Áudio
      this.elements.push({
        id: 'btn_title_mute',
        type: 'Button',
        x: Math.round(cx - 150),
        y: Math.round(cy + 116),
        w: 300,
        h: 48,
        label: '🔇 ALTERNAR ÁUDIO',
        fontSize: 15,
        color: '#ffffff',
        bgColor: '#1e293b',
        hoverColor: '#334155',
        borderColor: '#64748b',
        borderWidth: 2,
        borderRadius: 8,
        onClickAction: 'TOGGLE_MUTE'
      });

      // 8. Rodapé
      this.elements.push({
        id: 'label_title_footer',
        type: 'TextLabel',
        x: Math.round(cx),
        y: Math.round(cy + 190),
        w: 380,
        h: 20,
        text: 'Gamejam 2026 — Sprint 10 UI Layout',
        fontSize: 11,
        color: '#64748b',
        fontFamily: "'Press Start 2P', monospace, sans-serif",
        align: 'center',
        baseline: 'top',
        shadow: false
      });
    } else if (presetKey === 'van_screen') {
      this.currentScreenId = 'van_screen';
      this.currentScreenName = 'Tela da Van (Hub de Operações)';

      this.elements.push({
        id: 'panel_van_hub',
        type: 'Panel',
        x: Math.round(cx - 360),
        y: Math.round(cy - 250),
        w: 720,
        h: 500,
        bgColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: '#facc15',
        borderWidth: 3,
        borderRadius: 12,
        opacity: 0.96,
        label: 'VAN DE OPERAÇÕES — HUB CENTRAL'
      });

      this.elements.push({
        id: 'label_van_title',
        type: 'TextLabel',
        x: Math.round(cx),
        y: Math.round(cy - 190),
        w: 520,
        h: 32,
        text: 'BASE TÁTICA DA VAN',
        fontSize: 26,
        color: '#facc15',
        fontFamily: "'Press Start 2P', monospace, sans-serif",
        align: 'center',
        baseline: 'top',
        shadow: true
      });

      this.elements.push({
        id: 'label_van_sub',
        type: 'TextLabel',
        x: Math.round(cx),
        y: Math.round(cy - 145),
        w: 480,
        h: 22,
        text: 'Reabasteça suprimentos e selecione a missão:',
        fontSize: 13,
        color: '#cbd5e1',
        fontFamily: "'Press Start 2P', monospace, sans-serif",
        align: 'center',
        baseline: 'top',
        shadow: true
      });

      this.elements.push({
        id: 'btn_van_shop',
        type: 'Button',
        x: Math.round(cx - 200),
        y: Math.round(cy - 80),
        w: 400,
        h: 52,
        label: '⚔️ LOJA DE ARMAS MELEE',
        fontSize: 15,
        color: '#ffffff',
        bgColor: '#0284c7',
        hoverColor: '#38bdf8',
        borderColor: '#38bdf8',
        borderWidth: 2,
        borderRadius: 8,
        onClickAction: 'OPEN_SHOP'
      });

      this.elements.push({
        id: 'btn_van_notice',
        type: 'Button',
        x: Math.round(cx - 200),
        y: Math.round(cy - 16),
        w: 400,
        h: 52,
        label: '📋 MURAL DE AVISOS TÁTICOS',
        fontSize: 15,
        color: '#ffffff',
        bgColor: '#1e293b',
        hoverColor: '#334155',
        borderColor: '#64748b',
        borderWidth: 2,
        borderRadius: 8,
        onClickAction: 'OPEN_NOTICE_BOARD'
      });

      this.elements.push({
        id: 'btn_van_settings',
        type: 'Button',
        x: Math.round(cx - 200),
        y: Math.round(cy + 48),
        w: 400,
        h: 52,
        label: '⚙️ AJUSTES & ACESSIBILIDADE',
        fontSize: 15,
        color: '#ffffff',
        bgColor: '#1e293b',
        hoverColor: '#334155',
        borderColor: '#64748b',
        borderWidth: 2,
        borderRadius: 8,
        onClickAction: 'OPEN_SETTINGS'
      });

      this.elements.push({
        id: 'btn_van_quit',
        type: 'Button',
        x: Math.round(cx - 200),
        y: Math.round(cy + 112),
        w: 400,
        h: 52,
        label: '🏠 SAIR PARA O MENU PRINCIPAL',
        fontSize: 15,
        color: '#ffffff',
        bgColor: '#7f1d1d',
        hoverColor: '#991b1b',
        borderColor: '#f87171',
        borderWidth: 2,
        borderRadius: 8,
        onClickAction: 'QUIT_TO_MENU'
      });
    } else if (presetKey === 'hud_screen') {
      this.currentScreenId = 'hud_screen';
      this.currentScreenName = 'HUD In-Game (Vida & Tempo)';

      // Card de HP P1
      this.elements.push({
        id: 'panel_hud_p1',
        type: 'Panel',
        x: 24,
        y: 24,
        w: 260,
        h: 84,
        bgColor: 'rgba(15, 23, 42, 0.9)',
        borderColor: '#38bdf8',
        borderWidth: 2,
        borderRadius: 8,
        opacity: 0.95,
        label: 'JOGADOR 1'
      });

      this.elements.push({
        id: 'label_hud_p1_hp',
        type: 'TextLabel',
        x: 40,
        y: 60,
        w: 220,
        h: 24,
        text: 'HP: 100 / 100',
        fontSize: 16,
        color: '#38bdf8',
        fontFamily: "'Press Start 2P', monospace, sans-serif",
        align: 'left',
        baseline: 'top',
        shadow: true
      });

      // Card de Cronômetro
      this.elements.push({
        id: 'panel_hud_timer',
        type: 'Panel',
        x: Math.round(cx - 100),
        y: 24,
        w: 200,
        h: 70,
        bgColor: 'rgba(15, 23, 42, 0.9)',
        borderColor: '#facc15',
        borderWidth: 2,
        borderRadius: 8,
        opacity: 0.95,
        label: 'TEMPO RESTANTE'
      });

      this.elements.push({
        id: 'label_hud_time_val',
        type: 'TextLabel',
        x: Math.round(cx),
        y: 54,
        w: 160,
        h: 26,
        text: '⏱ 03:00',
        fontSize: 20,
        color: '#facc15',
        fontFamily: "'Press Start 2P', monospace, sans-serif",
        align: 'center',
        baseline: 'top',
        shadow: true
      });

      // Botão Pausa
      this.elements.push({
        id: 'btn_hud_pause',
        type: 'Button',
        x: Math.round(cw - 160),
        y: 24,
        w: 136,
        h: 46,
        label: '⏸️ PAUSAR',
        fontSize: 14,
        color: '#ffffff',
        bgColor: '#1e293b',
        hoverColor: '#38bdf8',
        borderColor: '#38bdf8',
        borderWidth: 2,
        borderRadius: 8,
        onClickAction: 'OPEN_SETTINGS'
      });
    } else if (presetKey === 'pause_screen') {
      this.currentScreenId = 'pause_screen';
      this.currentScreenName = 'Menu de Pausa';

      this.elements.push({
        id: 'panel_pause_modal',
        type: 'Panel',
        x: Math.round(cx - 260),
        y: Math.round(cy - 220),
        w: 520,
        h: 440,
        bgColor: 'rgba(15, 23, 42, 0.96)',
        borderColor: '#38bdf8',
        borderWidth: 3,
        borderRadius: 12,
        opacity: 0.96,
        label: 'PAUSA DO JOGO'
      });

      this.elements.push({
        id: 'label_pause_title',
        type: 'TextLabel',
        x: Math.round(cx),
        y: Math.round(cy - 165),
        w: 360,
        h: 30,
        text: 'JOGO PAUSADO',
        fontSize: 24,
        color: '#f8fafc',
        fontFamily: "'Press Start 2P', monospace, sans-serif",
        align: 'center',
        baseline: 'top',
        shadow: true
      });

      this.elements.push({
        id: 'btn_pause_resume',
        type: 'Button',
        x: Math.round(cx - 150),
        y: Math.round(cy - 85),
        w: 300,
        h: 48,
        label: '▶️ RETOMAR MISSÃO',
        fontSize: 15,
        color: '#ffffff',
        bgColor: '#16a34a',
        hoverColor: '#22c55e',
        borderColor: '#86efac',
        borderWidth: 2,
        borderRadius: 8,
        onClickAction: 'RESUME_GAME'
      });

      this.elements.push({
        id: 'btn_pause_settings',
        type: 'Button',
        x: Math.round(cx - 150),
        y: Math.round(cy - 25),
        w: 300,
        h: 48,
        label: '⚙️ CONFIGURAÇÕES',
        fontSize: 15,
        color: '#ffffff',
        bgColor: '#1e293b',
        hoverColor: '#334155',
        borderColor: '#64748b',
        borderWidth: 2,
        borderRadius: 8,
        onClickAction: 'OPEN_SETTINGS'
      });

      this.elements.push({
        id: 'btn_pause_restart',
        type: 'Button',
        x: Math.round(cx - 150),
        y: Math.round(cy + 35),
        w: 300,
        h: 48,
        label: '🔄 REINICIAR FASE',
        fontSize: 15,
        color: '#ffffff',
        bgColor: '#d97706',
        hoverColor: '#f59e0b',
        borderColor: '#fcd34d',
        borderWidth: 2,
        borderRadius: 8,
        onClickAction: 'RESTART_STAGE'
      });

      this.elements.push({
        id: 'btn_pause_quit',
        type: 'Button',
        x: Math.round(cx - 150),
        y: Math.round(cy + 95),
        w: 300,
        h: 48,
        label: '🏠 MENU PRINCIPAL',
        fontSize: 15,
        color: '#ffffff',
        bgColor: '#7f1d1d',
        hoverColor: '#991b1b',
        borderColor: '#f87171',
        borderWidth: 2,
        borderRadius: 8,
        onClickAction: 'QUIT_TO_MENU'
      });
    } else {
      this.currentScreenId = 'blank';
      this.currentScreenName = 'Layout em Branco';
    }

    this.deselectItem();
    this.game.ui.showToast(`Preset carregado: ${this.currentScreenName}`);
  }

  /* =========================================================================
   * 14. ESTRUTURA DE SALVAMENTO E EXPORTAÇÃO (.JSON)
   * ========================================================================= */

  compileExportData() {
    const canvas = this.game.canvas;
    const cleanElements = this.elements.map((el, zIdx) => {
      const base = {
        type: el.type,
        id: el.id,
        zIndex: zIdx,
        x: Math.round(el.x),
        y: Math.round(el.y),
        w: Math.round(el.w),
        h: Math.round(el.h)
      };

      if (el.type === 'TextLabel') {
        base.text = el.text || '';
        base.fontSize = el.fontSize || 18;
        base.color = el.color || '#ffffff';
        base.fontFamily = el.fontFamily || "'Press Start 2P', monospace, sans-serif";
        base.align = el.align || 'left';
        base.shadow = Boolean(el.shadow);
      } else if (el.type === 'Button') {
        base.label = el.label || 'Botão';
        base.fontSize = el.fontSize || 16;
        base.color = el.color || '#ffffff';
        base.bgColor = el.bgColor || '#0284c7';
        base.hoverColor = el.hoverColor || '#38bdf8';
        base.borderColor = el.borderColor || '#38bdf8';
        base.borderRadius = el.borderRadius || 8;
        base.onClickAction = el.onClickAction || 'START_GAME';
      } else if (el.type === 'Panel') {
        base.label = el.label || '';
        base.bgColor = el.bgColor || 'rgba(15, 23, 42, 0.94)';
        base.borderColor = el.borderColor || '#38bdf8';
        base.borderWidth = el.borderWidth || 2;
        base.borderRadius = el.borderRadius || 12;
        base.opacity = el.opacity !== undefined ? el.opacity : 0.95;
        if (el.src) base.src = el.src;
      } else if (el.type === 'Image') {
        base.label = el.label || 'Sprite';
        base.src = el.src || '';
        base.opacity = el.opacity !== undefined ? el.opacity : 1.0;
        base.rotation = el.rotation || 0;
      }

      return base;
    });

    const labelsCount = cleanElements.filter((e) => e.type === 'TextLabel').length;
    const buttonsCount = cleanElements.filter((e) => e.type === 'Button').length;
    const panelsCount = cleanElements.filter((e) => e.type === 'Panel').length;
    const imagesCount = cleanElements.filter((e) => e.type === 'Image').length;

    return {
      screenId: this.currentScreenId,
      screenName: this.currentScreenName,
      canvasDimensions: {
        width: canvas.width,
        height: canvas.height
      },
      exportedAt: new Date().toISOString(),
      summary: {
        totalElements: cleanElements.length,
        totalTextLabels: labelsCount,
        totalButtons: buttonsCount,
        totalPanels: panelsCount,
        totalImages: imagesCount
      },
      elements: cleanElements
    };
  }

  exportLayoutJSON() {
    const data = this.compileExportData();
    const jsonStr = JSON.stringify(data, null, 2);
    this.lastExportJson = jsonStr;
    this.lastExportFileName = `${data.screenId || 'ui_layout'}.json`;

    this.triggerFileDownload();

    const modal = this.domContainer.querySelector('#ui-editor-export-modal');
    const textarea = this.domContainer.querySelector('#ui-editor-export-textarea');
    const statLabels = this.domContainer.querySelector('#ui-export-stat-labels');
    const statButtons = this.domContainer.querySelector('#ui-export-stat-buttons');
    const statPanels = this.domContainer.querySelector('#ui-export-stat-panels');
    const statImages = this.domContainer.querySelector('#ui-export-stat-images');

    if (modal && textarea) {
      textarea.value = jsonStr;
      if (statLabels) statLabels.textContent = `🔤 ${data.summary.totalTextLabels} TextLabels`;
      if (statButtons) statButtons.textContent = `🔘 ${data.summary.totalButtons} Buttons`;
      if (statPanels) statPanels.textContent = `📦 ${data.summary.totalPanels} Panels`;
      if (statImages) statImages.textContent = `🖼️ ${data.summary.totalImages} Images`;
      modal.classList.remove('hidden');
    }

    this.game.ui.showToast('💾 Layout de UI exportado com sucesso! Arquivo baixado e código pronto.');
  }

  triggerFileDownload() {
    if (!this.lastExportJson) {
      const data = this.compileExportData();
      this.lastExportJson = JSON.stringify(data, null, 2);
      this.lastExportFileName = `${data.screenId || 'ui_layout'}.json`;
    }

    try {
      const blob = new Blob([this.lastExportJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.lastExportFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro ao baixar arquivo JSON de UI:', err);
    }
  }

  copyExportJSONToClipboard() {
    const textarea = this.domContainer.querySelector('#ui-editor-export-textarea');
    if (!textarea) return;
    textarea.select();
    textarea.setSelectionRange(0, 999999);

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textarea.value).then(() => {
        this.game.ui.showToast('✅ JSON de UI copiado para a Área de Transferência!');
      }).catch(() => {
        document.execCommand('copy');
        this.game.ui.showToast('✅ JSON copiado com sucesso!');
      });
    } else {
      document.execCommand('copy');
      this.game.ui.showToast('✅ JSON copiado com sucesso!');
    }
  }

  /* =========================================================================
   * 15. IMPORTAÇÃO DE LAYOUT (.JSON)
   * ========================================================================= */

  openImportModal() {
    const modal = this.domContainer.querySelector('#ui-editor-import-modal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  applyImportedJSON() {
    const textarea = this.domContainer.querySelector('#ui-editor-import-textarea');
    if (!textarea || !textarea.value.trim()) {
      this.game.ui.showToast('⚠️ Cole o JSON no campo de texto para carregar!', 1800);
      return;
    }

    try {
      const parsed = JSON.parse(textarea.value.trim());
      const elementsList = Array.isArray(parsed) ? parsed : parsed.elements;

      if (!Array.isArray(elementsList)) {
        throw new Error('Formato inválido: a propriedade "elements" precisa ser um array.');
      }

      this.elements = elementsList.map((item, idx) => {
        const node = {
          id: item.id || `node_${idx + 1}`,
          type: item.type || 'Panel',
          x: parseInt(item.x, 10) || 0,
          y: parseInt(item.y, 10) || 0,
          w: Math.max(8, parseInt(item.w, 10) || 120),
          h: Math.max(8, parseInt(item.h, 10) || 40),
          ...item
        };

        if (node.src) {
          const img = new Image();
          img.src = node.src;
          node._img = img;
        }

        return node;
      });

      if (parsed.screenId) this.currentScreenId = parsed.screenId;
      if (parsed.screenName) this.currentScreenName = parsed.screenName;

      this.deselectItem();
      this.domContainer.querySelector('#ui-editor-import-modal').classList.add('hidden');
      this.game.ui.showToast(`✓ Layout importado com sucesso! (${this.elements.length} elementos)`, 2200);
    } catch (err) {
      this.game.ui.showToast(`❌ Erro ao processar JSON: ${err.message}`, 3000);
    }
  }

  _handleJsonFileUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const textarea = this.domContainer.querySelector('#ui-editor-import-textarea');
      if (textarea) textarea.value = ev.target.result;
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  _handleImageUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file || !this.selectedElement) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      const img = new Image();
      img.onload = () => {
        this.selectedElement.src = dataUrl;
        this.selectedElement._img = img;
        if (this.selectedElement.type === 'Image') {
          this.selectedElement.w = img.naturalWidth || 128;
          this.selectedElement.h = img.naturalHeight || 128;
        }
        this._renderPropertiesDock();
        this.game.ui.showToast('🖼️ Imagem carregada no elemento!');
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  /* =========================================================================
   * 16. EVENTOS DE MOUSE NO CANVAS (PICK, DRAG, RESIZE, HOVER, PREVIEW)
   * ========================================================================= */

  _onCanvasMouseDown(e) {
    if (!this.active || e.button !== 0) return;

    const rect = this.game.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Modo de Teste / Preview (Dispara clique nos botões)
    if (this.previewMode) {
      const hit = this._pickElementAt(mouseX, mouseY);
      if (hit && hit.type === 'Button') {
        this.executeGameAction(hit.onClickAction);
      }
      return;
    }

    // 1. Verifica clique em alças de redimensionamento do item selecionado
    if (this.selectedElement) {
      const handle = this._hitTestResizeHandle(this.selectedElement, mouseX, mouseY);
      if (handle) {
        this.preDragSnapshot = this.getLayoutStateSnapshot();
        this.isResizing = true;
        this.resizeHandle = handle;
        this.resizeStartBox = {
          x: this.selectedElement.x,
          y: this.selectedElement.y,
          w: this.selectedElement.w,
          h: this.selectedElement.h
        };
        this.resizeStartMouse = { x: mouseX, y: mouseY };
        return;
      }
    }

    // 2. Seleciona elemento sob o cursor (da frente para trás no Z-Index)
    const hit = this._pickElementAt(mouseX, mouseY);
    if (hit) {
      this.selectItem(hit);
      this.preDragSnapshot = this.getLayoutStateSnapshot();
      this.isDragging = true;
      this.dragOffset = {
        x: mouseX - hit.x,
        y: mouseY - hit.y
      };
    } else {
      this.deselectItem();
    }
  }

  _onCanvasMouseMove(e) {
    if (!this.active) return;

    const rect = this.game.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    this.mouse = { x: mouseX, y: mouseY };
    this.isAltHeld = Boolean(e.altKey || e.shiftKey);

    // Hover em Preview Mode
    if (this.previewMode) {
      const hit = this._pickElementAt(mouseX, mouseY);
      this.elements.forEach((el) => {
        el.isHovered = Boolean(hit && hit === el && el.type === 'Button');
      });
      this.game.canvas.style.cursor = (hit && hit.type === 'Button') ? 'pointer' : 'default';
      return;
    }

    // Arrastar Elemento Selecionado
    if (this.isDragging && this.selectedElement) {
      const rawX = mouseX - this.dragOffset.x;
      const rawY = mouseY - this.dragOffset.y;
      this.selectedElement.x = this.snap(rawX, e.altKey || e.shiftKey);
      this.selectedElement.y = this.snap(rawY, e.altKey || e.shiftKey);

      // Atualiza coordenadas no inspector
      const inpX = this.domContainer.querySelector('#prop-ui-x');
      const inpY = this.domContainer.querySelector('#prop-ui-y');
      if (inpX) inpX.value = Math.round(this.selectedElement.x);
      if (inpY) inpY.value = Math.round(this.selectedElement.y);
      return;
    }

    // Redimensionar Elemento Selecionado
    if (this.isResizing && this.selectedElement && this.resizeHandle) {
      this._applyResize(mouseX, mouseY, e.altKey || e.shiftKey);
      return;
    }

    // Atualiza cursor de acordo com as alças
    if (this.selectedElement) {
      const handle = this._hitTestResizeHandle(this.selectedElement, mouseX, mouseY);
      if (handle) {
        this.game.canvas.style.cursor = this._getResizeCursor(handle);
        return;
      }
    }

    const hovered = this._pickElementAt(mouseX, mouseY);
    this.game.canvas.style.cursor = hovered ? 'move' : 'default';
  }

  _onCanvasMouseUp() {
    // Se estava arrastando ou redimensionando, grava no histórico apenas no mouseup (Sprint 11 - Requisito 2)
    if (this.preDragSnapshot && this.selectedElement) {
      const wasResizing = this.isResizing;
      const wasDragging = this.isDragging;
      if (wasResizing || wasDragging) {
        let original = null;
        if (Array.isArray(this.preDragSnapshot.elements)) {
          original = this.preDragSnapshot.elements.find((el) => el.id === this.selectedElement.id);
        }
        const changed = original && (
          original.x !== this.selectedElement.x ||
          original.y !== this.selectedElement.y ||
          original.w !== this.selectedElement.w ||
          original.h !== this.selectedElement.h
        );
        if (changed && this.history) {
          this.history.commit(this.preDragSnapshot, wasResizing ? 'Redimensionar Elemento UI' : 'Mover Elemento UI');
        }
      }
      this.preDragSnapshot = null;
    }

    this.isDragging = false;
    this.isResizing = false;
    this.resizeHandle = null;
    this._renderPropertiesDock();
  }

  _pickElementAt(x, y) {
    // Itera na ordem inversa (do maior Z-Index para o menor)
    for (let i = this.elements.length - 1; i >= 0; i--) {
      const el = this.elements[i];
      if (this._isPointInsideElement(el, x, y)) {
        return el;
      }
    }
    return null;
  }

  _isPointInsideElement(el, px, py) {
    let boxX = el.x;
    let boxY = el.y;
    let boxW = el.w;
    let boxH = el.h;

    if (el.type === 'TextLabel' && el.align === 'center') {
      boxX = el.x - el.w / 2;
    } else if (el.type === 'TextLabel' && el.align === 'right') {
      boxX = el.x - el.w;
    }

    return px >= boxX && px <= boxX + boxW && py >= boxY && py <= boxY + boxH;
  }

  _hitTestResizeHandle(el, px, py) {
    const handleSize = 10;
    const half = handleSize / 2;

    let bx = el.x;
    if (el.type === 'TextLabel' && el.align === 'center') bx = el.x - el.w / 2;
    else if (el.type === 'TextLabel' && el.align === 'right') bx = el.x - el.w;
    const by = el.y;
    const bw = el.w;
    const bh = el.h;

    const handles = [
      { key: 'nw', x: bx, y: by },
      { key: 'n', x: bx + bw / 2, y: by },
      { key: 'ne', x: bx + bw, y: by },
      { key: 'e', x: bx + bw, y: by + bh / 2 },
      { key: 'se', x: bx + bw, y: by + bh },
      { key: 's', x: bx + bw / 2, y: by + bh },
      { key: 'sw', x: bx, y: by + bh },
      { key: 'w', x: bx, y: by + bh / 2 }
    ];

    for (const h of handles) {
      if (px >= h.x - half && px <= h.x + half && py >= h.y - half && py <= h.y + half) {
        return h.key;
      }
    }
    return null;
  }

  _getResizeCursor(handle) {
    switch (handle) {
      case 'n': case 's': return 'ns-resize';
      case 'e': case 'w': return 'ew-resize';
      case 'nw': case 'se': return 'nwse-resize';
      case 'ne': case 'sw': return 'nesw-resize';
      default: return 'default';
    }
  }

  _applyResize(mouseX, mouseY, isAlt) {
    const el = this.selectedElement;
    const sBox = this.resizeStartBox;
    const sMouse = this.resizeStartMouse;
    const dx = mouseX - sMouse.x;
    const dy = mouseY - sMouse.y;

    let nextX = sBox.x;
    let nextY = sBox.y;
    let nextW = sBox.w;
    let nextH = sBox.h;

    if (this.resizeHandle.includes('e')) nextW = Math.max(16, sBox.w + dx);
    if (this.resizeHandle.includes('s')) nextH = Math.max(16, sBox.h + dy);

    if (this.resizeHandle.includes('w')) {
      const candidateW = Math.max(16, sBox.w - dx);
      nextX = sBox.x + (sBox.w - candidateW);
      nextW = candidateW;
    }

    if (this.resizeHandle.includes('n')) {
      const candidateH = Math.max(16, sBox.h - dy);
      nextY = sBox.y + (sBox.h - candidateH);
      nextH = candidateH;
    }

    el.x = this.snap(nextX, isAlt);
    el.y = this.snap(nextY, isAlt);
    el.w = Math.max(16, this.snap(nextW, isAlt));
    el.h = Math.max(16, this.snap(nextH, isAlt));

    const inpW = this.domContainer.querySelector('#prop-ui-w');
    const inpH = this.domContainer.querySelector('#prop-ui-h');
    if (inpW) inpW.value = Math.round(el.w);
    if (inpH) inpH.value = Math.round(el.h);
  }

  /* =========================================================================
   * 17. ATUALIZAÇÃO E RENDERIZAÇÃO NO CANVAS (LOOP PRINCIPAL)
   * ========================================================================= */

  update() {
    // Atualização contínua de hover/animações
  }

  renderCanvas(ctx) {
    if (!this.active) return;

    const canvas = this.game.canvas;
    const width = canvas.width;
    const height = canvas.height;

    ctx.save();

    // 1. Fundo suave e Grade do Editor de UI (se não estiver em modo preview)
    if (!this.previewMode) {
      // Backdrop escurecido sutil para destacar a interface
      ctx.fillStyle = 'rgba(6, 11, 20, 0.75)';
      ctx.fillRect(0, 0, width, height);

      // Grade de Alinhamento
      this._drawUIGrid(ctx, width, height);
    }

    // 2. Renderiza todos os nós de UI em ordem numérica de Z-Index
    this.elements.forEach((el, zIndex) => {
      this._renderUINode(ctx, el, zIndex);
    });

    // 3. Visualização de Hitbox (Debug - Tecla C)
    if (this.debugHitboxes) {
      this._renderHitboxDebugLayer(ctx);
    }

    // 4. Destaque de Seleção e Alças de Redimensionamento (se não estiver em preview)
    if (!this.previewMode && this.selectedElement) {
      this._renderSelectionOutline(ctx, this.selectedElement);
    }

    ctx.restore();
  }

  _drawUIGrid(ctx, width, height) {
    const step = this.snapEnabled && this.snapGrid > 0 ? this.snapGrid : 16;
    ctx.save();
    ctx.strokeStyle = this.isAltHeld ? 'rgba(250, 204, 21, 0.12)' : 'rgba(56, 189, 248, 0.07)';
    ctx.lineWidth = 1;

    ctx.beginPath();
    for (let x = 0; x <= width; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Linhas centrais de alinhamento
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    ctx.restore();
  }

  _renderUINode(ctx, el) {
    ctx.save();

    // ==========================================
    // 1. TextLabel: Apenas texto puro
    // ==========================================
    if (el.type === 'TextLabel') {
      ctx.font = `${el.fontSize || 18}px ${el.fontFamily || "'Press Start 2P', monospace, sans-serif"}`;
      ctx.textAlign = el.align || 'left';
      ctx.textBaseline = el.baseline || 'top';

      if (el.shadow) {
        ctx.fillStyle = el.shadowColor || 'rgba(0, 0, 0, 0.75)';
        ctx.fillText(el.text || '', el.x + 2, el.y + 2);
      }

      ctx.fillStyle = el.color || '#ffffff';
      ctx.fillText(el.text || '', el.x, el.y);
    }

    // ==========================================
    // 2. Button: Retângulo interativo
    // ==========================================
    else if (el.type === 'Button') {
      const isHovered = Boolean(el.isHovered);
      const bg = isHovered ? (el.hoverColor || '#38bdf8') : (el.bgColor || '#0284c7');
      const r = el.borderRadius !== undefined ? el.borderRadius : 8;

      // Fundo do Botão com cantos arredondados
      ctx.fillStyle = bg;
      this._roundRect(ctx, el.x, el.y, el.w, el.h, r, true, false);

      // Borda
      ctx.strokeStyle = isHovered ? '#ffffff' : (el.borderColor || '#38bdf8');
      ctx.lineWidth = el.borderWidth || 2;
      this._roundRect(ctx, el.x, el.y, el.w, el.h, r, false, true);

      // Texto centralizado
      ctx.font = `bold ${el.fontSize || 16}px ${el.fontFamily || "'Press Start 2P', monospace, sans-serif"}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Sombra do texto
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillText(el.label || 'Botão', el.x + el.w / 2 + 1.5, el.y + el.h / 2 + 1.5);

      ctx.fillStyle = el.color || '#ffffff';
      ctx.fillText(el.label || 'Botão', el.x + el.w / 2, el.y + el.h / 2);

      // Pequeno indicador de Ação no modo de edição
      if (!this.previewMode && el.onClickAction) {
        ctx.fillStyle = 'rgba(250, 204, 21, 0.9)';
        ctx.font = 'bold 8px Consolas, monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`⚡ ${el.onClickAction}`, el.x + el.w - 6, el.y + el.h - 6);
      }
    }

    // ==========================================
    // 3. Panel: Janela ou fundo sólido/imagem
    // ==========================================
    else if (el.type === 'Panel') {
      const r = el.borderRadius !== undefined ? el.borderRadius : 12;

      ctx.globalAlpha = el.opacity !== undefined ? el.opacity : 0.95;
      ctx.fillStyle = el.bgColor || 'rgba(15, 23, 42, 0.94)';
      this._roundRect(ctx, el.x, el.y, el.w, el.h, r, true, false);

      // Imagem opcional de fundo
      if (el._img && el._img.complete && el._img.naturalWidth > 0) {
        ctx.drawImage(el._img, el.x, el.y, el.w, el.h);
      }

      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = el.borderColor || '#38bdf8';
      ctx.lineWidth = el.borderWidth || 2.5;
      this._roundRect(ctx, el.x, el.y, el.w, el.h, r, false, true);

      // Faixa de cabeçalho estilizada (opcional)
      if (el.label) {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
        this._roundRect(ctx, el.x, el.y, el.w, 28, { tl: r, tr: r, br: 0, bl: 0 }, true, false);

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(el.x, el.y + 28);
        ctx.lineTo(el.x + el.w, el.y + 28);
        ctx.stroke();

        ctx.font = "bold 10px 'Press Start 2P', monospace, sans-serif";
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`📦 ${el.label}`, el.x + 12, el.y + 14);
      }
    }

    // ==========================================
    // 4. Image: Sprites estáticos de UI
    // ==========================================
    else if (el.type === 'Image') {
      ctx.globalAlpha = el.opacity !== undefined ? el.opacity : 1.0;

      if (el._img && el._img.complete && el._img.naturalWidth > 0) {
        const cx = el.x + el.w / 2;
        const cy = el.y + el.h / 2;
        const rad = ((el.rotation || 0) * Math.PI) / 180;

        ctx.translate(cx, cy);
        if (rad !== 0) ctx.rotate(rad);
        ctx.drawImage(el._img, -el.w / 2, -el.h / 2, el.w, el.h);
      } else {
        // Placeholder estilizado
        ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
        ctx.fillRect(el.x, el.y, el.w, el.h);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(el.x, el.y, el.w, el.h);

        ctx.font = 'bold 10px Consolas, monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`🖼️ ${el.label || 'Sprite'}`, el.x + el.w / 2, el.y + el.h / 2);
      }
    }

    ctx.restore();
  }

  /* =========================================================================
   * 18. VISUALIZAÇÃO DE HITBOXES (DEBUG - TECLA C)
   * ========================================================================= */

  _renderHitboxDebugLayer(ctx) {
    ctx.save();

    this.elements.forEach((el, zIdx) => {
      // Destaque em vermelho das Hitboxes de elementos interativos e botões (Requisito 3)
      const isInteractive = el.type === 'Button' || Boolean(el.onClickAction);

      let bx = el.x;
      if (el.type === 'TextLabel' && el.align === 'center') bx = el.x - el.w / 2;
      else if (el.type === 'TextLabel' && el.align === 'right') bx = el.x - el.w;
      const by = el.y;
      const bw = el.w;
      const bh = el.h;

      ctx.save();

      // Borda vermelha forte
      ctx.strokeStyle = isInteractive ? '#ef4444' : 'rgba(239, 68, 68, 0.45)';
      ctx.lineWidth = isInteractive ? 2.5 : 1.5;
      ctx.setLineDash(isInteractive ? [4, 3] : [2, 2]);
      ctx.strokeRect(bx, by, bw, bh);

      // Preenchimento vermelho translúcido
      ctx.fillStyle = isInteractive ? 'rgba(239, 68, 68, 0.22)' : 'rgba(239, 68, 68, 0.08)';
      ctx.fillRect(bx, by, bw, bh);

      // Etiqueta de Debug de Hitbox
      ctx.setLineDash([]);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 9px Consolas, monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';

      const tagText = isInteractive
        ? `🚨 HITBOX [${Math.round(bw)}x${Math.round(bh)}px | Ação: ${el.onClickAction || 'N/A'}]`
        : `HITBOX [${Math.round(bw)}x${Math.round(bh)}px Z:${zIdx + 1}]`;

      // Fundo do texto da tag
      const textMetrics = ctx.measureText(tagText);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.fillRect(bx, by - 14, textMetrics.width + 8, 14);

      ctx.fillStyle = '#f87171';
      ctx.fillText(tagText, bx + 4, by - 2);

      ctx.restore();
    });

    ctx.restore();
  }

  /* =========================================================================
   * 19. DESTAQUE DO ITEM SELECIONADO E ALÇAS DE REDIMENSIONAMENTO
   * ========================================================================= */

  _renderSelectionOutline(ctx, el) {
    ctx.save();

    let bx = el.x;
    if (el.type === 'TextLabel' && el.align === 'center') bx = el.x - el.w / 2;
    else if (el.type === 'TextLabel' && el.align === 'right') bx = el.x - el.w;
    const by = el.y;
    const bw = el.w;
    const bh = el.h;

    // Retângulo delimitador selecionado
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.strokeRect(bx - 3, by - 3, bw + 6, bh + 6);
    ctx.setLineDash([]);

    // Alças de Redimensionamento (8 pontos)
    const handleSize = 9;
    const half = handleSize / 2;
    const points = [
      { x: bx, y: by },
      { x: bx + bw / 2, y: by },
      { x: bx + bw, y: by },
      { x: bx + bw, y: by + bh / 2 },
      { x: bx + bw, y: by + bh },
      { x: bx + bw / 2, y: by + bh },
      { x: bx, y: by + bh },
      { x: bx, y: by + bh / 2 }
    ];

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;

    for (const p of points) {
      ctx.fillRect(p.x - half, p.y - half, handleSize, handleSize);
      ctx.strokeRect(p.x - half, p.y - half, handleSize, handleSize);
    }

    // Badge com coordenadas e dimensões
    const infoText = `[X:${Math.round(el.x)} Y:${Math.round(el.y)} | ${Math.round(bw)}x${Math.round(bh)}px | Z:${this.elements.indexOf(el) + 1}]`;
    ctx.font = 'bold 10px Consolas, monospace';
    const textWidth = ctx.measureText(infoText).width;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(bx, by + bh + 8, textWidth + 12, 18);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1;
    ctx.strokeRect(bx, by + bh + 8, textWidth + 12, 18);

    ctx.fillStyle = '#facc15';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(infoText, bx + 6, by + bh + 17);

    ctx.restore();
  }

  /**
   * Helper para desenhar retângulos com cantos arredondados
   */
  _roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof radius === 'number') {
      radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
      radius = {
        tl: radius.tl || 0,
        tr: radius.tr || 0,
        br: radius.br || 0,
        bl: radius.bl || 0
      };
    }

    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();

    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }
};
