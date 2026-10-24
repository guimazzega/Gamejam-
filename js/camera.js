/**
 * js/camera.js
 * Câmera 2D Top-Down com suporte a Zoom (visão próxima do jogador), interpolação
 * suave (Lerp), suporte a Singleplayer (foco no personagem ativo) e Multiplayer Local
 * (ponto médio entre P1 e P2 + garantia de enquadramento dentro do Viewport visível),
 * respeitando os limites do mapa.
 */

window.Camera2D = class Camera2D {
  constructor(viewportWidth, viewportHeight) {
    this.x = 0;
    this.y = 0;
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.focusX = 0;
    this.focusY = 0;
    this.lerpSpeed = window.GameConfig.CAMERA_LERP || 7.5;
    this.shakeTimer = 0;
    this.shakeIntensity = 0;

    // Fator de zoom da câmera (visão próxima do personagem, padrão 1.7x)
    this.zoom = 1.7;
    this.targetZoom = 1.7;
  }

  resize(width, height) {
    this.viewportWidth = width;
    this.viewportHeight = height;
  }

  setZoom(zoomFactor) {
    this.zoom = Math.max(0.75, Math.min(3.0, zoomFactor));
    this.targetZoom = this.zoom;
  }

  getVisibleWidth() {
    return this.viewportWidth / this.zoom;
  }

  getVisibleHeight() {
    return this.viewportHeight / this.zoom;
  }

  triggerShake(duration = 0.18, intensity = 5) {
    this.shakeTimer = duration;
    this.shakeIntensity = intensity;
  }

  /**
   * Posiciona a câmera instantaneamente no alvo (usado ao trocar de fase)
   */
  snapToTarget(targetX, targetY, map) {
    if (map && map.cameraZoom) {
      this.zoom = map.cameraZoom;
      this.targetZoom = map.cameraZoom;
    }
    this.focusX = targetX;
    this.focusY = targetY;
    const clamped = this._computeClampedOrigin(targetX, targetY, map);
    this.x = clamped.x;
    this.y = clamped.y;
  }

  /**
   * Atualiza a posição da câmera suavemente a cada frame.
   * No Multiplayer Local, garante que o atraso do Lerp nunca deixe um jogador
   * escapar da borda visível da câmera quando ambos caminham.
   */
  update(dt, targetX, targetY, map, multiplayerPlayers = null) {
    this.focusX = targetX;
    this.focusY = targetY;

    // Suaviza zoom se houver interpolação
    if (Math.abs(this.targetZoom - this.zoom) > 0.001) {
      this.zoom += (this.targetZoom - this.zoom) * (1 - Math.exp(-6 * dt));
    }

    const desired = this._computeClampedOrigin(targetX, targetY, map);

    // Interpolação exponencial independente de framerate
    const t = 1 - Math.exp(-this.lerpSpeed * dt);
    this.x += (desired.x - this.x) * t;
    this.y += (desired.y - this.y) * t;

    // Se estiver em Multiplayer Local, garante que a janela visível no mundo
    // acompanhe imediatamente os jogadores caso estejam encostados nas bordas
    const visW = this.getVisibleWidth();
    const visH = this.getVisibleHeight();

    if (multiplayerPlayers && multiplayerPlayers.length === 2) {
      const [p1, p2] = multiplayerPlayers;
      const pad = (window.GameConfig.PLAYER_SIZE || 40) / 2 + 8;

      if (map.width > visW) {
        const minPX = Math.min(p1.x, p2.x) - pad;
        const maxPX = Math.max(p1.x, p2.x) + pad;
        if (this.x > minPX) this.x = minPX;
        if (this.x + visW < maxPX) this.x = maxPX - visW;
        this.x = Math.max(0, Math.min(map.width - visW, this.x));
      } else {
        this.x = desired.x;
      }

      if (map.height > visH) {
        const minPY = Math.min(p1.y, p2.y) - pad;
        const maxPY = Math.max(p1.y, p2.y) + pad;
        if (this.y > minPY) this.y = minPY;
        if (this.y + visH < maxPY) this.y = maxPY - visH;
        this.y = Math.max(0, Math.min(map.height - visH, this.y));
      } else {
        this.y = desired.y;
      }
    }

    if (this.shakeTimer > 0) {
      this.shakeTimer = Math.max(0, this.shakeTimer - dt);
    }
  }

  /**
   * Retorna os limites visíveis atuais no mundo (World Viewport Bounds)
   */
  getViewportBounds(map) {
    const visW = this.getVisibleWidth();
    const visH = this.getVisibleHeight();
    const minX = map ? Math.max(0, this.x) : this.x;
    const minY = map ? Math.max(0, this.y) : this.y;
    const maxX = map ? Math.min(map.width, this.x + visW) : this.x + visW;
    const maxY = map ? Math.min(map.height, this.y + visH) : this.y + visH;
    return { minX, maxX, minY, maxY };
  }

  /**
   * Calcula a origem (canto superior esquerdo no mundo) da câmera respeitando os limites do mapa.
   * Centraliza se o mapa for menor que o viewport visível.
   */
  _computeClampedOrigin(targetX, targetY, map) {
    const visW = this.getVisibleWidth();
    const visH = this.getVisibleHeight();

    let desiredX = targetX - visW / 2;
    let desiredY = targetY - visH / 2;

    if (map.width <= visW) {
      desiredX = (map.width - visW) / 2;
    } else {
      desiredX = Math.max(0, Math.min(map.width - visW, desiredX));
    }

    if (map.height <= visH) {
      desiredY = (map.height - visH) / 2;
    } else {
      desiredY = Math.max(0, Math.min(map.height - visH, desiredY));
    }

    return { x: desiredX, y: desiredY };
  }

  /**
   * Aplica a matriz de escala e translação ao contexto 2D do Canvas
   */
  applyTransform(ctx) {
    let shakeX = 0;
    let shakeY = 0;
    if (this.shakeTimer > 0) {
      shakeX = (Math.random() * 2 - 1) * this.shakeIntensity;
      shakeY = (Math.random() * 2 - 1) * this.shakeIntensity;
    }

    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-Math.round(this.x + shakeX), -Math.round(this.y + shakeY));
  }

  getRenderOffset() {
    let shakeX = 0;
    let shakeY = 0;
    if (this.shakeTimer > 0) {
      shakeX = (Math.random() * 2 - 1) * this.shakeIntensity;
      shakeY = (Math.random() * 2 - 1) * this.shakeIntensity;
    }
    return {
      offsetX: -Math.round(this.x + shakeX),
      offsetY: -Math.round(this.y + shakeY)
    };
  }

  screenToWorld(screenX, screenY) {
    return {
      x: this.x + screenX / this.zoom,
      y: this.y + screenY / this.zoom
    };
  }

  worldToScreen(worldX, worldY) {
    return {
      x: (worldX - this.x) * this.zoom,
      y: (worldY - this.y) * this.zoom
    };
  }
};

