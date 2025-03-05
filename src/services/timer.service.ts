import { BaseTimer } from "../models/base-timer";
import { TimerFactory } from "../models/timer-factory";
import { TimerMode } from "../types/timer";

import { audioService } from "./audio.service";
import { soundManager } from "./sound-manager";

export class TimerService {
  private timer: BaseTimer;

  constructor(mode: TimerMode) {
    this.timer = TimerFactory.createTimer(mode);
  }

  getTimer(): BaseTimer {
    return this.timer;
  }

  getState() {
    return this.timer.getState();
  }

  setMode(mode: TimerMode) {
    this.timer = TimerFactory.createTimer(mode);
  }

  start(targetTime?: number) {
    if (!this.timer.canStart()) {
      return;
    }

    this.timer.start(targetTime);
    audioService.initialize();

    if (!this.timer.getState().countdownActive) {
      soundManager.update(this.timer.getState());
    }
  }

  stop() {
    this.timer.stop();
  }

  reset() {
    this.timer.reset();
  }

  setCountdownDuration(duration: number) {
    this.timer.setCountdownDuration(duration);
  }

  setTargetTime(time: number) {
    this.timer.setTargetTime(time);
  }

  update() {
    this.timer.update();
    soundManager.update(this.timer.getState());
  }
}
