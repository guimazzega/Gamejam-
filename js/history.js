/**
 * js/history.js
 * Sistema de Histórico e Desfazer Unificado (Ctrl + Z) - Sprint 11
 * 
 * Implementação do Padrão Memento com Pilha de Estados (State Stack):
 * 1. Arquitetura Genérica (HistoryManager):
 *    - Mantém uma pilha linear 'historyStack' de snapshots (Deep Copy serializado).
 *    - Limite de memória rigoroso (30 a 50 passos, padrão 40) com descarte do estado mais antigo (shift).
 * 2. Gatilhos de Salvamento (Commit State):
 *    - Grava o estado imediatamente antes de adições, exclusões, duplicações, rotações,
 *      mudança de Z-Index, alterações de propriedades e ao término do arrasto/redimensionamento (mouseup).
 * 3. Captura Global de Input (Ctrl + Z):
 *    - Monitora 'Ctrl + Z', cancela ações padrão do navegador (preventDefault) e dispara 'desfazer()'.
 * 4. Lógica de Reversão (Undo):
 *    - Remove (pop) o estado anterior, substitui o estado atual e dispara renderização forçada (forceRender).
 */

class HistoryManager {
  /**
   * @param {Object} options
   * @param {string} options.name Nome identificador da ferramenta (ex: 'MapEditor' ou 'UIEditor')
   * @param {number} options.maxSteps Limite máximo de estados na pilha (30 a 50 passos)
   * @param {Function} options.getState Callback que retorna o snapshot atual
   * @param {Function} options.onRestore Callback acionado ao restaurar um snapshot
   */
  constructor(options = {}) {
    this.name = options.name || 'Generic';
    // Limite de passos configurável entre 30 e 50 (padrão: 40)
    this.maxSteps = Math.max(10, Math.min(50, options.maxSteps || 40));
    this.historyStack = [];
    this.getState = options.getState || null;
    this.onRestore = options.onRestore || null;
  }

  /**
   * Grava um novo snapshot serializado na pilha imediatamente antes de uma modificação
   * @param {Object|string} [state] Snapshot a ser gravado (se omitido, chama this.getState())
   * @param {string} [actionName] Descrição da ação sendo gravada
   */
  commit(state = null, actionName = 'Modificação') {
    let snapshot = state;
    if (!snapshot && typeof this.getState === 'function') {
      snapshot = this.getState();
    }
    if (!snapshot) return;

    try {
      // Cópia profunda serializada via JSON para total isolamento de referências na memória
      const serialized = typeof snapshot === 'string' ? snapshot : JSON.stringify(snapshot);

      this.historyStack.push({
        action: actionName,
        timestamp: Date.now(),
        data: serialized
      });

      // Limite de Memória: descarta o estado mais antigo se ultrapassar maxSteps
      if (this.historyStack.length > this.maxSteps) {
        this.historyStack.shift();
      }
    } catch (err) {
      console.warn(`[HistoryManager:${this.name}] Erro ao gravar snapshot de histórico:`, err);
    }
  }

  /**
   * Desfaz a ação mais recente
   * @returns {boolean} Retorna true se um estado foi desfeito com sucesso
   */
  undo() {
    if (!this.canUndo()) {
      return false;
    }

    const entry = this.historyStack.pop();
    if (!entry || !entry.data) return false;

    try {
      const parsed = JSON.parse(entry.data);
      if (typeof this.onRestore === 'function') {
        this.onRestore(parsed, entry.action);
      }
      return true;
    } catch (err) {
      console.error(`[HistoryManager:${this.name}] Erro ao desserializar e restaurar estado:`, err);
      return false;
    }
  }

  /**
   * Verifica se há estados disponíveis para reversão
   * @returns {boolean}
   */
  canUndo() {
    return this.historyStack.length > 0;
  }

  /**
   * Limpa a pilha de histórico
   */
  clear() {
    this.historyStack = [];
  }

  /**
   * Retorna a quantidade de passos gravados
   * @returns {number}
   */
  size() {
    return this.historyStack.length;
  }
}

// ===========================================================================
// CAPTURA GLOBAL DE INPUT (Ctrl + Z) - Requisito 3
// ===========================================================================
window.addEventListener('keydown', (event) => {
  // Lógica de Input: if (event.ctrlKey && (event.key === 'z' || event.key === 'Z')) { desfazer(); }
  if (event.ctrlKey && (event.key === 'z' || event.key === 'Z')) {
    const game = window.game || window.gameInstance;
    if (!game) return;

    // 1. Se o Editor de Menus (UIEditor) estiver ativo, desfaz nele
    if (game.uiEditor && game.uiEditor.active) {
      event.preventDefault();
      game.uiEditor.desfazer();
      return;
    }

    // 2. Se o Editor de Mapas (MapEditor) estiver ativo, desfaz nele
    if (game.editor && game.editor.active) {
      event.preventDefault();
      game.editor.desfazer();
      return;
    }
  }
});

window.HistoryManager = HistoryManager;

