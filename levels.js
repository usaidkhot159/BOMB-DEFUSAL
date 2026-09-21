// levels/levels.json (reference — data is embedded in difficulty.js)
// This file documents the 4 level configurations for reference.

/*
LEVEL 1 — OPERATION GREENLIGHT
  Time:    120s  | Lives: 3 | Hints: 2 | Puzzles: 3
  Types:   Wire, Code, Switch
  Notes:   Introductory level. All puzzle types are simple variants.

LEVEL 2 — OPERATION REDLINE
  Time:    90s   | Lives: 2 | Hints: 2 | Puzzles: 4
  Types:   Wire, Code, Memory, Switch
  Notes:   Memory puzzle introduced. Slightly harder code clues.

LEVEL 3 — OPERATION BLACKOUT
  Time:    60s   | Lives: 2 | Hints: 1 | Puzzles: 5
  Types:   Wire, Code, Memory, Pattern, Switch
  Notes:   All puzzle types active. Pattern puzzle introduced. 
           Timer pressure increases significantly.

LEVEL 4 — OPERATION ZERO HOUR
  Time:    45s   | Lives: 1 | Hints: 1 | Puzzles: 6
  Types:   Wire, Code, Memory, Pattern, Switch (all, randomized)
  Notes:   Maximum difficulty. One life. Full puzzle rotation.
           One wrong answer is near-fatal.

DIFFICULTY MODIFIERS:
  ROOKIE   — Time ×1.3 | +1 Life | +1 Hint
  AGENT    — Base values
  VETERAN  — Time ×0.8 | -1 Life | -1 Hint  (min 1)
  ELITE    — Time ×0.6 | -1 Life | -1 Hint  (min 1)

COIN ECONOMY:
  Per puzzle solved:  10 + floor(timeLeft / 10)
  Win bonus:          floor(timeLeft * 0.5)
  Shop prices:
    Extra Hint:   30 coins
    +15 Seconds:  50 coins
    Life Shield:  80 coins
*/
