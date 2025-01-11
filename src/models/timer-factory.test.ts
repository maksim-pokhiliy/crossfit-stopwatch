import { describe, expect, it } from "vitest";

import { mockLocalStorage } from "../test-utils/timer-test-utils";

import { AmrapTimer } from "./amrap-timer";
import { EmomTimer } from "./emom-timer";
import { ForTimeTimer } from "./for-time-timer";
import { TimerFactory } from "./timer-factory";

describe("TimerFactory", () => {
  mockLocalStorage();

  describe("createTimer", () => {
    it("should create ForTimeTimer for forTime mode", () => {
      const timer = TimerFactory.createTimer("forTime");

      expect(timer).toBeInstanceOf(ForTimeTimer);
    });

    it("should create AmrapTimer for amrap mode", () => {
      const timer = TimerFactory.createTimer("amrap");

      expect(timer).toBeInstanceOf(AmrapTimer);
    });

    it("should create EmomTimer for emom mode", () => {
      const timer = TimerFactory.createTimer("emom");

      expect(timer).toBeInstanceOf(EmomTimer);
    });

    it("should throw error for unknown mode", () => {
      expect(() => TimerFactory.createTimer("unknown" as any)).toThrow(
        "Unknown timer mode: unknown",
      );
    });

    it("should save timer mode to localStorage", () => {
      TimerFactory.createTimer("amrap");
      expect(localStorage.getItem("timerMode")).toBe("amrap");
    });
  });

  describe("getLastMode", () => {
    it("should return last used mode from localStorage", () => {
      localStorage.setItem("timerMode", "amrap");
      expect(TimerFactory.getLastMode()).toBe("amrap");
    });

    it("should return forTime as default if no mode in localStorage", () => {
      localStorage.clear();
      expect(TimerFactory.getLastMode()).toBe("forTime");
    });
  });
});
