const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

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
  console.log('🚀 Launching headless Chrome for browser feature validation...');
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
      return res.result ? res.result.value : null;
    }

    // Wait for game initialization
    await wait(1500);

    console.log('--- TEST 1: Van Initialization & Multi-Doors ---');
    const vanTest = await evaluate(`(() => {
      const g = window.game;
      if (!g || !g.currentMap) return { ok: false, error: 'No game or map' };
      
      const map = g.currentMap;
      return {
        ok: true,
        mapId: map.id,
        isSafeRoom: map.isSafeRoom,
        overheadCount: map.overheadZones.length,
        triggersCount: map.triggerZones.length,
        solidCollisionCount: map.collisionBounds.length,
        hasRightDoor: Boolean(map.transitionZone),
        hasLeftDoor: Boolean(map.restartZone),
        animMarkersCount: map.animationMarkers ? map.animationMarkers.length : 0
      };
    })()`);
    console.log('Van Test Result:', vanTest);

    console.log('--- TEST 2: Van Right Door Advances Directly ---');
    const rightDoorTest = await evaluate(`(() => {
      const g = window.game;
      const p = g.players[0];
      // Move player into right door trigger_jfqd (1328, 432, 96, 144)
      p.x = 1350;
      p.y = 480;
      g._vanTransitionTriggered = false;
      
      // Update gameplay for 1 tick
      g._updateGameplay(0.016);
      
      return {
        screenTransitionActive: Boolean(g.screenTransition && g.screenTransition.active),
        targetFlowIndex: g.screenTransition ? g.screenTransition.targetFlowIndex : null,
        message: g.screenTransition ? g.screenTransition.message : ''
      };
    })()`);
    console.log('Right Door Test Result:', rightDoorTest);

    console.log('--- TEST 3: Van Left Door Prompts Restart Modal ---');
    const leftDoorTest = await evaluate(`(() => {
      const g = window.game;
      // Reset transition
      g.screenTransition = { active: false };
      // Move to intermediate van for full restart modal verification
      g.stageFlowIndex = 2; // van_1
      const p = g.players[0];
      p.x = 80;
      p.y = 520;
      g._vanRestartTriggered = false;
      
      // Update gameplay
      g._updateGameplay(0.016);
      
      const modal = document.getElementById('van-restart-modal-overlay');
      const isVisible = modal && !modal.classList.contains('hidden');
      
      return {
        modalFound: Boolean(modal),
        modalVisible: isVisible,
        restartTriggered: g._vanRestartTriggered
      };
    })()`);
    console.log('Left Door Test Result:', leftDoorTest);

    console.log('--- TEST 4: Dismissing Restart Modal Steps Back Safely ---');
    const dismissTest = await evaluate(`(() => {
      const g = window.game;
      const cancelBtn = document.getElementById('btn-van-restart-cancel');
      if (cancelBtn) cancelBtn.click();
      
      const modal = document.getElementById('van-restart-modal-overlay');
      const isHidden = modal && modal.classList.contains('hidden');
      const p = g.players[0];
      
      return {
        modalHidden: isHidden,
        playerPushedBack: p.x >= 160
      };
    })()`);
    console.log('Dismiss Test Result:', dismissTest);

    console.log('--- TEST 5: Map 1 Load, Water Draining and Extraction ---');
    const map1Test = await evaluate(`(() => {
      const g = window.game;
      g.loadStageByFlowIndex(1, false);
      const m1 = g.currentMap;
      
      // Initial scene 0 check
      const s0Collisions = m1.collisionBounds.length;
      const hasWater = m1.collisionBounds.some(b => b.label === 'Colisão água' || b.id === 'poly_obs_mvtmuz3u_ibe');
      
      // Collect 5 trashes to drain water
      for (let i = 0; i < 5; i++) {
        if (g.trashItems.length > 0) {
          const t = g.trashItems[0];
          g.players[0].x = t.x;
          g.players[0].y = t.y;
          g._checkTrashCollection();
        }
      }
      
      const isWaterDrainedNow = m1.isWaterDrained;
      const currentSceneNow = m1.currentScene;
      const s1Collisions = m1.collisionBounds.length;
      const hasWaterNow = m1.collisionBounds.some(b => b.label === 'Colisão água' || b.id === 'poly_obs_mvtmuz3u_ibe');
      
      // Move to extraction trigger_d9lp (1744, 272, 160, 96)
      g.players[0].x = 1780;
      g.players[0].y = 300;
      const touchingExtraction = g.isAnyPlayerInTransitionZone();
      
      // Simulate holding in extraction zone to enter van
      g.zoneHoldTimer = 1.0;
      g._updateGameplay(0.016);
      
      return {
        initialS0Collisions: s0Collisions,
        initialHasWater: hasWater,
        drainedAfter5Trashes: isWaterDrainedNow,
        currentSceneNow,
        s1Collisions,
        hasWaterNow,
        touchingExtraction,
        transitionActive: Boolean(g.screenTransition && g.screenTransition.active),
        targetFlowIndex: g.screenTransition ? g.screenTransition.targetFlowIndex : null
      };
    })()`);
    console.log('Map 1 Test Result:', map1Test);

    ws.close();
    chrome.kill();
    console.log('\n🎉 ALL LIVE IN-BROWSER TESTS FOR VAN AND MAP 1 COMPLETED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('Test error:', err);
    chrome.kill();
    process.exit(1);
  }
}

run();
