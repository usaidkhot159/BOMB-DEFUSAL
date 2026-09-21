// js/puzzles/pattern.js
// Number pattern / sequence puzzle

const PatternPuzzle = (() => {

  // Pattern generators: each returns { rows, answer, rule }
  const GENERATORS = [
    // Multiply by 2
    () => {
      const start  = Math.floor(Math.random() * 5) + 1;
      const rows   = [start, start*2, start*4, start*8];
      return { rows, answer: start*16, rule: 'Each number is multiplied by 2.' };
    },
    // Add N
    () => {
      const start = Math.floor(Math.random() * 10) + 1;
      const step  = Math.floor(Math.random() * 8) + 2;
      const rows  = [start, start+step, start+step*2, start+step*3];
      return { rows, answer: start+step*4, rule: `Each number increases by ${step}.` };
    },
    // Square sequence
    () => {
      const offset = Math.floor(Math.random() * 3) + 1;
      const rows   = [offset**2, (offset+1)**2, (offset+2)**2, (offset+3)**2];
      return { rows, answer: (offset+4)**2, rule: 'Numbers are perfect squares.' };
    },
    // Fibonacci-like
    () => {
      const a = Math.floor(Math.random() * 5) + 1;
      const b = Math.floor(Math.random() * 5) + 1;
      const c = a + b;
      const d = b + c;
      return { rows: [a, b, c, d], answer: c + d, rule: 'Each number = sum of the two before it.' };
    },
    // Multiply by 3
    () => {
      const start = Math.floor(Math.random() * 3) + 1;
      const rows  = [start, start*3, start*9, start*27];
      return { rows, answer: start*81, rule: 'Each number is multiplied by 3.' };
    },
    // Subtract
    () => {
      const start = Math.floor(Math.random() * 40) + 60;
      const step  = Math.floor(Math.random() * 7) + 3;
      const rows  = [start, start-step, start-step*2, start-step*3];
      return { rows, answer: start-step*4, rule: `Each number decreases by ${step}.` };
    },
  ];

  function generate(level = 1) {
    const gen    = GENERATORS[Math.floor(Math.random() * GENERATORS.length)];
    const { rows, answer, rule } = gen();
    const hint   = `Rule: ${rule} Answer = ${answer}`;
    return { type: 'pattern', rows, answer, hint };
  }

  function render(puzzle, onCorrect, onWrong) {
    Bomb.clearWires();
    Bomb.setScreen('FIND PATTERN');

    const content = document.getElementById('puzzle-content');
    content.innerHTML = `
      <div class="pattern-puzzle-wrap">
        <div class="pattern-table">
          ${puzzle.rows.map((v, i) => `
            <div class="pattern-row">
              <span>${i + 1}</span>
              <span class="arrow">→</span>
              <span class="result">${v}</span>
            </div>
          `).join('')}
          <div class="pattern-row question">
            <span>${puzzle.rows.length + 1}</span>
            <span class="arrow">→</span>
            <span class="result">?</span>
          </div>
        </div>
        <div class="pattern-input-wrap">
          <input
            type="number"
            class="pattern-input"
            id="pattern-input"
            placeholder="?"
            autocomplete="off"
          />
          <button class="btn-submit" id="pattern-submit">SUBMIT</button>
        </div>
      </div>
    `;

    const input  = document.getElementById('pattern-input');
    const submit = document.getElementById('pattern-submit');
    input.focus();

    function check() {
      const val = parseInt(input.value.trim(), 10);
      if (isNaN(val)) return;
      if (val === puzzle.answer) {
        onCorrect();
      } else {
        input.value = '';
        onWrong();
      }
    }

    submit.addEventListener('click', check);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
  }

  return { generate, render };
})();
