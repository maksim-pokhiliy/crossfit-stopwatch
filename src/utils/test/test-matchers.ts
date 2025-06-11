import { expect } from "vitest";

import { TimerState } from "@app/models/base-timer";
import { formatTimeLong, formatTimeShort } from "@app/utils/time";

declare module "vitest" {
  interface Assertion<T = any> {
    toBeInTimerState(expectedState: Partial<TimerState>): T;
    toHaveElapsedTime(expectedTime: number, tolerance?: number): T;
    toDisplayTime(expectedFormat: string): T;
    toBeValidTimeFormat(): T;
  }
  interface AsymmetricMatchersContaining {
    toBeInTimerState(expectedState: Partial<TimerState>): any;
    toHaveElapsedTime(expectedTime: number, tolerance?: number): any;
    toDisplayTime(expectedFormat: string): any;
    toBeValidTimeFormat(): any;
  }
}

expect.extend({
  toBeInTimerState(received: TimerState, expectedState: Partial<TimerState>) {
    const failures: string[] = [];

    Object.entries(expectedState).forEach(([key, expectedValue]) => {
      const actualValue = received[key as keyof TimerState];

      if (actualValue !== expectedValue) {
        failures.push(`Expected ${key} to be ${expectedValue}, but received ${actualValue}`);
      }
    });

    return {
      pass: failures.length === 0,
      message: () =>
        failures.length === 0
          ? `Timer state matches expected state`
          : `Timer state mismatch:\n${failures.join("\n")}`,
    };
  },

  toHaveElapsedTime(received: TimerState, expectedTime: number, tolerance = 100) {
    const actualTime = received.elapsedTime;
    const diff = Math.abs(actualTime - expectedTime);
    const withinTolerance = diff <= tolerance;

    return {
      pass: withinTolerance,
      message: () =>
        withinTolerance
          ? `Expected elapsed time not to be ${expectedTime}ms (±${tolerance}ms), but it was ${actualTime}ms`
          : `Expected elapsed time to be ${expectedTime}ms (±${tolerance}ms), but received ${actualTime}ms (diff: ${diff}ms)`,
    };
  },

  toDisplayTime(received: string, expectedFormat: string) {
    const timeRegexes = {
      "HH:MM:SS": /^\d{2}:\d{2}:\d{2}$/,
      "HH:MM:SS:MS": /^\d{2}:\d{2}:\d{2}:\d{2}$/,
      "MM:SS": /^\d{2}:\d{2}$/,
      "MM:SS:MS": /^\d{2}:\d{2}:\d{2}$/,
    };

    const regex = timeRegexes[expectedFormat as keyof typeof timeRegexes];

    if (!regex) {
      return {
        pass: false,
        message: () => `Unknown time format: ${expectedFormat}`,
      };
    }

    const matches = regex.test(received);

    return {
      pass: matches,
      message: () =>
        matches
          ? `Expected "${received}" not to match format ${expectedFormat}`
          : `Expected "${received}" to match format ${expectedFormat}`,
    };
  },

  toBeValidTimeFormat(received: string) {
    const timeFormats = [
      /^\d{2}:\d{2}:\d{2}$/,
      /^\d{2}:\d{2}:\d{2}:\d{2}$/,
      /^\d{1,2}:\d{2}:\d{2}$/,
      /^\d{1,2}:\d{2}:\d{2}:\d{2}$/,
    ];

    const isValid = timeFormats.some((regex) => regex.test(received));

    return {
      pass: isValid,
      message: () =>
        isValid
          ? `Expected "${received}" not to be a valid time format`
          : `Expected "${received}" to be a valid time format`,
    };
  },
});

export const timeMatchers = {
  expectValidTimeFormat: (timeString: string) => {
    expect(timeString).toBeValidTimeFormat();
  },

  expectTimeInRange: (actual: number, expected: number, tolerance = 100) => {
    expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance);
  },

  expectFormattedTime: (milliseconds: number, format: "long" | "short" = "long") => {
    const formatted =
      format === "long" ? formatTimeLong(milliseconds) : formatTimeShort(milliseconds);

    expect(formatted).toBeValidTimeFormat();

    return formatted;
  },
};
