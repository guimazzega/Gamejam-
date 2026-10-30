const fs = require('fs');

let main = fs.readFileSync('js/main.js', 'utf8');
const isCRLF = main.includes('\r\n');
const nl = isCRLF ? '\r\n' : '\n';

// 1. Add methods advanceFromVanDirectly, promptVanRestartConfirmation, dismissVanRestartAndStepBack, isAnyPlayerInRestartZone
const targetMethods = `  confirmVanReplayPrevious() {
    const replayIndex = this.lastCompletedStageIndex || 1;
    const targetMeta = window.GameConfig.STAGE_FLOW[replayIndex];
    const targetMap = targetMeta ? window.GameMaps[targetMeta.mapKey] : null;
    const destName = targetMap ? targetMap.name : 'Fase Anterior';
    this.triggerStageTeleport(replayIndex, \`Retornando para Replay/Farm em \${destName}!\`, false);
  }`;

const newMethods = `  confirmVanReplayPrevious() {
    const replayIndex = this.lastCompletedStageIndex || 1;
    const targetMeta = window.GameConfig.STAGE_FLOW[replayIndex];
    const targetMap = targetMeta ? window.GameMaps[targetMeta.mapKey] : null;
    const destName = targetMap ? targetMap.name : 'Fase Anterior';
    this.triggerStageTeleport(replayIndex, \`Retornando para Replay/Farm em \${destName}!\`, false);
  }

  /**
   * Porta da Direita da Van: Avança direto para a próxima fase ("na de ir vai direto")
   */
  advanceFromVanDirectly() {
    const stageMeta = this.getCurrentStageMeta();
    if (stageMeta.vanType === 'start' || this.stageFlowIndex === 0) {
      this.triggerStageTeleport(1, 'Partindo da Van Inicial para o Mapa 1!', false);
    } else {
      this.confirmVanAdvanceToNext();
    }
  }

  /**
   * Porta da Esquerda da Van: Exibe confirmação para reiniciar a fase anterior ("tem certeza que deseja reiniciar?")
   */
  promptVanRestartConfirmation() {
    const stageMeta = this.getCurrentStageMeta();
    if (stageMeta.vanType === 'start' || this.stageFlowIndex === 0) {
      if (this.ui) {
        this.ui.showToast('Você está na Van inicial da expedição! Avance pela porta da direita.', 2500);
      }
      return;
    }

    const replayIndex = this.lastCompletedStageIndex || 1;
    const targetMeta = window.GameConfig.STAGE_FLOW[replayIndex];
    const targetMap = targetMeta ? window.GameMaps[targetMeta.mapKey] : null;
    const destName = targetMap ? targetMap.name : 'Fase Anterior';

    if (this.ui) {
      this.ui.showVanRestartModal(\`Você retornará para \${destName} para explorar novamente ou coletar mais recursos.\`);
    }
  }

  /**
   * Fecha o modal de reinício e afasta suavemente o operador da porta esquerda
   */
  dismissVanRestartAndStepBack() {
    this._vanRestartTriggered = false;
    for (const p of this.players) {
      if (p.x < 160) {
        p.x = 165;
        p.vx = 0;
      }
    }
  }

  /**
   * Verifica se qualquer operador está na área da porta traseira (esquerda) da Van
   */
  isAnyPlayerInRestartZone() {
    const zone = this.currentMap ? (this.currentMap.restartZone || (this.currentMap.triggerZones && this.currentMap.triggerZones.find(t => t.id === 'trigger_sglp'))) : null;
    if (!zone) return false;
    if (this.gameMode === 'singleplayer') {
      const active = this.players[this.activePlayerIndex];
      return active ? active.isTouchingZone(zone) : false;
    }
    return this.p1.isTouchingZone(zone) || this.p2.isTouchingZone(zone);
  }`;

if (!main.includes(targetMethods.replace(/\n/g, nl))) {
  console.error('targetMethods not found');
  process.exit(1);
}
main = main.replace(targetMethods.replace(/\n/g, nl), newMethods.replace(/\n/g, nl));

// 2. Update sound on triggerStageTeleport
const teleportTarget = `    for (const player of this.players) {
      player.vx = 0;
      player.vy = 0;
    }`;

const teleportReplacement = `    for (const player of this.players) {
      player.vx = 0;
      player.vy = 0;
    }

    // Efeito sonoro suave na transição de telas
    if (this.waterSystem && this.waterSystem.audio && typeof this.waterSystem.audio.playSurgeSound === 'function') {
      this.waterSystem.audio.playSurgeSound();
    }`;

if (!main.includes(teleportTarget.replace(/\n/g, nl))) {
  console.error('teleportTarget not found');
  process.exit(1);
}
main = main.replace(teleportTarget.replace(/\n/g, nl), teleportReplacement.replace(/\n/g, nl));

// 3. Update handleInteractShortcut for Safe Room doors
const interactVanDoorsTarget = `      // 2. Interação com a Porta da Van
      if (this.isAnyPlayerInTransitionZone()) {
        if (stageMeta.vanType === 'start' || this.stageFlowIndex === 0) {
          // Van Inicial: avança direto para o Mapa 1
          this.triggerStageTeleport(1, 'Partindo da Van Inicial para o Mapa 1!', false);
        } else {
          // Van Intermediária ou Final: exibe as 2 opções na tela!
          const nextMeta = window.GameConfig.STAGE_FLOW[stageMeta.nextMapIndex ?? (this.stageFlowIndex + 1)];
          const replayMeta = window.GameConfig.STAGE_FLOW[this.lastCompletedStageIndex || 1];
          this.ui.showVanTransitionChoice(nextMeta, replayMeta);
        }
        return;
      }`;

const interactVanDoorsReplacement = `      // 2. Interação com a Porta da Direita da Van (Avançar Direto)
      if (this.isAnyPlayerInTransitionZone()) {
        this.advanceFromVanDirectly();
        return;
      }

      // 3. Interação com a Porta da Esquerda da Van (Retornar / Reiniciar)
      if (this.isAnyPlayerInRestartZone()) {
        this.promptVanRestartConfirmation();
        return;
      }`;

if (!main.includes(interactVanDoorsTarget.replace(/\n/g, nl))) {
  console.error('interactVanDoorsTarget not found');
  process.exit(1);
}
main = main.replace(interactVanDoorsTarget.replace(/\n/g, nl), interactVanDoorsReplacement.replace(/\n/g, nl));

// 4. Update _updateGameplay for Safe Room doors
const autoVanDoorsTarget = `    } else {
      // Safe Room (A Van): Auto-detecção ao tocar na Porta da Van
      const inZone = this.isAnyPlayerInTransitionZone();
      if (inZone) {
        if (!this._vanTransitionTriggered && (!this.screenTransition || !this.screenTransition.active)) {
          this._vanTransitionTriggered = true;
          if (stageMeta.vanType === 'start' || this.stageFlowIndex === 0) {
            // Na primeira fase, se você tocar aqui, automaticamente você é teleportado para a primeira fase!
            this.triggerStageTeleport(1, 'Partindo da Van Inicial para o Mapa 1!', false);
            return;
          } else {
            // Na segunda para frente aparece aquela função de reiniciar ou ir para a próxima fase!
            const nextMeta = window.GameConfig.STAGE_FLOW[stageMeta.nextMapIndex ?? (this.stageFlowIndex + 1)];
            const replayMeta = window.GameConfig.STAGE_FLOW[this.lastCompletedStageIndex || 1];
            if (this.ui) {
              this.ui.showVanTransitionChoice(nextMeta, replayMeta);
            }
          }
        }
      } else {
        this._vanTransitionTriggered = false;
      }
    }`;

const autoVanDoorsReplacement = `    } else {
      // Safe Room (A Van): Auto-detecção ao tocar nas Portas da Van
      // Porta da Direita: Avança direto para a próxima fase ("na de ir vai direto")
      const inAdvanceDoor = this.isAnyPlayerInTransitionZone();
      if (inAdvanceDoor) {
        if (!this._vanTransitionTriggered && (!this.screenTransition || !this.screenTransition.active)) {
          this._vanTransitionTriggered = true;
          this.advanceFromVanDirectly();
          return;
        }
      } else {
        this._vanTransitionTriggered = false;
      }

      // Porta da Esquerda: Confirmação de reinício ("na porta de voltar aparece 'tem certeza que deseja reiniciar?'")
      const inRestartDoor = this.isAnyPlayerInRestartZone();
      if (inRestartDoor) {
        if (!this._vanRestartTriggered && (!this.screenTransition || !this.screenTransition.active)) {
          this._vanRestartTriggered = true;
          this.promptVanRestartConfirmation();
          return;
        }
      } else {
        this._vanRestartTriggered = false;
      }
    }`;

if (!main.includes(autoVanDoorsTarget.replace(/\n/g, nl))) {
  console.error('autoVanDoorsTarget not found');
  process.exit(1);
}
main = main.replace(autoVanDoorsTarget.replace(/\n/g, nl), autoVanDoorsReplacement.replace(/\n/g, nl));

// 5. Update _drawTransitionZone to also draw left door (restartZone) in the Van
const drawVanDoorTarget = `      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('🚪 SAÍDA DA VAN →', centerX, badgeY + 15);

      ctx.fillStyle = '#bae6fd';
      ctx.font = '10px Consolas, monospace';
      ctx.fillText(isStartVan ? 'Toque para Iniciar Fase 1' : 'Toque para Escolher', centerX, badgeY + 28);
    }`;

const drawVanDoorReplacement = `      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('🚪 SAÍDA DA VAN →', centerX, badgeY + 15);

      ctx.fillStyle = '#bae6fd';
      ctx.font = '10px Consolas, monospace';
      ctx.fillText(isStartVan ? 'Toque para Iniciar Fase 1' : 'Toque para Avançar Direto', centerX, badgeY + 28);

      // Porta Traseira da Esquerda (Retornar / Reiniciar)
      if (map.restartZone) {
        const rz = map.restartZone;
        const rCenterX = rz.x + rz.w / 2;
        const rCenterY = rz.y + rz.h / 2;

        // Feixe de luz âmbar derramando da porta traseira
        const lightGradLeft = ctx.createLinearGradient(rz.x, rCenterY, rz.x + rz.w + 40, rCenterY);
        lightGradLeft.addColorStop(0, \`rgba(245, 158, 11, \${0.30 + pulse * 0.16})\`);
        lightGradLeft.addColorStop(0.55, \`rgba(245, 158, 11, \${0.10 + pulse * 0.07})\`);
        lightGradLeft.addColorStop(1, 'rgba(245, 158, 11, 0)');

        ctx.fillStyle = lightGradLeft;
        ctx.beginPath();
        ctx.ellipse(rz.x + rz.w - 10, rCenterY, 52 + pulse * 8, rz.h * 0.52, 0, 0, Math.PI * 2);
        ctx.fill();

        // Chevrons animados indicando retorno (‹ ‹ ‹)
        const chevronCycleLeft = (this.elapsedTime * 42) % 32;
        ctx.strokeStyle = \`rgba(254, 215, 170, \${0.45 + pulse * 0.35})\`;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (let i = 0; i < 3; i++) {
          const cx = rz.x + rz.w - 10 - i * 20 - (chevronCycleLeft % 20);
          if (cx < rz.x + 8) continue;
          ctx.beginPath();
          ctx.moveTo(cx + 4, rCenterY - 10);
          ctx.lineTo(cx - 4, rCenterY);
          ctx.lineTo(cx + 4, rCenterY + 10);
          ctx.stroke();
        }

        // Badge flutuante sobre a porta esquerda
        const rBadgeW = 168;
        const rBadgeH = 36;
        const rBadgeX = rCenterX - rBadgeW / 2;
        const rBadgeY = rz.y - 42 + bobY;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(rBadgeX, rBadgeY, rBadgeW, rBadgeH, 10);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 12px Consolas, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('🚪 ← RETORNAR', rCenterX, rBadgeY + 15);

        ctx.fillStyle = '#fed7aa';
        ctx.font = '10px Consolas, monospace';
        ctx.fillText('Toque para Reiniciar', rCenterX, rBadgeY + 28);
      }
    }`;

if (!main.includes(drawVanDoorTarget.replace(/\n/g, nl))) {
  console.error('drawVanDoorTarget not found');
  process.exit(1);
}
main = main.replace(drawVanDoorTarget.replace(/\n/g, nl), drawVanDoorReplacement.replace(/\n/g, nl));

fs.writeFileSync('js/main.js', main, 'utf8');
console.log('Successfully updated js/main.js');

