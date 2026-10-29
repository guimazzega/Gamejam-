/**
 * js/maps.js
 * Definições dos 3 Mapas (Fase 1, Fase 2, Fase 3) e da Safe Room (A Van).
 * - Todas as caixas de colisão revisadas com precisão máxima e amplo espaço de circulação.
 * - Cada mapa possui exatamente 16 lixos posicionados em locais 100% acessíveis logo na primeira andada.
 * - Sistema de Crafting completamente removido da Van.
 */

window.GameMaps = {
  // =========================================================================
  // MAPA 1: VILA INUNDADA [SETOR ALPHA] (2048 x 2048 px)
  // =========================================================================
  map1: {
    "id": "map1",
    "name": "MAPA 1: VILA INUNDADA [SETOR ALPHA]",
    "subtitle": "Colete 5 lixos para drenar a água do canal e liberar a passagem até a Van",
    "width": 2048,
    "height": 2048,
    "isSafeRoom": false,
    "stageNumber": 1,
    "imageAsset": "assets/map1_water.jpg",
    "imageAssetDry": "assets/map1_dry.jpg",
    "isWaterDrained": false,
    "palette": {
      "bg": "#16261c",
      "wallFill": "rgba(38, 70, 50, 0.88)",
      "wallStroke": "#4ade80",
      "pathFill": "rgba(161, 98, 7, 0.22)",
      "pathStroke": "rgba(250, 204, 21, 0.30)"
    },
    "spawnP1": {
      "x": 430,
      "y": 390
    },
    "spawnP2": {
      "x": 495,
      "y": 390
    },
    "transitionZone": {
      "x": 1640,
      "y": 220,
      "w": 240,
      "h": 200,
      "label": "ZONA DE EXTRAÇÃO → EMBARCAR NA VAN",
      "subLabel": "Pressione [E] ou [Espaço] para concluir a fase",
      "strokeColor": "#4ade80",
      "fillColor": "rgba(34, 197, 94, 0.26)"
    },
    "trashSpawns": [
      {
        "id": "map1_trash_01",
        "x": 205,
        "y": 185,
        "typeIndex": 0,
        "rotation": 0.12
      },
      {
        "id": "map1_trash_02",
        "x": 265,
        "y": 345,
        "typeIndex": 1,
        "rotation": -0.18
      },
      {
        "id": "map1_trash_03",
        "x": 560,
        "y": 470,
        "typeIndex": 2,
        "rotation": 0.1
      },
      {
        "id": "map1_trash_04",
        "x": 560,
        "y": 720,
        "typeIndex": 3,
        "rotation": -0.15
      },
      {
        "id": "map1_trash_05",
        "x": 540,
        "y": 980,
        "typeIndex": 4,
        "rotation": 0.2
      },
      {
        "id": "map1_trash_06",
        "x": 385,
        "y": 1125,
        "typeIndex": 0,
        "rotation": -0.12
      },
      {
        "id": "map1_trash_07",
        "x": 530,
        "y": 1265,
        "typeIndex": 1,
        "rotation": 0.16
      },
      {
        "id": "map1_trash_08",
        "x": 395,
        "y": 1500,
        "typeIndex": 2,
        "rotation": -0.22
      },
      {
        "id": "map1_trash_09",
        "x": 880,
        "y": 1520,
        "typeIndex": 3,
        "rotation": 0.14
      },
      {
        "id": "map1_trash_10",
        "x": 960,
        "y": 1820,
        "typeIndex": 4,
        "rotation": -0.1
      },
      {
        "id": "map1_trash_11",
        "x": 1030,
        "y": 1040,
        "typeIndex": 0,
        "rotation": 0.18
      },
      {
        "id": "map1_trash_12",
        "x": 1250,
        "y": 920,
        "typeIndex": 1,
        "rotation": -0.16
      },
      {
        "id": "map1_trash_13",
        "x": 1580,
        "y": 920,
        "typeIndex": 2,
        "rotation": 0.11
      },
      {
        "id": "map1_trash_14",
        "x": 1540,
        "y": 1280,
        "typeIndex": 3,
        "rotation": -0.19
      },
      {
        "id": "map1_trash_15",
        "x": 1560,
        "y": 540,
        "typeIndex": 4,
        "rotation": 0.21
      },
      {
        "id": "map1_trash_16",
        "x": 1500,
        "y": 270,
        "typeIndex": 0,
        "rotation": -0.14
      },
      {
        "id": "map1_trash_w1t6_67",
        "x": 464,
        "y": 544,
        "typeIndex": 0,
        "rotation": 0
      },
      {
        "id": "map1_trash_w3nm_68",
        "x": 688,
        "y": 896,
        "typeIndex": 0,
        "rotation": 0
      },
      {
        "id": "map1_trash_wau3_69",
        "x": 512,
        "y": 1072,
        "typeIndex": 0,
        "rotation": 0
      },
      {
        "id": "map1_trash_wbf7_70",
        "x": 640,
        "y": 1120,
        "typeIndex": 0,
        "rotation": 0
      },
      {
        "id": "map1_trash_wco4_71",
        "x": 656,
        "y": 672,
        "typeIndex": 0,
        "rotation": 0
      },
      {
        "id": "map1_trash_wsst_72",
        "x": 656,
        "y": 480,
        "typeIndex": 0,
        "rotation": 0
      }
    ],
    "enemySpawns": [],
    "floorZones": [],
    "overheadZones": [],
    "triggerZones": [
      {
        "id": "trigger_044f",
        "x": 944,
        "y": 1968,
        "w": 144,
        "h": 80,
        "label": "TRIGGER",
        "ai_instruction": "Abrir aviso escrito \"em breve...\""
      }
    ],
    "currentScene": 0,
    "scenes": [
      {
        "id": 1,
        "name": "Cena 1 (Padrão)",
        "condition": "Início padrão do mapa",
        "layers": [
          {
            "id": 0,
            "name": "Chão",
            "itemsCount": 0,
            "items": []
          },
          {
            "id": 1,
            "name": "Tapetes/Decalques",
            "itemsCount": 0,
            "items": []
          },
          {
            "id": 2,
            "name": "Objetos/Colisão",
            "itemsCount": 77,
            "items": [
              {
                "type": "obstacle",
                "zIndex": 0,
                "x": 0,
                "y": 2012,
                "rotation": 0,
                "w": 2048,
                "h": 36,
                "label": "LIMITE SUL"
              },
              {
                "type": "obstacle",
                "zIndex": 1,
                "x": 2012,
                "y": 0,
                "rotation": 0,
                "w": 36,
                "h": 2048,
                "label": "LIMITE LESTE"
              },
              {
                "type": "obstacle",
                "zIndex": 2,
                "x": 576,
                "y": 176,
                "rotation": 0,
                "w": 240,
                "h": 194,
                "label": "CASA 1 [NORTE CABANA]"
              },
              {
                "type": "obstacle",
                "zIndex": 3,
                "x": 1088,
                "y": 80,
                "rotation": 0,
                "w": 280,
                "h": 240,
                "label": "CASA 2 [NORTE 2 ANDARES]"
              },
              {
                "type": "obstacle",
                "zIndex": 4,
                "x": 240,
                "y": 720,
                "rotation": 0,
                "w": 216,
                "h": 168,
                "label": "CABANA OESTE"
              },
              {
                "type": "obstacle",
                "zIndex": 5,
                "x": 36,
                "y": 780,
                "rotation": 0,
                "w": 100,
                "h": 340,
                "label": "CASA OESTE EXTERNA"
              },
              {
                "type": "obstacle",
                "zIndex": 6,
                "x": 64,
                "y": 1488,
                "rotation": 0,
                "w": 246,
                "h": 300,
                "label": "CASA SUDOESTE 1"
              },
              {
                "type": "obstacle",
                "zIndex": 7,
                "x": 496,
                "y": 1744,
                "rotation": 0,
                "w": 276,
                "h": 240,
                "label": "CASA SUDOESTE 2"
              },
              {
                "type": "obstacle",
                "zIndex": 8,
                "x": 880,
                "y": 496,
                "rotation": 0,
                "w": 240,
                "h": 258,
                "label": "CASA CENTRO-NORTE"
              },
              {
                "type": "obstacle",
                "zIndex": 9,
                "x": 1184,
                "y": 496,
                "rotation": 0,
                "w": 240,
                "h": 186,
                "label": "CASA CENTRO"
              },
              {
                "type": "obstacle",
                "zIndex": 10,
                "x": 1152,
                "y": 1280,
                "rotation": 0,
                "w": 260,
                "h": 226,
                "label": "CASA CENTRAL GRANDE"
              },
              {
                "type": "obstacle",
                "zIndex": 11,
                "x": 1120,
                "y": 1792,
                "rotation": 0,
                "w": 272,
                "h": 186,
                "label": "CASA SUL"
              },
              {
                "type": "obstacle",
                "zIndex": 12,
                "x": 1920,
                "y": 1360,
                "rotation": 0,
                "w": 132,
                "h": 520,
                "label": "EDIFÍCIO SUDESTE"
              },
              {
                "type": "obstacle",
                "zIndex": 13,
                "x": 230,
                "y": 1060,
                "rotation": 0,
                "w": 92,
                "h": 130,
                "label": "CARRO PRATA"
              },
              {
                "type": "obstacle",
                "zIndex": 14,
                "x": 730,
                "y": 936,
                "rotation": 0,
                "w": 150,
                "h": 74,
                "label": "CARRO AZUL"
              },
              {
                "type": "obstacle",
                "zIndex": 15,
                "x": 1760,
                "y": 1296,
                "rotation": 0,
                "w": 108,
                "h": 144,
                "label": "PICAPE VERDE SUDESTE"
              },
              {
                "type": "obstacle",
                "zIndex": 16,
                "x": 0,
                "y": 340,
                "rotation": 0,
                "w": 140,
                "h": 220,
                "label": "ABISMO NOROESTE"
              },
              {
                "type": "obstacle",
                "zIndex": 17,
                "x": 1690,
                "y": 680,
                "rotation": 0,
                "w": 270,
                "h": 240,
                "label": "LAGO LESTE [NORTE]"
              },
              {
                "type": "obstacle",
                "zIndex": 18,
                "x": 1740,
                "y": 920,
                "rotation": 0,
                "w": 220,
                "h": 210,
                "label": "LAGO LESTE [SUL]"
              },
              {
                "type": "trash",
                "zIndex": 19,
                "x": 205,
                "y": 185,
                "rotation": 0.12,
                "id": "map1_trash_01",
                "typeIndex": 0
              },
              {
                "type": "trash",
                "zIndex": 20,
                "x": 265,
                "y": 345,
                "rotation": -0.18,
                "id": "map1_trash_02",
                "typeIndex": 1
              },
              {
                "type": "trash",
                "zIndex": 21,
                "x": 560,
                "y": 470,
                "rotation": 0.1,
                "id": "map1_trash_03",
                "typeIndex": 2
              },
              {
                "type": "trash",
                "zIndex": 22,
                "x": 560,
                "y": 720,
                "rotation": -0.15,
                "id": "map1_trash_04",
                "typeIndex": 3
              },
              {
                "type": "trash",
                "zIndex": 23,
                "x": 540,
                "y": 980,
                "rotation": 0.2,
                "id": "map1_trash_05",
                "typeIndex": 4
              },
              {
                "type": "trash",
                "zIndex": 24,
                "x": 385,
                "y": 1125,
                "rotation": -0.12,
                "id": "map1_trash_06",
                "typeIndex": 0
              },
              {
                "type": "trash",
                "zIndex": 25,
                "x": 530,
                "y": 1265,
                "rotation": 0.16,
                "id": "map1_trash_07",
                "typeIndex": 1
              },
              {
                "type": "trash",
                "zIndex": 26,
                "x": 395,
                "y": 1500,
                "rotation": -0.22,
                "id": "map1_trash_08",
                "typeIndex": 2
              },
              {
                "type": "trash",
                "zIndex": 27,
                "x": 880,
                "y": 1520,
                "rotation": 0.14,
                "id": "map1_trash_09",
                "typeIndex": 3
              },
              {
                "type": "trash",
                "zIndex": 28,
                "x": 960,
                "y": 1820,
                "rotation": -0.1,
                "id": "map1_trash_10",
                "typeIndex": 4
              },
              {
                "type": "trash",
                "zIndex": 29,
                "x": 1030,
                "y": 1040,
                "rotation": 0.18,
                "id": "map1_trash_11",
                "typeIndex": 0
              },
              {
                "type": "trash",
                "zIndex": 30,
                "x": 1250,
                "y": 920,
                "rotation": -0.16,
                "id": "map1_trash_12",
                "typeIndex": 1
              },
              {
                "type": "trash",
                "zIndex": 31,
                "x": 1580,
                "y": 920,
                "rotation": 0.11,
                "id": "map1_trash_13",
                "typeIndex": 2
              },
              {
                "type": "trash",
                "zIndex": 32,
                "x": 1540,
                "y": 1280,
                "rotation": -0.19,
                "id": "map1_trash_14",
                "typeIndex": 3
              },
              {
                "type": "trash",
                "zIndex": 33,
                "x": 1560,
                "y": 540,
                "rotation": 0.21,
                "id": "map1_trash_15",
                "typeIndex": 4
              },
              {
                "type": "trash",
                "zIndex": 34,
                "x": 1500,
                "y": 270,
                "rotation": -0.14,
                "id": "map1_trash_16",
                "typeIndex": 0
              },
              {
                "type": "obstacle",
                "zIndex": 35,
                "x": 16,
                "y": 48,
                "rotation": 0,
                "w": 400,
                "h": 304,
                "label": "COLISÃO POLIGONAL",
                "id": "poly_obs_mvtmfc2o_5bh",
                "polygon": [
                  {
                    "x": 320,
                    "y": 320
                  },
                  {
                    "x": 400,
                    "y": 240
                  },
                  {
                    "x": 384,
                    "y": 144
                  },
                  {
                    "x": 304,
                    "y": 64
                  },
                  {
                    "x": 128,
                    "y": 64
                  },
                  {
                    "x": 32,
                    "y": 160
                  },
                  {
                    "x": 32,
                    "y": 256
                  },
                  {
                    "x": 128,
                    "y": 352
                  },
                  {
                    "x": 112,
                    "y": 352
                  },
                  {
                    "x": 16,
                    "y": 256
                  },
                  {
                    "x": 16,
                    "y": 144
                  },
                  {
                    "x": 112,
                    "y": 48
                  },
                  {
                    "x": 304,
                    "y": 48
                  },
                  {
                    "x": 400,
                    "y": 144
                  },
                  {
                    "x": 416,
                    "y": 256
                  },
                  {
                    "x": 352,
                    "y": 320
                  }
                ],
                "collisionType": "solid"
              },
              {
                "type": "obstacle",
                "zIndex": 36,
                "x": 112,
                "y": 352,
                "rotation": 0,
                "w": 16,
                "h": 80,
                "label": "COLISÃO POLIGONAL",
                "id": "poly_obs_mvtmfpeo_9bp",
                "polygon": [
                  {
                    "x": 112,
                    "y": 352
                  },
                  {
                    "x": 112,
                    "y": 432
                  },
                  {
                    "x": 128,
                    "y": 432
                  },
                  {
                    "x": 128,
                    "y": 352
                  }
                ],
                "collisionType": "solid"
              },
              {
                "type": "obstacle",
                "zIndex": 37,
                "x": 320,
                "y": 320,
                "rotation": 0,
                "w": 32,
                "h": 64,
                "label": "COLISÃO POLIGONAL",
                "id": "poly_obs_mvtmfy9c_e1h",
                "polygon": [
                  {
                    "x": 320,
                    "y": 320
                  },
                  {
                    "x": 320,
                    "y": 384
                  },
                  {
                    "x": 352,
                    "y": 384
                  },
                  {
                    "x": 352,
                    "y": 320
                  }
                ],
                "collisionType": "solid"
              },
              {
                "type": "obstacle",
                "zIndex": 38,
                "x": 352,
                "y": 256,
                "rotation": 0,
                "w": 64,
                "h": 128,
                "label": "COLISÃO POLIGONAL",
                "id": "poly_obs_mvtmg59l_vnp",
                "polygon": [
                  {
                    "x": 352,
                    "y": 384
                  },
                  {
                    "x": 416,
                    "y": 320
                  },
                  {
                    "x": 416,
                    "y": 256
                  },
                  {
                    "x": 352,
                    "y": 320
                  }
                ],
                "collisionType": "solid"
              },
              {
                "type": "obstacle",
                "zIndex": 39,
                "x": 32,
                "y": 64,
                "rotation": 0,
                "w": 80,
                "h": 128,
                "label": "COLISÃO POLIGONAL",
                "id": "poly_obs_mvtmgho1_cno",
                "polygon": [
                  {
                    "x": 32,
                    "y": 192
                  },
                  {
                    "x": 32,
                    "y": 160
                  },
                  {
                    "x": 112,
                    "y": 64
                  },
                  {
                    "x": 112,
                    "y": 96
                  }
                ],
                "collisionType": "solid"
              },
              {
                "type": "obstacle",
                "zIndex": 40,
                "x": 112,
                "y": 64,
                "rotation": 0,
                "w": 192,
                "h": 32,
                "label": "COLISÃO POLIGONAL",
                "id": "poly_obs_mvtmgr9t_9n8",
                "polygon": [
                  {
                    "x": 128,
                    "y": 96
                  },
                  {
                    "x": 112,
                    "y": 64
                  },
                  {
                    "x": 304,
                    "y": 64
                  },
                  {
                    "x": 304,
                    "y": 96
                  }
                ],
                "collisionType": "solid"
              },
              {
                "type": "obstacle",
                "zIndex": 41,
                "x": 304,
                "y": 64,
                "rotation": 0,
                "w": 96,
                "h": 112,
                "label": "COLISÃO POLIGONAL",
                "id": "poly_obs_mvtmhw16_4up",
                "polygon": [
                  {
                    "x": 384,
                    "y": 176
                  },
                  {
                    "x": 304,
                    "y": 96
                  },
                  {
                    "x": 304,
                    "y": 64
                  },
                  {
                    "x": 400,
                    "y": 160
                  }
                ],
                "collisionType": "solid"
              },
              {
                "type": "obstacle",
                "zIndex": 42,
                "x": 160,
                "y": 96,
                "rotation": 0,
                "w": 96,
                "h": 48,
                "label": "COLISÃO",
                "id": "map1_obs_i57g_48"
              },
              {
                "type": "obstacle",
                "zIndex": 43,
                "x": 336,
                "y": 176,
                "rotation": 0,
                "w": 32,
                "h": 80,
                "label": "COLISÃO",
                "id": "map1_obs_i8lf_49"
              },
              {
                "type": "obstacle",
                "zIndex": 44,
                "x": 48,
                "y": 160,
                "rotation": 0,
                "w": 32,
                "h": 96,
                "label": "COLISÃO",
                "id": "map1_obs_ihgz_50"
              },
              {
                "type": "obstacle",
                "zIndex": 45,
                "x": 304,
                "y": 336,
                "rotation": 0,
                "w": 16,
                "h": 80,
                "label": "COLISÃO POLIGONAL",
                "id": "poly_obs_mvtmj85g_q2v",
                "polygon": [
                  {
                    "x": 304,
                    "y": 336
                  },
                  {
                    "x": 304,
                    "y": 400
                  },
                  {
                    "x": 304,
                    "y": 400
                  },
                  {
                    "x": 304,
                    "y": 416
                  },
                  {
                    "x": 320,
                    "y": 416
                  },
                  {
                    "x": 320,
                    "y": 400
                  },
                  {
                    "x": 320,
                    "y": 384
                  },
                  {
                    "x": 320,
                    "y": 336
                  }
                ],
                "collisionType": "solid"
              },
              {
                "type": "obstacle",
                "zIndex": 46,
                "x": 48,
                "y": 432,
                "rotation": 0,
                "w": 208,
                "h": 192,
                "label": "COLISÃO POLIGONAL",
                "id": "poly_obs_mvtmk33p_6gn",
                "polygon": [
                  {
                    "x": 128,
                    "y": 432
                  },
                  {
                    "x": 160,
                    "y": 448
                  },
                  {
                    "x": 192,
                    "y": 464
                  },
                  {
                    "x": 192,
                    "y": 480
                  },
                  {
                    "x": 208,
                    "y": 480
                  },
                  {
                    "x": 208,
                    "y": 496
                  },
                  {
                    "x": 224,
                    "y": 496
                  },
                  {
                    "x": 240,
                    "y": 512
                  },
                  {
                    "x": 240,
                    "y": 528
                  },
                  {
                    "x": 240,
                    "y": 544
                  },
                  {
                    "x": 256,
                    "y": 560
                  },
                  {
                    "x": 240,
                    "y": 576
                  },
                  {
                    "x": 240,
                    "y": 592
                  },
                  {
                    "x": 224,
                    "y": 608
                  },
                  {
                    "x": 208,
                    "y": 608
                  },
                  {
                    "x": 192,
                    "y": 608
                  },
                  {
                    "x": 160,
                    "y": 624
                  },
                  {
                    "x": 144,
                    "y": 624
                  },
                  {
                    "x": 128,
                    "y": 624
                  },
                  {
                    "x": 128,
                    "y": 608
                  },
                  {
                    "x": 96,
                    "y": 592
                  },
                  {
                    "x": 64,
                    "y": 592
                  },
                  {
                    "x": 64,
                    "y": 576
                  },
                  {
                    "x": 48,
                    "y": 560
                  }
                ],
                "collisionType": "solid"
              },
              {
                "type": "obstacle",
                "zIndex": 47,
                "x": 416,
                "y": 16,
                "rotation": 0,
                "w": 64,
                "h": 176,
                "label": "COLISÃO POLIGONAL",
                "id": "poly_obs_mvtmkoye_dfv",
                "polygon": [
                  {
                    "x": 416,
                    "y": 192
                  },
                  {
                    "x": 432,
                    "y": 192
                  },
                  {
                    "x": 448,
                    "y": 176
                  },
                  {
                    "x": 464,
                    "y": 160
                  },
                  {
                    "x": 464,
                    "y": 144
                  },
                  {
                    "x": 464,
                    "y": 112
                  },
                  {
                    "x": 480,
                    "y": 96
                  },
                  {
                    "x": 480,
                    "y": 80
                  },
                  {
                    "x": 480,
                    "y": 48
                  },
                  {
                    "x": 480,
                    "y": 32
                  },
                  {
                    "x": 480,
                    "y": 16
                  },
                  {
                    "x": 464,
                    "y": 16
                  }
                ],
                "collisionType": "solid"
              },
              {
                "type": "obstacle",
                "zIndex": 48,
                "x": 32,
                "y": 1312,
                "rotation": 0,
                "w": 64,
                "h": 64,
                "label": "COLISÃO POLIGONAL",
                "id": "poly_obs_mvtmlnqf_k4m",
                "polygon": [
                  {
                    "x": 48,
                    "y": 1312
                  },
                  {
                    "x": 48,
                    "y": 1360
                  },
                  {
                    "x": 32,
                    "y": 1360
                  },
                  {
                    "x": 32,
                    "y": 1376
                  },
                  {
                    "x": 48,
                    "y": 1376
                  },
                  {
                    "x": 64,
                    "y": 1376
                  },
                  {
                    "x": 80,
                    "y": 1376
                  },
                  {
                    "x": 96,
                    "y": 1376
                  },
                  {
                    "x": 80,
                    "y": 1360
                  },
                  {
                    "x": 80,
                    "y": 1328
                  },
                  {
                    "x": 80,
                    "y": 1312
                  }
                ],
                "collisionType": "solid"
              },
              {
                "type": "obstacle",
                "zIndex": 49,
                "x": 32,
                "y": 1968,
                "rotation": 0,
                "w": 64,
                "h": 64,
                "label": "COLISÃO POLIGONAL (Cópia)",
                "id": "poly_obs_mvtmlnqf_k4m_copy_tx3",
                "polygon": [
                  {
                    "x": 48,
                    "y": 1968
                  },
                  {
                    "x": 48,
                    "y": 2016
                  },
                  {
                    "x": 32,
                    "y": 2016
                  },
                  {
                    "x": 32,
                    "y": 2032
                  },
                  {
                    "x": 48,
                    "y": 2032
                  },
                  {
                    "x": 64,
                    "y": 2032
                  },
                  {
                    "x": 80,
                    "y": 2032
                  },
                  {
                    "x": 96,
                    "y": 2032
                  },
                  {
                    "x": 80,
                    "y": 2016
                  },
                  {
                    "x": 80,
                    "y": 1984
                  },
                  {
                    "x": 80,
                    "y": 1968
                  }
                ],
                "collisionType": "solid"
              },
              {
                "type": "obstacle",
                "zIndex": 50,
                "x": 0,
                "y": 1120,
                "rotation": 0,
                "w": 160,
                "h": 80,
                "label": "COLISÃO",
                "id": "map1_obs_nqsh_56"
              },
              {
                "type": "obstacle",
                "zIndex": 51,
                "x": 0,
                "y": 1200,
                "rotation": 0,
                "w": 112,
                "h": 832,
                "label": "COLISÃO",
                "id": "map1_obs_nvrl_57"
              },
              {
                "type": "obstacle",
                "zIndex": 52,
                "x": 1856,
                "y": 1632,
                "rotation": 0,
                "w": 48,
                "h": 400,
                "label": "COLISÃO",
                "id": "map1_obs_ovbn_58"
              },
              {
                "type": "obstacle",
                "zIndex": 53,
                "x": 800,
                "y": 816,
                "rotation": 0,
                "w": 160,
                "h": 48,
                "label": "COLISÃO",
                "id": "map1_obs_qw70_58"
              },
              {
                "type": "obstacle",
                "zIndex": 54,
                "x": 800,
                "y": 496,
                "rotation": 0,
                "w": 16,
                "h": 336,
                "label": "COLISÃO",
                "id": "map1_obs_qzs6_59"
              },
              {
                "type": "obstacle",
                "zIndex": 55,
                "x": 800,
                "y": 480,
                "rotation": 0,
                "w": 80,
                "h": 48,
                "label": "COLISÃO",
                "id": "map1_obs_r3e5_60"
              },
              {
                "type": "obstacle",
                "zIndex": 56,
                "x": 1120,
                "y": 480,
                "rotation": 0,
                "w": 48,
                "h": 48,
                "label": "COLISÃO",
                "id": "map1_obs_r6rh_61"
              },
              {
                "type": "obstacle",
                "zIndex": 57,
                "x": 1440,
                "y": 512,
                "rotation": 0,
                "w": 80,
                "h": 64,
                "label": "COLISÃO",
                "id": "map1_obs_rqxq_62"
              },
              {
                "type": "obstacle",
                "zIndex": 58,
                "x": 1024,
                "y": 160,
                "rotation": 0,
                "w": 16,
                "h": 80,
                "label": "COLISÃO",
                "id": "map1_obs_rzpi_63"
              },
              {
                "type": "obstacle",
                "zIndex": 59,
                "x": 480,
                "y": 0,
                "rotation": 0,
                "w": 592,
                "h": 112,
                "label": "COLISÃO",
                "id": "map1_obs_s8na_64"
              },
              {
                "type": "obstacle",
                "zIndex": 60,
                "x": 1376,
                "y": 16,
                "rotation": 0,
                "w": 656,
                "h": 112,
                "label": "COLISÃO",
                "id": "map1_obs_scpa_65"
              },
              {
                "type": "obstacle",
                "zIndex": 61,
                "x": 1952,
                "y": 160,
                "rotation": 0,
                "w": 64,
                "h": 416,
                "label": "COLISÃO",
                "id": "map1_obs_sf06_66"
              },
              {
                "type": "obstacle",
                "zIndex": 62,
                "x": 1440,
                "y": 288,
                "rotation": 0,
                "w": 16,
                "h": 112,
                "label": "COLISÃO",
                "id": "map1_obs_sitq_67"
              },
              {
                "type": "obstacle",
                "zIndex": 63,
                "x": 1376,
                "y": 176,
                "rotation": 0,
                "w": 48,
                "h": 48,
                "label": "COLISÃO",
                "id": "map1_obs_sn32_68"
              },
              {
                "type": "obstacle",
                "zIndex": 64,
                "x": 1488,
                "y": 576,
                "rotation": 0,
                "w": 32,
                "h": 48,
                "label": "COLISÃO",
                "id": "map1_obs_st4n_69"
              },
              {
                "type": "obstacle",
                "zIndex": 65,
                "x": 752,
                "y": 448,
                "rotation": 0,
                "w": 1184,
                "h": 944,
                "label": "Colisão água",
                "id": "poly_obs_mvtmuz3u_ibe",
                "polygon": [
                  {
                    "x": 752,
                    "y": 1200
                  },
                  {
                    "x": 816,
                    "y": 1392
                  },
                  {
                    "x": 960,
                    "y": 1312
                  },
                  {
                    "x": 1072,
                    "y": 1184
                  },
                  {
                    "x": 1216,
                    "y": 1056
                  },
                  {
                    "x": 1440,
                    "y": 1056
                  },
                  {
                    "x": 1488,
                    "y": 1056
                  },
                  {
                    "x": 1568,
                    "y": 1104
                  },
                  {
                    "x": 1680,
                    "y": 1120
                  },
                  {
                    "x": 1744,
                    "y": 1088
                  },
                  {
                    "x": 1776,
                    "y": 1056
                  },
                  {
                    "x": 1808,
                    "y": 960
                  },
                  {
                    "x": 1856,
                    "y": 976
                  },
                  {
                    "x": 1872,
                    "y": 944
                  },
                  {
                    "x": 1888,
                    "y": 912
                  },
                  {
                    "x": 1840,
                    "y": 848
                  },
                  {
                    "x": 1856,
                    "y": 752
                  },
                  {
                    "x": 1888,
                    "y": 720
                  },
                  {
                    "x": 1856,
                    "y": 704
                  },
                  {
                    "x": 1840,
                    "y": 704
                  },
                  {
                    "x": 1808,
                    "y": 704
                  },
                  {
                    "x": 1744,
                    "y": 736
                  },
                  {
                    "x": 1728,
                    "y": 736
                  },
                  {
                    "x": 1680,
                    "y": 752
                  },
                  {
                    "x": 1680,
                    "y": 704
                  },
                  {
                    "x": 1680,
                    "y": 656
                  },
                  {
                    "x": 1696,
                    "y": 592
                  },
                  {
                    "x": 1696,
                    "y": 560
                  },
                  {
                    "x": 1712,
                    "y": 528
                  },
                  {
                    "x": 1728,
                    "y": 496
                  },
                  {
                    "x": 1856,
                    "y": 496
                  },
                  {
                    "x": 1920,
                    "y": 496
                  },
                  {
                    "x": 1936,
                    "y": 480
                  },
                  {
                    "x": 1936,
                    "y": 448
                  },
                  {
                    "x": 1888,
                    "y": 448
                  },
                  {
                    "x": 1776,
                    "y": 448
                  },
                  {
                    "x": 1568,
                    "y": 464
                  },
                  {
                    "x": 1472,
                    "y": 448
                  },
                  {
                    "x": 1456,
                    "y": 464
                  },
                  {
                    "x": 1472,
                    "y": 496
                  },
                  {
                    "x": 1520,
                    "y": 496
                  },
                  {
                    "x": 1552,
                    "y": 560
                  },
                  {
                    "x": 1552,
                    "y": 576
                  },
                  {
                    "x": 1568,
                    "y": 608
                  },
                  {
                    "x": 1568,
                    "y": 704
                  },
                  {
                    "x": 1584,
                    "y": 720
                  },
                  {
                    "x": 1568,
                    "y": 768
                  },
                  {
                    "x": 1552,
                    "y": 784
                  },
                  {
                    "x": 1504,
                    "y": 816
                  },
                  {
                    "x": 1472,
                    "y": 816
                  },
                  {
                    "x": 1456,
                    "y": 800
                  },
                  {
                    "x": 1408,
                    "y": 784
                  },
                  {
                    "x": 1376,
                    "y": 768
                  },
                  {
                    "x": 1344,
                    "y": 752
                  },
                  {
                    "x": 1312,
                    "y": 752
                  },
                  {
                    "x": 1264,
                    "y": 752
                  },
                  {
                    "x": 1200,
                    "y": 768
                  },
                  {
                    "x": 1152,
                    "y": 768
                  },
                  {
                    "x": 1136,
                    "y": 784
                  },
                  {
                    "x": 1088,
                    "y": 832
                  },
                  {
                    "x": 1056,
                    "y": 864
                  },
                  {
                    "x": 992,
                    "y": 912
                  },
                  {
                    "x": 944,
                    "y": 992
                  },
                  {
                    "x": 944,
                    "y": 1008
                  },
                  {
                    "x": 896,
                    "y": 1056
                  },
                  {
                    "x": 848,
                    "y": 1104
                  },
                  {
                    "x": 784,
                    "y": 1152
                  }
                ],
                "collisionType": "solid"
              },
              {
                "type": "trash",
                "zIndex": 66,
                "x": 464,
                "y": 544,
                "rotation": 0,
                "id": "map1_trash_w1t6_67",
                "typeIndex": 0
              },
              {
                "type": "trash",
                "zIndex": 67,
                "x": 688,
                "y": 896,
                "rotation": 0,
                "id": "map1_trash_w3nm_68",
                "typeIndex": 0
              },
              {
                "type": "trash",
                "zIndex": 68,
                "x": 512,
                "y": 1072,
                "rotation": 0,
                "id": "map1_trash_wau3_69",
                "typeIndex": 0
              },
              {
                "type": "trash",
                "zIndex": 69,
                "x": 640,
                "y": 1120,
                "rotation": 0,
                "id": "map1_trash_wbf7_70",
                "typeIndex": 0
              },
              {
                "type": "trash",
                "zIndex": 70,
                "x": 656,
                "y": 672,
                "rotation": 0,
                "id": "map1_trash_wco4_71",
                "typeIndex": 0
              },
              {
                "type": "trash",
                "zIndex": 71,
                "x": 656,
                "y": 480,
                "rotation": 0,
                "id": "map1_trash_wsst_72",
                "typeIndex": 0
              },
              {
                "type": "obstacle",
                "zIndex": 72,
                "x": 880,
                "y": 304,
                "rotation": 0,
                "w": 16,
                "h": 48,
                "label": "COLISÃO",
                "id": "map1_obs_x9oj_73"
              },
              {
                "type": "obstacle",
                "zIndex": 73,
                "x": 816,
                "y": 272,
                "rotation": 0,
                "w": 16,
                "h": 96,
                "label": "COLISÃO",
                "id": "map1_obs_xkic_74"
              },
              {
                "type": "obstacle",
                "zIndex": 74,
                "x": 0,
                "y": 560,
                "rotation": 0,
                "w": 144,
                "h": 224,
                "label": "COLISÃO",
                "id": "map1_obs_z5xi_75"
              },
              {
                "type": "obstacle",
                "zIndex": 75,
                "x": 304,
                "y": 560,
                "rotation": 0,
                "w": 48,
                "h": 64,
                "label": "COLISÃO",
                "id": "map1_obs_z888_76"
              },
              {
                "type": "obstacle",
                "zIndex": 76,
                "x": 944,
                "y": 1968,
                "rotation": 0,
                "w": 144,
                "h": 80,
                "label": "TRIGGER",
                "id": "trigger_044f",
                "collisionType": "trigger",
                "isTrigger": true,
                "ai_instruction": "Abrir aviso escrito \"em breve...\""
              }
            ]
          },
          {
            "id": 3,
            "name": "Teto/Overlay",
            "itemsCount": 0,
            "items": []
          }
        ]
      },
      {
        "id": 2,
        "name": "Cena 2",
        "condition": "Depois de coletar 5 lixos a água deve ser drenada e a \"colisão água\" deve ser desativada mantenha as tremidas de tela, e só mude para o cenário sem água quando isso acontecer",
        "layers": [
          {
            "id": 0,
            "name": "Chão",
            "itemsCount": 0,
            "items": []
          },
          {
            "id": 1,
            "name": "Tapetes/Decalques",
            "itemsCount": 0,
            "items": []
          },
          {
            "id": 2,
            "name": "Objetos/Colisão",
            "itemsCount": 74,
            "items": [
              {
                "type": "obstacle",
                "zIndex": 0,
                "x": 0,
                "y": 2012,
                "rotation": 0,
                "w": 2048,
                "h": 36,
                "label": "LIMITE SUL"
              },
              {
                "type": "obstacle",
                "zIndex": 1,
                "x": 2012,
                "y": 0,
                "rotation": 0,
                "w": 36,
                "h": 2048,
                "label": "LIMITE LESTE"
              },
              {
                "type": "obstacle",
                "zIndex": 2,
                "x": 576,
                "y": 176,
                "rotation": 0,
                "w": 240,
                "h": 194,
                "label": "CASA 1 [NORTE CABANA]"
              },
              {
                "type": "obstacle",
                "zIndex": 3,
                "x": 1088,
                "y": 80,
                "rotation": 0,
                "w": 280,
                "h": 240,
                "label": "CASA 2 [NORTE 2 ANDARES]"
              },
              {
                "type": "obstacle",
                "zIndex": 4,
                "x": 240,
                "y": 720,
                "rotation": 0,
                "w": 216,
                "h": 168,
                "label": "CABANA OESTE"
              },
              {
                "type": "obstacle",
                "zIndex": 5,
                "x": 36,
                "y": 780,
                "rotation": 0,
                "w": 100,
                "h": 340,
                "label": "CASA OESTE EXTERNA"
              },
              {
                "type": "obstacle",
                "zIndex": 6,
                "x": 64,
                "y": 1488,
                "rotation": 0,
                "w": 246,
                "h": 300,
                "label": "CASA SUDOESTE 1"
              },
              {
                "type": "obstacle",
                "zIndex": 7,
                "x": 496,
                "y": 1744,
                "rotation": 0,
                "w": 276,
                "h": 240,
                "label": "CASA SUDOESTE 2"
              },
              {
                "type": "obstacle",
                "zIndex": 8,
                "x": 880,
                "y": 496,
                "rotation": 0,
                "w": 240,
                "h": 258,
                "label": "CASA CENTRO-NORTE"
              },
              {
                "type": "obstacle",
                "zIndex": 9,
                "x": 1184,
                "y": 496,
                "rotation": 0,
                "w": 240,
                "h": 186,
                "label": "CASA CENTRO"
              },
              {
                "type": "obstacle",
                "zIndex": 10,
                "x": 1152,
                "y": 1280,
                "rotation": 0,
                "w": 260,
                "h": 226,
                "label": "CASA CENTRAL GRANDE"
              },
              {
                "type": "obstacle",
                "zIndex": 11,
                "x": 1120,
                "y": 1792,
                "rotation": 0,
                "w": 272,
                "h": 186,
                "label": "CASA SUL"
              },
              {
                "type": "obstacle",
                "zIndex": 12,
                "x": 1920,
                "y": 1360,
                "rotation": 0,
                "w": 132,
                "h": 520,
                "label": "EDIFÍCIO SUDESTE"
              },
              {
                "type": "obstacle",
                "zIndex": 13,
                "x": 230,
                "y": 1060,
                "rotation": 0,
                "w": 92,
                "h": 130,
                "label": "CARRO PRATA"
              },
              {
                "type": "obstacle",
                "zIndex": 14,
                "x": 730,
                "y": 936,
                "rotation": 0,
                "w": 150,
                "h": 74,
                "label": "CARRO AZUL"
              },
              {
                "type": "obstacle",
                "zIndex": 15,
                "x": 1760,
                "y": 1296,
                "rotation": 0,
                "w": 108,
                "h": 144,
                "label": "PICAPE VERDE SUDESTE"
              },
              {
                "type": "obstacle",
                "zIndex": 16,
                "x": 0,
                "y": 340,
                "rotation": 0,
                "w": 140,
                "h": 220,
                "label": "ABISMO NOROESTE"
              },
              {
                "type": "trash",
                "zIndex": 17,
                "x": 205,
                "y": 185,
                "rotation": 0.12,
                "id": "map1_trash_01",
                "typeIndex": 0
              },
              {
                "type": "trash",
                "zIndex": 18,
                "x": 265,
                "y": 345,
                "rotation": -0.18,
                "id": "map1_trash_02",
                "typeIndex": 1
              },
              {
                "type": "trash",
                "zIndex": 19,
                "x": 560,
                "y": 470,
                "rotation": 0.1,
                "id": "map1_trash_03",
                "typeIndex": 2
              },
              {
                "type": "trash",
                "zIndex": 20,
                "x": 560,
                "y": 720,
                "rotation": -0.15,
                "id": "map1_trash_04",
                "typeIndex": 3
              },
              {
                "type": "trash",
                "zIndex": 21,
                "x": 540,
                "y": 980,
                "rotation": 0.2,
                "id": "map1_trash_05",
                "typeIndex": 4
              },
              {
                "type": "trash",
                "zIndex": 22,
                "x": 385,
                "y": 1125,
                "rotation": -0.12,
                "id": "map1_trash_06",
                "typeIndex": 0
              },
              {
                "type": "trash",
                "zIndex": 23,
                "x": 530,
                "y": 1265,
                "rotation": 0.16,
                "id": "map1_trash_07",
                "typeIndex": 1
              },
              {
                "type": "trash",
                "zIndex": 24,
                "x": 395,
                "y": 1500,
                "rotation": -0.22,
                "id": "map1_trash_08",
                "typeIndex": 2
              },
              {
                "type": "trash",
                "zIndex": 25,
                "x": 880,
                "y": 1520,
                "rotation": 0.14,
                "id": "map1_trash_09",
                "typeIndex": 3
              },
              {
                "type": "trash",
                "zIndex": 26,
                "x": 960,
                "y": 1820,
                "rotation": -0.1,
                "id": "map1_trash_10",
                "typeIndex": 4
              },
              {
                "type": "trash",
                "zIndex": 27,
                "x": 1030,
                "y": 1040,
                "rotation": 0.18,
                "id": "map1_trash_11",
                "typeIndex": 0
              },
              {
                "type": "trash",
                "zIndex": 28,
                "x": 1250,
                "y": 920,
                "rotation": -0.16,
                "id": "map1_trash_12",
                "typeIndex": 1
              },
              {
                "type": "trash",
                "zIndex": 29,
                "x": 1580,
                "y": 920,
                "rotation": 0.11,
                "id": "map1_trash_13",
                "typeIndex": 2
              },
              {
                "type": "trash",
                "zIndex": 30,
                "x": 1540,
                "y": 1280,
                "rotation": -0.19,
                "id": "map1_trash_14",
                "typeIndex": 3
              },
              {
                "type": "trash",
                "zIndex": 31,
                "x": 1560,
                "y": 540,
                "rotation": 0.21,
                "id": "map1_trash_15",
                "typeIndex": 4
              },
              {
                "type": "trash",
                "zIndex": 32,
                "x": 1500,
                "y": 270,
                "rotation": -0.14,
                "id": "map1_trash_16",
                "typeIndex": 0
              },
              {
                "type": "obstacle",
                "zIndex": 33,
                "x": 16,
                "y": 48,
                "rotation": 0,
                "w": 400,
                "h": 304,
                "label": "COLISÃO POLIGONAL",
                "id": "poly_obs_mvtmfc2o_5bh",
                "polygon": [
                  {
                    "x": 320,
                    "y": 320
                  },
                  {
                    "x": 400,
                    "y": 240
                  },
                  {
                    "x": 384,
                    "y": 144
                  },
                  {
                    "x": 304,
                    "y": 64
                  },
                  {
                    "x": 128,
                    "y": 64
                  },
                  {
                    "x": 32,
                    "y": 160
                  },
                  {
                    "x": 32,
                    "y": 256
                  },
                  {
                    "x": 128,
                    "y": 352
                  },
                  {
                    "x": 112,
                    "y": 352
                  },
                  {
                    "x": 16,
                    "y": 256
                  },
                  {
                    "x": 16,
                    "y": 144
                  },
                  {
                    "x": 112,
                    "y": 48
                  },
                  {
                    "x": 304,
                    "y": 48
                  },
                  {
                    "x": 400,
                    "y": 144
                  },
                  {
                    "x": 416,
                    "y": 256
                  },
                  {
                    "x": 352,
                    "y": 320
                  }
                ],
                "collisionType": "solid"
              },
              {
                "type": "obstacle",
                "zIndex": 34,
                "x": 112,
                "y": 352,
                "rotation": 0,
                "w": 16,
                "h": 80,
                "label": "COLISÃO POLIGONAL",
                "id": "poly_obs_mvtmfpeo_9bp",
                "polygon": [
                  {
                    "x": 112,
                    "y": 352
                  },
                  {
                    "x": 112,
                    "y": 432
                  },
                  {
                    "x": 128,
                    "y": 432
                  },
                  {
                    "x": 128,
                    "y": 352
                  }
                ],
                "collisionType": "solid"
              },
              {
                "type": "obstacle",
                "zIndex": 35,
                "x": 320,
                "y": 320,
                "rotation": 0,
                "w": 32,
                "h": 64,
                "label": "COLISÃO POLIGONAL",
                "id": "poly_obs_mvtmfy9c_e1h",
                "polygon": [
                  {
                    "x": 320,
                    "y": 320
                  },
                  {
                    "x": 320,
                    "y": 384
                  },
                  {
                    "x": 352,
                    "y": 384
                  },
                  {
                    "x": 352,
                    "y": 320
                  }
                ],
                "collisionType": "solid"
              },
              {
                "type": "obstacle",
                "zIndex": 36,
                "x": 352,
                "y": 256,
                "rotation": 0,
                "w": 64,
                "h": 128,
                "label": "COLISÃO POLIGONAL",
                "id": "poly_obs_mvtmg59l_vnp",
                "polygon": [
                  {
                    "x": 352,
                    "y": 384
                  },
                  {
                    "x": 416,
                    "y": 320
                  },
                  {
                    "x": 416,
                    "y": 256
                  },
                  {
                    "x": 352,
                    "y": 320
                  }
                ],
                "collisionType": "solid"
              },
              {
                "type": "obstacle",
                "zIndex": 37,
                "x": 32,
                "y": 64,
                "rotation": 0,
                "w": 80,
                "h": 128,
                "label": "COLISÃO POLIGONAL",
                "id": "poly_obs_mvtmgho1_cno",
                "polygon": [
                  {
                    "x": 32,
                    "y": 192
                  },
                  {
                    "x": 32,
                    "y": 160
                  },
                  {
                    "x": 112,
                    "y": 64
                  },
                  {
                    "x": 112,
                    "y": 96
                  }
                ],
                "collisionType": "solid"
              },
              {
                "type": "obstacle",
                "zIndex": 38,
                "x": 112,
                "y": 64,
                "rotation": 0,
                "w": 192,
                "h": 32,
                "label": "COLISÃO POLIGONAL",
                "id": "poly_obs_mvtmgr9t_9n8",
                "polygon": [
                  {
                    "x": 128,
                    "y": 96
                  },
                  {
                    "x": 112,
                    "y": 64
                  },
                  {
                    "x": 304,
                    "y": 64
                  },
                  {
                    "x": 304,
                    "y": 96
                  }
                ],
                "collisionType": "solid"
              },
              {
                "type": "obstacle",
                "zIndex": 39,
                "x": 304,
                "y": 64,
                "rotation": 0,
                "w": 96,
                "h": 112,
                "label": "COLISÃO POLIGONAL",
                "id": "poly_obs_mvtmhw16_4up",
                "polygon": [
                  {
                    "x": 384,
                    "y": 176
                  },
                  {
                    "x": 304,
                    "y": 96
                  },
                  {
                    "x": 304,
                    "y": 64
                  },
                  {
                    "x": 400,
                    "y": 160
                  }
                ],
                "collisionType": "solid"
              },
              {
                "type": "obstacle",
                "zIndex": 40,
                "x": 160,
                "y": 96,
                "rotation": 0,
                "w": 96,
                "h": 48,
                "label": "COLISÃO",
                "id": "map1_obs_i57g_48"
              },
              {
                "type": "obstacle",
                "zIndex": 41,
                "x": 336,
                "y": 176,
                "rotation": 0,
                "w": 32,
                "h": 80,
                "label": "COLISÃO",
                "id": "map1_obs_i8lf_49"
              },
              {
                "type": "obstacle",
                "zIndex": 42,
                "x": 48,
                "y": 160,
                "rotation": 0,
                "w": 32,
                "h": 96,
                "label": "COLISÃO",
                "id": "map1_obs_ihgz_50"
              },
              {
                "type": "obstacle",
                "zIndex": 43,
                "x": 304,
                "y": 336,
                "rotation": 0,
                "w": 16,
                "h": 80,
                "label": "COLISÃO POLIGONAL",
                "id": "poly_obs_mvtmj85g_q2v",
                "polygon": [
                  {
                    "x": 304,
                    "y": 336
                  },
                  {
                    "x": 304,
                    "y": 400
                  },
                  {
                    "x": 304,
                    "y": 400
                  },
                  {
                    "x": 304,
                    "y": 416
                  },
                  {
                    "x": 320,
                    "y": 416
                  },
                  {
                    "x": 320,
                    "y": 400
                  },
                  {
                    "x": 320,
                    "y": 384
                  },
                  {
                    "x": 320,
                    "y": 336
                  }
                ],
                "collisionType": "solid"
              },
              {
                "type": "obstacle",
                "zIndex": 44,
                "x": 48,
                "y": 432,
                "rotation": 0,
                "w": 208,
                "h": 192,
                "label": "COLISÃO POLIGONAL",
                "id": "poly_obs_mvtmk33p_6gn",
                "polygon": [
                  {
                    "x": 128,
                    "y": 432
                  },
                  {
                    "x": 160,
                    "y": 448
                  },
                  {
                    "x": 192,
                    "y": 464
                  },
                  {
                    "x": 192,
                    "y": 480
                  },
                  {
                    "x": 208,
                    "y": 480
                  },
                  {
                    "x": 208,
                    "y": 496
                  },
                  {
                    "x": 224,
                    "y": 496
                  },
                  {
                    "x": 240,
                    "y": 512
                  },
                  {
                    "x": 240,
                    "y": 528
                  },
                  {
                    "x": 240,
                    "y": 544
                  },
                  {
                    "x": 256,
                    "y": 560
                  },
                  {
                    "x": 240,
                    "y": 576
                  },
                  {
                    "x": 240,
                    "y": 592
                  },
                  {
                    "x": 224,
                    "y": 608
                  },
                  {
                    "x": 208,
                    "y": 608
                  },
                  {
                    "x": 192,
                    "y": 608
                  },
                  {
                    "x": 160,
                    "y": 624
                  },
                  {
                    "x": 144,
                    "y": 624
                  },
                  {
                    "x": 128,
                    "y": 624
                  },
                  {
                    "x": 128,
                    "y": 608
                  },
                  {
                    "x": 96,
                    "y": 592
                  },
                  {
                    "x": 64,
                    "y": 592
                  },
                  {
                    "x": 64,
                    "y": 576
                  },
                  {
                    "x": 48,
                    "y": 560
                  }
                ],
                "collisionType": "solid"
              },
              {
                "type": "obstacle",
                "zIndex": 45,
                "x": 416,
                "y": 16,
                "rotation": 0,
                "w": 64,
                "h": 176,
                "label": "COLISÃO POLIGONAL",
                "id": "poly_obs_mvtmkoye_dfv",
                "polygon": [
                  {
                    "x": 416,
                    "y": 192
                  },
                  {
                    "x": 432,
                    "y": 192
                  },
                  {
                    "x": 448,
                    "y": 176
                  },
                  {
                    "x": 464,
                    "y": 160
                  },
                  {
                    "x": 464,
                    "y": 144
                  },
                  {
                    "x": 464,
                    "y": 112
                  },
                  {
                    "x": 480,
                    "y": 96
                  },
                  {
                    "x": 480,
                    "y": 80
                  },
                  {
                    "x": 480,
                    "y": 48
                  },
                  {
                    "x": 480,
                    "y": 32
                  },
                  {
                    "x": 480,
                    "y": 16
                  },
                  {
                    "x": 464,
                    "y": 16
                  }
                ],
                "collisionType": "solid"
              },
              {
                "type": "obstacle",
                "zIndex": 46,
                "x": 32,
                "y": 1312,
                "rotation": 0,
                "w": 64,
                "h": 64,
                "label": "COLISÃO POLIGONAL",
                "id": "poly_obs_mvtmlnqf_k4m",
                "polygon": [
                  {
                    "x": 48,
                    "y": 1312
                  },
                  {
                    "x": 48,
                    "y": 1360
                  },
                  {
                    "x": 32,
                    "y": 1360
                  },
                  {
                    "x": 32,
                    "y": 1376
                  },
                  {
                    "x": 48,
                    "y": 1376
                  },
                  {
                    "x": 64,
                    "y": 1376
                  },
                  {
                    "x": 80,
                    "y": 1376
                  },
                  {
                    "x": 96,
                    "y": 1376
                  },
                  {
                    "x": 80,
                    "y": 1360
                  },
                  {
                    "x": 80,
                    "y": 1328
                  },
                  {
                    "x": 80,
                    "y": 1312
                  }
                ],
                "collisionType": "solid"
              },
              {
                "type": "obstacle",
                "zIndex": 47,
                "x": 32,
                "y": 1968,
                "rotation": 0,
                "w": 64,
                "h": 64,
                "label": "COLISÃO POLIGONAL (Cópia)",
                "id": "poly_obs_mvtmlnqf_k4m_copy_tx3",
                "polygon": [
                  {
                    "x": 48,
                    "y": 1968
                  },
                  {
                    "x": 48,
                    "y": 2016
                  },
                  {
                    "x": 32,
                    "y": 2016
                  },
                  {
                    "x": 32,
                    "y": 2032
                  },
                  {
                    "x": 48,
                    "y": 2032
                  },
                  {
                    "x": 64,
                    "y": 2032
                  },
                  {
                    "x": 80,
                    "y": 2032
                  },
                  {
                    "x": 96,
                    "y": 2032
                  },
                  {
                    "x": 80,
                    "y": 2016
                  },
                  {
                    "x": 80,
                    "y": 1984
                  },
                  {
                    "x": 80,
                    "y": 1968
                  }
                ],
                "collisionType": "solid"
              },
              {
                "type": "obstacle",
                "zIndex": 48,
                "x": 0,
                "y": 1120,
                "rotation": 0,
                "w": 160,
                "h": 80,
                "label": "COLISÃO",
                "id": "map1_obs_nqsh_56"
              },
              {
                "type": "obstacle",
                "zIndex": 49,
                "x": 0,
                "y": 1200,
                "rotation": 0,
                "w": 112,
                "h": 832,
                "label": "COLISÃO",
                "id": "map1_obs_nvrl_57"
              },
              {
                "type": "obstacle",
                "zIndex": 50,
                "x": 1856,
                "y": 1632,
                "rotation": 0,
                "w": 48,
                "h": 400,
                "label": "COLISÃO",
                "id": "map1_obs_ovbn_58"
              },
              {
                "type": "obstacle",
                "zIndex": 51,
                "x": 800,
                "y": 816,
                "rotation": 0,
                "w": 160,
                "h": 48,
                "label": "COLISÃO",
                "id": "map1_obs_qw70_58"
              },
              {
                "type": "obstacle",
                "zIndex": 52,
                "x": 800,
                "y": 496,
                "rotation": 0,
                "w": 16,
                "h": 336,
                "label": "COLISÃO",
                "id": "map1_obs_qzs6_59"
              },
              {
                "type": "obstacle",
                "zIndex": 53,
                "x": 800,
                "y": 480,
                "rotation": 0,
                "w": 80,
                "h": 48,
                "label": "COLISÃO",
                "id": "map1_obs_r3e5_60"
              },
              {
                "type": "obstacle",
                "zIndex": 54,
                "x": 1120,
                "y": 480,
                "rotation": 0,
                "w": 48,
                "h": 48,
                "label": "COLISÃO",
                "id": "map1_obs_r6rh_61"
              },
              {
                "type": "obstacle",
                "zIndex": 55,
                "x": 1440,
                "y": 512,
                "rotation": 0,
                "w": 80,
                "h": 64,
                "label": "COLISÃO",
                "id": "map1_obs_rqxq_62"
              },
              {
                "type": "obstacle",
                "zIndex": 56,
                "x": 1024,
                "y": 160,
                "rotation": 0,
                "w": 16,
                "h": 80,
                "label": "COLISÃO",
                "id": "map1_obs_rzpi_63"
              },
              {
                "type": "obstacle",
                "zIndex": 57,
                "x": 480,
                "y": 0,
                "rotation": 0,
                "w": 592,
                "h": 112,
                "label": "COLISÃO",
                "id": "map1_obs_s8na_64"
              },
              {
                "type": "obstacle",
                "zIndex": 58,
                "x": 1376,
                "y": 16,
                "rotation": 0,
                "w": 656,
                "h": 112,
                "label": "COLISÃO",
                "id": "map1_obs_scpa_65"
              },
              {
                "type": "obstacle",
                "zIndex": 59,
                "x": 1952,
                "y": 160,
                "rotation": 0,
                "w": 64,
                "h": 416,
                "label": "COLISÃO",
                "id": "map1_obs_sf06_66"
              },
              {
                "type": "obstacle",
                "zIndex": 60,
                "x": 1440,
                "y": 288,
                "rotation": 0,
                "w": 16,
                "h": 112,
                "label": "COLISÃO",
                "id": "map1_obs_sitq_67"
              },
              {
                "type": "obstacle",
                "zIndex": 61,
                "x": 1376,
                "y": 176,
                "rotation": 0,
                "w": 48,
                "h": 48,
                "label": "COLISÃO",
                "id": "map1_obs_sn32_68"
              },
              {
                "type": "obstacle",
                "zIndex": 62,
                "x": 1488,
                "y": 576,
                "rotation": 0,
                "w": 32,
                "h": 48,
                "label": "COLISÃO",
                "id": "map1_obs_st4n_69"
              },
              {
                "type": "trash",
                "zIndex": 63,
                "x": 464,
                "y": 544,
                "rotation": 0,
                "id": "map1_trash_w1t6_67",
                "typeIndex": 0
              },
              {
                "type": "trash",
                "zIndex": 64,
                "x": 688,
                "y": 896,
                "rotation": 0,
                "id": "map1_trash_w3nm_68",
                "typeIndex": 0
              },
              {
                "type": "trash",
                "zIndex": 65,
                "x": 512,
                "y": 1072,
                "rotation": 0,
                "id": "map1_trash_wau3_69",
                "typeIndex": 0
              },
              {
                "type": "trash",
                "zIndex": 66,
                "x": 640,
                "y": 1120,
                "rotation": 0,
                "id": "map1_trash_wbf7_70",
                "typeIndex": 0
              },
              {
                "type": "trash",
                "zIndex": 67,
                "x": 656,
                "y": 672,
                "rotation": 0,
                "id": "map1_trash_wco4_71",
                "typeIndex": 0
              },
              {
                "type": "trash",
                "zIndex": 68,
                "x": 656,
                "y": 480,
                "rotation": 0,
                "id": "map1_trash_wsst_72",
                "typeIndex": 0
              },
              {
                "type": "obstacle",
                "zIndex": 69,
                "x": 880,
                "y": 304,
                "rotation": 0,
                "w": 16,
                "h": 48,
                "label": "COLISÃO",
                "id": "map1_obs_x9oj_73"
              },
              {
                "type": "obstacle",
                "zIndex": 70,
                "x": 816,
                "y": 272,
                "rotation": 0,
                "w": 16,
                "h": 96,
                "label": "COLISÃO",
                "id": "map1_obs_xkic_74"
              },
              {
                "type": "obstacle",
                "zIndex": 71,
                "x": 0,
                "y": 560,
                "rotation": 0,
                "w": 144,
                "h": 224,
                "label": "COLISÃO",
                "id": "map1_obs_z5xi_75"
              },
              {
                "type": "obstacle",
                "zIndex": 72,
                "x": 304,
                "y": 560,
                "rotation": 0,
                "w": 48,
                "h": 64,
                "label": "COLISÃO",
                "id": "map1_obs_z888_76"
              },
              {
                "type": "obstacle",
                "zIndex": 73,
                "x": 944,
                "y": 1968,
                "rotation": 0,
                "w": 144,
                "h": 80,
                "label": "TRIGGER",
                "id": "trigger_044f",
                "collisionType": "trigger",
                "isTrigger": true,
                "ai_instruction": "Abrir aviso escrito \"em breve...\""
              }
            ]
          },
          {
            "id": 3,
            "name": "Teto/Overlay",
            "itemsCount": 0,
            "items": []
          }
        ]
      }
    ],
    "layers": [
      {
        "id": 0,
        "name": "Chão",
        "itemsCount": 0,
        "items": []
      },
      {
        "id": 1,
        "name": "Tapetes/Decalques",
        "itemsCount": 0,
        "items": []
      },
      {
        "id": 2,
        "name": "Objetos/Colisão",
        "itemsCount": 77,
        "items": [
          {
            "type": "obstacle",
            "zIndex": 0,
            "x": 0,
            "y": 2012,
            "rotation": 0,
            "w": 2048,
            "h": 36,
            "label": "LIMITE SUL"
          },
          {
            "type": "obstacle",
            "zIndex": 1,
            "x": 2012,
            "y": 0,
            "rotation": 0,
            "w": 36,
            "h": 2048,
            "label": "LIMITE LESTE"
          },
          {
            "type": "obstacle",
            "zIndex": 2,
            "x": 576,
            "y": 176,
            "rotation": 0,
            "w": 240,
            "h": 194,
            "label": "CASA 1 [NORTE CABANA]"
          },
          {
            "type": "obstacle",
            "zIndex": 3,
            "x": 1088,
            "y": 80,
            "rotation": 0,
            "w": 280,
            "h": 240,
            "label": "CASA 2 [NORTE 2 ANDARES]"
          },
          {
            "type": "obstacle",
            "zIndex": 4,
            "x": 240,
            "y": 720,
            "rotation": 0,
            "w": 216,
            "h": 168,
            "label": "CABANA OESTE"
          },
          {
            "type": "obstacle",
            "zIndex": 5,
            "x": 36,
            "y": 780,
            "rotation": 0,
            "w": 100,
            "h": 340,
            "label": "CASA OESTE EXTERNA"
          },
          {
            "type": "obstacle",
            "zIndex": 6,
            "x": 64,
            "y": 1488,
            "rotation": 0,
            "w": 246,
            "h": 300,
            "label": "CASA SUDOESTE 1"
          },
          {
            "type": "obstacle",
            "zIndex": 7,
            "x": 496,
            "y": 1744,
            "rotation": 0,
            "w": 276,
            "h": 240,
            "label": "CASA SUDOESTE 2"
          },
          {
            "type": "obstacle",
            "zIndex": 8,
            "x": 880,
            "y": 496,
            "rotation": 0,
            "w": 240,
            "h": 258,
            "label": "CASA CENTRO-NORTE"
          },
          {
            "type": "obstacle",
            "zIndex": 9,
            "x": 1184,
            "y": 496,
            "rotation": 0,
            "w": 240,
            "h": 186,
            "label": "CASA CENTRO"
          },
          {
            "type": "obstacle",
            "zIndex": 10,
            "x": 1152,
            "y": 1280,
            "rotation": 0,
            "w": 260,
            "h": 226,
            "label": "CASA CENTRAL GRANDE"
          },
          {
            "type": "obstacle",
            "zIndex": 11,
            "x": 1120,
            "y": 1792,
            "rotation": 0,
            "w": 272,
            "h": 186,
            "label": "CASA SUL"
          },
          {
            "type": "obstacle",
            "zIndex": 12,
            "x": 1920,
            "y": 1360,
            "rotation": 0,
            "w": 132,
            "h": 520,
            "label": "EDIFÍCIO SUDESTE"
          },
          {
            "type": "obstacle",
            "zIndex": 13,
            "x": 230,
            "y": 1060,
            "rotation": 0,
            "w": 92,
            "h": 130,
            "label": "CARRO PRATA"
          },
          {
            "type": "obstacle",
            "zIndex": 14,
            "x": 730,
            "y": 936,
            "rotation": 0,
            "w": 150,
            "h": 74,
            "label": "CARRO AZUL"
          },
          {
            "type": "obstacle",
            "zIndex": 15,
            "x": 1760,
            "y": 1296,
            "rotation": 0,
            "w": 108,
            "h": 144,
            "label": "PICAPE VERDE SUDESTE"
          },
          {
            "type": "obstacle",
            "zIndex": 16,
            "x": 0,
            "y": 340,
            "rotation": 0,
            "w": 140,
            "h": 220,
            "label": "ABISMO NOROESTE"
          },
          {
            "type": "obstacle",
            "zIndex": 17,
            "x": 1690,
            "y": 680,
            "rotation": 0,
            "w": 270,
            "h": 240,
            "label": "LAGO LESTE [NORTE]"
          },
          {
            "type": "obstacle",
            "zIndex": 18,
            "x": 1740,
            "y": 920,
            "rotation": 0,
            "w": 220,
            "h": 210,
            "label": "LAGO LESTE [SUL]"
          },
          {
            "type": "trash",
            "zIndex": 19,
            "x": 205,
            "y": 185,
            "rotation": 0.12,
            "id": "map1_trash_01",
            "typeIndex": 0
          },
          {
            "type": "trash",
            "zIndex": 20,
            "x": 265,
            "y": 345,
            "rotation": -0.18,
            "id": "map1_trash_02",
            "typeIndex": 1
          },
          {
            "type": "trash",
            "zIndex": 21,
            "x": 560,
            "y": 470,
            "rotation": 0.1,
            "id": "map1_trash_03",
            "typeIndex": 2
          },
          {
            "type": "trash",
            "zIndex": 22,
            "x": 560,
            "y": 720,
            "rotation": -0.15,
            "id": "map1_trash_04",
            "typeIndex": 3
          },
          {
            "type": "trash",
            "zIndex": 23,
            "x": 540,
            "y": 980,
            "rotation": 0.2,
            "id": "map1_trash_05",
            "typeIndex": 4
          },
          {
            "type": "trash",
            "zIndex": 24,
            "x": 385,
            "y": 1125,
            "rotation": -0.12,
            "id": "map1_trash_06",
            "typeIndex": 0
          },
          {
            "type": "trash",
            "zIndex": 25,
            "x": 530,
            "y": 1265,
            "rotation": 0.16,
            "id": "map1_trash_07",
            "typeIndex": 1
          },
          {
            "type": "trash",
            "zIndex": 26,
            "x": 395,
            "y": 1500,
            "rotation": -0.22,
            "id": "map1_trash_08",
            "typeIndex": 2
          },
          {
            "type": "trash",
            "zIndex": 27,
            "x": 880,
            "y": 1520,
            "rotation": 0.14,
            "id": "map1_trash_09",
            "typeIndex": 3
          },
          {
            "type": "trash",
            "zIndex": 28,
            "x": 960,
            "y": 1820,
            "rotation": -0.1,
            "id": "map1_trash_10",
            "typeIndex": 4
          },
          {
            "type": "trash",
            "zIndex": 29,
            "x": 1030,
            "y": 1040,
            "rotation": 0.18,
            "id": "map1_trash_11",
            "typeIndex": 0
          },
          {
            "type": "trash",
            "zIndex": 30,
            "x": 1250,
            "y": 920,
            "rotation": -0.16,
            "id": "map1_trash_12",
            "typeIndex": 1
          },
          {
            "type": "trash",
            "zIndex": 31,
            "x": 1580,
            "y": 920,
            "rotation": 0.11,
            "id": "map1_trash_13",
            "typeIndex": 2
          },
          {
            "type": "trash",
            "zIndex": 32,
            "x": 1540,
            "y": 1280,
            "rotation": -0.19,
            "id": "map1_trash_14",
            "typeIndex": 3
          },
          {
            "type": "trash",
            "zIndex": 33,
            "x": 1560,
            "y": 540,
            "rotation": 0.21,
            "id": "map1_trash_15",
            "typeIndex": 4
          },
          {
            "type": "trash",
            "zIndex": 34,
            "x": 1500,
            "y": 270,
            "rotation": -0.14,
            "id": "map1_trash_16",
            "typeIndex": 0
          },
          {
            "type": "obstacle",
            "zIndex": 35,
            "x": 16,
            "y": 48,
            "rotation": 0,
            "w": 400,
            "h": 304,
            "label": "COLISÃO POLIGONAL",
            "id": "poly_obs_mvtmfc2o_5bh",
            "polygon": [
              {
                "x": 320,
                "y": 320
              },
              {
                "x": 400,
                "y": 240
              },
              {
                "x": 384,
                "y": 144
              },
              {
                "x": 304,
                "y": 64
              },
              {
                "x": 128,
                "y": 64
              },
              {
                "x": 32,
                "y": 160
              },
              {
                "x": 32,
                "y": 256
              },
              {
                "x": 128,
                "y": 352
              },
              {
                "x": 112,
                "y": 352
              },
              {
                "x": 16,
                "y": 256
              },
              {
                "x": 16,
                "y": 144
              },
              {
                "x": 112,
                "y": 48
              },
              {
                "x": 304,
                "y": 48
              },
              {
                "x": 400,
                "y": 144
              },
              {
                "x": 416,
                "y": 256
              },
              {
                "x": 352,
                "y": 320
              }
            ],
            "collisionType": "solid"
          },
          {
            "type": "obstacle",
            "zIndex": 36,
            "x": 112,
            "y": 352,
            "rotation": 0,
            "w": 16,
            "h": 80,
            "label": "COLISÃO POLIGONAL",
            "id": "poly_obs_mvtmfpeo_9bp",
            "polygon": [
              {
                "x": 112,
                "y": 352
              },
              {
                "x": 112,
                "y": 432
              },
              {
                "x": 128,
                "y": 432
              },
              {
                "x": 128,
                "y": 352
              }
            ],
            "collisionType": "solid"
          },
          {
            "type": "obstacle",
            "zIndex": 37,
            "x": 320,
            "y": 320,
            "rotation": 0,
            "w": 32,
            "h": 64,
            "label": "COLISÃO POLIGONAL",
            "id": "poly_obs_mvtmfy9c_e1h",
            "polygon": [
              {
                "x": 320,
                "y": 320
              },
              {
                "x": 320,
                "y": 384
              },
              {
                "x": 352,
                "y": 384
              },
              {
                "x": 352,
                "y": 320
              }
            ],
            "collisionType": "solid"
          },
          {
            "type": "obstacle",
            "zIndex": 38,
            "x": 352,
            "y": 256,
            "rotation": 0,
            "w": 64,
            "h": 128,
            "label": "COLISÃO POLIGONAL",
            "id": "poly_obs_mvtmg59l_vnp",
            "polygon": [
              {
                "x": 352,
                "y": 384
              },
              {
                "x": 416,
                "y": 320
              },
              {
                "x": 416,
                "y": 256
              },
              {
                "x": 352,
                "y": 320
              }
            ],
            "collisionType": "solid"
          },
          {
            "type": "obstacle",
            "zIndex": 39,
            "x": 32,
            "y": 64,
            "rotation": 0,
            "w": 80,
            "h": 128,
            "label": "COLISÃO POLIGONAL",
            "id": "poly_obs_mvtmgho1_cno",
            "polygon": [
              {
                "x": 32,
                "y": 192
              },
              {
                "x": 32,
                "y": 160
              },
              {
                "x": 112,
                "y": 64
              },
              {
                "x": 112,
                "y": 96
              }
            ],
            "collisionType": "solid"
          },
          {
            "type": "obstacle",
            "zIndex": 40,
            "x": 112,
            "y": 64,
            "rotation": 0,
            "w": 192,
            "h": 32,
            "label": "COLISÃO POLIGONAL",
            "id": "poly_obs_mvtmgr9t_9n8",
            "polygon": [
              {
                "x": 128,
                "y": 96
              },
              {
                "x": 112,
                "y": 64
              },
              {
                "x": 304,
                "y": 64
              },
              {
                "x": 304,
                "y": 96
              }
            ],
            "collisionType": "solid"
          },
          {
            "type": "obstacle",
            "zIndex": 41,
            "x": 304,
            "y": 64,
            "rotation": 0,
            "w": 96,
            "h": 112,
            "label": "COLISÃO POLIGONAL",
            "id": "poly_obs_mvtmhw16_4up",
            "polygon": [
              {
                "x": 384,
                "y": 176
              },
              {
                "x": 304,
                "y": 96
              },
              {
                "x": 304,
                "y": 64
              },
              {
                "x": 400,
                "y": 160
              }
            ],
            "collisionType": "solid"
          },
          {
            "type": "obstacle",
            "zIndex": 42,
            "x": 160,
            "y": 96,
            "rotation": 0,
            "w": 96,
            "h": 48,
            "label": "COLISÃO",
            "id": "map1_obs_i57g_48"
          },
          {
            "type": "obstacle",
            "zIndex": 43,
            "x": 336,
            "y": 176,
            "rotation": 0,
            "w": 32,
            "h": 80,
            "label": "COLISÃO",
            "id": "map1_obs_i8lf_49"
          },
          {
            "type": "obstacle",
            "zIndex": 44,
            "x": 48,
            "y": 160,
            "rotation": 0,
            "w": 32,
            "h": 96,
            "label": "COLISÃO",
            "id": "map1_obs_ihgz_50"
          },
          {
            "type": "obstacle",
            "zIndex": 45,
            "x": 304,
            "y": 336,
            "rotation": 0,
            "w": 16,
            "h": 80,
            "label": "COLISÃO POLIGONAL",
            "id": "poly_obs_mvtmj85g_q2v",
            "polygon": [
              {
                "x": 304,
                "y": 336
              },
              {
                "x": 304,
                "y": 400
              },
              {
                "x": 304,
                "y": 400
              },
              {
                "x": 304,
                "y": 416
              },
              {
                "x": 320,
                "y": 416
              },
              {
                "x": 320,
                "y": 400
              },
              {
                "x": 320,
                "y": 384
              },
              {
                "x": 320,
                "y": 336
              }
            ],
            "collisionType": "solid"
          },
          {
            "type": "obstacle",
            "zIndex": 46,
            "x": 48,
            "y": 432,
            "rotation": 0,
            "w": 208,
            "h": 192,
            "label": "COLISÃO POLIGONAL",
            "id": "poly_obs_mvtmk33p_6gn",
            "polygon": [
              {
                "x": 128,
                "y": 432
              },
              {
                "x": 160,
                "y": 448
              },
              {
                "x": 192,
                "y": 464
              },
              {
                "x": 192,
                "y": 480
              },
              {
                "x": 208,
                "y": 480
              },
              {
                "x": 208,
                "y": 496
              },
              {
                "x": 224,
                "y": 496
              },
              {
                "x": 240,
                "y": 512
              },
              {
                "x": 240,
                "y": 528
              },
              {
                "x": 240,
                "y": 544
              },
              {
                "x": 256,
                "y": 560
              },
              {
                "x": 240,
                "y": 576
              },
              {
                "x": 240,
                "y": 592
              },
              {
                "x": 224,
                "y": 608
              },
              {
                "x": 208,
                "y": 608
              },
              {
                "x": 192,
                "y": 608
              },
              {
                "x": 160,
                "y": 624
              },
              {
                "x": 144,
                "y": 624
              },
              {
                "x": 128,
                "y": 624
              },
              {
                "x": 128,
                "y": 608
              },
              {
                "x": 96,
                "y": 592
              },
              {
                "x": 64,
                "y": 592
              },
              {
                "x": 64,
                "y": 576
              },
              {
                "x": 48,
                "y": 560
              }
            ],
            "collisionType": "solid"
          },
          {
            "type": "obstacle",
            "zIndex": 47,
            "x": 416,
            "y": 16,
            "rotation": 0,
            "w": 64,
            "h": 176,
            "label": "COLISÃO POLIGONAL",
            "id": "poly_obs_mvtmkoye_dfv",
            "polygon": [
              {
                "x": 416,
                "y": 192
              },
              {
                "x": 432,
                "y": 192
              },
              {
                "x": 448,
                "y": 176
              },
              {
                "x": 464,
                "y": 160
              },
              {
                "x": 464,
                "y": 144
              },
              {
                "x": 464,
                "y": 112
              },
              {
                "x": 480,
                "y": 96
              },
              {
                "x": 480,
                "y": 80
              },
              {
                "x": 480,
                "y": 48
              },
              {
                "x": 480,
                "y": 32
              },
              {
                "x": 480,
                "y": 16
              },
              {
                "x": 464,
                "y": 16
              }
            ],
            "collisionType": "solid"
          },
          {
            "type": "obstacle",
            "zIndex": 48,
            "x": 32,
            "y": 1312,
            "rotation": 0,
            "w": 64,
            "h": 64,
            "label": "COLISÃO POLIGONAL",
            "id": "poly_obs_mvtmlnqf_k4m",
            "polygon": [
              {
                "x": 48,
                "y": 1312
              },
              {
                "x": 48,
                "y": 1360
              },
              {
                "x": 32,
                "y": 1360
              },
              {
                "x": 32,
                "y": 1376
              },
              {
                "x": 48,
                "y": 1376
              },
              {
                "x": 64,
                "y": 1376
              },
              {
                "x": 80,
                "y": 1376
              },
              {
                "x": 96,
                "y": 1376
              },
              {
                "x": 80,
                "y": 1360
              },
              {
                "x": 80,
                "y": 1328
              },
              {
                "x": 80,
                "y": 1312
              }
            ],
            "collisionType": "solid"
          },
          {
            "type": "obstacle",
            "zIndex": 49,
            "x": 32,
            "y": 1968,
            "rotation": 0,
            "w": 64,
            "h": 64,
            "label": "COLISÃO POLIGONAL (Cópia)",
            "id": "poly_obs_mvtmlnqf_k4m_copy_tx3",
            "polygon": [
              {
                "x": 48,
                "y": 1968
              },
              {
                "x": 48,
                "y": 2016
              },
              {
                "x": 32,
                "y": 2016
              },
              {
                "x": 32,
                "y": 2032
              },
              {
                "x": 48,
                "y": 2032
              },
              {
                "x": 64,
                "y": 2032
              },
              {
                "x": 80,
                "y": 2032
              },
              {
                "x": 96,
                "y": 2032
              },
              {
                "x": 80,
                "y": 2016
              },
              {
                "x": 80,
                "y": 1984
              },
              {
                "x": 80,
                "y": 1968
              }
            ],
            "collisionType": "solid"
          },
          {
            "type": "obstacle",
            "zIndex": 50,
            "x": 0,
            "y": 1120,
            "rotation": 0,
            "w": 160,
            "h": 80,
            "label": "COLISÃO",
            "id": "map1_obs_nqsh_56"
          },
          {
            "type": "obstacle",
            "zIndex": 51,
            "x": 0,
            "y": 1200,
            "rotation": 0,
            "w": 112,
            "h": 832,
            "label": "COLISÃO",
            "id": "map1_obs_nvrl_57"
          },
          {
            "type": "obstacle",
            "zIndex": 52,
            "x": 1856,
            "y": 1632,
            "rotation": 0,
            "w": 48,
            "h": 400,
            "label": "COLISÃO",
            "id": "map1_obs_ovbn_58"
          },
          {
            "type": "obstacle",
            "zIndex": 53,
            "x": 800,
            "y": 816,
            "rotation": 0,
            "w": 160,
            "h": 48,
            "label": "COLISÃO",
            "id": "map1_obs_qw70_58"
          },
          {
            "type": "obstacle",
            "zIndex": 54,
            "x": 800,
            "y": 496,
            "rotation": 0,
            "w": 16,
            "h": 336,
            "label": "COLISÃO",
            "id": "map1_obs_qzs6_59"
          },
          {
            "type": "obstacle",
            "zIndex": 55,
            "x": 800,
            "y": 480,
            "rotation": 0,
            "w": 80,
            "h": 48,
            "label": "COLISÃO",
            "id": "map1_obs_r3e5_60"
          },
          {
            "type": "obstacle",
            "zIndex": 56,
            "x": 1120,
            "y": 480,
            "rotation": 0,
            "w": 48,
            "h": 48,
            "label": "COLISÃO",
            "id": "map1_obs_r6rh_61"
          },
          {
            "type": "obstacle",
            "zIndex": 57,
            "x": 1440,
            "y": 512,
            "rotation": 0,
            "w": 80,
            "h": 64,
            "label": "COLISÃO",
            "id": "map1_obs_rqxq_62"
          },
          {
            "type": "obstacle",
            "zIndex": 58,
            "x": 1024,
            "y": 160,
            "rotation": 0,
            "w": 16,
            "h": 80,
            "label": "COLISÃO",
            "id": "map1_obs_rzpi_63"
          },
          {
            "type": "obstacle",
            "zIndex": 59,
            "x": 480,
            "y": 0,
            "rotation": 0,
            "w": 592,
            "h": 112,
            "label": "COLISÃO",
            "id": "map1_obs_s8na_64"
          },
          {
            "type": "obstacle",
            "zIndex": 60,
            "x": 1376,
            "y": 16,
            "rotation": 0,
            "w": 656,
            "h": 112,
            "label": "COLISÃO",
            "id": "map1_obs_scpa_65"
          },
          {
            "type": "obstacle",
            "zIndex": 61,
            "x": 1952,
            "y": 160,
            "rotation": 0,
            "w": 64,
            "h": 416,
            "label": "COLISÃO",
            "id": "map1_obs_sf06_66"
          },
          {
            "type": "obstacle",
            "zIndex": 62,
            "x": 1440,
            "y": 288,
            "rotation": 0,
            "w": 16,
            "h": 112,
            "label": "COLISÃO",
            "id": "map1_obs_sitq_67"
          },
          {
            "type": "obstacle",
            "zIndex": 63,
            "x": 1376,
            "y": 176,
            "rotation": 0,
            "w": 48,
            "h": 48,
            "label": "COLISÃO",
            "id": "map1_obs_sn32_68"
          },
          {
            "type": "obstacle",
            "zIndex": 64,
            "x": 1488,
            "y": 576,
            "rotation": 0,
            "w": 32,
            "h": 48,
            "label": "COLISÃO",
            "id": "map1_obs_st4n_69"
          },
          {
            "type": "obstacle",
            "zIndex": 65,
            "x": 752,
            "y": 448,
            "rotation": 0,
            "w": 1184,
            "h": 944,
            "label": "Colisão água",
            "id": "poly_obs_mvtmuz3u_ibe",
            "polygon": [
              {
                "x": 752,
                "y": 1200
              },
              {
                "x": 816,
                "y": 1392
              },
              {
                "x": 960,
                "y": 1312
              },
              {
                "x": 1072,
                "y": 1184
              },
              {
                "x": 1216,
                "y": 1056
              },
              {
                "x": 1440,
                "y": 1056
              },
              {
                "x": 1488,
                "y": 1056
              },
              {
                "x": 1568,
                "y": 1104
              },
              {
                "x": 1680,
                "y": 1120
              },
              {
                "x": 1744,
                "y": 1088
              },
              {
                "x": 1776,
                "y": 1056
              },
              {
                "x": 1808,
                "y": 960
              },
              {
                "x": 1856,
                "y": 976
              },
              {
                "x": 1872,
                "y": 944
              },
              {
                "x": 1888,
                "y": 912
              },
              {
                "x": 1840,
                "y": 848
              },
              {
                "x": 1856,
                "y": 752
              },
              {
                "x": 1888,
                "y": 720
              },
              {
                "x": 1856,
                "y": 704
              },
              {
                "x": 1840,
                "y": 704
              },
              {
                "x": 1808,
                "y": 704
              },
              {
                "x": 1744,
                "y": 736
              },
              {
                "x": 1728,
                "y": 736
              },
              {
                "x": 1680,
                "y": 752
              },
              {
                "x": 1680,
                "y": 704
              },
              {
                "x": 1680,
                "y": 656
              },
              {
                "x": 1696,
                "y": 592
              },
              {
                "x": 1696,
                "y": 560
              },
              {
                "x": 1712,
                "y": 528
              },
              {
                "x": 1728,
                "y": 496
              },
              {
                "x": 1856,
                "y": 496
              },
              {
                "x": 1920,
                "y": 496
              },
              {
                "x": 1936,
                "y": 480
              },
              {
                "x": 1936,
                "y": 448
              },
              {
                "x": 1888,
                "y": 448
              },
              {
                "x": 1776,
                "y": 448
              },
              {
                "x": 1568,
                "y": 464
              },
              {
                "x": 1472,
                "y": 448
              },
              {
                "x": 1456,
                "y": 464
              },
              {
                "x": 1472,
                "y": 496
              },
              {
                "x": 1520,
                "y": 496
              },
              {
                "x": 1552,
                "y": 560
              },
              {
                "x": 1552,
                "y": 576
              },
              {
                "x": 1568,
                "y": 608
              },
              {
                "x": 1568,
                "y": 704
              },
              {
                "x": 1584,
                "y": 720
              },
              {
                "x": 1568,
                "y": 768
              },
              {
                "x": 1552,
                "y": 784
              },
              {
                "x": 1504,
                "y": 816
              },
              {
                "x": 1472,
                "y": 816
              },
              {
                "x": 1456,
                "y": 800
              },
              {
                "x": 1408,
                "y": 784
              },
              {
                "x": 1376,
                "y": 768
              },
              {
                "x": 1344,
                "y": 752
              },
              {
                "x": 1312,
                "y": 752
              },
              {
                "x": 1264,
                "y": 752
              },
              {
                "x": 1200,
                "y": 768
              },
              {
                "x": 1152,
                "y": 768
              },
              {
                "x": 1136,
                "y": 784
              },
              {
                "x": 1088,
                "y": 832
              },
              {
                "x": 1056,
                "y": 864
              },
              {
                "x": 992,
                "y": 912
              },
              {
                "x": 944,
                "y": 992
              },
              {
                "x": 944,
                "y": 1008
              },
              {
                "x": 896,
                "y": 1056
              },
              {
                "x": 848,
                "y": 1104
              },
              {
                "x": 784,
                "y": 1152
              }
            ],
            "collisionType": "solid"
          },
          {
            "type": "trash",
            "zIndex": 66,
            "x": 464,
            "y": 544,
            "rotation": 0,
            "id": "map1_trash_w1t6_67",
            "typeIndex": 0
          },
          {
            "type": "trash",
            "zIndex": 67,
            "x": 688,
            "y": 896,
            "rotation": 0,
            "id": "map1_trash_w3nm_68",
            "typeIndex": 0
          },
          {
            "type": "trash",
            "zIndex": 68,
            "x": 512,
            "y": 1072,
            "rotation": 0,
            "id": "map1_trash_wau3_69",
            "typeIndex": 0
          },
          {
            "type": "trash",
            "zIndex": 69,
            "x": 640,
            "y": 1120,
            "rotation": 0,
            "id": "map1_trash_wbf7_70",
            "typeIndex": 0
          },
          {
            "type": "trash",
            "zIndex": 70,
            "x": 656,
            "y": 672,
            "rotation": 0,
            "id": "map1_trash_wco4_71",
            "typeIndex": 0
          },
          {
            "type": "trash",
            "zIndex": 71,
            "x": 656,
            "y": 480,
            "rotation": 0,
            "id": "map1_trash_wsst_72",
            "typeIndex": 0
          },
          {
            "type": "obstacle",
            "zIndex": 72,
            "x": 880,
            "y": 304,
            "rotation": 0,
            "w": 16,
            "h": 48,
            "label": "COLISÃO",
            "id": "map1_obs_x9oj_73"
          },
          {
            "type": "obstacle",
            "zIndex": 73,
            "x": 816,
            "y": 272,
            "rotation": 0,
            "w": 16,
            "h": 96,
            "label": "COLISÃO",
            "id": "map1_obs_xkic_74"
          },
          {
            "type": "obstacle",
            "zIndex": 74,
            "x": 0,
            "y": 560,
            "rotation": 0,
            "w": 144,
            "h": 224,
            "label": "COLISÃO",
            "id": "map1_obs_z5xi_75"
          },
          {
            "type": "obstacle",
            "zIndex": 75,
            "x": 304,
            "y": 560,
            "rotation": 0,
            "w": 48,
            "h": 64,
            "label": "COLISÃO",
            "id": "map1_obs_z888_76"
          },
          {
            "type": "obstacle",
            "zIndex": 76,
            "x": 944,
            "y": 1968,
            "rotation": 0,
            "w": 144,
            "h": 80,
            "label": "TRIGGER",
            "id": "trigger_044f",
            "collisionType": "trigger",
            "isTrigger": true,
            "ai_instruction": "Abrir aviso escrito \"em breve...\""
          }
        ]
      },
      {
        "id": 3,
        "name": "Teto/Overlay",
        "itemsCount": 0,
        "items": []
      }
    ],
    "baseObstacles": [
      {
        "type": "obstacle",
        "zIndex": 0,
        "x": 0,
        "y": 2012,
        "rotation": 0,
        "w": 2048,
        "h": 36,
        "label": "LIMITE SUL"
      },
      {
        "type": "obstacle",
        "zIndex": 1,
        "x": 2012,
        "y": 0,
        "rotation": 0,
        "w": 36,
        "h": 2048,
        "label": "LIMITE LESTE"
      },
      {
        "type": "obstacle",
        "zIndex": 2,
        "x": 576,
        "y": 176,
        "rotation": 0,
        "w": 240,
        "h": 194,
        "label": "CASA 1 [NORTE CABANA]"
      },
      {
        "type": "obstacle",
        "zIndex": 3,
        "x": 1088,
        "y": 80,
        "rotation": 0,
        "w": 280,
        "h": 240,
        "label": "CASA 2 [NORTE 2 ANDARES]"
      },
      {
        "type": "obstacle",
        "zIndex": 4,
        "x": 240,
        "y": 720,
        "rotation": 0,
        "w": 216,
        "h": 168,
        "label": "CABANA OESTE"
      },
      {
        "type": "obstacle",
        "zIndex": 5,
        "x": 36,
        "y": 780,
        "rotation": 0,
        "w": 100,
        "h": 340,
        "label": "CASA OESTE EXTERNA"
      },
      {
        "type": "obstacle",
        "zIndex": 6,
        "x": 64,
        "y": 1488,
        "rotation": 0,
        "w": 246,
        "h": 300,
        "label": "CASA SUDOESTE 1"
      },
      {
        "type": "obstacle",
        "zIndex": 7,
        "x": 496,
        "y": 1744,
        "rotation": 0,
        "w": 276,
        "h": 240,
        "label": "CASA SUDOESTE 2"
      },
      {
        "type": "obstacle",
        "zIndex": 8,
        "x": 880,
        "y": 496,
        "rotation": 0,
        "w": 240,
        "h": 258,
        "label": "CASA CENTRO-NORTE"
      },
      {
        "type": "obstacle",
        "zIndex": 9,
        "x": 1184,
        "y": 496,
        "rotation": 0,
        "w": 240,
        "h": 186,
        "label": "CASA CENTRO"
      },
      {
        "type": "obstacle",
        "zIndex": 10,
        "x": 1152,
        "y": 1280,
        "rotation": 0,
        "w": 260,
        "h": 226,
        "label": "CASA CENTRAL GRANDE"
      },
      {
        "type": "obstacle",
        "zIndex": 11,
        "x": 1120,
        "y": 1792,
        "rotation": 0,
        "w": 272,
        "h": 186,
        "label": "CASA SUL"
      },
      {
        "type": "obstacle",
        "zIndex": 12,
        "x": 1920,
        "y": 1360,
        "rotation": 0,
        "w": 132,
        "h": 520,
        "label": "EDIFÍCIO SUDESTE"
      },
      {
        "type": "obstacle",
        "zIndex": 13,
        "x": 230,
        "y": 1060,
        "rotation": 0,
        "w": 92,
        "h": 130,
        "label": "CARRO PRATA"
      },
      {
        "type": "obstacle",
        "zIndex": 14,
        "x": 730,
        "y": 936,
        "rotation": 0,
        "w": 150,
        "h": 74,
        "label": "CARRO AZUL"
      },
      {
        "type": "obstacle",
        "zIndex": 15,
        "x": 1760,
        "y": 1296,
        "rotation": 0,
        "w": 108,
        "h": 144,
        "label": "PICAPE VERDE SUDESTE"
      },
      {
        "type": "obstacle",
        "zIndex": 16,
        "x": 0,
        "y": 340,
        "rotation": 0,
        "w": 140,
        "h": 220,
        "label": "ABISMO NOROESTE"
      },
      {
        "type": "obstacle",
        "zIndex": 35,
        "x": 16,
        "y": 48,
        "rotation": 0,
        "w": 400,
        "h": 304,
        "label": "COLISÃO POLIGONAL",
        "id": "poly_obs_mvtmfc2o_5bh",
        "polygon": [
          {
            "x": 320,
            "y": 320
          },
          {
            "x": 400,
            "y": 240
          },
          {
            "x": 384,
            "y": 144
          },
          {
            "x": 304,
            "y": 64
          },
          {
            "x": 128,
            "y": 64
          },
          {
            "x": 32,
            "y": 160
          },
          {
            "x": 32,
            "y": 256
          },
          {
            "x": 128,
            "y": 352
          },
          {
            "x": 112,
            "y": 352
          },
          {
            "x": 16,
            "y": 256
          },
          {
            "x": 16,
            "y": 144
          },
          {
            "x": 112,
            "y": 48
          },
          {
            "x": 304,
            "y": 48
          },
          {
            "x": 400,
            "y": 144
          },
          {
            "x": 416,
            "y": 256
          },
          {
            "x": 352,
            "y": 320
          }
        ],
        "collisionType": "solid"
      },
      {
        "type": "obstacle",
        "zIndex": 36,
        "x": 112,
        "y": 352,
        "rotation": 0,
        "w": 16,
        "h": 80,
        "label": "COLISÃO POLIGONAL",
        "id": "poly_obs_mvtmfpeo_9bp",
        "polygon": [
          {
            "x": 112,
            "y": 352
          },
          {
            "x": 112,
            "y": 432
          },
          {
            "x": 128,
            "y": 432
          },
          {
            "x": 128,
            "y": 352
          }
        ],
        "collisionType": "solid"
      },
      {
        "type": "obstacle",
        "zIndex": 37,
        "x": 320,
        "y": 320,
        "rotation": 0,
        "w": 32,
        "h": 64,
        "label": "COLISÃO POLIGONAL",
        "id": "poly_obs_mvtmfy9c_e1h",
        "polygon": [
          {
            "x": 320,
            "y": 320
          },
          {
            "x": 320,
            "y": 384
          },
          {
            "x": 352,
            "y": 384
          },
          {
            "x": 352,
            "y": 320
          }
        ],
        "collisionType": "solid"
      },
      {
        "type": "obstacle",
        "zIndex": 38,
        "x": 352,
        "y": 256,
        "rotation": 0,
        "w": 64,
        "h": 128,
        "label": "COLISÃO POLIGONAL",
        "id": "poly_obs_mvtmg59l_vnp",
        "polygon": [
          {
            "x": 352,
            "y": 384
          },
          {
            "x": 416,
            "y": 320
          },
          {
            "x": 416,
            "y": 256
          },
          {
            "x": 352,
            "y": 320
          }
        ],
        "collisionType": "solid"
      },
      {
        "type": "obstacle",
        "zIndex": 39,
        "x": 32,
        "y": 64,
        "rotation": 0,
        "w": 80,
        "h": 128,
        "label": "COLISÃO POLIGONAL",
        "id": "poly_obs_mvtmgho1_cno",
        "polygon": [
          {
            "x": 32,
            "y": 192
          },
          {
            "x": 32,
            "y": 160
          },
          {
            "x": 112,
            "y": 64
          },
          {
            "x": 112,
            "y": 96
          }
        ],
        "collisionType": "solid"
      },
      {
        "type": "obstacle",
        "zIndex": 40,
        "x": 112,
        "y": 64,
        "rotation": 0,
        "w": 192,
        "h": 32,
        "label": "COLISÃO POLIGONAL",
        "id": "poly_obs_mvtmgr9t_9n8",
        "polygon": [
          {
            "x": 128,
            "y": 96
          },
          {
            "x": 112,
            "y": 64
          },
          {
            "x": 304,
            "y": 64
          },
          {
            "x": 304,
            "y": 96
          }
        ],
        "collisionType": "solid"
      },
      {
        "type": "obstacle",
        "zIndex": 41,
        "x": 304,
        "y": 64,
        "rotation": 0,
        "w": 96,
        "h": 112,
        "label": "COLISÃO POLIGONAL",
        "id": "poly_obs_mvtmhw16_4up",
        "polygon": [
          {
            "x": 384,
            "y": 176
          },
          {
            "x": 304,
            "y": 96
          },
          {
            "x": 304,
            "y": 64
          },
          {
            "x": 400,
            "y": 160
          }
        ],
        "collisionType": "solid"
      },
      {
        "type": "obstacle",
        "zIndex": 42,
        "x": 160,
        "y": 96,
        "rotation": 0,
        "w": 96,
        "h": 48,
        "label": "COLISÃO",
        "id": "map1_obs_i57g_48"
      },
      {
        "type": "obstacle",
        "zIndex": 43,
        "x": 336,
        "y": 176,
        "rotation": 0,
        "w": 32,
        "h": 80,
        "label": "COLISÃO",
        "id": "map1_obs_i8lf_49"
      },
      {
        "type": "obstacle",
        "zIndex": 44,
        "x": 48,
        "y": 160,
        "rotation": 0,
        "w": 32,
        "h": 96,
        "label": "COLISÃO",
        "id": "map1_obs_ihgz_50"
      },
      {
        "type": "obstacle",
        "zIndex": 45,
        "x": 304,
        "y": 336,
        "rotation": 0,
        "w": 16,
        "h": 80,
        "label": "COLISÃO POLIGONAL",
        "id": "poly_obs_mvtmj85g_q2v",
        "polygon": [
          {
            "x": 304,
            "y": 336
          },
          {
            "x": 304,
            "y": 400
          },
          {
            "x": 304,
            "y": 400
          },
          {
            "x": 304,
            "y": 416
          },
          {
            "x": 320,
            "y": 416
          },
          {
            "x": 320,
            "y": 400
          },
          {
            "x": 320,
            "y": 384
          },
          {
            "x": 320,
            "y": 336
          }
        ],
        "collisionType": "solid"
      },
      {
        "type": "obstacle",
        "zIndex": 46,
        "x": 48,
        "y": 432,
        "rotation": 0,
        "w": 208,
        "h": 192,
        "label": "COLISÃO POLIGONAL",
        "id": "poly_obs_mvtmk33p_6gn",
        "polygon": [
          {
            "x": 128,
            "y": 432
          },
          {
            "x": 160,
            "y": 448
          },
          {
            "x": 192,
            "y": 464
          },
          {
            "x": 192,
            "y": 480
          },
          {
            "x": 208,
            "y": 480
          },
          {
            "x": 208,
            "y": 496
          },
          {
            "x": 224,
            "y": 496
          },
          {
            "x": 240,
            "y": 512
          },
          {
            "x": 240,
            "y": 528
          },
          {
            "x": 240,
            "y": 544
          },
          {
            "x": 256,
            "y": 560
          },
          {
            "x": 240,
            "y": 576
          },
          {
            "x": 240,
            "y": 592
          },
          {
            "x": 224,
            "y": 608
          },
          {
            "x": 208,
            "y": 608
          },
          {
            "x": 192,
            "y": 608
          },
          {
            "x": 160,
            "y": 624
          },
          {
            "x": 144,
            "y": 624
          },
          {
            "x": 128,
            "y": 624
          },
          {
            "x": 128,
            "y": 608
          },
          {
            "x": 96,
            "y": 592
          },
          {
            "x": 64,
            "y": 592
          },
          {
            "x": 64,
            "y": 576
          },
          {
            "x": 48,
            "y": 560
          }
        ],
        "collisionType": "solid"
      },
      {
        "type": "obstacle",
        "zIndex": 47,
        "x": 416,
        "y": 16,
        "rotation": 0,
        "w": 64,
        "h": 176,
        "label": "COLISÃO POLIGONAL",
        "id": "poly_obs_mvtmkoye_dfv",
        "polygon": [
          {
            "x": 416,
            "y": 192
          },
          {
            "x": 432,
            "y": 192
          },
          {
            "x": 448,
            "y": 176
          },
          {
            "x": 464,
            "y": 160
          },
          {
            "x": 464,
            "y": 144
          },
          {
            "x": 464,
            "y": 112
          },
          {
            "x": 480,
            "y": 96
          },
          {
            "x": 480,
            "y": 80
          },
          {
            "x": 480,
            "y": 48
          },
          {
            "x": 480,
            "y": 32
          },
          {
            "x": 480,
            "y": 16
          },
          {
            "x": 464,
            "y": 16
          }
        ],
        "collisionType": "solid"
      },
      {
        "type": "obstacle",
        "zIndex": 48,
        "x": 32,
        "y": 1312,
        "rotation": 0,
        "w": 64,
        "h": 64,
        "label": "COLISÃO POLIGONAL",
        "id": "poly_obs_mvtmlnqf_k4m",
        "polygon": [
          {
            "x": 48,
            "y": 1312
          },
          {
            "x": 48,
            "y": 1360
          },
          {
            "x": 32,
            "y": 1360
          },
          {
            "x": 32,
            "y": 1376
          },
          {
            "x": 48,
            "y": 1376
          },
          {
            "x": 64,
            "y": 1376
          },
          {
            "x": 80,
            "y": 1376
          },
          {
            "x": 96,
            "y": 1376
          },
          {
            "x": 80,
            "y": 1360
          },
          {
            "x": 80,
            "y": 1328
          },
          {
            "x": 80,
            "y": 1312
          }
        ],
        "collisionType": "solid"
      },
      {
        "type": "obstacle",
        "zIndex": 49,
        "x": 32,
        "y": 1968,
        "rotation": 0,
        "w": 64,
        "h": 64,
        "label": "COLISÃO POLIGONAL (Cópia)",
        "id": "poly_obs_mvtmlnqf_k4m_copy_tx3",
        "polygon": [
          {
            "x": 48,
            "y": 1968
          },
          {
            "x": 48,
            "y": 2016
          },
          {
            "x": 32,
            "y": 2016
          },
          {
            "x": 32,
            "y": 2032
          },
          {
            "x": 48,
            "y": 2032
          },
          {
            "x": 64,
            "y": 2032
          },
          {
            "x": 80,
            "y": 2032
          },
          {
            "x": 96,
            "y": 2032
          },
          {
            "x": 80,
            "y": 2016
          },
          {
            "x": 80,
            "y": 1984
          },
          {
            "x": 80,
            "y": 1968
          }
        ],
        "collisionType": "solid"
      },
      {
        "type": "obstacle",
        "zIndex": 50,
        "x": 0,
        "y": 1120,
        "rotation": 0,
        "w": 160,
        "h": 80,
        "label": "COLISÃO",
        "id": "map1_obs_nqsh_56"
      },
      {
        "type": "obstacle",
        "zIndex": 51,
        "x": 0,
        "y": 1200,
        "rotation": 0,
        "w": 112,
        "h": 832,
        "label": "COLISÃO",
        "id": "map1_obs_nvrl_57"
      },
      {
        "type": "obstacle",
        "zIndex": 52,
        "x": 1856,
        "y": 1632,
        "rotation": 0,
        "w": 48,
        "h": 400,
        "label": "COLISÃO",
        "id": "map1_obs_ovbn_58"
      },
      {
        "type": "obstacle",
        "zIndex": 53,
        "x": 800,
        "y": 816,
        "rotation": 0,
        "w": 160,
        "h": 48,
        "label": "COLISÃO",
        "id": "map1_obs_qw70_58"
      },
      {
        "type": "obstacle",
        "zIndex": 54,
        "x": 800,
        "y": 496,
        "rotation": 0,
        "w": 16,
        "h": 336,
        "label": "COLISÃO",
        "id": "map1_obs_qzs6_59"
      },
      {
        "type": "obstacle",
        "zIndex": 55,
        "x": 800,
        "y": 480,
        "rotation": 0,
        "w": 80,
        "h": 48,
        "label": "COLISÃO",
        "id": "map1_obs_r3e5_60"
      },
      {
        "type": "obstacle",
        "zIndex": 56,
        "x": 1120,
        "y": 480,
        "rotation": 0,
        "w": 48,
        "h": 48,
        "label": "COLISÃO",
        "id": "map1_obs_r6rh_61"
      },
      {
        "type": "obstacle",
        "zIndex": 57,
        "x": 1440,
        "y": 512,
        "rotation": 0,
        "w": 80,
        "h": 64,
        "label": "COLISÃO",
        "id": "map1_obs_rqxq_62"
      },
      {
        "type": "obstacle",
        "zIndex": 58,
        "x": 1024,
        "y": 160,
        "rotation": 0,
        "w": 16,
        "h": 80,
        "label": "COLISÃO",
        "id": "map1_obs_rzpi_63"
      },
      {
        "type": "obstacle",
        "zIndex": 59,
        "x": 480,
        "y": 0,
        "rotation": 0,
        "w": 592,
        "h": 112,
        "label": "COLISÃO",
        "id": "map1_obs_s8na_64"
      },
      {
        "type": "obstacle",
        "zIndex": 60,
        "x": 1376,
        "y": 16,
        "rotation": 0,
        "w": 656,
        "h": 112,
        "label": "COLISÃO",
        "id": "map1_obs_scpa_65"
      },
      {
        "type": "obstacle",
        "zIndex": 61,
        "x": 1952,
        "y": 160,
        "rotation": 0,
        "w": 64,
        "h": 416,
        "label": "COLISÃO",
        "id": "map1_obs_sf06_66"
      },
      {
        "type": "obstacle",
        "zIndex": 62,
        "x": 1440,
        "y": 288,
        "rotation": 0,
        "w": 16,
        "h": 112,
        "label": "COLISÃO",
        "id": "map1_obs_sitq_67"
      },
      {
        "type": "obstacle",
        "zIndex": 63,
        "x": 1376,
        "y": 176,
        "rotation": 0,
        "w": 48,
        "h": 48,
        "label": "COLISÃO",
        "id": "map1_obs_sn32_68"
      },
      {
        "type": "obstacle",
        "zIndex": 64,
        "x": 1488,
        "y": 576,
        "rotation": 0,
        "w": 32,
        "h": 48,
        "label": "COLISÃO",
        "id": "map1_obs_st4n_69"
      },
      {
        "type": "obstacle",
        "zIndex": 72,
        "x": 880,
        "y": 304,
        "rotation": 0,
        "w": 16,
        "h": 48,
        "label": "COLISÃO",
        "id": "map1_obs_x9oj_73"
      },
      {
        "type": "obstacle",
        "zIndex": 73,
        "x": 816,
        "y": 272,
        "rotation": 0,
        "w": 16,
        "h": 96,
        "label": "COLISÃO",
        "id": "map1_obs_xkic_74"
      },
      {
        "type": "obstacle",
        "zIndex": 74,
        "x": 0,
        "y": 560,
        "rotation": 0,
        "w": 144,
        "h": 224,
        "label": "COLISÃO",
        "id": "map1_obs_z5xi_75"
      },
      {
        "type": "obstacle",
        "zIndex": 75,
        "x": 304,
        "y": 560,
        "rotation": 0,
        "w": 48,
        "h": 64,
        "label": "COLISÃO",
        "id": "map1_obs_z888_76"
      }
    ],
    "waterObstacles": [
      {
        "type": "obstacle",
        "zIndex": 17,
        "x": 1690,
        "y": 680,
        "rotation": 0,
        "w": 270,
        "h": 240,
        "label": "LAGO LESTE [NORTE]"
      },
      {
        "type": "obstacle",
        "zIndex": 18,
        "x": 1740,
        "y": 920,
        "rotation": 0,
        "w": 220,
        "h": 210,
        "label": "LAGO LESTE [SUL]"
      },
      {
        "type": "obstacle",
        "zIndex": 65,
        "x": 752,
        "y": 448,
        "rotation": 0,
        "w": 1184,
        "h": 944,
        "label": "Colisão água",
        "id": "poly_obs_mvtmuz3u_ibe",
        "polygon": [
          {
            "x": 752,
            "y": 1200
          },
          {
            "x": 816,
            "y": 1392
          },
          {
            "x": 960,
            "y": 1312
          },
          {
            "x": 1072,
            "y": 1184
          },
          {
            "x": 1216,
            "y": 1056
          },
          {
            "x": 1440,
            "y": 1056
          },
          {
            "x": 1488,
            "y": 1056
          },
          {
            "x": 1568,
            "y": 1104
          },
          {
            "x": 1680,
            "y": 1120
          },
          {
            "x": 1744,
            "y": 1088
          },
          {
            "x": 1776,
            "y": 1056
          },
          {
            "x": 1808,
            "y": 960
          },
          {
            "x": 1856,
            "y": 976
          },
          {
            "x": 1872,
            "y": 944
          },
          {
            "x": 1888,
            "y": 912
          },
          {
            "x": 1840,
            "y": 848
          },
          {
            "x": 1856,
            "y": 752
          },
          {
            "x": 1888,
            "y": 720
          },
          {
            "x": 1856,
            "y": 704
          },
          {
            "x": 1840,
            "y": 704
          },
          {
            "x": 1808,
            "y": 704
          },
          {
            "x": 1744,
            "y": 736
          },
          {
            "x": 1728,
            "y": 736
          },
          {
            "x": 1680,
            "y": 752
          },
          {
            "x": 1680,
            "y": 704
          },
          {
            "x": 1680,
            "y": 656
          },
          {
            "x": 1696,
            "y": 592
          },
          {
            "x": 1696,
            "y": 560
          },
          {
            "x": 1712,
            "y": 528
          },
          {
            "x": 1728,
            "y": 496
          },
          {
            "x": 1856,
            "y": 496
          },
          {
            "x": 1920,
            "y": 496
          },
          {
            "x": 1936,
            "y": 480
          },
          {
            "x": 1936,
            "y": 448
          },
          {
            "x": 1888,
            "y": 448
          },
          {
            "x": 1776,
            "y": 448
          },
          {
            "x": 1568,
            "y": 464
          },
          {
            "x": 1472,
            "y": 448
          },
          {
            "x": 1456,
            "y": 464
          },
          {
            "x": 1472,
            "y": 496
          },
          {
            "x": 1520,
            "y": 496
          },
          {
            "x": 1552,
            "y": 560
          },
          {
            "x": 1552,
            "y": 576
          },
          {
            "x": 1568,
            "y": 608
          },
          {
            "x": 1568,
            "y": 704
          },
          {
            "x": 1584,
            "y": 720
          },
          {
            "x": 1568,
            "y": 768
          },
          {
            "x": 1552,
            "y": 784
          },
          {
            "x": 1504,
            "y": 816
          },
          {
            "x": 1472,
            "y": 816
          },
          {
            "x": 1456,
            "y": 800
          },
          {
            "x": 1408,
            "y": 784
          },
          {
            "x": 1376,
            "y": 768
          },
          {
            "x": 1344,
            "y": 752
          },
          {
            "x": 1312,
            "y": 752
          },
          {
            "x": 1264,
            "y": 752
          },
          {
            "x": 1200,
            "y": 768
          },
          {
            "x": 1152,
            "y": 768
          },
          {
            "x": 1136,
            "y": 784
          },
          {
            "x": 1088,
            "y": 832
          },
          {
            "x": 1056,
            "y": 864
          },
          {
            "x": 992,
            "y": 912
          },
          {
            "x": 944,
            "y": 992
          },
          {
            "x": 944,
            "y": 1008
          },
          {
            "x": 896,
            "y": 1056
          },
          {
            "x": 848,
            "y": 1104
          },
          {
            "x": 784,
            "y": 1152
          }
        ],
        "collisionType": "solid"
      }
    ],
    "obstacles": [],
    "collisionBounds": []
  },

  van: {
    id: 'van',
    name: 'SAFE ROOM: A VAN DE OPERAÇÕES (LABORATÓRIO TÁTICO)',
    subtitle: 'Base Móvel • Consulte o Mural de Pesquisas, equipe-se na Máquina de Suprimentos ou avance pela Porta',
    imageAsset: 'assets/van_interior.jpg',
    width: 1536,
    height: 857,
    isSafeRoom: true,
    palette: {
      bg: '#0c0f17',
      wallFill: '#1a1f2c',
      wallStroke: '#38bdf8',
      pathFill: 'rgba(56, 189, 248, 0.08)',
      pathStroke: 'rgba(56, 189, 248, 0.25)'
    },
    spawnP1: { x: 200, y: 560 },
    spawnP2: { x: 200, y: 620 },
    trashSpawns: [],
    enemySpawns: [],
    floorZones: [
      { x: 140, y: 440, w: 1250, h: 260, label: 'PÁTIO TÁTICO DA VAN' }
    ],
    // Zonas de Interação da Van (Mural de Pesquisas e Dispensador de Armas)
        // Zonas de Interação da Van (Mural de Pesquisas e Dispensador de Armas)
        // Zonas de Interação da Van (Mural de Pesquisas e Dispensador de Armas)
    interactiveStations: [
          {
                "id": "notice_board",
                "name": "Mural de Avisos & Pesquisas",
                "icon": "📋",
                "x": 224,
                "y": 224,
                "w": 416,
                "h": 288,
                "zoneLabel": "MURAL DE PESQUISAS",
                "promptText": "Pressione [E] para Abrir o Mural",
                "strokeColor": "#38bdf8",
                "fillColor": "transparent",
                "hideFloorZone": true
          },
          {
                "id": "shop",
                "name": "Dispensador de Armas (Loja)",
                "icon": "⚔️",
                "x": 704,
                "y": 368,
                "w": 240,
                "h": 112,
                "zoneLabel": "DISPENSADOR DE ARMAS (LOJA)",
                "promptText": "Pressione [E] para Abrir a Loja de Armas",
                "strokeColor": "#facc15",
                "fillColor": "transparent",
                "hideFloorZone": true
          }
    ],
    transitionZone: {
          "id": "trigger_jfqd",
          "x": 1328,
          "y": 432,
          "w": 96,
          "h": 144,
          "label": "PORTA DA VAN → SEGUIR VIAGEM",
          "subLabel": "Toque para avançar",
          "strokeColor": "#38bdf8",
          "fillColor": "transparent",
          "hideBox": true
    },
    overheadZones: [
          {
                "id": "poly_obs_mvtkxp7w_t9j",
                "x": 336,
                "y": 592,
                "w": 96,
                "h": 64,
                "polygon": [
                      {
                            "x": 336,
                            "y": 608
                      },
                      {
                            "x": 336,
                            "y": 624
                      },
                      {
                            "x": 336,
                            "y": 656
                      },
                      {
                            "x": 352,
                            "y": 656
                      },
                      {
                            "x": 416,
                            "y": 640
                      },
                      {
                            "x": 432,
                            "y": 624
                      },
                      {
                            "x": 432,
                            "y": 608
                      },
                      {
                            "x": 416,
                            "y": 608
                      },
                      {
                            "x": 400,
                            "y": 608
                      },
                      {
                            "x": 384,
                            "y": 608
                      },
                      {
                            "x": 384,
                            "y": 592
                      },
                      {
                            "x": 368,
                            "y": 592
                      },
                      {
                            "x": 352,
                            "y": 592
                      },
                      {
                            "x": 352,
                            "y": 608
                      },
                      {
                            "x": 352,
                            "y": 608
                      }
                ],
                "label": "POLÍGONO POR CIMA"
          },
          {
                "id": "poly_obs_mvtkzgp2_725",
                "x": 672,
                "y": 592,
                "w": 64,
                "h": 32,
                "polygon": [
                      {
                            "x": 672,
                            "y": 624
                      },
                      {
                            "x": 688,
                            "y": 608
                      },
                      {
                            "x": 672,
                            "y": 592
                      },
                      {
                            "x": 688,
                            "y": 592
                      },
                      {
                            "x": 704,
                            "y": 608
                      },
                      {
                            "x": 704,
                            "y": 592
                      },
                      {
                            "x": 720,
                            "y": 592
                      },
                      {
                            "x": 720,
                            "y": 608
                      },
                      {
                            "x": 736,
                            "y": 608
                      },
                      {
                            "x": 736,
                            "y": 608
                      },
                      {
                            "x": 720,
                            "y": 624
                      }
                ],
                "label": "POLÍGONO POR CIMA"
          },
          {
                "id": "poly_obs_mvtkzzzq_23c",
                "x": 784,
                "y": 560,
                "w": 64,
                "h": 64,
                "polygon": [
                      {
                            "x": 784,
                            "y": 624
                      },
                      {
                            "x": 800,
                            "y": 592
                      },
                      {
                            "x": 784,
                            "y": 576
                      },
                      {
                            "x": 800,
                            "y": 560
                      },
                      {
                            "x": 816,
                            "y": 592
                      },
                      {
                            "x": 832,
                            "y": 592
                      },
                      {
                            "x": 832,
                            "y": 608
                      },
                      {
                            "x": 848,
                            "y": 624
                      }
                ],
                "label": "POLÍGONO POR CIMA"
          },
          {
                "id": "poly_obs_mvtl076n_wxi",
                "x": 896,
                "y": 592,
                "w": 32,
                "h": 32,
                "polygon": [
                      {
                            "x": 896,
                            "y": 624
                      },
                      {
                            "x": 896,
                            "y": 624
                      },
                      {
                            "x": 896,
                            "y": 608
                      },
                      {
                            "x": 912,
                            "y": 608
                      },
                      {
                            "x": 912,
                            "y": 592
                      },
                      {
                            "x": 912,
                            "y": 592
                      },
                      {
                            "x": 912,
                            "y": 608
                      },
                      {
                            "x": 928,
                            "y": 624
                      },
                      {
                            "x": 912,
                            "y": 624
                      }
                ],
                "label": "POLÍGONO POR CIMA"
          },
          {
                "id": "poly_obs_mvtl0omn_btc",
                "x": 960,
                "y": 608,
                "w": 16,
                "h": 16,
                "polygon": [
                      {
                            "x": 960,
                            "y": 624
                      },
                      {
                            "x": 960,
                            "y": 608
                      },
                      {
                            "x": 976,
                            "y": 608
                      },
                      {
                            "x": 976,
                            "y": 608
                      },
                      {
                            "x": 976,
                            "y": 624
                      }
                ],
                "label": "POLÍGONO POR CIMA"
          },
          {
                "id": "poly_obs_mvtl1rls_n4d",
                "x": 992,
                "y": 576,
                "w": 128,
                "h": 48,
                "polygon": [
                      {
                            "x": 992,
                            "y": 624
                      },
                      {
                            "x": 992,
                            "y": 592
                      },
                      {
                            "x": 1008,
                            "y": 576
                      },
                      {
                            "x": 1024,
                            "y": 592
                      },
                      {
                            "x": 1088,
                            "y": 576
                      },
                      {
                            "x": 1120,
                            "y": 608
                      },
                      {
                            "x": 1120,
                            "y": 624
                      }
                ],
                "label": "POLÍGONO POR CIMA"
          }
    ],
    triggerZones: [
          {
                "id": "trigger_2yqx",
                "x": 704,
                "y": 368,
                "w": 240,
                "h": 112,
                "label": "TRIGGER",
                "ai_instruction": "Tire essa zona amarela, espere a personagem estar próximo a essa área para abrir o menu de loja mantenha o icone flutuante de \"pressione E para tal coisa\""
          },
          {
                "id": "trigger_6ta6",
                "x": 224,
                "y": 224,
                "w": 416,
                "h": 288,
                "label": "TRIGGER",
                "ai_instruction": "tire essa zona azul, quando a personagem chegar na zona de trigger deve aparecer \"pressione E para abrir o mural\""
          },
          {
                "id": "trigger_jfqd",
                "x": 1328,
                "y": 432,
                "w": 96,
                "h": 144,
                "label": "TRIGGER",
                "ai_instruction": "na primeira fase, se você tocar aqui, automáticamente você é teleportado para a primeira fase, na segunda para frente aparece aquela função de reiniciar ou ir para a próxima fase e tire esse quadrado de passar de fase de uma fase para outra faça um efeitinho só para não ficar hiper seco"
          }
    ],
    animationMarkers: [
          {
                "id": "anim_9gqp",
                "x": 464,
                "y": 160,
                "label": "ANIM_766",
                "ai_instruction": "deixe um ponto de exclamação flutuando aqui"
          }
    ],
    layers: [
          {
                "id": 0,
                "name": "Chão",
                "visible": true,
                "itemsCount": 0,
                "items": []
          },
          {
                "id": 1,
                "name": "Tapetes/Decalques",
                "visible": true,
                "itemsCount": 0,
                "items": []
          },
          {
                "id": 2,
                "name": "Objetos/Colisão",
                "visible": true,
                "itemsCount": 48,
                "items": [
                      {
                            "type": "obstacle",
                            "zIndex": 0,
                            "x": 190,
                            "y": 0,
                            "rotation": 0,
                            "w": 1150,
                            "h": 105,
                            "label": "TETO / PAREDE SUPERIOR"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 1,
                            "x": 0,
                            "y": 0,
                            "rotation": 0,
                            "w": 190,
                            "h": 220,
                            "label": "CANTO SUPERIOR ESQUERDO"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 2,
                            "x": 1344,
                            "y": 0,
                            "rotation": 0,
                            "w": 196,
                            "h": 180,
                            "label": "CANTO SUPERIOR DIREITO"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 3,
                            "x": 0,
                            "y": 220,
                            "rotation": 0,
                            "w": 64,
                            "h": 100,
                            "label": "BATENTE PORTA ESQUERDA (ALTO)"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 4,
                            "x": 0,
                            "y": 0,
                            "rotation": 0,
                            "w": 40,
                            "h": 857,
                            "label": "LIMITE EXTERNO DA RAMPA"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 5,
                            "x": 0,
                            "y": 656,
                            "rotation": 0,
                            "w": 140,
                            "h": 201,
                            "label": "CANTO INFERIOR ESQUERDO"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 6,
                            "x": 1480,
                            "y": 180,
                            "rotation": 0,
                            "w": 56,
                            "h": 80,
                            "label": "BATENTE PORTA DIREITA (ALTO)"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 7,
                            "x": 1480,
                            "y": 0,
                            "rotation": 0,
                            "w": 56,
                            "h": 857,
                            "label": "LIMITE EXTERNO DA SAÍDA"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 8,
                            "x": 1380,
                            "y": 690,
                            "rotation": 0,
                            "w": 156,
                            "h": 167,
                            "label": "CANTO INFERIOR DIREITO"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 9,
                            "x": 140,
                            "y": 810,
                            "rotation": 0,
                            "w": 1240,
                            "h": 47,
                            "label": "PAREDE INFERIOR DA VAN"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 10,
                            "x": 190,
                            "y": 105,
                            "rotation": 0,
                            "w": 495,
                            "h": 280,
                            "label": "PAREDE TRASEIRA & MURAL DE AVISOS"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 11,
                            "x": 940,
                            "y": 105,
                            "rotation": 0,
                            "w": 400,
                            "h": 247,
                            "label": "PAREDE TRASEIRA & PAINEL DE CONTROLE"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 12,
                            "x": 224,
                            "y": 288,
                            "rotation": 0,
                            "w": 115,
                            "h": 150,
                            "label": "CAIXOTE & ENCOMENDA (NOROESTE)"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 13,
                            "x": 352,
                            "y": 304,
                            "rotation": 0,
                            "w": 75,
                            "h": 127,
                            "label": "PLANTA DA BASE (NOROESTE)"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 14,
                            "x": 416,
                            "y": 288,
                            "rotation": 0,
                            "w": 115,
                            "h": 192,
                            "label": "CADEIRA GIRATÓRIA DA ESTAÇÃO"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 15,
                            "x": 592,
                            "y": 272,
                            "rotation": 0,
                            "w": 98,
                            "h": 150,
                            "label": "VASO DE PLANTA TÁTICO"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 16,
                            "x": 704,
                            "y": 96,
                            "rotation": 0,
                            "w": 240,
                            "h": 343,
                            "label": "DISPENSADOR AUTOMÁTICO (LOJA DE ARMAS)"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 17,
                            "x": 1024,
                            "y": 352,
                            "rotation": 0,
                            "w": 96,
                            "h": 64,
                            "label": "MESA DO COMPUTADOR CRT"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 18,
                            "x": 1120,
                            "y": 272,
                            "rotation": 0,
                            "w": 115,
                            "h": 155,
                            "label": "BAÚS DE CARGA & GERADOR"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 19,
                            "x": 112,
                            "y": 656,
                            "rotation": 0,
                            "w": 240,
                            "h": 160,
                            "label": "VASO & CAIXOTE INFERIOR"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 20,
                            "x": 330,
                            "y": 624,
                            "rotation": 0,
                            "w": 395,
                            "h": 196,
                            "label": "BANCADA MECÂNICA & PROJETOS"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 21,
                            "x": 725,
                            "y": 624,
                            "rotation": 0,
                            "w": 411,
                            "h": 196,
                            "label": "LABORATÓRIO QUÍMICO & TUBOS DE ENSAIO"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 22,
                            "x": 1136,
                            "y": 688,
                            "rotation": 0,
                            "w": 240,
                            "h": 137,
                            "label": "MALETA DE CAMPO & BATERIA"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 23,
                            "x": 528,
                            "y": 320,
                            "rotation": 0,
                            "w": 48,
                            "h": 80,
                            "label": "COLISÃO",
                            "id": "van_obs_rxkk_24"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 24,
                            "x": 1232,
                            "y": 352,
                            "rotation": 0,
                            "w": 96,
                            "h": 64,
                            "label": "MESA DO COMPUTADOR CRT (Cópia)",
                            "id": "item_copy_71a"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 25,
                            "x": 48,
                            "y": 368,
                            "rotation": 0,
                            "w": 32,
                            "h": 288,
                            "label": "COLISÃO",
                            "id": "van_obs_x47d_31"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 26,
                            "x": 80,
                            "y": 624,
                            "rotation": 0,
                            "w": 16,
                            "h": 48,
                            "label": "COLISÃO",
                            "id": "van_obs_x7q1_32"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 27,
                            "x": 1408,
                            "y": 176,
                            "rotation": 0,
                            "w": 112,
                            "h": 96,
                            "label": "COLISÃO",
                            "id": "van_obs_znfo_34"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 28,
                            "x": 1360,
                            "y": 176,
                            "rotation": 0,
                            "w": 64,
                            "h": 32,
                            "label": "COLISÃO",
                            "id": "van_obs_zsvo_35"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 29,
                            "x": 1376,
                            "y": 192,
                            "rotation": 0,
                            "w": 48,
                            "h": 32,
                            "label": "COLISÃO",
                            "id": "van_obs_zwr1_36"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 30,
                            "x": 1392,
                            "y": 208,
                            "rotation": 0,
                            "w": 32,
                            "h": 48,
                            "label": "COLISÃO",
                            "id": "van_obs_07sd_37"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 31,
                            "x": 1408,
                            "y": 272,
                            "rotation": 0,
                            "w": 80,
                            "h": 432,
                            "label": "COLISÃO",
                            "id": "van_obs_0ij1_38"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 32,
                            "x": 48,
                            "y": 224,
                            "rotation": 0,
                            "w": 128,
                            "h": 160,
                            "label": "COLISÃO POLIGONAL",
                            "id": "poly_obs_mvtkswlj_bre",
                            "polygon": [
                                  {
                                        "x": 176,
                                        "y": 224
                                  },
                                  {
                                        "x": 80,
                                        "y": 384
                                  },
                                  {
                                        "x": 48,
                                        "y": 368
                                  },
                                  {
                                        "x": 128,
                                        "y": 224
                                  }
                            ],
                            "collisionType": "solid"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 33,
                            "x": 144,
                            "y": 176,
                            "rotation": 0,
                            "w": 48,
                            "h": 368,
                            "label": "COLISÃO POLIGONAL",
                            "id": "poly_obs_mvtkt8fq_e18",
                            "polygon": [
                                  {
                                        "x": 144,
                                        "y": 288
                                  },
                                  {
                                        "x": 144,
                                        "y": 544
                                  },
                                  {
                                        "x": 192,
                                        "y": 448
                                  },
                                  {
                                        "x": 192,
                                        "y": 176
                                  }
                            ],
                            "collisionType": "solid"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 34,
                            "x": 192,
                            "y": 384,
                            "rotation": 0,
                            "w": 32,
                            "h": 80,
                            "label": "COLISÃO POLIGONAL",
                            "id": "poly_obs_mvtktg0n_vb3",
                            "polygon": [
                                  {
                                        "x": 192,
                                        "y": 384
                                  },
                                  {
                                        "x": 192,
                                        "y": 464
                                  },
                                  {
                                        "x": 224,
                                        "y": 384
                                  },
                                  {
                                        "x": 224,
                                        "y": 384
                                  }
                            ],
                            "collisionType": "solid"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 35,
                            "x": 80,
                            "y": 288,
                            "rotation": 0,
                            "w": 64,
                            "h": 208,
                            "label": "COLISÃO POLIGONAL",
                            "id": "poly_obs_mvtktvfk_fj9",
                            "polygon": [
                                  {
                                        "x": 128,
                                        "y": 480
                                  },
                                  {
                                        "x": 128,
                                        "y": 480
                                  },
                                  {
                                        "x": 112,
                                        "y": 496
                                  },
                                  {
                                        "x": 80,
                                        "y": 496
                                  },
                                  {
                                        "x": 80,
                                        "y": 384
                                  },
                                  {
                                        "x": 144,
                                        "y": 288
                                  }
                            ],
                            "collisionType": "solid"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 36,
                            "x": 128,
                            "y": 336,
                            "rotation": 0,
                            "w": 16,
                            "h": 144,
                            "label": "COLISÃO POLIGONAL",
                            "id": "poly_obs_mvtku3iv_kpy",
                            "polygon": [
                                  {
                                        "x": 128,
                                        "y": 480
                                  },
                                  {
                                        "x": 128,
                                        "y": 480
                                  },
                                  {
                                        "x": 144,
                                        "y": 464
                                  },
                                  {
                                        "x": 144,
                                        "y": 336
                                  }
                            ],
                            "collisionType": "solid"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 37,
                            "x": 1344,
                            "y": 176,
                            "rotation": 0,
                            "w": 64,
                            "h": 288,
                            "label": "COLISÃO POLIGONAL",
                            "id": "poly_obs_mvtkumiw_77j",
                            "polygon": [
                                  {
                                        "x": 1344,
                                        "y": 176
                                  },
                                  {
                                        "x": 1344,
                                        "y": 464
                                  },
                                  {
                                        "x": 1360,
                                        "y": 464
                                  },
                                  {
                                        "x": 1408,
                                        "y": 432
                                  },
                                  {
                                        "x": 1408,
                                        "y": 288
                                  }
                            ],
                            "collisionType": "solid"
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 38,
                            "x": 336,
                            "y": 592,
                            "rotation": 0,
                            "w": 96,
                            "h": 64,
                            "label": "POLÍGONO POR CIMA",
                            "id": "poly_obs_mvtkxp7w_t9j",
                            "polygon": [
                                  {
                                        "x": 336,
                                        "y": 608
                                  },
                                  {
                                        "x": 336,
                                        "y": 624
                                  },
                                  {
                                        "x": 336,
                                        "y": 656
                                  },
                                  {
                                        "x": 352,
                                        "y": 656
                                  },
                                  {
                                        "x": 416,
                                        "y": 640
                                  },
                                  {
                                        "x": 432,
                                        "y": 624
                                  },
                                  {
                                        "x": 432,
                                        "y": 608
                                  },
                                  {
                                        "x": 416,
                                        "y": 608
                                  },
                                  {
                                        "x": 400,
                                        "y": 608
                                  },
                                  {
                                        "x": 384,
                                        "y": 608
                                  },
                                  {
                                        "x": 384,
                                        "y": 592
                                  },
                                  {
                                        "x": 368,
                                        "y": 592
                                  },
                                  {
                                        "x": 352,
                                        "y": 592
                                  },
                                  {
                                        "x": 352,
                                        "y": 608
                                  },
                                  {
                                        "x": 352,
                                        "y": 608
                                  }
                            ],
                            "collisionType": "overhead",
                            "isOverhead": true
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 39,
                            "x": 672,
                            "y": 592,
                            "rotation": 0,
                            "w": 64,
                            "h": 32,
                            "label": "POLÍGONO POR CIMA",
                            "id": "poly_obs_mvtkzgp2_725",
                            "polygon": [
                                  {
                                        "x": 672,
                                        "y": 624
                                  },
                                  {
                                        "x": 688,
                                        "y": 608
                                  },
                                  {
                                        "x": 672,
                                        "y": 592
                                  },
                                  {
                                        "x": 688,
                                        "y": 592
                                  },
                                  {
                                        "x": 704,
                                        "y": 608
                                  },
                                  {
                                        "x": 704,
                                        "y": 592
                                  },
                                  {
                                        "x": 720,
                                        "y": 592
                                  },
                                  {
                                        "x": 720,
                                        "y": 608
                                  },
                                  {
                                        "x": 736,
                                        "y": 608
                                  },
                                  {
                                        "x": 736,
                                        "y": 608
                                  },
                                  {
                                        "x": 720,
                                        "y": 624
                                  }
                            ],
                            "collisionType": "overhead",
                            "isOverhead": true
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 40,
                            "x": 784,
                            "y": 560,
                            "rotation": 0,
                            "w": 64,
                            "h": 64,
                            "label": "POLÍGONO POR CIMA",
                            "id": "poly_obs_mvtkzzzq_23c",
                            "polygon": [
                                  {
                                        "x": 784,
                                        "y": 624
                                  },
                                  {
                                        "x": 800,
                                        "y": 592
                                  },
                                  {
                                        "x": 784,
                                        "y": 576
                                  },
                                  {
                                        "x": 800,
                                        "y": 560
                                  },
                                  {
                                        "x": 816,
                                        "y": 592
                                  },
                                  {
                                        "x": 832,
                                        "y": 592
                                  },
                                  {
                                        "x": 832,
                                        "y": 608
                                  },
                                  {
                                        "x": 848,
                                        "y": 624
                                  }
                            ],
                            "collisionType": "overhead",
                            "isOverhead": true
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 41,
                            "x": 896,
                            "y": 592,
                            "rotation": 0,
                            "w": 32,
                            "h": 32,
                            "label": "POLÍGONO POR CIMA",
                            "id": "poly_obs_mvtl076n_wxi",
                            "polygon": [
                                  {
                                        "x": 896,
                                        "y": 624
                                  },
                                  {
                                        "x": 896,
                                        "y": 624
                                  },
                                  {
                                        "x": 896,
                                        "y": 608
                                  },
                                  {
                                        "x": 912,
                                        "y": 608
                                  },
                                  {
                                        "x": 912,
                                        "y": 592
                                  },
                                  {
                                        "x": 912,
                                        "y": 592
                                  },
                                  {
                                        "x": 912,
                                        "y": 608
                                  },
                                  {
                                        "x": 928,
                                        "y": 624
                                  },
                                  {
                                        "x": 912,
                                        "y": 624
                                  }
                            ],
                            "collisionType": "overhead",
                            "isOverhead": true
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 42,
                            "x": 960,
                            "y": 608,
                            "rotation": 0,
                            "w": 16,
                            "h": 16,
                            "label": "POLÍGONO POR CIMA",
                            "id": "poly_obs_mvtl0omn_btc",
                            "polygon": [
                                  {
                                        "x": 960,
                                        "y": 624
                                  },
                                  {
                                        "x": 960,
                                        "y": 608
                                  },
                                  {
                                        "x": 976,
                                        "y": 608
                                  },
                                  {
                                        "x": 976,
                                        "y": 608
                                  },
                                  {
                                        "x": 976,
                                        "y": 624
                                  }
                            ],
                            "collisionType": "overhead",
                            "isOverhead": true
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 43,
                            "x": 992,
                            "y": 576,
                            "rotation": 0,
                            "w": 128,
                            "h": 48,
                            "label": "POLÍGONO POR CIMA",
                            "id": "poly_obs_mvtl1rls_n4d",
                            "polygon": [
                                  {
                                        "x": 992,
                                        "y": 624
                                  },
                                  {
                                        "x": 992,
                                        "y": 592
                                  },
                                  {
                                        "x": 1008,
                                        "y": 576
                                  },
                                  {
                                        "x": 1024,
                                        "y": 592
                                  },
                                  {
                                        "x": 1088,
                                        "y": 576
                                  },
                                  {
                                        "x": 1120,
                                        "y": 608
                                  },
                                  {
                                        "x": 1120,
                                        "y": 624
                                  }
                            ],
                            "collisionType": "overhead",
                            "isOverhead": true
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 44,
                            "x": 704,
                            "y": 368,
                            "rotation": 0,
                            "w": 240,
                            "h": 112,
                            "label": "TRIGGER",
                            "id": "trigger_2yqx",
                            "collisionType": "trigger",
                            "isTrigger": true,
                            "ai_instruction": "Tire essa zona amarela, espere a personagem estar próximo a essa área para abrir o menu de loja mantenha o icone flutuante de \"pressione E para tal coisa\""
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 45,
                            "x": 224,
                            "y": 224,
                            "rotation": 0,
                            "w": 416,
                            "h": 288,
                            "label": "TRIGGER",
                            "id": "trigger_6ta6",
                            "collisionType": "trigger",
                            "isTrigger": true,
                            "ai_instruction": "tire essa zona azul, quando a personagem chegar na zona de trigger deve aparecer \"pressione E para abrir o mural\""
                      },
                      {
                            "type": "animation_marker",
                            "zIndex": 46,
                            "x": 464,
                            "y": 160,
                            "rotation": 0,
                            "label": "ANIM_766",
                            "id": "anim_9gqp",
                            "ai_instruction": "deixe um ponto de exclamação flutuando aqui",
                            "isAnimationMarker": true
                      },
                      {
                            "type": "obstacle",
                            "zIndex": 47,
                            "x": 1328,
                            "y": 432,
                            "rotation": 0,
                            "w": 96,
                            "h": 144,
                            "label": "TRIGGER",
                            "id": "trigger_jfqd",
                            "collisionType": "trigger",
                            "isTrigger": true,
                            "ai_instruction": "na primeira fase, se você tocar aqui, automáticamente você é teleportado para a primeira fase, na segunda para frente aparece aquela função de reiniciar ou ir para a próxima fase e tire esse quadrado de passar de fase de uma fase para outra faça um efeitinho só para não ficar hiper seco"
                      }
                ]
          },
          {
                "id": 3,
                "name": "Teto/Overlay",
                "visible": true,
                "itemsCount": 0,
                "items": []
          }
    ],
    obstacles: [
          {
                "type": "obstacle",
                "zIndex": 0,
                "x": 190,
                "y": 0,
                "rotation": 0,
                "w": 1150,
                "h": 105,
                "label": "TETO / PAREDE SUPERIOR"
          },
          {
                "type": "obstacle",
                "zIndex": 1,
                "x": 0,
                "y": 0,
                "rotation": 0,
                "w": 190,
                "h": 220,
                "label": "CANTO SUPERIOR ESQUERDO"
          },
          {
                "type": "obstacle",
                "zIndex": 2,
                "x": 1344,
                "y": 0,
                "rotation": 0,
                "w": 196,
                "h": 180,
                "label": "CANTO SUPERIOR DIREITO"
          },
          {
                "type": "obstacle",
                "zIndex": 3,
                "x": 0,
                "y": 220,
                "rotation": 0,
                "w": 64,
                "h": 100,
                "label": "BATENTE PORTA ESQUERDA (ALTO)"
          },
          {
                "type": "obstacle",
                "zIndex": 4,
                "x": 0,
                "y": 0,
                "rotation": 0,
                "w": 40,
                "h": 857,
                "label": "LIMITE EXTERNO DA RAMPA"
          },
          {
                "type": "obstacle",
                "zIndex": 5,
                "x": 0,
                "y": 656,
                "rotation": 0,
                "w": 140,
                "h": 201,
                "label": "CANTO INFERIOR ESQUERDO"
          },
          {
                "type": "obstacle",
                "zIndex": 6,
                "x": 1480,
                "y": 180,
                "rotation": 0,
                "w": 56,
                "h": 80,
                "label": "BATENTE PORTA DIREITA (ALTO)"
          },
          {
                "type": "obstacle",
                "zIndex": 7,
                "x": 1480,
                "y": 0,
                "rotation": 0,
                "w": 56,
                "h": 857,
                "label": "LIMITE EXTERNO DA SAÍDA"
          },
          {
                "type": "obstacle",
                "zIndex": 8,
                "x": 1380,
                "y": 690,
                "rotation": 0,
                "w": 156,
                "h": 167,
                "label": "CANTO INFERIOR DIREITO"
          },
          {
                "type": "obstacle",
                "zIndex": 9,
                "x": 140,
                "y": 810,
                "rotation": 0,
                "w": 1240,
                "h": 47,
                "label": "PAREDE INFERIOR DA VAN"
          },
          {
                "type": "obstacle",
                "zIndex": 10,
                "x": 190,
                "y": 105,
                "rotation": 0,
                "w": 495,
                "h": 280,
                "label": "PAREDE TRASEIRA & MURAL DE AVISOS"
          },
          {
                "type": "obstacle",
                "zIndex": 11,
                "x": 940,
                "y": 105,
                "rotation": 0,
                "w": 400,
                "h": 247,
                "label": "PAREDE TRASEIRA & PAINEL DE CONTROLE"
          },
          {
                "type": "obstacle",
                "zIndex": 12,
                "x": 224,
                "y": 288,
                "rotation": 0,
                "w": 115,
                "h": 150,
                "label": "CAIXOTE & ENCOMENDA (NOROESTE)"
          },
          {
                "type": "obstacle",
                "zIndex": 13,
                "x": 352,
                "y": 304,
                "rotation": 0,
                "w": 75,
                "h": 127,
                "label": "PLANTA DA BASE (NOROESTE)"
          },
          {
                "type": "obstacle",
                "zIndex": 14,
                "x": 416,
                "y": 288,
                "rotation": 0,
                "w": 115,
                "h": 192,
                "label": "CADEIRA GIRATÓRIA DA ESTAÇÃO"
          },
          {
                "type": "obstacle",
                "zIndex": 15,
                "x": 592,
                "y": 272,
                "rotation": 0,
                "w": 98,
                "h": 150,
                "label": "VASO DE PLANTA TÁTICO"
          },
          {
                "type": "obstacle",
                "zIndex": 16,
                "x": 704,
                "y": 96,
                "rotation": 0,
                "w": 240,
                "h": 343,
                "label": "DISPENSADOR AUTOMÁTICO (LOJA DE ARMAS)"
          },
          {
                "type": "obstacle",
                "zIndex": 17,
                "x": 1024,
                "y": 352,
                "rotation": 0,
                "w": 96,
                "h": 64,
                "label": "MESA DO COMPUTADOR CRT"
          },
          {
                "type": "obstacle",
                "zIndex": 18,
                "x": 1120,
                "y": 272,
                "rotation": 0,
                "w": 115,
                "h": 155,
                "label": "BAÚS DE CARGA & GERADOR"
          },
          {
                "type": "obstacle",
                "zIndex": 19,
                "x": 112,
                "y": 656,
                "rotation": 0,
                "w": 240,
                "h": 160,
                "label": "VASO & CAIXOTE INFERIOR"
          },
          {
                "type": "obstacle",
                "zIndex": 20,
                "x": 330,
                "y": 624,
                "rotation": 0,
                "w": 395,
                "h": 196,
                "label": "BANCADA MECÂNICA & PROJETOS"
          },
          {
                "type": "obstacle",
                "zIndex": 21,
                "x": 725,
                "y": 624,
                "rotation": 0,
                "w": 411,
                "h": 196,
                "label": "LABORATÓRIO QUÍMICO & TUBOS DE ENSAIO"
          },
          {
                "type": "obstacle",
                "zIndex": 22,
                "x": 1136,
                "y": 688,
                "rotation": 0,
                "w": 240,
                "h": 137,
                "label": "MALETA DE CAMPO & BATERIA"
          },
          {
                "type": "obstacle",
                "zIndex": 23,
                "x": 528,
                "y": 320,
                "rotation": 0,
                "w": 48,
                "h": 80,
                "label": "COLISÃO",
                "id": "van_obs_rxkk_24"
          },
          {
                "type": "obstacle",
                "zIndex": 24,
                "x": 1232,
                "y": 352,
                "rotation": 0,
                "w": 96,
                "h": 64,
                "label": "MESA DO COMPUTADOR CRT (Cópia)",
                "id": "item_copy_71a"
          },
          {
                "type": "obstacle",
                "zIndex": 25,
                "x": 48,
                "y": 368,
                "rotation": 0,
                "w": 32,
                "h": 288,
                "label": "COLISÃO",
                "id": "van_obs_x47d_31"
          },
          {
                "type": "obstacle",
                "zIndex": 26,
                "x": 80,
                "y": 624,
                "rotation": 0,
                "w": 16,
                "h": 48,
                "label": "COLISÃO",
                "id": "van_obs_x7q1_32"
          },
          {
                "type": "obstacle",
                "zIndex": 27,
                "x": 1408,
                "y": 176,
                "rotation": 0,
                "w": 112,
                "h": 96,
                "label": "COLISÃO",
                "id": "van_obs_znfo_34"
          },
          {
                "type": "obstacle",
                "zIndex": 28,
                "x": 1360,
                "y": 176,
                "rotation": 0,
                "w": 64,
                "h": 32,
                "label": "COLISÃO",
                "id": "van_obs_zsvo_35"
          },
          {
                "type": "obstacle",
                "zIndex": 29,
                "x": 1376,
                "y": 192,
                "rotation": 0,
                "w": 48,
                "h": 32,
                "label": "COLISÃO",
                "id": "van_obs_zwr1_36"
          },
          {
                "type": "obstacle",
                "zIndex": 30,
                "x": 1392,
                "y": 208,
                "rotation": 0,
                "w": 32,
                "h": 48,
                "label": "COLISÃO",
                "id": "van_obs_07sd_37"
          },
          {
                "type": "obstacle",
                "zIndex": 31,
                "x": 1408,
                "y": 272,
                "rotation": 0,
                "w": 80,
                "h": 432,
                "label": "COLISÃO",
                "id": "van_obs_0ij1_38"
          },
          {
                "type": "obstacle",
                "zIndex": 32,
                "x": 48,
                "y": 224,
                "rotation": 0,
                "w": 128,
                "h": 160,
                "label": "COLISÃO POLIGONAL",
                "id": "poly_obs_mvtkswlj_bre",
                "polygon": [
                      {
                            "x": 176,
                            "y": 224
                      },
                      {
                            "x": 80,
                            "y": 384
                      },
                      {
                            "x": 48,
                            "y": 368
                      },
                      {
                            "x": 128,
                            "y": 224
                      }
                ],
                "collisionType": "solid"
          },
          {
                "type": "obstacle",
                "zIndex": 33,
                "x": 144,
                "y": 176,
                "rotation": 0,
                "w": 48,
                "h": 368,
                "label": "COLISÃO POLIGONAL",
                "id": "poly_obs_mvtkt8fq_e18",
                "polygon": [
                      {
                            "x": 144,
                            "y": 288
                      },
                      {
                            "x": 144,
                            "y": 544
                      },
                      {
                            "x": 192,
                            "y": 448
                      },
                      {
                            "x": 192,
                            "y": 176
                      }
                ],
                "collisionType": "solid"
          },
          {
                "type": "obstacle",
                "zIndex": 34,
                "x": 192,
                "y": 384,
                "rotation": 0,
                "w": 32,
                "h": 80,
                "label": "COLISÃO POLIGONAL",
                "id": "poly_obs_mvtktg0n_vb3",
                "polygon": [
                      {
                            "x": 192,
                            "y": 384
                      },
                      {
                            "x": 192,
                            "y": 464
                      },
                      {
                            "x": 224,
                            "y": 384
                      },
                      {
                            "x": 224,
                            "y": 384
                      }
                ],
                "collisionType": "solid"
          },
          {
                "type": "obstacle",
                "zIndex": 35,
                "x": 80,
                "y": 288,
                "rotation": 0,
                "w": 64,
                "h": 208,
                "label": "COLISÃO POLIGONAL",
                "id": "poly_obs_mvtktvfk_fj9",
                "polygon": [
                      {
                            "x": 128,
                            "y": 480
                      },
                      {
                            "x": 128,
                            "y": 480
                      },
                      {
                            "x": 112,
                            "y": 496
                      },
                      {
                            "x": 80,
                            "y": 496
                      },
                      {
                            "x": 80,
                            "y": 384
                      },
                      {
                            "x": 144,
                            "y": 288
                      }
                ],
                "collisionType": "solid"
          },
          {
                "type": "obstacle",
                "zIndex": 36,
                "x": 128,
                "y": 336,
                "rotation": 0,
                "w": 16,
                "h": 144,
                "label": "COLISÃO POLIGONAL",
                "id": "poly_obs_mvtku3iv_kpy",
                "polygon": [
                      {
                            "x": 128,
                            "y": 480
                      },
                      {
                            "x": 128,
                            "y": 480
                      },
                      {
                            "x": 144,
                            "y": 464
                      },
                      {
                            "x": 144,
                            "y": 336
                      }
                ],
                "collisionType": "solid"
          },
          {
                "type": "obstacle",
                "zIndex": 37,
                "x": 1344,
                "y": 176,
                "rotation": 0,
                "w": 64,
                "h": 288,
                "label": "COLISÃO POLIGONAL",
                "id": "poly_obs_mvtkumiw_77j",
                "polygon": [
                      {
                            "x": 1344,
                            "y": 176
                      },
                      {
                            "x": 1344,
                            "y": 464
                      },
                      {
                            "x": 1360,
                            "y": 464
                      },
                      {
                            "x": 1408,
                            "y": 432
                      },
                      {
                            "x": 1408,
                            "y": 288
                      }
                ],
                "collisionType": "solid"
          },
          {
                "type": "obstacle",
                "zIndex": 38,
                "x": 336,
                "y": 592,
                "rotation": 0,
                "w": 96,
                "h": 64,
                "label": "POLÍGONO POR CIMA",
                "id": "poly_obs_mvtkxp7w_t9j",
                "polygon": [
                      {
                            "x": 336,
                            "y": 608
                      },
                      {
                            "x": 336,
                            "y": 624
                      },
                      {
                            "x": 336,
                            "y": 656
                      },
                      {
                            "x": 352,
                            "y": 656
                      },
                      {
                            "x": 416,
                            "y": 640
                      },
                      {
                            "x": 432,
                            "y": 624
                      },
                      {
                            "x": 432,
                            "y": 608
                      },
                      {
                            "x": 416,
                            "y": 608
                      },
                      {
                            "x": 400,
                            "y": 608
                      },
                      {
                            "x": 384,
                            "y": 608
                      },
                      {
                            "x": 384,
                            "y": 592
                      },
                      {
                            "x": 368,
                            "y": 592
                      },
                      {
                            "x": 352,
                            "y": 592
                      },
                      {
                            "x": 352,
                            "y": 608
                      },
                      {
                            "x": 352,
                            "y": 608
                      }
                ],
                "collisionType": "overhead",
                "isOverhead": true
          },
          {
                "type": "obstacle",
                "zIndex": 39,
                "x": 672,
                "y": 592,
                "rotation": 0,
                "w": 64,
                "h": 32,
                "label": "POLÍGONO POR CIMA",
                "id": "poly_obs_mvtkzgp2_725",
                "polygon": [
                      {
                            "x": 672,
                            "y": 624
                      },
                      {
                            "x": 688,
                            "y": 608
                      },
                      {
                            "x": 672,
                            "y": 592
                      },
                      {
                            "x": 688,
                            "y": 592
                      },
                      {
                            "x": 704,
                            "y": 608
                      },
                      {
                            "x": 704,
                            "y": 592
                      },
                      {
                            "x": 720,
                            "y": 592
                      },
                      {
                            "x": 720,
                            "y": 608
                      },
                      {
                            "x": 736,
                            "y": 608
                      },
                      {
                            "x": 736,
                            "y": 608
                      },
                      {
                            "x": 720,
                            "y": 624
                      }
                ],
                "collisionType": "overhead",
                "isOverhead": true
          },
          {
                "type": "obstacle",
                "zIndex": 40,
                "x": 784,
                "y": 560,
                "rotation": 0,
                "w": 64,
                "h": 64,
                "label": "POLÍGONO POR CIMA",
                "id": "poly_obs_mvtkzzzq_23c",
                "polygon": [
                      {
                            "x": 784,
                            "y": 624
                      },
                      {
                            "x": 800,
                            "y": 592
                      },
                      {
                            "x": 784,
                            "y": 576
                      },
                      {
                            "x": 800,
                            "y": 560
                      },
                      {
                            "x": 816,
                            "y": 592
                      },
                      {
                            "x": 832,
                            "y": 592
                      },
                      {
                            "x": 832,
                            "y": 608
                      },
                      {
                            "x": 848,
                            "y": 624
                      }
                ],
                "collisionType": "overhead",
                "isOverhead": true
          },
          {
                "type": "obstacle",
                "zIndex": 41,
                "x": 896,
                "y": 592,
                "rotation": 0,
                "w": 32,
                "h": 32,
                "label": "POLÍGONO POR CIMA",
                "id": "poly_obs_mvtl076n_wxi",
                "polygon": [
                      {
                            "x": 896,
                            "y": 624
                      },
                      {
                            "x": 896,
                            "y": 624
                      },
                      {
                            "x": 896,
                            "y": 608
                      },
                      {
                            "x": 912,
                            "y": 608
                      },
                      {
                            "x": 912,
                            "y": 592
                      },
                      {
                            "x": 912,
                            "y": 592
                      },
                      {
                            "x": 912,
                            "y": 608
                      },
                      {
                            "x": 928,
                            "y": 624
                      },
                      {
                            "x": 912,
                            "y": 624
                      }
                ],
                "collisionType": "overhead",
                "isOverhead": true
          },
          {
                "type": "obstacle",
                "zIndex": 42,
                "x": 960,
                "y": 608,
                "rotation": 0,
                "w": 16,
                "h": 16,
                "label": "POLÍGONO POR CIMA",
                "id": "poly_obs_mvtl0omn_btc",
                "polygon": [
                      {
                            "x": 960,
                            "y": 624
                      },
                      {
                            "x": 960,
                            "y": 608
                      },
                      {
                            "x": 976,
                            "y": 608
                      },
                      {
                            "x": 976,
                            "y": 608
                      },
                      {
                            "x": 976,
                            "y": 624
                      }
                ],
                "collisionType": "overhead",
                "isOverhead": true
          },
          {
                "type": "obstacle",
                "zIndex": 43,
                "x": 992,
                "y": 576,
                "rotation": 0,
                "w": 128,
                "h": 48,
                "label": "POLÍGONO POR CIMA",
                "id": "poly_obs_mvtl1rls_n4d",
                "polygon": [
                      {
                            "x": 992,
                            "y": 624
                      },
                      {
                            "x": 992,
                            "y": 592
                      },
                      {
                            "x": 1008,
                            "y": 576
                      },
                      {
                            "x": 1024,
                            "y": 592
                      },
                      {
                            "x": 1088,
                            "y": 576
                      },
                      {
                            "x": 1120,
                            "y": 608
                      },
                      {
                            "x": 1120,
                            "y": 624
                      }
                ],
                "collisionType": "overhead",
                "isOverhead": true
          },
          {
                "type": "obstacle",
                "zIndex": 44,
                "x": 704,
                "y": 368,
                "rotation": 0,
                "w": 240,
                "h": 112,
                "label": "TRIGGER",
                "id": "trigger_2yqx",
                "collisionType": "trigger",
                "isTrigger": true,
                "ai_instruction": "Tire essa zona amarela, espere a personagem estar próximo a essa área para abrir o menu de loja mantenha o icone flutuante de \"pressione E para tal coisa\""
          },
          {
                "type": "obstacle",
                "zIndex": 45,
                "x": 224,
                "y": 224,
                "rotation": 0,
                "w": 416,
                "h": 288,
                "label": "TRIGGER",
                "id": "trigger_6ta6",
                "collisionType": "trigger",
                "isTrigger": true,
                "ai_instruction": "tire essa zona azul, quando a personagem chegar na zona de trigger deve aparecer \"pressione E para abrir o mural\""
          },
          {
                "type": "obstacle",
                "zIndex": 47,
                "x": 1328,
                "y": 432,
                "rotation": 0,
                "w": 96,
                "h": 144,
                "label": "TRIGGER",
                "id": "trigger_jfqd",
                "collisionType": "trigger",
                "isTrigger": true,
                "ai_instruction": "na primeira fase, se você tocar aqui, automáticamente você é teleportado para a primeira fase, na segunda para frente aparece aquela função de reiniciar ou ir para a próxima fase e tire esse quadrado de passar de fase de uma fase para outra faça um efeitinho só para não ficar hiper seco"
          }
    ]
  },

  // =========================================================================
  // SAFE ROOM FINAL: A VAN (EXPEDIÇÃO CONCLUÍDA) - Exceto a Última!
  // Mantém a van de vitória com layout e clima comemorativo exclusivo
  // =========================================================================
  van_final: {
    id: 'van_final',
    name: 'SAFE ROOM: A VAN [EXPEDIÇÃO CONCLUÍDA]',
    subtitle: 'Missão Cumprida! • O ecossistema foi salvo pelas ScienceEco Girls',
    width: 1440,
    height: 920,
    isSafeRoom: true,
    palette: {
      bg: '#14171f',
      wallFill: 'rgba(30, 41, 59, 0.94)',
      wallStroke: '#10b981',
      pathFill: 'rgba(16, 185, 129, 0.10)',
      pathStroke: 'rgba(16, 185, 129, 0.32)'
    },
    spawnP1: { x: 280, y: 460 },
    spawnP2: { x: 360, y: 460 },
    trashSpawns: [],
    enemySpawns: [],
    floorZones: [
      { x: 160, y: 140, w: 1120, h: 640, label: 'PÁTIO TÁTICO DA VAN - EXPEDIÇÃO FINALIZADA' }
    ],
    interactiveStations: [
      {
        id: 'notice_board',
        name: 'Mural de Avisos',
        icon: '🏆',
        x: 220,
        y: 160,
        w: 230,
        h: 190,
        zoneLabel: 'MURAL DE VITÓRIA',
        promptText: 'Pressione [E] para Ler o Relatório Final',
        strokeColor: '#10b981',
        fillColor: 'rgba(16, 185, 129, 0.16)'
      },
      {
        id: 'shop',
        name: 'Loja de Armas',
        icon: '⚔️',
        x: 540,
        y: 160,
        w: 260,
        h: 190,
        zoneLabel: 'ARSENAL DA EQUIPE',
        promptText: 'Pressione [E] para Abrir a Loja de Armas',
        strokeColor: '#facc15',
        fillColor: 'rgba(250, 204, 21, 0.16)'
      }
    ],
    transitionZone: {
      x: 1020,
      y: 360,
      w: 200,
      h: 200,
      label: 'PORTA DA VAN → REINICIAR EXPEDIÇÃO',
      subLabel: 'Pressione [E] ou [Espaço] para nova jornada',
      strokeColor: '#10b981',
      fillColor: 'rgba(16, 185, 129, 0.24)'
    },
    obstacles: [
      // Paredes do Compartimento da Van de Vitória
      { x: 120, y: 100, w: 1200, h: 40, label: 'PAREDE NORTE DA VAN' },
      { x: 120, y: 780, w: 1200, h: 40, label: 'PAREDE SUL DA VAN' },
      { x: 120, y: 140, w: 40, h: 640, label: 'CABINE DO MOTORISTA' },
      { x: 1280, y: 140, w: 40, h: 640, label: 'PORTA TRASEIRA' },

      // 1. Estação: Mural de Vitória
      {
        x: 245,
        y: 170,
        w: 180,
        h: 80,
        label: '🏆 MURAL DE VITÓRIA',
        subTag: 'EXPEDIÇÃO CONCLUÍDA',
        customFill: 'rgba(15, 23, 42, 0.95)',
        customStroke: '#10b981'
      },

      // 2. Estação: Loja de Armas
      {
        x: 565,
        y: 170,
        w: 210,
        h: 90,
        label: '⚔️ LOJA DE ARMAS',
        subTag: 'BASTÃO • FERRO • KATANA',
        customFill: 'rgba(120, 53, 15, 0.92)',
        customStroke: '#facc15'
      },

      // Equipamentos Decorativos Sólidos
      { x: 860, y: 170, w: 180, h: 80, label: 'RÁDIO & TELEMETRIA' },
      { x: 565, y: 670, w: 210, h: 80, label: 'BANCADA DE SUPORTE' },
      { x: 860, y: 670, w: 180, h: 80, label: 'GERADOR AUXILIAR' }
    ]
  },

  // =========================================================================
  // MAPA 2: ESGOTO SUBTERRÂNEO [SETOR BETA] (2048 x 2048 px)
  // =========================================================================
  map2: {
    id: 'map2',
    name: 'MAPA 2: ESGOTO SUBTERRÂNEO [SETOR BETA]',
    subtitle: 'Navegue pelas galerias de esgoto, elimine os ratos e colete os 16 lixos até a saída norte',
    width: 2048,
    height: 2048,
    isSafeRoom: false,
    stageNumber: 2,
    imageAsset: 'assets/map2_sewer.jpg',
    palette: {
      bg: '#141416',
      wallFill: 'rgba(30, 41, 59, 0.85)',
      wallStroke: 'rgba(74, 222, 128, 0.5)',
      pathFill: 'rgba(100, 116, 139, 0.15)',
      pathStroke: 'rgba(56, 189, 248, 0.25)'
    },
    spawnP1: { x: 1540, y: 1900 },
    spawnP2: { x: 1615, y: 1900 },
    // Exatamente 16 lixos em corredores amplos e 100% livres de obstáculos
    trashSpawns: [
      { id: 'map2_trash_01', x: 260, y: 310, typeIndex: 1, rotation: 0.12 },
      { id: 'map2_trash_02', x: 450, y: 350, typeIndex: 2, rotation: -0.18 },
      { id: 'map2_trash_03', x: 240, y: 720, typeIndex: 0, rotation: 0.24 },
      { id: 'map2_trash_04', x: 390, y: 1120, typeIndex: 3, rotation: -0.15 },
      { id: 'map2_trash_05', x: 360, y: 1360, typeIndex: 4, rotation: 0.10 },
      { id: 'map2_trash_06', x: 360, y: 1840, typeIndex: 0, rotation: -0.22 },
      { id: 'map2_trash_07', x: 820, y: 490, typeIndex: 1, rotation: 0.16 },
      { id: 'map2_trash_08', x: 1190, y: 640, typeIndex: 2, rotation: -0.12 },
      { id: 'map2_trash_09', x: 860, y: 1330, typeIndex: 3, rotation: 0.19 },
      { id: 'map2_trash_10', x: 1180, y: 1390, typeIndex: 4, rotation: -0.25 },
      { id: 'map2_trash_11', x: 840, y: 1720, typeIndex: 0, rotation: 0.14 },
      { id: 'map2_trash_12', x: 1520, y: 300, typeIndex: 1, rotation: -0.18 },
      { id: 'map2_trash_13', x: 1620, y: 560, typeIndex: 2, rotation: 0.21 },
      { id: 'map2_trash_14', x: 1560, y: 1100, typeIndex: 3, rotation: -0.11 },
      { id: 'map2_trash_15', x: 1660, y: 1390, typeIndex: 4, rotation: 0.17 },
      { id: 'map2_trash_16', x: 1024, y: 260, typeIndex: 0, rotation: -0.20 }
    ],
    enemySpawns: [
      { id: 'map2_rat_01', type: 'scratcher', x: 360, y: 340 },
      { id: 'map2_rat_02', type: 'cheese_thrower', x: 260, y: 680 },
      { id: 'map2_rat_03', type: 'spitter', x: 320, y: 1160 },
      { id: 'map2_rat_04', type: 'scratcher', x: 360, y: 1560 },
      { id: 'map2_rat_05', type: 'cheese_thrower', x: 260, y: 1860 },
      { id: 'map2_rat_06', type: 'spitter', x: 460, y: 1800 },
      { id: 'map2_rat_07', type: 'scratcher', x: 920, y: 560 },
      { id: 'map2_rat_08', type: 'spitter', x: 1180, y: 580 },
      { id: 'map2_rat_09', type: 'cheese_thrower', x: 820, y: 1040 },
      { id: 'map2_rat_10', type: 'scratcher', x: 1200, y: 1060 },
      { id: 'map2_rat_11', type: 'spitter', x: 860, y: 1440 },
      { id: 'map2_rat_12', type: 'cheese_thrower', x: 1180, y: 1480 },
      { id: 'map2_rat_13', type: 'scratcher', x: 840, y: 1800 },
      { id: 'map2_rat_14', type: 'cheese_thrower', x: 1520, y: 340 },
      { id: 'map2_rat_15', type: 'spitter', x: 1680, y: 520 },
      { id: 'map2_rat_16', type: 'scratcher', x: 1560, y: 1080 },
      { id: 'map2_rat_17', type: 'spitter', x: 1660, y: 1360 }
    ],
    floorZones: [],
    transitionZone: {
      x: 930,
      y: 70,
      w: 190,
      h: 160,
      label: 'ZONA DE EXTRAÇÃO → TÚNEL DO REATOR',
      subLabel: 'Pressione [E] ou [Espaço] para concluir a fase',
      strokeColor: '#4ade80',
      fillColor: 'rgba(74, 222, 128, 0.28)'
    },
    elevatedStructures: [
      {
        id: 'bridge_central_upper',
        name: 'Passarela Metálica Superior',
        x: 748,
        y: 816,
        w: 576,
        h: 128,
        srcX: 374,
        srcY: 408,
        srcW: 288,
        srcH: 64,
        depth: 0.06
      },
      {
        id: 'bridge_central_lower',
        name: 'Passarela Metálica Inferior',
        x: 948,
        y: 1832,
        w: 376,
        h: 128,
        srcX: 474,
        srcY: 916,
        srcW: 188,
        srcH: 64,
        depth: 0.05
      },
      {
        id: 'ramp_platform_upper',
        name: 'Plataforma Elevada Noroeste',
        x: 948,
        y: 486,
        w: 144,
        h: 80,
        srcX: 474,
        srcY: 243,
        srcW: 72,
        srcH: 40,
        depth: 0.04
      },
      {
        id: 'ramp_platform_lower',
        name: 'Plataforma Elevada Sudoeste',
        x: 948,
        y: 1320,
        w: 144,
        h: 80,
        srcX: 474,
        srcY: 660,
        srcW: 72,
        srcH: 40,
        depth: 0.04
      }
    ],
    obstacles: [
      // 1. Limites externos (2048x2048)
      { x: 0, y: 0, w: 2048, h: 60, label: 'LIMITE NORTE' },
      { x: 0, y: 1988, w: 2048, h: 60, label: 'LIMITE SUL' },
      { x: 0, y: 60, w: 60, h: 1928, label: 'LIMITE OESTE' },
      { x: 1988, y: 60, w: 60, h: 1928, label: 'LIMITE LESTE' },

      // 2. Paredes da Garagem da Van (Com portas amplas ao norte e a oeste)
      { x: 1540, y: 1540, w: 448, h: 48, label: 'PAREDE NORTE DA GARAGEM' },
      { x: 1340, y: 1540, w: 48, h: 90, label: 'PAREDE OESTE GARAGEM ALTA' },
      { x: 1340, y: 1770, w: 48, h: 218, label: 'PAREDE OESTE GARAGEM BAIXA' },
      { x: 1550, y: 1685, w: 290, h: 150, label: 'VAN DE OPERAÇÕES', customStroke: '#f59e0b', customFill: 'rgba(245, 158, 11, 0.2)' },

      // 3. Divisórias Centro-Leste (aberturas amplas em Y: 440..660 e Y: 1200..1540)
      { x: 1340, y: 60, w: 48, h: 380, label: 'PILAR LESTE NORTE' },
      { x: 1340, y: 660, w: 48, h: 540, label: 'PILAR LESTE CENTRO' },

      // 4. Divisórias Oeste-Centro (aberturas amplas em Y: 440..680 e Y: 1240..1480)
      { x: 660, y: 60, w: 48, h: 380, label: 'PILAR OESTE NORTE' },
      { x: 660, y: 680, w: 48, h: 560, label: 'PILAR OESTE CENTRO' },
      { x: 660, y: 1480, w: 48, h: 440, label: 'PILAR OESTE SUL' },

      // 5. Maquinários Industriais Laterais
      { x: 1840, y: 260, w: 148, h: 220, label: 'GERADOR NORDESTE' },
      { x: 1840, y: 1060, w: 148, h: 220, label: 'CALDEIRA LESTE' },
      { x: 60, y: 1460, w: 150, h: 240, label: 'MAQUINÁRIO SUDOESTE' }
    ]
  },

  // =========================================================================
  // MAPA 3: COMPLEXO SUBTERRÂNEO [SETOR GAMMA] (2500 x 2500 px)
  // =========================================================================
  map3: {
    id: 'map3',
    name: 'MAPA 3: COMPLEXO SUBTERRÂNEO [SETOR GAMMA]',
    subtitle: 'Fase Final • Colete os 16 lixos e derrote o Rei Rato Radioativo!',
    width: 2500,
    height: 2500,
    isSafeRoom: false,
    stageNumber: 3,
    palette: {
      bg: '#1c1018',
      wallFill: 'rgba(76, 29, 49, 0.92)',
      wallStroke: '#fb7185',
      pathFill: 'rgba(244, 63, 94, 0.14)',
      pathStroke: 'rgba(251, 113, 133, 0.30)'
    },
    spawnP1: { x: 1210, y: 320 },
    spawnP2: { x: 1290, y: 320 },
    // Exatamente 16 lixos perfeitamente acessíveis nos corredores e na arena
    trashSpawns: [
      { id: 'map3_trash_01', x: 1250, y: 460, typeIndex: 4, rotation: 0.15 },
      { id: 'map3_trash_02', x: 1250, y: 640, typeIndex: 3, rotation: -0.20 },
      { id: 'map3_trash_03', x: 1250, y: 800, typeIndex: 0, rotation: 0.10 },
      { id: 'map3_trash_04', x: 1120, y: 980, typeIndex: 1, rotation: -0.14 },
      { id: 'map3_trash_05', x: 1020, y: 1080, typeIndex: 2, rotation: 0.22 },
      { id: 'map3_trash_06', x: 820, y: 1080, typeIndex: 3, rotation: -0.18 },
      { id: 'map3_trash_07', x: 660, y: 1080, typeIndex: 4, rotation: 0.12 },
      { id: 'map3_trash_08', x: 1380, y: 980, typeIndex: 0, rotation: -0.24 },
      { id: 'map3_trash_09', x: 1480, y: 1080, typeIndex: 1, rotation: 0.16 },
      { id: 'map3_trash_10', x: 1680, y: 1080, typeIndex: 2, rotation: -0.11 },
      { id: 'map3_trash_11', x: 1840, y: 1080, typeIndex: 3, rotation: 0.19 },
      { id: 'map3_trash_12', x: 1250, y: 1260, typeIndex: 4, rotation: -0.15 },
      { id: 'map3_trash_13', x: 1250, y: 1460, typeIndex: 0, rotation: 0.21 },
      { id: 'map3_trash_14', x: 1250, y: 1660, typeIndex: 1, rotation: -0.17 },
      { id: 'map3_trash_15', x: 1020, y: 1820, typeIndex: 2, rotation: 0.14 },
      { id: 'map3_trash_16', x: 1480, y: 1820, typeIndex: 3, rotation: -0.22 }
    ],
    enemySpawns: [
      { id: 'boss_alpha', type: 'boss_alpha', x: 1250, y: 1080 }
    ],
    floorZones: [
      { x: 1100, y: 180, w: 300, h: 220, label: 'ELEVADOR DE CARGA [GAMMA]' },
      { x: 1160, y: 400, w: 180, h: 620, label: 'CORREDOR NORTE' },
      { x: 620, y: 960, w: 1260, h: 240, label: 'ARENA CENTRAL DO REATOR' },
      { x: 1160, y: 1200, w: 180, h: 840, label: 'EIXO DE EXTRAÇÃO SUL' }
    ],
    transitionZone: {
      x: 1120,
      y: 2040,
      w: 260,
      h: 220,
      label: 'EXTRAÇÃO FINAL DA EXPEDIÇÃO',
      subLabel: 'Pressione [E] ou [Espaço] para concluir',
      strokeColor: '#fb7185',
      fillColor: 'rgba(244, 63, 94, 0.26)'
    },
    obstacles: [
      { x: 0, y: 0, w: 2500, h: 40, label: 'LIMITE NORTE' },
      { x: 0, y: 2460, w: 2500, h: 40, label: 'LIMITE SUL' },
      { x: 0, y: 40, w: 40, h: 2420, label: 'LIMITE OESTE' },
      { x: 2460, y: 40, w: 40, h: 2420, label: 'LIMITE LESTE' },

      // Estruturas Simétricas do Laboratório Subterrâneo (com corredores amplos)
      { x: 680, y: 420, w: 360, h: 420, label: 'CÂMARA DE CRIOGENIA OESTE' },
      { x: 1460, y: 420, w: 360, h: 420, label: 'CÂMARA DE CRIOGENIA LESTE' },
      { x: 320, y: 960, w: 260, h: 520, label: 'GERADOR AUXILIAR A' },
      { x: 1920, y: 960, w: 260, h: 520, label: 'GERADOR AUXILIAR B' },
      { x: 740, y: 1300, w: 320, h: 440, label: 'PILAR DE CONTENÇÃO 01' },
      { x: 1440, y: 1300, w: 320, h: 440, label: 'PILAR DE CONTENÇÃO 02' },
      { x: 520, y: 1940, w: 460, h: 240, label: 'BLOCO DE SEGURANÇA OESTE' },
      { x: 1520, y: 1940, w: 460, h: 240, label: 'BLOCO DE SEGURANÇA LESTE' }
    ]
  }
};



// Aliases para Safe Rooms das Vans Operacionais
if (window.GameMaps && window.GameMaps.van) {
  window.GameMaps.van_start = window.GameMaps.van;
  window.GameMaps.van_1 = window.GameMaps.van;
  window.GameMaps.van_2 = window.GameMaps.van;
}



// =========================================================================
// SPRINT 17: MOTOR DE COLISÕES E HITBOXES POR CIMA (PASS-THROUGH)
// =========================================================================

/**
 * Monta e sincroniza a lista de collisionBounds durante o carregamento do JSON ou inicialização do mapa.
 *
 * Condição rigorosa: se o objeto ou polígono possuir a propriedade isOverhead === true
 * (ou collisionType === 'overhead', ou pertencer à camada destinada ao 'teto'), ele NÃO DEVE
 * ser inserido no array de colisões. O motor de física ignora completamente esse objeto,
 * permitindo que jogadores e inimigos caminhem livremente por aquelas coordenadas sem repulsão.
 *
 * @param {Object} map Objeto de mapa
 * @returns {Array} Array de collisionBounds válidos
 */
window.buildMapCollisionBounds = function(map) {
  if (!map) return [];
  const collisionBounds = [];

  // 1. Carregamento via Camadas Estruturadas (formato nativo JSON do editor)
  if (Array.isArray(map.layers) && map.layers.length > 0) {
    map.layers.forEach((layer, layerIdx) => {
      // Ignora rigorosamente a camada destinada ao 'teto' (Camada 3)
      const isCeilingLayer =
        layerIdx === 3 ||
        layer.id === 3 ||
        (layer.name && /teto|overhead/i.test(layer.name));
      if (isCeilingLayer) return;

      if (Array.isArray(layer.items)) {
        layer.items.forEach((item) => {
          // Condição rigorosa: se isOverhead for true ou collisionType for 'overhead', não entra em colisões
          // Condição rigorosa (Sprint 17): overhead e triggers não entram em colisão física
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
  } else if (Array.isArray(map.obstacles)) {
    // 2. Fallback para mapas com lista de obstáculos plana
    map.obstacles.forEach((obs) => {
      if (
        obs.isOverhead === true ||
        obs.collisionType === 'overhead' ||
        obs.layer === 3 ||
        obs.isTrigger === true ||
        obs.collisionType === 'trigger'
      ) {
        return;
      }
      collisionBounds.push(obs);
    });
  }

  // Se map.layers montou collisionBounds mas o mapa possuía obstacles planos sem layers
  if (Array.isArray(map.layers) && Array.isArray(map.obstacles) && collisionBounds.length === 0) {
    map.obstacles.forEach((obs) => {
      if (
        obs.isOverhead === true ||
        obs.collisionType === 'overhead' ||
        obs.layer === 3
      ) {
        return;
      }
      collisionBounds.push(obs);
    });
  }

  map.collisionBounds = collisionBounds;
  map.obstacles = collisionBounds; // Mantém compatibilidade 100% com o motor de física
  return collisionBounds;
};

// Inicialização dinâmica dos obstáculos do Mapa 1
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
