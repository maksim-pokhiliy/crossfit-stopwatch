import { renderHook } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { TimerContext } from "../context/timer-context";
import { BaseTimer, TimerState } from "../models/base-timer";
import { TimerContextType } from "../types/timer";

import { useTimerContext } from "./use-timer-context";

vi.mock("react", async () => {
  const actual = await vi.importActual("react");

  return {
    ...actual,
    useContext: vi.fn(),
  };
});

describe("useTimerContext", () => {
  const mockState: TimerState = {
    startTime: null,
    elapsedTime: 0,
    isRunning: false,
    currentMode: "amrap",
    targetTime: 0,
    currentRound: 1,
    countdownActive: false,
    countdownValue: 3000,
    countdownDuration: 3000,
    theme: "dark",
  };

  const mockTimer = new (class extends BaseTimer {
    update(): void {}
  })("amrap");

  const mockContext: TimerContextType = {
    state: mockState,
    currentTimer: mockTimer,
    setMode: () => {},
    startTimer: () => {},
    stopTimer: () => {},
    resetTimer: () => {},
    setState: () => {},
  };

  it("should return context when context exists", () => {
    const useContext = vi.spyOn(React, "useContext");

    useContext.mockReturnValue(mockContext);

    const { result } = renderHook(() => useTimerContext());

    expect(result.current).toBe(mockContext);
    expect(useContext).toHaveBeenCalledWith(TimerContext);
  });

  it("should throw error when context is null", () => {
    const useContext = vi.spyOn(React, "useContext");

    useContext.mockReturnValue(null);

    expect(() => {
      renderHook(() => useTimerContext());
    }).toThrow("useTimerContext must be used within a TimerProvider");

    expect(useContext).toHaveBeenCalledWith(TimerContext);
  });
});
