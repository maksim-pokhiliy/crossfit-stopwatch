import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

import { TIME } from "@app/constants/timer";

import { EmomTimer } from "../emom-timer";

describe("EmomTimer", () => {
  let timer: EmomTimer;
  const mockDate = new Date(2023, 0, 1, 12, 0, 0);

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    localStorage.clear();
    timer = new EmomTimer();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("initialization", () => {
    it("should initialize with correct mode", () => {
      expect(timer.getState().currentMode).toBe("emom");
    });

    it("should initialize with round 1", () => {
      expect(timer.getState().currentRound).toBe(1);
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

    it("should update round every minute", () => {
      timer.setCountdownDuration(0);
      timer.start(300000);

      // First minute
      jest.advanceTimersByTime(TIME.MILLISECONDS_IN_MINUTE);
      timer.update();
      expect(timer.getState().currentRound).toBe(2);

      // Second minute
      jest.advanceTimersByTime(TIME.MILLISECONDS_IN_MINUTE);
      timer.update();
      expect(timer.getState().currentRound).toBe(3);
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
    it("should return time in current minute", () => {
      timer.setCountdownDuration(0);
      timer.start(300000);

      // 1 minute and 30 seconds
      jest.advanceTimersByTime(90000);
      timer.update();

      // Should show 30 seconds
      expect(timer.getDisplayTime()).toBe(30000);
    });

    it("should return countdown value during countdown", () => {
      timer.start(300000);
      jest.advanceTimersByTime(1000);
      timer.update();
      expect(timer.getState().countdownValue).toBe(2000);
    });
  });

  describe("warning states", () => {
    it("should detect last 10 seconds", () => {
      timer.setCountdownDuration(0);
      timer.start(300000);

      // 50 seconds into the minute
      jest.advanceTimersByTime(50000);
      timer.update();
      expect(timer.isLastTenSeconds()).toBe(true);
    });

    it("should detect last 5 seconds", () => {
      timer.setCountdownDuration(0);
      timer.start(300000);

      // 55 seconds into the minute
      jest.advanceTimersByTime(55000);
      timer.update();
      expect(timer.isLastFiveSeconds()).toBe(true);
    });

    it("should reset warning states at the start of each minute", () => {
      timer.setCountdownDuration(0);
      timer.start(300000);

      // 55 seconds into the minute
      jest.advanceTimersByTime(55000);
      timer.update();
      expect(timer.isLastFiveSeconds()).toBe(true);

      // Next minute
      jest.advanceTimersByTime(5000);
      timer.update();
      expect(timer.isLastFiveSeconds()).toBe(false);
    });
  });
});
