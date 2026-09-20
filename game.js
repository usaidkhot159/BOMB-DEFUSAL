// js/modules/game.js
// Core game state machine

const Game = (() => {
  let state = null;

  // ── STATE ───────────────────────────────────────────
  function getState() { return state; }

  function initLevel(levelId, diffIdx) {
    const cfg = Difficulty.getLevelConfig(levelId, diffIdx);
    const inv = Storage.getInventory();

    state = {
      level:        levelId,
      diffIdx,
      lives:        cfg.lives,
      hints:        cfg.hints + (inv.extraHints || 0),
      coins:        0,
      time:         cfg.time   + (inv.extraTime  || 0) * 15,
      totalTime:    cfg.time   + (inv.extraTime  || 0) * 15,
      totalPuzzles: cfg.puzzleCount,
      puzzleIndex:  0,
      shieldActive: (inv.shield || 0) > 0,
      solved:       0,
      running:      false,
      paused:       false,
      cfg,
    };

    // Consume one-time items
    if (inv.extraHints > 0) { Storage.useItem('extraHints'); }
    if (inv.extraTime  > 0) { Storage.useItem('extraTime'); }
    if (inv.shield     > 0) { Storage.useItem('shield'); }

    PuzzleManager.buildQueue(cfg);
    return state;
  }

  // ── PUZZLE FLOW ─────────────────────────────────────
  function startNextPuzzle() {
    if (!PuzzleManager.hasNext()) {
      win();
      return;
    }
    PuzzleManager.next();
    state.puzzleIndex = PuzzleManager.getIndex() - 1;
    HUD.update(state);
    Bomb.arm();
    PuzzleManager.renderCurrent(onCorrect, onWrong);
  }

  function onCorrect() {
    if (!state.running) return;
    Audio.playCorrect();
    state.solved++;
    state.coins += 10 + Math.floor(Timer.getRemaining() / 10);
    HUD.update(state);
    showFeedback('✅ CORRECT — WIRE NEUTRALIZED', 'correct');

    Bomb.setLight('ok');
    Bomb.setScreen('SAFE');

    setTimeout(() => {
      hideFeedback();
      if (PuzzleManager.hasNext()) {
        startNextPuzzle();
      } else {
        win();
      }
    }, 1000);
  }

  function onWrong() {
    if (!state.running) return;
    Audio.playWrong();
    Anim.shake(document.getElementById('screen-game'));
    Anim.flashRed(document.body);
    Bomb.danger();

    if (state.shieldActive) {
      state.shieldActive = false;
      showFeedback('🛡️ SHIELD ABSORBED THE HIT!', 'correct');
      setTimeout(hideFeedback, 1200);
      return;
    }

    state.lives--;
    HUD.update(state);
    HUD.flashLives();
    showFeedback(`❌ WRONG — ${state.lives} LIFE${state.lives !== 1 ? 'S' : ''} REMAINING`, 'wrong');

    Timer.addTime(-5); // penalty

    if (state.lives <= 0) {
      setTimeout(() => explodeAndLose('Out of lives!'), 800);
    } else {
      setTimeout(hideFeedback, 1200);
    }
  }

  function showFeedback(msg, type) {
    const fb = document.getElementById('puzzle-feedback');
    if (!fb) return;
    fb.textContent = msg;
    fb.className   = type;
  }

  function hideFeedback() {
    const fb = document.getElementById('puzzle-feedback');
    if (fb) { fb.textContent = ''; fb.className = 'hidden'; }
  }

  // ── TIMER CALLBACKS ─────────────────────────────────
  function onTimerTick(remaining) {
    if (remaining === 20) Bomb.danger();
  }

  function onTimerExpire() {
    if (!state.running) return;
    explodeAndLose('Time ran out!');
  }

  // ── WIN / LOSE ──────────────────────────────────────
  function win() {
    state.running = false;
    Timer.stop();
    Bomb.defused();
    Audio.playWin();

    const timeLeft = Timer.getRemaining();
    const bonus    = Math.floor(timeLeft * 0.5);
    state.coins   += bonus;

    Storage.addCoins(state.coins);
    Storage.submitScore(state.coins);
    Storage.recordGame({ won: true, puzzlesSolved: state.solved, timeLeft });

    Screens.show('win', {
      time:    timeLeft,
      puzzles: state.solved,
      lives:   state.lives,
      coins:   state.coins,
      level:   state.level,
    });
  }

  async function explodeAndLose(reason) {
    state.running = false;
    Timer.stop();
    Audio.playExplosion();
    await Anim.explodeBomb(document.getElementById('bomb-body'));

    Storage.recordGame({ won: false, puzzlesSolved: state.solved, timeLeft: 0 });

    Screens.show('lose', {
      reason,
      level:   state.level,
      puzzles: state.solved,
    });
  }

  // ── PUBLIC API ───────────────────────────────────────
  function start(levelId, diffIdx) {
    initLevel(levelId, diffIdx);
    state.running = true;
    HUD.update(state);
    Bomb.arm();
    Timer.start(state.time, onTimerTick, onTimerExpire);
    startNextPuzzle();
  }

  function pause() {
    if (!state || !state.running) return;
    state.paused = true;
    Timer.pause();
  }

  function resume() {
    if (!state || !state.paused) return;
    state.paused = false;
    Timer.resume();
  }

  function useHint() {
    if (!state || state.hints <= 0) return null;
    state.hints--;
    HUD.update(state);
    Audio.playHint();
    return PuzzleManager.getCurrentHint();
  }

  function quit() {
    state = null;
    Timer.stop();
    Audio.stopTicking();
  }

  return { start, pause, resume, useHint, quit, getState };
})();
