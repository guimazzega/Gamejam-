/**
 * js/entities.js
 * Entidades do Jogo:
 * - FloatingText: Textos flutuantes de feedback visual e debug
 * - TrashItem: Entidades coletáveis de "Lixo / Sucata" espalhadas pelos 3 mapas grandes (Sprint 2)
 * - Player: Personagem 1 e Personagem 2 com colisão AABB, suporte a Sprites customizados e Trava de Câmera/Viewport no Multiplayer
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
 * Entidade de Coleta: Lixo / Sucata espalhado pelo chão dos Mapas Grandes (Sprint 2)
 */
window.TrashItem = class TrashItem {
  constructor(config) {
    this.id = config.id;
    this.x = config.x;
    this.y = config.y;
    this.size = config.size || window.GameConfig.TRASH_SIZE || 26;
    this.typeInfo = config.typeInfo || window.GameConfig.TRASH_TYPES[0];
    this.rotation = config.rotation || 0;
    this.bobPhase = config.bobPhase || 0;
    this.sprite = config.sprite || null;
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

    // 4. Tag visual discreta identificando como "LIXO" (apenas em modo debug)
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
    this.name = config.name; // 'Personagem 1' ou 'Personagem 2'
    this.role = config.role || 'Operador';
    this.primaryColor = config.primaryColor || '#38bdf8';
    this.secondaryColor = config.secondaryColor || '#0284c7';
    this.sprite = config.sprite || null;

    this.x = config.x || 200;
    this.y = config.y || 200;
    this.size = window.GameConfig.PLAYER_SIZE; // 40x40px
    this.speed = window.GameConfig.PLAYER_SPEED;

    this.maxHp = window.GameConfig.PLAYER_MAX_HP;
    this.hp = this.maxHp;

    this.inventory = config.inventory || [];
    this.selectedSlot = 0;

    // Direção do olhar e velocidade atual (para debug e animação)
    this.facingX = 1;
    this.facingY = 0;
    this.vx = 0;
    this.vy = 0;
    this.walkCycle = 0;
    this.hitFlashTimer = 0;
    this.clampedByViewport = false;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.clampedByViewport = false;
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

    this.clampedByViewport = false;

    const { dx, dy } = inputVector;
    this.vx = dx * this.speed;
    this.vy = dy * this.speed;

    if (dx !== 0 || dy !== 0) {
      this.facingX = dx;
      this.facingY = dy;
      this.walkCycle += dt * 12;
    } else {
      this.walkCycle = 0;
    }

    const half = this.size / 2;

    // 1. Movimento e Colisão no Eixo X
    if (dx !== 0) {
      let nextX = this.x + this.vx * dt;
      nextX = Math.max(half, Math.min(map.width - half, nextX));

      // Trava de Câmera / Viewport no Multiplayer Local (Eixo X)
      if (viewportClamp) {
        if (dx < 0 && nextX < viewportClamp.minX) {
          nextX = Math.min(this.x, viewportClamp.minX);
          this.clampedByViewport = true;
        } else if (dx > 0 && nextX > viewportClamp.maxX) {
          nextX = Math.max(this.x, viewportClamp.maxX);
          this.clampedByViewport = true;
        }
      }

      for (const obs of map.obstacles) {
        if (obs.noCollision) continue;
        const boxX = this.getBoundingBox(nextX, this.y);
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

      // Trava de Câmera / Viewport no Multiplayer Local (Eixo Y)
      if (viewportClamp) {
        if (dy < 0 && nextY < viewportClamp.minY) {
          nextY = Math.min(this.y, viewportClamp.minY);
          this.clampedByViewport = true;
        } else if (dy > 0 && nextY > viewportClamp.maxY) {
          nextY = Math.max(this.y, viewportClamp.maxY);
          this.clampedByViewport = true;
        }
      }

      for (const obs of map.obstacles) {
        if (obs.noCollision) continue;
        const boxY = this.getBoundingBox(this.x, nextY);
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
   * Renderiza o personagem no Canvas com estética Top-Down limpa + suporte a Sprite + indicadores de Debug
   */
  draw(ctx, isControlled, gameMode, timeSeconds) {
    const half = this.size / 2;
    const isMoving = this.vx !== 0 || this.vy !== 0;
    const bobOffset = isMoving ? Math.sin(this.walkCycle) * 2.5 : 0;
    const hideDebug = Boolean(window.hideDebugOverlays);

    ctx.save();

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
    if (!hideDebug) {
      ctx.strokeStyle = this.clampedByViewport
        ? '#ef4444'
        : isControlled
          ? 'rgba(255, 202, 58, 0.85)'
          : 'rgba(148, 163, 184, 0.45)';
      ctx.lineWidth = this.clampedByViewport ? 2.2 : 1.5;
      ctx.setLineDash([4, 3]);
      ctx.strokeRect(this.x - half, this.y - half, this.size, this.size);
      ctx.setLineDash([]);
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
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.facingX * 32, this.y + this.facingY * 32);
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 7. Tag do Personagem + Indicador Visual Sobre a Cabeça (Seta Animada no Ativo)
    const labelY = drawY - 30;

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

      // Badge "P1 ATIVO" ou "P2 ATIVO"
      if (!hideDebug) {
        this._drawOverheadTag(ctx, this.x, labelY - 2, `P${this.id} • ATIVO`, '#ffca3a', '#1e1306');
      }
    } else if (!hideDebug && gameMode === 'singleplayer' && !isControlled) {
      this._drawOverheadTag(ctx, this.x, labelY, `P${this.id} [TAB]`, 'rgba(30, 41, 59, 0.85)', '#cbd5e1');
    } else if (!hideDebug) {
      // Multiplayer Local: ambos ativos
      const tagText = this.clampedByViewport
        ? `P${this.id} [LIMITE CÂMERA]`
        : this.id === 1
          ? 'P1 [WASD]'
          : 'P2 [SETAS]';
      const tagBg = this.clampedByViewport ? '#ef4444' : this.primaryColor;
      const tagFg = this.clampedByViewport ? '#ffffff' : '#0f172a';
      this._drawOverheadTag(ctx, this.x, labelY, tagText, tagBg, tagFg);
    }

    // 8. Coordenadas de Debug sob os pés
    if (!hideDebug) {
      ctx.font = '10px Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(226, 232, 240, 0.75)';
      ctx.fillText(`(${Math.round(this.x)}, ${Math.round(this.y)})`, this.x, this.y + half + 13);
    }

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
