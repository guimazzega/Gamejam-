const fs = require('fs');
const p = 'C:/Users/gsmaz/.gemini/antigravity/brain/501a5374-36d8-4ed2-83ed-076239e5690d/.user_uploaded/media_1793284210031_3aa372ba.json';
const exported = JSON.parse(fs.readFileSync(p, 'utf8'));

// Inspect exported scenes
console.log('Exported scenes:', exported.scenes.length);
exported.scenes.forEach((s, idx) => {
  console.log(`Scene ${idx} ${s.name}: ${s.layers[2].items.length} items in layer 2`);
});

const s0Obstacles = exported.scenes[0].layers[2].items.filter(it => it.type === 'obstacle');
const waterObstacles = s0Obstacles.filter(it => it.label === 'Colisão água' || it.id === 'poly_obs_mvtmuz3u_ibe' || it.label.includes('LAGO LESTE'));
const baseObstacles = s0Obstacles.filter(it => !waterObstacles.includes(it) && !it.isTrigger && it.collisionType !== 'trigger');

console.log('Water obstacles:', waterObstacles.length, waterObstacles.map(w => w.label || w.id));
console.log('Base obstacles:', baseObstacles.length);
console.log('Trigger zones:', exported.triggerZones);
console.log('Trash spawns:', exported.trashSpawns.length);

