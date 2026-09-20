// js/modules/shop.js
// In-game shop for spending coins

const Shop = (() => {
  const ITEMS = [
    {
      id:    'extraHints',
      icon:  '💡',
      name:  'EXTRA HINT',
      desc:  'Adds +1 hint to your next mission.',
      price: 30,
    },
    {
      id:    'extraTime',
      icon:  '⏳',
      name:  '+15 SECONDS',
      desc:  'Adds 15 bonus seconds to your next mission.',
      price: 50,
    },
    {
      id:    'shield',
      icon:  '🛡️',
      name:  'LIFE SHIELD',
      desc:  'Absorbs one wrong answer without losing a life.',
      price: 80,
    },
  ];

  function getItems() { return ITEMS; }

  function renderShop() {
    const container = document.getElementById('shop-items');
    const coinsEl   = document.getElementById('shop-coins-val');
    if (!container) return;

    coinsEl.textContent = Storage.getCoins();
    const inv = Storage.getInventory();

    container.innerHTML = ITEMS.map(item => `
      <div class="shop-item">
        <span class="shop-item-icon">${item.icon}</span>
        <div class="shop-item-info">
          <div class="shop-item-name">${item.name}</div>
          <div class="shop-item-desc">${item.desc}</div>
          <div class="shop-item-owned">Owned: ${inv[item.id] || 0}</div>
        </div>
        <button class="btn-buy" data-item="${item.id}" data-price="${item.price}"
          ${Storage.getCoins() < item.price ? 'disabled' : ''}>
          🪙 ${item.price}
        </button>
      </div>
    `).join('');

    container.querySelectorAll('.btn-buy').forEach(btn => {
      btn.addEventListener('click', () => {
        const item  = btn.dataset.item;
        const price = parseInt(btn.dataset.price, 10);
        if (Storage.spendCoins(price)) {
          Storage.addItem(item, 1);
          Audio.playClick();
          renderShop(); // refresh
        }
      });
    });
  }

  return { getItems, renderShop };
})();
