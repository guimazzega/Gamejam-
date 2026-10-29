const fs = require('fs');
let content = fs.readFileSync('js/main.js', 'utf8');

// 1. loadStageByFlowIndex water check
content = content.replace(
  `      // Gerencia o estado da água no Mapa 1
      if (this.currentMap && this.currentMap.id === 'map1') {
        const fixedSpawns = window.GlobalState.getFixedTrashSpawns(this.currentMap);
        const total = fixedSpawns.length || 16;
        const alreadyCollected = fixedSpawns.filter(t => window.GlobalState.isTrashCollected(t.id)).length;
        if (alreadyCollected >= Math.ceil(total / 2)) {
          this._drainMap1Water(false);
        } else {
          this._restoreMap1Water();
        }
      }`,
  `      // Gerencia o estado da água no Mapa 1 (Drena após 5 lixos)
      if (this.currentMap && this.currentMap.id === 'map1') {
        const fixedSpawns = window.GlobalState.getFixedTrashSpawns(this.currentMap);
        const alreadyCollected = fixedSpawns.filter(t => window.GlobalState.isTrashCollected(t.id)).length;
        if (alreadyCollected >= 5) {
          this._drainMap1Water(false);
        } else {
          this._restoreMap1Water();
        }
      }`
);

// 2. _drainMap1Water and _restoreMap1Water
content = content.replace(
  `  _drainMap1Water(notify = true) {
    const map = window.GameMaps ? window.GameMaps.map1 : null;
    if (!map) return;
    map.isWaterDrained = true;

    // Atualiza a lista de obstáculos ativos removendo os blocos de colisão da água
    if (Array.isArray(map.baseObstacles)) {
      map.obstacles = map.baseObstacles.slice();
    }

    if (notify) {
      if (this.waterSystem && this.waterSystem.audio) {
        this.waterSystem.audio.playSurgeSound();
      }
      if (this.camera) {
        this.camera.triggerShake(0.8, 5);
      }
      const activePlayer = this.getHudFocusPlayer();
      this.floatingTexts.push(
        new window.FloatingText(
          activePlayer.x,
          activePlayer.y - 45,
          '🌊 O NÍVEL DA ÁGUA BAIXOU! CAMINHO LIVRE!',
          '#38bdf8',
          2.6
        )
      );
      if (this.ui) {
        this.ui.showToast('🌊 O nível da água baixou! O canal secou e agora você pode atravessar.');
      }
      console.log('🌊 [FASE 1] Metade do lixo coletada! Água drenada e fundo trocado para versão seca.');
    }
  }

  /**
   * Restaura os obstáculos de água do Mapa 1 caso seja reiniciado
   */
  _restoreMap1Water() {
    const map = window.GameMaps ? window.GameMaps.map1 : null;
    if (!map) return;
    map.isWaterDrained = false;
    if (Array.isArray(map.baseObstacles) && Array.isArray(map.waterObstacles)) {
      map.obstacles = map.baseObstacles.concat(map.waterObstacles);
    }
  }`,
  `  _drainMap1Water(notify = true) {
    const map = window.GameMaps ? window.GameMaps.map1 : null;
    if (!map) return;
    map.isWaterDrained = true;

    // Alterna para Cena 2 (onde a colisão água foi desativada)
    if (Array.isArray(map.scenes) && map.scenes.length > 1) {
      map.currentScene = 1;
      map.layers = map.scenes[1].layers;
      if (typeof window.buildMapCollisionBounds === 'function') {
        window.buildMapCollisionBounds(map);
      }
    } else if (Array.isArray(map.baseObstacles)) {
      map.obstacles = map.baseObstacles.slice();
      if (typeof window.buildMapCollisionBounds === 'function') {
        window.buildMapCollisionBounds(map);
      }
    }

    if (notify) {
      if (this.waterSystem && this.waterSystem.audio) {
        this.waterSystem.audio.playSurgeSound();
      }
      if (this.camera) {
        this.camera.triggerShake(0.8, 5);
      }
      const activePlayer = this.getHudFocusPlayer();
      this.floatingTexts.push(
        new window.FloatingText(
          activePlayer.x,
          activePlayer.y - 45,
          '🌊 O NÍVEL DA ÁGUA BAIXOU! CAMINHO LIVRE!',
          '#38bdf8',
          2.6
        )
      );
      if (this.ui) {
        this.ui.showToast('🌊 O nível da água baixou! O canal secou e agora você pode atravessar.');
      }
      console.log('🌊 [FASE 1] 5 lixos coletados! Água drenada e fundo trocado para versão seca.');
    }
  }

  /**
   * Restaura os obstáculos de água do Mapa 1 caso seja reiniciado (Cena 1 - Com Água)
   */
  _restoreMap1Water() {
    const map = window.GameMaps ? window.GameMaps.map1 : null;
    if (!map) return;
    map.isWaterDrained = false;
    if (Array.isArray(map.scenes) && map.scenes.length > 0) {
      map.currentScene = 0;
      map.layers = map.scenes[0].layers;
      if (typeof window.buildMapCollisionBounds === 'function') {
        window.buildMapCollisionBounds(map);
      }
    } else if (Array.isArray(map.baseObstacles) && Array.isArray(map.waterObstacles)) {
      map.obstacles = map.baseObstacles.concat(map.waterObstacles);
      if (typeof window.buildMapCollisionBounds === 'function') {
        window.buildMapCollisionBounds(map);
      }
    }
  }`
);

// 3. trashTotal in line 424 and 665
content = content.replace(
  `const trashTotal = (this.currentMap && this.currentMap.trashSpawns) ? Math.min(16, this.currentMap.trashSpawns.length) : 16;`,
  `const trashTotal = (this.currentMap && this.currentMap.trashSpawns) ? this.currentMap.trashSpawns.length : 16;`
);

content = content.replace(
  `      trashTotal: 16\n    };`,
  `      trashTotal: (this.currentMap && this.currentMap.trashSpawns) ? this.currentMap.trashSpawns.length : 16\n    };`
);

// 4. handleInteraction triggerZones support
content = content.replace(
  `      // Nos Mapas Normais: interação na Zona de Extração conclui a fase e entra na Van
      if (this.isAnyPlayerInTransitionZone()) {
        this.completeCurrentMapAndEnterVan();
        return;
      }
    }`,
  `      // Nos Mapas Normais: interação na Zona de Extração conclui a fase e entra na Van
      if (this.isAnyPlayerInTransitionZone()) {
        this.completeCurrentMapAndEnterVan();
        return;
      }

      // Interação com Trigger Zones (ex: trigger_044f)
      if (this.currentMap && Array.isArray(this.currentMap.triggerZones)) {
        for (const trigger of this.currentMap.triggerZones) {
          if (this.players.some(p => p.isTouchingZone(trigger))) {
            let msg = trigger.ai_instruction || 'Em breve...';
            msg = msg.replace(/^Abrir aviso escrito ["']?|["']$/gi, '').trim();
            if (!msg) msg = 'Em breve...';
            this.ui.showToast(\`🚧 \${msg}\`, 2600);
            return;
          }
        }
      }
    }`
);

// 5. _updateGameplay water collision and triggers
content = content.replace(
  `    // Verificação de segurança: Não permitir que o jogador toque na água enquanto ela estiver lá
    if (this.currentMap && this.currentMap.id === 'map1' && !this.currentMap.isWaterDrained && Array.isArray(this.currentMap.waterObstacles)) {
      for (const player of this.players) {
        const pBox = player.getBoundingBox();
        for (const wObs of this.currentMap.waterObstacles) {
          if (player._aabbOverlap(pBox, wObs)) {
            const pCenterX = player.x;
            const pCenterY = player.y;
            const wCenterX = wObs.x + wObs.w / 2;
            const wCenterY = wObs.y + wObs.h / 2;
            const dx = pCenterX - wCenterX;
            const dy = pCenterY - wCenterY;
            const dist = Math.hypot(dx, dy) || 1;
            player.x += (dx / dist) * 14;
            player.y += (dy / dist) * 14;
            player.resolveMapCollisions(this.currentMap);

            if (this.waterSystem && this.waterSystem.audio) {
              this.waterSystem.audio.playBubbleSound();
            }
            if (!player.lastWaterWarningTime || (this.elapsedTime - player.lastWaterWarningTime > 2.0)) {
              player.lastWaterWarningTime = this.elapsedTime;
              this.floatingTexts.push(
                new window.FloatingText(
                  player.x,
                  player.y - 25,
                  '⚠️ Água profunda! Não toque na água!',
                  '#38bdf8',
                  1.2
                )
              );
            }
            break;
          }
        }
      }
    }`,
  `    // Verificação de segurança: Não permitir que o jogador toque na água enquanto ela estiver lá
    if (this.currentMap && this.currentMap.id === 'map1' && !this.currentMap.isWaterDrained) {
      const waterItems = [];
      if (Array.isArray(this.currentMap.waterObstacles)) {
        waterItems.push(...this.currentMap.waterObstacles);
      }
      if (Array.isArray(this.currentMap.layers) && this.currentMap.layers[2]) {
        const agua = this.currentMap.layers[2].items.find(it => it.label === 'Colisão água' || it.id === 'poly_obs_mvtmuz3u_ibe');
        if (agua && !waterItems.includes(agua)) waterItems.push(agua);
      }
      for (const player of this.players) {
        for (const wObs of waterItems) {
          if (player.isTouchingZone(wObs)) {
            player.resolveMapCollisions(this.currentMap);

            if (this.waterSystem && this.waterSystem.audio) {
              this.waterSystem.audio.playBubbleSound();
            }
            if (!player.lastWaterWarningTime || (this.elapsedTime - player.lastWaterWarningTime > 2.0)) {
              player.lastWaterWarningTime = this.elapsedTime;
              this.floatingTexts.push(
                new window.FloatingText(
                  player.x,
                  player.y - 25,
                  '⚠️ Água profunda! Não toque na água!',
                  '#38bdf8',
                  1.2
                )
              );
            }
            break;
          }
        }
      }
    }

    // Verificação de Trigger Zones ativas no mapa (ex: trigger_044f)
    if (this.currentMap && Array.isArray(this.currentMap.triggerZones)) {
      for (const trigger of this.currentMap.triggerZones) {
        for (const player of this.players) {
          if (player.isTouchingZone(trigger)) {
            const now = this.elapsedTime || 0;
            if (!trigger._lastFired || now - trigger._lastFired > 3.0) {
              trigger._lastFired = now;
              let msg = trigger.ai_instruction || 'Em breve...';
              msg = msg.replace(/^Abrir aviso escrito ["']?|["']$/gi, '').trim();
              if (!msg) msg = 'Em breve...';
              if (this.ui) {
                this.ui.showToast(\`🚧 \${msg}\`, 2600);
              }
              this.floatingTexts.push(
                new window.FloatingText(
                  trigger.x + (trigger.w || 0) / 2,
                  trigger.y - 20,
                  \`🚧 \${msg}\`,
                  '#facc15',
                  2.2
                )
              );
            }
            break;
          }
        }
      }
    }`
);

// 6. _checkTrashCollection: drain at 5 trashes
content = content.replace(
  `        // Verificação de Drenagem da Água da Fase 1 (ao atingir 50% dos lixos = 8 lixos)
        if (this.currentMap && this.currentMap.id === 'map1' && !this.currentMap.isWaterDrained) {
          const fixedSpawns = window.GlobalState.getFixedTrashSpawns(this.currentMap);
          const totalSpawns = fixedSpawns.length || 16;
          const collectedTotal = fixedSpawns.filter(t => window.GlobalState.isTrashCollected(t.id)).length;
          const halfTrash = Math.ceil(totalSpawns / 2);
          if (collectedTotal >= halfTrash) {
            this._drainMap1Water(true);
          }
        }`,
  `        // Verificação de Drenagem da Água da Fase 1 (ao atingir 5 lixos coletados)
        if (this.currentMap && this.currentMap.id === 'map1' && !this.currentMap.isWaterDrained) {
          const fixedSpawns = window.GlobalState.getFixedTrashSpawns(this.currentMap);
          const collectedTotal = fixedSpawns.filter(t => window.GlobalState.isTrashCollected(t.id)).length;
          if (collectedTotal >= 5) {
            this._drainMap1Water(true);
          }
        }`
);

// 7. Step 3 Foreground Overhead draws obstacle/shapes if overhead
content = content.replace(
  `          if (isItemOverhead) {
            if (item.type === 'sprite' || item.src) {
              this._drawRotatedSpriteItem(ctx, item);
            }
          }`,
  `          if (isItemOverhead) {
            if (item.type === 'sprite' || item.src) {
              this._drawRotatedSpriteItem(ctx, item);
            } else if (item.type === 'obstacle' || item.polygon || (item.w && item.h)) {
              this._drawSingleObstacle(ctx, item, map);
            }
          }`
);

// 8. _drawSingleObstacle implementation
if (!content.includes('_drawSingleObstacle(ctx, obs, map) {')) {
  content = content.replace(
    `  _drawObstacles(ctx, map) {`,
    `  _drawSingleObstacle(ctx, obs, map) {
    if (!obs) return;
    if (obs.polygon && Array.isArray(obs.polygon) && obs.polygon.length >= 3) {
      ctx.fillStyle = obs.customFill || ((map.palette && map.palette.wallFill) || 'rgba(30, 41, 59, 0.94)');
      ctx.strokeStyle = obs.customStroke || ((map.palette && map.palette.wallStroke) || '#38bdf8');
      ctx.lineWidth = obs.customStroke ? 2.5 : 2;

      ctx.beginPath();
      ctx.moveTo(obs.polygon[0].x, obs.polygon[0].y);
      for (let i = 1; i < obs.polygon.length; i++) {
        ctx.lineTo(obs.polygon[i].x, obs.polygon[i].y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      if (obs.label && obs.w >= 60 && obs.h >= 40) {
        let cx = 0, cy = 0;
        for (const p of obs.polygon) { cx += p.x; cy += p.y; }
        cx /= obs.polygon.length;
        cy /= obs.polygon.length;
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 11px Consolas, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(obs.label, cx, cy);
      }
      return;
    }

    ctx.fillStyle = obs.customFill || ((map.palette && map.palette.wallFill) || 'rgba(30, 41, 59, 0.94)');
    ctx.fillRect(obs.x, obs.y, obs.w, obs.h);

    ctx.strokeStyle = obs.customStroke || ((map.palette && map.palette.wallStroke) || '#38bdf8');
    ctx.lineWidth = obs.customStroke ? 2.5 : 2;
    ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);

    if (obs.label && obs.w >= 120 && obs.h >= 65) {
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(obs.label || 'ESTRUTURA', obs.x + obs.w / 2, obs.y + obs.h / 2 - 4);

      if (obs.subTag) {
        ctx.fillStyle = obs.customStroke || 'rgba(226, 232, 240, 0.65)';
        ctx.font = '10px Consolas, monospace';
        ctx.fillText(obs.subTag, obs.x + obs.w / 2, obs.y + obs.h / 2 + 12);
      }
    }
  }

  _drawObstacles(ctx, map) {`
  );
}

fs.writeFileSync('js/main.js', content, 'utf8');
console.log('Successfully updated js/main.js!');

