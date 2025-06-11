import { BaseTimer } from "../models/base-timer";
import { createTimer } from "../models/timer-factory";
import { TimerMode } from "../types/timer";

import { soundService } from "./sound.service";

export class TimerService {
  private timer: BaseTimer;

  constructor(mode: TimerMode) {
    this.timer = createTimer(mode);
  }

  getTimer(): BaseTimer {
    return this.timer;
  }

  getState() {
    return this.timer.getState();
  }

  setMode(mode: TimerMode) {
    this.timer = createTimer(mode);
  }

  start(targetTime?: number) {
    if (!this.timer.canStart()) {
      return;
    }

    this.timer.start(targetTime);

    soundService.initialize();
  }

  pause() {
    this.timer.pause();
  }

  resume() {
    this.timer.resume();
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
    soundService.playForState(this.timer.getState());
  }
}
