import { createContext } from "react";

import { STORAGE_KEYS, TIMER_CONSTANTS } from "../constants/timer";
import { Theme, TimerContextType, TimerMode, TimerState } from "../types/timer";

const getInitialMode = (): TimerMode => {
  const savedMode = localStorage.getItem(STORAGE_KEYS.LAST_MODE) as TimerMode;

  return savedMode || "forTime";
};

const getInitialTheme = (): Theme => {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as Theme;

  return savedTheme || "dark";
};

const getInitialCountdownDuration = (): number => {
  const savedDuration = localStorage.getItem(STORAGE_KEYS.COUNTDOWN_DURATION);

  return savedDuration ? parseInt(savedDuration) : TIMER_CONSTANTS.DEFAULT_COUNTDOWN;
};

export const getInitialState = (): TimerState => {
  const countdownDuration = getInitialCountdownDuration();

  return {
    startTime: null,
    elapsedTime: 0,
    isRunning: false,
    currentMode: getInitialMode(),
    targetTime: 0,
    currentRound: 1,
    countdownActive: false,
    countdownValue: countdownDuration,
    countdownDuration,
    theme: getInitialTheme(),
  };
};

export const TimerContext = createContext<TimerContextType>({
  state: getInitialState(),
  dispatch: () => null,
});

TimerContext.displayName = "TimerContext";
