import { act, render, renderHook } from "@testing-library/react";
import { Mock, afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useTimerContext } from "../hooks/use-timer-context";
import { BaseTimer } from "../models/base-timer";
import { TimerFactory } from "../models/timer-factory";

import { TimerProvider } from "./timer-provider";

// Мокаем requestAnimationFrame и cancelAnimationFrame
window.requestAnimationFrame = vi.fn();
window.cancelAnimationFrame = vi.fn();

describe("TimerProvider", () => {
  let mockTimer: BaseTimer;

  beforeEach(() => {
    vi.clearAllMocks();

    mockTimer = {
      getState: vi.fn().mockReturnValue({
        isRunning: false,
        countdownActive: false,
        elapsedTime: 0,
        countdownDuration: 0,
      }),
      start: vi.fn(),
      stop: vi.fn(),
      reset: vi.fn(),
      update: vi.fn(),
    } as unknown as BaseTimer;

    vi.spyOn(TimerFactory, "createTimer").mockReturnValue(mockTimer);
    vi.spyOn(TimerFactory, "getLastMode").mockReturnValue("forTime");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with default timer", () => {
    const { result } = renderHook(() => useTimerContext(), {
      wrapper: TimerProvider,
    });

    expect(TimerFactory.createTimer).toHaveBeenCalledWith("forTime");
    expect(result.current.currentTimer).toBe(mockTimer);
    expect(result.current.state).toEqual({
      isRunning: false,
      countdownActive: false,
      elapsedTime: 0,
      countdownDuration: 0,
    });
  });

  it("should change timer mode", () => {
    const { result } = renderHook(() => useTimerContext(), {
      wrapper: TimerProvider,
    });

    act(() => {
      result.current.setMode("amrap");
    });

    expect(TimerFactory.createTimer).toHaveBeenCalledWith("amrap");
  });

  it("should start timer", () => {
    const { result } = renderHook(() => useTimerContext(), {
      wrapper: TimerProvider,
    });

    act(() => {
      result.current.startTimer(300000);
    });

    expect(mockTimer.start).toHaveBeenCalledWith(300000);
  });

  it("should stop timer", () => {
    const { result } = renderHook(() => useTimerContext(), {
      wrapper: TimerProvider,
    });

    act(() => {
      result.current.stopTimer();
    });

    expect(mockTimer.stop).toHaveBeenCalled();
  });

  it("should reset timer", () => {
    const { result } = renderHook(() => useTimerContext(), {
      wrapper: TimerProvider,
    });

    act(() => {
      result.current.resetTimer();
    });

    expect(mockTimer.reset).toHaveBeenCalled();
  });

  it("should start animation when timer is running", () => {
    (mockTimer.getState as Mock).mockReturnValue({
      isRunning: true,
      countdownActive: false,
      elapsedTime: 0,
      countdownDuration: 0,
    });

    render(<TimerProvider>{null}</TimerProvider>);

    expect(requestAnimationFrame).toHaveBeenCalled();
  });

  it("should start animation when countdown is active", () => {
    (mockTimer.getState as Mock).mockReturnValue({
      isRunning: false,
      countdownActive: true,
      elapsedTime: 0,
      countdownDuration: 3000,
    });

    render(<TimerProvider>{null}</TimerProvider>);

    expect(requestAnimationFrame).toHaveBeenCalled();
  });

  it("should stop animation when timer is not running and countdown is not active", () => {
    (mockTimer.getState as Mock).mockReturnValue({
      isRunning: false,
      countdownActive: false,
      elapsedTime: 0,
      countdownDuration: 0,
    });

    act(() => {
      render(<TimerProvider>{null}</TimerProvider>);
    });

    expect(requestAnimationFrame).not.toHaveBeenCalled();
  });

  it("should cleanup animation frame on unmount when animation was running", () => {
    (mockTimer.getState as Mock).mockReturnValue({
      isRunning: true,
      countdownActive: false,
      elapsedTime: 0,
      countdownDuration: 0,
    });

    // Устанавливаем значение для animationFrameRef.current до рендера
    (window.requestAnimationFrame as Mock).mockReturnValue(123);

    const { unmount } = render(<TimerProvider>{null}</TimerProvider>);

    act(() => {
      unmount();
    });

    expect(cancelAnimationFrame).toHaveBeenCalledWith(123);
  });

  it("should not cleanup animation frame on unmount when animation was not running", () => {
    (mockTimer.getState as Mock).mockReturnValue({
      isRunning: false,
      countdownActive: false,
      elapsedTime: 0,
      countdownDuration: 0,
    });

    const { unmount } = render(<TimerProvider>{null}</TimerProvider>);

    act(() => {
      unmount();
    });

    expect(cancelAnimationFrame).not.toHaveBeenCalled();
  });

  it("should update timer state during animation", () => {
    // Подготавливаем моки для состояний таймера
    const initialState = {
      isRunning: true,
      countdownActive: false,
      elapsedTime: 0,
      countdownDuration: 0,
    };

    const updatedState = {
      ...initialState,
      elapsedTime: 100,
    };

    (mockTimer.getState as Mock)
      .mockReturnValueOnce(initialState) // Первый вызов при инициализации
      .mockReturnValueOnce(initialState) // Второй вызов при старте анимации
      .mockReturnValueOnce(updatedState); // Третий вызов после update

    let animationCallback: FrameRequestCallback;

    (window.requestAnimationFrame as Mock).mockImplementation((callback) => {
      animationCallback = callback;

      return 123;
    });

    render(<TimerProvider>{null}</TimerProvider>);

    // Запускаем один кадр анимации
    act(() => {
      animationCallback(0);
    });

    expect(mockTimer.update).toHaveBeenCalled();
    expect(mockTimer.getState).toHaveBeenCalled();
  });
});
