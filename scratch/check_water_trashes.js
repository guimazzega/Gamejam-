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

const agua = data.scenes[0].layers[2].items.find(it => it.label === 'Colisão água');
data.trashSpawns.forEach((t, i) => {
  const inWater = pointInPoly({ x: t.x, y: t.y }, agua.polygon);
  const side = t.x < 750 ? 'WEST (Accessible)' : (inWater ? 'IN WATER' : 'EAST');
  console.log(`${t.id}: (${t.x}, ${t.y}) -> ${side}`);
});

