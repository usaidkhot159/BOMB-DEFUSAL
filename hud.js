// js/modules/hud.js
// Updates the heads-up display elements

const HUD = (() => {
  const els = {};

  function init() {
    els.level   = document.getElementById('val-level');
    els.puzzle  = document.getElementById('val-puzzle');
    els.total   = document.getElementById('val-total');
    els.lives   = document.getElementById('val-lives');
    els.coins   = document.getElementById('val-coins');
    els.hints   = document.getElementById('val-hints');
  }

  function set(key, val) {
    if (els[key]) els[key].textContent = val;
  }

  function update(state) {
    set('level',  state.level);
    set('puzzle', state.puzzleIndex + 1);
    set('total',  state.totalPuzzles);
    set('lives',  state.lives);
    set('coins',  state.coins);
    set('hints',  state.hints);
  }

  function flashLives() {
    Anim.pop(document.getElementById('hud-lives'));
  }

  function flashCoins() {
    Anim.pop(document.getElementById('hud-coins'));
  }

  return { init, set, update, flashLives, flashCoins };
})();
