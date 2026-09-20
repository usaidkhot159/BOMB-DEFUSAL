// js/modules/difficulty.js
// Difficulty presets and level configurations

const Difficulty = (() => {
  // Difficulty modifiers chosen by the player in the menu
  const PRESETS = [
    { id: 0, name: 'ROOKIE',   timeMulti: 1.3, livesBonus: 1,  hintsBonus: 1 },
    { id: 1, name: 'AGENT',    timeMulti: 1.0, livesBonus: 0,  hintsBonus: 0 },
    { id: 2, name: 'VETERAN',  timeMulti: 0.8, livesBonus: -1, hintsBonus: -1 },
    { id: 3, name: 'ELITE',    timeMulti: 0.6, livesBonus: -1, hintsBonus: -1 },
  ];

  // Base level definitions
  const LEVELS = [
    {
      id: 1,
      name: 'OPERATION GREENLIGHT',
      time: 120,
      lives: 3,
      hints: 2,
      puzzleCount: 3,
      allowedTypes: ['wire', 'code', 'switch'],
      description: 'Standard defusal. Follow protocol.',
    },
    {
      id: 2,
      name: 'OPERATION REDLINE',
      time: 90,
      lives: 2,
      hints: 2,
      puzzleCount: 4,
      allowedTypes: ['wire', 'code', 'memory', 'switch'],
      description: 'Elevated threat. Stay focused.',
    },
    {
      id: 3,
      name: 'OPERATION BLACKOUT',
      time: 60,
      lives: 2,
      hints: 1,
      puzzleCount: 5,
      allowedTypes: ['wire', 'code', 'memory', 'pattern', 'switch'],
      description: 'Critical situation. No margin for error.',
    },
    {
      id: 4,
      name: 'OPERATION ZERO HOUR',
      time: 45,
      lives: 1,
      hints: 1,
      puzzleCount: 6,
      allowedTypes: ['wire', 'code', 'memory', 'pattern', 'switch'],
      description: 'Maximum threat. All puzzles active. One chance.',
    },
  ];

  function getPreset(idx) {
    return PRESETS[Math.max(0, Math.min(idx, PRESETS.length - 1))];
  }

  function getAllPresets() { return PRESETS; }

  function getLevelConfig(levelId, diffIdx) {
    const base   = LEVELS.find(l => l.id === levelId) || LEVELS[0];
    const preset = getPreset(diffIdx);
    return {
      ...base,
      time:  Math.round(base.time * preset.timeMulti),
      lives: Math.max(1, base.lives + preset.livesBonus),
      hints: Math.max(0, base.hints + preset.hintsBonus),
    };
  }

  function getTotalLevels() { return LEVELS.length; }

  return { getPreset, getAllPresets, getLevelConfig, getTotalLevels };
})();
