import { describe, expect, it } from "vitest";

import { mockDateNow, mockLocalStorage } from "../test-utils/timer-test-utils";
import { TimerAction } from "../types/timer-actions";

import { BaseTimer } from "./base-timer";
import { timerReducer } from "./timer-reducer";

class TestTimer extends BaseTimer {
  update(): void {
    this.updateElapsedTime();
  }
}

describe("timerReducer", () => {
  mockDateNow();
  mockLocalStorage();

  describe("START_TIMER", () => {
    it("should start timer without target time", () => {
      const timer = new TestTimer("test");

      // Отключаем обратный отсчет
      timerReducer(timer, { type: "SET_COUNTDOWN_DURATION", duration: 0 });
      timerReducer(timer, { type: "START_TIMER" });

      const state = timer.getState();

      expect(state.isRunning).toBe(true);
      expect(state.targetTime).toBe(0);
    });

    it("should start timer with target time", () => {
      const timer = new TestTimer("test");

      // Отключаем обратный отсчет
      timerReducer(timer, { type: "SET_COUNTDOWN_DURATION", duration: 0 });
      timerReducer(timer, { type: "START_TIMER", targetTime: 5000 });

      const state = timer.getState();

      expect(state.isRunning).toBe(true);
      expect(state.targetTime).toBe(5000);
    });

    it("should start countdown if configured", () => {
      const timer = new TestTimer("test");

      timerReducer(timer, { type: "SET_COUNTDOWN_DURATION", duration: 3000 });
      timerReducer(timer, { type: "START_TIMER", targetTime: 5000 });

      const state = timer.getState();

      expect(state.countdownActive).toBe(true);
      expect(state.isRunning).toBe(false);
      expect(state.targetTime).toBe(5000);
    });
  });

  describe("STOP_TIMER", () => {
    it("should stop running timer", () => {
      const timer = new TestTimer("test");

      // Отключаем обратный отсчет и запускаем таймер
      timerReducer(timer, { type: "SET_COUNTDOWN_DURATION", duration: 0 });
      timerReducer(timer, { type: "START_TIMER" });
      expect(timer.getState().isRunning).toBe(true);

      // Затем останавливаем
      timerReducer(timer, { type: "STOP_TIMER" });

      const state = timer.getState();

      expect(state.isRunning).toBe(false);
      expect(state.startTime).toBeNull();
    });

    it("should do nothing if timer is not running", () => {
      const timer = new TestTimer("test");
      const initialState = timer.getState();

      timerReducer(timer, { type: "STOP_TIMER" });

      expect(timer.getState()).toEqual(initialState);
    });
  });

  describe("RESET_TIMER", () => {
    it("should reset running timer", () => {
      const timer = new TestTimer("test");

      // Отключаем обратный отсчет и запускаем таймер
      timerReducer(timer, { type: "SET_COUNTDOWN_DURATION", duration: 0 });
      timerReducer(timer, { type: "START_TIMER", targetTime: 5000 });

      // Сбрасываем таймер
      timerReducer(timer, { type: "RESET_TIMER" });

      const state = timer.getState();

      expect(state.isRunning).toBe(false);
      expect(state.startTime).toBeNull();
      expect(state.elapsedTime).toBe(0);
      expect(state.targetTime).toBe(0);
      expect(state.currentRound).toBe(1);
    });

    it("should reset stopped timer", () => {
      const timer = new TestTimer("test");

      // Отключаем обратный отсчет, запускаем и останавливаем таймер
      timerReducer(timer, { type: "SET_COUNTDOWN_DURATION", duration: 0 });
      timerReducer(timer, { type: "START_TIMER", targetTime: 5000 });
      timerReducer(timer, { type: "STOP_TIMER" });

      // Сбрасываем таймер
      timerReducer(timer, { type: "RESET_TIMER" });

      const state = timer.getState();

      expect(state.isRunning).toBe(false);
      expect(state.startTime).toBeNull();
      expect(state.elapsedTime).toBe(0);
      expect(state.targetTime).toBe(0);
      expect(state.currentRound).toBe(1);
    });
  });

  describe("SET_COUNTDOWN_DURATION", () => {
    it("should set countdown duration", () => {
      const timer = new TestTimer("test");
      const action: TimerAction = { type: "SET_COUNTDOWN_DURATION", duration: 3000 };

      timerReducer(timer, action);

      const state = timer.getState();

      expect(state.countdownDuration).toBe(3000);
      expect(state.countdownValue).toBe(3000);
    });

    it("should not update countdown duration for running timer", () => {
      const timer = new TestTimer("test");

      // Запускаем таймер
      timerReducer(timer, { type: "SET_COUNTDOWN_DURATION", duration: 0 });
      timerReducer(timer, { type: "START_TIMER" });

      const initialState = timer.getState();

      // Пытаемся изменить длительность обратного отсчета
      timerReducer(timer, { type: "SET_COUNTDOWN_DURATION", duration: 3000 });

      // Состояние не должно измениться
      expect(timer.getState()).toEqual(initialState);
    });
  });
});
