/**
 * js/water.js
 * Sistema de Água Subindo (Filtro e Mecânica de Inundação para a Primeira Fase - Mapa 1):
 * - Filtro aquático no Canvas com gradiente semi-transparente, ondas senoidais animadas e bolhas.
 * - Sobe progressivamente a partir da base da tela conforme o cronômetro da fase diminui.
 * - Ao zerar o tempo (00:00), a água sobe rapidamente cobrindo 100% da tela (surge).
 * - Dispara Game Over automático após submergir completamente a expedição.
 * - Efeitos sonoros sintetizados via Web Audio API (respeitando window.isMuted).
 */

class WaterAudio {
  constructor() {
    this.ctx = null;
    this.lastBubbleTime = 0;
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

  playBubbleSound() {
    if (window.isMuted) return;
    this._initContext();
    if (!this.ctx) return;

    const nowTime = performance.now();
    if (nowTime - this.lastBubbleTime < 350) return; // Evita sobreposição excessiva
    this.lastBubbleTime = nowTime;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const startFreq = 280 + Math.random() * 220;
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 2.1, now + 0.08);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  }

  playSurgeSound() {
    if (window.isMuted) return;
    this._initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const duration = 1.4;
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(150, now);
      filter.frequency.exponentialRampToValueAtTime(1800, now + duration * 0.8);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(0.24, now + duration * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + duration);
    } catch (e) {}
  }
}

class WaterSystem {
  constructor(game) {
    this.game = game;
    this.audio = new WaterAudio();

    this.active = false;
    this.time = 0;

    // Altura da água em pixels na tela (a partir do fundo)
    this.waterHeight = 0;
    this.targetWaterHeight = 0;
    this.baseWaterHeight = 28; // Linha de água inicial visível na base
    this.normalMaxRatio = 0.76; // Na contagem normal do timer vai até 76% da tela

    // Mecânica de Surge (subida rápida até 100% ao zerar o timer)
    this.isSurging = false;
    this.surgeTimer = 0;
    this.surgeDuration = 2.2; // Duração da animação de inundação fatal e afogamento
    this.surgeStartHeight = 0;
    this.surgeFinished = false;
    this.surgeCallback = null;

    // Partículas de bolhas
    this.bubbles = [];
    this.maxBubbles = 36;
    this.bubbleSpawnTimer = 0;

    this.initBubbles();
  }

  initBubbles() {
    this.bubbles = [];
    for (let i = 0; i < this.maxBubbles; i++) {
      this.bubbles.push(this.createBubble(true));
    }
  }

  createBubble(randomY = false) {
    const w = this.game.canvas ? this.game.canvas.width : window.innerWidth;
    const h = this.game.canvas ? this.game.canvas.height : window.innerHeight;
    const currentH = Math.max(30, this.waterHeight);
    const surfaceY = h - currentH;

    return {
      x: Math.random() * w,
      y: randomY ? surfaceY + Math.random() * currentH : h + Math.random() * 20,
      radius: 2 + Math.random() * 4,
      speed: 35 + Math.random() * 65,
      wobbleSpeed: 2 + Math.random() * 3,
      wobbleAmp: 4 + Math.random() * 8,
      wobblePhase: Math.random() * Math.PI * 2,
      alpha: 0.35 + Math.random() * 0.45
    };
  }

  activate() {
    this.active = true;
    this.reset();
  }

  deactivate() {
    this.active = false;
    this.waterHeight = 0;
    this.targetWaterHeight = 0;
    this.isSurging = false;
    this.surgeTimer = 0;
    this.surgeFinished = false;
    this.surgeCallback = null;
    this.bubbles = [];
  }

  reset() {
    this.isSurging = false;
    this.surgeTimer = 0;
    this.surgeFinished = false;
    this.surgeCallback = null;
    this.waterHeight = this.active ? this.baseWaterHeight : 0;
    this.targetWaterHeight = this.active ? this.baseWaterHeight : 0;
    if (this.active) {
      this.initBubbles();
    } else {
      this.bubbles = [];
    }
  }

  /**
   * Dispara a subida total da água ("subir toda dela") e executa o callback ao atingir o topo
   */
  triggerSurge(onComplete) {
    if (this.isSurging || this.surgeFinished) return;
    this.isSurging = true;
    this.surgeTimer = 0;
    this.surgeStartHeight = this.waterHeight;
    this.surgeFinished = false;
    this.surgeCallback = onComplete;

    // Efeito sonoro da inundação
    this.audio.playSurgeSound();

    // Tremor inicial na câmera
    if (this.game.camera) {
      this.game.camera.triggerShake(1.2, 6);
    }
  }

  update(dt, stageTimeRemaining, stageDuration, isStageWithWater) {
    if (!isStageWithWater) {
      if (this.active) this.deactivate();
      return;
    }

    if (!this.active) {
      this.activate();
    }

    this.time += dt;
    const canvasH = this.game.canvas ? this.game.canvas.height : window.innerHeight;

    // 1. Atualização do Surge (Subida Total ao zerar o tempo)
    if (this.isSurging) {
      this.surgeTimer += dt;
      const progress = Math.min(1.0, this.surgeTimer / this.surgeDuration);

      // Curva quadrática para subida acelerada da maré fatal
      const ease = progress * progress * (3 - 2 * progress); // smoothstep
      const targetFull = canvasH * 1.06; // Ultrapassa levemente o topo para cobrir tudo
      this.waterHeight = this.surgeStartHeight + (targetFull - this.surgeStartHeight) * ease;

      // Tremor contínuo na câmera conforme a água invade
      if (this.game.camera && Math.random() < 0.4) {
        this.game.camera.triggerShake(0.12, 4);
      }

      // Adiciona bolhas extras em fluxo ascendente violento
      if (this.bubbles.length < 75 && Math.random() < 0.8) {
        const bubble = this.createBubble(false);
        bubble.speed *= 2.2;
        bubble.radius = 3 + Math.random() * 6;
        this.bubbles.push(bubble);
      }

      if (progress >= 1.0 && !this.surgeFinished) {
        this.surgeFinished = true;
        if (typeof this.surgeCallback === 'function') {
          this.surgeCallback();
        }
      }
    } else {
      // 2. No mapa com arte real, a água física é o canal/lago do próprio cenário.
      // Mantemos waterHeight em 0 durante o tempo normal para exibir o mapa limpo e visível.
      this.targetWaterHeight = 0;
      this.waterHeight = 0;

      // Reprodução de som de alerta d'água quando o cronômetro estiver nos últimos 20 segundos
      if (stageTimeRemaining < 20 && Math.random() < dt * 0.8) {
        this.audio.playBubbleSound();
      }
    }

    // 3. Atualização das Bolhas
    const currentSurfaceY = canvasH - this.waterHeight;
    for (let i = 0; i < this.bubbles.length; i++) {
      const b = this.bubbles[i];
      b.y -= b.speed * dt;
      b.x += Math.sin(this.time * b.wobbleSpeed + b.wobblePhase) * 0.6;

      // Se a bolha atingir a superfície da água, ressurge no fundo
      if (b.y <= currentSurfaceY + this.getWaveOffset(b.x, 0)) {
        if (this.isSurging) {
          b.y = canvasH + Math.random() * 30;
          b.x = Math.random() * (this.game.canvas ? this.game.canvas.width : window.innerWidth);
        } else {
          // No modo normal, ressurge no fundo submerso
          b.y = canvasH + Math.random() * 15;
          b.x = Math.random() * (this.game.canvas ? this.game.canvas.width : window.innerWidth);
        }
      }
    }
  }

  /**
   * Cálculo da oscilação de ondas senoidais
   */
  getWaveOffset(x, layerOffset = 0) {
    const waveFreq1 = 0.013;
    const waveFreq2 = 0.028;
    const waveSpeed = this.time * 2.6;

    return (
      Math.sin(x * waveFreq1 + waveSpeed + layerOffset) * 7.5 +
      Math.cos(x * waveFreq2 - waveSpeed * 0.7 + layerOffset * 1.5) * 4.2 +
      Math.sin(x * 0.006 + this.time * 1.1) * 3
    );
  }

  render(ctx, viewW, viewH) {
    if (!this.active || this.waterHeight <= 0) return;

    const surfaceY = Math.max(-10, viewH - this.waterHeight);
    const isColorblind = Boolean(window.colorblindMode);

    ctx.save();

    // 1. Gradiente Aquático Vertical
    const grad = ctx.createLinearGradient(0, surfaceY, 0, viewH);
    if (isColorblind) {
      // Cores de alto contraste para acessibilidade
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.60)');
      grad.addColorStop(0.3, 'rgba(14, 116, 144, 0.72)');
      grad.addColorStop(0.8, 'rgba(3, 105, 161, 0.84)');
      grad.addColorStop(1.0, 'rgba(7, 89, 133, 0.94)');
    } else {
      // Cores vivas oceânicas / ciano
      grad.addColorStop(0, 'rgba(6, 182, 212, 0.46)');   // Superfície aqua/ciano
      grad.addColorStop(0.18, 'rgba(14, 116, 144, 0.58)'); // Transição turquesa
      grad.addColorStop(0.65, 'rgba(12, 74, 110, 0.72)'); // Azul oceânico profundo
      grad.addColorStop(1.0, 'rgba(8, 47, 73, 0.88)');    // Profundezas escuras
    }

    // 2. Traçado da Superfície Ondulada e Preenchimento da Massa d'Água
    ctx.beginPath();
    ctx.moveTo(0, viewH);
    ctx.lineTo(0, surfaceY + this.getWaveOffset(0, 0));

    const step = 14;
    for (let x = step; x <= viewW + step; x += step) {
      const wy = surfaceY + this.getWaveOffset(x, 0);
      ctx.lineTo(x, wy);
    }
    ctx.lineTo(viewW, viewH);
    ctx.closePath();

    ctx.fillStyle = grad;
    ctx.fill();

    // 3. Faixas Submersas de Refração de Luz (Cáusticas leves)
    if (!isColorblind && this.waterHeight > 60) {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      const bandCount = 6;
      for (let i = 0; i < bandCount; i++) {
        const bandX = ((this.time * 28 + i * 290) % (viewW + 220)) - 100;
        ctx.beginPath();
        ctx.moveTo(bandX, surfaceY);
        ctx.bezierCurveTo(
          bandX + 35 + Math.sin(this.time * 1.5 + i) * 15,
          surfaceY + this.waterHeight * 0.4,
          bandX - 25 + Math.cos(this.time * 1.2 + i) * 18,
          surfaceY + this.waterHeight * 0.75,
          bandX + 15,
          viewH
        );
        ctx.lineTo(bandX + 50, viewH);
        ctx.bezierCurveTo(
          bandX + 10,
          surfaceY + this.waterHeight * 0.75,
          bandX + 70,
          surfaceY + this.waterHeight * 0.4,
          bandX + 35,
          surfaceY
        );
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    // 4. Crista Principal de Espuma / Borda da Onda
    ctx.beginPath();
    for (let x = 0; x <= viewW; x += 8) {
      const wy = surfaceY + this.getWaveOffset(x, 0);
      if (x === 0) ctx.moveTo(x, wy);
      else ctx.lineTo(x, wy);
    }
    ctx.strokeStyle = isColorblind ? '#f8fafc' : 'rgba(224, 247, 250, 0.90)';
    ctx.lineWidth = isColorblind ? 4 : 3.2;
    ctx.shadowColor = 'rgba(56, 189, 248, 0.85)';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 5. Segunda Crista Translúcida de Relevo (Profundidade)
    ctx.beginPath();
    for (let x = 0; x <= viewW; x += 10) {
      const wy2 = surfaceY + 4 + this.getWaveOffset(x, 1.4);
      if (x === 0) ctx.moveTo(x, wy2);
      else ctx.lineTo(x, wy2);
    }
    ctx.strokeStyle = 'rgba(125, 211, 252, 0.42)';
    ctx.lineWidth = 2.0;
    ctx.stroke();

    // 6. Bolhas Ascendentes na Região Submersa
    for (let i = 0; i < this.bubbles.length; i++) {
      const b = this.bubbles[i];
      if (b.y > surfaceY - 5 && b.y < viewH + 20) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186, 230, 253, ${b.alpha * 0.35})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(255, 255, 255, ${b.alpha * 0.85})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Ponto de brilho especular na bolha
        ctx.beginPath();
        ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.3, Math.max(0.8, b.radius * 0.28), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
      }
    }

    // 7. Vinheta de Alerta quando a água estiver alta (> 60% da tela)
    const waterRatio = this.waterHeight / viewH;
    if (waterRatio > 0.60 && !this.isSurging) {
      const alertIntensity = Math.min(0.35, (waterRatio - 0.60) * 1.5) * (0.8 + 0.2 * Math.sin(this.time * 6));
      ctx.fillStyle = `rgba(239, 68, 68, ${alertIntensity})`;
      ctx.fillRect(0, 0, viewW, 8); // Barra fina de perigo no topo
    }

    // 8. Inundação Total durante o Surge (submersão 100%)
    if (this.isSurging) {
      const surgeAlpha = Math.min(0.92, (this.surgeTimer / this.surgeDuration) * 0.95);
      ctx.fillStyle = `rgba(3, 24, 46, ${surgeAlpha})`;
      ctx.fillRect(0, 0, viewW, viewH);

      // Vinheta de profundidade
      const radGrad = ctx.createRadialGradient(
        viewW / 2, viewH / 2, viewW * 0.1,
        viewW / 2, viewH / 2, viewW * 0.75
      );
      radGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      radGrad.addColorStop(1, `rgba(1, 14, 28, ${surgeAlpha * 0.85})`);
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, viewW, viewH);
    }

    ctx.restore();
  }
}

window.WaterSystem = WaterSystem;

