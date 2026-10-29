const fs = require('fs');
const p = 'C:/Users/gsmaz/.gemini/antigravity/brain/501a5374-36d8-4ed2-83ed-076239e5690d/.user_uploaded/media_1793284210031_3aa372ba.json';
const data = JSON.parse(fs.readFileSync(p, 'utf8'));

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

data.trashSpawns.forEach((t, i) => {
  const pt = { x: t.x, y: t.y };
  // Check against Scene 1 (all non-water obstacles)
  data.scenes[1].layers[2].items.forEach(obs => {
    if (obs.type !== 'obstacle' || obs.isTrigger || obs.collisionType === 'trigger') return;
    if (obs.polygon) {
      if (pointInPoly(pt, obs.polygon)) {
        console.log(`Trash ${t.id} at (${t.x},${t.y}) inside polygon ${obs.label} (${obs.id})`);
      }
    } else {
      if (pt.x >= obs.x && pt.x <= obs.x + obs.w && pt.y >= obs.y && pt.y <= obs.y + obs.h) {
        console.log(`Trash ${t.id} at (${t.x},${t.y}) inside box ${obs.label}`);
      }
    }
  });
});
console.log('Done checking trash positions!');

