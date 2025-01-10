import { BaseTimer } from "./base-timer";

export class EmomTimer extends BaseTimer {
  private readonly MINUTE_IN_MS = 60000;

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

    return this.state.elapsedTime % this.MINUTE_IN_MS;
  }

  private updateRound(): void {
    const currentMinute = Math.floor(this.state.elapsedTime / this.MINUTE_IN_MS);
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
    const timeInMinute = this.state.elapsedTime % this.MINUTE_IN_MS;

    return timeInMinute >= 50000;
  }

  isLastFiveSeconds(): boolean {
    const timeInMinute = this.state.elapsedTime % this.MINUTE_IN_MS;

    return timeInMinute >= 55000;
  }
}
