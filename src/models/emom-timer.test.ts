import { describe, expect, it } from "vitest";

import { TIME } from "../constants/timer";
import {
  advanceTime,
  createInitialTimerState,
  mockDateNow,
  mockLocalStorage,
} from "../test-utils/timer-test-utils";

import { EmomTimer } from "./emom-timer";

describe("EmomTimer", () => {
  mockDateNow();
  mockLocalStorage();

  describe("constructor", () => {
    it("should create timer with initial state", () => {
      const timer = new EmomTimer();
      const state = timer.getState();

      expect(state).toEqual(createInitialTimerState("emom"));
    });
  });

  describe("start", () => {
    it("should not start without target time", () => {
      const timer = new EmomTimer();

      timer.start();

      const state = timer.getState();

      expect(state.isRunning).toBe(false);
      expect(state.startTime).toBeNull();
    });

    it("should start countdown with target time", () => {
      const timer = new EmomTimer();

      timer.start(5000);

      const state = timer.getState();

      expect(state.targetTime).toBe(5000);
      expect(state.countdownActive).toBe(true);
    });
  });

  describe("update", () => {
    it("should not update time when timer is not running", () => {
      const timer = new EmomTimer();

      advanceTime(1000);
      timer.update();

      expect(timer.getState().elapsedTime).toBe(0);
    });

    it("should update elapsed time when running", () => {
      const timer = new EmomTimer();

      timer.setCountdownDuration(0);
      timer.start(10000);

      advanceTime(5000);
      timer.update();

      expect(timer.getState().elapsedTime).toBe(5000);
    });

    it("should stop when target time is reached", () => {
      const timer = new EmomTimer();

      timer.setCountdownDuration(0);
      timer.start(5000);

      advanceTime(5000);
      timer.update();

      const state = timer.getState();

      expect(state.isRunning).toBe(false);
      expect(state.elapsedTime).toBe(5000);
    });

    it("should not update elapsed time during countdown", () => {
      const timer = new EmomTimer();

      timer.setCountdownDuration(3000);
      timer.start(10000);

      advanceTime(2000);
      timer.update();

      expect(timer.getState().elapsedTime).toBe(0);
      expect(timer.getState().countdownValue).toBe(1000);
    });

    it("should start counting elapsed time after countdown", () => {
      const timer = new EmomTimer();

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

    it("should update round every minute", () => {
      const timer = new EmomTimer();

      timer.setCountdownDuration(0);
      timer.start(180000); // 3 minutes

      // First minute
      advanceTime(TIME.MILLISECONDS_IN_MINUTE);
      timer.update();
      expect(timer.getState().currentRound).toBe(2);

      // Second minute
      advanceTime(TIME.MILLISECONDS_IN_MINUTE);
      timer.update();
      expect(timer.getState().currentRound).toBe(3);

      // Third minute
      advanceTime(TIME.MILLISECONDS_IN_MINUTE);
      timer.update();
      expect(timer.getState().currentRound).toBe(4);
    });

    it("should not update round during countdown", () => {
      const timer = new EmomTimer();

      timer.setCountdownDuration(3000);
      timer.start(10000);

      advanceTime(TIME.MILLISECONDS_IN_MINUTE);
      timer.update();

      expect(timer.getState().currentRound).toBe(1);
    });
  });

  describe("getDisplayTime", () => {
    it("should return countdown value during countdown", () => {
      const timer = new EmomTimer();

      timer.setCountdownDuration(3000);
      timer.start(10000);

      advanceTime(2000);
      timer.update();

      expect(timer.getDisplayTime()).toBe(1000);
    });

    it("should return time within current minute", () => {
      const timer = new EmomTimer();

      timer.setCountdownDuration(0);
      timer.start(180000); // 3 minutes

      // 30 seconds into first minute
      advanceTime(30000);
      timer.update();
      expect(timer.getDisplayTime()).toBe(30000);

      // 30 seconds into second minute
      advanceTime(TIME.MILLISECONDS_IN_MINUTE);
      timer.update();
      expect(timer.getDisplayTime()).toBe(30000);

      // 45 seconds into third minute
      advanceTime(75000);
      timer.update();
      expect(timer.getDisplayTime()).toBe(45000);
    });
  });

  describe("isLastTenSeconds", () => {
    it("should return true in last 10 seconds of minute", () => {
      const timer = new EmomTimer();

      timer.setCountdownDuration(0);
      timer.start(120000);

      // 51 seconds into minute (9 seconds remaining)
      advanceTime(51000);
      timer.update();

      expect(timer.isLastTenSeconds()).toBe(true);
    });

    it("should return false before last 10 seconds of minute", () => {
      const timer = new EmomTimer();

      timer.setCountdownDuration(0);
      timer.start(120000);

      // 49 seconds into minute (11 seconds remaining)
      advanceTime(49000);
      timer.update();

      expect(timer.isLastTenSeconds()).toBe(false);
    });
  });

  describe("isLastFiveSeconds", () => {
    it("should return true in last 5 seconds of minute", () => {
      const timer = new EmomTimer();

      timer.setCountdownDuration(0);
      timer.start(120000);

      // 56 seconds into minute (4 seconds remaining)
      advanceTime(56000);
      timer.update();

      expect(timer.isLastFiveSeconds()).toBe(true);
    });

    it("should return false before last 5 seconds of minute", () => {
      const timer = new EmomTimer();

      timer.setCountdownDuration(0);
      timer.start(120000);

      // 54 seconds into minute (6 seconds remaining)
      advanceTime(54000);
      timer.update();

      expect(timer.isLastFiveSeconds()).toBe(false);
    });
  });
});
