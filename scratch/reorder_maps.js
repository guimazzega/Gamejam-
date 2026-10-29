const fs = require('fs');
let content = fs.readFileSync('js/maps.js', 'utf8');

// Find where window.buildMapCollisionBounds is defined
const funcHeader = '// =========================================================================\n// SPRINT 17: MOTOR DE COLISÕES E HITBOXES POR CIMA (PASS-THROUGH)';
const funcStart = content.indexOf(funcHeader);
if (funcStart === -1) throw new Error('Could not find funcHeader');

const funcAndInit = content.slice(funcStart);
const beforeFunc = content.slice(0, funcStart);

// Remove the old map1 init from beforeFunc:
const map1InitPattern = /\/\/ Inicialização dinâmica dos obstáculos do Mapa 1[\s\S]*?\n\}/;
const match = beforeFunc.match(map1InitPattern);
if (!match) throw new Error('Could not find map1InitPattern');

const cleanedBefore = beforeFunc.replace(map1InitPattern, '');

// Now we want:
// 1. cleanedBefore
// 2. window.buildMapCollisionBounds definition
// 3. Map1 init + Map collisionBounds loop

const funcOnlyMatch = funcAndInit.match(/(\/\*\*[\s\S]*?window\.buildMapCollisionBounds = function\(map\) \{[\s\S]*?\n\};)/);
if (!funcOnlyMatch) throw new Error('Could not find funcOnlyMatch');
const funcCode = funcOnlyMatch[1];

const combined = cleanedBefore + '\n\n' + funcHeader + '\n// =========================================================================\n\n' + funcCode + '\n\n' +
`// Inicialização dinâmica dos obstáculos do Mapa 1
if (window.GameMaps && window.GameMaps.map1) {
  if (Array.isArray(window.GameMaps.map1.scenes) && window.GameMaps.map1.scenes.length > 0) {
    window.GameMaps.map1.currentScene = 0;
    window.GameMaps.map1.layers = window.GameMaps.map1.scenes[0].layers;
  }
  window.buildMapCollisionBounds(window.GameMaps.map1);
}

// Inicialização de collisionBounds em todos os mapas (Sprint 17)
if (window.GameMaps) {
  ['map1', 'van', 'map2', 'map3', 'van_start', 'van_1', 'van_2'].forEach((k) => {
    if (window.GameMaps[k]) {
      window.buildMapCollisionBounds(window.GameMaps[k]);
    }
  });
}
`;

fs.writeFileSync('js/maps.js', combined, 'utf8');
console.log('Reordered maps.js successfully!');

