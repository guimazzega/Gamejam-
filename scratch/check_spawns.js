const fs = require('fs');
const p = 'C:/Users/gsmaz/.gemini/antigravity/brain/501a5374-36d8-4ed2-83ed-076239e5690d/.user_uploaded/media_1793284210031_3aa372ba.json';
const data = JSON.parse(fs.readFileSync(p, 'utf8'));

// SAT helper to test collision
function pointInPoly(pt, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y;
    const xj = poly[j].x, yj = poly[j].y;
    const intersect = ((yi > pt.y) !== (yj > pt.y)) && (pt.x < (xj - xi) * (pt.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function checkPoint(pt, label, sceneIdx) {
  const items = data.scenes[sceneIdx].layers[2].items;
  items.forEach(it => {
    if (it.type !== 'obstacle' || it.isTrigger || it.collisionType === 'trigger') return;
    if (it.polygon) {
      if (pointInPoly(pt, it.polygon)) {
        console.log(`COLLISION: ${label} inside poly ${it.label} (${it.id}) in scene ${sceneIdx}`);
      }
    } else {
      if (pt.x >= it.x && pt.x <= it.x + it.w && pt.y >= it.y && pt.y <= it.y + it.h) {
        console.log(`COLLISION: ${label} inside box ${it.label} (${it.id || 'no-id'}) in scene ${sceneIdx}`);
      }
    }
  });
}

console.log('Testing Scene 0 (Water):');
checkPoint({ x: 430, y: 390 }, 'spawnP1', 0);
checkPoint({ x: 495, y: 390 }, 'spawnP2', 0);
checkPoint({ x: 1760, y: 320 }, 'transitionZone center', 0);

console.log('Testing Scene 1 (Dry):');
checkPoint({ x: 430, y: 390 }, 'spawnP1', 1);
checkPoint({ x: 495, y: 390 }, 'spawnP2', 1);
checkPoint({ x: 1760, y: 320 }, 'transitionZone center', 1);

console.log('Done testing!');

