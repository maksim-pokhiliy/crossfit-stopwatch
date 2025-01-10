import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

import { ForTimeTimer } from "../for-time-timer";

describe("ForTimeTimer", () => {
  let timer: ForTimeTimer;
  const mockDate = new Date(2023, 0, 1, 12, 0, 0);

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    localStorage.clear();
    timer = new ForTimeTimer();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("initialization", () => {
    it("should initialize with correct mode", () => {
      expect(timer.getState().currentMode).toBe("forTime");
    });
  });

  describe("update", () => {
    it("should not update if timer is not running", () => {
      const initialState = timer.getState();

      timer.update();
      expect(timer.getState()).toEqual(initialState);
    });

    it("should update elapsed time when running", () => {
      timer.setCountdownDuration(0);
      timer.start();
      jest.advanceTimersByTime(1000);
      timer.update();
      expect(timer.getState().elapsedTime).toBe(1000);
    });

    it("should continue counting up indefinitely", () => {
      timer.setCountdownDuration(0);
      timer.start();

      // Advance 1 hour
      jest.advanceTimersByTime(3600000);
      timer.update();
      expect(timer.getState().elapsedTime).toBe(3600000);

      // Advance another hour
      jest.advanceTimersByTime(3600000);
      timer.update();
      expect(timer.getState().elapsedTime).toBe(7200000);
    });

    it("should handle countdown correctly", () => {
      timer.start();
      expect(timer.getState().countdownActive).toBe(true);

      jest.advanceTimersByTime(3000);
      timer.update();

      const state = timer.getState();

      expect(state.countdownActive).toBe(false);
      expect(state.isRunning).toBe(true);
      expect(state.elapsedTime).toBe(0);
    });
  });

  describe("getDisplayTime", () => {
    it("should return elapsed time", () => {
      timer.setCountdownDuration(0);
      timer.start();
      jest.advanceTimersByTime(5000);
      timer.update();
      expect(timer.getState().elapsedTime).toBe(5000);
    });

    it("should return countdown value during countdown", () => {
      timer.start();
      jest.advanceTimersByTime(1000);
      timer.update();
      expect(timer.getState().countdownValue).toBe(2000);
    });
  });
});
