import { useEffect, useCallback } from 'react';

import { TimerMode } from '../types/timer';

import { useTimerContext } from './use-timer-context';

export const useTimer = () => {
  const { state, dispatch } = useTimerContext();

  const setMode = useCallback(
    (mode: TimerMode) => {
      dispatch({ type: 'SET_MODE', payload: mode });
    },
    [dispatch],
  );

  const startTimer = useCallback(
    (targetTime?: number) => {
      if (state.isRunning || state.countdownActive) {
        return;
      }

      dispatch({ type: 'START_TIMER', payload: { targetTime } });
    },
    [dispatch, state.isRunning, state.countdownActive],
  );

  const stopTimer = useCallback(() => {
    dispatch({ type: 'STOP_TIMER' });
  }, [dispatch]);

  const resetTimer = useCallback(() => {
    dispatch({ type: 'RESET_TIMER' });
  }, [dispatch]);

  const updateTimer = useCallback(() => {
    if (state.countdownActive && state.startTime) {
      const now = Date.now();
      const elapsed = now - state.startTime;
      const remaining = Math.max(0, state.countdownDuration - elapsed);

      if (remaining > 0) {
        dispatch({
          type: 'UPDATE_COUNTDOWN',
          payload: remaining,
        });
      } else {
        dispatch({ type: 'FINISH_COUNTDOWN' });
      }
    } else if (state.isRunning && state.startTime) {
      const now = Date.now();
      const newElapsedTime = now - state.startTime;

      if (state.currentMode === 'emom') {
        const currentMinute = Math.floor(newElapsedTime / 60000);
        const currentRound = currentMinute + 1;

        if (currentRound !== state.currentRound) {
          dispatch({
            type: 'UPDATE_TIMER',
            payload: { elapsedTime: newElapsedTime, currentRound },
          });
        } else {
          dispatch({
            type: 'UPDATE_TIMER',
            payload: { elapsedTime: newElapsedTime },
          });
        }

        if (state.targetTime > 0 && newElapsedTime >= state.targetTime) {
          dispatch({ type: 'STOP_TIMER' });
        }
      } else {
        dispatch({
          type: 'UPDATE_TIMER',
          payload: { elapsedTime: newElapsedTime },
        });

        if (
          state.currentMode === 'amrap' &&
          state.targetTime > 0 &&
          newElapsedTime >= state.targetTime
        ) {
          dispatch({ type: 'STOP_TIMER' });
        }
      }
    }
  }, [state, dispatch]);

  useEffect(() => {
    let intervalId: number;

    if ((state.isRunning && state.startTime) || state.countdownActive) {
      intervalId = window.setInterval(updateTimer, 10);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [state.isRunning, state.startTime, state.countdownActive, updateTimer]);

  return {
    state,
    setMode,
    startTimer,
    stopTimer,
    resetTimer,
  };
};
