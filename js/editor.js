/**
 * js/editor.js
 * Editor de Mapas In-Game Avançado ("ScienceEco Girls" - Sprint 7):
 * - 1. Sistema de Camadas (Layers):
 *      • Camada 0: Chão
 *      • Camada 1: Tapetes/Decalques
 *      • Camada 2: Objetos/Colisão
 *      • Camada 3: Teto/Overlay (renderizado sobre os personagens)
 *      • Navegação rápida pelas teclas numéricas '1', '2', '3', '4'
 *      • Indicador na tela (HUD): "Camada Atual: Camada [0-3]: [Nome]"
 * - 2. Ordenação de Z-Index:
 *      • Teclas '[' / PageDown: Move para trás na respectiva camada
 *      • Teclas ']' / PageUp: Move para a frente na respectiva camada
 * - 3. Sistema de Rotação de Sprites:
 *      • Propriedade 'rotation' (0, 90, 180, 270 graus)
 *      • Renderização centralizada: translate(cx, cy) -> rotate(rad) -> drawImage(-w/2, -h/2)
 *      • Tecla 'R' rotaciona em incrementos de 90°
 * - 4. Ajuste Fino Preciso pelo Mouse (Pixel Perfect vs Grid):
 *      • Snap to Grid padrão (16px / 32px / 64px)
 *      • Ajuste Fino: Segurar 'ALT' (ou 'Shift') suspende temporariamente o snap (1 em 1 pixel livre)
 * - 5. Exportação Estruturada (.JSON):
 *      • Exporta array de camadas, colisões, lixos e imagens com posições, escalas, rotações e z-index
 */

window.MapEditor = class MapEditor {
  constructor(game) {
    this.game = game;
    this.active = false;

    // Definição das 4 Camadas Oficiais do Sistema
    this.LAYER_DEFS = [
      { id: 0, name: 'Chão', keyNumber: '1', color: '#38bdf8', icon: '🌾', desc: 'Terrenos base, grama, asfalto, terra, pisos' },
      { id: 1, name: 'Tapetes/Decalques', keyNumber: '2', color: '#a3e635', icon: '🧶', desc: 'Tapetes, decalques, caminhos de pedra, marcas no solo' },
      { id: 2, name: 'Objetos/Colisão', keyNumber: '3', color: '#facc15', icon: '🧱', desc: 'Paredes, obstáculos sólidos, móveis, lixos, veículos' },
      { id: 3, name: 'Teto/Overlay', keyNumber: '4', color: '#c084fc', icon: '🏠', desc: 'Telhados, copas de árvores, passarelas suspensas, overlays' }
    ];

    // Camada Ativa no Momento (0: Chão, 1: Tapetes, 2: Objetos, 3: Teto)
    this.activeLayerIndex = 2; // Inicia em Objetos/Colisão

    // Modos de Ferramenta: 'collisions' | 'trash' | 'enemies' | 'sprites'
    this.toolMode = 'collisions';

    // Banco de Dados / Variedade de Inimigos Registrados (Sprint 9)
    this.ENEMY_TYPES = [
      { id: 'scratcher', label: 'Rato Arranhador', icon: '🐀', color: '#ef4444', desc: 'Corpo a corpo veloz com garras afiadas' },
      { id: 'cheese_thrower', label: 'Rato Atirador', icon: '🧀', color: '#f59e0b', desc: 'Arremesso de projéteis de queijo à distância' },
      { id: 'spitter', label: 'Rato Cuspidor', icon: '☣️', color: '#10b981', desc: 'Projéteis ácidos e venenosos telegrafados' },
      { id: 'drone_defeituoso', label: 'Drone Defeituoso', icon: '🤖', color: '#06b6d4', desc: 'Patrulha aérea instável e descargas elétricas' },
      { id: 'animal_mutante', label: 'Animal Mutante', icon: '🐺', color: '#a855f7', desc: 'Besta mutante em investida predatória agressiva' },
      { id: 'boss_alpha', label: 'Rei Rato Radioativo (Boss)', icon: '👑', color: '#ec4899', desc: 'Chefão Supremo de Combate Final (Fase 3)' }
    ];
    this.currentEnemyType = 'scratcher';

    // Câmera do Editor
    this.camFocusX = 1024;
    this.camFocusY = 1024;
    this.zoom = 1.0;
    this.minZoom = 0.25;
    this.maxZoom = 3.0;

    // Snap à Grade (Toggle & Tamanho)
    this.snapEnabled = true;
    this.snapGrid = 16;
    this.isAltHeld = false;

    // Itens Selecionados
    this.selectedItem = null;
    this.selectedType = null; // 'obstacle' | 'trash' | 'sprite'

    // Estados de Interação com o Mouse
    this.isPanning = false;
    this.panStartMouse = { x: 0, y: 0 };
    this.panStartCam = { x: 0, y: 0 };

    this.isDraggingItem = false;
    this.dragItemOffset = { x: 0, y: 0 };

    this.isResizing = false;
    this.resizeHandle = null; // 'nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'
    this.resizeStartBox = { x: 0, y: 0, w: 0, h: 0 };
    this.resizeStartMouseWorld = { x: 0, y: 0 };

    this.isDrawingNewObstacle = false;
    this.drawStartWorld = { x: 0, y: 0 };
    this.drawCurrentWorld = { x: 0, y: 0 };

    // Paleta de Lixos
    this.currentTrashTypeIndex = 0;

    // Posição do Mouse
    this.mouseScreen = { x: 0, y: 0 };
    this.mouseWorld = { x: 0, y: 0 };

    // Sistema de Histórico e Desfazer (Ctrl + Z) - Sprint 11
    const HistoryCls = window.HistoryManager || (typeof HistoryManager !== 'undefined' ? HistoryManager : null);
    this.history = HistoryCls ? new HistoryCls({
      name: 'MapEditor',
      maxSteps: 40,
      getState: () => this.getMapStateSnapshot(),
      onRestore: (snapshot, actionName) => this.applyHistoryState(snapshot, actionName)
    }) : null;
    this.preDragSnapshot = null;

    // Ferramenta de Colisão Poligonal & Edição de Vértices (Sprint 14)
    this.polygonPoints = [];
    this.isDrawingPolygon = false;
    this.polygonCurrentWorld = { x: 0, y: 0 };
    this.showCollisions = true; // Toggle com a tecla 'C'
    this.isCtrlHeld = false;
    this.hoveredPolygon = null;
    this.hoveredVertexIndex = -1;
    this.isDraggingVertex = false;
    this.vertexDragPolygon = null;
    this.vertexDragIndex = -1;
    this.contextMenuItem = null;
    this.contextMenuWorldPos = null;
    this.suppressContextMenu = false;

    // Modais e Gestão de Cenas (Sprint 13)
    this.targetTriggerItem = null;
    this.targetAnimationPos = null;
    this.targetAnimationItem = null;

    // Elementos DOM
    this.domContainer = null;
    this._initDOM();
    this._bindEvents();
  }

  /**
   * Captura uma cópia profunda serializável de todo o estado atual do mapa (Sprint 11 - Requisito 1)
   */
  getMapStateSnapshot() {
    const map = this.game.currentMap;
    if (!map) return null;
    this.ensureMapLayers(map);

    if (map.scenes && map.scenes[map.currentScene]) {
      map.scenes[map.currentScene].layers = map.layers;
    }

    const cloneLayers = (layers) =>
      (layers || []).map((layer) => ({
        id: layer.id,
        name: layer.name,
        visible: layer.visible !== false,
        items: layer.items.map((item) => {
          const copy = { ...item };
          if (copy.polygon && Array.isArray(copy.polygon)) {
            copy.polygon = copy.polygon.map((p) => ({ ...p }));
          }
          delete copy._img;
          return copy;
        })
      }));

    return {
      mapId: map.id,
      activeLayerIndex: this.activeLayerIndex,
      selectedItemId: this.selectedItem ? (this.selectedItem.id || null) : null,
      selectedType: this.selectedType,
      currentScene: map.currentScene || 0,
      scenes: (map.scenes || []).map((sc) => ({
        id: sc.id,
        name: sc.name,
        condition: sc.condition || '',
        layers: cloneLayers(sc.layers)
      })),
      layers: cloneLayers(map.layers)
    };
  }

  /**
   * Restaura o estado anterior do mapa a partir de um snapshot do histórico (Sprint 11 - Requisito 4)
   */
  applyHistoryState(snapshot, actionName = '') {
    const map = this.game.currentMap;
    if (!map || !snapshot) return;

    const restoreLayers = (layers) =>
      (layers || []).map((layer) => ({
        id: layer.id,
        name: layer.name,
        visible: layer.visible !== false,
        items: layer.items.map((item) => {
          const restored = { ...item };
          if (restored.polygon && Array.isArray(restored.polygon)) {
            restored.polygon = restored.polygon.map((p) => ({ ...p }));
          }
          if (restored.type === 'sprite' || restored.src) {
            const img = new Image();
            img.src = restored.src;
            restored._img = img;
          }
          return restored;
        })
      }));

    // 1. Restaura cenas se presentes no snapshot (Sprint 13)
    if (Array.isArray(snapshot.scenes) && snapshot.scenes.length > 0) {
      map.scenes = snapshot.scenes.map((sc) => ({
        id: sc.id,
        name: sc.name,
        condition: sc.condition || '',
        layers: restoreLayers(sc.layers)
      }));
      map.currentScene = typeof snapshot.currentScene === 'number' ? snapshot.currentScene : 0;
      if (map.currentScene >= map.scenes.length) map.currentScene = 0;
      map.layers = map.scenes[map.currentScene].layers;
    } else if (Array.isArray(snapshot.layers)) {
      map.layers = restoreLayers(snapshot.layers);
    }

    // 2. Sincroniza referências com o jogo (colisões, lixos e inimigos)
    this.syncLayerReferences(map);
    this.syncTrashWithGame();

    // 3. Atualiza controles de UI de cena
    this._updateSceneUI();

    // 4. Restaura camada ativa
    if (snapshot.activeLayerIndex !== undefined) {
      this.setActiveLayer(snapshot.activeLayerIndex);
    }

    // 5. Restaura seleção do item se ele ainda existir
    if (snapshot.selectedItemId) {
      let found = null;
      for (const layer of map.layers) {
        found = layer.items.find((it) => it.id === snapshot.selectedItemId);
        if (found) break;
      }
      if (found) {
        this.selectItem(found, found.type || snapshot.selectedType);
      } else {
        this.deselectItem();
      }
    } else {
      this.deselectItem();
    }

    this._renderPropertiesDock();
    this.game.ui.showToast(`↩️ Desfeito no Mapa: ${actionName || 'Ação anterior'} [Ctrl+Z]`, 1800);
  }

  /**
   * Desfaz a ação mais recente no mapa (Sprint 11 - Requisito 4)
   */
  desfazer() {
    if (!this.history || !this.history.canUndo()) {
      this.game.ui.showToast('ℹ️ Nenhuma ação anterior para desfazer no mapa.');
      return false;
    }
    const restored = this.history.undo();
    if (restored) {
      this.forceRender();
    }
    return restored;
  }

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
        this.renderCanvas(ctx);
      }
    }
  }

  /**
   * Retorna os dados cadastrais do tipo de inimigo
   */
  getEnemyTypeDef(typeId) {
    if (!typeId) return this.ENEMY_TYPES[0];
    const found = this.ENEMY_TYPES.find((t) => t.id === typeId);
    if (found) return found;
    return {
      id: typeId,
      label: typeId.replace(/_/g, ' ').toUpperCase(),
      icon: '👾',
      color: '#ef4444',
      desc: 'Inimigo personalizado'
    };
  }

  /* =========================================================================
   * 1. SISTEMA DE CAMADAS (DATA STRUCTURE & INITIALIZATION)
   * ========================================================================= */

  /**
   * Garante que o mapa possua as 4 camadas estruturadas (Camada 0 a 3).
   * Mantém retrocompatibilidade total com obstáculos, lixos, inimigos e imagens.
   */
  ensureMapLayers(map) {
    if (!map) return;

    if (!Array.isArray(map.layers) || map.layers.length !== 4) {
      const layer0 = { id: 0, name: 'Chão', visible: true, items: [] };
      const layer1 = { id: 1, name: 'Tapetes/Decalques', visible: true, items: [] };
      const layer2 = { id: 2, name: 'Objetos/Colisão', visible: true, items: [] };
      const layer3 = { id: 3, name: 'Teto/Overlay', visible: true, items: [] };

      // 1. Migra obstáculos para Camada 2 (Objetos/Colisão)
      if (Array.isArray(map.obstacles)) {
        map.obstacles.forEach((obs) => {
          obs.type = 'obstacle';
          obs.layer = 2;
          obs.rotation = obs.rotation || 0;
          layer2.items.push(obs);
        });
      }

      // 2. Migra lixos para Camada 2 (Objetos/Colisão)
      if (Array.isArray(map.trashSpawns)) {
        map.trashSpawns.forEach((t) => {
          t.type = 'trash';
          t.layer = 2;
          t.rotation = t.rotation || 0;
          layer2.items.push(t);
        });
      }

      // 3. Migra sprites visuais para suas respectivas camadas
      if (Array.isArray(map.visualSprites)) {
        map.visualSprites.forEach((s) => {
          s.type = 'sprite';
          s.rotation = s.rotation || 0;
          const target = s.layer !== undefined ? s.layer : 1;
          s.layer = target;
          if (target === 0) layer0.items.push(s);
          else if (target === 1) layer1.items.push(s);
          else if (target === 3) layer3.items.push(s);
          else layer2.items.push(s);
        });
      }

      // 4. Migra estruturas elevadas para Camada 3 (Teto/Overlay)
      if (Array.isArray(map.elevatedStructures)) {
        map.elevatedStructures.forEach((st) => {
          st.type = 'elevated';
          st.layer = 3;
          st.rotation = st.rotation || 0;
          layer3.items.push(st);
        });
      }

      // 5. Migra spawners de inimigos para Camada 2 (Objetos/Entidades - Sprint 9)
      const initialEnemies = Array.isArray(map.enemies)
        ? map.enemies
        : Array.isArray(map.enemySpawns)
          ? map.enemySpawns
          : [];
      initialEnemies.forEach((e) => {
        const typeId = e.enemyType || e.type || 'scratcher';
        const typeDef = this.getEnemyTypeDef(typeId);
        layer2.items.push({
          type: 'enemy',
          layer: 2,
          id: e.id || `enemy_${typeId}_${Math.random().toString(36).slice(-4)}`,
          enemyType: typeId,
          label: e.label || typeDef.label,
          x: e.x,
          y: e.y,
          radius: 26,
          rotation: e.rotation || 0
        });
      });

      map.layers = [layer0, layer1, layer2, layer3];
    }

    // Se as camadas já existirem, sincroniza quaisquer inimigos declarados no mapa que ainda não estejam na Camada 2
    const currentEnemies = Array.isArray(map.enemies)
      ? map.enemies
      : Array.isArray(map.enemySpawns)
        ? map.enemySpawns
        : [];
    const layer2 = map.layers && map.layers[2];
    if (layer2 && Array.isArray(layer2.items) && currentEnemies.length > 0) {
      currentEnemies.forEach((e) => {
        const alreadyInLayer = layer2.items.some(
          (it) => it.type === 'enemy' && (it.id === e.id || (Math.hypot(it.x - e.x, it.y - e.y) < 10 && it.enemyType === (e.enemyType || e.type)))
        );
        if (!alreadyInLayer) {
          const typeId = e.enemyType || e.type || 'scratcher';
          const typeDef = this.getEnemyTypeDef(typeId);
          layer2.items.push({
            type: 'enemy',
            layer: 2,
            id: e.id || `enemy_${typeId}_${Math.random().toString(36).slice(-4)}`,
            enemyType: typeId,
            label: e.label || typeDef.label,
            x: e.x,
            y: e.y,
            radius: 26,
            rotation: e.rotation || 0
          });
        }
      });
    }

    this.syncLayerReferences(map);

    // 6. Estrutura de Múltiplas Cenas / Estados (Sprint 13 - Requisito 3)
    if (!Array.isArray(map.scenes) || map.scenes.length === 0) {
      map.scenes = [
        {
          id: 1,
          name: 'Cena 1 (Padrão)',
          condition: 'Início padrão do mapa',
          layers: map.layers
        }
      ];
      map.currentScene = 0;
    } else {
      if (typeof map.currentScene !== 'number' || map.currentScene < 0 || map.currentScene >= map.scenes.length) {
        map.currentScene = 0;
      }
      if (map.layers !== map.scenes[map.currentScene].layers) {
        map.layers = map.scenes[map.currentScene].layers;
      }
    }
  }

  /**
   * Alterna a cena ativa do mapa com preservação e isolamento de dados (Sprint 13 - Requisito 3)
   */
  switchScene(sceneIndex) {
    const map = this.game.currentMap;
    if (!map || !Array.isArray(map.scenes)) return;
    if (sceneIndex < 0 || sceneIndex >= map.scenes.length) return;
    if (sceneIndex === map.currentScene && map.layers === map.scenes[sceneIndex].layers) return;

    if (this.history) this.history.commit(null, `Alternar para ${map.scenes[sceneIndex].name}`);

    this.deselectItem();

    // Sincroniza estado das camadas atuais na cena atual
    map.scenes[map.currentScene].layers = map.layers;

    // Muda ponteiro para a nova cena
    map.currentScene = sceneIndex;
    map.layers = map.scenes[sceneIndex].layers;

    this.syncLayerReferences(map);
    this.syncTrashWithGame();
    this._updateSceneUI();
    this._updateLayerHUDDisplay();
    this._updateContextBar();
    this._renderPropertiesDock();
    this.forceRender();
    this.game.ui.showToast(`🎬 Cena Ativa: ${map.scenes[sceneIndex].name}`, 2000);
  }

  /**
   * Adiciona uma nova cena clonando os dados visuais da cena atual (Sprint 13 - Requisito 3)
   */
  addScene(name, condition) {
    const map = this.game.currentMap;
    if (!map) return;
    this.ensureMapLayers(map);

    if (this.history) this.history.commit(null, 'Adicionar Nova Cena');

    const nextId = map.scenes.length + 1;
    const sceneName = (name && name.trim()) || `Cena ${nextId}`;
    const sceneCondition = (condition && condition.trim()) || '';

    // Clonagem profunda das camadas da cena ativa para garantir isolamento total
    const currentSceneLayers = map.scenes[map.currentScene].layers;
    const clonedLayers = currentSceneLayers.map((layer) => ({
      id: layer.id,
      name: layer.name,
      visible: layer.visible !== false,
      items: layer.items.map((item) => {
        const copy = { ...item };
        if (copy.polygon && Array.isArray(copy.polygon)) {
          copy.polygon = copy.polygon.map((p) => ({ ...p }));
        }
        if (copy.type === 'sprite' || copy.src) {
          const img = new Image();
          img.src = copy.src;
          copy._img = img;
        }
        return copy;
      })
    }));

    const newScene = {
      id: nextId,
      name: sceneName,
      condition: sceneCondition,
      layers: clonedLayers
    };

    map.scenes.push(newScene);
    this.switchScene(map.scenes.length - 1);
    this.game.ui.showToast(`✨ ${sceneName} criada com sucesso!`, 2500);
  }

  _updateSceneUI() {
    const map = this.game.currentMap;
    if (!map || !Array.isArray(map.scenes) || !this.domContainer) return;
    const select = this.domContainer.querySelector('#editor-scene-dropdown');
    if (!select) return;

    select.innerHTML = map.scenes
      .map(
        (sc, idx) =>
          `<option value="${idx}" ${idx === map.currentScene ? 'selected' : ''}>${sc.name}${sc.condition ? ` (${sc.condition})` : ''}</option>`
      )
      .join('');
  }

  /* =========================================================================
   * MODAIS DE DESIGN E IA (SPRINT 13 - REQUISITO 2 & 3)
   * ========================================================================= */

  _openTriggerModal(targetItem) {
    const modal = this.domContainer.querySelector('#editor-trigger-modal');
    if (!modal) return;
    this.targetTriggerItem = targetItem;
    const inputInst = modal.querySelector('#trigger-instruction-input');
    const inputLabel = modal.querySelector('#trigger-label-input');
    if (inputInst) inputInst.value = (targetItem && targetItem.ai_instruction) || '';
    if (inputLabel) inputLabel.value = (targetItem && targetItem.label) || 'TRIGGER';
    modal.classList.remove('hidden');
    if (inputInst) {
      setTimeout(() => inputInst.focus(), 60);
    }
  }

  _closeTriggerModal() {
    const modal = this.domContainer.querySelector('#editor-trigger-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    this.targetTriggerItem = null;
  }

  _saveTriggerModal() {
    const modal = this.domContainer.querySelector('#editor-trigger-modal');
    if (!modal || !this.targetTriggerItem) return;
    const inputInst = modal.querySelector('#trigger-instruction-input');
    const inputLabel = modal.querySelector('#trigger-label-input');
    const text = inputInst ? inputInst.value.trim() : '';
    const label = inputLabel ? inputLabel.value.trim() : 'TRIGGER';

    if (this.history) this.history.commit(null, 'Configurar Instrução de Trigger');
    this.targetTriggerItem.ai_instruction = text;
    this.targetTriggerItem.label = label || 'TRIGGER';
    this.targetTriggerItem.isTrigger = true;
    this.targetTriggerItem.collisionType = 'trigger';
    this.targetTriggerItem.isOverhead = false;

    if (this.game.currentMap) this.syncLayerReferences(this.game.currentMap);
    this._renderPropertiesDock();
    this.forceRender();
    this._closeTriggerModal();
    this.game.ui.showToast('⚡ Trigger configurado com instrução para IA!');
  }

  _openAnimationModal(wPos, targetItem = null) {
    const modal = this.domContainer.querySelector('#editor-animation-modal');
    if (!modal) return;
    this.targetAnimationPos = wPos || { x: this.camFocusX, y: this.camFocusY };
    this.targetAnimationItem = targetItem;
    const inputInst = modal.querySelector('#anim-instruction-input');
    const inputLabel = modal.querySelector('#anim-label-input');
    if (inputInst) inputInst.value = (targetItem && targetItem.ai_instruction) || '';
    if (inputLabel) inputLabel.value = (targetItem && targetItem.label) || `ANIM_${Math.floor(Math.random() * 900 + 100)}`;
    modal.classList.remove('hidden');
    if (inputInst) {
      setTimeout(() => inputInst.focus(), 60);
    }
  }

  _closeAnimationModal() {
    const modal = this.domContainer.querySelector('#editor-animation-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    this.targetAnimationPos = null;
    this.targetAnimationItem = null;
  }

  _saveAnimationModal() {
    const modal = this.domContainer.querySelector('#editor-animation-modal');
    if (!modal) return;
    const inputInst = modal.querySelector('#anim-instruction-input');
    const inputLabel = modal.querySelector('#anim-label-input');
    const promptText = inputInst ? inputInst.value.trim() : '';
    const labelText = (inputLabel && inputLabel.value.trim()) || 'ANIMAÇÃO';

    if (this.targetAnimationItem) {
      if (this.history) this.history.commit(null, 'Editar Marcador de Animação');
      this.targetAnimationItem.ai_instruction = promptText;
      this.targetAnimationItem.label = labelText;
      this.targetAnimationItem.isAnimationMarker = true;
      this.targetAnimationItem.type = 'animation_marker';
    } else {
      const map = this.game.currentMap;
      if (!map) return;
      this.ensureMapLayers(map);
      if (this.history) this.history.commit(null, 'Criar Marcador de Animação');
      const wPos = this.targetAnimationPos || { x: this.camFocusX, y: this.camFocusY };
      const newMarker = {
        id: `anim_${Date.now().toString(36).slice(-4)}`,
        type: 'animation_marker',
        isAnimationMarker: true,
        x: Math.round(wPos.x),
        y: Math.round(wPos.y),
        label: labelText,
        ai_instruction: promptText,
        layer: this.activeLayerIndex
      };
      const activeLayer = map.layers[this.activeLayerIndex] || map.layers[2];
      activeLayer.items.push(newMarker);
      this.selectItem(newMarker, 'animation_marker');
    }

    if (this.game.currentMap) this.syncLayerReferences(this.game.currentMap);
    this._renderPropertiesDock();
    this.forceRender();
    this._closeAnimationModal();
    this.game.ui.showToast('🎬 Marcador de Animação salvo com metadata para IA!');
  }

  _openSceneModal() {
    const modal = this.domContainer.querySelector('#editor-scene-modal');
    if (!modal) return;
    const map = this.game.currentMap;
    const nextIdx = (map && map.scenes ? map.scenes.length : 1) + 1;
    const inputName = modal.querySelector('#scene-name-input');
    const inputCond = modal.querySelector('#scene-condition-input');
    if (inputName) inputName.value = `Cena ${nextIdx}`;
    if (inputCond) inputCond.value = '';
    modal.classList.remove('hidden');
    if (inputName) {
      setTimeout(() => inputName.focus(), 60);
    }
  }

  _closeSceneModal() {
    const modal = this.domContainer.querySelector('#editor-scene-modal');
    if (!modal) return;
    modal.classList.add('hidden');
  }

  _saveSceneModal() {
    const modal = this.domContainer.querySelector('#editor-scene-modal');
    if (!modal) return;
    const inputName = modal.querySelector('#scene-name-input');
    const inputCond = modal.querySelector('#scene-condition-input');
    const name = inputName ? inputName.value.trim() : '';
    const cond = inputCond ? inputCond.value.trim() : '';
    this.addScene(name, cond);
    this._closeSceneModal();
  }

  _closeAllSubmodals() {
    this._closeTriggerModal();
    this._closeAnimationModal();
    this._closeSceneModal();
  }

  /**
   * Sincroniza referências planas (map.obstacles, map.trashSpawns, map.visualSprites, map.enemies)
   * a partir das camadas para garantir compatibilidade com física, inimigos e telemetria.
   */
  syncLayerReferences(map) {
    if (!map || !Array.isArray(map.layers)) return;

    const obstacles = [];
    const trashSpawns = [];
    const visualSprites = [];
    const enemySpawns = [];

    const collisionBounds = [];

    map.layers.forEach((layer, layerIdx) => {
      // Ignora rigorosamente a camada destinada ao "teto" (Camada 3)
      const isCeilingLayer =
        layerIdx === 3 ||
        layer.id === 3 ||
        layer.name === 'Teto/Overlay' ||
        /teto|overhead/i.test(layer.name || '');

      layer.items.forEach((item) => {
        item.layer = layerIdx;
        item.rotation = item.rotation || 0;

        if (item.type === 'enemy' || item.enemyType) {
          item.type = 'enemy';
          item.enemyType = item.enemyType || 'scratcher';
          item.label = item.label || this.getEnemyTypeDef(item.enemyType).label;
          enemySpawns.push(item);
        } else if (item.type === 'obstacle' || (item.w && item.h && !item.src && !item.typeIndex) || item.polygon) {
          // CONDIÇÃO RIGOROSA (Sprint 17):
          // Se o objeto ou polígono possuir a propriedade isOverhead === true
          // (ou collisionType === 'overhead', ou pertencer à camada destinada ao "teto"),
          // ele NÃO DEVE ser inserido no array de colisões. O motor de física ignora
          // completamente esse objeto, permitindo que entidades caminhem livremente.
          const isOverhead =
            item.isOverhead === true ||
            item.collisionType === 'overhead' ||
            isCeilingLayer;

          const isTrigger =
            item.isTrigger === true ||
            item.collisionType === 'trigger';

          if (!isOverhead && !isTrigger) {
            item.type = 'obstacle';
            obstacles.push(item);
            collisionBounds.push(item);
          }
        } else if (item.type === 'trash' || item.typeIndex !== undefined) {
          item.type = 'trash';
          trashSpawns.push(item);
        } else if (item.type === 'sprite' || item.src) {
          item.type = 'sprite';
          visualSprites.push(item);
        }
      });
    });

    map.obstacles = obstacles;
    map.collisionBounds = collisionBounds;
    map.trashSpawns = trashSpawns;
    map.visualSprites = visualSprites;
    map.enemySpawns = enemySpawns;
    map.enemies = enemySpawns; // Camada de entidades para exportação e sincronização (Sprint 9)
  }

  /**
   * Retorna a camada ativa atual
   */
  getActiveLayer() {
    const map = this.game.currentMap;
    if (!map || !Array.isArray(map.layers)) return null;
    return map.layers[this.activeLayerIndex] || map.layers[0];
  }

  /**
   * Alterna a camada ativa (0, 1, 2 ou 3)
   */
  setActiveLayer(index) {
    const clamped = Math.max(0, Math.min(3, parseInt(index, 10) || 0));
    this.activeLayerIndex = clamped;
    const def = this.LAYER_DEFS[clamped];

    // Atualiza HUD da tela
    this._updateLayerHUDDisplay();

    // Atualiza botões de camada
    const buttons = this.domContainer.querySelectorAll('.editor-layer-btn');
    buttons.forEach((btn) => {
      btn.classList.toggle('active', parseInt(btn.getAttribute('data-layer'), 10) === clamped);
    });

    // Se o item selecionado pertencer a outra camada, notifica
    if (this.selectedItem && this.selectedItem.layer !== undefined && this.selectedItem.layer !== clamped) {
      // Mantém selecionado mas atualiza inspetor
      this._renderPropertiesDock();
    }

    this.game.ui.showToast(`📑 Camada Ativa: Camada ${clamped}: ${def.name} [Tecla ${def.keyNumber}]`, 1800);
  }

  _updateLayerHUDDisplay() {
    const hudEl = this.domContainer.querySelector('#editor-active-layer-hud');
    const def = this.LAYER_DEFS[this.activeLayerIndex];
    if (hudEl && def) {
      hudEl.innerHTML = `<span class="layer-hud-dot" style="background:${def.color}"></span> Camada Atual: <strong>Camada ${def.id}: ${def.name}</strong> <small>[${def.keyNumber}]</small>`;
      hudEl.style.borderColor = def.color;
    }
  }

  /* =========================================================================
   * 2. ORDENAÇÃO DE Z-INDEX (ENVIAR PARA FRENTE / TRÁS)
   * ========================================================================= */

  /**
   * Reordena o índice do item selecionado dentro da array da sua respectiva camada.
   * direction: -1 = Trás ('[' / PageDown), +1 = Frente (']' / PageUp)
   */
  moveSelectedItemZIndex(direction) {
    if (!this.selectedItem || !this.game.currentMap) return;

    const map = this.game.currentMap;
    this.ensureMapLayers(map);

    const layerIdx = this.selectedItem.layer !== undefined ? this.selectedItem.layer : this.activeLayerIndex;
    const layer = map.layers[layerIdx];
    if (!layer || !Array.isArray(layer.items)) return;

    const currentIndex = layer.items.indexOf(this.selectedItem);
    if (currentIndex === -1) return;

    if (direction < 0) {
      // Mover para trás ('[' ou PageDown)
      if (currentIndex > 0) {
        if (this.history) this.history.commit(null, 'Mover para Trás');
        const targetIndex = currentIndex - 1;
        const [removed] = layer.items.splice(currentIndex, 1);
        layer.items.splice(targetIndex, 0, removed);
        this.syncLayerReferences(map);
        this._renderPropertiesDock();
        this.game.ui.showToast(`⬇️ [${this.selectedItem.label || 'Item'}] movido para trás (Z-Index: ${targetIndex + 1}/${layer.items.length})`, 1400);
      } else {
        this.game.ui.showToast(`⚠️ O item já está no fundo da Camada ${layerIdx}: ${layer.name}!`, 1200);
      }
    } else if (direction > 0) {
      // Mover para frente (']' ou PageUp)
      if (currentIndex < layer.items.length - 1) {
        if (this.history) this.history.commit(null, 'Mover para Frente');
        const targetIndex = currentIndex + 1;
        const [removed] = layer.items.splice(currentIndex, 1);
        layer.items.splice(targetIndex, 0, removed);
        this.syncLayerReferences(map);
        this._renderPropertiesDock();
        this.game.ui.showToast(`⬆️ [${this.selectedItem.label || 'Item'}] movido para frente (Z-Index: ${targetIndex + 1}/${layer.items.length})`, 1400);
      } else {
        this.game.ui.showToast(`⚠️ O item já está no topo da Camada ${layerIdx}: ${layer.name}!`, 1200);
      }
    }
  }

  /* =========================================================================
   * 3. SISTEMA DE ROTAÇÃO DE SPRITES
   * ========================================================================= */

  /**
   * Rotaciona o item selecionado em incrementos de graus (padrão: 90° ao pressionar 'R')
   */
  rotateSelectedItem(deltaDegrees = 90) {
    if (!this.selectedItem) return;
    if (this.history) this.history.commit(null, 'Rotacionar Item');

    const currentRotation = this.selectedItem.rotation || 0;
    let nextRotation = (currentRotation + deltaDegrees) % 360;
    if (nextRotation < 0) nextRotation += 360;

    this.selectedItem.rotation = nextRotation;

    if (this.selectedItem.polygon && Array.isArray(this.selectedItem.polygon)) {
      const cx = this.selectedItem.x + this.selectedItem.w / 2;
      const cy = this.selectedItem.y + this.selectedItem.h / 2;
      const rad = (deltaDegrees * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      for (const pt of this.selectedItem.polygon) {
        const dx = pt.x - cx;
        const dy = pt.y - cy;
        pt.x = Math.round(cx + (dx * cos - dy * sin));
        pt.y = Math.round(cy + (dx * sin + dy * cos));
      }
      this._recalculatePolygonBounds(this.selectedItem);
    }

    if (this.game.currentMap) {
      this.syncLayerReferences(this.game.currentMap);
    }

    if (this.selectedType === 'trash') {
      this.syncTrashWithGame();
    }

    this._renderPropertiesDock();
    this.game.ui.showToast(`🔄 Rotação: ${nextRotation}° [R]`, 1200);
  }

  /* =========================================================================
   * 4. AJUSTE FINO PRECISO PELO MOUSE (PIXEL PERFECT VS GRID SNAP)
   * ========================================================================= */

  /**
   * Retorna a coordenada com snap ou 1:1 pixel perfect dependendo de snapEnabled e tecla ALT/Shift
   */
  snap(val, isAltHeld = false) {
    const isFree = isAltHeld || this.isAltHeld || !this.snapEnabled || !this.snapGrid || this.snapGrid <= 1;
    if (isFree) {
      return Math.round(val);
    }
    return Math.round(val / this.snapGrid) * this.snapGrid;
  }

  toggleSnap() {
    this.snapEnabled = !this.snapEnabled;
    this._updateSnapButtonDisplay();
    this.game.ui.showToast(`🧲 Snap à Grade: ${this.snapEnabled ? `${this.snapGrid}px (Ativado)` : 'DESATIVADO (Livre 1px)'}`, 1600);
  }

  _updateSnapButtonDisplay() {
    const btn = this.domContainer.querySelector('#btn-toggle-snap');
    const hudSnap = this.domContainer.querySelector('#editor-snap-hud-indicator');
    const isFree = this.isAltHeld || !this.snapEnabled;

    if (btn) {
      btn.classList.toggle('snap-active', this.snapEnabled && !this.isAltHeld);
      btn.classList.toggle('snap-free', isFree);
      btn.innerHTML = isFree ? '🔓 LIVRE [1px]' : `🧲 Snap: ${this.snapGrid}px`;
    }

    if (hudSnap) {
      hudSnap.textContent = isFree ? 'LIVRE (1px)' : `${this.snapGrid}px`;
      hudSnap.classList.toggle('tag-free', isFree);
    }
  }

  /* =========================================================================
   * INICIALIZAÇÃO DA INTERFACE DOM (HTML / OVERLAYS)
   * ========================================================================= */

  _initDOM() {
    let container = document.getElementById('map-editor-overlay');
    if (!container) {
      container = document.createElement('div');
      container.id = 'map-editor-overlay';
      container.className = 'map-editor-overlay hidden';
      document.body.appendChild(container);
    }
    this.domContainer = container;

    this.domContainer.innerHTML = `
      <!-- BARRA SUPERIOR DO EDITOR -->
      <header class="editor-header-bar">
        <!-- BLOCO 1: TÍTULO, MAPA, COORDENADAS E HUD DA CAMADA ATIVA -->
        <div class="editor-bar-section editor-brand-section">
          <span class="editor-badge">🛠️ EDITOR DE MAPAS</span>
          <span id="editor-map-name-badge" class="editor-tag-pill">MAPA ATUAL</span>
          
          <!-- INDICADOR HUD DA CAMADA ATUAL (REQUISITO 1) -->
          <div id="editor-active-layer-hud" class="editor-layer-hud-tag">
            Camada Atual: Camada 2: Objetos/Colisão [3]
          </div>

          <!-- COORDENADAS E SNAP HUD -->
          <div class="editor-coords-pill">
            <span id="editor-coords-display">X: 0 | Y: 0</span>
            <span id="editor-snap-hud-indicator" class="editor-snap-chip">16px</span>
            <span id="editor-zoom-display" class="editor-zoom-tag">100%</span>
          </div>
        </div>

        <!-- BLOCO: SELETOR DE CENAS / ESTADOS (SPRINT 13 - REQUISITO 3) -->
        <div class="editor-bar-section editor-scene-nav-section">
          <div class="editor-scene-selector" id="editor-scene-selector">
            <span class="scene-label">🎬 CENA:</span>
            <select id="editor-scene-dropdown" class="editor-scene-select" title="Alternar Cena Ativa"></select>
            <button type="button" id="btn-editor-add-scene" class="editor-action-btn btn-add-scene" title="Adicionar Nova Cena / Modificação de Cenário">
              ➕ Nova Cena
            </button>
          </div>
        </div>

        <!-- BLOCO 2: SELETOR DE CAMADAS 0 A 3 (TECLAS 1, 2, 3, 4) -->
        <nav class="editor-bar-section editor-layer-nav-section">
          <div class="editor-layer-selector">
            <button type="button" class="editor-layer-btn" data-layer="0" title="Camada 0: Chão [Tecla 1]">
              <span class="layer-key-chip">1</span> 🌾 Chão
            </button>
            <button type="button" class="editor-layer-btn" data-layer="1" title="Camada 1: Tapetes/Decalques [Tecla 2]">
              <span class="layer-key-chip">2</span> 🧶 Tapetes
            </button>
            <button type="button" class="editor-layer-btn active" data-layer="2" title="Camada 2: Objetos/Colisão [Tecla 3]">
              <span class="layer-key-chip">3</span> 🧱 Objetos
            </button>
            <button type="button" class="editor-layer-btn" data-layer="3" title="Camada 3: Teto/Overlay [Tecla 4]">
              <span class="layer-key-chip">4</span> 🏠 Teto
            </button>
          </div>
        </nav>

        <!-- BLOCO 3: FERRAMENTAS, SNAP E EXPORTAÇÃO -->
        <div class="editor-bar-section editor-system-actions">
          <!-- TOGGLE DE SNAP À GRADE (REQUISITO 4) -->
          <button type="button" id="btn-toggle-snap" class="editor-action-btn snap-active" title="Alternar Snap (Segure ALT para mover livremente)">
            🧲 Snap: 16px
          </button>
          <select id="editor-snap-select" class="editor-snap-dropdown" title="Tamanho da Grade">
            <option value="8">8 px</option>
            <option value="16" selected>16 px</option>
            <option value="32">32 px</option>
            <option value="64">64 px</option>
          </select>

          <button type="button" id="btn-editor-undo" class="editor-action-btn" title="Desfazer Última Ação [Ctrl + Z]">
            ↩️ Desfazer [Ctrl+Z]
          </button>

          <button type="button" id="btn-editor-center-cam" class="editor-action-btn" title="Centralizar Câmera no Mapa">
            🎯 Centralizar
          </button>

          <button type="button" id="btn-editor-export-json" class="editor-action-btn btn-export-highlight" title="Exportar Mapa (.JSON)">
            💾 Exportar (.JSON)
          </button>

          <button type="button" id="btn-editor-close" class="editor-action-btn btn-close-editor" title="Retomar o Jogo (F6)">
            ✖ Fechar [F6]
          </button>
        </div>
      </header>

      <!-- BARRA CONTEXTUAL DE FERRAMENTAS RÁPIDAS -->
      <div id="editor-context-bar" class="editor-context-bar">
        <!-- Injetado dinamicamente -->
      </div>

      <!-- PAINEL FLUTUANTE DE PROPRIEDADES (INSPECTOR COM Z-INDEX E ROTAÇÃO) -->
      <aside id="editor-properties-dock" class="editor-properties-dock hidden">
        <div class="properties-dock-header">
          <strong id="prop-item-title">PROPRIEDADES DO ITEM</strong>
          <button type="button" id="btn-prop-close" class="prop-btn-icon" title="Desmarcar (Esc)">✕</button>
        </div>
        <div class="properties-dock-body" id="properties-dock-fields">
          <!-- Campos dinâmicos -->
        </div>

        <!-- CONTROLES DE Z-INDEX E ROTAÇÃO (REQUISITOS 2 E 3) -->
        <div class="properties-dock-z-rotate">
          <div class="prop-action-subrow">
            <span class="prop-subrow-label">Z-Index:</span>
            <button type="button" id="btn-z-backward" class="stardew-btn btn-secondary btn-xs" title="Enviar para Trás (Tecla [ ou PageDown)">
              ⬇️ Trás [ [ ]
            </button>
            <button type="button" id="btn-z-forward" class="stardew-btn btn-secondary btn-xs" title="Trazer para Frente (Tecla ] ou PageUp)">
              ⬆️ Frente [ ] ]
            </button>
            <span id="prop-zindex-indicator" class="prop-zindex-text">Z: 1/1</span>
          </div>

          <div class="prop-action-subrow">
            <span class="prop-subrow-label">Rotação:</span>
            <button type="button" id="btn-rotate-cw" class="stardew-btn btn-primary btn-xs" title="Rotacionar +90° (Tecla R)">
              🔄 Girar 90° [R]
            </button>
            <span id="prop-rotation-indicator" class="prop-rotation-badge">0°</span>
          </div>
        </div>

        <div class="properties-dock-footer">
          <button type="button" id="btn-prop-duplicate" class="stardew-btn btn-secondary btn-sm">📋 Duplicar</button>
          <button type="button" id="btn-prop-delete" class="stardew-btn btn-danger btn-sm">🗑️ Excluir (Del)</button>
        </div>
      </aside>

      <!-- MODAL DE EXPORTAÇÃO (.JSON) -->
      <div id="editor-export-modal" class="editor-export-modal-backdrop hidden">
        <div class="stardew-panel editor-export-panel">
          <div class="dev-ribbon ribbon-victory">GERADOR DE ARQUIVO DE EXPORTAÇÃO (SPRINT 7)</div>
          <h2 class="export-modal-title">Exportação de Mapa com Camadas (.JSON)</h2>
          <p class="export-modal-desc">
            Estrutura organizada por camadas (Chão, Tapetes, Objetos e Teto) com posições X/Y, escalas, rotações e Z-index. Copie o JSON abaixo:
          </p>

          <div class="export-stats-row">
            <span id="export-stat-layers" class="export-stat-chip">📑 4 Camadas</span>
            <span id="export-stat-obstacles" class="export-stat-chip">🧱 0 Colisões</span>
            <span id="export-stat-trashes" class="export-stat-chip">♻ 0 Lixos</span>
            <span id="export-stat-enemies" class="export-stat-chip">👾 0 Inimigos</span>
            <span id="export-stat-sprites" class="export-stat-chip">🖼 0 Imagens</span>
          </div>

          <div class="export-code-box">
            <textarea id="editor-export-textarea" readonly spellcheck="false"></textarea>
          </div>

          <div class="export-modal-actions">
            <button type="button" id="btn-copy-export-json" class="stardew-btn btn-primary btn-copy-glow">
              📋 Copiar Conteúdo para Área de Transferência
            </button>
            <button type="button" id="btn-download-again-json" class="stardew-btn btn-warning">
              ⬇️ Baixar Arquivo Novamente
            </button>
            <button type="button" id="btn-close-export-modal" class="stardew-btn btn-secondary">
              Fechar
            </button>
          </div>
        </div>
      </div>

      <!-- MODAL DE TRIGGER / INSTRUÇÃO IA (SPRINT 13 - REQUISITO 2) -->
      <div id="editor-trigger-modal" class="editor-modal-backdrop hidden">
        <div class="stardew-panel editor-submodal-panel">
          <div class="dev-ribbon ribbon-victory">⚡ CONFIGURAÇÃO DE TRIGGER</div>
          <h3 class="modal-subheading">Zona de Ativação Interativa</h3>
          <p class="modal-subdesc">Escreva o que deve acontecer quando o jogador entrar nesta zona invisível. O texto será salvo como instrução estruturada para a IA:</p>
          <div class="editor-form-group">
            <label class="editor-form-label" for="trigger-instruction-input">Instrução para IA (ai_instruction):</label>
            <textarea id="trigger-instruction-input" class="editor-textarea-prompt" rows="3" placeholder="Ex: Abrir menu da loja, Ativar armadilha de gás, Ligar energia..."></textarea>
          </div>
          <div class="editor-form-group">
            <label class="editor-form-label" for="trigger-label-input">Rótulo / Nome da Zona:</label>
            <input type="text" id="trigger-label-input" class="editor-input-text" placeholder="Ex: TRIGGER_LOJA" />
          </div>
          <div class="modal-buttons-row">
            <button type="button" id="btn-save-trigger" class="stardew-btn btn-primary">Salvar Trigger</button>
            <button type="button" id="btn-cancel-trigger" class="stardew-btn btn-secondary">Cancelar</button>
          </div>
        </div>
      </div>

      <!-- MODAL DE ANIMAÇÃO / MARCADOR IA (SPRINT 13 - REQUISITO 2) -->
      <div id="editor-animation-modal" class="editor-modal-backdrop hidden">
        <div class="stardew-panel editor-submodal-panel">
          <div class="dev-ribbon ribbon-victory">🎬 MARCADOR DE ANIMAÇÃO</div>
          <h3 class="modal-subheading">Sinalização de Efeito Visual</h3>
          <p class="modal-subdesc">Descreva qual animação visual ou efeito deve rodar nesta coordenada X,Y. Ficará salvo no JSON como metadata de design para a IA:</p>
          <div class="editor-form-group">
            <label class="editor-form-label" for="anim-instruction-input">Descrição da Animação (ai_instruction):</label>
            <textarea id="anim-instruction-input" class="editor-textarea-prompt" rows="3" placeholder="Ex: Fumaça verde saindo do cano, Faíscas elétricas no reator, Água gotejando..."></textarea>
          </div>
          <div class="editor-form-group">
            <label class="editor-form-label" for="anim-label-input">Rótulo do Marcador:</label>
            <input type="text" id="anim-label-input" class="editor-input-text" placeholder="Ex: EFEITO_FUMACA_01" />
          </div>
          <div class="modal-buttons-row">
            <button type="button" id="btn-save-animation" class="stardew-btn btn-primary">Salvar Marcador 🎬</button>
            <button type="button" id="btn-cancel-animation" class="stardew-btn btn-secondary">Cancelar</button>
          </div>
        </div>
      </div>

      <!-- MODAL DE CENAS / MODIFICAÇÃO DE CENÁRIO (SPRINT 13 - REQUISITO 3) -->
      <div id="editor-scene-modal" class="editor-modal-backdrop hidden">
        <div class="stardew-panel editor-submodal-panel">
          <div class="dev-ribbon ribbon-victory">🎬 MODIFICAÇÃO DE CENÁRIO (ESTADOS/CENAS)</div>
          <h3 class="modal-subheading">Criar Nova Cena com Dados Isolados</h3>
          <p class="modal-subdesc">O editor criará a nova cena clonando os dados visuais da cena atual. Qualquer edição feita na nova cena ficará 100% isolada:</p>
          <div class="editor-form-group">
            <label class="editor-form-label" for="scene-name-input">Nome da Nova Cena:</label>
            <input type="text" id="scene-name-input" class="editor-input-text" placeholder="Ex: Cena 2 (Pós-Energia), Cena Inundada..." />
          </div>
          <div class="editor-form-group">
            <label class="editor-form-label" for="scene-condition-input">Descrição do Gatilho / Condição (condition):</label>
            <textarea id="scene-condition-input" class="editor-textarea-prompt" rows="3" placeholder="Ex: O mapa muda para essa cena depois que a energia volta; Ativado após drenar a água..."></textarea>
          </div>
          <div class="modal-buttons-row">
            <button type="button" id="btn-create-scene" class="stardew-btn btn-primary">➕ Criar Cena (Clonar Atual)</button>
            <button type="button" id="btn-cancel-scene" class="stardew-btn btn-secondary">Cancelar</button>
          </div>
        </div>
      </div>

      <!-- MENU DE CONTEXTO FLUTUANTE (SPRINT 13 & 14) -->
      <div id="editor-context-menu" class="editor-context-menu hidden"></div>

      <!-- Input de upload de imagem -->
      <input type="file" id="editor-file-input" accept="image/*" style="display: none;" />
    `;

    // Botão flutuante na tela
    let toggleBtn = document.getElementById('btn-screen-toggle-editor');
    if (!toggleBtn) {
      toggleBtn = document.createElement('button');
      toggleBtn.id = 'btn-screen-toggle-editor';
      toggleBtn.type = 'button';
      toggleBtn.className = 'editor-screen-toggle-btn';
      toggleBtn.innerHTML = '🛠️ Editor [F6]';
      toggleBtn.title = 'Abrir Editor de Mapas (Atalho: F6)';
      document.body.appendChild(toggleBtn);
      toggleBtn.addEventListener('click', () => this.toggle());
    }

    this._updateLayerHUDDisplay();
    this._updateContextBar();
  }

  /* =========================================================================
   * GERENCIAMENTO DE EVENTOS (TECLADO, MOUSE, ATALHOS)
   * ========================================================================= */

  _bindEvents() {
    const overlay = this.domContainer;

    // Seletor de Camadas (Botões de Clique 0 a 3)
    overlay.querySelectorAll('.editor-layer-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const layerIdx = parseInt(btn.getAttribute('data-layer'), 10);
        this.setActiveLayer(layerIdx);
      });
    });

    // Snap Toggle
    const btnToggleSnap = overlay.querySelector('#btn-toggle-snap');
    if (btnToggleSnap) {
      btnToggleSnap.addEventListener('click', () => this.toggleSnap());
    }

    const snapSelect = overlay.querySelector('#editor-snap-select');
    if (snapSelect) {
      snapSelect.addEventListener('change', () => {
        this.snapGrid = parseInt(snapSelect.value, 10) || 16;
        this.snapEnabled = true;
        this._updateSnapButtonDisplay();
      });
    }

    // Seletor e Criação de Cenas (Sprint 13)
    const selectScene = overlay.querySelector('#editor-scene-dropdown');
    if (selectScene) {
      selectScene.addEventListener('change', (e) => {
        this.switchScene(parseInt(e.target.value, 10));
      });
    }

    const btnAddScene = overlay.querySelector('#btn-editor-add-scene');
    if (btnAddScene) {
      btnAddScene.addEventListener('click', () => this._openSceneModal());
    }

    // Botões dos Modais de Trigger, Animação e Cenas (Sprint 13)
    const btnSaveTrig = overlay.querySelector('#btn-save-trigger');
    if (btnSaveTrig) btnSaveTrig.addEventListener('click', () => this._saveTriggerModal());

    const btnCancelTrig = overlay.querySelector('#btn-cancel-trigger');
    if (btnCancelTrig) btnCancelTrig.addEventListener('click', () => this._closeTriggerModal());

    const btnSaveAnim = overlay.querySelector('#btn-save-animation');
    if (btnSaveAnim) btnSaveAnim.addEventListener('click', () => this._saveAnimationModal());

    const btnCancelAnim = overlay.querySelector('#btn-cancel-animation');
    if (btnCancelAnim) btnCancelAnim.addEventListener('click', () => this._closeAnimationModal());

    const btnCreateSc = overlay.querySelector('#btn-create-scene');
    if (btnCreateSc) btnCreateSc.addEventListener('click', () => this._saveSceneModal());

    const btnCancelSc = overlay.querySelector('#btn-cancel-scene');
    if (btnCancelSc) btnCancelSc.addEventListener('click', () => this._closeSceneModal());

    // Centralizar Câmera
    const btnCenter = overlay.querySelector('#btn-editor-center-cam');
    if (btnCenter) {
      btnCenter.addEventListener('click', () => this.centerCamera());
    }

    // Desfazer Última Ação (Ctrl + Z) - Sprint 11
    const btnUndo = overlay.querySelector('#btn-editor-undo');
    if (btnUndo) {
      btnUndo.addEventListener('click', () => this.desfazer());
    }

    // Exportar JSON
    const btnExport = overlay.querySelector('#btn-editor-export-json');
    if (btnExport) {
      btnExport.addEventListener('click', () => this.exportMapJSON());
    }

    // Fechar Editor
    const btnClose = overlay.querySelector('#btn-editor-close');
    if (btnClose) {
      btnClose.addEventListener('click', () => this.close());
    }

    // Z-Index e Rotação na Doca
    const btnZBack = overlay.querySelector('#btn-z-backward');
    if (btnZBack) {
      btnZBack.addEventListener('click', () => this.moveSelectedItemZIndex(-1));
    }

    const btnZFwd = overlay.querySelector('#btn-z-forward');
    if (btnZFwd) {
      btnZFwd.addEventListener('click', () => this.moveSelectedItemZIndex(1));
    }

    const btnRotate = overlay.querySelector('#btn-rotate-cw');
    if (btnRotate) {
      btnRotate.addEventListener('click', () => this.rotateSelectedItem(90));
    }

    // Inspector
    const btnPropClose = overlay.querySelector('#btn-prop-close');
    if (btnPropClose) {
      btnPropClose.addEventListener('click', () => this.deselectItem());
    }

    const btnPropDelete = overlay.querySelector('#btn-prop-delete');
    if (btnPropDelete) {
      btnPropDelete.addEventListener('click', () => this.deleteSelectedItem());
    }

    const btnPropDup = overlay.querySelector('#btn-prop-duplicate');
    if (btnPropDup) {
      btnPropDup.addEventListener('click', () => this.duplicateSelectedItem());
    }

    // Modal Exportação
    const btnCloseExport = overlay.querySelector('#btn-close-export-modal');
    if (btnCloseExport) {
      btnCloseExport.addEventListener('click', () => {
        overlay.querySelector('#editor-export-modal').classList.add('hidden');
      });
    }

    const btnCopyExport = overlay.querySelector('#btn-copy-export-json');
    if (btnCopyExport) {
      btnCopyExport.addEventListener('click', () => this.copyExportTextToClipboard());
    }

    const btnDownloadAgain = overlay.querySelector('#btn-download-again-json');
    if (btnDownloadAgain) {
      btnDownloadAgain.addEventListener('click', () => this.triggerFileDownload());
    }

    // Upload
    const fileInput = overlay.querySelector('#editor-file-input');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => this._handleFileUpload(e));
    }

    // Canvas Events
    const canvas = this.game.canvas;
    canvas.addEventListener('mousedown', (e) => this._onCanvasMouseDown(e));
    window.addEventListener('mousemove', (e) => this._onCanvasMouseMove(e));
    window.addEventListener('mouseup', (e) => this._onCanvasMouseUp(e));
    canvas.addEventListener('dblclick', (e) => this._onCanvasDblClick(e));
    canvas.addEventListener('contextmenu', (e) => this._onCanvasContextMenu(e));
    canvas.addEventListener('wheel', (e) => this._onCanvasWheel(e), { passive: false });
    window.addEventListener('click', (e) => {
      if (!e.target.closest('#editor-context-menu')) {
        this._hideContextMenu();
      }
    });

    // Rastreamento das teclas ALT e SHIFT para o Ajuste Fino (Hold to Free)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Control') {
        this.isCtrlHeld = true;
      }
      if (e.key === 'Alt' || e.key === 'Shift') {
        this.isAltHeld = true;
        this._updateSnapButtonDisplay();
      }

      if (e.code === 'F6') {
        e.preventDefault();
        e.stopPropagation();
        this.toggle();
        return;
      }

      if (!this.active) return;

      // Atalho de Desfazer: Ctrl + Z (Sprint 11)
      if (e.ctrlKey && (e.key === 'z' || e.key === 'Z' || e.code === 'KeyZ')) {
        e.preventDefault();
        if (e.target && typeof e.target.blur === 'function') {
          e.target.blur();
        }
        this.desfazer();
        return;
      }

      // Não intercepta se estiver digitando em campo de texto
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT')) {
        return;
      }

      // 1. Navegação de Camadas pelas teclas numéricas '1', '2', '3', '4' (Requisito 1)
      if (e.code === 'Digit1') {
        e.preventDefault();
        this.setActiveLayer(0);
      } else if (e.code === 'Digit2') {
        e.preventDefault();
        this.setActiveLayer(1);
      } else if (e.code === 'Digit3') {
        e.preventDefault();
        this.setActiveLayer(2);
      } else if (e.code === 'Digit4') {
        e.preventDefault();
        this.setActiveLayer(3);
      }

      // 2. Atalhos de Z-Index: '[' / PageDown e ']' / PageUp (Requisito 2)
      else if (e.code === 'BracketLeft' || e.key === '[' || e.code === 'PageDown') {
        e.preventDefault();
        this.moveSelectedItemZIndex(-1);
      } else if (e.code === 'BracketRight' || e.key === ']' || e.code === 'PageUp') {
        e.preventDefault();
        this.moveSelectedItemZIndex(1);
      }

      // 3. Atalho de Rotação: Tecla 'R' (Requisito 3)
      else if (e.code === 'KeyR') {
        if (this.selectedItem) {
          e.preventDefault();
          this.rotateSelectedItem(90);
        }
      }

      // 4. Atalho de Seleção de Tipo de Inimigo: Tecla 'T' (Sprint 9 - Requisito 3)
      else if (e.code === 'KeyT') {
        e.preventDefault();
        this.cycleEnemyType();
      }

      // 5. Ferramenta de Colisão Poligonal: Tecla 'P' (Sprint 14 - Requisito 1)
      else if (e.code === 'KeyP') {
        e.preventDefault();
        this.setToolMode('polygon');
      }

      // 6. Visualização de Malhas de Colisão: Tecla 'C' (Sprint 14 - Requisito 3)
      else if (e.code === 'KeyC') {
        e.preventDefault();
        this.toggleShowCollisions();
      }

      // 7. Fechar Polígono Atual: Tecla 'Enter' (Sprint 14 - Requisito 1)
      else if (e.code === 'Enter') {
        if (this.isDrawingPolygon && this.polygonPoints.length >= 3) {
          e.preventDefault();
          this.finishPolygon();
        }
      }

      // Outros atalhos do editor
      else if (e.code === 'Delete' || e.code === 'Backspace') {
        e.preventDefault();
        this.deleteSelectedItem();
      } else if (e.code === 'Escape') {
        if (this.isDrawingPolygon) {
          e.preventDefault();
          this.cancelPolygon();
        } else {
          this._closeAllSubmodals();
          this._hideContextMenu();
          this.deselectItem();
        }
      } else if (e.ctrlKey && e.code === 'KeyS') {
        e.preventDefault();
        this.exportMapJSON();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'Control') {
        this.isCtrlHeld = false;
      }
      if (e.key === 'Alt' || e.key === 'Shift') {
        this.isAltHeld = false;
        this._updateSnapButtonDisplay();
      }
    });
  }

  /* =========================================================================
   * CICLO DE VIDA (OPEN / CLOSE / TOGGLE)
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

    if (this.game.appState === 'MAIN_MENU') {
      this.game.appState = 'PLAYING';
      if (this.game.ui) this.game.ui.showGameplayHUD();
    }

    const map = this.game.currentMap;
    if (map) {
      this.ensureMapLayers(map);
      this.camFocusX = this.game.p1 ? this.game.p1.x : map.width / 2;
      this.camFocusY = this.game.p1 ? this.game.p1.y : map.height / 2;
    }
    this.zoom = 1.0;

    this.domContainer.classList.remove('hidden');

    const toggleBtn = document.getElementById('btn-screen-toggle-editor');
    if (toggleBtn) {
      toggleBtn.classList.add('editor-active');
      toggleBtn.innerHTML = '✖ Fechar [F6]';
    }

    this._updateMapInfoBadge();
    this._updateSceneUI();
    this._updateLayerHUDDisplay();
    this._updateSnapButtonDisplay();
    this._updateContextBar();
    this.game.ui.showToast('🛠️ Editor Avançado ATIVADO (Teclas 1, 2, 3, 4 para Camadas • F6 para fechar)', 3000);
  }

  close() {
    this.active = false;
    this.deselectItem();
    this.isPanning = false;
    this.isDraggingItem = false;
    this.isResizing = false;
    this.isDrawingNewObstacle = false;
    this.isAltHeld = false;

    this._closeAllSubmodals();
    this._hideContextMenu();
    this.domContainer.classList.add('hidden');
    const modal = this.domContainer.querySelector('#editor-export-modal');
    if (modal) modal.classList.add('hidden');

    const toggleBtn = document.getElementById('btn-screen-toggle-editor');
    if (toggleBtn) {
      toggleBtn.classList.remove('editor-active');
      toggleBtn.innerHTML = '🛠️ Editor [F6]';
    }

    if (this.game.currentMap) {
      this.syncLayerReferences(this.game.currentMap);
      this.syncTrashWithGame();
    }

    this.game.ui.showToast('▶️ Jogo RETOMADO com as alterações aplicadas!', 2200);
  }

  _updateMapInfoBadge() {
    const badge = this.domContainer.querySelector('#editor-map-name-badge');
    const map = this.game.currentMap;
    if (badge && map) {
      badge.textContent = `${map.name || map.id} [${map.width}x${map.height}px]`;
    }
  }

  centerCamera() {
    const map = this.game.currentMap;
    if (map) {
      this.camFocusX = map.width / 2;
      this.camFocusY = map.height / 2;
      this.zoom = Math.min(
        1.0,
        Math.max(0.3, Math.min(this.game.canvas.width / map.width, this.game.canvas.height / map.height) * 0.95)
      );
      this._updateZoomDisplay();
    }
  }

  _updateZoomDisplay() {
    const zoomEl = this.domContainer.querySelector('#editor-zoom-display');
    if (zoomEl) {
      zoomEl.textContent = `${Math.round(this.zoom * 100)}%`;
    }
  }

  /* =========================================================================
   * CONVERSÃO DE COORDENADAS
   * ========================================================================= */

  screenToWorld(screenX, screenY) {
    const canvas = this.game.canvas;
    const worldX = (screenX - canvas.width / 2) / this.zoom + this.camFocusX;
    const worldY = (screenY - canvas.height / 2) / this.zoom + this.camFocusY;
    return { x: worldX, y: worldY };
  }

  worldToScreen(worldX, worldY) {
    const canvas = this.game.canvas;
    const screenX = (worldX - this.camFocusX) * this.zoom + canvas.width / 2;
    const screenY = (worldY - this.camFocusY) * this.zoom + canvas.height / 2;
    return { x: screenX, y: screenY };
  }

  /* =========================================================================
   * BARRA CONTEXTUAL DE FERRAMENTAS
   * ========================================================================= */

  _updateContextBar() {
    const bar = this.domContainer.querySelector('#editor-context-bar');
    if (!bar) return;

    const currEnemyDef = this.getEnemyTypeDef(this.currentEnemyType);

    bar.innerHTML = `
      <div class="context-group">
        <span class="context-label">Ferramentas da Camada:</span>
        <button type="button" id="btn-tool-hitbox" class="context-pill-btn ${this.toolMode === 'collisions' ? 'active' : ''}" title="Desenhar e editar caixas de colisão retangulares (Camada 2)">
          🧱 Colisão (Hitbox)
        </button>
        <button type="button" id="btn-tool-polygon" class="context-pill-btn btn-tool-polygon ${this.toolMode === 'polygon' ? 'active' : ''}" title="Desenhar colisão poligonal com laço livre (Atalho: Tecla P)">
          🔷 Colisão Poligonal <small class="key-pill">[P]</small>
        </button>
        <button type="button" id="btn-toggle-show-collisions" class="context-pill-btn btn-toggle-show-collisions ${this.showCollisions ? 'active' : ''}" title="Exibir/Ocultar malhas de colisão na tela (Atalho: Tecla C)">
          👁️ Colisões: ${this.showCollisions ? 'ON' : 'OFF'} <small class="key-pill">[C]</small>
        </button>
        <button type="button" id="btn-tool-trash" class="context-pill-btn ${this.toolMode === 'trash' ? 'active' : ''}" title="Inserir e posicionar lixos coletáveis (Camada 2)">
          ♻️ Lixo Coletável
        </button>
        <button type="button" id="btn-tool-enemy" class="context-pill-btn btn-tool-enemy ${this.toolMode === 'enemies' ? 'active' : ''}" title="Posicionar e configurar spawners de inimigos (Sprint 9)">
          💀 Posicionar Inimigo
        </button>
        <button type="button" id="btn-tool-sprite" class="context-pill-btn ${this.toolMode === 'sprites' ? 'active' : ''}" title="Posicionar sprites e imagens">
          🖼️ Imagem / Sprite
        </button>
        <button type="button" id="btn-upload-sprite-fast" class="context-pill-btn btn-primary" title="Carregar PNG/JPG do Computador">
          📁 Upload Imagem
        </button>

        ${
          this.toolMode === 'enemies'
            ? `
        <div class="context-enemy-selector">
          <span class="context-label" style="color:#f87171;">Tipo Atual:</span>
          <button type="button" id="btn-cycle-enemy-type-quick" class="enemy-type-quick-btn" title="Alternar tipo de inimigo (Atalho: Tecla T)">
            ${currEnemyDef.icon} ${currEnemyDef.label} <small class="key-pill">[T]</small>
          </button>
        </div>
        `
            : ''
        }
      </div>

      <div class="context-help">
        💡 <b>Atalhos Sprint 14:</b> [P] Colisão Poligonal • [C] Ver Colisões • [Ctrl+Arrastar] Vértices • [Enter/2x Clique] Fechar • [ESC] Cancelar • [ALT] Livre 1px
      </div>
    `;

    const btnHitbox = bar.querySelector('#btn-tool-hitbox');
    if (btnHitbox) {
      btnHitbox.addEventListener('click', () => {
        this.setToolMode('collisions');
      });
    }

    const btnPolygon = bar.querySelector('#btn-tool-polygon');
    if (btnPolygon) {
      btnPolygon.addEventListener('click', () => {
        this.setToolMode('polygon');
      });
    }

    const btnShowCollisions = bar.querySelector('#btn-toggle-show-collisions');
    if (btnShowCollisions) {
      btnShowCollisions.addEventListener('click', () => {
        this.toggleShowCollisions();
      });
    }

    const btnTrash = bar.querySelector('#btn-tool-trash');
    if (btnTrash) {
      btnTrash.addEventListener('click', () => {
        this.toolMode = 'trash';
        this.setActiveLayer(2); // Garante camada 2 para lixos
        this._updateContextBar();
      });
    }

    const btnEnemy = bar.querySelector('#btn-tool-enemy');
    if (btnEnemy) {
      btnEnemy.addEventListener('click', () => {
        this.toolMode = 'enemies';
        this.setActiveLayer(2); // Garante Camada 2: Objetos/Entidades
        this._updateContextBar();
        this.game.ui.showToast(`💀 Ferramenta "Posicionar Inimigo" ativa! Clique no mapa para posicionar. Pressione [T] para alternar tipo.`, 2200);
      });
    }

    const btnQuickType = bar.querySelector('#btn-cycle-enemy-type-quick');
    if (btnQuickType) {
      btnQuickType.addEventListener('click', () => {
        this.cycleEnemyType();
      });
    }

    const btnSprite = bar.querySelector('#btn-tool-sprite');
    if (btnSprite) {
      btnSprite.addEventListener('click', () => {
        this.toolMode = 'sprites';
        this._updateContextBar();
      });
    }

    const btnUpload = bar.querySelector('#btn-upload-sprite-fast');
    if (btnUpload) {
      btnUpload.addEventListener('click', () => {
        const fileInp = this.domContainer.querySelector('#editor-file-input');
        if (fileInp) fileInp.click();
      });
    }
  }

  /* =========================================================================
   * FERRAMENTA DE COLISÃO POLIGONAL & MENU DE CONTEXTO (SPRINT 14)
   * ========================================================================= */

  setToolMode(mode) {
    this.toolMode = mode;
    if (mode === 'collisions' || mode === 'polygon' || mode === 'trash' || mode === 'enemies') {
      this.setActiveLayer(2);
    }
    if (mode !== 'polygon' && this.isDrawingPolygon) {
      this.cancelPolygon();
    }
    this._updateContextBar();
    if (mode === 'polygon') {
      this.game.ui.showToast('🔷 Ferramenta "Colisão Poligonal" ativa! Clique para marcar vértices. [Enter] ou 2x clique fecha.', 2800);
    }
  }

  toggleShowCollisions() {
    this.showCollisions = !this.showCollisions;
    this._updateContextBar();
    this.game.ui.showToast(`👁️ Visualização de Colisões: ${this.showCollisions ? 'ATIVADA' : 'DESATIVADA'} [Tecla C]`, 1500);
  }

  finishPolygon() {
    if (!this.polygonPoints || this.polygonPoints.length < 3) {
      this.game.ui.showToast('⚠️ O polígono precisa de pelo menos 3 vértices para ser fechado.', 2000);
      return;
    }

    const map = this.game.currentMap;
    if (!map) return;
    this.ensureMapLayers(map);

    if (this.history) this.history.commit(null, 'Criar Colisão Poligonal');

    const pts = this.polygonPoints.map(p => ({ x: Math.round(p.x), y: Math.round(p.y) }));
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of pts) {
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    }

    const polyObj = {
      type: 'obstacle',
      id: `poly_obs_${Date.now().toString(36)}_${Math.random().toString(36).slice(-3)}`,
      layer: 2,
      label: 'COLISÃO POLIGONAL',
      collisionType: 'solid', // 'solid' | 'trigger' | 'overhead'
      isTrigger: false,
      isOverhead: false,
      polygon: pts,
      x: Math.round(minX),
      y: Math.round(minY),
      w: Math.max(1, Math.round(maxX - minX)),
      h: Math.max(1, Math.round(maxY - minY)),
      rotation: 0
    };

    map.layers[2].items.push(polyObj);
    this.syncLayerReferences(map);
    this.selectItem(polyObj, 'obstacle');

    this.polygonPoints = [];
    this.isDrawingPolygon = false;
    this._renderPropertiesDock();
    this.game.ui.showToast('✅ Colisão poligonal criada com sucesso!', 1800);
  }

  cancelPolygon() {
    this.polygonPoints = [];
    this.isDrawingPolygon = false;
    this.game.ui.showToast('❌ Criação de polígono cancelada.', 1400);
  }

  _recalculatePolygonBounds(poly) {
    if (!poly || !Array.isArray(poly.polygon) || poly.polygon.length === 0) return;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of poly.polygon) {
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    }
    poly.x = minX;
    poly.y = minY;
    poly.w = Math.max(1, maxX - minX);
    poly.h = Math.max(1, maxY - minY);
  }

  _hitTestPolygonVertex(poly, wx, wy, screenThreshold = 12) {
    if (!poly || !Array.isArray(poly.polygon)) return -1;
    const threshold = screenThreshold / this.zoom;
    for (let i = 0; i < poly.polygon.length; i++) {
      const pt = poly.polygon[i];
      if (Math.hypot(wx - pt.x, wy - pt.y) <= threshold) {
        return i;
      }
    }
    return -1;
  }

  _findPolygonVertexUnderMouse(wx, wy) {
    const map = this.game.currentMap;
    if (!map) return null;
    this.ensureMapLayers(map);
    const layer = map.layers[2];
    if (layer && Array.isArray(layer.items)) {
      if (this.selectedItem && this.selectedItem.polygon) {
        const vIdx = this._hitTestPolygonVertex(this.selectedItem, wx, wy);
        if (vIdx !== -1) {
          return { polygon: this.selectedItem, vertexIndex: vIdx };
        }
      }
      for (let i = layer.items.length - 1; i >= 0; i--) {
        const item = layer.items[i];
        if (item.polygon && Array.isArray(item.polygon)) {
          const vIdx = this._hitTestPolygonVertex(item, wx, wy);
          if (vIdx !== -1) {
            return { polygon: item, vertexIndex: vIdx };
          }
        }
      }
    }
    return null;
  }

  _findPolygonAtWorld(wx, wy) {
    const map = this.game.currentMap;
    if (!map) return null;
    this.ensureMapLayers(map);
    const layer = map.layers[2];
    if (layer && Array.isArray(layer.items)) {
      for (let i = layer.items.length - 1; i >= 0; i--) {
        const item = layer.items[i];
        if (item.polygon && Array.isArray(item.polygon) && item.polygon.length >= 3) {
          if (this._isPointInPolygon(wx, wy, item.polygon)) {
            return item;
          }
        }
      }
    }
    return null;
  }

  _isPointInPolygon(px, py, vertices) {
    let inside = false;
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
      const xi = vertices[i].x, yi = vertices[i].y;
      const xj = vertices[j].x, yj = vertices[j].y;
      const intersect = ((yi > py) !== (yj > py)) &&
        (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  _showContextMenu(clientX, clientY, item = null) {
    let menu = this.domContainer.querySelector('#editor-context-menu');
    if (!menu) {
      menu = document.createElement('div');
      menu.id = 'editor-context-menu';
      menu.className = 'editor-context-menu';
      this.domContainer.appendChild(menu);
    }

    this.contextMenuItem = item;
    const wPos = this.screenToWorld(clientX, clientY);
    this.contextMenuWorldPos = wPos;

    const isPoly = item && Boolean(item.polygon && Array.isArray(item.polygon));
    const currType = item ? (item.collisionType || (item.isTrigger ? 'trigger' : item.isOverhead ? 'overhead' : 'solid')) : null;
    const isOverhead = item && (item.isOverhead || currType === 'overhead');
    const isTrigger = item && (item.isTrigger || currType === 'trigger');

    menu.innerHTML = `
      <div class="context-menu-header">
        <span class="context-menu-title">${
          item
            ? (isPoly ? '🔷 POLÍGONO' : item.type === 'animation_marker' ? '🎬 ANIMAÇÃO' : '🧱 ITEM SELECIONADO')
            : '📍 MENU DE DESIGN'
        }</span>
        <small class="context-menu-id">${item ? (item.label || item.id || 'Item') : `X: ${Math.round(wPos.x)} | Y: ${Math.round(wPos.y)}`}</small>
      </div>
      <div class="context-menu-divider"></div>

      <!-- 4 OPÇÕES PRINCIPAIS DO SPRINT 13 (REQUISITO 1) -->
      <button type="button" class="context-menu-item ${isOverhead ? 'active' : ''}" data-action="action-overhead">
        <span class="menu-icon">🪜</span> <strong>"Por Cima" (Overhead)</strong>
        ${isOverhead ? '<span class="menu-check">✓</span>' : ''}
      </button>

      <button type="button" class="context-menu-item ${isTrigger ? 'active' : ''}" data-action="action-trigger">
        <span class="menu-icon">⚡</span> <strong>"Trigger" (Zona Interativa)</strong>
        ${isTrigger ? '<span class="menu-check">✓</span>' : ''}
      </button>

      <button type="button" class="context-menu-item" data-action="action-animation">
        <span class="menu-icon">🎬</span> <strong>"Animação" (Marcador IA)</strong>
      </button>

      <button type="button" class="context-menu-item" data-action="action-scenes">
        <span class="menu-icon">🗺️</span> <strong>"Modificação de Cenário"</strong>
      </button>

      ${item ? `
      <div class="context-menu-divider"></div>
      <button type="button" class="context-menu-item ${currType === 'solid' ? 'active' : ''}" data-action="set-solid">
        <span class="menu-icon">🧱</span> Parede Sólida (Colisão Normal)
        ${currType === 'solid' ? '<span class="menu-check">✓</span>' : ''}
      </button>
      ${isPoly ? `
      <button type="button" class="context-menu-item" data-action="edit-vertices">
        <span class="menu-icon">✏️</span> Editar Vértices (Segurar CTRL)
      </button>
      ` : ''}
      <button type="button" class="context-menu-item" data-action="duplicate">
        <span class="menu-icon">📋</span> Duplicar
      </button>
      <button type="button" class="context-menu-item item-danger" data-action="delete">
        <span class="menu-icon">🗑️</span> Excluir [Del]
      </button>
      ` : ''}
    `;

    menu.style.display = 'block';
    menu.classList.remove('hidden');
    const menuRect = menu.getBoundingClientRect();
    let left = clientX;
    let top = clientY;
    if (left + menuRect.width > window.innerWidth) left = window.innerWidth - menuRect.width - 10;
    if (top + menuRect.height > window.innerHeight) top = window.innerHeight - menuRect.height - 10;
    menu.style.left = `${Math.max(10, left)}px`;
    menu.style.top = `${Math.max(10, top)}px`;

    menu.querySelectorAll('.context-menu-item').forEach((btn) => {
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const action = btn.getAttribute('data-action');
        this._handleContextMenuAction(action, item, wPos);
        this._hideContextMenu();
      });
    });
  }

  _hideContextMenu() {
    const menu = this.domContainer.querySelector('#editor-context-menu');
    if (menu) {
      menu.classList.add('hidden');
      menu.style.display = 'none';
    }
    this.contextMenuItem = null;
  }

  _handleContextMenuAction(action, item, wPos) {
    const pos = wPos || (item ? { x: item.x, y: item.y } : { x: this.camFocusX, y: this.camFocusY });

    if (action === 'action-overhead' || action === 'set-overhead') {
      if (item) {
        if (this.history) this.history.commit(null, 'Definir Zona Por Cima');
        item.collisionType = 'overhead';
        item.isTrigger = false;
        item.isOverhead = true;
        item.label = item.polygon ? 'POLÍGONO POR CIMA' : (item.label && item.label !== 'COLISÃO' ? item.label : 'POR CIMA');
        this.game.ui.showToast('🪜 Definido como Zona "Por Cima" (Z-Index Superior ao Jogador)');
      } else {
        const map = this.game.currentMap;
        if (!map) return;
        this.ensureMapLayers(map);
        if (this.history) this.history.commit(null, 'Criar Zona Por Cima');
        const newItem = {
          id: `overhead_${Date.now().toString(36).slice(-4)}`,
          type: 'obstacle',
          collisionType: 'overhead',
          isOverhead: true,
          isTrigger: false,
          x: Math.round(pos.x - 48),
          y: Math.round(pos.y - 32),
          w: 96,
          h: 64,
          label: 'ZONA POR CIMA',
          layer: 2
        };
        map.layers[2].items.push(newItem);
        this.selectItem(newItem, 'obstacle');
        this.game.ui.showToast('🪜 Nova Zona "Por Cima" criada no mapa!');
      }
    } else if (action === 'action-trigger' || action === 'set-trigger') {
      if (item) {
        item.collisionType = 'trigger';
        item.isTrigger = true;
        item.isOverhead = false;
        item.label = item.polygon ? 'TRIGGER POLIGONAL' : (item.label && item.label !== 'COLISÃO' ? item.label : 'TRIGGER');
        this._openTriggerModal(item);
      } else {
        const map = this.game.currentMap;
        if (!map) return;
        this.ensureMapLayers(map);
        if (this.history) this.history.commit(null, 'Criar Zona Trigger');
        const newTrigger = {
          id: `trigger_${Date.now().toString(36).slice(-4)}`,
          type: 'obstacle',
          collisionType: 'trigger',
          isTrigger: true,
          isOverhead: false,
          x: Math.round(pos.x - 40),
          y: Math.round(pos.y - 40),
          w: 80,
          h: 80,
          label: 'TRIGGER',
          ai_instruction: '',
          layer: 2
        };
        map.layers[2].items.push(newTrigger);
        this.selectItem(newTrigger, 'obstacle');
        this._openTriggerModal(newTrigger);
      }
    } else if (action === 'action-animation') {
      this._openAnimationModal(pos, item && item.type === 'animation_marker' ? item : null);
    } else if (action === 'action-scenes') {
      this._openSceneModal();
    } else if (action === 'set-solid') {
      if (!item) return;
      if (this.history) this.history.commit(null, 'Definir Colisão Sólida');
      item.collisionType = 'solid';
      item.isTrigger = false;
      item.isOverhead = false;
      item.label = item.polygon ? 'COLISÃO POLIGONAL SÓLIDA' : (item.label || 'PAREDE SÓLIDA');
      this.game.ui.showToast('🧱 Definido como Parede Sólida');
    } else if (action === 'edit-vertices') {
      if (!item) return;
      this.selectItem(item, 'obstacle');
      this.game.ui.showToast('💡 Segure CTRL e passe o mouse no mapa para arrastar vértices individuais!', 3000);
    } else if (action === 'duplicate') {
      if (!item) return;
      this.selectItem(item, item.type || 'obstacle');
      this.duplicateSelectedItem();
    } else if (action === 'delete') {
      if (!item) return;
      this.selectItem(item, item.type || 'obstacle');
      this.deleteSelectedItem();
    }

    if (this.game.currentMap) this.syncLayerReferences(this.game.currentMap);
    this._renderPropertiesDock();
    this.forceRender();
  }

  _onCanvasDblClick(e) {
    if (!this.active) return;
    if (this.isDrawingPolygon && this.polygonPoints.length >= 3) {
      e.preventDefault();
      const pts = this.polygonPoints;
      if (pts.length >= 4) {
        const last = pts[pts.length - 1];
        const prev = pts[pts.length - 2];
        if (Math.hypot(last.x - prev.x, last.y - prev.y) < 14) {
          pts.pop();
        }
      }
      this.finishPolygon();
    }
  }

  _onCanvasContextMenu(e) {
    if (!this.active) return;
    e.preventDefault();
    if (this.suppressContextMenu) {
      this.suppressContextMenu = false;
      return;
    }
    const wPos = this.screenToWorld(e.clientX, e.clientY);
    const hit = this._pickItemAtWorld(wPos.x, wPos.y);
    if (hit) {
      this.selectItem(hit.item, hit.type);
      this._showContextMenu(e.clientX, e.clientY, hit.item);
    } else {
      this._showContextMenu(e.clientX, e.clientY, null);
    }
  }

  _drawPolygonDrawingPreview(ctx) {
    if (!this.isDrawingPolygon || !this.polygonPoints.length) return;
    const pts = this.polygonPoints;
    const cur = this.polygonCurrentWorld || this.mouseWorld;

    ctx.save();

    // 1. Área preenchida semitransparente em tempo real
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.lineTo(cur.x, cur.y);
    ctx.closePath();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.16)';
    ctx.fill();

    // 2. Arestas já confirmadas
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5 / this.zoom;
    ctx.stroke();

    // 3. Linha elástica até o cursor (próxima aresta)
    const last = pts[pts.length - 1];
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(cur.x, cur.y);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2 / this.zoom;
    ctx.setLineDash([6 / this.zoom, 4 / this.zoom]);
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. Marcadores de vértices confirmados
    const vRadius = 5 / this.zoom;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, vRadius, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? '#4ade80' : '#38bdf8';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5 / this.zoom;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(9, 10 / this.zoom)}px Consolas, monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(`${i + 1}`, p.x, p.y - 8 / this.zoom);
    }

    // 5. Destaque do 1º vértice (Alvo para fechar)
    const first = pts[0];
    const distToFirst = Math.hypot(cur.x - first.x, cur.y - first.y);
    const closeThreshold = 14 / this.zoom;
    const canClose = pts.length >= 3;

    ctx.beginPath();
    ctx.arc(first.x, first.y, (distToFirst <= closeThreshold && canClose ? 14 : 9) / this.zoom, 0, Math.PI * 2);
    ctx.strokeStyle = canClose ? '#4ade80' : '#94a3b8';
    ctx.lineWidth = 2 / this.zoom;
    ctx.stroke();

    if (distToFirst <= closeThreshold && canClose) {
      ctx.fillStyle = '#4ade80';
      ctx.font = `bold ${Math.max(10, 11 / this.zoom)}px Consolas, monospace`;
      ctx.textAlign = 'center';
      ctx.fillText('Clique para Fechar [Enter]', first.x, first.y - 18 / this.zoom);
    }

    ctx.restore();
  }

  _drawPolygonVertexHandles(ctx, poly) {
    if (!poly || !Array.isArray(poly.polygon)) return;
    ctx.save();
    const handleSize = 9 / this.zoom;
    const halfH = handleSize / 2;

    for (let i = 0; i < poly.polygon.length; i++) {
      const pt = poly.polygon[i];
      const isHovered = this.hoveredVertexIndex === i && this.hoveredPolygon === poly;
      ctx.fillStyle = isHovered ? '#38bdf8' : '#ffffff';
      ctx.strokeStyle = isHovered ? '#0284c7' : '#ef4444';
      ctx.lineWidth = 1.8 / this.zoom;
      ctx.fillRect(pt.x - halfH, pt.y - halfH, handleSize, handleSize);
      ctx.strokeRect(pt.x - halfH, pt.y - halfH, handleSize, handleSize);
    }
    ctx.restore();
  }

  /* =========================================================================
   * ADIÇÃO E MANIPULAÇÃO DE ENTIDADES NAS CAMADAS
   * ========================================================================= */

  addObstacleAt(x, y, w = 160, h = 80, label = 'COLISÃO') {
    const map = this.game.currentMap;
    if (!map) return;
    this.ensureMapLayers(map);

    // Commit no histórico antes da inserção (Sprint 11 - Requisito 2)
    if (this.history) this.history.commit(null, 'Adicionar Colisão');

    // Colisões pertencem primordialmente à Camada 2: Objetos/Colisão
    const layer = map.layers[2];
    const newObs = {
      type: 'obstacle',
      id: `${map.id}_obs_${Date.now().toString(36).slice(-4)}_${layer.items.length + 1}`,
      layer: 2,
      x: this.snap(x),
      y: this.snap(y),
      w: Math.max(12, Math.round(w)),
      h: Math.max(12, Math.round(h)),
      rotation: 0,
      label
    };

    layer.items.push(newObs);
    this.syncLayerReferences(map);
    this.selectItem(newObs, 'obstacle');
    this.game.ui.showToast(`Colisão inserida na Camada 2 [${newObs.w}x${newObs.h}px]!`);
  }

  addTrashAt(worldX, worldY, typeIdx = null) {
    const map = this.game.currentMap;
    if (!map) return;
    this.ensureMapLayers(map);

    // Commit no histórico antes da inserção (Sprint 11 - Requisito 2)
    if (this.history) this.history.commit(null, 'Adicionar Lixo');

    const layer = map.layers[2]; // Camada 2: Objetos/Colisão
    const finalTypeIdx = typeIdx !== null ? typeIdx : this.currentTrashTypeIndex;
    const newTrash = {
      type: 'trash',
      layer: 2,
      id: `${map.id}_trash_${Date.now().toString(36).slice(-4)}_${layer.items.length + 1}`,
      x: this.snap(worldX),
      y: this.snap(worldY),
      typeIndex: finalTypeIdx,
      rotation: 0
    };

    layer.items.push(newTrash);
    this.syncLayerReferences(map);
    this.syncTrashWithGame();
    this.selectItem(newTrash, 'trash');
    this.game.ui.showToast(`Lixo inserido na Camada 2!`);
  }

  /**
   * Instancia um nó de EnemySpawner nas coordenadas do mouse (Sprint 9 - Requisitos 1 e 2)
   */
  addEnemySpawnerAt(worldX, worldY, type = null, isAltHeld = false) {
    const map = this.game.currentMap;
    if (!map) return;
    this.ensureMapLayers(map);

    // Commit no histórico antes da inserção (Sprint 11 - Requisito 2)
    if (this.history) this.history.commit(null, 'Adicionar Inimigo');

    const layer = map.layers[2]; // Camada 2: Objetos/Colisão e Entidades
    const enemyType = type || this.currentEnemyType || 'scratcher';
    const typeDef = this.getEnemyTypeDef(enemyType);

    const finalX = this.snap(worldX, isAltHeld);
    const finalY = this.snap(worldY, isAltHeld);

    const newEnemy = {
      type: 'enemy',
      layer: 2,
      id: `${map.id}_spawner_${enemyType}_${Date.now().toString(36).slice(-4)}_${layer.items.length + 1}`,
      enemyType: enemyType,
      label: typeDef.label,
      x: finalX,
      y: finalY,
      radius: 26,
      rotation: 0
    };

    layer.items.push(newEnemy);
    this.syncLayerReferences(map);
    this.selectItem(newEnemy, 'enemy');
    this.game.ui.showToast(`👾 Spawner de Inimigo inserido: ${typeDef.icon} ${typeDef.label} [Pressione T para alternar tipo]`, 2400);
  }

  /**
   * Circula entre os tipos de inimigos registrados no banco de dados do jogo (Sprint 9 - Requisito 3)
   */
  cycleEnemyType(targetItem = null) {
    const item = targetItem || (this.selectedItem && this.selectedItem.type === 'enemy' ? this.selectedItem : null);

    if (item) {
      if (this.history) this.history.commit(null, 'Alterar Tipo de Inimigo');

      const currentId = item.enemyType || 'scratcher';
      const currIdx = this.ENEMY_TYPES.findIndex((t) => t.id === currentId);
      const nextIdx = (currIdx + 1) % this.ENEMY_TYPES.length;
      const nextDef = this.ENEMY_TYPES[nextIdx];

      item.enemyType = nextDef.id;
      item.label = nextDef.label;

      if (this.game.currentMap) {
        this.syncLayerReferences(this.game.currentMap);
      }

      this._renderPropertiesDock();
      this.game.ui.showToast(`🔄 Tipo do Inimigo: ${nextDef.icon} ${nextDef.label} (${nextDef.id}) [T]`, 2000);
    } else {
      // Se não houver inimigo selecionado, circula o tipo padrão para o próximo spawner
      const currIdx = this.ENEMY_TYPES.findIndex((t) => t.id === this.currentEnemyType);
      const nextIdx = (currIdx + 1) % this.ENEMY_TYPES.length;
      const nextDef = this.ENEMY_TYPES[nextIdx];
      this.currentEnemyType = nextDef.id;
      this._updateContextBar();
      this.game.ui.showToast(`🎯 Ferramenta Inimigo: Novo tipo padrão: ${nextDef.icon} ${nextDef.label} [T]`, 1800);
    }
  }

  addVisualSprite(src, label = 'Imagem', w = 256, h = 256) {
    const map = this.game.currentMap;
    if (!map) return;
    this.ensureMapLayers(map);

    // Commit no histórico antes da inserção (Sprint 11 - Requisito 2)
    if (this.history) this.history.commit(null, 'Adicionar Imagem');

    // Insere na camada ATIVA no momento
    const layer = map.layers[this.activeLayerIndex];
    const img = new Image();
    img.src = src;

    const newSprite = {
      type: 'sprite',
      id: `sprite_${Date.now()}`,
      layer: this.activeLayerIndex,
      label,
      x: this.snap(this.camFocusX - w / 2),
      y: this.snap(this.camFocusY - h / 2),
      w,
      h,
      rotation: 0,
      opacity: 1.0,
      src,
      _img: img
    };

    layer.items.push(newSprite);
    this.syncLayerReferences(map);
    this.selectItem(newSprite, 'sprite');
    this.game.ui.showToast(`Imagem adicionada à Camada ${this.activeLayerIndex}: ${layer.name}!`);
  }

  _handleFileUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      const img = new Image();
      img.onload = () => {
        const aspect = img.naturalWidth / (img.naturalHeight || 1);
        let defaultW = Math.min(640, Math.max(64, img.naturalWidth));
        let defaultH = Math.round(defaultW / aspect);
        this.addVisualSprite(dataUrl, file.name, defaultW, defaultH);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  /* =========================================================================
   * SELEÇÃO E PROPRIEDADES (INSPECTOR)
   * ========================================================================= */

  selectItem(item, type) {
    this.selectedItem = item;
    this.selectedType = type;
    this._renderPropertiesDock();
  }

  deselectItem() {
    this.selectedItem = null;
    this.selectedType = null;
    const dock = this.domContainer.querySelector('#editor-properties-dock');
    if (dock) dock.classList.add('hidden');
  }

  deleteSelectedItem() {
    if (!this.selectedItem || !this.game.currentMap) return;

    // Commit no histórico antes da exclusão (Sprint 11 - Requisito 2)
    if (this.history) this.history.commit(null, 'Excluir Item');

    const map = this.game.currentMap;
    this.ensureMapLayers(map);

    const layerIdx = this.selectedItem.layer !== undefined ? this.selectedItem.layer : this.activeLayerIndex;
    const layer = map.layers[layerIdx];
    if (layer && Array.isArray(layer.items)) {
      const idx = layer.items.indexOf(this.selectedItem);
      if (idx !== -1) {
        layer.items.splice(idx, 1);
        this.syncLayerReferences(map);
        if (this.selectedType === 'trash') {
          this.syncTrashWithGame();
        }
        this.game.ui.showToast('Item excluído da camada.');
      }
    }

    this.deselectItem();
  }

  duplicateSelectedItem() {
    if (!this.selectedItem || !this.game.currentMap) return;

    // Commit no histórico antes da duplicação (Sprint 11 - Requisito 2)
    if (this.history) this.history.commit(null, 'Duplicar Item');

    const map = this.game.currentMap;
    this.ensureMapLayers(map);

    const layerIdx = this.selectedItem.layer !== undefined ? this.selectedItem.layer : this.activeLayerIndex;
    const layer = map.layers[layerIdx];
    if (!layer || !Array.isArray(layer.items)) return;

    const offset = this.snapGrid > 0 ? this.snapGrid : 16;
    const clone = {
      ...this.selectedItem,
      id: `${this.selectedItem.id || 'item'}_copy_${Date.now().toString(36).slice(-3)}`,
      x: this.selectedItem.x + offset,
      y: this.selectedItem.y + offset,
      label: `${this.selectedItem.label || 'Item'} (Cópia)`
    };

    if (this.selectedItem.polygon && Array.isArray(this.selectedItem.polygon)) {
      clone.polygon = this.selectedItem.polygon.map((p) => ({
        x: p.x + offset,
        y: p.y + offset
      }));
    }

    if (this.selectedItem._img) {
      clone._img = this.selectedItem._img;
    }

    layer.items.push(clone);
    this.syncLayerReferences(map);
    if (this.selectedType === 'trash') {
      this.syncTrashWithGame();
    }

    this.selectItem(clone, this.selectedType);
    this.game.ui.showToast('Item duplicado!');
  }

  _renderPropertiesDock() {
    const dock = this.domContainer.querySelector('#editor-properties-dock');
    const title = this.domContainer.querySelector('#prop-item-title');
    const fields = this.domContainer.querySelector('#properties-dock-fields');
    const zIndText = this.domContainer.querySelector('#prop-zindex-indicator');
    const rotBadge = this.domContainer.querySelector('#prop-rotation-indicator');
    if (!dock || !this.selectedItem || !this.game.currentMap) return;

    dock.classList.remove('hidden');

    const item = this.selectedItem;
    const layerIdx = item.layer !== undefined ? item.layer : this.activeLayerIndex;
    const layer = this.game.currentMap.layers[layerIdx];
    const layerDef = this.LAYER_DEFS[layerIdx] || this.LAYER_DEFS[0];

    // Atualiza indicadores de Z-Index e Rotação
    if (layer && Array.isArray(layer.items)) {
      const idx = layer.items.indexOf(item);
      if (zIndText) zIndText.textContent = `Z: ${idx + 1}/${layer.items.length}`;
    }
    if (rotBadge) {
      rotBadge.textContent = `${item.rotation || 0}°`;
    }

    // Camada dropdown para poder transferir o item de camada
    const layerOptions = this.LAYER_DEFS.map(
      (ld) => `<option value="${ld.id}" ${ld.id === layerIdx ? 'selected' : ''}>Camada ${ld.id}: ${ld.name}</option>`
    ).join('');

    title.innerHTML = `
      <span style="color:${layerDef.color}">●</span> 
      ${item.label || item.id || item.type.toUpperCase()}
    `;

    fields.innerHTML = `
      <div class="prop-field-row">
        <label>Camada do Item:</label>
        <select id="prop-select-layer">${layerOptions}</select>
      </div>

      ${
        item.type === 'enemy'
          ? `
      <div class="prop-field-row">
        <label>Tipo de Inimigo [Tecla T]:</label>
        <div style="display:flex; gap:6px;">
          <select id="prop-select-enemy-type" style="flex:1;">
            ${this.ENEMY_TYPES.map(
              (et) => `<option value="${et.id}" ${et.id === item.enemyType ? 'selected' : ''}>${et.icon} ${et.label}</option>`
            ).join('')}
          </select>
          <button type="button" id="btn-prop-cycle-type" class="stardew-btn btn-secondary btn-xs" title="Alternar para o Próximo Tipo (Tecla T)">
            🔄 [T]
          </button>
        </div>
        <small style="color:#38bdf8; font-size:0.72rem; margin-top:2px;">${this.getEnemyTypeDef(item.enemyType).desc}</small>
      </div>
      `
          : ''
      }

      ${
        item.polygon && Array.isArray(item.polygon)
          ? `
      <div class="prop-field-row">
        <label>Tipo de Zona (Contexto):</label>
        <select id="prop-select-collision-type">
          <option value="solid" ${(!item.collisionType || item.collisionType === 'solid') ? 'selected' : ''}>🧱 Parede Sólida (Colisão)</option>
          <option value="trigger" ${(item.collisionType === 'trigger' || item.isTrigger) ? 'selected' : ''}>⚡ Trigger Poligonal (Zona)</option>
          <option value="overhead" ${(item.collisionType === 'overhead' || item.isOverhead) ? 'selected' : ''}>🪜 Zona "Por Cima" (Passável)</option>
        </select>
      </div>
      <div class="prop-field-row">
        <label>Vértices:</label>
        <span class="prop-zindex-text">${item.polygon.length} pontos definidos</span>
      </div>
      <div class="prop-field-row" style="margin-top:4px;">
        <small style="color:#38bdf8; font-size:0.73rem; line-height:1.4;">
          💡 <b>Ajuste de Vértices:</b> Segure <b>CTRL</b> e passe o mouse no mapa para clicar e arrastar os pontos. Segure <b>ALT</b> para ajuste milimétrico (1px).
        </small>
      </div>
      `
          : ''
      }

      <div class="prop-field-row">
        <label>Nome / Rótulo:</label>
        <input type="text" id="prop-input-label" value="${item.label || item.id || ''}" />
      </div>

      <div class="prop-field-grid">
        <div class="prop-field-col">
          <label>X (px):</label>
          <input type="number" id="prop-input-x" value="${Math.round(item.x)}" step="${this.snapGrid || 1}" />
        </div>
        <div class="prop-field-col">
          <label>Y (px):</label>
          <input type="number" id="prop-input-y" value="${Math.round(item.y)}" step="${this.snapGrid || 1}" />
        </div>
        ${
          item.w !== undefined
            ? `
        <div class="prop-field-col">
          <label>Largura (W):</label>
          <input type="number" id="prop-input-w" value="${Math.round(item.w)}" min="8" step="${this.snapGrid || 1}" />
        </div>
        <div class="prop-field-col">
          <label>Altura (H):</label>
          <input type="number" id="prop-input-h" value="${Math.round(item.h)}" min="8" step="${this.snapGrid || 1}" />
        </div>
        `
            : ''
        }
      </div>

      <div class="prop-field-row">
        <label>Rotação (0, 90, 180, 270):</label>
        <input type="number" id="prop-input-rotation" value="${item.rotation || 0}" step="90" min="0" max="360" />
      </div>

      ${
        item.opacity !== undefined
          ? `
      <div class="prop-field-row">
        <label>Opacidade: <span id="prop-opacity-val">${Math.round((item.opacity || 1) * 100)}%</span></label>
        <input type="range" id="prop-range-opacity" min="0.1" max="1" step="0.05" value="${item.opacity || 1}" />
      </div>
      `
          : ''
      }
    `;

    // Subcampos específicos de IA e Animações (Sprint 13)
    if (item.type === 'animation_marker' || item.isAnimationMarker) {
      const animDiv = document.createElement('div');
      animDiv.className = 'prop-field-row';
      animDiv.innerHTML = `
        <label>🎬 Instrução da Animação (IA):</label>
        <div style="font-size:0.8rem; color:#fef08a; background:#020617; padding:6px 8px; border-radius:4px; border:1px solid rgba(250,204,21,0.3); word-break:break-word;">
          ${item.ai_instruction || '<i>Nenhuma instrução definida</i>'}
        </div>
        <button type="button" id="btn-prop-edit-anim" class="stardew-btn btn-primary btn-xs" style="margin-top:6px;">
          ✏️ Editar Descrição da Animação
        </button>
      `;
      fields.insertBefore(animDiv, fields.firstChild);
      const btnEditAnim = animDiv.querySelector('#btn-prop-edit-anim');
      if (btnEditAnim) {
        btnEditAnim.addEventListener('click', () => {
          this._openAnimationModal({ x: item.x, y: item.y }, item);
        });
      }
    } else if (item.isTrigger || item.collisionType === 'trigger') {
      const trigDiv = document.createElement('div');
      trigDiv.className = 'prop-field-row';
      trigDiv.innerHTML = `
        <label>⚡ Instrução do Trigger (IA):</label>
        <div style="font-size:0.8rem; color:#93c5fd; background:#020617; padding:6px 8px; border-radius:4px; border:1px solid rgba(59,130,246,0.3); word-break:break-word;">
          ${item.ai_instruction || '<i>Nenhuma instrução definida</i>'}
        </div>
        <button type="button" id="btn-prop-edit-trigger" class="stardew-btn btn-primary btn-xs" style="margin-top:6px;">
          ✏️ Editar Instrução para IA
        </button>
      `;
      fields.insertBefore(trigDiv, fields.firstChild);
      const btnEditTrig = trigDiv.querySelector('#btn-prop-edit-trigger');
      if (btnEditTrig) {
        btnEditTrig.addEventListener('click', () => {
          this._openTriggerModal(item);
        });
      }
    } else if (item.isOverhead || item.collisionType === 'overhead') {
      const overDiv = document.createElement('div');
      overDiv.className = 'prop-field-row';
      overDiv.innerHTML = `
        <div style="font-size:0.76rem; color:#d8b4fe; background:rgba(168,85,247,0.18); padding:6px 8px; border-radius:4px; border:1px solid rgba(168,85,247,0.4);">
          🪜 <b>ZONA "POR CIMA":</b> Personagens passam por baixo. Renderizado com Z-Index superior ao jogador.
        </div>
      `;
      fields.insertBefore(overDiv, fields.firstChild);
    }

    // Bindings de inputs
    const bindInp = (id, fn) => {
      const el = fields.querySelector(id);
      if (el) el.addEventListener('input', fn);
    };

    const selEnemyType = fields.querySelector('#prop-select-enemy-type');
    if (selEnemyType) {
      selEnemyType.addEventListener('change', () => {
        if (this.history) this.history.commit(null, 'Alterar Tipo de Inimigo');
        const newTypeId = selEnemyType.value;
        const typeDef = this.getEnemyTypeDef(newTypeId);
        item.enemyType = newTypeId;
        item.label = typeDef.label;
        if (this.game.currentMap) this.syncLayerReferences(this.game.currentMap);
        this._renderPropertiesDock();
        this.game.ui.showToast(`Tipo de inimigo atualizado: ${typeDef.icon} ${typeDef.label}`);
      });
    }

    const btnPropCycle = fields.querySelector('#btn-prop-cycle-type');
    if (btnPropCycle) {
      btnPropCycle.addEventListener('click', () => {
        this.cycleEnemyType(item);
      });
    }

    const selectCollType = fields.querySelector('#prop-select-collision-type');
    if (selectCollType) {
      selectCollType.addEventListener('change', (e) => {
        this._handleContextMenuAction(`set-${e.target.value}`, item);
      });
    }

    // Registra snapshot ao focar campos e grava no histórico se houver alteração ao mudar/perder foco (Sprint 11 - Requisito 2)
    fields.addEventListener('focusin', () => {
      this._dockEditPreSnapshot = this.getMapStateSnapshot();
    });
    fields.addEventListener('change', (e) => {
      if (e.target && (e.target.id === 'prop-select-enemy-type' || e.target.id === 'prop-select-layer')) {
        return; // Gerenciados por seus próprios manipuladores
      }
      if (this._dockEditPreSnapshot && this.history) {
        this.history.commit(this._dockEditPreSnapshot, 'Alterar Propriedade');
      }
      this._dockEditPreSnapshot = this.getMapStateSnapshot();
    });

    bindInp('#prop-input-label', (e) => {
      item.label = e.target.value;
      if (item.id && this.selectedType === 'trash') item.id = e.target.value;
      if (item.id && this.selectedType === 'enemy') {
        if (this.game.currentMap) this.syncLayerReferences(this.game.currentMap);
      }
    });

    bindInp('#prop-input-x', (e) => {
      item.x = parseInt(e.target.value, 10) || 0;
      if (this.selectedType === 'trash') this.syncTrashWithGame();
      if (this.selectedType === 'enemy' && this.game.currentMap) this.syncLayerReferences(this.game.currentMap);
    });

    bindInp('#prop-input-y', (e) => {
      item.y = parseInt(e.target.value, 10) || 0;
      if (this.selectedType === 'trash') this.syncTrashWithGame();
      if (this.selectedType === 'enemy' && this.game.currentMap) this.syncLayerReferences(this.game.currentMap);
    });

    bindInp('#prop-input-w', (e) => {
      item.w = Math.max(8, parseInt(e.target.value, 10) || 8);
    });

    bindInp('#prop-input-h', (e) => {
      item.h = Math.max(8, parseInt(e.target.value, 10) || 8);
    });

    bindInp('#prop-input-rotation', (e) => {
      item.rotation = parseInt(e.target.value, 10) || 0;
      if (rotBadge) rotBadge.textContent = `${item.rotation}°`;
      if (this.selectedType === 'trash') this.syncTrashWithGame();
    });

    const rngOp = fields.querySelector('#prop-range-opacity');
    const opVal = fields.querySelector('#prop-opacity-val');
    if (rngOp) {
      rngOp.addEventListener('input', () => {
        item.opacity = parseFloat(rngOp.value) || 1.0;
        if (opVal) opVal.textContent = `${Math.round(item.opacity * 100)}%`;
      });
    }

    const selLayer = fields.querySelector('#prop-select-layer');
    if (selLayer) {
      selLayer.addEventListener('change', () => {
        const targetLayerIdx = parseInt(selLayer.value, 10);
        this._moveItemToLayer(item, targetLayerIdx);
      });
    }
  }

  _moveItemToLayer(item, targetLayerIdx) {
    const map = this.game.currentMap;
    if (!map) return;
    this.ensureMapLayers(map);

    const oldLayerIdx = item.layer !== undefined ? item.layer : this.activeLayerIndex;
    if (oldLayerIdx === targetLayerIdx) return;

    const oldLayer = map.layers[oldLayerIdx];
    const newLayer = map.layers[targetLayerIdx];

    if (oldLayer && newLayer) {
      const idx = oldLayer.items.indexOf(item);
      if (idx !== -1) {
        if (this.history) this.history.commit(null, 'Mover para Camada');
        oldLayer.items.splice(idx, 1);
        item.layer = targetLayerIdx;
        newLayer.items.push(item);
        this.syncLayerReferences(map);
        this.setActiveLayer(targetLayerIdx);
        this._renderPropertiesDock();
        this.game.ui.showToast(`Item transferido para Camada ${targetLayerIdx}: ${newLayer.name}`);
      }
    }
  }

  /* =========================================================================
   * EVENTOS DE MOUSE NO CANVAS (PAN, RESIZE, DRAG, DRAW)
   * ========================================================================= */

  _onCanvasMouseDown(e) {
    if (!this.active) return;

    if (e.button === 1) {
      e.preventDefault();
      this.isPanning = true;
      this.panStartMouse = { x: e.clientX, y: e.clientY };
      this.panStartCam = { x: this.camFocusX, y: this.camFocusY };
      return;
    }

    if (e.button === 2) {
      const wPos = this.screenToWorld(e.clientX, e.clientY);
      const hit = this._pickItemAtWorld(wPos.x, wPos.y);
      if (!hit) {
        this.isPanning = true;
        this.panStartMouse = { x: e.clientX, y: e.clientY };
        this.panStartCam = { x: this.camFocusX, y: this.camFocusY };
      }
      return;
    }

    if (e.button !== 0) return;

    this._hideContextMenu();
    const wPos = this.screenToWorld(e.clientX, e.clientY);

    // 0. Edição de Vértice com CTRL pressionado (Sprint 14 - Requisito 4)
    if (e.ctrlKey) {
      const vHit = this._findPolygonVertexUnderMouse(wPos.x, wPos.y);
      if (vHit) {
        this.preDragSnapshot = this.getMapStateSnapshot();
        this.isDraggingVertex = true;
        this.vertexDragPolygon = vHit.polygon;
        this.vertexDragIndex = vHit.vertexIndex;
        this.selectItem(vHit.polygon, 'obstacle');
        return;
      }
    }

    // 0.1 Ferramenta de Colisão Poligonal ativa (Sprint 14 - Requisito 1)
    if (this.toolMode === 'polygon' && this.activeLayerIndex === 2) {
      const snapX = this.snap(wPos.x, e.altKey || e.shiftKey);
      const snapY = this.snap(wPos.y, e.altKey || e.shiftKey);

      if (this.polygonPoints.length === 0) {
        this.deselectItem();
        this.isDrawingPolygon = true;
        this.polygonPoints.push({ x: snapX, y: snapY });
        this.polygonCurrentWorld = { x: snapX, y: snapY };
        this.game.ui.showToast('🔷 Vértice 1 criado! Clique para adicionar pontos. Clique no 1º vértice ou [Enter] fecha.', 2400);
        return;
      } else {
        const firstPt = this.polygonPoints[0];
        const dist = Math.hypot(wPos.x - firstPt.x, wPos.y - firstPt.y);
        const closeThreshold = 14 / this.zoom;
        if (this.polygonPoints.length >= 3 && dist <= closeThreshold) {
          this.finishPolygon();
          return;
        }

        this.polygonPoints.push({ x: snapX, y: snapY });
        this.polygonCurrentWorld = { x: snapX, y: snapY };
        return;
      }
    }

    // 1. Verifica alças de redimensionamento do item selecionado
    if (this.selectedItem && (this.selectedItem.w !== undefined && this.selectedItem.h !== undefined)) {
      const handle = this._hitTestResizeHandles(this.selectedItem, e.clientX, e.clientY);
      if (handle) {
        this.preDragSnapshot = this.getMapStateSnapshot();
        this.isResizing = true;
        this.resizeHandle = handle;
        this.resizeStartBox = {
          x: this.selectedItem.x,
          y: this.selectedItem.y,
          w: this.selectedItem.w,
          h: this.selectedItem.h
        };
        this.resizeStartMouseWorld = { ...wPos };
        return;
      }
    }

    // 2. Pick do item sob o mouse (priorizando a camada ativa)
    const hit = this._pickItemAtWorld(wPos.x, wPos.y);

    if (hit) {
      this.selectItem(hit.item, hit.type);
      this.preDragSnapshot = this.getMapStateSnapshot();
      this.isDraggingItem = true;
      this.dragItemOffset = {
        x: wPos.x - hit.item.x,
        y: wPos.y - hit.item.y
      };
      return;
    }

    // 3. Clique em espaço livre de acordo com a ferramenta
    if (this.toolMode === 'collisions' && this.activeLayerIndex === 2) {
      // Inicia desenho de nova caixa de colisão
      this.deselectItem();
      this.isDrawingNewObstacle = true;
      const snapX = this.snap(wPos.x, e.altKey || e.shiftKey);
      const snapY = this.snap(wPos.y, e.altKey || e.shiftKey);
      this.drawStartWorld = { x: snapX, y: snapY };
      this.drawCurrentWorld = { ...this.drawStartWorld };
    } else if (this.toolMode === 'trash') {
      this.addTrashAt(wPos.x, wPos.y);
    } else if (this.toolMode === 'enemies') {
      this.addEnemySpawnerAt(wPos.x, wPos.y, null, e.altKey || e.shiftKey);
    } else {
      this.deselectItem();
    }
  }

  _onCanvasMouseMove(e) {
    if (!this.active) return;

    this.mouseScreen = { x: e.clientX, y: e.clientY };
    this.mouseWorld = this.screenToWorld(e.clientX, e.clientY);
    this.isAltHeld = Boolean(e.altKey || e.shiftKey);

    const coordsEl = this.domContainer.querySelector('#editor-coords-display');
    if (coordsEl) {
      coordsEl.textContent = `X: ${Math.round(this.mouseWorld.x)} | Y: ${Math.round(this.mouseWorld.y)}`;
    }

    // Pan
    if (this.isPanning) {
      const dxScreen = e.clientX - this.panStartMouse.x;
      const dyScreen = e.clientY - this.panStartMouse.y;
      this.camFocusX = this.panStartCam.x - dxScreen / this.zoom;
      this.camFocusY = this.panStartCam.y - dyScreen / this.zoom;
      return;
    }

    // Redimensionamento
    if (this.isResizing && this.selectedItem) {
      this._applyResizeDrag(this.mouseWorld.x, this.mouseWorld.y, e.altKey || e.shiftKey);
      this._renderPropertiesDock();
      return;
    }

    // Arrasto de Vértice Individual de Polígono (Sprint 14 - Requisito 4)
    if (this.isDraggingVertex && this.vertexDragPolygon) {
      const snapX = this.snap(this.mouseWorld.x, e.altKey || e.shiftKey);
      const snapY = this.snap(this.mouseWorld.y, e.altKey || e.shiftKey);
      this.vertexDragPolygon.polygon[this.vertexDragIndex].x = snapX;
      this.vertexDragPolygon.polygon[this.vertexDragIndex].y = snapY;
      this._recalculatePolygonBounds(this.vertexDragPolygon);
      this._renderPropertiesDock();
      return;
    }

    // Linha elástica em tempo real da colisão poligonal (Sprint 14 - Requisito 1)
    if (this.isDrawingPolygon && this.polygonPoints.length > 0) {
      this.polygonCurrentWorld = {
        x: this.snap(this.mouseWorld.x, e.altKey || e.shiftKey),
        y: this.snap(this.mouseWorld.y, e.altKey || e.shiftKey)
      };
    }

    // Detecção de hover sobre vértices quando CTRL está pressionado (Sprint 14 - Requisito 4)
    if (e.ctrlKey) {
      const vHit = this._findPolygonVertexUnderMouse(this.mouseWorld.x, this.mouseWorld.y);
      if (vHit) {
        this.hoveredPolygon = vHit.polygon;
        this.hoveredVertexIndex = vHit.vertexIndex;
      } else {
        this.hoveredVertexIndex = -1;
        this.hoveredPolygon = this._findPolygonAtWorld(this.mouseWorld.x, this.mouseWorld.y);
      }
    } else {
      this.hoveredVertexIndex = -1;
      this.hoveredPolygon = null;
    }

    // Arrasto do Item (com Snap padrão ou Pixel-Perfect ao segurar ALT)
    if (this.isDraggingItem && this.selectedItem) {
      const rawX = this.mouseWorld.x - this.dragItemOffset.x;
      const rawY = this.mouseWorld.y - this.dragItemOffset.y;
      const finalX = this.snap(rawX, e.altKey || e.shiftKey);
      const finalY = this.snap(rawY, e.altKey || e.shiftKey);

      const dx = finalX - this.selectedItem.x;
      const dy = finalY - this.selectedItem.y;

      if (this.selectedItem.polygon && Array.isArray(this.selectedItem.polygon)) {
        for (const pt of this.selectedItem.polygon) {
          pt.x += dx;
          pt.y += dy;
        }
      }

      this.selectedItem.x = finalX;
      this.selectedItem.y = finalY;

      if (this.selectedType === 'trash') {
        this.syncTrashWithGame();
      } else if (this.selectedType === 'enemy') {
        if (this.game.currentMap) this.syncLayerReferences(this.game.currentMap);
      }
      this._renderPropertiesDock();
      return;
    }

    // Desenho de nova colisão
    if (this.isDrawingNewObstacle) {
      this.drawCurrentWorld = {
        x: this.snap(this.mouseWorld.x, e.altKey || e.shiftKey),
        y: this.snap(this.mouseWorld.y, e.altKey || e.shiftKey)
      };
      return;
    }

    this._updateCursor(e.clientX, e.clientY);
  }

  _onCanvasMouseUp(e) {
    if (!this.active) return;

    if (e.button === 2 && this.isPanning) {
      this.isPanning = false;
      if (this.panStartMouse) {
        const dist = Math.hypot(e.clientX - this.panStartMouse.x, e.clientY - this.panStartMouse.y);
        if (dist > 5) {
          this.suppressContextMenu = true;
        }
      }
      return;
    }

    if (this.isPanning) this.isPanning = false;

    if (this.isDraggingVertex) {
      this.isDraggingVertex = false;
      this.vertexDragPolygon = null;
      this.vertexDragIndex = -1;
      if (this.preDragSnapshot && this.history) {
        this.history.commit(this.preDragSnapshot, 'Ajustar Vértice de Polígono');
        this.preDragSnapshot = null;
      }
      return;
    }

    // Se estava arrastando ou redimensionando, grava no histórico apenas no mouseup (Sprint 11 - Requisito 2)
    if (this.preDragSnapshot && this.selectedItem) {
      const wasResizing = this.isResizing;
      const wasDragging = this.isDraggingItem;
      if (wasResizing || wasDragging) {
        let originalItem = null;
        if (Array.isArray(this.preDragSnapshot.layers)) {
          for (const l of this.preDragSnapshot.layers) {
            originalItem = l.items.find((it) => it.id === this.selectedItem.id);
            if (originalItem) break;
          }
        }
        const changed = originalItem && (
          originalItem.x !== this.selectedItem.x ||
          originalItem.y !== this.selectedItem.y ||
          originalItem.w !== this.selectedItem.w ||
          originalItem.h !== this.selectedItem.h
        );
        if (changed && this.history) {
          this.history.commit(this.preDragSnapshot, wasResizing ? 'Redimensionar Item' : 'Mover Item');
        }
      }
      this.preDragSnapshot = null;
    }

    if (this.isResizing) {
      this.isResizing = false;
      this.resizeHandle = null;
    }
    if (this.isDraggingItem) this.isDraggingItem = false;

    if (this.isDrawingNewObstacle) {
      this.isDrawingNewObstacle = false;
      const x1 = Math.min(this.drawStartWorld.x, this.drawCurrentWorld.x);
      const y1 = Math.min(this.drawStartWorld.y, this.drawCurrentWorld.y);
      const w = Math.abs(this.drawCurrentWorld.x - this.drawStartWorld.x);
      const h = Math.abs(this.drawCurrentWorld.y - this.drawStartWorld.y);

      if (w >= 12 && h >= 12) {
        this.addObstacleAt(x1, y1, w, h);
      }
    }
  }

  _onCanvasWheel(e) {
    if (!this.active) return;
    e.preventDefault();

    const zoomFactor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
    const oldZoom = this.zoom;
    const newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom * zoomFactor));

    if (oldZoom !== newZoom) {
      const mouseWorldBefore = this.screenToWorld(e.clientX, e.clientY);
      this.zoom = newZoom;
      const mouseWorldAfter = this.screenToWorld(e.clientX, e.clientY);

      this.camFocusX += mouseWorldBefore.x - mouseWorldAfter.x;
      this.camFocusY += mouseWorldBefore.y - mouseWorldAfter.y;
      this._updateZoomDisplay();
    }
  }

  /* =========================================================================
   * HIT-TEST E REDIMENSIONAMENTO MATEMÁTICO (8 ALÇAS)
   * ========================================================================= */

  _hitTestResizeHandles(item, screenMouseX, screenMouseY) {
    const handles = this._getHandleScreenCoordinates(item);
    const radius = 9;

    for (const [key, pt] of Object.entries(handles)) {
      const dist = Math.hypot(screenMouseX - pt.x, screenMouseY - pt.y);
      if (dist <= radius) {
        return key;
      }
    }
    return null;
  }

  _getHandleScreenCoordinates(item) {
    const cx = item.x + item.w / 2;
    const cy = item.y + item.h / 2;
    const rad = ((item.rotation || 0) * Math.PI) / 180;

    const localPts = {
      nw: { x: -item.w / 2, y: -item.h / 2 },
      n: { x: 0, y: -item.h / 2 },
      ne: { x: item.w / 2, y: -item.h / 2 },
      e: { x: item.w / 2, y: 0 },
      se: { x: item.w / 2, y: item.h / 2 },
      s: { x: 0, y: item.h / 2 },
      sw: { x: -item.w / 2, y: item.h / 2 },
      w: { x: -item.w / 2, y: 0 }
    };

    const screenPts = {};
    for (const [key, pt] of Object.entries(localPts)) {
      const rx = pt.x * Math.cos(rad) - pt.y * Math.sin(rad) + cx;
      const ry = pt.x * Math.sin(rad) + pt.y * Math.cos(rad) + cy;
      screenPts[key] = this.worldToScreen(rx, ry);
    }

    return screenPts;
  }

  _applyResizeDrag(mouseWorldX, mouseWorldY, isAltHeld) {
    const b = this.resizeStartBox;
    const handle = this.resizeHandle;
    const snappedX = this.snap(mouseWorldX, isAltHeld);
    const snappedY = this.snap(mouseWorldY, isAltHeld);

    let newX = b.x;
    let newY = b.y;
    let newW = b.w;
    let newH = b.h;

    if (handle.includes('e')) newW = Math.max(10, snappedX - b.x);
    if (handle.includes('s')) newH = Math.max(10, snappedY - b.y);
    if (handle.includes('w')) {
      const right = b.x + b.w;
      newX = Math.min(right - 10, snappedX);
      newW = right - newX;
    }
    if (handle.includes('n')) {
      const bottom = b.y + b.h;
      newY = Math.min(bottom - 10, snappedY);
      newH = bottom - newY;
    }

    this.selectedItem.x = newX;
    this.selectedItem.y = newY;
    this.selectedItem.w = newW;
    this.selectedItem.h = newH;
  }

  _pickItemAtWorld(wx, wy) {
    const map = this.game.currentMap;
    if (!map) return null;
    this.ensureMapLayers(map);

    // Prioridade 1: Procura na camada ativa atual
    const activeLayer = map.layers[this.activeLayerIndex];
    if (activeLayer && Array.isArray(activeLayer.items)) {
      for (let i = activeLayer.items.length - 1; i >= 0; i--) {
        const item = activeLayer.items[i];
        if (this._isPointInsideItem(wx, wy, item)) {
          return { item, type: item.type || 'sprite' };
        }
      }
    }

    // Prioridade 2: Procura nas demais camadas de cima para baixo (3 até 0)
    for (let l = 3; l >= 0; l--) {
      if (l === this.activeLayerIndex) continue;
      const layer = map.layers[l];
      if (layer && Array.isArray(layer.items)) {
        for (let i = layer.items.length - 1; i >= 0; i--) {
          const item = layer.items[i];
          if (this._isPointInsideItem(wx, wy, item)) {
            return { item, type: item.type || 'sprite' };
          }
        }
      }
    }

    return null;
  }

  _isPointInsideItem(wx, wy, item) {
    if (item.polygon && Array.isArray(item.polygon) && item.polygon.length >= 3) {
      return this._isPointInPolygon(wx, wy, item.polygon);
    }

    if (item.type === 'trash') {
      return Math.hypot(wx - item.x, wy - item.y) <= 26;
    }

    if (item.type === 'enemy') {
      return Math.hypot(wx - item.x, wy - item.y) <= (item.radius || 26);
    }

    if (item.type === 'animation_marker' || item.isAnimationMarker) {
      return Math.hypot(wx - item.x, wy - item.y) <= 24;
    }

    if (item.w !== undefined && item.h !== undefined) {
      const cx = item.x + item.w / 2;
      const cy = item.y + item.h / 2;
      const rad = -(((item.rotation || 0) * Math.PI) / 180);

      // Ponto rotacionado para o espaço local do item
      const dx = wx - cx;
      const dy = wy - cy;
      const localX = dx * Math.cos(rad) - dy * Math.sin(rad);
      const localY = dx * Math.sin(rad) + dy * Math.cos(rad);

      return Math.abs(localX) <= item.w / 2 && Math.abs(localY) <= item.h / 2;
    }

    return false;
  }

  _updateCursor(clientX, clientY) {
    const canvas = this.game.canvas;
    if (this.isPanning) {
      canvas.style.cursor = 'grabbing';
      return;
    }

    if (this.selectedItem && this.selectedItem.w !== undefined) {
      const handle = this._hitTestResizeHandles(this.selectedItem, clientX, clientY);
      if (handle) {
        const map = {
          nw: 'nwse-resize',
          se: 'nwse-resize',
          ne: 'nesw-resize',
          sw: 'nesw-resize',
          n: 'ns-resize',
          s: 'ns-resize',
          e: 'ew-resize',
          w: 'ew-resize'
        };
        canvas.style.cursor = map[handle] || 'pointer';
        return;
      }
    }

    if (this.isDraggingVertex) {
      canvas.style.cursor = 'grabbing';
      return;
    }

    if (this.isCtrlHeld && this.hoveredVertexIndex !== -1) {
      canvas.style.cursor = 'grab';
      return;
    }

    if (this.toolMode === 'polygon' && this.activeLayerIndex === 2) {
      canvas.style.cursor = 'crosshair';
      return;
    }

    const hit = this._pickItemAtWorld(this.mouseWorld.x, this.mouseWorld.y);
    if (hit) {
      canvas.style.cursor = 'move';
    } else if (this.toolMode === 'collisions' && this.activeLayerIndex === 2) {
      canvas.style.cursor = 'crosshair';
    } else if (this.toolMode === 'enemies') {
      canvas.style.cursor = 'crosshair';
    } else {
      canvas.style.cursor = 'default';
    }
  }

  /* =========================================================================
   * RENDERIZAÇÃO NO CANVAS DO EDITOR
   * ========================================================================= */

  update(dt) {
    if (!this.active) return;
    const panSpeed = (520 / this.zoom) * dt;
    const keys = this.game.input.keysDown;
    if (keys.has('KeyA') || keys.has('ArrowLeft')) this.camFocusX -= panSpeed;
    if (keys.has('KeyD') || keys.has('ArrowRight')) this.camFocusX += panSpeed;
    if (keys.has('KeyW') || keys.has('ArrowUp')) this.camFocusY -= panSpeed;
    if (keys.has('KeyS') || keys.has('ArrowDown')) this.camFocusY += panSpeed;
  }

  renderCanvas(ctx) {
    if (!this.active || !this.game.currentMap) return;

    const map = this.game.currentMap;
    this.ensureMapLayers(map);

    // 1. Grade do Editor
    this._drawEditorGrid(ctx, map);

    // 2. Destaca visualmente a camada ativa e suas hitboxes
    this._drawLayerVisualIndicators(ctx, map);

    // 3. Pré-visualização de Retângulo em Desenho
    if (this.isDrawingNewObstacle) {
      this._drawNewObstaclePreview(ctx);
    }

    // 4. Pré-visualização de Colisão Poligonal em Desenho (Sprint 14)
    if (this.isDrawingPolygon) {
      this._drawPolygonDrawingPreview(ctx);
    }

    // 5. Destaque do Item Selecionado (com alças rotacionadas ou vértices de polígono)
    if (this.selectedItem) {
      this._drawSelectionHighlight(ctx, this.selectedItem);
    }

    // 6. Alças de vértices de polígonos quando CTRL estiver pressionado
    if (this.isCtrlHeld && this.hoveredPolygon && this.hoveredPolygon !== this.selectedItem) {
      this._drawPolygonVertexHandles(ctx, this.hoveredPolygon);
    }
  }

  _drawEditorGrid(ctx, map) {
    const step = this.snapEnabled && this.snapGrid > 0 ? this.snapGrid : 32;
    ctx.save();
    ctx.strokeStyle = this.isAltHeld ? 'rgba(74, 222, 128, 0.15)' : 'rgba(56, 189, 248, 0.08)';
    ctx.lineWidth = 1;

    ctx.beginPath();
    for (let x = 0; x <= map.width; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, map.height);
    }
    for (let y = 0; y <= map.height; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(map.width, y);
    }
    ctx.stroke();

    // Borda do mapa
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, map.width, map.height);
    ctx.restore();
  }

  _drawLayerVisualIndicators(ctx, map) {
    ctx.save();

    map.layers.forEach((layer, layerIdx) => {
      const isActive = layerIdx === this.activeLayerIndex;
      const def = this.LAYER_DEFS[layerIdx];

      layer.items.forEach((item, zIdx) => {
        const isSelected = this.selectedItem === item;

        // Destaque de Colisão Poligonal (Sprint 14 - Requisitos 2 e 3)
        if (item.polygon && Array.isArray(item.polygon) && item.polygon.length >= 3) {
          if (!this.showCollisions && !isSelected) return;

          const pts = item.polygon;
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) {
            ctx.lineTo(pts[i].x, pts[i].y);
          }
          ctx.closePath();

          const isSolid = !item.collisionType || item.collisionType === 'solid';
          const isTrigger = item.collisionType === 'trigger' || item.isTrigger;
          const isOverhead = item.collisionType === 'overhead' || item.isOverhead;

          let fillColor, strokeColor;
          if (isSelected) {
            fillColor = 'rgba(56, 189, 248, 0.45)';
            strokeColor = '#facc15';
          } else if (isTrigger) {
            fillColor = isActive ? 'rgba(59, 130, 246, 0.38)' : 'rgba(59, 130, 246, 0.18)';
            strokeColor = '#3b82f6';
          } else if (isOverhead) {
            fillColor = isActive ? 'rgba(168, 85, 247, 0.38)' : 'rgba(168, 85, 247, 0.18)';
            strokeColor = '#a855f7';
          } else {
            // Sólida (padrão)
            fillColor = isActive ? 'rgba(239, 68, 68, 0.38)' : 'rgba(239, 68, 68, 0.18)';
            strokeColor = '#ef4444';
          }

          ctx.fillStyle = fillColor;
          ctx.fill();

          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = isSelected ? 2.5 : 1.8;
          ctx.stroke();

          // Centroide para texto
          let cx = 0, cy = 0;
          for (const p of pts) { cx += p.x; cy += p.y; }
          cx /= pts.length;
          cy /= pts.length;

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px Consolas, monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const typeTag = isTrigger ? '⚡ TRIGGER' : isOverhead ? '🪜 POR CIMA' : '🧱 POLÍGONO';
          ctx.fillText(item.label || typeTag, cx, cy - 5);

          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.font = '9px Consolas, monospace';
          ctx.fillText(`[Z:${zIdx + 1}] (${pts.length} pts)`, cx, cy + 7);

          // Se estiver selecionado ou se CTRL estiver pressionado, desenha alças de vértices
          if (isSelected || (this.isCtrlHeld && this.hoveredPolygon === item)) {
            const handleSize = 9 / this.zoom;
            const halfH = handleSize / 2;
            for (let i = 0; i < pts.length; i++) {
              const p = pts[i];
              const isHovered = this.hoveredVertexIndex === i && (this.hoveredPolygon === item || isSelected);
              ctx.fillStyle = isHovered ? '#38bdf8' : '#ffffff';
              ctx.strokeStyle = isHovered ? '#0284c7' : '#0f172a';
              ctx.lineWidth = 1.8 / this.zoom;
              ctx.fillRect(p.x - halfH, p.y - halfH, handleSize, handleSize);
              ctx.strokeRect(p.x - halfH, p.y - halfH, handleSize, handleSize);
            }
          }

          ctx.restore();
        }

        // Destaque de Colisões Retangulares (Hitboxes)
        else if (item.type === 'obstacle' || (item.w && item.h && !item.src && !item.typeIndex)) {
          if (!this.showCollisions && !isSelected) return;
          const cx = item.x + item.w / 2;
          const cy = item.y + item.h / 2;
          const rad = ((item.rotation || 0) * Math.PI) / 180;

          ctx.save();
          ctx.translate(cx, cy);
          if (rad !== 0) ctx.rotate(rad);

          const isTrigger = item.collisionType === 'trigger' || item.isTrigger;
          const isOverhead = item.collisionType === 'overhead' || item.isOverhead;

          if (isTrigger) {
            ctx.fillStyle = isSelected ? 'rgba(59, 130, 246, 0.45)' : isActive ? 'rgba(59, 130, 246, 0.28)' : 'rgba(59, 130, 246, 0.14)';
            ctx.strokeStyle = isSelected ? '#facc15' : '#3b82f6';
          } else if (isOverhead) {
            ctx.fillStyle = isSelected ? 'rgba(168, 85, 247, 0.45)' : isActive ? 'rgba(168, 85, 247, 0.28)' : 'rgba(168, 85, 247, 0.14)';
            ctx.strokeStyle = isSelected ? '#facc15' : '#a855f7';
          } else {
            ctx.fillStyle = isSelected ? 'rgba(56, 189, 248, 0.45)' : isActive ? 'rgba(239, 68, 68, 0.28)' : 'rgba(239, 68, 68, 0.12)';
            ctx.strokeStyle = isSelected ? '#facc15' : isActive ? '#ef4444' : 'rgba(239, 68, 68, 0.4)';
          }

          ctx.fillRect(-item.w / 2, -item.h / 2, item.w, item.h);
          ctx.lineWidth = isSelected ? 2.5 : 1.5;
          if (isTrigger) ctx.setLineDash([5, 3]);
          ctx.strokeRect(-item.w / 2, -item.h / 2, item.w, item.h);
          ctx.setLineDash([]);

          // Texto
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px Consolas, monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const defaultLabel = isTrigger ? '⚡ TRIGGER' : isOverhead ? '🪜 POR CIMA' : 'COLISÃO';
          ctx.fillText(item.label || defaultLabel, 0, -4);

          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.font = '9px Consolas, monospace';
          if (isTrigger && item.ai_instruction) {
            const preview = item.ai_instruction.length > 20 ? item.ai_instruction.slice(0, 18) + '...' : item.ai_instruction;
            ctx.fillText(`"${preview}"`, 0, 8);
          } else {
            ctx.fillText(`[Z:${zIdx + 1}] ${Math.round(item.w)}x${Math.round(item.h)}`, 0, 8);
          }

          ctx.restore();
        }

        // Destaque de Lixos
        else if (item.type === 'trash') {
          ctx.beginPath();
          ctx.arc(item.x, item.y, 22, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? 'rgba(250, 204, 21, 0.45)' : 'rgba(74, 222, 128, 0.25)';
          ctx.fill();
          ctx.strokeStyle = isSelected ? '#facc15' : '#4ade80';
          ctx.lineWidth = isSelected ? 3 : 2;
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px Consolas, monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`Z:${zIdx + 1}`, item.x, item.y);
        }

        // Destaque de Marcadores de Animação (Sprint 13 - Requisito 2)
        else if (item.type === 'animation_marker' || item.isAnimationMarker) {
          ctx.save();
          // Círculo com halo
          ctx.beginPath();
          ctx.arc(item.x, item.y, 20, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? 'rgba(234, 179, 8, 0.45)' : 'rgba(56, 189, 248, 0.25)';
          ctx.fill();
          ctx.strokeStyle = isSelected ? '#facc15' : '#38bdf8';
          ctx.lineWidth = isSelected ? 3 : 2;
          ctx.stroke();

          // Ícone Claquete 🎬
          ctx.font = '20px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🎬', item.x, item.y);

          // Rótulo
          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 10px Consolas, monospace';
          ctx.fillText(item.label || 'ANIMAÇÃO', item.x, item.y - 24);

          // Preview da instrução
          if (item.ai_instruction) {
            const preview = item.ai_instruction.length > 24 ? item.ai_instruction.slice(0, 22) + '...' : item.ai_instruction;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.font = 'italic 9px Consolas, monospace';
            ctx.fillText(`"${preview}"`, item.x, item.y + 24);
          }
          ctx.restore();
        }

        // Destaque de Spawners de Inimigos (Requisitos 2 e 3 da Sprint 9)
        else if (item.type === 'enemy') {
          const typeDef = this.getEnemyTypeDef(item.enemyType || 'scratcher');
          const enemyColor = typeDef.color || '#ef4444';
          const radius = item.radius || 26;

          ctx.save();

          // 1. Área Circular de Alerta / Spawn
          ctx.beginPath();
          ctx.arc(item.x, item.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? 'rgba(239, 68, 68, 0.48)' : 'rgba(220, 38, 38, 0.25)';
          ctx.fill();

          // 2. Borda circular destacada com espessura
          ctx.strokeStyle = isSelected ? '#facc15' : enemyColor;
          ctx.lineWidth = isSelected ? 3.5 : 2.5;
          ctx.stroke();

          // 3. Mira tática de spawner (+ marcadores)
          ctx.strokeStyle = isSelected ? '#fef08a' : enemyColor;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(item.x - radius - 6, item.y);
          ctx.lineTo(item.x - radius + 6, item.y);
          ctx.moveTo(item.x + radius - 6, item.y);
          ctx.lineTo(item.x + radius + 6, item.y);
          ctx.moveTo(item.x, item.y - radius - 6);
          ctx.lineTo(item.x, item.y - radius + 6);
          ctx.moveTo(item.x, item.y + radius - 6);
          ctx.lineTo(item.x, item.y + radius + 6);
          ctx.stroke();

          // 4. Ícone Central de Caveira / Inimigo
          ctx.font = '22px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(typeDef.icon || '💀', item.x, item.y + 1);

          // 5. TEXTO FLUTUANTE LOGO ACIMA DO SPAWNER (Requisito 3)
          const labelText = `${typeDef.icon} ${typeDef.label}`;
          ctx.font = 'bold 11px Consolas, monospace';
          const textMetrics = ctx.measureText(labelText);
          const pillW = textMetrics.width + 16;
          const pillH = 18;
          const pillX = item.x - pillW / 2;
          const pillY = item.y - radius - 26;

          // Fundo estilizado do badge flutuante
          ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
          ctx.strokeStyle = isSelected ? '#facc15' : enemyColor;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(pillX, pillY, pillW, pillH, 4);
          } else {
            ctx.rect(pillX, pillY, pillW, pillH);
          }
          ctx.fill();
          ctx.stroke();

          // Texto do badge
          ctx.fillStyle = isSelected ? '#fde047' : '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(labelText, item.x, pillY + pillH / 2);

          // Sub-indicador Z-Index e ID
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.font = '9px Consolas, monospace';
          ctx.fillText(`[T] ${item.enemyType || 'scratcher'} • Z:${zIdx + 1}`, item.x, item.y + radius + 11);

          ctx.restore();
        }

        // Borda suave em Sprites de outras camadas para fácil identificação
        else if (item.type === 'sprite' && !isSelected) {
          const cx = item.x + item.w / 2;
          const cy = item.y + item.h / 2;
          const rad = ((item.rotation || 0) * Math.PI) / 180;

          ctx.save();
          ctx.translate(cx, cy);
          if (rad !== 0) ctx.rotate(rad);

          ctx.strokeStyle = isActive ? def.color : 'rgba(148, 163, 184, 0.25)';
          ctx.lineWidth = isActive ? 1.5 : 1;
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(-item.w / 2, -item.h / 2, item.w, item.h);
          ctx.restore();
        }
      });
    });

    ctx.restore();
  }

  _drawNewObstaclePreview(ctx) {
    const x = Math.min(this.drawStartWorld.x, this.drawCurrentWorld.x);
    const y = Math.min(this.drawStartWorld.y, this.drawCurrentWorld.y);
    const w = Math.abs(this.drawCurrentWorld.x - this.drawStartWorld.x);
    const h = Math.abs(this.drawCurrentWorld.y - this.drawStartWorld.y);

    ctx.save();
    ctx.fillStyle = 'rgba(74, 222, 128, 0.35)';
    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(x, y, w, h);
    ctx.setLineDash([]);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${w} x ${h} px`, x + w / 2, y + h / 2);
    ctx.restore();
  }

  _drawSelectionHighlight(ctx, item) {
    ctx.save();

    if (item.polygon && Array.isArray(item.polygon) && item.polygon.length >= 3) {
      ctx.beginPath();
      ctx.moveTo(item.polygon[0].x, item.polygon[0].y);
      for (let i = 1; i < item.polygon.length; i++) {
        ctx.lineTo(item.polygon[i].x, item.polygon[i].y);
      }
      ctx.closePath();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5 / this.zoom;
      ctx.stroke();

      const handleSize = 9 / this.zoom;
      const halfH = handleSize / 2;
      for (let i = 0; i < item.polygon.length; i++) {
        const p = item.polygon[i];
        const isHovered = this.hoveredVertexIndex === i;
        ctx.fillStyle = isHovered ? '#38bdf8' : '#ffffff';
        ctx.strokeStyle = isHovered ? '#0284c7' : '#0f172a';
        ctx.lineWidth = 1.8 / this.zoom;
        ctx.fillRect(p.x - halfH, p.y - halfH, handleSize, handleSize);
        ctx.strokeRect(p.x - halfH, p.y - halfH, handleSize, handleSize);
      }
      ctx.restore();
      return;
    }

    if (item.w !== undefined && item.h !== undefined) {
      const cx = item.x + item.w / 2;
      const cy = item.y + item.h / 2;
      const rad = ((item.rotation || 0) * Math.PI) / 180;

      ctx.translate(cx, cy);
      if (rad !== 0) ctx.rotate(rad);

      // Caixa de seleção destacada
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5 / this.zoom;
      ctx.strokeRect(-item.w / 2 - 2, -item.h / 2 - 2, item.w + 4, item.h + 4);

      // Alças de redimensionamento
      const handleSize = 10 / this.zoom;
      const halfH = handleSize / 2;
      const pts = [
        { x: -item.w / 2, y: -item.h / 2 },
        { x: 0, y: -item.h / 2 },
        { x: item.w / 2, y: -item.h / 2 },
        { x: item.w / 2, y: 0 },
        { x: item.w / 2, y: item.h / 2 },
        { x: 0, y: item.h / 2 },
        { x: -item.w / 2, y: item.h / 2 },
        { x: -item.w / 2, y: 0 }
      ];

      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2 / this.zoom;

      for (const p of pts) {
        ctx.fillRect(p.x - halfH, p.y - halfH, handleSize, handleSize);
        ctx.strokeRect(p.x - halfH, p.y - halfH, handleSize, handleSize);
      }
    } else if (item.type === 'trash') {
      ctx.beginPath();
      ctx.arc(item.x, item.y, 28, 0, Math.PI * 2);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3 / this.zoom;
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (item.type === 'enemy') {
      const radius = (item.radius || 26) + 6;
      ctx.beginPath();
      ctx.arc(item.x, item.y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3 / this.zoom;
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
  }

  /* =========================================================================
   * SINCRONIZAÇÃO E EXPORTAÇÃO (.JSON)
   * ========================================================================= */

  syncTrashWithGame() {
    const map = this.game.currentMap;
    if (!map || !Array.isArray(map.trashSpawns)) return;

    if (window.GlobalState && window.GlobalState.savedTrashLayouts) {
      window.GlobalState.savedTrashLayouts[map.id] = map.trashSpawns.map((t, idx) => ({
        id: t.id || `${map.id}_trash_${String(idx + 1).padStart(2, '0')}`,
        x: Math.round(t.x),
        y: Math.round(t.y),
        typeIndex: t.typeIndex !== undefined ? t.typeIndex : idx % 5,
        rotation: t.rotation !== undefined ? t.rotation : 0
      }));
      if (typeof window.GlobalState._persistSavedLayouts === 'function') {
        window.GlobalState._persistSavedLayouts();
      }
    }

    this.game._spawnFixedTrashForMap(map);
  }

  syncAllWithGame() {
    if (this.game.currentMap) {
      this.syncLayerReferences(this.game.currentMap);
      this.syncTrashWithGame();
    }
  }

  compileExportData() {
    const map = this.game.currentMap;
    if (!map) return {};
    this.ensureMapLayers(map);

    // Garante que a cena ativa esteja sincronizada
    if (map.scenes && map.scenes[map.currentScene]) {
      map.scenes[map.currentScene].layers = map.layers;
    }

    const formatLayers = (layers) =>
      (layers || []).map((layer) => ({
        id: layer.id,
        name: layer.name,
        itemsCount: layer.items.length,
        items: layer.items.map((item, idx) => {
          const base = {
            type: item.type || 'sprite',
            zIndex: idx,
            x: Math.round(item.x),
            y: Math.round(item.y),
            rotation: item.rotation || 0
          };

          if (item.w !== undefined) base.w = Math.round(item.w);
          if (item.h !== undefined) base.h = Math.round(item.h);
          if (item.label) base.label = item.label;
          if (item.id) base.id = item.id;
          if (item.typeIndex !== undefined) base.typeIndex = item.typeIndex;
          if (item.opacity !== undefined) base.opacity = item.opacity;
          if (item.src) base.src = item.src;
          if (item.enemyType) base.enemyType = item.enemyType;
          if (item.polygon && Array.isArray(item.polygon)) {
            base.polygon = item.polygon.map((p) => ({ x: Math.round(p.x), y: Math.round(p.y) }));
            base.collisionType = item.collisionType || 'solid';
          }
          if (item.collisionType) base.collisionType = item.collisionType;
          if (item.isTrigger || item.collisionType === 'trigger') base.isTrigger = true;
          if (item.isOverhead || item.collisionType === 'overhead') base.isOverhead = true;
          if (item.ai_instruction) base.ai_instruction = item.ai_instruction;
          if (item.isAnimationMarker || item.type === 'animation_marker') base.isAnimationMarker = true;

          return base;
        })
      }));

    // Cenas estruturadas completas (Sprint 13 - Requisito 3 & 4)
    const cleanScenes = (map.scenes || []).map((sc) => ({
      id: sc.id,
      name: sc.name,
      condition: sc.condition || '',
      layers: formatLayers(sc.layers)
    }));

    const cleanLayers = formatLayers(map.layers);

    // Arrays planos diretos para compatibilidade imediata (Sprint 17: Overhead estritamente filtrado)
    const cleanObstacles = (map.obstacles || [])
      .filter((o) => !o.isOverhead && o.collisionType !== 'overhead' && o.layer !== 3 && !o.isTrigger && o.collisionType !== 'trigger')
      .map((o) => {
        const res = {
          x: Math.round(o.x),
          y: Math.round(o.y),
          w: Math.round(o.w),
          h: Math.round(o.h),
          rotation: o.rotation || 0,
          label: o.label || 'COLISÃO'
        };
        if (o.id) res.id = o.id;
        if (o.polygon && Array.isArray(o.polygon)) {
          res.polygon = o.polygon.map((p) => ({ x: Math.round(p.x), y: Math.round(p.y) }));
        }
        if (o.collisionType) res.collisionType = o.collisionType;
        if (o.isTrigger || o.collisionType === 'trigger') res.isTrigger = true;
        if (o.ai_instruction) res.ai_instruction = o.ai_instruction;
        return res;
      });

    const cleanTrash = (map.trashSpawns || []).map((t, idx) => ({
      id: t.id || `${map.id}_trash_${String(idx + 1).padStart(2, '0')}`,
      x: Math.round(t.x),
      y: Math.round(t.y),
      typeIndex: t.typeIndex !== undefined ? t.typeIndex : idx % 5,
      rotation: t.rotation !== undefined ? t.rotation : 0
    }));

    // Camada de Entidades / Spawners de Inimigos (Requisito 1 da Sprint 9)
    const cleanEnemies = (map.enemySpawns || []).map((e, idx) => ({
      id: e.id || `enemy_${idx + 1}`,
      enemyType: e.enemyType || e.type || 'scratcher',
      type: e.enemyType || e.type || 'scratcher',
      label: e.label || this.getEnemyTypeDef(e.enemyType || e.type).label,
      x: Math.round(e.x),
      y: Math.round(e.y),
      layer: e.layer !== undefined ? e.layer : 2
    }));

    const cleanSprites = (map.visualSprites || []).map((s, idx) => {
      const res = {
        id: s.id || `sprite_${idx + 1}`,
        layer: s.layer !== undefined ? s.layer : 1,
        label: s.label || 'Sprite',
        x: Math.round(s.x),
        y: Math.round(s.y),
        w: Math.round(s.w),
        h: Math.round(s.h),
        rotation: s.rotation || 0,
        opacity: s.opacity !== undefined ? s.opacity : 1.0,
        src: s.src || ''
      };
      if (s.isOverhead || s.collisionType === 'overhead') res.isOverhead = true;
      if (s.ai_instruction) res.ai_instruction = s.ai_instruction;
      return res;
    });

    // Coleta metadados de zonas Por Cima, Triggers e Marcadores de Animação (Sprint 13)
    const overheadZones = [];
    const triggerZones = [];
    const animationMarkers = [];

    map.layers.forEach((l) => {
      l.items.forEach((it) => {
        if (it.isOverhead || it.collisionType === 'overhead') {
          overheadZones.push({
            id: it.id,
            x: Math.round(it.x),
            y: Math.round(it.y),
            w: it.w ? Math.round(it.w) : undefined,
            h: it.h ? Math.round(it.h) : undefined,
            polygon: it.polygon ? it.polygon.map((p) => ({ x: Math.round(p.x), y: Math.round(p.y) })) : undefined,
            label: it.label || 'Zona Por Cima'
          });
        }
        if (it.isTrigger || it.collisionType === 'trigger') {
          triggerZones.push({
            id: it.id,
            x: Math.round(it.x),
            y: Math.round(it.y),
            w: it.w ? Math.round(it.w) : undefined,
            h: it.h ? Math.round(it.h) : undefined,
            polygon: it.polygon ? it.polygon.map((p) => ({ x: Math.round(p.x), y: Math.round(p.y) })) : undefined,
            label: it.label || 'Trigger',
            ai_instruction: it.ai_instruction || ''
          });
        }
        if (it.type === 'animation_marker' || it.isAnimationMarker) {
          animationMarkers.push({
            id: it.id,
            x: Math.round(it.x),
            y: Math.round(it.y),
            label: it.label || 'Marcador de Animação',
            ai_instruction: it.ai_instruction || ''
          });
        }
      });
    });

    return {
      mapId: map.id,
      mapName: map.name || map.id,
      dimensions: {
        width: map.width,
        height: map.height
      },
      exportedAt: new Date().toISOString(),
      currentScene: map.currentScene || 0,
      scenes: cleanScenes,
      summary: {
        totalScenes: cleanScenes.length,
        totalLayers: cleanLayers.length,
        totalObstacles: cleanObstacles.length,
        totalTrashes: cleanTrash.length,
        totalEnemies: cleanEnemies.length,
        totalVisualSprites: cleanSprites.length,
        totalOverheadZones: overheadZones.length,
        totalTriggerZones: triggerZones.length,
        totalAnimationMarkers: animationMarkers.length
      },
      overheadZones,
      triggerZones,
      animationMarkers,
      layers: cleanLayers,
      obstacles: cleanObstacles,
      collisionBounds: cleanObstacles,
      trashSpawns: cleanTrash,
      enemies: cleanEnemies,
      enemySpawns: cleanEnemies,
      visualSprites: cleanSprites
    };
  }

  exportMapJSON() {
    const data = this.compileExportData();
    const jsonStr = JSON.stringify(data, null, 2);
    this.lastExportJson = jsonStr;
    this.lastExportFileName = `${data.mapId || 'mapa'}_exportado.json`;

    this.triggerFileDownload();

    const modal = this.domContainer.querySelector('#editor-export-modal');
    const textarea = this.domContainer.querySelector('#editor-export-textarea');
    const statObs = this.domContainer.querySelector('#export-stat-obstacles');
    const statTrash = this.domContainer.querySelector('#export-stat-trashes');
    const statEnemies = this.domContainer.querySelector('#export-stat-enemies');
    const statSpr = this.domContainer.querySelector('#export-stat-sprites');

    if (modal && textarea) {
      textarea.value = jsonStr;
      if (statObs) statObs.textContent = `🧱 ${data.summary.totalObstacles} Colisões`;
      if (statTrash) statTrash.textContent = `♻ ${data.summary.totalTrashes} Lixos`;
      if (statEnemies) statEnemies.textContent = `👾 ${data.summary.totalEnemies} Inimigos`;
      if (statSpr) statSpr.textContent = `🖼 ${data.summary.totalVisualSprites} Imagens`;

      modal.classList.remove('hidden');
    }

    this.game.ui.showToast('💾 Mapa exportado com sucesso! Arquivo baixado e código pronto.', 3000);
  }

  triggerFileDownload() {
    if (!this.lastExportJson) {
      const data = this.compileExportData();
      this.lastExportJson = JSON.stringify(data, null, 2);
      this.lastExportFileName = `${data.mapId || 'mapa'}_exportado.json`;
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
      console.error('Erro ao baixar arquivo JSON:', err);
    }
  }

  /**
   * Carrega dados do mapa a partir de JSON ou objeto e remonta collisionBounds (Sprint 17)
   */
  loadMapJSON(jsonInput, targetMap = null) {
    try {
      const data = typeof jsonInput === 'string' ? JSON.parse(jsonInput) : jsonInput;
      const map = targetMap || this.game.currentMap;
      if (!map || !data) return null;

      if (Array.isArray(data.layers)) {
        map.layers = data.layers;
      }
      if (data.scenes) map.scenes = data.scenes;
      if (data.interactiveStations) map.interactiveStations = data.interactiveStations;
      if (data.transitionZone) map.transitionZone = data.transitionZone;

      this.syncLayerReferences(map);
      return map;
    } catch (err) {
      console.error('Erro ao carregar JSON do mapa:', err);
      return null;
    }
  }

  copyExportTextToClipboard() {
    const textarea = this.domContainer.querySelector('#editor-export-textarea');
    if (!textarea) return;

    textarea.select();
    textarea.setSelectionRange(0, 999999);

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(textarea.value)
        .then(() => {
          this.game.ui.showToast('✅ JSON copiado para a Área de Transferência! Cole no chat.');
        })
        .catch(() => {
          document.execCommand('copy');
          this.game.ui.showToast('✅ JSON copiado com sucesso! Cole no chat.');
        });
    } else {
      document.execCommand('copy');
      this.game.ui.showToast('✅ JSON copiado com sucesso! Cole no chat.');
    }
  }
};
