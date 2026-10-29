const { spawn } = require('child_process');
const http = require('http');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const gamePath = 'file:///c:/Users/gsmaz/OneDrive/Documentos/GitHub/Gamejam-/index.html';

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('🚀 Launching headless Chrome for Sprint 13 validation...');
  const chrome = spawn(chromePath, [
    '--headless',
    '--remote-debugging-port=9222',
    '--disable-extensions',
    '--disable-gpu',
    gamePath
  ]);

  try {
    let targets = null;
    for (let i = 0; i < 20; i++) {
      await wait(500);
      try {
        targets = await fetchJson('http://localhost:9222/json');
        if (targets && targets.length > 0) break;
      } catch (e) {}
    }

    if (!targets) throw new Error('Could not connect to Chrome debugging port');
    const pageTarget = targets.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension://'));
    if (!pageTarget) throw new Error('No page target found');

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
    });

    let msgId = 1;
    function sendCdp(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        const handler = (evt) => {
          const resp = JSON.parse(evt.data);
          if (resp.id === id) {
            ws.removeEventListener('message', handler);
            if (resp.error) reject(resp.error);
            else resolve(resp.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    async function evaluate(expression) {
      const res = await sendCdp('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true
      });
      if (res.exceptionDetails) {
        throw new Error('Evaluation error: ' + JSON.stringify(res.exceptionDetails));
      }
      return res.result.value;
    }

    console.log('Waiting for game to initialize...');
    await wait(2000);

    // 1. Open Editor (F6)
    console.log('--- TEST 1: Open Editor and Verify Scene Structure ---');
    const initRes = await evaluate(`
      (() => {
        if (!window.game || !window.game.editor) return { ok: false, err: 'game or editor not found' };
        window.game.editor.open();
        const map = window.game.currentMap;
        return {
          ok: true,
          active: window.game.editor.active,
          hasScenes: Array.isArray(map.scenes),
          scenesCount: map.scenes.length,
          currentScene: map.currentScene,
          sceneName: map.scenes[0].name,
          sceneCondition: map.scenes[0].condition,
          hasSceneDropdown: Boolean(document.getElementById('editor-scene-dropdown')),
          hasAddSceneBtn: Boolean(document.getElementById('btn-editor-add-scene')),
          hasTriggerModal: Boolean(document.getElementById('editor-trigger-modal')),
          hasAnimModal: Boolean(document.getElementById('editor-animation-modal')),
          hasSceneModal: Boolean(document.getElementById('editor-scene-modal'))
        };
      })()
    `);
    console.log('Init result:', initRes);
    if (!initRes.ok || !initRes.hasScenes || initRes.scenesCount !== 1) {
      throw new Error('Test 1 failed: Scene structure initialization invalid');
    }
    if (!initRes.hasSceneDropdown || !initRes.hasAddSceneBtn || !initRes.hasTriggerModal || !initRes.hasAnimModal || !initRes.hasSceneModal) {
      throw new Error('Test 1 failed: Required DOM elements or modals missing');
    }

    // 2. Test Multi-Scenes & Data Isolation
    console.log('--- TEST 2: Add Scene 2 and Verify Data Isolation ---');
    const sceneIsoRes = await evaluate(`
      (() => {
        const editor = window.game.editor;
        const map = window.game.currentMap;
        const s1ItemCountBefore = map.scenes[0].layers[2].items.length;

        // Add Scene 2 with trigger condition
        editor.addScene('Cena 2 (Pós-Energia)', 'O mapa muda para essa cena depois que a energia volta');
        const s2Created = map.scenes.length === 2 && map.currentScene === 1;

        // Now add a unique obstacle only in Scene 2
        const uniqueItem = {
          id: 'test_scene2_unique_obstacle',
          type: 'obstacle',
          x: 777,
          y: 888,
          w: 50,
          h: 50,
          label: 'OBSTACULO_CENA_2',
          layer: 2
        };
        map.layers[2].items.push(uniqueItem);
        editor.syncLayerReferences(map);

        const s2ItemCount = map.scenes[1].layers[2].items.length;
        const s1ItemCountAfter = map.scenes[0].layers[2].items.length;

        const hasInScene2 = map.scenes[1].layers[2].items.some(it => it.id === 'test_scene2_unique_obstacle');
        const hasInScene1 = map.scenes[0].layers[2].items.some(it => it.id === 'test_scene2_unique_obstacle');

        // Switch back to Scene 1
        editor.switchScene(0);
        const inScene1Active = map.currentScene === 0;
        const scene1ActiveHasItem = map.layers[2].items.some(it => it.id === 'test_scene2_unique_obstacle');

        // Switch back to Scene 2
        editor.switchScene(1);
        const inScene2Active = map.currentScene === 1;
        const scene2ActiveHasItem = map.layers[2].items.some(it => it.id === 'test_scene2_unique_obstacle');

        return {
          s2Created,
          s1ItemCountBefore,
          s1ItemCountAfter,
          s2ItemCount,
          hasInScene2,
          hasInScene1,
          isolated: (hasInScene2 === true && hasInScene1 === false),
          inScene1Active,
          scene1ActiveHasItem,
          inScene2Active,
          scene2ActiveHasItem
        };
      })()
    `);
    console.log('Scene Isolation result:', sceneIsoRes);
    if (!sceneIsoRes.s2Created || !sceneIsoRes.isolated || sceneIsoRes.scene1ActiveHasItem || !sceneIsoRes.scene2ActiveHasItem) {
      throw new Error('Test 2 failed: Scene data isolation not strictly maintained');
    }

    // 3. Test Context Menu with 4 Primary Options
    console.log('--- TEST 3: Right-Click Context Menu Options ---');
    const menuRes = await evaluate(`
      (() => {
        const editor = window.game.editor;
        editor._showContextMenu(250, 150, null);
        const menu = document.getElementById('editor-context-menu');
        const isVisible = menu && !menu.classList.contains('hidden') && menu.style.display !== 'none';
        
        const optOverhead = Boolean(menu.querySelector('[data-action="action-overhead"]'));
        const optTrigger = Boolean(menu.querySelector('[data-action="action-trigger"]'));
        const optAnim = Boolean(menu.querySelector('[data-action="action-animation"]'));
        const optScenes = Boolean(menu.querySelector('[data-action="action-scenes"]'));

        editor._hideContextMenu();
        return {
          isVisible,
          optOverhead,
          optTrigger,
          optAnim,
          optScenes
        };
      })()
    `);
    console.log('Context Menu result:', menuRes);
    if (!menuRes.isVisible || !menuRes.optOverhead || !menuRes.optTrigger || !menuRes.optAnim || !menuRes.optScenes) {
      throw new Error('Test 3 failed: Context menu or 4 required options not found');
    }

    // 4. Test "Por Cima" (Overhead)
    console.log('--- TEST 4: "Por Cima" (Overhead) Functionality ---');
    const overheadRes = await evaluate(`
      (() => {
        const editor = window.game.editor;
        const map = window.game.currentMap;
        
        // Create an overhead zone via action-overhead
        editor._handleContextMenuAction('action-overhead', null, { x: 500, y: 400 });
        const overheadItem = editor.selectedItem;
        
        return {
          created: Boolean(overheadItem),
          isOverhead: Boolean(overheadItem && overheadItem.isOverhead),
          collisionType: overheadItem ? overheadItem.collisionType : null,
          isTrigger: overheadItem ? overheadItem.isTrigger : null
        };
      })()
    `);
    console.log('Overhead result:', overheadRes);
    if (!overheadRes.created || !overheadRes.isOverhead || overheadRes.collisionType !== 'overhead' || overheadRes.isTrigger) {
      throw new Error('Test 4 failed: "Por Cima" overhead configuration invalid');
    }

    // 5. Test "Trigger" with modal and ai_instruction
    console.log('--- TEST 5: "Trigger" & Modal & ai_instruction ---');
    const triggerRes = await evaluate(`
      (() => {
        const editor = window.game.editor;
        const map = window.game.currentMap;
        
        // Trigger action opens trigger modal
        editor._handleContextMenuAction('action-trigger', null, { x: 300, y: 300 });
        const triggerItem = editor.selectedItem;
        const modal = document.getElementById('editor-trigger-modal');
        const modalVisible = modal && !modal.classList.contains('hidden');

        // Fill instruction in modal and save
        const inputInst = modal.querySelector('#trigger-instruction-input');
        const inputLabel = modal.querySelector('#trigger-label-input');
        inputInst.value = 'Abrir menu da loja secreta quando o jogador pisar aqui';
        inputLabel.value = 'TRIGGER_LOJA';

        editor._saveTriggerModal();
        const modalClosed = modal.classList.contains('hidden');

        return {
          created: Boolean(triggerItem),
          modalVisible,
          modalClosed,
          isTrigger: triggerItem ? triggerItem.isTrigger : null,
          collisionType: triggerItem ? triggerItem.collisionType : null,
          ai_instruction: triggerItem ? triggerItem.ai_instruction : null,
          label: triggerItem ? triggerItem.label : null
        };
      })()
    `);
    console.log('Trigger result:', triggerRes);
    if (!triggerRes.created || !triggerRes.isTrigger || triggerRes.collisionType !== 'trigger' ||
        triggerRes.ai_instruction !== 'Abrir menu da loja secreta quando o jogador pisar aqui' ||
        !triggerRes.modalClosed) {
      throw new Error('Test 5 failed: Trigger or ai_instruction configuration invalid');
    }

    // 6. Test "Animação" Marker & Modal
    console.log('--- TEST 6: "Animação" Marker & ai_instruction ---');
    const animRes = await evaluate(`
      (() => {
        const editor = window.game.editor;
        const map = window.game.currentMap;
        
        // Animação action opens modal
        editor._handleContextMenuAction('action-animation', null, { x: 420, y: 240 });
        const modal = document.getElementById('editor-animation-modal');
        const modalVisible = modal && !modal.classList.contains('hidden');

        // Fill prompt in modal and save
        const inputInst = modal.querySelector('#anim-instruction-input');
        const inputLabel = modal.querySelector('#anim-label-input');
        inputInst.value = 'Fumaça verde e densa saindo do duto de ventilação danificado';
        inputLabel.value = 'EFEITO_FUMACA_VERDE';

        editor._saveAnimationModal();
        const modalClosed = modal.classList.contains('hidden');
        const animItem = editor.selectedItem;

        return {
          modalVisible,
          modalClosed,
          created: Boolean(animItem),
          type: animItem ? animItem.type : null,
          isAnimationMarker: Boolean(animItem && animItem.isAnimationMarker),
          ai_instruction: animItem ? animItem.ai_instruction : null,
          label: animItem ? animItem.label : null,
          x: animItem ? animItem.x : null,
          y: animItem ? animItem.y : null
        };
      })()
    `);
    console.log('Animation Marker result:', animRes);
    if (!animRes.created || animRes.type !== 'animation_marker' || !animRes.isAnimationMarker ||
        animRes.ai_instruction !== 'Fumaça verde e densa saindo do duto de ventilação danificado' ||
        !animRes.modalClosed) {
      throw new Error('Test 6 failed: Animation marker creation invalid');
    }

    // 7. Test Unified JSON Export
    console.log('--- TEST 7: Unified JSON Export ---');
    const exportRes = await evaluate(`
      (() => {
        const editor = window.game.editor;
        const data = editor.compileExportData();

        return {
          hasMapId: Boolean(data.mapId),
          currentScene: data.currentScene,
          scenesCount: data.scenes ? data.scenes.length : 0,
          scene1Name: data.scenes && data.scenes[0] ? data.scenes[0].name : null,
          scene2Name: data.scenes && data.scenes[1] ? data.scenes[1].name : null,
          scene2Condition: data.scenes && data.scenes[1] ? data.scenes[1].condition : null,
          hasOverheadZones: Array.isArray(data.overheadZones) && data.overheadZones.length > 0,
          hasTriggerZones: Array.isArray(data.triggerZones) && data.triggerZones.length > 0,
          hasAnimMarkers: Array.isArray(data.animationMarkers) && data.animationMarkers.length > 0,
          triggerInstruction: data.triggerZones && data.triggerZones[0] ? data.triggerZones[0].ai_instruction : null,
          animInstruction: data.animationMarkers && data.animationMarkers[0] ? data.animationMarkers[0].ai_instruction : null,
          hasLegacyLayers: Array.isArray(data.layers),
          hasLegacyObstacles: Array.isArray(data.obstacles)
        };
      })()
    `);
    console.log('Export JSON result:', exportRes);
    if (!exportRes.hasMapId || exportRes.scenesCount !== 2 || exportRes.currentScene !== 1 ||
        !exportRes.hasOverheadZones || !exportRes.hasTriggerZones || !exportRes.hasAnimMarkers ||
        !exportRes.triggerInstruction || !exportRes.animInstruction ||
        !exportRes.hasLegacyLayers || !exportRes.hasLegacyObstacles) {
      throw new Error('Test 7 failed: Unified JSON export format does not satisfy Sprint 13 specification');
    }

    // 8. Test History / Undo (Ctrl+Z)
    console.log('--- TEST 8: History and Undo (Ctrl+Z) ---');
    const undoRes = await evaluate(`
      (() => {
        const editor = window.game.editor;
        const map = window.game.currentMap;
        const countBefore = map.layers[2].items.length;
        
        // Perform undo
        const undone = editor.desfazer();
        const countAfter = map.layers[2].items.length;

        return {
          undone: Boolean(undone),
          countBefore,
          countAfter
        };
      })()
    `);
    console.log('Undo result:', undoRes);
    if (!undoRes.undone) {
      throw new Error('Test 8 failed: Undo action was not executed');
    }

    console.log('\n======================================================');
    console.log('🎉 ALL SPRINT 13 TESTS PASSED SUCCESSFULLY! 100% OK!');
    console.log('======================================================\n');

  } finally {
    try {
      chrome.kill();
    } catch (e) {}
  }
}

run().catch((err) => {
  console.error('❌ TEST SUITE FAILED:', err);
  process.exit(1);
});

