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
    "id": "trigger_d9lp",
    "x": 1744,
    "y": 272,
    "w": 160,
    "h": 96,
    "label": "ZONA DE EXTRAÇÃO → EMBARCAR NA VAN",
    "subLabel": "Toque para embarcar na Van",
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
      "x": 880,
      "y": 1680,
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
      "x": 1584,
      "y": 240,
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
  "overheadZones": [
    {
      "id": "poly_obs_mvuz7cy6_7dq",
      "x": 54,
      "y": 1350,
      "w": 264,
      "h": 323,
      "polygon": [
        {
          "x": 153,
          "y": 1350
        },
        {
          "x": 54,
          "y": 1466
        },
        {
          "x": 60,
          "y": 1634
        },
        {
          "x": 69,
          "y": 1644
        },
        {
          "x": 161,
          "y": 1538
        },
        {
          "x": 315,
          "y": 1673
        },
        {
          "x": 318,
          "y": 1665
        },
        {
          "x": 317,
          "y": 1482
        },
        {
          "x": 170,
          "y": 1350
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvuzb04c_x4h",
      "x": 479,
      "y": 1630,
      "w": 298,
      "h": 249,
      "polygon": [
        {
          "x": 479,
          "y": 1712
        },
        {
          "x": 480,
          "y": 1878
        },
        {
          "x": 614,
          "y": 1790
        },
        {
          "x": 629,
          "y": 1790
        },
        {
          "x": 775,
          "y": 1879
        },
        {
          "x": 777,
          "y": 1712
        },
        {
          "x": 631,
          "y": 1630
        },
        {
          "x": 615,
          "y": 1630
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvuzdug1_xx7",
      "x": 1105,
      "y": 1694,
      "w": 294,
      "h": 256,
      "polygon": [
        {
          "x": 1105,
          "y": 1765
        },
        {
          "x": 1105,
          "y": 1891
        },
        {
          "x": 1127,
          "y": 1880
        },
        {
          "x": 1130,
          "y": 1870
        },
        {
          "x": 1240,
          "y": 1865
        },
        {
          "x": 1276,
          "y": 1865
        },
        {
          "x": 1277,
          "y": 1863
        },
        {
          "x": 1287,
          "y": 1863
        },
        {
          "x": 1287,
          "y": 1867
        },
        {
          "x": 1399,
          "y": 1951
        },
        {
          "x": 1399,
          "y": 1784
        },
        {
          "x": 1289,
          "y": 1709
        },
        {
          "x": 1286,
          "y": 1703
        },
        {
          "x": 1276,
          "y": 1703
        },
        {
          "x": 1275,
          "y": 1694
        },
        {
          "x": 1239,
          "y": 1694
        },
        {
          "x": 1240,
          "y": 1715
        },
        {
          "x": 1134,
          "y": 1714
        },
        {
          "x": 1134,
          "y": 1754
        },
        {
          "x": 1115,
          "y": 1754
        },
        {
          "x": 1113,
          "y": 1765
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvuzknsm_nbb",
      "x": 1134,
      "y": 1153,
      "w": 289,
      "h": 240,
      "polygon": [
        {
          "x": 1152,
          "y": 1386
        },
        {
          "x": 1138,
          "y": 1394
        },
        {
          "x": 1134,
          "y": 1389
        },
        {
          "x": 1134,
          "y": 1232
        },
        {
          "x": 1276,
          "y": 1153
        },
        {
          "x": 1286,
          "y": 1153
        },
        {
          "x": 1422,
          "y": 1229
        },
        {
          "x": 1419,
          "y": 1393
        },
        {
          "x": 1287,
          "y": 1299
        },
        {
          "x": 1271,
          "y": 1299
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvuzr2wm_pp6",
      "x": 1433,
      "y": 1542,
      "w": 36,
      "h": 39,
      "polygon": [
        {
          "x": 1433,
          "y": 1553
        },
        {
          "x": 1433,
          "y": 1571
        },
        {
          "x": 1435,
          "y": 1580
        },
        {
          "x": 1444,
          "y": 1580
        },
        {
          "x": 1459,
          "y": 1581
        },
        {
          "x": 1465,
          "y": 1580
        },
        {
          "x": 1469,
          "y": 1578
        },
        {
          "x": 1468,
          "y": 1559
        },
        {
          "x": 1469,
          "y": 1552
        },
        {
          "x": 1466,
          "y": 1546
        },
        {
          "x": 1460,
          "y": 1543
        },
        {
          "x": 1453,
          "y": 1542
        },
        {
          "x": 1447,
          "y": 1542
        },
        {
          "x": 1439,
          "y": 1545
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvuzufh6_8o4",
      "x": 1412,
      "y": 1776,
      "w": 35,
      "h": 36,
      "polygon": [
        {
          "x": 1412,
          "y": 1783
        },
        {
          "x": 1414,
          "y": 1794
        },
        {
          "x": 1414,
          "y": 1810
        },
        {
          "x": 1446,
          "y": 1812
        },
        {
          "x": 1445,
          "y": 1797
        },
        {
          "x": 1447,
          "y": 1789
        },
        {
          "x": 1445,
          "y": 1781
        },
        {
          "x": 1439,
          "y": 1777
        },
        {
          "x": 1429,
          "y": 1776
        },
        {
          "x": 1421,
          "y": 1776
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvuzvz4d_fnc",
      "x": 271,
      "y": 291,
      "w": 45,
      "h": 49,
      "polygon": [
        {
          "x": 308,
          "y": 340
        },
        {
          "x": 316,
          "y": 340
        },
        {
          "x": 313,
          "y": 331
        },
        {
          "x": 314,
          "y": 317
        },
        {
          "x": 313,
          "y": 306
        },
        {
          "x": 311,
          "y": 298
        },
        {
          "x": 305,
          "y": 295
        },
        {
          "x": 304,
          "y": 295
        },
        {
          "x": 303,
          "y": 293
        },
        {
          "x": 299,
          "y": 293
        },
        {
          "x": 298,
          "y": 293
        },
        {
          "x": 294,
          "y": 291
        },
        {
          "x": 285,
          "y": 291
        },
        {
          "x": 277,
          "y": 292
        },
        {
          "x": 272,
          "y": 292
        },
        {
          "x": 271,
          "y": 300
        },
        {
          "x": 274,
          "y": 301
        },
        {
          "x": 274,
          "y": 306
        },
        {
          "x": 275,
          "y": 308
        },
        {
          "x": 288,
          "y": 308
        },
        {
          "x": 295,
          "y": 308
        },
        {
          "x": 296,
          "y": 304
        },
        {
          "x": 296,
          "y": 302
        },
        {
          "x": 299,
          "y": 300
        },
        {
          "x": 304,
          "y": 302
        },
        {
          "x": 304,
          "y": 309
        },
        {
          "x": 304,
          "y": 316
        },
        {
          "x": 306,
          "y": 320
        },
        {
          "x": 306,
          "y": 332
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvuzx5am_lpg",
      "x": 568,
      "y": 752,
      "w": 64,
      "h": 39,
      "polygon": [
        {
          "x": 603,
          "y": 767
        },
        {
          "x": 605,
          "y": 774
        },
        {
          "x": 627,
          "y": 775
        },
        {
          "x": 628,
          "y": 770
        },
        {
          "x": 629,
          "y": 766
        },
        {
          "x": 631,
          "y": 766
        },
        {
          "x": 631,
          "y": 755
        },
        {
          "x": 626,
          "y": 752
        },
        {
          "x": 602,
          "y": 753
        },
        {
          "x": 602,
          "y": 756
        },
        {
          "x": 591,
          "y": 755
        },
        {
          "x": 587,
          "y": 756
        },
        {
          "x": 581,
          "y": 761
        },
        {
          "x": 573,
          "y": 770
        },
        {
          "x": 570,
          "y": 776
        },
        {
          "x": 568,
          "y": 786
        },
        {
          "x": 568,
          "y": 792
        },
        {
          "x": 576,
          "y": 792
        },
        {
          "x": 576,
          "y": 781
        },
        {
          "x": 577,
          "y": 776
        },
        {
          "x": 582,
          "y": 769
        },
        {
          "x": 586,
          "y": 763
        },
        {
          "x": 591,
          "y": 761
        },
        {
          "x": 603,
          "y": 761
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvuzzl0x_gxo",
      "x": 568,
      "y": 489,
      "w": 63,
      "h": 46,
      "polygon": [
        {
          "x": 568,
          "y": 508
        },
        {
          "x": 573,
          "y": 513
        },
        {
          "x": 593,
          "y": 514
        },
        {
          "x": 596,
          "y": 507
        },
        {
          "x": 598,
          "y": 507
        },
        {
          "x": 598,
          "y": 499
        },
        {
          "x": 616,
          "y": 497
        },
        {
          "x": 622,
          "y": 503
        },
        {
          "x": 623,
          "y": 515
        },
        {
          "x": 623,
          "y": 535
        },
        {
          "x": 632,
          "y": 535
        },
        {
          "x": 632,
          "y": 520
        },
        {
          "x": 629,
          "y": 516
        },
        {
          "x": 630,
          "y": 508
        },
        {
          "x": 628,
          "y": 503
        },
        {
          "x": 626,
          "y": 495
        },
        {
          "x": 620,
          "y": 491
        },
        {
          "x": 614,
          "y": 489
        },
        {
          "x": 600,
          "y": 490
        },
        {
          "x": 596,
          "y": 492
        },
        {
          "x": 593,
          "y": 491
        },
        {
          "x": 579,
          "y": 491
        },
        {
          "x": 574,
          "y": 493
        },
        {
          "x": 571,
          "y": 500
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvv02kz9_91u",
      "x": 292,
      "y": 533,
      "w": 77,
      "h": 61,
      "polygon": [
        {
          "x": 302,
          "y": 592
        },
        {
          "x": 295,
          "y": 592
        },
        {
          "x": 292,
          "y": 590
        },
        {
          "x": 300,
          "y": 584
        },
        {
          "x": 300,
          "y": 579
        },
        {
          "x": 296,
          "y": 575
        },
        {
          "x": 304,
          "y": 572
        },
        {
          "x": 311,
          "y": 569
        },
        {
          "x": 305,
          "y": 563
        },
        {
          "x": 297,
          "y": 558
        },
        {
          "x": 305,
          "y": 555
        },
        {
          "x": 309,
          "y": 555
        },
        {
          "x": 309,
          "y": 547
        },
        {
          "x": 312,
          "y": 543
        },
        {
          "x": 317,
          "y": 547
        },
        {
          "x": 319,
          "y": 542
        },
        {
          "x": 320,
          "y": 541
        },
        {
          "x": 325,
          "y": 547
        },
        {
          "x": 328,
          "y": 533
        },
        {
          "x": 332,
          "y": 533
        },
        {
          "x": 336,
          "y": 543
        },
        {
          "x": 337,
          "y": 551
        },
        {
          "x": 345,
          "y": 545
        },
        {
          "x": 347,
          "y": 542
        },
        {
          "x": 352,
          "y": 542
        },
        {
          "x": 353,
          "y": 544
        },
        {
          "x": 349,
          "y": 545
        },
        {
          "x": 349,
          "y": 549
        },
        {
          "x": 352,
          "y": 549
        },
        {
          "x": 352,
          "y": 556
        },
        {
          "x": 365,
          "y": 555
        },
        {
          "x": 365,
          "y": 559
        },
        {
          "x": 362,
          "y": 563
        },
        {
          "x": 358,
          "y": 564
        },
        {
          "x": 359,
          "y": 567
        },
        {
          "x": 364,
          "y": 569
        },
        {
          "x": 368,
          "y": 570
        },
        {
          "x": 369,
          "y": 574
        },
        {
          "x": 365,
          "y": 576
        },
        {
          "x": 367,
          "y": 578
        },
        {
          "x": 369,
          "y": 584
        },
        {
          "x": 365,
          "y": 586
        },
        {
          "x": 363,
          "y": 589
        },
        {
          "x": 367,
          "y": 594
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvv07ph7_1f1",
      "x": 559,
      "y": 112,
      "w": 280,
      "h": 159,
      "polygon": [
        {
          "x": 561,
          "y": 136
        },
        {
          "x": 559,
          "y": 142
        },
        {
          "x": 559,
          "y": 146
        },
        {
          "x": 560,
          "y": 150
        },
        {
          "x": 559,
          "y": 271
        },
        {
          "x": 836,
          "y": 269
        },
        {
          "x": 836,
          "y": 148
        },
        {
          "x": 836,
          "y": 144
        },
        {
          "x": 836,
          "y": 137
        },
        {
          "x": 834,
          "y": 137
        },
        {
          "x": 839,
          "y": 117
        },
        {
          "x": 839,
          "y": 112
        },
        {
          "x": 568,
          "y": 113
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvv08kkc_hh8",
      "x": 824,
      "y": 196,
      "w": 77,
      "h": 121,
      "polygon": [
        {
          "x": 824,
          "y": 272
        },
        {
          "x": 825,
          "y": 291
        },
        {
          "x": 845,
          "y": 297
        },
        {
          "x": 864,
          "y": 305
        },
        {
          "x": 881,
          "y": 312
        },
        {
          "x": 887,
          "y": 317
        },
        {
          "x": 893,
          "y": 317
        },
        {
          "x": 893,
          "y": 304
        },
        {
          "x": 901,
          "y": 308
        },
        {
          "x": 901,
          "y": 223
        },
        {
          "x": 837,
          "y": 196
        },
        {
          "x": 836,
          "y": 271
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvv0c87t_fcd",
      "x": 230,
      "y": 625,
      "w": 232,
      "h": 171,
      "polygon": [
        {
          "x": 239,
          "y": 747
        },
        {
          "x": 230,
          "y": 745
        },
        {
          "x": 230,
          "y": 625
        },
        {
          "x": 462,
          "y": 678
        },
        {
          "x": 462,
          "y": 797
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvv0ir5l_6bb",
      "x": 880,
      "y": 381,
      "w": 247,
      "h": 236,
      "polygon": [
        {
          "x": 900,
          "y": 604
        },
        {
          "x": 888,
          "y": 617
        },
        {
          "x": 882,
          "y": 612
        },
        {
          "x": 880,
          "y": 488
        },
        {
          "x": 995,
          "y": 384
        },
        {
          "x": 995,
          "y": 381
        },
        {
          "x": 1010,
          "y": 381
        },
        {
          "x": 1011,
          "y": 385
        },
        {
          "x": 1059,
          "y": 433
        },
        {
          "x": 1059,
          "y": 418
        },
        {
          "x": 1082,
          "y": 417
        },
        {
          "x": 1083,
          "y": 439
        },
        {
          "x": 1080,
          "y": 443
        },
        {
          "x": 1080,
          "y": 449
        },
        {
          "x": 1127,
          "y": 492
        },
        {
          "x": 1124,
          "y": 608
        },
        {
          "x": 1123,
          "y": 612
        },
        {
          "x": 1004,
          "y": 501
        },
        {
          "x": 999,
          "y": 503
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvv0osvc_syv",
      "x": 1177,
      "y": 400,
      "w": 269,
      "h": 163,
      "polygon": [
        {
          "x": 1184,
          "y": 563
        },
        {
          "x": 1177,
          "y": 560
        },
        {
          "x": 1178,
          "y": 440
        },
        {
          "x": 1177,
          "y": 429
        },
        {
          "x": 1180,
          "y": 425
        },
        {
          "x": 1187,
          "y": 401
        },
        {
          "x": 1443,
          "y": 400
        },
        {
          "x": 1442,
          "y": 424
        },
        {
          "x": 1445,
          "y": 424
        },
        {
          "x": 1444,
          "y": 436
        },
        {
          "x": 1443,
          "y": 563
        },
        {
          "x": 1195,
          "y": 560
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvv0siw5_8nn",
      "x": 1073,
      "y": -1,
      "w": 288,
      "h": 103,
      "polygon": [
        {
          "x": 1074,
          "y": 0
        },
        {
          "x": 1073,
          "y": 100
        },
        {
          "x": 1361,
          "y": 102
        },
        {
          "x": 1360,
          "y": -1
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvv0vr2g_b2u",
      "x": 861,
      "y": 1757,
      "w": 36,
      "h": 34,
      "polygon": [
        {
          "x": 861,
          "y": 1766
        },
        {
          "x": 862,
          "y": 1773
        },
        {
          "x": 863,
          "y": 1781
        },
        {
          "x": 864,
          "y": 1789
        },
        {
          "x": 877,
          "y": 1791
        },
        {
          "x": 885,
          "y": 1790
        },
        {
          "x": 892,
          "y": 1788
        },
        {
          "x": 894,
          "y": 1786
        },
        {
          "x": 896,
          "y": 1783
        },
        {
          "x": 896,
          "y": 1777
        },
        {
          "x": 897,
          "y": 1768
        },
        {
          "x": 895,
          "y": 1761
        },
        {
          "x": 889,
          "y": 1758
        },
        {
          "x": 879,
          "y": 1757
        },
        {
          "x": 872,
          "y": 1757
        },
        {
          "x": 867,
          "y": 1762
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvv0wyaa_8kx",
      "x": 884,
      "y": 1789,
      "w": 50,
      "h": 25,
      "polygon": [
        {
          "x": 900,
          "y": 1789
        },
        {
          "x": 890,
          "y": 1799
        },
        {
          "x": 887,
          "y": 1805
        },
        {
          "x": 884,
          "y": 1815
        },
        {
          "x": 911,
          "y": 1814
        },
        {
          "x": 923,
          "y": 1814
        },
        {
          "x": 934,
          "y": 1815
        },
        {
          "x": 923,
          "y": 1803
        },
        {
          "x": 916,
          "y": 1796
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvv16mla_ii5",
      "x": 1137,
      "y": 874,
      "w": 55,
      "h": 35,
      "polygon": [
        {
          "x": 1162,
          "y": 889
        },
        {
          "x": 1161,
          "y": 894
        },
        {
          "x": 1140,
          "y": 895
        },
        {
          "x": 1137,
          "y": 892
        },
        {
          "x": 1137,
          "y": 884
        },
        {
          "x": 1142,
          "y": 874
        },
        {
          "x": 1179,
          "y": 874
        },
        {
          "x": 1186,
          "y": 876
        },
        {
          "x": 1189,
          "y": 881
        },
        {
          "x": 1191,
          "y": 891
        },
        {
          "x": 1192,
          "y": 908
        },
        {
          "x": 1183,
          "y": 909
        },
        {
          "x": 1184,
          "y": 894
        },
        {
          "x": 1184,
          "y": 884
        },
        {
          "x": 1180,
          "y": 880
        },
        {
          "x": 1167,
          "y": 880
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvv19tnu_2n9",
      "x": 1043,
      "y": 1720,
      "w": 48,
      "h": 19,
      "polygon": [
        {
          "x": 1081,
          "y": 1739
        },
        {
          "x": 1091,
          "y": 1740
        },
        {
          "x": 1090,
          "y": 1728
        },
        {
          "x": 1085,
          "y": 1721
        },
        {
          "x": 1070,
          "y": 1720
        },
        {
          "x": 1058,
          "y": 1720
        },
        {
          "x": 1046,
          "y": 1720
        },
        {
          "x": 1043,
          "y": 1725
        },
        {
          "x": 1043,
          "y": 1729
        },
        {
          "x": 1043,
          "y": 1735
        },
        {
          "x": 1045,
          "y": 1738
        },
        {
          "x": 1060,
          "y": 1740
        },
        {
          "x": 1065,
          "y": 1735
        },
        {
          "x": 1067,
          "y": 1727
        },
        {
          "x": 1076,
          "y": 1727
        },
        {
          "x": 1083,
          "y": 1728
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvv1bhhw_6uq",
      "x": 946,
      "y": 1728,
      "w": 49,
      "h": 22,
      "polygon": [
        {
          "x": 969,
          "y": 1744
        },
        {
          "x": 971,
          "y": 1750
        },
        {
          "x": 991,
          "y": 1749
        },
        {
          "x": 995,
          "y": 1743
        },
        {
          "x": 995,
          "y": 1734
        },
        {
          "x": 990,
          "y": 1729
        },
        {
          "x": 974,
          "y": 1728
        },
        {
          "x": 969,
          "y": 1731
        },
        {
          "x": 955,
          "y": 1732
        },
        {
          "x": 949,
          "y": 1736
        },
        {
          "x": 947,
          "y": 1744
        },
        {
          "x": 946,
          "y": 1749
        },
        {
          "x": 954,
          "y": 1750
        },
        {
          "x": 953,
          "y": 1746
        },
        {
          "x": 955,
          "y": 1739
        },
        {
          "x": 960,
          "y": 1737
        },
        {
          "x": 966,
          "y": 1737
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvv1m4ex_lys",
      "x": 1442,
      "y": 245,
      "w": 62,
      "h": 49,
      "polygon": [
        {
          "x": 1442,
          "y": 294
        },
        {
          "x": 1451,
          "y": 293
        },
        {
          "x": 1451,
          "y": 273
        },
        {
          "x": 1454,
          "y": 264
        },
        {
          "x": 1459,
          "y": 258
        },
        {
          "x": 1464,
          "y": 256
        },
        {
          "x": 1479,
          "y": 257
        },
        {
          "x": 1481,
          "y": 263
        },
        {
          "x": 1483,
          "y": 267
        },
        {
          "x": 1499,
          "y": 267
        },
        {
          "x": 1505,
          "y": 257
        },
        {
          "x": 1504,
          "y": 252
        },
        {
          "x": 1502,
          "y": 245
        },
        {
          "x": 1481,
          "y": 246
        },
        {
          "x": 1479,
          "y": 250
        },
        {
          "x": 1461,
          "y": 250
        },
        {
          "x": 1454,
          "y": 253
        },
        {
          "x": 1449,
          "y": 261
        },
        {
          "x": 1445,
          "y": 268
        },
        {
          "x": 1444,
          "y": 280
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvv1nrys_pa1",
      "x": 1483,
      "y": 18,
      "w": 36,
      "h": 28,
      "polygon": [
        {
          "x": 1495,
          "y": 30
        },
        {
          "x": 1499,
          "y": 36
        },
        {
          "x": 1514,
          "y": 36
        },
        {
          "x": 1519,
          "y": 31
        },
        {
          "x": 1518,
          "y": 20
        },
        {
          "x": 1513,
          "y": 18
        },
        {
          "x": 1494,
          "y": 18
        },
        {
          "x": 1490,
          "y": 21
        },
        {
          "x": 1485,
          "y": 25
        },
        {
          "x": 1484,
          "y": 31
        },
        {
          "x": 1483,
          "y": 46
        },
        {
          "x": 1490,
          "y": 46
        },
        {
          "x": 1488,
          "y": 37
        },
        {
          "x": 1489,
          "y": 28
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvv1qx1z_c2i",
      "x": 1673,
      "y": 1858,
      "w": 154,
      "h": 69,
      "polygon": [
        {
          "x": 1673,
          "y": 1878
        },
        {
          "x": 1673,
          "y": 1924
        },
        {
          "x": 1826,
          "y": 1927
        },
        {
          "x": 1825,
          "y": 1892
        },
        {
          "x": 1822,
          "y": 1890
        },
        {
          "x": 1820,
          "y": 1868
        },
        {
          "x": 1813,
          "y": 1866
        },
        {
          "x": 1809,
          "y": 1866
        },
        {
          "x": 1807,
          "y": 1871
        },
        {
          "x": 1804,
          "y": 1869
        },
        {
          "x": 1794,
          "y": 1869
        },
        {
          "x": 1790,
          "y": 1869
        },
        {
          "x": 1788,
          "y": 1863
        },
        {
          "x": 1784,
          "y": 1861
        },
        {
          "x": 1779,
          "y": 1860
        },
        {
          "x": 1775,
          "y": 1861
        },
        {
          "x": 1773,
          "y": 1865
        },
        {
          "x": 1774,
          "y": 1873
        },
        {
          "x": 1773,
          "y": 1887
        },
        {
          "x": 1769,
          "y": 1878
        },
        {
          "x": 1769,
          "y": 1870
        },
        {
          "x": 1767,
          "y": 1864
        },
        {
          "x": 1761,
          "y": 1863
        },
        {
          "x": 1753,
          "y": 1862
        },
        {
          "x": 1748,
          "y": 1865
        },
        {
          "x": 1745,
          "y": 1871
        },
        {
          "x": 1743,
          "y": 1871
        },
        {
          "x": 1739,
          "y": 1868
        },
        {
          "x": 1733,
          "y": 1868
        },
        {
          "x": 1728,
          "y": 1872
        },
        {
          "x": 1727,
          "y": 1874
        },
        {
          "x": 1724,
          "y": 1870
        },
        {
          "x": 1721,
          "y": 1868
        },
        {
          "x": 1719,
          "y": 1870
        },
        {
          "x": 1719,
          "y": 1862
        },
        {
          "x": 1711,
          "y": 1862
        },
        {
          "x": 1705,
          "y": 1861
        },
        {
          "x": 1703,
          "y": 1858
        },
        {
          "x": 1695,
          "y": 1858
        },
        {
          "x": 1682,
          "y": 1858
        },
        {
          "x": 1680,
          "y": 1863
        },
        {
          "x": 1680,
          "y": 1872
        },
        {
          "x": 1681,
          "y": 1876
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    }
  ],
  "triggerZones": [
    {
      "id": "trigger_d9lp",
      "x": 1744,
      "y": 272,
      "w": 160,
      "h": 96,
      "label": "TRIGGER",
      "ai_instruction": "Aqui será a Van",
      "collisionType": "trigger",
      "isTrigger": true
    }
  ],
  "animationMarkers": [],
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
          "itemsCount": 127,
          "items": [
            {
              "type": "obstacle",
              "zIndex": 0,
              "x": 0,
              "y": 2032,
              "rotation": 0,
              "w": 2048,
              "h": 16,
              "label": "LIMITE SUL"
            },
            {
              "type": "obstacle",
              "zIndex": 1,
              "x": 2038,
              "y": 0,
              "rotation": 0,
              "w": 10,
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
              "x": 240,
              "y": 720,
              "rotation": 0,
              "w": 216,
              "h": 168,
              "label": "CABANA OESTE"
            },
            {
              "type": "obstacle",
              "zIndex": 4,
              "x": 496,
              "y": 1744,
              "rotation": 0,
              "w": 276,
              "h": 240,
              "label": "CASA SUDOESTE 2"
            },
            {
              "type": "obstacle",
              "zIndex": 5,
              "x": 1184,
              "y": 496,
              "rotation": 0,
              "w": 240,
              "h": 186,
              "label": "CASA CENTRO"
            },
            {
              "type": "obstacle",
              "zIndex": 6,
              "x": 1152,
              "y": 1280,
              "rotation": 0,
              "w": 260,
              "h": 226,
              "label": "CASA CENTRAL GRANDE"
            },
            {
              "type": "obstacle",
              "zIndex": 7,
              "x": 1120,
              "y": 1792,
              "rotation": 0,
              "w": 272,
              "h": 186,
              "label": "CASA SUL"
            },
            {
              "type": "obstacle",
              "zIndex": 8,
              "x": 1920,
              "y": 1520,
              "rotation": 0,
              "w": 132,
              "h": 360,
              "label": "EDIFÍCIO SUDESTE"
            },
            {
              "type": "obstacle",
              "zIndex": 9,
              "x": 1690,
              "y": 680,
              "rotation": 0,
              "w": 270,
              "h": 240,
              "label": "LAGO LESTE [NORTE]"
            },
            {
              "type": "obstacle",
              "zIndex": 10,
              "x": 1740,
              "y": 920,
              "rotation": 0,
              "w": 220,
              "h": 210,
              "label": "LAGO LESTE [SUL]"
            },
            {
              "type": "trash",
              "zIndex": 11,
              "x": 205,
              "y": 185,
              "rotation": 0.12,
              "id": "map1_trash_01",
              "typeIndex": 0
            },
            {
              "type": "trash",
              "zIndex": 12,
              "x": 265,
              "y": 345,
              "rotation": -0.18,
              "id": "map1_trash_02",
              "typeIndex": 1
            },
            {
              "type": "trash",
              "zIndex": 13,
              "x": 560,
              "y": 470,
              "rotation": 0.1,
              "id": "map1_trash_03",
              "typeIndex": 2
            },
            {
              "type": "trash",
              "zIndex": 14,
              "x": 560,
              "y": 720,
              "rotation": -0.15,
              "id": "map1_trash_04",
              "typeIndex": 3
            },
            {
              "type": "trash",
              "zIndex": 15,
              "x": 540,
              "y": 980,
              "rotation": 0.2,
              "id": "map1_trash_05",
              "typeIndex": 4
            },
            {
              "type": "trash",
              "zIndex": 16,
              "x": 385,
              "y": 1125,
              "rotation": -0.12,
              "id": "map1_trash_06",
              "typeIndex": 0
            },
            {
              "type": "trash",
              "zIndex": 17,
              "x": 530,
              "y": 1265,
              "rotation": 0.16,
              "id": "map1_trash_07",
              "typeIndex": 1
            },
            {
              "type": "trash",
              "zIndex": 18,
              "x": 395,
              "y": 1500,
              "rotation": -0.22,
              "id": "map1_trash_08",
              "typeIndex": 2
            },
            {
              "type": "trash",
              "zIndex": 19,
              "x": 880,
              "y": 1520,
              "rotation": 0.14,
              "id": "map1_trash_09",
              "typeIndex": 3
            },
            {
              "type": "trash",
              "zIndex": 20,
              "x": 880,
              "y": 1680,
              "rotation": -0.1,
              "id": "map1_trash_10",
              "typeIndex": 4
            },
            {
              "type": "trash",
              "zIndex": 21,
              "x": 1030,
              "y": 1040,
              "rotation": 0.18,
              "id": "map1_trash_11",
              "typeIndex": 0
            },
            {
              "type": "trash",
              "zIndex": 22,
              "x": 1250,
              "y": 920,
              "rotation": -0.16,
              "id": "map1_trash_12",
              "typeIndex": 1
            },
            {
              "type": "trash",
              "zIndex": 23,
              "x": 1580,
              "y": 920,
              "rotation": 0.11,
              "id": "map1_trash_13",
              "typeIndex": 2
            },
            {
              "type": "trash",
              "zIndex": 24,
              "x": 1540,
              "y": 1280,
              "rotation": -0.19,
              "id": "map1_trash_14",
              "typeIndex": 3
            },
            {
              "type": "trash",
              "zIndex": 25,
              "x": 1560,
              "y": 540,
              "rotation": 0.21,
              "id": "map1_trash_15",
              "typeIndex": 4
            },
            {
              "type": "trash",
              "zIndex": 26,
              "x": 1584,
              "y": 240,
              "rotation": -0.14,
              "id": "map1_trash_16",
              "typeIndex": 0
            },
            {
              "type": "obstacle",
              "zIndex": 27,
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
              "zIndex": 28,
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
              "zIndex": 29,
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
              "zIndex": 30,
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
              "zIndex": 31,
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
              "zIndex": 32,
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
              "zIndex": 33,
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
              "zIndex": 34,
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
              "zIndex": 35,
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
              "zIndex": 36,
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
              "zIndex": 37,
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
              "zIndex": 38,
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
              "zIndex": 39,
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
              "zIndex": 40,
              "x": 0,
              "y": 528,
              "rotation": 0,
              "w": 10,
              "h": 1504,
              "label": "COLISÃO",
              "id": "map1_obs_nvrl_57"
            },
            {
              "type": "obstacle",
              "zIndex": 41,
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
              "zIndex": 42,
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
              "zIndex": 43,
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
              "zIndex": 44,
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
              "zIndex": 45,
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
              "zIndex": 46,
              "x": 480,
              "y": 0,
              "rotation": 0,
              "w": 592,
              "h": 10,
              "label": "COLISÃO",
              "id": "map1_obs_s8na_64"
            },
            {
              "type": "obstacle",
              "zIndex": 47,
              "x": 1056,
              "y": 0,
              "rotation": 0,
              "w": 960,
              "h": 10,
              "label": "COLISÃO",
              "id": "map1_obs_scpa_65"
            },
            {
              "type": "obstacle",
              "zIndex": 48,
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
              "zIndex": 49,
              "x": 464,
              "y": 544,
              "rotation": 0,
              "id": "map1_trash_w1t6_67",
              "typeIndex": 0
            },
            {
              "type": "trash",
              "zIndex": 50,
              "x": 688,
              "y": 896,
              "rotation": 0,
              "id": "map1_trash_w3nm_68",
              "typeIndex": 0
            },
            {
              "type": "trash",
              "zIndex": 51,
              "x": 512,
              "y": 1072,
              "rotation": 0,
              "id": "map1_trash_wau3_69",
              "typeIndex": 0
            },
            {
              "type": "trash",
              "zIndex": 52,
              "x": 640,
              "y": 1120,
              "rotation": 0,
              "id": "map1_trash_wbf7_70",
              "typeIndex": 0
            },
            {
              "type": "trash",
              "zIndex": 53,
              "x": 656,
              "y": 672,
              "rotation": 0,
              "id": "map1_trash_wco4_71",
              "typeIndex": 0
            },
            {
              "type": "trash",
              "zIndex": 54,
              "x": 656,
              "y": 480,
              "rotation": 0,
              "id": "map1_trash_wsst_72",
              "typeIndex": 0
            },
            {
              "type": "obstacle",
              "zIndex": 55,
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
              "zIndex": 56,
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
              "zIndex": 57,
              "x": 54,
              "y": 1350,
              "rotation": 0,
              "w": 264,
              "h": 323,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvuz7cy6_7dq",
              "polygon": [
                {
                  "x": 153,
                  "y": 1350
                },
                {
                  "x": 54,
                  "y": 1466
                },
                {
                  "x": 60,
                  "y": 1634
                },
                {
                  "x": 69,
                  "y": 1644
                },
                {
                  "x": 161,
                  "y": 1538
                },
                {
                  "x": 315,
                  "y": 1673
                },
                {
                  "x": 318,
                  "y": 1665
                },
                {
                  "x": 317,
                  "y": 1482
                },
                {
                  "x": 170,
                  "y": 1350
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 58,
              "x": 319,
              "y": 1537,
              "rotation": 0,
              "w": 56,
              "h": 171,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvuz8mmf_0tr",
              "polygon": [
                {
                  "x": 332,
                  "y": 1537
                },
                {
                  "x": 327,
                  "y": 1541
                },
                {
                  "x": 332,
                  "y": 1573
                },
                {
                  "x": 324,
                  "y": 1577
                },
                {
                  "x": 329,
                  "y": 1595
                },
                {
                  "x": 323,
                  "y": 1592
                },
                {
                  "x": 321,
                  "y": 1593
                },
                {
                  "x": 319,
                  "y": 1620
                },
                {
                  "x": 334,
                  "y": 1615
                },
                {
                  "x": 346,
                  "y": 1647
                },
                {
                  "x": 341,
                  "y": 1660
                },
                {
                  "x": 359,
                  "y": 1708
                },
                {
                  "x": 375,
                  "y": 1691
                },
                {
                  "x": 374,
                  "y": 1679
                },
                {
                  "x": 358,
                  "y": 1633
                },
                {
                  "x": 368,
                  "y": 1631
                },
                {
                  "x": 358,
                  "y": 1576
                },
                {
                  "x": 348,
                  "y": 1578
                },
                {
                  "x": 338,
                  "y": 1538
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 59,
              "x": 314,
              "y": 1656,
              "rotation": 0,
              "w": 140,
              "h": 190,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvuza5gq_i8y",
              "polygon": [
                {
                  "x": 423,
                  "y": 1656
                },
                {
                  "x": 398,
                  "y": 1679
                },
                {
                  "x": 392,
                  "y": 1675
                },
                {
                  "x": 314,
                  "y": 1753
                },
                {
                  "x": 314,
                  "y": 1762
                },
                {
                  "x": 317,
                  "y": 1762
                },
                {
                  "x": 316,
                  "y": 1773
                },
                {
                  "x": 329,
                  "y": 1779
                },
                {
                  "x": 331,
                  "y": 1784
                },
                {
                  "x": 351,
                  "y": 1797
                },
                {
                  "x": 355,
                  "y": 1799
                },
                {
                  "x": 333,
                  "y": 1834
                },
                {
                  "x": 335,
                  "y": 1842
                },
                {
                  "x": 338,
                  "y": 1846
                },
                {
                  "x": 347,
                  "y": 1846
                },
                {
                  "x": 350,
                  "y": 1841
                },
                {
                  "x": 368,
                  "y": 1813
                },
                {
                  "x": 388,
                  "y": 1823
                },
                {
                  "x": 390,
                  "y": 1823
                },
                {
                  "x": 440,
                  "y": 1761
                },
                {
                  "x": 443,
                  "y": 1765
                },
                {
                  "x": 446,
                  "y": 1765
                },
                {
                  "x": 450,
                  "y": 1765
                },
                {
                  "x": 453,
                  "y": 1765
                },
                {
                  "x": 454,
                  "y": 1753
                },
                {
                  "x": 451,
                  "y": 1745
                },
                {
                  "x": 451,
                  "y": 1740
                },
                {
                  "x": 449,
                  "y": 1737
                },
                {
                  "x": 451,
                  "y": 1731
                },
                {
                  "x": 450,
                  "y": 1726
                },
                {
                  "x": 413,
                  "y": 1708
                },
                {
                  "x": 406,
                  "y": 1700
                },
                {
                  "x": 426,
                  "y": 1687
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 60,
              "x": 479,
              "y": 1630,
              "rotation": 0,
              "w": 298,
              "h": 249,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvuzb04c_x4h",
              "polygon": [
                {
                  "x": 479,
                  "y": 1712
                },
                {
                  "x": 480,
                  "y": 1878
                },
                {
                  "x": 614,
                  "y": 1790
                },
                {
                  "x": 629,
                  "y": 1790
                },
                {
                  "x": 775,
                  "y": 1879
                },
                {
                  "x": 777,
                  "y": 1712
                },
                {
                  "x": 631,
                  "y": 1630
                },
                {
                  "x": 615,
                  "y": 1630
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 61,
              "x": 1109,
              "y": 1877,
              "rotation": 0,
              "w": 22,
              "h": 119,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvuzbirv_pen",
              "polygon": [
                {
                  "x": 1109,
                  "y": 1891
                },
                {
                  "x": 1110,
                  "y": 1997
                },
                {
                  "x": 1131,
                  "y": 1995
                },
                {
                  "x": 1132,
                  "y": 1877
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 62,
              "x": 1105,
              "y": 1694,
              "rotation": 0,
              "w": 294,
              "h": 256,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvuzdug1_xx7",
              "polygon": [
                {
                  "x": 1105,
                  "y": 1765
                },
                {
                  "x": 1105,
                  "y": 1891
                },
                {
                  "x": 1127,
                  "y": 1880
                },
                {
                  "x": 1130,
                  "y": 1870
                },
                {
                  "x": 1240,
                  "y": 1865
                },
                {
                  "x": 1276,
                  "y": 1865
                },
                {
                  "x": 1277,
                  "y": 1863
                },
                {
                  "x": 1287,
                  "y": 1863
                },
                {
                  "x": 1287,
                  "y": 1867
                },
                {
                  "x": 1399,
                  "y": 1951
                },
                {
                  "x": 1399,
                  "y": 1784
                },
                {
                  "x": 1289,
                  "y": 1709
                },
                {
                  "x": 1286,
                  "y": 1703
                },
                {
                  "x": 1276,
                  "y": 1703
                },
                {
                  "x": 1275,
                  "y": 1694
                },
                {
                  "x": 1239,
                  "y": 1694
                },
                {
                  "x": 1240,
                  "y": 1715
                },
                {
                  "x": 1134,
                  "y": 1714
                },
                {
                  "x": 1134,
                  "y": 1754
                },
                {
                  "x": 1115,
                  "y": 1754
                },
                {
                  "x": 1113,
                  "y": 1765
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 63,
              "x": 1134,
              "y": 1153,
              "rotation": 0,
              "w": 289,
              "h": 240,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvuzknsm_nbb",
              "polygon": [
                {
                  "x": 1152,
                  "y": 1386
                },
                {
                  "x": 1138,
                  "y": 1394
                },
                {
                  "x": 1134,
                  "y": 1389
                },
                {
                  "x": 1134,
                  "y": 1232
                },
                {
                  "x": 1276,
                  "y": 1153
                },
                {
                  "x": 1286,
                  "y": 1153
                },
                {
                  "x": 1422,
                  "y": 1229
                },
                {
                  "x": 1419,
                  "y": 1393
                },
                {
                  "x": 1287,
                  "y": 1299
                },
                {
                  "x": 1271,
                  "y": 1299
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 64,
              "x": 1099,
              "y": 1323,
              "rotation": 0,
              "w": 120,
              "h": 201,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvuzoc4r_cvg",
              "polygon": [
                {
                  "x": 1099,
                  "y": 1323
                },
                {
                  "x": 1099,
                  "y": 1375
                },
                {
                  "x": 1101,
                  "y": 1380
                },
                {
                  "x": 1099,
                  "y": 1490
                },
                {
                  "x": 1103,
                  "y": 1490
                },
                {
                  "x": 1113,
                  "y": 1488
                },
                {
                  "x": 1113,
                  "y": 1524
                },
                {
                  "x": 1219,
                  "y": 1524
                },
                {
                  "x": 1217,
                  "y": 1489
                },
                {
                  "x": 1143,
                  "y": 1488
                },
                {
                  "x": 1142,
                  "y": 1390
                },
                {
                  "x": 1140,
                  "y": 1324
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 65,
              "x": 1336,
              "y": 1439,
              "rotation": 0,
              "w": 216,
              "h": 86,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvuzpaat_qnd",
              "polygon": [
                {
                  "x": 1413,
                  "y": 1455
                },
                {
                  "x": 1420,
                  "y": 1455
                },
                {
                  "x": 1427,
                  "y": 1449
                },
                {
                  "x": 1433,
                  "y": 1445
                },
                {
                  "x": 1441,
                  "y": 1444
                },
                {
                  "x": 1450,
                  "y": 1447
                },
                {
                  "x": 1459,
                  "y": 1450
                },
                {
                  "x": 1461,
                  "y": 1457
                },
                {
                  "x": 1491,
                  "y": 1458
                },
                {
                  "x": 1493,
                  "y": 1440
                },
                {
                  "x": 1538,
                  "y": 1439
                },
                {
                  "x": 1541,
                  "y": 1440
                },
                {
                  "x": 1545,
                  "y": 1442
                },
                {
                  "x": 1547,
                  "y": 1446
                },
                {
                  "x": 1551,
                  "y": 1452
                },
                {
                  "x": 1552,
                  "y": 1524
                },
                {
                  "x": 1336,
                  "y": 1523
                },
                {
                  "x": 1336,
                  "y": 1492
                },
                {
                  "x": 1413,
                  "y": 1491
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 66,
              "x": 1218,
              "y": 1489,
              "rotation": 0,
              "w": 10,
              "h": 32,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvuzpu8l_dil",
              "polygon": [
                {
                  "x": 1219,
                  "y": 1521
                },
                {
                  "x": 1227,
                  "y": 1520
                },
                {
                  "x": 1228,
                  "y": 1491
                },
                {
                  "x": 1218,
                  "y": 1489
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 67,
              "x": 1326,
              "y": 1490,
              "rotation": 0,
              "w": 10,
              "h": 32,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvuzpzn9_2lm",
              "polygon": [
                {
                  "x": 1336,
                  "y": 1522
                },
                {
                  "x": 1327,
                  "y": 1522
                },
                {
                  "x": 1326,
                  "y": 1491
                },
                {
                  "x": 1336,
                  "y": 1490
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 68,
              "x": 1434,
              "y": 1573,
              "rotation": 0,
              "w": 36,
              "h": 33,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvuzqism_ndd",
              "polygon": [
                {
                  "x": 1434,
                  "y": 1574
                },
                {
                  "x": 1435,
                  "y": 1599
                },
                {
                  "x": 1441,
                  "y": 1605
                },
                {
                  "x": 1460,
                  "y": 1606
                },
                {
                  "x": 1470,
                  "y": 1599
                },
                {
                  "x": 1469,
                  "y": 1573
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 69,
              "x": 1433,
              "y": 1542,
              "rotation": 0,
              "w": 36,
              "h": 39,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvuzr2wm_pp6",
              "polygon": [
                {
                  "x": 1433,
                  "y": 1553
                },
                {
                  "x": 1433,
                  "y": 1571
                },
                {
                  "x": 1435,
                  "y": 1580
                },
                {
                  "x": 1444,
                  "y": 1580
                },
                {
                  "x": 1459,
                  "y": 1581
                },
                {
                  "x": 1465,
                  "y": 1580
                },
                {
                  "x": 1469,
                  "y": 1578
                },
                {
                  "x": 1468,
                  "y": 1559
                },
                {
                  "x": 1469,
                  "y": 1552
                },
                {
                  "x": 1466,
                  "y": 1546
                },
                {
                  "x": 1460,
                  "y": 1543
                },
                {
                  "x": 1453,
                  "y": 1542
                },
                {
                  "x": 1447,
                  "y": 1542
                },
                {
                  "x": 1439,
                  "y": 1545
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 70,
              "x": 1410,
              "y": 1806,
              "rotation": 0,
              "w": 38,
              "h": 33,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvuzu1i2_zpl",
              "polygon": [
                {
                  "x": 1413,
                  "y": 1806
                },
                {
                  "x": 1413,
                  "y": 1809
                },
                {
                  "x": 1410,
                  "y": 1809
                },
                {
                  "x": 1411,
                  "y": 1815
                },
                {
                  "x": 1413,
                  "y": 1816
                },
                {
                  "x": 1412,
                  "y": 1826
                },
                {
                  "x": 1417,
                  "y": 1834
                },
                {
                  "x": 1425,
                  "y": 1838
                },
                {
                  "x": 1433,
                  "y": 1838
                },
                {
                  "x": 1442,
                  "y": 1833
                },
                {
                  "x": 1447,
                  "y": 1825
                },
                {
                  "x": 1445,
                  "y": 1817
                },
                {
                  "x": 1448,
                  "y": 1813
                },
                {
                  "x": 1447,
                  "y": 1811
                },
                {
                  "x": 1446,
                  "y": 1811
                },
                {
                  "x": 1446,
                  "y": 1808
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 71,
              "x": 1412,
              "y": 1776,
              "rotation": 0,
              "w": 35,
              "h": 36,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvuzufh6_8o4",
              "polygon": [
                {
                  "x": 1412,
                  "y": 1783
                },
                {
                  "x": 1414,
                  "y": 1794
                },
                {
                  "x": 1414,
                  "y": 1810
                },
                {
                  "x": 1446,
                  "y": 1812
                },
                {
                  "x": 1445,
                  "y": 1797
                },
                {
                  "x": 1447,
                  "y": 1789
                },
                {
                  "x": 1445,
                  "y": 1781
                },
                {
                  "x": 1439,
                  "y": 1777
                },
                {
                  "x": 1429,
                  "y": 1776
                },
                {
                  "x": 1421,
                  "y": 1776
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 72,
              "x": 271,
              "y": 291,
              "rotation": 0,
              "w": 45,
              "h": 49,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvuzvz4d_fnc",
              "polygon": [
                {
                  "x": 308,
                  "y": 340
                },
                {
                  "x": 316,
                  "y": 340
                },
                {
                  "x": 313,
                  "y": 331
                },
                {
                  "x": 314,
                  "y": 317
                },
                {
                  "x": 313,
                  "y": 306
                },
                {
                  "x": 311,
                  "y": 298
                },
                {
                  "x": 305,
                  "y": 295
                },
                {
                  "x": 304,
                  "y": 295
                },
                {
                  "x": 303,
                  "y": 293
                },
                {
                  "x": 299,
                  "y": 293
                },
                {
                  "x": 298,
                  "y": 293
                },
                {
                  "x": 294,
                  "y": 291
                },
                {
                  "x": 285,
                  "y": 291
                },
                {
                  "x": 277,
                  "y": 292
                },
                {
                  "x": 272,
                  "y": 292
                },
                {
                  "x": 271,
                  "y": 300
                },
                {
                  "x": 274,
                  "y": 301
                },
                {
                  "x": 274,
                  "y": 306
                },
                {
                  "x": 275,
                  "y": 308
                },
                {
                  "x": 288,
                  "y": 308
                },
                {
                  "x": 295,
                  "y": 308
                },
                {
                  "x": 296,
                  "y": 304
                },
                {
                  "x": 296,
                  "y": 302
                },
                {
                  "x": 299,
                  "y": 300
                },
                {
                  "x": 304,
                  "y": 302
                },
                {
                  "x": 304,
                  "y": 309
                },
                {
                  "x": 304,
                  "y": 316
                },
                {
                  "x": 306,
                  "y": 320
                },
                {
                  "x": 306,
                  "y": 332
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 73,
              "x": 568,
              "y": 752,
              "rotation": 0,
              "w": 64,
              "h": 39,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvuzx5am_lpg",
              "polygon": [
                {
                  "x": 603,
                  "y": 767
                },
                {
                  "x": 605,
                  "y": 774
                },
                {
                  "x": 627,
                  "y": 775
                },
                {
                  "x": 628,
                  "y": 770
                },
                {
                  "x": 629,
                  "y": 766
                },
                {
                  "x": 631,
                  "y": 766
                },
                {
                  "x": 631,
                  "y": 755
                },
                {
                  "x": 626,
                  "y": 752
                },
                {
                  "x": 602,
                  "y": 753
                },
                {
                  "x": 602,
                  "y": 756
                },
                {
                  "x": 591,
                  "y": 755
                },
                {
                  "x": 587,
                  "y": 756
                },
                {
                  "x": 581,
                  "y": 761
                },
                {
                  "x": 573,
                  "y": 770
                },
                {
                  "x": 570,
                  "y": 776
                },
                {
                  "x": 568,
                  "y": 786
                },
                {
                  "x": 568,
                  "y": 792
                },
                {
                  "x": 576,
                  "y": 792
                },
                {
                  "x": 576,
                  "y": 781
                },
                {
                  "x": 577,
                  "y": 776
                },
                {
                  "x": 582,
                  "y": 769
                },
                {
                  "x": 586,
                  "y": 763
                },
                {
                  "x": 591,
                  "y": 761
                },
                {
                  "x": 603,
                  "y": 761
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 74,
              "x": 560,
              "y": 787,
              "rotation": 0,
              "w": 18,
              "h": 128,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvuzy22w_19w",
              "polygon": [
                {
                  "x": 567,
                  "y": 789
                },
                {
                  "x": 578,
                  "y": 787
                },
                {
                  "x": 576,
                  "y": 815
                },
                {
                  "x": 576,
                  "y": 837
                },
                {
                  "x": 574,
                  "y": 885
                },
                {
                  "x": 577,
                  "y": 885
                },
                {
                  "x": 577,
                  "y": 906
                },
                {
                  "x": 577,
                  "y": 911
                },
                {
                  "x": 570,
                  "y": 916
                },
                {
                  "x": 563,
                  "y": 914
                },
                {
                  "x": 561,
                  "y": 911
                },
                {
                  "x": 560,
                  "y": 908
                },
                {
                  "x": 563,
                  "y": 908
                },
                {
                  "x": 562,
                  "y": 883
                },
                {
                  "x": 565,
                  "y": 882
                },
                {
                  "x": 564,
                  "y": 830
                },
                {
                  "x": 566,
                  "y": 827
                },
                {
                  "x": 566,
                  "y": 804
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 75,
              "x": 568,
              "y": 489,
              "rotation": 0,
              "w": 63,
              "h": 46,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvuzzl0x_gxo",
              "polygon": [
                {
                  "x": 568,
                  "y": 508
                },
                {
                  "x": 573,
                  "y": 513
                },
                {
                  "x": 593,
                  "y": 514
                },
                {
                  "x": 596,
                  "y": 507
                },
                {
                  "x": 598,
                  "y": 507
                },
                {
                  "x": 598,
                  "y": 499
                },
                {
                  "x": 616,
                  "y": 497
                },
                {
                  "x": 622,
                  "y": 503
                },
                {
                  "x": 623,
                  "y": 515
                },
                {
                  "x": 623,
                  "y": 535
                },
                {
                  "x": 632,
                  "y": 535
                },
                {
                  "x": 632,
                  "y": 520
                },
                {
                  "x": 629,
                  "y": 516
                },
                {
                  "x": 630,
                  "y": 508
                },
                {
                  "x": 628,
                  "y": 503
                },
                {
                  "x": 626,
                  "y": 495
                },
                {
                  "x": 620,
                  "y": 491
                },
                {
                  "x": 614,
                  "y": 489
                },
                {
                  "x": 600,
                  "y": 490
                },
                {
                  "x": 596,
                  "y": 492
                },
                {
                  "x": 593,
                  "y": 491
                },
                {
                  "x": 579,
                  "y": 491
                },
                {
                  "x": 574,
                  "y": 493
                },
                {
                  "x": 571,
                  "y": 500
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 76,
              "x": 619,
              "y": 530,
              "rotation": 0,
              "w": 18,
              "h": 107,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv00s4i_e1c",
              "polygon": [
                {
                  "x": 631,
                  "y": 530
                },
                {
                  "x": 623,
                  "y": 531
                },
                {
                  "x": 623,
                  "y": 606
                },
                {
                  "x": 620,
                  "y": 605
                },
                {
                  "x": 621,
                  "y": 627
                },
                {
                  "x": 620,
                  "y": 628
                },
                {
                  "x": 619,
                  "y": 633
                },
                {
                  "x": 625,
                  "y": 637
                },
                {
                  "x": 633,
                  "y": 637
                },
                {
                  "x": 638,
                  "y": 634
                },
                {
                  "x": 638,
                  "y": 630
                },
                {
                  "x": 636,
                  "y": 627
                },
                {
                  "x": 634,
                  "y": 627
                },
                {
                  "x": 635,
                  "y": 605
                },
                {
                  "x": 633,
                  "y": 604
                },
                {
                  "x": 633,
                  "y": 546
                },
                {
                  "x": 631,
                  "y": 544
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 77,
              "x": 292,
              "y": 533,
              "rotation": 0,
              "w": 77,
              "h": 61,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvv02kz9_91u",
              "polygon": [
                {
                  "x": 302,
                  "y": 592
                },
                {
                  "x": 295,
                  "y": 592
                },
                {
                  "x": 292,
                  "y": 590
                },
                {
                  "x": 300,
                  "y": 584
                },
                {
                  "x": 300,
                  "y": 579
                },
                {
                  "x": 296,
                  "y": 575
                },
                {
                  "x": 304,
                  "y": 572
                },
                {
                  "x": 311,
                  "y": 569
                },
                {
                  "x": 305,
                  "y": 563
                },
                {
                  "x": 297,
                  "y": 558
                },
                {
                  "x": 305,
                  "y": 555
                },
                {
                  "x": 309,
                  "y": 555
                },
                {
                  "x": 309,
                  "y": 547
                },
                {
                  "x": 312,
                  "y": 543
                },
                {
                  "x": 317,
                  "y": 547
                },
                {
                  "x": 319,
                  "y": 542
                },
                {
                  "x": 320,
                  "y": 541
                },
                {
                  "x": 325,
                  "y": 547
                },
                {
                  "x": 328,
                  "y": 533
                },
                {
                  "x": 332,
                  "y": 533
                },
                {
                  "x": 336,
                  "y": 543
                },
                {
                  "x": 337,
                  "y": 551
                },
                {
                  "x": 345,
                  "y": 545
                },
                {
                  "x": 347,
                  "y": 542
                },
                {
                  "x": 352,
                  "y": 542
                },
                {
                  "x": 353,
                  "y": 544
                },
                {
                  "x": 349,
                  "y": 545
                },
                {
                  "x": 349,
                  "y": 549
                },
                {
                  "x": 352,
                  "y": 549
                },
                {
                  "x": 352,
                  "y": 556
                },
                {
                  "x": 365,
                  "y": 555
                },
                {
                  "x": 365,
                  "y": 559
                },
                {
                  "x": 362,
                  "y": 563
                },
                {
                  "x": 358,
                  "y": 564
                },
                {
                  "x": 359,
                  "y": 567
                },
                {
                  "x": 364,
                  "y": 569
                },
                {
                  "x": 368,
                  "y": 570
                },
                {
                  "x": 369,
                  "y": 574
                },
                {
                  "x": 365,
                  "y": 576
                },
                {
                  "x": 367,
                  "y": 578
                },
                {
                  "x": 369,
                  "y": 584
                },
                {
                  "x": 365,
                  "y": 586
                },
                {
                  "x": 363,
                  "y": 589
                },
                {
                  "x": 367,
                  "y": 594
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 78,
              "x": 294,
              "y": 588,
              "rotation": 0,
              "w": 79,
              "h": 44,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv03lf2_gth",
              "polygon": [
                {
                  "x": 317,
                  "y": 622
                },
                {
                  "x": 308,
                  "y": 627
                },
                {
                  "x": 307,
                  "y": 619
                },
                {
                  "x": 311,
                  "y": 617
                },
                {
                  "x": 302,
                  "y": 614
                },
                {
                  "x": 296,
                  "y": 611
                },
                {
                  "x": 297,
                  "y": 605
                },
                {
                  "x": 302,
                  "y": 602
                },
                {
                  "x": 304,
                  "y": 597
                },
                {
                  "x": 302,
                  "y": 594
                },
                {
                  "x": 295,
                  "y": 593
                },
                {
                  "x": 294,
                  "y": 588
                },
                {
                  "x": 365,
                  "y": 589
                },
                {
                  "x": 367,
                  "y": 591
                },
                {
                  "x": 368,
                  "y": 594
                },
                {
                  "x": 365,
                  "y": 595
                },
                {
                  "x": 369,
                  "y": 598
                },
                {
                  "x": 372,
                  "y": 600
                },
                {
                  "x": 372,
                  "y": 607
                },
                {
                  "x": 370,
                  "y": 608
                },
                {
                  "x": 366,
                  "y": 612
                },
                {
                  "x": 367,
                  "y": 616
                },
                {
                  "x": 367,
                  "y": 622
                },
                {
                  "x": 357,
                  "y": 621
                },
                {
                  "x": 353,
                  "y": 626
                },
                {
                  "x": 354,
                  "y": 629
                },
                {
                  "x": 347,
                  "y": 630
                },
                {
                  "x": 340,
                  "y": 630
                },
                {
                  "x": 334,
                  "y": 631
                },
                {
                  "x": 328,
                  "y": 633
                },
                {
                  "x": 322,
                  "y": 631
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 79,
              "x": 3,
              "y": 301,
              "rotation": 0,
              "w": 122,
              "h": 259,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv04u9b_vfi",
              "polygon": [
                {
                  "x": 48,
                  "y": 560
                },
                {
                  "x": 32,
                  "y": 553
                },
                {
                  "x": 13,
                  "y": 540
                },
                {
                  "x": 3,
                  "y": 533
                },
                {
                  "x": 4,
                  "y": 301
                },
                {
                  "x": 16,
                  "y": 301
                },
                {
                  "x": 18,
                  "y": 326
                },
                {
                  "x": 112,
                  "y": 418
                },
                {
                  "x": 112,
                  "y": 435
                },
                {
                  "x": 125,
                  "y": 435
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 80,
              "x": 400,
              "y": 137,
              "rotation": 0,
              "w": 36,
              "h": 70,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv058o8_p2k",
              "polygon": [
                {
                  "x": 436,
                  "y": 193
                },
                {
                  "x": 407,
                  "y": 207
                },
                {
                  "x": 400,
                  "y": 140
                },
                {
                  "x": 410,
                  "y": 137
                },
                {
                  "x": 420,
                  "y": 137
                },
                {
                  "x": 428,
                  "y": 137
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 81,
              "x": 433,
              "y": 173,
              "rotation": 0,
              "w": 21,
              "h": 24,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv05day_65s",
              "polygon": [
                {
                  "x": 452,
                  "y": 173
                },
                {
                  "x": 436,
                  "y": 187
                },
                {
                  "x": 433,
                  "y": 197
                },
                {
                  "x": 449,
                  "y": 192
                },
                {
                  "x": 454,
                  "y": 187
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 82,
              "x": 462,
              "y": 112,
              "rotation": 0,
              "w": 13,
              "h": 41,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv05jq3_865",
              "polygon": [
                {
                  "x": 466,
                  "y": 112
                },
                {
                  "x": 475,
                  "y": 119
                },
                {
                  "x": 474,
                  "y": 128
                },
                {
                  "x": 473,
                  "y": 138
                },
                {
                  "x": 468,
                  "y": 152
                },
                {
                  "x": 462,
                  "y": 153
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 83,
              "x": 462,
              "y": -7,
              "rotation": 0,
              "w": 18,
              "h": 24,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv05z35_bs7",
              "polygon": [
                {
                  "x": 462,
                  "y": 17
                },
                {
                  "x": 462,
                  "y": -7
                },
                {
                  "x": 480,
                  "y": -4
                },
                {
                  "x": 480,
                  "y": 13
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 84,
              "x": 559,
              "y": 112,
              "rotation": 0,
              "w": 280,
              "h": 159,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvv07ph7_1f1",
              "polygon": [
                {
                  "x": 561,
                  "y": 136
                },
                {
                  "x": 559,
                  "y": 142
                },
                {
                  "x": 559,
                  "y": 146
                },
                {
                  "x": 560,
                  "y": 150
                },
                {
                  "x": 559,
                  "y": 271
                },
                {
                  "x": 836,
                  "y": 269
                },
                {
                  "x": 836,
                  "y": 148
                },
                {
                  "x": 836,
                  "y": 144
                },
                {
                  "x": 836,
                  "y": 137
                },
                {
                  "x": 834,
                  "y": 137
                },
                {
                  "x": 839,
                  "y": 117
                },
                {
                  "x": 839,
                  "y": 112
                },
                {
                  "x": 568,
                  "y": 113
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 85,
              "x": 824,
              "y": 196,
              "rotation": 0,
              "w": 77,
              "h": 121,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvv08kkc_hh8",
              "polygon": [
                {
                  "x": 824,
                  "y": 272
                },
                {
                  "x": 825,
                  "y": 291
                },
                {
                  "x": 845,
                  "y": 297
                },
                {
                  "x": 864,
                  "y": 305
                },
                {
                  "x": 881,
                  "y": 312
                },
                {
                  "x": 887,
                  "y": 317
                },
                {
                  "x": 893,
                  "y": 317
                },
                {
                  "x": 893,
                  "y": 304
                },
                {
                  "x": 901,
                  "y": 308
                },
                {
                  "x": 901,
                  "y": 223
                },
                {
                  "x": 837,
                  "y": 196
                },
                {
                  "x": 836,
                  "y": 271
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 86,
              "x": 230,
              "y": 625,
              "rotation": 0,
              "w": 232,
              "h": 171,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvv0c87t_fcd",
              "polygon": [
                {
                  "x": 239,
                  "y": 747
                },
                {
                  "x": 230,
                  "y": 745
                },
                {
                  "x": 230,
                  "y": 625
                },
                {
                  "x": 462,
                  "y": 678
                },
                {
                  "x": 462,
                  "y": 797
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 87,
              "x": 226,
              "y": 873,
              "rotation": 0,
              "w": 79,
              "h": 83,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv0d6te_byl",
              "polygon": [
                {
                  "x": 242,
                  "y": 887
                },
                {
                  "x": 243,
                  "y": 899
                },
                {
                  "x": 246,
                  "y": 902
                },
                {
                  "x": 241,
                  "y": 905
                },
                {
                  "x": 233,
                  "y": 908
                },
                {
                  "x": 227,
                  "y": 918
                },
                {
                  "x": 226,
                  "y": 929
                },
                {
                  "x": 227,
                  "y": 941
                },
                {
                  "x": 234,
                  "y": 949
                },
                {
                  "x": 241,
                  "y": 956
                },
                {
                  "x": 251,
                  "y": 956
                },
                {
                  "x": 263,
                  "y": 953
                },
                {
                  "x": 269,
                  "y": 944
                },
                {
                  "x": 272,
                  "y": 934
                },
                {
                  "x": 270,
                  "y": 922
                },
                {
                  "x": 264,
                  "y": 913
                },
                {
                  "x": 260,
                  "y": 910
                },
                {
                  "x": 302,
                  "y": 912
                },
                {
                  "x": 302,
                  "y": 902
                },
                {
                  "x": 305,
                  "y": 901
                },
                {
                  "x": 304,
                  "y": 896
                },
                {
                  "x": 301,
                  "y": 890
                },
                {
                  "x": 300,
                  "y": 885
                },
                {
                  "x": 297,
                  "y": 880
                },
                {
                  "x": 292,
                  "y": 877
                },
                {
                  "x": 282,
                  "y": 875
                },
                {
                  "x": 279,
                  "y": 877
                },
                {
                  "x": 278,
                  "y": 880
                },
                {
                  "x": 274,
                  "y": 884
                },
                {
                  "x": 272,
                  "y": 882
                },
                {
                  "x": 267,
                  "y": 873
                },
                {
                  "x": 264,
                  "y": 873
                },
                {
                  "x": 255,
                  "y": 877
                },
                {
                  "x": 249,
                  "y": 880
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 88,
              "x": 385,
              "y": 870,
              "rotation": 0,
              "w": 58,
              "h": 43,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv0dlq2_cer",
              "polygon": [
                {
                  "x": 388,
                  "y": 890
                },
                {
                  "x": 387,
                  "y": 895
                },
                {
                  "x": 385,
                  "y": 899
                },
                {
                  "x": 387,
                  "y": 906
                },
                {
                  "x": 387,
                  "y": 913
                },
                {
                  "x": 399,
                  "y": 913
                },
                {
                  "x": 425,
                  "y": 913
                },
                {
                  "x": 433,
                  "y": 908
                },
                {
                  "x": 436,
                  "y": 904
                },
                {
                  "x": 443,
                  "y": 895
                },
                {
                  "x": 443,
                  "y": 889
                },
                {
                  "x": 439,
                  "y": 880
                },
                {
                  "x": 426,
                  "y": 874
                },
                {
                  "x": 409,
                  "y": 871
                },
                {
                  "x": 402,
                  "y": 870
                },
                {
                  "x": 397,
                  "y": 872
                },
                {
                  "x": 393,
                  "y": 876
                },
                {
                  "x": 392,
                  "y": 880
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 89,
              "x": 394,
              "y": 921,
              "rotation": 0,
              "w": 34,
              "h": 36,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv0edib_b5t",
              "polygon": [
                {
                  "x": 402,
                  "y": 922
                },
                {
                  "x": 394,
                  "y": 927
                },
                {
                  "x": 394,
                  "y": 933
                },
                {
                  "x": 394,
                  "y": 941
                },
                {
                  "x": 397,
                  "y": 947
                },
                {
                  "x": 404,
                  "y": 956
                },
                {
                  "x": 417,
                  "y": 957
                },
                {
                  "x": 428,
                  "y": 951
                },
                {
                  "x": 428,
                  "y": 938
                },
                {
                  "x": 426,
                  "y": 926
                },
                {
                  "x": 423,
                  "y": 921
                },
                {
                  "x": 412,
                  "y": 921
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 90,
              "x": -4,
              "y": 781,
              "rotation": 0,
              "w": 157,
              "h": 422,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv0fgsc_jmn",
              "polygon": [
                {
                  "x": -4,
                  "y": 781
                },
                {
                  "x": 150,
                  "y": 784
                },
                {
                  "x": 150,
                  "y": 1009
                },
                {
                  "x": 148,
                  "y": 1010
                },
                {
                  "x": 147,
                  "y": 1127
                },
                {
                  "x": 153,
                  "y": 1129
                },
                {
                  "x": 152,
                  "y": 1175
                },
                {
                  "x": 138,
                  "y": 1175
                },
                {
                  "x": 128,
                  "y": 1177
                },
                {
                  "x": 118,
                  "y": 1177
                },
                {
                  "x": 93,
                  "y": 1175
                },
                {
                  "x": 84,
                  "y": 1175
                },
                {
                  "x": 86,
                  "y": 1182
                },
                {
                  "x": 86,
                  "y": 1188
                },
                {
                  "x": 76,
                  "y": 1193
                },
                {
                  "x": 54,
                  "y": 1199
                },
                {
                  "x": 33,
                  "y": 1202
                },
                {
                  "x": 20,
                  "y": 1203
                },
                {
                  "x": 15,
                  "y": 1201
                },
                {
                  "x": 11,
                  "y": 1198
                },
                {
                  "x": 1,
                  "y": 1201
                },
                {
                  "x": 1,
                  "y": 1175
                },
                {
                  "x": 2,
                  "y": 1160
                },
                {
                  "x": 2,
                  "y": 1150
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 91,
              "x": 891,
              "y": 505,
              "rotation": 0,
              "w": 230,
              "h": 247,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv0hctr_0u9",
              "polygon": [
                {
                  "x": 891,
                  "y": 750
                },
                {
                  "x": 891,
                  "y": 611
                },
                {
                  "x": 894,
                  "y": 505
                },
                {
                  "x": 1117,
                  "y": 506
                },
                {
                  "x": 1121,
                  "y": 752
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 92,
              "x": 880,
              "y": 381,
              "rotation": 0,
              "w": 247,
              "h": 236,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvv0ir5l_6bb",
              "polygon": [
                {
                  "x": 900,
                  "y": 604
                },
                {
                  "x": 888,
                  "y": 617
                },
                {
                  "x": 882,
                  "y": 612
                },
                {
                  "x": 880,
                  "y": 488
                },
                {
                  "x": 995,
                  "y": 384
                },
                {
                  "x": 995,
                  "y": 381
                },
                {
                  "x": 1010,
                  "y": 381
                },
                {
                  "x": 1011,
                  "y": 385
                },
                {
                  "x": 1059,
                  "y": 433
                },
                {
                  "x": 1059,
                  "y": 418
                },
                {
                  "x": 1082,
                  "y": 417
                },
                {
                  "x": 1083,
                  "y": 439
                },
                {
                  "x": 1080,
                  "y": 443
                },
                {
                  "x": 1080,
                  "y": 449
                },
                {
                  "x": 1127,
                  "y": 492
                },
                {
                  "x": 1124,
                  "y": 608
                },
                {
                  "x": 1123,
                  "y": 612
                },
                {
                  "x": 1004,
                  "y": 501
                },
                {
                  "x": 999,
                  "y": 503
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 93,
              "x": 1126,
              "y": 528,
              "rotation": 0,
              "w": 59,
              "h": 195,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv0jsoi_mww",
              "polygon": [
                {
                  "x": 1129,
                  "y": 533
                },
                {
                  "x": 1127,
                  "y": 661
                },
                {
                  "x": 1131,
                  "y": 662
                },
                {
                  "x": 1133,
                  "y": 668
                },
                {
                  "x": 1133,
                  "y": 674
                },
                {
                  "x": 1130,
                  "y": 676
                },
                {
                  "x": 1127,
                  "y": 685
                },
                {
                  "x": 1126,
                  "y": 693
                },
                {
                  "x": 1128,
                  "y": 700
                },
                {
                  "x": 1134,
                  "y": 707
                },
                {
                  "x": 1136,
                  "y": 713
                },
                {
                  "x": 1138,
                  "y": 721
                },
                {
                  "x": 1148,
                  "y": 721
                },
                {
                  "x": 1166,
                  "y": 723
                },
                {
                  "x": 1175,
                  "y": 719
                },
                {
                  "x": 1180,
                  "y": 715
                },
                {
                  "x": 1184,
                  "y": 708
                },
                {
                  "x": 1185,
                  "y": 698
                },
                {
                  "x": 1184,
                  "y": 693
                },
                {
                  "x": 1182,
                  "y": 691
                },
                {
                  "x": 1181,
                  "y": 682
                },
                {
                  "x": 1182,
                  "y": 675
                },
                {
                  "x": 1174,
                  "y": 673
                },
                {
                  "x": 1176,
                  "y": 666
                },
                {
                  "x": 1171,
                  "y": 665
                },
                {
                  "x": 1170,
                  "y": 658
                },
                {
                  "x": 1167,
                  "y": 658
                },
                {
                  "x": 1173,
                  "y": 655
                },
                {
                  "x": 1175,
                  "y": 653
                },
                {
                  "x": 1176,
                  "y": 643
                },
                {
                  "x": 1173,
                  "y": 528
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 94,
              "x": 752,
              "y": 807,
              "rotation": 0,
              "w": 210,
              "h": 78,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv0kma3_p0j",
              "polygon": [
                {
                  "x": 752,
                  "y": 807
                },
                {
                  "x": 798,
                  "y": 807
                },
                {
                  "x": 798,
                  "y": 861
                },
                {
                  "x": 963,
                  "y": 865
                },
                {
                  "x": 959,
                  "y": 885
                },
                {
                  "x": 752,
                  "y": 882
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 95,
              "x": 226,
              "y": 1064,
              "rotation": 0,
              "w": 115,
              "h": 174,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv0mlpz_zws",
              "polygon": [
                {
                  "x": 268,
                  "y": 1074
                },
                {
                  "x": 274,
                  "y": 1064
                },
                {
                  "x": 278,
                  "y": 1065
                },
                {
                  "x": 277,
                  "y": 1072
                },
                {
                  "x": 303,
                  "y": 1073
                },
                {
                  "x": 324,
                  "y": 1078
                },
                {
                  "x": 337,
                  "y": 1084
                },
                {
                  "x": 341,
                  "y": 1094
                },
                {
                  "x": 341,
                  "y": 1104
                },
                {
                  "x": 337,
                  "y": 1108
                },
                {
                  "x": 337,
                  "y": 1117
                },
                {
                  "x": 341,
                  "y": 1121
                },
                {
                  "x": 339,
                  "y": 1134
                },
                {
                  "x": 335,
                  "y": 1138
                },
                {
                  "x": 325,
                  "y": 1178
                },
                {
                  "x": 322,
                  "y": 1186
                },
                {
                  "x": 319,
                  "y": 1201
                },
                {
                  "x": 316,
                  "y": 1209
                },
                {
                  "x": 315,
                  "y": 1216
                },
                {
                  "x": 311,
                  "y": 1229
                },
                {
                  "x": 305,
                  "y": 1238
                },
                {
                  "x": 283,
                  "y": 1237
                },
                {
                  "x": 256,
                  "y": 1235
                },
                {
                  "x": 236,
                  "y": 1231
                },
                {
                  "x": 226,
                  "y": 1221
                },
                {
                  "x": 227,
                  "y": 1212
                },
                {
                  "x": 228,
                  "y": 1202
                },
                {
                  "x": 231,
                  "y": 1193
                },
                {
                  "x": 239,
                  "y": 1161
                },
                {
                  "x": 235,
                  "y": 1154
                },
                {
                  "x": 234,
                  "y": 1147
                },
                {
                  "x": 240,
                  "y": 1147
                },
                {
                  "x": 242,
                  "y": 1147
                },
                {
                  "x": 249,
                  "y": 1127
                },
                {
                  "x": 253,
                  "y": 1115
                },
                {
                  "x": 256,
                  "y": 1103
                },
                {
                  "x": 260,
                  "y": 1094
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 96,
              "x": 325,
              "y": 1142,
              "rotation": 0,
              "w": 19,
              "h": 44,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv0n87r_zb6",
              "polygon": [
                {
                  "x": 335,
                  "y": 1142
                },
                {
                  "x": 344,
                  "y": 1142
                },
                {
                  "x": 342,
                  "y": 1166
                },
                {
                  "x": 341,
                  "y": 1181
                },
                {
                  "x": 325,
                  "y": 1186
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 97,
              "x": 1177,
              "y": 400,
              "rotation": 0,
              "w": 269,
              "h": 163,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvv0osvc_syv",
              "polygon": [
                {
                  "x": 1184,
                  "y": 563
                },
                {
                  "x": 1177,
                  "y": 560
                },
                {
                  "x": 1178,
                  "y": 440
                },
                {
                  "x": 1177,
                  "y": 429
                },
                {
                  "x": 1180,
                  "y": 425
                },
                {
                  "x": 1187,
                  "y": 401
                },
                {
                  "x": 1443,
                  "y": 400
                },
                {
                  "x": 1442,
                  "y": 424
                },
                {
                  "x": 1445,
                  "y": 424
                },
                {
                  "x": 1444,
                  "y": 436
                },
                {
                  "x": 1443,
                  "y": 563
                },
                {
                  "x": 1195,
                  "y": 560
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 98,
              "x": 1072,
              "y": 89,
              "rotation": 0,
              "w": 290,
              "h": 206,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv0rwdo_r97",
              "polygon": [
                {
                  "x": 1077,
                  "y": 133
                },
                {
                  "x": 1076,
                  "y": 289
                },
                {
                  "x": 1175,
                  "y": 292
                },
                {
                  "x": 1182,
                  "y": 295
                },
                {
                  "x": 1185,
                  "y": 295
                },
                {
                  "x": 1185,
                  "y": 292
                },
                {
                  "x": 1230,
                  "y": 291
                },
                {
                  "x": 1233,
                  "y": 292
                },
                {
                  "x": 1237,
                  "y": 293
                },
                {
                  "x": 1358,
                  "y": 292
                },
                {
                  "x": 1357,
                  "y": 130
                },
                {
                  "x": 1360,
                  "y": 126
                },
                {
                  "x": 1361,
                  "y": 89
                },
                {
                  "x": 1072,
                  "y": 91
                },
                {
                  "x": 1072,
                  "y": 126
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 99,
              "x": 1073,
              "y": -1,
              "rotation": 0,
              "w": 288,
              "h": 103,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvv0siw5_8nn",
              "polygon": [
                {
                  "x": 1074,
                  "y": 0
                },
                {
                  "x": 1073,
                  "y": 100
                },
                {
                  "x": 1361,
                  "y": 102
                },
                {
                  "x": 1360,
                  "y": -1
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 100,
              "x": 1016,
              "y": 52,
              "rotation": 0,
              "w": 60,
              "h": 119,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv0t459_jsm",
              "polygon": [
                {
                  "x": 1072,
                  "y": 52
                },
                {
                  "x": 1016,
                  "y": 75
                },
                {
                  "x": 1017,
                  "y": 158
                },
                {
                  "x": 1018,
                  "y": 171
                },
                {
                  "x": 1076,
                  "y": 154
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 101,
              "x": 795,
              "y": 1861,
              "rotation": 0,
              "w": 45,
              "h": 46,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv0umfj_8bo",
              "polygon": [
                {
                  "x": 809,
                  "y": 1907
                },
                {
                  "x": 822,
                  "y": 1907
                },
                {
                  "x": 831,
                  "y": 1905
                },
                {
                  "x": 837,
                  "y": 1898
                },
                {
                  "x": 840,
                  "y": 1887
                },
                {
                  "x": 840,
                  "y": 1877
                },
                {
                  "x": 835,
                  "y": 1867
                },
                {
                  "x": 824,
                  "y": 1862
                },
                {
                  "x": 814,
                  "y": 1861
                },
                {
                  "x": 803,
                  "y": 1864
                },
                {
                  "x": 798,
                  "y": 1875
                },
                {
                  "x": 797,
                  "y": 1884
                },
                {
                  "x": 795,
                  "y": 1892
                },
                {
                  "x": 796,
                  "y": 1896
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 102,
              "x": 861,
              "y": 1779,
              "rotation": 0,
              "w": 36,
              "h": 20,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv0vbu0_btk",
              "polygon": [
                {
                  "x": 862,
                  "y": 1781
                },
                {
                  "x": 872,
                  "y": 1788
                },
                {
                  "x": 880,
                  "y": 1787
                },
                {
                  "x": 890,
                  "y": 1784
                },
                {
                  "x": 894,
                  "y": 1779
                },
                {
                  "x": 897,
                  "y": 1780
                },
                {
                  "x": 897,
                  "y": 1789
                },
                {
                  "x": 895,
                  "y": 1793
                },
                {
                  "x": 885,
                  "y": 1798
                },
                {
                  "x": 877,
                  "y": 1799
                },
                {
                  "x": 865,
                  "y": 1797
                },
                {
                  "x": 861,
                  "y": 1793
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 103,
              "x": 861,
              "y": 1757,
              "rotation": 0,
              "w": 36,
              "h": 34,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvv0vr2g_b2u",
              "polygon": [
                {
                  "x": 861,
                  "y": 1766
                },
                {
                  "x": 862,
                  "y": 1773
                },
                {
                  "x": 863,
                  "y": 1781
                },
                {
                  "x": 864,
                  "y": 1789
                },
                {
                  "x": 877,
                  "y": 1791
                },
                {
                  "x": 885,
                  "y": 1790
                },
                {
                  "x": 892,
                  "y": 1788
                },
                {
                  "x": 894,
                  "y": 1786
                },
                {
                  "x": 896,
                  "y": 1783
                },
                {
                  "x": 896,
                  "y": 1777
                },
                {
                  "x": 897,
                  "y": 1768
                },
                {
                  "x": 895,
                  "y": 1761
                },
                {
                  "x": 889,
                  "y": 1758
                },
                {
                  "x": 879,
                  "y": 1757
                },
                {
                  "x": 872,
                  "y": 1757
                },
                {
                  "x": 867,
                  "y": 1762
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 104,
              "x": 869,
              "y": 1805,
              "rotation": 0,
              "w": 63,
              "h": 53,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv0wm7t_52b",
              "polygon": [
                {
                  "x": 887,
                  "y": 1805
                },
                {
                  "x": 874,
                  "y": 1818
                },
                {
                  "x": 871,
                  "y": 1823
                },
                {
                  "x": 869,
                  "y": 1830
                },
                {
                  "x": 871,
                  "y": 1839
                },
                {
                  "x": 875,
                  "y": 1847
                },
                {
                  "x": 877,
                  "y": 1848
                },
                {
                  "x": 881,
                  "y": 1855
                },
                {
                  "x": 890,
                  "y": 1858
                },
                {
                  "x": 897,
                  "y": 1857
                },
                {
                  "x": 905,
                  "y": 1855
                },
                {
                  "x": 908,
                  "y": 1853
                },
                {
                  "x": 913,
                  "y": 1847
                },
                {
                  "x": 925,
                  "y": 1830
                },
                {
                  "x": 930,
                  "y": 1820
                },
                {
                  "x": 932,
                  "y": 1815
                },
                {
                  "x": 929,
                  "y": 1810
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 105,
              "x": 884,
              "y": 1789,
              "rotation": 0,
              "w": 50,
              "h": 25,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvv0wyaa_8kx",
              "polygon": [
                {
                  "x": 900,
                  "y": 1789
                },
                {
                  "x": 890,
                  "y": 1799
                },
                {
                  "x": 887,
                  "y": 1805
                },
                {
                  "x": 884,
                  "y": 1815
                },
                {
                  "x": 911,
                  "y": 1814
                },
                {
                  "x": 923,
                  "y": 1814
                },
                {
                  "x": 934,
                  "y": 1815
                },
                {
                  "x": 923,
                  "y": 1803
                },
                {
                  "x": 916,
                  "y": 1796
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 106,
              "x": 75,
              "y": 1528,
              "rotation": 0,
              "w": 237,
              "h": 271,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv134a2_4lu",
              "polygon": [
                {
                  "x": 76,
                  "y": 1634
                },
                {
                  "x": 75,
                  "y": 1798
                },
                {
                  "x": 312,
                  "y": 1798
                },
                {
                  "x": 309,
                  "y": 1670
                },
                {
                  "x": 303,
                  "y": 1529
                },
                {
                  "x": 76,
                  "y": 1528
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 107,
              "x": 1177,
              "y": 934,
              "rotation": 0,
              "w": 21,
              "h": 88,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv1471g_vib",
              "polygon": [
                {
                  "x": 1182,
                  "y": 935
                },
                {
                  "x": 1192,
                  "y": 934
                },
                {
                  "x": 1193,
                  "y": 992
                },
                {
                  "x": 1195,
                  "y": 993
                },
                {
                  "x": 1194,
                  "y": 1013
                },
                {
                  "x": 1198,
                  "y": 1018
                },
                {
                  "x": 1193,
                  "y": 1023
                },
                {
                  "x": 1184,
                  "y": 1023
                },
                {
                  "x": 1178,
                  "y": 1020
                },
                {
                  "x": 1177,
                  "y": 1013
                },
                {
                  "x": 1180,
                  "y": 1012
                },
                {
                  "x": 1181,
                  "y": 992
                },
                {
                  "x": 1183,
                  "y": 991
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 108,
              "x": 1182,
              "y": 903,
              "rotation": 0,
              "w": 11,
              "h": 37,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv159b8_zxc",
              "polygon": [
                {
                  "x": 1184,
                  "y": 903
                },
                {
                  "x": 1193,
                  "y": 903
                },
                {
                  "x": 1193,
                  "y": 939
                },
                {
                  "x": 1182,
                  "y": 939
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 109,
              "x": 1137,
              "y": 874,
              "rotation": 0,
              "w": 55,
              "h": 35,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvv16mla_ii5",
              "polygon": [
                {
                  "x": 1162,
                  "y": 889
                },
                {
                  "x": 1161,
                  "y": 894
                },
                {
                  "x": 1140,
                  "y": 895
                },
                {
                  "x": 1137,
                  "y": 892
                },
                {
                  "x": 1137,
                  "y": 884
                },
                {
                  "x": 1142,
                  "y": 874
                },
                {
                  "x": 1179,
                  "y": 874
                },
                {
                  "x": 1186,
                  "y": 876
                },
                {
                  "x": 1189,
                  "y": 881
                },
                {
                  "x": 1191,
                  "y": 891
                },
                {
                  "x": 1192,
                  "y": 908
                },
                {
                  "x": 1183,
                  "y": 909
                },
                {
                  "x": 1184,
                  "y": 894
                },
                {
                  "x": 1184,
                  "y": 884
                },
                {
                  "x": 1180,
                  "y": 880
                },
                {
                  "x": 1167,
                  "y": 880
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 110,
              "x": 1076,
              "y": 1730,
              "rotation": 0,
              "w": 21,
              "h": 138,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv1980r_dar",
              "polygon": [
                {
                  "x": 1080,
                  "y": 1832
                },
                {
                  "x": 1079,
                  "y": 1846
                },
                {
                  "x": 1079,
                  "y": 1855
                },
                {
                  "x": 1076,
                  "y": 1855
                },
                {
                  "x": 1076,
                  "y": 1861
                },
                {
                  "x": 1081,
                  "y": 1868
                },
                {
                  "x": 1089,
                  "y": 1868
                },
                {
                  "x": 1096,
                  "y": 1866
                },
                {
                  "x": 1097,
                  "y": 1858
                },
                {
                  "x": 1094,
                  "y": 1854
                },
                {
                  "x": 1093,
                  "y": 1835
                },
                {
                  "x": 1090,
                  "y": 1834
                },
                {
                  "x": 1090,
                  "y": 1730
                },
                {
                  "x": 1082,
                  "y": 1732
                },
                {
                  "x": 1081,
                  "y": 1774
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 111,
              "x": 1043,
              "y": 1720,
              "rotation": 0,
              "w": 48,
              "h": 19,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvv19tnu_2n9",
              "polygon": [
                {
                  "x": 1081,
                  "y": 1739
                },
                {
                  "x": 1091,
                  "y": 1740
                },
                {
                  "x": 1090,
                  "y": 1728
                },
                {
                  "x": 1085,
                  "y": 1721
                },
                {
                  "x": 1070,
                  "y": 1720
                },
                {
                  "x": 1058,
                  "y": 1720
                },
                {
                  "x": 1046,
                  "y": 1720
                },
                {
                  "x": 1043,
                  "y": 1725
                },
                {
                  "x": 1043,
                  "y": 1729
                },
                {
                  "x": 1043,
                  "y": 1735
                },
                {
                  "x": 1045,
                  "y": 1738
                },
                {
                  "x": 1060,
                  "y": 1740
                },
                {
                  "x": 1065,
                  "y": 1735
                },
                {
                  "x": 1067,
                  "y": 1727
                },
                {
                  "x": 1076,
                  "y": 1727
                },
                {
                  "x": 1083,
                  "y": 1728
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 112,
              "x": 941,
              "y": 1746,
              "rotation": 0,
              "w": 20,
              "h": 126,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv1asw3_brk",
              "polygon": [
                {
                  "x": 953,
                  "y": 1747
                },
                {
                  "x": 946,
                  "y": 1746
                },
                {
                  "x": 946,
                  "y": 1787
                },
                {
                  "x": 947,
                  "y": 1800
                },
                {
                  "x": 948,
                  "y": 1841
                },
                {
                  "x": 945,
                  "y": 1841
                },
                {
                  "x": 944,
                  "y": 1862
                },
                {
                  "x": 941,
                  "y": 1865
                },
                {
                  "x": 944,
                  "y": 1871
                },
                {
                  "x": 952,
                  "y": 1872
                },
                {
                  "x": 961,
                  "y": 1868
                },
                {
                  "x": 961,
                  "y": 1860
                },
                {
                  "x": 958,
                  "y": 1859
                },
                {
                  "x": 958,
                  "y": 1843
                },
                {
                  "x": 956,
                  "y": 1841
                },
                {
                  "x": 956,
                  "y": 1787
                },
                {
                  "x": 954,
                  "y": 1785
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 113,
              "x": 946,
              "y": 1728,
              "rotation": 0,
              "w": 49,
              "h": 22,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvv1bhhw_6uq",
              "polygon": [
                {
                  "x": 969,
                  "y": 1744
                },
                {
                  "x": 971,
                  "y": 1750
                },
                {
                  "x": 991,
                  "y": 1749
                },
                {
                  "x": 995,
                  "y": 1743
                },
                {
                  "x": 995,
                  "y": 1734
                },
                {
                  "x": 990,
                  "y": 1729
                },
                {
                  "x": 974,
                  "y": 1728
                },
                {
                  "x": 969,
                  "y": 1731
                },
                {
                  "x": 955,
                  "y": 1732
                },
                {
                  "x": 949,
                  "y": 1736
                },
                {
                  "x": 947,
                  "y": 1744
                },
                {
                  "x": 946,
                  "y": 1749
                },
                {
                  "x": 954,
                  "y": 1750
                },
                {
                  "x": 953,
                  "y": 1746
                },
                {
                  "x": 955,
                  "y": 1739
                },
                {
                  "x": 960,
                  "y": 1737
                },
                {
                  "x": 966,
                  "y": 1737
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 114,
              "x": 1744,
              "y": 272,
              "rotation": 0,
              "w": 160,
              "h": 96,
              "label": "TRIGGER",
              "id": "trigger_d9lp",
              "collisionType": "trigger",
              "isTrigger": true,
              "ai_instruction": "Aqui será a Van"
            },
            {
              "type": "obstacle",
              "zIndex": 115,
              "x": 1385,
              "y": 634,
              "rotation": 0,
              "w": 169,
              "h": 145,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv1g8t5_6jm",
              "polygon": [
                {
                  "x": 1454,
                  "y": 653
                },
                {
                  "x": 1427,
                  "y": 675
                },
                {
                  "x": 1418,
                  "y": 690
                },
                {
                  "x": 1416,
                  "y": 687
                },
                {
                  "x": 1411,
                  "y": 687
                },
                {
                  "x": 1409,
                  "y": 692
                },
                {
                  "x": 1414,
                  "y": 694
                },
                {
                  "x": 1414,
                  "y": 696
                },
                {
                  "x": 1389,
                  "y": 724
                },
                {
                  "x": 1386,
                  "y": 740
                },
                {
                  "x": 1385,
                  "y": 745
                },
                {
                  "x": 1387,
                  "y": 752
                },
                {
                  "x": 1392,
                  "y": 755
                },
                {
                  "x": 1398,
                  "y": 757
                },
                {
                  "x": 1401,
                  "y": 761
                },
                {
                  "x": 1408,
                  "y": 761
                },
                {
                  "x": 1415,
                  "y": 764
                },
                {
                  "x": 1422,
                  "y": 771
                },
                {
                  "x": 1434,
                  "y": 779
                },
                {
                  "x": 1441,
                  "y": 778
                },
                {
                  "x": 1443,
                  "y": 778
                },
                {
                  "x": 1448,
                  "y": 774
                },
                {
                  "x": 1450,
                  "y": 774
                },
                {
                  "x": 1454,
                  "y": 779
                },
                {
                  "x": 1458,
                  "y": 779
                },
                {
                  "x": 1467,
                  "y": 776
                },
                {
                  "x": 1472,
                  "y": 770
                },
                {
                  "x": 1472,
                  "y": 761
                },
                {
                  "x": 1472,
                  "y": 755
                },
                {
                  "x": 1477,
                  "y": 754
                },
                {
                  "x": 1495,
                  "y": 738
                },
                {
                  "x": 1518,
                  "y": 720
                },
                {
                  "x": 1521,
                  "y": 719
                },
                {
                  "x": 1524,
                  "y": 721
                },
                {
                  "x": 1529,
                  "y": 721
                },
                {
                  "x": 1534,
                  "y": 721
                },
                {
                  "x": 1539,
                  "y": 715
                },
                {
                  "x": 1541,
                  "y": 706
                },
                {
                  "x": 1541,
                  "y": 700
                },
                {
                  "x": 1540,
                  "y": 696
                },
                {
                  "x": 1545,
                  "y": 695
                },
                {
                  "x": 1550,
                  "y": 692
                },
                {
                  "x": 1554,
                  "y": 688
                },
                {
                  "x": 1549,
                  "y": 664
                },
                {
                  "x": 1497,
                  "y": 634
                },
                {
                  "x": 1464,
                  "y": 658
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 116,
              "x": 734,
              "y": 941,
              "rotation": 0,
              "w": 179,
              "h": 96,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv1hipn_7qj",
              "polygon": [
                {
                  "x": 734,
                  "y": 985
                },
                {
                  "x": 734,
                  "y": 1004
                },
                {
                  "x": 737,
                  "y": 1015
                },
                {
                  "x": 737,
                  "y": 1029
                },
                {
                  "x": 742,
                  "y": 1034
                },
                {
                  "x": 758,
                  "y": 1035
                },
                {
                  "x": 765,
                  "y": 1035
                },
                {
                  "x": 767,
                  "y": 1036
                },
                {
                  "x": 793,
                  "y": 1036
                },
                {
                  "x": 805,
                  "y": 1031
                },
                {
                  "x": 825,
                  "y": 1031
                },
                {
                  "x": 852,
                  "y": 1031
                },
                {
                  "x": 868,
                  "y": 1030
                },
                {
                  "x": 874,
                  "y": 1037
                },
                {
                  "x": 889,
                  "y": 1034
                },
                {
                  "x": 892,
                  "y": 1028
                },
                {
                  "x": 900,
                  "y": 1025
                },
                {
                  "x": 910,
                  "y": 1019
                },
                {
                  "x": 909,
                  "y": 1000
                },
                {
                  "x": 914,
                  "y": 995
                },
                {
                  "x": 909,
                  "y": 978
                },
                {
                  "x": 906,
                  "y": 969
                },
                {
                  "x": 903,
                  "y": 960
                },
                {
                  "x": 896,
                  "y": 955
                },
                {
                  "x": 882,
                  "y": 953
                },
                {
                  "x": 861,
                  "y": 953
                },
                {
                  "x": 854,
                  "y": 953
                },
                {
                  "x": 848,
                  "y": 944
                },
                {
                  "x": 846,
                  "y": 941
                },
                {
                  "x": 843,
                  "y": 943
                },
                {
                  "x": 845,
                  "y": 948
                },
                {
                  "x": 846,
                  "y": 952
                },
                {
                  "x": 835,
                  "y": 948
                },
                {
                  "x": 817,
                  "y": 948
                },
                {
                  "x": 808,
                  "y": 950
                },
                {
                  "x": 785,
                  "y": 953
                },
                {
                  "x": 774,
                  "y": 955
                },
                {
                  "x": 765,
                  "y": 958
                },
                {
                  "x": 754,
                  "y": 968
                },
                {
                  "x": 742,
                  "y": 970
                },
                {
                  "x": 736,
                  "y": 973
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 117,
              "x": 1753,
              "y": 1291,
              "rotation": 0,
              "w": 132,
              "h": 161,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv1iz86_8ts",
              "polygon": [
                {
                  "x": 1802,
                  "y": 1296
                },
                {
                  "x": 1794,
                  "y": 1311
                },
                {
                  "x": 1789,
                  "y": 1322
                },
                {
                  "x": 1784,
                  "y": 1337
                },
                {
                  "x": 1777,
                  "y": 1355
                },
                {
                  "x": 1769,
                  "y": 1372
                },
                {
                  "x": 1761,
                  "y": 1391
                },
                {
                  "x": 1759,
                  "y": 1398
                },
                {
                  "x": 1758,
                  "y": 1403
                },
                {
                  "x": 1757,
                  "y": 1421
                },
                {
                  "x": 1757,
                  "y": 1427
                },
                {
                  "x": 1754,
                  "y": 1430
                },
                {
                  "x": 1753,
                  "y": 1437
                },
                {
                  "x": 1769,
                  "y": 1442
                },
                {
                  "x": 1781,
                  "y": 1444
                },
                {
                  "x": 1800,
                  "y": 1450
                },
                {
                  "x": 1811,
                  "y": 1450
                },
                {
                  "x": 1823,
                  "y": 1452
                },
                {
                  "x": 1828,
                  "y": 1452
                },
                {
                  "x": 1833,
                  "y": 1448
                },
                {
                  "x": 1838,
                  "y": 1433
                },
                {
                  "x": 1842,
                  "y": 1435
                },
                {
                  "x": 1846,
                  "y": 1435
                },
                {
                  "x": 1852,
                  "y": 1429
                },
                {
                  "x": 1854,
                  "y": 1420
                },
                {
                  "x": 1854,
                  "y": 1408
                },
                {
                  "x": 1853,
                  "y": 1404
                },
                {
                  "x": 1851,
                  "y": 1403
                },
                {
                  "x": 1853,
                  "y": 1395
                },
                {
                  "x": 1867,
                  "y": 1363
                },
                {
                  "x": 1869,
                  "y": 1365
                },
                {
                  "x": 1873,
                  "y": 1366
                },
                {
                  "x": 1879,
                  "y": 1359
                },
                {
                  "x": 1880,
                  "y": 1349
                },
                {
                  "x": 1881,
                  "y": 1341
                },
                {
                  "x": 1884,
                  "y": 1336
                },
                {
                  "x": 1886,
                  "y": 1331
                },
                {
                  "x": 1886,
                  "y": 1324
                },
                {
                  "x": 1882,
                  "y": 1317
                },
                {
                  "x": 1880,
                  "y": 1311
                },
                {
                  "x": 1878,
                  "y": 1307
                },
                {
                  "x": 1863,
                  "y": 1303
                },
                {
                  "x": 1846,
                  "y": 1298
                },
                {
                  "x": 1827,
                  "y": 1293
                },
                {
                  "x": 1816,
                  "y": 1291
                },
                {
                  "x": 1810,
                  "y": 1294
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 118,
              "x": 1841,
              "y": 1527,
              "rotation": 0,
              "w": 76,
              "h": 61,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv1k214_cfk",
              "polygon": [
                {
                  "x": 1863,
                  "y": 1554
                },
                {
                  "x": 1866,
                  "y": 1582
                },
                {
                  "x": 1872,
                  "y": 1583
                },
                {
                  "x": 1886,
                  "y": 1589
                },
                {
                  "x": 1898,
                  "y": 1589
                },
                {
                  "x": 1906,
                  "y": 1589
                },
                {
                  "x": 1917,
                  "y": 1583
                },
                {
                  "x": 1916,
                  "y": 1531
                },
                {
                  "x": 1903,
                  "y": 1534
                },
                {
                  "x": 1896,
                  "y": 1527
                },
                {
                  "x": 1886,
                  "y": 1531
                },
                {
                  "x": 1879,
                  "y": 1535
                },
                {
                  "x": 1871,
                  "y": 1534
                },
                {
                  "x": 1866,
                  "y": 1530
                },
                {
                  "x": 1854,
                  "y": 1529
                },
                {
                  "x": 1841,
                  "y": 1532
                },
                {
                  "x": 1844,
                  "y": 1548
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 119,
              "x": 1433,
              "y": 284,
              "rotation": 0,
              "w": 20,
              "h": 101,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv1l5i8_ci9",
              "polygon": [
                {
                  "x": 1443,
                  "y": 284
                },
                {
                  "x": 1451,
                  "y": 284
                },
                {
                  "x": 1450,
                  "y": 313
                },
                {
                  "x": 1448,
                  "y": 357
                },
                {
                  "x": 1450,
                  "y": 361
                },
                {
                  "x": 1452,
                  "y": 375
                },
                {
                  "x": 1454,
                  "y": 382
                },
                {
                  "x": 1443,
                  "y": 385
                },
                {
                  "x": 1433,
                  "y": 383
                },
                {
                  "x": 1437,
                  "y": 376
                },
                {
                  "x": 1438,
                  "y": 360
                },
                {
                  "x": 1442,
                  "y": 357
                },
                {
                  "x": 1442,
                  "y": 307
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 120,
              "x": 1442,
              "y": 245,
              "rotation": 0,
              "w": 62,
              "h": 49,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvv1m4ex_lys",
              "polygon": [
                {
                  "x": 1442,
                  "y": 294
                },
                {
                  "x": 1451,
                  "y": 293
                },
                {
                  "x": 1451,
                  "y": 273
                },
                {
                  "x": 1454,
                  "y": 264
                },
                {
                  "x": 1459,
                  "y": 258
                },
                {
                  "x": 1464,
                  "y": 256
                },
                {
                  "x": 1479,
                  "y": 257
                },
                {
                  "x": 1481,
                  "y": 263
                },
                {
                  "x": 1483,
                  "y": 267
                },
                {
                  "x": 1499,
                  "y": 267
                },
                {
                  "x": 1505,
                  "y": 257
                },
                {
                  "x": 1504,
                  "y": 252
                },
                {
                  "x": 1502,
                  "y": 245
                },
                {
                  "x": 1481,
                  "y": 246
                },
                {
                  "x": 1479,
                  "y": 250
                },
                {
                  "x": 1461,
                  "y": 250
                },
                {
                  "x": 1454,
                  "y": 253
                },
                {
                  "x": 1449,
                  "y": 261
                },
                {
                  "x": 1445,
                  "y": 268
                },
                {
                  "x": 1444,
                  "y": 280
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 121,
              "x": 1476,
              "y": 37,
              "rotation": 0,
              "w": 19,
              "h": 95,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv1na4c_7kf",
              "polygon": [
                {
                  "x": 1483,
                  "y": 37
                },
                {
                  "x": 1489,
                  "y": 37
                },
                {
                  "x": 1488,
                  "y": 102
                },
                {
                  "x": 1493,
                  "y": 103
                },
                {
                  "x": 1492,
                  "y": 124
                },
                {
                  "x": 1495,
                  "y": 124
                },
                {
                  "x": 1494,
                  "y": 132
                },
                {
                  "x": 1487,
                  "y": 133
                },
                {
                  "x": 1478,
                  "y": 132
                },
                {
                  "x": 1476,
                  "y": 127
                },
                {
                  "x": 1477,
                  "y": 124
                },
                {
                  "x": 1480,
                  "y": 123
                },
                {
                  "x": 1479,
                  "y": 104
                },
                {
                  "x": 1482,
                  "y": 103
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 122,
              "x": 1483,
              "y": 18,
              "rotation": 0,
              "w": 36,
              "h": 28,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvv1nrys_pa1",
              "polygon": [
                {
                  "x": 1495,
                  "y": 30
                },
                {
                  "x": 1499,
                  "y": 36
                },
                {
                  "x": 1514,
                  "y": 36
                },
                {
                  "x": 1519,
                  "y": 31
                },
                {
                  "x": 1518,
                  "y": 20
                },
                {
                  "x": 1513,
                  "y": 18
                },
                {
                  "x": 1494,
                  "y": 18
                },
                {
                  "x": 1490,
                  "y": 21
                },
                {
                  "x": 1485,
                  "y": 25
                },
                {
                  "x": 1484,
                  "y": 31
                },
                {
                  "x": 1483,
                  "y": 46
                },
                {
                  "x": 1490,
                  "y": 46
                },
                {
                  "x": 1488,
                  "y": 37
                },
                {
                  "x": 1489,
                  "y": 28
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 123,
              "x": 1690,
              "y": 1957,
              "rotation": 0,
              "w": 43,
              "h": 30,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv1p4bx_56r",
              "polygon": [
                {
                  "x": 1714,
                  "y": 1962
                },
                {
                  "x": 1713,
                  "y": 1966
                },
                {
                  "x": 1706,
                  "y": 1966
                },
                {
                  "x": 1699,
                  "y": 1966
                },
                {
                  "x": 1694,
                  "y": 1970
                },
                {
                  "x": 1690,
                  "y": 1982
                },
                {
                  "x": 1696,
                  "y": 1984
                },
                {
                  "x": 1702,
                  "y": 1986
                },
                {
                  "x": 1709,
                  "y": 1987
                },
                {
                  "x": 1716,
                  "y": 1987
                },
                {
                  "x": 1721,
                  "y": 1987
                },
                {
                  "x": 1726,
                  "y": 1984
                },
                {
                  "x": 1726,
                  "y": 1976
                },
                {
                  "x": 1728,
                  "y": 1971
                },
                {
                  "x": 1733,
                  "y": 1964
                },
                {
                  "x": 1729,
                  "y": 1960
                },
                {
                  "x": 1721,
                  "y": 1957
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 124,
              "x": 1772,
              "y": 1950,
              "rotation": 0,
              "w": 48,
              "h": 39,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv1pfoe_lkd",
              "polygon": [
                {
                  "x": 1773,
                  "y": 1959
                },
                {
                  "x": 1772,
                  "y": 1984
                },
                {
                  "x": 1780,
                  "y": 1986
                },
                {
                  "x": 1793,
                  "y": 1987
                },
                {
                  "x": 1800,
                  "y": 1987
                },
                {
                  "x": 1812,
                  "y": 1989
                },
                {
                  "x": 1818,
                  "y": 1989
                },
                {
                  "x": 1820,
                  "y": 1981
                },
                {
                  "x": 1818,
                  "y": 1969
                },
                {
                  "x": 1818,
                  "y": 1961
                },
                {
                  "x": 1814,
                  "y": 1956
                },
                {
                  "x": 1809,
                  "y": 1956
                },
                {
                  "x": 1803,
                  "y": 1951
                },
                {
                  "x": 1799,
                  "y": 1950
                },
                {
                  "x": 1792,
                  "y": 1950
                },
                {
                  "x": 1787,
                  "y": 1955
                },
                {
                  "x": 1778,
                  "y": 1956
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 125,
              "x": 1673,
              "y": 1916,
              "rotation": 0,
              "w": 153,
              "h": 36,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvv1pxr1_y5l",
              "polygon": [
                {
                  "x": 1675,
                  "y": 1950
                },
                {
                  "x": 1826,
                  "y": 1951
                },
                {
                  "x": 1825,
                  "y": 1916
                },
                {
                  "x": 1673,
                  "y": 1916
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 126,
              "x": 1673,
              "y": 1858,
              "rotation": 0,
              "w": 154,
              "h": 69,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvv1qx1z_c2i",
              "polygon": [
                {
                  "x": 1673,
                  "y": 1878
                },
                {
                  "x": 1673,
                  "y": 1924
                },
                {
                  "x": 1826,
                  "y": 1927
                },
                {
                  "x": 1825,
                  "y": 1892
                },
                {
                  "x": 1822,
                  "y": 1890
                },
                {
                  "x": 1820,
                  "y": 1868
                },
                {
                  "x": 1813,
                  "y": 1866
                },
                {
                  "x": 1809,
                  "y": 1866
                },
                {
                  "x": 1807,
                  "y": 1871
                },
                {
                  "x": 1804,
                  "y": 1869
                },
                {
                  "x": 1794,
                  "y": 1869
                },
                {
                  "x": 1790,
                  "y": 1869
                },
                {
                  "x": 1788,
                  "y": 1863
                },
                {
                  "x": 1784,
                  "y": 1861
                },
                {
                  "x": 1779,
                  "y": 1860
                },
                {
                  "x": 1775,
                  "y": 1861
                },
                {
                  "x": 1773,
                  "y": 1865
                },
                {
                  "x": 1774,
                  "y": 1873
                },
                {
                  "x": 1773,
                  "y": 1887
                },
                {
                  "x": 1769,
                  "y": 1878
                },
                {
                  "x": 1769,
                  "y": 1870
                },
                {
                  "x": 1767,
                  "y": 1864
                },
                {
                  "x": 1761,
                  "y": 1863
                },
                {
                  "x": 1753,
                  "y": 1862
                },
                {
                  "x": 1748,
                  "y": 1865
                },
                {
                  "x": 1745,
                  "y": 1871
                },
                {
                  "x": 1743,
                  "y": 1871
                },
                {
                  "x": 1739,
                  "y": 1868
                },
                {
                  "x": 1733,
                  "y": 1868
                },
                {
                  "x": 1728,
                  "y": 1872
                },
                {
                  "x": 1727,
                  "y": 1874
                },
                {
                  "x": 1724,
                  "y": 1870
                },
                {
                  "x": 1721,
                  "y": 1868
                },
                {
                  "x": 1719,
                  "y": 1870
                },
                {
                  "x": 1719,
                  "y": 1862
                },
                {
                  "x": 1711,
                  "y": 1862
                },
                {
                  "x": 1705,
                  "y": 1861
                },
                {
                  "x": 1703,
                  "y": 1858
                },
                {
                  "x": 1695,
                  "y": 1858
                },
                {
                  "x": 1682,
                  "y": 1858
                },
                {
                  "x": 1680,
                  "y": 1863
                },
                {
                  "x": 1680,
                  "y": 1872
                },
                {
                  "x": 1681,
                  "y": 1876
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
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
            },
            {
              "type": "obstacle",
              "id": "poly_obs_mvuz7cy6_7dq",
              "x": 54,
              "y": 1350,
              "w": 264,
              "h": 323,
              "polygon": [
                {
                  "x": 153,
                  "y": 1350
                },
                {
                  "x": 54,
                  "y": 1466
                },
                {
                  "x": 60,
                  "y": 1634
                },
                {
                  "x": 69,
                  "y": 1644
                },
                {
                  "x": 161,
                  "y": 1538
                },
                {
                  "x": 315,
                  "y": 1673
                },
                {
                  "x": 318,
                  "y": 1665
                },
                {
                  "x": 317,
                  "y": 1482
                },
                {
                  "x": 170,
                  "y": 1350
                }
              ],
              "label": "POLÍGONO POR CIMA",
              "isOverhead": true,
              "collisionType": "overhead"
            },
            {
              "type": "obstacle",
              "id": "poly_obs_mvuzb04c_x4h",
              "x": 479,
              "y": 1630,
              "w": 298,
              "h": 249,
              "polygon": [
                {
                  "x": 479,
                  "y": 1712
                },
                {
                  "x": 480,
                  "y": 1878
                },
                {
                  "x": 614,
                  "y": 1790
                },
                {
                  "x": 629,
                  "y": 1790
                },
                {
                  "x": 775,
                  "y": 1879
                },
                {
                  "x": 777,
                  "y": 1712
                },
                {
                  "x": 631,
                  "y": 1630
                },
                {
                  "x": 615,
                  "y": 1630
                }
              ],
              "label": "POLÍGONO POR CIMA",
              "isOverhead": true,
              "collisionType": "overhead"
            },
            {
              "type": "obstacle",
              "id": "poly_obs_mvuzdug1_xx7",
              "x": 1105,
              "y": 1694,
              "w": 294,
              "h": 256,
              "polygon": [
                {
                  "x": 1105,
                  "y": 1765
                },
                {
                  "x": 1105,
                  "y": 1891
                },
                {
                  "x": 1127,
                  "y": 1880
                },
                {
                  "x": 1130,
                  "y": 1870
                },
                {
                  "x": 1240,
                  "y": 1865
                },
                {
                  "x": 1276,
                  "y": 1865
                },
                {
                  "x": 1277,
                  "y": 1863
                },
                {
                  "x": 1287,
                  "y": 1863
                },
                {
                  "x": 1287,
                  "y": 1867
                },
                {
                  "x": 1399,
                  "y": 1951
                },
                {
                  "x": 1399,
                  "y": 1784
                },
                {
                  "x": 1289,
                  "y": 1709
                },
                {
                  "x": 1286,
                  "y": 1703
                },
                {
                  "x": 1276,
                  "y": 1703
                },
                {
                  "x": 1275,
                  "y": 1694
                },
                {
                  "x": 1239,
                  "y": 1694
                },
                {
                  "x": 1240,
                  "y": 1715
                },
                {
                  "x": 1134,
                  "y": 1714
                },
                {
                  "x": 1134,
                  "y": 1754
                },
                {
                  "x": 1115,
                  "y": 1754
                },
                {
                  "x": 1113,
                  "y": 1765
                }
              ],
              "label": "POLÍGONO POR CIMA",
              "isOverhead": true,
              "collisionType": "overhead"
            },
            {
              "type": "obstacle",
              "id": "poly_obs_mvuzknsm_nbb",
              "x": 1134,
              "y": 1153,
              "w": 289,
              "h": 240,
              "polygon": [
                {
                  "x": 1152,
                  "y": 1386
                },
                {
                  "x": 1138,
                  "y": 1394
                },
                {
                  "x": 1134,
                  "y": 1389
                },
                {
                  "x": 1134,
                  "y": 1232
                },
                {
                  "x": 1276,
                  "y": 1153
                },
                {
                  "x": 1286,
                  "y": 1153
                },
                {
                  "x": 1422,
                  "y": 1229
                },
                {
                  "x": 1419,
                  "y": 1393
                },
                {
                  "x": 1287,
                  "y": 1299
                },
                {
                  "x": 1271,
                  "y": 1299
                }
              ],
              "label": "POLÍGONO POR CIMA",
              "isOverhead": true,
              "collisionType": "overhead"
            },
            {
              "type": "obstacle",
              "id": "poly_obs_mvuzr2wm_pp6",
              "x": 1433,
              "y": 1542,
              "w": 36,
              "h": 39,
              "polygon": [
                {
                  "x": 1433,
                  "y": 1553
                },
                {
                  "x": 1433,
                  "y": 1571
                },
                {
                  "x": 1435,
                  "y": 1580
                },
                {
                  "x": 1444,
                  "y": 1580
                },
                {
                  "x": 1459,
                  "y": 1581
                },
                {
                  "x": 1465,
                  "y": 1580
                },
                {
                  "x": 1469,
                  "y": 1578
                },
                {
                  "x": 1468,
                  "y": 1559
                },
                {
                  "x": 1469,
                  "y": 1552
                },
                {
                  "x": 1466,
                  "y": 1546
                },
                {
                  "x": 1460,
                  "y": 1543
                },
                {
                  "x": 1453,
                  "y": 1542
                },
                {
                  "x": 1447,
                  "y": 1542
                },
                {
                  "x": 1439,
                  "y": 1545
                }
              ],
              "label": "POLÍGONO POR CIMA",
              "isOverhead": true,
              "collisionType": "overhead"
            },
            {
              "type": "obstacle",
              "id": "poly_obs_mvuzufh6_8o4",
              "x": 1412,
              "y": 1776,
              "w": 35,
              "h": 36,
              "polygon": [
                {
                  "x": 1412,
                  "y": 1783
                },
                {
                  "x": 1414,
                  "y": 1794
                },
                {
                  "x": 1414,
                  "y": 1810
                },
                {
                  "x": 1446,
                  "y": 1812
                },
                {
                  "x": 1445,
                  "y": 1797
                },
                {
                  "x": 1447,
                  "y": 1789
                },
                {
                  "x": 1445,
                  "y": 1781
                },
                {
                  "x": 1439,
                  "y": 1777
                },
                {
                  "x": 1429,
                  "y": 1776
                },
                {
                  "x": 1421,
                  "y": 1776
                }
              ],
              "label": "POLÍGONO POR CIMA",
              "isOverhead": true,
              "collisionType": "overhead"
            },
            {
              "type": "obstacle",
              "id": "poly_obs_mvuzvz4d_fnc",
              "x": 271,
              "y": 291,
              "w": 45,
              "h": 49,
              "polygon": [
                {
                  "x": 308,
                  "y": 340
                },
                {
                  "x": 316,
                  "y": 340
                },
                {
                  "x": 313,
                  "y": 331
                },
                {
                  "x": 314,
                  "y": 317
                },
                {
                  "x": 313,
                  "y": 306
                },
                {
                  "x": 311,
                  "y": 298
                },
                {
                  "x": 305,
                  "y": 295
                },
                {
                  "x": 304,
                  "y": 295
                },
                {
                  "x": 303,
                  "y": 293
                },
                {
                  "x": 299,
                  "y": 293
                },
                {
                  "x": 298,
                  "y": 293
                },
                {
                  "x": 294,
                  "y": 291
                },
                {
                  "x": 285,
                  "y": 291
                },
                {
                  "x": 277,
                  "y": 292
                },
                {
                  "x": 272,
                  "y": 292
                },
                {
                  "x": 271,
                  "y": 300
                },
                {
                  "x": 274,
                  "y": 301
                },
                {
                  "x": 274,
                  "y": 306
                },
                {
                  "x": 275,
                  "y": 308
                },
                {
                  "x": 288,
                  "y": 308
                },
                {
                  "x": 295,
                  "y": 308
                },
                {
                  "x": 296,
                  "y": 304
                },
                {
                  "x": 296,
                  "y": 302
                },
                {
                  "x": 299,
                  "y": 300
                },
                {
                  "x": 304,
                  "y": 302
                },
                {
                  "x": 304,
                  "y": 309
                },
                {
                  "x": 304,
                  "y": 316
                },
                {
                  "x": 306,
                  "y": 320
                },
                {
                  "x": 306,
                  "y": 332
                }
              ],
              "label": "POLÍGONO POR CIMA",
              "isOverhead": true,
              "collisionType": "overhead"
            },
            {
              "type": "obstacle",
              "id": "poly_obs_mvuzx5am_lpg",
              "x": 568,
              "y": 752,
              "w": 64,
              "h": 39,
              "polygon": [
                {
                  "x": 603,
                  "y": 767
                },
                {
                  "x": 605,
                  "y": 774
                },
                {
                  "x": 627,
                  "y": 775
                },
                {
                  "x": 628,
                  "y": 770
                },
                {
                  "x": 629,
                  "y": 766
                },
                {
                  "x": 631,
                  "y": 766
                },
                {
                  "x": 631,
                  "y": 755
                },
                {
                  "x": 626,
                  "y": 752
                },
                {
                  "x": 602,
                  "y": 753
                },
                {
                  "x": 602,
                  "y": 756
                },
                {
                  "x": 591,
                  "y": 755
                },
                {
                  "x": 587,
                  "y": 756
                },
                {
                  "x": 581,
                  "y": 761
                },
                {
                  "x": 573,
                  "y": 770
                },
                {
                  "x": 570,
                  "y": 776
                },
                {
                  "x": 568,
                  "y": 786
                },
                {
                  "x": 568,
                  "y": 792
                },
                {
                  "x": 576,
                  "y": 792
                },
                {
                  "x": 576,
                  "y": 781
                },
                {
                  "x": 577,
                  "y": 776
                },
                {
                  "x": 582,
                  "y": 769
                },
                {
                  "x": 586,
                  "y": 763
                },
                {
                  "x": 591,
                  "y": 761
                },
                {
                  "x": 603,
                  "y": 761
                }
              ],
              "label": "POLÍGONO POR CIMA",
              "isOverhead": true,
              "collisionType": "overhead"
            },
            {
              "type": "obstacle",
              "id": "poly_obs_mvuzzl0x_gxo",
              "x": 568,
              "y": 489,
              "w": 63,
              "h": 46,
              "polygon": [
                {
                  "x": 568,
                  "y": 508
                },
                {
                  "x": 573,
                  "y": 513
                },
                {
                  "x": 593,
                  "y": 514
                },
                {
                  "x": 596,
                  "y": 507
                },
                {
                  "x": 598,
                  "y": 507
                },
                {
                  "x": 598,
                  "y": 499
                },
                {
                  "x": 616,
                  "y": 497
                },
                {
                  "x": 622,
                  "y": 503
                },
                {
                  "x": 623,
                  "y": 515
                },
                {
                  "x": 623,
                  "y": 535
                },
                {
                  "x": 632,
                  "y": 535
                },
                {
                  "x": 632,
                  "y": 520
                },
                {
                  "x": 629,
                  "y": 516
                },
                {
                  "x": 630,
                  "y": 508
                },
                {
                  "x": 628,
                  "y": 503
                },
                {
                  "x": 626,
                  "y": 495
                },
                {
                  "x": 620,
                  "y": 491
                },
                {
                  "x": 614,
                  "y": 489
                },
                {
                  "x": 600,
                  "y": 490
                },
                {
                  "x": 596,
                  "y": 492
                },
                {
                  "x": 593,
                  "y": 491
                },
                {
                  "x": 579,
                  "y": 491
                },
                {
                  "x": 574,
                  "y": 493
                },
                {
                  "x": 571,
                  "y": 500
                }
              ],
              "label": "POLÍGONO POR CIMA",
              "isOverhead": true,
              "collisionType": "overhead"
            },
            {
              "type": "obstacle",
              "id": "poly_obs_mvv02kz9_91u",
              "x": 292,
              "y": 533,
              "w": 77,
              "h": 61,
              "polygon": [
                {
                  "x": 302,
                  "y": 592
                },
                {
                  "x": 295,
                  "y": 592
                },
                {
                  "x": 292,
                  "y": 590
                },
                {
                  "x": 300,
                  "y": 584
                },
                {
                  "x": 300,
                  "y": 579
                },
                {
                  "x": 296,
                  "y": 575
                },
                {
                  "x": 304,
                  "y": 572
                },
                {
                  "x": 311,
                  "y": 569
                },
                {
                  "x": 305,
                  "y": 563
                },
                {
                  "x": 297,
                  "y": 558
                },
                {
                  "x": 305,
                  "y": 555
                },
                {
                  "x": 309,
                  "y": 555
                },
                {
                  "x": 309,
                  "y": 547
                },
                {
                  "x": 312,
                  "y": 543
                },
                {
                  "x": 317,
                  "y": 547
                },
                {
                  "x": 319,
                  "y": 542
                },
                {
                  "x": 320,
                  "y": 541
                },
                {
                  "x": 325,
                  "y": 547
                },
                {
                  "x": 328,
                  "y": 533
                },
                {
                  "x": 332,
                  "y": 533
                },
                {
                  "x": 336,
                  "y": 543
                },
                {
                  "x": 337,
                  "y": 551
                },
                {
                  "x": 345,
                  "y": 545
                },
                {
                  "x": 347,
                  "y": 542
                },
                {
                  "x": 352,
                  "y": 542
                },
                {
                  "x": 353,
                  "y": 544
                },
                {
                  "x": 349,
                  "y": 545
                },
                {
                  "x": 349,
                  "y": 549
                },
                {
                  "x": 352,
                  "y": 549
                },
                {
                  "x": 352,
                  "y": 556
                },
                {
                  "x": 365,
                  "y": 555
                },
                {
                  "x": 365,
                  "y": 559
                },
                {
                  "x": 362,
                  "y": 563
                },
                {
                  "x": 358,
                  "y": 564
                },
                {
                  "x": 359,
                  "y": 567
                },
                {
                  "x": 364,
                  "y": 569
                },
                {
                  "x": 368,
                  "y": 570
                },
                {
                  "x": 369,
                  "y": 574
                },
                {
                  "x": 365,
                  "y": 576
                },
                {
                  "x": 367,
                  "y": 578
                },
                {
                  "x": 369,
                  "y": 584
                },
                {
                  "x": 365,
                  "y": 586
                },
                {
                  "x": 363,
                  "y": 589
                },
                {
                  "x": 367,
                  "y": 594
                }
              ],
              "label": "POLÍGONO POR CIMA",
              "isOverhead": true,
              "collisionType": "overhead"
            },
            {
              "type": "obstacle",
              "id": "poly_obs_mvv07ph7_1f1",
              "x": 559,
              "y": 112,
              "w": 280,
              "h": 159,
              "polygon": [
                {
                  "x": 561,
                  "y": 136
                },
                {
                  "x": 559,
                  "y": 142
                },
                {
                  "x": 559,
                  "y": 146
                },
                {
                  "x": 560,
                  "y": 150
                },
                {
                  "x": 559,
                  "y": 271
                },
                {
                  "x": 836,
                  "y": 269
                },
                {
                  "x": 836,
                  "y": 148
                },
                {
                  "x": 836,
                  "y": 144
                },
                {
                  "x": 836,
                  "y": 137
                },
                {
                  "x": 834,
                  "y": 137
                },
                {
                  "x": 839,
                  "y": 117
                },
                {
                  "x": 839,
                  "y": 112
                },
                {
                  "x": 568,
                  "y": 113
                }
              ],
              "label": "POLÍGONO POR CIMA",
              "isOverhead": true,
              "collisionType": "overhead"
            },
            {
              "type": "obstacle",
              "id": "poly_obs_mvv08kkc_hh8",
              "x": 824,
              "y": 196,
              "w": 77,
              "h": 121,
              "polygon": [
                {
                  "x": 824,
                  "y": 272
                },
                {
                  "x": 825,
                  "y": 291
                },
                {
                  "x": 845,
                  "y": 297
                },
                {
                  "x": 864,
                  "y": 305
                },
                {
                  "x": 881,
                  "y": 312
                },
                {
                  "x": 887,
                  "y": 317
                },
                {
                  "x": 893,
                  "y": 317
                },
                {
                  "x": 893,
                  "y": 304
                },
                {
                  "x": 901,
                  "y": 308
                },
                {
                  "x": 901,
                  "y": 223
                },
                {
                  "x": 837,
                  "y": 196
                },
                {
                  "x": 836,
                  "y": 271
                }
              ],
              "label": "POLÍGONO POR CIMA",
              "isOverhead": true,
              "collisionType": "overhead"
            },
            {
              "type": "obstacle",
              "id": "poly_obs_mvv0c87t_fcd",
              "x": 230,
              "y": 625,
              "w": 232,
              "h": 171,
              "polygon": [
                {
                  "x": 239,
                  "y": 747
                },
                {
                  "x": 230,
                  "y": 745
                },
                {
                  "x": 230,
                  "y": 625
                },
                {
                  "x": 462,
                  "y": 678
                },
                {
                  "x": 462,
                  "y": 797
                }
              ],
              "label": "POLÍGONO POR CIMA",
              "isOverhead": true,
              "collisionType": "overhead"
            },
            {
              "type": "obstacle",
              "id": "poly_obs_mvv0ir5l_6bb",
              "x": 880,
              "y": 381,
              "w": 247,
              "h": 236,
              "polygon": [
                {
                  "x": 900,
                  "y": 604
                },
                {
                  "x": 888,
                  "y": 617
                },
                {
                  "x": 882,
                  "y": 612
                },
                {
                  "x": 880,
                  "y": 488
                },
                {
                  "x": 995,
                  "y": 384
                },
                {
                  "x": 995,
                  "y": 381
                },
                {
                  "x": 1010,
                  "y": 381
                },
                {
                  "x": 1011,
                  "y": 385
                },
                {
                  "x": 1059,
                  "y": 433
                },
                {
                  "x": 1059,
                  "y": 418
                },
                {
                  "x": 1082,
                  "y": 417
                },
                {
                  "x": 1083,
                  "y": 439
                },
                {
                  "x": 1080,
                  "y": 443
                },
                {
                  "x": 1080,
                  "y": 449
                },
                {
                  "x": 1127,
                  "y": 492
                },
                {
                  "x": 1124,
                  "y": 608
                },
                {
                  "x": 1123,
                  "y": 612
                },
                {
                  "x": 1004,
                  "y": 501
                },
                {
                  "x": 999,
                  "y": 503
                }
              ],
              "label": "POLÍGONO POR CIMA",
              "isOverhead": true,
              "collisionType": "overhead"
            },
            {
              "type": "obstacle",
              "id": "poly_obs_mvv0osvc_syv",
              "x": 1177,
              "y": 400,
              "w": 269,
              "h": 163,
              "polygon": [
                {
                  "x": 1184,
                  "y": 563
                },
                {
                  "x": 1177,
                  "y": 560
                },
                {
                  "x": 1178,
                  "y": 440
                },
                {
                  "x": 1177,
                  "y": 429
                },
                {
                  "x": 1180,
                  "y": 425
                },
                {
                  "x": 1187,
                  "y": 401
                },
                {
                  "x": 1443,
                  "y": 400
                },
                {
                  "x": 1442,
                  "y": 424
                },
                {
                  "x": 1445,
                  "y": 424
                },
                {
                  "x": 1444,
                  "y": 436
                },
                {
                  "x": 1443,
                  "y": 563
                },
                {
                  "x": 1195,
                  "y": 560
                }
              ],
              "label": "POLÍGONO POR CIMA",
              "isOverhead": true,
              "collisionType": "overhead"
            },
            {
              "type": "obstacle",
              "id": "poly_obs_mvv0siw5_8nn",
              "x": 1073,
              "y": -1,
              "w": 288,
              "h": 103,
              "polygon": [
                {
                  "x": 1074,
                  "y": 0
                },
                {
                  "x": 1073,
                  "y": 100
                },
                {
                  "x": 1361,
                  "y": 102
                },
                {
                  "x": 1360,
                  "y": -1
                }
              ],
              "label": "POLÍGONO POR CIMA",
              "isOverhead": true,
              "collisionType": "overhead"
            },
            {
              "type": "obstacle",
              "id": "poly_obs_mvv0vr2g_b2u",
              "x": 861,
              "y": 1757,
              "w": 36,
              "h": 34,
              "polygon": [
                {
                  "x": 861,
                  "y": 1766
                },
                {
                  "x": 862,
                  "y": 1773
                },
                {
                  "x": 863,
                  "y": 1781
                },
                {
                  "x": 864,
                  "y": 1789
                },
                {
                  "x": 877,
                  "y": 1791
                },
                {
                  "x": 885,
                  "y": 1790
                },
                {
                  "x": 892,
                  "y": 1788
                },
                {
                  "x": 894,
                  "y": 1786
                },
                {
                  "x": 896,
                  "y": 1783
                },
                {
                  "x": 896,
                  "y": 1777
                },
                {
                  "x": 897,
                  "y": 1768
                },
                {
                  "x": 895,
                  "y": 1761
                },
                {
                  "x": 889,
                  "y": 1758
                },
                {
                  "x": 879,
                  "y": 1757
                },
                {
                  "x": 872,
                  "y": 1757
                },
                {
                  "x": 867,
                  "y": 1762
                }
              ],
              "label": "POLÍGONO POR CIMA",
              "isOverhead": true,
              "collisionType": "overhead"
            },
            {
              "type": "obstacle",
              "id": "poly_obs_mvv0wyaa_8kx",
              "x": 884,
              "y": 1789,
              "w": 50,
              "h": 25,
              "polygon": [
                {
                  "x": 900,
                  "y": 1789
                },
                {
                  "x": 890,
                  "y": 1799
                },
                {
                  "x": 887,
                  "y": 1805
                },
                {
                  "x": 884,
                  "y": 1815
                },
                {
                  "x": 911,
                  "y": 1814
                },
                {
                  "x": 923,
                  "y": 1814
                },
                {
                  "x": 934,
                  "y": 1815
                },
                {
                  "x": 923,
                  "y": 1803
                },
                {
                  "x": 916,
                  "y": 1796
                }
              ],
              "label": "POLÍGONO POR CIMA",
              "isOverhead": true,
              "collisionType": "overhead"
            },
            {
              "type": "obstacle",
              "id": "poly_obs_mvv16mla_ii5",
              "x": 1137,
              "y": 874,
              "w": 55,
              "h": 35,
              "polygon": [
                {
                  "x": 1162,
                  "y": 889
                },
                {
                  "x": 1161,
                  "y": 894
                },
                {
                  "x": 1140,
                  "y": 895
                },
                {
                  "x": 1137,
                  "y": 892
                },
                {
                  "x": 1137,
                  "y": 884
                },
                {
                  "x": 1142,
                  "y": 874
                },
                {
                  "x": 1179,
                  "y": 874
                },
                {
                  "x": 1186,
                  "y": 876
                },
                {
                  "x": 1189,
                  "y": 881
                },
                {
                  "x": 1191,
                  "y": 891
                },
                {
                  "x": 1192,
                  "y": 908
                },
                {
                  "x": 1183,
                  "y": 909
                },
                {
                  "x": 1184,
                  "y": 894
                },
                {
                  "x": 1184,
                  "y": 884
                },
                {
                  "x": 1180,
                  "y": 880
                },
                {
                  "x": 1167,
                  "y": 880
                }
              ],
              "label": "POLÍGONO POR CIMA",
              "isOverhead": true,
              "collisionType": "overhead"
            },
            {
              "type": "obstacle",
              "id": "poly_obs_mvv19tnu_2n9",
              "x": 1043,
              "y": 1720,
              "w": 48,
              "h": 19,
              "polygon": [
                {
                  "x": 1081,
                  "y": 1739
                },
                {
                  "x": 1091,
                  "y": 1740
                },
                {
                  "x": 1090,
                  "y": 1728
                },
                {
                  "x": 1085,
                  "y": 1721
                },
                {
                  "x": 1070,
                  "y": 1720
                },
                {
                  "x": 1058,
                  "y": 1720
                },
                {
                  "x": 1046,
                  "y": 1720
                },
                {
                  "x": 1043,
                  "y": 1725
                },
                {
                  "x": 1043,
                  "y": 1729
                },
                {
                  "x": 1043,
                  "y": 1735
                },
                {
                  "x": 1045,
                  "y": 1738
                },
                {
                  "x": 1060,
                  "y": 1740
                },
                {
                  "x": 1065,
                  "y": 1735
                },
                {
                  "x": 1067,
                  "y": 1727
                },
                {
                  "x": 1076,
                  "y": 1727
                },
                {
                  "x": 1083,
                  "y": 1728
                }
              ],
              "label": "POLÍGONO POR CIMA",
              "isOverhead": true,
              "collisionType": "overhead"
            },
            {
              "type": "obstacle",
              "id": "poly_obs_mvv1bhhw_6uq",
              "x": 946,
              "y": 1728,
              "w": 49,
              "h": 22,
              "polygon": [
                {
                  "x": 969,
                  "y": 1744
                },
                {
                  "x": 971,
                  "y": 1750
                },
                {
                  "x": 991,
                  "y": 1749
                },
                {
                  "x": 995,
                  "y": 1743
                },
                {
                  "x": 995,
                  "y": 1734
                },
                {
                  "x": 990,
                  "y": 1729
                },
                {
                  "x": 974,
                  "y": 1728
                },
                {
                  "x": 969,
                  "y": 1731
                },
                {
                  "x": 955,
                  "y": 1732
                },
                {
                  "x": 949,
                  "y": 1736
                },
                {
                  "x": 947,
                  "y": 1744
                },
                {
                  "x": 946,
                  "y": 1749
                },
                {
                  "x": 954,
                  "y": 1750
                },
                {
                  "x": 953,
                  "y": 1746
                },
                {
                  "x": 955,
                  "y": 1739
                },
                {
                  "x": 960,
                  "y": 1737
                },
                {
                  "x": 966,
                  "y": 1737
                }
              ],
              "label": "POLÍGONO POR CIMA",
              "isOverhead": true,
              "collisionType": "overhead"
            },
            {
              "type": "obstacle",
              "id": "poly_obs_mvv1m4ex_lys",
              "x": 1442,
              "y": 245,
              "w": 62,
              "h": 49,
              "polygon": [
                {
                  "x": 1442,
                  "y": 294
                },
                {
                  "x": 1451,
                  "y": 293
                },
                {
                  "x": 1451,
                  "y": 273
                },
                {
                  "x": 1454,
                  "y": 264
                },
                {
                  "x": 1459,
                  "y": 258
                },
                {
                  "x": 1464,
                  "y": 256
                },
                {
                  "x": 1479,
                  "y": 257
                },
                {
                  "x": 1481,
                  "y": 263
                },
                {
                  "x": 1483,
                  "y": 267
                },
                {
                  "x": 1499,
                  "y": 267
                },
                {
                  "x": 1505,
                  "y": 257
                },
                {
                  "x": 1504,
                  "y": 252
                },
                {
                  "x": 1502,
                  "y": 245
                },
                {
                  "x": 1481,
                  "y": 246
                },
                {
                  "x": 1479,
                  "y": 250
                },
                {
                  "x": 1461,
                  "y": 250
                },
                {
                  "x": 1454,
                  "y": 253
                },
                {
                  "x": 1449,
                  "y": 261
                },
                {
                  "x": 1445,
                  "y": 268
                },
                {
                  "x": 1444,
                  "y": 280
                }
              ],
              "label": "POLÍGONO POR CIMA",
              "isOverhead": true,
              "collisionType": "overhead"
            },
            {
              "type": "obstacle",
              "id": "poly_obs_mvv1nrys_pa1",
              "x": 1483,
              "y": 18,
              "w": 36,
              "h": 28,
              "polygon": [
                {
                  "x": 1495,
                  "y": 30
                },
                {
                  "x": 1499,
                  "y": 36
                },
                {
                  "x": 1514,
                  "y": 36
                },
                {
                  "x": 1519,
                  "y": 31
                },
                {
                  "x": 1518,
                  "y": 20
                },
                {
                  "x": 1513,
                  "y": 18
                },
                {
                  "x": 1494,
                  "y": 18
                },
                {
                  "x": 1490,
                  "y": 21
                },
                {
                  "x": 1485,
                  "y": 25
                },
                {
                  "x": 1484,
                  "y": 31
                },
                {
                  "x": 1483,
                  "y": 46
                },
                {
                  "x": 1490,
                  "y": 46
                },
                {
                  "x": 1488,
                  "y": 37
                },
                {
                  "x": 1489,
                  "y": 28
                }
              ],
              "label": "POLÍGONO POR CIMA",
              "isOverhead": true,
              "collisionType": "overhead"
            },
            {
              "type": "obstacle",
              "id": "poly_obs_mvv1qx1z_c2i",
              "x": 1673,
              "y": 1858,
              "w": 154,
              "h": 69,
              "polygon": [
                {
                  "x": 1673,
                  "y": 1878
                },
                {
                  "x": 1673,
                  "y": 1924
                },
                {
                  "x": 1826,
                  "y": 1927
                },
                {
                  "x": 1825,
                  "y": 1892
                },
                {
                  "x": 1822,
                  "y": 1890
                },
                {
                  "x": 1820,
                  "y": 1868
                },
                {
                  "x": 1813,
                  "y": 1866
                },
                {
                  "x": 1809,
                  "y": 1866
                },
                {
                  "x": 1807,
                  "y": 1871
                },
                {
                  "x": 1804,
                  "y": 1869
                },
                {
                  "x": 1794,
                  "y": 1869
                },
                {
                  "x": 1790,
                  "y": 1869
                },
                {
                  "x": 1788,
                  "y": 1863
                },
                {
                  "x": 1784,
                  "y": 1861
                },
                {
                  "x": 1779,
                  "y": 1860
                },
                {
                  "x": 1775,
                  "y": 1861
                },
                {
                  "x": 1773,
                  "y": 1865
                },
                {
                  "x": 1774,
                  "y": 1873
                },
                {
                  "x": 1773,
                  "y": 1887
                },
                {
                  "x": 1769,
                  "y": 1878
                },
                {
                  "x": 1769,
                  "y": 1870
                },
                {
                  "x": 1767,
                  "y": 1864
                },
                {
                  "x": 1761,
                  "y": 1863
                },
                {
                  "x": 1753,
                  "y": 1862
                },
                {
                  "x": 1748,
                  "y": 1865
                },
                {
                  "x": 1745,
                  "y": 1871
                },
                {
                  "x": 1743,
                  "y": 1871
                },
                {
                  "x": 1739,
                  "y": 1868
                },
                {
                  "x": 1733,
                  "y": 1868
                },
                {
                  "x": 1728,
                  "y": 1872
                },
                {
                  "x": 1727,
                  "y": 1874
                },
                {
                  "x": 1724,
                  "y": 1870
                },
                {
                  "x": 1721,
                  "y": 1868
                },
                {
                  "x": 1719,
                  "y": 1870
                },
                {
                  "x": 1719,
                  "y": 1862
                },
                {
                  "x": 1711,
                  "y": 1862
                },
                {
                  "x": 1705,
                  "y": 1861
                },
                {
                  "x": 1703,
                  "y": 1858
                },
                {
                  "x": 1695,
                  "y": 1858
                },
                {
                  "x": 1682,
                  "y": 1858
                },
                {
                  "x": 1680,
                  "y": 1863
                },
                {
                  "x": 1680,
                  "y": 1872
                },
                {
                  "x": 1681,
                  "y": 1876
                }
              ],
              "label": "POLÍGONO POR CIMA",
              "isOverhead": true,
              "collisionType": "overhead"
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
      "itemsCount": 127,
      "items": [
        {
          "type": "obstacle",
          "zIndex": 0,
          "x": 0,
          "y": 2032,
          "rotation": 0,
          "w": 2048,
          "h": 16,
          "label": "LIMITE SUL"
        },
        {
          "type": "obstacle",
          "zIndex": 1,
          "x": 2038,
          "y": 0,
          "rotation": 0,
          "w": 10,
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
          "x": 240,
          "y": 720,
          "rotation": 0,
          "w": 216,
          "h": 168,
          "label": "CABANA OESTE"
        },
        {
          "type": "obstacle",
          "zIndex": 4,
          "x": 496,
          "y": 1744,
          "rotation": 0,
          "w": 276,
          "h": 240,
          "label": "CASA SUDOESTE 2"
        },
        {
          "type": "obstacle",
          "zIndex": 5,
          "x": 1184,
          "y": 496,
          "rotation": 0,
          "w": 240,
          "h": 186,
          "label": "CASA CENTRO"
        },
        {
          "type": "obstacle",
          "zIndex": 6,
          "x": 1152,
          "y": 1280,
          "rotation": 0,
          "w": 260,
          "h": 226,
          "label": "CASA CENTRAL GRANDE"
        },
        {
          "type": "obstacle",
          "zIndex": 7,
          "x": 1120,
          "y": 1792,
          "rotation": 0,
          "w": 272,
          "h": 186,
          "label": "CASA SUL"
        },
        {
          "type": "obstacle",
          "zIndex": 8,
          "x": 1920,
          "y": 1520,
          "rotation": 0,
          "w": 132,
          "h": 360,
          "label": "EDIFÍCIO SUDESTE"
        },
        {
          "type": "obstacle",
          "zIndex": 9,
          "x": 1690,
          "y": 680,
          "rotation": 0,
          "w": 270,
          "h": 240,
          "label": "LAGO LESTE [NORTE]"
        },
        {
          "type": "obstacle",
          "zIndex": 10,
          "x": 1740,
          "y": 920,
          "rotation": 0,
          "w": 220,
          "h": 210,
          "label": "LAGO LESTE [SUL]"
        },
        {
          "type": "trash",
          "zIndex": 11,
          "x": 205,
          "y": 185,
          "rotation": 0.12,
          "id": "map1_trash_01",
          "typeIndex": 0
        },
        {
          "type": "trash",
          "zIndex": 12,
          "x": 265,
          "y": 345,
          "rotation": -0.18,
          "id": "map1_trash_02",
          "typeIndex": 1
        },
        {
          "type": "trash",
          "zIndex": 13,
          "x": 560,
          "y": 470,
          "rotation": 0.1,
          "id": "map1_trash_03",
          "typeIndex": 2
        },
        {
          "type": "trash",
          "zIndex": 14,
          "x": 560,
          "y": 720,
          "rotation": -0.15,
          "id": "map1_trash_04",
          "typeIndex": 3
        },
        {
          "type": "trash",
          "zIndex": 15,
          "x": 540,
          "y": 980,
          "rotation": 0.2,
          "id": "map1_trash_05",
          "typeIndex": 4
        },
        {
          "type": "trash",
          "zIndex": 16,
          "x": 385,
          "y": 1125,
          "rotation": -0.12,
          "id": "map1_trash_06",
          "typeIndex": 0
        },
        {
          "type": "trash",
          "zIndex": 17,
          "x": 530,
          "y": 1265,
          "rotation": 0.16,
          "id": "map1_trash_07",
          "typeIndex": 1
        },
        {
          "type": "trash",
          "zIndex": 18,
          "x": 395,
          "y": 1500,
          "rotation": -0.22,
          "id": "map1_trash_08",
          "typeIndex": 2
        },
        {
          "type": "trash",
          "zIndex": 19,
          "x": 880,
          "y": 1520,
          "rotation": 0.14,
          "id": "map1_trash_09",
          "typeIndex": 3
        },
        {
          "type": "trash",
          "zIndex": 20,
          "x": 880,
          "y": 1680,
          "rotation": -0.1,
          "id": "map1_trash_10",
          "typeIndex": 4
        },
        {
          "type": "trash",
          "zIndex": 21,
          "x": 1030,
          "y": 1040,
          "rotation": 0.18,
          "id": "map1_trash_11",
          "typeIndex": 0
        },
        {
          "type": "trash",
          "zIndex": 22,
          "x": 1250,
          "y": 920,
          "rotation": -0.16,
          "id": "map1_trash_12",
          "typeIndex": 1
        },
        {
          "type": "trash",
          "zIndex": 23,
          "x": 1580,
          "y": 920,
          "rotation": 0.11,
          "id": "map1_trash_13",
          "typeIndex": 2
        },
        {
          "type": "trash",
          "zIndex": 24,
          "x": 1540,
          "y": 1280,
          "rotation": -0.19,
          "id": "map1_trash_14",
          "typeIndex": 3
        },
        {
          "type": "trash",
          "zIndex": 25,
          "x": 1560,
          "y": 540,
          "rotation": 0.21,
          "id": "map1_trash_15",
          "typeIndex": 4
        },
        {
          "type": "trash",
          "zIndex": 26,
          "x": 1584,
          "y": 240,
          "rotation": -0.14,
          "id": "map1_trash_16",
          "typeIndex": 0
        },
        {
          "type": "obstacle",
          "zIndex": 27,
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
          "zIndex": 28,
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
          "zIndex": 29,
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
          "zIndex": 30,
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
          "zIndex": 31,
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
          "zIndex": 32,
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
          "zIndex": 33,
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
          "zIndex": 34,
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
          "zIndex": 35,
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
          "zIndex": 36,
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
          "zIndex": 37,
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
          "zIndex": 38,
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
          "zIndex": 39,
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
          "zIndex": 40,
          "x": 0,
          "y": 528,
          "rotation": 0,
          "w": 10,
          "h": 1504,
          "label": "COLISÃO",
          "id": "map1_obs_nvrl_57"
        },
        {
          "type": "obstacle",
          "zIndex": 41,
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
          "zIndex": 42,
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
          "zIndex": 43,
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
          "zIndex": 44,
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
          "zIndex": 45,
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
          "zIndex": 46,
          "x": 480,
          "y": 0,
          "rotation": 0,
          "w": 592,
          "h": 10,
          "label": "COLISÃO",
          "id": "map1_obs_s8na_64"
        },
        {
          "type": "obstacle",
          "zIndex": 47,
          "x": 1056,
          "y": 0,
          "rotation": 0,
          "w": 960,
          "h": 10,
          "label": "COLISÃO",
          "id": "map1_obs_scpa_65"
        },
        {
          "type": "obstacle",
          "zIndex": 48,
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
          "zIndex": 49,
          "x": 464,
          "y": 544,
          "rotation": 0,
          "id": "map1_trash_w1t6_67",
          "typeIndex": 0
        },
        {
          "type": "trash",
          "zIndex": 50,
          "x": 688,
          "y": 896,
          "rotation": 0,
          "id": "map1_trash_w3nm_68",
          "typeIndex": 0
        },
        {
          "type": "trash",
          "zIndex": 51,
          "x": 512,
          "y": 1072,
          "rotation": 0,
          "id": "map1_trash_wau3_69",
          "typeIndex": 0
        },
        {
          "type": "trash",
          "zIndex": 52,
          "x": 640,
          "y": 1120,
          "rotation": 0,
          "id": "map1_trash_wbf7_70",
          "typeIndex": 0
        },
        {
          "type": "trash",
          "zIndex": 53,
          "x": 656,
          "y": 672,
          "rotation": 0,
          "id": "map1_trash_wco4_71",
          "typeIndex": 0
        },
        {
          "type": "trash",
          "zIndex": 54,
          "x": 656,
          "y": 480,
          "rotation": 0,
          "id": "map1_trash_wsst_72",
          "typeIndex": 0
        },
        {
          "type": "obstacle",
          "zIndex": 55,
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
          "zIndex": 56,
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
          "zIndex": 57,
          "x": 54,
          "y": 1350,
          "rotation": 0,
          "w": 264,
          "h": 323,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvuz7cy6_7dq",
          "polygon": [
            {
              "x": 153,
              "y": 1350
            },
            {
              "x": 54,
              "y": 1466
            },
            {
              "x": 60,
              "y": 1634
            },
            {
              "x": 69,
              "y": 1644
            },
            {
              "x": 161,
              "y": 1538
            },
            {
              "x": 315,
              "y": 1673
            },
            {
              "x": 318,
              "y": 1665
            },
            {
              "x": 317,
              "y": 1482
            },
            {
              "x": 170,
              "y": 1350
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 58,
          "x": 319,
          "y": 1537,
          "rotation": 0,
          "w": 56,
          "h": 171,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvuz8mmf_0tr",
          "polygon": [
            {
              "x": 332,
              "y": 1537
            },
            {
              "x": 327,
              "y": 1541
            },
            {
              "x": 332,
              "y": 1573
            },
            {
              "x": 324,
              "y": 1577
            },
            {
              "x": 329,
              "y": 1595
            },
            {
              "x": 323,
              "y": 1592
            },
            {
              "x": 321,
              "y": 1593
            },
            {
              "x": 319,
              "y": 1620
            },
            {
              "x": 334,
              "y": 1615
            },
            {
              "x": 346,
              "y": 1647
            },
            {
              "x": 341,
              "y": 1660
            },
            {
              "x": 359,
              "y": 1708
            },
            {
              "x": 375,
              "y": 1691
            },
            {
              "x": 374,
              "y": 1679
            },
            {
              "x": 358,
              "y": 1633
            },
            {
              "x": 368,
              "y": 1631
            },
            {
              "x": 358,
              "y": 1576
            },
            {
              "x": 348,
              "y": 1578
            },
            {
              "x": 338,
              "y": 1538
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 59,
          "x": 314,
          "y": 1656,
          "rotation": 0,
          "w": 140,
          "h": 190,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvuza5gq_i8y",
          "polygon": [
            {
              "x": 423,
              "y": 1656
            },
            {
              "x": 398,
              "y": 1679
            },
            {
              "x": 392,
              "y": 1675
            },
            {
              "x": 314,
              "y": 1753
            },
            {
              "x": 314,
              "y": 1762
            },
            {
              "x": 317,
              "y": 1762
            },
            {
              "x": 316,
              "y": 1773
            },
            {
              "x": 329,
              "y": 1779
            },
            {
              "x": 331,
              "y": 1784
            },
            {
              "x": 351,
              "y": 1797
            },
            {
              "x": 355,
              "y": 1799
            },
            {
              "x": 333,
              "y": 1834
            },
            {
              "x": 335,
              "y": 1842
            },
            {
              "x": 338,
              "y": 1846
            },
            {
              "x": 347,
              "y": 1846
            },
            {
              "x": 350,
              "y": 1841
            },
            {
              "x": 368,
              "y": 1813
            },
            {
              "x": 388,
              "y": 1823
            },
            {
              "x": 390,
              "y": 1823
            },
            {
              "x": 440,
              "y": 1761
            },
            {
              "x": 443,
              "y": 1765
            },
            {
              "x": 446,
              "y": 1765
            },
            {
              "x": 450,
              "y": 1765
            },
            {
              "x": 453,
              "y": 1765
            },
            {
              "x": 454,
              "y": 1753
            },
            {
              "x": 451,
              "y": 1745
            },
            {
              "x": 451,
              "y": 1740
            },
            {
              "x": 449,
              "y": 1737
            },
            {
              "x": 451,
              "y": 1731
            },
            {
              "x": 450,
              "y": 1726
            },
            {
              "x": 413,
              "y": 1708
            },
            {
              "x": 406,
              "y": 1700
            },
            {
              "x": 426,
              "y": 1687
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 60,
          "x": 479,
          "y": 1630,
          "rotation": 0,
          "w": 298,
          "h": 249,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvuzb04c_x4h",
          "polygon": [
            {
              "x": 479,
              "y": 1712
            },
            {
              "x": 480,
              "y": 1878
            },
            {
              "x": 614,
              "y": 1790
            },
            {
              "x": 629,
              "y": 1790
            },
            {
              "x": 775,
              "y": 1879
            },
            {
              "x": 777,
              "y": 1712
            },
            {
              "x": 631,
              "y": 1630
            },
            {
              "x": 615,
              "y": 1630
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 61,
          "x": 1109,
          "y": 1877,
          "rotation": 0,
          "w": 22,
          "h": 119,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvuzbirv_pen",
          "polygon": [
            {
              "x": 1109,
              "y": 1891
            },
            {
              "x": 1110,
              "y": 1997
            },
            {
              "x": 1131,
              "y": 1995
            },
            {
              "x": 1132,
              "y": 1877
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 62,
          "x": 1105,
          "y": 1694,
          "rotation": 0,
          "w": 294,
          "h": 256,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvuzdug1_xx7",
          "polygon": [
            {
              "x": 1105,
              "y": 1765
            },
            {
              "x": 1105,
              "y": 1891
            },
            {
              "x": 1127,
              "y": 1880
            },
            {
              "x": 1130,
              "y": 1870
            },
            {
              "x": 1240,
              "y": 1865
            },
            {
              "x": 1276,
              "y": 1865
            },
            {
              "x": 1277,
              "y": 1863
            },
            {
              "x": 1287,
              "y": 1863
            },
            {
              "x": 1287,
              "y": 1867
            },
            {
              "x": 1399,
              "y": 1951
            },
            {
              "x": 1399,
              "y": 1784
            },
            {
              "x": 1289,
              "y": 1709
            },
            {
              "x": 1286,
              "y": 1703
            },
            {
              "x": 1276,
              "y": 1703
            },
            {
              "x": 1275,
              "y": 1694
            },
            {
              "x": 1239,
              "y": 1694
            },
            {
              "x": 1240,
              "y": 1715
            },
            {
              "x": 1134,
              "y": 1714
            },
            {
              "x": 1134,
              "y": 1754
            },
            {
              "x": 1115,
              "y": 1754
            },
            {
              "x": 1113,
              "y": 1765
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 63,
          "x": 1134,
          "y": 1153,
          "rotation": 0,
          "w": 289,
          "h": 240,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvuzknsm_nbb",
          "polygon": [
            {
              "x": 1152,
              "y": 1386
            },
            {
              "x": 1138,
              "y": 1394
            },
            {
              "x": 1134,
              "y": 1389
            },
            {
              "x": 1134,
              "y": 1232
            },
            {
              "x": 1276,
              "y": 1153
            },
            {
              "x": 1286,
              "y": 1153
            },
            {
              "x": 1422,
              "y": 1229
            },
            {
              "x": 1419,
              "y": 1393
            },
            {
              "x": 1287,
              "y": 1299
            },
            {
              "x": 1271,
              "y": 1299
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 64,
          "x": 1099,
          "y": 1323,
          "rotation": 0,
          "w": 120,
          "h": 201,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvuzoc4r_cvg",
          "polygon": [
            {
              "x": 1099,
              "y": 1323
            },
            {
              "x": 1099,
              "y": 1375
            },
            {
              "x": 1101,
              "y": 1380
            },
            {
              "x": 1099,
              "y": 1490
            },
            {
              "x": 1103,
              "y": 1490
            },
            {
              "x": 1113,
              "y": 1488
            },
            {
              "x": 1113,
              "y": 1524
            },
            {
              "x": 1219,
              "y": 1524
            },
            {
              "x": 1217,
              "y": 1489
            },
            {
              "x": 1143,
              "y": 1488
            },
            {
              "x": 1142,
              "y": 1390
            },
            {
              "x": 1140,
              "y": 1324
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 65,
          "x": 1336,
          "y": 1439,
          "rotation": 0,
          "w": 216,
          "h": 86,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvuzpaat_qnd",
          "polygon": [
            {
              "x": 1413,
              "y": 1455
            },
            {
              "x": 1420,
              "y": 1455
            },
            {
              "x": 1427,
              "y": 1449
            },
            {
              "x": 1433,
              "y": 1445
            },
            {
              "x": 1441,
              "y": 1444
            },
            {
              "x": 1450,
              "y": 1447
            },
            {
              "x": 1459,
              "y": 1450
            },
            {
              "x": 1461,
              "y": 1457
            },
            {
              "x": 1491,
              "y": 1458
            },
            {
              "x": 1493,
              "y": 1440
            },
            {
              "x": 1538,
              "y": 1439
            },
            {
              "x": 1541,
              "y": 1440
            },
            {
              "x": 1545,
              "y": 1442
            },
            {
              "x": 1547,
              "y": 1446
            },
            {
              "x": 1551,
              "y": 1452
            },
            {
              "x": 1552,
              "y": 1524
            },
            {
              "x": 1336,
              "y": 1523
            },
            {
              "x": 1336,
              "y": 1492
            },
            {
              "x": 1413,
              "y": 1491
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 66,
          "x": 1218,
          "y": 1489,
          "rotation": 0,
          "w": 10,
          "h": 32,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvuzpu8l_dil",
          "polygon": [
            {
              "x": 1219,
              "y": 1521
            },
            {
              "x": 1227,
              "y": 1520
            },
            {
              "x": 1228,
              "y": 1491
            },
            {
              "x": 1218,
              "y": 1489
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 67,
          "x": 1326,
          "y": 1490,
          "rotation": 0,
          "w": 10,
          "h": 32,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvuzpzn9_2lm",
          "polygon": [
            {
              "x": 1336,
              "y": 1522
            },
            {
              "x": 1327,
              "y": 1522
            },
            {
              "x": 1326,
              "y": 1491
            },
            {
              "x": 1336,
              "y": 1490
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 68,
          "x": 1434,
          "y": 1573,
          "rotation": 0,
          "w": 36,
          "h": 33,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvuzqism_ndd",
          "polygon": [
            {
              "x": 1434,
              "y": 1574
            },
            {
              "x": 1435,
              "y": 1599
            },
            {
              "x": 1441,
              "y": 1605
            },
            {
              "x": 1460,
              "y": 1606
            },
            {
              "x": 1470,
              "y": 1599
            },
            {
              "x": 1469,
              "y": 1573
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 69,
          "x": 1433,
          "y": 1542,
          "rotation": 0,
          "w": 36,
          "h": 39,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvuzr2wm_pp6",
          "polygon": [
            {
              "x": 1433,
              "y": 1553
            },
            {
              "x": 1433,
              "y": 1571
            },
            {
              "x": 1435,
              "y": 1580
            },
            {
              "x": 1444,
              "y": 1580
            },
            {
              "x": 1459,
              "y": 1581
            },
            {
              "x": 1465,
              "y": 1580
            },
            {
              "x": 1469,
              "y": 1578
            },
            {
              "x": 1468,
              "y": 1559
            },
            {
              "x": 1469,
              "y": 1552
            },
            {
              "x": 1466,
              "y": 1546
            },
            {
              "x": 1460,
              "y": 1543
            },
            {
              "x": 1453,
              "y": 1542
            },
            {
              "x": 1447,
              "y": 1542
            },
            {
              "x": 1439,
              "y": 1545
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 70,
          "x": 1410,
          "y": 1806,
          "rotation": 0,
          "w": 38,
          "h": 33,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvuzu1i2_zpl",
          "polygon": [
            {
              "x": 1413,
              "y": 1806
            },
            {
              "x": 1413,
              "y": 1809
            },
            {
              "x": 1410,
              "y": 1809
            },
            {
              "x": 1411,
              "y": 1815
            },
            {
              "x": 1413,
              "y": 1816
            },
            {
              "x": 1412,
              "y": 1826
            },
            {
              "x": 1417,
              "y": 1834
            },
            {
              "x": 1425,
              "y": 1838
            },
            {
              "x": 1433,
              "y": 1838
            },
            {
              "x": 1442,
              "y": 1833
            },
            {
              "x": 1447,
              "y": 1825
            },
            {
              "x": 1445,
              "y": 1817
            },
            {
              "x": 1448,
              "y": 1813
            },
            {
              "x": 1447,
              "y": 1811
            },
            {
              "x": 1446,
              "y": 1811
            },
            {
              "x": 1446,
              "y": 1808
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 71,
          "x": 1412,
          "y": 1776,
          "rotation": 0,
          "w": 35,
          "h": 36,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvuzufh6_8o4",
          "polygon": [
            {
              "x": 1412,
              "y": 1783
            },
            {
              "x": 1414,
              "y": 1794
            },
            {
              "x": 1414,
              "y": 1810
            },
            {
              "x": 1446,
              "y": 1812
            },
            {
              "x": 1445,
              "y": 1797
            },
            {
              "x": 1447,
              "y": 1789
            },
            {
              "x": 1445,
              "y": 1781
            },
            {
              "x": 1439,
              "y": 1777
            },
            {
              "x": 1429,
              "y": 1776
            },
            {
              "x": 1421,
              "y": 1776
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 72,
          "x": 271,
          "y": 291,
          "rotation": 0,
          "w": 45,
          "h": 49,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvuzvz4d_fnc",
          "polygon": [
            {
              "x": 308,
              "y": 340
            },
            {
              "x": 316,
              "y": 340
            },
            {
              "x": 313,
              "y": 331
            },
            {
              "x": 314,
              "y": 317
            },
            {
              "x": 313,
              "y": 306
            },
            {
              "x": 311,
              "y": 298
            },
            {
              "x": 305,
              "y": 295
            },
            {
              "x": 304,
              "y": 295
            },
            {
              "x": 303,
              "y": 293
            },
            {
              "x": 299,
              "y": 293
            },
            {
              "x": 298,
              "y": 293
            },
            {
              "x": 294,
              "y": 291
            },
            {
              "x": 285,
              "y": 291
            },
            {
              "x": 277,
              "y": 292
            },
            {
              "x": 272,
              "y": 292
            },
            {
              "x": 271,
              "y": 300
            },
            {
              "x": 274,
              "y": 301
            },
            {
              "x": 274,
              "y": 306
            },
            {
              "x": 275,
              "y": 308
            },
            {
              "x": 288,
              "y": 308
            },
            {
              "x": 295,
              "y": 308
            },
            {
              "x": 296,
              "y": 304
            },
            {
              "x": 296,
              "y": 302
            },
            {
              "x": 299,
              "y": 300
            },
            {
              "x": 304,
              "y": 302
            },
            {
              "x": 304,
              "y": 309
            },
            {
              "x": 304,
              "y": 316
            },
            {
              "x": 306,
              "y": 320
            },
            {
              "x": 306,
              "y": 332
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 73,
          "x": 568,
          "y": 752,
          "rotation": 0,
          "w": 64,
          "h": 39,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvuzx5am_lpg",
          "polygon": [
            {
              "x": 603,
              "y": 767
            },
            {
              "x": 605,
              "y": 774
            },
            {
              "x": 627,
              "y": 775
            },
            {
              "x": 628,
              "y": 770
            },
            {
              "x": 629,
              "y": 766
            },
            {
              "x": 631,
              "y": 766
            },
            {
              "x": 631,
              "y": 755
            },
            {
              "x": 626,
              "y": 752
            },
            {
              "x": 602,
              "y": 753
            },
            {
              "x": 602,
              "y": 756
            },
            {
              "x": 591,
              "y": 755
            },
            {
              "x": 587,
              "y": 756
            },
            {
              "x": 581,
              "y": 761
            },
            {
              "x": 573,
              "y": 770
            },
            {
              "x": 570,
              "y": 776
            },
            {
              "x": 568,
              "y": 786
            },
            {
              "x": 568,
              "y": 792
            },
            {
              "x": 576,
              "y": 792
            },
            {
              "x": 576,
              "y": 781
            },
            {
              "x": 577,
              "y": 776
            },
            {
              "x": 582,
              "y": 769
            },
            {
              "x": 586,
              "y": 763
            },
            {
              "x": 591,
              "y": 761
            },
            {
              "x": 603,
              "y": 761
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 74,
          "x": 560,
          "y": 787,
          "rotation": 0,
          "w": 18,
          "h": 128,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvuzy22w_19w",
          "polygon": [
            {
              "x": 567,
              "y": 789
            },
            {
              "x": 578,
              "y": 787
            },
            {
              "x": 576,
              "y": 815
            },
            {
              "x": 576,
              "y": 837
            },
            {
              "x": 574,
              "y": 885
            },
            {
              "x": 577,
              "y": 885
            },
            {
              "x": 577,
              "y": 906
            },
            {
              "x": 577,
              "y": 911
            },
            {
              "x": 570,
              "y": 916
            },
            {
              "x": 563,
              "y": 914
            },
            {
              "x": 561,
              "y": 911
            },
            {
              "x": 560,
              "y": 908
            },
            {
              "x": 563,
              "y": 908
            },
            {
              "x": 562,
              "y": 883
            },
            {
              "x": 565,
              "y": 882
            },
            {
              "x": 564,
              "y": 830
            },
            {
              "x": 566,
              "y": 827
            },
            {
              "x": 566,
              "y": 804
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 75,
          "x": 568,
          "y": 489,
          "rotation": 0,
          "w": 63,
          "h": 46,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvuzzl0x_gxo",
          "polygon": [
            {
              "x": 568,
              "y": 508
            },
            {
              "x": 573,
              "y": 513
            },
            {
              "x": 593,
              "y": 514
            },
            {
              "x": 596,
              "y": 507
            },
            {
              "x": 598,
              "y": 507
            },
            {
              "x": 598,
              "y": 499
            },
            {
              "x": 616,
              "y": 497
            },
            {
              "x": 622,
              "y": 503
            },
            {
              "x": 623,
              "y": 515
            },
            {
              "x": 623,
              "y": 535
            },
            {
              "x": 632,
              "y": 535
            },
            {
              "x": 632,
              "y": 520
            },
            {
              "x": 629,
              "y": 516
            },
            {
              "x": 630,
              "y": 508
            },
            {
              "x": 628,
              "y": 503
            },
            {
              "x": 626,
              "y": 495
            },
            {
              "x": 620,
              "y": 491
            },
            {
              "x": 614,
              "y": 489
            },
            {
              "x": 600,
              "y": 490
            },
            {
              "x": 596,
              "y": 492
            },
            {
              "x": 593,
              "y": 491
            },
            {
              "x": 579,
              "y": 491
            },
            {
              "x": 574,
              "y": 493
            },
            {
              "x": 571,
              "y": 500
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 76,
          "x": 619,
          "y": 530,
          "rotation": 0,
          "w": 18,
          "h": 107,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv00s4i_e1c",
          "polygon": [
            {
              "x": 631,
              "y": 530
            },
            {
              "x": 623,
              "y": 531
            },
            {
              "x": 623,
              "y": 606
            },
            {
              "x": 620,
              "y": 605
            },
            {
              "x": 621,
              "y": 627
            },
            {
              "x": 620,
              "y": 628
            },
            {
              "x": 619,
              "y": 633
            },
            {
              "x": 625,
              "y": 637
            },
            {
              "x": 633,
              "y": 637
            },
            {
              "x": 638,
              "y": 634
            },
            {
              "x": 638,
              "y": 630
            },
            {
              "x": 636,
              "y": 627
            },
            {
              "x": 634,
              "y": 627
            },
            {
              "x": 635,
              "y": 605
            },
            {
              "x": 633,
              "y": 604
            },
            {
              "x": 633,
              "y": 546
            },
            {
              "x": 631,
              "y": 544
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 77,
          "x": 292,
          "y": 533,
          "rotation": 0,
          "w": 77,
          "h": 61,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvv02kz9_91u",
          "polygon": [
            {
              "x": 302,
              "y": 592
            },
            {
              "x": 295,
              "y": 592
            },
            {
              "x": 292,
              "y": 590
            },
            {
              "x": 300,
              "y": 584
            },
            {
              "x": 300,
              "y": 579
            },
            {
              "x": 296,
              "y": 575
            },
            {
              "x": 304,
              "y": 572
            },
            {
              "x": 311,
              "y": 569
            },
            {
              "x": 305,
              "y": 563
            },
            {
              "x": 297,
              "y": 558
            },
            {
              "x": 305,
              "y": 555
            },
            {
              "x": 309,
              "y": 555
            },
            {
              "x": 309,
              "y": 547
            },
            {
              "x": 312,
              "y": 543
            },
            {
              "x": 317,
              "y": 547
            },
            {
              "x": 319,
              "y": 542
            },
            {
              "x": 320,
              "y": 541
            },
            {
              "x": 325,
              "y": 547
            },
            {
              "x": 328,
              "y": 533
            },
            {
              "x": 332,
              "y": 533
            },
            {
              "x": 336,
              "y": 543
            },
            {
              "x": 337,
              "y": 551
            },
            {
              "x": 345,
              "y": 545
            },
            {
              "x": 347,
              "y": 542
            },
            {
              "x": 352,
              "y": 542
            },
            {
              "x": 353,
              "y": 544
            },
            {
              "x": 349,
              "y": 545
            },
            {
              "x": 349,
              "y": 549
            },
            {
              "x": 352,
              "y": 549
            },
            {
              "x": 352,
              "y": 556
            },
            {
              "x": 365,
              "y": 555
            },
            {
              "x": 365,
              "y": 559
            },
            {
              "x": 362,
              "y": 563
            },
            {
              "x": 358,
              "y": 564
            },
            {
              "x": 359,
              "y": 567
            },
            {
              "x": 364,
              "y": 569
            },
            {
              "x": 368,
              "y": 570
            },
            {
              "x": 369,
              "y": 574
            },
            {
              "x": 365,
              "y": 576
            },
            {
              "x": 367,
              "y": 578
            },
            {
              "x": 369,
              "y": 584
            },
            {
              "x": 365,
              "y": 586
            },
            {
              "x": 363,
              "y": 589
            },
            {
              "x": 367,
              "y": 594
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 78,
          "x": 294,
          "y": 588,
          "rotation": 0,
          "w": 79,
          "h": 44,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv03lf2_gth",
          "polygon": [
            {
              "x": 317,
              "y": 622
            },
            {
              "x": 308,
              "y": 627
            },
            {
              "x": 307,
              "y": 619
            },
            {
              "x": 311,
              "y": 617
            },
            {
              "x": 302,
              "y": 614
            },
            {
              "x": 296,
              "y": 611
            },
            {
              "x": 297,
              "y": 605
            },
            {
              "x": 302,
              "y": 602
            },
            {
              "x": 304,
              "y": 597
            },
            {
              "x": 302,
              "y": 594
            },
            {
              "x": 295,
              "y": 593
            },
            {
              "x": 294,
              "y": 588
            },
            {
              "x": 365,
              "y": 589
            },
            {
              "x": 367,
              "y": 591
            },
            {
              "x": 368,
              "y": 594
            },
            {
              "x": 365,
              "y": 595
            },
            {
              "x": 369,
              "y": 598
            },
            {
              "x": 372,
              "y": 600
            },
            {
              "x": 372,
              "y": 607
            },
            {
              "x": 370,
              "y": 608
            },
            {
              "x": 366,
              "y": 612
            },
            {
              "x": 367,
              "y": 616
            },
            {
              "x": 367,
              "y": 622
            },
            {
              "x": 357,
              "y": 621
            },
            {
              "x": 353,
              "y": 626
            },
            {
              "x": 354,
              "y": 629
            },
            {
              "x": 347,
              "y": 630
            },
            {
              "x": 340,
              "y": 630
            },
            {
              "x": 334,
              "y": 631
            },
            {
              "x": 328,
              "y": 633
            },
            {
              "x": 322,
              "y": 631
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 79,
          "x": 3,
          "y": 301,
          "rotation": 0,
          "w": 122,
          "h": 259,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv04u9b_vfi",
          "polygon": [
            {
              "x": 48,
              "y": 560
            },
            {
              "x": 32,
              "y": 553
            },
            {
              "x": 13,
              "y": 540
            },
            {
              "x": 3,
              "y": 533
            },
            {
              "x": 4,
              "y": 301
            },
            {
              "x": 16,
              "y": 301
            },
            {
              "x": 18,
              "y": 326
            },
            {
              "x": 112,
              "y": 418
            },
            {
              "x": 112,
              "y": 435
            },
            {
              "x": 125,
              "y": 435
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 80,
          "x": 400,
          "y": 137,
          "rotation": 0,
          "w": 36,
          "h": 70,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv058o8_p2k",
          "polygon": [
            {
              "x": 436,
              "y": 193
            },
            {
              "x": 407,
              "y": 207
            },
            {
              "x": 400,
              "y": 140
            },
            {
              "x": 410,
              "y": 137
            },
            {
              "x": 420,
              "y": 137
            },
            {
              "x": 428,
              "y": 137
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 81,
          "x": 433,
          "y": 173,
          "rotation": 0,
          "w": 21,
          "h": 24,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv05day_65s",
          "polygon": [
            {
              "x": 452,
              "y": 173
            },
            {
              "x": 436,
              "y": 187
            },
            {
              "x": 433,
              "y": 197
            },
            {
              "x": 449,
              "y": 192
            },
            {
              "x": 454,
              "y": 187
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 82,
          "x": 462,
          "y": 112,
          "rotation": 0,
          "w": 13,
          "h": 41,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv05jq3_865",
          "polygon": [
            {
              "x": 466,
              "y": 112
            },
            {
              "x": 475,
              "y": 119
            },
            {
              "x": 474,
              "y": 128
            },
            {
              "x": 473,
              "y": 138
            },
            {
              "x": 468,
              "y": 152
            },
            {
              "x": 462,
              "y": 153
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 83,
          "x": 462,
          "y": -7,
          "rotation": 0,
          "w": 18,
          "h": 24,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv05z35_bs7",
          "polygon": [
            {
              "x": 462,
              "y": 17
            },
            {
              "x": 462,
              "y": -7
            },
            {
              "x": 480,
              "y": -4
            },
            {
              "x": 480,
              "y": 13
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 84,
          "x": 559,
          "y": 112,
          "rotation": 0,
          "w": 280,
          "h": 159,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvv07ph7_1f1",
          "polygon": [
            {
              "x": 561,
              "y": 136
            },
            {
              "x": 559,
              "y": 142
            },
            {
              "x": 559,
              "y": 146
            },
            {
              "x": 560,
              "y": 150
            },
            {
              "x": 559,
              "y": 271
            },
            {
              "x": 836,
              "y": 269
            },
            {
              "x": 836,
              "y": 148
            },
            {
              "x": 836,
              "y": 144
            },
            {
              "x": 836,
              "y": 137
            },
            {
              "x": 834,
              "y": 137
            },
            {
              "x": 839,
              "y": 117
            },
            {
              "x": 839,
              "y": 112
            },
            {
              "x": 568,
              "y": 113
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 85,
          "x": 824,
          "y": 196,
          "rotation": 0,
          "w": 77,
          "h": 121,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvv08kkc_hh8",
          "polygon": [
            {
              "x": 824,
              "y": 272
            },
            {
              "x": 825,
              "y": 291
            },
            {
              "x": 845,
              "y": 297
            },
            {
              "x": 864,
              "y": 305
            },
            {
              "x": 881,
              "y": 312
            },
            {
              "x": 887,
              "y": 317
            },
            {
              "x": 893,
              "y": 317
            },
            {
              "x": 893,
              "y": 304
            },
            {
              "x": 901,
              "y": 308
            },
            {
              "x": 901,
              "y": 223
            },
            {
              "x": 837,
              "y": 196
            },
            {
              "x": 836,
              "y": 271
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 86,
          "x": 230,
          "y": 625,
          "rotation": 0,
          "w": 232,
          "h": 171,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvv0c87t_fcd",
          "polygon": [
            {
              "x": 239,
              "y": 747
            },
            {
              "x": 230,
              "y": 745
            },
            {
              "x": 230,
              "y": 625
            },
            {
              "x": 462,
              "y": 678
            },
            {
              "x": 462,
              "y": 797
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 87,
          "x": 226,
          "y": 873,
          "rotation": 0,
          "w": 79,
          "h": 83,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv0d6te_byl",
          "polygon": [
            {
              "x": 242,
              "y": 887
            },
            {
              "x": 243,
              "y": 899
            },
            {
              "x": 246,
              "y": 902
            },
            {
              "x": 241,
              "y": 905
            },
            {
              "x": 233,
              "y": 908
            },
            {
              "x": 227,
              "y": 918
            },
            {
              "x": 226,
              "y": 929
            },
            {
              "x": 227,
              "y": 941
            },
            {
              "x": 234,
              "y": 949
            },
            {
              "x": 241,
              "y": 956
            },
            {
              "x": 251,
              "y": 956
            },
            {
              "x": 263,
              "y": 953
            },
            {
              "x": 269,
              "y": 944
            },
            {
              "x": 272,
              "y": 934
            },
            {
              "x": 270,
              "y": 922
            },
            {
              "x": 264,
              "y": 913
            },
            {
              "x": 260,
              "y": 910
            },
            {
              "x": 302,
              "y": 912
            },
            {
              "x": 302,
              "y": 902
            },
            {
              "x": 305,
              "y": 901
            },
            {
              "x": 304,
              "y": 896
            },
            {
              "x": 301,
              "y": 890
            },
            {
              "x": 300,
              "y": 885
            },
            {
              "x": 297,
              "y": 880
            },
            {
              "x": 292,
              "y": 877
            },
            {
              "x": 282,
              "y": 875
            },
            {
              "x": 279,
              "y": 877
            },
            {
              "x": 278,
              "y": 880
            },
            {
              "x": 274,
              "y": 884
            },
            {
              "x": 272,
              "y": 882
            },
            {
              "x": 267,
              "y": 873
            },
            {
              "x": 264,
              "y": 873
            },
            {
              "x": 255,
              "y": 877
            },
            {
              "x": 249,
              "y": 880
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 88,
          "x": 385,
          "y": 870,
          "rotation": 0,
          "w": 58,
          "h": 43,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv0dlq2_cer",
          "polygon": [
            {
              "x": 388,
              "y": 890
            },
            {
              "x": 387,
              "y": 895
            },
            {
              "x": 385,
              "y": 899
            },
            {
              "x": 387,
              "y": 906
            },
            {
              "x": 387,
              "y": 913
            },
            {
              "x": 399,
              "y": 913
            },
            {
              "x": 425,
              "y": 913
            },
            {
              "x": 433,
              "y": 908
            },
            {
              "x": 436,
              "y": 904
            },
            {
              "x": 443,
              "y": 895
            },
            {
              "x": 443,
              "y": 889
            },
            {
              "x": 439,
              "y": 880
            },
            {
              "x": 426,
              "y": 874
            },
            {
              "x": 409,
              "y": 871
            },
            {
              "x": 402,
              "y": 870
            },
            {
              "x": 397,
              "y": 872
            },
            {
              "x": 393,
              "y": 876
            },
            {
              "x": 392,
              "y": 880
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 89,
          "x": 394,
          "y": 921,
          "rotation": 0,
          "w": 34,
          "h": 36,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv0edib_b5t",
          "polygon": [
            {
              "x": 402,
              "y": 922
            },
            {
              "x": 394,
              "y": 927
            },
            {
              "x": 394,
              "y": 933
            },
            {
              "x": 394,
              "y": 941
            },
            {
              "x": 397,
              "y": 947
            },
            {
              "x": 404,
              "y": 956
            },
            {
              "x": 417,
              "y": 957
            },
            {
              "x": 428,
              "y": 951
            },
            {
              "x": 428,
              "y": 938
            },
            {
              "x": 426,
              "y": 926
            },
            {
              "x": 423,
              "y": 921
            },
            {
              "x": 412,
              "y": 921
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 90,
          "x": -4,
          "y": 781,
          "rotation": 0,
          "w": 157,
          "h": 422,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv0fgsc_jmn",
          "polygon": [
            {
              "x": -4,
              "y": 781
            },
            {
              "x": 150,
              "y": 784
            },
            {
              "x": 150,
              "y": 1009
            },
            {
              "x": 148,
              "y": 1010
            },
            {
              "x": 147,
              "y": 1127
            },
            {
              "x": 153,
              "y": 1129
            },
            {
              "x": 152,
              "y": 1175
            },
            {
              "x": 138,
              "y": 1175
            },
            {
              "x": 128,
              "y": 1177
            },
            {
              "x": 118,
              "y": 1177
            },
            {
              "x": 93,
              "y": 1175
            },
            {
              "x": 84,
              "y": 1175
            },
            {
              "x": 86,
              "y": 1182
            },
            {
              "x": 86,
              "y": 1188
            },
            {
              "x": 76,
              "y": 1193
            },
            {
              "x": 54,
              "y": 1199
            },
            {
              "x": 33,
              "y": 1202
            },
            {
              "x": 20,
              "y": 1203
            },
            {
              "x": 15,
              "y": 1201
            },
            {
              "x": 11,
              "y": 1198
            },
            {
              "x": 1,
              "y": 1201
            },
            {
              "x": 1,
              "y": 1175
            },
            {
              "x": 2,
              "y": 1160
            },
            {
              "x": 2,
              "y": 1150
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 91,
          "x": 891,
          "y": 505,
          "rotation": 0,
          "w": 230,
          "h": 247,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv0hctr_0u9",
          "polygon": [
            {
              "x": 891,
              "y": 750
            },
            {
              "x": 891,
              "y": 611
            },
            {
              "x": 894,
              "y": 505
            },
            {
              "x": 1117,
              "y": 506
            },
            {
              "x": 1121,
              "y": 752
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 92,
          "x": 880,
          "y": 381,
          "rotation": 0,
          "w": 247,
          "h": 236,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvv0ir5l_6bb",
          "polygon": [
            {
              "x": 900,
              "y": 604
            },
            {
              "x": 888,
              "y": 617
            },
            {
              "x": 882,
              "y": 612
            },
            {
              "x": 880,
              "y": 488
            },
            {
              "x": 995,
              "y": 384
            },
            {
              "x": 995,
              "y": 381
            },
            {
              "x": 1010,
              "y": 381
            },
            {
              "x": 1011,
              "y": 385
            },
            {
              "x": 1059,
              "y": 433
            },
            {
              "x": 1059,
              "y": 418
            },
            {
              "x": 1082,
              "y": 417
            },
            {
              "x": 1083,
              "y": 439
            },
            {
              "x": 1080,
              "y": 443
            },
            {
              "x": 1080,
              "y": 449
            },
            {
              "x": 1127,
              "y": 492
            },
            {
              "x": 1124,
              "y": 608
            },
            {
              "x": 1123,
              "y": 612
            },
            {
              "x": 1004,
              "y": 501
            },
            {
              "x": 999,
              "y": 503
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 93,
          "x": 1126,
          "y": 528,
          "rotation": 0,
          "w": 59,
          "h": 195,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv0jsoi_mww",
          "polygon": [
            {
              "x": 1129,
              "y": 533
            },
            {
              "x": 1127,
              "y": 661
            },
            {
              "x": 1131,
              "y": 662
            },
            {
              "x": 1133,
              "y": 668
            },
            {
              "x": 1133,
              "y": 674
            },
            {
              "x": 1130,
              "y": 676
            },
            {
              "x": 1127,
              "y": 685
            },
            {
              "x": 1126,
              "y": 693
            },
            {
              "x": 1128,
              "y": 700
            },
            {
              "x": 1134,
              "y": 707
            },
            {
              "x": 1136,
              "y": 713
            },
            {
              "x": 1138,
              "y": 721
            },
            {
              "x": 1148,
              "y": 721
            },
            {
              "x": 1166,
              "y": 723
            },
            {
              "x": 1175,
              "y": 719
            },
            {
              "x": 1180,
              "y": 715
            },
            {
              "x": 1184,
              "y": 708
            },
            {
              "x": 1185,
              "y": 698
            },
            {
              "x": 1184,
              "y": 693
            },
            {
              "x": 1182,
              "y": 691
            },
            {
              "x": 1181,
              "y": 682
            },
            {
              "x": 1182,
              "y": 675
            },
            {
              "x": 1174,
              "y": 673
            },
            {
              "x": 1176,
              "y": 666
            },
            {
              "x": 1171,
              "y": 665
            },
            {
              "x": 1170,
              "y": 658
            },
            {
              "x": 1167,
              "y": 658
            },
            {
              "x": 1173,
              "y": 655
            },
            {
              "x": 1175,
              "y": 653
            },
            {
              "x": 1176,
              "y": 643
            },
            {
              "x": 1173,
              "y": 528
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 94,
          "x": 752,
          "y": 807,
          "rotation": 0,
          "w": 210,
          "h": 78,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv0kma3_p0j",
          "polygon": [
            {
              "x": 752,
              "y": 807
            },
            {
              "x": 798,
              "y": 807
            },
            {
              "x": 798,
              "y": 861
            },
            {
              "x": 963,
              "y": 865
            },
            {
              "x": 959,
              "y": 885
            },
            {
              "x": 752,
              "y": 882
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 95,
          "x": 226,
          "y": 1064,
          "rotation": 0,
          "w": 115,
          "h": 174,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv0mlpz_zws",
          "polygon": [
            {
              "x": 268,
              "y": 1074
            },
            {
              "x": 274,
              "y": 1064
            },
            {
              "x": 278,
              "y": 1065
            },
            {
              "x": 277,
              "y": 1072
            },
            {
              "x": 303,
              "y": 1073
            },
            {
              "x": 324,
              "y": 1078
            },
            {
              "x": 337,
              "y": 1084
            },
            {
              "x": 341,
              "y": 1094
            },
            {
              "x": 341,
              "y": 1104
            },
            {
              "x": 337,
              "y": 1108
            },
            {
              "x": 337,
              "y": 1117
            },
            {
              "x": 341,
              "y": 1121
            },
            {
              "x": 339,
              "y": 1134
            },
            {
              "x": 335,
              "y": 1138
            },
            {
              "x": 325,
              "y": 1178
            },
            {
              "x": 322,
              "y": 1186
            },
            {
              "x": 319,
              "y": 1201
            },
            {
              "x": 316,
              "y": 1209
            },
            {
              "x": 315,
              "y": 1216
            },
            {
              "x": 311,
              "y": 1229
            },
            {
              "x": 305,
              "y": 1238
            },
            {
              "x": 283,
              "y": 1237
            },
            {
              "x": 256,
              "y": 1235
            },
            {
              "x": 236,
              "y": 1231
            },
            {
              "x": 226,
              "y": 1221
            },
            {
              "x": 227,
              "y": 1212
            },
            {
              "x": 228,
              "y": 1202
            },
            {
              "x": 231,
              "y": 1193
            },
            {
              "x": 239,
              "y": 1161
            },
            {
              "x": 235,
              "y": 1154
            },
            {
              "x": 234,
              "y": 1147
            },
            {
              "x": 240,
              "y": 1147
            },
            {
              "x": 242,
              "y": 1147
            },
            {
              "x": 249,
              "y": 1127
            },
            {
              "x": 253,
              "y": 1115
            },
            {
              "x": 256,
              "y": 1103
            },
            {
              "x": 260,
              "y": 1094
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 96,
          "x": 325,
          "y": 1142,
          "rotation": 0,
          "w": 19,
          "h": 44,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv0n87r_zb6",
          "polygon": [
            {
              "x": 335,
              "y": 1142
            },
            {
              "x": 344,
              "y": 1142
            },
            {
              "x": 342,
              "y": 1166
            },
            {
              "x": 341,
              "y": 1181
            },
            {
              "x": 325,
              "y": 1186
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 97,
          "x": 1177,
          "y": 400,
          "rotation": 0,
          "w": 269,
          "h": 163,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvv0osvc_syv",
          "polygon": [
            {
              "x": 1184,
              "y": 563
            },
            {
              "x": 1177,
              "y": 560
            },
            {
              "x": 1178,
              "y": 440
            },
            {
              "x": 1177,
              "y": 429
            },
            {
              "x": 1180,
              "y": 425
            },
            {
              "x": 1187,
              "y": 401
            },
            {
              "x": 1443,
              "y": 400
            },
            {
              "x": 1442,
              "y": 424
            },
            {
              "x": 1445,
              "y": 424
            },
            {
              "x": 1444,
              "y": 436
            },
            {
              "x": 1443,
              "y": 563
            },
            {
              "x": 1195,
              "y": 560
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 98,
          "x": 1072,
          "y": 89,
          "rotation": 0,
          "w": 290,
          "h": 206,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv0rwdo_r97",
          "polygon": [
            {
              "x": 1077,
              "y": 133
            },
            {
              "x": 1076,
              "y": 289
            },
            {
              "x": 1175,
              "y": 292
            },
            {
              "x": 1182,
              "y": 295
            },
            {
              "x": 1185,
              "y": 295
            },
            {
              "x": 1185,
              "y": 292
            },
            {
              "x": 1230,
              "y": 291
            },
            {
              "x": 1233,
              "y": 292
            },
            {
              "x": 1237,
              "y": 293
            },
            {
              "x": 1358,
              "y": 292
            },
            {
              "x": 1357,
              "y": 130
            },
            {
              "x": 1360,
              "y": 126
            },
            {
              "x": 1361,
              "y": 89
            },
            {
              "x": 1072,
              "y": 91
            },
            {
              "x": 1072,
              "y": 126
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 99,
          "x": 1073,
          "y": -1,
          "rotation": 0,
          "w": 288,
          "h": 103,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvv0siw5_8nn",
          "polygon": [
            {
              "x": 1074,
              "y": 0
            },
            {
              "x": 1073,
              "y": 100
            },
            {
              "x": 1361,
              "y": 102
            },
            {
              "x": 1360,
              "y": -1
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 100,
          "x": 1016,
          "y": 52,
          "rotation": 0,
          "w": 60,
          "h": 119,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv0t459_jsm",
          "polygon": [
            {
              "x": 1072,
              "y": 52
            },
            {
              "x": 1016,
              "y": 75
            },
            {
              "x": 1017,
              "y": 158
            },
            {
              "x": 1018,
              "y": 171
            },
            {
              "x": 1076,
              "y": 154
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 101,
          "x": 795,
          "y": 1861,
          "rotation": 0,
          "w": 45,
          "h": 46,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv0umfj_8bo",
          "polygon": [
            {
              "x": 809,
              "y": 1907
            },
            {
              "x": 822,
              "y": 1907
            },
            {
              "x": 831,
              "y": 1905
            },
            {
              "x": 837,
              "y": 1898
            },
            {
              "x": 840,
              "y": 1887
            },
            {
              "x": 840,
              "y": 1877
            },
            {
              "x": 835,
              "y": 1867
            },
            {
              "x": 824,
              "y": 1862
            },
            {
              "x": 814,
              "y": 1861
            },
            {
              "x": 803,
              "y": 1864
            },
            {
              "x": 798,
              "y": 1875
            },
            {
              "x": 797,
              "y": 1884
            },
            {
              "x": 795,
              "y": 1892
            },
            {
              "x": 796,
              "y": 1896
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 102,
          "x": 861,
          "y": 1779,
          "rotation": 0,
          "w": 36,
          "h": 20,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv0vbu0_btk",
          "polygon": [
            {
              "x": 862,
              "y": 1781
            },
            {
              "x": 872,
              "y": 1788
            },
            {
              "x": 880,
              "y": 1787
            },
            {
              "x": 890,
              "y": 1784
            },
            {
              "x": 894,
              "y": 1779
            },
            {
              "x": 897,
              "y": 1780
            },
            {
              "x": 897,
              "y": 1789
            },
            {
              "x": 895,
              "y": 1793
            },
            {
              "x": 885,
              "y": 1798
            },
            {
              "x": 877,
              "y": 1799
            },
            {
              "x": 865,
              "y": 1797
            },
            {
              "x": 861,
              "y": 1793
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 103,
          "x": 861,
          "y": 1757,
          "rotation": 0,
          "w": 36,
          "h": 34,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvv0vr2g_b2u",
          "polygon": [
            {
              "x": 861,
              "y": 1766
            },
            {
              "x": 862,
              "y": 1773
            },
            {
              "x": 863,
              "y": 1781
            },
            {
              "x": 864,
              "y": 1789
            },
            {
              "x": 877,
              "y": 1791
            },
            {
              "x": 885,
              "y": 1790
            },
            {
              "x": 892,
              "y": 1788
            },
            {
              "x": 894,
              "y": 1786
            },
            {
              "x": 896,
              "y": 1783
            },
            {
              "x": 896,
              "y": 1777
            },
            {
              "x": 897,
              "y": 1768
            },
            {
              "x": 895,
              "y": 1761
            },
            {
              "x": 889,
              "y": 1758
            },
            {
              "x": 879,
              "y": 1757
            },
            {
              "x": 872,
              "y": 1757
            },
            {
              "x": 867,
              "y": 1762
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 104,
          "x": 869,
          "y": 1805,
          "rotation": 0,
          "w": 63,
          "h": 53,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv0wm7t_52b",
          "polygon": [
            {
              "x": 887,
              "y": 1805
            },
            {
              "x": 874,
              "y": 1818
            },
            {
              "x": 871,
              "y": 1823
            },
            {
              "x": 869,
              "y": 1830
            },
            {
              "x": 871,
              "y": 1839
            },
            {
              "x": 875,
              "y": 1847
            },
            {
              "x": 877,
              "y": 1848
            },
            {
              "x": 881,
              "y": 1855
            },
            {
              "x": 890,
              "y": 1858
            },
            {
              "x": 897,
              "y": 1857
            },
            {
              "x": 905,
              "y": 1855
            },
            {
              "x": 908,
              "y": 1853
            },
            {
              "x": 913,
              "y": 1847
            },
            {
              "x": 925,
              "y": 1830
            },
            {
              "x": 930,
              "y": 1820
            },
            {
              "x": 932,
              "y": 1815
            },
            {
              "x": 929,
              "y": 1810
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 105,
          "x": 884,
          "y": 1789,
          "rotation": 0,
          "w": 50,
          "h": 25,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvv0wyaa_8kx",
          "polygon": [
            {
              "x": 900,
              "y": 1789
            },
            {
              "x": 890,
              "y": 1799
            },
            {
              "x": 887,
              "y": 1805
            },
            {
              "x": 884,
              "y": 1815
            },
            {
              "x": 911,
              "y": 1814
            },
            {
              "x": 923,
              "y": 1814
            },
            {
              "x": 934,
              "y": 1815
            },
            {
              "x": 923,
              "y": 1803
            },
            {
              "x": 916,
              "y": 1796
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 106,
          "x": 75,
          "y": 1528,
          "rotation": 0,
          "w": 237,
          "h": 271,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv134a2_4lu",
          "polygon": [
            {
              "x": 76,
              "y": 1634
            },
            {
              "x": 75,
              "y": 1798
            },
            {
              "x": 312,
              "y": 1798
            },
            {
              "x": 309,
              "y": 1670
            },
            {
              "x": 303,
              "y": 1529
            },
            {
              "x": 76,
              "y": 1528
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 107,
          "x": 1177,
          "y": 934,
          "rotation": 0,
          "w": 21,
          "h": 88,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv1471g_vib",
          "polygon": [
            {
              "x": 1182,
              "y": 935
            },
            {
              "x": 1192,
              "y": 934
            },
            {
              "x": 1193,
              "y": 992
            },
            {
              "x": 1195,
              "y": 993
            },
            {
              "x": 1194,
              "y": 1013
            },
            {
              "x": 1198,
              "y": 1018
            },
            {
              "x": 1193,
              "y": 1023
            },
            {
              "x": 1184,
              "y": 1023
            },
            {
              "x": 1178,
              "y": 1020
            },
            {
              "x": 1177,
              "y": 1013
            },
            {
              "x": 1180,
              "y": 1012
            },
            {
              "x": 1181,
              "y": 992
            },
            {
              "x": 1183,
              "y": 991
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 108,
          "x": 1182,
          "y": 903,
          "rotation": 0,
          "w": 11,
          "h": 37,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv159b8_zxc",
          "polygon": [
            {
              "x": 1184,
              "y": 903
            },
            {
              "x": 1193,
              "y": 903
            },
            {
              "x": 1193,
              "y": 939
            },
            {
              "x": 1182,
              "y": 939
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 109,
          "x": 1137,
          "y": 874,
          "rotation": 0,
          "w": 55,
          "h": 35,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvv16mla_ii5",
          "polygon": [
            {
              "x": 1162,
              "y": 889
            },
            {
              "x": 1161,
              "y": 894
            },
            {
              "x": 1140,
              "y": 895
            },
            {
              "x": 1137,
              "y": 892
            },
            {
              "x": 1137,
              "y": 884
            },
            {
              "x": 1142,
              "y": 874
            },
            {
              "x": 1179,
              "y": 874
            },
            {
              "x": 1186,
              "y": 876
            },
            {
              "x": 1189,
              "y": 881
            },
            {
              "x": 1191,
              "y": 891
            },
            {
              "x": 1192,
              "y": 908
            },
            {
              "x": 1183,
              "y": 909
            },
            {
              "x": 1184,
              "y": 894
            },
            {
              "x": 1184,
              "y": 884
            },
            {
              "x": 1180,
              "y": 880
            },
            {
              "x": 1167,
              "y": 880
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 110,
          "x": 1076,
          "y": 1730,
          "rotation": 0,
          "w": 21,
          "h": 138,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv1980r_dar",
          "polygon": [
            {
              "x": 1080,
              "y": 1832
            },
            {
              "x": 1079,
              "y": 1846
            },
            {
              "x": 1079,
              "y": 1855
            },
            {
              "x": 1076,
              "y": 1855
            },
            {
              "x": 1076,
              "y": 1861
            },
            {
              "x": 1081,
              "y": 1868
            },
            {
              "x": 1089,
              "y": 1868
            },
            {
              "x": 1096,
              "y": 1866
            },
            {
              "x": 1097,
              "y": 1858
            },
            {
              "x": 1094,
              "y": 1854
            },
            {
              "x": 1093,
              "y": 1835
            },
            {
              "x": 1090,
              "y": 1834
            },
            {
              "x": 1090,
              "y": 1730
            },
            {
              "x": 1082,
              "y": 1732
            },
            {
              "x": 1081,
              "y": 1774
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 111,
          "x": 1043,
          "y": 1720,
          "rotation": 0,
          "w": 48,
          "h": 19,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvv19tnu_2n9",
          "polygon": [
            {
              "x": 1081,
              "y": 1739
            },
            {
              "x": 1091,
              "y": 1740
            },
            {
              "x": 1090,
              "y": 1728
            },
            {
              "x": 1085,
              "y": 1721
            },
            {
              "x": 1070,
              "y": 1720
            },
            {
              "x": 1058,
              "y": 1720
            },
            {
              "x": 1046,
              "y": 1720
            },
            {
              "x": 1043,
              "y": 1725
            },
            {
              "x": 1043,
              "y": 1729
            },
            {
              "x": 1043,
              "y": 1735
            },
            {
              "x": 1045,
              "y": 1738
            },
            {
              "x": 1060,
              "y": 1740
            },
            {
              "x": 1065,
              "y": 1735
            },
            {
              "x": 1067,
              "y": 1727
            },
            {
              "x": 1076,
              "y": 1727
            },
            {
              "x": 1083,
              "y": 1728
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 112,
          "x": 941,
          "y": 1746,
          "rotation": 0,
          "w": 20,
          "h": 126,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv1asw3_brk",
          "polygon": [
            {
              "x": 953,
              "y": 1747
            },
            {
              "x": 946,
              "y": 1746
            },
            {
              "x": 946,
              "y": 1787
            },
            {
              "x": 947,
              "y": 1800
            },
            {
              "x": 948,
              "y": 1841
            },
            {
              "x": 945,
              "y": 1841
            },
            {
              "x": 944,
              "y": 1862
            },
            {
              "x": 941,
              "y": 1865
            },
            {
              "x": 944,
              "y": 1871
            },
            {
              "x": 952,
              "y": 1872
            },
            {
              "x": 961,
              "y": 1868
            },
            {
              "x": 961,
              "y": 1860
            },
            {
              "x": 958,
              "y": 1859
            },
            {
              "x": 958,
              "y": 1843
            },
            {
              "x": 956,
              "y": 1841
            },
            {
              "x": 956,
              "y": 1787
            },
            {
              "x": 954,
              "y": 1785
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 113,
          "x": 946,
          "y": 1728,
          "rotation": 0,
          "w": 49,
          "h": 22,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvv1bhhw_6uq",
          "polygon": [
            {
              "x": 969,
              "y": 1744
            },
            {
              "x": 971,
              "y": 1750
            },
            {
              "x": 991,
              "y": 1749
            },
            {
              "x": 995,
              "y": 1743
            },
            {
              "x": 995,
              "y": 1734
            },
            {
              "x": 990,
              "y": 1729
            },
            {
              "x": 974,
              "y": 1728
            },
            {
              "x": 969,
              "y": 1731
            },
            {
              "x": 955,
              "y": 1732
            },
            {
              "x": 949,
              "y": 1736
            },
            {
              "x": 947,
              "y": 1744
            },
            {
              "x": 946,
              "y": 1749
            },
            {
              "x": 954,
              "y": 1750
            },
            {
              "x": 953,
              "y": 1746
            },
            {
              "x": 955,
              "y": 1739
            },
            {
              "x": 960,
              "y": 1737
            },
            {
              "x": 966,
              "y": 1737
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 114,
          "x": 1744,
          "y": 272,
          "rotation": 0,
          "w": 160,
          "h": 96,
          "label": "TRIGGER",
          "id": "trigger_d9lp",
          "collisionType": "trigger",
          "isTrigger": true,
          "ai_instruction": "Aqui será a Van"
        },
        {
          "type": "obstacle",
          "zIndex": 115,
          "x": 1385,
          "y": 634,
          "rotation": 0,
          "w": 169,
          "h": 145,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv1g8t5_6jm",
          "polygon": [
            {
              "x": 1454,
              "y": 653
            },
            {
              "x": 1427,
              "y": 675
            },
            {
              "x": 1418,
              "y": 690
            },
            {
              "x": 1416,
              "y": 687
            },
            {
              "x": 1411,
              "y": 687
            },
            {
              "x": 1409,
              "y": 692
            },
            {
              "x": 1414,
              "y": 694
            },
            {
              "x": 1414,
              "y": 696
            },
            {
              "x": 1389,
              "y": 724
            },
            {
              "x": 1386,
              "y": 740
            },
            {
              "x": 1385,
              "y": 745
            },
            {
              "x": 1387,
              "y": 752
            },
            {
              "x": 1392,
              "y": 755
            },
            {
              "x": 1398,
              "y": 757
            },
            {
              "x": 1401,
              "y": 761
            },
            {
              "x": 1408,
              "y": 761
            },
            {
              "x": 1415,
              "y": 764
            },
            {
              "x": 1422,
              "y": 771
            },
            {
              "x": 1434,
              "y": 779
            },
            {
              "x": 1441,
              "y": 778
            },
            {
              "x": 1443,
              "y": 778
            },
            {
              "x": 1448,
              "y": 774
            },
            {
              "x": 1450,
              "y": 774
            },
            {
              "x": 1454,
              "y": 779
            },
            {
              "x": 1458,
              "y": 779
            },
            {
              "x": 1467,
              "y": 776
            },
            {
              "x": 1472,
              "y": 770
            },
            {
              "x": 1472,
              "y": 761
            },
            {
              "x": 1472,
              "y": 755
            },
            {
              "x": 1477,
              "y": 754
            },
            {
              "x": 1495,
              "y": 738
            },
            {
              "x": 1518,
              "y": 720
            },
            {
              "x": 1521,
              "y": 719
            },
            {
              "x": 1524,
              "y": 721
            },
            {
              "x": 1529,
              "y": 721
            },
            {
              "x": 1534,
              "y": 721
            },
            {
              "x": 1539,
              "y": 715
            },
            {
              "x": 1541,
              "y": 706
            },
            {
              "x": 1541,
              "y": 700
            },
            {
              "x": 1540,
              "y": 696
            },
            {
              "x": 1545,
              "y": 695
            },
            {
              "x": 1550,
              "y": 692
            },
            {
              "x": 1554,
              "y": 688
            },
            {
              "x": 1549,
              "y": 664
            },
            {
              "x": 1497,
              "y": 634
            },
            {
              "x": 1464,
              "y": 658
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 116,
          "x": 734,
          "y": 941,
          "rotation": 0,
          "w": 179,
          "h": 96,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv1hipn_7qj",
          "polygon": [
            {
              "x": 734,
              "y": 985
            },
            {
              "x": 734,
              "y": 1004
            },
            {
              "x": 737,
              "y": 1015
            },
            {
              "x": 737,
              "y": 1029
            },
            {
              "x": 742,
              "y": 1034
            },
            {
              "x": 758,
              "y": 1035
            },
            {
              "x": 765,
              "y": 1035
            },
            {
              "x": 767,
              "y": 1036
            },
            {
              "x": 793,
              "y": 1036
            },
            {
              "x": 805,
              "y": 1031
            },
            {
              "x": 825,
              "y": 1031
            },
            {
              "x": 852,
              "y": 1031
            },
            {
              "x": 868,
              "y": 1030
            },
            {
              "x": 874,
              "y": 1037
            },
            {
              "x": 889,
              "y": 1034
            },
            {
              "x": 892,
              "y": 1028
            },
            {
              "x": 900,
              "y": 1025
            },
            {
              "x": 910,
              "y": 1019
            },
            {
              "x": 909,
              "y": 1000
            },
            {
              "x": 914,
              "y": 995
            },
            {
              "x": 909,
              "y": 978
            },
            {
              "x": 906,
              "y": 969
            },
            {
              "x": 903,
              "y": 960
            },
            {
              "x": 896,
              "y": 955
            },
            {
              "x": 882,
              "y": 953
            },
            {
              "x": 861,
              "y": 953
            },
            {
              "x": 854,
              "y": 953
            },
            {
              "x": 848,
              "y": 944
            },
            {
              "x": 846,
              "y": 941
            },
            {
              "x": 843,
              "y": 943
            },
            {
              "x": 845,
              "y": 948
            },
            {
              "x": 846,
              "y": 952
            },
            {
              "x": 835,
              "y": 948
            },
            {
              "x": 817,
              "y": 948
            },
            {
              "x": 808,
              "y": 950
            },
            {
              "x": 785,
              "y": 953
            },
            {
              "x": 774,
              "y": 955
            },
            {
              "x": 765,
              "y": 958
            },
            {
              "x": 754,
              "y": 968
            },
            {
              "x": 742,
              "y": 970
            },
            {
              "x": 736,
              "y": 973
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 117,
          "x": 1753,
          "y": 1291,
          "rotation": 0,
          "w": 132,
          "h": 161,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv1iz86_8ts",
          "polygon": [
            {
              "x": 1802,
              "y": 1296
            },
            {
              "x": 1794,
              "y": 1311
            },
            {
              "x": 1789,
              "y": 1322
            },
            {
              "x": 1784,
              "y": 1337
            },
            {
              "x": 1777,
              "y": 1355
            },
            {
              "x": 1769,
              "y": 1372
            },
            {
              "x": 1761,
              "y": 1391
            },
            {
              "x": 1759,
              "y": 1398
            },
            {
              "x": 1758,
              "y": 1403
            },
            {
              "x": 1757,
              "y": 1421
            },
            {
              "x": 1757,
              "y": 1427
            },
            {
              "x": 1754,
              "y": 1430
            },
            {
              "x": 1753,
              "y": 1437
            },
            {
              "x": 1769,
              "y": 1442
            },
            {
              "x": 1781,
              "y": 1444
            },
            {
              "x": 1800,
              "y": 1450
            },
            {
              "x": 1811,
              "y": 1450
            },
            {
              "x": 1823,
              "y": 1452
            },
            {
              "x": 1828,
              "y": 1452
            },
            {
              "x": 1833,
              "y": 1448
            },
            {
              "x": 1838,
              "y": 1433
            },
            {
              "x": 1842,
              "y": 1435
            },
            {
              "x": 1846,
              "y": 1435
            },
            {
              "x": 1852,
              "y": 1429
            },
            {
              "x": 1854,
              "y": 1420
            },
            {
              "x": 1854,
              "y": 1408
            },
            {
              "x": 1853,
              "y": 1404
            },
            {
              "x": 1851,
              "y": 1403
            },
            {
              "x": 1853,
              "y": 1395
            },
            {
              "x": 1867,
              "y": 1363
            },
            {
              "x": 1869,
              "y": 1365
            },
            {
              "x": 1873,
              "y": 1366
            },
            {
              "x": 1879,
              "y": 1359
            },
            {
              "x": 1880,
              "y": 1349
            },
            {
              "x": 1881,
              "y": 1341
            },
            {
              "x": 1884,
              "y": 1336
            },
            {
              "x": 1886,
              "y": 1331
            },
            {
              "x": 1886,
              "y": 1324
            },
            {
              "x": 1882,
              "y": 1317
            },
            {
              "x": 1880,
              "y": 1311
            },
            {
              "x": 1878,
              "y": 1307
            },
            {
              "x": 1863,
              "y": 1303
            },
            {
              "x": 1846,
              "y": 1298
            },
            {
              "x": 1827,
              "y": 1293
            },
            {
              "x": 1816,
              "y": 1291
            },
            {
              "x": 1810,
              "y": 1294
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 118,
          "x": 1841,
          "y": 1527,
          "rotation": 0,
          "w": 76,
          "h": 61,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv1k214_cfk",
          "polygon": [
            {
              "x": 1863,
              "y": 1554
            },
            {
              "x": 1866,
              "y": 1582
            },
            {
              "x": 1872,
              "y": 1583
            },
            {
              "x": 1886,
              "y": 1589
            },
            {
              "x": 1898,
              "y": 1589
            },
            {
              "x": 1906,
              "y": 1589
            },
            {
              "x": 1917,
              "y": 1583
            },
            {
              "x": 1916,
              "y": 1531
            },
            {
              "x": 1903,
              "y": 1534
            },
            {
              "x": 1896,
              "y": 1527
            },
            {
              "x": 1886,
              "y": 1531
            },
            {
              "x": 1879,
              "y": 1535
            },
            {
              "x": 1871,
              "y": 1534
            },
            {
              "x": 1866,
              "y": 1530
            },
            {
              "x": 1854,
              "y": 1529
            },
            {
              "x": 1841,
              "y": 1532
            },
            {
              "x": 1844,
              "y": 1548
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 119,
          "x": 1433,
          "y": 284,
          "rotation": 0,
          "w": 20,
          "h": 101,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv1l5i8_ci9",
          "polygon": [
            {
              "x": 1443,
              "y": 284
            },
            {
              "x": 1451,
              "y": 284
            },
            {
              "x": 1450,
              "y": 313
            },
            {
              "x": 1448,
              "y": 357
            },
            {
              "x": 1450,
              "y": 361
            },
            {
              "x": 1452,
              "y": 375
            },
            {
              "x": 1454,
              "y": 382
            },
            {
              "x": 1443,
              "y": 385
            },
            {
              "x": 1433,
              "y": 383
            },
            {
              "x": 1437,
              "y": 376
            },
            {
              "x": 1438,
              "y": 360
            },
            {
              "x": 1442,
              "y": 357
            },
            {
              "x": 1442,
              "y": 307
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 120,
          "x": 1442,
          "y": 245,
          "rotation": 0,
          "w": 62,
          "h": 49,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvv1m4ex_lys",
          "polygon": [
            {
              "x": 1442,
              "y": 294
            },
            {
              "x": 1451,
              "y": 293
            },
            {
              "x": 1451,
              "y": 273
            },
            {
              "x": 1454,
              "y": 264
            },
            {
              "x": 1459,
              "y": 258
            },
            {
              "x": 1464,
              "y": 256
            },
            {
              "x": 1479,
              "y": 257
            },
            {
              "x": 1481,
              "y": 263
            },
            {
              "x": 1483,
              "y": 267
            },
            {
              "x": 1499,
              "y": 267
            },
            {
              "x": 1505,
              "y": 257
            },
            {
              "x": 1504,
              "y": 252
            },
            {
              "x": 1502,
              "y": 245
            },
            {
              "x": 1481,
              "y": 246
            },
            {
              "x": 1479,
              "y": 250
            },
            {
              "x": 1461,
              "y": 250
            },
            {
              "x": 1454,
              "y": 253
            },
            {
              "x": 1449,
              "y": 261
            },
            {
              "x": 1445,
              "y": 268
            },
            {
              "x": 1444,
              "y": 280
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 121,
          "x": 1476,
          "y": 37,
          "rotation": 0,
          "w": 19,
          "h": 95,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv1na4c_7kf",
          "polygon": [
            {
              "x": 1483,
              "y": 37
            },
            {
              "x": 1489,
              "y": 37
            },
            {
              "x": 1488,
              "y": 102
            },
            {
              "x": 1493,
              "y": 103
            },
            {
              "x": 1492,
              "y": 124
            },
            {
              "x": 1495,
              "y": 124
            },
            {
              "x": 1494,
              "y": 132
            },
            {
              "x": 1487,
              "y": 133
            },
            {
              "x": 1478,
              "y": 132
            },
            {
              "x": 1476,
              "y": 127
            },
            {
              "x": 1477,
              "y": 124
            },
            {
              "x": 1480,
              "y": 123
            },
            {
              "x": 1479,
              "y": 104
            },
            {
              "x": 1482,
              "y": 103
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 122,
          "x": 1483,
          "y": 18,
          "rotation": 0,
          "w": 36,
          "h": 28,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvv1nrys_pa1",
          "polygon": [
            {
              "x": 1495,
              "y": 30
            },
            {
              "x": 1499,
              "y": 36
            },
            {
              "x": 1514,
              "y": 36
            },
            {
              "x": 1519,
              "y": 31
            },
            {
              "x": 1518,
              "y": 20
            },
            {
              "x": 1513,
              "y": 18
            },
            {
              "x": 1494,
              "y": 18
            },
            {
              "x": 1490,
              "y": 21
            },
            {
              "x": 1485,
              "y": 25
            },
            {
              "x": 1484,
              "y": 31
            },
            {
              "x": 1483,
              "y": 46
            },
            {
              "x": 1490,
              "y": 46
            },
            {
              "x": 1488,
              "y": 37
            },
            {
              "x": 1489,
              "y": 28
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 123,
          "x": 1690,
          "y": 1957,
          "rotation": 0,
          "w": 43,
          "h": 30,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv1p4bx_56r",
          "polygon": [
            {
              "x": 1714,
              "y": 1962
            },
            {
              "x": 1713,
              "y": 1966
            },
            {
              "x": 1706,
              "y": 1966
            },
            {
              "x": 1699,
              "y": 1966
            },
            {
              "x": 1694,
              "y": 1970
            },
            {
              "x": 1690,
              "y": 1982
            },
            {
              "x": 1696,
              "y": 1984
            },
            {
              "x": 1702,
              "y": 1986
            },
            {
              "x": 1709,
              "y": 1987
            },
            {
              "x": 1716,
              "y": 1987
            },
            {
              "x": 1721,
              "y": 1987
            },
            {
              "x": 1726,
              "y": 1984
            },
            {
              "x": 1726,
              "y": 1976
            },
            {
              "x": 1728,
              "y": 1971
            },
            {
              "x": 1733,
              "y": 1964
            },
            {
              "x": 1729,
              "y": 1960
            },
            {
              "x": 1721,
              "y": 1957
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 124,
          "x": 1772,
          "y": 1950,
          "rotation": 0,
          "w": 48,
          "h": 39,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv1pfoe_lkd",
          "polygon": [
            {
              "x": 1773,
              "y": 1959
            },
            {
              "x": 1772,
              "y": 1984
            },
            {
              "x": 1780,
              "y": 1986
            },
            {
              "x": 1793,
              "y": 1987
            },
            {
              "x": 1800,
              "y": 1987
            },
            {
              "x": 1812,
              "y": 1989
            },
            {
              "x": 1818,
              "y": 1989
            },
            {
              "x": 1820,
              "y": 1981
            },
            {
              "x": 1818,
              "y": 1969
            },
            {
              "x": 1818,
              "y": 1961
            },
            {
              "x": 1814,
              "y": 1956
            },
            {
              "x": 1809,
              "y": 1956
            },
            {
              "x": 1803,
              "y": 1951
            },
            {
              "x": 1799,
              "y": 1950
            },
            {
              "x": 1792,
              "y": 1950
            },
            {
              "x": 1787,
              "y": 1955
            },
            {
              "x": 1778,
              "y": 1956
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 125,
          "x": 1673,
          "y": 1916,
          "rotation": 0,
          "w": 153,
          "h": 36,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvv1pxr1_y5l",
          "polygon": [
            {
              "x": 1675,
              "y": 1950
            },
            {
              "x": 1826,
              "y": 1951
            },
            {
              "x": 1825,
              "y": 1916
            },
            {
              "x": 1673,
              "y": 1916
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 126,
          "x": 1673,
          "y": 1858,
          "rotation": 0,
          "w": 154,
          "h": 69,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvv1qx1z_c2i",
          "polygon": [
            {
              "x": 1673,
              "y": 1878
            },
            {
              "x": 1673,
              "y": 1924
            },
            {
              "x": 1826,
              "y": 1927
            },
            {
              "x": 1825,
              "y": 1892
            },
            {
              "x": 1822,
              "y": 1890
            },
            {
              "x": 1820,
              "y": 1868
            },
            {
              "x": 1813,
              "y": 1866
            },
            {
              "x": 1809,
              "y": 1866
            },
            {
              "x": 1807,
              "y": 1871
            },
            {
              "x": 1804,
              "y": 1869
            },
            {
              "x": 1794,
              "y": 1869
            },
            {
              "x": 1790,
              "y": 1869
            },
            {
              "x": 1788,
              "y": 1863
            },
            {
              "x": 1784,
              "y": 1861
            },
            {
              "x": 1779,
              "y": 1860
            },
            {
              "x": 1775,
              "y": 1861
            },
            {
              "x": 1773,
              "y": 1865
            },
            {
              "x": 1774,
              "y": 1873
            },
            {
              "x": 1773,
              "y": 1887
            },
            {
              "x": 1769,
              "y": 1878
            },
            {
              "x": 1769,
              "y": 1870
            },
            {
              "x": 1767,
              "y": 1864
            },
            {
              "x": 1761,
              "y": 1863
            },
            {
              "x": 1753,
              "y": 1862
            },
            {
              "x": 1748,
              "y": 1865
            },
            {
              "x": 1745,
              "y": 1871
            },
            {
              "x": 1743,
              "y": 1871
            },
            {
              "x": 1739,
              "y": 1868
            },
            {
              "x": 1733,
              "y": 1868
            },
            {
              "x": 1728,
              "y": 1872
            },
            {
              "x": 1727,
              "y": 1874
            },
            {
              "x": 1724,
              "y": 1870
            },
            {
              "x": 1721,
              "y": 1868
            },
            {
              "x": 1719,
              "y": 1870
            },
            {
              "x": 1719,
              "y": 1862
            },
            {
              "x": 1711,
              "y": 1862
            },
            {
              "x": 1705,
              "y": 1861
            },
            {
              "x": 1703,
              "y": 1858
            },
            {
              "x": 1695,
              "y": 1858
            },
            {
              "x": 1682,
              "y": 1858
            },
            {
              "x": 1680,
              "y": 1863
            },
            {
              "x": 1680,
              "y": 1872
            },
            {
              "x": 1681,
              "y": 1876
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
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
    }
  ],
  "waterObstacles": [
    {
      "type": "obstacle",
      "zIndex": 48,
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
      "type": "obstacle",
      "zIndex": 58,
      "x": 319,
      "y": 1537,
      "rotation": 0,
      "w": 56,
      "h": 171,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvuz8mmf_0tr",
      "polygon": [
        {
          "x": 332,
          "y": 1537
        },
        {
          "x": 327,
          "y": 1541
        },
        {
          "x": 332,
          "y": 1573
        },
        {
          "x": 324,
          "y": 1577
        },
        {
          "x": 329,
          "y": 1595
        },
        {
          "x": 323,
          "y": 1592
        },
        {
          "x": 321,
          "y": 1593
        },
        {
          "x": 319,
          "y": 1620
        },
        {
          "x": 334,
          "y": 1615
        },
        {
          "x": 346,
          "y": 1647
        },
        {
          "x": 341,
          "y": 1660
        },
        {
          "x": 359,
          "y": 1708
        },
        {
          "x": 375,
          "y": 1691
        },
        {
          "x": 374,
          "y": 1679
        },
        {
          "x": 358,
          "y": 1633
        },
        {
          "x": 368,
          "y": 1631
        },
        {
          "x": 358,
          "y": 1576
        },
        {
          "x": 348,
          "y": 1578
        },
        {
          "x": 338,
          "y": 1538
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 59,
      "x": 314,
      "y": 1656,
      "rotation": 0,
      "w": 140,
      "h": 190,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvuza5gq_i8y",
      "polygon": [
        {
          "x": 423,
          "y": 1656
        },
        {
          "x": 398,
          "y": 1679
        },
        {
          "x": 392,
          "y": 1675
        },
        {
          "x": 314,
          "y": 1753
        },
        {
          "x": 314,
          "y": 1762
        },
        {
          "x": 317,
          "y": 1762
        },
        {
          "x": 316,
          "y": 1773
        },
        {
          "x": 329,
          "y": 1779
        },
        {
          "x": 331,
          "y": 1784
        },
        {
          "x": 351,
          "y": 1797
        },
        {
          "x": 355,
          "y": 1799
        },
        {
          "x": 333,
          "y": 1834
        },
        {
          "x": 335,
          "y": 1842
        },
        {
          "x": 338,
          "y": 1846
        },
        {
          "x": 347,
          "y": 1846
        },
        {
          "x": 350,
          "y": 1841
        },
        {
          "x": 368,
          "y": 1813
        },
        {
          "x": 388,
          "y": 1823
        },
        {
          "x": 390,
          "y": 1823
        },
        {
          "x": 440,
          "y": 1761
        },
        {
          "x": 443,
          "y": 1765
        },
        {
          "x": 446,
          "y": 1765
        },
        {
          "x": 450,
          "y": 1765
        },
        {
          "x": 453,
          "y": 1765
        },
        {
          "x": 454,
          "y": 1753
        },
        {
          "x": 451,
          "y": 1745
        },
        {
          "x": 451,
          "y": 1740
        },
        {
          "x": 449,
          "y": 1737
        },
        {
          "x": 451,
          "y": 1731
        },
        {
          "x": 450,
          "y": 1726
        },
        {
          "x": 413,
          "y": 1708
        },
        {
          "x": 406,
          "y": 1700
        },
        {
          "x": 426,
          "y": 1687
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 61,
      "x": 1109,
      "y": 1877,
      "rotation": 0,
      "w": 22,
      "h": 119,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvuzbirv_pen",
      "polygon": [
        {
          "x": 1109,
          "y": 1891
        },
        {
          "x": 1110,
          "y": 1997
        },
        {
          "x": 1131,
          "y": 1995
        },
        {
          "x": 1132,
          "y": 1877
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 64,
      "x": 1099,
      "y": 1323,
      "rotation": 0,
      "w": 120,
      "h": 201,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvuzoc4r_cvg",
      "polygon": [
        {
          "x": 1099,
          "y": 1323
        },
        {
          "x": 1099,
          "y": 1375
        },
        {
          "x": 1101,
          "y": 1380
        },
        {
          "x": 1099,
          "y": 1490
        },
        {
          "x": 1103,
          "y": 1490
        },
        {
          "x": 1113,
          "y": 1488
        },
        {
          "x": 1113,
          "y": 1524
        },
        {
          "x": 1219,
          "y": 1524
        },
        {
          "x": 1217,
          "y": 1489
        },
        {
          "x": 1143,
          "y": 1488
        },
        {
          "x": 1142,
          "y": 1390
        },
        {
          "x": 1140,
          "y": 1324
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 65,
      "x": 1336,
      "y": 1439,
      "rotation": 0,
      "w": 216,
      "h": 86,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvuzpaat_qnd",
      "polygon": [
        {
          "x": 1413,
          "y": 1455
        },
        {
          "x": 1420,
          "y": 1455
        },
        {
          "x": 1427,
          "y": 1449
        },
        {
          "x": 1433,
          "y": 1445
        },
        {
          "x": 1441,
          "y": 1444
        },
        {
          "x": 1450,
          "y": 1447
        },
        {
          "x": 1459,
          "y": 1450
        },
        {
          "x": 1461,
          "y": 1457
        },
        {
          "x": 1491,
          "y": 1458
        },
        {
          "x": 1493,
          "y": 1440
        },
        {
          "x": 1538,
          "y": 1439
        },
        {
          "x": 1541,
          "y": 1440
        },
        {
          "x": 1545,
          "y": 1442
        },
        {
          "x": 1547,
          "y": 1446
        },
        {
          "x": 1551,
          "y": 1452
        },
        {
          "x": 1552,
          "y": 1524
        },
        {
          "x": 1336,
          "y": 1523
        },
        {
          "x": 1336,
          "y": 1492
        },
        {
          "x": 1413,
          "y": 1491
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 66,
      "x": 1218,
      "y": 1489,
      "rotation": 0,
      "w": 10,
      "h": 32,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvuzpu8l_dil",
      "polygon": [
        {
          "x": 1219,
          "y": 1521
        },
        {
          "x": 1227,
          "y": 1520
        },
        {
          "x": 1228,
          "y": 1491
        },
        {
          "x": 1218,
          "y": 1489
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 67,
      "x": 1326,
      "y": 1490,
      "rotation": 0,
      "w": 10,
      "h": 32,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvuzpzn9_2lm",
      "polygon": [
        {
          "x": 1336,
          "y": 1522
        },
        {
          "x": 1327,
          "y": 1522
        },
        {
          "x": 1326,
          "y": 1491
        },
        {
          "x": 1336,
          "y": 1490
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 68,
      "x": 1434,
      "y": 1573,
      "rotation": 0,
      "w": 36,
      "h": 33,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvuzqism_ndd",
      "polygon": [
        {
          "x": 1434,
          "y": 1574
        },
        {
          "x": 1435,
          "y": 1599
        },
        {
          "x": 1441,
          "y": 1605
        },
        {
          "x": 1460,
          "y": 1606
        },
        {
          "x": 1470,
          "y": 1599
        },
        {
          "x": 1469,
          "y": 1573
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 70,
      "x": 1410,
      "y": 1806,
      "rotation": 0,
      "w": 38,
      "h": 33,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvuzu1i2_zpl",
      "polygon": [
        {
          "x": 1413,
          "y": 1806
        },
        {
          "x": 1413,
          "y": 1809
        },
        {
          "x": 1410,
          "y": 1809
        },
        {
          "x": 1411,
          "y": 1815
        },
        {
          "x": 1413,
          "y": 1816
        },
        {
          "x": 1412,
          "y": 1826
        },
        {
          "x": 1417,
          "y": 1834
        },
        {
          "x": 1425,
          "y": 1838
        },
        {
          "x": 1433,
          "y": 1838
        },
        {
          "x": 1442,
          "y": 1833
        },
        {
          "x": 1447,
          "y": 1825
        },
        {
          "x": 1445,
          "y": 1817
        },
        {
          "x": 1448,
          "y": 1813
        },
        {
          "x": 1447,
          "y": 1811
        },
        {
          "x": 1446,
          "y": 1811
        },
        {
          "x": 1446,
          "y": 1808
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 74,
      "x": 560,
      "y": 787,
      "rotation": 0,
      "w": 18,
      "h": 128,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvuzy22w_19w",
      "polygon": [
        {
          "x": 567,
          "y": 789
        },
        {
          "x": 578,
          "y": 787
        },
        {
          "x": 576,
          "y": 815
        },
        {
          "x": 576,
          "y": 837
        },
        {
          "x": 574,
          "y": 885
        },
        {
          "x": 577,
          "y": 885
        },
        {
          "x": 577,
          "y": 906
        },
        {
          "x": 577,
          "y": 911
        },
        {
          "x": 570,
          "y": 916
        },
        {
          "x": 563,
          "y": 914
        },
        {
          "x": 561,
          "y": 911
        },
        {
          "x": 560,
          "y": 908
        },
        {
          "x": 563,
          "y": 908
        },
        {
          "x": 562,
          "y": 883
        },
        {
          "x": 565,
          "y": 882
        },
        {
          "x": 564,
          "y": 830
        },
        {
          "x": 566,
          "y": 827
        },
        {
          "x": 566,
          "y": 804
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 76,
      "x": 619,
      "y": 530,
      "rotation": 0,
      "w": 18,
      "h": 107,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv00s4i_e1c",
      "polygon": [
        {
          "x": 631,
          "y": 530
        },
        {
          "x": 623,
          "y": 531
        },
        {
          "x": 623,
          "y": 606
        },
        {
          "x": 620,
          "y": 605
        },
        {
          "x": 621,
          "y": 627
        },
        {
          "x": 620,
          "y": 628
        },
        {
          "x": 619,
          "y": 633
        },
        {
          "x": 625,
          "y": 637
        },
        {
          "x": 633,
          "y": 637
        },
        {
          "x": 638,
          "y": 634
        },
        {
          "x": 638,
          "y": 630
        },
        {
          "x": 636,
          "y": 627
        },
        {
          "x": 634,
          "y": 627
        },
        {
          "x": 635,
          "y": 605
        },
        {
          "x": 633,
          "y": 604
        },
        {
          "x": 633,
          "y": 546
        },
        {
          "x": 631,
          "y": 544
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 78,
      "x": 294,
      "y": 588,
      "rotation": 0,
      "w": 79,
      "h": 44,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv03lf2_gth",
      "polygon": [
        {
          "x": 317,
          "y": 622
        },
        {
          "x": 308,
          "y": 627
        },
        {
          "x": 307,
          "y": 619
        },
        {
          "x": 311,
          "y": 617
        },
        {
          "x": 302,
          "y": 614
        },
        {
          "x": 296,
          "y": 611
        },
        {
          "x": 297,
          "y": 605
        },
        {
          "x": 302,
          "y": 602
        },
        {
          "x": 304,
          "y": 597
        },
        {
          "x": 302,
          "y": 594
        },
        {
          "x": 295,
          "y": 593
        },
        {
          "x": 294,
          "y": 588
        },
        {
          "x": 365,
          "y": 589
        },
        {
          "x": 367,
          "y": 591
        },
        {
          "x": 368,
          "y": 594
        },
        {
          "x": 365,
          "y": 595
        },
        {
          "x": 369,
          "y": 598
        },
        {
          "x": 372,
          "y": 600
        },
        {
          "x": 372,
          "y": 607
        },
        {
          "x": 370,
          "y": 608
        },
        {
          "x": 366,
          "y": 612
        },
        {
          "x": 367,
          "y": 616
        },
        {
          "x": 367,
          "y": 622
        },
        {
          "x": 357,
          "y": 621
        },
        {
          "x": 353,
          "y": 626
        },
        {
          "x": 354,
          "y": 629
        },
        {
          "x": 347,
          "y": 630
        },
        {
          "x": 340,
          "y": 630
        },
        {
          "x": 334,
          "y": 631
        },
        {
          "x": 328,
          "y": 633
        },
        {
          "x": 322,
          "y": 631
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 79,
      "x": 3,
      "y": 301,
      "rotation": 0,
      "w": 122,
      "h": 259,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv04u9b_vfi",
      "polygon": [
        {
          "x": 48,
          "y": 560
        },
        {
          "x": 32,
          "y": 553
        },
        {
          "x": 13,
          "y": 540
        },
        {
          "x": 3,
          "y": 533
        },
        {
          "x": 4,
          "y": 301
        },
        {
          "x": 16,
          "y": 301
        },
        {
          "x": 18,
          "y": 326
        },
        {
          "x": 112,
          "y": 418
        },
        {
          "x": 112,
          "y": 435
        },
        {
          "x": 125,
          "y": 435
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 80,
      "x": 400,
      "y": 137,
      "rotation": 0,
      "w": 36,
      "h": 70,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv058o8_p2k",
      "polygon": [
        {
          "x": 436,
          "y": 193
        },
        {
          "x": 407,
          "y": 207
        },
        {
          "x": 400,
          "y": 140
        },
        {
          "x": 410,
          "y": 137
        },
        {
          "x": 420,
          "y": 137
        },
        {
          "x": 428,
          "y": 137
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 81,
      "x": 433,
      "y": 173,
      "rotation": 0,
      "w": 21,
      "h": 24,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv05day_65s",
      "polygon": [
        {
          "x": 452,
          "y": 173
        },
        {
          "x": 436,
          "y": 187
        },
        {
          "x": 433,
          "y": 197
        },
        {
          "x": 449,
          "y": 192
        },
        {
          "x": 454,
          "y": 187
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 82,
      "x": 462,
      "y": 112,
      "rotation": 0,
      "w": 13,
      "h": 41,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv05jq3_865",
      "polygon": [
        {
          "x": 466,
          "y": 112
        },
        {
          "x": 475,
          "y": 119
        },
        {
          "x": 474,
          "y": 128
        },
        {
          "x": 473,
          "y": 138
        },
        {
          "x": 468,
          "y": 152
        },
        {
          "x": 462,
          "y": 153
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 83,
      "x": 462,
      "y": -7,
      "rotation": 0,
      "w": 18,
      "h": 24,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv05z35_bs7",
      "polygon": [
        {
          "x": 462,
          "y": 17
        },
        {
          "x": 462,
          "y": -7
        },
        {
          "x": 480,
          "y": -4
        },
        {
          "x": 480,
          "y": 13
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 87,
      "x": 226,
      "y": 873,
      "rotation": 0,
      "w": 79,
      "h": 83,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv0d6te_byl",
      "polygon": [
        {
          "x": 242,
          "y": 887
        },
        {
          "x": 243,
          "y": 899
        },
        {
          "x": 246,
          "y": 902
        },
        {
          "x": 241,
          "y": 905
        },
        {
          "x": 233,
          "y": 908
        },
        {
          "x": 227,
          "y": 918
        },
        {
          "x": 226,
          "y": 929
        },
        {
          "x": 227,
          "y": 941
        },
        {
          "x": 234,
          "y": 949
        },
        {
          "x": 241,
          "y": 956
        },
        {
          "x": 251,
          "y": 956
        },
        {
          "x": 263,
          "y": 953
        },
        {
          "x": 269,
          "y": 944
        },
        {
          "x": 272,
          "y": 934
        },
        {
          "x": 270,
          "y": 922
        },
        {
          "x": 264,
          "y": 913
        },
        {
          "x": 260,
          "y": 910
        },
        {
          "x": 302,
          "y": 912
        },
        {
          "x": 302,
          "y": 902
        },
        {
          "x": 305,
          "y": 901
        },
        {
          "x": 304,
          "y": 896
        },
        {
          "x": 301,
          "y": 890
        },
        {
          "x": 300,
          "y": 885
        },
        {
          "x": 297,
          "y": 880
        },
        {
          "x": 292,
          "y": 877
        },
        {
          "x": 282,
          "y": 875
        },
        {
          "x": 279,
          "y": 877
        },
        {
          "x": 278,
          "y": 880
        },
        {
          "x": 274,
          "y": 884
        },
        {
          "x": 272,
          "y": 882
        },
        {
          "x": 267,
          "y": 873
        },
        {
          "x": 264,
          "y": 873
        },
        {
          "x": 255,
          "y": 877
        },
        {
          "x": 249,
          "y": 880
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 88,
      "x": 385,
      "y": 870,
      "rotation": 0,
      "w": 58,
      "h": 43,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv0dlq2_cer",
      "polygon": [
        {
          "x": 388,
          "y": 890
        },
        {
          "x": 387,
          "y": 895
        },
        {
          "x": 385,
          "y": 899
        },
        {
          "x": 387,
          "y": 906
        },
        {
          "x": 387,
          "y": 913
        },
        {
          "x": 399,
          "y": 913
        },
        {
          "x": 425,
          "y": 913
        },
        {
          "x": 433,
          "y": 908
        },
        {
          "x": 436,
          "y": 904
        },
        {
          "x": 443,
          "y": 895
        },
        {
          "x": 443,
          "y": 889
        },
        {
          "x": 439,
          "y": 880
        },
        {
          "x": 426,
          "y": 874
        },
        {
          "x": 409,
          "y": 871
        },
        {
          "x": 402,
          "y": 870
        },
        {
          "x": 397,
          "y": 872
        },
        {
          "x": 393,
          "y": 876
        },
        {
          "x": 392,
          "y": 880
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 89,
      "x": 394,
      "y": 921,
      "rotation": 0,
      "w": 34,
      "h": 36,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv0edib_b5t",
      "polygon": [
        {
          "x": 402,
          "y": 922
        },
        {
          "x": 394,
          "y": 927
        },
        {
          "x": 394,
          "y": 933
        },
        {
          "x": 394,
          "y": 941
        },
        {
          "x": 397,
          "y": 947
        },
        {
          "x": 404,
          "y": 956
        },
        {
          "x": 417,
          "y": 957
        },
        {
          "x": 428,
          "y": 951
        },
        {
          "x": 428,
          "y": 938
        },
        {
          "x": 426,
          "y": 926
        },
        {
          "x": 423,
          "y": 921
        },
        {
          "x": 412,
          "y": 921
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 90,
      "x": -4,
      "y": 781,
      "rotation": 0,
      "w": 157,
      "h": 422,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv0fgsc_jmn",
      "polygon": [
        {
          "x": -4,
          "y": 781
        },
        {
          "x": 150,
          "y": 784
        },
        {
          "x": 150,
          "y": 1009
        },
        {
          "x": 148,
          "y": 1010
        },
        {
          "x": 147,
          "y": 1127
        },
        {
          "x": 153,
          "y": 1129
        },
        {
          "x": 152,
          "y": 1175
        },
        {
          "x": 138,
          "y": 1175
        },
        {
          "x": 128,
          "y": 1177
        },
        {
          "x": 118,
          "y": 1177
        },
        {
          "x": 93,
          "y": 1175
        },
        {
          "x": 84,
          "y": 1175
        },
        {
          "x": 86,
          "y": 1182
        },
        {
          "x": 86,
          "y": 1188
        },
        {
          "x": 76,
          "y": 1193
        },
        {
          "x": 54,
          "y": 1199
        },
        {
          "x": 33,
          "y": 1202
        },
        {
          "x": 20,
          "y": 1203
        },
        {
          "x": 15,
          "y": 1201
        },
        {
          "x": 11,
          "y": 1198
        },
        {
          "x": 1,
          "y": 1201
        },
        {
          "x": 1,
          "y": 1175
        },
        {
          "x": 2,
          "y": 1160
        },
        {
          "x": 2,
          "y": 1150
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 91,
      "x": 891,
      "y": 505,
      "rotation": 0,
      "w": 230,
      "h": 247,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv0hctr_0u9",
      "polygon": [
        {
          "x": 891,
          "y": 750
        },
        {
          "x": 891,
          "y": 611
        },
        {
          "x": 894,
          "y": 505
        },
        {
          "x": 1117,
          "y": 506
        },
        {
          "x": 1121,
          "y": 752
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 93,
      "x": 1126,
      "y": 528,
      "rotation": 0,
      "w": 59,
      "h": 195,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv0jsoi_mww",
      "polygon": [
        {
          "x": 1129,
          "y": 533
        },
        {
          "x": 1127,
          "y": 661
        },
        {
          "x": 1131,
          "y": 662
        },
        {
          "x": 1133,
          "y": 668
        },
        {
          "x": 1133,
          "y": 674
        },
        {
          "x": 1130,
          "y": 676
        },
        {
          "x": 1127,
          "y": 685
        },
        {
          "x": 1126,
          "y": 693
        },
        {
          "x": 1128,
          "y": 700
        },
        {
          "x": 1134,
          "y": 707
        },
        {
          "x": 1136,
          "y": 713
        },
        {
          "x": 1138,
          "y": 721
        },
        {
          "x": 1148,
          "y": 721
        },
        {
          "x": 1166,
          "y": 723
        },
        {
          "x": 1175,
          "y": 719
        },
        {
          "x": 1180,
          "y": 715
        },
        {
          "x": 1184,
          "y": 708
        },
        {
          "x": 1185,
          "y": 698
        },
        {
          "x": 1184,
          "y": 693
        },
        {
          "x": 1182,
          "y": 691
        },
        {
          "x": 1181,
          "y": 682
        },
        {
          "x": 1182,
          "y": 675
        },
        {
          "x": 1174,
          "y": 673
        },
        {
          "x": 1176,
          "y": 666
        },
        {
          "x": 1171,
          "y": 665
        },
        {
          "x": 1170,
          "y": 658
        },
        {
          "x": 1167,
          "y": 658
        },
        {
          "x": 1173,
          "y": 655
        },
        {
          "x": 1175,
          "y": 653
        },
        {
          "x": 1176,
          "y": 643
        },
        {
          "x": 1173,
          "y": 528
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 94,
      "x": 752,
      "y": 807,
      "rotation": 0,
      "w": 210,
      "h": 78,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv0kma3_p0j",
      "polygon": [
        {
          "x": 752,
          "y": 807
        },
        {
          "x": 798,
          "y": 807
        },
        {
          "x": 798,
          "y": 861
        },
        {
          "x": 963,
          "y": 865
        },
        {
          "x": 959,
          "y": 885
        },
        {
          "x": 752,
          "y": 882
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 95,
      "x": 226,
      "y": 1064,
      "rotation": 0,
      "w": 115,
      "h": 174,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv0mlpz_zws",
      "polygon": [
        {
          "x": 268,
          "y": 1074
        },
        {
          "x": 274,
          "y": 1064
        },
        {
          "x": 278,
          "y": 1065
        },
        {
          "x": 277,
          "y": 1072
        },
        {
          "x": 303,
          "y": 1073
        },
        {
          "x": 324,
          "y": 1078
        },
        {
          "x": 337,
          "y": 1084
        },
        {
          "x": 341,
          "y": 1094
        },
        {
          "x": 341,
          "y": 1104
        },
        {
          "x": 337,
          "y": 1108
        },
        {
          "x": 337,
          "y": 1117
        },
        {
          "x": 341,
          "y": 1121
        },
        {
          "x": 339,
          "y": 1134
        },
        {
          "x": 335,
          "y": 1138
        },
        {
          "x": 325,
          "y": 1178
        },
        {
          "x": 322,
          "y": 1186
        },
        {
          "x": 319,
          "y": 1201
        },
        {
          "x": 316,
          "y": 1209
        },
        {
          "x": 315,
          "y": 1216
        },
        {
          "x": 311,
          "y": 1229
        },
        {
          "x": 305,
          "y": 1238
        },
        {
          "x": 283,
          "y": 1237
        },
        {
          "x": 256,
          "y": 1235
        },
        {
          "x": 236,
          "y": 1231
        },
        {
          "x": 226,
          "y": 1221
        },
        {
          "x": 227,
          "y": 1212
        },
        {
          "x": 228,
          "y": 1202
        },
        {
          "x": 231,
          "y": 1193
        },
        {
          "x": 239,
          "y": 1161
        },
        {
          "x": 235,
          "y": 1154
        },
        {
          "x": 234,
          "y": 1147
        },
        {
          "x": 240,
          "y": 1147
        },
        {
          "x": 242,
          "y": 1147
        },
        {
          "x": 249,
          "y": 1127
        },
        {
          "x": 253,
          "y": 1115
        },
        {
          "x": 256,
          "y": 1103
        },
        {
          "x": 260,
          "y": 1094
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 96,
      "x": 325,
      "y": 1142,
      "rotation": 0,
      "w": 19,
      "h": 44,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv0n87r_zb6",
      "polygon": [
        {
          "x": 335,
          "y": 1142
        },
        {
          "x": 344,
          "y": 1142
        },
        {
          "x": 342,
          "y": 1166
        },
        {
          "x": 341,
          "y": 1181
        },
        {
          "x": 325,
          "y": 1186
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 98,
      "x": 1072,
      "y": 89,
      "rotation": 0,
      "w": 290,
      "h": 206,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv0rwdo_r97",
      "polygon": [
        {
          "x": 1077,
          "y": 133
        },
        {
          "x": 1076,
          "y": 289
        },
        {
          "x": 1175,
          "y": 292
        },
        {
          "x": 1182,
          "y": 295
        },
        {
          "x": 1185,
          "y": 295
        },
        {
          "x": 1185,
          "y": 292
        },
        {
          "x": 1230,
          "y": 291
        },
        {
          "x": 1233,
          "y": 292
        },
        {
          "x": 1237,
          "y": 293
        },
        {
          "x": 1358,
          "y": 292
        },
        {
          "x": 1357,
          "y": 130
        },
        {
          "x": 1360,
          "y": 126
        },
        {
          "x": 1361,
          "y": 89
        },
        {
          "x": 1072,
          "y": 91
        },
        {
          "x": 1072,
          "y": 126
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 100,
      "x": 1016,
      "y": 52,
      "rotation": 0,
      "w": 60,
      "h": 119,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv0t459_jsm",
      "polygon": [
        {
          "x": 1072,
          "y": 52
        },
        {
          "x": 1016,
          "y": 75
        },
        {
          "x": 1017,
          "y": 158
        },
        {
          "x": 1018,
          "y": 171
        },
        {
          "x": 1076,
          "y": 154
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 101,
      "x": 795,
      "y": 1861,
      "rotation": 0,
      "w": 45,
      "h": 46,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv0umfj_8bo",
      "polygon": [
        {
          "x": 809,
          "y": 1907
        },
        {
          "x": 822,
          "y": 1907
        },
        {
          "x": 831,
          "y": 1905
        },
        {
          "x": 837,
          "y": 1898
        },
        {
          "x": 840,
          "y": 1887
        },
        {
          "x": 840,
          "y": 1877
        },
        {
          "x": 835,
          "y": 1867
        },
        {
          "x": 824,
          "y": 1862
        },
        {
          "x": 814,
          "y": 1861
        },
        {
          "x": 803,
          "y": 1864
        },
        {
          "x": 798,
          "y": 1875
        },
        {
          "x": 797,
          "y": 1884
        },
        {
          "x": 795,
          "y": 1892
        },
        {
          "x": 796,
          "y": 1896
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 102,
      "x": 861,
      "y": 1779,
      "rotation": 0,
      "w": 36,
      "h": 20,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv0vbu0_btk",
      "polygon": [
        {
          "x": 862,
          "y": 1781
        },
        {
          "x": 872,
          "y": 1788
        },
        {
          "x": 880,
          "y": 1787
        },
        {
          "x": 890,
          "y": 1784
        },
        {
          "x": 894,
          "y": 1779
        },
        {
          "x": 897,
          "y": 1780
        },
        {
          "x": 897,
          "y": 1789
        },
        {
          "x": 895,
          "y": 1793
        },
        {
          "x": 885,
          "y": 1798
        },
        {
          "x": 877,
          "y": 1799
        },
        {
          "x": 865,
          "y": 1797
        },
        {
          "x": 861,
          "y": 1793
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 104,
      "x": 869,
      "y": 1805,
      "rotation": 0,
      "w": 63,
      "h": 53,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv0wm7t_52b",
      "polygon": [
        {
          "x": 887,
          "y": 1805
        },
        {
          "x": 874,
          "y": 1818
        },
        {
          "x": 871,
          "y": 1823
        },
        {
          "x": 869,
          "y": 1830
        },
        {
          "x": 871,
          "y": 1839
        },
        {
          "x": 875,
          "y": 1847
        },
        {
          "x": 877,
          "y": 1848
        },
        {
          "x": 881,
          "y": 1855
        },
        {
          "x": 890,
          "y": 1858
        },
        {
          "x": 897,
          "y": 1857
        },
        {
          "x": 905,
          "y": 1855
        },
        {
          "x": 908,
          "y": 1853
        },
        {
          "x": 913,
          "y": 1847
        },
        {
          "x": 925,
          "y": 1830
        },
        {
          "x": 930,
          "y": 1820
        },
        {
          "x": 932,
          "y": 1815
        },
        {
          "x": 929,
          "y": 1810
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 106,
      "x": 75,
      "y": 1528,
      "rotation": 0,
      "w": 237,
      "h": 271,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv134a2_4lu",
      "polygon": [
        {
          "x": 76,
          "y": 1634
        },
        {
          "x": 75,
          "y": 1798
        },
        {
          "x": 312,
          "y": 1798
        },
        {
          "x": 309,
          "y": 1670
        },
        {
          "x": 303,
          "y": 1529
        },
        {
          "x": 76,
          "y": 1528
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 107,
      "x": 1177,
      "y": 934,
      "rotation": 0,
      "w": 21,
      "h": 88,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv1471g_vib",
      "polygon": [
        {
          "x": 1182,
          "y": 935
        },
        {
          "x": 1192,
          "y": 934
        },
        {
          "x": 1193,
          "y": 992
        },
        {
          "x": 1195,
          "y": 993
        },
        {
          "x": 1194,
          "y": 1013
        },
        {
          "x": 1198,
          "y": 1018
        },
        {
          "x": 1193,
          "y": 1023
        },
        {
          "x": 1184,
          "y": 1023
        },
        {
          "x": 1178,
          "y": 1020
        },
        {
          "x": 1177,
          "y": 1013
        },
        {
          "x": 1180,
          "y": 1012
        },
        {
          "x": 1181,
          "y": 992
        },
        {
          "x": 1183,
          "y": 991
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 108,
      "x": 1182,
      "y": 903,
      "rotation": 0,
      "w": 11,
      "h": 37,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv159b8_zxc",
      "polygon": [
        {
          "x": 1184,
          "y": 903
        },
        {
          "x": 1193,
          "y": 903
        },
        {
          "x": 1193,
          "y": 939
        },
        {
          "x": 1182,
          "y": 939
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 110,
      "x": 1076,
      "y": 1730,
      "rotation": 0,
      "w": 21,
      "h": 138,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv1980r_dar",
      "polygon": [
        {
          "x": 1080,
          "y": 1832
        },
        {
          "x": 1079,
          "y": 1846
        },
        {
          "x": 1079,
          "y": 1855
        },
        {
          "x": 1076,
          "y": 1855
        },
        {
          "x": 1076,
          "y": 1861
        },
        {
          "x": 1081,
          "y": 1868
        },
        {
          "x": 1089,
          "y": 1868
        },
        {
          "x": 1096,
          "y": 1866
        },
        {
          "x": 1097,
          "y": 1858
        },
        {
          "x": 1094,
          "y": 1854
        },
        {
          "x": 1093,
          "y": 1835
        },
        {
          "x": 1090,
          "y": 1834
        },
        {
          "x": 1090,
          "y": 1730
        },
        {
          "x": 1082,
          "y": 1732
        },
        {
          "x": 1081,
          "y": 1774
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 112,
      "x": 941,
      "y": 1746,
      "rotation": 0,
      "w": 20,
      "h": 126,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv1asw3_brk",
      "polygon": [
        {
          "x": 953,
          "y": 1747
        },
        {
          "x": 946,
          "y": 1746
        },
        {
          "x": 946,
          "y": 1787
        },
        {
          "x": 947,
          "y": 1800
        },
        {
          "x": 948,
          "y": 1841
        },
        {
          "x": 945,
          "y": 1841
        },
        {
          "x": 944,
          "y": 1862
        },
        {
          "x": 941,
          "y": 1865
        },
        {
          "x": 944,
          "y": 1871
        },
        {
          "x": 952,
          "y": 1872
        },
        {
          "x": 961,
          "y": 1868
        },
        {
          "x": 961,
          "y": 1860
        },
        {
          "x": 958,
          "y": 1859
        },
        {
          "x": 958,
          "y": 1843
        },
        {
          "x": 956,
          "y": 1841
        },
        {
          "x": 956,
          "y": 1787
        },
        {
          "x": 954,
          "y": 1785
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 115,
      "x": 1385,
      "y": 634,
      "rotation": 0,
      "w": 169,
      "h": 145,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv1g8t5_6jm",
      "polygon": [
        {
          "x": 1454,
          "y": 653
        },
        {
          "x": 1427,
          "y": 675
        },
        {
          "x": 1418,
          "y": 690
        },
        {
          "x": 1416,
          "y": 687
        },
        {
          "x": 1411,
          "y": 687
        },
        {
          "x": 1409,
          "y": 692
        },
        {
          "x": 1414,
          "y": 694
        },
        {
          "x": 1414,
          "y": 696
        },
        {
          "x": 1389,
          "y": 724
        },
        {
          "x": 1386,
          "y": 740
        },
        {
          "x": 1385,
          "y": 745
        },
        {
          "x": 1387,
          "y": 752
        },
        {
          "x": 1392,
          "y": 755
        },
        {
          "x": 1398,
          "y": 757
        },
        {
          "x": 1401,
          "y": 761
        },
        {
          "x": 1408,
          "y": 761
        },
        {
          "x": 1415,
          "y": 764
        },
        {
          "x": 1422,
          "y": 771
        },
        {
          "x": 1434,
          "y": 779
        },
        {
          "x": 1441,
          "y": 778
        },
        {
          "x": 1443,
          "y": 778
        },
        {
          "x": 1448,
          "y": 774
        },
        {
          "x": 1450,
          "y": 774
        },
        {
          "x": 1454,
          "y": 779
        },
        {
          "x": 1458,
          "y": 779
        },
        {
          "x": 1467,
          "y": 776
        },
        {
          "x": 1472,
          "y": 770
        },
        {
          "x": 1472,
          "y": 761
        },
        {
          "x": 1472,
          "y": 755
        },
        {
          "x": 1477,
          "y": 754
        },
        {
          "x": 1495,
          "y": 738
        },
        {
          "x": 1518,
          "y": 720
        },
        {
          "x": 1521,
          "y": 719
        },
        {
          "x": 1524,
          "y": 721
        },
        {
          "x": 1529,
          "y": 721
        },
        {
          "x": 1534,
          "y": 721
        },
        {
          "x": 1539,
          "y": 715
        },
        {
          "x": 1541,
          "y": 706
        },
        {
          "x": 1541,
          "y": 700
        },
        {
          "x": 1540,
          "y": 696
        },
        {
          "x": 1545,
          "y": 695
        },
        {
          "x": 1550,
          "y": 692
        },
        {
          "x": 1554,
          "y": 688
        },
        {
          "x": 1549,
          "y": 664
        },
        {
          "x": 1497,
          "y": 634
        },
        {
          "x": 1464,
          "y": 658
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 116,
      "x": 734,
      "y": 941,
      "rotation": 0,
      "w": 179,
      "h": 96,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv1hipn_7qj",
      "polygon": [
        {
          "x": 734,
          "y": 985
        },
        {
          "x": 734,
          "y": 1004
        },
        {
          "x": 737,
          "y": 1015
        },
        {
          "x": 737,
          "y": 1029
        },
        {
          "x": 742,
          "y": 1034
        },
        {
          "x": 758,
          "y": 1035
        },
        {
          "x": 765,
          "y": 1035
        },
        {
          "x": 767,
          "y": 1036
        },
        {
          "x": 793,
          "y": 1036
        },
        {
          "x": 805,
          "y": 1031
        },
        {
          "x": 825,
          "y": 1031
        },
        {
          "x": 852,
          "y": 1031
        },
        {
          "x": 868,
          "y": 1030
        },
        {
          "x": 874,
          "y": 1037
        },
        {
          "x": 889,
          "y": 1034
        },
        {
          "x": 892,
          "y": 1028
        },
        {
          "x": 900,
          "y": 1025
        },
        {
          "x": 910,
          "y": 1019
        },
        {
          "x": 909,
          "y": 1000
        },
        {
          "x": 914,
          "y": 995
        },
        {
          "x": 909,
          "y": 978
        },
        {
          "x": 906,
          "y": 969
        },
        {
          "x": 903,
          "y": 960
        },
        {
          "x": 896,
          "y": 955
        },
        {
          "x": 882,
          "y": 953
        },
        {
          "x": 861,
          "y": 953
        },
        {
          "x": 854,
          "y": 953
        },
        {
          "x": 848,
          "y": 944
        },
        {
          "x": 846,
          "y": 941
        },
        {
          "x": 843,
          "y": 943
        },
        {
          "x": 845,
          "y": 948
        },
        {
          "x": 846,
          "y": 952
        },
        {
          "x": 835,
          "y": 948
        },
        {
          "x": 817,
          "y": 948
        },
        {
          "x": 808,
          "y": 950
        },
        {
          "x": 785,
          "y": 953
        },
        {
          "x": 774,
          "y": 955
        },
        {
          "x": 765,
          "y": 958
        },
        {
          "x": 754,
          "y": 968
        },
        {
          "x": 742,
          "y": 970
        },
        {
          "x": 736,
          "y": 973
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 117,
      "x": 1753,
      "y": 1291,
      "rotation": 0,
      "w": 132,
      "h": 161,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv1iz86_8ts",
      "polygon": [
        {
          "x": 1802,
          "y": 1296
        },
        {
          "x": 1794,
          "y": 1311
        },
        {
          "x": 1789,
          "y": 1322
        },
        {
          "x": 1784,
          "y": 1337
        },
        {
          "x": 1777,
          "y": 1355
        },
        {
          "x": 1769,
          "y": 1372
        },
        {
          "x": 1761,
          "y": 1391
        },
        {
          "x": 1759,
          "y": 1398
        },
        {
          "x": 1758,
          "y": 1403
        },
        {
          "x": 1757,
          "y": 1421
        },
        {
          "x": 1757,
          "y": 1427
        },
        {
          "x": 1754,
          "y": 1430
        },
        {
          "x": 1753,
          "y": 1437
        },
        {
          "x": 1769,
          "y": 1442
        },
        {
          "x": 1781,
          "y": 1444
        },
        {
          "x": 1800,
          "y": 1450
        },
        {
          "x": 1811,
          "y": 1450
        },
        {
          "x": 1823,
          "y": 1452
        },
        {
          "x": 1828,
          "y": 1452
        },
        {
          "x": 1833,
          "y": 1448
        },
        {
          "x": 1838,
          "y": 1433
        },
        {
          "x": 1842,
          "y": 1435
        },
        {
          "x": 1846,
          "y": 1435
        },
        {
          "x": 1852,
          "y": 1429
        },
        {
          "x": 1854,
          "y": 1420
        },
        {
          "x": 1854,
          "y": 1408
        },
        {
          "x": 1853,
          "y": 1404
        },
        {
          "x": 1851,
          "y": 1403
        },
        {
          "x": 1853,
          "y": 1395
        },
        {
          "x": 1867,
          "y": 1363
        },
        {
          "x": 1869,
          "y": 1365
        },
        {
          "x": 1873,
          "y": 1366
        },
        {
          "x": 1879,
          "y": 1359
        },
        {
          "x": 1880,
          "y": 1349
        },
        {
          "x": 1881,
          "y": 1341
        },
        {
          "x": 1884,
          "y": 1336
        },
        {
          "x": 1886,
          "y": 1331
        },
        {
          "x": 1886,
          "y": 1324
        },
        {
          "x": 1882,
          "y": 1317
        },
        {
          "x": 1880,
          "y": 1311
        },
        {
          "x": 1878,
          "y": 1307
        },
        {
          "x": 1863,
          "y": 1303
        },
        {
          "x": 1846,
          "y": 1298
        },
        {
          "x": 1827,
          "y": 1293
        },
        {
          "x": 1816,
          "y": 1291
        },
        {
          "x": 1810,
          "y": 1294
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 118,
      "x": 1841,
      "y": 1527,
      "rotation": 0,
      "w": 76,
      "h": 61,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv1k214_cfk",
      "polygon": [
        {
          "x": 1863,
          "y": 1554
        },
        {
          "x": 1866,
          "y": 1582
        },
        {
          "x": 1872,
          "y": 1583
        },
        {
          "x": 1886,
          "y": 1589
        },
        {
          "x": 1898,
          "y": 1589
        },
        {
          "x": 1906,
          "y": 1589
        },
        {
          "x": 1917,
          "y": 1583
        },
        {
          "x": 1916,
          "y": 1531
        },
        {
          "x": 1903,
          "y": 1534
        },
        {
          "x": 1896,
          "y": 1527
        },
        {
          "x": 1886,
          "y": 1531
        },
        {
          "x": 1879,
          "y": 1535
        },
        {
          "x": 1871,
          "y": 1534
        },
        {
          "x": 1866,
          "y": 1530
        },
        {
          "x": 1854,
          "y": 1529
        },
        {
          "x": 1841,
          "y": 1532
        },
        {
          "x": 1844,
          "y": 1548
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 119,
      "x": 1433,
      "y": 284,
      "rotation": 0,
      "w": 20,
      "h": 101,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv1l5i8_ci9",
      "polygon": [
        {
          "x": 1443,
          "y": 284
        },
        {
          "x": 1451,
          "y": 284
        },
        {
          "x": 1450,
          "y": 313
        },
        {
          "x": 1448,
          "y": 357
        },
        {
          "x": 1450,
          "y": 361
        },
        {
          "x": 1452,
          "y": 375
        },
        {
          "x": 1454,
          "y": 382
        },
        {
          "x": 1443,
          "y": 385
        },
        {
          "x": 1433,
          "y": 383
        },
        {
          "x": 1437,
          "y": 376
        },
        {
          "x": 1438,
          "y": 360
        },
        {
          "x": 1442,
          "y": 357
        },
        {
          "x": 1442,
          "y": 307
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 121,
      "x": 1476,
      "y": 37,
      "rotation": 0,
      "w": 19,
      "h": 95,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv1na4c_7kf",
      "polygon": [
        {
          "x": 1483,
          "y": 37
        },
        {
          "x": 1489,
          "y": 37
        },
        {
          "x": 1488,
          "y": 102
        },
        {
          "x": 1493,
          "y": 103
        },
        {
          "x": 1492,
          "y": 124
        },
        {
          "x": 1495,
          "y": 124
        },
        {
          "x": 1494,
          "y": 132
        },
        {
          "x": 1487,
          "y": 133
        },
        {
          "x": 1478,
          "y": 132
        },
        {
          "x": 1476,
          "y": 127
        },
        {
          "x": 1477,
          "y": 124
        },
        {
          "x": 1480,
          "y": 123
        },
        {
          "x": 1479,
          "y": 104
        },
        {
          "x": 1482,
          "y": 103
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 123,
      "x": 1690,
      "y": 1957,
      "rotation": 0,
      "w": 43,
      "h": 30,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv1p4bx_56r",
      "polygon": [
        {
          "x": 1714,
          "y": 1962
        },
        {
          "x": 1713,
          "y": 1966
        },
        {
          "x": 1706,
          "y": 1966
        },
        {
          "x": 1699,
          "y": 1966
        },
        {
          "x": 1694,
          "y": 1970
        },
        {
          "x": 1690,
          "y": 1982
        },
        {
          "x": 1696,
          "y": 1984
        },
        {
          "x": 1702,
          "y": 1986
        },
        {
          "x": 1709,
          "y": 1987
        },
        {
          "x": 1716,
          "y": 1987
        },
        {
          "x": 1721,
          "y": 1987
        },
        {
          "x": 1726,
          "y": 1984
        },
        {
          "x": 1726,
          "y": 1976
        },
        {
          "x": 1728,
          "y": 1971
        },
        {
          "x": 1733,
          "y": 1964
        },
        {
          "x": 1729,
          "y": 1960
        },
        {
          "x": 1721,
          "y": 1957
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 124,
      "x": 1772,
      "y": 1950,
      "rotation": 0,
      "w": 48,
      "h": 39,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv1pfoe_lkd",
      "polygon": [
        {
          "x": 1773,
          "y": 1959
        },
        {
          "x": 1772,
          "y": 1984
        },
        {
          "x": 1780,
          "y": 1986
        },
        {
          "x": 1793,
          "y": 1987
        },
        {
          "x": 1800,
          "y": 1987
        },
        {
          "x": 1812,
          "y": 1989
        },
        {
          "x": 1818,
          "y": 1989
        },
        {
          "x": 1820,
          "y": 1981
        },
        {
          "x": 1818,
          "y": 1969
        },
        {
          "x": 1818,
          "y": 1961
        },
        {
          "x": 1814,
          "y": 1956
        },
        {
          "x": 1809,
          "y": 1956
        },
        {
          "x": 1803,
          "y": 1951
        },
        {
          "x": 1799,
          "y": 1950
        },
        {
          "x": 1792,
          "y": 1950
        },
        {
          "x": 1787,
          "y": 1955
        },
        {
          "x": 1778,
          "y": 1956
        }
      ],
      "collisionType": "solid"
    },
    {
      "type": "obstacle",
      "zIndex": 125,
      "x": 1673,
      "y": 1916,
      "rotation": 0,
      "w": 153,
      "h": 36,
      "label": "COLISÃO POLIGONAL",
      "id": "poly_obs_mvv1pxr1_y5l",
      "polygon": [
        {
          "x": 1675,
          "y": 1950
        },
        {
          "x": 1826,
          "y": 1951
        },
        {
          "x": 1825,
          "y": 1916
        },
        {
          "x": 1673,
          "y": 1916
        }
      ],
      "collisionType": "solid"
    }
  ],
  "obstacles": [],
  "collisionBounds": []
},

  van: {
  "id": "van",
  "name": "SAFE ROOM: A VAN DE OPERAÇÕES (LABORATÓRIO TÁTICO)",
  "subtitle": "Base Móvel • Consulte o Mural de Pesquisas, equipe-se na Máquina de Suprimentos ou avance pela Porta",
  "imageAsset": "assets/van_interior.jpg",
  "width": 1536,
  "height": 857,
  "isSafeRoom": true,
  "palette": {
    "bg": "#0c0f17",
    "wallFill": "#1a1f2c",
    "wallStroke": "#38bdf8",
    "pathFill": "rgba(56, 189, 248, 0.08)",
    "pathStroke": "rgba(56, 189, 248, 0.25)"
  },
  "spawnP1": {
    "x": 230,
    "y": 560
  },
  "spawnP2": {
    "x": 230,
    "y": 620
  },
  "trashSpawns": [],
  "enemySpawns": [],
  "floorZones": [
    {
      "x": 140,
      "y": 440,
      "w": 1250,
      "h": 260,
      "label": "PÁTIO TÁTICO DA VAN"
    }
  ],
  "interactiveStations": [
    {
      "id": "notice_board",
      "name": "Mural de Avisos & Pesquisas",
      "icon": "📋",
      "x": 224,
      "y": 224,
      "w": 416,
      "h": 288,
      "zoneLabel": "MURAL DE PESQUISAS",
      "promptText": "Pressione [E] para abrir o mural",
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
      "promptText": "Pressione [E] para abrir a loja",
      "strokeColor": "#facc15",
      "fillColor": "transparent",
      "hideFloorZone": true
    }
  ],
  "transitionZone": {
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
  "restartZone": {
    "id": "trigger_sglp",
    "x": 64,
    "y": 480,
    "w": 80,
    "h": 160,
    "label": "PORTA TRASEIRA → REINICIAR",
    "subLabel": "Toque para reiniciar",
    "strokeColor": "#f59e0b",
    "fillColor": "transparent",
    "hideBox": true
  },
  "overheadZones": [
    {
      "id": "poly_obs_mvtx9cmq_y0s",
      "x": 330,
      "y": 589,
      "w": 98,
      "h": 64,
      "polygon": [
        {
          "x": 363,
          "y": 590
        },
        {
          "x": 356,
          "y": 589
        },
        {
          "x": 352,
          "y": 595
        },
        {
          "x": 349,
          "y": 600
        },
        {
          "x": 348,
          "y": 603
        },
        {
          "x": 348,
          "y": 607
        },
        {
          "x": 345,
          "y": 606
        },
        {
          "x": 339,
          "y": 606
        },
        {
          "x": 337,
          "y": 602
        },
        {
          "x": 335,
          "y": 605
        },
        {
          "x": 334,
          "y": 617
        },
        {
          "x": 330,
          "y": 617
        },
        {
          "x": 331,
          "y": 624
        },
        {
          "x": 335,
          "y": 627
        },
        {
          "x": 335,
          "y": 652
        },
        {
          "x": 338,
          "y": 653
        },
        {
          "x": 339,
          "y": 650
        },
        {
          "x": 341,
          "y": 649
        },
        {
          "x": 341,
          "y": 625
        },
        {
          "x": 343,
          "y": 629
        },
        {
          "x": 348,
          "y": 630
        },
        {
          "x": 351,
          "y": 633
        },
        {
          "x": 354,
          "y": 635
        },
        {
          "x": 362,
          "y": 635
        },
        {
          "x": 363,
          "y": 643
        },
        {
          "x": 366,
          "y": 643
        },
        {
          "x": 369,
          "y": 647
        },
        {
          "x": 373,
          "y": 646
        },
        {
          "x": 375,
          "y": 649
        },
        {
          "x": 402,
          "y": 649
        },
        {
          "x": 404,
          "y": 646
        },
        {
          "x": 407,
          "y": 646
        },
        {
          "x": 409,
          "y": 642
        },
        {
          "x": 413,
          "y": 640
        },
        {
          "x": 414,
          "y": 636
        },
        {
          "x": 415,
          "y": 632
        },
        {
          "x": 428,
          "y": 632
        },
        {
          "x": 428,
          "y": 609
        },
        {
          "x": 411,
          "y": 610
        },
        {
          "x": 411,
          "y": 602
        },
        {
          "x": 388,
          "y": 602
        },
        {
          "x": 386,
          "y": 597
        },
        {
          "x": 384,
          "y": 595
        },
        {
          "x": 381,
          "y": 589
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvtxavb7_vnn",
      "x": 667,
      "y": 589,
      "w": 72,
      "h": 34,
      "polygon": [
        {
          "x": 690,
          "y": 611
        },
        {
          "x": 682,
          "y": 610
        },
        {
          "x": 676,
          "y": 614
        },
        {
          "x": 671,
          "y": 618
        },
        {
          "x": 667,
          "y": 623
        },
        {
          "x": 674,
          "y": 623
        },
        {
          "x": 734,
          "y": 623
        },
        {
          "x": 728,
          "y": 619
        },
        {
          "x": 729,
          "y": 615
        },
        {
          "x": 733,
          "y": 618
        },
        {
          "x": 735,
          "y": 617
        },
        {
          "x": 734,
          "y": 611
        },
        {
          "x": 726,
          "y": 610
        },
        {
          "x": 732,
          "y": 608
        },
        {
          "x": 739,
          "y": 605
        },
        {
          "x": 737,
          "y": 602
        },
        {
          "x": 725,
          "y": 602
        },
        {
          "x": 727,
          "y": 598
        },
        {
          "x": 727,
          "y": 595
        },
        {
          "x": 725,
          "y": 593
        },
        {
          "x": 717,
          "y": 592
        },
        {
          "x": 715,
          "y": 593
        },
        {
          "x": 715,
          "y": 590
        },
        {
          "x": 712,
          "y": 589
        },
        {
          "x": 709,
          "y": 594
        },
        {
          "x": 707,
          "y": 596
        },
        {
          "x": 703,
          "y": 600
        },
        {
          "x": 702,
          "y": 601
        },
        {
          "x": 697,
          "y": 600
        },
        {
          "x": 694,
          "y": 598
        },
        {
          "x": 689,
          "y": 595
        },
        {
          "x": 682,
          "y": 593
        },
        {
          "x": 680,
          "y": 596
        },
        {
          "x": 680,
          "y": 599
        },
        {
          "x": 682,
          "y": 602
        },
        {
          "x": 683,
          "y": 605
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvtxd37k_58p",
      "x": 777,
      "y": 566,
      "w": 71,
      "h": 60,
      "polygon": [
        {
          "x": 777,
          "y": 623
        },
        {
          "x": 783,
          "y": 609
        },
        {
          "x": 797,
          "y": 602
        },
        {
          "x": 798,
          "y": 597
        },
        {
          "x": 781,
          "y": 581
        },
        {
          "x": 781,
          "y": 577
        },
        {
          "x": 792,
          "y": 566
        },
        {
          "x": 799,
          "y": 569
        },
        {
          "x": 799,
          "y": 575
        },
        {
          "x": 835,
          "y": 607
        },
        {
          "x": 838,
          "y": 615
        },
        {
          "x": 841,
          "y": 619
        },
        {
          "x": 846,
          "y": 621
        },
        {
          "x": 848,
          "y": 626
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvtxdz72_zz3",
      "x": 898,
      "y": 597,
      "w": 23,
      "h": 27,
      "polygon": [
        {
          "x": 898,
          "y": 623
        },
        {
          "x": 903,
          "y": 621
        },
        {
          "x": 904,
          "y": 609
        },
        {
          "x": 899,
          "y": 607
        },
        {
          "x": 899,
          "y": 600
        },
        {
          "x": 903,
          "y": 601
        },
        {
          "x": 904,
          "y": 597
        },
        {
          "x": 915,
          "y": 597
        },
        {
          "x": 916,
          "y": 600
        },
        {
          "x": 919,
          "y": 602
        },
        {
          "x": 920,
          "y": 609
        },
        {
          "x": 916,
          "y": 611
        },
        {
          "x": 917,
          "y": 622
        },
        {
          "x": 921,
          "y": 623
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvtxezy6_gbw",
      "x": 958,
      "y": 602,
      "w": 20,
      "h": 22,
      "polygon": [
        {
          "x": 960,
          "y": 624
        },
        {
          "x": 962,
          "y": 614
        },
        {
          "x": 958,
          "y": 612
        },
        {
          "x": 958,
          "y": 605
        },
        {
          "x": 962,
          "y": 604
        },
        {
          "x": 963,
          "y": 602
        },
        {
          "x": 971,
          "y": 602
        },
        {
          "x": 975,
          "y": 606
        },
        {
          "x": 975,
          "y": 609
        },
        {
          "x": 978,
          "y": 609
        },
        {
          "x": 978,
          "y": 614
        },
        {
          "x": 975,
          "y": 614
        },
        {
          "x": 975,
          "y": 624
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvtxg8bj_ifz",
      "x": 995,
      "y": 582,
      "w": 126,
      "h": 41,
      "polygon": [
        {
          "x": 996,
          "y": 622
        },
        {
          "x": 995,
          "y": 586
        },
        {
          "x": 1000,
          "y": 582
        },
        {
          "x": 1092,
          "y": 582
        },
        {
          "x": 1102,
          "y": 596
        },
        {
          "x": 1107,
          "y": 596
        },
        {
          "x": 1109,
          "y": 601
        },
        {
          "x": 1115,
          "y": 602
        },
        {
          "x": 1114,
          "y": 606
        },
        {
          "x": 1116,
          "y": 609
        },
        {
          "x": 1116,
          "y": 612
        },
        {
          "x": 1121,
          "y": 615
        },
        {
          "x": 1120,
          "y": 623
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvuc1lis_kpq",
      "x": 674,
      "y": 620,
      "w": 65,
      "h": 52,
      "polygon": [
        {
          "x": 679,
          "y": 623
        },
        {
          "x": 675,
          "y": 632
        },
        {
          "x": 674,
          "y": 639
        },
        {
          "x": 674,
          "y": 646
        },
        {
          "x": 676,
          "y": 653
        },
        {
          "x": 680,
          "y": 661
        },
        {
          "x": 686,
          "y": 665
        },
        {
          "x": 690,
          "y": 667
        },
        {
          "x": 698,
          "y": 672
        },
        {
          "x": 705,
          "y": 671
        },
        {
          "x": 711,
          "y": 670
        },
        {
          "x": 720,
          "y": 666
        },
        {
          "x": 727,
          "y": 659
        },
        {
          "x": 731,
          "y": 650
        },
        {
          "x": 731,
          "y": 640
        },
        {
          "x": 732,
          "y": 638
        },
        {
          "x": 739,
          "y": 638
        },
        {
          "x": 739,
          "y": 629
        },
        {
          "x": 736,
          "y": 625
        },
        {
          "x": 730,
          "y": 622
        },
        {
          "x": 700,
          "y": 620
        },
        {
          "x": 684,
          "y": 621
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvuc345x_r27",
      "x": 777,
      "y": 621,
      "w": 72,
      "h": 61,
      "polygon": [
        {
          "x": 779,
          "y": 621
        },
        {
          "x": 777,
          "y": 633
        },
        {
          "x": 777,
          "y": 638
        },
        {
          "x": 778,
          "y": 648
        },
        {
          "x": 783,
          "y": 652
        },
        {
          "x": 788,
          "y": 657
        },
        {
          "x": 789,
          "y": 661
        },
        {
          "x": 783,
          "y": 661
        },
        {
          "x": 782,
          "y": 682
        },
        {
          "x": 848,
          "y": 681
        },
        {
          "x": 847,
          "y": 666
        },
        {
          "x": 843,
          "y": 660
        },
        {
          "x": 838,
          "y": 661
        },
        {
          "x": 838,
          "y": 657
        },
        {
          "x": 849,
          "y": 655
        },
        {
          "x": 848,
          "y": 635
        },
        {
          "x": 845,
          "y": 634
        },
        {
          "x": 834,
          "y": 635
        },
        {
          "x": 833,
          "y": 638
        },
        {
          "x": 829,
          "y": 638
        },
        {
          "x": 826,
          "y": 636
        },
        {
          "x": 819,
          "y": 635
        },
        {
          "x": 811,
          "y": 631
        },
        {
          "x": 804,
          "y": 633
        },
        {
          "x": 803,
          "y": 646
        },
        {
          "x": 798,
          "y": 646
        },
        {
          "x": 795,
          "y": 642
        },
        {
          "x": 792,
          "y": 637
        },
        {
          "x": 791,
          "y": 629
        },
        {
          "x": 794,
          "y": 625
        },
        {
          "x": 796,
          "y": 621
        },
        {
          "x": 813,
          "y": 624
        },
        {
          "x": 817,
          "y": 629
        },
        {
          "x": 818,
          "y": 633
        },
        {
          "x": 827,
          "y": 632
        },
        {
          "x": 830,
          "y": 632
        },
        {
          "x": 836,
          "y": 626
        },
        {
          "x": 842,
          "y": 631
        },
        {
          "x": 847,
          "y": 632
        },
        {
          "x": 848,
          "y": 624
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvuc7462_l2o",
      "x": 896,
      "y": 617,
      "w": 27,
      "h": 42,
      "polygon": [
        {
          "x": 896,
          "y": 623
        },
        {
          "x": 898,
          "y": 655
        },
        {
          "x": 903,
          "y": 659
        },
        {
          "x": 918,
          "y": 659
        },
        {
          "x": 923,
          "y": 653
        },
        {
          "x": 923,
          "y": 624
        },
        {
          "x": 915,
          "y": 618
        },
        {
          "x": 908,
          "y": 617
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvuc7fur_m05",
      "x": 944,
      "y": 621,
      "w": 47,
      "h": 50,
      "polygon": [
        {
          "x": 961,
          "y": 621
        },
        {
          "x": 975,
          "y": 621
        },
        {
          "x": 976,
          "y": 636
        },
        {
          "x": 991,
          "y": 656
        },
        {
          "x": 982,
          "y": 671
        },
        {
          "x": 957,
          "y": 671
        },
        {
          "x": 944,
          "y": 663
        },
        {
          "x": 948,
          "y": 650
        },
        {
          "x": 961,
          "y": 636
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    },
    {
      "id": "poly_obs_mvuc89jn_8oc",
      "x": 992,
      "y": 619,
      "w": 135,
      "h": 133,
      "polygon": [
        {
          "x": 995,
          "y": 620
        },
        {
          "x": 996,
          "y": 686
        },
        {
          "x": 992,
          "y": 686
        },
        {
          "x": 993,
          "y": 719
        },
        {
          "x": 1009,
          "y": 752
        },
        {
          "x": 1127,
          "y": 750
        },
        {
          "x": 1127,
          "y": 721
        },
        {
          "x": 1120,
          "y": 716
        },
        {
          "x": 1119,
          "y": 619
        }
      ],
      "label": "POLÍGONO POR CIMA",
      "collisionType": "overhead",
      "isOverhead": true
    }
  ],
  "triggerZones": [
    {
      "id": "trigger_2yqx",
      "x": 704,
      "y": 368,
      "w": 240,
      "h": 112,
      "label": "TRIGGER",
      "ai_instruction": "Tire essa zona amarela, espere a personagem estar próximo a essa área para abrir o menu de loja mantenha o icone flutuante de \"pressione E para tal coisa\"",
      "collisionType": "trigger",
      "isTrigger": true
    },
    {
      "id": "trigger_6ta6",
      "x": 224,
      "y": 224,
      "w": 416,
      "h": 288,
      "label": "TRIGGER",
      "ai_instruction": "tire essa zona azul, quando a personagem chegar na zona de trigger deve aparecer \"pressione E para abrir o mural\"",
      "collisionType": "trigger",
      "isTrigger": true
    },
    {
      "id": "trigger_jfqd",
      "x": 1328,
      "y": 432,
      "w": 96,
      "h": 144,
      "label": "TRIGGER",
      "ai_instruction": "na primeira fase, se você tocar aqui, automáticamente você é teleportado para a primeira fase, na segunda para frente aparece aquela função de reiniciar ou ir para a próxima fase e tire esse quadrado de passar de fase de uma fase para outra faça um efeitinho só para não ficar hiper seco",
      "collisionType": "trigger",
      "isTrigger": true
    },
    {
      "id": "trigger_sglp",
      "x": 64,
      "y": 480,
      "w": 80,
      "h": 160,
      "label": "TRIGGER",
      "ai_instruction": "tirar a função de ir para próxima fase e voltar na fase anterior, e use as duas portas uma para ir e outra para voltar, só que na porta de voltar aparece \"tem certeza que deseja reiniciar?\" na de ir vai direto",
      "collisionType": "trigger",
      "isTrigger": true
    }
  ],
  "animationMarkers": [
    {
      "id": "anim_9gqp",
      "x": 464,
      "y": 160,
      "label": "ANIM_766",
      "ai_instruction": "deixe um ponto de exclamação flutuando aqui"
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
          "itemsCount": 55,
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
              "h": 240,
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
              "zIndex": 39,
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
              "zIndex": 40,
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
              "zIndex": 41,
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
            },
            {
              "type": "obstacle",
              "zIndex": 42,
              "x": 330,
              "y": 589,
              "rotation": 0,
              "w": 98,
              "h": 64,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvtx9cmq_y0s",
              "polygon": [
                {
                  "x": 363,
                  "y": 590
                },
                {
                  "x": 356,
                  "y": 589
                },
                {
                  "x": 352,
                  "y": 595
                },
                {
                  "x": 349,
                  "y": 600
                },
                {
                  "x": 348,
                  "y": 603
                },
                {
                  "x": 348,
                  "y": 607
                },
                {
                  "x": 345,
                  "y": 606
                },
                {
                  "x": 339,
                  "y": 606
                },
                {
                  "x": 337,
                  "y": 602
                },
                {
                  "x": 335,
                  "y": 605
                },
                {
                  "x": 334,
                  "y": 617
                },
                {
                  "x": 330,
                  "y": 617
                },
                {
                  "x": 331,
                  "y": 624
                },
                {
                  "x": 335,
                  "y": 627
                },
                {
                  "x": 335,
                  "y": 652
                },
                {
                  "x": 338,
                  "y": 653
                },
                {
                  "x": 339,
                  "y": 650
                },
                {
                  "x": 341,
                  "y": 649
                },
                {
                  "x": 341,
                  "y": 625
                },
                {
                  "x": 343,
                  "y": 629
                },
                {
                  "x": 348,
                  "y": 630
                },
                {
                  "x": 351,
                  "y": 633
                },
                {
                  "x": 354,
                  "y": 635
                },
                {
                  "x": 362,
                  "y": 635
                },
                {
                  "x": 363,
                  "y": 643
                },
                {
                  "x": 366,
                  "y": 643
                },
                {
                  "x": 369,
                  "y": 647
                },
                {
                  "x": 373,
                  "y": 646
                },
                {
                  "x": 375,
                  "y": 649
                },
                {
                  "x": 402,
                  "y": 649
                },
                {
                  "x": 404,
                  "y": 646
                },
                {
                  "x": 407,
                  "y": 646
                },
                {
                  "x": 409,
                  "y": 642
                },
                {
                  "x": 413,
                  "y": 640
                },
                {
                  "x": 414,
                  "y": 636
                },
                {
                  "x": 415,
                  "y": 632
                },
                {
                  "x": 428,
                  "y": 632
                },
                {
                  "x": 428,
                  "y": 609
                },
                {
                  "x": 411,
                  "y": 610
                },
                {
                  "x": 411,
                  "y": 602
                },
                {
                  "x": 388,
                  "y": 602
                },
                {
                  "x": 386,
                  "y": 597
                },
                {
                  "x": 384,
                  "y": 595
                },
                {
                  "x": 381,
                  "y": 589
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 43,
              "x": 667,
              "y": 589,
              "rotation": 0,
              "w": 72,
              "h": 34,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvtxavb7_vnn",
              "polygon": [
                {
                  "x": 690,
                  "y": 611
                },
                {
                  "x": 682,
                  "y": 610
                },
                {
                  "x": 676,
                  "y": 614
                },
                {
                  "x": 671,
                  "y": 618
                },
                {
                  "x": 667,
                  "y": 623
                },
                {
                  "x": 674,
                  "y": 623
                },
                {
                  "x": 734,
                  "y": 623
                },
                {
                  "x": 728,
                  "y": 619
                },
                {
                  "x": 729,
                  "y": 615
                },
                {
                  "x": 733,
                  "y": 618
                },
                {
                  "x": 735,
                  "y": 617
                },
                {
                  "x": 734,
                  "y": 611
                },
                {
                  "x": 726,
                  "y": 610
                },
                {
                  "x": 732,
                  "y": 608
                },
                {
                  "x": 739,
                  "y": 605
                },
                {
                  "x": 737,
                  "y": 602
                },
                {
                  "x": 725,
                  "y": 602
                },
                {
                  "x": 727,
                  "y": 598
                },
                {
                  "x": 727,
                  "y": 595
                },
                {
                  "x": 725,
                  "y": 593
                },
                {
                  "x": 717,
                  "y": 592
                },
                {
                  "x": 715,
                  "y": 593
                },
                {
                  "x": 715,
                  "y": 590
                },
                {
                  "x": 712,
                  "y": 589
                },
                {
                  "x": 709,
                  "y": 594
                },
                {
                  "x": 707,
                  "y": 596
                },
                {
                  "x": 703,
                  "y": 600
                },
                {
                  "x": 702,
                  "y": 601
                },
                {
                  "x": 697,
                  "y": 600
                },
                {
                  "x": 694,
                  "y": 598
                },
                {
                  "x": 689,
                  "y": 595
                },
                {
                  "x": 682,
                  "y": 593
                },
                {
                  "x": 680,
                  "y": 596
                },
                {
                  "x": 680,
                  "y": 599
                },
                {
                  "x": 682,
                  "y": 602
                },
                {
                  "x": 683,
                  "y": 605
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 44,
              "x": 777,
              "y": 566,
              "rotation": 0,
              "w": 71,
              "h": 60,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvtxd37k_58p",
              "polygon": [
                {
                  "x": 777,
                  "y": 623
                },
                {
                  "x": 783,
                  "y": 609
                },
                {
                  "x": 797,
                  "y": 602
                },
                {
                  "x": 798,
                  "y": 597
                },
                {
                  "x": 781,
                  "y": 581
                },
                {
                  "x": 781,
                  "y": 577
                },
                {
                  "x": 792,
                  "y": 566
                },
                {
                  "x": 799,
                  "y": 569
                },
                {
                  "x": 799,
                  "y": 575
                },
                {
                  "x": 835,
                  "y": 607
                },
                {
                  "x": 838,
                  "y": 615
                },
                {
                  "x": 841,
                  "y": 619
                },
                {
                  "x": 846,
                  "y": 621
                },
                {
                  "x": 848,
                  "y": 626
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 45,
              "x": 898,
              "y": 597,
              "rotation": 0,
              "w": 23,
              "h": 27,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvtxdz72_zz3",
              "polygon": [
                {
                  "x": 898,
                  "y": 623
                },
                {
                  "x": 903,
                  "y": 621
                },
                {
                  "x": 904,
                  "y": 609
                },
                {
                  "x": 899,
                  "y": 607
                },
                {
                  "x": 899,
                  "y": 600
                },
                {
                  "x": 903,
                  "y": 601
                },
                {
                  "x": 904,
                  "y": 597
                },
                {
                  "x": 915,
                  "y": 597
                },
                {
                  "x": 916,
                  "y": 600
                },
                {
                  "x": 919,
                  "y": 602
                },
                {
                  "x": 920,
                  "y": 609
                },
                {
                  "x": 916,
                  "y": 611
                },
                {
                  "x": 917,
                  "y": 622
                },
                {
                  "x": 921,
                  "y": 623
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 46,
              "x": 958,
              "y": 602,
              "rotation": 0,
              "w": 20,
              "h": 22,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvtxezy6_gbw",
              "polygon": [
                {
                  "x": 960,
                  "y": 624
                },
                {
                  "x": 962,
                  "y": 614
                },
                {
                  "x": 958,
                  "y": 612
                },
                {
                  "x": 958,
                  "y": 605
                },
                {
                  "x": 962,
                  "y": 604
                },
                {
                  "x": 963,
                  "y": 602
                },
                {
                  "x": 971,
                  "y": 602
                },
                {
                  "x": 975,
                  "y": 606
                },
                {
                  "x": 975,
                  "y": 609
                },
                {
                  "x": 978,
                  "y": 609
                },
                {
                  "x": 978,
                  "y": 614
                },
                {
                  "x": 975,
                  "y": 614
                },
                {
                  "x": 975,
                  "y": 624
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 47,
              "x": 995,
              "y": 582,
              "rotation": 0,
              "w": 126,
              "h": 41,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvtxg8bj_ifz",
              "polygon": [
                {
                  "x": 996,
                  "y": 622
                },
                {
                  "x": 995,
                  "y": 586
                },
                {
                  "x": 1000,
                  "y": 582
                },
                {
                  "x": 1092,
                  "y": 582
                },
                {
                  "x": 1102,
                  "y": 596
                },
                {
                  "x": 1107,
                  "y": 596
                },
                {
                  "x": 1109,
                  "y": 601
                },
                {
                  "x": 1115,
                  "y": 602
                },
                {
                  "x": 1114,
                  "y": 606
                },
                {
                  "x": 1116,
                  "y": 609
                },
                {
                  "x": 1116,
                  "y": 612
                },
                {
                  "x": 1121,
                  "y": 615
                },
                {
                  "x": 1120,
                  "y": 623
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 48,
              "x": 674,
              "y": 620,
              "rotation": 0,
              "w": 65,
              "h": 52,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvuc1lis_kpq",
              "polygon": [
                {
                  "x": 679,
                  "y": 623
                },
                {
                  "x": 675,
                  "y": 632
                },
                {
                  "x": 674,
                  "y": 639
                },
                {
                  "x": 674,
                  "y": 646
                },
                {
                  "x": 676,
                  "y": 653
                },
                {
                  "x": 680,
                  "y": 661
                },
                {
                  "x": 686,
                  "y": 665
                },
                {
                  "x": 690,
                  "y": 667
                },
                {
                  "x": 698,
                  "y": 672
                },
                {
                  "x": 705,
                  "y": 671
                },
                {
                  "x": 711,
                  "y": 670
                },
                {
                  "x": 720,
                  "y": 666
                },
                {
                  "x": 727,
                  "y": 659
                },
                {
                  "x": 731,
                  "y": 650
                },
                {
                  "x": 731,
                  "y": 640
                },
                {
                  "x": 732,
                  "y": 638
                },
                {
                  "x": 739,
                  "y": 638
                },
                {
                  "x": 739,
                  "y": 629
                },
                {
                  "x": 736,
                  "y": 625
                },
                {
                  "x": 730,
                  "y": 622
                },
                {
                  "x": 700,
                  "y": 620
                },
                {
                  "x": 684,
                  "y": 621
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 49,
              "x": 777,
              "y": 621,
              "rotation": 0,
              "w": 72,
              "h": 61,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvuc345x_r27",
              "polygon": [
                {
                  "x": 779,
                  "y": 621
                },
                {
                  "x": 777,
                  "y": 633
                },
                {
                  "x": 777,
                  "y": 638
                },
                {
                  "x": 778,
                  "y": 648
                },
                {
                  "x": 783,
                  "y": 652
                },
                {
                  "x": 788,
                  "y": 657
                },
                {
                  "x": 789,
                  "y": 661
                },
                {
                  "x": 783,
                  "y": 661
                },
                {
                  "x": 782,
                  "y": 682
                },
                {
                  "x": 848,
                  "y": 681
                },
                {
                  "x": 847,
                  "y": 666
                },
                {
                  "x": 843,
                  "y": 660
                },
                {
                  "x": 838,
                  "y": 661
                },
                {
                  "x": 838,
                  "y": 657
                },
                {
                  "x": 849,
                  "y": 655
                },
                {
                  "x": 848,
                  "y": 635
                },
                {
                  "x": 845,
                  "y": 634
                },
                {
                  "x": 834,
                  "y": 635
                },
                {
                  "x": 833,
                  "y": 638
                },
                {
                  "x": 829,
                  "y": 638
                },
                {
                  "x": 826,
                  "y": 636
                },
                {
                  "x": 819,
                  "y": 635
                },
                {
                  "x": 811,
                  "y": 631
                },
                {
                  "x": 804,
                  "y": 633
                },
                {
                  "x": 803,
                  "y": 646
                },
                {
                  "x": 798,
                  "y": 646
                },
                {
                  "x": 795,
                  "y": 642
                },
                {
                  "x": 792,
                  "y": 637
                },
                {
                  "x": 791,
                  "y": 629
                },
                {
                  "x": 794,
                  "y": 625
                },
                {
                  "x": 796,
                  "y": 621
                },
                {
                  "x": 813,
                  "y": 624
                },
                {
                  "x": 817,
                  "y": 629
                },
                {
                  "x": 818,
                  "y": 633
                },
                {
                  "x": 827,
                  "y": 632
                },
                {
                  "x": 830,
                  "y": 632
                },
                {
                  "x": 836,
                  "y": 626
                },
                {
                  "x": 842,
                  "y": 631
                },
                {
                  "x": 847,
                  "y": 632
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
              "zIndex": 50,
              "x": 896,
              "y": 617,
              "rotation": 0,
              "w": 27,
              "h": 42,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvuc7462_l2o",
              "polygon": [
                {
                  "x": 896,
                  "y": 623
                },
                {
                  "x": 898,
                  "y": 655
                },
                {
                  "x": 903,
                  "y": 659
                },
                {
                  "x": 918,
                  "y": 659
                },
                {
                  "x": 923,
                  "y": 653
                },
                {
                  "x": 923,
                  "y": 624
                },
                {
                  "x": 915,
                  "y": 618
                },
                {
                  "x": 908,
                  "y": 617
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 51,
              "x": 944,
              "y": 621,
              "rotation": 0,
              "w": 47,
              "h": 50,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvuc7fur_m05",
              "polygon": [
                {
                  "x": 961,
                  "y": 621
                },
                {
                  "x": 975,
                  "y": 621
                },
                {
                  "x": 976,
                  "y": 636
                },
                {
                  "x": 991,
                  "y": 656
                },
                {
                  "x": 982,
                  "y": 671
                },
                {
                  "x": 957,
                  "y": 671
                },
                {
                  "x": 944,
                  "y": 663
                },
                {
                  "x": 948,
                  "y": 650
                },
                {
                  "x": 961,
                  "y": 636
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 52,
              "x": 992,
              "y": 619,
              "rotation": 0,
              "w": 135,
              "h": 133,
              "label": "POLÍGONO POR CIMA",
              "id": "poly_obs_mvuc89jn_8oc",
              "polygon": [
                {
                  "x": 995,
                  "y": 620
                },
                {
                  "x": 996,
                  "y": 686
                },
                {
                  "x": 992,
                  "y": 686
                },
                {
                  "x": 993,
                  "y": 719
                },
                {
                  "x": 1009,
                  "y": 752
                },
                {
                  "x": 1127,
                  "y": 750
                },
                {
                  "x": 1127,
                  "y": 721
                },
                {
                  "x": 1120,
                  "y": 716
                },
                {
                  "x": 1119,
                  "y": 619
                }
              ],
              "collisionType": "overhead",
              "isOverhead": true
            },
            {
              "type": "obstacle",
              "zIndex": 53,
              "x": 328,
              "y": 616,
              "rotation": 0,
              "w": 811,
              "h": 8,
              "label": "COLISÃO POLIGONAL",
              "id": "poly_obs_mvucfzph_fc6",
              "polygon": [
                {
                  "x": 430,
                  "y": 619
                },
                {
                  "x": 1139,
                  "y": 616
                },
                {
                  "x": 1139,
                  "y": 622
                },
                {
                  "x": 328,
                  "y": 624
                },
                {
                  "x": 329,
                  "y": 616
                }
              ],
              "collisionType": "solid"
            },
            {
              "type": "obstacle",
              "zIndex": 54,
              "x": 64,
              "y": 480,
              "rotation": 0,
              "w": 80,
              "h": 160,
              "label": "TRIGGER",
              "id": "trigger_sglp",
              "collisionType": "trigger",
              "isTrigger": true,
              "ai_instruction": "tirar a função de ir para próxima fase e voltar na fase anterior, e use as duas portas uma para ir e outra para voltar, só que na porta de voltar aparece \"tem certeza que deseja reiniciar?\" na de ir vai direto"
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
      "itemsCount": 55,
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
          "h": 240,
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
          "zIndex": 39,
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
          "zIndex": 40,
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
          "zIndex": 41,
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
        },
        {
          "type": "obstacle",
          "zIndex": 42,
          "x": 330,
          "y": 589,
          "rotation": 0,
          "w": 98,
          "h": 64,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvtx9cmq_y0s",
          "polygon": [
            {
              "x": 363,
              "y": 590
            },
            {
              "x": 356,
              "y": 589
            },
            {
              "x": 352,
              "y": 595
            },
            {
              "x": 349,
              "y": 600
            },
            {
              "x": 348,
              "y": 603
            },
            {
              "x": 348,
              "y": 607
            },
            {
              "x": 345,
              "y": 606
            },
            {
              "x": 339,
              "y": 606
            },
            {
              "x": 337,
              "y": 602
            },
            {
              "x": 335,
              "y": 605
            },
            {
              "x": 334,
              "y": 617
            },
            {
              "x": 330,
              "y": 617
            },
            {
              "x": 331,
              "y": 624
            },
            {
              "x": 335,
              "y": 627
            },
            {
              "x": 335,
              "y": 652
            },
            {
              "x": 338,
              "y": 653
            },
            {
              "x": 339,
              "y": 650
            },
            {
              "x": 341,
              "y": 649
            },
            {
              "x": 341,
              "y": 625
            },
            {
              "x": 343,
              "y": 629
            },
            {
              "x": 348,
              "y": 630
            },
            {
              "x": 351,
              "y": 633
            },
            {
              "x": 354,
              "y": 635
            },
            {
              "x": 362,
              "y": 635
            },
            {
              "x": 363,
              "y": 643
            },
            {
              "x": 366,
              "y": 643
            },
            {
              "x": 369,
              "y": 647
            },
            {
              "x": 373,
              "y": 646
            },
            {
              "x": 375,
              "y": 649
            },
            {
              "x": 402,
              "y": 649
            },
            {
              "x": 404,
              "y": 646
            },
            {
              "x": 407,
              "y": 646
            },
            {
              "x": 409,
              "y": 642
            },
            {
              "x": 413,
              "y": 640
            },
            {
              "x": 414,
              "y": 636
            },
            {
              "x": 415,
              "y": 632
            },
            {
              "x": 428,
              "y": 632
            },
            {
              "x": 428,
              "y": 609
            },
            {
              "x": 411,
              "y": 610
            },
            {
              "x": 411,
              "y": 602
            },
            {
              "x": 388,
              "y": 602
            },
            {
              "x": 386,
              "y": 597
            },
            {
              "x": 384,
              "y": 595
            },
            {
              "x": 381,
              "y": 589
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 43,
          "x": 667,
          "y": 589,
          "rotation": 0,
          "w": 72,
          "h": 34,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvtxavb7_vnn",
          "polygon": [
            {
              "x": 690,
              "y": 611
            },
            {
              "x": 682,
              "y": 610
            },
            {
              "x": 676,
              "y": 614
            },
            {
              "x": 671,
              "y": 618
            },
            {
              "x": 667,
              "y": 623
            },
            {
              "x": 674,
              "y": 623
            },
            {
              "x": 734,
              "y": 623
            },
            {
              "x": 728,
              "y": 619
            },
            {
              "x": 729,
              "y": 615
            },
            {
              "x": 733,
              "y": 618
            },
            {
              "x": 735,
              "y": 617
            },
            {
              "x": 734,
              "y": 611
            },
            {
              "x": 726,
              "y": 610
            },
            {
              "x": 732,
              "y": 608
            },
            {
              "x": 739,
              "y": 605
            },
            {
              "x": 737,
              "y": 602
            },
            {
              "x": 725,
              "y": 602
            },
            {
              "x": 727,
              "y": 598
            },
            {
              "x": 727,
              "y": 595
            },
            {
              "x": 725,
              "y": 593
            },
            {
              "x": 717,
              "y": 592
            },
            {
              "x": 715,
              "y": 593
            },
            {
              "x": 715,
              "y": 590
            },
            {
              "x": 712,
              "y": 589
            },
            {
              "x": 709,
              "y": 594
            },
            {
              "x": 707,
              "y": 596
            },
            {
              "x": 703,
              "y": 600
            },
            {
              "x": 702,
              "y": 601
            },
            {
              "x": 697,
              "y": 600
            },
            {
              "x": 694,
              "y": 598
            },
            {
              "x": 689,
              "y": 595
            },
            {
              "x": 682,
              "y": 593
            },
            {
              "x": 680,
              "y": 596
            },
            {
              "x": 680,
              "y": 599
            },
            {
              "x": 682,
              "y": 602
            },
            {
              "x": 683,
              "y": 605
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 44,
          "x": 777,
          "y": 566,
          "rotation": 0,
          "w": 71,
          "h": 60,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvtxd37k_58p",
          "polygon": [
            {
              "x": 777,
              "y": 623
            },
            {
              "x": 783,
              "y": 609
            },
            {
              "x": 797,
              "y": 602
            },
            {
              "x": 798,
              "y": 597
            },
            {
              "x": 781,
              "y": 581
            },
            {
              "x": 781,
              "y": 577
            },
            {
              "x": 792,
              "y": 566
            },
            {
              "x": 799,
              "y": 569
            },
            {
              "x": 799,
              "y": 575
            },
            {
              "x": 835,
              "y": 607
            },
            {
              "x": 838,
              "y": 615
            },
            {
              "x": 841,
              "y": 619
            },
            {
              "x": 846,
              "y": 621
            },
            {
              "x": 848,
              "y": 626
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 45,
          "x": 898,
          "y": 597,
          "rotation": 0,
          "w": 23,
          "h": 27,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvtxdz72_zz3",
          "polygon": [
            {
              "x": 898,
              "y": 623
            },
            {
              "x": 903,
              "y": 621
            },
            {
              "x": 904,
              "y": 609
            },
            {
              "x": 899,
              "y": 607
            },
            {
              "x": 899,
              "y": 600
            },
            {
              "x": 903,
              "y": 601
            },
            {
              "x": 904,
              "y": 597
            },
            {
              "x": 915,
              "y": 597
            },
            {
              "x": 916,
              "y": 600
            },
            {
              "x": 919,
              "y": 602
            },
            {
              "x": 920,
              "y": 609
            },
            {
              "x": 916,
              "y": 611
            },
            {
              "x": 917,
              "y": 622
            },
            {
              "x": 921,
              "y": 623
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 46,
          "x": 958,
          "y": 602,
          "rotation": 0,
          "w": 20,
          "h": 22,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvtxezy6_gbw",
          "polygon": [
            {
              "x": 960,
              "y": 624
            },
            {
              "x": 962,
              "y": 614
            },
            {
              "x": 958,
              "y": 612
            },
            {
              "x": 958,
              "y": 605
            },
            {
              "x": 962,
              "y": 604
            },
            {
              "x": 963,
              "y": 602
            },
            {
              "x": 971,
              "y": 602
            },
            {
              "x": 975,
              "y": 606
            },
            {
              "x": 975,
              "y": 609
            },
            {
              "x": 978,
              "y": 609
            },
            {
              "x": 978,
              "y": 614
            },
            {
              "x": 975,
              "y": 614
            },
            {
              "x": 975,
              "y": 624
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 47,
          "x": 995,
          "y": 582,
          "rotation": 0,
          "w": 126,
          "h": 41,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvtxg8bj_ifz",
          "polygon": [
            {
              "x": 996,
              "y": 622
            },
            {
              "x": 995,
              "y": 586
            },
            {
              "x": 1000,
              "y": 582
            },
            {
              "x": 1092,
              "y": 582
            },
            {
              "x": 1102,
              "y": 596
            },
            {
              "x": 1107,
              "y": 596
            },
            {
              "x": 1109,
              "y": 601
            },
            {
              "x": 1115,
              "y": 602
            },
            {
              "x": 1114,
              "y": 606
            },
            {
              "x": 1116,
              "y": 609
            },
            {
              "x": 1116,
              "y": 612
            },
            {
              "x": 1121,
              "y": 615
            },
            {
              "x": 1120,
              "y": 623
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 48,
          "x": 674,
          "y": 620,
          "rotation": 0,
          "w": 65,
          "h": 52,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvuc1lis_kpq",
          "polygon": [
            {
              "x": 679,
              "y": 623
            },
            {
              "x": 675,
              "y": 632
            },
            {
              "x": 674,
              "y": 639
            },
            {
              "x": 674,
              "y": 646
            },
            {
              "x": 676,
              "y": 653
            },
            {
              "x": 680,
              "y": 661
            },
            {
              "x": 686,
              "y": 665
            },
            {
              "x": 690,
              "y": 667
            },
            {
              "x": 698,
              "y": 672
            },
            {
              "x": 705,
              "y": 671
            },
            {
              "x": 711,
              "y": 670
            },
            {
              "x": 720,
              "y": 666
            },
            {
              "x": 727,
              "y": 659
            },
            {
              "x": 731,
              "y": 650
            },
            {
              "x": 731,
              "y": 640
            },
            {
              "x": 732,
              "y": 638
            },
            {
              "x": 739,
              "y": 638
            },
            {
              "x": 739,
              "y": 629
            },
            {
              "x": 736,
              "y": 625
            },
            {
              "x": 730,
              "y": 622
            },
            {
              "x": 700,
              "y": 620
            },
            {
              "x": 684,
              "y": 621
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 49,
          "x": 777,
          "y": 621,
          "rotation": 0,
          "w": 72,
          "h": 61,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvuc345x_r27",
          "polygon": [
            {
              "x": 779,
              "y": 621
            },
            {
              "x": 777,
              "y": 633
            },
            {
              "x": 777,
              "y": 638
            },
            {
              "x": 778,
              "y": 648
            },
            {
              "x": 783,
              "y": 652
            },
            {
              "x": 788,
              "y": 657
            },
            {
              "x": 789,
              "y": 661
            },
            {
              "x": 783,
              "y": 661
            },
            {
              "x": 782,
              "y": 682
            },
            {
              "x": 848,
              "y": 681
            },
            {
              "x": 847,
              "y": 666
            },
            {
              "x": 843,
              "y": 660
            },
            {
              "x": 838,
              "y": 661
            },
            {
              "x": 838,
              "y": 657
            },
            {
              "x": 849,
              "y": 655
            },
            {
              "x": 848,
              "y": 635
            },
            {
              "x": 845,
              "y": 634
            },
            {
              "x": 834,
              "y": 635
            },
            {
              "x": 833,
              "y": 638
            },
            {
              "x": 829,
              "y": 638
            },
            {
              "x": 826,
              "y": 636
            },
            {
              "x": 819,
              "y": 635
            },
            {
              "x": 811,
              "y": 631
            },
            {
              "x": 804,
              "y": 633
            },
            {
              "x": 803,
              "y": 646
            },
            {
              "x": 798,
              "y": 646
            },
            {
              "x": 795,
              "y": 642
            },
            {
              "x": 792,
              "y": 637
            },
            {
              "x": 791,
              "y": 629
            },
            {
              "x": 794,
              "y": 625
            },
            {
              "x": 796,
              "y": 621
            },
            {
              "x": 813,
              "y": 624
            },
            {
              "x": 817,
              "y": 629
            },
            {
              "x": 818,
              "y": 633
            },
            {
              "x": 827,
              "y": 632
            },
            {
              "x": 830,
              "y": 632
            },
            {
              "x": 836,
              "y": 626
            },
            {
              "x": 842,
              "y": 631
            },
            {
              "x": 847,
              "y": 632
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
          "zIndex": 50,
          "x": 896,
          "y": 617,
          "rotation": 0,
          "w": 27,
          "h": 42,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvuc7462_l2o",
          "polygon": [
            {
              "x": 896,
              "y": 623
            },
            {
              "x": 898,
              "y": 655
            },
            {
              "x": 903,
              "y": 659
            },
            {
              "x": 918,
              "y": 659
            },
            {
              "x": 923,
              "y": 653
            },
            {
              "x": 923,
              "y": 624
            },
            {
              "x": 915,
              "y": 618
            },
            {
              "x": 908,
              "y": 617
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 51,
          "x": 944,
          "y": 621,
          "rotation": 0,
          "w": 47,
          "h": 50,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvuc7fur_m05",
          "polygon": [
            {
              "x": 961,
              "y": 621
            },
            {
              "x": 975,
              "y": 621
            },
            {
              "x": 976,
              "y": 636
            },
            {
              "x": 991,
              "y": 656
            },
            {
              "x": 982,
              "y": 671
            },
            {
              "x": 957,
              "y": 671
            },
            {
              "x": 944,
              "y": 663
            },
            {
              "x": 948,
              "y": 650
            },
            {
              "x": 961,
              "y": 636
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 52,
          "x": 992,
          "y": 619,
          "rotation": 0,
          "w": 135,
          "h": 133,
          "label": "POLÍGONO POR CIMA",
          "id": "poly_obs_mvuc89jn_8oc",
          "polygon": [
            {
              "x": 995,
              "y": 620
            },
            {
              "x": 996,
              "y": 686
            },
            {
              "x": 992,
              "y": 686
            },
            {
              "x": 993,
              "y": 719
            },
            {
              "x": 1009,
              "y": 752
            },
            {
              "x": 1127,
              "y": 750
            },
            {
              "x": 1127,
              "y": 721
            },
            {
              "x": 1120,
              "y": 716
            },
            {
              "x": 1119,
              "y": 619
            }
          ],
          "collisionType": "overhead",
          "isOverhead": true
        },
        {
          "type": "obstacle",
          "zIndex": 53,
          "x": 328,
          "y": 616,
          "rotation": 0,
          "w": 811,
          "h": 8,
          "label": "COLISÃO POLIGONAL",
          "id": "poly_obs_mvucfzph_fc6",
          "polygon": [
            {
              "x": 430,
              "y": 619
            },
            {
              "x": 1139,
              "y": 616
            },
            {
              "x": 1139,
              "y": 622
            },
            {
              "x": 328,
              "y": 624
            },
            {
              "x": 329,
              "y": 616
            }
          ],
          "collisionType": "solid"
        },
        {
          "type": "obstacle",
          "zIndex": 54,
          "x": 64,
          "y": 480,
          "rotation": 0,
          "w": 80,
          "h": 160,
          "label": "TRIGGER",
          "id": "trigger_sglp",
          "collisionType": "trigger",
          "isTrigger": true,
          "ai_instruction": "tirar a função de ir para próxima fase e voltar na fase anterior, e use as duas portas uma para ir e outra para voltar, só que na porta de voltar aparece \"tem certeza que deseja reiniciar?\" na de ir vai direto"
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
  "obstacles": [],
  "collisionBounds": []
},

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
