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
  console.log('🚀 Launching headless Chrome for Sprint 17 browser validation...');
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

    // 1. Verify buildMapCollisionBounds and collision array in live browser
    console.log('--- TEST 1: CollisionBounds Initialization & Pass-Through Filtering ---');
    const test1 = await evaluate(`
      (() => {
        if (!window.buildMapCollisionBounds) return { ok: false, err: 'buildMapCollisionBounds not found' };
        if (!window.game || !window.game.currentMap) return { ok: false, err: 'game or currentMap not found' };

        const map = window.game.currentMap;
        const overheadInColl = (map.collisionBounds || []).filter(o => o.isOverhead === true || o.collisionType === 'overhead' || o.layer === 3);
        const overheadInObs = (map.obstacles || []).filter(o => o.isOverhead === true || o.collisionType === 'overhead' || o.layer === 3);

        return {
          ok: true,
          mapKey: map.id,
          totalObstacles: map.obstacles ? map.obstacles.length : 0,
          totalCollisionBounds: map.collisionBounds ? map.collisionBounds.length : 0,
          overheadInColl: overheadInColl.length,
          overheadInObs: overheadInObs.length
        };
      })()
    `);
    console.log('Test 1 result:', test1);
    if (!test1.ok || test1.overheadInColl > 0 || test1.overheadInObs > 0) {
      throw new Error('Test 1 failed: Overhead objects found in collisionBounds or obstacles!');
    }

    // 2. Test Player Pass-Through in Overhead Coordinates
    console.log('--- TEST 2: Player Movement Pass-Through Across Overhead Zones ---');
    const test2 = await evaluate(`
      (() => {
        const p1 = window.game.p1;
        const map = window.game.currentMap;

        // Position player right before one of the overhead zones (poly at x: 336, y: 592)
        p1.setPosition(320, 592);
        const initialX = p1.x;

        // Step player update moving right directly through the overhead zone
        p1.update(0.2, { dx: 1, dy: 0 }, map, null);

        return {
          initialX,
          newX: p1.x,
          passedThrough: p1.x > initialX
        };
      })()
    `);
    console.log('Test 2 result:', test2);
    if (!test2.passedThrough) {
      throw new Error('Test 2 failed: Player was repelled or blocked by overhead zone!');
    }

    // 3. Test draw() method exists and sequence
    console.log('--- TEST 3: draw() Method and Z-Sorting Sequence ---');
    const test3 = await evaluate(`
      (() => {
        const game = window.game;
        const hasDraw = typeof game.draw === 'function';
        const hasRenderScene = typeof game._renderScene === 'function';

        // Call draw() to ensure no runtime errors
        game.draw();

        return {
          hasDraw,
          hasRenderScene,
          callSuccess: true
        };
      })()
    `);
    console.log('Test 3 result:', test3);
    if (!test3.hasDraw || !test3.hasRenderScene || !test3.callSuccess) {
      throw new Error('Test 3 failed: draw() or _renderScene failed!');
    }

    // 4. Test MapEditor Export without Overhead in obstacles/collisionBounds
    console.log('--- TEST 4: MapEditor JSON Export Verification ---');
    const test4 = await evaluate(`
      (() => {
        const editor = window.game.editor;
        if (!editor) return { ok: false, err: 'editor not found' };

        const exportData = editor.compileExportData();
        const obsWithOverhead = (exportData.obstacles || []).filter(o => o.isOverhead === true || o.collisionType === 'overhead' || o.layer === 3);
        const collWithOverhead = (exportData.collisionBounds || []).filter(o => o.isOverhead === true || o.collisionType === 'overhead' || o.layer === 3);

        return {
          ok: true,
          totalObstacles: exportData.obstacles.length,
          totalCollisionBounds: exportData.collisionBounds.length,
          totalOverheadZones: exportData.overheadZones.length,
          obsWithOverhead: obsWithOverhead.length,
          collWithOverhead: collWithOverhead.length
        };
      })()
    `);
    console.log('Test 4 result:', test4);
    if (!test4.ok || test4.obsWithOverhead > 0 || test4.collWithOverhead > 0) {
      throw new Error('Test 4 failed: Exported JSON contains overhead items in obstacles!');
    }

    console.log('🎉 ALL 4 SPRINT 17 BROWSER VALIDATION TESTS PASSED IN HEADLESS CHROME!');
  } finally {
    chrome.kill();
  }
}

run().catch((err) => {
  console.error('Browser Test Error:', err);
  process.exit(1);
});
