import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

import { BaseTimer } from "../base-timer";

class TestTimer extends BaseTimer {
  update(): void {
    this.updateElapsedTime();
  }
}

describe("BaseTimer", () => {
  let timer: TestTimer;
  const mockDate = new Date(2023, 0, 1, 12, 0, 0);

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    localStorage.clear();
    timer = new TestTimer("test");
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("initialization", () => {
    it("should initialize with default values", () => {
      const state = timer.getState();

      expect(state).toEqual({
        startTime: null,
        elapsedTime: 0,
        isRunning: false,
        currentMode: "test",
        targetTime: 0,
        currentRound: 1,
        countdownActive: false,
        countdownValue: 3000,
        countdownDuration: 3000,
        theme: "dark",
      });
    });

    it("should initialize with saved countdown duration from localStorage", () => {
      localStorage.setItem("countdownDuration", "5000");
      timer = new TestTimer("test");

      const state = timer.getState();

      expect(state.countdownDuration).toBe(5000);
      expect(state.countdownValue).toBe(5000);
    });
  });

  describe("start", () => {
    it("should start timer without countdown", () => {
      timer.setCountdownDuration(0);
      timer.start();

      const state = timer.getState();

      expect(state.isRunning).toBe(true);
      expect(state.startTime).toBe(mockDate.getTime());
      expect(state.countdownActive).toBe(false);
    });

    it("should start timer with countdown", () => {
      timer.start();

      const state = timer.getState();

      expect(state.countdownActive).toBe(true);
      expect(state.countdownValue).toBe(3000);
      expect(state.startTime).toBe(mockDate.getTime());
      expect(state.isRunning).toBe(false);
    });

    it("should not start if already running", () => {
      timer.setCountdownDuration(0);
      timer.start();

      const startTime = timer.getState().startTime;

      jest.advanceTimersByTime(1000);
      timer.start();
      expect(timer.getState().startTime).toBe(startTime);
    });

    it("should set target time when provided", () => {
      timer.start(5000);
      expect(timer.getState().targetTime).toBe(5000);
    });
  });

  describe("stop", () => {
    it("should stop the timer", () => {
      timer.setCountdownDuration(0);
      timer.start();
      timer.stop();

      const state = timer.getState();

      expect(state.isRunning).toBe(false);
      expect(state.startTime).toBeNull();
      expect(state.countdownActive).toBe(false);
    });
  });

  describe("reset", () => {
    it("should reset the timer to initial state", () => {
      timer.setCountdownDuration(0);
      timer.start(5000);
      jest.advanceTimersByTime(1000);
      timer.update();
      timer.reset();

      const state = timer.getState();

      expect(state).toEqual({
        startTime: null,
        elapsedTime: 0,
        isRunning: false,
        currentMode: "test",
        targetTime: 0,
        currentRound: 1,
        countdownActive: false,
        countdownValue: 0,
        countdownDuration: 0,
        theme: "dark",
      });
    });
  });

  describe("setCountdownDuration", () => {
    it("should set countdown duration and save to localStorage", () => {
      timer.setCountdownDuration(5000);
      expect(timer.getState().countdownDuration).toBe(5000);
      expect(timer.getState().countdownValue).toBe(5000);
      expect(localStorage.getItem("countdownDuration")).toBe("5000");
    });

    it("should not set countdown duration if timer is running", () => {
      timer.setCountdownDuration(0);
      timer.start();
      timer.setCountdownDuration(5000);
      expect(timer.getState().countdownDuration).toBe(0);
    });
  });

  describe("setTargetTime", () => {
    it("should set target time", () => {
      timer.setTargetTime(5000);
      expect(timer.getState().targetTime).toBe(5000);
    });

    it("should not set target time if timer is running", () => {
      timer.setCountdownDuration(0);
      timer.start();
      timer.setTargetTime(5000);
      expect(timer.getState().targetTime).toBe(0);
    });
  });

  describe("updateElapsedTime", () => {
    it("should update countdown value during countdown", () => {
      timer.start();
      jest.advanceTimersByTime(1000);
      timer.update();
      expect(timer.getState().countdownValue).toBe(2000);
    });

    it("should switch to running state when countdown reaches zero", () => {
      timer.start();
      jest.advanceTimersByTime(3000);
      timer.update();

      const state = timer.getState();

      expect(state.countdownActive).toBe(false);
      expect(state.isRunning).toBe(true);
      expect(state.elapsedTime).toBe(0);
    });

    it("should update elapsed time when running", () => {
      timer.setCountdownDuration(0);
      timer.start();
      jest.advanceTimersByTime(1000);
      timer.update();
      expect(timer.getState().elapsedTime).toBe(1000);
    });
  });
});
