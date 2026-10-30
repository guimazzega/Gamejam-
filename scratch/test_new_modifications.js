const fs = require('fs');
const assert = require('assert');

// Mock browser globals
global.window = global;
global.window.addEventListener = () => {};
global.document = {
  getElementById: (id) => ({
    id,
    classList: {
      _classes: new Set(['hidden']),
      add: function(c) { this._classes.add(c); },
      remove: function(c) { this._classes.delete(c); },
      contains: function(c) { return this._classes.has(c); }
    },
    addEventListener: () => {},
    style: {}
  })
};

require('../js/config.js');
require('../js/maps.js');
require('../js/entities.js');
require('../js/ui.js');
require('../js/main.js');

console.log('=== TEST 1: MAPA 1 CONFIGURATION & SCENES ===');
const map1 = window.GameMaps.map1;
assert(map1, 'map1 must exist');
assert.strictEqual(map1.width, 2048, 'map1 width must be 2048');
assert.strictEqual(map1.height, 2048, 'map1 height must be 2048');
assert.strictEqual(map1.scenes.length, 2, 'map1 must have 2 scenes');

// Scene 0: Water active
map1.currentScene = 0;
map1.layers = map1.scenes[0].layers;
window.buildMapCollisionBounds(map1);
console.log('Scene 0 solid collisions:', map1.collisionBounds.length);
assert.strictEqual(map1.collisionBounds.length, 80, 'Scene 0 must have exactly 80 solid obstacles');

const waterObs = map1.collisionBounds.find(it => it.label === 'Colisão água' || it.id === 'poly_obs_mvtmuz3u_ibe');
assert(waterObs, 'Scene 0 must include "Colisão água"');
console.log('✅ Scene 0 includes water collision:', waterObs.id);

// Check overhead in Scene 0
assert.strictEqual(map1.overheadZones.length, 24, 'map1 must have 24 overhead zones');
for (const ov of map1.overheadZones) {
  assert.strictEqual(ov.isOverhead, true, `Overhead ${ov.id} must have isOverhead: true`);
  const inCollisions = map1.collisionBounds.some(b => b.id === ov.id);
  assert.strictEqual(inCollisions, false, `Overhead ${ov.id} must NOT be in collisionBounds`);
}
console.log('✅ All 24 map1 overhead zones are strictly excluded from collisionBounds (pass-through)');

// Scene 1: Water drained
map1.currentScene = 1;
map1.layers = map1.scenes[1].layers;
window.buildMapCollisionBounds(map1);
console.log('Scene 1 solid collisions:', map1.collisionBounds.length);
assert.strictEqual(map1.collisionBounds.length, 51, 'Scene 1 must have exactly 51 solid obstacles');
const waterObsInS1 = map1.collisionBounds.find(it => it.label === 'Colisão água' || it.id === 'poly_obs_mvtmuz3u_ibe');
assert.strictEqual(waterObsInS1, undefined, 'Scene 1 must NOT have water collision');
console.log('✅ Scene 1 water collision disabled');

// Trash count
assert.strictEqual(map1.trashSpawns.length, 22, 'map1 must have 22 trash spawns');
console.log('✅ map1 has 22 fixed trash spawns');

// Trigger zone in map1
assert.strictEqual(map1.triggerZones.length, 1, 'map1 must have 1 trigger zone');
const map1Trig = map1.triggerZones[0];
assert.strictEqual(map1Trig.id, 'trigger_d9lp', 'map1 trigger must be trigger_d9lp');
assert.strictEqual(map1Trig.x, 1744);
assert.strictEqual(map1Trig.y, 272);
assert.strictEqual(map1.transitionZone.x, 1744);
assert.strictEqual(map1.transitionZone.y, 272);
console.log('✅ map1 trigger_d9lp / transitionZone matches (1744, 272): "Aqui será a Van"');

console.log('\n=== TEST 2: VAN CONFIGURATION & MULTI-DOORS ===');
const van = window.GameMaps.van;
assert(van, 'van must exist');
assert.strictEqual(van.width, 1536, 'van width must be 1536');
assert.strictEqual(van.height, 857, 'van height must be 857');

window.buildMapCollisionBounds(van);
console.log('van solid collisions:', van.collisionBounds.length);
assert.strictEqual(van.collisionBounds.length, 39, 'van must have exactly 39 solid obstacles');

// Overhead in Van
assert.strictEqual(van.overheadZones.length, 11, 'van must have 11 overhead zones');
for (const ov of van.overheadZones) {
  assert.strictEqual(ov.isOverhead, true, `Overhead ${ov.id} must have isOverhead: true`);
  const inCollisions = van.collisionBounds.some(b => b.id === ov.id);
  assert.strictEqual(inCollisions, false, `Overhead ${ov.id} must NOT be in collisionBounds`);
}
console.log('✅ All 11 van overhead zones are strictly excluded from collisionBounds (pass-through)');

// Triggers in Van
assert.strictEqual(van.triggerZones.length, 4, 'van must have 4 triggers');
const trigIds = van.triggerZones.map(t => t.id);
assert(trigIds.includes('trigger_2yqx'), 'Shop trigger must exist');
assert(trigIds.includes('trigger_6ta6'), 'Mural trigger must exist');
assert(trigIds.includes('trigger_jfqd'), 'Right door advance trigger must exist');
assert(trigIds.includes('trigger_sglp'), 'Left door restart trigger must exist');
console.log('✅ All 4 van triggers configured: shop, mural, right door (advance), left door (restart)');

// Animation marker
assert.strictEqual(van.animationMarkers.length, 1, 'van must have 1 animation marker');
assert.strictEqual(van.animationMarkers[0].id, 'anim_9gqp');
assert.strictEqual(van.animationMarkers[0].x, 464);
assert.strictEqual(van.animationMarkers[0].y, 160);
console.log('✅ van anim_9gqp animation marker at (464, 160) for exclamation point');

console.log('\n=== TEST 3: VAN DOOR LOGIC SIMULATION ===');
let teleportCall = null;
let toastMessage = null;
let restartModalOpened = false;

const mockGame = {
  currentMap: van,
  stageFlowIndex: 0,
  players: [
    { x: 1340, y: 460, w: 32, h: 48, vx: 0, vy: 0, isTouchingZone: function(z) {
      return (this.x < z.x + z.w && this.x + this.w > z.x && this.y < z.y + z.h && this.y + this.h > z.y);
    }}
  ],
  activePlayerIndex: 0,
  gameMode: 'singleplayer',
  getCurrentStageMeta: () => ({ isSafeRoom: true, vanType: 'start' }),
  triggerStageTeleport: (idx, msg) => { teleportCall = { idx, msg }; },
  confirmVanAdvanceToNext: function() {
    teleportCall = { idx: 2, msg: 'Expedição avançando para Fase 2!' };
  },
  confirmVanReplayPrevious: function() {
    teleportCall = { idx: 1, msg: 'Retornando para Replay!' };
  },
  ui: {
    showToast: (m) => { toastMessage = m; },
    showVanRestartModal: () => { restartModalOpened = true; },
    hideVanRestartModal: () => { restartModalOpened = false; }
  },
  advanceFromVanDirectly: window.Game.prototype.advanceFromVanDirectly,
  promptVanRestartConfirmation: window.Game.prototype.promptVanRestartConfirmation,
  dismissVanRestartAndStepBack: window.Game.prototype.dismissVanRestartAndStepBack,
  isAnyPlayerInTransitionZone: window.Game.prototype.isAnyPlayerInTransitionZone,
  isAnyPlayerInRestartZone: window.Game.prototype.isAnyPlayerInRestartZone
};

// Player touches right door (1328, 432, 96, 144) in start van
assert.strictEqual(mockGame.isAnyPlayerInTransitionZone(), true, 'Player should be touching right door');
mockGame.advanceFromVanDirectly();
assert.strictEqual(teleportCall.idx, 1, 'Right door in van_start should directly teleport to Map 1');
console.log('✅ Right door in van_start advances DIRECTLY to Map 1 without choice modal');

// Now simulate intermediate van (e.g. van_1)
teleportCall = null;
mockGame.stageFlowIndex = 2; // e.g. van_1
mockGame.getCurrentStageMeta = () => ({ isSafeRoom: true, vanType: 'mid', nextMapIndex: 3 });
mockGame.advanceFromVanDirectly();
assert.strictEqual(teleportCall.idx, 2, 'Right door in intermediate van advances directly');
console.log('✅ Right door in intermediate van advances DIRECTLY to next stage without choice modal');

// Now test left door (64, 480, 80, 160)
mockGame.players[0].x = 70;
mockGame.players[0].y = 500;
assert.strictEqual(mockGame.isAnyPlayerInRestartZone(), true, 'Player should be touching left door');

// Left door in intermediate van
restartModalOpened = false;
mockGame.promptVanRestartConfirmation();
assert.strictEqual(restartModalOpened, true, 'Left door should open restart confirmation modal');
console.log('✅ Left door in intermediate van prompts: "Tem certeza que deseja reiniciar?"');

// Dismissing restart modal steps back
mockGame.dismissVanRestartAndStepBack();
assert(mockGame.players[0].x >= 160, 'Player should be pushed back away from left door');
console.log('✅ Canceling restart modal pushes player back safely (x >= 160)');

console.log('\n=== ALL NEW MODIFICATION TESTS PASSED SUCCESSFULLY! ===');
