import { afterEach, beforeEach, vi } from "vitest";

import { TimerState } from "../models/base-timer";
import { TimerMode } from "../types/timer";

let currentTime = 0;

export const mockDateNow = () => {
  const originalDateNow = Date.now;

  beforeEach(() => {
    currentTime = 1000;
    Date.now = vi.fn(() => currentTime);
  });

  afterEach(() => {
    Date.now = originalDateNow;
  });
};

export const advanceTime = (ms: number) => {
  currentTime += ms;
};

export const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  const mockStorage = {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach((key) => delete store[key]);
    }),
  };

  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: mockStorage,
    });
    mockStorage.clear();
  });

  return mockStorage;
};

export const createInitialTimerState = (mode: TimerMode): TimerState => ({
  startTime: null,
  elapsedTime: 0,
  isRunning: false,
  currentMode: mode,
  targetTime: 0,
  currentRound: 1,
  countdownActive: false,
  countdownValue: 3000,
  countdownDuration: 3000,
  theme: "dark",
});
