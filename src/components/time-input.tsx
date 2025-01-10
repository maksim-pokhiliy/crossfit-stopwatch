import { Box, Chip, Stack, TextField } from "@mui/material";
import { memo, useCallback, useEffect, useState } from "react";

import { TIME, TIMER_CONSTANTS } from "../constants/timer";
import { useTimerContext } from "../hooks/use-timer-context";

export const TimeInput = memo(() => {
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

        const targetTime = value === "" ? 0 : numValue * TIME.MILLISECONDS_IN_MINUTE;

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

  if (state.currentMode !== "amrap" && state.currentMode !== "emom") {
    return null;
  }

  return (
    <Box aria-label='Timer duration settings' role='group'>
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
            "aria-label": "Enter timer duration in minutes",
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

      <Stack
        aria-label='Quick duration presets'
        direction='row'
        role='group'
        sx={{ mt: 1, flexWrap: "wrap", gap: 1 }}
      >
        {[5, 10, 15, 20].map((time) => (
          <Chip
            key={time}
            aria-label={`Set timer to ${time} minutes`}
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
});

TimeInput.displayName = "TimeInput";
