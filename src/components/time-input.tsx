import { Box, Chip, Stack, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import { TIMER_CONSTANTS } from "../constants/timer";
import { useTimerContext } from "../hooks/use-timer-context";

export const TimeInput = () => {
  const { state, currentTimer, setState } = useTimerContext();
  const [minutesInput, setMinutesInput] = useState<string>("");

  useEffect(() => {
    if (!state.isRunning && !state.countdownActive) {
      setMinutesInput("");
    }
  }, [state.isRunning, state.countdownActive, state.currentMode]);

  const handleChange = useCallback(
    (value: string) => {
      const numValue = parseInt(value);

      if (
        value === "" ||
        (numValue >= TIMER_CONSTANTS.MIN_MINUTES && numValue <= TIMER_CONSTANTS.MAX_MINUTES)
      ) {
        setMinutesInput(value);

        const targetTime = value === "" ? 0 : numValue * 60000;

        currentTimer.setTargetTime(targetTime);
        setState(currentTimer.getState());
      }
    },
    [currentTimer, setState],
  );

  const handleChipClick = useCallback(
    (minutes: number) => {
      if (!state.isRunning && !state.countdownActive) {
        handleChange(minutes.toString());
      }
    },
    [state.isRunning, state.countdownActive, handleChange],
  );

  const commonTimes = [5, 10, 15, 20];

  if (state.currentMode !== "amrap" && state.currentMode !== "emom") {
    return null;
  }

  return (
    <Box>
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
          width: "100%",
          mb: 2,
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

      <Stack direction='row' sx={{ mt: 1, flexWrap: "wrap", gap: 1 }}>
        {commonTimes.map((time) => (
          <Chip
            key={time}
            disabled={state.isRunning || state.countdownActive}
            label={`${time} min`}
            sx={{
              "&:hover": {
                backgroundColor: (theme) => theme.palette.primary.main,
                color: "white",
              },
            }}
            onClick={() => handleChipClick(time)}
          />
        ))}
      </Stack>
    </Box>
  );
};
