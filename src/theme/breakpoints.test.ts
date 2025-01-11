import { describe, expect, it } from "vitest";

import { breakpoints, deviceSizes } from "./breakpoints";

describe("breakpoints", () => {
  it("should have correct breakpoint values", () => {
    expect(breakpoints.values).toEqual({
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    });
  });

  it("should be type-safe", () => {
    // Проверяем, что TypeScript не позволит изменить значения
    // @ts-expect-error: values должен быть readonly
    breakpoints.values.xs = 100;
    // @ts-expect-error: values должен быть readonly
    breakpoints.values = {};
  });
});

describe("deviceSizes", () => {
  it("should have correct media queries", () => {
    expect(deviceSizes.mobile).toBe("(max-width: 599px)");
    expect(deviceSizes.tablet).toBe("(min-width: 600px) and (max-width: 899px)");
    expect(deviceSizes.desktop).toBe("(min-width: 900px)");
  });

  it("should be type-safe", () => {
    // Проверяем, что TypeScript не позволит изменить значения
    // @ts-expect-error: deviceSizes должен быть readonly
    deviceSizes.mobile = "(max-width: 500px)";
    // @ts-expect-error: deviceSizes должен быть readonly
    deviceSizes.tablet = "(min-width: 500px)";
  });
});
