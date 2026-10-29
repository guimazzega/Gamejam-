const fs = require('fs');
const p = 'C:/Users/gsmaz/.gemini/antigravity/brain/501a5374-36d8-4ed2-83ed-076239e5690d/.user_uploaded/media_1793284210031_3aa372ba.json';
const data = JSON.parse(fs.readFileSync(p, 'utf8'));

console.log('--- MAP1 EXPORT ANALYSIS ---');
console.log('Map ID:', data.mapId);
console.log('Map Name:', data.mapName);
console.log('Dimensions:', data.dimensions);
console.log('Scenes count:', data.scenes.length);
data.scenes.forEach((s, i) => {
  console.log(`Scene ${i}: ID=${s.id}, Name=${s.name}, Condition=${s.condition}`);
  s.layers.forEach((l, li) => {
    console.log(`  Layer ${li} (${l.name}): ${l.items.length} items`);
  });
});

console.log('Trigger zones:', JSON.stringify(data.triggerZones));
console.log('Trash spawns count:', data.trashSpawns.length);
console.log('Overhead zones:', JSON.stringify(data.overheadZones));
console.log('Visual sprites count:', data.visualSprites.length);
console.log('Obstacles count:', data.obstacles.length);
console.log('CollisionBounds count:', data.collisionBounds.length);

