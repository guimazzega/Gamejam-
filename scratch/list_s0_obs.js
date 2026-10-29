const fs = require('fs');
const p = 'C:/Users/gsmaz/.gemini/antigravity/brain/501a5374-36d8-4ed2-83ed-076239e5690d/.user_uploaded/media_1793284210031_3aa372ba.json';
const data = JSON.parse(fs.readFileSync(p, 'utf8'));
const s0Items = data.scenes[0].layers[2].items;
const obs = s0Items.filter(it => it.type === 'obstacle');
console.log('Total obstacles in S0:', obs.length);
obs.forEach((o, i) => {
  const geom = o.polygon ? 'polygon(' + o.polygon.length + ')' : ('rect(' + o.x + ',' + o.y + ',' + o.w + ',' + o.h + ')');
  console.log(i, o.id || 'no-id', o.label, geom, o.isOverhead ? 'OVERHEAD' : '');
});

