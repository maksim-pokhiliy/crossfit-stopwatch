import { TimerMode } from "../types/timer";

import { AmrapTimer } from "./amrap-timer";
import { BaseTimer } from "./base-timer";
import { EmomTimer } from "./emom-timer";
import { ForTimeTimer } from "./for-time-timer";

const TIMER_MODE_KEY = "timerMode";

export class TimerFactory {
  static createTimer(mode: TimerMode): BaseTimer {
    localStorage.setItem(TIMER_MODE_KEY, mode);

    switch (mode) {
      case "forTime": {
        return new ForTimeTimer();
      }

      case "amrap": {
        return new AmrapTimer();
      }

      case "emom": {
        return new EmomTimer();
      }

      default: {
        throw new Error(`Unknown timer mode: ${mode}`);
      }
    }
  }

  static getLastMode(): TimerMode {
    return (localStorage.getItem(TIMER_MODE_KEY) as TimerMode) || "forTime";
  }
}
