/**
 * js/enemies.js
 * Sistema de Inimigos (3 Tipos de Ratos a partir da Fase 2):
 * 1. Rato Arremessador de Queijo: Inimigo Ã  distÃ¢ncia que identifica o jogador e arremessa pedaÃ§os de queijo.
 * 2. Rato Cuspidor: Inimigo Ã  distÃ¢ncia que calcula a direÃ§Ã£o, telegrafa um preparo tÃ³xico e cospe projÃ©teis Ã¡cidos.
 * 3. Rato Arranhador: Inimigo corpo a corpo veloz que persegue o jogador e desfere ataques cortantes com garras (arranhÃµes).
 *
 * Inclui:
 * - ProjÃ©teis (CheeseProjectile e SpitProjectile) com colisÃ£o em jogadores e obstÃ¡culos
 * - Sistema de ataque, tempo de recarga, alcance e Ã¡reas de colisÃ£o
 * - Ãudio sintetizado via Web Audio API (respeitando window.isMuted)
 * - IntegraÃ§Ã£o total com o sistema de dano, telemetria e estatÃ­sticas de combate (stageEnemiesDefeated)
 */

class EnemyAudio {
  constructor() {
    this.ctx = null;
  }

  _initContext() {
    if (!this.ctx && typeof AudioContext !== 'undefined') {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      } catch (e) {
        this.ctx = null;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playCheeseThrow() {
    if (window.isMuted) return;
    this._initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.14);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }

  playSpit() {
    if (window.isMuted) return;
    this._initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.16);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.17);
    } catch (e) {}
  }

  playScratch() {
    if (window.isMuted) return;
    this._initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.12);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(3.0, now);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 0.13);
    } catch (e) {}
  }

  playEnemyHit() {
    if (window.isMuted) return;
    this._initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);
      gain.gain.setValueAtTime(0.10, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.11);
    } catch (e) {}
  }

  playEnemyDefeat() {
    if (window.isMuted) return;
    this._initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.22);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.23);
    } catch (e) {}
  }

  playBossRoar() {
    if (window.isMuted) return;
    this._initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.linearRampToValueAtTime(160, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.5);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.52);
    } catch (e) {}
  }

  playStageChange() {
    if (window.isMuted) return;
    this._initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [220, 277, 330, 440].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + idx * 0.08 + 0.3);
        gain.gain.setValueAtTime(0.12, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.32);
      });
    } catch (e) {}
  }

  playRadioactiveThrow() {
    if (window.isMuted) return;
    this._initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.22);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.24);
    } catch (e) {}
  }

  playDeflect() {
    if (window.isMuted) return;
    this._initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.05);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {}
  }

  playGlitchBuzz() {
    if (window.isMuted) return;
    this._initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(60, now);
      osc.frequency.linearRampToValueAtTime(900, now + 0.08);
      osc.frequency.setValueAtTime(120, now + 0.12);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {}
  }

  playVictoryFanfare() {
    if (window.isMuted) return;
    this._initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [
        { f: 523.25, t: 0.0, d: 0.2 }, // C5
        { f: 659.25, t: 0.18, d: 0.2 }, // E5
        { f: 783.99, t: 0.36, d: 0.2 }, // G5
        { f: 1046.50, t: 0.54, d: 0.6 } // C6 (long hold)
      ];
      notes.forEach((n) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + n.t);
        gain.gain.setValueAtTime(0.18, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + n.d + 0.02);
      });
    } catch (e) {}
  }
}

/**
 * ============================================================================
 * PROJÃ‰TEIS
 * ============================================================================
 */

class CheeseProjectile {
  constructor(x, y, targetX, targetY, speed = 280, damage = 10) {
    this.x = x;
    this.y = y;
    this.radius = 9;
    this.speed = speed;
    this.damage = damage;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = 8.5;
    this.lifetime = 3.2;
    this.destroyed = false;

    const dx = targetX - x;
    const dy = targetY - y;
    const dist = Math.hypot(dx, dy) || 1;
    this.vx = (dx / dist) * this.speed;
    this.vy = (dy / dist) * this.speed;
  }

  update(dt, map, players, onHitPlayer) {
    if (this.destroyed) return;

    this.lifetime -= dt;
    if (this.lifetime <= 0) {
      this.destroyed = true;
      return;
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.rotation += this.rotationSpeed * dt;

    // Limites do mapa
    if (this.x < 0 || this.x > map.width || this.y < 0 || this.y > map.height) {
      this.destroyed = true;
      return;
    }

    // ColisÃ£o com obstÃ¡culos sÃ³lidos do mapa
    for (const obs of map.obstacles) {
      if (
        this.x + this.radius > obs.x &&
        this.x - this.radius < obs.x + obs.w &&
        this.y + this.radius > obs.y &&
        this.y - this.radius < obs.y + obs.h
      ) {
        this.destroyed = true;
        return;
      }
    }

    // ColisÃ£o com jogadores
    for (const player of players) {
      const half = player.size / 2;
      const distX = Math.abs(this.x - player.x);
      const distY = Math.abs(this.y - player.y);
      if (distX < half + this.radius && distY < half + this.radius) {
        this.destroyed = true;
        onHitPlayer(player, this.damage, '🧀 Queijo Arremessado');
        return;
      }
    }
  }

  draw(ctx) {
    if (this.destroyed) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Sombra
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.beginPath();
    ctx.ellipse(2, 4, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Fatia triangular de queijo suÃ­Ã§o
    ctx.fillStyle = '#facc15';
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1.8;

    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(-8, -8);
    ctx.lineTo(-8, 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Furinhos do queijo
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.arc(-2, -2, 2.2, 0, Math.PI * 2);
    ctx.arc(-4, 3, 1.8, 0, Math.PI * 2);
    ctx.arc(3, 1, 1.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

class SpitProjectile {
  constructor(x, y, targetX, targetY, speed = 320, damage = 12) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.speed = speed;
    this.damage = damage;
    this.lifetime = 2.6;
    this.destroyed = false;
    this.blobPhase = Math.random() * Math.PI;

    const dx = targetX - x;
    const dy = targetY - y;
    const dist = Math.hypot(dx, dy) || 1;
    this.vx = (dx / dist) * this.speed;
    this.vy = (dy / dist) * this.speed;
    this.angle = Math.atan2(dy, dx);
  }

  update(dt, map, players, onHitPlayer) {
    if (this.destroyed) return;

    this.lifetime -= dt;
    this.blobPhase += dt * 10;

    if (this.lifetime <= 0) {
      this.destroyed = true;
      return;
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    if (this.x < 0 || this.x > map.width || this.y < 0 || this.y > map.height) {
      this.destroyed = true;
      return;
    }

    // ColisÃ£o com obstÃ¡culos sÃ³lidos
    for (const obs of map.obstacles) {
      if (
        this.x + this.radius > obs.x &&
        this.x - this.radius < obs.x + obs.w &&
        this.y + this.radius > obs.y &&
        this.y - this.radius < obs.y + obs.h
      ) {
        this.destroyed = true;
        return;
      }
    }

    // ColisÃ£o com jogadores
    for (const player of players) {
      const half = player.size / 2;
      const distX = Math.abs(this.x - player.x);
      const distY = Math.abs(this.y - player.y);
      if (distX < half + this.radius && distY < half + this.radius) {
        this.destroyed = true;
        onHitPlayer(player, this.damage, '🧪 Cusparada Tóxica');
        return;
      }
    }
  }

  draw(ctx) {
    if (this.destroyed) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Rastro/Glow tóxico
    ctx.fillStyle = 'rgba(132, 204, 22, 0.35)';
    ctx.beginPath();
    ctx.ellipse(-8, 0, 14, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    const frameIdx = (Math.floor(this.blobPhase * 1.5) % 3) + 1;
    const spriteUrl = `assets/enemies/rato2/05_Projetil_Gosma/projetil_gosma_0${frameIdx}.png`;
    const img = window.SpriteManager ? window.SpriteManager.getImage(spriteUrl) : null;

    if (img) {
      const w = 34;
      const h = 22;
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
    } else {
      // Glob de saliva ácida verde brilhante (fallback vetorial)
      const wobble = Math.sin(this.blobPhase) * 1.5;
      ctx.fillStyle = '#84cc16';
      ctx.strokeStyle = '#4d7c0f';
      ctx.lineWidth = 1.8;

      ctx.beginPath();
      ctx.ellipse(0, 0, 10 + wobble, 7 - wobble * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Destaque brilhante de ácido
      ctx.fillStyle = '#d9f99d';
      ctx.beginPath();
      ctx.arc(3, -2, 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Pequenas gotículas satélites
      ctx.fillStyle = '#65a30d';
      ctx.beginPath();
      ctx.arc(-9, -3 + wobble, 2, 0, Math.PI * 2);
      ctx.arc(-14, 2 - wobble, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

/**
 * ============================================================================
 * PROJÃ‰TEIS DO CHEFE (ESTÃGIO 1: LIXO RADIOATIVO)
 * ============================================================================
 */

class RadioactiveBarrelProjectile {
  constructor(x, y, targetX, targetY, speed = 290, damage = 14) {
    this.x = x;
    this.y = y;
    this.radius = 18;
    this.speed = speed;
    this.damage = damage;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = 4.2;
    this.lifetime = 4.0;
    this.destroyed = false;
    this.isNeutralizable = true;
    this.neutralizeLabel = 'â˜¢ BARRIL REBATIDO!';
    this.neutralizeColor = '#bef264';
    this.trailTimer = 0;
    this.trailParticles = [];

    const dx = targetX - x;
    const dy = targetY - y;
    const dist = Math.hypot(dx, dy) || 1;
    this.vx = (dx / dist) * this.speed;
    this.vy = (dy / dist) * this.speed;
  }

  update(dt, map, players, onHitPlayer) {
    if (this.destroyed) return;

    this.lifetime -= dt;
    if (this.lifetime <= 0) {
      this.destroyed = true;
      return;
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.rotation += this.rotationSpeed * dt;

    // Rastro de bolhas radioativas
    this.trailTimer += dt;
    if (this.trailTimer >= 0.05) {
      this.trailTimer = 0;
      this.trailParticles.push({
        x: this.x + (Math.random() * 8 - 4),
        y: this.y + (Math.random() * 8 - 4),
        r: 2 + Math.random() * 3,
        alpha: 0.8,
        color: Math.random() < 0.5 ? '#84cc16' : '#bef264'
      });
      if (this.trailParticles.length > 12) this.trailParticles.shift();
    }
    for (const tp of this.trailParticles) {
      tp.alpha -= dt * 2.2;
    }

    // Limites do mapa
    if (this.x < 0 || this.x > map.width || this.y < 0 || this.y > map.height) {
      this.destroyed = true;
      return;
    }

    // ColisÃ£o com obstÃ¡culos sÃ³lidos
    for (const obs of map.obstacles) {
      if (
        this.x + this.radius > obs.x &&
        this.x - this.radius < obs.x + obs.w &&
        this.y + this.radius > obs.y &&
        this.y - this.radius < obs.y + obs.h
      ) {
        this.destroyed = true;
        return;
      }
    }

    // ColisÃ£o com jogadores
    for (const player of players) {
      const half = player.size / 2;
      const distX = Math.abs(this.x - player.x);
      const distY = Math.abs(this.y - player.y);
      if (distX < half + this.radius && distY < half + this.radius) {
        this.destroyed = true;
        onHitPlayer(player, this.damage, 'â˜¢ Barril Radioativo');
        return;
      }
    }
  }

  draw(ctx) {
    if (this.destroyed) return;

    // Rastro radioativo
    ctx.save();
    for (const tp of this.trailParticles) {
      if (tp.alpha <= 0) continue;
      ctx.fillStyle = tp.color;
      ctx.globalAlpha = tp.alpha;
      ctx.beginPath();
      ctx.arc(tp.x, tp.y, tp.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    ctx.save();
    ctx.translate(this.x, this.y);

    // Brilho tÃ³xico sob o barril
    ctx.beginPath();
    ctx.arc(0, 0, this.radius + 6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(132, 204, 22, 0.32)';
    ctx.fill();

    ctx.rotate(this.rotation);

    // Barril metÃ¡lico de lixo tÃ³xico
    ctx.fillStyle = '#365314';
    ctx.strokeStyle = '#84cc16';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.roundRect(-14, -14, 28, 28, 4);
    ctx.fill();
    ctx.stroke();

    // Ranhuras horizontais do barril
    ctx.strokeStyle = '#4d7c0f';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-14, -5);
    ctx.lineTo(14, -5);
    ctx.moveTo(-14, 5);
    ctx.lineTo(14, 5);
    ctx.stroke();

    // SÃ­mbolo de RadiaÃ§Ã£o Amarelo â˜¢ no centro
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(0, 0, 3.2, 0, Math.PI * 2);
    ctx.fill();

    for (let a = 0; a < 3; a++) {
      const angle = (a * Math.PI * 2) / 3 - Math.PI / 2;
      ctx.beginPath();
      ctx.arc(0, 0, 7.5, angle - 0.45, angle + 0.45);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }
}

class ToxicCanisterProjectile {
  constructor(x, y, targetX, targetY, speed = 310, damage = 10, angleOffset = 0) {
    this.x = x;
    this.y = y;
    this.radius = 11;
    this.speed = speed;
    this.damage = damage;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = 7.5;
    this.lifetime = 3.2;
    this.destroyed = false;
    this.isNeutralizable = true;
    this.neutralizeLabel = '🧪 FRASCO REBATIDO!';
    this.neutralizeColor = '#a3e635';

    const baseAngle = Math.atan2(targetY - y, targetX - x);
    const finalAngle = baseAngle + angleOffset;
    this.vx = Math.cos(finalAngle) * this.speed;
    this.vy = Math.sin(finalAngle) * this.speed;
  }

  update(dt, map, players, onHitPlayer) {
    if (this.destroyed) return;

    this.lifetime -= dt;
    if (this.lifetime <= 0) {
      this.destroyed = true;
      return;
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.rotation += this.rotationSpeed * dt;

    if (this.x < 0 || this.x > map.width || this.y < 0 || this.y > map.height) {
      this.destroyed = true;
      return;
    }

    for (const obs of map.obstacles) {
      if (
        this.x + this.radius > obs.x &&
        this.x - this.radius < obs.x + obs.w &&
        this.y + this.radius > obs.y &&
        this.y - this.radius < obs.y + obs.h
      ) {
        this.destroyed = true;
        return;
      }
    }

    for (const player of players) {
      const half = player.size / 2;
      const distX = Math.abs(this.x - player.x);
      const distY = Math.abs(this.y - player.y);
      if (distX < half + this.radius && distY < half + this.radius) {
        this.destroyed = true;
        onHitPlayer(player, this.damage, '🧪 Resíduo Tóxico');
        return;
      }
    }
  }

  draw(ctx) {
    if (this.destroyed) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Frasco quÃ­mico Ã¡cido
    ctx.fillStyle = 'rgba(163, 230, 53, 0.4)';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius + 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#65a30d';
    ctx.strokeStyle = '#bef264';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.roundRect(-8, -10, 16, 20, 4);
    ctx.fill();
    ctx.stroke();

    // Tampa de rolha do frasco
    ctx.fillStyle = '#eab308';
    ctx.fillRect(-4, -13, 8, 4);

    // Bolhas Ã¡cidas internas
    ctx.fillStyle = '#d9f99d';
    ctx.beginPath();
    ctx.arc(-2, 0, 2, 0, Math.PI * 2);
    ctx.arc(2, 4, 1.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

/**
 * ============================================================================
 * PROJÃ‰TEIS DO CHEFE (ESTÃGIO 3: O HUD CONTRA O JOGADOR)
 * ============================================================================
 */

class HostileHUDTimerProjectile {
  constructor(x, y, targetX, targetY, speed = 330, damage = 12) {
    this.x = x;
    this.y = y;
    this.radius = 20;
    this.speed = speed;
    this.damage = damage;
    this.lifetime = 3.6;
    this.destroyed = false;
    this.isNeutralizable = true;
    this.neutralizeLabel = 'â± TIMER REBATIDO!';
    this.neutralizeColor = '#facc15';
    this.pulse = 0;

    const dx = targetX - x;
    const dy = targetY - y;
    const dist = Math.hypot(dx, dy) || 1;
    this.vx = (dx / dist) * this.speed;
    this.vy = (dy / dist) * this.speed;
    this.angle = Math.atan2(dy, dx);
  }

  update(dt, map, players, onHitPlayer) {
    if (this.destroyed) return;

    this.lifetime -= dt;
    this.pulse += dt * 8;
    if (this.lifetime <= 0) {
      this.destroyed = true;
      return;
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    if (this.x < 0 || this.x > map.width || this.y < 0 || this.y > map.height) {
      this.destroyed = true;
      return;
    }

    for (const obs of map.obstacles) {
      if (
        this.x + this.radius > obs.x &&
        this.x - this.radius < obs.x + obs.w &&
        this.y + this.radius > obs.y &&
        this.y - this.radius < obs.y + obs.h
      ) {
        this.destroyed = true;
        return;
      }
    }

    for (const player of players) {
      const half = player.size / 2;
      const distX = Math.abs(this.x - player.x);
      const distY = Math.abs(this.y - player.y);
      if (distX < half + this.radius && distY < half + this.radius) {
        this.destroyed = true;
        onHitPlayer(player, this.damage, 'â± Timer Hostil do HUD');
        return;
      }
    }
  }

  draw(ctx) {
    if (this.destroyed) return;

    ctx.save();
    ctx.translate(this.x, this.y);

    const glowPulse = 0.5 + 0.5 * Math.sin(this.pulse);

    // Aura hologrÃ¡fica vermelha de glitch do HUD
    ctx.fillStyle = `rgba(239, 68, 68, ${0.25 + glowPulse * 0.25})`;
    ctx.beginPath();
    ctx.roundRect(-34, -18, 68, 36, 8);
    ctx.fill();

    // Caixa de Timer idÃªntica Ã  HUD real
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2.2;
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.roundRect(-30, -14, 60, 28, 6);
    ctx.fill();
    ctx.stroke();

    // RÃ³tulo TEMPO e DÃ­gitos
    ctx.shadowBlur = 0;
    ctx.font = 'bold 8px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f87171';
    ctx.fillText('TEMPO HUD', 0, -4);

    ctx.font = 'bold 12px Consolas, monospace';
    ctx.fillStyle = '#fef08a';
    ctx.fillText('03:00', 0, 9);

    ctx.restore();
  }
}

class HostileHUDScrapProjectile {
  constructor(x, y, targetX, targetY, speed = 300, damage = 11) {
    this.x = x;
    this.y = y;
    this.radius = 16;
    this.speed = speed;
    this.damage = damage;
    this.rotation = 0;
    this.rotationSpeed = 8.5;
    this.lifetime = 3.8;
    this.destroyed = false;
    this.isNeutralizable = true;
    this.neutralizeLabel = 'â™» SUCATA DEFLETIDA!';
    this.neutralizeColor = '#4ade80';

    const dx = targetX - x;
    const dy = targetY - y;
    const dist = Math.hypot(dx, dy) || 1;
    this.vx = (dx / dist) * this.speed;
    this.vy = (dy / dist) * this.speed;
  }

  update(dt, map, players, onHitPlayer) {
    if (this.destroyed) return;

    this.lifetime -= dt;
    this.rotation += this.rotationSpeed * dt;
    if (this.lifetime <= 0) {
      this.destroyed = true;
      return;
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    if (this.x < 0 || this.x > map.width || this.y < 0 || this.y > map.height) {
      this.destroyed = true;
      return;
    }

    for (const obs of map.obstacles) {
      if (
        this.x + this.radius > obs.x &&
        this.x - this.radius < obs.x + obs.w &&
        this.y + this.radius > obs.y &&
        this.y - this.radius < obs.y + obs.h
      ) {
        this.destroyed = true;
        return;
      }
    }

    for (const player of players) {
      const half = player.size / 2;
      const distX = Math.abs(this.x - player.x);
      const distY = Math.abs(this.y - player.y);
      if (distX < half + this.radius && distY < half + this.radius) {
        this.destroyed = true;
        onHitPlayer(player, this.damage, 'â™» Ãcone de Sucata do HUD');
        return;
      }
    }
  }

  draw(ctx) {
    if (this.destroyed) return;

    ctx.save();
    ctx.translate(this.x, this.y);

    // Anel externo hologrÃ¡fico de reciclagem
    ctx.beginPath();
    ctx.arc(0, 0, this.radius + 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(34, 197, 94, 0.28)';
    ctx.fill();

    ctx.rotate(this.rotation);

    // Ãcone de Reciclagem Verde do HUD girando
    ctx.font = '22px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#4ade80';
    ctx.shadowColor = '#4ade80';
    ctx.shadowBlur = 8;
    ctx.fillText('â™»', 0, 1);

    ctx.restore();
  }
}

class HostileHUDKeyProjectile {
  constructor(x, y, targetX, targetY, speed = 320, damage = 10, keyChar = 'E') {
    this.x = x;
    this.y = y;
    this.radius = 15;
    this.speed = speed;
    this.damage = damage;
    this.keyChar = keyChar;
    this.rotation = 0;
    this.rotationSpeed = 6.0;
    this.lifetime = 3.5;
    this.destroyed = false;
    this.isNeutralizable = true;
    this.neutralizeLabel = 'âŒ¨ TECLA REBATIDA!';
    this.neutralizeColor = '#38bdf8';

    const dx = targetX - x;
    const dy = targetY - y;
    const dist = Math.hypot(dx, dy) || 1;
    this.vx = (dx / dist) * this.speed;
    this.vy = (dy / dist) * this.speed;
  }

  update(dt, map, players, onHitPlayer) {
    if (this.destroyed) return;

    this.lifetime -= dt;
    this.rotation += this.rotationSpeed * dt;
    if (this.lifetime <= 0) {
      this.destroyed = true;
      return;
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    if (this.x < 0 || this.x > map.width || this.y < 0 || this.y > map.height) {
      this.destroyed = true;
      return;
    }

    for (const obs of map.obstacles) {
      if (
        this.x + this.radius > obs.x &&
        this.x - this.radius < obs.x + obs.w &&
        this.y + this.radius > obs.y &&
        this.y - this.radius < obs.y + obs.h
      ) {
        this.destroyed = true;
        return;
      }
    }

    for (const player of players) {
      const half = player.size / 2;
      const distX = Math.abs(this.x - player.x);
      const distY = Math.abs(this.y - player.y);
      if (distX < half + this.radius && distY < half + this.radius) {
        this.destroyed = true;
        onHitPlayer(player, this.damage, `âŒ¨ Tecla [${this.keyChar}] Hostil`);
        return;
      }
    }
  }

  draw(ctx) {
    if (this.destroyed) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Tecla <kbd> idÃªntica aos atalhos da interface
    ctx.fillStyle = '#f5dfb8';
    ctx.strokeStyle = '#8f5329';
    ctx.lineWidth = 2.0;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.roundRect(-12, -12, 24, 24, 4);
    ctx.fill();
    ctx.stroke();

    // Letra da tecla
    ctx.shadowBlur = 0;
    ctx.font = 'bold 12px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#1f1610';
    ctx.fillText(this.keyChar, 0, 1);

    ctx.restore();
  }
}

class HostileHUDCardProjectile {
  constructor(x, y, targetX, targetY, speed = 340, damage = 12) {
    this.x = x;
    this.y = y;
    this.radius = 18;
    this.speed = speed;
    this.damage = damage;
    this.rotation = 0;
    this.rotationSpeed = 9.0;
    this.lifetime = 3.6;
    this.destroyed = false;
    this.isNeutralizable = true;
    this.neutralizeLabel = '🛡️ CARD DEFLETIDO!';
    this.neutralizeColor = '#fb923c';

    const dx = targetX - x;
    const dy = targetY - y;
    const dist = Math.hypot(dx, dy) || 1;
    this.vx = (dx / dist) * this.speed;
    this.vy = (dy / dist) * this.speed;
  }

  update(dt, map, players, onHitPlayer) {
    if (this.destroyed) return;

    this.lifetime -= dt;
    this.rotation += this.rotationSpeed * dt;
    if (this.lifetime <= 0) {
      this.destroyed = true;
      return;
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    if (this.x < 0 || this.x > map.width || this.y < 0 || this.y > map.height) {
      this.destroyed = true;
      return;
    }

    for (const obs of map.obstacles) {
      if (
        this.x + this.radius > obs.x &&
        this.x - this.radius < obs.x + obs.w &&
        this.y + this.radius > obs.y &&
        this.y - this.radius < obs.y + obs.h
      ) {
        this.destroyed = true;
        return;
      }
    }

    for (const player of players) {
      const half = player.size / 2;
      const distX = Math.abs(this.x - player.x);
      const distY = Math.abs(this.y - player.y);
      if (distX < half + this.radius && distY < half + this.radius) {
        this.destroyed = true;
        onHitPlayer(player, this.damage, '🛡️ Card de HP Hostil');
        return;
      }
    }
  }

  draw(ctx) {
    if (this.destroyed) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Card de HP retangular afiado
    ctx.fillStyle = 'rgba(34, 28, 24, 0.95)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.0;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.roundRect(-22, -11, 44, 22, 4);
    ctx.fill();
    ctx.stroke();

    // Barra de HP interna vermelha/verde
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-18, 1, 36, 4);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(-18, 1, 24, 4);

    ctx.font = 'bold 7px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('P1 GLITCH', 0, -3);

    ctx.restore();
  }
}

/**
 * ============================================================================
 * CLASSE BASE DE INIMIGO (RATO)
 * ============================================================================
 */

class BaseEnemy {
  constructor(config) {
    this.id = config.id || `enemy_${Math.random().toString(36).substring(2, 8)}`;
    this.type = config.type || 'generic';
    this.name = config.name || 'Rato Inimigo';
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.radius = config.radius || 18;
    this.size = this.radius * 2;

    // Os ratos morrem exatamente com 3 hits (3 x 30 = 90 HP)
    this.maxHp = config.maxHp !== undefined ? config.maxHp : 90;
    this.hp = this.maxHp;

    this.speed = config.speed || 100;
    this.detectionRange = config.detectionRange || 400;

    this.facingX = 1;
    this.facingY = 0;
    this.walkCycle = Math.random() * 10;
    this.hitFlashTimer = 0;
    this.isDead = false;
    this.isDying = false;
    this.deathTimer = 0;
    this.deathDuration = 0.75;

    // Cooldown e estados de combate
    this.attackCooldown = config.attackCooldown || 2.5;
    this.currentCooldown = Math.random() * 1.0; // Deslocamento inicial para nÃ£o atacarem todos juntos
    this.windupTimer = 0;
    this.isAttacking = false;
  }

  takeDamage(amount, knockbackX = 0, knockbackY = 0, map = null) {
    if (this.isDead || this.isDying) return 0;
    this.hp = Math.max(0, this.hp - amount);
    this.hitFlashTimer = 0.22;

    // Leve recuo físico (knockback) respeitando colisões de cenário
    if (map && Array.isArray(map.obstacles) && typeof this._moveWithCollision === 'function') {
      this._moveWithCollision(1, knockbackX * 14, knockbackY * 14, map);
    } else {
      this.x += knockbackX * 14;
      this.y += knockbackY * 14;
    }

    if (this.hp <= 0) {
      if (!this.isBoss) {
        this.isDying = true;
        this.deathTimer = 0;
      } else {
        this.isDead = true;
      }
    }
    return this.hp;
  }

  findTargetPlayer(players) {
    if (!players || players.length === 0) return null;
    let closest = null;
    let minDist = Infinity;
    for (const p of players) {
      if (p.hp > 0) {
        const d = Math.hypot(p.x - this.x, p.y - this.y);
        if (d < minDist) {
          minDist = d;
          closest = p;
        }
      }
    }
    return { player: closest, distance: minDist };
  }

  _moveWithCollision(dt, vx, vy, map) {
    const half = this.radius;

    // Eixo X
    if (vx !== 0) {
      let nextX = this.x + vx * dt;
      nextX = Math.max(half, Math.min(map.width - half, nextX));
      const boxX = { x: nextX - half, y: this.y - half, w: this.size, h: this.size };
      let collideX = false;
      for (const obs of map.obstacles) {
        if (this._aabbOverlap(boxX, obs)) {
          collideX = true;
          break;
        }
      }
      if (!collideX) this.x = nextX;
    }

    // Eixo Y
    if (vy !== 0) {
      let nextY = this.y + vy * dt;
      nextY = Math.max(half, Math.min(map.height - half, nextY));
      const boxY = { x: this.x - half, y: nextY - half, w: this.size, h: this.size };
      let collideY = false;
      for (const obs of map.obstacles) {
        if (this._aabbOverlap(boxY, obs)) {
          collideY = true;
          break;
        }
      }
      if (!collideY) this.y = nextY;
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

  _updateFacing(dx, dy) {
    const len = Math.hypot(dx, dy);
    if (len > 0.01) {
      this.facingX = dx / len;
      this.facingY = dy / len;
    }
  }

  drawHealthBar(ctx, badgeLabel, badgeColor) {
    const barW = 34;
    const barH = 5;
    const topY = this.y - this.radius - 14;

    // Fundo da barra
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(this.x - barW / 2 - 1, topY - 1, barW + 2, barH + 2);

    // Vida restante
    const hpRatio = Math.max(0, this.hp / this.maxHp);
    ctx.fillStyle = hpRatio > 0.5 ? '#22c55e' : hpRatio > 0.25 ? '#eab308' : '#ef4444';
    ctx.fillRect(this.x - barW / 2, topY, barW * hpRatio, barH);

    // Borda da barra
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x - barW / 2 - 1, topY - 1, barW + 2, barH + 2);

    // Badge com nome / tipo do rato
    ctx.font = 'bold 8.5px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = badgeColor || '#cbd5e1';
    ctx.fillText(badgeLabel, this.x, topY - 4);
  }

  drawBaseRat(ctx, furColor, snoutColor, eyeColor, timeSeconds, isMoving) {
    const angle = Math.atan2(this.facingY, this.facingX);
    const pulseWalk = isMoving ? Math.sin(this.walkCycle * 6) * 3 : 0;
    const pawCycle = isMoving ? Math.sin(this.walkCycle * 6) * 4 : 0;

    ctx.save();
    ctx.translate(this.x, this.y);

    // Sombra no chÃ£o
    ctx.beginPath();
    ctx.ellipse(0, 4, this.radius * 0.95, this.radius * 0.55, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
    ctx.fill();

    // RotaÃ§Ã£o na direÃ§Ã£o do olhar
    ctx.rotate(angle);

    // Cauda longa animada do rato (atrÃ¡s do corpo)
    ctx.beginPath();
    const tailWiggle = Math.sin(timeSeconds * 7 + this.walkCycle) * 7;
    ctx.moveTo(-16, 0);
    ctx.bezierCurveTo(-24, tailWiggle * 0.5, -30, -tailWiggle, -38, tailWiggle * 0.8);
    ctx.strokeStyle = '#f472b6';
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Patinhas traseiras
    ctx.fillStyle = '#fda4af';
    ctx.beginPath();
    ctx.arc(-8, -12 + pawCycle, 3.5, 0, Math.PI * 2);
    ctx.arc(-8, 12 - pawCycle, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Patinhas dianteiras
    ctx.beginPath();
    ctx.arc(8, -11 - pawCycle, 3.2, 0, Math.PI * 2);
    ctx.arc(8, 11 + pawCycle, 3.2, 0, Math.PI * 2);
    ctx.fill();

    // Corpo oval de rato peludo
    ctx.fillStyle = this.hitFlashTimer > 0 ? '#ffffff' : furColor;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.0;

    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 12 + Math.abs(pulseWalk) * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Orelhas rosadas nas laterais da cabeÃ§a
    ctx.fillStyle = '#fda4af';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(4, -10, 4.5, 0, Math.PI * 2);
    ctx.arc(4, 10, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // CabeÃ§a/Focinho afilado apontando para a frente
    ctx.fillStyle = this.hitFlashTimer > 0 ? '#ffffff' : furColor;
    ctx.beginPath();
    ctx.moveTo(10, -7);
    ctx.lineTo(21, 0);
    ctx.lineTo(10, 7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Narizinho rosa
    ctx.fillStyle = snoutColor || '#f472b6';
    ctx.beginPath();
    ctx.arc(21, 0, 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Bigodes do rato
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(18, -2);
    ctx.lineTo(26, -7);
    ctx.moveTo(18, 2);
    ctx.lineTo(26, 7);
    ctx.stroke();

    // Olhos
    ctx.fillStyle = eyeColor || '#0f172a';
    ctx.beginPath();
    ctx.arc(12, -4.5, 2.2, 0, Math.PI * 2);
    ctx.arc(12, 4.5, 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

class CheeseThrowerRat extends BaseEnemy {
  constructor(config) {
    super({
      ...config,
      type: 'cheese_thrower',
      name: 'Rato Arremessador',
      radius: 17,
      maxHp: config.maxHp !== undefined ? config.maxHp : 90, // Morre com 3 hits
      speed: 85,
      detectionRange: 440,
      attackCooldown: 2.8
    });

    this.windupDuration = 0.42;
    this.targetPlayerRef = null;
  }

  update(dt, map, players, onSpawnProjectile, audio) {
    if (this.isDead) return;

    if (this.isDying) {
      this.deathTimer += dt;
      if (this.deathTimer >= this.deathDuration) {
        this.isDead = true;
      }
      return;
    }

    if (this.hitFlashTimer > 0) this.hitFlashTimer -= dt;
    if (this.currentCooldown > 0) this.currentCooldown -= dt;

    const targetInfo = this.findTargetPlayer(players);
    if (!targetInfo || !targetInfo.player) return;

    const { player, distance } = targetInfo;
    this.targetPlayerRef = player;

    // 1. Fase de PreparaÃ§Ã£o do Arremesso (Windup / Mirando)
    if (this.isAttacking) {
      this.windupTimer += dt;
      this._updateFacing(player.x - this.x, player.y - this.y);

      if (this.windupTimer >= this.windupDuration) {
        this.isAttacking = false;
        this.currentCooldown = this.attackCooldown + (Math.random() * 0.4 - 0.2);

        // LanÃ§a o projÃ©til de queijo
        if (onSpawnProjectile) {
          const spawnX = this.x + this.facingX * 18;
          const spawnY = this.y + this.facingY * 18;
          onSpawnProjectile(new CheeseProjectile(spawnX, spawnY, player.x, player.y, 290, 10));
        }

        if (audio) audio.playCheeseThrow();
      }
      return;
    }

    // 2. Comportamento TÃ¡tico: MantÃ©m distÃ¢ncia mÃ©dia e arremessa
    if (distance <= this.detectionRange) {
      this._updateFacing(player.x - this.x, player.y - this.y);

      // DistÃ¢ncia ideal de tiro: 170 a 340px
      let moveSpeed = 0;
      if (distance < 140) {
        // Muito perto: recua devagar
        moveSpeed = -this.speed * 0.65;
      } else if (distance > 300) {
        // Longe: aproxima-se para alcance de tiro
        moveSpeed = this.speed;
      }

      if (moveSpeed !== 0) {
        this.walkCycle += dt * 8;
        this._moveWithCollision(dt, this.facingX * moveSpeed, this.facingY * moveSpeed, map);
      }

      // Dispara o arremesso se estiver pronto e em linha de visÃ£o razoÃ¡vel
      if (this.currentCooldown <= 0 && distance >= 60 && distance <= this.detectionRange) {
        this.isAttacking = true;
        this.windupTimer = 0;
      }
    }
  }

  draw(ctx, timeSeconds) {
    if (this.isDead) return;

    let animName = 'idle';
    let frameIndex = 0;

    if (this.isDying) {
      animName = 'death';
      frameIndex = Math.min(7, Math.floor((this.deathTimer / this.deathDuration) * 8));
    } else if (this.hitFlashTimer > 0) {
      animName = 'hurt';
      frameIndex = Math.floor(Math.min(3, (1 - (this.hitFlashTimer / 0.22)) * 4));
    } else if (this.isAttacking) {
      const progress = Math.min(0.999, Math.max(0, this.windupTimer / this.windupDuration));
      if (progress < 0.45) {
        animName = 'prepare'; // 04_Segurar_Queijo
        frameIndex = Math.floor((progress / 0.45) * 4);
      } else {
        animName = 'attack'; // 05_Arremessar_Queijo
        frameIndex = Math.floor(((progress - 0.45) / 0.55) * 4);
      }
    } else if (this.walkCycle > 0) {
      animName = 'walk'; // 02_Andar
      frameIndex = Math.floor(this.walkCycle);
    } else {
      animName = 'idle'; // 01_Idle_Sentado
      frameIndex = Math.floor(timeSeconds * 6);
    }

    const overrideFlipX = this.facingX < 0;

    // Linha de mira quando preparando o arremesso de queijo
    if (this.isAttacking && !this.isDying) {
      ctx.save();
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.facingX * 80, this.y + this.facingY * 80);
      ctx.stroke();
      ctx.restore();
    }

    if (window.SpriteManager) {
      window.SpriteManager.draw(
        ctx,
        'rato1',
        animName,
        frameIndex,
        this.x,
        this.y + this.radius + 6,
        {
          overrideFlipX,
          scale: 0.23, // Escala menor que as personagens principais (~54px vs ~78px)
          hitFlash: this.hitFlashTimer > 0
        }
      );
    }

    // Barra de Vida e Tag
    if (!this.isDying) {
      this.drawHealthBar(ctx, '🧀 ARREMESSADOR', '#fde047');
    }
  }
}

/**
 * ============================================================================
 * RATO 2: RATO CUSPIDOR (Ranged / Toxic Spit)
 * ============================================================================
 */

class SpitterRat extends BaseEnemy {
  constructor(config) {
    super({
      ...config,
      type: 'spitter',
      name: 'Rato Cuspidor',
      radius: 18,
      maxHp: config.maxHp !== undefined ? config.maxHp : 90, // Morre com 3 hits
      speed: 75,
      detectionRange: 460,
      attackCooldown: 3.3
    });

    this.chargeDuration = 0.52;
    this.targetPlayerRef = null;
  }

  update(dt, map, players, onSpawnProjectile, audio) {
    if (this.isDead) return;

    if (this.isDying) {
      this.deathTimer += dt;
      if (this.deathTimer >= this.deathDuration) {
        this.isDead = true;
      }
      return;
    }

    if (this.hitFlashTimer > 0) this.hitFlashTimer -= dt;
    if (this.currentCooldown > 0) this.currentCooldown -= dt;

    const targetInfo = this.findTargetPlayer(players);
    if (!targetInfo || !targetInfo.player) return;

    const { player, distance } = targetInfo;
    this.targetPlayerRef = player;

    // 1. Fase de Preparo / Inflar Veneno (Telegraphing)
    if (this.isAttacking) {
      this.windupTimer += dt;
      this._updateFacing(player.x - this.x, player.y - this.y);

      if (this.windupTimer >= this.chargeDuration) {
        this.isAttacking = false;
        this.currentCooldown = this.attackCooldown + (Math.random() * 0.5 - 0.25);

        // Cospe o projÃ©til tÃ³xico
        if (onSpawnProjectile) {
          const spawnX = this.x + this.facingX * 22;
          const spawnY = this.y + this.facingY * 22;
          onSpawnProjectile(new SpitProjectile(spawnX, spawnY, player.x, player.y, 330, 12));
        }

        if (audio) audio.playSpit();
      }
      return;
    }

    // 2. Posicionamento e Disparo de Cuspe
    if (distance <= this.detectionRange) {
      this._updateFacing(player.x - this.x, player.y - this.y);

      let moveSpeed = 0;
      if (distance < 130) {
        moveSpeed = -this.speed * 0.6;
      } else if (distance > 280) {
        moveSpeed = this.speed;
      }

      if (moveSpeed !== 0) {
        this.walkCycle += dt * 7.5;
        this._moveWithCollision(dt, this.facingX * moveSpeed, this.facingY * moveSpeed, map);
      }

      if (this.currentCooldown <= 0 && distance <= this.detectionRange) {
        this.isAttacking = true;
        this.windupTimer = 0;
      }
    }
  }

  draw(ctx, timeSeconds) {
    if (this.isDead) return;

    let animName = 'idle';
    let frameIndex = 0;

    if (this.isDying) {
      animName = 'death';
      frameIndex = Math.min(6, Math.floor((this.deathTimer / this.deathDuration) * 7));
    } else if (this.hitFlashTimer > 0) {
      animName = 'hurt';
      frameIndex = Math.floor(Math.min(3, (1 - (this.hitFlashTimer / 0.22)) * 4));
    } else if (this.isAttacking) {
      animName = 'attack'; // 04_Ataque_Cuspe (5 frames)
      const progress = Math.min(0.999, Math.max(0, this.windupTimer / this.chargeDuration));
      frameIndex = Math.floor(progress * 5);
    } else if (this.walkCycle > 0) {
      animName = 'walk'; // 02_Andar
      frameIndex = Math.floor(this.walkCycle);
    } else {
      animName = 'idle'; // 01_Idle_Sentado
      frameIndex = Math.floor(timeSeconds * 6);
    }

    const overrideFlipX = this.facingX < 0;

    // Efeito visual sutil de brilho tóxico durante preparo do cuspe
    if (this.isAttacking && !this.isDying) {
      const chargePct = Math.min(1.0, this.windupTimer / this.chargeDuration);
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.strokeStyle = `rgba(132, 204, 22, ${0.4 + chargePct * 0.5})`;
      ctx.fillStyle = `rgba(132, 204, 22, ${0.14 * chargePct})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 4 + chargePct * 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    if (window.SpriteManager) {
      window.SpriteManager.draw(
        ctx,
        'rato2',
        animName,
        frameIndex,
        this.x,
        this.y + this.radius + 6,
        {
          overrideFlipX,
          scale: 0.23, // Escala menor que as personagens principais (~55px vs ~78px)
          hitFlash: this.hitFlashTimer > 0
        }
      );
    }

    // Barra de Vida e Tag
    if (!this.isDying) {
      this.drawHealthBar(ctx, '🧪 CUSPIDOR', '#a3e635');
    }
  }
}

/**
 * ============================================================================
 * RATO 3: RATO ARRANHADOR (Melee / Fast Chaser)
 * ============================================================================
 */

class ScratcherRat extends BaseEnemy {
  constructor(config) {
    super({
      ...config,
      type: 'scratcher',
      name: 'Rato Arranhador',
      radius: 17,
      maxHp: config.maxHp !== undefined ? config.maxHp : 90, // Morre com 3 hits
      speed: 165, // Bastante veloz para fechar distância!
      detectionRange: 390,
      attackCooldown: 1.9
    });

    this.meleeRange = 52;
    this.scratchDuration = 0.28;
    this.scratchAngle = 0;
    this.hasHitPlayerThisAttack = false;
  }

  update(dt, map, players, onSpawnProjectile, audio, onHitPlayer) {
    if (this.isDead) return;

    if (this.isDying) {
      this.deathTimer += dt;
      if (this.deathTimer >= this.deathDuration) {
        this.isDead = true;
      }
      return;
    }

    if (this.hitFlashTimer > 0) this.hitFlashTimer -= dt;
    if (this.currentCooldown > 0) this.currentCooldown -= dt;

    const targetInfo = this.findTargetPlayer(players);
    if (!targetInfo || !targetInfo.player) return;

    const { player, distance } = targetInfo;

    // 1. ExecuÃ§Ã£o do Golpe de ArranhÃ£o
    if (this.isAttacking) {
      this.windupTimer += dt;

      // Janela de impacto: entre 0.08s e 0.22s do golpe
      if (!this.hasHitPlayerThisAttack && this.windupTimer >= 0.08 && this.windupTimer <= 0.22) {
        // Checagem de colisÃ£o da Ã¡rea de corte (Cone/Arco frontal)
        const hitDistance = Math.hypot(player.x - this.x, player.y - this.y);
        if (hitDistance <= this.meleeRange + player.size / 2) {
          const angleToTarget = Math.atan2(player.y - this.y, player.x - this.x);
          const diff = Math.atan2(Math.sin(angleToTarget - this.scratchAngle), Math.cos(angleToTarget - this.scratchAngle));

          // Ângulo de abertura do corte frontal (~100 graus)
          if (Math.abs(diff) <= (Math.PI * 0.55)) {
            this.hasHitPlayerThisAttack = true;
            if (onHitPlayer) {
              onHitPlayer(player, 14, '⚔️ Arranhão Brutal');
            }
          }
        }
      }

      if (this.windupTimer >= this.scratchDuration) {
        this.isAttacking = false;
        this.currentCooldown = this.attackCooldown + (Math.random() * 0.3 - 0.15);
      }
      return;
    }

    // 2. PerseguiÃ§Ã£o Agressiva do Jogador
    if (distance <= this.detectionRange) {
      this._updateFacing(player.x - this.x, player.y - this.y);

      if (distance > this.meleeRange * 0.75) {
        this.walkCycle += dt * 11;
        this._moveWithCollision(dt, this.facingX * this.speed, this.facingY * this.speed, map);
      }

      // Ao alcanÃ§ar distÃ¢ncia de contato corpo a corpo, executa o arranhÃ£o
      if (distance <= this.meleeRange && this.currentCooldown <= 0) {
        this.isAttacking = true;
        this.windupTimer = 0;
        this.scratchAngle = Math.atan2(player.y - this.y, player.x - this.x);
        this.hasHitPlayerThisAttack = false;

        if (audio) audio.playScratch();
      }
    }
  }

  draw(ctx, timeSeconds) {
    if (this.isDead) return;

    let animName = 'idle';
    let frameIndex = 0;

    if (this.isDying) {
      animName = 'death';
      frameIndex = Math.min(6, Math.floor((this.deathTimer / this.deathDuration) * 7));
    } else if (this.hitFlashTimer > 0) {
      animName = 'hurt';
      frameIndex = Math.floor(Math.min(3, (1 - (this.hitFlashTimer / 0.22)) * 4));
    } else if (this.isAttacking) {
      animName = 'attack'; // 04_Ataque_Garras (8 frames)
      const progress = Math.min(0.999, Math.max(0, this.windupTimer / this.scratchDuration));
      frameIndex = Math.floor(progress * 8);
    } else if (this.walkCycle > 0) {
      animName = 'run'; // 03_Correr (8 frames)
      frameIndex = Math.floor(this.walkCycle);
    } else {
      animName = 'idle'; // 01_Idle_Sentado (6 frames)
      frameIndex = Math.floor(timeSeconds * 6);
    }

    const overrideFlipX = this.facingX < 0;

    // Animação visual do corte de arranhão (3 marcas de garras curvadas com brilho)
    if (this.isAttacking && !this.isDying) {
      const progress = Math.min(1.0, this.windupTimer / this.scratchDuration);
      const alpha = progress < 0.6 ? 1.0 : (1.0 - progress) / 0.4;

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.scratchAngle);

      ctx.strokeStyle = `rgba(239, 68, 68, ${alpha})`;
      ctx.lineWidth = 2.8;
      ctx.lineCap = 'round';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 8;

      const slashDist = 28 + progress * 14;

      // 3 garras cortantes curvadas
      for (let offset = -10; offset <= 10; offset += 10) {
        ctx.beginPath();
        ctx.moveTo(slashDist - 10, offset - 12);
        ctx.quadraticCurveTo(slashDist + 6, offset, slashDist - 10, offset + 12);
        ctx.stroke();
      }

      ctx.restore();
    }

    if (window.SpriteManager) {
      window.SpriteManager.draw(
        ctx,
        'rato3',
        animName,
        frameIndex,
        this.x,
        this.y + this.radius + 6,
        {
          overrideFlipX,
          scale: 0.23, // Escala menor que as personagens principais (~55px vs ~78px)
          hitFlash: this.hitFlashTimer > 0
        }
      );
    }

    // Barra de Vida e Tag
    if (!this.isDying) {
      this.drawHealthBar(ctx, '⚔️ ARRANHADOR', '#f87171');
    }
  }
}

/**
 * ============================================================================
 * GERENCIADOR DE INIMIGOS (EnemyManager)
 * ============================================================================
 */

/**
 * ============================================================================
 * RATO LACAIO (MINION DO ESTÁGIO 2)
 * Inimigo auxiliar de apoio invocado em ondas pelo Chefe no Estágio 2
 * ============================================================================
 */

class MinionRat extends BaseEnemy {
  constructor(config) {
    super({
      ...config,
      type: 'minion_rat',
      name: 'Rato Lacaio',
      radius: 14,
      maxHp: 20, // 1 golpe de arma ou punho o elimina
      speed: 155,
      detectionRange: 600,
      attackCooldown: 1.5
    });
    this.isMinion = true;
    this.meleeRange = 38;
    this.hasHitPlayerThisAttack = false;
    this.scratchDuration = 0.22;
  }

  update(dt, map, players, onSpawnProjectile, audio, onHitPlayer) {
    if (this.isDead) return;

    if (this.isDying) {
      this.deathTimer += dt;
      if (this.deathTimer >= this.deathDuration) {
        this.isDead = true;
      }
      return;
    }

    if (this.hitFlashTimer > 0) this.hitFlashTimer -= dt;
    if (this.currentCooldown > 0) this.currentCooldown -= dt;

    const targetInfo = this.findTargetPlayer(players);
    if (!targetInfo || !targetInfo.player) return;

    const { player, distance } = targetInfo;

    if (this.isAttacking) {
      this.windupTimer += dt;
      if (!this.hasHitPlayerThisAttack && this.windupTimer >= 0.08) {
        if (distance <= this.meleeRange + player.size / 2) {
          this.hasHitPlayerThisAttack = true;
          if (onHitPlayer) onHitPlayer(player, 8, '🐀 Mordida de Lacaio');
        }
      }
      if (this.windupTimer >= this.scratchDuration) {
        this.isAttacking = false;
        this.currentCooldown = this.attackCooldown;
      }
      return;
    }

    if (distance <= this.detectionRange) {
      this._updateFacing(player.x - this.x, player.y - this.y);
      this.walkCycle += dt * 10;
      this._moveWithCollision(dt, this.facingX * this.speed, this.facingY * this.speed, map);

      if (distance <= this.meleeRange && this.currentCooldown <= 0) {
        this.isAttacking = true;
        this.windupTimer = 0;
        this.hasHitPlayerThisAttack = false;
        if (audio) audio.playScratch();
      }
    }
  }

  draw(ctx, timeSeconds) {
    if (this.isDead) return;

    let animName = 'idle';
    let frameIndex = 0;

    if (this.isDying) {
      animName = 'death';
      frameIndex = Math.min(6, Math.floor((this.deathTimer / this.deathDuration) * 7));
    } else if (this.hitFlashTimer > 0) {
      animName = 'hurt';
      frameIndex = Math.floor(Math.min(3, (1 - (this.hitFlashTimer / 0.22)) * 4));
    } else if (this.isAttacking) {
      animName = 'attack';
      frameIndex = Math.floor(Math.min(0.999, this.windupTimer / this.scratchDuration) * 8);
    } else if (this.walkCycle > 0) {
      animName = 'run';
      frameIndex = Math.floor(this.walkCycle);
    } else {
      animName = 'idle';
      frameIndex = Math.floor(timeSeconds * 6);
    }

    const overrideFlipX = this.facingX < 0;

    if (window.SpriteManager) {
      window.SpriteManager.draw(
        ctx,
        'rato3',
        animName,
        frameIndex,
        this.x,
        this.y + this.radius + 4,
        {
          overrideFlipX,
          scale: 0.16, // Lacaio pequeno invocado pelo chefe
          hitFlash: this.hitFlashTimer > 0
        }
      );
    }

    if (!this.isDying) {
      this.drawHealthBar(ctx, '🐀 LACAIO', '#fca5a5');
    }
  }
}

/**
 * ============================================================================
 * CHEFE DA FASE 3: REI RATO RADIOATIVO (BossAlpha)
 * Um único chefe principal na Fase 3 com TRÊS ESTÁGIOS CONSECUTIVOS DE COMBATE:
 * - Estágio 1 (HP 600 - 401): Lixo Radioativo (Barris tóxicos e frascos químicos)
 * - Estágio 2 (HP 400 - 201): Exército de Ratos (Ondas controladas de lacaios)
 * - Estágio 3 (HP 200 - 0): O HUD contra o Jogador (Timer, Ícone ♻, Keys e Cards defletíveis!)
 * ============================================================================
 */

class BossAlpha extends BaseEnemy {
  constructor(config) {
    super({
      ...config,
      type: 'boss_alpha',
      name: 'Rei Rato Radioativo',
      radius: 44,
      maxHp: 600,
      speed: 105,
      detectionRange: 1200,
      attackCooldown: 2.0
    });

    this.isBoss = true;
    this.stage = 1; // 1, 2 ou 3
    this.stageThreshold1 = 400; // Estágio 2 quando HP <= 400
    this.stageThreshold2 = 200; // Estágio 3 quando HP <= 200

    this.isTransitioning = false;
    this.transitionTimer = 0;
    this.transitionDuration = 1.6;
    this._transitionEffectsTriggered = false;

    this.attackPattern = 0;
    this.minionSpawnTimer = 3.0;
    this.minionSpawnInterval = 4.8;
    this.maxActiveMinions = 4; // Controle estrito de lacaios simultâneos

    this.isDefeated = false;
    this.defeatAnimTimer = 0;
    this.defeatDuration = 1.6;
    this.onVictoryTriggered = false;

    this.attackAnimTimer = 0;
    this.attackAnimDuration = 0.75;
    this.currentAttackType = 'throw'; // 'throw' ou 'attack'
    this.hasHitMeleeThisAttack = false;

    // Limites de movimentação na câmara do reator (Fase 3)
    this.arena = {
      minX: 720,
      maxX: 1780,
      minY: 480,
      maxY: 1650
    };
  }

  takeDamage(amount, knockbackX = 0, knockbackY = 0) {
    if (this.isDead || this.isDefeated) return 0;
    if (this.isTransitioning) return this.hp;

    this.hp = Math.max(0, this.hp - amount);
    this.hitFlashTimer = 0.22;

    this.x += knockbackX * 5;
    this.y += knockbackY * 5;

    // Transição para Estágio 2 (Exército de Ratos)
    if (this.stage === 1 && this.hp <= this.stageThreshold1) {
      this.hp = this.stageThreshold1;
      this.startStageTransition(2);
      return this.hp;
    }

    // Transição para Estágio 3 (O HUD contra o Jogador)
    if (this.stage === 2 && this.hp <= this.stageThreshold2) {
      this.hp = this.stageThreshold2;
      this.startStageTransition(3);
      return this.hp;
    }

    // Derrota final no Estágio 3
    if (this.stage === 3 && this.hp <= 0) {
      this.hp = 0;
      this.isDefeated = true;
      this.isDead = true;
      this.defeatAnimTimer = 0;
      this.defeatDuration = 1.6;
    }

    return this.hp;
  }

  startStageTransition(newStage) {
    this.stage = newStage;
    this.isTransitioning = true;
    this.transitionTimer = this.transitionDuration;
    this._transitionEffectsTriggered = false;
    this.isAttacking = false;
    this.currentCooldown = 1.5;
  }

  update(dt, map, players, onSpawnProjectile, audio, onSpawnMinion, game, onHitPlayer) {
    if (this.isDefeated) {
      this.defeatAnimTimer += dt;
      return;
    }

    if (this.hitFlashTimer > 0) this.hitFlashTimer -= dt;
    if (this.currentCooldown > 0) this.currentCooldown -= dt;

    if (this.attackAnimTimer > 0) {
      this.attackAnimTimer -= dt;

      // Janela de impacto do martelo corpo a corpo
      if (this.currentAttackType === 'attack' && !this.hasHitMeleeThisAttack && this.attackAnimTimer <= this.attackAnimDuration * 0.45) {
        this.hasHitMeleeThisAttack = true;
        if (onHitPlayer && Array.isArray(players)) {
          players.forEach((p) => {
            const dist = Math.hypot(p.x - this.x, p.y - this.y);
            if (dist <= 95) {
              onHitPlayer(p, 18, '🔨 Golpe de Martelo');
            }
          });
        }
        if (game && game.camera) {
          game.camera.triggerShake(0.35, 8);
        }
      }
    }

    const targetInfo = this.findTargetPlayer(players);
    if (!targetInfo || !targetInfo.player) return;
    const { player, distance } = targetInfo;

    // 1. Atualização da Transição de Estágio
    if (this.isTransitioning) {
      this.transitionTimer -= dt;
      this._updateFacing(player.x - this.x, player.y - this.y);

      if (!this._transitionEffectsTriggered && this.transitionTimer > this.transitionDuration - 0.1) {
        this._transitionEffectsTriggered = true;
        if (audio) {
          audio.playBossRoar();
          audio.playStageChange();
        }
        if (game && game.camera) {
          game.camera.triggerShake(0.35, 7);
        }
        if (game && game.floatingTexts) {
          const bannerText = this.stage === 2
            ? '⚠️ ESTÁGIO 2: EXÉRCITO DE RATOS!'
            : '⚡ ESTÁGIO 3: O HUD CONTRA VOCÊ!';
          const bannerColor = this.stage === 2 ? '#ef4444' : '#06b6d4';
          game.floatingTexts.push(
            new window.FloatingText(this.x, this.y - 70, bannerText, bannerColor, 2.0)
          );
        }

        // Glitch sutil na interface no Estágio 3
        if (this.stage === 3) {
          const hudLayer = document.getElementById('hud-layer');
          if (hudLayer) {
            hudLayer.classList.add('hud-glitch-active');
            setTimeout(() => hudLayer.classList.remove('hud-glitch-active'), 800);
          }
          if (audio) audio.playGlitchBuzz();
        }
      }

      if (this.transitionTimer <= 0) {
        this.isTransitioning = false;
        this._transitionEffectsTriggered = false;
      }
      return;
    }

    // 2. Movimentação e Posicionamento na Arena
    this._updateFacing(player.x - this.x, player.y - this.y);

    let moveSpeed = 0;
    if (distance < 190) {
      moveSpeed = -this.speed * 0.75;
    } else if (distance > 380) {
      moveSpeed = this.speed;
    } else {
      moveSpeed = Math.sin(game ? game.elapsedTime * 2 : 0) * (this.speed * 0.45);
    }

    if (moveSpeed !== 0) {
      this.walkCycle += dt * 8;
      this._moveWithCollision(dt, this.facingX * moveSpeed, this.facingY * moveSpeed, map);
    }

    this.x = Math.max(this.arena.minX, Math.min(this.arena.maxX, this.x));
    this.y = Math.max(this.arena.minY, Math.min(this.arena.maxY, this.y));

    // 3. Decisão de Ataque: Se o jogador estiver muito próximo (< 95px), desfere golpe de martelo
    if (distance <= 95 && this.currentCooldown <= 0) {
      this.currentAttackType = 'attack';
      this.attackAnimTimer = 0.85;
      this.attackAnimDuration = 0.85;
      this.hasHitMeleeThisAttack = false;
      this.currentCooldown = 2.2;
      if (audio) audio.playScratch();
      return;
    }

    // 4. Ataques de Longo Alcance Conforme o Estágio Atual
    if (this.stage === 1) {
      // ESTÁGIO 1: LIXO RADIOATIVO
      if (this.currentCooldown <= 0) {
        this.attackPattern = (this.attackPattern + 1) % 3;
        this.currentAttackType = 'throw';
        this.attackAnimTimer = 0.75;
        this.attackAnimDuration = 0.75;

        if (this.attackPattern === 0 || this.attackPattern === 2) {
          // Barril Radioativo
          if (onSpawnProjectile) {
            const spawnX = this.x + this.facingX * 36;
            const spawnY = this.y + this.facingY * 36;
            onSpawnProjectile(new RadioactiveBarrelProjectile(spawnX, spawnY, player.x, player.y, 300, 14));
          }
          if (audio) audio.playRadioactiveThrow();
          this.currentCooldown = 2.0;
        } else {
          // Salva de Frascos Ácidos
          if (onSpawnProjectile) {
            const spawnX = this.x + this.facingX * 34;
            const spawnY = this.y + this.facingY * 34;
            onSpawnProjectile(new ToxicCanisterProjectile(spawnX, spawnY, player.x, player.y, 310, 10, -0.26));
            onSpawnProjectile(new ToxicCanisterProjectile(spawnX, spawnY, player.x, player.y, 310, 10, 0));
            onSpawnProjectile(new ToxicCanisterProjectile(spawnX, spawnY, player.x, player.y, 310, 10, 0.26));
          }
          if (audio) audio.playSpit();
          this.currentCooldown = 2.4;
        }
      }
    } else if (this.stage === 2) {
      // ESTÁGIO 2: EXÉRCITO DE RATOS
      this.minionSpawnTimer -= dt;

      if (this.minionSpawnTimer <= 0) {
        this.minionSpawnTimer = this.minionSpawnInterval;

        const activeMinions = game && game.enemyManager
          ? game.enemyManager.enemies.filter((e) => e.isMinion && !e.isDead).length
          : 0;

        if (activeMinions < this.maxActiveMinions && onSpawnMinion) {
          const spawnCount = Math.min(2, this.maxActiveMinions - activeMinions);
          for (let i = 0; i < spawnCount; i++) {
            const offsetAngle = (i === 0 ? -1 : 1) * 0.6;
            const spawnX = this.x + Math.cos(Math.atan2(this.facingY, this.facingX) + offsetAngle) * 60;
            const spawnY = this.y + Math.sin(Math.atan2(this.facingY, this.facingX) + offsetAngle) * 60;
            onSpawnMinion(
              new MinionRat({
                id: `minion_${Date.now()}_${i}`,
                x: spawnX,
                y: spawnY
              })
            );
          }
          if (audio) audio.playBossRoar();
          if (game && game.floatingTexts) {
            game.floatingTexts.push(
              new window.FloatingText(this.x, this.y - 65, '🐀 CLAMOR DA HORDA!', '#ef4444', 1.2)
            );
          }
        }
      }

      if (this.currentCooldown <= 0) {
        this.currentAttackType = 'throw';
        this.attackAnimTimer = 0.75;
        this.attackAnimDuration = 0.75;

        if (onSpawnProjectile) {
          const spawnX = this.x + this.facingX * 36;
          const spawnY = this.y + this.facingY * 36;
          onSpawnProjectile(new ToxicCanisterProjectile(spawnX, spawnY, player.x, player.y, 320, 10, 0));
        }
        if (audio) audio.playSpit();
        this.currentCooldown = 2.2;
      }
    } else if (this.stage === 3) {
      // ESTÁGIO 3: O HUD CONTRA O JOGADOR (Timer, Ícone ♻, Keys e Cards defletíveis!)
      if (this.currentCooldown <= 0) {
        this.attackPattern = (this.attackPattern + 1) % 4;
        this.currentAttackType = 'throw';
        this.attackAnimTimer = 0.75;
        this.attackAnimDuration = 0.75;

        const spawnX = this.x + this.facingX * 38;
        const spawnY = this.y + this.facingY * 38;

        if (this.attackPattern === 0) {
          // Timer Hostil do HUD
          if (onSpawnProjectile) {
            onSpawnProjectile(new HostileHUDTimerProjectile(spawnX, spawnY, player.x, player.y, 340, 12));
          }
          if (audio) audio.playGlitchBuzz();
          this.currentCooldown = 2.0;
        } else if (this.attackPattern === 1) {
          // Ícones Holográficos ♻
          if (onSpawnProjectile) {
            onSpawnProjectile(new HostileHUDScrapProjectile(spawnX, spawnY, player.x, player.y, 310, 10));
          }
          if (audio) audio.playRadioactiveThrow();
          this.currentCooldown = 1.9;
        } else if (this.attackPattern === 2) {
          // Teclas Kbd Hostis
          if (onSpawnProjectile) {
            onSpawnProjectile(new HostileHUDKeyProjectile(spawnX, spawnY - 14, player.x, player.y, 320, 10, 'E'));
            onSpawnProjectile(new HostileHUDKeyProjectile(spawnX, spawnY + 14, player.x, player.y, 320, 10, 'R'));
          }
          if (audio) audio.playGlitchBuzz();
          this.currentCooldown = 2.2;
        } else {
          // Ataque Combinado (Timer Hostil + Card de HP Lâmina)
          if (onSpawnProjectile) {
            onSpawnProjectile(new HostileHUDTimerProjectile(spawnX, spawnY, player.x, player.y, 330, 12));
            onSpawnProjectile(new HostileHUDCardProjectile(spawnX, spawnY, player.x + 30, player.y - 30, 350, 12));
          }
          if (audio) audio.playGlitchBuzz();
          this.currentCooldown = 2.6;
        }
      }
    }
  }

  draw(ctx, timeSeconds) {
    let animName = 'idle';
    let frameIndex = 0;

    if (this.isDefeated) {
      animName = 'death';
      frameIndex = Math.min(8, Math.floor((this.defeatAnimTimer / this.defeatDuration) * 9));
    } else if (this.isTransitioning) {
      animName = 'flex';
      frameIndex = Math.min(7, Math.floor(((this.transitionDuration - this.transitionTimer) / this.transitionDuration) * 8));
    } else if (this.hitFlashTimer > 0) {
      animName = 'ready_stance';
      frameIndex = Math.min(3, Math.floor((1 - (this.hitFlashTimer / 0.22)) * 4));
    } else if (this.attackAnimTimer > 0) {
      animName = this.currentAttackType === 'attack' ? 'attack' : 'throw';
      const totalFrames = animName === 'attack' ? 9 : 10;
      const progress = Math.min(0.999, Math.max(0, 1 - (this.attackAnimTimer / this.attackAnimDuration)));
      frameIndex = Math.floor(progress * totalFrames);
    } else if (this.walkCycle > 0) {
      if (this.facingY < -0.55) {
        animName = 'walk_up';
        frameIndex = Math.floor(this.walkCycle) % 7;
      } else {
        animName = 'walk';
        frameIndex = Math.floor(this.walkCycle) % 10;
      }
    } else {
      animName = 'idle';
      frameIndex = Math.floor(timeSeconds * 8) % 10;
    }

    const overrideFlipX = this.facingX < 0;

    ctx.save();

    // 1. Aura subterrânea/radioativa do estágio atual
    const auraColor = this.stage === 1
      ? 'rgba(132, 204, 22, 0.28)'
      : this.stage === 2
        ? 'rgba(239, 68, 68, 0.32)'
        : 'rgba(6, 182, 212, 0.35)';

    const pulseAura = 1 + Math.sin(timeSeconds * 6) * 0.08;
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + 16, this.radius * 1.5 * pulseAura, this.radius * 0.85 * pulseAura, 0, 0, Math.PI * 2);
    ctx.fillStyle = auraColor;
    ctx.fill();

    // 2. Anel de energia expansiva durante transição de estágio
    if (this.isTransitioning) {
      const ringRadius = (1 - this.transitionTimer / this.transitionDuration) * 110;
      ctx.strokeStyle = this.stage === 2 ? '#ef4444' : '#06b6d4';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(this.x, this.y, ringRadius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 3. Efeito de impacto do martelo no chão durante ataque corpo a corpo
    if (this.attackAnimTimer > 0 && this.currentAttackType === 'attack' && this.hasHitMeleeThisAttack) {
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.65)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(this.x + this.facingX * 36, this.y + this.facingY * 36, 32, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 4. Renderização do Sprite do Chefão com SpriteManager (escala 0.58)
    if (window.SpriteManager) {
      window.SpriteManager.draw(
        ctx,
        'boss',
        animName,
        frameIndex,
        this.x,
        this.y + this.radius + 8,
        {
          overrideFlipX,
          scale: 0.58, // Escala MAIOR que as duas personagens principais (~110px vs ~78px)
          hitFlash: this.hitFlashTimer > 0
        }
      );
    }

    ctx.restore();

    // 5. Barra de vida e badge de estágio do Chefe
    if (!this.isDefeated) {
      const badgeColor = this.stage === 1 ? '#bef264' : this.stage === 2 ? '#fca5a5' : '#67e8f9';
      const stageLabel = this.stage === 1
        ? '👑 REI RATO • ESTÁGIO 1'
        : this.stage === 2
          ? '⚠️ REI RATO • ESTÁGIO 2'
          : '⚡ REI RATO • ESTÁGIO 3';
      this.drawHealthBar(ctx, stageLabel, badgeColor);
    }
  }
}

class EnemyManager {
  constructor(game) {
    this.game = game;
    this.audio = new EnemyAudio();

    this.enemies = [];
    this.projectiles = [];
    this.deathParticles = [];
    this.boss = null;
  }

  /**
   * Instancia os inimigos definidos nas propriedades do mapa
   */
  spawnEnemiesForMap(map) {
    this.reset();
    if (!map || map.isSafeRoom || !Array.isArray(map.enemySpawns)) {
      return;
    }

    map.enemySpawns.forEach((def, index) => {
      let enemy = null;
      const cfg = {
        id: def.id || `${map.id}_enemy_${index}`,
        x: def.x,
        y: def.y
      };

      if (def.type === 'cheese_thrower') {
        enemy = new CheeseThrowerRat(cfg);
      } else if (def.type === 'spitter') {
        enemy = new SpitterRat(cfg);
      } else if (def.type === 'scratcher') {
        enemy = new ScratcherRat(cfg);
      } else if (def.type === 'boss_alpha') {
        // O Chefão Final deve aparecer estritamente apenas no último mapa (Fase 3 / Combate Final)
        const isFinalStage = map.id === 'map3' || map.stageNumber === 3 || map.isBossArena;
        if (isFinalStage) {
          enemy = new BossAlpha(cfg);
          this.boss = enemy;
        }
      }

      if (enemy) {
        this.enemies.push(enemy);
      }
    });

    console.log(`👾 [ENEMY MANAGER] Carregados ${this.enemies.length} inimigo(s) para o mapa "${map.name}".`
    );
  }

  reset() {
    this.enemies = [];
    this.projectiles = [];
    this.deathParticles = [];
    this.boss = null;
  }

  clearAllMinionsAndProjectiles() {
    this.projectiles = [];
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      if (this.enemies[i].isMinion) {
        this.spawnDefeatParticles(this.enemies[i].x, this.enemies[i].y);
        this.enemies.splice(i, 1);
      }
    }
  }

  /**
   * AtualizaÃ§Ã£o frame-a-frame de todos os inimigos e projÃ©teis
   */
  update(dt, players, map) {
    if (!map || map.isSafeRoom) return;

    if (this.boss && this.boss.isDefeated && !this.boss.onVictoryTriggered) {
      this.clearAllMinionsAndProjectiles();
      if (this.boss.defeatAnimTimer >= (this.boss.defeatDuration || 1.4)) {
        this.boss.onVictoryTriggered = true;
        this.audio.playVictoryFanfare();
        if (this.game && typeof this.game.handleBossDefeated === 'function') {
          this.game.handleBossDefeated();
        }
      }
    }

    // Callback ao acertar dano no jogador
    const onHitPlayer = (player, damage, sourceLabel) => {
      try {
        if (!player || player.hp <= 0) return;
        if (this.boss && this.boss.isDefeated) return;

        // No modo Singleplayer, a personagem secundária é uma companheira invulnerável:
        // os ataques dos inimigos ocorrem normalmente, mas não causam dano, nem perda de vida ou Game Over
        if (this.game && this.game.gameMode === 'singleplayer' && player.isCompanion) {
          player.hitFlashTimer = 0.14; // feedback visual sutil sem perda de vida
          return;
        }

        const prevHp = player.hp;
        const newHp = player.takeDamage(damage);
        if (newHp === prevHp) {
          // Jogador estava em i-frames (invulnerabilidade temporária pós-dano)
          return;
        }

        if (this.game && this.game.camera) {
          this.game.camera.triggerShake(0.18, 5);
        }

        if (this.game && this.game.floatingTexts) {
          this.game.floatingTexts.push(
            new window.FloatingText(player.x, player.y - 34, `-${damage} HP [${sourceLabel}]`, '#ef4444', 0.95)
          );
        }

        if (this.audio) {
          this.audio.playEnemyHit();
        }
        if (this.game && this.game.ui) {
          this.game.ui.updateHUD();
        }

        // Checagem de derrota (Game Over)
        if (this.game && typeof this.game.handleGameOver === 'function') {
          if (this.game.gameMode === 'singleplayer') {
            const active = this.game.players[this.game.activePlayerIndex];
            if (active && active.hp <= 0) {
              this.game.handleGameOver('DEFEATED');
            }
          } else {
            if (this.game.p1 && this.game.p2 && this.game.p1.hp <= 0 && this.game.p2.hp <= 0) {
              this.game.handleGameOver('DEFEATED');
            }
          }
        }
      } catch (err) {
        console.error('⚠️ [ERRO AO APLICAR DANO NO JOGADOR]', err);
      }
    };

    // Callback para geraÃ§Ã£o de novos projÃ©teis
    const onSpawnProjectile = (proj) => {
      this.projectiles.push(proj);
    };

    // 1. Atualiza Inimigos
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      if (enemy.isDead && !enemy.isBoss) {
        this.spawnDefeatParticles(enemy.x, enemy.y);
        this.enemies.splice(i, 1);
        continue;
      }

      if (enemy.type === 'boss_alpha') {
        enemy.update(dt, map, players, onSpawnProjectile, this.audio, (minion) => this.enemies.push(minion), this.game, onHitPlayer);
      } else if (enemy.type === 'scratcher' || enemy.type === 'minion_rat') {
        enemy.update(dt, map, players, onSpawnProjectile, this.audio, onHitPlayer);
      } else {
        enemy.update(dt, map, players, onSpawnProjectile, this.audio);
      }
    }

    // 2. Atualiza ProjÃ©teis
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.update(dt, map, players, onHitPlayer);
      if (p.destroyed) {
        this.projectiles.splice(i, 1);
      }
    }

    // 3. Atualiza PartÃ­culas de Morte
    for (let i = this.deathParticles.length - 1; i >= 0; i--) {
      const part = this.deathParticles[i];
      part.x += part.vx * dt;
      part.y += part.vy * dt;
      part.life -= dt;
      if (part.life <= 0) {
        this.deathParticles.splice(i, 1);
      }
    }
  }

  /**
   * Resolução de Ataque do Jogador contra os Inimigos:
   * Verifica se qualquer inimigo vivo está dentro do cone de ataque mirado do jogador
   */
  handlePlayerAttack(attacker) {
    if (!attacker) return false;

    let hitCount = 0;
    const damage = typeof attacker.getAttackDamage === 'function' ? attacker.getAttackDamage() : 30;

    // Neutralização de projéteis hostis (HUD Timer, Ícone Recicla, Barril, Keys, Cards)
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      if (p.isNeutralizable && !p.destroyed) {
        if (attacker.isPointInAttackCone(p.x, p.y, p.radius || 16)) {
          p.destroyed = true;
          hitCount++;
          this.audio.playDeflect();
          this.spawnDeflectParticles(p.x, p.y, p.neutralizeColor || '#38bdf8');
          if (this.game && this.game.camera) this.game.camera.triggerShake(0.12, 3);
          if (this.game && this.game.floatingTexts) {
            this.game.floatingTexts.push(
              new window.FloatingText(p.x, p.y - 20, p.neutralizeLabel || '🛡️ REBATIDO!', '#fde047', 0.8)
            );
          }
        }
      }
    }

    const currentMap = this.game ? this.game.currentMap : null;

    for (const enemy of this.enemies) {
      if (enemy.isDead && !enemy.isBoss) continue;

      // Impede registro duplo no mesmo swing
      if (attacker.hitTargetsInSwing && attacker.hitTargetsInSwing.has(enemy.id)) {
        continue;
      }

      if (attacker.isPointInAttackCone(enemy.x, enemy.y, enemy.radius)) {
        hitCount++;
        if (attacker.hitTargetsInSwing) {
          attacker.hitTargetsInSwing.add(enemy.id);
        }

        const dx = enemy.x - attacker.x;
        const dy = enemy.y - attacker.y;
        const dist = Math.hypot(dx, dy) || 1;
        const knockX = dx / dist;
        const knockY = dy / dist;

        const remainingHp = enemy.takeDamage(damage, knockX, knockY, currentMap);
        this.audio.playEnemyHit();

        // Texto flutuante de dano no rato
        if (this.game && this.game.floatingTexts) {
          const dmgLabel = Number.isInteger(damage) ? `${damage}` : damage.toFixed(1);
          this.game.floatingTexts.push(
            new window.FloatingText(enemy.x, enemy.y - 30, `-${dmgLabel} HP`, '#f87171', 0.8)
          );
        }

        // Se foi derrotado pelo golpe:
        if (remainingHp <= 0) {
          this.game.stageEnemiesDefeated = (this.game.stageEnemiesDefeated || 0) + 1;
          this.audio.playEnemyDefeat();

          if (this.game && this.game.floatingTexts) {
            this.game.floatingTexts.push(
              new window.FloatingText(enemy.x, enemy.y - 48, `💀 +1 ABATE [${enemy.name}]`, '#bef264', 1.4)
            );
          }

          console.log(`⚔️ [INIMIGO DERROTADO] "${enemy.name}" abatido! Total de abates na fase: ${this.game.stageEnemiesDefeated}`);
        }
      }
    }

    return hitCount > 0;
  }

  spawnDeflectParticles(x, y, color = '#38bdf8') {
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 60 + Math.random() * 120;
      this.deathParticles.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        color,
        radius: 2 + Math.random() * 3,
        life: 0.25 + Math.random() * 0.2,
        maxLife: 0.45
      });
    }
  }

  spawnDefeatParticles(x, y) {
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 40 + Math.random() * 90;
      this.deathParticles.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        color: Math.random() < 0.5 ? '#94a3b8' : '#e2e8f0',
        radius: 2 + Math.random() * 3,
        life: 0.35 + Math.random() * 0.25,
        maxLife: 0.5
      });
    }
  }

  render(ctx, elapsedTime) {
    // 1. Partículas
    for (const part of this.deathParticles) {
      const alpha = Math.max(0, part.life / part.maxLife);
      ctx.fillStyle = part.color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(part.x, part.y, part.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // 2. Inimigos
    for (const enemy of this.enemies) {
      enemy.draw(ctx, elapsedTime);
    }

    // 3. Projéteis
    for (const p of this.projectiles) {
      p.draw(ctx);
    }
  }
}

window.EnemyManager = EnemyManager;
window.CheeseThrowerRat = CheeseThrowerRat;
window.SpitterRat = SpitterRat;
window.ScratcherRat = ScratcherRat;
window.MinionRat = MinionRat;
window.BossAlpha = BossAlpha;
window.CheeseProjectile = CheeseProjectile;
window.SpitProjectile = SpitProjectile;
window.RadioactiveBarrelProjectile = RadioactiveBarrelProjectile;
window.ToxicCanisterProjectile = ToxicCanisterProjectile;
window.HostileHUDTimerProjectile = HostileHUDTimerProjectile;
window.HostileHUDScrapProjectile = HostileHUDScrapProjectile;
window.HostileHUDKeyProjectile = HostileHUDKeyProjectile;
window.HostileHUDCardProjectile = HostileHUDCardProjectile;
