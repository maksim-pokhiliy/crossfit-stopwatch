import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

import { AmrapTimer } from "../amrap-timer";

describe("AmrapTimer", () => {
  let timer: AmrapTimer;
  const mockDate = new Date(2023, 0, 1, 12, 0, 0);

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    localStorage.clear();
    timer = new AmrapTimer();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("initialization", () => {
    it("should initialize with correct mode", () => {
      expect(timer.getState().currentMode).toBe("amrap");
    });
  });

  describe("start", () => {
    it("should not start without target time", () => {
      timer.start();
      expect(timer.getState().isRunning).toBe(false);
      expect(timer.getState().countdownActive).toBe(false);
    });

    it("should start with target time", () => {
      timer.start(300000); // 5 minutes
      expect(timer.getState().targetTime).toBe(300000);
      expect(timer.getState().countdownActive).toBe(true);
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
      timer.start(300000);
      jest.advanceTimersByTime(1000);
      timer.update();
      expect(timer.getState().elapsedTime).toBe(1000);
    });

    it("should stop when target time is reached", () => {
      timer.setCountdownDuration(0);
      timer.start(5000);
      jest.advanceTimersByTime(5000);
      timer.update();

      const state = timer.getState();

      expect(state.isRunning).toBe(false);
      expect(state.elapsedTime).toBe(5000);
    });

    it("should handle countdown correctly", () => {
      timer.start(300000);
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
    it("should return remaining time when running", () => {
      timer.setCountdownDuration(0);
      timer.start(300000); // 5 minutes
      jest.advanceTimersByTime(60000); // 1 minute
      timer.update();
      expect(timer.getDisplayTime()).toBe(240000); // 4 minutes left
    });

    it("should return countdown value during countdown", () => {
      timer.start(300000);
      jest.advanceTimersByTime(1000);
      timer.update();
      expect(timer.getState().countdownValue).toBe(2000);
    });

    it("should not go below zero", () => {
      timer.setCountdownDuration(0);
      timer.start(5000);
      jest.advanceTimersByTime(6000);
      timer.update();
      expect(timer.getDisplayTime()).toBe(0);
    });
  });
});
