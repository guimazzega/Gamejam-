const fs = require('fs');
let content = fs.readFileSync('js/maps.js', 'utf8');

content = content.replace(
  `          if (item.isOverhead === true || item.collisionType === 'overhead') {
            return;
          }`,
  `          // Condição rigorosa (Sprint 17): overhead e triggers não entram em colisão física
          if (
            item.isOverhead === true ||
            item.collisionType === 'overhead' ||
            item.isTrigger === true ||
            item.collisionType === 'trigger'
          ) {
            return;
          }`
);

content = content.replace(
  `      if (
        obs.isOverhead === true ||
        obs.collisionType === 'overhead' ||
        obs.layer === 3
      ) {
        return;
      }`,
  `      if (
        obs.isOverhead === true ||
        obs.collisionType === 'overhead' ||
        obs.layer === 3 ||
        obs.isTrigger === true ||
        obs.collisionType === 'trigger'
      ) {
        return;
      }`
);

fs.writeFileSync('js/maps.js', content, 'utf8');
console.log('Updated buildMapCollisionBounds in maps.js');

