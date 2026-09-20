// js/modules/animation.js
// DOM animation helpers

const Anim = (() => {

  function shake(el) {
    el.classList.remove('screen-shake');
    void el.offsetWidth; // reflow
    el.classList.add('screen-shake');
    el.addEventListener('animationend', () => el.classList.remove('screen-shake'), { once: true });
  }

  function flashRed(el) {
    el.classList.remove('flash-red');
    void el.offsetWidth;
    el.classList.add('flash-red');
    el.addEventListener('animationend', () => el.classList.remove('flash-red'), { once: true });
  }

  function animateIn(el) {
    el.classList.remove('animate-in');
    void el.offsetWidth;
    el.classList.add('animate-in');
  }

  function pop(el) {
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = 'pop 0.35s ease';
    el.addEventListener('animationend', () => el.style.animation = '', { once: true });
  }

  function explodeBomb(bombEl) {
    return new Promise(resolve => {
      bombEl.classList.add('exploding');
      // Flash the page red
      document.body.style.backgroundColor = '#ff0000';
      setTimeout(() => { document.body.style.backgroundColor = ''; }, 120);
      setTimeout(() => { document.body.style.backgroundColor = '#ff0000'; }, 240);
      setTimeout(() => { document.body.style.backgroundColor = ''; }, 360);
      bombEl.addEventListener('animationend', () => {
        bombEl.classList.remove('exploding');
        resolve();
      }, { once: true });
      setTimeout(resolve, 900); // fallback
    });
  }

  function countdownFlash(timerEl) {
    timerEl.style.transform = 'scale(1.3)';
    setTimeout(() => timerEl.style.transform = '', 150);
  }

  function glitch(el, duration = 400) {
    el.setAttribute('data-text', el.textContent);
    el.style.position = 'relative';
    el.classList.add('glitch-text');
    setTimeout(() => el.classList.remove('glitch-text'), duration);
  }

  return { shake, flashRed, animateIn, pop, explodeBomb, countdownFlash, glitch };
})();
