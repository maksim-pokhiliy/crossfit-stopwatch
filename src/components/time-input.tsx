import { TextField, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";

import { TIMER_CONSTANTS } from "../constants/timer";
import { useTimerContext } from "../hooks/use-timer-context";

export const TimeInput = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { state, dispatch } = useTimerContext();

  const [minutesInput, setMinutesInput] = useState<string>("");

  useEffect(() => {
    if (!state.isRunning && !state.countdownActive) {
      setMinutesInput("");
    }
  }, [state.isRunning, state.countdownActive, state.currentMode]);

  const handleChange = (value: string) => {
    const numValue = parseInt(value);

    if (
      value === "" ||
      (numValue >= TIMER_CONSTANTS.MIN_MINUTES && numValue <= TIMER_CONSTANTS.MAX_MINUTES)
    ) {
      setMinutesInput(value);
      dispatch({
        type: "SET_TARGET_TIME",
        payload: value === "" ? 0 : numValue * 60000,
      });
    }
  };

  if (state.currentMode !== "amrap" && state.currentMode !== "emom") {
    return null;
  }

  return (
    <TextField
      disabled={state.isRunning || state.countdownActive}
      label='Minutes'
      size='small'
      type='number'
      value={minutesInput}
      slotProps={{
        htmlInput: {
          min: TIMER_CONSTANTS.MIN_MINUTES,
          max: TIMER_CONSTANTS.MAX_MINUTES,
        },
      }}
      sx={{
        width: isMobile ? "100%" : 100,
        "& .MuiOutlinedInput-root": {
          height: 36.5,
        },
        "& input": {
          textAlign: "center",
          fontFamily: "Roboto Mono, monospace",
          "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
          "&[type=number]": {
            MozAppearance: "textfield",
          },
        },
      }}
      onChange={(e) => handleChange(e.target.value)}
    />
  );
};
