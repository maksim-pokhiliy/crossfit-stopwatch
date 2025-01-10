import { TimerMode } from "../types/timer";

import { AmrapTimer } from "./amrap-timer";
import { BaseTimer } from "./base-timer";
import { EmomTimer } from "./emom-timer";
import { ForTimeTimer } from "./for-time-timer";

export class TimerFactory {
  static createTimer(mode: TimerMode): BaseTimer {
    switch (mode) {
      case "forTime":
        return new ForTimeTimer();
      case "amrap":
        return new AmrapTimer();
      case "emom":
        return new EmomTimer();
      default:
        throw new Error(`Unknown timer mode: ${mode}`);
    }
  }
}
