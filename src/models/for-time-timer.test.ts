import { describe, expect, it } from "vitest";

import {
  advanceTime,
  createInitialTimerState,
  mockDateNow,
  mockLocalStorage,
} from "../test-utils/timer-test-utils";

import { ForTimeTimer } from "./for-time-timer";

describe("ForTimeTimer", () => {
  mockDateNow();
  mockLocalStorage();

  describe("constructor", () => {
    it("should create timer with initial state", () => {
      const timer = new ForTimeTimer();
      const state = timer.getState();

      expect(state).toEqual(createInitialTimerState("forTime"));
    });
  });

  describe("update", () => {
    it("should not update time when timer is not running", () => {
      const timer = new ForTimeTimer();

      advanceTime(1000);
      timer.update();

      expect(timer.getState().elapsedTime).toBe(0);
    });

    it("should update elapsed time when running", () => {
      const timer = new ForTimeTimer();

      timer.setCountdownDuration(0);
      timer.start();

      advanceTime(5000);
      timer.update();

      expect(timer.getState().elapsedTime).toBe(5000);
    });

    it("should not update elapsed time during countdown", () => {
      const timer = new ForTimeTimer();

      timer.setCountdownDuration(3000);
      timer.start();

      advanceTime(2000);
      timer.update();

      expect(timer.getState().elapsedTime).toBe(0);
      expect(timer.getState().countdownValue).toBe(1000);
    });

    it("should start counting elapsed time after countdown", () => {
      const timer = new ForTimeTimer();

      timer.setCountdownDuration(3000);
      timer.start();

      // Проходит обратный отсчет
      advanceTime(3000);
      timer.update();

      // Таймер работает 5 секунд
      advanceTime(5000);
      timer.update();

      expect(timer.getState().elapsedTime).toBe(5000);
    });
  });

  describe("getDisplayTime", () => {
    it("should return elapsed time", () => {
      const timer = new ForTimeTimer();

      timer.setCountdownDuration(0);
      timer.start();

      advanceTime(5000);
      timer.update();

      expect(timer.getDisplayTime()).toBe(5000);
    });

    it("should return 0 during countdown", () => {
      const timer = new ForTimeTimer();

      timer.setCountdownDuration(3000);
      timer.start();

      advanceTime(2000);
      timer.update();

      expect(timer.getDisplayTime()).toBe(0);
    });
  });
});
