import { vi } from "vitest";

import {
  TestTimerState,
  MockTimer,
  MockTimerContext,
  TimerTestBuilder,
  ContextTestBuilder,
} from "@app/types/test";
import { TimerMode, Theme } from "@app/types/timer";

class TimerStateBuilder implements TimerTestBuilder {
  private state: TestTimerState;

  constructor() {
    this.state = {
      startTime: null,
      elapsedTime: 0,
      isRunning: false,
      isPaused: false,
      currentMode: "forTime",
      targetTime: 0,
      currentRound: 1,
      countdownActive: false,
      countdownValue: 3000,
      countdownDuration: 3000,
      theme: "dark",
    };
  }

  withMode(mode: TimerMode): TimerTestBuilder {
    this.state.currentMode = mode;

    return this;
  }

  withTargetTime(time: number): TimerTestBuilder {
    this.state.targetTime = time;

    return this;
  }

  withElapsedTime(time: number): TimerTestBuilder {
    this.state.elapsedTime = time;

    return this;
  }

  withRunning(running: boolean): TimerTestBuilder {
    this.state.isRunning = running;

    if (running) {
      this.state.startTime = Date.now();
      this.state.isPaused = false;
    }

    return this;
  }

  withPaused(paused: boolean): TimerTestBuilder {
    this.state.isPaused = paused;

    if (paused) {
      this.state.isRunning = false;
      this.state.startTime = null;
    }

    return this;
  }

  withCountdown(active: boolean, duration = 3000, value = 3000): TimerTestBuilder {
    this.state.countdownActive = active;
    this.state.countdownDuration = duration;
    this.state.countdownValue = value;

    return this;
  }

  withRound(round: number): TimerTestBuilder {
    this.state.currentRound = round;

    return this;
  }

  withTheme(theme: Theme): TimerTestBuilder {
    this.state.theme = theme;

    return this;
  }

  build(): TestTimerState {
    return { ...this.state };
  }
}

class TimerContextBuilder implements ContextTestBuilder {
  private context: Partial<MockTimerContext>;

  constructor() {
    this.context = {
      state: new TimerStateBuilder().build(),
      currentTimer: this.createMockTimer(),
      setMode: vi.fn(),
      startTimer: vi.fn(),
      pauseTimer: vi.fn(),
      resumeTimer: vi.fn(),
      stopTimer: vi.fn(),
      resetTimer: vi.fn(),
      setState: vi.fn(),
    };
  }

  private createMockTimer(): MockTimer {
    return {
      update: vi.fn(),
      getDisplayTime: vi.fn().mockReturnValue(0),
      start: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      stop: vi.fn(),
      reset: vi.fn(),
      setCountdownDuration: vi.fn(),
      setTargetTime: vi.fn(),
      canStart: vi.fn().mockReturnValue(true),
      getState: vi.fn(),
    } as MockTimer;
  }

  withState(state: Partial<TestTimerState>): ContextTestBuilder {
    this.context.state = { ...this.context.state!, ...state };

    return this;
  }

  withMockTimer(timer: Partial<MockTimer>): ContextTestBuilder {
    this.context.currentTimer = { ...this.context.currentTimer!, ...timer };

    return this;
  }

  build(): MockTimerContext {
    return this.context as MockTimerContext;
  }
}

export const createTimerState = (): TimerTestBuilder => new TimerStateBuilder();

export const createTimerContext = (): ContextTestBuilder => new TimerContextBuilder();

export const timerStates = {
  idle: () => createTimerState().build(),

  forTimeRunning: () =>
    createTimerState().withMode("forTime").withRunning(true).withElapsedTime(5000).build(),

  amrapWithTarget: (targetTime = 300000) =>
    createTimerState().withMode("amrap").withTargetTime(targetTime).build(),

  emomRunning: (targetTime = 1200000) =>
    createTimerState()
      .withMode("emom")
      .withTargetTime(targetTime)
      .withRunning(true)
      .withElapsedTime(65000)
      .withRound(2)
      .build(),

  paused: () =>
    createTimerState().withMode("forTime").withPaused(true).withElapsedTime(10000).build(),

  countdownActive: () => createTimerState().withCountdown(true, 3000, 2000).build(),
};

export const timerContexts = {
  idle: () => createTimerContext().build(),

  forTimeRunning: () => createTimerContext().withState(timerStates.forTimeRunning()).build(),

  amrapWithTarget: (targetTime?: number) =>
    createTimerContext().withState(timerStates.amrapWithTarget(targetTime)).build(),

  emomRunning: (targetTime?: number) =>
    createTimerContext().withState(timerStates.emomRunning(targetTime)).build(),
};
