export const TIMER_CONSTANTS = {
  MIN_MINUTES: 1,
  MAX_MINUTES: 60,
  DEFAULT_COUNTDOWN: 3000,
  MIN_COUNTDOWN: 0,
  MAX_COUNTDOWN: 10000,
  UPDATE_INTERVAL: 10,
  COUNTDOWN_INTERVAL: 1000,
} as const;

export const STORAGE_KEYS = {
  LAST_MODE: "lastMode",
  THEME: "theme",
  COUNTDOWN_DURATION: "countdownDuration",
} as const;

export const SOUNDS = {
  COUNTDOWN: "countdown",
  GO: "go",
  ROUND: "round",
  FINISH: "finish",
} as const;
