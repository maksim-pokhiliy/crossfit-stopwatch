import { Theme } from "../types/timer";

export interface TimerState {
  startTime: number | null;
  elapsedTime: number;
  isRunning: boolean;
  isPaused: boolean;
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
    const countdownDuration = savedDuration ? Math.max(0, parseInt(savedDuration)) : 3000;

    this.state = {
      startTime: null,
      elapsedTime: 0,
      isRunning: false,
      isPaused: false,
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

  canStart(): boolean {
    return !this.state.isRunning && !this.state.countdownActive;
  }

  start(targetTime?: number): void {
    const now = Date.now();

    if (this.state.countdownDuration > 0) {
      this.state = {
        ...this.state,
        countdownActive: true,
        countdownValue: this.state.countdownDuration,
        targetTime: targetTime !== undefined ? Math.max(0, targetTime) : this.state.targetTime,
        startTime: now,
      };
    } else {
      this.state = {
        ...this.state,
        startTime: now,
        targetTime: targetTime !== undefined ? Math.max(0, targetTime) : this.state.targetTime,
        isRunning: true,
      };
    }
  }

  pause(): void {
    if (!this.state.isRunning || this.state.countdownActive) {
      return;
    }

    this.state = {
      ...this.state,
      isRunning: false,
      isPaused: true,
      startTime: null,
    };
  }

  resume(): void {
    if (!this.state.isPaused) {
      return;
    }

    this.state = {
      ...this.state,
      isRunning: true,
      isPaused: false,
      startTime: Date.now(),
    };
  }

  stop(): void {
    if (!this.state.startTime) {
      return;
    }

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
      isPaused: false,
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

    if (duration < 0) {
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

    if (time < 0) {
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

    const now = Date.now();

    if (this.state.countdownActive) {
      const elapsed = now - this.state.startTime;
      const countdownValue = Math.max(0, this.state.countdownDuration - elapsed);

      if (countdownValue === 0) {
        this.state = {
          ...this.state,
          countdownActive: false,
          isRunning: true,
          startTime: now,
          elapsedTime: 0,
        };
      } else {
        this.state = {
          ...this.state,
          countdownValue,
        };
      }
    } else if (this.state.isRunning) {
      const sessionElapsed = now - this.state.startTime;

      this.state = {
        ...this.state,
        elapsedTime: this.state.elapsedTime + sessionElapsed,
        startTime: now,
      };
    }
  }
}
