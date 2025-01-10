import { BaseTimer, TimerState } from "../models/base-timer";

export type TimerMode = "forTime" | "amrap" | "emom";
export type Theme = "light" | "dark";

export interface TimerContextType {
  state: TimerState;
  currentTimer: BaseTimer;
  setMode: (mode: TimerMode) => void;
  startTimer: (targetTime?: number) => void;
  stopTimer: () => void;
  resetTimer: () => void;
  setState: (state: TimerState) => void;
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
