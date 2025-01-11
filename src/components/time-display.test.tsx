import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TIMER_CONSTANTS } from "../constants/timer";
import { TimerContext } from "../context/timer-context";
import { BaseTimer } from "../models/base-timer";
import { soundService } from "../services/sound.service";
import { TimerContextType } from "../types/timer";

import { TimeDisplay } from "./time-display";

// Мокаем звуковой сервис
vi.mock("../services/sound.service", () => ({
  soundService: {
    initialize: vi.fn(),
    playCountdownSound: vi.fn(),
    playStartSound: vi.fn(),
    playEmomSound: vi.fn(),
  },
}));

// Мокаем useTheme
vi.mock("@mui/material", async () => {
  const actual = await vi.importActual("@mui/material");

  return {
    ...actual,
    useTheme: () => ({
      palette: {
        warning: { main: "#warning" },
        error: { main: "#error" },
        text: { primary: "#primary", secondary: "#secondary" },
      },
    }),
  };
});

class TestTimer extends BaseTimer {
  constructor(state: any) {
    super("test");
    this.state = state;
  }

  update(): void {
    // Пустая реализация для тестов
  }
}

describe("TimeDisplay", () => {
  const renderTimeDisplay = (state: any) => {
    const mockTimer = new TestTimer(state);

    // Мокаем методы таймера
    vi.spyOn(mockTimer, "start").mockImplementation(vi.fn());
    vi.spyOn(mockTimer, "stop").mockImplementation(vi.fn());
    vi.spyOn(mockTimer, "reset").mockImplementation(vi.fn());
    vi.spyOn(mockTimer, "update").mockImplementation(vi.fn());
    vi.spyOn(mockTimer, "setCountdownDuration").mockImplementation(vi.fn());
    vi.spyOn(mockTimer, "setTargetTime").mockImplementation(vi.fn());

    const contextValue: TimerContextType = {
      state,
      currentTimer: mockTimer,
      setMode: vi.fn(),
      startTimer: vi.fn(),
      stopTimer: vi.fn(),
      resetTimer: vi.fn(),
      setState: vi.fn(),
    };

    return render(
      <TimerContext.Provider value={contextValue}>
        <TimeDisplay />
      </TimerContext.Provider>,
    );
  };

  describe("Time formatting", () => {
    it("should format time correctly without hours", () => {
      renderTimeDisplay({
        elapsedTime: 65432, // 1:05.43
        countdownActive: false,
      });

      expect(screen.getByRole("timer")).toHaveTextContent("01:05:43");
    });

    it("should format time correctly with hours", () => {
      renderTimeDisplay({
        elapsedTime: 3661000, // 1:01:01.00
        countdownActive: false,
      });

      expect(screen.getByRole("timer")).toHaveTextContent("01:01:01:00");
    });
  });

  describe("Countdown mode", () => {
    it("should display countdown time with warning color", () => {
      renderTimeDisplay({
        countdownActive: true,
        countdownValue: 3000,
        countdownDuration: 5000,
      });

      const timer = screen.getByRole("timer").querySelector("div");

      expect(timer).toHaveStyle({ color: "#warning" });
      expect(screen.getByText("Get ready!")).toBeInTheDocument();
    });

    it("should play countdown sound", () => {
      renderTimeDisplay({
        countdownActive: true,
        countdownValue: 3000,
      });

      expect(soundService.initialize).toHaveBeenCalled();
      expect(soundService.playCountdownSound).toHaveBeenCalledWith(3);
    });
  });

  describe("EMOM mode", () => {
    it("should display current round", () => {
      renderTimeDisplay({
        currentMode: "emom",
        isRunning: true,
        currentRound: 5,
        elapsedTime: 0,
      });

      expect(screen.getByText("Round 5")).toBeInTheDocument();
    });

    it("should show warning color when approaching minute end", () => {
      renderTimeDisplay({
        currentMode: "emom",
        isRunning: true,
        elapsedTime: TIMER_CONSTANTS.EMOM_WARNING_TIME,
      });

      const timer = screen.getByRole("timer").querySelector("div");

      expect(timer).toHaveStyle({ color: "#warning" });
    });

    it("should show danger color when very close to minute end", () => {
      renderTimeDisplay({
        currentMode: "emom",
        isRunning: true,
        elapsedTime: TIMER_CONSTANTS.EMOM_DANGER_TIME,
      });

      const timer = screen.getByRole("timer").querySelector("div");

      expect(timer).toHaveStyle({ color: "#error" });
    });

    it("should play EMOM sound", () => {
      renderTimeDisplay({
        currentMode: "emom",
        isRunning: true,
        elapsedTime: TIMER_CONSTANTS.EMOM_WARNING_TIME,
      });

      expect(soundService.initialize).toHaveBeenCalled();
      expect(soundService.playEmomSound).toHaveBeenCalledWith(TIMER_CONSTANTS.EMOM_WARNING_TIME);
    });
  });

  describe("Start sound", () => {
    it("should play start sound when timer starts", () => {
      renderTimeDisplay({
        isRunning: true,
        elapsedTime: 0,
        countdownActive: false,
      });

      expect(soundService.initialize).toHaveBeenCalled();
      expect(soundService.playStartSound).toHaveBeenCalled();
    });
  });
});
