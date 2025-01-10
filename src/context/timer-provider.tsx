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
  const animationFrameRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(0);

  const animate = useCallback((timestamp: number) => {
    if (lastUpdateTimeRef.current === 0) {
      lastUpdateTimeRef.current = timestamp;
    }

    const elapsed = timestamp - lastUpdateTimeRef.current;

    if (elapsed >= 10) {
      timerRef.current.update();
      setState(timerRef.current.getState());
      lastUpdateTimeRef.current = timestamp;
    }

    if (timerRef.current.getState().isRunning || timerRef.current.getState().countdownActive) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, []);

  const handleSetMode = useCallback((newMode: TimerMode) => {
    localStorage.setItem(STORAGE_KEYS.LAST_MODE, newMode);
    setMode(newMode);
    timerRef.current = TimerFactory.createTimer(newMode);
    setState(timerRef.current.getState());
  }, []);

  const startTimer = useCallback(
    (targetTime?: number) => {
      timerRef.current.start(targetTime);
      setState(timerRef.current.getState());
      lastUpdateTimeRef.current = 0;
      animationFrameRef.current = requestAnimationFrame(animate);
    },
    [animate],
  );

  const stopTimer = useCallback(() => {
    timerRef.current.stop();
    setState(timerRef.current.getState());

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    lastUpdateTimeRef.current = 0;
  }, []);

  const resetTimer = useCallback(() => {
    timerRef.current.reset();
    setState(timerRef.current.getState());

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    lastUpdateTimeRef.current = 0;
  }, []);

  useEffect(() => {
    if (state.isRunning || state.countdownActive) {
      lastUpdateTimeRef.current = 0;
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.isRunning, state.countdownActive, animate]);

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
