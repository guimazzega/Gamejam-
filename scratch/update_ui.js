const fs = require('fs');

let ui = fs.readFileSync('js/ui.js', 'utf8');
const isCRLF = ui.includes('\r\n');
const nl = isCRLF ? '\r\n' : '\n';

// 1. Add constructor properties
const propTarget = "this.vanReplayStageDesc = document.getElementById('van-replay-stage-desc');";
const propAddition = `${nl}    // Modal de Confirmação de Reinício da Van (Porta Esquerda)${nl}    this.vanRestartModal = document.getElementById('van-restart-modal-overlay');${nl}    this.vanRestartDesc = document.getElementById('van-restart-desc');${nl}    this.btnVanRestartConfirm = document.getElementById('btn-van-restart-confirm');${nl}    this.btnVanRestartCancel = document.getElementById('btn-van-restart-cancel');`;

if (!ui.includes(propTarget)) {
  console.error('propTarget not found in ui.js');
  process.exit(1);
}
ui = ui.replace(propTarget, propTarget + propAddition);

// 2. Add event listeners
const listenerTarget = `    if (this.btnVanStay) {${nl}      this.btnVanStay.addEventListener('click', () => {${nl}        this.hideVanTransitionChoice();${nl}      });${nl}    }`;

const listenerAddition = `${nl}${nl}    if (this.btnVanRestartConfirm) {${nl}      this.btnVanRestartConfirm.addEventListener('click', () => {${nl}        this.hideVanRestartModal();${nl}        if (this.game && typeof this.game.confirmVanReplayPrevious === 'function') {${nl}          this.game.confirmVanReplayPrevious();${nl}        }${nl}      });${nl}    }${nl}${nl}    if (this.btnVanRestartCancel) {${nl}      this.btnVanRestartCancel.addEventListener('click', () => {${nl}        this.hideVanRestartModal();${nl}        if (this.game && typeof this.game.dismissVanRestartAndStepBack === 'function') {${nl}          this.game.dismissVanRestartAndStepBack();${nl}        }${nl}      });${nl}    }`;

if (!ui.includes(listenerTarget)) {
  console.error('listenerTarget not found in ui.js');
  process.exit(1);
}
ui = ui.replace(listenerTarget, listenerTarget + listenerAddition);

// 3. Add show/hide methods
const methodTarget = `  hideVanTransitionChoice() {${nl}    if (this.vanTransitionModal) {${nl}      this.vanTransitionModal.classList.add('hidden');${nl}    }${nl}  }`;

const methodAddition = `${nl}${nl}  showVanRestartModal(desc) {${nl}    if (!this.vanRestartModal) return;${nl}    if (this.vanRestartDesc && desc) {${nl}      this.vanRestartDesc.textContent = desc;${nl}    }${nl}    this.vanRestartModal.classList.remove('hidden');${nl}  }${nl}${nl}  hideVanRestartModal() {${nl}    if (this.vanRestartModal) {${nl}      this.vanRestartModal.classList.add('hidden');${nl}    }${nl}  }`;

if (!ui.includes(methodTarget)) {
  console.error('methodTarget not found in ui.js');
  process.exit(1);
}
ui = ui.replace(methodTarget, methodTarget + methodAddition);

fs.writeFileSync('js/ui.js', ui, 'utf8');
console.log('Successfully updated js/ui.js');
