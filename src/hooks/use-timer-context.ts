import { useContext } from "react";

import { TimerContext } from "../context/timer-context";
import { TimerContextType } from "../types/timer";

export const useTimerContext = (): TimerContextType => {
  const context = useContext(TimerContext);

  if (!context) {
    throw new Error("useTimerContext must be used within a TimerProvider");
  }

  return context;
};
