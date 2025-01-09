import { ReactNode, useReducer } from "react";

import { STORAGE_KEYS } from "../constants/timer";
import { TimerAction, TimerState } from "../types/timer";

import { TimerContext, getInitialState } from "./create-timer-context";

const timerReducer = (state: TimerState, action: TimerAction): TimerState => {
  switch (action.type) {
    case "SET_MODE": {
      localStorage.setItem(STORAGE_KEYS.LAST_MODE, action.payload);

      return {
        ...state,
        currentMode: action.payload,
        elapsedTime: 0,
        isRunning: false,
        startTime: null,
        currentRound: 1,
        countdownActive: false,
        countdownValue: state.countdownDuration,
        targetTime: 0,
      };
    }

    case "START_TIMER": {
      return {
        ...state,
        countdownActive: true,
        countdownValue: state.countdownDuration,
        targetTime: action.payload.targetTime ?? state.targetTime,
        startTime: Date.now(),
      };
    }

    case "STOP_TIMER": {
      return {
        ...state,
        isRunning: false,
        startTime: null,
        countdownActive: false,
        countdownValue: state.countdownDuration,
      };
    }

    case "RESET_TIMER": {
      return {
        ...state,
        startTime: null,
        elapsedTime: 0,
        isRunning: false,
        currentRound: 1,
        countdownActive: false,
        countdownValue: state.countdownDuration,
        targetTime: 0,
      };
    }

    case "UPDATE_TIMER": {
      return {
        ...state,
        elapsedTime: action.payload.elapsedTime,
        currentRound: action.payload.currentRound ?? state.currentRound,
      };
    }

    case "UPDATE_COUNTDOWN": {
      return {
        ...state,
        countdownValue: action.payload,
      };
    }

    case "FINISH_COUNTDOWN": {
      return {
        ...state,
        countdownActive: false,
        countdownValue: state.countdownDuration,
        isRunning: true,
        startTime: Date.now(),
      };
    }

    case "SET_THEME": {
      localStorage.setItem(STORAGE_KEYS.THEME, action.payload);

      return {
        ...state,
        theme: action.payload,
      };
    }

    case "SET_TARGET_TIME": {
      return {
        ...state,
        targetTime: action.payload,
      };
    }

    case "SET_COUNTDOWN_DURATION": {
      localStorage.setItem(STORAGE_KEYS.COUNTDOWN_DURATION, action.payload.toString());

      return {
        ...state,
        countdownDuration: action.payload,
        countdownValue: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};

export const TimerProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(timerReducer, getInitialState());

  return <TimerContext.Provider value={{ state, dispatch }}>{children}</TimerContext.Provider>;
};
