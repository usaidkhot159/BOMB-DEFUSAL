// js/puzzles/wire.js
// Wire-cutting puzzle

const WirePuzzle = (() => {
  const ALL_COLORS = ['red','blue','green','yellow','white','black','orange','purple'];

  const CLUE_TEMPLATES = [
    (c) => `The correct wire is NOT ${c}.`,
    (c) => `Cut the ${c} wire.`,
    (c) => `Ignore all wires except the ${c} one.`,
    (c) => `The bomb responds to the ${c} wire.`,
    (c) => `Cut anything but the ${c} wire.`,
  ];

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pick(arr, n) {
    return shuffle(arr).slice(0, n);
  }

  function generate(level = 1) {
    const count  = Math.min(3 + Math.floor(level / 2), 6);
    const colors = pick(ALL_COLORS, count);
    const correct = colors[Math.floor(Math.random() * colors.length)];

    // Pick a misleading clue template
    let hint, clue;
    const r = Math.random();
    if (r < 0.5) {
      // Direct hint
      clue = CLUE_TEMPLATES[1](correct);
      hint = `The correct wire is the ${correct.toUpperCase()} one.`;
    } else {
      // Negative hint (pick a wrong color)
      const wrong = colors.filter(c => c !== correct);
      const notColor = wrong[Math.floor(Math.random() * wrong.length)];
      clue = CLUE_TEMPLATES[0](notColor);
      hint = `The correct wire is the ${correct.toUpperCase()} one.`;
    }

    return { type: 'wire', colors, correct, clue, hint };
  }

  function render(puzzle, onCorrect, onWrong) {
    Bomb.showWires(puzzle.colors);

    const content = document.getElementById('puzzle-content');
    content.innerHTML = `
      <div class="wire-puzzle-wrap">
        <div class="wire-puzzle-wires" id="wire-btns">
          ${puzzle.colors.map(c => `
            <button class="wire-btn" data-color="${c}" style="color:var(--wire-${c})">
              <div class="wire-cap"></div>
              <div class="wire-stripe" style="background:var(--wire-${c}); box-shadow:0 0 6px var(--wire-${c})"></div>
              <div class="wire-cap"></div>
              <span>${c.toUpperCase()}</span>
            </button>
          `).join('')}
        </div>
        <p style="font-family:var(--font-mono);font-size:0.8rem;color:var(--grey-light);text-align:center;">
          — ${puzzle.clue} —
        </p>
      </div>
    `;

    document.querySelectorAll('.wire-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const chosen = btn.dataset.color;
        btn.classList.add('cut');
        Bomb.cutWire(chosen);
        if (chosen === puzzle.correct) {
          onCorrect();
        } else {
          onWrong();
        }
      });
    });
  }

  return { generate, render };
})();
