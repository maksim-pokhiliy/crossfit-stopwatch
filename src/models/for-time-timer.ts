import { BaseTimer } from "./base-timer";

export class ForTimeTimer extends BaseTimer {
  constructor() {
    super("forTime");
  }

  update(): void {
    if (!this.state.isRunning && !this.state.countdownActive) {
      return;
    }

    this.updateElapsedTime();
  }

  getDisplayTime(): number {
    return this.state.elapsedTime;
  }
}
