// js/modules/audio.js
// Procedural audio using Web Audio API – no external files needed

const Audio = (() => {
  let ctx = null;
  let tickInterval = null;
  let muted = false;

  function init() {
    if (ctx) return;
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch (e) { console.warn('Web Audio not supported'); }
  }

  function resume() { if (ctx && ctx.state === 'suspended') ctx.resume(); }

  function tone(freq, type = 'sine', duration = 0.1, vol = 0.3, delay = 0) {
    if (!ctx || muted) return;
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    gain.gain.setValueAtTime(vol, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration + 0.01);
  }

  function noise(duration = 0.2, vol = 0.15) {
    if (!ctx || muted) return;
    const bufLen = ctx.sampleRate * duration;
    const buf    = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data   = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
    const src  = ctx.createBufferSource();
    const gain = ctx.createGain();
    src.buffer = buf;
    src.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    src.start();
  }

  // ── SOUND EFFECTS ──────────────────────────────────

  function playTick() {
    tone(880, 'square', 0.04, 0.15);
  }

  function playTickFast() {
    tone(1100, 'square', 0.03, 0.2);
  }

  function playCorrect() {
    tone(523, 'sine', 0.1, 0.3);
    tone(659, 'sine', 0.1, 0.3, 0.1);
    tone(784, 'sine', 0.2, 0.3, 0.2);
  }

  function playWrong() {
    tone(200, 'sawtooth', 0.15, 0.4);
    tone(150, 'sawtooth', 0.15, 0.4, 0.1);
  }

  function playExplosion() {
    noise(0.8, 0.5);
    tone(80, 'sawtooth', 0.6, 0.5);
    tone(60, 'sawtooth', 0.8, 0.4, 0.1);
  }

  function playWin() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 'sine', 0.2, 0.3, i * 0.12));
  }

  function playClick() {
    tone(440, 'square', 0.05, 0.1);
  }

  function playHint() {
    tone(660, 'triangle', 0.15, 0.2);
    tone(880, 'triangle', 0.15, 0.2, 0.15);
  }

  function playWireCut() {
    noise(0.12, 0.2);
    tone(300, 'sawtooth', 0.08, 0.15);
  }

  // ── TICKING LOOP ───────────────────────────────────

  function startTicking(fast = false) {
    stopTicking();
    const interval = fast ? 500 : 1000;
    const fn = fast ? playTickFast : playTick;
    fn();
    tickInterval = setInterval(fn, interval);
  }

  function stopTicking() {
    if (tickInterval) { clearInterval(tickInterval); tickInterval = null; }
  }

  function setMuted(val) { muted = val; if (muted) stopTicking(); }
  function toggleMute()  { setMuted(!muted); return muted; }

  return {
    init, resume,
    playTick, playTickFast, playCorrect, playWrong,
    playExplosion, playWin, playClick, playHint, playWireCut,
    startTicking, stopTicking,
    setMuted, toggleMute,
  };
})();
