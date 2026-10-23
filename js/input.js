/**
 * js/input.js
 * Gerenciador de Input (Teclado + Scroll do Mouse)
 * Garante e.preventDefault() na tecla Tab, Espaço e Setas Direcionais.
 */

window.InputManager = class InputManager {
  constructor(callbacks = {}) {
    this.keysDown = new Set();
    this.callbacks = callbacks;

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onWheel = this._onWheel.bind(this);
    this._onBlur = this._onBlur.bind(this);

    window.addEventListener('keydown', this._onKeyDown, { passive: false });
    window.addEventListener('keyup', this._onKeyUp);
    window.addEventListener('wheel', this._onWheel, { passive: true });
    window.addEventListener('blur', this._onBlur);
  }

  _onKeyDown(e) {
    const code = e.code;

    // Previne que Tab mude o foco do navegador ou que Setas/Espaço rolem a página
    if (
      code === 'Tab' ||
      code === 'Space' ||
      code === 'ArrowUp' ||
      code === 'ArrowDown' ||
      code === 'ArrowLeft' ||
      code === 'ArrowRight'
    ) {
      e.preventDefault();
    }

    const isRepeat = this.keysDown.has(code);
    this.keysDown.add(code);

    // Atalhos de disparo único (ignora auto-repeat de tecla segurada)
    if (isRepeat) return;

    if (code === 'Tab') {
      if (this.callbacks.onSwitchPlayer) this.callbacks.onSwitchPlayer();
    } else if (code === 'Escape' || code === 'KeyP') {
      if (this.callbacks.onTogglePause) this.callbacks.onTogglePause();
    } else if (code === 'KeyE' || code === 'Space') {
      if (this.callbacks.onInteract) this.callbacks.onInteract();
    } else if (code === 'KeyH') {
      if (this.callbacks.onDebugDamage) this.callbacks.onDebugDamage();
    } else if (code === 'KeyJ') {
      if (this.callbacks.onDebugHeal) this.callbacks.onDebugHeal();
    } else if (code === 'KeyN') {
      if (this.callbacks.onDebugNextStage) this.callbacks.onDebugNextStage();
    } else if (code.startsWith('Digit')) {
      const num = parseInt(code.replace('Digit', ''), 10);
      if (num >= 1 && num <= 8 && this.callbacks.onSelectSlot) {
        this.callbacks.onSelectSlot(num - 1);
      }
    } else if (code.startsWith('Numpad')) {
      const num = parseInt(code.replace('Numpad', ''), 10);
      if (num >= 1 && num <= 8 && this.callbacks.onSelectSlot) {
        this.callbacks.onSelectSlot(num - 1);
      }
    }
  }

  _onKeyUp(e) {
    this.keysDown.delete(e.code);
  }

  _onWheel(e) {
    if (e.deltaY === 0) return;
    const direction = e.deltaY > 0 ? 1 : -1;
    if (this.callbacks.onCycleSlot) {
      this.callbacks.onCycleSlot(direction);
    }
  }

  _onBlur() {
    this.keysDown.clear();
  }

  /**
   * Retorna vetor normalizado (dx, dy) para o conjunto WASD
   */
  getWASDVector() {
    let dx = 0;
    let dy = 0;
    if (this.keysDown.has('KeyW')) dy -= 1;
    if (this.keysDown.has('KeyS')) dy += 1;
    if (this.keysDown.has('KeyA')) dx -= 1;
    if (this.keysDown.has('KeyD')) dx += 1;
    return this._normalize(dx, dy);
  }

  /**
   * Retorna vetor normalizado (dx, dy) para as Setas Direcionais
   */
  getArrowsVector() {
    let dx = 0;
    let dy = 0;
    if (this.keysDown.has('ArrowUp')) dy -= 1;
    if (this.keysDown.has('ArrowDown')) dy += 1;
    if (this.keysDown.has('ArrowLeft')) dx -= 1;
    if (this.keysDown.has('ArrowRight')) dx += 1;
    return this._normalize(dx, dy);
  }

  /**
   * Normaliza o vetor de movimento em 8 direções para manter velocidade constante na diagonal
   */
  _normalize(dx, dy) {
    if (dx !== 0 && dy !== 0) {
      const invSqrt2 = Math.SQRT1_2; // ~0.70710678
      return { dx: dx * invSqrt2, dy: dy * invSqrt2 };
    }
    return { dx, dy };
  }

  clearAll() {
    this.keysDown.clear();
  }
};

