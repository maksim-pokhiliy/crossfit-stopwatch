import { createContext } from "react";

import { TimerContextType } from "../types/timer";

export const TimerContext = createContext<TimerContextType | null>(null);

TimerContext.displayName = "TimerContext";
