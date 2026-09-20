// js/main.js
// Entry point — binds all UI events and bootstraps the game

(function () {
  // ── STATE ────────────────────────────────────────────
  let currentLevel = 1;
  let diffIdx      = Storage.getDifficulty();
  const DIFF_NAMES = ['ROOKIE', 'AGENT', 'VETERAN', 'ELITE'];

  // ── INIT ─────────────────────────────────────────────
  function init() {
    Audio.init();
    HUD.init();
    updateDiffLabel();
    Screens.show('menu');
    bindEvents();
  }

  function updateDiffLabel() {
    const el = document.getElementById('diff-label');
    if (el) el.textContent = DIFF_NAMES[diffIdx] || 'ROOKIE';
  }

  // ── BIND EVENTS ──────────────────────────────────────
  function bindEvents() {
    // MENU
    $('btn-start').addEventListener('click', () => {
      Audio.resume();
      Audio.playClick();
      currentLevel = 1;
      startGame();
    });

    $('btn-difficulty').addEventListener('click', () => {
      Audio.playClick();
      diffIdx = (diffIdx + 1) % DIFF_NAMES.length;
      Storage.setDifficulty(diffIdx);
      updateDiffLabel();
    });

    $('btn-shop').addEventListener('click', () => {
      Audio.playClick();
      Screens.show('shop');
    });

    $('btn-stats').addEventListener('click', () => {
      Audio.playClick();
      Screens.show('stats');
    });

    $('btn-how').addEventListener('click', () => {
      Audio.playClick();
      Screens.show('how');
    });

    // GAME HUD
    $('btn-hint').addEventListener('click', () => {
      const hint = Game.useHint();
      if (hint) {
        document.getElementById('hint-text').textContent = hint;
        document.getElementById('hint-modal').classList.remove('hidden');
      } else {
        alert('No hints remaining!');
      }
    });

    $('btn-hint-close').addEventListener('click', () => {
      document.getElementById('hint-modal').classList.add('hidden');
    });

    $('btn-pause').addEventListener('click', () => {
      Audio.playClick();
      Game.pause();
      Screens.show('pause');
    });

    // PAUSE
    $('btn-resume').addEventListener('click', () => {
      Audio.playClick();
      Game.resume();
      Screens.show('game');
    });

    $('btn-quit-pause').addEventListener('click', () => {
      Audio.playClick();
      Game.quit();
      Screens.show('menu');
    });

    // WIN
    $('btn-next-level').addEventListener('click', () => {
      Audio.playClick();
      currentLevel++;
      if (currentLevel > Difficulty.getTotalLevels()) {
        // All levels beaten — go back to menu with celebration
        alert('🎉 YOU BEAT ALL LEVELS! ELITE AGENT STATUS ACHIEVED!');
        Screens.show('menu');
      } else {
        startGame();
      }
    });

    $('btn-menu-win').addEventListener('click', () => {
      Audio.playClick();
      Screens.show('menu');
    });

    // LOSE
    $('btn-retry').addEventListener('click', () => {
      Audio.playClick();
      startGame();
    });

    $('btn-menu-lose').addEventListener('click', () => {
      Audio.playClick();
      Screens.show('menu');
    });

    // SHOP
    $('btn-shop-close').addEventListener('click', () => {
      Audio.playClick();
      Screens.show('menu');
    });

    // STATS
    $('btn-stats-close').addEventListener('click', () => {
      Audio.playClick();
      Screens.show('menu');
    });

    // HOW TO PLAY
    $('btn-how-close').addEventListener('click', () => {
      Audio.playClick();
      Screens.show('menu');
    });

    // Close hint modal on backdrop click
    document.getElementById('hint-modal').addEventListener('click', e => {
      if (e.target === e.currentTarget) {
        e.currentTarget.classList.add('hidden');
      }
    });
  }

  // ── GAME START ───────────────────────────────────────
  function startGame() {
    Screens.show('game');
    Game.start(currentLevel, diffIdx);
  }

  // ── HELPERS ──────────────────────────────────────────
  function $(id) { return document.getElementById(id); }

  // ── BOOT ─────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', init);
})();
