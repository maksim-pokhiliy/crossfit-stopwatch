import { useCallback } from "react";

import { TimerMode } from "../types/timer";

import { useTimerContext } from "./use-timer-context";

export const useTimer = () => {
  const { state, currentTimer, setMode, startTimer, stopTimer, resetTimer } = useTimerContext();

  const handleSetMode = useCallback(
    (mode: TimerMode) => {
      setMode(mode);
    },
    [setMode],
  );

  const handleStartTimer = useCallback(
    (targetTime?: number) => {
      if (state.isRunning || state.countdownActive) {
        return;
      }

      startTimer(targetTime);
    },
    [state.isRunning, state.countdownActive, startTimer],
  );

  const handleStopTimer = useCallback(() => {
    stopTimer();
  }, [stopTimer]);

  const handleResetTimer = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  return {
    state,
    currentTimer,
    setMode: handleSetMode,
    startTimer: handleStartTimer,
    stopTimer: handleStopTimer,
    resetTimer: handleResetTimer,
  };
};
