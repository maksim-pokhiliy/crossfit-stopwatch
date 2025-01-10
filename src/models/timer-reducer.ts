import { TimerAction } from "../types/timer-actions";

import { BaseTimer } from "./base-timer";

export const timerReducer = (timer: BaseTimer, action: TimerAction): void => {
  switch (action.type) {
    case "START_TIMER":
      timer.start(action.targetTime);
      break;

    case "STOP_TIMER":
      timer.stop();
      break;

    case "RESET_TIMER":
      timer.reset();
      break;

    case "SET_COUNTDOWN_DURATION":
      timer.setCountdownDuration(action.duration);
      break;
  }
};
