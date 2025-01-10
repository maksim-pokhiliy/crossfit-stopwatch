import { BaseTimer } from "./base-timer";

export class AmrapTimer extends BaseTimer {
  constructor() {
    super("amrap");
  }

  update(): void {
    if (!this.state.isRunning && !this.state.countdownActive) {
      return;
    }

    this.updateElapsedTime();

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

    return Math.max(0, this.state.targetTime - this.state.elapsedTime);
  }

  start(targetTime?: number): void {
    if (!targetTime) {
      return;
    }

    super.start(targetTime);
  }
}
