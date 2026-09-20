// js/modules/bomb.js
// Controls the bomb visual — light, screen text, wire display

const Bomb = (() => {
  const lightEl  = () => document.getElementById('bomb-light');
  const screenEl = () => document.querySelector('.bomb-screen-inner');
  const wiresEl  = () => document.getElementById('bomb-wires');

  function setLight(state) {
    // state: 'armed' | 'ok' | 'danger'
    const el = lightEl();
    if (!el) return;
    el.className = 'bomb-light';
    if (state === 'ok')     el.classList.add('green');
    if (state === 'danger') el.style.background = 'var(--amber)';
  }

  function setScreen(text) {
    const el = screenEl();
    if (el) el.textContent = text;
  }

  function showWires(colors) {
    const container = wiresEl();
    if (!container) return;
    container.innerHTML = colors.map(c => `
      <div class="wire" data-color="${c}">
        <div class="wire-connector"></div>
        <div class="wire-line"></div>
        <div class="wire-connector"></div>
        <div class="wire-label">${c.toUpperCase()}</div>
      </div>
    `).join('');
  }

  function clearWires() {
    const el = wiresEl();
    if (el) el.innerHTML = '';
  }

  function cutWire(color) {
    const wire = wiresEl()?.querySelector(`[data-color="${color}"]`);
    if (wire) {
      wire.classList.add('cut');
      Audio.playWireCut();
    }
  }

  function arm() {
    setLight('armed');
    setScreen('ARMED');
  }

  function defused() {
    setLight('ok');
    setScreen('DEFUSED');
  }

  function danger() {
    setLight('danger');
    setScreen('WARNING');
  }

  return { arm, defused, danger, setLight, setScreen, showWires, clearWires, cutWire };
})();
