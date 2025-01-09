import { Dispatch } from "react";

export type TimerMode = "forTime" | "amrap" | "emom";
export type Theme = "light" | "dark";

export interface TimerState {
  startTime: number | null;
  elapsedTime: number;
  isRunning: boolean;
  currentMode: TimerMode;
  targetTime: number;
  currentRound: number;
  countdownActive: boolean;
  countdownValue: number;
  countdownDuration: number;
  theme: Theme;
}

export type TimerAction =
  | { type: "SET_MODE"; payload: TimerMode }
  | { type: "START_TIMER"; payload: { targetTime?: number } }
  | { type: "STOP_TIMER" }
  | { type: "RESET_TIMER" }
  | {
      type: "UPDATE_TIMER";
      payload: { elapsedTime: number; currentRound?: number };
    }
  | { type: "UPDATE_COUNTDOWN"; payload: number }
  | { type: "FINISH_COUNTDOWN" }
  | { type: "SET_THEME"; payload: Theme }
  | { type: "SET_TARGET_TIME"; payload: number }
  | { type: "SET_COUNTDOWN_DURATION"; payload: number };

export interface TimerContextType {
  state: TimerState;
  dispatch: Dispatch<TimerAction>;
}

export interface SoundState {
  isEnabled: boolean;
  volume: number;
}

export interface TimerSettings {
  sound: SoundState;
  vibration: boolean;
  notifications: boolean;
}
