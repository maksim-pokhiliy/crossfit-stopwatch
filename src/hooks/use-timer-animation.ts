import { useEffect } from "react";

import { TimerState } from "../models/base-timer";
import { TimerService } from "../services/timer.service";

export const useTimerAnimation = (
  timerService: TimerService,
  setState: (state: TimerState) => void,
) => {
  const animate = () => {
    timerService.update();
    setState(timerService.getState());
    requestAnimationFrame(animate);
  };

  useEffect(() => {
    let frameId: number;
    const currentState = timerService.getState();

    if (currentState.isRunning || currentState.countdownActive) {
      frameId = requestAnimationFrame(animate);
    }

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [timerService, animate]);
};
