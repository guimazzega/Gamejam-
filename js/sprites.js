/**
 * js/sprites.js
 * Gerenciador e Animador de Sprites dos 2 Personagens:
 * - Personagem 01: Cientista / Batedora loira (jaleco branco, camiseta vermelha)
 * - Personagem 02: Cientista / Suporte de cabelos cacheados escuros (jaleco branco, camiseta verde)
 *
 * Suporta animações em 8 direções, ataque (soco), coleta de itens (agachando),
 * postura idle especial de espera e renderização pixel-perfect com escala balanceada.
 */

(function () {
  'use strict';

  // Configuração das animações e pastas para cada personagem
  const SPRITES_DATA = {
    1: {
      id: 1,
      name: 'Personagem 01',
      baseDir: 'assets/sprites/personagem01/',
      footPixelY: 108,
      anchorX: 48,
      nativeWidth: 96,
      nativeHeight: 112,
      animations: {
        walk_down: {
          folder: '01_baixo_frente/',
          prefix: 'baixo_',
          count: 8,
          fps: 10,
          loop: true
        },
        walk_up: {
          folder: '02_cima_costas/',
          prefix: 'cima_',
          count: 8,
          fps: 10,
          loop: true
        },
        walk_left: {
          folder: '03_esquerda/',
          prefix: 'esquerda_',
          count: 8,
          fps: 10,
          loop: true
        },
        walk_right: {
          folder: '04_direita/',
          prefix: 'direita_',
          count: 4,
          fps: 8,
          loop: true
        },
        walk_down_right: {
          folder: '05_diagonal_baixo_direita/',
          prefix: 'diag_baixo_direita_',
          count: 4,
          fps: 9,
          loop: true
        },
        walk_up_right: {
          folder: '09_extras_costas_direita/',
          prefix: 'extra_',
          count: 4,
          fps: 9,
          loop: true
        },
        attack: {
          folder: '08_soco/',
          prefix: 'soco_',
          count: 4,
          fps: 12,
          loop: false
        },
        pickup: {
          folder: '06_pegando_item_chao/',
          prefix: 'pegando_item_',
          count: 4,
          fps: 10,
          loop: false
        },
        idle_special: {
          folder: '07_postura_combate/',
          prefix: 'combate_',
          count: 4,
          fps: 4.5,
          loop: true
        }
      }
    },
    2: {
      id: 2,
      name: 'Personagem 02',
      baseDir: 'assets/sprites/personagem02/',
      footPixelY: 110,
      anchorX: 40.5,
      nativeWidth: 81,
      nativeHeight: 115,
      animations: {
        walk_down: {
          folder: 'bottom/',
          prefix: 'bottom_',
          count: 8,
          fps: 10,
          loop: true
        },
        walk_up: {
          folder: 'top/',
          prefix: 'top_',
          count: 10,
          fps: 10,
          loop: true
        },
        walk_left: {
          folder: 'left/',
          prefix: 'left_',
          count: 8,
          fps: 10,
          loop: true
        },
        walk_right: {
          folder: 'right/',
          prefix: 'right_',
          count: 6,
          fps: 9,
          loop: true
        },
        walk_down_right: {
          folder: 'bottom-right/',
          prefix: 'bottom-right_',
          count: 4,
          fps: 9,
          loop: true
        },
        attack: {
          folder: 'ataque_soco/',
          prefix: 'ataque_soco_',
          count: 4,
          fps: 12,
          loop: false
        },
        pickup: {
          folder: 'pegando_item_chao/',
          prefix: 'pegando_item_chao_',
          count: 4,
          fps: 10,
          loop: false
        },
        idle_special: {
          folder: 'idle_maos_levantadas/',
          prefix: 'idle_maos_levantadas_',
          count: 4,
          fps: 4.5,
          loop: true
        }
      }
    }
  };

  /**
   * Classe individual que gerencia e desenha os sprites de um Jogador
   */
  class CharacterSpriteAnimator {
    constructor(playerId, config, preloadedImages) {
      this.playerId = playerId;
      this.config = config;
      this.images = preloadedImages; // Map de "animKey_frameIndex" -> Image

      this.currentAnimKey = 'walk_down';
      this.currentFrame = 0;
      this.flipH = false;
      this.animTime = 0;
      this.lastDirection = 'down';

      this.scale = window.GameConfig.PLAYER_SPRITE_SCALE || 0.82;
    }

    /**
     * Determina a direção cardinal / diagonal com base no vetor de visão
     */
    static getDirection(fx, fy) {
      const diagThreshold = 0.38;

      if (fy > diagThreshold && fx > diagThreshold) return 'down_right';
      if (fy > diagThreshold && fx < -diagThreshold) return 'down_left';
      if (fy < -diagThreshold && fx > diagThreshold) return 'up_right';
      if (fy < -diagThreshold && fx < -diagThreshold) return 'up_left';

      if (Math.abs(fx) > Math.abs(fy)) {
        return fx > 0 ? 'right' : 'left';
      } else {
        return fy > 0 ? 'down' : 'up';
      }
    }

    /**
     * Atualiza o estado da animação conforme o movimento, ataque, coleta ou espera do personagem
     */
    update(dt, player) {
      const isMoving = player.vx !== 0 || player.vy !== 0;

      // Atualiza direção atual caso esteja se movendo
      if (isMoving) {
        this.lastDirection = CharacterSpriteAnimator.getDirection(player.facingX, player.facingY);
      }

      let animKey = 'walk_down';
      let flip = false;
      let frameIndex = 0;

      // 1. Prioridade Máxima: Animação de Ataque (Soco)
      if (player.attackTimer > 0) {
        animKey = 'attack';
        const progress = Math.max(0, Math.min(1, 1 - player.attackTimer / player.attackDuration));
        frameIndex = Math.min(3, Math.floor(progress * 4));
        flip = player.facingX < 0; // Soco virado para a esquerda se estiver olhando para a esquerda
      }
      // 2. Animação de Coleta de Itens (Agachamento no chão)
      else if (player.pickupTimer > 0) {
        animKey = 'pickup';
        const progress = Math.max(0, Math.min(1, 1 - player.pickupTimer / 0.35));
        frameIndex = Math.min(3, Math.floor(progress * 4));
        flip = player.facingX < 0;
      }
      // 3. Animação de Caminhada (8 direções)
      else if (isMoving) {
        this.animTime += dt;
        const dir = this.lastDirection;

        switch (dir) {
          case 'up':
            animKey = 'walk_up';
            break;
          case 'down':
            animKey = 'walk_down';
            break;
          case 'left':
            animKey = 'walk_left';
            break;
          case 'right':
            animKey = 'walk_right';
            break;
          case 'down_right':
            animKey = 'walk_down_right';
            break;
          case 'down_left':
            animKey = 'walk_down_right';
            flip = true; // Inverte diagonal direita para esquerda
            break;
          case 'up_right':
            if (this.playerId === 1) {
              animKey = 'walk_up_right';
            } else {
              animKey = 'walk_up';
            }
            break;
          case 'up_left':
            if (this.playerId === 1) {
              animKey = 'walk_up_right';
              flip = true;
            } else {
              animKey = 'walk_up';
            }
            break;
          default:
            animKey = 'walk_down';
        }

        const animDef = this.config.animations[animKey];
        if (animDef) {
          frameIndex = Math.floor(this.animTime * animDef.fps) % animDef.count;
        }
      }
      // 4. Animação de Espera (Idle)
      else {
        // Se ficou parado por mais de 2.2 segundos, ativa a postura idle especial
        if (player.idleTimer >= 2.2) {
          animKey = 'idle_special';
          const animDef = this.config.animations.idle_special;
          if (animDef) {
            frameIndex = Math.floor((player.idleTimer - 2.2) * animDef.fps) % animDef.count;
          }
        } else {
          // Idle estático na direção que estava olhando (Frame 0 da direção)
          const dir = this.lastDirection;
          switch (dir) {
            case 'up':
              animKey = 'walk_up';
              break;
            case 'left':
              animKey = 'walk_left';
              break;
            case 'right':
              animKey = 'walk_right';
              break;
            case 'down_right':
              animKey = 'walk_down_right';
              break;
            case 'down_left':
              animKey = 'walk_down_right';
              flip = true;
              break;
            case 'up_right':
              animKey = this.playerId === 1 ? 'walk_up_right' : 'walk_up';
              break;
            case 'up_left':
              animKey = this.playerId === 1 ? 'walk_up_right' : 'walk_up';
              flip = this.playerId === 1;
              break;
            default:
              animKey = 'walk_down';
          }
          frameIndex = 0;
        }
      }

      this.currentAnimKey = animKey;
      this.currentFrame = frameIndex;
      this.flipH = flip;
    }

    /**
     * Obtém o objeto Image atual da animação
     */
    getCurrentImage() {
      const key = `${this.currentAnimKey}_${this.currentFrame}`;
      return this.images[key] || null;
    }

    /**
     * Renderiza o sprite no Canvas com alinhamento nos pés, escala pixel-art e efeitos visuais
     */
    draw(ctx, player) {
      const img = this.getCurrentImage();
      if (!img || !img.complete || img.naturalWidth === 0) {
        // Fallback caso a imagem ainda esteja carregando
        return false;
      }

      const scale = this.scale;
      const targetW = img.naturalWidth * scale;
      const targetH = img.naturalHeight * scale;

      // Posição no chão onde os pés do personagem devem tocar:
      // O centro da hitbox 40x40 fica em (player.x, player.y), os pés ficam em (player.y + 16)
      const feetY = player.y + 16;
      const footOffsetInImage = (this.config.footPixelY || 108) * scale;
      const topY = feetY - footOffsetInImage;
      const centerX = player.x;

      ctx.save();
      ctx.imageSmoothingEnabled = false; // Preserva o visual de pixel art com máxima nitidez

      // Efeito de Flash ao tomar dano (Hit Flash)
      if (player.hitFlashTimer > 0) {
        ctx.filter = 'brightness(1.5) drop-shadow(0 0 8px rgba(239, 68, 68, 0.9))';
      }

      ctx.translate(centerX, topY);

      if (this.flipH) {
        ctx.scale(-1, 1);
        ctx.drawImage(img, -targetW / 2, 0, targetW, targetH);
      } else {
        ctx.drawImage(img, -targetW / 2, 0, targetW, targetH);
      }

      ctx.restore();
      return true;
    }
  }

  /**
   * Gerenciador Global de Sprites: Faz o pré-carregamento de todas as imagens
   */
  const PlayerSpriteManager = {
    configs: SPRITES_DATA,
    loadedImages: {
      1: {},
      2: {}
    },
    totalImages: 0,
    loadedCount: 0,
    isReady: false,

    init() {
      console.log('🎨 [SPRITES] Inicializando carregamento dos sprites dos Personagens 1 e 2...');

      for (const [pIdStr, conf] of Object.entries(this.configs)) {
        const pId = Number(pIdStr);

        for (const [animKey, animDef] of Object.entries(conf.animations)) {
          for (let f = 0; f < animDef.count; f++) {
            this.totalImages++;
            const frameNumStr = String(f + 1).padStart(2, '0');
            const fileName = `${animDef.prefix}${frameNumStr}.png`;
            const fullPath = `${conf.baseDir}${animDef.folder}${fileName}`;

            const img = new Image();
            img.src = fullPath;
            img.onload = () => {
              this.loadedCount++;
              if (this.loadedCount >= this.totalImages) {
                this.isReady = true;
                console.log(`✨ [SPRITES] Todos os ${this.totalImages} sprites carregados com sucesso!`);
              }
            };
            img.onerror = () => {
              console.warn(`⚠️ [SPRITES] Falha ao carregar frame: ${fullPath}`);
            };

            this.loadedImages[pId][`${animKey}_${f}`] = img;
          }
        }
      }
    },

    createAnimator(playerId) {
      const conf = this.configs[playerId];
      if (!conf) {
        console.error(`Config de sprite não encontrada para jogador ${playerId}`);
        return null;
      }
      return new CharacterSpriteAnimator(playerId, conf, this.loadedImages[playerId]);
    }
  };

  // Inicia o pré-carregamento imediato das imagens
  PlayerSpriteManager.init();

  // Exporta globalmente
  window.CharacterSpriteAnimator = CharacterSpriteAnimator;
  window.PlayerSpriteManager = PlayerSpriteManager;
})();
