import { Box, Chip, Stack, TextField, Theme } from "@mui/material";
import { ChangeEvent, FC, memo, useCallback } from "react";

import { TIME } from "../constants/timer";
import { useTimerContext } from "../hooks/use-timer-context";

export const TimeInput: FC = memo(() => {
  const { state, currentTimer, setState } = useTimerContext();

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const minutes = parseInt(value, 10);

      if (!isNaN(minutes)) {
        const targetTime = minutes * TIME.MILLISECONDS_IN_MINUTE;

        currentTimer.setTargetTime(targetTime);
        setState(currentTimer.getState());
      }
    },
    [currentTimer, setState],
  );

  const handleChipClick = useCallback(
    (minutes: number) => {
      const targetTime = minutes * TIME.MILLISECONDS_IN_MINUTE;

      currentTimer.setTargetTime(targetTime);
      setState(currentTimer.getState());
    },
    [currentTimer, setState],
  );

  if (state.currentMode === "forTime") {
    return null;
  }

  return (
    <Box sx={{ width: "100%" }}>
      <TextField
        fullWidth
        disabled={state.isRunning || state.countdownActive}
        label='Duration (minutes)'
        placeholder='Enter duration in minutes'
        size='small'
        type='number'
        value={state.targetTime ? state.targetTime / TIME.MILLISECONDS_IN_MINUTE : ""}
        onChange={handleChange}
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
                backgroundColor: (theme: Theme) => theme.palette.primary.main,
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
