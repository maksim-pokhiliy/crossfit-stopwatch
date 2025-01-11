import { describe, expect, it } from "vitest";

import {
  advanceTime,
  createInitialTimerState,
  mockDateNow,
  mockLocalStorage,
} from "../test-utils/timer-test-utils";

import { BaseTimer } from "./base-timer";

class TestTimer extends BaseTimer {
  update(): void {
    this.updateElapsedTime();
  }
}

describe("BaseTimer", () => {
  mockDateNow();
  mockLocalStorage();

  describe("constructor", () => {
    it("should create timer with initial state", () => {
      const timer = new TestTimer("forTime");
      const state = timer.getState();

      expect(state).toEqual(createInitialTimerState("forTime"));
    });

    it("should use countdownDuration from localStorage", () => {
      localStorage.setItem("countdownDuration", "5000");

      const timer = new TestTimer("forTime");
      const state = timer.getState();

      expect(state.countdownDuration).toBe(5000);
      expect(state.countdownValue).toBe(5000);
    });
  });

  describe("start", () => {
    it("should start countdown if configured", () => {
      const timer = new TestTimer("forTime");

      timer.start();

      const state = timer.getState();

      expect(state.countdownActive).toBe(true);
      expect(state.isRunning).toBe(false);
      expect(state.startTime).toBe(1000);
    });

    it("should start timer immediately if countdown is disabled", () => {
      const timer = new TestTimer("forTime");

      timer.setCountdownDuration(0);
      timer.start();

      const state = timer.getState();

      expect(state.countdownActive).toBe(false);
      expect(state.isRunning).toBe(true);
      expect(state.startTime).toBe(1000);
    });

    it("should not start if already running", () => {
      const timer = new TestTimer("forTime");

      timer.setCountdownDuration(0);
      timer.start();

      const startTime = timer.getState().startTime;

      advanceTime(1000);
      timer.start();

      const state = timer.getState();

      expect(state.startTime).toBe(startTime);
    });

    it("should set target time if provided", () => {
      const timer = new TestTimer("forTime");

      timer.start(5000);

      const state = timer.getState();

      expect(state.targetTime).toBe(5000);
    });
  });

  describe("stop", () => {
    it("should stop running timer", () => {
      const timer = new TestTimer("forTime");

      timer.setCountdownDuration(0);
      timer.start();

      timer.stop();

      const state = timer.getState();

      expect(state.isRunning).toBe(false);
      expect(state.startTime).toBeNull();
    });

    it("should stop countdown", () => {
      const timer = new TestTimer("forTime");

      timer.start();

      timer.stop();

      const state = timer.getState();

      expect(state.countdownActive).toBe(false);
      expect(state.startTime).toBeNull();
    });
  });

  describe("reset", () => {
    it("should reset timer to initial state", () => {
      const timer = new TestTimer("forTime");

      timer.setCountdownDuration(0);
      timer.start();
      advanceTime(5000);
      timer.update();

      timer.reset();

      const state = timer.getState();

      expect(state.startTime).toBeNull();
      expect(state.elapsedTime).toBe(0);
      expect(state.isRunning).toBe(false);
      expect(state.currentRound).toBe(1);
      expect(state.countdownActive).toBe(false);
      expect(state.targetTime).toBe(0);
    });

    it("should preserve countdown duration after reset", () => {
      const timer = new TestTimer("forTime");

      timer.setCountdownDuration(5000);
      timer.start();
      timer.update();

      timer.reset();

      const state = timer.getState();

      expect(state.countdownDuration).toBe(5000);
      expect(state.countdownValue).toBe(5000);
    });
  });

  describe("setCountdownDuration", () => {
    it("should update countdown duration", () => {
      const timer = new TestTimer("forTime");

      timer.setCountdownDuration(5000);

      const state = timer.getState();

      expect(state.countdownDuration).toBe(5000);
      expect(state.countdownValue).toBe(5000);
    });

    it("should save countdown duration to localStorage", () => {
      const timer = new TestTimer("forTime");

      timer.setCountdownDuration(5000);

      expect(localStorage.getItem("countdownDuration")).toBe("5000");
    });

    it("should not update if timer is running", () => {
      const timer = new TestTimer("forTime");

      timer.setCountdownDuration(0);
      timer.start();

      timer.setCountdownDuration(5000);

      const state = timer.getState();

      expect(state.countdownDuration).toBe(0);
    });

    it("should not update if countdown is active", () => {
      const timer = new TestTimer("forTime");

      timer.start();

      timer.setCountdownDuration(5000);

      const state = timer.getState();

      expect(state.countdownDuration).toBe(3000);
    });
  });

  describe("setTargetTime", () => {
    it("should update target time", () => {
      const timer = new TestTimer("forTime");

      timer.setTargetTime(5000);

      const state = timer.getState();

      expect(state.targetTime).toBe(5000);
    });

    it("should not update if timer is running", () => {
      const timer = new TestTimer("forTime");

      timer.setCountdownDuration(0);
      timer.start();

      timer.setTargetTime(5000);

      const state = timer.getState();

      expect(state.targetTime).toBe(0);
    });

    it("should not update if countdown is active", () => {
      const timer = new TestTimer("forTime");

      timer.start();

      timer.setTargetTime(5000);

      const state = timer.getState();

      expect(state.targetTime).toBe(0);
    });
  });

  describe("updateElapsedTime", () => {
    it("should not update time if timer is not started", () => {
      const timer = new TestTimer("forTime");

      timer.update();

      const state = timer.getState();

      expect(state.elapsedTime).toBe(0);
    });

    it("should update countdown time", () => {
      const timer = new TestTimer("forTime");

      timer.start();

      advanceTime(1000);
      timer.update();

      const state = timer.getState();

      expect(state.countdownValue).toBe(2000);
    });

    it("should switch from countdown to timer", () => {
      const timer = new TestTimer("forTime");

      timer.start();

      advanceTime(3000);
      timer.update();

      const state = timer.getState();

      expect(state.countdownActive).toBe(false);
      expect(state.isRunning).toBe(true);
      expect(state.startTime).toBe(4000);
    });

    it("should update elapsed time when running", () => {
      const timer = new TestTimer("forTime");

      timer.setCountdownDuration(0);
      timer.start();

      advanceTime(1000);
      timer.update();

      const state = timer.getState();

      expect(state.elapsedTime).toBe(1000);
    });
  });

  describe("getState", () => {
    it("should return a copy of state", () => {
      const timer = new TestTimer("forTime");
      const state1 = timer.getState();
      const state2 = timer.getState();

      expect(state1).not.toBe(state2);
      expect(state1).toEqual(state2);
    });

    it("should not allow state mutations to affect timer", () => {
      const timer = new TestTimer("forTime");
      const state = timer.getState();

      state.elapsedTime = 5000;
      state.isRunning = true;

      const newState = timer.getState();

      expect(newState.elapsedTime).toBe(0);
      expect(newState.isRunning).toBe(false);
    });
  });

  describe("edge cases", () => {
    describe("setCountdownDuration", () => {
      it("should not accept negative duration", () => {
        const timer = new TestTimer("forTime");

        timer.setCountdownDuration(-1000);

        const state = timer.getState();

        expect(state.countdownDuration).toBe(3000); // default value
      });

      it("should handle zero duration", () => {
        const timer = new TestTimer("forTime");

        timer.setCountdownDuration(0);

        const state = timer.getState();

        expect(state.countdownDuration).toBe(0);
        expect(state.countdownValue).toBe(0);
      });
    });

    describe("setTargetTime", () => {
      it("should not accept negative target time", () => {
        const timer = new TestTimer("forTime");

        timer.setTargetTime(-1000);

        const state = timer.getState();

        expect(state.targetTime).toBe(0); // default value
      });

      it("should handle zero target time", () => {
        const timer = new TestTimer("forTime");

        timer.setTargetTime(0);

        const state = timer.getState();

        expect(state.targetTime).toBe(0);
      });
    });

    describe("elapsed time", () => {
      it("should handle large time values", () => {
        const timer = new TestTimer("forTime");

        timer.setCountdownDuration(0);
        timer.start();

        advanceTime(Number.MAX_SAFE_INTEGER);
        timer.update();

        const state = timer.getState();

        expect(state.elapsedTime).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER);
        expect(Number.isFinite(state.elapsedTime)).toBe(true);
      });
    });
  });
});
