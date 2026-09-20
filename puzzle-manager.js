// js/modules/puzzle-manager.js
// Generates and serves puzzle sequence for a level

const PuzzleManager = (() => {
  const REGISTRY = {
    wire:    { module: () => WirePuzzle,    label: '🔌 WIRE DEFUSAL',     desc: 'Cut the correct wire before it triggers.' },
    code:    { module: () => CodePuzzle,    label: '🔢 CODE ENTRY',       desc: 'Enter the 4-digit disarm code.' },
    memory:  { module: () => MemoryPuzzle,  label: '🧠 MEMORY SEQUENCE',  desc: 'Memorize and reproduce the color sequence.' },
    pattern: { module: () => PatternPuzzle, label: '🔢 NUMBER PATTERN',   desc: 'Find the next number in the sequence.' },
    switch:  { module: () => SwitchPuzzle,  label: '🔲 SWITCH PANEL',     desc: 'Match the target switch pattern exactly.' },
  };

  let queue   = [];
  let current = null;
  let index   = 0;

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function buildQueue(levelConfig) {
    const { allowedTypes, puzzleCount, id: levelId } = levelConfig;
    const shuffled = shuffle(allowedTypes);
    const types    = [];
    while (types.length < puzzleCount) {
      types.push(...shuffled);
    }
    const chosen = types.slice(0, puzzleCount);

    queue = chosen.map(type => {
      const reg  = REGISTRY[type];
      const mod  = reg.module();
      const data = mod.generate(levelId);
      return { type, data, label: reg.label, desc: reg.desc };
    });
    index   = 0;
    current = null;
  }

  function hasNext() { return index < queue.length; }
  function getTotal() { return queue.length; }
  function getIndex() { return index; }

  function next() {
    if (!hasNext()) return null;
    current = queue[index];
    index++;
    return current;
  }

  function getCurrent() { return current; }

  function renderCurrent(onCorrect, onWrong) {
    if (!current) return;
    const reg = REGISTRY[current.type];
    const mod = reg.module();

    // Update title/desc
    document.getElementById('puzzle-title').textContent = current.label;
    document.getElementById('puzzle-desc').textContent  = current.desc;

    // Clear feedback
    const fb = document.getElementById('puzzle-feedback');
    if (fb) { fb.textContent = ''; fb.className = 'hidden'; }

    // Render puzzle UI
    mod.render(current.data, onCorrect, onWrong);

    // Animate in
    Anim.animateIn(document.getElementById('puzzle-content'));
  }

  function getCurrentHint() {
    return current?.data?.hint || 'No hint available for this puzzle.';
  }

  return {
    buildQueue, hasNext, getTotal, getIndex,
    next, getCurrent, renderCurrent, getCurrentHint,
  };
})();
