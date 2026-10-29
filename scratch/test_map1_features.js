const fs = require('fs');
const vm = require('vm');
const path = require('path');

// Setup mock browser environment
const domListeners = {};
const mockCanvas = {
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
    fill: () => {},
    stroke: () => {},
    fillRect: () => {},
    strokeRect: () => {},
    clearRect: () => {},
    drawImage: () => {},
    fillText: () => {},
    measureText: () => ({ width: 10 }),
    setTransform: () => {},
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    font: '',
    textAlign: '',
    globalAlpha: 1.0
  }),
  addEventListener: (evt, fn) => { domListeners[evt] = fn; },
  getBoundingClientRect: () => ({ left: 0, top: 0, width: 1280, height: 720 })
};

function mockEl(id = '') {
  return {
    id,
    classList: { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false },
    style: {},
    addEventListener: () => {},
    removeEventListener: () => {},
    querySelector: () => mockEl(),
    querySelectorAll: () => [],
    appendChild: () => {},
    removeChild: () => {},
    setAttribute: () => {},
    getAttribute: () => '',
    innerHTML: '',
    value: '',
    textContent: ''
  };
}

const mockDoc = {
  getElementById: (id) => {
    if (id && id.includes('canvas')) return mockCanvas;
    return mockEl(id);
  },
  createElement: (tag) => mockEl(tag),
  addEventListener: () => {},
  body: mockEl('body')
};

const sandbox = {
  window: {},
  document: mockDoc,
  navigator: { userAgent: 'NodeTest' },
  console: console,
  addEventListener: (evt, fn) => { domListeners[evt] = fn; },
  removeEventListener: () => {},
  Image: class {
    constructor() {
      this.complete = true;
      this.naturalWidth = 2048;
      this.naturalHeight = 2048;
    }
  },
  performance: performance,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  requestAnimationFrame: () => 1,
  cancelAnimationFrame: () => {},
  localStorage: {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; },
    clear() { this._data = {}; }
  }
};
sandbox.window = sandbox;

vm.createContext(sandbox);

// Load all scripts in order
const scripts = [
  'js/config.js',
  'js/sprites.js',
  'js/maps.js',
  'js/input.js',
  'js/entities.js',
  'js/camera.js',
  'js/water.js',
  'js/enemies.js',
  'js/ui.js',
  'js/history.js',
  'js/editor.js',
  'js/ui_editor.js',
  'js/main.js'
];

for (const s of scripts) {
  const code = fs.readFileSync(path.resolve(s), 'utf8');
  vm.runInContext(code, sandbox, { filename: s });
}

console.log('--- Testing Map 1 Structure & Properties ---');
const map1 = sandbox.window.GameMaps.map1;
if (!map1) throw new Error('GameMaps.map1 is missing!');

console.log('Map ID:', map1.id);
console.log('Map Name:', map1.name);
console.log('Scenes count:', map1.scenes.length);
if (map1.scenes.length !== 2) throw new Error('Expected 2 scenes in map1');
console.log('Scene 0 Name:', map1.scenes[0].name);
console.log('Scene 1 Name:', map1.scenes[1].name);
console.log('Scene 1 Condition:', map1.scenes[1].condition);
console.log('Trash spawns count:', map1.trashSpawns.length);
if (map1.trashSpawns.length !== 22) throw new Error('Expected 22 trash spawns in map1');

console.log('\n--- Testing Scene 0 Collision Bounds ---');
sandbox.window.buildMapCollisionBounds(map1);
console.log('Initial collisionBounds count (Scene 0):', map1.collisionBounds.length);
const aguaPolyInBounds = map1.collisionBounds.some(b => b.label === 'Colisão água' || b.id === 'poly_obs_mvtmuz3u_ibe');
if (!aguaPolyInBounds) throw new Error('Colisão água must be in collisionBounds for Scene 0');
console.log('✅ Scene 0 correctly includes "Colisão água"');

const triggerInBounds = map1.collisionBounds.some(b => b.id === 'trigger_044f' || b.isTrigger || b.collisionType === 'trigger');
if (triggerInBounds) throw new Error('Trigger zone must NOT be in collisionBounds!');
console.log('✅ Trigger zone trigger_044f correctly excluded from collisionBounds (pass-through)');

console.log('\n--- Testing Trigger Zone Sensor Interaction ---');
// Instantiate game
const game = new sandbox.window.Game('gameCanvas');
game.stageFlowIndex = 1;
game.currentMap = map1;
game.gameMode = 'singleplayer';
const p1 = game.players[0];

// Move player into trigger_044f (x: 944, y: 1968, w: 144, h: 80)
p1.x = 944 + 50;
p1.y = 1968 + 40;
let toastShown = null;
game.ui.showToast = (msg) => { toastShown = msg; };

// Trigger updateGameplay
game.elapsedTime = 10;
game._updateGameplay(0.016);
console.log('Toast on entering trigger zone:', toastShown);
if (!toastShown || !toastShown.includes('em breve...')) {
  throw new Error('Expected trigger zone to display "em breve..." toast');
}
console.log('✅ Trigger zone automatically displayed "em breve..." on entry');

// Test interaction key [E] inside trigger zone
toastShown = null;
game.appState = 'PLAYING';
game.handleInteractShortcut();
console.log('Toast on pressing interact in trigger zone:', toastShown);
if (!toastShown || !toastShown.includes('em breve...')) {
  throw new Error('Expected pressing interact to display "em breve..."');
}
console.log('✅ Interacting in trigger zone displayed "em breve..."');

console.log('\n--- Testing Trash Spawning (all 22 trashes) ---');
const fixedSpawns = sandbox.window.GlobalState.getFixedTrashSpawns(map1);
console.log('Fixed trash spawns count:', fixedSpawns.length);
if (fixedSpawns.length !== 22) throw new Error('Expected 22 fixed trash spawns');
console.log('✅ GlobalState returns all 22 trash spawns');

console.log('\n--- Testing Water Draining on 5 Trashes ---');
// Reset collected trash for test
sandbox.window.GlobalState.resetAllTrash();

// Start stage 1
game.stageFlowIndex = 1;
game.loadStageByFlowIndex(1, false);

if (map1.isWaterDrained !== false) throw new Error('map1 water should be false initially');
if (map1.currentScene !== 0) throw new Error('map1 scene should be 0 initially');

// Collect 4 trashes: water should still be present
let shakesCount = 0;
game.camera.triggerShake = () => { shakesCount++; };

for (let i = 0; i < 4; i++) {
  const t = game.trashItems[game.trashItems.length - 1];
  p1.x = t.x;
  p1.y = t.y;
  game._checkTrashCollection();
}

if (map1.isWaterDrained !== false) throw new Error('Water should NOT be drained after 4 trashes');
if (map1.currentScene !== 0) throw new Error('Scene should still be 0 after 4 trashes');
console.log('✅ 4 trashes collected: Water is still active (Scene 0)');

// Collect 5th trash: water drains, shakes trigger, switch to Scene 1
const t5 = game.trashItems[game.trashItems.length - 1];
p1.x = t5.x;
p1.y = t5.y;
game._checkTrashCollection();

if (map1.isWaterDrained !== true) throw new Error('Water should be drained after 5 trashes!');
if (map1.currentScene !== 1) throw new Error('Active scene should be 1 (Cena 2) after 5 trashes!');
if (shakesCount === 0) throw new Error('Screen shake should have been triggered!');
console.log('✅ 5 trashes collected: Water drained, screen shake triggered, switched to Scene 1 (Cena 2)!');

// Check that "Colisão água" is now deactivated from collisionBounds
const waterInDrainedBounds = map1.collisionBounds.some(b => b.label === 'Colisão água' || b.id === 'poly_obs_mvtmuz3u_ibe');
if (waterInDrainedBounds) throw new Error('"Colisão água" should be deactivated after water drain!');
console.log('✅ "Colisão água" successfully deactivated from collisionBounds');

console.log('\n--- Testing Scene Switching and Collision Restoration ---');
// Restore water
game._restoreMap1Water();
if (map1.isWaterDrained !== false) throw new Error('Water should be restored to false');
if (map1.currentScene !== 0) throw new Error('Scene should be restored to 0');
const waterInRestoredBounds = map1.collisionBounds.some(b => b.label === 'Colisão água' || b.id === 'poly_obs_mvtmuz3u_ibe');
if (!waterInRestoredBounds) throw new Error('"Colisão água" must be restored in bounds!');
console.log('✅ Water collision restored cleanly on reset');

console.log('\n🎉 ALL MAP 1 INTEGRATION TESTS PASSED!');
