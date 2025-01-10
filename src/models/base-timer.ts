import { Theme } from "../types/timer";

export interface TimerState {
  startTime: number | null;
  elapsedTime: number;
  isRunning: boolean;
  currentMode: string;
  targetTime: number;
  currentRound: number;
  countdownActive: boolean;
  countdownValue: number;
  countdownDuration: number;
  theme: Theme;
}

export abstract class BaseTimer {
  protected state: TimerState;

  constructor(mode: string) {
    const savedDuration = localStorage.getItem("countdownDuration");
    const countdownDuration = savedDuration ? parseInt(savedDuration) : 3000;

    this.state = {
      startTime: null,
      elapsedTime: 0,
      isRunning: false,
      currentMode: mode,
      targetTime: 0,
      currentRound: 1,
      countdownActive: false,
      countdownValue: countdownDuration,
      countdownDuration: countdownDuration,
      theme: "dark",
    };
  }

  abstract update(): void;

  getState(): TimerState {
    return { ...this.state };
  }

  start(targetTime?: number): void {
    if (this.state.isRunning || this.state.countdownActive) {
      return;
    }

    if (this.state.countdownDuration > 0) {
      this.state = {
        ...this.state,
        countdownActive: true,
        countdownValue: this.state.countdownDuration,
        targetTime: targetTime ?? this.state.targetTime,
        startTime: Date.now(),
      };
    } else {
      this.state = {
        ...this.state,
        startTime: Date.now(),
        targetTime: targetTime ?? this.state.targetTime,
        isRunning: true,
      };
    }
  }

  stop(): void {
    this.state = {
      ...this.state,
      isRunning: false,
      startTime: null,
      countdownActive: false,
    };
  }

  reset(): void {
    this.state = {
      ...this.state,
      startTime: null,
      elapsedTime: 0,
      isRunning: false,
      currentRound: 1,
      countdownActive: false,
      countdownValue: this.state.countdownDuration,
      targetTime: 0,
    };
  }

  setCountdownDuration(duration: number): void {
    if (this.state.isRunning || this.state.countdownActive) {
      return;
    }

    localStorage.setItem("countdownDuration", duration.toString());

    this.state = {
      ...this.state,
      countdownDuration: duration,
      countdownValue: duration,
    };
  }

  setTargetTime(time: number): void {
    if (this.state.isRunning || this.state.countdownActive) {
      return;
    }

    this.state = {
      ...this.state,
      targetTime: time,
    };
  }

  protected updateElapsedTime(): void {
    if (!this.state.startTime) {
      return;
    }

    if (this.state.countdownActive) {
      const now = Date.now();
      const elapsed = now - this.state.startTime;

      this.state.countdownValue = Math.max(0, this.state.countdownDuration - elapsed);

      if (this.state.countdownValue === 0) {
        this.state = {
          ...this.state,
          countdownActive: false,
          isRunning: true,
          startTime: Date.now(),
          elapsedTime: 0,
        };
      }
    } else if (this.state.isRunning) {
      this.state.elapsedTime = Date.now() - this.state.startTime;
    }
  }
}