// js/puzzles/memory.js
// Show a color sequence, hide it, player must reproduce it

const MemoryPuzzle = (() => {
  const COLORS = ['red', 'blue', 'green', 'yellow'];

  function generate(level = 1) {
    const length = Math.min(2 + Math.floor(level * 0.8), 6);
    const sequence = Array.from({ length }, () => COLORS[Math.floor(Math.random() * COLORS.length)]);
    const hint = `Sequence: ${sequence.map(c => c.toUpperCase()).join(' → ')}`;
    return { type: 'memory', sequence, hint };
  }

  function render(puzzle, onCorrect, onWrong) {
    Bomb.clearWires();
    Bomb.setScreen('MEMORIZE');

    const content = document.getElementById('puzzle-content');
    content.innerHTML = `
      <div class="memory-puzzle-wrap">
        <div class="memory-phase" id="mem-phase">MEMORIZE THE SEQUENCE</div>
        <div class="memory-display" id="mem-display">
          ${COLORS.map(c => `
            <div class="memory-orb" data-color="${c}" id="morb-${c}"></div>
          `).join('')}
        </div>
        <div class="memory-progress" id="mem-progress"></div>
      </div>
    `;

    const phaseEl    = document.getElementById('mem-phase');
    const progressEl = document.getElementById('mem-progress');
    let playerInput  = [];
    let inputEnabled = false;

    // Light up orbs in sequence
    function lightOrb(color, on) {
      const orb = document.getElementById(`morb-${color}`);
      if (!orb) return;
      orb.classList.toggle('lit', on);
    }

    function playSequence() {
      inputEnabled = false;
      let i = 0;
      const step = () => {
        if (i > 0) lightOrb(puzzle.sequence[i - 1], false);
        if (i >= puzzle.sequence.length) {
          // Done showing — enable input
          setTimeout(enableInput, 400);
          return;
        }
        lightOrb(puzzle.sequence[i], true);
        Audio.playClick();
        i++;
        setTimeout(step, 750);
      };
      setTimeout(step, 600);
    }

    function enableInput() {
      inputEnabled = true;
      phaseEl.textContent = 'REPRODUCE THE SEQUENCE';
      Bomb.setScreen('REPEAT IT');
      progressEl.textContent = `0 / ${puzzle.sequence.length}`;

      document.querySelectorAll('.memory-orb').forEach(orb => {
        orb.style.cursor = 'pointer';
        orb.addEventListener('click', handleOrbClick);
      });
    }

    function handleOrbClick(e) {
      if (!inputEnabled) return;
      const color = e.currentTarget.dataset.color;
      playerInput.push(color);
      lightOrb(color, true);
      setTimeout(() => lightOrb(color, false), 300);
      Audio.playClick();

      const idx = playerInput.length - 1;
      progressEl.textContent = `${playerInput.length} / ${puzzle.sequence.length}`;

      if (playerInput[idx] !== puzzle.sequence[idx]) {
        // Wrong
        inputEnabled = false;
        const orb = document.getElementById(`morb-${color}`);
        if (orb) orb.classList.add('wrong');
        setTimeout(onWrong, 500);
        return;
      }

      if (playerInput.length === puzzle.sequence.length) {
        // Correct!
        inputEnabled = false;
        puzzle.sequence.forEach(c => {
          const orb = document.getElementById(`morb-${c}`);
          if (orb) orb.classList.add('correct');
        });
        setTimeout(onCorrect, 500);
      }
    }

    playSequence();
  }

  return { generate, render };
})();
