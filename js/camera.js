/**
 * js/camera.js
 * Câmera 2D Top-Down com interpolação suave (Lerp), suporte a Singleplayer
 * (foco no personagem ativo) e Multiplayer Local (ponto médio entre P1 e P2),
 * respeitando rigorosamente os limites (boundaries) do mapa.
 */

window.Camera2D = class Camera2D {
  constructor(viewportWidth, viewportHeight) {
    this.x = 0;
    this.y = 0;
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.focusX = 0;
    this.focusY = 0;
    this.lerpSpeed = window.GameConfig.CAMERA_LERP;
    this.shakeTimer = 0;
    this.shakeIntensity = 0;
  }

  resize(width, height) {
    this.viewportWidth = width;
    this.viewportHeight = height;
  }

  triggerShake(duration = 0.18, intensity = 5) {
    this.shakeTimer = duration;
    this.shakeIntensity = intensity;
  }

  /**
   * Posiciona a câmera instantaneamente no alvo (usado ao trocar de mapa)
   */
  snapToTarget(targetX, targetY, map) {
    this.focusX = targetX;
    this.focusY = targetY;
    const clamped = this._computeClampedOrigin(targetX, targetY, map);
    this.x = clamped.x;
    this.y = clamped.y;
  }

  /**
   * Atualiza a posição da câmera suavemente a cada frame
   */
  update(dt, targetX, targetY, map) {
    this.focusX = targetX;
    this.focusY = targetY;

    const desired = this._computeClampedOrigin(targetX, targetY, map);

    // Interpolação exponencial independente de framerate
    const t = 1 - Math.exp(-this.lerpSpeed * dt);
    this.x += (desired.x - this.x) * t;
    this.y += (desired.y - this.y) * t;

    if (this.shakeTimer > 0) {
      this.shakeTimer = Math.max(0, this.shakeTimer - dt);
    }
  }

  /**
   * Calcula a origem (canto superior esquerdo) da câmera respeitando os limites do mapa.
   * Caso o mapa seja menor que a tela (ex: Safe Room da Van em monitores FullHD),
   * centraliza o mapa na tela.
   */
  _computeClampedOrigin(targetX, targetY, map) {
    let desiredX = targetX - this.viewportWidth / 2;
    let desiredY = targetY - this.viewportHeight / 2;

    if (map.width <= this.viewportWidth) {
      desiredX = (map.width - this.viewportWidth) / 2;
    } else {
      desiredX = Math.max(0, Math.min(map.width - this.viewportWidth, desiredX));
    }

    if (map.height <= this.viewportHeight) {
      desiredY = (map.height - this.viewportHeight) / 2;
    } else {
      desiredY = Math.max(0, Math.min(map.height - this.viewportHeight, desiredY));
    }

    return { x: desiredX, y: desiredY };
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
};

