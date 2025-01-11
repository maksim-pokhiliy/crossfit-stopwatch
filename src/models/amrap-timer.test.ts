import { describe, expect, it } from "vitest";

import {
  advanceTime,
  createInitialTimerState,
  mockDateNow,
  mockLocalStorage,
} from "../test-utils/timer-test-utils";

import { AmrapTimer } from "./amrap-timer";

describe("AmrapTimer", () => {
  mockDateNow();
  mockLocalStorage();

  describe("constructor", () => {
    it("should create timer with initial state", () => {
      const timer = new AmrapTimer();
      const state = timer.getState();

      expect(state).toEqual(createInitialTimerState("amrap"));
    });
  });

  describe("start", () => {
    it("should not start without target time", () => {
      const timer = new AmrapTimer();

      timer.start();

      const state = timer.getState();

      expect(state.isRunning).toBe(false);
      expect(state.startTime).toBeNull();
    });

    it("should start countdown with target time", () => {
      const timer = new AmrapTimer();

      timer.start(5000);

      const state = timer.getState();

      expect(state.targetTime).toBe(5000);
      expect(state.countdownActive).toBe(true);
    });
  });

  describe("update", () => {
    it("should not update time when timer is not running", () => {
      const timer = new AmrapTimer();

      advanceTime(1000);
      timer.update();

      expect(timer.getState().elapsedTime).toBe(0);
    });

    it("should update elapsed time when running", () => {
      const timer = new AmrapTimer();

      timer.setCountdownDuration(0);
      timer.start(10000);

      advanceTime(5000);
      timer.update();

      expect(timer.getState().elapsedTime).toBe(5000);
    });

    it("should stop when target time is reached", () => {
      const timer = new AmrapTimer();

      timer.setCountdownDuration(0);
      timer.start(5000);

      advanceTime(5000);
      timer.update();

      const state = timer.getState();

      expect(state.isRunning).toBe(false);
      expect(state.elapsedTime).toBe(5000);
    });

    it("should not update elapsed time during countdown", () => {
      const timer = new AmrapTimer();

      timer.setCountdownDuration(3000);
      timer.start(10000);

      advanceTime(2000);
      timer.update();

      expect(timer.getState().elapsedTime).toBe(0);
      expect(timer.getState().countdownValue).toBe(1000);
    });

    it("should start counting elapsed time after countdown", () => {
      const timer = new AmrapTimer();

      timer.setCountdownDuration(3000);
      timer.start(10000);

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
    it("should return countdown value during countdown", () => {
      const timer = new AmrapTimer();

      timer.setCountdownDuration(3000);
      timer.start(10000);

      advanceTime(2000);
      timer.update();

      expect(timer.getDisplayTime()).toBe(1000);
    });

    it("should return remaining time when running", () => {
      const timer = new AmrapTimer();

      timer.setCountdownDuration(0);
      timer.start(10000);

      advanceTime(4000);
      timer.update();

      expect(timer.getDisplayTime()).toBe(6000);
    });

    it("should return 0 when target time is reached", () => {
      const timer = new AmrapTimer();

      timer.setCountdownDuration(0);
      timer.start(5000);

      advanceTime(5000);
      timer.update();

      expect(timer.getDisplayTime()).toBe(0);
    });

    it("should not return negative time", () => {
      const timer = new AmrapTimer();

      timer.setCountdownDuration(0);
      timer.start(5000);

      advanceTime(6000);
      timer.update();

      expect(timer.getDisplayTime()).toBe(0);
    });
  });
});
