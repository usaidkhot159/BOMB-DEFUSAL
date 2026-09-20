// js/modules/screens.js
// Screen routing and result display

const Screens = (() => {
  const SCREENS = ['menu','game','pause','win','lose','shop','stats','how'];

  function show(name, data = {}) {
    SCREENS.forEach(id => {
      const el = document.getElementById(`screen-${id}`);
      if (el) el.classList.remove('active');
    });
    const target = document.getElementById(`screen-${name}`);
    if (target) target.classList.add('active');

    // Populate data for result screens
    if (name === 'win') {
      const fmt = s => {
        const m = Math.floor(s / 60).toString().padStart(2,'0');
        const sec = (s % 60).toString().padStart(2,'0');
        return `${m}:${sec}`;
      };
      setText('win-time',    fmt(data.time    || 0));
      setText('win-puzzles', data.puzzles || 0);
      setText('win-lives',   data.lives   || 0);
      setText('win-coins',   `+${data.coins || 0} 🪙`);
      updateMenuCoins();
    }

    if (name === 'lose') {
      setText('lose-reason',  data.reason  || 'The bomb detonated.');
      setText('lose-level',   data.level   || '--');
      setText('lose-puzzles', data.puzzles || 0);
    }

    if (name === 'menu') {
      updateMenuCoins();
      updateMenuHiscore();
    }

    if (name === 'shop') {
      Shop.renderShop();
    }

    if (name === 'stats') {
      Stats.render();
    }
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function updateMenuCoins() {
    setText('menu-coins', Storage.getCoins());
    setText('val-coins',  Storage.getCoins());
  }

  function updateMenuHiscore() {
    const hs = Storage.getHiscore();
    setText('menu-hiscore', hs !== null ? hs : '--');
  }

  return { show };
})();
