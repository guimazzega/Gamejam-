/**
 * js/input.js
 * Sistema Modular de Inputs (Sprint 3):
 * - Consome exclusivamente o Dicionário Global de Inputs (window.Config.Controls)
 * - Suporte a modo de escuta (Keybinding / Remapeamento em tempo real)
 * - Ataque no Botão Direito do Mouse (Singleplayer) com bloqueio de contextmenu + Teclas R e 0 (Multiplayer)
 * - Suporte nativo a Joysticks via Gamepad API (navigator.getGamepads()) no loop principal
 * - Adaptação inteligente de hardware para controles Padrão (Xbox/PS), Genéricos/Bluetooth (DirectInput) e Modo Nintendo Switch
 */

window.InputManager = class InputManager {
  constructor(callbacks = {}) {
    this.keysDown = new Set();
    this.callbacks = callbacks;

    // Estado de remapeamento (Keybinding): guarda a chave de Config.Controls que aguarda o próximo keydown
    this.rebindingAction = null;
    this.onRebindComplete = null;

    // Estado dos Gamepads conectados (para detecção de borda de subida / rising edge nos botões)
    this.prevGamepadButtons = {};
    this.gamepadVectors = {
      1: { dx: 0, dy: 0 },
      2: { dx: 0, dy: 0 }
    };
    this.connectedGamepadsInfo = [];

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onWheel = this._onWheel.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onContextMenu = this._onContextMenu.bind(this);
    this._onBlur = this._onBlur.bind(this);

    window.addEventListener('keydown', this._onKeyDown, { passive: false });
    window.addEventListener('keyup', this._onKeyUp);
    window.addEventListener('wheel', this._onWheel, { passive: true });
    window.addEventListener('mousedown', this._onMouseDown);
    window.addEventListener('contextmenu', this._onContextMenu, { passive: false });
    window.addEventListener('blur', this._onBlur);

    window.addEventListener('gamepadconnected', (e) => {
      const profile = this.detectControllerProfile(e.gamepad);
      console.log(
        `[GAMEPAD CONECTADO] Índice ${e.gamepad.index}: "${e.gamepad.id}" | Perfil: ${profile.label}`
      );
      if (this.callbacks.onGamepadStatusChange) {
        this.callbacks.onGamepadStatusChange(e.gamepad, true, profile);
      }
    });

    window.addEventListener('gamepaddisconnected', (e) => {
      console.log(`[GAMEPAD DESCONECTADO] Índice ${e.gamepad.index}: "${e.gamepad.id}"`);
      delete this.prevGamepadButtons[e.gamepad.index];
      if (this.callbacks.onGamepadStatusChange) {
        this.callbacks.onGamepadStatusChange(e.gamepad, false, null);
      }
    });
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

  /**
   * Bloqueia o menu de contexto padrão do navegador ao clicar com o Botão Direito do Mouse
   */
  _onContextMenu(e) {
    e.preventDefault();
  }

  /**
   * Captura clique do Botão Direito do Mouse para ataque no Singleplayer
   */
  _onMouseDown(e) {
    // Se estiver aguardando remapeamento e o usuário clicar em outra área fora dos botões de rebind, não dispara ataque
    if (this.rebindingAction) return;

    // Ignora cliques originados dentro de menus ou modais visíveis
    if (e.target && e.target.closest && e.target.closest('.menu-overlay')) {
      return;
    }

    const C = window.Config.Controls;
    // e.button === 2 -> Botão Direito do Mouse
    if (e.button === 2 && C.P1_Attack_Mouse === 'MouseRight') {
      e.preventDefault();
      if (this.callbacks.onMouseRightAttack) {
        this.callbacks.onMouseRightAttack('Botão Direito do Mouse (MouseRight)');
      }
    }
  }

  _onKeyDown(e) {
    const code = e.code;

    // 1. Modo de Remapeamento de Teclas (Keybinding no Menu de Configurações > Aba Controles)
    if (this.rebindingAction) {
      e.preventDefault();
      e.stopPropagation();

      const actionKey = this.rebindingAction;
      window.Config.Controls[actionKey] = code;

      const cb = this.onRebindComplete;
      this.rebindingAction = null;
      this.onRebindComplete = null;

      console.log(
        `[KEYBINDING] Ação "${actionKey}" remapeada para "${code}" (${window.Config.formatKeyCode(code)})`
      );

      if (cb) cb(actionKey, code);
      return;
    }

    const C = window.Config.Controls;

    // Previne comportamento padrão do navegador para teclas de jogo mapeadas (Tab, Espaço, Setas)
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

    // Atalhos de disparo único (ignora auto-repeat de tecla segurada)
    if (isRepeat) return;

    // 2. Consumo estrito do Dicionário Global de Inputs (window.Config.Controls)
    if (code === C.SwitchPlayer) {
      if (this.callbacks.onSwitchPlayer) this.callbacks.onSwitchPlayer();
    } else if (code === C.Pause || code === C.PauseAlt) {
      if (this.callbacks.onTogglePause) this.callbacks.onTogglePause();
    } else if (code === C.Interact || code === C.InteractAlt) {
      if (this.callbacks.onInteract) this.callbacks.onInteract();
    } else if (code === C.P1_Attack) {
      if (this.callbacks.onPlayerAttack) {
        this.callbacks.onPlayerAttack(1, `Tecla ${window.Config.formatKeyCode(code)} (${code})`);
      }
    } else if (code === C.P2_Attack || (C.P2_Attack === 'Digit0' && code === C.P2_Attack_Alt)) {
      if (this.callbacks.onPlayerAttack) {
        this.callbacks.onPlayerAttack(2, `Tecla ${window.Config.formatKeyCode(code)} (${code})`);
      }
    } else if (code === C.P1_Inventory) {
      if (this.callbacks.onCyclePlayerSlot) {
        this.callbacks.onCyclePlayerSlot(1, 1);
      }
    } else if (code === C.P2_Inventory) {
      if (this.callbacks.onCyclePlayerSlot) {
        this.callbacks.onCyclePlayerSlot(2, 1);
      }
    } else if (code === C.DebugDamage) {
      if (this.callbacks.onDebugDamage) this.callbacks.onDebugDamage();
    } else if (code === C.DebugHeal) {
      if (this.callbacks.onDebugHeal) this.callbacks.onDebugHeal();
    } else if (code === C.DebugNextStage) {
      if (this.callbacks.onDebugNextStage) this.callbacks.onDebugNextStage();
    } else if (code === C.P1_Slot1) {
      if (this.callbacks.onSelectSlot) this.callbacks.onSelectSlot(0);
    } else if (code === C.P1_Slot2) {
      if (this.callbacks.onSelectSlot) this.callbacks.onSelectSlot(1);
    } else if (code === C.P1_Slot3) {
      if (this.callbacks.onSelectSlot) this.callbacks.onSelectSlot(2);
    } else if (code === C.P1_Slot4) {
      if (this.callbacks.onSelectSlot) this.callbacks.onSelectSlot(3);
    } else if (code === C.P1_Slot5) {
      if (this.callbacks.onSelectSlot) this.callbacks.onSelectSlot(4);
    }
  }

  _onKeyUp(e) {
    this.keysDown.delete(e.code);
  }

  _onWheel(e) {
    if (e.deltaY === 0 || this.rebindingAction) return;
    const direction = e.deltaY > 0 ? 1 : -1;
    if (this.callbacks.onCycleSlot) {
      this.callbacks.onCycleSlot(direction);
    }
  }

  _onBlur() {
    this.keysDown.clear();
  }

  /**
   * Identifica o perfil de hardware do Gamepad conectado:
   * - 'switch': Modo Nintendo Switch (Pro Controller, Joy-Con, 8BitDo Switch Mode) onde B/A e Y/X físicos são invertidos
   * - 'generic': Controles USB/Bluetooth genéricos (DirectInput sem standard mapping)
   * - 'standard': Mapeamento W3C Standard (Xbox / DualShock / DualSense / XInput)
   */
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
        label: 'Modo Nintendo Switch (Botões Invertidos B↔A / Y↔X)',
        // Em Switch Standard Mapping, os botões de face superiores/laterais (X e Y físicos) ficam nos índices 2 e 3,
        // mas em alguns adaptadores Bluetooth DirectInput de Switch o X/Y físico fica em 0, 2 ou 3.
        attackButtons: [2, 3, 0],
        interactButtons: [1],
        l1Button: 4,
        r1Button: 5
      };
    }

    if (mapping !== 'standard') {
      return {
        type: 'generic',
        label: 'Controle Genérico / Bluetooth (DirectInput)',
        // Em controles genéricos/Bluetooth DirectInput, os botões de face X/Y costumam ser 0 e 3 (ou 2 e 3)
        attackButtons: [0, 2, 3],
        interactButtons: [1],
        l1Button: 4,
        r1Button: 5
      };
    }

    return {
      type: 'standard',
      label: 'Padrão W3C (Xbox / PlayStation / XInput)',
      // Botões de Face X (índice 2) e Y (índice 3) para ataque; A (índice 0) ou B (índice 1) para interagir
      attackButtons: [2, 3],
      interactButtons: [0, 1],
      l1Button: 4,
      r1Button: 5
    };
  }

  /**
   * Lê todos os joysticks via navigator.getGamepads() a cada frame do requestAnimationFrame
   */
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

      // Define qual jogador este controle opera:
      // No Singleplayer, qualquer controle ativo opera o personagem ativo (1 = canal principal).
      // No Multiplayer Local, o 1º controle opera P1 e o 2º controle opera P2.
      const targetSlot = gameMode === 'multiplayer' ? (listIdx === 0 ? 1 : 2) : 1;

      // 1. Leitura de Movimentação: Analógico Esquerdo (Axes 0 e 1) + D-Pad
      const moveVec = this._readGamepadMovement(gp);
      if (moveVec.dx !== 0 || moveVec.dy !== 0) {
        this.gamepadVectors[targetSlot] = moveVec;
      }

      // Estado anterior dos botões deste gamepad para detecção de clique único (rising edge)
      const prev = this.prevGamepadButtons[gp.index] || [];
      const curr = gp.buttons.map((b) => this._isButtonPressed(b));

      const justPressed = (btnIndex) => Boolean(curr[btnIndex] && !prev[btnIndex]);

      // 2. Gatilhos Superiores (Bumpers L1 / R1) -> Girar itens do inventário
      if (justPressed(profile.l1Button)) {
        if (this.callbacks.onGamepadCycleSlot) {
          this.callbacks.onGamepadCycleSlot(targetSlot, -1, `Gamepad #${gp.index + 1} [L1]`);
        }
      }
      if (justPressed(profile.r1Button)) {
        if (this.callbacks.onGamepadCycleSlot) {
          this.callbacks.onGamepadCycleSlot(targetSlot, 1, `Gamepad #${gp.index + 1} [R1]`);
        }
      }

      // 3. Botões de Face (X / Y + compatibilidade Switch e Genérico/Bluetooth) -> Ataque
      const attacked = profile.attackButtons.some((bIdx) => justPressed(bIdx));
      if (attacked) {
        if (this.callbacks.onGamepadAttack) {
          this.callbacks.onGamepadAttack(
            targetSlot,
            `Gamepad #${gp.index + 1} [Botão de Face X/Y • ${profile.type.toUpperCase()}]`
          );
        }
      }

      // 4. Botões de Face Secundários (A / B) -> Interagir (ou atacar caso não esteja em zona de interação)
      const interacted = profile.interactButtons.some((bIdx) => justPressed(bIdx));
      if (interacted) {
        if (this.callbacks.onGamepadInteractOrAttack) {
          this.callbacks.onGamepadInteractOrAttack(
            targetSlot,
            `Gamepad #${gp.index + 1} [Botão Face • ${profile.type.toUpperCase()}]`
          );
        }
      }

      // 5. Botão Select/Back (8) -> Alternar personagem no Singleplayer
      if (justPressed(8)) {
        if (this.callbacks.onSwitchPlayer) this.callbacks.onSwitchPlayer();
      }

      // 6. Botão Start/Options (9) -> Pausar Jogo
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

  /**
   * Lê Analógico Esquerdo (Axes 0 e 1) com Deadzone Radial e D-Pad (Botões 12-15 + POV Hat em controles genéricos)
   */
  _readGamepadMovement(gp) {
    const deadzone = window.Config.GAMEPAD_DEADZONE || 0.22;
    let dx = 0;
    let dy = 0;

    // 1. Analógico Esquerdo (Axes 0 e 1)
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

    // 2. D-Pad Padrão (Botões 12: Cima, 13: Baixo, 14: Esquerda, 15: Direita)
    let dpadX = 0;
    let dpadY = 0;
    if (gp.buttons && gp.buttons.length >= 16) {
      if (this._isButtonPressed(gp.buttons[12])) dpadY -= 1;
      if (this._isButtonPressed(gp.buttons[13])) dpadY += 1;
      if (this._isButtonPressed(gp.buttons[14])) dpadX -= 1;
      if (this._isButtonPressed(gp.buttons[15])) dpadX += 1;
    }

    // 3. Fallback D-Pad em Eixos Secundários (comum em controles Bluetooth/DirectInput genéricos: axes[6] e axes[7])
    if (dpadX === 0 && dpadY === 0 && gp.mapping !== 'standard' && gp.axes && gp.axes.length >= 8) {
      if (Math.abs(gp.axes[6]) > 0.5) dpadX = Math.sign(gp.axes[6]);
      if (Math.abs(gp.axes[7]) > 0.5) dpadY = Math.sign(gp.axes[7]);
    }

    if (dpadX !== 0 || dpadY !== 0) {
      return this._normalize(dpadX, dpadY);
    }

    return { dx, dy };
  }

  /**
   * Retorna vetor normalizado (dx, dy) para o Jogador 1 (Teclado Config.Controls.P1_* + Gamepad 1)
   */
  getP1Vector() {
    const C = window.Config.Controls;
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

  /**
   * Retorna vetor normalizado (dx, dy) para o Jogador 2 (Teclado Config.Controls.P2_* + Gamepad 2)
   */
  getP2Vector() {
    const C = window.Config.Controls;
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

  // Mantém aliases retrocompatíveis que consomem o Dicionário Global
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
