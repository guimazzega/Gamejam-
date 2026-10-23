/**
 * js/editor.js
 * ============================================================================
 * DEV-ONLY MAP & SPRITE EDITOR (Atalho: [F2])
 * ============================================================================
 * Este módulo é 100% isolado do jogo final.
 * Para gerar a versão final do jogo sem o editor:
 *   1. Exporte o arquivo `js/maps.js` atualizado pelo botão "💾 Exportar maps.js"
 *   2. Remova a linha `<script src="js/editor.js"></script>` do `index.html`.
 *
 * Funcionalidades:
 * - Posicionar, mover, redimensionar, criar e excluir Obstáculos, Props Decorativos,
 *   Zonas de Piso, Estações da Safe Room, Zona de Extração, Spawns P1/P2 e Lixo Fixo.
 * - Drag & Drop de arquivos de imagem externos (.png, .jpg, .webp, .gif, .svg)
 *   diretamente sobre qualquer entidade no Canvas (P1, P2, Lixo, Obstáculo, Zona, etc.)
 *   ou em espaço vazio para criar um novo asset posicionado.
 * - Suporte duplo para Sprites: Base64 Data URL embutido OU caminho relativo (ex: assets/ img.png).
 * - Persistência automática em localStorage + Exportação completa de `js/maps.js`.
 */

(function () {
  const STORAGE_KEY = 'expedicao2d_editor_state_v1';

  class MapEditor {
    constructor(game) {
      this.game = game;
      this.canvas = game.canvas;
      this.isOpen = false;

      // Ferramenta ativa: 'select' | 'add_obstacle' | 'add_prop' | 'add_floor' | 'add_station' | 'add_trash'
      this.activeTool = 'select';
      this.snapSize = 16; // 0 = livre, 8, 16, 32, 64

      // Modo de armazenamento preferido ao soltar imagens: 'dataurl' | 'path'
      this.preferredSpriteStorage = 'dataurl';
      this.assetsFolderPrefix = 'assets/';

      // Biblioteca de sprites carregados via Drag & Drop na sessão
      // Cada item: { id, name, dataUrl, relativePath }
      this.spriteLibrary = [];

      // Entidade atualmente selecionada:
      // { kind: 'obstacle'|'floorZone'|'station'|'transitionZone'|'spawnP1'|'spawnP2'|'player1'|'player2'|'trash'|'map', ref, index }
      this.selected = null;

      // Entidade sob o cursor (para feedback visual e Drag & Drop de arquivos)
      this.hovered = null;
      this.isFileDragOverCanvas = false;

      // Estado de interação do mouse no Canvas
      this.dragState = null; // { mode: 'move'|'resize'|'create'|'pan', handle, startMouse, startWorld, origBox, ... }
      this.mouseScreen = { x: 0, y: 0 };
      this.mouseWorld = { x: 0, y: 0 };
      this.isSpaceHeld = false;

      this._injectStyles();
      this._buildUI();
      this._bindEvents();
      this._hookIntoGame();
      this._loadFromLocalStorage();
    }

    // =========================================================================
    // INTEGRAÇÃO COM O LOOP DO JOGO
    // =========================================================================
    _hookIntoGame() {
      this.game.onRenderWorldOverlay = (ctx, map) => {
        if (!this.isOpen && !this.isFileDragOverCanvas) return;
        this._renderWorldOverlay(ctx, map);
      };

      this.game.onRenderScreenOverlay = (ctx, map) => {
        if (!this.isOpen && !this.isFileDragOverCanvas) return;
        this._renderScreenOverlay(ctx, map);
      };
    }

    toggleEditor(forceState) {
      this.isOpen = typeof forceState === 'boolean' ? forceState : !this.isOpen;

      // Se estava no Menu Principal e abriu o editor, inicia no mapa para permitir edição imediata
      if (this.isOpen && this.game.appState === 'MAIN_MENU') {
        this.game.startNewGame();
      } else if (this.isOpen && this.game.appState === 'PAUSED') {
        this.game.togglePause(false);
      }

      this.game.editorFreezeGameplay = this.isOpen;
      if (!this.isOpen) {
        this.game.editorFreeCamera = false;
        this.dragState = null;
      } else {
        // Sincroniza itens de lixo customizados do mapa atual para edição
        this._ensureCustomTrashArray(this.game.currentMap);
      }

      this.rootEl.classList.toggle('hidden', !this.isOpen);
      this.togglePillBtn.classList.toggle('active', this.isOpen);
      this._syncToolbarUI();
      this._renderInspector();
    }

    _ensureCustomTrashArray(map) {
      if (!map) return;
      if (!Array.isArray(map.customTrash)) {
        map.customTrash = [];
      }
    }

    // =========================================================================
    // CONVERSÃO DE COORDENADAS & HIT-TESTING DE TODAS AS ENTIDADES
    // =========================================================================
    screenToWorld(sx, sy) {
      return {
        x: Math.round(sx + this.game.camera.x),
        y: Math.round(sy + this.game.camera.y)
      };
    }

    snap(val) {
      if (!this.snapSize || this.snapSize <= 1) return Math.round(val);
      return Math.round(val / this.snapSize) * this.snapSize;
    }

    /**
     * Retorna o retângulo delimitador (bounding box) no mundo para qualquer descritor de entidade
     */
    getEntityBox(descriptor) {
      if (!descriptor || !descriptor.ref) return null;
      const { kind, ref } = descriptor;

      if (kind === 'obstacle' || kind === 'floorZone' || kind === 'station' || kind === 'transitionZone') {
        return { x: ref.x, y: ref.y, w: ref.w, h: ref.h };
      }
      if (kind === 'spawnP1' || kind === 'spawnP2') {
        return { x: ref.x - 26, y: ref.y - 26, w: 52, h: 52 };
      }
      if (kind === 'player1' || kind === 'player2') {
        const half = (ref.size || 40) / 2;
        return { x: ref.x - half, y: ref.y - half, w: ref.size || 40, h: ref.size || 40 };
      }
      if (kind === 'trash') {
        const sz = ref.size || 26;
        return { x: ref.x - sz / 2, y: ref.y - sz / 2, w: sz, h: sz };
      }
      return null;
    }

    /**
     * Encontra a entidade mais prioritária sob o ponto (wx, wy) do mundo
     */
    hitTestWorld(wx, wy) {
      const map = this.game.currentMap;
      if (!map) return null;

      // 1. Jogadores P1 e P2
      for (const p of [this.game.p2, this.game.p1]) {
        const desc = { kind: p.id === 1 ? 'player1' : 'player2', ref: p, label: p.name };
        if (this._pointInBox(wx, wy, this.getEntityBox(desc))) return desc;
      }

      // 2. Itens de Lixo / Sucata no chão
      if (Array.isArray(this.game.trashItems)) {
        for (let i = this.game.trashItems.length - 1; i >= 0; i--) {
          const t = this.game.trashItems[i];
          const desc = { kind: 'trash', ref: t, index: i, label: `Lixo: ${t.typeInfo.name}` };
          if (this._pointInBox(wx, wy, this.getEntityBox(desc))) return desc;
        }
      }

      // 3. Marcadores de Spawn P1 e P2
      const sp2Desc = { kind: 'spawnP2', ref: map.spawnP2, label: 'Spawn P2' };
      if (this._pointInBox(wx, wy, this.getEntityBox(sp2Desc))) return sp2Desc;

      const sp1Desc = { kind: 'spawnP1', ref: map.spawnP1, label: 'Spawn P1' };
      if (this._pointInBox(wx, wy, this.getEntityBox(sp1Desc))) return sp1Desc;

      // 4. Obstáculos e Props Decorativos (do topo para baixo)
      if (Array.isArray(map.obstacles)) {
        for (let i = map.obstacles.length - 1; i >= 0; i--) {
          const obs = map.obstacles[i];
          const desc = {
            kind: 'obstacle',
            ref: obs,
            index: i,
            label: obs.label || (obs.noCollision ? `Prop #${i + 1}` : `Obstáculo #${i + 1}`)
          };
          if (this._pointInBox(wx, wy, this.getEntityBox(desc))) return desc;
        }
      }

      // 5. Estações Interativas da Safe Room (Lojinha / Crafting)
      if (Array.isArray(map.interactiveStations)) {
        for (let i = map.interactiveStations.length - 1; i >= 0; i--) {
          const st = map.interactiveStations[i];
          const desc = { kind: 'station', ref: st, index: i, label: `Estação: ${st.name}` };
          if (this._pointInBox(wx, wy, this.getEntityBox(desc))) return desc;
        }
      }

      // 6. Zona de Extração / Porta da Van
      if (map.transitionZone) {
        const tzDesc = { kind: 'transitionZone', ref: map.transitionZone, label: 'Zona de Extração / Saída' };
        if (this._pointInBox(wx, wy, this.getEntityBox(tzDesc))) return tzDesc;
      }

      // 7. Zonas de Piso / Trilhas
      if (Array.isArray(map.floorZones)) {
        for (let i = map.floorZones.length - 1; i >= 0; i--) {
          const fz = map.floorZones[i];
          const desc = { kind: 'floorZone', ref: fz, index: i, label: fz.label || `Zona de Piso #${i + 1}` };
          if (this._pointInBox(wx, wy, this.getEntityBox(desc))) return desc;
        }
      }

      return null;
    }

    _pointInBox(x, y, box) {
      if (!box) return false;
      return x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h;
    }

    _isResizableKind(kind) {
      return kind === 'obstacle' || kind === 'floorZone' || kind === 'station' || kind === 'transitionZone';
    }

    /**
     * Retorna os 8 handles de redimensionamento para entidades retangulares
     */
    getResizeHandles(box) {
      if (!box) return [];
      const { x, y, w, h } = box;
      const mx = x + w / 2;
      const my = y + h / 2;
      return [
        { id: 'nw', x: x, y: y, cursor: 'nwse-resize' },
        { id: 'n', x: mx, y: y, cursor: 'ns-resize' },
        { id: 'ne', x: x + w, y: y, cursor: 'nesw-resize' },
        { id: 'e', x: x + w, y: my, cursor: 'ew-resize' },
        { id: 'se', x: x + w, y: y + h, cursor: 'nwse-resize' },
        { id: 's', x: mx, y: y + h, cursor: 'ns-resize' },
        { id: 'sw', x: x, y: y + h, cursor: 'nesw-resize' },
        { id: 'w', x: x, y: my, cursor: 'ew-resize' }
      ];
    }

    hitTestResizeHandle(wx, wy, descriptor) {
      if (!descriptor || !this._isResizableKind(descriptor.kind)) return null;
      const box = this.getEntityBox(descriptor);
      const handles = this.getResizeHandles(box);
      const hitRadius = 9;
      for (const h of handles) {
        if (Math.abs(wx - h.x) <= hitRadius && Math.abs(wy - h.y) <= hitRadius) {
          return h;
        }
      }
      return null;
    }

    // =========================================================================
    // EVENTOS DE MOUSE, TECLADO E DRAG & DROP DE ARQUIVOS EXTERNOS
    // =========================================================================
    _bindEvents() {
      // Atalho Global [F2] + [Delete] + [Ctrl+D] + [Space]
      window.addEventListener('keydown', (e) => {
        if (e.code === 'F2') {
          e.preventDefault();
          this.toggleEditor();
          return;
        }

        if (!this.isOpen) return;

        // Ignora atalhos se estiver digitando em um input do Inspector
        const tag = e.target && e.target.tagName ? e.target.tagName.toUpperCase() : '';
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

        if (e.code === 'Space') {
          this.isSpaceHeld = true;
        } else if (e.code === 'Delete' || e.code === 'Backspace') {
          e.preventDefault();
          this.deleteSelectedEntity();
        } else if ((e.ctrlKey || e.metaKey) && e.code === 'KeyD') {
          e.preventDefault();
          this.duplicateSelectedEntity();
        } else if (e.code === 'KeyV') {
          this.setTool('select');
        }
      });

      window.addEventListener('keyup', (e) => {
        if (e.code === 'Space') {
          this.isSpaceHeld = false;
        }
      });

      // Eventos de Mouse no Canvas
      this.canvas.addEventListener('mousedown', (e) => this._onCanvasMouseDown(e));
      window.addEventListener('mousemove', (e) => this._onWindowMouseMove(e));
      window.addEventListener('mouseup', (e) => this._onWindowMouseUp(e));
      this.canvas.addEventListener('contextmenu', (e) => {
        if (this.isOpen) e.preventDefault();
      });

      // Eventos de Drag & Drop de Arquivos de Imagem Externos no Canvas
      window.addEventListener('dragover', (e) => {
        if (!this._hasFiles(e)) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';

        const rect = this.canvas.getBoundingClientRect();
        this.mouseScreen = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        this.mouseWorld = this.screenToWorld(this.mouseScreen.x, this.mouseScreen.y);

        const overEditorPanel = e.target && e.target.closest && e.target.closest('.map-editor-ui');
        if (!overEditorPanel) {
          this.isFileDragOverCanvas = true;
          this.hovered = this.hitTestWorld(this.mouseWorld.x, this.mouseWorld.y);
        } else {
          this.isFileDragOverCanvas = false;
        }
      });

      window.addEventListener('dragleave', (e) => {
        if (e.relatedTarget === null) {
          this.isFileDragOverCanvas = false;
        }
      });

      window.addEventListener('drop', (e) => {
        this.isFileDragOverCanvas = false;
        if (!this._hasFiles(e)) return;

        // Se soltou dentro de um dropzone específico do painel do editor, o próprio dropzone trata
        if (e.target && e.target.closest && e.target.closest('.ed-dropzone')) {
          return;
        }

        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        this.mouseScreen = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        this.mouseWorld = this.screenToWorld(this.mouseScreen.x, this.mouseScreen.y);

        const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
        if (!files.length) {
          this.game.ui.showToast('Solte um arquivo de imagem válido (.png, .jpg, .webp, .svg)!', 2200);
          return;
        }

        this._handleExternalImagesDroppedOnCanvas(files, this.mouseWorld.x, this.mouseWorld.y, e.shiftKey);
      });
    }

    _hasFiles(e) {
      return e.dataTransfer && e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files');
    }

    _onCanvasMouseDown(e) {
      if (!this.isOpen) return;

      const rect = this.canvas.getBoundingClientRect();
      this.mouseScreen = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      this.mouseWorld = this.screenToWorld(this.mouseScreen.x, this.mouseScreen.y);

      // Botão do meio (1), botão direito (2) ou Space + Clique Esquerdo => Pan livre da câmera
      if (e.button === 1 || e.button === 2 || (e.button === 0 && this.isSpaceHeld)) {
        e.preventDefault();
        this.game.editorFreeCamera = true;
        this._syncToolbarUI();
        this.dragState = {
          mode: 'pan',
          startScreenX: e.clientX,
          startScreenY: e.clientY,
          startCamX: this.game.camera.x,
          startCamY: this.game.camera.y
        };
        return;
      }

      if (e.button !== 0) return;

      const { x: wx, y: wy } = this.mouseWorld;
      const map = this.game.currentMap;

      // 1. Se estamos na ferramenta 'select'
      if (this.activeTool === 'select') {
        // Verifica se clicou em um handle de resize da entidade selecionada
        if (this.selected) {
          const handle = this.hitTestResizeHandle(wx, wy, this.selected);
          if (handle) {
            const box = this.getEntityBox(this.selected);
            this.dragState = {
              mode: 'resize',
              handle: handle.id,
              startWorld: { x: wx, y: wy },
              origBox: { ...box }
            };
            return;
          }
        }

        // Verifica se clicou em alguma entidade
        const hit = this.hitTestWorld(wx, wy);
        if (hit) {
          this.selectEntity(hit);
          const box = this.getEntityBox(hit);
          this.dragState = {
            mode: 'move',
            startWorld: { x: wx, y: wy },
            origPos: { x: hit.ref.x, y: hit.ref.y },
            origBox: box ? { ...box } : null
          };
        } else {
          this.selectEntity({ kind: 'map', ref: map, label: map.name });
        }
        return;
      }

      // 2. Ferramentas de Criação ('add_obstacle', 'add_prop', 'add_floor', 'add_station', 'add_trash')
      const sx = this.snap(wx);
      const sy = this.snap(wy);

      if (this.activeTool === 'add_trash') {
        this._ensureCustomTrashArray(map);
        const types = window.GameConfig.TRASH_TYPES;
        const typeInfo = types[map.customTrash.length % types.length];
        const newTrash = new window.TrashItem({
          id: `custom_trash_${map.id}_${Date.now()}`,
          x: sx,
          y: sy,
          size: window.GameConfig.TRASH_SIZE || 26,
          typeInfo,
          isCustomPlaced: true
        });
        this.game.trashItems.push(newTrash);
        this._syncTrashToMapCustomList(newTrash);
        this.selectEntity({
          kind: 'trash',
          ref: newTrash,
          index: this.game.trashItems.length - 1,
          label: `Lixo: ${typeInfo.name}`
        });
        this.setTool('select');
        this.saveToLocalStorage();
        this.game.ui.showToast(`Lixo fixo adicionado em (${sx}, ${sy})!`, 1500);
        return;
      }

      // Criação de caixas arrastando no Canvas (Obstáculo, Prop, Zona de Piso, Estação)
      let newObj;
      let newDesc;

      if (this.activeTool === 'add_obstacle' || this.activeTool === 'add_prop') {
        const isProp = this.activeTool === 'add_prop';
        newObj = {
          x: sx,
          y: sy,
          w: Math.max(32, this.snapSize || 64),
          h: Math.max(32, this.snapSize || 64),
          label: isProp ? `PROP DECORATIVO #${map.obstacles.length + 1}` : `OBSTÁCULO #${map.obstacles.length + 1}`,
          noCollision: isProp
        };
        map.obstacles.push(newObj);
        newDesc = {
          kind: 'obstacle',
          ref: newObj,
          index: map.obstacles.length - 1,
          label: newObj.label
        };
      } else if (this.activeTool === 'add_floor') {
        if (!Array.isArray(map.floorZones)) map.floorZones = [];
        newObj = {
          x: sx,
          y: sy,
          w: 160,
          h: 120,
          label: `ZONA DE PISO #${map.floorZones.length + 1}`
        };
        map.floorZones.push(newObj);
        newDesc = {
          kind: 'floorZone',
          ref: newObj,
          index: map.floorZones.length - 1,
          label: newObj.label
        };
      } else if (this.activeTool === 'add_station') {
        if (!Array.isArray(map.interactiveStations)) map.interactiveStations = [];
        const idx = map.interactiveStations.length + 1;
        newObj = {
          id: `station_${idx}`,
          name: `Estação #${idx}`,
          icon: '⚙️',
          x: sx,
          y: sy,
          w: 220,
          h: 160,
          zoneLabel: `ÁREA D/ INTERAÇÃO: ESTAÇÃO #${idx}`,
          promptText: `Pressione [E] para interagir com Estação #${idx}`,
          strokeColor: '#38bdf8',
          fillColor: 'rgba(56, 189, 248, 0.16)'
        };
        map.interactiveStations.push(newObj);
        newDesc = {
          kind: 'station',
          ref: newObj,
          index: map.interactiveStations.length - 1,
          label: newObj.name
        };
      }

      if (newDesc) {
        this.selectEntity(newDesc);
        this.dragState = {
          mode: 'create',
          startWorld: { x: sx, y: sy },
          ref: newObj
        };
      }
    }

    _onWindowMouseMove(e) {
      if (!this.isOpen) return;

      const rect = this.canvas.getBoundingClientRect();
      this.mouseScreen = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      this.mouseWorld = this.screenToWorld(this.mouseScreen.x, this.mouseScreen.y);

      const { x: wx, y: wy } = this.mouseWorld;
      const map = this.game.currentMap;

      if (!this.dragState) {
        this.hovered = this.hitTestWorld(wx, wy);
        this._updateCanvasCursor(wx, wy);
        return;
      }

      // 1. Pan da Câmera
      if (this.dragState.mode === 'pan') {
        const dx = e.clientX - this.dragState.startScreenX;
        const dy = e.clientY - this.dragState.startScreenY;
        this.game.camera.x = Math.max(
          -300,
          Math.min(map.width - this.canvas.width + 300, this.dragState.startCamX - dx)
        );
        this.game.camera.y = Math.max(
          -300,
          Math.min(map.height - this.canvas.height + 300, this.dragState.startCamY - dy)
        );
        return;
      }

      // 2. Arrastando nova caixa criada ('create')
      if (this.dragState.mode === 'create') {
        const sx = this.dragState.startWorld.x;
        const sy = this.dragState.startWorld.y;
        const ex = this.snap(wx);
        const ey = this.snap(wy);
        const minSize = Math.max(20, this.snapSize || 16);

        this.dragState.ref.x = Math.min(sx, ex);
        this.dragState.ref.y = Math.min(sy, ey);
        this.dragState.ref.w = Math.max(minSize, Math.abs(ex - sx));
        this.dragState.ref.h = Math.max(minSize, Math.abs(ey - sy));
        this._syncInspectorCoordinates();
        return;
      }

      // 3. Movendo entidade selecionada ('move')
      if (this.dragState.mode === 'move' && this.selected) {
        const dx = wx - this.dragState.startWorld.x;
        const dy = wy - this.dragState.startWorld.y;
        const ref = this.selected.ref;
        const kind = this.selected.kind;

        const nextX = this.snap(this.dragState.origPos.x + dx);
        const nextY = this.snap(this.dragState.origPos.y + dy);

        ref.x = nextX;
        ref.y = nextY;

        // Se moveu um Spawn Point, atualiza também o respectivo jogador se desejar visualização imediata
        if (kind === 'spawnP1') {
          this.game.p1.setPosition(nextX, nextY);
        } else if (kind === 'spawnP2') {
          this.game.p2.setPosition(nextX, nextY);
        } else if (kind === 'trash') {
          ref.isCustomPlaced = true;
          this._syncTrashToMapCustomList(ref);
        }

        this._syncInspectorCoordinates();
        return;
      }

      // 4. Redimensionando entidade selecionada ('resize')
      if (this.dragState.mode === 'resize' && this.selected) {
        const { origBox, handle } = this.dragState;
        const ref = this.selected.ref;
        const minSize = 20;

        let left = origBox.x;
        let top = origBox.y;
        let right = origBox.x + origBox.w;
        let bottom = origBox.y + origBox.h;

        const sx = this.snap(wx);
        const sy = this.snap(wy);

        if (handle.includes('w')) left = Math.min(sx, right - minSize);
        if (handle.includes('e')) right = Math.max(sx, left + minSize);
        if (handle.includes('n')) top = Math.min(sy, bottom - minSize);
        if (handle.includes('s')) bottom = Math.max(sy, top + minSize);

        ref.x = Math.round(left);
        ref.y = Math.round(top);
        ref.w = Math.round(right - left);
        ref.h = Math.round(bottom - top);

        this._syncInspectorCoordinates();
      }
    }

    _onWindowMouseUp() {
      if (!this.isOpen || !this.dragState) return;
      const wasCreate = this.dragState.mode === 'create';
      const wasModify =
        this.dragState.mode === 'move' ||
        this.dragState.mode === 'resize' ||
        wasCreate;

      this.dragState = null;
      if (wasCreate) {
        this.setTool('select');
      }
      if (wasModify) {
        this._renderInspector();
        this.saveToLocalStorage();
      }
    }

    _updateCanvasCursor(wx, wy) {
      if (this.isSpaceHeld) {
        this.canvas.style.cursor = 'grab';
        return;
      }
      if (this.activeTool !== 'select') {
        this.canvas.style.cursor = 'crosshair';
        return;
      }
      if (this.selected) {
        const handle = this.hitTestResizeHandle(wx, wy, this.selected);
        if (handle) {
          this.canvas.style.cursor = handle.cursor;
          return;
        }
      }
      this.canvas.style.cursor = this.hovered ? 'move' : 'default';
    }

    // =========================================================================
    // DRAG & DROP DE IMAGENS EXTERNAS (DO EXPLORADOR DE ARQUIVOS)
    // =========================================================================
    _readFileAsDataURL(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });
    }

    _loadImageDimensions(src) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ w: img.naturalWidth || 64, h: img.naturalHeight || 64 });
        img.onerror = () => resolve({ w: 64, h: 64 });
        img.src = src;
      });
    }

    async _registerDroppedFileInLibrary(file) {
      const dataUrl = await this._readFileAsDataURL(file);
      const dims = await this._loadImageDimensions(dataUrl);
      const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const relativePath = `${this.assetsFolderPrefix}${cleanName}`;

      // Pré-carrega no cache global de sprites
      if (window.SpriteCache) {
        window.SpriteCache.preload(dataUrl);
      }

      let existing = this.spriteLibrary.find((s) => s.name === file.name);
      if (existing) {
        existing.dataUrl = dataUrl;
        existing.w = dims.w;
        existing.h = dims.h;
      } else {
        existing = {
          id: `lib_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          name: file.name,
          dataUrl,
          relativePath,
          w: dims.w,
          h: dims.h
        };
        this.spriteLibrary.unshift(existing);
      }

      this._renderSpriteLibrary();
      return existing;
    }

    getEffectiveSpriteValue(libItem) {
      if (!libItem) return null;
      return this.preferredSpriteStorage === 'path' ? libItem.relativePath : libItem.dataUrl;
    }

    async _handleExternalImagesDroppedOnCanvas(files, wx, wy, isShiftHeld) {
      if (!this.isOpen) {
        this.toggleEditor(true);
      }

      const map = this.game.currentMap;
      const firstFile = files[0];
      const libEntry = await this._registerDroppedFileInLibrary(firstFile);
      const spriteVal = this.getEffectiveSpriteValue(libEntry);

      // Se estamos usando caminho relativo no export, mas queremos ver imediatamente no Canvas mesmo se não estiver em assets/,
      // mapeamos o relativePath para a mesma imagem no SpriteCache!
      if (window.SpriteCache && libEntry.dataUrl && libEntry.relativePath) {
        const cached = window.SpriteCache._cache.get(libEntry.dataUrl);
        if (cached) {
          window.SpriteCache._cache.set(libEntry.relativePath, cached);
        }
      }

      // 1. Se Shift estiver pressionado ao soltar no vazio -> aplica como Background do Mapa
      const targetHit = this.hitTestWorld(wx, wy);
      if (isShiftHeld && !targetHit) {
        map.bgSprite = spriteVal;
        this.selectEntity({ kind: 'map', ref: map, label: map.name });
        this.saveToLocalStorage();
        this.game.ui.showToast(`🖼️ Sprite aplicado ao Fundo do Mapa (${firstFile.name})!`, 2200);
        return;
      }

      // 2. Se soltou em cima de uma entidade existente (Jogador, Lixo, Obstáculo, Estação, Zona, Spawn)
      if (targetHit) {
        this.applySpriteToEntity(targetHit, spriteVal, firstFile.name);
        this.selectEntity(targetHit);
        this.saveToLocalStorage();
        return;
      }

      // 3. Se soltou em um espaço vazio do mapa -> cria um novo Prop/Obstáculo para cada arquivo solto!
      let offsetX = 0;
      for (const file of files) {
        const entry = file === firstFile ? libEntry : await this._registerDroppedFileInLibrary(file);
        const val = this.getEffectiveSpriteValue(entry);
        if (window.SpriteCache && entry.dataUrl && entry.relativePath) {
          const cached = window.SpriteCache._cache.get(entry.dataUrl);
          if (cached) window.SpriteCache._cache.set(entry.relativePath, cached);
        }

        // Calcula tamanho proporcional razoável (entre 48px e 256px)
        const maxDim = Math.max(48, Math.min(240, Math.max(entry.w, entry.h)));
        const scale = maxDim / Math.max(1, Math.max(entry.w, entry.h));
        const w = this.snap(Math.max(32, Math.round(entry.w * scale)));
        const h = this.snap(Math.max(32, Math.round(entry.h * scale)));

        const px = this.snap(wx - w / 2 + offsetX);
        const py = this.snap(wy - h / 2);
        offsetX += w + 16;

        const newObstacle = {
          x: px,
          y: py,
          w,
          h,
          label: file.name.replace(/\.[^.]+$/, '').toUpperCase(),
          sprite: val,
          spriteFit: 'stretch',
          noCollision: false
        };
        map.obstacles.push(newObstacle);
        this.selectEntity({
          kind: 'obstacle',
          ref: newObstacle,
          index: map.obstacles.length - 1,
          label: newObstacle.label
        });
      }

      this.saveToLocalStorage();
      this.game.ui.showToast(`🖼️ Novo objeto com sprite "${firstFile.name}" posicionado em (${this.snap(wx)}, ${this.snap(wy)})!`, 2200);
    }

    /**
     * Aplica um sprite a qualquer entidade do jogo (P1, P2, Lixo, Obstáculo, Zona, Estação, Spawn, Mapa)
     */
    applySpriteToEntity(descriptor, spriteValue, labelHint = 'Sprite') {
      if (!descriptor || !descriptor.ref) return;
      const { kind, ref } = descriptor;

      if (kind === 'player1') {
        this.game.p1.sprite = spriteValue;
        window.GameConfig.PLAYER_SPRITES.p1 = spriteValue;
        this.game.ui.showToast(`🖼️ Sprite atualizado para Jogador 1 (${labelHint})!`, 1800);
      } else if (kind === 'player2') {
        this.game.p2.sprite = spriteValue;
        window.GameConfig.PLAYER_SPRITES.p2 = spriteValue;
        this.game.ui.showToast(`🖼️ Sprite atualizado para Jogador 2 (${labelHint})!`, 1800);
      } else if (kind === 'trash') {
        // Aplica tanto ao item quanto ao tipo de lixo correspondente para refletir em todos do mesmo tipo
        ref.sprite = spriteValue;
        if (ref.typeInfo) {
          ref.typeInfo.sprite = spriteValue;
        }
        this._syncTrashToMapCustomList(ref);
        this.game.ui.showToast(`🖼️ Sprite aplicado ao Lixo "${ref.typeInfo.name}" (${labelHint})!`, 1800);
      } else if (kind === 'map') {
        ref.bgSprite = spriteValue;
        this.game.ui.showToast(`🖼️ Sprite aplicado ao Background do Mapa (${labelHint})!`, 1800);
      } else {
        ref.sprite = spriteValue;
        this.game.ui.showToast(`🖼️ Sprite aplicado em "${descriptor.label}" (${labelHint})!`, 1800);
      }

      this._renderInspector();
    }

    _syncTrashToMapCustomList(trashEntity) {
      const map = this.game.currentMap;
      this._ensureCustomTrashArray(map);

      let entry = map.customTrash.find((ct) => ct.id === trashEntity.id);
      if (!entry) {
        entry = {
          id: trashEntity.id,
          x: Math.round(trashEntity.x),
          y: Math.round(trashEntity.y),
          size: trashEntity.size,
          typeId: trashEntity.typeInfo ? trashEntity.typeInfo.id : 'scrap_metal',
          sprite: trashEntity.sprite || null,
          rotation: trashEntity.rotation || 0
        };
        map.customTrash.push(entry);
      } else {
        entry.x = Math.round(trashEntity.x);
        entry.y = Math.round(trashEntity.y);
        entry.size = trashEntity.size;
        entry.typeId = trashEntity.typeInfo ? trashEntity.typeInfo.id : entry.typeId;
        entry.sprite = trashEntity.sprite || null;
      }
    }

    // =========================================================================
    // AÇÕES DE EDIÇÃO: SELECIONAR, DUPLICAR, EXCLUIR
    // =========================================================================
    selectEntity(descriptor) {
      this.selected = descriptor;
      this._renderInspector();
    }

    setTool(toolName) {
      this.activeTool = toolName;
      this._syncToolbarUI();
    }

    deleteSelectedEntity() {
      if (!this.selected) return;
      const { kind, ref } = this.selected;
      const map = this.game.currentMap;

      if (kind === 'obstacle') {
        const idx = map.obstacles.indexOf(ref);
        if (idx !== -1) map.obstacles.splice(idx, 1);
      } else if (kind === 'floorZone') {
        const idx = map.floorZones.indexOf(ref);
        if (idx !== -1) map.floorZones.splice(idx, 1);
      } else if (kind === 'station') {
        const idx = map.interactiveStations.indexOf(ref);
        if (idx !== -1) map.interactiveStations.splice(idx, 1);
      } else if (kind === 'trash') {
        const idx = this.game.trashItems.indexOf(ref);
        if (idx !== -1) this.game.trashItems.splice(idx, 1);
        if (Array.isArray(map.customTrash)) {
          const cIdx = map.customTrash.findIndex((c) => c.id === ref.id);
          if (cIdx !== -1) map.customTrash.splice(cIdx, 1);
        }
      } else {
        this.game.ui.showToast('Esta entidade estrutural não pode ser deletada (apenas movida/editada).', 1800);
        return;
      }

      this.game.ui.showToast(`🗑️ "${this.selected.label}" removido do mapa!`, 1400);
      this.selected = null;
      this._renderInspector();
      this.saveToLocalStorage();
    }

    duplicateSelectedEntity() {
      if (!this.selected) return;
      const { kind, ref } = this.selected;
      const map = this.game.currentMap;
      const offset = this.snapSize || 24;

      if (kind === 'obstacle' || kind === 'floorZone' || kind === 'station') {
        const clone = JSON.parse(JSON.stringify(ref));
        clone.x += offset;
        clone.y += offset;
        if (clone.label) clone.label = `${clone.label} (Cópia)`;

        const list =
          kind === 'obstacle'
            ? map.obstacles
            : kind === 'floorZone'
              ? map.floorZones
              : map.interactiveStations;
        list.push(clone);
        this.selectEntity({
          kind,
          ref: clone,
          index: list.length - 1,
          label: clone.label || clone.name
        });
        this.saveToLocalStorage();
        this.game.ui.showToast('✨ Entidade duplicada! [Ctrl+D]', 1400);
      } else if (kind === 'trash') {
        const cloneTrash = new window.TrashItem({
          id: `custom_trash_${map.id}_${Date.now()}`,
          x: ref.x + offset,
          y: ref.y + offset,
          size: ref.size,
          typeInfo: ref.typeInfo,
          sprite: ref.sprite,
          rotation: ref.rotation,
          isCustomPlaced: true
        });
        this.game.trashItems.push(cloneTrash);
        this._syncTrashToMapCustomList(cloneTrash);
        this.selectEntity({
          kind: 'trash',
          ref: cloneTrash,
          index: this.game.trashItems.length - 1,
          label: `Lixo: ${cloneTrash.typeInfo.name}`
        });
        this.saveToLocalStorage();
        this.game.ui.showToast('✨ Item de lixo duplicado! [Ctrl+D]', 1400);
      }
    }

    // =========================================================================
    // RENDERIZAÇÃO DE OVERLAYS NO CANVAS (SELEÇÃO, HANDLES E HOVER DE ARQUIVO)
    // =========================================================================
    _renderWorldOverlay(ctx) {
      ctx.save();

      // 1. Destaque de Hover (ou alvo de Drag & Drop de arquivo)
      if (this.hovered && (!this.selected || this.hovered.ref !== this.selected.ref)) {
        const hBox = this.getEntityBox(this.hovered);
        if (hBox) {
          ctx.strokeStyle = this.isFileDragOverCanvas ? '#4ade80' : 'rgba(34, 211, 238, 0.85)';
          ctx.lineWidth = this.isFileDragOverCanvas ? 3.5 : 2;
          ctx.setLineDash([6, 4]);
          ctx.strokeRect(hBox.x - 2, hBox.y - 2, hBox.w + 4, hBox.h + 4);
          ctx.setLineDash([]);

          if (this.isFileDragOverCanvas) {
            ctx.fillStyle = 'rgba(34, 197, 94, 0.22)';
            ctx.fillRect(hBox.x, hBox.y, hBox.w, hBox.h);
          }
        }
      }

      // 2. Destaque da Entidade Selecionada + 8 Handles de Redimensionamento
      if (this.selected && this.selected.kind !== 'map') {
        const sBox = this.getEntityBox(this.selected);
        if (sBox) {
          ctx.strokeStyle = '#ffca3a';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(sBox.x, sBox.y, sBox.w, sBox.h);

          // Badge superior com nome e dimensões
          const tag = `${this.selected.label} (${Math.round(sBox.x)}, ${Math.round(sBox.y)}) [${Math.round(sBox.w)}x${Math.round(sBox.h)}]`;
          ctx.font = 'bold 11px Consolas, monospace';
          const tw = ctx.measureText(tag).width + 12;
          ctx.fillStyle = '#ffca3a';
          ctx.fillRect(sBox.x, sBox.y - 22, tw, 19);
          ctx.fillStyle = '#0f172a';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(tag, sBox.x + 6, sBox.y - 12.5);

          // 8 Handles de Resize (se for retângulo redimensionável)
          if (this._isResizableKind(this.selected.kind)) {
            const handles = this.getResizeHandles(sBox);
            for (const h of handles) {
              ctx.fillStyle = '#ffffff';
              ctx.strokeStyle = '#0f172a';
              ctx.lineWidth = 2;
              ctx.fillRect(h.x - 5, h.y - 5, 10, 10);
              ctx.strokeRect(h.x - 5, h.y - 5, 10, 10);
            }
          }
        }
      }

      ctx.restore();
    }

    _renderScreenOverlay(ctx) {
      if (!this.isFileDragOverCanvas) return;

      ctx.save();
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 4;
      ctx.setLineDash([12, 8]);
      ctx.strokeRect(6, 6, this.canvas.width - 12, this.canvas.height - 12);
      ctx.setLineDash([]);

      const targetText = this.hovered
        ? `Solte a imagem para aplicar Sprite em: ${this.hovered.label}`
        : `Solte a imagem para criar um Objeto em (${this.mouseWorld.x}, ${this.mouseWorld.y}) [Segure Shift p/ Fundo do Mapa]`;

      ctx.font = 'bold 14px Consolas, monospace';
      const padX = 18;
      const boxW = ctx.measureText(targetText).width + padX * 2;
      const boxH = 38;
      const cx = this.canvas.width / 2;
      const cy = 92;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(cx - boxW / 2, cy - boxH / 2, boxW, boxH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#86efac';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(targetText, cx, cy);
      ctx.restore();
    }

    // =========================================================================
    // PERSISTÊNCIA (LOCALSTORAGE) & EXPORTAÇÃO DE `js/maps.js`
    // =========================================================================
    saveToLocalStorage() {
      try {
        const payload = {
          maps: window.GameMaps,
          playerSprites: window.GameConfig.PLAYER_SPRITES,
          trashTypes: window.GameConfig.TRASH_TYPES,
          p1Inventory: this.game.p1.inventory,
          p2Inventory: this.game.p2.inventory,
          hideDebugOverlays: window.hideDebugOverlays,
          spriteLibrary: this.spriteLibrary
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (err) {
        console.warn('Aviso: Limite de localStorage atingido para imagens grandes. Exporte maps.js para salvar em disco.', err);
      }
    }

    _loadFromLocalStorage() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);

        if (data.maps) {
          for (const key of Object.keys(data.maps)) {
            if (window.GameMaps[key]) {
              Object.assign(window.GameMaps[key], data.maps[key]);
            }
          }
        }
        if (data.playerSprites) {
          Object.assign(window.GameConfig.PLAYER_SPRITES, data.playerSprites);
          this.game.p1.sprite = data.playerSprites.p1 || null;
          this.game.p2.sprite = data.playerSprites.p2 || null;
        }
        if (Array.isArray(data.trashTypes)) {
          data.trashTypes.forEach((savedType, idx) => {
            if (window.GameConfig.TRASH_TYPES[idx]) {
              Object.assign(window.GameConfig.TRASH_TYPES[idx], savedType);
            }
          });
        }
        if (Array.isArray(data.p1Inventory)) {
          this.game.p1.inventory = data.p1Inventory;
        }
        if (Array.isArray(data.p2Inventory)) {
          this.game.p2.inventory = data.p2Inventory;
        }
        if (typeof data.hideDebugOverlays === 'boolean') {
          window.hideDebugOverlays = data.hideDebugOverlays;
        }
        if (Array.isArray(data.spriteLibrary)) {
          this.spriteLibrary = data.spriteLibrary;
          // Registra entradas no SpriteCache
          this.spriteLibrary.forEach((entry) => {
            if (entry.dataUrl && window.SpriteCache) {
              window.SpriteCache.preload(entry.dataUrl);
              const cached = window.SpriteCache._cache.get(entry.dataUrl);
              if (cached && entry.relativePath) {
                window.SpriteCache._cache.set(entry.relativePath, cached);
              }
            }
          });
        }

        // Atualiza posição inicial e lixo do mapa atual
        this.game.p1.setPosition(this.game.currentMap.spawnP1.x, this.game.currentMap.spawnP1.y);
        this.game.p2.setPosition(this.game.currentMap.spawnP2.x, this.game.currentMap.spawnP2.y);
        this.game._spawnRandomTrashForMap(this.game.currentMap);
        this.game.ui.renderHotbar();
      } catch (err) {
        console.warn('Falha ao restaurar estado salvo do Map Editor:', err);
      }
    }

    resetAllToDefaults() {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }

    /**
     * Gera o código-fonte completo de `js/maps.js` pronto para uso na versão final (sem precisar do editor)
     */
    generateMapsJsFileContent() {
      const mapsJson = JSON.stringify(window.GameMaps, null, 2);
      const playerSpritesJson = JSON.stringify(window.GameConfig.PLAYER_SPRITES, null, 2);
      const trashSpritesMap = {};
      window.GameConfig.TRASH_TYPES.forEach((t) => {
        if (t.sprite) trashSpritesMap[t.id] = t.sprite;
      });
      const trashSpritesJson = JSON.stringify(trashSpritesMap, null, 2);

      const p1InvSprites = {};
      this.game.p1.inventory.forEach((it) => {
        if (it.sprite) p1InvSprites[it.id] = it.sprite;
      });
      const p2InvSprites = {};
      this.game.p2.inventory.forEach((it) => {
        if (it.sprite) p2InvSprites[it.id] = it.sprite;
      });
      const invSpritesJson = JSON.stringify({ p1: p1InvSprites, p2: p2InvSprites }, null, 2);

      return `/**
 * js/maps.js
 * Definições dos 3 Mapas Grandes (2500x2500px), da Safe Room Expandida (A Van)
 * e dos Sprites Customizados exportados pelo Map Editor.
 */

window.GameMaps = ${mapsJson};

// Aplica Sprites de Entidades e Preferências Visuais exportadas pelo Editor
(function applyExportedSprites() {
  if (!window.GameConfig) return;

  window.hideDebugOverlays = ${Boolean(window.hideDebugOverlays)};

  const exportedPlayerSprites = ${playerSpritesJson};
  if (window.GameConfig.PLAYER_SPRITES) {
    Object.assign(window.GameConfig.PLAYER_SPRITES, exportedPlayerSprites);
  }

  const exportedTrashSprites = ${trashSpritesJson};
  if (Array.isArray(window.GameConfig.TRASH_TYPES)) {
    window.GameConfig.TRASH_TYPES.forEach((t) => {
      if (exportedTrashSprites[t.id]) {
        t.sprite = exportedTrashSprites[t.id];
      }
    });
  }

  const exportedInvSprites = ${invSpritesJson};
  const origCreateP1 = window.GameConfig.createDefaultInventoryP1;
  if (typeof origCreateP1 === 'function') {
    window.GameConfig.createDefaultInventoryP1 = function () {
      const list = origCreateP1.call(window.GameConfig);
      list.forEach((it) => {
        if (exportedInvSprites.p1 && exportedInvSprites.p1[it.id]) {
          it.sprite = exportedInvSprites.p1[it.id];
        }
      });
      return list;
    };
  }
  const origCreateP2 = window.GameConfig.createDefaultInventoryP2;
  if (typeof origCreateP2 === 'function') {
    window.GameConfig.createDefaultInventoryP2 = function () {
      const list = origCreateP2.call(window.GameConfig);
      list.forEach((it) => {
        if (exportedInvSprites.p2 && exportedInvSprites.p2[it.id]) {
          it.sprite = exportedInvSprites.p2[it.id];
        }
      });
      return list;
    };
  }
})();
`;
    }

    async exportMapsJsFile() {
      const content = this.generateMapsJsFileContent();

      // Se o navegador suportar File System Access API, permite salvar diretamente sobre js/maps.js
      if (window.showSaveFilePicker) {
        try {
          const handle = await window.showSaveFilePicker({
            suggestedName: 'maps.js',
            types: [
              {
                description: 'JavaScript Map File',
                accept: { 'text/javascript': ['.js'] }
              }
            ]
          });
          const writable = await handle.createWritable();
          await writable.write(content);
          await writable.close();
          this.game.ui.showToast('✅ Arquivo maps.js salvo com sucesso!', 2400);
          return;
        } catch (err) {
          if (err && err.name === 'AbortError') return;
        }
      }

      // Fallback padrão: download direto do arquivo maps.js
      const blob = new Blob([content], { type: 'text/javascript;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'maps.js';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      this.game.ui.showToast('💾 Download de maps.js iniciado! Substitua em js/maps.js.', 2600);
    }

    async copyMapsJsToClipboard() {
      const content = this.generateMapsJsFileContent();
      try {
        await navigator.clipboard.writeText(content);
        this.game.ui.showToast('📋 Código de js/maps.js copiado para a Área de Transferência!', 2200);
      } catch (_) {
        this.game.ui.showToast('Não foi possível copiar automaticamente; use o botão Salvar maps.js.', 2200);
      }
    }

    // =========================================================================
    // CONSTRUÇÃO DA INTERFACE DO MAP EDITOR (DOM & CSS INJETADO)
    // =========================================================================
    _buildUI() {
      // Botão flutuante discreto para abrir/fechar o Editor [F2]
      this.togglePillBtn = document.createElement('button');
      this.togglePillBtn.type = 'button';
      this.togglePillBtn.className = 'map-editor-toggle-pill map-editor-ui';
      this.togglePillBtn.innerHTML = '🛠️ Map &amp; Sprite Editor <kbd>F2</kbd>';
      this.togglePillBtn.addEventListener('click', () => this.toggleEditor());
      document.body.appendChild(this.togglePillBtn);

      // Container Principal do Editor
      this.rootEl = document.createElement('div');
      this.rootEl.id = 'map-editor-root';
      this.rootEl.className = 'map-editor-root map-editor-ui hidden';

      this.rootEl.innerHTML = `
        <!-- Barra Superior de Ferramentas do Editor -->
        <div class="ed-topbar">
          <div class="ed-topbar-group">
            <span class="ed-title">🛠️ EDITOR DE MAPA &amp; SPRITES</span>
            <select id="ed-map-select" class="ed-select" title="Alternar Mapa em Edição">
              <option value="0">Mapa 1: Floresta (2500x2500)</option>
              <option value="1">Safe Room: A Van (1440x920)</option>
              <option value="2">Mapa 2: Industrial (2500x2500)</option>
              <option value="4">Mapa 3: Subterrâneo (2500x2500)</option>
            </select>
          </div>

          <div class="ed-topbar-group ed-tools-group">
            <button type="button" class="ed-tool-btn active" data-tool="select" title="Selecionar, Mover e Redimensionar [V]">
              ↖ Selecionar / Mover
            </button>
            <button type="button" class="ed-tool-btn" data-tool="add_obstacle" title="Clique e arraste no mapa para criar um Obstáculo com Colisão">
              🧱 + Obstáculo
            </button>
            <button type="button" class="ed-tool-btn" data-tool="add_prop" title="Clique e arraste para criar um Asset/Prop Decorativo sem Colisão">
              🌲 + Prop/Asset
            </button>
            <button type="button" class="ed-tool-btn" data-tool="add_floor" title="Clique e arraste para criar uma Zona de Piso/Trilha">
              🟫 + Piso
            </button>
            <button type="button" class="ed-tool-btn" data-tool="add_station" title="Clique e arraste para criar uma Estação Interativa [E]">
              🛒 + Estação
            </button>
            <button type="button" class="ed-tool-btn" data-tool="add_trash" title="Clique no mapa para posicionar um item de Lixo/Sucata fixo">
              ♻️ + Lixo Fixo
            </button>
          </div>

          <div class="ed-topbar-group">
            <label class="ed-inline-label" title="Tamanho do Grid Snap ao mover/redimensionar">
              Snap:
              <select id="ed-snap-select" class="ed-select ed-select-sm">
                <option value="0">Livre (1px)</option>
                <option value="8">8px</option>
                <option value="16" selected>16px</option>
                <option value="32">32px</option>
                <option value="64">64px (Tile)</option>
              </select>
            </label>

            <button type="button" id="ed-btn-clean-preview" class="ed-action-btn" title="Ocultar/Mostrar linhas de Debug e Hitboxes para ver aparência final">
              👁️ Preview Limpo: OFF
            </button>
            <button type="button" id="ed-btn-export" class="ed-action-btn ed-btn-gold" title="Salvar/Baixar arquivo js/maps.js pronto para a versão final">
              💾 Salvar maps.js
            </button>
            <button type="button" id="ed-btn-copy" class="ed-action-btn" title="Copiar código de js/maps.js">
              📋 Copiar
            </button>
            <button type="button" id="ed-btn-reset" class="ed-action-btn ed-btn-danger" title="Limpar alterações salvas no navegador e restaurar padrão">
              ↺ Resetar
            </button>
          </div>
        </div>

        <!-- Painel Lateral Direito: Seletor Rápido de Entidades, Inspector e Biblioteca de Sprites -->
        <aside class="ed-sidebar">
          <!-- Abas Rápidas de Seleção de Entidades Globais -->
          <div class="ed-section">
            <div class="ed-section-title">Entidades Principais (Clique p/ Editar Sprite)</div>
            <div class="ed-quick-entities">
              <button type="button" class="ed-chip-btn" data-quick="player1">🧑 Jogador 1</button>
              <button type="button" class="ed-chip-btn" data-quick="player2">🧑 Jogador 2</button>
              <button type="button" class="ed-chip-btn" data-quick="spawnP1">📍 Spawn P1</button>
              <button type="button" class="ed-chip-btn" data-quick="spawnP2">📍 Spawn P2</button>
              <button type="button" class="ed-chip-btn" data-quick="transitionZone">🚪 Zona Saída</button>
              <button type="button" class="ed-chip-btn" data-quick="map">🗺️ Fundo Mapa</button>
            </div>
          </div>

          <!-- Inspector Dinâmico da Entidade Selecionada -->
          <div class="ed-section ed-inspector-section">
            <div class="ed-section-title">Propriedades do Elemento Selecionado</div>
            <div id="ed-inspector-body" class="ed-inspector-body"></div>
          </div>

          <!-- Catálogo de Tipos de Lixo (Sprites Globais de Lixo) -->
          <div class="ed-section">
            <div class="ed-section-title">Sprites Globais por Tipo de Lixo</div>
            <div id="ed-trash-types-list" class="ed-trash-types-list"></div>
          </div>

          <!-- Biblioteca de Sprites (Drag & Drop) -->
          <div class="ed-section">
            <div class="ed-section-header-row">
              <span class="ed-section-title">Biblioteca de Sprites (Drag &amp; Drop)</span>
              <select id="ed-storage-mode" class="ed-select ed-select-sm" title="Como salvar os sprites no maps.js">
                <option value="dataurl" selected>Base64 Embutido</option>
                <option value="path">Pasta assets/nome.png</option>
              </select>
            </div>
            <div id="ed-library-dropzone" class="ed-dropzone">
              📥 Arraste imagens (.png, .webp, .jpg, .svg) do seu PC para cá <strong>ou direto sobre objetos no mapa</strong>!
              <input type="file" id="ed-file-input" accept="image/*" multiple style="display:none" />
              <button type="button" id="ed-btn-browse-files" class="ed-mini-btn">Escolher Arquivos...</button>
            </div>
            <div id="ed-sprite-library-grid" class="ed-sprite-library-grid"></div>
          </div>

          <div class="ed-footer-hint">
            💡 <strong>Dica:</strong> Arraste com <strong>Botão Direito</strong> (ou <kbd>Espaço</kbd> + Clique) para mover a câmera livremente pelo mapa. <kbd>Del</kbd> exclui e <kbd>Ctrl+D</kbd> duplica.
          </div>
        </aside>
      `;

      document.body.appendChild(this.rootEl);

      // Referências internas da UI do Editor
      this.mapSelectEl = this.rootEl.querySelector('#ed-map-select');
      this.snapSelectEl = this.rootEl.querySelector('#ed-snap-select');
      this.btnCleanPreview = this.rootEl.querySelector('#ed-btn-clean-preview');
      this.btnExport = this.rootEl.querySelector('#ed-btn-export');
      this.btnCopy = this.rootEl.querySelector('#ed-btn-copy');
      this.btnReset = this.rootEl.querySelector('#ed-btn-reset');
      this.inspectorBody = this.rootEl.querySelector('#ed-inspector-body');
      this.trashTypesListEl = this.rootEl.querySelector('#ed-trash-types-list');
      this.storageModeSelect = this.rootEl.querySelector('#ed-storage-mode');
      this.libraryDropzone = this.rootEl.querySelector('#ed-library-dropzone');
      this.fileInput = this.rootEl.querySelector('#ed-file-input');
      this.btnBrowseFiles = this.rootEl.querySelector('#ed-btn-browse-files');
      this.spriteLibraryGrid = this.rootEl.querySelector('#ed-sprite-library-grid');

      this._bindUIControls();
      this._renderTrashTypesCatalog();
      this._renderSpriteLibrary();
      this._renderInspector();
    }

    _bindUIControls() {
      // Seletor de Mapa
      this.mapSelectEl.addEventListener('change', () => {
        const flowIdx = parseInt(this.mapSelectEl.value, 10);
        this.game.loadStageByFlowIndex(flowIdx);
        this._ensureCustomTrashArray(this.game.currentMap);
        this.selectEntity({ kind: 'map', ref: this.game.currentMap, label: this.game.currentMap.name });
      });

      // Botões de Ferramenta
      this.rootEl.querySelectorAll('.ed-tool-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          this.setTool(btn.getAttribute('data-tool'));
        });
      });

      // Seletor de Grid Snap
      this.snapSelectEl.addEventListener('change', () => {
        this.snapSize = parseInt(this.snapSelectEl.value, 10) || 0;
      });

      // Toggle Preview Limpo (Oculta/Mostra Wireframes e Grids de Debug)
      this.btnCleanPreview.addEventListener('click', () => {
        window.hideDebugOverlays = !window.hideDebugOverlays;
        this._syncToolbarUI();
        this.saveToLocalStorage();
      });

      // Botões de Exportar / Copiar / Resetar
      this.btnExport.addEventListener('click', () => this.exportMapsJsFile());
      this.btnCopy.addEventListener('click', () => this.copyMapsJsToClipboard());
      this.btnReset.addEventListener('click', () => {
        if (window.confirm('Deseja restaurar todos os mapas e sprites para o padrão original?')) {
          this.resetAllToDefaults();
        }
      });

      // Botões de Seleção Rápida (P1, P2, Spawns, Saída, Fundo)
      this.rootEl.querySelectorAll('[data-quick]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const q = btn.getAttribute('data-quick');
          const map = this.game.currentMap;
          if (q === 'player1') {
            this.selectEntity({ kind: 'player1', ref: this.game.p1, label: 'Jogador 1' });
            this.game.camera.snapToTarget(this.game.p1.x, this.game.p1.y, map);
          } else if (q === 'player2') {
            this.selectEntity({ kind: 'player2', ref: this.game.p2, label: 'Jogador 2' });
            this.game.camera.snapToTarget(this.game.p2.x, this.game.p2.y, map);
          } else if (q === 'spawnP1') {
            this.selectEntity({ kind: 'spawnP1', ref: map.spawnP1, label: 'Spawn P1' });
            this.game.camera.snapToTarget(map.spawnP1.x, map.spawnP1.y, map);
          } else if (q === 'spawnP2') {
            this.selectEntity({ kind: 'spawnP2', ref: map.spawnP2, label: 'Spawn P2' });
            this.game.camera.snapToTarget(map.spawnP2.x, map.spawnP2.y, map);
          } else if (q === 'transitionZone' && map.transitionZone) {
            this.selectEntity({ kind: 'transitionZone', ref: map.transitionZone, label: 'Zona de Extração / Saída' });
            this.game.camera.snapToTarget(
              map.transitionZone.x + map.transitionZone.w / 2,
              map.transitionZone.y + map.transitionZone.h / 2,
              map
            );
          } else if (q === 'map') {
            this.selectEntity({ kind: 'map', ref: map, label: map.name });
          }
        });
      });

      // Modo de armazenamento de Sprites (Base64 vs Caminho Relativo)
      this.storageModeSelect.addEventListener('change', () => {
        this.preferredSpriteStorage = this.storageModeSelect.value;
      });

      // Upload / Drag & Drop na Biblioteca de Sprites
      this.btnBrowseFiles.addEventListener('click', () => this.fileInput.click());
      this.fileInput.addEventListener('change', async () => {
        const files = Array.from(this.fileInput.files || []).filter((f) => f.type.startsWith('image/'));
        for (const f of files) {
          const entry = await this._registerDroppedFileInLibrary(f);
          if (this.selected) {
            this.applySpriteToEntity(this.selected, this.getEffectiveSpriteValue(entry), f.name);
          }
        }
        this.saveToLocalStorage();
        this.fileInput.value = '';
      });

      this.libraryDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        this.libraryDropzone.classList.add('drag-active');
      });
      this.libraryDropzone.addEventListener('dragleave', () => {
        this.libraryDropzone.classList.remove('drag-active');
      });
      this.libraryDropzone.addEventListener('drop', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.libraryDropzone.classList.remove('drag-active');
        const files = Array.from(e.dataTransfer.files || []).filter((f) => f.type.startsWith('image/'));
        for (const f of files) {
          const entry = await this._registerDroppedFileInLibrary(f);
          if (this.selected) {
            this.applySpriteToEntity(this.selected, this.getEffectiveSpriteValue(entry), f.name);
          }
        }
        this.saveToLocalStorage();
      });
    }

    _syncToolbarUI() {
      this.rootEl.querySelectorAll('.ed-tool-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('data-tool') === this.activeTool);
      });

      const clean = Boolean(window.hideDebugOverlays);
      this.btnCleanPreview.textContent = `👁️ Preview Limpo: ${clean ? 'ON' : 'OFF'}`;
      this.btnCleanPreview.classList.toggle('active', clean);

      if (this.game.stageFlowIndex === 3) {
        this.mapSelectEl.value = '1';
      } else {
        this.mapSelectEl.value = String(this.game.stageFlowIndex);
      }
    }

    _syncInspectorCoordinates() {
      if (!this.selected || !this.selected.ref) return;
      const ref = this.selected.ref;
      const xIn = this.inspectorBody.querySelector('[data-field="x"]');
      const yIn = this.inspectorBody.querySelector('[data-field="y"]');
      const wIn = this.inspectorBody.querySelector('[data-field="w"]');
      const hIn = this.inspectorBody.querySelector('[data-field="h"]');
      if (xIn) xIn.value = Math.round(ref.x);
      if (yIn) yIn.value = Math.round(ref.y);
      if (wIn && typeof ref.w === 'number') wIn.value = Math.round(ref.w);
      if (hIn && typeof ref.h === 'number') hIn.value = Math.round(ref.h);
    }

    // =========================================================================
    // RENDERIZAÇÃO DO INSPECTOR DE PROPRIEDADES E SPRITES
    // =========================================================================
    _renderInspector() {
      if (!this.inspectorBody) return;

      if (!this.selected || !this.selected.ref) {
        this.inspectorBody.innerHTML = `
          <div class="ed-empty-msg">
            Clique em qualquer objeto no mapa (Obstáculo, Jogador, Lixo, Estação, Zona) ou arraste uma imagem do seu PC diretamente sobre ele!
          </div>
        `;
        return;
      }

      const { kind, ref, label } = this.selected;
      const currentSprite =
        kind === 'player1'
          ? (this.game.p1.sprite || window.GameConfig.PLAYER_SPRITES.p1 || '')
          : kind === 'player2'
            ? (this.game.p2.sprite || window.GameConfig.PLAYER_SPRITES.p2 || '')
            : kind === 'map'
              ? (ref.bgSprite || '')
              : (ref.sprite || (ref.typeInfo && ref.typeInfo.sprite) || '');

      let fieldsHtml = `<div class="ed-selected-badge">${kind.toUpperCase()} — ${label}</div>`;

      // Campos de Posição X / Y
      if (typeof ref.x === 'number' && typeof ref.y === 'number') {
        fieldsHtml += `
          <div class="ed-grid-2">
            <label>Posição X (px)
              <input type="number" class="ed-input" data-field="x" value="${Math.round(ref.x)}" />
            </label>
            <label>Posição Y (px)
              <input type="number" class="ed-input" data-field="y" value="${Math.round(ref.y)}" />
            </label>
          </div>
        `;
      }

      // Campos de Largura W / Altura H (para caixas retangulares)
      if (typeof ref.w === 'number' && typeof ref.h === 'number') {
        fieldsHtml += `
          <div class="ed-grid-2">
            <label>Largura W (px)
              <input type="number" class="ed-input" data-field="w" min="16" value="${Math.round(ref.w)}" />
            </label>
            <label>Altura H (px)
              <input type="number" class="ed-input" data-field="h" min="16" value="${Math.round(ref.h)}" />
            </label>
          </div>
        `;
      }

      // Tamanho para Jogador ou Item de Lixo
      if (kind === 'player1' || kind === 'player2' || kind === 'trash') {
        fieldsHtml += `
          <div class="ed-grid-2">
            <label>Tamanho / Escala (px)
              <input type="number" class="ed-input" data-field="size" min="16" max="240" value="${Math.round(ref.size || 40)}" />
            </label>
            ${
              kind === 'trash'
                ? `<label>Rotação (rad)
                    <input type="number" step="0.1" class="ed-input" data-field="rotation" value="${Number(ref.rotation || 0).toFixed(2)}" />
                  </label>`
                : `<div></div>`
            }
          </div>
        `;
      }

      // Campos específicos de Obstáculo / Prop
      if (kind === 'obstacle') {
        fieldsHtml += `
          <label>Nome / Rótulo
            <input type="text" class="ed-input" data-field="label" value="${ref.label || ''}" />
          </label>
          <label class="ed-checkbox-row">
            <input type="checkbox" data-field="noCollision" ${ref.noCollision ? 'checked' : ''} />
            <span>Apenas Decorativo / Sem Colisão (Prop atravessável)</span>
          </label>
        `;
      } else if (kind === 'floorZone' || kind === 'transitionZone') {
        fieldsHtml += `
          <label>Rótulo da Zona
            <input type="text" class="ed-input" data-field="label" value="${ref.label || ''}" />
          </label>
        `;
      } else if (kind === 'station') {
        fieldsHtml += `
          <label>Nome da Estação
            <input type="text" class="ed-input" data-field="name" value="${ref.name || ''}" />
          </label>
          <label>Texto Flutuante de Interação [E]
            <input type="text" class="ed-input" data-field="promptText" value="${ref.promptText || ''}" />
          </label>
        `;
      } else if (kind === 'map') {
        fieldsHtml += `
          <div class="ed-grid-2">
            <label>Largura Mapa (px)
              <input type="number" class="ed-input" data-field="width" min="600" value="${ref.width}" />
            </label>
            <label>Altura Mapa (px)
              <input type="number" class="ed-input" data-field="height" min="600" value="${ref.height}" />
            </label>
          </div>
          <div class="ed-grid-2">
            <label>Cor Fundo Base
              <input type="color" class="ed-input" data-field="bgColor" value="${ref.palette.bg || '#16261c'}" />
            </label>
            <label>Modo do Fundo Sprite
              <select class="ed-select" data-field="bgSpriteFit">
                <option value="stretch" ${ref.bgSpriteFit !== 'tile' ? 'selected' : ''}>Esticar (Stretch)</option>
                <option value="tile" ${ref.bgSpriteFit === 'tile' ? 'selected' : ''}>Repetir (Tile Pattern)</option>
              </select>
            </label>
          </div>
        `;
      }

      // Seção de Sprite (Dropzone + Caminho Relativo ou DataURL + Botão Remover Sprite)
      const displaySpriteVal =
        currentSprite && currentSprite.startsWith('data:image/')
          ? '[Imagem Base64 Embutida]'
          : currentSprite;

      fieldsHtml += `
        <div class="ed-sprite-box">
          <div class="ed-sprite-box-header">
            <strong>🖼️ Sprite deste Elemento</strong>
            ${currentSprite ? `<button type="button" id="ed-btn-clear-sprite" class="ed-mini-btn ed-btn-danger">Remover Sprite</button>` : ''}
          </div>
          <div id="ed-inspector-dropzone" class="ed-dropzone ed-inspector-drop">
            ${
              currentSprite
                ? `<img src="${currentSprite}" class="ed-sprite-preview-img" alt="Preview" />`
                : `<span>Solte um arquivo de imagem aqui p/ substituir o Sprite</span>`
            }
          </div>
          <label>Caminho do Arquivo (ex: <code>assets/sprite.png</code>) ou Data URL:
            <input type="text" id="ed-sprite-path-input" class="ed-input" placeholder="assets/meu_sprite.png" value="${displaySpriteVal}" />
          </label>
        </div>
      `;

      // Ações de Duplicar / Excluir (quando aplicável)
      if (kind === 'obstacle' || kind === 'floorZone' || kind === 'station' || kind === 'trash') {
        fieldsHtml += `
          <div class="ed-actions-row">
            <button type="button" id="ed-btn-dup-entity" class="ed-action-btn">✨ Duplicar (Ctrl+D)</button>
            <button type="button" id="ed-btn-del-entity" class="ed-action-btn ed-btn-danger">🗑️ Excluir (Del)</button>
          </div>
        `;
      }

      // Slots de Inventário (5 Slots) quando Jogador 1 ou Jogador 2 está selecionado
      if ((kind === 'player1' || kind === 'player2') && Array.isArray(ref.inventory)) {
        fieldsHtml += `
          <div class="ed-sprite-box">
            <strong>🎒 Sprites dos Itens da Hotbar (${label})</strong>
            <div class="ed-trash-types-list" id="ed-player-inv-list">
              ${ref.inventory
                .map(
                  (it, idx) => `
                <div class="ed-trash-type-row ed-dropzone" data-inv-slot="${idx}" title="Arraste uma imagem aqui para trocar o ícone/sprite do Slot ${idx + 1}">
                  <div class="ed-trash-dot" style="background:${it.color || '#334155'}">
                    ${it.sprite ? `<img src="${it.sprite}" alt="" />` : `<span>${it.icon}</span>`}
                  </div>
                  <span class="ed-trash-name">Slot ${idx + 1}: ${it.shortName}</span>
                  <span class="ed-trash-hint">${it.sprite ? '✓ Sprite' : 'Soltar img'}</span>
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        `;
      }

      this.inspectorBody.innerHTML = fieldsHtml;

      // Listeners dos inputs de propriedade
      this.inspectorBody.querySelectorAll('[data-field]').forEach((input) => {
        input.addEventListener('input', () => {
          const field = input.getAttribute('data-field');
          if (field === 'noCollision') {
            ref.noCollision = Boolean(input.checked);
          } else if (field === 'x' || field === 'y' || field === 'w' || field === 'h' || field === 'size' || field === 'width' || field === 'height') {
            const val = parseFloat(input.value);
            if (!Number.isNaN(val)) {
              ref[field] = val;
              if (kind === 'spawnP1') this.game.p1.setPosition(ref.x, ref.y);
              if (kind === 'spawnP2') this.game.p2.setPosition(ref.x, ref.y);
              if (kind === 'trash') this._syncTrashToMapCustomList(ref);
            }
          } else if (field === 'rotation') {
            ref.rotation = parseFloat(input.value) || 0;
            if (kind === 'trash') this._syncTrashToMapCustomList(ref);
          } else if (field === 'bgColor') {
            ref.palette.bg = input.value;
          } else {
            ref[field] = input.value;
          }
          this.saveToLocalStorage();
        });
      });

      // Input manual de caminho de sprite (ex: assets/arvore.png)
      const spritePathInput = this.inspectorBody.querySelector('#ed-sprite-path-input');
      if (spritePathInput) {
        spritePathInput.addEventListener('change', () => {
          const val = spritePathInput.value.trim();
          if (val && val !== '[Imagem Base64 Embutida]') {
            if (window.SpriteCache) window.SpriteCache.preload(val);
            this.applySpriteToEntity(this.selected, val, val);
            this.saveToLocalStorage();
          }
        });
      }

      // Botão limpar sprite
      const btnClearSprite = this.inspectorBody.querySelector('#ed-btn-clear-sprite');
      if (btnClearSprite) {
        btnClearSprite.addEventListener('click', () => {
          this.applySpriteToEntity(this.selected, null, 'Padrão');
          this.saveToLocalStorage();
        });
      }

      // Dropzone exclusivo do Inspector
      const inspDrop = this.inspectorBody.querySelector('#ed-inspector-dropzone');
      if (inspDrop) {
        inspDrop.addEventListener('dragover', (e) => {
          e.preventDefault();
          inspDrop.classList.add('drag-active');
        });
        inspDrop.addEventListener('dragleave', () => inspDrop.classList.remove('drag-active'));
        inspDrop.addEventListener('drop', async (e) => {
          e.preventDefault();
          e.stopPropagation();
          inspDrop.classList.remove('drag-active');
          const files = Array.from(e.dataTransfer.files || []).filter((f) => f.type.startsWith('image/'));
          if (files[0]) {
            const entry = await this._registerDroppedFileInLibrary(files[0]);
            this.applySpriteToEntity(this.selected, this.getEffectiveSpriteValue(entry), files[0].name);
            this.saveToLocalStorage();
          }
        });
      }

      const btnDup = this.inspectorBody.querySelector('#ed-btn-dup-entity');
      if (btnDup) btnDup.addEventListener('click', () => this.duplicateSelectedEntity());

      const btnDel = this.inspectorBody.querySelector('#ed-btn-del-entity');
      if (btnDel) btnDel.addEventListener('click', () => this.deleteSelectedEntity());

      // Listeners de Drag & Drop nos 5 slots de inventário do Jogador selecionado
      this.inspectorBody.querySelectorAll('[data-inv-slot]').forEach((slotRow) => {
        const slotIdx = parseInt(slotRow.getAttribute('data-inv-slot'), 10);
        slotRow.addEventListener('dragover', (e) => {
          e.preventDefault();
          slotRow.classList.add('drag-active');
        });
        slotRow.addEventListener('dragleave', () => slotRow.classList.remove('drag-active'));
        slotRow.addEventListener('drop', async (e) => {
          e.preventDefault();
          e.stopPropagation();
          slotRow.classList.remove('drag-active');
          const files = Array.from(e.dataTransfer.files || []).filter((f) => f.type.startsWith('image/'));
          if (files[0] && ref.inventory && ref.inventory[slotIdx]) {
            const entry = await this._registerDroppedFileInLibrary(files[0]);
            ref.inventory[slotIdx].sprite = this.getEffectiveSpriteValue(entry);
            this.game.ui.renderHotbar();
            this._renderInspector();
            this.saveToLocalStorage();
            this.game.ui.showToast(`🖼️ Sprite aplicado ao Slot ${slotIdx + 1} (${ref.inventory[slotIdx].shortName})!`, 1800);
          }
        });
      });
    }

    _renderTrashTypesCatalog() {
      if (!this.trashTypesListEl) return;
      this.trashTypesListEl.innerHTML = '';

      window.GameConfig.TRASH_TYPES.forEach((t) => {
        const row = document.createElement('div');
        row.className = 'ed-trash-type-row ed-dropzone';
        row.title = 'Arraste uma imagem aqui para mudar o sprite de todos os itens deste tipo de lixo';
        row.innerHTML = `
          <div class="ed-trash-dot" style="background:${t.color}">
            ${t.sprite ? `<img src="${t.sprite}" alt="" />` : ''}
          </div>
          <span class="ed-trash-name">${t.name}</span>
          <span class="ed-trash-hint">${t.sprite ? '✓ Sprite' : 'Soltar img'}</span>
        `;

        row.addEventListener('dragover', (e) => {
          e.preventDefault();
          row.classList.add('drag-active');
        });
        row.addEventListener('dragleave', () => row.classList.remove('drag-active'));
        row.addEventListener('drop', async (e) => {
          e.preventDefault();
          e.stopPropagation();
          row.classList.remove('drag-active');
          const files = Array.from(e.dataTransfer.files || []).filter((f) => f.type.startsWith('image/'));
          if (files[0]) {
            const entry = await this._registerDroppedFileInLibrary(files[0]);
            t.sprite = this.getEffectiveSpriteValue(entry);
            this._renderTrashTypesCatalog();
            this.saveToLocalStorage();
            this.game.ui.showToast(`🖼️ Sprite global aplicado a "${t.name}"!`, 1800);
          }
        });

        this.trashTypesListEl.appendChild(row);
      });
    }

    _renderSpriteLibrary() {
      if (!this.spriteLibraryGrid) return;
      this.spriteLibraryGrid.innerHTML = '';

      if (this.spriteLibrary.length === 0) {
        this.spriteLibraryGrid.innerHTML = `<div class="ed-empty-msg">Nenhuma imagem carregada ainda.</div>`;
        return;
      }

      this.spriteLibrary.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'ed-lib-card';
        card.title = `Clique para aplicar "${item.name}" na entidade selecionada`;
        card.innerHTML = `
          <img src="${item.dataUrl}" alt="${item.name}" />
          <span>${item.name}</span>
        `;
        card.addEventListener('click', () => {
          if (!this.selected) {
            this.game.ui.showToast('Selecione primeiro um elemento no mapa para aplicar este Sprite!', 1800);
            return;
          }
          const val = this.getEffectiveSpriteValue(item);
          this.applySpriteToEntity(this.selected, val, item.name);
          this.saveToLocalStorage();
        });
        this.spriteLibraryGrid.appendChild(card);
      });
    }

    // =========================================================================
    // ESTILOS CSS ISOLADOS DO EDITOR (INJETADOS DINAMICAMENTE)
    // =========================================================================
    _injectStyles() {
      if (document.getElementById('map-editor-styles')) return;
      const style = document.createElement('style');
      style.id = 'map-editor-styles';
      style.textContent = `
        .map-editor-toggle-pill {
          position: fixed;
          bottom: 16px;
          left: 18px;
          z-index: 60;
          background: rgba(15, 23, 42, 0.92);
          border: 2px solid #22d3ee;
          color: #f8fafc;
          font-family: Consolas, monospace;
          font-size: 0.78rem;
          font-weight: 800;
          padding: 7px 13px;
          border-radius: 999px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.65);
          transition: all 0.15s ease;
        }
        .map-editor-toggle-pill:hover,
        .map-editor-toggle-pill.active {
          background: #0e7490;
          border-color: #ffca3a;
          color: #fff;
        }
        .map-editor-root {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 55;
          font-family: 'Segoe UI', system-ui, sans-serif;
        }
        .ed-topbar {
          pointer-events: auto;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          min-height: 50px;
          background: rgba(15, 23, 42, 0.96);
          border-bottom: 2px solid #38bdf8;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
          padding: 6px 14px;
          box-shadow: 0 4px 18px rgba(0,0,0,0.65);
        }
        .ed-topbar-group {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .ed-title {
          font-family: Consolas, monospace;
          font-weight: 900;
          font-size: 0.82rem;
          color: #22d3ee;
          margin-right: 4px;
        }
        .ed-select, .ed-input {
          background: #1e293b;
          border: 1px solid #475569;
          color: #f8fafc;
          border-radius: 6px;
          padding: 5px 8px;
          font-size: 0.76rem;
          font-family: Consolas, monospace;
        }
        .ed-select-sm {
          padding: 3px 6px;
          font-size: 0.72rem;
        }
        .ed-tool-btn, .ed-action-btn, .ed-mini-btn, .ed-chip-btn {
          background: #1e293b;
          border: 1px solid #475569;
          color: #e2e8f0;
          border-radius: 6px;
          padding: 5px 9px;
          font-size: 0.74rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.12s ease;
        }
        .ed-tool-btn:hover, .ed-action-btn:hover, .ed-chip-btn:hover {
          border-color: #38bdf8;
          background: #334155;
        }
        .ed-tool-btn.active, .ed-action-btn.active {
          background: #0284c7;
          border-color: #ffca3a;
          color: #fff;
        }
        .ed-btn-gold {
          background: #d97706;
          border-color: #facc15;
          color: #fff;
        }
        .ed-btn-danger {
          background: rgba(220, 38, 38, 0.25);
          border-color: #f87171;
          color: #fecaca;
        }
        .ed-inline-label {
          font-size: 0.74rem;
          color: #cbd5e1;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .ed-sidebar {
          pointer-events: auto;
          position: fixed;
          top: 56px;
          right: 12px;
          bottom: 12px;
          width: 325px;
          background: rgba(15, 23, 42, 0.95);
          border: 2px solid #38bdf8;
          border-radius: 12px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow-y: auto;
          box-shadow: 0 10px 30px rgba(0,0,0,0.75);
          color: #e2e8f0;
        }
        .ed-section {
          background: rgba(30, 41, 59, 0.65);
          border: 1px solid #334155;
          border-radius: 8px;
          padding: 8px 10px;
        }
        .ed-section-title {
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #38bdf8;
          margin-bottom: 6px;
        }
        .ed-section-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }
        .ed-quick-entities {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 5px;
        }
        .ed-chip-btn {
          padding: 4px 6px;
          font-size: 0.7rem;
          text-align: center;
        }
        .ed-inspector-body {
          display: flex;
          flex-direction: column;
          gap: 7px;
          font-size: 0.74rem;
        }
        .ed-inspector-body label {
          display: flex;
          flex-direction: column;
          gap: 3px;
          color: #cbd5e1;
        }
        .ed-checkbox-row {
          flex-direction: row !important;
          align-items: center;
          gap: 7px !important;
          cursor: pointer;
        }
        .ed-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
        }
        .ed-selected-badge {
          background: rgba(255, 202, 58, 0.16);
          border: 1px solid #ffca3a;
          color: #fde68a;
          padding: 4px 8px;
          border-radius: 5px;
          font-family: Consolas, monospace;
          font-weight: 700;
          font-size: 0.73rem;
        }
        .ed-sprite-box {
          margin-top: 4px;
          padding-top: 6px;
          border-top: 1px dashed #475569;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .ed-sprite-box-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .ed-dropzone {
          border: 2px dashed #475569;
          background: rgba(15, 23, 42, 0.65);
          border-radius: 8px;
          padding: 8px;
          text-align: center;
          font-size: 0.72rem;
          color: #94a3b8;
          transition: all 0.15s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .ed-dropzone.drag-active {
          border-color: #4ade80;
          background: rgba(34, 197, 94, 0.18);
          color: #ecfdf5;
        }
        .ed-sprite-preview-img {
          max-width: 90px;
          max-height: 70px;
          object-fit: contain;
          image-rendering: pixelated;
          border-radius: 4px;
          border: 1px solid #475569;
        }
        .ed-actions-row {
          display: flex;
          gap: 6px;
          margin-top: 4px;
        }
        .ed-actions-row button {
          flex: 1;
        }
        .ed-trash-types-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .ed-trash-type-row {
          flex-direction: row;
          justify-content: space-between;
          padding: 4px 8px;
          border-style: solid;
          border-width: 1px;
        }
        .ed-trash-dot {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }
        .ed-trash-dot img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .ed-trash-name {
          flex: 1;
          text-align: left;
          margin-left: 8px;
          color: #e2e8f0;
          font-weight: 600;
        }
        .ed-trash-hint {
          font-family: Consolas, monospace;
          font-size: 0.66rem;
          color: #38bdf8;
        }
        .ed-sprite-library-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          margin-top: 6px;
          max-height: 150px;
          overflow-y: auto;
        }
        .ed-lib-card {
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 6px;
          padding: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          cursor: pointer;
          font-size: 0.64rem;
          color: #cbd5e1;
        }
        .ed-lib-card:hover {
          border-color: #ffca3a;
        }
        .ed-lib-card img {
          width: 38px;
          height: 38px;
          object-fit: contain;
          image-rendering: pixelated;
        }
        .ed-lib-card span {
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .ed-empty-msg {
          font-size: 0.72rem;
          color: #94a3b8;
          text-align: center;
          padding: 6px 4px;
        }
        .ed-footer-hint {
          font-size: 0.69rem;
          color: #94a3b8;
          line-height: 1.35;
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Inicializa o Editor automaticamente após a criação do window.gameInstance
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      if (window.gameInstance) {
        window.mapEditor = new MapEditor(window.gameInstance);
      }
    }, 0);
  });
})();
