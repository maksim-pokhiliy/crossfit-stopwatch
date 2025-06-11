import { FC, PropsWithChildren, useMemo, useState } from "react";

import { useTimerAnimation } from "../hooks/use-timer-animation";
import { TimerState } from "../models/base-timer";
import { TimerService } from "../services/timer.service";
import { TimerMode } from "../types/timer";

import { TimerContext } from "./timer-context";

export const TimerProvider: FC<PropsWithChildren> = ({ children }) => {
  const [timerService] = useState(() => new TimerService("forTime"));
  const [state, setState] = useState<TimerState>(timerService.getState());

  useTimerAnimation(timerService, setState, state);

  const setMode = (mode: TimerMode) => {
    timerService.setMode(mode);
    setState(timerService.getState());
  };

  const startTimer = (targetTime?: number) => {
    timerService.start(targetTime);

    const newState = timerService.getState();

    setState(newState);
  };

  const pauseTimer = () => {
    timerService.pause();
    setState(timerService.getState());
  };

  const resumeTimer = () => {
    timerService.resume();
    setState(timerService.getState());
  };

  const stopTimer = () => {
    timerService.stop();
    setState(timerService.getState());
  };

  const resetTimer = () => {
    timerService.reset();
    setState(timerService.getState());
  };

  const contextValue = useMemo(
    () => ({
      state,
      currentTimer: timerService.getTimer(),
      setMode,
      startTimer,
      pauseTimer,
      resumeTimer,
      stopTimer,
      resetTimer,
      setState,
    }),
    [state, timerService, setMode, startTimer, pauseTimer, resumeTimer, stopTimer, resetTimer],
  );

  return <TimerContext.Provider value={contextValue}>{children}</TimerContext.Provider>;
};

TimerProvider.displayName = "TimerProvider";
