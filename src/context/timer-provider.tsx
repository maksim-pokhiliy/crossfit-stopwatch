import { FC, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { BaseTimer, TimerState } from "../models/base-timer";
import { TimerFactory } from "../models/timer-factory";
import { TimerMode } from "../types/timer";

import { TimerContext } from "./timer-context";

export const TimerProvider: FC<PropsWithChildren> = ({ children }) => {
  const [currentTimer, setCurrentTimer] = useState<BaseTimer>(() =>
    TimerFactory.createTimer(TimerFactory.getLastMode()),
  );

  const [state, setState] = useState<TimerState>(() => currentTimer.getState());

  const animationFrameRef = useRef<number>(0);

  const setMode = useCallback((mode: TimerMode) => {
    const newTimer = TimerFactory.createTimer(mode);

    setCurrentTimer(newTimer);
    setState(newTimer.getState());
  }, []);

  const startTimer = useCallback(
    (targetTime?: number) => {
      currentTimer.start(targetTime);
      setState(currentTimer.getState());
    },
    [currentTimer],
  );

  const stopTimer = useCallback(() => {
    currentTimer.stop();
    setState(currentTimer.getState());
  }, [currentTimer]);

  const resetTimer = useCallback(() => {
    currentTimer.reset();
    setState(currentTimer.getState());
  }, [currentTimer]);

  const animate = useCallback(() => {
    currentTimer.update();
    setState(currentTimer.getState());

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [currentTimer]);

  useEffect(() => {
    if (state.isRunning || state.countdownActive) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.isRunning, state.countdownActive, animate]);

  const contextValue = useMemo(
    () => ({
      state,
      currentTimer,
      setMode,
      startTimer,
      stopTimer,
      resetTimer,
      setState,
    }),
    [state, currentTimer, setMode, startTimer, stopTimer, resetTimer],
  );

  return <TimerContext.Provider value={contextValue}>{children}</TimerContext.Provider>;
};

TimerProvider.displayName = "TimerProvider";
