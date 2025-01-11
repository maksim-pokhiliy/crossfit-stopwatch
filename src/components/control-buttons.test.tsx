import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TimerContext } from "../context/timer-context";
import { BaseTimer } from "../models/base-timer";
import { soundService } from "../services/sound.service";
import { TimerContextType } from "../types/timer";

import { ControlButtons } from "./control-buttons";

// Мокаем звуковой сервис
vi.mock("../services/sound.service", () => ({
  soundService: {
    initialize: vi.fn(),
  },
}));

class TestTimer extends BaseTimer {
  constructor(state: any) {
    super("test");
    this.state = state;
  }

  update(): void {
    // Пустая реализация для тестов
  }
}

describe("ControlButtons", () => {
  const renderControlButtons = (state: any) => {
    const mockTimer = new TestTimer(state);

    const contextValue: TimerContextType = {
      state,
      currentTimer: mockTimer,
      setMode: vi.fn(),
      startTimer: vi.fn(),
      stopTimer: vi.fn(),
      resetTimer: vi.fn(),
      setState: vi.fn(),
    };

    return {
      ...render(
        <TimerContext.Provider value={contextValue}>
          <ControlButtons />
        </TimerContext.Provider>,
      ),
      contextValue,
    };
  };

  describe("Start button", () => {
    it("should be enabled in forTime mode", () => {
      renderControlButtons({
        currentMode: "forTime",
        isRunning: false,
        countdownActive: false,
      });

      const startButton = screen.getByRole("button", { name: /start forTime timer/i });

      expect(startButton).not.toBeDisabled();
    });

    it("should be disabled when no target time set in AMRAP/EMOM mode", () => {
      renderControlButtons({
        currentMode: "amrap",
        targetTime: 0,
        isRunning: false,
        countdownActive: false,
      });

      const startButton = screen.getByRole("button", { name: /start amrap timer/i });

      expect(startButton).toBeDisabled();
    });

    it("should be disabled when timer is running", () => {
      renderControlButtons({
        currentMode: "forTime",
        isRunning: true,
        countdownActive: false,
      });

      const startButton = screen.getByRole("button", { name: /start forTime timer/i });

      expect(startButton).toBeDisabled();
    });

    it("should be disabled during countdown", () => {
      renderControlButtons({
        currentMode: "forTime",
        isRunning: false,
        countdownActive: true,
      });

      const startButton = screen.getByRole("button", { name: /start forTime timer/i });

      expect(startButton).toBeDisabled();
    });

    it("should initialize sound and start timer when clicked", async () => {
      const { contextValue } = renderControlButtons({
        currentMode: "forTime",
        isRunning: false,
        countdownActive: false,
      });

      const startButton = screen.getByRole("button", { name: /start forTime timer/i });

      await fireEvent.click(startButton);

      expect(soundService.initialize).toHaveBeenCalled();
      expect(contextValue.startTimer).toHaveBeenCalled();
    });

    it("should start timer with target time in AMRAP mode", async () => {
      const targetTime = 300000; // 5 minutes

      const { contextValue } = renderControlButtons({
        currentMode: "amrap",
        targetTime,
        isRunning: false,
        countdownActive: false,
      });

      const startButton = screen.getByRole("button", { name: /start amrap timer/i });

      await fireEvent.click(startButton);

      expect(soundService.initialize).toHaveBeenCalled();
      expect(contextValue.startTimer).toHaveBeenCalledWith(targetTime);
    });
  });

  describe("Stop button", () => {
    it("should be disabled when timer is not running", () => {
      renderControlButtons({
        isRunning: false,
      });

      const stopButton = screen.getByRole("button", { name: /stop timer/i });

      expect(stopButton).toBeDisabled();
    });

    it("should be enabled when timer is running", () => {
      renderControlButtons({
        isRunning: true,
      });

      const stopButton = screen.getByRole("button", { name: /stop timer/i });

      expect(stopButton).not.toBeDisabled();
    });

    it("should initialize sound and stop timer when clicked", async () => {
      const { contextValue } = renderControlButtons({
        isRunning: true,
      });

      const stopButton = screen.getByRole("button", { name: /stop timer/i });

      await fireEvent.click(stopButton);

      expect(soundService.initialize).toHaveBeenCalled();
      expect(contextValue.stopTimer).toHaveBeenCalled();
    });
  });

  describe("Reset button", () => {
    it("should be disabled during countdown", () => {
      renderControlButtons({
        countdownActive: true,
      });

      const resetButton = screen.getByRole("button", { name: /reset timer/i });

      expect(resetButton).toBeDisabled();
    });

    it("should be enabled when not in countdown", () => {
      renderControlButtons({
        countdownActive: false,
      });

      const resetButton = screen.getByRole("button", { name: /reset timer/i });

      expect(resetButton).not.toBeDisabled();
    });

    it("should initialize sound and reset timer when clicked", async () => {
      const { contextValue } = renderControlButtons({
        countdownActive: false,
      });

      const resetButton = screen.getByRole("button", { name: /reset timer/i });

      await fireEvent.click(resetButton);

      expect(soundService.initialize).toHaveBeenCalled();
      expect(contextValue.resetTimer).toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("should have correct ARIA labels", () => {
      renderControlButtons({
        currentMode: "forTime",
        isRunning: false,
        countdownActive: false,
      });

      expect(screen.getByRole("group", { name: "Timer controls" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /start forTime timer/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /stop timer/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /reset timer/i })).toBeInTheDocument();
    });
  });
});
