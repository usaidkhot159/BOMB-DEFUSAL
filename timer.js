// js/modules/timer.js
// Countdown timer logic

const Timer = (() => {
  let totalSeconds = 0;
  let remaining    = 0;
  let interval     = null;
  let onTick       = null;
  let onExpire     = null;
  let paused       = false;

  const displayEl = () => document.getElementById('timer-display');
  const barEl     = () => document.getElementById('timer-bar');

  function formatTime(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  function updateDOM() {
    const d   = displayEl();
    const b   = barEl();
    const pct = totalSeconds > 0 ? (remaining / totalSeconds) * 100 : 0;

    if (d) {
      d.textContent = formatTime(remaining);
      d.className = '';
      if (remaining <= 10)      d.classList.add('critical');
      else if (remaining <= 30) d.classList.add('warning');
      if (remaining <= 10) Anim.countdownFlash(d);
    }
    if (b) {
      b.style.width = pct + '%';
      b.className = '';
      if (remaining <= 10)      b.classList.add('critical');
      else if (remaining <= 30) b.classList.add('warning');
    }
  }

  function start(seconds, tickCb, expireCb) {
    stop();
    totalSeconds = seconds;
    remaining    = seconds;
    onTick       = tickCb;
    onExpire     = expireCb;
    paused       = false;
    updateDOM();
    Audio.startTicking(false);
    interval = setInterval(() => {
      if (paused) return;
      remaining--;
      updateDOM();
      if (onTick) onTick(remaining);

      if (remaining === 30) Audio.startTicking(false);
      if (remaining === 10) Audio.startTicking(true);

      if (remaining <= 0) {
        stop();
        if (onExpire) onExpire();
      }
    }, 1000);
  }

  function stop() {
    if (interval) { clearInterval(interval); interval = null; }
    Audio.stopTicking();
  }

  function pause()  { paused = true;  Audio.stopTicking(); }
  function resume() { paused = false; Audio.startTicking(remaining <= 10); }

  function addTime(seconds) {
    remaining = Math.min(remaining + seconds, totalSeconds);
    updateDOM();
  }

  function getRemaining() { return remaining; }

  function setDisplay(seconds) {
    remaining    = seconds;
    totalSeconds = seconds;
    updateDOM();
  }

  return { start, stop, pause, resume, addTime, getRemaining, setDisplay };
})();
