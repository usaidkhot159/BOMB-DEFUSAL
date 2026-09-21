// js/puzzles/switch.js
// Toggle switches to match a target pattern

const SwitchPuzzle = (() => {

  function randomBool() { return Math.random() < 0.5; }

  function generate(level = 1) {
    const count   = Math.min(4 + Math.floor(level / 2), 7);
    const target  = Array.from({ length: count }, randomBool);
    // Start with random state (different from target)
    let current;
    do {
      current = Array.from({ length: count }, randomBool);
    } while (current.join() === target.join());

    const hint = `Target pattern: ${target.map(v => v ? 'ON' : 'OFF').join(', ')}`;
    return { type: 'switch', count, target, current: [...current], hint };
  }

  function render(puzzle, onCorrect, onWrong) {
    Bomb.clearWires();
    Bomb.setScreen('SET PATTERN');

    // Working state
    const state = [...puzzle.current];

    const content = document.getElementById('puzzle-content');
    content.innerHTML = `
      <div class="switch-puzzle-wrap">
        <div class="switch-target">
          <div class="switch-target-label">TARGET PATTERN</div>
          <div class="switch-target-pattern">
            ${puzzle.target.map((v, i) => `
              <div class="target-pip ${v ? 'on' : ''}" title="${v ? 'ON' : 'OFF'}"></div>
            `).join('')}
          </div>
        </div>
        <div class="switch-row" id="switch-row">
          ${state.map((v, i) => `
            <div class="switch-unit">
              <div class="switch-label">SW${i + 1}</div>
              <div class="switch-toggle ${v ? 'on' : ''}" data-idx="${i}" id="sw-${i}"></div>
              <div class="switch-label" id="sw-lbl-${i}">${v ? 'ON' : 'OFF'}</div>
            </div>
          `).join('')}
        </div>
        <button class="btn-check" id="btn-check-switches">✔ CONFIRM PATTERN</button>
      </div>
    `;

    // Toggle switches
    document.querySelectorAll('.switch-toggle').forEach(tog => {
      tog.addEventListener('click', () => {
        const idx = parseInt(tog.dataset.idx, 10);
        state[idx] = !state[idx];
        tog.classList.toggle('on', state[idx]);
        const lbl = document.getElementById(`sw-lbl-${idx}`);
        if (lbl) lbl.textContent = state[idx] ? 'ON' : 'OFF';
        Audio.playClick();
      });
    });

    document.getElementById('btn-check-switches').addEventListener('click', () => {
      const correct = state.every((v, i) => v === puzzle.target[i]);
      if (correct) {
        onCorrect();
      } else {
        // Flash wrong switches
        state.forEach((v, i) => {
          if (v !== puzzle.target[i]) {
            const sw = document.getElementById(`sw-${i}`);
            if (sw) Anim.pop(sw);
          }
        });
        onWrong();
      }
    });
  }

  return { generate, render };
})();
