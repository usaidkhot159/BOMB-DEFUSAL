// js/puzzles/code.js
// 4-digit code entry puzzle with math clues

const CodePuzzle = (() => {
  function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

  function generateClues(code) {
    const [a, b, c, d] = code;
    const templates = [
      [
        `Digit 1 = ${a}`,
        `Digit 2 = ${b}`,
        `Digit 3 = ${c}`,
        `Digit 4 = ${d}`,
      ],
      [
        `First digit is ${a}.`,
        `Second digit is ${a + (b - a) > 0 ? (b - a) + ' more than' : Math.abs(b - a) + ' less than'} the first.`,
        `Third digit is ${c % 2 === 0 ? 'even' : 'odd'} and equals ${c}.`,
        `Last digit = ${d}.`,
      ],
      [
        `D1 + D2 = ${a + b}`,
        `D1 - D2 = ${a - b}`,
        `D3 = ${c}`,
        `D4 = D3 ${d >= c ? '+' : '-'} ${Math.abs(d - c)}`,
      ],
    ];
    return templates[rnd(0, templates.length - 1)];
  }

  function generate(level = 1) {
    const digits = Array.from({ length: 4 }, () => rnd(0, 9));
    const clues  = generateClues(digits);
    const hint   = `The code is: ${digits.join(' ')}`;
    return { type: 'code', digits, clues, hint };
  }

  function render(puzzle, onCorrect, onWrong) {
    Bomb.clearWires();
    Bomb.setScreen('ENTER CODE');

    let entered = [];

    const content = document.getElementById('puzzle-content');
    content.innerHTML = `
      <div class="code-puzzle-wrap">
        <div class="code-display" id="code-display">
          ${puzzle.digits.map((_, i) => `<div class="code-digit" id="cd-${i}">_</div>`).join('')}
        </div>
        <div class="code-clues">
          ${puzzle.clues.map(c => `<div class="code-clue">▸ ${c}</div>`).join('')}
        </div>
        <div class="numpad">
          ${[7,8,9,4,5,6,1,2,3].map(n =>
            `<button class="numpad-btn" data-n="${n}">${n}</button>`
          ).join('')}
          <button class="numpad-btn del" data-action="del">⌫</button>
          <button class="numpad-btn" data-n="0">0</button>
          <button class="numpad-btn ok"  data-action="ok">OK</button>
        </div>
      </div>
    `;

    function updateDisplay() {
      puzzle.digits.forEach((_, i) => {
        const el = document.getElementById(`cd-${i}`);
        if (!el) return;
        el.textContent = entered[i] !== undefined ? entered[i] : '_';
        el.classList.toggle('active', i === entered.length);
      });
    }
    updateDisplay();

    content.querySelectorAll('.numpad-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        Audio.playClick();
        const action = btn.dataset.action;
        if (action === 'del') {
          entered.pop();
        } else if (action === 'ok') {
          if (entered.length < 4) return;
          const correct = entered.join('') === puzzle.digits.join('');
          entered = [];
          updateDisplay();
          if (correct) onCorrect(); else onWrong();
          return;
        } else {
          if (entered.length >= 4) return;
          entered.push(parseInt(btn.dataset.n, 10));
        }
        updateDisplay();
      });
    });
  }

  return { generate, render };
})();
