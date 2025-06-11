import { describe, expect, test, beforeEach, afterEach, vi } from "vitest";

import { AmrapTimer } from "@app/models/amrap-timer";
import { EmomTimer } from "@app/models/emom-timer";
import { ForTimeTimer } from "@app/models/for-time-timer";

describe("BaseTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("ForTimeTimer", () => {
    test("should initialize with correct default state", () => {
      const timer = new ForTimeTimer();
      const state = timer.getState();

      expect(state.currentMode).toBe("forTime");
      expect(state.elapsedTime).toBe(0);
      expect(state.isRunning).toBe(false);
      expect(state.isPaused).toBe(false);
      expect(state.targetTime).toBe(0);
      expect(state.currentRound).toBe(1);
      expect(state.countdownActive).toBe(false);
    });

    test("should start timer and count up correctly", () => {
      const timer = new ForTimeTimer();

      timer.setCountdownDuration(0);

      timer.start();
      expect(timer.getState().isRunning).toBe(true);
      expect(timer.getState().startTime).toBeTruthy();

      vi.advanceTimersByTime(5000);
      timer.update();

      expect(timer.getState().elapsedTime).toBe(5000);
    });

    test("should handle countdown before starting", () => {
      const timer = new ForTimeTimer();

      timer.setCountdownDuration(3000);

      timer.start();
      expect(timer.getState().countdownActive).toBe(true);
      expect(timer.getState().isRunning).toBe(false);

      vi.advanceTimersByTime(3000);
      timer.update();

      expect(timer.getState().countdownActive).toBe(false);
      expect(timer.getState().isRunning).toBe(true);
    });

    test("should pause and resume correctly", () => {
      const timer = new ForTimeTimer();

      timer.setCountdownDuration(0);

      timer.start();
      vi.advanceTimersByTime(5000);
      timer.update();

      timer.pause();
      expect(timer.getState().isPaused).toBe(true);
      expect(timer.getState().isRunning).toBe(false);
      expect(timer.getState().elapsedTime).toBe(5000);

      vi.advanceTimersByTime(10000);
      timer.update();
      expect(timer.getState().elapsedTime).toBe(5000);

      timer.resume();
      expect(timer.getState().isPaused).toBe(false);
      expect(timer.getState().isRunning).toBe(true);

      vi.advanceTimersByTime(3000);
      timer.update();
      expect(timer.getState().elapsedTime).toBe(8000);
    });

    test("should stop timer correctly", () => {
      const timer = new ForTimeTimer();

      timer.setCountdownDuration(0);

      timer.start();
      vi.advanceTimersByTime(5000);
      timer.update();

      timer.stop();
      expect(timer.getState().isRunning).toBe(false);
      expect(timer.getState().startTime).toBeNull();
      expect(timer.getState().elapsedTime).toBe(5000);
    });

    test("should reset timer to initial state", () => {
      const timer = new ForTimeTimer();

      timer.setCountdownDuration(0);

      timer.start();
      vi.advanceTimersByTime(5000);
      timer.update();
      timer.stop();

      timer.reset();

      const state = timer.getState();

      expect(state.elapsedTime).toBe(0);
      expect(state.isRunning).toBe(false);
      expect(state.isPaused).toBe(false);
      expect(state.startTime).toBeNull();
      expect(state.currentRound).toBe(1);
    });
  });

  describe("AmrapTimer", () => {
    test("should count down from target time", () => {
      const timer = new AmrapTimer();

      timer.setCountdownDuration(0);

      timer.start(60000);
      expect(timer.getState().targetTime).toBe(60000);

      vi.advanceTimersByTime(10000);
      timer.update();

      expect(timer.getState().elapsedTime).toBe(10000);
      expect(timer.getDisplayTime()).toBe(50000);
    });

    test("should stop when target time is reached", () => {
      const timer = new AmrapTimer();

      timer.setCountdownDuration(0);

      timer.start(5000);
      vi.advanceTimersByTime(6000);
      timer.update();

      expect(timer.getState().isRunning).toBe(false);
    });

    test("should not start without target time", () => {
      const timer = new AmrapTimer();

      timer.start();

      expect(timer.getState().isRunning).toBe(false);
    });
  });

  describe("EmomTimer", () => {
    test("should track rounds correctly", () => {
      const timer = new EmomTimer();

      timer.setCountdownDuration(0);

      timer.start(180000);
      expect(timer.getState().currentRound).toBe(1);

      vi.advanceTimersByTime(60000);
      timer.update();
      expect(timer.getState().currentRound).toBe(2);

      vi.advanceTimersByTime(60000);
      timer.update();
      expect(timer.getState().currentRound).toBe(3);
    });

    test("should display time within current minute", () => {
      const timer = new EmomTimer();

      timer.setCountdownDuration(0);

      timer.start(180000);
      vi.advanceTimersByTime(65000);
      timer.update();

      expect(timer.getDisplayTime()).toBe(5000);
    });

    test("should stop when target time is reached", () => {
      const timer = new EmomTimer();

      timer.setCountdownDuration(0);

      timer.start(120000);
      vi.advanceTimersByTime(125000);
      timer.update();

      expect(timer.getState().isRunning).toBe(false);
    });

    test("should not start without target time", () => {
      const timer = new EmomTimer();

      timer.start();

      expect(timer.getState().isRunning).toBe(false);
    });
  });

  describe("Edge cases", () => {
    test("should handle multiple start calls", () => {
      const timer = new ForTimeTimer();

      timer.setCountdownDuration(0);

      timer.start();

      const firstStartTime = timer.getState().startTime;

      timer.start();
      expect(timer.getState().startTime).toBe(firstStartTime);
    });

    test("should not allow operations during countdown", () => {
      const timer = new ForTimeTimer();

      timer.setCountdownDuration(3000);

      timer.start();
      timer.setCountdownDuration(5000);
      timer.setTargetTime(60000);

      expect(timer.getState().countdownDuration).toBe(3000);
      expect(timer.getState().targetTime).toBe(0);
    });

    test("should handle pause/resume when not running", () => {
      const timer = new ForTimeTimer();

      timer.pause();
      expect(timer.getState().isPaused).toBe(false);

      timer.resume();
      expect(timer.getState().isRunning).toBe(false);
    });
  });
});
