const fs = require('fs');
const p = 'C:/Users/gsmaz/.gemini/antigravity/brain/501a5374-36d8-4ed2-83ed-076239e5690d/.user_uploaded/media_1793284210031_3aa372ba.json';
const exportedData = JSON.parse(fs.readFileSync(p, 'utf8'));

// Build candidate map1 object
const map1 = {
  id: 'map1',
  name: exportedData.mapName || 'MAPA 1: VILA INUNDADA [SETOR ALPHA]',
  subtitle: 'Colete 5 lixos para drenar a água do canal e liberar a passagem até a Van',
  width: exportedData.dimensions ? exportedData.dimensions.width : 2048,
  height: exportedData.dimensions ? exportedData.dimensions.height : 2048,
  isSafeRoom: false,
  stageNumber: 1,
  imageAsset: 'assets/map1_water.jpg',
  imageAssetDry: 'assets/map1_dry.jpg',
  isWaterDrained: false,
  palette: {
    bg: '#16261c',
    wallFill: 'rgba(38, 70, 50, 0.88)',
    wallStroke: '#4ade80',
    pathFill: 'rgba(161, 98, 7, 0.22)',
    pathStroke: 'rgba(250, 204, 21, 0.30)'
  },
  spawnP1: { x: 430, y: 390 },
  spawnP2: { x: 495, y: 390 },
  transitionZone: {
    x: 1640,
    y: 220,
    w: 240,
    h: 200,
    label: 'ZONA DE EXTRAÇÃO → EMBARCAR NA VAN',
    subLabel: 'Pressione [E] ou [Espaço] para concluir a fase',
    strokeColor: '#4ade80',
    fillColor: 'rgba(34, 197, 94, 0.26)'
  },
  trashSpawns: exportedData.trashSpawns,
  enemySpawns: [],
  floorZones: [],
  overheadZones: exportedData.overheadZones || [],
  triggerZones: exportedData.triggerZones || [],
  currentScene: 0,
  scenes: exportedData.scenes,
  layers: exportedData.scenes[0].layers
};

// Simulation of buildMapCollisionBounds
function buildMapCollisionBounds(map) {
  if (!map) return [];
  const collisionBounds = [];

  if (Array.isArray(map.layers) && map.layers.length > 0) {
    map.layers.forEach((layer, layerIdx) => {
      const isCeilingLayer =
        layerIdx === 3 ||
        layer.id === 3 ||
        (layer.name && /teto|overhead/i.test(layer.name));
      if (isCeilingLayer) return;

      if (Array.isArray(layer.items)) {
        layer.items.forEach((item) => {
          if (
            item.isOverhead === true ||
            item.collisionType === 'overhead' ||
            item.isTrigger === true ||
            item.collisionType === 'trigger'
          ) {
            return;
          }

          if (
            item.type === 'obstacle' ||
            (item.w && item.h && !item.src && !item.typeIndex) ||
            item.polygon
          ) {
            collisionBounds.push(item);
          }
        });
      }
    });
  }

  map.collisionBounds = collisionBounds;
  map.obstacles = collisionBounds;
  return collisionBounds;
}

// 1. Initial build (Scene 0 - Water active)
buildMapCollisionBounds(map1);
console.log('Scene 0 bounds count:', map1.collisionBounds.length);
const hasWaterInScene0 = map1.collisionBounds.some(b => b.label === 'Colisão água' || b.id === 'poly_obs_mvtmuz3u_ibe');
const hasTriggerInScene0 = map1.collisionBounds.some(b => b.isTrigger || b.collisionType === 'trigger' || b.id === 'trigger_044f');
console.log('Scene 0 has Colisão água?', hasWaterInScene0);
console.log('Scene 0 has trigger in bounds (should be false)?', hasTriggerInScene0);

// 2. Drain water (Scene 1 - Water drained)
map1.isWaterDrained = true;
map1.currentScene = 1;
map1.layers = map1.scenes[1].layers;
buildMapCollisionBounds(map1);
console.log('Scene 1 bounds count:', map1.collisionBounds.length);
const hasWaterInScene1 = map1.collisionBounds.some(b => b.label === 'Colisão água' || b.id === 'poly_obs_mvtmuz3u_ibe');
console.log('Scene 1 has Colisão água (should be false)?', hasWaterInScene1);

// 3. Restore water (Scene 0)
map1.isWaterDrained = false;
map1.currentScene = 0;
map1.layers = map1.scenes[0].layers;
buildMapCollisionBounds(map1);
console.log('Restored Scene 0 bounds count:', map1.collisionBounds.length);
console.log('Restored Scene 0 has Colisão água?', map1.collisionBounds.some(b => b.label === 'Colisão água'));

