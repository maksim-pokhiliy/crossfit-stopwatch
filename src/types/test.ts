import { Mock } from "vitest";

import { TimerState } from "@app/models/base-timer";
import { TimerMode, Theme } from "@app/types/timer";

export interface TestTimerState extends TimerState {
  startTime: number | null;
  elapsedTime: number;
  isRunning: boolean;
  isPaused: boolean;
  currentMode: TimerMode;
  targetTime: number;
  currentRound: number;
  countdownActive: boolean;
  countdownValue: number;
  countdownDuration: number;
  theme: Theme;
}

export interface MockTimer {
  getState: Mock;
  start: Mock;
  pause: Mock;
  resume: Mock;
  stop: Mock;
  reset: Mock;
  update: Mock;
  getDisplayTime: Mock;
  setCountdownDuration: Mock;
  setTargetTime: Mock;
  canStart: Mock;
}

export interface MockTimerContext {
  state: TestTimerState;
  currentTimer: MockTimer;
  setMode: Mock;
  startTimer: Mock;
  pauseTimer: Mock;
  resumeTimer: Mock;
  stopTimer: Mock;
  resetTimer: Mock;
  setState: Mock;
}

export interface TimerTestBuilder {
  withMode(mode: TimerMode): TimerTestBuilder;
  withTargetTime(time: number): TimerTestBuilder;
  withElapsedTime(time: number): TimerTestBuilder;
  withRunning(running: boolean): TimerTestBuilder;
  withPaused(paused: boolean): TimerTestBuilder;
  withCountdown(active: boolean, duration?: number, value?: number): TimerTestBuilder;
  withRound(round: number): TimerTestBuilder;
  withTheme(theme: Theme): TimerTestBuilder;
  build(): TestTimerState;
}

export interface ContextTestBuilder {
  withState(state: Partial<TestTimerState>): ContextTestBuilder;
  withMockTimer(timer: Partial<MockTimer>): ContextTestBuilder;
  build(): MockTimerContext;
}
