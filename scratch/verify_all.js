const fs = require('fs');
const vm = require('vm');

console.log('Testing JS syntax and execution of all modules...');

const files = [
  './js/config.js',
  './js/sprites.js',
  './js/maps.js',
  './js/input.js',
  './js/entities.js',
  './js/camera.js',
  './js/water.js',
  './js/enemies.js',
  './js/ui.js',
  './js/history.js',
  './js/editor.js',
  './js/ui_editor.js',
  './js/main.js'
];

// Mock basic browser globals
const mockEl = () => {
  const el = {
    getContext: () => ({}),
    classList: { add: () => {}, remove: () => {}, contains: () => false },
    addEventListener: () => {},
    appendChild: () => {},
    removeChild: () => {},
    setAttribute: () => {},
    getAttribute: () => '0',
    style: {}
  };
  el.querySelector = () => mockEl();
  el.querySelectorAll = () => [];
  return el;
};

const sandbox = {
  window: {
    addEventListener: () => {},
    removeEventListener: () => {}
  },
  document: {
    createElement: mockEl,
    body: mockEl(),
    getElementById: () => mockEl(),
    querySelector: () => mockEl(),
    querySelectorAll: () => []
  },
  navigator: { userAgent: 'test' },
  console: console,
  Image: class { constructor() { this.naturalWidth = 100; this.complete = true; } },
  requestAnimationFrame: () => {},
  cancelAnimationFrame: () => {},
  addEventListener: () => {},
  removeEventListener: () => {}
};
sandbox.window = sandbox;

for (const f of files) {
  try {
    const code = fs.readFileSync(f, 'utf8');
    vm.runInNewContext(code, sandbox, { filename: f });
    console.log(`✅ ${f} syntax and evaluation passed!`);
  } catch (err) {
    console.error(`❌ Error in ${f}:`, err);
    process.exit(1);
  }
}

console.log('\n--- Checking GameMaps collisionBounds & obstacles ---');
for (const k of ['map1', 'van', 'map2', 'map3']) {
  const m = sandbox.window.GameMaps[k];
  console.log(`Map [${k}]: obstacles=${m.obstacles ? m.obstacles.length : 'none'}, collisionBounds=${m.collisionBounds ? m.collisionBounds.length : 'none'}`);
  if (m.obstacles) {
    const overhead = m.obstacles.filter(o => o.isOverhead === true || o.collisionType === 'overhead' || o.layer === 3);
    console.log(`  Overhead items in [${k}].obstacles: ${overhead.length}`);
    if (overhead.length > 0) {
      console.error(`  FAILURE: [${k}].obstacles contains overhead items!`);
      process.exit(1);
    }
  }
  if (m.collisionBounds) {
    const overhead = m.collisionBounds.filter(o => o.isOverhead === true || o.collisionType === 'overhead' || o.layer === 3);
    console.log(`  Overhead items in [${k}].collisionBounds: ${overhead.length}`);
    if (overhead.length > 0) {
      console.error(`  FAILURE: [${k}].collisionBounds contains overhead items!`);
      process.exit(1);
    }
  }
}

console.log('\n--- Checking Player collision against overhead object ---');
const PlayerClass = sandbox.window.Player;
const dummyPlayer = new PlayerClass({ id: 'p1', name: 'Test', color: '#ff0000', size: 48 });

const overheadObs = { x: 100, y: 100, w: 50, h: 50, isOverhead: true };
const solidObs = { x: 100, y: 100, w: 50, h: 50 };
const ceilingObs = { x: 100, y: 100, w: 50, h: 50, layer: 3 };

console.log('Player._isSolid(solidObs):', dummyPlayer._isSolid(solidObs), '(expected true)');
console.log('Player._isSolid(overheadObs):', dummyPlayer._isSolid(overheadObs), '(expected false)');
console.log('Player._isSolid(ceilingObs):', dummyPlayer._isSolid(ceilingObs), '(expected false)');

if (dummyPlayer._isSolid(overheadObs) || dummyPlayer._isSolid(ceilingObs) || !dummyPlayer._isSolid(solidObs)) {
  console.error('FAILURE: Player._isSolid did not pass validation!');
  process.exit(1);
}

console.log('\n--- Checking Enemy collision against overhead object ---');
const ScratcherClass = sandbox.window.ScratcherRat;
const dummyEnemy = new ScratcherClass({ id: 'e1', x: 200, y: 200, radius: 20, size: 40 });
// Test _moveWithCollision with a map containing only an overhead obstacle
const dummyMap = {
  width: 1000,
  height: 1000,
  obstacles: [overheadObs, ceilingObs]
};
// Try moving enemy right through the overhead obstacle (at x: 100, y: 100)
dummyEnemy.x = 90;
dummyEnemy.y = 120;
dummyEnemy._moveWithCollision(1, 40, 0, dummyMap);
console.log('Enemy moved through overhead obstacle: x =', dummyEnemy.x, '(expected 130)');
if (dummyEnemy.x !== 130) {
  console.error('FAILURE: Enemy was blocked by overhead obstacle! Enemy x:', dummyEnemy.x);
  process.exit(1);
}

console.log('\n--- Checking Editor syncLayerReferences & compileExportData ---');
const dummyGame = {
  canvas: mockEl(),
  currentMap: sandbox.window.GameMaps.van,
  ui: { showToast: () => {} }
};
const editor = new sandbox.window.MapEditor(dummyGame);
editor.syncLayerReferences(sandbox.window.GameMaps.van);

const exported = editor.compileExportData();
console.log('Exported cleanObstacles count:', exported.obstacles.length);
console.log('Exported collisionBounds count:', exported.collisionBounds.length);
const exportedOverheads = exported.obstacles.filter(o => o.isOverhead === true || o.collisionType === 'overhead' || o.layer === 3);
console.log('Overhead items in exported obstacles:', exportedOverheads.length);
if (exportedOverheads.length > 0) {
  console.error('FAILURE: Exported obstacles contains overhead items!');
  process.exit(1);
}

console.log('\n--- Checking Game.draw() and rendering queue structure ---');
// Create canvas mock
const canvasMock = {
  width: 1280,
  height: 720,
  getContext: () => ({
    save: () => {},
    restore: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    beginPath: () => {},
    closePath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    arc: () => {},
    ellipse: () => {},
    fill: () => {},
    stroke: () => {},
    fillRect: () => {},
    strokeRect: () => {},
    fillText: () => {},
    drawImage: () => {},
    createRadialGradient: () => ({ addColorStop: () => {} })
  })
};

const drawCalls = [];
// Verify that in draw, overhead sprites render strictly AFTER players and enemies
// Let's create a test map with 1 normal furniture sprite, 1 overhead sprite, 1 player, 1 enemy
const testMap = {
  id: 'test_map',
  width: 1000,
  height: 1000,
  imageAsset: 'test.png',
  layers: [
    { id: 0, name: 'Chão', visible: true, items: [] },
    { id: 1, name: 'Tapetes', visible: true, items: [] },
    {
      id: 2,
      name: 'Objetos',
      visible: true,
      items: [
        { type: 'sprite', id: 'furniture_mid', x: 200, y: 300, w: 60, h: 80, src: 'fake.png' },
        { type: 'sprite', id: 'pipe_overhead', x: 200, y: 250, w: 60, h: 80, isOverhead: true, src: 'fake.png' }
      ]
    },
    {
      id: 3,
      name: 'Teto',
      visible: true,
      items: [
        { type: 'sprite', id: 'ceiling_beam', x: 200, y: 100, w: 60, h: 80, src: 'fake.png' }
      ]
    }
  ]
};

const testGame = {
  canvas: canvasMock,
  ctx: canvasMock.getContext(),
  currentMap: testMap,
  mapImages: new Map(),
  players: [
    {
      id: 'p1',
      x: 200,
      y: 280,
      size: 48,
      height: 48,
      draw: () => { drawCalls.push('player_draw'); }
    }
  ],
  enemyManager: {
    enemies: [
      {
        id: 'enemy1',
        x: 200,
        y: 260,
        radius: 20,
        isDead: false,
        draw: () => { drawCalls.push('enemy_draw'); }
      }
    ],
    projectiles: []
  },
  trashItems: [],
  floatingTexts: [],
  activePlayerIndex: 0,
  gameMode: 'singleplayer',
  elapsedTime: 1.0,
  camera: { getRenderOffset: () => ({ offsetX: 0, offsetY: 0 }) },
  _drawRotatedSpriteItem: (ctx, item) => { drawCalls.push(`sprite_${item.id}`); },
  _drawFloorZones: () => {},
  _drawSafeRoomStationsZones: () => {},
  _drawTransitionZone: () => {},
  _drawElevatedParallaxStructures: () => {},
  _drawMapAnimationMarkers: () => {},
  _drawSafeRoomStationFloatingNotice: () => {}
};

// Bind _renderScene from Game prototype
const GameClass = sandbox.Game || sandbox.window.Game;
GameClass.prototype._renderScene.call(testGame);

console.log('Sequence of draw calls:', drawCalls);

// Verify sequence:
// 1. furniture_mid (bottomY = 300 + 80 = 380) vs enemy (bottomY = 260 + 20 = 280) vs player (bottomY = 280 + 24 = 304)
// Midground sorted: enemy (280) -> player (304) -> furniture (380)
// 2. Foreground Overhead: pipe_overhead and ceiling_beam MUST be drawn strictly AFTER player and enemy!
const playerIdx = drawCalls.indexOf('player_draw');
const enemyIdx = drawCalls.indexOf('enemy_draw');
const furnitureIdx = drawCalls.indexOf('sprite_furniture_mid');
const pipeIdx = drawCalls.indexOf('sprite_pipe_overhead');
const beamIdx = drawCalls.indexOf('sprite_ceiling_beam');

console.log('Draw call indices:', { enemyIdx, playerIdx, furnitureIdx, pipeIdx, beamIdx });

if (pipeIdx <= playerIdx || beamIdx <= playerIdx || pipeIdx <= enemyIdx || beamIdx <= enemyIdx || pipeIdx <= furnitureIdx || beamIdx <= furnitureIdx) {
  console.error('FAILURE: Overhead items were drawn BEFORE entities!');
  process.exit(1);
}

if (enemyIdx > playerIdx || playerIdx > furnitureIdx) {
  console.error('FAILURE: Midground Y-Sorting order was incorrect!');
  process.exit(1);
}

console.log('✅ Midground entities ordered correctly by bottomY (enemy -> player -> furniture)!');
console.log('✅ Foreground Overhead items rendered strictly AFTER all midground entities!');
console.log('\n🎉 ALL SPRINT 17 VALIDATIONS PASSED!');
