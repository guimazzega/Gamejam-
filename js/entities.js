/**
 * js/entities.js
 * Entidades Principais do Jogo:
 * - FloatingText: Textos flutuantes polidos de feedback visual
 * - TrashItem: Coletáveis de Lixo/Sucata redimensionados (maiores e de alta visibilidade)
 * - Player: Personagens P1 e P2 com resolução de colisão multi-passo (Sub-stepping + MTV Depenetration),
 *   sistema de armas melee (Bastão, Barra de Ferro, Katana) e detecção de ataque de alta precisão.
 */

window.FloatingText = class FloatingText {
  constructor(x, y, text, color = '#ff4d4d', life = 1.0) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.alpha = 1;
    this.vy = -48;
    this.life = life;
    this.maxLife = life;
  }

  update(dt) {
    this.y += this.vy * dt;
    this.vy *= 0.97;
    this.life -= dt;
    this.alpha = Math.max(0, Math.min(1, this.life / this.maxLife));
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.font = '700 14px "Segoe UI", system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.lineWidth = 3.5;
    ctx.strokeStyle = 'rgba(9, 13, 22, 0.92)';
    ctx.strokeText(this.text, this.x, this.y);

    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
};

/**
 * Entidade de Coleta: Lixo / Sucata (Maior, brilhante e de fácil identificação)
 */
window.TrashItem = class TrashItem {
  constructor(config) {
    this.id = config.id;
    this.x = config.x;
    this.y = config.y;
    this.size = window.GameConfig.TRASH_SIZE || 46;
    this.typeInfo = config.typeInfo || window.GameConfig.TRASH_TYPES[0];
    this.rotation = config.rotation || 0;
    this.bobPhase = config.bobPhase || 0;
  }

  getBoundingBox() {
    // Hitbox de coleta generosa para resposta imediata ao passar sobre o lixo
    const pickupSize = this.size + 8;
    const half = pickupSize / 2;
    return {
      x: this.x - half,
      y: this.y - half,
      w: pickupSize,
      h: pickupSize
    };
  }

  draw(ctx, timeSeconds) {
    const half = this.size / 2;
    const bob = Math.sin(timeSeconds * 3.8 + this.bobPhase) * 3.5;
    const pulse = 0.88 + 0.12 * Math.sin(timeSeconds * 4.5 + this.bobPhase);

    ctx.save();

    // 1. Halo luminoso pulsante no chão para fácil identificação
    const glowRadius = half * 1.15 * pulse;
    const grad = ctx.createRadialGradient(this.x, this.y + 4, 2, this.x, this.y + 4, glowRadius);
    grad.addColorStop(0, this.typeInfo.glow || 'rgba(250, 204, 21, 0.45)');
    grad.addColorStop(0.7, 'rgba(74, 222, 128, 0.18)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y + 4, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    // 2. Anel de destaque ecológico sutil
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + 8, half * 0.78 * pulse, half * 0.44 * pulse, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fill();
    ctx.strokeStyle = this.typeInfo.stroke || '#fef08a';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // 3. Arte vetorial ampliada do item de Lixo / Sucata
    ctx.save();
    ctx.translate(this.x, this.y + bob);
    ctx.rotate(this.rotation);
    ctx.scale(1.65, 1.65);

    ctx.fillStyle = this.typeInfo.color;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;

    const shape = this.typeInfo.shape;
    if (shape === 'gear') {
      // Engrenagem de sucata metálica
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        const rOut = 11.5;
        const rIn = 8.5;
        ctx.lineTo(Math.cos(a - 0.18) * rIn, Math.sin(a - 0.18) * rIn);
        ctx.lineTo(Math.cos(a - 0.1) * rOut, Math.sin(a - 0.1) * rOut);
        ctx.lineTo(Math.cos(a + 0.1) * rOut, Math.sin(a + 0.1) * rOut);
        ctx.lineTo(Math.cos(a + 0.18) * rIn, Math.sin(a + 0.18) * rIn);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(0, 0, 4.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (shape === 'can') {
      // Lata amassada
      ctx.beginPath();
      ctx.roundRect(-9.5, -7, 19, 14, 3.5);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = this.typeInfo.stroke;
      ctx.fillRect(-7.5, -7, 3, 14);
      ctx.fillRect(4.5, -7, 3, 14);

      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(-2, -4);
      ctx.lineTo(2, 4);
      ctx.stroke();
    } else if (shape === 'bottle') {
      // Garrafa plástica descartada
      ctx.beginPath();
      ctx.roundRect(-9, -6, 13, 12, 3.5);
      ctx.fill();
      ctx.stroke();

      // Gargalo e tampa
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(4, -3.2, 3.5, 6.4);
      ctx.strokeRect(4, -3.2, 3.5, 6.4);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(7.5, -4, 3, 8);
      ctx.strokeRect(7.5, -4, 3, 8);

      // Brilho
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.fillRect(-6, -3.5, 8, 2.2);
    } else if (shape === 'battery') {
      // Bateria química
      ctx.beginPath();
      ctx.roundRect(-8, -9, 16, 18, 2.5);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-3.5, -11.5, 7, 2.5);
      ctx.strokeRect(-3.5, -11.5, 7, 2.5);

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-8, -2, 16, 5);
    } else {
      // Placa de circuito quebrada
      ctx.beginPath();
      ctx.roundRect(-9, -9, 18, 18, 3);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-4.5, -4.5, 9, 9);
      ctx.strokeStyle = this.typeInfo.stroke;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-8, 0);
      ctx.lineTo(-4.5, 0);
      ctx.moveTo(4.5, 0);
      ctx.lineTo(8, 0);
      ctx.moveTo(0, -8);
      ctx.lineTo(0, -4.5);
      ctx.moveTo(0, 4.5);
      ctx.lineTo(0, 8);
      ctx.stroke();
    }
    ctx.restore();

    // 4. Badge superior nítida
    const tagY = this.y - half - 7 + bob * 0.4;
    ctx.font = '700 10px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const labelText = `♻ ${this.typeInfo.shortLabel || 'LIXO'}`;
    const boxW = Math.max(46, ctx.measureText(labelText).width + 12);
    const boxH = 16;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
    ctx.strokeStyle = this.typeInfo.color || '#4ade80';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(this.x - boxW / 2, tagY - boxH / 2, boxW, boxH, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.fillText(labelText, this.x, tagY + 0.5);

    ctx.restore();
  }
};

window.Player = class Player {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.role = config.role || 'Operador';
    this.primaryColor = config.primaryColor || '#38bdf8';
    this.secondaryColor = config.secondaryColor || '#0284c7';

    this.x = config.x || 200;
    this.y = config.y || 200;
    this.size = window.GameConfig.PLAYER_SIZE || 38;
    this.speed = window.GameConfig.PLAYER_SPEED || 290;

    this.maxHp = window.GameConfig.PLAYER_MAX_HP || 100;
    this.hp = this.maxHp;

    this.characterKey = config.id === 2 ? 'p2' : 'p1';
    this.facingX = 0;
    this.facingY = 1;
    this.facingDirection = 'down';
    this.vx = 0;
    this.vy = 0;
    this.walkCycle = 0;
    this.hitFlashTimer = 0;
    this.invulnerableTimer = 0;
    this.damageAnimTimer = 0;
    this.damageAnimDuration = 0.38;
    this.isDrowning = false;
    this.drowningProgress = 0;
    this.pickupTimer = 0;
    this.pickupDuration = 0.32;
    this.clampedByViewport = false;

    // Estado de Ataque Corpo a Corpo (Melee)
    this.attackTimer = 0;
    this.attackDuration = window.GameConfig.ATTACK_DURATION || 0.28;
    this.attackCooldown = 0;
    this.attackRange = window.GameConfig.ATTACK_RANGE || 84;
    this.attackArcAngle = window.GameConfig.ATTACK_ARC_ANGLE || Math.PI * 0.58;
    this.attackAngle = 0;
    this.hitTargetsInSwing = new Set();

    // Estado de Companheira IA no Modo Singleplayer
    this.isCompanion = false;
    this._isFollowing = false;
    this._stuckTimer = 0;
    this._lastPos = { x: this.x, y: this.y };
    this._avoidAngle = 0;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.clampedByViewport = false;
    this.attackTimer = 0;
    this.hitTargetsInSwing.clear();
    this._lastPos = { x, y };
  }

  getEquippedWeapon() {
    if (window.GlobalState && typeof window.GlobalState.getEquippedWeapon === 'function') {
      return window.GlobalState.getEquippedWeapon();
    }
    return window.GameConfig.WEAPONS.baton;
  }

  getAttackDamage() {
    const weapon = this.getEquippedWeapon();
    return weapon && weapon.damage ? weapon.damage : 30;
  }

  takeDamage(amount) {
    if (this.isCompanion) {
      this.damageAnimTimer = 0.32;
      this.hitFlashTimer = 0.22;
      return this.hp;
    }
    if (this.invulnerableTimer > 0) return this.hp;
    this.hp = Math.max(0, Math.round((this.hp - amount) * 10) / 10);
    this.hitFlashTimer = 0.25;
    this.invulnerableTimer = 0.42;
    this.damageAnimTimer = this.damageAnimDuration;
    return this.hp;
  }

  heal(amount) {
    this.hp = Math.min(this.maxHp, Math.round((this.hp + amount) * 10) / 10);
    return this.hp;
  }

  triggerPickup() {
    this.pickupTimer = this.pickupDuration;
  }

  /**
   * Inicia um golpe corpo a corpo com a arma equipada
   */
  triggerAttack(sourceLabel = 'Input', gameMode = 'singleplayer', customAngle = null) {
    if (this.attackCooldown > 0) return false;

    const weapon = this.getEquippedWeapon();
    this.attackDuration = window.GameConfig.ATTACK_DURATION || 0.28;
    this.attackRange = (weapon && weapon.range) ? weapon.range : (window.GameConfig.ATTACK_RANGE || 84);
    this.attackArcAngle = window.GameConfig.ATTACK_ARC_ANGLE || Math.PI * 0.58;

    this.attackTimer = this.attackDuration;
    this.attackCooldown = window.GameConfig.ATTACK_COOLDOWN || 0.16;
    this.hitTargetsInSwing.clear();

    if (customAngle !== null && !isNaN(customAngle)) {
      this.attackAngle = customAngle;
      this.facingX = Math.cos(customAngle);
      this.facingY = Math.sin(customAngle);
    } else {
      this.attackAngle = Math.atan2(this.facingY, this.facingX);
    }

    return true;
  }

  /**
   * Verifica com precisão máxima se um círculo (px, py, targetRadius) intersecta o cone de ataque atual.
   * Considera o raio angular do alvo e colisões a queima-roupa (point-blank).
   */
  isPointInAttackCone(px, py, targetRadius = 18) {
    if (this.attackTimer <= 0) return false;
    const dx = px - this.x;
    const dy = py - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist > this.attackRange + targetRadius) return false;

    // Se o inimigo estiver encostado/sobreposto ao corpo do jogador, garante o acerto imediato
    if (dist <= this.size * 0.65 + targetRadius) {
      return true;
    }

    const angleToTarget = Math.atan2(dy, dx);
    const diff = Math.atan2(
      Math.sin(angleToTarget - this.attackAngle),
      Math.cos(angleToTarget - this.attackAngle)
    );

    // Soma a abertura angular ocupada pelo próprio raio do alvo
    const targetAngularRadius = Math.atan2(targetRadius, Math.max(1, dist));
    return Math.abs(diff) <= this.attackArcAngle / 2 + targetAngularRadius + 0.12;
  }

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
   * Passo de Despenetração (Minimum Translation Vector - MTV):
   * Garante que o jogador jamais fique preso dentro de qualquer obstáculo ou parede.
   */
  resolveMapCollisions(map, viewportClamp = null) {
    if (!map) return;
    const half = this.size / 2;
    const obstacles = map.obstacles || [];

    for (let pass = 0; pass < 3; pass++) {
      let anyOverlap = false;

      // Mantém dentro das bordas do mapa
      this.x = Math.max(half, Math.min(map.width - half, this.x));
      this.y = Math.max(half, Math.min(map.height - half, this.y));

      if (viewportClamp) {
        this.x = Math.max(viewportClamp.minX, Math.min(viewportClamp.maxX, this.x));
        this.y = Math.max(viewportClamp.minY, Math.min(viewportClamp.maxY, this.y));
      }

      for (const obs of obstacles) {
        const box = this.getBoundingBox(this.x, this.y);
        if (this._aabbOverlap(box, obs)) {
          anyOverlap = true;
          const overlapLeft = (box.x + box.w) - obs.x;
          const overlapRight = (obs.x + obs.w) - box.x;
          const overlapTop = (box.y + box.h) - obs.y;
          const overlapBottom = (obs.y + obs.h) - box.y;

          const minOverlapX = overlapLeft < overlapRight ? -overlapLeft : overlapRight;
          const minOverlapY = overlapTop < overlapBottom ? -overlapTop : overlapBottom;

          if (Math.abs(minOverlapX) < Math.abs(minOverlapY)) {
            this.x += minOverlapX + (minOverlapX < 0 ? -0.05 : 0.05);
          } else {
            this.y += minOverlapY + (minOverlapY < 0 ? -0.05 : 0.05);
          }
        }
      }

      if (!anyOverlap) break;
    }
  }

  /**
   * Atualiza movimentação com Sub-stepping e resolução de colisão AABB recalculada a cada obstáculo
   */
  update(dt, inputVector, map, viewportClamp = null) {
    if (this.hitFlashTimer > 0) {
      this.hitFlashTimer = Math.max(0, this.hitFlashTimer - dt);
    }
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer = Math.max(0, this.invulnerableTimer - dt);
    }
    if (this.damageAnimTimer > 0) {
      this.damageAnimTimer = Math.max(0, this.damageAnimTimer - dt);
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

    if (dx !== 0 || dy !== 0) {
      const len = Math.hypot(dx, dy) || 1;
      this.facingX = dx / len;
      this.facingY = dy / len;
      this.walkCycle += dt * 9.5;

      if (Math.abs(dx) > 0.35 && dy > 0.35) {
        this.facingDirection = dx > 0 ? 'down-right' : 'down-left';
      } else if (Math.abs(dy) >= Math.abs(dx)) {
        this.facingDirection = dy > 0 ? 'down' : 'up';
      } else {
        this.facingDirection = dx > 0 ? 'right' : 'left';
      }
    } else {
      this.walkCycle = 0;
    }

    const half = this.size / 2;
    const totalMoveX = this.vx * dt;
    const totalMoveY = this.vy * dt;
    const totalDist = Math.hypot(totalMoveX, totalMoveY);
    const steps = Math.max(1, Math.ceil(totalDist / 8));
    const stepX = totalMoveX / steps;
    const stepY = totalMoveY / steps;

    for (let s = 0; s < steps; s++) {
      // 1. Movimento e Colisão no Eixo X
      if (stepX !== 0) {
        let nextX = this.x + stepX;
        nextX = Math.max(half, Math.min(map.width - half, nextX));

        if (viewportClamp) {
          if (stepX < 0 && nextX < viewportClamp.minX) {
            nextX = Math.max(this.x, viewportClamp.minX);
            this.clampedByViewport = true;
          } else if (stepX > 0 && nextX > viewportClamp.maxX) {
            nextX = Math.min(this.x, viewportClamp.maxX);
            this.clampedByViewport = true;
          }
        }

        for (const obs of map.obstacles) {
          const boxX = this.getBoundingBox(nextX, this.y);
          if (this._aabbOverlap(boxX, obs)) {
            if (stepX > 0) {
              nextX = obs.x - half - 0.02;
            } else {
              nextX = obs.x + obs.w + half + 0.02;
            }
          }
        }
        this.x = nextX;
      }

      // 2. Movimento e Colisão no Eixo Y
      if (stepY !== 0) {
        let nextY = this.y + stepY;
        nextY = Math.max(half, Math.min(map.height - half, nextY));

        if (viewportClamp) {
          if (stepY < 0 && nextY < viewportClamp.minY) {
            nextY = Math.max(this.y, viewportClamp.minY);
            this.clampedByViewport = true;
          } else if (stepY > 0 && nextY > viewportClamp.maxY) {
            nextY = Math.min(this.y, viewportClamp.maxY);
            this.clampedByViewport = true;
          }
        }

        for (const obs of map.obstacles) {
          const boxY = this.getBoundingBox(this.x, nextY);
          if (this._aabbOverlap(boxY, obs)) {
            if (stepY > 0) {
              nextY = obs.y - half - 0.02;
            } else {
              nextY = obs.y + obs.h + half + 0.02;
            }
          }
        }
        this.y = nextY;
      }
    }

    // 3. Garantia final contra sobreposição residual
    this.resolveMapCollisions(map, viewportClamp);
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
   * Renderiza o arco de corte da arma equipada (Bastão, Barra de Ferro ou Katana)
   */
  _drawAttackCone(ctx) {
    if (this.attackTimer <= 0) return;

    const weapon = this.getEquippedWeapon();
    const progress = 1 - this.attackTimer / this.attackDuration;
    const alpha = Math.max(0.12, 1 - progress * 0.8);
    const radius = this.attackRange * (0.9 + 0.1 * Math.sin(progress * Math.PI));
    const halfArc = this.attackArcAngle / 2;
    const startAngle = this.attackAngle - halfArc;
    const endAngle = this.attackAngle + halfArc;

    const weaponColor = (weapon && weapon.color) || '#38bdf8';
    const weaponStroke = (weapon && weapon.stroke) || '#ffffff';

    ctx.save();

    // 1. Gradiente suave do arco de golpe
    const grad = ctx.createRadialGradient(this.x, this.y, 12, this.x, this.y, radius);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    grad.addColorStop(0.65, `${weaponColor}44`);
    grad.addColorStop(1, `${weaponColor}99`);

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.arc(this.x, this.y, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.globalAlpha = alpha;
    ctx.fill();

    // 2. Rastro de corte externo (crescent slash)
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, startAngle, endAngle);
    ctx.lineWidth = 4;
    ctx.strokeStyle = weaponStroke;
    ctx.stroke();

    // 3. Lâmina / Arma em movimento no ângulo atual do golpe
    const sweepAngle = startAngle + (endAngle - startAngle) * Math.min(1, progress * 1.25);
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(sweepAngle);

    if (weapon && weapon.id === 'katana') {
      // Lâmina de Katana reluzente
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(14, -2.5);
      ctx.lineTo(radius - 2, -1);
      ctx.lineTo(radius + 6, 0);
      ctx.lineTo(radius - 2, 2.5);
      ctx.lineTo(14, 2.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (weapon && weapon.id === 'iron_bar') {
      // Barra de Ferro pesada
      ctx.fillStyle = '#cbd5e1';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(14, -3.5, radius - 14, 7, 2);
      ctx.fill();
      ctx.stroke();
    } else {
      // Bastão tático
      ctx.fillStyle = '#38bdf8';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(14, -3, radius - 16, 6, 3);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();

    ctx.restore();
  }

  /**
   * Renderiza a personagem no Canvas com visual limpo e polido
   */
  draw(ctx, isControlled, gameMode, timeSeconds) {
    const half = this.size / 2;
    const isMoving = this.vx !== 0 || this.vy !== 0;

    ctx.save();

    if (this.invulnerableTimer > 0 && Math.floor(this.invulnerableTimer * 22) % 2 === 0) {
      ctx.globalAlpha = 0.45;
    }

    // 1. Aura suave sob a personagem ativa
    if (isControlled) {
      const pulse = 1 + Math.sin(timeSeconds * 5.5) * 0.06;
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(this.x, this.y + half - 2, (half + 8) * pulse, (half * 0.5) * pulse, 0, 0, Math.PI * 2);
      ctx.fillStyle = gameMode === 'singleplayer'
        ? 'rgba(250, 204, 21, 0.22)'
        : 'rgba(56, 189, 248, 0.20)';
      ctx.fill();
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = gameMode === 'singleplayer' ? 'rgba(250, 204, 21, 0.75)' : this.primaryColor;
      ctx.stroke();
      ctx.restore();
    }

    // 2. Sombra natural sob os pés
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + half - 2, half * 0.82, half * 0.4, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fill();

    // 3. Sprite Animado da Personagem
    let animName = 'idle_down';
    let frameIndex = 0;
    let overrideFlipX = undefined;

    if (this.isDrowning) {
      // Afogamento (Time Over): animação exclusiva da primeira fase ao zerar o tempo (6 frames)
      animName = 'afogamento';
      const safeDrown = Math.min(0.999, Math.max(0, this.drowningProgress || 0));
      frameIndex = Math.floor(safeDrown * 6);
      overrideFlipX = false;
    } else if (this.damageAnimTimer > 0) {
      // Dano: acionado sempre que a personagem sofrer qualquer tipo de ataque (4 frames)
      animName = 'dano';
      const progress = Math.min(0.999, Math.max(0, 1 - (this.damageAnimTimer / this.damageAnimDuration)));
      frameIndex = Math.floor(progress * 4);
      overrideFlipX = this.facingX < 0;
    } else if (this.attackTimer > 0) {
      animName = 'attack';
      const progress = Math.min(0.999, Math.max(0, 1 - (this.attackTimer / this.attackDuration)));
      frameIndex = Math.floor(progress * 3);
      overrideFlipX = Math.cos(this.attackAngle) < 0;
    } else if (this.pickupTimer > 0) {
      animName = 'pickup';
      const progress = Math.min(0.999, Math.max(0, 1 - (this.pickupTimer / this.pickupDuration)));
      frameIndex = Math.floor(progress * 4);
      overrideFlipX = this.facingX < 0;
    } else if (isMoving) {
      if (this.facingDirection === 'down-right') {
        animName = 'walk_down_right';
        overrideFlipX = false;
      } else if (this.facingDirection === 'down-left') {
        animName = 'walk_down_left';
        overrideFlipX = true;
      } else if (this.facingDirection === 'up') {
        animName = 'walk_up';
        overrideFlipX = false;
      } else if (this.facingDirection === 'right') {
        animName = 'walk_right';
        overrideFlipX = true;
      } else if (this.facingDirection === 'left') {
        animName = 'walk_left';
        overrideFlipX = false;
      } else {
        animName = 'walk_down';
        overrideFlipX = false;
      }
      frameIndex = Math.floor(this.walkCycle);
    } else {
      if (this.facingDirection === 'up') {
        animName = 'idle_up';
        overrideFlipX = false;
      } else if (this.facingDirection === 'right') {
        animName = 'idle_right';
        overrideFlipX = true;
      } else if (this.facingDirection === 'left') {
        animName = 'idle_left';
        overrideFlipX = false;
      } else if (this.facingDirection === 'down-right') {
        animName = 'idle_down_right';
        overrideFlipX = false;
      } else if (this.facingDirection === 'down-left') {
        animName = 'idle_down_left';
        overrideFlipX = true;
      } else {
        animName = 'idle_down';
        overrideFlipX = false;
      }
      frameIndex = 0;
    }

    if (window.SpriteManager) {
      window.SpriteManager.draw(
        ctx,
        this.characterKey,
        animName,
        frameIndex,
        this.x,
        this.y + half,
        {
          overrideFlipX,
          scale: 0.75,
          hitFlash: this.hitFlashTimer > 0
        }
      );
    } else {
      ctx.fillStyle = this.hitFlashTimer > 0 ? '#ef4444' : this.secondaryColor;
      ctx.fillRect(this.x - 15, this.y - 15, 30, 30);
    }

    // 4. Efeito de Corte de Ataque
    if (this.attackTimer > 0) {
      this._drawAttackCone(ctx);
    }

    // 5. Indicador discreto de Jogador Ativo sobre a cabeça
    if (gameMode === 'singleplayer' && isControlled) {
      const labelY = this.y - 58;
      const arrowBounce = Math.sin(timeSeconds * 7) * 3;
      const arrowY = labelY - 6 + arrowBounce;

      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(this.x, arrowY + 8);
      ctx.lineTo(this.x - 6, arrowY);
      ctx.lineTo(this.x + 6, arrowY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (gameMode === 'multiplayer') {
      const labelY = this.y - 56;
      this._drawOverheadTag(
        ctx,
        this.x,
        labelY,
        `P${this.id}`,
        this.primaryColor,
        '#0f172a'
      );
    }

    ctx.restore();
  }

  _drawOverheadTag(ctx, x, y, text, bgColor, textColor) {
    ctx.save();
    ctx.font = '700 11px "Segoe UI", system-ui, sans-serif';
    const paddingX = 7;
    const textWidth = ctx.measureText(text).width;
    const boxW = textWidth + paddingX * 2;
    const boxH = 18;

    ctx.fillStyle = bgColor;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x - boxW / 2, y - boxH, boxW, boxH, 5);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y - boxH / 2 + 0.5);
    ctx.restore();
  }
};
