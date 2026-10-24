
/**
 * js/entities.js
 * Entidades do Jogo (Sprints 2, 3 e 4):
 * - FloatingText: Textos flutuantes de feedback visual e debug
 * - TrashItem: Entidades coletáveis de "Lixo / Sucata" com coordenadas fixas nos 3 mapas grandes
 * - Player: Personagem 1 e Personagem 2 com colisão AABB, sistema de Dano (takeDamage),
 *   Cone/Caixa visual de Ataque, suporte a Sprites customizados e Trava de Câmera/Viewport no Multiplayer
 */

window.FloatingText = class FloatingText {
  constructor(x, y, text, color = '#ff4d4d', life = 1.0) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.alpha = 1;
    this.vy = -44;
    this.life = life;
    this.maxLife = life;
  }

  update(dt) {
    this.y += this.vy * dt;
    this.life -= dt;
    this.alpha = Math.max(0, Math.min(1, this.life / this.maxLife));
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.font = 'bold 13px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillText(this.text, this.x + 1.5, this.y + 1.5);
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
};

/**
 * Entidade de Coleta: Lixo / Sucata posicionado em coordenadas fixas pelos Mapas Grandes
 */
window.TrashItem = class TrashItem {
  constructor(config) {
    this.id = config.id;
    this.x = config.x;
    this.y = config.y;
    this.size = config.size || window.GameConfig.TRASH_SIZE || 26;
    this.typeInfo = config.typeInfo || window.GameConfig.TRASH_TYPES[0];
    this.sprite = config.sprite || null;
    this.rotation = config.rotation || 0;
    this.bobPhase = config.bobPhase || 0;
    this.isCustomPlaced = Boolean(config.isCustomPlaced);
  }

  getBoundingBox() {
    const half = this.size / 2;
    return {
      x: this.x - half,
      y: this.y - half,
      w: this.size,
      h: this.size
    };
  }

  draw(ctx, timeSeconds) {
    const half = this.size / 2;
    const pulse = Math.sin(timeSeconds * 3.5 + this.bobPhase) * 2;
    const hideDebug = Boolean(window.hideDebugOverlays);

    ctx.save();

    // 1. Sombra no chão
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + half - 2, half * 0.8, half * 0.45, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
    ctx.fill();

    // 2. Hitbox Debug pontilhada do Lixo
    if (!hideDebug) {
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.strokeRect(this.x - half, this.y - half, this.size, this.size);
      ctx.setLineDash([]);
    }

    // 3. Sprite Customizado (se definido no item ou no tipo de lixo) ou Forma Geométrica de Debug
    const spriteSrc = this.sprite || (this.typeInfo && this.typeInfo.sprite);
    const spriteImg = spriteSrc && window.SpriteCache ? window.SpriteCache.get(spriteSrc) : null;

    ctx.save();
    ctx.translate(this.x, this.y + pulse * 0.5);
    ctx.rotate(this.rotation);

    if (spriteImg) {
      ctx.drawImage(spriteImg, -half, -half, this.size, this.size);
    } else {
      ctx.fillStyle = this.typeInfo.color;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;

      const shape = this.typeInfo.shape;
      if (shape === 'gear') {
        // Sucata Metálica (Octógono/Engrenagem simples)
        ctx.beginPath();
        ctx.arc(0, 0, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (shape === 'can') {
        // Lata Amassada
        ctx.beginPath();
        ctx.roundRect(-8, -6, 16, 12, 3);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = this.typeInfo.stroke;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-4, -5);
        ctx.lineTo(-4, 5);
        ctx.moveTo(4, -5);
        ctx.lineTo(4, 5);
        ctx.stroke();
      } else if (shape === 'bottle') {
        // Garrafa / Plástico
        ctx.beginPath();
        ctx.roundRect(-7, -5, 11, 10, 3);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(4, -3, 4, 6);
      } else if (shape === 'battery') {
        // Bateria Descartada
        ctx.beginPath();
        ctx.roundRect(-7, -8, 14, 16, 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(-3, -10, 6, 2);
      } else {
        // Placa / Eletrônico Quebrado
        ctx.beginPath();
        ctx.moveTo(0, -9);
        ctx.lineTo(9, 0);
        ctx.lineTo(0, 9);
        ctx.lineTo(-9, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }
    ctx.restore();

    // 4. Tag visual discreta identificando como "LIXO"
    if (!hideDebug) {
      ctx.font = 'bold 9px Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
      ctx.fillRect(this.x - 16, this.y - half - 12, 32, 11);
      ctx.fillStyle = this.typeInfo.stroke || '#fef08a';
      ctx.fillText('LIXO', this.x, this.y - half - 3.5);
    }

    ctx.restore();
  }
};

window.Player = class Player {
  constructor(config) {
    this.id = config.id; // 1 ou 2
    this.name = config.name; // 'Jogador 1' ou 'Jogador 2'
    this.role = config.role || 'Operador';
    this.primaryColor = config.primaryColor || '#38bdf8';
    this.secondaryColor = config.secondaryColor || '#0284c7';
    this.sprite = config.sprite || null;
    this.onZeroHp = config.onZeroHp || null;

    this.x = config.x || 200;
    this.y = config.y || 200;
    this.size = window.GameConfig.PLAYER_SIZE; // 40x40px
    this.speed = window.GameConfig.PLAYER_SPEED;

    this.maxHp = window.GameConfig.PLAYER_MAX_HP;
    this.hp = this.maxHp;
    this.bonusDamage = 0;

    this.inventory = config.inventory || [];
    this.selectedSlot = 0;

    // Direção do olhar e velocidade atual (para debug, ataque e animação)
    this.facingX = 1;
    this.facingY = 0;
    this.vx = 0;
    this.vy = 0;
    this.walkCycle = 0;
    this.hitFlashTimer = 0;
    this.clampedByViewport = false;

<<<<<<< Updated upstream
    // Estado de Ataque / Combate (Sprint 3 & 4)
=======
    // Gerenciador e Animador de Sprites Pixel Art
    this.spriteAnimator = window.PlayerSpriteManager
      ? window.PlayerSpriteManager.createAnimator(this.id)
      : null;
    this.pickupTimer = 0;
    this.idleTimer = 0;
    this.lastDirection = 'down';

    // Estado de Ataque / Bater (Placeholder Sprint 3)
>>>>>>> Stashed changes
    this.attackTimer = 0;
    this.attackCooldown = 0;
    this.attackDuration = window.GameConfig.PLAYER_ATTACK_DURATION || 0.24;
    this.attackArcAngle = window.GameConfig.ATTACK_ARC_ANGLE || Math.PI * 0.55;
    this.attackSourceLabel = '';
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.clampedByViewport = false;
    this.attackTimer = 0;
    this.pickupTimer = 0;
    this.idleTimer = 0;
  }

  /**
   * Aplica dano ao personagem e aciona callback de morte caso o HP chegue a 0 (Sprint 4)
   */
  takeDamage(amount) {
    const validAmount = Math.max(0, Number(amount) || 0);
    this.hp = Math.max(0, this.hp - validAmount);
    this.hitFlashTimer = 0.25;
    console.log(`[Damage] ${this.name} recebeu -${validAmount} HP → Vida atual: ${this.hp}/${this.maxHp} HP`);

    if (this.hp <= 0 && typeof this.onZeroHp === 'function') {
      this.onZeroHp(this);
    }

    return this.hp;
  }

  heal(amount) {
    const validAmount = Math.max(0, Number(amount) || 0);
    this.hp = Math.min(this.maxHp, this.hp + validAmount);
    return this.hp;
  }

  getAttackDamage() {
    const base = window.GameConfig.PLAYER_ATTACK_DAMAGE || 20;
    return base + (this.bonusDamage || 0);
  }

  /**
   * Calcula a hitbox AABB do ataque projetada à frente da direção em que o personagem olha
   */
  getAttackHitbox() {
    const range = window.GameConfig.PLAYER_ATTACK_RANGE || 48;
    const hitSize = window.GameConfig.PLAYER_ATTACK_SIZE || 48;
    const half = hitSize / 2;

    const len = Math.hypot(this.facingX, this.facingY) || 1;
    const nx = this.facingX / len;
    const ny = this.facingY / len;

    const centerX = this.x + nx * range;
    const centerY = this.y + ny * range;

    return {
      x: centerX - half,
      y: centerY - half,
      w: hitSize,
      h: hitSize,
      centerX,
      centerY,
      angleRad: Math.atan2(ny, nx),
      angleDeg: Math.round((Math.atan2(ny, nx) * 180) / Math.PI)
    };
  }

  /**
   * Executa um ataque se o cooldown permitir.
   * Aceita aimVector opcional (ex: vetor em direção ao cursor do mouse no Singleplayer) e sourceLabel para telemetria.
   */
  triggerAttack(aimVector = null, sourceLabel = 'Input') {
    if (this.attackCooldown > 0) return null;

    if (aimVector && typeof aimVector === 'object' && (aimVector.dx !== 0 || aimVector.dy !== 0)) {
      const len = Math.hypot(aimVector.dx, aimVector.dy) || 1;
      this.facingX = aimVector.dx / len;
      this.facingY = aimVector.dy / len;
    }

    this.attackDuration = window.GameConfig.PLAYER_ATTACK_DURATION || 0.24;
    this.attackTimer = this.attackDuration;
    this.attackCooldown = window.GameConfig.PLAYER_ATTACK_COOLDOWN || 0.26;
    this.attackSourceLabel = sourceLabel || 'Input';

    return this.getAttackHitbox();
  }

  getEquippedItem() {
    return this.inventory[this.selectedSlot] || null;
  }

<<<<<<< Updated upstream
=======
  /**
   * Aciona a animação de agachamento/coleta de itens do chão
   */
  triggerPickup(duration = 0.35) {
    this.pickupTimer = duration;
    this.idleTimer = 0;
  }

  /**
   * Aciona o ataque temporário (Arco/Cone de colisão na frente do personagem + log no console)
   */
  triggerAttack(sourceLabel = 'Input', gameMode = 'singleplayer') {
    if (this.attackCooldown > 0) return false;

    this.attackDuration = window.GameConfig.ATTACK_DURATION || 0.28;
    this.attackRange = window.GameConfig.ATTACK_RANGE || 76;
    this.attackArcAngle = window.GameConfig.ATTACK_ARC_ANGLE || Math.PI * 0.52;

    this.attackTimer = this.attackDuration;
    this.attackCooldown = window.GameConfig.ATTACK_COOLDOWN || 0.16;
    this.attackAngle = Math.atan2(this.facingY, this.facingX);
    this.attackSourceLabel = sourceLabel;

    const item = this.getEquippedItem();
    const itemName = item ? item.shortName : 'Desarmado';
    const deg = Math.round((this.attackAngle * 180) / Math.PI);

    console.log(
      `⚔️ [ATAQUE / COMBATE] ${this.name} (P${this.id}) executou ATACAR/BATER! | Modo: ${gameMode} | Input: ${sourceLabel} | Item: ${itemName} | Pos: (${Math.round(this.x)}, ${Math.round(this.y)}) | Direção: ${deg}°`
    );

    return true;
  }

  /**
   * Verifica se um ponto (px, py) com raio opcional está dentro do cone de ataque atual
   */
  isPointInAttackCone(px, py, targetRadius = 18) {
    if (this.attackTimer <= 0) return false;
    const dx = px - this.x;
    const dy = py - this.y;
    const dist = Math.hypot(dx, dy);
    if (dist > this.attackRange + targetRadius) return false;

    const angleToTarget = Math.atan2(dy, dx);
    let diff = angleToTarget - this.attackAngle;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;

    return Math.abs(diff) <= this.attackArcAngle / 2 + 0.12;
  }

>>>>>>> Stashed changes
  getBoundingBox(cx = this.x, cy = this.y) {
    const half = this.size / 2;
    return {
      x: cx - half,
      y: cy - half,
      w: this.size,
      h: this.size
    };
  }

  /**
   * Atualiza movimentação em 8 direções com resolução de colisão AABB separada por eixo
   */
  update(dt, inputVector, map, viewportClamp = null) {
    if (this.hitFlashTimer > 0) {
      this.hitFlashTimer = Math.max(0, this.hitFlashTimer - dt);
    }
    if (this.attackTimer > 0) {
      this.attackTimer = Math.max(0, this.attackTimer - dt);
    }
    if (this.attackCooldown > 0) {
      this.attackCooldown = Math.max(0, this.attackCooldown - dt);
    }
    if (this.pickupTimer > 0) {
      this.pickupTimer = Math.max(0, this.pickupTimer - dt);
    }

    this.clampedByViewport = false;

    const { dx, dy } = inputVector;
    this.vx = dx * this.speed;
    this.vy = dy * this.speed;

    // Atualiza direção do olhar pela caminhada quando não estiver no meio do frame de ataque direcionado
    if (dx !== 0 || dy !== 0) {
<<<<<<< Updated upstream
      if (this.attackTimer <= 0) {
        this.facingX = dx;
        this.facingY = dy;
=======
      const len = Math.hypot(dx, dy) || 1;
      this.facingX = dx / len;
      this.facingY = dy / len;
      this.walkCycle += dt * 12;
      this.idleTimer = 0;
      // Atualiza o ângulo do cone se estiver atacando enquanto caminha
      if (this.attackTimer > 0) {
        this.attackAngle = Math.atan2(this.facingY, this.facingX);
>>>>>>> Stashed changes
      }
      this.walkCycle += dt * 12;
    } else {
      this.walkCycle = 0;
      if (this.attackTimer <= 0 && this.pickupTimer <= 0) {
        this.idleTimer += dt;
      } else {
        this.idleTimer = 0;
      }
    }

    // Inicializa o animador caso ainda não esteja instanciado
    if (!this.spriteAnimator && window.PlayerSpriteManager) {
      this.spriteAnimator = window.PlayerSpriteManager.createAnimator(this.id);
    }
    if (this.spriteAnimator) {
      this.spriteAnimator.update(dt, this);
    }

    const half = this.size / 2;

    // 1. Movimento e Colisão no Eixo X
    if (dx !== 0) {
      let nextX = this.x + this.vx * dt;
      nextX = Math.max(half, Math.min(map.width - half, nextX));

      if (viewportClamp) {
        if (dx < 0 && nextX < viewportClamp.minX) {
          nextX = Math.max(this.x, viewportClamp.minX);
          this.clampedByViewport = true;
        } else if (dx > 0 && nextX > viewportClamp.maxX) {
          nextX = Math.min(this.x, viewportClamp.maxX);
          this.clampedByViewport = true;
        }
      }

      const boxX = this.getBoundingBox(nextX, this.y);
      for (const obs of map.obstacles) {
        if (obs.noCollision) continue;
        if (this._aabbOverlap(boxX, obs)) {
          if (dx > 0) {
            nextX = obs.x - half;
          } else {
            nextX = obs.x + obs.w + half;
          }
        }
      }
      this.x = nextX;
    }

    // 2. Movimento e Colisão no Eixo Y
    if (dy !== 0) {
      let nextY = this.y + this.vy * dt;
      nextY = Math.max(half, Math.min(map.height - half, nextY));

      if (viewportClamp) {
        if (dy < 0 && nextY < viewportClamp.minY) {
          nextY = Math.max(this.y, viewportClamp.minY);
          this.clampedByViewport = true;
        } else if (dy > 0 && nextY > viewportClamp.maxY) {
          nextY = Math.min(this.y, viewportClamp.maxY);
          this.clampedByViewport = true;
        }
      }

      const boxY = this.getBoundingBox(this.x, nextY);
      for (const obs of map.obstacles) {
        if (obs.noCollision) continue;
        if (this._aabbOverlap(boxY, obs)) {
          if (dy > 0) {
            nextY = obs.y - half;
          } else {
            nextY = obs.y + obs.h + half;
          }
        }
      }
      this.y = nextY;
    }
  }

  _aabbOverlap(a, b) {
    return (
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y
    );
  }

  isTouchingZone(zone) {
    if (!zone) return false;
    return this._aabbOverlap(this.getBoundingBox(), zone);
  }

  /**
<<<<<<< Updated upstream
   * Renderiza o personagem no Canvas com estética Top-Down limpa + Cone/Caixa de Ataque + indicadores de Debug
=======
   * Renderiza o Arco / Cone de Colisão Temporário de Ataque na frente do personagem (Sprint 3)
   */
  _drawAttackCone(ctx) {
    if (this.attackTimer <= 0) return;

    const progress = 1 - this.attackTimer / this.attackDuration;
    const alpha = Math.max(0.15, 1 - progress * 0.75);
    const radius = this.attackRange * (0.88 + 0.12 * Math.sin(progress * Math.PI));
    const halfArc = this.attackArcAngle / 2;
    const startAngle = this.attackAngle - halfArc;
    const endAngle = this.attackAngle + halfArc;

    const fillColor = this.id === 1
      ? `rgba(56, 189, 248, ${(0.38 * alpha).toFixed(2)})`
      : `rgba(251, 146, 60, ${(0.42 * alpha).toFixed(2)})`;
    const strokeColor = this.id === 1 ? '#facc15' : '#f87171';

    ctx.save();

    // 1. Preenchimento do Cone de Colisão
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.arc(this.x, this.y, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();

    // 2. Borda Externa Brilhante do Cone
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();

    // 3. Arco interno tracejado de Debug Hitbox
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius * 0.62, startAngle, endAngle);
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. Linha de varredura animada (slash effect dentro do cone)
    const sweepAngle = startAngle + (endAngle - startAngle) * progress;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(
      this.x + Math.cos(sweepAngle) * radius,
      this.y + Math.sin(sweepAngle) * radius
    );
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // 5. Label de Debug na ponta do cone
    const tipX = this.x + Math.cos(this.attackAngle) * (radius + 14);
    const tipY = this.y + Math.sin(this.attackAngle) * (radius + 14);
    ctx.font = 'bold 10px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fef08a';
    ctx.fillText(`⚔️ ATK P${this.id}`, tipX, tipY);

    ctx.restore();
  }

  /**
   * Renderiza o personagem no Canvas com Sprite Pixel Art Animado em 8 direções + indicadores
>>>>>>> Stashed changes
   */
  draw(ctx, isControlled, gameMode, timeSeconds) {
    const half = this.size / 2;
    const isMoving = this.vx !== 0 || this.vy !== 0;
<<<<<<< Updated upstream
    const bobOffset = isMoving ? Math.sin(this.walkCycle) * 2.5 : 0;
    const hideDebug = Boolean(window.hideDebugOverlays);
=======
>>>>>>> Stashed changes

    ctx.save();

    // 0. Cone e Caixa de Colisão Visual de Ataque na frente do personagem (Sprint 3 & 4)
    if (this.attackTimer > 0) {
      this._drawAttackVisual(ctx);
    }

    // 1. Aura / Brilho no chão para o personagem atualmente controlado
    if (isControlled) {
      const pulse = 1 + Math.sin(timeSeconds * 6) * 0.08;
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(this.x, this.y + 16, (half + 10) * pulse, (half * 0.52) * pulse, 0, 0, Math.PI * 2);
      ctx.fillStyle = gameMode === 'singleplayer'
        ? 'rgba(255, 202, 58, 0.25)'
        : 'rgba(56, 189, 248, 0.20)';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = gameMode === 'singleplayer' ? '#ffca3a' : this.primaryColor;
      ctx.stroke();
      ctx.restore();
    }

    // 2. Sombra de projeção suave no chão (sob os pés do personagem)
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + 16, 20, 8, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
    ctx.fill();

<<<<<<< Updated upstream
    // 3. Caixa de Colisão (Hitbox Debug) no chão
    if (!hideDebug) {
=======
    // 3. Caixa de Colisão (Hitbox Debug 40x40) - Visível quando modo de colisão/debug está ativo ou travado na câmera
    const showHitbox = (window.gameInstance && window.gameInstance.showColliders) || this.clampedByViewport;
    if (showHitbox) {
>>>>>>> Stashed changes
      ctx.strokeStyle = this.clampedByViewport
        ? '#ef4444'
        : isControlled
          ? 'rgba(255, 202, 58, 0.85)'
          : 'rgba(148, 163, 184, 0.45)';
      ctx.lineWidth = this.clampedByViewport ? 2.2 : 1.5;
      ctx.setLineDash([4, 3]);
      ctx.strokeRect(this.x - half, this.y - half, this.size, this.size);
      ctx.setLineDash([]);
<<<<<<< Updated upstream
    }

    // 4. Corpo do Personagem: Sprite Customizado (se definido) ou Procedural Top-Down
    const drawY = this.y + bobOffset;
    const spriteKey = `p${this.id}`;
    const spriteSrc =
      this.sprite ||
      (window.GameConfig && window.GameConfig.PLAYER_SPRITES && window.GameConfig.PLAYER_SPRITES[spriteKey]);
    const spriteImg = spriteSrc && window.SpriteCache ? window.SpriteCache.get(spriteSrc) : null;

    if (spriteImg) {
      ctx.save();
      ctx.translate(this.x, drawY);
      if (this.facingX < -0.05) {
        ctx.scale(-1, 1);
      }
      ctx.drawImage(spriteImg, -half - 4, -half - 4, this.size + 8, this.size + 8);
      if (this.hitFlashTimer > 0) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.45)';
        ctx.fillRect(-half, -half, this.size, this.size);
      }
      ctx.restore();
    } else {
      // Mochila tática nas costas (oposta à direção do olhar)
      const bagX = this.x - this.facingX * 10;
      const bagY = drawY - this.facingY * 10;
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(bagX - 11, bagY - 11, 22, 22, 5);
      ctx.fill();
      ctx.stroke();

      // Tronco / Corpo Principal
      ctx.fillStyle = this.hitFlashTimer > 0 ? '#ef4444' : this.secondaryColor;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(this.x - 15, drawY - 15, 30, 30, 8);
      ctx.fill();
      ctx.stroke();

      // Cabeça / Capacete Top-Down
      ctx.fillStyle = this.hitFlashTimer > 0 ? '#fca5a5' : this.primaryColor;
      ctx.beginPath();
      ctx.arc(this.x, drawY - 2, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Visor indicando a direção em que o personagem está olhando
      const visorX = this.x + this.facingX * 6;
      const visorY = (drawY - 2) + this.facingY * 6;
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(visorX, visorY, 4.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 5. Visual do Item Equipado na Mão (se não estiver vazio)
    const item = this.getEquippedItem();
    if (item && !item.isEmpty) {
      const handX = this.x + this.facingX * 18 - this.facingY * 8;
      const handY = drawY + this.facingY * 18 + this.facingX * 8;
      const itemImg = item.sprite && window.SpriteCache ? window.SpriteCache.get(item.sprite) : null;
      if (itemImg) {
        ctx.drawImage(itemImg, handX - 8, handY - 8, 16, 16);
      } else {
        ctx.fillStyle = item.color || '#facc15';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(handX - 5, handY - 5, 10, 10, 2);
        ctx.fill();
        ctx.stroke();
      }
    }

    // 6. Vetor de Velocidade (Linha de Debug ao caminhar)
    if (!hideDebug && isMoving) {
=======
    }

    // 4. Renderização do Sprite Pixel Art Animado
    let spriteRendered = false;
    if (!this.spriteAnimator && window.PlayerSpriteManager) {
      this.spriteAnimator = window.PlayerSpriteManager.createAnimator(this.id);
    }
    if (this.spriteAnimator) {
      spriteRendered = this.spriteAnimator.draw(ctx, this);
    }

    // Fallback geométrico elegante caso o sprite ainda esteja sendo baixado
    if (!spriteRendered) {
      this._drawFallbackGeometry(ctx);
    }

    // 5. Linha de Vetor de Velocidade (Linha de Debug ao caminhar com colisores ativados)
    if (isMoving && window.gameInstance && window.gameInstance.showColliders) {
>>>>>>> Stashed changes
      ctx.beginPath();
      ctx.moveTo(this.x, this.y + 12);
      ctx.lineTo(this.x + this.facingX * 36, this.y + 12 + this.facingY * 36);
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

<<<<<<< Updated upstream
    // 7. Tag do Personagem + Indicador Visual Sobre a Cabeça
    const labelY = drawY - 30;
    const C = (window.Config && window.Config.Controls) || {};
    const fmt = (k) => (window.Config && window.Config.formatKeyCode ? window.Config.formatKeyCode(k) : (k || ''));
=======
    // 6. Tag do Personagem + Indicador Visual Sobre a Cabeça (Seta Animada no Ativo)
    const labelY = this.y - 78;
    const cfg = window.GameConfig || window.Config || {};
    const controls = cfg.Controls || {};
    const fmt = (k) => (cfg.formatKeyCode ? cfg.formatKeyCode(k) : k || '---');
>>>>>>> Stashed changes

    if (gameMode === 'singleplayer' && isControlled) {
      const arrowBounce = Math.sin(timeSeconds * 8) * 3;
      const arrowY = labelY - 14 + arrowBounce;

      ctx.fillStyle = '#ffca3a';
      ctx.strokeStyle = '#3b2313';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.x, arrowY + 8);
      ctx.lineTo(this.x - 7, arrowY);
      ctx.lineTo(this.x + 7, arrowY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

<<<<<<< Updated upstream
      if (!hideDebug) {
        this._drawOverheadTag(ctx, this.x, labelY - 2, `P${this.id} • ATIVO`, '#ffca3a', '#1e1306');
      }
    } else if (!hideDebug && gameMode === 'singleplayer' && !isControlled) {
      this._drawOverheadTag(
        ctx,
        this.x,
        labelY,
        `P${this.id} [${fmt(C.switchCharacter)}]`,
        'rgba(30, 41, 59, 0.85)',
        '#cbd5e1'
      );
    } else if (!hideDebug) {
      // Multiplayer Local: ambos ativos
      const atkKey = this.id === 1 ? fmt(C.attackP1) : fmt(C.attackP2);
      const tagText = this.clampedByViewport
        ? `P${this.id} [LIMITE CÂMERA]`
        : `P${this.id} [ATK: ${atkKey}]`;
=======
      this._drawOverheadTag(ctx, this.x, labelY - 2, `P${this.id} • ATIVO`, '#ffca3a', '#1e1306');
    } else if (gameMode === 'singleplayer' && !isControlled) {
      this._drawOverheadTag(ctx, this.x, labelY, `P${this.id} [${fmt(controls.SwitchPlayer)}]`, 'rgba(30, 41, 59, 0.85)', '#cbd5e1');
    } else {
      const tagText = this.clampedByViewport
        ? `P${this.id} [LIMITE CÂMERA]`
        : this.id === 1
          ? `P1 [ATK: ${fmt(controls.P1_Attack)}]`
          : `P2 [ATK: ${fmt(controls.P2_Attack)}]`;
>>>>>>> Stashed changes
      const tagBg = this.clampedByViewport ? '#ef4444' : this.primaryColor;
      const tagFg = this.clampedByViewport ? '#ffffff' : '#0f172a';
      this._drawOverheadTag(ctx, this.x, labelY, tagText, tagBg, tagFg);
    }

<<<<<<< Updated upstream
    // 8. Coordenadas de Debug sob os pés
    if (!hideDebug) {
      ctx.font = '10px Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(226, 232, 240, 0.75)';
      ctx.fillText(`(${Math.round(this.x)}, ${Math.round(this.y)})`, this.x, this.y + half + 13);
    }

    ctx.restore();
  }

  /**
   * Desenha o cone de alcance e a caixa de colisão AABB do ataque na frente do personagem
   */
  _drawAttackVisual(ctx) {
    const hb = this.getAttackHitbox();
    const progress = Math.max(0, Math.min(1, this.attackTimer / (this.attackDuration || 0.24)));
    const radius = (window.GameConfig.PLAYER_ATTACK_RANGE || 48) + 22;
    const halfArc = (this.attackArcAngle || Math.PI * 0.55) / 2;

    ctx.save();

    // 1. Cone radial translúcido indicando direção do golpe/disparo
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.arc(this.x, this.y, radius, hb.angleRad - halfArc, hb.angleRad + halfArc);
    ctx.closePath();
    ctx.fillStyle = this.id === 1
      ? `rgba(56, 189, 248, ${0.28 * progress})`
      : `rgba(251, 146, 60, ${0.28 * progress})`;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.id === 1 ? '#38bdf8' : '#fb923c';
    ctx.stroke();

    // 2. Caixa de colisão AABB ativa (Hitbox de Dano / Fogo Amigo)
    ctx.fillStyle = `rgba(239, 68, 68, ${0.25 * progress})`;
    ctx.fillRect(hb.x, hb.y, hb.w, hb.h);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.strokeRect(hb.x, hb.y, hb.w, hb.h);
    ctx.setLineDash([]);

    // 3. Rótulo de debug da hitbox de ataque
    ctx.font = 'bold 10px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fef08a';
    ctx.fillText(`ATK P${this.id} (${hb.angleDeg}°)`, hb.centerX, hb.y - 5);
=======
    // 7. Coordenadas de Debug sob os pés (Apenas se colisores/debug estiver ativo)
    if (window.gameInstance && window.gameInstance.showColliders) {
      ctx.font = '10px Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(226, 232, 240, 0.75)';
      ctx.fillText(`(${Math.round(this.x)}, ${Math.round(this.y)})`, this.x, this.y + half + 14);
    }
>>>>>>> Stashed changes

    ctx.restore();
  }

  _drawFallbackGeometry(ctx) {
    const half = this.size / 2;
    ctx.fillStyle = this.hitFlashTimer > 0 ? '#ef4444' : this.secondaryColor;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(this.x - 15, this.y - 25, 30, 36, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = this.hitFlashTimer > 0 ? '#fca5a5' : this.primaryColor;
    ctx.beginPath();
    ctx.arc(this.x, this.y - 32, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  _drawOverheadTag(ctx, x, y, text, bgColor, textColor) {
    ctx.save();
    ctx.font = 'bold 11px Consolas, monospace';
    const paddingX = 6;
    const textWidth = ctx.measureText(text).width;
    const boxW = textWidth + paddingX * 2;
    const boxH = 18;

    ctx.fillStyle = bgColor;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x - boxW / 2, y - boxH, boxW, boxH, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y - boxH / 2 + 0.5);
    ctx.restore();
  }
};

