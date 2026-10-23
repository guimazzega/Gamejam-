/**
 * js/entities.js
 * Entidades do Jogo (Sprints 2 & 3):
 * - FloatingText: Textos flutuantes de feedback visual e debug
 * - TrashItem: Entidades coletáveis de "Lixo / Sucata" em posições fixas (hardcoded) nos 3 mapas (Sprint 3)
 * - Player: Personagem 1 e Personagem 2 com colisão AABB, Trava de Câmera no Multiplayer e
 *   Arco/Cone de Colisão Temporário de Ataque/Bater (Sprint 3)
 */

window.FloatingText = class FloatingText {
  constructor(x, y, text, color = '#ff4d4d', life = 1.0) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.alpha = 1;
    this.vy = -44; // Sobe suavemente
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
 * Entidade de Coleta: Lixo / Sucata em Coordenadas Fixas (Sprint 3)
 */
window.TrashItem = class TrashItem {
  constructor(config) {
    this.id = config.id;
    this.x = config.x;
    this.y = config.y;
    this.size = window.GameConfig.TRASH_SIZE || 26;
    this.typeInfo = config.typeInfo || window.GameConfig.TRASH_TYPES[0];
    this.rotation = config.rotation || 0;
    this.bobPhase = config.bobPhase || 0;
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

    ctx.save();

    // 1. Sombra no chão
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + half - 2, half * 0.8, half * 0.45, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
    ctx.fill();

    // 2. Hitbox Debug pontilhada do Lixo
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.strokeRect(this.x - half, this.y - half, this.size, this.size);
    ctx.setLineDash([]);

    // 3. Forma Geométrica de Debug representando o Lixo / Sucata
    ctx.save();
    ctx.translate(this.x, this.y + pulse * 0.5);
    ctx.rotate(this.rotation);

    ctx.fillStyle = this.typeInfo.color;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;

    const shape = this.typeInfo.shape;
    if (shape === 'gear') {
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (shape === 'can') {
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
      ctx.beginPath();
      ctx.roundRect(-7, -5, 11, 10, 3);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(4, -3, 4, 6);
    } else if (shape === 'battery') {
      ctx.beginPath();
      ctx.roundRect(-7, -8, 14, 16, 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-3, -10, 6, 2);
    } else {
      ctx.beginPath();
      ctx.moveTo(0, -9);
      ctx.lineTo(9, 0);
      ctx.lineTo(0, 9);
      ctx.lineTo(-9, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();

    // 4. Tag visual discreta identificando como "LIXO" + coordenada fixa
    ctx.font = 'bold 9px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
    ctx.fillRect(this.x - 16, this.y - half - 12, 32, 11);
    ctx.fillStyle = this.typeInfo.stroke || '#fef08a';
    ctx.fillText('LIXO', this.x, this.y - half - 3.5);

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

    this.x = config.x || 200;
    this.y = config.y || 200;
    this.size = window.GameConfig.PLAYER_SIZE; // 40x40px
    this.speed = window.GameConfig.PLAYER_SPEED;

    this.maxHp = window.GameConfig.PLAYER_MAX_HP;
    this.hp = this.maxHp;

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

    // Estado de Ataque / Bater (Placeholder Sprint 3)
    this.attackTimer = 0;
    this.attackDuration = window.GameConfig.ATTACK_DURATION || 0.28;
    this.attackCooldown = 0;
    this.attackRange = window.GameConfig.ATTACK_RANGE || 76;
    this.attackArcAngle = window.GameConfig.ATTACK_ARC_ANGLE || Math.PI * 0.52;
    this.attackAngle = 0;
    this.attackSourceLabel = '';
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.clampedByViewport = false;
    this.attackTimer = 0;
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
    this.hitFlashTimer = 0.25;
    return this.hp;
  }

  heal(amount) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
    return this.hp;
  }

  getEquippedItem() {
    return this.inventory[this.selectedSlot] || null;
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
   * Atualiza movimentação em 8 direções com resolução de colisão AABB separada por eixo (deslize suave)
   * e aplica o Clamp de Viewport no Modo Multiplayer Local (bloqueando saída da tela).
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

    this.clampedByViewport = false;

    const { dx, dy } = inputVector;
    this.vx = dx * this.speed;
    this.vy = dy * this.speed;

    if (dx !== 0 || dy !== 0) {
      const len = Math.hypot(dx, dy) || 1;
      this.facingX = dx / len;
      this.facingY = dy / len;
      this.walkCycle += dt * 12;
      // Atualiza o ângulo do cone se estiver atacando enquanto caminha
      if (this.attackTimer > 0) {
        this.attackAngle = Math.atan2(this.facingY, this.facingX);
      }
    } else {
      this.walkCycle = 0;
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

  /**
   * Verifica se o jogador está tocando uma zona (ex: Zona de Extração, Porta da Van, Lojinha, Crafting)
   */
  isTouchingZone(zone) {
    if (!zone) return false;
    return this._aabbOverlap(this.getBoundingBox(), zone);
  }

  /**
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
   * Renderiza o personagem no Canvas com estética Top-Down limpa + indicadores de Debug e Cone de Ataque
   */
  draw(ctx, isControlled, gameMode, timeSeconds) {
    const half = this.size / 2;
    const isMoving = this.vx !== 0 || this.vy !== 0;
    const bobOffset = isMoving ? Math.sin(this.walkCycle) * 2.5 : 0;

    ctx.save();

    // 0. Arco / Cone de Colisão de Ataque (Renderizado na frente do personagem quando ativo)
    if (this.attackTimer > 0) {
      this._drawAttackCone(ctx);
    }

    // 1. Aura / Brilho no chão para o personagem atualmente controlado
    if (isControlled) {
      const pulse = 1 + Math.sin(timeSeconds * 6) * 0.08;
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(this.x, this.y + half - 2, (half + 9) * pulse, (half * 0.55) * pulse, 0, 0, Math.PI * 2);
      ctx.fillStyle = gameMode === 'singleplayer'
        ? 'rgba(255, 202, 58, 0.25)'
        : 'rgba(56, 189, 248, 0.20)';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = gameMode === 'singleplayer' ? '#ffca3a' : this.primaryColor;
      ctx.stroke();
      ctx.restore();
    }

    // 2. Sombra de projeção top-down
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + half - 3, half * 0.8, half * 0.4, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fill();

    // 3. Caixa de Colisão (Hitbox Debug) no chão
    ctx.strokeStyle = this.clampedByViewport
      ? '#ef4444'
      : isControlled
        ? 'rgba(255, 202, 58, 0.85)'
        : 'rgba(148, 163, 184, 0.45)';
    ctx.lineWidth = this.clampedByViewport ? 2.2 : 1.5;
    ctx.setLineDash([4, 3]);
    ctx.strokeRect(this.x - half, this.y - half, this.size, this.size);
    ctx.setLineDash([]);

    // 4. Corpo Estilizado do Personagem (Top-Down)
    const drawY = this.y + bobOffset;

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

    // 5. Placeholder Visual do Item Equipado na Mão (se não estiver vazio)
    const item = this.getEquippedItem();
    if (item && !item.isEmpty) {
      const handX = this.x + this.facingX * 18 - this.facingY * 8;
      const handY = drawY + this.facingY * 18 + this.facingX * 8;
      ctx.fillStyle = item.color || '#facc15';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(handX - 5, handY - 5, 10, 10, 2);
      ctx.fill();
      ctx.stroke();
    }

    // 6. Vetor de Velocidade (Linha de Debug ao caminhar)
    if (isMoving) {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.facingX * 32, this.y + this.facingY * 32);
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 7. Tag do Personagem + Indicador Visual Sobre a Cabeça (Seta Animada no Ativo)
    const labelY = drawY - 30;
    const C = window.Config.Controls;
    const fmt = (k) => window.Config.formatKeyCode(k);

    if (gameMode === 'singleplayer' && isControlled) {
      const arrowBounce = Math.sin(timeSeconds * 8) * 4;
      const arrowY = labelY - 16 + arrowBounce;

      // Seta Dourada de Controle Ativo
      ctx.fillStyle = '#ffca3a';
      ctx.strokeStyle = '#3b2313';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.x, arrowY + 9);
      ctx.lineTo(this.x - 8, arrowY);
      ctx.lineTo(this.x + 8, arrowY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      this._drawOverheadTag(ctx, this.x, labelY - 2, `P${this.id} • ATIVO`, '#ffca3a', '#1e1306');
    } else if (gameMode === 'singleplayer' && !isControlled) {
      this._drawOverheadTag(ctx, this.x, labelY, `P${this.id} [${fmt(C.SwitchPlayer)}]`, 'rgba(30, 41, 59, 0.85)', '#cbd5e1');
    } else {
      const tagText = this.clampedByViewport
        ? `P${this.id} [LIMITE CÂMERA]`
        : this.id === 1
          ? `P1 [ATK: ${fmt(C.P1_Attack)}]`
          : `P2 [ATK: ${fmt(C.P2_Attack)}]`;
      const tagBg = this.clampedByViewport ? '#ef4444' : this.primaryColor;
      const tagFg = this.clampedByViewport ? '#ffffff' : '#0f172a';
      this._drawOverheadTag(ctx, this.x, labelY, tagText, tagBg, tagFg);
    }

    // 8. Coordenadas de Debug sob os pés
    ctx.font = '10px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(226, 232, 240, 0.75)';
    ctx.fillText(`(${Math.round(this.x)}, ${Math.round(this.y)})`, this.x, this.y + half + 13);

    ctx.restore();
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
