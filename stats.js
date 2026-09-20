// js/modules/stats.js
// Renders the stats screen

const Stats = (() => {

  function formatTime(seconds) {
    if (seconds === null || seconds === undefined) return '--';
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function render() {
    const el = document.getElementById('stats-content');
    if (!el) return;
    const s = Storage.getStats();
    const winRate = s.gamesPlayed > 0
      ? Math.round((s.gamesWon / s.gamesPlayed) * 100) + '%'
      : '--';

    el.innerHTML = `
      <div class="stat-row"><span>Games Played</span><span>${s.gamesPlayed}</span></div>
      <div class="stat-row"><span>Missions Completed</span><span>${s.gamesWon}</span></div>
      <div class="stat-row"><span>Win Rate</span><span>${winRate}</span></div>
      <div class="stat-row"><span>Puzzles Solved</span><span>${s.puzzlesSolved}</span></div>
      <div class="stat-row accent"><span>Best Time Remaining</span><span>${formatTime(s.bestTime)}</span></div>
    `;
  }

  return { render };
})();
