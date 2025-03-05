import { TIME, TIMER_CONSTANTS } from "../constants/timer";
import { TimerState } from "../models/base-timer";

import { audioService } from "./audio.service";

export class SoundManager {
  playCountdown(state: TimerState) {
    if (state.countdownActive) {
      const seconds = Math.floor(state.countdownValue / TIME.MILLISECONDS_IN_SECOND);

      audioService.playCountdown(seconds);
    }
  }

  playStart(state: TimerState) {
    if (state.isRunning && state.elapsedTime < TIMER_CONSTANTS.START_SOUND_THRESHOLD) {
      audioService.playStart();
    }
  }

  playEmom(state: TimerState) {
    if (state.currentMode === "emom" && state.isRunning) {
      const timeInMinute = state.elapsedTime % TIME.MILLISECONDS_IN_MINUTE;

      audioService.playEmom(timeInMinute);
    }
  }

  update(state: TimerState) {
    this.playCountdown(state);
    this.playStart(state);
    this.playEmom(state);
  }
}

export const soundManager = new SoundManager();
