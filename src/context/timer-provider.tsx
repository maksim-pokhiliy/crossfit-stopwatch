import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { STORAGE_KEYS } from "../constants/timer";
import { BaseTimer, TimerState } from "../models/base-timer";
import { TimerFactory } from "../models/timer-factory";
import { TimerMode } from "../types/timer";

import { TimerContext } from "./timer-context";

const getInitialMode = (): TimerMode => {
  const savedMode = localStorage.getItem(STORAGE_KEYS.LAST_MODE) as TimerMode;

  return savedMode || "forTime";
};

export const TimerProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<TimerMode>(getInitialMode());
  const timerRef = useRef<BaseTimer>(TimerFactory.createTimer(mode));
  const [state, setState] = useState<TimerState>(() => timerRef.current.getState());
  const intervalRef = useRef<number | undefined>(undefined);

  const updateState = useCallback(() => {
    timerRef.current.update();
    setState(timerRef.current.getState());
  }, []);

  const handleSetMode = useCallback((newMode: TimerMode) => {
    localStorage.setItem(STORAGE_KEYS.LAST_MODE, newMode);
    setMode(newMode);
    timerRef.current = TimerFactory.createTimer(newMode);
    setState(timerRef.current.getState());
  }, []);

  const startTimer = useCallback((targetTime?: number) => {
    timerRef.current.start(targetTime);
    setState(timerRef.current.getState());
  }, []);

  const stopTimer = useCallback(() => {
    timerRef.current.stop();
    setState(timerRef.current.getState());
  }, []);

  const resetTimer = useCallback(() => {
    timerRef.current.reset();
    setState(timerRef.current.getState());
  }, []);

  useEffect(() => {
    if (state.isRunning || state.countdownActive) {
      intervalRef.current = window.setInterval(updateState, 10);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning, state.countdownActive, updateState]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.COUNTDOWN_DURATION && e.newValue) {
        setState(timerRef.current.getState());
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const contextValue = {
    state,
    currentTimer: timerRef.current,
    setMode: handleSetMode,
    startTimer,
    stopTimer,
    resetTimer,
    setState,
  };

  return <TimerContext.Provider value={contextValue}>{children}</TimerContext.Provider>;
};
