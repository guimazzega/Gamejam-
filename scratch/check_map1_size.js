const fs = require('fs');
const p = 'C:/Users/gsmaz/.gemini/antigravity/brain/501a5374-36d8-4ed2-83ed-076239e5690d/.user_uploaded/media_1793284210031_3aa372ba.json';
const exported = JSON.parse(fs.readFileSync(p, 'utf8'));

const s0Obstacles = exported.scenes[0].layers[2].items.filter(it => it.type === 'obstacle');
const waterObstacles = s0Obstacles.filter(it => it.label === 'Colisão água' || it.id === 'poly_obs_mvtmuz3u_ibe' || (it.label && it.label.includes('LAGO LESTE')));
const baseObstacles = s0Obstacles.filter(it => !waterObstacles.includes(it) && !it.isTrigger && it.collisionType !== 'trigger');

const map1Obj = {
  id: 'map1',
  name: exported.mapName || 'MAPA 1: VILA INUNDADA [SETOR ALPHA]',
  subtitle: 'Colete 5 lixos para drenar a água do canal e liberar a passagem até a Van',
  width: exported.dimensions ? exported.dimensions.width : 2048,
  height: exported.dimensions ? exported.dimensions.height : 2048,
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
  trashSpawns: exported.trashSpawns,
  enemySpawns: [],
  floorZones: [],
  overheadZones: exported.overheadZones || [],
  triggerZones: exported.triggerZones || [],
  currentScene: 0,
  scenes: exported.scenes,
  layers: exported.scenes[0].layers,
  baseObstacles: baseObstacles,
  waterObstacles: waterObstacles,
  obstacles: [],
  collisionBounds: []
};

const str = JSON.stringify(map1Obj, null, 2);
console.log('map1 json string length:', str.length, 'lines:', str.split('\n').length);

