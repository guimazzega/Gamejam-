/**
 * js/input.js
 * Gerenciador de Input (Teclado + Mouse + Gamepad API + Keybinding Dinâmico):
 * - Lê ações a partir do Dicionário Global `window.Config.Controls` (sem strings fixas de teclas).
 * - Modo Singleplayer: Ataque acionado exclusivamente pelo Botão Direito do Mouse direcionado ao cursor (`contextmenu` bloqueado).
 * - Modo Multiplayer Local: Jogador 1 ataca com `Config.Controls.attackP1` (padrão `KeyR`) e Jogador 2 com `Config.Controls.attackP2` (padrão `Digit0`).
 * - Suporte nativo à Gamepad API (`navigator.getGamepads()`) no loop principal (Analógico Esquerdo / D-Pad, Botões de Face X/Quadrado para atacar, Bumpers L1/R1 para inventário), resiliente a controles genéricos e layouts Nintendo Switch.
 * - Suporte a remapeamento de teclas em tempo real clicando na ação no menu Configurações > Controles.
 */

window.InputManager = class InputManager {
  constructor(callbacks = {}) {
    this.keysDown = new Set();
    this.callbacks = callbacks;

    // Posição atual do cursor do mouse na janela (para mirar o ataque no Singleplayer)
    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;

    // Estado de captura de tecla para remapeamento (Keybinding)
    this.rebindTargetAction = null;
    this.onRebindComplete = null;

    // Estado de Gamepads conectados (P1 = índice 1, P2 = índice 2)
    this.gamepadVectors = {
      1: { dx: 0, dy: 0 },
      2: { dx: 0, dy: 0 }
    };
    this.prevGamepadButtons = {};
    this.connectedGamepadsSummary = [];

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onWheel = this._onWheel.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onContextMenu = this._onContextMenu.bind(this);

    window.addEventListener('keydown', this._onKeyDown, { passive: false });
    window.addEventListener('keyup', this._onKeyUp);
    window.addEventListener('wheel', this._onWheel, { passive: true });
    window.addEventListener('blur', this._onBlur);
    window.addEventListener('mousemove', this._onMouseMove, { passive: true });
    window.addEventListener('mousedown', this._onMouseDown);
    window.addEventListener('contextmenu', this._onContextMenu);
  }

  /**
   * Inicia a escuta do próximo evento keydown para remapear uma ação de Config.Controls
   */
  startKeyRebind(actionKey, onComplete) {
    this.rebindTargetAction = actionKey;
    this.onRebindComplete = typeof onComplete === 'function' ? onComplete : null;
  }

  cancelKeyRebind() {
    this.rebindTargetAction = null;
    this.onRebindComplete = null;
  }

  _isFormInputFocused(e) {
    const el = e && e.target;
    if (!el || !el.tagName) return false;
    const tag = el.tagName.toUpperCase();
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
      const type = (el.type || '').toLowerCase();
      if (type !== 'checkbox' && type !== 'radio' && type !== 'button') {
        return true;
      }
    }
    return Boolean(el.isContentEditable);
  }

  /**
   * Verifica se o código de tecla pressionado corresponde à ação configurada em Config.Controls.
   * Trata equivalência entre Digit0 e Numpad0 para facilitar o uso do teclado numérico/alfanumérico.
   */
  _matchesControl(code, configuredCode) {
    if (!code || !configuredCode) return false;
    if (code === configuredCode) return true;
    if (
      (configuredCode === 'Digit0' && code === 'Numpad0') ||
      (configuredCode === 'Numpad0' && code === 'Digit0')
    ) {
      return true;
    }
    return false;
  }

  _isKeyDownForControl(configuredCode) {
    if (!configuredCode) return false;
    if (this.keysDown.has(configuredCode)) return true;
    if (configuredCode === 'Digit0' && this.keysDown.has('Numpad0')) return true;
    if (configuredCode === 'Numpad0' && this.keysDown.has('Digit0')) return true;
    return false;
  }

  _onKeyDown(e) {
    // 1. Se o menu de Configurações > Controles estiver aguardando uma tecla para remapeamento:
    if (this.rebindTargetAction) {
      e.preventDefault();
      e.stopPropagation();

      const code = e.code;
      const action = this.rebindTargetAction;
      const cb = this.onRebindComplete;

      this.rebindTargetAction = null;
      this.onRebindComplete = null;

      // Escape cancela o remapeamento mantendo a tecla atual
      if (code === 'Escape') {
        if (cb) cb(action, window.Config.Controls[action], true);
        return;
      }

      window.Config.Controls[action] = code;
      console.log(
        `[Keybinding] Ação "${action}" remapeada para "${code}" (${window.Config.formatKeyCode(code)})`
      );
      if (cb) cb(action, code, false);
      return;
    }

    // 2. Se estiver digitando em um campo de texto, ignora atalhos do jogo
    if (this._isFormInputFocused(e)) {
      if (e.code === 'Escape' && e.target && e.target.blur) {
        e.target.blur();
      }
      return;
    }

    const code = e.code;
    const C = window.Config.Controls;

    // Previne que Tab mude o foco do navegador ou que Setas/Espaço rolem a página durante o jogo
    const tag = e.target && e.target.tagName ? e.target.tagName.toUpperCase() : '';
    const isInteractiveControl = tag === 'BUTTON' || tag === 'INPUT' || tag === 'LABEL';
    if (
      !isInteractiveControl &&
      (code === 'Tab' ||
        code === 'Space' ||
        code === 'ArrowUp' ||
        code === 'ArrowDown' ||
        code === 'ArrowLeft' ||
        code === 'ArrowRight' ||
        this._matchesControl(code, C.switchCharacter))
    ) {
      e.preventDefault();
    } else if (code === 'Tab') {
      e.preventDefault();
    }

    const isRepeat = this.keysDown.has(code);
    this.keysDown.add(code);

    // Atalhos de disparo único (ignora auto-repeat de tecla segurada)
    if (isRepeat) return;

    if (code === 'Escape' || code === 'KeyP') {
      if (this.callbacks.onTogglePause) this.callbacks.onTogglePause();
      return;
    }

    if (this._matchesControl(code, C.switchCharacter)) {
      if (this.callbacks.onSwitchPlayer) this.callbacks.onSwitchPlayer();
    } else if (this._matchesControl(code, C.interact) || (code === 'Space' && !isInteractiveControl)) {
      if (this.callbacks.onInteract) this.callbacks.onInteract();
    } else if (this._matchesControl(code, C.inventoryCycle)) {
      if (this.callbacks.onCycleInventoryKey) {
        this.callbacks.onCycleInventoryKey(1);
      } else if (this.callbacks.onCycleSlot) {
        this.callbacks.onCycleSlot(1);
      }
    } else if (this._matchesControl(code, C.attackP1)) {
      if (this.callbacks.onAttackP1Key) this.callbacks.onAttackP1Key(code);
    } else if (this._matchesControl(code, C.attackP2)) {
      if (this.callbacks.onAttackP2Key) this.callbacks.onAttackP2Key(code);
    } else if (this._matchesControl(code, C.slot1)) {
      if (this.callbacks.onSelectSlot) this.callbacks.onSelectSlot(0);
    } else if (this._matchesControl(code, C.slot2)) {
      if (this.callbacks.onSelectSlot) this.callbacks.onSelectSlot(1);
    } else if (this._matchesControl(code, C.slot3)) {
      if (this.callbacks.onSelectSlot) this.callbacks.onSelectSlot(2);
    } else if (this._matchesControl(code, C.slot4)) {
      if (this.callbacks.onSelectSlot) this.callbacks.onSelectSlot(3);
    } else if (this._matchesControl(code, C.slot5)) {
      if (this.callbacks.onSelectSlot) this.callbacks.onSelectSlot(4);
<<<<<<< Updated upstream
    } else if (code === 'KeyH') {
      if (this.callbacks.onDebugDamage) this.callbacks.onDebugDamage(e);
    } else if (code === 'KeyJ') {
      if (this.callbacks.onDebugHeal) this.callbacks.onDebugHeal(e);
    } else if (code === 'KeyN') {
      if (this.callbacks.onDebugNextStage) this.callbacks.onDebugNextStage();
=======
    } else if (code === 'KeyB') {
      if (this.callbacks.onToggleColliders) this.callbacks.onToggleColliders();
    } else if (code === 'Equal' || code === 'NumpadAdd') {
      if (this.callbacks.onZoomChange) this.callbacks.onZoomChange(0.15);
    } else if (code === 'Minus' || code === 'NumpadSubtract') {
      if (this.callbacks.onZoomChange) this.callbacks.onZoomChange(-0.15);
>>>>>>> Stashed changes
    }
  }

  _onKeyUp(e) {
    this.keysDown.delete(e.code);
  }

  _onMouseMove(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }

  _onMouseDown(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    // Ignora cliques caso ocorram dentro de menus/modais ou do Map Editor
    if (e.target && e.target.closest && e.target.closest('.menu-overlay, .map-editor-ui')) {
      return;
    }

    // Modo Singleplayer: O ataque é acionado exclusivamente pelo Botão Direito do Mouse (e.button === 2)
    if (e.button === 2) {
      e.preventDefault();
      if (this.callbacks.onSingleplayerRightClickAttack) {
        this.callbacks.onSingleplayerRightClickAttack({
          clientX: e.clientX,
          clientY: e.clientY
        });
      }
    }
  }

  _onContextMenu(e) {
    // Impede que o menu de contexto padrão do navegador abra ao clicar com o Botão Direito
    if (!e.target || !e.target.closest || !e.target.closest('.map-editor-ui')) {
      e.preventDefault();
    }
  }

  _onWheel(e) {
    if (e.deltaY === 0) return;
    // Ignora scroll caso ocorra dentro do painel do Editor ou Menus
    if (e.target && e.target.closest && e.target.closest('.map-editor-ui, .menu-overlay')) {
      return;
    }
    const direction = e.deltaY > 0 ? 1 : -1;
    if (this.callbacks.onCycleSlot) {
      this.callbacks.onCycleSlot(direction);
    }
  }

  _onBlur() {
    this.keysDown.clear();
    this.gamepadVectors[1] = { dx: 0, dy: 0 };
    this.gamepadVectors[2] = { dx: 0, dy: 0 };
  }

  /**
   * Lê todos os joysticks conectados via `navigator.getGamepads()` dentro do `requestAnimationFrame`.
   * Mapeia:
   * - Analógico Esquerdo (Axes 0 e 1) ou D-Pad (Buttons 12-15 ou Axes 9/hat) -> Movimentação
   * - Botões de Face (X / Quadrado / Y / A -> Buttons 0, 2, 3) -> Ataque
   * - Gatilhos Superiores / Bumpers (L1 / R1 -> Buttons 4 e 5) -> Navegação de Inventário
   * Estruturado de forma defensiva para não quebrar com controles genéricos ou Nintendo Switch.
   */
  pollGamepads() {
    this.gamepadVectors[1] = { dx: 0, dy: 0 };
    this.gamepadVectors[2] = { dx: 0, dy: 0 };
    this.connectedGamepadsSummary = [];

    if (typeof navigator === 'undefined' || typeof navigator.getGamepads !== 'function') {
      return;
    }

    let rawPads;
    try {
      rawPads = navigator.getGamepads();
    } catch (_) {
      return;
    }
    if (!rawPads) return;

    const activePads = [];
    for (let i = 0; i < rawPads.length; i++) {
      const pad = rawPads[i];
      if (pad && pad.connected !== false) {
        activePads.push(pad);
      }
    }

    for (let idx = 0; idx < activePads.length && idx < 2; idx++) {
      const pad = activePads[idx];
      const playerSlot = idx + 1; // 1 -> P1 (ou ativo no Single), 2 -> P2
      const padKey = `${pad.index}_${pad.id || 'pad'}`;
      const prev = this.prevGamepadButtons[padKey] || {};
      const nextState = {};

      const isPressed = (btnIdx) => {
        if (!pad.buttons || btnIdx < 0 || btnIdx >= pad.buttons.length) return false;
        const b = pad.buttons[btnIdx];
        if (!b) return false;
        return typeof b === 'object' ? Boolean(b.pressed || b.value > 0.5) : Boolean(b);
      };

      const readAxis = (axisIdx) => {
        if (!pad.axes || axisIdx < 0 || axisIdx >= pad.axes.length) return 0;
        const val = Number(pad.axes[axisIdx]);
        return Number.isFinite(val) ? val : 0;
      };

      // 1. Movimentação: Analógico Esquerdo (Axes 0 e 1) com Deadzone + D-Pad (Buttons 12..15)
      const deadzone = 0.22;
      let gx = readAxis(0);
      let gy = readAxis(1);
      if (Math.abs(gx) < deadzone) gx = 0;
      if (Math.abs(gy) < deadzone) gy = 0;

      // D-Pad padrão (12: Cima, 13: Baixo, 14: Esquerda, 15: Direita)
      if (isPressed(12)) gy -= 1;
      if (isPressed(13)) gy += 1;
      if (isPressed(14)) gx -= 1;
      if (isPressed(15)) gx += 1;

      this.gamepadVectors[playerSlot] = this._normalize(gx, gy);

      // 2. Detecção de borda de subida (rising edge) para ações discretas
      // Botão de Ataque nos Botões de Face:
      // No padrão Xbox/PlayStation (standard) botão 2 = X/Quadrado e botão 3 = Y/Triângulo.
      // Em controles de Nintendo Switch ou genéricos DirectInput, X/Y podem estar nos índices 0, 2 ou 3.
      const attackFacePressed = isPressed(2) || isPressed(3) || isPressed(0);
      nextState.attackFace = attackFacePressed;
      if (attackFacePressed && !prev.attackFace) {
        if (this.callbacks.onGamepadAttack) {
          this.callbacks.onGamepadAttack(playerSlot, pad.id || `Gamepad #${pad.index + 1}`);
        }
      }

      // 3. Navegação do Inventário nos Gatilhos Superiores (Bumpers L1 = 4, R1 = 5)
      const l1Pressed = isPressed(4);
      const r1Pressed = isPressed(5);
      nextState.l1 = l1Pressed;
      nextState.r1 = r1Pressed;

      if (l1Pressed && !prev.l1) {
        if (this.callbacks.onGamepadCycleSlot) {
          this.callbacks.onGamepadCycleSlot(playerSlot, -1);
        }
      }
      if (r1Pressed && !prev.r1) {
        if (this.callbacks.onGamepadCycleSlot) {
          this.callbacks.onGamepadCycleSlot(playerSlot, 1);
        }
      }

      // 4. Botão de Interação secundário (B / Círculo = 1) e Start/Pause (9) e Select/Switch (8)
      const interactPressed = isPressed(1);
      nextState.interact = interactPressed;
      if (interactPressed && !prev.interact) {
        if (this.callbacks.onInteract) this.callbacks.onInteract();
      }

      const selectPressed = isPressed(8);
      nextState.select = selectPressed;
      if (selectPressed && !prev.select) {
        if (this.callbacks.onSwitchPlayer) this.callbacks.onSwitchPlayer();
      }

      const startPressed = isPressed(9);
      nextState.start = startPressed;
      if (startPressed && !prev.start) {
        if (this.callbacks.onTogglePause) this.callbacks.onTogglePause();
      }

      this.prevGamepadButtons[padKey] = nextState;
      this.connectedGamepadsSummary.push(`P${playerSlot}: ${pad.id || 'Joystick USB'}`);
    }
  }

  /**
   * Retorna vetor normalizado (dx, dy) para o Jogador 1 (ou Personagem Ativo no Singleplayer)
   * combinando o Dicionário Global `Config.Controls` e o Gamepad 1.
   */
  getP1Vector() {
    const C = window.Config.Controls;
    let dx = 0;
    let dy = 0;
    if (this._isKeyDownForControl(C.moveUp)) dy -= 1;
    if (this._isKeyDownForControl(C.moveDown)) dy += 1;
    if (this._isKeyDownForControl(C.moveLeft)) dx -= 1;
    if (this._isKeyDownForControl(C.moveRight)) dx += 1;

    const kbVec = this._normalize(dx, dy);
    const gpVec = this.gamepadVectors[1] || { dx: 0, dy: 0 };

    if (gpVec.dx !== 0 || gpVec.dy !== 0) {
      if (kbVec.dx === 0 && kbVec.dy === 0) return gpVec;
      return this._normalize(kbVec.dx + gpVec.dx, kbVec.dy + gpVec.dy);
    }
    return kbVec;
  }

  /**
   * Retorna vetor normalizado (dx, dy) para o Jogador 2 no Multiplayer Local
   * combinando o Dicionário Global `Config.Controls` e o Gamepad 2.
   */
  getP2Vector() {
    const C = window.Config.Controls;
    let dx = 0;
    let dy = 0;
    if (this._isKeyDownForControl(C.p2MoveUp)) dy -= 1;
    if (this._isKeyDownForControl(C.p2MoveDown)) dy += 1;
    if (this._isKeyDownForControl(C.p2MoveLeft)) dx -= 1;
    if (this._isKeyDownForControl(C.p2MoveRight)) dx += 1;

    const kbVec = this._normalize(dx, dy);
    const gpVec = this.gamepadVectors[2] || { dx: 0, dy: 0 };

    if (gpVec.dx !== 0 || gpVec.dy !== 0) {
      if (kbVec.dx === 0 && kbVec.dy === 0) return gpVec;
      return this._normalize(kbVec.dx + gpVec.dx, kbVec.dy + gpVec.dy);
    }
    return kbVec;
  }

  // Aliases retrocompatíveis que consomem o Dicionário Global
  getWASDVector() {
    return this.getP1Vector();
  }

  getArrowsVector() {
    return this.getP2Vector();
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
