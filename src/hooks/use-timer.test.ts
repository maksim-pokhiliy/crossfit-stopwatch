import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TimerMode } from "../types/timer";

import { useTimer } from "./use-timer";
import { useTimerContext } from "./use-timer-context";

vi.mock("./use-timer-context", () => ({
  useTimerContext: vi.fn(),
}));

describe("useTimer", () => {
  const mockState = {
    isRunning: false,
    countdownActive: false,
  };

  const mockSetMode = vi.fn();
  const mockStartTimer = vi.fn();
  const mockStopTimer = vi.fn();
  const mockResetTimer = vi.fn();
  const mockCurrentTimer = {};

  beforeEach(() => {
    vi.clearAllMocks();
    (useTimerContext as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      state: mockState,
      currentTimer: mockCurrentTimer,
      setMode: mockSetMode,
      startTimer: mockStartTimer,
      stopTimer: mockStopTimer,
      resetTimer: mockResetTimer,
    });
  });

  it("should return state and currentTimer from context", () => {
    const { result } = renderHook(() => useTimer());

    expect(result.current.state).toBe(mockState);
    expect(result.current.currentTimer).toBe(mockCurrentTimer);
  });

  it("should call setMode when handleSetMode is called", () => {
    const { result } = renderHook(() => useTimer());
    const mode: TimerMode = "amrap";

    act(() => {
      result.current.setMode(mode);
    });

    expect(mockSetMode).toHaveBeenCalledWith(mode);
  });

  it("should call startTimer when handleStartTimer is called and timer is not running", () => {
    const { result } = renderHook(() => useTimer());
    const targetTime = 300;

    act(() => {
      result.current.startTimer(targetTime);
    });

    expect(mockStartTimer).toHaveBeenCalledWith(targetTime);
  });

  it("should not call startTimer when timer is already running", () => {
    (useTimerContext as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      state: { isRunning: true, countdownActive: false },
      startTimer: mockStartTimer,
    });

    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.startTimer(300);
    });

    expect(mockStartTimer).not.toHaveBeenCalled();
  });

  it("should not call startTimer when countdown is active", () => {
    (useTimerContext as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      state: { isRunning: false, countdownActive: true },
      startTimer: mockStartTimer,
    });

    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.startTimer(300);
    });

    expect(mockStartTimer).not.toHaveBeenCalled();
  });

  it("should call stopTimer when handleStopTimer is called", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.stopTimer();
    });

    expect(mockStopTimer).toHaveBeenCalled();
  });

  it("should call resetTimer when handleResetTimer is called", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.resetTimer();
    });

    expect(mockResetTimer).toHaveBeenCalled();
  });
});
