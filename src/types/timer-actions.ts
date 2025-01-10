import { TimerMode } from "./timer";

export type StartTimerAction = {
  type: "START_TIMER";
  targetTime?: number;
};

export type StopTimerAction = {
  type: "STOP_TIMER";
};

export type ResetTimerAction = {
  type: "RESET_TIMER";
};

export type SetModeAction = {
  type: "SET_MODE";
  mode: TimerMode;
};

export type SetCountdownDurationAction = {
  type: "SET_COUNTDOWN_DURATION";
  duration: number;
};

export type TimerAction =
  | StartTimerAction
  | StopTimerAction
  | ResetTimerAction
  | SetModeAction
  | SetCountdownDurationAction;
