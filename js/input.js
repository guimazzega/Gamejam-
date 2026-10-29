/**
 * js/input.js
 * Sistema Modular de Inputs:
 * - Dicionário Global de Inputs (window.GameConfig.Controls)
 * - Ataque no Singleplayer: Botão Esquerdo do Mouse direcionado para a mira / Tecla configurada
 * - Ataque no Multiplayer Local: Jogador 1 (Tecla P1_Attack / Mouse) e Jogador 2 (Tecla P2_Attack)
 * - Suporte nativo a Joysticks via Gamepad API (navigator.getGamepads())
 * - Modo de escuta para Remapeamento (Keybinding)
 * - Remoção completa de atalhos de desenvolvedor e teclas de inventário
 */

window.InputManager = class InputManager {
  constructor(callbacks = {}) {
    this.keysDown = new Set();
    this.callbacks = callbacks;

    // Coordenadas do mouse na tela
    this.mouseX = 0;
    this.mouseY = 0;

    // Estado de remapeamento (Keybinding)
    this.rebindingAction = null;
    this.onRebindComplete = null;

    // Estado dos Gamepads conectados
    this.prevGamepadButtons = {};
    this.gamepadVectors = {
      1: { dx: 0, dy: 0 },
      2: { dx: 0, dy: 0 }
    };
    this.connectedGamepadsInfo = [];

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onContextMenu = this._onContextMenu.bind(this);
    this._onBlur = this._onBlur.bind(this);

    window.addEventListener('keydown', this._onKeyDown, { passive: false });
    window.addEventListener('keyup', this._onKeyUp);
    window.addEventListener('mousemove', this._onMouseMove, { passive: true });
    window.addEventListener('mousedown', this._onMouseDown);
    window.addEventListener('contextmenu', this._onContextMenu, { passive: false });
    window.addEventListener('blur', this._onBlur);

    window.addEventListener('gamepadconnected', (e) => {
      const profile = this.detectControllerProfile(e.gamepad);
      if (this.callbacks.onGamepadStatusChange) {
        this.callbacks.onGamepadStatusChange(e.gamepad, true, profile);
      }
    });

    window.addEventListener('gamepaddisconnected', (e) => {
      delete this.prevGamepadButtons[e.gamepad.index];
      if (this.callbacks.onGamepadStatusChange) {
        this.callbacks.onGamepadStatusChange(e.gamepad, false, null);
      }
    });
  }

  _onMouseMove(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }

  /**
   * Inicia a escuta da próxima tecla pressionada para remapear uma ação no Dicionário Global
   */
  startKeyRebind(actionKey, onComplete) {
    this.rebindingAction = actionKey;
    this.onRebindComplete = onComplete || null;
  }

  cancelKeyRebind() {
    this.rebindingAction = null;
    this.onRebindComplete = null;
  }

  isRebinding() {
    return this.rebindingAction !== null;
  }

  _onContextMenu(e) {
    e.preventDefault();
  }

  /**
   * Captura clique do mouse:
   * - Botão Esquerdo (button 0): Dispara ataque direcionado
   */
  _onMouseDown(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    if (this.rebindingAction) return;

    // Ignora cliques em botões, modais ou menus de interface
    if (e.target && e.target.closest && e.target.closest('.menu-overlay, .stardew-panel, button, input')) {
      return;
    }

    if (e.button === 0) {
      if (this.callbacks.onMouseLeftAttack) {
        this.callbacks.onMouseLeftAttack(e.clientX, e.clientY);
      }
    }
  }

  _onKeyDown(e) {
    const code = e.code;

    // Modo de Remapeamento de Teclas
    if (this.rebindingAction) {
      e.preventDefault();
      e.stopPropagation();

      const actionKey = this.rebindingAction;
      const controls = window.GameConfig ? window.GameConfig.Controls : (window.Config ? window.Config.Controls : null);
      if (controls) {
        controls[actionKey] = code;
      }

      const cb = this.onRebindComplete;
      this.rebindingAction = null;
      this.onRebindComplete = null;

      if (cb) cb(actionKey, code);
      return;
    }

    const C = (window.GameConfig && window.GameConfig.Controls) || (window.Config && window.Config.Controls) || {};

    // Previne rolagem/comportamento nativo para teclas mapeadas de navegação
    if (
      code === C.SwitchPlayer ||
      code === C.InteractAlt ||
      code === C.P1_Up ||
      code === C.P1_Down ||
      code === C.P1_Left ||
      code === C.P1_Right ||
      code === C.P2_Up ||
      code === C.P2_Down ||
      code === C.P2_Left ||
      code === C.P2_Right
    ) {
      e.preventDefault();
    }

    const isRepeat = this.keysDown.has(code);
    this.keysDown.add(code);

    if (isRepeat) return;

    if (code === 'F6') {
      e.preventDefault();
      if (this.callbacks.onToggleEditor) this.callbacks.onToggleEditor();
      return;
    }

    if (code === 'F7') {
      e.preventDefault();
      if (this.callbacks.onToggleUIEditor) this.callbacks.onToggleUIEditor();
      return;
    }

    if (code === C.SwitchPlayer) {
      if (this.callbacks.onSwitchPlayer) this.callbacks.onSwitchPlayer();
    } else if (code === C.Pause || code === C.PauseAlt) {
      if (this.callbacks.onTogglePause) this.callbacks.onTogglePause();
    } else if (code === C.Interact || code === C.InteractAlt) {
      if (this.callbacks.onInteract) this.callbacks.onInteract();
    } else if (code === C.P1_Attack) {
      if (this.callbacks.onPlayerAttack) {
        this.callbacks.onPlayerAttack(1, `Tecla ${window.GameConfig ? window.GameConfig.formatKeyCode(code) : code}`);
      }
    } else if (code === C.P2_Attack || code === C.P2_Attack_Alt) {
      if (this.callbacks.onPlayerAttack) {
        this.callbacks.onPlayerAttack(2, `Tecla ${window.GameConfig ? window.GameConfig.formatKeyCode(code) : code}`);
      }
    }
  }

  _onKeyUp(e) {
    this.keysDown.delete(e.code);
  }

  _onBlur() {
    this.keysDown.clear();
  }

  detectControllerProfile(gp) {
    const idLower = (gp.id || '').toLowerCase();
    const mapping = (gp.mapping || '').toLowerCase();

    const isSwitch =
      idLower.includes('nintendo') ||
      idLower.includes('switch') ||
      idLower.includes('joy-con') ||
      idLower.includes('pro controller') ||
      idLower.includes('057e') ||
      idLower.includes('2009');

    if (isSwitch) {
      return {
        type: 'switch',
        label: 'Modo Nintendo Switch',
        attackButtons: [2, 3, 0],
        interactButtons: [1]
      };
    }

    if (mapping !== 'standard') {
      return {
        type: 'generic',
        label: 'Controle Genérico (DirectInput)',
        attackButtons: [0, 2, 3],
        interactButtons: [1]
      };
    }

    return {
      type: 'standard',
      label: 'Padrão W3C (Xbox / PlayStation)',
      attackButtons: [2, 3],
      interactButtons: [0, 1]
    };
  }

  pollGamepads(gameMode = 'singleplayer') {
    this.gamepadVectors[1] = { dx: 0, dy: 0 };
    this.gamepadVectors[2] = { dx: 0, dy: 0 };
    this.connectedGamepadsInfo = [];

    if (!navigator.getGamepads) return;

    const rawPads = navigator.getGamepads();
    if (!rawPads) return;

    const activePads = [];
    for (let i = 0; i < rawPads.length; i++) {
      if (rawPads[i] && rawPads[i].connected) {
        activePads.push(rawPads[i]);
      }
    }

    activePads.forEach((gp, listIdx) => {
      const profile = this.detectControllerProfile(gp);
      this.connectedGamepadsInfo.push({
        index: gp.index,
        id: gp.id,
        profileLabel: profile.label,
        profileType: profile.type
      });

      const targetSlot = gameMode === 'multiplayer' ? (listIdx === 0 ? 1 : 2) : 1;

      // 1. Movimentação
      const moveVec = this._readGamepadMovement(gp);
      if (moveVec.dx !== 0 || moveVec.dy !== 0) {
        this.gamepadVectors[targetSlot] = moveVec;
      }

      const prev = this.prevGamepadButtons[gp.index] || [];
      const curr = gp.buttons.map((b) => this._isButtonPressed(b));
      const justPressed = (btnIndex) => Boolean(curr[btnIndex] && !prev[btnIndex]);

      // 2. Botões de Ataque
      const attacked = profile.attackButtons.some((bIdx) => justPressed(bIdx));
      if (attacked) {
        if (this.callbacks.onGamepadAttack) {
          this.callbacks.onGamepadAttack(targetSlot, `Gamepad #${gp.index + 1}`);
        }
      }

      // 3. Botões de Interação
      const interacted = profile.interactButtons.some((bIdx) => justPressed(bIdx));
      if (interacted) {
        if (this.callbacks.onGamepadInteractOrAttack) {
          this.callbacks.onGamepadInteractOrAttack(targetSlot, `Gamepad #${gp.index + 1}`);
        }
      }

      // 4. Select / Back -> Alternar Jogador (Singleplayer)
      if (justPressed(8)) {
        if (this.callbacks.onSwitchPlayer) this.callbacks.onSwitchPlayer();
      }

      // 5. Start / Options -> Pausar Jogo
      if (justPressed(9)) {
        if (this.callbacks.onTogglePause) this.callbacks.onTogglePause();
      }

      this.prevGamepadButtons[gp.index] = curr;
    });
  }

  _isButtonPressed(btn) {
    if (!btn) return false;
    if (typeof btn === 'object') {
      return Boolean(btn.pressed || btn.value > 0.5);
    }
    return Boolean(btn > 0.5);
  }

  _readGamepadMovement(gp) {
    const deadzone = (window.GameConfig && window.GameConfig.GAMEPAD_DEADZONE) || 0.22;
    let dx = 0;
    let dy = 0;

    if (gp.axes && gp.axes.length >= 2) {
      const rawX = gp.axes[0] || 0;
      const rawY = gp.axes[1] || 0;
      const mag = Math.hypot(rawX, rawY);
      if (mag > deadzone) {
        const normMag = Math.min(1, (mag - deadzone) / (1 - deadzone));
        dx = (rawX / mag) * normMag;
        dy = (rawY / mag) * normMag;
      }
    }

    let dpadX = 0;
    let dpadY = 0;
    if (gp.buttons && gp.buttons.length >= 16) {
      if (this._isButtonPressed(gp.buttons[12])) dpadY -= 1;
      if (this._isButtonPressed(gp.buttons[13])) dpadY += 1;
      if (this._isButtonPressed(gp.buttons[14])) dpadX -= 1;
      if (this._isButtonPressed(gp.buttons[15])) dpadX += 1;
    }

    if (dpadX === 0 && dpadY === 0 && gp.mapping !== 'standard' && gp.axes && gp.axes.length >= 8) {
      if (Math.abs(gp.axes[6]) > 0.5) dpadX = Math.sign(gp.axes[6]);
      if (Math.abs(gp.axes[7]) > 0.5) dpadY = Math.sign(gp.axes[7]);
    }

    if (dpadX !== 0 || dpadY !== 0) {
      return this._normalize(dpadX, dpadY);
    }

    return { dx, dy };
  }

  getP1Vector() {
    const C = (window.GameConfig && window.GameConfig.Controls) || {};
    let dx = 0;
    let dy = 0;
    if (this.keysDown.has(C.P1_Up)) dy -= 1;
    if (this.keysDown.has(C.P1_Down)) dy += 1;
    if (this.keysDown.has(C.P1_Left)) dx -= 1;
    if (this.keysDown.has(C.P1_Right)) dx += 1;

    const kbVec = this._normalize(dx, dy);
    const gpVec = this.gamepadVectors[1] || { dx: 0, dy: 0 };

    if (gpVec.dx !== 0 || gpVec.dy !== 0) {
      if (kbVec.dx === 0 && kbVec.dy === 0) return gpVec;
      return this._normalize(kbVec.dx + gpVec.dx, kbVec.dy + gpVec.dy);
    }
    return kbVec;
  }

  getP2Vector() {
    const C = (window.GameConfig && window.GameConfig.Controls) || {};
    let dx = 0;
    let dy = 0;
    if (this.keysDown.has(C.P2_Up)) dy -= 1;
    if (this.keysDown.has(C.P2_Down)) dy += 1;
    if (this.keysDown.has(C.P2_Left)) dx -= 1;
    if (this.keysDown.has(C.P2_Right)) dx += 1;

    const kbVec = this._normalize(dx, dy);
    const gpVec = this.gamepadVectors[2] || { dx: 0, dy: 0 };

    if (gpVec.dx !== 0 || gpVec.dy !== 0) {
      if (kbVec.dx === 0 && kbVec.dy === 0) return gpVec;
      return this._normalize(kbVec.dx + gpVec.dx, kbVec.dy + gpVec.dy);
    }
    return kbVec;
  }

  _normalize(dx, dy) {
    const len = Math.hypot(dx, dy);
    if (len > 1) {
      return { dx: dx / len, dy: dy / len };
    }
    return { dx, dy };
  }

  clearAll() {
    this.keysDown.clear();
    this.gamepadVectors[1] = { dx: 0, dy: 0 };
    this.gamepadVectors[2] = { dx: 0, dy: 0 };
  }
};
