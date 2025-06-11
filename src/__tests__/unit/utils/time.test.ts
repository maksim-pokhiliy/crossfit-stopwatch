import { describe, expect, test } from "vitest";

import { formatTimeLong, formatTimeShort } from "@app/utils/time";

describe("Time utilities", () => {
  describe("formatTimeLong", () => {
    test("should format zero milliseconds correctly", () => {
      expect(formatTimeLong(0)).toBe("00:00:00:00");
    });

    test("should format seconds correctly", () => {
      expect(formatTimeLong(1000)).toBe("00:00:01:00");
      expect(formatTimeLong(30000)).toBe("00:00:30:00");
      expect(formatTimeLong(59000)).toBe("00:00:59:00");
    });

    test("should format minutes correctly", () => {
      expect(formatTimeLong(60000)).toBe("00:01:00:00");
      expect(formatTimeLong(61000)).toBe("00:01:01:00");
      expect(formatTimeLong(3540000)).toBe("00:59:00:00");
    });

    test("should format hours correctly", () => {
      expect(formatTimeLong(3600000)).toBe("01:00:00:00");
      expect(formatTimeLong(3661000)).toBe("01:01:01:00");
      expect(formatTimeLong(7322500)).toBe("02:02:02:50");
    });

    test("should format milliseconds correctly", () => {
      expect(formatTimeLong(100)).toBe("00:00:00:10");
      expect(formatTimeLong(999)).toBe("00:00:00:99");
      expect(formatTimeLong(1500)).toBe("00:00:01:50");
    });
  });

  describe("formatTimeShort", () => {
    test("should format without hours when time is less than an hour", () => {
      expect(formatTimeShort(0)).toBe("00:00:00");
      expect(formatTimeShort(1000)).toBe("00:01:00");
      expect(formatTimeShort(61000)).toBe("01:01:00");
    });

    test("should include hours when time is an hour or more", () => {
      expect(formatTimeShort(3600000)).toBe("01:00:00:00");
      expect(formatTimeShort(3661000)).toBe("01:01:01:00");
    });

    test("should handle edge cases", () => {
      expect(formatTimeShort(59999)).toBe("00:59:99");
      expect(formatTimeShort(3599999)).toBe("59:59:99");
    });
  });
});
