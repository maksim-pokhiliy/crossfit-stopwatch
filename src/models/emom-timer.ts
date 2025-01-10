import { TIME, TIMER_CONSTANTS } from "../constants/timer";

import { BaseTimer } from "./base-timer";

export class EmomTimer extends BaseTimer {
  constructor() {
    super("emom");
  }

  update(): void {
    if (!this.state.isRunning && !this.state.countdownActive) {
      return;
    }

    this.updateElapsedTime();

    if (!this.state.countdownActive) {
      this.updateRound();
    }

    if (
      this.state.isRunning &&
      this.state.targetTime > 0 &&
      this.state.elapsedTime >= this.state.targetTime
    ) {
      this.stop();
    }
  }

  getDisplayTime(): number {
    if (this.state.countdownActive) {
      return this.state.countdownValue;
    }

    return this.state.elapsedTime % TIME.MILLISECONDS_IN_MINUTE;
  }

  private updateRound(): void {
    const currentMinute = Math.floor(this.state.elapsedTime / TIME.MILLISECONDS_IN_MINUTE);
    const newRound = currentMinute + 1;

    if (newRound !== this.state.currentRound) {
      this.state.currentRound = newRound;
    }
  }

  start(targetTime?: number): void {
    if (!targetTime) {
      return;
    }

    super.start(targetTime);
  }

  isLastTenSeconds(): boolean {
    const timeInMinute = this.state.elapsedTime % TIME.MILLISECONDS_IN_MINUTE;

    return timeInMinute >= TIMER_CONSTANTS.EMOM_WARNING_TIME;
  }

  isLastFiveSeconds(): boolean {
    const timeInMinute = this.state.elapsedTime % TIME.MILLISECONDS_IN_MINUTE;

    return timeInMinute >= TIMER_CONSTANTS.EMOM_DANGER_TIME;
  }
}
