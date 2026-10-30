const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const targetStr = '<button type="button" id="btn-van-stay" class="stardew-btn btn-secondary">';
const idx = html.indexOf(targetStr);
if (idx === -1) {
  console.error('Target not found');
  process.exit(1);
}

// Find the closing </div>\n  </div> of that modal
const endIdx = html.indexOf('</div>\n  </div>', idx) !== -1 
  ? html.indexOf('</div>\n  </div>', idx) + '</div>\n  </div>'.length 
  : html.indexOf('</div>\r\n  </div>', idx) + '</div>\r\n  </div>'.length;

const restartModal = `

  <!-- ==================== 1.5. MODAL DE CONFIRMAÇÃO DE REINÍCIO (PORTA ESQUERDA DA VAN) ==================== -->
  <div id="van-restart-modal-overlay" class="menu-overlay hidden">
    <div class="stardew-panel van-transition-card" style="max-width: 480px; text-align: center;">
      <div class="dev-ribbon">PORTA TRASEIRA DA VAN • REINÍCIO</div>
      <h2 class="modal-title" style="margin-top: 10px; font-size: 1.5rem;">Tem certeza que deseja reiniciar?</h2>
      <p class="settings-subtitle" id="van-restart-desc" style="margin-bottom: 22px;">
        Você retornará para a fase anterior para explorar novamente ou coletar mais recursos.
      </p>

      <div class="menu-actions" style="display: flex; gap: 14px; justify-content: center; margin-top: 16px;">
        <button type="button" id="btn-van-restart-confirm" class="stardew-btn btn-danger" style="background: #dc2626; border-color: #ef4444; color: #fff; font-weight: bold; min-width: 140px;">
          Sim, reiniciar
        </button>
        <button type="button" id="btn-van-restart-cancel" class="stardew-btn btn-secondary" style="min-width: 140px;">
          Permanecer na Van
        </button>
      </div>
    </div>
  </div>`;

html = html.slice(0, endIdx) + restartModal + html.slice(endIdx);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully injected van restart modal into index.html');

