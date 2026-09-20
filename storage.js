// js/modules/storage.js
// Handles all localStorage persistence

const Storage = (() => {
  const KEYS = {
    coins:       'bd_coins',
    hiscore:     'bd_hiscore',
    stats:       'bd_stats',
    inventory:   'bd_inventory',
    difficulty:  'bd_difficulty',
  };

  function get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  }

  function set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (e) { console.warn('Storage write failed', e); }
  }

  // ── COINS ──────────────────────────────────────────
  function getCoins()         { return get(KEYS.coins, 0); }
  function addCoins(n)        { set(KEYS.coins, getCoins() + n); }
  function spendCoins(n)      {
    const c = getCoins();
    if (c < n) return false;
    set(KEYS.coins, c - n);
    return true;
  }

  // ── HIGH SCORE ─────────────────────────────────────
  function getHiscore()       { return get(KEYS.hiscore, null); }
  function submitScore(score) {
    const prev = getHiscore();
    if (prev === null || score > prev) { set(KEYS.hiscore, score); return true; }
    return false;
  }

  // ── STATS ──────────────────────────────────────────
  function defaultStats() {
    return { gamesPlayed: 0, gamesWon: 0, puzzlesSolved: 0, bestTime: null };
  }
  function getStats()         { return get(KEYS.stats, defaultStats()); }
  function updateStats(patch) {
    const s = getStats();
    Object.assign(s, patch);
    set(KEYS.stats, s);
  }
  function recordGame({ won, puzzlesSolved, timeLeft }) {
    const s = getStats();
    s.gamesPlayed++;
    if (won) s.gamesWon++;
    s.puzzlesSolved += puzzlesSolved;
    if (won && (s.bestTime === null || timeLeft > s.bestTime)) s.bestTime = timeLeft;
    set(KEYS.stats, s);
  }

  // ── INVENTORY ──────────────────────────────────────
  function defaultInventory() {
    return { extraHints: 0, extraTime: 0, shield: 0 };
  }
  function getInventory()     { return get(KEYS.inventory, defaultInventory()); }
  function addItem(item, qty = 1) {
    const inv = getInventory();
    inv[item] = (inv[item] || 0) + qty;
    set(KEYS.inventory, inv);
  }
  function useItem(item) {
    const inv = getInventory();
    if (!inv[item] || inv[item] <= 0) return false;
    inv[item]--;
    set(KEYS.inventory, inv);
    return true;
  }

  // ── DIFFICULTY ─────────────────────────────────────
  function getDifficulty()       { return get(KEYS.difficulty, 0); } // 0=Rookie…3=Elite
  function setDifficulty(idx)    { set(KEYS.difficulty, idx); }

  return {
    getCoins, addCoins, spendCoins,
    getHiscore, submitScore,
    getStats, updateStats, recordGame,
    getInventory, addItem, useItem,
    getDifficulty, setDifficulty,
  };
})();
