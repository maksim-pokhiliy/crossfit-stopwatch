import { useEffect } from "react";

import { TimerState } from "../models/base-timer";
import { TimerService } from "../services/timer.service";

export const useTimerAnimation = (
  timerService: TimerService,
  setState: (state: TimerState) => void,
  state: TimerState,
) => {
  useEffect(() => {
    if (!state.isRunning && !state.countdownActive) {
      return;
    }

    const interval = setInterval(() => {
      timerService.update();
      setState(timerService.getState());
    }, 10);

    return () => {
      clearInterval(interval);
    };
  }, [state.isRunning, state.countdownActive, timerService, setState]);
};
